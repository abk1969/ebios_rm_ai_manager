import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SecurityBaseline, SecurityBaselineGap } from '@/types/ebios';

const COLLECTION_NAME = 'securityBaseline';
const GAPS_COLLECTION = 'securityBaselineGaps';

export const getSecurityBaseline = async (missionId: string): Promise<SecurityBaseline[]> => {
  const baselineRef = collection(db, COLLECTION_NAME);
  const q = query(baselineRef, where('missionId', '==', missionId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SecurityBaseline));
};

export const createSecurityBaseline = async (baseline: Omit<SecurityBaseline, 'id'>): Promise<SecurityBaseline> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), baseline);
  return { id: docRef.id, ...baseline } as SecurityBaseline;
};

export const updateSecurityBaseline = async (id: string, data: Partial<SecurityBaseline>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, data);
};

export const addSecurityGap = async (baselineId: string, gap: Omit<SecurityBaselineGap, 'id'>): Promise<void> => {
  const gapsRef = collection(db, GAPS_COLLECTION);
  await addDoc(gapsRef, { ...gap, baselineId });
};