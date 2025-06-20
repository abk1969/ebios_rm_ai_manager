/**
 * 🚪 GATEWAY API - MODULE FORMATION DÉCOUPLÉ
 * Point d'entrée unique pour toutes les communications avec le module de formation
 * Architecture microservices avec isolation complète
 */

import { BrowserEventEmitter } from '../utils/BrowserEventEmitter';

// 🎯 TYPES ET INTERFACES
export interface TrainingConfig {
  learnerId: string;
  sector: 'finance' | 'healthcare' | 'energy' | 'defense' | 'government' | 'industry';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  objectives: string[];
  duration?: number;
  customization?: {
    regulations?: string[];
    threatFocus?: string[];
    organizationType?: string;
  };
}

export interface TrainingSession {
  id: string;
  learnerId: string;
  status: 'created' | 'active' | 'paused' | 'completed' | 'error';
  config: TrainingConfig;
  progress: {
    currentWorkshop: number;
    completionPercentage: number;
    timeSpent: number;
    milestones: string[];
  };
  embedUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIResponse {
  id: string;
  sessionId: string;
  message: string;
  type: 'instruction' | 'question' | 'feedback' | 'evaluation';
  metadata: {
    confidence: number;
    sources: string[];
    recommendations?: string[];
  };
  timestamp: Date;
}

export interface TrainingEvent {
  type: string;
  sessionId: string;
  data: any;
  timestamp: Date;
}

// 🚪 GATEWAY PRINCIPAL
export class TrainingGateway extends BrowserEventEmitter {
  private static instance: TrainingGateway;
  private baseURL: string;
  private apiKey: string;
  private isConnected = false;

  private constructor() {
    super();
    this.baseURL = process.env.TRAINING_MODULE_URL || 'https://training.ebios-app.com/api/v1';
    this.apiKey = process.env.TRAINING_API_KEY || '';
  }

  public static getInstance(): TrainingGateway {
    if (!TrainingGateway.instance) {
      TrainingGateway.instance = new TrainingGateway();
    }
    return TrainingGateway.instance;
  }

  // 🔌 CONNEXION ET AUTHENTIFICATION
  async connect(): Promise<boolean> {
    try {
      const response = await this.makeRequest('/health', 'GET');
      this.isConnected = response.status === 'healthy';
      
      if (this.isConnected) {
        this.emit('connected');
        console.log('✅ Connexion au module de formation établie');
      }
      
      return this.isConnected;
    } catch (error) {
      console.error('❌ Erreur de connexion au module de formation:', error);
      this.isConnected = false;
      return false;
    }
  }

  // 🎓 GESTION DES SESSIONS
  async createSession(config: TrainingConfig): Promise<TrainingSession> {
    this.ensureConnected();
    
    const response = await this.makeRequest('/sessions', 'POST', {
      config,
      timestamp: new Date().toISOString()
    });

    const session: TrainingSession = {
      ...response.session,
      embedUrl: `${this.baseURL.replace('/api/v1', '')}/embed/${response.session.id}`
    };

    this.emit('session.created', { sessionId: session.id, config });
    return session;
  }

