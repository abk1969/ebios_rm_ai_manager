/**
 * 🔗 INTÉGRATION ATELIER 1 → ATELIER 2
 * Système de transmission structuré des livrables A1 vers A2
 */

// 🎯 TYPES POUR L'INTÉGRATION A1 → A2
export interface Workshop1Deliverable {
  id: string;
  type: 'context' | 'essential_assets' | 'ecosystem' | 'security_objectives';
  name: string;
  criticality: 'CRITIQUE' | 'MAJEUR' | 'MODÉRÉ' | 'MINEUR';
  description: string;
  dependencies: string[];
  vulnerabilities: string[];
  usageInWorkshop2: string[];
}

export interface CHUContext {
  organizationalScope: OrganizationalScope;
  businessStakes: BusinessStake[];
  regulatoryConstraints: RegulatoryConstraint[];
  securityObjectives: SecurityObjective[];
}

export interface OrganizationalScope {
  sites: SiteInfo[];
  employees: number;
  budget: string;
  specialties: string[];
  timeframe: string;
}

export interface SiteInfo {
  name: string;
  beds: number;
  specialties: string[];
  criticality: string;
}

export interface BusinessStake {
  category: 'vital' | 'economic' | 'regulatory' | 'strategic';
  description: string;
  priority: number;
  impact: string;
}

export interface RegulatoryConstraint {
  regulation: string;
  requirement: string;
  impact: string;
  compliance: string;
}

export interface SecurityObjective {
  domain: 'availability' | 'integrity' | 'confidentiality' | 'traceability';
  system: string;
  target: string;
  justification: string;
}

export interface EssentialAsset {
  id: string;
  name: string;
  category: 'process' | 'information' | 'system' | 'infrastructure' | 'human' | 'partner';
  criticality: 'CRITIQUE' | 'MAJEUR' | 'MODÉRÉ' | 'MINEUR';
  description: string;
  dependencies: string[];
  rto: string;
  rpo: string;
  impactAnalysis: ImpactAnalysis;
  relevantSources: string[];
}

export interface ImpactAnalysis {
  careImpact: number; // 1-5
  financialImpact: number; // 1-5
  regulatoryImpact: number; // 1-5
  reputationImpact: number; // 1-5
  globalScore: number;
}

export interface EcosystemDependency {
  id: string;
  name: string;
  type: 'technology_provider' | 'business_partner' | 'external_infrastructure' | 'service_provider';
  criticality: 'CRITIQUE' | 'MAJEUR' | 'MODÉRÉ' | 'MINEUR';
  services: string[];
  riskLevel: number;
  mitigationStrategies: string[];
  relevantSources: string[];
}

export interface Workshop2Orientation {
  prioritySources: PrioritySource[];
  sourceCategories: SourceCategory[];
  motivationMapping: MotivationMapping[];
  capacityRequirements: CapacityRequirement[];
}

export interface PrioritySource {
  category: string;
  priority: number;
  justification: string;
  relatedAssets: string[];
}

export interface SourceCategory {
  name: string;
  description: string;
  examples: string[];
  relevantAssets: string[];
}

export interface MotivationMapping {
  assetType: string;
  primaryMotivations: string[];
  secondaryMotivations: string[];
  examples: string[];
}

export interface CapacityRequirement {
  securityObjective: string;
  requiredCapacities: string[];
  sophisticationLevel: number;
  examples: string[];
}

/**
 * 🎯 CLASSE PRINCIPALE D'INTÉGRATION A1 → A2
 */
export class Workshop1ToWorkshop2Integration {
  
