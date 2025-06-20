/**
 * 🔗 VISUALISEUR INTÉGRATION A3+A4 → A5
 * Interface pour visualiser l'exploitation des livrables A3+A4 dans l'Atelier 5
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  Target,
  Shield,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Settings,
  Activity,
  FileText,
  Layers,
  Eye,
  Zap,
  AlertTriangle,
  BarChart3,
  Users,
  Clock
} from 'lucide-react';
import Workshop3And4Integration, {
  TreatmentRecommendation,
  BudgetAllocation,
  SecurityMeasureRecommendation
} from '../../domain/workshop5/Workshop3And4Integration';

// 🎯 PROPS DU COMPOSANT
interface Workshop3And4IntegrationViewerProps {
  onNavigateToWorkshop?: (workshopId: number) => void;
}

export const Workshop3And4IntegrationViewer: React.FC<Workshop3And4IntegrationViewerProps> = ({
  onNavigateToWorkshop
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'transformation' | 'recommendations' | 'budget' | 'validation'>('overview');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // 📊 DONNÉES
  const workshop3Data = Workshop3And4Integration.getWorkshop3Data();
  const workshop4Data = Workshop3And4Integration.getWorkshop4Data();
  const recommendations = Workshop3And4Integration.generateTreatmentRecommendations();
  const budgetAllocation = Workshop3And4Integration.generateBudgetAllocation();
  const validation = Workshop3And4Integration.validateIntegration();

  // 🎯 VUE D'ENSEMBLE
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Métriques d'intégration */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{validation.scenariosProcessed}</div>
          <div className="text-sm text-blue-700">Scénarios A3</div>
          <div className="text-xs text-blue-600">Traités</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">{validation.operationalModesLinked}</div>
          <div className="text-sm text-purple-700">Modes A4</div>
          <div className="text-xs text-purple-600">Liés</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 text-center">
          <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{validation.recommendationsGenerated}</div>
          <div className="text-sm text-green-700">Recommandations A5</div>
          <div className="text-xs text-green-600">Générées</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-900">{(validation.totalBudgetAllocated / 1000000).toFixed(1)}M€</div>
          <div className="text-sm text-orange-700">Budget alloué</div>
          <div className="text-xs text-orange-600">ROI {validation.averageROI.toFixed(1)}x</div>
        </div>
      </div>

      {/* Flux de transformation A3+A4 → A5 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-6">🔗 Flux de transformation A3+A4 → A5</h3>

        <div className="space-y-6">
          {workshop3Data.strategicScenarios.map((scenario, index) => {
            const operationalMode = workshop4Data.operationalModes.find(
              mode => mode.strategicScenarioId === scenario.id
            );
            const recommendation = recommendations.find(
              rec => rec.strategicScenarioId === scenario.id
            );

            if (!operationalMode || !recommendation) return null;

            return (
              <div key={scenario.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Transformation {index + 1}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    scenario.riskLevel === 'CRITIQUE' ? 'bg-red-100 text-red-700' :
                    scenario.riskLevel === 'ÉLEVÉ' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {scenario.riskLevel}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Données A3 */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h5 className="font-medium text-blue-900">Données A3</h5>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-blue-800">Scénario:</span>
                        <div className="text-blue-700">{scenario.name}</div>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Source:</span>
                        <div className="text-blue-700">{scenario.source.name}</div>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Bien:</span>
                        <div className="text-blue-700">{scenario.asset.name}</div>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Événement:</span>
                        <div className="text-blue-700">{scenario.event.name}</div>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Évaluation:</span>
                        <div className="text-blue-700">V{scenario.likelihood} × I{scenario.impact}</div>
                      </div>
                    </div>
                  </div>

                  {/* Données A4 */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Settings className="w-5 h-5 text-purple-600" />
                      <h5 className="font-medium text-purple-900">Données A4</h5>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-purple-800">Mode:</span>
                        <div className="text-purple-700">{operationalMode.name}</div>
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">Complexité:</span>
                        <div className="text-purple-700">{operationalMode.complexity}/10</div>
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">Gravité:</span>
                        <div className="text-purple-700">{operationalMode.gravityLevel}/4</div>
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">Techniques:</span>
                        <div className="text-purple-700">{operationalMode.techniques.length} MITRE</div>
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">Dommages:</span>
                        <div className="text-purple-700">{(operationalMode.estimatedDamage / 1000000).toFixed(1)}M€</div>
                      </div>
                    </div>
                  </div>

                  {/* Flèche */}
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>

                  {/* Recommandations A5 */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <h5 className="font-medium text-green-900">Recommandations A5</h5>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-green-800">Stratégie:</span>
                        <div className="text-green-700 capitalize">{recommendation.strategy}</div>
                      </div>
                      <div>
                        <span className="font-medium text-green-800">Mesures:</span>
                        <div className="text-green-700">{recommendation.measures.length} mesures</div>
                      </div>
                      <div>
                        <span className="font-medium text-green-800">Coût total:</span>
                        <div className="text-green-700">{(recommendation.totalCost / 1000).toFixed(0)}k€</div>
                      </div>
                      <div>
                        <span className="font-medium text-green-800">ROI:</span>
                        <div className="text-green-700">{recommendation.expectedROI.toFixed(1)}x</div>
                      </div>
                      <div>
                        <span className="font-medium text-green-800">Réduction:</span>
                        <div className="text-green-700">{recommendation.riskReduction}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h6 className="font-medium text-gray-900 mb-1">🎯 Justification de la transformation :</h6>
                  <p className="text-sm text-gray-700">{recommendation.justification}</p>
                </div>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setSelectedScenario(scenario.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Voir détails transformation
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Allocation budgétaire */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">💰 Allocation budgétaire automatique</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Répartition par niveau de risque</h4>
            <div className="space-y-3">
              {budgetAllocation.allocationByRisk.map((allocation, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{allocation.riskLevel} ({allocation.percentage}%)</span>
                    <span className="font-medium">{(allocation.budget / 1000).toFixed(0)}k€</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        allocation.riskLevel === 'CRITIQUE' ? 'bg-red-600' : 'bg-orange-600'
                      }`}
                      style={{ width: `${allocation.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{allocation.justification}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">Répartition par catégorie</h4>
            <div className="space-y-3">
              {budgetAllocation.allocationByCategory.map((allocation, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{allocation.category} ({allocation.percentage}%)</span>
                    <span className="font-medium">{(allocation.budget / 1000).toFixed(0)}k€</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        allocation.category === 'Prévention' ? 'bg-blue-600' :
                        allocation.category === 'Détection' ? 'bg-purple-600' :
                        allocation.category === 'Réponse' ? 'bg-orange-600' :
                        'bg-green-600'
                      }`}
                      style={{ width: `${allocation.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {allocation.measures.length} mesure(s): {allocation.measures.slice(0, 2).join(', ')}
                    {allocation.measures.length > 2 && '...'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">📊 Analyse ROI globale</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-green-700">Investissement total</div>
              <div className="font-bold text-green-900">{(budgetAllocation.roiAnalysis.totalInvestment / 1000000).toFixed(1)}M€</div>
            </div>
            <div>
              <div className="text-green-700">Dommages évités</div>
              <div className="font-bold text-green-900">{(budgetAllocation.roiAnalysis.totalDamagesPrevented / 1000000).toFixed(1)}M€</div>
            </div>
            <div>
              <div className="text-green-700">ROI global</div>
              <div className="font-bold text-green-900">{budgetAllocation.roiAnalysis.globalROI.toFixed(1)}x</div>
            </div>
            <div>
              <div className="text-green-700">Période de retour</div>
              <div className="font-bold text-green-900">{budgetAllocation.roiAnalysis.paybackPeriod}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Validation de l'intégration */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">✅ Validation de l'intégration A3+A4 → A5</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Scénarios traités: {validation.scenariosProcessed}/2</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Modes liés: {validation.operationalModesLinked}/2</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Recommandations: {validation.recommendationsGenerated}</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Budget: {(validation.totalBudgetAllocated / 1000000).toFixed(1)}M€</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">ROI moyen: {validation.averageROI.toFixed(1)}x</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Recommandations d'intégration:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {validation.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🔗 Intégration A3+A4 → A5
        </h1>
        <p className="text-gray-600">
          Exploitation systématique des livrables A3+A4 pour générer automatiquement les recommandations de traitement A5
        </p>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex border-b overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Vue d\'ensemble', icon: Target },
            { id: 'transformation', label: '🔄 Transformation', icon: ArrowRight },
            { id: 'recommendations', label: '🛡️ Recommandations', icon: Shield },
            { id: 'budget', label: '💰 Budget', icon: DollarSign },
            { id: 'validation', label: '✅ Validation', icon: CheckCircle }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeView === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu */}
      <div>
        {activeView === 'overview' && renderOverview()}
        {/* Autres vues à implémenter */}
      </div>
    </div>
  );
};

export default Workshop3And4IntegrationViewer;