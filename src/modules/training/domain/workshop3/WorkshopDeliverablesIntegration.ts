/**
 * 🔗 INTÉGRATION DES LIVRABLES ATELIERS 1 ET 2 DANS L'ATELIER 3
 * Système de traçabilité et d'utilisation systématique des livrables précédents
 */

// 🎯 TYPES POUR L'INTÉGRATION DES LIVRABLES
export interface Workshop1Deliverable {
  id: string;
  type: 'context' | 'essential_asset' | 'support_asset' | 'feared_event' | 'security_baseline';
  name: string;
  criticality: 'CRITIQUE' | 'MAJEUR' | 'MINEUR';
  description: string;
  dependencies: string[];
  vulnerabilities: string[];
  usageInWorkshop3: string[];
}

export interface Workshop2Deliverable {
  id: string;
  type: 'risk_source' | 'motivation' | 'capability' | 'relevance_score';
  name: string;
  score: number;
  priority: number;
  profile: string;
  usageInWorkshop3: string[];
}

export interface StrategicScenario {
  id: string;
  name: string;
  source: Workshop2Deliverable;
  essentialAsset: Workshop1Deliverable;
  fearedEvent: Workshop1Deliverable;
  likelihood: number; // 1-5
  impact: number; // 1-4
  riskLevel: 'FAIBLE' | 'MODÉRÉ' | 'ÉLEVÉ' | 'CRITIQUE';
  justification: string;
  workshop1Dependencies: string[];
  workshop2Dependencies: string[];
}

/**
 * 🏗️ GESTIONNAIRE D'INTÉGRATION DES LIVRABLES
 */
export class WorkshopDeliverablesIntegration {

  // 📥 LIVRABLES ATELIER 1 - CONTEXTE ET PÉRIMÈTRE
  static getWorkshop1Deliverables(): Workshop1Deliverable[] {
    return [
      {
        id: 'w1_context_chu',
        type: 'context',
        name: 'Contexte CHU Métropolitain',
        criticality: 'CRITIQUE',
        description: 'Établissement hospitalier 3 sites, 3500 employés, budget 450M€',
        dependencies: ['secteur_santé', 'taille_organisation', 'budget_disponible'],
        vulnerabilities: ['surface_attaque_étendue', 'attractivité_financière'],
        usageInWorkshop3: [
          'Oriente les types de scénarios (spécialisation santé)',
          'Détermine l\'attractivité pour les cybercriminels (budget 450M€)',
          'Influence la surface d\'attaque (3 sites interconnectés)',
          'Calibre l\'échelle d\'impact selon la taille (3500 employés)'
        ]
      },
      {
        id: 'w1_asset_urgences',
        type: 'essential_asset',
        name: 'Urgences vitales',
        criticality: 'CRITIQUE',
        description: 'Service d\'urgences 24h/24, 50 lits, vies en jeu',
        dependencies: ['sih_principal', 'personnel_médical', 'équipements_vitaux'],
        vulnerabilities: ['dépendance_si', 'criticité_temporelle'],
        usageInWorkshop3: [
          'Cible prioritaire pour scénarios cybercriminels (pression temporelle)',
          'Génère scénario "Ransomware SIH Urgences" (impact maximal)',
          'Détermine niveau d\'impact CRITIQUE (vies en jeu)',
          'Oriente vraisemblance selon attractivité pour extorsion'
        ]
      },
      {
        id: 'w1_asset_données',
        type: 'essential_asset',
        name: 'Données patients',
        criticality: 'CRITIQUE',
        description: '50 000 dossiers patients, données sensibles RGPD',
        dependencies: ['base_données', 'sih', 'accès_médical'],
        vulnerabilities: ['volume_important', 'valeur_marché_noir'],
        usageInWorkshop3: [
          'Cible pour scénarios d\'exfiltration (valeur 250€/dossier)',
          'Génère scénario "Double extorsion données patients"',
          'Attire initiés malveillants (accès privilégié)',
          'Impact réglementaire RGPD (amendes jusqu\'à 4% CA)'
        ]
      },
      {
        id: 'w1_asset_recherche',
        type: 'essential_asset',
        name: 'Recherche clinique',
        criticality: 'MAJEUR',
        description: 'Propriété intellectuelle, essais cliniques, biobanque',
        dependencies: ['serveurs_recherche', 'laboratoires', 'données_génétiques'],
        vulnerabilities: ['segmentation_faible', 'valeur_concurrentielle'],
        usageInWorkshop3: [
          'Cible privilégiée espions industriels (valeur PI énorme)',
          'Génère scénario "Exfiltration recherche clinique"',
          'Motivations concurrentielles (avantage 10-15 ans R&D)',
          'Impact stratégique (perte leadership scientifique)'
        ]
      },
      {
        id: 'w1_support_sih',
        type: 'support_asset',
        name: 'Système Information Hospitalier (SIH)',
        criticality: 'CRITIQUE',
        description: 'Cœur du SI, gestion patients, prescriptions, planification',
        dependencies: ['serveurs_centraux', 'base_données', 'réseau'],
        vulnerabilities: ['point_unique_défaillance', 'legacy_system'],
        usageInWorkshop3: [
          'Vecteur principal pour scénarios de paralysie',
          'Cible technique du scénario "Ransomware SIH"',
          'Amplificateur d\'impact (cascade vers tous services)',
          'Détermine faisabilité technique des scénarios'
        ]
      },
      {
        id: 'w1_event_arrêt_urgences',
        type: 'feared_event',
        name: 'Arrêt des urgences vitales',
        criticality: 'CRITIQUE',
        description: 'Impossibilité de traiter les urgences, vies en danger',
        dependencies: ['urgences_vitales', 'sih', 'personnel'],
        vulnerabilities: ['impact_vital_immédiat'],
        usageInWorkshop3: [
          'Objectif final du scénario "Ransomware SIH Urgences"',
          'Détermine niveau d\'impact maximal (4/4)',
          'Justifie vraisemblance élevée (pression paiement)',
          'Oriente choix des sources (cybercriminels extorsion)'
        ]
      }
    ];
  }

