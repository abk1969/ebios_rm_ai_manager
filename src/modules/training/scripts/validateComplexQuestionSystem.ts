#!/usr/bin/env node

/**
 * 🚀 SCRIPT DE VALIDATION DU SYSTÈME DE QUESTIONS COMPLEXES
 * Validation complète de l'ÉTAPE 2.2.2
 * Exécution autonome pour vérification du système
 */

import { ComplexQuestionSystemValidator } from '../domain/services/ComplexQuestionSystemValidator';
import { initializeComplexQuestionSystem } from '../infrastructure/ComplexQuestionSystemConfig';

// 🎯 CONFIGURATION DU SCRIPT

const SCRIPT_CONFIG = {
  environment: 'development' as 'development' | 'staging' | 'production',
  verbose: true,
  exitOnError: false,
  generateReport: true,
  reportPath: './validation-report.txt'
};

// 🚀 FONCTION PRINCIPALE

async function main() {
  console.log('🧠 VALIDATION DU SYSTÈME DE QUESTIONS COMPLEXES - ÉTAPE 2.2.2');
  console.log('='.repeat(70));
  console.log('');

  try {
    // 1. Initialisation du système
    console.log('🔧 Initialisation du système...');
    const initResult = await initializeComplexQuestionSystem(SCRIPT_CONFIG.environment);
    
    if (!initResult.success) {
      console.error('❌ Échec de l\'initialisation:', initResult.error);
      if (SCRIPT_CONFIG.exitOnError) {
        process.exit(1);
      }
    } else {
      console.log('✅ Système initialisé avec succès');
    }

    // 2. Validation complète
    console.log('\n🔍 Démarrage de la validation complète...');
    const validator = ComplexQuestionSystemValidator.getInstance();
    const report = await validator.validateCompleteSystem();

    // 3. Affichage du rapport
    console.log('\n📊 RAPPORT DE VALIDATION:');
    console.log(validator.formatValidationReport(report));

    // 4. Génération du fichier de rapport
    if (SCRIPT_CONFIG.generateReport) {
      await generateReportFile(report, validator);
    }

    // 5. Tests fonctionnels
    console.log('\n🧪 Exécution des tests fonctionnels...');
    await runFunctionalTests();

    // 6. Résumé final
    console.log('\n🎉 VALIDATION TERMINÉE');
    console.log(`Statut global: ${report.overallStatus.toUpperCase()}`);
    console.log(`Temps d'exécution: ${report.executionTime}ms`);
    
    if (report.overallStatus === 'critical' && SCRIPT_CONFIG.exitOnError) {
      console.log('❌ Validation échouée - Arrêt du script');
      process.exit(1);
    } else {
      console.log('✅ Validation terminée avec succès');
      process.exit(0);
    }

  } catch (error) {
    console.error('💥 Erreur fatale lors de la validation:', error);
    process.exit(1);
  }
}

// 📄 GÉNÉRATION DU FICHIER DE RAPPORT

async function generateReportFile(report: any, validator: ComplexQuestionSystemValidator) {
  try {
    const fs = await import('fs');
    const path = await import('path');
    
    const reportContent = `
RAPPORT DE VALIDATION DU SYSTÈME DE QUESTIONS COMPLEXES
ÉTAPE 2.2.2 - ${new Date().toISOString()}
${'='.repeat(80)}

${validator.formatValidationReport(report)}

DÉTAILS TECHNIQUES:
${'-'.repeat(40)}
- Environnement: ${SCRIPT_CONFIG.environment}
- Date de validation: ${new Date().toLocaleString()}
- Version du système: 2.2.2
- Nombre total de vérifications: ${report.totalChecks}

MÉTRIQUES DE PERFORMANCE:
${'-'.repeat(40)}
- Temps d'exécution total: ${report.executionTime}ms
- Taux de réussite: ${Math.round((report.successCount / report.totalChecks) * 100)}%
- Composants validés: ${report.successCount}
- Avertissements: ${report.warningCount}
- Erreurs critiques: ${report.errorCount}

RECOMMANDATIONS D'ACTION:
${'-'.repeat(40)}
${report.recommendations.map((rec: string) => `• ${rec}`).join('\n')}

PROCHAINES ÉTAPES:
${'-'.repeat(40)}
1. Corriger les erreurs critiques identifiées
2. Examiner et résoudre les avertissements
3. Effectuer une nouvelle validation
4. Déployer en environnement de test
5. Planifier la mise en production

FIN DU RAPPORT
${'='.repeat(80)}
`;

    const reportPath = path.resolve(SCRIPT_CONFIG.reportPath);
    fs.writeFileSync(reportPath, reportContent, 'utf8');
    console.log(`📄 Rapport généré: ${reportPath}`);

  } catch (error) {
    console.error('❌ Erreur lors de la génération du rapport:', error);
  }
}

