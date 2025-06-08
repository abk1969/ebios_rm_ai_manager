import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/button';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface WorkshopRedirectProps {
  workshopNumber: 1 | 2 | 3 | 4 | 5;
  children: React.ReactNode;
}

/**
 * 🔧 COMPOSANT DE REDIRECTION INTELLIGENT
 * Gère la transition des anciennes routes vers les nouvelles routes avec missionId
 * Assure la compatibilité et guide l'utilisateur
 */
const WorkshopRedirect: React.FC<WorkshopRedirectProps> = ({
  workshopNumber,
  children
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedMission = useSelector((state: RootState) => state.missions.selectedMission);
  
  // Récupération du missionId depuis les paramètres URL ou le store
  const missionIdFromParams = searchParams.get('missionId');
  const missionId = selectedMission?.id || missionIdFromParams;

  useEffect(() => {
    // Si nous avons un missionId, rediriger vers la nouvelle route
    if (missionId && window.location.pathname.startsWith('/workshop-')) {
      const newPath = `/workshops/${missionId}/${workshopNumber}`;
      navigate(newPath, { replace: true });
    }
  }, [missionId, workshopNumber, navigate]);

  // Si pas de missionId, afficher l'interface de sélection
  if (!missionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Mission requise
            </h3>
            <p className="text-gray-500 mb-6">
              Pour accéder à l'Atelier {workshopNumber}, vous devez d'abord sélectionner une mission.
            </p>
            
            {/* 🎯 ACTIONS DISPONIBLES */}
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/missions')}
                className="w-full flex items-center justify-center space-x-2"
              >
                <span>Sélectionner une Mission</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="w-full"
              >
                Retour
              </Button>
            </div>

            {/* 📚 AIDE CONTEXTUELLE */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                💡 Comment procéder :
              </h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Retournez à la liste des missions</li>
                <li>2. Sélectionnez ou créez une mission</li>
                <li>3. Accédez aux ateliers depuis le tableau de bord</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si redirection en cours, afficher un loader
  if (window.location.pathname.startsWith('/workshop-') && missionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">
            Redirection vers l'Atelier {workshopNumber}...
          </p>
        </div>
      </div>
    );
  }

  // Afficher le contenu normal du workshop
  return <>{children}</>;
};

export default WorkshopRedirect;
