import { useState, useEffect, useCallback } from 'react';
import { UnifiedMetricsManager, UnifiedMetrics, MetricsUpdate } from '../../domain/services/UnifiedMetricsManager';

/**
 * 🎯 HOOK PERSONNALISÉ POUR MÉTRIQUES UNIFIÉES
 * Facilite l'utilisation du système de métriques dans les composants
 */

interface UseUnifiedMetricsOptions {
  sessionId: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // ms
}

interface UseUnifiedMetricsReturn {
  metrics: UnifiedMetrics | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  updateModeMetrics: (update: MetricsUpdate) => void;
  updateWorkshopMetrics: (workshopId: number, results: any) => void;
  updateChatExpertMetrics: (data: any) => void;
  updateSessionMetrics: (action: string) => void;
  refreshMetrics: () => void;
  
  // Utilitaires
  getModeProgress: (modeId: string) => number;
  getModeStatus: (modeId: string) => string;
  getGlobalProgress: () => number;
  getRecommendations: () => any[];
  getAchievements: () => any[];
  
  // Calculateurs
  calculateTimeToComplete: () => number;
  calculateNextMilestone: () => string;
  calculateEngagementScore: () => number;
}

export const useUnifiedMetrics = (options: UseUnifiedMetricsOptions): UseUnifiedMetricsReturn => {
  const { sessionId, autoRefresh = true, refreshInterval = 30000 } = options;
  
  const [metrics, setMetrics] = useState<UnifiedMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📊 CHARGEMENT MÉTRIQUES
  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = UnifiedMetricsManager.getUnifiedMetrics(sessionId);
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur chargement métriques');
      console.error('Error loading metrics:', err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // 🔄 EFFET CHARGEMENT INITIAL ET AUTO-REFRESH
  useEffect(() => {
    loadMetrics();
    
    if (autoRefresh) {
      const interval = setInterval(loadMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [loadMetrics, autoRefresh, refreshInterval]);

  // 🎯 ACTIONS DE MISE À JOUR
  const updateModeMetrics = useCallback((update: MetricsUpdate) => {
    try {
      UnifiedMetricsManager.updateModeMetrics(update);
      loadMetrics(); // Recharger pour refléter les changements
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur mise à jour métriques');
    }
  }, [loadMetrics]);

  const updateWorkshopMetrics = useCallback((workshopId: number, results: any) => {
    try {
      UnifiedMetricsManager.updateWorkshopMetrics(workshopId, results);
      loadMetrics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur mise à jour workshop');
    }
  }, [loadMetrics]);

  const updateChatExpertMetrics = useCallback((data: any) => {
    try {
      UnifiedMetricsManager.updateChatExpertMetrics(data);
      loadMetrics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur mise à jour chat');
    }
  }, [loadMetrics]);

  const updateSessionMetrics = useCallback((action: string) => {
    try {
      UnifiedMetricsManager.updateSessionMetrics(sessionId, action);
      loadMetrics();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur mise à jour session');
    }
  }, [sessionId, loadMetrics]);

  const refreshMetrics = useCallback(() => {
    loadMetrics();
  }, [loadMetrics]);

  // 🎯 UTILITAIRES
  const getModeProgress = useCallback((modeId: string): number => {
    if (!metrics?.modeMetrics[modeId]) return 0;
    return metrics.modeMetrics[modeId].completion;
  }, [metrics]);

  const getModeStatus = useCallback((modeId: string): string => {
    if (!metrics?.modeMetrics[modeId]) return 'not_started';
    return metrics.modeMetrics[modeId].status;
  }, [metrics]);

  const getGlobalProgress = useCallback((): number => {
    return metrics?.globalProgress.overallCompletion || 0;
  }, [metrics]);

  const getRecommendations = useCallback(() => {
    return metrics?.recommendations || [];
  }, [metrics]);

  const getAchievements = useCallback(() => {
    return metrics?.achievements || [];
  }, [metrics]);

  // 🧮 CALCULATEURS
  const calculateTimeToComplete = useCallback((): number => {
    if (!metrics) return 0;
    
    const incompleteModes = Object.values(metrics.modeMetrics)
      .filter(mode => mode.status !== 'completed');
    
    // Estimation basée sur temps moyen par % de completion
    const estimatedTime = incompleteModes.reduce((total, mode) => {
      const remainingCompletion = 100 - mode.completion;
      const avgTimePerPercent = mode.timeSpent > 0 ? mode.timeSpent / mode.completion : 1;
      return total + (remainingCompletion * avgTimePerPercent);
    }, 0);
    
    return Math.round(estimatedTime);
  }, [metrics]);

  const calculateNextMilestone = useCallback((): string => {
    if (!metrics) return '';
    
    const inProgressModes = Object.values(metrics.modeMetrics)
      .filter(mode => mode.status === 'in_progress')
      .sort((a, b) => b.completion - a.completion);
    
    if (inProgressModes.length > 0) {
      const nextMode = inProgressModes[0];
      return `Terminer ${nextMode.modeName} (${nextMode.completion}% terminé)`;
    }
    
    const notStartedModes = Object.values(metrics.modeMetrics)
      .filter(mode => mode.status === 'not_started');
    
    if (notStartedModes.length > 0) {
      return `Commencer ${notStartedModes[0].modeName}`;
    }
    
    return 'Formation terminée !';
  }, [metrics]);

  const calculateEngagementScore = useCallback((): number => {
    if (!metrics) return 0;
    
    const sessionMetrics = metrics.sessionMetrics;
    const globalProgress = metrics.globalProgress;
    
    // Score basé sur plusieurs facteurs
    const timeEngagement = Math.min(100, (sessionMetrics.currentDuration / 60) * 20); // 20 pts pour 1h
    const actionEngagement = Math.min(100, sessionMetrics.actionsPerformed * 2); // 2 pts par action
    const progressEngagement = globalProgress.overallCompletion; // 1 pt par %
    const consistencyEngagement = Math.min(100, globalProgress.streak * 10); // 10 pts par jour
    
    return Math.round((timeEngagement + actionEngagement + progressEngagement + consistencyEngagement) / 4);
  }, [metrics]);

  return {
    metrics,
    loading,
    error,
    
    // Actions
    updateModeMetrics,
    updateWorkshopMetrics,
    updateChatExpertMetrics,
    updateSessionMetrics,
    refreshMetrics,
    
    // Utilitaires
    getModeProgress,
    getModeStatus,
    getGlobalProgress,
    getRecommendations,
    getAchievements,
    
    // Calculateurs
    calculateTimeToComplete,
    calculateNextMilestone,
    calculateEngagementScore
  };
};

/**
 * 🎯 HOOK SIMPLIFIÉ POUR MÉTRIQUES MODE SPÉCIFIQUE
 */
export const useModeMetrics = (sessionId: string, modeId: string) => {
  const { metrics, updateModeMetrics, getModeProgress, getModeStatus } = useUnifiedMetrics({ sessionId });
  
  const modeData = metrics?.modeMetrics[modeId];
  
  const updateProgress = useCallback((completion: number) => {
    updateModeMetrics({
      modeId,
      updateType: 'progress',
      data: { completion },
      timestamp: new Date().toISOString()
    });
  }, [modeId, updateModeMetrics]);
  
  const updateScore = useCallback((score: number) => {
    updateModeMetrics({
      modeId,
      updateType: 'score',
      data: { score },
      timestamp: new Date().toISOString()
    });
  }, [modeId, updateModeMetrics]);
  
  const addTime = useCallback((timeSpent: number) => {
    updateModeMetrics({
      modeId,
      updateType: 'time',
      data: { timeSpent },
      timestamp: new Date().toISOString()
    });
  }, [modeId, updateModeMetrics]);
  
  const markCompleted = useCallback(() => {
    updateModeMetrics({
      modeId,
      updateType: 'completion',
      data: {},
      timestamp: new Date().toISOString()
    });
  }, [modeId, updateModeMetrics]);
  
  return {
    modeData,
    progress: getModeProgress(modeId),
    status: getModeStatus(modeId),
    updateProgress,
    updateScore,
    addTime,
    markCompleted
  };
};

/**
 * 🎯 HOOK POUR MÉTRIQUES SESSION TEMPS RÉEL
 */
export const useSessionMetrics = (sessionId: string) => {
  const { metrics, updateSessionMetrics } = useUnifiedMetrics({ sessionId, autoRefresh: true, refreshInterval: 10000 });
  
  const sessionData = metrics?.sessionMetrics;
  
  const trackAction = useCallback((action: string) => {
    updateSessionMetrics(action);
  }, [updateSessionMetrics]);
  
  const trackPageView = useCallback((page: string) => {
    trackAction(`page_view_${page}`);
  }, [trackAction]);
  
  const trackInteraction = useCallback((interaction: string) => {
    trackAction(`interaction_${interaction}`);
  }, [trackAction]);
  
  return {
    sessionData,
    trackAction,
    trackPageView,
    trackInteraction,
    duration: sessionData?.currentDuration || 0,
    engagement: sessionData?.engagementScore || 0,
    actions: sessionData?.actionsPerformed || 0
  };
};
