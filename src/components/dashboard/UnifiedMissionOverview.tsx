/**
 * 🎯 COMPOSANT VUE D'ENSEMBLE MISSION UNIFIÉE
 * Vue d'ensemble simplifiée et orientée action pour la navigation entre ateliers
 * 
 * CARACTÉRISTIQUES :
 * - Vue d'ensemble de la mission avec métriques clés
 * - Cartes d'ateliers avec statuts visuels et actions
 * - Prochaines actions recommandées
 * - Intégration sans régression avec l'architecture existante
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Target, 
  Users, 
  Route, 
  Shield, 
  CheckCircle, 
  Clock, 
  Lock, 
  AlertCircle,
  ArrowRight as _ArrowRight,
  TrendingUp,
  AlertTriangle,
  Play,
  Eye,
  Edit
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// 🎯 TYPES ET INTERFACES
interface WorkshopOverview {
  id: number;
  name: string;
  shortName: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  completionPercentage: number;
  canAccess: boolean;
  blockingReasons?: string[];
  keyMetrics: {
    itemsCount: number;
    itemsLabel: string;
    criticalIssues: number;
  };
  nextActions: string[];
}

interface MissionOverview {
  id: string;
  name: string;
  description: string;
  globalProgress: number;
  anssiComplianceScore: number;
  criticalIssues: number;
  lastActivity: string;
  workshops: WorkshopOverview[];
}

interface UnifiedMissionOverviewProps {
  missionId: string;
  missionName: string;
  className?: string;
  onWorkshopClick?: (workshopId: number) => void;
}

// 🎯 CONFIGURATION DES ATELIERS EBIOS RM
const DEFAULT_WORKSHOPS: Omit<WorkshopOverview, 'status' | 'completionPercentage' | 'canAccess' | 'keyMetrics' | 'nextActions'>[] = [
  {
    id: 1,
    name: 'Atelier 1',
    shortName: 'Cadrage',
    description: 'Socle de sécurité et valeurs métier',
    icon: Database,
    blockingReasons: []
  },
  {
    id: 2,
    name: 'Atelier 2', 
    shortName: 'Sources',
    description: 'Sources de risque et objectifs visés',
    icon: Target,
    blockingReasons: []
  },
  {
    id: 3,
    name: 'Atelier 3',
    shortName: 'Stratégique',
    description: 'Scénarios stratégiques',
    icon: Users,
    blockingReasons: []
  },
  {
    id: 4,
    name: 'Atelier 4',
    shortName: 'Opérationnel', 
    description: 'Scénarios opérationnels',
    icon: Route,
    blockingReasons: []
  },
  {
    id: 5,
    name: 'Atelier 5',
    shortName: 'Traitement',
    description: 'Traitement du risque',
    icon: Shield,
    blockingReasons: []
  }
];

// 🎯 UTILITAIRES
const getStatusColor = (status: WorkshopOverview['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'blocked':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

const getStatusIcon = (status: WorkshopOverview['status']) => {
  switch (status) {
    case 'completed':
      return CheckCircle;
    case 'in-progress':
      return Clock;
    case 'blocked':
      return Lock;
    default:
      return AlertCircle;
  }
};

const getStatusLabel = (status: WorkshopOverview['status']) => {
  switch (status) {
    case 'completed':
      return 'Terminé';
    case 'in-progress':
      return 'En cours';
    case 'blocked':
      return 'Bloqué';
    default:
      return 'Non démarré';
  }
};

// 🎯 COMPOSANT PRINCIPAL
const UnifiedMissionOverview: React.FC<UnifiedMissionOverviewProps> = ({
  missionId,
  missionName,
  className = '',
  onWorkshopClick
}) => {
  const navigate = useNavigate();
  const [missionOverview, setMissionOverview] = useState<MissionOverview | null>(null);
  const [loading, setLoading] = useState(true);

  // 🎯 GÉNÉRATION DES DONNÉES DE DÉMONSTRATION
  useEffect(() => {
    const generateMissionOverview = (): MissionOverview => {
      const workshops: WorkshopOverview[] = DEFAULT_WORKSHOPS.map((workshop, index) => ({
        ...workshop,
        status: index === 0 ? 'in-progress' : index < 1 ? 'completed' : 'not-started',
        completionPercentage: index === 0 ? 65 : index < 1 ? 100 : 0,
        canAccess: index <= 1, // Peut accéder aux 2 premiers
        keyMetrics: {
          itemsCount: index === 0 ? 3 : index < 1 ? 5 : 0,
          itemsLabel: index === 0 ? 'valeurs métier' : index === 1 ? 'sources de risque' : 'éléments',
          criticalIssues: index === 0 ? 1 : 0
        },
        nextActions: index === 0 ? [
          'Ajouter 2 valeurs métier supplémentaires',
          'Définir les événements redoutés',
          'Compléter les actifs supports'
        ] : index === 1 ? [
          'Commencer l\'atelier 2',
          'Identifier les sources de risque'
        ] : [
          'Terminer les ateliers précédents'
        ]
      }));

      const globalProgress = Math.round(
        workshops.reduce((sum, w) => sum + w.completionPercentage, 0) / workshops.length
      );

      return {
        id: missionId,
        name: missionName,
        description: 'Mission d\'analyse de risque EBIOS RM',
        globalProgress,
        anssiComplianceScore: Math.min(globalProgress + 10, 100),
        criticalIssues: workshops.reduce((sum, w) => sum + w.keyMetrics.criticalIssues, 0),
        lastActivity: new Date().toISOString(),
        workshops
      };
    };

    // Simulation d'un chargement
    setTimeout(() => {
      setMissionOverview(generateMissionOverview());
      setLoading(false);
    }, 500);
  }, [missionId, missionName]);

  // 🎯 GESTION DES ACTIONS
  const handleWorkshopClick = (workshop: WorkshopOverview) => {
    if (!workshop.canAccess) {
      return;
    }

    if (workshop.status === 'blocked') {
      // TODO: Afficher modal avec raisons du blocage
      console.log('Atelier bloqué:', workshop.blockingReasons);
      return;
    }

    if (onWorkshopClick) {
      onWorkshopClick(workshop.id);
    } else {
      navigate(`/workshops/${missionId}/${workshop.id}`);
    }
  };

  const getNextRecommendedAction = () => {
    if (!missionOverview) return null;
    
    const inProgressWorkshop = missionOverview.workshops.find(w => w.status === 'in-progress');
    if (inProgressWorkshop) {
      return {
        workshop: inProgressWorkshop,
        action: inProgressWorkshop.nextActions[0] || 'Continuer l\'atelier'
      };
    }

    const nextWorkshop = missionOverview.workshops.find(w => w.status === 'not-started' && w.canAccess);
    if (nextWorkshop) {
      return {
        workshop: nextWorkshop,
        action: 'Commencer l\'atelier'
      };
    }

    return null;
  };

  if (loading) {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!missionOverview) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-600">Impossible de charger la vue d'ensemble de la mission</p>
      </div>
    );
  }

  const nextAction = getNextRecommendedAction();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête de mission avec métriques */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {missionOverview.name}
            </h1>
            <p className="text-gray-600">{missionOverview.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {missionOverview.globalProgress}%
            </div>
            <div className="text-sm text-gray-500">Progression globale</div>
          </div>
        </div>

        {/* Métriques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-blue-900">
                {missionOverview.anssiComplianceScore}%
              </div>
              <div className="text-sm text-blue-600">Conformité ANSSI</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <div className="font-medium text-red-900">
                {missionOverview.criticalIssues}
              </div>
              <div className="text-sm text-red-600">Points critiques</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-medium text-green-900">
                {missionOverview.workshops.filter(w => w.status === 'completed').length}/5
              </div>
              <div className="text-sm text-green-600">Ateliers terminés</div>
            </div>
          </div>
        </div>

        {/* Action recommandée */}
        {nextAction && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <nextAction.workshop.icon className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <div className="font-medium text-yellow-900">
                    Prochaine action recommandée
                  </div>
                  <div className="text-sm text-yellow-700">
                    {nextAction.workshop.name}: {nextAction.action}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleWorkshopClick(nextAction.workshop)}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Play className="h-4 w-4 mr-1" />
                Continuer
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Grille des ateliers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {missionOverview.workshops.map((workshop) => {
          const StatusIcon = getStatusIcon(workshop.status);
          const WorkshopIcon = workshop.icon;
          const isClickable = workshop.canAccess;

          return (
            <Card 
              key={workshop.id}
              className={`
                p-4 transition-all duration-200 border-2
                ${isClickable ? 'cursor-pointer hover:shadow-lg hover:border-blue-300' : 'cursor-default opacity-60'}
                ${workshop.status === 'in-progress' ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}
              `}
              onClick={() => handleWorkshopClick(workshop)}
            >
              {/* En-tête d'atelier */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg ${getStatusColor(workshop.status)}`}>
                    <WorkshopIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{workshop.name}</h3>
                    <p className="text-xs text-gray-500">{workshop.shortName}</p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(workshop.status)}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {getStatusLabel(workshop.status)}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3">{workshop.description}</p>

              {/* Métriques */}
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm">
                  <span className="font-medium">{workshop.keyMetrics.itemsCount}</span>
                  <span className="text-gray-500 ml-1">{workshop.keyMetrics.itemsLabel}</span>
                </div>
                {workshop.keyMetrics.criticalIssues > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {workshop.keyMetrics.criticalIssues} critique{workshop.keyMetrics.criticalIssues > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>

              {/* Barre de progression */}
              {workshop.completionPercentage > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Progression</span>
                    <span>{workshop.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${workshop.completionPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {workshop.nextActions.length > 0 && (
                    <span>{workshop.nextActions.length} action{workshop.nextActions.length > 1 ? 's' : ''}</span>
                  )}
                </div>
                {isClickable && (
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                    {workshop.status === 'in-progress' && (
                      <Button size="sm" className="text-xs px-2 py-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Continuer
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default UnifiedMissionOverview;
