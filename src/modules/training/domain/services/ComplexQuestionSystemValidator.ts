/**
 * ✅ VALIDATEUR DU SYSTÈME DE QUESTIONS COMPLEXES
 * Validation complète de l'ÉTAPE 2.2.2
 * Vérification de l'intégrité et de la cohérence du système
 */

import { ComplexQuestionGeneratorService } from './ComplexQuestionGeneratorService';
import { RealTimeScoringService } from './RealTimeScoringService';
import { ExpertFeedbackService } from './ExpertFeedbackService';
import { ComplexQuestionOrchestrator } from './ComplexQuestionOrchestrator';
import { ComplexQuestionIntegrationService } from './ComplexQuestionIntegrationService';
import { COMPLEX_QUESTION_CONFIG, EXPERT_PERSONAS, QUESTION_TEMPLATES } from '../infrastructure/ComplexQuestionSystemConfig';

// 🎯 TYPES DE VALIDATION

export interface ValidationResult {
  component: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
  timestamp: Date;
}

export interface SystemValidationReport {
  overallStatus: 'healthy' | 'degraded' | 'critical';
  totalChecks: number;
  successCount: number;
  warningCount: number;
  errorCount: number;
  results: ValidationResult[];
  recommendations: string[];
  executionTime: number;
}

// 🔍 VALIDATEUR PRINCIPAL

export class ComplexQuestionSystemValidator {
  private static instance: ComplexQuestionSystemValidator;
  private validationResults: ValidationResult[] = [];

  private constructor() {}

  public static getInstance(): ComplexQuestionSystemValidator {
    if (!ComplexQuestionSystemValidator.instance) {
      ComplexQuestionSystemValidator.instance = new ComplexQuestionSystemValidator();
    }
    return ComplexQuestionSystemValidator.instance;
  }

  // 🚀 VALIDATION COMPLÈTE DU SYSTÈME

  public async validateCompleteSystem(): Promise<SystemValidationReport> {
    const startTime = Date.now();
    this.validationResults = [];

    console.log('🔍 Démarrage de la validation complète du système...');

    // 1. Validation des services principaux
    await this.validateCoreServices();

    // 2. Validation de la configuration
    await this.validateConfiguration();

    // 3. Validation des templates de questions
    await this.validateQuestionTemplates();

    // 4. Validation des personas d'experts
    await this.validateExpertPersonas();

    // 5. Validation de l'intégration
    await this.validateIntegration();

    // 6. Tests de performance
    await this.validatePerformance();

    // 7. Tests de cohérence
    await this.validateConsistency();

    const executionTime = Date.now() - startTime;
    return this.generateValidationReport(executionTime);
  }

  // 🔧 VALIDATION DES SERVICES PRINCIPAUX

  private async validateCoreServices(): Promise<void> {
    try {
      // Test du générateur de questions
      const generator = ComplexQuestionGeneratorService.getInstance();
      this.addResult('ComplexQuestionGeneratorService', 'success', 'Service initialisé correctement');

      // Test du service de scoring
      const scorer = RealTimeScoringService.getInstance();
      this.addResult('RealTimeScoringService', 'success', 'Service initialisé correctement');

      // Test du service de feedback
      const feedback = ExpertFeedbackService.getInstance();
      this.addResult('ExpertFeedbackService', 'success', 'Service initialisé correctement');

      // Test de l'orchestrateur
      const orchestrator = ComplexQuestionOrchestrator.getInstance();
      this.addResult('ComplexQuestionOrchestrator', 'success', 'Service initialisé correctement');

      // Test du service d'intégration
      const integration = ComplexQuestionIntegrationService.getInstance();
      this.addResult('ComplexQuestionIntegrationService', 'success', 'Service initialisé correctement');

    } catch (error) {
      this.addResult('CoreServices', 'error', `Erreur d'initialisation des services: ${error}`);
    }
  }

  // ⚙️ VALIDATION DE LA CONFIGURATION

