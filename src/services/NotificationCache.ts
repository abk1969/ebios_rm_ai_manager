/**
 * 💾 SYSTÈME DE CACHE INTELLIGENT POUR NOTIFICATIONS
 * Cache multi-niveaux avec TTL, LRU et persistance
 * 
 * @fileoverview Système de cache avancé pour optimiser les performances
 * du système de notifications avec gestion intelligente de la mémoire,
 * expiration automatique et persistance sélective.
 * 
 * @version 1.0.0
 * @author Équipe EBIOS RM
 */

import type { EbiosNotification, NotificationStats } from '../types';

// 🎯 TYPES POUR LE CACHE
interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
}

interface CacheConfig {
  maxMemorySize: number;      // Taille max en bytes
  defaultTTL: number;         // TTL par défaut en ms
  maxEntries: number;         // Nombre max d'entrées
  enablePersistence: boolean; // Persistance localStorage
  enableCompression: boolean; // Compression des données
  enableMetrics: boolean;     // Collecte de métriques
}

interface CacheMetrics {
  hits: number;
  misses: number;
  evictions: number;
  totalSize: number;
  entryCount: number;
  hitRate: number;
  averageAccessTime: number;
}

interface CacheLayer {
  name: string;
  storage: Map<string, CacheEntry>;
  config: Partial<CacheConfig>;
}

/**
 * 💾 CACHE INTELLIGENT MULTI-NIVEAUX
 */
export class NotificationCache {
  private static instance: NotificationCache | null = null;
  private layers: Map<string, CacheLayer> = new Map();
  private config: CacheConfig;
  private metrics: CacheMetrics;
  private cleanupInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.config = {
      maxMemorySize: 50 * 1024 * 1024, // 50MB
      defaultTTL: 30 * 60 * 1000,      // 30 minutes
      maxEntries: 10000,
      enablePersistence: true,
      enableCompression: false,
      enableMetrics: true
    };

