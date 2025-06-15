/**
 * 📊 DASHBOARD MONITORING AGENTS - SURVEILLANCE TEMPS RÉEL
 * Interface de monitoring pour l'architecture agentic EBIOS RM
 * Détection de régression et alerting intelligent
 */

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Cpu, 
  Database,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Bot
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AlertingService } from '@/services/monitoring/AlertingService';
import { AgentMonitoringService } from '@/services/monitoring/AgentMonitoringService';

// Types pour le monitoring
interface AgentStatus {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'busy' | 'error' | 'maintenance';
  lastHeartbeat: Date;
  responseTime: number;
  successRate: number;
  tasksCompleted: number;
  currentLoad: number;
}

interface SystemMetrics {
  totalAgents: number;
  activeAgents: number;
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  fallbackUsage: number;
  circuitBreakerActivations: number;
  anssiComplianceScore: number;
}

interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

const AgentMonitoringDashboard: React.FC = () => {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Chargement des données réelles depuis les services
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        // Récupération des agents réels depuis le service de monitoring
        const agentService = AgentMonitoringService.getInstance();
        const realAgents = await agentService.getActiveAgents();

        // Récupération des métriques système réelles
        const realMetrics = await agentService.getSystemMetrics();

        // Récupération des alertes réelles
        const alertingService = AlertingService.getInstance();
        const realAlerts = await alertingService.getActiveAlerts();

        // Conversion au format attendu par l'interface
        const formattedAlerts: Alert[] = realAlerts.map(alert => ({
          id: alert.id,
          severity: alert.severity === 'emergency' ? 'critical' : alert.severity as 'critical' | 'info' | 'warning' | 'error',
          title: alert.title || 'Alerte système',
          message: alert.description || 'Description non disponible',
          timestamp: new Date(alert.timestamp),
          resolved: alert.resolvedAt ? true : false,
          resolvedAt: alert.resolvedAt ? new Date(alert.resolvedAt) : undefined
        }));

        setAgents(realAgents);
        setMetrics(realMetrics);
        setAlerts(formattedAlerts);
      } catch (error) {
        console.error('Erreur chargement données monitoring:', error);
        // En cas d'erreur, afficher un état d'erreur
        setAgents([]);
        setMetrics(null);
        setAlerts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Auto-refresh toutes les 5 secondes
    const interval = autoRefresh ? setInterval(loadData, 5000) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'busy': return Clock;
      case 'error': return AlertTriangle;
      case 'maintenance': return RefreshCw;
      default: return Activity;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Chargement du monitoring...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec contrôles */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Bot className="h-6 w-6 mr-2 text-blue-600" />
            Monitoring Architecture Agentic
          </h2>
          <p className="text-gray-600 mt-1">
            Surveillance temps réel des agents EBIOS RM
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant={autoRefresh ? "default" : "secondary"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", autoRefresh && "animate-spin")} />
            Auto-refresh
          </Button>
        </div>
      </div>

      {/* Métriques globales */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agents Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.activeAgents}/{metrics.totalAgents}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de Succès</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(metrics.successRate * 100).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Temps Réponse</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics.averageResponseTime}ms
                </p>
              </div>
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conformité ANSSI</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(metrics.anssiComplianceScore * 100).toFixed(1)}%
                </p>
              </div>
              <Shield className={cn("h-8 w-8", 
                metrics.anssiComplianceScore >= 0.95 ? "text-green-600" : 
                metrics.anssiComplianceScore >= 0.8 ? "text-yellow-600" : "text-red-600"
              )} />
            </div>
          </Card>
        </div>
      )}

      {/* État des agents */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">État des Agents</h3>
        <div className="space-y-4">
          {agents.map((agent) => {
            const StatusIcon = getStatusIcon(agent.status);
            return (
              <div key={agent.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <StatusIcon className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{agent.name}</p>
                    <p className="text-sm text-gray-600">ID: {agent.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {agent.responseTime}ms
                    </p>
                    <p className="text-xs text-gray-600">
                      {(agent.successRate * 100).toFixed(1)}% succès
                    </p>
                  </div>
                  
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${agent.currentLoad * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Alertes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes Récentes</h3>
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <p className="text-gray-600 text-center py-4">Aucune alerte récente</p>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={cn(
                  "p-4 rounded-lg border",
                  getSeverityColor(alert.severity),
                  alert.resolved && "opacity-60"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4" />
                      <p className="font-medium">{alert.title}</p>
                      {alert.resolved && (
                        <Badge variant="secondary" className="text-xs">Résolu</Badge>
                      )}
                    </div>
                    <p className="text-sm mt-1">{alert.message}</p>
                    <p className="text-xs mt-2 opacity-75">
                      {alert.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default AgentMonitoringDashboard;
