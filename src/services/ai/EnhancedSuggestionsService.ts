/**
 * Service d'amélioration des suggestions IA pour tous les workshops
 * Intègre les référentiels ISO 27002, NIST CSF, CIS Controls, MITRE ATT&CK
 */

import { BusinessValue, DreadedEvent, SupportingAsset, RiskSource, RiskObjective, OperationalMode } from '../../types/ebios';
import { getRelevantControls, generateFrameworkRecommendations } from '../../lib/security-frameworks';
import { MITRE_TECHNIQUES } from '../../lib/ebios-constants';

export interface EnhancedSuggestion {
  id: string;
  type: 'dreadedEvent' | 'supportingAsset' | 'securityMeasure' | 'riskSource' | 'riskObjective' | 'operationalMode';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  frameworks: {
    iso27002?: string[];
    nist?: string[];
    cis?: string[];
    mitre?: string[];
  };
  reasoning: string;
  confidence: number; // 0-1
  category?: string;
  expertise?: string;
  resources?: string;
  motivation?: number;
}

export class EnhancedSuggestionsService {
  
  /**
   * Génère des suggestions d'événements redoutés enrichies avec les référentiels
   */
  static generateEnhancedDreadedEvents(
    businessValue: BusinessValue,
    existingEvents: DreadedEvent[]
  ): EnhancedSuggestion[] {
    const suggestions: EnhancedSuggestion[] = [];
    const category = businessValue.category;
    const name = businessValue.name.toLowerCase();
    const description = businessValue.description?.toLowerCase() || '';
    
    // Templates enrichis par catégorie et référentiels
    const templates = this.getDreadedEventTemplates(category, name, description);
    
    // Filtrer les suggestions déjà existantes
    const existingNames = existingEvents.map(e => e.name.toLowerCase());
    
    templates.forEach((template, index) => {
      if (!existingNames.some(existing => 
        existing.includes(template.title.toLowerCase()) || 
        template.title.toLowerCase().includes(existing)
      )) {
        suggestions.push({
          id: `enhanced-dreaded-${index}`,
          type: 'dreadedEvent',
          ...template
        });
      }
    });
    
    return suggestions.slice(0, 5); // Limiter à 5 suggestions
  }

  /**
   * Génère des suggestions d'actifs supports enrichies
   */
  static generateEnhancedSupportingAssets(
    businessValue: BusinessValue,
    existingAssets: SupportingAsset[]
  ): EnhancedSuggestion[] {
    const suggestions: EnhancedSuggestion[] = [];
    const category = businessValue.category;
    const name = businessValue.name.toLowerCase();
    
    const templates = this.getSupportingAssetTemplates(category, name);
    const existingNames = existingAssets.map(a => a.name.toLowerCase());
    
    templates.forEach((template, index) => {
      if (!existingNames.some(existing => 
        existing.includes(template.title.toLowerCase())
      )) {
        suggestions.push({
          id: `enhanced-asset-${index}`,
          type: 'supportingAsset',
          ...template
        });
      }
    });
    
    return suggestions.slice(0, 4);
  }

