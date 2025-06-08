import type { AttackPath, AttackPathway, RiskSource, DreadedEvent, StrategicScenario, LikelihoodScale } from '@/types/ebios';

interface AttackVector {
  technique: string;
  tactic: string;
  difficulty: number;
  detectability: number;
  prerequisites: string[];
}

interface AttackPathwaySuggestion {
  name: string;
  description: string;
  steps: {
    name: string;
    description: string;
    techniques: string[];
    duration: string;
    detectability: number;
  }[];
  feasibility: LikelihoodScale;
  detectability: LikelihoodScale;
  confidence: number;
  reasoning: string;
}

interface AttackPathwayEnhanced extends Omit<AttackPathway, 'steps'> {
  name?: string;
  description?: string;
  feasibility?: LikelihoodScale;
  detectability?: LikelihoodScale;
  steps?: Array<{
    id: string;
    name: string;
    description: string;
    technique: string;
    techniques?: string[];
    duration?: string;
    difficulty: number;
    detectability: number;
  }>;
}

/**
 * Service IA pour l'enrichissement des chemins d'attaque (Workshop 4)
 * Basé sur MITRE ATT&CK, ISO 27002, NIST CSF
 */
export class AttackPathAIService {
  
  // Base de connaissances MITRE ATT&CK enrichie
  private static readonly ATTACK_VECTORS: Record<string, AttackVector[]> = {
    'phishing': [
      {
        technique: 'T1566.001 - Spearphishing Attachment',
        tactic: 'Initial Access',
        difficulty: 2,
        detectability: 2,
        prerequisites: ['Email addresses', 'Social context']
      },
      {
        technique: 'T1566.002 - Spearphishing Link',
        tactic: 'Initial Access',
        difficulty: 1,
        detectability: 3,
        prerequisites: ['Email addresses', 'Credible pretext']
      }
    ],
    'exploitation': [
      {
        technique: 'T1190 - Exploit Public-Facing Application',
        tactic: 'Initial Access',
        difficulty: 3,
        detectability: 2,
        prerequisites: ['Vulnerability knowledge', 'Technical skills']
      },
      {
        technique: 'T1211 - Exploitation for Defense Evasion',
        tactic: 'Defense Evasion',
        difficulty: 4,
        detectability: 1,
        prerequisites: ['0-day exploit', 'Advanced skills']
      }
    ],
    'insider': [
      {
        technique: 'T1078 - Valid Accounts',
        tactic: 'Initial Access',
        difficulty: 1,
        detectability: 4,
        prerequisites: ['Legitimate access']
      },
      {
        technique: 'T1052 - Exfiltration Over Physical Medium',
        tactic: 'Exfiltration',
        difficulty: 1,
        detectability: 3,
        prerequisites: ['Physical access', 'USB allowed']
      }
    ],
    'supply-chain': [
      {
        technique: 'T1195 - Supply Chain Compromise',
        tactic: 'Initial Access',
        difficulty: 4,
        detectability: 1,
        prerequisites: ['Supplier access', 'Long-term operation']
      }
    ]
  };

  // Modèles de chemins d'attaque par type de source de risque
  private static readonly ATTACK_PATTERNS = {
    'organized-crime': {
      primary: ['phishing', 'exploitation'],
      motivation: 'financial',
      sophistication: 'medium',
      persistence: 'high'
    },
    'state': {
      primary: ['supply-chain', 'exploitation', 'insider'],
      motivation: 'espionage',
      sophistication: 'high',
      persistence: 'very-high'
    },
    'competitor': {
      primary: ['insider', 'phishing'],
      motivation: 'competitive-advantage',
      sophistication: 'medium',
      persistence: 'medium'
    },
    'hacktivist': {
      primary: ['exploitation', 'phishing'],
      motivation: 'ideological',
      sophistication: 'low-medium',
      persistence: 'low'
    }
  };

