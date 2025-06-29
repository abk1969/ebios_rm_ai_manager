/**
 * 🎯 SERVICE DE DÉTECTION DES BLOCAGES
 * Service intelligent qui détecte automatiquement les blocages utilisateur et propose des solutions
 * 
 * CARACTÉRISTIQUES :
 * - Détection proactive des blocages
 * - Analyse des patterns de comportement
 * - Solutions contextuelles automatiques
 * - Intégration avec les systèmes de validation existants
 */

import {
  Mission as _Mission,
  BusinessValue as _BusinessValue,
  SupportingAsset as _SupportingAsset,
  DreadedEvent as _DreadedEvent
} from '@/types/ebios';
import GlobalContextAIService from './GlobalContextAIService';

// 🎯 TYPES ET INTERFACES
export enum BlockageType {
  DATA_MISSING = 'data_missing',           // Données manquantes
  VALIDATION_FAILED = 'validation_failed', // Validation échouée
  CONCEPTUAL_CONFUSION = 'conceptual_confusion', // Confusion conceptuelle
  WORKFLOW_STUCK = 'workflow_stuck',       // Blocage de workflow
  TECHNICAL_ERROR = 'technical_error',     // Erreur technique
  USER_INACTIVITY = 'user_inactivity',     // Inactivité prolongée
  INCONSISTENT_DATA = 'inconsistent_data', // Données incohérentes
  MISSING_LINKS = 'missing_links'          // Liens manquants entre éléments
}

export enum BlockageSeverity {
  LOW = 'low',       // Peut continuer mais sous-optimal
  MEDIUM = 'medium', // Progression ralentie
  HIGH = 'high',     // Progression bloquée
  CRITICAL = 'critical' // Impossible de continuer
}

export interface BlockageDetection {
  id: string;
  type: BlockageType;
  severity: BlockageSeverity;
  title: string;
  description: string;
  workshop: number;
  detectedAt: Date;
  context: {
    currentData: any;
    userActions: string[];
    timeSpent: number;
    lastActivity: Date;
  };
  indicators: string[];
  confidence: number; // 0-100
}

export interface BlockageSolution {
  id: string;
  blockageId: string;
  title: string;
  description: string;
  steps: string[];
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  automated: boolean;
  actionType: 'guide' | 'fix' | 'suggest' | 'redirect';
  actionData?: any;
}

export interface BlockageAnalysis {
  blockages: BlockageDetection[];
  solutions: BlockageSolution[];
  overallStatus: 'healthy' | 'warning' | 'blocked' | 'critical';
  recommendations: string[];
  nextActions: string[];
}

// 🎯 SERVICE PRINCIPAL
class BlockageDetectionService {
  private static instance: BlockageDetectionService;
  private globalContextService: GlobalContextAIService;
  private detectionHistory: Map<string, BlockageDetection[]> = new Map();
  private userBehaviorPatterns: Map<string, any> = new Map();

  private constructor() {
    this.globalContextService = GlobalContextAIService.getInstance();
  }

  static getInstance(): BlockageDetectionService {
    if (!BlockageDetectionService.instance) {
      BlockageDetectionService.instance = new BlockageDetectionService();
    }
    return BlockageDetectionService.instance;
  }

  // 🎯 MÉTHODES PRINCIPALES

