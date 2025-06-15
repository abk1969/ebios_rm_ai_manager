/**
 * 🔐 SERVICE D'AUTHENTIFICATION AVANCÉ
 * MFA, politique de mots de passe, gestion des sessions sécurisées
 */

import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  TotpMultiFactorGenerator,
  type MultiFactorError,
  type User
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SecureLogger } from '@/services/logging/SecureLogger';
import { TOTP, Secret } from 'otpauth';
import * as QRCode from 'qrcode';
import * as bcrypt from 'bcryptjs';

export interface AuthConfig {
  mfaRequired: Record<string, boolean>;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAge: number;
    historyCount: number;
    lockoutAttempts: number;
    lockoutDuration: number;
  };
  session: {
    maxDuration: number;
    inactivityTimeout: number;
    concurrentSessions: number;
    secureOnly: boolean;
    sameSite: string;
  };
}

export interface AuthResult {
  userId: string;
  sessionId: string;
  roles: string[];
  mfaVerified: boolean;
  token: string;
  expiresAt: Date;
}

export interface MFASetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export class AuthenticationService {
  private logger = SecureLogger.getInstance();
  private config: AuthConfig;
  private activeSessions = new Map<string, any>();
  private failedAttempts = new Map<string, { count: number; lastAttempt: Date; lockedUntil?: Date }>();

  constructor(config: AuthConfig) {
    this.config = config;
    this.startSessionCleanup();
  }

  // 🔐 AUTHENTIFICATION PRINCIPALE
  public async authenticate(credentials: {
    email: string;
    password: string;
    mfaCode?: string;
    ipAddress: string;
    userAgent: string;
  }): Promise<AuthResult> {
    const { email, password, mfaCode, ipAddress, userAgent } = credentials;

    // Vérifier le verrouillage du compte
    await this.checkAccountLockout(email);

    try {
      // Authentification Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Récupérer les données utilisateur
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      if (!userData) {
        throw new Error('Données utilisateur introuvables');
      }

      // Vérifier si l'utilisateur est actif
      if (!userData.isActive) {
        throw new Error('Compte désactivé');
      }

      // Vérifier MFA si requis
      const mfaRequired = this.config.mfaRequired[userData.role] || false;
      let mfaVerified = !mfaRequired;

      if (mfaRequired) {
        if (!mfaCode) {
          throw new Error('Code MFA requis');
        }
        mfaVerified = await this.verifyMFA(user.uid, mfaCode);
        if (!mfaVerified) {
          throw new Error('Code MFA invalide');
        }
      }

      // Créer la session
      const sessionId = this.generateSessionId();
      const session = {
        userId: user.uid,
        sessionId,
        email: user.email,
        roles: [userData.role],
        ipAddress,
        userAgent,
        createdAt: new Date(),
        lastActivity: new Date(),
        mfaVerified,
        expiresAt: new Date(Date.now() + this.config.session.maxDuration)
      };

      // Vérifier les sessions concurrentes
      await this.manageConcurrentSessions(user.uid, sessionId);

      // Stocker la session
      this.activeSessions.set(sessionId, session);
      await this.storeSession(session);

      // Réinitialiser les tentatives échouées
      this.failedAttempts.delete(email);

      // Mettre à jour la dernière connexion
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date(),
        lastLoginIP: ipAddress
      });

      this.logger.info('Authentification réussie', {
        userId: user.uid,
        email: user.email,
        mfaVerified,
        ipAddress
      });

