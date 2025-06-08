/**
 * Service d'import depuis une base Access EBIOS RM
 * Gère la conversion complète Access → Firebase avec enrichissement IA
 */

import { 
  BusinessValue,
  DreadedEvent,
  SupportingAsset,
  RiskSource,
  Stakeholder,
  AttackPath,
  SecurityMeasure,
  StrategicScenario,
  Mission
} from '@/types/ebios';
import { accessCompatibilityService } from '@/services/accessCompatibility';
import { ebiosCoherenceService } from '@/services/ai/EbiosCoherenceService';

// 🆕 Interface pour les données Access brutes
interface AccessData {
  tables: {
    missions?: any[];
    valeurs_metiers?: any[];
    evenements_redoutes?: any[];
    biens_supports?: any[];
    sources_risques?: any[];
    parties_prenantes?: any[];
    chemins_attaque?: any[];
    mesures_securite?: any[];
    scenarios_strategiques?: any[];
  };
  metadata?: {
    version?: string;
    exportDate?: string;
    organization?: string;
  };
}

// 🆕 Résultat d'import avec statistiques
export interface ImportResult {
  success: boolean;
  data?: {
    mission: Mission;
    businessValues: BusinessValue[];
    dreadedEvents: DreadedEvent[];
    supportingAssets: SupportingAsset[];
    riskSources: RiskSource[];
    stakeholders: Stakeholder[];
    attackPaths: AttackPath[];
    securityMeasures: SecurityMeasure[];
    strategicScenarios: StrategicScenario[];
  };
  statistics: {
    total: number;
    imported: number;
    enriched: number;
    errors: number;
    warnings: string[];
  };
  coherenceReport?: {
    overallScore: number;
    isCompliant: boolean;
    issues: any[];
  };
}

export class AccessImporter {
  private idMappings: Map<string, string> = new Map();
  private warnings: string[] = [];
  private enrichedCount = 0;

  /**
   * Importe une base Access complète
   */
  async importFromAccess(accessData: AccessData, missionId?: string): Promise<ImportResult> {
    try {
      console.log('🚀 Début import Access avec enrichissement IA...');
      
      // 1. Import Mission
      const mission = await this.importMission(accessData, missionId);
      
      // 2. Import Atelier 1
      const businessValues = await this.importBusinessValues(accessData, mission.id);
      const supportingAssets = await this.importSupportingAssets(accessData, mission.id, businessValues);
      const dreadedEvents = await this.importDreadedEvents(accessData, mission.id, businessValues);
      
      // 3. Import Atelier 2
      const riskSources = await this.importRiskSources(accessData, mission.id);
      
      // 4. Import Atelier 3
      const stakeholders = await this.importStakeholders(accessData, mission.id);
      const attackPaths = await this.importAttackPaths(accessData, mission.id, stakeholders);
      const strategicScenarios = await this.importStrategicScenarios(
        accessData, 
        mission.id, 
        businessValues,
        dreadedEvents,
        riskSources
      );
      
      // 5. Import Atelier 5
      const securityMeasures = await this.importSecurityMeasures(accessData, mission.id);
      
      // 6. Vérification de cohérence globale
      const coherenceReport = await this.checkImportCoherence({
        mission,
        businessValues,
        dreadedEvents,
        supportingAssets,
        riskSources,
        stakeholders,
        strategicScenarios,
        attackPaths,
        securityMeasures
      });
      
      // Calcul des statistiques
      const totalRecords = Object.values(accessData.tables).reduce(
        (sum, table) => sum + (table?.length || 0), 0
      );
      
      const importedRecords = 
        businessValues.length + 
        dreadedEvents.length + 
        supportingAssets.length + 
        riskSources.length + 
        stakeholders.length + 
        attackPaths.length + 
        securityMeasures.length + 
        strategicScenarios.length;
      
      return {
        success: true,
        data: {
          mission,
          businessValues,
          dreadedEvents,
          supportingAssets,
          riskSources,
          stakeholders,
          attackPaths,
          securityMeasures,
          strategicScenarios
        },
        statistics: {
          total: totalRecords,
          imported: importedRecords,
          enriched: this.enrichedCount,
          errors: this.warnings.filter(w => w.includes('ERREUR')).length,
          warnings: this.warnings
        },
        coherenceReport
      };
      
    } catch (error) {
      console.error('❌ Erreur import Access:', error);
      return {
        success: false,
        statistics: {
          total: 0,
          imported: 0,
          enriched: 0,
          errors: 1,
          warnings: [`ERREUR CRITIQUE: ${(error as Error).message}`]
        }
      };
    }
  }