  /**
   * Analyse complète des blocages pour une mission
   */
  async analyzeBlockages(
    missionId: string,
    currentWorkshop: number,
    workshopData: any,
    userContext?: any
  ): Promise<BlockageAnalysis> {
    try {
      // Récupération du contexte global
      const globalContext = await this.globalContextService.getGlobalContext(missionId);
      if (!globalContext) {
        return this.createEmptyAnalysis();
      }

      const blockages: BlockageDetection[] = [];

      // 1. Détection des données manquantes
      blockages.push(...this.detectMissingData(currentWorkshop, workshopData, globalContext));

      // 2. Détection des incohérences
      blockages.push(...this.detectInconsistencies(currentWorkshop, workshopData, globalContext));

      // 3. Détection des liens manquants
      blockages.push(...this.detectMissingLinks(currentWorkshop, workshopData, globalContext));

      // 4. Détection des blocages de workflow
      blockages.push(...this.detectWorkflowBlockages(currentWorkshop, workshopData, globalContext));

      // 5. Détection de l'inactivité utilisateur
      if (userContext) {
        blockages.push(...this.detectUserInactivity(missionId, userContext));
      }

      // Génération des solutions
      const solutions = await this.generateSolutions(blockages, globalContext);

      // Analyse globale
      const overallStatus = this.determineOverallStatus(blockages);
      const recommendations = this.generateRecommendations(blockages, globalContext);
      const nextActions = this.generateNextActions(blockages, solutions);

      // Sauvegarde de l'historique
      this.saveDetectionHistory(missionId, blockages);

      return {
        blockages,
        solutions,
        overallStatus,
        recommendations,
        nextActions
      };
    } catch (error) {
      console.error('🚨 Erreur lors de l\'analyse des blocages:', error);
      return this.createEmptyAnalysis();
    }
  }

  // 🎯 MÉTHODES DE DÉTECTION SPÉCIFIQUES

  private detectMissingData(
    workshop: number,
    workshopData: any,
    _globalContext: any
  ): BlockageDetection[] {
    const blockages: BlockageDetection[] = [];

    switch (workshop) {
      case 1:
        // Vérification des données essentielles de l'atelier 1
        if (!workshopData.businessValues || workshopData.businessValues.length === 0) {
          blockages.push({
            id: `missing-bv-${Date.now()}`,
            type: BlockageType.DATA_MISSING,
            severity: BlockageSeverity.HIGH,
            title: 'Aucune valeur métier définie',
            description: 'L\'atelier 1 nécessite au moins 3 valeurs métier pour progresser efficacement.',
            workshop: 1,
            detectedAt: new Date(),
            context: { currentData: workshopData, userActions: [], timeSpent: 0, lastActivity: new Date() },
            indicators: ['Aucune valeur métier créée', 'Progression bloquée'],
            confidence: 95
          });
        } else if (workshopData.businessValues.length < 3) {
          blockages.push({
            id: `insufficient-bv-${Date.now()}`,
            type: BlockageType.DATA_MISSING,
            severity: BlockageSeverity.MEDIUM,
            title: 'Valeurs métier insuffisantes',
            description: `Vous avez ${workshopData.businessValues.length} valeur(s) métier. L'ANSSI recommande au moins 3 pour une analyse robuste.`,
            workshop: 1,
            detectedAt: new Date(),
            context: { currentData: workshopData, userActions: [], timeSpent: 0, lastActivity: new Date() },
            indicators: ['Moins de 3 valeurs métier', 'Analyse incomplète'],
            confidence: 80
          });
        }

        if (!workshopData.supportingAssets || workshopData.supportingAssets.length === 0) {
          blockages.push({
            id: `missing-assets-${Date.now()}`,
            type: BlockageType.DATA_MISSING,
            severity: BlockageSeverity.HIGH,
            title: 'Aucun actif support défini',
            description: 'Les actifs supports sont essentiels pour identifier les vulnérabilités.',
            workshop: 1,
            detectedAt: new Date(),
            context: { currentData: workshopData, userActions: [], timeSpent: 0, lastActivity: new Date() },
            indicators: ['Aucun actif support créé', 'Analyse de risque impossible'],
            confidence: 90
          });
        }
        break;

      case 2:
        // Vérifications pour l'atelier 2
        if (!workshopData.riskSources || workshopData.riskSources.length === 0) {
          blockages.push({
            id: `missing-sources-${Date.now()}`,
            type: BlockageType.DATA_MISSING,
            severity: BlockageSeverity.HIGH,
            title: 'Aucune source de risque identifiée',
            description: 'L\'atelier 2 nécessite l\'identification des sources de risque.',
            workshop: 2,
            detectedAt: new Date(),
            context: { currentData: workshopData, userActions: [], timeSpent: 0, lastActivity: new Date() },
            indicators: ['Aucune source de risque', 'Progression bloquée'],
            confidence: 95
          });
        }
        break;
    }

    return blockages;
  }

