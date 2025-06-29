import React, { useState, useEffect } from 'react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AlertTriangle, CheckCircle, Database, Brain } from 'lucide-react';

/**
 * Panneau de debug pour vérifier l'intégration Firebase + AI
 * À retirer en production
 */
export const FirebaseDebugPanel: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkFirebaseIntegration();
  }, []);

  const checkFirebaseIntegration = async () => {
    setLoading(true);
    const info: any = {
      businessValues: { hasAI: false, sample: null },
      dreadedEvents: { hasAI: false, sample: null },
      riskSources: { hasAI: false, sample: null },
      attackPaths: { hasAI: false, sample: null },
      securityMeasures: { hasAI: false, sample: null }
    };

    try {
      // Vérifier les valeurs métier
      const bvQuery = query(collection(db, 'businessValues'), limit(1));
      const bvSnapshot = await getDocs(bvQuery);
      if (!bvSnapshot.empty) {
        const bvData = bvSnapshot.docs[0].data();
        info.businessValues.hasAI = !!bvData.aiMetadata;
        info.businessValues.sample = bvData.aiMetadata;
      }

      // Vérifier les événements redoutés
      const deQuery = query(collection(db, 'dreadedEvents'), limit(1));
      const deSnapshot = await getDocs(deQuery);
      if (!deSnapshot.empty) {
        const deData = deSnapshot.docs[0].data();
        info.dreadedEvents.hasAI = !!deData.aiAnalysis;
        info.dreadedEvents.sample = deData.aiAnalysis;
      }

      // Vérifier les sources de risque
      const rsQuery = query(collection(db, 'riskSources'), limit(1));
      const rsSnapshot = await getDocs(rsQuery);
      if (!rsSnapshot.empty) {
        const rsData = rsSnapshot.docs[0].data();
        info.riskSources.hasAI = !!rsData.aiProfile;
        info.riskSources.sample = rsData.aiProfile;
      }

      // Vérifier les chemins d'attaque
      const apQuery = query(collection(db, 'attackPaths'), limit(1));
      const apSnapshot = await getDocs(apQuery);
      if (!apSnapshot.empty) {
        const apData = apSnapshot.docs[0].data();
        info.attackPaths.hasAI = !!apData.aiMetadata;
        info.attackPaths.sample = apData.aiMetadata;
      }

      // Vérifier les mesures de sécurité
      const smQuery = query(collection(db, 'securityMeasures'), limit(1));
      const smSnapshot = await getDocs(smQuery);
      if (!smSnapshot.empty) {
        const smData = smSnapshot.docs[0].data();
        info.securityMeasures.hasAI = !!smData.aiMetadata;
        info.securityMeasures.sample = smData.aiMetadata;
      }

    } catch (error) {
      console.error('Erreur vérification Firebase:', error);
    }

    setDebugInfo(info);
    setLoading(false);
  };

  if (loading) {
    return <div className="p-4">Vérification en cours...</div>;
  }

  return (
    <div className="bg-gray-100 rounded-lg p-4 space-y-3">
      <h3 className="font-semibold text-gray-900 flex items-center">
        <Database className="h-5 w-5 mr-2" />
        État Firebase + AI
      </h3>

      {Object.entries(debugInfo).map(([collection, data]: [string, any]) => (
        <div key={collection} className="bg-white rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">{collection}</span>
            {data.hasAI ? (
              <span className="flex items-center text-green-600 text-xs">
                <CheckCircle className="h-4 w-4 mr-1" />
                AI activé
              </span>
            ) : (
              <span className="flex items-center text-orange-600 text-xs">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Pas de données AI
              </span>
            )}
          </div>
          
          {data.sample && (
            <div className="text-xs bg-gray-50 rounded p-2 max-h-32 overflow-auto">
              <pre>{JSON.stringify(data.sample, null, 2).substring(0, 200)}...</pre>
            </div>
          )}
        </div>
      ))}

      <div className="text-xs text-gray-500 mt-4">
        <Brain className="h-3 w-3 inline mr-1" />
        Les métadonnées AI doivent être générées automatiquement lors de la création/modification
      </div>
    </div>
  );
};

export default FirebaseDebugPanel; 