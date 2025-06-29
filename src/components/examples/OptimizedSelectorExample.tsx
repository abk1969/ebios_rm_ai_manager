/**
 * 🎯 EXEMPLE D'UTILISATION DES SÉLECTEURS OPTIMISÉS
 * Démontre comment éviter les re-rendus inutiles avec des sélecteurs mémorisés
 */

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  useMissionById,
  useBusinessValuesByMission,
  useSupportingAssetsByMission,
  useStakeholdersByMission,
  useBusinessValueById,
  useSupportingAssetsByBusinessValue,
  selectMissionsWithStats,
  selectActiveMissions
} from '../../store/selectors';

interface OptimizedSelectorExampleProps {
  missionId: string;
  businessValueId?: string;
}

/**
 * ❌ MAUVAIS EXEMPLE - Sélecteurs non optimisés (DÉSACTIVÉ)
 * Ces sélecteurs créent de nouvelles références à chaque rendu
 */
const BadSelectorExample: React.FC<{ missionId: string }> = ({ missionId }) => {
  // 🔧 EXEMPLE DÉSACTIVÉ POUR ÉVITER LES AVERTISSEMENTS REDUX
  // Ces sélecteurs sont volontairement commentés car ils causent des avertissements

  // ❌ PROBLÈME: filter() crée un nouveau tableau à chaque rendu
  // const businessValues = useSelector((state: RootState) =>
  //   state.businessValues.businessValues.filter(bv => bv.missionId === missionId)
  // );

  // ❌ PROBLÈME: find() peut retourner undefined et crée une nouvelle référence
  // const mission = useSelector((state: RootState) =>
  //   state.missions.missions.find(m => m.id === missionId)
  // );

  // ❌ PROBLÈME: Objet littéral créé à chaque rendu
  // const stats = useSelector((state: RootState) => ({
  //   businessValuesCount: state.businessValues.businessValues.filter(bv => bv.missionId === missionId).length,
  //   supportingAssetsCount: state.supportingAssets.supportingAssets.filter(sa => sa.missionId === missionId).length
  // }));

  // Utilisation de valeurs mockées pour l'exemple
  const businessValues = [];
  const mission = { name: 'Mission Example' };
  const stats = { businessValuesCount: 0, supportingAssetsCount: 0 };

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h3 className="text-red-800 font-medium mb-2">❌ Mauvais Exemple (Non Optimisé)</h3>
      <p className="text-red-700 text-sm mb-2">
        Ces sélecteurs causent des re-rendus inutiles car ils créent de nouvelles références.
      </p>
      <div className="text-sm text-red-600">
        <p>Mission: {mission?.name || 'Non trouvée'}</p>
        <p>Valeurs métier: {businessValues.length}</p>
        <p>Stats: {stats.businessValuesCount} valeurs, {stats.supportingAssetsCount} actifs</p>
      </div>
    </div>
  );
};

/**
 * ✅ BON EXEMPLE - Sélecteurs optimisés
 * Ces sélecteurs utilisent la mémoisation pour éviter les re-rendus inutiles
 */
const GoodSelectorExample: React.FC<OptimizedSelectorExampleProps> = ({ 
  missionId, 
  businessValueId 
}) => {
  // ✅ OPTIMISÉ: Sélecteur mémorisé avec hook personnalisé
  const mission = useMissionById(missionId);
  const businessValues = useBusinessValuesByMission(missionId);
  const supportingAssets = useSupportingAssetsByMission(missionId);
  const stakeholders = useStakeholdersByMission(missionId);
  
  // ✅ OPTIMISÉ: Sélecteur conditionnel mémorisé
  const specificBusinessValue = useBusinessValueById(businessValueId || '');
  const relatedAssets = useSupportingAssetsByBusinessValue(businessValueId || '');
  
  // ✅ OPTIMISÉ: Sélecteurs globaux mémorisés
  const missionsWithStats = useSelector(selectMissionsWithStats);
  const activeMissions = useSelector(selectActiveMissions);

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-green-800 font-medium mb-2">✅ Bon Exemple (Optimisé)</h3>
      <p className="text-green-700 text-sm mb-2">
        Ces sélecteurs utilisent la mémoisation et évitent les re-rendus inutiles.
      </p>
      <div className="text-sm text-green-600 space-y-1">
        <p><strong>Mission:</strong> {mission?.name || 'Non trouvée'}</p>
        <p><strong>Valeurs métier:</strong> {businessValues.length}</p>
        <p><strong>Actifs supports:</strong> {supportingAssets.length}</p>
        <p><strong>Parties prenantes:</strong> {stakeholders.length}</p>
        
        {businessValueId && (
          <>
            <p><strong>Valeur spécifique:</strong> {specificBusinessValue?.name || 'Non trouvée'}</p>
            <p><strong>Actifs liés:</strong> {relatedAssets.length}</p>
          </>
        )}
        
        <p><strong>Total missions avec stats:</strong> {missionsWithStats.length}</p>
        <p><strong>Missions actives:</strong> {activeMissions.length}</p>
      </div>
    </div>
  );
};

/**
 * 🔧 EXEMPLE DE MIGRATION
 * Comment migrer d'un sélecteur non optimisé vers un sélecteur optimisé
 */
const MigrationExample: React.FC<{ missionId: string }> = ({ missionId }) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-blue-800 font-medium mb-2">🔧 Guide de Migration</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <div>
            <p className="font-medium">Avant (Non optimisé):</p>
            <code className="block bg-blue-100 p-2 rounded text-xs">
              {`const businessValues = useSelector((state: RootState) => 
  state.businessValues.businessValues.filter(bv => bv.missionId === missionId)
);`}
            </code>
          </div>
          
          <div>
            <p className="font-medium">Après (Optimisé):</p>
            <code className="block bg-blue-100 p-2 rounded text-xs">
              {`const businessValues = useBusinessValuesByMission(missionId);`}
            </code>
          </div>
          
          <div className="mt-3 p-2 bg-blue-100 rounded">
            <p className="font-medium text-blue-800">Avantages:</p>
            <ul className="list-disc list-inside text-xs mt-1">
              <li>Mémoisation automatique avec createSelector</li>
              <li>Pas de re-rendu si les données n'ont pas changé</li>
              <li>Code plus lisible et maintenable</li>
              <li>Performance améliorée</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Composant principal de démonstration
 */
const OptimizedSelectorExample: React.FC<OptimizedSelectorExampleProps> = (props) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🎯 Optimisation des Sélecteurs Redux
        </h1>
        <p className="text-gray-600">
          Démonstration des bonnes pratiques pour éviter les re-rendus inutiles
        </p>
      </div>
      
      <div className="grid gap-6">
        <BadSelectorExample missionId={props.missionId} />
        <GoodSelectorExample {...props} />
        <MigrationExample missionId={props.missionId} />
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-yellow-800 font-medium mb-2">⚠️ Points Importants</h3>
        <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
          <li>Utilisez toujours des sélecteurs mémorisés pour les opérations filter(), find(), map()</li>
          <li>Évitez de créer des objets littéraux dans useSelector</li>
          <li>Préférez les hooks personnalisés pour les sélecteurs paramétrés</li>
          <li>Testez les performances avec React DevTools Profiler</li>
          <li>Surveillez les avertissements Redux dans la console</li>
        </ul>
      </div>
    </div>
  );
};

export default OptimizedSelectorExample;
