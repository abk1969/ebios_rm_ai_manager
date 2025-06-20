/**
 * 🧭 SERVICE DE NAVIGATION GLOBALE INTER-ATELIERS
 * Gestion intelligente des transitions et validation des prérequis
 */

import { GlobalWorkshopLinksManager } from './GlobalWorkshopLinksManager';

// 🎯 TYPES POUR LA NAVIGATION
export interface NavigationState {
  currentWorkshop: number;
  availableWorkshops: number[];
  completedWorkshops: number[];
  blockedWorkshops: number[];
  nextRecommendedWorkshop: number | null;
  canNavigateForward: boolean;
  canNavigateBackward: boolean;
  prerequisites: PrerequisiteCheck[];
  warnings: NavigationWarning[];
}

export interface PrerequisiteCheck {
  workshopId: number;
  requirement: string;
  status: 'satisfied' | 'missing' | 'partial';
  description: string;
  actions: string[];
}

export interface NavigationWarning {
  type: 'data_loss' | 'incomplete_data' | 'validation_failure' | 'dependency_missing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  affectedWorkshops: number[];
  recommendations: string[];
}

export interface WorkshopTransition {
  from: number;
  to: number;
  dataTransfer: DataTransferSummary;
  validations: TransitionValidation[];
  estimatedDuration: number; // minutes
  complexity: 'simple' | 'moderate' | 'complex';
  userGuidance: string[];
}

export interface DataTransferSummary {
  totalItems: number;
  criticalItems: number;
  transformations: number;
  validationRules: number;
  estimatedAccuracy: number; // percentage
}

export interface TransitionValidation {
  rule: string;
  status: 'passed' | 'failed' | 'warning';
  impact: 'low' | 'medium' | 'high';
  message: string;
  autoFixAvailable: boolean;
}

export interface WorkshopMetadata {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  estimatedDuration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  prerequisites: string[];
  deliverables: string[];
  keyLearningObjectives: string[];
  dependencies: number[];
  dependents: number[];
}

/**
 * 🎯 CLASSE PRINCIPALE DE NAVIGATION
 */
export class WorkshopNavigationService {
  
  // 📊 MÉTADONNÉES DES ATELIERS
  private static workshopMetadata: { [key: number]: WorkshopMetadata } = {
    1: {
      id: 1,
      title: 'Atelier 1 - Socle de Sécurité',
      shortTitle: 'Socle',
      description: 'Établir les fondations de l\'analyse EBIOS RM',
      estimatedDuration: 210,
      difficulty: 'intermediate',
      prerequisites: ['Connaissance EBIOS RM de base'],
      deliverables: ['Inventaire biens essentiels', 'Contexte organisationnel', 'Objectifs sécurité'],
      keyLearningObjectives: ['Cadrage mission', 'Identification biens essentiels', 'Définition périmètre'],
      dependencies: [],
      dependents: [2]
    },
    2: {
      id: 2,
      title: 'Atelier 2 - Sources de Risque',
      shortTitle: 'Sources',
      description: 'Identifier et analyser les sources de risque',
      estimatedDuration: 215,
      difficulty: 'advanced',
      prerequisites: ['Atelier 1 terminé', 'Biens essentiels identifiés'],
      deliverables: ['Sources priorisées', 'Profils détaillés', 'Threat intelligence'],
      keyLearningObjectives: ['Sources externes', 'Menaces internes', 'Supply chain', 'Threat intelligence'],
      dependencies: [1],
      dependents: [3]
    },
    3: {
      id: 3,
      title: 'Atelier 3 - Scénarios Stratégiques',
      shortTitle: 'Scénarios',
      description: 'Construire les scénarios stratégiques',
      estimatedDuration: 280,
      difficulty: 'advanced',
      prerequisites: ['Atelier 2 terminé', 'Sources priorisées'],
      deliverables: ['Scénarios stratégiques', 'Événements redoutés', 'Niveaux de risque'],
      keyLearningObjectives: ['Construction scénarios', 'Évaluation risques', 'Priorisation'],
      dependencies: [2],
      dependents: [4]
    },
    4: {
      id: 4,
      title: 'Atelier 4 - Modes Opératoires',
      shortTitle: 'Modes',
      description: 'Détailler les modes opératoires',
      estimatedDuration: 280,
      difficulty: 'expert',
      prerequisites: ['Atelier 3 terminé', 'Scénarios validés'],
      deliverables: ['Modes opératoires', 'Vecteurs d\'attaque', 'Techniques MITRE'],
      keyLearningObjectives: ['Modes opératoires', 'Techniques d\'attaque', 'Chemins d\'attaque'],
      dependencies: [3],
      dependents: [5]
    },
    5: {
      id: 5,
      title: 'Atelier 5 - Traitement du Risque',
      shortTitle: 'Traitement',
      description: 'Définir les mesures de traitement',
      estimatedDuration: 280,
      difficulty: 'expert',
      prerequisites: ['Atelier 4 terminé', 'Modes opératoires définis'],
      deliverables: ['Mesures de traitement', 'Plan d\'implémentation', 'Budget'],
      keyLearningObjectives: ['Mesures sécurité', 'Priorisation', 'Plan d\'action'],
      dependencies: [4],
      dependents: []
    }
  };

