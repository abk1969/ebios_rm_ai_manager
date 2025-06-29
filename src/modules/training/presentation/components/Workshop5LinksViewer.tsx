/**
 * 📤 VISUALISEUR LIENS ATELIER 4 → ATELIER 5
 * Interface pour visualiser la transmission des données techniques vers les mesures de traitement
 */

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Target, 
  Shield, 
  DollarSign,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Settings,
  Activity,
  FileText,
  Layers,
  Zap,
  Eye
} from 'lucide-react';
import Workshop5LinksGenerator, { 
  OperationalModeData, 
  TreatmentRecommendation, 
  BudgetAllocation,
  ImplementationPlan
} from '../../domain/workshop4/Workshop5LinksGenerator';

// 🎯 PROPS DU COMPOSANT
interface Workshop5LinksViewerProps {
  onNavigateToWorkshop?: (workshopId: number) => void;
}

export const Workshop5LinksViewer: React.FC<Workshop5LinksViewerProps> = ({
  onNavigateToWorkshop
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'recommendations' | 'budget' | 'implementation' | 'links'>('overview');
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  // 📊 DONNÉES
  const transmissionData = Workshop5LinksGenerator.getWorkshop5TransmissionData();
  const explicitLinks = Workshop5LinksGenerator.getExplicitLinksToWorkshop5();
  const validation = Workshop5LinksGenerator.validateWorkshop5Links();

  // 🎯 VUE D'ENSEMBLE
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Métriques de transmission */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <Settings className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{transmissionData.transmissionSummary.totalModes}</div>
          <div className="text-sm text-blue-700">Modes A4</div>
          <div className="text-xs text-blue-600">Analysés</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{transmissionData.transmissionSummary.totalRecommendations}</div>
          <div className="text-sm text-green-700">Mesures A5</div>
          <div className="text-xs text-green-600">Recommandées</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">{(transmissionData.transmissionSummary.totalBudget / 1000000).toFixed(1)}M€</div>
          <div className="text-sm text-purple-700">Budget A5</div>
          <div className="text-xs text-purple-600">Alloué</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-900">{transmissionData.transmissionSummary.averageROI.toFixed(1)}x</div>
          <div className="text-sm text-orange-700">ROI moyen</div>
          <div className="text-xs text-orange-600">Investissement</div>
        </div>
      </div>

      {/* Flux de transmission A4 → A5 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-6">📤 Flux de transmission A4 → A5</h3>
        
        <div className="space-y-6">
          {transmissionData.operationalModes.map((mode, index) => {
            const recommendations = transmissionData.treatmentRecommendations.filter(r => r.operationalModeId === mode.id);
            const budget = transmissionData.budgetAllocations.find(b => b.operationalModeId === mode.id);
            const plan = transmissionData.implementationPlans.find(p => p.operationalModeId === mode.id);
            
            return (
              <div key={mode.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Transmission {index + 1}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    mode.gravityLevel === 4 ? 'bg-red-100 text-red-700' :
                    mode.gravityLevel === 3 ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    Gravité {mode.gravityLevel}/4
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Mode opératoire A4 */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Settings className="w-5 h-5 text-blue-600" />
                      <h5 className="font-medium text-blue-900">Mode A4</h5>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-blue-800">Nom:</span>
                        <div className="text-blue-700">{mode.name}</div>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Complexité:</span>
                        <div className="text-blue-700">{mode.complexity}/10</div>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Techniques:</span>
                        <div className="text-blue-700">{mode.mitreMapping.length} MITRE</div>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">IOCs:</span>
                        <div className="text-blue-700">{mode.iocs.length} identifiés</div>
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
                      <h5 className="font-medium text-green-900">Mesures A5</h5>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-green-800">Recommandations:</span>
                        <div className="text-green-700">{recommendations.length} mesures</div>
                      </div>
                      <div>
                        <span className="font-medium text-green-800">Priorité 1:</span>
                        <div className="text-green-700">{recommendations.filter(r => r.priority === 1).length} critiques</div>
                      </div>
                      <div>
                        <span className="font-medium text-green-800">Budget:</span>
                        <div className="text-green-700">{budget ? (budget.totalBudget / 1000).toFixed(0) : 0}k€</div>
                      </div>
                      <div>
                        <span className="font-medium text-green-800">ROI:</span>
                        <div className="text-green-700">{budget ? budget.roi.toFixed(1) : 0}x</div>
                      </div>
                    </div>
                  </div>

                  {/* Plan d'implémentation */}
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <h5 className="font-medium text-purple-900">Plan A5</h5>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-purple-800">Durée:</span>
                        <div className="text-purple-700">{plan ? plan.totalDuration : 'N/A'}</div>
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">Phases:</span>
                        <div className="text-purple-700">{plan ? plan.phases.length : 0} étapes</div>
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">Dépendances:</span>
                        <div className="text-purple-700">{plan ? plan.dependencies.length : 0} items</div>
                      </div>
                      <div>
                        <span className="font-medium text-purple-800">Risques:</span>
                        <div className="text-purple-700">{plan ? plan.risks.length : 0} identifiés</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setSelectedMode(mode.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Voir détails transmission
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Liens explicites */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">🔗 Liens explicites A4 → A5</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {explicitLinks.slice(0, 4).map((link, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{link.linkType}</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span className="text-gray-700">{link.sourceElement}</span>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <span className="text-gray-700">{link.targetElement}</span>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-white rounded text-xs text-gray-600">
                {link.justification}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setActiveView('links')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Voir tous les liens ({explicitLinks.length})
          </button>
        </div>
      </div>

      {/* Validation */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">✅ Validation des liens A4 → A5</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Modes traités: {validation.operationalModesProcessed}/2</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Recommandations: {validation.treatmentRecommendations}</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Budget alloué: {(validation.totalBudgetAllocated / 1000000).toFixed(1)}M€</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">ROI moyen: {validation.averageROI.toFixed(1)}x</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Recommandations:</h4>
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
          📤 Liens Atelier 4 → Atelier 5
        </h1>
        <p className="text-gray-600">
          Transmission des données techniques vers les mesures de traitement et plans d'implémentation
        </p>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex border-b overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Vue d\'ensemble', icon: Target },
            { id: 'recommendations', label: '🛡️ Recommandations', icon: Shield },
            { id: 'budget', label: '💰 Budget', icon: DollarSign },
            { id: 'implementation', label: '📅 Implémentation', icon: Calendar },
            { id: 'links', label: '🔗 Liens explicites', icon: ArrowRight }
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

export default Workshop5LinksViewer;
