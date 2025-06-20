/**
 * 🔗 SERVICE DE NAVIGATION POUR NOTIFICATIONS
 * Gestion des liens profonds et navigation contextuelle
 */

import type { NotificationContext } from '../types/notifications';

// 🎯 TYPES POUR LA NAVIGATION
export interface NavigationRoute {
  path: string;
  params?: Record<string, string>;
  query?: Record<string, string>;
  state?: Record<string, any>;
  hash?: string;
}

export interface NavigationContext {
  source: 'notification' | 'direct' | 'breadcrumb';
  notificationId?: string;
  previousRoute?: string;
  preserveState?: boolean;
  metadata?: Record<string, any>;
}

export interface DeepLinkConfig {
  pattern: string;
  component: string;
  requiredParams: string[];
  optionalParams?: string[];
  statePreservation?: boolean;
  breadcrumbTitle?: string;
}

/**
 * 🔗 SERVICE DE NAVIGATION PRINCIPAL
 */
export class NotificationNavigation {
  private static instance: NotificationNavigation | null = null;
  private navigationHistory: NavigationRoute[] = [];
  private deepLinkConfigs = new Map<string, DeepLinkConfig>();
  private stateCache = new Map<string, any>();

  public static getInstance(): NotificationNavigation {
    if (!NotificationNavigation.instance) {
      NotificationNavigation.instance = new NotificationNavigation();
    }
    return NotificationNavigation.instance;
  }

  // 🚀 INITIALISATION
  public initialize(): void {
    console.log('🔗 Initialisation NotificationNavigation...');
    this.registerDeepLinks();
    this.setupNavigationListeners();
    console.log('✅ NotificationNavigation initialisé');
  }

  // 📋 ENREGISTREMENT DES LIENS PROFONDS
  private registerDeepLinks(): void {
    // Formation et ateliers
    this.registerDeepLink('workshop', {
      pattern: '/missions/:missionId/workshops/:workshopId',
      component: 'WorkshopInterface',
      requiredParams: ['missionId', 'workshopId'],
      optionalParams: ['step', 'section'],
      statePreservation: true,
      breadcrumbTitle: 'Atelier {workshopId}'
    });

    this.registerDeepLink('workshop-results', {
      pattern: '/missions/:missionId/workshops/:workshopId/results',
      component: 'WorkshopResults',
      requiredParams: ['missionId', 'workshopId'],
      breadcrumbTitle: 'Résultats Atelier {workshopId}'
    });

    this.registerDeepLink('workshop-validation', {
      pattern: '/missions/:missionId/workshops/:workshopId/validate',
      component: 'WorkshopValidation',
      requiredParams: ['missionId', 'workshopId'],
      optionalParams: ['errorCode'],
      breadcrumbTitle: 'Validation Atelier {workshopId}'
    });

    // Missions
    this.registerDeepLink('mission', {
      pattern: '/missions/:missionId',
      component: 'MissionDashboard',
      requiredParams: ['missionId'],
      optionalParams: ['tab'],
      statePreservation: true,
      breadcrumbTitle: 'Mission {missionId}'
    });

    this.registerDeepLink('mission-validation', {
      pattern: '/missions/:missionId/validate',
      component: 'MissionValidation',
      requiredParams: ['missionId'],
      breadcrumbTitle: 'Validation Mission'
    });

    this.registerDeepLink('mission-review', {
      pattern: '/missions/:missionId/review',
      component: 'MissionReview',
      requiredParams: ['missionId'],
      optionalParams: ['section'],
      breadcrumbTitle: 'Révision Mission'
    });

    // Rapports
    this.registerDeepLink('report', {
      pattern: '/reports/:reportId',
      component: 'ReportViewer',
      requiredParams: ['reportId'],
      optionalParams: ['page', 'section'],
      breadcrumbTitle: 'Rapport {reportId}'
    });

    this.registerDeepLink('report-share', {
      pattern: '/reports/:reportId/share',
      component: 'ReportSharing',
      requiredParams: ['reportId'],
      breadcrumbTitle: 'Partage Rapport'
    });

    // Collaboration
    this.registerDeepLink('comments', {
      pattern: '/missions/:missionId/comments',
      component: 'CollaborationHub',
      requiredParams: ['missionId'],
      optionalParams: ['commentId'],
      breadcrumbTitle: 'Commentaires'
    });

    this.registerDeepLink('team', {
      pattern: '/missions/:missionId/team',
      component: 'TeamManagement',
      requiredParams: ['missionId'],
      breadcrumbTitle: 'Équipe'
    });

    // Formation
    this.registerDeepLink('training', {
      pattern: '/training/:moduleId',
      component: 'TrainingModule',
      requiredParams: ['moduleId'],
      optionalParams: ['lesson', 'exercise'],
      statePreservation: true,
      breadcrumbTitle: 'Formation {moduleId}'
    });

    this.registerDeepLink('achievements', {
      pattern: '/achievements/:achievementId',
      component: 'AchievementDetails',
      requiredParams: ['achievementId'],
      breadcrumbTitle: 'Achievement'
    });
  }

