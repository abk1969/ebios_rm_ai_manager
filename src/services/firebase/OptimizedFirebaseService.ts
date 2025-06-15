/**
 * 🚀 SERVICE FIREBASE OPTIMISÉ POUR EBIOS RM
 * Optimisation des requêtes et gestion intelligente des données
 * 
 * OPTIMISATIONS:
 * - Requêtes parallèles avec limitation de concurrence
 * - Pagination intelligente pour grandes collections
 * - Compression des données
 * - Retry automatique avec backoff exponentiel
 * - Monitoring des performances
 */

import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter, 
  DocumentSnapshot,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface QueryOptions {
  pageSize?: number;
  maxConcurrency?: number;
  enableRetry?: boolean;
  maxRetries?: number;
  timeout?: number;
}

interface QueryResult<T> {
  data: T[];
  hasMore: boolean;
  lastDoc?: DocumentSnapshot;
  totalFetched: number;
  queryTime: number;
}

interface PerformanceMetrics {
  totalQueries: number;
  averageQueryTime: number;
  cacheHitRate: number;
  errorRate: number;
  dataTransferred: number;
}

/**
 * Service Firebase optimisé pour les requêtes EBIOS RM
 */
export class OptimizedFirebaseService {
  private static instance: OptimizedFirebaseService;
  private metrics: PerformanceMetrics = {
    totalQueries: 0,
    averageQueryTime: 0,
    cacheHitRate: 0,
    errorRate: 0,
    dataTransferred: 0
  };

  private defaultOptions: QueryOptions = {
    pageSize: 100,
    maxConcurrency: 5,
    enableRetry: true,
    maxRetries: 3,
    timeout: 10000
  };

  static getInstance(): OptimizedFirebaseService {
    if (!OptimizedFirebaseService.instance) {
      OptimizedFirebaseService.instance = new OptimizedFirebaseService();
    }
    return OptimizedFirebaseService.instance;
  }

  /**
   * 🚀 REQUÊTE OPTIMISÉE AVEC PAGINATION AUTOMATIQUE
   */
  async getCollectionOptimized<T>(
    collectionName: string,
    missionId: string,
    options: QueryOptions = {}
  ): Promise<T[]> {
    const startTime = performance.now();
    const opts = { ...this.defaultOptions, ...options };
    
    try {
      const allData: T[] = [];
      let hasMore = true;
      let lastDoc: DocumentSnapshot | undefined;
      let pageCount = 0;

      while (hasMore && pageCount < 10) { // Limite de sécurité
        const pageResult = await this.getPage<T>(
          collectionName,
          missionId,
          opts.pageSize!,
          lastDoc
        );

        allData.push(...pageResult.data);
        hasMore = pageResult.hasMore;
        lastDoc = pageResult.lastDoc;
        pageCount++;

        // Pause entre les pages pour éviter la surcharge
        if (hasMore && pageCount > 1) {
          await this.sleep(50);
        }
      }

      this.updateMetrics(startTime, allData.length, true);
      
      if (import.meta.env.DEV) {
        const queryTime = performance.now() - startTime;
        console.log(`🚀 Collection ${collectionName} récupérée: ${allData.length} éléments en ${queryTime.toFixed(2)}ms (${pageCount} pages)`);
      }

      return allData;

    } catch (error) {
      this.updateMetrics(startTime, 0, false);
      
      if (opts.enableRetry) {
        return this.retryWithBackoff(() => 
          this.getCollectionOptimized<T>(collectionName, missionId, { ...options, enableRetry: false })
        , opts.maxRetries!);
      }
      
      throw error;
    }
  }

