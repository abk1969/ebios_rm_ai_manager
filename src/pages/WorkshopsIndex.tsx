import React, { useState, useEffect } from 'react';
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
  Clock,
  Database,
  Route,
  ShieldCheck
} from 'lucide-react';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import MissionSelector from '@/components/common/MissionSelector';
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

  // 📊 Définition des 5 ateliers EBIOS RM
  const workshops = [
    {
      id: 1,
      title: "Atelier 1 - Cadrage et Socle de Sécurité",
      description: "Définir le périmètre d'étude et établir le socle de sécurité de l'écosystème.",
      icon: Target,
      duration: "2-3 heures",
      deliverables: ["Périmètre d'étude", "Socle de sécurité", "Biens supports"],
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600"
    },
    {
      id: 2,
      title: "Atelier 2 - Sources de Risques",
      description: "Identifier et analyser les sources de risques potentielles.",
      icon: AlertTriangle,
      duration: "3-4 heures",
      deliverables: ["Cartographie des sources de risques", "Analyse des menaces", "Évaluation des vulnérabilités"],
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600"
    },
    {
      id: 3,
      title: "Atelier 3 - Scénarios Stratégiques",
      description: "Élaborer des scénarios de risques stratégiques pour l'organisation.",
      icon: Route,
      duration: "4-5 heures",
      deliverables: ["Scénarios stratégiques", "Analyse d'impact", "Priorisation des risques"],
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600"
    },
    {
      id: 4,
      title: "Atelier 4 - Scénarios Opérationnels",
      description: "Détailler les scénarios opérationnels et leurs modes d'action.",
      icon: Database,
      duration: "3-4 heures",
      deliverables: ["Scénarios opérationnels", "Modes d'action", "Chemins d'attaque"],
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600"
    },
    {
      id: 5,
      title: "Atelier 5 - Traitement du Risque",
      description: "Définir et planifier les mesures de traitement des risques identifiés.",
      icon: ShieldCheck,
      duration: "2-3 heures",
      deliverables: ["Plan de traitement", "Mesures de sécurité", "Indicateurs de suivi"],
      color: "bg-emerald-50 border-emerald-200",
      iconColor: "text-emerald-600"
    }
  ];

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const fetchedMissions = await getMissions();
        setMissions(fetchedMissions);
      } catch (error) {
        console.error('Erreur lors du chargement des missions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const handleWorkshopClick = (workshopId: number) => {
    if (!selectedMission) {
      return; // Le bouton sera désactivé, donc cette fonction ne devrait pas être appelée
    }
    navigate(`/workshop/${workshopId}?missionId=${selectedMission.id}`);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ateliers EBIOS Risk Manager
          </h1>
          <p className="text-lg text-gray-600">
            Suivez la méthodologie EBIOS RM étape par étape pour analyser et traiter les risques de votre système.
          </p>
        </div>

        {/* Sélecteur de mission */}
        <MissionSelector className="mb-8" />

        {/* Grille des ateliers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workshops.map((workshop, index) => {
            const Icon = workshop.icon;
            const isAccessible = selectedMission !== null;
            const isCompleted = false; // TODO: Implémenter la logique de completion
            
            return (
              <Card
                key={workshop.id}
                className={`p-6 transition-all duration-200 hover:shadow-lg ${
                  isAccessible 
                    ? 'cursor-pointer hover:border-blue-300 border-gray-200' 
                    : 'opacity-60 cursor-not-allowed border-gray-100'
                } ${isCompleted ? 'ring-2 ring-green-200' : ''} ${workshop.color}`}
                onClick={() => isAccessible && handleWorkshopClick(workshop.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${workshop.color.replace('border-', 'bg-').replace('-200', '-100')}`}>
                    <Icon className={`h-6 w-6 ${workshop.iconColor}`} />
                  </div>
                  {isCompleted && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {!isAccessible && (
                    <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                      Mission requise
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {workshop.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {workshop.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{workshop.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>{workshop.deliverables.length} livrables</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs font-medium text-gray-700 mb-2">Livrables principaux :</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {workshop.deliverables.slice(0, 3).map((deliverable, idx) => (
                      <li key={idx} className="flex items-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${workshop.iconColor.replace('text-', 'bg-')}`}></div>
                        <span className="truncate">{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {isAccessible && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${workshop.iconColor}`}>
                        Commencer l'atelier
                      </span>
                      <ArrowRight className={`h-4 w-4 ${workshop.iconColor}`} />
                    </div>
                  </div>
                )}
                
                {!isAccessible && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm text-amber-600">
                        Sélectionnez une mission pour accéder
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
        
        {/* Section d'aide et progression */}
        {selectedMission && (
          <Card className="mt-8 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Progression de la mission : {selectedMission.name}
              </h2>
              <Button
                onClick={() => navigate(`/ebios-dashboard/${selectedMission.id}`)}
                variant="outline"
                size="sm"
              >
                Voir le tableau de bord
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0/5</div>
                <div className="text-sm text-gray-600">Ateliers complétés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0%</div>
                <div className="text-sm text-gray-600">Progression globale</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">~15h</div>
                <div className="text-sm text-gray-600">Durée estimée totale</div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Progression des ateliers</span>
                <span>0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </Card>
        )}
        
        {/* Informations sur la méthodologie */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            À propos de la méthodologie EBIOS Risk Manager
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>Objectifs</span>
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Identifier et évaluer les risques numériques</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Définir des mesures de sécurité adaptées</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Améliorer la résilience organisationnelle</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Respecter les exigences réglementaires</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <span>Méthodologie</span>
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                EBIOS Risk Manager est une méthode d'analyse et de gestion des risques 
                numériques développée par l'ANSSI (Agence nationale de la sécurité des systèmes d'information).
              </p>
              <p className="text-sm text-gray-600">
                Elle permet d'identifier les risques pesant sur une organisation et de définir 
                les mesures de sécurité à mettre en œuvre de manière structurée et méthodique.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WorkshopsIndex;
