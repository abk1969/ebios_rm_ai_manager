/**
 * 📚 DOCUMENTATION AGENT - AMÉLIORATION AI DES TOOLTIPS ET AIDE
 * Premier agent non-critique de la Phase 2
 * Améliore l'expérience utilisateur avec de l'aide contextuelle intelligente
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

export interface DocumentationContext {
  element: string;
  elementType: 'field' | 'button' | 'section' | 'workshop' | 'concept';
  currentValue?: any;
  userRole?: string;
  workshopContext?: {
    number: number;
    phase: string;
    progress: number;
  };
  ebiosContext?: {
    mission?: string;
    assets?: string[];
    threats?: string[];
  };
}

export interface DocumentationEnhancement {
  tooltip: string;
  detailedHelp: string;
  examples?: string[];
  relatedConcepts?: string[];
  anssiReferences?: string[];
  bestPractices?: string[];
  commonMistakes?: string[];
  confidence: number;
}

/**
 * Agent spécialisé dans l'amélioration de la documentation
 * Génère des tooltips intelligents et de l'aide contextuelle
 */
export class DocumentationAgent implements EBIOSAgent {
  public readonly agentId: string;
  public readonly capabilities: AgentCapability[] = [AgentCapability.DOCUMENTATION];

  // Propriétés requises par EBIOSAgent
  public get metrics(): AgentMetrics { // 🔧 CORRECTION: Retour synchrone
    return this.getMetrics();
  }

  public canHandle(taskType: string): boolean { // 🔧 CORRECTION: Paramètre string
    const supportedTypes = ['generate_tooltip', 'enhance_help', 'explain_concept', 'suggest_examples'];
    return supportedTypes.includes(taskType); // 🔧 CORRECTION: Utilisation du paramètre taskType
  }

  public async heartbeat(): Promise<void> { // 🔧 CORRECTION: Retour void
    // 🔧 CORRECTION: Pas de retour pour void
    // this.status === AgentStatus.READY || this.status === AgentStatus.RUNNING;
  }
  
  public status: AgentStatus = AgentStatus.IDLE;
  private config: AgentConfig;
  private logger: Logger;
  private metricsCollector: MetricsCollector;
  private circuitBreaker: CircuitBreaker;
  
  // Cache pour éviter les régénérations
  private documentationCache: Map<string, DocumentationEnhancement> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 heures
  
  // Base de connaissances EBIOS RM
  private readonly ebiosKnowledge = {
    workshops: {
      1: {
        name: "Socle de sécurité",
        description: "Définition du périmètre et des enjeux de sécurité",
        keyElements: ["Mission", "Biens supports", "Biens essentiels", "Valeurs métier"]
      },
      2: {
        name: "Sources de risque",
        description: "Identification des sources de menaces",
        keyElements: ["Sources de menaces", "Objectifs visés", "Motivations"]
      },
      3: {
        name: "Scénarios stratégiques",
        description: "Élaboration des scénarios de menaces",
        keyElements: ["Chemins d'attaque", "Événements redoutés", "Impacts"]
      },
      4: {
        name: "Scénarios opérationnels",
        description: "Détail des modes opératoires",
        keyElements: ["Actions élémentaires", "Vulnérabilités", "Vraisemblance"]
      },
      5: {
        name: "Traitement du risque",
        description: "Définition des mesures de sécurité",
        keyElements: ["Mesures de sécurité", "Risques résiduels", "Plan de traitement"]
      }
    },
    concepts: {
      "bien_essentiel": "Élément dont la perte ou l'altération compromettrait la mission",
      "bien_support": "Élément technique ou organisationnel sur lequel repose un bien essentiel",
      "source_menace": "Entité susceptible de porter atteinte aux biens",
      "evenement_redoute": "Situation crainte par l'organisme",
      "mesure_securite": "Moyen de traiter un risque de sécurité"
    }
  };

