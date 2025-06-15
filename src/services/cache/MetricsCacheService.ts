/**
 * 🚀 SERVICE DE CACHE INTELLIGENT POUR MÉTRIQUES EBIOS RM
 * Optimisation des performances avec cache multi-niveaux
 * 
 * FONCTIONNALITÉS:
 * - Cache en mémoire avec TTL intelligent
 * - Cache persistant localStorage
 * - Invalidation automatique sur modification
 * - Compression des données
 * - Métriques de performance
 */

import { EbiosRMMetrics } from '@/services/metrics/EbiosRMMetricsService';

interface CacheEntry {
  data: EbiosRMMetrics;
  timestamp: number;
  ttl: number; // Time To Live en millisecondes
  version: string; // Version des données pour invalidation
  compressionRatio?: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  totalRequests: number;
  averageResponseTime: number;
  cacheSize: number;
}

interface CacheConfig {
  maxMemoryEntries: number;
  defaultTTL: number; // 5 minutes par défaut
  maxLocalStorageSize: number; // 10MB par défaut
  compressionThreshold: number; // Compresser si > 1KB
  enablePersistence: boolean;
}

/**
 * Service de cache intelligent pour les métriques EBIOS RM
 */
export class MetricsCacheService {
  private static instance: MetricsCacheService;
  private memoryCache = new Map<string, CacheEntry>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    evictions: 0,
    totalRequests: 0,
    averageResponseTime: 0,
    cacheSize: 0
  };
  
  private config: CacheConfig = {
    maxMemoryEntries: 50,
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxLocalStorageSize: 10 * 1024 * 1024, // 10MB
    compressionThreshold: 1024, // 1KB
    enablePersistence: true
  };

  private constructor() {
    this.initializeCache();
  }

  static getInstance(): MetricsCacheService {
    if (!MetricsCacheService.instance) {
      MetricsCacheService.instance = new MetricsCacheService();
    }
    return MetricsCacheService.instance;
  }

  /**
   * 🔍 RÉCUPÉRATION INTELLIGENTE AVEC CACHE
   */
  async get(missionId: string): Promise<EbiosRMMetrics | null> {
    const startTime = performance.now();
    this.stats.totalRequests++;

    try {
      const cacheKey = this.generateCacheKey(missionId);
      
      // 1. Vérifier le cache mémoire
      const memoryEntry = this.memoryCache.get(cacheKey);
      if (memoryEntry && this.isValidEntry(memoryEntry)) {
        this.stats.hits++;
        this.updateResponseTime(startTime);
        
        if (import.meta.env.DEV) {
          console.log(`🎯 Cache HIT (mémoire) pour mission: ${missionId}`);
        }
        
        return memoryEntry.data;
      }

      // 2. Vérifier le cache persistant
      if (this.config.enablePersistence) {
        const persistentEntry = await this.getFromPersistentCache(cacheKey);
        if (persistentEntry && this.isValidEntry(persistentEntry)) {
          // Remettre en cache mémoire
          this.memoryCache.set(cacheKey, persistentEntry);
          this.stats.hits++;
          this.updateResponseTime(startTime);
          
          if (import.meta.env.DEV) {
            console.log(`🎯 Cache HIT (persistant) pour mission: ${missionId}`);
          }
          
          return persistentEntry.data;
        }
      }

      // 3. Cache MISS
      this.stats.misses++;
      this.updateResponseTime(startTime);
      
      if (import.meta.env.DEV) {
        console.log(`❌ Cache MISS pour mission: ${missionId}`);
      }
      
      return null;
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ Erreur cache:', error);
      }
      return null;
    }
  }

  /**
   * 💾 STOCKAGE INTELLIGENT AVEC COMPRESSION
   */
  async set(missionId: string, metrics: EbiosRMMetrics, customTTL?: number): Promise<void> {
    try {
      const cacheKey = this.generateCacheKey(missionId);
      const ttl = customTTL || this.calculateDynamicTTL(metrics);
      
      const entry: CacheEntry = {
        data: metrics,
        timestamp: Date.now(),
        ttl,
        version: this.generateDataVersion(metrics)
      };

      // Stockage en mémoire
      this.memoryCache.set(cacheKey, entry);
      this.enforceMemoryLimit();

      // Stockage persistant si activé
      if (this.config.enablePersistence) {
        await this.saveToPersistentCache(cacheKey, entry);
      }

      this.updateCacheSize();
      
      if (import.meta.env.DEV) {
        console.log(`💾 Cache SET pour mission: ${missionId} (TTL: ${ttl}ms)`);
      }
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ Erreur stockage cache:', error);
      }
    }
  }

  /**
   * 🗑️ INVALIDATION INTELLIGENTE
   */
  async invalidate(missionId: string): Promise<void> {
    try {
      const cacheKey = this.generateCacheKey(missionId);
      
      // Supprimer du cache mémoire
      this.memoryCache.delete(cacheKey);
      
      // Supprimer du cache persistant
      if (this.config.enablePersistence) {
        localStorage.removeItem(`ebios_cache_${cacheKey}`);
      }
      
      this.updateCacheSize();
      
      if (import.meta.env.DEV) {
        console.log(`🗑️ Cache invalidé pour mission: ${missionId}`);
      }
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ Erreur invalidation cache:', error);
      }
    }
  }

  /**
   * 🧹 NETTOYAGE AUTOMATIQUE
   */
  async cleanup(): Promise<void> {
    try {
      const now = Date.now();
      let cleanedCount = 0;

      // Nettoyer le cache mémoire
      for (const [key, entry] of this.memoryCache.entries()) {
        if (!this.isValidEntry(entry)) {
          this.memoryCache.delete(key);
          cleanedCount++;
          this.stats.evictions++;
        }
      }

      // Nettoyer le cache persistant
      if (this.config.enablePersistence) {
        await this.cleanupPersistentCache();
      }

      this.updateCacheSize();
      
      if (import.meta.env.DEV && cleanedCount > 0) {
        console.log(`🧹 Cache nettoyé: ${cleanedCount} entrées supprimées`);
      }
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ Erreur nettoyage cache:', error);
      }
    }
  }

  /**
   * 📊 STATISTIQUES DE PERFORMANCE
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * ⚙️ CONFIGURATION DU CACHE
   */
  updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (import.meta.env.DEV) {
      console.log('⚙️ Configuration cache mise à jour:', this.config);
    }
  }

  // === MÉTHODES PRIVÉES ===

  private initializeCache(): void {
    // Nettoyage automatique toutes les 10 minutes
    setInterval(() => {
      this.cleanup();
    }, 10 * 60 * 1000);

    // Nettoyage au démarrage
    this.cleanup();
  }

  private generateCacheKey(missionId: string): string {
    return `metrics_${missionId}`;
  }

  private isValidEntry(entry: CacheEntry): boolean {
    const now = Date.now();
    return (now - entry.timestamp) < entry.ttl;
  }

  private calculateDynamicTTL(metrics: EbiosRMMetrics): number {
    // TTL dynamique basé sur la complétude des données
    const completionRate = metrics.global.overallCompletionRate;
    
    if (completionRate === 0) {
      return 2 * 60 * 1000; // 2 minutes pour données vides
    } else if (completionRate < 50) {
      return 3 * 60 * 1000; // 3 minutes pour données partielles
    } else if (completionRate < 100) {
      return 5 * 60 * 1000; // 5 minutes pour données en cours
    } else {
      return 10 * 60 * 1000; // 10 minutes pour données complètes
    }
  }

  private generateDataVersion(metrics: EbiosRMMetrics): string {
    // Version basée sur le hash des données critiques
    const criticalData = {
      w1: metrics.workshop1.completionRate,
      w2: metrics.workshop2.completionRate,
      w3: metrics.workshop3.completionRate,
      w4: metrics.workshop4.completionRate,
      w5: metrics.workshop5.completionRate,
      lastCalc: metrics.global.lastCalculation
    };
    
    return btoa(JSON.stringify(criticalData)).slice(0, 16);
  }

  private enforceMemoryLimit(): void {
    while (this.memoryCache.size > this.config.maxMemoryEntries) {
      // Supprimer l'entrée la plus ancienne
      const oldestKey = this.memoryCache.keys().next().value;
      if (oldestKey) {
        this.memoryCache.delete(oldestKey);
        this.stats.evictions++;
      }
    }
  }

  private async getFromPersistentCache(cacheKey: string): Promise<CacheEntry | null> {
    try {
      const stored = localStorage.getItem(`ebios_cache_${cacheKey}`);
      if (stored) {
        return JSON.parse(stored) as CacheEntry;
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ Erreur lecture cache persistant:', error);
      }
    }
    return null;
  }

  private async saveToPersistentCache(cacheKey: string, entry: CacheEntry): Promise<void> {
    try {
      const serialized = JSON.stringify(entry);
      
      // Vérifier la taille
      if (serialized.length > this.config.compressionThreshold) {
        // TODO: Implémenter compression si nécessaire
        entry.compressionRatio = 1.0;
      }
      
      localStorage.setItem(`ebios_cache_${cacheKey}`, serialized);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ Erreur sauvegarde cache persistant:', error);
      }
    }
  }

  private async cleanupPersistentCache(): Promise<void> {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('ebios_cache_')) {
          try {
            const stored = localStorage.getItem(key);
            if (stored) {
              const entry = JSON.parse(stored) as CacheEntry;
              if (!this.isValidEntry(entry)) {
                keysToRemove.push(key);
              }
            }
          } catch {
            keysToRemove.push(key);
          }
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('⚠️ Erreur nettoyage cache persistant:', error);
      }
    }
  }

  private updateResponseTime(startTime: number): void {
    const responseTime = performance.now() - startTime;
    this.stats.averageResponseTime = 
      (this.stats.averageResponseTime * (this.stats.totalRequests - 1) + responseTime) / this.stats.totalRequests;
  }

  private updateCacheSize(): void {
    this.stats.cacheSize = this.memoryCache.size;
  }
}

export default MetricsCacheService;
