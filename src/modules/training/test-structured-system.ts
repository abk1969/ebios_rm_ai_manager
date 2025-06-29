/**
 * 🧪 TEST DU SYSTÈME STRUCTURÉ EBIOS RM
 * Validation du moteur IA structurant workshop par workshop
 */

import { AgentOrchestrator } from './domain/services/AgentOrchestrator';

interface StructuredTestScenario {
  name: string;
  userMessage: string;
  expectedWorkshop: number;
  expectedStepType: string;
  shouldHaveActions: boolean;
  shouldHaveStructure: boolean;
}

/**
 * 🎯 Scénarios de test pour le système structuré
 */
const STRUCTURED_TEST_SCENARIOS: StructuredTestScenario[] = [
  {
    name: 'Initialisation formation structurée',
    userMessage: 'GO',
    expectedWorkshop: 1,
    expectedStepType: 'initialize_workshop',
    shouldHaveActions: true,
    shouldHaveStructure: true
  },
  {
    name: 'Demande de progression structurée',
    userMessage: 'Passons à l\'étape suivante',
    expectedWorkshop: 1,
    expectedStepType: 'advance_to_next_step',
    shouldHaveActions: true,
    shouldHaveStructure: true
  },
  {
    name: 'Demande d\'aide structurée',
    userMessage: 'Je suis perdu, aidez-moi avec cette étape',
    expectedWorkshop: 1,
    expectedStepType: 'provide_detailed_help',
    shouldHaveActions: true,
    shouldHaveStructure: true
  },
  {
    name: 'Demande d\'exemple pratique',
    userMessage: 'Montrez-moi un exemple concret pour le CHU',
    expectedWorkshop: 1,
    expectedStepType: 'provide_practical_example',
    shouldHaveActions: true,
    shouldHaveStructure: true
  },
  {
    name: 'Validation des acquis',
    userMessage: 'Je pense avoir terminé cette étape, validez mes acquis',
    expectedWorkshop: 1,
    expectedStepType: 'validate_understanding',
    shouldHaveActions: true,
    shouldHaveStructure: true
  },
  {
    name: 'Question spécifique atelier 1',
    userMessage: 'Comment identifier les biens supports critiques du CHU ?',
    expectedWorkshop: 1,
    expectedStepType: 'guide_current_step',
    shouldHaveActions: true,
    shouldHaveStructure: true
  },
  {
    name: 'Démarrage atelier 2',
    userMessage: 'Commençons l\'atelier 2 sur les sources de risque',
    expectedWorkshop: 2,
    expectedStepType: 'initialize_workshop',
    shouldHaveActions: true,
    shouldHaveStructure: true
  }
];

/**
 * 🔍 Test complet du système structuré
 */
