import { Workshop } from '@/types/ebios';

export class WorkshopFactory {
  static create(missionId: string, number: number): Workshop {
    return {
      id: crypto.randomUUID(),
      missionId,
      number: number as 1 | 2 | 3 | 4 | 5, // 🔧 CORRECTION: Cast explicite
      status: 'not_started',
      completedSteps: [],
      validationCriteria: [], // 🔧 CORRECTION: Propriété manquante
      prerequisitesMet: false, // 🔧 CORRECTION: Propriété manquante
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}