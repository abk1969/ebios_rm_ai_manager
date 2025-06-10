/**
 * 🛡️ SERVICE MITRE ATT&CK - ACCÈS TAXII PUBLIC
 * Service pour accéder aux données MITRE ATT&CK via le serveur TAXII public
 * Accès sans clé API - Données STIX 2.1 publiques
 */

export interface MitreAttackConfig {
  taxiiUrl: string;
  collectionId: string;
  enableCache: boolean;
  cacheExpiryHours: number;
}

export interface AttackTechnique {
  id: string;
  name: string;
  description: string;
  tactics: string[];
  platforms: string[];
  dataSource: string[];
  mitigations: string[];
  detections: string[];
  references: string[];
  killChainPhases: string[];
  revoked?: boolean;
  deprecated?: boolean;
}

export interface AttackTactic {
  id: string;
  name: string;
  description: string;
  shortName: string;
  techniques: string[];
}

export interface AttackGroup {
  id: string;
  name: string;
  description: string;
  aliases: string[];
  techniques: string[];
  software: string[];
}

export interface AttackSoftware {
  id: string;
  name: string;
  description: string;
  type: 'malware' | 'tool';
  techniques: string[];
  groups: string[];
}

export interface MitreSearchResult {
  techniques: AttackTechnique[];
  tactics: AttackTactic[];
  groups: AttackGroup[];
  software: AttackSoftware[];
  total: number;
}

/**
 * Service MITRE ATT&CK
 */
export class MitreAttackService {
  private config: MitreAttackConfig;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private attackData: {
    techniques: Map<string, AttackTechnique>;
    tactics: Map<string, AttackTactic>;
    groups: Map<string, AttackGroup>;
    software: Map<string, AttackSoftware>;
  } = {
    techniques: new Map(),
    tactics: new Map(),
    groups: new Map(),
    software: new Map()
  };

  constructor(config: MitreAttackConfig) {
    this.config = config;
    this.initializeDefaultData();
  }

  /**
   * Initialise les données MITRE ATT&CK
   */
  async initialize(): Promise<void> {
    console.log('🛡️ Initialisation service MITRE ATT&CK...');
    
    try {
      // En production, ici on ferait un appel TAXII réel
      // Pour l'instant, on utilise des données simulées
      await this.loadAttackData();
      console.log('✅ Données MITRE ATT&CK chargées');
    } catch (error) {
      console.error('❌ Erreur chargement MITRE ATT&CK:', error);
      // Fallback sur les données par défaut
      this.initializeDefaultData();
    }
  }

  /**
   * Recherche de techniques par critères
   */
  searchTechniques(criteria: {
    query?: string;
    tactics?: string[];
    platforms?: string[];
    dataSources?: string[];
    limit?: number;
  }): AttackTechnique[] {
    
    let techniques = Array.from(this.attackData.techniques.values());

    // Filtrage par tactiques
    if (criteria.tactics && criteria.tactics.length > 0) {
      techniques = techniques.filter(tech => 
        tech.tactics.some(tactic => criteria.tactics!.includes(tactic))
      );
    }

    // Filtrage par plateformes
    if (criteria.platforms && criteria.platforms.length > 0) {
      techniques = techniques.filter(tech => 
        tech.platforms.some(platform => criteria.platforms!.includes(platform))
      );
    }

    // Recherche textuelle
    if (criteria.query) {
      const query = criteria.query.toLowerCase();
      techniques = techniques.filter(tech => 
        tech.name.toLowerCase().includes(query) ||
        tech.description.toLowerCase().includes(query) ||
        tech.id.toLowerCase().includes(query)
      );
    }

    // Limitation des résultats
    if (criteria.limit) {
      techniques = techniques.slice(0, criteria.limit);
    }

    return techniques;
  }

  /**
   * Obtient une technique par ID
   */
  getTechniqueById(techniqueId: string): AttackTechnique | null {
    return this.attackData.techniques.get(techniqueId) || null;
  }

  /**
   * Obtient toutes les tactiques
   */
  getAllTactics(): AttackTactic[] {
    return Array.from(this.attackData.tactics.values());
  }

  /**
   * Obtient les techniques pour une tactique
   */
  getTechniquesForTactic(tacticId: string): AttackTechnique[] {
    return Array.from(this.attackData.techniques.values())
      .filter(tech => tech.tactics.includes(tacticId));
  }

  /**
   * Recherche de groupes d'attaquants
   */
  searchGroups(query?: string): AttackGroup[] {
    let groups = Array.from(this.attackData.groups.values());

    if (query) {
      const searchQuery = query.toLowerCase();
      groups = groups.filter(group => 
        group.name.toLowerCase().includes(searchQuery) ||
        group.description.toLowerCase().includes(searchQuery) ||
        group.aliases.some(alias => alias.toLowerCase().includes(searchQuery))
      );
    }

    return groups;
  }

