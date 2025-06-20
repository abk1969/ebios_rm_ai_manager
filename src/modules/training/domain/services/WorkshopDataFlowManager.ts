/**
 * 🔗 GESTIONNAIRE DE FLUX DE DONNÉES ENTRE ATELIERS EBIOS RM
 * Système professionnel de transmission et utilisation des livrables
 */

// 🎯 TYPES POUR LES LIVRABLES ATELIER 1
export interface Atelier1Deliverables {
  contexte: ContexteCHU;
  biensEssentiels: BienEssentiel[];
  biensSupports: BienSupport[];
  evenementsRedoutes: EvenementRedoute[];
  socleSecurite: SocleSecurite;
  vulnerabilites: Vulnerabilite[];
}

export interface ContexteCHU {
  organisation: {
    nom: string;
    secteur: string;
    taille: string;
    sites: number;
    personnel: number;
    patients: number;
    budget: number;
  };
  missions: {
    primaire: string;
    critiques: string[];
    secondaires: string[];
  };
  perimetre: {
    geographique: string;
    fonctionnel: string[];
    technique: string[];
    temporel: string;
  };
}

export interface BienEssentiel {
  id: string;
  nom: string;
  type: 'processus' | 'donnees' | 'mission';
  description: string;
  criticite: 'CRITIQUE' | 'MAJEUR' | 'MINEUR';
  impact: {
    humain: string;
    financier: string;
    reputationnel: string;
  };
  dependances: string[];
}

export interface BienSupport {
  id: string;
  nom: string;
  type: 'systeme' | 'infrastructure' | 'humain' | 'organisationnel';
  description: string;
  criticite: 'VITALE' | 'IMPORTANTE' | 'NORMALE';
  vulnerabilites: string[];
  biensEssentielsSupports: string[];
}

export interface EvenementRedoute {
  id: string;
  nom: string;
  bienEssentielCible: string;
  impacts: {
    directs: string[];
    indirects: string[];
  };
  gravite: 'CRITIQUE' | 'MAJEUR' | 'MINEUR';
  cout: number;
}

export interface SocleSecurite {
  mesuresTechniques: MesureSecurite[];
  mesuresOrganisationnelles: MesureSecurite[];
  mesuresPhysiques: MesureSecurite[];
  ecarts: EcartSecurite[];
}

export interface MesureSecurite {
  id: string;
  nom: string;
  type: string;
  niveau: 'CORRECT' | 'PARTIEL' | 'INSUFFISANT' | 'ABSENT';
  description: string;
}

export interface EcartSecurite {
  id: string;
  mesure: string;
  ecart: string;
  risque: 'CRITIQUE' | 'MAJEUR' | 'MINEUR';
  impact: string;
}

export interface Vulnerabilite {
  id: string;
  nom: string;
  type: string;
  gravite: 'CRITIQUE' | 'ELEVEE' | 'MOYENNE' | 'FAIBLE';
  exploitabilite: number; // 1-10
  impact: string;
  bienSupportConcerne: string;
}

// 🎯 TYPES POUR L'ANALYSE DES SOURCES (ATELIER 2)
export interface SourceRisqueAnalysis {
  source: SourceRisque;
  pertinenceContexte: PertinenceContexte;
  attractiviteBiens: AttractiviteBiens;
  opportunitesVulnerabilites: OpportuniteVulnerabilites;
  scoreGlobal: number;
}

export interface SourceRisque {
  id: string;
  nom: string;
  type: 'cybercriminel' | 'espion' | 'hacktiviste' | 'etat' | 'initie';
  profil: string;
  motivations: string[];
  capacites: {
    techniques: number; // 1-10
    ressources: number; // 1-10
    persistance: number; // 1-10
  };
}

export interface PertinenceContexte {
  secteurCible: boolean;
  tailleOrganisation: boolean;
  budgetAttractivite: boolean;
  visibiliteMedias: boolean;
  score: number; // 1-5
}

export interface AttractiviteBiens {
  biensEssentielsVises: string[];
  motivationsAlignees: string[];
  impactPotentiel: string;
  score: number; // 1-5
}

export interface OpportuniteVulnerabilites {
  vulnerabilitesExploitables: string[];
  vecteursDattaque: string[];
  facilitesAcces: string[];
  score: number; // 1-5
}

/**
 * 🔗 GESTIONNAIRE PRINCIPAL DU FLUX DE DONNÉES
 */
