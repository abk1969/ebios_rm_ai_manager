/**
 * 📊 ANALYTICS DES NOTIFICATIONS
 * Service d'analyse pour optimiser l'efficacité des notifications
 */

import type { EbiosNotification, NotificationEvent } from '../types/notifications';

// 🎯 MÉTRIQUES D'ANALYTICS
interface NotificationMetrics {
  // Métriques de base
  totalSent: number;
  totalRead: number;
  totalClicked: number;
  totalDismissed: number;
  totalActionsPerformed: number;

  // Taux de conversion
  readRate: number;
  clickRate: number;
  actionRate: number;
  dismissalRate: number;

  // Métriques temporelles
  averageTimeToRead: number;
  averageTimeToAction: number;
  peakHours: number[];
  bestDayOfWeek: string;

  // Métriques par type
  byType: Record<string, {
    sent: number;
    read: number;
    clicked: number;
    actionRate: number;
  }>;

  // Métriques par catégorie
  byCategory: Record<string, {
    sent: number;
    read: number;
    clicked: number;
    actionRate: number;
  }>;

  // Métriques par priorité
  byPriority: Record<string, {
    sent: number;
    read: number;
    clicked: number;
    actionRate: number;
  }>;
}

interface UserEngagementMetrics {
  userId: string;
  totalNotificationsReceived: number;
  readRate: number;
  actionRate: number;
  preferredTypes: string[];
  preferredCategories: string[];
  mostActiveHours: number[];
  engagementScore: number;
  lastActivity: string;
}

interface NotificationPerformance {
  notificationId: string;
  type: string;
  category: string;
  priority: string;
  sentAt: string;
  readAt?: string;
  clickedAt?: string;
  actionsPerformed: string[];
  timeToRead?: number;
  timeToAction?: number;
  userFeedback?: 'helpful' | 'not_helpful' | 'spam';
}

/**
 * 📊 SERVICE D'ANALYTICS PRINCIPAL
 */
export class NotificationAnalytics {
  private static instance: NotificationAnalytics | null = null;
  private performances = new Map<string, NotificationPerformance>();
  private userMetrics = new Map<string, UserEngagementMetrics>();
  private events: NotificationEvent[] = [];

  public static getInstance(): NotificationAnalytics {
    if (!NotificationAnalytics.instance) {
      NotificationAnalytics.instance = new NotificationAnalytics();
    }
    return NotificationAnalytics.instance;
  }

  // 📊 ENREGISTRER UN ÉVÉNEMENT
  public trackEvent(event: NotificationEvent): void {
    this.events.push(event);
    this.updatePerformanceMetrics(event);
    this.updateUserMetrics(event);
    
    // Limiter le nombre d'événements en mémoire
    if (this.events.length > 10000) {
      this.events = this.events.slice(-5000);
    }
  }

  // 📈 ENREGISTRER L'ENVOI D'UNE NOTIFICATION
  public trackNotificationSent(notification: EbiosNotification): void {
    const performance: NotificationPerformance = {
      notificationId: notification.id,
      type: notification.type,
      category: notification.category,
      priority: notification.priority,
      sentAt: notification.createdAt,
      actionsPerformed: []
    };

    this.performances.set(notification.id, performance);
    
    this.trackEvent({
      type: 'created',
      notificationId: notification.id,
      timestamp: notification.createdAt
    });
  }

  // 📖 ENREGISTRER LA LECTURE
  public trackNotificationRead(notificationId: string, userId: string): void {
    const performance = this.performances.get(notificationId);
    if (performance && !performance.readAt) {
      const now = new Date().toISOString();
      performance.readAt = now;
      performance.timeToRead = new Date(now).getTime() - new Date(performance.sentAt).getTime();
    }

    this.trackEvent({
      type: 'read',
      notificationId,
      timestamp: new Date().toISOString(),
      metadata: { userId }
    });
  }

  // 🖱️ ENREGISTRER LE CLIC
  public trackNotificationClicked(notificationId: string, userId: string): void {
    const performance = this.performances.get(notificationId);
    if (performance && !performance.clickedAt) {
      performance.clickedAt = new Date().toISOString();
    }

    this.trackEvent({
      type: 'clicked',
      notificationId,
      timestamp: new Date().toISOString(),
      metadata: { userId }
    });
  }

  // ⚡ ENREGISTRER UNE ACTION
  public trackActionPerformed(notificationId: string, actionId: string, userId: string): void {
    const performance = this.performances.get(notificationId);
    if (performance) {
      performance.actionsPerformed.push(actionId);
      
      if (!performance.timeToAction && performance.sentAt) {
        performance.timeToAction = new Date().getTime() - new Date(performance.sentAt).getTime();
      }
    }

    this.trackEvent({
      type: 'action_performed',
      notificationId,
      actionId,
      timestamp: new Date().toISOString(),
      metadata: { userId }
    });
  }

