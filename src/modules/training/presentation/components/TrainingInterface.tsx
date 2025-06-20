/**
 * 🎓 INTERFACE PRINCIPALE DE FORMATION
 * Composant React principal pour l'expérience de formation interactive
 * Architecture Clean - Presentation Layer
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  MessageCircle,
  BookOpen,
  BarChart3,
  HelpCircle,
  Settings,
  Maximize2,
  Minimize2,
  Wifi,
  WifiOff,
  Brain,
  Target,
  Clock,
  Award,
  Users
} from 'lucide-react';
import { useTrainingModuleState, useTrainingModuleActions } from '../context/TrainingModuleContext';
import { TrainingChatInterfaceSimple } from './TrainingChatInterfaceSimple';
import { TrainingGuidedTour } from './TrainingGuidedTour';
import { TrainingHelpGuide } from './TrainingHelpGuide';
import { IntegratedWorkshopManager } from './IntegratedWorkshopManager';
import { QuickNavigationBar } from './QuickNavigationBar';
import { UnifiedTrainingNavigator } from './UnifiedTrainingNavigator';
import { UnifiedProgressDashboard } from './UnifiedProgressDashboard';
import { UnifiedMetricsManager } from '../../domain/services/UnifiedMetricsManager';
import { UnifiedDataManager } from '../../domain/services/UnifiedDataManager';
import { DataSynchronizationService } from '../../domain/services/DataSynchronizationService';
import { StorageAdapterFactory } from '../../infrastructure/storage/StorageAdapters';
import LoopDetector from '../../../../components/debug/LoopDetector';

// 🎯 PROPS DU COMPOSANT
export interface TrainingInterfaceProps {
  sessionId?: string;
  trainingMode?: string;
  onSessionEnd?: () => void;
  onError?: (error: any) => void;
  className?: string;
}

/**
 * 🎯 COMPOSANT PRINCIPAL
 */
