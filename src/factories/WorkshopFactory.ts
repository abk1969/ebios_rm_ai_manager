import { Workshop } from '@/types/ebios';

export class WorkshopFactory {
  static create(missionId: string, number: number): Workshop {
    return {
      id: crypto.randomUUID(),
      missionId,
      number,
      status: 'not_started',
      completedSteps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}