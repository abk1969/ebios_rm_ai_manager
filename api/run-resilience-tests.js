#!/usr/bin/env node
/**
 * 🧪 SCRIPT D'EXÉCUTION DES TESTS DE RÉSILIENCE
 * Lance les tests de robustesse du système EBIOS RM
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
const { ResilienceTestSuite } = require('./tests/resilience-tests');
const axios = require('axios');

async function waitForServices() {
  console.log('⏳ Attente de la disponibilité des services...');
  
  const services = [
    { name: 'API Principal', url: 'http://localhost:3000/health' },
    { name: 'Service AI Python', url: 'http://localhost:8081/health' }
  ];
  
  for (const service of services) {
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      try {
        await axios.get(service.url, { timeout: 2000 });
        console.log(`✅ ${service.name} disponible`);
        break;
      } catch (__error) {
        attempts++;
        if (attempts >= maxAttempts) {
          console.warn(`⚠️ ${service.name} non disponible après ${maxAttempts} tentatives`);
          console.warn(`   Les tests continueront en mode dégradé`);
        } else {
          console.log(`🔄 ${service.name} non disponible, tentative ${attempts}/${maxAttempts}...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
  }
}

async function generateTestReport(results) {
  const report = {
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    },
    summary: results.summary,
    testDetails: results.details,
    recommendations: []
  };

  // Générer des recommandations basées sur les résultats
  if (results.summary.successRate < 80) {
    report.recommendations.push({
      priority: 'HIGH',
      message: 'Taux de réussite faible - Vérifier la configuration des services'
    });
  }

  if (results.summary.successRate < 95) {
    report.recommendations.push({
      priority: 'MEDIUM',
      message: 'Optimiser la gestion d\'erreurs et les timeouts'
    });
  }

  const failedTests = results.details.filter(t => t.status === 'FAILED');
  if (failedTests.length > 0) {
    report.recommendations.push({
      priority: 'HIGH',
      message: `Tests échoués: ${failedTests.map(t => t.name).join(', ')}`
    });
  }

  // Sauvegarder le rapport
  const fs = require('fs');
  const reportPath = `./test-reports/resilience-report-${Date.now()}.json`;
  
  try {
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync('./test-reports')) {
      fs.mkdirSync('./test-reports', { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Rapport sauvegardé: ${reportPath}`);
  } catch (__error) {
    console.warn(`⚠️ Impossible de sauvegarder le rapport: ${error.message}`);
  }

  return report;
}

async function main() {
  console.log('🧪 TESTS DE RÉSILIENCE EBIOS RM');
  console.log('================================');
  console.log(`Démarrage: ${new Date().toISOString()}`);
  
  try {
    // Attendre que les services soient disponibles
    await waitForServices();
    
    // Créer et exécuter la suite de tests
    const testSuite = new ResilienceTestSuite();
    const results = await testSuite.runAllTests();
    
    // Générer le rapport
    const report = await generateTestReport(results);
    
    // Afficher le résumé final
    console.log('\n🎯 RÉSUMÉ FINAL');
    console.log('================');
    
    if (results.summary.successRate >= 95) {
      console.log('🟢 EXCELLENT - Système très résilient');
    } else if (results.summary.successRate >= 80) {
      console.log('🟡 BON - Système résilient avec quelques améliorations possibles');
    } else {
      console.log('🔴 ATTENTION - Système nécessite des améliorations importantes');
    }
    
    console.log(`Taux de réussite: ${results.summary.successRate.toFixed(1)}%`);
    console.log(`Durée totale: ${(results.summary.duration / 1000).toFixed(1)}s`);
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMMANDATIONS:');
      report.recommendations.forEach(rec => {
        console.log(`   [${rec.priority}] ${rec.message}`);
      });
    }
    
    // Code de sortie basé sur le taux de réussite
    const exitCode = results.summary.successRate >= 80 ? 0 : 1;
    process.exit(exitCode);
    
  } catch (__error) {
    console.error('💥 ERREUR CRITIQUE:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Gestion des signaux pour un arrêt propre
process.on('SIGINT', () => {
  console.log('\n⚠️ Tests interrompus par l\'utilisateur');
  process.exit(130);
});

process.on('SIGTERM', () => {
  console.log('\n⚠️ Tests terminés par le système');
  process.exit(143);
});

// Exécuter le script principal
if (require.main === module) {
  main();
}

module.exports = { main };