export async function testStructuredSystem(): Promise<{
  success: boolean;
  results: any[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    structureValidation: number;
  };
}> {
  console.log('🚀 DÉMARRAGE DES TESTS DU SYSTÈME STRUCTURÉ EBIOS RM\n');
  
  const orchestrator = new AgentOrchestrator();
  const results: any[] = [];
  
  // Initialisation de la session
  try {
    await orchestrator.initializeSession('test_structured_user', 'test_session_structured');
    console.log('✅ Session structurée initialisée');
  } catch (error) {
    console.error('❌ Échec d\'initialisation:', error);
    return {
      success: false,
      results: [{ error: 'Initialisation échouée' }],
      summary: { total: 0, passed: 0, failed: 1, structureValidation: 0 }
    };
  }

  // Test de chaque scénario structuré
  for (const scenario of STRUCTURED_TEST_SCENARIOS) {
    console.log(`\n🧪 Test: ${scenario.name}`);
    console.log(`📝 Message: "${scenario.userMessage}"`);
    
    try {
      const startTime = Date.now();
      
      // Traitement par l'orchestrateur structuré
      const response = await orchestrator.processLearnerMessage(scenario.userMessage);
      
      const processingTime = Date.now() - startTime;
      
      // Validation de la structure de la réponse
      const structureValidation = validateResponseStructure(response, scenario);
      
      // Validation du contenu spécifique
      const contentValidation = validateStructuredContent(response, scenario);
      
      // Validation des actions structurées
      const actionsValidation = validateStructuredActions(response, scenario);
      
      // Validation des métadonnées structurées
      const metadataValidation = validateStructuredMetadata(response, scenario);
      
      const testPassed = structureValidation.isValid && 
                        contentValidation.isValid && 
                        actionsValidation.isValid && 
                        metadataValidation.isValid;
      
      const testResult = {
        scenario: scenario.name,
        passed: testPassed,
        response: {
          type: response.type,
          length: response.text.length,
          hasActions: response.actions && response.actions.length > 0,
          hasMetadata: !!response.metadata,
          hasStructuredContent: response.text.includes('**') && response.text.includes('🎯')
        },
        validation: {
          structure: structureValidation,
          content: contentValidation,
          actions: actionsValidation,
          metadata: metadataValidation
        },
        performance: {
          processingTime,
          responseLength: response.text.length
        }
      };
      
      results.push(testResult);
      
      if (testPassed) {
        console.log(`✅ SUCCÈS - Structure: ${structureValidation.score}% - Contenu: ${contentValidation.score}%`);
      } else {
        console.log(`❌ ÉCHEC - Problèmes détectés:`);
        if (!structureValidation.isValid) console.log(`   Structure: ${structureValidation.issues.join(', ')}`);
        if (!contentValidation.isValid) console.log(`   Contenu: ${contentValidation.issues.join(', ')}`);
        if (!actionsValidation.isValid) console.log(`   Actions: ${actionsValidation.issues.join(', ')}`);
        if (!metadataValidation.isValid) console.log(`   Métadonnées: ${metadataValidation.issues.join(', ')}`);
      }
      
    } catch (error) {
      console.log(`💥 ERREUR CRITIQUE: ${error}`);
      results.push({
        scenario: scenario.name,
        passed: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        critical: true
      });
    }
  }

  // Calcul du résumé
  const summary = {
    total: results.length,
    passed: results.filter(r => r.passed).length,
    failed: results.filter(r => !r.passed).length,
    structureValidation: results.filter(r => r.validation?.structure?.isValid).length
  };

  const success = summary.passed >= Math.ceil(summary.total * 0.9); // 90% de réussite requis

  // Affichage des résultats finaux
  console.log('\n📊 RÉSULTATS FINAUX DU SYSTÈME STRUCTURÉ:');
  console.log(`✅ Tests réussis: ${summary.passed}/${summary.total} (${Math.round(summary.passed/summary.total*100)}%)`);
  console.log(`❌ Tests échoués: ${summary.failed}/${summary.total}`);
  console.log(`🏗️ Structure validée: ${summary.structureValidation}/${summary.total}`);

  if (success) {
    console.log('\n🎉 SYSTÈME STRUCTURÉ VALIDÉ - MOTEUR IA OPÉRATIONNEL !');
    console.log('✅ Le moteur IA structure correctement les workshops EBIOS RM');
    console.log('✅ Chaque réponse est contextuelle et pertinente');
    console.log('✅ La progression est guidée étape par étape');
  } else {
    console.log('\n⚠️ SYSTÈME STRUCTURÉ NÉCESSITE DES CORRECTIONS');
    
    // Détail des problèmes
    const failedTests = results.filter(r => !r.passed);
    if (failedTests.length > 0) {
      console.log('\n🚨 TESTS ÉCHOUÉS:');
      failedTests.forEach(test => {
        console.log(`- ${test.scenario}: ${test.error || 'Validation structurée échouée'}`);
      });
    }
  }

  return { success, results, summary };
}

/**
 * 🏗️ Valider la structure de la réponse
 */
