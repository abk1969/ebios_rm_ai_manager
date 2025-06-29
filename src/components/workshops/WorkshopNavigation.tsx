import React from 'react';
import { Link, useLocation, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Database, Target, Users, Route, ShieldCheck } from 'lucide-react';
import Button from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// 🚫 SUPPRESSION DES PATHS STATIQUES - UTILISATION DYNAMIQUE AVEC MISSION
const workshops = [
  {
    number: 1,
    title: 'Define the Scope and Security Baseline',
    icon: Database,
    description: 'Establish study framework and evaluate security baseline',
    steps: [
      'Define business values',
      'Identify supporting assets',
      'Evaluate security baseline',
      'Document compliance gaps'
    ]
  },
  {
    number: 2,
    title: 'Risk Sources',
    icon: Target,
    description: 'Identify and analyze potential sources of risk',
    steps: [
      'Identify risk sources',
      'Define objectives',
      'Evaluate pertinence',
      'Document strategic context'
    ]
  },
  {
    number: 3,
    title: 'Strategic Scenarios',
    icon: Users,
    description: 'Develop strategic attack scenarios',
    steps: [
      'Map stakeholders',
      'Define attack paths',
      'Evaluate exposure',
      'Assess cyber reliability'
    ]
  },
  {
    number: 4,
    title: 'Operational Scenarios',
    icon: Route,
    description: 'Define operational attack scenarios',
    steps: [
      'Define attack actions',
      'Evaluate technical difficulty',
      'Assess success probability',
      'Document attack paths'
    ]
  },
  {
    number: 5,
    title: 'Treatment Strategy',
    icon: ShieldCheck,
    description: 'Define and implement security measures',
    steps: [
      'Define security measures',
      'Evaluate residual risk',
      'Create action plan',
      'Monitor implementation'
    ]
  },
];

interface WorkshopNavigationProps {
  currentWorkshop: number;
  totalWorkshops: number;
  onNext?: () => Promise<boolean>;
  onPrevious?: () => Promise<boolean>;
  canProceed?: boolean; // 🔧 CORRECTION: Propriété manquante
}

const WorkshopNavigation: React.FC<WorkshopNavigationProps> = ({
  currentWorkshop,
  totalWorkshops,
  onNext,
  onPrevious,
  canProceed = true // 🔧 CORRECTION: Valeur par défaut
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();

  // 🔧 CORRECTION: Support des deux méthodes de récupération du missionId
  const missionId = params.missionId || searchParams.get('missionId');

  // 🔧 FONCTION SIMPLIFIÉE: URL unifiée avec missionId obligatoire
  const createUrlWithParams = (workshopNumber: number) => {
    if (!missionId) {
      console.error('MissionId requis pour la navigation entre workshops');
      return '/missions'; // Redirection vers la liste des missions si pas de missionId
    }
    return `/workshops/${missionId}/${workshopNumber}`;
  };

  const handleNext = async () => {
    if (onNext) {
      const canProceed = await onNext();
      if (canProceed) {
        if (currentWorkshop < totalWorkshops) {
          navigate(createUrlWithParams(currentWorkshop + 1));
        } else {
          // Redirection vers le rapport final après le dernier atelier
          if (!missionId) {
            navigate('/missions');
            return;
          }
          navigate(`/ebios-report/${missionId}`);
        }
      }
    } else if (currentWorkshop < totalWorkshops) {
      navigate(createUrlWithParams(currentWorkshop + 1));
    } else {
      // Redirection vers le rapport final
      if (!missionId) {
        navigate('/missions');
        return;
      }
      navigate(`/ebios-report/${missionId}`);
    }
  };

  const handlePrevious = async () => {
    if (onPrevious) {
      const canProceed = await onPrevious();
      if (canProceed && currentWorkshop > 1) {
        navigate(createUrlWithParams(currentWorkshop - 1));
      }
    } else if (currentWorkshop > 1) {
      navigate(createUrlWithParams(currentWorkshop - 1));
    }
  };

  return (
    <div className="flex justify-between items-center mt-8">
      <Button
        onClick={handlePrevious}
        disabled={currentWorkshop <= 1}
        variant="outline"
        className="flex items-center space-x-2"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Précédent</span>
      </Button>
      
      <div className="text-sm text-gray-500">
        Atelier {currentWorkshop} sur {totalWorkshops}
      </div>

      <Button
        onClick={handleNext}
        disabled={!canProceed} // 🔧 CORRECTION: Utilisation de canProceed
        className="flex items-center space-x-2"
        title={!canProceed ? "Complétez tous les critères obligatoires pour continuer" : ""}
      >
        <span>{currentWorkshop >= totalWorkshops ? 'Terminer & Voir le Rapport' : 'Suivant'}</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default WorkshopNavigation;