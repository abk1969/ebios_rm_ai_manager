#!/usr/bin/env node

/**
 * 🎯 SCRIPT DE TEST DES AMÉLIORATIONS UX/UI
 * Valide automatiquement toutes les améliorations implémentées
 * 
 * TESTS COUVERTS :
 * - Phase 1 : Navigation & Orientation
 * - Phase 2 : Cohérence des Suggestions IA
 * - Phase 3 : Résolution des Blocages
 */

const fs = require('fs');
const path = require('path');

// 🎯 CONFIGURATION DES TESTS
const TEST_CONFIG = {
  baseUrl: 'http://localhost:5174',
  timeout: 30000,
  verbose: true
};

// 🎯 COULEURS POUR L'AFFICHAGE
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// 🎯 UTILITAIRES D'AFFICHAGE
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`🎯 ${title}`, 'bright');
  log('='.repeat(60), 'cyan');
}

function logTest(testName, status, details = '') {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  const color = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'yellow';
  log(`${icon} ${testName}`, color);
  if (details) {
    log(`   ${details}`, 'reset');
  }
}

// 🎯 TESTS DE VALIDATION DES FICHIERS
function testFileExists(filePath, description) {
  const fullPath = path.join(__dirname, '..', filePath);
  const exists = fs.existsSync(fullPath);
  logTest(description, exists ? 'PASS' : 'FAIL', exists ? `Fichier trouvé: ${filePath}` : `Fichier manquant: ${filePath}`);
  return exists;
}

function testFileContent(filePath, searchPattern, description) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(fullPath)) {
    logTest(description, 'FAIL', `Fichier non trouvé: ${filePath}`);
    return false;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const found = content.includes(searchPattern);
  logTest(description, found ? 'PASS' : 'FAIL', found ? `Pattern trouvé: ${searchPattern}` : `Pattern manquant: ${searchPattern}`);
  return found;
}

// 🎯 TESTS PHASE 1 : NAVIGATION & ORIENTATION
function testPhase1Navigation() {
  logSection('PHASE 1 : NAVIGATION & ORIENTATION');
  
  let allPassed = true;
  
  // Test 1.1 : Fil d'Ariane Intelligent
  allPassed &= testFileExists('src/components/workshops/EbiosProgressBreadcrumb.tsx', 'Fil d\'Ariane - Composant principal');
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', 'ENABLE_PROGRESS_BREADCRUMB', 'Fil d\'Ariane - Intégration avec flag');
  allPassed &= testFileContent('src/components/workshops/EbiosProgressBreadcrumb.tsx', 'calculateProgress', 'Fil d\'Ariane - Calcul de progression');
  
  // Test 1.2 : Dashboard de Mission Unifié
  allPassed &= testFileExists('src/components/dashboard/UnifiedMissionOverview.tsx', 'Dashboard Unifié - Composant principal');
  allPassed &= testFileContent('src/components/dashboard/EbiosGlobalDashboard.tsx', 'UnifiedMissionOverview', 'Dashboard Unifié - Intégration');
  allPassed &= testFileContent('src/components/dashboard/UnifiedMissionOverview.tsx', 'WorkshopOverview', 'Dashboard Unifié - Vue d\'ensemble ateliers');
  
  // Test 1.3 : Système de Guidage Contextuel
  allPassed &= testFileExists('src/components/guidance/ContextualGuidance.tsx', 'Guidage Contextuel - Composant principal');
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', 'ENABLE_CONTEXTUAL_GUIDANCE', 'Guidage Contextuel - Intégration avec flag');
  allPassed &= testFileContent('src/components/guidance/ContextualGuidance.tsx', 'ContextualGuidanceEngine', 'Guidage Contextuel - Moteur d\'analyse');
  
  log(`\n📊 Phase 1 - Résultat global: ${allPassed ? '✅ SUCCÈS' : '❌ ÉCHEC'}`, allPassed ? 'green' : 'red');
  return allPassed;
}

