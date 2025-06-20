/**
 * 🔗 VISUALISEUR INTÉGRATION ATELIER 3 → ATELIER 4
 * Interface pour visualiser l'utilisation des livrables A3 dans A4
 */

import React, { useState } from 'react';
import { 
  ArrowRight, 
  GitBranch, 
  Target, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Eye,
  Settings,
  Activity,
  Link,
  FileText,
  Layers,
  TrendingUp,
  Zap
} from 'lucide-react';
import Workshop3DeliverablesIntegration, { 
  StrategicScenarioInput, 
  OperationalModeOutput, 
  TransformationMapping 
} from '../../domain/workshop4/Workshop3DeliverablesIntegration';

// 🎯 PROPS DU COMPOSANT
interface Workshop3IntegrationViewerProps {
  onNavigateToWorkshop?: (workshopId: number) => void;
}

export const Workshop3IntegrationViewer: React.FC<Workshop3IntegrationViewerProps> = ({
  onNavigateToWorkshop
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'scenarios' | 'transformation' | 'validation'>('overview');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // 📊 DONNÉES
  const strategicScenarios = Workshop3DeliverablesIntegration.getStrategicScenarios();
  const operationalModes = Workshop3DeliverablesIntegration.transformToOperationalModes();
  const transformationMappings = Workshop3DeliverablesIntegration.getTransformationMappings();
  const validation = Workshop3DeliverablesIntegration.validateDeliverablesUsage();

  // 🎯 VUE D'ENSEMBLE
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Métriques d'intégration */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{validation.strategicScenariosUsed}</div>
          <div className="text-sm text-blue-700">Scénarios A3</div>
          <div className="text-xs text-blue-600">Utilisés</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <Settings className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{validation.operationalModesGenerated}</div>
          <div className="text-sm text-green-700">Modes A4</div>
          <div className="text-xs text-green-600">Générés</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <Link className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">{validation.transformationMappings}</div>
          <div className="text-sm text-purple-700">Mappings</div>
          <div className="text-xs text-purple-600">Traçabilité</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-900">{validation.coveragePercentage}%</div>
          <div className="text-sm text-orange-700">Couverture</div>
          <div className="text-xs text-orange-600">Complète</div>
        </div>
      </div>

      {/* Flux de transformation */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-6">🔄 Flux de transformation A3 → A4</h3>
        
        <div className="space-y-6">
          {strategicScenarios.map((scenario, index) => {
            const operationalMode = operationalModes.find(mode => mode.strategicScenarioId === scenario.id);
            
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Scénario stratégique */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Target className="w-5 h-5 text-blue-600" />
                      <h5 className="font-medium text-blue-900">Scénario stratégique</h5>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-blue-800">Nom:</span>
                        <div className="text-blue-700">{scenario.name}</div>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Source:</span>
                        <div className="text-blue-700">{scenario.source.name}</div>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Bien:</span>
                        <div className="text-blue-700">{scenario.essentialAsset.name}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-blue-800">V×I:</span>
                        <span className="text-blue-700">{scenario.likelihood}×{scenario.impact}</span>
                      </div>
                    </div>
                  </div>

                  {/* Flèche de transformation */}
                  <div className="flex items-center justify-center">
                    <div className="bg-gray-100 rounded-full p-3">
                      <ArrowRight className="w-6 h-6 text-gray-600" />
                    </div>
                  </div>

                  {/* Mode opératoire */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Settings className="w-5 h-5 text-green-600" />
                      <h5 className="font-medium text-green-900">Mode opératoire</h5>
                    </div>
                    
                    {operationalMode && (
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-green-800">Nom:</span>
                          <div className="text-green-700">{operationalMode.name}</div>
                        </div>
                        <div>
                          <span className="font-medium text-green-800">Complexité:</span>
                          <div className="text-green-700">{operationalMode.complexity}/10</div>
                        </div>
                        <div>
                          <span className="font-medium text-green-800">Durée:</span>
                          <div className="text-green-700">{operationalMode.duration}</div>
                        </div>
                        <div>
                          <span className="font-medium text-green-800">Phases:</span>
                          <div className="text-green-700">{operationalMode.phases.length} phases</div>
                        </div>
                        <div>
                          <span className="font-medium text-green-800">MITRE:</span>
                          <div className="text-green-700">{operationalMode.mitreMapping.length} techniques</div>
                        </div>
                      </div>
                    )}
                  </div>
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

      {/* Validation de l'utilisation */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">✅ Validation de l'utilisation des livrables</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Couverture complète: {validation.coveragePercentage}%</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Traçabilité: {validation.traceabilityComplete ? 'Complète' : 'Partielle'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Scénarios transformés: {validation.strategicScenariosUsed}/{strategicScenarios.length}</span>
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

  // 📋 RENDU SCÉNARIOS DÉTAILLÉS
  const renderScenarios = () => (
    <div className="space-y-6">
      {strategicScenarios.map(scenario => {
        const operationalMode = operationalModes.find(mode => mode.strategicScenarioId === scenario.id);
        
        return (
          <div key={scenario.id} className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{scenario.name}</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Données stratégiques */}
              <div className="space-y-4">
                <h4 className="font-medium text-blue-900">📊 Données stratégiques (Atelier 3)</h4>
                
                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                  <div>
                    <span className="font-medium text-blue-800">Source de risque:</span>
                    <div className="text-blue-700 mt-1">{scenario.source.name}</div>
                    <div className="text-sm text-blue-600">Score: {scenario.source.score}/20 (Priorité {scenario.source.priority})</div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-blue-800">Bien essentiel:</span>
                    <div className="text-blue-700 mt-1">{scenario.essentialAsset.name}</div>
                    <div className="text-sm text-blue-600">Criticité: {scenario.essentialAsset.criticality}</div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-blue-800">Événement redouté:</span>
                    <div className="text-blue-700 mt-1">{scenario.fearedEvent.name}</div>
                    <div className="text-sm text-blue-600">Impact: {scenario.fearedEvent.criticality}</div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                    <span className="font-medium text-blue-800">Évaluation:</span>
                    <div className="text-right">
                      <div className="text-blue-700">V: {scenario.likelihood}/5 × I: {scenario.impact}/4</div>
                      <div className={`text-sm font-medium ${
                        scenario.riskLevel === 'CRITIQUE' ? 'text-red-600' :
                        scenario.riskLevel === 'ÉLEVÉ' ? 'text-orange-600' :
                        'text-yellow-600'
                      }`}>
                        Risque {scenario.riskLevel}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Données opérationnelles */}
              <div className="space-y-4">
                <h4 className="font-medium text-green-900">⚙️ Données opérationnelles (Atelier 4)</h4>
                
                {operationalMode && (
                  <div className="bg-green-50 rounded-lg p-4 space-y-3">
                    <div>
                      <span className="font-medium text-green-800">Mode opératoire:</span>
                      <div className="text-green-700 mt-1">{operationalMode.name}</div>
                      <div className="text-sm text-green-600">Complexité: {operationalMode.complexity}/10</div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-green-800">Sophistication:</span>
                      <div className="text-green-700 mt-1">{operationalMode.sophistication}</div>
                      <div className="text-sm text-green-600">Durée: {operationalMode.duration}</div>
                    </div>
                    
                    <div>
                      <span className="font-medium text-green-800">Phases d'attaque:</span>
                      <div className="text-green-700 mt-1">{operationalMode.phases.length} phases détaillées</div>
                      <div className="text-sm text-green-600">
                        {operationalMode.phases.map(phase => phase.name).join(' → ')}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-green-200">
                      <span className="font-medium text-green-800">Techniques:</span>
                      <div className="text-right">
                        <div className="text-green-700">{operationalMode.mitreMapping.length} MITRE ATT&CK</div>
                        <div className="text-sm text-green-600">Gravité: {operationalMode.gravityLevel}/4</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🔗 Intégration Atelier 3 → Atelier 4
        </h1>
        <p className="text-gray-600">
          Visualisation de l'utilisation systématique des livrables A3 pour construire les modes opératoires A4
        </p>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex border-b overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Vue d\'ensemble', icon: Target },
            { id: 'scenarios', label: '📋 Scénarios détaillés', icon: FileText },
            { id: 'transformation', label: '🔄 Mappings', icon: GitBranch },
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
        {activeView === 'scenarios' && renderScenarios()}
        {/* Autres vues à implémenter */}
      </div>
    </div>
  );
};

export default Workshop3IntegrationViewer;
