/**
 * 📊 GESTIONNAIRE UNIFIÉ DES MÉTRIQUES FORMATION
 * Système centralisé pour synchroniser métriques ChatExpert et Workshops
 */

// 🎯 TYPES POUR MÉTRIQUES UNIFIÉES
export interface UnifiedMetrics {
  globalProgress: GlobalProgress;
  modeMetrics: { [key: string]: ModeMetrics };
  achievements: Achievement[];
  learningPath: LearningPathProgress;
  sessionMetrics: SessionMetrics;
  recommendations: Recommendation[];
}

export interface GlobalProgress {
  overallCompletion: number; // 0-100%
  totalTimeSpent: number; // minutes
  averageScore: number; // 0-100
  modesCompleted: number;
  totalModes: number;
  streak: number; // jours consécutifs
  lastActivity: string; // ISO date
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  nextMilestone: string;
}

export interface ModeMetrics {
  modeId: string;
  modeName: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
  completion: number; // 0-100%
  timeSpent: number; // minutes
  score: number; // 0-100
  attempts: number;
  lastAccess: string; // ISO date
  specificMetrics: any; // Métriques spécifiques au mode
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progression' | 'performance' | 'consistency' | 'mastery';
  unlockedAt: string; // ISO date
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

export interface LearningPathProgress {
  currentPath: string;
  pathCompletion: number; // 0-100%
  recommendedNext: string[];
  prerequisites: PrerequisiteStatus[];
  estimatedTimeToComplete: number; // minutes
  adaptiveRecommendations: string[];
}

export interface PrerequisiteStatus {
  requirement: string;
  status: 'completed' | 'in_progress' | 'not_started';
  importance: 'required' | 'recommended' | 'optional';
}

export interface SessionMetrics {
  sessionId: string;
  startTime: string; // ISO date
  currentDuration: number; // minutes
  modesVisited: string[];
  actionsPerformed: number;
  engagementScore: number; // 0-100
  focusTime: number; // minutes de focus réel
  breakTime: number; // minutes d'inactivité
}

export interface Recommendation {
  id: string;
  type: 'next_action' | 'improvement' | 'review' | 'challenge';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  actionUrl?: string;
  estimatedTime?: number; // minutes
  expectedBenefit: string;
}

export interface MetricsUpdate {
  modeId: string;
  updateType: 'progress' | 'completion' | 'score' | 'time' | 'custom';
  data: any;
  timestamp: string;
}

/**
 * 🎯 CLASSE PRINCIPALE GESTIONNAIRE MÉTRIQUES
 */
export class UnifiedMetricsManager {
  
