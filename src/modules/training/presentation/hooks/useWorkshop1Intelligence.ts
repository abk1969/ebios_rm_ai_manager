/**
 * 🧠 HOOK D'INTELLIGENCE WORKSHOP 1
 * Intégration React des agents Point 1 + Point 2
 * POINT 3 - Interface Utilisateur React Intelligente
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { EbiosExpertProfile } from '../../../../infrastructure/a2a/types/AgentCardTypes';
import { Workshop1MasterAgent } from '../../domain/services/Workshop1MasterAgent';
import { Workshop1NotificationAgent } from '../../domain/services/Workshop1NotificationAgent';
import { NotificationIntegrationService } from '../../domain/services/NotificationIntegrationService';
import { ExpertiseLevel } from '../../domain/services/AdaptiveContentService';
import { useNotifications } from '../../../../contexts/NotificationContext';

// 🎯 TYPES POUR LE HOOK

export interface Workshop1IntelligenceState {
  // Session et profil
  sessionId: string | null;
  userProfile: EbiosExpertProfile | null;
  expertiseLevel: ExpertiseLevel | null;
  
  // État des agents
  masterAgentConnected: boolean;
  notificationAgentConnected: boolean;
  a2aProtocolActive: boolean;
  
  // Progression et métriques
  sessionProgress: SessionProgress;
  realTimeMetrics: RealTimeMetrics;
  adaptationHistory: AdaptationEvent[];
  
  // Interface adaptative
  interfaceTheme: InterfaceTheme;
  layoutConfiguration: LayoutConfiguration;
  expertActions: ExpertAction[];
  
  // État de chargement
  isInitializing: boolean;
  isProcessing: boolean;
  error: string | null;
}

export interface SessionProgress {
  currentModule: string;
  moduleProgress: number; // 0-100
  overallProgress: number; // 0-100
  timeSpent: number; // en minutes
  engagementScore: number; // 0-100
  comprehensionLevel: number; // 0-100
  adaptationsApplied: number;
  lastActivity: Date;
}

export interface RealTimeMetrics {
  responseTime: number; // ms
  interactionFrequency: number; // interactions/minute
  contentRelevance: number; // 0-100
  collaborationActivity: number; // 0-100
  notificationEfficiency: number; // 0-100
  a2aMessageCount: number;
  lastUpdate: Date;
}

export interface AdaptationEvent {
  id: string;
  timestamp: Date;
  type: 'content' | 'difficulty' | 'interface' | 'notification';
  trigger: string;
  description: string;
  impact: 'minor' | 'moderate' | 'major';
  userFeedback?: 'positive' | 'neutral' | 'negative';
}

export interface InterfaceTheme {
  name: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  complexity: 'minimal' | 'standard' | 'advanced' | 'expert';
  iconSet: 'basic' | 'professional' | 'expert';
}

export interface LayoutConfiguration {
  sidebarPosition: 'left' | 'right' | 'hidden';
  panelLayout: 'single' | 'dual' | 'triple';
  notificationPosition: 'top' | 'bottom' | 'sidebar';
  metricsVisibility: 'hidden' | 'minimal' | 'detailed' | 'expert';
  collaborationPanel: boolean;
  expertToolbar: boolean;
}

export interface ExpertAction {
  id: string;
  label: string;
  icon: string;
  type: 'navigation' | 'validation' | 'collaboration' | 'insight' | 'export';
  enabled: boolean;
  badge?: string | number;
  onClick: () => void;
  tooltip: string;
  expertLevel: 'all' | 'intermediate' | 'senior' | 'expert' | 'master';
}

// 🎯 ACTIONS DU HOOK

export interface Workshop1IntelligenceActions {
  // Gestion de session
  initializeSession: (userProfile: EbiosExpertProfile) => Promise<void>;
  updateProgress: (progress: Partial<SessionProgress>) => Promise<void>;
  finalizeSession: () => Promise<void>;
  
  // Gestion des adaptations
  triggerAdaptation: (type: string, data: any) => Promise<void>;
  requestExpertInsight: (topic: string) => Promise<void>;
  initiateCollaboration: (experts: string[], topic: string) => Promise<void>;
  
  // Interface adaptative
  updateInterfaceTheme: (theme: Partial<InterfaceTheme>) => void;
  updateLayoutConfiguration: (layout: Partial<LayoutConfiguration>) => void;
  toggleExpertMode: () => void;
  
  // Métriques et monitoring
  refreshMetrics: () => Promise<void>;
  exportSessionData: () => Promise<any>;
  
  // Utilitaires
  resetSession: () => void;
  getRecommendations: () => string[];
}

// 🧠 HOOK PRINCIPAL

export const useWorkshop1Intelligence = (): [Workshop1IntelligenceState, Workshop1IntelligenceActions] => {
  // Services
  const masterAgent = useRef(Workshop1MasterAgent.getInstance());
  const notificationAgent = useRef(Workshop1NotificationAgent.getInstance());
  const integrationService = useRef(NotificationIntegrationService.getInstance());
  const { createNotification } = useNotifications();

  // État principal
  const [state, setState] = useState<Workshop1IntelligenceState>({
    sessionId: null,
    userProfile: null,
    expertiseLevel: null,
    
    masterAgentConnected: false,
    notificationAgentConnected: false,
    a2aProtocolActive: false,
    
    sessionProgress: {
      currentModule: '',
      moduleProgress: 0,
      overallProgress: 0,
      timeSpent: 0,
      engagementScore: 100,
      comprehensionLevel: 50,
      adaptationsApplied: 0,
      lastActivity: new Date()
    },
    
    realTimeMetrics: {
      responseTime: 0,
      interactionFrequency: 0,
      contentRelevance: 0,
      collaborationActivity: 0,
      notificationEfficiency: 0,
      a2aMessageCount: 0,
      lastUpdate: new Date()
    },
    
    adaptationHistory: [],
    
    interfaceTheme: {
      name: 'default',
      primaryColor: '#2563eb',
      accentColor: '#3b82f6',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      complexity: 'standard',
      iconSet: 'professional'
    },
    
    layoutConfiguration: {
      sidebarPosition: 'left',
      panelLayout: 'dual',
      notificationPosition: 'top',
      metricsVisibility: 'minimal',
      collaborationPanel: false,
      expertToolbar: false
    },
    
    expertActions: [],
    
    isInitializing: false,
    isProcessing: false,
    error: null
  });

  // 🚀 INITIALISATION DE SESSION

  const initializeSession = useCallback(async (userProfile: EbiosExpertProfile): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isInitializing: true, error: null }));
      
      console.log(`🧠 Initialisation session intelligente pour ${userProfile.name}`);
      
      // 1. Démarrage de la session avec l'agent maître
      const session = await masterAgent.current.startIntelligentSession(userProfile.id, userProfile);
      
      // 2. Détermination du thème et layout selon l'expertise
      const interfaceTheme = determineInterfaceTheme(session.analysisResult.expertiseLevel);
      const layoutConfiguration = determineLayoutConfiguration(session.analysisResult.expertiseLevel);
      
      // 3. Génération des actions expertes
      const expertActions = generateExpertActions(session.analysisResult.expertiseLevel, userProfile);
      
      // 4. Mise à jour de l'état
      setState(prev => ({
        ...prev,
        sessionId: session.sessionId,
        userProfile,
        expertiseLevel: session.analysisResult.expertiseLevel,
        masterAgentConnected: true,
        notificationAgentConnected: true,
        a2aProtocolActive: true,
        interfaceTheme,
        layoutConfiguration,
        expertActions,
        sessionProgress: {
          ...prev.sessionProgress,
          currentModule: session.currentModule,
          lastActivity: new Date()
        },
        isInitializing: false
      }));
      
      // 5. Notification de bienvenue
      await createNotification({
        type: 'success',
        category: 'workshop',
        priority: 'medium',
        title: `🎓 Bienvenue ${userProfile.name}`,
        message: `Session Workshop 1 initialisée pour niveau ${session.analysisResult.expertiseLevel.level}`,
        context: {
          workshopId: 1,
          moduleId: session.currentModule,
          userId: userProfile.id,
          sessionId: session.sessionId
        }
      });
      
      console.log(`✅ Session ${session.sessionId} initialisée avec succès`);
      
    } catch (error) {
      console.error('❌ Erreur initialisation session:', error);
      setState(prev => ({
        ...prev,
        isInitializing: false,
        error: error instanceof Error ? error.message : 'Erreur initialisation'
      }));
    }
  }, [createNotification]);

  // 📊 MISE À JOUR DE PROGRESSION

  const updateProgress = useCallback(async (progress: Partial<SessionProgress>): Promise<void> => {
    if (!state.sessionId) return;
    
    try {
      setState(prev => ({ ...prev, isProcessing: true }));
      
      // Mise à jour dans l'agent maître
      await masterAgent.current.updateSessionProgress(state.sessionId, {
        moduleProgress: progress.moduleProgress,
        timeSpent: progress.timeSpent,
        engagementIndicators: progress.engagementScore ? 
          progress.engagementScore > 80 ? ['high_engagement'] : 
          progress.engagementScore > 60 ? ['medium_engagement'] : ['low_engagement']
          : undefined
      });
      
      // Mise à jour de l'état local
      setState(prev => ({
        ...prev,
        sessionProgress: {
          ...prev.sessionProgress,
          ...progress,
          lastActivity: new Date()
        },
        isProcessing: false
      }));
      
      // Déclenchement d'adaptations si nécessaire
      if (progress.engagementScore && progress.engagementScore < 50) {
        await triggerAdaptation('engagement_low', { score: progress.engagementScore });
      }
      
    } catch (error) {
      console.error('❌ Erreur mise à jour progression:', error);
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [state.sessionId]);

  // 🔄 DÉCLENCHEMENT D'ADAPTATIONS

  const triggerAdaptation = useCallback(async (type: string, data: any): Promise<void> => {
    if (!state.sessionId || !state.userProfile || !state.expertiseLevel) return;
    
    try {
      console.log(`🔄 Déclenchement adaptation: ${type}`);
      
      // Traitement via le service d'intégration
      const context = {
        userId: state.userProfile.id,
        sessionId: state.sessionId,
        userProfile: state.userProfile,
        expertiseLevel: state.expertiseLevel,
        currentWorkshop: 1,
        currentModule: state.sessionProgress.currentModule,
        integrationMode: 'real_time' as const
      };
      
      const trigger = {
        type,
        severity: 'info' as const,
        data,
        autoGenerated: true
      };
      
      const result = await integrationService.current.processNotificationRequest(context, trigger);
      
      if (result.success) {
        // Ajout à l'historique des adaptations
        const adaptationEvent: AdaptationEvent = {
          id: `adapt_${Date.now()}`,
          timestamp: new Date(),
          type: type.includes('content') ? 'content' : 
                type.includes('interface') ? 'interface' : 
                type.includes('notification') ? 'notification' : 'difficulty',
          trigger: type,
          description: `Adaptation déclenchée: ${type}`,
          impact: 'moderate'
        };
        
        setState(prev => ({
          ...prev,
          adaptationHistory: [adaptationEvent, ...prev.adaptationHistory.slice(0, 9)] // Garder 10 max
        }));
      }
      
    } catch (error) {
      console.error('❌ Erreur déclenchement adaptation:', error);
    }
  }, [state.sessionId, state.userProfile, state.expertiseLevel, state.sessionProgress.currentModule]);

  // 💡 DEMANDE D'INSIGHT EXPERT

  const requestExpertInsight = useCallback(async (topic: string): Promise<void> => {
    if (!state.userProfile || !state.expertiseLevel) return;
    
    try {
      await triggerAdaptation('expert_insight', { topic, requestedBy: state.userProfile.id });
      
      await createNotification({
        type: 'info',
        category: 'workshop',
        priority: 'medium',
        title: '💡 Insight Expert Demandé',
        message: `Recherche d'insights experts sur: ${topic}`,
        context: {
          workshopId: 1,
          moduleId: state.sessionProgress.currentModule,
          userId: state.userProfile.id
        }
      });
      
    } catch (error) {
      console.error('❌ Erreur demande insight:', error);
    }
  }, [state.userProfile, state.expertiseLevel, state.sessionProgress.currentModule, triggerAdaptation, createNotification]);

  // 🤝 INITIATION DE COLLABORATION

  const initiateCollaboration = useCallback(async (experts: string[], topic: string): Promise<void> => {
    if (!state.userProfile || !state.expertiseLevel) return;
    
    try {
      await triggerAdaptation('collaboration_request', { 
        experts, 
        topic, 
        initiator: state.userProfile.id 
      });
      
      await createNotification({
        type: 'action',
        category: 'workshop',
        priority: 'high',
        title: '🤝 Collaboration Initiée',
        message: `Demande de collaboration sur: ${topic}`,
        context: {
          workshopId: 1,
          moduleId: state.sessionProgress.currentModule,
          userId: state.userProfile.id
        }
      });
      
    } catch (error) {
      console.error('❌ Erreur initiation collaboration:', error);
    }
  }, [state.userProfile, state.expertiseLevel, state.sessionProgress.currentModule, triggerAdaptation, createNotification]);

  // 🎨 MISE À JOUR DU THÈME

  const updateInterfaceTheme = useCallback((theme: Partial<InterfaceTheme>): void => {
    setState(prev => ({
      ...prev,
      interfaceTheme: { ...prev.interfaceTheme, ...theme }
    }));
  }, []);

  // 📐 MISE À JOUR DU LAYOUT

  const updateLayoutConfiguration = useCallback((layout: Partial<LayoutConfiguration>): void => {
    setState(prev => ({
      ...prev,
      layoutConfiguration: { ...prev.layoutConfiguration, ...layout }
    }));
  }, []);

  // 🔄 MODE EXPERT

  const toggleExpertMode = useCallback((): void => {
    setState(prev => {
      const isExpertMode = prev.layoutConfiguration.expertToolbar;
      return {
        ...prev,
        layoutConfiguration: {
          ...prev.layoutConfiguration,
          expertToolbar: !isExpertMode,
          metricsVisibility: !isExpertMode ? 'expert' : 'minimal',
          collaborationPanel: !isExpertMode
        }
      };
    });
  }, []);

  // 📊 RAFRAÎCHISSEMENT DES MÉTRIQUES

  const refreshMetrics = useCallback(async (): Promise<void> => {
    if (!state.sessionId) return;
    
    try {
      const sessionMetrics = masterAgent.current.getSessionMetrics(state.sessionId);
      const integrationMetrics = integrationService.current.getIntegrationMetrics();
      
      if (sessionMetrics) {
        setState(prev => ({
          ...prev,
          realTimeMetrics: {
            responseTime: sessionMetrics.effectiveness * 10, // Simulation
            interactionFrequency: sessionMetrics.interactions / Math.max(1, prev.sessionProgress.timeSpent / 60),
            contentRelevance: sessionMetrics.progress.comprehensionLevel,
            collaborationActivity: integrationMetrics.collaborationRequests * 10,
            notificationEfficiency: integrationMetrics.successRate,
            a2aMessageCount: integrationMetrics.a2aMessagesExchanged,
            lastUpdate: new Date()
          }
        }));
      }
      
    } catch (error) {
      console.error('❌ Erreur rafraîchissement métriques:', error);
    }
  }, [state.sessionId]);

  // 📤 EXPORT DES DONNÉES

  const exportSessionData = useCallback(async (): Promise<any> => {
    if (!state.sessionId) return null;
    
    try {
      const sessionMetrics = masterAgent.current.getSessionMetrics(state.sessionId);
      const integrationMetrics = integrationService.current.getIntegrationMetrics();
      
      return {
        session: {
          id: state.sessionId,
          userProfile: state.userProfile,
          expertiseLevel: state.expertiseLevel,
          progress: state.sessionProgress,
          adaptations: state.adaptationHistory
        },
        metrics: {
          session: sessionMetrics,
          integration: integrationMetrics,
          realTime: state.realTimeMetrics
        },
        interface: {
          theme: state.interfaceTheme,
          layout: state.layoutConfiguration
        },
        exportedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Erreur export données:', error);
      return null;
    }
  }, [state]);

  // 🔄 RESET DE SESSION

  const resetSession = useCallback((): void => {
    setState(prev => ({
      ...prev,
      sessionId: null,
      userProfile: null,
      expertiseLevel: null,
      masterAgentConnected: false,
      notificationAgentConnected: false,
      a2aProtocolActive: false,
      sessionProgress: {
        currentModule: '',
        moduleProgress: 0,
        overallProgress: 0,
        timeSpent: 0,
        engagementScore: 100,
        comprehensionLevel: 50,
        adaptationsApplied: 0,
        lastActivity: new Date()
      },
      adaptationHistory: [],
      error: null
    }));
  }, []);

  // 💡 RECOMMANDATIONS

  const getRecommendations = useCallback((): string[] => {
    const recommendations: string[] = [];
    
    if (state.sessionProgress.engagementScore < 60) {
      recommendations.push('Prendre une pause pour maintenir la concentration');
    }
    
    if (state.sessionProgress.adaptationsApplied > 5) {
      recommendations.push('Réviser les concepts de base avant de continuer');
    }
    
    if (state.realTimeMetrics.collaborationActivity < 30 && state.expertiseLevel?.level === 'expert') {
      recommendations.push('Considérer une collaboration avec d\'autres experts');
    }
    
    return recommendations;
  }, [state]);

  // 🔄 FINALISATION DE SESSION

  const finalizeSession = useCallback(async (): Promise<void> => {
    if (!state.sessionId) return;
    
    try {
      setState(prev => ({ ...prev, isProcessing: true }));
      
      const summary = await masterAgent.current.finalizeSession(state.sessionId);
      
      await createNotification({
        type: 'success',
        category: 'workshop',
        priority: 'medium',
        title: '🎉 Session Terminée',
        message: `Session Workshop 1 finalisée avec ${state.sessionProgress.overallProgress}% de progression`,
        context: {
          workshopId: 1,
          moduleId: state.sessionProgress.currentModule,
          userId: state.userProfile?.id || ''
        }
      });
      
      setState(prev => ({ ...prev, isProcessing: false }));
      
    } catch (error) {
      console.error('❌ Erreur finalisation session:', error);
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [state.sessionId, state.sessionProgress, state.userProfile, createNotification]);

  // 📊 RAFRAÎCHISSEMENT AUTOMATIQUE DES MÉTRIQUES

  useEffect(() => {
    if (state.sessionId) {
      const interval = setInterval(refreshMetrics, 30000); // Toutes les 30 secondes
      return () => clearInterval(interval);
    }
  }, [state.sessionId, refreshMetrics]);

  // 🎯 ACTIONS COMBINÉES

  const actions: Workshop1IntelligenceActions = {
    initializeSession,
    updateProgress,
    finalizeSession,
    triggerAdaptation,
    requestExpertInsight,
    initiateCollaboration,
    updateInterfaceTheme,
    updateLayoutConfiguration,
    toggleExpertMode,
    refreshMetrics,
    exportSessionData,
    resetSession,
    getRecommendations
  };

  return [state, actions];
};

// 🎨 FONCTIONS UTILITAIRES

function determineInterfaceTheme(expertiseLevel: ExpertiseLevel): InterfaceTheme {
  switch (expertiseLevel.level) {
    case 'master':
      return {
        name: 'master',
        primaryColor: '#7c3aed',
        accentColor: '#8b5cf6',
        backgroundColor: '#faf5ff',
        textColor: '#1f2937',
        complexity: 'expert',
        iconSet: 'expert'
      };
    case 'expert':
      return {
        name: 'expert',
        primaryColor: '#059669',
        accentColor: '#10b981',
        backgroundColor: '#f0fdf4',
        textColor: '#1f2937',
        complexity: 'expert',
        iconSet: 'expert'
      };
    case 'senior':
      return {
        name: 'senior',
        primaryColor: '#dc2626',
        accentColor: '#ef4444',
        backgroundColor: '#fef2f2',
        textColor: '#1f2937',
        complexity: 'advanced',
        iconSet: 'professional'
      };
    default:
      return {
        name: 'standard',
        primaryColor: '#2563eb',
        accentColor: '#3b82f6',
        backgroundColor: '#ffffff',
        textColor: '#1f2937',
        complexity: 'standard',
        iconSet: 'professional'
      };
  }
}

function determineLayoutConfiguration(expertiseLevel: ExpertiseLevel): LayoutConfiguration {
  switch (expertiseLevel.level) {
    case 'master':
    case 'expert':
      return {
        sidebarPosition: 'left',
        panelLayout: 'triple',
        notificationPosition: 'sidebar',
        metricsVisibility: 'expert',
        collaborationPanel: true,
        expertToolbar: true
      };
    case 'senior':
      return {
        sidebarPosition: 'left',
        panelLayout: 'dual',
        notificationPosition: 'top',
        metricsVisibility: 'detailed',
        collaborationPanel: true,
        expertToolbar: false
      };
    default:
      return {
        sidebarPosition: 'left',
        panelLayout: 'single',
        notificationPosition: 'top',
        metricsVisibility: 'minimal',
        collaborationPanel: false,
        expertToolbar: false
      };
  }
}

function generateExpertActions(expertiseLevel: ExpertiseLevel, userProfile: EbiosExpertProfile): ExpertAction[] {
  const baseActions: ExpertAction[] = [
    {
      id: 'progress_overview',
      label: 'Vue d\'ensemble',
      icon: '📊',
      type: 'navigation',
      enabled: true,
      onClick: () => console.log('Navigation vers vue d\'ensemble'),
      tooltip: 'Afficher la progression globale',
      expertLevel: 'all'
    },
    {
      id: 'export_session',
      label: 'Exporter',
      icon: '📤',
      type: 'export',
      enabled: true,
      onClick: () => console.log('Export des données de session'),
      tooltip: 'Exporter les données de la session',
      expertLevel: 'intermediate'
    }
  ];

  // Actions pour experts avancés
  if (expertiseLevel.level === 'expert' || expertiseLevel.level === 'master') {
    baseActions.push(
      {
        id: 'expert_insights',
        label: 'Insights',
        icon: '💡',
        type: 'insight',
        enabled: true,
        onClick: () => console.log('Demande d\'insights experts'),
        tooltip: 'Demander des insights experts',
        expertLevel: 'expert'
      },
      {
        id: 'collaboration',
        label: 'Collaborer',
        icon: '🤝',
        type: 'collaboration',
        enabled: true,
        onClick: () => console.log('Initier collaboration'),
        tooltip: 'Initier une collaboration',
        expertLevel: 'expert'
      }
    );
  }

  return baseActions;
}

export default useWorkshop1Intelligence;
