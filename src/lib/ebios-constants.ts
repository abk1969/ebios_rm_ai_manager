import { GravityScale, LikelihoodScale, RiskLevel, EbiosScale } from '@/types/ebios';

// Échelles de cotation conformes ANSSI EBIOS RM v1.5
export const EBIOS_SCALES: EbiosScale = {
  gravity: {
    1: 'Négligeable',
    2: 'Limitée', 
    3: 'Importante',
    4: 'Critique'
  },
  likelihood: {
    1: 'Négligeable',
    2: 'Limitée',
    3: 'Importante', 
    4: 'Critique'
  },
  risk: {
    1: 'Négligeable',
    2: 'Limitée',
    3: 'Importante', 
    4: 'Critique'
  }
};

// Matrice de calcul du niveau de risque selon ANSSI
export const RISK_MATRIX: Record<GravityScale, Record<LikelihoodScale, RiskLevel>> = {
  1: { 1: 1, 2: 1, 3: 2, 4: 2 },
  2: { 1: 1, 2: 2, 3: 2, 4: 3 },
  3: { 1: 2, 2: 2, 3: 3, 4: 4 },
  4: { 1: 2, 2: 3, 3: 4, 4: 4 }
};

// Critères de validation par atelier EBIOS RM
export const WORKSHOP_VALIDATION_CRITERIA = {
  1: [
    { criterion: 'Valeurs métier identifiées', required: true },
    { criterion: 'Actifs supports cartographiés', required: true },
    { criterion: 'Événements redoutés définis', required: true },
    { criterion: 'Socle de sécurité évalué', required: true },
    { criterion: 'Parties prenantes identifiées', required: true }
  ],
  2: [
    { criterion: 'Sources de risque catégorisées', required: true },
    { criterion: 'Objectifs visés définis', required: true },
    { criterion: 'Modes opératoires analysés', required: true },
    { criterion: 'Pertinence évaluée', required: true }
  ],
  3: [
    { criterion: 'Scénarios stratégiques construits', required: true },
    { criterion: 'Chemins d\'attaque identifiés', required: true },
    { criterion: 'Vraisemblance évaluée', required: true },
    { criterion: 'Gravité évaluée', required: true },
    { criterion: 'Niveau de risque calculé', required: true }
  ],
  4: [
    { criterion: 'Scénarios opérationnels détaillés', required: true },
    { criterion: 'Actions d\'attaque spécifiées', required: true },
    { criterion: 'Difficultés évaluées', required: true },
    { criterion: 'Détectabilité analysée', required: true }
  ],
  5: [
    { criterion: 'Mesures de sécurité proposées', required: true },
    { criterion: 'Stratégie de traitement définie', required: true },
    { criterion: 'Plan d\'implémentation établi', required: true },
    { criterion: 'Risques résiduels évalués', required: true }
  ]
};

// Catégories de sources de risque selon EBIOS RM
export const RISK_SOURCE_CATEGORIES = {
  cybercriminal: 'Cybercriminel',
  terrorist: 'Terroriste',
  activist: 'Activiste',
  state: 'État',
  insider: 'Initié malveillant',
  competitor: 'Concurrent',
  natural: 'Catastrophe naturelle'
};

// Types d'actifs supports selon EBIOS RM
export const SUPPORTING_ASSET_TYPES = {
  data: 'Données',
  software: 'Logiciel',
  hardware: 'Matériel',
  network: 'Réseau',
  personnel: 'Personnel',
  site: 'Site',
  organization: 'Organisation'
};

// Types d'impact selon EBIOS RM
export const IMPACT_TYPES = {
  availability: 'Disponibilité',
  integrity: 'Intégrité',
  confidentiality: 'Confidentialité',
  authenticity: 'Authenticité',
  non_repudiation: 'Non-répudiation'
};

// Niveaux de classification sécurité
export const SECURITY_LEVELS = {
  public: 'Public',
  internal: 'Usage interne',
  confidential: 'Confidentiel',
  secret: 'Secret'
};

