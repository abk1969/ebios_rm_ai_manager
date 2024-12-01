export interface SecurityMeasure {
  id: string;
  name: string;
  description: string;
  isoCategory: string;
  isoControl: string;
  controlType: 'preventive' | 'detective' | 'corrective';
  status: 'planned' | 'in_progress' | 'implemented' | 'verified';
  priority: 'low' | 'medium' | 'high';
  responsibleParty: string;
  dueDate: string;
  missionId: string;
  effectiveness: 'low' | 'medium' | 'high';
  implementationCost: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Workshop {
  id: string;
  missionId: string;
  number: number;
  status: 'not_started' | 'in_progress' | 'completed';
  completedSteps: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'in_progress' | 'completed';
  dueDate: string;
  assignedTo: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DreadedEvent {
  id: string;
  name: string;
  description: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface BusinessValue {
  id: string;
  name: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dreadedEvents: DreadedEvent[];
  missionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SupportingAsset {
  id: string;
  name: string;
  type: string;
  description: string;
  businessValueId: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiskSource {
  id: string;
  name: string;
  description: string;
  category: string;
  pertinence: number;
  missionId: string;
  objectives: RiskObjective[];
  createdAt: string;
  updatedAt: string;
}

export interface RiskObjective {
  id: string;
  name: string;
  description: string;
  riskSourceId: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  type: string;
  category: string;
  zone: string;
  exposureLevel: number;
  cyberReliability: number;
  missionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttackPath {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  successProbability: number;
  missionId: string;
  stakeholderId: string;
  actions: AttackAction[];
  createdAt: string;
  updatedAt: string;
}

export interface AttackAction {
  id: string;
  name: string;
  description: string;
  attackPathId: string;
  sequence: number;
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