/**
 * 🎯 SÉLECTEURS MÉMORISÉS REDUX
 * Optimisation des performances avec createSelector de Reselect
 * Évite les re-rendus inutiles causés par de nouvelles références
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import type { Mission, BusinessValue, SupportingAsset, EssentialAsset, DreadedEvent, Stakeholder } from '../../types/ebios';

// ===== SÉLECTEURS DE BASE =====

export const selectMissionsState = (state: RootState) => state.missions;
export const selectBusinessValuesState = (state: RootState) => state.businessValues;
export const selectSupportingAssetsState = (state: RootState) => state.supportingAssets;
export const selectStakeholdersState = (state: RootState) => state.stakeholders;

// ===== SÉLECTEURS SIMPLES =====

export const selectAllMissions = createSelector(
  [selectMissionsState],
  (missionsState) => missionsState.missions
);

export const selectSelectedMission = createSelector(
  [selectMissionsState],
  (missionsState) => missionsState.selectedMission
);

export const selectAllBusinessValues = createSelector(
  [selectBusinessValuesState],
  (businessValuesState) => businessValuesState.businessValues
);

export const selectAllSupportingAssets = createSelector(
  [selectSupportingAssetsState],
  (supportingAssetsState) => supportingAssetsState.supportingAssets
);

export const selectAllStakeholders = createSelector(
  [selectStakeholdersState],
  (stakeholdersState) => stakeholdersState.stakeholders
);

// ===== SÉLECTEURS PARAMÉTRÉS (FACTORY FUNCTIONS) =====

/**
 * Sélecteur pour récupérer une mission par ID
 */
export const makeSelectMissionById = () => createSelector(
  [selectAllMissions, (_: RootState, missionId: string) => missionId],
  (missions, missionId) => missions.find(mission => mission.id === missionId) || null
);

/**
 * Sélecteur pour récupérer les valeurs métier d'une mission
 */
export const makeSelectBusinessValuesByMission = () => createSelector(
  [selectAllBusinessValues, (_: RootState, missionId: string) => missionId],
  (businessValues, missionId) => businessValues.filter(value => value.missionId === missionId)
);

/**
 * Sélecteur pour récupérer les actifs supports d'une mission
 */
export const makeSelectSupportingAssetsByMission = () => createSelector(
  [selectAllSupportingAssets, (_: RootState, missionId: string) => missionId],
  (supportingAssets, missionId) => supportingAssets.filter(asset => asset.missionId === missionId)
);

/**
 * Sélecteur pour récupérer les parties prenantes d'une mission
 */
export const makeSelectStakeholdersByMission = () => createSelector(
  [selectAllStakeholders, (_: RootState, missionId: string) => missionId],
  (stakeholders, missionId) => stakeholders.filter(stakeholder => stakeholder.missionId === missionId)
);

/**
 * Sélecteur pour récupérer une valeur métier par ID
 */
export const makeSelectBusinessValueById = () => createSelector(
  [selectAllBusinessValues, (_: RootState, businessValueId: string) => businessValueId],
  (businessValues, businessValueId) => businessValues.find(value => value.id === businessValueId) || null
);

/**
 * Sélecteur pour récupérer les actifs supports d'une valeur métier
 */
export const makeSelectSupportingAssetsByBusinessValue = () => createSelector(
  [selectAllSupportingAssets, (_: RootState, businessValueId: string) => businessValueId],
  (supportingAssets, businessValueId) => supportingAssets.filter(asset => asset.businessValueId === businessValueId)
);

/**
 * Sélecteur pour récupérer les actifs supports d'un bien essentiel
 */
export const makeSelectSupportingAssetsByEssentialAsset = () => createSelector(
  [selectAllSupportingAssets, (_: RootState, essentialAssetId: string) => essentialAssetId],
  (supportingAssets, essentialAssetId) => supportingAssets.filter(asset => asset.essentialAssetId === essentialAssetId)
);

// ===== SÉLECTEURS COMPLEXES =====

/**
 * Sélecteur pour les statistiques d'une mission
 */
export const makeSelectMissionStats = () => createSelector(
  [
    makeSelectBusinessValuesByMission(),
    makeSelectSupportingAssetsByMission(),
    makeSelectStakeholdersByMission()
  ],
  (businessValues, supportingAssets, stakeholders) => ({
    businessValuesCount: businessValues.length,
    supportingAssetsCount: supportingAssets.length,
    stakeholdersCount: stakeholders.length,
    totalElements: businessValues.length + supportingAssets.length + stakeholders.length
  })
);

/**
 * Sélecteur pour les missions avec leurs statistiques
 */
