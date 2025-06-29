/**
 * Service Application Mission
 * Orchestration des Use Cases et coordination des opérations métier
 */

import { 
  CreateMissionUseCase, 
  UpdateMissionProgressUseCase,
  CreateMissionRequest,
  CreateMissionResponse,
  UpdateMissionProgressRequest,
  UpdateMissionProgressResponse
} from '@/application/usecases/CreateMissionUseCase';
import { missionRepository } from '@/repositories/MissionRepository';
import { Mission } from '@/types/ebios';
import { logger } from '@/services/logging/SecureLogger';

/**
 * Service Application principal pour les missions
 * Applique le pattern Application Service (DDD)
 */
export class MissionApplicationService {
  private createMissionUseCase: CreateMissionUseCase;
  private updateProgressUseCase: UpdateMissionProgressUseCase;

  constructor() {
    // Injection de dépendances
    this.createMissionUseCase = new CreateMissionUseCase(missionRepository);
    this.updateProgressUseCase = new UpdateMissionProgressUseCase(missionRepository);
  }

  /**
   * Créer une nouvelle mission EBIOS RM
   */
  async createMission(request: CreateMissionRequest): Promise<CreateMissionResponse> {
    logger.info('Début création mission', { name: request.name }, 'MissionApplicationService');
    
    try {
      const response = await this.createMissionUseCase.execute(request);
      
      if (response.success) {
        logger.info('Mission créée avec succès', { 
          missionId: response.missionId,
          name: request.name 
        }, 'MissionApplicationService');
      } else {
        logger.warn('Échec création mission', { 
          errors: response.errors,
          name: request.name 
        }, 'MissionApplicationService');
      }
      
      return response;
    } catch (error) {
      logger.error('Erreur création mission', error, 'MissionApplicationService');
      throw error;
    }
  }

  /**
   * Mettre à jour la progression d'un workshop
   */
  async updateWorkshopProgress(request: UpdateMissionProgressRequest): Promise<UpdateMissionProgressResponse> {
    logger.info('Début mise à jour progression', {
      missionId: request.missionId,
      workshopNumber: request.workshopNumber,
      isCompleted: request.isCompleted
    }, 'MissionApplicationService');

    try {
      const response = await this.updateProgressUseCase.execute(request);
      
      if (response.success) {
        logger.info('Progression mise à jour avec succès', {
          missionId: request.missionId,
          workshopNumber: request.workshopNumber,
          newPercentage: response.mission?.ebiosCompliance.completionPercentage
        }, 'MissionApplicationService');
      } else {
        logger.warn('Échec mise à jour progression', {
          errors: response.errors,
          missionId: request.missionId
        }, 'MissionApplicationService');
      }
      
      return response;
    } catch (error) {
      logger.error('Erreur mise à jour progression', error, 'MissionApplicationService');
      throw error;
    }
  }

  /**
   * Récupérer une mission par ID
   */
  async getMissionById(missionId: string): Promise<Mission | null> {
    try {
      logger.debug('Récupération mission', { missionId }, 'MissionApplicationService');
      return await missionRepository.findById(missionId);
    } catch (error) {
      logger.error('Erreur récupération mission', error, 'MissionApplicationService');
      throw error;
    }
  }

  /**
   * Récupérer toutes les missions
   */
  async getAllMissions(): Promise<Mission[]> {
    try {
      logger.debug('Récupération toutes missions', {}, 'MissionApplicationService');
      return await missionRepository.findAll();
    } catch (error) {
      logger.error('Erreur récupération missions', error, 'MissionApplicationService');
      throw error;
    }
  }

  /**
   * Récupérer les missions actives
   */
  async getActiveMissions(): Promise<Mission[]> {
    try {
      logger.debug('Récupération missions actives', {}, 'MissionApplicationService');
      return await missionRepository.findActiveMissions();
    } catch (error) {
      logger.error('Erreur récupération missions actives', error, 'MissionApplicationService');
      throw error;
    }
  }

  /**
   * Récupérer les statistiques des missions
   */
  async getMissionStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    averageCompletion: number;
  }> {
    try {
      logger.debug('Calcul statistiques missions', {}, 'MissionApplicationService');
      return await missionRepository.getMissionStatistics();
    } catch (error) {
      logger.error('Erreur calcul statistiques', error, 'MissionApplicationService');
      throw error;
    }
  }

  /**
   * Valider si un workshop peut être démarré
   */
  async canStartWorkshop(missionId: string, workshopNumber: number): Promise<{
    canStart: boolean;
    reason?: string;
  }> {
    try {
      const mission = await this.getMissionById(missionId);
      
      if (!mission) {
        return {
          canStart: false,
          reason: 'Mission non trouvée'
        };
      }

      // Logique métier pour les prérequis
      const requiredPercentage = (workshopNumber - 1) * 20;
      const canStart = mission.ebiosCompliance.completionPercentage >= requiredPercentage;

      if (!canStart) {
        return {
          canStart: false,
          reason: `Workshop ${workshopNumber - 1} doit être complété avant de commencer le Workshop ${workshopNumber}`
        };
      }

      return { canStart: true };
    } catch (error) {
      logger.error('Erreur validation prérequis workshop', error, 'MissionApplicationService');
      throw error;
    }
  }

  /**
   * Archiver une mission
   */
  async archiveMission(missionId: string): Promise<void> {
    try {
      const mission = await this.getMissionById(missionId);
      
      if (!mission) {
        throw new Error('Mission non trouvée');
      }

      if (mission.status === 'archived') {
        throw new Error('Mission déjà archivée');
      }

      await missionRepository.update(missionId, {
        status: 'archived',
        updatedAt: new Date().toISOString()
      });

      logger.info('Mission archivée', { missionId }, 'MissionApplicationService');
    } catch (error) {
      logger.error('Erreur archivage mission', error, 'MissionApplicationService');
      throw error;
    }
  }
}

/**
 * Instance singleton du service application
 */
export const missionApplicationService = new MissionApplicationService();
