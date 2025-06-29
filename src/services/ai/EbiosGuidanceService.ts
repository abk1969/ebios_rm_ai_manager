/**
 * 🎯 SERVICE DE GUIDANCE MÉTHODOLOGIQUE EBIOS RM
 * Assistance contextuelle et pédagogique pour la méthodologie ANSSI
 */

export interface WorkshopGuidance {
  workshop: number;
  title: string;
  objectives: string[];
  methodology: string;
  deliverables: string[];
  commonMistakes: string[];
  bestPractices: string[];
  anssiRequirements: string[];
  estimatedDuration: string;
  prerequisites: string[];
  keyQuestions: string[];
  validationCriteria: string[];
}

export interface ContextualHelp {
  title: string;
  description: string;
  steps: string[];
  examples: string[];
  warnings: string[];
  references: string[];
}

export interface EbiosMethodologyTip {
  id: string;
  workshop: number;
  category: 'methodology' | 'validation' | 'best_practice' | 'common_error';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export class EbiosGuidanceService {
  
  /**
   * Obtient la guidance complète pour un atelier
   */
  static getWorkshopGuidance(workshop: number): WorkshopGuidance {
    const guidances: Record<number, WorkshopGuidance> = {
      1: {
        workshop: 1,
        title: "Socle de sécurité",
        objectives: [
          "Identifier les valeurs métier de l'organisation",
          "Recenser les événements redoutés associés",
          "Cartographier les actifs supports essentiels",
          "Établir les échelles de besoins de sécurité"
        ],
        methodology: "Approche descendante partant des enjeux métier pour identifier les actifs critiques et leurs vulnérabilités potentielles selon la méthode EBIOS Risk Manager v1.5",
        deliverables: [
          "Inventaire des valeurs métier avec criticité",
          "Catalogue des événements redoutés",
          "Cartographie des actifs supports",
          "Échelles de besoins de sécurité (DICT)",
          "Matrice de dépendances valeurs/actifs"
        ],
        commonMistakes: [
          "Confondre valeurs métier et actifs techniques",
          "Négliger les dépendances entre actifs",
          "Sous-estimer l'impact des événements redoutés",
          "Omettre les actifs immatériels (réputation, savoir-faire)",
          "Ne pas impliquer suffisamment les métiers"
        ],
        bestPractices: [
          "Organiser des ateliers collaboratifs avec les métiers",
          "Utiliser une approche par processus métier",
          "Valider les criticités avec la direction",
          "Documenter les interdépendances",
          "Réviser régulièrement l'inventaire"
        ],
        anssiRequirements: [
          "Exhaustivité de l'inventaire des valeurs métier",
          "Cohérence des échelles de criticité",
          "Traçabilité des dépendances",
          "Validation par les responsables métier",
          "Documentation des hypothèses de travail"
        ],
        estimatedDuration: "2-4 semaines selon la taille de l'organisation",
        prerequisites: [
          "Périmètre d'étude défini",
          "Parties prenantes identifiées",
          "Accès aux responsables métier",
          "Documentation existante collectée"
        ],
        keyQuestions: [
          "Quels sont les processus métier critiques ?",
          "Quels actifs supportent ces processus ?",
          "Quel serait l'impact d'une indisponibilité ?",
          "Quelles sont les exigences réglementaires ?",
          "Qui sont les parties prenantes clés ?"
        ],
        validationCriteria: [
          "Complétude de l'inventaire (>95% des actifs critiques)",
          "Cohérence des échelles de criticité",
          "Validation formelle par les métiers",
          "Traçabilité documentée",
          "Conformité aux exigences sectorielles"
        ]
      },
      
      2: {
        workshop: 2,
        title: "Sources de risque",
        objectives: [
          "Identifier les sources de risque pertinentes",
          "Analyser leurs motivations et capacités",
          "Définir leurs objectifs vis-à-vis des valeurs métier",
          "Caractériser leurs modes opératoires"
        ],
        methodology: "Analyse des menaces basée sur le renseignement de menace, l'analyse sectorielle et l'évaluation des capacités d'attaque selon EBIOS RM",
        deliverables: [
          "Catalogue des sources de risque",
          "Profils de menace détaillés",
          "Objectifs de risque par source",
          "Modes opératoires identifiés",
          "Matrice menaces/valeurs métier"
        ],
        commonMistakes: [
          "Se limiter aux menaces techniques",
          "Négliger les menaces internes",
          "Sous-estimer les capacités des attaquants",
          "Omettre les motivations non financières",
          "Ne pas actualiser le renseignement de menace"
        ],
        bestPractices: [
          "Utiliser des sources de renseignement fiables",
          "Intégrer MITRE ATT&CK dans l'analyse",
          "Considérer l'évolution des menaces",
          "Analyser les incidents sectoriels",
          "Collaborer avec les CERT/CSIRT"
        ],
        anssiRequirements: [
          "Exhaustivité des sources de risque",
          "Justification des profils de menace",
          "Cohérence avec le contexte sectoriel",
          "Mise à jour régulière du renseignement",
          "Traçabilité des sources d'information"
        ],
        estimatedDuration: "3-5 semaines selon la complexité du contexte",
        prerequisites: [
          "Atelier 1 complété et validé",
          "Accès au renseignement de menace",
          "Connaissance du contexte sectoriel",
          "Historique des incidents disponible"
        ],
        keyQuestions: [
          "Qui pourrait s'intéresser à nos valeurs métier ?",
          "Quelles sont leurs motivations ?",
          "De quelles capacités disposent-ils ?",
          "Comment procèdent-ils habituellement ?",
          "Quelles sont les tendances d'évolution ?"
        ],
        validationCriteria: [
          "Pertinence des sources de risque identifiées",
          "Réalisme des profils de menace",
          "Cohérence avec le renseignement disponible",
          "Couverture complète des motivations",
          "Actualité des informations utilisées"
        ]
      },
      
      3: {
        workshop: 3,
        title: "Scénarios stratégiques",
        objectives: [
          "Construire des scénarios de risque réalistes",
          "Évaluer leur vraisemblance et leur gravité",
          "Prioriser les risques selon leur criticité",
          "Identifier les scénarios de référence"
        ],
        methodology: "Construction de scénarios par combinaison sources de risque/valeurs métier, évaluation selon les échelles ANSSI et priorisation matricielle",
        deliverables: [
          "Catalogue des scénarios stratégiques",
          "Évaluations de vraisemblance et gravité",
          "Matrice de risque stratégique",
          "Scénarios de référence sélectionnés",
          "Justifications des évaluations"
        ],
        commonMistakes: [
          "Créer des scénarios irréalistes",
          "Biaiser les évaluations de vraisemblance",
          "Négliger l'effet cumulatif des impacts",
          "Omettre les scénarios de faible probabilité/fort impact",
          "Ne pas justifier les cotations"
        ],
        bestPractices: [
          "Utiliser des méthodes d'évaluation collégiales",
          "S'appuyer sur des données historiques",
          "Considérer les interdépendances",
          "Valider avec les experts métier",
          "Documenter les hypothèses"
        ],
        anssiRequirements: [
          "Cohérence des scénarios avec les ateliers précédents",
          "Justification des évaluations",
          "Utilisation des échelles normalisées",
          "Validation par les parties prenantes",
          "Traçabilité des décisions"
        ],
        estimatedDuration: "2-3 semaines selon le nombre de scénarios",
        prerequisites: [
          "Ateliers 1 et 2 complétés",
          "Échelles d'évaluation définies",
          "Experts métier disponibles",
          "Données historiques collectées"
        ],
        keyQuestions: [
          "Quels scénarios sont les plus vraisemblables ?",
          "Quels seraient les impacts réels ?",
          "Comment évaluer objectivement les risques ?",
          "Quels scénarios prioriser ?",
          "Les évaluations sont-elles cohérentes ?"
        ],
        validationCriteria: [
          "Réalisme des scénarios construits",
          "Cohérence des évaluations",
          "Justification des cotations",
          "Validation par les métiers",
          "Conformité aux échelles ANSSI"
        ]
      },
      
      4: {
        workshop: 4,
        title: "Scénarios opérationnels",
        objectives: [
          "Décliner les scénarios stratégiques en chemins d'attaque",
          "Analyser la faisabilité technique des attaques",
          "Évaluer les capacités de détection",
          "Identifier les points de contrôle critiques"
        ],
        methodology: "Modélisation des chemins d'attaque avec MITRE ATT&CK, analyse de faisabilité et évaluation des capacités de détection",
        deliverables: [
          "Chemins d'attaque détaillés",
          "Évaluations de faisabilité",
          "Analyse des capacités de détection",
          "Points de contrôle identifiés",
          "Scénarios opérationnels priorisés"
        ],
        commonMistakes: [
          "Négliger les vecteurs d'attaque non techniques",
          "Surestimer les capacités de détection",
          "Omettre les attaques par rebond",
          "Ne pas considérer la persistance",
          "Ignorer les contraintes opérationnelles"
        ],
        bestPractices: [
          "Utiliser MITRE ATT&CK systématiquement",
          "Impliquer les équipes techniques",
          "Tester les hypothèses de détection",
          "Considérer l'évolution des techniques",
          "Documenter les chaînes d'attaque"
        ],
        anssiRequirements: [
          "Cohérence avec les scénarios stratégiques",
          "Réalisme technique des chemins d'attaque",
          "Évaluation objective des capacités",
          "Traçabilité des analyses",
          "Validation par les experts techniques"
        ],
        estimatedDuration: "3-4 semaines selon la complexité technique",
        prerequisites: [
          "Atelier 3 complété et validé",
          "Expertise technique disponible",
          "Connaissance de l'infrastructure",
          "Accès aux équipes SOC/CERT"
        ],
        keyQuestions: [
          "Comment les attaquants procèdent-ils concrètement ?",
          "Quelles sont nos capacités de détection ?",
          "Où sont les points de contrôle critiques ?",
          "Quelles techniques sont les plus probables ?",
          "Comment améliorer notre visibilité ?"
        ],
        validationCriteria: [
          "Réalisme technique des chemins d'attaque",
          "Cohérence avec MITRE ATT&CK",
          "Évaluation objective des capacités",
          "Validation par les experts",
          "Complétude de l'analyse"
        ]
      },
      
      5: {
        workshop: 5,
        title: "Mesures de sécurité",
        objectives: [
          "Identifier les mesures de sécurité appropriées",
          "Évaluer leur efficacité et leur coût",
          "Optimiser le plan de traitement des risques",
          "Définir les indicateurs de suivi"
        ],
        methodology: "Sélection de mesures basée sur l'analyse coût/bénéfice, optimisation du portefeuille de sécurité et définition d'indicateurs de performance",
        deliverables: [
          "Catalogue des mesures de sécurité",
          "Évaluations coût/efficacité",
          "Plan de traitement optimisé",
          "Indicateurs de performance",
          "Feuille de route de mise en œuvre"
        ],
        commonMistakes: [
          "Privilégier les solutions techniques uniquement",
          "Négliger les aspects organisationnels",
          "Sous-estimer les coûts de mise en œuvre",
          "Omettre les mesures de détection",
          "Ne pas définir d'indicateurs de suivi"
        ],
        bestPractices: [
          "Équilibrer prévention/détection/réaction",
          "Considérer l'approche défense en profondeur",
          "Intégrer les contraintes opérationnelles",
          "Définir des indicateurs mesurables",
          "Planifier la mise en œuvre progressive"
        ],
        anssiRequirements: [
          "Justification du choix des mesures",
          "Évaluation de l'efficacité résiduelle",
          "Cohérence avec les référentiels",
          "Définition d'indicateurs pertinents",
          "Plan de mise en œuvre réaliste"
        ],
        estimatedDuration: "2-4 semaines selon l'ampleur du plan",
        prerequisites: [
          "Atelier 4 complété et validé",
          "Budget et contraintes définis",
          "Référentiels de sécurité disponibles",
          "Équipes de mise en œuvre identifiées"
        ],
        keyQuestions: [
          "Quelles mesures sont les plus efficaces ?",
          "Comment optimiser le rapport coût/efficacité ?",
          "Quelle est la feuille de route réaliste ?",
          "Comment mesurer l'efficacité ?",
          "Quels sont les risques résiduels acceptables ?"
        ],
        validationCriteria: [
          "Pertinence des mesures sélectionnées",
          "Réalisme du plan de mise en œuvre",
          "Cohérence avec les contraintes",
          "Qualité des indicateurs définis",
          "Acceptabilité du risque résiduel"
        ]
      }
    };
    
    return guidances[workshop] || this.getDefaultGuidance(workshop);
  }
  
  /**
   * Obtient l'aide contextuelle pour une étape spécifique
   */
  static getContextualHelp(workshop: number, step: string): ContextualHelp {
    const helpDatabase: Record<string, ContextualHelp> = {
      'workshop1-business-values': {
        title: "Identification des valeurs métier",
        description: "Les valeurs métier représentent ce qui a de la valeur pour l'organisation et qui doit être protégé.",
        steps: [
          "Identifier les processus métier critiques",
          "Recenser les actifs informationnels",
          "Évaluer la criticité selon les critères DICT",
          "Valider avec les responsables métier",
          "Documenter les interdépendances"
        ],
        examples: [
          "Chiffre d'affaires de l'entreprise",
          "Données clients personnelles",
          "Savoir-faire et propriété intellectuelle",
          "Image et réputation de l'organisation",
          "Conformité réglementaire"
        ],
        warnings: [
          "Ne pas confondre valeur métier et actif technique",
          "Éviter les formulations trop génériques",
          "Ne pas oublier les valeurs immatérielles",
          "Impliquer les bonnes parties prenantes"
        ],
        references: [
          "EBIOS Risk Manager - Guide méthodologique",
          "ISO 27005 - Gestion des risques",
          "ANSSI - Référentiel de qualification"
        ]
      },
      
      'workshop2-threat-sources': {
        title: "Identification des sources de risque",
        description: "Les sources de risque sont les entités susceptibles de porter atteinte aux valeurs métier de l'organisation.",
        steps: [
          "Analyser le contexte sectoriel et géopolitique",
          "Consulter le renseignement de menace",
          "Identifier les motivations potentielles",
          "Évaluer les capacités d'attaque",
          "Caractériser les contraintes opérationnelles"
        ],
        examples: [
          "Cybercriminels organisés",
          "États-nations et services de renseignement",
          "Employés malveillants ou négligents",
          "Concurrents déloyaux",
          "Hacktivistes et groupes idéologiques"
        ],
        warnings: [
          "Ne pas se limiter aux menaces cyber",
          "Considérer l'évolution des menaces",
          "Ne pas sous-estimer les menaces internes",
          "Actualiser régulièrement l'analyse"
        ],
        references: [
          "MITRE ATT&CK Framework",
          "ANSSI - Panorama de la cybermenace",
          "CERT-FR - Bulletins d'alerte"
        ]
      }
    };
    
    const key = `workshop${workshop}-${step}`;
    return helpDatabase[key] || this.getDefaultHelp(workshop, step);
  }
  
  /**
   * Génère des conseils méthodologiques contextuels
   */
  static generateMethodologyTips(workshop: number, currentData: any): EbiosMethodologyTip[] {
    const tips: EbiosMethodologyTip[] = [];
    
    // Conseils spécifiques selon l'atelier et les données
    switch (workshop) {
      case 1:
        if (!currentData.businessValues || currentData.businessValues.length === 0) {
          tips.push({
            id: 'w1-no-business-values',
            workshop: 1,
            category: 'methodology',
            title: "Commencez par identifier vos valeurs métier",
            description: "Les valeurs métier sont le point de départ de toute analyse EBIOS RM. Elles représentent ce qui a de la valeur pour votre organisation.",
            actionable: true,
            priority: 'critical'
          });
        }
        
        if (currentData.businessValues && currentData.businessValues.length > 0) {
          const hasDescriptions = currentData.businessValues.every((bv: any) => bv.description && bv.description.length > 20);
          if (!hasDescriptions) {
            tips.push({
              id: 'w1-incomplete-descriptions',
              workshop: 1,
              category: 'best_practice',
              title: "Enrichissez les descriptions de vos valeurs métier",
              description: "Des descriptions détaillées facilitent l'identification des événements redoutés et des actifs supports.",
              actionable: true,
              priority: 'medium'
            });
          }
        }
        break;
        
      case 2:
        if (!currentData.riskSources || currentData.riskSources.length === 0) {
          tips.push({
            id: 'w2-no-risk-sources',
            workshop: 2,
            category: 'methodology',
            title: "Identifiez les sources de risque pertinentes",
            description: "Analysez qui pourrait s'intéresser à vos valeurs métier et pourquoi.",
            actionable: true,
            priority: 'critical'
          });
        }
        break;
        
      case 3:
        if (currentData.strategicScenarios && currentData.strategicScenarios.length > 20) {
          tips.push({
            id: 'w3-too-many-scenarios',
            workshop: 3,
            category: 'best_practice',
            title: "Limitez le nombre de scénarios stratégiques",
            description: "Un trop grand nombre de scénarios rend l'analyse difficile. Concentrez-vous sur les plus critiques.",
            actionable: true,
            priority: 'medium'
          });
        }
        break;
    }
    
    return tips;
  }
  
  private static getDefaultGuidance(workshop: number): WorkshopGuidance {
    return {
      workshop,
      title: `Atelier ${workshop}`,
      objectives: ["Objectifs à définir"],
      methodology: "Méthodologie à préciser",
      deliverables: ["Livrables à identifier"],
      commonMistakes: ["Erreurs courantes à documenter"],
      bestPractices: ["Bonnes pratiques à établir"],
      anssiRequirements: ["Exigences ANSSI à définir"],
      estimatedDuration: "Durée à estimer",
      prerequisites: ["Prérequis à identifier"],
      keyQuestions: ["Questions clés à formuler"],
      validationCriteria: ["Critères de validation à définir"]
    };
  }
  
  private static getDefaultHelp(workshop: number, step: string): ContextualHelp {
    return {
      title: `Aide pour ${step}`,
      description: "Description de l'aide contextuelle à développer",
      steps: ["Étapes à définir"],
      examples: ["Exemples à fournir"],
      warnings: ["Avertissements à documenter"],
      references: ["Références à ajouter"]
    };
  }
}