export class WorkshopDataFlowManager {
  private atelier1Data: Atelier1Deliverables | null = null;

  // 📥 CHARGEMENT DES LIVRABLES ATELIER 1
  loadAtelier1Deliverables(data: Atelier1Deliverables): void {
    this.atelier1Data = data;
    console.log('✅ Livrables Atelier 1 chargés:', data);
  }

  // 🎯 UTILISATION POUR L'ATELIER 2 - ANALYSE DU CONTEXTE
  analyzeContextePertinence(source: SourceRisque): PertinenceContexte {
    if (!this.atelier1Data) {
      throw new Error('Livrables Atelier 1 non disponibles');
    }

    const contexte = this.atelier1Data.contexte;
    
    // Analyse de la pertinence selon le contexte CHU
    const secteurCible = this.isSecteurCible(source, contexte.organisation.secteur);
    const tailleOrganisation = this.isTailleAttractive(source, contexte.organisation);
    const budgetAttractivite = this.isBudgetAttractif(source, contexte.organisation.budget);
    const visibiliteMedias = this.isVisibiliteAttractive(source, contexte.organisation);

    // Calcul du score de pertinence contextuelle
    let score = 0;
    if (secteurCible) score += 1.5;
    if (tailleOrganisation) score += 1;
    if (budgetAttractivite) score += 1.5;
    if (visibiliteMedias) score += 1;

    return {
      secteurCible,
      tailleOrganisation,
      budgetAttractivite,
      visibiliteMedias,
      score: Math.min(5, score)
    };
  }

  // 🎯 UTILISATION POUR L'ATELIER 2 - ANALYSE DES BIENS ESSENTIELS
  analyzeAttractiviteBiens(source: SourceRisque): AttractiviteBiens {
    if (!this.atelier1Data) {
      throw new Error('Livrables Atelier 1 non disponibles');
    }

    const biensEssentiels = this.atelier1Data.biensEssentiels;
    const evenementsRedoutes = this.atelier1Data.evenementsRedoutes;

    // Identification des biens essentiels visés selon les motivations
    const biensVises = this.identifyTargetedBiens(source, biensEssentiels);
    const motivationsAlignees = this.alignMotivationsWithBiens(source, biensEssentiels);
    const impactPotentiel = this.calculatePotentialImpact(biensVises, evenementsRedoutes);

    // Calcul du score d'attractivité
    const score = this.calculateAttractiviteScore(biensVises, motivationsAlignees, impactPotentiel);

    return {
      biensEssentielsVises: biensVises.map(b => b.id),
      motivationsAlignees,
      impactPotentiel,
      score
    };
  }

  // 🎯 UTILISATION POUR L'ATELIER 2 - ANALYSE DES VULNÉRABILITÉS
  analyzeOpportuniteVulnerabilites(source: SourceRisque): OpportuniteVulnerabilites {
    if (!this.atelier1Data) {
      throw new Error('Livrables Atelier 1 non disponibles');
    }

    const vulnerabilites = this.atelier1Data.vulnerabilites;
    const biensSupports = this.atelier1Data.biensSupports;
    const ecarts = this.atelier1Data.socleSecurite.ecarts;

    // Identification des vulnérabilités exploitables par cette source
    const vulnerabilitesExploitables = this.identifyExploitableVulnerabilities(source, vulnerabilites);
    const vecteursDattaque = this.identifyAttackVectors(source, biensSupports, ecarts);
    const facilitesAcces = this.identifyAccessFacilities(source, ecarts);

    // Calcul du score d'opportunité
    const score = this.calculateOpportuniteScore(vulnerabilitesExploitables, vecteursDattaque, facilitesAcces);

    return {
      vulnerabilitesExploitables: vulnerabilitesExploitables.map(v => v.id),
      vecteursDattaque,
      facilitesAcces,
      score
    };
  }

  // 🎯 ANALYSE COMPLÈTE D'UNE SOURCE
  analyzeSourceRisque(source: SourceRisque): SourceRisqueAnalysis {
    const pertinenceContexte = this.analyzeContextePertinence(source);
    const attractiviteBiens = this.analyzeAttractiviteBiens(source);
    const opportunitesVulnerabilites = this.analyzeOpportuniteVulnerabilites(source);

    // Calcul du score global de pertinence
    const scoreGlobal = Math.round(
      (pertinenceContexte.score + attractiviteBiens.score + opportunitesVulnerabilites.score) / 3 * 4
    ); // Score sur 20

    return {
      source,
      pertinenceContexte,
      attractiviteBiens,
      opportunitesVulnerabilites,
      scoreGlobal
    };
  }

