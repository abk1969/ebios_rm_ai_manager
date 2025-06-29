/**
 * 🚀 VISUALISEUR MISE EN ŒUVRE OPÉRATIONNELLE
 * Interface pour visualiser les plans de déploiement opérationnel des mesures A5
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Settings,
  Activity,
  FileText,
  TrendingUp,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  Play,
  Pause,
  CheckSquare
} from 'lucide-react';
import OperationalImplementation, { 
  OperationalImplementation as OperationalImplementationType,
  ImplementationPhase,
  PerformanceIndicator
} from '../../domain/workshop5/OperationalImplementation';

// 🎯 PROPS DU COMPOSANT
interface OperationalImplementationViewerProps {
  selectedImplementation?: string;
  onImplementationSelect?: (implementationId: string) => void;
}

export const OperationalImplementationViewer: React.FC<OperationalImplementationViewerProps> = ({
  selectedImplementation,
  onImplementationSelect
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'timeline' | 'budget' | 'resources' | 'procedures' | 'monitoring'>('overview');
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  // 📊 DONNÉES
  const implementations = OperationalImplementation.getAllImplementations();
  const progress = OperationalImplementation.calculateOverallProgress();
  const selectedImpl = selectedImplementation 
    ? OperationalImplementation.getImplementationById(selectedImplementation)
    : implementations[0];

  // 🎯 VUE D'ENSEMBLE
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{progress.totalImplementations}</div>
          <div className="text-sm text-blue-700">Mesures</div>
          <div className="text-xs text-blue-600">En déploiement</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{progress.overallProgress}%</div>
          <div className="text-sm text-green-700">Progression</div>
          <div className="text-xs text-green-600">{progress.completedPhases}/{progress.totalPhases} phases</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-900">{progress.nextMilestones.length}</div>
          <div className="text-sm text-orange-700">Jalons</div>
          <div className="text-xs text-orange-600">À venir</div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-900">{progress.criticalRisks.length}</div>
          <div className="text-sm text-red-700">Risques</div>
          <div className="text-xs text-red-600">Critiques</div>
        </div>
      </div>

      {/* Sélection de mesure */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">🛡️ Sélection de la mesure à déployer</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {implementations.map(impl => (
            <div 
              key={impl.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedImpl?.id === impl.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onImplementationSelect?.(impl.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{impl.measureName}</h4>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    impl.operationalReadiness.overallReadiness >= 80 ? 'bg-green-100 text-green-700' :
                    impl.operationalReadiness.overallReadiness >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {impl.operationalReadiness.overallReadiness}% prêt
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Durée totale:</div>
                  <div className="font-medium">{impl.timeline.totalDuration} jours</div>
                </div>
                <div>
                  <div className="text-gray-600">Budget:</div>
                  <div className="font-medium">{(impl.budget.totalBudget / 1000).toFixed(0)}k€</div>
                </div>
                <div>
                  <div className="text-gray-600">Phases:</div>
                  <div className="font-medium">{impl.implementationPhases.length} phases</div>
                </div>
                <div>
                  <div className="text-gray-600">Risques:</div>
                  <div className="font-medium">{impl.risks.filter(r => r.riskLevel === 'high' || r.riskLevel === 'critical').length} critiques</div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Progression phases</span>
                  <span>{impl.implementationPhases.filter(p => p.status === 'completed').length}/{impl.implementationPhases.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${(impl.implementationPhases.filter(p => p.status === 'completed').length / impl.implementationPhases.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Détails de la mesure sélectionnée */}
      {selectedImpl && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">🚀 Plan de déploiement - {selectedImpl.measureName}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline des phases */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">📅 Timeline des phases</h4>
              <div className="space-y-3">
                {selectedImpl.implementationPhases.map((phase, index) => (
                  <div key={phase.id} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      phase.status === 'completed' ? 'bg-green-600 text-white' :
                      phase.status === 'in_progress' ? 'bg-blue-600 text-white' :
                      phase.status === 'delayed' ? 'bg-red-600 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {phase.status === 'completed' ? <CheckCircle className="w-4 h-4" /> :
                       phase.status === 'in_progress' ? <Play className="w-4 h-4" /> :
                       phase.status === 'delayed' ? <AlertTriangle className="w-4 h-4" /> :
                       index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900">{phase.name}</h5>
                        <div className="text-sm text-gray-500">{phase.duration} jours</div>
                      </div>
                      <p className="text-sm text-gray-600">{phase.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>📅 {phase.startDate} → {phase.endDate}</span>
                        <span>💰 {(phase.budget / 1000).toFixed(0)}k€</span>
                        <span>📋 {phase.deliverables.length} livrables</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Prêt opérationnel */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">✅ Prêt opérationnel</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Technique</span>
                    <span className="text-sm font-medium">{selectedImpl.operationalReadiness.technicalReadiness}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${selectedImpl.operationalReadiness.technicalReadiness}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Organisationnel</span>
                    <span className="text-sm font-medium">{selectedImpl.operationalReadiness.organizationalReadiness}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${selectedImpl.operationalReadiness.organizationalReadiness}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Processus</span>
                    <span className="text-sm font-medium">{selectedImpl.operationalReadiness.processReadiness}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${selectedImpl.operationalReadiness.processReadiness}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Global</span>
                    <span className="text-lg font-bold text-gray-900">{selectedImpl.operationalReadiness.overallReadiness}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        selectedImpl.operationalReadiness.overallReadiness >= 80 ? 'bg-green-600' :
                        selectedImpl.operationalReadiness.overallReadiness >= 60 ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${selectedImpl.operationalReadiness.overallReadiness}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <h5 className="font-medium text-gray-900 mb-2">Checklist de prêt</h5>
                <div className="space-y-2">
                  {selectedImpl.operationalReadiness.readinessChecklist.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className={`w-4 h-4 rounded-full ${
                        item.status === 'completed' ? 'bg-green-600' :
                        item.status === 'in_progress' ? 'bg-blue-600' :
                        item.status === 'blocked' ? 'bg-red-600' :
                        'bg-gray-300'
                      }`}></div>
                      <span className={`${item.critical ? 'font-medium' : ''} text-gray-700`}>
                        {item.item}
                      </span>
                      {item.critical && <span className="text-red-600 text-xs">*</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveView('timeline')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Voir timeline détaillée
              </button>
              <button
                onClick={() => setActiveView('budget')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Voir budget détaillé
              </button>
              <button
                onClick={() => setActiveView('procedures')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Voir procédures
              </button>
            </div>
            
            <div className={`px-4 py-2 rounded-lg font-medium ${
              selectedImpl.operationalReadiness.goLiveApproval 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {selectedImpl.operationalReadiness.goLiveApproval ? '✅ Approuvé pour Go-Live' : '⏳ En attente d\'approbation'}
            </div>
          </div>
        </div>
      )}

      {/* Prochains jalons */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📅 Prochains jalons critiques</h3>
        
        <div className="space-y-3">
          {progress.nextMilestones.map((milestone, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  milestone.critical ? 'bg-red-600' : 'bg-blue-600'
                }`}></div>
                <div>
                  <div className="font-medium text-gray-900">{milestone.name}</div>
                  <div className="text-sm text-gray-600">{milestone.implementation}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{milestone.date}</div>
                <div className={`text-xs ${
                  milestone.critical ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {milestone.critical ? 'Critique' : 'Standard'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risques critiques */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">⚠️ Risques critiques à surveiller</h3>
        
        <div className="space-y-3">
          {progress.criticalRisks.map((risk, index) => (
            <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{risk.name}</h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  risk.riskLevel === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {risk.riskLevel}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{risk.mitigation}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{risk.implementation}</span>
                <span>Responsable: {risk.owner}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🚀 Mise en œuvre opérationnelle
        </h1>
        <p className="text-gray-600">
          Plans de déploiement détaillés des mesures de sécurité avec timeline, budget et procédures
        </p>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex border-b overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Vue d\'ensemble', icon: Target },
            { id: 'timeline', label: '📅 Timeline', icon: Calendar },
            { id: 'budget', label: '💰 Budget', icon: DollarSign },
            { id: 'resources', label: '👥 Ressources', icon: Users },
            { id: 'procedures', label: '📋 Procédures', icon: FileText },
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
        {/* Autres vues à implémenter */}
      </div>
    </div>
  );
};

export default OperationalImplementationViewer;
