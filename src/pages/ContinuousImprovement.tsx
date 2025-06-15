import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Repeat, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  FileCheck,
  Clock,
  Target,
  Users,
  BarChart3,
  Activity,
  Settings,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

// Types pour l'amélioration continue
interface RevisionCycle {
  id: string;
  type: 'strategic' | 'operational' | 'tactical';
  name: string;
  frequency: string; // "annual" | "biannual" | "triennial"
  lastUpdate: string;
  nextUpdate: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  progress: number;
  responsible: string;
  scope: string[];
  objectives: string[];
}

interface ImprovementAction {
  id: string;
  title: string;
  description: string;
  type: 'risk_reduction' | 'process_optimization' | 'security_enhancement' | 'compliance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'planned' | 'in_progress' | 'completed' | 'on_hold';
  startDate: string;
  targetDate: string;
  responsible: string;
  estimatedEffort: number; // en jours
  expectedBenefit: string;
  kpis: string[];
}

interface ContinuousMonitoring {
  indicator: string;
  category: 'security' | 'operational' | 'strategic';
  currentValue: number;
  targetValue: number;
  trend: 'improving' | 'stable' | 'degrading';
  alertThreshold: number;
  lastMeasured: string;
  frequency: string;
}

export default function ContinuousImprovement() {
  const [revisionCycles, setRevisionCycles] = useState<RevisionCycle[]>([]);
  const [improvementActions, setImprovementActions] = useState<ImprovementAction[]>([]);
  const [monitoringKPIs, setMonitoringKPIs] = useState<ContinuousMonitoring[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<RevisionCycle | null>(null);

  useEffect(() => {
    // Données réelles
    const mockCycles: RevisionCycle[] = [
      {
        id: '1',
        type: 'strategic',
        name: 'Révision Stratégique Complète',
        frequency: 'triennial',
        lastUpdate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextUpdate: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending',
        progress: 0,
        responsible: 'COMEX + RSSI',
        scope: ['Scénarios stratégiques', 'Valeurs métier', 'Sources de risque'],
        objectives: [
          'Réaligner les enjeux de sécurité avec la stratégie business',
          'Actualiser les scénarios face aux nouvelles menaces',
          'Réviser les valeurs métier selon évolution organisationnelle'
        ]
      },
      {
        id: '2',
        type: 'operational',
        name: 'Révision Opérationnelle Annuelle',
        frequency: 'annual',
        lastUpdate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextUpdate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'in_progress',
        progress: 65,
        responsible: 'RSSI + Équipes techniques',
        scope: ['Scénarios opérationnels', 'Mesures de sécurité', 'Nouvelles vulnérabilités'],
        objectives: [
          'Mettre à jour les scénarios opérationnels',
          'Intégrer les nouvelles menaces découvertes',
          'Valider l\'efficacité des mesures déployées'
        ]
      },
      {
        id: '3',
        type: 'tactical',
        name: 'Révision Trimestrielle des Mesures',
        frequency: 'quarterly',
        lastUpdate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextUpdate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'pending',
        progress: 0,
        responsible: 'Équipes sécurité',
        scope: ['Efficacité mesures', 'Nouveaux contrôles', 'Incidents analysés'],
        objectives: [
          'Évaluer la performance des mesures récentes',
          'Identifier les lacunes de sécurité émergentes',
          'Ajuster les priorités selon les incidents'
        ]
      }
    ];

    const mockActions: ImprovementAction[] = [
      {
        id: '1',
        title: 'Implémentation Zero Trust Architecture',
        description: 'Migration progressive vers une architecture Zero Trust pour réduire les risques de mouvements latéraux',
        type: 'security_enhancement',
        priority: 'high',
        status: 'in_progress',
        startDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        targetDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        responsible: 'Équipe Infrastructure',
        estimatedEffort: 180,
        expectedBenefit: 'Réduction de 60% du risque de compromission réseau',
        kpis: ['Temps détection incident', 'Nombre accès non autorisés', 'Surface d\'attaque']
      },
      {
        id: '2',
        title: 'Automatisation Response to Incidents',
        description: 'Déploiement d\'un SOAR pour automatiser la réponse aux incidents de sécurité',
        type: 'process_optimization',
        priority: 'medium',
        status: 'planned',
        startDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        targetDate: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        responsible: 'SOC Team',
        estimatedEffort: 120,
        expectedBenefit: 'Réduction de 70% du temps de réponse aux incidents',
        kpis: ['MTTR incidents', 'Taux faux positifs', 'Couverture automatisation']
      }
    ];

    const mockKPIs: ContinuousMonitoring[] = [
      {
        indicator: 'Temps Moyen de Détection (MTTD)',
        category: 'security',
        currentValue: 12,
        targetValue: 6,
        trend: 'improving',
        alertThreshold: 24,
        lastMeasured: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        frequency: 'weekly'
      },
      {
        indicator: 'Couverture des Mesures de Sécurité',
        category: 'operational',
        currentValue: 78,
        targetValue: 90,
        trend: 'stable',
        alertThreshold: 70,
        lastMeasured: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        frequency: 'monthly'
      },
      {
        indicator: 'Niveau de Risque Résiduel Global',
        category: 'strategic',
        currentValue: 2.3,
        targetValue: 2.0,
        trend: 'improving',
        alertThreshold: 3.0,
        lastMeasured: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        frequency: 'monthly'
      }
    ];

    setRevisionCycles(mockCycles);
    setImprovementActions(mockActions);
    setMonitoringKPIs(mockKPIs);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'stable': return <Activity className="h-4 w-4 text-blue-600" />;
      case 'degrading': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Amélioration Continue EBIOS RM</h1>
          <p className="text-gray-600 mt-2">Gestion des cycles de révision et optimisation continue selon ANSSI</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileCheck className="h-4 w-4 mr-2" />
            Générer Rapport
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </Button>
        </div>
      </div>

      {/* Vue d'ensemble KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cycles en Cours</p>
                <p className="text-2xl font-bold text-blue-600">
                  {revisionCycles.filter(c => c.status === 'in_progress').length}
                </p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actions d'Amélioration</p>
                <p className="text-2xl font-bold text-green-600">
                  {improvementActions.filter(a => a.status === 'in_progress').length}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">KPIs en Amélioration</p>
                <p className="text-2xl font-bold text-green-600">
                  {monitoringKPIs.filter(k => k.trend === 'improving').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prochaine Révision</p>
                <p className="text-sm font-medium text-orange-600">15 jours</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="cycles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cycles">Cycles de Révision</TabsTrigger>
          <TabsTrigger value="actions">Actions d'Amélioration</TabsTrigger>
          <TabsTrigger value="monitoring">Surveillance Continue</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
        </TabsList>

        {/* Cycles de Révision */}
        <TabsContent value="cycles" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {revisionCycles.map((cycle) => (
              <Card key={cycle.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{cycle.name}</CardTitle>
                    <Badge className={getStatusColor(cycle.status)}>
                      {cycle.status}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Repeat className="h-4 w-4" />
                    <span>Fréquence: {cycle.frequency}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progression</span>
                      <span>{cycle.progress}%</span>
                    </div>
                    <Progress value={cycle.progress} className="w-full" />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Responsable:</p>
                    <p className="text-sm text-gray-600">{cycle.responsible}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Prochaine révision:</p>
                    <p className="text-sm text-gray-600">{new Date(cycle.nextUpdate).toLocaleDateString('fr-FR')}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Périmètre:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {cycle.scope.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => setSelectedCycle(cycle)}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Actions d'Amélioration */}
        <TabsContent value="actions" className="space-y-4">
          <div className="space-y-4">
            {improvementActions.map((action) => (
              <Card key={action.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{action.title}</h3>
                        <Badge className={getPriorityColor(action.priority)}>
                          {action.priority}
                        </Badge>
                        <Badge className={getStatusColor(action.status)}>
                          {action.status}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{action.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Responsable:</p>
                          <p className="text-sm text-gray-600">{action.responsible}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Effort estimé:</p>
                          <p className="text-sm text-gray-600">{action.estimatedEffort} jours</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Date cible:</p>
                          <p className="text-sm text-gray-600">
                            {new Date(action.targetDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">Bénéfice attendu:</p>
                        <p className="text-sm text-green-600">{action.expectedBenefit}</p>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">KPIs de suivi:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {action.kpis.map((kpi, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {kpi}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Surveillance Continue */}
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {monitoringKPIs.map((kpi, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{kpi.indicator}</CardTitle>
                    {getTrendIcon(kpi.trend)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{kpi.currentValue}</p>
                      <p className="text-sm text-gray-600">Actuel</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{kpi.targetValue}</p>
                      <p className="text-sm text-gray-600">Cible</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progression vers l'objectif</span>
                      <span>{Math.round((kpi.currentValue / kpi.targetValue) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(kpi.currentValue / kpi.targetValue) * 100} 
                      className="w-full" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Catégorie:</p>
                      <p className="text-gray-600">{kpi.category}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Fréquence:</p>
                      <p className="text-gray-600">{kpi.frequency}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">
                      Dernière mesure: {new Date(kpi.lastMeasured).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Roadmap */}
        <TabsContent value="roadmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Roadmap d'Amélioration Continue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Timeline layout avec les différentes phases */}
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  
                  {['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'].map((quarter, index) => (
                    <div key={quarter} className="relative flex items-start space-x-4 pb-8">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900">{quarter}</h4>
                        <div className="mt-2 space-y-2">
                          {/* Exemple d'actions planifiées par trimestre */}
                          <div className="bg-blue-50 p-3 rounded">
                            <p className="font-medium text-blue-900">Objectifs Prioritaires</p>
                            <ul className="text-sm text-blue-800 mt-1 space-y-1">
                              <li>• Finalisation révision opérationnelle</li>
                              <li>• Déploiement mesures prioritaires</li>
                              <li>• Amélioration KPIs de détection</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 