/**
 * 🧪 TESTS AVEC DONNÉES RÉELLES - SERVICE MÉTRIQUES EBIOS RM
 * Tests utilisant de vraies données Firebase (pas de mocks)
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import EbiosRMMetricsService, { type EbiosRMMetrics } from '@/services/metrics/EbiosRMMetricsService';
import { MetricsValidationService } from '@/services/validation/MetricsValidationService';
import { RealTestDataService } from '@/services/test-data/RealTestDataService';
import { FirebaseTestUtils } from '@/config/firebase.test';

describe('🔥 EbiosRMMetricsService avec données réelles', () => {
  let testDataService: RealTestDataService;
  let testMissionId: string;

  beforeAll(async () => {
    // Vérifier la connexion Firebase
    const isConnected = await FirebaseTestUtils.checkConnection();
    if (!isConnected) {
      throw new Error('❌ Impossible de se connecter à Firebase pour les tests');
    }
    
    // console.log supprimé;
    testDataService = RealTestDataService.getInstance();
  });

  beforeEach(async () => {
    // Créer une mission de test avec des données réelles
    testMissionId = await testDataService.createTestMission('Mission Test Métriques Réelles');
    // console.log supprimé;
  });

  afterAll(async () => {
    // Nettoyer toutes les données de test
    if (testMissionId) {
      await testDataService.deleteTestMission(testMissionId);
    }
    await testDataService.cleanupAllTestData();
    // console.log supprimé;
  });

  describe('📊 Calculs de métriques avec données réelles', () => {
    it('devrait calculer correctement les métriques Atelier 1 avec données réelles', async () => {
      const metrics = await EbiosRMMetricsService.calculateMetrics(testMissionId);

      // Vérifications Atelier 1
      expect(metrics.workshop1.businessValuesCount).toBeGreaterThanOrEqual(3); // Minimum ANSSI
      expect(metrics.workshop1.supportingAssetsCount).toBeGreaterThanOrEqual(5); // Minimum ANSSI
      expect(metrics.workshop1.dreadedEventsCount).toBeGreaterThanOrEqual(2); // Minimum ANSSI
      expect(metrics.workshop1.completionRate).toBeGreaterThan(0);
      expect(metrics.workshop1.conformityScore).toBeGreaterThan(0);

      console.log('📈 Métriques Atelier 1:', {
        businessValues: metrics.workshop1.businessValuesCount,
        supportingAssets: metrics.workshop1.supportingAssetsCount,
        dreadedEvents: metrics.workshop1.dreadedEventsCount,
        completion: metrics.workshop1.completionRate,
        conformity: metrics.workshop1.conformityScore
      });
    });

    it('devrait calculer correctement les métriques Atelier 2 avec données réelles', async () => {
      const metrics = await EbiosRMMetricsService.calculateMetrics(testMissionId);

      // Vérifications Atelier 2
      expect(metrics.workshop2.riskSourcesCount).toBeGreaterThanOrEqual(1);
      expect(metrics.workshop2.threatActorsIdentified).toBeGreaterThanOrEqual(0);
      expect(metrics.workshop2.attackMethodsCount).toBeGreaterThanOrEqual(0);
      expect(metrics.workshop2.completionRate).toBeGreaterThanOrEqual(0);
      expect(metrics.workshop2.conformityScore).toBeGreaterThanOrEqual(0);

      console.log('📈 Métriques Atelier 2:', {
        riskSources: metrics.workshop2.riskSourcesCount,
        threatActors: metrics.workshop2.threatActorsIdentified,
        attackMethods: metrics.workshop2.attackMethodsCount,
        completion: metrics.workshop2.completionRate,
        conformity: metrics.workshop2.conformityScore
      });
    });

    it('devrait calculer correctement les métriques Atelier 3 avec données réelles', async () => {
      const metrics = await EbiosRMMetricsService.calculateMetrics(testMissionId);

      // Vérifications Atelier 3
      expect(metrics.workshop3.strategicScenariosCount).toBeGreaterThanOrEqual(0);
      expect(metrics.workshop3.operationalScenariosCount).toBeGreaterThanOrEqual(0);
      expect(metrics.workshop3.completionRate).toBeGreaterThanOrEqual(0);
      expect(metrics.workshop3.conformityScore).toBeGreaterThanOrEqual(0);

      // Vérification de la distribution des risques
      const riskDistribution = metrics.workshop3.riskLevelDistribution;
      expect(riskDistribution.low).toBeGreaterThanOrEqual(0);
      expect(riskDistribution.medium).toBeGreaterThanOrEqual(0);
      expect(riskDistribution.high).toBeGreaterThanOrEqual(0);
      expect(riskDistribution.critical).toBeGreaterThanOrEqual(0);

      console.log('📈 Métriques Atelier 3:', {
        strategicScenarios: metrics.workshop3.strategicScenariosCount,
        operationalScenarios: metrics.workshop3.operationalScenariosCount,
        riskDistribution,
        completion: metrics.workshop3.completionRate,
        conformity: metrics.workshop3.conformityScore
      });
    });

    it('devrait calculer correctement les métriques globales avec données réelles', async () => {
      const metrics = await EbiosRMMetricsService.calculateMetrics(testMissionId);

      // Vérifications globales
      expect(metrics.global.overallCompletionRate).toBeGreaterThanOrEqual(0);
      expect(metrics.global.overallCompletionRate).toBeLessThanOrEqual(100);
      expect(metrics.global.anssiComplianceScore).toBeGreaterThanOrEqual(0);
      expect(metrics.global.anssiComplianceScore).toBeLessThanOrEqual(100);
      expect(metrics.global.riskMaturityLevel).toBeGreaterThanOrEqual(1);
      expect(metrics.global.riskMaturityLevel).toBeLessThanOrEqual(5);
      expect(metrics.global.dataQualityScore).toBeGreaterThanOrEqual(0);
      expect(metrics.global.dataQualityScore).toBeLessThanOrEqual(100);

      console.log('📈 Métriques Globales:', {
        completion: metrics.global.overallCompletionRate,
        anssiCompliance: metrics.global.anssiComplianceScore,
        maturity: metrics.global.riskMaturityLevel,
        dataQuality: metrics.global.dataQualityScore
      });
    });
  });

  describe('🔍 Validation ANSSI avec données réelles', () => {
    it('devrait respecter les seuils minimums ANSSI', async () => {
      const metrics = await EbiosRMMetricsService.calculateMetrics(testMissionId);

      // Seuils minimums ANSSI pour Atelier 1
      expect(metrics.workshop1.businessValuesCount).toBeGreaterThanOrEqual(3);
      expect(metrics.workshop1.supportingAssetsCount).toBeGreaterThanOrEqual(5);
      expect(metrics.workshop1.dreadedEventsCount).toBeGreaterThanOrEqual(2);

      // Score de conformité ANSSI global
      expect(metrics.global.anssiComplianceScore).toBeGreaterThan(0);

      console.log('✅ Validation ANSSI:', {
        businessValuesOK: metrics.workshop1.businessValuesCount >= 3,
        supportingAssetsOK: metrics.workshop1.supportingAssetsCount >= 5,
        dreadedEventsOK: metrics.workshop1.dreadedEventsCount >= 2,
        anssiScore: metrics.global.anssiComplianceScore
      });
    });

    it('devrait valider la cohérence des données avec le service de validation', async () => {
      const metrics = await EbiosRMMetricsService.calculateMetrics(testMissionId);
      const validation = MetricsValidationService.validateMetrics(metrics);

      expect(validation).toBeDefined();
      expect(validation.score).toBeGreaterThanOrEqual(0);
      expect(validation.score).toBeLessThanOrEqual(100);
      expect(Array.isArray(validation.errors)).toBe(true);
      expect(Array.isArray(validation.warnings)).toBe(true);

      // Afficher les erreurs et warnings pour debug
      if (validation.errors.length > 0) {
        console.log('⚠️ Erreurs de validation:', validation.errors);
      }
      if (validation.warnings.length > 0) {
        console.log('💡 Warnings de validation:', validation.warnings);
      }

      console.log('📊 Score de validation:', validation.score);
    });
  });

  describe('⚡ Performance avec données réelles', () => {
    it('devrait calculer les métriques en moins de 5 secondes', async () => {
      const startTime = Date.now();
      
      const metrics = await EbiosRMMetricsService.calculateMetrics(testMissionId);
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(5000); // Moins de 5 secondes
      expect(metrics).toBeDefined();

      console.log(`⚡ Calcul des métriques en ${duration}ms`);
    });

    it('devrait gérer les calculs multiples simultanés', async () => {
      const startTime = Date.now();

      // Lancer 3 calculs en parallèle
      const promises = [
        EbiosRMMetricsService.calculateMetrics(testMissionId),
        EbiosRMMetricsService.calculateMetrics(testMissionId),
        EbiosRMMetricsService.calculateMetrics(testMissionId)
      ];

      const results = await Promise.all(promises);
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      // Tous les résultats doivent être identiques
      expect(results[0]).toEqual(results[1]);
      expect(results[1]).toEqual(results[2]);

      // Performance acceptable même avec calculs multiples
      expect(duration).toBeLessThan(10000); // Moins de 10 secondes

      console.log(`⚡ 3 calculs parallèles en ${duration}ms`);
    });
  });

  describe('🔄 Gestion d\'erreurs avec données réelles', () => {
    it('devrait gérer gracieusement une mission inexistante', async () => {
      const metrics = await EbiosRMMetricsService.calculateMetrics('mission-inexistante-12345');

      expect(metrics).toBeDefined();
      expect(metrics.workshop1.businessValuesCount).toBe(0);
      expect(metrics.workshop1.supportingAssetsCount).toBe(0);
      expect(metrics.workshop1.dreadedEventsCount).toBe(0);
      expect(metrics.global.overallCompletionRate).toBe(0);
    });

    it('devrait rejeter les IDs de mission invalides', async () => {
      await expect(EbiosRMMetricsService.calculateMetrics('')).rejects.toThrow('ID de mission invalide');
      await expect(EbiosRMMetricsService.calculateMetrics(null as any)).rejects.toThrow('ID de mission invalide');
      await expect(EbiosRMMetricsService.calculateMetrics(undefined as any)).rejects.toThrow('ID de mission invalide');
    });
  });

  describe('📈 Qualité des données réelles', () => {
    it('devrait avoir des données cohérentes entre les ateliers', async () => {
      const metrics = await EbiosRMMetricsService.calculateMetrics(testMissionId);

      // Les biens essentiels doivent être liés aux biens supports
      if (metrics.workshop1.businessValuesCount > 0) {
        expect(metrics.workshop1.supportingAssetsCount).toBeGreaterThan(0);
      }

      // Les événements redoutés doivent être liés aux biens essentiels
      if (metrics.workshop1.dreadedEventsCount > 0) {
        expect(metrics.workshop1.businessValuesCount).toBeGreaterThan(0);
      }

      console.log('🔗 Cohérence des données validée');
    });

    it('devrait avoir un score de qualité des données acceptable', async () => {
      const metrics = await EbiosRMMetricsService.calculateMetrics(testMissionId);

      // Score de qualité des données doit être > 50% pour des données de test bien structurées
      expect(metrics.global.dataQualityScore).toBeGreaterThan(50);

      console.log(`📊 Score de qualité des données: ${metrics.global.dataQualityScore}%`);
    });
  });
});

describe('🧪 Tests de non-régression avec données réelles', () => {
  let testDataService: RealTestDataService;

  beforeAll(async () => {
    testDataService = RealTestDataService.getInstance();
  });

  it('devrait maintenir la compatibilité avec les versions précédentes', async () => {
    // Créer une mission avec structure de données legacy
    const missionId = await testDataService.createTestMission('Mission Legacy Test');

    try {
      const metrics = await EbiosRMMetricsService.calculateMetrics(missionId);

      // Vérifier que toutes les propriétés attendues sont présentes
      expect(metrics.workshop1).toBeDefined();
      expect(metrics.workshop2).toBeDefined();
      expect(metrics.workshop3).toBeDefined();
      expect(metrics.workshop4).toBeDefined();
      expect(metrics.workshop5).toBeDefined();
      expect(metrics.global).toBeDefined();

      // Vérifier les propriétés critiques
      expect(typeof metrics.global.anssiComplianceScore).toBe('number');
      expect(typeof metrics.global.overallCompletionRate).toBe('number');
      expect(typeof metrics.global.riskMaturityLevel).toBe('number');

      console.log('✅ Compatibilité backward maintenue');
    } finally {
      await testDataService.deleteTestMission(missionId);
    }
  });
});
