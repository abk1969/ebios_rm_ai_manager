import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getMissions } from '@/services/firebase/missions';
import { 
  Shield, 
  Target, 
  AlertTriangle, 
  Users, 
  FileText, 
  CheckCircle,
  ArrowRight,
  BookOpen,
  Clock
} from 'lucide-react';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { Mission } from '@/types/ebios';

/**
 * 📋 PAGE D'INDEX DES WORKSHOPS EBIOS RM
 * Affiche la liste des 5 ateliers avec sélection de mission
 */
const WorkshopsIndex: React.FC = () => {
  const navigate = useNavigate();
  const selectedMission = useSelector((state: RootState) => state.missions.selectedMission);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 📊 Définition des 5 ateliers EBIOS RM
  const workshops = [
    {
      id: 1,
      title: 'Cadrage et Socle de Sécurité',
      subtitle: 'Valeurs Métier',
      description: 'Identifier les valeurs métier et évaluer le socle de sécurité existant',
      icon: Target,
      color: 'blue',
      duration: '2-4h',
      deliverables: ['Valeurs métier', 'Événements redoutés', 'Biens supports']
    },
    {
      id: 2,
      title: 'Sources de Risque',
      subtitle: 'Menaces et Acteurs',
      description: 'Identifier les sources de risque susceptibles de s\'intéresser aux valeurs métier',
      icon: AlertTriangle,
      color: 'orange',
      duration: '3-5h',
      deliverables: ['Sources de risque', 'Objectifs visés', 'Modes opératoires']
    },
    {
      id: 3,
      title: 'Scénarios Stratégiques',
      subtitle: 'Parties Prenantes',
      description: 'Construire les scénarios stratégiques et identifier les parties prenantes',
      icon: Users,
      color: 'purple',
      duration: '4-6h',
      deliverables: ['Parties prenantes', 'Scénarios stratégiques', 'Chemins d\'attaque']
    },
    {
      id: 4,
      title: 'Scénarios Opérationnels',
      subtitle: 'Chemins d\'Attaque',
      description: 'Détailler les scénarios opérationnels et les chemins d\'attaque techniques',
      icon: FileText,
      color: 'red',
      duration: '5-8h',
      deliverables: ['Scénarios opérationnels', 'Chemins d\'attaque', 'Évaluation des risques']
    },
    {
      id: 5,
      title: 'Traitement des Risques',
      subtitle: 'Plan d\'Action',
      description: 'Définir les mesures de sécurité et le plan de traitement des risques',
      icon: Shield,
      color: 'green',
      duration: '3-5h',
      deliverables: ['Mesures de sécurité', 'Plan de traitement', 'Stratégie de mise en œuvre']
    }
  ];

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const missionsList = await getMissions();
        setMissions(missionsList);
      } catch (error) {
        console.error('Erreur lors du chargement des missions:', error);
        setError('Impossible de charger les missions');
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const handleWorkshopSelect = (workshopId: number) => {
    if (!selectedMission) {
      setError('Veuillez d\'abord sélectionner une mission');
      return;
    }
    navigate(`/workshops/${selectedMission.id}/${workshopId}`);
  };

  const handleMissionSelect = (mission: Mission) => {
    // Rediriger vers la page de sélection de mission
    navigate('/missions');
  };

  const getWorkshopProgress = (workshopId: number): number => {
    if (!selectedMission) return 0;
    // Calculer le pourcentage de progression basé sur l'atelier
    return Math.min((selectedMission.ebiosCompliance?.completionPercentage || 0), workshopId * 20);
  };

  const isWorkshopAccessible = (workshopId: number): boolean => {
    if (!selectedMission) return false;
    const requiredProgress = (workshopId - 1) * 20;
    return (selectedMission.ebiosCompliance?.completionPercentage || 0) >= requiredProgress;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Ateliers EBIOS Risk Manager
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Suivez la méthode EBIOS RM v1.5 de l'ANSSI à travers 5 ateliers structurés 
          pour analyser et traiter les risques cybersécurité de votre organisation.
        </p>
      </div>

      {/* Sélection de mission */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Mission sélectionnée</h2>
            {selectedMission ? (
              <div>
                <p className="text-lg font-medium text-blue-600">{selectedMission.name}</p>
                <p className="text-sm text-gray-600">{selectedMission.description}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>Progression : {selectedMission.ebiosCompliance?.completionPercentage || 0}%</span>
                  <span>•</span>
                  <span>Créée le {new Date(selectedMission.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Aucune mission sélectionnée</p>
            )}
          </div>
          <Button
            onClick={() => navigate('/missions')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <BookOpen className="h-4 w-4" />
            <span>{selectedMission ? 'Changer de mission' : 'Sélectionner une mission'}</span>
          </Button>
        </div>
      </Card>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Liste des ateliers */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {workshops.map((workshop) => {
          const Icon = workshop.icon;
          const progress = getWorkshopProgress(workshop.id);
          const isAccessible = isWorkshopAccessible(workshop.id);
          const isCompleted = progress >= workshop.id * 20;

          return (
            <Card
              key={workshop.id}
              className={`p-6 transition-all duration-200 ${
                isAccessible 
                  ? 'hover:shadow-lg cursor-pointer border-gray-200' 
                  : 'opacity-60 cursor-not-allowed border-gray-100'
              } ${isCompleted ? 'ring-2 ring-green-200 bg-green-50' : ''}`}
              onClick={() => isAccessible && handleWorkshopSelect(workshop.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${workshop.color}-100`}>
                  <Icon className={`h-6 w-6 text-${workshop.color}-600`} />
                </div>
                <div className="flex items-center space-x-2">
                  {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                  <span className="text-sm font-medium text-gray-500">
                    Atelier {workshop.id}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {workshop.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {workshop.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{workshop.duration}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isCompleted 
                      ? 'bg-green-100 text-green-800' 
                      : isAccessible 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isCompleted ? 'Terminé' : isAccessible ? 'Disponible' : 'Verrouillé'}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Livrables :</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {workshop.deliverables.map((deliverable, index) => (
                      <li key={index} className="flex items-center space-x-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {isAccessible && (
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">
                        {isCompleted ? 'Revoir l\'atelier' : 'Commencer l\'atelier'}
                      </span>
                      <ArrowRight className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Guide méthodologique */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-4">
          <BookOpen className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Guide méthodologique EBIOS RM
            </h3>
            <p className="text-blue-800 mb-4">
              Les ateliers doivent être réalisés dans l'ordre pour garantir la cohérence de l'analyse. 
              Chaque atelier s'appuie sur les résultats du précédent.
            </p>
            <Button
              variant="outline"
              onClick={() => window.open('https://cyber.gouv.fr/la-methode-ebios-risk-manager', '_blank')}
              className="text-blue-600 border-blue-300 hover:bg-blue-100"
            >
              Consulter la méthode officielle ANSSI
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WorkshopsIndex;