  /**
   * Templates d'événements redoutés par catégorie avec référentiels
   */
  private static getDreadedEventTemplates(
    category: string, 
    name: string, 
    description: string
  ): Omit<EnhancedSuggestion, 'id' | 'type'>[] {
    const isDataRelated = name.includes('données') || name.includes('base') || description.includes('information');
    const isSystemRelated = name.includes('système') || name.includes('application') || name.includes('service');
    const isProcessRelated = name.includes('processus') || name.includes('métier') || category === 'primary';
    
    const templates: Omit<EnhancedSuggestion, 'id' | 'type'>[] = [];
    
    if (isDataRelated) {
      templates.push(
        {
          title: 'Fuite de données sensibles',
          description: 'Divulgation non autorisée d\'informations confidentielles',
          priority: 'critical',
          frameworks: {
            iso27002: ['8.12', '8.24'], // DLP, Cryptographie
            nist: ['PR.DS-1', 'PR.DS-5'], // Data Security
            cis: ['CIS-3', 'CIS-14'] // Data Protection, Awareness
          },
          reasoning: 'Risque majeur pour les données selon ISO 27002:8.12 (DLP) et NIST PR.DS',
          confidence: 0.9
        },
        {
          title: 'Corruption de données critiques',
          description: 'Altération malveillante ou accidentelle des données',
          priority: 'high',
          frameworks: {
            iso27002: ['8.9', '8.11'], // Configuration, Backup
            nist: ['PR.DS-6', 'RC.RP-1'], // Integrity, Recovery
            cis: ['CIS-11', 'CIS-4'] // Data Recovery, Secure Config
          },
          reasoning: 'Protection intégrité selon CIS-11 et NIST RC.RP-1',
          confidence: 0.85
        }
      );
    }
    
    if (isSystemRelated) {
      templates.push(
        {
          title: 'Indisponibilité prolongée du système',
          description: 'Arrêt de service impactant la continuité d\'activité',
          priority: 'high',
          frameworks: {
            iso27002: ['8.6', '8.14'], // Capacity, Backup
            nist: ['PR.IP-4', 'RC.RP-1'], // Backup, Recovery Planning
            cis: ['CIS-11', 'CIS-12'] // Data Recovery, Network Infrastructure
          },
          reasoning: 'Continuité selon ISO 27002:8.14 et NIST RC.RP-1',
          confidence: 0.8
        },
        {
          title: 'Compromission par malware',
          description: 'Infection par logiciel malveillant (ransomware, trojan)',
          priority: 'critical',
          frameworks: {
            iso27002: ['8.7', '8.16'], // Anti-malware, Monitoring
            nist: ['PR.PT-1', 'DE.CM-1'], // Protective Technology, Monitoring
            cis: ['CIS-10', 'CIS-8'] // Malware Defenses, Audit Logs
          },
          reasoning: 'Protection anti-malware selon CIS-10 et ISO 27002:8.7',
          confidence: 0.95
        }
      );
    }
    
    if (isProcessRelated) {
      templates.push(
        {
          title: 'Interruption de processus métier critique',
          description: 'Dysfonctionnement impactant les opérations essentielles',
          priority: 'high',
          frameworks: {
            iso27002: ['5.1', '8.14'], // Policies, Business Continuity
            nist: ['ID.BE-3', 'RC.RP-1'], // Business Environment, Recovery
            cis: ['CIS-1', 'CIS-17'] // Asset Inventory, Incident Response
          },
          reasoning: 'Continuité métier selon NIST ID.BE-3 et ISO 27002:8.14',
          confidence: 0.75
        }
      );
    }
    
    // Événements génériques enrichis
    templates.push(
      {
        title: 'Accès non autorisé par initié malveillant',
        description: 'Abus de privilèges par un utilisateur interne',
        priority: 'high',
        frameworks: {
          iso27002: ['8.2', '8.5'], // Privileged Access, MFA
          nist: ['PR.AC-1', 'PR.AC-4'], // Access Control
          cis: ['CIS-5', 'CIS-6'] // Account Management, Access Control
        },
        reasoning: 'Contrôle d\'accès selon CIS-5/6 et ISO 27002:8.2',
        confidence: 0.7
      },
      {
        title: 'Attaque par déni de service (DDoS)',
        description: 'Saturation des ressources rendant le service indisponible',
        priority: 'medium',
        frameworks: {
          iso27002: ['8.6', '8.16'], // Capacity Management, Monitoring
          nist: ['PR.PT-4', 'DE.AE-1'], // Communications Protection, Anomaly Detection
          cis: ['CIS-12', 'CIS-13'] // Network Infrastructure, Network Monitoring
        },
        reasoning: 'Protection réseau selon CIS-12/13 et NIST PR.PT-4',
        confidence: 0.65
      }
    );
    
    return templates;
  }

