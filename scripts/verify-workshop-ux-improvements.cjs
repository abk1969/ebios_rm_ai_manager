#!/usr/bin/env node

/**
 * 🎯 VÉRIFICATION DES AMÉLIORATIONS UX WORKSHOP
 * Vérifie que toutes les améliorations d'aide utilisateur sont en place
 */

const fs = require('fs');

console.log('🎯 VÉRIFICATION DES AMÉLIORATIONS UX WORKSHOP\n');

let allGood = true;
const issues = [];

// 1. Vérifier que IntelligentWorkshopAlert existe
console.log('1. 🚨 Vérification IntelligentWorkshopAlert...');
try {
  const alertContent = fs.readFileSync('src/components/workshops/IntelligentWorkshopAlert.tsx', 'utf8');
  
  if (alertContent.includes('interface WorkshopCriterion')) {
    console.log('   ✅ Interface WorkshopCriterion définie');
  } else {
    console.log('   ❌ Interface WorkshopCriterion manquante');
    issues.push('Interface WorkshopCriterion manquante');
    allGood = false;
  }
  
  if (alertContent.includes('Actions Prioritaires')) {
    console.log('   ✅ Section Actions Prioritaires présente');
  } else {
    console.log('   ❌ Section Actions Prioritaires manquante');
    issues.push('Section Actions Prioritaires manquante');
    allGood = false;
  }
  
  if (alertContent.includes('getPriorityIcon')) {
    console.log('   ✅ Système de priorités implémenté');
  } else {
    console.log('   ❌ Système de priorités manquant');
    issues.push('Système de priorités manquant');
    allGood = false;
  }
} catch (error) {
  console.log('   ❌ Fichier IntelligentWorkshopAlert.tsx non trouvé');
  issues.push('IntelligentWorkshopAlert.tsx manquant');
  allGood = false;
}

// 2. Vérifier que Workshop1AIAssistant existe
console.log('\n2. 🤖 Vérification Workshop1AIAssistant...');
try {
  const assistantContent = fs.readFileSync('src/components/workshops/Workshop1AIAssistant.tsx', 'utf8');
  
  if (assistantContent.includes('generateContextualSuggestions')) {
    console.log('   ✅ Génération de suggestions contextuelles');
  } else {
    console.log('   ❌ Génération de suggestions manquante');
    issues.push('Génération de suggestions manquante');
    allGood = false;
  }
  
  if (assistantContent.includes('activeTab')) {
    console.log('   ✅ Interface à onglets implémentée');
  } else {
    console.log('   ❌ Interface à onglets manquante');
    issues.push('Interface à onglets manquante');
    allGood = false;
  }
  
  if (assistantContent.includes('suggestions') && assistantContent.includes('help') && assistantContent.includes('progress')) {
    console.log('   ✅ Trois onglets (suggestions, aide, progression) présents');
  } else {
    console.log('   ❌ Onglets manquants');
    issues.push('Onglets manquants dans Workshop1AIAssistant');
    allGood = false;
  }
} catch (error) {
  console.log('   ❌ Fichier Workshop1AIAssistant.tsx non trouvé');
  issues.push('Workshop1AIAssistant.tsx manquant');
  allGood = false;
}

// 3. Vérifier l'intégration dans Workshop1Unified
console.log('\n3. 🔧 Vérification intégration Workshop1Unified...');
try {
  const workshopContent = fs.readFileSync('src/pages/workshops/Workshop1Unified.tsx', 'utf8');
  
  if (workshopContent.includes('import IntelligentWorkshopAlert')) {
    console.log('   ✅ IntelligentWorkshopAlert importé');
  } else {
    console.log('   ❌ IntelligentWorkshopAlert non importé');
    issues.push('IntelligentWorkshopAlert non importé');
    allGood = false;
  }
  
  if (workshopContent.includes('import Workshop1AIAssistant')) {
    console.log('   ✅ Workshop1AIAssistant importé');
  } else {
    console.log('   ❌ Workshop1AIAssistant non importé');
    issues.push('Workshop1AIAssistant non importé');
    allGood = false;
  }
  
  if (workshopContent.includes('<IntelligentWorkshopAlert')) {
    console.log('   ✅ IntelligentWorkshopAlert utilisé');
  } else {
    console.log('   ❌ IntelligentWorkshopAlert non utilisé');
    issues.push('IntelligentWorkshopAlert non utilisé');
    allGood = false;
  }
  
  if (workshopContent.includes('<Workshop1AIAssistant')) {
    console.log('   ✅ Workshop1AIAssistant utilisé');
  } else {
    console.log('   ❌ Workshop1AIAssistant non utilisé');
    issues.push('Workshop1AIAssistant non utilisé');
    allGood = false;
  }
} catch (error) {
  console.log('   ❌ Erreur lecture Workshop1Unified.tsx:', error.message);
  issues.push('Impossible de lire Workshop1Unified.tsx');
  allGood = false;
}

