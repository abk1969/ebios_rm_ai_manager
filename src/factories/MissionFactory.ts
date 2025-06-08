import { Mission } from '@/types/ebios';

export class MissionFactory {
  static create(data: Partial<Mission>): Mission {
    return {
      id: crypto.randomUUID(),
      name: data.name || '',
      description: data.description || '',
      status: data.status || 'draft',
      dueDate: data.dueDate || new Date().toISOString(),
      assignedTo: data.assignedTo || [],
      organizationContext: data.organizationContext || {
        organizationType: 'private',
        sector: '',
        size: 'medium',
        regulatoryRequirements: [],
        securityObjectives: [],
        constraints: []
      },
      scope: data.scope || {
        boundaries: '',
        inclusions: [],
        exclusions: [],
        timeFrame: {
          start: new Date().toISOString(),
          end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        },
        geographicalScope: []
      },
      ebiosCompliance: data.ebiosCompliance || {
        version: '1.5',
        completionPercentage: 0,
        complianceGaps: []
      },
      organization: data.organization || '',
      objective: data.objective || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}