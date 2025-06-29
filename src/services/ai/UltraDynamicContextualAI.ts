/**
 * 🔥 IA ULTRA-DYNAMIQUE CONTEXTUELLE
 * Système d'IA adaptatif en temps réel selon le contexte mission validé
 * 
 * SPÉCIFICITÉS :
 * - Adaptation secteur : Militaire/Défense, Santé, Collectivités, Ministères, Grands groupes
 * - Conformité réglementaire : LPM, RGPD, NIS2, DORA, SOC2, NIST, ISO27001
 * - Suggestions ultra-dynamiques pour workshops 1-5
 * - Logique métier spécifique par contexte organisationnel
 */

import { Mission } from '@/types/ebios';
import { logger } from '../logging/SecureLogger';

// 🎯 INTERFACES ULTRA-DYNAMIQUES

interface UltraDynamicContext {
  // Contexte organisationnel validé
  organizationType: 'military' | 'defense_contractor' | 'hospital' | 'local_government' | 
                   'ministry' | 'large_corporation' | 'subsidiary' | 'critical_infrastructure';
  securityClearance?: 'public' | 'restricted' | 'confidential' | 'secret' | 'top_secret';
  sector: string;
  organizationSize: string;
  
  // Réglementations applicables
  regulations: RegulationType[];
  complianceLevel: 'basic' | 'advanced' | 'expert';
  
  // Contexte opérationnel
  criticalityLevel: 'low' | 'medium' | 'high' | 'critical' | 'vital';
  threatLevel: 'standard' | 'elevated' | 'high' | 'severe';
  
  // Données mission validées
  validatedMissionData: any;
}

type RegulationType = 
  | 'LPM' | 'RGPD' | 'NIS2' | 'DORA' | 'SOC2' | 'NIST' | 'ISO27001'
  | 'ANSSI' | 'PSSIE' | 'RGS' | 'HDS' | 'PCI_DSS' | 'HIPAA' | 'FedRAMP';

interface UltraDynamicSuggestion {
  id: string;
  type: 'critical' | 'regulatory' | 'operational' | 'strategic';
  title: string;
  description: string;
  
  // Contextualisation ultra-dynamique
  sectorSpecific: boolean;
  regulatoryMandatory: boolean;
  securityClearanceRequired?: string;
  threatLevelRelevant: boolean;
  
  // Métadonnées dynamiques
  applicableRegulations: RegulationType[];
  organizationTypes: string[];
  criticalityImpact: number; // 1-10
  implementationComplexity: 'low' | 'medium' | 'high' | 'expert';
  
  // Actions dynamiques
  dynamicContent: string; // Contenu généré en temps réel
  contextualWarnings: string[];
  complianceRequirements: string[];
}

// 🔥 MOTEUR IA ULTRA-DYNAMIQUE

export class UltraDynamicContextualAI {
  private static instance: UltraDynamicContextualAI;
  private regulatoryRules: Map<RegulationType, any> = new Map();
  private sectorLogic: Map<string, any> = new Map();
  
  private constructor() {
    this.initializeRegulatoryRules();
    this.initializeSectorLogic();
  }

  static getInstance(): UltraDynamicContextualAI {
    if (!UltraDynamicContextualAI.instance) {
      UltraDynamicContextualAI.instance = new UltraDynamicContextualAI();
    }
    return UltraDynamicContextualAI.instance;
  }

  // 🎯 INITIALISATION RÈGLES RÉGLEMENTAIRES

