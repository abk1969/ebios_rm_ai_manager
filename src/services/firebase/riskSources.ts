import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { RiskSource } from '@/types/ebios';

const COLLECTION_NAME = 'riskSources';

export const getRiskSources = async (missionId: string): Promise<RiskSource[]> => {
  try {
    const sourcesRef = collection(db, COLLECTION_NAME);
    const q = query(sourcesRef, where('missionId', '==', missionId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RiskSource));
  } catch (error) {
    console.error('Error getting risk sources:', error);
    throw error;
  }
};

export const createRiskSource = async (source: Omit<RiskSource, 'id'>): Promise<RiskSource> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...source,
      objectives: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...source } as RiskSource;
  } catch (error) {
    console.error('Error creating risk source:', error);
    throw error;
  }
};

export const updateRiskSource = async (id: string, data: Partial<RiskSource>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating risk source:', error);
    throw error;
  }
};

export const deleteRiskSource = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting risk source:', error);
    throw error;
  }
};