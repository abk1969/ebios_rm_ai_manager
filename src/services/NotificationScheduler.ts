/**
 * ⏰ PLANIFICATEUR INTELLIGENT DE NOTIFICATIONS
 * Système de planification pour notifications temporelles et récurrentes
 */

import { notificationGenerators } from './NotificationGenerators';
import { TriggerEvent } from './NotificationRules';

// 🎯 TYPES POUR LA PLANIFICATION
interface ScheduledNotification {
  id: string;
  ruleId: string;
  userId: string;
  triggerTime: string;
  event: TriggerEvent;
  context: any;
  recurring?: {
    interval: 'daily' | 'weekly' | 'monthly';
    endDate?: string;
    maxOccurrences?: number;
    currentCount?: number;
  };
  status: 'pending' | 'executed' | 'cancelled' | 'failed';
  createdAt: string;
  executedAt?: string;
  lastError?: string;
}

interface SchedulerConfig {
  checkInterval: number; // ms
  maxConcurrentJobs: number;
  retryAttempts: number;
  retryDelay: number; // ms
  enablePersistence: boolean;
}

/**
 * ⏰ PLANIFICATEUR PRINCIPAL
 */
export class NotificationScheduler {
  private static instance: NotificationScheduler | null = null;
  private scheduledNotifications = new Map<string, ScheduledNotification>();
  private timers = new Map<string, NodeJS.Timeout>();
  private isRunning = false;
  private config: SchedulerConfig = {
    checkInterval: 60000, // 1 minute
    maxConcurrentJobs: 10,
    retryAttempts: 3,
    retryDelay: 300000, // 5 minutes
    enablePersistence: true
  };

  public static getInstance(): NotificationScheduler {
    if (!NotificationScheduler.instance) {
      NotificationScheduler.instance = new NotificationScheduler();
    }
    return NotificationScheduler.instance;
  }

  // 🚀 DÉMARRAGE DU PLANIFICATEUR
  public start(): void {
    if (this.isRunning) {
      console.log('⏰ Planificateur déjà en cours d\'exécution');
      return;
    }

    console.log('⏰ Démarrage du planificateur de notifications...');
    this.isRunning = true;

    // Charger les notifications persistées
    if (this.config.enablePersistence) {
      this.loadPersistedSchedules();
    }

    // Démarrer la vérification périodique
    this.startPeriodicCheck();

    // Planifier les notifications récurrentes système
    this.scheduleSystemNotifications();

    console.log('✅ Planificateur de notifications démarré');
  }

  // 🛑 ARRÊT DU PLANIFICATEUR
  public stop(): void {
    if (!this.isRunning) return;

    console.log('⏰ Arrêt du planificateur de notifications...');
    this.isRunning = false;

    // Arrêter tous les timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();

    // Persister les notifications en attente
    if (this.config.enablePersistence) {
      this.persistSchedules();
    }

    console.log('✅ Planificateur de notifications arrêté');
  }

