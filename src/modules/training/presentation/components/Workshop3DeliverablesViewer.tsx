/**
 * 🔗 VISUALISEUR LIVRABLES ATELIER 3
 * Interface spécialisée pour montrer l'utilisation des livrables A1+A2 dans l'Atelier 3
 */

import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  FileText, 
  Target, 
  Users, 
  Shield, 
  AlertTriangle,
  TrendingUp,
  Eye,
  Link,
  Layers,
  GitBranch,
  Star
} from 'lucide-react';
import WorkshopDeliverablesIntegration from '../../domain/workshop3/WorkshopDeliverablesIntegration';

// 🎯 PROPS DU COMPOSANT
interface Workshop3DeliverablesViewerProps {
  selectedScenario?: string;
  onScenarioSelect?: (scenarioId: string) => void;
}

export const Workshop3DeliverablesViewer: React.FC<Workshop3DeliverablesViewerProps> = ({
  selectedScenario,
  onScenarioSelect
}) => {
  const [activeView, setActiveView] = useState<'flow' | 'matrix' | 'scenarios'>('flow');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // 📊 DONNÉES
  const w1Deliverables = WorkshopDeliverablesIntegration.getWorkshop1Deliverables();
  const w2Deliverables = WorkshopDeliverablesIntegration.getWorkshop2Deliverables();
  const scenarios = WorkshopDeliverablesIntegration.buildStrategicScenarios();
  const validation = WorkshopDeliverablesIntegration.validateDeliverablesUsage();

  // 🔗 VUE FLUX D'UTILISATION
  const renderFlowView = () => (
    <div className="space-y-8">
      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{w1Deliverables.length}</div>
          <div className="text-sm text-blue-700">Livrables A1</div>
          <div className="text-xs text-blue-600">{Math.round(validation.workshop1Coverage)}% utilisés</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{w2Deliverables.length}</div>
          <div className="text-sm text-green-700">Livrables A2</div>
          <div className="text-xs text-green-600">{Math.round(validation.workshop2Coverage)}% utilisés</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <GitBranch className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">{scenarios.length}</div>
          <div className="text-sm text-purple-700">Scénarios A3</div>
          <div className="text-xs text-purple-600">Construits</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-900">100%</div>
          <div className="text-sm text-orange-700">Traçabilité</div>
          <div className="text-xs text-orange-600">Complète</div>
        </div>
      </div>

      {/* Flux principal */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-6">🔗 Flux d'utilisation systématique</h3>
        
        <div className="space-y-8">
          {/* Atelier 1 → Atelier 3 */}
          <div>
            <h4 className="font-medium text-blue-900 mb-4">📥 Atelier 1 → Atelier 3</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {w1Deliverables.slice(0, 4).map(deliverable => (
                <div key={deliverable.id} className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-blue-900">{deliverable.name}</h5>
                    <span className={`px-2 py-1 rounded text-xs ${
                      deliverable.criticality === 'CRITIQUE' ? 'bg-red-100 text-red-700' :
                      deliverable.criticality === 'MAJEUR' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {deliverable.criticality}
                    </span>
                  </div>
                  <div className="text-sm text-blue-800 mb-3">{deliverable.description}</div>
                  
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-blue-900">🎯 Utilisation A3 :</div>
                    {deliverable.usageInWorkshop3.slice(0, 2).map((usage, index) => (
                      <div key={index} className="flex items-start text-xs text-blue-700">
                        <ArrowRight className="w-3 h-3 mt-0.5 mr-1 text-blue-600" />
                        <span>{usage}</span>
                      </div>
                    ))}
                    {deliverable.usageInWorkshop3.length > 2 && (
                      <div className="text-xs text-blue-600">
                        +{deliverable.usageInWorkshop3.length - 2} autres utilisations...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Atelier 2 → Atelier 3 */}
          <div>
            <h4 className="font-medium text-green-900 mb-4">📥 Atelier 2 → Atelier 3</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {w2Deliverables.slice(0, 3).map(deliverable => (
                <div key={deliverable.id} className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-green-900">{deliverable.name}</h5>
                    <div className="text-right">
                      <div className="text-xs text-green-700">Score: {deliverable.score}/20</div>
                      <div className="text-xs text-green-600">Priorité {deliverable.priority}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-green-900">🎯 Utilisation A3 :</div>
                    {deliverable.usageInWorkshop3.slice(0, 2).map((usage, index) => (
                      <div key={index} className="flex items-start text-xs text-green-700">
                        <ArrowRight className="w-3 h-3 mt-0.5 mr-1 text-green-600" />
                        <span>{usage}</span>
                      </div>
                    ))}
                    {deliverable.usageInWorkshop3.length > 2 && (
                      <div className="text-xs text-green-600">
                        +{deliverable.usageInWorkshop3.length - 2} autres utilisations...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Validation */}
      <div className="bg-green-50 rounded-lg p-6">
        <h3 className="font-semibold text-green-900 mb-4">✅ Validation de l'utilisation systématique</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-900 mb-3">📊 Couverture des livrables</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-green-800">Atelier 1</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${validation.workshop1Coverage}%` }}
                    />
                  </div>
                  <span className="text-green-700 text-sm">{Math.round(validation.workshop1Coverage)}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-800">Atelier 2</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-green-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${validation.workshop2Coverage}%` }}
                    />
                  </div>
                  <span className="text-green-700 text-sm">{Math.round(validation.workshop2Coverage)}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-green-900 mb-3">🎯 Recommandations</h4>
            <ul className="space-y-1">
              {validation.recommendations.slice(0, 3).map((rec, index) => (
                <li key={index} className="flex items-start text-green-800 text-sm">
                  <CheckCircle className="w-3 h-3 mt-1 mr-2 text-green-600" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // 📊 VUE MATRICE DE COMBINAISONS
  const renderMatrixView = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">📊 Matrice de combinaisons Sources × Biens</h3>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-3 border-b">Source \ Bien</th>
                <th className="text-center p-3 border-b text-green-700">Urgences vitales</th>
                <th className="text-center p-3 border-b text-blue-700">Données patients</th>
                <th className="text-center p-3 border-b text-purple-700">Recherche clinique</th>
                <th className="text-center p-3 border-b text-orange-700">Bloc opératoire</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-medium text-red-700">🥇 Cybercriminels</td>
                <td className="text-center p-3">⭐⭐⭐⭐⭐</td>
                <td className="text-center p-3">⭐⭐⭐⭐</td>
                <td className="text-center p-3">⭐⭐⭐</td>
                <td className="text-center p-3">⭐⭐⭐⭐</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium text-orange-700">🥈 Initiés malveillants</td>
                <td className="text-center p-3">⭐⭐⭐⭐</td>
                <td className="text-center p-3">⭐⭐⭐⭐⭐</td>
                <td className="text-center p-3">⭐⭐⭐</td>
                <td className="text-center p-3">⭐⭐⭐</td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-yellow-700">🥉 Espions industriels</td>
                <td className="text-center p-3">⭐⭐</td>
                <td className="text-center p-3">⭐⭐⭐</td>
                <td className="text-center p-3">⭐⭐⭐⭐⭐</td>
                <td className="text-center p-3">⭐</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <div className="font-medium mb-2">Légende pertinence :</div>
          <div className="flex flex-wrap gap-4">
            <span>⭐ = Très faible</span>
            <span>⭐⭐ = Faible</span>
            <span>⭐⭐⭐ = Moyenne</span>
            <span>⭐⭐⭐⭐ = Élevée</span>
            <span>⭐⭐⭐⭐⭐ = Très élevée</span>
          </div>
        </div>
      </div>

      {/* Justifications des combinaisons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-lg p-4">
          <h4 className="font-medium text-red-900 mb-3">🥇 Cybercriminels → Urgences (⭐⭐⭐⭐⭐)</h4>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• Pression temporelle maximale</li>
            <li>• Vies en jeu = levier parfait</li>
            <li>• Impossibilité d'attendre</li>
            <li>• ROI extorsion optimal</li>
          </ul>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <h4 className="font-medium text-orange-900 mb-3">🥈 Initiés → Données (⭐⭐⭐⭐⭐)</h4>
          <ul className="text-sm text-orange-800 space-y-1">
            <li>• Accès privilégié direct</li>
            <li>• Contournement sécurités</li>
            <li>• Connaissance intime</li>
            <li>• Détection difficile</li>
          </ul>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-3">🥉 Espions → Recherche (⭐⭐⭐⭐⭐)</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Propriété intellectuelle</li>
            <li>• Avantage concurrentiel</li>
            <li>• Valeur R&D énorme</li>
            <li>• Motivation stratégique</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // 📤 VUE SCÉNARIOS CONSTRUITS
  const renderScenariosView = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">📤 Scénarios stratégiques construits</h3>
      
      {scenarios.map((scenario, index) => (
        <div key={scenario.id} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                <h4 className="text-lg font-semibold text-gray-900">{scenario.name}</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  scenario.riskLevel === 'CRITIQUE' ? 'bg-red-100 text-red-700' :
                  scenario.riskLevel === 'ÉLEVÉ' ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {scenario.riskLevel}
                </span>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  <span>Vraisemblance: {scenario.likelihood}/5</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full" />
                  <span>Impact: {scenario.impact}/4</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setExpandedItem(expandedItem === scenario.id ? null : scenario.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              {expandedItem === scenario.id ? 'Masquer' : 'Voir détails'}
            </button>
          </div>

          {/* Composants du scénario */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="font-medium text-orange-900 mb-1">🎭 Source</div>
              <div className="text-sm text-orange-800">{scenario.source.name}</div>
              <div className="text-xs text-orange-600">Score: {scenario.source.score}/20 (Priorité {scenario.source.priority})</div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3">
              <div className="font-medium text-green-900 mb-1">🎯 Bien essentiel</div>
              <div className="text-sm text-green-800">{scenario.essentialAsset.name}</div>
              <div className="text-xs text-green-600">{scenario.essentialAsset.criticality}</div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-3">
              <div className="font-medium text-red-900 mb-1">⚠️ Événement redouté</div>
              <div className="text-sm text-red-800">{scenario.fearedEvent.name}</div>
              <div className="text-xs text-red-600">{scenario.fearedEvent.criticality}</div>
            </div>
          </div>

          {/* Détails étendus */}
          {expandedItem === scenario.id && (
            <div className="border-t border-gray-200 pt-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">📋 Justification détaillée :</h5>
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {scenario.justification}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">📥 Dépendances Atelier 1</h5>
                  <div className="space-y-1">
                    {scenario.workshop1Dependencies.map(dep => {
                      const deliverable = w1Deliverables.find(d => d.id === dep);
                      return (
                        <div key={dep} className="flex items-center text-sm">
                          <Link className="w-3 h-3 text-blue-600 mr-2" />
                          <span className="text-gray-700">{deliverable?.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">📥 Dépendances Atelier 2</h5>
                  <div className="space-y-1">
                    {scenario.workshop2Dependencies.map(dep => {
                      const deliverable = w2Deliverables.find(d => d.id === dep);
                      return (
                        <div key={dep} className="flex items-center text-sm">
                          <Link className="w-3 h-3 text-green-600 mr-2" />
                          <span className="text-gray-700">{deliverable?.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🔗 Point 2 - Utilisation des livrables Ateliers 1 et 2
        </h1>
        <p className="text-gray-600">
          Visualisez comment l'Atelier 3 utilise systématiquement et rigoureusement tous les livrables des ateliers précédents
        </p>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex border-b">
          {[
            { id: 'flow', label: '🔗 Flux d\'utilisation', icon: ArrowRight },
            { id: 'matrix', label: '📊 Matrice combinaisons', icon: Layers },
            { id: 'scenarios', label: '📤 Scénarios construits', icon: GitBranch }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
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
        {activeView === 'flow' && renderFlowView()}
        {activeView === 'matrix' && renderMatrixView()}
        {activeView === 'scenarios' && renderScenariosView()}
      </div>
    </div>
  );
};

export default Workshop3DeliverablesViewer;