  // 📊 DONNÉES SIMULÉES POUR DÉMONSTRATION
  private static mockMetrics: UnifiedMetrics = {
    globalProgress: {
      overallCompletion: 35,
      totalTimeSpent: 180, // 3h
      averageScore: 78,
      modesCompleted: 1,
      totalModes: 4,
      streak: 3,
      lastActivity: new Date().toISOString(),
      level: 'Intermédiaire',
      nextMilestone: 'Terminer le cas d\'étude pour débloquer les ateliers'
    },
    modeMetrics: {
      'discovery': {
        modeId: 'discovery',
        modeName: 'Découverte EBIOS RM',
        status: 'completed',
        completion: 100,
        timeSpent: 45,
        score: 85,
        attempts: 1,
        lastAccess: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        specificMetrics: {
          conceptsLearned: 12,
          quizScore: 85,
          readingTime: 35
        }
      },
      'case-study': {
        modeId: 'case-study',
        modeName: 'Cas d\'étude CHU',
        status: 'in_progress',
        completion: 60,
        timeSpent: 75,
        score: 72,
        attempts: 2,
        lastAccess: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        specificMetrics: {
          sectionsCompleted: 3,
          totalSections: 5,
          analysisQuality: 'Bon'
        }
      },
      'expert-chat': {
        modeId: 'expert-chat',
        modeName: 'Chat Expert IA',
        status: 'in_progress',
        completion: 40,
        timeSpent: 60,
        score: 76,
        attempts: 5,
        lastAccess: new Date().toISOString(),
        specificMetrics: {
          questionsAsked: 23,
          topicsExplored: 8,
          satisfactionRate: 4.2
        }
      },
      'workshops': {
        modeId: 'workshops',
        modeName: 'Ateliers Interactifs',
        status: 'not_started',
        completion: 0,
        timeSpent: 0,
        score: 0,
        attempts: 0,
        lastAccess: '',
        specificMetrics: {
          workshopsCompleted: 0,
          totalWorkshops: 5,
          exerciseScore: 0
        }
      }
    },
    achievements: [
      {
        id: 'first_steps',
        title: 'Premiers pas',
        description: 'Terminer le module Découverte',
        icon: '🎯',
        category: 'progression',
        unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        rarity: 'common',
        points: 100
      },
      {
        id: 'consistent_learner',
        title: 'Apprenant assidu',
        description: '3 jours consécutifs de formation',
        icon: '🔥',
        category: 'consistency',
        unlockedAt: new Date().toISOString(),
        rarity: 'rare',
        points: 250
      }
    ],
    learningPath: {
      currentPath: 'EBIOS RM Complet',
      pathCompletion: 35,
      recommendedNext: ['case-study', 'expert-chat'],
      prerequisites: [
        {
          requirement: 'Découverte EBIOS RM',
          status: 'completed',
          importance: 'required'
        },
        {
          requirement: 'Cas d\'étude pratique',
          status: 'in_progress',
          importance: 'required'
        }
      ],
      estimatedTimeToComplete: 245, // 4h05 restantes
      adaptiveRecommendations: [
        'Terminer le cas d\'étude avant les ateliers',
        'Utiliser le chat expert pour clarifier les concepts',
        'Prévoir 2-3 sessions pour les ateliers'
      ]
    },
    sessionMetrics: {
      sessionId: 'session-123',
      startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      currentDuration: 45,
      modesVisited: ['expert-chat'],
      actionsPerformed: 15,
      engagementScore: 82,
      focusTime: 38,
      breakTime: 7
    },
    recommendations: [
      {
        id: 'complete_case_study',
        type: 'next_action',
        priority: 'high',
        title: 'Terminer le cas d\'étude',
        description: 'Vous êtes à 60% du cas d\'étude CHU. Terminez-le pour débloquer les ateliers.',
        actionUrl: '/training/session/123?mode=case-study',
        estimatedTime: 30,
        expectedBenefit: 'Débloquer les ateliers interactifs'
      },
      {
        id: 'review_concepts',
        type: 'review',
        priority: 'medium',
        title: 'Réviser les concepts',
        description: 'Utilisez le chat expert pour clarifier les points complexes.',
        actionUrl: '/training/session/123?mode=expert-chat',
        estimatedTime: 15,
        expectedBenefit: 'Améliorer la compréhension'
      }
    ]
  };

  // 📊 RÉCUPÉRATION MÉTRIQUES GLOBALES
  static getUnifiedMetrics(sessionId: string): UnifiedMetrics {
    // En production, charger depuis le backend
    return {
      ...this.mockMetrics,
      sessionMetrics: {
        ...this.mockMetrics.sessionMetrics,
        sessionId
      }
    };
  }

  // 🔄 MISE À JOUR MÉTRIQUES MODE
  static updateModeMetrics(update: MetricsUpdate): void {
    const metrics = this.mockMetrics.modeMetrics[update.modeId];
    if (!metrics) return;

    switch (update.updateType) {
      case 'progress':
        metrics.completion = Math.min(100, Math.max(0, update.data.completion || 0));
        metrics.status = metrics.completion === 100 ? 'completed' : 'in_progress';
        break;
      case 'score':
        metrics.score = Math.min(100, Math.max(0, update.data.score || 0));
        break;
      case 'time':
        metrics.timeSpent += update.data.timeSpent || 0;
        break;
      case 'completion':
        metrics.status = 'completed';
        metrics.completion = 100;
        this.checkAchievements(update.modeId);
        break;
    }

    metrics.lastAccess = update.timestamp;
    this.updateGlobalProgress();
  }

