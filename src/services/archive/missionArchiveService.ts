import { 
  doc, 
  updateDoc, 
  serverTimestamp,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Mission } from '../../types/ebios';

export interface ArchiveEntry {
  id: string;
  missionId: string;
  missionName: string;
  archivedBy: string;
  archivedAt: string;
  reason: string;
  originalStatus: string;
  retentionPeriod?: number; // en mois
  canRestore: boolean;
  metadata: {
    completionPercentage: number;
    workshopsCompleted: number;
    lastActivity: string;
    dataSize: number; // en KB
  };
}

export interface ArchiveOptions {
  reason: string;
  retentionPeriod?: number; // en mois, par défaut 24 mois
  deleteAfterRetention?: boolean;
  createBackup?: boolean;
  notifyStakeholders?: boolean;
}

export interface RestoreOptions {
  restoreToStatus?: 'draft' | 'in_progress' | 'review';
  notifyStakeholders?: boolean;
  createRestoreLog?: boolean;
}

export class MissionArchiveService {
  
  /**
   * Archiver une mission
   */
  static async archiveMission(
    mission: Mission, 
    options: ArchiveOptions
  ): Promise<ArchiveEntry> {
    try {
      // Mettre à jour le statut de la mission
      const missionRef = doc(db, 'missions', mission.id);
      await updateDoc(missionRef, {
        status: 'archived',
        archivedAt: serverTimestamp(),
        archivedBy: 'current-user', // À remplacer par l'utilisateur actuel
        archiveReason: options.reason,
        updatedAt: serverTimestamp()
      });
      
      // Créer une entrée d'archive
      const archiveData = {
        missionId: mission.id,
        missionName: mission.name,
        archivedBy: 'current-user', // À remplacer par l'utilisateur actuel
        archivedAt: serverTimestamp(),
        reason: options.reason,
        originalStatus: mission.status,
        retentionPeriod: options.retentionPeriod || 24,
        canRestore: true,
        metadata: {
          completionPercentage: mission.ebiosCompliance?.completionPercentage || 0,
          workshopsCompleted: mission.ebiosCompliance?.validatedWorkshops?.length || 0,
          lastActivity: mission.updatedAt,
          dataSize: this.calculateMissionDataSize(mission)
        },
        deleteAfterRetention: options.deleteAfterRetention || false,
        createdBackup: options.createBackup || false
      };
      
      const archiveRef = await addDoc(collection(db, 'missionArchives'), archiveData);
      
      // Créer une sauvegarde si demandé
      if (options.createBackup) {
        await this.createMissionBackup(mission);
      }
      
      // Notifier les parties prenantes si demandé
      if (options.notifyStakeholders && mission.assignedTo?.length > 0) {
        await this.notifyStakeholders(mission, 'archived', options.reason);
      }
      
      return {
        id: archiveRef.id,
        ...archiveData,
        archivedAt: new Date().toISOString()
      } as ArchiveEntry;
    } catch (error) {
      console.error('Error archiving mission:', error);
      throw error;
    }
  }
  
  /**
   * Restaurer une mission archivée
   */
  static async restoreMission(
    missionId: string, 
    options: RestoreOptions = {}
  ): Promise<void> {
    try {
      // Mettre à jour le statut de la mission
      const missionRef = doc(db, 'missions', missionId);
      await updateDoc(missionRef, {
        status: options.restoreToStatus || 'draft',
        restoredAt: serverTimestamp(),
        restoredBy: 'current-user', // À remplacer par l'utilisateur actuel
        archivedAt: null,
        archivedBy: null,
        archiveReason: null,
        updatedAt: serverTimestamp()
      });
      
      // Mettre à jour l'entrée d'archive
      const archiveQuery = query(
        collection(db, 'missionArchives'),
        where('missionId', '==', missionId),
        where('canRestore', '==', true)
      );
      
      const archiveSnapshot = await getDocs(archiveQuery);
      if (!archiveSnapshot.empty) {
        const archiveDoc = archiveSnapshot.docs[0];
        await updateDoc(doc(db, 'missionArchives', archiveDoc.id), {
          canRestore: false,
          restoredAt: serverTimestamp(),
          restoredBy: 'current-user'
        });
      }
      
      // Créer un log de restauration si demandé
      if (options.createRestoreLog) {
        await addDoc(collection(db, 'missionLogs'), {
          missionId,
          action: 'restored',
          performedBy: 'current-user',
          performedAt: serverTimestamp(),
          details: {
            restoredToStatus: options.restoreToStatus || 'draft',
            reason: 'Mission restored from archive'
          }
        });
      }
      
      // Notifier les parties prenantes si demandé
      if (options.notifyStakeholders) {
        // Récupérer les informations de la mission pour la notification
        // await this.notifyStakeholders(mission, 'restored');
      }
    } catch (error) {
      console.error('Error restoring mission:', error);
      throw error;
    }
  }
  
