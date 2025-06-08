import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AttackPath, AttackAction } from '@/types/ebios';
import { AIEnrichmentService } from '@/services/ai/AIEnrichmentService';

const PATHS_COLLECTION = 'attackPaths';
const ACTIONS_COLLECTION = 'attackActions';

export const getAttackPaths = async (missionId: string): Promise<AttackPath[]> => {
  const pathsRef = collection(db, PATHS_COLLECTION);
  const q = query(pathsRef, where('missionId', '==', missionId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttackPath));
};

export const createAttackPath = async (path: Omit<AttackPath, 'id'>): Promise<AttackPath> => {
  const enrichedPath = AIEnrichmentService.enrichAttackPath(path);
  
  const docRef = await addDoc(collection(db, PATHS_COLLECTION), {
    ...enrichedPath,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return { id: docRef.id, ...enrichedPath } as AttackPath;
};

export const addAttackAction = async (pathId: string, action: Omit<AttackAction, 'id'>): Promise<void> => {
  const actionsRef = collection(db, ACTIONS_COLLECTION);
  await addDoc(actionsRef, { ...action, attackPathId: pathId });
};

export const updateAttackPath = async (id: string, data: Partial<AttackPath>): Promise<void> => {
  const enrichedData = AIEnrichmentService.enrichAttackPath(data);
  
  const docRef = doc(db, PATHS_COLLECTION, id);
  await updateDoc(docRef, {
    ...enrichedData,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteAttackPath = async (id: string): Promise<void> => {
  const docRef = doc(db, PATHS_COLLECTION, id);
  await deleteDoc(docRef);
};