import type { Mission } from '@/types/ebios';
import type { OrganizationalContext } from '@/infrastructure/agents/workshop/Workshop1Agent';

/**
 * Service de mapping entre le contexte de mission et les contextes des agents IA
 * 
 * Ce service fait le pont entre :
 * - Le contexte riche saisi dans le formulaire de création de mission (MissionContext)
 * - Les contextes spécialisés utilisés par les agents IA (OrganizationalContext, etc.)
 */
export class MissionContextMapper {
  
  /**
   * Convertit le contexte de mission en contexte organisationnel pour les agents
   */
  static mapToOrganizationalContext(mission: Mission): OrganizationalContext | null {
    const missionContext = mission.missionContext;
    
    if (!missionContext) {
      console.warn('🚨 Aucun contexte de mission disponible pour:', mission.name);
      return null;
    }

    console.log('🔄 Mapping du contexte de mission vers contexte organisationnel:', {
      missionName: mission.name,
      organizationName: missionContext.organizationName,
      sector: missionContext.sector,
      size: missionContext.organizationSize
    });

    // Mapping de la taille d'organisation
    const mapOrganizationSize = (size: string): 'small' | 'medium' | 'large' | 'enterprise' => {
      if (size.includes('TPE') || size.includes('1-10')) return 'small';
      if (size.includes('PME') || size.includes('11-250')) return 'medium';
      if (size.includes('ETI') || size.includes('251-5000')) return 'large';
      if (size.includes('Grande') || size.includes('5000+')) return 'enterprise';
      return 'medium'; // Par défaut
    };

    // Mapping du modèle d'affaires basé sur le secteur
    const mapBusinessModel = (sector: string): string => {
      if (sector.includes('Santé') || sector.includes('Hôpital')) return 'healthcare_services';
      if (sector.includes('Finance') || sector.includes('Banque')) return 'financial_services';
      if (sector.includes('Éducation') || sector.includes('Université')) return 'education';
      if (sector.includes('Commerce') || sector.includes('Retail')) return 'retail';
      if (sector.includes('Industrie') || sector.includes('Manufacturing')) return 'manufacturing';
      if (sector.includes('Transport') || sector.includes('Logistique')) return 'logistics';
      if (sector.includes('Énergie') || sector.includes('Utilities')) return 'utilities';
      if (sector.includes('Télécommunications') || sector.includes('IT')) return 'technology';
      return 'services'; // Par défaut
    };

    // Mapping de l'appétit au risque basé sur la maturité sécurité
    const mapRiskAppetite = (securityMaturity: string): 'low' | 'medium' | 'high' => {
      if (securityMaturity.includes('Optimisé') || securityMaturity.includes('Géré')) return 'low';
      if (securityMaturity.includes('Défini') || securityMaturity.includes('Reproductible')) return 'medium';
      return 'high'; // Par défaut pour Initial
    };

    const organizationalContext: OrganizationalContext = {
      sector: missionContext.sector,
      size: mapOrganizationSize(missionContext.organizationSize),
      geographicalPresence: missionContext.geographicScope ? [missionContext.geographicScope] : ['National'],
      regulatoryFramework: missionContext.regulations || [],
      businessModel: mapBusinessModel(missionContext.sector),
      digitalMaturity: this.mapDigitalMaturity(missionContext),
      riskAppetite: mapRiskAppetite(missionContext.securityMaturity || ''),
      previousIncidents: missionContext.pastIncidents ? [missionContext.pastIncidents] : []
    };

    console.log('✅ Contexte organisationnel mappé:', organizationalContext);
    
    return organizationalContext;
  }

  /**
   * Enrichit le contexte organisationnel avec des informations supplémentaires de la mission
   */
  static enrichOrganizationalContext(
    orgContext: OrganizationalContext, 
    mission: Mission
  ): OrganizationalContext {
    const missionContext = mission.missionContext;
    
    if (!missionContext) return orgContext;

    return {
      ...orgContext,
      // Enrichissement avec les composants SI
      criticalAssets: missionContext.siComponents || [],
      // Enrichissement avec les processus critiques
      businessProcesses: missionContext.criticalProcesses || [],
      // Enrichissement avec les parties prenantes
      stakeholders: missionContext.stakeholders || [],
      // Enrichissement avec les technologies principales
      technologies: missionContext.mainTechnologies || [],
      // Enrichissement avec les interfaces externes
      externalInterfaces: missionContext.externalInterfaces || [],
      // Enrichissement avec les données sensibles
      sensitiveDataTypes: missionContext.sensitiveData || [],
      // Enrichissement avec les enjeux financiers
      financialImpact: missionContext.financialStakes || '',
      // Enrichissement avec le budget sécurité
      securityBudget: missionContext.securityBudget || '',
      // Enrichissement avec les objectifs de la mission
      securityObjectives: missionContext.missionObjectives || [],
      // Enrichissement avec les exigences spécifiques
      specificRequirements: missionContext.specificRequirements || ''
    };
  }

