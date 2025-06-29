/**
 * 🔒 CONFIGURATION DE SÉCURITÉ EBIOS AI MANAGER
 * Conforme aux exigences ANSSI pour l'homologation
 */

export const SECURITY_CONFIG = {
  // 🔐 AUTHENTIFICATION
  auth: {
    // MFA obligatoire pour les rôles sensibles
    mfaRequired: {
      admin: true,
      auditor: true,
      analyst: true,
      user: false // Optionnel pour les utilisateurs standards
    },
    
    // Politique de mots de passe ANSSI
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90, // jours
      historyCount: 12, // derniers mots de passe interdits
      lockoutAttempts: 5,
      lockoutDuration: 30 // minutes
    },
    
    // Sessions
    session: {
      maxDuration: 8 * 60 * 60 * 1000, // 8 heures
      inactivityTimeout: 30 * 60 * 1000, // 30 minutes
      concurrentSessions: 3,
      secureOnly: true,
      sameSite: 'strict'
    }
  },

  // 🛡️ RBAC (Role-Based Access Control)
  rbac: {
    roles: {
      // Super administrateur
      superadmin: {
        permissions: ['*'],
        description: 'Accès complet au système',
        requiresMFA: true,
        maxSessions: 1
      },
      
      // Administrateur EBIOS
      admin: {
        permissions: [
          'missions:*',
          'users:read',
          'users:create',
          'users:update',
          'reports:*',
          'audit:read',
          'system:configure'
        ],
        description: 'Administration des missions EBIOS',
        requiresMFA: true,
        maxSessions: 2
      },
      
      // Auditeur sécurité
      auditor: {
        permissions: [
          'missions:read',
          'reports:read',
          'audit:read',
          'compliance:*'
        ],
        description: 'Audit et conformité',
        requiresMFA: true,
        maxSessions: 2
      },
      
      // Analyste EBIOS
      analyst: {
        permissions: [
          'missions:read',
          'missions:update',
          'workshops:*',
          'reports:create',
          'reports:read'
        ],
        description: 'Analyse des risques EBIOS',
        requiresMFA: true,
        maxSessions: 3
      },
      
      // Utilisateur standard
      user: {
        permissions: [
          'missions:read:assigned',
          'workshops:read:assigned',
          'reports:read:assigned'
        ],
        description: 'Consultation des missions assignées',
        requiresMFA: false,
        maxSessions: 2
      },
      
      // Invité (lecture seule)
      guest: {
        permissions: [
          'missions:read:public',
          'reports:read:public'
        ],
        description: 'Accès en lecture seule',
        requiresMFA: false,
        maxSessions: 1
      }
    },
    
    // Permissions granulaires
    permissions: {
      'missions:create': 'Créer des missions',
      'missions:read': 'Lire toutes les missions',
      'missions:read:assigned': 'Lire les missions assignées',
      'missions:read:public': 'Lire les missions publiques',
      'missions:update': 'Modifier les missions',
      'missions:delete': 'Supprimer les missions',
      'missions:assign': 'Assigner des missions',
      
      'workshops:create': 'Créer des ateliers',
      'workshops:read': 'Lire tous les ateliers',
      'workshops:read:assigned': 'Lire les ateliers assignés',
      'workshops:update': 'Modifier les ateliers',
      'workshops:delete': 'Supprimer les ateliers',
      
      'users:create': 'Créer des utilisateurs',
      'users:read': 'Lire les profils utilisateurs',
      'users:update': 'Modifier les utilisateurs',
      'users:delete': 'Supprimer des utilisateurs',
      'users:assign-roles': 'Assigner des rôles',
      
      'reports:create': 'Générer des rapports',
      'reports:read': 'Lire tous les rapports',
      'reports:read:assigned': 'Lire les rapports assignés',
      'reports:read:public': 'Lire les rapports publics',
      'reports:export': 'Exporter des rapports',
      
      'audit:read': 'Consulter les logs d\'audit',
      'compliance:read': 'Consulter la conformité',
      'compliance:update': 'Modifier les paramètres de conformité',
      
      'system:configure': 'Configurer le système',
      'system:backup': 'Effectuer des sauvegardes',
      'system:restore': 'Restaurer des sauvegardes'
    }
  },

  // 🔒 CHIFFREMENT
  encryption: {
    // Chiffrement au repos
    atRest: {
      algorithm: 'AES-256-GCM',
      keyRotationDays: 90,
      backupEncryption: true
    },
    
    // Chiffrement en transit
    inTransit: {
      tlsVersion: '1.3',
      cipherSuites: [
        'TLS_AES_256_GCM_SHA384',
        'TLS_CHACHA20_POLY1305_SHA256',
        'TLS_AES_128_GCM_SHA256'
      ],
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    },
    
    // Chiffrement des données sensibles
    sensitiveData: {
      fields: [
        'password',
        'apiKey',
        'token',
        'secret',
        'personalData',
        'financialData',
        'healthData'
      ],
      algorithm: 'AES-256-GCM',
      keyDerivation: 'PBKDF2'
    }
  },

  // 📊 AUDIT ET TRAÇABILITÉ
  audit: {
    // Événements à tracer
    events: {
      authentication: ['login', 'logout', 'failed_login', 'mfa_challenge', 'password_change'],
      authorization: ['permission_denied', 'role_change', 'privilege_escalation'],
      dataAccess: ['read', 'create', 'update', 'delete', 'export'],
      system: ['config_change', 'backup', 'restore', 'maintenance'],
      security: ['security_alert', 'intrusion_attempt', 'anomaly_detected']
    },
    
    // Rétention des logs
    retention: {
      security: 7 * 365, // 7 ans pour les logs de sécurité
      audit: 5 * 365,    // 5 ans pour les logs d'audit
      system: 2 * 365,   // 2 ans pour les logs système
      debug: 30          // 30 jours pour les logs de debug
    },
    
    // Intégrité des logs
    integrity: {
      signing: true,
      hashAlgorithm: 'SHA-256',
      timestamping: true,
      immutable: true
    }
  },

  // 🌐 SÉCURITÉ RÉSEAU
  network: {
    // Rate limiting avancé
    rateLimiting: {
      global: { requests: 1000, window: 60000 }, // 1000 req/min
      auth: { requests: 10, window: 60000 },     // 10 tentatives/min
      api: { requests: 100, window: 60000 },     // 100 req/min
      upload: { requests: 5, window: 60000 }     // 5 uploads/min
    },
    
    // Protection DDoS
    ddosProtection: {
      enabled: true,
      threshold: 100,
      banDuration: 3600000 // 1 heure
    },
    
    // WAF (Web Application Firewall)
    waf: {
      enabled: true,
      rules: ['owasp-top10', 'sql-injection', 'xss', 'csrf'],
      blockMode: true
    }
  },

  // 🔍 MONITORING ET ALERTES
  monitoring: {
    // Métriques de sécurité
    metrics: {
      failedLogins: { threshold: 10, window: 300000 },
      suspiciousActivity: { threshold: 5, window: 600000 },
      dataExfiltration: { threshold: 100, window: 3600000 },
      privilegeEscalation: { threshold: 1, window: 0 }
    },
    
    // Alertes en temps réel
    alerts: {
      channels: ['email', 'sms', 'webhook'],
      severity: {
        critical: { response: 'immediate', escalation: 300 },
        high: { response: '15min', escalation: 900 },
        medium: { response: '1hour', escalation: 3600 },
        low: { response: '24hour', escalation: 86400 }
      }
    }
  },

  // 📋 CONFORMITÉ
  compliance: {
    // Standards de sécurité
    standards: {
      anssi: {
        enabled: true,
        level: 'enhanced',
        controls: ['access-control', 'encryption', 'audit', 'incident-response']
      },
      iso27001: {
        enabled: true,
        controls: ['A.9', 'A.10', 'A.12', 'A.16']
      },
      rgpd: {
        enabled: true,
        controls: ['consent', 'data-protection', 'breach-notification', 'dpo']
      },
      aiAct: {
        enabled: true,
        riskLevel: 'high',
        controls: ['transparency', 'human-oversight', 'accuracy', 'robustness']
      }
    },
    
    // Validation automatique
    validation: {
      frequency: 'daily',
      reports: true,
      remediation: 'automatic'
    }
  }
};

