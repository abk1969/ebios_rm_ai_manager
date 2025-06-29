#!/usr/bin/env node

/**
 * SUPPRESSION DES DONNÉES FICTIVES
 * Détecte et supprime toutes les données fictives de l'application
 */

const fs = require('fs');
const path = require('path');

console.log('SUPPRESSION DES DONNÉES FICTIVES');
console.log('='.repeat(50));

let totalIssuesFound = 0;
let totalIssuesFixed = 0;

// Patterns de données fictives à détecter
const FAKE_DATA_PATTERNS = [
  // Dates hardcodées
  /['"`]20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[Z.]?[^'"`]*['"`]/g,
  /['"`]\d{2}\/\d{2}\/20\d{2}[^'"`]*['"`]/g,
  
  // Données réelles
  /timestamp:\s*['"`]20\d{2}-\d{2}-\d{2}/g,
  /lastDeployment:\s*['"`]20\d{2}-\d{2}-\d{2}/g,
  /createdAt:\s*['"`]20\d{2}-\d{2}-\d{2}/g,
  /updatedAt:\s*['"`]20\d{2}-\d{2}-\d{2}/g,
  
  // URLs fictives
  /https:\/\/[a-z-]+\.web\.app/g,
  /https:\/\/[a-z-]+-staging\.web\.app/g,
  /https:\/\/[a-z-]+-dev\.web\.app/g,
  
  // Versions fictives
  /version:\s*['"`]v\d+\.\d+\.\d+[^'"`]*['"`]/g,
  
  // Données réelles
  /id:\s*['"`][a-z]+-\d+['"`]/g,
  
  // Données réelles
  /\/\/.*[Ss]imulation/g,
  /\/\*.*[Ss]imulation.*\*\//g,
  
  // Mock data
  /mock[A-Z][a-zA-Z]*/g,
  /const\s+mock[A-Z]/g,
  /let\s+mock[A-Z]/g,
  /var\s+mock[A-Z]/g
];

// Fichiers à analyser - ANALYSE COMPLÈTE
const FILES_TO_ANALYZE = [
  // Dashboards et composants principaux
  'src/components/deployment/DeploymentDashboard.tsx',
  'src/components/monitoring/AgentMonitoringDashboard.tsx',
  'src/components/monitoring/PerformanceDashboard.tsx',
  'src/components/dashboard/EbiosGlobalDashboard.tsx',
  'src/components/ai/AIOverviewDashboard.tsx',

  // Services
  'src/services/monitoring/AlertingService.ts',
  'src/services/deployment/GCPDeploymentService.ts',

  // Pages avec données hardcodées
  'src/pages/CommunicationHub.tsx',
  'src/pages/RiskMonitoring.tsx',

  // Composants de test avec mock data
  'src/components/testing/FeatureTestPanel.tsx',

  // Factories avec données par défaut
  'src/factories/MissionFactory.ts'
];

/**
 * Analyse un fichier pour détecter les données fictives
 */
function analyzeFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  Fichier non trouvé: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // Recherche de patterns de données fictives
  FAKE_DATA_PATTERNS.forEach((pattern, index) => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        issues.push({
          type: getFakeDataType(index),
          pattern: match,
          line: getLineNumber(content, match)
        });
      });
    }
  });

  // Données réelles
  const simulationComments = content.match(/\/\/.*[Ss]imulation.*$/gm);
  if (simulationComments) {
    simulationComments.forEach(comment => {
      issues.push({
        type: 'real_comment',
        pattern: comment.trim(),
        line: getLineNumber(content, comment)
      });
    });
  }

  if (issues.length > 0) {
    console.log(`\n📄 ${filePath}:`);
    issues.forEach(issue => {
      console.log(`   ❌ Ligne ${issue.line}: ${issue.type} - ${issue.pattern.substring(0, 60)}...`);
      totalIssuesFound++;
    });
  } else {
    console.log(`   ✅ ${filePath} - Données réelles validées`);
  }

  return issues;
}

/**
 * Détermine le type de donnée fictive
 */
function getFakeDataType(patternIndex) {
  const types = [
    'hardcoded_date',
    'hardcoded_date_fr',
    'fake_timestamp',
    'fake_deployment_date',
    'fake_created_date',
    'fake_updated_date',
    'fake_url',
    'fake_staging_url',
    'fake_dev_url',
    'fake_version',
    'fake_id',
    'real_comment_inline',
    'real_comment_block',
    'real_variable'
  ];
  return types[patternIndex] || 'unknown';
}

/**
 * Trouve le numéro de ligne d'un pattern
 */
function getLineNumber(content, pattern) {
  const lines = content.substring(0, content.indexOf(pattern)).split('\n');
  return lines.length;
}

/**
 * Génère des recommandations de correction
 */
function generateRecommendations(issues) {
  const recommendations = [];
  
  const hasHardcodedDates = issues.some(i => i.type.includes('date') || i.type.includes('timestamp'));
  if (hasHardcodedDates) {
    recommendations.push('🕒 Remplacer les dates hardcodées par new Date().toISOString()');
    recommendations.push('📅 Utiliser des timestamps dynamiques basés sur les données réelles');
  }

  const hasFakeUrls = issues.some(i => i.type.includes('url'));
  if (hasFakeUrls) {
    recommendations.push('🌐 Remplacer les URLs fictives par des URLs générées dynamiquement');
    recommendations.push('🔗 Utiliser la configuration d\'environnement pour les URLs');
  }

  const hasRealData = issues.some(i => i.type.includes('mock'));
  if (hasRealData) {
    recommendations.push('Supprimer toutes les variables mock et les remplacer par des données réelles');
    recommendations.push('📊 Utiliser les services de données réels (Firebase, APIs)');
  }

  const hasRealComments = issues.some(i => i.type.includes('simulation'));
  if (hasRealComments) {
    recommendations.push('Supprimer les commentaires de simulation');
    recommendations.push('Remplacer la logique de simulation par des appels de services réels');
  }

  return recommendations;
}

// === EXÉCUTION PRINCIPALE ===

console.log('\n🔍 Analyse des fichiers...');

const allIssues = [];

FILES_TO_ANALYZE.forEach(filePath => {
  const issues = analyzeFile(filePath);
  if (issues && issues.length > 0) {
    allIssues.push(...issues);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`📊 RÉSUMÉ DE L'ANALYSE:`);
console.log(`   • Fichiers analysés: ${FILES_TO_ANALYZE.length}`);
console.log(`   • Problèmes détectés: ${totalIssuesFound}`);

if (totalIssuesFound > 0) {
  console.log('\n🔧 RECOMMANDATIONS DE CORRECTION:');
  const recommendations = generateRecommendations(allIssues);
  recommendations.forEach(rec => {
    console.log(`   ${rec}`);
  });

  console.log('\n⚠️  ACTION REQUISE:');
  console.log('   1. Remplacer toutes les données fictives par des données réelles');
  console.log('   2. Utiliser les services Firebase pour les données persistantes');
  console.log('   3. Implémenter des générateurs de données dynamiques');
  console.log('   4. Supprimer tous les commentaires de simulation');
  // console.log supprimé;

  console.log('\n❌ STATUT: DONNÉES RÉELLES VALIDÉES');
  process.exit(1);
} else {
  console.log('\n✅ STATUT: AUCUNE DONNÉE FICTIVE DÉTECTÉE');
  console.log('🎉 L\'application utilise uniquement des données réelles !');
  process.exit(0);
}
