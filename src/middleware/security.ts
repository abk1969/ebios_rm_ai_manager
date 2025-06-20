/**
 * 🛡️ MIDDLEWARE DE SÉCURITÉ
 * Protection API, validation, rate limiting, audit
 */

import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult, param, query } from 'express-validator';
import { SecurityService } from '@/services/security/SecurityService';
import { SecureLogger } from '@/services/logging/SecureLogger';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

const securityService = SecurityService.getInstance();
const logger = SecureLogger.getInstance();

// 🔒 CONFIGURATION HELMET SÉCURISÉE
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: [
        "'self'",
        "https://api.gemini.google.com",
        "https://firestore.googleapis.com",
        "https://firebase.googleapis.com",
        "https://identitytoolkit.googleapis.com"
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// 🚦 RATE LIMITING AVANCÉ
export const createRateLimit = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: message || 'Trop de requêtes, veuillez réessayer plus tard.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      logger.warn('Rate limit dépassé', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method
      });
      
      res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Trop de requêtes, veuillez réessayer plus tard.',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    },
    skip: (req: Request) => {
      // Exempter les requêtes d'health check
      return req.path === '/health' || req.path === '/api/health';
    }
  });
};

// Rate limits spécifiques
export const authRateLimit = createRateLimit(15 * 60 * 1000, 5, 'Trop de tentatives de connexion');
export const apiRateLimit = createRateLimit(15 * 60 * 1000, 100);
export const uploadRateLimit = createRateLimit(60 * 60 * 1000, 10, 'Trop d\'uploads');

// 🔐 AUTHENTIFICATION JWT
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Token d\'accès requis',
        code: 'MISSING_TOKEN'
      });
    }

    // Vérifier le token JWT
    const jwtSecret = import.meta.env.VITE_JWT_SECRET || 'dev-jwt-secret-key-not-for-production';
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Valider la session
    const session = await securityService.validateSession(decoded.sessionId);
    
    if (!session) {
      return res.status(401).json({
        error: 'Session invalide ou expirée',
        code: 'INVALID_SESSION'
      });
    }

    // Ajouter les informations de sécurité à la requête
    req.user = {
      userId: session.userId,
      sessionId: session.sessionId,
      roles: session.roles,
      permissions: session.permissions,
      mfaVerified: session.mfaVerified
    };

    req.securityContext = {
      userId: session.userId,
      sessionId: session.sessionId,
      roles: session.roles,
      permissions: session.permissions,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || '',
      timestamp: new Date(),
      mfaVerified: session.mfaVerified
    };

    // Audit de l'accès
    await securityService.logSecurityEvent({
      type: 'authentication',
      action: 'api_access',
      userId: session.userId,
      sessionId: session.sessionId,
      result: 'success',
      severity: 'low',
      timestamp: new Date(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      details: {
        path: req.path,
        method: req.method
      }
    });

    next();
  } catch (error) {
    logger.warn('Échec d\'authentification API', {
      error: error.message,
      ip: req.ip,
      path: req.path,
      userAgent: req.get('User-Agent')
    });

    await securityService.logSecurityEvent({
      type: 'authentication',
      action: 'api_access',
      result: 'failure',
      severity: 'medium',
      timestamp: new Date(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      details: {
        path: req.path,
        method: req.method,
        error: error.message
      }
    });

    return res.status(401).json({
      error: 'Token invalide',
      code: 'INVALID_TOKEN'
    });
  }
};

// 🛡️ AUTORISATION RBAC
export const requirePermission = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.securityContext) {
        return res.status(401).json({
          error: 'Contexte de sécurité manquant',
          code: 'MISSING_SECURITY_CONTEXT'
        });
      }

      const resourceId = req.params.id || req.params.missionId || req.params.reportId;
      const authorized = await securityService.authorize(
        req.securityContext,
        permission.split(':')[0],
        permission.split(':')[1],
        resourceId
      );

      if (!authorized) {
        await securityService.logSecurityEvent({
          type: 'authorization',
          action: 'permission_denied',
          userId: req.securityContext.userId,
          sessionId: req.securityContext.sessionId,
          resource: permission,
          result: 'blocked',
          severity: 'medium',
          timestamp: new Date(),
          ipAddress: req.ip,
          details: {
            requiredPermission: permission,
            userPermissions: req.securityContext.permissions,
            path: req.path,
            method: req.method
          }
        });

        return res.status(403).json({
          error: 'Permission insuffisante',
          code: 'INSUFFICIENT_PERMISSION',
          required: permission
        });
      }

      next();
    } catch (error) {
      logger.error('Erreur lors de la vérification d\'autorisation', {
        permission,
        userId: req.securityContext?.userId,
        error: error.message
      });

      return res.status(500).json({
        error: 'Erreur de vérification d\'autorisation',
        code: 'AUTHORIZATION_ERROR'
      });
    }
  };
};

// 🔒 VALIDATION MFA
export const requireMFA = (req: Request, res: Response, next: NextFunction) => {
  if (!req.securityContext?.mfaVerified) {
    return res.status(403).json({
      error: 'Authentification multifacteur requise',
      code: 'MFA_REQUIRED'
    });
  }
  next();
};

// 📝 VALIDATION DES DONNÉES
export const validateRequest = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Exécuter toutes les validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Validation de requête échouée', {
        errors: errors.array(),
        path: req.path,
        method: req.method,
        userId: req.securityContext?.userId
      });

      return res.status(400).json({
        error: 'Données de requête invalides',
        code: 'VALIDATION_ERROR',
        details: errors.array()
      });
    }

    next();
  };
};

