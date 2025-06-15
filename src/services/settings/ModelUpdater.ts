/**
 * 🔄 SERVICE DE MISE À JOUR DES MODÈLES
 * Vérifie et met à jour automatiquement la liste des modèles LLM disponibles
 */

import { SettingsService, type LLMModel } from './SettingsService';
import { SecureLogger } from '@/services/logging/SecureLogger';

export interface ModelProvider {
  name: string;
  baseUrl: string;
  modelsEndpoint: string;
  authHeader: string;
}

export class ModelUpdater {
  private static instance: ModelUpdater;
  private logger = SecureLogger.getInstance();
  private settingsService = SettingsService.getInstance();

  private providers: Record<string, ModelProvider> = {
    openrouter: {
      name: 'OpenRouter',
      baseUrl: 'https://openrouter.ai/api/v1',
      modelsEndpoint: '/models',
      authHeader: 'Authorization'
    },
    anthropic: {
      name: 'Anthropic',
      baseUrl: 'https://api.anthropic.com/v1',
      modelsEndpoint: '/models',
      authHeader: 'x-api-key'
    },
    google: {
      name: 'Google',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      modelsEndpoint: '/models',
      authHeader: 'Authorization'
    }
  };

  private constructor() {}

  public static getInstance(): ModelUpdater {
    if (!ModelUpdater.instance) {
      ModelUpdater.instance = new ModelUpdater();
    }
    return ModelUpdater.instance;
  }

