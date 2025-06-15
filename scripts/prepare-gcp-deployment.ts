#!/usr/bin/env node

/**
 * 🚀 PRÉPARATION DÉPLOIEMENT GCP - EBIOS RM
 * 
 * Script principal pour préparer le déploiement sur Google Cloud Platform
 * - Audit complet du schéma Firebase
 * - Génération des règles de sécurité Firestore
 * - Génération des index optimisés
 * - Vérification de la cohérence des données
 * - Recommandations de déploiement
 */

import { FirebaseSchemaAuditor } from './firebase-audit-runner';
import { FirestoreRulesGenerator } from './generate-firestore-rules';
import { FirestoreIndexGenerator } from './generate-firestore-indexes';
import * as fs from 'fs';
import * as path from 'path';

interface DeploymentChecklist {
  schemaAudit: boolean;
  securityRules: boolean;
  indexes: boolean;
  environmentConfig: boolean;
  backupStrategy: boolean;
  monitoringSetup: boolean;
  performanceTesting: boolean;
}

interface DeploymentReport {
  timestamp: string;
  status: 'READY' | 'NEEDS_ATTENTION' | 'NOT_READY';
  checklist: DeploymentChecklist;
  criticalIssues: string[];
  warnings: string[];
  recommendations: string[];
  nextSteps: string[];
}

class GCPDeploymentPreparator {
  private report: DeploymentReport;

  constructor() {
    this.report = {
      timestamp: new Date().toISOString(),
      status: 'NOT_READY',
      checklist: {
        schemaAudit: false,
        securityRules: false,
        indexes: false,
        environmentConfig: false,
        backupStrategy: false,
        monitoringSetup: false,
        performanceTesting: false
      },
      criticalIssues: [],
      warnings: [],
      recommendations: [],
      nextSteps: []
    };
  }

  /**
   * Exécuter la préparation complète du déploiement
   */
  public async prepareDeployment(): Promise<void> {
    console.log('🚀 PRÉPARATION DU DÉPLOIEMENT GCP - EBIOS RM');
    console.log('=' .repeat(60));
    console.log(`📅 Démarré le: ${new Date().toLocaleString('fr-FR')}\n`);

    try {
      // 1. Audit du schéma Firebase
      await this.runSchemaAudit();
      
      // 2. Génération des règles de sécurité
      await this.generateSecurityRules();
      
      // 3. Génération des index
      await this.generateIndexes();
      
      // 4. Vérification de la configuration d'environnement
      await this.checkEnvironmentConfiguration();
      
      // 5. Vérification de la stratégie de sauvegarde
      await this.checkBackupStrategy();
      
      // 6. Configuration du monitoring
      await this.setupMonitoring();
      
      // 7. Recommandations de tests de performance
      await this.performanceTestingRecommendations();
      
      // 8. Génération du rapport final
      await this.generateFinalReport();
      
    } catch (error) {
      console.error('❌ Erreur lors de la préparation du déploiement:', error);
      this.report.criticalIssues.push(`Erreur fatale: ${error}`);
      this.report.status = 'NOT_READY';
    }
  }

  /**
   * Exécuter l'audit du schéma Firebase
   */
  private async runSchemaAudit(): Promise<void> {
    console.log('🔍 1. AUDIT DU SCHÉMA FIREBASE');
    console.log('-' .repeat(40));
    
    try {
      const auditor = new FirebaseSchemaAuditor();
      await auditor.runFullAudit();
      
      // Vérifier s'il y a des issues critiques
      const auditReportPath = path.join(process.cwd(), 'firebase-audit-report.json');
      if (fs.existsSync(auditReportPath)) {
        const auditData = JSON.parse(fs.readFileSync(auditReportPath, 'utf-8'));
        const criticalIssues = auditData.results
          .flatMap((r: any) => r.issues)
          .filter((i: any) => i.severity === 'CRITICAL');
        
        if (criticalIssues.length > 0) {
          this.report.criticalIssues.push(...criticalIssues.map((i: any) => i.message));
        }
        
        const highIssues = auditData.results
          .flatMap((r: any) => r.issues)
          .filter((i: any) => i.severity === 'HIGH');
        
        if (highIssues.length > 0) {
          this.report.warnings.push(...highIssues.map((i: any) => i.message));
        }
      }
      
      this.report.checklist.schemaAudit = true;
      console.log('✅ Audit du schéma terminé\n');
      
    } catch (error) {
      console.error('❌ Échec de l\'audit du schéma:', error);
      this.report.criticalIssues.push('Échec de l\'audit du schéma Firebase');
    }
  }

