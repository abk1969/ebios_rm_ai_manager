import React, { useState } from 'react';
import { 
  BookOpen, 
  Target, 
  Users, 
  Shield, 
  CheckCircle, 
  Clock,
  ArrowRight,
  Play,
  Award,
  FileText,
  Network,
  Settings
} from 'lucide-react';
import Button from '../../../../components/ui/button';
import { Workshop1ExerciseViewer } from './Workshop1ExerciseViewer';
import { SecurityFoundationContent } from '../../domain/workshop1/SecurityFoundationContent';
import { Workshop1ToWorkshop2Integration } from '../../domain/workshop1/Workshop1ToWorkshop2Integration';

interface Workshop1ViewerProps {
  onNavigateToWorkshop?: (workshopId: number) => void;
  onComplete?: (results: any) => void;
}

type ViewMode = 'overview' | 'content' | 'exercises' | 'integration' | 'deliverables';

export const Workshop1Viewer: React.FC<Workshop1ViewerProps> = ({
  onNavigateToWorkshop,
  onComplete
}) => {
  const [activeView, setActiveView] = useState<ViewMode>('overview');
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  const modules = SecurityFoundationContent.getAllModules();
  const totalDuration = SecurityFoundationContent.getTotalDuration();

  const handleModuleComplete = (moduleId: string) => {
    setCompletedModules(prev => new Set([...prev, moduleId]));
  };

  const handleExerciseComplete = (results: any) => {
    if (onComplete) {
      onComplete(results);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Atelier 1 - Socle de Sécurité
            </h1>
            <p className="text-blue-100 text-lg">
              Établir les fondations de l'analyse EBIOS RM pour le CHU Métropolitain
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{totalDuration} min</div>
            <div className="text-blue-200">Durée totale</div>
          </div>
        </div>
      </div>

      {/* Objectifs d'apprentissage */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Objectifs d'apprentissage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-sm">Maîtriser la définition du périmètre d'analyse EBIOS RM</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-sm">Identifier les enjeux métier spécifiques au secteur santé</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-sm">Classifier les biens essentiels selon leur criticité</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-sm">Cartographier l'écosystème et les dépendances critiques</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-sm">Définir des objectifs de sécurité adaptés au CHU</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-sm">Préparer les orientations pour l'Atelier 2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structure de l'atelier */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
          Structure de l'atelier
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Settings className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium">Point 1</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">Cadrage et Socle</h3>
            <p className="text-xs text-gray-600 mb-2">90 minutes de contenu théorique</p>
            <div className="text-xs text-blue-600">
              Périmètre • Enjeux • Objectifs
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium">Point 2</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">Biens Essentiels</h3>
            <p className="text-xs text-gray-600 mb-2">Méthodologie d'identification</p>
            <div className="text-xs text-green-600">
              Classification • BIA • Validation
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Network className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-medium">Point 3</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">Liens vers A2</h3>
            <p className="text-xs text-gray-600 mb-2">Transmission structurée</p>
            <div className="text-xs text-purple-600">
              Handover • Orientations • Données
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Award className="w-5 h-5 text-orange-600 mr-2" />
              <span className="font-medium">Point 4</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">Exercices Pratiques</h3>
            <p className="text-xs text-gray-600 mb-2">120 minutes d'exercices</p>
            <div className="text-xs text-orange-600">
              5 exercices • 480 points
            </div>
          </div>
        </div>
      </div>

      {/* Contexte CHU */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-600" />
          Contexte CHU Métropolitain
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium mb-2">Infrastructure</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 3 sites interconnectés</li>
              <li>• 1200 lits au total</li>
              <li>• 3500 employés</li>
              <li>• Budget 450M€/an</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Spécialités</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Urgences vitales 24h/24</li>
              <li>• Réanimation</li>
              <li>• Cardiologie</li>
              <li>• Neurochirurgie</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Enjeux</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Continuité soins vitaux</li>
              <li>• Conformité HDS/RGPD</li>
              <li>• Sécurité patients</li>
              <li>• Réputation territoriale</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={() => setActiveView('content')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Play className="w-4 h-4 mr-2" />
          Commencer le contenu théorique
        </Button>
        <Button 
          onClick={() => setActiveView('exercises')}
          variant="outline"
        >
          <Award className="w-4 h-4 mr-2" />
          Aller aux exercices pratiques
        </Button>
      </div>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contenu théorique - Atelier 1</h2>
        <div className="text-sm text-gray-600">
          {completedModules.size}/{modules.length} modules terminés
        </div>
      </div>

      <div className="grid gap-6">
        {modules.map((module, index) => (
          <div key={module.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Module {index + 1}: {module.title}
                </h3>
                <p className="text-gray-600 mb-2">{module.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {module.duration} minutes
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {completedModules.has(module.id) && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                <Button
                  size="sm"
                  onClick={() => handleModuleComplete(module.id)}
                  disabled={completedModules.has(module.id)}
                >
                  {completedModules.has(module.id) ? 'Terminé' : 'Étudier'}
                </Button>
              </div>
            </div>

            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: module.content.replace(/\n/g, '<br/>') }} />
            </div>

            {module.examples.length > 0 && (
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Exemples concrets :</h4>
                {module.examples.map((example, idx) => (
                  <div key={idx} className="mb-2 last:mb-0">
                    <div className="font-medium text-sm">{example.title}</div>
                    <div className="text-sm text-gray-600">{example.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button onClick={() => setActiveView('overview')} variant="outline">
          Retour à l'aperçu
        </Button>
        <Button onClick={() => setActiveView('exercises')}>
          Passer aux exercices
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderExercises = () => (
    <Workshop1ExerciseViewer
      onComplete={handleExerciseComplete}
      onNavigateToWorkshop={onNavigateToWorkshop}
    />
  );

  const renderIntegration = () => {
    const handoverData = Workshop1ToWorkshop2Integration.generateHandoverDocument();
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Intégration Atelier 1 → Atelier 2</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Données transmises à l'Atelier 2</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Biens essentiels identifiés</h4>
              <div className="space-y-2">
                {handoverData.essentialAssets.map((asset: any) => (
                  <div key={asset.id} className="bg-gray-50 p-3 rounded">
                    <div className="font-medium text-sm">{asset.name}</div>
                    <div className="text-xs text-gray-600">
                      Criticité: {asset.criticality} | Score: {asset.impactAnalysis.globalScore}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Orientations sources de risque</h4>
              <div className="space-y-2">
                {handoverData.orientations.prioritySources.map((source: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded">
                    <div className="font-medium text-sm">{source.category}</div>
                    <div className="text-xs text-gray-600">
                      Priorité {source.priority} | {source.justification}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button onClick={() => setActiveView('exercises')} variant="outline">
            Retour aux exercices
          </Button>
          {onNavigateToWorkshop && (
            <Button onClick={() => onNavigateToWorkshop(2)}>
              Continuer vers Atelier 2
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderDeliverables = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Livrables Atelier 1</h2>
      
      <div className="grid gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Inventaire des biens essentiels
          </h3>
          <p className="text-gray-600 mb-4">
            Document complet avec classification et justifications métier
          </p>
          <div className="text-sm text-gray-500">
            Format: PDF + Excel | Pages: 25-30 | Validation: Comité multidisciplinaire
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Network className="w-5 h-5 mr-2 text-green-600" />
            Cartographie des dépendances
          </h3>
          <p className="text-gray-600 mb-4">
            Schémas et analyse des risques de l'écosystème CHU
          </p>
          <div className="text-sm text-gray-500">
            Format: Visio + Document | Mise à jour: Trimestrielle
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Target className="w-5 h-5 mr-2 text-purple-600" />
            Objectifs de sécurité CHU
          </h3>
          <p className="text-gray-600 mb-4">
            Définition DICP avec seuils mesurables et justifications
          </p>
          <div className="text-sm text-gray-500">
            Validation: Direction + RSSI | Révision: Annuelle
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'overview', label: 'Aperçu', icon: BookOpen },
            { key: 'content', label: 'Contenu', icon: FileText },
            { key: 'exercises', label: 'Exercices', icon: Award },
            { key: 'integration', label: 'Intégration', icon: ArrowRight },
            { key: 'deliverables', label: 'Livrables', icon: Target }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveView(key as ViewMode)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      {activeView === 'overview' && renderOverview()}
      {activeView === 'content' && renderContent()}
      {activeView === 'exercises' && renderExercises()}
      {activeView === 'integration' && renderIntegration()}
      {activeView === 'deliverables' && renderDeliverables()}
    </div>
  );
};