  private detectInconsistencies(
    workshop: number,
    workshopData: any,
    _globalContext: any
  ): BlockageDetection[] {
    const blockages: BlockageDetection[] = [];

    if (workshop === 1 && workshopData.businessValues && workshopData.supportingAssets) {
      // Vérification de la cohérence valeurs métier <-> actifs supports
      const orphanAssets = workshopData.supportingAssets.filter((asset: any) => 
        !workshopData.businessValues.some((value: any) => value.id === asset.businessValueId)
      );

      if (orphanAssets.length > 0) {
        blockages.push({
          id: `orphan-assets-${Date.now()}`,
          type: BlockageType.INCONSISTENT_DATA,
          severity: BlockageSeverity.MEDIUM,
          title: 'Actifs supports non liés',
          description: `${orphanAssets.length} actif(s) support(s) ne sont pas liés à des valeurs métier.`,
          workshop: 1,
          detectedAt: new Date(),
          context: { currentData: workshopData, userActions: [], timeSpent: 0, lastActivity: new Date() },
          indicators: ['Actifs orphelins détectés', 'Cohérence EBIOS RM compromise'],
          confidence: 85
        });
      }
    }

    return blockages;
  }

  private detectMissingLinks(
    workshop: number,
    workshopData: any,
    _globalContext: any
  ): BlockageDetection[] {
    const blockages: BlockageDetection[] = [];

    if (workshop === 1 && workshopData.businessValues) {
      // Vérification des liens valeurs métier <-> événements redoutés
      const valuesWithoutEvents = workshopData.businessValues.filter((value: any) => 
        !workshopData.dreadedEvents?.some((event: any) => event.businessValueId === value.id)
      );

      if (valuesWithoutEvents.length > 0) {
        blockages.push({
          id: `missing-events-${Date.now()}`,
          type: BlockageType.MISSING_LINKS,
          severity: BlockageSeverity.MEDIUM,
          title: 'Événements redoutés manquants',
          description: `${valuesWithoutEvents.length} valeur(s) métier sans événements redoutés associés.`,
          workshop: 1,
          detectedAt: new Date(),
          context: { currentData: workshopData, userActions: [], timeSpent: 0, lastActivity: new Date() },
          indicators: ['Liens manquants détectés', 'Analyse de risque incomplète'],
          confidence: 80
        });
      }
    }

    return blockages;
  }

  private detectWorkflowBlockages(
    workshop: number,
    workshopData: any,
    globalContext: any
  ): BlockageDetection[] {
    const blockages: BlockageDetection[] = [];

    // Détection des blocages de progression entre ateliers
    if (workshop > 1) {
      const previousWorkshopData = globalContext[`workshop${workshop - 1}`];
      if (!previousWorkshopData || Object.keys(previousWorkshopData).length === 0) {
        blockages.push({
          id: `workflow-blocked-${Date.now()}`,
          type: BlockageType.WORKFLOW_STUCK,
          severity: BlockageSeverity.HIGH,
          title: `Atelier ${workshop - 1} incomplet`,
          description: `Vous devez terminer l'atelier ${workshop - 1} avant de progresser.`,
          workshop: workshop,
          detectedAt: new Date(),
          context: { currentData: workshopData, userActions: [], timeSpent: 0, lastActivity: new Date() },
          indicators: ['Atelier précédent incomplet', 'Progression séquentielle requise'],
          confidence: 100
        });
      }
    }

    return blockages;
  }

  private detectUserInactivity(
    missionId: string,
    userContext: any
  ): BlockageDetection[] {
    const blockages: BlockageDetection[] = [];

    if (userContext.lastActivity) {
      const timeSinceLastActivity = Date.now() - new Date(userContext.lastActivity).getTime();
      const minutesInactive = timeSinceLastActivity / (1000 * 60);

      if (minutesInactive > 30) { // Plus de 30 minutes d'inactivité
        blockages.push({
          id: `inactivity-${Date.now()}`,
          type: BlockageType.USER_INACTIVITY,
          severity: BlockageSeverity.LOW,
          title: 'Inactivité prolongée détectée',
          description: `Aucune activité depuis ${Math.round(minutesInactive)} minutes. Besoin d'aide ?`,
          workshop: userContext.currentWorkshop || 1,
          detectedAt: new Date(),
          context: { currentData: {}, userActions: [], timeSpent: minutesInactive * 60 * 1000, lastActivity: new Date(userContext.lastActivity) },
          indicators: ['Inactivité prolongée', 'Possible confusion ou blocage'],
          confidence: 70
        });
      }
    }

    return blockages;
  }

