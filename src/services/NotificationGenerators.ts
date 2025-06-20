/**
 * 🤖 GÉNÉRATEURS AUTOMATIQUES DE NOTIFICATIONS
 * Système intelligent pour générer des notifications basées sur les événements
 */

import { notificationService } from './NotificationService';
import { ebiosNotificationGenerator } from './EbiosNotificationGenerator';
import { ALL_NOTIFICATION_RULES, NotificationRuleUtils, TriggerEvent } from './NotificationRules';
import type { NotificationRule, EbiosNotification } from '../types/notifications';

// 🎯 INTERFACE POUR LE CONTEXTE DE GÉNÉRATION
interface GenerationContext {
  userId: string;
  sessionId?: string;
  userPreferences?: Record<string, any>;
  userLevel?: string;
  lastNotifications?: EbiosNotification[];
  cooldownTracker?: Map<string, number>;
}

// 🎯 STATISTIQUES DE GÉNÉRATION
interface GenerationStats {
  totalEvents: number;
  rulesTriggered: number;
  notificationsGenerated: number;
  notificationsSkipped: number;
  averageProcessingTime: number;
  errorCount: number;
  lastProcessedEvent: string;
}

/**
 * 🤖 GÉNÉRATEUR AUTOMATIQUE PRINCIPAL
 */
export class NotificationGenerators {
  private static instance: NotificationGenerators | null = null;
  private cooldownTracker = new Map<string, number>();
  private dailyCountTracker = new Map<string, number>();
  private stats: GenerationStats = {
    totalEvents: 0,
    rulesTriggered: 0,
    notificationsGenerated: 0,
    notificationsSkipped: 0,
    averageProcessingTime: 0,
    errorCount: 0,
    lastProcessedEvent: ''
  };

  public static getInstance(): NotificationGenerators {
    if (!NotificationGenerators.instance) {
      NotificationGenerators.instance = new NotificationGenerators();
    }
    return NotificationGenerators.instance;
  }

  // 🚀 TRAITEMENT AUTOMATIQUE D'UN ÉVÉNEMENT
  public async processEvent(event: TriggerEvent, context: GenerationContext): Promise<string[]> {
    const startTime = Date.now();
    const generatedNotificationIds: string[] = [];

    try {
      this.stats.totalEvents++;
      this.stats.lastProcessedEvent = event.type;

      console.log(`🤖 Traitement événement automatique: ${event.type}`, event);

      // Nettoyer les trackers quotidiens si nécessaire
      this.cleanupDailyTrackers();

      // Trouver les règles applicables
      const applicableRules = NotificationRuleUtils.getApplicableRules(event, ALL_NOTIFICATION_RULES);
      
      console.log(`📋 ${applicableRules.length} règle(s) applicable(s) trouvée(s)`);

      // Traiter chaque règle applicable
      for (const rule of applicableRules) {
        try {
          const notificationId = await this.processRule(rule, event, context);
          if (notificationId) {
            generatedNotificationIds.push(notificationId);
            this.stats.notificationsGenerated++;
          } else {
            this.stats.notificationsSkipped++;
          }
          this.stats.rulesTriggered++;
        } catch (error) {
          console.error(`❌ Erreur traitement règle ${rule.id}:`, error);
          this.stats.errorCount++;
        }
      }

      // Mettre à jour les statistiques
      const processingTime = Date.now() - startTime;
      this.updateAverageProcessingTime(processingTime);

      console.log(`✅ Événement traité: ${generatedNotificationIds.length} notification(s) générée(s)`);

    } catch (error) {
      console.error('❌ Erreur traitement événement:', error);
      this.stats.errorCount++;
    }

    return generatedNotificationIds;
  }

  // 📋 TRAITEMENT D'UNE RÈGLE SPÉCIFIQUE
  private async processRule(
    rule: NotificationRule, 
    event: TriggerEvent, 
    context: GenerationContext
  ): Promise<string | null> {
    
    // Vérifier le cooldown
    if (!this.checkCooldown(rule, context.userId)) {
      console.log(`⏰ Cooldown actif pour règle ${rule.id}`);
      return null;
    }

    // Vérifier la limite quotidienne
    if (!this.checkDailyLimit(rule, context.userId)) {
      console.log(`📊 Limite quotidienne atteinte pour règle ${rule.id}`);
      return null;
    }

    // Vérifier le ciblage utilisateur
    if (!this.checkUserTargeting(rule, context.userId)) {
      console.log(`🎯 Utilisateur non ciblé pour règle ${rule.id}`);
      return null;
    }

    // Générer la notification
    const notificationId = await this.generateNotificationFromRule(rule, event, context);

    if (notificationId) {
      // Mettre à jour les trackers
      this.updateCooldownTracker(rule, context.userId);
      this.updateDailyCountTracker(rule, context.userId);
    }

    return notificationId;
  }