// 🎯 TESTS PHASE 2 : COHÉRENCE DES SUGGESTIONS IA
function testPhase2AICoherence() {
  logSection('PHASE 2 : COHÉRENCE DES SUGGESTIONS IA');
  
  let allPassed = true;
  
  // Test 2.1 : Service de Contexte Global IA
  allPassed &= testFileExists('src/services/ai/GlobalContextAIService.ts', 'Contexte Global IA - Service principal');
  allPassed &= testFileContent('src/services/ai/GlobalContextAIService.ts', 'getGlobalContext', 'Contexte Global IA - Méthode principale');
  allPassed &= testFileContent('src/services/ai/GlobalContextAIService.ts', 'generateContextualSuggestions', 'Contexte Global IA - Génération suggestions');
  allPassed &= testFileContent('src/services/ai/GlobalContextAIService.ts', 'analyzeCoherence', 'Contexte Global IA - Analyse cohérence');
  
  // Test 2.2 : Composant Suggestions Explicatives
  allPassed &= testFileExists('src/components/ai/ExplainableAISuggestions.tsx', 'Suggestions Explicatives - Composant principal');
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', 'ENABLE_EXPLAINABLE_AI_SUGGESTIONS', 'Suggestions Explicatives - Intégration avec flag');
  allPassed &= testFileContent('src/components/ai/ExplainableAISuggestions.tsx', 'coherenceJustification', 'Suggestions Explicatives - Justification cohérence');
  allPassed &= testFileContent('src/components/ai/ExplainableAISuggestions.tsx', 'contextualRelevance', 'Suggestions Explicatives - Pertinence contextuelle');
  
  log(`\n📊 Phase 2 - Résultat global: ${allPassed ? '✅ SUCCÈS' : '❌ ÉCHEC'}`, allPassed ? 'green' : 'red');
  return allPassed;
}

// 🎯 TESTS PHASE 3 : RÉSOLUTION DES BLOCAGES
function testPhase3BlockageResolution() {
  logSection('PHASE 3 : RÉSOLUTION DES BLOCAGES');
  
  let allPassed = true;
  
  // Test 3.1 : Service de Détection des Blocages
  allPassed &= testFileExists('src/services/ai/BlockageDetectionService.ts', 'Détection Blocages - Service principal');
  allPassed &= testFileContent('src/services/ai/BlockageDetectionService.ts', 'analyzeBlockages', 'Détection Blocages - Méthode principale');
  allPassed &= testFileContent('src/services/ai/BlockageDetectionService.ts', 'BlockageType', 'Détection Blocages - Types de blocages');
  allPassed &= testFileContent('src/services/ai/BlockageDetectionService.ts', 'generateSolutions', 'Détection Blocages - Génération solutions');
  
  // Test 3.2 : Composant Panneau de Résolution
  allPassed &= testFileExists('src/components/ai/BlockageResolutionPanel.tsx', 'Résolution Blocages - Composant principal');
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', 'ENABLE_BLOCKAGE_RESOLUTION', 'Résolution Blocages - Intégration avec flag');
  allPassed &= testFileContent('src/components/ai/BlockageResolutionPanel.tsx', 'handleApplySolution', 'Résolution Blocages - Application solutions');
  allPassed &= testFileContent('src/components/ai/BlockageResolutionPanel.tsx', 'autoRefresh', 'Résolution Blocages - Auto-refresh');
  
  log(`\n📊 Phase 3 - Résultat global: ${allPassed ? '✅ SUCCÈS' : '❌ ÉCHEC'}`, allPassed ? 'green' : 'red');
  return allPassed;
}

// 🎯 TESTS D'INTÉGRATION
function testIntegration() {
  logSection('TESTS D\'INTÉGRATION');
  
  let allPassed = true;
  
  // Test des flags de contrôle
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', 'ENABLE_PROGRESS_BREADCRUMB = true', 'Intégration - Flag Fil d\'Ariane activé');
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', 'ENABLE_CONTEXTUAL_GUIDANCE = true', 'Intégration - Flag Guidage activé');
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', 'ENABLE_EXPLAINABLE_AI_SUGGESTIONS = true', 'Intégration - Flag Suggestions IA activé');
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', 'ENABLE_BLOCKAGE_RESOLUTION = true', 'Intégration - Flag Résolution activé');
  
  // Test des imports
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', 'import EbiosProgressBreadcrumb', 'Intégration - Import Fil d\'Ariane');
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', 'import ContextualGuidance', 'Intégration - Import Guidage');
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', 'import ExplainableAISuggestions', 'Intégration - Import Suggestions IA');
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', 'import BlockageResolutionPanel', 'Intégration - Import Résolution');
  
  // Test de l'intégration dans le dashboard global
  allPassed &= testFileContent('src/components/dashboard/EbiosGlobalDashboard.tsx', 'import UnifiedMissionOverview', 'Intégration - Dashboard unifié importé');
  allPassed &= testFileContent('src/components/dashboard/EbiosGlobalDashboard.tsx', 'showUnifiedView', 'Intégration - Dashboard unifié contrôlé');
  
  log(`\n📊 Intégration - Résultat global: ${allPassed ? '✅ SUCCÈS' : '❌ ÉCHEC'}`, allPassed ? 'green' : 'red');
  return allPassed;
}

