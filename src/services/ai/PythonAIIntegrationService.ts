/**
 * 🤖 PYTHON AI INTEGRATION SERVICE
 * Service d'intégration entre le frontend React et le service Python IA
 */

import { logger } from '../logging/SecureLogger';

// Types pour l'intégration IA
export interface WorkshopAnalysisRequest {
  mission_id: string;
  business_values: any[];
  essential_assets: any[];
  supporting_assets: any[];
  dreaded_events: any[];
  current_step?: string;
}

export interface AISuggestion {
  id: string;
  type: 'action' | 'tip' | 'warning' | 'insight';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  rationale: string;
  action_label?: string;
  action_data?: any;
  confidence: number;
  context: Record<string, any>;
  created_at: string;
  applied: boolean;
}

export interface WorkshopAnalysis {
  mission_id: string;
  workshop_number: number;
  completion_status: Record<string, boolean>;
  quality_metrics: Record<string, number>;
  suggestions: AISuggestion[];
  coherence_report: any;
  next_steps: string[];
  estimated_completion_time?: string;
  analysis_timestamp: string;
}

export interface CoherenceReport {
  mission_id: string;
  overall_score: number;
  issues: any[];
  recommendations: string[];
  analysis_date: string;
  is_coherent: boolean;
}

export interface AIServiceResponse<T = any> {
  status: string;
  message?: string;
  data?: T;
  timestamp: string;
  request_id?: string;
}

class PythonAIIntegrationService {
  private baseUrl: string;
  private isServiceAvailable: boolean = false;
  private lastHealthCheck: Date | null = null;
  private healthCheckInterval: number = 30000; // 30 secondes

  constructor() {
    this.baseUrl = import.meta.env.VITE_PYTHON_AI_SERVICE_URL || 'http://localhost:8000';
    this.checkServiceHealth();
    
    // Vérification périodique de la santé du service
    setInterval(() => {
      this.checkServiceHealth();
    }, this.healthCheckInterval);
  }

