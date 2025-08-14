export interface SecurityMeasure {
  id: string;
  name: string;
  description: string;
  isoCategory?: string;
  isoControl?: string;
  controlType: 'preventive' | 'detective' | 'corrective' | 'directive';
  status: 'planned' | 'in_progress' | 'implemented' | 'verified' | 'obsolete';
  priority: GravityScale;
  responsibleParty: string;
  dueDate: string;
  missionId: string;
  effectiveness: GravityScale;
  implementationCost: 'low' | 'medium' | 'high' | 'very_high';
  maintenanceCost: 'low' | 'medium' | 'high' | 'very_high';
  targetScenarios: string[];
  targetVulnerabilities: string[];
  implementation: SecurityMeasureImplementation;
  createdAt: string;
  updatedAt: string;

  // 🔧 CORRECTION: Propriétés manquantes utilisées dans le code
  type?: 'preventive' | 'detective' | 'corrective' | 'compensatory';
  cost?: 'low' | 'medium' | 'high' | 'very_high' | number; // Support des deux types
  implementationTime?: string;
  implementationComplexity?: number; // 1-5
  complexity?: number; // 1-5
  riskReduction?: number; // Pourcentage 0-100
  nistReference?: string;
  nistFamily?: string; // 🆕 NIST Family (ex: AC, AU, etc.)
  category?: string;
  implementationTimeframe?: 'immediate' | 'short' | 'medium' | 'long';
  targetedScenarios?: string[]; // Alias pour targetScenarios
  domain?: string; // 🔧 CORRECTION: Propriété manquante
  function?: string; // 🔧 CORRECTION: Propriété manquante
  securityControls?: string[]; // 🔧 CORRECTION: Propriété manquante

  // 🆕 PROPRIÉTÉS WORKSHOP 5 (Mesures de sécurité)
  implementationNotes?: string; // Notes d'implémentation
  validationCriteria?: string; // Critères de validation
  dependencies?: string[]; // Dépendances avec autres mesures
  monitoringMethod?: string; // Méthode de surveillance

  aiSuggestions?: Array<{
    type: string;
    description: string;
    confidence: number;
  }>;

  typeMesureAccess?: 'GOUVERNANCE' | 'PROTECTION' | 'DEFENSE' | 'RESILIENCE';
  freinDifficulteMEO?: string;
  echeanceEnMois?: number;
  responsablesMultiples?: string[];
  responsableParty?: string; // Alias pour responsibleParty (compatibilité Access)

  aiMetadata?: {
    autoCompleted?: boolean;
    suggestedISO?: {
      category: string;
      control: string;
      confidence: number;
    };
    coherenceScore?: number;
    relatedMeasures?: string[];
    effectivenessAnalysis?: {
      predictedEffectiveness: number;
      riskReductionFactor: number;
      recommendations: string[];
    };
  };
}

export interface Workshop {
  id: string;
  missionId: string;
  number: 1 | 2 | 3 | 4 | 5;
  status: 'not_started' | 'in_progress' | 'completed' | 'validated';
  completedSteps: string[];
  validationCriteria: WorkshopValidation[];
  prerequisitesMet: boolean;
  expertValidation?: ExpertValidation;
  createdAt: string;
  updatedAt: string;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'in_progress' | 'review' | 'completed' | 'archived';
  dueDate: string;
  assignedTo: string[];
  organizationContext: OrganizationContext;
  scope: AnalysisScope;
  ebiosCompliance: EbiosCompliance;
  createdAt: string;
  updatedAt: string;

  // 🔧 CORRECTION: Propriétés manquantes utilisées dans le code
  organization?: string; // Nom de l'organisation
  objective?: string; // Objectif de la mission

  // 🆕 EXTENSIONS ARCHITECTURE AGENTIC
  agentConfiguration?: {
    enabledAgents: string[];
    fallbackMode: boolean;
    circuitBreakerEnabled: boolean;
    validationLevel: 'basic' | 'standard' | 'strict' | 'anssi_compliant';
  };

