/**
 * 🔗 VISUALISEUR LIENS ATELIER 3 VERS 4 ET 5
 * Interface pour montrer les liens explicites vers les ateliers suivants
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  Target,
  Shield,
  Clock,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Settings,
  Eye,
  Layers,
  GitBranch,
  Zap,
  Lock
} from 'lucide-react';
import WorkshopLinksManager from '../../domain/workshop3/WorkshopLinksManager';

// 🎯 PROPS DU COMPOSANT
interface Workshop3LinksViewerProps {
  selectedScenario?: string;
  onNavigateToWorkshop?: (workshopId: number) => void;
}

export const Workshop3LinksViewer: React.FC<Workshop3LinksViewerProps> = ({
  selectedScenario,
  onNavigateToWorkshop
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'workshop4' | 'workshop5'>('overview');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // 📊 DONNÉES
  const allLinks = WorkshopLinksManager.generateAllLinks();
  const validation = WorkshopLinksManager.validateLinks();

  // 🎯 VUE D'ENSEMBLE
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <GitBranch className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">3</div>
          <div className="text-sm text-blue-700">Scénarios A3</div>
          <div className="text-xs text-blue-600">Stratégiques</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">{allLinks.summary.totalOperationalModes}</div>
          <div className="text-sm text-purple-700">Modes A4</div>
          <div className="text-xs text-purple-600">Opérationnels</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 text-center">
          <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{allLinks.summary.totalTreatmentMeasures}</div>
          <div className="text-sm text-green-700">Mesures A5</div>
          <div className="text-xs text-green-600">Traitement</div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-900">{(allLinks.summary.totalBudget / 1000).toFixed(0)}k€</div>
          <div className="text-sm text-orange-700">Budget A5</div>
          <div className="text-xs text-orange-600">Total</div>
        </div>
      </div>

      {/* Flux de transmission */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-6">🔗 Flux de transmission inter-ateliers</h3>

        <div className="flex items-center justify-between">
          {/* Atelier 3 */}
          <div className="flex-1">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <GitBranch className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-medium text-blue-900">Atelier 3</div>
              <div className="text-sm text-blue-700">Scénarios Stratégiques</div>
              <div className="text-xs text-blue-600 mt-2">
                🥇 Ransomware SIH<br/>
                🥈 Abus privilèges<br/>
                🥉 Exfiltration recherche
              </div>
            </div>
          </div>

          <div className="mx-4 space-y-2">
            <ArrowRight className="w-6 h-6 text-gray-400" />
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </div>

          {/* Atelier 4 */}
          <div className="flex-1">
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="font-medium text-purple-900">Atelier 4</div>
              <div className="text-sm text-purple-700">Scénarios Opérationnels</div>
              <div className="text-xs text-purple-600 mt-2">
                ⚙️ Modes opératoires<br/>
                🔧 Techniques détaillées<br/>
                📊 Vecteurs d'attaque
              </div>
            </div>
          </div>

          <div className="mx-4">
            <ArrowRight className="w-6 h-6 text-gray-400" />
          </div>

          {/* Atelier 5 */}
          <div className="flex-1">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium text-green-900">Atelier 5</div>
              <div className="text-sm text-green-700">Traitement du Risque</div>
              <div className="text-xs text-green-600 mt-2">
                🛡️ Mesures préventives<br/>
                👁️ Mesures détection<br/>
                🔄 Mesures réponse
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exemples de transmission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 rounded-lg p-4">
          <h4 className="font-medium text-red-900 mb-3">🥇 Scénario "Ransomware SIH Urgences"</h4>

          <div className="space-y-3">
            <div className="bg-white rounded p-3">
              <div className="text-sm font-medium text-purple-900 mb-1">📤 Vers Atelier 4 :</div>
              <ul className="text-xs text-purple-800 space-y-1">
                <li>• Mode opératoire : Phishing → Escalade → Chiffrement</li>
                <li>• Techniques : Exploits 0-day, ransomware avancé</li>
                <li>• Timeline : 72h reconnaissance → 6h impact</li>
                <li>• Sophistication : 9/10</li>
              </ul>
            </div>

            <div className="bg-white rounded p-3">
              <div className="text-sm font-medium text-green-900 mb-1">📤 Vers Atelier 5 :</div>
              <ul className="text-xs text-green-800 space-y-1">
                <li>• Budget : 750k€ (60% budget total)</li>
                <li>• Mesures : MFA + EDR + Sauvegardes air-gap</li>
                <li>• Timeline : 12 mois implémentation</li>
                <li>• Priorité : 1 (CRITIQUE)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <h4 className="font-medium text-orange-900 mb-3">🥈 Scénario "Abus privilèges administrateur"</h4>

          <div className="space-y-3">
            <div className="bg-white rounded p-3">
              <div className="text-sm font-medium text-purple-900 mb-1">📤 Vers Atelier 4 :</div>
              <ul className="text-xs text-purple-800 space-y-1">
                <li>• Mode opératoire : Accès légitime → Abus</li>
                <li>• Techniques : Outils admin, contournement logs</li>
                <li>• Timeline : Action immédiate possible</li>
                <li>• Sophistication : 4/10</li>
              </ul>
            </div>

            <div className="bg-white rounded p-3">
              <div className="text-sm font-medium text-green-900 mb-1">📤 Vers Atelier 5 :</div>
              <ul className="text-xs text-green-800 space-y-1">
                <li>• Budget : 450k€ (25% budget total)</li>
                <li>• Mesures : PAM + UEBA + DLP</li>
                <li>• Timeline : 8 mois implémentation</li>
                <li>• Priorité : 2 (ÉLEVÉ)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Validation */}
      <div className="bg-green-50 rounded-lg p-6">
        <h3 className="font-semibold text-green-900 mb-4">✅ Validation des liens inter-ateliers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-900 mb-3">📊 Couverture</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-green-800">Vers Atelier 4</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-green-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${validation.workshop4Coverage}%` }}
                    />
                  </div>
                  <span className="text-green-700 text-sm">{Math.round(validation.workshop4Coverage)}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-800">Vers Atelier 5</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-green-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${validation.workshop5Coverage}%` }}
                    />
                  </div>
                  <span className="text-green-700 text-sm">{Math.round(validation.workshop5Coverage)}%</span>
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

  // 📤 LIENS VERS ATELIER 4
  const renderWorkshop4Links = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">📤 Liens vers Atelier 4 - Scénarios opérationnels</h3>

      {allLinks.workshop4Links.map(link => (
        <div key={link.strategicScenarioId} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{link.strategicScenarioName}</h4>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center">
                  <Zap className="w-4 h-4 text-orange-600 mr-1" />
                  Sophistication: {link.sophisticationLevel}/10
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 text-red-600 mr-1" />
                  Détection: {link.detectionDifficulty}/10
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigateToWorkshop?.(4)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
            >
              Aller à l'Atelier 4
            </button>
          </div>

          {/* Modes opératoires */}
          <div className="mb-4">
            <h5 className="font-medium text-gray-900 mb-3">⚙️ Modes opératoires transmis :</h5>
            {link.operationalModes.map(mode => (
              <div key={mode.id} className="bg-purple-50 rounded-lg p-4 mb-3">
                <h6 className="font-medium text-purple-900 mb-2">{mode.name}</h6>
                <p className="text-sm text-purple-800 mb-3">{mode.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-purple-900 mb-1">🔧 Techniques :</div>
                    <ul className="text-xs text-purple-700 space-y-1">
                      {mode.techniques.slice(0, 3).map((tech, index) => (
                        <li key={index}>• {tech}</li>
                      ))}
                      {mode.techniques.length > 3 && (
                        <li className="text-purple-600">+{mode.techniques.length - 3} autres...</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-purple-900 mb-1">🛠️ Outils :</div>
                    <ul className="text-xs text-purple-700 space-y-1">
                      {mode.tools.slice(0, 3).map((tool, index) => (
                        <li key={index}>• {tool}</li>
                      ))}
                      {mode.tools.length > 3 && (
                        <li className="text-purple-600">+{mode.tools.length - 3} autres...</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline d'attaque */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">⏱️ Timeline d'attaque transmise :</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Reconnaissance:</span>
                <span className="text-gray-600 ml-2">{link.timeline.reconnaissance}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Accès initial:</span>
                <span className="text-gray-600 ml-2">{link.timeline.initialAccess}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Persistance:</span>
                <span className="text-gray-600 ml-2">{link.timeline.persistence}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Impact:</span>
                <span className="text-gray-600 ml-2">{link.timeline.impact}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // 📤 LIENS VERS ATELIER 5
  const renderWorkshop5Links = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">📤 Liens vers Atelier 5 - Traitement du risque</h3>

      {allLinks.workshop5Links.map(link => (
        <div key={link.strategicScenarioId} className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{link.strategicScenarioName}</h4>
              <div className="flex items-center space-x-4 text-sm">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  link.riskLevel === 'CRITIQUE' ? 'bg-red-100 text-red-700' :
                  link.riskLevel === 'ÉLEVÉ' ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {link.riskLevel}
                </span>
                <span className="text-gray-600">Priorité {link.priority}</span>
                <span className="text-green-600">{(link.budgetAllocation.totalBudget / 1000).toFixed(0)}k€</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateToWorkshop?.(5)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              Aller à l'Atelier 5
            </button>
          </div>

          {/* Mesures de traitement */}
          <div className="mb-4">
            <h5 className="font-medium text-gray-900 mb-3">🛡️ Mesures de traitement transmises :</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {link.treatmentMeasures.map(measure => (
                <div key={measure.id} className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h6 className="font-medium text-green-900">{measure.name}</h6>
                    <span className={`px-2 py-1 rounded text-xs ${
                      measure.type === 'preventive' ? 'bg-blue-100 text-blue-700' :
                      measure.type === 'detective' ? 'bg-yellow-100 text-yellow-700' :
                      measure.type === 'corrective' ? 'bg-orange-100 text-orange-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {measure.type}
                    </span>
                  </div>
                  <p className="text-sm text-green-800 mb-2">{measure.description}</p>
                  <div className="flex items-center justify-between text-xs text-green-700">
                    <span>{(measure.cost / 1000).toFixed(0)}k€</span>
                    <span>Efficacité: {measure.effectiveness}/10</span>
                    <span>{measure.implementationTime} mois</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation budgétaire */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">💰 Allocation budgétaire transmise :</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-blue-600 font-medium">{(link.budgetAllocation.preventive / 1000).toFixed(0)}k€</div>
                <div className="text-blue-500 text-xs">Préventif</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-600 font-medium">{(link.budgetAllocation.detective / 1000).toFixed(0)}k€</div>
                <div className="text-yellow-500 text-xs">Détection</div>
              </div>
              <div className="text-center">
                <div className="text-orange-600 font-medium">{(link.budgetAllocation.corrective / 1000).toFixed(0)}k€</div>
                <div className="text-orange-500 text-xs">Correctif</div>
              </div>
              <div className="text-center">
                <div className="text-purple-600 font-medium">{(link.budgetAllocation.recovery / 1000).toFixed(0)}k€</div>
                <div className="text-purple-500 text-xs">Récupération</div>
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="text-gray-700 text-sm">
                {link.budgetAllocation.percentageOfTotal}% du budget sécurité total
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🔗 Point 3 - Liens explicites vers Ateliers 4 et 5
        </h1>
        <p className="text-gray-600">
          Visualisez comment les scénarios stratégiques de l'Atelier 3 alimentent directement les ateliers suivants
        </p>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex border-b">
          {[
            { id: 'overview', label: '📊 Vue d\'ensemble', icon: TrendingUp },
            { id: 'workshop4', label: '📤 Vers Atelier 4', icon: Settings },
            { id: 'workshop5', label: '📤 Vers Atelier 5', icon: Shield }
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
        {activeView === 'overview' && renderOverview()}
        {activeView === 'workshop4' && renderWorkshop4Links()}
        {activeView === 'workshop5' && renderWorkshop5Links()}
      </div>
    </div>
  );
};

export default Workshop3LinksViewer;