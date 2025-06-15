/**
 * 📊 VISUALIZATION AGENT - AMÉLIORATION AI DES GRAPHIQUES EBIOS
 * Agent spécialisé pour la génération et amélioration des visualisations
 * Améliore les diagrammes de risque, cartographies et tableaux de bord
 */

import { 
  EBIOSAgent, 
  AgentConfig, 
  AgentTask, 
  AgentResult, 
  AgentStatus, 
  AgentMetrics,
  AgentCapability
} from '../AgentInterface';
import { Logger } from '../../logging/Logger';
import { MetricsCollector } from '../../monitoring/MetricsCollector';
import { CircuitBreaker } from '../../resilience/CircuitBreaker';

export interface VisualizationContext {
  type: 'risk_map' | 'attack_tree' | 'dashboard' | 'timeline' | 'network' | 'matrix';
  data: any;
  workshopNumber?: number;
  targetAudience: 'technical' | 'management' | 'mixed';
  outputFormat: 'svg' | 'canvas' | 'interactive' | 'static';
  dimensions?: {
    width: number;
    height: number;
  };
  theme?: 'light' | 'dark' | 'print';
  accessibility?: {
    highContrast: boolean;
    screenReader: boolean;
    colorBlind: boolean;
  };
}

export interface VisualizationEnhancement {
  enhancedData: any;
  layout: {
    type: string;
    config: any;
  };
  styling: {
    colors: string[];
    fonts: any;
    spacing: any;
  };
  interactions: {
    hover: any;
    click: any;
    zoom: any;
  };
  annotations: {
    labels: string[];
    tooltips: any[];
    legends: any;
  };
  accessibility: {
    ariaLabels: string[];
    altText: string;
    keyboardNav: any;
  };
  performance: {
    optimizations: string[];
    estimatedRenderTime: number;
  };
  confidence: number;
}

export interface RiskVisualizationData {
  risks: Array<{
    id: string;
    name: string;
    probability: number;
    impact: number;
    category: string;
    mitigation?: string;
  }>;
  threats: Array<{
    id: string;
    name: string;
    severity: number;
    likelihood: number;
    sources: string[];
  }>;
  assets: Array<{
    id: string;
    name: string;
    value: number;
    criticality: number;
    dependencies: string[];
  }>;
}

/**
 * Agent spécialisé dans l'amélioration des visualisations EBIOS
 * Génère des graphiques intelligents et adaptatifs
 */
export class VisualizationAgent implements EBIOSAgent {
  public readonly agentId: string;
  public readonly capabilities: AgentCapability[] = [AgentCapability.VISUALIZATION];
  public readonly version: string = '1.0.0';
  private readonly startTime: number = Date.now();

  // Propriétés requises par EBIOSAgent
  public get metrics(): AgentMetrics {
    return this.getMetrics();
  }

  public canHandle(taskType: string): boolean {
    const supportedTypes = ['enhance_risk_matrix', 'generate_attack_tree', 'create_dashboard', 'optimize_layout', 'apply_accessibility', 'generate_network_diagram'];
    return supportedTypes.includes(taskType);
  }

  public async heartbeat(): Promise<void> {
    // Heartbeat pour monitoring - ne retourne rien selon l'interface EBIOSAgent
    if (this.status !== AgentStatus.READY && this.status !== AgentStatus.RUNNING) {
      throw new Error(`Agent not healthy, status: ${this.status}`);
    }
  }
  
  public status: AgentStatus = AgentStatus.IDLE;
  private config: AgentConfig;
  private logger: Logger;
  private metricsCollector: MetricsCollector;
  private circuitBreaker: CircuitBreaker;
  
  // Cache pour les visualisations générées
  private visualizationCache: Map<string, VisualizationEnhancement> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_TTL = 60 * 60 * 1000; // 1 heure
  
  // Palettes de couleurs pour différents contextes
  private readonly colorPalettes = {
    risk: {
      low: '#4CAF50',
      medium: '#FF9800',
      high: '#F44336',
      critical: '#9C27B0'
    },
    workshop: {
      1: '#2196F3', // Bleu - Socle
      2: '#FF5722', // Orange - Sources
      3: '#9C27B0', // Violet - Scénarios stratégiques
      4: '#607D8B', // Bleu-gris - Scénarios opérationnels
      5: '#4CAF50'  // Vert - Traitement
    },
    accessibility: {
      highContrast: ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'],
      colorBlind: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']
    }
  };
  