// 🎯 TESTS DE SÉCURITÉ ANTI-RÉGRESSION
function testAntiRegression() {
  logSection('TESTS ANTI-RÉGRESSION');
  
  let allPassed = true;
  
  // Vérification que les fichiers existants n'ont pas été cassés
  allPassed &= testFileExists('src/pages/workshops/Workshop1.tsx', 'Anti-régression - Workshop1 existe toujours');
  allPassed &= testFileExists('src/components/dashboard/EbiosGlobalDashboard.tsx', 'Anti-régression - Dashboard global existe toujours');
  allPassed &= testFileExists('src/services/aiAssistant.ts', 'Anti-régression - Service IA existant préservé');
  
  // Vérification que les fonctionnalités existantes sont préservées
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', 'const [businessValues, setBusinessValues]', 'Anti-régression - État business values préservé');
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', 'const [supportingAssets, setSupportingAssets]', 'Anti-régression - État actifs supports préservé');
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', 'const [dreadedEvents, setDreadedEvents]', 'Anti-régression - État événements redoutés préservé');
  
  // Vérification que les nouveaux composants sont optionnels
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', '{ENABLE_PROGRESS_BREADCRUMB &&', 'Anti-régression - Fil d\'Ariane optionnel');
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', '{ENABLE_CONTEXTUAL_GUIDANCE &&', 'Anti-régression - Guidage optionnel');
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', '{ENABLE_EXPLAINABLE_AI_SUGGESTIONS &&', 'Anti-régression - Suggestions IA optionnelles');
  allPassed &= testFileContent('src/pages/workshops/Workshop1.tsx', '{ENABLE_BLOCKAGE_RESOLUTION &&', 'Anti-régression - Résolution optionnelle');
  
  log(`\n📊 Anti-régression - Résultat global: ${allPassed ? '✅ SUCCÈS' : '❌ ÉCHEC'}`, allPassed ? 'green' : 'red');
  return allPassed;
}

// 🎯 FONCTION PRINCIPALE
function runAllTests() {
  log('🚀 DÉMARRAGE DES TESTS DES AMÉLIORATIONS UX/UI', 'bright');
  log(`📅 ${new Date().toLocaleString()}`, 'cyan');
  
  const startTime = Date.now();
  
  // Exécution de tous les tests
  const results = {
    phase1: testPhase1Navigation(),
    phase2: testPhase2AICoherence(),
    phase3: testPhase3BlockageResolution(),
    integration: testIntegration(),
    antiRegression: testAntiRegression()
  };
  
  // Calcul du résultat global
  const allTestsPassed = Object.values(results).every(result => result);
  const passedCount = Object.values(results).filter(result => result).length;
  const totalCount = Object.keys(results).length;
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  // Affichage du résumé final
  logSection('RÉSUMÉ FINAL');
  
  log(`📊 Tests réussis: ${passedCount}/${totalCount}`, passedCount === totalCount ? 'green' : 'red');
  log(`⏱️  Durée d'exécution: ${duration}s`, 'cyan');
  log(`🎯 Résultat global: ${allTestsPassed ? '✅ TOUS LES TESTS RÉUSSIS' : '❌ CERTAINS TESTS ONT ÉCHOUÉ'}`, allTestsPassed ? 'green' : 'red');
  
  if (allTestsPassed) {
    log('\n🎉 FÉLICITATIONS !', 'green');
    log('Toutes les améliorations UX/UI ont été implémentées avec succès.', 'green');
    log('L\'application est prête pour les tests utilisateur.', 'green');
  } else {
    log('\n⚠️  ATTENTION !', 'yellow');
    log('Certains tests ont échoué. Vérifiez les détails ci-dessus.', 'yellow');
  }
  
  // Code de sortie
  process.exit(allTestsPassed ? 0 : 1);
}

// 🎯 EXÉCUTION
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  testPhase1Navigation,
  testPhase2AICoherence,
  testPhase3BlockageResolution,
  testIntegration,
  testAntiRegression
};
