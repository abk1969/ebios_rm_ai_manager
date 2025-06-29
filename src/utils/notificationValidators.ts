/**
 * 🔍 VALIDATEURS ET TYPE GUARDS POUR NOTIFICATIONS
 * Validation runtime robuste avec type safety
 * 
 * @fileoverview Système de validation complet pour toutes les données
 * du système de notifications avec type guards TypeScript, validation
 * de schémas et sanitisation des données.
 * 
 * @version 1.0.0
 * @author Équipe EBIOS RM
 */

import type {
  EbiosNotification,
  NotificationAction,
  NotificationContext,
  NotificationEvent,
  NotificationSettings,
  NotificationFilters,
  NotificationType,
  NotificationCategory,
  NotificationPriority,
  NotificationStatus,
  CreateNotificationInput
} from '../types';

// 🎯 TYPES POUR LA VALIDATION
interface ValidationResult<T = any> {
  isValid: boolean;
  data?: T;
  errors: ValidationError[];
  warnings: string[];
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error' | 'warning';
}

interface ValidationSchema<T = any> {
  name: string;
  validator: (data: any) => ValidationResult<T>;
  sanitizer?: (data: any) => any;
}

/**
 * 🔍 CLASSE PRINCIPALE DE VALIDATION
 */
export class NotificationValidators {
  private static instance: NotificationValidators | null = null;
  private schemas = new Map<string, ValidationSchema>();

  private constructor() {
    this.initializeSchemas();
  }

  // 🏭 SINGLETON PATTERN
  public static getInstance(): NotificationValidators {
    if (!NotificationValidators.instance) {
      NotificationValidators.instance = new NotificationValidators();
    }
    return NotificationValidators.instance;
  }

  // 🚀 INITIALISATION DES SCHÉMAS
  private initializeSchemas(): void {
    // Schéma pour EbiosNotification
    this.schemas.set('EbiosNotification', {
      name: 'EbiosNotification',
      validator: (data: any) => this.validateEbiosNotification(data),
      sanitizer: (data: any) => this.sanitizeEbiosNotification(data)
    });

    // Schéma pour CreateNotificationInput
    this.schemas.set('CreateNotificationInput', {
      name: 'CreateNotificationInput',
      validator: (data: any) => this.validateCreateNotificationInput(data),
      sanitizer: (data: any) => this.sanitizeCreateNotificationInput(data)
    });

    // Schéma pour NotificationAction
    this.schemas.set('NotificationAction', {
      name: 'NotificationAction',
      validator: (data: any) => this.validateNotificationAction(data),
      sanitizer: (data: any) => this.sanitizeNotificationAction(data)
    });

    // Schéma pour NotificationContext
    this.schemas.set('NotificationContext', {
      name: 'NotificationContext',
      validator: (data: any) => this.validateNotificationContext(data),
      sanitizer: (data: any) => this.sanitizeNotificationContext(data)
    });

    // Schéma pour NotificationEvent
    this.schemas.set('NotificationEvent', {
      name: 'NotificationEvent',
      validator: (data: any) => this.validateNotificationEvent(data),
      sanitizer: (data: any) => this.sanitizeNotificationEvent(data)
    });

    console.log(`🔍 ${this.schemas.size} schémas de validation initialisés`);
  }

  // 🔍 TYPE GUARDS PRINCIPAUX

  /**
   * Type guard pour EbiosNotification
   */
  public static isEbiosNotification(obj: any): obj is EbiosNotification {
    if (!obj || typeof obj !== 'object') return false;

    const required = [
      'id', 'type', 'category', 'priority', 'status',
      'title', 'message', 'actions', 'context',
      'createdAt', 'source', 'tags'
    ];

    return required.every(field => obj.hasOwnProperty(field)) &&
           typeof obj.id === 'string' &&
           typeof obj.title === 'string' &&
           typeof obj.message === 'string' &&
           NotificationValidators.isValidNotificationType(obj.type) &&
           NotificationValidators.isValidNotificationCategory(obj.category) &&
           NotificationValidators.isValidNotificationPriority(obj.priority) &&
           NotificationValidators.isValidNotificationStatus(obj.status) &&
           Array.isArray(obj.actions) &&
           typeof obj.context === 'object' &&
           typeof obj.createdAt === 'string' &&
           typeof obj.source === 'string' &&
           Array.isArray(obj.tags);
  }