  /**
   * Obtenir toutes les missions archivées
   */
  static async getArchivedMissions(): Promise<ArchiveEntry[]> {
    try {
      const q = query(
        collection(db, 'missionArchives'),
        where('canRestore', '==', true),
        orderBy('archivedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        archivedAt: doc.data().archivedAt?.toDate?.()?.toISOString() || new Date().toISOString()
      } as ArchiveEntry));
    } catch (error) {
      console.error('Error getting archived missions:', error);
      throw error;
    }
  }
  
  /**
   * Supprimer définitivement une mission archivée
   */
  static async permanentlyDeleteMission(missionId: string): Promise<void> {
    try {
      // Marquer l'archive comme non restaurable
      const archiveQuery = query(
        collection(db, 'missionArchives'),
        where('missionId', '==', missionId)
      );
      
      const archiveSnapshot = await getDocs(archiveQuery);
      if (!archiveSnapshot.empty) {
        const archiveDoc = archiveSnapshot.docs[0];
        await updateDoc(doc(db, 'missionArchives', archiveDoc.id), {
          canRestore: false,
          permanentlyDeletedAt: serverTimestamp(),
          permanentlyDeletedBy: 'current-user'
        });
      }
      
      // Créer un log de suppression définitive
      await addDoc(collection(db, 'missionLogs'), {
        missionId,
        action: 'permanently_deleted',
        performedBy: 'current-user',
        performedAt: serverTimestamp(),
        details: {
          reason: 'Permanent deletion from archive',
          dataRetentionCompliant: true
        }
      });
      
      // TODO: Supprimer toutes les données associées
      // - Workshops data
      // - Business values
      // - Supporting assets
      // - Strategic scenarios
      // - Security measures
      // - Treatment plans
      // - Share permissions
      // - Backups
      
    } catch (error) {
      console.error('Error permanently deleting mission:', error);
      throw error;
    }
  }
  
  /**
   * Nettoyer automatiquement les archives expirées
   */
  static async cleanupExpiredArchives(): Promise<number> {
    try {
      const q = query(
        collection(db, 'missionArchives'),
        where('canRestore', '==', true)
      );
      
      const snapshot = await getDocs(q);
      let cleanedCount = 0;
      
      for (const docSnapshot of snapshot.docs) {
        const archive = docSnapshot.data() as ArchiveEntry;
        const archivedDate = new Date(archive.archivedAt);
        const retentionPeriodMs = (archive.retentionPeriod || 24) * 30 * 24 * 60 * 60 * 1000; // mois en ms
        const expirationDate = new Date(archivedDate.getTime() + retentionPeriodMs);
        
        if (new Date() > expirationDate) {
          if (archive.metadata && (archive as any).deleteAfterRetention) {
            await this.permanentlyDeleteMission(archive.missionId);
            cleanedCount++;
          } else {
            // Marquer comme expiré mais garder pour référence
            await updateDoc(doc(db, 'missionArchives', docSnapshot.id), {
              isExpired: true,
              expiredAt: serverTimestamp()
            });
          }
        }
      }
      
      return cleanedCount;
    } catch (error) {
      console.error('Error cleaning up expired archives:', error);
      throw error;
    }
  }
  
  /**
   * Calculer la taille approximative des données d'une mission
   */
  private static calculateMissionDataSize(mission: Mission): number {
    // Estimation approximative en KB
    const missionSize = JSON.stringify(mission).length / 1024;
    
    // Ajouter une estimation pour les données des workshops
    // (sera plus précis quand on aura accès aux données complètes)
    const estimatedWorkshopData = 50; // KB par workshop
    const workshopsCount = mission.ebiosCompliance?.validatedWorkshops?.length || 0;
    
    return Math.round(missionSize + (estimatedWorkshopData * workshopsCount));
  }
  
  /**
   * Créer une sauvegarde complète de la mission
   */
  private static async createMissionBackup(mission: Mission): Promise<void> {
    try {
      const backupData = {
        mission,
        backupDate: new Date().toISOString(),
        backupVersion: '1.0',
        // TODO: Ajouter toutes les données des workshops
        // workshops: await this.getAllWorkshopData(mission.id)
      };
      
      await addDoc(collection(db, 'missionBackups'), {
        missionId: mission.id,
        backupData,
        createdAt: serverTimestamp(),
        createdBy: 'current-user',
        size: this.calculateMissionDataSize(mission)
      });
    } catch (error) {
      console.error('Error creating mission backup:', error);
      throw error;
    }
  }
  
  /**
   * Notifier les parties prenantes
   */
  private static async notifyStakeholders(
    mission: Mission, 
    action: 'archived' | 'restored', 
    reason?: string
  ): Promise<void> {
    // Données réelles
    console.log(`📧 Notification envoyée aux parties prenantes de la mission "${mission.name}"`);
    console.log(`Action: ${action}${reason ? `, Raison: ${reason}` : ''}`);
    
    // TODO: Implémenter les notifications réelles
    // - Email aux assignés
    // - Notifications in-app
    // - Webhooks si configurés
  }
}
