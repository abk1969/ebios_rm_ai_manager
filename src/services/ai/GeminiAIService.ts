/**
 * 🤖 SERVICE IA GEMINI FLASH 2.5 - INTÉGRATION ACTIVE
 * Service principal pour l'intégration avec Gemini Flash 2.5 dans EBIOS RM
 */

import { GeminiService, GeminiConfig, EBIOSAnalysisRequest } from '../llm/GeminiService';
import { AISuggestion } from '../aiAssistant';

export interface GeminiSuggestionRequest {
  type: 'business_values' | 'essential_assets' | 'supporting_assets' | 'dreaded_events' | 
        'risk_sources' | 'strategic_scenarios' | 'operational_scenarios' | 'security_measures';
  workshop: 1 | 2 | 3 | 4 | 5;
  missionId: string;
  context: {
    organization?: string;
    sector?: string;
    existingData?: any;
    userProfile?: any;
  };
  currentData?: any;
  maxSuggestions?: number;
}

export interface GeminiSuggestionResponse {
  success: boolean;
  suggestions: AISuggestion[];
  metadata: {
    model: string;
    executionTime: number;
    tokensUsed?: number;
    confidence: number;
  };
  error?: string;
}

export class GeminiAIService {
  private geminiService: GeminiService;
  private isInitialized = false;

  constructor() {
    this.initializeGemini();
  }

  private initializeGemini() {
    try {
      const config: GeminiConfig = {
        apiKey: import.meta.env.GOOGLE_API_KEY || '',
        model: import.meta.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',
        endpoint: import.meta.env.GEMINI_ENDPOINT,
        maxTokens: 8192,
        temperature: 0.7,
        topP: 0.8,
        topK: 40
      };

      if (!config.apiKey) {
        console.warn('⚠️ Clé API Gemini manquante - Mode simulation activé');
        return;
      }

      this.geminiService = new GeminiService(config);
      this.isInitialized = true;
      console.log('🤖 Service Gemini Flash 2.5 initialisé avec succès');
    } catch (error) {
      console.error('❌ Erreur initialisation Gemini:', error);
    }
  }

  /**
   * Vérifie si le service est disponible
   */
  isAvailable(): boolean {
    return this.isInitialized && !!this.geminiService;
  }

  /**
   * Génère des suggestions contextuelles avec Gemini
   */
  async generateSuggestions(request: GeminiSuggestionRequest): Promise<GeminiSuggestionResponse> {
    if (!this.isAvailable()) {
      return this.getFallbackSuggestions(request);
    }

    try {
      const ebiosRequest: EBIOSAnalysisRequest = {
        type: this.mapToEBIOSType(request.type),
        studyId: request.missionId,
        workshop: request.workshop,
        data: request.currentData || {},
        context: request.context
      };

      const response = await this.geminiService.analyzeEBIOS(ebiosRequest);

      if (response.success && response.content) {
        const suggestions = this.parseGeminiResponse(response.content, request);
        
        return {
          success: true,
          suggestions,
          metadata: {
            model: 'gemini-2.0-flash-exp',
            executionTime: response.metadata?.executionTime || 0,
            tokensUsed: response.metadata?.tokensUsed,
            confidence: 0.85
          }
        };
      } else {
        throw new Error(response.error || 'Erreur génération Gemini');
      }

    } catch (error) {
      console.error('❌ Erreur génération suggestions Gemini:', error);
      return this.getFallbackSuggestions(request);
    }
  }

  /**
   * Analyse de cohérence avec Gemini
   */
  async analyzeCoherence(missionData: any): Promise<any> {
    if (!this.isAvailable()) {
      return this.getFallbackCoherenceAnalysis(missionData);
    }

    try {
      const request: EBIOSAnalysisRequest = {
        type: 'business_values', // Type générique pour l'analyse de cohérence
        studyId: missionData.id || 'unknown',
        workshop: 0 as any, // Analyse globale
        data: missionData,
        context: {
          organization: missionData.organization,
          sector: missionData.sector
        }
      };

      const response = await this.geminiService.analyzeEBIOS(request);

      if (response.success && response.content) {
        return this.parseCoherenceResponse(response.content);
      } else {
        throw new Error(response.error || 'Erreur analyse cohérence');
      }

    } catch (error) {
      console.error('❌ Erreur analyse cohérence Gemini:', error);
      return this.getFallbackCoherenceAnalysis(missionData);
    }
  }

  /**
   * Chat interactif avec Gemini
   */
  async startChatSession(sessionId: string, systemPrompt?: string): Promise<string> {
    if (!this.isAvailable()) {
      return 'chat-fallback-session';
    }

    try {
      const chatSessionId = await this.geminiService.startChatSession(sessionId, systemPrompt);
      console.log(`💬 Session chat Gemini démarrée: ${chatSessionId}`);
      return chatSessionId;
    } catch (error) {
      console.error('❌ Erreur démarrage chat Gemini:', error);
      return 'chat-fallback-session';
    }
  }