  private initializeRegulatoryRules() {
    // LPM - Loi de Programmation Militaire
    this.regulatoryRules.set('LPM', {
      applicableOrganizations: ['military', 'defense_contractor', 'critical_infrastructure'],
      mandatoryRequirements: [
        'Déclaration incidents cyber obligatoire',
        'Audit sécurité annuel ANSSI',
        'Homologation systèmes sensibles',
        'Plan de continuité activité renforcé'
      ],
      workshopSpecificRules: {
        workshop1: ['Identification OIV/OSE', 'Classification données sensibles défense'],
        workshop2: ['Sources risque étatiques', 'Menaces cyber avancées'],
        workshop5: ['Mesures ANSSI obligatoires', 'Supervision 24/7']
      }
    });

    // RGPD
    this.regulatoryRules.set('RGPD', {
      applicableOrganizations: ['all'],
      mandatoryRequirements: [
        'Registre des traitements',
        'Analyse d\'impact DPIA',
        'Désignation DPO si requis',
        'Procédures exercice droits'
      ],
      workshopSpecificRules: {
        workshop1: ['Données personnelles identifiées', 'Finalités traitements'],
        workshop2: ['Risques vie privée', 'Transferts internationaux'],
        workshop5: ['Mesures techniques organisationnelles', 'Privacy by design']
      }
    });

    // NIS2
    this.regulatoryRules.set('NIS2', {
      applicableOrganizations: ['critical_infrastructure', 'large_corporation', 'hospital'],
      mandatoryRequirements: [
        'Mesures cybersécurité appropriées',
        'Gestion incidents cyber',
        'Chaîne d\'approvisionnement sécurisée',
        'Formation personnel dirigeant'
      ],
      workshopSpecificRules: {
        workshop1: ['Services essentiels identifiés', 'Dépendances critiques'],
        workshop2: ['Menaces chaîne approvisionnement', 'Risques systémiques'],
        workshop5: ['Mesures NIS2 obligatoires', 'Supervision continue']
      }
    });

    // DORA - Digital Operational Resilience Act
    this.regulatoryRules.set('DORA', {
      applicableOrganizations: ['financial_services', 'large_corporation'],
      mandatoryRequirements: [
        'Tests résilience opérationnelle',
        'Gestion risques TIC',
        'Surveillance tiers critiques',
        'Partage informations menaces'
      ],
      workshopSpecificRules: {
        workshop1: ['Services financiers critiques', 'Systèmes TIC essentiels'],
        workshop2: ['Risques tiers TIC', 'Concentrations fournisseurs'],
        workshop4: ['Scénarios disruption TIC', 'Tests résilience'],
        workshop5: ['Mesures DORA', 'Monitoring continu']
      }
    });

    // ISO 27001
    this.regulatoryRules.set('ISO27001', {
      applicableOrganizations: ['all'],
      mandatoryRequirements: [
        'SMSI documenté',
        'Analyse risques formalisée',
        'Déclaration applicabilité',
        'Audit interne annuel'
      ],
      workshopSpecificRules: {
        workshop1: ['Périmètre SMSI', 'Actifs informationnels'],
        workshop2: ['Menaces ISO 27005', 'Vulnérabilités techniques'],
        workshop5: ['Contrôles ISO 27002', 'Amélioration continue']
      }
    });

    // SOC 2
    this.regulatoryRules.set('SOC2', {
      applicableOrganizations: ['large_corporation', 'cloud_provider'],
      mandatoryRequirements: [
        'Contrôles sécurité documentés',
        'Tests efficacité opérationnelle',
        'Rapport auditeur indépendant',
        'Surveillance continue'
      ],
      workshopSpecificRules: {
        workshop1: ['Critères confiance services', 'Périmètre audit SOC 2'],
        workshop2: ['Risques prestataires', 'Chaîne approvisionnement'],
        workshop5: ['Contrôles SOC 2', 'Monitoring automatisé']
      }
    });

    // NIST Cybersecurity Framework
    this.regulatoryRules.set('NIST', {
      applicableOrganizations: ['critical_infrastructure', 'large_corporation'],
      mandatoryRequirements: [
        'Fonctions cybersécurité NIST',
        'Profil cybersécurité cible',
        'Plan implémentation',
        'Mesure maturité'
      ],
      workshopSpecificRules: {
        workshop1: ['Identifier actifs critiques', 'Gouvernance cybersécurité'],
        workshop2: ['Détecter menaces', 'Évaluer vulnérabilités'],
        workshop3: ['Protéger infrastructures', 'Contrôles accès'],
        workshop4: ['Répondre incidents', 'Plans continuité'],
        workshop5: ['Récupérer activités', 'Leçons apprises']
      }
    });

    // ANSSI (spécifique France)
    this.regulatoryRules.set('ANSSI', {
      applicableOrganizations: ['military', 'critical_infrastructure', 'ministry'],
      mandatoryRequirements: [
        'Déclaration incidents ANSSI',
        'Homologation systèmes sensibles',
        'Produits qualifiés ANSSI',
        'Audit sécurité périodique'
      ],
      workshopSpecificRules: {
        workshop1: ['Classification données', 'Périmètre homologation'],
        workshop2: ['Menaces nationales', 'Veille ANSSI'],
        workshop5: ['Mesures ANSSI', 'Produits qualifiés']
      }
    });

    // PSSIE (Politique de Sécurité des Systèmes d'Information de l'État)
    this.regulatoryRules.set('PSSIE', {
      applicableOrganizations: ['ministry', 'local_government'],
      mandatoryRequirements: [
        'RSSI désigné',
        'Politique sécurité SI',
        'Homologation RGS',
        'Formation sensibilisation'
      ],
      workshopSpecificRules: {
        workshop1: ['Périmètre administration', 'Classification RGS'],
        workshop2: ['Menaces administration', 'Risques citoyens'],
        workshop5: ['Mesures RGS', 'Conformité PSSIE']
      }
    });
  }

