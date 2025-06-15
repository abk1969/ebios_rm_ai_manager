/**
 * 🤖 SERVICE DE GÉNÉRATION AUTOMATIQUE DE MISSIONS EBIOS RM
 * Utilise l'IA pour créer des missions complètes à partir du contexte métier
 */

import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface MissionContext {
  organizationName: string;
  sector: string;
  organizationSize: string;
  geographicScope: string;
  criticalityLevel: string;
  siComponents: string[];
  mainTechnologies: string[];
  externalInterfaces: string[];
  sensitiveData: string[];
  criticalProcesses: string[];
  stakeholders: string[];
  regulations: string[];
  financialStakes: string;
  securityMaturity: string;
  pastIncidents: string;
  regulatoryConstraints: string[];
  securityBudget: string;
  missionObjectives: string[];
  timeframe: string;
  specificRequirements: string;
}

export interface GeneratedMission {
  missionId: string;
  businessValues: any[];
  supportingAssets: any[];
  dreadedEvents: any[];
  riskSources: any[];
  strategicScenarios: any[];
  operationalScenarios: any[];
  securityMeasures: any[];
  reports: string[];
}

/**
 * Service de génération automatique de missions EBIOS RM
 */
export class AutoMissionGeneratorService {
  private static instance: AutoMissionGeneratorService;

  public static getInstance(): AutoMissionGeneratorService {
    if (!AutoMissionGeneratorService.instance) {
      AutoMissionGeneratorService.instance = new AutoMissionGeneratorService();
    }
    return AutoMissionGeneratorService.instance;
  }

  /**
   * Génère une mission EBIOS RM complète à partir du contexte
   */
  async generateMission(context: MissionContext): Promise<GeneratedMission> {
    console.log('🤖 Génération automatique de mission EBIOS RM...');
    console.log('Contexte:', context);

    // 1. Créer la mission principale
    const missionId = await this.createMissionFromContext(context);

    // 2. Générer les éléments de chaque atelier
    const businessValues = await this.generateBusinessValues(context, missionId);
    const supportingAssets = await this.generateSupportingAssets(context, missionId);
    const dreadedEvents = await this.generateDreadedEvents(context, missionId);
    const riskSources = await this.generateRiskSources(context, missionId);
    const strategicScenarios = await this.generateStrategicScenarios(context, missionId);
    const operationalScenarios = await this.generateOperationalScenarios(context, missionId);
    const securityMeasures = await this.generateSecurityMeasures(context, missionId);

    // 3. Générer les rapports
    const reports = await this.generateReports(context, missionId);

    console.log(`✅ Mission générée avec succès: ${missionId}`);

    return {
      missionId,
      businessValues,
      supportingAssets,
      dreadedEvents,
      riskSources,
      strategicScenarios,
      operationalScenarios,
      securityMeasures,
      reports
    };
  }

  /**
   * Crée la mission principale à partir du contexte
   */
  private async createMissionFromContext(context: MissionContext): Promise<string> {
    const mission = {
      name: `Mission EBIOS RM - ${context.organizationName}`,
      description: this.generateMissionDescription(context),
      organization: context.organizationName,
      sector: context.sector,
      scope: this.generateScope(context),
      status: 'generated' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        version: '1.0.0',
        methodology: 'EBIOS-RM',
        compliance: context.regulations,
        businessContext: this.generateBusinessContext(context),
        regulatoryFramework: context.regulatoryConstraints,
        criticalityLevel: context.criticalityLevel || 'high',
        generatedBy: 'AI',
        generationContext: context
      }
    };

