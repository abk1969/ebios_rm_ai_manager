/**
 * 🤖 AI SERVICE PROXY
 * Proxy pour intégrer le service Python AI dans l'API Node.js principale
 * Évite les conflits de ports et unifie l'architecture
 */

// const express = require('express'); // Unused import
/* eslint-disable @typescript-eslint/no-unused-vars */
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');
const { fallbackSystem } = require('./services/fallback-system');
const { retryManager } = require('./services/retry-manager');

class AIServiceProxy {
  constructor() {
    this.pythonProcess = null;
    this.isServiceReady = false;
    this.retryCount = 0;
    this.maxRetries = 5;

    // Enregistrer le circuit breaker pour le service AI
    fallbackSystem.registerCircuitBreaker('python-ai');
  }

  /**
   * Démarre le service Python AI
   */
  async startPythonService() {
    return new Promise((resolve, reject) => {
      console.log('🚀 Démarrage du service Python AI...');
      
      const pythonServicePath = path.join(__dirname, '..', 'python-ai-service');
      const pythonScript = path.join(pythonServicePath, 'app.py');
      
      // Démarrer le processus Python avec les variables d'environnement unifiées
      this.pythonProcess = spawn('python', [pythonScript], {
        cwd: pythonServicePath,
        env: {
          ...process.env,
          PORT: '8081',
          FLASK_ENV: 'development',
          // Variables de base de données partagées
          DB_HOST: process.env.DB_HOST || 'localhost',
          DB_PORT: process.env.DB_PORT || '5432',
          DB_NAME: process.env.DB_NAME || 'ebios',
          DB_USER: process.env.DB_USER || 'postgres',
          DB_PASSWORD: process.env.DB_PASSWORD || 'postgres'
        }
      });

      this.pythonProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`[Python AI] ${output}`);
        
        // Détecter quand le service est prêt
        if (output.includes('Running on') || output.includes('* Serving Flask app')) {
          this.isServiceReady = true;
          resolve();
        }
      });

      this.pythonProcess.stderr.on('data', (data) => {
        console.error(`[Python AI Error] ${data}`);
      });

      this.pythonProcess.on('close', (code) => {
        console.log(`[Python AI] Processus fermé avec le code ${code}`);
        this.isServiceReady = false;
      });

      this.pythonProcess.on('error', (error) => {
        console.error(`[Python AI] Erreur de démarrage: ${error}`);
        reject(error);
      });

      // Timeout de démarrage
      setTimeout(() => {
        if (!this.isServiceReady) {
          reject(new Error('Timeout: Le service Python AI n\'a pas démarré dans les temps'));
        }
      }, 30000);
    });
  }

  /**
   * Vérifie si le service Python est accessible avec retry
   */
  async checkServiceHealth() {
    try {
      const _result = await retryManager.executeWithRetry(
        async () => {
          const _response = await axios.get('http://127.0.0.1:8081/health', {
            timeout: 5000
          });
          if (_response.status !== 200) {
            throw new Error(`Service health check failed: ${_response.status}`);
          }
          return _response.data;
        },
        {
          maxRetries: 2,
          baseDelay: 1000,
          operationName: 'python-ai-health-check'
        }
      );
      return true;
    } catch (error) {
      console.error('Health check failed after retries:', error.message);
      return false;
    }
  }

  /**
   * Redémarre le service Python si nécessaire
   */
  async restartServiceIfNeeded() {
    if (!this.isServiceReady || !(await this.checkServiceHealth())) {
      console.log('🔄 Redémarrage du service Python AI...');
      
      if (this.pythonProcess) {
        this.pythonProcess.kill();
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      await this.startPythonService();
    }
  }

  /**
   * Arrête le service Python
   */
  stopPythonService() {
    if (this.pythonProcess) {
      console.log('🛑 Arrêt du service Python AI...');
      this.pythonProcess.kill();
      this.pythonProcess = null;
      this.isServiceReady = false;
    }
  }
}

/**
 * Middleware de proxy intelligent pour les requêtes AI
 */
function createAIProxy(aiService) {
  return createProxyMiddleware({
    target: 'http://127.0.0.1:8081',
    changeOrigin: true,
    pathRewrite: {
      '^/api/ai': '' // Supprime /api/ai du chemin
    },
    onError: async (err, req, res) => {
      console.error('Erreur proxy AI:', err.message);
      
      // Tentative de redémarrage du service
      try {
        await aiService.restartServiceIfNeeded();
        res.status(503).json({
          error: 'Service AI temporairement indisponible',
          message: 'Redémarrage en cours...',
          retry: true
        });
      } catch (_restartError) {
        res.status(500).json({
          error: 'Service AI indisponible',
          message: 'Impossible de redémarrer le service'
        });
      }
    },
    onProxyReq: (proxyReq, req, _res) => {
      console.log(`[AI Proxy] ${req.method} ${req.url} -> http://127.0.0.1:8081${req.url}`);
    }
  });
}

/**
 * Routes de fallback pour les fonctionnalités AI essentielles
 */
function setupFallbackRoutes(app) {
  // Route de santé pour le service AI
  app.get('/api/ai/health', async (req, res) => {
    try {
      const _response = await axios.get('http://127.0.0.1:8081/health', { timeout: 5000 });
      res.json({
        status: 'healthy',
        pythonService: response.data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Route de fallback pour les suggestions avec système intelligent
  app.post('/api/ai/suggestions', async (req, res) => {
    try {
      const { workshop, context } = req.body;

      const result = await fallbackSystem.executeWithFallback(
        'python-ai',
        async () => {
          // Tentative de requête vers le service AI avec retry
          const retryResult = await retryManager.executeWithRetry(
            async () => {
              const _response = await axios.post('http://127.0.0.1:8081/api/ai/suggestions', req.body, {
                timeout: 5000
              });
              return response.data;
            },
            {
              maxRetries: 2,
              baseDelay: 500,
              operationName: 'ai-suggestions-request'
            }
          );
          return retryResult.result;
        },
        'ai_suggestions',
        { workshop, context }
      );

      res.json(result);
    } catch (error) {
      console.error('Erreur route suggestions fallback:', error);
      res.status(500).json({
        error: 'Service temporairement indisponible',
        fallback: true,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Route de fallback pour l'analyse sémantique avec système intelligent
  app.post('/api/ai/analyze', async (req, res) => {
    try {
      const { text, type } = req.body;

      const result = await fallbackSystem.executeWithFallback(
        'python-ai',
        async () => {
          // Tentative de requête vers le service AI avec retry
          const retryResult = await retryManager.executeWithRetry(
            async () => {
              const _response = await axios.post('http://127.0.0.1:8081/api/ai/analyze', req.body, {
                timeout: 5000
              });
              return response.data;
            },
            {
              maxRetries: 2,
              baseDelay: 500,
              operationName: 'ai-analyze-request'
            }
          );
          return retryResult.result;
        },
        'semantic_analysis',
        { text, type }
      );

      res.json(result);
    } catch (error) {
      console.error('Erreur route analyze fallback:', error);
      res.status(500).json({
        error: 'Service d\'analyse temporairement indisponible',
        fallback: true,
        timestamp: new Date().toISOString()
      });
    }
  });
}

module.exports = {
  AIServiceProxy,
  createAIProxy,
  setupFallbackRoutes
};