  /**
   * Générer les règles de sécurité Firestore
   */
  private async generateSecurityRules(): Promise<void> {
    console.log('🔒 2. GÉNÉRATION DES RÈGLES DE SÉCURITÉ');
    console.log('-' .repeat(40));
    
    try {
      const rulesGenerator = new FirestoreRulesGenerator();
      rulesGenerator.saveRulesToFile();
      
      this.report.checklist.securityRules = true;
      console.log('✅ Règles de sécurité générées\n');
      
    } catch (error) {
      console.error('❌ Échec de la génération des règles:', error);
      this.report.criticalIssues.push('Échec de la génération des règles de sécurité');
    }
  }

  /**
   * Générer les index Firestore
   */
  private async generateIndexes(): Promise<void> {
    console.log('🔍 3. GÉNÉRATION DES INDEX FIRESTORE');
    console.log('-' .repeat(40));
    
    try {
      const indexGenerator = new FirestoreIndexGenerator();
      indexGenerator.saveConfigurationToFile();
      
      this.report.checklist.indexes = true;
      console.log('✅ Index Firestore générés\n');
      
    } catch (error) {
      console.error('❌ Échec de la génération des index:', error);
      this.report.criticalIssues.push('Échec de la génération des index Firestore');
    }
  }

  /**
   * Vérifier la configuration d'environnement
   */
  private async checkEnvironmentConfiguration(): Promise<void> {
    console.log('⚙️  4. VÉRIFICATION DE LA CONFIGURATION');
    console.log('-' .repeat(40));
    
    const requiredEnvVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      this.report.criticalIssues.push(`Variables d'environnement manquantes: ${missingVars.join(', ')}`);
      console.log(`❌ Variables manquantes: ${missingVars.join(', ')}`);
    } else {
      this.report.checklist.environmentConfig = true;
      console.log('✅ Configuration d\'environnement validée');
    }

    // Vérifier les fichiers de configuration
    const configFiles = [
      '.env.production',
      'firebase.json',
      'package.json'
    ];

    configFiles.forEach(file => {
      if (!fs.existsSync(path.join(process.cwd(), file))) {
        this.report.warnings.push(`Fichier de configuration manquant: ${file}`);
      }
    });

