/**
 * 🔗 GESTIONNAIRE DES LIENS ENTRE ATELIERS EBIOS RM
 * Système professionnel de transmission des livrables vers les ateliers suivants
 */

// 🎯 TYPES POUR LES LIVRABLES ATELIER 2
export interface Atelier2Deliverables {
  sourcesPrioritaires: SourceRisquePrioritaire[];
  motivationsAnalysees: MotivationAnalysee[];
  capacitesEvaluees: CapaciteEvaluee[];
  matricePertinence: MatricePertinence;
  recommandationsSuite: RecommandationSuite[];
}

export interface SourceRisquePrioritaire {
  id: string;
  nom: string;
  type: 'cybercriminel' | 'espion' | 'hacktiviste' | 'etat' | 'initie';
  rang: number; // 1, 2, 3...
  scorePertinence: number; // 1-20
  justification: string;
  profil: {
    qui: string;
    organisation: string;
    geographie: string;
    specialisation: string;
  };
  pourAtelier3: LienAtelier3;
  pourAtelier4: LienAtelier4;
  pourAtelier5: LienAtelier5;
}

export interface MotivationAnalysee {
  sourceId: string;
  motivationPrincipale: string;
  motivationsSecondaires: string[];
  objectifsSpecifiques: string[];
  ciblesPrioritaires: string[];
  facteursDeclencheurs: string[];
  temporalite: {
    urgence: 'immediate' | 'courte' | 'moyenne' | 'longue';
    saisonnalite: string[];
    dureeTypique: string;
  };
}

export interface CapaciteEvaluee {
  sourceId: string;
  niveauGlobal: number; // 1-10
  capacitesTechniques: {
    exploits: number;
    malwares: number;
    evasion: number;
    persistance: number;
  };
  ressourcesOrganisationnelles: {
    budget: number;
    equipes: number;
    infrastructure: number;
    veille: number;
  };
  limitations: string[];
  outilsTypiques: string[];
}

export interface MatricePertinence {
  criteres: {
    motivation: number;
    capacites: number;
    opportunites: number;
    vraisemblance: number;
  };
  sources: {
    [sourceId: string]: {
      scores: {
        motivation: number;
        capacites: number;
        opportunites: number;
        vraisemblance: number;
      };
      scoreGlobal: number;
      rang: number;
    };
  };
}

// 🎯 LIENS VERS LES ATELIERS SUIVANTS
export interface LienAtelier3 {
  scenariosStrategiquesGeneres: ScenarioStrategiquePreview[];
  combinaisonsSourcesBiens: CombinaisonSourceBien[];
  cheminsAttaquePotentiels: CheminAttaque[];
  vraisemblanceInitiale: number;
}

export interface LienAtelier4 {
  modesOperatoiresPotentiels: ModeOperatoirePreview[];
  techniquesAttendues: TechniqueAttaque[];
  vecteursPrioritaires: VecteurAttaque[];
  niveauSophistication: number;
}

export interface LienAtelier5 {
  mesuresPreventives: MesurePreventive[];
  mesuresDetection: MesureDetection[];
  mesuresReponse: MesureReponse[];
  prioriteTraitement: number;
}

export interface ScenarioStrategiquePreview {
  id: string;
  nom: string;
  description: string;
  sourceId: string;
  bienEssentielCible: string;
  evenementRedouteVise: string;
  vraisemblance: number;
  impact: string;
}

export interface CombinaisonSourceBien {
  sourceId: string;
  bienEssentielId: string;
  pertinence: number;
  justification: string;
  scenariosPossibles: string[];
}

export interface CheminAttaque {
  sourceId: string;
  pointEntree: string;
  etapesIntermediaires: string[];
  cibleFinale: string;
  complexite: number;
}

export interface ModeOperatoirePreview {
  id: string;
  nom: string;
  sourceId: string;
  scenarioStrategiqueId: string;
  etapesPrincipales: string[];
  outilsRequis: string[];
  competencesRequises: number;
}

export interface TechniqueAttaque {
  nom: string;
  type: string;
  description: string;
  sourceCompatible: string[];
  difficulte: number;
  detectabilite: number;
}

export interface VecteurAttaque {
  nom: string;
  description: string;
  bienSupportCible: string;
  vulnerabiliteExploitee: string;
  efficacite: number;
}