  // 🆕 TRAÇABILITÉ EBIOS RM
  ebiosTraceability?: {
    workshopStates: EbiosWorkshopState[];
    decisionLog: DecisionLogEntry[];
    validationHistory: ValidationHistoryEntry[];
    complianceScore: number;
    lastAuditDate?: string;
  };

  // 🆕 MÉTRIQUES DE PERFORMANCE
  performanceMetrics?: {
    completionTime: number; // en heures
    agentUsageRate: number; // 0-1
    fallbackUsageRate: number; // 0-1
    userSatisfactionScore: number; // 0-5
    anssiComplianceScore: number; // 0-1
  };

  // 🆕 CONTEXTE DE MISSION POUR AGENTS IA
  missionContext?: {
    organizationName: string;
    sector: string;
    organizationSize: string;
    geographicScope: string;
    criticalityLevel: string;
    siComponents: string[];
    criticalProcesses: string[];
    stakeholders: string[];
    regulations: string[];
    financialStakes: string;
    securityMaturity: string;
    missionObjectives: string[];
    timeframe: string;
    specificRequirements: string;
    pastIncidents?: string;
  };
}

export interface DreadedEvent {
  id: string;
  name: string;
  description: string;
  essentialAssetId: string; // 🔧 CORRECTION: Référence vers le bien essentiel (logique EBIOS RM)
  businessValueId?: string; // 🔧 DEPRECATED: Maintenu pour compatibilité, sera supprimé
  gravity: GravityScale;
  impactType: 'availability' | 'integrity' | 'confidentiality' | 'authenticity' | 'non_repudiation';
  consequences: string;
  missionId: string;
  createdAt: string;
  updatedAt: string;

  // 🔧 CORRECTION: Propriétés manquantes utilisées dans le code
  impact?: number; // Impact numérique (1-4)
  likelihood?: number; // Vraisemblance numérique (1-4)
  impactedBusinessValues?: string[]; // IDs des valeurs métier impactées

  // 🆕 COMPATIBILITÉ ACCESS
  impactsList?: string[];              // Pour gérer les impacts multiples Access
  valeurMetierNom?: string;           // Référence textuelle Access

  // 🆕 MÉTADONNÉES IA
  aiAnalysis?: {
    impactSeverity?: number;
    cascadingEffects?: string[];
    mitigationSuggestions?: string[];
    relatedEvents?: string[];
    probabilityAssessment?: {
      likelihood: number;
      confidence: number;
      factors: string[];
    };
  };
}

// 🎯 BIENS ESSENTIELS (EBIOS RM) - Primary Assets
export interface EssentialAsset {
  id: string;
  name: string;
  description: string;
  type: 'process' | 'information' | 'know_how'; // Types EBIOS RM
  category: 'mission_critical' | 'business_critical' | 'operational';
  criticalityLevel: 'essential' | 'important' | 'useful';
  supportedBusinessValues: string[]; // IDs des valeurs métier que ce bien essentiel supporte
  supportingAssets: SupportingAsset[];
  dreadedEvents: DreadedEvent[];
  stakeholders: string[];
  missionId: string;
  createdAt: string;
  updatedAt: string;

  // Propriétés EBIOS RM spécifiques
  confidentialityRequirement: GravityScale;
  integrityRequirement: GravityScale;
  availabilityRequirement: GravityScale;
  authenticityRequirement?: GravityScale;
  nonRepudiationRequirement?: GravityScale;

  // Contexte organisationnel
  owner: string; // Propriétaire métier
  custodian?: string; // Gardien technique
  users: string[]; // Utilisateurs principaux

  // 🆕 COMPATIBILITÉ ACCESS
  natureValeurMetier?: 'PROCESSUS' | 'INFORMATION';
  responsableEntite?: string;
  missionNom?: string;

