import { adminDb } from '@/lib/firebase-admin';
import type { Mission, BusinessValue, RiskSource, Workshop } from '@/types/ebios';

// Generic CRUD operations
const createDocument = async <T extends { id?: string }>(
  collection: string,
  data: Omit<T, 'id'>
): Promise<T> => {
  const docRef = await adminDb.collection(collection).add(data);
  return { id: docRef.id, ...data } as T;
};

const getDocument = async <T>(collection: string, id: string): Promise<T | null> => {
  const doc = await adminDb.collection(collection).doc(id).get();
  return doc.exists ? (doc.data() as T) : null;
};

const updateDocument = async <T>(
  collection: string,
  id: string,
  data: Partial<T>
): Promise<void> => {
  await adminDb.collection(collection).doc(id).update(data);
};

const deleteDocument = async (collection: string, id: string): Promise<void> => {
  await adminDb.collection(collection).doc(id).delete();
};

// Mission operations
export const createMission = async (data: Omit<Mission, 'id'>) => {
  return createDocument<Mission>('missions', data);
};

export const getMission = async (id: string) => {
  return getDocument<Mission>('missions', id);
};

export const updateMission = async (id: string, data: Partial<Mission>) => {
  return updateDocument<Mission>('missions', id, data);
};

export const deleteMission = async (id: string) => {
  return deleteDocument('missions', id);
};

// Business Value operations
export const createBusinessValue = async (data: Omit<BusinessValue, 'id'>) => {
  return createDocument<BusinessValue>('businessValues', data);
};

export const getBusinessValue = async (id: string) => {
  return getDocument<BusinessValue>('businessValues', id);
};

export const updateBusinessValue = async (id: string, data: Partial<BusinessValue>) => {
  return updateDocument<BusinessValue>('businessValues', id, data);
};

export const deleteBusinessValue = async (id: string) => {
  return deleteDocument('businessValues', id);
};

// Risk Source operations
export const createRiskSource = async (data: Omit<RiskSource, 'id'>) => {
  return createDocument<RiskSource>('riskSources', data);
};

export const getRiskSource = async (id: string) => {
  return getDocument<RiskSource>('riskSources', id);
};

export const updateRiskSource = async (id: string, data: Partial<RiskSource>) => {
  return updateDocument<RiskSource>('riskSources', id, data);
};

export const deleteRiskSource = async (id: string) => {
  return deleteDocument('riskSources', id);
};

// Workshop operations
export const createWorkshop = async (data: Omit<Workshop, 'id'>) => {
  return createDocument<Workshop>('workshops', data);
};

export const getWorkshop = async (id: string) => {
  return getDocument<Workshop>('workshops', id);
};

export const updateWorkshop = async (id: string, data: Partial<Workshop>) => {
  return updateDocument<Workshop>('workshops', id, data);
};

export const deleteWorkshop = async (id: string) => {
  return deleteDocument('workshops', id);
};