  // 🔗 ENREGISTRER UN LIEN PROFOND
  public registerDeepLink(id: string, config: DeepLinkConfig): void {
    this.deepLinkConfigs.set(id, config);
  }

  // 🧭 GÉNÉRER UNE URL À PARTIR DU CONTEXTE
  public generateDeepLink(
    linkId: string, 
    context: NotificationContext, 
    additionalParams?: Record<string, string>
  ): string | null {
    const config = this.deepLinkConfigs.get(linkId);
    if (!config) {
      console.warn(`⚠️ Configuration de lien profond non trouvée: ${linkId}`);
      return null;
    }

    try {
      let path = config.pattern;
      const params = { ...this.extractParamsFromContext(context), ...additionalParams };

      // Remplacer les paramètres requis
      config.requiredParams.forEach(param => {
        const value = params[param];
        if (!value) {
          throw new Error(`Paramètre requis manquant: ${param}`);
        }
        path = path.replace(`:${param}`, value);
      });

      // Remplacer les paramètres optionnels
      config.optionalParams?.forEach(param => {
        const value = params[param];
        if (value) {
          path = path.replace(`:${param}`, value);
        } else {
          // Supprimer les paramètres optionnels non fournis
          path = path.replace(`/:${param}`, '');
        }
      });

      // Ajouter les paramètres de query
      const queryParams = this.extractQueryParams(context, additionalParams);
      if (Object.keys(queryParams).length > 0) {
        const queryString = new URLSearchParams(queryParams).toString();
        path += `?${queryString}`;
      }

      // Ajouter le hash si présent
      if (context.metadata?.hash) {
        path += `#${context.metadata.hash}`;
      }

      return path;

    } catch (error) {
      console.error(`❌ Erreur génération lien profond ${linkId}:`, error);
      return null;
    }
  }

  // 🚀 NAVIGUER VERS UNE NOTIFICATION
  public async navigateToNotification(
    notificationId: string,
    context: NotificationContext,
    preserveState: boolean = true
  ): Promise<boolean> {
    try {
      console.log(`🔗 Navigation vers notification: ${notificationId}`, context);

      // Déterminer le type de lien à générer
      const linkId = this.determineLinkType(context);
      if (!linkId) {
        console.warn('⚠️ Impossible de déterminer le type de lien');
        return false;
      }

      // Générer l'URL
      const url = this.generateDeepLink(linkId, context);
      if (!url) {
        console.warn('⚠️ Impossible de générer l\'URL');
        return false;
      }

      // Sauvegarder l'état actuel si demandé
      if (preserveState) {
        await this.preserveCurrentState(notificationId);
      }

      // Ajouter à l'historique de navigation
      this.addToNavigationHistory({
        path: url,
        state: { 
          source: 'notification',
          notificationId,
          timestamp: new Date().toISOString()
        }
      });

      // Effectuer la navigation
      if (typeof window !== 'undefined') {
        window.location.href = url;
      }

      console.log(`✅ Navigation réussie vers: ${url}`);
      return true;

    } catch (error) {
      console.error('❌ Erreur navigation notification:', error);
      return false;
    }
  }

