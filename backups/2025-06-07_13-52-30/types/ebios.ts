export interface SecurityMeasure {
  id: string;
  name: string;
  description: string;
  isoCategory: string;
  isoControl: string;
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
}

export interface DreadedEvent {
  id: string;
  name: string;
  description: string;
  businessValueId: string;
  gravity: GravityScale;
  impactType: 'availability' | 'integrity' | 'confidentiality' | 'authenticity' | 'non_repudiation';
  consequences: string;
  missionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessValue {
  id: string;
  name: string;
  description: string;
  category: 'primary' | 'support' | 'management';
  priority: GravityScale;
  criticalityLevel: 'essential' | 'important' | 'useful';
  dreadedEvents: DreadedEvent[];
  supportingAssets: SupportingAsset[];
  stakeholders: string[];
  missionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportingAsset {
  id: string;
  name: string;
  type: 'data' | 'software' | 'hardware' | 'network' | 'personnel' | 'site' | 'organization';
  description: string;
  businessValueId: string;
  missionId: string; // 🔥 AJOUT DU MISSIONID MANQUANT
  securityLevel: 'public' | 'internal' | 'confidential' | 'secret';
  vulnerabilities: Vulnerability[];
  dependsOn: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RiskSource {
  id: string;
  name: string;
  description: string;
  category: 'cybercriminal' | 'terrorist' | 'activist' | 'state' | 'insider' | 'competitor' | 'natural';
  pertinence: LikelihoodScale;
  expertise: 'limited' | 'moderate' | 'high' | 'expert';
  resources: 'limited' | 'moderate' | 'high' | 'unlimited';
  motivation: LikelihoodScale;
  missionId: string;
  objectives: RiskObjective[];
  operationalModes: OperationalMode[];
  createdAt: string;
  updatedAt: string;
}

export interface RiskObjective {
  id: string;
  name: string;
  description: string;
  riskSourceId: string;
  targetType: 'business_value' | 'supporting_asset' | 'stakeholder';
  targetId: string;
  priority: GravityScale;
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
  stakeholderId: string;
  actions: AttackAction[];
  prerequisites: string[];
  indicators: string[];
  createdAt: string;
  updatedAt: string;
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
export type RiskLevel = 1 | 2 | 3 | 4;

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
}

export interface AttackPathway {
  id: string;
  scenarioId: string;
  stakeholderId: string;
  compromiseLevel: 'partial' | 'total';
  prerequisites: string[];
  techniques: string[];
  sequence: number;
}

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
  updatedAt: string;
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
}

export interface ComplianceGap {
  workshop: number;
  requirement: string;
  currentStatus: string;
  requiredStatus: string;
  priority: GravityScale;
  remediationPlan?: string;
}