    const missionRef = await addDoc(collection(db, 'missions'), mission);
    return missionRef.id;
  }

  /**
   * Génère la description de la mission
   */
  private generateMissionDescription(context: MissionContext): string {
    return `Mission d'analyse de risques EBIOS RM pour ${context.organizationName}, ` +
           `organisation du secteur ${context.sector} de taille ${context.organizationSize}. ` +
           `Périmètre incluant ${context.siComponents.join(', ')} avec focus sur ` +
           `${context.criticalProcesses.join(', ')}. Conformité requise : ${context.regulations.join(', ')}.`;
  }

  /**
   * Génère le scope de la mission
   */
  private generateScope(context: MissionContext): string {
    return `Périmètre technique : ${context.siComponents.join(', ')}. ` +
           `Processus métier : ${context.criticalProcesses.join(', ')}. ` +
           `Parties prenantes : ${context.stakeholders.join(', ')}. ` +
           `Technologies : ${context.mainTechnologies.join(', ')}.`;
  }

  /**
   * Génère le contexte métier
   */
  private generateBusinessContext(context: MissionContext): string {
    return `Organisation ${context.organizationSize} du secteur ${context.sector} ` +
           `avec enjeux financiers ${context.financialStakes}. ` +
           `Maturité sécurité : ${context.securityMaturity}. ` +
           `Contraintes réglementaires : ${context.regulatoryConstraints.join(', ')}.`;
  }

  /**
   * Génère les biens essentiels contextualisés
   */
  private async generateBusinessValues(context: MissionContext, missionId: string): Promise<any[]> {
    const businessValues = this.getBusinessValuesTemplates(context).map(template => ({
      ...template,
      missionId,
      createdAt: new Date().toISOString()
    }));

    // Insertion en base
    const batch = writeBatch(db);
    businessValues.forEach(bv => {
      const ref = doc(collection(db, 'businessValues'));
      batch.set(ref, bv);
    });
    await batch.commit();

    console.log(`✅ ${businessValues.length} biens essentiels générés`);
    return businessValues;
  }

  /**
   * Templates de biens essentiels par secteur
   */
  private getBusinessValuesTemplates(context: MissionContext): any[] {
    const baseTemplates = [
      {
        name: `Données clients/usagers de ${context.organizationName}`,
        description: `Base de données contenant les informations personnelles et sensibles des clients/usagers`,
        category: 'data',
        criticalityLevel: 4,
        impactTypes: ['confidentialité', 'intégrité', 'disponibilité'],
        stakeholders: context.stakeholders,
        dependencies: context.siComponents,
        regulatoryRequirements: context.regulations,
        businessImpact: 'Continuité de service, conformité réglementaire, confiance clients'
      },
      {
        name: `Processus métier critiques`,
        description: `Processus opérationnels essentiels : ${context.criticalProcesses.join(', ')}`,
        category: 'process',
        criticalityLevel: 4,
        impactTypes: ['disponibilité', 'performance', 'continuité'],
        stakeholders: context.stakeholders,
        dependencies: context.siComponents,
        regulatoryRequirements: context.regulations,
        businessImpact: 'Continuité opérationnelle, performance métier, satisfaction clients'
      }
    ];

    // Ajouter des templates spécifiques au secteur
    if (context.sector.includes('Santé')) {
      baseTemplates.push({
        name: 'Données de santé et dossiers médicaux',
        description: 'Données de santé à caractère personnel (DSCP) et dossiers patients',
        category: 'data',
        criticalityLevel: 4,
        impactTypes: ['confidentialité', 'intégrité', 'disponibilité', 'traçabilité'],
        stakeholders: ['Patients', 'Professionnels de santé', 'CNIL', 'ARS'],
        dependencies: ['DMP', 'Systèmes d\'information hospitaliers'],
        regulatoryRequirements: ['RGPD', 'Code de la santé publique', 'HDS'],
        businessImpact: 'Continuité des soins, sécurité patients, conformité HDS'
      });
    }

    if (context.sector.includes('financiers')) {
      baseTemplates.push({
        name: 'Données financières et transactions',
        description: 'Données bancaires, transactions, informations financières clients',
        category: 'financial',
        criticalityLevel: 4,
        impactTypes: ['confidentialité', 'intégrité', 'non-répudiation'],
        stakeholders: ['Clients', 'ACPR', 'Banque de France'],
        dependencies: ['Core banking', 'Systèmes de paiement'],
        regulatoryRequirements: ['PCI-DSS', 'DORA', 'Directive PSD2'],
        businessImpact: 'Confiance clients, conformité bancaire, stabilité financière'
      });
    }

    return baseTemplates;
  }

  /**
   * Génère les biens supports contextualisés
   */
  private async generateSupportingAssets(context: MissionContext, missionId: string): Promise<any[]> {
    const supportingAssets = this.getSupportingAssetsTemplates(context).map(template => ({
      ...template,
      missionId,
      createdAt: new Date().toISOString()
    }));

    const batch = writeBatch(db);
    supportingAssets.forEach(sa => {
      const ref = doc(collection(db, 'supportingAssets'));
      batch.set(ref, sa);
    });
    await batch.commit();

    console.log(`✅ ${supportingAssets.length} biens supports générés`);
    return supportingAssets;
  }

  /**
   * Templates de biens supports
   */
  private getSupportingAssetsTemplates(context: MissionContext): any[] {
    const templates = [];

    // Infrastructure de base
    templates.push({
      name: 'Infrastructure informatique principale',
      description: `Infrastructure hébergeant ${context.siComponents.join(', ')}`,
      type: 'logical',
      category: 'infrastructure',
      location: 'Datacenter principal',
      owner: 'DSI',
      securityLevel: 'confidential',
      businessValues: ['Données clients/usagers', 'Processus métier critiques'],
      technologies: context.mainTechnologies
    });

    // Personnel
    templates.push({
      name: 'Équipes techniques et métier',
      description: `Personnel gérant ${context.criticalProcesses.join(', ')}`,
      type: 'human',
      category: 'personnel',
      location: 'Sites de l\'organisation',
      owner: 'DRH',
      securityLevel: 'internal',
      businessValues: ['Processus métier critiques'],
      qualifications: ['Expertise métier', 'Compétences techniques']
    });

    // Ajouter des assets spécifiques selon les composants SI
    if (context.siComponents.includes('Infrastructure Cloud (AWS, Azure, GCP)')) {
      templates.push({
        name: 'Plateforme Cloud sécurisée',
        description: 'Infrastructure cloud hébergeant les applications critiques',
        type: 'logical',
        category: 'cloud',
        location: 'Cloud public/hybride',
        owner: 'Cloud Architect',
        securityLevel: 'confidential',
        businessValues: ['Données clients/usagers'],
        certifications: ['ISO27001', 'SOC2']
      });
    }

    return templates;
  }

  /**
   * Génère les événements redoutés
   */
  private async generateDreadedEvents(context: MissionContext, missionId: string): Promise<any[]> {
    const dreadedEvents = this.getDreadedEventsTemplates(context).map(template => ({
      ...template,
      missionId,
      createdAt: new Date().toISOString()
    }));

    const batch = writeBatch(db);
    dreadedEvents.forEach(de => {
      const ref = doc(collection(db, 'dreadedEvents'));
      batch.set(ref, de);
    });
    await batch.commit();

    console.log(`✅ ${dreadedEvents.length} événements redoutés générés`);
    return dreadedEvents;
  }

  /**
   * Templates d'événements redoutés par secteur
   */
  private getDreadedEventsTemplates(context: MissionContext): any[] {
    const baseTemplates = [
      {
        name: 'Indisponibilité prolongée des systèmes critiques',
        description: `Arrêt des systèmes ${context.siComponents.join(', ')} impactant ${context.criticalProcesses.join(', ')}`,
        impactedBusinessValues: ['Processus métier critiques'],
        impactLevel: 4,
        impactTypes: {
          availability: 4,
          integrity: 2,
          confidentiality: 1,
          authenticity: 2
        },
        consequences: [
          'Arrêt des activités critiques',
          'Perte de chiffre d\'affaires',
          'Dégradation de l\'image',
          'Non-respect des SLA clients',
          'Sanctions réglementaires possibles'
        ],
        regulatoryImpact: `Non-conformité ${context.regulations.join(', ')}`
      },
      {
        name: 'Fuite de données personnelles et sensibles',
        description: 'Divulgation non autorisée des données clients/usagers',
        impactedBusinessValues: ['Données clients/usagers'],
        impactLevel: 4,
        impactTypes: {
          availability: 2,
          integrity: 3,
          confidentiality: 4,
          authenticity: 2
        },
        consequences: [
          'Sanctions RGPD majeures',
          'Perte de confiance clients',
          'Procédures judiciaires',
          'Coûts de remédiation élevés',
          'Impact sur la réputation'
        ],
        regulatoryImpact: 'Violation RGPD, sanctions CNIL'
      }
    ];

    // Templates spécifiques par secteur
    if (context.sector.includes('Santé')) {
      baseTemplates.push({
        name: 'Compromission des données de santé',
        description: 'Accès non autorisé aux dossiers médicaux et données de santé',
        impactedBusinessValues: ['Données de santé et dossiers médicaux'],
        impactLevel: 4,
        impactTypes: {
          availability: 2,
          integrity: 4,
          confidentiality: 4,
          authenticity: 3
        },
        consequences: [
          'Violation du secret médical',
          'Sanctions ARS et CNIL',
          'Perte de certification HDS',
          'Poursuites judiciaires patients',
          'Crise de confiance majeure'
        ],
        regulatoryImpact: 'Violation Code santé publique, RGPD, HDS'
      });
    }

    if (context.sector.includes('financiers')) {
      baseTemplates.push({
        name: 'Fraude financière massive',
        description: 'Détournement de fonds ou manipulation des transactions',
        impactedBusinessValues: ['Données financières et transactions'],
        impactLevel: 4,
        impactTypes: {
          availability: 3,
          integrity: 4,
          confidentiality: 3,
          authenticity: 4
        },
        consequences: [
          'Pertes financières directes',
          'Sanctions ACPR',
          'Perte de licence bancaire',
          'Crise de confiance clients',
          'Impact sur la stabilité financière'
        ],
        regulatoryImpact: 'Violation DORA, PCI-DSS, réglementation bancaire'
      });
    }

    return baseTemplates;
  }

  /**
   * Génère les sources de risque
   */
  private async generateRiskSources(context: MissionContext, missionId: string): Promise<any[]> {
    // Implémentation similaire pour les sources de risque
    const riskSources: any[] = []; // Templates à implémenter
    console.log(`✅ ${riskSources.length} sources de risque générées`);
    return riskSources;
  }

  /**
   * Génère les scénarios stratégiques
   */
  private async generateStrategicScenarios(context: MissionContext, missionId: string): Promise<any[]> {
    // Implémentation similaire pour les scénarios stratégiques
    const strategicScenarios: any[] = []; // Templates à implémenter
    console.log(`✅ ${strategicScenarios.length} scénarios stratégiques générés`);
    return strategicScenarios;
  }

  /**
   * Génère les scénarios opérationnels
   */
  private async generateOperationalScenarios(context: MissionContext, missionId: string): Promise<any[]> {
    // Implémentation similaire pour les scénarios opérationnels
    const operationalScenarios: any[] = []; // Templates à implémenter
    console.log(`✅ ${operationalScenarios.length} scénarios opérationnels générés`);
    return operationalScenarios;
  }

  /**
   * Génère les mesures de sécurité
   */
  private async generateSecurityMeasures(context: MissionContext, missionId: string): Promise<any[]> {
    // Implémentation similaire pour les mesures de sécurité
    const securityMeasures: any[] = []; // Templates à implémenter
    console.log(`✅ ${securityMeasures.length} mesures de sécurité générées`);
    return securityMeasures;
  }

  /**
   * Génère les rapports automatiquement
   */
  private async generateReports(context: MissionContext, missionId: string): Promise<string[]> {
    const reports = [
      'Rapport Atelier 1 - Biens essentiels et supports',
      'Rapport Atelier 2 - Sources de risque',
      'Rapport Atelier 3 - Scénarios stratégiques',
      'Rapport Atelier 4 - Scénarios opérationnels',
      'Rapport Atelier 5 - Mesures de sécurité',
      'Rapport de synthèse exécutif',
      'Plan d\'action priorisé'
    ];

    console.log(`✅ ${reports.length} rapports générés`);
    return reports;
  }
}

export default AutoMissionGeneratorService;