  // 📅 PLANIFIER UNE NOTIFICATION
  public scheduleNotification(
    ruleId: string,
    userId: string,
    triggerTime: Date,
    event: TriggerEvent,
    context: any = {},
    recurring?: ScheduledNotification['recurring']
  ): string {
    const id = this.generateId();
    
    const scheduledNotification: ScheduledNotification = {
      id,
      ruleId,
      userId,
      triggerTime: triggerTime.toISOString(),
      event,
      context,
      recurring,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.scheduledNotifications.set(id, scheduledNotification);
    this.scheduleExecution(scheduledNotification);

    if (this.config.enablePersistence) {
      this.persistSchedules();
    }

    console.log(`📅 Notification planifiée: ${id} pour ${triggerTime.toISOString()}`);
    return id;
  }

  // 🔄 PLANIFIER NOTIFICATIONS RÉCURRENTES SYSTÈME
  private scheduleSystemNotifications(): void {
    const now = new Date();

    // Vérification d'inactivité quotidienne à 18h
    const inactivityCheck = new Date(now);
    inactivityCheck.setHours(18, 0, 0, 0);
    if (inactivityCheck <= now) {
      inactivityCheck.setDate(inactivityCheck.getDate() + 1);
    }

    this.scheduleNotification(
      'inactivity_reminder_progressive',
      'system',
      inactivityCheck,
      {
        type: 'time_based_check',
        source: 'scheduler',
        userId: 'system',
        data: { check_type: 'inactivity' },
        timestamp: new Date().toISOString()
      },
      {},
      { interval: 'daily' }
    );

    // Vérification des échéances quotidienne à 9h
    const deadlineCheck = new Date(now);
    deadlineCheck.setHours(9, 0, 0, 0);
    if (deadlineCheck <= now) {
      deadlineCheck.setDate(deadlineCheck.getDate() + 1);
    }

    this.scheduleNotification(
      'deadline_approaching',
      'system',
      deadlineCheck,
      {
        type: 'deadline_check',
        source: 'scheduler',
        userId: 'system',
        data: { check_type: 'deadlines' },
        timestamp: new Date().toISOString()
      },
      {},
      { interval: 'daily' }
    );

    // Rappel weekend le samedi à 10h
    const weekendReminder = new Date(now);
    const daysUntilSaturday = (6 - now.getDay()) % 7;
    weekendReminder.setDate(now.getDate() + daysUntilSaturday);
    weekendReminder.setHours(10, 0, 0, 0);
    if (weekendReminder <= now) {
      weekendReminder.setDate(weekendReminder.getDate() + 7);
    }

    this.scheduleNotification(
      'weekend_reminder',
      'system',
      weekendReminder,
      {
        type: 'time_based_check',
        source: 'scheduler',
        userId: 'system',
        data: { 
          check_type: 'weekend_reminder',
          day_of_week: 'saturday'
        },
        timestamp: new Date().toISOString()
      },
      {},
      { interval: 'weekly' }
    );
  }

  // ⏰ PLANIFIER L'EXÉCUTION D'UNE NOTIFICATION
  private scheduleExecution(scheduledNotification: ScheduledNotification): void {
    const triggerTime = new Date(scheduledNotification.triggerTime);
    const now = new Date();
    const delay = triggerTime.getTime() - now.getTime();

    if (delay <= 0) {
      // Exécuter immédiatement si le temps est dépassé
      this.executeScheduledNotification(scheduledNotification.id);
      return;
    }

    // Planifier l'exécution
    const timer = setTimeout(() => {
      this.executeScheduledNotification(scheduledNotification.id);
    }, delay);

    this.timers.set(scheduledNotification.id, timer);
  }

  // 🚀 EXÉCUTER UNE NOTIFICATION PLANIFIÉE
  private async executeScheduledNotification(id: string): Promise<void> {
    const scheduledNotification = this.scheduledNotifications.get(id);
    if (!scheduledNotification || scheduledNotification.status !== 'pending') {
      return;
    }

    try {
      console.log(`🚀 Exécution notification planifiée: ${id}`);

      // Marquer comme en cours d'exécution
      scheduledNotification.status = 'executed';
      scheduledNotification.executedAt = new Date().toISOString();

      // Exécuter la notification
      await notificationGenerators.processEvent(
        scheduledNotification.event,
        scheduledNotification.context
      );

      // Gérer la récurrence
      if (scheduledNotification.recurring) {
        this.handleRecurrence(scheduledNotification);
      } else {
        // Supprimer si non récurrente
        this.scheduledNotifications.delete(id);
        this.timers.delete(id);
      }

      console.log(`✅ Notification planifiée exécutée: ${id}`);

    } catch (error) {
      console.error(`❌ Erreur exécution notification planifiée ${id}:`, error);
      
      scheduledNotification.status = 'failed';
      scheduledNotification.lastError = error instanceof Error ? error.message : 'Erreur inconnue';
      
      // Programmer un retry si configuré
      this.scheduleRetry(scheduledNotification);
    }

    if (this.config.enablePersistence) {
      this.persistSchedules();
    }
  }

  // 🔄 GÉRER LA RÉCURRENCE
  private handleRecurrence(scheduledNotification: ScheduledNotification): void {
    const recurring = scheduledNotification.recurring!;
    
    // Vérifier les limites
    if (recurring.maxOccurrences) {
      recurring.currentCount = (recurring.currentCount || 0) + 1;
      if (recurring.currentCount >= recurring.maxOccurrences) {
        this.scheduledNotifications.delete(scheduledNotification.id);
        this.timers.delete(scheduledNotification.id);
        return;
      }
    }

    if (recurring.endDate && new Date() >= new Date(recurring.endDate)) {
      this.scheduledNotifications.delete(scheduledNotification.id);
      this.timers.delete(scheduledNotification.id);
      return;
    }

    // Calculer la prochaine exécution
    const currentTrigger = new Date(scheduledNotification.triggerTime);
    let nextTrigger: Date;

    switch (recurring.interval) {
      case 'daily':
        nextTrigger = new Date(currentTrigger.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        nextTrigger = new Date(currentTrigger.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        nextTrigger = new Date(currentTrigger);
        nextTrigger.setMonth(nextTrigger.getMonth() + 1);
        break;
      default:
        return;
    }

    // Créer la prochaine occurrence
    const nextId = this.generateId();
    const nextScheduledNotification: ScheduledNotification = {
      ...scheduledNotification,
      id: nextId,
      triggerTime: nextTrigger.toISOString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      executedAt: undefined,
      lastError: undefined
    };

    this.scheduledNotifications.set(nextId, nextScheduledNotification);
    this.scheduleExecution(nextScheduledNotification);

    // Supprimer l'ancienne
    this.scheduledNotifications.delete(scheduledNotification.id);
    this.timers.delete(scheduledNotification.id);
  }

  // 🔄 PROGRAMMER UN RETRY
  private scheduleRetry(scheduledNotification: ScheduledNotification): void {
    // TODO: Implémenter la logique de retry
    console.log(`🔄 Retry programmé pour ${scheduledNotification.id}`);
  }

  // ⏰ VÉRIFICATION PÉRIODIQUE
  private startPeriodicCheck(): void {
    const checkInterval = setInterval(() => {
      if (!this.isRunning) {
        clearInterval(checkInterval);
        return;
      }

      this.performPeriodicCheck();
    }, this.config.checkInterval);
  }

  private performPeriodicCheck(): void {
    const now = new Date();
    
    // Vérifier les notifications en retard
    this.scheduledNotifications.forEach((notification, id) => {
      if (notification.status === 'pending') {
        const triggerTime = new Date(notification.triggerTime);
        if (triggerTime <= now && !this.timers.has(id)) {
          console.log(`⚠️ Notification en retard détectée: ${id}`);
          this.executeScheduledNotification(id);
        }
      }
    });

    // Nettoyer les notifications expirées
    this.cleanupExpiredNotifications();
  }

  // 🧹 NETTOYAGE
  private cleanupExpiredNotifications(): void {
    const now = new Date();
    const expiredIds: string[] = [];

    this.scheduledNotifications.forEach((notification, id) => {
      // Supprimer les notifications échouées de plus de 24h
      if (notification.status === 'failed') {
        const failedTime = new Date(notification.executedAt || notification.createdAt);
        if (now.getTime() - failedTime.getTime() > 24 * 60 * 60 * 1000) {
          expiredIds.push(id);
        }
      }
      
      // Supprimer les notifications exécutées non récurrentes de plus de 1h
      if (notification.status === 'executed' && !notification.recurring) {
        const executedTime = new Date(notification.executedAt!);
        if (now.getTime() - executedTime.getTime() > 60 * 60 * 1000) {
          expiredIds.push(id);
        }
      }
    });

    expiredIds.forEach(id => {
      this.scheduledNotifications.delete(id);
      const timer = this.timers.get(id);
      if (timer) {
        clearTimeout(timer);
        this.timers.delete(id);
      }
    });

    if (expiredIds.length > 0) {
      console.log(`🧹 ${expiredIds.length} notification(s) expirée(s) nettoyée(s)`);
    }
  }

  // 💾 PERSISTANCE
  private persistSchedules(): void {
    try {
      const data = Array.from(this.scheduledNotifications.values());
      localStorage.setItem('scheduled_notifications', JSON.stringify(data));
    } catch (error) {
      console.warn('⚠️ Erreur persistance planifications:', error);
    }
  }

  private loadPersistedSchedules(): void {
    try {
      const saved = localStorage.getItem('scheduled_notifications');
      if (saved) {
        const data = JSON.parse(saved) as ScheduledNotification[];
        data.forEach(notification => {
          this.scheduledNotifications.set(notification.id, notification);
          if (notification.status === 'pending') {
            this.scheduleExecution(notification);
          }
        });
        console.log(`📅 ${data.length} notification(s) planifiée(s) chargée(s)`);
      }
    } catch (error) {
      console.warn('⚠️ Erreur chargement planifications:', error);
    }
  }

  // 🔧 UTILITAIRES
  private generateId(): string {
    return `sched_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 📊 API PUBLIQUE
  public getScheduledNotifications(): ScheduledNotification[] {
    return Array.from(this.scheduledNotifications.values());
  }

  public cancelScheduledNotification(id: string): boolean {
    const notification = this.scheduledNotifications.get(id);
    if (!notification) return false;

    notification.status = 'cancelled';
    
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this.scheduledNotifications.delete(id);
    
    if (this.config.enablePersistence) {
      this.persistSchedules();
    }

    return true;
  }

  public getSchedulerStats() {
    const notifications = Array.from(this.scheduledNotifications.values());
    return {
      total: notifications.length,
      pending: notifications.filter(n => n.status === 'pending').length,
      executed: notifications.filter(n => n.status === 'executed').length,
      failed: notifications.filter(n => n.status === 'failed').length,
      cancelled: notifications.filter(n => n.status === 'cancelled').length,
      recurring: notifications.filter(n => n.recurring).length,
      isRunning: this.isRunning
    };
  }
}

// 🎯 INSTANCE GLOBALE
export const notificationScheduler = NotificationScheduler.getInstance();

export default NotificationScheduler;