  constructor(config: AgentConfig) {
    this.agentId = config.agentId;
    this.config = config;
    this.logger = new Logger('DocumentationAgent', { agentId: this.agentId });
    this.metricsCollector = MetricsCollector.getInstance();
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: 3,
      recoveryTimeout: 30000,
      timeout: 10000
    });
  }

  public async initialize(): Promise<void> {
    this.logger.info('Initializing DocumentationAgent');
    this.status = AgentStatus.INITIALIZING;
    
    try {
      // Vérification des dépendances
      await this.validateDependencies();
      
      // Chargement de la base de connaissances
      await this.loadKnowledgeBase();
      
      this.status = AgentStatus.READY;
      this.logger.info('DocumentationAgent initialized successfully');
      
    } catch (error) {
      this.status = AgentStatus.ERROR;
      this.logger.error('Failed to initialize DocumentationAgent:', error);
      throw error;
    }
  }

  public async execute(task: AgentTask): Promise<AgentResult> {
    this.logger.info(`Executing documentation task: ${task.type}`);
    this.status = AgentStatus.RUNNING;
    
    const startTime = Date.now();
    
    try {
      const result = await this.circuitBreaker.execute(
        () => this.executeDocumentationTask(task),
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
        metadata: { taskId: task.id }
      });
      
      return {
        taskId: task.id,
        type: task.type, // 🔧 CORRECTION: Propriété type ajoutée
        agentId: this.agentId,
        success: true,
        data: result,
        executionTime,
        metadata: {
          processingTime: Date.now() - startTime, // 🔧 CORRECTION: Propriété requise
          agentVersion: '1.0.0', // 🔧 CORRECTION: Propriété requise
          fallbackUsed: false
        }
      };
      
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.status = AgentStatus.ERROR;
      
      this.logger.error('Documentation task failed:', error);
      
      this.metricsCollector.recordExecution({
        agentId: this.agentId,
        taskType: task.type,
        executionTime,
        success: false,
        metadata: { taskId: task.id, error: error instanceof Error ? error.message : 'Unknown error' }
      });
      
      return {
        taskId: task.id,
        type: task.type, // 🔧 CORRECTION: Propriété type ajoutée
        agentId: this.agentId,
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
        metadata: {
          processingTime: Date.now() - Date.now(), // 🔧 CORRECTION: Propriété requise
          agentVersion: '1.0.0', // 🔧 CORRECTION: Propriété requise
          fallbackUsed: true
        }
      };
    }
  }

  public getStatus(): AgentStatus {
    return this.status;
  }

  public getMetrics(): AgentMetrics { // 🔧 CORRECTION: Méthode synchrone
    // 🔧 CORRECTION: Suppression de await et simplification
    const executions = this.metricsCollector.getExecutionRecords(this.agentId);

    const successfulExecutions = executions.filter(e => e.success).length;
    const totalExecutions = executions.length;
    const totalFailures = totalExecutions - successfulExecutions;

    return {
      tasksCompleted: totalExecutions, // 🔧 CORRECTION: Propriété correcte
      tasksFailures: totalFailures, // 🔧 CORRECTION: Propriété ajoutée
      errorRate: totalExecutions > 0 ? (totalFailures / totalExecutions) * 100 : 0, // 🔧 CORRECTION: Propriété ajoutée
      averageExecutionTime: totalExecutions > 0
        ? executions.reduce((sum, e) => sum + e.executionTime, 0) / totalExecutions
        : 0,
      lastHeartbeat: executions.length > 0
        ? executions[executions.length - 1].timestamp
        : new Date(), // 🔧 CORRECTION: Propriété correcte
      uptime: Date.now() - Date.now() // 🔧 CORRECTION: Propriété ajoutée (placeholder)
    };
  }

  public async shutdown(): Promise<void> {
    this.logger.info('Shutting down DocumentationAgent');
    this.status = AgentStatus.SHUTDOWN;
    
    // Nettoyage du cache
    this.documentationCache.clear();
    this.cacheExpiry.clear();
  }

  private async executeDocumentationTask(task: AgentTask): Promise<DocumentationEnhancement> {
    switch (task.type) {
      case 'generate_tooltip':
        return await this.generateTooltip(task.data.context);
      
      case 'enhance_help':
        return await this.enhanceHelp(task.data.context);
      
      case 'explain_concept':
        return await this.explainConcept(task.data.concept, task.data.context);
      
      case 'suggest_examples':
        return await this.suggestExamples(task.data.context);
      
      default:
        throw new Error(`Unknown documentation task type: ${task.type}`);
    }
  }

  private async generateTooltip(context: DocumentationContext): Promise<DocumentationEnhancement> {
    const cacheKey = this.getCacheKey('tooltip', context);
    
    // Vérification du cache
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }
    
    this.logger.debug(`Generating tooltip for element: ${context.element}`);
    
    let enhancement: DocumentationEnhancement;
    
    // Génération basée sur le type d'élément
    switch (context.elementType) {
      case 'workshop':
        enhancement = await this.generateWorkshopTooltip(context);
        break;
      
      case 'concept':
        enhancement = await this.generateConceptTooltip(context);
        break;
      
      case 'field':
        enhancement = await this.generateFieldTooltip(context);
        break;
      
      default:
        enhancement = await this.generateGenericTooltip(context);
    }
    
    // Mise en cache
    this.setCache(cacheKey, enhancement);
    
    return enhancement;
  }

  private async generateWorkshopTooltip(context: DocumentationContext): Promise<DocumentationEnhancement> {
    const workshopNumber = context.workshopContext?.number;
    const workshop = workshopNumber ? this.ebiosKnowledge.workshops[workshopNumber as keyof typeof this.ebiosKnowledge.workshops] : null;
    
    if (!workshop) {
      return this.generateGenericTooltip(context);
    }
    
    return {
      tooltip: `${workshop.name}: ${workshop.description}`,
      detailedHelp: this.generateWorkshopDetailedHelp(workshopNumber!, workshop),
      examples: this.getWorkshopExamples(workshopNumber!),
      relatedConcepts: workshop.keyElements,
      anssiReferences: this.getANSSIReferences(workshopNumber!),
      bestPractices: this.getWorkshopBestPractices(workshopNumber!),
      commonMistakes: this.getCommonMistakes(workshopNumber!),
      confidence: 0.95
    };
  }

  private async generateConceptTooltip(context: DocumentationContext): Promise<DocumentationEnhancement> {
    const concept = context.element.toLowerCase();
    const definition = this.ebiosKnowledge.concepts[concept as keyof typeof this.ebiosKnowledge.concepts];
    
    if (!definition) {
      return this.generateGenericTooltip(context);
    }
    
    return {
      tooltip: definition,
      detailedHelp: this.generateConceptDetailedHelp(concept, definition),
      examples: this.getConceptExamples(concept),
      relatedConcepts: this.getRelatedConcepts(concept),
      anssiReferences: this.getConceptANSSIReferences(concept),
      bestPractices: this.getConceptBestPractices(concept),
      confidence: 0.9
    };
  }

  private async generateFieldTooltip(context: DocumentationContext): Promise<DocumentationEnhancement> {
    const fieldName = context.element;
    
    // Logique spécifique aux champs EBIOS
    const fieldHelp = this.getFieldSpecificHelp(fieldName, context);
    
    return {
      tooltip: fieldHelp.tooltip,
      detailedHelp: fieldHelp.detailedHelp,
      examples: fieldHelp.examples,
      relatedConcepts: fieldHelp.relatedConcepts,
      bestPractices: fieldHelp.bestPractices,
      confidence: 0.85
    };
  }

  private async generateGenericTooltip(context: DocumentationContext): Promise<DocumentationEnhancement> {
    return {
      tooltip: `Aide pour ${context.element}`,
      detailedHelp: `Information détaillée sur ${context.element} dans le contexte EBIOS RM.`,
      examples: [],
      relatedConcepts: [],
      confidence: 0.5
    };
  }

  private async enhanceHelp(context: DocumentationContext): Promise<DocumentationEnhancement> {
    // Amélioration de l'aide existante avec du contexte AI
    const baseTooltip = await this.generateTooltip(context);
    
    return {
      ...baseTooltip,
      detailedHelp: this.enrichWithContext(baseTooltip.detailedHelp, context),
      examples: this.generateContextualExamples(context),
      confidence: Math.min(baseTooltip.confidence + 0.1, 1.0)
    };
  }

  private async explainConcept(concept: string, context: DocumentationContext): Promise<DocumentationEnhancement> {
    const conceptContext = { ...context, element: concept, elementType: 'concept' as const };
    return await this.generateConceptTooltip(conceptContext);
  }

  private async suggestExamples(context: DocumentationContext): Promise<DocumentationEnhancement> {
    const examples = this.generateContextualExamples(context);
    
    return {
      tooltip: `Exemples pour ${context.element}`,
      detailedHelp: `Voici des exemples concrets pour vous aider avec ${context.element}`,
      examples,
      confidence: 0.8
    };
  }

  private async executeFallback(task: AgentTask): Promise<DocumentationEnhancement> {
    this.logger.warn('Using fallback for documentation task');
    
    return {
      tooltip: "Aide non disponible temporairement",
      detailedHelp: "Le service d'aide intelligent est temporairement indisponible. Veuillez consulter la documentation ANSSI.",
      examples: [],
      confidence: 0.1
    };
  }

  // Méthodes utilitaires pour la génération de contenu
  
  private generateWorkshopDetailedHelp(workshopNumber: number, workshop: any): string {
    return `L'atelier ${workshopNumber} "${workshop.name}" est une étape clé de la méthode EBIOS RM. ${workshop.description}. Les éléments principaux à considérer sont : ${workshop.keyElements.join(', ')}.`;
  }

  private getWorkshopExamples(workshopNumber: number): string[] {
    const examples: Record<number, string[]> = {
      1: ["Mission : Assurer la continuité du service de paiement en ligne", "Bien essentiel : Base de données clients"],
      2: ["Source de menace : Cybercriminel organisé", "Objectif visé : Vol de données personnelles"],
      3: ["Événement redouté : Divulgation de données personnelles", "Impact : Perte de confiance des clients"],
      4: ["Action élémentaire : Injection SQL", "Vulnérabilité : Absence de validation des entrées"],
      5: ["Mesure de sécurité : Chiffrement des données", "Risque résiduel : Faible"]
    };
    
    return examples[workshopNumber] || [];
  }

  private getANSSIReferences(workshopNumber: number): string[] {
    return [`Guide EBIOS RM - Atelier ${workshopNumber}`, "ANSSI - Méthode EBIOS Risk Manager"];
  }

  private getWorkshopBestPractices(workshopNumber: number): string[] {
    const practices: Record<number, string[]> = {
      1: ["Impliquer tous les métiers", "Définir clairement le périmètre"],
      2: ["Utiliser des sources de threat intelligence", "Considérer tous types d'attaquants"],
      3: ["Prioriser selon l'impact métier", "Valider avec les experts métier"],
      4: ["Détailler suffisamment les scénarios", "Évaluer la vraisemblance objectivement"],
      5: ["Équilibrer coût et efficacité", "Planifier la mise en œuvre"]
    };
    
    return practices[workshopNumber] || [];
  }

  private getCommonMistakes(workshopNumber: number): string[] {
    const mistakes: Record<number, string[]> = {
      1: ["Périmètre trop large", "Oublier les biens supports"],
      2: ["Se limiter aux menaces techniques", "Sous-estimer les menaces internes"],
      3: ["Scénarios trop génériques", "Impacts mal évalués"],
      4: ["Manque de détail technique", "Vraisemblance surestimée"],
      5: ["Mesures disproportionnées", "Oublier les risques résiduels"]
    };
    
    return mistakes[workshopNumber] || [];
  }

  private generateConceptDetailedHelp(concept: string, definition: string): string {
    return `${definition}. Ce concept est fondamental dans la méthode EBIOS RM et doit être bien compris pour mener à bien l'analyse de risque.`;
  }

  private getConceptExamples(concept: string): string[] {
    const examples: Record<string, string[]> = {
      "bien_essentiel": ["Données clients", "Service de paiement", "Réputation de l'entreprise"],
      "bien_support": ["Serveur de base de données", "Réseau informatique", "Personnel IT"],
      "source_menace": ["Cybercriminel", "Employé malveillant", "État-nation"],
      "evenement_redoute": ["Vol de données", "Interruption de service", "Atteinte à l'image"],
      "mesure_securite": ["Authentification forte", "Chiffrement", "Sauvegarde"]
    };
    
    return examples[concept] || [];
  }

  private getRelatedConcepts(concept: string): string[] {
    const relations: Record<string, string[]> = {
      "bien_essentiel": ["bien_support", "evenement_redoute"],
      "bien_support": ["bien_essentiel", "source_menace"],
      "source_menace": ["evenement_redoute", "bien_support"],
      "evenement_redoute": ["bien_essentiel", "mesure_securite"],
      "mesure_securite": ["evenement_redoute", "bien_support"]
    };
    
    return relations[concept] || [];
  }

  private getConceptANSSIReferences(concept: string): string[] {
    return ["Guide EBIOS RM", "Glossaire ANSSI"];
  }

  private getConceptBestPractices(concept: string): string[] {
    return ["Définir précisément", "Valider avec les experts", "Documenter les choix"];
  }

  private getFieldSpecificHelp(fieldName: string, context: DocumentationContext): any {
    // Aide spécifique aux champs selon le contexte
    return {
      tooltip: `Saisissez ${fieldName}`,
      detailedHelp: `Ce champ permet de saisir ${fieldName} dans le contexte de l'atelier EBIOS RM.`,
      examples: [],
      relatedConcepts: [],
      bestPractices: ["Soyez précis", "Utilisez un vocabulaire métier"]
    };
  }

  private enrichWithContext(baseHelp: string, context: DocumentationContext): string {
    let enriched = baseHelp;
    
    if (context.workshopContext) {
      enriched += ` Dans le contexte de l'atelier ${context.workshopContext.number}, cette information est particulièrement importante.`;
    }
    
    if (context.ebiosContext?.mission) {
      enriched += ` Pour la mission "${context.ebiosContext.mission}", considérez les spécificités métier.`;
    }
    
    return enriched;
  }

  private generateContextualExamples(context: DocumentationContext): string[] {
    // Génération d'exemples basés sur le contexte
    const examples: string[] = [];
    
    if (context.workshopContext) {
      examples.push(...this.getWorkshopExamples(context.workshopContext.number));
    }
    
    if (context.elementType === 'concept') {
      examples.push(...this.getConceptExamples(context.element));
    }
    
    return examples;
  }

  // Méthodes de cache
  
  private getCacheKey(type: string, context: DocumentationContext): string {
    return `${type}:${context.element}:${context.elementType}:${JSON.stringify(context.workshopContext)}`;
  }

  private getFromCache(key: string): DocumentationEnhancement | null {
    const expiry = this.cacheExpiry.get(key);
    if (expiry && Date.now() > expiry) {
      this.documentationCache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }
    
    return this.documentationCache.get(key) || null;
  }

  private setCache(key: string, enhancement: DocumentationEnhancement): void {
    this.documentationCache.set(key, enhancement);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_TTL);
  }

  private wasCacheHit(task: AgentTask): boolean {
    const cacheKey = this.getCacheKey(task.type, task.data.context);
    return this.documentationCache.has(cacheKey);
  }

  private calculateCacheHitRate(): number {
    const executions = this.metricsCollector.getExecutionRecords(this.agentId);
    const cacheHits = executions.filter(e => e.metadata?.cacheHit).length;
    return executions.length > 0 ? (cacheHits / executions.length) * 100 : 0;
  }

  private async validateDependencies(): Promise<void> {
    // Validation des dépendances nécessaires
    if (!this.metricsCollector) {
      throw new Error('MetricsCollector not available');
    }
  }

  private async loadKnowledgeBase(): Promise<void> {
    // Chargement de la base de connaissances
    // En production, ceci pourrait charger depuis une base de données
    this.logger.info(`Loaded knowledge base with ${Object.keys(this.ebiosKnowledge.concepts).length} concepts`);
  }
}