  // 🔧 MÉTHODES UTILITAIRES PRIVÉES

  private isSecteurCible(source: SourceRisque, secteur: string): boolean {
    const secteurTargeting = {
      'cybercriminel': ['sante', 'hopital', 'medical'],
      'espion': ['recherche', 'pharmaceutique', 'innovation'],
      'hacktiviste': ['public', 'gouvernement', 'social'],
      'etat': ['strategique', 'critique', 'souverain'],
      'initie': ['tous'] // Initiés présents partout
    };

    return secteurTargeting[source.type]?.some(target => 
      secteur.toLowerCase().includes(target)
    ) || false;
  }

  private isTailleAttractive(source: SourceRisque, org: any): boolean {
    // Cybercriminels préfèrent les grandes organisations (capacité de paiement)
    if (source.type === 'cybercriminel') {
      return org.budget > 100000000; // >100M€
    }
    
    // Espions s'intéressent aux organisations avec R&D
    if (source.type === 'espion') {
      return org.personnel > 1000; // >1000 employés
    }

    // Autres sources moins sensibles à la taille
    return true;
  }

  private isBudgetAttractif(source: SourceRisque, budget: number): boolean {
    const budgetThresholds = {
      'cybercriminel': 200000000, // 200M€ minimum attractif
      'espion': 50000000,         // 50M€ minimum
      'hacktiviste': 10000000,    // 10M€ minimum
      'etat': 500000000,          // 500M€ minimum
      'initie': 0                 // Pas de seuil
    };

    return budget >= (budgetThresholds[source.type] || 0);
  }

  private isVisibiliteAttractive(source: SourceRisque, org: any): boolean {
    // Hacktivistes recherchent la visibilité médiatique
    if (source.type === 'hacktiviste') {
      return org.secteur === 'sante' && org.taille === 'grande';
    }

    // Cybercriminels aiment la publicité pour leurs "exploits"
    if (source.type === 'cybercriminel') {
      return org.personnel > 2000;
    }

    // Espions et États préfèrent la discrétion
    return source.type !== 'espion' && source.type !== 'etat';
  }

  private identifyTargetedBiens(source: SourceRisque, biens: BienEssentiel[]): BienEssentiel[] {
    const targetPreferences = {
      'cybercriminel': ['processus'], // Processus critiques pour pression
      'espion': ['donnees'],          // Données pour espionnage
      'hacktiviste': ['mission'],     // Missions pour impact symbolique
      'etat': ['donnees', 'processus'], // Données et processus stratégiques
      'initie': ['donnees', 'processus'] // Accès privilégié à tout
    };

    const preferredTypes = targetPreferences[source.type] || [];
    return biens.filter(bien => 
      preferredTypes.includes(bien.type) && 
      bien.criticite === 'CRITIQUE'
    );
  }

  private alignMotivationsWithBiens(source: SourceRisque, biens: BienEssentiel[]): string[] {
    const motivationAlignment = {
      'financiere': ['processus critiques', 'données patients'],
      'concurrentielle': ['données recherche', 'propriété intellectuelle'],
      'ideologique': ['missions publiques', 'services sociaux'],
      'geopolitique': ['données stratégiques', 'infrastructures critiques'],
      'vengeance': ['systèmes critiques', 'réputation']
    };

    const alignedMotivations: string[] = [];
    source.motivations.forEach(motivation => {
      if (motivationAlignment[motivation as keyof typeof motivationAlignment]) {
        alignedMotivations.push(motivation);
      }
    });

    return alignedMotivations;
  }

  private calculatePotentialImpact(biens: BienEssentiel[], evenements: EvenementRedoute[]): string {
    const criticalBiens = biens.filter(b => b.criticite === 'CRITIQUE');
    const relatedEvents = evenements.filter(e => 
      criticalBiens.some(b => b.id === e.bienEssentielCible)
    );

    const criticalEvents = relatedEvents.filter(e => e.gravite === 'CRITIQUE');
    
    if (criticalEvents.length > 0) {
      return 'CRITIQUE - Risque vital, impact financier majeur';
    } else if (relatedEvents.length > 0) {
      return 'MAJEUR - Impact significatif sur les opérations';
    } else {
      return 'MINEUR - Impact limité';
    }
  }

