/**
 * 🎯 COMPOSANT FIL D'ARIANE EBIOS RM
 * Fil d'Ariane intelligent pour la navigation entre ateliers EBIOS RM
 * 
 * CARACTÉRISTIQUES :
 * - Progression visuelle des 5 ateliers
 * - États dynamiques (non-démarré, en-cours, complété, bloqué)
 * - Navigation intelligente avec validation des prérequis
 * - Intégration sans régression avec l'architecture existante
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  ChevronRight
} from 'lucide-react';

// 🎯 TYPES ET INTERFACES
interface WorkshopStatus {
  id: number;
  name: string;
  shortName: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  completionPercentage: number;
  canAccess: boolean;
  blockingReasons?: string[];
}

interface EbiosProgressBreadcrumbProps {
  currentWorkshop: number;
  workshopStatuses?: WorkshopStatus[];
  missionId?: string;
  className?: string;
  showPercentage?: boolean;
  showDescriptions?: boolean;
}

// 🎯 CONFIGURATION DES ATELIERS EBIOS RM
const DEFAULT_WORKSHOPS: Omit<WorkshopStatus, 'status' | 'completionPercentage' | 'canAccess'>[] = [
  {
    id: 1,
    name: 'Atelier 1',
    shortName: 'Cadrage',
    description: 'Socle de sécurité et valeurs métier',
    icon: Database
  },
  {
    id: 2,
    name: 'Atelier 2', 
    shortName: 'Sources',
    description: 'Sources de risque et objectifs visés',
    icon: Target
  },
  {
    id: 3,
    name: 'Atelier 3',
    shortName: 'Stratégique',
    description: 'Scénarios stratégiques',
    icon: Users
  },
  {
    id: 4,
    name: 'Atelier 4',
    shortName: 'Opérationnel', 
    description: 'Scénarios opérationnels',
    icon: Route
  },
  {
    id: 5,
    name: 'Atelier 5',
    shortName: 'Traitement',
    description: 'Traitement du risque',
    icon: Shield
  }
];

// 🎯 UTILITAIRES
const getStatusColor = (status: WorkshopStatus['status']) => {
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

const getStatusIcon = (status: WorkshopStatus['status']) => {
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

// 🎯 COMPOSANT PRINCIPAL
const EbiosProgressBreadcrumb: React.FC<EbiosProgressBreadcrumbProps> = ({
  currentWorkshop,
  workshopStatuses,
  missionId,
  className = '',
  showPercentage = true,
  showDescriptions = false
}) => {
  const navigate = useNavigate();
  const params = useParams();
  
  // Récupération du missionId depuis les paramètres si non fourni
  const activeMissionId = missionId || params.missionId;

  // 🎯 GÉNÉRATION DES STATUTS PAR DÉFAUT
  const generateDefaultStatuses = (): WorkshopStatus[] => {
    return DEFAULT_WORKSHOPS.map(workshop => ({
      ...workshop,
      status: workshop.id === currentWorkshop ? 'in-progress' : 
              workshop.id < currentWorkshop ? 'completed' : 'not-started',
      completionPercentage: workshop.id === currentWorkshop ? 50 : 
                           workshop.id < currentWorkshop ? 100 : 0,
      canAccess: workshop.id <= currentWorkshop + 1 // Peut accéder au suivant
    }));
  };

  const workshops = workshopStatuses || generateDefaultStatuses();

  // 🎯 NAVIGATION INTELLIGENTE
  const handleWorkshopClick = (workshop: WorkshopStatus) => {
    if (!workshop.canAccess || !activeMissionId) {
      return;
    }

    if (workshop.status === 'blocked') {
      // TODO: Afficher modal avec raisons du blocage
      console.log('Atelier bloqué:', workshop.blockingReasons);
      return;
    }

    // Navigation vers l'atelier avec mission
    navigate(`/workshops/${activeMissionId}/${workshop.id}`);
  };

  // 🎯 CALCUL DE LA PROGRESSION GLOBALE
  const globalProgress = Math.round(
    workshops.reduce((sum, w) => sum + w.completionPercentage, 0) / workshops.length
  );

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      {/* En-tête avec progression globale */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="text-sm font-medium text-gray-900">
            Progression EBIOS RM
          </h3>
        </div>
        {showPercentage && (
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${globalProgress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-600">
              {globalProgress}%
            </span>
          </div>
        )}
      </div>

      {/* Fil d'Ariane des ateliers */}
      <nav className="flex items-center space-x-1 overflow-x-auto">
        {workshops.map((workshop, index) => {
          const StatusIcon = getStatusIcon(workshop.status);
          const WorkshopIcon = workshop.icon;
          const isClickable = workshop.canAccess && activeMissionId;
          const isCurrent = workshop.id === currentWorkshop;

          return (
            <React.Fragment key={workshop.id}>
              {/* Séparateur */}
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
              )}

              {/* Élément d'atelier */}
              <div
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200
                  ${getStatusColor(workshop.status)}
                  ${isCurrent ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
                  ${isClickable ? 'cursor-pointer hover:shadow-sm' : 'cursor-default'}
                  ${!workshop.canAccess ? 'opacity-60' : ''}
                  flex-shrink-0
                `}
                onClick={() => handleWorkshopClick(workshop)}
                title={
                  !workshop.canAccess 
                    ? 'Atelier non accessible'
                    : workshop.status === 'blocked'
                    ? `Bloqué: ${workshop.blockingReasons?.join(', ')}`
                    : `${workshop.name}: ${workshop.description}`
                }
              >
                {/* Icône d'atelier */}
                <WorkshopIcon className="h-4 w-4 flex-shrink-0" />
                
                {/* Nom et statut */}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-medium truncate">
                      {workshop.shortName}
                    </span>
                    <StatusIcon className="h-3 w-3 flex-shrink-0" />
                  </div>
                  
                  {showDescriptions && (
                    <span className="text-xs opacity-75 truncate">
                      {workshop.description}
                    </span>
                  )}
                  
                  {showPercentage && workshop.completionPercentage > 0 && (
                    <div className="w-full bg-white bg-opacity-50 rounded-full h-1 mt-1">
                      <div 
                        className="bg-current h-1 rounded-full transition-all duration-300"
                        style={{ width: `${workshop.completionPercentage}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Message d'aide contextuel */}
      {!activeMissionId && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          💡 Sélectionnez une mission pour naviguer entre les ateliers
        </div>
      )}
    </div>
  );
};

export default EbiosProgressBreadcrumb;
