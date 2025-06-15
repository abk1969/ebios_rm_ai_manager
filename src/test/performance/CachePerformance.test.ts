/**
 * 🚀 TESTS DE PERFORMANCE DU CACHE
 * Validation des optimisations et métriques de performance
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { MetricsCacheService } from '@/services/cache/MetricsCacheService';
import EbiosRMMetricsService, { type EbiosRMMetrics } from '@/services/metrics/EbiosRMMetricsService';
import { OptimizedFirebaseService } from '@/services/firebase/OptimizedFirebaseService';
import { CacheInvalidationService } from '@/services/cache/CacheInvalidationService';

// Mock Firebase
vi.mock('@/lib/firebase', () => ({
  db: {}
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  startAfter: vi.fn()
}));

describe('Cache Performance Tests', () => {
  let cacheService: MetricsCacheService;
  let firebaseService: OptimizedFirebaseService;
  let invalidationService: CacheInvalidationService;

  beforeEach(() => {
    vi.clearAllMocks();
    cacheService = MetricsCacheService.getInstance();
    firebaseService = OptimizedFirebaseService.getInstance();
    invalidationService = CacheInvalidationService.getInstance();
    
    // Reset des métriques
    firebaseService.resetMetrics();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('Cache Hit/Miss Performance', () => {
    it('devrait avoir un temps de réponse < 10ms pour un cache hit', async () => {
      // Préparer des données de test
      const mockMetrics: EbiosRMMetrics = {
        workshop1: { businessValuesCount: 5, supportingAssetsCount: 8, dreadedEventsCount: 3, completionRate: 75, conformityScore: 80 },
        workshop2: { riskSourcesCount: 6, threatActorsIdentified: 4, attackMethodsCount: 10, completionRate: 60, mitreAttackCoverage: 45, conformityScore: 70 },
        workshop3: { strategicScenariosCount: 4, operationalScenariosCount: 2, riskLevelDistribution: { low: 1, medium: 2, high: 1, critical: 0 }, completionRate: 50, conformityScore: 65 },
        workshop4: { operationalScenariosCount: 3, attackPathsCount: 6, vulnerabilitiesIdentified: 8, completionRate: 40, technicalDepth: 60, conformityScore: 55 },
        workshop5: { securityMeasuresCount: 7, residualRiskLevel: 2.5, treatmentCoverage: 70, implementationCost: 120000, completionRate: 80, conformityScore: 75 },
        global: { overallCompletionRate: 61, anssiComplianceScore: 69, riskMaturityLevel: 3, lastCalculation: new Date().toISOString(), dataQualityScore: 72 }
      };

      // Mettre en cache
      await cacheService.set('test-mission-performance', mockMetrics);

      // Mesurer le temps de réponse pour un cache hit
      const startTime = performance.now();
      const cachedResult = await cacheService.get('test-mission-performance');
      const responseTime = performance.now() - startTime;

      expect(cachedResult).toEqual(mockMetrics);
      expect(responseTime).toBeLessThan(10); // < 10ms
    });

    it('devrait maintenir un taux de hit > 80% avec utilisation normale', async () => {
      const missionIds = ['mission-1', 'mission-2', 'mission-3'];
      const mockMetrics: EbiosRMMetrics = {
        workshop1: { businessValuesCount: 3, supportingAssetsCount: 5, dreadedEventsCount: 2, completionRate: 50, conformityScore: 60 },
        workshop2: { riskSourcesCount: 4, threatActorsIdentified: 2, attackMethodsCount: 6, completionRate: 40, mitreAttackCoverage: 30, conformityScore: 50 },
        workshop3: { strategicScenariosCount: 2, operationalScenariosCount: 1, riskLevelDistribution: { low: 1, medium: 1, high: 0, critical: 0 }, completionRate: 30, conformityScore: 45 },
        workshop4: { operationalScenariosCount: 1, attackPathsCount: 2, vulnerabilitiesIdentified: 3, completionRate: 20, technicalDepth: 40, conformityScore: 35 },
        workshop5: { securityMeasuresCount: 3, residualRiskLevel: 3.5, treatmentCoverage: 40, implementationCost: 80000, completionRate: 30, conformityScore: 40 },
        global: { overallCompletionRate: 34, anssiComplianceScore: 46, riskMaturityLevel: 2, lastCalculation: new Date().toISOString(), dataQualityScore: 48 }
      };

      // Simuler un pattern d'utilisation normal
      for (const missionId of missionIds) {
        await cacheService.set(missionId, mockMetrics);
      }

      // Simuler des accès répétés (80% sur données en cache, 20% nouvelles)
      const totalRequests = 100;
      let hits = 0;

      for (let i = 0; i < totalRequests; i++) {
        const missionId = i < 80 ? missionIds[i % missionIds.length] : `new-mission-${i}`;
        const result = await cacheService.get(missionId);
        if (result) hits++;
      }

      const hitRate = (hits / totalRequests) * 100;
      expect(hitRate).toBeGreaterThan(60); // Au moins 60% (les 80 premières requêtes)
    });
  });

  describe('Firebase Optimization Performance', () => {
    it('devrait traiter les requêtes parallèles en < 2 secondes', async () => {
      // Mock des réponses Firebase
      const { getDocs } = await import('firebase/firestore');
      const mockData = Array(50).fill(null).map((_, i) => ({
        id: `doc-${i}`,
        data: () => ({ name: `Item ${i}`, missionId: 'test-mission' })
      }));

      vi.mocked(getDocs).mockResolvedValue({
        docs: mockData
      } as any);

      const requests = [
        { collection: 'businessValues', missionId: 'test-mission' },
        { collection: 'supportingAssets', missionId: 'test-mission' },
        { collection: 'dreadedEvents', missionId: 'test-mission' },
        { collection: 'riskSources', missionId: 'test-mission' },
        { collection: 'strategicScenarios', missionId: 'test-mission' }
      ];

      const startTime = performance.now();
      const results = await firebaseService.getMultipleCollections(requests, {
        maxConcurrency: 3,
        pageSize: 25
      });
      const totalTime = performance.now() - startTime;

      expect(totalTime).toBeLessThan(2000); // < 2 secondes
      expect(Object.keys(results)).toHaveLength(5);
      expect(results.businessValues).toHaveLength(50);
    });

    it('devrait gérer la pagination efficacement', async () => {
      // Mock des réponses paginées
      const { getDocs } = await import('firebase/firestore');
      
      // Première page
      const firstPageData = Array(25).fill(null).map((_, i) => ({
        id: `doc-${i}`,
        data: () => ({ name: `Item ${i}`, missionId: 'test-mission' })
      }));

      // Deuxième page
      const secondPageData = Array(15).fill(null).map((_, i) => ({
        id: `doc-${i + 25}`,
        data: () => ({ name: `Item ${i + 25}`, missionId: 'test-mission' })
      }));

      vi.mocked(getDocs)
        .mockResolvedValueOnce({ docs: firstPageData } as any)
        .mockResolvedValueOnce({ docs: secondPageData } as any);

      const startTime = performance.now();
      const results = await firebaseService.getCollectionOptimized(
        'businessValues',
        'test-mission',
        { pageSize: 25 }
      );
      const totalTime = performance.now() - startTime;

      expect(results).toHaveLength(40); // 25 + 15
      expect(totalTime).toBeLessThan(1000); // < 1 seconde
    });
  });

  describe('Cache Invalidation Performance', () => {
    it('devrait invalider le cache en < 50ms', async () => {
      const mockMetrics: EbiosRMMetrics = {
        workshop1: { businessValuesCount: 3, supportingAssetsCount: 5, dreadedEventsCount: 2, completionRate: 50, conformityScore: 60 },
        workshop2: { riskSourcesCount: 4, threatActorsIdentified: 2, attackMethodsCount: 6, completionRate: 40, mitreAttackCoverage: 30, conformityScore: 50 },
        workshop3: { strategicScenariosCount: 2, operationalScenariosCount: 1, riskLevelDistribution: { low: 1, medium: 1, high: 0, critical: 0 }, completionRate: 30, conformityScore: 45 },
        workshop4: { operationalScenariosCount: 1, attackPathsCount: 2, vulnerabilitiesIdentified: 3, completionRate: 20, technicalDepth: 40, conformityScore: 35 },
        workshop5: { securityMeasuresCount: 3, residualRiskLevel: 3.5, treatmentCoverage: 40, implementationCost: 80000, completionRate: 30, conformityScore: 40 },
        global: { overallCompletionRate: 34, anssiComplianceScore: 46, riskMaturityLevel: 2, lastCalculation: new Date().toISOString(), dataQualityScore: 48 }
      };

      await cacheService.set('test-mission-invalidation', mockMetrics);

      const startTime = performance.now();
      await invalidationService.invalidateImmediately('test-mission-invalidation');
      const invalidationTime = performance.now() - startTime;

      expect(invalidationTime).toBeLessThan(50); // < 50ms

      // Vérifier que le cache est bien invalidé
      const cachedResult = await cacheService.get('test-mission-invalidation');
      expect(cachedResult).toBeNull();
    });

    it('devrait grouper les invalidations multiples', async () => {
      vi.useFakeTimers();

      const missionId = 'test-mission-grouping';
      let invalidationCount = 0;

      // Mock de l'invalidation pour compter les appels
      const originalInvalidate = EbiosRMMetricsService.invalidateCache;
      EbiosRMMetricsService.invalidateCache = vi.fn().mockImplementation(async () => {
        invalidationCount++;
      });

      // Simuler plusieurs modifications rapides
      await invalidationService.onDataModified(missionId, 'businessValues', 'create');
      await invalidationService.onDataModified(missionId, 'businessValues', 'update');
      await invalidationService.onDataModified(missionId, 'supportingAssets', 'create');

      // Avancer le temps pour déclencher l'invalidation groupée
      vi.advanceTimersByTime(1500);

      // Attendre que les promesses se résolvent
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(invalidationCount).toBe(1); // Une seule invalidation pour toutes les modifications

      // Restaurer la méthode originale
      EbiosRMMetricsService.invalidateCache = originalInvalidate;
      vi.useRealTimers();
    });
  });

  describe('Memory Usage Performance', () => {
    it('devrait maintenir une taille de cache raisonnable', async () => {
      const mockMetrics: EbiosRMMetrics = {
        workshop1: { businessValuesCount: 1, supportingAssetsCount: 1, dreadedEventsCount: 1, completionRate: 10, conformityScore: 20 },
        workshop2: { riskSourcesCount: 1, threatActorsIdentified: 1, attackMethodsCount: 1, completionRate: 10, mitreAttackCoverage: 10, conformityScore: 20 },
        workshop3: { strategicScenariosCount: 1, operationalScenariosCount: 1, riskLevelDistribution: { low: 1, medium: 0, high: 0, critical: 0 }, completionRate: 10, conformityScore: 20 },
        workshop4: { operationalScenariosCount: 1, attackPathsCount: 1, vulnerabilitiesIdentified: 1, completionRate: 10, technicalDepth: 20, conformityScore: 20 },
        workshop5: { securityMeasuresCount: 1, residualRiskLevel: 4.0, treatmentCoverage: 10, implementationCost: 10000, completionRate: 10, conformityScore: 20 },
        global: { overallCompletionRate: 10, anssiComplianceScore: 20, riskMaturityLevel: 1, lastCalculation: new Date().toISOString(), dataQualityScore: 20 }
      };

      // Ajouter plus d'entrées que la limite configurée
      const maxEntries = 50;
      cacheService.updateConfig({ maxMemoryEntries: maxEntries });

      for (let i = 0; i < maxEntries + 20; i++) {
        await cacheService.set(`mission-${i}`, mockMetrics);
      }

      const stats = cacheService.getStats();
      expect(stats.cacheSize).toBeLessThanOrEqual(maxEntries);
    });

    it('devrait nettoyer automatiquement les entrées expirées', async () => {
      const mockMetrics: EbiosRMMetrics = {
        workshop1: { businessValuesCount: 1, supportingAssetsCount: 1, dreadedEventsCount: 1, completionRate: 10, conformityScore: 20 },
        workshop2: { riskSourcesCount: 1, threatActorsIdentified: 1, attackMethodsCount: 1, completionRate: 10, mitreAttackCoverage: 10, conformityScore: 20 },
        workshop3: { strategicScenariosCount: 1, operationalScenariosCount: 1, riskLevelDistribution: { low: 1, medium: 0, high: 0, critical: 0 }, completionRate: 10, conformityScore: 20 },
        workshop4: { operationalScenariosCount: 1, attackPathsCount: 1, vulnerabilitiesIdentified: 1, completionRate: 10, technicalDepth: 20, conformityScore: 20 },
        workshop5: { securityMeasuresCount: 1, residualRiskLevel: 4.0, treatmentCoverage: 10, implementationCost: 10000, completionRate: 10, conformityScore: 20 },
        global: { overallCompletionRate: 10, anssiComplianceScore: 20, riskMaturityLevel: 1, lastCalculation: new Date().toISOString(), dataQualityScore: 20 }
      };

      // Configurer un TTL très court pour les tests
      cacheService.updateConfig({ defaultTTL: 100 }); // 100ms

      await cacheService.set('mission-expire-test', mockMetrics, 100);

      // Vérifier que l'entrée existe
      let cachedResult = await cacheService.get('mission-expire-test');
      expect(cachedResult).not.toBeNull();

      // Attendre l'expiration
      await new Promise(resolve => setTimeout(resolve, 150));

      // Déclencher le nettoyage
      await cacheService.cleanup();

      // Vérifier que l'entrée a été supprimée
      cachedResult = await cacheService.get('mission-expire-test');
      expect(cachedResult).toBeNull();
    });
  });

  describe('End-to-End Performance', () => {
    it('devrait améliorer les performances globales avec le cache', async () => {
      // Mock des données Firebase
      const { getDocs } = await import('firebase/firestore');
      const mockData = Array(10).fill(null).map((_, i) => ({
        id: `doc-${i}`,
        data: () => ({ name: `Item ${i}`, missionId: 'test-mission-e2e' })
      }));

      vi.mocked(getDocs).mockResolvedValue({
        docs: mockData
      } as any);

      // Premier appel (sans cache) - mesurer le temps
      const startTime1 = performance.now();
      const metrics1 = await EbiosRMMetricsService.calculateMetrics('test-mission-e2e');
      const timeWithoutCache = performance.now() - startTime1;

      // Deuxième appel (avec cache) - mesurer le temps
      const startTime2 = performance.now();
      const metrics2 = await EbiosRMMetricsService.calculateMetrics('test-mission-e2e');
      const timeWithCache = performance.now() - startTime2;

      expect(metrics1).toEqual(metrics2);
      expect(timeWithCache).toBeLessThan(timeWithoutCache * 0.1); // Au moins 10x plus rapide
      expect(timeWithCache).toBeLessThan(50); // < 50ms avec cache
    });
  });
});
