/**
 * ⚙️ VISUALISEUR SCÉNARIOS OPÉRATIONNELS
 * Interface pour l'Atelier 4 - Modes opératoires techniques détaillés
 */

import React, { useState } from 'react';
import { 
  Route, 
  Target, 
  Clock, 
  Shield, 
  AlertTriangle,
  Eye,
  Layers,
  GitBranch,
  Zap,
  Lock,
  CheckCircle,
  ArrowRight,
  Settings,
  Activity,
  Search
} from 'lucide-react';
import OperationalScenariosContent, { OperationalScenarioStep, MitreTechnique, IOCIndicator } from '../../domain/workshop4/OperationalScenariosContent';

// 🎯 PROPS DU COMPOSANT
interface OperationalScenariosViewerProps {
  selectedStep?: string;
  onStepComplete?: (stepId: string) => void;
  onNavigateToWorkshop?: (workshopId: number) => void;
}

export const OperationalScenariosViewer: React.FC<OperationalScenariosViewerProps> = ({
  selectedStep,
  onStepComplete,
  onNavigateToWorkshop
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'methodology' | 'ransomware' | 'insider' | 'gravity' | 'detection'>('overview');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // 📊 DONNÉES
  const steps = OperationalScenariosContent.getAllSteps();
  const mitreMapping = OperationalScenariosContent.getMitreMapping();
  const allIOCs = OperationalScenariosContent.getAllIOCs();
  const totalDuration = OperationalScenariosContent.getTotalDuration();

  // 🎯 VUE D'ENSEMBLE
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <Route className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{steps.length}</div>
          <div className="text-sm text-blue-700">Étapes</div>
          <div className="text-xs text-blue-600">{totalDuration} minutes</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">{mitreMapping.length}</div>
          <div className="text-sm text-purple-700">Techniques</div>
          <div className="text-xs text-purple-600">MITRE ATT&CK</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <Search className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-900">{allIOCs.length}</div>
          <div className="text-sm text-orange-700">IOCs</div>
          <div className="text-xs text-orange-600">Indicateurs</div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-900">2</div>
          <div className="text-sm text-red-700">Modes</div>
          <div className="text-xs text-red-600">Critiques</div>
        </div>
      </div>

      {/* Progression des étapes */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-6">⚙️ Progression Atelier 4 - Scénarios opérationnels</h3>
        
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
                onClick={() => setActiveView(step.id.replace('w4-', '') as any)}
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

      {/* Aperçu des modes opératoires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-red-50 rounded-lg p-6">
          <h4 className="font-semibold text-red-900 mb-4">🥇 Ransomware SIH Urgences</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-800">Complexité</span>
              <div className="flex items-center space-x-1">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-red-600 rounded-full" />
                ))}
                <span className="text-red-700 ml-1">9/10</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-800">Durée</span>
              <span className="text-red-700">3-6 semaines</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-800">Techniques MITRE</span>
              <span className="text-red-700">15 mappées</span>
            </div>
            
            <div className="bg-white rounded p-3 mt-3">
              <div className="text-xs font-medium text-red-900 mb-1">Phases clés :</div>
              <ul className="text-xs text-red-800 space-y-1">
                <li>• Reconnaissance OSINT (2-4 sem)</li>
                <li>• Spear-phishing médecin (24-72h)</li>
                <li>• Escalade privilèges (1-3 jours)</li>
                <li>• Chiffrement LockBit (2-6h)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6">
          <h4 className="font-semibold text-orange-900 mb-4">🥈 Abus privilèges administrateur</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-orange-800">Complexité</span>
              <div className="flex items-center space-x-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-orange-600 rounded-full" />
                ))}
                <span className="text-orange-700 ml-1">4/10</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-orange-800">Durée</span>
              <span className="text-orange-700">Immédiat</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-orange-800">Techniques MITRE</span>
              <span className="text-orange-700">8 mappées</span>
            </div>
            
            <div className="bg-white rounded p-3 mt-3">
              <div className="text-xs font-medium text-orange-900 mb-1">Phases clés :</div>
              <ul className="text-xs text-orange-800 space-y-1">
                <li>• Planification fenêtres temporelles</li>
                <li>• Accès direct bases données</li>
                <li>• Contournement logs audit</li>
                <li>• Exfiltration données patients</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Mapping MITRE ATT&CK */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">🛠️ Techniques MITRE ATT&CK identifiées</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mitreMapping.slice(0, 4).map(technique => (
            <div key={technique.id} className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-purple-900">{technique.id}</h4>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                  {technique.tactic.split(',')[0]}
                </span>
              </div>
              <h5 className="font-medium text-purple-800 mb-2">{technique.name}</h5>
              <p className="text-sm text-purple-700 mb-3">{technique.description}</p>
              
              <div className="space-y-2">
                <div>
                  <div className="text-xs font-medium text-purple-900">Procédures :</div>
                  <ul className="text-xs text-purple-700">
                    {technique.procedures.slice(0, 2).map((proc, index) => (
                      <li key={index}>• {proc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setActiveView('methodology')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Voir toutes les techniques
          </button>
        </div>
      </div>

      {/* IOCs identifiés */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">🔍 Indicateurs de compromission (IOCs)</h3>
        
        <div className="space-y-3">
          {allIOCs.slice(0, 3).map((ioc, index) => (
            <div key={index} className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    ioc.type === 'domain' ? 'bg-blue-100 text-blue-700' :
                    ioc.type === 'ip_address' ? 'bg-green-100 text-green-700' :
                    ioc.type === 'behavioral' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {ioc.type.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    ioc.confidence === 'high' ? 'bg-red-100 text-red-700' :
                    ioc.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {ioc.confidence}
                  </span>
                </div>
              </div>
              
              <div className="font-mono text-sm text-gray-800 mb-2">{ioc.value}</div>
              <div className="text-sm text-gray-600 mb-1">{ioc.description}</div>
              <div className="text-xs text-gray-500">{ioc.context}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setActiveView('detection')}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Voir tous les IOCs
          </button>
        </div>
      </div>
    </div>
  );

  // 📚 RENDU MÉTHODOLOGIE
  const renderMethodology = () => {
    const step = steps.find(s => s.id === 'w4-methodology');
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
          ⚙️ Atelier 4 - Scénarios opérationnels
        </h1>
        <p className="text-gray-600">
          Transformez les scénarios stratégiques en modes opératoires techniques détaillés avec mapping MITRE ATT&CK
        </p>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="flex border-b overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Vue d\'ensemble', icon: Target },
            { id: 'methodology', label: '📚 Méthodologie', icon: Settings },
            { id: 'ransomware', label: '🥇 Ransomware', icon: AlertTriangle },
            { id: 'insider', label: '🥈 Abus privilèges', icon: Lock },
            { id: 'gravity', label: '📊 Gravité', icon: Activity },
            { id: 'detection', label: '🔍 Détection', icon: Eye }
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

export default OperationalScenariosViewer;