  /**
   * Type guard pour NotificationAction
   */
  public static isNotificationAction(obj: any): obj is NotificationAction {
    if (!obj || typeof obj !== 'object') return false;

    return typeof obj.id === 'string' &&
           typeof obj.label === 'string' &&
           ['primary', 'secondary', 'danger'].includes(obj.type) &&
           (obj.icon === undefined || typeof obj.icon === 'string') &&
           (obj.url === undefined || typeof obj.url === 'string') &&
           (obj.onClick === undefined || typeof obj.onClick === 'function') &&
           (obj.external === undefined || typeof obj.external === 'boolean');
  }

  /**
   * Type guard pour NotificationContext
   */
  public static isNotificationContext(obj: any): obj is NotificationContext {
    if (!obj || typeof obj !== 'object') return false;

    return (obj.missionId === undefined || typeof obj.missionId === 'string') &&
           (obj.workshopId === undefined || typeof obj.workshopId === 'number') &&
           (obj.stepId === undefined || typeof obj.stepId === 'string') &&
           (obj.reportId === undefined || typeof obj.reportId === 'string') &&
           (obj.moduleId === undefined || typeof obj.moduleId === 'string') &&
           (obj.userId === undefined || typeof obj.userId === 'string') &&
           (obj.sessionId === undefined || typeof obj.sessionId === 'string') &&
           (obj.errorCode === undefined || typeof obj.errorCode === 'string') &&
           (obj.metadata === undefined || typeof obj.metadata === 'object');
  }

  /**
   * Type guard pour NotificationEvent
   */
  public static isNotificationEvent(obj: any): obj is NotificationEvent {
    if (!obj || typeof obj !== 'object') return false;

    return typeof obj.type === 'string' &&
           typeof obj.notificationId === 'string' &&
           typeof obj.timestamp === 'string' &&
           (obj.actionId === undefined || typeof obj.actionId === 'string') &&
           (obj.metadata === undefined || typeof obj.metadata === 'object');
  }

  // 🔍 VALIDATEURS DE TYPES PRIMITIFS

  public static isValidNotificationType(type: any): type is NotificationType {
    return ['info', 'success', 'warning', 'error', 'action', 'achievement', 'reminder', 'update'].includes(type);
  }

  public static isValidNotificationCategory(category: any): category is NotificationCategory {
    return ['formation', 'workshop', 'validation', 'report', 'sync', 'collaboration', 'system', 'security'].includes(category);
  }

  public static isValidNotificationPriority(priority: any): priority is NotificationPriority {
    return ['low', 'medium', 'high', 'urgent'].includes(priority);
  }

  public static isValidNotificationStatus(status: any): status is NotificationStatus {
    return ['unread', 'read', 'archived', 'dismissed'].includes(status);
  }

  // 🔍 VALIDATEURS COMPLEXES

