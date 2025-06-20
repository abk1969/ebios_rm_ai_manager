/**
 * 🎯 SERVICE D'HARMONISATION DES MODULES DE FORMATION
 * Standardise les flux de données entre chat expert et workshops
 */

// 🎯 TYPES UNIFIÉS POUR L'HARMONISATION
export interface UnifiedTrainingData {
  sessionId: string;
  userId: string;
  trainingMode: 'chat-expert' | 'workshops' | 'mixed';
  currentModule: string;
  progress: UnifiedProgress;
  interactions: UnifiedInteraction[];
  achievements: UnifiedAchievement[];
  metadata: UnifiedMetadata;
}

export interface UnifiedProgress {
  overallCompletion: number; // 0-100
  chatExpertProgress: {
    messagesExchanged: number;
    topicsExplored: string[];
    comprehensionLevel: number;
    lastActivity: string;
  };
  workshopsProgress: {
    currentWorkshop: number;
    workshopCompletions: { [key: number]: WorkshopCompletion };
    totalScore: number;
    badges: string[];
  };
  timeSpent: {
    total: number;
    chatExpert: number;
    workshops: number;
    breakdown: { [module: string]: number };
  };
}

export interface WorkshopCompletion {
  workshopId: number;
  completed: boolean;
  score: number;
  timeSpent: number;
  completedAt?: string;
  exercises: { [exerciseId: string]: ExerciseResult };
}

export interface ExerciseResult {
  exerciseId: string;
  completed: boolean;
  score: number;
  attempts: number;
  timeSpent: number;
  answers: any[];
}

export interface UnifiedInteraction {
  id: string;
  type: 'chat_message' | 'workshop_action' | 'exercise_completion' | 'navigation';
  timestamp: string;
  module: string;
  data: any;
  context: InteractionContext;
}

export interface InteractionContext {
  sessionId: string;
  userId: string;
  currentWorkshop?: number;
  currentStep?: string;
  userIntent?: string;
  aiResponse?: any;
}

export interface UnifiedAchievement {
  id: string;
  type: 'badge' | 'milestone' | 'completion' | 'mastery';
  title: string;
  description: string;
  earnedAt: string;
  module: string;
  criteria: AchievementCriteria;
}

export interface AchievementCriteria {
  requiredScore?: number;
  requiredCompletion?: number;
  requiredTime?: number;
  specificActions?: string[];
}

export interface UnifiedMetadata {
  startedAt: string;
  lastActivity: string;
  deviceInfo: string;
  userAgent: string;
  preferences: UserPreferences;
  analytics: AnalyticsData;
}

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark';
  notifications: boolean;
  autoSave: boolean;
  preferredLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
}

export interface AnalyticsData {
  engagementScore: number;
  learningVelocity: number;
  difficultyPreference: number;
  interactionPatterns: string[];
  strongTopics: string[];
  weakTopics: string[];
}

/**
 * 🎯 SERVICE PRINCIPAL D'HARMONISATION
 */
export class TrainingHarmonizationService {
  private static instance: TrainingHarmonizationService | null = null;

  public static getInstance(): TrainingHarmonizationService {
    if (!this.instance) {
      this.instance = new TrainingHarmonizationService();
    }
    return this.instance;
  }

  /**
   * 🔄 HARMONISER DONNÉES CHAT EXPERT
   */
  harmonizeChatExpertData(chatData: any): Partial<UnifiedTrainingData> {
    return {
      trainingMode: 'chat-expert',
      currentModule: 'chat-expert',
      progress: {
        overallCompletion: this.calculateChatCompletion(chatData),
        chatExpertProgress: {
          messagesExchanged: chatData.messages?.length || 0,
          topicsExplored: this.extractTopicsFromMessages(chatData.messages || []),
          comprehensionLevel: chatData.metrics?.comprehensionLevel || 50,
          lastActivity: new Date().toISOString()
        },
        workshopsProgress: {
          currentWorkshop: 1,
          workshopCompletions: {},
          totalScore: 0,
          badges: []
        },
        timeSpent: {
          total: chatData.timeSpent || 0,
          chatExpert: chatData.timeSpent || 0,
          workshops: 0,
          breakdown: {
            'chat-expert': chatData.timeSpent || 0
          }
        }
      },
      interactions: this.convertChatInteractions(chatData.messages || []),
      achievements: this.generateChatAchievements(chatData)
    };
  }