  // 📥 LIVRABLES ATELIER 2 - SOURCES DE RISQUES
  static getWorkshop2Deliverables(): Workshop2Deliverable[] {
    return [
      {
        id: 'w2_source_cybercriminels',
        type: 'risk_source',
        name: 'Cybercriminels spécialisés santé',
        score: 20,
        priority: 1,
        profile: 'Groupes comme Conti Healthcare, LockBit Medical - Spécialisation secteur hospitalier',
        usageInWorkshop3: [
          'Source principale du scénario "Ransomware SIH Urgences"',
          'Détermine vraisemblance très forte (5/5) - spécialisation',
          'Oriente techniques (ransomware avancé, négociation)',
          'Justifie impact critique (expertise extorsion hôpitaux)'
        ]
      },
      {
        id: 'w2_source_initiés',
        type: 'risk_source',
        name: 'Initiés malveillants',
        score: 16,
        priority: 2,
        profile: 'Administrateur IT, médecin corrompu - Accès privilégié, motivations diverses',
        usageInWorkshop3: [
          'Source du scénario "Abus privilèges administrateur"',
          'Détermine vraisemblance forte (4/5) - accès facilité',
          'Oriente cibles (données VIP, systèmes critiques)',
          'Justifie contournement sécurités (légitimité accès)'
        ]
      },
      {
        id: 'w2_source_espions',
        type: 'risk_source',
        name: 'Espions industriels',
        score: 14,
        priority: 3,
        profile: 'Laboratoires concurrents, services étatiques - Cible propriété intellectuelle',
        usageInWorkshop3: [
          'Source du scénario "Exfiltration recherche clinique"',
          'Détermine vraisemblance moyenne (3/5) - cibles spécialisées',
          'Oriente objectifs (vol PI, sabotage concurrentiel)',
          'Justifie techniques sophistiquées (APT persistantes)'
        ]
      },
      {
        id: 'w2_motivation_financière',
        type: 'motivation',
        name: 'Motivation financière',
        score: 5,
        priority: 1,
        profile: 'Extorsion, rançon, revente données - ROI élevé secteur santé',
        usageInWorkshop3: [
          'Oriente scénarios cybercriminels vers extorsion',
          'Justifie ciblage urgences (pression paiement maximale)',
          'Détermine montants rançon (2-5M€ selon budget CHU)',
          'Influence timing attaque (pression temporelle vitale)'
        ]
      },
      {
        id: 'w2_motivation_concurrentielle',
        type: 'motivation',
        name: 'Motivation concurrentielle',
        score: 4,
        priority: 2,
        profile: 'Vol propriété intellectuelle, avantage R&D, sabotage concurrent',
        usageInWorkshop3: [
          'Oriente scénarios espions vers recherche clinique',
          'Justifie ciblage biobanque (données génétiques uniques)',
          'Détermine techniques discrètes (exfiltration longue durée)',
          'Influence impact (perte avantage concurrentiel 10-15 ans)'
        ]
      },
      {
        id: 'w2_capability_très_élevée',
        type: 'capability',
        name: 'Capacités très élevées',
        score: 9,
        priority: 1,
        profile: 'Exploits 0-day, ransomware avancé, évasion EDR, techniques sophistiquées',
        usageInWorkshop3: [
          'Détermine faisabilité scénarios complexes (ransomware SIH)',
          'Justifie contournement sécurités CHU (EDR absent)',
          'Oriente vraisemblance (capacités = réalisation possible)',
          'Influence choix techniques dans scénarios opérationnels'
        ]
      }
    ];
  }

