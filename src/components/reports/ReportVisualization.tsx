import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Target,
  AlertTriangle,
  Shield,
  Users,
  Database,
  Filter,
  Download,
  Maximize2,
  Eye
} from 'lucide-react';
import { Mission, BusinessValue, SupportingAsset, RiskSource, DreadedEvent, StrategicScenario, SecurityMeasure } from '@/types/ebios';
import { EbiosUtils } from '@/lib/ebios-constants';

interface ReportVisualizationProps {
  mission: Mission;
  businessValues: BusinessValue[];
  supportingAssets: SupportingAsset[];
  riskSources: RiskSource[];
  dreadedEvents: DreadedEvent[];
  strategicScenarios: StrategicScenario[];
  securityMeasures: SecurityMeasure[];
}

const ReportVisualization: React.FC<ReportVisualizationProps> = ({
  mission,
  businessValues,
  supportingAssets,
  riskSources,
  dreadedEvents,
  strategicScenarios,
  securityMeasures
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'risks' | 'sources' | 'measures'>('overview');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Calculs des métriques
  const metrics = useMemo(() => {
    const riskDistribution = ['critical', 'high', 'medium', 'low'].map(level => ({
      level,
      count: strategicScenarios.filter(s => s.riskLevel === level).length,
      percentage: (strategicScenarios.filter(s => s.riskLevel === level).length / strategicScenarios.length) * 100 || 0
    }));

    const sourceCategories = riskSources.reduce((acc, source) => {
      acc[source.category] = (acc[source.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const assetTypes = supportingAssets.reduce((acc, asset) => {
      acc[asset.type] = (acc[asset.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const measureTypes = securityMeasures.reduce((acc, measure) => {
      const measureType = measure.type || 'preventive';
      acc[measureType] = (acc[measureType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      riskDistribution,
      sourceCategories,
      assetTypes,
      measureTypes,
      totalRisks: strategicScenarios.length,
      criticalRisks: riskDistribution.find(r => r.level === 'critical')?.count || 0,
      highRisks: riskDistribution.find(r => r.level === 'high')?.count || 0,
      mediumRisks: riskDistribution.find(r => r.level === 'medium')?.count || 0,
      lowRisks: riskDistribution.find(r => r.level === 'low')?.count || 0
    };
  }, [strategicScenarios, riskSources, supportingAssets, securityMeasures]);

  const getRiskColor = (level: string) => {
    const colors = {
      critical: '#ef4444',
      high: '#f97316', 
      medium: '#eab308',
      low: '#22c55e'
    };
    return colors[level as keyof typeof colors] || '#6b7280';
  };

  const getRiskLevelInfo = (level: string) => {
    return EbiosUtils.getRiskLevelInfo(level as any);
  };

  // Composant de graphique en barres simple
  const BarChart: React.FC<{ data: Array<{label: string, value: number, color?: string}>, title: string }> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-sm font-medium text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-20 text-xs text-gray-600 truncate">{item.label}</div>
              <div className="flex-1 relative">
                <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: item.color || '#3b82f6'
                    }}
                  />
                </div>
                <div className="absolute right-2 top-0 h-6 flex items-center">
                  <span className="text-xs font-medium text-gray-700">{item.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Composant de graphique en secteurs simple
  const PieChartSimple: React.FC<{ data: Array<{label: string, value: number, color: string}>, title: string }> = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-sm font-medium text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center space-x-4">
          {/* Graphique circulaire simple */}
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 42 42" className="w-24 h-24 transform -rotate-90">
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e5e7eb" strokeWidth="3" />
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const strokeDasharray = `${percentage} ${100 - percentage}`;
                const strokeDashoffset = data.slice(0, index).reduce((acc, prevItem) => acc - (prevItem.value / total) * 100, 0);
                
                return (
                  <circle
                    key={index}
                    cx="21"
                    cy="21"
                    r="15.915"
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="3"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
          </div>
          
          {/* Légende */}
          <div className="flex-1 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-600">{item.label}</span>
                <span className="text-xs font-medium text-gray-900">({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header avec métriques clés */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tableau de Bord EBIOS RM</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.totalRisks}</div>
            <div className="text-sm text-gray-600">Scénarios Totaux</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{metrics.criticalRisks}</div>
            <div className="text-sm text-gray-600">Risques Critiques</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{metrics.highRisks}</div>
            <div className="text-sm text-gray-600">Risques Élevés</div>
          </div>
          <div className="bg-white p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{securityMeasures.length}</div>
            <div className="text-sm text-gray-600">Mesures de Sécurité</div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
            { id: 'risks', label: 'Analyse des Risques', icon: AlertTriangle },
            { id: 'sources', label: 'Sources de Menace', icon: Users },
            { id: 'measures', label: 'Mesures de Sécurité', icon: Shield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PieChartSimple
              title="Répartition des Niveaux de Risque"
              data={metrics.riskDistribution.map(item => ({
                label: getRiskLevelInfo(item.level).label,
                value: item.count,
                color: getRiskColor(item.level)
              }))}
            />
            
            <BarChart
              title="Actifs par Type"
              data={Object.entries(metrics.assetTypes).map(([type, count]) => ({
                label: type,
                value: count,
                color: '#3b82f6'
              }))}
            />
            
            <BarChart
              title="Sources de Risque par Catégorie"
              data={Object.entries(metrics.sourceCategories).map(([category, count]) => ({
                label: category,
                value: count,
                color: '#8b5cf6'
              }))}
            />
            
            <BarChart
              title="Mesures de Sécurité par Type"
              data={Object.entries(metrics.measureTypes).map(([type, count]) => ({
                label: type,
                value: count,
                color: '#10b981'
              }))}
            />
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="space-y-6">
            {/* Matrice de risque textuelle */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Matrice de Risque ANSSI</h3>
              <div className="grid grid-cols-5 gap-2 text-xs">
                {/* Headers */}
                <div></div>
                <div className="text-center font-medium">Vraisemblance 1</div>
                <div className="text-center font-medium">Vraisemblance 2</div>
                <div className="text-center font-medium">Vraisemblance 3</div>
                <div className="text-center font-medium">Vraisemblance 4</div>
                
                {[4, 3, 2, 1].map(gravity => (
                  <React.Fragment key={gravity}>
                    <div className="font-medium">Gravité {gravity}</div>
                    {[1, 2, 3, 4].map(likelihood => {
                      const riskLevel = EbiosUtils.calculateRiskLevel(gravity as any, likelihood as any);
                      const scenariosInCell = strategicScenarios.filter(s => {
                        const event = dreadedEvents.find(de => de.id === s.dreadedEventId);
                        return event?.gravity === gravity && s.likelihood === likelihood;
                      });
                      
                      return (
                        <div
                          key={likelihood}
                          className={`p-2 rounded text-center text-white font-medium`}
                          style={{ backgroundColor: getRiskColor(typeof riskLevel === 'string' ? riskLevel : String(riskLevel)) }}
                        >
                          {scenariosInCell.length}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Top 5 des scénarios critiques */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Scénarios Prioritaires</h3>
              <div className="space-y-4">
                {strategicScenarios
                  .filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high')
                  .slice(0, 5)
                  .map((scenario, index) => {
                    const event = dreadedEvents.find(de => de.id === scenario.dreadedEventId);
                    const source = riskSources.find(rs => rs.id === scenario.riskSourceId);
                    
                    return (
                      <div key={scenario.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold`}
                               style={{ backgroundColor: getRiskColor(typeof scenario.riskLevel === 'string' ? scenario.riskLevel : String(scenario.riskLevel)) }}>
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{scenario.name}</div>
                          <div className="text-sm text-gray-600">
                            Source: {source?.name} • Événement: {event?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Gravité: {event?.gravity}/4 • Vraisemblance: {scenario.likelihood}/4
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`px-2 py-1 text-xs rounded-full text-white`}
                                style={{ backgroundColor: getRiskColor(typeof scenario.riskLevel === 'string' ? scenario.riskLevel : String(scenario.riskLevel)) }}>
                            {getRiskLevelInfo(typeof scenario.riskLevel === 'string' ? scenario.riskLevel : String(scenario.riskLevel)).label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Graphique des catégories */}
              <PieChartSimple
                title="Sources de Risque par Catégorie"
                data={Object.entries(metrics.sourceCategories).map(([category, count], index) => ({
                  label: category,
                  value: count,
                  color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280', '#ec4899'][index % 7]
                }))}
              />

              {/* Top sources par pertinence */}
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Sources les Plus Pertinentes</h3>
                <div className="space-y-3">
                  {riskSources
                    .sort((a, b) => b.pertinence - a.pertinence)
                    .slice(0, 5)
                    .map((source, index) => (
                      <div key={source.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{source.name}</div>
                          <div className="text-xs text-gray-500">{source.category}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(source.pertinence / 4) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600">{source.pertinence}/4</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Tableau détaillé des sources */}
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900">Analyse Détaillée des Sources</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Source
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catégorie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expertise
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ressources
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Motivation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pertinence
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {riskSources.map((source) => (
                      <tr key={source.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{source.name}</div>
                          <div className="text-sm text-gray-500">{source.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {source.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {source.expertise}/4
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {source.resources}/4
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {source.motivation}/4
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(source.pertinence / 4) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-900">{source.pertinence}/4</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'measures' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BarChart
                title="Mesures par Type"
                data={Object.entries(metrics.measureTypes).map(([type, count]) => ({
                  label: type,
                  value: count,
                  color: '#10b981'
                }))}
              />

              <div className="bg-white p-4 rounded-lg border">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Efficacité des Mesures</h3>
                <div className="space-y-3">
                  {securityMeasures
                    .sort((a, b) => b.effectiveness - a.effectiveness)
                    .slice(0, 5)
                    .map((measure, index) => (
                      <div key={measure.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{measure.name}</div>
                          <div className="text-xs text-gray-500">{measure.type}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${(measure.effectiveness / 4) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600">{measure.effectiveness}/4</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Actions recommandées */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Plan d'Action Recommandé</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <div className="text-sm font-medium text-red-800">Actions Prioritaires (0-3 mois)</div>
                  <div className="text-sm text-red-600">
                    {metrics.criticalRisks} scénarios critiques nécessitent une action immédiate
                  </div>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <div className="text-sm font-medium text-orange-800">Actions Court Terme (3-6 mois)</div>
                  <div className="text-sm text-orange-600">
                    {metrics.highRisks} scénarios à risque élevé à traiter
                  </div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <div className="text-sm font-medium text-green-800">Amélioration Continue</div>
                  <div className="text-sm text-green-600">
                    Surveillance et optimisation des {securityMeasures.length} mesures déployées
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportVisualization; 