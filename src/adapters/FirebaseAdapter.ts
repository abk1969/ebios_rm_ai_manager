import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  CollectionReference,
  DocumentData,
  Query
} from 'firebase/firestore';
import { WithFieldValue } from 'firebase/firestore';

/**
 * Adapter Firebase - Couche d'abstraction pour Firestore
 * Implémente le pattern Adapter pour découpler l'application de Firebase
 */
export class FirebaseAdapter {
  static async createDocument<T extends WithFieldValue<DocumentData>>(
    collectionName: string,
    data: T
  ): Promise<string> {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  }

  static async getDocument<T extends WithFieldValue<DocumentData>>(
    collectionName: string,
    documentId: string
  ): Promise<T | null> {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as unknown as T;
    }

    return null;
  }

  static async getDocuments<T extends WithFieldValue<DocumentData>>(
    collectionName: string,
    whereClause?: { field: string; operator: string; value: any }
  ): Promise<T[]> {
    const collectionRef = collection(db, collectionName);
    let queryRef: Query = collectionRef;

    if (whereClause) {
      queryRef = query(collectionRef, where(whereClause.field, whereClause.operator as any, whereClause.value));
    }

    const snapshot = await getDocs(queryRef);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as unknown as T);
  }

  static async updateDocument<T extends WithFieldValue<DocumentData>>(
    collectionName: string,
    documentId: string,
    data: Partial<T>
  ): Promise<void> {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, data as any);
  }

  static async deleteDocument(
    collectionName: string,
    documentId: string
  ): Promise<void> {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  }

  // Méthodes utilitaires pour les requêtes complexes
  static async getDocumentsWithMultipleFilters<T extends WithFieldValue<DocumentData>>(
    collectionName: string,
    filters: Array<{ field: string; operator: string; value: any }>
  ): Promise<T[]> {
    const collectionRef = collection(db, collectionName);
    let queryRef: Query = collectionRef;

    filters.forEach(filter => {
      queryRef = query(queryRef, where(filter.field, filter.operator as any, filter.value));
    });

    const snapshot = await getDocs(queryRef);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as unknown as T);
  }

  static async documentExists(
    collectionName: string,
    documentId: string
  ): Promise<boolean> {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  }
}