  // 📊 CALCULER LES MÉTRIQUES GLOBALES
  public calculateGlobalMetrics(): NotificationMetrics {
    const performances = Array.from(this.performances.values());
    
    const totalSent = performances.length;
    const totalRead = performances.filter(p => p.readAt).length;
    const totalClicked = performances.filter(p => p.clickedAt).length;
    const totalDismissed = this.events.filter(e => e.type === 'dismissed').length;
    const totalActionsPerformed = performances.reduce((sum, p) => sum + p.actionsPerformed.length, 0);

    const readRate = totalSent > 0 ? (totalRead / totalSent) * 100 : 0;
    const clickRate = totalSent > 0 ? (totalClicked / totalSent) * 100 : 0;
    const actionRate = totalSent > 0 ? (totalActionsPerformed / totalSent) * 100 : 0;
    const dismissalRate = totalSent > 0 ? (totalDismissed / totalSent) * 100 : 0;

    // Calculer les temps moyens
    const readTimes = performances.filter(p => p.timeToRead).map(p => p.timeToRead!);
    const actionTimes = performances.filter(p => p.timeToAction).map(p => p.timeToAction!);
    
    const averageTimeToRead = readTimes.length > 0 
      ? readTimes.reduce((sum, time) => sum + time, 0) / readTimes.length 
      : 0;
    
    const averageTimeToAction = actionTimes.length > 0
      ? actionTimes.reduce((sum, time) => sum + time, 0) / actionTimes.length
      : 0;

    // Analyser les heures de pointe
    const peakHours = this.calculatePeakHours();
    const bestDayOfWeek = this.calculateBestDayOfWeek();

    // Métriques par type
    const byType = this.calculateMetricsByField('type', performances);
    const byCategory = this.calculateMetricsByField('category', performances);
    const byPriority = this.calculateMetricsByField('priority', performances);

    return {
      totalSent,
      totalRead,
      totalClicked,
      totalDismissed,
      totalActionsPerformed,
      readRate,
      clickRate,
      actionRate,
      dismissalRate,
      averageTimeToRead,
      averageTimeToAction,
      peakHours,
      bestDayOfWeek,
      byType,
      byCategory,
      byPriority
    };
  }