export interface MesurePreventive {
  nom: string;
  type: 'technique' | 'organisationnelle' | 'physique';
  description: string;
  sourcesContrees: string[];
  efficacite: number;
  cout: number;
  priorite: number;
}

export interface MesureDetection {
  nom: string;
  type: string;
  description: string;
  sourcesDetectees: string[];
  precision: number;
  delaiDetection: string;
}

export interface MesureReponse {
  nom: string;
  type: string;
  description: string;
  declencheurs: string[];
  efficacite: number;
  delaiReponse: string;
}

export interface RecommandationSuite {
  atelier: 3 | 4 | 5;
  priorite: number;
  recommandation: string;
  justification: string;
  donneesCles: string[];
}

/**
 * 🔗 GESTIONNAIRE PRINCIPAL DES LIENS INTER-ATELIERS
 */
export class WorkshopLinksManager {
  private atelier2Data: Atelier2Deliverables | null = null;

  // 📥 CHARGEMENT DES LIVRABLES ATELIER 2
  loadAtelier2Deliverables(data: Atelier2Deliverables): void {
    this.atelier2Data = data;
    console.log('✅ Livrables Atelier 2 chargés:', data);
  }

  // 🎯 GÉNÉRATION DES LIENS VERS ATELIER 3 - SCÉNARIOS STRATÉGIQUES
  generateLinksToAtelier3(): LienAtelier3[] {
    if (!this.atelier2Data) {
      throw new Error('Livrables Atelier 2 non disponibles');
    }

    const liens: LienAtelier3[] = [];

    this.atelier2Data.sourcesPrioritaires.forEach(source => {
      // Génération des scénarios stratégiques basés sur les motivations
      const scenariosGeneres = this.generateScenariosStrategiques(source);

      // Combinaisons source × biens essentiels
      const combinaisons = this.generateCombinaisonsSourcesBiens(source);

      // Chemins d'attaque potentiels
      const chemins = this.generateCheminsAttaque(source);

      // Vraisemblance initiale basée sur la pertinence
      const vraisemblance = this.calculateVraisemblanceInitiale(source);

      liens.push({
        scenariosStrategiquesGeneres: scenariosGeneres,
        combinaisonsSourcesBiens: combinaisons,
        cheminsAttaquePotentiels: chemins,
        vraisemblanceInitiale: vraisemblance
      });
    });

    return liens;
  }

  // 🎯 GÉNÉRATION DES LIENS VERS ATELIER 4 - SCÉNARIOS OPÉRATIONNELS
  generateLinksToAtelier4(): LienAtelier4[] {
    if (!this.atelier2Data) {
      throw new Error('Livrables Atelier 2 non disponibles');
    }

    const liens: LienAtelier4[] = [];

    this.atelier2Data.sourcesPrioritaires.forEach(source => {
      // Modes opératoires basés sur les capacités
      const modesOperatoires = this.generateModesOperatoires(source);

      // Techniques d'attaque selon les capacités
      const techniques = this.generateTechniquesAttaque(source);

      // Vecteurs d'attaque prioritaires
      const vecteurs = this.generateVecteursAttaque(source);

      // Niveau de sophistication attendu
      const sophistication = this.calculateNiveauSophistication(source);

      liens.push({
        modesOperatoiresPotentiels: modesOperatoires,
        techniquesAttendues: techniques,
        vecteursPrioritaires: vecteurs,
        niveauSophistication: sophistication
      });
    });

    return liens;
  }

  // 🎯 GÉNÉRATION DES LIENS VERS ATELIER 5 - TRAITEMENT DU RISQUE
  generateLinksToAtelier5(): LienAtelier5[] {
    if (!this.atelier2Data) {
      throw new Error('Livrables Atelier 2 non disponibles');
    }

    const liens: LienAtelier5[] = [];

    this.atelier2Data.sourcesPrioritaires.forEach(source => {
      // Mesures préventives selon les motivations
      const preventives = this.generateMesuresPreventives(source);

      // Mesures de détection selon les capacités
      const detection = this.generateMesuresDetection(source);

      // Mesures de réponse selon les impacts
      const reponse = this.generateMesuresReponse(source);

      // Priorité de traitement selon la pertinence
      const priorite = this.calculatePrioriteTraitement(source);

      liens.push({
        mesuresPreventives: preventives,
        mesuresDetection: detection,
        mesuresReponse: reponse,
        prioriteTraitement: priorite
      });
    });

    return liens;
  }

