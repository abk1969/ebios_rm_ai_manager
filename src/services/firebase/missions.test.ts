import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, getFirestore } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getMissions, getMissionById, createMission, updateMission, deleteMission } from './missions';
import type { Mission } from '@/types/ebios';

const FIXED_TIMESTAMP = new Date('2024-01-01T00:00:00.000Z');

describe('Mission Firebase Service', () => {
  const mockMission: Mission = {
    id: 'test-mission-id',
    name: 'Test Mission',
    description: 'Test Description',
    status: 'draft',
    assignedTo: [],
    createdAt: FIXED_TIMESTAMP.toISOString(),
    updatedAt: FIXED_TIMESTAMP.toISOString(),
  };

  beforeAll(() => {
    vi.mock('firebase/app', () => ({
      initializeApp: vi.fn(() => ({})),
    }));

    vi.mock('firebase/auth', () => ({
      getAuth: vi.fn(() => ({
        currentUser: null,
      })),
      connectAuthEmulator: vi.fn(),
    }));

    vi.mock('firebase/storage', () => ({
      getStorage: vi.fn(() => ({})),
    }));

    vi.mock('firebase/firestore', () => {
      const mockCollection = vi.fn();
      const mockDoc = vi.fn();
      const mockQuery = vi.fn();
      const mockOrderBy = vi.fn();
  
      return {
        collection: mockCollection,
        doc: mockDoc,
        getDocs: vi.fn(),
        getDoc: vi.fn(),
        addDoc: vi.fn(),
        updateDoc: vi.fn(),
        deleteDoc: vi.fn(),
        query: mockQuery,
        where: vi.fn(),
        orderBy: mockOrderBy,
        serverTimestamp: vi.fn(() => FIXED_TIMESTAMP),
        getFirestore: vi.fn(() => ({})),
      };
    });

    vi.mock('@/lib/firebase', () => ({
      db: {},
    }));
  });

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Set up collection mock
    (collection as any).mockReturnValue({
      withConverter: vi.fn().mockReturnThis(),
    });

    // Set up doc mock
    (doc as any).mockReturnValue({
      withConverter: vi.fn().mockReturnThis(),
    });

    // Set up query mock
    (query as any).mockReturnValue({});
    (orderBy as any).mockReturnValue({});
  });

  describe('getMissions', () => {
    it('should fetch all missions', async () => {
      const mockSnapshot = {
        docs: [
          {
            id: mockMission.id,
            data: () => ({
              ...mockMission,
              createdAt: { toDate: () => FIXED_TIMESTAMP },
              updatedAt: { toDate: () => FIXED_TIMESTAMP },
            }),
          },
        ],
      };

      (getDocs as any).mockResolvedValue(mockSnapshot);

      const missions = await getMissions();

      expect(collection).toHaveBeenCalledWith(db, 'missions');
      expect(getDocs).toHaveBeenCalled();
      expect(missions).toHaveLength(1);
      expect(missions[0]).toMatchObject(mockMission);
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
          createdAt: { toDate: () => FIXED_TIMESTAMP },
          updatedAt: { toDate: () => FIXED_TIMESTAMP },
        }),
      };

      (getDoc as any).mockResolvedValue(mockDocSnap);

      const mission = await getMissionById(mockMission.id);

      expect(doc).toHaveBeenCalledWith(db, 'missions', mockMission.id);
      expect(getDoc).toHaveBeenCalled();
      expect(mission).toMatchObject(mockMission);
    });

    it('should return null for non-existent mission', async () => {
      const mockDocSnap = {
        exists: () => false,
      };

      (getDoc as any).mockResolvedValue(mockDocSnap);

      const mission = await getMissionById('non-existent');

      expect(mission).toBeNull();
    });

    it('should handle errors', async () => {
      (getDoc as any).mockRejectedValue(new Error('Firebase error'));

      await expect(getMissionById(mockMission.id)).rejects.toThrow('Firebase error');
    });
  });

  describe('createMission', () => {
    it('should create a new mission', async () => {
      const missionData = {
        name: 'New Mission',
        description: 'New Description',
        status: 'not_started' as const,
      };

      (addDoc as any).mockResolvedValue({
        id: 'new-mission-id',
        get: async () => ({
          exists: () => true,
          data: () => ({
            ...missionData,
            createdAt: { toDate: () => FIXED_TIMESTAMP },
            updatedAt: { toDate: () => FIXED_TIMESTAMP },
          }),
        }),
      });

      const newMission = await createMission(missionData);

      expect(collection).toHaveBeenCalledWith(db, 'missions');
      expect(addDoc).toHaveBeenCalled();
      expect(newMission).toMatchObject({
        id: 'new-mission-id',
        ...missionData,
        createdAt: FIXED_TIMESTAMP.toISOString(),
        updatedAt: FIXED_TIMESTAMP.toISOString(),
      });
    });

    it('should handle errors', async () => {
      (addDoc as any).mockRejectedValue(new Error('Firebase error'));

      await expect(createMission({})).rejects.toThrow('Firebase error');
    });
  });

  describe('updateMission', () => {
    it('should update a mission', async () => {
      const updateData = {
        name: 'Updated Mission',
        status: 'completed' as const,
      };

      (updateDoc as any).mockResolvedValue(undefined);
      
      const mockUpdatedDocSnap = {
        exists: () => true,
        id: mockMission.id,
        data: () => ({
          ...mockMission,
          ...updateData,
          createdAt: { toDate: () => FIXED_TIMESTAMP },
          updatedAt: { toDate: () => FIXED_TIMESTAMP },
        }),
      };

      (getDoc as any)
        .mockResolvedValueOnce(mockUpdatedDocSnap);

      const updated = await updateMission(mockMission.id, updateData);

      expect(doc).toHaveBeenCalledWith(db, 'missions', mockMission.id);
      expect(updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          ...updateData,
          updatedAt: FIXED_TIMESTAMP,
        })
      );
      expect(updated).toMatchObject({
        ...mockMission,
        ...updateData,
        updatedAt: FIXED_TIMESTAMP.toISOString(),
      });
    });

    it('should handle update errors', async () => {
      const updateData = {
        name: 'Updated Mission',
      };

      (updateDoc as any).mockRejectedValue(new Error('Update failed'));

      await expect(updateMission(mockMission.id, updateData))
        .rejects.toThrow('Update failed');
    });
  });

  describe('deleteMission', () => {
    it('should delete a mission', async () => {
      (deleteDoc as any).mockResolvedValue(undefined);

      await deleteMission(mockMission.id);

      expect(doc).toHaveBeenCalledWith(db, 'missions', mockMission.id);
      expect(deleteDoc).toHaveBeenCalled();
    });

    it('should handle delete errors', async () => {
      (deleteDoc as any).mockRejectedValue(new Error('Delete failed'));

      await expect(deleteMission(mockMission.id))
        .rejects.toThrow('Delete failed');
    });
  });
});