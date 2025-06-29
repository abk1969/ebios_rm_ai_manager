#!/usr/bin/env node

/**
 * 🔍 VALIDATION MODÈLE GEMINI
 * Script pour valider que tous les fichiers utilisent le bon modèle Gemini
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 VALIDATION MODÈLE GEMINI');
console.log('============================\n');

const expectedModel = 'gemini-2.5-flash-preview-05-20';
const oldModel = 'gemini-2.0-flash-exp';

// Fichiers à vérifier
const filesToCheck = [
  '.env',
  '.env.example',
  'scripts/setup-api-keys.cjs'
];

let allValid = true;
let totalChecks = 0;
let validChecks = 0;

console.log(`🎯 Modèle attendu: ${expectedModel}`);
console.log(`❌ Ancien modèle: ${oldModel}\n`);

filesToCheck.forEach(filePath => {
  console.log(`🔍 Vérification: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  Fichier non trouvé: ${filePath}`);
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Recherche de l'ancien modèle
    const oldModelMatches = content.match(new RegExp(oldModel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
    if (oldModelMatches) {
      console.log(`   ❌ Ancien modèle trouvé ${oldModelMatches.length} fois`);
      allValid = false;
    }
    
    // Recherche du nouveau modèle
    const newModelMatches = content.match(new RegExp(expectedModel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
    if (newModelMatches) {
      console.log(`   ✅ Nouveau modèle trouvé ${newModelMatches.length} fois`);
      validChecks += newModelMatches.length;
    }
    
    totalChecks++;
    
    // Recherche de toute référence Gemini
    const geminiMatches = content.match(/gemini-[0-9.-]+[a-z0-9-]*/gi);
    if (geminiMatches) {
      const uniqueModels = [...new Set(geminiMatches)];
      console.log(`   📋 Modèles Gemini trouvés: ${uniqueModels.join(', ')}`);

      // Vérification que tous les modèles sont corrects
      const incorrectModels = uniqueModels.filter(model => model.toLowerCase() !== expectedModel.toLowerCase());
      if (incorrectModels.length > 0) {
        console.log(`   ⚠️  Modèles incorrects: ${incorrectModels.join(', ')}`);
        allValid = false;
      }
    }
    
  } catch (error) {
    console.log(`   ❌ Erreur lecture: ${error.message}`);
    allValid = false;
  }
  
  console.log('');
});

// Vérification des variables d'environnement si .env existe
if (fs.existsSync('.env')) {
  console.log('🔧 Vérification variables d\'environnement...');
  
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const envLines = envContent.split('\n');
    
    const geminiModelLine = envLines.find(line => line.startsWith('GEMINI_MODEL='));
    if (geminiModelLine) {
      const modelValue = geminiModelLine.split('=')[1];
      if (modelValue === expectedModel) {
        console.log(`   ✅ GEMINI_MODEL: ${modelValue}`);
      } else {
        console.log(`   ❌ GEMINI_MODEL incorrect: ${modelValue} (attendu: ${expectedModel})`);
        allValid = false;
      }
    } else {
      console.log('   ⚠️  GEMINI_MODEL non trouvé dans .env');
    }
    
    // Vérification des modèles d'agents
    const agentModels = [
      'DOCUMENTATION_AGENT_MODEL',
      'ANSSI_VALIDATION_AGENT_MODEL',
      'RISK_ANALYSIS_AGENT_MODEL',
      'THREAT_INTELLIGENCE_AGENT_MODEL',
      'PERFORMANCE_OPTIMIZER_MODEL',
      'PREDICTIVE_INTELLIGENCE_MODEL'
    ];
    
    agentModels.forEach(agentModel => {
      const agentLine = envLines.find(line => line.startsWith(`${agentModel}=`));
      if (agentLine) {
        const modelValue = agentLine.split('=')[1];
        if (modelValue === expectedModel) {
          console.log(`   ✅ ${agentModel}: ${modelValue}`);
        } else {
          console.log(`   ❌ ${agentModel} incorrect: ${modelValue} (attendu: ${expectedModel})`);
          allValid = false;
        }
      }
    });
    
  } catch (error) {
    console.log(`   ❌ Erreur lecture .env: ${error.message}`);
    allValid = false;
  }
  
  console.log('');
}

// Résumé final
console.log('📊 RÉSUMÉ VALIDATION');
console.log('====================');
console.log(`📁 Fichiers vérifiés: ${totalChecks}`);
console.log(`✅ Configurations valides: ${validChecks}`);

if (allValid) {
  console.log('🎉 VALIDATION RÉUSSIE !');
  console.log(`✅ Tous les fichiers utilisent le modèle correct: ${expectedModel}`);
  console.log('✅ Configuration Gemini cohérente dans tout le projet');
  console.log('✅ Prêt pour utilisation avec Gemini 2.5 Flash Preview');
  
  console.log('\n🚀 PROCHAINES ÉTAPES:');
  console.log('1. Configurez votre clé API Google Gemini');
  console.log('2. Redémarrez l\'application');
  console.log('3. Testez les fonctionnalités IA');
  
  process.exit(0);
} else {
  console.log('❌ VALIDATION ÉCHOUÉE !');
  console.log('⚠️  Des configurations incorrectes ont été détectées');
  console.log('🔧 Corrigez les erreurs ci-dessus et relancez la validation');
  
  console.log('\n🛠️  ACTIONS CORRECTIVES:');
  console.log(`1. Remplacez toutes les occurrences de "${oldModel}"`);
  console.log(`2. Par "${expectedModel}"`);
  console.log('3. Relancez ce script de validation');
  
  process.exit(1);
}
