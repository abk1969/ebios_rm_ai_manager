/**
 * Domain Entity - Mission
 * Encapsule la logique métier et les règles de validation pour les missions EBIOS RM
 */

import { Mission as MissionType, EbiosCompliance } from '@/types/ebios';

export class Mission {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _description: string,
    private readonly _status: string,
    private readonly _organizationContext: any,
    private readonly _scope: any,
    private readonly _ebiosCompliance: EbiosCompliance,
    private readonly _createdAt: string,
    private readonly _updatedAt: string
  ) {}

  // Factory method avec validation métier
  static create(data: Partial<MissionType>): Mission {
    // Validation des règles métier
    if (!data.name || data.name.trim().length < 3) {
      throw new Error('Le nom de la mission doit contenir au moins 3 caractères');
    }

    if (!data.description || data.description.trim().length < 10) {
      throw new Error('La description de la mission doit contenir au moins 10 caractères');
    }

    // Validation EBIOS RM spécifique
    if (data.ebiosCompliance && data.ebiosCompliance.version !== '1.5') {
      throw new Error('Seule la version EBIOS RM 1.5 est supportée');
    }

    return new Mission(
      data.id || crypto.randomUUID(),
      data.name.trim(),
      data.description.trim(),
      data.status || 'draft',
      data.organizationContext || Mission.getDefaultOrganizationContext(),
      data.scope || Mission.getDefaultScope(),
      data.ebiosCompliance || Mission.getDefaultEbiosCompliance(),
      data.createdAt || new Date().toISOString(),
      new Date().toISOString()
    );
  }

  // Getters
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get description(): string { return this._description; }
  get status(): string { return this._status; }
  get organizationContext(): any { return this._organizationContext; }
  get scope(): any { return this._scope; }
  get ebiosCompliance(): EbiosCompliance { return this._ebiosCompliance; }
  get createdAt(): string { return this._createdAt; }
  get updatedAt(): string { return this._updatedAt; }

  // Méthodes métier
  canStartWorkshop(workshopNumber: number): boolean {
    if (workshopNumber === 1) return true;
    
    // Workshop 2 nécessite au moins 3 valeurs métier
    if (workshopNumber === 2) {
      return this._ebiosCompliance.completionPercentage >= 20;
    }
    
    // Workshop 3 nécessite Workshop 2 complété
    if (workshopNumber === 3) {
      return this._ebiosCompliance.completionPercentage >= 40;
    }
    
    // Workshop 4 nécessite Workshop 3 complété
    if (workshopNumber === 4) {
      return this._ebiosCompliance.completionPercentage >= 60;
    }
    
    // Workshop 5 nécessite Workshop 4 complété
    if (workshopNumber === 5) {
      return this._ebiosCompliance.completionPercentage >= 80;
    }
    
    return false;
  }

  isCompleted(): boolean {
    return this._ebiosCompliance.completionPercentage >= 100;
  }

  updateProgress(workshopNumber: number, isCompleted: boolean): Mission {
    const newPercentage = isCompleted ? workshopNumber * 20 : (workshopNumber - 1) * 20;
    
    const updatedCompliance: EbiosCompliance = {
      ...this._ebiosCompliance,
      completionPercentage: Math.max(newPercentage, this._ebiosCompliance.completionPercentage)
    };

    return new Mission(
      this._id,
      this._name,
      this._description,
      this._status,
      this._organizationContext,
      this._scope,
      updatedCompliance,
      this._createdAt,
      new Date().toISOString()
    );
  }

  // Conversion vers type primitif pour persistance
  toPlainObject(): MissionType {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      status: this._status as 'draft' | 'in_progress' | 'review' | 'completed' | 'archived',
      organizationContext: this._organizationContext,
      scope: this._scope,
      ebiosCompliance: this._ebiosCompliance,
      organization: '',
      objective: '',
      dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: [],
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }

  // Méthodes privées pour valeurs par défaut
  private static getDefaultOrganizationContext() {
    return {
      organizationType: 'private' as const,
      sector: '',
      size: 'medium' as const,
      regulatoryRequirements: [],
      securityObjectives: [],
      constraints: []
    };
  }

  private static getDefaultScope() {
    return {
      boundaries: '',
      inclusions: [],
      exclusions: [],
      timeFrame: {
        start: new Date().toISOString(),
        end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      },
      geographicalScope: []
    };
  }

  private static getDefaultEbiosCompliance(): EbiosCompliance {
    return {
      version: '1.5',
      completionPercentage: 0,
      complianceGaps: []
    };
  }
}
