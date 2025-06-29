/**
 * 🎓 SLICE REDUX FORMATION
 * Intégration du module formation avec le store Redux existant
 * Bridge entre Zustand (module) et Redux (application)
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TrainingSession, Learner, TrainingStatus } from '@/modules/training';

// 🎯 ÉTAT REDUX POUR LA FORMATION
export interface TrainingReduxState {
  // Sessions
  sessions: TrainingSession[];
  currentSessionId: string | null;
  sessionStatus: 'idle' | 'loading' | 'active' | 'paused' | 'completed' | 'error';
  
  // Apprenants
  learners: Learner[];
  currentLearnerId: string | null;
  
  // UI State pour intégration
  isTrainingModuleOpen: boolean;
  trainingRoute: string | null;
  
  // Métriques globales
  globalMetrics: {
    totalSessions: number;
    completedSessions: number;
    averageCompletionRate: number;
    totalLearners: number;
  };
  
  // État de chargement
  loading: {
    sessions: boolean;
    learners: boolean;
    metrics: boolean;
  };
  
  // Erreurs
  errors: {
    sessions: string | null;
    learners: string | null;
    general: string | null;
  };
}

// 🎯 ÉTAT INITIAL
const initialState: TrainingReduxState = {
  sessions: [],
  currentSessionId: null,
  sessionStatus: 'idle',
  learners: [],
  currentLearnerId: null,
  isTrainingModuleOpen: false,
  trainingRoute: null,
  globalMetrics: {
    totalSessions: 0,
    completedSessions: 0,
    averageCompletionRate: 0,
    totalLearners: 0
  },
  loading: {
    sessions: false,
    learners: false,
    metrics: false
  },
  errors: {
    sessions: null,
    learners: null,
    general: null
  }
};

// 🎯 ACTIONS ASYNCHRONES

// Charger les sessions de formation - DÉSACTIVÉ
export const loadTrainingSessions = createAsyncThunk(
  'training/loadSessions',
  async (userId: string, { rejectWithValue }) => {
    console.warn('⚠️ loadTrainingSessions désactivé - Module indépendant');
    return {
      sessions: [],
      metrics: {
        totalSessions: 0,
        completedSessions: 0,
        averageCompletionRate: 0
      }
    };
  }
);

// Charger les apprenants - DÉSACTIVÉ
export const loadLearners = createAsyncThunk(
  'training/loadLearners',
  async (organizationId: string, { rejectWithValue }) => {
    console.warn('⚠️ loadLearners désactivé - Module indépendant');
    return {
      learners: [],
      totalLearners: 0
    };
  }
);

// Créer une nouvelle session - DÉSACTIVÉ
export const createTrainingSession = createAsyncThunk(
  'training/createSession',
  async (sessionData: {
    learnerId: string;
    workshopSequence: number[];
    sectorCustomization?: string;
  }, { rejectWithValue }) => {
    console.warn('⚠️ createTrainingSession désactivé - Module indépendant');
    return {
      sessionId: 'session_healthcare_chu_2024',
      success: true
    };
  }
);

// 🎯 SLICE PRINCIPAL
const trainingSlice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    // Ouvrir/fermer le module formation
    setTrainingModuleOpen: (state, action: PayloadAction<boolean>) => {
      state.isTrainingModuleOpen = action.payload;
    },
    
    // Définir la route de formation
    setTrainingRoute: (state, action: PayloadAction<string | null>) => {
      state.trainingRoute = action.payload;
    },
    
    // Sélectionner une session courante
    setCurrentSession: (state, action: PayloadAction<string | null>) => {
      state.currentSessionId = action.payload;
    },
    
    // Sélectionner un apprenant courant
    setCurrentLearner: (state, action: PayloadAction<string | null>) => {
      state.currentLearnerId = action.payload;
    },
    
    // Mettre à jour le statut de session
    updateSessionStatus: (state, action: PayloadAction<TrainingReduxState['sessionStatus']>) => {
      state.sessionStatus = action.payload;
    },
    
    // Ajouter une session
    addSession: (state, action: PayloadAction<TrainingSession>) => {
      state.sessions.push(action.payload);
      state.globalMetrics.totalSessions += 1;
    },
    
    // Mettre à jour une session
    updateSession: (state, action: PayloadAction<{ id: string; updates: Partial<TrainingSession> }>) => {
      const index = state.sessions.findIndex(s => s.id.value === action.payload.id);
      if (index !== -1) {
        state.sessions[index] = { ...state.sessions[index], ...action.payload.updates };
        
        // Mettre à jour les métriques si la session est terminée
        if (action.payload.updates.status === 'completed') {
          state.globalMetrics.completedSessions += 1;
          state.globalMetrics.averageCompletionRate = 
            (state.globalMetrics.completedSessions / state.globalMetrics.totalSessions) * 100;
        }
      }
    },
    
    // Ajouter un apprenant
    addLearner: (state, action: PayloadAction<Learner>) => {
      state.learners.push(action.payload);
      state.globalMetrics.totalLearners += 1;
    },
    
    // Mettre à jour un apprenant
    updateLearner: (state, action: PayloadAction<{ id: string; updates: Partial<Learner> }>) => {
      const index = state.learners.findIndex(l => l.id.value === action.payload.id);
      if (index !== -1) {
        state.learners[index] = { ...state.learners[index], ...action.payload.updates };
      }
    },
    
    // Effacer les erreurs
    clearErrors: (state) => {
      state.errors = {
        sessions: null,
        learners: null,
        general: null
      };
    },
    
    // Réinitialiser l'état
    resetTrainingState: (state) => {
      return initialState;
    }
  },
  
  extraReducers: (builder) => {
    // 🎯 CHARGEMENT DES SESSIONS
    builder
      .addCase(loadTrainingSessions.pending, (state) => {
        state.loading.sessions = true;
        state.errors.sessions = null;
      })
      .addCase(loadTrainingSessions.fulfilled, (state, action) => {
        state.loading.sessions = false;
        state.sessions = action.payload.sessions;
        state.globalMetrics = {
          ...state.globalMetrics,
          ...action.payload.metrics
        };
      })
      .addCase(loadTrainingSessions.rejected, (state, action) => {
        state.loading.sessions = false;
        state.errors.sessions = action.payload as string;
      });
    
    // 🎯 CHARGEMENT DES APPRENANTS
    builder
      .addCase(loadLearners.pending, (state) => {
        state.loading.learners = true;
        state.errors.learners = null;
      })
      .addCase(loadLearners.fulfilled, (state, action) => {
        state.loading.learners = false;
        state.learners = action.payload.learners;
        state.globalMetrics.totalLearners = action.payload.totalLearners;
      })
      .addCase(loadLearners.rejected, (state, action) => {
        state.loading.learners = false;
        state.errors.learners = action.payload as string;
      });
    
    // 🎯 CRÉATION DE SESSION
    builder
      .addCase(createTrainingSession.pending, (state) => {
        state.sessionStatus = 'loading';
        state.errors.general = null;
      })
      .addCase(createTrainingSession.fulfilled, (state, action) => {
        state.sessionStatus = 'active';
        state.currentSessionId = action.payload.sessionId;
      })
      .addCase(createTrainingSession.rejected, (state, action) => {
        state.sessionStatus = 'error';
        state.errors.general = action.payload as string;
      });
  }
});

// 🎯 EXPORT DES ACTIONS
export const {
  setTrainingModuleOpen,
  setTrainingRoute,
  setCurrentSession,
  setCurrentLearner,
  updateSessionStatus,
  addSession,
  updateSession,
  addLearner,
  updateLearner,
  clearErrors,
  resetTrainingState
} = trainingSlice.actions;

// 🎯 SÉLECTEURS - DÉSACTIVÉS (Module indépendant)
export const selectTrainingState = (state: any) => {
  console.warn('⚠️ selectTrainingState désactivé - Module indépendant');
  return initialState;
};

export const selectCurrentSession = (state: any) => {
  console.warn('⚠️ selectCurrentSession désactivé - Module indépendant');
  return null;
};

export const selectCurrentLearner = (state: any) => {
  console.warn('⚠️ selectCurrentLearner désactivé - Module indépendant');
  return null;
};

export const selectTrainingMetrics = (state: any) => {
  console.warn('⚠️ selectTrainingMetrics désactivé - Module indépendant');
  return {
    totalSessions: 0,
    completedSessions: 0,
    averageCompletionRate: 0,
    totalLearners: 0
  };
};

export const selectTrainingLoading = (state: any) => {
  console.warn('⚠️ selectTrainingLoading désactivé - Module indépendant');
  return {
    sessions: false,
    learners: false,
    metrics: false
  };
};

export const selectTrainingErrors = (state: any) => {
  console.warn('⚠️ selectTrainingErrors désactivé - Module indépendant');
  return {
    sessions: null,
    learners: null,
    general: null
  };
};

// 🎯 EXPORT DU REDUCER
export default trainingSlice.reducer;