  // 🎯 INITIALISATION LOGIQUE SECTORIELLE

  private initializeSectorLogic() {
    // Secteur Militaire/Défense
    this.sectorLogic.set('military', {
      specificThreats: [
        'Espionnage étatique',
        'Sabotage infrastructures critiques',
        'Guerre informatique',
        'Infiltration chaîne approvisionnement'
      ],
      criticalAssets: [
        'Systèmes d\'armes',
        'Communications tactiques',
        'Renseignement militaire',
        'Logistique opérationnelle'
      ],
      securityMeasures: [
        'Homologation ANSSI',
        'Cloisonnement réseaux',
        'Chiffrement bout en bout',
        'Supervision 24/7'
      ]
    });

    // Secteur Santé
    this.sectorLogic.set('health', {
      specificThreats: [
        'Ransomware ciblé hôpitaux',
        'Vol données patients',
        'Sabotage équipements médicaux',
        'Usurpation identité médicale'
      ],
      criticalAssets: [
        'Dossiers patients',
        'Systèmes imagerie médicale',
        'Équipements vie critique',
        'Bases données recherche'
      ],
      securityMeasures: [
        'Hébergement HDS',
        'Authentification forte',
        'Sauvegarde isolée',
        'Plan continuité soins'
      ]
    });

    // Collectivités Locales
    this.sectorLogic.set('local_government', {
      specificThreats: [
        'Cyberattaques services publics',
        'Désinformation électorale',
        'Sabotage systèmes urbains',
        'Extorsion données citoyens'
      ],
      criticalAssets: [
        'Services aux citoyens',
        'Systèmes de vote',
        'Gestion urbaine',
        'Données démographiques'
      ],
      securityMeasures: [
        'Conformité RGS',
        'Authentification citoyens',
        'Redondance services',
        'Formation agents'
      ]
    });

    // Ministères et Administrations Centrales
    this.sectorLogic.set('ministry', {
      specificThreats: [
        'Espionnage gouvernemental',
        'Sabotage politiques publiques',
        'Déstabilisation institutionnelle',
        'Fuite documents classifiés'
      ],
      criticalAssets: [
        'Documents gouvernementaux',
        'Systèmes interministériels',
        'Communications officielles',
        'Bases données citoyens'
      ],
      securityMeasures: [
        'Classification défense',
        'Réseaux cloisonnés',
        'Habilitations sécurité',
        'Supervision ANSSI'
      ]
    });

    // Grands Groupes et Filiales
    this.sectorLogic.set('large_corporation', {
      specificThreats: [
        'Espionnage industriel',
        'Sabotage concurrentiel',
        'Ransomware ciblé',
        'Manipulation cours bourse'
      ],
      criticalAssets: [
        'Propriété intellectuelle',
        'Données financières',
        'Systèmes de production',
        'Réseaux filiales'
      ],
      securityMeasures: [
        'Gouvernance groupe',
        'SOC centralisé',
        'Audit filiales',
        'Conformité internationale'
      ]
    });

    // Prestataires Défense
    this.sectorLogic.set('defense_contractor', {
      specificThreats: [
        'Infiltration chaîne approvisionnement',
        'Vol technologies sensibles',
        'Compromission sous-traitants',
        'Chantage sécuritaire'
      ],
      criticalAssets: [
        'Technologies duales',
        'Contrats classifiés',
        'Recherche & développement',
        'Chaîne production'
      ],
      securityMeasures: [
        'Agrément défense',
        'Audit sécurité industrielle',
        'Contrôle sous-traitants',
        'Homologation produits'
      ]
    });
  }

