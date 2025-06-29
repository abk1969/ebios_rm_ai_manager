#!/usr/bin/env tsx

/**
 * 🔍 SCRIPT DE VALIDATION PRÉ-DÉPLOIEMENT PRODUCTION
 * Validation complète avant déploiement GCP
 * 
 * VÉRIFICATIONS:
 * - Configuration environnement
 * - Tests automatisés
 * - Sécurité et conformité
 * - Performance et optimisations
 * - Intégrations externes
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface ValidationResult {
  category: string;
  checks: CheckResult[];
  passed: boolean;
  score: number;
}

interface CheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
  recommendation?: string;
}

interface ValidationReport {
  timestamp: string;
  environment: string;
  overallStatus: 'pass' | 'fail' | 'warning';
  overallScore: number;
  results: ValidationResult[];
  summary: {
    totalChecks: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  recommendations: string[];
  blockers: string[];
}

class ProductionDeploymentValidator {
  private report: ValidationReport;

  constructor() {
    this.report = {
      timestamp: new Date().toISOString(),
      environment: 'production',
      overallStatus: 'pass',
      overallScore: 0,
      results: [],
      summary: { totalChecks: 0, passed: 0, failed: 0, warnings: 0 },
      recommendations: [],
      blockers: []
    };
  }

  async runValidation(): Promise<ValidationReport> {
    console.log('🔍 VALIDATION PRÉ-DÉPLOIEMENT PRODUCTION');
    console.log('=====================================\n');

    try {
      // 1. Validation de l'environnement
      await this.validateEnvironment();

      // 2. Validation de la sécurité
      await this.validateSecurity();

      // 3. Validation des tests
      await this.validateTests();

      // 4. Validation des performances
      await this.validatePerformance();

      // 5. Validation de la conformité
      await this.validateCompliance();

      // 6. Validation des intégrations
      await this.validateIntegrations();

      // 7. Validation du build
      await this.validateBuild();

      // Calcul du score global
      this.calculateOverallScore();

      // Génération du rapport
      await this.generateReport();

      return this.report;

    } catch (error) {
      console.error('❌ Erreur lors de la validation:', error);
      this.report.overallStatus = 'fail';
      this.report.blockers.push(`Erreur critique: ${error}`);
      return this.report;
    }
  }

  private async validateEnvironment(): Promise<void> {
    console.log('🔧 Validation de l\'environnement...');
    
    const checks: CheckResult[] = [];
    
    // Vérification des variables d'environnement
    const requiredEnvVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_GCP_PROJECT_ID'
    ];

    const envFile = '.env.production';
    if (!fs.existsSync(envFile)) {
      checks.push({
        name: 'Fichier .env.production',
        status: 'fail',
        message: 'Fichier .env.production manquant',
        recommendation: 'Créer le fichier .env.production à partir de .env.production.example'
      });
    } else {
      checks.push({
        name: 'Fichier .env.production',
        status: 'pass',
        message: 'Fichier .env.production présent'
      });

      // Vérification des variables requises
      const envContent = fs.readFileSync(envFile, 'utf-8');
      const missingVars = requiredEnvVars.filter(varName => 
        !envContent.includes(`${varName}=`) || envContent.includes(`${varName}=your_`)
      );

      if (missingVars.length > 0) {
        checks.push({
          name: 'Variables d\'environnement',
          status: 'fail',
          message: `Variables manquantes ou non configurées: ${missingVars.join(', ')}`,
          recommendation: 'Configurer toutes les variables d\'environnement requises'
        });
      } else {
        checks.push({
          name: 'Variables d\'environnement',
          status: 'pass',
          message: 'Toutes les variables requises sont configurées'
        });
      }
    }

    // Vérification de Node.js
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
      const majorVersion = parseInt(nodeVersion.replace('v', '').split('.')[0]);
      
      if (majorVersion >= 18) {
        checks.push({
          name: 'Version Node.js',
          status: 'pass',
          message: `Node.js ${nodeVersion} (compatible)`
        });
      } else {
        checks.push({
          name: 'Version Node.js',
          status: 'fail',
          message: `Node.js ${nodeVersion} (version 18+ requise)`,
          recommendation: 'Mettre à jour Node.js vers la version 18 ou supérieure'
        });
      }
    } catch (error) {
      checks.push({
        name: 'Version Node.js',
        status: 'fail',
        message: 'Impossible de vérifier la version Node.js',
        recommendation: 'Vérifier l\'installation de Node.js'
      });
    }

    this.addValidationResult('Environnement', checks);
  }

  private async validateSecurity(): Promise<void> {
    console.log('🛡️ Validation de la sécurité...');
    
    const checks: CheckResult[] = [];

    // Vérification des dépendances vulnérables
    try {
      execSync('npm audit --audit-level=high', { stdio: 'pipe' });
      checks.push({
        name: 'Audit de sécurité npm',
        status: 'pass',
        message: 'Aucune vulnérabilité critique détectée'
      });
    } catch (error) {
      checks.push({
        name: 'Audit de sécurité npm',
        status: 'warning',
        message: 'Vulnérabilités détectées',
        recommendation: 'Exécuter npm audit fix pour corriger les vulnérabilités'
      });
    }

    // Vérification des console.log en production
    const srcFiles = this.getAllTsFiles('./src');
    const filesWithConsole = srcFiles.filter(file => {
      const content = fs.readFileSync(file, 'utf-8');
      return content.includes('console.log') && !content.includes('import.meta.env.DEV');
    });

    if (filesWithConsole.length > 0) {
      checks.push({
        name: 'Console.log en production',
        status: 'warning',
        message: `${filesWithConsole.length} fichiers contiennent des console.log`,
        details: filesWithConsole.slice(0, 5).join(', '),
        recommendation: 'Supprimer ou conditionner les console.log'
      });
    } else {
      checks.push({
        name: 'Console.log en production',
        status: 'pass',
        message: 'Aucun console.log non conditionné détecté'
      });
    }

    // Vérification des secrets hardcodés
    const secretPatterns = [
      /api[_-]?key[_-]?=.{10,}/i,
      /secret[_-]?=.{10,}/i,
      /password[_-]?=.{5,}/i,
      /token[_-]?=.{10,}/i
    ];

    let secretsFound = 0;
    srcFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8');
      secretPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          secretsFound++;
        }
      });
    });

    if (secretsFound > 0) {
      checks.push({
        name: 'Secrets hardcodés',
        status: 'fail',
        message: `${secretsFound} potentiels secrets hardcodés détectés`,
        recommendation: 'Déplacer tous les secrets vers les variables d\'environnement'
      });
    } else {
      checks.push({
        name: 'Secrets hardcodés',
        status: 'pass',
        message: 'Aucun secret hardcodé détecté'
      });
    }

    this.addValidationResult('Sécurité', checks);
  }

  private async validateTests(): Promise<void> {
    // console.log supprimé;

    const checks: CheckResult[] = [];

    // Données réelles
    try {
      execSync('npm run test:realdata', { stdio: 'pipe' });
      checks.push({
        name: 'Tests avec données réelles',
        status: 'pass',
        message: 'Tous les tests avec données réelles passent'
      });
    } catch (error) {
      try {
        // Fallback sur les tests unitaires classiques
        execSync('npm test -- --run', { stdio: 'pipe' });
        checks.push({
          name: 'Tests unitaires (fallback)',
          status: 'warning',
          message: 'Tests avec données réelles échoués, tests unitaires OK',
          recommendation: 'Vérifier la connexion Firebase pour les tests avec données réelles'
        });
      } catch (fallbackError) {
        checks.push({
          name: 'Tests',
          status: 'fail',
          message: 'Échec des tests unitaires et des tests avec données réelles',
          recommendation: 'Corriger les erreurs de tests avant le déploiement'
        });
      }
    }

    // Vérification de la couverture de tests
    const testFiles = this.getAllTestFiles('./src');
    const srcFilesCount = this.getAllTsFiles('./src').length;
    const testCoverage = (testFiles.length / srcFilesCount) * 100;

    if (testCoverage >= 70) {
      checks.push({
        name: 'Couverture de tests',
        status: 'pass',
        message: `Couverture: ${testCoverage.toFixed(1)}%`
      });
    } else if (testCoverage >= 50) {
      checks.push({
        name: 'Couverture de tests',
        status: 'warning',
        message: `Couverture: ${testCoverage.toFixed(1)}% (recommandé: 70%+)`,
        recommendation: 'Augmenter la couverture de tests'
      });
    } else {
      checks.push({
        name: 'Couverture de tests',
        status: 'fail',
        message: `Couverture: ${testCoverage.toFixed(1)}% (insuffisante)`,
        recommendation: 'Ajouter des tests pour atteindre au moins 50% de couverture'
      });
    }

    this.addValidationResult('Tests', checks);
  }

  private async validatePerformance(): Promise<void> {
    console.log('⚡ Validation des performances...');
    
    const checks: CheckResult[] = [];

    // Vérification de la configuration Vite
    const viteConfig = fs.readFileSync('./vite.config.ts', 'utf-8');
    
    if (viteConfig.includes('drop_console: true')) {
      checks.push({
        name: 'Optimisation console.log',
        status: 'pass',
        message: 'Console.log supprimés en production'
      });
    } else {
      checks.push({
        name: 'Optimisation console.log',
        status: 'warning',
        message: 'Console.log non supprimés automatiquement',
        recommendation: 'Configurer Terser pour supprimer les console.log'
      });
    }

    if (viteConfig.includes('manualChunks')) {
      checks.push({
        name: 'Code splitting',
        status: 'pass',
        message: 'Code splitting configuré'
      });
    } else {
      checks.push({
        name: 'Code splitting',
        status: 'warning',
        message: 'Code splitting non configuré',
        recommendation: 'Configurer le code splitting pour optimiser le chargement'
      });
    }

    this.addValidationResult('Performance', checks);
  }

  private async validateCompliance(): Promise<void> {
    console.log('📋 Validation de la conformité...');
    
    const checks: CheckResult[] = [];

    // Vérification ANSSI
    const anssiFiles = [
      './src/services/validation/MetricsValidationService.ts',
      './src/services/metrics/EbiosRMMetricsService.ts'
    ];

    const anssiCompliant = anssiFiles.every(file => fs.existsSync(file));
    
    if (anssiCompliant) {
      checks.push({
        name: 'Conformité ANSSI',
        status: 'pass',
        message: 'Services de validation ANSSI présents'
      });
    } else {
      checks.push({
        name: 'Conformité ANSSI',
        status: 'fail',
        message: 'Services de validation ANSSI manquants',
        recommendation: 'Implémenter les services de validation ANSSI'
      });
    }

    this.addValidationResult('Conformité', checks);
  }

  private async validateIntegrations(): Promise<void> {
    console.log('🔗 Validation des intégrations...');
    
    const checks: CheckResult[] = [];

    // Vérification Firebase
    if (fs.existsSync('./src/lib/firebase.ts')) {
      checks.push({
        name: 'Configuration Firebase',
        status: 'pass',
        message: 'Configuration Firebase présente'
      });
    } else {
      checks.push({
        name: 'Configuration Firebase',
        status: 'fail',
        message: 'Configuration Firebase manquante',
        recommendation: 'Configurer Firebase'
      });
    }

    this.addValidationResult('Intégrations', checks);
  }

  private async validateBuild(): Promise<void> {
    console.log('Validation du build...');
    
    const checks: CheckResult[] = [];

    try {
      // Test de build
      execSync('npm run build', { stdio: 'pipe' });
      checks.push({
        name: 'Build de production',
        status: 'pass',
        message: 'Build réussi'
      });

      // Vérification de la taille du bundle
      const distPath = './dist';
      if (fs.existsSync(distPath)) {
        const bundleSize = this.calculateDirectorySize(distPath);
        const bundleSizeMB = bundleSize / (1024 * 1024);

        if (bundleSizeMB <= 5) {
          checks.push({
            name: 'Taille du bundle',
            status: 'pass',
            message: `Taille: ${bundleSizeMB.toFixed(2)}MB`
          });
        } else if (bundleSizeMB <= 10) {
          checks.push({
            name: 'Taille du bundle',
            status: 'warning',
            message: `Taille: ${bundleSizeMB.toFixed(2)}MB (recommandé: <5MB)`,
            recommendation: 'Optimiser la taille du bundle'
          });
        } else {
          checks.push({
            name: 'Taille du bundle',
            status: 'fail',
            message: `Taille: ${bundleSizeMB.toFixed(2)}MB (trop volumineux)`,
            recommendation: 'Réduire significativement la taille du bundle'
          });
        }
      }

    } catch (error) {
      checks.push({
        name: 'Build de production',
        status: 'fail',
        message: 'Échec du build',
        recommendation: 'Corriger les erreurs de build'
      });
    }

    this.addValidationResult('Build', checks);
  }

  private addValidationResult(category: string, checks: CheckResult[]): void {
    const passed = checks.filter(c => c.status === 'pass').length;
    const failed = checks.filter(c => c.status === 'fail').length;
    const warnings = checks.filter(c => c.status === 'warning').length;
    
    const score = (passed / checks.length) * 100;
    const categoryPassed = failed === 0;

    this.report.results.push({
      category,
      checks,
      passed: categoryPassed,
      score
    });

    // Mise à jour du résumé
    this.report.summary.totalChecks += checks.length;
    this.report.summary.passed += passed;
    this.report.summary.failed += failed;
    this.report.summary.warnings += warnings;

    // Ajout des blockers
    checks.forEach(check => {
      if (check.status === 'fail') {
        this.report.blockers.push(`${category}: ${check.message}`);
      }
      if (check.recommendation) {
        this.report.recommendations.push(`${category}: ${check.recommendation}`);
      }
    });

    console.log(`  ${categoryPassed ? '✅' : '❌'} ${category}: ${passed}/${checks.length} (${score.toFixed(1)}%)`);
  }

  private calculateOverallScore(): void {
    if (this.report.summary.totalChecks === 0) {
      this.report.overallScore = 0;
      this.report.overallStatus = 'fail';
      return;
    }

    this.report.overallScore = (this.report.summary.passed / this.report.summary.totalChecks) * 100;
    
    if (this.report.summary.failed > 0) {
      this.report.overallStatus = 'fail';
    } else if (this.report.summary.warnings > 0) {
      this.report.overallStatus = 'warning';
    } else {
      this.report.overallStatus = 'pass';
    }
  }

  private async generateReport(): Promise<void> {
    const reportPath = './production-validation-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));

    console.log('\n📊 RÉSUMÉ DE LA VALIDATION');
    console.log('==========================');
    console.log(`Statut global: ${this.report.overallStatus === 'pass' ? '✅ SUCCÈS' : this.report.overallStatus === 'warning' ? '⚠️ AVERTISSEMENTS' : '❌ ÉCHEC'}`);
    console.log(`Score: ${this.report.overallScore.toFixed(1)}%`);
    // console.log supprimé;
    
    if (this.report.blockers.length > 0) {
      console.log('\n🚫 BLOCKERS:');
      this.report.blockers.forEach(blocker => console.log(`  - ${blocker}`));
    }

    if (this.report.recommendations.length > 0) {
      console.log('\n💡 RECOMMANDATIONS:');
      this.report.recommendations.slice(0, 5).forEach(rec => console.log(`  - ${rec}`));
    }

    console.log(`\n📄 Rapport détaillé: ${reportPath}`);
  }

  private getAllTsFiles(dir: string): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files.push(...this.getAllTsFiles(fullPath));
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  private getAllTestFiles(dir: string): string[] {
    return this.getAllTsFiles(dir).filter(file => 
      file.includes('.test.') || file.includes('.spec.') || file.includes('__tests__')
    );
  }

  private calculateDirectorySize(dir: string): number {
    let size = 0;
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        size += this.calculateDirectorySize(fullPath);
      } else {
        size += stat.size;
      }
    }
    
    return size;
  }
}

// Exécution du script
async function main() {
  const validator = new ProductionDeploymentValidator();
  const report = await validator.runValidation();

  // Code de sortie basé sur le résultat
  if (report.overallStatus === 'fail') {
    process.exit(1);
  } else if (report.overallStatus === 'warning') {
    process.exit(0); // Warnings n'empêchent pas le déploiement
  } else {
    process.exit(0);
  }
}

// Exécution directe du script
main().catch(console.error);

export { ProductionDeploymentValidator };