  /**
   * Génère des suggestions de chemins d'attaque basées sur le contexte
   */
  static generateAttackPathSuggestions(
    scenario: StrategicScenario,
    riskSource: RiskSource,
    dreadedEvent: DreadedEvent
  ): AttackPathwaySuggestion[] {
    const suggestions: AttackPathwaySuggestion[] = [];
    
    // Identifier le profil d'attaquant
    const attackerProfile = this.getAttackerProfile(riskSource);
    
    // Sélectionner les vecteurs d'attaque appropriés
    const relevantVectors = this.selectRelevantVectors(
      attackerProfile,
      dreadedEvent.impactType,
      typeof riskSource.expertise === 'string' ? this.expertiseToNumber(riskSource.expertise) : riskSource.expertise || 2
    );
    
    // Générer des chemins d'attaque pour chaque vecteur
    relevantVectors.forEach(vectorType => {
      const vectors = this.ATTACK_VECTORS[vectorType] || [];
      
      vectors.forEach(vector => {
        const path = this.buildAttackPath(
          vector,
          vectorType,
          scenario,
          riskSource,
          dreadedEvent
        );
        
        if (path) {
          suggestions.push(path);
        }
      });
    });
    
    // Trier par pertinence et limiter
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);
  }

  /**
   * Enrichit un chemin d'attaque existant avec des métadonnées IA
   */
  static enrichAttackPath(
    path: Partial<AttackPath>,
    scenario: StrategicScenario,
    riskSource: RiskSource
  ): Partial<AttackPath> {
    return {
      ...path,
      aiMetadata: {
        coherenceScore: this.calculatePathCoherence(path, scenario, riskSource),
        // suggestedTechniques: this.suggestAdditionalTechniques(path), // 🔧 CORRECTION: Propriété non supportée dans le type
        // riskAssessment: this.assessPathRisk(path, riskSource), // 🔧 CORRECTION: Propriété non supportée
        // detectionStrategies: this.suggestDetectionStrategies(path), // 🔧 CORRECTION: Propriété non supportée
        // mitigationControls: this.suggestMitigationControls(path) // 🔧 CORRECTION: Propriété non supportée
      }
    };
  }

  /**
   * Calcule la cohérence d'un chemin d'attaque
   */
  private static calculatePathCoherence(
    path: Partial<AttackPath>,
    scenario: StrategicScenario,
    riskSource: RiskSource
  ): number {
    let score = 1.0;
    
    // Vérifier la cohérence avec l'expertise de la source
    if (path.feasibility && riskSource.expertise) {
      const expertiseNum = typeof riskSource.expertise === 'string' ? this.expertiseToNumber(riskSource.expertise) : riskSource.expertise || 2;
      const expertiseDiff = Math.abs((path.feasibility || 2) - (5 - expertiseNum));
      score -= expertiseDiff * 0.1;
    }
    
    // Vérifier la cohérence avec la motivation
    if (riskSource.motivation && path.steps) {
      const stepsCount = path.steps.length;
      if (riskSource.motivation <= 2 && stepsCount > 5) {
        score -= 0.2; // Trop d'étapes pour une faible motivation
      }
    }
    
    // Vérifier la présence de techniques MITRE
    if (path.techniques && path.techniques.length > 0) {
      score += 0.1;
    }
    
    return Math.max(0, Math.min(1, score));
  }

  /**
   * Suggère des techniques MITRE supplémentaires
   */
  private static suggestAdditionalTechniques(
    path: Partial<AttackPath>
  ): string[] {
    const suggestions: string[] = [];
    
    // Analyser les techniques existantes
    const existingTechniques = path.techniques || [];
    
    // Suggérer des techniques complémentaires
    if (existingTechniques.some(t => t.includes('T1566'))) {
      // Si phishing, suggérer persistance
      suggestions.push('T1547 - Boot or Logon Autostart Execution');
      suggestions.push('T1053 - Scheduled Task/Job');
    }
    
    if (existingTechniques.some(t => t.includes('T1190'))) {
      // Si exploitation, suggérer escalade
      suggestions.push('T1068 - Exploitation for Privilege Escalation');
      suggestions.push('T1055 - Process Injection');
    }
    
    return suggestions.slice(0, 3);
  }

  /**
   * Évalue le risque du chemin d'attaque
   */
  private static assessPathRisk(
    path: Partial<AttackPath>,
    riskSource: RiskSource
  ): {
    likelihood: number;
    impact: number;
    speed: string;
    attribution: string;
  } {
    // Calcul basé sur les caractéristiques du chemin et de la source
    const likelihood = Math.min(4, 
      (path.feasibility || 2) * (typeof riskSource.expertise === 'string' ? this.expertiseToNumber(riskSource.expertise) : riskSource.expertise || 2) / 2
    );
    
    const impact = Math.min(4,
      (typeof riskSource.resources === 'string' ? AttackPathAIService.resourceToNumber(riskSource.resources) : 2) + (path.steps?.length || 0) / 3
    );
    
    const speed = path.steps && path.steps.length <= 3 ? 'fast' : 'slow';
    const attribution = path.detectability && path.detectability >= 3 ? 'low' : 'high';
    
    return { likelihood, impact, speed, attribution };
  }

  /**
   * Suggère des stratégies de détection
   */
  private static suggestDetectionStrategies(
    path: Partial<AttackPath>
  ): string[] {
    const strategies: string[] = [];
    
    // Basé sur les techniques utilisées
    if (path.techniques) {
      path.techniques.forEach(technique => {
        if (technique.includes('T1566')) {
          strategies.push('Email gateway filtering');
          strategies.push('User awareness training');
        }
        if (technique.includes('T1190')) {
          strategies.push('Web Application Firewall (WAF)');
          strategies.push('Vulnerability scanning');
        }
        if (technique.includes('T1078')) {
          strategies.push('Anomaly detection on user behavior');
          strategies.push('Multi-factor authentication');
        }
      });
    }
    
    return [...new Set(strategies)].slice(0, 5);
  }

  /**
   * Suggère des contrôles de mitigation (ISO 27002, CIS)
   */
  private static suggestMitigationControls(
    path: Partial<AttackPath>
  ): {
    iso27002: string[];
    cisControls: string[];
    nistCSF: string[];
  } {
    const controls = {
      iso27002: [] as string[],
      cisControls: [] as string[],
      nistCSF: [] as string[]
    };
    
    // Mapping basé sur les techniques d'attaque
    if (path.techniques) {
      path.techniques.forEach(technique => {
        if (technique.includes('T1566')) {
          controls.iso27002.push('A.8.23 - Web filtering');
          controls.cisControls.push('CIS 9 - Email and Web Browser Protections');
          controls.nistCSF.push('PR.AT-1 - Security awareness training');
        }
        if (technique.includes('T1190')) {
          controls.iso27002.push('A.8.9 - Configuration management');
          controls.cisControls.push('CIS 3 - Data Protection');
          controls.nistCSF.push('PR.IP-1 - Baseline configuration');
        }
      });
    }
    
    return controls;
  }

  /**
   * Détermine le profil d'attaquant basé sur la source de risque
   */
  private static getAttackerProfile(riskSource: RiskSource): string {
    // Mapping simplifié basé sur la catégorie
    const categoryMapping: Record<string, string> = {
      'organized': 'organized-crime',
      'state': 'state',
      'individual': 'hacktivist',
      'organization': 'competitor'
    };
    
    return categoryMapping[riskSource.category] || 'hacktivist';
  }

  /**
   * Convertit l'expertise string en number
   */
  private static expertiseToNumber(expertise: string): number {
    const mapping: Record<string, number> = {
      'limited': 1,
      'moderate': 2,
      'high': 3,
      'expert': 4
    };
    return mapping[expertise] || 2;
  }

  /**
   * 🔧 CORRECTION: Convertit les ressources string en number
   */
  private static resourceToNumber(resources: string): number {
    const mapping: Record<string, number> = {
      'limited': 1,
      'moderate': 2,
      'high': 3,
      'unlimited': 4
    };
    return mapping[resources] || 2;
  }

  // 🔧 CORRECTION: Méthodes d'instance manquantes
  private expertiseToNumber(expertise: string): number {
    return AttackPathAIService.expertiseToNumber(expertise);
  }

  private resourceToNumber(resources: string): number {
    const mapping: Record<string, number> = {
      'limited': 1,
      'moderate': 2,
      'high': 3,
      'unlimited': 4
    };
    return mapping[resources] || 2;
  }

  /**
   * Sélectionne les vecteurs d'attaque pertinents
   */
  private static selectRelevantVectors(
    profile: string,
    impactType: string,
    expertise: number
  ): string[] {
    const pattern = this.ATTACK_PATTERNS[profile as keyof typeof this.ATTACK_PATTERNS];
    if (!pattern) return ['phishing']; // Par défaut
    
    // Filtrer selon l'expertise
    let vectors = [...pattern.primary];
    
    if (expertise < 2) {
      // Faible expertise : techniques simples uniquement
      vectors = vectors.filter(v => 
        ['phishing', 'insider'].includes(v)
      );
    }
    
    return vectors;
  }

  /**
   * Construit un chemin d'attaque complet
   */
  private static buildAttackPath(
    vector: AttackVector,
    vectorType: string,
    scenario: StrategicScenario,
    riskSource: RiskSource,
    dreadedEvent: DreadedEvent
  ): AttackPathwaySuggestion | null {
    // Générer les étapes basées sur le vecteur
    const steps = this.generateAttackSteps(
      vectorType,
      vector,
      dreadedEvent.impactType
    );
    
    if (steps.length === 0) return null;
    
    // Calculer la faisabilité globale
    const feasibility = Math.round(
      (vector.difficulty + (typeof riskSource.expertise === 'string' ? AttackPathAIService.expertiseToNumber(riskSource.expertise) : riskSource.expertise || 2)) / 2
    ) as 1 | 2 | 3 | 4;
    
    // Calculer la détectabilité moyenne
    const detectability = Math.round(
      steps.reduce((sum, step) => sum + step.detectability, 0) / steps.length
    ) as 1 | 2 | 3 | 4;
    
    // Calculer la confiance de la suggestion
    const confidence = this.calculateSuggestionConfidence(
      vector,
      riskSource,
      scenario
    );
    
    return {
      name: `${vectorType.charAt(0).toUpperCase() + vectorType.slice(1)} - ${vector.tactic}`,
      description: `Chemin d'attaque utilisant ${vector.technique} pour atteindre ${dreadedEvent.name}`,
      steps,
      feasibility,
      detectability,
      confidence,
      reasoning: `Basé sur le profil ${riskSource.category} avec expertise niveau ${riskSource.expertise}`
    };
  }

  /**
   * Génère les étapes détaillées d'un chemin d'attaque
   */
  private static generateAttackSteps(
    vectorType: string,
    vector: AttackVector,
    impactType: string
  ): AttackPathwaySuggestion['steps'] {
    const steps: AttackPathwaySuggestion['steps'] = [];
    
    // Étapes initiales selon le type de vecteur
    if (vectorType === 'phishing') {
      steps.push({
        name: 'Reconnaissance',
        description: 'Collecte d\'informations sur les cibles (LinkedIn, site web)',
        techniques: ['T1598 - Phishing for Information'],
        duration: '1-2 semaines',
        detectability: 1
      });
      steps.push({
        name: 'Weaponization',
        description: 'Création du mail de phishing avec payload malveillant',
        techniques: [vector.technique],
        duration: '2-3 jours',
        detectability: 1
      });
      steps.push({
        name: 'Delivery',
        description: 'Envoi du mail de phishing aux cibles identifiées',
        techniques: ['T1566 - Phishing'],
        duration: '1 jour',
        detectability: 3
      });
    }
    
    // Étapes finales selon l'impact souhaité
    if (impactType === 'confidentiality') {
      steps.push({
        name: 'Data Discovery',
        description: 'Recherche et identification des données sensibles',
        techniques: ['T1083 - File and Directory Discovery'],
        duration: '1-2 jours',
        detectability: 2
      });
      steps.push({
        name: 'Exfiltration',
        description: 'Extraction des données vers l\'extérieur',
        techniques: ['T1041 - Exfiltration Over C2 Channel'],
        duration: '1-3 heures',
        detectability: 3
      });
    }
    
    return steps;
  }

  /**
   * Calcule la confiance de la suggestion
   */
  private static calculateSuggestionConfidence(
    vector: AttackVector,
    riskSource: RiskSource,
    scenario: StrategicScenario
  ): number {
    let confidence = 0.5;
    
    // Ajuster selon la correspondance expertise/difficulté
    const expertiseMatch = Math.abs(
      (typeof riskSource.expertise === 'string' ? this.expertiseToNumber(riskSource.expertise) : riskSource.expertise || 2) - vector.difficulty
    );
    confidence += (4 - expertiseMatch) * 0.1;
    
    // Ajuster selon les prérequis
    if (vector.prerequisites.length <= 2) {
      confidence += 0.1;
    }
    
    // Ajuster selon le niveau de risque du scénario
    const riskLevelNum = typeof scenario.riskLevel === 'string' ?
      (scenario.riskLevel === 'low' ? 1 : scenario.riskLevel === 'medium' ? 2 : scenario.riskLevel === 'high' ? 3 : 4) :
      scenario.riskLevel;
    confidence += riskLevelNum * 0.05;
    
    return Math.min(1, Math.max(0, confidence));
  }
}