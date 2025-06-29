/**
 * Use Case - Création de Mission
 * Orchestration de la logique métier pour la création d'une mission EBIOS RM
 */

import { Mission } from '@/domain/entities/Mission';
import { Mission as MissionType } from '@/types/ebios';
import { logger } from '@/services/logging/SecureLogger';

export interface MissionRepository {
  save(mission: MissionType): Promise<string>;
  findById(id: string): Promise<MissionType | null>;
  findByName(name: string): Promise<MissionType | null>;
}

export interface CreateMissionRequest {
  name: string;
  description: string;
  organizationType?: 'private' | 'public' | 'critical_infrastructure' | 'oiv';
  sector?: string;
  size?: 'small' | 'medium' | 'large';
}

export interface CreateMissionResponse {
  success: boolean;
  missionId?: string;
  mission?: MissionType;
  errors?: string[];
}

export class CreateMissionUseCase {
  constructor(
    private readonly missionRepository: MissionRepository
  ) {}

  async execute(request: CreateMissionRequest): Promise<CreateMissionResponse> {
    try {
      // 1. Validation des données d'entrée
      const validationErrors = this.validateRequest(request);
      if (validationErrors.length > 0) {
        return {
          success: false,
          errors: validationErrors
        };
      }

      // 2. Vérification de l'unicité du nom
      const existingMission = await this.missionRepository.findByName(request.name);
      if (existingMission) {
        return {
          success: false,
          errors: ['Une mission avec ce nom existe déjà']
        };
      }

      // 3. Création de l'entité Mission avec validation métier
      const mission = Mission.create({
        name: request.name,
        description: request.description,
        organizationContext: {
          organizationType: request.organizationType || 'private',
          sector: request.sector || '',
          size: request.size || 'medium',
          regulatoryRequirements: [],
          securityObjectives: [],
          constraints: []
        }
      });

      // 4. Persistance
      const missionId = await this.missionRepository.save(mission.toPlainObject());

      // 5. Logging sécurisé
      logger.info('Mission créée avec succès', {
        missionId,
        name: request.name,
        organizationType: request.organizationType
      }, 'CreateMissionUseCase');

      return {
        success: true,
        missionId,
        mission: mission.toPlainObject()
      };

    } catch (error) {
      logger.error('Erreur lors de la création de mission', error, 'CreateMissionUseCase');
      
      return {
        success: false,
        errors: ['Erreur interne lors de la création de la mission']
      };
    }
  }

  private validateRequest(request: CreateMissionRequest): string[] {
    const errors: string[] = [];

    if (!request.name || request.name.trim().length < 3) {
      errors.push('Le nom de la mission doit contenir au moins 3 caractères');
    }

    if (!request.description || request.description.trim().length < 10) {
      errors.push('La description doit contenir au moins 10 caractères');
    }

    if (request.organizationType && !['private', 'public', 'critical_infrastructure', 'oiv'].includes(request.organizationType)) {
      errors.push('Type d\'organisation invalide');
    }

    if (request.size && !['small', 'medium', 'large'].includes(request.size)) {
      errors.push('Taille d\'organisation invalide');
    }

    return errors;
  }
}

/**
 * Use Case - Progression de Mission
 * Gestion de l'avancement des workshops
 */
export interface UpdateMissionProgressRequest {
  missionId: string;
  workshopNumber: number;
  isCompleted: boolean;
}

export interface UpdateMissionProgressResponse {
  success: boolean;
  mission?: MissionType;
  errors?: string[];
}

export class UpdateMissionProgressUseCase {
  constructor(
    private readonly missionRepository: MissionRepository
  ) {}

  async execute(request: UpdateMissionProgressRequest): Promise<UpdateMissionProgressResponse> {
    try {
      // 1. Récupération de la mission
      const missionData = await this.missionRepository.findById(request.missionId);
      if (!missionData) {
        return {
          success: false,
          errors: ['Mission non trouvée']
        };
      }

      // 2. Création de l'entité Mission
      const mission = Mission.create(missionData);

      // 3. Validation des prérequis
      if (!mission.canStartWorkshop(request.workshopNumber)) {
        return {
          success: false,
          errors: [`Les prérequis pour le Workshop ${request.workshopNumber} ne sont pas remplis`]
        };
      }

      // 4. Mise à jour de la progression
      const updatedMission = mission.updateProgress(request.workshopNumber, request.isCompleted);

      // 5. Persistance
      await this.missionRepository.save(updatedMission.toPlainObject());

      // 6. Logging
      logger.info('Progression de mission mise à jour', {
        missionId: request.missionId,
        workshopNumber: request.workshopNumber,
        isCompleted: request.isCompleted,
        newPercentage: updatedMission.ebiosCompliance.completionPercentage
      }, 'UpdateMissionProgressUseCase');

      return {
        success: true,
        mission: updatedMission.toPlainObject()
      };

    } catch (error) {
      logger.error('Erreur lors de la mise à jour de progression', error, 'UpdateMissionProgressUseCase');
      
      return {
        success: false,
        errors: ['Erreur interne lors de la mise à jour']
      };
    }
  }
}
