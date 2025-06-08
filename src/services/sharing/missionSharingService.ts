import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query,
  where,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Mission } from '../../types/ebios';

export interface SharePermission {
  id: string;
  missionId: string;
  sharedBy: string;
  sharedWith: string;
  permission: 'read' | 'write' | 'admin';
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface ShareInvitation {
  id: string;
  missionId: string;
  email: string;
  permission: 'read' | 'write' | 'admin';
  invitedBy: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  createdAt: string;
  expiresAt: string;
  token: string;
}

export interface ShareOptions {
  permission: 'read' | 'write' | 'admin';
  expiresIn?: number; // en jours
  message?: string;
  allowDownload?: boolean;
  allowCopy?: boolean;
}

export class MissionSharingService {
  
  /**
   * Partager une mission avec un utilisateur par email
   */
  static async shareMissionByEmail(
    mission: Mission, 
    email: string, 
    options: ShareOptions
  ): Promise<ShareInvitation> {
    try {
      const invitationData = {
        missionId: mission.id,
        email: email.toLowerCase(),
        permission: options.permission,
        invitedBy: 'current-user', // À remplacer par l'utilisateur actuel
        status: 'pending' as const,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + (options.expiresIn || 7) * 24 * 60 * 60 * 1000),
        token: this.generateShareToken(),
        message: options.message || '',
        allowDownload: options.allowDownload || false,
        allowCopy: options.allowCopy || false
      };
      
      const docRef = await addDoc(collection(db, 'shareInvitations'), invitationData);
      
      // Envoyer l'email d'invitation
      await this.sendInvitationEmail(email, mission, {
        ...invitationData,
        id: docRef.id
      } as ShareInvitation);
      
      return {
        id: docRef.id,
        ...invitationData,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (options.expiresIn || 7) * 24 * 60 * 60 * 1000).toISOString()
      } as ShareInvitation;
    } catch (error) {
      console.error('Error sharing mission:', error);
      throw error;
    }
  }
  
  /**
   * Générer un lien de partage public
   */
  static async generatePublicShareLink(
    mission: Mission, 
    options: ShareOptions
  ): Promise<string> {
    try {
      const shareData = {
        missionId: mission.id,
        permission: options.permission,
        createdBy: 'current-user', // À remplacer par l'utilisateur actuel
        createdAt: serverTimestamp(),
        expiresAt: options.expiresIn ? 
          new Date(Date.now() + options.expiresIn * 24 * 60 * 60 * 1000) : 
          null,
        token: this.generateShareToken(),
        isActive: true,
        allowDownload: options.allowDownload || false,
        allowCopy: options.allowCopy || false,
        accessCount: 0
      };
      
      const docRef = await addDoc(collection(db, 'publicShares'), shareData);
      
      // Générer l'URL de partage
      const baseUrl = window.location.origin;
      return `${baseUrl}/shared/${docRef.id}?token=${shareData.token}`;
    } catch (error) {
      console.error('Error generating public share link:', error);
      throw error;
    }
  }
  
  /**
   * Obtenir les permissions de partage d'une mission
   */
  static async getMissionPermissions(missionId: string): Promise<SharePermission[]> {
    try {
      const q = query(
        collection(db, 'sharePermissions'),
        where('missionId', '==', missionId),
        where('isActive', '==', true)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      } as SharePermission));
    } catch (error) {
      console.error('Error getting mission permissions:', error);
      throw error;
    }
  }
  
  /**
   * Révoquer un partage
   */
  static async revokeShare(shareId: string, type: 'invitation' | 'permission' | 'public'): Promise<void> {
    try {
      const collectionName = type === 'invitation' ? 'shareInvitations' : 
                           type === 'permission' ? 'sharePermissions' : 'publicShares';
      
      const docRef = doc(db, collectionName, shareId);
      await updateDoc(docRef, {
        isActive: false,
        revokedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error revoking share:', error);
      throw error;
    }
  }
  
  /**
   * Copier le lien de partage dans le presse-papiers
   */
  static async copyShareLink(shareLink: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(shareLink);
    } catch (error) {
      // Fallback pour les navigateurs qui ne supportent pas l'API Clipboard
      const textArea = document.createElement('textarea');
      textArea.value = shareLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }
  
  /**
   * Partager via les réseaux sociaux ou email
   */
  static shareViaExternal(shareLink: string, method: 'email' | 'linkedin' | 'teams' | 'slack'): void {
    const encodedLink = encodeURIComponent(shareLink);
    const message = encodeURIComponent('Consultez cette analyse EBIOS RM');
    
    let url = '';
    
    switch (method) {
      case 'email':
        url = `mailto:?subject=${encodeURIComponent('Partage d\'analyse EBIOS RM')}&body=${message}%0A%0A${encodedLink}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`;
        break;
      case 'teams':
        url = `https://teams.microsoft.com/share?href=${encodedLink}&msgText=${message}`;
        break;
      case 'slack':
        url = `https://slack.com/intl/fr-fr/help/articles/201330736-Add-links-to-messages?text=${message}&url=${encodedLink}`;
        break;
    }
    
    if (url) {
      window.open(url, '_blank');
    }
  }
  
  /**
   * Générer un token de partage sécurisé
   */
  private static generateShareToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  /**
   * Envoyer un email d'invitation (simulation)
   */
  private static async sendInvitationEmail(
    email: string, 
    mission: Mission, 
    invitation: ShareInvitation
  ): Promise<void> {
    // Simulation d'envoi d'email
    // Dans un vrai projet, utiliser un service comme SendGrid, Mailgun, etc.
    console.log(`📧 Email d'invitation envoyé à ${email} pour la mission "${mission.name}"`);
    console.log(`🔗 Lien d'invitation: ${window.location.origin}/invitation/${invitation.id}?token=${invitation.token}`);
    
    // TODO: Implémenter l'envoi d'email réel
    // await emailService.sendInvitation({
    //   to: email,
    //   subject: `Invitation à consulter l'analyse EBIOS RM: ${mission.name}`,
    //   template: 'mission-invitation',
    //   data: { mission, invitation }
    // });
  }
  
  /**
   * Vérifier les permissions d'un utilisateur sur une mission
   */
  static async checkUserPermission(missionId: string, userId: string): Promise<SharePermission | null> {
    try {
      const q = query(
        collection(db, 'sharePermissions'),
        where('missionId', '==', missionId),
        where('sharedWith', '==', userId),
        where('isActive', '==', true)
      );
      
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      } as SharePermission;
    } catch (error) {
      console.error('Error checking user permission:', error);
      return null;
    }
  }
}
