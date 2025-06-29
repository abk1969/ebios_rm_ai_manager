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
const indexFile = path.join(__dirname, '..', 'firestore.indexes.json');
if (!fs.existsSync(indexFile)) {
  console.error('❌ Fichier firestore.indexes.json non trouvé');
  process.exit(1);
}

console.log('📋 Index à déployer:');
const indexes = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
indexes.indexes.forEach((index, i) => {
  console.log(`  ${i + 1}. Collection: ${index.collectionGroup}`);
  console.log(`     Champs: ${index.fields.map(f => f.fieldPath).join(', ')}`);
});

console.log('\n🚀 Déploiement en cours...');

try {
  // Déploiement des index
  execSync('firebase deploy --only firestore:indexes', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('\n✅ Index Firestore déployés avec succès !');
  console.log('⏳ Les index peuvent prendre quelques minutes à être construits...');
  console.log('📊 Vérifiez le statut dans la console Firebase: https://console.firebase.google.com');
  
} catch (error) {
  console.error('❌ Erreur lors du déploiement des index:', error.message);
  console.log('\n💡 Solutions possibles:');
  console.log('1. Vérifiez que vous êtes connecté: firebase login');
  console.log('2. Vérifiez le projet: firebase use --list');
  console.log('3. Initialisez Firebase si nécessaire: firebase init');
  process.exit(1);
}