// 🔑 CONFIGURATION DES CLÉS DE CHIFFREMENT
export const ENCRYPTION_KEYS = {
  // Clés maîtres (à stocker dans un HSM en production)
  masterKeys: {
    primary: import.meta.env.VITE_MASTER_KEY_PRIMARY,
    secondary: import.meta.env.VITE_MASTER_KEY_SECONDARY
  },

  // Clés de chiffrement des données
  dataKeys: {
    missions: import.meta.env.VITE_DATA_KEY_MISSIONS,
    users: import.meta.env.VITE_DATA_KEY_USERS,
    reports: import.meta.env.VITE_DATA_KEY_REPORTS
  },

  // Clés de signature
  signingKeys: {
    jwt: import.meta.env.VITE_JWT_SIGNING_KEY,
    audit: import.meta.env.VITE_AUDIT_SIGNING_KEY
  }
};

// 🛡️ CONFIGURATION DE SÉCURITÉ PAR ENVIRONNEMENT
export const getSecurityConfig = (env: string) => {
  const baseConfig = SECURITY_CONFIG;
  
  switch (env) {
    case 'production':
      return {
        ...baseConfig,
        auth: {
          ...baseConfig.auth,
          mfaRequired: {
            admin: true,
            auditor: true,
            analyst: true,
            user: true // MFA obligatoire pour tous en production
          }
        },
        monitoring: {
          ...baseConfig.monitoring,
          alerts: {
            ...baseConfig.monitoring.alerts,
            channels: ['email', 'sms', 'webhook', 'pager']
          }
        }
      };
      
    case 'staging':
      return {
        ...baseConfig,
        audit: {
          ...baseConfig.audit,
          retention: {
            security: 365,
            audit: 180,
            system: 90,
            debug: 7
          }
        }
      };
      
    case 'development':
      return {
        ...baseConfig,
        auth: {
          ...baseConfig.auth,
          passwordPolicy: {
            ...baseConfig.auth.passwordPolicy,
            minLength: 8 // Moins strict en développement
          }
        }
      };
      
    default:
      return baseConfig;
  }
};