  /**
   * Valider une EbiosNotification complète
   */
  private validateEbiosNotification(data: any): ValidationResult<EbiosNotification> {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Validation des champs requis
    if (!data.id || typeof data.id !== 'string') {
      errors.push({
        field: 'id',
        message: 'ID requis et doit être une chaîne',
        code: 'REQUIRED_STRING',
        severity: 'error'
      });
    }

    if (!data.title || typeof data.title !== 'string') {
      errors.push({
        field: 'title',
        message: 'Titre requis et doit être une chaîne',
        code: 'REQUIRED_STRING',
        severity: 'error'
      });
    } else if (data.title.length > 100) {
      warnings.push('Le titre est très long (>100 caractères)');
    }

    if (!data.message || typeof data.message !== 'string') {
      errors.push({
        field: 'message',
        message: 'Message requis et doit être une chaîne',
        code: 'REQUIRED_STRING',
        severity: 'error'
      });
    } else if (data.message.length > 500) {
      warnings.push('Le message est très long (>500 caractères)');
    }

    // Validation des énumérations
    if (!NotificationValidators.isValidNotificationType(data.type)) {
      errors.push({
        field: 'type',
        message: 'Type de notification invalide',
        code: 'INVALID_ENUM',
        severity: 'error'
      });
    }

    if (!NotificationValidators.isValidNotificationCategory(data.category)) {
      errors.push({
        field: 'category',
        message: 'Catégorie de notification invalide',
        code: 'INVALID_ENUM',
        severity: 'error'
      });
    }

    if (!NotificationValidators.isValidNotificationPriority(data.priority)) {
      errors.push({
        field: 'priority',
        message: 'Priorité de notification invalide',
        code: 'INVALID_ENUM',
        severity: 'error'
      });
    }

    if (!NotificationValidators.isValidNotificationStatus(data.status)) {
      errors.push({
        field: 'status',
        message: 'Statut de notification invalide',
        code: 'INVALID_ENUM',
        severity: 'error'
      });
    }

    // Validation des tableaux
    if (!Array.isArray(data.actions)) {
      errors.push({
        field: 'actions',
        message: 'Actions doit être un tableau',
        code: 'INVALID_ARRAY',
        severity: 'error'
      });
    } else {
      data.actions.forEach((action: any, index: number) => {
        if (!NotificationValidators.isNotificationAction(action)) {
          errors.push({
            field: `actions[${index}]`,
            message: 'Action invalide',
            code: 'INVALID_ACTION',
            severity: 'error'
          });
        }
      });
    }

    if (!Array.isArray(data.tags)) {
      errors.push({
        field: 'tags',
        message: 'Tags doit être un tableau',
        code: 'INVALID_ARRAY',
        severity: 'error'
      });
    } else if (data.tags.some((tag: any) => typeof tag !== 'string')) {
      errors.push({
        field: 'tags',
        message: 'Tous les tags doivent être des chaînes',
        code: 'INVALID_TAG_TYPE',
        severity: 'error'
      });
    }

    // Validation du contexte
    if (!NotificationValidators.isNotificationContext(data.context)) {
      errors.push({
        field: 'context',
        message: 'Contexte invalide',
        code: 'INVALID_CONTEXT',
        severity: 'error'
      });
    }

    // Validation des dates
    if (data.createdAt && !this.isValidISODate(data.createdAt)) {
      errors.push({
        field: 'createdAt',
        message: 'Date de création invalide (format ISO requis)',
        code: 'INVALID_DATE',
        severity: 'error'
      });
    }

    if (data.readAt && !this.isValidISODate(data.readAt)) {
      errors.push({
        field: 'readAt',
        message: 'Date de lecture invalide (format ISO requis)',
        code: 'INVALID_DATE',
        severity: 'error'
      });
    }

    if (data.expiresAt && !this.isValidISODate(data.expiresAt)) {
      errors.push({
        field: 'expiresAt',
        message: 'Date d\'expiration invalide (format ISO requis)',
        code: 'INVALID_DATE',
        severity: 'error'
      });
    }

    return {
      isValid: errors.length === 0,
      data: errors.length === 0 ? data as EbiosNotification : undefined,
      errors,
      warnings
    };
  }