// Techniques MITRE ATT&CK fréquemment utilisées
export const MITRE_TECHNIQUES = {
  T1566: 'Phishing',
  T1078: 'Valid Accounts',
  T1190: 'Exploit Public-Facing Application',
  T1055: 'Process Injection',
  T1082: 'System Information Discovery',
  T1083: 'File and Directory Discovery',
  T1005: 'Data from Local System',
  T1041: 'Exfiltration Over C2 Channel',
  T1485: 'Data Destruction',
  T1486: 'Data Encrypted for Impact'
};

// Utilitaires de calcul
export const EbiosUtils = {
  /**
   * Calcule le niveau de risque selon la matrice ANSSI
   */
  calculateRiskLevel(gravity: GravityScale, likelihood: LikelihoodScale): RiskLevel {
    return RISK_MATRIX[gravity][likelihood];
  },

  /**
   * Détermine si un niveau de risque est acceptable
   */
  isRiskAcceptable(riskLevel: RiskLevel): boolean {
    const numLevel = typeof riskLevel === 'string' ? this.convertStringRiskToNumber(riskLevel) : riskLevel;
    return numLevel <= 2;
  },

  /**
   * Calcule le pourcentage de complétion d'un atelier
   */
  calculateWorkshopCompletion(criteriaValidation: { criterion: string; met: boolean }[]): number {
    const metCriteria = criteriaValidation.filter(c => c.met).length;
    return Math.round((metCriteria / criteriaValidation.length) * 100);
  },

  /**
   * Valide les prérequis pour passer à l'atelier suivant
   */
  validateWorkshopPrerequisites(workshopNumber: number, criteriaValidation: { criterion: string; required: boolean; met: boolean }[]): boolean {
    const requiredCriteria = criteriaValidation.filter(c => c.required);
    return requiredCriteria.every(c => c.met);
  },

  /**
   * Génère un identifiant de scénario selon nomenclature EBIOS RM
   */
  generateScenarioId(missionId: string, type: 'strategic' | 'operational', sequence: number): string {
    const prefix = type === 'strategic' ? 'SS' : 'SO';
    return `${missionId.slice(0, 4).toUpperCase()}-${prefix}-${sequence.toString().padStart(3, '0')}`;
  },

  /**
   * Formate les labels des échelles pour l'affichage
   */
  formatScaleLabel(type: 'gravity' | 'likelihood' | 'risk', value: number | string): string {
    const scale = EBIOS_SCALES[type];
    const numValue = typeof value === 'string' ? this.convertStringRiskToNumber(value) : value;
    return `${numValue} - ${scale[numValue as keyof typeof scale]}`;
  },

  /**
   * 🔧 CORRECTION: Méthode manquante pour obtenir les infos de niveau de risque
   */
  getRiskLevelInfo(level: RiskLevel): { label: string; color: string; priority: number } {
    const numLevel = typeof level === 'string' ? this.convertStringRiskToNumber(level) : level;

    const riskInfo = {
      1: { label: 'Négligeable', color: '#10b981', priority: 1 },
      2: { label: 'Limitée', color: '#f59e0b', priority: 2 },
      3: { label: 'Importante', color: '#f97316', priority: 3 },
      4: { label: 'Critique', color: '#ef4444', priority: 4 }
    };

    return riskInfo[numLevel as 1 | 2 | 3 | 4] || riskInfo[1];
  },

  /**
   * 🔧 CORRECTION: Convertit les niveaux de risque string en number
   */
  convertStringRiskToNumber(risk: string): number {
    const mapping = {
      'low': 1,
      'medium': 2,
      'high': 3,
      'critical': 4,
      'négligeable': 1,
      'limitée': 2,
      'importante': 3,
      'critique': 4
    };
    return mapping[risk.toLowerCase() as keyof typeof mapping] || 1;
  },

  /**
   * 🆕 FONCTION UTILITAIRE CENTRALE : Normalise RiskLevel pour comparaisons
   * Essentielle pour la cohérence EBIOS RM
   */
  normalizeRiskLevel(riskLevel: RiskLevel): number {
    if (typeof riskLevel === 'number') {
      return Math.max(1, Math.min(4, riskLevel)); // Assure 1-4
    }
    return this.convertStringRiskToNumber(riskLevel);
  },

  /**
   * 🆕 COMPARAISON SÉCURISÉE : Pour tous les filtres de risque
   */
  compareRiskLevel(riskLevel: RiskLevel, threshold: number, operator: '>=' | '<=' | '>' | '<' | '==='): boolean {
    const normalizedRisk = this.normalizeRiskLevel(riskLevel);
    switch (operator) {
      case '>=': return normalizedRisk >= threshold;
      case '<=': return normalizedRisk <= threshold;
      case '>': return normalizedRisk > threshold;
      case '<': return normalizedRisk < threshold;
      case '===': return normalizedRisk === threshold;
      default: return false;
    }
  },

  /**
   * Valide la cohérence entre ateliers
   */
  validateCrossWorkshopConsistency(
    businessValues: any[],
    dreadedEvents: any[],
    riskSources: any[],
    strategicScenarios: any[]
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Vérifier que chaque valeur métier a au moins un événement redouté
    businessValues.forEach(bv => {
      const hasEvents = dreadedEvents.some(de => de.businessValueId === bv.id);
      if (!hasEvents) {
        errors.push(`Valeur métier "${bv.name}" sans événement redouté associé`);
      }
    });

    // Vérifier que chaque source de risque a des objectifs
    riskSources.forEach(sr => {
      if (!sr.objectives || sr.objectives.length === 0) {
        errors.push(`Source de risque "${sr.name}" sans objectifs définis`);
      }
    });

    // Vérifier cohérence scénarios stratégiques
    strategicScenarios.forEach(ss => {
      const businessValueExists = businessValues.some(bv => bv.id === ss.targetBusinessValueId);
      const riskSourceExists = riskSources.some(rs => rs.id === ss.riskSourceId);
      const dreadedEventExists = dreadedEvents.some(de => de.id === ss.dreadedEventId);

      if (!businessValueExists) {
        errors.push(`Scénario "${ss.name}" référence une valeur métier inexistante`);
      }
      if (!riskSourceExists) {
        errors.push(`Scénario "${ss.name}" référence une source de risque inexistante`);
      }
      if (!dreadedEventExists) {
        errors.push(`Scénario "${ss.name}" référence un événement redouté inexistant`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
};

// Modèles de validation des données
export const EBIOS_VALIDATION_RULES = {
  businessValue: {
    name: { required: true, maxLength: 100 },
    description: { required: true, maxLength: 500 },
    category: { required: true, allowedValues: ['primary', 'support', 'management'] },
    priority: { required: true, allowedValues: [1, 2, 3, 4] }
  },
  
  dreadedEvent: {
    name: { required: true, maxLength: 100 },
    description: { required: true, maxLength: 500 },
    gravity: { required: true, allowedValues: [1, 2, 3, 4] },
    impactType: { required: true, allowedValues: Object.keys(IMPACT_TYPES) }
  },

  riskSource: {
    name: { required: true, maxLength: 100 },
    description: { required: true, maxLength: 500 },
    category: { required: true, allowedValues: Object.keys(RISK_SOURCE_CATEGORIES) },
    pertinence: { required: true, allowedValues: [1, 2, 3, 4] }
  },

  strategicScenario: {
    name: { required: true, maxLength: 100 },
    description: { required: true, maxLength: 1000 },
    likelihood: { required: true, allowedValues: [1, 2, 3, 4] },
    gravity: { required: true, allowedValues: [1, 2, 3, 4] }
  },

  securityMeasure: {
    name: { required: true, maxLength: 100 },
    description: { required: true, maxLength: 500 },
    controlType: { required: true, allowedValues: ['preventive', 'detective', 'corrective', 'directive'] },
    priority: { required: true, allowedValues: [1, 2, 3, 4] }
  }
}; 