import { describe, it, expect } from 'vitest';
import { MissionFactory } from '@/factories/MissionFactory';

describe('MissionFactory', () => {
  it('should create a mission with default values', () => {
    const mission = MissionFactory.create({});
    
    expect(mission).toHaveProperty('id');
    expect(mission.status).toBe('draft');
    expect(mission.assignedTo).toEqual([]);
    expect(mission.createdAt).toBeDefined();
    expect(mission.updatedAt).toBeDefined();
  });

  it('should create a mission with provided values', () => {
    const data = {
      name: 'Test Mission',
      description: 'Test Description',
      status: 'in_progress' as const,
      dueDate: '2024-12-31',
      assignedTo: ['user1'],
    };

    const mission = MissionFactory.create(data);

    expect(mission.name).toBe(data.name);
    expect(mission.description).toBe(data.description);
    expect(mission.status).toBe(data.status);
    expect(mission.dueDate).toBe(data.dueDate);
    expect(mission.assignedTo).toEqual(data.assignedTo);
  });
});