  // 🔧 MÉTHODES DE GÉNÉRATION SPÉCIALISÉES

  private generateScenariosStrategiques(source: SourceRisquePrioritaire): ScenarioStrategiquePreview[] {
    const scenarios: ScenarioStrategiquePreview[] = [];

    // Scénarios basés sur le type de source et ses motivations
    const scenarioTemplates = {
      'cybercriminel': [
        {
          nom: 'Ransomware SIH',
          description: 'Chiffrement du système d\'information hospitalier pour extorsion',
          bienCible: 'sih_principal',
          evenementVise: 'paralysie_si',
          vraisemblance: 0.8
        },
        {
          nom: 'Double extorsion données patients',
          description: 'Exfiltration puis chiffrement des données patients',
          bienCible: 'donnees_patients',
          evenementVise: 'fuite_donnees',
          vraisemblance: 0.7
        }
      ],
      'espion': [
        {
          nom: 'Exfiltration recherche clinique',
          description: 'Vol discret des données d\'essais cliniques',
          bienCible: 'recherche_clinique',
          evenementVise: 'sabotage_recherche',
          vraisemblance: 0.6
        },
        {
          nom: 'Espionnage biobanque',
          description: 'Accès aux données génétiques pour concurrence',
          bienCible: 'biobanque',
          evenementVise: 'fuite_donnees',
          vraisemblance: 0.5
        }
      ],
      'initie': [
        {
          nom: 'Abus privilèges administrateur',
          description: 'Utilisation malveillante des droits d\'administration',
          bienCible: 'systemes_critiques',
          evenementVise: 'paralysie_si',
          vraisemblance: 0.6
        },
        {
          nom: 'Exfiltration données VIP',
          description: 'Vol de données de personnalités par personnel interne',
          bienCible: 'donnees_patients',
          evenementVise: 'fuite_donnees',
          vraisemblance: 0.4
        }
      ]
    };

    const templates = scenarioTemplates[source.type] || [];

    templates.forEach((template, index) => {
      scenarios.push({
        id: `scenario_${source.id}_${index + 1}`,
        nom: template.nom,
        description: template.description,
        sourceId: source.id,
        bienEssentielCible: template.bienCible,
        evenementRedouteVise: template.evenementVise,
        vraisemblance: template.vraisemblance * (source.scorePertinence / 20),
        impact: this.calculateImpactScenario(template.evenementVise)
      });
    });

    return scenarios;
  }

  private generateCombinaisonsSourcesBiens(source: SourceRisquePrioritaire): CombinaisonSourceBien[] {
    const combinaisons: CombinaisonSourceBien[] = [];

    // Biens essentiels typiques du CHU
    const biensEssentiels = [
      { id: 'urgences_vitales', pertinence: this.calculatePertinenceBien(source, 'urgences') },
      { id: 'donnees_patients', pertinence: this.calculatePertinenceBien(source, 'donnees') },
      { id: 'recherche_clinique', pertinence: this.calculatePertinenceBien(source, 'recherche') },
      { id: 'bloc_operatoire', pertinence: this.calculatePertinenceBien(source, 'bloc') }
    ];

    biensEssentiels.forEach(bien => {
      if (bien.pertinence >= 3) { // Seuil de pertinence
        combinaisons.push({
          sourceId: source.id,
          bienEssentielId: bien.id,
          pertinence: bien.pertinence,
          justification: this.generateJustificationCombinaison(source, bien.id),
          scenariosPossibles: this.generateScenariosPossibles(source, bien.id)
        });
      }
    });

    return combinaisons;
  }