  private calculateAttractiviteScore(biens: BienEssentiel[], motivations: string[], impact: string): number {
    let score = 0;
    
    // Points pour les biens critiques ciblés
    score += Math.min(3, biens.length);
    
    // Points pour l'alignement des motivations
    score += Math.min(1, motivations.length * 0.5);
    
    // Points pour l'impact potentiel
    if (impact.includes('CRITIQUE')) score += 1;
    else if (impact.includes('MAJEUR')) score += 0.5;
    
    return Math.min(5, score);
  }

  private identifyExploitableVulnerabilities(source: SourceRisque, vulns: Vulnerabilite[]): Vulnerabilite[] {
    const capabilityThreshold = {
      'cybercriminel': 7, // Très élevées
      'espion': 6,        // Élevées
      'hacktiviste': 4,   // Moyennes
      'etat': 9,          // Maximales
      'initie': 3         // Variables mais accès privilégié
    };

    const threshold = capabilityThreshold[source.type] || 5;
    
    return vulns.filter(vuln => 
      vuln.exploitabilite >= threshold || 
      (source.type === 'initie' && vuln.type.includes('interne'))
    );
  }

  private identifyAttackVectors(source: SourceRisque, supports: BienSupport[], ecarts: EcartSecurite[]): string[] {
    const vectors: string[] = [];
    
    // Vecteurs selon les écarts de sécurité
    ecarts.forEach(ecart => {
      if (ecart.risque === 'CRITIQUE') {
        if (ecart.mesure.includes('MFA')) vectors.push('Attaque par force brute');
        if (ecart.mesure.includes('EDR')) vectors.push('Malware avancé');
        if (ecart.mesure.includes('segmentation')) vectors.push('Propagation latérale');
        if (ecart.mesure.includes('formation')) vectors.push('Phishing ciblé');
      }
    });

    // Vecteurs selon les biens supports vulnérables
    supports.forEach(support => {
      if (support.vulnerabilites.length > 0) {
        if (support.type === 'systeme') vectors.push('Exploitation système');
        if (support.type === 'infrastructure') vectors.push('Compromission réseau');
      }
    });

    return [...new Set(vectors)]; // Dédoublonnage
  }

  private identifyAccessFacilities(source: SourceRisque, ecarts: EcartSecurite[]): string[] {
    const facilities: string[] = [];
    
    ecarts.forEach(ecart => {
      if (ecart.risque === 'CRITIQUE' || ecart.risque === 'MAJEUR') {
        facilities.push(`Écart: ${ecart.mesure} - ${ecart.ecart}`);
      }
    });

    // Facilités spécifiques aux initiés
    if (source.type === 'initie') {
      facilities.push('Accès physique aux locaux');
      facilities.push('Comptes privilégiés légitimes');
      facilities.push('Connaissance des procédures');
    }

    return facilities;
  }

  private calculateOpportuniteScore(vulns: Vulnerabilite[], vectors: string[], facilities: string[]): number {
    let score = 0;
    
    // Points pour les vulnérabilités exploitables
    score += Math.min(2, vulns.length * 0.5);
    
    // Points pour les vecteurs d'attaque
    score += Math.min(2, vectors.length * 0.3);
    
    // Points pour les facilités d'accès
    score += Math.min(1, facilities.length * 0.2);
    
    return Math.min(5, score);
  }

  // 📊 GÉNÉRATION DE RAPPORTS
  generateAtelier2Report(analyses: SourceRisqueAnalysis[]): string {
    const sortedAnalyses = analyses.sort((a, b) => b.scoreGlobal - a.scoreGlobal);
    
    let report = "# 📊 RAPPORT D'ANALYSE DES SOURCES DE RISQUES\n\n";
    report += "## 🎯 Sources prioritaires identifiées:\n\n";
    
    sortedAnalyses.forEach((analysis, index) => {
      report += `### ${index + 1}. ${analysis.source.nom} (${analysis.scoreGlobal}/20)\n`;
      report += `**Type:** ${analysis.source.type}\n`;
      report += `**Pertinence contexte:** ${analysis.pertinenceContexte.score}/5\n`;
      report += `**Attractivité biens:** ${analysis.attractiviteBiens.score}/5\n`;
      report += `**Opportunités:** ${analysis.opportunitesVulnerabilites.score}/5\n\n`;
    });

    return report;
  }
}

export default WorkshopDataFlowManager;
