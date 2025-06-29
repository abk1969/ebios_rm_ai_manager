/**
 * 🧠 INTERFACE INTELLIGENTE WORKSHOP 1
 * Interface principale intégrant tous les composants Point 1 + Point 2 + Point 3
 * POINT 3 - Interface Utilisateur React Intelligente
 */

import React, { useState, useEffect } from 'react';
import { EbiosExpertProfile } from '../../../../infrastructure/a2a/types/AgentCardTypes';
import { Workshop1Dashboard } from './Workshop1Dashboard';
import { useWorkshop1Intelligence } from '../hooks/useWorkshop1Intelligence';
import { useNotifications } from '../../../../contexts/NotificationContext';
import '../styles/workshop1-animations.css';

// 🎯 TYPES POUR L'INTERFACE

interface Workshop1IntelligentInterfaceProps {
  userProfile: EbiosExpertProfile;
  onComplete?: () => void;
  onModuleChange?: (moduleId: string) => void;
  className?: string;
}

interface InterfaceState {
  isInitialized: boolean;
  currentView: 'dashboard' | 'module' | 'collaboration' | 'analytics';
  isFullscreen: boolean;
  showWelcome: boolean;
  adaptiveHints: AdaptiveHint[];
}

interface AdaptiveHint {
  id: string;
  type: 'tip' | 'warning' | 'insight' | 'celebration';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  autoHide?: boolean;
  duration?: number;
}

// 🧠 COMPOSANT PRINCIPAL