  // 🎯 GÉNÉRATION DE SOLUTIONS

  private async generateSolutions(
    blockages: BlockageDetection[],
    _globalContext: any
  ): Promise<BlockageSolution[]> {
    const solutions: BlockageSolution[] = [];

    for (const blockage of blockages) {
      switch (blockage.type) {
        case BlockageType.DATA_MISSING:
          solutions.push(...this.generateDataMissingSolutions(blockage, globalContext));
          break;
        case BlockageType.INCONSISTENT_DATA:
          solutions.push(...this.generateInconsistencySolutions(blockage, globalContext));
          break;
        case BlockageType.MISSING_LINKS:
          solutions.push(...this.generateMissingLinksSolutions(blockage, globalContext));
          break;
        case BlockageType.WORKFLOW_STUCK:
          solutions.push(...this.generateWorkflowSolutions(blockage, globalContext));
          break;
        case BlockageType.USER_INACTIVITY:
          solutions.push(...this.generateInactivitySolutions(blockage, globalContext));
          break;
      }
    }

    return solutions;
  }

  private generateDataMissingSolutions(
    blockage: BlockageDetection,
    _globalContext: any
  ): BlockageSolution[] {
    const solutions: BlockageSolution[] = [];

    if (blockage.title.includes('valeur métier')) {
      solutions.push({
        id: `solution-${blockage.id}`,
        blockageId: blockage.id,
        title: 'Ajouter des valeurs métier',
        description: 'Créez vos premières valeurs métier avec l\'assistant IA.',
        steps: [
          'Cliquez sur "Ajouter une valeur métier"',
          'Utilisez les suggestions IA basées sur votre secteur',
          'Définissez au moins 3 valeurs métier principales',
          'Vérifiez la cohérence avec votre organisation'
        ],
        estimatedTime: '10-15 minutes',
        difficulty: 'easy',
        automated: false,
        actionType: 'guide',
        actionData: { targetModal: 'addBusinessValue' }
      });
    }

    if (blockage.title.includes('actif support')) {
      solutions.push({
        id: `solution-${blockage.id}`,
        blockageId: blockage.id,
        title: 'Créer des actifs supports',
        description: 'Identifiez les actifs qui supportent vos valeurs métier.',
        steps: [
          'Sélectionnez une valeur métier existante',
          'Cliquez sur "Ajouter un actif support"',
          'Choisissez le type d\'actif approprié',
          'Décrivez l\'actif et son rôle'
        ],
        estimatedTime: '5-10 minutes',
        difficulty: 'easy',
        automated: false,
        actionType: 'guide',
        actionData: { targetModal: 'addSupportingAsset' }
      });
    }

    return solutions;
  }

  private generateInconsistencySolutions(
    blockage: BlockageDetection,
    _globalContext: any
  ): BlockageSolution[] {
    return [{
      id: `solution-${blockage.id}`,
      blockageId: blockage.id,
      title: 'Corriger les incohérences',
      description: 'Liez les actifs supports aux valeurs métier appropriées.',
      steps: [
        'Identifiez les actifs non liés',
        'Sélectionnez la valeur métier correspondante',
        'Modifiez l\'actif pour établir le lien',
        'Vérifiez la cohérence globale'
      ],
      estimatedTime: '5 minutes',
      difficulty: 'easy',
      automated: true,
      actionType: 'fix',
      actionData: { autoFix: 'linkOrphanAssets' }
    }];
  }

