/**
 * 🎪 EVENT BUS - COMMUNICATION DÉCOUPLÉE
 * Système d'événements pour architecture event-driven
 * Pattern Observer + Event Sourcing
 */

export enum TrainingEventType {
  // Session Events
  SESSION_CREATED = 'session.created',
  SESSION_STARTED = 'session.started',
  SESSION_PAUSED = 'session.paused',
  SESSION_RESUMED = 'session.resumed',
  SESSION_COMPLETED = 'session.completed',
  SESSION_FAILED = 'session.failed',
  
  // Progress Events
  STEP_COMPLETED = 'progress.step_completed',
  WORKSHOP_COMPLETED = 'progress.workshop_completed',
  MILESTONE_ACHIEVED = 'progress.milestone_achieved',
  
  // Learner Events
  LEARNER_REGISTERED = 'learner.registered',
  LEARNER_PROFILE_UPDATED = 'learner.profile_updated',
  LEARNER_SKILLS_UPDATED = 'learner.skills_updated',
  
  // Assessment Events
  ASSESSMENT_STARTED = 'assessment.started',
  ASSESSMENT_COMPLETED = 'assessment.completed',
  SCORE_CALCULATED = 'assessment.score_calculated',
  
  // AI Events
  AI_SUGGESTION_GENERATED = 'ai.suggestion_generated',
  AI_FEEDBACK_PROVIDED = 'ai.feedback_provided',
  AI_INTERVENTION_TRIGGERED = 'ai.intervention_triggered',
  
  // Badge & Certification Events
  BADGE_EARNED = 'achievement.badge_earned',
  CERTIFICATION_AWARDED = 'achievement.certification_awarded',
  
  // System Events
  ERROR_OCCURRED = 'system.error_occurred',
  PERFORMANCE_METRIC_RECORDED = 'system.performance_recorded'
}

export interface TrainingEvent {
  id: string;
  type: TrainingEventType;
  payload: any;
  metadata: EventMetadata;
  timestamp: Date;
  version: number;
}

export interface EventMetadata {
  userId?: string;
  sessionId?: string;
  organizationId?: string;
  source: string;
  correlationId?: string;
  causationId?: string;
  traceId?: string;
}

export interface EventHandler<T = any> {
  handle(event: TrainingEvent<T>): Promise<void> | void;
  canHandle(event: TrainingEvent): boolean;
  priority?: number; // 0 = highest priority
}

export interface EventSubscription {
  id: string;
  eventType: TrainingEventType | TrainingEventType[];
  handler: EventHandler;
  isActive: boolean;
  createdAt: Date;
}

export interface EventStore {
  append(events: TrainingEvent[]): Promise<void>;
  getEvents(aggregateId: string, fromVersion?: number): Promise<TrainingEvent[]>;
  getEventsByType(eventType: TrainingEventType, limit?: number): Promise<TrainingEvent[]>;
  getEventsByTimeRange(from: Date, to: Date): Promise<TrainingEvent[]>;
}

/**
 * 🎯 EVENT BUS PRINCIPAL
 */
export class TrainingEventBus {
  private static instance: TrainingEventBus;
  private subscriptions: Map<string, EventSubscription[]> = new Map();
  private eventStore?: EventStore;
  private isProcessing = false;
  private eventQueue: TrainingEvent[] = [];
  private metrics = {
    eventsProcessed: 0,
    errorsCount: 0,
    averageProcessingTime: 0
  };

  private constructor() {}

  static getInstance(): TrainingEventBus {
    if (!TrainingEventBus.instance) {
      TrainingEventBus.instance = new TrainingEventBus();
    }
    return TrainingEventBus.instance;
  }

  // 🔧 CONFIGURATION
  setEventStore(eventStore: EventStore): void {
    this.eventStore = eventStore;
  }

  // 📡 PUBLICATION D'ÉVÉNEMENTS
  async emit(event: TrainingEvent): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Ajouter à la queue pour traitement asynchrone
      this.eventQueue.push(event);
      
      // Persister dans l'event store si configuré
      if (this.eventStore) {
        await this.eventStore.append([event]);
      }
      
      // Traiter immédiatement si pas déjà en cours
      if (!this.isProcessing) {
        await this.processEventQueue();
      }
      