  // 🔔 GÉNÉRATION DE NOTIFICATION À PARTIR D'UNE RÈGLE
  private async generateNotificationFromRule(
    rule: NotificationRule,
    event: TriggerEvent,
    context: GenerationContext
  ): Promise<string | null> {
    
    try {
      const template = rule.template;
      
      // Calculer la priorité dynamique
      const priority = NotificationRuleUtils.calculatePriority(rule, event);
      
      // Traiter les templates avec les données de l'événement
      const title = this.processTemplate(template.titleTemplate, event.data);
      const message = this.processTemplate(template.messageTemplate, event.data);
      const description = template.descriptionTemplate 
        ? this.processTemplate(template.descriptionTemplate, event.data)
        : undefined;

      // Générer les actions contextuelles
      const actions = this.generateContextualActions(rule, event, context);

      // Créer la notification
      const notificationId = await notificationService.createNotification({
        type: template.type,
        category: template.category,
        priority,
        title,
        message,
        description,
        icon: template.icon,
        actions,
        context: {
          missionId: event.missionId,
          workshopId: event.workshopId,
          userId: event.userId,
          sessionId: event.sessionId,
          metadata: {
            ruleId: rule.id,
            eventType: event.type,
            generatedAt: new Date().toISOString()
          }
        },
        deepLink: this.generateDeepLink(rule, event),
        source: `auto_generator_${rule.id}`,
        tags: [...template.tags, 'auto_generated', `rule_${rule.id}`],
        persistent: priority === 'urgent',
        sound: priority === 'urgent' || priority === 'high'
      });

      console.log(`🔔 Notification générée automatiquement: ${title} (ID: ${notificationId})`);
      return notificationId;

    } catch (error) {
      console.error(`❌ Erreur génération notification pour règle ${rule.id}:`, error);
      return null;
    }
  }

  // 🎯 GÉNÉRATION D'ACTIONS CONTEXTUELLES
  private generateContextualActions(
    rule: NotificationRule,
    event: TriggerEvent,
    context: GenerationContext
  ) {
    const baseActions = [...rule.template.actions];
    
    // Personnaliser les URLs avec les données de l'événement
    return baseActions.map(action => ({
      ...action,
      url: action.url ? this.processTemplate(action.url, event.data) : undefined
    }));
  }

  // 🔗 GÉNÉRATION DE LIENS PROFONDS
  private generateDeepLink(rule: NotificationRule, event: TriggerEvent): string | undefined {
    const { missionId, workshopId } = event;
    
    switch (rule.id) {
      case 'workshop_completion_celebration':
        return workshopId && missionId 
          ? `/missions/${missionId}/workshops/${workshopId}/results`
          : undefined;
      
      case 'validation_error_immediate':
        return workshopId && missionId && event.data.stepId
          ? `/missions/${missionId}/workshops/${workshopId}?step=${event.data.stepId}`
          : undefined;
      
      case 'mission_validation_required':
        return missionId ? `/missions/${missionId}/validate` : undefined;
      
      case 'report_generation_success':
        return event.data.reportId ? `/reports/${event.data.reportId}` : undefined;
      
      case 'new_comment_notification':
        return missionId && event.data.commentId
          ? `/missions/${missionId}/comments#comment-${event.data.commentId}`
          : undefined;
      
      default:
        return undefined;
    }
  }

  // ⏰ VÉRIFICATION DU COOLDOWN
  private checkCooldown(rule: NotificationRule, userId: string): boolean {
    if (!rule.cooldown || rule.cooldown === 0) return true;
    
    const key = `${rule.id}_${userId}`;
    const lastNotification = this.cooldownTracker.get(key);
    
    if (!lastNotification) return true;
    
    const now = Date.now();
    return (now - lastNotification) >= rule.cooldown;
  }

