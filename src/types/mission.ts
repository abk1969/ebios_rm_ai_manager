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

export interface BusinessValue {
  id: string;
  name: string;
  description: string;
  category: string;
  supportingAssets: SupportingAsset[];
  dreadedEvents: DreadedEvent[];
}

export interface SupportingAsset {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface DreadedEvent {
  id: string;
  name: string;
  description: string;
  impacts: Impact[];
}

export interface Impact {
  id: string;
  type: string;
  severity: number;
  description: string;
}