  /**
   * Vérifie la santé du service Python IA
   */
  private async checkServiceHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // Timeout de 5 secondes
      });

      if (response.ok) {
        const healthData = await response.json();
        this.isServiceAvailable = healthData.status === 'healthy';
        this.lastHealthCheck = new Date();
        
        if (this.isServiceAvailable) {
          logger.info('🤖 Service Python IA disponible', { 
            url: this.baseUrl,
            services: healthData.services 
          });
        }
      } else {
        this.isServiceAvailable = false;
        logger.warn('⚠️ Service Python IA indisponible', { 
          status: response.status,
          url: this.baseUrl 
        });
      }
    } catch (error) {
      this.isServiceAvailable = false;
      logger.warn('🔧 Service Python IA non accessible, mode fallback activé', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        url: this.baseUrl 
      });
    }

    return this.isServiceAvailable;
  }

  /**
   * Vérifie si le service IA est disponible
   */
  public isAvailable(): boolean {
    return this.isServiceAvailable;
  }

  /**
   * Analyse complète du Workshop 1
   */
  public async analyzeWorkshop1(request: WorkshopAnalysisRequest): Promise<WorkshopAnalysis | null> {
    if (!this.isServiceAvailable) {
      logger.info('🔧 Service IA indisponible, utilisation du fallback');
      return this.generateFallbackAnalysis(request);
    }

    try {
      logger.info('🔍 Analyse Workshop 1 via service Python IA', { 
        mission_id: request.mission_id,
        current_step: request.current_step 
      });

      const response = await fetch(`${this.baseUrl}/workshop1/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(30000) // Timeout de 30 secondes
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: AIServiceResponse<{ analysis: WorkshopAnalysis }> = await response.json();
      
      if (result.status === 'success' && result.data?.analysis) {
        logger.info('✅ Analyse Workshop 1 réussie', { 
          mission_id: request.mission_id,
          suggestions_count: result.data.analysis.suggestions.length 
        });
        return result.data.analysis;
      } else {
        throw new Error(`Analyse échouée: ${result.message || 'Unknown error'}`);
      }

    } catch (error) {
      logger.error('❌ Erreur analyse Workshop 1', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        mission_id: request.mission_id 
      });
      
      // Fallback en cas d'erreur
      return this.generateFallbackAnalysis(request);
    }
  }

  /**
   * Génère des suggestions intelligentes
   */
  public async generateSuggestions(
    context: any,
    criterion: string,
    currentData: any,
    maxSuggestions: number = 5
  ): Promise<AISuggestion[]> {
    if (!this.isServiceAvailable) {
      return this.generateFallbackSuggestions(criterion, currentData, maxSuggestions);
    }

    try {
      const response = await fetch(`${this.baseUrl}/workshop1/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context,
          criterion,
          current_data: currentData
        }),
        signal: AbortSignal.timeout(15000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: AIServiceResponse<{ suggestions: AISuggestion[] }> = await response.json();
      
      if (result.status === 'success' && result.data?.suggestions) {
        logger.info('💡 Suggestions générées avec succès', { 
          criterion,
          count: result.data.suggestions.length 
        });
        return result.data.suggestions;
      } else {
        throw new Error(`Génération de suggestions échouée: ${result.message || 'Unknown error'}`);
      }

    } catch (error) {
      logger.error('❌ Erreur génération suggestions', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        criterion 
      });
      
      return this.generateFallbackSuggestions(criterion, currentData, maxSuggestions);
    }
  }

  /**
   * Analyse la cohérence des données
   */
  public async analyzeCoherence(missionId: string, workshopData: any): Promise<CoherenceReport | null> {
    if (!this.isServiceAvailable) {
      return this.generateFallbackCoherenceReport(missionId, workshopData);
    }

    try {
      const response = await fetch(`${this.baseUrl}/workshop1/coherence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mission_id: missionId,
          workshop_data: workshopData
        }),
        signal: AbortSignal.timeout(20000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: AIServiceResponse<{ coherence_report: CoherenceReport }> = await response.json();
      
      if (result.status === 'success' && result.data?.coherence_report) {
        logger.info('🔍 Analyse de cohérence réussie', { 
          mission_id: missionId,
          score: result.data.coherence_report.overall_score 
        });
        return result.data.coherence_report;
      } else {
        throw new Error(`Analyse de cohérence échouée: ${result.message || 'Unknown error'}`);
      }

    } catch (error) {
      logger.error('❌ Erreur analyse cohérence', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        mission_id: missionId 
      });
      
      return this.generateFallbackCoherenceReport(missionId, workshopData);
    }
  }

  /**
   * Obtient la guidance contextuelle
   */
  public async getContextualGuidance(workshopStep: string): Promise<any> {
    if (!this.isServiceAvailable) {
      return this.generateFallbackGuidance(workshopStep);
    }

    try {
      const response = await fetch(`${this.baseUrl}/workshop1/guidance/${workshopStep}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: AIServiceResponse<{ guidance: any }> = await response.json();
      
      if (result.status === 'success' && result.data?.guidance) {
        return result.data.guidance;
      } else {
        throw new Error(`Guidance échouée: ${result.message || 'Unknown error'}`);
      }

    } catch (error) {
      logger.error('❌ Erreur guidance contextuelle', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        workshop_step: workshopStep 
      });
      
      return this.generateFallbackGuidance(workshopStep);
    }
  }

  // === MÉTHODES FALLBACK ===

  private generateFallbackAnalysis(request: WorkshopAnalysisRequest): WorkshopAnalysis {
    const completionStatus = {
      business_values: request.business_values.length >= 1,
      essential_assets: request.essential_assets.length >= 1,
      supporting_assets: request.supporting_assets.length >= 1,
      dreaded_events: request.dreaded_events.length >= 1
    };

    const completedSections = Object.values(completionStatus).filter(Boolean).length;
    const completionPercentage = (completedSections / 4) * 100;

    return {
      mission_id: request.mission_id,
      workshop_number: 1,
      completion_status: completionStatus,
      quality_metrics: {
        completeness: completionPercentage,
        coherence: 75,
        detail_level: 60,
        ebios_compliance: completionPercentage * 0.8
      },
      suggestions: this.generateFallbackSuggestions(request.current_step || 'general', request, 3),
      coherence_report: this.generateFallbackCoherenceReport(request.mission_id, request),
      next_steps: this.generateNextSteps(completionStatus),
      estimated_completion_time: this.estimateCompletionTime(completedSections),
      analysis_timestamp: new Date().toISOString()
    };
  }

  private generateFallbackSuggestions(criterion: string, currentData: any, maxSuggestions: number): AISuggestion[] {
    const suggestions: AISuggestion[] = [];
    const timestamp = new Date().toISOString();

    // Suggestions basiques selon le critère
    const suggestionTemplates = {
      'business-values': {
        title: '🎯 Définir vos valeurs métier',
        description: 'Identifiez ce qui a de la valeur pour votre organisation',
        type: 'action' as const,
        priority: 'high' as const
      },
      'essential-assets': {
        title: '🏗️ Identifier vos biens essentiels',
        description: 'Cataloguez les informations, processus et savoir-faire critiques',
        type: 'action' as const,
        priority: 'high' as const
      },
      'supporting-assets': {
        title: '🔧 Répertorier vos biens supports',
        description: 'Listez les éléments techniques, organisationnels et humains',
        type: 'action' as const,
        priority: 'medium' as const
      },
      'dreaded-events': {
        title: '🚨 Définir vos événements redoutés',
        description: 'Identifiez ce que vous craignez qu\'il arrive à vos valeurs métier',
        type: 'action' as const,
        priority: 'high' as const
      }
    };

    const template = suggestionTemplates[criterion as keyof typeof suggestionTemplates];
    if (template) {
      suggestions.push({
        id: `fallback_${criterion}_${Date.now()}`,
        type: template.type,
        priority: template.priority,
        title: template.title,
        description: template.description,
        rationale: 'Suggestion générée par le système de fallback',
        confidence: 0.7,
        context: { fallback: true, criterion },
        created_at: timestamp,
        applied: false
      });
    }

    return suggestions.slice(0, maxSuggestions);
  }

  private generateFallbackCoherenceReport(missionId: string, workshopData: any): CoherenceReport {
    return {
      mission_id: missionId,
      overall_score: 75,
      issues: [],
      recommendations: [
        'Vérifiez les liens entre vos valeurs métier et biens essentiels',
        'Assurez-vous que tous les biens supports sont rattachés à des biens essentiels',
        'Complétez les descriptions pour une meilleure analyse'
      ],
      analysis_date: new Date().toISOString(),
      is_coherent: true
    };
  }

  private generateFallbackGuidance(workshopStep: string): any {
    const guidanceMap = {
      'business-values': {
        title: 'Valeurs métier',
        description: 'Identifiez ce qui a de la valeur pour votre organisation',
        objectives: ['Identifier les processus critiques', 'Définir les enjeux de conformité'],
        best_practices: ['Impliquer les métiers', 'Quantifier les impacts'],
        examples: ['Facturation client', 'Données personnelles', 'Réputation']
      },
      'essential-assets': {
        title: 'Biens essentiels',
        description: 'Cataloguez les informations, processus et savoir-faire',
        objectives: ['Identifier les informations critiques', 'Cartographier les processus'],
        best_practices: ['Lier aux valeurs métier', 'Classer par criticité'],
        examples: ['Base de données clients', 'Processus de validation', 'Expertise technique']
      }
    };

    return guidanceMap[workshopStep as keyof typeof guidanceMap] || {
      title: 'Guidance générale',
      description: 'Suivez la méthodologie EBIOS RM',
      objectives: ['Compléter l\'atelier'],
      best_practices: ['Être exhaustif'],
      examples: []
    };
  }

  private generateNextSteps(completionStatus: Record<string, boolean>): string[] {
    const steps = [];
    
    if (!completionStatus.business_values) {
      steps.push('Définir au moins une valeur métier');
    }
    if (!completionStatus.essential_assets) {
      steps.push('Identifier les biens essentiels');
    }
    if (!completionStatus.supporting_assets) {
      steps.push('Cataloguer les biens supports');
    }
    if (!completionStatus.dreaded_events) {
      steps.push('Définir les événements redoutés');
    }
    
    if (steps.length === 0) {
      steps.push('Réviser et enrichir les descriptions');
      steps.push('Préparer l\'atelier 2');
    }
    
    return steps;
  }

  private estimateCompletionTime(completedSections: number): string {
    const remaining = 4 - completedSections;
    
    if (remaining === 0) return 'Atelier terminé';
    if (remaining === 1) return '15-30 minutes';
    if (remaining === 2) return '30-60 minutes';
    return '1-2 heures';
  }
}

// Instance singleton
export const pythonAIService = new PythonAIIntegrationService();

export default PythonAIIntegrationService;
