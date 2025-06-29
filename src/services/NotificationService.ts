/**
 * 🔔 SERVICE PRINCIPAL DE NOTIFICATIONS
 * Gestion centralisée des notifications EBIOS RM
 */

import {
  EbiosNotification,
  NotificationSettings,
  NotificationFilters,
  NotificationStats,
  NotificationEvent,
  NotificationServiceConfig,
  NotificationServiceState,
  NotificationType,
  NotificationCategory,
  NotificationPriority,
  DEFAULT_NOTIFICATION_SETTINGS
} from '../types/notifications';
import type { CreateNotificationInput } from '../types/notifications';
import { notificationValidators } from '../utils/notificationValidators';
import { notificationMonitoring } from './NotificationMonitoring';

export class NotificationService {
  private static instance: NotificationService | null = null;
  private state: NotificationServiceState;
  private config: NotificationServiceConfig;
  private listeners: Map<string, (notification: EbiosNotification) => void> = new Map();
  private eventListeners: Map<string, (event: NotificationEvent) => void> = new Map();

  private constructor() {
    this.config = {
      maxStoredNotifications: 1000,
      defaultExpirationDays: 30,
      enablePersistence: true,
      enableRealTime: true,
      enableDesktopNotifications: true,
      enableSounds: true,
      soundUrls: {
        info: '/sounds/notification-info.mp3',
        success: '/sounds/notification-success.mp3',
        warning: '/sounds/notification-warning.mp3',
        error: '/sounds/notification-error.mp3',
        action: '/sounds/notification-action.mp3',
        achievement: '/sounds/notification-achievement.mp3',
        reminder: '/sounds/notification-reminder.mp3',
        update: '/sounds/notification-update.mp3'
      },
      retryAttempts: 3,
      retryDelay: 1000
    };

    this.state = {
      notifications: [],
      settings: DEFAULT_NOTIFICATION_SETTINGS,
      stats: this.calculateStats([]),
      isLoading: false,
      error: null,
      lastSync: null,
      permission: 'default'
    };

    this.initialize();
  }

  // 🏭 SINGLETON PATTERN
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // 🚀 INITIALISATION
  private async initialize(): Promise<void> {
    try {
      console.log('🔔 Initialisation NotificationService...');

      // Charger les paramètres sauvegardés
      await this.loadSettings();

      // Charger les notifications persistées
      if (this.config.enablePersistence) {
        await this.loadPersistedNotifications();
      }

      // Demander permission pour notifications desktop
      if (this.config.enableDesktopNotifications) {
        await this.requestNotificationPermission();
      }

      // Nettoyer les notifications expirées
      this.cleanupExpiredNotifications();

      // Démarrer le nettoyage périodique
      this.startPeriodicCleanup();

      console.log('✅ NotificationService initialisé avec succès');
    } catch (error) {
      console.error('❌ Erreur initialisation NotificationService:', error);
      this.state.error = error instanceof Error ? error.message : 'Erreur inconnue';
    }
  }

  // 📝 CRÉER UNE NOTIFICATION AVEC VALIDATION
  public async createNotification(
    notification: CreateNotificationInput
  ): Promise<string> {
    const startTime = Date.now();

    try {
      // 🔍 VALIDATION DES DONNÉES
      const validationResult = notificationValidators.validateAndSanitize('CreateNotificationInput', notification);

      if (!validationResult.isValid) {
        const errorMessage = `Validation échouée: ${validationResult.errors.map(e => e.message).join(', ')}`;
        console.error('❌ Erreur validation notification:', validationResult.errors);

        // Enregistrer la performance (échec)
        notificationMonitoring.recordPerformance('createNotification', Date.now() - startTime, false, {
          validationErrors: validationResult.errors.length,
          warnings: validationResult.warnings.length
        });

        throw new Error(errorMessage);
      }

      // Afficher les warnings s'il y en a
      if (validationResult.warnings.length > 0) {
        console.warn('⚠️ Warnings validation notification:', validationResult.warnings);
      }

      // Utiliser les données validées et sanitisées
      const sanitizedNotification = validationResult.data!;
      const id = this.generateId();
      const now = new Date().toISOString();

      const fullNotification: EbiosNotification = {
        ...sanitizedNotification,
        id,
        createdAt: now,
        status: 'unread',
        expiresAt: sanitizedNotification.expiresAt || this.getDefaultExpiration()
      };

      // Vérifier les heures de silence
      if (this.isQuietHours()) {
        fullNotification.status = 'read'; // Marquer comme lu pour éviter le bruit
      }

      // Ajouter à la liste
      this.state.notifications.unshift(fullNotification);

      // Limiter le nombre de notifications
      if (this.state.notifications.length > this.config.maxStoredNotifications) {
        this.state.notifications = this.state.notifications.slice(0, this.config.maxStoredNotifications);
      }

      // Mettre à jour les statistiques
      this.state.stats = this.calculateStats(this.state.notifications);

      // Persister si activé
      if (this.config.enablePersistence) {
        await this.persistNotifications();
      }

      // Notifier les listeners
      this.notifyListeners(fullNotification);

      // Afficher notification desktop si autorisé
      if (this.shouldShowDesktopNotification(fullNotification)) {
        this.showDesktopNotification(fullNotification);
      }

      // Jouer son si activé
      if (this.shouldPlaySound(fullNotification)) {
        this.playNotificationSound(fullNotification.type);
      }

      // Émettre événement
      this.emitEvent({
        type: 'created',
        notificationId: id,
        timestamp: now
      });

      // 📊 ENREGISTRER DANS LE MONITORING
      notificationMonitoring.recordNotificationCreated(fullNotification);
      notificationMonitoring.recordPerformance('createNotification', Date.now() - startTime, true, {
        type: fullNotification.type,
        category: fullNotification.category,
        priority: fullNotification.priority,
        hasActions: fullNotification.actions.length > 0
      });

      console.log(`🔔 Notification créée et validée: ${fullNotification.title}`);
      return id;

    } catch (error) {
      // Enregistrer l'erreur dans le monitoring
      notificationMonitoring.recordPerformance('createNotification', Date.now() - startTime, false, {
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });

      console.error('❌ Erreur création notification:', error);
      throw error;
    }
  }

