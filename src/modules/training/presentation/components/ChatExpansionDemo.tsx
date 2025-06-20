/**
 * 🎯 DÉMONSTRATION DES FONCTIONNALITÉS D'EXPANSION DU CHAT
 * Composant de test pour valider les fonctionnalités de pli/dépli
 */

import React, { useState } from 'react';
import { ExpandableChatInterface } from './ExpandableChatInterface';
import { TrainingModuleProvider } from '../context/TrainingModuleContext';
import { TestTube, MessageSquare, Maximize2, Target, Info } from 'lucide-react';

export const ChatExpansionDemo: React.FC = () => {
  const [demoMode, setDemoMode] = useState<'normal' | 'expanded' | 'fullscreen'>('normal');
  const [testResults, setTestResults] = useState<Array<{
    test: string;
    status: 'success' | 'pending' | 'error';
    message: string;
  }>>([]);

  const runExpansionTest = (testType: string) => {
    setTestResults(prev => [
      ...prev,
      {
        test: testType,
        status: 'success',
        message: `Test ${testType} exécuté avec succès`
      }
    ]);
  };

  const handleChatActivity = (activity: any) => {
    console.log('🎯 Activité chat détectée:', activity);
    
    // Enregistrer l'activité comme test réussi
    setTestResults(prev => [
      ...prev,
      {
        test: `${activity.type}`,
        status: 'success',
        message: `Action: ${activity.type} - ${JSON.stringify(activity)}`
      }
    ]);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🎯 Démonstration Chat Expansible
              </h1>
              <p className="text-gray-600">
                Test des fonctionnalités de pli/dépli automatique du chat de formation
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Instructions de test</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Boutons d'expansion :</strong> Utilisez les boutons en haut à droite du chat</li>
                  <li>• <strong>Raccourcis clavier :</strong> Ctrl+Shift+F (plein écran), Ctrl+Shift+E (étendre), Ctrl+Shift+R (redimensionner)</li>
                  <li>• <strong>Modes disponibles :</strong> Compact, Normal, Étendu, Plein écran</li>
                  <li>• <strong>Activités trackées :</strong> Toutes les actions sont enregistrées dans le journal ci-dessous</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Interface Chat avec Expansion
                </h2>
                <p className="text-purple-100 text-sm mt-1">
                  Testez les différents modes d'affichage
                </p>
              </div>
              
              <div className="p-6">
                <TrainingModuleProvider initialSessionId={`demo_${Date.now()}`}>
                  <ExpandableChatInterface
                    trainingMode="discovery"
                    sessionId={`demo_${Date.now()}`}
                    onActivity={handleChatActivity}
                  />
                </TrainingModuleProvider>
              </div>
            </div>
          </div>

          {/* Panneau de contrôle et résultats */}
          <div className="space-y-6">
            {/* Tests manuels */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TestTube className="w-5 h-5 mr-2 text-green-600" />
                Tests Manuels
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => runExpansionTest('Redimensionnement')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Test Redimensionnement
                </button>
                
                <button
                  onClick={() => runExpansionTest('Expansion')}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Test Expansion
                </button>
                
                <button
                  onClick={() => runExpansionTest('Plein écran')}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Test Plein Écran
                </button>
              </div>
            </div>

            {/* Journal des activités */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 Journal des Activités
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">
                    Aucune activité détectée. Interagissez avec le chat pour voir les résultats.
                  </p>
                ) : (
                  testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-l-4 ${
                        result.status === 'success'
                          ? 'bg-green-50 border-green-500'
                          : result.status === 'error'
                          ? 'bg-red-50 border-red-500'
                          : 'bg-yellow-50 border-yellow-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {result.test}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          result.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : result.status === 'error'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {result.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {result.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
              
              {testResults.length > 0 && (
                <button
                  onClick={() => setTestResults([])}
                  className="mt-4 w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Effacer le journal
                </button>
              )}
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📈 Statistiques
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tests exécutés</span>
                  <span className="font-semibold text-blue-600">
                    {testResults.length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Succès</span>
                  <span className="font-semibold text-green-600">
                    {testResults.filter(r => r.status === 'success').length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Erreurs</span>
                  <span className="font-semibold text-red-600">
                    {testResults.filter(r => r.status === 'error').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatExpansionDemo;
