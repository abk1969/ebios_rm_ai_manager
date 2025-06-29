/**
 * 🔍 DIAGNOSTIC DES SÉLECTEURS REDUX
 * Composant pour identifier les sélecteurs qui causent des re-rendus inutiles
 */

import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface SelectorDiagnosticProps {
  enabled?: boolean;
}

/**
 * Hook pour traquer les changements de sélecteurs
 */
const useTrackedSelector = <T,>(
  selector: (state: RootState) => T,
  name: string
): T => {
  const previousValue = useRef<T>();
  const renderCount = useRef(0);
  
  const value = useSelector(selector);
  
  useEffect(() => {
    renderCount.current++;
    
    if (previousValue.current !== undefined && previousValue.current !== value) {
      // Vérifier si c'est une vraie différence ou juste une nouvelle référence
      const isReferenceChange = JSON.stringify(previousValue.current) === JSON.stringify(value);
      
      if (isReferenceChange) {
        console.warn(`🚨 Sélecteur "${name}" retourne une nouvelle référence avec les mêmes données:`, {
          previous: previousValue.current,
          current: value,
          renderCount: renderCount.current
        });
      } else {
        console.log(`✅ Sélecteur "${name}" a changé légitimement:`, {
          previous: previousValue.current,
          current: value,
          renderCount: renderCount.current
        });
      }
    }
    
    previousValue.current = value;
  }, [value, name]);
  
  return value;
};

/**
 * Composant de diagnostic des sélecteurs
 */
const ReduxSelectorDiagnostic: React.FC<SelectorDiagnosticProps> = ({
  enabled = false // 🔧 TEMPORAIREMENT DÉSACTIVÉ pour éviter les erreurs
}) => {
  const [diagnostics, setDiagnostics] = useState<Array<{
    name: string;
    renderCount: number;
    lastChange: string;
    hasIssue: boolean;
  }>>([]);

  // 🔧 DIAGNOSTIC DÉSACTIVÉ POUR ÉVITER LES AVERTISSEMENTS REDUX
  // Tous les sélecteurs sont remplacés par des valeurs mockées

  // Valeurs mockées pour éviter les sélecteurs problématiques
  const missions = [];
  const selectedMission = null;
  const businessValues = [];
  const supportingAssets = [];
  const stakeholders = [];
  const filteredBusinessValues = [];
  const missionStats = {
    businessValuesCount: 0,
    supportingAssetsCount: 0,
    stakeholdersCount: 0
  };

  // Les vrais sélecteurs sont commentés pour éviter les avertissements
  // const missions = useTrackedSelector(state => state.missions?.missions || [], 'missions');
  // const selectedMission = useTrackedSelector(state => state.missions?.selectedMission || null, 'selectedMission');
  // const businessValues = useTrackedSelector(state => state.businessValues?.businessValues || [], 'businessValues');
  // const supportingAssets = useTrackedSelector(state => state.supportingAssets?.supportingAssets || [], 'supportingAssets');
  // const stakeholders = useTrackedSelector(state => state.stakeholders?.stakeholders || [], 'stakeholders');
  // const filteredBusinessValues = useTrackedSelector(
  //   state => (state.businessValues?.businessValues || []).filter(bv => bv.missionId === selectedMission?.id),
  //   'filteredBusinessValues'
  // );
  // const missionStats = useTrackedSelector(
  //   state => ({
  //     businessValuesCount: state.businessValues?.businessValues?.length || 0,
  //     supportingAssetsCount: state.supportingAssets?.supportingAssets?.length || 0,
  //     stakeholdersCount: state.stakeholders?.stakeholders?.length || 0
  //   }),
  //   'missionStats'
  // );

  if (!enabled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">🔍 Redux Diagnostic</h3>
        <button
          onClick={() => setDiagnostics([])}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Clear
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium">Missions:</span> {missions.length}
          </div>
          <div>
            <span className="font-medium">Business Values:</span> {businessValues.length}
          </div>
          <div>
            <span className="font-medium">Supporting Assets:</span> {supportingAssets.length}
          </div>
          <div>
            <span className="font-medium">Stakeholders:</span> {stakeholders.length}
          </div>
        </div>
        
        <div className="border-t pt-2">
          <div className="text-gray-600">Mission sélectionnée:</div>
          <div className="font-medium">{selectedMission?.name || 'Aucune'}</div>
        </div>
        
        <div className="border-t pt-2">
          <div className="text-gray-600">Valeurs filtrées:</div>
          <div className="font-medium">{filteredBusinessValues.length}</div>
        </div>
        
        <div className="border-t pt-2">
          <div className="text-gray-600">Stats mission:</div>
          <div className="font-medium">
            BV: {missionStats.businessValuesCount}, 
            SA: {missionStats.supportingAssetsCount}, 
            SH: {missionStats.stakeholdersCount}
          </div>
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t">
        <div className="text-xs text-gray-500">
          Ouvrez la console pour voir les détails des changements de sélecteurs.
        </div>
      </div>
    </div>
  );
};

/**
 * Hook pour détecter les sélecteurs problématiques
 */
export const useReduxSelectorMonitor = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Intercepter les avertissements Redux
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (args[0]?.includes?.('Selector unknown returned a different result')) {
        console.group('🚨 Redux Selector Warning');
        console.warn(...args);
        console.trace('Stack trace:');
        console.groupEnd();
      } else {
        originalWarn(...args);
      }
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);
};

/**
 * Composant wrapper pour activer le monitoring automatique
 */
export const ReduxSelectorMonitor: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useReduxSelectorMonitor();
  
  return (
    <>
      {children}
      <ReduxSelectorDiagnostic />
    </>
  );
};

export default ReduxSelectorDiagnostic;