  // 🔗 CONSTRUCTION DES SCÉNARIOS STRATÉGIQUES
  static buildStrategicScenarios(): StrategicScenario[] {
    const w1Deliverables = this.getWorkshop1Deliverables();
    const w2Deliverables = this.getWorkshop2Deliverables();

    return [
      {
        id: 'scenario_ransomware_sih',
        name: 'Ransomware SIH Urgences',
        source: w2Deliverables.find(d => d.id === 'w2_source_cybercriminels')!,
        essentialAsset: w1Deliverables.find(d => d.id === 'w1_asset_urgences')!,
        fearedEvent: w1Deliverables.find(d => d.id === 'w1_event_arrêt_urgences')!,
        likelihood: 5, // Très forte
        impact: 4, // Catastrophique
        riskLevel: 'CRITIQUE',
        justification: `
**JUSTIFICATION DÉTAILLÉE :**

**Utilisation Atelier 1 :**
• Contexte CHU (450M€) → Attractivité financière maximale pour cybercriminels
• Urgences vitales (CRITIQUE) → Cible parfaite pour pression temporelle
• SIH central → Vecteur d'attaque unique pour paralysie globale
• Événement "Arrêt urgences" → Objectif final aligné avec extorsion

**Utilisation Atelier 2 :**
• Cybercriminels spécialisés (20/20) → Source la plus pertinente
• Motivation financière (5/5) → Parfaitement alignée avec extorsion
• Capacités très élevées (9/10) → Faisabilité technique confirmée
• Spécialisation santé → Techniques adaptées aux hôpitaux

**Logique de construction :**
1. Source prioritaire (cybercriminels) × Bien critique (urgences) = Combinaison maximale
2. Motivation financière + Criticité vitale = Pression paiement optimale  
3. Capacités élevées + Vulnérabilités CHU = Faisabilité confirmée
4. Événement redouté + Impact vital = Niveau de risque CRITIQUE
        `,
        workshop1Dependencies: [
          'w1_context_chu',
          'w1_asset_urgences', 
          'w1_support_sih',
          'w1_event_arrêt_urgences'
        ],
        workshop2Dependencies: [
          'w2_source_cybercriminels',
          'w2_motivation_financière',
          'w2_capability_très_élevée'
        ]
      },
      {
        id: 'scenario_abus_privilèges',
        name: 'Abus privilèges administrateur',
        source: w2Deliverables.find(d => d.id === 'w2_source_initiés')!,
        essentialAsset: w1Deliverables.find(d => d.id === 'w1_asset_données')!,
        fearedEvent: w1Deliverables.find(d => d.id === 'w1_event_arrêt_urgences')!, // Simplifié
        likelihood: 4, // Forte
        impact: 3, // Critique
        riskLevel: 'ÉLEVÉ',
        justification: `
**JUSTIFICATION DÉTAILLÉE :**

**Utilisation Atelier 1 :**
• Contexte CHU (3500 employés) → Nombreux administrateurs IT
• Données patients (50k dossiers) → Cible attractive pour revente
• Dépendances SI → Facilité de paralysie avec accès admin
• Criticité données → Impact RGPD et réputationnel

**Utilisation Atelier 2 :**
• Initiés malveillants (16/20) → Source très pertinente
• Accès privilégié → Contournement sécurités facilité
• Motivations diverses → Vengeance, corruption, chantage
• Surveillance interne faible → Opportunités nombreuses

**Logique de construction :**
1. Accès privilégié + Données sensibles = Combinaison dangereuse
2. Stress professionnel + Contrôles faibles = Risque élevé
3. Connaissance intime + Légitimité = Détection difficile
4. Impact RGPD + Réputation = Niveau de risque ÉLEVÉ
        `,
        workshop1Dependencies: [
          'w1_context_chu',
          'w1_asset_données',
          'w1_support_sih'
        ],
        workshop2Dependencies: [
          'w2_source_initiés'
        ]
      },
      {
        id: 'scenario_exfiltration_recherche',
        name: 'Exfiltration recherche clinique',
        source: w2Deliverables.find(d => d.id === 'w2_source_espions')!,
        essentialAsset: w1Deliverables.find(d => d.id === 'w1_asset_recherche')!,
        fearedEvent: w1Deliverables.find(d => d.id === 'w1_event_arrêt_urgences')!, // Simplifié
        likelihood: 3, // Moyenne
        impact: 3, // Critique
        riskLevel: 'ÉLEVÉ',
        justification: `
**JUSTIFICATION DÉTAILLÉE :**

**Utilisation Atelier 1 :**
• Recherche clinique (MAJEUR) → Propriété intellectuelle précieuse
• Biobanque génétique → Données uniques et concurrentielles
• Segmentation faible → Vulnérabilité d'accès
• Valeur concurrentielle → Motivation forte pour espions

**Utilisation Atelier 2 :**
• Espions industriels (14/20) → Source pertinente pour PI
• Motivation concurrentielle → Parfaitement alignée
• Capacités sophistiquées → APT persistantes adaptées
• Techniques discrètes → Exfiltration longue durée

**Logique de construction :**
1. Propriété intellectuelle + Concurrence = Cible privilégiée
2. Valeur R&D (10-15 ans) + ROI espionnage = Motivation forte
3. Techniques APT + Segmentation faible = Faisabilité confirmée
4. Perte avantage concurrentiel = Impact stratégique CRITIQUE
        `,
        workshop1Dependencies: [
          'w1_asset_recherche'
        ],
        workshop2Dependencies: [
          'w2_source_espions',
          'w2_motivation_concurrentielle'
        ]
      }
    ];
  }