    this.metrics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalSize: 0,
      entryCount: 0,
      hitRate: 0,
      averageAccessTime: 0
    };

    this.initializeLayers();
    this.startCleanupProcess();
  }

  // 🏭 SINGLETON PATTERN
  public static getInstance(): NotificationCache {
    if (!NotificationCache.instance) {
      NotificationCache.instance = new NotificationCache();
    }
    return NotificationCache.instance;
  }

  // 🚀 INITIALISATION DES COUCHES DE CACHE
  private initializeLayers(): void {
    // Couche L1 : Cache mémoire ultra-rapide (notifications récentes)
    this.layers.set('L1_memory', {
      name: 'L1_memory',
      storage: new Map(),
      config: {
        maxEntries: 100,
        defaultTTL: 5 * 60 * 1000, // 5 minutes
        enablePersistence: false
      }
    });

    // Couche L2 : Cache mémoire principal (notifications actives)
    this.layers.set('L2_active', {
      name: 'L2_active',
      storage: new Map(),
      config: {
        maxEntries: 1000,
        defaultTTL: 30 * 60 * 1000, // 30 minutes
        enablePersistence: false
      }
    });

    // Couche L3 : Cache persistant (notifications archivées)
    this.layers.set('L3_persistent', {
      name: 'L3_persistent',
      storage: new Map(),
      config: {
        maxEntries: 5000,
        defaultTTL: 24 * 60 * 60 * 1000, // 24 heures
        enablePersistence: true
      }
    });

    // Couche spécialisée : Cache des services
    this.layers.set('services', {
      name: 'services',
      storage: new Map(),
      config: {
        maxEntries: 50,
        defaultTTL: 60 * 60 * 1000, // 1 heure
        enablePersistence: true
      }
    });

    // Couche spécialisée : Cache des métriques
    this.layers.set('metrics', {
      name: 'metrics',
      storage: new Map(),
      config: {
        maxEntries: 100,
        defaultTTL: 10 * 60 * 1000, // 10 minutes
        enablePersistence: false
      }
    });

    console.log('💾 Cache multi-niveaux initialisé');
  }

  // 📥 MÉTHODES DE STOCKAGE

  /**
   * Stocker une notification dans le cache approprié
   */
  public setNotification(notification: EbiosNotification, layer: string = 'L2_active'): void {
    const key = `notification_${notification.id}`;
    this.set(layer, key, notification, this.getNotificationTTL(notification));
  }

  /**
   * Stocker des données génériques
   */
  public set<T>(layerName: string, key: string, data: T, ttl?: number): void {
    const startTime = Date.now();
    
    try {
      const layer = this.layers.get(layerName);
      if (!layer) {
        throw new Error(`Couche de cache inconnue: ${layerName}`);
      }

      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl || layer.config.defaultTTL || this.config.defaultTTL,
        accessCount: 0,
        lastAccessed: Date.now(),
        size: this.calculateSize(data)
      };

      // Vérifier les limites avant insertion
      this.enforceLayerLimits(layer);

      // Stocker l'entrée
      layer.storage.set(key, entry);
      this.updateMetrics('set', Date.now() - startTime);

      // Persistance si activée
      if (layer.config.enablePersistence) {
        this.persistLayer(layerName);
      }

    } catch (error) {
      console.error(`❌ Erreur cache set [${layerName}/${key}]:`, error);
    }
  }

  // 📤 MÉTHODES DE RÉCUPÉRATION

  /**
   * Récupérer une notification du cache
   */
  public getNotification(notificationId: string): EbiosNotification | null {
    const key = `notification_${notificationId}`;
    
    // Recherche dans toutes les couches (L1 -> L2 -> L3)
    for (const layerName of ['L1_memory', 'L2_active', 'L3_persistent']) {
      const result = this.get<EbiosNotification>(layerName, key);
      if (result) {
        // Promouvoir vers une couche supérieure si trouvé dans L3
        if (layerName === 'L3_persistent') {
          this.setNotification(result, 'L2_active');
        }
        return result;
      }
    }

    return null;
  }

  /**
   * Récupérer des données génériques
   */
  public get<T>(layerName: string, key: string): T | null {
    const startTime = Date.now();
    
    try {
      const layer = this.layers.get(layerName);
      if (!layer) {
        this.metrics.misses++;
        return null;
      }

      const entry = layer.storage.get(key);
      if (!entry) {
        this.metrics.misses++;
        return null;
      }

      // Vérifier l'expiration
      if (this.isExpired(entry)) {
        layer.storage.delete(key);
        this.metrics.misses++;
        this.metrics.evictions++;
        return null;
      }

      // Mettre à jour les statistiques d'accès
      entry.accessCount++;
      entry.lastAccessed = Date.now();

      this.metrics.hits++;
      this.updateMetrics('get', Date.now() - startTime);

      return entry.data;

    } catch (error) {
      console.error(`❌ Erreur cache get [${layerName}/${key}]:`, error);
      this.metrics.misses++;
      return null;
    }
  }

  // 🗑️ MÉTHODES DE SUPPRESSION

  /**
   * Supprimer une notification du cache
   */
  public deleteNotification(notificationId: string): void {
    const key = `notification_${notificationId}`;
    
    for (const layerName of this.layers.keys()) {
      this.delete(layerName, key);
    }
  }

  /**
   * Supprimer une entrée spécifique
   */
  public delete(layerName: string, key: string): boolean {
    const layer = this.layers.get(layerName);
    if (!layer) return false;

    const deleted = layer.storage.delete(key);
    
    if (deleted && layer.config.enablePersistence) {
      this.persistLayer(layerName);
    }

    return deleted;
  }

  // 🧹 GESTION DE LA MÉMOIRE

  /**
   * Appliquer les limites de la couche
   */
  private enforceLayerLimits(layer: CacheLayer): void {
    const maxEntries = layer.config.maxEntries || this.config.maxEntries;
    
    // Éviction LRU si nécessaire
    while (layer.storage.size >= maxEntries) {
      this.evictLRU(layer);
    }

    // Vérifier la taille mémoire globale
    this.enforceMemoryLimit();
  }

  /**
   * Éviction LRU (Least Recently Used)
   */
  private evictLRU(layer: CacheLayer): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of layer.storage.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      layer.storage.delete(oldestKey);
      this.metrics.evictions++;
    }
  }

  /**
   * Appliquer la limite mémoire globale
   */
  private enforceMemoryLimit(): void {
    let totalSize = this.calculateTotalSize();
    
    while (totalSize > this.config.maxMemorySize) {
      // Éviction globale en commençant par les couches moins critiques
      const evicted = this.evictFromLeastCriticalLayer();
      if (!evicted) break;
      
      totalSize = this.calculateTotalSize();
    }
  }

  /**
   * Éviction depuis la couche la moins critique
   */
  private evictFromLeastCriticalLayer(): boolean {
    const layerPriority = ['L3_persistent', 'metrics', 'L2_active', 'services', 'L1_memory'];
    
    for (const layerName of layerPriority) {
      const layer = this.layers.get(layerName);
      if (layer && layer.storage.size > 0) {
        this.evictLRU(layer);
        return true;
      }
    }
    
    return false;
  }

  // 🧮 CALCULS ET UTILITAIRES

  /**
   * Calculer la taille d'un objet
   */
  private calculateSize(data: any): number {
    try {
      return JSON.stringify(data).length * 2; // Approximation UTF-16
    } catch {
      return 1024; // Taille par défaut
    }
  }

  /**
   * Calculer la taille totale du cache
   */
  private calculateTotalSize(): number {
    let total = 0;
    
    for (const layer of this.layers.values()) {
      for (const entry of layer.storage.values()) {
        total += entry.size;
      }
    }
    
    return total;
  }

  /**
   * Vérifier si une entrée est expirée
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * Calculer le TTL approprié pour une notification
   */
  private getNotificationTTL(notification: EbiosNotification): number {
    switch (notification.priority) {
      case 'urgent':
        return 60 * 60 * 1000; // 1 heure
      case 'high':
        return 4 * 60 * 60 * 1000; // 4 heures
      case 'medium':
        return 12 * 60 * 60 * 1000; // 12 heures
      case 'low':
        return 24 * 60 * 60 * 1000; // 24 heures
      default:
        return this.config.defaultTTL;
    }
  }

  // 💾 PERSISTANCE

  /**
   * Persister une couche dans localStorage
   */
  private persistLayer(layerName: string): void {
    if (!this.config.enablePersistence) return;

    try {
      const layer = this.layers.get(layerName);
      if (!layer || !layer.config.enablePersistence) return;

      const data = Array.from(layer.storage.entries());
      localStorage.setItem(`cache_${layerName}`, JSON.stringify(data));
    } catch (error) {
      console.warn(`⚠️ Erreur persistance couche ${layerName}:`, error);
    }
  }

  /**
   * Charger une couche depuis localStorage
   */
  private loadLayer(layerName: string): void {
    if (!this.config.enablePersistence) return;

    try {
      const saved = localStorage.getItem(`cache_${layerName}`);
      if (!saved) return;

      const data = JSON.parse(saved) as Array<[string, CacheEntry]>;
      const layer = this.layers.get(layerName);
      if (!layer) return;

      // Filtrer les entrées expirées
      const now = Date.now();
      for (const [key, entry] of data) {
        if (now - entry.timestamp <= entry.ttl) {
          layer.storage.set(key, entry);
        }
      }

      console.log(`💾 Couche ${layerName} chargée: ${layer.storage.size} entrées`);
    } catch (error) {
      console.warn(`⚠️ Erreur chargement couche ${layerName}:`, error);
    }
  }

  // 📊 MÉTRIQUES ET MONITORING

  /**
   * Mettre à jour les métriques
   */
  private updateMetrics(operation: 'get' | 'set', responseTime: number): void {
    if (!this.config.enableMetrics) return;

    this.metrics.totalSize = this.calculateTotalSize();
    this.metrics.entryCount = Array.from(this.layers.values())
      .reduce((sum, layer) => sum + layer.storage.size, 0);
    
    this.metrics.hitRate = this.metrics.hits / (this.metrics.hits + this.metrics.misses) * 100;
    
    // Moyenne mobile du temps de réponse
    const totalOps = this.metrics.hits + this.metrics.misses;
    this.metrics.averageAccessTime = 
      (this.metrics.averageAccessTime * (totalOps - 1) + responseTime) / totalOps;
  }

  // 🔄 PROCESSUS DE NETTOYAGE

  /**
   * Démarrer le processus de nettoyage automatique
   */
  private startCleanupProcess(): void {
    this.cleanupInterval = setInterval(() => {
      this.performCleanup();
    }, 5 * 60 * 1000); // Toutes les 5 minutes
  }

  /**
   * Effectuer le nettoyage
   */
  private performCleanup(): void {
    let totalCleaned = 0;

    for (const [layerName, layer] of this.layers.entries()) {
      const beforeSize = layer.storage.size;
      
      // Supprimer les entrées expirées
      for (const [key, entry] of layer.storage.entries()) {
        if (this.isExpired(entry)) {
          layer.storage.delete(key);
        }
      }

      const cleaned = beforeSize - layer.storage.size;
      totalCleaned += cleaned;

      if (cleaned > 0 && layer.config.enablePersistence) {
        this.persistLayer(layerName);
      }
    }

    if (totalCleaned > 0) {
      console.log(`🧹 Nettoyage cache: ${totalCleaned} entrées expirées supprimées`);
    }
  }

  // 📊 API PUBLIQUE

  public getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  public getLayerInfo(): Record<string, { size: number; config: Partial<CacheConfig> }> {
    const info: Record<string, any> = {};
    
    for (const [name, layer] of this.layers.entries()) {
      info[name] = {
        size: layer.storage.size,
        config: layer.config
      };
    }
    
    return info;
  }

  public clearLayer(layerName: string): void {
    const layer = this.layers.get(layerName);
    if (layer) {
      layer.storage.clear();
      if (layer.config.enablePersistence) {
        localStorage.removeItem(`cache_${layerName}`);
      }
    }
  }

  public clearAll(): void {
    for (const layerName of this.layers.keys()) {
      this.clearLayer(layerName);
    }
    console.log('🧹 Tous les caches vidés');
  }

  // 🔄 LIFECYCLE

  public initialize(): void {
    // Charger les couches persistantes
    for (const [layerName, layer] of this.layers.entries()) {
      if (layer.config.enablePersistence) {
        this.loadLayer(layerName);
      }
    }
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    // Persister avant destruction
    for (const layerName of this.layers.keys()) {
      this.persistLayer(layerName);
    }
  }
}

// 🎯 INSTANCE GLOBALE
export const notificationCache = NotificationCache.getInstance();

export default NotificationCache;