  // 🆕 MÉTADONNÉES IA
  aiMetadata?: {
    autoCompleted?: boolean;
    suggestedCategory?: string;
    coherenceScore?: number;
    relatedAssets?: string[];
    impactAnalysis?: {
      criticalityScore: number;
      dependencies: string[];
      riskExposure: number;
    };
    recommendations?: string[];
  };
}

// 💼 VALEURS MÉTIER (EBIOS RM) - Business Values (concept plus abstrait)
export interface BusinessValue {
  id: string;
  name: string;
  description: string;
  category: 'reputation' | 'trust' | 'competitive_advantage' | 'financial' | 'regulatory' | 'operational';
  priority: GravityScale;
  supportingEssentialAssets: string[]; // IDs des biens essentiels qui supportent cette valeur métier
  missionId: string;
  createdAt: string;
  updatedAt: string;

  // Impact potentiel sur l'organisation
  financialImpact?: {
    directLoss: number;
    indirectLoss: number;
    currency: string;
  };
  reputationalImpact?: GravityScale;
  regulatoryImpact?: GravityScale;
  operationalImpact?: GravityScale;

  // Parties prenantes concernées
  stakeholderIds: string[];

  // 🆕 MÉTADONNÉES IA
  aiMetadata?: {
    autoCompleted?: boolean;
    suggestedCategory?: string;
    coherenceScore?: number;
    relatedValues?: string[];
    impactAnalysis?: {
      criticalityScore: number;
      dependencies: string[];
      riskExposure: number;
    };
    recommendations?: string[];
  };
}

export interface SupportingAsset {
  id: string;
  name: string;
  type: 'data' | 'software' | 'hardware' | 'network' | 'personnel' | 'site' | 'organization';
  description: string;
  essentialAssetId: string; // 🔧 CORRECTION: Référence vers le bien essentiel (logique EBIOS RM)
  businessValueId?: string; // 🔧 DEPRECATED: Maintenu pour compatibilité, sera supprimé
  missionId: string;
  securityLevel: 'public' | 'internal' | 'confidential' | 'secret';
  vulnerabilities: Vulnerability[] | string[]; // Support des deux formats pour compatibilité
  dependsOn: string[];
  createdAt: string;
  updatedAt: string;

  // 🔧 CORRECTION: Propriétés manquantes utilisées dans le code
  criticality?: 'low' | 'medium' | 'high' | 'critical';
  relatedBusinessValues?: string[]; // IDs des valeurs métier liées
  securityControls?: string[]; // 🔧 CORRECTION: Propriété manquante

  // 🆕 COMPATIBILITÉ ACCESS
  responsableEntite?: string;          // Responsable textuel Access
  valeurMetierNom?: string;           // Référence textuelle Access

  // 🆕 MÉTADONNÉES IA
  aiSuggestions?: {
    vulnerabilities?: string[];        // Vulnérabilités suggérées par l'IA
    dependencies?: string[];           // Dépendances détectées
    riskLevel?: number;               // Niveau de risque calculé
    protectionMeasures?: string[];    // Mesures de protection recommandées
    criticalityAssessment?: {
      businessImpact: number;
      technicalCriticality: number;
      overallScore: number;
    };
  };
}

export interface RiskSource {
  id: string;
  name: string;
  description: string;
  category: 'cybercriminal' | 'terrorist' | 'activist' | 'state' | 'insider' | 'competitor' | 'natural';
  pertinence: LikelihoodScale;
  expertise: 'limited' | 'moderate' | 'high' | 'expert' | number; // 🔧 CORRECTION: Ajout number pour compatibilité
  resources: 'limited' | 'moderate' | 'high' | 'unlimited' | string; // 🔧 CORRECTION: Ajout string pour compatibilité
  motivation: LikelihoodScale;
  missionId: string;
  objectives: RiskObjective[];
  operationalModes: OperationalMode[];
  createdAt: string;
  updatedAt: string;

