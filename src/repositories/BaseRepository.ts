import { FirebaseAdapter } from '@/adapters/FirebaseAdapter';
import { WithFieldValue, DocumentData } from 'firebase/firestore';

export abstract class BaseRepository<T extends WithFieldValue<DocumentData>> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  async create(data: T): Promise<string> {
    return FirebaseAdapter.createDocument(this.collectionName, data);
  }

  async getAll(): Promise<T[]> {
    return FirebaseAdapter.getDocuments<T>(this.collectionName);
  }

  async getByField(field: string, value: any): Promise<T[]> {
    return FirebaseAdapter.getDocuments<T>(this.collectionName, {
      field,
      operator: '==',
      value
    });
  }
}