function validateResponseStructure(response: any, scenario: StructuredTestScenario): any {
  const issues: string[] = [];
  let score = 100;

  // Vérification de la présence des éléments structurels
  if (!response.text || response.text.length < 100) {
    issues.push('Réponse trop courte');
    score -= 30;
  }

  if (!response.text.includes('**')) {
    issues.push('Manque de structure (titres en gras)');
    score -= 20;
  }

  if (!response.text.includes('🎯') && !response.text.includes('📋')) {
    issues.push('Manque d\'émojis structurants');
    score -= 10;
  }

  if (scenario.shouldHaveActions && (!response.actions || response.actions.length === 0)) {
    issues.push('Actions manquantes');
    score -= 25;
  }

  if (!response.metadata) {
    issues.push('Métadonnées manquantes');
    score -= 15;
  }

  return {
    isValid: issues.length === 0,
    score: Math.max(0, score),
    issues
  };
}

/**
 * 📝 Valider le contenu structuré
 */
function validateStructuredContent(response: any, scenario: StructuredTestScenario): any {
  const issues: string[] = [];
  let score = 100;

  // Vérification du contenu EBIOS RM
  if (!response.text.match(/EBIOS|atelier|workshop|étape/gi)) {
    issues.push('Manque de références EBIOS RM');
    score -= 30;
  }

  // Vérification du contexte CHU
  if (!response.text.match(/CHU|hôpital|santé|médical/gi)) {
    issues.push('Manque de contexte CHU');
    score -= 20;
  }

  // Vérification de la structure pédagogique
  if (!response.text.match(/objectif|action|livrable/gi)) {
    issues.push('Manque de structure pédagogique');
    score -= 25;
  }

  // Vérification de l'actionnabilité
  if (!response.text.match(/\d+\.|•|➡️|🔧/g)) {
    issues.push('Manque d\'éléments actionnables');
    score -= 25;
  }

  return {
    isValid: issues.length === 0,
    score: Math.max(0, score),
    issues
  };
}

/**
 * 🎯 Valider les actions structurées
 */
function validateStructuredActions(response: any, scenario: StructuredTestScenario): any {
  const issues: string[] = [];
  let score = 100;

  if (scenario.shouldHaveActions) {
    if (!response.actions || response.actions.length === 0) {
      issues.push('Aucune action fournie');
      score -= 50;
    } else {
      // Vérifier la qualité des actions
      const hasNextStep = response.actions.some((action: any) => 
        action.label && action.label.includes('suivant')
      );
      const hasHelp = response.actions.some((action: any) => 
        action.label && action.label.includes('aide')
      );
      
      if (!hasNextStep) {
        issues.push('Manque action "étape suivante"');
        score -= 20;
      }
      
      if (!hasHelp) {
        issues.push('Manque action "aide"');
        score -= 20;
      }
      
      // Vérifier la structure des actions
      response.actions.forEach((action: any, index: number) => {
        if (!action.id || !action.label || !action.payload) {
          issues.push(`Action ${index + 1} incomplète`);
          score -= 10;
        }
      });
    }
  }

  return {
    isValid: issues.length === 0,
    score: Math.max(0, score),
    issues
  };
}

/**
 * 📊 Valider les métadonnées structurées
 */
function validateStructuredMetadata(response: any, scenario: StructuredTestScenario): any {
  const issues: string[] = [];
  let score = 100;

  if (!response.metadata) {
    issues.push('Métadonnées manquantes');
    return { isValid: false, score: 0, issues };
  }

  const metadata = response.metadata;

  if (!metadata.confidence || metadata.confidence < 0.7) {
    issues.push('Confiance trop faible');
    score -= 20;
  }

  if (!metadata.sources || metadata.sources.length === 0) {
    issues.push('Sources manquantes');
    score -= 20;
  }

  if (!metadata.timestamp) {
    issues.push('Timestamp manquant');
    score -= 10;
  }

  // Vérifications spécifiques au système structuré
  if (scenario.shouldHaveStructure) {
    if (!metadata.workshopStep && !metadata.nextStructuralAction) {
      issues.push('Métadonnées structurelles manquantes');
      score -= 30;
    }
  }

  return {
    isValid: issues.length === 0,
    score: Math.max(0, score),
    issues
  };
}

// Exécution automatique si script lancé directement
if (require.main === module) {
  testStructuredSystem()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}