  // 📊 DONNÉES SIMULÉES ATELIER 1 (Contexte CHU)
  static getCHUContext(): CHUContext {
    return {
      organizationalScope: {
        sites: [
          { name: 'Site Principal', beds: 800, specialties: ['Urgences', 'Réanimation', 'Blocs'], criticality: 'CRITIQUE' },
          { name: 'Site Spécialisé', beds: 250, specialties: ['Cardiologie', 'Neurochirurgie'], criticality: 'MAJEUR' },
          { name: 'Centre Ambulatoire', beds: 150, specialties: ['Consultations', 'Hôpital de jour'], criticality: 'MODÉRÉ' }
        ],
        employees: 3500,
        budget: '450M€/an',
        specialties: ['Urgences', 'Réanimation', 'Cardiologie', 'Neurochirurgie', 'Oncologie', 'Pédiatrie'],
        timeframe: '2024-2027'
      },
      businessStakes: [
        { category: 'vital', description: 'Continuité des soins 24h/24', priority: 1, impact: 'Vies en jeu' },
        { category: 'vital', description: 'Sécurité des patients et personnel', priority: 2, impact: 'Responsabilité pénale' },
        { category: 'regulatory', description: 'Conformité HDS, RGPD, HAS', priority: 3, impact: 'Sanctions, fermeture' },
        { category: 'economic', description: 'Équilibre financier T2A', priority: 4, impact: '450M€ budget' }
      ],
      regulatoryConstraints: [
        { regulation: 'HDS', requirement: 'Hébergement données santé certifié', impact: 'Arrêt activité', compliance: 'Obligatoire' },
        { regulation: 'RGPD', requirement: 'Protection données patients', impact: 'Amendes 4% CA', compliance: 'Obligatoire' },
        { regulation: 'HAS', requirement: 'Certification qualité soins', impact: 'Perte accréditation', compliance: 'Obligatoire' },
        { regulation: 'ANSSI', requirement: 'Déclaration incidents >24h', impact: 'Sanctions administratives', compliance: 'Obligatoire' }
      ],
      securityObjectives: [
        { domain: 'availability', system: 'Urgences vitales', target: '99.99%', justification: 'Vies en jeu' },
        { domain: 'availability', system: 'SIH principal', target: '99.9%', justification: 'Activité hospitalière' },
        { domain: 'integrity', system: 'Prescriptions médicales', target: '100%', justification: 'Sécurité patients' },
        { domain: 'confidentiality', system: 'Données patients', target: 'Secret médical absolu', justification: 'Obligation légale' }
      ]
    };
  }

  // 🏥 BIENS ESSENTIELS IDENTIFIÉS EN ATELIER 1
  static getEssentialAssets(): EssentialAsset[] {
    return [
      {
        id: 'urgences_vitales',
        name: 'Urgences vitales 24h/24',
        category: 'process',
        criticality: 'CRITIQUE',
        description: 'Processus d\'accueil, tri et soins d\'urgence vitale',
        dependencies: ['SIH', 'PACS', 'Laboratoires', 'Personnel médical'],
        rto: '0 minute',
        rpo: '0 minute',
        impactAnalysis: {
          careImpact: 5,
          financialImpact: 4,
          regulatoryImpact: 4,
          reputationImpact: 5,
          globalScore: 5
        },
        relevantSources: [
          'Cybercriminels spécialisés santé (impact maximal)',
          'Terroristes cyber (vies en jeu)',
          'Personnel urgences (accès privilégié)',
          'Prestataires maintenance (équipements vitaux)'
        ]
      },
      {
        id: 'sih_dossiers_patients',
        name: 'SIH - Dossiers patients informatisés',
        category: 'information',
        criticality: 'CRITIQUE',
        description: '500k dossiers patients avec données sensibles RGPD',
        dependencies: ['Serveurs centraux', 'Bases de données', 'Réseaux'],
        rto: '4 heures',
        rpo: '15 minutes',
        impactAnalysis: {
          careImpact: 4,
          financialImpact: 4,
          regulatoryImpact: 5,
          reputationImpact: 4,
          globalScore: 5
        },
        relevantSources: [
          'Trafiquants données médicales (250€/dossier)',
          'États étrangers (espionnage données santé)',
          'Administrateurs IT (accès technique complet)',
          'Personnel soignant (accès fonctionnel large)'
        ]
      },
      {
        id: 'pacs_imagerie',
        name: 'PACS - Images médicales',
        category: 'information',
        criticality: 'CRITIQUE',
        description: '500k images/an, diagnostics critiques',
        dependencies: ['Serveurs PACS', 'Stations visualisation', 'Réseaux'],
        rto: '2 heures',
        rpo: '30 minutes',
        impactAnalysis: {
          careImpact: 4,
          financialImpact: 3,
          regulatoryImpact: 3,
          reputationImpact: 3,
          globalScore: 4
        },
        relevantSources: [
          'Espions industriels (innovations médicales)',
          'Cybercriminels (chantage patients VIP)',
          'Radiologues (accès privilégié images)',
          'Prestataires PACS (accès technique)'
        ]
      },
      {
        id: 'laboratoires_analyses',
        name: 'Laboratoires d\'analyses',
        category: 'process',
        criticality: 'MAJEUR',
        description: 'Analyses biologiques urgentes et programmées',
        dependencies: ['Automates', 'LIS', 'Laboratoires externes'],
        rto: '1 heure',
        rpo: '1 heure',
        impactAnalysis: {
          careImpact: 3,
          financialImpact: 3,
          regulatoryImpact: 3,
          reputationImpact: 2,
          globalScore: 3
        },
        relevantSources: [
          'Laboratoires concurrents (espionnage)',
          'Fraudeurs santé (falsification résultats)',
          'Biologistes (accès résultats sensibles)',
          'Prestataires automates (maintenance)'
        ]
      },
      {
        id: 'centre_donnees',
        name: 'Centre de données principal',
        category: 'infrastructure',
        criticality: 'CRITIQUE',
        description: '200 serveurs physiques, 800 virtuels',
        dependencies: ['Alimentations', 'Climatisation', 'Réseaux', 'Sécurité physique'],
        rto: '4 heures',
        rpo: '1 heure',
        impactAnalysis: {
          careImpact: 5,
          financialImpact: 4,
          regulatoryImpact: 4,
          reputationImpact: 4,
          globalScore: 5
        },
        relevantSources: [
          'Cybercriminels (paralysie complète)',
          'Menaces internes (accès physique)',
          'Prestataires maintenance (accès privilégié)',
          'Saboteurs (impact maximal)'
        ]
      }
    ];
  }

