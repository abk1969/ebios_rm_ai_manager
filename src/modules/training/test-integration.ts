/**
 * 🧪 SCRIPT DE TEST D'INTÉGRATION DU MODULE FORMATION
 * Vérifie que tous les composants du module fonctionnent ensemble
 */

import { AgentOrchestrator } from './domain/services/AgentOrchestrator';
import { EbiosWorkshopAgent } from './domain/agents/EbiosWorkshopAgent';

/**
 * 🎯 Test de l'orchestrateur d'agents
 */
async function testAgentOrchestrator() {
  console.log('🧪 Test AgentOrchestrator...');
  
  try {
    const orchestrator = new AgentOrchestrator();
    
    // Test d'initialisation de session
    const session = await orchestrator.initializeSession('test_user', 'test_session');
    console.log('✅ Session initialisée:', session.id);
    
    // Test du message d'accueil
    const welcomeMessage = orchestrator.getWelcomeMessage();
    console.log('✅ Message d\'accueil généré');
    
    // Test de démarrage d'atelier
    const workshopMessage = orchestrator.startWorkshop(1);
    console.log('✅ Atelier 1 démarré');
    
    // Test de traitement de message
    const response = await orchestrator.processLearnerMessage('GO');
    console.log('✅ Message traité:', response.type);
    
    // Test du statut de session
    const status = orchestrator.getSessionStatus();
    console.log('✅ Statut récupéré:', status.currentWorkshop);
    
    console.log('🎉 AgentOrchestrator - TOUS LES TESTS PASSÉS');
    return true;
  } catch (error) {
    console.error('❌ Erreur AgentOrchestrator:', error);
    return false;
  }
}

/**
 * 🎯 Test de l'agent EBIOS
 */
function testEbiosWorkshopAgent() {
  console.log('🧪 Test EbiosWorkshopAgent...');
  
  try {
    const caseStudyContext = {
      id: 'test_chu',
      organization: 'CHU Test',
      description: 'Centre de test',
      sector: 'Santé',
      size: 'Grande organisation',
      specificities: ['Test'],
      realData: {
        employees: 1000,
        beds: 500,
        patients: 10000,
        systems: ['SIH Test'],
        regulations: ['RGPD']
      }
    };
    
    const agent = new EbiosWorkshopAgent(1, caseStudyContext);
    
    // Test de génération de message d'accueil
    const welcomeMsg = agent.generateMessage('welcome', { caseStudyData: caseStudyContext });
    console.log('✅ Message d\'accueil généré');
    
    // Test de génération de message de guidage
    const guidanceMsg = agent.generateMessage('guidance', { 
      userInput: 'Comment commencer ?',
      caseStudyData: caseStudyContext 
    });
    console.log('✅ Message de guidage généré');
    
    // Test d'évaluation de progression
    const mockStep = {
      id: 'test',
      title: 'Test',
      description: 'Test',
      objectives: [],
      deliverables: [],
      duration: 10
    };
    
    const evaluation = agent.evaluateProgress('Ma réponse test', mockStep);
    console.log('✅ Évaluation effectuée:', evaluation.score);
    
    // Test de prochaine action
    const mockProgress = {
      currentStep: 0,
      completedSteps: [],
      validatedDeliverables: [],
      score: 75,
      timeSpent: 30
    };
    
    const nextAction = agent.getNextAction(mockProgress);
    console.log('✅ Prochaine action générée:', nextAction.type);
    
    console.log('🎉 EbiosWorkshopAgent - TOUS LES TESTS PASSÉS');
    return true;
  } catch (error) {
    console.error('❌ Erreur EbiosWorkshopAgent:', error);
    return false;
  }
}

/**
 * 🎯 Test de l'analyse d'intention
 */