  // 🏆 VÉRIFICATION ACHIEVEMENTS
  private static checkAchievements(modeId: string): void {
    const achievements = this.mockMetrics.achievements;
    
    // Achievement completion mode
    if (modeId === 'workshops' && !achievements.find(a => a.id === 'workshop_master')) {
      achievements.push({
        id: 'workshop_master',
        title: 'Maître des ateliers',
        description: 'Terminer tous les ateliers EBIOS RM',
        icon: '🏆',
        category: 'mastery',
        unlockedAt: new Date().toISOString(),
        rarity: 'epic',
        points: 500
      });
    }
  }

  // 📈 MISE À JOUR PROGRESSION GLOBALE
  private static updateGlobalProgress(): void {
    const modes = Object.values(this.mockMetrics.modeMetrics);
    const completedModes = modes.filter(m => m.status === 'completed').length;
    const totalCompletion = modes.reduce((sum, m) => sum + m.completion, 0) / modes.length;
    const totalTime = modes.reduce((sum, m) => sum + m.timeSpent, 0);
    const averageScore = modes.reduce((sum, m) => sum + m.score, 0) / modes.length;

    this.mockMetrics.globalProgress = {
      ...this.mockMetrics.globalProgress,
      overallCompletion: Math.round(totalCompletion),
      totalTimeSpent: totalTime,
      averageScore: Math.round(averageScore),
      modesCompleted: completedModes,
      lastActivity: new Date().toISOString()
    };

    // Mise à jour niveau
    if (totalCompletion >= 80) this.mockMetrics.globalProgress.level = 'Expert';
    else if (totalCompletion >= 60) this.mockMetrics.globalProgress.level = 'Avancé';
    else if (totalCompletion >= 30) this.mockMetrics.globalProgress.level = 'Intermédiaire';
    else this.mockMetrics.globalProgress.level = 'Débutant';
  }

  // 💡 GÉNÉRATION RECOMMANDATIONS
  static generateRecommendations(sessionId: string): Recommendation[] {
    const metrics = this.getUnifiedMetrics(sessionId);
    const recommendations: Recommendation[] = [];

    // Recommandation basée sur progression
    const inProgressModes = Object.values(metrics.modeMetrics)
      .filter(m => m.status === 'in_progress')
      .sort((a, b) => b.completion - a.completion);

    if (inProgressModes.length > 0) {
      const topMode = inProgressModes[0];
      recommendations.push({
        id: `continue_${topMode.modeId}`,
        type: 'next_action',
        priority: 'high',
        title: `Continuer ${topMode.modeName}`,
        description: `Vous êtes à ${topMode.completion}% de completion.`,
        actionUrl: `/training/session/${sessionId}?mode=${topMode.modeId}`,
        estimatedTime: Math.round((100 - topMode.completion) * 0.5),
        expectedBenefit: 'Terminer le module en cours'
      });
    }

    // Recommandation chat expert si score faible
    const lowScoreModes = Object.values(metrics.modeMetrics)
      .filter(m => m.score > 0 && m.score < 70);

    if (lowScoreModes.length > 0) {
      recommendations.push({
        id: 'improve_understanding',
        type: 'improvement',
        priority: 'medium',
        title: 'Améliorer la compréhension',
        description: 'Utilisez le chat expert pour clarifier les concepts difficiles.',
        actionUrl: `/training/session/${sessionId}?mode=expert-chat`,
        estimatedTime: 20,
        expectedBenefit: 'Améliorer les scores et la compréhension'
      });
    }

    return recommendations;
  }

  // 📊 MÉTRIQUES SESSION TEMPS RÉEL
  static updateSessionMetrics(sessionId: string, action: string): void {
    const session = this.mockMetrics.sessionMetrics;
    if (session.sessionId === sessionId) {
      session.actionsPerformed += 1;
      session.currentDuration = Math.floor((Date.now() - new Date(session.startTime).getTime()) / 60000);
      
      // Calcul engagement basé sur actions/temps
      session.engagementScore = Math.min(100, Math.round(
        (session.actionsPerformed / session.currentDuration) * 50 + 
        (session.focusTime / session.currentDuration) * 50
      ));
    }
  }

