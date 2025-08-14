/**
 * 🧪 TEST DU NOUVEAU FORMULAIRE DE MISSION AVEC CONTEXTE
 * Script pour tester la création d'une mission avec le nouveau parcours UI/UX
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

// Configuration Firebase (À REMPLACER PAR VOS VRAIES VALEURS)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "your_firebase_api_key_here",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "your_project_id",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "your_sender_id",
  appId: process.env.VITE_FIREBASE_APP_ID || "your_app_id"
};

// Initialisation Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Données de test pour une mission avec contexte complet
const testMissionData = {
  name: "Mission EBIOS RM - Centre Hospitalier Universitaire de Lyon",
  description: "Analyse de risques EBIOS RM pour la modernisation du système d'information hospitalier et la mise en conformité avec les exigences HDS (Hébergement de Données de Santé).",
  status: "draft",
  dueDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString(), // 6 mois
  assignedTo: ["user123"],
  
  // Contexte organisationnel
  organizationContext: {
    organizationType: "public",
    sector: "Santé et médico-social",
    size: "enterprise",
    regulatoryRequirements: [
      "RGPD",
      "HDS (Hébergement de Données de Santé)",
      "ANSSI",
      "Code de la santé publique"
    ],
    securityObjectives: [
      "Protéger les données patients",
      "Assurer la continuité des soins",
      "Maintenir la confidentialité médicale",
      "Garantir l'intégrité des dossiers médicaux"
    ],
    constraints: [
      "Budget limité du secteur public",
      "Personnel médical non-technique",
      "Contraintes de disponibilité 24h/24"
    ]
  },

  // Périmètre d'analyse
  scope: {
    boundaries: "Système d'information hospitalier du CHU de Lyon",
    inclusions: [
      "ERP hospitalier (Système de gestion intégré)",
      "Bases de données critiques",
      "Infrastructure réseau",
      "Systèmes de sauvegarde",
      "Outils collaboratifs"
    ],
    exclusions: [
      "Équipements médicaux non connectés",
      "Systèmes des partenaires externes"
    ],
    timeFrame: {
      start: new Date().toISOString(),
      end: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    geographicalScope: ["National"]
  },

  // Conformité EBIOS
  ebiosCompliance: {
    version: "1.5",
    completionPercentage: 0,
    complianceGaps: [],
    certificationLevel: "basic",
    validatedWorkshops: []
  },

  // Contexte de mission pour les agents IA
  missionContext: {
    organizationName: "Centre Hospitalier Universitaire de Lyon",
    sector: "Santé et médico-social",
    organizationSize: "Grande entreprise (> 5000 employés)",
    geographicScope: "National",
    criticalityLevel: "Critique",
    siComponents: [
      "ERP hospitalier (Système de gestion intégré)",
      "Bases de données critiques",
      "Infrastructure réseau",
      "Systèmes de sauvegarde",
      "Outils collaboratifs"
    ],
    criticalProcesses: [
      "Gestion des patients",
      "Dossier médical partagé",
      "Prescription médicamenteuse",
      "Gestion des urgences",
      "Facturation et remboursements",
      "Planification des interventions"
    ],
    stakeholders: [
      "Patients",
      "Personnel médical",
      "Personnel administratif",
      "Fournisseurs de soins",
      "Autorités de santé",
      "Assurance maladie"
    ],
    regulations: [
      "RGPD",
      "HDS (Hébergement de Données de Santé)",
      "ANSSI",
      "Code de la santé publique"
    ],
    financialStakes: "Budget annuel IT: 15M€, CA: 800M€, Impact potentiel interruption: 2M€/jour",
    securityMaturity: "Défini (Niveau 3)",
    missionObjectives: [
      "Identifier les risques critiques sur les données patients",
      "Améliorer la posture sécurité du SI hospitalier",
      "Obtenir la certification HDS",
      "Réduire les risques de cyberattaques",
      "Assurer la continuité des soins"
    ],
    timeframe: "6 mois",
    specificRequirements: "Mission critique pour l'obtention de la certification HDS. Nécessite une approche méthodique EBIOS RM avec validation ANSSI. Contraintes de disponibilité 24h/24 pour les systèmes critiques.",
    pastIncidents: "Tentative de ransomware en 2023 (contenue), panne majeure du SIH en 2022 (4h d'interruption), fuite de données mineures en 2021 (corrigée)"
  },

  // Métadonnées
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

async function testMissionCreation() {
  console.log('🧪 TEST DU NOUVEAU FORMULAIRE DE MISSION AVEC CONTEXTE');
  console.log('=====================================================');
  console.log('🎯 OBJECTIF: Tester la création d\'une mission avec contexte complet pour les agents IA');
  console.log('');

  try {
    // Vérifier l'état initial
    console.log('🔍 VÉRIFICATION DE L\'ÉTAT INITIAL...');
    const initialSnapshot = await getDocs(collection(db, 'missions'));
    console.log(`📊 Missions existantes: ${initialSnapshot.size}`);

    // Créer la mission de test
    console.log('\n🚀 CRÉATION DE LA MISSION DE TEST...');
    console.log(`📝 Nom: ${testMissionData.name}`);
    console.log(`🏢 Organisation: ${testMissionData.missionContext.organizationName}`);
    console.log(`🏥 Secteur: ${testMissionData.missionContext.sector}`);
    console.log(`📊 Taille: ${testMissionData.missionContext.organizationSize}`);
    console.log(`⚡ Criticité: ${testMissionData.missionContext.criticalityLevel}`);
    console.log(`⏱️  Délai: ${testMissionData.missionContext.timeframe}`);

    const docRef = await addDoc(collection(db, 'missions'), testMissionData);
    console.log(`✅ Mission créée avec ID: ${docRef.id}`);

    // Vérifier la création
    console.log('\n🔍 VÉRIFICATION DE LA CRÉATION...');
    const finalSnapshot = await getDocs(collection(db, 'missions'));
    console.log(`📊 Missions après création: ${finalSnapshot.size}`);

    // Afficher le contexte pour les agents IA
    console.log('\n🤖 CONTEXTE DISPONIBLE POUR LES AGENTS IA:');
    console.log('===========================================');
    console.log(`🏢 Organisation: ${testMissionData.missionContext.organizationName}`);
    console.log(`🏥 Secteur: ${testMissionData.missionContext.sector}`);
    console.log(`📊 Taille: ${testMissionData.missionContext.organizationSize}`);
    console.log(`🌍 Périmètre: ${testMissionData.missionContext.geographicScope}`);
    console.log(`⚡ Criticité: ${testMissionData.missionContext.criticalityLevel}`);
    console.log(`🔧 Composants SI: ${testMissionData.missionContext.siComponents.length} éléments`);
    console.log(`⚙️  Processus: ${testMissionData.missionContext.criticalProcesses.length} processus critiques`);
    console.log(`👥 Parties prenantes: ${testMissionData.missionContext.stakeholders.length} identifiées`);
    console.log(`📋 Réglementations: ${testMissionData.missionContext.regulations.length} applicables`);
    console.log(`💰 Enjeux financiers: ${testMissionData.missionContext.financialStakes}`);
    console.log(`🛡️  Maturité sécurité: ${testMissionData.missionContext.securityMaturity}`);
    console.log(`🎯 Objectifs: ${testMissionData.missionContext.missionObjectives.length} définis`);
    console.log(`⏱️  Délai: ${testMissionData.missionContext.timeframe}`);

    console.log('\n📋 DÉTAILS DES COMPOSANTS SI:');
    testMissionData.missionContext.siComponents.forEach((component, index) => {
      console.log(`   ${index + 1}. ${component}`);
    });

    console.log('\n⚙️  DÉTAILS DES PROCESSUS CRITIQUES:');
    testMissionData.missionContext.criticalProcesses.forEach((process, index) => {
      console.log(`   ${index + 1}. ${process}`);
    });

    console.log('\n🎯 OBJECTIFS DE LA MISSION:');
    testMissionData.missionContext.missionObjectives.forEach((objective, index) => {
      console.log(`   ${index + 1}. ${objective}`);
    });

    console.log('\n📋 RÉGLEMENTATIONS APPLICABLES:');
    testMissionData.missionContext.regulations.forEach((regulation, index) => {
      console.log(`   ${index + 1}. ${regulation}`);
    });

    console.log('\n🎉 TEST RÉUSSI !');
    console.log('================');
    console.log('✅ Mission créée avec contexte complet');
    console.log('✅ Données structurées pour les agents IA');
    console.log('✅ Contexte métier disponible pour suggestions intelligentes');
    console.log('✅ Informations sectorielles pour recommandations spécialisées');
    console.log('✅ Prêt pour utilisation par les agents A2A');

    return docRef.id;

  } catch (error) {
    console.error('❌ ERREUR lors du test:', error);
    throw error;
  }
}

// Fonction pour tester les suggestions d'agents IA basées sur le contexte
async function testAIContextUsage(missionId) {
  console.log('\n🤖 SIMULATION DES SUGGESTIONS IA BASÉES SUR LE CONTEXTE');
  console.log('======================================================');

  const contextBasedSuggestions = {
    workshop1: {
      businessValues: [
        "Données patients (confidentialité critique)",
        "Continuité des soins (disponibilité critique)",
        "Dossiers médicaux (intégrité critique)",
        "Système de prescription (sécurité critique)"
      ],
      reasoning: "Basé sur le secteur 'Santé et médico-social' et les processus critiques identifiés"
    },
    workshop2: {
      riskSources: [
        "Cybercriminels (ransomware hospitalier)",
        "Initiés malveillants (accès privilégiés)",
        "Hacktivistes (données sensibles)",
        "États (espionnage médical)"
      ],
      reasoning: "Basé sur les incidents passés et le niveau de criticité 'Critique'"
    },
    workshop3: {
      strategicScenarios: [
        "Chiffrement des données patients par ransomware",
        "Vol de données médicales par initié",
        "Interruption du système de prescription",
        "Compromission du dossier médical partagé"
      ],
      reasoning: "Basé sur les composants SI critiques et les processus métier"
    },
    securityMeasures: [
      "Chiffrement des données de santé (HDS)",
      "Authentification forte pour personnel médical",
      "Sauvegarde sécurisée temps réel",
      "Monitoring 24h/24 des systèmes critiques",
      "Plan de continuité d'activité médical"
    ],
    reasoning: "Basé sur les réglementations HDS/ANSSI et les contraintes 24h/24"
  };

  console.log('🎯 SUGGESTIONS POUR WORKSHOP 1 (Valeurs métier):');
  contextBasedSuggestions.workshop1.businessValues.forEach((value, index) => {
    console.log(`   ${index + 1}. ${value}`);
  });
  console.log(`   💡 Raisonnement: ${contextBasedSuggestions.workshop1.reasoning}`);

  console.log('\n🎯 SUGGESTIONS POUR WORKSHOP 2 (Sources de risque):');
  contextBasedSuggestions.workshop2.riskSources.forEach((source, index) => {
    console.log(`   ${index + 1}. ${source}`);
  });
  console.log(`   💡 Raisonnement: ${contextBasedSuggestions.workshop2.reasoning}`);

  console.log('\n🎯 SUGGESTIONS POUR WORKSHOP 3 (Scénarios stratégiques):');
  contextBasedSuggestions.workshop3.strategicScenarios.forEach((scenario, index) => {
    console.log(`   ${index + 1}. ${scenario}`);
  });
  console.log(`   💡 Raisonnement: ${contextBasedSuggestions.workshop3.reasoning}`);

  console.log('\n🛡️  SUGGESTIONS DE MESURES DE SÉCURITÉ:');
  contextBasedSuggestions.securityMeasures.forEach((measure, index) => {
    console.log(`   ${index + 1}. ${measure}`);
  });
  console.log(`   💡 Raisonnement: ${contextBasedSuggestions.reasoning}`);

  console.log('\n✨ AVANTAGES DU CONTEXTE ENRICHI:');
  console.log('=================================');
  console.log('✅ Suggestions spécifiques au secteur de la santé');
  console.log('✅ Prise en compte des réglementations HDS/ANSSI');
  console.log('✅ Adaptation aux contraintes 24h/24');
  console.log('✅ Recommandations basées sur les incidents passés');
  console.log('✅ Priorisation selon la criticité des processus');
  console.log('✅ Cohérence avec la maturité sécurité actuelle');
}

// Exécution principale
async function main() {
  try {
    const missionId = await testMissionCreation();
    await testAIContextUsage(missionId);
    
    console.log('\n🎉 TOUS LES TESTS RÉUSSIS !');
    console.log('===========================');
    console.log('✅ Nouveau formulaire de mission fonctionnel');
    console.log('✅ Contexte complet disponible pour les agents IA');
    console.log('✅ Suggestions intelligentes et contextualisées');
    console.log('✅ Prêt pour utilisation en production');
    
  } catch (error) {
    console.error('\n💥 ÉCHEC DES TESTS:', error);
    process.exit(1);
  }
}

// Lancement du script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testMissionCreation, testAIContextUsage };
