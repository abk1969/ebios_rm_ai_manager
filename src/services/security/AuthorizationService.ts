/**
 * 🛡️ SERVICE D'AUTORISATION RBAC
 * Contrôle d'accès basé sur les rôles avec permissions granulaires
 */

import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SecureLogger } from '@/services/logging/SecureLogger';
import type { SecurityContext } from './SecurityService';

export interface RBACConfig {
  roles: Record<string, {
    permissions: string[];
    description: string;
    requiresMFA: boolean;
    maxSessions: number;
  }>;
  permissions: Record<string, string>;
}

export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface AccessDecision {
  granted: boolean;
  reason: string;
  conditions?: Record<string, any>;
}

export class AuthorizationService {
  private logger = SecureLogger.getInstance();
  private config: RBACConfig;
  private permissionCache = new Map<string, string[]>();
  private cacheExpiry = new Map<string, Date>();

  constructor(config: RBACConfig) {
    this.config = config;
    this.startCacheCleanup();
  }

  // 🔍 VÉRIFICATION DES PERMISSIONS
  public async hasPermission(
    userId: string, 
    permission: string, 
    context?: SecurityContext,
    resourceId?: string
  ): Promise<boolean> {
    try {
      const userPermissions = await this.getUserPermissions(userId);
      
      // Vérification directe de la permission
      if (userPermissions.includes(permission) || userPermissions.includes('*')) {
        return await this.checkConditions(userId, permission, context, resourceId);
      }

      // Vérification des permissions avec wildcards
      const [resource, action] = permission.split(':');
      const wildcardPermissions = [
        `${resource}:*`,
        `*:${action}`,
        '*'
      ];

      for (const wildcardPerm of wildcardPermissions) {
        if (userPermissions.includes(wildcardPerm)) {
          return await this.checkConditions(userId, permission, context, resourceId);
        }
      }

      this.logger.warn('Permission refusée', {
        userId,
        permission,
        userPermissions,
        resourceId
      });

      return false;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('Erreur lors de la vérification des permissions', {
        userId,
        permission,
        error: errorMessage
      });
      return false;
    }
  }