      return {
        userId: user.uid,
        sessionId,
        roles: [userData.role],
        mfaVerified,
        token: await this.generateJWT(session),
        expiresAt: session.expiresAt
      };

    } catch (error) {
      // Enregistrer la tentative échouée
      await this.recordFailedAttempt(email, ipAddress);
      
      this.logger.warn('Échec d\'authentification', {
        email,
        error: error.message,
        ipAddress
      });

      throw error;
    }
  }

  // 🔒 CONFIGURATION MFA
  public async setupMFA(userId: string): Promise<MFASetup> {
    try {
      // Générer un secret TOTP avec otpauth
      const secret = new Secret({ size: 32 });

      const totp = new TOTP({
        issuer: 'EBIOS AI Manager',
        label: `EBIOS AI Manager (${userId})`,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secret
      });

      // Générer le QR Code
      const qrCode = await QRCode.toDataURL(totp.toString());

      // Générer des codes de récupération
      const backupCodes = this.generateBackupCodes();

      // Stocker la configuration MFA (temporaire jusqu'à vérification)
      await setDoc(doc(db, 'mfa_setup', userId), {
        secret: secret.base32,
        backupCodes: backupCodes.map(code => bcrypt.hashSync(code, 10)),
        verified: false,
        createdAt: new Date()
      });

      this.logger.info('Configuration MFA initiée', { userId });

      return {
        secret: secret.base32,
        qrCode,
        backupCodes
      };

    } catch (error) {
      this.logger.error('Erreur lors de la configuration MFA', {
        userId,
        error: error.message
      });
      throw error;
    }
  }

  // ✅ VÉRIFICATION MFA
  public async verifyMFA(userId: string, code: string): Promise<boolean> {
    try {
      // Récupérer la configuration MFA
      const mfaDoc = await getDoc(doc(db, 'mfa_setup', userId));
      if (!mfaDoc.exists()) {
        return false;
      }

      const mfaData = mfaDoc.data();
      
      // Vérifier le code TOTP avec otpauth
      const secret = Secret.fromBase32(mfaData.secret);
      const totp = new TOTP({
        issuer: 'EBIOS AI Manager',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secret
      });

      const delta = totp.validate({ token: code, window: 2 });
      const verified = delta !== null;

      if (verified && !mfaData.verified) {
        // Première vérification réussie - activer MFA
        await updateDoc(doc(db, 'mfa_setup', userId), {
          verified: true,
          verifiedAt: new Date()
        });

        this.logger.info('MFA activé avec succès', { userId });
      }

      return verified;

    } catch (error) {
      this.logger.error('Erreur lors de la vérification MFA', {
        userId,
        error: error.message
      });
      return false;
    }
  }

  // 🔑 VALIDATION DE MOT DE PASSE
  public validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const policy = this.config.passwordPolicy;

    if (password.length < policy.minLength) {
      errors.push(`Le mot de passe doit contenir au moins ${policy.minLength} caractères`);
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une majuscule');
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins une minuscule');
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un chiffre');
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Le mot de passe doit contenir au moins un caractère spécial');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // 🔐 GESTION DES SESSIONS
  public async validateSession(sessionId: string): Promise<any> {
    const session = this.activeSessions.get(sessionId);
    
    if (!session) {
      // Vérifier en base de données
      const sessionDoc = await getDoc(doc(db, 'sessions', sessionId));
      if (!sessionDoc.exists()) {
        throw new Error('Session invalide');
      }
      
      const sessionData = sessionDoc.data();
      if (new Date() > sessionData.expiresAt.toDate()) {
        await this.destroySession(sessionId);
        throw new Error('Session expirée');
      }

      // Vérifier l'inactivité
      const inactivityLimit = new Date(Date.now() - this.config.session.inactivityTimeout);
      if (sessionData.lastActivity.toDate() < inactivityLimit) {
        await this.destroySession(sessionId);
        throw new Error('Session expirée par inactivité');
      }

      // Restaurer la session en mémoire
      this.activeSessions.set(sessionId, sessionData);
      return sessionData;
    }

    // Mettre à jour l'activité
    session.lastActivity = new Date();
    await updateDoc(doc(db, 'sessions', sessionId), {
      lastActivity: session.lastActivity
    });

    return session;
  }

  // 🚪 DÉCONNEXION
  public async logout(sessionId: string): Promise<void> {
    await this.destroySession(sessionId);
    this.logger.info('Déconnexion réussie', { sessionId });
  }

  // 🔒 VERROUILLAGE DE COMPTE
  private async checkAccountLockout(email: string): Promise<void> {
    const attempts = this.failedAttempts.get(email);
    if (!attempts) return;

    if (attempts.lockedUntil && new Date() < attempts.lockedUntil) {
      const remainingTime = Math.ceil((attempts.lockedUntil.getTime() - Date.now()) / 60000);
      throw new Error(`Compte verrouillé. Réessayez dans ${remainingTime} minutes.`);
    }

    if (attempts.lockedUntil && new Date() >= attempts.lockedUntil) {
      // Déverrouiller le compte
      this.failedAttempts.delete(email);
    }
  }

  private async recordFailedAttempt(email: string, ipAddress: string): Promise<void> {
    const attempts = this.failedAttempts.get(email) || { count: 0, lastAttempt: new Date() };
    attempts.count++;
    attempts.lastAttempt = new Date();

    if (attempts.count >= this.config.passwordPolicy.lockoutAttempts) {
      attempts.lockedUntil = new Date(Date.now() + this.config.passwordPolicy.lockoutDuration * 60000);
      
      this.logger.warn('Compte verrouillé après tentatives multiples', {
        email,
        attempts: attempts.count,
        ipAddress,
        lockedUntil: attempts.lockedUntil
      });
    }

    this.failedAttempts.set(email, attempts);
  }

  // 🔧 UTILITAIRES PRIVÉS
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substr(2, 8).toUpperCase());
    }
    return codes;
  }

  private async generateJWT(session: any): Promise<string> {
    // Implémentation JWT sécurisée
    // À implémenter avec une bibliothèque JWT appropriée
    return `jwt_${session.sessionId}`;
  }

  private async storeSession(session: any): Promise<void> {
    await setDoc(doc(db, 'sessions', session.sessionId), session);
  }

  private async destroySession(sessionId: string): Promise<void> {
    this.activeSessions.delete(sessionId);
    // Supprimer de Firestore
    await updateDoc(doc(db, 'sessions', sessionId), {
      active: false,
      destroyedAt: new Date()
    });
  }

  private async manageConcurrentSessions(userId: string, newSessionId: string): Promise<void> {
    const userSessions = await getDocs(
      query(collection(db, 'sessions'), where('userId', '==', userId), where('active', '==', true))
    );

    if (userSessions.size >= this.config.session.concurrentSessions) {
      // Supprimer les sessions les plus anciennes
      const sessions = userSessions.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => a.createdAt.toDate().getTime() - b.createdAt.toDate().getTime());

      const sessionsToRemove = sessions.slice(0, sessions.length - this.config.session.concurrentSessions + 1);
      
      for (const session of sessionsToRemove) {
        await this.destroySession(session.id);
      }
    }
  }

  private startSessionCleanup(): void {
    setInterval(async () => {
      await this.cleanupExpiredSessions();
    }, 5 * 60 * 1000); // Toutes les 5 minutes
  }

  public async cleanupExpiredSessions(): Promise<number> {
    const now = new Date();
    let cleaned = 0;

    // Nettoyer les sessions en mémoire
    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (now > session.expiresAt) {
        await this.destroySession(sessionId);
        cleaned++;
      }
    }

    return cleaned;
  }

  public async lockdownSystem(): Promise<void> {
    // Déconnecter toutes les sessions actives
    for (const sessionId of this.activeSessions.keys()) {
      await this.destroySession(sessionId);
    }

    this.logger.critical('Système verrouillé - toutes les sessions fermées');
  }
}