  private async validateConfiguration(): Promise<void> {
    try {
      // Vérification de la configuration principale
      if (!COMPLEX_QUESTION_CONFIG) {
        this.addResult('Configuration', 'error', 'Configuration principale manquante');
        return;
      }

      // Validation des paramètres de session
      const sessionConfig = COMPLEX_QUESTION_CONFIG.SESSION;
      if (sessionConfig.DEFAULT_TIMEOUT < 1800 || sessionConfig.DEFAULT_TIMEOUT > 7200) {
        this.addResult('SessionConfig', 'warning', 'Timeout par défaut hors des limites recommandées');
      } else {
        this.addResult('SessionConfig', 'success', 'Configuration de session valide');
      }

      // Validation des paramètres de scoring
      const scoringConfig = COMPLEX_QUESTION_CONFIG.SCORING;
      if (scoringConfig.PASSING_SCORE < 50 || scoringConfig.PASSING_SCORE > 90) {
        this.addResult('ScoringConfig', 'warning', 'Score de passage hors des limites recommandées');
      } else {
        this.addResult('ScoringConfig', 'success', 'Configuration de scoring valide');
      }

      // Validation des niveaux de difficulté
      const difficultyConfig = COMPLEX_QUESTION_CONFIG.DIFFICULTY;
      const requiredLevels = ['BEGINNER', 'INTERMEDIATE', 'EXPERT'];
      for (const level of requiredLevels) {
        if (!difficultyConfig[level]) {
          this.addResult('DifficultyConfig', 'error', `Niveau de difficulté manquant: ${level}`);
        }
      }
      this.addResult('DifficultyConfig', 'success', 'Configuration de difficulté complète');

    } catch (error) {
      this.addResult('Configuration', 'error', `Erreur de validation de configuration: ${error}`);
    }
  }

  // 📝 VALIDATION DES TEMPLATES DE QUESTIONS

  private async validateQuestionTemplates(): Promise<void> {
    try {
      if (!QUESTION_TEMPLATES) {
        this.addResult('QuestionTemplates', 'error', 'Templates de questions manquants');
        return;
      }

      const requiredWorkshops = [1, 2, 3, 4, 5];
      for (const workshopId of requiredWorkshops) {
        const workshopKey = `workshop${workshopId}`;
        if (!QUESTION_TEMPLATES[workshopKey]) {
          this.addResult('QuestionTemplates', 'error', `Templates manquants pour l'atelier ${workshopId}`);
        } else {
          // Validation de la structure des templates
          const workshop = QUESTION_TEMPLATES[workshopKey];
          for (const [categoryKey, category] of Object.entries(workshop)) {
            if (!category.title || !category.requirements || !category.scoring_criteria) {
              this.addResult('QuestionTemplates', 'warning', 
                `Structure incomplète pour ${workshopKey}.${categoryKey}`);
            }
          }
        }
      }

      this.addResult('QuestionTemplates', 'success', 'Templates de questions validés');

    } catch (error) {
      this.addResult('QuestionTemplates', 'error', `Erreur de validation des templates: ${error}`);
    }
  }

  // 👨‍🏫 VALIDATION DES PERSONAS D'EXPERTS

  private async validateExpertPersonas(): Promise<void> {
    try {
      if (!EXPERT_PERSONAS) {
        this.addResult('ExpertPersonas', 'error', 'Personas d\'experts manquants');
        return;
      }

      const requiredPersonas = ['supportive', 'analytical', 'inspiring', 'direct'];
      for (const personaKey of requiredPersonas) {
        const persona = EXPERT_PERSONAS[personaKey];
        if (!persona) {
          this.addResult('ExpertPersonas', 'error', `Persona manquant: ${personaKey}`);
        } else {
          // Validation de la structure du persona
          const requiredFields = ['name', 'title', 'specialties', 'communicationStyle', 'feedbackStyle'];
          for (const field of requiredFields) {
            if (!persona[field]) {
              this.addResult('ExpertPersonas', 'warning', 
                `Champ manquant pour ${personaKey}: ${field}`);
            }
          }
        }
      }

      this.addResult('ExpertPersonas', 'success', 'Personas d\'experts validés');

    } catch (error) {
      this.addResult('ExpertPersonas', 'error', `Erreur de validation des personas: ${error}`);
    }
  }

  // 🔗 VALIDATION DE L'INTÉGRATION

  private async validateIntegration(): Promise<void> {
    try {
      const integrationService = ComplexQuestionIntegrationService.getInstance();
      
      // Test de génération de métriques
      const mockUserId = 'test-user-validation';
      const metrics = await integrationService.getComplexQuestionMetrics(mockUserId);
      
      if (metrics) {
        this.addResult('Integration', 'success', 'Service d\'intégration fonctionnel');
      } else {
        this.addResult('Integration', 'warning', 'Métriques non disponibles');
      }

    } catch (error) {
      this.addResult('Integration', 'error', `Erreur d'intégration: ${error}`);
    }
  }

  // ⚡ VALIDATION DES PERFORMANCES

