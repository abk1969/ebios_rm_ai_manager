import React, { useState } from 'react';
import { 
  BookOpen, 
  Target, 
  Shield, 
  Users, 
  Network,
  Eye,
  CheckCircle, 
  Clock,
  ArrowRight,
  Play,
  Award,
  FileText,
  AlertTriangle,
  Globe
} from 'lucide-react';
import Button from '../../../../components/ui/button';
import { Workshop2ExerciseViewer } from './Workshop2ExerciseViewer';
import { RiskSourcesContent } from '../../domain/workshop2/RiskSourcesContent';
import { Workshop2ToWorkshop3Integration } from '../../domain/workshop2/Workshop2ToWorkshop3Integration';

interface Workshop2ViewerProps {
  onNavigateToWorkshop?: (workshopId: number) => void;
  onComplete?: (results: any) => void;
}

type ViewMode = 'overview' | 'content' | 'exercises' | 'integration' | 'deliverables';

export const Workshop2Viewer: React.FC<Workshop2ViewerProps> = ({
  onNavigateToWorkshop,
  onComplete
}) => {
  const [activeView, setActiveView] = useState<ViewMode>('overview');
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  const modules = RiskSourcesContent.getAllModules();
  const totalDuration = RiskSourcesContent.getTotalDuration();

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
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Atelier 2 - Sources de Risque
            </h1>
            <p className="text-red-100 text-lg">
              Identifier et analyser les sources de risque menaçant le CHU Métropolitain
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{totalDuration + 130} min</div>
            <div className="text-red-200">Durée totale</div>
          </div>
        </div>
      </div>

      {/* Objectifs d'apprentissage */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-red-600" />
          Objectifs d'apprentissage
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-sm">Identifier les sources externes spécialisées secteur santé</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-sm">Analyser les menaces internes spécifiques au milieu hospitalier</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-sm">Évaluer les risques de la chaîne d'approvisionnement</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-sm">Maîtriser la threat intelligence sectorielle</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-sm">Prioriser les sources selon la menace pour le CHU</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
              <span className="text-sm">Préparer les orientations pour l'Atelier 3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Structure de l'atelier */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-red-600" />
          Structure de l'atelier
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Shield className="w-5 h-5 text-red-600 mr-2" />
              <span className="font-medium">Point 1</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">Sources Externes</h3>
            <p className="text-xs text-gray-600 mb-2">85 minutes de contenu théorique</p>
            <div className="text-xs text-red-600">
              Cybercriminels • États • Écosystème
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-orange-600 mr-2" />
              <span className="font-medium">Point 2</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">Exploitation A1</h3>
            <p className="text-xs text-gray-600 mb-2">Transmission biens essentiels</p>
            <div className="text-xs text-orange-600">
              Contexte • Assets • Dépendances
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Network className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-medium">Point 3</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">Liens vers A3</h3>
            <p className="text-xs text-gray-600 mb-2">Orientations scénarios</p>
            <div className="text-xs text-purple-600">
              Sources → Événements • Calibrage
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Award className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium">Point 4</span>
            </div>
            <h3 className="font-semibold text-sm mb-1">Exercices Pratiques</h3>
            <p className="text-xs text-gray-600 mb-2">130 minutes d'exercices</p>
            <div className="text-xs text-blue-600">
              5 exercices • 540 points
            </div>
          </div>
        </div>
      </div>

      {/* Threat Landscape 2024 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Globe className="w-5 h-5 mr-2 text-red-600" />
          Threat Landscape Santé 2024
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium mb-2 text-red-700">Sources Externes</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• LockBit 3.0 - 40% attaques hôpitaux</li>
              <li>• APT40 - Espionnage recherche COVID</li>
              <li>• Conti successeurs - Expertise santé</li>
              <li>• Trafiquants données - 250€/dossier</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2 text-orange-700">Menaces Internes</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 35% incidents origine interne</li>
              <li>• Burnout post-COVID persistant</li>
              <li>• Turnover élevé (25%/an)</li>
              <li>• Sous-effectifs IT critiques</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2 text-purple-700">Supply Chain</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Attaques éditeurs +200%</li>
              <li>• Dépendances cloud critiques</li>
              <li>• Fournisseurs uniques (SPOF)</li>
              <li>• Interconnexions complexes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={() => setActiveView('content')}
          className="bg-red-600 hover:bg-red-700"
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
        <h2 className="text-2xl font-bold">Contenu théorique - Atelier 2</h2>
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

            {/* Threat Intelligence */}
            {module.threatIntelligence.length > 0 && (
              <div className="mt-4 bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <Eye className="w-4 h-4 mr-1 text-red-600" />
                  Threat Intelligence :
                </h4>
                {module.threatIntelligence.map((ti, idx) => (
                  <div key={idx} className="mb-2 last:mb-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm text-red-700">{ti.source}</span>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                        {ti.reliability}/{ti.confidence}
                      </span>
                      <span className="text-xs text-gray-500">{ti.date}</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">{ti.information}</p>
                  </div>
                ))}
              </div>
            )}

            {module.examples.length > 0 && (
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Exemples concrets :</h4>
                {module.examples.map((example, idx) => (
                  <div key={idx} className="mb-3 last:mb-0">
                    <div className="font-medium text-sm text-blue-800">{example.title}</div>
                    <div className="text-sm text-blue-700 mb-1">{example.description}</div>
                    <div className="text-xs text-blue-600">
                      Impact: {example.impact} | Acteurs: {example.threatActors.join(', ')}
                    </div>
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
    <Workshop2ExerciseViewer
      onComplete={handleExerciseComplete}
      onNavigateToWorkshop={onNavigateToWorkshop}
    />
  );

  const renderIntegration = () => {
    const handoverData = Workshop2ToWorkshop3Integration.generateHandoverDocument();
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Intégration Atelier 2 → Atelier 3</h2>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Sources priorisées pour l'Atelier 3</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Sources prioritaires identifiées</h4>
              <div className="space-y-2">
                {handoverData.prioritizedSources.map((source: any) => (
                  <div key={source.id} className="bg-gray-50 p-3 rounded">
                    <div className="font-medium text-sm">{source.name}</div>
                    <div className="text-xs text-gray-600">
                      Priorité {source.priority} | Score: {source.score}/20
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Scénarios: {source.relevantScenarios.length}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Scénarios stratégiques orientés</h4>
              <div className="space-y-2">
                {handoverData.workshop3Orientations.strategicScenarios.map((scenario: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded">
                    <div className="font-medium text-sm">{scenario.title}</div>
                    <div className="text-xs text-gray-600">
                      Impact: {scenario.expectedImpact}
                    </div>
                    <div className="text-xs text-orange-600">
                      Vraisemblance: {scenario.likelihood}/5 | Sophistication: {scenario.sophisticationRequired}/5
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
            <Button onClick={() => onNavigateToWorkshop(3)}>
              Continuer vers Atelier 3
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderDeliverables = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Livrables Atelier 2</h2>
      
      <div className="grid gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-red-600" />
            Cartographie sources priorisées
          </h3>
          <p className="text-gray-600 mb-4">
            15 sources prioritaires avec profils détaillés et justifications
          </p>
          <div className="text-sm text-gray-500">
            Format: PDF + Excel | Pages: 40 | Classification: Confidentiel Défense
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Eye className="w-5 h-5 mr-2 text-orange-600" />
            Profils détaillés sources critiques
          </h3>
          <p className="text-gray-600 mb-4">
            Fiches techniques avec motivations, capacités et IOC
          </p>
          <div className="text-sm text-gray-500">
            Format: Fiches 4 pages/source | Total: 60 pages | Mise à jour: Mensuelle
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <ArrowRight className="w-5 h-5 mr-2 text-purple-600" />
            Document de liaison A2→A3
          </h3>
          <p className="text-gray-600 mb-4">
            Orientations scénarios avec correspondance sources → événements
          </p>
          <div className="text-sm text-gray-500">
            Validation: RSSI + Direction + CERT | Diffusion: Équipe EBIOS RM
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
                  ? 'bg-white text-red-600 shadow-sm'
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