  // 🆕 COMPATIBILITÉ ACCESS
  categoryAuto?: boolean;              // Si la catégorie a été déduite automatiquement
  pertinenceAccess?: 1 | 2 | 3;      // Échelle 1-3 d'Access

  // 🆕 MÉTADONNÉES IA
  aiProfile?: {
    threatLevel?: number;              // Niveau de menace global calculé
    predictedActions?: string[];       // Actions prédites basées sur le profil
    historicalPatterns?: {
      frequency: number;
      commonTargets: string[];
      preferredMethods: string[];
    };
    motivationAnalysis?: {
      primaryDrivers: string[];
      secondaryFactors: string[];
      triggerEvents: string[];
    };
    recommendedDefenses?: string[];
  };
}

export interface RiskObjective {
  id: string;
  name: string;
  description: string;
  riskSourceId: string;
  targetType: 'business_value' | 'supporting_asset' | 'stakeholder';
  targetId: string;
  priority: GravityScale;
  targetBusinessValueId?: string; // 🔧 CORRECTION: Propriété manquante
}

export interface Stakeholder {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'partner' | 'supplier' | 'client' | 'regulator';
  category: 'decision_maker' | 'user' | 'administrator' | 'maintenance' | 'external_entity';
  zone: 'trusted' | 'untrusted' | 'partially_trusted';
  exposureLevel: LikelihoodScale;
  cyberReliability: GravityScale;
  accessRights: AccessRight[];
  missionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttackPath {
  id: string;
  name: string;
  description: string;
  difficulty: LikelihoodScale;
  successProbability: LikelihoodScale;
  missionId: string;
  stakeholderId?: string;  // 🔧 RENDU OPTIONNEL pour attaques directes
  isDirect?: boolean;      // 🆕 Pour gérer les attaques directes Access
  actions: AttackAction[];
  prerequisites: string[];
  indicators: string[];
  createdAt: string;
  updatedAt: string;

  // 🔧 CORRECTION: Propriétés manquantes utilisées dans le code
  feasibility?: number; // 1-4
  detectability?: number; // 1-4
  probability?: number; // Probabilité d'attaque
  steps?: AttackStep[]; // Utilisation du type AttackStep défini
  techniques?: string[];
  phases?: Array<{
    type: string;
    finalProbability: number;
    techniques: string[];
  }>;

  // 🆕 COMPATIBILITÉ ACCESS
  sourceRisqueNom?: string;     // Référence textuelle Access
  objectifViseNom?: string;     // Référence textuelle Access
  graviteAccess?: number;       // Gravité du chemin dans Access

  // 🆕 MÉTADONNÉES IA
  aiMetadata?: {
    pathComplexity?: number;
    successLikelihood?: number;
    detectionDifficulty?: number;
    suggestedCountermeasures?: string[];
    attackVectorAnalysis?: {
      entryPoints: string[];
      criticalSteps: number[];
      timeEstimate: string;
    };
    coherenceScore?: number; // 🔧 CORRECTION: Propriété manquante
  };
}

export interface AttackAction {
  id: string;
  name: string;
  description: string;
  attackPathId: string;
  sequence: number;
  technique: string;
  targetAssetId?: string;
  difficulty: LikelihoodScale;
  detectability: LikelihoodScale;
  duration: string;
  createdAt: string;
  updatedAt: string;
  
  // 🆕 COMPATIBILITÉ ACCESS (Graphe d'attaque)
  sequenceTypeAttaque?: string;        // Ex: "1-CONNAITRE", "2-RENTRER", etc.
  precedentActionId?: string;          // ID de l'action précédente
  nextActionId?: string;               // ID de l'action suivante
  modeOperatoire?: string;             // Mode opératoire détaillé
  canalExfiltration?: string;          // Canal d'exfiltration utilisé
  probabiliteSucces?: 1 | 2 | 3 | 4;  // Probabilité Access
  difficulteTechnique?: 0 | 1 | 2 | 3 | 4; // Difficulté Access (0-4)
  