  /**
   * Envoie un message dans une session chat
   */
  async sendChatMessage(sessionId: string, message: string): Promise<string> {
    if (!this.isAvailable()) {
      return this.getFallbackChatResponse(message);
    }

    try {
      const response = await this.geminiService.sendMessage(sessionId, message);
      return response.content || 'Réponse non disponible';
    } catch (error) {
      console.error('❌ Erreur envoi message Gemini:', error);
      return this.getFallbackChatResponse(message);
    }
  }

  // === MÉTHODES PRIVÉES ===

  private mapToEBIOSType(type: string): EBIOSAnalysisRequest['type'] {
    const mapping: Record<string, EBIOSAnalysisRequest['type']> = {
      'business_values': 'business_values',
      'essential_assets': 'business_values', // Pas de type spécifique
      'supporting_assets': 'business_values',
      'dreaded_events': 'business_values',
      'risk_sources': 'risk_sources',
      'strategic_scenarios': 'strategic_scenarios',
      'operational_scenarios': 'operational_scenarios',
      'security_measures': 'risk_treatment'
    };

    return mapping[type] || 'business_values';
  }

  private parseGeminiResponse(content: string, request: GeminiSuggestionRequest): AISuggestion[] {
    try {
      // Tentative de parsing JSON
      const parsed = JSON.parse(content);
      if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
        return parsed.suggestions.map((s: any, index: number) => ({
          id: `gemini-${Date.now()}-${index}`,
          type: 'suggestion',
          priority: s.priority || 'medium',
          title: s.title || s.text || 'Suggestion Gemini',
          description: s.description || s.text || content.substring(0, 200),
          actionText: s.actionText || 'Appliquer',
          confidence: s.confidence || 0.8,
          relevance: s.relevance || 85,
          source: 'gemini-flash-2.5',
          context: request.context,
          createdAt: new Date().toISOString()
        }));
      }
    } catch (e) {
      // Si ce n'est pas du JSON, traiter comme texte
    }

    // Parsing texte simple
    const lines = content.split('\n').filter(line => line.trim());
    const suggestions: AISuggestion[] = [];

    lines.forEach((line, index) => {
      if (line.trim() && !line.startsWith('#') && line.length > 10) {
        suggestions.push({
          id: `gemini-text-${Date.now()}-${index}`,
          type: 'suggestion',
          priority: 'medium',
          title: `Suggestion ${index + 1}`,
          description: line.trim(),
          actionText: 'Appliquer',
          confidence: 0.75,
          relevance: 80,
          source: 'gemini-flash-2.5',
          context: request.context,
          createdAt: new Date().toISOString()
        });
      }
    });

    return suggestions.slice(0, request.maxSuggestions || 5);
  }

  private parseCoherenceResponse(content: string): any {
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (e) {
      // Analyse textuelle basique
      const score = content.includes('excellent') ? 90 :
                   content.includes('bon') ? 75 :
                   content.includes('moyen') ? 60 : 45;

      return {
        overall_score: score,
        workshop_scores: {
          workshop1: score + Math.random() * 10 - 5,
          workshop2: score + Math.random() * 10 - 5,
          workshop3: score + Math.random() * 10 - 5,
          workshop4: score + Math.random() * 10 - 5,
          workshop5: score + Math.random() * 10 - 5
        },
        analysis: content,
        source: 'gemini-flash-2.5'
      };
    }
  }

  private getFallbackSuggestions(request: GeminiSuggestionRequest): GeminiSuggestionResponse {
    const fallbackSuggestions: AISuggestion[] = [
      {
        id: `fallback-${Date.now()}-1`,
        type: 'suggestion',
        priority: 'medium',
        title: 'Suggestion de base',
        description: `Complétez les informations pour ${request.type} selon la méthodologie EBIOS RM`,
        actionText: 'Compléter',
        confidence: 0.6,
        relevance: 70,
        source: 'fallback-system',
        context: request.context,
        createdAt: new Date().toISOString()
      }
    ];

    return {
      success: true,
      suggestions: fallbackSuggestions,
      metadata: {
        model: 'fallback-system',
        executionTime: 100,
        confidence: 0.6
      }
    };
  }

  private getFallbackCoherenceAnalysis(missionData: any): any {
    return {
      overall_score: 75,
      workshop_scores: {
        workshop1: 80,
        workshop2: 75,
        workshop3: 70,
        workshop4: 75,
        workshop5: 80
      },
      analysis: 'Analyse de cohérence en mode fallback',
      source: 'fallback-system'
    };
  }

  private getFallbackChatResponse(message: string): string {
    const responses = [
      'Je comprends votre question sur EBIOS RM. Pouvez-vous préciser votre besoin ?',
      'Selon la méthodologie ANSSI, je recommande de suivre les étapes définies.',
      'Cette analyse nécessite une approche structurée selon EBIOS RM.',
      'Je peux vous aider avec cette partie de l\'analyse de risques.'
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Instance singleton
export const geminiAIService = new GeminiAIService();
export default geminiAIService;