export const TrainingInterface: React.FC<TrainingInterfaceProps> = ({
  sessionId,
  trainingMode = 'discovery',
  onSessionEnd,
  onError,
  className = ''
}) => {
  // 🎪 HOOKS CONTEXTE ISOLÉ (plus de store Zustand)
  const state = useTrainingModuleState();
  const actions = useTrainingModuleActions();

  // 💾 RÉFÉRENCES SÉCURISÉES POUR ÉVITER LES PROBLÈMES D'INITIALISATION
  const dataManagerRef = useRef<UnifiedDataManager | null>(null);
  const syncServiceRef = useRef<DataSynchronizationService | null>(null);
  const [isDataManagerReady, setIsDataManagerReady] = useState(false);

  // 🎯 ÉTAT LOCAL POUR LA VISITE GUIDÉE
  const [showTour, setShowTour] = useState(true);
  const [tourCompleted, setTourCompleted] = useState(false);

  // 🎯 ÉTAT LOCAL SIMPLIFIÉ
  const connectionStatus = state.isOnline ? 'online' : 'offline';

  // 🧭 ÉTAT NAVIGATION UNIFIÉE
  const [showNavigator, setShowNavigator] = useState(false);

  // 💾 INITIALISATION SYSTÈME PERSISTANCE - PRIORITÉ ABSOLUE
  useEffect(() => {
    const initializePersistence = async () => {
      try {
        console.log('🔄 Initialisation système de persistance...');

        // Créer adaptateur de stockage recommandé
        const storageAdapter = StorageAdapterFactory.createRecommendedAdapter();

        // Initialiser gestionnaire de données
        const dm = UnifiedDataManager.getInstance(storageAdapter);
        dataManagerRef.current = dm;

        // Initialiser service de synchronisation
        const ss = DataSynchronizationService.getInstance(dm);
        syncServiceRef.current = ss;

        // Marquer comme prêt
        setIsDataManagerReady(true);

        // Démarrer auto-save si sessionId disponible
        if (sessionId) {
          dm.startAutoSave(sessionId, 30); // 30 secondes
          DataSynchronizationService.emitSessionStart(sessionId);
        }

        console.log('✅ Système de persistance initialisé avec succès');
      } catch (error) {
        console.error('❌ Erreur initialisation persistance:', error);
        // Continuer sans persistance en cas d'erreur
        setIsDataManagerReady(true);
      }
    };

    initializePersistence();

    // Cleanup à la fermeture
    return () => {
      if (dataManagerRef.current) {
        dataManagerRef.current.stopAutoSave();
      }
      if (syncServiceRef.current && sessionId) {
        DataSynchronizationService.emitSessionEnd(sessionId, 0, {});
      }
    };
  }, [sessionId]);

  // 🎯 INITIALISATION SESSION (après que dataManager soit prêt)
  useEffect(() => {
    if (sessionId && state.sessionStatus === 'idle' && isDataManagerReady) {
      actions.setSessionId(sessionId);
    }
  }, [sessionId, state.sessionStatus, actions, isDataManagerReady]);

  // 🎯 GESTION DE LA VISITE GUIDÉE
  const handleTourComplete = () => {
    setShowTour(false);
    setTourCompleted(true);
    localStorage.setItem('training-tour-completed', 'true');
  };

  const handleTourSkip = () => {
    setShowTour(false);
    localStorage.setItem('training-tour-completed', 'true');
  };

  // 🎯 VÉRIFIER SI LA VISITE A DÉJÀ ÉTÉ FAITE
  useEffect(() => {
    const tourCompleted = localStorage.getItem('training-tour-completed');
    if (tourCompleted === 'true') {
      setShowTour(false);
      setTourCompleted(true);
    }
  }, []);

  // 🎯 GESTION DES ONGLETS SIMPLIFIÉE
  const handleTabChange = useCallback((tab: typeof state.activeTab) => {
    actions.setActiveTab(tab);
  }, [actions]);

  // 🎯 GESTION PLEIN ÉCRAN SIMPLIFIÉE
  const handleFullscreenToggle = useCallback(() => {
    actions.toggleFullscreen();

    if (!state.isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [actions, state.isFullscreen]);

  // 🎯 GESTION COMPLETION WORKSHOPS - AVEC VÉRIFICATIONS SÉCURISÉES
  const handleWorkshopComplete = useCallback((results: any) => {
    console.log('🎯 Workshop terminé:', results);

    // Mise à jour métriques unifiées
    if (results.workshopId) {
      UnifiedMetricsManager.updateWorkshopMetrics(results.workshopId, results);

      // Émettre événement synchronisation
      if (sessionId) {
        DataSynchronizationService.emitWorkshopCompletion(sessionId, results.workshopId, results);
      }
    }

    // Mise à jour données mode workshops - AVEC VÉRIFICATION SÉCURISÉE
    if (dataManagerRef.current && sessionId && isDataManagerReady) {
      dataManagerRef.current.updateModeData(sessionId, 'workshops', {
        workshopId: results.workshopId,
        completed: true,
        results,
        completedAt: new Date().toISOString()
      }).catch(error => {
        console.error('❌ Erreur sauvegarde workshop:', error);
      });
    }

    // Mettre à jour les métriques de progression locales
    actions.updateProgress({
      completionPercentage: state.progress.completionPercentage + 10,
      timeSpent: state.progress.timeSpent + (results.timeSpent || 0)
    });

    // Déclencher callback parent si fourni
    if (onSessionEnd) {
      onSessionEnd();
    }
  }, [actions, state.progress, onSessionEnd, sessionId, isDataManagerReady]);

  // 🎯 GESTION MÉTRIQUES CHAT EXPERT - AVEC VÉRIFICATIONS SÉCURISÉES
  const handleChatExpertActivity = useCallback((data: any) => {
    // Mise à jour métriques chat expert
    UnifiedMetricsManager.updateChatExpertMetrics(data);

    // Mise à jour métriques session
    if (sessionId) {
      UnifiedMetricsManager.updateSessionMetrics(sessionId, 'chat_interaction');

      // Émettre événement synchronisation
      DataSynchronizationService.emitChatActivity(sessionId, data);
    }

    // Sauvegarder activité chat - AVEC VÉRIFICATION SÉCURISÉE
    if (dataManagerRef.current && sessionId && isDataManagerReady) {
      dataManagerRef.current.updateModeData(sessionId, 'expert-chat', {
        lastActivity: data,
        activityTime: new Date().toISOString()
      }).catch(error => {
        console.error('❌ Erreur sauvegarde chat:', error);
      });
    }
  }, [sessionId, isDataManagerReady]);

  // 🎯 DÉTECTION MODE WORKSHOPS
  const isWorkshopsMode = trainingMode === 'workshops';

  // 🎯 GESTION CHANGEMENT MODE - AVEC VÉRIFICATIONS SÉCURISÉES
  const handleModeChange = useCallback((newMode: string) => {
    // Sauvegarder état actuel avant changement - AVEC VÉRIFICATION SÉCURISÉE
    if (dataManagerRef.current && sessionId && isDataManagerReady) {
      const currentData = {
        sessionId,
        userId: 'current-user', // TODO: récupérer depuis auth
        metrics: UnifiedMetricsManager.getUnifiedMetrics(sessionId),
        modeData: {},
        userPreferences: {
          language: 'fr',
          theme: 'light' as const,
          notifications: true,
          autoSave: true,
          autoSaveInterval: 30,
          dataRetention: 30,
          privacySettings: {
            shareAnalytics: true,
            shareProgress: true,
            allowCookies: true,
            dataProcessingConsent: true,
            consentDate: new Date().toISOString()
          }
        },
        progressHistory: [],
        lastSyncTime: new Date().toISOString(),
        version: '1.0.0'
      };

      dataManagerRef.current.saveTrainingSession(sessionId, currentData).catch(error => {
        console.error('❌ Erreur sauvegarde avant changement mode:', error);
      });
    }

    // Navigation via URL pour préserver l'état de session
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('mode', newMode);
    window.location.href = currentUrl.toString();
  }, [sessionId, isDataManagerReady]);

  // 🎯 RENDU CONDITIONNEL DU CONTENU AVEC WORKSHOPS
  const renderMainContent = () => {
    // Mode workshops : interface complète dédiée
    if (isWorkshopsMode) {
      return (
        <IntegratedWorkshopManager
          initialWorkshop={1}
          onComplete={handleWorkshopComplete}
        />
      );
    }

    // Modes classiques avec onglets
    switch (state.activeTab) {
      case 'chat':
        return (
          <TrainingChatInterfaceSimple
            trainingMode={trainingMode}
            onActivity={handleChatExpertActivity}
            sessionId={sessionId}
          />
        );
      case 'progress':
        return (
          <div className="p-6">
            <UnifiedProgressDashboard
              sessionId={sessionId || 'default-session'}
              currentMode={trainingMode || 'expert-chat'}
              onNavigateToMode={handleModeChange}
            />
          </div>
        );
      case 'resources':
        return (
          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ressources EBIOS RM</h3>
            <div className="space-y-4">
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium text-gray-900">Guide ANSSI EBIOS RM</h4>
                <p className="text-sm text-gray-600 mt-1">Documentation officielle de la méthode</p>
              </div>
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium text-gray-900">Cas d'usage sectoriels</h4>
                <p className="text-sm text-gray-600 mt-1">Exemples d'application par secteur</p>
              </div>
            </div>
          </div>
        );
      case 'help':
        return <TrainingHelpGuide />;
      default:
        return <TrainingChatInterfaceSimple />;
    }
  };

  // 🎯 INDICATEUR DE STATUT
  const renderStatusIndicator = () => {
    const getStatusColor = () => {
      switch (connectionStatus) {
        case 'online': return 'text-green-500';
        case 'offline': return 'text-red-500';
        case 'reconnecting': return 'text-yellow-500';
        default: return 'text-gray-500';
      }
    };

    const StatusIcon = connectionStatus === 'online' ? Wifi : WifiOff;

    return (
      <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
        <StatusIcon className="w-4 h-4" />
        <span className="text-sm font-medium">
          {connectionStatus === 'online' ? 'En ligne' : 
           connectionStatus === 'offline' ? 'Hors ligne' : 'Reconnexion...'}
        </span>
      </div>
    );
  };

  // 🎯 MÉTRIQUES RAPIDES
  const renderQuickMetrics = () => (
    <div className="flex items-center space-x-6 text-sm text-gray-600">
      <div className="flex items-center space-x-1">
        <Target className="w-4 h-4" />
        <span>{state.progress.completionPercentage.toFixed(0)}%</span>
      </div>
      <div className="flex items-center space-x-1">
        <Clock className="w-4 h-4" />
        <span>{Math.floor(state.progress.timeSpent / 60)}h{state.progress.timeSpent % 60}m</span>
      </div>
      <div className="flex items-center space-x-1">
        <Brain className="w-4 h-4" />
        <span>{state.metrics.engagementScore}/100</span>
      </div>
      <div className="flex items-center space-x-1">
        <Award className="w-4 h-4" />
        <span>{state.progress.badges.length}</span>
      </div>
    </div>
  );

  // 🎯 NAVIGATION ONGLETS
  const renderTabNavigation = () => {
    const tabs = [
      { id: 'chat', label: 'Formation', icon: MessageCircle },
      { id: 'progress', label: 'Progression', icon: BarChart3 },
      { id: 'resources', label: 'Ressources', icon: BookOpen },
      { id: 'help', label: 'Aide', icon: HelpCircle }
    ] as const;

    return (
      <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`${id}-tab`}
            onClick={() => handleTabChange(id)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all
              ${state.activeTab === id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    );
  };

  // 🎯 ÉCRAN DE CHARGEMENT PENDANT INITIALISATION
  if (!isDataManagerReady) {
    return (
      <div className={`training-interface h-full flex flex-col bg-white ${className}`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Initialisation du module de formation</h3>
            <p className="text-sm text-gray-600">Préparation de l'environnement sécurisé...</p>
          </div>
        </div>
      </div>
    );
  }

  // 🎯 RENDU PRINCIPAL - VERSION SIMPLIFIÉE POUR INTÉGRATION
  return (
    <>
      {/* 🔍 DÉTECTEUR DE BOUCLES (MODE DEBUG) */}
      {import.meta.env.DEV && (
        <LoopDetector
          componentName="TrainingInterface"
          threshold={5}
          timeWindow={3000}
        />
      )}

      <div className={`training-interface h-full flex flex-col bg-white ${className}`}>
      {/* 🧭 BARRE NAVIGATION RAPIDE INTER-MODES */}
      <QuickNavigationBar
        currentMode={trainingMode || 'expert-chat'}
        sessionId={sessionId || 'default-session'}
        onModeChange={handleModeChange}
        showFullNavigator={() => setShowNavigator(true)}
      />

      {/* 🎯 HEADER COMPACT - Masqué en mode workshops */}
      {!isWorkshopsMode && (
        <header className="bg-gray-50 border-b border-gray-200 px-4 py-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Navigation onglets compacte */}
            <div className="flex space-x-1">
              {[
                { id: 'chat' as const, label: 'Chat Expert', icon: MessageCircle },
                { id: 'progress' as const, label: 'Progression', icon: BarChart3 },
                { id: 'resources' as const, label: 'Ressources', icon: BookOpen }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleTabChange(id)}
                  className={`
                    flex items-center space-x-1 px-3 py-1.5 rounded text-sm font-medium transition-all
                    ${state.activeTab === id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Métriques compactes */}
            <div className="flex items-center space-x-4 text-xs text-gray-600">
              <div className="flex items-center space-x-1">
                <Target className="w-3 h-3" />
                <span>{state.progress.completionPercentage.toFixed(0)}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <Brain className="w-3 h-3" />
                <span>{state.metrics.engagementScore}/100</span>
              </div>
              {renderStatusIndicator()}
            </div>
          </div>
        </header>
      )}

      {/* 🎯 CONTENU PRINCIPAL - PLEINE HAUTEUR */}
      <main className="flex-1 overflow-hidden">
        {renderMainContent()}
      </main>

      {/* 🎯 NOTIFICATIONS SIMPLIFIÉES */}
      {state.errors.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {state.errors[state.errors.length - 1]}
        </div>
      )}

      {/* 🎓 VISITE GUIDÉE */}
      <TrainingGuidedTour
        isVisible={showTour && !tourCompleted}
        onComplete={handleTourComplete}
        onSkip={handleTourSkip}
      />

      {/* 🧭 MODAL NAVIGATION COMPLÈTE */}
      {showNavigator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Navigation Formation</h2>
              <button
                onClick={() => setShowNavigator(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <UnifiedTrainingNavigator
                currentMode={trainingMode || 'expert-chat'}
                sessionId={sessionId || 'default-session'}
                onModeChange={(mode) => {
                  handleModeChange(mode);
                  setShowNavigator(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default TrainingInterface;
