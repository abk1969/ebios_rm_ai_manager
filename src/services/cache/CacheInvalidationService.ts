/**
 * 🔄 SERVICE D'INVALIDATION AUTOMATIQUE DU CACHE
 * Invalidation intelligente basée sur les modifications des données
 * 
 * FONCTIONNALITÉS:
 * - Détection automatique des modifications
 * - Invalidation sélective par collection
 * - Hooks pour les services Firebase
 * - Invalidation en cascade
 * - Logs de traçabilité
 */

import EbiosRMMetricsService from '@/services/metrics/EbiosRMMetricsService';

interface InvalidationRule {
  collection: string;
  affectedMissions: string[];
  cascadeCollections?: string[];
  delay?: number; // Délai avant invalidation (pour grouper les modifications)
}

interface InvalidationEvent {
  missionId: string;
  collection: string;
  operation: 'create' | 'update' | 'delete';
  timestamp: number;
  documentId?: string;
}

/**
 * Service d'invalidation automatique du cache
 */
export class CacheInvalidationService {
  private static instance: CacheInvalidationService;
  private pendingInvalidations = new Map<string, NodeJS.Timeout>();
  private invalidationHistory: InvalidationEvent[] = [];
  private maxHistorySize = 1000;

  // Collections qui affectent les métriques EBIOS RM
  private readonly metricsCollections = [
    'businessValues',
    'supportingAssets', 
    'dreadedEvents',
    'riskSources',
    'strategicScenarios',
    'operationalScenarios',
    'securityMeasures'
  ];

  // Règles d'invalidation en cascade
  private readonly cascadeRules: Record<string, string[]> = {
    'businessValues': ['supportingAssets', 'dreadedEvents'],
    'supportingAssets': ['dreadedEvents'],
    'riskSources': ['strategicScenarios'],
    'strategicScenarios': ['operationalScenarios'],
    'operationalScenarios': ['securityMeasures']
  };

  static getInstance(): CacheInvalidationService {
    if (!CacheInvalidationService.instance) {
      CacheInvalidationService.instance = new CacheInvalidationService();
    }
    return CacheInvalidationService.instance;
  }

  /**
   * 🔄 INVALIDATION SUITE À UNE MODIFICATION
   */
  async onDataModified(
    missionId: string,
    collection: string,
    operation: 'create' | 'update' | 'delete',
    documentId?: string
  ): Promise<void> {
    if (!this.shouldInvalidateForCollection(collection)) {
      return;
    }

    const event: InvalidationEvent = {
      missionId,
      collection,
      operation,
      timestamp: Date.now(),
      documentId
    };

    this.addToHistory(event);

    if (import.meta.env.DEV) {
      console.log(`🔄 Modification détectée: ${collection} (${operation}) pour mission ${missionId}`);
    }

    // Invalidation avec délai pour grouper les modifications rapides
    await this.scheduleInvalidation(missionId, collection, 1000); // 1 seconde de délai
  }

