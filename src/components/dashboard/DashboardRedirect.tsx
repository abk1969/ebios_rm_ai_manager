import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setMissions } from '@/store/slices/missionsSlice';
import { getMissions } from '@/services/firebase/missions';
import LoadingSpinner from '@/components/common/LoadingSpinner';

/**
 * Composant de redirection pour /ebios-dashboard
 * Redirige automatiquement vers :
 * - Le dashboard de la mission sélectionnée si elle existe
 * - La page des missions sinon
 */
const DashboardRedirect: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedMission = useSelector((state: RootState) => state.missions.selectedMission);
  const missions = useSelector((state: RootState) => state.missions.missions);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleRedirection = async () => {
      try {
        // Si une mission est sélectionnée, rediriger vers son dashboard
        if (selectedMission) {
          navigate(`/ebios-dashboard/${selectedMission.id}`, { replace: true });
          return;
        }

        // Si il y a des missions mais aucune sélectionnée, prendre la première
        if (missions.length > 0) {
          navigate(`/ebios-dashboard/${missions[0].id}`, { replace: true });
          return;
        }

        // Si pas de missions en mémoire, essayer de les charger
        if (missions.length === 0) {
          const fetchedMissions = await getMissions();
          dispatch(setMissions(fetchedMissions));

          if (fetchedMissions.length > 0) {
            navigate(`/ebios-dashboard/${fetchedMissions[0].id}`, { replace: true });
            return;
          }
        }

        // Sinon, rediriger vers la page des missions
        navigate('/missions', { replace: true });
      } catch (error) {
        console.error('Erreur lors du chargement des missions:', error);
        navigate('/missions', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    handleRedirection();
  }, [selectedMission, missions, navigate, dispatch]);

  // Afficher un spinner pendant la redirection
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Redirection vers votre dashboard...</p>
        </div>
      </div>
    );
  }

  // Ne devrait jamais être atteint car la redirection se fait dans useEffect
  return null;
};

export default DashboardRedirect;