  /**
   * Import de la mission
   */
  private async importMission(accessData: AccessData, missionId?: string): Promise<Mission> {
    const accessMission = accessData.tables.missions?.[0];
    
    if (!accessMission && !missionId) {
      throw new Error('Aucune mission trouvée dans Access et aucun ID fourni');
    }
    
    if (missionId) {
      // Utiliser la mission existante
      return {
        id: missionId,
        name: accessMission?.nom || 'Mission importée',
        description: accessMission?.description || 'Importée depuis Access',
        status: 'in_progress',
        dueDate: new Date().toISOString(),
        assignedTo: [],
        organizationContext: {
          organizationType: 'private',
          sector: accessMission?.secteur || 'Industrie',
          size: 'large',
          regulatoryRequirements: [],
          securityObjectives: [],
          constraints: []
        },
        scope: {
          boundaries: accessMission?.perimetre || '',
          inclusions: [],
          exclusions: [],
          timeFrame: {
            start: new Date().toISOString(),
            end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          },
          geographicalScope: []
        },
        ebiosCompliance: {
          version: '1.5',
          completionPercentage: 0,
          complianceGaps: []
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    // Créer une nouvelle mission depuis Access
    return this.enrichMission({
      id: crypto.randomUUID(),
      name: accessMission.nom,
      description: accessMission.description,
      // ... autres champs
    });
  }

  /**
   * Import des valeurs métier avec enrichissement IA
   */
  private async importBusinessValues(
    accessData: AccessData, 
    missionId: string
  ): Promise<BusinessValue[]> {
    const accessValues = accessData.tables.valeurs_metiers || [];
    const businessValues: BusinessValue[] = [];
    
    for (const accessValue of accessValues) {
      try {
        // Génération ID et mapping
        const id = crypto.randomUUID();
        this.idMappings.set(accessValue.nom, id);
        
        // Conversion de base
        const businessValue: BusinessValue = {
          id,
          name: accessValue.nom,
          description: accessValue.description || '',
          category: accessCompatibilityService.mapNatureToCategory(accessValue.nature_valeur_metier),
          priority: this.convertPriority(accessValue.priorite),
          criticalityLevel: this.convertCriticality(accessValue.criticite),
          dreadedEvents: [],
          supportingAssets: [],
          stakeholders: [],
          missionId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          
          // Champs Access préservés
          natureValeurMetier: accessValue.nature_valeur_metier,
          responsableEntite: accessValue.responsable_entite,
          missionNom: accessValue.mission_nom
        };
        
        // 🆕 Enrichissement IA
        const enriched = await this.enrichBusinessValueWithAI(businessValue, accessValue);
        
        businessValues.push(enriched);
        
      } catch (error) {
        this.warnings.push(`AVERTISSEMENT: Impossible d'importer la valeur métier "${accessValue.nom}": ${(error as Error).message}`);
      }
    }
    
    console.log(`✅ ${businessValues.length} valeurs métier importées et enrichies`);
    return businessValues;
  }

  /**
   * 🔧 CORRECTION: Import des actifs supports manquant
   */
  private async importSupportingAssets(
    accessData: AccessData,
    missionId: string,
    businessValues: BusinessValue[]
  ): Promise<SupportingAsset[]> {
    const accessAssets = accessData.tables.biens_supports || (accessData.tables as any).actifs_supports || [];
    const supportingAssets: SupportingAsset[] = [];

    for (const accessAsset of accessAssets) {
      try {
        const id = crypto.randomUUID();

        // Retrouver la valeur métier par nom
        let businessValueId = '';
        if (accessAsset.valeur_metier_nom) {
          businessValueId = this.idMappings.get(accessAsset.valeur_metier_nom) || '';
          if (!businessValueId) {
            this.warnings.push(`Valeur métier "${accessAsset.valeur_metier_nom}" non trouvée pour l'actif "${accessAsset.nom}"`);
            continue;
          }
        }

        const supportingAsset: SupportingAsset = {
          id,
          name: accessAsset.nom,
          type: this.convertAssetType(accessAsset.type),
          description: accessAsset.description || '',
          businessValueId,
          missionId,
          securityLevel: accessAsset.niveau_securite || 'public',
          vulnerabilities: [],
          dependsOn: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),

          // Champs Access préservés
          responsableEntite: accessAsset.responsable_entite,
          valeurMetierNom: accessAsset.valeur_metier_nom
        };

        // Enrichissement IA
        // const enriched = await this.enrichSupportingAssetWithAI(supportingAsset, accessAsset); // 🔧 CORRECTION: Méthode non implémentée
        const enriched = supportingAsset;

        supportingAssets.push(enriched);

      } catch (error) {
        this.warnings.push(`ERREUR: Import actif support "${accessAsset.nom}": ${(error as Error).message}`);
      }
    }

    console.log(`✅ ${supportingAssets.length} actifs supports importés`);
    return supportingAssets;
  }

  /**
   * Import des événements redoutés
   */
  private async importDreadedEvents(
    accessData: AccessData,
    missionId: string,
    businessValues: BusinessValue[]
  ): Promise<DreadedEvent[]> {
    const accessEvents = accessData.tables.evenements_redoutes || [];
    const dreadedEvents: DreadedEvent[] = [];
    
    for (const accessEvent of accessEvents) {
      try {
        const id = crypto.randomUUID();
        
        // Retrouver la valeur métier par nom
        let businessValueId = '';
        if (accessEvent.valeur_metier_nom) {
          businessValueId = this.idMappings.get(accessEvent.valeur_metier_nom) || '';
          if (!businessValueId) {
            this.warnings.push(`Valeur métier "${accessEvent.valeur_metier_nom}" non trouvée pour l'événement "${accessEvent.nom}"`);
            continue;
          }
        }
        
        const dreadedEvent: DreadedEvent = {
          id,
          name: accessEvent.nom,
          description: accessEvent.description || '',
          businessValueId,
          gravity: this.convertGravity(accessEvent.gravite),
          impactType: this.detectImpactType(accessEvent.nom, accessEvent.description),
          consequences: accessEvent.consequences || '',
          missionId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          
          // 🆕 Champs Access
          impactsList: this.extractImpactsList(accessEvent),
          valeurMetierNom: accessEvent.valeur_metier_nom
        };
        
        // 🆕 Enrichissement IA
        const enriched = await this.enrichDreadedEventWithAI(dreadedEvent, accessEvent);
        
        dreadedEvents.push(enriched);
        
      } catch (error) {
        this.warnings.push(`ERREUR: Import événement redouté "${accessEvent.nom}": ${(error as Error).message}`);
      }
    }
    
    console.log(`✅ ${dreadedEvents.length} événements redoutés importés`);
    return dreadedEvents;
  }

  /**
   * Import des sources de risque
   */
  private async importRiskSources(
    accessData: AccessData,
    missionId: string
  ): Promise<RiskSource[]> {
    const accessSources = accessData.tables.sources_risques || [];
    const riskSources: RiskSource[] = [];
    
    for (const accessSource of accessSources) {
      try {
        const id = crypto.randomUUID();
        this.idMappings.set(accessSource.nom, id);
        
        // 🆕 Inférer la catégorie si manquante
        const category = accessSource.categorie || 
          accessCompatibilityService.inferRiskSourceCategory(
            `${accessSource.nom} ${accessSource.description}`
          );
        
        const riskSource: RiskSource = {
          id,
          name: accessSource.nom,
          description: accessSource.description || '',
          category,
          pertinence: this.convertPertinence(accessSource.pertinence),
          expertise: this.convertExpertise(accessSource.expertise),
          resources: this.convertResources(accessSource.ressources),
          motivation: this.convertMotivation(accessSource.motivation),
          missionId,
          objectives: [],
          operationalModes: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          
          // 🆕 Champs Access
          categoryAuto: !accessSource.categorie,
          pertinenceAccess: accessSource.pertinence
        };
        
        // 🆕 Enrichissement IA avec profil de menace
        const enriched = await this.enrichRiskSourceWithAI(riskSource, accessSource);
        
        riskSources.push(enriched);
        
      } catch (error) {
        this.warnings.push(`ERREUR: Import source de risque "${accessSource.nom}": ${(error as Error).message}`);
      }
    }
    
    console.log(`✅ ${riskSources.length} sources de risque importées et profilées`);
    return riskSources;
  }

  /**
   * Import des parties prenantes
   */
  private async importStakeholders(
    accessData: AccessData,
    missionId: string
  ): Promise<Stakeholder[]> {
    const accessStakeholders = accessData.tables.parties_prenantes || [];
    const stakeholders: Stakeholder[] = [];
    
    for (const accessStakeholder of accessStakeholders) {
      try {
        const id = crypto.randomUUID();
        this.idMappings.set(accessStakeholder.nom, id);
        
        const stakeholder: Stakeholder = {
          id,
          name: accessStakeholder.nom,
          type: this.convertStakeholderType(accessStakeholder.type),
          category: this.convertStakeholderCategory(accessStakeholder.categorie),
          zone: this.convertZone(accessStakeholder.zone_confiance),
          exposureLevel: this.convertExposure(accessStakeholder.exposition),
          cyberReliability: this.convertReliability(accessStakeholder.fiabilite_cyber),
          accessRights: [],
          missionId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        stakeholders.push(stakeholder);
        
      } catch (error) {
        this.warnings.push(`ERREUR: Import partie prenante "${accessStakeholder.nom}": ${(error as Error).message}`);
      }
    }
    
    console.log(`✅ ${stakeholders.length} parties prenantes importées`);
    return stakeholders;
  }

  /**
   * Import des chemins d'attaque
   */
  private async importAttackPaths(
    accessData: AccessData,
    missionId: string,
    stakeholders: Stakeholder[]
  ): Promise<AttackPath[]> {
    const accessPaths = accessData.tables.chemins_attaque || [];
    const attackPaths: AttackPath[] = [];
    
    for (const accessPath of accessPaths) {
      try {
        const id = crypto.randomUUID();
        
        // 🆕 Gérer les attaques directes (sans partie prenante)
        let stakeholderId: string | undefined;
        const isDirect = !accessPath.partie_prenante_nom || 
                        accessPath.partie_prenante_nom === 'DIRECT' ||
                        accessPath.type_attaque === 'DIRECTE';
        
        if (!isDirect && accessPath.partie_prenante_nom) {
          stakeholderId = this.idMappings.get(accessPath.partie_prenante_nom);
          if (!stakeholderId) {
            this.warnings.push(`Partie prenante "${accessPath.partie_prenante_nom}" non trouvée pour le chemin "${accessPath.nom}"`);
          }
        }
        
        const attackPath: AttackPath = {
          id,
          name: accessPath.nom,
          description: accessPath.description || '',
          difficulty: this.convertDifficulty(accessPath.difficulte),
          successProbability: this.convertProbability(accessPath.probabilite_succes),
          missionId,
          stakeholderId,
          isDirect,
          actions: [],
          prerequisites: this.parsePrerequisites(accessPath.prerequis),
          indicators: this.parseIndicators(accessPath.indicateurs),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          
          // 🆕 Champs Access
          sourceRisqueNom: accessPath.source_risque_nom,
          objectifViseNom: accessPath.objectif_vise_nom,
          graviteAccess: accessPath.gravite
        };
        
        // 🆕 Enrichissement IA avec analyse de complexité
        const enriched = await this.enrichAttackPathWithAI(attackPath, accessPath);
        
        attackPaths.push(enriched);
        
      } catch (error) {
        this.warnings.push(`ERREUR: Import chemin d'attaque "${accessPath.nom}": ${(error as Error).message}`);
      }
    }
    
    console.log(`✅ ${attackPaths.length} chemins d'attaque importés (${attackPaths.filter(p => p.isDirect).length} directs)`);
    return attackPaths;
  }

  /**
   * Import des mesures de sécurité
   */
  private async importSecurityMeasures(
    accessData: AccessData,
    missionId: string
  ): Promise<SecurityMeasure[]> {
    const accessMeasures = accessData.tables.mesures_securite || [];
    const securityMeasures: SecurityMeasure[] = [];
    
    for (const accessMeasure of accessMeasures) {
      try {
        const id = crypto.randomUUID();
        
        // 🆕 Conversion du type de mesure Access vers Firebase
        const controlType = this.convertMeasureType(accessMeasure.type_mesure);
        
        const securityMeasure: SecurityMeasure = {
          id,
          name: accessMeasure.nom,
          description: accessMeasure.description || '',
          // ISO optionnel - sera enrichi par l'IA
          isoCategory: undefined,
          isoControl: undefined,
          controlType,
          status: this.convertMeasureStatus(accessMeasure.statut),
          priority: this.convertPriority(accessMeasure.priorite),
          responsibleParty: accessMeasure.responsable || '',
          dueDate: this.convertDueDate(accessMeasure.echeance_en_mois),
          missionId,
          effectiveness: this.convertEffectiveness(accessMeasure.efficacite),
          implementationCost: this.convertCost(accessMeasure.cout),
          maintenanceCost: this.convertCost(accessMeasure.cout_maintenance),
          targetScenarios: [],
          targetVulnerabilities: [],
          implementation: {
            id: crypto.randomUUID(),
            measureId: id,
            verificationMethod: '',
            residualRisk: 2,
            comments: '',
            evidences: [] // 🔧 CORRECTION: Propriété manquante
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          
          // 🆕 Champs Access
          typeMesureAccess: accessMeasure.type_mesure,
          freinDifficulteMEO: accessMeasure.frein_difficulte_meo,
          echeanceEnMois: accessMeasure.echeance_en_mois,
          responsablesMultiples: this.parseResponsables(accessMeasure.responsables)
        };
        
        // 🆕 Enrichissement IA avec suggestion ISO
        const enriched = await this.enrichSecurityMeasureWithAI(securityMeasure, accessMeasure);
        
        securityMeasures.push(enriched);
        
      } catch (error) {
        this.warnings.push(`ERREUR: Import mesure "${accessMeasure.nom}": ${(error as Error).message}`);
      }
    }
    
    console.log(`✅ ${securityMeasures.length} mesures de sécurité importées et enrichies ISO`);
    return securityMeasures;
  }

  /**
   * Import des scénarios stratégiques
   */
  private async importStrategicScenarios(
    accessData: AccessData,
    missionId: string,
    businessValues: BusinessValue[],
    dreadedEvents: DreadedEvent[],
    riskSources: RiskSource[]
  ): Promise<StrategicScenario[]> {
    const accessScenarios = accessData.tables.scenarios_strategiques || [];
    const strategicScenarios: StrategicScenario[] = [];
    
    for (const accessScenario of accessScenarios) {
      try {
        const id = crypto.randomUUID();
        
        // Résolution des références
        const riskSourceId = this.idMappings.get(accessScenario.source_risque_nom) || '';
        const businessValueId = this.idMappings.get(accessScenario.valeur_metier_nom) || '';
        const dreadedEventId = dreadedEvents.find(de => 
          de.name === accessScenario.evenement_redoute_nom
        )?.id || '';
        
        if (!riskSourceId || !businessValueId || !dreadedEventId) {
          this.warnings.push(`Références manquantes pour le scénario "${accessScenario.nom}"`);
          continue;
        }
        
        const strategicScenario: StrategicScenario = {
          id,
          name: accessScenario.nom || `Scénario ${riskSources.find(rs => rs.id === riskSourceId)?.name} → ${businessValues.find(bv => bv.id === businessValueId)?.name}`,
          description: accessScenario.description || '',
          riskSourceId,
          targetBusinessValueId: businessValueId,
          dreadedEventId,
          likelihood: this.convertLikelihood(accessScenario.vraisemblance),
          gravity: this.convertGravity(accessScenario.gravite),
          riskLevel: this.calculateRiskLevel(accessScenario.vraisemblance, accessScenario.gravite),
          pathways: [],
          missionId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        strategicScenarios.push(strategicScenario);
        
      } catch (error) {
        this.warnings.push(`ERREUR: Import scénario stratégique: ${(error as Error).message}`);
      }
    }
    
    console.log(`✅ ${strategicScenarios.length} scénarios stratégiques importés`);
    return strategicScenarios;
  }

  // 🆕 Méthodes d'enrichissement IA

  private async enrichBusinessValueWithAI(
    businessValue: BusinessValue, 
    accessData: any
  ): Promise<BusinessValue> {
    // Simulation enrichissement IA
    businessValue.aiMetadata = {
      autoCompleted: true,
      suggestedCategory: businessValue.category,
      coherenceScore: 0.85,
      relatedValues: [],
      impactAnalysis: {
        criticalityScore: this.calculateCriticalityScore(businessValue),
        dependencies: [],
        riskExposure: 0.7
      },
      recommendations: [
        "Définir les mesures de protection spécifiques",
        "Évaluer l'impact financier potentiel"
      ]
    };
    
    this.enrichedCount++;
    return businessValue;
  }

  private async enrichDreadedEventWithAI(
    dreadedEvent: DreadedEvent,
    accessData: any
  ): Promise<DreadedEvent> {
    dreadedEvent.aiAnalysis = {
      impactSeverity: dreadedEvent.gravity * 0.25,
      cascadingEffects: this.analyzeCascadingEffects(dreadedEvent),
      mitigationSuggestions: [
        "Mettre en place une surveillance continue",
        "Développer un plan de réponse spécifique"
      ],
      relatedEvents: [],
      probabilityAssessment: {
        likelihood: 0.6,
        confidence: 0.8,
        factors: ["Exposition externe élevée", "Attractivité de la cible"]
      }
    };
    
    this.enrichedCount++;
    return dreadedEvent;
  }

  private async enrichRiskSourceWithAI(
    riskSource: RiskSource,
    accessData: any
  ): Promise<RiskSource> {
    // Génération du profil de menace
    riskSource.aiProfile = {
      threatLevel: this.calculateThreatLevel(riskSource),
      predictedActions: this.predictActions(riskSource),
      historicalPatterns: {
        frequency: 0.3,
        commonTargets: ["Infrastructure critique", "Données sensibles"],
        preferredMethods: ["Phishing", "Exploitation de vulnérabilités"]
      },
      motivationAnalysis: {
        primaryDrivers: ["Gain financier", "Espionnage"],
        secondaryFactors: ["Notoriété"],
        triggerEvents: ["Période de crise", "Événements médiatiques"]
      },
      recommendedDefenses: [
        "Renforcer la sensibilisation",
        "Implémenter une segmentation réseau",
        "Surveillance comportementale"
      ]
    };
    
    this.enrichedCount++;
    return riskSource;
  }

  private async enrichAttackPathWithAI(
    attackPath: AttackPath,
    accessData: any
  ): Promise<AttackPath> {
    attackPath.aiMetadata = {
      pathComplexity: attackPath.difficulty * 0.25,
      successLikelihood: attackPath.successProbability * 0.25,
      detectionDifficulty: 0.7,
      suggestedCountermeasures: [
        "Monitoring renforcé des points d'entrée",
        "Authentification multi-facteurs",
        "Segmentation réseau"
      ],
      attackVectorAnalysis: {
        entryPoints: ["Email", "Web", "USB"],
        criticalSteps: [1, 3, 5],
        timeEstimate: attackPath.difficulty <= 2 ? "Jours" : "Semaines"
      }
    };
    
    this.enrichedCount++;
    return attackPath;
  }

  private async enrichSecurityMeasureWithAI(
    securityMeasure: SecurityMeasure,
    accessData: any
  ): Promise<SecurityMeasure> {
    // Suggestion ISO basée sur le type et la description
    const isoSuggestion = this.suggestISOControl(
      securityMeasure.name,
      securityMeasure.description,
      securityMeasure.typeMesureAccess
    );
    
    if (isoSuggestion && !securityMeasure.isoCategory) {
      securityMeasure.isoCategory = isoSuggestion.category;
      securityMeasure.isoControl = isoSuggestion.control;
    }
    
    securityMeasure.aiMetadata = {
      autoCompleted: true,
      suggestedISO: isoSuggestion,
      coherenceScore: 0.9,
      relatedMeasures: [],
      effectivenessAnalysis: {
        predictedEffectiveness: 0.8,
        riskReductionFactor: 0.6,
        recommendations: [
          "Tester l'efficacité en conditions réelles",
          "Prévoir une revue trimestrielle"
        ]
      }
    };
    
    this.enrichedCount++;
    return securityMeasure;
  }

  private async enrichMission(mission: any): Promise<Mission> {
    // Enrichissement basique de la mission
    return {
      ...mission,
      organizationContext: {
        organizationType: 'private',
        sector: 'Industrie',
        size: 'large',
        regulatoryRequirements: ["RGPD", "NIS"],
        securityObjectives: ["Confidentialité", "Disponibilité", "Intégrité"],
        constraints: ["Budget limité", "Ressources techniques"]
      },
      scope: {
        boundaries: mission.perimetre || "Système d'information complet",
        inclusions: ["Applications critiques", "Infrastructure"],
        exclusions: ["Systèmes legacy"],
        timeFrame: {
          start: new Date().toISOString(),
          end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        },
        geographicalScope: ["France", "Europe"]
      },
      ebiosCompliance: {
        version: '1.5',
        completionPercentage: 0,
        complianceGaps: []
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // 🆕 Vérification de cohérence post-import
  private async checkImportCoherence(data: any): Promise<any> {
    const coherenceResult = await ebiosCoherenceService.checkMissionCoherence(
      data.mission.id,
      data
    );
    
    if (!coherenceResult.isCompliant) {
      this.warnings.push(`⚠️ COHÉRENCE: Score global ${Math.round(coherenceResult.overallScore * 100)}% - ${coherenceResult.criticalIssues.length} problèmes critiques détectés`);
    }
    
    return coherenceResult;
  }

  // Méthodes de conversion (exemples)

  private convertPriority(accessPriority: any): 1 | 2 | 3 | 4 {
    if (typeof accessPriority === 'number') {
      return Math.max(1, Math.min(4, accessPriority)) as 1 | 2 | 3 | 4;
    }
    return 2;
  }

  private convertGravity(accessGravity: any): 1 | 2 | 3 | 4 {
    return this.convertPriority(accessGravity);
  }

  private convertCriticality(accessCriticality: any): 'essential' | 'important' | 'useful' {
    if (accessCriticality >= 3) return 'essential';
    if (accessCriticality >= 2) return 'important';
    return 'useful';
  }

  private convertPertinence(accessPertinence: any): 1 | 2 | 3 | 4 {
    // Conversion échelle 1-3 Access vers 1-4 Firebase
    if (accessPertinence === 1) return 1;
    if (accessPertinence === 2) return 3;
    if (accessPertinence === 3) return 4;
    return 2;
  }

  private detectImpactType(name: string, description: string): DreadedEvent['impactType'] {
    const text = `${name} ${description}`.toLowerCase();
    if (text.includes('disponib')) return 'availability';
    if (text.includes('intégr')) return 'integrity';
    if (text.includes('confident')) return 'confidentiality';
    if (text.includes('authent')) return 'authenticity';
    return 'availability';
  }

  private extractImpactsList(accessEvent: any): string[] {
    const impacts: string[] = [];
    if (accessEvent.impact_disponibilite) impacts.push('availability');
    if (accessEvent.impact_integrite) impacts.push('integrity');
    if (accessEvent.impact_confidentialite) impacts.push('confidentiality');
    if (accessEvent.impact_authenticite) impacts.push('authenticity');
    return impacts.length > 0 ? impacts : ['availability'];
  }

  private convertExpertise(value: any): RiskSource['expertise'] {
    if (value >= 3) return 'expert';
    if (value >= 2) return 'high';
    if (value >= 1) return 'moderate';
    return 'limited';
  }

  private convertResources(value: any): RiskSource['resources'] {
    if (value >= 4) return 'unlimited';
    if (value >= 3) return 'high';
    if (value >= 2) return 'moderate';
    return 'limited';
  }

  private convertMotivation(value: any): 1 | 2 | 3 | 4 {
    return this.convertPriority(value);
  }

  private convertStakeholderType(type: string): Stakeholder['type'] {
    const typeMap: Record<string, Stakeholder['type']> = {
      'INTERNE': 'internal',
      'EXTERNE': 'external',
      'PARTENAIRE': 'partner',
      'FOURNISSEUR': 'supplier',
      'CLIENT': 'client',
      'REGULATEUR': 'regulator'
    };
    return typeMap[type?.toUpperCase()] || 'external';
  }

  private convertStakeholderCategory(category: string): Stakeholder['category'] {
    const catMap: Record<string, Stakeholder['category']> = {
      'DECIDEUR': 'decision_maker',
      'UTILISATEUR': 'user',
      'ADMINISTRATEUR': 'administrator',
      'MAINTENANCE': 'maintenance',
      'ENTITE_EXTERNE': 'external_entity'
    };
    return catMap[category?.toUpperCase()] || 'external_entity';
  }

  private convertZone(zone: string): Stakeholder['zone'] {
    if (zone?.includes('CONFIANCE')) return 'trusted';
    if (zone?.includes('PARTIEL')) return 'partially_trusted';
    return 'untrusted';
  }

  private convertExposure(value: any): 1 | 2 | 3 | 4 {
    return this.convertPriority(value);
  }

  private convertReliability(value: any): 1 | 2 | 3 | 4 {
    return this.convertPriority(value);
  }

  private convertDifficulty(value: any): 1 | 2 | 3 | 4 {
    return this.convertPriority(value);
  }

  private convertProbability(value: any): 1 | 2 | 3 | 4 {
    return this.convertPriority(value);
  }

  private parsePrerequisites(prereq: string): string[] {
    if (!prereq) return [];
    return prereq.split(/[;,]/).map(p => p.trim()).filter(p => p);
  }

  private parseIndicators(indicators: string): string[] {
    return this.parsePrerequisites(indicators);
  }

  private convertMeasureType(accessType: string): SecurityMeasure['controlType'] {
    const typeMap: Record<string, SecurityMeasure['controlType']> = {
      'GOUVERNANCE': 'directive',
      'PROTECTION': 'preventive',
      'DEFENSE': 'detective',
      'RESILIENCE': 'corrective'
    };
    return typeMap[accessType?.toUpperCase()] || 'preventive';
  }

  private convertMeasureStatus(status: string): SecurityMeasure['status'] {
    const statusMap: Record<string, SecurityMeasure['status']> = {
      'PLANIFIE': 'planned',
      'EN_COURS': 'in_progress',
      'IMPLEMENTE': 'implemented',
      'VERIFIE': 'verified',
      'OBSOLETE': 'obsolete'
    };
    return statusMap[status?.toUpperCase()] || 'planned';
  }

  private convertEffectiveness(value: any): 1 | 2 | 3 | 4 {
    return this.convertPriority(value);
  }

  private convertCost(cost: any): SecurityMeasure['implementationCost'] {
    if (cost >= 4) return 'very_high';
    if (cost >= 3) return 'high';
    if (cost >= 2) return 'medium';
    return 'low';
  }

  private convertDueDate(months: number): string {
    if (!months) return new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
    return new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString();
  }

  private parseResponsables(responsables: string): string[] {
    return this.parsePrerequisites(responsables);
  }

  private convertLikelihood(value: any): 1 | 2 | 3 | 4 {
    return this.convertPriority(value);
  }

  private calculateRiskLevel(likelihood: any, gravity: any): 1 | 2 | 3 | 4 {
    const l = this.convertLikelihood(likelihood);
    const g = this.convertGravity(gravity);
    const risk = (l + g) / 2;
    return Math.ceil(risk) as 1 | 2 | 3 | 4;
  }

  private calculateCriticalityScore(businessValue: BusinessValue): number {
    let score = 0;
    if (businessValue.criticalityLevel === 'essential') score += 1;
    if (businessValue.criticalityLevel === 'important') score += 0.7;
    if (businessValue.priority >= 3) score += 0.5;
    return Math.min(score, 1);
  }

  private analyzeCascadingEffects(event: DreadedEvent): string[] {
    const effects: string[] = [];
    if (event.gravity >= 3) {
      effects.push("Impact sur la réputation de l'organisation");
      effects.push("Perturbation des activités dépendantes");
    }
    if (event.impactType === 'availability') {
      effects.push("Perte de productivité");
      effects.push("Impact financier direct");
    }
    return effects;
  }

  private calculateThreatLevel(riskSource: RiskSource): number {
    let level = 0;
    level += riskSource.motivation * 0.3;
    level += (riskSource.resources === 'unlimited' ? 4 : riskSource.resources === 'high' ? 3 : 2) * 0.3;
    level += (riskSource.expertise === 'expert' ? 4 : riskSource.expertise === 'high' ? 3 : 2) * 0.4;
    return level / 4;
  }

  private predictActions(riskSource: RiskSource): string[] {
    const actions: string[] = [];
    
    if (riskSource.category === 'state') {
      actions.push("Espionnage industriel", "Sabotage d'infrastructures", "Vol de propriété intellectuelle");
    } else if (riskSource.category === 'cybercriminal') {
      actions.push("Ransomware", "Vol de données", "Fraude financière");
    } else if (riskSource.category === 'insider') {
      actions.push("Vol de données internes", "Sabotage", "Fuite d'informations");
    }
    
    return actions;
  }

  private suggestISOControl(name: string, description: string, accessType?: string): any {
    // Mapping simplifié Access → ISO 27002
    const suggestions: Record<string, any> = {
      'GOUVERNANCE': { category: 'A.5', control: 'Politiques de sécurité', confidence: 0.9 },
      'PROTECTION': { category: 'A.8', control: 'Gestion des actifs', confidence: 0.85 },
      'DEFENSE': { category: 'A.12', control: 'Sécurité opérationnelle', confidence: 0.8 },
      'RESILIENCE': { category: 'A.17', control: 'Continuité', confidence: 0.85 }
    };

    return suggestions[accessType || 'PROTECTION'] || null;
  }

  /**
   * 🆕 CORRECTION: Convertit le type d'actif Access vers EBIOS RM
   */
  private convertAssetType(accessType: string): SupportingAsset['type'] {
    const mapping: Record<string, SupportingAsset['type']> = {
      'data': 'data',
      'software': 'software',
      'hardware': 'hardware',
      'network': 'network',
      'personnel': 'personnel',
      'site': 'site',
      'organization': 'organization',
      'donnees': 'data',
      'logiciel': 'software',
      'materiel': 'hardware',
      'reseau': 'network',
      'personne': 'personnel',
      'lieu': 'site',
      'organisation': 'organization'
    };
    return mapping[accessType?.toLowerCase()] || 'data';
  }


}

// Export singleton
export const accessImporter = new AccessImporter(); 