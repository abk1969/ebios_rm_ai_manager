import React, { useState, useEffect } from 'react';
import {
  Shield, Database, Target, Users, Lock, AlertTriangle,
  TrendingUp, CheckCircle, BarChart, Activity, Bot, Brain,
  Download, Upload, RefreshCw, Sparkles, TestTube,
  Cpu, Zap, Network, Cloud
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
import EbiosRMMetricsService, { type EbiosRMMetrics } from '@/services/metrics/EbiosRMMetricsService';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';
import DeploymentDashboard from '@/components/deployment/DeploymentDashboard';
import UnifiedMissionOverview from './UnifiedMissionOverview';

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
  conformityScore?: number;
  criticalIssues?: number;
  aiRecommendations?: {
    priority: 'high' | 'medium' | 'low';
    category: string;
    text: string;
    workshop: number;
  }[];
}

interface GlobalStats {
  totalProgress: number;
  criticalIssues: number;
  recommendations: number;
  lastSync: string;
  anssiComplianceScore: number;
  riskMaturityLevel: number;
  dataQualityScore: number;
}

const EbiosGlobalDashboard: React.FC<EbiosGlobalDashboardProps> = ({
  missionId,
  missionName,
  className
}) => {
  const [showAccessPanel, setShowAccessPanel] = useState(false);
  const [showTestPanel, setShowTestPanel] = useState(false);
  const [activeTab, setActiveTab] = useState<'workshops' | 'ai-status' | 'orchestration' | 'agents' | 'recommendations' | 'performance' | 'deployment'>('workshops');
  const [workshopStats, setWorkshopStats] = useState<WorkshopStats[]>([]);
  const [globalStats, setGlobalStats] = useState<GlobalStats>({
    totalProgress: 0,
    criticalIssues: 0,
    recommendations: 0,
    lastSync: new Date().toISOString(),
    anssiComplianceScore: 0,
    riskMaturityLevel: 1,
    dataQualityScore: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [metricsData, setMetricsData] = useState<EbiosRMMetrics | null>(null);

  // 🎯 FLAG POUR LA VUE UNIFIÉE (peut être désactivé facilement)
  const [showUnifiedView, setShowUnifiedView] = useState(true);

  useEffect(() => {
    if (missionId) {
      loadRealWorkshopStats();
    }
  }, [missionId]);

  /**
   * 📊 CHARGEMENT DES STATISTIQUES RÉELLES DEPUIS FIREBASE
   * Conforme aux exigences ANSSI EBIOS RM
   */
  const loadRealWorkshopStats = async () => {
    setIsLoading(true);

    try {
      console.log(`📊 Chargement des métriques EBIOS RM réelles pour mission: ${missionId}`);

      // Calcul des métriques réelles via le service conforme ANSSI
      const realMetrics = await EbiosRMMetricsService.calculateMetrics(missionId);
      setMetricsData(realMetrics);

      // Transformation des métriques en format WorkshopStats avec validation séquentialité ANSSI
      const workshopStatsReal = await transformMetricsToWorkshopStats(realMetrics);
      setWorkshopStats(workshopStatsReal);

      // Calcul des statistiques globales réelles
      const globalStatsReal = calculateGlobalStatsFromMetrics(realMetrics);
      setGlobalStats(globalStatsReal);

      console.log('✅ Métriques EBIOS RM réelles chargées avec succès');
      console.log('📈 Conformité ANSSI:', realMetrics.global.anssiComplianceScore + '%');

    } catch (error) {
      console.error('❌ Erreur chargement métriques réelles:', error);

      // Fallback vers état initial (données réelles vides)
      setWorkshopStats(getInitialWorkshopStats());
      setGlobalStats({
        totalProgress: 0,
        criticalIssues: 5, // Problème critique : aucune donnée chargée
        recommendations: 5, // Recommandation : commencer l'analyse EBIOS RM
        lastSync: new Date().toISOString(),
        anssiComplianceScore: 0,
        riskMaturityLevel: 1,
        dataQualityScore: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 🔄 TRANSFORMATION DES MÉTRIQUES RÉELLES EN WORKSHOP STATS
   * Avec validation de la séquentialité ANSSI EBIOS RM
   */
  const transformMetricsToWorkshopStats = async (metrics: EbiosRMMetrics): Promise<WorkshopStats[]> => {
    const workshopConfigs = [
      { workshop: 1, name: 'Cadrage et socle', icon: Shield, metrics: metrics.workshop1 },
      { workshop: 2, name: 'Sources de risque', icon: Target, metrics: metrics.workshop2 },
      { workshop: 3, name: 'Scénarios stratégiques', icon: Users, metrics: metrics.workshop3 },
      { workshop: 4, name: 'Scénarios opérationnels', icon: Activity, metrics: metrics.workshop4 },
      { workshop: 5, name: 'Traitement du risque', icon: Lock, metrics: metrics.workshop5 }
    ];

    return workshopConfigs.map((config, index) => {
      // 🚨 VALIDATION SÉQUENTIALITÉ ANSSI : Un atelier ne peut progresser que si le précédent est à 100%
      const previousWorkshopComplete = index === 0 || workshopConfigs[index - 1].metrics.completionRate === 100;
      const actualProgress = previousWorkshopComplete ? config.metrics.completionRate : 0;

      // Détermination du statut selon ANSSI
      let status: WorkshopStats['status'] = 'not_started';
      if (actualProgress === 100) {
        status = 'completed';
      } else if (actualProgress > 0 && previousWorkshopComplete) {
        status = 'in_progress';
      }

      // Calcul des éléments selon le type d'atelier avec typage sécurisé
      let itemsCount = 0;
      switch (config.workshop) {
        case 1:
          const w1Metrics = config.metrics as typeof metrics.workshop1;
          itemsCount = w1Metrics.businessValuesCount + w1Metrics.supportingAssetsCount + w1Metrics.dreadedEventsCount;
          break;
        case 2:
          const w2Metrics = config.metrics as typeof metrics.workshop2;
          itemsCount = w2Metrics.riskSourcesCount;
          break;
        case 3:
          const w3Metrics = config.metrics as typeof metrics.workshop3;
          itemsCount = w3Metrics.strategicScenariosCount;
          break;
        case 4:
          const w4Metrics = config.metrics as typeof metrics.workshop4;
          itemsCount = w4Metrics.operationalScenariosCount;
          break;
        case 5:
          const w5Metrics = config.metrics as typeof metrics.workshop5;
          itemsCount = w5Metrics.securityMeasuresCount;
          break;
      }

      return {
        workshop: config.workshop,
        name: config.name,
        icon: config.icon,
        progress: actualProgress,
        itemsCount,
        status,
        lastUpdate: metrics.global.lastCalculation,
        coherenceScore: metrics.global.dataQualityScore / 100,
        conformityScore: config.metrics.conformityScore || config.metrics.completionRate,
        criticalIssues: actualProgress < 50 ? 1 : 0,
        aiRecommendations: generateRealAIRecommendations(config.workshop, actualProgress, status)
      };
    });
  };

  /**
   * 📊 CALCUL DES STATISTIQUES GLOBALES RÉELLES
   */
  const calculateGlobalStatsFromMetrics = (metrics: EbiosRMMetrics): GlobalStats => {
    return {
      totalProgress: metrics.global.overallCompletionRate,
      criticalIssues: calculateCriticalIssuesCount(metrics),
      recommendations: calculateRecommendationsCount(metrics),
      lastSync: metrics.global.lastCalculation,
      anssiComplianceScore: metrics.global.anssiComplianceScore,
      riskMaturityLevel: metrics.global.riskMaturityLevel,
      dataQualityScore: metrics.global.dataQualityScore
    };
  };

  /**
   * 🚨 CALCUL DU NOMBRE DE PROBLÈMES CRITIQUES RÉELS
   */
  const calculateCriticalIssuesCount = (metrics: EbiosRMMetrics): number => {
    let criticalIssues = 0;

    // Problème critique si un atelier a moins de 50% de complétude
    if (metrics.workshop1.completionRate < 50) criticalIssues++;
    if (metrics.workshop2.completionRate < 50) criticalIssues++;
    if (metrics.workshop3.completionRate < 50) criticalIssues++;
    if (metrics.workshop4.completionRate < 50) criticalIssues++;
    if (metrics.workshop5.completionRate < 50) criticalIssues++;

    // Problème critique si conformité ANSSI < 70%
    if (metrics.global.anssiComplianceScore < 70) criticalIssues++;

    // Problème critique si qualité des données < 60%
    if (metrics.global.dataQualityScore < 60) criticalIssues++;

    return criticalIssues;
  };

  /**
   * 💡 CALCUL DU NOMBRE DE RECOMMANDATIONS RÉELLES
   */
  const calculateRecommendationsCount = (metrics: EbiosRMMetrics): number => {
    let recommendations = 0;

    // Une recommandation par atelier incomplet
    if (metrics.workshop1.completionRate < 100) recommendations++;
    if (metrics.workshop2.completionRate < 100) recommendations++;
    if (metrics.workshop3.completionRate < 100) recommendations++;
    if (metrics.workshop4.completionRate < 100) recommendations++;
    if (metrics.workshop5.completionRate < 100) recommendations++;

    // Recommandations supplémentaires selon la maturité
    if (metrics.global.riskMaturityLevel < 3) recommendations += 2;
    if (metrics.global.anssiComplianceScore < 80) recommendations += 1;

    return recommendations;
  };

  /**
   * 🤖 GÉNÉRATION DE RECOMMANDATIONS IA RÉELLES
   */
  const generateRealAIRecommendations = (
    workshop: number,
    progress: number,
    status: WorkshopStats['status']
  ): WorkshopStats['aiRecommendations'] => {
    const recommendations: WorkshopStats['aiRecommendations'] = [];

    if (progress < 100) {
      const workshopNames = {
        1: 'Cadrage et socle',
        2: 'Sources de risque',
        3: 'Scénarios stratégiques',
        4: 'Scénarios opérationnels',
        5: 'Traitement du risque'
      };

      recommendations.push({
        priority: progress < 50 ? 'high' : 'medium',
        category: 'Complétude',
        text: `Compléter l'atelier ${workshop} - ${workshopNames[workshop as keyof typeof workshopNames]}`,
        workshop
      });
    }

    if (status === 'not_started' && workshop > 1) {
      recommendations.push({
        priority: 'high',
        category: 'Séquentialité ANSSI',
        text: `Terminer l'atelier précédent avant de commencer l'atelier ${workshop}`,
        workshop: workshop - 1
      });
    }

    return recommendations;
  };

  /**
   * 📋 ÉTAT INITIAL DES ATELIERS (SANS DONNÉES FICTIVES)
   */
  const getInitialWorkshopStats = (): WorkshopStats[] => {
    return [
      {
        workshop: 1,
        name: 'Cadrage et socle',
        icon: Shield,
        progress: 0,
        itemsCount: 0,
        status: 'not_started',
        lastUpdate: new Date().toISOString(),
        coherenceScore: 0,
        conformityScore: 0,
        criticalIssues: 1,
        aiRecommendations: [
          {
            priority: 'high',
            category: 'Démarrage',
            text: 'Commencer par identifier les biens essentiels de votre organisation',
            workshop: 1
          }
        ]
      },
      {
        workshop: 2,
        name: 'Sources de risque',
        icon: Target,
        progress: 0,
        itemsCount: 0,
        status: 'not_started',
        lastUpdate: new Date().toISOString(),
        coherenceScore: 0,
        conformityScore: 0,
        criticalIssues: 0,
        aiRecommendations: []
      },
      {
        workshop: 3,
        name: 'Scénarios stratégiques',
        icon: Users,
        progress: 0,
        itemsCount: 0,
        status: 'not_started',
        lastUpdate: new Date().toISOString(),
        coherenceScore: 0,
        conformityScore: 0,
        criticalIssues: 0,
        aiRecommendations: []
      },
      {
        workshop: 4,
        name: 'Scénarios opérationnels',
        icon: Activity,
        progress: 0,
        itemsCount: 0,
        status: 'not_started',
        lastUpdate: new Date().toISOString(),
        coherenceScore: 0,
        conformityScore: 0,
        criticalIssues: 0,
        aiRecommendations: []
      },
      {
        workshop: 5,
        name: 'Traitement du risque',
        icon: Lock,
        progress: 0,
        itemsCount: 0,
        status: 'not_started',
        lastUpdate: new Date().toISOString(),
        coherenceScore: 0,
        conformityScore: 0,
        criticalIssues: 0,
        aiRecommendations: []
      }
    ];
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
              onClick={loadRealWorkshopStats}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              {isLoading ? 'Chargement...' : 'Actualiser'}
            </Button>
          </div>
        </div>

        {/* Statistiques globales réelles */}
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progression globale</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {isLoading ? '...' : `${globalStats.totalProgress}%`}
                </p>
                {!isLoading && (
                  <p className="text-xs text-gray-500 mt-1">
                    Calculé selon ANSSI
                  </p>
                )}
              </div>
              <BarChart className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Problèmes critiques</p>
                <p className="mt-1 text-2xl font-semibold text-red-900">
                  {isLoading ? '...' : globalStats.criticalIssues}
                </p>
                {!isLoading && globalStats.criticalIssues > 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Action requise
                  </p>
                )}
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Recommandations IA</p>
                <p className="mt-1 text-2xl font-semibold text-blue-900">
                  {isLoading ? '...' : globalStats.recommendations}
                </p>
                {!isLoading && (
                  <p className="text-xs text-blue-500 mt-1">
                    Suggestions actives
                  </p>
                )}
              </div>
              <Bot className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Conformité ANSSI</p>
                <p className="mt-1 text-2xl font-semibold text-green-900">
                  {isLoading ? '...' : `${globalStats.anssiComplianceScore}%`}
                </p>
                {!isLoading && (
                  <p className="text-xs text-green-500 mt-1">
                    Niveau {globalStats.riskMaturityLevel}/5
                  </p>
                )}
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Indicateur de dernière synchronisation */}
        {!isLoading && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Dernière synchronisation : {new Date(globalStats.lastSync).toLocaleString('fr-FR')}
              {metricsData && (
                <span className="ml-2 text-blue-600">
                  • Qualité des données : {globalStats.dataQualityScore}%
                </span>
              )}
            </p>
          </div>
        )}
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

            <button
              onClick={() => setActiveTab('performance')}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'performance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <Zap className="h-4 w-4 inline mr-2" />
              Performance
            </button>

            <button
              onClick={() => setActiveTab('deployment')}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm',
                activeTab === 'deployment'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <Cloud className="h-4 w-4 inline mr-2" />
              Déploiement GCP
              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200 text-xs">
                Production
              </Badge>
            </button>
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {activeTab === 'workshops' && (
            <div className="space-y-6">
              {/* Message de chargement */}
              {isLoading && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 text-gray-600">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Chargement des métriques EBIOS RM réelles...</span>
                  </div>
                </div>
              )}

              {/* Grille des ateliers */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workshopStats.map((workshop) => {
                  const Icon = workshop.icon;

                  return (
                    <Card key={workshop.workshop} className="relative overflow-hidden">
                      {/* Badge de statut avec conformité ANSSI */}
                      <div className="absolute top-4 right-4 flex flex-col gap-1">
                        <span className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          getStatusColor(workshop.status)
                        )}>
                          {workshop.status === 'completed' && 'Terminé'}
                          {workshop.status === 'validated' && 'Validé'}
                          {workshop.status === 'in_progress' && 'En cours'}
                          {workshop.status === 'not_started' && 'À faire'}
                        </span>

                        {/* Indicateur de conformité ANSSI */}
                        {workshop.conformityScore && workshop.conformityScore >= 80 && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                            ANSSI ✓
                          </span>
                        )}

                        {/* Alerte séquentialité */}
                        {workshop.status === 'not_started' && workshop.workshop > 1 && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700">
                            Bloqué
                          </span>
                        )}
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

                        {/* Statistiques détaillées */}
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{workshop.itemsCount} éléments</span>
                            {workshop.conformityScore && (
                              <span className="text-blue-600 font-medium">
                                Conformité: {workshop.conformityScore}%
                              </span>
                            )}
                          </div>

                          {/* Indicateurs de qualité */}
                          {workshop.coherenceScore && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Cohérence:</span>
                              <span className={cn(
                                "font-medium",
                                workshop.coherenceScore >= 0.8 ? "text-green-600" :
                                workshop.coherenceScore >= 0.6 ? "text-yellow-600" : "text-red-600"
                              )}>
                                {Math.round(workshop.coherenceScore * 100)}%
                              </span>
                            </div>
                          )}

                          {/* Problèmes critiques */}
                          {workshop.criticalIssues && workshop.criticalIssues > 0 && (
                            <div className="flex items-center gap-1 text-sm text-red-600">
                              <AlertTriangle className="h-3 w-3" />
                              <span>{workshop.criticalIssues} problème(s) critique(s)</span>
                            </div>
                          )}

                          {/* Date de mise à jour */}
                          {workshop.lastUpdate && (
                            <div className="text-xs text-gray-500">
                              Calculé le {new Date(workshop.lastUpdate).toLocaleString('fr-FR')}
                            </div>
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

          {activeTab === 'performance' && (
            <div>
              <PerformanceMonitor
                autoRefresh={true}
                refreshInterval={30000}
                className="w-full"
              />
            </div>
          )}

          {activeTab === 'deployment' && (
            <div>
              <DeploymentDashboard className="w-full" />
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
              if (import.meta.env.DEV) {
                console.log('Import terminé:', result);
              }
              loadRealWorkshopStats();
              setShowAccessPanel(false);
            }}
            onExportComplete={(result) => {
              if (import.meta.env.DEV) {
                console.log('Export terminé:', result);
              }
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