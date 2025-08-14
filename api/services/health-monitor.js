/**
 * 🏥 SERVICE DE MONITORING ET HEALTH CHECKS AVANCÉS
 * Surveillance complète de la santé des services EBIOS RM
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
const axios = require('axios');
const EventEmitter = require('events');

class HealthMonitor extends EventEmitter {
  constructor() {
    super();
    this.services = new Map();
    this.metrics = new Map();
    this.alerts = [];
    this.isMonitoring = false;
    this.monitoringInterval = null;
    this.checkInterval = 30000; // 30 secondes
    
    // Seuils d'alerte
    this.thresholds = {
      responseTime: 5000, // 5 secondes
      errorRate: 0.1, // 10%
      availability: 0.95 // 95%
    };
  }

  /**
   * Enregistre un service à surveiller
   */
  registerService(name, config) {
    this.services.set(name, {
      name,
      url: config.url,
      healthEndpoint: config.healthEndpoint || '/health',
      timeout: config.timeout || 5000,
      retries: config.retries || 3,
      critical: config.critical || false,
      lastCheck: null,
      status: 'unknown',
      metrics: {
        uptime: 0,
        responseTime: [],
        errorCount: 0,
        successCount: 0,
        lastError: null
      }
    });
    
    console.log(`📊 Service enregistré pour monitoring: ${name}`);
  }

  /**
   * Vérifie la santé d'un service
   */
  async checkServiceHealth(serviceName) {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service non trouvé: ${serviceName}`);
    }

    const startTime = Date.now();
    let healthData = null;
    let _error = null;

    try {
      const _response = await axios.get(
        `${service.url}${service.healthEndpoint}`,
        {
          timeout: service.timeout,
          validateStatus: (status) => status < 500
        }
      );

      const responseTime = Date.now() - startTime;
      healthData = {
        status: response.status === 200 ? 'healthy' : 'degraded',
        responseTime,
        data: response.data,
        timestamp: new Date().toISOString()
      };

      // Mettre à jour les métriques
      service.metrics.successCount++;
      service.metrics.responseTime.push(responseTime);
      
      // Garder seulement les 100 dernières mesures
      if (service.metrics.responseTime.length > 100) {
        service.metrics.responseTime.shift();
      }

    } catch (err) {
      const responseTime = Date.now() - startTime;
      error = err;
      
      healthData = {
        status: 'unhealthy',
        responseTime,
        error: err.message,
        timestamp: new Date().toISOString()
      };

      // Mettre à jour les métriques d'erreur
      service.metrics.errorCount++;
      service.metrics.lastError = {
        message: err.message,
        timestamp: new Date().toISOString()
      };
    }

    // Mettre à jour le service
    service.lastCheck = healthData;
    service.status = healthData.status;

    // Vérifier les seuils et émettre des alertes
    this.checkThresholds(serviceName, service);

    return healthData;
  }

  /**
   * Vérifie les seuils et génère des alertes
   */
  checkThresholds(serviceName, service) {
    const metrics = service.metrics;
    const avgResponseTime = metrics.responseTime.length > 0 
      ? metrics.responseTime.reduce((a, b) => a + b, 0) / metrics.responseTime.length 
      : 0;

    const totalRequests = metrics.successCount + metrics.errorCount;
    const errorRate = totalRequests > 0 ? metrics.errorCount / totalRequests : 0;

    // Alerte temps de réponse
    if (avgResponseTime > this.thresholds.responseTime) {
      this.createAlert('high_response_time', serviceName, {
        current: avgResponseTime,
        threshold: this.thresholds.responseTime,
        severity: 'warning'
      });
    }

    // Alerte taux d'erreur
    if (errorRate > this.thresholds.errorRate) {
      this.createAlert('high_error_rate', serviceName, {
        current: errorRate,
        threshold: this.thresholds.errorRate,
        severity: service.critical ? 'critical' : 'warning'
      });
    }

    // Alerte service indisponible
    if (service.status === 'unhealthy' && service.critical) {
      this.createAlert('service_down', serviceName, {
        lastError: metrics.lastError,
        severity: 'critical'
      });
    }
  }

  /**
   * Crée une alerte
   */
  createAlert(type, serviceName, details) {
    const alert = {
      id: `${type}_${serviceName}_${Date.now()}`,
      type,
      serviceName,
      details,
      timestamp: new Date().toISOString(),
      acknowledged: false
    };

    this.alerts.push(alert);
    
    // Garder seulement les 1000 dernières alertes
    if (this.alerts.length > 1000) {
      this.alerts.shift();
    }

    // Émettre l'événement d'alerte
    this.emit('alert', alert);
    
    console.warn(`🚨 ALERTE [${details.severity.toUpperCase()}] ${type} pour ${serviceName}:`, details);
  }

  /**
   * Démarre le monitoring automatique
   */
  startMonitoring() {
    if (this.isMonitoring) {
      console.log('⚠️ Monitoring déjà en cours');
      return;
    }

    this.isMonitoring = true;
    console.log(`🔄 Démarrage du monitoring (intervalle: ${this.checkInterval}ms)`);

    this.monitoringInterval = setInterval(async () => {
      for (const [serviceName] of this.services) {
        try {
          await this.checkServiceHealth(serviceName);
        } catch (__error) {
          console.error(`❌ Erreur monitoring ${serviceName}:`, error.message);
        }
      }
    }, this.checkInterval);

    // Vérification initiale
    this.checkAllServices();
  }

  /**
   * Arrête le monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    console.log('🛑 Monitoring arrêté');
  }

  /**
   * Vérifie tous les services
   */
  async checkAllServices() {
    const results = {};
    
    for (const [serviceName] of this.services) {
      try {
        results[serviceName] = await this.checkServiceHealth(serviceName);
      } catch (__error) {
        results[serviceName] = {
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
    }
    
    return results;
  }

  /**
   * Obtient le statut global du système
   */
  getSystemStatus() {
    const services = Array.from(this.services.values());
    const criticalServices = services.filter(s => s.critical);
    const healthyServices = services.filter(s => s.status === 'healthy');
    const unhealthyServices = services.filter(s => s.status === 'unhealthy');
    
    let overallStatus = 'healthy';
    
    if (unhealthyServices.some(s => s.critical)) {
      overallStatus = 'critical';
    } else if (unhealthyServices.length > 0) {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      services: {
        total: services.length,
        healthy: healthyServices.length,
        unhealthy: unhealthyServices.length,
        critical: criticalServices.length
      },
      alerts: {
        total: this.alerts.length,
        unacknowledged: this.alerts.filter(a => !a.acknowledged).length
      }
    };
  }

  /**
   * Obtient les métriques détaillées
   */
  getDetailedMetrics() {
    const metrics = {};
    
    for (const [serviceName, service] of this.services) {
      const serviceMetrics = service.metrics;
      const avgResponseTime = serviceMetrics.responseTime.length > 0 
        ? serviceMetrics.responseTime.reduce((a, b) => a + b, 0) / serviceMetrics.responseTime.length 
        : 0;

      const totalRequests = serviceMetrics.successCount + serviceMetrics.errorCount;
      const errorRate = totalRequests > 0 ? serviceMetrics.errorCount / totalRequests : 0;
      const availability = totalRequests > 0 ? serviceMetrics.successCount / totalRequests : 0;

      metrics[serviceName] = {
        status: service.status,
        lastCheck: service.lastCheck,
        responseTime: {
          average: Math.round(avgResponseTime),
          latest: serviceMetrics.responseTime.slice(-10) // 10 dernières mesures
        },
        requests: {
          total: totalRequests,
          success: serviceMetrics.successCount,
          errors: serviceMetrics.errorCount
        },
        rates: {
          error: Math.round(errorRate * 100) / 100,
          availability: Math.round(availability * 100) / 100
        },
        lastError: serviceMetrics.lastError
      };
    }
    
    return metrics;
  }

  /**
   * Acquitte une alerte
   */
  acknowledgeAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedAt = new Date().toISOString();
      return true;
    }
    return false;
  }
}

// Instance globale
const healthMonitor = new HealthMonitor();

module.exports = {
  HealthMonitor,
  healthMonitor
};
