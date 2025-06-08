import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query,
  where,
  getDoc,
  serverTimestamp,
  orderBy,
  updateDoc,
  deleteDoc,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Mission } from '@/types/ebios';

const COLLECTION_NAME = 'missions';

export const missionsCollection = collection(db, COLLECTION_NAME);

export async function getMissions(): Promise<Mission[]> {
  try {
    const q = query(missionsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Mission));
  } catch (error) {
    console.error('Error getting missions:', error);
    throw error;
  }
}

export async function getMissionById(id: string): Promise<Mission | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: docSnap.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Mission) : null;
  } catch (error) {
    console.error('Error getting mission by id:', error);
    throw error;
  }
}

export async function getMissionsByStatus(status: Mission['status']): Promise<Mission[]> {
  try {
    // Requête simplifiée sans orderBy pour éviter l'index composite
    const q = query(missionsCollection, where('status', '==', status));
    const snapshot = await getDocs(q);
    
    const missions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Mission));

    // Tri côté client par date de création décroissante
    return missions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error getting missions by status:', error);
    throw error;
  }
}

export async function createMission(data: Omit<Mission, 'id'>): Promise<Mission> {
  try {
    const missionData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: data.status || 'draft',
      assignedTo: data.assignedTo || [],
    };

    const docRef = await addDoc(missionsCollection, missionData);
    
    return {
      id: docRef.id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Mission;
  } catch (error) {
    console.error('Error creating mission:', error);
    throw error;
  }
}

export async function updateMission(id: string, data: Partial<Mission>): Promise<Mission> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(docRef, updateData);
    
    const updatedMission = await getMissionById(id);
    if (!updatedMission) {
      throw new Error('Mission not found after update');
    }

    return {
      ...updatedMission,
      updatedAt: new Date().toISOString(), // Convert FieldValue to string
    };
  } catch (error) {
    console.error('Error updating mission:', error);
    throw error;
  }
}

export async function deleteMission(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting mission:', error);
    throw error;
  }
}

export const getMissionsByUser = async (userId: string): Promise<Mission[]> => {
  try {
    const missionsRef = collection(db, COLLECTION_NAME);
    // Requête simplifiée sans orderBy pour éviter l'index composite
    const q = query(
      missionsRef,
      where('assignedTo', 'array-contains', userId)
    );
    const snapshot = await getDocs(q);
    
    const missions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as Mission));

    // Tri côté client par date de création décroissante
    return missions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error getting user missions:', error);
    throw error;
  }
};