/**
 * 📊 SERVICE DE MONITORING DES PERFORMANCES
 * Surveillance et analyse des performances de l'application EBIOS RM
 * Métriques UX, performance technique et usage utilisateur
 */

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  category: 'performance' | 'ux' | 'business' | 'technical';
  severity?: 'info' | 'warning' | 'error' | 'critical';
  metadata?: Record<string, any>;
}

export interface UserInteraction {
  id: string;
  userId: string;
  action: string;
  component: string;
  workshop?: number;
  duration: number;
  timestamp: number;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface PerformanceReport {
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalUsers: number;
    totalSessions: number;
    averageSessionDuration: number;
    completionRate: number;
    errorRate: number;
  };
  metrics: {
    performance: PerformanceMetric[];
    ux: PerformanceMetric[];
    business: PerformanceMetric[];
  };
  trends: {
    metric: string;
    trend: 'up' | 'down' | 'stable';
    change: number;
  }[];
  recommendations: string[];
}

export class PerformanceMonitoringService {
  private static metrics: PerformanceMetric[] = [];
  private static interactions: UserInteraction[] = [];
  private static observers: PerformanceObserver[] = [];

  /**
   * 🚀 INITIALISATION DU MONITORING
   */
  static initialize(): void {
    this.setupPerformanceObservers();
    this.setupUserInteractionTracking();
    this.setupErrorTracking();
    this.startPeriodicReporting();
  }

