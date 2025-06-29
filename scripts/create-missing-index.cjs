#!/usr/bin/env node

/**
 * 🔥 CRÉATION AUTOMATIQUE DE L'INDEX FIRESTORE MANQUANT
 * Crée l'index spécifique requis par l'erreur Firestore
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔥 Création de l\'index Firestore manquant...');

// URL de l'erreur décodée
const errorUrl = 'https://console.firebase.google.com/v1/r/project/ebiosdatabase/firestore/indexes?create_composite=ClVwcm9qZWN0cy9lYmlvc2RhdGFiYXNlL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9lc3NlbnRpYWxBc3NldHMvaW5kZXhlcy9fEAEaDQoJbWlzc2lvbklkEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg';

console.log('📋 Index requis:');
console.log('  Collection: essentialAssets');
console.log('  Champs: missionId (ASC), createdAt (DESC), __name__ (ASC)');

// Vérifier si Firebase CLI est installé
try {
  execSync('firebase --version', { stdio: 'pipe' });
  console.log('✅ Firebase CLI détecté');
} catch (error) {
  console.error('❌ Firebase CLI non installé. Installez-le avec: npm install -g firebase-tools');
  console.log('\n💡 Ou créez l\'index manuellement via cette URL:');
  console.log(errorUrl);
  process.exit(1);
}

// Vérifier la connexion Firebase
try {
  const result = execSync('firebase projects:list', { encoding: 'utf8', stdio: 'pipe' });
  if (!result.includes('ebiosdatabase')) {
    console.error('❌ Projet ebiosdatabase non trouvé ou non accessible');
    console.log('💡 Connectez-vous avec: firebase login');
    console.log('💡 Sélectionnez le projet avec: firebase use ebiosdatabase');
    process.exit(1);
  }
  console.log('✅ Projet ebiosdatabase accessible');
} catch (error) {
  console.error('❌ Erreur de connexion Firebase:', error.message);
  console.log('\n💡 Solutions:');
  console.log('  1. Connectez-vous: firebase login');
  console.log('  2. Sélectionnez le projet: firebase use ebiosdatabase');
  console.log('  3. Ou créez l\'index manuellement: ' + errorUrl);
  process.exit(1);
}

// Déployer les index
console.log('\n🚀 Déploiement de l\'index...');
try {
  execSync('firebase deploy --only firestore:indexes', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ Index déployé avec succès !');
  console.log('⏳ La création de l\'index peut prendre quelques minutes.');
  console.log('📊 Vérifiez le statut: https://console.firebase.google.com/project/ebiosdatabase/firestore/indexes');
  
} catch (error) {
  console.error('\n❌ Erreur lors du déploiement:', error.message);
  console.log('\n💡 Créez l\'index manuellement via cette URL:');
  console.log(errorUrl);
  console.log('\n📋 Configuration de l\'index:');
  console.log('  Collection: essentialAssets');
  console.log('  Champs:');
  console.log('    - missionId: Ascending');
  console.log('    - createdAt: Descending');
  console.log('    - __name__: Ascending');
  process.exit(1);
}

console.log('\n🎉 Index créé ! L\'erreur Firestore devrait disparaître dans quelques minutes.');