  // 🌐 ÉCOSYSTÈME ET DÉPENDANCES CRITIQUES
  static getEcosystemDependencies(): EcosystemDependency[] {
    return [
      {
        id: 'editeur_sih',
        name: 'Éditeur SIH (fournisseur unique)',
        type: 'technology_provider',
        criticality: 'CRITIQUE',
        services: ['Support 24h/24', 'Maintenance', 'Mises à jour'],
        riskLevel: 10, // Probabilité 2 × Impact 5
        mitigationStrategies: ['Contrat renforcé', 'Plan de continuité', 'Escrow code'],
        relevantSources: [
          'Compromission éditeur (backdoor)',
          'Employés éditeur mécontents',
          'Concurrents (espionnage)',
          'États étrangers (supply chain)'
        ]
      },
      {
        id: 'operateur_telecom',
        name: 'Opérateur télécom principal',
        type: 'external_infrastructure',
        criticality: 'CRITIQUE',
        services: ['Connectivité inter-sites', 'Internet', 'VPN'],
        riskLevel: 12, // Probabilité 3 × Impact 4
        mitigationStrategies: ['Double opérateur', 'Liaisons secours', 'Monitoring'],
        relevantSources: [
          'Panne opérateur (technique)',
          'Cyberattaque infrastructure',
          'Sabotage physique liaisons',
          'Employés opérateur (accès)'
        ]
      },
      {
        id: 'laboratoires_externes',
        name: 'Laboratoires externes (8 partenaires)',
        type: 'business_partner',
        criticality: 'CRITIQUE',
        services: ['Analyses urgentes', 'Analyses spécialisées'],
        riskLevel: 8, // Probabilité 2 × Impact 4
        mitigationStrategies: ['Multi-sourcing', 'Contrats SLA', 'Monitoring'],
        relevantSources: [
          'Compromission laboratoire → CHU',
          'Concurrents laboratoires',
          'Employés laboratoires',
          'Interception transports'
        ]
      }
    ];
  }

