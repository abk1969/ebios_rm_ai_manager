/**
 * 📊 DASHBOARD WORKSHOP 1 ADAPTATIF
 * Interface principale adaptée au niveau d'expertise
 * POINT 3 - Interface Utilisateur React Intelligente
 */

import React, { useEffect, useState } from 'react';
import { EbiosExpertProfile } from '../../../../infrastructure/a2a/types/AgentCardTypes';
import { useWorkshop1Intelligence } from '../hooks/useWorkshop1Intelligence';
import { ExpertNotificationPanel } from './ExpertNotificationPanel';
import { A2ACollaborationInterface } from './A2ACollaborationInterface';
import { RealTimeMetricsDisplay } from './RealTimeMetricsDisplay';
import { AdaptiveProgressTracker } from './AdaptiveProgressTracker';
import { ExpertActionToolbar } from './ExpertActionToolbar';

// 🎯 TYPES POUR LE DASHBOARD

interface Workshop1DashboardProps {
  userProfile: EbiosExpertProfile;
  onModuleChange?: (moduleId: string) => void;
  onSessionComplete?: () => void;
  className?: string;
}

interface DashboardLayout {
  mainContent: React.ReactNode;
  sidebar: React.ReactNode;
  notifications: React.ReactNode;
  collaboration?: React.ReactNode;
  metrics?: React.ReactNode;
}

// 📊 COMPOSANT PRINCIPAL

