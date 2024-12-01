import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BusinessValue } from '@/types/ebios';

const COLLECTION_NAME = 'businessValues';

export const getBusinessValuesByMission = async (missionId: string): Promise<BusinessValue[]> => {
  try {
    const valuesRef = collection(db, COLLECTION_NAME);
    const q = query(valuesRef, where('missionId', '==', missionId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BusinessValue));
  } catch (error) {
    console.error('Error getting business values:', error);
    throw error;
  }
};

export const createBusinessValue = async (value: Omit<BusinessValue, 'id'>): Promise<BusinessValue> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...value } as BusinessValue;
  } catch (error) {
    console.error('Error creating business value:', error);
    throw error;
  }
};

export const updateBusinessValue = async (id: string, data: Partial<BusinessValue>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating business value:', error);
    throw error;
  }
};

export const deleteBusinessValue = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting business value:', error);
    throw error;
  }
};