  async getSession(sessionId: string): Promise<TrainingSession | null> {
    this.ensureConnected();
    
    try {
      const response = await this.makeRequest(`/sessions/${sessionId}`, 'GET');
      return response.session;
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async updateSession(sessionId: string, updates: Partial<TrainingSession>): Promise<TrainingSession> {
    this.ensureConnected();
    
    const response = await this.makeRequest(`/sessions/${sessionId}`, 'PUT', updates);
    
    this.emit('session.updated', { sessionId, updates });
    return response.session;
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.ensureConnected();
    
    await this.makeRequest(`/sessions/${sessionId}`, 'DELETE');
    
    this.emit('session.deleted', { sessionId });
  }

  // 🤖 INTERACTION AVEC L'IA
  async sendMessage(sessionId: string, message: string, context?: any): Promise<AIResponse> {
    this.ensureConnected();
    
    const response = await this.makeRequest(`/sessions/${sessionId}/messages`, 'POST', {
      message,
      context,
      timestamp: new Date().toISOString()
    });

    this.emit('ai.response', { sessionId, response: response.aiResponse });
    return response.aiResponse;
  }

  async getRecommendations(sessionId: string): Promise<string[]> {
    this.ensureConnected();
    
    const response = await this.makeRequest(`/sessions/${sessionId}/recommendations`, 'GET');
    return response.recommendations;
  }

  async evaluateProgress(sessionId: string): Promise<any> {
    this.ensureConnected();
    
    const response = await this.makeRequest(`/sessions/${sessionId}/evaluation`, 'GET');
    
    this.emit('progress.evaluated', { sessionId, evaluation: response.evaluation });
    return response.evaluation;
  }

  // 📊 ANALYTICS ET MÉTRIQUES
  async getProgressMetrics(sessionId: string): Promise<any> {
    this.ensureConnected();
    
    const response = await this.makeRequest(`/sessions/${sessionId}/metrics`, 'GET');
    return response.metrics;
  }

  async getPerformanceMetrics(learnerId: string): Promise<any> {
    this.ensureConnected();
    
    const response = await this.makeRequest(`/learners/${learnerId}/performance`, 'GET');
    return response.performance;
  }

  async exportReport(sessionId: string, format: 'pdf' | 'json' | 'xlsx' = 'pdf'): Promise<Blob> {
    this.ensureConnected();
    
    const response = await fetch(`${this.baseURL}/sessions/${sessionId}/report?format=${format}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.statusText}`);
    }

    return response.blob();
  }

  // 🔔 GESTION DES ÉVÉNEMENTS
  subscribeToEvents(sessionId: string): void {
    if (!this.isConnected) {
      console.warn('⚠️ Tentative de souscription aux événements sans connexion');
      return;
    }

    // Simulation d'une connexion WebSocket pour les événements temps réel
    const eventSource = new EventSource(`${this.baseURL}/sessions/${sessionId}/events`, {
      headers: this.getHeaders()
    } as any);

    eventSource.onmessage = (event) => {
      const trainingEvent: TrainingEvent = JSON.parse(event.data);
      this.emit(trainingEvent.type, trainingEvent);
    };

    eventSource.onerror = (error) => {
      console.error('❌ Erreur dans le flux d\'événements:', error);
      this.emit('events.error', { sessionId, error });
    };
  }

  // 🛠️ MÉTHODES UTILITAIRES PRIVÉES
  private ensureConnected(): void {
    if (!this.isConnected) {
      throw new Error('Module de formation non connecté. Appelez connect() d\'abord.');
    }
  }

  private async makeRequest(endpoint: string, method: string, body?: any): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: this.getHeaders(),
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`API Error: ${error.message}`);
    }

    return response.json();
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      'X-Client-Version': '1.0.0',
      'X-Client-Type': 'ebios-main-app'
    };
  }

  // 🔧 MÉTHODES DE CONFIGURATION
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // 🧪 MÉTHODES DE TEST
  async testConnection(): Promise<{ connected: boolean; latency: number; version: string }> {
    const startTime = Date.now();
    
    try {
      const response = await this.makeRequest('/health', 'GET');
      const latency = Date.now() - startTime;
      
      return {
        connected: true,
        latency,
        version: response.version || 'unknown'
      };
    } catch (error) {
      return {
        connected: false,
        latency: -1,
        version: 'unknown'
      };
    }
  }
}

// 🏭 FACTORY POUR CRÉATION D'INSTANCES
export class TrainingGatewayFactory {
  static create(config?: {
    baseURL?: string;
    apiKey?: string;
  }): TrainingGateway {
    const gateway = TrainingGateway.getInstance();
    
    if (config?.baseURL) {
      gateway.setBaseURL(config.baseURL);
    }
    
    if (config?.apiKey) {
      gateway.setApiKey(config.apiKey);
    }
    
    return gateway;
  }
}

// 🎯 EXPORT PAR DÉFAUT
export default TrainingGateway;
