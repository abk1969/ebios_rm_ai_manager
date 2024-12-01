import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Stakeholder } from '@/types/ebios';

const COLLECTION_NAME = 'stakeholders';

export const getStakeholders = async (missionId: string): Promise<Stakeholder[]> => {
  try {
    const stakeholdersRef = collection(db, COLLECTION_NAME);
    const q = query(stakeholdersRef, where('missionId', '==', missionId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Stakeholder));
  } catch (error) {
    console.error('Error getting stakeholders:', error);
    throw error;
  }
};

export const createStakeholder = async (stakeholder: Omit<Stakeholder, 'id'>): Promise<Stakeholder> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...stakeholder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...stakeholder } as Stakeholder;
  } catch (error) {
    console.error('Error creating stakeholder:', error);
    throw error;
  }
};

export const updateStakeholder = async (id: string, data: Partial<Stakeholder>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating stakeholder:', error);
    throw error;
  }
};

export const deleteStakeholder = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting stakeholder:', error);
    throw error;
  }
};