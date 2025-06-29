import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Network,
  Navigation,
  Settings,
  TrendingUp,
  FileText,
  Eye,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  MessageCircle
} from 'lucide-react';
import Button from '../../../../components/ui/button';
import { Workshop1Viewer } from './Workshop1Viewer';
import { Workshop2Viewer } from './Workshop2Viewer';
import { GlobalWorkshopLinksViewer } from './GlobalWorkshopLinksViewer';
import { SmartWorkshopNavigator } from './SmartWorkshopNavigator';
import { WorkshopNavigationService } from '../../domain/services/WorkshopNavigationService';
import { GlobalWorkshopLinksManager } from '../../domain/services/GlobalWorkshopLinksManager';

interface IntegratedWorkshopManagerProps {
  initialWorkshop?: number;
  onComplete?: (results: any) => void;
  sessionId?: string;
  trainingMode?: string;
  className?: string;
}

type ViewMode = 'workshop' | 'navigation' | 'links' | 'overview';

export const IntegratedWorkshopManager: React.FC<IntegratedWorkshopManagerProps> = ({
  initialWorkshop = 1,
  onComplete,
  sessionId,
  trainingMode,
  className = ''
}) => {
  const [currentWorkshop, setCurrentWorkshop] = useState(initialWorkshop);
  const [viewMode, setViewMode] = useState<ViewMode>('workshop');
  const [workshopResults, setWorkshopResults] = useState<{ [key: number]: any }>({});
  const [globalStats, setGlobalStats] = useState<any>(null);

  useEffect(() => {
    // Charger les statistiques globales
    const loadGlobalStats = async () => {
      try {
        const chainData = GlobalWorkshopLinksManager.analyzeGlobalChain();
        setGlobalStats({
          completedWorkshops: chainData.workshop1.completed ? 1 : 0 + (chainData.workshop2.completed ? 1 : 0),
          totalWorkshops: 5,
          globalScore: chainData.validation.score,
          linkHealth: chainData.links.global_flow.overallHealth,
          traceabilityScore: chainData.traceability.coverage.coveragePercentage
        });
      } catch (error) {
        console.error('Error loading global stats:', error);
      }
    };

    loadGlobalStats();
  }, [currentWorkshop]);

  const handleWorkshopNavigation = (workshopId: number) => {
    const validation = WorkshopNavigationService.validateNavigation(currentWorkshop, workshopId);
    
    if (validation.valid) {
      setCurrentWorkshop(workshopId);
      setViewMode('workshop');
    } else {
      alert(`Navigation impossible :\n${validation.reasons.join('\n')}`);
    }
  };

  const handleWorkshopComplete = (workshopId: number, results: any) => {
    setWorkshopResults(prev => ({
      ...prev,
      [workshopId]: results
    }));

    // Mettre à jour les statistiques globales
    setGlobalStats((prev: any) => prev ? {
      ...prev,
      completedWorkshops: prev.completedWorkshops + 1
    } : null);

    // Enrichir les résultats avec contexte session
    const enrichedResults = {
      workshopId,
      results,
      allResults: workshopResults,
      sessionId,
      trainingMode,
      timestamp: new Date().toISOString(),
      metrics: {
        timeSpent: results.timeSpent || 0,
        score: results.score || 0,
        maxScore: results.maxScore || 0,
        completionRate: results.score && results.maxScore ? (results.score / results.maxScore) * 100 : 0
      }
    };

    if (onComplete) {
      onComplete(enrichedResults);
    }
  };

  const renderWorkshopContent = () => {
    switch (currentWorkshop) {
      case 1:
        return (
          <Workshop1Viewer
            onNavigateToWorkshop={handleWorkshopNavigation}
            onComplete={(results) => handleWorkshopComplete(1, results)}
            sessionContext={{
              sessionId,
              trainingMode,
              timestamp: new Date().toISOString()
            }}
          />
        );
      case 2:
        return (
          <Workshop2Viewer
            onNavigateToWorkshop={handleWorkshopNavigation}
            onComplete={(results) => handleWorkshopComplete(2, results)}
            sessionContext={{
              sessionId,
              trainingMode,
              timestamp: new Date().toISOString()
            }}
          />
        );
      case 3:
        return (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Atelier 3 - Scénarios Stratégiques</h2>
            <p className="text-gray-600 mb-6">Cet atelier sera disponible après la finalisation des Ateliers 1 et 2.</p>
            <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
              <h3 className="font-medium text-blue-900 mb-2">Données transmises depuis l'Atelier 2 :</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 15 sources de risque priorisées</li>
                <li>• Profils détaillés des menaces critiques</li>
                <li>• Orientations pour scénarios stratégiques</li>
                <li>• Correspondance sources → événements redoutés</li>
              </ul>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Atelier 4 - Modes Opératoires</h2>
            <p className="text-gray-600 mb-6">Cet atelier sera disponible après la finalisation de l'Atelier 3.</p>
            <div className="bg-orange-50 p-4 rounded-lg max-w-md mx-auto">
              <h3 className="font-medium text-orange-900 mb-2">En attente des données de l'Atelier 3 :</h3>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Scénarios stratégiques validés</li>
                <li>• Événements redoutés priorisés</li>
                <li>• Niveaux de risque évalués</li>
                <li>• Orientations modes opératoires</li>
              </ul>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Atelier 5 - Traitement du Risque</h2>
            <p className="text-gray-600 mb-6">Cet atelier sera disponible après la finalisation de l'Atelier 4.</p>
            <div className="bg-green-50 p-4 rounded-lg max-w-md mx-auto">
              <h3 className="font-medium text-green-900 mb-2">En attente des données de l'Atelier 4 :</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Modes opératoires détaillés</li>
                <li>• Vecteurs d'attaque identifiés</li>
                <li>• Techniques MITRE mappées</li>
                <li>• Chemins d'attaque analysés</li>
              </ul>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Atelier non trouvé</h2>
            <p className="text-gray-600">L'atelier demandé n'existe pas.</p>
          </div>
        );
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* En-tête intégré formation */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Ateliers EBIOS RM Interactifs</h1>
            <p className="text-blue-100">
              Parcours pratique avec exercices experts et liens inter-ateliers
            </p>
            {sessionId && (
              <div className="text-blue-200 text-sm mt-1">
                Session: {sessionId} • Mode: {trainingMode}
              </div>
            )}
          </div>
          {globalStats && (
            <div className="text-right">
              <div className="text-2xl font-bold">{globalStats.completedWorkshops}/{globalStats.totalWorkshops}</div>
              <div className="text-blue-200">Ateliers terminés</div>
              <div className="text-sm text-blue-300 mt-1">Score: {globalStats.globalScore}%</div>
            </div>
          )}
        </div>
      </div>

      {/* Statistiques globales */}
      {globalStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium">Score Global</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{globalStats.globalScore}%</div>
            <div className="text-sm text-blue-600">Qualité formation</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <Network className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium">Liens</span>
            </div>
            <div className="text-2xl font-bold text-green-700 capitalize">{globalStats.linkHealth}</div>
            <div className="text-sm text-green-600">Santé des liens</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-medium">Traçabilité</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">{globalStats.traceabilityScore}%</div>
            <div className="text-sm text-purple-600">Couverture</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-orange-600 mr-2" />
              <span className="font-medium">Progression</span>
            </div>
            <div className="text-2xl font-bold text-orange-700">
              {Math.round((globalStats.completedWorkshops / globalStats.totalWorkshops) * 100)}%
            </div>
            <div className="text-sm text-orange-600">Avancement</div>
          </div>
        </div>
      )}

      {/* Navigation rapide */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Accès rapide aux ateliers</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((workshopId) => {
            const metadata = WorkshopNavigationService.getWorkshopMetadata(workshopId);
            const status = GlobalWorkshopLinksManager.getWorkshopStatus(workshopId);
            
            return (
              <button
                key={workshopId}
                onClick={() => handleWorkshopNavigation(workshopId)}
                disabled={status === 'blocked'}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  status === 'completed' ? 'bg-green-50 border-green-200 hover:bg-green-100' :
                  status === 'active' ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' :
                  status === 'pending' ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100' :
                  'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50'
                }`}
              >
                <div className="font-semibold text-sm mb-1">Atelier {workshopId}</div>
                <div className="text-xs text-gray-600 mb-2">{metadata?.title}</div>
                <div className="text-xs">
                  <span className={`px-2 py-1 rounded ${
                    status === 'completed' ? 'bg-green-100 text-green-700' :
                    status === 'active' ? 'bg-blue-100 text-blue-700' :
                    status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {status === 'completed' ? 'Terminé' :
                     status === 'active' ? 'En cours' :
                     status === 'pending' ? 'En attente' :
                     'Bloqué'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions principales */}
      <div className="flex justify-center space-x-4">
        <Button onClick={() => setViewMode('workshop')}>
          <BookOpen className="w-4 h-4 mr-2" />
          Aller à l'atelier {currentWorkshop}
        </Button>
        <Button onClick={() => setViewMode('navigation')} variant="outline">
          <Navigation className="w-4 h-4 mr-2" />
          Navigation intelligente
        </Button>
        <Button onClick={() => setViewMode('links')} variant="outline">
          <Network className="w-4 h-4 mr-2" />
          Voir les liens
        </Button>
      </div>

      {/* Navigation inter-modes formation */}
      {sessionId && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-3">Autres modes de formation disponibles :</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a
              href={`/training/session/${sessionId}?mode=expert-chat`}
              className="flex items-center p-3 bg-white rounded border hover:border-blue-300 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <div className="font-medium text-sm">Chat Expert</div>
                <div className="text-xs text-gray-600">Questions personnalisées</div>
              </div>
            </a>
            <a
              href={`/training/session/${sessionId}?mode=case-study`}
              className="flex items-center p-3 bg-white rounded border hover:border-blue-300 transition-colors"
            >
              <FileText className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <div className="font-medium text-sm">Cas d'étude</div>
                <div className="text-xs text-gray-600">Analyse pratique CHU</div>
              </div>
            </a>
            <a
              href={`/training/session/${sessionId}?mode=discovery`}
              className="flex items-center p-3 bg-white rounded border hover:border-blue-300 transition-colors"
            >
              <Eye className="w-5 h-5 text-purple-600 mr-3" />
              <div>
                <div className="font-medium text-sm">Découverte</div>
                <div className="text-xs text-gray-600">Fondamentaux EBIOS RM</div>
              </div>
            </a>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`h-full bg-gray-50 ${className}`}>
      {/* Navigation compacte intégrée */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3">
          <div className="flex justify-between items-center">
            {/* Navigation modes compacte */}
            <div className="flex space-x-1">
              {[
                { key: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
                { key: 'workshop', label: `Atelier ${currentWorkshop}`, icon: BookOpen },
                { key: 'navigation', label: 'Navigation', icon: Navigation },
                { key: 'links', label: 'Liens', icon: Network }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key as ViewMode)}
                  className={`flex items-center px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    viewMode === key
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Métriques compactes */}
            {globalStats && (
              <div className="flex items-center space-x-3 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>{globalStats.completedWorkshops}/5</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{globalStats.globalScore}%</span>
                </div>
                {sessionId && (
                  <div className="text-xs text-gray-500">
                    Session: {sessionId.slice(-8)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal - pleine hauteur */}
      <div className="h-full overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {viewMode === 'overview' && renderOverview()}
          {viewMode === 'workshop' && renderWorkshopContent()}
          {viewMode === 'navigation' && (
            <SmartWorkshopNavigator
              currentWorkshop={currentWorkshop}
              onNavigateToWorkshop={handleWorkshopNavigation}
              onShowLinks={() => setViewMode('links')}
            />
          )}
          {viewMode === 'links' && (
            <GlobalWorkshopLinksViewer
              currentWorkshop={currentWorkshop}
              onNavigateToWorkshop={handleWorkshopNavigation}
            />
          )}
        </div>
      </div>
    </div>
  );
};