  // 🎯 ORIENTATIONS POUR ATELIER 2
  static getWorkshop2Orientations(): Workshop2Orientation {
    return {
      prioritySources: [
        {
          category: 'Cybercriminels spécialisés santé',
          priority: 1,
          justification: 'Ciblent spécifiquement les hôpitaux, rançons élevées',
          relatedAssets: ['urgences_vitales', 'sih_dossiers_patients', 'centre_donnees']
        },
        {
          category: 'États étrangers (espionnage)',
          priority: 2,
          justification: 'Intérêt pour recherche médicale et données santé',
          relatedAssets: ['sih_dossiers_patients', 'pacs_imagerie']
        },
        {
          category: 'Menaces internes privilégiées',
          priority: 3,
          justification: 'Accès légitime aux biens critiques',
          relatedAssets: ['urgences_vitales', 'sih_dossiers_patients', 'centre_donnees']
        }
      ],
      sourceCategories: [
        {
          name: 'Sources externes spécialisées',
          description: 'Menaces ciblant spécifiquement le secteur santé',
          examples: ['Groupes ransomware santé', 'Trafiquants données médicales', 'APT recherche médicale'],
          relevantAssets: ['sih_dossiers_patients', 'pacs_imagerie', 'urgences_vitales']
        },
        {
          name: 'Sources internes hospitalières',
          description: 'Personnel et prestataires avec accès privilégié',
          examples: ['Administrateurs IT', 'Personnel médical', 'Prestataires maintenance'],
          relevantAssets: ['centre_donnees', 'urgences_vitales', 'laboratoires_analyses']
        },
        {
          name: 'Sources écosystème santé',
          description: 'Compromission via partenaires et fournisseurs',
          examples: ['Éditeurs logiciels', 'Laboratoires externes', 'Prestataires cloud'],
          relevantAssets: ['sih_dossiers_patients', 'laboratoires_analyses']
        }
      ],
      motivationMapping: [
        {
          assetType: 'Urgences vitales',
          primaryMotivations: ['Impact maximal (vies)', 'Pression paiement'],
          secondaryMotivations: ['Médiatisation', 'Déstabilisation'],
          examples: ['Ransomware urgences', 'Terrorisme cyber', 'Sabotage interne']
        },
        {
          assetType: 'Données patients',
          primaryMotivations: ['Valeur commerciale', 'Chantage'],
          secondaryMotivations: ['Espionnage', 'Fraude'],
          examples: ['Revente marché noir', 'Usurpation identité', 'Intelligence économique']
        }
      ],
      capacityRequirements: [
        {
          securityObjective: 'Disponibilité 99.99% urgences',
          requiredCapacities: ['DDoS massifs', 'Ransomware sophistiqué', 'Coordination multi-vecteurs'],
          sophisticationLevel: 8,
          examples: ['Botnet >100k machines', 'Ransomware avec destruction sauvegardes']
        },
        {
          securityObjective: 'Intégrité 100% prescriptions',
          requiredCapacities: ['Accès bases données', 'Modification discrète', 'Connaissance médicale'],
          sophisticationLevel: 6,
          examples: ['Corruption admin IT', 'Malware ciblé SIH', 'Ingénierie sociale médecins']
        }
      ]
    };
  }

  // 🔄 MÉTHODES DE TRANSFORMATION A1 → A2
  static transformEssentialAssetsToSources(): string[] {
    const assets = this.getEssentialAssets();
    const allSources: string[] = [];
    
    assets.forEach(asset => {
      allSources.push(...asset.relevantSources);
    });
    
    // Dédoublonnage et tri par priorité
    return [...new Set(allSources)].sort();
  }

  static getSourcePriorityByAssetCriticality(assetId: string): number {
    const asset = this.getEssentialAssets().find(a => a.id === assetId);
    if (!asset) return 0;
    
    switch (asset.criticality) {
      case 'CRITIQUE': return 1;
      case 'MAJEUR': return 2;
      case 'MODÉRÉ': return 3;
      case 'MINEUR': return 4;
      default: return 5;
    }
  }

  static generateHandoverDocument(): any {
    return {
      context: this.getCHUContext(),
      essentialAssets: this.getEssentialAssets(),
      ecosystem: this.getEcosystemDependencies(),
      orientations: this.getWorkshop2Orientations(),
      metadata: {
        generatedAt: new Date().toISOString(),
        version: '1.0',
        workshop: 'A1 → A2 Integration',
        status: 'Ready for Workshop 2'
      }
    };
  }
}
