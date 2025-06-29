#!/usr/bin/env node

/**
 * 🔍 TEST RAPIDE ARCHITECTURE AGENTIC
 * Validation simple en JavaScript pour vérifier que tout fonctionne
 */

console.log('🔍 VALIDATION ARCHITECTURE AGENTIC');
console.log('=====================================\n');

// Test 1: Vérification des fichiers critiques
console.log('📋 Test 1: Vérification des fichiers...');
const fs = require('fs');
const path = require('path');

const criticalFiles = [
  'src/services/agents/AgentService.ts',
  'src/services/agents/DocumentationAgent.ts',
  'src/services/agents/CircuitBreaker.ts',
  'src/services/agents/HybridEbiosService.ts',
  'src/services/agents/A2AOrchestrator.ts',
  'src/services/monitoring/RegressionDetector.ts',
  'src/components/monitoring/AgentMonitoringDashboard.tsx',
  'src/types/agents.ts',
  'docs/ARCHITECTURE_AGENTIC.md'
];

let allFilesExist = true;

criticalFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - MANQUANT`);
    allFilesExist = false;
  }
});

// Test 2: Vérification package.json
console.log('\n📦 Test 2: Scripts NPM...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const requiredScripts = [
  'migrate:agentic',
  'migrate:phase1',
  'test:agents',
  'validate:architecture'
];

let allScriptsExist = true;

requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`   ✅ ${script}`);
  } else {
    console.log(`   ❌ ${script} - MANQUANT`);
    allScriptsExist = false;
  }
});

// Test 3: Vérification structure TypeScript
console.log('\n🔧 Test 3: Structure TypeScript...');

try {
  // Vérifier que les imports principaux sont corrects
  const agentServiceContent = fs.readFileSync('src/services/agents/AgentService.ts', 'utf8');
  
  if (agentServiceContent.includes('export interface AgentService') && 
      agentServiceContent.includes('export class AgentRegistry')) {
    console.log('   ✅ AgentService - Interfaces correctes');
  } else {
    console.log('   ❌ AgentService - Interfaces manquantes');
    allFilesExist = false;
  }

  const typesContent = fs.readFileSync('src/types/agents.ts', 'utf8');
  
  if (typesContent.includes('export interface AgentMetadata') && 
      typesContent.includes('export interface MigrationMetrics')) {
    console.log('   ✅ Types agents - Interfaces correctes');
  } else {
    console.log('   ❌ Types agents - Interfaces manquantes');
    allFilesExist = false;
  }

} catch (error) {
  console.log(`   ❌ Erreur lecture fichiers: ${error.message}`);
  allFilesExist = false;
}

// Test 4: Vérification dashboard intégration
console.log('\n📊 Test 4: Intégration Dashboard...');

try {
  const dashboardContent = fs.readFileSync('src/components/dashboard/EbiosGlobalDashboard.tsx', 'utf8');
  
  if (dashboardContent.includes('AgentMonitoringDashboard') && 
      dashboardContent.includes('activeTab') &&
      dashboardContent.includes('agents')) {
    console.log('   ✅ Dashboard - Intégration agents OK');
  } else {
    console.log('   ❌ Dashboard - Intégration agents manquante');
    allFilesExist = false;
  }

} catch (error) {
  console.log(`   ❌ Erreur lecture dashboard: ${error.message}`);
  allFilesExist = false;
}

// Résumé final
console.log('\n📊 RÉSUMÉ DE VALIDATION');
console.log('========================');

if (allFilesExist && allScriptsExist) {
  console.log('🎉 ARCHITECTURE AGENTIC VALIDÉE !');
  console.log('✅ Tous les fichiers critiques présents');
  console.log('✅ Scripts NPM configurés');
  console.log('✅ Structure TypeScript correcte');
  console.log('✅ Intégration dashboard OK');
  console.log('\n🚀 PRÊT POUR LA MIGRATION PHASE 1');
  console.log('   Exécuter: npm run migrate:phase1');
  process.exit(0);
} else {
  console.log('⚠️  PROBLÈMES DÉTECTÉS');
  console.log('❌ Corriger les erreurs avant migration');
  process.exit(1);
}