  /**
   * 🗑️ INVALIDATION IMMÉDIATE
   */
  async invalidateImmediately(missionId: string, reason?: string): Promise<void> {
    try {
      // Annuler les invalidations en attente
      const pendingKey = `${missionId}:*`;
      this.pendingInvalidations.forEach((timeout, key) => {
        if (key.startsWith(missionId)) {
          clearTimeout(timeout);
          this.pendingInvalidations.delete(key);
        }
      });

      // Invalidation du cache
      await EbiosRMMetricsService.invalidateCache(missionId);

      if (import.meta.env.DEV) {
        console.log(`🗑️ Cache invalidé immédiatement pour mission ${missionId}${reason ? ` (${reason})` : ''}`);
      }

      // Enregistrer l'événement
      this.addToHistory({
        missionId,
        collection: 'all',
        operation: 'delete',
        timestamp: Date.now()
      });

    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Erreur invalidation immédiate:', error);
      }
    }
  }

  /**
   * 🔄 INVALIDATION EN CASCADE
   */
  async invalidateCascade(missionId: string, sourceCollection: string): Promise<void> {
    const affectedCollections = this.getCascadeCollections(sourceCollection);
    
    if (affectedCollections.length === 0) {
      return;
    }

    if (import.meta.env.DEV) {
      console.log(`🔄 Invalidation en cascade depuis ${sourceCollection}: ${affectedCollections.join(', ')}`);
    }

    // Invalider le cache pour toutes les collections affectées
    await this.invalidateImmediately(missionId, `cascade depuis ${sourceCollection}`);
  }

  /**
   * 📊 STATISTIQUES D'INVALIDATION
   */
  getInvalidationStats(missionId?: string): {
    totalInvalidations: number;
    invalidationsByCollection: Record<string, number>;
    recentInvalidations: InvalidationEvent[];
    pendingInvalidations: number;
  } {
    const filteredHistory = missionId 
      ? this.invalidationHistory.filter(e => e.missionId === missionId)
      : this.invalidationHistory;

    const invalidationsByCollection: Record<string, number> = {};
    filteredHistory.forEach(event => {
      invalidationsByCollection[event.collection] = (invalidationsByCollection[event.collection] || 0) + 1;
    });

    const recentInvalidations = filteredHistory
      .filter(e => Date.now() - e.timestamp < 24 * 60 * 60 * 1000) // Dernières 24h
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);

    const pendingCount = missionId
      ? Array.from(this.pendingInvalidations.keys()).filter(k => k.startsWith(missionId)).length
      : this.pendingInvalidations.size;

    return {
      totalInvalidations: filteredHistory.length,
      invalidationsByCollection,
      recentInvalidations,
      pendingInvalidations: pendingCount
    };
  }

  /**
   * 🧹 NETTOYAGE DE L'HISTORIQUE
   */
  cleanupHistory(): void {
    if (this.invalidationHistory.length > this.maxHistorySize) {
      this.invalidationHistory = this.invalidationHistory
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, this.maxHistorySize);
    }

    // Supprimer les événements anciens (> 7 jours)
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    this.invalidationHistory = this.invalidationHistory.filter(e => e.timestamp > weekAgo);
  }

  // === MÉTHODES PRIVÉES ===

  private shouldInvalidateForCollection(collection: string): boolean {
    return this.metricsCollections.includes(collection);
  }

  private async scheduleInvalidation(
    missionId: string, 
    collection: string, 
    delay: number
  ): Promise<void> {
    const key = `${missionId}:${collection}`;

    // Annuler l'invalidation précédente si elle existe
    if (this.pendingInvalidations.has(key)) {
      clearTimeout(this.pendingInvalidations.get(key)!);
    }

    // Programmer la nouvelle invalidation
    const timeout = setTimeout(async () => {
      try {
        await EbiosRMMetricsService.invalidateCache(missionId);
        
        if (import.meta.env.DEV) {
          console.log(`🗑️ Cache invalidé (programmé) pour mission ${missionId} suite à modification ${collection}`);
        }

        // Vérifier si une invalidation en cascade est nécessaire
        await this.invalidateCascade(missionId, collection);

      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('❌ Erreur invalidation programmée:', error);
        }
      } finally {
        this.pendingInvalidations.delete(key);
      }
    }, delay);

    this.pendingInvalidations.set(key, timeout);
  }

  private getCascadeCollections(sourceCollection: string): string[] {
    return this.cascadeRules[sourceCollection] || [];
  }

  private addToHistory(event: InvalidationEvent): void {
    this.invalidationHistory.push(event);
    
    // Nettoyage périodique
    if (this.invalidationHistory.length % 100 === 0) {
      this.cleanupHistory();
    }
  }
}

/**
 * 🔧 HOOKS POUR INTÉGRATION AVEC LES SERVICES FIREBASE
 */

/**
 * Hook à appeler après création d'un document
 */
export const onDocumentCreated = async (
  missionId: string,
  collection: string,
  documentId: string
): Promise<void> => {
  const service = CacheInvalidationService.getInstance();
  await service.onDataModified(missionId, collection, 'create', documentId);
};

/**
 * Hook à appeler après mise à jour d'un document
 */
export const onDocumentUpdated = async (
  missionId: string,
  collection: string,
  documentId: string
): Promise<void> => {
  const service = CacheInvalidationService.getInstance();
  await service.onDataModified(missionId, collection, 'update', documentId);
};

/**
 * Hook à appeler après suppression d'un document
 */
export const onDocumentDeleted = async (
  missionId: string,
  collection: string,
  documentId: string
): Promise<void> => {
  const service = CacheInvalidationService.getInstance();
  await service.onDataModified(missionId, collection, 'delete', documentId);
};

/**
 * Hook à appeler lors d'import/export massif
 */
export const onBulkOperation = async (
  missionId: string,
  affectedCollections: string[]
): Promise<void> => {
  const service = CacheInvalidationService.getInstance();
  await service.invalidateImmediately(missionId, `opération en lot sur ${affectedCollections.join(', ')}`);
};

export default CacheInvalidationService;
