/**
 * 🔍 EXÉCUTEUR D'AUDIT FIREBASE EBIOS RM
 * 
 * Script principal pour auditer et valider le schéma Firebase
 * avant déploiement sur GCP
 */

import { ALL_SCHEMAS, type CollectionSchema } from './firebase-schema-audit';
import * as fs from 'fs';
import * as path from 'path';

interface AuditResult {
  collection: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  issues: AuditIssue[];
  recommendations: string[];
}

interface AuditIssue {
  type: 'MISSING_FIELD' | 'MISSING_INDEX' | 'INVALID_CONSTRAINT' | 'RELATIONSHIP_ERROR' | 'PERFORMANCE_WARNING';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  field?: string;
  suggestion?: string;
}

class FirebaseSchemaAuditor {
  private results: AuditResult[] = [];
  private serviceFiles: string[] = [];

  constructor() {
    this.loadServiceFiles();
  }

  /**
   * Charger tous les fichiers de service Firebase
   */
  private loadServiceFiles(): void {
    const servicesDir = path.join(process.cwd(), 'src/services/firebase');
    
    try {
      const files = fs.readdirSync(servicesDir);
      this.serviceFiles = files
        .filter(file => file.endsWith('.ts') && !file.endsWith('.test.ts'))
        .map(file => path.join(servicesDir, file));
    } catch (error) {
      console.error('❌ Erreur lors du chargement des services Firebase:', error);
    }
  }

  /**
   * Auditer une collection spécifique
   */
  private auditCollection(schema: CollectionSchema): AuditResult {
    const result: AuditResult = {
      collection: schema.name,
      status: 'PASS',
      issues: [],
      recommendations: []
    };

    // 1. Vérifier l'existence du service Firebase
    const serviceFile = this.serviceFiles.find(file => 
      file.includes(schema.name) || 
      file.includes(schema.name.slice(0, -1)) // Singulier
    );

    if (!serviceFile) {
      result.issues.push({
        type: 'MISSING_FIELD',
        severity: 'HIGH',
        message: `Service Firebase manquant pour la collection '${schema.name}'`,
        suggestion: `Créer src/services/firebase/${schema.name}.ts`
      });
    } else {
      // 2. Analyser le contenu du service
      this.analyzeServiceFile(serviceFile, schema, result);
    }

    // 3. Vérifier les index requis
    this.checkRequiredIndexes(schema, result);

    // 4. Vérifier les contraintes
    this.checkConstraints(schema, result);

    // 5. Vérifier les relations
    this.checkRelationships(schema, result);

    // 6. Recommandations de performance
    this.addPerformanceRecommendations(schema, result);

    // Déterminer le statut final
    const criticalIssues = result.issues.filter(i => i.severity === 'CRITICAL');
    const highIssues = result.issues.filter(i => i.severity === 'HIGH');

    if (criticalIssues.length > 0) {
      result.status = 'FAIL';
    } else if (highIssues.length > 0) {
      result.status = 'WARNING';
    }

    return result;
  }

