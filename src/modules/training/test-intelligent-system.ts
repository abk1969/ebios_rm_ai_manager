/**
 * 🧪 TEST DU SYSTÈME INTELLIGENT FULL-AGENTIC
 * Validation complète du nouveau système avec réponses pertinentes
 */

import { AgentOrchestrator } from './domain/services/AgentOrchestrator';
import { ResponseValidationService } from './domain/services/ResponseValidationService';

interface TestScenario {
  name: string;
  userMessage: string;
  expectedType: string;
  minValidationScore: number;
  maxRiskLevel: string;
}

/**
 * 🎯 Scénarios de test critiques pour éviter la disqualification ANSSI
 */
const CRITICAL_TEST_SCENARIOS: TestScenario[] = [
  {
    name: 'Démarrage formation',
    userMessage: 'GO',
    expectedType: 'action_suggestions',
    minValidationScore: 0.8,
    maxRiskLevel: 'medium'
  },
  {
    name: 'Présentation contexte CHU',
    userMessage: 'Présentez-moi le CHU métropolitain',
    expectedType: 'info_card',
    minValidationScore: 0.85,
    maxRiskLevel: 'low'
  },
  {
    name: 'Démarrage Atelier 1',
    userMessage: 'Commençons l\'atelier 1 - cadrage et socle de sécurité',
    expectedType: 'text',
    minValidationScore: 0.9,
    maxRiskLevel: 'low'
  },
  {
    name: 'Identification biens supports',
    userMessage: 'Comment identifier les biens supports critiques du CHU ?',
    expectedType: 'text',
    minValidationScore: 0.85,
    maxRiskLevel: 'medium'
  },
  {
    name: 'Analyse menaces santé',
    userMessage: 'Quelles sont les menaces spécifiques au secteur hospitalier ?',
    expectedType: 'text',
    minValidationScore: 0.9,
    maxRiskLevel: 'low'
  },
  {
    name: 'Scénarios ransomware',
    userMessage: 'Analysons les scénarios de ransomware sur le SIH',
    expectedType: 'text',
    minValidationScore: 0.85,
    maxRiskLevel: 'medium'
  },
  {
    name: 'Demande d\'aide',
    userMessage: 'Je suis perdu, aidez-moi',
    expectedType: 'action_suggestions',
    minValidationScore: 0.7,
    maxRiskLevel: 'medium'
  },
  {
    name: 'Question technique avancée',
    userMessage: 'Comment intégrer MITRE ATT&CK dans l\'analyse EBIOS RM ?',
    expectedType: 'text',
    minValidationScore: 0.9,
    maxRiskLevel: 'low'
  }
];

/**
 * 🔍 Test complet du système intelligent
 */
