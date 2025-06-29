/**
 * 🤖 CONFIGURATION LLM DYNAMIQUE
 * Configuration des modèles LLM basée sur les paramètres utilisateur
 */

import { SettingsService } from '@/services/settings/SettingsService';

export interface LLMConfig {
  provider: string;
  model: string;
  apiKey: string;
  baseUrl?: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export class LLMConfigManager {
  private static instance: LLMConfigManager;
  private settingsService = SettingsService.getInstance();
  private currentConfig: LLMConfig | null = null;

  private constructor() {}

  public static getInstance(): LLMConfigManager {
    if (!LLMConfigManager.instance) {
      LLMConfigManager.instance = new LLMConfigManager();
    }
    return LLMConfigManager.instance;
  }

  // 📖 RÉCUPÉRATION DE LA CONFIGURATION ACTIVE
  public async getCurrentConfig(): Promise<LLMConfig> {
    if (this.currentConfig) {
      return this.currentConfig;
    }

    try {
      const settings = await this.settingsService.getSettings();
      const config = await this.buildConfigFromSettings(settings);
      this.currentConfig = config;
      return config;
    } catch (error) {
      console.error('Erreur lors de la récupération de la configuration LLM:', error);
      // Configuration par défaut en cas d'erreur
      return this.getDefaultConfig();
    }
  }

  // 🔄 ACTUALISATION DE LA CONFIGURATION
  public async refreshConfig(): Promise<LLMConfig> {
    this.currentConfig = null;
    return await this.getCurrentConfig();
  }

  // 🏗️ CONSTRUCTION DE LA CONFIGURATION
  private async buildConfigFromSettings(settings: any): Promise<LLMConfig> {
    const { ai } = settings;
    
    // Déterminer la clé API à utiliser
    let apiKey = '';
    let baseUrl = '';

    if (ai.provider === 'openrouter') {
      apiKey = ai.apiKeys.openrouter || '';
      baseUrl = 'https://openrouter.ai/api/v1';
    } else {
      // Accès direct selon le modèle
      const modelProvider = this.getModelProvider(ai.selectedModel);
      apiKey = ai.apiKeys[modelProvider] || '';
      baseUrl = this.getProviderBaseUrl(modelProvider);
    }

    return {
      provider: ai.provider,
      model: ai.selectedModel,
      apiKey,
      baseUrl,
      temperature: ai.modelSettings.temperature,
      maxTokens: ai.modelSettings.maxTokens,
      topP: ai.modelSettings.topP,
      frequencyPenalty: ai.modelSettings.frequencyPenalty,
      presencePenalty: ai.modelSettings.presencePenalty
    };
  }

  // 🏭 CONFIGURATION PAR DÉFAUT
  private getDefaultConfig(): LLMConfig {
    return {
      provider: 'openrouter',
      model: 'google/gemini-2.5-flash-preview-05-20',
      apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
      baseUrl: 'https://openrouter.ai/api/v1',
      temperature: 0.7,
      maxTokens: 4000,
      topP: 0.9,
      frequencyPenalty: 0,
      presencePenalty: 0
    };
  }

  // 🔍 DÉTERMINATION DU PROVIDER
  private getModelProvider(modelId: string): string {
    if (modelId.startsWith('google/')) return 'gemini';
    if (modelId.startsWith('anthropic/')) return 'anthropic';
    if (modelId.startsWith('mistralai/')) return 'mistral';
    if (modelId.startsWith('openai/')) return 'openai';
    if (modelId.startsWith('qwen/')) return 'qwen';
    if (modelId.startsWith('deepseek/')) return 'deepseek';
    return 'openrouter';
  }

  // 🌐 URL DE BASE PAR PROVIDER
  private getProviderBaseUrl(provider: string): string {
    const urls = {
      gemini: 'https://generativelanguage.googleapis.com/v1beta',
      anthropic: 'https://api.anthropic.com/v1',
      mistral: 'https://api.mistral.ai/v1',
      openai: 'https://api.openai.com/v1',
      qwen: 'https://dashscope.aliyuncs.com/api/v1',
      deepseek: 'https://api.deepseek.com/v1'
    };
    return urls[provider as keyof typeof urls] || 'https://openrouter.ai/api/v1';
  }

  // 🧪 TEST DE CONFIGURATION
  public async testConfig(config: LLMConfig): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
          ...(config.provider === 'openrouter' && {
            'HTTP-Referer': window.location.origin,
            'X-Title': 'EBIOS AI Manager'
          })
        },
        body: JSON.stringify({
          model: config.model,
          messages: [{ role: 'user', content: 'Test de connexion' }],
          max_tokens: 10,
          temperature: 0.1
        })
      });

      if (response.ok) {
        return { success: true, message: 'Configuration LLM valide' };
      } else {
        const error = await response.text();
        return { success: false, message: `Erreur API: ${error}` };
      }
    } catch (error) {
      return { success: false, message: `Erreur de connexion: ${error.message}` };
    }
  }

  // 📊 STATISTIQUES D'UTILISATION
  public async getUsageStats(): Promise<any> {
    // Ici vous pourriez implémenter la récupération des statistiques d'usage
    // depuis votre base de données ou les APIs des providers
    return {
      totalRequests: 0,
      totalTokens: 0,
      averageResponseTime: 0,
      errorRate: 0
    };
  }
}

