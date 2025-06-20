/**
 * 🎯 INTERFACE UNIFIÉE DE FORMATION
 * Composant unifié qui harmonise tous les modules de formation
 * Architecture cohérente entre chat expert et workshops
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MessageCircle,
  BookOpen,
  BarChart3,
  Settings,
  HelpCircle,
  Target,
  Clock,
  Brain,
  Award,
  Wifi,
  WifiOff,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useTrainingModuleState, useTrainingModuleActions } from '../context/TrainingModuleContext';
import { ExpandableChatInterface } from './ExpandableChatInterface';
import { IntegratedWorkshopManager } from './IntegratedWorkshopManager';
import { UnifiedProgressDashboard } from './UnifiedProgressDashboard';
import { TrainingHelpGuide } from './TrainingHelpGuide';
import { UnifiedDataManager } from '../../domain/services/UnifiedDataManager';
import { DataSynchronizationService } from '../../domain/services/DataSynchronizationService';
import { StorageAdapterFactory } from '../../infrastructure/storage/StorageAdapters';
import { TrainingHarmonizationService } from '../../domain/services/TrainingHarmonizationService';
import { UnifiedModeSelector } from './UnifiedModeSelector';

// 🎯 TYPES UNIFIÉS
export interface UnifiedTrainingInterfaceProps {
  sessionId?: string;
  trainingMode?: 'chat-expert' | 'workshops' | 'mixed';
  initialTab?: 'chat' | 'workshops' | 'progress' | 'resources' | 'help';
  onSessionEnd?: () => void;
  onError?: (error: any) => void;
  onModeChange?: (mode: string) => void;
  className?: string;
  compact?: boolean;
}

// 🎯 CONFIGURATION DES MODES
const TRAINING_MODES = {
  'chat-expert': {
    label: 'Chat Expert',
    icon: MessageCircle,
    description: 'Formation interactive avec IA expert EBIOS RM',
    availableTabs: ['chat', 'progress', 'resources', 'help']
  },
  'workshops': {
    label: 'Ateliers EBIOS RM',
    icon: BookOpen,
    description: 'Formation structurée par les 5 ateliers',
    availableTabs: ['workshops', 'progress', 'resources', 'help']
  },
  'mixed': {
    label: 'Formation Complète',
    icon: Target,
    description: 'Combinaison chat expert + ateliers',
    availableTabs: ['chat', 'workshops', 'progress', 'resources', 'help']
  }
} as const;

/**
 * 🎯 COMPOSANT PRINCIPAL UNIFIÉ
 */
