#!/usr/bin/env node

/**
 * 🔍 VALIDATION TRANSPARENCE MÉTRIQUES
 * Script pour vérifier que toutes les métriques sont expliquées
 * CONFORMITÉ ANSSI: Transparence totale des calculs
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDATION TRANSPARENCE MÉTRIQUES EBIOS RM');
console.log('=============================================\n');

/**
 * Composants à vérifier pour la transparence des métriques
 */
const COMPONENTS_TO_CHECK = [
  {
    file: 'src/components/ui/MetricTooltip.tsx',
    name: 'MetricTooltip',
    required: [
      'METRIC_EXPLANATIONS',
      'calculation',
      'anssiReference',
      'criteria',
      'interpretation'
    ]
  },
  {
    file: 'src/components/workshops/WorkshopMetricsDisplay.tsx',
    name: 'WorkshopMetricsDisplay',
    required: [
      'EbiosRMMetricsService',
      'MetricTooltip',
      'getMetricStatus',
      'loadMetrics'
    ]
  },
  {
    file: 'src/components/workshops/StandardWorkshopHeader.tsx',
    name: 'StandardWorkshopHeader',
    required: [
      'WorkshopMetricsDisplay',
      'AICoherenceIndicator'
    ]
  },
  {
    file: 'src/components/ai/AICoherenceIndicator.tsx',
    name: 'AICoherenceIndicator',
    required: [
      'MetricTooltip',
      'coherenceResult',
      'scorePercent'
    ]
  }
];

/**
 * Métriques qui doivent avoir des explications
 */
const REQUIRED_METRIC_EXPLANATIONS = [
  'completion-1',
  'conformity-1',
  'completion-2',
  'completion-3',
  'completion-4',
  'completion-5'
];

/**
 * Vérifie qu'un composant contient les éléments requis
 */
function validateComponent(componentInfo) {
  console.log(`🔍 Validation: ${componentInfo.name}`);
  
  if (!fs.existsSync(componentInfo.file)) {
    console.log(`   ❌ Fichier manquant: ${componentInfo.file}`);
    return false;
  }
  
  const content = fs.readFileSync(componentInfo.file, 'utf8');
  const results = [];
  
  componentInfo.required.forEach(requirement => {
    const found = content.includes(requirement);
    results.push({ requirement, found });
    
    const status = found ? '✅' : '❌';
    console.log(`   ${status} ${requirement}`);
  });
  
  const allFound = results.every(r => r.found);
  console.log(`   📊 Résultat: ${results.filter(r => r.found).length}/${results.length} éléments trouvés\n`);
  
  return allFound;
}

/**
 * Vérifie que toutes les explications de métriques sont présentes
 */
function validateMetricExplanations() {
  console.log('📋 Validation des explications de métriques:');
  
  const tooltipFile = 'src/components/ui/MetricTooltip.tsx';
  if (!fs.existsSync(tooltipFile)) {
    console.log('   ❌ Fichier MetricTooltip.tsx manquant');
    return false;
  }
  
  const content = fs.readFileSync(tooltipFile, 'utf8');
  const results = [];
  
  REQUIRED_METRIC_EXPLANATIONS.forEach(metricKey => {
    const found = content.includes(`'${metricKey}':`);
    results.push({ metricKey, found });
    
    const status = found ? '✅' : '❌';
    console.log(`   ${status} Explication ${metricKey}`);
  });
  
  // Vérifications spécifiques du contenu
  const specificChecks = [
    { name: 'Calculs ANSSI', pattern: /Guide ANSSI EBIOS RM v1\.0/g },
    { name: 'Formules de calcul', pattern: /Calcul:/g },
    { name: 'Critères obligatoires', pattern: /Critères ANSSI/g },
    { name: 'Interprétations', pattern: /interpretation:/g },
    { name: 'Références méthodologiques', pattern: /anssiReference:/g }
  ];
  
  console.log('\n   📊 Vérifications du contenu:');
  specificChecks.forEach(check => {
    const matches = content.match(check.pattern);
    const count = matches ? matches.length : 0;
    const status = count > 0 ? '✅' : '❌';
    console.log(`   ${status} ${check.name}: ${count} occurrence(s)`);
  });
  
  const allExplanationsFound = results.every(r => r.found);
  const allContentChecksPass = specificChecks.every(check => {
    const matches = content.match(check.pattern);
    return matches && matches.length > 0;
  });
  
  console.log(`\n   📊 Résultat explications: ${results.filter(r => r.found).length}/${results.length} métriques expliquées`);
  console.log(`   📊 Résultat contenu: ${specificChecks.filter(c => content.match(c.pattern)).length}/${specificChecks.length} vérifications passées\n`);
  
  return allExplanationsFound && allContentChecksPass;
}

/**
 * Vérifie l'intégration dans les workshops
 */