  // 🆕 MÉTADONNÉES IA
  aiAnalysis?: {
    technicalComplexity?: number;      // Complexité technique calculée
    detectionProbability?: number;     // Probabilité de détection
    timeWindow?: {
      minimum: string;
      average: string;
      maximum: string;
    };
    prerequisites?: string[];          // Prérequis détectés
    indicators?: string[];             // Indicateurs de compromission
    countermeasures?: string[];        // Contre-mesures suggérées
  };
}

export interface SecurityControlGap {
  id: string;
  description: string;
  controlId: string;
  status: 'open' | 'in_progress' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface Gap {
  id: string;
  description: string;
  controlId: string;
  status: 'open' | 'in_progress' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface SecurityBaselineGap {
  id: string;
  controlId: string;
  description: string;
  impact: string;
  likelihood: string;
  priority: 'low' | 'medium' | 'high';
  remediationPlan?: string;
  dueDate?: string;
  status: 'open' | 'in_progress' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface SecurityBaseline {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'draft' | 'in_review' | 'approved' | 'archived';
  gaps: SecurityBaselineGap[];
  missionId?: string;
  createdAt: string;
  updatedAt: string;
}

export type GravityScale = 1 | 2 | 3 | 4;
export type LikelihoodScale = 1 | 2 | 3 | 4;
export type RiskLevel = 1 | 2 | 3 | 4 | 'low' | 'medium' | 'high' | 'critical'; // 🔧 CORRECTION: Support des deux formats

export interface EbiosScale {
  gravity: {
    1: 'Négligeable';
    2: 'Limitée';
    3: 'Importante';
    4: 'Critique';
  };
  likelihood: {
    1: 'Minimal';
    2: 'Significatif';
    3: 'Maximal';
    4: 'Critique';
  };
  risk: {
    1: 'Négligeable';
    2: 'Limitée';
    3: 'Importante';
    4: 'Critique';
  };
}

export interface Vulnerability {
  id: string;
  name: string;
  description: string;
  type: 'technical' | 'human' | 'physical' | 'organizational';
  severity: 'low' | 'medium' | 'high' | 'critical';
  cvssScore?: number;
  cveId?: string;
  exploitability: LikelihoodScale;
  assetId: string;
  remediationStatus: 'open' | 'in_progress' | 'resolved' | 'accepted';
  createdAt: string;
  updatedAt: string;
}

export interface OperationalMode {
  id: string;
  name: string;
  description: string;
  riskSourceId: string;
  techniques: string[];
  difficulty: LikelihoodScale;
  detectability: LikelihoodScale;
  prerequisites: string[];
}

export interface AccessRight {
  id: string;
  stakeholderId: string;
  assetId: string;
  accessType: 'read' | 'write' | 'execute' | 'admin' | 'full';
  accessLevel: 'physical' | 'logical' | 'both';
  conditions: string[];
}

export interface StrategicScenario {
  id: string;
  name: string;
  description: string;
  riskSourceId: string;
  targetBusinessValueId: string;
  dreadedEventId: string;
  likelihood: LikelihoodScale;
  gravity: GravityScale;
  riskLevel: RiskLevel;
  pathways: AttackPathway[];
  missionId: string;
  createdAt: string;
  updatedAt: string;

  // 🔧 CORRECTION: Propriétés manquantes utilisées dans le code
  impact?: number; // Impact numérique (1-4)
  attackPaths: string[]; // IDs des chemins d'attaque (pas les objets complets)
  supportingAssets?: string[]; // IDs des actifs supports

  // 🔧 CORRECTION: Propriétés utilisées dans Workshop3Agent
  feasibility?: number;
  priority?: number;
  category?: string;
  riskRating?: {
    likelihood: number;
    impact: number;
    overall: number;
  };
  mitigations?: string[];
  assumptions?: string[];
}

export interface AttackPathway {
  id: string;
  scenarioId: string;
  stakeholderId: string;
  compromiseLevel: 'partial' | 'total';
  prerequisites: string[];
  techniques: string[];
  sequence: number;

  // 🔧 CORRECTION: Propriétés manquantes utilisées dans le code
  name?: string;
  description?: string;
  feasibility?: number; // 1-4
  detectability?: number; // 1-4
  steps?: Array<{
    id: string;
    name: string;
    description: string;
    technique: string;
    difficulty: number;
    detectability: number;
  }>;
}

// 🔧 CORRECTION: Type manquant pour les suggestions d'attaque
export interface AttackPathSuggestion {
  name: string;
  description: string;
  feasibility: 1 | 2 | 3 | 4;
  detectability: 1 | 2 | 3 | 4;
  confidence: number;
  reasoning: string;
  steps: Array<{
    name: string;
    description: string;
    techniques: string[];
    duration: string;
    detectability: number;
  }>;
}

// 🔧 CORRECTION: Alias pour compatibilité
export interface AttackPathwaySuggestion extends AttackPathSuggestion {}

export interface OperationalScenario {
  id: string;
  name: string;
  description: string;
  strategicScenarioId: string;
  attackPath: AttackPath;
  difficulty: LikelihoodScale;
  detectability: LikelihoodScale;
  impact: GravityScale;
  riskLevel: RiskLevel;
  mitigationMeasures: string[];
  missionId: string;
  createdAt: string;
  updatedAt?: string; // 🔧 CORRECTION: Rendu optionnel pour éviter les erreurs
}

export interface SecurityMeasureImplementation {
  id: string;
  measureId: string;
  implementationDate?: string;
  verificationDate?: string;
  verificationMethod: string;
  verificationResult?: 'effective' | 'partially_effective' | 'ineffective';
  residualRisk: RiskLevel;
  comments: string;
  evidences: string[];
}

export interface WorkshopValidation {
  criterion: string;
  required: boolean;
  met: boolean;
  evidence?: string;
  comments?: string;
}

export interface ExpertValidation {
  validatorId: string;
  validationDate: string;
  approved: boolean;
  comments: string;
  recommendations?: string[];
}

export interface OrganizationContext {
  organizationType: 'public' | 'private' | 'critical_infrastructure' | 'oiv';
  sector: string;
  size: 'small' | 'medium' | 'large' | 'enterprise';
  regulatoryRequirements: string[];
  securityObjectives: string[];
  constraints: string[];
}

export interface AnalysisScope {
  boundaries: string;
  inclusions: string[];
  exclusions: string[];
  timeFrame: {
    start: string;
    end: string;
  };
  geographicalScope: string[];
}

export interface EbiosCompliance {
  version: '1.5';
  completionPercentage: number;
  lastValidationDate?: string;
  complianceGaps: ComplianceGap[];
  certificationLevel?: 'basic' | 'advanced' | 'expert';
  validatedWorkshops?: number[];
}

export interface ComplianceGap {
  workshop: number;
  requirement: string;
  currentStatus: string;
  requiredStatus: string;
  priority: GravityScale;
  remediationPlan?: string;
}

// 🆕 TYPES ARCHITECTURE AGENTIC - EXTENSIONS EBIOS RM

// État des ateliers EBIOS
export interface EbiosWorkshopState {
  workshop: 1 | 2 | 3 | 4 | 5;
  status: 'not_started' | 'in_progress' | 'completed' | 'validated' | 'requires_review';
  completionRate: number; // 0-1
  startedAt?: string;
  completedAt?: string;
  validatedAt?: string;
  validatedBy?: string;
  participants: WorkshopParticipant[];
  deliverables: WorkshopDeliverable[];
  issues: WorkshopIssue[];
  agentContributions?: AgentContribution[];
}

export interface WorkshopParticipant {
  userId: string;
  role: 'facilitator' | 'expert' | 'stakeholder' | 'observer';
  name: string;
  organization?: string;
  expertise: string[];
  participationRate: number; // 0-1
}

export interface WorkshopDeliverable {
  id: string;
  type: 'document' | 'matrix' | 'diagram' | 'report';
  name: string;
  description: string;
  status: 'draft' | 'review' | 'approved' | 'final';
  createdAt: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  version: string;
  content?: any;
}

export interface WorkshopIssue {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  category: 'methodology' | 'data_quality' | 'compliance' | 'technical';
  title: string;
  description: string;
  detectedAt: string;
  detectedBy: 'user' | 'agent' | 'validation';
  status: 'open' | 'in_progress' | 'resolved' | 'deferred';
  resolution?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AgentContribution {
  agentId: string;
  agentName: string;
  contributionType: 'suggestion' | 'validation' | 'generation' | 'analysis';
  description: string;
  confidence: number; // 0-1
  timestamp: string;
  accepted: boolean;
  feedback?: string;
}

// Journal des décisions
export interface DecisionLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  workshopStep: string;
  decisionType: 'creation' | 'modification' | 'deletion' | 'validation' | 'approval';
  entityType: string;
  entityId: string;
  previousValue?: any;
  newValue: any;
  rationale: string;
  aiRecommendation?: {
    agentId: string;
    recommendation: any;
    confidence: number;
    reasoning: string[];
    accepted: boolean;
  };
  impactAssessment?: {
    affectedEntities: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    mitigationMeasures: string[];
  };
  reviewRequired: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
}

// Historique de validation
export interface ValidationHistoryEntry {
  id: string;
  timestamp: string;
  validationType: 'workshop' | 'entity' | 'global' | 'anssi_compliance';
  workshop?: number;
  entityType?: string;
  entityId?: string;
  validationResult: {
    isValid: boolean;
    score: number; // 0-100
    criticalIssues: string[];
    warnings: string[];
    recommendations: string[];
  };
  validatedBy: 'user' | 'agent' | 'system';
  validatorId?: string;
  anssiCompliance?: {
    workshop1: number;
    workshop2: number;
    workshop3: number;
    workshop4: number;
    workshop5: number;
    overall: number;
  };
}

// Interface Timestamp pour compatibilité
export interface Timestamp {
  seconds: number;
  nanoseconds: number;
}

// 🔧 TYPES MANQUANTS POUR LES AGENTS

// Interface pour les étapes d'attaque avec techniques MITRE
export interface AttackStep {
  id: string;
  name: string;
  description: string;
  technique: string;
  difficulty: number;
  detectability: number;
  mitreTechniques?: MitreTechniqueDetails[];
  mitreTactics?: MitreTacticDetails[];
  killChainPhase?: string;
  duration?: string;
  prerequisites?: string[];
  indicators?: string[];
}

// Interface détaillée pour les techniques MITRE
export interface MitreTechniqueDetails {
  id: string;
  name: string;
  tactic: string;
  description: string;
  platforms: string[];
  dataSource: string;
  detection: string;
  mitigation: string;
}

// Interface pour les tactiques MITRE
export interface MitreTacticDetails {
  id: string;
  name: string;
  description: string;
  techniques: string[];
}

// Interface pour les capacités d'attaque
export interface AttackCapability {
  id: string;
  name: string;
  description: string;
  category: 'technical' | 'social' | 'physical' | 'hybrid';
  sophistication: 'low' | 'medium' | 'high' | 'expert';
  resources: 'minimal' | 'moderate' | 'significant' | 'extensive';
  techniques: string[];
  platforms: string[];
  detectability: number;
  effectiveness: number;
}

// Interface pour l'analyse des phases de kill chain
export interface KillChainPhaseAnalysis {
  phase: string;
  techniques: string[];
  difficulty: number;
  detectability: number;
  duration: string;
  indicators: string[];
  countermeasures: string[];
  probability?: number; // 🔧 CORRECTION: Propriété manquante
}

// 🔧 CORRECTION: Mise à jour de StrategicScenario avec toutes les propriétés manquantes
export interface StrategicScenarioExtended extends StrategicScenario {
  feasibility?: number;
  priority?: number;
  category?: string;
  riskRating?: {
    likelihood: number;
    impact: number;
    overall: number;
  };
  mitigations?: string[];
}

// 🔧 CORRECTION: Mise à jour d'AttackPath avec toutes les propriétés manquantes
export interface AttackPathExtended extends AttackPath {
  probability?: number;
  steps?: AttackStep[];
}

// 🔧 CORRECTION: Mise à jour d'OperationalScenario avec propriété manquante
export interface OperationalScenarioExtended extends OperationalScenario {
  updatedAt?: string; // Propriété manquante
}

// 🔧 TYPES DE CONTEXTE POUR LES AGENTS

// Contexte pour la génération de scénarios
export interface ScenarioGenerationContext {
  businessAssets: BusinessValue[];
  supportingAssets: SupportingAsset[];
  identifiedThreats: RiskSource[];
  organizationalContext: OrganizationContext;
  threatLandscape: {
    sector: string;
    geographicalZone: string[];
    regulatoryFramework: string[];
    currentThreats: string[];
  };
}

// Contexte pour la modélisation des menaces
export interface ThreatModelingContext {
  organizationProfile: {
    sector: string;
    size: 'small' | 'medium' | 'large' | 'enterprise';
    criticalAssets: string[];
    regulatoryRequirements: string[];
  };
  threatLandscape: {
    knownActors: RiskSource[];
    emergingThreats: string[];
    sectorSpecificThreats: string[];
  };
  businessContext: {
    businessValues: BusinessValue[];
    supportingAssets: SupportingAsset[];
    stakeholders: Stakeholder[];
  };
}

// Contexte pour l'optimisation de sécurité
export interface SecurityOptimizationContext {
  organizationProfile: {
    sector: string;
    size: string;
    budget: number;
    riskTolerance: 'low' | 'medium' | 'high';
  };
  currentControls: SecurityMeasure[];
  riskProfile: {
    criticalAssets: string[];
    majorThreats: string[];
    riskAppetite: number;
  };
  performanceMetrics: {
    currentEffectiveness: number;
    costEfficiency: number;
    implementationCapacity: number;
  };
  businessContext: {
    strategicObjectives: string[];
    operationalConstraints: string[];
    complianceRequirements: string[];
  };
}

// 🔧 CORRECTION: Mise à jour de SecurityMeasure avec propriétés manquantes
export interface SecurityMeasureExtended extends Omit<SecurityMeasure, 'cost'> {
  cost?: string | number; // Support des deux types
  domain?: string;
  function?: string;
}

// 🔧 CORRECTION: Interface pour les problèmes de qualité des données
export interface DataQualityIssue {
  id: string;
  type: 'missing' | 'invalid' | 'inconsistent' | 'duplicate' | 'incoherent';
  severity: 'low' | 'medium' | 'high' | 'critical';
  field: string;
  value: string;
  message: string;
  suggestion: string;
  confidence: number;
  autoFixAvailable: boolean;
  suggestedValue?: string;
  stableKey: string; // 🔧 CORRECTION: Propriété manquante
  originalValue: string; // 🔧 CORRECTION: Propriété manquante
}

// 🔧 ALIAS DE TYPES POUR COMPATIBILITÉ
export type ThreatSource = RiskSource;
export type BusinessAsset = BusinessValue;
export type RiskEvent = DreadedEvent;
export type SecurityControl = SecurityMeasure;
export type RiskScenario = StrategicScenario;
export type MitreTechnique = MitreTechniqueDetails;
export type KillChainPhase = KillChainPhaseAnalysis;