export const UnifiedTrainingInterface: React.FC<UnifiedTrainingInterfaceProps> = ({
  sessionId,
  trainingMode = 'mixed',
  initialTab = 'chat',
  onSessionEnd,
  onError,
  onModeChange,
  className = '',
  compact = false
}) => {
  // 🎪 HOOKS CONTEXTE
  const state = useTrainingModuleState();
  const actions = useTrainingModuleActions();

  // 💾 RÉFÉRENCES SÉCURISÉES
  const dataManagerRef = useRef<UnifiedDataManager | null>(null);
  const syncServiceRef = useRef<DataSynchronizationService | null>(null);
  const harmonizationServiceRef = useRef<TrainingHarmonizationService | null>(null);
  const [isDataManagerReady, setIsDataManagerReady] = useState(false);

  // 🎯 ÉTAT LOCAL UNIFIÉ
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);

  // 🎯 CONFIGURATION DU MODE ACTUEL
  const currentModeConfig = TRAINING_MODES[trainingMode];
  const availableTabs = currentModeConfig.availableTabs;

  // 💾 INITIALISATION SYSTÈME PERSISTANCE
  useEffect(() => {
    const initializePersistence = async () => {
      try {
        console.log('🔄 Initialisation système persistance unifié...');
        
        const storageAdapter = StorageAdapterFactory.createRecommendedAdapter();
        const dm = UnifiedDataManager.getInstance(storageAdapter);
        dataManagerRef.current = dm;

        const ss = DataSynchronizationService.getInstance(dm);
        syncServiceRef.current = ss;

        // Initialiser service d'harmonisation
        const hs = TrainingHarmonizationService.getInstance();
        harmonizationServiceRef.current = hs;

        setIsDataManagerReady(true);

        if (sessionId) {
          dm.startAutoSave(sessionId, 30);
          DataSynchronizationService.emitSessionStart(sessionId);
        }

        console.log('✅ Système persistance unifié initialisé');
      } catch (error) {
        console.error('❌ Erreur initialisation persistance:', error);
        setIsDataManagerReady(true); // Continuer sans persistance
      }
    };

    initializePersistence();

    return () => {
      if (dataManagerRef.current) {
        dataManagerRef.current.stopAutoSave();
      }
      if (syncServiceRef.current && sessionId) {
        DataSynchronizationService.emitSessionEnd(sessionId, 0, {});
      }
    };
  }, [sessionId]);

  // 🎯 INITIALISATION SESSION
  useEffect(() => {
    if (sessionId && state.sessionStatus === 'idle' && isDataManagerReady) {
      actions.setSessionId(sessionId);
    }
  }, [sessionId, state.sessionStatus, actions, isDataManagerReady]);

  // 🎯 GESTION CHANGEMENT ONGLET
  const handleTabChange = useCallback((tab: string) => {
    if (availableTabs.includes(tab as any)) {
      setActiveTab(tab);
      actions.setActiveTab(tab as any);
    }
  }, [availableTabs, actions]);

  // 🎯 GESTION PLEIN ÉCRAN
  const handleFullscreenToggle = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  // 🎯 GESTION CHANGEMENT MODE
  const handleModeChange = useCallback((newMode: string) => {
    if (onModeChange) {
      onModeChange(newMode);
    }
  }, [onModeChange]);

  // 🎯 GESTION COMPLETION
  const handleWorkshopComplete = useCallback((results: any) => {
    console.log('🎯 Workshop terminé:', results);
    
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

    actions.updateProgress({
      completionPercentage: state.progress.completionPercentage + 10,
      timeSpent: state.progress.timeSpent + (results.timeSpent || 0)
    });

    if (onSessionEnd) {
      onSessionEnd();
    }
  }, [sessionId, isDataManagerReady, actions, state.progress, onSessionEnd]);

  // 🎯 GESTION ACTIVITÉ CHAT - AVEC HARMONISATION
  const handleChatActivity = useCallback((data: any) => {
    if (dataManagerRef.current && harmonizationServiceRef.current && sessionId && isDataManagerReady) {
      try {
        // Harmoniser les données chat
        const harmonizedData = harmonizationServiceRef.current.harmonizeChatExpertData({
          messages: state.messages,
          metrics: state.metrics,
          timeSpent: state.progress.timeSpent,
          sessionId,
          lastActivity: data
        });

        // Sauvegarder données harmonisées
        dataManagerRef.current.updateModeData(sessionId, 'expert-chat', {
          harmonizedData,
          lastActivity: data,
          activityTime: new Date().toISOString()
        }).catch(error => {
          console.error('❌ Erreur sauvegarde chat harmonisé:', error);
        });
      } catch (error) {
        console.error('❌ Erreur harmonisation chat:', error);
      }
    }
  }, [sessionId, isDataManagerReady, state.messages, state.metrics, state.progress]);

  // 🎯 RENDU CONTENU PRINCIPAL
  const renderMainContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <ExpandableChatInterface
            trainingMode={trainingMode}
            onActivity={handleChatActivity}
            sessionId={sessionId}
          />
        );
      case 'workshops':
        return (
          <IntegratedWorkshopManager
            initialWorkshop={1}
            onComplete={handleWorkshopComplete}
            sessionId={sessionId}
            trainingMode={trainingMode}
          />
        );
      case 'progress':
        return (
          <div className="p-6">
            <UnifiedProgressDashboard
              sessionId={sessionId || 'default-session'}
              currentMode={trainingMode}
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
        return availableTabs.includes('chat') ? (
          <ExpandableChatInterface
            trainingMode={trainingMode}
            onActivity={handleChatActivity}
            sessionId={sessionId}
          />
        ) : (
          <IntegratedWorkshopManager
            initialWorkshop={1}
            onComplete={handleWorkshopComplete}
            sessionId={sessionId}
            trainingMode={trainingMode}
          />
        );
    }
  };

  // 🎯 ÉCRAN DE CHARGEMENT
  if (!isDataManagerReady) {
    return (
      <div className={`unified-training-interface h-full flex flex-col bg-white ${className}`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Initialisation formation EBIOS RM</h3>
            <p className="text-sm text-gray-600">Préparation de l'environnement sécurisé...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`unified-training-interface h-full flex flex-col bg-white ${className} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header unifié */}
      {!compact && (
        <header className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Mode et navigation */}
            <div className="flex items-center space-x-4">
              <UnifiedModeSelector
                currentMode={trainingMode}
                onModeChange={handleModeChange}
                compact={true}
              />
              
              {/* Navigation onglets */}
              <nav className="flex space-x-1">
                {availableTabs.map((tab) => {
                  const tabConfig = {
                    chat: { label: 'Chat Expert', icon: MessageCircle },
                    workshops: { label: 'Ateliers', icon: BookOpen },
                    progress: { label: 'Progression', icon: BarChart3 },
                    resources: { label: 'Ressources', icon: BookOpen },
                    help: { label: 'Aide', icon: HelpCircle }
                  }[tab];

                  if (!tabConfig) return null;

                  return (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      className={`
                        flex items-center space-x-1 px-3 py-1.5 rounded text-sm font-medium transition-all
                        ${activeTab === tab
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }
                      `}
                    >
                      <tabConfig.icon className="w-4 h-4" />
                      <span>{tabConfig.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Métriques et contrôles */}
            <div className="flex items-center space-x-4">
              {/* Métriques rapides */}
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Target className="w-3 h-3" />
                  <span>{state.progress.completionPercentage.toFixed(0)}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{Math.floor(state.progress.timeSpent / 60)}h{state.progress.timeSpent % 60}m</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Brain className="w-3 h-3" />
                  <span>{state.metrics.engagementScore}/100</span>
                </div>
              </div>

              {/* Contrôles */}
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 ${state.isOnline ? 'text-green-500' : 'text-red-500'}`}>
                  {state.isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                  <span className="text-xs">{state.isOnline ? 'En ligne' : 'Hors ligne'}</span>
                </div>
                
                <button
                  onClick={handleFullscreenToggle}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Contenu principal */}
      <main className="flex-1 overflow-hidden">
        {renderMainContent()}
      </main>

      {/* Notifications d'erreurs */}
      {state.errors.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
          {state.errors[state.errors.length - 1]}
        </div>
      )}
    </div>
  );
};

export default UnifiedTrainingInterface;
