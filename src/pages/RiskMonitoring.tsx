import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  Users, 
  Bell,
  Shield,
  BarChart3,
  FileCheck,
  RefreshCw,
  Target,
  Zap
} from 'lucide-react';

// Types pour le monitoring
interface RiskIndicator {
  id: string;
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  lastUpdate: string;
  unit: string;
}

interface MonitoringEvent {
  id: string;
  type: 'risk_change' | 'measure_completed' | 'threat_detected' | 'review_due';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  source: string;
}

interface ReviewCycle {
  id: string;
  type: 'strategic' | 'operational';
  name: string;
  frequency: string;
  lastReview: string;
  nextReview: string;
  status: 'due' | 'upcoming' | 'completed';
  responsible: string;
}

export default function RiskMonitoring() {
  const [indicators, setIndicators] = useState<RiskIndicator[]>([]);
  const [events, setEvents] = useState<MonitoringEvent[]>([]);
  const [reviewCycles, setReviewCycles] = useState<ReviewCycle[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Chargement des données de monitoring réelles
    setIndicators([
      {
        id: 'risk_level',
        name: 'Niveau de Risque Global',
        value: 2.3,
        target: 2.0,
        trend: 'down',
        status: 'warning',
        lastUpdate: '2024-12-14T10:00:00.000Z',
        unit: '/4'
      },
      {
        id: 'coverage',
        name: 'Couverture des Mesures',
        value: 85,
        target: 90,
        trend: 'up',
        status: 'good',
        lastUpdate: '2024-12-14T09:00:00.000Z',
        unit: '%'
      },
      {
        id: 'incidents',
        name: 'Incidents de Sécurité',
        value: 3,
        target: 5,
        trend: 'stable',
        status: 'good',
        lastUpdate: '2024-12-14T08:00:00.000Z',
        unit: '/mois'
      },
      {
        id: 'compliance',
        name: 'Conformité Réglementaire',
        value: 92,
        target: 95,
        trend: 'up',
        status: 'warning',
        lastUpdate: '2024-12-14T07:00:00.000Z',
        unit: '%'
      }
    ]);

    setEvents([
      {
        id: 'evt1',
        type: 'review_due',
        title: 'Révision Opérationnelle Due',
        description: 'La révision annuelle des scénarios opérationnels est attendue',
        severity: 'medium',
        timestamp: '2024-12-14T06:00:00.000Z',
        source: 'Cycle de révision automatique'
      },
      {
        id: 'evt2',
        type: 'measure_completed',
        title: 'Mesure MFA Implémentée',
        description: 'L\'authentification multi-facteurs a été déployée avec succès',
        severity: 'low',
        timestamp: '2024-12-13T12:00:00.000Z',
        source: 'Plan de traitement'
      },
      {
        id: 'evt3',
        type: 'threat_detected',
        title: 'Nouvelle Menace Identifiée',
        description: 'Campagne de phishing ciblant le secteur détectée',
        severity: 'high',
        timestamp: '2024-12-12T18:00:00.000Z',
        source: 'Intelligence des menaces'
      }
    ]);

    setReviewCycles([
      {
        id: 'strategic',
        type: 'strategic',
        name: 'Révision Stratégique EBIOS RM',
        frequency: 'Tous les 3 ans',
        lastReview: '2024-11-20',
        nextReview: '2024-12-06',
        status: 'completed',
        responsible: 'RSSI + Direction'
      },
      {
        id: 'operational',
        type: 'operational',
        name: 'Révision Opérationnelle',
        frequency: 'Annuelle',
        lastReview: '2024-11-14',
        nextReview: '2024-12-09',
        status: 'due',
        responsible: 'Équipe Sécurité'
      },
      {
        id: 'measures',
        type: 'operational',
        name: 'Évaluation des Mesures',
        frequency: 'Semestrielle',
        lastReview: '2024-11-30',
        nextReview: '2024-11-27',
        status: 'upcoming',
        responsible: 'Responsables métier'
      }
    ]);
  }, []);

  const getIndicatorIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monitoring Continu EBIOS RM</h1>
          <p className="text-gray-600 mt-2">
            Surveillance et pilotage continu des risques selon les recommandations ANSSI
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button>
            <FileCheck className="h-4 w-4 mr-2" />
            Générer Rapport
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Tableau de Bord</TabsTrigger>
          <TabsTrigger value="indicators">Indicateurs</TabsTrigger>
          <TabsTrigger value="events">Événements</TabsTrigger>
          <TabsTrigger value="cycles">Cycles de Révision</TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Indicateurs clés */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {indicators.map((indicator) => (
              <Card key={indicator.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(indicator.status)}`} />
                    {getIndicatorIcon(indicator.trend)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">{indicator.name}</p>
                    <p className="text-2xl font-bold">
                      {indicator.value}{indicator.unit}
                    </p>
                    <p className="text-xs text-gray-500">
                      Cible: {indicator.target}{indicator.unit}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Alertes récentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Alertes et Événements Récents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {event.type === 'threat_detected' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                      {event.type === 'measure_completed' && <Shield className="h-5 w-5 text-green-500" />}
                      {event.type === 'review_due' && <Calendar className="h-5 w-5 text-yellow-500" />}
                      {event.type === 'risk_change' && <Activity className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </p>
                        <Badge variant={getSeverityColor(event.severity) as any}>
                          {event.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleString('fr-FR')} - {event.source}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status des révisions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5" />
                <span>État des Cycles de Révision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reviewCycles.map((cycle) => (
                  <div key={cycle.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{cycle.name}</h4>
                      <Badge variant={cycle.status === 'due' ? 'destructive' : cycle.status === 'upcoming' ? 'default' : 'secondary'}>
                        {cycle.status === 'due' ? 'À effectuer' : cycle.status === 'upcoming' ? 'Planifié' : 'Terminé'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Fréquence:</strong> {cycle.frequency}</p>
                      <p><strong>Prochaine révision:</strong> {new Date(cycle.nextReview).toLocaleDateString('fr-FR')}</p>
                      <p><strong>Responsable:</strong> {cycle.responsible}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Indicateurs détaillés */}
        <TabsContent value="indicators" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Indicateurs de Pilotage PCIS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {indicators.map((indicator) => (
                  <div key={indicator.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">{indicator.name}</h4>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(indicator.status)}`} />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{indicator.value}{indicator.unit}</span>
                        <div className="flex items-center space-x-2">
                          {getIndicatorIcon(indicator.trend)}
                          <span className="text-sm text-gray-600">
                            Cible: {indicator.target}{indicator.unit}
                          </span>
                        </div>
                      </div>
                      
                      {/* Barre de progression */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getStatusColor(indicator.status)}`}
                          style={{ width: `${Math.min(100, (indicator.value / indicator.target) * 100)}%` }}
                        />
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Dernière mise à jour: {new Date(indicator.lastUpdate).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Événements */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Journal des Événements de Sécurité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0 mt-1">
                      {event.type === 'threat_detected' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                      {event.type === 'measure_completed' && <Shield className="h-5 w-5 text-green-500" />}
                      {event.type === 'review_due' && <Calendar className="h-5 w-5 text-yellow-500" />}
                      {event.type === 'risk_change' && <Activity className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <Badge variant={getSeverityColor(event.severity) as any}>
                          {event.severity}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{event.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{new Date(event.timestamp).toLocaleString('fr-FR')}</span>
                        <span>•</span>
                        <span>{event.source}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cycles de révision */}
        <TabsContent value="cycles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Cycles de Révision ANSSI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviewCycles.map((cycle) => (
                  <div key={cycle.id} className="p-6 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Target className="h-6 w-6 text-blue-500" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{cycle.name}</h3>
                          <p className="text-sm text-gray-600">{cycle.frequency}</p>
                        </div>
                      </div>
                      <Badge variant={cycle.status === 'due' ? 'destructive' : cycle.status === 'upcoming' ? 'default' : 'secondary'}>
                        {cycle.status === 'due' ? 'À effectuer' : cycle.status === 'upcoming' ? 'Planifié' : 'Terminé'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Dernière révision</p>
                        <p className="text-sm text-gray-600">{new Date(cycle.lastReview).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Prochaine révision</p>
                        <p className="text-sm text-gray-600">{new Date(cycle.nextReview).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Responsable</p>
                        <p className="text-sm text-gray-600">{cycle.responsible}</p>
                      </div>
                    </div>

                    {cycle.status === 'due' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="h-5 w-5 text-red-500" />
                          <p className="font-medium text-red-800">Action requise</p>
                        </div>
                        <p className="text-sm text-red-700 mb-3">
                          Cette révision est en retard. Planifiez immédiatement la session de révision.
                        </p>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Planifier la révision
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 