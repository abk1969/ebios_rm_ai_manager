/**
 * 🤖 SERVICE GEMINI PRO 2.5 - INTÉGRATION LLM PRINCIPAL
 * Service d'intégration avec Google Gemini Pro 2.5 pour l'IA EBIOS RM
 * Recommandation audit CRITIQUE : Intégration LLM principal
 */

import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';

export interface GeminiConfig {
  apiKey: string;
  model: string;
  endpoint?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  topK?: number;
  safetySettings?: any[];
}

export interface GeminiPrompt {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface GeminiResponse {
  success: boolean;
  content?: string;
  error?: string;
  metadata?: {
    model: string;
    tokensUsed?: number;
    executionTime: number;
    safetyRatings?: any[];
  };
}

export interface EBIOSAnalysisRequest {
  type: 'business_values' | 'risk_sources' | 'strategic_scenarios' | 'operational_scenarios' | 'risk_treatment';
  studyId: string;
  workshop: number;
  data: any;
  context?: {
    organization?: string;
    sector?: string;
    previousResults?: any;
  };
}

/**
 * Service Gemini Pro 2.5
 */
export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;
  private config: GeminiConfig;
  private activeSessions: Map<string, ChatSession> = new Map();

  constructor(config: GeminiConfig) {
    this.config = config;
    
    if (!config.apiKey) {
      throw new Error('🔑 Clé API Gemini requise - Configurez GOOGLE_API_KEY dans .env');
    }

    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: config.model,
      generationConfig: {
        maxOutputTokens: config.maxTokens || 8192,
        temperature: config.temperature || 0.7,
        topP: config.topP || 0.8,
        topK: config.topK || 40,
      },
      safetySettings: config.safetySettings || [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    });

