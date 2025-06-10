import React, { useState, useEffect } from 'react';
import {
  Shield, Database, Target, Users, Lock, AlertTriangle,
  TrendingUp, CheckCircle, BarChart, Activity, Bot, Brain,
  Download, Upload, RefreshCw, Sparkles, TestTube,
  Cpu, Zap, Network
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import AICoherenceIndicator from '@/components/ai/AICoherenceIndicator';
import AccessImportExport from '@/components/access/AccessImportExport';
import AgentMonitoringDashboard from '@/components/monitoring/AgentMonitoringDashboard';
import { Link } from 'react-router-dom';
import AIStatusPanel from '@/components/ai/AIStatusPanel';
import OrchestrationPanel from '@/components/orchestration/OrchestrationPanel';
import FeatureTestPanel from '@/components/testing/FeatureTestPanel';
import { Badge } from '@/components/ui/badge';

interface EbiosGlobalDashboardProps {
  missionId: string;
  missionName: string;
  className?: string;
}

interface WorkshopStats {
  workshop: number;
  name: string;
  icon: React.ElementType;
  progress: number;
  itemsCount: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'validated';
  lastUpdate?: string;
  coherenceScore?: number;
  aiRecommendations?: {
    priority: 'high' | 'medium' | 'low';
    category: string;
    text: string;
    workshop: number;
  }[];
}

const EbiosGlobalDashboard: React.FC<EbiosGlobalDashboardProps> = ({
  missionId,
  missionName,
  className
}) => {
  const [showAccessPanel, setShowAccessPanel] = useState(false);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<'workshops' | 'ai-status' | 'orchestration' | 'agents' | 'recommendations'>('workshops');
  const [workshopStats, setWorkshopStats] = useState<WorkshopStats[]>([
    {
      workshop: 1,
      name: 'Cadrage et socle',
      icon: Shield,
      progress: 0,
      itemsCount: 0,
      status: 'not_started'
    },
    {
      workshop: 2,
      name: 'Sources de risque',
      icon: Target,
      progress: 0,
      itemsCount: 0,
      status: 'not_started'
    },
    {
      workshop: 3,
      name: 'Scénarios stratégiques',
      icon: Users,
      progress: 0,
      itemsCount: 0,
      status: 'not_started'
    },
    {
      workshop: 4,
      name: 'Scénarios opérationnels',
      icon: Activity,
      progress: 0,
      itemsCount: 0,
      status: 'not_started'
    },
    {
      workshop: 5,
      name: 'Traitement du risque',
      icon: Lock,
      progress: 0,
      itemsCount: 0,
      status: 'not_started'
    }
  ]);

  const [globalStats, setGlobalStats] = useState({
    totalProgress: 0,
    criticalIssues: 0,
    recommendations: 0,
    lastSync: new Date().toISOString()
  });

  useEffect(() => {
    // TODO: Charger les statistiques réelles depuis Firebase
    loadWorkshopStats();
  }, [missionId]);

  const loadWorkshopStats = async () => {
    // Simulation pour l'instant
    setWorkshopStats([
      {
        workshop: 1,
        name: 'Cadrage et socle',
        icon: Shield,
        progress: 85,
        itemsCount: 12,
        status: 'completed',
        lastUpdate: new Date().toISOString(),
        coherenceScore: 0.92,
        aiRecommendations: [
          {
            priority: 'high',
            category: 'Sécurité',
            text: 'Prioriser les mesures de sécurité',
            workshop: 1
          },
          {
            priority: 'medium',
            category: 'Régulation',
            text: 'Vérifier la cohérence inter-ateliers',
            workshop: 2
          },
          {
            priority: 'low',
            category: 'Régulation',
            text: 'Compléter l\'atelier 3 - Scénarios stratégiques',
            workshop: 3
          }
        ]
      },
      {
        workshop: 2,
        name: 'Sources de risque',
        icon: Target,
        progress: 70,
        itemsCount: 8,
        status: 'in_progress',
        lastUpdate: new Date().toISOString(),
        coherenceScore: 0.78,
        aiRecommendations: [
          {
            priority: 'medium',
            category: 'Régulation',
            text: 'Vérifier la cohérence inter-ateliers',
            workshop: 2
          }
        ]
      },
      {
        workshop: 3,
        name: 'Scénarios stratégiques',
        icon: Users,
        progress: 45,
        itemsCount: 15,
        status: 'in_progress',
        lastUpdate: new Date().toISOString(),
        coherenceScore: 0.65,
        aiRecommendations: [
          {
            priority: 'low',
            category: 'Régulation',
            text: 'Compléter l\'atelier 3 - Scénarios stratégiques',
            workshop: 3
          }
        ]
      },
      {
        workshop: 4,
        name: 'Scénarios opérationnels',
        icon: Activity,
        progress: 20,
        itemsCount: 5,
        status: 'in_progress',
        lastUpdate: new Date().toISOString(),
        coherenceScore: 0.42,
        aiRecommendations: [
          {
            priority: 'medium',
            category: 'Régulation',
            text: 'Vérifier la cohérence inter-ateliers',
            workshop: 4
          }
        ]
      },
      {
        workshop: 5,
        name: 'Traitement du risque',
        icon: Lock,
        progress: 10,
        itemsCount: 3,
        status: 'not_started',
        lastUpdate: new Date().toISOString(),
        coherenceScore: 0.25,
        aiRecommendations: [
          {
            priority: 'high',
            category: 'Sécurité',
            text: 'Prioriser les mesures de sécurité',
            workshop: 5
          }
        ]
      }
    ]);

    // Calculer les stats globales
    const avgProgress = 46; // Moyenne des progrès
    setGlobalStats({
      totalProgress: avgProgress,
      criticalIssues: 3,
      recommendations: 7,
      lastSync: new Date().toISOString()
    });
  };

  const getStatusColor = (status: WorkshopStats['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'validated': return 'text-blue-600 bg-blue-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* En-tête avec indicateur de cohérence global */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Bot className="h-8 w-8 text-blue-600" />
              Tableau de bord IA EBIOS RM
            </h1>
            <p className="mt-1 text-gray-600">
              Mission : {missionName}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Sparkles className="h-3 w-3 mr-1" />
                Analyse IA en temps réel
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Conforme ANSSI
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Indicateur de cohérence global */}
            <AICoherenceIndicator
              missionId={missionId}
              workshop="global"
              size="lg"
              autoRefresh={true}
              refreshInterval={300000} // 5 minutes
            />
            
            {/* Boutons d'action */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAccessPanel(!showAccessPanel)}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Access
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTestPanel(true)}
              className="flex items-center gap-2 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
            >
              <TestTube className="h-4 w-4" />
              Tests
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={loadWorkshopStats}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Statistiques globales */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progression globale</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {globalStats.totalProgress}%
                </p>
              </div>
              <BarChart className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Problèmes critiques</p>
                <p className="mt-1 text-2xl font-semibold text-red-900">
                  {globalStats.criticalIssues}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Recommandations IA</p>
                <p className="mt-1 text-2xl font-semibold text-blue-900">
                  {globalStats.recommendations}
                </p>
              </div>
              <Bot className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Dernière synchro</p>
                <p className="mt-1 text-sm font-medium text-green-900">
                  {new Date(globalStats.lastSync).toLocaleTimeString('fr-FR')}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 🆕 ONGLETS NAVIGATION */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('workshops')}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'workshops'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <Shield className="h-4 w-4 inline mr-2" />
              Ateliers EBIOS RM
            </button>

            <button
              onClick={() => setActiveTab('ai-status')}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'ai-status'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <Brain className="h-4 w-4 inline mr-2" />
              État de l'IA
              <Badge variant="secondary" className="ml-2 text-xs">
                Nouveau
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab('orchestration')}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'orchestration'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <Network className="h-4 w-4 inline mr-2" />
              Orchestration
              <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700 border-purple-200 text-xs">
                A2A + MCP
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab('agents')}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'agents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <Bot className="h-4 w-4 inline mr-2" />
              Monitoring Agents IA
              <Badge variant="secondary" className="ml-2 text-xs">
                Nouveau
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab('recommendations')}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'recommendations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <Sparkles className="h-4 w-4 inline mr-2" />
              Recommandations IA
            </button>
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {activeTab === 'workshops' && (
            <div className="space-y-6">
              {/* Grille des ateliers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workshopStats.map((workshop) => {
                  const Icon = workshop.icon;

                  return (
                    <Card key={workshop.workshop} className="relative overflow-hidden">
                      {/* Badge de statut */}
                      <div className="absolute top-4 right-4">
                        <span className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          getStatusColor(workshop.status)
                        )}>
                          {workshop.status === 'completed' && 'Terminé'}
                          {workshop.status === 'validated' && 'Validé'}
                          {workshop.status === 'in_progress' && 'En cours'}
                          {workshop.status === 'not_started' && 'À faire'}
                        </span>
                      </div>

                      <div className="p-6">
                        {/* En-tête de l'atelier */}
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            'p-3 rounded-lg',
                            workshop.status === 'completed' ? 'bg-green-100' :
                            workshop.status === 'in_progress' ? 'bg-yellow-100' :
                            'bg-gray-100'
                          )}>
                            <Icon className={cn(
                              'h-6 w-6',
                              workshop.status === 'completed' ? 'text-green-600' :
                              workshop.status === 'in_progress' ? 'text-yellow-600' :
                              'text-gray-600'
                            )} />
                          </div>

                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              Atelier {workshop.workshop}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600">
                              {workshop.name}
                            </p>
                          </div>
                        </div>

                        {/* Indicateur de cohérence */}
                        <div className="mt-4">
                          <AICoherenceIndicator
                            missionId={missionId}
                            workshop={workshop.workshop as 1 | 2 | 3 | 4 | 5}
                            size="sm"
                            showDetails={false}
                            className="w-full"
                          />
                        </div>

                        {/* Barre de progression */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progression</span>
                            <span className="font-medium">{workshop.progress}%</span>
                          </div>
                          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={cn('h-full transition-all duration-500', getProgressColor(workshop.progress))}
                              style={{ width: `${workshop.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Statistiques */}
                        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                          <span>{workshop.itemsCount} éléments</span>
                          {workshop.lastUpdate && (
                            <span>
                              Mis à jour {new Date(workshop.lastUpdate).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>

                        {/* Lien vers l'atelier */}
                        <div className="mt-4">
                          <Link
                            to={`/workshops/${missionId}/${workshop.workshop}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            Accéder à l'atelier →
                          </Link>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'ai-status' && (
            <div>
              <AIStatusPanel missionId={missionId} />
            </div>
          )}

          {activeTab === 'orchestration' && (
            <div>
              <OrchestrationPanel missionId={missionId} />
            </div>
          )}

          {activeTab === 'agents' && (
            <div>
              <AgentMonitoringDashboard />
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              {/* Section des recommandations globales */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h2 className="text-lg font-medium text-gray-900">
                    Recommandations IA globales
                  </h2>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Bot className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-blue-900 font-medium">
                        Compléter l'atelier 3 - Scénarios stratégiques
                      </p>
                      <p className="mt-1 text-sm text-blue-700">
                        Le taux de complétude est inférieur à 50%. Identifiez les chemins d'attaque manquants.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Bot className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-yellow-900 font-medium">
                        Vérifier la cohérence inter-ateliers
                      </p>
                      <p className="mt-1 text-sm text-yellow-700">
                        Certaines sources de risque n'ont pas de scénarios associés.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <Bot className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-green-900 font-medium">
                        Prioriser les mesures de sécurité
                      </p>
                      <p className="mt-1 text-sm text-green-700">
                        L'IA suggère de commencer par les mesures à fort impact et faible coût.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recommandations IA détaillées */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                    Recommandations IA prioritaires
                  </h3>
                  <Badge variant="secondary">
                    {workshopStats.reduce((acc, w) => acc + (w.aiRecommendations?.length || 0), 0)} suggestions
                  </Badge>
                </div>

                <div className="space-y-3">
                  {workshopStats
                    .flatMap(w => (w.aiRecommendations || []).map(rec => ({ ...rec, workshop: w.workshop })))
                    .sort((a, b) => (b.priority === 'high' ? -1 : a.priority === 'high' ? 1 : 0))
                    .slice(0, 5)
                    .map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`
                          flex-shrink-0 w-2 h-2 rounded-full mt-2
                          ${rec.priority === 'high' ? 'bg-red-500' : rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}
                        `} />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="secondary" className="text-xs">Atelier {rec.workshop}</Badge>
                            <span className="text-xs text-gray-500">{rec.category}</span>
                          </div>
                          <p className="text-sm text-gray-700">{rec.text}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Panel Import/Export Access */}
      {showAccessPanel && (
        <div className="animate-in slide-in-from-top">
          <AccessImportExport
            missionId={missionId}
            onImportComplete={(result) => {
              console.log('Import terminé:', result);
              loadWorkshopStats();
              setShowAccessPanel(false);
            }}
            onExportComplete={(result) => {
              console.log('Export terminé:', result);
            }}
          />
        </div>
      )}



      {/* Panel de test des nouvelles fonctionnalités */}
      <FeatureTestPanel
        isOpen={showTestPanel}
        onClose={() => setShowTestPanel(false)}
      />
    </div>
  );
};

export default EbiosGlobalDashboard; 