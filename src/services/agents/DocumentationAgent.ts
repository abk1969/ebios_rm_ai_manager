/**
 * 📚 AGENT DOCUMENTATION - PREMIER AGENT NON-CRITIQUE
 * Enrichit les tooltips et aide contextuelle EBIOS RM
 * ZERO RISQUE - Pas de logique métier critique
 */

import { 
  AgentService, 
  AgentCapability, 
  AgentTask, 
  AgentResult, 
  AgentStatus 
} from './AgentService';

export interface EbiosDocumentation {
  concept: string;
  definition: string;
  context: string;
  examples: string[];
  references: {
    anssi?: string;
    iso27005?: string;
    page?: number;
  };
  relatedConcepts: string[];
}

/**
 * Base de connaissances EBIOS RM
 */
const EBIOS_KNOWLEDGE_BASE: Record<string, EbiosDocumentation> = {
  'valeur_metier': {
    concept: 'Valeur Métier',
    definition: 'Processus, information ou savoir-faire dont l\'organisme tire sa valeur et qui contribue à l\'atteinte de ses objectifs.',
    context: 'Atelier 1 - Cadrage et socle de sécurité',
    examples: [
      'Processus de facturation',
      'Base de données clients',
      'Savoir-faire technique',
      'Réputation de l\'entreprise'
    ],
    references: {
      anssi: 'Guide EBIOS RM v1.5',
      page: 23
    },
    relatedConcepts: ['bien_support', 'evenement_redoute', 'partie_prenante']
  },
  
  'bien_support': {
    concept: 'Bien Support',
    definition: 'Bien sur lequel repose une valeur métier et dont la compromission peut affecter cette valeur.',
    context: 'Atelier 1 - Identification des biens supports',
    examples: [
      'Serveur de base de données',
      'Réseau informatique',
      'Personnel clé',
      'Locaux techniques'
    ],
    references: {
      anssi: 'Guide EBIOS RM v1.5',
      page: 25
    },
    relatedConcepts: ['valeur_metier', 'evenement_redoute', 'mesure_securite']
  },

  'evenement_redoute': {
    concept: 'Événement Redouté',
    definition: 'Événement que l\'organisme souhaite éviter et qui, s\'il survenait, aurait un impact sur une ou plusieurs valeurs métier.',
    context: 'Atelier 1 - Définition des événements redoutés',
    examples: [
      'Divulgation de données personnelles',
      'Indisponibilité du système de production',
      'Altération des données comptables',
      'Usurpation d\'identité'
    ],
    references: {
      anssi: 'Guide EBIOS RM v1.5',
      page: 27
    },
    relatedConcepts: ['valeur_metier', 'bien_support', 'source_risque']
  },

  'source_risque': {
    concept: 'Source de Risque',
    definition: 'Élément qui, seul ou combiné avec d\'autres, peut donner naissance à un risque.',
    context: 'Atelier 2 - Sources de risque',
    examples: [
      'Cybercriminel organisé',
      'Employé malveillant',
      'Défaillance technique',
      'Catastrophe naturelle'
    ],
    references: {
      anssi: 'Guide EBIOS RM v1.5',
      page: 35
    },
    relatedConcepts: ['evenement_redoute', 'scenario_strategique', 'mode_operatoire']
  },

  'scenario_strategique': {
    concept: 'Scénario Stratégique',
    definition: 'Combinaison d\'une source de risque, d\'un bien support et d\'un événement redouté.',
    context: 'Atelier 3 - Scénarios stratégiques',
    examples: [
      'Cybercriminel → Serveur web → Indisponibilité service',
      'Employé → Base données → Divulgation informations',
      'Défaillance → Infrastructure → Perte de données'
    ],
    references: {
      anssi: 'Guide EBIOS RM v1.5',
      page: 45
    },
    relatedConcepts: ['source_risque', 'bien_support', 'evenement_redoute', 'scenario_operationnel']
  },

  'scenario_operationnel': {
    concept: 'Scénario Opérationnel',
    definition: 'Description détaillée des modes opératoires permettant à une source de risque d\'atteindre ses objectifs.',
    context: 'Atelier 4 - Scénarios opérationnels',
    examples: [
      'Attaque par phishing → Compromission poste → Mouvement latéral',
      'Exploitation vulnérabilité → Élévation privilèges → Exfiltration',
      'Ingénierie sociale → Accès physique → Installation malware'
    ],
    references: {
      anssi: 'Guide EBIOS RM v1.5',
      page: 55
    },
    relatedConcepts: ['scenario_strategique', 'mode_operatoire', 'mesure_securite']
  },

  'mesure_securite': {
    concept: 'Mesure de Sécurité',
    definition: 'Moyen de traiter un risque, pouvant être de nature organisationnelle, humaine, physique ou technique.',
    context: 'Atelier 5 - Traitement du risque',
    examples: [
      'Chiffrement des données',
      'Formation sensibilisation',
      'Contrôle d\'accès physique',
      'Sauvegarde régulière'
    ],
    references: {
      anssi: 'Guide EBIOS RM v1.5',
      page: 65
    },
    relatedConcepts: ['scenario_operationnel', 'risque_residuel', 'plan_traitement']
  }
};