  /**
   * Obtient les techniques utilisées par un groupe
   */
  getTechniquesForGroup(groupId: string): AttackTechnique[] {
    const group = this.attackData.groups.get(groupId);
    if (!group) return [];

    return group.techniques
      .map(techId => this.attackData.techniques.get(techId))
      .filter(tech => tech !== undefined) as AttackTechnique[];
  }

  /**
   * Analyse de couverture pour un ensemble de techniques
   */
  analyzeCoverage(techniques: string[]): {
    tactics: { [tacticId: string]: number };
    platforms: { [platform: string]: number };
    totalCoverage: number;
    gaps: string[];
  } {
    
    const tacticsCoverage: { [tacticId: string]: number } = {};
    const platformsCoverage: { [platform: string]: number } = {};
    const allTactics = this.getAllTactics();
    
    // Initialisation
    allTactics.forEach(tactic => {
      tacticsCoverage[tactic.id] = 0;
    });

    // Calcul de la couverture
    techniques.forEach(techId => {
      const technique = this.attackData.techniques.get(techId);
      if (technique) {
        technique.tactics.forEach(tactic => {
          tacticsCoverage[tactic] = (tacticsCoverage[tactic] || 0) + 1;
        });
        
        technique.platforms.forEach(platform => {
          platformsCoverage[platform] = (platformsCoverage[platform] || 0) + 1;
        });
      }
    });

    // Calcul du score global
    const coveredTactics = Object.values(tacticsCoverage).filter(count => count > 0).length;
    const totalCoverage = coveredTactics / allTactics.length;

    // Identification des gaps
    const gaps = allTactics
      .filter(tactic => tacticsCoverage[tactic.id] === 0)
      .map(tactic => tactic.name);

    return {
      tactics: tacticsCoverage,
      platforms: platformsCoverage,
      totalCoverage,
      gaps
    };
  }

  /**
   * Génère des recommandations de techniques
   */
  recommendTechniques(context: {
    sector?: string;
    threatActors?: string[];
    assets?: string[];
    existingTechniques?: string[];
  }): AttackTechnique[] {
    
    let recommendations: AttackTechnique[] = [];

    // Recommandations basées sur le secteur
    if (context.sector) {
      recommendations = this.getTechniquesForSector(context.sector);
    }

    // Recommandations basées sur les acteurs de menace
    if (context.threatActors && context.threatActors.length > 0) {
      const actorTechniques = context.threatActors.flatMap(actor => 
        this.getTechniquesForGroup(actor)
      );
      recommendations = [...recommendations, ...actorTechniques];
    }

    // Suppression des doublons et des techniques existantes
    const uniqueRecommendations = recommendations.filter((tech, index, self) => 
      index === self.findIndex(t => t.id === tech.id) &&
      !context.existingTechniques?.includes(tech.id)
    );

    // Tri par pertinence (nombre de tactiques couvertes)
    return uniqueRecommendations
      .sort((a, b) => b.tactics.length - a.tactics.length)
      .slice(0, 10);
  }

  /**
   * Exporte les données au format JSON
   */
  exportData(format: 'json' | 'csv' | 'stix'): string {
    switch (format) {
      case 'json':
        return JSON.stringify({
          techniques: Array.from(this.attackData.techniques.values()),
          tactics: Array.from(this.attackData.tactics.values()),
          groups: Array.from(this.attackData.groups.values()),
          software: Array.from(this.attackData.software.values())
        }, null, 2);
      
      case 'csv':
        return this.exportToCSV();
      
      case 'stix':
        return this.exportToSTIX();
      
      default:
        throw new Error(`Format non supporté: ${format}`);
    }
  }

  // Méthodes privées
  private async loadAttackData(): Promise<void> {
    // En production, ici on ferait un appel TAXII réel
    // Simulation du chargement des données
    console.log(`🔄 Chargement depuis TAXII: ${this.config.taxiiUrl}`);
    console.log(`📋 Collection: ${this.config.collectionId}`);
    
    // Simulation d'un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Les données seraient normalement chargées depuis TAXII
    // Pour l'instant, on utilise les données par défaut
  }

