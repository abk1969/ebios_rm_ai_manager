/**
 * 🛡️ VISUALISEUR TRAITEMENT DU RISQUE
 * Interface pour l'Atelier 5 - Stratégie de traitement et mesures de sécurité
 */

import React, { useState } from 'react';
import { 
  Shield, 
  Target, 
  DollarSign, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Settings,
  Activity,
  BarChart3,
  Clock,
  Users,
  FileText,
  Layers,
  ArrowRight,
  Eye,
  Zap
} from 'lucide-react';
import RiskTreatmentContent, { RiskTreatmentStep, TreatmentStrategy, SecurityMeasure } from '../../domain/workshop5/RiskTreatmentContent';

// 🎯 PROPS DU COMPOSANT
interface RiskTreatmentViewerProps {
  selectedStep?: string;
  onStepComplete?: (stepId: string) => void;
  onNavigateToWorkshop?: (workshopId: number) => void;
}

export const RiskTreatmentViewer: React.FC<RiskTreatmentViewerProps> = ({
  selectedStep,
  onStepComplete,
  onNavigateToWorkshop
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'methodology' | 'measures' | 'budget' | 'planning' | 'monitoring'>('overview');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // 📊 DONNÉES
  const steps = RiskTreatmentContent.getAllSteps();
  const strategies = RiskTreatmentContent.getTreatmentStrategies();
  const measures = RiskTreatmentContent.getSecurityMeasures();
  const totalDuration = RiskTreatmentContent.getTotalDuration();

  // 🎯 VUE D'ENSEMBLE
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{steps.length}</div>
          <div className="text-sm text-blue-700">Étapes</div>
          <div className="text-xs text-blue-600">{totalDuration} minutes</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{strategies.length}</div>
          <div className="text-sm text-green-700">Stratégies</div>
          <div className="text-xs text-green-600">Traitement</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">{measures.length}</div>
          <div className="text-sm text-purple-700">Mesures</div>
          <div className="text-xs text-purple-600">Sécurité</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-900">1.8M€</div>
          <div className="text-sm text-orange-700">Budget</div>
          <div className="text-xs text-orange-600">ROI 21.9x</div>
        </div>
      </div>

      {/* Progression des étapes */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-6">🛡️ Progression Atelier 5 - Traitement du risque</h3>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.completed ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step.completed ? <CheckCircle className="w-4 h-4" /> : index + 1}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{step.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{step.duration} min</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              
              <button
                onClick={() => setActiveView(step.id.replace('w5-', '') as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  step.completed 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {step.completed ? 'Revoir' : 'Commencer'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Stratégies de traitement */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">🎯 Stratégies de traitement des risques</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map(strategy => (
            <div key={strategy.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-900">{strategy.name}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  strategy.id === 'avoid_risk' ? 'bg-red-100 text-red-700' :
                  strategy.id === 'reduce_risk' ? 'bg-blue-100 text-blue-700' :
                  strategy.id === 'transfer_risk' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {strategy.costRange}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
              
              <div className="space-y-2">
                <div>
                  <div className="text-xs font-medium text-gray-900">Applicabilité :</div>
                  <div className="text-xs text-gray-600">{strategy.applicability}</div>
                </div>
                
                <div>
                  <div className="text-xs font-medium text-gray-900">Délai :</div>
                  <div className="text-xs text-gray-600">{strategy.timeframe}</div>
                </div>
                
                <div>
                  <div className="text-xs font-medium text-gray-900">Exemples CHU :</div>
                  <ul className="text-xs text-gray-600">
                    {strategy.examples.slice(0, 2).map((example, index) => (
                      <li key={index}>• {example}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mesures de sécurité prioritaires */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">🛡️ Mesures de sécurité prioritaires</h3>
        
        <div className="space-y-4">
          {measures.filter(m => m.priority === 1).map(measure => (
            <div key={measure.id} className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    measure.category === 'prevention' ? 'bg-blue-600' :
                    measure.category === 'detection' ? 'bg-purple-600' :
                    measure.category === 'response' ? 'bg-orange-600' :
                    'bg-green-600'
                  } text-white`}>
                    {measure.category === 'prevention' ? <Shield className="w-4 h-4" /> :
                     measure.category === 'detection' ? <Eye className="w-4 h-4" /> :
                     measure.category === 'response' ? <Zap className="w-4 h-4" /> :
                     <Activity className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">{measure.name}</h4>
                    <div className="text-sm text-blue-700 capitalize">{measure.category}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-900">{(measure.cost / 1000).toFixed(0)}k€</div>
                  <div className="text-sm text-blue-700">{measure.timeToImplement}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <div className="text-xs font-medium text-blue-900">Efficacité :</div>
                  <div className="flex items-center space-x-1">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${
                        i < measure.effectiveness ? 'bg-blue-600' : 'bg-gray-300'
                      }`} />
                    ))}
                    <span className="text-xs text-blue-700 ml-1">{measure.effectiveness}/10</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs font-medium text-blue-900">Complexité :</div>
                  <div className="flex items-center space-x-1">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full ${
                        i < measure.complexity ? 'bg-orange-600' : 'bg-gray-300'
                      }`} />
                    ))}
                    <span className="text-xs text-blue-700 ml-1">{measure.complexity}/10</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs font-medium text-blue-900">Réduction risque :</div>
                  <div className="text-xs text-blue-700">{measure.riskReduction}%</div>
                </div>
              </div>
              
              <div>
                <div className="text-xs font-medium text-blue-900 mb-1">KPIs clés :</div>
                <div className="flex flex-wrap gap-1">
                  {measure.kpis.slice(0, 3).map((kpi, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {kpi}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setActiveView('measures')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Voir toutes les mesures
          </button>
        </div>
      </div>

      {/* Analyse budgétaire */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">💰 Analyse budgétaire</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Répartition par catégorie</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Détection (40%)</span>
                <span className="font-medium">720k€</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Prévention (35%)</span>
                <span className="font-medium">630k€</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Réponse (15%)</span>
                <span className="font-medium">270k€</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Récupération (10%)</span>
                <span className="font-medium">180k€</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Retour sur investissement</h4>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-center mb-3">
                <div className="text-3xl font-bold text-green-600">21.9x</div>
                <div className="text-sm text-green-700">ROI global</div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Investissement :</span>
                  <span className="font-medium">1.8M€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dommages évités :</span>
                  <span className="font-medium">39.4M€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Période de retour :</span>
                  <span className="font-medium">17 jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setActiveView('budget')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Analyse détaillée
          </button>
        </div>
      </div>
    </div>
  );

  // 📚 RENDU MÉTHODOLOGIE
  const renderMethodology = () => {
    const step = steps.find(s => s.id === 'w5-methodology');
    if (!step) return null;

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h2>
          <div className="prose max-w-none">
            <div className="whitespace-pre-line text-gray-700">
              {step.content}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🛡️ Atelier 5 - Traitement du risque
        </h1>
        <p className="text-gray-600">
          Définissez la stratégie de traitement et sélectionnez les mesures de sécurité adaptées au contexte CHU
        </p>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex border-b overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Vue d\'ensemble', icon: Target },
            { id: 'methodology', label: '📚 Méthodologie', icon: Settings },
            { id: 'measures', label: '🛡️ Mesures', icon: Shield },
            { id: 'budget', label: '💰 Budget', icon: DollarSign },
            { id: 'planning', label: '📅 Planning', icon: Calendar },
            { id: 'monitoring', label: '📊 Suivi', icon: BarChart3 }
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
        {activeView === 'methodology' && renderMethodology()}
        {/* Autres vues à implémenter */}
      </div>
    </div>
  );
};

export default RiskTreatmentViewer;
