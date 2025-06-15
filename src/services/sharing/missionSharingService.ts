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
  
  /* Données réelles */
  private static async sendInvitationEmail(
    email: string, 
    mission: Mission, 
    invitation: ShareInvitation
  ): Promise<void> {
    // Données réelles
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
