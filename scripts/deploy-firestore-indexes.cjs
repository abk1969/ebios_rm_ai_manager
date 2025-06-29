#!/usr/bin/env node

/**
 * 🔥 SCRIPT DE DÉPLOIEMENT DES INDEX FIRESTORE
 * Déploie automatiquement les index nécessaires pour EBIOS RM
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Déploiement des index Firestore pour EBIOS RM...');

// Vérification de la présence de Firebase CLI
try {
  execSync('firebase --version', { stdio: 'pipe' });
  console.log('✅ Firebase CLI détecté');
} catch (error) {
  console.error('❌ Firebase CLI non installé. Installez-le avec: npm install -g firebase-tools');
  process.exit(1);
}

// Vérification du fichier d'index
const indexesFile = 'firestore.indexes.json';
if (!fs.existsSync(indexesFile)) {
  console.error(`❌ Fichier ${indexesFile} non trouvé`);
  process.exit(1);
}

// Lecture et validation du fichier d'index
let indexesConfig;
try {
  const indexesContent = fs.readFileSync(indexesFile, 'utf8');
  indexesConfig = JSON.parse(indexesContent);
  console.log(`✅ Configuration d'index chargée: ${indexesConfig.indexes.length} index(es)`);
} catch (error) {
  console.error('❌ Erreur lors de la lecture du fichier d\'index:', error.message);
  process.exit(1);
}

// Affichage des index à déployer
console.log('\n📋 Index à déployer:');
indexesConfig.indexes.forEach((index, i) => {
  console.log(`  ${i + 1}. Collection: ${index.collectionGroup}`);
  console.log(`     Champs: ${index.fields.map(f => `${f.fieldPath}(${f.order || f.arrayConfig})`).join(', ')}`);
});

// Déploiement des index
console.log('\n🚀 Déploiement en cours...');
try {
  // Déployer les index Firestore
  execSync('firebase deploy --only firestore:indexes', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ Index Firestore déployés avec succès !');
  console.log('⏳ Note: La création des index peut prendre quelques minutes.');
  console.log('📊 Vérifiez le statut dans la console Firebase: https://console.firebase.google.com');
  
} catch (error) {
  console.error('\n❌ Erreur lors du déploiement:', error.message);
  console.log('\n💡 Solutions possibles:');
  console.log('  1. Vérifiez que vous êtes connecté: firebase login');
  console.log('  2. Vérifiez le projet: firebase use --list');
  console.log('  3. Vérifiez les permissions du projet Firebase');
  process.exit(1);
}

console.log('\n🎉 Déploiement terminé !');
