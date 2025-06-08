import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import EbiosGlobalDashboard from '@/components/dashboard/EbiosGlobalDashboard';
import { getMissions } from '@/services/firebase/missions';
import { Mission } from '@/types/ebios';
import { Loader2, AlertCircle } from 'lucide-react';

const EbiosDashboard: React.FC = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMission = async () => {
      if (!missionId) {
        setError('ID de mission manquant');
        setLoading(false);
        return;
      }

      try {
        const missions = await getMissions();
        const missionData = missions.find(m => m.id === missionId);
        if (!missionData) {
          setError('Mission non trouvée');
        } else {
          setMission(missionData);
        }
      } catch (err) {
        console.error('Erreur chargement mission:', err);
        setError('Erreur lors du chargement de la mission');
      } finally {
        setLoading(false);
      }
    };

    loadMission();
  }, [missionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !mission || !missionId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Erreur de chargement
        </h2>
        <p className="text-gray-600">{error || 'Mission non trouvée'}</p>
      </div>
    );
  }

  return (
    <EbiosGlobalDashboard 
      missionId={missionId} 
      missionName={mission.name}
    />
  );
};

export default EbiosDashboard; 