export const selectMissionsWithStats = createSelector(
  [selectAllMissions, selectAllBusinessValues, selectAllSupportingAssets, selectAllStakeholders],
  (missions, businessValues, supportingAssets, stakeholders) => 
    missions.map(mission => {
      const missionBusinessValues = businessValues.filter(bv => bv.missionId === mission.id);
      const missionSupportingAssets = supportingAssets.filter(sa => sa.missionId === mission.id);
      const missionStakeholders = stakeholders.filter(sh => sh.missionId === mission.id);
      
      return {
        ...mission,
        stats: {
          businessValuesCount: missionBusinessValues.length,
          supportingAssetsCount: missionSupportingAssets.length,
          stakeholdersCount: missionStakeholders.length,
          totalElements: missionBusinessValues.length + missionSupportingAssets.length + missionStakeholders.length,
          completionPercentage: calculateMissionCompletion(missionBusinessValues, missionSupportingAssets, missionStakeholders)
        }
      };
    })
);

/**
 * Sélecteur pour les valeurs métier avec leurs actifs supports
 */
export const makeSelectBusinessValuesWithAssets = () => createSelector(
  [makeSelectBusinessValuesByMission(), selectAllSupportingAssets],
  (businessValues, allSupportingAssets) =>
    businessValues.map(businessValue => ({
      ...businessValue,
      supportingAssets: allSupportingAssets.filter(asset => asset.businessValueId === businessValue.id)
    }))
);

/**
 * Sélecteur pour les actifs supports groupés par type
 */
export const makeSelectSupportingAssetsByType = () => createSelector(
  [makeSelectSupportingAssetsByMission()],
  (supportingAssets) => {
    const grouped: Record<string, SupportingAsset[]> = {};
    supportingAssets.forEach(asset => {
      if (!grouped[asset.type]) {
        grouped[asset.type] = [];
      }
      grouped[asset.type].push(asset);
    });
    return grouped;
  }
);

/**
 * Sélecteur pour les missions actives (en cours)
 */
export const selectActiveMissions = createSelector(
  [selectAllMissions],
  (missions) => missions.filter(mission => mission.status === 'in_progress')
);

/**
 * Sélecteur pour les missions terminées
 */
export const selectCompletedMissions = createSelector(
  [selectAllMissions],
  (missions) => missions.filter(mission => mission.status === 'completed')
);

// ===== FONCTIONS UTILITAIRES =====

/**
 * Calcule le pourcentage de completion d'une mission
 */
function calculateMissionCompletion(
  businessValues: BusinessValue[],
  supportingAssets: SupportingAsset[],
  stakeholders: Stakeholder[]
): number {
  const minBusinessValues = 3;
  const minSupportingAssets = 5;
  const minStakeholders = 3;
  
  const businessValuesScore = Math.min(100, (businessValues.length / minBusinessValues) * 100);
  const supportingAssetsScore = Math.min(100, (supportingAssets.length / minSupportingAssets) * 100);
  const stakeholdersScore = Math.min(100, (stakeholders.length / minStakeholders) * 100);
  
  return Math.round((businessValuesScore + supportingAssetsScore + stakeholdersScore) / 3);
}

/**
 * Sélecteur pour les statistiques globales
 */
export const selectGlobalStats = createSelector(
  [selectAllBusinessValues, selectAllSupportingAssets, selectAllStakeholders],
  (businessValues, supportingAssets, stakeholders) => ({
    businessValuesCount: businessValues.length,
    supportingAssetsCount: supportingAssets.length,
    stakeholdersCount: stakeholders.length
  })
);

/**
 * Sélecteur pour les valeurs métier par mission (version directe)
 */
export const selectBusinessValuesByMissionDirect = createSelector(
  [selectAllBusinessValues, (_: RootState, missionId: string) => missionId],
  (businessValues, missionId) => businessValues.filter(bv => bv.missionId === missionId)
);

// ===== HOOKS PERSONNALISÉS POUR SÉLECTEURS PARAMÉTRÉS =====

/**
 * Hook pour utiliser un sélecteur paramétré de manière optimisée
 */
export const useMemoizedSelector = <T, P>(
  selectorFactory: () => (state: RootState, param: P) => T,
  param: P
) => {
  const selector = useMemo(selectorFactory, []);
  return useSelector((state: RootState) => selector(state, param));
};

// Export des hooks pour faciliter l'utilisation
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

export const useMissionById = (missionId: string) => {
  const selector = useMemo(makeSelectMissionById, []);
  return useSelector((state: RootState) => selector(state, missionId));
};

export const useBusinessValuesByMission = (missionId: string) => {
  const selector = useMemo(makeSelectBusinessValuesByMission, []);
  return useSelector((state: RootState) => selector(state, missionId));
};

export const useSupportingAssetsByMission = (missionId: string) => {
  const selector = useMemo(makeSelectSupportingAssetsByMission, []);
  return useSelector((state: RootState) => selector(state, missionId));
};

export const useStakeholdersByMission = (missionId: string) => {
  const selector = useMemo(makeSelectStakeholdersByMission, []);
  return useSelector((state: RootState) => selector(state, missionId));
};

export const useBusinessValueById = (businessValueId: string) => {
  const selector = useMemo(makeSelectBusinessValueById, []);
  return useSelector((state: RootState) => selector(state, businessValueId));
};

export const useSupportingAssetsByBusinessValue = (businessValueId: string) => {
  const selector = useMemo(makeSelectSupportingAssetsByBusinessValue, []);
  return useSelector((state: RootState) => selector(state, businessValueId));
};