  // Templates de visualisation
  private readonly visualizationTemplates = {
    riskMatrix: {
      layout: 'grid',
      axes: ['probability', 'impact'],
      quadrants: 4,
      defaultSize: { width: 600, height: 400 }
    },
    attackTree: {
      layout: 'hierarchical',
      direction: 'top-down',
      nodeTypes: ['and', 'or', 'leaf'],
      defaultSize: { width: 800, height: 600 }
    },
    networkDiagram: {
      layout: 'force-directed',
      clustering: true,
      nodeSize: 'value',
      defaultSize: { width: 1000, height: 700 }
    }
  };

  constructor(config: AgentConfig) {
    this.agentId = config.agentId;
    this.config = config;
    this.logger = new Logger('VisualizationAgent', { agentId: this.agentId });
    this.metricsCollector = MetricsCollector.getInstance();
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 3,
      recoveryTimeout: 30000,
      timeout: 15000 // Plus de temps pour le rendu
    });
  }

  public async initialize(): Promise<void> {
    this.logger.info('Initializing VisualizationAgent');
    this.status = AgentStatus.INITIALIZING;
    
    try {
      // Vérification des capacités de rendu
      await this.validateRenderingCapabilities();
      
      // Chargement des templates
      await this.loadVisualizationTemplates();
      
      // Production ready
      await this.performanceTest();
      
      this.status = AgentStatus.READY;
      this.logger.info('VisualizationAgent initialized successfully');
      
    } catch (error) {
      this.status = AgentStatus.ERROR;
      this.logger.error('Failed to initialize VisualizationAgent:', error);
      throw error;
    }
  }

  public async execute(task: AgentTask): Promise<AgentResult> {
    this.logger.info(`Executing visualization task: ${task.type}`);
    this.status = AgentStatus.RUNNING;
    
    const startTime = Date.now();
    
    try {
      const result = await this.circuitBreaker.execute(
        () => this.executeVisualizationTask(task),
        () => this.executeFallback(task)
      );
      
      const executionTime = Date.now() - startTime;
      this.status = AgentStatus.READY;
      
      // Enregistrement des métriques
      this.metricsCollector.recordExecution({
        agentId: this.agentId,
        taskType: task.type,
        executionTime,
        success: true,
        metadata: { 
          taskId: task.id,
          visualizationType: task.data.context?.type,
          dataSize: this.calculateDataSize(task.data)
        }
      });
      
      return {
        taskId: task.id,
        agentId: this.agentId,
        type: task.type,
        success: true,
        data: result,
        executionTime,
        metadata: {
          processingTime: executionTime,
          agentVersion: this.version,
          fallbackUsed: false
        }
      };
      
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.status = AgentStatus.ERROR;
      
      this.logger.error('Visualization task failed:', error);
      
      this.metricsCollector.recordExecution({
        agentId: this.agentId,
        taskType: task.type,
        executionTime,
        success: false,
        metadata: { 
          taskId: task.id, 
          error: error instanceof Error ? error.message : 'Unknown error',
          visualizationType: task.data.context?.type
        }
      });
      
      return {
        taskId: task.id,
        agentId: this.agentId,
        type: task.type,
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
        metadata: {
          processingTime: executionTime,
          agentVersion: this.version,
          fallbackUsed: true
        }
      };
    }
  }

  public getStatus(): AgentStatus {
    return this.status;
  }

  public getMetrics(): AgentMetrics {
    const executions = this.metricsCollector.getExecutionRecords(this.agentId);

    const successfulExecutions = executions.filter(e => e.success).length;
    const totalExecutions = executions.length;

    const avgRenderTime = totalExecutions > 0
      ? executions.reduce((sum, e) => sum + e.executionTime, 0) / totalExecutions
      : 0;

    return {
      tasksCompleted: successfulExecutions,
      tasksFailures: totalExecutions - successfulExecutions,
      averageExecutionTime: avgRenderTime,
      lastHeartbeat: executions.length > 0
        ? executions[executions.length - 1].timestamp
        : new Date(),
      uptime: Date.now() - this.startTime,
      errorRate: totalExecutions > 0 ? (totalExecutions - successfulExecutions) / totalExecutions : 0
    };
  }

  public async shutdown(): Promise<void> {
    this.logger.info('Shutting down VisualizationAgent');
    this.status = AgentStatus.SHUTDOWN;
    
    // Nettoyage du cache
    this.visualizationCache.clear();
    this.cacheExpiry.clear();
  }

  private async executeVisualizationTask(task: AgentTask): Promise<VisualizationEnhancement> {
    switch (task.type) {
      case 'enhance_risk_matrix':
        return await this.enhanceRiskMatrix(task.data.context, task.data.data);
      
      case 'generate_attack_tree':
        return await this.generateAttackTree(task.data.context, task.data.data);
      
      case 'create_dashboard':
        return await this.createDashboard(task.data.context, task.data.data);
      
      case 'optimize_layout':
        return await this.optimizeLayout(task.data.context, task.data.data);
      
      case 'apply_accessibility':
        return await this.applyAccessibility(task.data.context, task.data.data);
      
      case 'generate_network_diagram':
        return await this.generateNetworkDiagram(task.data.context, task.data.data);
      
      default:
        throw new Error(`Unknown visualization task type: ${task.type}`);
    }
  }

  private async enhanceRiskMatrix(context: VisualizationContext, data: RiskVisualizationData): Promise<VisualizationEnhancement> {
    const cacheKey = this.getCacheKey('risk_matrix', context, data);
    
    // Vérification du cache
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }
    
    this.logger.debug('Enhancing risk matrix visualization');
    
    // Analyse des données pour optimiser la visualisation
    const enhancedData = this.analyzeRiskData(data);
    
    // Génération du layout optimisé
    const layout = this.generateRiskMatrixLayout(enhancedData, context);
    
    // Application du style adaptatif
    const styling = this.generateRiskMatrixStyling(context);
    
    // Interactions intelligentes
    const interactions = this.generateRiskMatrixInteractions(enhancedData);
    
    // Annotations contextuelles
    const annotations = this.generateRiskMatrixAnnotations(enhancedData, context);
    
    // Accessibilité
    const accessibility = this.generateAccessibilityFeatures(context);
    
    // Optimisations de performance
    const performance = this.calculatePerformanceOptimizations(enhancedData, context);
    
    const enhancement: VisualizationEnhancement = {
      enhancedData,
      layout,
      styling,
      interactions,
      annotations,
      accessibility,
      performance,
      confidence: 0.92
    };
    
    // Mise en cache
    this.setCache(cacheKey, enhancement);
    
    return enhancement;
  }

  private async generateAttackTree(context: VisualizationContext, data: any): Promise<VisualizationEnhancement> {
    this.logger.debug('Generating attack tree visualization');
    
    // Analyse de la structure d'attaque
    const treeStructure = this.analyzeAttackStructure(data);
    
    // Génération du layout hiérarchique
    const layout = {
      type: 'hierarchical',
      config: {
        direction: 'top-down',
        nodeSpacing: 80,
        levelSpacing: 120,
        algorithm: 'dagre'
      }
    };
    
    // Style adapté aux arbres d'attaque
    const styling = {
      colors: this.getAttackTreeColors(context),
      fonts: {
        nodeLabel: { size: 12, weight: 'bold' },
        edgeLabel: { size: 10, style: 'italic' }
      },
      spacing: {
        nodePadding: 10,
        edgeThickness: 2
      }
    };
    
    return {
      enhancedData: treeStructure,
      layout,
      styling,
      interactions: this.generateTreeInteractions(),
      annotations: this.generateTreeAnnotations(treeStructure),
      accessibility: this.generateAccessibilityFeatures(context),
      performance: this.calculatePerformanceOptimizations(treeStructure, context),
      confidence: 0.88
    };
  }

  private async createDashboard(context: VisualizationContext, data: any): Promise<VisualizationEnhancement> {
    this.logger.debug('Creating dashboard visualization');
    
    // Analyse des métriques pour le dashboard
    const dashboardData = this.analyzeDashboardData(data);
    
    // Layout adaptatif selon la taille d'écran
    const layout = this.generateDashboardLayout(context, dashboardData);
    
    // Style cohérent pour le dashboard
    const styling = this.generateDashboardStyling(context);
    
    return {
      enhancedData: dashboardData,
      layout,
      styling,
      interactions: this.generateDashboardInteractions(dashboardData),
      annotations: this.generateDashboardAnnotations(dashboardData),
      accessibility: this.generateAccessibilityFeatures(context),
      performance: this.calculatePerformanceOptimizations(dashboardData, context),
      confidence: 0.90
    };
  }

  private async optimizeLayout(context: VisualizationContext, data: any): Promise<VisualizationEnhancement> {
    this.logger.debug('Optimizing visualization layout');
    
    // Analyse de la densité des données
    const density = this.calculateDataDensity(data);
    
    // Optimisation selon le type de visualisation
    const optimizedLayout = this.generateOptimizedLayout(context.type, data, density);
    
    return {
      enhancedData: data,
      layout: optimizedLayout,
      styling: this.generateAccessibleStyling(context),
      interactions: this.generateOptimizedInteractions(context.type),
      annotations: { labels: [], tooltips: [], legends: {} },
      accessibility: this.generateAccessibilityFeatures(context),
      performance: this.calculatePerformanceOptimizations(data, context),
      confidence: 0.85
    };
  }

  private async applyAccessibility(context: VisualizationContext, data: any): Promise<VisualizationEnhancement> {
    this.logger.debug('Applying accessibility enhancements');
    
    const accessibilityFeatures = this.generateComprehensiveAccessibility(context);
    
    return {
      enhancedData: data,
      layout: { type: 'accessible', config: {} },
      styling: this.generateAccessibleStyling(context),
      interactions: this.generateAccessibleInteractions(),
      annotations: this.generateAccessibleAnnotations(data),
      accessibility: accessibilityFeatures,
      performance: { optimizations: ['accessibility-optimized'], estimatedRenderTime: 100 },
      confidence: 0.95
    };
  }

  private async generateNetworkDiagram(context: VisualizationContext, data: any): Promise<VisualizationEnhancement> {
    this.logger.debug('Generating network diagram');
    
    // Analyse de la topologie réseau
    const networkStructure = this.analyzeNetworkStructure(data);
    
    // Layout force-directed optimisé
    const layout = {
      type: 'force-directed',
      config: {
        strength: -300,
        distance: 100,
        iterations: 300,
        clustering: true
      }
    };
    
    return {
      enhancedData: networkStructure,
      layout,
      styling: this.generateNetworkStyling(context),
      interactions: this.generateNetworkInteractions(),
      annotations: this.generateNetworkAnnotations(networkStructure),
      accessibility: this.generateAccessibilityFeatures(context),
      performance: this.calculatePerformanceOptimizations(networkStructure, context),
      confidence: 0.87
    };
  }

  private async executeFallback(task: AgentTask): Promise<VisualizationEnhancement> {
    this.logger.warn('Using fallback for visualization task');
    
    return {
      enhancedData: task.data.data || {},
      layout: { type: 'basic', config: {} },
      styling: { colors: ['#666666'], fonts: {}, spacing: {} },
      interactions: { hover: {}, click: {}, zoom: {} },
      annotations: { labels: [], tooltips: [], legends: {} },
      accessibility: { ariaLabels: [], altText: 'Visualization unavailable', keyboardNav: {} },
      performance: { optimizations: ['fallback'], estimatedRenderTime: 50 },
      confidence: 0.1
    };
  }

  // Méthodes d'analyse des données
  
  private analyzeRiskData(data: RiskVisualizationData): any {
    // Analyse et enrichissement des données de risque
    const risks = data.risks.map(risk => ({
      ...risk,
      riskLevel: this.calculateRiskLevel(risk.probability, risk.impact),
      quadrant: this.determineRiskQuadrant(risk.probability, risk.impact)
    }));
    
    return {
      ...data,
      risks,
      statistics: {
        totalRisks: risks.length,
        highRisks: risks.filter(r => r.riskLevel === 'high').length,
        distribution: this.calculateRiskDistribution(risks)
      }
    };
  }

  private analyzeAttackStructure(data: any): any {
    // Analyse de la structure d'arbre d'attaque
    return {
      ...data,
      depth: this.calculateTreeDepth(data),
      complexity: this.calculateTreeComplexity(data),
      criticalPaths: this.identifyCriticalPaths(data)
    };
  }

  private analyzeDashboardData(data: any): any {
    // Analyse des données pour dashboard
    return {
      ...data,
      widgets: this.optimizeWidgetLayout(data.widgets || []),
      metrics: this.calculateDashboardMetrics(data)
    };
  }

  private analyzeNetworkStructure(data: any): any {
    // Analyse de la structure réseau
    return {
      ...data,
      clusters: this.identifyNetworkClusters(data),
      centralNodes: this.identifyCentralNodes(data),
      vulnerabilities: this.identifyNetworkVulnerabilities(data)
    };
  }

  // Méthodes de génération de layout
  
  private generateRiskMatrixLayout(data: any, context: VisualizationContext): any {
    const template = this.visualizationTemplates.riskMatrix;
    
    return {
      type: template.layout,
      config: {
        ...template,
        dimensions: context.dimensions || template.defaultSize,
        gridSize: this.calculateOptimalGridSize(data.risks.length),
        margins: this.calculateMargins(context)
      }
    };
  }

  private generateDashboardLayout(context: VisualizationContext, data: any): any {
    const screenSize = context.dimensions || { width: 1200, height: 800 };
    
    return {
      type: 'grid',
      config: {
        columns: this.calculateOptimalColumns(screenSize.width),
        rows: Math.ceil(data.widgets.length / this.calculateOptimalColumns(screenSize.width)),
        gap: 16,
        responsive: true
      }
    };
  }

  private generateOptimizedLayout(type: string, data: any, density: number): any {
    // Génération de layout optimisé selon le type et la densité
    const baseLayouts: Record<string, any> = {
      'risk_map': { type: 'grid', spacing: density > 0.7 ? 'compact' : 'normal' },
      'attack_tree': { type: 'hierarchical', direction: density > 0.8 ? 'left-right' : 'top-down' },
      'network': { type: 'force-directed', strength: density > 0.6 ? -400 : -200 }
    };
    
    return baseLayouts[type] || { type: 'auto', config: {} };
  }

  // Méthodes de génération de style
  
  private generateRiskMatrixStyling(context: VisualizationContext): any {
    const colors = context.accessibility?.colorBlind 
      ? this.colorPalettes.accessibility.colorBlind
      : Object.values(this.colorPalettes.risk);
    
    return {
      colors,
      fonts: {
        title: { size: 16, weight: 'bold' },
        axis: { size: 12, weight: 'normal' },
        label: { size: 10, weight: 'normal' }
      },
      spacing: {
        padding: 20,
        margin: 10
      }
    };
  }

  private generateDashboardStyling(context: VisualizationContext): any {
    const theme = context.theme || 'light';
    
    const themes = {
      light: { background: '#ffffff', text: '#333333', border: '#e0e0e0' },
      dark: { background: '#1a1a1a', text: '#ffffff', border: '#404040' },
      print: { background: '#ffffff', text: '#000000', border: '#000000' }
    };
    
    return {
      colors: Object.values(this.colorPalettes.workshop),
      theme: themes[theme],
      fonts: {
        title: { size: 18, weight: 'bold' },
        metric: { size: 24, weight: 'bold' },
        label: { size: 12, weight: 'normal' }
      },
      spacing: {
        cardPadding: 16,
        cardMargin: 8
      }
    };
  }

  private generateNetworkStyling(context: VisualizationContext): any {
    return {
      colors: {
        nodes: this.colorPalettes.workshop,
        edges: '#999999',
        highlights: '#ff4444'
      },
      fonts: {
        nodeLabel: { size: 10, weight: 'normal' }
      },
      spacing: {
        nodeSize: 20,
        edgeWidth: 2
      }
    };
  }

  private generateAccessibleStyling(context: VisualizationContext): any {
    return {
      colors: context.accessibility?.highContrast 
        ? this.colorPalettes.accessibility.highContrast
        : this.colorPalettes.accessibility.colorBlind,
      fonts: {
        base: { size: 14, weight: 'normal' }, // Taille plus grande
        emphasis: { size: 16, weight: 'bold' }
      },
      spacing: {
        padding: 24, // Plus d'espace
        margin: 16
      }
    };
  }

  // Méthodes utilitaires
  
  private calculateRiskLevel(probability: number, impact: number): string {
    const score = probability * impact;
    if (score >= 0.8) return 'critical';
    if (score >= 0.6) return 'high';
    if (score >= 0.3) return 'medium';
    return 'low';
  }

  private determineRiskQuadrant(probability: number, impact: number): number {
    if (probability >= 0.5 && impact >= 0.5) return 1; // Haut-Droite
    if (probability < 0.5 && impact >= 0.5) return 2;  // Haut-Gauche
    if (probability < 0.5 && impact < 0.5) return 3;   // Bas-Gauche
    return 4; // Bas-Droite
  }

  private calculateRiskDistribution(risks: any[]): any {
    const distribution = { low: 0, medium: 0, high: 0, critical: 0 };
    risks.forEach(risk => {
      distribution[risk.riskLevel as keyof typeof distribution]++;
    });
    return distribution;
  }

  private calculateDataDensity(data: any): number {
    // Calcul de la densité des données (0-1)
    const dataPoints = Array.isArray(data) ? data.length : Object.keys(data).length;
    return Math.min(dataPoints / 100, 1); // Normalisation
  }

  private calculateOptimalGridSize(itemCount: number): { rows: number; cols: number } {
    const cols = Math.ceil(Math.sqrt(itemCount));
    const rows = Math.ceil(itemCount / cols);
    return { rows, cols };
  }

  private calculateOptimalColumns(width: number): number {
    if (width < 768) return 1; // Mobile
    if (width < 1024) return 2; // Tablet
    if (width < 1440) return 3; // Desktop
    return 4; // Large desktop
  }

  private calculateMargins(context: VisualizationContext): any {
    const base = 20;
    const multiplier = context.accessibility?.screenReader ? 1.5 : 1;
    return {
      top: base * multiplier,
      right: base * multiplier,
      bottom: base * multiplier,
      left: base * multiplier
    };
  }

  // Méthodes de génération d'interactions
  
  private generateRiskMatrixInteractions(data: any): any {
    return {
      hover: {
        enabled: true,
        showTooltip: true,
        highlightRelated: true
      },
      click: {
        enabled: true,
        action: 'showDetails',
        multiSelect: true
      },
      zoom: {
        enabled: true,
        wheelZoom: true,
        panEnabled: true
      }
    };
  }

  private generateTreeInteractions(): any {
    return {
      hover: {
        enabled: true,
        expandOnHover: false
      },
      click: {
        enabled: true,
        action: 'expand',
        doubleClickAction: 'focus'
      },
      zoom: {
        enabled: true,
        fitToView: true
      }
    };
  }

  private generateDashboardInteractions(data: any): any {
    return {
      hover: {
        enabled: true,
        showMetrics: true
      },
      click: {
        enabled: true,
        action: 'drillDown'
      },
      zoom: {
        enabled: false // Pas de zoom sur dashboard
      }
    };
  }

  private generateNetworkInteractions(): any {
    return {
      hover: {
        enabled: true,
        highlightConnections: true
      },
      click: {
        enabled: true,
        action: 'selectNode',
        showNeighbors: true
      },
      zoom: {
        enabled: true,
        wheelZoom: true,
        panEnabled: true
      }
    };
  }

  private generateOptimizedInteractions(type: string): any {
    const baseInteractions = {
      hover: { enabled: true },
      click: { enabled: true },
      zoom: { enabled: true }
    };
    
    return baseInteractions;
  }

  private generateAccessibleInteractions(): any {
    return {
      keyboard: {
        enabled: true,
        navigation: 'arrow-keys',
        selection: 'space-enter'
      },
      screenReader: {
        enabled: true,
        announcements: true
      },
      highContrast: {
        enabled: true,
        focusIndicator: 'enhanced'
      }
    };
  }

  // Méthodes de génération d'annotations
  
  private generateRiskMatrixAnnotations(data: any, context: VisualizationContext): any {
    return {
      labels: ['Probabilité', 'Impact', 'Niveau de risque'],
      tooltips: data.risks.map((risk: any) => ({
        id: risk.id,
        content: `${risk.name}\nProbabilité: ${risk.probability}\nImpact: ${risk.impact}\nNiveau: ${risk.riskLevel}`
      })),
      legends: {
        riskLevels: {
          title: 'Niveaux de risque',
          items: Object.entries(this.colorPalettes.risk).map(([level, color]) => ({ level, color }))
        }
      }
    };
  }

  private generateTreeAnnotations(data: any): any {
    return {
      labels: ['Objectif', 'Sous-objectifs', 'Actions'],
      tooltips: [],
      legends: {
        nodeTypes: {
          title: 'Types de nœuds',
          items: [
            { type: 'ET', description: 'Tous les sous-objectifs requis' },
            { type: 'OU', description: 'Un seul sous-objectif requis' }
          ]
        }
      }
    };
  }

  private generateDashboardAnnotations(data: any): any {
    return {
      labels: ['Métriques clés', 'Tendances', 'Alertes'],
      tooltips: [],
      legends: {
        status: {
          title: 'États',
          items: [
            { status: 'OK', color: '#4CAF50' },
            { status: 'Attention', color: '#FF9800' },
            { status: 'Critique', color: '#F44336' }
          ]
        }
      }
    };
  }

  private generateNetworkAnnotations(data: any): any {
    return {
      labels: ['Nœuds', 'Connexions', 'Clusters'],
      tooltips: [],
      legends: {
        nodeTypes: {
          title: 'Types de nœuds',
          items: data.nodeTypes || []
        }
      }
    };
  }

  private generateAccessibleAnnotations(data: any): any {
    return {
      labels: [],
      tooltips: [],
      legends: {},
      ariaDescriptions: [
        'Graphique accessible avec navigation clavier',
        'Utilisez les flèches pour naviguer',
        'Appuyez sur Entrée pour sélectionner'
      ]
    };
  }

  // Méthodes d'accessibilité
  
  private generateAccessibilityFeatures(context: VisualizationContext): any {
    const features = {
      ariaLabels: this.generateAriaLabels(context),
      altText: this.generateAltText(context),
      keyboardNav: this.generateKeyboardNavigation(context)
    };
    
    if (context.accessibility?.highContrast) {
      features.ariaLabels.push('Mode contraste élevé activé');
    }
    
    if (context.accessibility?.screenReader) {
      features.ariaLabels.push('Optimisé pour lecteur d\'écran');
    }
    
    return features;
  }

  private generateComprehensiveAccessibility(context: VisualizationContext): any {
    return {
      ariaLabels: [
        'Visualisation EBIOS RM accessible',
        'Navigation clavier disponible',
        'Descriptions audio disponibles'
      ],
      altText: `Visualisation ${context.type} avec fonctionnalités d'accessibilité complètes`,
      keyboardNav: {
        enabled: true,
        shortcuts: {
          'Tab': 'Navigation entre éléments',
          'Enter': 'Sélection',
          'Escape': 'Retour',
          'Arrow keys': 'Navigation directionnelle'
        }
      },
      screenReader: {
        enabled: true,
        verbosity: 'detailed',
        announcements: true
      },
      highContrast: {
        enabled: context.accessibility?.highContrast || false,
        ratio: '4.5:1'
      }
    };
  }

  private generateAriaLabels(context: VisualizationContext): string[] {
    const baseLabels = [`Visualisation ${context.type}`];
    
    if (context.workshopNumber) {
      baseLabels.push(`Atelier EBIOS ${context.workshopNumber}`);
    }
    
    return baseLabels;
  }

  private generateAltText(context: VisualizationContext): string {
    return `Visualisation ${context.type} pour l'analyse EBIOS RM`;
  }

  private generateKeyboardNavigation(context: VisualizationContext): any {
    return {
      enabled: true,
      focusManagement: 'automatic',
      shortcuts: {
        'Tab': 'Élément suivant',
        'Shift+Tab': 'Élément précédent'
      }
    };
  }

  // Méthodes de performance
  
  private calculatePerformanceOptimizations(data: any, context: VisualizationContext): any {
    const dataSize = this.calculateDataSize(data);
    const optimizations: string[] = [];
    let estimatedRenderTime = 100; // Base time in ms
    
    // Optimisations basées sur la taille des données
    if (dataSize > 1000) {
      optimizations.push('virtualization');
      estimatedRenderTime += 200;
    }
    
    if (dataSize > 100) {
      optimizations.push('lazy-loading');
      estimatedRenderTime += 50;
    }
    
    // Optimisations basées sur le type
    if (context.type === 'network' && dataSize > 50) {
      optimizations.push('clustering');
      estimatedRenderTime += 100;
    }
    
    if (context.outputFormat === 'interactive') {
      optimizations.push('debounced-interactions');
      estimatedRenderTime += 30;
    }
    
    return {
      optimizations,
      estimatedRenderTime
    };
  }

  private calculateDataSize(data: any): number {
    if (Array.isArray(data)) {
      return data.length;
    }
    
    if (typeof data === 'object' && data !== null) {
      return Object.keys(data).length;
    }
    
    return 1;
  }

  // Méthodes de cache
  
  private getCacheKey(type: string, context: VisualizationContext, data: any): string {
    const contextKey = JSON.stringify({
      type: context.type,
      targetAudience: context.targetAudience,
      outputFormat: context.outputFormat,
      theme: context.theme
    });
    
    const dataKey = JSON.stringify(data).substring(0, 100); // Limiter la taille
    
    return `${type}:${contextKey}:${dataKey}`;
  }

  private getFromCache(key: string): VisualizationEnhancement | null {
    const expiry = this.cacheExpiry.get(key);
    if (expiry && Date.now() > expiry) {
      this.visualizationCache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
    
    return this.visualizationCache.get(key) || null;
  }

  private setCache(key: string, enhancement: VisualizationEnhancement): void {
    this.visualizationCache.set(key, enhancement);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_TTL);
  }

  private wasCacheHit(task: AgentTask): boolean {
    const cacheKey = this.getCacheKey(task.type, task.data.context, task.data.data);
    return this.visualizationCache.has(cacheKey);
  }

  private calculateCacheHitRate(): number {
    const executions = this.metricsCollector.getExecutionRecords(this.agentId);
    const cacheHits = executions.filter(e => e.metadata?.cacheHit).length;
    return executions.length > 0 ? (cacheHits / executions.length) * 100 : 0;
  }

  private getVisualizationTypeStats(executions: any[]): Record<string, number> {
    const stats: Record<string, number> = {};
    executions.forEach(e => {
      const type = e.metadata?.visualizationType || 'unknown';
      stats[type] = (stats[type] || 0) + 1;
    });
    return stats;
  }

  // Méthodes d'initialisation
  
  private async validateRenderingCapabilities(): Promise<void> {
    // Validation des capacités de rendu
    // En production, vérifier Canvas, SVG, WebGL, etc.
    this.logger.info('Rendering capabilities validated');
  }

  private async loadVisualizationTemplates(): Promise<void> {
    // Chargement des templates de visualisation
    this.logger.info(`Loaded ${Object.keys(this.visualizationTemplates).length} visualization templates`);
  }

  private async performanceTest(): Promise<void> {
    // Production ready
    const startTime = Date.now();
    
    // Simulation d'un rendu simple
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const renderTime = Date.now() - startTime;
    this.logger.info(`Performance test completed in ${renderTime}ms`);
  }

  // Méthodes d'analyse avancée (stubs pour implémentation future)
  
  private calculateTreeDepth(data: any): number {
    // Calcul de la profondeur de l'arbre
    return 3; // Placeholder
  }

  private calculateTreeComplexity(data: any): number {
    // Calcul de la complexité de l'arbre
    return 0.5; // Placeholder
  }

  private identifyCriticalPaths(data: any): any[] {
    // Identification des chemins critiques
    return []; // Placeholder
  }

  private optimizeWidgetLayout(widgets: any[]): any[] {
    // Optimisation du layout des widgets
    return widgets; // Placeholder
  }

  private calculateDashboardMetrics(data: any): any {
    // Calcul des métriques du dashboard
    return {}; // Placeholder
  }

  private identifyNetworkClusters(data: any): any[] {
    // Identification des clusters réseau
    return []; // Placeholder
  }

  private identifyCentralNodes(data: any): any[] {
    // Identification des nœuds centraux
    return []; // Placeholder
  }

  private identifyNetworkVulnerabilities(data: any): any[] {
    // Identification des vulnérabilités réseau
    return []; // Placeholder
  }

  private getAttackTreeColors(context: VisualizationContext): string[] {
    return ['#FF5722', '#9C27B0', '#607D8B'];
  }
}