import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, DocumentData } from 'firebase/firestore';
import { Workshop } from '@/types/ebios';

const COLLECTION_NAME = 'workshops';

export const getWorkshops = async (missionId: string): Promise<Workshop[]> => {
  const workshopsRef = collection(db, COLLECTION_NAME);
  const q = query(workshopsRef, where('missionId', '==', missionId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Workshop);
};

export const getWorkshopById = async (workshopId: string): Promise<Workshop | null> => {
  const docRef = doc(db, COLLECTION_NAME, workshopId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return { ...docSnap.data(), id: docSnap.id } as Workshop;
};

export const createWorkshop = async (data: Omit<Workshop, 'id'>): Promise<string> => {
  const workshopsRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(workshopsRef, {
    ...data,
    status: 'not_started',
    completedSteps: [],
  });
  return docRef.id;
};

export const updateWorkshop = async (id: string, data: Partial<Workshop>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, data);
};

export const updateWorkshopStatus = async (id: string, status: Workshop['status']): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { status });
};

export const completeWorkshopStep = async (id: string, step: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const workshop = (await getDoc(docRef)).data() as Workshop;
  const completedSteps = [...workshop.completedSteps, step];
  await updateDoc(docRef, { completedSteps });
};