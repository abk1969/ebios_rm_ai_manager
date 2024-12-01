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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}