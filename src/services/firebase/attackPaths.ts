import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { AttackPath, AttackAction } from '@/types/ebios';

const PATHS_COLLECTION = 'attackPaths';
const ACTIONS_COLLECTION = 'attackActions';

export const getAttackPaths = async (missionId: string): Promise<AttackPath[]> => {
  const pathsRef = collection(db, PATHS_COLLECTION);
  const q = query(pathsRef, where('missionId', '==', missionId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttackPath));
};

export const createAttackPath = async (path: Omit<AttackPath, 'id'>): Promise<AttackPath> => {
  const docRef = await addDoc(collection(db, PATHS_COLLECTION), path);
  return { id: docRef.id, ...path } as AttackPath;
};

export const addAttackAction = async (pathId: string, action: Omit<AttackAction, 'id'>): Promise<void> => {
  const actionsRef = collection(db, ACTIONS_COLLECTION);
  await addDoc(actionsRef, { ...action, attackPathId: pathId });
};

export const updateAttackPath = async (id: string, data: Partial<AttackPath>): Promise<void> => {
  const docRef = doc(db, PATHS_COLLECTION, id);
  await updateDoc(docRef, data);
};