/**
 * Agent de documentation EBIOS RM
 */
export class DocumentationAgent implements AgentService {
  readonly id = 'documentation-agent';
  readonly name = 'Agent Documentation EBIOS RM';
  readonly version = '1.0.0';

  getCapabilities(): AgentCapability[] {
    return [
      {
        id: 'explain-concept',
        name: 'Explication de concepts EBIOS RM',
        description: 'Fournit des explications détaillées des concepts EBIOS RM',
        inputTypes: ['concept_name', 'context'],
        outputTypes: ['explanation', 'examples', 'references'],
        criticality: 'low'
      },
      {
        id: 'generate-tooltip',
        name: 'Génération de tooltips',
        description: 'Génère des tooltips contextuels pour l\'interface',
        inputTypes: ['field_name', 'workshop_context'],
        outputTypes: ['tooltip_content'],
        criticality: 'low'
      },
      {
        id: 'suggest-examples',
        name: 'Suggestion d\'exemples',
        description: 'Propose des exemples pertinents selon le contexte',
        inputTypes: ['entity_type', 'domain'],
        outputTypes: ['examples_list'],
        criticality: 'low'
      }
    ];
  }

  getStatus(): AgentStatus {
    return AgentStatus.ACTIVE;
  }

  async executeTask(task: AgentTask): Promise<AgentResult> {
    const startTime = Date.now();
    
    try {
      let result: any;
      
      switch (task.type) {
        case 'explain-concept':
          result = await this.explainConcept(task.input);
          break;
        case 'generate-tooltip':
          result = await this.generateTooltip(task.input);
          break;
        case 'suggest-examples':
          result = await this.suggestExamples(task.input);
          break;
        default:
          throw new Error(`Type de tâche non supporté: ${task.type}`);
      }

      return {
        taskId: task.id,
        success: true,
        data: result,
        confidence: 0.9,
        metadata: {
          processingTime: Date.now() - startTime,
          agentVersion: this.version
        }
      };
    } catch (error) {
      return {
        taskId: task.id,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        metadata: {
          processingTime: Date.now() - startTime,
          agentVersion: this.version
        }
      };
    }
  }

  async healthCheck(): Promise<boolean> {
    return true; // Agent simple, toujours en bonne santé
  }

  async configure(config: Record<string, any>): Promise<void> {
    // Configuration simple pour cet agent
    console.log('Configuration Agent Documentation:', config);
  }

  /**
   * Explique un concept EBIOS RM
   */
  private async explainConcept(input: { concept: string; context?: string }): Promise<EbiosDocumentation | null> {
    const concept = input.concept.toLowerCase().replace(/\s+/g, '_');
    return EBIOS_KNOWLEDGE_BASE[concept] || null;
  }

  /**
   * Génère un tooltip contextuel
   */
  private async generateTooltip(input: { fieldName: string; workshop?: number }): Promise<string> {
    const { fieldName, workshop } = input;
    
    // Mapping des champs vers les concepts
    const fieldConceptMap: Record<string, string> = {
      'name': 'Nom unique identifiant l\'élément dans le contexte EBIOS RM',
      'description': 'Description détaillée selon la méthode ANSSI',
      'gravity': 'Échelle de gravité EBIOS RM (1-4): Négligeable, Limitée, Importante, Critique',
      'likelihood': 'Échelle de vraisemblance EBIOS RM (1-4): Minimal, Significatif, Maximal, Critique',
      'pertinence': 'Évaluation de la pertinence pour votre contexte (1-4)',
      'expertise': 'Niveau d\'expertise de la source de risque',
      'resources': 'Ressources disponibles pour la source de risque',
      'motivation': 'Motivation de la source de risque'
    };

    const baseTooltip = fieldConceptMap[fieldName] || 'Champ EBIOS RM';
    
    if (workshop) {
      return `${baseTooltip} (Atelier ${workshop})`;
    }
    
    return baseTooltip;
  }

  /**
   * Suggère des exemples pertinents
   */
  private async suggestExamples(input: { entityType: string; domain?: string }): Promise<string[]> {
    const examplesByType: Record<string, string[]> = {
      'business_value': [
        'Processus de facturation clients',
        'Base de données produits',
        'Savoir-faire technique R&D',
        'Image de marque'
      ],
      'supporting_asset': [
        'Serveur de base de données',
        'Poste de travail administrateur',
        'Connexion Internet',
        'Personnel IT'
      ],
      'dreaded_event': [
        'Divulgation de données personnelles',
        'Indisponibilité du service critique',
        'Altération des données comptables',
        'Vol de propriété intellectuelle'
      ],
      'risk_source': [
        'Cybercriminel organisé',
        'Employé mécontent',
        'Concurrent déloyal',
        'Défaillance matérielle'
      ]
    };

    return examplesByType[input.entityType] || ['Exemple générique'];
  }
}