    console.log(`🤖 Service Gemini initialisé: ${config.model}`);
  }

  /**
   * Analyse EBIOS RM avec Gemini
   */
  async analyzeEBIOS(request: EBIOSAnalysisRequest): Promise<GeminiResponse> {
    const startTime = Date.now();

    try {
      const prompt = this.buildEBIOSPrompt(request);
      
      console.log(`🔍 Analyse EBIOS ${request.type} - Atelier ${request.workshop}`);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      return {
        success: true,
        content,
        metadata: {
          model: this.config.model,
          executionTime: Date.now() - startTime,
          safetyRatings: response.candidates?.[0]?.safetyRatings
        }
      };

    } catch (error) {
      console.error('❌ Erreur analyse Gemini:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur Gemini',
        metadata: {
          model: this.config.model,
          executionTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * Chat interactif avec Gemini
   */
  async startChatSession(
    sessionId: string,
    systemPrompt?: string
  ): Promise<string> {
    
    const history: GeminiPrompt[] = [];
    
    if (systemPrompt) {
      history.push({
        role: 'user',
        parts: [{ text: systemPrompt }]
      });
      history.push({
        role: 'model',
        parts: [{ text: 'Compris. Je suis prêt à vous assister pour l\'analyse EBIOS RM selon la méthodologie ANSSI.' }]
      });
    }

    const chat = this.model.startChat({ history });
    this.activeSessions.set(sessionId, chat);
    
    console.log(`💬 Session chat Gemini créée: ${sessionId}`);
    return sessionId;
  }

  /**
   * Envoi de message dans une session chat
   */
  async sendMessage(
    sessionId: string,
    message: string
  ): Promise<GeminiResponse> {
    
    const startTime = Date.now();
    const chat = this.activeSessions.get(sessionId);
    
    if (!chat) {
      return {
        success: false,
        error: 'Session chat non trouvée',
        metadata: {
          model: this.config.model,
          executionTime: Date.now() - startTime
        }
      };
    }

    try {
      const result = await chat.sendMessage(message);
      const response = await result.response;
      const content = response.text();

      return {
        success: true,
        content,
        metadata: {
          model: this.config.model,
          executionTime: Date.now() - startTime,
          safetyRatings: response.candidates?.[0]?.safetyRatings
        }
      };

    } catch (error) {
      console.error('❌ Erreur message Gemini:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur envoi message',
        metadata: {
          model: this.config.model,
          executionTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * Génération de contenu avec prompt personnalisé
   */
  async generateContent(
    prompt: string,
    options: {
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<GeminiResponse> {
    
    const startTime = Date.now();

    try {
      // Configuration temporaire si options fournies
      let modelToUse = this.model;
      
      if (options.temperature !== undefined || options.maxTokens !== undefined) {
        modelToUse = this.genAI.getGenerativeModel({
          model: this.config.model,
          generationConfig: {
            maxOutputTokens: options.maxTokens || this.config.maxTokens || 8192,
            temperature: options.temperature !== undefined ? options.temperature : this.config.temperature || 0.7,
          },
        });
      }

      const result = await modelToUse.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      return {
        success: true,
        content,
        metadata: {
          model: this.config.model,
          executionTime: Date.now() - startTime,
          safetyRatings: response.candidates?.[0]?.safetyRatings
        }
      };

    } catch (error) {
      console.error('❌ Erreur génération Gemini:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur génération',
        metadata: {
          model: this.config.model,
          executionTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * Validation conformité ANSSI avec Gemini
   */
  async validateANSSICompliance(
    workshop: number,
    data: any,
    studyContext: any
  ): Promise<GeminiResponse> {
    
    const prompt = `
# Validation Conformité ANSSI EBIOS RM - Atelier ${workshop}

## Contexte de l'étude
${JSON.stringify(studyContext, null, 2)}

## Données à valider
${JSON.stringify(data, null, 2)}

## Instructions de validation
Vous êtes un expert EBIOS RM certifié ANSSI. Analysez les données fournies selon les critères suivants :

### Atelier ${workshop} - Critères ANSSI :
${this.getANSSICriteria(workshop)}

## Format de réponse attendu
Répondez au format JSON suivant :
{
  "isCompliant": boolean,
  "score": number (0-100),
  "criticalIssues": string[],
  "warnings": string[],
  "recommendations": string[],
  "anssiCriteria": {
    "completeness": number (0-1),
    "methodology": number (0-1),
    "traceability": number (0-1)
  },
  "detailedAnalysis": string
}
`;

    return await this.generateContent(prompt, { temperature: 0.3 });
  }

  /**
   * Enrichissement avec suggestions IA
   */
  async enrichWithSuggestions(
    entityType: string,
    entityData: any,
    context: any
  ): Promise<GeminiResponse> {
    
    const prompt = `
# Enrichissement IA - ${entityType}

## Données actuelles
${JSON.stringify(entityData, null, 2)}

## Contexte
${JSON.stringify(context, null, 2)}

## Instructions
En tant qu'expert EBIOS RM, enrichissez ces données avec :
1. Suggestions d'amélioration
2. Éléments manquants potentiels
3. Bonnes pratiques ANSSI
4. Exemples concrets
5. Points d'attention sécurité

Répondez au format JSON :
{
  "suggestions": string[],
  "improvements": string[],
  "missingElements": string[],
  "bestPractices": string[],
  "securityNotes": string[],
  "confidence": number (0-1)
}
`;

    return await this.generateContent(prompt, { temperature: 0.6 });
  }

  /**
   * Fermeture d'une session chat
   */
  closeChatSession(sessionId: string): boolean {
    const deleted = this.activeSessions.delete(sessionId);
    if (deleted) {
      console.log(`💬 Session chat fermée: ${sessionId}`);
    }
    return deleted;
  }

  /**
   * Obtient les sessions actives
   */
  getActiveSessions(): string[] {
    return Array.from(this.activeSessions.keys());
  }

  /**
   * Test de connectivité
   */
  async testConnection(): Promise<GeminiResponse> {
    return await this.generateContent(
      'Répondez simplement "Service Gemini opérationnel" pour confirmer la connectivité.',
      { temperature: 0, maxTokens: 50 }
    );
  }

  // Méthodes privées
  private buildEBIOSPrompt(request: EBIOSAnalysisRequest): string {
    let basePrompt = `
# Analyse EBIOS RM - ${request.type.toUpperCase()}
## Atelier ${request.workshop}

Vous êtes un expert en cybersécurité spécialisé dans la méthodologie EBIOS RM de l'ANSSI.

### Contexte de l'étude
- ID: ${request.studyId}
- Atelier: ${request.workshop}
- Type d'analyse: ${request.type}
`;

    if (request.context?.organization) {
      basePrompt += `- Organisation: ${request.context.organization}\n`;
    }

    if (request.context?.sector) {
      basePrompt += `- Secteur: ${request.context.sector}\n`;
    }

    const dataPrompt = `
### Données à analyser
${JSON.stringify(request.data, null, 2)}
`;

    const instructionsPrompt = this.getInstructionsForType(request.type, request.workshop);

    return basePrompt + dataPrompt + instructionsPrompt;
  }

  private getInstructionsForType(type: string, workshop: number): string {
    const instructions: Record<string, string> = {
      'business_values': `
### Instructions Atelier 1 - Socle de sécurité
Analysez les valeurs métier selon EBIOS RM :
1. Identifiez les biens essentiels
2. Évaluez leur criticité (1-4)
3. Définissez les critères de sécurité (DICP)
4. Proposez des améliorations
5. Assurez la conformité ANSSI
`,
      'risk_sources': `
### Instructions Atelier 2 - Sources de risque
Identifiez les sources de risque selon EBIOS RM :
1. Cartographiez les sources de risque
2. Analysez les profils d'attaquants
3. Évaluez les capacités et motivations
4. Mappez avec MITRE ATT&CK
5. Priorisez selon le contexte
`,
      'strategic_scenarios': `
### Instructions Atelier 3 - Scénarios stratégiques
Générez des scénarios stratégiques EBIOS RM :
1. Croisez sources de risque et valeurs métier
2. Construisez des chemins d'attaque
3. Évaluez vraisemblance et impact
4. Priorisez les scénarios
5. Validez la cohérence méthodologique
`,
      'operational_scenarios': `
### Instructions Atelier 4 - Scénarios opérationnels
Détaillez les scénarios opérationnels :
1. Décomposez en étapes techniques
2. Identifiez les vulnérabilités
3. Mappez les techniques MITRE ATT&CK
4. Évaluez la faisabilité
5. Proposez des indicateurs de détection
`,
      'risk_treatment': `
### Instructions Atelier 5 - Traitement du risque
Proposez le traitement des risques :
1. Définissez les mesures de sécurité
2. Calculez le ROI sécurité
3. Priorisez les investissements
4. Planifiez la mise en œuvre
5. Définissez les indicateurs de suivi
`
    };

    return instructions[type] || '### Instructions génériques\nAnalysez selon la méthodologie EBIOS RM.';
  }

  private getANSSICriteria(workshop: number): string {
    const criteria: Record<number, string> = {
      1: `
- Identification complète des biens essentiels
- Évaluation de criticité justifiée (1-4)
- Critères DICP définis et mesurables
- Cohérence avec le contexte organisationnel
`,
      2: `
- Cartographie exhaustive des sources de risque
- Profilage détaillé des attaquants
- Analyse des capacités et motivations
- Mapping MITRE ATT&CK approprié
`,
      3: `
- Scénarios stratégiques réalistes et pertinents
- Croisement méthodique sources/valeurs
- Évaluation vraisemblance/impact justifiée
- Priorisation cohérente
`,
      4: `
- Décomposition technique détaillée
- Identification vulnérabilités précise
- Techniques d'attaque documentées
- Indicateurs de détection définis
`,
      5: `
- Mesures de sécurité proportionnées
- Analyse coût/bénéfice documentée
- Plan de mise en œuvre réaliste
- Indicateurs de suivi définis
`
    };

    return criteria[workshop] || 'Critères génériques EBIOS RM';
  }

  /**
   * Mise à jour de la configuration
   */
  updateConfig(newConfig: Partial<GeminiConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Recréation du modèle si nécessaire
    if (newConfig.apiKey || newConfig.model) {
      this.genAI = new GoogleGenerativeAI(this.config.apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: this.config.model,
        generationConfig: {
          maxOutputTokens: this.config.maxTokens || 8192,
          temperature: this.config.temperature || 0.7,
        },
      });
    }
    
    console.log(`🔧 Configuration Gemini mise à jour`);
  }

  /**
   * Statistiques du service
   */
  getStats(): {
    model: string;
    activeSessions: number;
    config: GeminiConfig;
  } {
    return {
      model: this.config.model,
      activeSessions: this.activeSessions.size,
      config: { ...this.config, apiKey: '***' } // Masquer la clé API
    };
  }
}