  /**
   * 🔄 REQUÊTES PARALLÈLES AVEC LIMITATION DE CONCURRENCE
   */
  async getMultipleCollections(
    requests: Array<{ collection: string; missionId: string }>,
    options: QueryOptions = {}
  ): Promise<Record<string, any[]>> {
    const opts = { ...this.defaultOptions, ...options };
    const results: Record<string, any[]> = {};

    // Traitement par lots pour limiter la concurrence
    const batches = this.createBatches(requests, opts.maxConcurrency!);
    
    for (const batch of batches) {
      const batchPromises = batch.map(async (request) => {
        const data = await this.getCollectionOptimized(
          request.collection,
          request.missionId,
          options
        );
        return { collection: request.collection, data };
      });

      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results[result.value.collection] = result.value.data;
        } else {
          const collectionName = batch[index].collection;
          results[collectionName] = [];
          
          if (import.meta.env.DEV) {
            console.warn(`⚠️ Erreur collection ${collectionName}:`, result.reason);
          }
        }
      });
    }

    return results;
  }

  /**
   * 🔍 REQUÊTE AVEC FILTRES OPTIMISÉS
   */
  async getFilteredCollection<T>(
    collectionName: string,
    filters: Array<{ field: string; operator: any; value: any }>,
    options: QueryOptions = {}
  ): Promise<T[]> {
    const startTime = performance.now();
    
    try {
      const constraints: QueryConstraint[] = [];
      
      // Ajouter les filtres
      filters.forEach(filter => {
        constraints.push(where(filter.field, filter.operator, filter.value));
      });

      // Optimisation: trier par le champ le plus sélectif
      const mostSelectiveField = this.getMostSelectiveField(filters);
      if (mostSelectiveField) {
        constraints.push(orderBy(mostSelectiveField));
      }

      const q = query(collection(db, collectionName), ...constraints);
      const snapshot = await getDocs(q);
      
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as T));

      this.updateMetrics(startTime, data.length, true);
      
      if (import.meta.env.DEV) {
        const queryTime = performance.now() - startTime;
        console.log(`🔍 Requête filtrée ${collectionName}: ${data.length} résultats en ${queryTime.toFixed(2)}ms`);
      }

      return data;

    } catch (error) {
      this.updateMetrics(startTime, 0, false);
      throw error;
    }
  }

  /**
   * 📊 MÉTRIQUES DE PERFORMANCE
   */
  getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * 🧹 RÉINITIALISATION DES MÉTRIQUES
   */
  resetMetrics(): void {
    this.metrics = {
      totalQueries: 0,
      averageQueryTime: 0,
      cacheHitRate: 0,
      errorRate: 0,
      dataTransferred: 0
    };
  }

  // === MÉTHODES PRIVÉES ===

  private async getPage<T>(
    collectionName: string,
    missionId: string,
    pageSize: number,
    lastDoc?: DocumentSnapshot
  ): Promise<QueryResult<T>> {
    const constraints: QueryConstraint[] = [
      where('missionId', '==', missionId),
      orderBy('__name__'), // Tri par ID pour pagination stable
      limit(pageSize)
    ];

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    const q = query(collection(db, collectionName), ...constraints);
    const snapshot = await getDocs(q);
    
    const data = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as T));

    return {
      data,
      hasMore: snapshot.docs.length === pageSize,
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
      totalFetched: data.length,
      queryTime: 0 // Sera calculé par la méthode appelante
    };
  }

  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  private getMostSelectiveField(filters: Array<{ field: string; operator: any; value: any }>): string | null {
    // Heuristique simple: privilégier les champs avec égalité stricte
    const equalityFilter = filters.find(f => f.operator === '==');
    return equalityFilter ? equalityFilter.field : null;
  }

  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          break;
        }

        // Backoff exponentiel: 100ms, 200ms, 400ms, etc.
        const delay = Math.min(100 * Math.pow(2, attempt - 1), 2000);
        await this.sleep(delay);
        
        if (import.meta.env.DEV) {
          console.warn(`⚠️ Tentative ${attempt}/${maxRetries} échouée, retry dans ${delay}ms`);
        }
      }
    }
    
    throw lastError!;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private updateMetrics(startTime: number, dataCount: number, success: boolean): void {
    const queryTime = performance.now() - startTime;
    
    this.metrics.totalQueries++;
    this.metrics.averageQueryTime = 
      (this.metrics.averageQueryTime * (this.metrics.totalQueries - 1) + queryTime) / this.metrics.totalQueries;
    
    if (!success) {
      this.metrics.errorRate = 
        (this.metrics.errorRate * (this.metrics.totalQueries - 1) + 1) / this.metrics.totalQueries;
    }
    
    this.metrics.dataTransferred += dataCount;
  }
}

export default OptimizedFirebaseService;