  // 👤 RÉCUPÉRATION DES PERMISSIONS UTILISATEUR
  public async getUserPermissions(userId: string): Promise<string[]> {
    // Vérifier le cache
    const cached = this.permissionCache.get(userId);
    const expiry = this.cacheExpiry.get(userId);
    
    if (cached && expiry && new Date() < expiry) {
      return cached;
    }

    try {
      // Récupérer les données utilisateur
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        throw new Error('Utilisateur introuvable');
      }

      const userData = userDoc.data();
      const userRole = userData.role || 'user';

      // Récupérer les permissions du rôle
      const roleConfig = this.config.roles[userRole];
      if (!roleConfig) {
        throw new Error(`Rôle inconnu: ${userRole}`);
      }

      let permissions = [...roleConfig.permissions];

      // Récupérer les permissions personnalisées
      const customPermissions = userData.customPermissions || [];
      permissions = [...permissions, ...customPermissions];

      // Récupérer les permissions de groupe
      if (userData.groups) {
        for (const groupId of userData.groups) {
          const groupPermissions = await this.getGroupPermissions(groupId);
          permissions = [...permissions, ...groupPermissions];
        }
      }

      // Supprimer les doublons
      permissions = [...new Set(permissions)];

      // Mettre en cache (5 minutes)
      this.permissionCache.set(userId, permissions);
      this.cacheExpiry.set(userId, new Date(Date.now() + 5 * 60 * 1000));

      return permissions;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('Erreur lors de la récupération des permissions', {
        userId,
        error: errorMessage
      });
      return [];
    }
  }

  // 🏢 PERMISSIONS DE GROUPE
  private async getGroupPermissions(groupId: string): Promise<string[]> {
    try {
      const groupDoc = await getDoc(doc(db, 'groups', groupId));
      if (!groupDoc.exists()) {
        return [];
      }

      const groupData = groupDoc.data();
      return groupData.permissions || [];

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('Erreur lors de la récupération des permissions de groupe', {
        groupId,
        error: errorMessage
      });
      return [];
    }
  }

  // 🔒 VÉRIFICATION DES CONDITIONS
  private async checkConditions(
    userId: string,
    permission: string,
    context?: SecurityContext,
    resourceId?: string
  ): Promise<boolean> {
    const [resource, action] = permission.split(':');

    // Conditions spécifiques par ressource
    switch (resource) {
      case 'missions':
        return await this.checkMissionAccess(userId, action, resourceId, context);
      
      case 'workshops':
        return await this.checkWorkshopAccess(userId, action, resourceId, context);
      
      case 'reports':
        return await this.checkReportAccess(userId, action, resourceId, context);
      
      case 'users':
        return await this.checkUserAccess(userId, action, resourceId, context);
      
      default:
        return true; // Pas de conditions spécifiques
    }
  }

  // 📋 CONTRÔLE D'ACCÈS AUX MISSIONS
  private async checkMissionAccess(
    userId: string,
    action: string,
    missionId?: string,
    context?: SecurityContext
  ): Promise<boolean> {
    if (!missionId) return true;

    try {
      const missionDoc = await getDoc(doc(db, 'missions', missionId));
      if (!missionDoc.exists()) {
        return false;
      }

      const missionData = missionDoc.data();

      // Vérifier si l'utilisateur est assigné à la mission
      if (action.includes('assigned')) {
        return missionData.assignedTo?.includes(userId) || false;
      }

      // Vérifier si l'utilisateur est le créateur
      if (missionData.createdBy === userId) {
        return true;
      }

      // Vérifier les permissions d'équipe
      if (missionData.teamMembers?.includes(userId)) {
        return ['read', 'update'].includes(action);
      }

      // Vérifier les missions publiques
      if (action === 'read' && missionData.visibility === 'public') {
        return true;
      }

      return false;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('Erreur lors de la vérification d\'accès à la mission', {
        userId,
        missionId,
        action,
        error: errorMessage
      });
      return false;
    }
  }

  // 🛠️ CONTRÔLE D'ACCÈS AUX ATELIERS
  private async checkWorkshopAccess(
    userId: string,
    action: string,
    workshopId?: string,
    context?: SecurityContext
  ): Promise<boolean> {
    if (!workshopId) return true;

    try {
      const workshopDoc = await getDoc(doc(db, 'workshops', workshopId));
      if (!workshopDoc.exists()) {
        return false;
      }

      const workshopData = workshopDoc.data();
      
      // Vérifier l'accès à la mission parent
      if (workshopData.missionId) {
        return await this.checkMissionAccess(userId, action, workshopData.missionId, context);
      }

      return false;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('Erreur lors de la vérification d\'accès à l\'atelier', {
        userId,
        workshopId,
        action,
        error: errorMessage
      });
      return false;
    }
  }

  // 📊 CONTRÔLE D'ACCÈS AUX RAPPORTS
  private async checkReportAccess(
    userId: string,
    action: string,
    reportId?: string,
    context?: SecurityContext
  ): Promise<boolean> {
    if (!reportId) return true;

    try {
      const reportDoc = await getDoc(doc(db, 'reports', reportId));
      if (!reportDoc.exists()) {
        return false;
      }

      const reportData = reportDoc.data();

      // Vérifier si l'utilisateur est le créateur
      if (reportData.createdBy === userId) {
        return true;
      }

      // Vérifier l'accès à la mission parent
      if (reportData.missionId) {
        return await this.checkMissionAccess(userId, 'read', reportData.missionId, context);
      }

      // Vérifier les rapports publics
      if (action === 'read' && reportData.visibility === 'public') {
        return true;
      }

      return false;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('Erreur lors de la vérification d\'accès au rapport', {
        userId,
        reportId,
        action,
        error: errorMessage
      });
      return false;
    }
  }

  // 👥 CONTRÔLE D'ACCÈS AUX UTILISATEURS
  private async checkUserAccess(
    userId: string,
    action: string,
    targetUserId?: string,
    context?: SecurityContext
  ): Promise<boolean> {
    // L'utilisateur peut toujours accéder à ses propres données
    if (targetUserId === userId) {
      return true;
    }

    // Seuls les admins peuvent gérer les autres utilisateurs
    const userPermissions = await this.getUserPermissions(userId);
    return userPermissions.includes('users:*') || userPermissions.includes('*');
  }

  // 🔄 GESTION DES RÔLES
  public async assignRole(userId: string, role: string, assignedBy: string): Promise<void> {
    try {
      // Vérifier que le rôle existe
      if (!this.config.roles[role]) {
        throw new Error(`Rôle inconnu: ${role}`);
      }

      // Mettre à jour le rôle utilisateur
      await updateDoc(doc(db, 'users', userId), {
        role,
        roleAssignedBy: assignedBy,
        roleAssignedAt: new Date()
      });

      // Invalider le cache
      this.permissionCache.delete(userId);
      this.cacheExpiry.delete(userId);

      this.logger.info('Rôle assigné', {
        userId,
        role,
        assignedBy
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('Erreur lors de l\'assignation du rôle', {
        userId,
        role,
        assignedBy,
        error: errorMessage
      });
      throw error;
    }
  }

  // 🎯 PERMISSIONS PERSONNALISÉES
  public async grantCustomPermission(
    userId: string,
    permission: string,
    grantedBy: string
  ): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        throw new Error('Utilisateur introuvable');
      }

      const userData = userDoc.data();
      const customPermissions = userData.customPermissions || [];
      
      if (!customPermissions.includes(permission)) {
        customPermissions.push(permission);
        
        await updateDoc(doc(db, 'users', userId), {
          customPermissions,
          lastPermissionUpdate: new Date(),
          lastPermissionUpdatedBy: grantedBy
        });

        // Invalider le cache
        this.permissionCache.delete(userId);
        this.cacheExpiry.delete(userId);

        this.logger.info('Permission personnalisée accordée', {
          userId,
          permission,
          grantedBy
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('Erreur lors de l\'octroi de permission personnalisée', {
        userId,
        permission,
        grantedBy,
        error: errorMessage
      });
      throw error;
    }
  }

  // 🚫 RÉVOCATION DE PERMISSIONS
  public async revokeCustomPermission(
    userId: string,
    permission: string,
    revokedBy: string
  ): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        throw new Error('Utilisateur introuvable');
      }

      const userData = userDoc.data();
      const customPermissions = userData.customPermissions || [];
      
      const updatedPermissions = customPermissions.filter(p => p !== permission);
      
      await updateDoc(doc(db, 'users', userId), {
        customPermissions: updatedPermissions,
        lastPermissionUpdate: new Date(),
        lastPermissionUpdatedBy: revokedBy
      });

      // Invalider le cache
      this.permissionCache.delete(userId);
      this.cacheExpiry.delete(userId);

      this.logger.info('Permission personnalisée révoquée', {
        userId,
        permission,
        revokedBy
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      this.logger.error('Erreur lors de la révocation de permission personnalisée', {
        userId,
        permission,
        revokedBy,
        error: errorMessage
      });
      throw error;
    }
  }

  // 🧹 NETTOYAGE DU CACHE
  private startCacheCleanup(): void {
    setInterval(() => {
      const now = new Date();
      for (const [userId, expiry] of this.cacheExpiry.entries()) {
        if (now >= expiry) {
          this.permissionCache.delete(userId);
          this.cacheExpiry.delete(userId);
        }
      }
    }, 60000); // Toutes les minutes
  }

  // 📊 STATISTIQUES D'AUTORISATION
  public getAuthorizationStats(): any {
    return {
      cachedUsers: this.permissionCache.size,
      roles: Object.keys(this.config.roles),
      permissions: Object.keys(this.config.permissions)
    };
  }
}
