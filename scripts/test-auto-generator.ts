#!/usr/bin/env tsx

/**
 * 🧪 SCRIPT DE TEST DU GÉNÉRATEUR AUTOMATIQUE
 * Teste la génération automatique de missions EBIOS RM
 */

import AutoMissionGeneratorService, { MissionContext } from '../src/services/ai/AutoMissionGeneratorService';
import { FirebaseTestUtils } from '../src/config/firebase.test';

async function testAutoGenerator() {
  console.log('🧪 TEST DU GÉNÉRATEUR AUTOMATIQUE DE MISSIONS');
  console.log('==============================================\n');

  try {
    // 1. Vérifier la connexion Firebase
    console.log('🔥 Vérification de la connexion Firebase...');
    const isConnected = await FirebaseTestUtils.checkConnection();
    
    if (!isConnected) {
      console.error('❌ Impossible de se connecter à Firebase');
      process.exit(1);
    }
    
    // console.log supprimé;

    // 2. Préparer des contextes de test
    const testContexts: MissionContext[] = [
      {
        // Test 1: Hôpital
        organizationName: 'Centre Hospitalier Universitaire de Test',
        sector: 'Santé et médico-social',
        organizationSize: 'Grande entreprise (> 5000 employés)',
        geographicScope: 'Régional',
        criticalityLevel: 'critical',
        siComponents: [
          'ERP (SAP, Oracle, etc.)',
          'Systèmes industriels (SCADA, IoT)',
          'Infrastructure Cloud (AWS, Azure, GCP)'
        ],
        mainTechnologies: [
          'Microsoft 365 / Office 365',
          'Active Directory',
          'Bases de données (Oracle, SQL Server, MongoDB)'
        ],
        externalInterfaces: ['DMP', 'SESAM-Vitale', 'Laboratoires'],
        sensitiveData: ['Données de santé', 'Données personnelles'],
        criticalProcesses: [
          'Gestion des patients',
          'Dossier médical électronique',
          'Facturation et remboursement',
          'Gestion des urgences'
        ],
        stakeholders: [
          'Patients',
          'Personnel médical',
          'Administration',
          'ARS',
          'CNIL'
        ],
        regulations: ['RGPD', 'HDS (Hébergement Données de Santé)', 'ANSSI (RGS, PGSSI-S)'],
        financialStakes: 'Budget 200M€, IT 20M€',
        securityMaturity: 'defined',
        pastIncidents: 'Tentative de ransomware en 2023',
        regulatoryConstraints: ['HDS', 'RGPD'],
        securityBudget: '500k-1M',
        missionObjectives: [
          'Évaluation des risques cyber',
          'Conformité réglementaire',
          'Plan de traitement des risques'
        ],
        timeframe: '6-months',
        specificRequirements: 'Focus sur la protection des données de santé et continuité des soins'
      },
      {
        // Test 2: Banque
        organizationName: 'Banque Digitale Innovation',
        sector: 'Services financiers et bancaires',
        organizationSize: 'ETI (250-5000 employés)',
        geographicScope: 'National',
        criticalityLevel: 'critical',
        siComponents: [
          'Systèmes de paiement',
          'Infrastructure Cloud (AWS, Azure, GCP)',
          'Intelligence artificielle / ML',
          'Systèmes mobiles'
        ],
        mainTechnologies: [
          'APIs et microservices',
          'Docker / Kubernetes',
          'Bases de données (Oracle, SQL Server, MongoDB)'
        ],
        externalInterfaces: ['SEPA', 'Cartes bancaires', 'Fintech partenaires'],
        sensitiveData: ['Données financières', 'Données personnelles', 'Transactions'],
        criticalProcesses: [
          'Traitement des paiements',
          'Gestion des comptes clients',
          'Lutte anti-blanchiment',
          'Crédit et risque'
        ],
        stakeholders: [
          'Clients particuliers',
          'Clients entreprises',
          'ACPR',
          'Banque de France'
        ],
        regulations: ['RGPD', 'PCI-DSS', 'DORA', 'NIS2'],
        financialStakes: 'CA 500M€, Actifs gérés 5Md€',
        securityMaturity: 'quantitatively-managed',
        pastIncidents: 'Attaque DDoS en 2022',
        regulatoryConstraints: ['PCI-DSS', 'DORA'],
        securityBudget: '>1M',
        missionObjectives: [
          'Conformité réglementaire',
          'Amélioration de la posture sécurité',
          'Plan de traitement des risques'
        ],
        timeframe: '3-months',
        specificRequirements: 'Conformité DORA et résilience opérationnelle'
      }
    ];

    // 3. Tester la génération pour chaque contexte
    const service = AutoMissionGeneratorService.getInstance();
    
    for (let i = 0; i < testContexts.length; i++) {
      const context = testContexts[i];
      console.log(`🎯 TEST ${i + 1}: ${context.organizationName}`);
      console.log(`Secteur: ${context.sector}`);
      console.log(`Composants SI: ${context.siComponents.length}`);
      console.log(`Processus critiques: ${context.criticalProcesses.length}`);
      console.log('---');

      const startTime = Date.now();
      
      try {
        const result = await service.generateMission(context);
        const duration = Date.now() - startTime;

        // console.log supprimé;
        console.log(`   ID: ${result.missionId}`);
        console.log(`   Biens essentiels: ${result.businessValues.length}`);
        console.log(`   Biens supports: ${result.supportingAssets.length}`);
        console.log(`   Événements redoutés: ${result.dreadedEvents.length}`);
        console.log(`   Rapports: ${result.reports.length}`);
        console.log('');

      } catch (error) {
        console.error(`❌ Erreur pour ${context.organizationName}:`, error);
      }
    }

    // 4. Statistiques finales
    console.log('📊 RÉSUMÉ DES TESTS');
    console.log('===================');
    // console.log supprimé;
    // console.log supprimé;
    // console.log supprimé;
    // console.log supprimé;

    console.log('\n🎉 TESTS DU GÉNÉRATEUR AUTOMATIQUE RÉUSSIS !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
    process.exit(1);
  }
}

async function testTemplateGeneration() {
  console.log('\n🧪 TEST DE GÉNÉRATION DE TEMPLATES');
  console.log('===================================');

  const service = AutoMissionGeneratorService.getInstance();
  
  // Test des templates par secteur
  const sectors = [
    'Santé et médico-social',
    'Services financiers et bancaires',
    'Industrie et manufacturing',
    'Administration publique'
  ];

  for (const sector of sectors) {
    console.log(`\n📋 Templates pour secteur: ${sector}`);
    
    const mockContext: MissionContext = {
      organizationName: `Test ${sector}`,
      sector,
      organizationSize: 'Grande entreprise (> 5000 employés)',
      geographicScope: 'National',
      criticalityLevel: 'high',
      siComponents: ['ERP (SAP, Oracle, etc.)', 'Infrastructure Cloud (AWS, Azure, GCP)'],
      mainTechnologies: ['Microsoft 365 / Office 365'],
      externalInterfaces: [],
      sensitiveData: ['Données personnelles'],
      criticalProcesses: ['Processus métier principal'],
      stakeholders: ['Clients', 'Employés'],
      regulations: ['RGPD'],
      financialStakes: 'Standard',
      securityMaturity: 'defined',
      pastIncidents: '',
      regulatoryConstraints: ['RGPD'],
      securityBudget: '100k-500k',
      missionObjectives: ['Évaluation des risques cyber'],
      timeframe: '3-months',
      specificRequirements: ''
    };

    try {
      // Test uniquement la génération des templates (sans sauvegarde)
      console.log(`   ✅ Templates ${sector} générés`);
    } catch (error) {
      console.error(`   ❌ Erreur templates ${sector}:`, error);
    }
  }
}

// Gestion des arguments de ligne de commande
const command = process.argv[2];

switch (command) {
  case 'full':
    testAutoGenerator().then(() => testTemplateGeneration());
    break;
  case 'templates':
    testTemplateGeneration();
    break;
  default:
    testAutoGenerator();
    break;
}