  private generateCheminsAttaque(source: SourceRisquePrioritaire): CheminAttaque[] {
    const chemins: CheminAttaque[] = [];

    // Chemins typiques selon le type de source
    const cheminTemplates = {
      'cybercriminel': [
        {
          pointEntree: 'Phishing email médecin',
          etapes: ['Compromission poste', 'Escalade privilèges', 'Propagation latérale', 'Chiffrement serveurs'],
          cible: 'SIH principal',
          complexite: 6
        },
        {
          pointEntree: 'Exploitation VPN',
          etapes: ['Accès VPN', 'Reconnaissance réseau', 'Pivot VLAN médical', 'Déploiement ransomware'],
          cible: 'Infrastructure complète',
          complexite: 7
        }
      ],
      'espion': [
        {
          pointEntree: 'Spear-phishing chercheur',
          etapes: ['Compromission discrète', 'Installation backdoor', 'Persistance longue', 'Exfiltration graduelle'],
          cible: 'Serveurs recherche',
          complexite: 8
        }
      ],
      'initie': [
        {
          pointEntree: 'Accès légitime',
          etapes: ['Utilisation comptes privilégiés', 'Contournement logs', 'Accès données sensibles'],
          cible: 'Bases de données',
          complexite: 4
        }
      ]
    };

    const templates = cheminTemplates[source.type] || [];

    templates.forEach(template => {
      chemins.push({
        sourceId: source.id,
        pointEntree: template.pointEntree,
        etapesIntermediaires: template.etapes,
        cibleFinale: template.cible,
        complexite: template.complexite
      });
    });

    return chemins;
  }

  // 🔧 MÉTHODES UTILITAIRES PRIVÉES

  private calculateVraisemblanceInitiale(source: SourceRisquePrioritaire): number {
    // Vraisemblance basée sur le score de pertinence
    return Math.min(1.0, source.scorePertinence / 20);
  }

  private calculateNiveauSophistication(source: SourceRisquePrioritaire): number {
    const sophisticationMap = {
      'cybercriminel': 7,
      'espion': 9,
      'hacktiviste': 4,
      'etat': 10,
      'initie': 5
    };
    return sophisticationMap[source.type] || 5;
  }

  private calculatePrioriteTraitement(source: SourceRisquePrioritaire): number {
    // Priorité inversement proportionnelle au rang (rang 1 = priorité max)
    return Math.max(1, 6 - source.rang);
  }

  private calculateImpactScenario(evenementRedoute: string): string {
    const impactMap = {
      'paralysie_si': 'CRITIQUE - Arrêt complet des soins',
      'fuite_donnees': 'CRITIQUE - Violation RGPD massive',
      'sabotage_recherche': 'MAJEUR - Perte propriété intellectuelle',
      'arret_urgences': 'CRITIQUE - Risque vital patients'
    };
    return impactMap[evenementRedoute] || 'MAJEUR - Impact significatif';
  }

  private calculatePertinenceBien(source: SourceRisquePrioritaire, typeBien: string): number {
    const pertinenceMatrix = {
      'cybercriminel': {
        'urgences': 5, 'donnees': 4, 'recherche': 3, 'bloc': 4
      },
      'espion': {
        'urgences': 2, 'donnees': 3, 'recherche': 5, 'bloc': 2
      },
      'initie': {
        'urgences': 4, 'donnees': 5, 'recherche': 4, 'bloc': 3
      }
    };

    return pertinenceMatrix[source.type]?.[typeBien] || 3;
  }

  private generateJustificationCombinaison(source: SourceRisquePrioritaire, bienId: string): string {
    const justifications = {
      'cybercriminel': {
        'urgences_vitales': 'Criticité vitale crée pression maximale pour paiement rançon',
        'donnees_patients': 'Valeur élevée sur marché noir + levier d\'extorsion',
        'recherche_clinique': 'Données précieuses mais moins critiques pour extorsion'
      },
      'espion': {
        'recherche_clinique': 'Propriété intellectuelle de haute valeur concurrentielle',
        'donnees_patients': 'Données génétiques intéressantes pour recherche',
        'urgences_vitales': 'Peu d\'intérêt pour espionnage industriel'
      },
      'initie': {
        'donnees_patients': 'Accès privilégié facilite exfiltration discrète',
        'urgences_vitales': 'Impact maximal pour vengeance ou sabotage',
        'recherche_clinique': 'Valeur de revente ou chantage possible'
      }
    };

    return justifications[source.type]?.[bienId] || 'Pertinence modérée selon le profil de la source';
  }

