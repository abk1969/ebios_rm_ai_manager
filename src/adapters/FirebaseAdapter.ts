import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, CollectionReference, DocumentData, Query } from 'firebase/firestore';
import { WithFieldValue } from 'firebase/firestore';

export class FirebaseAdapter {
  static async createDocument<T extends WithFieldValue<DocumentData>>(
    collectionName: string,
    data: T
  ): Promise<string> {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
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
}