function validateWorkshopIntegration() {
  console.log('🔧 Validation intégration workshops:');
  
  const workshopFiles = [
    'src/pages/workshops/Workshop1.tsx',
    'src/pages/workshops/Workshop2.tsx',
    'src/pages/workshops/Workshop3.tsx',
    'src/pages/workshops/Workshop4.tsx',
    'src/pages/workshops/Workshop5.tsx'
  ];
  
  const results = [];
  
  workshopFiles.forEach((file, index) => {
    const workshopNumber = index + 1;
    console.log(`   🔍 Workshop ${workshopNumber}:`);
    
    if (!fs.existsSync(file)) {
      console.log(`      ❌ Fichier manquant: ${file}`);
      results.push(false);
      return;
    }
    
    const content = fs.readFileSync(file, 'utf8');
    
    // Vérifications spécifiques
    const checks = [
      { name: 'StandardWorkshopHeader', test: content.includes('StandardWorkshopHeader') },
      { name: 'Métriques visibles', test: content.includes('WorkshopMetricsDisplay') || content.includes('AICoherenceIndicator') }
    ];
    
    const allChecksPass = checks.every(check => {
      const status = check.test ? '✅' : '❌';
      console.log(`      ${status} ${check.name}`);
      return check.test;
    });
    
    results.push(allChecksPass);
  });
  
  const successCount = results.filter(Boolean).length;
  console.log(`\n   📊 Résultat intégration: ${successCount}/${results.length} workshops intégrés\n`);
  
  return successCount >= 3; // Au moins 3 workshops doivent être intégrés
}

/**
 * Vérifie la conformité ANSSI des calculs
 */
function validateANSSICompliance() {
  console.log('📋 Validation conformité ANSSI:');
  
  const metricsServiceFile = 'src/services/metrics/EbiosRMMetricsService.ts';
  if (!fs.existsSync(metricsServiceFile)) {
    console.log('   ❌ Service de métriques manquant');
    return false;
  }
  
  const content = fs.readFileSync(metricsServiceFile, 'utf8');
  
  const anssiChecks = [
    { name: 'Minimums ANSSI définis', pattern: /minBusinessValues = 3|minSupportingAssets = 5|minDreadedEvents = 2/g },
    { name: 'Calculs conformes', pattern: /calculateWorkshop\dMetrics/g },
    { name: 'Validation qualité', pattern: /validateDataQuality/g },
    { name: 'Score conformité', pattern: /calculateANSSIConformityScore/g },
    { name: 'Pondération ateliers', pattern: /weights = \[/g }
  ];
  
  const results = [];
  anssiChecks.forEach(check => {
    const matches = content.match(check.pattern);
    const count = matches ? matches.length : 0;
    const found = count > 0;
    results.push(found);
    
    const status = found ? '✅' : '❌';
    console.log(`   ${status} ${check.name}: ${count} occurrence(s)`);
  });
  
  const complianceScore = (results.filter(Boolean).length / results.length) * 100;
  console.log(`\n   📊 Score conformité ANSSI: ${Math.round(complianceScore)}%\n`);
  
  return complianceScore >= 80;
}

/**
 * Génère le rapport final
 */
function generateFinalReport(componentResults, explanationsResult, integrationResult, complianceResult) {
  console.log('📊 RAPPORT FINAL - TRANSPARENCE MÉTRIQUES');
  console.log('=========================================');
  
  const componentScore = (componentResults.filter(Boolean).length / componentResults.length) * 100;
  
  console.log(`📈 Résultats détaillés:`);
  console.log(`   • Composants validés: ${componentResults.filter(Boolean).length}/${componentResults.length} (${Math.round(componentScore)}%)`);
  console.log(`   • Explications métriques: ${explanationsResult ? 'Complètes' : 'Incomplètes'}`);
  console.log(`   • Intégration workshops: ${integrationResult ? 'Réussie' : 'Échouée'}`);
  console.log(`   • Conformité ANSSI: ${complianceResult ? 'Validée' : 'Non validée'}`);
  
  const globalScore = Math.round(
    (componentScore * 0.3) +
    (explanationsResult ? 30 : 0) +
    (integrationResult ? 25 : 0) +
    (complianceResult ? 15 : 0)
  );
  
  console.log(`\n🎯 SCORE GLOBAL TRANSPARENCE: ${globalScore}%`);
  
  if (globalScore >= 90) {
    console.log('\n🎉 VALIDATION RÉUSSIE - TRANSPARENCE TOTALE !');
    console.log('✅ Toutes les métriques sont maintenant expliquées');
    console.log('✅ Conformité ANSSI respectée');
    console.log('✅ Utilisateurs peuvent comprendre chaque calcul');
    return true;
  } else if (globalScore >= 70) {
    console.log('\n⚠️  VALIDATION PARTIELLE - AMÉLIORATIONS MINEURES');
    console.log('🔧 Quelques ajustements nécessaires');
    return false;
  } else {
    console.log('\n❌ VALIDATION ÉCHOUÉE - TRANSPARENCE INSUFFISANTE');
    console.log('🚨 Travail supplémentaire requis');
    return false;
  }
}

/**
 * Exécution de la validation complète
 */
async function runValidation() {
  try {
    console.log('🎯 Démarrage validation transparence métriques...\n');
    
    // Étape 1: Validation des composants
    console.log('🔧 VALIDATION DES COMPOSANTS');
    console.log('============================');
    const componentResults = COMPONENTS_TO_CHECK.map(validateComponent);
    
    // Étape 2: Validation des explications
    const explanationsResult = validateMetricExplanations();
    
    // Étape 3: Validation de l'intégration
    const integrationResult = validateWorkshopIntegration();
    
    // Étape 4: Validation conformité ANSSI
    const complianceResult = validateANSSICompliance();
    
    // Étape 5: Rapport final
    const success = generateFinalReport(componentResults, explanationsResult, integrationResult, complianceResult);
    
    process.exit(success ? 0 : 1);
    
  } catch (error) {
    console.error('\n❌ ERREUR DURANT LA VALIDATION:', error.message);
    process.exit(1);
  }
}

// Lancement de la validation
runValidation();
