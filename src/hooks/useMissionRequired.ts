/**
 * 🔒 HOOK DE SÉCURITÉ : MISSION OBLIGATOIRE
 * Garantit qu'aucun atelier ne peut fonctionner sans mission
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getMissionById } from '../services/firebase/missions';
import type { Mission } from '../types/ebios';

interface UseMissionRequiredResult {
  mission: Mission | null;
  isLoading: boolean;
  error: string | null;
  missionId: string | null;
  isValidMission: boolean;
}

/**
 * Hook qui garantit qu'une mission valide est disponible
 * Redirige automatiquement si aucune mission n'est trouvée
 */
export const useMissionRequired = (): UseMissionRequiredResult => {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();
  const selectedMission = useSelector((state: RootState) => state.missions.selectedMission);
  
  const [mission, setMission] = useState<Mission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateMission = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Vérification 1: missionId dans l'URL
        if (!missionId) {
          setError('ID de mission manquant dans l\'URL');
          // Redirection vers sélection de mission après un délai
          setTimeout(() => {
            navigate('/missions', { replace: true });
          }, 2000);
          return;
        }

        // Vérification 2: Mission existe en base
        const missionData = await getMissionById(missionId);
        if (!missionData) {
          setError(`Mission ${missionId} introuvable`);
          // Redirection vers sélection de mission après un délai
          setTimeout(() => {
            navigate('/missions', { replace: true });
          }, 2000);
          return;
        }

        // Vérification 3: Mission valide et accessible
        if (missionData.status === 'archived' || missionData.status === 'deleted') {
          setError('Mission archivée ou supprimée');
          setTimeout(() => {
            navigate('/missions', { replace: true });
          }, 2000);
          return;
        }

        // Mission valide trouvée
        setMission(missionData);

      } catch (err) {
        console.error('Erreur lors de la validation de la mission:', err);
        setError('Erreur lors de la validation de la mission');
        setTimeout(() => {
          navigate('/missions', { replace: true });
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    validateMission();
  }, [missionId, navigate]);

  return {
    mission,
    isLoading,
    error,
    missionId: missionId || null,
    isValidMission: !!mission && !error
  };
};

/**
 * Hook spécialisé pour les ateliers
 * Ajoute des validations spécifiques aux ateliers
 */
export const useWorkshopMissionRequired = (workshopNumber: number): UseMissionRequiredResult & {
  canAccessWorkshop: boolean;
  workshopValidationError: string | null;
} => {
  const missionResult = useMissionRequired();
  const [canAccessWorkshop, setCanAccessWorkshop] = useState(false);
  const [workshopValidationError, setWorkshopValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!missionResult.isValidMission || !missionResult.mission) {
      setCanAccessWorkshop(false);
      return;
    }

    // Validation spécifique aux ateliers
    const mission = missionResult.mission;

    // Vérification des prérequis d'atelier
    if (workshopNumber > 1) {
      // Vérifier que les ateliers précédents sont complétés
      const previousWorkshops = Array.from({ length: workshopNumber - 1 }, (_, i) => i + 1);
      const incompletePrevious = previousWorkshops.filter(w => {
        const workshopKey = `workshop${w}` as keyof typeof mission.workshops;
        return !mission.workshops?.[workshopKey]?.completed;
      });

      if (incompletePrevious.length > 0) {
        setWorkshopValidationError(
          `Atelier${incompletePrevious.length > 1 ? 's' : ''} ${incompletePrevious.join(', ')} 
          doi${incompletePrevious.length > 1 ? 'vent' : 't'} être terminé${incompletePrevious.length > 1 ? 's' : ''} avant d'accéder à l'Atelier ${workshopNumber}`
        );
        setCanAccessWorkshop(false);
        return;
      }
    }

    // Vérification du statut de la mission
    if (mission.status === 'completed' && workshopNumber <= 5) {
      setWorkshopValidationError('Mission terminée - Ateliers en lecture seule');
      setCanAccessWorkshop(true); // Lecture seule autorisée
      return;
    }

    // Validation réussie
    setWorkshopValidationError(null);
    setCanAccessWorkshop(true);

  }, [missionResult.isValidMission, missionResult.mission, workshopNumber]);

  return {
    ...missionResult,
    canAccessWorkshop,
    workshopValidationError
  };
};

/**
 * Hook pour valider l'accès aux données d'atelier
 * Garantit que toutes les opérations CRUD sont liées à une mission
 */
export const useWorkshopDataValidation = (missionId: string | null) => {
  const [isValidForDataOperations, setIsValidForDataOperations] = useState(false);

  useEffect(() => {
    // Validation stricte pour les opérations de données
    if (!missionId || missionId.trim().length === 0) {
      setIsValidForDataOperations(false);
      console.warn('🚫 Opération de données bloquée: missionId manquant');
      return;
    }

    // Validation du format de l'ID
    if (missionId.length < 3) {
      setIsValidForDataOperations(false);
      console.warn('🚫 Opération de données bloquée: missionId invalide');
      return;
    }

    setIsValidForDataOperations(true);
  }, [missionId]);

  const validateDataOperation = (operationType: string, entityType: string): boolean => {
    if (!isValidForDataOperations) {
      console.error(`🚫 ${operationType} ${entityType} bloqué: mission non valide`);
      return false;
    }
    return true;
  };

  return {
    isValidForDataOperations,
    validateDataOperation,
    missionId
  };
};

export default useMissionRequired;
