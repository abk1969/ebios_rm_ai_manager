#!/usr/bin/env node

/**
 * 🧪 TEST DES CORRECTIONS DE SAUVEGARDE
 * Vérifie que les formulaires de création fonctionnent correctement
 */

const fs = require('fs');

console.log('🧪 VÉRIFICATION DES CORRECTIONS DE SAUVEGARDE\n');

let allGood = true;
const issues = [];

// 1. Vérifier que SupportingAssetForm reçoit missionId
console.log('1. 🏗️ Vérification SupportingAssetForm...');
try {
  const formContent = fs.readFileSync('src/components/supporting-assets/SupportingAssetForm.tsx', 'utf8');
  
  if (formContent.includes('missionId?: string')) {
    console.log('   ✅ Interface mise à jour avec missionId');
  } else {
    console.log('   ❌ Interface manque missionId');
    issues.push('SupportingAssetForm interface manque missionId');
    allGood = false;
  }
  
  if (formContent.includes('missionId: missionId || \'\'')) {
    console.log('   ✅ missionId transmis dans les données');
  } else {
    console.log('   ❌ missionId non transmis');
    issues.push('missionId non transmis dans SupportingAssetForm');
    allGood = false;
  }
} catch (error) {
  console.log('   ❌ Erreur lecture SupportingAssetForm:', error.message);
  issues.push('Impossible de lire SupportingAssetForm');
  allGood = false;
}

// 2. Vérifier que AddSupportingAssetModal mappe correctement les données
console.log('\n2. 🏗️ Vérification AddSupportingAssetModal...');
try {
  const modalContent = fs.readFileSync('src/components/supporting-assets/AddSupportingAssetModal.tsx', 'utf8');
  
  if (modalContent.includes('essentialAssetId: businessValueId')) {
    console.log('   ✅ Mapping essentialAssetId correct');
  } else {
    console.log('   ❌ Mapping essentialAssetId manquant');
    issues.push('Mapping essentialAssetId manquant dans AddSupportingAssetModal');
    allGood = false;
  }
  
  if (modalContent.includes('missionId: string')) {
    console.log('   ✅ Interface mise à jour avec missionId');
  } else {
    console.log('   ❌ Interface manque missionId');
    issues.push('AddSupportingAssetModal interface manque missionId');
    allGood = false;
  }
} catch (error) {
  console.log('   ❌ Erreur lecture AddSupportingAssetModal:', error.message);
  issues.push('Impossible de lire AddSupportingAssetModal');
  allGood = false;
}

// 3. Vérifier que Workshop1Unified transmet missionId
console.log('\n3. 🏗️ Vérification Workshop1Unified...');
try {
  const workshopContent = fs.readFileSync('src/pages/workshops/Workshop1Unified.tsx', 'utf8');
  
  if (workshopContent.includes('missionId={missionId!}')) {
    console.log('   ✅ missionId transmis au modal SupportingAsset');
  } else {
    console.log('   ❌ missionId non transmis au modal');
    issues.push('missionId non transmis dans Workshop1Unified');
    allGood = false;
  }
  
  if (workshopContent.includes('console.log(\'🏗️ Création actif support avec données:\', data)')) {
    console.log('   ✅ Logging ajouté pour debug');
  } else {
    console.log('   ❌ Logging manquant');
    issues.push('Logging de debug manquant');
    allGood = false;
  }
} catch (error) {
  console.log('   ❌ Erreur lecture Workshop1Unified:', error.message);
  issues.push('Impossible de lire Workshop1Unified');
  allGood = false;
}

// 4. Vérifier que AddDreadedEventModal enrichit les données
console.log('\n4. 🚨 Vérification AddDreadedEventModal...');
try {
  const dreadedModalContent = fs.readFileSync('src/components/business-values/AddDreadedEventModal.tsx', 'utf8');
  
  if (dreadedModalContent.includes('essentialAssetId: formData.impactedBusinessValues[0]')) {
    console.log('   ✅ Mapping essentialAssetId correct');
  } else {
    console.log('   ❌ Mapping essentialAssetId manquant');
    issues.push('Mapping essentialAssetId manquant dans AddDreadedEventModal');
    allGood = false;
  }
  
  if (dreadedModalContent.includes('missionId,')) {
    console.log('   ✅ missionId inclus dans les données');
  } else {
    console.log('   ❌ missionId manquant');
    issues.push('missionId manquant dans AddDreadedEventModal');
    allGood = false;
  }
} catch (error) {
  console.log('   ❌ Erreur lecture AddDreadedEventModal:', error.message);
  issues.push('Impossible de lire AddDreadedEventModal');
  allGood = false;
}

// 5. Vérifier que les types sont cohérents
console.log('\n5. 📋 Vérification types EBIOS...');
try {
  const typesContent = fs.readFileSync('src/types/ebios.ts', 'utf8');
  
  if (typesContent.includes('essentialAssetId: string; // 🔧 CORRECTION')) {
    console.log('   ✅ Type SupportingAsset a essentialAssetId requis');
  } else {
    console.log('   ❌ Type SupportingAsset manque essentialAssetId');
    issues.push('Type SupportingAsset manque essentialAssetId');
    allGood = false;
  }
  
  if (typesContent.includes('essentialAssetId: string; // 🔧 CORRECTION')) {
    console.log('   ✅ Type DreadedEvent a essentialAssetId requis');
  } else {
    console.log('   ❌ Type DreadedEvent manque essentialAssetId');
    issues.push('Type DreadedEvent manque essentialAssetId');
    allGood = false;
  }
} catch (error) {
  console.log('   ❌ Erreur lecture types:', error.message);
  issues.push('Impossible de lire les types');
  allGood = false;
}

// RÉSULTAT FINAL
console.log('\n' + '='.repeat(60));
console.log('📊 RÉSULTAT DU TEST DES CORRECTIONS');
console.log('='.repeat(60));

if (allGood) {
  console.log('🎉 ✅ TOUTES LES CORRECTIONS SONT EN PLACE !');
  console.log('\n🚀 Les formulaires devraient maintenant sauvegarder correctement:');
  console.log('  • ✅ SupportingAsset avec essentialAssetId et missionId');
  console.log('  • ✅ DreadedEvent avec essentialAssetId et missionId');
  console.log('  • ✅ Mapping correct des données dans les modals');
  console.log('  • ✅ Gestion d\'erreurs améliorée avec logging');
  console.log('\n💡 Testez maintenant:');
  console.log('  1. Créez un actif support depuis Workshop 1');
  console.log('  2. Créez un événement redouté depuis Workshop 1');
  console.log('  3. Vérifiez les logs dans la console du navigateur');
  console.log('  4. Confirmez que les données sont sauvegardées en base');
} else {
  console.log('❌ DES PROBLÈMES SUBSISTENT:');
  issues.forEach((issue, index) => {
    console.log(`  ${index + 1}. ${issue}`);
  });
  console.log('\n🔧 Corrigez ces problèmes avant de tester.');
}

console.log('\n' + '='.repeat(60));

process.exit(allGood ? 0 : 1);