// 🧪 TESTS FONCTIONNELS

async function runFunctionalTests() {
  const tests = [
    {
      name: 'Test de génération de question',
      test: testQuestionGeneration
    },
    {
      name: 'Test de scoring',
      test: testScoring
    },
    {
      name: 'Test de feedback expert',
      test: testExpertFeedback
    },
    {
      name: 'Test d\'orchestration',
      test: testOrchestration
    },
    {
      name: 'Test d\'intégration',
      test: testIntegration
    }
  ];

  for (const test of tests) {
    try {
      console.log(`  🔬 ${test.name}...`);
      await test.test();
      console.log(`  ✅ ${test.name} - RÉUSSI`);
    } catch (error) {
      console.log(`  ❌ ${test.name} - ÉCHEC: ${error}`);
    }
  }
}

// 🔬 TESTS INDIVIDUELS

async function testQuestionGeneration() {
  const { ComplexQuestionGeneratorService } = await import('../domain/services/ComplexQuestionGeneratorService');
  const generator = ComplexQuestionGeneratorService.getInstance();
  
  const mockProfile = {
    id: 'test-user',
    name: 'Test User',
    role: 'Test',
    experience: { ebiosYears: 3, totalYears: 5, projectsCompleted: 10 },
    specializations: ['test'],
    certifications: ['test'],
    sector: 'test',
    organizationType: 'test',
    preferredComplexity: 'intermediate',
    learningStyle: 'analytical'
  };

  const response = await generator.generateComplexQuestions({
    workshopId: 1,
    userProfile: mockProfile,
    context: {
      workshopId: 1,
      organizationType: 'Test',
      sector: 'test',
      complexity: 'intermediate',
      userProfile: mockProfile
    },
    difficulty: 'intermediate',
    count: 1
  });

  if (!response || !response.questions || response.questions.length === 0) {
    throw new Error('Aucune question générée');
  }
}

async function testScoring() {
  const { RealTimeScoringService } = await import('../domain/services/RealTimeScoringService');
  const scorer = RealTimeScoringService.getInstance();
  
  // Test basique du service
  if (!scorer) {
    throw new Error('Service de scoring non initialisé');
  }
}

async function testExpertFeedback() {
  const { ExpertFeedbackService } = await import('../domain/services/ExpertFeedbackService');
  const feedback = ExpertFeedbackService.getInstance();
  
  // Test basique du service
  if (!feedback) {
    throw new Error('Service de feedback non initialisé');
  }
}

async function testOrchestration() {
  const { ComplexQuestionOrchestrator } = await import('../domain/services/ComplexQuestionOrchestrator');
  const orchestrator = ComplexQuestionOrchestrator.getInstance();
  
  // Test basique du service
  if (!orchestrator) {
    throw new Error('Orchestrateur non initialisé');
  }
}

async function testIntegration() {
  const { ComplexQuestionIntegrationService } = await import('../domain/services/ComplexQuestionIntegrationService');
  const integration = ComplexQuestionIntegrationService.getInstance();
  
  // Test basique du service
  if (!integration) {
    throw new Error('Service d\'intégration non initialisé');
  }
}

// 🎯 GESTION DES ARGUMENTS DE LIGNE DE COMMANDE

function parseArguments() {
  const args = process.argv.slice(2);
  
  for (const arg of args) {
    switch (arg) {
      case '--production':
        SCRIPT_CONFIG.environment = 'production';
        break;
      case '--staging':
        SCRIPT_CONFIG.environment = 'staging';
        break;
      case '--quiet':
        SCRIPT_CONFIG.verbose = false;
        break;
      case '--exit-on-error':
        SCRIPT_CONFIG.exitOnError = true;
        break;
      case '--no-report':
        SCRIPT_CONFIG.generateReport = false;
        break;
      case '--help':
        showHelp();
        process.exit(0);
        break;
    }
  }
}

function showHelp() {
  console.log(`
🧠 SCRIPT DE VALIDATION DU SYSTÈME DE QUESTIONS COMPLEXES

Usage: node validateComplexQuestionSystem.ts [options]

Options:
  --production      Utiliser l'environnement de production
  --staging         Utiliser l'environnement de staging
  --quiet           Mode silencieux (moins de logs)
  --exit-on-error   Arrêter le script en cas d'erreur critique
  --no-report       Ne pas générer de fichier de rapport
  --help            Afficher cette aide

Exemples:
  node validateComplexQuestionSystem.ts
  node validateComplexQuestionSystem.ts --production --exit-on-error
  node validateComplexQuestionSystem.ts --staging --quiet
`);
}

// 🚀 POINT D'ENTRÉE

if (require.main === module) {
  parseArguments();
  main().catch(error => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
}

export { main as validateComplexQuestionSystem };