  // 🧭 ANALYSE DE L'ÉTAT DE NAVIGATION
  static analyzeNavigationState(currentWorkshop: number): NavigationState {
    const completedWorkshops = this.getCompletedWorkshops();
    const availableWorkshops = this.getAvailableWorkshops(completedWorkshops);
    const blockedWorkshops = this.getBlockedWorkshops(completedWorkshops);
    
    return {
      currentWorkshop,
      availableWorkshops,
      completedWorkshops,
      blockedWorkshops,
      nextRecommendedWorkshop: this.getNextRecommendedWorkshop(currentWorkshop, completedWorkshops),
      canNavigateForward: this.canNavigateForward(currentWorkshop, completedWorkshops),
      canNavigateBackward: currentWorkshop > 1,
      prerequisites: this.checkPrerequisites(currentWorkshop),
      warnings: this.generateNavigationWarnings(currentWorkshop, completedWorkshops)
    };
  }

  // ✅ VÉRIFICATION DES PRÉREQUIS
  static checkPrerequisites(workshopId: number): PrerequisiteCheck[] {
    const workshop = this.workshopMetadata[workshopId];
    if (!workshop) return [];

    const checks: PrerequisiteCheck[] = [];
    
    // Vérification des dépendances d'ateliers
    workshop.dependencies.forEach(depId => {
      const isCompleted = this.isWorkshopCompleted(depId);
      checks.push({
        workshopId: depId,
        requirement: `Atelier ${depId} terminé`,
        status: isCompleted ? 'satisfied' : 'missing',
        description: `L'Atelier ${depId} doit être terminé avant de commencer l'Atelier ${workshopId}`,
        actions: isCompleted ? [] : [`Terminer l'Atelier ${depId}`, 'Valider les livrables', 'Effectuer la transmission de données']
      });
    });

    // Vérifications spécifiques par atelier
    switch (workshopId) {
      case 2:
        checks.push({
          workshopId: 1,
          requirement: 'Biens essentiels identifiés',
          status: this.hasEssentialAssets() ? 'satisfied' : 'missing',
          description: 'Au moins 10 biens essentiels doivent être identifiés et classifiés',
          actions: ['Compléter l\'inventaire des biens essentiels', 'Valider la classification', 'Obtenir l\'approbation du comité']
        });
        break;
      case 3:
        checks.push({
          workshopId: 2,
          requirement: 'Sources de risque priorisées',
          status: this.hasPrioritizedSources() ? 'satisfied' : 'missing',
          description: 'Au moins 10 sources de risque doivent être identifiées et priorisées',
          actions: ['Compléter l\'analyse des sources', 'Valider la priorisation', 'Documenter les profils de menace']
        });
        break;
    }

    return checks;
  }

  // 🔄 PLANIFICATION DE TRANSITION
  static planTransition(from: number, to: number): WorkshopTransition {
    const dataTransfer = this.calculateDataTransfer(from, to);
    const validations = this.getTransitionValidations(from, to);
    
    return {
      from,
      to,
      dataTransfer,
      validations,
      estimatedDuration: this.estimateTransitionDuration(from, to),
      complexity: this.assessTransitionComplexity(from, to),
      userGuidance: this.generateUserGuidance(from, to)
    };
  }

  // 📊 CALCUL DU TRANSFERT DE DONNÉES
  private static calculateDataTransfer(from: number, to: number): DataTransferSummary {
    const baseItems = {
      1: { total: 15, critical: 8, transformations: 3 },
      2: { total: 20, critical: 12, transformations: 5 },
      3: { total: 25, critical: 15, transformations: 7 },
      4: { total: 30, critical: 18, transformations: 9 }
    };

    const data = baseItems[from as keyof typeof baseItems] || { total: 10, critical: 5, transformations: 2 };
    
    return {
      totalItems: data.total,
      criticalItems: data.critical,
      transformations: data.transformations,
      validationRules: data.transformations * 2,
      estimatedAccuracy: 95 - (to - from) * 2 // Accuracy decreases with distance
    };
  }

  // ⚠️ GÉNÉRATION D'AVERTISSEMENTS
  private static generateNavigationWarnings(currentWorkshop: number, completedWorkshops: number[]): NavigationWarning[] {
    const warnings: NavigationWarning[] = [];

    // Avertissement si on saute des ateliers
    if (currentWorkshop > Math.max(...completedWorkshops, 0) + 1) {
      warnings.push({
        type: 'dependency_missing',
        severity: 'high',
        message: 'Vous tentez d\'accéder à un atelier sans avoir terminé les prérequis',
        affectedWorkshops: [currentWorkshop],
        recommendations: ['Terminer les ateliers précédents dans l\'ordre', 'Valider les transmissions de données']
      });
    }

    // Avertissement si données incomplètes
    if (currentWorkshop > 1 && !this.hasCompleteDataForWorkshop(currentWorkshop)) {
      warnings.push({
        type: 'incomplete_data',
        severity: 'medium',
        message: 'Certaines données requises pour cet atelier sont incomplètes',
        affectedWorkshops: [currentWorkshop - 1, currentWorkshop],
        recommendations: ['Vérifier les livrables de l\'atelier précédent', 'Compléter les données manquantes']
      });
    }

    return warnings;
  }