// 🚀 FONCTION D'APPEL LLM AVEC CONFIGURATION DYNAMIQUE
export async function callLLM(
  messages: Array<{ role: string; content: string }>,
  options?: Partial<LLMConfig>
): Promise<any> {
  const configManager = LLMConfigManager.getInstance();
  const config = await configManager.getCurrentConfig();
  
  // Fusionner avec les options spécifiques
  const finalConfig = { ...config, ...options };

  try {
    const response = await fetch(`${finalConfig.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${finalConfig.apiKey}`,
        'Content-Type': 'application/json',
        ...(finalConfig.provider === 'openrouter' && {
          'HTTP-Referer': window.location.origin,
          'X-Title': 'EBIOS AI Manager'
        })
      },
      body: JSON.stringify({
        model: finalConfig.model,
        messages,
        temperature: finalConfig.temperature,
        max_tokens: finalConfig.maxTokens,
        top_p: finalConfig.topP,
        frequency_penalty: finalConfig.frequencyPenalty,
        presence_penalty: finalConfig.presencePenalty
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'appel LLM:', error);
    throw error;
  }
}

// 🔄 FONCTION DE FALLBACK
export async function callLLMWithFallback(
  messages: Array<{ role: string; content: string }>,
  options?: Partial<LLMConfig>
): Promise<any> {
  const configManager = LLMConfigManager.getInstance();
  const settings = await configManager.settingsService.getSettings();
  
  try {
    // Tentative avec le modèle principal
    return await callLLM(messages, options);
  } catch (error) {
    console.warn('Échec du modèle principal, tentative avec le modèle de secours:', error);
    
    // Tentative avec le modèle de secours
    if (settings.ai.fallbackModel && settings.ai.fallbackModel !== settings.ai.selectedModel) {
      try {
        return await callLLM(messages, { ...options, model: settings.ai.fallbackModel });
      } catch (fallbackError) {
        console.error('Échec du modèle de secours:', fallbackError);
        throw fallbackError;
      }
    }
    
    throw error;
  }
}

// 📈 MONITORING DES APPELS LLM
export class LLMMonitor {
  private static metrics = {
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    totalTokens: 0,
    averageResponseTime: 0,
    lastError: null as string | null
  };

  public static recordCall(success: boolean, tokens: number, responseTime: number, error?: string) {
    this.metrics.totalCalls++;
    
    if (success) {
      this.metrics.successfulCalls++;
      this.metrics.totalTokens += tokens;
    } else {
      this.metrics.failedCalls++;
      this.metrics.lastError = error || 'Erreur inconnue';
    }

    // Calcul de la moyenne mobile du temps de réponse
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.totalCalls - 1) + responseTime) / this.metrics.totalCalls;
  }

  public static getMetrics() {
    return {
      ...this.metrics,
      successRate: this.metrics.totalCalls > 0 ? this.metrics.successfulCalls / this.metrics.totalCalls : 0,
      errorRate: this.metrics.totalCalls > 0 ? this.metrics.failedCalls / this.metrics.totalCalls : 0
    };
  }

  public static resetMetrics() {
    this.metrics = {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      totalTokens: 0,
      averageResponseTime: 0,
      lastError: null
    };
  }
}
