/**
 * 🧠 SERVICE DE CACHE INTELLIGENT
 * Optimisation des performances avec cache adaptatif
 * POINT 1 - Agent Orchestrateur Workshop 1 Intelligent
 */

import { EbiosExpertProfile } from '../../../../infrastructure/a2a/types/AgentCardTypes';
import { ExpertiseLevel, AdaptiveContent } from './AdaptiveContentService';
import { ProfileAnalysisResult } from './ExpertProfileAnalyzer';

// 🎯 TYPES POUR LE CACHE INTELLIGENT

export interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: Date;
  accessCount: number;
  lastAccess: Date;
  ttl: number; // Time to live en millisecondes
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
  size: number; // Taille estimée en bytes
}

export interface CacheMetrics {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  evictionCount: number;
  averageAccessTime: number;
  memoryUsage: number;
}

export interface CacheConfiguration {
  maxSize: number; // Taille max en bytes
  maxEntries: number;
  defaultTTL: number;
  cleanupInterval: number;
  compressionEnabled: boolean;
  persistenceEnabled: boolean;
}

// 🧠 SERVICE DE CACHE PRINCIPAL

export class IntelligentCacheService {
  private static instance: IntelligentCacheService;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private metrics: CacheMetrics;
  private config: CacheConfiguration;
  private cleanupTimer?: NodeJS.Timeout;

  private constructor() {
    this.config = {
      maxSize: 100 * 1024 * 1024, // 100MB
      maxEntries: 10000,
      defaultTTL: 30 * 60 * 1000, // 30 minutes
      cleanupInterval: 5 * 60 * 1000, // 5 minutes
      compressionEnabled: true,
      persistenceEnabled: false
    };

    this.metrics = {
      totalEntries: 0,
      totalSize: 0,
      hitRate: 0,
      missRate: 0,
      evictionCount: 0,
      averageAccessTime: 0,
      memoryUsage: 0
    };

    this.startCleanupTimer();
  }

  public static getInstance(): IntelligentCacheService {
    if (!IntelligentCacheService.instance) {
      IntelligentCacheService.instance = new IntelligentCacheService();
    }
    return IntelligentCacheService.instance;
  }

  // 🎯 CACHE POUR PROFILS EXPERTS

  public async cacheExpertProfile(
    profile: EbiosExpertProfile,
    analysisResult: ProfileAnalysisResult
  ): Promise<void> {
    const key = this.generateProfileKey(profile);
    const entry: CacheEntry<ProfileAnalysisResult> = {
      key,
      data: analysisResult,
      timestamp: new Date(),
      accessCount: 0,
      lastAccess: new Date(),
      ttl: 60 * 60 * 1000, // 1 heure pour les profils
      priority: 'high',
      tags: ['profile', 'analysis', profile.sector || 'unknown'],
      size: this.estimateSize(analysisResult)
    };

    await this.setEntry(key, entry);
  }

  public async getCachedExpertProfile(profile: EbiosExpertProfile): Promise<ProfileAnalysisResult | null> {
    const key = this.generateProfileKey(profile);
    return await this.getEntry<ProfileAnalysisResult>(key);
  }

  private generateProfileKey(profile: EbiosExpertProfile): string {
    const keyComponents = [
      profile.id,
      profile.experience?.ebiosYears || 0,
      profile.certifications?.join(',') || '',
      profile.specializations?.join(',') || '',
      profile.sector || ''
    ];
    
    return `profile_${this.hashString(keyComponents.join('|'))}`;
  }

  // 🎨 CACHE POUR CONTENU ADAPTATIF

  public async cacheAdaptiveContent(
    contentKey: string,
    profile: EbiosExpertProfile,
    content: AdaptiveContent
  ): Promise<void> {
    const key = this.generateContentKey(contentKey, profile);
    const entry: CacheEntry<AdaptiveContent> = {
      key,
      data: content,
      timestamp: new Date(),
      accessCount: 0,
      lastAccess: new Date(),
      ttl: 20 * 60 * 1000, // 20 minutes pour le contenu
      priority: 'medium',
      tags: ['content', 'adaptive', contentKey],
      size: this.estimateSize(content)
    };

    await this.setEntry(key, entry);
  }