  // 🔥 GÉNÉRATION SUGGESTIONS ULTRA-DYNAMIQUES

  async generateUltraDynamicSuggestions(
    workshopNumber: 1 | 2 | 3 | 4 | 5,
    currentStep: string,
    context: UltraDynamicContext,
    existingData: any
  ): Promise<UltraDynamicSuggestion[]> {
    
    logger.info('🔥 Génération suggestions ultra-dynamiques', {
      workshop: workshopNumber,
      step: currentStep,
      organizationType: context.organizationType,
      regulations: context.regulations
    });

    const suggestions: UltraDynamicSuggestion[] = [];

    // 1. Suggestions réglementaires obligatoires
    const regulatorySuggestions = await this.generateRegulatorySuggestions(
      workshopNumber, context
    );
    suggestions.push(...regulatorySuggestions);

    // 2. Suggestions sectorielles spécifiques
    const sectorSuggestions = await this.generateSectorSpecificSuggestions(
      workshopNumber, context, existingData
    );
    suggestions.push(...sectorSuggestions);

    // 3. Suggestions dynamiques selon criticité
    const criticalitySuggestions = await this.generateCriticalitySuggestions(
      workshopNumber, context
    );
    suggestions.push(...criticalitySuggestions);

    // 4. Suggestions adaptatives selon données existantes
    const adaptiveSuggestions = await this.generateAdaptiveSuggestions(
      workshopNumber, currentStep, existingData, context
    );
    suggestions.push(...adaptiveSuggestions);

    // Tri par criticité et pertinence
    return suggestions
      .sort((a, b) => b.criticalityImpact - a.criticalityImpact)
      .slice(0, 10); // Top 10 suggestions les plus pertinentes
  }

  // 🎯 SUGGESTIONS RÉGLEMENTAIRES OBLIGATOIRES

  private async generateRegulatorySuggestions(
    workshopNumber: number,
    context: UltraDynamicContext
  ): Promise<UltraDynamicSuggestion[]> {
    
    const suggestions: UltraDynamicSuggestion[] = [];

    for (const regulation of context.regulations) {
      const rules = this.regulatoryRules.get(regulation);
      if (!rules) continue;

      // Vérifier applicabilité organisation
      if (rules.applicableOrganizations.includes('all') || 
          rules.applicableOrganizations.includes(context.organizationType)) {
        
        const workshopRules = rules.workshopSpecificRules[`workshop${workshopNumber}`];
        if (workshopRules) {
          
          for (const rule of workshopRules) {
            suggestions.push({
              id: `reg_${regulation}_${workshopNumber}_${Date.now()}`,
              type: 'regulatory',
              title: `[${regulation}] ${rule}`,
              description: `Exigence réglementaire ${regulation} obligatoire pour votre organisation`,
              sectorSpecific: false,
              regulatoryMandatory: true,
              threatLevelRelevant: false,
              applicableRegulations: [regulation],
              organizationTypes: rules.applicableOrganizations,
              criticalityImpact: 9, // Très élevé pour obligations réglementaires
              implementationComplexity: 'high',
              dynamicContent: this.generateDynamicRegulatoryContent(regulation, rule, context),
              contextualWarnings: [`Non-conformité ${regulation} = sanctions`],
              complianceRequirements: rules.mandatoryRequirements
            });
          }
        }
      }
    }

    return suggestions;
  }

  // 🎯 SUGGESTIONS SECTORIELLES SPÉCIFIQUES