      // Métriques
      const processingTime = Date.now() - startTime;
      this.updateMetrics(processingTime, false);
      
    } catch (error) {
      console.error('Error emitting event:', error);
      this.updateMetrics(Date.now() - startTime, true);
      throw error;
    }
  }

  // 📡 PUBLICATION MULTIPLE
  async emitBatch(events: TrainingEvent[]): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Ajouter tous les événements à la queue
      this.eventQueue.push(...events);
      
      // Persister en batch
      if (this.eventStore) {
        await this.eventStore.append(events);
      }
      
      // Traiter la queue
      if (!this.isProcessing) {
        await this.processEventQueue();
      }
      
      const processingTime = Date.now() - startTime;
      this.updateMetrics(processingTime, false);
      
    } catch (error) {
      console.error('Error emitting batch events:', error);
      this.updateMetrics(Date.now() - startTime, true);
      throw error;
    }
  }

  // 🎯 ABONNEMENT AUX ÉVÉNEMENTS
  subscribe(
    eventTypes: TrainingEventType | TrainingEventType[],
    handler: EventHandler,
    options: { priority?: number } = {}
  ): string {
    const subscriptionId = this.generateSubscriptionId();
    const types = Array.isArray(eventTypes) ? eventTypes : [eventTypes];
    
    const subscription: EventSubscription = {
      id: subscriptionId,
      eventType: eventTypes,
      handler: { ...handler, priority: options.priority || 100 },
      isActive: true,
      createdAt: new Date()
    };

    // Ajouter l'abonnement pour chaque type d'événement
    types.forEach(type => {
      if (!this.subscriptions.has(type)) {
        this.subscriptions.set(type, []);
      }
      this.subscriptions.get(type)!.push(subscription);
      
      // Trier par priorité
      this.subscriptions.get(type)!.sort((a, b) => 
        (a.handler.priority || 100) - (b.handler.priority || 100)
      );
    });

    return subscriptionId;
  }

  // 🚫 DÉSABONNEMENT
  unsubscribe(subscriptionId: string): void {
    this.subscriptions.forEach((subscriptions, eventType) => {
      const index = subscriptions.findIndex(sub => sub.id === subscriptionId);
      if (index !== -1) {
        subscriptions.splice(index, 1);
      }
    });
  }

  // ⏸️ PAUSE/REPRISE D'ABONNEMENT
  pauseSubscription(subscriptionId: string): void {
    this.subscriptions.forEach(subscriptions => {
      const subscription = subscriptions.find(sub => sub.id === subscriptionId);
      if (subscription) {
        subscription.isActive = false;
      }
    });
  }

  resumeSubscription(subscriptionId: string): void {
    this.subscriptions.forEach(subscriptions => {
      const subscription = subscriptions.find(sub => sub.id === subscriptionId);
      if (subscription) {
        subscription.isActive = true;
      }
    });
  }

  // 🔄 TRAITEMENT DE LA QUEUE
  private async processEventQueue(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.eventQueue.length > 0) {
        const event = this.eventQueue.shift()!;
        await this.processEvent(event);
      }
    } catch (error) {
      console.error('Error processing event queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // 🎯 TRAITEMENT D'UN ÉVÉNEMENT
  private async processEvent(event: TrainingEvent): Promise<void> {
    const handlers = this.subscriptions.get(event.type) || [];
    const activeHandlers = handlers.filter(sub => sub.isActive);

    // Traitement parallèle des handlers
    const handlerPromises = activeHandlers.map(async (subscription) => {
      try {
        if (subscription.handler.canHandle && !subscription.handler.canHandle(event)) {
          return;
        }
        
        await subscription.handler.handle(event);
      } catch (error) {
        console.error(`Error in event handler ${subscription.id}:`, error);
        
        // Émettre un événement d'erreur
        const errorEvent = this.createErrorEvent(error, event, subscription.id);
        // Éviter la récursion infinie en n'émettant pas via emit()
        this.eventQueue.push(errorEvent);
      }
    });

    await Promise.allSettled(handlerPromises);
  }

  // 🔧 UTILITAIRES
  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createErrorEvent(error: any, originalEvent: TrainingEvent, handlerId: string): TrainingEvent {
    return {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: TrainingEventType.ERROR_OCCURRED,
      payload: {
        error: error.message || error,
        originalEvent,
        handlerId,
        stack: error.stack
      },
      metadata: {
        source: 'TrainingEventBus',
        correlationId: originalEvent.metadata.correlationId
      },
      timestamp: new Date(),
      version: 1
    };
  }

  private updateMetrics(processingTime: number, hasError: boolean): void {
    this.metrics.eventsProcessed++;
    if (hasError) {
      this.metrics.errorsCount++;
    }
    
    // Calcul de la moyenne mobile
    this.metrics.averageProcessingTime = 
      (this.metrics.averageProcessingTime * (this.metrics.eventsProcessed - 1) + processingTime) 
      / this.metrics.eventsProcessed;
  }

  // 📊 MÉTRIQUES ET MONITORING
  getMetrics() {
    return {
      ...this.metrics,
      activeSubscriptions: Array.from(this.subscriptions.values())
        .flat()
        .filter(sub => sub.isActive).length,
      queueSize: this.eventQueue.length,
      isProcessing: this.isProcessing
    };
  }

  // 🧹 NETTOYAGE
  clear(): void {
    this.subscriptions.clear();
    this.eventQueue = [];
    this.isProcessing = false;
    this.metrics = {
      eventsProcessed: 0,
      errorsCount: 0,
      averageProcessingTime: 0
    };
  }
}

// 🏭 FACTORY POUR ÉVÉNEMENTS
export class TrainingEventFactory {
  static createSessionEvent(
    type: TrainingEventType,
    sessionId: string,
    userId: string,
    payload: any,
    metadata: Partial<EventMetadata> = {}
  ): TrainingEvent {
    return {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      metadata: {
        userId,
        sessionId,
        source: 'TrainingSession',
        traceId: this.generateTraceId(),
        ...metadata
      },
      timestamp: new Date(),
      version: 1
    };
  }

  static createLearnerEvent(
    type: TrainingEventType,
    learnerId: string,
    payload: any,
    metadata: Partial<EventMetadata> = {}
  ): TrainingEvent {
    return {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      payload,
      metadata: {
        userId: learnerId,
        source: 'Learner',
        traceId: this.generateTraceId(),
        ...metadata
      },
      timestamp: new Date(),
      version: 1
    };
  }

  private static generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`;
  }
}

// 🎯 INSTANCE GLOBALE
export const trainingEventBus = TrainingEventBus.getInstance();