  // 👤 CALCULER LES MÉTRIQUES UTILISATEUR
  public calculateUserMetrics(userId: string): UserEngagementMetrics | null {
    const userEvents = this.events.filter(e => e.metadata?.userId === userId);
    if (userEvents.length === 0) return null;

    const userPerformances = Array.from(this.performances.values()).filter(p => 
      userEvents.some(e => e.notificationId === p.notificationId)
    );

    const totalReceived = userPerformances.length;
    const totalRead = userPerformances.filter(p => p.readAt).length;
    const totalActions = userPerformances.reduce((sum, p) => sum + p.actionsPerformed.length, 0);

    const readRate = totalReceived > 0 ? (totalRead / totalReceived) * 100 : 0;
    const actionRate = totalReceived > 0 ? (totalActions / totalReceived) * 100 : 0;

    // Analyser les préférences
    const typeFrequency = this.calculateFrequency(userPerformances, 'type');
    const categoryFrequency = this.calculateFrequency(userPerformances, 'category');
    
    const preferredTypes = Object.entries(typeFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type]) => type);

    const preferredCategories = Object.entries(categoryFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);

    // Analyser les heures d'activité
    const mostActiveHours = this.calculateUserActiveHours(userId);

    // Calculer le score d'engagement
    const engagementScore = this.calculateEngagementScore(readRate, actionRate, totalReceived);

    const lastActivity = userEvents.length > 0 
      ? userEvents[userEvents.length - 1].timestamp 
      : new Date().toISOString();

    return {
      userId,
      totalNotificationsReceived: totalReceived,
      readRate,
      actionRate,
      preferredTypes,
      preferredCategories,
      mostActiveHours,
      engagementScore,
      lastActivity
    };
  }

  // 🎯 RECOMMANDATIONS D'OPTIMISATION
  public getOptimizationRecommendations(): string[] {
    const metrics = this.calculateGlobalMetrics();
    const recommendations: string[] = [];

    // Recommandations basées sur les taux
    if (metrics.readRate < 50) {
      recommendations.push('Améliorer les titres des notifications pour augmenter le taux de lecture');
    }

    if (metrics.clickRate < 20) {
      recommendations.push('Optimiser les messages pour encourager plus de clics');
    }

    if (metrics.actionRate < 15) {
      recommendations.push('Simplifier les actions disponibles dans les notifications');
    }

    if (metrics.dismissalRate > 30) {
      recommendations.push('Réduire la fréquence des notifications pour éviter la fatigue');
    }

    // Recommandations temporelles
    if (metrics.averageTimeToRead > 3600000) { // 1 heure
      recommendations.push('Envoyer les notifications aux heures de plus forte activité');
    }

    // Recommandations par type
    const worstPerformingType = Object.entries(metrics.byType)
      .sort(([,a], [,b]) => a.actionRate - b.actionRate)[0];
    
    if (worstPerformingType && worstPerformingType[1].actionRate < 10) {
      recommendations.push(`Revoir le format des notifications de type "${worstPerformingType[0]}"`);
    }

    return recommendations;
  }

  // 🔧 MÉTHODES UTILITAIRES PRIVÉES
  private updatePerformanceMetrics(event: NotificationEvent): void {
    // Mise à jour automatique des métriques de performance
    // Déjà géré dans les méthodes track spécifiques
  }

  private updateUserMetrics(event: NotificationEvent): void {
    const userId = event.metadata?.userId;
    if (!userId) return;

    let userMetrics = this.userMetrics.get(userId);
    if (!userMetrics) {
      userMetrics = {
        userId,
        totalNotificationsReceived: 0,
        readRate: 0,
        actionRate: 0,
        preferredTypes: [],
        preferredCategories: [],
        mostActiveHours: [],
        engagementScore: 0,
        lastActivity: event.timestamp
      };
      this.userMetrics.set(userId, userMetrics);
    }

    userMetrics.lastActivity = event.timestamp;
  }

  private calculatePeakHours(): number[] {
    const hourCounts = new Array(24).fill(0);
    
    this.events.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourCounts[hour]++;
    });

    return hourCounts
      .map((count, hour) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(item => item.hour);
  }

  private calculateBestDayOfWeek(): string {
    const dayNames = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const dayCounts = new Array(7).fill(0);
    
    this.events.filter(e => e.type === 'action_performed').forEach(event => {
      const day = new Date(event.timestamp).getDay();
      dayCounts[day]++;
    });

    const bestDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
    return dayNames[bestDayIndex];
  }

  private calculateMetricsByField(field: keyof NotificationPerformance, performances: NotificationPerformance[]) {
    const result: Record<string, any> = {};
    
    performances.forEach(p => {
      const value = p[field] as string;
      if (!result[value]) {
        result[value] = { sent: 0, read: 0, clicked: 0, actionRate: 0 };
      }
      
      result[value].sent++;
      if (p.readAt) result[value].read++;
      if (p.clickedAt) result[value].clicked++;
    });

    // Calculer les taux d'action
    Object.keys(result).forEach(key => {
      const actions = performances
        .filter(p => p[field] === key)
        .reduce((sum, p) => sum + p.actionsPerformed.length, 0);
      
      result[key].actionRate = result[key].sent > 0 
        ? (actions / result[key].sent) * 100 
        : 0;
    });

    return result;
  }

  private calculateFrequency(performances: NotificationPerformance[], field: keyof NotificationPerformance): Record<string, number> {
    const frequency: Record<string, number> = {};
    
    performances.forEach(p => {
      const value = p[field] as string;
      frequency[value] = (frequency[value] || 0) + 1;
    });

    return frequency;
  }

  private calculateUserActiveHours(userId: string): number[] {
    const userEvents = this.events.filter(e => e.metadata?.userId === userId);
    const hourCounts = new Array(24).fill(0);
    
    userEvents.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourCounts[hour]++;
    });

    return hourCounts
      .map((count, hour) => ({ hour, count }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(item => item.hour);
  }

  private calculateEngagementScore(readRate: number, actionRate: number, totalReceived: number): number {
    // Score d'engagement basé sur plusieurs facteurs
    const readWeight = 0.3;
    const actionWeight = 0.5;
    const volumeWeight = 0.2;
    
    const volumeScore = Math.min(totalReceived / 10, 1) * 100; // Normaliser sur 10 notifications
    
    return (readRate * readWeight) + (actionRate * actionWeight) + (volumeScore * volumeWeight);
  }

  // 📊 API PUBLIQUE
  public exportMetrics(): any {
    return {
      globalMetrics: this.calculateGlobalMetrics(),
      userMetrics: Array.from(this.userMetrics.values()),
      recommendations: this.getOptimizationRecommendations(),
      exportedAt: new Date().toISOString()
    };
  }

  public clearOldData(daysToKeep: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    // Nettoyer les événements
    this.events = this.events.filter(event => 
      new Date(event.timestamp) >= cutoffDate
    );

    // Nettoyer les performances
    Array.from(this.performances.entries()).forEach(([id, performance]) => {
      if (new Date(performance.sentAt) < cutoffDate) {
        this.performances.delete(id);
      }
    });

    console.log(`🧹 Données analytics nettoyées (${daysToKeep} jours conservés)`);
  }
}

// 🎯 INSTANCE GLOBALE
export const notificationAnalytics = NotificationAnalytics.getInstance();

export default NotificationAnalytics;