  private async generateSectorSpecificSuggestions(
    workshopNumber: number,
    context: UltraDynamicContext,
    existingData: any
  ): Promise<UltraDynamicSuggestion[]> {
    
    const suggestions: UltraDynamicSuggestion[] = [];
    const sectorKey = this.mapOrganizationTypeToSector(context.organizationType);
    const sectorLogic = this.sectorLogic.get(sectorKey);
    
    if (!sectorLogic) return suggestions;

    switch (workshopNumber) {
      case 1:
        // Valeurs métier et biens essentiels sectoriels
        for (const asset of sectorLogic.criticalAssets) {
          suggestions.push({
            id: `sector_w1_${asset}_${Date.now()}`,
            type: 'critical',
            title: `Bien essentiel : ${asset}`,
            description: `Actif critique spécifique au secteur ${context.sector}`,
            sectorSpecific: true,
            regulatoryMandatory: false,
            threatLevelRelevant: true,
            applicableRegulations: context.regulations,
            organizationTypes: [context.organizationType],
            criticalityImpact: 8,
            implementationComplexity: 'medium',
            dynamicContent: this.generateDynamicSectorContent(asset, context),
            contextualWarnings: [`Criticité élevée pour ${context.sector}`],
            complianceRequirements: []
          });
        }
        break;

      case 2:
        // Sources de risque sectorielles
        for (const threat of sectorLogic.specificThreats) {
          suggestions.push({
            id: `sector_w2_${threat}_${Date.now()}`,
            type: 'strategic',
            title: `Source de risque : ${threat}`,
            description: `Menace spécifique au secteur ${context.sector}`,
            sectorSpecific: true,
            regulatoryMandatory: false,
            threatLevelRelevant: true,
            applicableRegulations: context.regulations,
            organizationTypes: [context.organizationType],
            criticalityImpact: 7,
            implementationComplexity: 'high',
            dynamicContent: this.generateDynamicThreatContent(threat, context),
            contextualWarnings: [`Menace active dans ${context.sector}`],
            complianceRequirements: []
          });
        }
        break;

      case 5:
        // Mesures de sécurité sectorielles
        for (const measure of sectorLogic.securityMeasures) {
          suggestions.push({
            id: `sector_w5_${measure}_${Date.now()}`,
            type: 'operational',
            title: `Mesure sectorielle : ${measure}`,
            description: `Mesure de sécurité recommandée pour ${context.sector}`,
            sectorSpecific: true,
            regulatoryMandatory: false,
            threatLevelRelevant: true,
            applicableRegulations: context.regulations,
            organizationTypes: [context.organizationType],
            criticalityImpact: 6,
            implementationComplexity: 'medium',
            dynamicContent: this.generateDynamicMeasureContent(measure, context),
            contextualWarnings: [],
            complianceRequirements: []
          });
        }
        break;
    }

    return suggestions;
  }

  // 🎯 MÉTHODES UTILITAIRES

  private mapOrganizationTypeToSector(orgType: string): string {
    const mapping: Record<string, string> = {
      'military': 'military',
      'defense_contractor': 'military',
      'hospital': 'health',
      'local_government': 'local_government',
      'ministry': 'government',
      'large_corporation': 'corporate',
      'subsidiary': 'corporate'
    };
    return mapping[orgType] || 'generic';
  }

  private generateDynamicRegulatoryContent(
    regulation: RegulationType,
    rule: string,
    context: UltraDynamicContext
  ): string {
    return `Conformité ${regulation} requise : ${rule}. 
            Organisation ${context.organizationType} - Criticité ${context.criticalityLevel}.
            Délai mise en conformité selon niveau de maturité actuel.`;
  }

  private generateDynamicSectorContent(asset: string, context: UltraDynamicContext): string {
    return `Actif ${asset} critique pour ${context.organizationType}. 
            Impact potentiel : ${context.criticalityLevel}. 
            Mesures protection adaptées au niveau de menace ${context.threatLevel}.`;
  }

  private generateDynamicThreatContent(threat: string, context: UltraDynamicContext): string {
    return `Menace ${threat} identifiée pour ${context.organizationType}. 
            Probabilité élevée selon contexte ${context.sector}. 
            Surveillance renforcée recommandée.`;
  }

  private generateDynamicMeasureContent(measure: string, context: UltraDynamicContext): string {
    return `Mesure ${measure} adaptée à ${context.organizationType}. 
            Implémentation selon niveau ${context.complianceLevel}. 
            Conformité ${context.regulations.join(', ')}.`;
  }

  // 🔥 SUGGESTIONS PAR NIVEAU DE CRITICITÉ

