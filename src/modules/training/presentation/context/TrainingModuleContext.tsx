/**
 * 🎓 CONTEXTE ISOLÉ DU MODULE FORMATION
 * Contexte React complètement indépendant pour éviter les conflits avec Redux
 * Architecture Micro-Frontend avec isolation totale
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';

// 🎯 TYPES DU CONTEXTE ISOLÉ
export interface TrainingModuleState {
  // Session
  sessionId: string | null;
  sessionStatus: 'idle' | 'loading' | 'active' | 'paused' | 'completed' | 'error';
  
  // UI
  activeTab: 'chat' | 'progress' | 'resources' | 'help';
  isFullscreen: boolean;
  sidebarCollapsed: boolean;
  
  // Progression (données statiques pour éviter les boucles)
  progress: {
    completionPercentage: number;
    timeSpent: number;
    currentWorkshop: string | null;
    badges: string[];
  };
  
  // Métriques (données statiques)
  metrics: {
    engagementScore: number;
    comprehensionLevel: number;
    responseQuality: number;
  };
  
  // Messages de chat avec support full-agentic
  messages: Array<{
    id: string;
    type: 'user' | 'instructor' | 'system' | 'system_actions' | 'quiz' | 'info_card';
    content: string;
    timestamp: number;
    // Nouveaux champs pour l'interactivité agentique
    actions?: Array<{
      id: string;
      label: string;
      payload: string;
      type: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
      icon?: string;
    }>;
    quiz?: {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    };
    infoCard?: {
      title: string;
      content: string;
      imageUrl?: string;
      resources?: string[];
    };
    metadata?: {
      confidence: number;
      sources: string[];
      timestamp: Date;
    };
  }>;
  
  // État de connexion
  isOnline: boolean;
  
  // Erreurs
  errors: string[];
}

// 🎯 ACTIONS DU CONTEXTE
type TrainingModuleAction =
  | { type: 'SET_SESSION_ID'; payload: string | null }
  | { type: 'SET_SESSION_STATUS'; payload: TrainingModuleState['sessionStatus'] }
  | { type: 'SET_ACTIVE_TAB'; payload: TrainingModuleState['activeTab'] }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'ADD_MESSAGE'; payload: Omit<TrainingModuleState['messages'][0], 'id' | 'timestamp'> }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'ADD_ERROR'; payload: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'RESET_MODULE' };

// 🎯 ÉTAT INITIAL STATIQUE (pour éviter les boucles)
const initialState: TrainingModuleState = {
  sessionId: null,
  sessionStatus: 'idle',
  activeTab: 'chat',
  isFullscreen: false,
  sidebarCollapsed: false,
  progress: {
    completionPercentage: 0,
    timeSpent: 0,
    currentWorkshop: null,
    badges: []
  },
  metrics: {
    engagementScore: 50,
    comprehensionLevel: 50,
    responseQuality: 50
  },
  messages: [],
  isOnline: true,
  errors: []
};

// 🎯 REDUCER SIMPLE ET PRÉVISIBLE
function trainingModuleReducer(state: TrainingModuleState, action: TrainingModuleAction): TrainingModuleState {
  switch (action.type) {
    case 'SET_SESSION_ID':
      return { ...state, sessionId: action.payload };
    
    case 'SET_SESSION_STATUS':
      return { ...state, sessionStatus: action.payload };
    
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    
    case 'TOGGLE_FULLSCREEN':
      return { ...state, isFullscreen: !state.isFullscreen };
    
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            ...action.payload,
            id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            timestamp: Date.now()
          }
        ]
      };
    
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    
    case 'ADD_ERROR':
      return { ...state, errors: [...state.errors, action.payload] };
    
    case 'CLEAR_ERRORS':
      return { ...state, errors: [] };
    
    case 'RESET_MODULE':
      return initialState;
    
    default:
      return state;
  }
}

// 🎯 INTERFACE DU CONTEXTE
interface TrainingModuleContextType {
  state: TrainingModuleState;
  actions: {
    setSessionId: (id: string | null) => void;
    setSessionStatus: (status: TrainingModuleState['sessionStatus']) => void;
    setActiveTab: (tab: TrainingModuleState['activeTab']) => void;
    toggleFullscreen: () => void;
    toggleSidebar: () => void;
    addMessage: (message: Omit<TrainingModuleState['messages'][0], 'id' | 'timestamp'>) => void;
    setOnlineStatus: (online: boolean) => void;
    addError: (error: string) => void;
    clearErrors: () => void;
    resetModule: () => void;
  };
}

// 🎯 CRÉATION DU CONTEXTE
const TrainingModuleContext = createContext<TrainingModuleContextType | null>(null);

// 🎯 PROVIDER DU CONTEXTE ISOLÉ
interface TrainingModuleProviderProps {
  children: ReactNode;
  initialSessionId?: string;
}

export const TrainingModuleProvider: React.FC<TrainingModuleProviderProps> = ({
  children,
  initialSessionId
}) => {
  const [state, dispatch] = useReducer(trainingModuleReducer, {
    ...initialState,
    sessionId: initialSessionId || null
  });

  // 🎯 ACTIONS MÉMORISÉES
  const actions = {
    setSessionId: useCallback((id: string | null) => {
      dispatch({ type: 'SET_SESSION_ID', payload: id });
    }, []),

    setSessionStatus: useCallback((status: TrainingModuleState['sessionStatus']) => {
      dispatch({ type: 'SET_SESSION_STATUS', payload: status });
    }, []),

    setActiveTab: useCallback((tab: TrainingModuleState['activeTab']) => {
      dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
    }, []),

    toggleFullscreen: useCallback(() => {
      dispatch({ type: 'TOGGLE_FULLSCREEN' });
    }, []),

    toggleSidebar: useCallback(() => {
      dispatch({ type: 'TOGGLE_SIDEBAR' });
    }, []),

    addMessage: useCallback((message: Omit<TrainingModuleState['messages'][0], 'id' | 'timestamp'>) => {
      dispatch({ type: 'ADD_MESSAGE', payload: message });
    }, []),

    setOnlineStatus: useCallback((online: boolean) => {
      dispatch({ type: 'SET_ONLINE_STATUS', payload: online });
    }, []),

    addError: useCallback((error: string) => {
      dispatch({ type: 'ADD_ERROR', payload: error });
    }, []),

    clearErrors: useCallback(() => {
      dispatch({ type: 'CLEAR_ERRORS' });
    }, []),

    resetModule: useCallback(() => {
      dispatch({ type: 'RESET_MODULE' });
    }, [])
  };

  // 🌐 SURVEILLANCE CONNEXION (ISOLÉE)
  useEffect(() => {
    const handleOnline = () => actions.setOnlineStatus(true);
    const handleOffline = () => actions.setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [actions]);

  // 🎯 INITIALISATION DE SESSION (SI FOURNIE)
  useEffect(() => {
    if (initialSessionId && state.sessionStatus === 'idle') {
      actions.setSessionStatus('loading');
      
      // Simulation d'initialisation
      setTimeout(() => {
        actions.setSessionStatus('active');
        actions.addMessage({
          type: 'system',
          content: '🚀 Session de formation EBIOS RM initialisée avec succès !'
        });
        actions.addMessage({
          type: 'instructor',
          content: 'Bonjour ! Je suis votre formateur virtuel spécialisé en EBIOS RM. Prêt à commencer cette formation interactive ?'
        });
      }, 1000);
    }
  }, [initialSessionId, state.sessionStatus, actions]);

  const contextValue: TrainingModuleContextType = {
    state,
    actions
  };

  return (
    <TrainingModuleContext.Provider value={contextValue}>
      {children}
    </TrainingModuleContext.Provider>
  );
};

// 🎯 HOOK POUR UTILISER LE CONTEXTE
export const useTrainingModule = (): TrainingModuleContextType => {
  const context = useContext(TrainingModuleContext);
  if (!context) {
    throw new Error('useTrainingModule doit être utilisé dans un TrainingModuleProvider');
  }
  return context;
};

// 🎯 HOOKS SPÉCIALISÉS
export const useTrainingModuleState = () => {
  const { state } = useTrainingModule();
  return state;
};

export const useTrainingModuleActions = () => {
  const { actions } = useTrainingModule();
  return actions;
};