  // 📖 RÉCUPÉRER LES NOTIFICATIONS
  public getNotifications(filters?: NotificationFilters): EbiosNotification[] {
    let filtered = [...this.state.notifications];

    if (filters) {
      if (filters.types?.length) {
        filtered = filtered.filter(n => filters.types!.includes(n.type));
      }
      if (filters.categories?.length) {
        filtered = filtered.filter(n => filters.categories!.includes(n.category));
      }
      if (filters.priorities?.length) {
        filtered = filtered.filter(n => filters.priorities!.includes(n.priority));
      }
      if (filters.statuses?.length) {
        filtered = filtered.filter(n => filters.statuses!.includes(n.status));
      }
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filtered = filtered.filter(n => 
          n.title.toLowerCase().includes(search) ||
          n.message.toLowerCase().includes(search) ||
          n.description?.toLowerCase().includes(search)
        );
      }
      if (filters.dateFrom) {
        filtered = filtered.filter(n => n.createdAt >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        filtered = filtered.filter(n => n.createdAt <= filters.dateTo!);
      }
      if (filters.tags?.length) {
        filtered = filtered.filter(n => 
          filters.tags!.some(tag => n.tags.includes(tag))
        );
      }
    }

    return filtered;
  }

  // 📊 RÉCUPÉRER LES STATISTIQUES
  public getStats(): NotificationStats {
    return { ...this.state.stats };
  }

  // ⚙️ RÉCUPÉRER LES PARAMÈTRES
  public getSettings(): NotificationSettings {
    return { ...this.state.settings };
  }

  // 💾 METTRE À JOUR LES PARAMÈTRES
  public async updateSettings(settings: Partial<NotificationSettings>): Promise<void> {
    try {
      this.state.settings = { ...this.state.settings, ...settings };
      
      if (this.config.enablePersistence) {
        localStorage.setItem('notification_settings', JSON.stringify(this.state.settings));
      }

      console.log('✅ Paramètres notifications mis à jour');
    } catch (error) {
      console.error('❌ Erreur mise à jour paramètres:', error);
      throw error;
    }
  }

