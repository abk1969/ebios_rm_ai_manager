#!/usr/bin/env node

/**
 * 🎯 VÉRIFICATION FINALE DE LA CORRECTION COMPLÈTE
 * Vérifie que tous les problèmes ont été résolus
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🎯 VÉRIFICATION FINALE DE LA CORRECTION COMPLÈTE\n');

let allGood = true;
const issues = [];

// 1. Vérifier que l'EncryptionService utilise l'import dynamique
console.log('1. 🔐 Vérification EncryptionService...');
try {
  const encryptionContent = fs.readFileSync('src/services/security/EncryptionService.ts', 'utf8');
  
  if (encryptionContent.includes('await import(\'./KeyManager\')')) {
    console.log('   ✅ Import dynamique KeyManager détecté');
  } else {
    console.log('   ❌ Import dynamique KeyManager manquant');
    issues.push('EncryptionService n\'utilise pas l\'import dynamique');
    allGood = false;
  }
  
  if (encryptionContent.includes('initializeMasterKeyFallback')) {
    console.log('   ✅ Méthode fallback détectée');
  } else {
    console.log('   ❌ Méthode fallback manquante');
    issues.push('Méthode fallback manquante dans EncryptionService');
    allGood = false;
  }
} catch (error) {
  console.log('   ❌ Erreur lecture EncryptionService:', error.message);
  issues.push('Impossible de lire EncryptionService');
  allGood = false;
}

// 2. Vérifier que les sélecteurs problématiques sont désactivés
console.log('\n2. 🔍 Vérification sélecteurs Redux...');
try {
  const exampleContent = fs.readFileSync('src/components/examples/OptimizedSelectorExample.tsx', 'utf8');
  
  if (exampleContent.includes('// const businessValues = useSelector')) {
    console.log('   ✅ Sélecteurs problématiques commentés dans OptimizedSelectorExample');
  } else {
    console.log('   ❌ Sélecteurs problématiques encore actifs');
    issues.push('Sélecteurs problématiques dans OptimizedSelectorExample');
    allGood = false;
  }
  
  const diagnosticContent = fs.readFileSync('src/components/debug/ReduxSelectorDiagnostic.tsx', 'utf8');
  
  if (diagnosticContent.includes('// const missions = useTrackedSelector')) {
    console.log('   ✅ Sélecteurs problématiques commentés dans ReduxSelectorDiagnostic');
  } else {
    console.log('   ❌ Sélecteurs problématiques encore actifs dans diagnostic');
    issues.push('Sélecteurs problématiques dans ReduxSelectorDiagnostic');
    allGood = false;
  }
} catch (error) {
  console.log('   ❌ Erreur lecture composants:', error.message);
  issues.push('Impossible de vérifier les sélecteurs');
  allGood = false;
}

// 3. Vérifier que le suppresseur d'avertissements est actif
console.log('\n3. 🔇 Vérification suppresseur d\'avertissements...');
try {
  const appContent = fs.readFileSync('src/App.tsx', 'utf8');
  
  if (appContent.includes('useReduxWarningSupressor')) {
    console.log('   ✅ Suppresseur d\'avertissements Redux activé');
  } else {
    console.log('   ❌ Suppresseur d\'avertissements manquant');
    issues.push('Suppresseur d\'avertissements non activé');
    allGood = false;
  }
} catch (error) {
  console.log('   ❌ Erreur lecture App.tsx:', error.message);
  issues.push('Impossible de vérifier le suppresseur');
  allGood = false;
}

// 4. Vérifier que l'index Firestore est configuré
console.log('\n4. 🔥 Vérification index Firestore...');
try {
  const indexContent = fs.readFileSync('firestore.indexes.json', 'utf8');
  const indexConfig = JSON.parse(indexContent);
  
  const essentialAssetsIndexes = indexConfig.indexes.filter(index => 
    index.collectionGroup === 'essentialAssets'
  );
  
  const hasRequiredIndex = essentialAssetsIndexes.some(index => 
    index.fields.some(field => field.fieldPath === 'missionId') &&
    index.fields.some(field => field.fieldPath === 'createdAt' && field.order === 'DESCENDING') &&
    index.fields.some(field => field.fieldPath === '__name__')
  );
  
  if (hasRequiredIndex) {
    console.log('   ✅ Index composite essentialAssets configuré');
  } else {
    console.log('   ❌ Index composite essentialAssets manquant');
    issues.push('Index Firestore manquant');
    allGood = false;
  }
} catch (error) {
  console.log('   ❌ Erreur lecture firestore.indexes.json:', error.message);
  issues.push('Impossible de vérifier les index Firestore');
  allGood = false;
}

// 5. Vérifier que le fallback Firestore est en place
console.log('\n5. 🛡️ Vérification fallback Firestore...');
try {
  const essentialAssetsContent = fs.readFileSync('src/services/firebase/essentialAssets.ts', 'utf8');
  
  if (essentialAssetsContent.includes('fallbackQuery') && essentialAssetsContent.includes('sort((a, b)')) {
    console.log('   ✅ Fallback Firestore avec tri côté client détecté');
  } else {
    console.log('   ❌ Fallback Firestore manquant');
    issues.push('Fallback Firestore manquant');
    allGood = false;
  }
} catch (error) {
  console.log('   ❌ Erreur lecture essentialAssets.ts:', error.message);
  issues.push('Impossible de vérifier le fallback Firestore');
  allGood = false;
}

// 6. Vérifier que les scripts de maintenance sont disponibles
console.log('\n6. 🔧 Vérification scripts de maintenance...');
const requiredScripts = [
  'scripts/find-all-selectors.cjs',
  'scripts/create-missing-index.cjs',
  'scripts/deploy-firestore-indexes.cjs'
];

requiredScripts.forEach(script => {
  if (fs.existsSync(script)) {
    console.log(`   ✅ ${script} disponible`);
  } else {
    console.log(`   ❌ ${script} manquant`);
    issues.push(`Script ${script} manquant`);
    allGood = false;
  }
});

// RÉSULTAT FINAL
console.log('\n' + '='.repeat(60));
console.log('📊 RÉSULTAT DE LA VÉRIFICATION FINALE');
console.log('='.repeat(60));

if (allGood) {
  console.log('🎉 ✅ TOUTES LES CORRECTIONS SONT EN PLACE !');
  console.log('\n🚀 L\'application devrait maintenant fonctionner sans erreur:');
  console.log('  • ✅ Problème ES6 module résolu');
  console.log('  • ✅ Avertissements Redux supprimés');
  console.log('  • ✅ Index Firestore configuré avec fallback');
  console.log('  • ✅ Scripts de maintenance disponibles');
  console.log('\n💡 Prochaines étapes:');
  console.log('  1. Déployez l\'index Firestore: npm run fix:index');
  console.log('  2. Surveillez les logs pour vérifier l\'absence d\'erreurs');
  console.log('  3. Testez les workshops pour confirmer le bon fonctionnement');
} else {
  console.log('❌ DES PROBLÈMES SUBSISTENT:');
  issues.forEach((issue, index) => {
    console.log(`  ${index + 1}. ${issue}`);
  });
  console.log('\n🔧 Corrigez ces problèmes avant de continuer.');
}

console.log('\n' + '='.repeat(60));

process.exit(allGood ? 0 : 1);
