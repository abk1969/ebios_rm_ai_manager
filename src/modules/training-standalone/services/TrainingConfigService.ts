/**
 * 🔧 SERVICE DE CONFIGURATION - MODULE FORMATION DÉCOUPLÉ
 * Gestion centralisée de la configuration du module de formation
 * Isolation complète des paramètres et de la logique métier
 */

// 🎯 TYPES ET INTERFACES
export interface TrainingEnvironment {
  name: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  embedBaseUrl: string;
  websocketUrl: string;
  apiKey: string;
  features: {
    realTimeEvents: boolean;
    analytics: boolean;
    aiAssistant: boolean;
    certification: boolean;
  };
  security: {
    allowedOrigins: string[];
    enableCORS: boolean;
    requireHTTPS: boolean;
    tokenExpiration: number;
  };
}

export interface SectorConfiguration {
  id: string;
  name: string;
  regulations: string[];
  threatLandscape: string[];
  customScenarios: boolean;
  expertValidation: boolean;
  certificationLevel: 'basic' | 'advanced' | 'expert';
}

export interface AIConfiguration {
  provider: 'gemini' | 'claude' | 'openai';
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompts: {
    instructor: string;
    evaluator: string;
    assistant: string;
  };
  features: {
    realTimeResponse: boolean;
    contextAwareness: boolean;
    adaptiveLearning: boolean;
  };
}

// 🔧 SERVICE PRINCIPAL
export class TrainingConfigService {
  private static instance: TrainingConfigService;
  private config: TrainingEnvironment | null = null;
  private sectorConfigs: Map<string, SectorConfiguration> = new Map();
  private aiConfig: AIConfiguration | null = null;

  private constructor() {
    this.initializeDefaultConfigurations();
  }

  public static getInstance(): TrainingConfigService {
    if (!TrainingConfigService.instance) {
      TrainingConfigService.instance = new TrainingConfigService();
    }
    return TrainingConfigService.instance;
  }

  // 🌍 GESTION DES ENVIRONNEMENTS
  async loadEnvironmentConfig(environment: string): Promise<TrainingEnvironment> {
    const configs: Record<string, TrainingEnvironment> = {
      development: {
        name: 'development',
        apiBaseUrl: 'http://localhost:3001/api/v1',
        embedBaseUrl: 'http://localhost:3001/embed',
        websocketUrl: 'ws://localhost:3001/ws',
        apiKey: 'dev_training_key_123',
        features: {
          realTimeEvents: true,
          analytics: true,
          aiAssistant: true,
          certification: false
        },
        security: {
          allowedOrigins: ['http://localhost:5175', 'http://localhost:3000'],
          enableCORS: true,
          requireHTTPS: false,
          tokenExpiration: 3600
        }
      },
      staging: {
        name: 'staging',
        apiBaseUrl: 'https://training-staging.ebios-app.com/api/v1',
        embedBaseUrl: 'https://training-staging.ebios-app.com/embed',
        websocketUrl: 'wss://training-staging.ebios-app.com/ws',
        apiKey: process.env.TRAINING_STAGING_API_KEY || '',
        features: {
          realTimeEvents: true,
          analytics: true,
          aiAssistant: true,
          certification: true
        },
        security: {
          allowedOrigins: ['https://staging.ebios-app.com'],
          enableCORS: true,
          requireHTTPS: true,
          tokenExpiration: 1800
        }
      },
      production: {
        name: 'production',
        apiBaseUrl: 'https://training.ebios-app.com/api/v1',
        embedBaseUrl: 'https://training.ebios-app.com/embed',
        websocketUrl: 'wss://training.ebios-app.com/ws',
        apiKey: process.env.TRAINING_PROD_API_KEY || '',
        features: {
          realTimeEvents: true,
          analytics: true,
          aiAssistant: true,
          certification: true
        },
        security: {
          allowedOrigins: ['https://app.ebios-manager.com'],
          enableCORS: false,
          requireHTTPS: true,
          tokenExpiration: 900
        }
      }
    };

    this.config = configs[environment] || configs.development;
    return this.config;
  }

  // 🏭 CONFIGURATION SECTORIELLE
  private initializeDefaultConfigurations(): void {
    // Configuration Finance
    this.sectorConfigs.set('finance', {
      id: 'finance',
      name: 'Secteur Bancaire et Financier',
      regulations: ['DORA', 'PCI-DSS', 'MiFID II', 'GDPR', 'LCB-FT'],
      threatLandscape: [
        'APT financiers',
        'Ransomware bancaire',
        'Fraude en ligne',
        'Attaques SWIFT',
        'Ingénierie sociale'
      ],
      customScenarios: true,
      expertValidation: true,
      certificationLevel: 'expert'
    });

    // Configuration Santé
    this.sectorConfigs.set('healthcare', {
      id: 'healthcare',
      name: 'Secteur Santé',
      regulations: ['GDPR', 'HDS', 'MDR', 'ISO 27799'],
      threatLandscape: [
        'Ransomware santé',
        'Vol données patients',
        'Sabotage équipements médicaux',
        'Espionnage médical'
      ],
      customScenarios: true,
      expertValidation: true,
      certificationLevel: 'advanced'
    });

    // Configuration Énergie
    this.sectorConfigs.set('energy', {
      id: 'energy',
      name: 'Secteur Énergie et Utilities',
      regulations: ['NIS2', 'LPM', 'SIV', 'ISO 27019'],
      threatLandscape: [
        'APT étatiques',
        'Sabotage industriel',
        'Cyberterrorisme',
        'Attaques SCADA'
      ],
      customScenarios: true,
      expertValidation: true,
      certificationLevel: 'expert'
    });

    // Configuration Défense
    this.sectorConfigs.set('defense', {
      id: 'defense',
      name: 'Secteur Défense',
      regulations: ['IGI 1300', 'RGS', 'Classification Défense'],
      threatLandscape: [
        'Espionnage industriel',
        'APT étatiques',
        'Sabotage capacités',
        'Désinformation'
      ],
      customScenarios: true,
      expertValidation: true,
      certificationLevel: 'expert'
    });
  }