  // ✅ MARQUER COMME LU
  public async markAsRead(notificationId: string): Promise<void> {
    const notification = this.state.notifications.find(n => n.id === notificationId);
    if (notification && notification.status === 'unread') {
      notification.status = 'read';
      notification.readAt = new Date().toISOString();
      
      this.state.stats = this.calculateStats(this.state.notifications);
      
      if (this.config.enablePersistence) {
        await this.persistNotifications();
      }

      this.emitEvent({
        type: 'read',
        notificationId,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 🗑️ SUPPRIMER UNE NOTIFICATION
  public async deleteNotification(notificationId: string): Promise<void> {
    const index = this.state.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.state.notifications.splice(index, 1);
      this.state.stats = this.calculateStats(this.state.notifications);
      
      if (this.config.enablePersistence) {
        await this.persistNotifications();
      }

      this.emitEvent({
        type: 'dismissed',
        notificationId,
        timestamp: new Date().toISOString()
      });
    }
  }

  // 🧹 NETTOYER TOUTES LES NOTIFICATIONS
  public async clearAllNotifications(): Promise<void> {
    this.state.notifications = [];
    this.state.stats = this.calculateStats([]);
    
    if (this.config.enablePersistence) {
      await this.persistNotifications();
    }
  }

  // 👂 ÉCOUTER LES NOUVELLES NOTIFICATIONS
  public subscribe(id: string, callback: (notification: EbiosNotification) => void): void {
    this.listeners.set(id, callback);
  }

  // 🔇 ARRÊTER D'ÉCOUTER
  public unsubscribe(id: string): void {
    this.listeners.delete(id);
  }

  // 📡 ÉCOUTER LES ÉVÉNEMENTS
  public subscribeToEvents(id: string, callback: (event: NotificationEvent) => void): void {
    this.eventListeners.set(id, callback);
  }

  // 🔇 ARRÊTER D'ÉCOUTER LES ÉVÉNEMENTS
  public unsubscribeFromEvents(id: string): void {
    this.eventListeners.delete(id);
  }

  // 🔧 MÉTHODES PRIVÉES

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDefaultExpiration(): string {
    const date = new Date();
    date.setDate(date.getDate() + this.config.defaultExpirationDays);
    return date.toISOString();
  }

  private calculateStats(notifications: EbiosNotification[]): NotificationStats {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: notifications.length,
      unread: notifications.filter(n => n.status === 'unread').length,
      byType: notifications.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {} as Record<NotificationType, number>),
      byCategory: notifications.reduce((acc, n) => {
        acc[n.category] = (acc[n.category] || 0) + 1;
        return acc;
      }, {} as Record<NotificationCategory, number>),
      byPriority: notifications.reduce((acc, n) => {
        acc[n.priority] = (acc[n.priority] || 0) + 1;
        return acc;
      }, {} as Record<NotificationPriority, number>),
      recentActivity: {
        today: notifications.filter(n => new Date(n.createdAt) >= today).length,
        thisWeek: notifications.filter(n => new Date(n.createdAt) >= thisWeek).length,
        thisMonth: notifications.filter(n => new Date(n.createdAt) >= thisMonth).length
      }
    };
  }

  private notifyListeners(notification: EbiosNotification): void {
    this.listeners.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('❌ Erreur callback notification:', error);
      }
    });
  }

  private emitEvent(event: NotificationEvent): void {
    this.eventListeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('❌ Erreur callback événement:', error);
      }
    });
  }

  private async loadSettings(): Promise<void> {
    try {
      const saved = localStorage.getItem('notification_settings');
      if (saved) {
        this.state.settings = { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('⚠️ Erreur chargement paramètres notifications:', error);
    }
  }

  private async loadPersistedNotifications(): Promise<void> {
    try {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        const notifications = JSON.parse(saved) as EbiosNotification[];
        this.state.notifications = notifications.filter(n => 
          !n.expiresAt || new Date(n.expiresAt) > new Date()
        );
        this.state.stats = this.calculateStats(this.state.notifications);
      }
    } catch (error) {
      console.warn('⚠️ Erreur chargement notifications persistées:', error);
    }
  }

  private async persistNotifications(): Promise<void> {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.state.notifications));
    } catch (error) {
      console.warn('⚠️ Erreur persistance notifications:', error);
    }
  }

  private async requestNotificationPermission(): Promise<void> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.state.permission = permission;
    }
  }

  private isQuietHours(): boolean {
    if (!this.state.settings.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const { start, end } = this.state.settings.quietHours;
    
    return currentTime >= start || currentTime <= end;
  }

  private shouldShowDesktopNotification(notification: EbiosNotification): boolean {
    return this.config.enableDesktopNotifications &&
           this.state.permission === 'granted' &&
           this.state.settings.categories[notification.category].desktop &&
           !this.isQuietHours();
  }

  private shouldPlaySound(notification: EbiosNotification): boolean {
    return this.config.enableSounds &&
           this.state.settings.categories[notification.category].sound &&
           !this.isQuietHours();
  }

  private showDesktopNotification(notification: EbiosNotification): void {
    if ('Notification' in window && this.state.permission === 'granted') {
      const desktopNotif = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
        requireInteraction: notification.priority === 'urgent'
      });

      desktopNotif.onclick = () => {
        window.focus();
        if (notification.deepLink) {
          window.location.href = notification.deepLink;
        }
        desktopNotif.close();
      };
    }
  }

  private playNotificationSound(type: NotificationType): void {
    try {
      const audio = new Audio(this.config.soundUrls[type]);
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.warn('⚠️ Impossible de jouer le son de notification:', error);
      });
    } catch (error) {
      console.warn('⚠️ Erreur lecture son notification:', error);
    }
  }

  private cleanupExpiredNotifications(): void {
    const now = new Date();
    const before = this.state.notifications.length;
    
    this.state.notifications = this.state.notifications.filter(n => 
      !n.expiresAt || new Date(n.expiresAt) > now
    );
    
    const after = this.state.notifications.length;
    if (before !== after) {
      console.log(`🧹 ${before - after} notifications expirées supprimées`);
      this.state.stats = this.calculateStats(this.state.notifications);
    }
  }

  private startPeriodicCleanup(): void {
    // Nettoyage toutes les heures
    setInterval(() => {
      this.cleanupExpiredNotifications();
    }, 60 * 60 * 1000);
  }
}

export default NotificationService;

// 🎯 INSTANCE GLOBALE
export const notificationService = NotificationService.getInstance();