  /**
   * Valider CreateNotificationInput
   */
  private validateCreateNotificationInput(data: any): ValidationResult<CreateNotificationInput> {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Validation similaire à EbiosNotification mais sans id, createdAt, status
    if (!data.title || typeof data.title !== 'string') {
      errors.push({
        field: 'title',
        message: 'Titre requis et doit être une chaîne',
        code: 'REQUIRED_STRING',
        severity: 'error'
      });
    }

    if (!data.message || typeof data.message !== 'string') {
      errors.push({
        field: 'message',
        message: 'Message requis et doit être une chaîne',
        code: 'REQUIRED_STRING',
        severity: 'error'
      });
    }

    if (!NotificationValidators.isValidNotificationType(data.type)) {
      errors.push({
        field: 'type',
        message: 'Type de notification invalide',
        code: 'INVALID_ENUM',
        severity: 'error'
      });
    }

    if (!NotificationValidators.isValidNotificationCategory(data.category)) {
      errors.push({
        field: 'category',
        message: 'Catégorie de notification invalide',
        code: 'INVALID_ENUM',
        severity: 'error'
      });
    }

    if (!NotificationValidators.isValidNotificationPriority(data.priority)) {
      errors.push({
        field: 'priority',
        message: 'Priorité de notification invalide',
        code: 'INVALID_ENUM',
        severity: 'error'
      });
    }

    return {
      isValid: errors.length === 0,
      data: errors.length === 0 ? data as CreateNotificationInput : undefined,
      errors,
      warnings
    };
  }

  /**
   * Valider NotificationAction
   */
  private validateNotificationAction(data: any): ValidationResult<NotificationAction> {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    if (!data.id || typeof data.id !== 'string') {
      errors.push({
        field: 'id',
        message: 'ID d\'action requis',
        code: 'REQUIRED_STRING',
        severity: 'error'
      });
    }

    if (!data.label || typeof data.label !== 'string') {
      errors.push({
        field: 'label',
        message: 'Label d\'action requis',
        code: 'REQUIRED_STRING',
        severity: 'error'
      });
    }

    if (!['primary', 'secondary', 'danger'].includes(data.type)) {
      errors.push({
        field: 'type',
        message: 'Type d\'action invalide',
        code: 'INVALID_ENUM',
        severity: 'error'
      });
    }

    // Validation conditionnelle URL ou onClick
    if (!data.url && !data.onClick) {
      warnings.push('Action sans URL ni callback - peut être inutilisable');
    }

    if (data.url && data.onClick) {
      warnings.push('Action avec URL et callback - le callback sera ignoré');
    }

    return {
      isValid: errors.length === 0,
      data: errors.length === 0 ? data as NotificationAction : undefined,
      errors,
      warnings
    };
  }

  /**
   * Valider NotificationContext
   */
  private validateNotificationContext(data: any): ValidationResult<NotificationContext> {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    // Validation des IDs optionnels
    if (data.missionId !== undefined && typeof data.missionId !== 'string') {
      errors.push({
        field: 'missionId',
        message: 'missionId doit être une chaîne',
        code: 'INVALID_TYPE',
        severity: 'error'
      });
    }

    if (data.workshopId !== undefined && typeof data.workshopId !== 'number') {
      errors.push({
        field: 'workshopId',
        message: 'workshopId doit être un nombre',
        code: 'INVALID_TYPE',
        severity: 'error'
      });
    } else if (data.workshopId !== undefined && (data.workshopId < 1 || data.workshopId > 5)) {
      warnings.push('workshopId hors de la plage EBIOS RM (1-5)');
    }

    return {
      isValid: errors.length === 0,
      data: errors.length === 0 ? data as NotificationContext : undefined,
      errors,
      warnings
    };
  }

  /**
   * Valider NotificationEvent
   */
  private validateNotificationEvent(data: any): ValidationResult<NotificationEvent> {
    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    if (!data.type || typeof data.type !== 'string') {
      errors.push({
        field: 'type',
        message: 'Type d\'événement requis',
        code: 'REQUIRED_STRING',
        severity: 'error'
      });
    }

    if (!data.notificationId || typeof data.notificationId !== 'string') {
      errors.push({
        field: 'notificationId',
        message: 'ID de notification requis',
        code: 'REQUIRED_STRING',
        severity: 'error'
      });
    }

    if (!data.timestamp || !this.isValidISODate(data.timestamp)) {
      errors.push({
        field: 'timestamp',
        message: 'Timestamp invalide (format ISO requis)',
        code: 'INVALID_DATE',
        severity: 'error'
      });
    }

    return {
      isValid: errors.length === 0,
      data: errors.length === 0 ? data as NotificationEvent : undefined,
      errors,
      warnings
    };
  }