  /**
   * Génère un résumé contextuel pour les agents IA
   */
  static generateContextualSummary(mission: Mission): string {
    const missionContext = mission.missionContext;
    
    if (!missionContext) {
      return `Mission ${mission.name} - Contexte limité disponible`;
    }

    const summary = [
      `Organisation: ${missionContext.organizationName}`,
      `Secteur: ${missionContext.sector}`,
      `Taille: ${missionContext.organizationSize}`,
      `Composants SI: ${missionContext.siComponents?.length || 0} identifiés`,
      `Processus critiques: ${missionContext.criticalProcesses?.length || 0} définis`,
      `Réglementations: ${missionContext.regulations?.join(', ') || 'Non spécifiées'}`,
      `Maturité sécurité: ${missionContext.securityMaturity || 'Non évaluée'}`,
      `Délai: ${missionContext.timeframe || 'Non défini'}`
    ];

    return summary.join(' | ');
  }

  /**
   * Vérifie si le contexte de mission est suffisant pour les agents IA
   */
  static validateMissionContext(mission: Mission): {
    isValid: boolean;
    missingFields: string[];
    warnings: string[];
  } {
    const missionContext = mission.missionContext;
    const missingFields: string[] = [];
    const warnings: string[] = [];

    if (!missionContext) {
      return {
        isValid: false,
        missingFields: ['missionContext'],
        warnings: ['Aucun contexte de mission disponible - Les agents IA utiliseront des valeurs par défaut']
      };
    }

    // Vérification des champs essentiels
    if (!missionContext.organizationName) missingFields.push('organizationName');
    if (!missionContext.sector) missingFields.push('sector');
    if (!missionContext.organizationSize) missingFields.push('organizationSize');

    // Vérification des champs importants pour l'IA
    if (!missionContext.siComponents || missionContext.siComponents.length === 0) {
      warnings.push('Aucun composant SI défini - Les suggestions IA seront génériques');
    }
    if (!missionContext.criticalProcesses || missionContext.criticalProcesses.length === 0) {
      warnings.push('Aucun processus critique défini - L\'analyse de risque sera limitée');
    }
    if (!missionContext.regulations || missionContext.regulations.length === 0) {
      warnings.push('Aucune réglementation spécifiée - Les recommandations de conformité seront génériques');
    }

    return {
      isValid: missingFields.length === 0,
      missingFields,
      warnings
    };
  }

  /**
   * Mappe la maturité numérique basée sur les informations disponibles
   */
  private static mapDigitalMaturity(missionContext: any): 'basic' | 'intermediate' | 'advanced' {
    // Analyse basée sur les technologies et composants SI
    const technologies = missionContext.mainTechnologies || [];
    const siComponents = missionContext.siComponents || [];
    
    const advancedTech = ['cloud', 'ai', 'machine learning', 'blockchain', 'iot', 'api'];
    const intermediateTech = ['erp', 'crm', 'database', 'web services', 'mobile'];
    
    const hasAdvancedTech = technologies.some((tech: string) => 
      advancedTech.some(advanced => tech.toLowerCase().includes(advanced))
    );
    
    const hasIntermediateTech = technologies.some((tech: string) => 
      intermediateTech.some(intermediate => tech.toLowerCase().includes(intermediate))
    );

    if (hasAdvancedTech || siComponents.length > 10) return 'advanced';
    if (hasIntermediateTech || siComponents.length > 5) return 'intermediate';
    return 'basic';
  }

  /**
   * Génère des insights contextuels pour les agents IA
   */
  static generateContextualInsights(mission: Mission): string[] {
    const missionContext = mission.missionContext;
    const insights: string[] = [];
    
    if (!missionContext) return insights;

    // Insights basés sur le secteur
    if (missionContext.sector.includes('Santé')) {
      insights.push('Secteur de la santé: Exposition élevée aux risques de confidentialité des données patients');
      insights.push('Réglementation HDS et RGPD particulièrement critiques');
    }
    
    if (missionContext.sector.includes('Finance')) {
      insights.push('Secteur financier: Cible privilégiée des cyberattaques et forte réglementation');
      insights.push('Risques de fraude et de blanchiment à considérer');
    }

    // Insights basés sur la taille
    if (missionContext.organizationSize.includes('TPE') || missionContext.organizationSize.includes('PME')) {
      insights.push('Petite/moyenne organisation: Ressources sécurité limitées, besoin de solutions pragmatiques');
    }

    // Insights basés sur la maturité sécurité
    if (missionContext.securityMaturity === 'Initial') {
      insights.push('Maturité sécurité initiale: Prioriser les mesures de base et la sensibilisation');
    }

    return insights;
  }
}

export default MissionContextMapper;
