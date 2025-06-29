/**
 * Hook personnalisé pour les missions
 * Intégration React avec l'architecture Domain-Driven Design
 */

import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { missionApplicationService } from '@/application/services/MissionApplicationService';
import { CreateMissionRequest } from '@/application/usecases/CreateMissionUseCase';
import { Mission } from '@/types/ebios';
import { setMissions, addMission, updateMission } from '@/store/slices/missionsSlice';
import { logger } from '@/services/logging/SecureLogger';

interface UseMissionServiceReturn {
  // État
  missions: Mission[];
  loading: boolean;
  error: string | null;
  
  // Actions
  createMission: (request: CreateMissionRequest) => Promise<{ success: boolean; missionId?: string; errors?: string[] }>;
  updateWorkshopProgress: (missionId: string, workshopNumber: number, isCompleted: boolean) => Promise<boolean>;
  getMissionById: (missionId: string) => Promise<Mission | null>;
  refreshMissions: () => Promise<void>;
  canStartWorkshop: (missionId: string, workshopNumber: number) => Promise<{ canStart: boolean; reason?: string }>;
  archiveMission: (missionId: string) => Promise<boolean>;
  
  // Statistiques
  statistics: {
    total: number;
    byStatus: Record<string, number>;
    averageCompletion: number;
  } | null;
}

/**
 * Hook principal pour la gestion des missions
 * Applique le pattern Facade pour simplifier l'interface
 */
export const useMissionService = (): UseMissionServiceReturn => {
  const dispatch = useDispatch();
  const [missions, setMissionsState] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<{
    total: number;
    byStatus: Record<string, number>;
    averageCompletion: number;
  } | null>(null);

  /**
   * Créer une nouvelle mission
   */
  const createMission = useCallback(async (request: CreateMissionRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await missionApplicationService.createMission(request);
      
      if (response.success && response.mission) {
        // Mise à jour du store Redux
        dispatch(addMission(response.mission));
        
        // Mise à jour de l'état local
        setMissionsState(prev => [...prev, response.mission!]);
        
        logger.info('Mission créée via hook', { 
          missionId: response.missionId,
          name: request.name 
        }, 'useMissionService');
      }
      
      return {
        success: response.success,
        missionId: response.missionId,
        errors: response.errors
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(errorMessage);
      logger.error('Erreur création mission via hook', error, 'useMissionService');
      
      return {
        success: false,
        errors: [errorMessage]
      };
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /**
   * Mettre à jour la progression d'un workshop
   */
  const updateWorkshopProgress = useCallback(async (
    missionId: string, 
    workshopNumber: number, 
    isCompleted: boolean
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await missionApplicationService.updateWorkshopProgress({
        missionId,
        workshopNumber,
        isCompleted
      });

      if (response.success && response.mission) {
        // Mise à jour du store Redux
        dispatch(updateMission(response.mission));
        
        // Mise à jour de l'état local
        setMissionsState(prev => 
          prev.map(mission => 
            mission.id === missionId ? response.mission! : mission
          )
        );
        
        logger.info('Progression mise à jour via hook', {
          missionId,
          workshopNumber,
          isCompleted
        }, 'useMissionService');
      }

      return response.success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(errorMessage);
      logger.error('Erreur mise à jour progression via hook', error, 'useMissionService');
      return false;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /**
   * Récupérer une mission par ID
   */
  const getMissionById = useCallback(async (missionId: string): Promise<Mission | null> => {
    try {
      return await missionApplicationService.getMissionById(missionId);
    } catch (error) {
      logger.error('Erreur récupération mission via hook', error, 'useMissionService');
      return null;
    }
  }, []);

  /**
   * Rafraîchir la liste des missions
   */
  const refreshMissions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [allMissions, stats] = await Promise.all([
        missionApplicationService.getAllMissions(),
        missionApplicationService.getMissionStatistics()
      ]);

      // Mise à jour du store Redux
      dispatch(setMissions(allMissions));
      
      // Mise à jour de l'état local
      setMissionsState(allMissions);
      setStatistics(stats);

      logger.debug('Missions rafraîchies via hook', { 
        count: allMissions.length 
      }, 'useMissionService');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(errorMessage);
      logger.error('Erreur rafraîchissement missions via hook', error, 'useMissionService');
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /**
   * Vérifier si un workshop peut être démarré
   */
  const canStartWorkshop = useCallback(async (
    missionId: string, 
    workshopNumber: number
  ): Promise<{ canStart: boolean; reason?: string }> => {
    try {
      return await missionApplicationService.canStartWorkshop(missionId, workshopNumber);
    } catch (error) {
      logger.error('Erreur validation prérequis workshop via hook', error, 'useMissionService');
      return {
        canStart: false,
        reason: 'Erreur lors de la validation des prérequis'
      };
    }
  }, []);

  /**
   * Archiver une mission
   */
  const archiveMission = useCallback(async (missionId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await missionApplicationService.archiveMission(missionId);
      
      // Rafraîchir les missions après archivage
      await refreshMissions();
      
      logger.info('Mission archivée via hook', { missionId }, 'useMissionService');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setError(errorMessage);
      logger.error('Erreur archivage mission via hook', error, 'useMissionService');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshMissions]);

  // Chargement initial des missions
  useEffect(() => {
    refreshMissions();
  }, [refreshMissions]);

  return {
    missions,
    loading,
    error,
    createMission,
    updateWorkshopProgress,
    getMissionById,
    refreshMissions,
    canStartWorkshop,
    archiveMission,
    statistics
  };
};