  // 🧹 SANITIZERS

  private sanitizeEbiosNotification(data: any): any {
    return {
      ...data,
      title: typeof data.title === 'string' ? data.title.trim().substring(0, 100) : '',
      message: typeof data.message === 'string' ? data.message.trim().substring(0, 500) : '',
      tags: Array.isArray(data.tags) ? data.tags.filter(tag => typeof tag === 'string') : [],
      actions: Array.isArray(data.actions) ? data.actions.filter(action => 
        NotificationValidators.isNotificationAction(action)
      ) : []
    };
  }

  private sanitizeCreateNotificationInput(data: any): any {
    return this.sanitizeEbiosNotification(data);
  }

  private sanitizeNotificationAction(data: any): any {
    return {
      ...data,
      id: typeof data.id === 'string' ? data.id.trim() : '',
      label: typeof data.label === 'string' ? data.label.trim().substring(0, 50) : '',
      icon: typeof data.icon === 'string' ? data.icon.trim().substring(0, 10) : undefined,
      url: typeof data.url === 'string' ? data.url.trim() : undefined
    };
  }

  private sanitizeNotificationContext(data: any): any {
    return {
      ...data,
      missionId: typeof data.missionId === 'string' ? data.missionId.trim() : undefined,
      stepId: typeof data.stepId === 'string' ? data.stepId.trim() : undefined,
      reportId: typeof data.reportId === 'string' ? data.reportId.trim() : undefined,
      moduleId: typeof data.moduleId === 'string' ? data.moduleId.trim() : undefined,
      userId: typeof data.userId === 'string' ? data.userId.trim() : undefined,
      sessionId: typeof data.sessionId === 'string' ? data.sessionId.trim() : undefined,
      errorCode: typeof data.errorCode === 'string' ? data.errorCode.trim() : undefined
    };
  }

  private sanitizeNotificationEvent(data: any): any {
    return {
      ...data,
      type: typeof data.type === 'string' ? data.type.trim() : '',
      notificationId: typeof data.notificationId === 'string' ? data.notificationId.trim() : '',
      actionId: typeof data.actionId === 'string' ? data.actionId.trim() : undefined
    };
  }

  // 🔧 UTILITAIRES

  private isValidISODate(dateString: string): boolean {
    try {
      const date = new Date(dateString);
      return date.toISOString() === dateString;
    } catch {
      return false;
    }
  }

  // 📊 API PUBLIQUE

  /**
   * Valider et sanitiser des données selon un schéma
   */
  public validateAndSanitize<T>(schemaName: string, data: any): ValidationResult<T> {
    const schema = this.schemas.get(schemaName);
    if (!schema) {
      return {
        isValid: false,
        errors: [{
          field: 'schema',
          message: `Schéma ${schemaName} non trouvé`,
          code: 'SCHEMA_NOT_FOUND',
          severity: 'error'
        }],
        warnings: []
      };
    }

    // Sanitiser d'abord
    const sanitizedData = schema.sanitizer ? schema.sanitizer(data) : data;
    
    // Puis valider
    return schema.validator(sanitizedData);
  }

  /**
   * Validation rapide avec type guard
   */
  public quickValidate<T>(data: any, typeGuard: (obj: any) => obj is T): boolean {
    return typeGuard(data);
  }

  /**
   * Obtenir la liste des schémas disponibles
   */
  public getAvailableSchemas(): string[] {
    return Array.from(this.schemas.keys());
  }
}

// 🎯 INSTANCE GLOBALE
export const notificationValidators = NotificationValidators.getInstance();

// 🎯 EXPORTS POUR UTILISATION DIRECTE
export const {
  isEbiosNotification,
  isNotificationAction,
  isNotificationContext,
  isNotificationEvent,
  isValidNotificationType,
  isValidNotificationCategory,
  isValidNotificationPriority,
  isValidNotificationStatus
} = NotificationValidators;

export default NotificationValidators;
