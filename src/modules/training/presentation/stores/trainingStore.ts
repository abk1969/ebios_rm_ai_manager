/**
 * 🎪 STORE FORMATION - GESTION D'ÉTAT LOCALE
 * Store Zustand avec Immer pour état réactif et immutable
 * Pattern CQRS pour séparation commandes/requêtes
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { TrainingSession, TrainingStatus, WorkshopType } from '../../domain/entities/TrainingSession';
import { Learner } from '../../domain/entities/Learner';
import { TrainingInstruction, InstructionType } from '../../infrastructure/ai/TrainingInstructorAgent';

// 🎯 ÉTAT DU STORE
export interface TrainingState {
  // Session courante
  currentSession: TrainingSession | null;
  sessionStatus: 'idle' | 'loading' | 'active' | 'paused' | 'completed' | 'error';
  
  // Apprenant
  currentLearner: Learner | null;
  
  // Interface conversationnelle
  conversation: {
    messages: ConversationMessage[];
    isTyping: boolean;
    lastInstruction: TrainingInstruction | null;
    awaitingResponse: boolean;
  };
  
  // Progression
  progress: {
    currentWorkshop: WorkshopType | null;
    currentStep: number;
    completionPercentage: number;
    timeSpent: number;
    milestones: string[];
    badges: string[];
  };
  
  // Interface utilisateur
  ui: {
    sidebarCollapsed: boolean;
    activeTab: 'chat' | 'progress' | 'resources' | 'help';
    theme: 'light' | 'dark';
    notifications: UINotification[];
    isFullscreen: boolean;
  };
  
  // Métriques temps réel
  metrics: {
    engagementScore: number;
    comprehensionLevel: number;
    responseQuality: number;
    sessionDuration: number;
    interactionCount: number;
  };
  
  // Erreurs et états
  errors: TrainingError[];
  warnings: string[];
  isOnline: boolean;
  lastSync: Date | null;
}

// 🎯 TYPES POUR LES MESSAGES
export interface ConversationMessage {
  id: string;
  type: 'instructor' | 'learner' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    instructionType?: InstructionType;
    confidence?: number;
    resources?: any[];
    actions?: MessageAction[];
  };
}

export interface MessageAction {
  id: string;
  label: string;
  type: 'button' | 'link' | 'download';
  action: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export interface UINotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  autoClose?: boolean;
  duration?: number;
}

export interface TrainingError {
  id: string;
  code: string;
  message: string;
  timestamp: Date;
  context?: any;
  recoverable: boolean;
}

// 🎯 ACTIONS DU STORE
export interface TrainingActions {
  // Session management
  setCurrentSession: (session: TrainingSession | null) => void;
  updateSessionStatus: (status: TrainingState['sessionStatus']) => void;
  updateProgress: (progress: Partial<TrainingState['progress']>) => void;
  setCurrentWorkshop: (workshop: WorkshopType) => void;
  
  // Learner management
  setCurrentLearner: (learner: Learner | null) => void;
  
  // Conversation management
  addMessage: (message: Omit<ConversationMessage, 'id' | 'timestamp'>) => void;
  setTyping: (isTyping: boolean) => void;
  setLastInstruction: (instruction: TrainingInstruction | null) => void;
  setAwaitingResponse: (awaiting: boolean) => void;
  clearConversation: () => void;
  
  // UI management
  toggleSidebar: () => void;
  setActiveTab: (tab: TrainingState['ui']['activeTab']) => void;
  setTheme: (theme: TrainingState['ui']['theme']) => void;
  addNotification: (notification: Omit<UINotification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  toggleFullscreen: () => void;
  
  // Metrics management
  updateMetrics: (metrics: Partial<TrainingState['metrics']>) => void;
  incrementInteraction: () => void;
  updateEngagement: (score: number) => void;
  
  // Error management
  addError: (error: Omit<TrainingError, 'id' | 'timestamp'>) => void;
  removeError: (id: string) => void;
  addWarning: (warning: string) => void;
  clearWarnings: () => void;
  
  // Network status
  setOnlineStatus: (isOnline: boolean) => void;
  updateLastSync: () => void;
  
  // Utility actions
  reset: () => void;
  exportState: () => string;
  importState: (state: string) => void;
}

// 🎯 ÉTAT INITIAL
const initialState: TrainingState = {
  currentSession: null,
  sessionStatus: 'idle',
  currentLearner: null,
  conversation: {
    messages: [],
    isTyping: false,
    lastInstruction: null,
    awaitingResponse: false
  },
  progress: {
    currentWorkshop: null,
    currentStep: 0,
    completionPercentage: 0,
    timeSpent: 0,
    milestones: [],
    badges: []
  },
  ui: {
    sidebarCollapsed: false,
    activeTab: 'chat',
    theme: 'light',
    notifications: [],
    isFullscreen: false
  },
  metrics: {
    engagementScore: 50,
    comprehensionLevel: 50,
    responseQuality: 50,
    sessionDuration: 0,
    interactionCount: 0
  },
  errors: [],
  warnings: [],
  isOnline: true,
  lastSync: null
};

// 🎯 CRÉATION DU STORE
export const useTrainingStore = create<TrainingState & TrainingActions>()(
  subscribeWithSelector(
    immer((set, get) => ({
      ...initialState,

      // 🎯 SESSION MANAGEMENT
      setCurrentSession: (session) =>
        set((state) => {
          state.currentSession = session;
          if (session) {
            state.progress.currentWorkshop = session.progress.currentWorkshop;
            state.progress.currentStep = session.progress.currentStep;
            state.progress.completionPercentage = session.completionPercentage;
            state.progress.timeSpent = session.progress.timeSpent;
            state.sessionStatus = session.isActive ? 'active' : 'idle';
          }
        }),

      updateSessionStatus: (status) =>
        set((state) => {
          state.sessionStatus = status;
        }),

      updateProgress: (progress) =>
        set((state) => {
          Object.assign(state.progress, progress);
        }),

      setCurrentWorkshop: (workshop) =>
        set((state) => {
          state.progress.currentWorkshop = workshop;
        }),

      // 🎯 LEARNER MANAGEMENT
      setCurrentLearner: (learner) =>
        set((state) => {
          state.currentLearner = learner;
        }),

      // 🎯 CONVERSATION MANAGEMENT
      addMessage: (message) =>
        set((state) => {
          const newMessage: ConversationMessage = {
            ...message,
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date()
          };
          state.conversation.messages.push(newMessage);
          
          // Limiter à 100 messages pour les performances
          if (state.conversation.messages.length > 100) {
            state.conversation.messages.splice(0, state.conversation.messages.length - 100);
          }
        }),

      setTyping: (isTyping) =>
        set((state) => {
          state.conversation.isTyping = isTyping;
        }),

      setLastInstruction: (instruction) =>
        set((state) => {
          state.conversation.lastInstruction = instruction;
        }),

      setAwaitingResponse: (awaiting) =>
        set((state) => {
          state.conversation.awaitingResponse = awaiting;
        }),

      clearConversation: () =>
        set((state) => {
          state.conversation.messages = [];
          state.conversation.lastInstruction = null;
          state.conversation.awaitingResponse = false;
        }),

      // 🎯 UI MANAGEMENT
      toggleSidebar: () =>
        set((state) => {
          state.ui.sidebarCollapsed = !state.ui.sidebarCollapsed;
        }),

      setActiveTab: (tab) =>
        set((state) => {
          state.ui.activeTab = tab;
        }),

      setTheme: (theme) =>
        set((state) => {
          state.ui.theme = theme;
        }),

      addNotification: (notification) =>
        set((state) => {
          const newNotification: UINotification = {
            ...notification,
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date()
          };
          state.ui.notifications.push(newNotification);
        }),

      removeNotification: (id) =>
        set((state) => {
          const index = state.ui.notifications.findIndex(n => n.id === id);
          if (index !== -1) {
            state.ui.notifications.splice(index, 1);
          }
        }),

      toggleFullscreen: () =>
        set((state) => {
          state.ui.isFullscreen = !state.ui.isFullscreen;
        }),

      // 🎯 METRICS MANAGEMENT
      updateMetrics: (metrics) =>
        set((state) => {
          Object.assign(state.metrics, metrics);
        }),

      incrementInteraction: () =>
        set((state) => {
          state.metrics.interactionCount += 1;
        }),

      updateEngagement: (score) =>
        set((state) => {
          state.metrics.engagementScore = Math.max(0, Math.min(100, score));
        }),

      // 🎯 ERROR MANAGEMENT
      addError: (error) =>
        set((state) => {
          const newError: TrainingError = {
            ...error,
            id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date()
          };
          state.errors.push(newError);
        }),

      removeError: (id) =>
        set((state) => {
          const index = state.errors.findIndex(e => e.id === id);
          if (index !== -1) {
            state.errors.splice(index, 1);
          }
        }),

      addWarning: (warning) =>
        set((state) => {
          state.warnings.push(warning);
        }),

      clearWarnings: () =>
        set((state) => {
          state.warnings = [];
        }),

      // 🎯 NETWORK STATUS
      setOnlineStatus: (isOnline) =>
        set((state) => {
          state.isOnline = isOnline;
        }),

      updateLastSync: () =>
        set((state) => {
          state.lastSync = new Date();
        }),

      // 🎯 UTILITY ACTIONS
      reset: () =>
        set((state) => {
          Object.assign(state, initialState);
        }),

      exportState: () => {
        const state = get();
        return JSON.stringify({
          currentSession: state.currentSession?.toSnapshot(),
          currentLearner: state.currentLearner?.toSnapshot(),
          progress: state.progress,
          ui: state.ui,
          metrics: state.metrics
        });
      },

      importState: (stateString) => {
        try {
          const importedState = JSON.parse(stateString);
          set((state) => {
            if (importedState.progress) {
              Object.assign(state.progress, importedState.progress);
            }
            if (importedState.ui) {
              Object.assign(state.ui, importedState.ui);
            }
            if (importedState.metrics) {
              Object.assign(state.metrics, importedState.metrics);
            }
          });
        } catch (error) {
          console.error('Failed to import state:', error);
        }
      }
    }))
  )
);

// 🎯 SÉLECTEURS OPTIMISÉS
export const useCurrentSession = () => useTrainingStore(state => state.currentSession);
export const useSessionStatus = () => useTrainingStore(state => state.sessionStatus);
export const useCurrentLearner = () => useTrainingStore(state => state.currentLearner);
export const useConversation = () => useTrainingStore(state => state.conversation);
export const useProgress = () => useTrainingStore(state => state.progress);
export const useUI = () => useTrainingStore(state => state.ui);
export const useMetrics = () => useTrainingStore(state => state.metrics);
export const useErrors = () => useTrainingStore(state => state.errors);
export const useIsOnline = () => useTrainingStore(state => state.isOnline);

// 🎯 HOOKS COMPOSÉS
export const useTrainingActions = () => {
  const store = useTrainingStore();
  return {
    setCurrentSession: store.setCurrentSession,
    updateSessionStatus: store.updateSessionStatus,
    updateProgress: store.updateProgress,
    setCurrentWorkshop: store.setCurrentWorkshop,
    setCurrentLearner: store.setCurrentLearner,
    addMessage: store.addMessage,
    setTyping: store.setTyping,
    setLastInstruction: store.setLastInstruction,
    setAwaitingResponse: store.setAwaitingResponse,
    clearConversation: store.clearConversation,
    toggleSidebar: store.toggleSidebar,
    setActiveTab: store.setActiveTab,
    setTheme: store.setTheme,
    addNotification: store.addNotification,
    removeNotification: store.removeNotification,
    toggleFullscreen: store.toggleFullscreen,
    updateMetrics: store.updateMetrics,
    incrementInteraction: store.incrementInteraction,
    updateEngagement: store.updateEngagement,
    addError: store.addError,
    removeError: store.removeError,
    addWarning: store.addWarning,
    clearWarnings: store.clearWarnings,
    setOnlineStatus: store.setOnlineStatus,
    updateLastSync: store.updateLastSync,
    reset: store.reset,
    exportState: store.exportState,
    importState: store.importState
  };
};

// 🎯 MIDDLEWARE POUR PERSISTANCE
export const persistTrainingState = () => {
  useTrainingStore.subscribe(
    (state) => ({
      progress: state.progress,
      ui: state.ui,
      metrics: state.metrics
    }),
    (persistableState) => {
      localStorage.setItem('training-state', JSON.stringify(persistableState));
    }
  );
};

// 🎯 MIDDLEWARE POUR ANALYTICS
export const trackTrainingEvents = () => {
  useTrainingStore.subscribe(
    (state) => state.metrics.interactionCount,
    (interactionCount) => {
      // Envoyer métriques d'engagement
      console.log('Interaction count updated:', interactionCount);
    }
  );
  
  useTrainingStore.subscribe(
    (state) => state.sessionStatus,
    (status) => {
      // Tracker les changements de statut
      console.log('Session status changed:', status);
    }
  );
};
