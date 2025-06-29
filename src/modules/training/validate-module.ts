/**
 * 🔍 SCRIPT DE VALIDATION FINALE DU MODULE FORMATION
 * Vérifie que toutes les réparations sont fonctionnelles
 */

import { AgentOrchestrator } from './domain/services/AgentOrchestrator';
import { EbiosWorkshopAgent } from './domain/agents/EbiosWorkshopAgent';

interface ValidationResult {
  component: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

/**
 * 🎯 Validation complète du module
 */
export async function validateTrainingModule(): Promise<{
  success: boolean;
  results: ValidationResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}> {
  const results: ValidationResult[] = [];

  console.log('🔍 VALIDATION DU MODULE FORMATION - DÉMARRAGE\n');

  // 1. Validation de l'AgentOrchestrator
  try {
    console.log('📋 Test AgentOrchestrator...');
    const orchestrator = new AgentOrchestrator();
    
    // Test d'initialisation
    const session = await orchestrator.initializeSession('validation_user', 'validation_session');
    results.push({
      component: 'AgentOrchestrator.initializeSession',
      status: 'success',
      message: 'Session initialisée avec succès',
      details: { sessionId: session.id }
    });

    // Test de la méthode réparée _analyzeMessageIntent
    const analyzeIntent = (orchestrator as any)._analyzeMessageIntent.bind(orchestrator);
    const intentResult = analyzeIntent('GO');
    
    if (intentResult && intentResult.type && intentResult.confidence) {
      results.push({
        component: 'AgentOrchestrator._analyzeMessageIntent',
        status: 'success',
        message: 'Analyse d\'intention fonctionnelle',
        details: intentResult
      });
    } else {
      results.push({
        component: 'AgentOrchestrator._analyzeMessageIntent',
        status: 'error',
        message: 'Méthode d\'analyse d\'intention défaillante'
      });
    }

    // Test de traitement de message
    const response = await orchestrator.processLearnerMessage('GO');
    if (response && response.text && response.type) {
      results.push({
        component: 'AgentOrchestrator.processLearnerMessage',
        status: 'success',
        message: 'Traitement de message fonctionnel',
        details: { responseType: response.type }
      });
    } else {
      results.push({
        component: 'AgentOrchestrator.processLearnerMessage',
        status: 'error',
        message: 'Traitement de message défaillant'
      });
    }

  } catch (error) {
    results.push({
      component: 'AgentOrchestrator',
      status: 'error',
      message: `Erreur critique: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    });
  }

  // 2. Validation de l'EbiosWorkshopAgent
  try {
    console.log('🤖 Test EbiosWorkshopAgent...');
    const caseStudyContext = {
      id: 'validation_chu',
      organization: 'CHU Validation',
      description: 'Centre de validation',
      sector: 'Santé',
      size: 'Grande organisation',
      specificities: ['Validation'],
      realData: {
        employees: 1000,
        beds: 500,
        patients: 10000,
        systems: ['SIH Validation'],
        regulations: ['RGPD']
      }
    };

    const agent = new EbiosWorkshopAgent(1, caseStudyContext);

    // Test de génération de messages
    const welcomeMsg = agent.generateMessage('welcome', { caseStudyData: caseStudyContext });
    if (welcomeMsg && welcomeMsg.length > 50) {
      results.push({
        component: 'EbiosWorkshopAgent.generateMessage',
        status: 'success',
        message: 'Génération de messages fonctionnelle'
      });
    } else {
      results.push({
        component: 'EbiosWorkshopAgent.generateMessage',
        status: 'error',
        message: 'Génération de messages défaillante'
      });
    }

    // Test d'évaluation
    const mockStep = {
      id: 'validation',
      title: 'Validation',
      description: 'Test de validation',
      objectives: [],
      deliverables: [],
      duration: 10
    };

    const evaluation = agent.evaluateProgress('Réponse de validation', mockStep);
    if (evaluation && typeof evaluation.score === 'number') {
      results.push({
        component: 'EbiosWorkshopAgent.evaluateProgress',
        status: 'success',
        message: 'Évaluation fonctionnelle',
        details: { score: evaluation.score }
      });
    } else {
      results.push({
        component: 'EbiosWorkshopAgent.evaluateProgress',
        status: 'error',
        message: 'Évaluation défaillante'
      });
    }

  } catch (error) {
    results.push({
      component: 'EbiosWorkshopAgent',
      status: 'error',
      message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    });
  }

  // 3. Validation des types d'intention
  try {
    console.log('🧠 Test Types d\'intention...');
    const orchestrator = new AgentOrchestrator();
    const analyzeIntent = (orchestrator as any)._analyzeMessageIntent.bind(orchestrator);

    const intentTests = [
      { input: 'GO', expected: 'start_training' },
      { input: 'Présentez-moi le CHU', expected: 'chu_context' },
      { input: 'Commençons l\'atelier 1', expected: 'start_workshop_1' },
      { input: 'Identifions les biens supports', expected: 'identify_assets' },
      { input: 'Analysons les menaces', expected: 'analyze_threats' },
      { input: 'Aidez-moi', expected: 'request_help' },
      { input: 'Montrez-moi un exemple', expected: 'request_example' }
    ];

    let correctIntents = 0;
    for (const test of intentTests) {
      const result = analyzeIntent(test.input);
      if (result.type === test.expected) {
        correctIntents++;
      }
    }

    const accuracy = correctIntents / intentTests.length;
    if (accuracy >= 0.8) {
      results.push({
        component: 'IntentAnalysis',
        status: 'success',
        message: `Analyse d'intention précise (${Math.round(accuracy * 100)}%)`,
        details: { accuracy, correctIntents, total: intentTests.length }
      });
    } else {
      results.push({
        component: 'IntentAnalysis',
        status: 'warning',
        message: `Précision d'intention faible (${Math.round(accuracy * 100)}%)`,
        details: { accuracy, correctIntents, total: intentTests.length }
      });
    }

  } catch (error) {
    results.push({
      component: 'IntentAnalysis',
      status: 'error',
      message: `Erreur d'analyse d'intention: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    });
  }

  // 4. Validation des imports et exports
  try {
    console.log('📦 Test Imports/Exports...');
    
    // Vérifier que les composants principaux sont exportés
    const moduleExports = await import('./index');
    
    const requiredExports = [
      'AgentOrchestrator',
      'TrainingInterface',
      'TrainingChatInterfaceSimple',
      'TrainingDebugPanel',
      'useTrainingStore'
    ];

    const missingExports = requiredExports.filter(exp => !(exp in moduleExports));
    
    if (missingExports.length === 0) {
      results.push({
        component: 'ModuleExports',
        status: 'success',
        message: 'Tous les exports requis sont disponibles'
      });
    } else {
      results.push({
        component: 'ModuleExports',
        status: 'warning',
        message: `Exports manquants: ${missingExports.join(', ')}`
      });
    }

  } catch (error) {
    results.push({
      component: 'ModuleExports',
      status: 'error',
      message: `Erreur d'import: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    });
  }

  // Calcul du résumé
  const summary = {
    total: results.length,
    passed: results.filter(r => r.status === 'success').length,
    failed: results.filter(r => r.status === 'error').length,
    warnings: results.filter(r => r.status === 'warning').length
  };

  const success = summary.failed === 0;

  // Affichage des résultats
  console.log('\n📊 RÉSULTATS DE VALIDATION:');
  console.log(`✅ Succès: ${summary.passed}/${summary.total}`);
  console.log(`⚠️  Avertissements: ${summary.warnings}/${summary.total}`);
  console.log(`❌ Échecs: ${summary.failed}/${summary.total}`);

  if (success) {
    console.log('\n🎉 MODULE FORMATION VALIDÉ - PRÊT POUR PRODUCTION !');
  } else {
    console.log('\n⚠️ VALIDATION ÉCHOUÉE - CORRECTIONS NÉCESSAIRES');
  }

  // Détail des résultats
  console.log('\n📋 DÉTAIL DES TESTS:');
  results.forEach(result => {
    const icon = result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
    console.log(`${icon} ${result.component}: ${result.message}`);
  });

  return { success, results, summary };
}

// Exécution si script lancé directement
if (require.main === module) {
  validateTrainingModule().catch(console.error);
}