  /**
   * Analyser un fichier de service Firebase
   */
  private analyzeServiceFile(filePath: string, schema: CollectionSchema, result: AuditResult): void {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');

      // Vérifier la présence des opérations CRUD
      const operations = ['create', 'get', 'update', 'delete'];
      const missingOperations = operations.filter(op => 
        !content.includes(`${op}${schema.name.charAt(0).toUpperCase()}${schema.name.slice(1)}`) &&
        !content.includes(`${op}${schema.name.slice(0, -1).charAt(0).toUpperCase()}${schema.name.slice(0, -1).slice(1)}`)
      );

      missingOperations.forEach(op => {
        result.issues.push({
          type: 'MISSING_FIELD',
          severity: 'MEDIUM',
          message: `Opération ${op} manquante dans ${path.basename(filePath)}`,
          suggestion: `Implémenter la fonction ${op}${schema.name.slice(0, -1)}`
        });
      });

      // Vérifier la gestion des timestamps
      if (!content.includes('serverTimestamp')) {
        result.issues.push({
          type: 'MISSING_FIELD',
          severity: 'MEDIUM',
          message: 'Gestion des timestamps serveur manquante',
          suggestion: 'Utiliser serverTimestamp() pour createdAt et updatedAt'
        });
      }

      // Vérifier la gestion d'erreurs
      if (!content.includes('try') || !content.includes('catch')) {
        result.issues.push({
          type: 'MISSING_FIELD',
          severity: 'HIGH',
          message: 'Gestion d\'erreurs insuffisante',
          suggestion: 'Ajouter des blocs try/catch pour toutes les opérations Firebase'
        });
      }

      // Vérifier les requêtes optimisées
      if (content.includes('orderBy') && content.includes('where')) {
        result.issues.push({
          type: 'PERFORMANCE_WARNING',
          severity: 'MEDIUM',
          message: 'Requêtes composites détectées - vérifier les index',
          suggestion: 'S\'assurer que les index composites sont configurés'
        });
      }

    } catch (error) {
      result.issues.push({
        type: 'MISSING_FIELD',
        severity: 'CRITICAL',
        message: `Impossible de lire le fichier de service: ${error}`,
        suggestion: 'Vérifier l\'existence et les permissions du fichier'
      });
    }
  }

  /**
   * Vérifier les index requis
   */
  private checkRequiredIndexes(schema: CollectionSchema, result: AuditResult): void {
    const requiredIndexes = schema.indexes.filter(idx => idx.required);
    
    requiredIndexes.forEach(index => {
      if (index.type === 'composite') {
        result.recommendations.push(
          `Index composite requis pour ${schema.name}: ${index.fields.join(', ')}`
        );
      }
    });

    // Vérifications spécifiques pour les performances
    if (schema.name === 'missions' && !schema.indexes.some(idx => idx.fields.includes('status'))) {
      result.issues.push({
        type: 'MISSING_INDEX',
        severity: 'HIGH',
        message: 'Index manquant sur le champ status pour les missions',
        suggestion: 'Créer un index sur missions.status'
      });
    }
  }

  /**
   * Vérifier les contraintes
   */
  private checkConstraints(schema: CollectionSchema, result: AuditResult): void {
    schema.constraints.forEach(constraint => {
      if (constraint.type === 'required' && !schema.requiredFields.includes(constraint.field)) {
        result.issues.push({
          type: 'INVALID_CONSTRAINT',
          severity: 'MEDIUM',
          message: `Contrainte required sur un champ optionnel: ${constraint.field}`,
          field: constraint.field,
          suggestion: 'Ajouter le champ aux requiredFields ou supprimer la contrainte'
        });
      }
    });
  }

  /**
   * Vérifier les relations entre collections
   */
  private checkRelationships(schema: CollectionSchema, result: AuditResult): void {
    schema.relationships.forEach(rel => {
      const targetExists = ALL_SCHEMAS.some(s => s.name === rel.targetCollection);
      
      if (!targetExists) {
        result.issues.push({
          type: 'RELATIONSHIP_ERROR',
          severity: 'HIGH',
          message: `Relation vers une collection inexistante: ${rel.targetCollection}`,
          field: rel.field,
          suggestion: `Vérifier l'existence de la collection ${rel.targetCollection}`
        });
      }

      if (rel.cascadeDelete && rel.type !== 'many-to-one') {
        result.issues.push({
          type: 'RELATIONSHIP_ERROR',
          severity: 'MEDIUM',
          message: `Cascade delete sur une relation ${rel.type}`,
          field: rel.field,
          suggestion: 'Revoir la logique de suppression en cascade'
        });
      }
    });
  }

  /**
   * Ajouter des recommandations de performance
   */
  private addPerformanceRecommendations(schema: CollectionSchema, result: AuditResult): void {
    // Recommandations basées sur la taille estimée des collections
    const largeCollections = ['missions', 'businessValues', 'supportingAssets', 'dreadedEvents'];
    
    if (largeCollections.includes(schema.name)) {
      result.recommendations.push(
        `Collection ${schema.name}: Considérer la pagination pour les grandes listes`,
        `Collection ${schema.name}: Implémenter le cache côté client pour les données fréquemment consultées`
      );
    }

    // Recommandations pour les requêtes temps réel
    if (schema.name === 'missions') {
      result.recommendations.push(
        'Considérer l\'utilisation de onSnapshot pour les mises à jour temps réel des missions actives'
      );
    }
  }

  /**
   * Exécuter l'audit complet
   */
  public async runFullAudit(): Promise<void> {
    console.log('🔍 DÉBUT DE L\'AUDIT FIREBASE EBIOS RM\n');
    console.log('=' .repeat(60));

    // Auditer chaque collection
    for (const schema of ALL_SCHEMAS) {
      console.log(`\n📋 Audit de la collection: ${schema.name}`);
      const result = this.auditCollection(schema);
      this.results.push(result);

      // Afficher le résultat immédiatement
      this.displayCollectionResult(result);
    }

    // Générer le rapport final
    this.generateFinalReport();
  }

  /**
   * Afficher le résultat d'une collection
   */
  private displayCollectionResult(result: AuditResult): void {
    const statusIcon = {
      'PASS': '✅',
      'WARNING': '⚠️',
      'FAIL': '❌'
    }[result.status];

    console.log(`${statusIcon} ${result.collection}: ${result.status}`);

    if (result.issues.length > 0) {
      console.log('  Issues:');
      result.issues.forEach(issue => {
        const severityIcon = {
          'LOW': '🔵',
          'MEDIUM': '🟡',
          'HIGH': '🟠',
          'CRITICAL': '🔴'
        }[issue.severity];
        
        console.log(`    ${severityIcon} ${issue.message}`);
        if (issue.suggestion) {
          console.log(`       💡 ${issue.suggestion}`);
        }
      });
    }

    if (result.recommendations.length > 0) {
      console.log('  Recommandations:');
      result.recommendations.forEach(rec => {
        console.log(`    💡 ${rec}`);
      });
    }
  }

  /**
   * Générer le rapport final
   */
  private generateFinalReport(): void {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 RAPPORT FINAL D\'AUDIT');
    console.log('=' .repeat(60));

    const totalCollections = this.results.length;
    const passCount = this.results.filter(r => r.status === 'PASS').length;
    const warningCount = this.results.filter(r => r.status === 'WARNING').length;
    const failCount = this.results.filter(r => r.status === 'FAIL').length;

    console.log(`\n📈 Statistiques:`);
    console.log(`  Total des collections: ${totalCollections}`);
    console.log(`  ✅ Succès: ${passCount}`);
    console.log(`  ⚠️  Avertissements: ${warningCount}`);
    console.log(`  ❌ Échecs: ${failCount}`);

    // Issues critiques
    const criticalIssues = this.results.flatMap(r => 
      r.issues.filter(i => i.severity === 'CRITICAL')
    );

    if (criticalIssues.length > 0) {
      console.log(`\n🚨 ISSUES CRITIQUES À RÉSOUDRE AVANT DÉPLOIEMENT:`);
      criticalIssues.forEach(issue => {
        console.log(`  🔴 ${issue.message}`);
        if (issue.suggestion) {
          console.log(`     💡 ${issue.suggestion}`);
        }
      });
    }

    // Recommandations prioritaires
    console.log(`\n🎯 ACTIONS PRIORITAIRES POUR LE DÉPLOIEMENT GCP:`);
    console.log(`  1. Configurer tous les index composites requis`);
    console.log(`  2. Vérifier les règles de sécurité Firestore`);
    console.log(`  3. Configurer la sauvegarde automatique`);
    console.log(`  4. Mettre en place le monitoring des performances`);
    console.log(`  5. Tester les requêtes avec des données de production`);

    // Statut final
    const overallStatus = failCount > 0 ? 'ÉCHEC' : warningCount > 0 ? 'AVERTISSEMENT' : 'SUCCÈS';
    const statusIcon = failCount > 0 ? '❌' : warningCount > 0 ? '⚠️' : '✅';
    
    console.log(`\n${statusIcon} STATUT GLOBAL: ${overallStatus}`);
    
    if (failCount === 0) {
      console.log(`\n🚀 Le schéma Firebase est prêt pour le déploiement GCP !`);
    } else {
      console.log(`\n⚠️  Résoudre les issues critiques avant le déploiement.`);
    }

    // Sauvegarder le rapport
    this.saveReportToFile();
  }

  /**
   * Sauvegarder le rapport dans un fichier
   */
  private saveReportToFile(): void {
    const reportData = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        pass: this.results.filter(r => r.status === 'PASS').length,
        warning: this.results.filter(r => r.status === 'WARNING').length,
        fail: this.results.filter(r => r.status === 'FAIL').length
      },
      results: this.results
    };

    const reportPath = path.join(process.cwd(), 'firebase-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`\n📄 Rapport sauvegardé: ${reportPath}`);
  }
}

// Exécuter l'audit si le script est appelé directement
if (require.main === module) {
  const auditor = new FirebaseSchemaAuditor();
  auditor.runFullAudit().catch(console.error);
}

export { FirebaseSchemaAuditor };