  // 🎯 MÉTHODES UTILITAIRES
  private static getCompletedWorkshops(): number[] {
    // Simulation basée sur le GlobalWorkshopLinksManager
    const status1 = GlobalWorkshopLinksManager.getWorkshopStatus(1);
    const status2 = GlobalWorkshopLinksManager.getWorkshopStatus(2);
    
    const completed: number[] = [];
    if (status1 === 'completed') completed.push(1);
    if (status2 === 'completed') completed.push(2);
    
    return completed;
  }

  private static getAvailableWorkshops(completedWorkshops: number[]): number[] {
    const maxCompleted = Math.max(...completedWorkshops, 0);
    const available: number[] = [...completedWorkshops];
    
    // L'atelier suivant est disponible si le précédent est terminé
    if (maxCompleted < 5) {
      available.push(maxCompleted + 1);
    }
    
    return [...new Set(available)].sort();
  }

  private static getBlockedWorkshops(completedWorkshops: number[]): number[] {
    const maxCompleted = Math.max(...completedWorkshops, 0);
    const blocked: number[] = [];
    
    for (let i = maxCompleted + 2; i <= 5; i++) {
      blocked.push(i);
    }
    
    return blocked;
  }

  private static getNextRecommendedWorkshop(current: number, completed: number[]): number | null {
    if (completed.includes(current) && current < 5) {
      return current + 1;
    }
    if (!completed.includes(current)) {
      return current; // Terminer l'atelier actuel
    }
    return null; // Tous les ateliers terminés
  }

  private static canNavigateForward(current: number, completed: number[]): boolean {
    return current < 5 && (completed.includes(current) || current === Math.max(...completed, 0) + 1);
  }

  private static isWorkshopCompleted(workshopId: number): boolean {
    return GlobalWorkshopLinksManager.getWorkshopStatus(workshopId) === 'completed';
  }

  private static hasEssentialAssets(): boolean {
    // Simulation - vérifier si l'Atelier 1 a produit des biens essentiels
    return this.isWorkshopCompleted(1);
  }

  private static hasPrioritizedSources(): boolean {
    // Simulation - vérifier si l'Atelier 2 a produit des sources priorisées
    return this.isWorkshopCompleted(2);
  }

  private static hasCompleteDataForWorkshop(workshopId: number): boolean {
    // Simulation - vérifier la complétude des données
    return this.isWorkshopCompleted(workshopId - 1);
  }

  private static estimateTransitionDuration(from: number, to: number): number {
    // Estimation basée sur la complexité de la transition
    const baseTime = 15; // minutes
    const complexityFactor = Math.abs(to - from);
    return baseTime + (complexityFactor * 5);
  }

  private static assessTransitionComplexity(from: number, to: number): 'simple' | 'moderate' | 'complex' {
    const distance = Math.abs(to - from);
    if (distance === 1) return 'simple';
    if (distance === 2) return 'moderate';
    return 'complex';
  }

  private static generateUserGuidance(from: number, to: number): string[] {
    const guidance: string[] = [];
    
    if (to === from + 1) {
      guidance.push(`Transmission automatique des données de l'Atelier ${from} vers l'Atelier ${to}`);
      guidance.push('Vérification de la cohérence des données transmises');
      guidance.push('Validation des transformations appliquées');
    } else {
      guidance.push('Transition non séquentielle détectée');
      guidance.push('Vérification manuelle des prérequis recommandée');
      guidance.push('Validation approfondie des données requise');
    }
    
    return guidance;
  }

  private static getTransitionValidations(from: number, to: number): TransitionValidation[] {
    return [
      {
        rule: 'Données complètes atelier source',
        status: this.isWorkshopCompleted(from) ? 'passed' : 'failed',
        impact: 'high',
        message: `L'Atelier ${from} doit être terminé avec tous ses livrables`,
        autoFixAvailable: false
      },
      {
        rule: 'Cohérence des transformations',
        status: 'passed',
        impact: 'medium',
        message: 'Les transformations de données sont cohérentes',
        autoFixAvailable: true
      }
    ];
  }

  // 📋 MÉTHODES PUBLIQUES
  static getWorkshopMetadata(workshopId: number): WorkshopMetadata | null {
    return this.workshopMetadata[workshopId] || null;
  }

  static getAllWorkshopsMetadata(): WorkshopMetadata[] {
    return Object.values(this.workshopMetadata);
  }

  static validateNavigation(from: number, to: number): { valid: boolean; reasons: string[] } {
    const reasons: string[] = [];
    
    if (to < 1 || to > 5) {
      reasons.push('Atelier de destination invalide');
    }
    
    if (to > from + 1 && !this.isWorkshopCompleted(to - 1)) {
      reasons.push(`L'Atelier ${to - 1} doit être terminé avant d'accéder à l'Atelier ${to}`);
    }
    
    return {
      valid: reasons.length === 0,
      reasons
    };
  }
}
