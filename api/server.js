/* eslint-disable @typescript-eslint/no-unused-vars */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { AIServiceProxy, createAIProxy, setupFallbackRoutes } = require('./ai-proxy');
const { healthMonitor } = require('./services/health-monitor');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialiser le proxy AI
const aiService = new AIServiceProxy();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging avec gestion d'encodage
app.use(morgan('combined', {
  stream: {
    write: (message) => {
      // Éviter les problèmes d'encodage Unicode
      try {
        process.stdout.write(message);
      } catch (__error) {
        console.log('API Log:', message.replace(/[^\x00-\x7F]/g, ""));
      }
    }
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/missions', require('./routes/missions'));
app.use('/api/workshops', require('./routes/workshops'));
app.use('/api/agents', require('./routes/agents'));
app.use('/api/monitoring', require('./routes/monitoring'));
app.use('/api/reports', require('./routes/reports'));

// Routes de fallback AI (avant le proxy)
setupFallbackRoutes(app);

// Proxy pour le service Python AI
app.use('/api/ai', createAIProxy(aiService));

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Start server with AI service
async function startServer() {
  try {
    // Démarrer le service Python AI
    console.log('🤖 Initialisation du service AI...');
    await aiService.startPythonService();
    console.log('✅ Service AI démarré avec succès');

    // Configurer le monitoring des services
    setupServiceMonitoring();

    // Démarrer le serveur principal
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 EBIOS API Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🤖 AI Service: http://localhost:8081`);
      console.log(`🔄 AI Proxy: http://localhost:${PORT}/api/ai`);
      console.log(`📊 Monitoring: http://localhost:${PORT}/api/monitoring/health`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage:', error);
    console.log('⚠️ Démarrage sans service AI (mode dégradé)');

    // Démarrer quand même le serveur principal
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 EBIOS API Server running on port ${PORT} (mode dégradé)`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  aiService.stopPythonService();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  aiService.stopPythonService();
  process.exit(0);
});

// Configuration du monitoring des services
function setupServiceMonitoring() {
  console.log('📊 Configuration du monitoring des services...');

  // Enregistrer les services à surveiller
  healthMonitor.registerService('python-ai', {
    url: 'http://127.0.0.1:8081',
    healthEndpoint: '/health',
    timeout: 5000,
    retries: 3,
    critical: true
  });

  healthMonitor.registerService('database', {
    url: 'http://localhost:5432',
    healthEndpoint: '/health',
    timeout: 3000,
    retries: 2,
    critical: true
  });

  // Démarrer le monitoring automatique
  healthMonitor.startMonitoring();

  // Écouter les alertes
  healthMonitor.on('alert', (alert) => {
    console.warn(`🚨 ALERTE [${alert.details.severity.toUpperCase()}] ${alert.type} pour ${alert.serviceName}`);
  });

  console.log('✅ Monitoring configuré et démarré');
}

// Démarrer l'application
startServer();

module.exports = app;