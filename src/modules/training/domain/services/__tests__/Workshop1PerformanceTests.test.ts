/**
 * ⚡ TESTS DE PERFORMANCE WORKSHOP 1
 * Benchmarks et tests de charge pour le système complet
 * POINT 4 - Tests et Validation Complète
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Workshop1MasterAgent } from '../Workshop1MasterAgent';
import { ExpertNotificationService } from '../ExpertNotificationService';
import { NotificationIntegrationService } from '../NotificationIntegrationService';
import { EbiosExpertProfile } from '../../../../../infrastructure/a2a/types/AgentCardTypes';

// 🎯 TYPES POUR LES TESTS DE PERFORMANCE

interface PerformanceBenchmark {
  name: string;
  description: string;
  maxExecutionTime: number; // ms
  maxMemoryUsage: number; // bytes
  minSuccessRate: number; // %
}

interface PerformanceResult {
  benchmark: string;
  executionTime: number;
  memoryUsage: number;
  successRate: number;
  throughput: number; // operations/second
  passed: boolean;
  details: any;
}

interface LoadTestConfig {
  concurrentUsers: number;
  operationsPerUser: number;
  rampUpTime: number; // ms
  testDuration: number; // ms
}

// ⚡ SUITE DE TESTS DE PERFORMANCE

describe('⚡ Workshop 1 - Tests de Performance', () => {
  let masterAgent: Workshop1MasterAgent;
  let expertNotificationService: ExpertNotificationService;
  let integrationService: NotificationIntegrationService;
  let mockUserProfile: EbiosExpertProfile;

  // 🚀 CONFIGURATION

  beforeEach(() => {
    masterAgent = Workshop1MasterAgent.getInstance();
    expertNotificationService = ExpertNotificationService.getInstance();
    integrationService = NotificationIntegrationService.getInstance();

    mockUserProfile = {
      id: 'perf-test-user',
      name: 'Performance Test User',
      role: 'Expert Performance',
      experience: { ebiosYears: 7, totalYears: 10, projectsCompleted: 20 },
      specializations: ['risk_management', 'performance_testing'],
      certifications: ['CISSP', 'ANSSI'],
      sector: 'test',
      organizationType: 'Performance Lab',
      preferredComplexity: 'expert',
      learningStyle: 'analytical'
    };
  });

  afterEach(() => {
    // Nettoyage mémoire
    if (global.gc) {
      global.gc();
    }
  });

  // 📊 BENCHMARKS DE BASE

  describe('📊 Benchmarks de Base', () => {
    const baseBenchmarks: PerformanceBenchmark[] = [
      {
        name: 'session_initialization',
        description: 'Initialisation de session intelligente',
        maxExecutionTime: 2000,
        maxMemoryUsage: 50 * 1024 * 1024, // 50MB
        minSuccessRate: 95
      },
      {
        name: 'content_adaptation',
        description: 'Adaptation de contenu selon expertise',
        maxExecutionTime: 1500,
        maxMemoryUsage: 30 * 1024 * 1024, // 30MB
        minSuccessRate: 98
      },
      {
        name: 'notification_generation',
        description: 'Génération de notification experte',
        maxExecutionTime: 1000,
        maxMemoryUsage: 20 * 1024 * 1024, // 20MB
        minSuccessRate: 99
      },
      {
        name: 'progress_update',
        description: 'Mise à jour de progression',
        maxExecutionTime: 500,
        maxMemoryUsage: 10 * 1024 * 1024, // 10MB
        minSuccessRate: 99
      }
    ];

    baseBenchmarks.forEach(benchmark => {
      it(`devrait respecter le benchmark: ${benchmark.name}`, async () => {
        const result = await runPerformanceBenchmark(benchmark);
        
        expect(result.passed).toBe(true);
        expect(result.executionTime).toBeLessThanOrEqual(benchmark.maxExecutionTime);
        expect(result.memoryUsage).toBeLessThanOrEqual(benchmark.maxMemoryUsage);
        expect(result.successRate).toBeGreaterThanOrEqual(benchmark.minSuccessRate);

        console.log(`⚡ ${benchmark.name}:`, {
          time: `${result.executionTime}ms (max: ${benchmark.maxExecutionTime}ms)`,
          memory: `${Math.round(result.memoryUsage / 1024 / 1024)}MB (max: ${Math.round(benchmark.maxMemoryUsage / 1024 / 1024)}MB)`,
          success: `${result.successRate}% (min: ${benchmark.minSuccessRate}%)`,
          throughput: `${result.throughput} ops/sec`
        });
      });
    });

    // 🔧 FONCTION DE BENCHMARK

    async function runPerformanceBenchmark(benchmark: PerformanceBenchmark): Promise<PerformanceResult> {
      const iterations = 10;
      const results: Array<{ time: number; success: boolean; memory: number }> = [];
      
      for (let i = 0; i < iterations; i++) {
        const startMemory = process.memoryUsage().heapUsed;
        const startTime = Date.now();
        
        try {
          switch (benchmark.name) {
            case 'session_initialization':
              await masterAgent.startIntelligentSession(
                `${mockUserProfile.id}_${i}`,
                { ...mockUserProfile, id: `${mockUserProfile.id}_${i}` }
              );
              break;
              
            case 'content_adaptation':
              const session = await masterAgent.startIntelligentSession(
                `${mockUserProfile.id}_${i}`,
                { ...mockUserProfile, id: `${mockUserProfile.id}_${i}` }
              );
              await masterAgent.getAdaptedContent(session.sessionId, 'test_module');
              break;
              
            case 'notification_generation':
              await expertNotificationService.generateExpertNotification({
                userId: `${mockUserProfile.id}_${i}`,
                userProfile: { ...mockUserProfile, id: `${mockUserProfile.id}_${i}` },
                expertiseLevel: {
                  level: 'expert',
                  score: 85,
                  confidence: 0.9,
                  specializations: ['risk_management'],
                  weakAreas: [],
                  strengths: []
                },
                context: {
                  workshopId: 1,
                  moduleId: 'perf-test',
                  currentStep: 'test',
                  progressPercentage: 50,
                  timeSpent: 30,
                  lastActivity: new Date(),
                  sessionId: `perf-session-${i}`,
                  adaptationsApplied: 1,
                  engagementScore: 80
                },
                trigger: {
                  type: 'performance_test',
                  severity: 'info',
                  data: { iteration: i },
                  autoGenerated: true
                },
                urgency: 'scheduled'
              });
              break;
              
            case 'progress_update':
              const updateSession = await masterAgent.startIntelligentSession(
                `${mockUserProfile.id}_${i}`,
                { ...mockUserProfile, id: `${mockUserProfile.id}_${i}` }
              );
              await masterAgent.updateSessionProgress(updateSession.sessionId, {
                moduleProgress: 75,
                timeSpent: 45
              });
              break;
          }
          
          const endTime = Date.now();
          const endMemory = process.memoryUsage().heapUsed;
          
          results.push({
            time: endTime - startTime,
            success: true,
            memory: endMemory - startMemory
          });
          
        } catch (error) {
          const endTime = Date.now();
          results.push({
            time: endTime - startTime,
            success: false,
            memory: 0
          });
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      const avgTime = results.reduce((sum, r) => sum + r.time, 0) / results.length;
      const maxMemory = Math.max(...results.map(r => r.memory));
      const successRate = (successCount / iterations) * 100;
      const throughput = 1000 / avgTime; // operations per second
      
      return {
        benchmark: benchmark.name,
        executionTime: avgTime,
        memoryUsage: maxMemory,
        successRate,
        throughput,
        passed: avgTime <= benchmark.maxExecutionTime && 
                maxMemory <= benchmark.maxMemoryUsage && 
                successRate >= benchmark.minSuccessRate,
        details: { iterations, results }
      };
    }
  });

  // 🚀 TESTS DE CHARGE

  describe('🚀 Tests de Charge', () => {
    const loadTestConfigs: LoadTestConfig[] = [
      {
        concurrentUsers: 10,
        operationsPerUser: 5,
        rampUpTime: 1000,
        testDuration: 10000
      },
      {
        concurrentUsers: 25,
        operationsPerUser: 3,
        rampUpTime: 2000,
        testDuration: 15000
      },
      {
        concurrentUsers: 50,
        operationsPerUser: 2,
        rampUpTime: 3000,
        testDuration: 20000
      }
    ];

    loadTestConfigs.forEach(config => {
      it(`devrait gérer la charge: ${config.concurrentUsers} utilisateurs`, async () => {
        const result = await runLoadTest(config);
        
        expect(result.successRate).toBeGreaterThan(90);
        expect(result.avgResponseTime).toBeLessThan(5000);
        expect(result.maxResponseTime).toBeLessThan(10000);
        
        console.log(`🚀 Charge ${config.concurrentUsers} utilisateurs:`, {
          success: `${result.successRate}%`,
          avgTime: `${result.avgResponseTime}ms`,
          maxTime: `${result.maxResponseTime}ms`,
          throughput: `${result.throughput} ops/sec`,
          errors: result.errorCount
        });
      }, 30000); // Timeout de 30 secondes
    });

    // 🔧 FONCTION DE TEST DE CHARGE

    async function runLoadTest(config: LoadTestConfig) {
      const results: Array<{ userId: string; time: number; success: boolean; error?: string }> = [];
      const startTime = Date.now();
      
      // Création des utilisateurs virtuels
      const users = Array.from({ length: config.concurrentUsers }, (_, i) => ({
        id: `load-test-user-${i}`,
        profile: { ...mockUserProfile, id: `load-test-user-${i}`, name: `Load Test User ${i}` }
      }));
      
      // Lancement des opérations concurrentes
      const promises = users.map(async (user, index) => {
        // Délai de montée en charge
        await new Promise(resolve => setTimeout(resolve, (index / config.concurrentUsers) * config.rampUpTime));
        
        for (let op = 0; op < config.operationsPerUser; op++) {
          const opStartTime = Date.now();
          
          try {
            // Simulation d'un workflow complet
            const session = await masterAgent.startIntelligentSession(user.id, user.profile);
            
            await masterAgent.updateSessionProgress(session.sessionId, {
              moduleProgress: 50,
              timeSpent: 30
            });
            
            await expertNotificationService.generateExpertNotification({
              userId: user.id,
              userProfile: user.profile,
              expertiseLevel: session.analysisResult.expertiseLevel,
              context: {
                workshopId: 1,
                moduleId: 'load-test',
                currentStep: 'test',
                progressPercentage: 50,
                timeSpent: 30,
                lastActivity: new Date(),
                sessionId: session.sessionId,
                adaptationsApplied: 1,
                engagementScore: 80
              },
              trigger: {
                type: 'load_test',
                severity: 'info',
                data: { operation: op },
                autoGenerated: true
              },
              urgency: 'scheduled'
            });
            
            const opEndTime = Date.now();
            results.push({
              userId: user.id,
              time: opEndTime - opStartTime,
              success: true
            });
            
          } catch (error) {
            const opEndTime = Date.now();
            results.push({
              userId: user.id,
              time: opEndTime - opStartTime,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }
      });
      
      await Promise.all(promises);
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;
      const successRate = (successCount / results.length) * 100;
      const avgResponseTime = results.reduce((sum, r) => sum + r.time, 0) / results.length;
      const maxResponseTime = Math.max(...results.map(r => r.time));
      const throughput = (results.length / totalTime) * 1000; // operations per second
      
      return {
        successRate,
        avgResponseTime,
        maxResponseTime,
        throughput,
        errorCount,
        totalOperations: results.length,
        totalTime,
        results
      };
    }
  });

  // 🧠 TESTS DE MÉMOIRE

  describe('🧠 Tests de Mémoire', () => {
    it('devrait éviter les fuites mémoire', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const iterations = 100;
      
      // Exécution de nombreuses opérations
      for (let i = 0; i < iterations; i++) {
        const session = await masterAgent.startIntelligentSession(
          `memory-test-${i}`,
          { ...mockUserProfile, id: `memory-test-${i}` }
        );
        
        await masterAgent.updateSessionProgress(session.sessionId, {
          moduleProgress: 100,
          timeSpent: 60
        });
        
        await masterAgent.finalizeSession(session.sessionId);
        
        // Nettoyage périodique
        if (i % 20 === 0 && global.gc) {
          global.gc();
        }
      }
      
      // Nettoyage final
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      const memoryIncreasePerOp = memoryIncrease / iterations;
      
      console.log(`🧠 Test mémoire:`, {
        initial: `${Math.round(initialMemory / 1024 / 1024)}MB`,
        final: `${Math.round(finalMemory / 1024 / 1024)}MB`,
        increase: `${Math.round(memoryIncrease / 1024 / 1024)}MB`,
        perOp: `${Math.round(memoryIncreasePerOp / 1024)}KB/op`
      });
      
      // La fuite mémoire ne devrait pas dépasser 1KB par opération
      expect(memoryIncreasePerOp).toBeLessThan(1024);
    }, 60000); // Timeout de 60 secondes

    it('devrait gérer efficacement la mémoire avec notifications multiples', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const notificationCount = 200;
      
      const promises = [];
      for (let i = 0; i < notificationCount; i++) {
        const promise = expertNotificationService.generateExpertNotification({
          userId: `memory-notif-${i}`,
          userProfile: { ...mockUserProfile, id: `memory-notif-${i}` },
          expertiseLevel: {
            level: 'expert',
            score: 85,
            confidence: 0.9,
            specializations: ['risk_management'],
            weakAreas: [],
            strengths: []
          },
          context: {
            workshopId: 1,
            moduleId: 'memory-test',
            currentStep: 'test',
            progressPercentage: 50,
            timeSpent: 30,
            lastActivity: new Date(),
            sessionId: `memory-session-${i}`,
            adaptationsApplied: 1,
            engagementScore: 80
          },
          trigger: {
            type: 'memory_test',
            severity: 'info',
            data: { index: i },
            autoGenerated: true
          },
          urgency: 'scheduled'
        });
        promises.push(promise);
      }
      
      await Promise.all(promises);
      
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      const memoryPerNotification = memoryIncrease / notificationCount;
      
      console.log(`🔔 Test mémoire notifications:`, {
        count: notificationCount,
        increase: `${Math.round(memoryIncrease / 1024 / 1024)}MB`,
        perNotif: `${Math.round(memoryPerNotification / 1024)}KB/notif`
      });
      
      // Chaque notification ne devrait pas consommer plus de 500KB
      expect(memoryPerNotification).toBeLessThan(512 * 1024);
    }, 45000);
  });

  // ⏱️ TESTS DE LATENCE

  describe('⏱️ Tests de Latence', () => {
    it('devrait maintenir une latence faible sous charge', async () => {
      const measurements: number[] = [];
      const targetOperations = 50;
      
      for (let i = 0; i < targetOperations; i++) {
        const startTime = performance.now();
        
        await masterAgent.startIntelligentSession(
          `latency-test-${i}`,
          { ...mockUserProfile, id: `latency-test-${i}` }
        );
        
        const endTime = performance.now();
        measurements.push(endTime - startTime);
      }
      
      const avgLatency = measurements.reduce((sum, m) => sum + m, 0) / measurements.length;
      const p95Latency = measurements.sort((a, b) => a - b)[Math.floor(measurements.length * 0.95)];
      const p99Latency = measurements.sort((a, b) => a - b)[Math.floor(measurements.length * 0.99)];
      
      console.log(`⏱️ Latence:`, {
        avg: `${avgLatency.toFixed(2)}ms`,
        p95: `${p95Latency.toFixed(2)}ms`,
        p99: `${p99Latency.toFixed(2)}ms`
      });
      
      expect(avgLatency).toBeLessThan(2000);
      expect(p95Latency).toBeLessThan(3000);
      expect(p99Latency).toBeLessThan(5000);
    });
  });
});
