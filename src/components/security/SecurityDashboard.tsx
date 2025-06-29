/**
 * 🔒 TABLEAU DE BORD DE SÉCURITÉ
 * Interface de monitoring et gestion de la sécurité
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Lock,
  Key,
  Users,
  Activity,
  FileText,
  Settings,
  RefreshCw,
  Download,
  Bell,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { SecurityService } from '@/services/security/SecurityService';

interface SecurityMetrics {
  overview: {
    activeAlerts: number;
    criticalAlerts: number;
    highAlerts: number;
    totalEvents24h: number;
    totalEvents7d: number;
  };
  authentication: {
    successfulLogins24h: number;
    failedLogins24h: number;
    mfaChallenges24h: number;
    accountLockouts24h: number;
  };
  authorization: {
    permissionDenied24h: number;
    privilegeEscalation24h: number;
  };
  dataAccess: {
    dataReads24h: number;
    dataWrites24h: number;
    dataExports24h: number;
    suspiciousAccess24h: number;
  };
  system: {
    systemErrors24h: number;
    performanceIssues24h: number;
    configChanges24h: number;
  };
  trends: {
    alertTrend7d: number;
    loginTrend7d: number;
    errorTrend7d: number;
  };
}

interface SecurityAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  status: 'open' | 'acknowledged' | 'resolved';
}

const SecurityDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  const securityService = SecurityService.getInstance();

  useEffect(() => {
    loadSecurityData();
    
    // Actualisation automatique toutes les 30 secondes
    const interval = setInterval(loadSecurityData, 30000);
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const loadSecurityData = async () => {
    try {
      setRefreshing(true);
      
      // Charger les métriques de sécurité
      const securityMetrics = await securityService.getSecurityMetrics();
      setMetrics(securityMetrics);

      // Charger les alertes récentes
      // const recentAlerts = await securityService.getRecentAlerts();
      // setAlerts(recentAlerts);

    } catch (error) {
      console.error('Erreur lors du chargement des données de sécurité:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadSecurityData();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Chargement des données de sécurité...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Sécurité</h1>
            <p className="text-gray-600">Monitoring et gestion de la sécurité EBIOS AI Manager</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="1h">Dernière heure</option>
            <option value="24h">Dernières 24h</option>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
          </select>
          
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Alertes critiques */}
      {metrics && metrics.overview.criticalAlerts > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{metrics.overview.criticalAlerts} alerte(s) critique(s)</strong> nécessitent une attention immédiate.
          </AlertDescription>
        </Alert>
      )}

      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alertes Actives</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.overview.activeAlerts || 0}
                </p>
              </div>
              <Bell className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              {getTrendIcon(metrics?.trends.alertTrend7d || 0)}
              <span className="ml-1 text-gray-600">vs 7 derniers jours</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connexions 24h</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.authentication.successfulLogins24h || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-red-600">
                {metrics?.authentication.failedLogins24h || 0} échecs
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accès Données 24h</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(metrics?.dataAccess.dataReads24h || 0) + (metrics?.dataAccess.dataWrites24h || 0)}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-orange-600">
                {metrics?.dataAccess.suspiciousAccess24h || 0} suspects
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Erreurs Système</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metrics?.system.systemErrors24h || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              {getTrendIcon(metrics?.trends.errorTrend7d || 0)}
              <span className="ml-1 text-gray-600">vs 7 derniers jours</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Détails par catégorie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Authentification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-blue-600" />
              Authentification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Connexions réussies</span>
                <Badge variant="outline" className="text-green-600">
                  {metrics?.authentication.successfulLogins24h || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Connexions échouées</span>
                <Badge variant="outline" className="text-red-600">
                  {metrics?.authentication.failedLogins24h || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Défis MFA</span>
                <Badge variant="outline" className="text-blue-600">
                  {metrics?.authentication.mfaChallenges24h || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Comptes verrouillés</span>
                <Badge variant="outline" className="text-orange-600">
                  {metrics?.authentication.accountLockouts24h || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Autorisation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-purple-600" />
              Autorisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Permissions refusées</span>
                <Badge variant="outline" className="text-red-600">
                  {metrics?.authorization.permissionDenied24h || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Escalades de privilèges</span>
                <Badge variant="outline" className="text-orange-600">
                  {metrics?.authorization.privilegeEscalation24h || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accès aux données */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-600" />
              Accès aux Données
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Lectures</span>
                <Badge variant="outline" className="text-blue-600">
                  {metrics?.dataAccess.dataReads24h || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Écritures</span>
                <Badge variant="outline" className="text-green-600">
                  {metrics?.dataAccess.dataWrites24h || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Exports</span>
                <Badge variant="outline" className="text-purple-600">
                  {metrics?.dataAccess.dataExports24h || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Accès suspects</span>
                <Badge variant="outline" className="text-red-600">
                  {metrics?.dataAccess.suspiciousAccess24h || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Système */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-600" />
              Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Erreurs système</span>
                <Badge variant="outline" className="text-red-600">
                  {metrics?.system.systemErrors24h || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Problèmes performance</span>
                <Badge variant="outline" className="text-orange-600">
                  {metrics?.system.performanceIssues24h || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Changements config</span>
                <Badge variant="outline" className="text-blue-600">
                  {metrics?.system.configChanges24h || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Alertes Récentes
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>Aucune alerte récente</p>
              <p className="text-sm">Tous les systèmes fonctionnent normalement</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)}`} />
                    <div>
                      <p className="font-medium text-gray-900">{alert.title}</p>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {alert.severity}
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {alert.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Générer Rapport d'Audit
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Vérifier Conformité
            </Button>
            <Button variant="outline" className="justify-start">
              <Key className="h-4 w-4 mr-2" />
              Rotation des Clés
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
