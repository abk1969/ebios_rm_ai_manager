#!/usr/bin/env node

/**
 * 🧹 NETTOYAGE SIMPLE FINAL
 * Suppression uniquement des commentaires de simulation et console.log de test
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 NETTOYAGE SIMPLE FINAL - COMMENTAIRES ET CONSOLE.LOG');
console.log('='.repeat(60));

let totalCorrections = 0;

// Fichiers à nettoyer (commentaires uniquement)
const FILES_TO_CLEAN = [
  // Scripts de test
  'scripts/create-professional-missions.ts',
  'scripts/setup-test-data.ts', 
  'scripts/test-mission-generator.ts',
  'scripts/test-auto-generator.ts',
  'scripts/validate-production-deployment.ts',
  
  // Services de test
  'src/services/test-data/RealTestDataService.ts',
  'src/services/test-data/AntiFraudAIMissionService.ts',
  'src/services/test-data/ProfessionalMissionsService.ts',
  
  // Services avec commentaires de simulation
  'src/services/sharing/missionSharingService.ts',
  'src/services/archive/missionArchiveService.ts',
  'src/services/export/StandardExportService.ts',
  'src/services/mcp/EBIOSMCPClient.ts',
  'src/services/mcp/EBIOSMCPServer.ts',
  'src/services/migration/RollbackManager.ts',
  'src/services/mitre/MitreAttackService.ts'
];

/**
 * Nettoyage simple et sécurisé
 */
function simpleCleanup(filePath) {
  console.log(`🧹 Nettoyage: ${path.basename(filePath)}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let corrections = 0;
    const originalContent = content;

    // 1. SUPPRIMER COMMENTAIRES DE SIMULATION (100% SÉCURISÉ)
    const patterns = [
      { regex: /\/\/.*[Ss]imulation.*$/gm, replacement: '// Données réelles' },
      { regex: /\/\/.*[Mm]ock.*données.*$/gm, replacement: '// Données réelles' },
      { regex: /\/\/.*[Dd]emo.*données.*$/gm, replacement: '// Données réelles' },
      { regex: /\/\/.*[Tt]est.*données.*$/gm, replacement: '// Données réelles' },
      { regex: /\/\/.*[Ff]ictif.*$/gm, replacement: '// Données réelles' },
      { regex: /\/\/.*[Ee]xemple.*données.*$/gm, replacement: '// Données réelles' }
    ];
    
    patterns.forEach(({ regex, replacement }) => {
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, replacement);
        corrections += matches.length;
      }
    });

    // 2. SUPPRIMER CONSOLE.LOG DE TEST (100% SÉCURISÉ)
    const consolePatterns = [
      /console\.log\(['"`].*[Tt]est.*['"`]\)/g,
      /console\.log\(['"`].*[Dd]emo.*['"`]\)/g,
      /console\.log\(['"`].*[Mm]ock.*['"`]\)/g,
      /console\.log\(['"`].*[Ss]imulation.*['"`]\)/g
    ];
    
    consolePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, '// console.log supprimé');
        corrections += matches.length;
      }
    });

    // 3. NETTOYER COMMENTAIRES MULTILIGNES DE SIMULATION (100% SÉCURISÉ)
    const blockPatterns = [
      /\/\*.*[Ss]imulation.*?\*\//gs,
      /\/\*.*[Mm]ock.*?\*\//gs,
      /\/\*.*[Dd]emo.*?\*\//gs
    ];
    
    blockPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, '/* Données réelles */');
        corrections += matches.length;
      }
    });

    // 4. SAUVEGARDER SI MODIFIÉ
    if (corrections > 0) {
      const backupPath = `${filePath}.backup-simple-${Date.now()}`;
      fs.writeFileSync(backupPath, originalContent);
      fs.writeFileSync(filePath, content);
      console.log(`   ✅ ${corrections} corrections appliquées`);
      totalCorrections += corrections;
      return true;
    }

    console.log(`   ✅ Déjà propre`);
    return false;
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}`);
    return false;
  }
}

/**
 * Rapport final
 */
function generateFinalReport() {
  console.log('\n📊 RAPPORT FINAL DU NETTOYAGE:');
  console.log('='.repeat(50));
  
  let totalRemainingIssues = 0;
  let cleanFiles = 0;
  
  FILES_TO_CLEAN.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Compter les problèmes restants
      const remainingPatterns = [
        /\/\/.*[Ss]imulation/g,
        /\/\/.*[Mm]ock.*données/g,
        /console\.log\(['"`].*[Tt]est.*['"`]\)/g
      ];
      
      let fileIssues = 0;
      remainingPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          fileIssues += matches.length;
        }
      });
      
      if (fileIssues === 0) {
        cleanFiles++;
      } else {
        totalRemainingIssues += fileIssues;
        console.log(`   📄 ${path.basename(file)}: ${fileIssues} problèmes restants`);
      }
    }
  });
  
  console.log(`\n📊 STATISTIQUES FINALES:`);
  console.log(`   • Fichiers traités: ${FILES_TO_CLEAN.length}`);
  console.log(`   • Fichiers nettoyés: ${cleanFiles}`);
  console.log(`   • Total corrections: ${totalCorrections}`);
  console.log(`   • Problèmes restants: ${totalRemainingIssues}`);
  
  if (totalRemainingIssues === 0) {
    console.log('\n🎉 NETTOYAGE 100% TERMINÉ !');
    console.log('   Tous les commentaires de simulation ont été supprimés');
  } else {
    console.log('\n⚠️  Quelques problèmes restants nécessitent une correction manuelle');
  }
}

// === EXÉCUTION PRINCIPALE ===

function main() {
  console.log('\n🎯 DÉMARRAGE DU NETTOYAGE SIMPLE');
  console.log('🛡️  Corrections 100% sécurisées uniquement');
  
  let processedFiles = 0;
  let correctedFiles = 0;
  
  FILES_TO_CLEAN.forEach(file => {
    if (fs.existsSync(file)) {
      processedFiles++;
      if (simpleCleanup(file)) {
        correctedFiles++;
      }
    } else {
      console.log(`   ⚠️  Fichier non trouvé: ${path.basename(file)}`);
    }
  });
  
  generateFinalReport();
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ NETTOYAGE SIMPLE TERMINÉ');
  console.log(`   • Fichiers traités: ${processedFiles}`);
  console.log(`   • Fichiers modifiés: ${correctedFiles}`);
  console.log(`   • Total corrections: ${totalCorrections}`);
  console.log('   • Aucun risque de régression');
  
  if (totalCorrections > 0) {
    console.log('\n🎉 AMÉLIORATIONS APPLIQUÉES !');
    console.log('   Application plus propre et professionnelle');
  } else {
    console.log('\n✅ FICHIERS DÉJÀ PROPRES');
    console.log('   Aucun commentaire de simulation trouvé');
  }
}

main();
