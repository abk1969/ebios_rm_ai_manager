/**
 * Script de test pour vérifier le mapping du contexte de mission
 * 🧪 TEMPORAIRE - À supprimer après validation
 */

import { MissionContextMapper } from '../services/ai/MissionContextMapper';
import type { Mission } from '../types/ebios';

// Mission de test avec contexte riche
const testMission: Mission = {
  id: 'test-mission-001',
  name: 'Mission Test - Hôpital Universitaire',
  description: 'Mission de test pour valider le contexte',
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: 'test-user',
  assignedTo: [],
  ebiosCompliance: 'v1.5',
  organizationContext: {
    organizationType: 'public',
    sector: 'Santé - Établissements hospitaliers',
    size: 'large',
    regulatoryRequirements: ['RGPD', 'HDS', 'ANSSI'],
    securityObjectives: ['Protéger les données patients', 'Assurer la continuité des soins'],
    constraints: []
  },
  scope: {
    boundaries: 'Hôpital principal + 3 sites annexes',
    inclusions: ['SIH', 'PACS', 'Laboratoire', 'Pharmacie'],
    exclusions: [],
    timeFrame: {
      start: new Date().toISOString(),
      end: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    geographicalScope: ['Régional']
  },
  // 🎯 CONTEXTE RICHE DE MISSION
  missionContext: {
    // Informations organisationnelles
    organizationName: 'Hôpital Universitaire de Paris',
    sector: 'Santé - Établissements hospitaliers',
    organizationSize: 'Grande entreprise (5000+ employés)',
    geographicScope: 'Régional',
    criticalityLevel: 'high',

    // Contexte technique
    siComponents: [
      'Système d\'Information Hospitalier (SIH)',
      'PACS (Picture Archiving and Communication System)',
      'Système de laboratoire (LIS)',
      'Système de pharmacie',
      'Infrastructure réseau',
      'Serveurs de bases de données',
      'Postes de travail médicaux',
      'Équipements médicaux connectés'
    ],
    mainTechnologies: [
      'Microsoft SQL Server',
      'VMware vSphere',
      'Cisco Networking',
      'Microsoft Active Directory',
      'Oracle Database',
      'HL7 FHIR',
      'DICOM'
    ],
    externalInterfaces: [
      'Réseau de soins régional',
      'Assurance maladie',
      'Laboratoires externes',
      'Pharmacies de ville',
      'Services d\'urgence'
    ],
    sensitiveData: [
      'Données patients (DMP)',
      'Dossiers médicaux',
      'Images médicales',
      'Données de laboratoire',
      'Données de facturation',
      'Données RH personnel médical'
    ],

    // Processus métier
    criticalProcesses: [
      'Admission et sortie des patients',
      'Prescription et administration médicaments',
      'Examens et diagnostics',
      'Chirurgie et blocs opératoires',
      'Urgences et réanimation',
      'Gestion des rendez-vous',
      'Facturation et remboursements'
    ],
    stakeholders: [
      'Patients',
      'Personnel médical',
      'Personnel administratif',
      'Fournisseurs médicaux',
      'Autorités de santé',
      'Assurance maladie'
    ],
    regulations: [
      'RGPD',
      'Hébergement de Données de Santé (HDS)',
      'Code de la santé publique',
      'ANSSI',
      'ISO 27001',
      'Certification HAS'
    ],
    financialStakes: 'Budget annuel 500M€, Impact interruption 5M€/jour',

    // Contexte sécurité
    securityMaturity: 'Défini',
    pastIncidents: 'Tentative de ransomware en 2023 (contenue), Faille de sécurité réseau en 2022',
    regulatoryConstraints: ['Audit HDS annuel', 'Certification ISO 27001', 'Conformité RGPD'],
    securityBudget: '15M€ annuel (3% du budget IT)',

    // Objectifs de la mission
    missionObjectives: [
      'Identifier les risques critiques sur les données patients',
      'Améliorer la posture sécurité des systèmes médicaux',
      'Assurer la conformité réglementaire HDS et RGPD',
      'Protéger la continuité des soins',
      'Renforcer la sensibilisation du personnel'
    ],
    timeframe: '12 mois',
    specificRequirements: 'Analyse prioritaire des systèmes critiques (SIH, PACS), prise en compte des contraintes opérationnelles 24h/24, formation du personnel médical'
  }
};

/**
 * Fonction de test du mapping de contexte
 */
export function testMissionContextMapping(): void {
  console.log('🧪 ===== TEST MAPPING CONTEXTE DE MISSION =====');
  
  // Test 1: Mapping vers contexte organisationnel
  console.log('\n📋 Test 1: Mapping vers contexte organisationnel');
  const orgContext = MissionContextMapper.mapToOrganizationalContext(testMission);
  console.log('✅ Contexte organisationnel mappé:', orgContext);
  
  // Test 2: Enrichissement du contexte
  console.log('\n📋 Test 2: Enrichissement du contexte');
  if (orgContext) {
    const enrichedContext = MissionContextMapper.enrichOrganizationalContext(orgContext, testMission);
    console.log('✅ Contexte enrichi:', enrichedContext);
  }
  
  // Test 3: Génération du résumé contextuel
  console.log('\n📋 Test 3: Résumé contextuel');
  const summary = MissionContextMapper.generateContextualSummary(testMission);
  console.log('✅ Résumé:', summary);
  
  // Test 4: Validation du contexte
  console.log('\n📋 Test 4: Validation du contexte');
  const validation = MissionContextMapper.validateMissionContext(testMission);
  console.log('✅ Validation:', validation);
  
  // Test 5: Génération d'insights contextuels
  console.log('\n📋 Test 5: Insights contextuels');
  const insights = MissionContextMapper.generateContextualInsights(testMission);
  console.log('✅ Insights:', insights);
  
  console.log('\n🎉 ===== TESTS TERMINÉS =====');
}

/**
 * Test avec mission sans contexte (pour vérifier la robustesse)
 */
export function testMissionWithoutContext(): void {
  console.log('\n🧪 ===== TEST MISSION SANS CONTEXTE =====');
  
  const missionWithoutContext: Mission = {
    ...testMission,
    missionContext: undefined
  };
  
  const orgContext = MissionContextMapper.mapToOrganizationalContext(missionWithoutContext);
  console.log('⚠️ Contexte organisationnel (mission sans contexte):', orgContext);
  
  const validation = MissionContextMapper.validateMissionContext(missionWithoutContext);
  console.log('⚠️ Validation (mission sans contexte):', validation);
}

// Export pour utilisation dans la console du navigateur
if (typeof window !== 'undefined') {
  (window as any).testMissionContext = {
    testMissionContextMapping,
    testMissionWithoutContext,
    testMission
  };
  
  console.log('🧪 Tests disponibles dans window.testMissionContext');
  console.log('📝 Utilisez: window.testMissionContext.testMissionContextMapping()');
}