  /**
   * 👀 CONFIGURATION DES OBSERVATEURS DE PERFORMANCE
   */
  private static setupPerformanceObservers(): void {
    // Observer pour les métriques Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric({
            id: `lcp-${Date.now()}`,
            name: 'Largest Contentful Paint',
            value: entry.startTime,
            unit: 'ms',
            timestamp: Date.now(),
            category: 'performance',
            severity: entry.startTime > 2500 ? 'warning' : 'info'
          });
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric({
            id: `fid-${Date.now()}`,
            name: 'First Input Delay',
            value: (entry as any).processingStart - entry.startTime,
            unit: 'ms',
            timestamp: Date.now(),
            category: 'ux',
            severity: (entry as any).processingStart - entry.startTime > 100 ? 'warning' : 'info'
          });
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        if (clsValue > 0) {
          this.recordMetric({
            id: `cls-${Date.now()}`,
            name: 'Cumulative Layout Shift',
            value: clsValue,
            unit: 'score',
            timestamp: Date.now(),
            category: 'ux',
            severity: clsValue > 0.1 ? 'warning' : 'info'
          });
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      this.observers.push(lcpObserver, fidObserver, clsObserver);
    }
  }

  /**
   * 🖱️ SUIVI DES INTERACTIONS UTILISATEUR
   */
  private static setupUserInteractionTracking(): void {
    // Tracking des clics
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const component = this.identifyComponent(target);
      const workshop = this.identifyWorkshop();

      this.recordInteraction({
        id: `click-${Date.now()}`,
        userId: this.getCurrentUserId(),
        action: 'click',
        component,
        workshop,
        duration: 0,
        timestamp: Date.now(),
        success: true,
        metadata: {
          elementType: target.tagName,
          className: target.className,
          textContent: target.textContent?.substring(0, 50)
        }
      });
    });

    // Tracking des formulaires
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      const startTime = Date.now();

      this.recordInteraction({
        id: `form-submit-${startTime}`,
        userId: this.getCurrentUserId(),
        action: 'form_submit',
        component: this.identifyComponent(form),
        workshop: this.identifyWorkshop(),
        duration: 0,
        timestamp: startTime,
        success: true,
        metadata: {
          formId: form.id,
          formAction: form.action
        }
      });
    });

    // Tracking du temps passé sur les pages
    let pageStartTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const duration = Date.now() - pageStartTime;
      this.recordMetric({
        id: `page-duration-${Date.now()}`,
        name: 'Page Duration',
        value: duration,
        unit: 'ms',
        timestamp: Date.now(),
        category: 'ux',
        metadata: {
          page: window.location.pathname,
          workshop: this.identifyWorkshop()
        }
      });
    });
  }

  /**
   * 🚨 SUIVI DES ERREURS
   */
  private static setupErrorTracking(): void {
    window.addEventListener('error', (event) => {
      this.recordMetric({
        id: `error-${Date.now()}`,
        name: 'JavaScript Error',
        value: 1,
        unit: 'count',
        timestamp: Date.now(),
        category: 'technical',
        severity: 'error',
        metadata: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        }
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.recordMetric({
        id: `promise-rejection-${Date.now()}`,
        name: 'Unhandled Promise Rejection',
        value: 1,
        unit: 'count',
        timestamp: Date.now(),
        category: 'technical',
        severity: 'error',
        metadata: {
          reason: event.reason?.toString(),
          stack: event.reason?.stack
        }
      });
    });
  }

  /**
   * 📊 ENREGISTREMENT D'UNE MÉTRIQUE
   */
  static recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric);
    
    // Limiter le nombre de métriques en mémoire
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500);
    }

    // Alertes en temps réel pour les métriques critiques
    if (metric.severity === 'critical' || metric.severity === 'error') {
      this.handleCriticalMetric(metric);
    }
  }

  /**
   * 🖱️ ENREGISTREMENT D'UNE INTERACTION
   */
  static recordInteraction(interaction: UserInteraction): void {
    this.interactions.push(interaction);
    
    // Limiter le nombre d'interactions en mémoire
    if (this.interactions.length > 1000) {
      this.interactions = this.interactions.slice(-500);
    }
  }

  /**
   * 📈 GÉNÉRATION DE RAPPORT DE PERFORMANCE
   */
  static generateReport(startDate: Date, endDate: Date): PerformanceReport {
    const filteredMetrics = this.metrics.filter(m => 
      m.timestamp >= startDate.getTime() && m.timestamp <= endDate.getTime()
    );

    const filteredInteractions = this.interactions.filter(i => 
      i.timestamp >= startDate.getTime() && i.timestamp <= endDate.getTime()
    );

    return {
      period: { start: startDate, end: endDate },
      summary: this.calculateSummary(filteredInteractions),
      metrics: this.categorizeMetrics(filteredMetrics),
      trends: this.calculateTrends(filteredMetrics),
      recommendations: this.generateRecommendations(filteredMetrics, filteredInteractions)
    };
  }

  /**
   * 📊 CALCUL DU RÉSUMÉ
   */
  private static calculateSummary(interactions: UserInteraction[]): any {
    const uniqueUsers = new Set(interactions.map(i => i.userId)).size;
    const sessions = this.groupInteractionsBySessions(interactions);
    const totalErrors = interactions.filter(i => !i.success).length;

    return {
      totalUsers: uniqueUsers,
      totalSessions: sessions.length,
      averageSessionDuration: this.calculateAverageSessionDuration(sessions),
      completionRate: this.calculateCompletionRate(interactions),
      errorRate: interactions.length > 0 ? (totalErrors / interactions.length) * 100 : 0
    };
  }

  /**
   * 📂 CATÉGORISATION DES MÉTRIQUES
   */
  private static categorizeMetrics(metrics: PerformanceMetric[]): any {
    return {
      performance: metrics.filter(m => m.category === 'performance'),
      ux: metrics.filter(m => m.category === 'ux'),
      business: metrics.filter(m => m.category === 'business')
    };
  }

  /**
   * 📈 CALCUL DES TENDANCES
   */
  private static calculateTrends(metrics: PerformanceMetric[]): any[] {
    const trends: any[] = [];
    const metricGroups = this.groupMetricsByName(metrics);

    Object.entries(metricGroups).forEach(([name, metricList]) => {
      if (metricList.length >= 2) {
        const recent = metricList.slice(-10);
        const older = metricList.slice(-20, -10);
        
        if (older.length > 0) {
          const recentAvg = recent.reduce((sum, m) => sum + m.value, 0) / recent.length;
          const olderAvg = older.reduce((sum, m) => sum + m.value, 0) / older.length;
          const change = ((recentAvg - olderAvg) / olderAvg) * 100;

          trends.push({
            metric: name,
            trend: change > 5 ? 'up' : change < -5 ? 'down' : 'stable',
            change: Math.round(change * 100) / 100
          });
        }
      }
    });

    return trends;
  }

  /**
   * 💡 GÉNÉRATION DE RECOMMANDATIONS
   */
  private static generateRecommendations(
    metrics: PerformanceMetric[], 
    interactions: UserInteraction[]
  ): string[] {
    const recommendations: string[] = [];

    // Analyse des performances
    const lcpMetrics = metrics.filter(m => m.name === 'Largest Contentful Paint');
    if (lcpMetrics.length > 0) {
      const avgLCP = lcpMetrics.reduce((sum, m) => sum + m.value, 0) / lcpMetrics.length;
      if (avgLCP > 2500) {
        recommendations.push('Optimiser le Largest Contentful Paint (temps de chargement > 2.5s)');
      }
    }

    // Analyse des erreurs
    const errorRate = interactions.filter(i => !i.success).length / interactions.length;
    if (errorRate > 0.05) {
      recommendations.push(`Taux d'erreur élevé (${Math.round(errorRate * 100)}%) - Investiguer les causes`);
    }

    // Analyse de l'engagement
    const workshopCompletions = this.analyzeWorkshopCompletions(interactions);
    const lowCompletionWorkshops = Object.entries(workshopCompletions)
      .filter(([_, rate]) => rate < 0.7)
      .map(([workshop, _]) => workshop);

    if (lowCompletionWorkshops.length > 0) {
      recommendations.push(`Améliorer l'UX des ateliers ${lowCompletionWorkshops.join(', ')} (taux de completion < 70%)`);
    }

    return recommendations;
  }

  /**
   * 🔧 MÉTHODES UTILITAIRES
   */
  private static identifyComponent(element: HTMLElement): string {
    // Identifier le composant basé sur les classes CSS ou data attributes
    if (element.dataset.component) return element.dataset.component;
    if (element.className.includes('workshop')) return 'workshop';
    if (element.className.includes('modal')) return 'modal';
    if (element.className.includes('form')) return 'form';
    return element.tagName.toLowerCase();
  }

  private static identifyWorkshop(): number | undefined {
    const path = window.location.pathname;
    const match = path.match(/workshop[s]?[/-](\d+)/);
    return match ? parseInt(match[1]) : undefined;
  }

  private static getCurrentUserId(): string {
    // Récupérer l'ID utilisateur depuis le store ou localStorage
    return localStorage.getItem('userId') || 'anonymous';
  }

  private static handleCriticalMetric(metric: PerformanceMetric): void {
    console.error('Métrique critique détectée:', metric);
    // Ici on pourrait envoyer une alerte ou notification
  }

  private static groupInteractionsBySessions(interactions: UserInteraction[]): any[] {
    // Grouper les interactions par sessions (gap > 30min = nouvelle session)
    const sessions: any[] = [];
    let currentSession: UserInteraction[] = [];
    let lastTimestamp = 0;

    interactions.sort((a, b) => a.timestamp - b.timestamp).forEach(interaction => {
      if (interaction.timestamp - lastTimestamp > 30 * 60 * 1000) { // 30 minutes
        if (currentSession.length > 0) {
          sessions.push(currentSession);
        }
        currentSession = [interaction];
      } else {
        currentSession.push(interaction);
      }
      lastTimestamp = interaction.timestamp;
    });

    if (currentSession.length > 0) {
      sessions.push(currentSession);
    }

    return sessions;
  }

  private static calculateAverageSessionDuration(sessions: any[]): number {
    if (sessions.length === 0) return 0;
    
    const durations = sessions.map(session => {
      if (session.length < 2) return 0;
      return session[session.length - 1].timestamp - session[0].timestamp;
    });

    return durations.reduce((sum, d) => sum + d, 0) / durations.length;
  }

  private static calculateCompletionRate(interactions: UserInteraction[]): number {
    const workshopStarts = interactions.filter(i => i.action === 'workshop_start').length;
    const workshopCompletions = interactions.filter(i => i.action === 'workshop_complete').length;
    
    return workshopStarts > 0 ? (workshopCompletions / workshopStarts) * 100 : 0;
  }

  private static groupMetricsByName(metrics: PerformanceMetric[]): Record<string, PerformanceMetric[]> {
    return metrics.reduce((groups, metric) => {
      if (!groups[metric.name]) groups[metric.name] = [];
      groups[metric.name].push(metric);
      return groups;
    }, {} as Record<string, PerformanceMetric[]>);
  }

  private static analyzeWorkshopCompletions(interactions: UserInteraction[]): Record<string, number> {
    const completions: Record<string, number> = {};
    
    for (let i = 1; i <= 5; i++) {
      const starts = interactions.filter(int => int.workshop === i && int.action.includes('start')).length;
      const completes = interactions.filter(int => int.workshop === i && int.action.includes('complete')).length;
      completions[`workshop${i}`] = starts > 0 ? completes / starts : 0;
    }

    return completions;
  }

  /**
   * ⏰ RAPPORT PÉRIODIQUE
   */
  private static startPeriodicReporting(): void {
    setInterval(() => {
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000); // 24h
      const report = this.generateReport(startDate, endDate);
      
      // Sauvegarder le rapport ou l'envoyer à un service d'analytics
      console.log('Rapport de performance quotidien:', report);
    }, 24 * 60 * 60 * 1000); // Toutes les 24h
  }

  /**
   * 🧹 NETTOYAGE
   */
  static cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics = [];
    this.interactions = [];
  }
}