export const Workshop1Dashboard: React.FC<Workshop1DashboardProps> = ({
  userProfile,
  onModuleChange,
  onSessionComplete,
  className = ''
}) => {
  const [intelligenceState, intelligenceActions] = useWorkshop1Intelligence();
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeModule, setActiveModule] = useState<string>('introduction');

  // 🚀 INITIALISATION

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        console.log('📊 Initialisation Dashboard Workshop 1...');
        await intelligenceActions.initializeSession(userProfile);
        setIsInitialized(true);
        console.log('✅ Dashboard initialisé avec succès');
      } catch (error) {
        console.error('❌ Erreur initialisation dashboard:', error);
      }
    };

    if (!isInitialized && userProfile) {
      initializeDashboard();
    }
  }, [userProfile, intelligenceActions, isInitialized]);

  // 📱 GESTION DES MODULES

  const handleModuleChange = async (moduleId: string) => {
    setActiveModule(moduleId);
    
    await intelligenceActions.updateProgress({
      currentModule: moduleId,
      lastActivity: new Date()
    });
    
    onModuleChange?.(moduleId);
  };

  // 🎨 GÉNÉRATION DU LAYOUT ADAPTATIF

  const generateAdaptiveLayout = (): DashboardLayout => {
    const { layoutConfiguration, expertiseLevel, interfaceTheme } = intelligenceState;

    // Contenu principal adaptatif
    const mainContent = (
      <div className="flex-1 p-6 animate-fade-in">
        <AdaptiveMainContent
          expertiseLevel={expertiseLevel}
          activeModule={activeModule}
          onModuleChange={handleModuleChange}
          theme={interfaceTheme}
        />
      </div>
    );

    // Sidebar adaptative
    const sidebar = (
      <div
        className={`w-80 bg-white border-r border-gray-200 ${
          layoutConfiguration.sidebarPosition === 'hidden' ? 'hidden' : ''
        }`}
      >
        <AdaptiveProgressTracker
          progress={intelligenceState.sessionProgress}
          expertiseLevel={expertiseLevel}
          onProgressUpdate={intelligenceActions.updateProgress}
        />
      </div>
    );

    // Panneau de notifications
    const notifications = (
      <div className={`${
        layoutConfiguration.notificationPosition === 'sidebar' ? 'w-80' : 'w-full'
      }`}>
        <ExpertNotificationPanel
          expertiseLevel={expertiseLevel}
          position={layoutConfiguration.notificationPosition}
          onActionTrigger={intelligenceActions.triggerAdaptation}
        />
      </div>
    );

    // Panneau de collaboration (si activé)
    const collaboration = layoutConfiguration.collaborationPanel ? (
      <div className="w-96 animate-fade-in">
        <A2ACollaborationInterface
          userProfile={userProfile}
          expertiseLevel={expertiseLevel}
          onCollaborationRequest={intelligenceActions.initiateCollaboration}
          onInsightRequest={intelligenceActions.requestExpertInsight}
        />
      </div>
    ) : undefined;

    // Métriques (si visibles)
    const metrics = layoutConfiguration.metricsVisibility !== 'hidden' ? (
      <div className="w-80 animate-fade-in">
        <RealTimeMetricsDisplay
          metrics={intelligenceState.realTimeMetrics}
          visibility={layoutConfiguration.metricsVisibility}
          onRefresh={intelligenceActions.refreshMetrics}
        />
      </div>
    ) : undefined;

    return { mainContent, sidebar, notifications, collaboration, metrics };
  };

  // 🎨 RENDU CONDITIONNEL SELON LE LAYOUT

  const renderDashboardLayout = () => {
    const layout = generateAdaptiveLayout();
    const { layoutConfiguration } = intelligenceState;

    switch (layoutConfiguration.panelLayout) {
      case 'triple':
        return (
          <div className="flex h-full animate-fade-in">
            {layout.sidebar}
            {layout.mainContent}
            <div className="flex flex-col animate-fade-in">
              {layout.notifications}
              {layout.collaboration}
              {layout.metrics}
            </div>
          </div>
        );

      case 'dual':
        return (
          <div className="flex h-full animate-fade-in">
            {layout.sidebar}
            <div className="flex-1 flex flex-col animate-fade-in">
              {layoutConfiguration.notificationPosition === 'top' && layout.notifications}
              {layout.mainContent}
              {layoutConfiguration.notificationPosition === 'bottom' && layout.notifications}
            </div>
            {layout.collaboration || layout.metrics}
          </div>
        );

      default: // single
        return (
          <div className="flex h-full animate-fade-in">
            {layout.sidebar}
            <div className="flex-1 flex flex-col animate-fade-in">
              {layoutConfiguration.notificationPosition === 'top' && layout.notifications}
              {layout.mainContent}
              {layoutConfiguration.notificationPosition === 'bottom' && layout.notifications}
            </div>
          </div>
        );
    }
  };

  // 🔄 ÉTATS DE CHARGEMENT

  if (intelligenceState.isInitializing) {
    return (
      <div className="flex items-center justify-center h-full animate-fade-in">
        <div
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        />
        <span className="ml-4 text-lg text-gray-600 animate-fade-in">
          Initialisation de l'intelligence Workshop 1...
        </span>
      </div>
    );
  }

  if (intelligenceState.error) {
    return (
      <div className="flex items-center justify-center h-full animate-fade-in">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4 animate-fade-in">❌</div>
          <h2 className="text-xl font-semibold text-red-600 mb-2 animate-fade-in">
            Erreur d'initialisation
          </h2>
          <p className="text-gray-600 mb-4 animate-fade-in">{intelligenceState.error}</p>
          <button
            onClick={() => intelligenceActions.resetSession()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 animate-fade-in"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // 🎯 RENDU PRINCIPAL

  return (
    <div 
      className={`h-full bg-gray-50 ${className}`}
      style={{ 
        backgroundColor: intelligenceState.interfaceTheme.backgroundColor,
        color: intelligenceState.interfaceTheme.textColor 
      }}
    >
      {/* Toolbar Expert (si activé) */}
      <div>
        {intelligenceState.layoutConfiguration.expertToolbar && (
          <div
            className="border-b border-gray-200 bg-white animate-fade-in"
          >
            <ExpertActionToolbar
              actions={intelligenceState.expertActions}
              theme={intelligenceState.interfaceTheme}
              onToggleExpertMode={intelligenceActions.toggleExpertMode}
              onExportSession={intelligenceActions.exportSessionData}
            />
          </div>
        )}
      </div>

      {/* Layout principal adaptatif */}
      <div className="flex-1 overflow-hidden animate-fade-in">
        {renderDashboardLayout()}
      </div>

      {/* Indicateur de traitement */}
      <div>
        {intelligenceState.isProcessing && (
          <div
            className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in"
          >
            <div className="flex items-center animate-fade-in">
              <div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2 animate-spin"
              />
              Traitement en cours...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 📱 CONTENU PRINCIPAL ADAPTATIF

interface AdaptiveMainContentProps {
  expertiseLevel: any;
  activeModule: string;
  onModuleChange: (moduleId: string) => void;
  theme: any;
}

const AdaptiveMainContent: React.FC<AdaptiveMainContentProps> = ({
  expertiseLevel,
  activeModule,
  onModuleChange,
  theme
}) => {
  const getModuleContent = () => {
    switch (activeModule) {
      case 'introduction':
        return (
          <div className="space-y-6 animate-fade-in">
            <div
              className="bg-white rounded-lg shadow-sm p-6 animate-fade-in"
            >
              <h1 className="text-2xl font-bold mb-4 animate-fade-in" style={{ color: theme.primaryColor }}>
                🎯 Workshop 1 - Socle de Sécurité
              </h1>
              <p className="text-gray-600 mb-4 animate-fade-in">
                {expertiseLevel?.level === 'master' || expertiseLevel?.level === 'expert' 
                  ? "Analyse experte du socle de sécurité avec focus sur les enjeux stratégiques et la gouvernance des risques."
                  : "Découverte du premier atelier EBIOS RM pour établir le socle de sécurité de votre organisation."
                }
              </p>
              
              {/* Modules adaptatifs selon l'expertise */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
                {getAdaptiveModules(expertiseLevel?.level).map((module, index) => (
                  <div
                    key={module.id}
                    className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors animate-fade-in"
                    onClick={() => onModuleChange(module.id)}
                  >
                    <div className="text-2xl mb-2 animate-fade-in">{module.icon}</div>
                    <h3 className="font-semibold mb-2 animate-fade-in">{module.title}</h3>
                    <p className="text-sm text-gray-600 animate-fade-in">{module.description}</p>
                    {module.expertLevel && (
                      <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded animate-fade-in">
                        {module.expertLevel}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 animate-fade-in">Module: {activeModule}</h2>
            <p className="text-gray-600 animate-fade-in">
              Contenu du module {activeModule} adapté au niveau {expertiseLevel?.level}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="h-full overflow-y-auto animate-fade-in">
      {getModuleContent()}
    </div>
  );
};

// 🎯 MODULES ADAPTATIFS

function getAdaptiveModules(expertiseLevel: string) {
  const baseModules = [
    {
      id: 'cadrage',
      title: 'Cadrage de l\'étude',
      description: 'Définition du périmètre et des enjeux',
      icon: '🎯',
      expertLevel: null
    },
    {
      id: 'biens_essentiels',
      title: 'Biens essentiels',
      description: 'Identification et hiérarchisation',
      icon: '💎',
      expertLevel: null
    },
    {
      id: 'biens_supports',
      title: 'Biens supports',
      description: 'Cartographie des dépendances',
      icon: '🏗️',
      expertLevel: null
    }
  ];

  // Modules avancés pour experts
  if (expertiseLevel === 'expert' || expertiseLevel === 'master') {
    baseModules.push(
      {
        id: 'analyse_strategique',
        title: 'Analyse stratégique',
        description: 'Enjeux business et gouvernance',
        icon: '🎭',
        expertLevel: 'Expert'
      },
      {
        id: 'coherence_methodologique',
        title: 'Cohérence méthodologique',
        description: 'Validation experte de la démarche',
        icon: '🔍',
        expertLevel: 'Expert'
      }
    );
  }

  return baseModules;
}

export default Workshop1Dashboard;
