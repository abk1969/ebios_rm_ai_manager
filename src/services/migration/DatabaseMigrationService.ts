/**
 * 🗄️ SERVICE MIGRATION BASE DE DONNÉES - ÉVOLUTION AGENTIC
 * Service pour migration progressive des schémas de base de données
 * CRITICITÉ : HIGH - Infrastructure fondamentale pour architecture agentic
 */

import { Firestore, collection, doc, setDoc, deleteDoc, getDocs, writeBatch, limit, query, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface MigrationStep {
  id: string;
  version: string;
  description: string;
  type: 'create_collection' | 'add_field' | 'create_index' | 'data_migration';
  target: string; // collection name
  schema?: any;
  rollback?: () => Promise<void>;
  validate?: () => Promise<boolean>;
}

export interface MigrationResult {
  success: boolean;
  version: string;
  appliedSteps: string[];
  errors: string[];
  duration: number;
  rollbackAvailable: boolean;
}

/**
 * Schémas des nouvelles collections pour l'architecture agentic
 */
export const AGENTIC_SCHEMAS = {
  // Table audit des décisions IA
  decision_audit_trail: {
    fields: {
      id: 'string',
      timestamp: 'timestamp',
      agent_id: 'string',
      agent_name: 'string',
      decision_type: 'string', // 'recommendation', 'analysis', 'validation', 'optimization'
      input_data: 'object',
      output_data: 'object',
      confidence_score: 'number', // 0-1
      reasoning: 'string',
      context: 'object',
      user_id: 'string',
      mission_id: 'string',
      workshop_id: 'string',
      validation_status: 'string', // 'pending', 'approved', 'rejected'
      human_feedback: 'object',
      impact_assessment: 'object',
      compliance_flags: 'array'
    },
    indexes: [
      ['agent_id', 'timestamp'],
      ['mission_id', 'workshop_id'],
      ['user_id', 'timestamp'],
      ['decision_type', 'timestamp']
    ]
  },

  // Gestion des agents IA
  ai_agents: {
    fields: {
      id: 'string',
      name: 'string',
      type: 'string', // 'documentation', 'analysis', 'validation', 'optimization'
      version: 'string',
      status: 'string', // 'active', 'inactive', 'maintenance', 'deprecated'
      capabilities: 'array',
      configuration: 'object',
      performance_metrics: 'object',
      last_health_check: 'timestamp',
      created_at: 'timestamp',
      updated_at: 'timestamp',
      created_by: 'string',
      workshop_specialization: 'array', // [1,2,3,4,5]
      fallback_strategy: 'string',
      circuit_breaker_config: 'object',
      monitoring_config: 'object'
    },
    indexes: [
      ['type', 'status'],
      ['workshop_specialization'],
      ['status', 'last_health_check']
    ]
  },

  // Tâches des agents
  agent_tasks: {
    fields: {
      id: 'string',
      agent_id: 'string',
      task_type: 'string',
      priority: 'string', // 'low', 'medium', 'high', 'critical'
      status: 'string', // 'pending', 'running', 'completed', 'failed', 'cancelled'
      input_data: 'object',
      output_data: 'object',
      error_details: 'object',
      started_at: 'timestamp',
      completed_at: 'timestamp',
      duration_ms: 'number',
      retry_count: 'number',
      max_retries: 'number',
      parent_task_id: 'string',
      mission_id: 'string',
      workshop_id: 'string',
      user_id: 'string',
      context: 'object',
      performance_metrics: 'object'
    },
    indexes: [
      ['agent_id', 'status'],
      ['mission_id', 'workshop_id'],
      ['status', 'priority', 'started_at'],
      ['user_id', 'started_at']
    ]
  },

  // États des workflows EBIOS
  ebios_workflow_states: {
    fields: {
      id: 'string',
      mission_id: 'string',
      workshop_id: 'number', // 1-5
      current_step: 'string',
      step_status: 'string', // 'not_started', 'in_progress', 'completed', 'blocked'
      execution_mode: 'string', // 'legacy', 'hybrid', 'agentic'
      agent_assignments: 'object', // { step: agent_id }
      progress_percentage: 'number', // 0-100
      estimated_completion: 'timestamp',
      blocking_issues: 'array',
      quality_gates: 'object',
      compliance_status: 'object',
      last_updated: 'timestamp',
      updated_by: 'string',
      state_history: 'array',
      rollback_points: 'array'
    },
    indexes: [
      ['mission_id', 'workshop_id'],
      ['execution_mode', 'step_status'],
      ['workshop_id', 'current_step']
    ]
  },

  // Communications inter-agents
  inter_agent_communications: {
    fields: {
      id: 'string',
      from_agent_id: 'string',
      to_agent_id: 'string',
      message_type: 'string', // 'request', 'response', 'notification', 'error'
      protocol: 'string', // 'mcp', 'direct', 'orchestrated'
      payload: 'object',
      correlation_id: 'string',
      conversation_id: 'string',
      timestamp: 'timestamp',
      status: 'string', // 'sent', 'delivered', 'processed', 'failed'
      response_data: 'object',
      processing_time_ms: 'number',
      retry_count: 'number',
      error_details: 'object',
      mission_context: 'object',
      security_context: 'object'
    },
    indexes: [
      ['from_agent_id', 'to_agent_id', 'timestamp'],
      ['conversation_id', 'timestamp'],
      ['correlation_id'],
      ['message_type', 'status']
    ]
  },

  // Métriques de performance agents
  agent_performance_metrics: {
    fields: {
      id: 'string',
      agent_id: 'string',
      metric_type: 'string', // 'response_time', 'accuracy', 'throughput', 'error_rate'
      value: 'number',
      unit: 'string',
      timestamp: 'timestamp',
      context: 'object',
      mission_id: 'string',
      workshop_id: 'string',
      aggregation_period: 'string', // 'real_time', 'hourly', 'daily', 'weekly'
      baseline_value: 'number',
      threshold_config: 'object',
      alert_triggered: 'boolean'
    },
    indexes: [
      ['agent_id', 'metric_type', 'timestamp'],
      ['mission_id', 'timestamp'],
      ['alert_triggered', 'timestamp']
    ]
  },

  // Configuration circuit breakers
  circuit_breaker_states: {
    fields: {
      id: 'string',
      service_name: 'string',
      agent_id: 'string',
      state: 'string', // 'closed', 'open', 'half_open'
      failure_count: 'number',
      success_count: 'number',
      last_failure_time: 'timestamp',
      last_success_time: 'timestamp',
      threshold_config: 'object',
      timeout_duration: 'number',
      recovery_timeout: 'number',
      state_history: 'array',
      monitoring_enabled: 'boolean'
    },
    indexes: [
      ['service_name', 'state'],
      ['agent_id', 'state'],
      ['state', 'last_failure_time']
    ]
  }
};

/**
 * Service de migration de base de données
 */
export class DatabaseMigrationService {
  private db: Firestore;
  private migrationHistory: Map<string, MigrationResult> = new Map();
  private rollbackStack: MigrationStep[] = [];

  constructor() {
    this.db = db;
  }

  /**
   * Exécute toutes les migrations nécessaires pour l'architecture agentic
   */
  async migrateToAgenticArchitecture(): Promise<MigrationResult> {
    const startTime = Date.now();
    const appliedSteps: string[] = [];
    const errors: string[] = [];

    try {
      console.log('🚀 Début migration vers architecture agentic');

      // Étape 1: Création des collections de base
      const coreCollections = [
        'decision_audit_trail',
        'ai_agents',
        'agent_tasks',
        'ebios_workflow_states',
        'inter_agent_communications'
      ];

      for (const collectionName of coreCollections) {
        try {
          await this.createCollectionIfNotExists(collectionName);
          appliedSteps.push(`create_collection_${collectionName}`);
          console.log(`✅ Collection ${collectionName} créée/vérifiée`);
        } catch (error) {
          const errorMsg = `Erreur création collection ${collectionName}: ${error}`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      // Étape 2: Création des collections de monitoring
      const monitoringCollections = [
        'agent_performance_metrics',
        'circuit_breaker_states'
      ];

      for (const collectionName of monitoringCollections) {
        try {
          await this.createCollectionIfNotExists(collectionName);
          appliedSteps.push(`create_collection_${collectionName}`);
          console.log(`✅ Collection monitoring ${collectionName} créée/vérifiée`);
        } catch (error) {
          const errorMsg = `Erreur création collection monitoring ${collectionName}: ${error}`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      // Étape 3: Initialisation des données de base
      try {
        await this.initializeBaseAgents();
        appliedSteps.push('initialize_base_agents');
        console.log('✅ Agents de base initialisés');
      } catch (error) {
        const errorMsg = `Erreur initialisation agents: ${error}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }

      // Étape 4: Configuration circuit breakers
      try {
        await this.initializeCircuitBreakers();
        appliedSteps.push('initialize_circuit_breakers');
        console.log('✅ Circuit breakers initialisés');
      } catch (error) {
        const errorMsg = `Erreur initialisation circuit breakers: ${error}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }

      const duration = Date.now() - startTime;
      const success = errors.length === 0;

      const result: MigrationResult = {
        success,
        version: '1.0.0-agentic',
        appliedSteps,
        errors,
        duration,
        rollbackAvailable: true
      };

      this.migrationHistory.set('agentic-migration', result);

      if (success) {
        console.log(`🎉 Migration agentic terminée avec succès en ${duration}ms`);
      } else {
        console.error(`❌ Migration agentic échouée avec ${errors.length} erreurs`);
      }

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      const result: MigrationResult = {
        success: false,
        version: '1.0.0-agentic',
        appliedSteps,
        errors: [...errors, `Erreur critique: ${error}`],
        duration,
        rollbackAvailable: false
      };

      console.error('💥 Erreur critique lors de la migration:', error);
      return result;
    }
  }

  /**
   * Crée une collection si elle n'existe pas déjà
   */
  private async createCollectionIfNotExists(collectionName: string): Promise<void> {
    try {
      // Vérifier si la collection existe en tentant de lire un document
      const testDocRef = doc(collection(this.db, collectionName), '__test__');

      // Créer un document de test pour initialiser la collection
      await setDoc(testDocRef, {
        __type: 'initialization',
        __created_at: new Date(),
        __schema_version: '1.0.0'
      });

      // Supprimer le document de test
      await deleteDoc(testDocRef);

      console.log(`Collection ${collectionName} initialisée`);
    } catch (error) {
      console.error(`Erreur lors de l'initialisation de ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Initialise les agents de base dans la collection ai_agents
   */
  private async initializeBaseAgents(): Promise<void> {
    const baseAgents = [
      {
        id: 'documentation-agent',
        name: 'Agent Documentation',
        type: 'documentation',
        version: '1.0.0',
        status: 'active',
        capabilities: ['contextual_help', 'tooltip_enhancement', 'guide_generation'],
        configuration: {
          responseTimeout: 5000,
          maxConcurrentTasks: 10,
          fallbackEnabled: true
        },
        performance_metrics: {
          averageResponseTime: 0,
          successRate: 1.0,
          totalRequests: 0
        },
        last_health_check: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'system',
        workshop_specialization: [1, 2, 3, 4, 5],
        fallback_strategy: 'static_content',
        circuit_breaker_config: {
          failureThreshold: 5,
          timeout: 60000,
          resetTimeout: 300000
        },
        monitoring_config: {
          metricsEnabled: true,
          alertThresholds: {
            responseTime: 3000,
            errorRate: 0.1
          }
        }
      },
      {
        id: 'threat-modeling-agent',
        name: 'Agent Modélisation Menaces',
        type: 'analysis',
        version: '1.0.0',
        status: 'active',
        capabilities: ['threat_identification', 'actor_analysis', 'scenario_generation'],
        configuration: {
          responseTimeout: 15000,
          maxConcurrentTasks: 5,
          fallbackEnabled: true
        },
        performance_metrics: {
          averageResponseTime: 0,
          successRate: 1.0,
          totalRequests: 0
        },
        last_health_check: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'system',
        workshop_specialization: [1, 2],
        fallback_strategy: 'manual_analysis',
        circuit_breaker_config: {
          failureThreshold: 3,
          timeout: 120000,
          resetTimeout: 600000
        },
        monitoring_config: {
          metricsEnabled: true,
          alertThresholds: {
            responseTime: 10000,
            errorRate: 0.05
          }
        }
      },
      {
        id: 'scenario-generation-agent',
        name: 'Agent Génération Scénarios',
        type: 'analysis',
        version: '1.0.0',
        status: 'active',
        capabilities: ['scenario_generation', 'strategic_analysis', 'risk_assessment'],
        configuration: {
          responseTimeout: 20000,
          maxConcurrentTasks: 3,
          fallbackEnabled: true
        },
        performance_metrics: {
          averageResponseTime: 0,
          successRate: 1.0,
          totalRequests: 0
        },
        last_health_check: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'system',
        workshop_specialization: [3],
        fallback_strategy: 'template_based',
        circuit_breaker_config: {
          failureThreshold: 3,
          timeout: 180000,
          resetTimeout: 900000
        },
        monitoring_config: {
          metricsEnabled: true,
          alertThresholds: {
            responseTime: 15000,
            errorRate: 0.05
          }
        }
      },
      {
        id: 'cyber-kill-chain-agent',
        name: 'Agent Cyber Kill Chain',
        type: 'analysis',
        version: '1.0.0',
        status: 'active',
        capabilities: ['attack_path_analysis', 'technique_mapping', 'impact_assessment'],
        configuration: {
          responseTimeout: 25000,
          maxConcurrentTasks: 2,
          fallbackEnabled: true
        },
        performance_metrics: {
          averageResponseTime: 0,
          successRate: 1.0,
          totalRequests: 0
        },
        last_health_check: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'system',
        workshop_specialization: [4],
        fallback_strategy: 'mitre_lookup',
        circuit_breaker_config: {
          failureThreshold: 2,
          timeout: 240000,
          resetTimeout: 1200000
        },
        monitoring_config: {
          metricsEnabled: true,
          alertThresholds: {
            responseTime: 20000,
            errorRate: 0.03
          }
        }
      },
      {
        id: 'security-optimization-agent',
        name: 'Agent Optimisation Sécurité',
        type: 'optimization',
        version: '1.0.0',
        status: 'active',
        capabilities: ['control_optimization', 'cost_analysis', 'roi_calculation'],
        configuration: {
          responseTimeout: 30000,
          maxConcurrentTasks: 2,
          fallbackEnabled: true
        },
        performance_metrics: {
          averageResponseTime: 0,
          successRate: 1.0,
          totalRequests: 0
        },
        last_health_check: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'system',
        workshop_specialization: [5],
        fallback_strategy: 'best_practices',
        circuit_breaker_config: {
          failureThreshold: 2,
          timeout: 300000,
          resetTimeout: 1800000
        },
        monitoring_config: {
          metricsEnabled: true,
          alertThresholds: {
            responseTime: 25000,
            errorRate: 0.03
          }
        }
      }
    ];

    const agentsCollection = collection(this.db, 'ai_agents');
    
    for (const agent of baseAgents) {
      try {
        const agentDoc = doc(agentsCollection, agent.id);
        await setDoc(agentDoc, agent);
        console.log(`Agent ${agent.name} initialisé`);
      } catch (error) {
        console.error(`Erreur initialisation agent ${agent.name}:`, error);
        throw error;
      }
    }
  }

  /**
   * Initialise les circuit breakers pour les services critiques
   */
  private async initializeCircuitBreakers(): Promise<void> {
    const circuitBreakers = [
      {
        id: 'agent-orchestrator-cb',
        service_name: 'agent-orchestrator',
        agent_id: 'system',
        state: 'closed',
        failure_count: 0,
        success_count: 0,
        last_failure_time: null,
        last_success_time: new Date(),
        threshold_config: {
          failureThreshold: 5,
          successThreshold: 3,
          timeout: 60000
        },
        timeout_duration: 60000,
        recovery_timeout: 300000,
        state_history: [],
        monitoring_enabled: true
      },
      {
        id: 'mcp-server-cb',
        service_name: 'mcp-server',
        agent_id: 'system',
        state: 'closed',
        failure_count: 0,
        success_count: 0,
        last_failure_time: null,
        last_success_time: new Date(),
        threshold_config: {
          failureThreshold: 3,
          successThreshold: 2,
          timeout: 30000
        },
        timeout_duration: 30000,
        recovery_timeout: 180000,
        state_history: [],
        monitoring_enabled: true
      },
      {
        id: 'legacy-fallback-cb',
        service_name: 'legacy-fallback',
        agent_id: 'system',
        state: 'closed',
        failure_count: 0,
        success_count: 0,
        last_failure_time: null,
        last_success_time: new Date(),
        threshold_config: {
          failureThreshold: 10,
          successThreshold: 5,
          timeout: 120000
        },
        timeout_duration: 120000,
        recovery_timeout: 600000,
        state_history: [],
        monitoring_enabled: true
      }
    ];

    const circuitBreakersCollection = collection(this.db, 'circuit_breaker_states');

    for (const cb of circuitBreakers) {
      try {
        const cbDoc = doc(circuitBreakersCollection, cb.id);
        await setDoc(cbDoc, cb);
        console.log(`Circuit breaker ${cb.service_name} initialisé`);
      } catch (error) {
        console.error(`Erreur initialisation circuit breaker ${cb.service_name}:`, error);
        throw error;
      }
    }
  }

  /**
   * Valide l'intégrité de la migration
   */
  async validateMigration(): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = [];

    try {
      // Vérifier l'existence des collections critiques
      const criticalCollections = [
        'decision_audit_trail',
        'ai_agents',
        'agent_tasks',
        'ebios_workflow_states',
        'inter_agent_communications'
      ];

      for (const collectionName of criticalCollections) {
        try {
          const collectionRef = collection(this.db, collectionName);
          const q = query(collectionRef, limit(1));
          const snapshot = await getDocs(q);
          console.log(`✅ Collection ${collectionName} accessible`);
        } catch (error) {
          issues.push(`Collection ${collectionName} inaccessible: ${error}`);
        }
      }

      // Vérifier l'initialisation des agents
      try {
        const agentsCollection = collection(this.db, 'ai_agents');
        const agentsSnapshot = await getDocs(agentsCollection);
        if (agentsSnapshot.empty) {
          issues.push('Aucun agent initialisé dans la collection ai_agents');
        } else {
          console.log(`✅ ${agentsSnapshot.size} agents initialisés`);
        }
      } catch (error) {
        issues.push(`Erreur vérification agents: ${error}`);
      }

      // Vérifier l'initialisation des circuit breakers
      try {
        const cbCollection = collection(this.db, 'circuit_breaker_states');
        const cbSnapshot = await getDocs(cbCollection);
        if (cbSnapshot.empty) {
          issues.push('Aucun circuit breaker initialisé');
        } else {
          console.log(`✅ ${cbSnapshot.size} circuit breakers initialisés`);
        }
      } catch (error) {
        issues.push(`Erreur vérification circuit breakers: ${error}`);
      }

      const isValid = issues.length === 0;
      
      if (isValid) {
        console.log('🎉 Validation migration réussie');
      } else {
        console.error(`❌ Validation migration échouée: ${issues.length} problèmes détectés`);
      }

      return { isValid, issues };

    } catch (error) {
      issues.push(`Erreur critique validation: ${error}`);
      return { isValid: false, issues };
    }
  }

  /**
   * Rollback de la migration (suppression des collections créées)
   */
  async rollbackMigration(): Promise<MigrationResult> {
    const startTime = Date.now();
    const appliedSteps: string[] = [];
    const errors: string[] = [];

    try {
      console.log('🔄 Début rollback migration agentic');

      // Note: Firebase ne permet pas de supprimer des collections directement
      // On marque les agents comme 'deprecated' et on vide les collections
      
      const collectionsToClean = [
        'decision_audit_trail',
        'agent_tasks',
        'ebios_workflow_states',
        'inter_agent_communications',
        'agent_performance_metrics',
        'circuit_breaker_states'
      ];

      for (const collectionName of collectionsToClean) {
        try {
          await this.cleanCollection(collectionName);
          appliedSteps.push(`clean_collection_${collectionName}`);
          console.log(`✅ Collection ${collectionName} nettoyée`);
        } catch (error) {
          const errorMsg = `Erreur nettoyage collection ${collectionName}: ${error}`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      // Marquer les agents comme deprecated
      try {
        await this.deprecateAgents();
        appliedSteps.push('deprecate_agents');
        console.log('✅ Agents marqués comme deprecated');
      } catch (error) {
        const errorMsg = `Erreur deprecation agents: ${error}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }

      const duration = Date.now() - startTime;
      const success = errors.length === 0;

      const result: MigrationResult = {
        success,
        version: 'rollback-1.0.0',
        appliedSteps,
        errors,
        duration,
        rollbackAvailable: false
      };

      if (success) {
        console.log(`🎉 Rollback terminé avec succès en ${duration}ms`);
      } else {
        console.error(`❌ Rollback échoué avec ${errors.length} erreurs`);
      }

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      const result: MigrationResult = {
        success: false,
        version: 'rollback-1.0.0',
        appliedSteps,
        errors: [...errors, `Erreur critique rollback: ${error}`],
        duration,
        rollbackAvailable: false
      };

      console.error('💥 Erreur critique lors du rollback:', error);
      return result;
    }
  }

  /**
   * Nettoie une collection (supprime tous les documents)
   */
  private async cleanCollection(collectionName: string): Promise<void> {
    const collectionRef = collection(this.db, collectionName);
    const snapshot = await getDocs(collectionRef);

    const batch = writeBatch(this.db);
    snapshot.docs.forEach((docSnapshot) => {
      batch.delete(docSnapshot.ref);
    });

    await batch.commit();
    console.log(`Collection ${collectionName} nettoyée (${snapshot.size} documents supprimés)`);
  }

  /**
   * Marque tous les agents comme deprecated
   */
  private async deprecateAgents(): Promise<void> {
    const agentsCollection = collection(this.db, 'ai_agents');
    const snapshot = await getDocs(agentsCollection);

    const batch = writeBatch(this.db);
    snapshot.docs.forEach((docSnapshot) => {
      batch.update(docSnapshot.ref, {
        status: 'deprecated',
        updated_at: new Date(),
        deprecation_reason: 'Migration rollback'
      });
    });

    await batch.commit();
    console.log(`${snapshot.size} agents marqués comme deprecated`);
  }

  /**
   * Obtient l'historique des migrations
   */
  getMigrationHistory(): Map<string, MigrationResult> {
    return this.migrationHistory;
  }

  /**
   * Vérifie si une migration spécifique a été appliquée
   */
  isMigrationApplied(migrationId: string): boolean {
    const result = this.migrationHistory.get(migrationId);
    return result?.success === true;
  }

  /**
   * Obtient le statut actuel de la base de données
   */
  async getDatabaseStatus(): Promise<{
    collections: string[];
    agentCount: number;
    circuitBreakerCount: number;
    lastMigration?: MigrationResult;
  }> {
    try {
      // Note: Firebase ne permet pas de lister toutes les collections
      // On vérifie les collections connues
      const knownCollections = [
        'decision_audit_trail',
        'ai_agents',
        'agent_tasks',
        'ebios_workflow_states',
        'inter_agent_communications',
        'agent_performance_metrics',
        'circuit_breaker_states'
      ];

      const existingCollections: string[] = [];
      
      for (const collectionName of knownCollections) {
        try {
          const collectionRef = collection(this.db, collectionName);
          const q = query(collectionRef, limit(1));
          const snapshot = await getDocs(q);
          existingCollections.push(collectionName);
        } catch {
          // Collection n'existe pas ou inaccessible
        }
      }

      // Compter les agents
      let agentCount = 0;
      try {
        const agentsCollection = collection(this.db, 'ai_agents');
        const agentsSnapshot = await getDocs(agentsCollection);
        agentCount = agentsSnapshot.size;
      } catch {
        // Collection inaccessible
      }

      // Compter les circuit breakers
      let circuitBreakerCount = 0;
      try {
        const cbCollection = collection(this.db, 'circuit_breaker_states');
        const cbSnapshot = await getDocs(cbCollection);
        circuitBreakerCount = cbSnapshot.size;
      } catch {
        // Collection inaccessible
      }

      // Dernière migration
      const lastMigration = Array.from(this.migrationHistory.values()).pop();

      return {
        collections: existingCollections,
        agentCount,
        circuitBreakerCount,
        lastMigration
      };

    } catch (error) {
      console.error('Erreur obtention statut base de données:', error);
      throw error;
    }
  }
}