  // 🔍 RÉCUPÉRATION DES MODÈLES DISPONIBLES
  public async fetchAvailableModels(provider: string, apiKey: string): Promise<LLMModel[]> {
    try {
      const providerConfig = this.providers[provider];
      if (!providerConfig) {
        throw new Error(`Provider ${provider} non supporté`);
      }

      const response = await fetch(`${providerConfig.baseUrl}${providerConfig.modelsEndpoint}`, {
        headers: {
          [providerConfig.authHeader]: provider === 'anthropic' ? apiKey : `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur API ${provider}: ${response.status}`);
      }

      const data = await response.json();
      return this.parseModelsResponse(provider, data);

    } catch (error) {
      this.logger.error('Erreur lors de la récupération des modèles', {
        provider,
        error: error.message
      });
      return [];
    }
  }

  // 📊 ANALYSE DE LA RÉPONSE API
  private parseModelsResponse(provider: string, data: any): LLMModel[] {
    const models: LLMModel[] = [];

    try {
      switch (provider) {
        case 'openrouter':
          if (data.data && Array.isArray(data.data)) {
            for (const model of data.data) {
              // Filtrer les modèles pertinents pour EBIOS RM
              if (this.isRelevantModel(model.id)) {
                models.push({
                  id: model.id,
                  name: model.name || model.id,
                  provider: this.getProviderFromId(model.id),
                  description: model.description || 'Modèle LLM avancé',
                  maxTokens: model.context_length || 4000,
                  costPer1kTokens: this.calculateCost(model.pricing),
                  capabilities: this.inferCapabilities(model),
                  isActive: false
                });
              }
            }
          }
          break;

        case 'anthropic':
          // Anthropic ne fournit pas d'endpoint public pour lister les modèles
          // On utilise la liste connue mise à jour
          models.push(...this.getKnownAnthropicModels());
          break;

        case 'google':
          if (data.models && Array.isArray(data.models)) {
            for (const model of data.models) {
              if (model.name.includes('gemini')) {
                models.push({
                  id: model.name,
                  name: this.formatModelName(model.displayName || model.name),
                  provider: 'Google',
                  description: model.description || 'Modèle Gemini',
                  maxTokens: model.inputTokenLimit || 1000000,
                  costPer1kTokens: 0.075, // Prix par défaut Gemini
                  capabilities: ['text', 'analysis', 'reasoning'],
                  isActive: false
                });
              }
            }
          }
          break;
      }
    } catch (error) {
      this.logger.error('Erreur lors de l\'analyse des modèles', {
        provider,
        error: error.message
      });
    }

    return models;
  }

  // 🎯 MODÈLES ANTHROPIC CONNUS (MIS À JOUR)
  private getKnownAnthropicModels(): LLMModel[] {
    return [
      {
        id: 'anthropic/claude-4-sonnet',
        name: 'Claude Sonnet 4',
        provider: 'Anthropic',
        description: 'Dernière génération Claude pour l\'analyse structurée et la conformité',
        maxTokens: 200000,
        costPer1kTokens: 3.0,
        capabilities: ['text', 'analysis', 'structured', 'compliance', 'reasoning'],
        isActive: false
      },
      {
        id: 'anthropic/claude-4-opus',
        name: 'Claude Opus 4',
        provider: 'Anthropic',
        description: 'Modèle Claude le plus avancé pour les analyses expertes complexes',
        maxTokens: 200000,
        costPer1kTokens: 15.0,
        capabilities: ['text', 'analysis', 'complex-reasoning', 'expert', 'advanced-logic'],
        isActive: false
      },
      {
        id: 'anthropic/claude-3.5-sonnet',
        name: 'Claude Sonnet 3.5',
        provider: 'Anthropic',
        description: 'Version précédente stable de Claude Sonnet',
        maxTokens: 200000,
        costPer1kTokens: 3.0,
        capabilities: ['text', 'analysis', 'structured', 'compliance'],
        isActive: false
      }
    ];
  }

  // 🔍 VÉRIFICATION DE PERTINENCE DU MODÈLE
  private isRelevantModel(modelId: string): boolean {
    const relevantPatterns = [
      'gemini',
      'claude',
      'mistral',
      'qwen',
      'deepseek',
      'gpt-4',
      'llama'
    ];

    return relevantPatterns.some(pattern => 
      modelId.toLowerCase().includes(pattern)
    );
  }

  // 🏭 EXTRACTION DU PROVIDER
  private getProviderFromId(modelId: string): string {
    if (modelId.includes('anthropic/')) return 'Anthropic';
    if (modelId.includes('google/')) return 'Google';
    if (modelId.includes('mistralai/')) return 'Mistral AI';
    if (modelId.includes('openai/')) return 'OpenAI';
    if (modelId.includes('qwen/')) return 'Alibaba';
    if (modelId.includes('deepseek/')) return 'DeepSeek';
    if (modelId.includes('meta-llama/')) return 'Meta';
    return 'Unknown';
  }

  // 💰 CALCUL DU COÛT
  private calculateCost(pricing: any): number {
    if (!pricing) return 0;
    
    // OpenRouter pricing structure
    if (pricing.prompt && pricing.completion) {
      return (parseFloat(pricing.prompt) + parseFloat(pricing.completion)) / 2;
    }
    
    return 0;
  }

  // 🎯 INFÉRENCE DES CAPACITÉS
  private inferCapabilities(model: any): string[] {
    const capabilities = ['text'];
    
    const description = (model.description || '').toLowerCase();
    const name = (model.name || '').toLowerCase();
    
    if (description.includes('analysis') || name.includes('analyst')) {
      capabilities.push('analysis');
    }
    
    if (description.includes('reasoning') || name.includes('reasoning')) {
      capabilities.push('reasoning');
    }
    
    if (description.includes('code') || name.includes('code')) {
      capabilities.push('coding');
    }
    
    if (description.includes('multilingual') || name.includes('multilingual')) {
      capabilities.push('multilingual');
    }
    
    return capabilities;
  }

  // 📝 FORMATAGE DU NOM
  private formatModelName(name: string): string {
    return name
      .replace(/models\//, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  // 🔄 MISE À JOUR AUTOMATIQUE
  public async updateAvailableModels(): Promise<{ updated: boolean; newModels: number; errors: string[] }> {
    const errors: string[] = [];
    let newModels = 0;
    let updated = false;

    try {
      const settings = await this.settingsService.getSettings();
      const currentModels = this.settingsService.getAvailableLLMModels();
      const allModels = [...currentModels];

      // Vérifier OpenRouter si la clé est disponible
      if (settings.ai.apiKeys.openrouter) {
        try {
          const openRouterModels = await this.fetchAvailableModels('openrouter', settings.ai.apiKeys.openrouter);
          
          for (const model of openRouterModels) {
            const exists = allModels.find(m => m.id === model.id);
            if (!exists) {
              allModels.push(model);
              newModels++;
              updated = true;
            }
          }
        } catch (error) {
          errors.push(`OpenRouter: ${error.message}`);
        }
      }

      // Mettre à jour les modèles Anthropic connus
      const anthropicModels = this.getKnownAnthropicModels();
      for (const model of anthropicModels) {
        const existingIndex = allModels.findIndex(m => m.id === model.id);
        if (existingIndex >= 0) {
          // Mettre à jour le modèle existant
          allModels[existingIndex] = { ...allModels[existingIndex], ...model };
          updated = true;
        } else {
          // Ajouter le nouveau modèle
          allModels.push(model);
          newModels++;
          updated = true;
        }
      }

      if (updated) {
        this.logger.info('Modèles LLM mis à jour', {
          totalModels: allModels.length,
          newModels,
          errors: errors.length
        });
      }

      return { updated, newModels, errors };

    } catch (error) {
      errors.push(`Erreur générale: ${error.message}`);
      this.logger.error('Erreur lors de la mise à jour des modèles', {
        error: error.message
      });
      
      return { updated: false, newModels: 0, errors };
    }
  }

  // 📅 PLANIFICATION DES MISES À JOUR
  public startPeriodicUpdate(intervalHours: number = 24): void {
    setInterval(async () => {
      try {
        const result = await this.updateAvailableModels();
        if (result.updated) {
          this.logger.info('Mise à jour automatique des modèles effectuée', result);
        }
      } catch (error) {
        this.logger.error('Erreur lors de la mise à jour automatique des modèles', {
          error: error.message
        });
      }
    }, intervalHours * 60 * 60 * 1000);
  }

  // 🧪 TEST DE DISPONIBILITÉ D'UN MODÈLE
  public async testModelAvailability(modelId: string, apiKey: string): Promise<{ available: boolean; message: string }> {
    try {
      const provider = this.getProviderFromId(modelId).toLowerCase();
      const providerConfig = this.providers[provider];
      
      if (!providerConfig) {
        return { available: false, message: 'Provider non supporté' };
      }

      // Test simple avec une requête minimale
      const response = await fetch(`${providerConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          [providerConfig.authHeader]: provider === 'anthropic' ? apiKey : `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: modelId,
          messages: [{ role: 'user', content: 'Test' }],
          max_tokens: 1
        })
      });

      if (response.ok || response.status === 400) {
        // 400 peut indiquer que le modèle existe mais la requête est invalide
        return { available: true, message: 'Modèle disponible' };
      } else if (response.status === 404) {
        return { available: false, message: 'Modèle non trouvé' };
      } else {
        return { available: false, message: `Erreur ${response.status}` };
      }

    } catch (error) {
      return { available: false, message: `Erreur de test: ${error.message}` };
    }
  }
}
