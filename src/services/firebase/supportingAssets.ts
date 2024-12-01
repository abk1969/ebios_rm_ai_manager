import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SupportingAsset } from '@/types/ebios';

const COLLECTION_NAME = 'supportingAssets';

export const getSupportingAssets = async (businessValueId: string): Promise<SupportingAsset[]> => {
  try {
    const assetsRef = collection(db, COLLECTION_NAME);
    const q = query(assetsRef, where('businessValueId', '==', businessValueId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SupportingAsset));
  } catch (error) {
    console.error('Error getting supporting assets:', error);
    throw error;
  }
};

export const createSupportingAsset = async (asset: Omit<SupportingAsset, 'id'>): Promise<SupportingAsset> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...asset,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...asset } as SupportingAsset;
  } catch (error) {
    console.error('Error creating supporting asset:', error);
    throw error;
  }
};

export const updateSupportingAsset = async (id: string, data: Partial<SupportingAsset>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating supporting asset:', error);
    throw error;
  }
};

export const deleteSupportingAsset = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting supporting asset:', error);
    throw error;
  }
};