  /**
   * 🔄 HARMONISER DONNÉES WORKSHOPS
   */
  harmonizeWorkshopsData(workshopsData: any): Partial<UnifiedTrainingData> {
    return {
      trainingMode: 'workshops',
      currentModule: `workshop-${workshopsData.currentWorkshop || 1}`,
      progress: {
        overallCompletion: this.calculateWorkshopsCompletion(workshopsData),
        chatExpertProgress: {
          messagesExchanged: 0,
          topicsExplored: [],
          comprehensionLevel: 50,
          lastActivity: new Date().toISOString()
        },
        workshopsProgress: {
          currentWorkshop: workshopsData.currentWorkshop || 1,
          workshopCompletions: workshopsData.completions || {},
          totalScore: workshopsData.totalScore || 0,
          badges: workshopsData.badges || []
        },
        timeSpent: {
          total: workshopsData.timeSpent || 0,
          chatExpert: 0,
          workshops: workshopsData.timeSpent || 0,
          breakdown: this.calculateWorkshopTimeBreakdown(workshopsData)
        }
      },
      interactions: this.convertWorkshopInteractions(workshopsData.actions || []),
      achievements: this.generateWorkshopAchievements(workshopsData)
    };
  }

  /**
   * 🔄 FUSIONNER DONNÉES MIXTES
   */
  mergeMixedData(chatData: any, workshopsData: any): UnifiedTrainingData {
    const chatHarmonized = this.harmonizeChatExpertData(chatData);
    const workshopsHarmonized = this.harmonizeWorkshopsData(workshopsData);

    return {
      sessionId: chatData.sessionId || workshopsData.sessionId || 'default',
      userId: chatData.userId || workshopsData.userId || 'default',
      trainingMode: 'mixed',
      currentModule: workshopsData.currentWorkshop ? `workshop-${workshopsData.currentWorkshop}` : 'chat-expert',
      progress: {
        overallCompletion: this.calculateMixedCompletion(chatData, workshopsData),
        chatExpertProgress: chatHarmonized.progress!.chatExpertProgress,
        workshopsProgress: workshopsHarmonized.progress!.workshopsProgress,
        timeSpent: {
          total: (chatHarmonized.progress!.timeSpent.total + workshopsHarmonized.progress!.timeSpent.total),
          chatExpert: chatHarmonized.progress!.timeSpent.chatExpert,
          workshops: workshopsHarmonized.progress!.timeSpent.workshops,
          breakdown: {
            ...chatHarmonized.progress!.timeSpent.breakdown,
            ...workshopsHarmonized.progress!.timeSpent.breakdown
          }
        }
      },
      interactions: [
        ...chatHarmonized.interactions!,
        ...workshopsHarmonized.interactions!
      ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
      achievements: [
        ...chatHarmonized.achievements!,
        ...workshopsHarmonized.achievements!
      ],
      metadata: {
        startedAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        deviceInfo: navigator.userAgent,
        userAgent: navigator.userAgent,
        preferences: {
          language: 'fr',
          theme: 'light',
          notifications: true,
          autoSave: true,
          preferredLearningStyle: 'mixed'
        },
        analytics: this.generateAnalytics(chatData, workshopsData)
      }
    };
  }

  /**
   * 🎯 MÉTHODES UTILITAIRES PRIVÉES
   */
  private calculateChatCompletion(chatData: any): number {
    const messageCount = chatData.messages?.length || 0;
    const topicsExplored = this.extractTopicsFromMessages(chatData.messages || []).length;
    
    // Formule basée sur l'engagement et la diversité des sujets
    return Math.min(100, (messageCount * 2) + (topicsExplored * 10));
  }

  private calculateWorkshopsCompletion(workshopsData: any): number {
    const completions = workshopsData.completions || {};
    const totalWorkshops = 5;
    const completedWorkshops = Object.values(completions).filter((c: any) => c.completed).length;
    
    return (completedWorkshops / totalWorkshops) * 100;
  }

  private calculateMixedCompletion(chatData: any, workshopsData: any): number {
    const chatCompletion = this.calculateChatCompletion(chatData);
    const workshopsCompletion = this.calculateWorkshopsCompletion(workshopsData);
    
    // Pondération : 40% chat, 60% workshops
    return (chatCompletion * 0.4) + (workshopsCompletion * 0.6);
  }

  private extractTopicsFromMessages(messages: any[]): string[] {
    const topics = new Set<string>();
    const ebiosTopics = [
      'biens essentiels', 'biens supports', 'événements redoutés',
      'sources de risques', 'scénarios stratégiques', 'scénarios opérationnels',
      'traitement du risque', 'mesures de sécurité', 'ANSSI', 'EBIOS RM'
    ];

    messages.forEach(message => {
      const content = message.content?.toLowerCase() || '';
      ebiosTopics.forEach(topic => {
        if (content.includes(topic.toLowerCase())) {
          topics.add(topic);
        }
      });
    });

    return Array.from(topics);
  }

  private convertChatInteractions(messages: any[]): UnifiedInteraction[] {
    return messages.map((message, index) => ({
      id: `chat_${index}`,
      type: 'chat_message' as const,
      timestamp: message.timestamp || new Date().toISOString(),
      module: 'chat-expert',
      data: {
        content: message.content,
        type: message.type,
        metadata: message.metadata
      },
      context: {
        sessionId: 'current',
        userId: 'current',
        userIntent: this.detectIntent(message.content)
      }
    }));
  }

  private convertWorkshopInteractions(actions: any[]): UnifiedInteraction[] {
    return actions.map((action, index) => ({
      id: `workshop_${index}`,
      type: 'workshop_action' as const,
      timestamp: action.timestamp || new Date().toISOString(),
      module: `workshop-${action.workshopId || 1}`,
      data: action,
      context: {
        sessionId: 'current',
        userId: 'current',
        currentWorkshop: action.workshopId,
        currentStep: action.stepId
      }
    }));
  }

  private generateChatAchievements(chatData: any): UnifiedAchievement[] {
    const achievements: UnifiedAchievement[] = [];
    const messageCount = chatData.messages?.length || 0;

    if (messageCount >= 10) {
      achievements.push({
        id: 'chat_explorer',
        type: 'milestone',
        title: 'Explorateur EBIOS RM',
        description: 'Première exploration approfondie de la méthode',
        earnedAt: new Date().toISOString(),
        module: 'chat-expert',
        criteria: { requiredActions: ['10_messages'] }
      });
    }

    return achievements;
  }

  private generateWorkshopAchievements(workshopsData: any): UnifiedAchievement[] {
    const achievements: UnifiedAchievement[] = [];
    const completions = workshopsData.completions || {};

    Object.entries(completions).forEach(([workshopId, completion]: [string, any]) => {
      if (completion.completed) {
        achievements.push({
          id: `workshop_${workshopId}_completed`,
          type: 'completion',
          title: `Atelier ${workshopId} Terminé`,
          description: `Atelier ${workshopId} EBIOS RM complété avec succès`,
          earnedAt: completion.completedAt || new Date().toISOString(),
          module: `workshop-${workshopId}`,
          criteria: { requiredCompletion: 100 }
        });
      }
    });

    return achievements;
  }

  private calculateWorkshopTimeBreakdown(workshopsData: any): { [module: string]: number } {
    const breakdown: { [module: string]: number } = {};
    const completions = workshopsData.completions || {};

    Object.entries(completions).forEach(([workshopId, completion]: [string, any]) => {
      breakdown[`workshop-${workshopId}`] = completion.timeSpent || 0;
    });

    return breakdown;
  }

  private generateAnalytics(chatData: any, workshopsData: any): AnalyticsData {
    return {
      engagementScore: 75, // Calculé dynamiquement
      learningVelocity: 60,
      difficultyPreference: 70,
      interactionPatterns: ['sequential', 'exploratory'],
      strongTopics: this.extractTopicsFromMessages(chatData.messages || []),
      weakTopics: []
    };
  }

  private detectIntent(content: string): string {
    if (/comment|pourquoi|qu'est-ce/i.test(content)) return 'question';
    if (/exemple|cas/i.test(content)) return 'example';
    if (/aide|help/i.test(content)) return 'help';
    return 'general';
  }
}

export default TrainingHarmonizationService;