  /**
   * Templates d'actifs supports par catégorie
   */
  private static getSupportingAssetTemplates(
    category: string,
    name: string
  ): Omit<EnhancedSuggestion, 'id' | 'type'>[] {
    const templates: Omit<EnhancedSuggestion, 'id' | 'type'>[] = [];
    
    // Actifs communs selon la catégorie de valeur métier
    if (category === 'primary' || name.includes('données')) {
      templates.push(
        {
          title: 'Base de données principale',
          description: 'Système de gestion de base de données stockant les informations critiques',
          priority: 'critical',
          frameworks: {
            iso27002: ['8.9', '8.24'], // Configuration, Cryptography
            nist: ['PR.DS-1', 'PR.DS-2'], // Data-at-rest, Data-in-transit
            cis: ['CIS-3', 'CIS-4'] // Data Protection, Secure Configuration
          },
          reasoning: 'Protection données selon ISO 27002:8.24 et CIS-3',
          confidence: 0.9
        },
        {
          title: 'Serveur d\'application métier',
          description: 'Serveur hébergeant les applications critiques',
          priority: 'high',
          frameworks: {
            iso27002: ['8.1', '8.9'], // Endpoint Protection, Configuration
            nist: ['PR.IP-1', 'PR.PT-1'], // Baseline Configuration, Protective Technology
            cis: ['CIS-1', 'CIS-4'] // Asset Inventory, Secure Configuration
          },
          reasoning: 'Sécurisation serveur selon CIS-1/4 et NIST PR.IP-1',
          confidence: 0.85
        }
      );
    }
    
    // Actifs réseau et infrastructure
    templates.push(
      {
        title: 'Infrastructure réseau',
        description: 'Équipements réseau (routeurs, switches, firewalls)',
        priority: 'high',
        frameworks: {
          iso27002: ['8.6', '8.16'], // Network Management, Monitoring
          nist: ['PR.AC-5', 'DE.CM-1'], // Network Integrity, Network Monitoring
          cis: ['CIS-12', 'CIS-13'] // Network Infrastructure, Network Monitoring
        },
        reasoning: 'Sécurité réseau selon CIS-12/13 et ISO 27002:8.6',
        confidence: 0.8
      },
      {
        title: 'Postes de travail utilisateurs',
        description: 'Ordinateurs et terminaux des utilisateurs finaux',
        priority: 'medium',
        frameworks: {
          iso27002: ['8.1', '8.7'], // Endpoint Protection, Anti-malware
          nist: ['PR.PT-1', 'PR.PT-3'], // Protective Technology, Communications Protection
          cis: ['CIS-1', 'CIS-10'] // Asset Inventory, Malware Defenses
        },
        reasoning: 'Protection endpoints selon CIS-1/10 et ISO 27002:8.1',
        confidence: 0.75
      }
    );
    
    return templates;
  }

  /**
   * Génère des recommandations de mesures de sécurité basées sur les référentiels
   */
  static generateSecurityMeasureRecommendations(
    businessValues: BusinessValue[],
    dreadedEvents: DreadedEvent[],
    supportingAssets: SupportingAsset[]
  ): EnhancedSuggestion[] {
    const suggestions: EnhancedSuggestion[] = [];
    
    // Analyser les types d'actifs pour recommandations ciblées
    const assetTypes = supportingAssets.map(a => a.type);
    const threatTypes = dreadedEvents.map(e => e.name.toLowerCase());
    
    // Calculer un niveau de risque moyen
    const avgGravity = dreadedEvents.length > 0 ? 
      dreadedEvents.reduce((sum, e) => sum + e.gravity, 0) / dreadedEvents.length : 2;
    
    const riskLevel = avgGravity * 3; // Approximation pour le calcul
    
    // Générer recommandations basées sur les référentiels
    const frameworkRecs = generateFrameworkRecommendations(riskLevel, assetTypes, threatTypes);
    
    frameworkRecs.forEach((rec, index) => {
      suggestions.push({
        id: `security-measure-${index}`,
        type: 'securityMeasure',
        title: `Mesures ${rec.priority}`,
        description: rec.recommendations.join(' | '),
        priority: rec.priority.toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
        frameworks: {
          iso27002: rec.recommendations.filter(r => r.includes('ISO')).map(r => r.split(':')[1]?.split(' ')[0]).filter(Boolean),
          nist: rec.recommendations.filter(r => r.includes('NIST')).map(r => r.split(' ')[1]).filter(Boolean),
          cis: rec.recommendations.filter(r => r.includes('CIS')).map(r => r.split('-')[1]?.split(':')[0]).filter(Boolean)
        },
        reasoning: `Recommandations basées sur l'analyse de ${dreadedEvents.length} événements redoutés et ${supportingAssets.length} actifs`,
        confidence: 0.8
      });
    });
    
    return suggestions.slice(0, 3);
  }