  // 🎯 DÉTERMINER LE TYPE DE LIEN
  private determineLinkType(context: NotificationContext): string | null {
    // Logique pour déterminer le type de lien basé sur le contexte
    if (context.workshopId && context.missionId) {
      if (context.stepId) {
        return 'workshop';
      }
      if (context.metadata?.showResults) {
        return 'workshop-results';
      }
      if (context.metadata?.showValidation) {
        return 'workshop-validation';
      }
      return 'workshop';
    }

    if (context.missionId) {
      if (context.metadata?.action === 'validate') {
        return 'mission-validation';
      }
      if (context.metadata?.action === 'review') {
        return 'mission-review';
      }
      if (context.metadata?.showComments) {
        return 'comments';
      }
      if (context.metadata?.showTeam) {
        return 'team';
      }
      return 'mission';
    }

    if (context.reportId) {
      if (context.metadata?.action === 'share') {
        return 'report-share';
      }
      return 'report';
    }

    if (context.moduleId) {
      return 'training';
    }

    if (context.metadata?.achievementId) {
      return 'achievements';
    }

    return null;
  }

  // 📊 EXTRAIRE LES PARAMÈTRES DU CONTEXTE
  private extractParamsFromContext(context: NotificationContext): Record<string, string> {
    const params: Record<string, string> = {};

    if (context.missionId) params.missionId = context.missionId;
    if (context.workshopId) params.workshopId = context.workshopId.toString();
    if (context.stepId) params.step = context.stepId;
    if (context.reportId) params.reportId = context.reportId;
    if (context.moduleId) params.moduleId = context.moduleId;
    if (context.userId) params.userId = context.userId;

    // Ajouter les paramètres des métadonnées
    if (context.metadata) {
      Object.entries(context.metadata).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          params[key] = value.toString();
        }
      });
    }

    return params;
  }

  // 🔍 EXTRAIRE LES PARAMÈTRES DE QUERY
  private extractQueryParams(
    context: NotificationContext, 
    additionalParams?: Record<string, string>
  ): Record<string, string> {
    const queryParams: Record<string, string> = {};

    // Paramètres de contexte
    if (context.sessionId) queryParams.sessionId = context.sessionId;
    if (context.errorCode) queryParams.error = context.errorCode;

    // Paramètres additionnels
    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        if (!['missionId', 'workshopId', 'reportId', 'moduleId'].includes(key)) {
          queryParams[key] = value;
        }
      });
    }

    // Paramètres de métadonnées pour la query
    if (context.metadata) {
      ['tab', 'section', 'page', 'view', 'filter'].forEach(key => {
        if (context.metadata![key]) {
          queryParams[key] = context.metadata![key].toString();
        }
      });
    }

    return queryParams;
  }

  // 💾 PRÉSERVER L'ÉTAT ACTUEL
  private async preserveCurrentState(notificationId: string): Promise<void> {
    try {
      const currentState = {
        url: window.location.href,
        scrollPosition: {
          x: window.scrollX,
          y: window.scrollY
        },
        formData: this.extractFormData(),
        timestamp: new Date().toISOString()
      };

      this.stateCache.set(notificationId, currentState);

      // Persister dans le localStorage pour survie aux rechargements
      localStorage.setItem(
        `notification_state_${notificationId}`, 
        JSON.stringify(currentState)
      );

    } catch (error) {
      console.warn('⚠️ Erreur sauvegarde état:', error);
    }
  }

  // 🔄 RESTAURER L'ÉTAT PRÉCÉDENT
  public async restoreState(notificationId: string): Promise<boolean> {
    try {
      let state = this.stateCache.get(notificationId);
      
      if (!state) {
        const saved = localStorage.getItem(`notification_state_${notificationId}`);
        if (saved) {
          state = JSON.parse(saved);
        }
      }

      if (!state) return false;

      // Restaurer la position de scroll
      if (state.scrollPosition) {
        window.scrollTo(state.scrollPosition.x, state.scrollPosition.y);
      }

      // Restaurer les données de formulaire
      if (state.formData) {
        this.restoreFormData(state.formData);
      }

      console.log(`✅ État restauré pour notification: ${notificationId}`);
      return true;

    } catch (error) {
      console.error('❌ Erreur restauration état:', error);
      return false;
    }
  }

  // 📝 EXTRAIRE LES DONNÉES DE FORMULAIRE
  private extractFormData(): Record<string, any> {
    const formData: Record<string, any> = {};
    
    document.querySelectorAll('input, textarea, select').forEach((element: any) => {
      if (element.name || element.id) {
        const key = element.name || element.id;
        formData[key] = element.value;
      }
    });

    return formData;
  }

  // 🔄 RESTAURER LES DONNÉES DE FORMULAIRE
  private restoreFormData(formData: Record<string, any>): void {
    Object.entries(formData).forEach(([key, value]) => {
      const element = document.querySelector(`[name="${key}"], #${key}`) as any;
      if (element && element.value !== undefined) {
        element.value = value;
      }
    });
  }

  // 📚 AJOUTER À L'HISTORIQUE DE NAVIGATION
  private addToNavigationHistory(route: NavigationRoute): void {
    this.navigationHistory.push(route);
    
    // Limiter la taille de l'historique
    if (this.navigationHistory.length > 50) {
      this.navigationHistory = this.navigationHistory.slice(-25);
    }
  }

  // 👂 CONFIGURER LES LISTENERS DE NAVIGATION
  private setupNavigationListeners(): void {
    if (typeof window === 'undefined') return;

    // Écouter les changements d'URL
    window.addEventListener('popstate', (event) => {
      if (event.state?.source === 'notification') {
        console.log('🔗 Navigation depuis notification détectée');
      }
    });

    // Écouter les clics sur les liens de notification
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-notification-link]')) {
        const notificationId = target.closest('[data-notification-link]')?.getAttribute('data-notification-id');
        if (notificationId) {
          console.log(`🔗 Clic sur lien notification: ${notificationId}`);
        }
      }
    });
  }

  // 🧭 GÉNÉRER DES BREADCRUMBS
  public generateBreadcrumbs(context: NotificationContext): Array<{
    label: string;
    url?: string;
    active: boolean;
  }> {
    const breadcrumbs = [
      { label: 'Accueil', url: '/', active: false }
    ];

    if (context.missionId) {
      breadcrumbs.push({
        label: `Mission ${context.missionId}`,
        url: `/missions/${context.missionId}`,
        active: false
      });

      if (context.workshopId) {
        breadcrumbs.push({
          label: `Atelier ${context.workshopId}`,
          url: `/missions/${context.missionId}/workshops/${context.workshopId}`,
          active: true
        });
      }
    }

    if (context.reportId) {
      breadcrumbs.push({
        label: 'Rapports',
        url: '/reports',
        active: false
      });
      breadcrumbs.push({
        label: `Rapport ${context.reportId}`,
        url: `/reports/${context.reportId}`,
        active: true
      });
    }

    return breadcrumbs;
  }

  // 📊 API PUBLIQUE
  public getNavigationHistory(): NavigationRoute[] {
    return [...this.navigationHistory];
  }

  public clearNavigationHistory(): void {
    this.navigationHistory = [];
  }

  public getDeepLinkConfigs(): Map<string, DeepLinkConfig> {
    return new Map(this.deepLinkConfigs);
  }

  public clearStateCache(): void {
    this.stateCache.clear();
    
    // Nettoyer le localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('notification_state_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

// 🎯 INSTANCE GLOBALE
export const notificationNavigation = NotificationNavigation.getInstance();

export default NotificationNavigation;