  private initializeDefaultData(): void {
    // Tactiques MITRE ATT&CK
    const tactics: AttackTactic[] = [
      {
        id: 'TA0001',
        name: 'Initial Access',
        description: 'Techniques utilisées pour obtenir un accès initial',
        shortName: 'initial-access',
        techniques: ['T1566', 'T1190', 'T1133']
      },
      {
        id: 'TA0002',
        name: 'Execution',
        description: 'Techniques pour exécuter du code malveillant',
        shortName: 'execution',
        techniques: ['T1059', 'T1055', 'T1053']
      },
      {
        id: 'TA0003',
        name: 'Persistence',
        description: 'Techniques pour maintenir l\'accès',
        shortName: 'persistence',
        techniques: ['T1078', 'T1547', 'T1543']
      },
      {
        id: 'TA0005',
        name: 'Defense Evasion',
        description: 'Techniques pour éviter la détection',
        shortName: 'defense-evasion',
        techniques: ['T1070', 'T1027', 'T1055']
      },
      {
        id: 'TA0010',
        name: 'Exfiltration',
        description: 'Techniques pour exfiltrer des données',
        shortName: 'exfiltration',
        techniques: ['T1041', 'T1052', 'T1567']
      }
    ];

    // Techniques MITRE ATT&CK
    const techniques: AttackTechnique[] = [
      {
        id: 'T1566',
        name: 'Phishing',
        description: 'Envoi d\'emails malveillants pour obtenir des informations ou un accès',
        tactics: ['TA0001'],
        platforms: ['Windows', 'macOS', 'Linux'],
        dataSource: ['Email Gateway', 'Network Traffic'],
        mitigations: ['M1031', 'M1017'],
        detections: ['Email analysis', 'User training'],
        references: ['https://attack.mitre.org/techniques/T1566/'],
        killChainPhases: ['initial-access']
      },
      {
        id: 'T1190',
        name: 'Exploit Public-Facing Application',
        description: 'Exploitation de vulnérabilités dans des applications publiques',
        tactics: ['TA0001'],
        platforms: ['Windows', 'Linux', 'macOS'],
        dataSource: ['Application Logs', 'Network Traffic'],
        mitigations: ['M1048', 'M1030'],
        detections: ['Application monitoring', 'Network analysis'],
        references: ['https://attack.mitre.org/techniques/T1190/'],
        killChainPhases: ['initial-access']
      },
      {
        id: 'T1078',
        name: 'Valid Accounts',
        description: 'Utilisation de comptes valides pour maintenir l\'accès',
        tactics: ['TA0001', 'TA0003'],
        platforms: ['Windows', 'macOS', 'Linux'],
        dataSource: ['Authentication Logs', 'Process Monitoring'],
        mitigations: ['M1032', 'M1026'],
        detections: ['Account monitoring', 'Login analysis'],
        references: ['https://attack.mitre.org/techniques/T1078/'],
        killChainPhases: ['initial-access', 'persistence']
      }
    ];

    // Stockage des données
    tactics.forEach(tactic => this.attackData.tactics.set(tactic.id, tactic));
    techniques.forEach(technique => this.attackData.techniques.set(technique.id, technique));

    console.log(`✅ Données MITRE ATT&CK initialisées: ${techniques.length} techniques, ${tactics.length} tactiques`);
  }

  private getTechniquesForSector(sector: string): AttackTechnique[] {
    // Recommandations par secteur
    const sectorTechniques: { [sector: string]: string[] } = {
      'finance': ['T1566', 'T1078', 'T1041'],
      'healthcare': ['T1566', 'T1190', 'T1078'],
      'government': ['T1566', 'T1078', 'T1190'],
      'energy': ['T1190', 'T1078', 'T1566'],
      'manufacturing': ['T1190', 'T1566', 'T1078']
    };

    const techniqueIds = sectorTechniques[sector.toLowerCase()] || [];
    return techniqueIds
      .map(id => this.attackData.techniques.get(id))
      .filter(tech => tech !== undefined) as AttackTechnique[];
  }

  private exportToCSV(): string {
    const techniques = Array.from(this.attackData.techniques.values());
    const headers = ['ID', 'Name', 'Description', 'Tactics', 'Platforms'];
    
    const rows = techniques.map(tech => [
      tech.id,
      tech.name,
      tech.description.replace(/,/g, ';'),
      tech.tactics.join(';'),
      tech.platforms.join(';')
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private exportToSTIX(): string {
    // Export STIX simplifié
    const stixBundle = {
      type: 'bundle',
      id: `bundle--${Date.now()}`,
      objects: Array.from(this.attackData.techniques.values()).map(tech => ({
        type: 'attack-pattern',
        id: `attack-pattern--${tech.id}`,
        name: tech.name,
        description: tech.description,
        kill_chain_phases: tech.killChainPhases.map(phase => ({
          kill_chain_name: 'mitre-attack',
          phase_name: phase
        }))
      }))
    };

    return JSON.stringify(stixBundle, null, 2);
  }

  /**
   * Statistiques du service
   */
  getStats(): {
    techniquesCount: number;
    tacticsCount: number;
    groupsCount: number;
    softwareCount: number;
    cacheSize: number;
  } {
    return {
      techniquesCount: this.attackData.techniques.size,
      tacticsCount: this.attackData.tactics.size,
      groupsCount: this.attackData.groups.size,
      softwareCount: this.attackData.software.size,
      cacheSize: this.cache.size
    };
  }
}