  // 📊 VÉRIFICATION DE LA LIMITE QUOTIDIENNE
  private checkDailyLimit(rule: NotificationRule, userId: string): boolean {
    if (!rule.maxPerDay) return true;
    
    const key = `${rule.id}_${userId}_${this.getTodayKey()}`;
    const count = this.dailyCountTracker.get(key) || 0;
    
    return count < rule.maxPerDay;
  }

  // 🎯 VÉRIFICATION DU CIBLAGE UTILISATEUR
  private checkUserTargeting(rule: NotificationRule, userId: string): boolean {
    if (!rule.targetUsers || rule.targetUsers.length === 0) return true;
    
    return rule.targetUsers.includes(userId);
  }

  // 🔄 MISE À JOUR DES TRACKERS
  private updateCooldownTracker(rule: NotificationRule, userId: string): void {
    if (rule.cooldown && rule.cooldown > 0) {
      const key = `${rule.id}_${userId}`;
      this.cooldownTracker.set(key, Date.now());
    }
  }

  private updateDailyCountTracker(rule: NotificationRule, userId: string): void {
    if (rule.maxPerDay) {
      const key = `${rule.id}_${userId}_${this.getTodayKey()}`;
      const currentCount = this.dailyCountTracker.get(key) || 0;
      this.dailyCountTracker.set(key, currentCount + 1);
    }
  }

  // 🧹 NETTOYAGE DES TRACKERS
  private cleanupDailyTrackers(): void {
    const today = this.getTodayKey();
    const keysToDelete: string[] = [];
    
    this.dailyCountTracker.forEach((_, key) => {
      if (!key.endsWith(today)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.dailyCountTracker.delete(key));
  }

  // 🔧 UTILITAIRES
  private getTodayKey(): string {
    return new Date().toISOString().split('T')[0];
  }

  private processTemplate(template: string, data: Record<string, any>): string {
    let result = template;
    
    // Remplacements simples
    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(value));
    });
    
    return result;
  }

  private updateAverageProcessingTime(newTime: number): void {
    const currentAvg = this.stats.averageProcessingTime;
    const totalEvents = this.stats.totalEvents;
    
    this.stats.averageProcessingTime = 
      (currentAvg * (totalEvents - 1) + newTime) / totalEvents;
  }

  // 📊 API PUBLIQUE POUR LES STATISTIQUES
  public getStats(): GenerationStats {
    return { ...this.stats };
  }

  public resetStats(): void {
    this.stats = {
      totalEvents: 0,
      rulesTriggered: 0,
      notificationsGenerated: 0,
      notificationsSkipped: 0,
      averageProcessingTime: 0,
      errorCount: 0,
      lastProcessedEvent: ''
    };
  }

  // 🎯 MÉTHODES DE TEST ET DEBUG
  public async testRule(ruleId: string, mockEvent: TriggerEvent, mockContext: GenerationContext): Promise<string | null> {
    const rule = ALL_NOTIFICATION_RULES.find(r => r.id === ruleId);
    if (!rule) {
      throw new Error(`Règle ${ruleId} non trouvée`);
    }
    
    console.log(`🧪 Test de la règle: ${rule.name}`);
    return await this.processRule(rule, mockEvent, mockContext);
  }

  public getCooldownStatus(ruleId: string, userId: string): { 
    isActive: boolean; 
    remainingTime?: number; 
  } {
    const key = `${ruleId}_${userId}`;
    const lastNotification = this.cooldownTracker.get(key);
    
    if (!lastNotification) {
      return { isActive: false };
    }
    
    const rule = ALL_NOTIFICATION_RULES.find(r => r.id === ruleId);
    if (!rule || !rule.cooldown) {
      return { isActive: false };
    }
    
    const now = Date.now();
    const elapsed = now - lastNotification;
    const remaining = rule.cooldown - elapsed;
    
    return {
      isActive: remaining > 0,
      remainingTime: remaining > 0 ? remaining : 0
    };
  }

  public getDailyCount(ruleId: string, userId: string): number {
    const key = `${ruleId}_${userId}_${this.getTodayKey()}`;
    return this.dailyCountTracker.get(key) || 0;
  }
}

// 🎯 INSTANCE GLOBALE
export const notificationGenerators = NotificationGenerators.getInstance();

export default NotificationGenerators;