  /**
   * 🆕 WORKSHOP 2: Génère des suggestions de sources de risque enrichies
   */
  static generateEnhancedRiskSources(
    businessValues: BusinessValue[],
    existingRiskSources: RiskSource[]
  ): EnhancedSuggestion[] {
    const suggestions: EnhancedSuggestion[] = [];
    const existingNames = existingRiskSources.map(rs => rs.name.toLowerCase());

    // Analyser les valeurs métier pour suggestions contextuelles
    const hasDataAssets = businessValues.some(bv =>
      bv.name.toLowerCase().includes('données') ||
      bv.description?.toLowerCase().includes('information')
    );
    const hasFinancialAssets = businessValues.some(bv =>
      bv.category === 'primary' &&
      (bv.name.toLowerCase().includes('financ') || bv.name.toLowerCase().includes('revenus'))
    );
    const hasSystemAssets = businessValues.some(bv =>
      bv.name.toLowerCase().includes('système') ||
      bv.name.toLowerCase().includes('service')
    );

    const templates = this.getRiskSourceTemplates(hasDataAssets, hasFinancialAssets, hasSystemAssets);

    templates.forEach((template, index) => {
      if (!existingNames.some(existing =>
        existing.includes(template.title.toLowerCase()) ||
        template.title.toLowerCase().includes(existing)
      )) {
        suggestions.push({
          id: `enhanced-risk-source-${index}`,
          type: 'riskSource',
          ...template
        });
      }
    });

    return suggestions.slice(0, 6);
  }

  /**
   * 🆕 WORKSHOP 2: Génère des suggestions d'objectifs enrichies avec MITRE ATT&CK
   */
  static generateEnhancedRiskObjectives(
    riskSource: RiskSource,
    businessValues: BusinessValue[],
    existingObjectives: RiskObjective[]
  ): EnhancedSuggestion[] {
    const suggestions: EnhancedSuggestion[] = [];
    const existingNames = existingObjectives.map(obj => obj.name.toLowerCase());

    const templates = this.getRiskObjectiveTemplates(riskSource, businessValues);

    templates.forEach((template, index) => {
      if (!existingNames.some(existing =>
        existing.includes(template.title.toLowerCase())
      )) {
        suggestions.push({
          id: `enhanced-objective-${index}`,
          type: 'riskObjective',
          ...template
        });
      }
    });

    return suggestions.slice(0, 5);
  }

  /**
   * 🆕 WORKSHOP 2: Génère des suggestions de modes opératoires avec MITRE ATT&CK
   */
  static generateEnhancedOperationalModes(
    riskSource: RiskSource,
    objective: RiskObjective,
    existingModes: OperationalMode[]
  ): EnhancedSuggestion[] {
    const suggestions: EnhancedSuggestion[] = [];
    const existingNames = existingModes.map(mode => mode.name.toLowerCase());

    const templates = this.getOperationalModeTemplates(riskSource, objective);

    templates.forEach((template, index) => {
      if (!existingNames.some(existing =>
        existing.includes(template.title.toLowerCase())
      )) {
        suggestions.push({
          id: `enhanced-mode-${index}`,
          type: 'operationalMode',
          ...template
        });
      }
    });

    return suggestions.slice(0, 4);
  }

