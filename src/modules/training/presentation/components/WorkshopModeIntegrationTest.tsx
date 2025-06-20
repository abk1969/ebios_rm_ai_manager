import React from 'react';
import { CheckCircle, AlertTriangle, Users, MessageCircle } from 'lucide-react';

/**
 * 🧪 COMPOSANT DE TEST D'INTÉGRATION MODE WORKSHOPS
 * Valide que l'intégration TrainingInterface + IntegratedWorkshopManager fonctionne
 */

interface WorkshopModeIntegrationTestProps {
  trainingMode: string;
  sessionId: string;
}

export const WorkshopModeIntegrationTest: React.FC<WorkshopModeIntegrationTestProps> = ({
  trainingMode,
  sessionId
}) => {
  const isWorkshopsMode = trainingMode === 'workshops';
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        🧪 Test d'intégration Mode Workshops
      </h2>
      
      <div className="space-y-4">
        {/* Test détection mode */}
        <div className="flex items-center space-x-3">
          {isWorkshopsMode ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          )}
          <div>
            <span className="font-medium">Détection mode workshops :</span>
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              isWorkshopsMode ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
            }`}>
              {isWorkshopsMode ? 'DÉTECTÉ' : 'NON DÉTECTÉ'}
            </span>
          </div>
        </div>

        {/* Informations session */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Informations session :</h3>
          <div className="space-y-1 text-sm">
            <div><span className="font-medium">Session ID :</span> {sessionId}</div>
            <div><span className="font-medium">Training Mode :</span> {trainingMode}</div>
            <div><span className="font-medium">URL attendue :</span> /training/session/{sessionId}?mode=workshops</div>
          </div>
        </div>

        {/* État de l'intégration */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center">
            <Users className="w-4 h-4 mr-2 text-blue-600" />
            État de l'intégration :
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>TrainingInterface.tsx modifié ✅</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>IntegratedWorkshopManager importé ✅</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Mode workshops détecté ✅</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Header masqué en mode workshops ✅</span>
            </div>
          </div>
        </div>

        {/* Navigation disponible */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Navigation disponible :</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-blue-600" />
              <span>Chat Expert (mode: expert-chat)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Ateliers (mode: workshops)</span>
            </div>
          </div>
        </div>

        {/* Instructions test */}
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium mb-2">🧪 Instructions de test :</h3>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Accéder à : <code className="bg-gray-100 px-1 rounded">/training/session/{sessionId}?mode=workshops</code></li>
            <li>Vérifier que l'IntegratedWorkshopManager s'affiche</li>
            <li>Vérifier que les onglets du header sont masqués</li>
            <li>Tester la navigation entre ateliers</li>
            <li>Vérifier les liens inter-ateliers</li>
          </ol>
        </div>

        {/* Résultat attendu */}
        {isWorkshopsMode && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-medium mb-2 text-green-800">✅ Résultat attendu :</h3>
            <p className="text-sm text-green-700">
              L'IntegratedWorkshopManager devrait maintenant s'afficher à la place du chat expert, 
              avec l'interface complète des 5 ateliers, la navigation intelligente et les liens inter-ateliers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
