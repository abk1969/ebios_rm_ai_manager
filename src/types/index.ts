/**
 * 📋 INDEX CENTRAL DES TYPES EBIOS RM
 * Point d'entrée unique pour tous les types du système de notifications
 */

// 🔔 TYPES PRINCIPAUX DE NOTIFICATIONS
export type {
  // Types de base
  NotificationType,
  NotificationCategory,
  NotificationPriority,
  NotificationStatus,
  
  // Interfaces principales
  EbiosNotification,
  NotificationAction,
  NotificationContext,
  NotificationSettings,
  NotificationFilters,
  NotificationStats,
  NotificationEvent,
  NotificationTemplate,
  NotificationRule,
  
  // Configuration et état
  NotificationServiceConfig,
  NotificationServiceState,
  
  // Alias pour compatibilité (DEPRECATED - Utiliser EbiosNotification)
  Notification
} from './notifications';

// 🎯 CONSTANTES ET UTILITAIRES
export {
  DEFAULT_NOTIFICATION_SETTINGS,
  NOTIFICATION_ICONS,
  PRIORITY_COLORS
} from './notifications';

// 📚 DOCUMENTATION DES TYPES

/**
 * @fileoverview Types pour le système de notifications EBIOS RM
 * 
 * @example Import recommandé
 * ```typescript
 * import { EbiosNotification, NotificationCategory } from '@/types';
 * ```
 * 
 * @example Création d'une notification
 * ```typescript
 * const notification: Omit<EbiosNotification, 'id' | 'createdAt' | 'status'> = {
 *   type: 'success',
 *   category: 'workshop',
 *   priority: 'medium',
 *   title: 'Atelier terminé',
 *   message: 'Félicitations !',
 *   actions: [],
 *   context: { workshopId: 1 },
 *   source: 'ebios_system',
 *   tags: ['workshop', 'completion']
 * };
 * ```
 * 
 * @deprecated L'alias `Notification` est déprécié. Utilisez `EbiosNotification` à la place.
 * 
 * @version 1.0.0
 * @author Équipe EBIOS RM
 */

// 🎯 TYPES UTILITAIRES POUR LE DÉVELOPPEMENT

/**
 * Type helper pour créer une notification sans les champs auto-générés
 */
export type CreateNotificationInput = Omit<EbiosNotification, 'id' | 'createdAt' | 'status'>;

/**
 * Type helper pour les mises à jour de notification
 */
export type UpdateNotificationInput = Partial<Pick<EbiosNotification, 'status' | 'readAt' | 'expiresAt'>>;

/**
 * Type helper pour les callbacks de notification
 */
export type NotificationCallback = (notification: EbiosNotification) => void | Promise<void>;

/**
 * Type helper pour les handlers d'événements
 */
export type NotificationEventHandler = (event: NotificationEvent) => void | Promise<void>;

/**
 * Type helper pour les filtres de recherche
 */
export type NotificationSearchFilters = Pick<NotificationFilters, 'search' | 'tags' | 'categories'>;

/**
 * Type helper pour les statistiques simplifiées
 */
export type NotificationSummaryStats = Pick<NotificationStats, 'total' | 'unread'>;

// 🔧 TYPES DE VALIDATION

/**
 * Type guard pour vérifier si un objet est une notification valide
 */
export const isEbiosNotification = (obj: any): obj is EbiosNotification => {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.message === 'string' &&
    typeof obj.type === 'string' &&
    typeof obj.category === 'string' &&
    typeof obj.priority === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.createdAt === 'string' &&
    Array.isArray(obj.actions) &&
    typeof obj.context === 'object' &&
    typeof obj.source === 'string' &&
    Array.isArray(obj.tags);
};

/**
 * Type guard pour vérifier si un objet est un événement de notification valide
 */
export const isNotificationEvent = (obj: any): obj is NotificationEvent => {
  return obj &&
    typeof obj.type === 'string' &&
    typeof obj.notificationId === 'string' &&
    typeof obj.timestamp === 'string';
};

/**
 * Type guard pour vérifier si un objet est un contexte de notification valide
 */
export const isNotificationContext = (obj: any): obj is NotificationContext => {
  return obj && typeof obj === 'object';
};

// 🎨 TYPES POUR LES COMPOSANTS UI

/**
 * Props communes pour les composants de notification
 */
export interface BaseNotificationProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'detailed';
}

/**
 * Props pour les composants avec callbacks
 */
export interface NotificationCallbackProps {
  onNotificationClick?: NotificationCallback;
  onActionExecuted?: (actionId: string, result: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Props pour les composants de liste
 */
export interface NotificationListProps extends BaseNotificationProps, NotificationCallbackProps {
  notifications: EbiosNotification[];
  filters?: NotificationFilters;
  maxItems?: number;
  showPagination?: boolean;
}

// 🔄 TYPES POUR LES SERVICES

/**
 * Interface pour les services de notification
 */
export interface NotificationServiceInterface {
  createNotification(notification: CreateNotificationInput): Promise<string>;
  getNotifications(filters?: NotificationFilters): EbiosNotification[];
  markAsRead(notificationId: string): Promise<void>;
  deleteNotification(notificationId: string): Promise<void>;
  subscribe(id: string, callback: NotificationCallback): void;
  unsubscribe(id: string): void;
}

/**
 * Interface pour les générateurs de notification
 */
export interface NotificationGeneratorInterface {
  generateNotification(template: NotificationTemplate, data: Record<string, any>): CreateNotificationInput;
  processEvent(event: any, context: any): Promise<string[]>;
}

/**
 * Interface pour les analytics de notification
 */
export interface NotificationAnalyticsInterface {
  trackEvent(event: NotificationEvent): void;
  calculateMetrics(): NotificationStats;
  getRecommendations(): string[];
}

// 🎯 EXPORT PAR DÉFAUT
export default {
  // Types principaux
  isEbiosNotification,
  isNotificationEvent,
  isNotificationContext,
  
  // Constantes
  DEFAULT_NOTIFICATION_SETTINGS,
  NOTIFICATION_ICONS,
  PRIORITY_COLORS
};