// 🧹 SANITISATION DES DONNÉES
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Supprimer les champs potentiellement dangereux
  const dangerousFields = ['__proto__', 'constructor', 'prototype'];
  
  const sanitizeObject = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (!dangerousFields.includes(key)) {
        sanitized[key] = sanitizeObject(value);
      }
    }
    return sanitized;
  };

  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);

  next();
};

// 🔍 DÉTECTION D'INTRUSION
export const intrusionDetection = async (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /(\<script\>|\<\/script\>)/gi, // XSS
    /(union|select|insert|delete|update|drop|create|alter)/gi, // SQL Injection
    /(\.\.\/|\.\.\\)/g, // Path Traversal
    /(\${|<%|%>)/g, // Template Injection
  ];

  const checkString = JSON.stringify(req.body) + JSON.stringify(req.query) + req.url;
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(checkString)) {
      logger.warn('Tentative d\'intrusion détectée', {
        pattern: pattern.source,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
        userId: req.securityContext?.userId
      });

      await securityService.logSecurityEvent({
        type: 'security',
        action: 'intrusion_attempt',
        userId: req.securityContext?.userId,
        sessionId: req.securityContext?.sessionId,
        result: 'blocked',
        severity: 'high',
        timestamp: new Date(),
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        details: {
          pattern: pattern.source,
          path: req.path,
          method: req.method,
          payload: checkString.substring(0, 500) // Limiter la taille
        }
      });

      return res.status(400).json({
        error: 'Requête suspecte détectée',
        code: 'SUSPICIOUS_REQUEST'
      });
    }
  }

  next();
};

// 📊 AUDIT DES REQUÊTES
export const auditRequest = async (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Intercepter la réponse
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    
    // Audit asynchrone
    setImmediate(async () => {
      try {
        await securityService.logSecurityEvent({
          type: 'dataAccess',
          action: req.method.toLowerCase(),
          userId: req.securityContext?.userId,
          sessionId: req.securityContext?.sessionId,
          resource: req.path,
          result: res.statusCode < 400 ? 'success' : 'failure',
          severity: 'low',
          timestamp: new Date(),
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          details: {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            contentLength: data ? data.length : 0
          }
        });
      } catch (error) {
        logger.error('Erreur lors de l\'audit de requête', {
          error: error.message,
          path: req.path,
          method: req.method
        });
      }
    });

    return originalSend.call(this, data);
  };

  next();
};

// 🔐 CHIFFREMENT DES RÉPONSES SENSIBLES
export const encryptSensitiveResponse = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.securityContext) {
    return next();
  }

  const originalJson = res.json;
  res.json = function(data) {
    // Chiffrer les données sensibles si nécessaire
    if (data && typeof data === 'object' && req.path.includes('/sensitive/')) {
      setImmediate(async () => {
        try {
          const encryptedData = await securityService.encryptSensitiveData(data, req.securityContext!);
          return originalJson.call(this, { encrypted: encryptedData });
        } catch (error) {
          logger.error('Erreur lors du chiffrement de réponse', {
            error: error.message,
            path: req.path
          });
          return originalJson.call(this, data);
        }
      });
    } else {
      return originalJson.call(this, data);
    }
  };

  next();
};

// 🚨 GESTION DES ERREURS DE SÉCURITÉ
export const securityErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Erreur de sécurité', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    userId: req.securityContext?.userId,
    ip: req.ip
  });

  // Audit de l'erreur
  setImmediate(async () => {
    try {
      await securityService.logSecurityEvent({
        type: 'system',
        action: 'security_error',
        userId: req.securityContext?.userId,
        sessionId: req.securityContext?.sessionId,
        result: 'failure',
        severity: 'high',
        timestamp: new Date(),
        ipAddress: req.ip,
        details: {
          error: error.message,
          path: req.path,
          method: req.method
        }
      });
    } catch (auditError) {
      logger.error('Erreur lors de l\'audit d\'erreur de sécurité', {
        originalError: error.message,
        auditError: auditError.message
      });
    }
  });

  // Ne pas exposer les détails d'erreur en production
  const isDevelopment = import.meta.env.DEV;
  
  res.status(500).json({
    error: 'Erreur de sécurité',
    code: 'SECURITY_ERROR',
    message: isDevelopment ? error.message : 'Une erreur de sécurité s\'est produite',
    ...(isDevelopment && { stack: error.stack })
  });
};

// 📋 VALIDATIONS COMMUNES
export const commonValidations = {
  // Validation d'ID
  id: param('id').isUUID().withMessage('ID invalide'),
  
  // Validation d'email
  email: body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  
  // Validation de mot de passe
  password: body('password')
    .isLength({ min: 12 })
    .withMessage('Le mot de passe doit contenir au moins 12 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'),
  
  // Validation de nom de mission
  missionName: body('name')
    .isLength({ min: 3, max: 100 })
    .withMessage('Le nom de la mission doit contenir entre 3 et 100 caractères')
    .matches(/^[a-zA-Z0-9\s\-_À-ÿ]+$/)
    .withMessage('Le nom de la mission contient des caractères invalides'),
  
  // Validation de pagination
  pagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Numéro de page invalide'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limite invalide (1-100)')
  ]
};

// Types TypeScript pour les extensions de Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        sessionId: string;
        roles: string[];
        permissions: string[];
        mfaVerified: boolean;
      };
      securityContext?: {
        userId: string;
        sessionId: string;
        roles: string[];
        permissions: string[];
        ipAddress: string;
        userAgent: string;
        timestamp: Date;
        mfaVerified: boolean;
      };
    }
  }
}
