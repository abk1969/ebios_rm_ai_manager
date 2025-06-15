/**
 * 🧪 TESTS DU SERVICE MÉTRIQUES EBIOS RM
 * Tests de non-régression et validation ANSSI
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import EbiosRMMetricsService, { type EbiosRMMetrics } from '@/services/metrics/EbiosRMMetricsService';
import MetricsValidationService from '@/services/validation/MetricsValidationService';

// Mock Firebase
vi.mock('@/lib/firebase', () => ({
  db: {}
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn()
}));

describe('EbiosRMMetricsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateMetrics', () => {
    it('devrait retourner des métriques vides pour une mission inexistante', async () => {
      // Mock des collections vides
      const { getDocs } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue({
        docs: []
      } as any);

      const metrics = await EbiosRMMetricsService.calculateMetrics('mission-inexistante');

      expect(metrics).toBeDefined();
      expect(metrics.workshop1.businessValuesCount).toBe(0);
      expect(metrics.workshop1.supportingAssetsCount).toBe(0);
      expect(metrics.workshop1.dreadedEventsCount).toBe(0);
      expect(metrics.workshop1.completionRate).toBe(0);
      expect(metrics.workshop1.conformityScore).toBeGreaterThanOrEqual(0);

      expect(metrics.global.overallCompletionRate).toBe(0);
      expect(metrics.global.anssiComplianceScore).toBeGreaterThanOrEqual(0);
      expect(metrics.global.riskMaturityLevel).toBe(1);
      expect(metrics.global.dataQualityScore).toBe(0);
    });

    it('devrait gérer les erreurs Firebase gracieusement', async () => {
      // Mock d'erreur Firebase
      const { getDocs } = await import('firebase/firestore');
      vi.mocked(getDocs).mockRejectedValue(new Error('Firebase error'));

      const metrics = await EbiosRMMetricsService.calculateMetrics('mission-error');

      expect(metrics).toBeDefined();
      expect(metrics.global.overallCompletionRate).toBe(0);
      expect(metrics.global.anssiComplianceScore).toBeGreaterThanOrEqual(0);
      expect(metrics.global.riskMaturityLevel).toBe(1);
      expect(metrics.global.dataQualityScore).toBe(0);
    });

    it('devrait rejeter les IDs de mission invalides', async () => {
      await expect(EbiosRMMetricsService.calculateMetrics('')).rejects.toThrow('ID de mission invalide');
      await expect(EbiosRMMetricsService.calculateMetrics(null as any)).rejects.toThrow('ID de mission invalide');
      await expect(EbiosRMMetricsService.calculateMetrics(undefined as any)).rejects.toThrow('ID de mission invalide');
    });

    it('devrait calculer correctement les métriques avec des données réelles', async () => {
      // Mock des données de test
      const mockBusinessValues = [
        { id: 'bv1', name: 'Chiffre d\'affaires', description: 'CA principal', priority: 'high', category: 'financial' },
        { id: 'bv2', name: 'Données clients', description: 'Base clients', priority: 'high', category: 'data' },
        { id: 'bv3', name: 'Réputation', description: 'Image de marque', priority: 'medium', category: 'reputation' }
      ];

      const mockSupportingAssets = [
        { id: 'sa1', name: 'Serveur web', type: 'system', securityLevel: 'high', businessValueId: 'bv1' },
        { id: 'sa2', name: 'Base de données', type: 'data', securityLevel: 'critical', businessValueId: 'bv2' },
        { id: 'sa3', name: 'Application mobile', type: 'application', securityLevel: 'medium', businessValueId: 'bv1' },
        { id: 'sa4', name: 'Réseau interne', type: 'network', securityLevel: 'high', businessValueId: 'bv2' },
        { id: 'sa5', name: 'Poste de travail', type: 'system', securityLevel: 'medium', businessValueId: 'bv3' }
      ];

      const mockDreadedEvents = [
        { id: 'de1', name: 'Perte de données', description: 'Fuite de données clients', gravity: 4, businessValueId: 'bv2' },
        { id: 'de2', name: 'Indisponibilité', description: 'Arrêt du service', gravity: 3, businessValueId: 'bv1' }
      ];

      const { getDocs } = await import('firebase/firestore');
      vi.mocked(getDocs)
        .mockResolvedValueOnce({ docs: mockBusinessValues.map(bv => ({ id: bv.id, data: () => bv })) } as any)
        .mockResolvedValueOnce({ docs: mockSupportingAssets.map(sa => ({ id: sa.id, data: () => sa })) } as any)
        .mockResolvedValueOnce({ docs: mockDreadedEvents.map(de => ({ id: de.id, data: () => de })) } as any)
        .mockResolvedValue({ docs: [] } as any); // Autres collections vides

      const metrics = await EbiosRMMetricsService.calculateMetrics('mission-test');

      expect(metrics.workshop1.businessValuesCount).toBe(3);
      expect(metrics.workshop1.supportingAssetsCount).toBe(5);
      expect(metrics.workshop1.dreadedEventsCount).toBe(2);
      expect(metrics.workshop1.completionRate).toBeGreaterThan(0);
      expect(metrics.workshop1.conformityScore).toBeGreaterThan(0);
    });
  });

  describe('Validation des seuils ANSSI', () => {
    it('devrait respecter les minimums ANSSI pour l\'Atelier 1', async () => {
      const mockData = {
        businessValues: Array(3).fill({ name: 'Test', description: 'Test desc', priority: 'high', category: 'test' }),
        supportingAssets: Array(5).fill({ name: 'Test', type: 'system', securityLevel: 'high', businessValueId: 'test' }),
        dreadedEvents: Array(2).fill({ name: 'Test', description: 'Test desc', gravity: 3, businessValueId: 'test' })
      };

      const { getDocs } = await import('firebase/firestore');
      vi.mocked(getDocs)
        .mockResolvedValueOnce({ docs: mockData.businessValues.map((bv, i) => ({ id: `bv${i}`, data: () => bv })) } as any)
        .mockResolvedValueOnce({ docs: mockData.supportingAssets.map((sa, i) => ({ id: `sa${i}`, data: () => sa })) } as any)
        .mockResolvedValueOnce({ docs: mockData.dreadedEvents.map((de, i) => ({ id: `de${i}`, data: () => de })) } as any)
        .mockResolvedValue({ docs: [] } as any);

      const metrics = await EbiosRMMetricsService.calculateMetrics('mission-anssi-test');

      expect(metrics.workshop1.businessValuesCount).toBeGreaterThanOrEqual(3);
      expect(metrics.workshop1.supportingAssetsCount).toBeGreaterThanOrEqual(5);
      expect(metrics.workshop1.dreadedEventsCount).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Calculs de conformité', () => {
    it('devrait calculer correctement les scores de conformité', async () => {
      const { getDocs } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValue({ docs: [] } as any);

      const metrics = await EbiosRMMetricsService.calculateMetrics('mission-conformity-test');

      expect(metrics.workshop1.conformityScore).toBeGreaterThanOrEqual(0);
      expect(metrics.workshop1.conformityScore).toBeLessThanOrEqual(100);
      expect(metrics.workshop2.conformityScore).toBeGreaterThanOrEqual(0);
      expect(metrics.workshop2.conformityScore).toBeLessThanOrEqual(100);
      expect(metrics.workshop3.conformityScore).toBeGreaterThanOrEqual(0);
      expect(metrics.workshop3.conformityScore).toBeLessThanOrEqual(100);
      expect(metrics.workshop4.conformityScore).toBeGreaterThanOrEqual(0);
      expect(metrics.workshop4.conformityScore).toBeLessThanOrEqual(100);
      expect(metrics.workshop5.conformityScore).toBeGreaterThanOrEqual(0);
      expect(metrics.workshop5.conformityScore).toBeLessThanOrEqual(100);
    });
  });
});

describe('MetricsValidationService', () => {
  describe('validateMetrics', () => {
    it('devrait valider des métriques vides sans erreur critique', () => {
      const emptyMetrics: EbiosRMMetrics = {
        workshop1: { businessValuesCount: 0, supportingAssetsCount: 0, dreadedEventsCount: 0, completionRate: 0, conformityScore: 0 },
        workshop2: { riskSourcesCount: 0, threatActorsIdentified: 0, attackMethodsCount: 0, completionRate: 0, mitreAttackCoverage: 0, conformityScore: 0 },
        workshop3: { strategicScenariosCount: 0, operationalScenariosCount: 0, riskLevelDistribution: { low: 0, medium: 0, high: 0, critical: 0 }, completionRate: 0, conformityScore: 0 },
        workshop4: { operationalScenariosCount: 0, attackPathsCount: 0, vulnerabilitiesIdentified: 0, completionRate: 0, technicalDepth: 0, conformityScore: 0 },
        workshop5: { securityMeasuresCount: 0, residualRiskLevel: 4.0, treatmentCoverage: 0, implementationCost: 0, completionRate: 0, conformityScore: 0 },
        global: { overallCompletionRate: 0, anssiComplianceScore: 0, riskMaturityLevel: 1, lastCalculation: new Date().toISOString(), dataQualityScore: 0 }
      };

      const validation = MetricsValidationService.validateMetrics(emptyMetrics);

      expect(validation).toBeDefined();
      expect(validation.score).toBeGreaterThanOrEqual(0);
      expect(validation.score).toBeLessThanOrEqual(100);
      expect(Array.isArray(validation.errors)).toBe(true);
      expect(Array.isArray(validation.warnings)).toBe(true);
    });

    it('devrait détecter les violations de séquentialité ANSSI', () => {
      const invalidMetrics: EbiosRMMetrics = {
        workshop1: { businessValuesCount: 2, supportingAssetsCount: 3, dreadedEventsCount: 1, completionRate: 50, conformityScore: 60 },
        workshop2: { riskSourcesCount: 3, threatActorsIdentified: 2, attackMethodsCount: 5, completionRate: 80, mitreAttackCoverage: 30, conformityScore: 70 },
        workshop3: { strategicScenariosCount: 2, operationalScenariosCount: 1, riskLevelDistribution: { low: 1, medium: 1, high: 0, critical: 0 }, completionRate: 60, conformityScore: 65 },
        workshop4: { operationalScenariosCount: 1, attackPathsCount: 2, vulnerabilitiesIdentified: 3, completionRate: 40, technicalDepth: 25, conformityScore: 50 },
        workshop5: { securityMeasuresCount: 2, residualRiskLevel: 3.5, treatmentCoverage: 40, implementationCost: 50000, completionRate: 30, conformityScore: 45 },
        global: { overallCompletionRate: 52, anssiComplianceScore: 58, riskMaturityLevel: 2, lastCalculation: new Date().toISOString(), dataQualityScore: 55 }
      };

      const validation = MetricsValidationService.validateMetrics(invalidMetrics);

      const sequentialityErrors = validation.errors.filter(e => e.code === 'SEQUENTIALITY_VIOLATION');
      expect(sequentialityErrors.length).toBeGreaterThan(0);
    });

    it('devrait valider des métriques conformes ANSSI', () => {
      const validMetrics: EbiosRMMetrics = {
        workshop1: { businessValuesCount: 5, supportingAssetsCount: 8, dreadedEventsCount: 6, completionRate: 100, conformityScore: 85 },
        workshop2: { riskSourcesCount: 7, threatActorsIdentified: 4, attackMethodsCount: 12, completionRate: 100, mitreAttackCoverage: 45, conformityScore: 80 },
        workshop3: { strategicScenariosCount: 5, operationalScenariosCount: 3, riskLevelDistribution: { low: 1, medium: 2, high: 1, critical: 1 }, completionRate: 100, conformityScore: 82 },
        workshop4: { operationalScenariosCount: 4, attackPathsCount: 8, vulnerabilitiesIdentified: 6, completionRate: 100, technicalDepth: 75, conformityScore: 78 },
        workshop5: { securityMeasuresCount: 8, residualRiskLevel: 2.2, treatmentCoverage: 85, implementationCost: 150000, completionRate: 100, conformityScore: 83 },
        global: { overallCompletionRate: 100, anssiComplianceScore: 82, riskMaturityLevel: 4, lastCalculation: new Date().toISOString(), dataQualityScore: 88 }
      };

      const validation = MetricsValidationService.validateMetrics(validMetrics);

      expect(validation.isValid).toBe(true);
      expect(validation.score).toBeGreaterThan(80);
      const criticalErrors = validation.errors.filter(e => e.severity === 'critical');
      expect(criticalErrors.length).toBe(0);
    });
  });
});