export const Workshop1IntelligentInterface: React.FC<Workshop1IntelligentInterfaceProps> = ({
  userProfile,
  onComplete,
  onModuleChange,
  className = ''
}) => {
  const [intelligenceState, intelligenceActions] = useWorkshop1Intelligence();
  const { createNotification } = useNotifications();
  const [interfaceState, setInterfaceState] = useState<InterfaceState>({
    isInitialized: false,
    currentView: 'dashboard',
    isFullscreen: false,
    showWelcome: true,
    adaptiveHints: []
  });

  // 🚀 INITIALISATION DE L'INTERFACE

  useEffect(() => {
    const initializeInterface = async () => {
      try {
        console.log('🧠 Initialisation Interface Intelligente Workshop 1...');
        
        // Initialisation de l'intelligence
        await intelligenceActions.initializeSession(userProfile);
        
        // Génération des hints adaptatifs
        const hints = generateAdaptiveHints(userProfile, intelligenceState.expertiseLevel);
        
        setInterfaceState(prev => ({
          ...prev,
          isInitialized: true,
          adaptiveHints: hints
        }));

        // Notification de bienvenue personnalisée
        setTimeout(() => {
          generateWelcomeNotification(userProfile, intelligenceState.expertiseLevel);
        }, 1000);

        console.log('✅ Interface Intelligente initialisée');
        
      } catch (error) {
        console.error('❌ Erreur initialisation interface:', error);
        
        await createNotification({
          type: 'error',
          category: 'system',
          priority: 'high',
          title: 'Erreur d\'initialisation',
          message: 'Impossible d\'initialiser l\'interface intelligente. Veuillez réessayer.',
          context: {
            userId: userProfile.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        });
      }
    };

    if (!interfaceState.isInitialized && userProfile) {
      initializeInterface();
    }
  }, [userProfile, intelligenceActions, interfaceState.isInitialized, intelligenceState.expertiseLevel, createNotification]);

  // 💡 GÉNÉRATION D'HINTS ADAPTATIFS

  const generateAdaptiveHints = (profile: EbiosExpertProfile, expertiseLevel: any): AdaptiveHint[] => {
    const hints: AdaptiveHint[] = [];

    // Hints selon le niveau d'expertise
    if (expertiseLevel?.level === 'junior' || expertiseLevel?.level === 'intermediate') {
      hints.push({
        id: 'guidance_tip',
        type: 'tip',
        title: '💡 Conseil Adaptatif',
        message: 'L\'interface s\'adapte automatiquement à votre niveau. N\'hésitez pas à explorer les fonctionnalités avancées.',
        autoHide: true,
        duration: 8000
      });
    }

    if (expertiseLevel?.level === 'expert' || expertiseLevel?.level === 'master') {
      hints.push({
        id: 'expert_features',
        type: 'insight',
        title: '🎓 Mode Expert Activé',
        message: 'Accédez aux fonctionnalités avancées : collaboration A2A, insights sectoriels, et validation méthodologique.',
        action: {
          label: 'Explorer',
          onClick: () => intelligenceActions.toggleExpertMode()
        }
      });
    }

    // Hints selon le secteur
    if (profile.sector === 'santé') {
      hints.push({
        id: 'sector_insight',
        type: 'insight',
        title: '🏥 Spécialisation Santé',
        message: 'Des insights spécifiques au secteur santé sont disponibles : continuité des soins, HDS, RGPD santé.',
        action: {
          label: 'Voir Insights',
          onClick: () => intelligenceActions.requestExpertInsight('secteur santé')
        }
      });
    }

    return hints;
  };

  // 🎉 NOTIFICATION DE BIENVENUE

  const generateWelcomeNotification = async (profile: EbiosExpertProfile, expertiseLevel: any) => {
    const welcomeMessages = {
      master: `🎓 Bienvenue Maître ${profile.name} ! Interface experte activée avec fonctionnalités avancées.`,
      expert: `🏆 Bienvenue Expert ${profile.name} ! Accès complet aux outils de collaboration et validation.`,
      senior: `👨‍💼 Bienvenue ${profile.name} ! Interface adaptée à votre expérience senior.`,
      intermediate: `📚 Bienvenue ${profile.name} ! Interface guidée avec support adaptatif.`,
      junior: `🌟 Bienvenue ${profile.name} ! Interface d'apprentissage avec guidance complète.`
    };

    const message = welcomeMessages[expertiseLevel?.level as keyof typeof welcomeMessages] || 
                   `Bienvenue ${profile.name} dans Workshop 1 EBIOS RM !`;

    await createNotification({
      type: 'success',
      category: 'workshop',
      priority: 'medium',
      title: '🎯 Workshop 1 - Socle de Sécurité',
      message,
      context: {
        workshopId: 1,
        userId: profile.id,
        expertiseLevel: expertiseLevel?.level
      }
    });
  };

  // 🎨 GESTION DES VUES

  const handleViewChange = (view: InterfaceState['currentView']) => {
    setInterfaceState(prev => ({ ...prev, currentView: view }));
  };

  // 📱 GESTION DU PLEIN ÉCRAN

  const toggleFullscreen = () => {
    setInterfaceState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  };

  // 💡 GESTION DES HINTS

  const dismissHint = (hintId: string) => {
    setInterfaceState(prev => ({
      ...prev,
      adaptiveHints: prev.adaptiveHints.filter(h => h.id !== hintId)
    }));
  };

  // 🔄 AUTO-HIDE DES HINTS

  useEffect(() => {
    interfaceState.adaptiveHints.forEach(hint => {
      if (hint.autoHide && hint.duration) {
        setTimeout(() => {
          dismissHint(hint.id);
        }, hint.duration);
      }
    });
  }, [interfaceState.adaptiveHints]);

  // 📊 GESTION DES ÉVÉNEMENTS

  const handleModuleChange = (moduleId: string) => {
    onModuleChange?.(moduleId);
    
    // Déclenchement d'adaptation si nécessaire
    intelligenceActions.triggerAdaptation('module_change', { moduleId });
  };

  const handleSessionComplete = () => {
    // Finalisation de la session
    intelligenceActions.finalizeSession();
    onComplete?.();
  };

  // 🔄 ÉTATS DE CHARGEMENT

  if (intelligenceState.isInitializing || !interfaceState.isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            🧠 Initialisation de l'Intelligence
          </h2>
          <p className="text-gray-600">
            Configuration de l'interface adaptative pour {userProfile.name}...
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Niveau détecté: {intelligenceState.expertiseLevel?.level || 'Analyse en cours...'}
          </div>
        </div>
      </div>
    );
  }

  if (intelligenceState.error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md animate-fade-in">
          <div className="text-6xl mb-4">🚨</div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Erreur d'Intelligence
          </h2>
          <p className="text-gray-600 mb-4">{intelligenceState.error}</p>
          <div className="space-x-2">
            <button
              onClick={() => intelligenceActions.resetSession()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Réinitialiser
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Recharger
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🎯 RENDU PRINCIPAL

  return (
    <div 
      className={`h-screen bg-gray-50 overflow-hidden ${
        interfaceState.isFullscreen ? 'fixed inset-0 z-50' : ''
      } ${className}`}
      style={{ 
        backgroundColor: intelligenceState.interfaceTheme.backgroundColor,
        color: intelligenceState.interfaceTheme.textColor 
      }}
    >
      {/* Hints adaptatifs */}
      <div>
        {interfaceState.adaptiveHints.map((hint, index) => (
          <div
            key={hint.id}
            className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg border animate-slide-in-right ${
              hint.type === 'tip' ? 'bg-blue-50 border-blue-200' :
              hint.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
              hint.type === 'insight' ? 'bg-purple-50 border-purple-200' :
              'bg-green-50 border-green-200'
            }`}
            style={{
              top: `${1 + index * 6}rem`,
              animationDelay: `${index * 0.2}s`
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{hint.title}</h4>
                <p className="text-sm text-gray-600">{hint.message}</p>
                {hint.action && (
                  <button
                    onClick={hint.action.onClick}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    {hint.action.label}
                  </button>
                )}
              </div>
              <button
                onClick={() => dismissHint(hint.id)}
                className="text-gray-400 hover:text-gray-600 ml-2"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interface principale */}
      <div className="h-full animate-fade-in">
        {interfaceState.currentView === 'dashboard' && (
          <Workshop1Dashboard
            userProfile={userProfile}
            onModuleChange={handleModuleChange}
            onSessionComplete={handleSessionComplete}
          />
        )}
      </div>

      {/* Contrôles d'interface */}
      <div className="fixed bottom-4 left-4 flex space-x-2 z-40">
        <button
          onClick={toggleFullscreen}
          className="p-3 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
          title={interfaceState.isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
        >
          {interfaceState.isFullscreen ? '🔲' : '⛶'}
        </button>

        <button
          onClick={() => intelligenceActions.refreshMetrics()}
          className="p-3 bg-white border border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
          title="Actualiser les métriques"
        >
          📊
        </button>

        {intelligenceState.expertiseLevel?.level === 'expert' || intelligenceState.expertiseLevel?.level === 'master' ? (
          <button
            onClick={() => intelligenceActions.requestExpertInsight('interface_optimization')}
            className="p-3 bg-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
            title="Demander un insight expert"
          >
            💡
          </button>
        ) : null}
      </div>

      {/* Indicateur de traitement */}
      <div>
        {intelligenceState.isProcessing && (
          <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg z-40 animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="font-medium">Intelligence en action...</span>
            </div>
          </div>
        )}
      </div>

      {/* Overlay pour plein écran */}
      {interfaceState.isFullscreen && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Workshop1IntelligentInterface;