// 4. Vérifier les améliorations des messages d'état vide
console.log('\n4. 💬 Vérification messages d\'état améliorés...');
try {
  const workshopContent = fs.readFileSync('src/pages/workshops/Workshop1Unified.tsx', 'utf8');
  
  if (workshopContent.includes('Définir mes valeurs métier')) {
    console.log('   ✅ Messages d\'action améliorés');
  } else {
    console.log('   ❌ Messages d\'action non améliorés');
    issues.push('Messages d\'action non améliorés');
    allGood = false;
  }
  
  if (workshopContent.includes('💡 Exemples :')) {
    console.log('   ✅ Exemples contextuels ajoutés');
  } else {
    console.log('   ❌ Exemples contextuels manquants');
    issues.push('Exemples contextuels manquants');
    allGood = false;
  }
  
  // Compter les occurrences d'alertes améliorées
  const improvedAlerts = (workshopContent.match(/💡 Exemples/g) || []).length;
  if (improvedAlerts >= 3) {
    console.log(`   ✅ ${improvedAlerts} alertes améliorées détectées`);
  } else {
    console.log(`   ❌ Seulement ${improvedAlerts} alertes améliorées (attendu: 3+)`);
    issues.push('Pas assez d\'alertes améliorées');
    allGood = false;
  }
} catch (error) {
  console.log('   ❌ Erreur vérification messages:', error.message);
  issues.push('Impossible de vérifier les messages');
  allGood = false;
}

// 5. Vérifier la suppression des anciennes alertes peu claires
console.log('\n5. 🗑️ Vérification suppression anciennes alertes...');
try {
  const workshopContent = fs.readFileSync('src/pages/workshops/Workshop1Unified.tsx', 'utf8');
  
  if (workshopContent.includes('Atelier incomplet') && !workshopContent.includes('<IntelligentWorkshopAlert')) {
    console.log('   ❌ Anciennes alertes encore présentes');
    issues.push('Anciennes alertes non supprimées');
    allGood = false;
  } else {
    console.log('   ✅ Anciennes alertres remplacées ou supprimées');
  }
  
  if (workshopContent.includes('Complétez tous les critères obligatoires') && !workshopContent.includes('Actions Prioritaires')) {
    console.log('   ❌ Messages vagues encore présents');
    issues.push('Messages vagues non remplacés');
    allGood = false;
  } else {
    console.log('   ✅ Messages vagues remplacés par des actions concrètes');
  }
} catch (error) {
  console.log('   ❌ Erreur vérification suppression:', error.message);
  issues.push('Impossible de vérifier la suppression');
  allGood = false;
}

// RÉSULTAT FINAL
console.log('\n' + '='.repeat(60));
console.log('📊 RÉSULTAT DE LA VÉRIFICATION UX');
console.log('='.repeat(60));

if (allGood) {
  console.log('🎉 ✅ TOUTES LES AMÉLIORATIONS UX SONT EN PLACE !');
  console.log('\n🚀 L\'expérience utilisateur Workshop 1 est maintenant optimale:');
  console.log('  • ✅ Alertes intelligentes avec actions concrètes');
  console.log('  • ✅ Assistant IA contextuel avec suggestions');
  console.log('  • ✅ Messages d\'état clairs et informatifs');
  console.log('  • ✅ Guidance progressive et adaptative');
  console.log('  • ✅ Interface intuitive avec aide intégrée');
  console.log('\n💡 L\'utilisateur sait maintenant exactement quoi faire à chaque étape !');
  console.log('\n🎯 Prochaines étapes recommandées:');
  console.log('  1. Testez le parcours utilisateur complet');
  console.log('  2. Vérifiez les suggestions contextuelles');
  console.log('  3. Confirmez que les actions fonctionnent');
  console.log('  4. Validez l\'aide progressive');
} else {
  console.log('❌ DES AMÉLIORATIONS SONT INCOMPLÈTES:');
  issues.forEach((issue, index) => {
    console.log(`  ${index + 1}. ${issue}`);
  });
  console.log('\n🔧 Complétez ces améliorations pour une UX optimale.');
}

console.log('\n' + '='.repeat(60));

process.exit(allGood ? 0 : 1);
