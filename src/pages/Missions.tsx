import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Calendar, Users, FileText, AlertTriangle, Target, ChevronRight, BookOpen, BarChart2, Database, Bot } from 'lucide-react';
import { RootState } from '@/store';
import { setMissions, setSelectedMission } from '@/store/slices/missionsSlice';
import { getMissions, createMission, updateMission, deleteMission } from '@/services/firebase/missions';
import CreateMissionModal from '@/components/missions/CreateMissionModal';
import MissionActions from '@/components/missions/MissionActions';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Button from '@/components/ui/button';
import EbiosOnboarding from '@/components/onboarding/EbiosOnboarding';
import type { Mission } from '@/types/ebios';

const Missions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const missions = useSelector((state: RootState) => state.missions.missions);
  const selectedMission = useSelector((state: RootState) => state.missions.selectedMission);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // États pour la gestion des modifications
  const [editingMission, setEditingMission] = useState<Mission | null>(null);

  useEffect(() => {
    fetchMissions();
  }, []);

  // Afficher l'onboarding si c'est la première visite
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('ebios-onboarding-seen');
    if (!hasSeenOnboarding && missions.length === 0 && !loading) {
      setIsOnboardingOpen(true);
    }
  }, [missions.length, loading]);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const fetchedMissions = await getMissions();
      dispatch(setMissions(fetchedMissions));
      
      // Si une seule mission existe et aucune n'est sélectionnée, la sélectionner automatiquement
      if (fetchedMissions.length === 1 && !selectedMission) {
        dispatch(setSelectedMission(fetchedMissions[0]));
      }
    } catch (err) {
      console.error('Error fetching missions:', err);
      setError('Erreur lors du chargement des missions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMission = async (missionData: Partial<Mission>) => {
    try {
      setError(null);

      if (editingMission) {
        // Mode édition
        const updatedMissionData = {
          ...editingMission,
          ...missionData,
          updatedAt: new Date().toISOString()
        };

        const updatedMission = await updateMission(editingMission.id, updatedMissionData);

        // Actualiser la liste des missions
        await fetchMissions();

        setEditingMission(null);
        setError('✅ Mission modifiée avec succès');
      } else {
        // Mode création
        const newMissionData = {
          name: missionData.name || 'Nouvelle Mission',
          description: missionData.description || '',
          organizationContext: missionData.organizationContext || '',
          scope: missionData.scope || '',
          dueDate: missionData.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'draft' as const,
          assignedTo: missionData.assignedTo || [],
          createdBy: 'current-user', // À remplacer par l'utilisateur actuel
          ebiosCompliance: missionData.ebiosCompliance || 'v1.5',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const newMission = await createMission(newMissionData as Omit<Mission, 'id'>);

        // Actualiser la liste des missions
        await fetchMissions();

        // Sélectionner automatiquement la nouvelle mission
        dispatch(setSelectedMission(newMission));

        // Rediriger vers l'atelier 1 pour commencer l'analyse
        navigate('/workshop-1');
      }

      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Error creating/updating mission:', err);
      setError(editingMission ? 'Erreur lors de la modification de la mission' : 'Erreur lors de la création de la mission');
    }
  };

  const handleMissionSelect = (mission: Mission) => {
    dispatch(setSelectedMission(mission));
    // Rediriger vers le nouveau dashboard EBIOS avec IA
    navigate(`/ebios-dashboard/${mission.id}`);
  };

  const handleStartFirstMission = () => {
    setIsOnboardingOpen(true);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('ebios-onboarding-seen', 'true');
    setIsCreateModalOpen(true);
  };

  // Fonctions de gestion des missions
  const handleEditMission = (mission: Mission) => {
    setEditingMission(mission);
    setIsCreateModalOpen(true);
  };

  const handleDeleteMission = async (missionId: string) => {
    try {
      setError(null);

      // Supprimer la mission de Firebase
      await deleteMission(missionId);

      // Actualiser la liste des missions
      await fetchMissions();

      setError('✅ Mission supprimée avec succès');
    } catch (err) {
      console.error('Error deleting mission:', err);
      setError('Erreur lors de la suppression de la mission');
    }
  };

  const handleDuplicateMission = async (mission: Mission) => {
    try {
      setError(null);

      const duplicatedMissionData = {
        ...mission,
        name: `${mission.name} (Copie)`,
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ebiosCompliance: {
          completionPercentage: 0,
          validatedWorkshops: [],
          lastValidationDate: null,
          complianceScore: 0,
          recommendations: []
        }
      };

      // Supprimer l'ID pour créer une nouvelle mission
      delete (duplicatedMissionData as any).id;

      const newMission = await createMission(duplicatedMissionData as Omit<Mission, 'id'>);

      // Actualiser la liste des missions
      await fetchMissions();

      setError('✅ Mission dupliquée avec succès');
    } catch (err) {
      console.error('Error duplicating mission:', err);
      setError('Erreur lors de la duplication de la mission');
    }
  };

  const getMissionStatusColor = (mission: Mission) => {
    // Simple logique de statut basée sur le statut
    switch (mission.status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'review':
        return 'bg-blue-100 text-blue-700';
      case 'archived':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getMissionProgress = (mission: Mission) => {
    // Calcul simple du pourcentage de progression basé sur le statut
    switch (mission.status) {
      case 'completed':
        return 100;
      case 'review':
        return 90;
      case 'in_progress':
        return 50;
      case 'archived':
        return 100;
      default:
        return 10;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header de page avec actions */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Missions EBIOS RM</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos analyses de risques cybersécurité selon la méthode ANSSI
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => setIsOnboardingOpen(true)}
            className="flex items-center space-x-2"
          >
            <BookOpen className="h-4 w-4" />
            <span>Guide EBIOS RM</span>
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle Mission</span>
          </Button>
        </div>
      </div>

      <div>
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* État vide - Première mission */}
        {missions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Bienvenue dans votre analyse EBIOS RM !
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Commencez votre première analyse de risques cybersécurité en suivant la méthode structurée 
              EBIOS Risk Manager v1.5 de l'ANSSI.
            </p>
            
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleStartFirstMission}
                size="lg"
                className="flex items-center space-x-2"
              >
                <BookOpen className="h-5 w-5" />
                <span>Découvrir EBIOS RM</span>
              </Button>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                variant="secondary"
                size="lg"
                className="flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Créer directement</span>
              </Button>
            </div>

            {/* Prévisualisation des 5 ateliers */}
            <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Les 5 Ateliers EBIOS RM
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { id: 1, title: 'Cadrage', subtitle: 'Valeurs Métier', icon: Target, color: 'blue' },
                  { id: 2, title: 'Sources', subtitle: 'de Risque', icon: AlertTriangle, color: 'orange' },
                  { id: 3, title: 'Scénarios', subtitle: 'Stratégiques', icon: Users, color: 'purple' },
                  { id: 4, title: 'Scénarios', subtitle: 'Opérationnels', icon: FileText, color: 'red' },
                  { id: 5, title: 'Traitement', subtitle: 'des Risques', icon: Target, color: 'green' }
                ].map((atelier) => (
                  <div key={atelier.id} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className={`w-12 h-12 mx-auto mb-3 bg-${atelier.color}-100 rounded-full flex items-center justify-center`}>
                      <atelier.icon className={`h-6 w-6 text-${atelier.color}-600`} />
                    </div>
                    <h4 className="font-medium text-gray-900">Atelier {atelier.id}</h4>
                    <p className="text-sm text-gray-600">{atelier.title}</p>
                    <p className="text-xs text-gray-500">{atelier.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Liste des missions existantes */}
        {missions.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Missions en cours ({missions.length})
              </h2>
              <p className="text-gray-600">
                Sélectionnez une mission pour continuer votre analyse EBIOS RM
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {missions.map((mission) => (
                <div
                  key={mission.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleMissionSelect(mission)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {mission.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {mission.description || 'Aucune description'}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMissionStatusColor(mission)}`}>
                        {getMissionProgress(mission)}%
                      </div>
                    </div>

                    {/* Métadonnées */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Créée le {new Date(mission.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{mission.assignedTo?.length || 0} participant(s)</span>
                      </div>
                    </div>

                    {/* Barre de progression */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progression</span>
                        <span>{getMissionProgress(mission)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getMissionProgress(mission)}%` }}
                        />
                      </div>
                    </div>

                    {/* Nouvelles fonctionnalités IA */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center px-2 py-1 bg-green-100 rounded-full">
                          <Bot className="h-3 w-3 text-green-600 mr-1" />
                          <span className="text-xs font-medium text-green-700">IA Active</span>
                        </div>
                        <div className="flex items-center px-2 py-1 bg-blue-100 rounded-full">
                          <Database className="h-3 w-3 text-blue-600 mr-1" />
                          <span className="text-xs font-medium text-blue-700">Access</span>
                        </div>
                      </div>
                      <div className="flex items-center px-2 py-1 bg-purple-100 rounded-full">
                        <BarChart2 className="h-3 w-3 text-purple-600 mr-1" />
                        <span className="text-xs font-medium text-purple-700">Dashboard</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((atelier) => (
                          <div
                            key={atelier}
                            className={`w-2 h-2 rounded-full ${
                              getMissionProgress(mission) >= atelier * 20
                                ? 'bg-green-400'
                                : 'bg-gray-200'
                            }`}
                            title={`Atelier ${atelier}`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center text-blue-600 text-sm font-medium">
                        <span>Continuer</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>

                    {/* 🆕 ACTIONS DE GESTION: Modification, suppression */}
                    <div className="mt-4 pt-4 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                      <MissionActions
                        mission={mission}
                        onEdit={handleEditMission}
                        onDelete={handleDeleteMission}
                        onDuplicate={handleDuplicateMission}
                        showDropdown={true}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      <CreateMissionModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingMission(null);
        }}
        onSubmit={handleCreateMission}
        initialData={editingMission}
      />

      <EbiosOnboarding
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
};

export default Missions;