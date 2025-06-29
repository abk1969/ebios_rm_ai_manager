/**
 * 🔄 GESTIONNAIRE PROTOCOLE A2A
 * Implémentation du protocole Google A2A pour communication inter-agents
 * Gestion JSON-RPC 2.0, streaming SSE, et push notifications
 */

import { 
  A2AMessage, 
  A2ATask, 
  A2ATaskStatus, 
  A2AArtifact,
  AgentCard,
  WorkshopContext,
  EbiosExpertProfile 
} from '../types/AgentCardTypes';

// 🌐 CONFIGURATION A2A
export interface A2AConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
  retryAttempts: number;
  enableStreaming: boolean;
  enablePushNotifications: boolean;
}

// 📡 REQUÊTE JSON-RPC 2.0
export interface JSONRPCRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: any;
}

// 📨 RÉPONSE JSON-RPC 2.0
export interface JSONRPCResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: any;
  error?: JSONRPCError;
}

// ❌ ERREUR JSON-RPC
export interface JSONRPCError {
  code: number;
  message: string;
  data?: any;
}

// 🎯 GESTIONNAIRE PRINCIPAL A2A
export class A2AProtocolManager {
  private config: A2AConfig;
  private activeConnections: Map<string, WebSocket> = new Map();
  private taskCallbacks: Map<string, (task: A2ATask) => void> = new Map();

  constructor(config: A2AConfig) {
    this.config = config;
  }

  // 📤 ENVOI DE MESSAGE À UN AGENT
  async sendMessage(
    agentUrl: string,
    message: A2AMessage,
    context?: WorkshopContext
  ): Promise<A2ATask> {
    const request: JSONRPCRequest = {
      jsonrpc: '2.0',
      id: this.generateRequestId(),
      method: 'message/send',
      params: {
        message,
        metadata: context ? { workshopContext: context } : {}
      }
    };

    try {
      const response = await this.makeHttpRequest(agentUrl, request);
      
      if (response.error) {
        throw new Error(`A2A Error: ${response.error.message}`);
      }

      return response.result as A2ATask;
    } catch (error) {
      console.error('Erreur envoi message A2A:', error);
      throw error;
    }
  }

  // 🌊 STREAMING SSE POUR TÂCHES LONGUES
  async streamTask(
    agentUrl: string,
    message: A2AMessage,
    onUpdate: (task: A2ATask) => void,
    context?: WorkshopContext
  ): Promise<void> {
    const request: JSONRPCRequest = {
      jsonrpc: '2.0',
      id: this.generateRequestId(),
      method: 'message/stream',
      params: {
        message,
        metadata: context ? { workshopContext: context } : {}
      }
    };

    try {
      const response = await fetch(`${agentUrl}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Impossible de lire le stream SSE');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.result) {
                onUpdate(data.result);
              }
            } catch (e) {
              console.warn('Erreur parsing SSE:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Erreur streaming A2A:', error);
      throw error;
    }
  }

  // 🔔 CONFIGURATION PUSH NOTIFICATIONS
  async setupPushNotifications(
    taskId: string,
    webhookUrl: string,
    token: string
  ): Promise<void> {
    const request: JSONRPCRequest = {
      jsonrpc: '2.0',
      id: this.generateRequestId(),
      method: 'tasks/pushNotificationConfig/set',
      params: {
        taskId,
        config: {
          url: webhookUrl,
          token,
          authentication: {
            schemes: ['Bearer']
          }
        }
      }
    };

    try {
      const response = await this.makeHttpRequest(this.config.baseUrl, request);
      
      if (response.error) {
        throw new Error(`Erreur config push notifications: ${response.error.message}`);
      }
    } catch (error) {
      console.error('Erreur setup push notifications:', error);
      throw error;
    }
  }

  // 📋 RÉCUPÉRATION D'UNE TÂCHE
  async getTask(agentUrl: string, taskId: string): Promise<A2ATask> {
    const request: JSONRPCRequest = {
      jsonrpc: '2.0',
      id: this.generateRequestId(),
      method: 'tasks/get',
      params: { id: taskId }
    };

    try {
      const response = await this.makeHttpRequest(agentUrl, request);
      
      if (response.error) {
        throw new Error(`Erreur récupération tâche: ${response.error.message}`);
      }

      return response.result as A2ATask;
    } catch (error) {
      console.error('Erreur récupération tâche A2A:', error);
      throw error;
    }
  }

  // ❌ ANNULATION D'UNE TÂCHE
  async cancelTask(agentUrl: string, taskId: string): Promise<void> {
    const request: JSONRPCRequest = {
      jsonrpc: '2.0',
      id: this.generateRequestId(),
      method: 'tasks/cancel',
      params: { id: taskId }
    };

    try {
      const response = await this.makeHttpRequest(agentUrl, request);
      
      if (response.error) {
        throw new Error(`Erreur annulation tâche: ${response.error.message}`);
      }
    } catch (error) {
      console.error('Erreur annulation tâche A2A:', error);
      throw error;
    }
  }

  // 🔐 RÉCUPÉRATION AGENT CARD AUTHENTIFIÉE
  async getAuthenticatedAgentCard(agentUrl: string): Promise<AgentCard> {
    try {
      const response = await fetch(`${agentUrl}/../agent/authenticatedExtendedCard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json() as AgentCard;
    } catch (error) {
      console.error('Erreur récupération agent card authentifiée:', error);
      throw error;
    }
  }

  // 🌐 REQUÊTE HTTP GÉNÉRIQUE
  private async makeHttpRequest(
    url: string, 
    request: JSONRPCRequest
  ): Promise<JSONRPCResponse> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json() as JSONRPCResponse;
  }

  // 🆔 GÉNÉRATION ID UNIQUE
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 🧹 NETTOYAGE RESSOURCES
  cleanup(): void {
    // Fermer toutes les connexions WebSocket
    this.activeConnections.forEach((ws, id) => {
      ws.close();
    });
    this.activeConnections.clear();
    this.taskCallbacks.clear();
  }
}

// 🏭 FACTORY POUR GESTIONNAIRE A2A
export class A2AProtocolFactory {
  static create(config: Partial<A2AConfig> = {}): A2AProtocolManager {
    const defaultConfig: A2AConfig = {
      baseUrl: process.env.VITE_A2A_BASE_URL || 'https://api.ebios-ai.com/a2a',
      apiKey: process.env.VITE_A2A_API_KEY || '',
      timeout: 30000,
      retryAttempts: 3,
      enableStreaming: true,
      enablePushNotifications: true,
      ...config
    };

    return new A2AProtocolManager(defaultConfig);
  }
}

// 🎯 TYPES D'ERREURS A2A SPÉCIALISÉES
export class A2AError extends Error {
  constructor(
    message: string,
    public code: number,
    public data?: any
  ) {
    super(message);
    this.name = 'A2AError';
  }
}

export class A2ATaskNotFoundError extends A2AError {
  constructor(taskId: string) {
    super(`Tâche non trouvée: ${taskId}`, -32001);
  }
}

export class A2AAgentUnavailableError extends A2AError {
  constructor(agentName: string) {
    super(`Agent indisponible: ${agentName}`, -32002);
  }
}

export default A2AProtocolManager;
