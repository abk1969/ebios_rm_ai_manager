import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SecurityBaseline } from '@/types/ebios';

const COLLECTION_NAME = 'securityBaseline';

export const getSecurityControls = async (missionId: string): Promise<SecurityBaseline[]> => {
  try {
    const controlsRef = collection(db, COLLECTION_NAME);
    const q = query(controlsRef, where('missionId', '==', missionId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SecurityBaseline));
  } catch (error) {
    console.error('Error getting security controls:', error);
    throw error;
  }
};

export const createSecurityControl = async (control: Omit<SecurityBaseline, 'id'>): Promise<SecurityBaseline> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...control,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...control } as SecurityBaseline;
  } catch (error) {
    console.error('Error creating security control:', error);
    throw error;
  }
};

export const updateSecurityControl = async (id: string, data: Partial<SecurityBaseline>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating security control:', error);
    throw error;
  }
};

export const deleteSecurityControl = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting security control:', error);
    throw error;
  }
};