/**
 * 🎓 MODULE FORMATION SIMPLE - VERSION DÉVELOPPEMENT
 * Version simplifiée sans dépendances complexes pour le développement
 * Alternative légère au module complet avec EventEmitter
 */

import React, { useState } from 'react';
import { Shield, Play, BookOpen, Award, Clock, CheckCircle, AlertCircle } from 'lucide-react';

// 🎯 TYPES SIMPLIFIÉS
interface SimpleTrainingConfig {
  learnerId: string;
  sector: string;
  level: string;
  objectives: string[];
}

interface TrainingModuleSimpleProps {
  learnerId: string;
  config: SimpleTrainingConfig;
  onSessionCreated?: (sessionId: string) => void;
  onProgress?: (progress: { percentage: number; currentStep: string }) => void;
  onCompleted?: (results: { score: number; certification: boolean }) => void;
  onError?: (error: Error) => void;
  className?: string;
  height?: string;
}

// 🎓 COMPOSANT SIMPLE
export const TrainingModuleSimple: React.FC<TrainingModuleSimpleProps> = ({
  learnerId,
  config,
  onSessionCreated,
  onProgress,
  onCompleted,
  onError,
  className = '',
  height = '800px'
}) => {
  // 🎯 ÉTAT LOCAL
  const [status, setStatus] = useState<'ready' | 'starting' | 'active' | 'completed' | 'error'>('ready');
  const [progress, setProgress] = useState({ percentage: 0, currentStep: 'Initialisation' });
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // 🚀 DÉMARRAGE DE LA FORMATION
  const handleStartTraining = async () => {
    try {
      setStatus('starting');
      setProgress({ percentage: 0, currentStep: 'Création de la session...' });

      // Simulation de création de session
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSessionCreated?.(sessionId);
      setStatus('active');
      setProgress({ percentage: 10, currentStep: 'Atelier 1: Cadrage et socle de sécurité' });
      onProgress?.({ percentage: 10, currentStep: 'Atelier 1: Cadrage et socle de sécurité' });

      // Simulation de progression
      simulateProgress();

    } catch (error) {
      setStatus('error');
      onError?.(error instanceof Error ? error : new Error('Erreur inconnue'));
    }
  };

  // 📊 SIMULATION DE PROGRESSION
  const simulateProgress = () => {
    const steps = [
      { percentage: 20, step: 'Atelier 1: Identification des biens supports' },
      { percentage: 40, step: 'Atelier 2: Sources de risques' },
      { percentage: 60, step: 'Atelier 3: Scénarios stratégiques' },
      { percentage: 80, step: 'Atelier 4: Scénarios opérationnels' },
      { percentage: 100, step: 'Atelier 5: Traitement du risque' }
    ];

    let currentStepIndex = 0;

    const progressInterval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        const currentStep = steps[currentStepIndex];
        setProgress({ percentage: currentStep.percentage, currentStep: currentStep.step });
        onProgress?.({ percentage: currentStep.percentage, currentStep: currentStep.step });
        currentStepIndex++;
      } else {
        clearInterval(progressInterval);
        setStatus('completed');
        onCompleted?.({ score: 85, certification: true });
      }
    }, 2000);
  };

  // 🎨 RENDU SELON LE STATUT
  const renderContent = () => {
    switch (status) {
      case 'ready':
        return (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center max-w-md">
              <Shield className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Formation EBIOS RM Interactive
              </h2>
              <p className="text-gray-600 mb-6">
                Module de formation découplé et sécurisé
              </p>
              
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Configuration</h3>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Secteur:</span>
                    <span className="font-medium">{config.sector}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Niveau:</span>
                    <span className="font-medium">{config.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Apprenant:</span>
                    <span className="font-medium">{learnerId}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                <div className="text-center">
                  <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <span>8-12h</span>
                </div>
                <div className="text-center">
                  <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <span>5 ateliers</span>
                </div>
                <div className="text-center">
                  <Award className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <span>Certification</span>
                </div>
              </div>

              <button
                onClick={handleStartTraining}
                className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Play className="h-5 w-5 mr-2" />
                Commencer la formation
              </button>
            </div>
          </div>
        );

      case 'starting':
        return (
          <div className="flex items-center justify-center h-full bg-blue-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Initialisation de la formation
              </h3>
              <p className="text-gray-600">{progress.currentStep}</p>
            </div>
          </div>
        );

      case 'active':
        return (
          <div className="h-full bg-white">
            {/* Barre de progression */}
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Formation en cours</h3>
                <span className="text-sm text-gray-600">{progress.percentage}% complété</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">{progress.currentStep}</p>
            </div>

            {/* Contenu de formation simulé */}
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-3">
                    {progress.currentStep}
                  </h4>
                  <p className="text-blue-800">
                    Formation interactive en cours... Le module découplé simule une session 
                    EBIOS RM complète avec les 5 ateliers officiels.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Objectifs actuels</h5>
                    <ul className="space-y-1">
                      {config.objectives.slice(0, 2).map((objective, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Progression</h5>
                    <div className="space-y-2">
                      {['Atelier 1', 'Atelier 2', 'Atelier 3', 'Atelier 4', 'Atelier 5'].map((atelier, index) => (
                        <div key={index} className="flex items-center">
                          <div className={`
                            w-4 h-4 rounded-full mr-3
                            ${(index + 1) * 20 <= progress.percentage 
                              ? 'bg-green-500' 
                              : 'bg-gray-300'}
                          `} />
                          <span className={`text-sm ${
                            (index + 1) * 20 <= progress.percentage 
                              ? 'text-green-700 font-medium' 
                              : 'text-gray-600'
                          }`}>
                            {atelier}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'completed':
        return (
          <div className="flex items-center justify-center h-full bg-green-50">
            <div className="text-center max-w-md">
              <Award className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-green-900 mb-4">
                Formation terminée avec succès !
              </h2>
              <p className="text-green-700 mb-6">
                Félicitations ! Vous avez complété votre formation EBIOS RM.
              </p>
              
              <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Résultats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Score final:</span>
                    <span className="font-medium text-green-600">85/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Certification:</span>
                    <span className="font-medium text-green-600">✅ Obtenue</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durée:</span>
                    <span className="font-medium">10 minutes (simulé)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Nouvelle formation
              </button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="flex items-center justify-center h-full bg-red-50">
            <div className="text-center max-w-md">
              <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-red-900 mb-4">
                Erreur de formation
              </h2>
              <p className="text-red-700 mb-6">
                Une erreur est survenue lors de la formation.
              </p>
              <button
                onClick={() => setStatus('ready')}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Réessayer
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // 🎯 RENDU PRINCIPAL
  return (
    <div className={`training-module-simple ${className}`}>
      {/* Indicateur de sécurité */}
      <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            Module de formation découplé (Version développement)
          </span>
        </div>
        <div className="text-sm text-blue-700">
          Session: {sessionId.slice(-8)}
        </div>
      </div>

      {/* Contenu principal */}
      <div 
        className="border border-gray-200 rounded-lg overflow-hidden bg-white"
        style={{ height }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default TrainingModuleSimple;