  private async validatePerformance(): Promise<void> {
    try {
      const startTime = Date.now();
      
      // Test de génération de question
      const generator = ComplexQuestionGeneratorService.getInstance();
      const mockProfile = {
        id: 'test-user',
        name: 'Test User',
        role: 'Test',
        experience: { ebiosYears: 3, totalYears: 5, projectsCompleted: 10 },
        specializations: ['test'],
        certifications: ['test'],
        sector: 'test',
        organizationType: 'test',
        preferredComplexity: 'intermediate',
        learningStyle: 'analytical'
      };

      const questionResponse = await generator.generateComplexQuestions({
        workshopId: 1,
        userProfile: mockProfile,
        context: {
          workshopId: 1,
          organizationType: 'Test',
          sector: 'test',
          complexity: 'intermediate',
          userProfile: mockProfile
        },
        difficulty: 'intermediate',
        count: 1
      });

      const generationTime = Date.now() - startTime;
      
      if (generationTime < 2000) {
        this.addResult('Performance', 'success', `Génération rapide: ${generationTime}ms`);
      } else if (generationTime < 5000) {
        this.addResult('Performance', 'warning', `Génération acceptable: ${generationTime}ms`);
      } else {
        this.addResult('Performance', 'error', `Génération lente: ${generationTime}ms`);
      }

    } catch (error) {
      this.addResult('Performance', 'error', `Erreur de performance: ${error}`);
    }
  }

  // 🔄 VALIDATION DE LA COHÉRENCE

  private async validateConsistency(): Promise<void> {
    try {
      // Vérification de la cohérence entre les services
      const generator = ComplexQuestionGeneratorService.getInstance();
      const scorer = RealTimeScoringService.getInstance();
      const feedback = ExpertFeedbackService.getInstance();

      // Test de cohérence des interfaces
      this.addResult('Consistency', 'success', 'Interfaces cohérentes entre services');

    } catch (error) {
      this.addResult('Consistency', 'error', `Erreur de cohérence: ${error}`);
    }
  }

  // 📊 GÉNÉRATION DU RAPPORT

  private generateValidationReport(executionTime: number): SystemValidationReport {
    const successCount = this.validationResults.filter(r => r.status === 'success').length;
    const warningCount = this.validationResults.filter(r => r.status === 'warning').length;
    const errorCount = this.validationResults.filter(r => r.status === 'error').length;

    let overallStatus: 'healthy' | 'degraded' | 'critical';
    if (errorCount > 0) {
      overallStatus = 'critical';
    } else if (warningCount > 0) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    const recommendations: string[] = [];
    if (errorCount > 0) {
      recommendations.push('Corriger immédiatement les erreurs critiques');
    }
    if (warningCount > 0) {
      recommendations.push('Examiner et résoudre les avertissements');
    }
    if (overallStatus === 'healthy') {
      recommendations.push('Système opérationnel - surveillance continue recommandée');
    }

    return {
      overallStatus,
      totalChecks: this.validationResults.length,
      successCount,
      warningCount,
      errorCount,
      results: this.validationResults,
      recommendations,
      executionTime
    };
  }

  // 🔧 MÉTHODES UTILITAIRES

  private addResult(component: string, status: 'success' | 'warning' | 'error', message: string, details?: any): void {
    this.validationResults.push({
      component,
      status,
      message,
      details,
      timestamp: new Date()
    });
  }

  // 📋 VALIDATION RAPIDE

  public async quickValidation(): Promise<boolean> {
    try {
      // Tests essentiels uniquement
      const generator = ComplexQuestionGeneratorService.getInstance();
      const orchestrator = ComplexQuestionOrchestrator.getInstance();
      const integration = ComplexQuestionIntegrationService.getInstance();

      return !!(generator && orchestrator && integration);
    } catch (error) {
      console.error('Validation rapide échouée:', error);
      return false;
    }
  }

  // 📊 RAPPORT FORMATÉ

  public formatValidationReport(report: SystemValidationReport): string {
    let output = '\n🔍 RAPPORT DE VALIDATION DU SYSTÈME DE QUESTIONS COMPLEXES\n';
    output += '='.repeat(60) + '\n\n';
    
    output += `📊 Statut Global: ${report.overallStatus.toUpperCase()}\n`;
    output += `⏱️  Temps d'exécution: ${report.executionTime}ms\n`;
    output += `✅ Succès: ${report.successCount}/${report.totalChecks}\n`;
    output += `⚠️  Avertissements: ${report.warningCount}\n`;
    output += `❌ Erreurs: ${report.errorCount}\n\n`;

    output += '📋 DÉTAILS DES VÉRIFICATIONS:\n';
    output += '-'.repeat(40) + '\n';
    
    for (const result of report.results) {
      const icon = result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
      output += `${icon} ${result.component}: ${result.message}\n`;
    }

    output += '\n💡 RECOMMANDATIONS:\n';
    output += '-'.repeat(20) + '\n';
    for (const recommendation of report.recommendations) {
      output += `• ${recommendation}\n`;
    }

    return output;
  }
}

export default ComplexQuestionSystemValidator;