function testMessageIntentAnalysis() {
  console.log('🧪 Test Analyse d\'intention...');
  
  try {
    const orchestrator = new AgentOrchestrator();
    
    // Accès à la méthode privée pour les tests (hack TypeScript)
    const analyzeIntent = (orchestrator as any)._analyzeMessageIntent.bind(orchestrator);
    
    // Test de différents types de messages
    const testMessages = [
      { message: 'GO', expectedType: 'start_training' },
      { message: 'Présentez-moi le CHU', expectedType: 'chu_context' },
      { message: 'Identifions les biens supports', expectedType: 'identify_assets' },
      { message: 'Analysons les menaces', expectedType: 'analyze_threats' },
      { message: 'Aidez-moi', expectedType: 'request_help' },
      { message: 'Montrez-moi un exemple', expectedType: 'request_example' },
      { message: 'Quelle est ma progression ?', expectedType: 'evaluate_progress' },
      { message: 'Comment faire ?', expectedType: 'question' }
    ];
    
    let passedTests = 0;
    
    testMessages.forEach(({ message, expectedType }) => {
      const result = analyzeIntent(message);
      if (result.type === expectedType) {
        console.log(`✅ "${message}" -> ${result.type} (confiance: ${result.confidence})`);
        passedTests++;
      } else {
        console.log(`❌ "${message}" -> ${result.type} (attendu: ${expectedType})`);
      }
    });
    
    console.log(`🎉 Analyse d'intention - ${passedTests}/${testMessages.length} tests passés`);
    return passedTests === testMessages.length;
  } catch (error) {
    console.error('❌ Erreur Analyse d\'intention:', error);
    return false;
  }
}

/**
 * 🎯 Test de génération de réponses contextuelles
 */
async function testContextualResponses() {
  console.log('🧪 Test Réponses contextuelles...');
  
  try {
    const orchestrator = new AgentOrchestrator();
    await orchestrator.initializeSession('test_user', 'test_session');
    
    const testScenarios = [
      'GO',
      'Présentez-moi le CHU',
      'Commençons l\'atelier 1',
      'Identifions les biens supports',
      'Quelles sont les menaces ?',
      'J\'ai besoin d\'aide',
      'Montrez-moi un exemple',
      'Quelle est ma progression ?'
    ];
    
    let successCount = 0;
    
    for (const message of testScenarios) {
      try {
        const response = await orchestrator.processLearnerMessage(message);
        
        if (response && response.text && response.type) {
          console.log(`✅ "${message}" -> ${response.type}`);
          successCount++;
        } else {
          console.log(`❌ "${message}" -> Réponse invalide`);
        }
      } catch (error) {
        console.log(`❌ "${message}" -> Erreur: ${error}`);
      }
    }
    
    console.log(`🎉 Réponses contextuelles - ${successCount}/${testScenarios.length} tests passés`);
    return successCount === testScenarios.length;
  } catch (error) {
    console.error('❌ Erreur Réponses contextuelles:', error);
    return false;
  }
}

/**
 * 🎯 Exécution de tous les tests
 */
export async function runAllTests() {
  console.log('🚀 DÉMARRAGE DES TESTS D\'INTÉGRATION DU MODULE FORMATION\n');
  
  const results = {
    orchestrator: await testAgentOrchestrator(),
    agent: testEbiosWorkshopAgent(),
    intentAnalysis: testMessageIntentAnalysis(),
    contextualResponses: await testContextualResponses()
  };
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log('\n📊 RÉSULTATS DES TESTS:');
  console.log(`✅ Tests réussis: ${passedTests}/${totalTests}`);
  console.log(`❌ Tests échoués: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 TOUS LES TESTS SONT PASSÉS - MODULE FORMATION OPÉRATIONNEL !');
  } else {
    console.log('\n⚠️ CERTAINS TESTS ONT ÉCHOUÉ - VÉRIFICATION NÉCESSAIRE');
  }
  
  return results;
}

// Exécution automatique si le script est lancé directement
if (require.main === module) {
  runAllTests().catch(console.error);
}