  // 🎯 MÉTRIQUES SPÉCIFIQUES WORKSHOPS
  static updateWorkshopMetrics(workshopId: number, results: any): void {
    const workshopMetrics = this.mockMetrics.modeMetrics['workshops'];
    if (!workshopMetrics.specificMetrics) {
      workshopMetrics.specificMetrics = {
        workshopsCompleted: 0,
        totalWorkshops: 5,
        exerciseScore: 0,
        workshopScores: {}
      };
    }

    // Mise à jour score workshop spécifique
    workshopMetrics.specificMetrics.workshopScores[workshopId] = results.score || 0;
    
    // Recalcul métriques globales workshops
    const completedWorkshops = Object.keys(workshopMetrics.specificMetrics.workshopScores).length;
    workshopMetrics.specificMetrics.workshopsCompleted = completedWorkshops;
    
    const totalScore = Object.values(workshopMetrics.specificMetrics.workshopScores)
      .reduce((sum: number, score: any) => sum + (score || 0), 0);
    workshopMetrics.specificMetrics.exerciseScore = Math.round(totalScore / completedWorkshops);

    // Mise à jour métriques mode
    workshopMetrics.completion = (completedWorkshops / 5) * 100;
    workshopMetrics.score = workshopMetrics.specificMetrics.exerciseScore;
    workshopMetrics.timeSpent += results.timeSpent || 0;
    workshopMetrics.status = completedWorkshops === 5 ? 'completed' : 'in_progress';

    this.updateGlobalProgress();
  }

  // 🎯 MÉTRIQUES SPÉCIFIQUES CHAT EXPERT
  static updateChatExpertMetrics(data: any): void {
    const chatMetrics = this.mockMetrics.modeMetrics['expert-chat'];
    if (!chatMetrics.specificMetrics) {
      chatMetrics.specificMetrics = {
        questionsAsked: 0,
        topicsExplored: 0,
        satisfactionRate: 0
      };
    }

    if (data.questionAsked) {
      chatMetrics.specificMetrics.questionsAsked += 1;
    }
    if (data.newTopic) {
      chatMetrics.specificMetrics.topicsExplored += 1;
    }
    if (data.satisfaction) {
      chatMetrics.specificMetrics.satisfactionRate = data.satisfaction;
    }

    // Calcul score basé sur engagement
    const engagementScore = Math.min(100, 
      (chatMetrics.specificMetrics.questionsAsked * 2) + 
      (chatMetrics.specificMetrics.topicsExplored * 5) +
      (chatMetrics.specificMetrics.satisfactionRate * 15)
    );

    chatMetrics.score = engagementScore;
    chatMetrics.completion = Math.min(100, chatMetrics.specificMetrics.questionsAsked * 4);
    chatMetrics.status = chatMetrics.completion >= 80 ? 'completed' : 'in_progress';

    this.updateGlobalProgress();
  }

  // 📈 EXPORT DONNÉES POUR TABLEAU DE BORD
  static getDashboardData(sessionId: string): any {
    const metrics = this.getUnifiedMetrics(sessionId);
    
    return {
      summary: {
        level: metrics.globalProgress.level,
        completion: metrics.globalProgress.overallCompletion,
        timeSpent: metrics.globalProgress.totalTimeSpent,
        score: metrics.globalProgress.averageScore
      },
      modes: Object.values(metrics.modeMetrics).map(mode => ({
        id: mode.modeId,
        name: mode.modeName,
        status: mode.status,
        completion: mode.completion,
        score: mode.score,
        timeSpent: mode.timeSpent
      })),
      achievements: metrics.achievements.slice(-3), // 3 derniers
      recommendations: metrics.recommendations.slice(0, 2), // 2 prioritaires
      session: {
        duration: metrics.sessionMetrics.currentDuration,
        engagement: metrics.sessionMetrics.engagementScore,
        actions: metrics.sessionMetrics.actionsPerformed
      }
    };
  }
}
