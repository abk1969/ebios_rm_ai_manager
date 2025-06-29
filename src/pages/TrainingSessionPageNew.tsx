/**
 * 🎓 PAGE DE SESSION DE FORMATION EBIOS RM - VERSION INDÉPENDANTE
 * Architecture Micro-Frontend avec isolation totale
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { TrainingModuleProvider } from '../modules/training/presentation/context/TrainingModuleContext';
import { TrainingInterface } from '../modules/training/presentation/components/TrainingInterface';
import { RealTrainingSessionService, RealTrainingSession } from '../services/training/RealTrainingSessionService';
import { ArrowLeft, BookOpen, Shield, Award } from 'lucide-react';
import LoopDetector from '../components/debug/LoopDetector';

/**
 * 🎯 COMPOSANT PRINCIPAL INDÉPENDANT
 */
export const TrainingSessionPageNew: React.FC = () => {
  // 🎯 HOOKS
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 🎯 RÉCUPÉRATION DU MODE DE FORMATION
  const trainingMode = searchParams.get('mode') || 'discovery';

  // 🎯 ÉTAT LOCAL SIMPLIFIÉ
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realSession, setRealSession] = useState<RealTrainingSession | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  // 🎯 SERVICE
  const trainingService = RealTrainingSessionService.getInstance();

  // 🔄 INITIALISATION SIMPLIFIÉE
  useEffect(() => {
    if (!sessionId) {
      setError('ID de session manquant');
      setIsLoading(false);
      return;
    }

    loadRealSession(sessionId);
  }, [sessionId]);

  // 🔄 CHARGEMENT SESSION RÉELLE AVEC MODE
  const loadRealSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🎓 Chargement de la session de formation réelle:', sessionId, 'Mode:', trainingMode);

      let session = await trainingService.getSessionById(sessionId);

      if (!session) {
        console.log('🔄 Session non trouvée, chargement des sessions disponibles...');
        const allSessions = await trainingService.getAllRealSessions();

        if (allSessions.length > 0) {
          session = allSessions[0];
          console.log('✅ Session par défaut chargée:', session.title);
        }
      }

      if (session) {
        // 🎯 ADAPTATION DE LA SESSION SELON LE MODE
        const adaptedSession = adaptSessionForMode(session, trainingMode);
        setRealSession(adaptedSession);
        console.log('✅ Session réelle chargée avec succès:', adaptedSession.title, 'Mode:', trainingMode);
      } else {
        setError('Aucune session de formation disponible');
      }

      setIsLoading(false);

    } catch (err) {
      console.error('❌ Erreur lors du chargement de la session:', err);
      setError('Erreur lors du chargement de la session');
      setIsLoading(false);
    }
  };

  // 🎯 ADAPTATION DE LA SESSION SELON LE MODE
  const adaptSessionForMode = (session: RealTrainingSession, mode: string): RealTrainingSession => {
    const modeConfig = {
      'discovery': {
        title: '🔍 Découverte d\'EBIOS RM',
        description: 'Apprenez les fondamentaux de la méthode EBIOS Risk Manager',
        focus: 'Concepts de base et méthodologie générale'
      },
      'case-study': {
        title: '📋 Cas d\'étude pratique',
        description: 'Analysez un cas réel du secteur de la santé',
        focus: 'Application concrète sur le CHU Métropolitain'
      },
      'workshops': {
        title: '🎯 Ateliers interactifs',
        description: 'Pratiquez les 5 ateliers EBIOS RM avec l\'IA',
        focus: 'Exercices pratiques sur tous les ateliers'
      },
      'expert-chat': {
        title: '💬 Chat avec l\'expert',
        description: 'Posez vos questions à l\'expert IA EBIOS RM',
        focus: 'Questions personnalisées et approfondissement'
      }
    };

    const config = modeConfig[mode as keyof typeof modeConfig] || modeConfig.discovery;

    return {
      ...session,
      title: config.title,
      description: config.description,
      trainingMode: mode,
      specialFocus: config.focus
    };
  };

  // 🎯 GESTION DES ÉVÉNEMENTS
  const handleBackToList = () => {
    navigate('/training');
  };

  const handleSessionEnd = () => {
    console.log('✅ Session de formation terminée avec succès !');
    navigate('/training');
  };

  const handleError = (error: any) => {
    console.error('Erreur session formation:', error);
  };

  // 🎯 RENDU CHARGEMENT
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la session de formation...</p>
        </div>
      </div>
    );
  }

  // 🎯 RENDU ERREUR
  if (error || !realSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">{error || 'Session introuvable'}</p>
          <button
            onClick={handleBackToList}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour aux formations
          </button>
        </div>
      </div>
    );
  }

  // 🎯 RENDU PRINCIPAL AVEC CONTEXTE ISOLÉ
  return (
    <>
      {/* 🔍 DÉTECTEUR DE BOUCLES (MODE DEBUG) */}
      {import.meta.env.DEV && (
        <LoopDetector
          componentName="TrainingSessionPageNew"
          threshold={5}
          timeWindow={3000}
        />
      )}

      {/* 🎯 PROVIDER CONTEXTE ISOLÉ */}
      <TrainingModuleProvider initialSessionId={sessionId}>
        <div className="h-screen flex flex-col bg-gray-50">
          {/* En-tête compact */}
          <div className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleBackToList}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    <span className="text-sm">Retour</span>
                  </button>
                  
                  <div className="border-l border-gray-300 pl-4">
                    <h1 className="text-lg font-bold text-gray-900">{realSession.title}</h1>
                    <p className="text-sm text-gray-600">{realSession.organization}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">{realSession.sector}</span> • 
                    <span className="font-medium text-gray-900 ml-1">{realSession.certificationLevel}</span>
                  </div>
                  {realSession.anssiValidation.validated && (
                    <div className="flex items-center text-green-600 text-sm bg-green-50 px-2 py-1 rounded">
                      <Shield className="w-4 h-4 mr-1" />
                      <span>ANSSI {realSession.anssiValidation.complianceScore}%</span>
                    </div>
                  )}
                  <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Informations
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 flex overflow-hidden">
            {/* Interface de formation ISOLÉE */}
            <div className="flex-1 flex flex-col bg-white">
              <TrainingInterface
                sessionId={sessionId}
                trainingMode={trainingMode}
                onSessionEnd={handleSessionEnd}
                onError={handleError}
                className="flex-1 h-full"
              />
            </div>
            
            {/* Sidebar coulissante */}
            {showSidebar && (
              <div className="w-96 bg-gray-50 border-l border-gray-200 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Cas d'étude réel */}
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                      Cas d'étude réel
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-700">Organisation:</span>
                        <p className="text-xs text-gray-600">{realSession.realCaseStudy.organizationType}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-700">Menace:</span>
                        <p className="text-xs text-gray-600">{realSession.realCaseStudy.threat}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-700">Impact:</span>
                        <p className="text-xs text-gray-600">{realSession.realCaseStudy.impact}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Objectifs d'apprentissage */}
                  <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Objectifs</h3>
                    <ul className="space-y-1">
                      {realSession.learningObjectives.slice(0, 3).map((objective, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Validation ANSSI */}
                  {realSession.anssiValidation.validated && (
                    <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                      <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                        <Award className="w-4 h-4 mr-2" />
                        Validation ANSSI
                      </h3>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-green-700">Conformité:</span>
                          <span className="font-medium text-green-900">{realSession.anssiValidation.complianceScore}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Validé le:</span>
                          <span className="font-medium text-green-900">{realSession.anssiValidation.validationDate}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </TrainingModuleProvider>
    </>
  );
};

export default TrainingSessionPageNew;
