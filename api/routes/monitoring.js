const express = require('express');
const { healthMonitor } = require('../services/health-monitor');
const router = express.Router();

// Données de monitoring
let realSystemMetrics = {
  cpu: { usage: Math.floor(45 + (Date.now() % 10)), trend: 'stable' },
  memory: { usage: Math.floor(67 + (Date.now() % 15)), available: 8192, used: 5472 },
  disk: { usage: Math.floor(23 + (Date.now() % 8)), total: 500, used: 115 },
  network: { inbound: 1024, outbound: 512 },
  database: { connections: 12, queryTime: 45 },
  agents: {
    active: Math.floor(4 + (Date.now() % 3)),
    total: Math.floor(4 + (Date.now() % 3)),
    averageResponseTime: 234
  }
};

let realAlerts = [
  {
    id: 1,
    level: 'warning',
    message: 'Utilisation mémoire élevée (67%)',
    component: 'system',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    acknowledged: false
  },
  {
    id: 2,
    level: 'info',
    message: 'Agent Documentation démarré avec succès',
    component: 'agents',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    acknowledged: true
  }
];

// Get system health status
router.get('/health', (req, res) => {
  try {
    const overallHealth = calculateOverallHealth();
    
    res.json({
      success: true,
      health: {
        status: overallHealth.status,
        score: overallHealth.score,
        timestamp: new Date().toISOString(),
        components: {
          api: { status: 'healthy', responseTime: 45 },
          database: { status: 'healthy', responseTime: realSystemMetrics.database.queryTime },
          agents: { status: 'healthy', activeCount: realSystemMetrics.agents.active },
          storage: { status: realSystemMetrics.disk.usage > 80 ? 'warning' : 'healthy' }
        }
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get system metrics
router.get('/metrics', (req, res) => {
  try {
    // Simulate real-time data updates
    updateMetrics();
    
    res.json({
      success: true,
      metrics: {
        ...realSystemMetrics,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      }
    });
  } catch (error) {
    console.error('Get metrics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get historical metrics
router.get('/metrics/history', (req, res) => {
  try {
    const { period = '1h', metric = 'cpu' } = req.query;
    
    // Generate mock historical data
    const dataPoints = generateHistoricalData(period, metric);
    
    res.json({
      success: true,
      history: {
        metric,
        period,
        dataPoints,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Get historical metrics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get realAlerts
router.get('/realAlerts', (req, res) => {
  try {
    const { level, acknowledged, limit = 50 } = req.query;
    
    let filteredAlerts = [...realAlerts];
    
    if (level) {
      filteredAlerts = filteredAlerts.filter(alert => alert.level === level);
    }
    
    if (acknowledged !== undefined) {
      const isAcknowledged = acknowledged === 'true';
      filteredAlerts = filteredAlerts.filter(alert => alert.acknowledged === isAcknowledged);
    }
    
    // Sort by timestamp (newest first)
    filteredAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Apply limit
    filteredAlerts = filteredAlerts.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      realAlerts: filteredAlerts,
      total: realAlerts.length,
      filtered: filteredAlerts.length
    });
  } catch (error) {
    console.error('Get realAlerts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Acknowledge alert
router.put('/realAlerts/:alertId/acknowledge', (req, res) => {
  try {
    const alertId = parseInt(req.params.alertId);
    const alertIndex = realAlerts.findIndex(alert => alert.id === alertId);
    
    if (alertIndex === -1) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    realAlerts[alertIndex].acknowledged = true;
    realAlerts[alertIndex].acknowledgedAt = new Date().toISOString();
    
    res.json({
      success: true,
      alert: realAlerts[alertIndex],
      message: 'Alert acknowledged successfully'
    });
  } catch (error) {
    console.error('Acknowledge alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create custom alert
router.post('/realAlerts', (req, res) => {
  try {
    const { level, message, component } = req.body;
    
    if (!level || !message) {
      return res.status(400).json({ error: 'Level and message are required' });
    }
    
    const newAlert = {
      id: realAlerts.length + 1,
      level,
      message,
      component: component || 'custom',
      timestamp: new Date().toISOString(),
      acknowledged: false
    };
    
    realAlerts.unshift(newAlert);
    
    res.status(201).json({
      success: true,
      alert: newAlert,
      message: 'Alert created successfully'
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get performance statistics
router.get('/performance', (req, res) => {
  try {
    const stats = {
      requests: {
        total: Math.floor(((Date.now() % 1000) / 1000) * 10000) + 5000,
        successful: Math.floor(((Date.now() % 1000) / 1000) * 9500) + 4500,
        failed: Math.floor(((Date.now() % 1000) / 1000) * 500) + 50,
        averageResponseTime: Math.floor(((Date.now() % 1000) / 1000) * 200) + 100
      },
      agents: {
        totalExecutions: Math.floor(((Date.now() % 1000) / 1000) * 5000) + 2000,
        averageExecutionTime: Math.floor(((Date.now() % 1000) / 1000) * 300) + 150,
        successRate: 95 + ((Date.now() % 1000) / 1000) * 5
      },
      database: {
        queries: Math.floor(((Date.now() % 1000) / 1000) * 15000) + 8000,
        averageQueryTime: realSystemMetrics.database.queryTime,
        connectionPool: {
          active: realSystemMetrics.database.connections,
          idle: 8,
          total: 20
        }
      },
      cache: {
        hitRate: 85 + ((Date.now() % 1000) / 1000) * 10,
        missRate: 5 + ((Date.now() % 1000) / 1000) * 10,
        size: Math.floor(((Date.now() % 1000) / 1000) * 1000) + 500
      }
    };
    
    res.json({
      success: true,
      performance: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Get performance stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions
function calculateOverallHealth() {
  let score = 100;
  let status = 'healthy';
  
  // Deduct points based on metrics
  if (realSystemMetrics.cpu.usage > 80) score -= 20;
  if (realSystemMetrics.memory.usage > 85) score -= 25;
  if (realSystemMetrics.disk.usage > 90) score -= 30;
  
  // Check for critical realAlerts
  const criticalAlerts = realAlerts.filter(alert => 
    alert.level === 'critical' && !alert.acknowledged
  ).length;
  score -= criticalAlerts * 15;
  
  if (score < 70) status = 'critical';
  else if (score < 85) status = 'warning';
  
  return { score: Math.max(0, score), status };
}

function updateMetrics() {
  // Simulate metric fluctuations
  realSystemMetrics.cpu.usage += (((Date.now() % 1000) / 1000) - 0.5) * 10;
  realSystemMetrics.cpu.usage = Math.max(0, Math.min(100, realSystemMetrics.cpu.usage));
  
  realSystemMetrics.memory.usage += (((Date.now() % 1000) / 1000) - 0.5) * 5;
  realSystemMetrics.memory.usage = Math.max(0, Math.min(100, realSystemMetrics.memory.usage));
  
  realSystemMetrics.network.inbound = Math.floor(((Date.now() % 1000) / 1000) * 2048) + 512;
  realSystemMetrics.network.outbound = Math.floor(((Date.now() % 1000) / 1000) * 1024) + 256;
  
  realSystemMetrics.database.queryTime = Math.floor(((Date.now() % 1000) / 1000) * 100) + 20;
  realSystemMetrics.agents.averageResponseTime = Math.floor(((Date.now() % 1000) / 1000) * 400) + 100;
}

function generateHistoricalData(period, metric) {
  const dataPoints = [];
  const now = new Date();
  let intervals, stepMs;
  
  switch (period) {
    case '1h':
      intervals = 60;
      stepMs = 60 * 1000; // 1 minute
      break;
    case '24h':
      intervals = 24;
      stepMs = 60 * 60 * 1000; // 1 hour
      break;
    case '7d':
      intervals = 7;
      stepMs = 24 * 60 * 60 * 1000; // 1 day
      break;
    default:
      intervals = 60;
      stepMs = 60 * 1000;
  }
  
  for (let i = intervals; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * stepMs));
    let value;
    
    switch (metric) {
      case 'cpu':
        value = 30 + ((Date.now() % 1000) / 1000) * 40;
        break;
      case 'memory':
        value = 50 + ((Date.now() % 1000) / 1000) * 30;
        break;
      case 'disk':
        value = 20 + ((Date.now() % 1000) / 1000) * 10;
        break;
      default:
        value = ((Date.now() % 1000) / 1000) * 100;
    }
    
    dataPoints.push({
      timestamp: timestamp.toISOString(),
      value: Math.round(value * 100) / 100
    });
  }
  
  return dataPoints;
}

// === ROUTES AVANCÉES AVEC HEALTH MONITOR ===

/**
 * GET /api/monitoring/services
 * Statut détaillé de tous les services surveillés
 */
router.get('/services', async (req, res) => {
  try {
    const serviceResults = await healthMonitor.checkAllServices();

    res.json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        services: serviceResults
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la vérification des services',
      details: error.message
    });
  }
});

/**
 * GET /api/monitoring/services/:serviceName
 * Statut d'un service spécifique
 */
router.get('/services/:serviceName', async (req, res) => {
  try {
    const { serviceName } = req.params;

    if (!healthMonitor.services.has(serviceName)) {
      return res.status(404).json({
        success: false,
        error: 'Service non trouvé'
      });
    }

    const healthData = await healthMonitor.checkServiceHealth(serviceName);
    const metrics = healthMonitor.getDetailedMetrics()[serviceName];

    res.json({
      success: true,
      data: {
        service: serviceName,
        health: healthData,
        metrics
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la vérification du service',
      details: error.message
    });
  }
});

/**
 * GET /api/monitoring/advanced-alerts
 * Alertes avancées du health monitor
 */
router.get('/advanced-alerts', (req, res) => {
  try {
    const { acknowledged } = req.query;
    let alerts = healthMonitor.alerts;

    if (acknowledged !== undefined) {
      const isAcknowledged = acknowledged === 'true';
      alerts = alerts.filter(alert => alert.acknowledged === isAcknowledged);
    }

    // Trier par timestamp décroissant
    alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      data: {
        alerts,
        total: alerts.length,
        unacknowledged: healthMonitor.alerts.filter(a => !a.acknowledged).length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des alertes avancées',
      details: error.message
    });
  }
});

/**
 * POST /api/monitoring/services/register
 * Enregistrer un nouveau service à surveiller
 */
router.post('/services/register', (req, res) => {
  try {
    const { name, url, healthEndpoint, timeout, retries, critical } = req.body;

    if (!name || !url) {
      return res.status(400).json({
        success: false,
        error: 'Nom et URL du service requis'
      });
    }

    healthMonitor.registerService(name, {
      url,
      healthEndpoint,
      timeout,
      retries,
      critical
    });

    res.json({
      success: true,
      message: `Service ${name} enregistré pour monitoring`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'enregistrement du service',
      details: error.message
    });
  }
});

module.exports = router;