import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SecurityMeasure } from '@/types/ebios';

const COLLECTION_NAME = 'securityMeasures';

export const getSecurityMeasures = async (missionId: string): Promise<SecurityMeasure[]> => {
  try {
    const measuresRef = collection(db, COLLECTION_NAME);
    const q = query(measuresRef, where('missionId', '==', missionId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SecurityMeasure));
  } catch (error) {
    console.error('Error getting security measures:', error);
    throw error;
  }
};

export const createSecurityMeasure = async (measure: Omit<SecurityMeasure, 'id'>): Promise<SecurityMeasure> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...measure,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...measure } as SecurityMeasure;
  } catch (error) {
    console.error('Error creating security measure:', error);
    throw error;
  }
};

export const updateSecurityMeasure = async (id: string, data: Partial<SecurityMeasure>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating security measure:', error);
    throw error;
  }
};

export const deleteSecurityMeasure = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting security measure:', error);
    throw error;
  }
};