  private generateMissingLinksSolutions(
    blockage: BlockageDetection,
    _globalContext: any
  ): BlockageSolution[] {
    return [{
      id: `solution-${blockage.id}`,
      blockageId: blockage.id,
      title: 'Créer les événements redoutés',
      description: 'Définissez les événements redoutés pour chaque valeur métier.',
      steps: [
        'Sélectionnez une valeur métier',
        'Cliquez sur "Ajouter un événement redouté"',
        'Décrivez l\'événement qui pourrait affecter cette valeur',
        'Répétez pour toutes les valeurs métier'
      ],
      estimatedTime: '10-15 minutes',
      difficulty: 'medium',
      automated: false,
      actionType: 'guide',
      actionData: { targetModal: 'addDreadedEvent' }
    }];
  }

  private generateWorkflowSolutions(
    blockage: BlockageDetection,
    _globalContext: any
  ): BlockageSolution[] {
    return [{
      id: `solution-${blockage.id}`,
      blockageId: blockage.id,
      title: 'Retourner à l\'atelier précédent',
      description: 'Terminez l\'atelier précédent avant de continuer.',
      steps: [
        'Cliquez sur le lien vers l\'atelier précédent',
        'Complétez les éléments manquants',
        'Validez la conformité ANSSI',
        'Revenez à l\'atelier actuel'
      ],
      estimatedTime: '15-30 minutes',
      difficulty: 'medium',
      automated: false,
      actionType: 'redirect',
      actionData: { targetWorkshop: blockage.workshop - 1 }
    }];
  }

  private generateInactivitySolutions(
    blockage: BlockageDetection,
    _globalContext: any
  ): BlockageSolution[] {
    return [{
      id: `solution-${blockage.id}`,
      blockageId: blockage.id,
      title: 'Reprendre l\'activité',
      description: 'Continuez votre progression avec l\'aide de l\'assistant.',
      steps: [
        'Consultez le guide de l\'atelier',
        'Utilisez les suggestions IA',
        'Demandez de l\'aide si nécessaire',
        'Continuez étape par étape'
      ],
      estimatedTime: '5 minutes',
      difficulty: 'easy',
      automated: false,
      actionType: 'guide',
      actionData: { showHelp: true }
    }];
  }

  // 🎯 MÉTHODES UTILITAIRES

  private determineOverallStatus(blockages: BlockageDetection[]): 'healthy' | 'warning' | 'blocked' | 'critical' {
    if (blockages.length === 0) return 'healthy';
    
    const hasCritical = blockages.some(b => b.severity === BlockageSeverity.CRITICAL);
    if (hasCritical) return 'critical';
    
    const hasHigh = blockages.some(b => b.severity === BlockageSeverity.HIGH);
    if (hasHigh) return 'blocked';
    
    return 'warning';
  }

  private generateRecommendations(blockages: BlockageDetection[], _globalContext: any): string[] {
    const recommendations: string[] = [];
    
    if (blockages.some(b => b.type === BlockageType.DATA_MISSING)) {
      recommendations.push('Complétez les données manquantes pour débloquer la progression');
    }
    
    if (blockages.some(b => b.type === BlockageType.INCONSISTENT_DATA)) {
      recommendations.push('Vérifiez la cohérence entre les éléments créés');
    }
    
    if (blockages.some(b => b.type === BlockageType.WORKFLOW_STUCK)) {
      recommendations.push('Respectez l\'ordre séquentiel des ateliers EBIOS RM');
    }
    
    return recommendations;
  }

  private generateNextActions(blockages: BlockageDetection[], solutions: BlockageSolution[]): string[] {
    const actions: string[] = [];
    
    // Prioriser les actions par sévérité
    const sortedBlockages = blockages.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
    
    sortedBlockages.slice(0, 3).forEach(blockage => {
      const solution = solutions.find(s => s.blockageId === blockage.id);
      if (solution) {
        actions.push(solution.title);
      }
    });
    
    return actions;
  }

  private saveDetectionHistory(missionId: string, blockages: BlockageDetection[]): void {
    const existing = this.detectionHistory.get(missionId) || [];
    this.detectionHistory.set(missionId, [...existing, ...blockages]);
  }

  private createEmptyAnalysis(): BlockageAnalysis {
    return {
      blockages: [],
      solutions: [],
      overallStatus: 'healthy',
      recommendations: [],
      nextActions: []
    };
  }
}

export default BlockageDetectionService;
export { BlockageDetectionService, type BlockageAnalysis, type BlockageDetection, type BlockageSolution };