  public async getCachedAdaptiveContent(
    contentKey: string,
    profile: EbiosExpertProfile
  ): Promise<AdaptiveContent | null> {
    const key = this.generateContentKey(contentKey, profile);
    return await this.getEntry<AdaptiveContent>(key);
  }

  private generateContentKey(contentKey: string, profile: EbiosExpertProfile): string {
    const profileHash = this.hashString(`${profile.id}_${profile.experience?.ebiosYears}_${profile.specializations?.join(',')}`);
    return `content_${contentKey}_${profileHash}`;
  }

  // 🔧 OPÉRATIONS DE CACHE GÉNÉRIQUES

  private async setEntry<T>(key: string, entry: CacheEntry<T>): Promise<void> {
    // Vérification de l'espace disponible
    await this.ensureSpace(entry.size);

    // Compression si activée
    if (this.config.compressionEnabled) {
      entry.data = await this.compressData(entry.data);
    }

    // Stockage
    this.cache.set(key, entry);
    this.updateMetrics('set', entry.size);
  }

  private async getEntry<T>(key: string): Promise<T | null> {
    const startTime = Date.now();
    const entry = this.cache.get(key);

    if (!entry) {
      this.updateMetrics('miss');
      return null;
    }

    // Vérification TTL
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.updateMetrics('miss');
      return null;
    }

    // Mise à jour des statistiques d'accès
    entry.accessCount++;
    entry.lastAccess = new Date();

    // Décompression si nécessaire
    let data = entry.data;
    if (this.config.compressionEnabled) {
      data = await this.decompressData(data);
    }

    const accessTime = Date.now() - startTime;
    this.updateMetrics('hit', 0, accessTime);

