/**
 * Repository Mission - Implémentation concrète
 * Gestion de la persistance des missions EBIOS RM
 */

import { BaseRepository } from './BaseRepository';
import { Mission } from '@/types/ebios';
import { MissionRepository as IMissionRepository } from '@/application/usecases/CreateMissionUseCase';
import { logger } from '@/services/logging/SecureLogger';

export class MissionRepository extends BaseRepository<Mission> implements IMissionRepository {
  constructor() {
    super('missions');
  }

  /**
   * Implémentation spécifique pour Mission
   */
  async save(mission: Mission): Promise<string> {
    try {
      // Validation avant sauvegarde
      this.validateMission(mission);
      
      // Ajout des métadonnées
      const missionWithMetadata = {
        ...mission,
        updatedAt: new Date().toISOString()
      };

      const id = await super.save(missionWithMetadata);
      
      logger.info('Mission sauvegardée avec succès', {
        missionId: id,
        name: mission.name,
        status: mission.status
      }, 'MissionRepository');

      return id;
    } catch (error) {
      logger.error('Erreur sauvegarde mission', error, 'MissionRepository');
      throw error;
    }
  }

  async findByName(name: string): Promise<Mission | null> {
    try {
      const missions = await this.findByField('name', name);
      return missions.length > 0 ? missions[0] : null;
    } catch (error) {
      logger.error('Erreur recherche mission par nom', error, 'MissionRepository');
      throw error;
    }
  }

  async findByStatus(status: string): Promise<Mission[]> {
    try {
      return await this.findByField('status', status);
    } catch (error) {
      logger.error('Erreur recherche missions par statut', error, 'MissionRepository');
      throw error;
    }
  }

  async findByOrganization(organization: string): Promise<Mission[]> {
    try {
      return await this.findByField('organization', organization);
    } catch (error) {
      logger.error('Erreur recherche missions par organisation', error, 'MissionRepository');
      throw error;
    }
  }

  async findActiveMissions(): Promise<Mission[]> {
    try {
      const activeMissions = await this.findByField('status', 'active');
      const inProgressMissions = await this.findByField('status', 'in_progress');
      
      return [...activeMissions, ...inProgressMissions];
    } catch (error) {
      logger.error('Erreur recherche missions actives', error, 'MissionRepository');
      throw error;
    }
  }

  async updateProgress(missionId: string, completionPercentage: number): Promise<void> {
    try {
      const mission = await this.findById(missionId);
      if (!mission) {
        throw new Error(`Mission ${missionId} non trouvée`);
      }

      const updatedEbiosCompliance = {
        ...mission.ebiosCompliance,
        completionPercentage: Math.min(100, Math.max(0, completionPercentage))
      };

      await this.update(missionId, {
        ebiosCompliance: updatedEbiosCompliance,
        updatedAt: new Date().toISOString()
      });

      logger.info('Progression mission mise à jour', {
        missionId,
        completionPercentage
      }, 'MissionRepository');

    } catch (error) {
      logger.error('Erreur mise à jour progression', error, 'MissionRepository');
      throw error;
    }
  }

  async getMissionStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    averageCompletion: number;
  }> {
    try {
      const allMissions = await this.findAll();
      
      const byStatus = allMissions.reduce((acc, mission) => {
        acc[mission.status] = (acc[mission.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const averageCompletion = allMissions.length > 0
        ? allMissions.reduce((sum, mission) => sum + mission.ebiosCompliance.completionPercentage, 0) / allMissions.length
        : 0;

      return {
        total: allMissions.length,
        byStatus,
        averageCompletion
      };
    } catch (error) {
      logger.error('Erreur calcul statistiques missions', error, 'MissionRepository');
      throw error;
    }
  }

  /**
   * Validation métier spécifique aux missions
   */
  private validateMission(mission: Mission): void {
    if (!mission.name || mission.name.trim().length < 3) {
      throw new Error('Le nom de la mission doit contenir au moins 3 caractères');
    }

    if (!mission.description || mission.description.trim().length < 10) {
      throw new Error('La description doit contenir au moins 10 caractères');
    }

    if (!['draft', 'active', 'in_progress', 'completed', 'archived'].includes(mission.status)) {
      throw new Error('Statut de mission invalide');
    }

    if (mission.ebiosCompliance.version !== '1.5') {
      throw new Error('Seule la version EBIOS RM 1.5 est supportée');
    }

    if (mission.ebiosCompliance.completionPercentage < 0 || mission.ebiosCompliance.completionPercentage > 100) {
      throw new Error('Le pourcentage de completion doit être entre 0 et 100');
    }
  }
}

/**
 * Instance singleton du repository Mission
 */
export const missionRepository = new MissionRepository();