  // 🤖 CONFIGURATION IA
  async loadAIConfiguration(): Promise<AIConfiguration> {
    this.aiConfig = {
      provider: 'gemini',
      model: 'gemini-2.5-flash-preview-05-20',
      temperature: 0.7,
      maxTokens: 4096,
      systemPrompts: {
        instructor: `Vous êtes un expert formateur EBIOS RM certifié ANSSI. 
                    Votre rôle est de guider les apprenants à travers la méthodologie officielle 
                    avec pédagogie, rigueur et adaptation au secteur d'activité.`,
        evaluator: `Vous êtes un évaluateur expert en EBIOS RM. 
                   Analysez les réponses selon les critères ANSSI officiels : 
                   méthodologie, complétude, justesse, applicabilité.`,
        assistant: `Vous êtes un assistant spécialisé en cybersécurité et EBIOS RM. 
                   Fournissez des réponses précises, sourcées et adaptées au contexte.`
      },
      features: {
        realTimeResponse: true,
        contextAwareness: true,
        adaptiveLearning: true
      }
    };

    return this.aiConfig;
  }

  // 📊 MÉTHODES D'ACCÈS
  getCurrentConfig(): TrainingEnvironment | null {
    return this.config;
  }

  getSectorConfig(sectorId: string): SectorConfiguration | null {
    return this.sectorConfigs.get(sectorId) || null;
  }

  getAllSectorConfigs(): SectorConfiguration[] {
    return Array.from(this.sectorConfigs.values());
  }

  getAIConfig(): AIConfiguration | null {
    return this.aiConfig;
  }

  // 🔧 MÉTHODES DE CONFIGURATION
  updateSectorConfig(sectorId: string, config: Partial<SectorConfiguration>): void {
    const existing = this.sectorConfigs.get(sectorId);
    if (existing) {
      this.sectorConfigs.set(sectorId, { ...existing, ...config });
    }
  }

  addCustomSector(config: SectorConfiguration): void {
    this.sectorConfigs.set(config.id, config);
  }

  updateAIConfig(config: Partial<AIConfiguration>): void {
    if (this.aiConfig) {
      this.aiConfig = { ...this.aiConfig, ...config };
    }
  }

  // 🔒 VALIDATION DE SÉCURITÉ
  validateOrigin(origin: string): boolean {
    if (!this.config) return false;
    return this.config.security.allowedOrigins.includes(origin);
  }

  isHTTPSRequired(): boolean {
    return this.config?.security.requireHTTPS || false;
  }

  getTokenExpiration(): number {
    return this.config?.security.tokenExpiration || 3600;
  }

  // 🎯 MÉTHODES UTILITAIRES
  isFeatureEnabled(feature: keyof TrainingEnvironment['features']): boolean {
    return this.config?.features[feature] || false;
  }

  getEmbedUrl(sessionId: string): string {
    if (!this.config) {
      throw new Error('Configuration non chargée');
    }
    return `${this.config.embedBaseUrl}/${sessionId}`;
  }

  getApiUrl(endpoint: string): string {
    if (!this.config) {
      throw new Error('Configuration non chargée');
    }
    return `${this.config.apiBaseUrl}${endpoint}`;
  }

  // 📋 EXPORT DE CONFIGURATION
  exportConfiguration(): {
    environment: TrainingEnvironment | null;
    sectors: SectorConfiguration[];
    ai: AIConfiguration | null;
  } {
    return {
      environment: this.config,
      sectors: this.getAllSectorConfigs(),
      ai: this.aiConfig
    };
  }

  // 🔄 RECHARGEMENT DE CONFIGURATION
  async reloadConfiguration(environment: string): Promise<void> {
    await this.loadEnvironmentConfig(environment);
    await this.loadAIConfiguration();
    console.log(`✅ Configuration rechargée pour l'environnement: ${environment}`);
  }

  // 🧪 MÉTHODES DE TEST
  async testConfiguration(): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Vérifier la configuration d'environnement
    if (!this.config) {
      errors.push('Configuration d\'environnement manquante');
    } else {
      if (!this.config.apiKey) {
        errors.push('Clé API manquante');
      }
      if (!this.config.apiBaseUrl) {
        errors.push('URL de base API manquante');
      }
    }

    // Vérifier la configuration IA
    if (!this.aiConfig) {
      warnings.push('Configuration IA manquante');
    }

    // Vérifier les configurations sectorielles
    if (this.sectorConfigs.size === 0) {
      warnings.push('Aucune configuration sectorielle définie');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// 🏭 FACTORY ET EXPORT
export const createTrainingConfig = (environment: string = 'development') => {
  const service = TrainingConfigService.getInstance();
  service.loadEnvironmentConfig(environment);
  service.loadAIConfiguration();
  return service;
};

export default TrainingConfigService;
