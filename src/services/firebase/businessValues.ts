import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { BusinessValue } from '@/types/ebios';
import { AIEnrichmentService } from '@/services/ai/AIEnrichmentService';
import { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } from '@/services/cache/CacheInvalidationService';

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
    const enrichedValue = AIEnrichmentService.enrichBusinessValue(value);

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...enrichedValue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 🚀 Invalidation automatique du cache
    await onDocumentCreated(value.missionId, COLLECTION_NAME, docRef.id);

    return { id: docRef.id, ...enrichedValue } as BusinessValue;
  } catch (error) {
    console.error('Error creating business value:', error);
    throw error;
  }
};

export const updateBusinessValue = async (id: string, data: Partial<BusinessValue>): Promise<void> => {
  try {
    const enrichedData = AIEnrichmentService.enrichBusinessValue(data);

    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...enrichedData,
      updatedAt: new Date().toISOString(),
    });

    // 🚀 Invalidation automatique du cache
    if (data.missionId) {
      await onDocumentUpdated(data.missionId, COLLECTION_NAME, id);
    }
  } catch (error) {
    console.error('Error updating business value:', error);
    throw error;
  }
};

export const deleteBusinessValue = async (id: string, missionId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);

    // 🚀 Invalidation automatique du cache
    await onDocumentDeleted(missionId, COLLECTION_NAME, id);
  } catch (error) {
    console.error('Error deleting business value:', error);
    throw error;
  }
};