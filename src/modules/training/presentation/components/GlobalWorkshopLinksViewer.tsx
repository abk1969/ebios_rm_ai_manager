import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Database,
  Target,
  Users,
  Route,
  Shield,
  Eye,
  Network,
  Activity,
  TrendingUp,
  FileText,
  Settings
} from 'lucide-react';
import Button from '../../../../components/ui/button';
import { GlobalWorkshopLinksManager, GlobalWorkshopChain } from '../../domain/services/GlobalWorkshopLinksManager';

interface GlobalWorkshopLinksViewerProps {
  currentWorkshop?: number;
  onNavigateToWorkshop?: (workshopId: number) => void;
}

export const GlobalWorkshopLinksViewer: React.FC<GlobalWorkshopLinksViewerProps> = ({
  currentWorkshop = 1,
  onNavigateToWorkshop
}) => {
  const [chainData, setChainData] = useState<GlobalWorkshopChain | null>(null);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChainData = async () => {
      setLoading(true);
      try {
        const data = GlobalWorkshopLinksManager.analyzeGlobalChain();
        setChainData(data);
      } catch (error) {
        console.error('Error loading workshop chain data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadChainData();
  }, []);

  const getWorkshopIcon = (workshopId: number) => {
    switch (workshopId) {
      case 1: return Database;
      case 2: return Target;
      case 3: return Users;
      case 4: return Route;
      case 5: return Shield;
      default: return Settings;
    }
  };

  const getWorkshopTitle = (workshopId: number) => {
    switch (workshopId) {
      case 1: return 'Socle de Sécurité';
      case 2: return 'Sources de Risque';
      case 3: return 'Scénarios Stratégiques';
      case 4: return 'Modes Opératoires';
      case 5: return 'Traitement du Risque';
      default: return 'Atelier';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'blocked': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'active': return Activity;
      case 'pending': return Clock;
      case 'blocked': return AlertTriangle;
      default: return Settings;
    }
  };

  const getLinkStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'active': return 'text-blue-600';
      case 'pending': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Chargement des liens inter-ateliers...</span>
      </div>
    );
  }

  if (!chainData) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600">Impossible de charger les données des liens inter-ateliers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Liens Inter-Ateliers EBIOS RM
            </h1>
            <p className="text-purple-100">
              Visualisation et traçabilité de la chaîne A1→A2→A3→A4→A5
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{chainData.validation.score}%</div>
            <div className="text-purple-200">Score global</div>
          </div>
        </div>
      </div>

      {/* Vue d'ensemble de la chaîne */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Network className="w-5 h-5 mr-2 text-purple-600" />
          Vue d'ensemble de la chaîne
        </h2>
        
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4, 5].map((workshopId, index) => {
            const Icon = getWorkshopIcon(workshopId);
            const status = GlobalWorkshopLinksManager.getWorkshopStatus(workshopId);
            const StatusIcon = getStatusIcon(status);
            
            return (
              <React.Fragment key={workshopId}>
                <div className="flex flex-col items-center">
                  <div 
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      currentWorkshop === workshopId 
                        ? 'ring-2 ring-purple-500 ring-offset-2' 
                        : ''
                    } ${getStatusColor(status)}`}
                    onClick={() => onNavigateToWorkshop?.(workshopId)}
                  >
                    <Icon className="w-8 h-8 mb-2" />
                    <StatusIcon className="w-4 h-4 absolute -top-1 -right-1" />
                  </div>
                  <div className="text-center mt-2">
                    <div className="font-medium text-sm">Atelier {workshopId}</div>
                    <div className="text-xs text-gray-600">{getWorkshopTitle(workshopId)}</div>
                    <div className={`text-xs font-medium ${status === 'completed' ? 'text-green-600' : status === 'active' ? 'text-blue-600' : 'text-gray-500'}`}>
                      {status === 'completed' ? 'Terminé' : status === 'active' ? 'En cours' : status === 'pending' ? 'En attente' : 'Bloqué'}
                    </div>
                  </div>
                </div>
                
                {index < 4 && (
                  <div className="flex flex-col items-center">
                    <ArrowRight 
                      className={`w-6 h-6 ${getLinkStatusColor(
                        index === 0 ? chainData.links.w1_to_w2.status :
                        index === 1 ? chainData.links.w2_to_w3.status :
                        index === 2 ? chainData.links.w3_to_w4.status :
                        chainData.links.w4_to_w5.status
                      )}`} 
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {index === 0 ? 'Biens→Sources' :
                       index === 1 ? 'Sources→Scénarios' :
                       index === 2 ? 'Scénarios→Modes' :
                       'Modes→Mesures'}
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Métriques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium">Efficacité</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {chainData.links.global_flow.transformationEfficiency}%
            </div>
            <div className="text-sm text-blue-600">Transformation</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium">Transmissions</span>
            </div>
            <div className="text-2xl font-bold text-green-700">
              {chainData.links.global_flow.successfulTransmissions}
            </div>
            <div className="text-sm text-green-600">Réussies</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Eye className="w-5 h-5 text-purple-600 mr-2" />
              <span className="font-medium">Traçabilité</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">
              {chainData.traceability.coverage.coveragePercentage}%
            </div>
            <div className="text-sm text-purple-600">Couverture</div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-orange-600 mr-2" />
              <span className="font-medium">Santé</span>
            </div>
            <div className="text-2xl font-bold text-orange-700 capitalize">
              {chainData.links.global_flow.overallHealth}
            </div>
            <div className="text-sm text-orange-600">Globale</div>
          </div>
        </div>
      </div>

      {/* Détails des liens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lien A1→A2 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ArrowRight className="w-5 h-5 mr-2 text-blue-600" />
            Atelier 1 → Atelier 2
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Statut</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                chainData.links.w1_to_w2.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {chainData.links.w1_to_w2.status === 'completed' ? 'Terminé' : 'En cours'}
              </span>
            </div>
            
            <div>
              <span className="text-sm font-medium">Données transmises :</span>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• 15 biens essentiels identifiés</li>
                <li>• Contexte organisationnel CHU</li>
                <li>• Écosystème et dépendances</li>
                <li>• Objectifs de sécurité DICP</li>
              </ul>
            </div>
            
            <div>
              <span className="text-sm font-medium">Transformations :</span>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Biens → Cibles attractives</li>
                <li>• Criticité → Priorité sources</li>
                <li>• Contexte → Environnement menaces</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Lien A2→A3 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ArrowRight className="w-5 h-5 mr-2 text-red-600" />
            Atelier 2 → Atelier 3
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Statut</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                chainData.links.w2_to_w3.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {chainData.links.w2_to_w3.status === 'active' ? 'Actif' : 'En attente'}
              </span>
            </div>
            
            <div>
              <span className="text-sm font-medium">Données transmises :</span>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• 15 sources de risque priorisées</li>
                <li>• Profils détaillés sources critiques</li>
                <li>• Orientations scénarios stratégiques</li>
                <li>• Correspondance sources → événements</li>
              </ul>
            </div>
            
            <div>
              <span className="text-sm font-medium">Transformations :</span>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Sources → Acteurs scénarios</li>
                <li>• Capacités → Sophistication</li>
                <li>• Motivations → Objectifs attaque</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={() => onNavigateToWorkshop?.(currentWorkshop)}
          variant="outline"
        >
          Retour à l'atelier {currentWorkshop}
        </Button>
        
        {currentWorkshop < 5 && (
          <Button 
            onClick={() => onNavigateToWorkshop?.(currentWorkshop + 1)}
            disabled={GlobalWorkshopLinksManager.getWorkshopStatus(currentWorkshop + 1) === 'blocked'}
          >
            Continuer vers l'atelier {currentWorkshop + 1}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
