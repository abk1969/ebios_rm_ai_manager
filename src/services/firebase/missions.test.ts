import { beforeEach, describe, expect, it, vi } from 'vitest';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { adminDb as db } from '@/lib/firebase-admin';
import { getMissions, getMissionById, createMission, updateMission, deleteMission } from './missions';
import type { Mission } from '@/types/ebios';

const FIXED_TIMESTAMP = '2024-01-01T00:00:00.000Z';

// Mock Firestore
vi.mock('firebase/firestore', async () => ({
  collection: vi.fn(() => ({
    withConverter: vi.fn().mockReturnThis()
  })),
  doc: vi.fn(() => ({
    withConverter: vi.fn().mockReturnThis()
  })),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn((ref) => ref),
  where: vi.fn(),
  orderBy: vi.fn(),
  getFirestore: vi.fn(() => ({})),
  serverTimestamp: vi.fn(() => FIXED_TIMESTAMP)
}));

// Mock db
vi.mock('./firestore', () => ({
  db: {}
}));

describe('Mission Firebase Service', () => {
  const testMission = {
    name: 'Test Mission',
    description: 'Test Description',
    status: 'draft' as const,
    dueDate: new Date().toISOString(),
    assignedTo: ['user1'] as string[],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const createMissionData = {
    name: testMission.name,
    description: testMission.description,
    status: testMission.status,
    dueDate: testMission.dueDate,
    assignedTo: testMission.assignedTo,
    createdAt: testMission.createdAt,
    updatedAt: testMission.updatedAt
  };

  const mockMission: Mission = {
    id: 'test-id',
    ...testMission
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMissions', () => {
    it('should fetch all missions', async () => {
      const mockSnapshot = {
        docs: [
          {
            id: mockMission.id,
            data: () => ({ 
              ...mockMission,
              createdAt: FIXED_TIMESTAMP,
              updatedAt: FIXED_TIMESTAMP
            }),
          },
        ],
      };

      (getDocs as any).mockResolvedValue(mockSnapshot);

      const missions = await getMissions();

      expect(collection).toHaveBeenCalledWith(db, 'missions');
      expect(getDocs).toHaveBeenCalled();
      expect(missions).toHaveLength(1);
      expect(missions[0]).toMatchObject({
        ...mockMission,
        id: mockMission.id,
        createdAt: FIXED_TIMESTAMP,
        updatedAt: FIXED_TIMESTAMP
      });
    });

    it('should handle errors', async () => {
      (getDocs as any).mockRejectedValue(new Error('Firebase error'));
      await expect(getMissions()).rejects.toThrow('Firebase error');
    });
  });

  describe('getMissionById', () => {
    it('should fetch a mission by id', async () => {
      const mockDocSnap = {
        exists: () => true,
        id: mockMission.id,
        data: () => ({ 
          ...mockMission,
          createdAt: FIXED_TIMESTAMP,
          updatedAt: FIXED_TIMESTAMP
        }),
      };

      (getDoc as any).mockResolvedValue(mockDocSnap);

      const mission = await getMissionById(mockMission.id);

      expect(doc).toHaveBeenCalledWith(db, 'missions', mockMission.id);
      expect(getDoc).toHaveBeenCalled();
      expect(mission).toMatchObject({
        ...mockMission,
        id: mockMission.id,
        createdAt: FIXED_TIMESTAMP,
        updatedAt: FIXED_TIMESTAMP
      });
    });

    it('should return null for non-existent mission', async () => {
      const mockDocSnap = {
        exists: () => false,
      };

      (getDoc as any).mockResolvedValue(mockDocSnap);

      const mission = await getMissionById('non-existent');
      expect(mission).toBeNull();
    });
  });

  describe('createMission', () => {
    it('should create a new mission', async () => {
      const { id, createdAt, updatedAt, ...missionData } = mockMission;
      
      (addDoc as any).mockResolvedValue({ id });

      const newMission = await createMission(missionData);

      expect(collection).toHaveBeenCalledWith(db, 'missions');
      expect(addDoc).toHaveBeenCalled();
      expect(newMission).toMatchObject({
        ...missionData,
        id,
        createdAt: FIXED_TIMESTAMP,
        updatedAt: FIXED_TIMESTAMP
      });
    });
  });

  describe('updateMission', () => {
    it('should update a mission', async () => {
      const updateData = { name: 'Updated Mission' };
      const mockUpdatedMission = { 
        ...mockMission,
        ...updateData,
        updatedAt: FIXED_TIMESTAMP
      };

      (getDoc as any).mockResolvedValue({
        exists: () => true,
        id: mockMission.id,
        data: () => mockUpdatedMission,
      });

      const updated = await updateMission(mockMission.id, updateData);

      expect(doc).toHaveBeenCalledWith(db, 'missions', mockMission.id);
      expect(updateDoc).toHaveBeenCalled();
      expect(updated).toMatchObject({
        ...mockUpdatedMission,
        id: mockMission.id,
        updatedAt: FIXED_TIMESTAMP
      });
    });
  });

  describe('deleteMission', () => {
    it('should delete a mission', async () => {
      await deleteMission(mockMission.id);

      expect(doc).toHaveBeenCalledWith(db, 'missions', mockMission.id);
      expect(deleteDoc).toHaveBeenCalled();
    });
  });
});