  private generateScenariosPossibles(source: SourceRisquePrioritaire, bienId: string): string[] {
    const scenarios = {
      'cybercriminel': {
        'urgences_vitales': ['Ransomware SIH urgences', 'Chiffrement monitoring patients'],
        'donnees_patients': ['Double extorsion', 'Revente marché noir'],
        'recherche_clinique': ['Chiffrement données recherche', 'Extorsion laboratoires']
      },
      'espion': {
        'recherche_clinique': ['Exfiltration discrète', 'Corruption données'],
        'donnees_patients': ['Vol données génétiques', 'Espionnage biobanque']
      },
      'initie': {
        'donnees_patients': ['Exfiltration VIP', 'Revente données'],
        'urgences_vitales': ['Sabotage systèmes', 'Perturbation soins']
      }
    };

    return scenarios[source.type]?.[bienId] || ['Scénario générique'];
  }

  private generateModesOperatoires(source: SourceRisquePrioritaire): ModeOperatoirePreview[] {
    // Génération des modes opératoires selon les capacités de la source
    const modes: ModeOperatoirePreview[] = [];

    // Logique de génération basée sur le type et les capacités
    // ... (implémentation détaillée)

    return modes;
  }

  private generateTechniquesAttaque(source: SourceRisquePrioritaire): TechniqueAttaque[] {
    // Génération des techniques selon les capacités
    const techniques: TechniqueAttaque[] = [];

    // ... (implémentation détaillée)

    return techniques;
  }

  private generateVecteursAttaque(source: SourceRisquePrioritaire): VecteurAttaque[] {
    // Génération des vecteurs d'attaque
    const vecteurs: VecteurAttaque[] = [];

    // ... (implémentation détaillée)

    return vecteurs;
  }

  private generateMesuresPreventives(source: SourceRisquePrioritaire): MesurePreventive[] {
    // Génération des mesures préventives
    const mesures: MesurePreventive[] = [];

    // ... (implémentation détaillée)

    return mesures;
  }

  private generateMesuresDetection(source: SourceRisquePrioritaire): MesureDetection[] {
    // Génération des mesures de détection
    const mesures: MesureDetection[] = [];

    // ... (implémentation détaillée)

    return mesures;
  }

  private generateMesuresReponse(source: SourceRisquePrioritaire): MesureReponse[] {
    // Génération des mesures de réponse
    const mesures: MesureReponse[] = [];

    // ... (implémentation détaillée)

    return mesures;
  }

  // 📊 GÉNÉRATION DE RAPPORTS DE LIENS
  generateLinksReport(): string {
    if (!this.atelier2Data) {
      return "Aucune donnée Atelier 2 disponible";
    }

    let report = "# 🔗 RAPPORT DES LIENS INTER-ATELIERS\n\n";

    report += "## 📊 Sources prioritaires et leurs liens :\n\n";

    this.atelier2Data.sourcesPrioritaires.forEach((source, index) => {
      report += `### ${index + 1}. ${source.nom} (${source.scorePertinence}/20)\n\n`;

      report += "**🎯 Vers Atelier 3 (Scénarios stratégiques) :**\n";
      const liensA3 = this.generateLinksToAtelier3()[index];
      report += `- ${liensA3.scenariosStrategiquesGeneres.length} scénarios stratégiques générés\n`;
      report += `- ${liensA3.combinaisonsSourcesBiens.length} combinaisons source×biens identifiées\n`;
      report += `- Vraisemblance initiale : ${(liensA3.vraisemblanceInitiale * 100).toFixed(0)}%\n\n`;

      report += "**⚙️ Vers Atelier 4 (Scénarios opérationnels) :**\n";
      const liensA4 = this.generateLinksToAtelier4()[index];
      report += `- ${liensA4.modesOperatoiresPotentiels.length} modes opératoires identifiés\n`;
      report += `- Niveau sophistication attendu : ${liensA4.niveauSophistication}/10\n`;
      report += `- ${liensA4.techniquesAttendues.length} techniques d'attaque possibles\n\n`;

      report += "**🛡️ Vers Atelier 5 (Traitement du risque) :**\n";
      const liensA5 = this.generateLinksToAtelier5()[index];
      report += `- Priorité traitement : ${liensA5.prioriteTraitement}/5\n`;
      report += `- ${liensA5.mesuresPreventives.length} mesures préventives recommandées\n`;
      report += `- ${liensA5.mesuresDetection.length} mesures de détection suggérées\n\n`;
    });

    return report;
  }
}

export default WorkshopLinksManager;