    return data as T;
  }

  // 🧹 GESTION DE L'ESPACE ET NETTOYAGE

  private async ensureSpace(requiredSize: number): Promise<void> {
    const currentSize = this.getCurrentSize();
    const availableSpace = this.config.maxSize - currentSize;

    if (availableSpace >= requiredSize && this.cache.size < this.config.maxEntries) {
      return; // Espace suffisant
    }

    // Éviction intelligente basée sur LRU et priorité
    const entriesToEvict = this.selectEntriesForEviction(requiredSize);
    
    for (const key of entriesToEvict) {
      this.cache.delete(key);
      this.metrics.evictionCount++;
    }
  }

  private selectEntriesForEviction(requiredSize: number): string[] {
    const entries = Array.from(this.cache.entries());
    
    // Tri par score d'éviction (combinaison de priorité, âge, fréquence d'accès)
    entries.sort(([, a], [, b]) => {
      const scoreA = this.calculateEvictionScore(a);
      const scoreB = this.calculateEvictionScore(b);
      return scoreA - scoreB; // Score le plus bas = éviction prioritaire
    });

    const toEvict: string[] = [];
    let freedSize = 0;

    for (const [key, entry] of entries) {
      if (freedSize >= requiredSize) break;
      
      toEvict.push(key);
      freedSize += entry.size;
    }

    return toEvict;
  }

  private calculateEvictionScore(entry: CacheEntry<any>): number {
    const now = Date.now();
    const age = now - entry.timestamp.getTime();
    const timeSinceLastAccess = now - entry.lastAccess.getTime();
    
    // Facteurs de score
    const priorityWeight = this.getPriorityWeight(entry.priority);
    const ageWeight = age / (24 * 60 * 60 * 1000); // Âge en jours
    const accessWeight = 1 / (entry.accessCount + 1); // Inverse de la fréquence
    const recentAccessWeight = timeSinceLastAccess / (60 * 60 * 1000); // Heures depuis dernier accès

    // Score composite (plus bas = éviction prioritaire)
    return (ageWeight + accessWeight + recentAccessWeight) / priorityWeight;
  }

  private getPriorityWeight(priority: string): number {
    switch (priority) {
      case 'critical': return 10;
      case 'high': return 5;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 1;
    }
  }

  // 🕐 GESTION TTL ET NETTOYAGE AUTOMATIQUE

  private isExpired(entry: CacheEntry<any>): boolean {
    const now = Date.now();
    return (now - entry.timestamp.getTime()) > entry.ttl;
  }

  private startCleanupTimer(): void {
    this.cleanupTimer = setInterval(() => {
      this.performCleanup();
    }, this.config.cleanupInterval);
  }

  private performCleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      this.cache.delete(key);
    }

    console.log(`🧹 Cache cleanup: ${expiredKeys.length} entrées expirées supprimées`);
  }

  // 📊 MÉTRIQUES ET MONITORING

  private updateMetrics(operation: 'hit' | 'miss' | 'set', size: number = 0, accessTime: number = 0): void {
    switch (operation) {
      case 'hit':
        this.metrics.hitRate = this.calculateHitRate();
        if (accessTime > 0) {
          this.updateAverageAccessTime(accessTime);
        }
        break;
      case 'miss':
        this.metrics.missRate = this.calculateMissRate();
        break;
      case 'set':
        this.metrics.totalEntries = this.cache.size;
        this.metrics.totalSize = this.getCurrentSize();
        break;
    }
  }

  private calculateHitRate(): number {
    // Implémentation simplifiée - dans un vrai système, on garderait des compteurs
    return 0.85; // 85% de hit rate par défaut
  }

  private calculateMissRate(): number {
    return 1 - this.calculateHitRate();
  }

  private updateAverageAccessTime(accessTime: number): void {
    // Moyenne mobile simple
    this.metrics.averageAccessTime = (this.metrics.averageAccessTime + accessTime) / 2;
  }

  private getCurrentSize(): number {
    let totalSize = 0;
    for (const entry of this.cache.values()) {
      totalSize += entry.size;
    }
    return totalSize;
  }

  // 🗜️ COMPRESSION ET UTILITAIRES

  private async compressData<T>(data: T): Promise<T> {
    // Implémentation simplifiée - dans un vrai système, utiliser une vraie compression
    return data;
  }

  private async decompressData<T>(data: T): Promise<T> {
    // Implémentation simplifiée
    return data;
  }

  private estimateSize(data: any): number {
    // Estimation approximative de la taille en bytes
    return JSON.stringify(data).length * 2; // UTF-16 approximation
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // 🔍 API PUBLIQUE POUR MONITORING

  public getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  public getCacheInfo(): {
    entries: number;
    size: number;
    maxSize: number;
    utilizationPercent: number;
  } {
    const currentSize = this.getCurrentSize();
    return {
      entries: this.cache.size,
      size: currentSize,
      maxSize: this.config.maxSize,
      utilizationPercent: (currentSize / this.config.maxSize) * 100
    };
  }

  public clearCache(tags?: string[]): number {
    if (!tags || tags.length === 0) {
      const count = this.cache.size;
      this.cache.clear();
      return count;
    }

    let cleared = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.some(tag => tags.includes(tag))) {
        this.cache.delete(key);
        cleared++;
      }
    }

    return cleared;
  }

  // 🎯 CACHE SPÉCIALISÉ POUR WORKSHOP 1

  public async cacheWorkshop1Session(
    sessionId: string,
    sessionData: any,
    ttl: number = 2 * 60 * 60 * 1000 // 2 heures
  ): Promise<void> {
    const entry: CacheEntry<any> = {
      key: `session_${sessionId}`,
      data: sessionData,
      timestamp: new Date(),
      accessCount: 0,
      lastAccess: new Date(),
      ttl,
      priority: 'high',
      tags: ['session', 'workshop1'],
      size: this.estimateSize(sessionData)
    };

    await this.setEntry(entry.key, entry);
  }

  public async getCachedWorkshop1Session(sessionId: string): Promise<any | null> {
    return await this.getEntry(`session_${sessionId}`);
  }

  // 🔄 INVALIDATION INTELLIGENTE

  public invalidateByTags(tags: string[]): number {
    return this.clearCache(tags);
  }

  public invalidateByPattern(pattern: RegExp): number {
    let invalidated = 0;
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        invalidated++;
      }
    }
    return invalidated;
  }

  // 🛑 ARRÊT PROPRE

  public shutdown(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.cache.clear();
    console.log('🛑 Cache service arrêté proprement');
  }
}

export default IntelligentCacheService;