    console.log('');
  }

  /**
   * Vérifier la stratégie de sauvegarde
   */
  private async checkBackupStrategy(): Promise<void> {
    console.log('💾 5. STRATÉGIE DE SAUVEGARDE');
    console.log('-' .repeat(40));
    
    this.report.recommendations.push(
      'Configurer les sauvegardes automatiques Firestore',
      'Mettre en place une stratégie de rétention des données',
      'Tester la procédure de restauration',
      'Documenter les procédures de récupération d\'urgence'
    );

    // Vérifier si les scripts de sauvegarde existent
    const backupScripts = [
      'scripts/backup-firestore.ts',
      'scripts/restore-firestore.ts'
    ];

    let backupScriptsExist = 0;
    backupScripts.forEach(script => {
      if (fs.existsSync(path.join(process.cwd(), script))) {
        backupScriptsExist++;
      }
    });

    if (backupScriptsExist === backupScripts.length) {
      this.report.checklist.backupStrategy = true;
      console.log('✅ Scripts de sauvegarde détectés');
    } else {
      this.report.warnings.push('Scripts de sauvegarde manquants');
      console.log('⚠️  Scripts de sauvegarde à créer');
    }

    console.log('');
  }

  /**
   * Configuration du monitoring
   */
  private async setupMonitoring(): Promise<void> {
    console.log('📊 6. CONFIGURATION DU MONITORING');
    console.log('-' .repeat(40));
    
    this.report.recommendations.push(
      'Configurer Google Cloud Monitoring pour Firestore',
      'Mettre en place des alertes sur les quotas',
      'Surveiller les performances des requêtes',
      'Configurer les logs d\'audit',
      'Mettre en place un dashboard de monitoring'
    );

    // Pour l'instant, on considère que le monitoring doit être configuré manuellement
    this.report.checklist.monitoringSetup = false;
    console.log('⚠️  Monitoring à configurer manuellement dans GCP');
    console.log('');
  }

  /**
   * Recommandations pour les tests de performance
   */
  private async performanceTestingRecommendations(): Promise<void> {
    console.log('🚀 7. TESTS DE PERFORMANCE');
    console.log('-' .repeat(40));
    
    this.report.recommendations.push(
      'Tester les requêtes avec des volumes de données réalistes',
      'Valider les temps de réponse des API',
      'Tester la montée en charge',
      'Vérifier les limites de Firestore',
      'Optimiser les requêtes lentes'
    );

    // Créer un script de test de performance basique
    this.createPerformanceTestScript();
    
    this.report.checklist.performanceTesting = false;
    // console.log supprimé;
    console.log('');
  }

  /**
   * Créer un script de test de performance
   */
  private createPerformanceTestScript(): void {
    const testScript = `/**
 * 🚀 TESTS DE PERFORMANCE FIRESTORE
 * 
 * Script pour tester les performances avant déploiement GCP
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';

// TODO: Remplacer par votre configuration Firebase
const firebaseConfig = {
  // Configuration Firebase
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testPerformance() {
  // console.log supprimé;
  
  // Test 1: Requête simple sur les missions
  console.time('Missions query');
  const missionsQuery = query(collection(db, 'missions'), limit(100));
  await getDocs(missionsQuery);
  console.timeEnd('Missions query');
  
  // Test 2: Requête avec filtre
  console.time('Filtered missions query');
  const filteredQuery = query(
    collection(db, 'missions'), 
    where('status', '==', 'in_progress'),
    limit(50)
  );
  await getDocs(filteredQuery);
  console.timeEnd('Filtered missions query');
  
  // Test 3: Requête composite
  console.time('Composite query');
  const compositeQuery = query(
    collection(db, 'businessValues'),
    where('category', '==', 'primary'),
    orderBy('priority'),
    limit(25)
  );
  await getDocs(compositeQuery);
  console.timeEnd('Composite query');
  
  // console.log supprimé;
}

testPerformance().catch(console.error);
`;

    const testPath = path.join(process.cwd(), 'scripts/performance-test.ts');
    fs.writeFileSync(testPath, testScript);
    // console.log supprimé;
  }

  /**
   * Générer le rapport final
   */
  private async generateFinalReport(): Promise<void> {
    console.log('📋 8. RAPPORT FINAL DE DÉPLOIEMENT');
    console.log('=' .repeat(60));
    
    // Déterminer le statut global
    const completedChecks = Object.values(this.report.checklist).filter(Boolean).length;
    const totalChecks = Object.keys(this.report.checklist).length;
    
    if (this.report.criticalIssues.length > 0) {
      this.report.status = 'NOT_READY';
    } else if (completedChecks === totalChecks) {
      this.report.status = 'READY';
    } else {
      this.report.status = 'NEEDS_ATTENTION';
    }

    // Ajouter les étapes suivantes
    this.report.nextSteps = [
      'Résoudre tous les problèmes critiques identifiés',
      'Configurer les variables d\'environnement de production',
      'Tester les règles de sécurité Firestore',
      'Déployer les index Firestore',
      'Configurer le monitoring GCP',
      'Exécuter les tests de performance',
      'Planifier la stratégie de sauvegarde',
      'Former l\'équipe sur les procédures de déploiement'
    ];

    // Afficher le résumé
    console.log(`📊 Statut: ${this.getStatusIcon()} ${this.report.status}`);
    console.log(`✅ Vérifications complétées: ${completedChecks}/${totalChecks}`);
    console.log(`🔴 Problèmes critiques: ${this.report.criticalIssues.length}`);
    console.log(`⚠️  Avertissements: ${this.report.warnings.length}`);
    console.log(`💡 Recommandations: ${this.report.recommendations.length}`);

    if (this.report.criticalIssues.length > 0) {
      console.log('\n🚨 PROBLÈMES CRITIQUES À RÉSOUDRE:');
      this.report.criticalIssues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue}`);
      });
    }

    if (this.report.warnings.length > 0) {
      console.log('\n⚠️  AVERTISSEMENTS:');
      this.report.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
    }

    console.log('\n🎯 PROCHAINES ÉTAPES:');
    this.report.nextSteps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step}`);
    });

    // Sauvegarder le rapport
    const reportPath = path.join(process.cwd(), 'gcp-deployment-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));
    console.log(`\n📄 Rapport complet sauvegardé: ${reportPath}`);

    // Message final
    console.log('\n' + '=' .repeat(60));
    if (this.report.status === 'READY') {
      console.log('🎉 VOTRE APPLICATION EST PRÊTE POUR LE DÉPLOIEMENT GCP !');
    } else if (this.report.status === 'NEEDS_ATTENTION') {
      console.log('⚠️  QUELQUES AJUSTEMENTS SONT NÉCESSAIRES AVANT LE DÉPLOIEMENT');
    } else {
      console.log('🚨 DES PROBLÈMES CRITIQUES DOIVENT ÊTRE RÉSOLUS AVANT LE DÉPLOIEMENT');
    }
    console.log('=' .repeat(60));
  }

  /**
   * Obtenir l'icône de statut
   */
  private getStatusIcon(): string {
    switch (this.report.status) {
      case 'READY': return '🟢';
      case 'NEEDS_ATTENTION': return '🟡';
      case 'NOT_READY': return '🔴';
      default: return '⚪';
    }
  }
}

// Exécuter la préparation si le script est appelé directement
if (require.main === module) {
  const preparator = new GCPDeploymentPreparator();
  preparator.prepareDeployment().catch(console.error);
}

export { GCPDeploymentPreparator };
