import { FirebaseAdapter } from '@/adapters/FirebaseAdapter';
import { WithFieldValue, DocumentData } from 'firebase/firestore';
import { logger } from '@/services/logging/SecureLogger';

/**
 * Interface Repository générique
 * Définit le contrat pour tous les repositories
 */
export interface IRepository<T> {
  save(entity: T): Promise<string>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  findByField(field: string, value: any): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
}

/**
 * Repository de base avec implémentation Firebase
 * Applique le pattern Repository avec logging et gestion d'erreurs
 */
export abstract class BaseRepository<T extends WithFieldValue<DocumentData>> implements IRepository<T> {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  async save(data: T): Promise<string> {
    try {
      const id = await FirebaseAdapter.createDocument(this.collectionName, data);
      logger.debug(`Document créé dans ${this.collectionName}`, { id }, 'BaseRepository');
      return id;
    } catch (error) {
      logger.error(`Erreur création document ${this.collectionName}`, error, 'BaseRepository');
      throw new Error(`Impossible de créer le document: ${error}`);
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      const documents = await FirebaseAdapter.getDocuments<T>(this.collectionName, {
        field: 'id',
        operator: '==',
        value: id
      });
      return documents.length > 0 ? documents[0] : null;
    } catch (error) {
      logger.error(`Erreur récupération document ${this.collectionName}`, error, 'BaseRepository');
      throw new Error(`Impossible de récupérer le document: ${error}`);
    }
  }

  async findAll(): Promise<T[]> {
    try {
      const documents = await FirebaseAdapter.getDocuments<T>(this.collectionName);
      logger.debug(`Documents récupérés de ${this.collectionName}`, { count: documents.length }, 'BaseRepository');
      return documents;
    } catch (error) {
      logger.error(`Erreur récupération documents ${this.collectionName}`, error, 'BaseRepository');
      throw new Error(`Impossible de récupérer les documents: ${error}`);
    }
  }

  async findByField(field: string, value: any): Promise<T[]> {
    try {
      const documents = await FirebaseAdapter.getDocuments<T>(this.collectionName, {
        field,
        operator: '==',
        value
      });
      logger.debug(`Documents filtrés de ${this.collectionName}`, { field, value, count: documents.length }, 'BaseRepository');
      return documents;
    } catch (error) {
      logger.error(`Erreur filtrage documents ${this.collectionName}`, error, 'BaseRepository');
      throw new Error(`Impossible de filtrer les documents: ${error}`);
    }
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    try {
      await FirebaseAdapter.updateDocument(this.collectionName, id, data);
      logger.debug(`Document mis à jour dans ${this.collectionName}`, { id }, 'BaseRepository');
    } catch (error) {
      logger.error(`Erreur mise à jour document ${this.collectionName}`, error, 'BaseRepository');
      throw new Error(`Impossible de mettre à jour le document: ${error}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await FirebaseAdapter.deleteDocument(this.collectionName, id);
      logger.debug(`Document supprimé de ${this.collectionName}`, { id }, 'BaseRepository');
    } catch (error) {
      logger.error(`Erreur suppression document ${this.collectionName}`, error, 'BaseRepository');
      throw new Error(`Impossible de supprimer le document: ${error}`);
    }
  }

  // Méthodes héritées pour compatibilité
  async create(data: T): Promise<string> {
    return this.save(data);
  }

  async getAll(): Promise<T[]> {
    return this.findAll();
  }

  async getByField(field: string, value: any): Promise<T[]> {
    return this.findByField(field, value);
  }
}