  // 📊 MATRICE DE TRAÇABILITÉ
  static generateTraceabilityMatrix(): {
    workshop1Usage: Record<string, string[]>;
    workshop2Usage: Record<string, string[]>;
    scenarioJustifications: Record<string, string>;
  } {
    const scenarios = this.buildStrategicScenarios();
    const w1Deliverables = this.getWorkshop1Deliverables();
    const w2Deliverables = this.getWorkshop2Deliverables();

    const workshop1Usage: Record<string, string[]> = {};
    const workshop2Usage: Record<string, string[]> = {};
    const scenarioJustifications: Record<string, string> = {};

    // Traçabilité Atelier 1
    w1Deliverables.forEach(deliverable => {
      workshop1Usage[deliverable.id] = deliverable.usageInWorkshop3;
    });

    // Traçabilité Atelier 2  
    w2Deliverables.forEach(deliverable => {
      workshop2Usage[deliverable.id] = deliverable.usageInWorkshop3;
    });

    // Justifications des scénarios
    scenarios.forEach(scenario => {
      scenarioJustifications[scenario.id] = scenario.justification;
    });

    return {
      workshop1Usage,
      workshop2Usage,
      scenarioJustifications
    };
  }

  // 🎯 VALIDATION DE L'UTILISATION DES LIVRABLES
  static validateDeliverablesUsage(): {
    workshop1Coverage: number;
    workshop2Coverage: number;
    unusedDeliverables: string[];
    recommendations: string[];
  } {
    const w1Deliverables = this.getWorkshop1Deliverables();
    const w2Deliverables = this.getWorkshop2Deliverables();
    const scenarios = this.buildStrategicScenarios();

    // Calcul de couverture
    const usedW1 = new Set<string>();
    const usedW2 = new Set<string>();

    scenarios.forEach(scenario => {
      scenario.workshop1Dependencies.forEach(dep => usedW1.add(dep));
      scenario.workshop2Dependencies.forEach(dep => usedW2.add(dep));
    });

    const workshop1Coverage = (usedW1.size / w1Deliverables.length) * 100;
    const workshop2Coverage = (usedW2.size / w2Deliverables.length) * 100;

    // Livrables non utilisés
    const unusedDeliverables: string[] = [];
    w1Deliverables.forEach(d => {
      if (!usedW1.has(d.id)) unusedDeliverables.push(d.name);
    });
    w2Deliverables.forEach(d => {
      if (!usedW2.has(d.id)) unusedDeliverables.push(d.name);
    });

    // Recommandations
    const recommendations = [
      'Tous les biens essentiels CRITIQUES sont utilisés dans les scénarios',
      'Les 3 sources prioritaires sont intégrées systématiquement',
      'La traçabilité est complète et documentée',
      'Les justifications sont détaillées et argumentées'
    ];

    return {
      workshop1Coverage,
      workshop2Coverage,
      unusedDeliverables,
      recommendations
    };
  }
}

export default WorkshopDeliverablesIntegration;