  /**
   * Templates de sources de risque enrichies avec référentiels
   */
  private static getRiskSourceTemplates(
    hasDataAssets: boolean,
    hasFinancialAssets: boolean,
    hasSystemAssets: boolean
  ): Omit<EnhancedSuggestion, 'id' | 'type'>[] {
    const templates: Omit<EnhancedSuggestion, 'id' | 'type'>[] = [];

    // Sources de risque contextuelles selon les actifs
    if (hasDataAssets) {
      templates.push({
        title: 'Cybercriminels spécialisés en vol de données',
        description: 'Groupes organisés ciblant spécifiquement les données sensibles pour revente',
        priority: 'critical',
        category: 'cybercriminal',
        expertise: 'high',
        resources: 'moderate',
        motivation: 4,
        frameworks: {
          iso27002: ['8.12', '8.24'], // DLP, Cryptography
          nist: ['PR.DS-1', 'DE.AE-2'], // Data Security, Anomaly Detection
          cis: ['CIS-3', 'CIS-14'], // Data Protection, Awareness
          mitre: ['T1041', 'T1020'] // Exfiltration Over C2, Data Staged
        },
        reasoning: 'Menace critique pour les données selon MITRE T1041/T1020 et ISO 27002:8.12',
        confidence: 0.95
      });
    }

    if (hasFinancialAssets) {
      templates.push({
        title: 'Groupes de ransomware financièrement motivés',
        description: 'Cybercriminels utilisant des ransomwares pour extorquer des fonds',
        priority: 'critical',
        category: 'cybercriminal',
        expertise: 'expert',
        resources: 'high',
        motivation: 4,
        frameworks: {
          iso27002: ['8.7', '8.11'], // Anti-malware, Backup
          nist: ['PR.PT-1', 'RC.RP-1'], // Protective Technology, Recovery
          cis: ['CIS-10', 'CIS-11'], // Malware Defenses, Data Recovery
          mitre: ['T1486', 'T1490'] // Data Encrypted for Impact, Inhibit System Recovery
        },
        reasoning: 'Menace ransomware selon MITRE T1486 et CIS-10/11',
        confidence: 0.9
      });
    }

    // Sources génériques enrichies
    templates.push(
      {
        title: 'Acteurs étatiques (APT)',
        description: 'Groupes de menaces persistantes avancées sponsorisés par des États',
        priority: 'critical',
        category: 'state',
        expertise: 'expert',
        resources: 'unlimited',
        motivation: 3,
        frameworks: {
          iso27002: ['8.16', '8.25'], // Monitoring, Threat Intelligence
          nist: ['DE.CM-1', 'RS.AN-1'], // Continuous Monitoring, Analysis
          cis: ['CIS-8', 'CIS-13'], // Audit Logs, Network Monitoring
          mitre: ['T1071', 'T1055'] // Application Layer Protocol, Process Injection
        },
        reasoning: 'Menaces APT selon MITRE ATT&CK et NIST DE.CM-1',
        confidence: 0.85
      },
      {
        title: 'Employés malveillants internes',
        description: 'Personnel interne abusant de ses privilèges d\'accès',
        priority: 'high',
        category: 'insider',
        expertise: 'moderate',
        resources: 'moderate',
        motivation: 3,
        frameworks: {
          iso27002: ['8.2', '8.5'], // Privileged Access, MFA
          nist: ['PR.AC-1', 'DE.CM-3'], // Access Control, Personnel Monitoring
          cis: ['CIS-5', 'CIS-6'], // Account Management, Access Control
          mitre: ['T1078', 'T1083'] // Valid Accounts, File and Directory Discovery
        },
        reasoning: 'Menace interne selon CIS-5/6 et MITRE T1078',
        confidence: 0.8
      }
    );

    return templates;
  }

  /**
   * Templates d'objectifs de risque enrichis avec MITRE ATT&CK
   */
  private static getRiskObjectiveTemplates(
    riskSource: RiskSource,
    businessValues: BusinessValue[]
  ): Omit<EnhancedSuggestion, 'id' | 'type'>[] {
    // Utiliser le service Workshop2SuggestionsService
    const { Workshop2SuggestionsService } = require('./Workshop2SuggestionsService');
    return Workshop2SuggestionsService.getRiskObjectiveTemplates(riskSource, businessValues);
  }

  /**
   * Templates de modes opératoires enrichis avec MITRE ATT&CK
   */
  private static getOperationalModeTemplates(
    riskSource: RiskSource,
    objective: RiskObjective
  ): Omit<EnhancedSuggestion, 'id' | 'type'>[] {
    // Utiliser le service Workshop2SuggestionsService
    const { Workshop2SuggestionsService } = require('./Workshop2SuggestionsService');
    return Workshop2SuggestionsService.getOperationalModeTemplates(riskSource, objective);
  }
}
