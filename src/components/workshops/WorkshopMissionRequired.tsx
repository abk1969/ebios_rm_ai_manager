/**
 * 🚫 COMPOSANT DE SÉCURITÉ : MISSION OBLIGATOIRE POUR ATELIERS
 * Empêche l'accès aux ateliers sans mission et guide vers la sélection
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { AlertTriangle, ArrowRight, Database, Plus, Search } from 'lucide-react';
import Button from '../ui/button';
import { getMissions } from '../../services/firebase/missions';
import type { Mission } from '../../types/ebios';

interface WorkshopMissionRequiredProps {
  workshopNumber: 1 | 2 | 3 | 4 | 5;
}

/**
 * 🔒 COMPOSANT DE SÉCURITÉ POUR ATELIERS
 * Force la sélection d'une mission avant d'accéder aux ateliers
 * Empêche la création de données orphelines
 */
const WorkshopMissionRequired: React.FC<WorkshopMissionRequiredProps> = ({
  workshopNumber
}) => {
  const navigate = useNavigate();
  const selectedMission = useSelector((state: RootState) => state.missions.selectedMission);
  const [availableMissions, setAvailableMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Chargement des missions disponibles
  useEffect(() => {
    const loadMissions = async () => {
      try {
        const missions = await getMissions();
        setAvailableMissions(missions);
      } catch (error) {
        console.error('Erreur lors du chargement des missions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMissions();
  }, []);

  // Si une mission est déjà sélectionnée, rediriger automatiquement
  useEffect(() => {
    if (selectedMission?.id) {
      navigate(`/workshops/${selectedMission.id}/${workshopNumber}`, { replace: true });
    }
  }, [selectedMission, workshopNumber, navigate]);

  const handleMissionSelect = (mission: Mission) => {
    // Redirection directe vers l'atelier avec la mission sélectionnée
    navigate(`/workshops/${mission.id}/${workshopNumber}`);
  };

  const getWorkshopInfo = (number: number) => {
    const workshops = {
      1: { name: 'Cadrage et Socle de Sécurité', description: 'Identifier les valeurs métier et biens essentiels' },
      2: { name: 'Sources de Risque', description: 'Analyser les sources de menaces et objectifs visés' },
      3: { name: 'Scénarios Stratégiques', description: 'Élaborer les scénarios de risque stratégiques' },
      4: { name: 'Scénarios Opérationnels', description: 'Détailler les scénarios opérationnels' },
      5: { name: 'Traitement du Risque', description: 'Définir les mesures de traitement' }
    };
    return workshops[number as keyof typeof workshops];
  };

  const workshopInfo = getWorkshopInfo(workshopNumber);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* En-tête d'avertissement */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Mission Requise
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pour accéder à l'<strong>Atelier {workshopNumber} - {workshopInfo.name}</strong>, 
            vous devez d'abord sélectionner une mission EBIOS RM.
          </p>
        </div>

        {/* Informations sur l'atelier */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Database className="h-6 w-6 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">
                Atelier {workshopNumber} : {workshopInfo.name}
              </h3>
              <p className="text-blue-800 text-sm">
                {workshopInfo.description}
              </p>
              <div className="mt-3 text-xs text-blue-700">
                <strong>Pourquoi une mission est-elle requise ?</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Chaque atelier EBIOS RM doit être rattaché à un contexte organisationnel</li>
                  <li>• Les données créées doivent être cohérentes avec la mission</li>
                  <li>• La validation ANSSI nécessite un périmètre défini</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sélection de mission */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Search className="h-5 w-5 text-gray-500 mr-2" />
              Sélectionner une Mission
            </h2>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Chargement des missions...</p>
              </div>
            ) : availableMissions.length === 0 ? (
              <div className="text-center py-8">
                <Database className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune mission disponible</h3>
                <p className="text-gray-600 mb-6">
                  Vous devez d'abord créer une mission EBIOS RM pour accéder aux ateliers.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/missions')}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Créer une Mission</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="ml-3"
                  >
                    Retour au Tableau de Bord
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 mb-4">
                  Choisissez la mission pour laquelle vous souhaitez réaliser l'Atelier {workshopNumber} :
                </p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {availableMissions.map((mission) => (
                    <div
                      key={mission.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handleMissionSelect(mission)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">{mission.name}</h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {mission.description || 'Aucune description'}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Organisation: {mission.organization || 'Non définie'}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              mission.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              mission.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {mission.status === 'in_progress' ? 'En cours' :
                               mission.status === 'completed' ? 'Terminé' :
                               mission.status === 'draft' ? 'Brouillon' : mission.status}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 ml-3" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-500 mb-4">
                    Vous ne trouvez pas votre mission ?
                  </p>
                  <div className="space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/missions')}
                      className="flex items-center space-x-2"
                    >
                      <Database className="h-4 w-4" />
                      <span>Gérer les Missions</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                    >
                      Retour au Tableau de Bord
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informations de sécurité */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-gray-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900 text-sm">Sécurité des Données</h4>
              <p className="text-gray-600 text-xs mt-1">
                Cette mesure de sécurité garantit que toutes les données EBIOS RM sont correctement 
                rattachées à leur mission d'origine, assurant la cohérence et la traçabilité.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopMissionRequired;