  private async generateCriticalitySuggestions(
    workshopNumber: number,
    context: UltraDynamicContext
  ): Promise<UltraDynamicSuggestion[]> {

    const suggestions: UltraDynamicSuggestion[] = [];

    // Suggestions selon niveau de criticité organisationnel
    switch (context.criticalityLevel) {
      case 'vital':
        // Organisations vitales (OIV, hôpitaux, défense)
        if (workshopNumber === 1) {
          suggestions.push({
            id: `vital_w1_${Date.now()}`,
            type: 'critical',
            title: 'Classification Secret Défense requise',
            description: 'Données et systèmes nécessitant classification sécurité nationale',
            sectorSpecific: true,
            regulatoryMandatory: true,
            securityClearanceRequired: 'secret',
            threatLevelRelevant: true,
            applicableRegulations: ['LPM', 'ANSSI'],
            organizationTypes: ['military', 'defense_contractor'],
            criticalityImpact: 10,
            implementationComplexity: 'expert',
            dynamicContent: 'Classification obligatoire selon IGI 1300. Homologation ANSSI requise.',
            contextualWarnings: ['Sanctions pénales en cas de manquement'],
            complianceRequirements: ['Habilitation personnel', 'Zones protégées', 'Audit ANSSI']
          });
        }
        break;

      case 'critical':
        // Infrastructures critiques
        if (workshopNumber === 2) {
          suggestions.push({
            id: `critical_w2_${Date.now()}`,
            type: 'strategic',
            title: 'Menaces étatiques avancées (APT)',
            description: 'Groupes de cyberattaquants soutenus par des États',
            sectorSpecific: true,
            regulatoryMandatory: false,
            threatLevelRelevant: true,
            applicableRegulations: ['LPM', 'NIS2'],
            organizationTypes: ['critical_infrastructure', 'military'],
            criticalityImpact: 9,
            implementationComplexity: 'expert',
            dynamicContent: 'Surveillance 24/7 requise. Threat intelligence gouvernementale.',
            contextualWarnings: ['Attaques persistantes probables'],
            complianceRequirements: ['SOC niveau 3', 'Partage renseignement ANSSI']
          });
        }
        break;
    }

    return suggestions;
  }

  // 🔥 SUGGESTIONS ADAPTATIVES SELON DONNÉES EXISTANTES

  private async generateAdaptiveSuggestions(
    workshopNumber: number,
    currentStep: string,
    existingData: any,
    context: UltraDynamicContext
  ): Promise<UltraDynamicSuggestion[]> {

    const suggestions: UltraDynamicSuggestion[] = [];

    // Analyse des données existantes pour suggestions adaptatives
    if (workshopNumber === 1 && existingData.businessValues) {
      // Si valeurs métier incluent "souveraineté", suggérer mesures spécifiques
      const hasSovereignty = existingData.businessValues.some((bv: any) =>
        bv.name?.toLowerCase().includes('souveraineté') ||
        bv.name?.toLowerCase().includes('indépendance')
      );

      if (hasSovereignty && context.organizationType === 'military') {
        suggestions.push({
          id: `adaptive_sovereignty_${Date.now()}`,
          type: 'strategic',
          title: 'Bien essentiel : Données souveraines',
          description: 'Informations critiques pour la souveraineté nationale',
          sectorSpecific: true,
          regulatoryMandatory: true,
          securityClearanceRequired: 'confidential',
          threatLevelRelevant: true,
          applicableRegulations: ['LPM'],
          organizationTypes: ['military', 'defense_contractor'],
          criticalityImpact: 10,
          implementationComplexity: 'expert',
          dynamicContent: 'Hébergement sur territoire national obligatoire. Chiffrement souverain.',
          contextualWarnings: ['Aucun cloud étranger autorisé'],
          complianceRequirements: ['Qualification SecNumCloud', 'Audit souveraineté']
        });
      }
    }

    // Suggestions selon données de santé détectées
    if (existingData.essentialAssets?.some((asset: any) =>
        asset.name?.toLowerCase().includes('patient') ||
        asset.name?.toLowerCase().includes('médical'))) {

      suggestions.push({
        id: `adaptive_health_${Date.now()}`,
        type: 'regulatory',
        title: '[HDS] Hébergement données de santé',
        description: 'Certification HDS obligatoire pour données patients',
        sectorSpecific: true,
        regulatoryMandatory: true,
        threatLevelRelevant: false,
        applicableRegulations: ['HDS', 'RGPD'],
        organizationTypes: ['hospital'],
        criticalityImpact: 9,
        implementationComplexity: 'high',
        dynamicContent: 'Certification HDS requise. Audit annuel obligatoire.',
        contextualWarnings: ['Sanctions CNIL en cas de non-conformité'],
        complianceRequirements: ['Hébergeur certifié HDS', 'Contrat conforme', 'Audit sécurité']
      });
    }

    return suggestions;
  }
}

// Export singleton
export const ultraDynamicAI = UltraDynamicContextualAI.getInstance();
