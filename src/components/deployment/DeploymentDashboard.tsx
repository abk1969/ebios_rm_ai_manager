/**
 * 🚀 DASHBOARD DE DÉPLOIEMENT GCP
 * Interface de gestion du déploiement et monitoring
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { 
  Cloud, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Activity,
  Zap,
  Shield,
  BarChart3,
  RefreshCw,
  Rocket,
  Settings,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GCPDeploymentService } from '@/services/deployment/GCPDeploymentService';
import { CloudMonitoringService } from '@/services/monitoring/CloudMonitoringService';

interface DeploymentDashboardProps {
  className?: string;
}

interface DeploymentStatus {
  environment: string;
  status: 'deployed' | 'deploying' | 'failed' | 'not-deployed';
  version: string;
  lastDeployment: string;
  url?: string;
  health: 'healthy' | 'warning' | 'critical';
}

const DeploymentDashboard: React.FC<DeploymentDashboardProps> = ({ className }) => {
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [cloudMetrics, setCloudMetrics] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'status' | 'metrics' | 'alerts' | 'deploy'>('status');

  useEffect(() => {
    loadDeploymentStatus();
    loadCloudMetrics();
    loadAlerts();

    // Actualisation automatique toutes les 30 secondes
    const interval = setInterval(() => {
      loadCloudMetrics();
      loadAlerts();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadDeploymentStatus = async () => {
    try {
      // Récupération du statut réel depuis GCP
      const deploymentService = GCPDeploymentService.getInstance();
      const realStatus = await deploymentService.getDeploymentStatus();

      if (realStatus && realStatus.length > 0) {
        setDeploymentStatus(realStatus);
      } else {
        // Aucun déploiement actuel - statut vide
        setDeploymentStatus([
          {
            environment: 'Production',
            status: 'not-deployed',
            version: 'N/A',
            lastDeployment: '',
            url: undefined,
            health: 'warning'
          },
          {
            environment: 'Staging',
            status: 'not-deployed',
            version: 'N/A',
            lastDeployment: '',
            url: undefined,
            health: 'warning'
          },
          {
            environment: 'Development',
            status: 'not-deployed',
            version: 'N/A',
            lastDeployment: '',
            health: 'warning'
          }
        ]);
      }
    } catch (error) {
      // console.error supprimé;
      // En cas d'erreur, afficher un statut d'erreur réel
      setDeploymentStatus([]);
    }
  };

  const loadCloudMetrics = async () => {
    try {
      const monitoringService = CloudMonitoringService.getInstance();
      const metrics = await monitoringService.getRealTimeMetrics();
      setCloudMetrics(metrics);
    } catch (error) {
      // console.error supprimé;
    }
  };

  const loadAlerts = async () => {
    try {
      const monitoringService = CloudMonitoringService.getInstance();
      const activeAlerts = monitoringService.getActiveAlerts();
      setAlerts(activeAlerts);
    } catch (error) {
      // console.error supprimé;
    }
  };

  const handleDeploy = async (environment: string) => {
    setIsDeploying(true);
    try {
      const deploymentService = GCPDeploymentService.getInstance();
      
      // Validation pré-déploiement
      const validation = await deploymentService.validateDeployment();
      if (!validation.isValid) {
        alert(`Validation échouée: ${validation.errors.join(', ')}`);
        return;
      }

      // Déploiement
      const result = await deploymentService.deploy();
      if (result.success) {
        alert('Déploiement réussi !');
        await loadDeploymentStatus();
      } else {
        alert('Échec du déploiement');
      }
    } catch (error) {
      console.error('Erreur déploiement:', error);
      alert('Erreur lors du déploiement');
    } finally {
      setIsDeploying(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deployed': return CheckCircle;
      case 'deploying': return RefreshCw;
      case 'failed': return XCircle;
      default: return AlertTriangle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed': return 'text-green-600 bg-green-100';
      case 'deploying': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cloud className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Déploiement GCP</h1>
            <p className="text-gray-600">Gestion et monitoring des déploiements</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              loadDeploymentStatus();
              loadCloudMetrics();
              loadAlerts();
            }}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'status', label: 'Statut', icon: Monitor },
            { id: 'metrics', label: 'Métriques', icon: BarChart3 },
            { id: 'alerts', label: 'Alertes', icon: AlertTriangle },
            { id: 'deploy', label: 'Déployer', icon: Rocket }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
              {id === 'alerts' && alerts.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {alerts.length}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu */}
      <div className="space-y-6">
        {activeTab === 'status' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deploymentStatus.map((env) => {
              const StatusIcon = getStatusIcon(env.status);
              return (
                <Card key={env.environment} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{env.environment}</h3>
                    <Activity className={cn("h-5 w-5", getHealthColor(env.health))} />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={cn(
                        "h-4 w-4",
                        env.status === 'deploying' && "animate-spin"
                      )} />
                      <Badge className={getStatusColor(env.status)}>
                        {env.status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <p>Version: {env.version}</p>
                      <p>Déployé: {new Date(env.lastDeployment).toLocaleString('fr-FR')}</p>
                      {env.url && (
                        <a 
                          href={env.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Voir l'application
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === 'metrics' && cloudMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                <h3 className="font-semibold">Performance</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Temps de réponse</span>
                  <span className="font-medium">{cloudMetrics.application.responseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taux d'erreur</span>
                  <span className="font-medium">{cloudMetrics.application.errorRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cache hit</span>
                  <span className="font-medium">{cloudMetrics.application.cacheHitRate.toFixed(1)}%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Infrastructure</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">CPU</span>
                  <span className="font-medium">{cloudMetrics.infrastructure.cpuUsage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mémoire</span>
                  <span className="font-medium">{cloudMetrics.infrastructure.memoryUsage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Firestore</span>
                  <span className="font-medium">{cloudMetrics.infrastructure.firestoreReads}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Business</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Missions</span>
                  <span className="font-medium">{cloudMetrics.business.missionsCreated}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ateliers</span>
                  <span className="font-medium">{cloudMetrics.business.workshopsCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Conformité ANSSI</span>
                  <span className="font-medium">{cloudMetrics.business.anssiComplianceScore}%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold">Sécurité</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Score sécurité</span>
                  <span className="font-medium">{cloudMetrics.security.securityScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Échecs auth</span>
                  <span className="font-medium">{cloudMetrics.security.authenticationFailures}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Vulnérabilités</span>
                  <span className="font-medium">{cloudMetrics.security.vulnerabilitiesDetected}</span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <Card className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune alerte active</h3>
                <p className="text-gray-600">Tous les systèmes fonctionnent normalement</p>
              </Card>
            ) : (
              alerts.map((alert) => (
                <Card key={alert.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge variant="outline">{alert.type}</Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{alert.message}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {new Date(alert.timestamp).toLocaleString('fr-FR')}
                      </p>
                      {alert.actions.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Actions recommandées:</p>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {alert.actions.map((action: string, index: number) => (
                              <li key={index}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Résoudre l'alerte
                        const monitoringService = CloudMonitoringService.getInstance();
                        monitoringService.resolveAlert(alert.id);
                        loadAlerts();
                      }}
                    >
                      Résoudre
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'deploy' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Nouveau déploiement</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Development', 'Staging', 'Production'].map((env) => (
                  <div key={env} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{env}</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Déployer la dernière version sur {env.toLowerCase()}
                    </p>
                    <Button
                      onClick={() => handleDeploy(env)}
                      disabled={isDeploying}
                      className="w-full"
                      variant={env === 'Production' ? 'default' : 'outline'}
                    >
                      {isDeploying ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Déploiement...
                        </>
                      ) : (
                        <>
                          <Rocket className="h-4 w-4 mr-2" />
                          Déployer
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentDashboard;