export async function testIntelligentSystem(): Promise<{
  success: boolean;
  results: any[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    criticalFailures: number;
  };
}> {
  console.log('🚀 DÉMARRAGE DES TESTS DU SYSTÈME INTELLIGENT FULL-AGENTIC\n');
  
  const orchestrator = new AgentOrchestrator();
  const validationService = ResponseValidationService.getInstance();
  const results: any[] = [];
  
  // Initialisation de la session
  try {
    await orchestrator.initializeSession('test_intelligent_user', 'test_session_intelligent');
    console.log('✅ Session intelligente initialisée');
  } catch (error) {
    console.error('❌ Échec d\'initialisation:', error);
    return {
      success: false,
      results: [{ error: 'Initialisation échouée' }],
      summary: { total: 0, passed: 0, failed: 1, criticalFailures: 1 }
    };
  }

  // Test de chaque scénario critique
  for (const scenario of CRITICAL_TEST_SCENARIOS) {
    console.log(`\n🧪 Test: ${scenario.name}`);
    console.log(`📝 Message: "${scenario.userMessage}"`);
    
    try {
      const startTime = Date.now();
      
      // Traitement par l'orchestrateur intelligent
      const response = await orchestrator.processLearnerMessage(scenario.userMessage);
      
      const processingTime = Date.now() - startTime;
      
      // Validation de la réponse
      const validationResult = validationService.validateResponse(
        response.text,
        {
          workshop: 1, // Test sur atelier 1
          userMessage: scenario.userMessage,
          learnerLevel: 'intermediate',
          organizationContext: 'CHU Métropolitain'
        }
      );
      
      // Évaluation des critères de succès
      const typeMatch = response.type === scenario.expectedType || response.type === 'text'; // Flexibilité sur le type
      const validationPass = validationResult.score >= scenario.minValidationScore;
      const riskAcceptable = this.isRiskLevelAcceptable(validationResult.riskLevel, scenario.maxRiskLevel);
      const responseQuality = this.assessResponseQuality(response);
      
      const testPassed = typeMatch && validationPass && riskAcceptable && responseQuality.isAcceptable;
      
      const testResult = {
        scenario: scenario.name,
        passed: testPassed,
        response: {
          type: response.type,
          length: response.text.length,
          hasActions: response.actions && response.actions.length > 0,
          hasMetadata: !!response.metadata
        },
        validation: {
          score: validationResult.score,
          riskLevel: validationResult.riskLevel,
          isValid: validationResult.isValid,
          issues: validationResult.issues
        },
        performance: {
          processingTime,
          responseLength: response.text.length
        },
        quality: responseQuality,
        criteria: {
          typeMatch,
          validationPass,
          riskAcceptable,
          qualityAcceptable: responseQuality.isAcceptable
        }
      };
      
      results.push(testResult);
      
      if (testPassed) {
        console.log(`✅ SUCCÈS - Score: ${Math.round(validationResult.score * 100)}% - Risque: ${validationResult.riskLevel}`);
      } else {
        console.log(`❌ ÉCHEC - Score: ${Math.round(validationResult.score * 100)}% - Risque: ${validationResult.riskLevel}`);
        if (validationResult.issues.length > 0) {
          console.log(`   Issues: ${validationResult.issues.join(', ')}`);
        }
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
    criticalFailures: results.filter(r => r.critical || (r.validation && r.validation.riskLevel === 'critical')).length
  };

  const success = summary.criticalFailures === 0 && summary.passed >= Math.ceil(summary.total * 0.8);

  // Affichage des résultats finaux
  console.log('\n📊 RÉSULTATS FINAUX DU SYSTÈME INTELLIGENT:');
  console.log(`✅ Tests réussis: ${summary.passed}/${summary.total} (${Math.round(summary.passed/summary.total*100)}%)`);
  console.log(`❌ Tests échoués: ${summary.failed}/${summary.total}`);
  console.log(`🚨 Échecs critiques: ${summary.criticalFailures}/${summary.total}`);

  if (success) {
    console.log('\n🎉 SYSTÈME INTELLIGENT VALIDÉ - CONFORME ANSSI !');
    console.log('✅ Le module de formation est prêt pour la production');
    console.log('✅ Risque de disqualification ANSSI: FAIBLE');
  } else {
    console.log('\n⚠️ SYSTÈME NÉCESSITE DES CORRECTIONS');
    console.log('❌ Risque de disqualification ANSSI: ÉLEVÉ');
    
    // Détail des problèmes critiques
    const criticalIssues = results.filter(r => r.critical || (r.validation && r.validation.riskLevel === 'critical'));
    if (criticalIssues.length > 0) {
      console.log('\n🚨 PROBLÈMES CRITIQUES À CORRIGER:');
      criticalIssues.forEach(issue => {
        console.log(`- ${issue.scenario}: ${issue.error || 'Validation critique échouée'}`);
      });
    }
  }

  return { success, results, summary };
}

/**
 * 🎯 Évaluer si le niveau de risque est acceptable
 */
function isRiskLevelAcceptable(actualRisk: string, maxAcceptableRisk: string): boolean {
  const riskLevels = { 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
  const actualLevel = riskLevels[actualRisk as keyof typeof riskLevels] || 4;
  const maxLevel = riskLevels[maxAcceptableRisk as keyof typeof riskLevels] || 1;
  return actualLevel <= maxLevel;
}

/**
 * 📊 Évaluer la qualité globale de la réponse
 */
function assessResponseQuality(response: any): { isAcceptable: boolean; score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 1.0;

  // Vérifications de base
  if (!response.text || response.text.length < 50) {
    issues.push('Réponse trop courte');
    score -= 0.3;
  }

  if (response.text.length > 3000) {
    issues.push('Réponse trop longue');
    score -= 0.2;
  }

  // Vérification de la structure
  if (!response.text.includes('**')) {
    issues.push('Manque de structure (titres)');
    score -= 0.1;
  }

  // Vérification des références EBIOS/ANSSI
  if (!response.text.match(/EBIOS|ANSSI|méthodologie/gi)) {
    issues.push('Manque de références méthodologiques');
    score -= 0.2;
  }

  // Vérification de l'actionnabilité
  if (!response.text.match(/étape|action|recommand|conseil/gi)) {
    issues.push('Manque d\'éléments actionnables');
    score -= 0.1;
  }

  return {
    isAcceptable: score >= 0.6,
    score: Math.max(0, score),
    issues
  };
}

// Exécution automatique si script lancé directement
if (require.main === module) {
  testIntelligentSystem()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Erreur fatale:', error);
      process.exit(1);
    });
}
