/**
 * 🔗 VISUALISEUR DES DÉPENDANCES ENTRE ATELIERS EBIOS RM
 * Composant pour afficher les liens méthodologiques entre les 5 ateliers
 */

import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowDown, 
  BookOpen, 
  Target, 
  Users, 
  Route, 
  ShieldCheck,
  Info,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

// 🎯 TYPES POUR LES DÉPENDANCES
interface WorkshopDependency {
  fromWorkshop: number;
  toWorkshop: number;
  dataType: string;
  description: string;
  example: string;
  criticality: 'essential' | 'important' | 'useful';
}

interface WorkshopData {
  id: number;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  provides: string[];
  requires: string[];
  status: 'completed' | 'in_progress' | 'locked' | 'available';
}

// 🎯 PROPS DU COMPOSANT
interface WorkshopDependenciesViewerProps {
  currentWorkshop: number;
  workshopStatuses: Record<number, 'completed' | 'in_progress' | 'locked' | 'available'>;
  onWorkshopSelect?: (workshopId: number) => void;
}

export const WorkshopDependenciesViewer: React.FC<WorkshopDependenciesViewerProps> = ({
  currentWorkshop,
  workshopStatuses,
  onWorkshopSelect
}) => {
  const [selectedDependency, setSelectedDependency] = useState<WorkshopDependency | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // 🏗️ DÉFINITION DES ATELIERS
  const workshops: WorkshopData[] = [
    {
      id: 1,
      title: "Socle de sécurité",
      icon: BookOpen,
      color: "blue",
      provides: ["Contexte", "Biens essentiels", "Biens supports", "Événements redoutés", "Socle existant"],
      requires: [],
      status: workshopStatuses[1] || 'available'
    },
    {
      id: 2,
      title: "Sources de risques",
      icon: Target,
      color: "red",
      provides: ["Sources identifiées", "Motivations", "Capacités", "Pertinence"],
      requires: ["Contexte", "Biens essentiels", "Socle existant"],
      status: workshopStatuses[2] || 'locked'
    },
    {
      id: 3,
      title: "Scénarios stratégiques",
      icon: Users,
      color: "purple",
      provides: ["Scénarios stratégiques", "Vraisemblance", "Chemins d'attaque"],
      requires: ["Biens essentiels", "Sources identifiées", "Motivations"],
      status: workshopStatuses[3] || 'locked'
    },
    {
      id: 4,
      title: "Scénarios opérationnels",
      icon: Route,
      color: "orange",
      provides: ["Scénarios opérationnels", "Impacts techniques", "Gravité", "Vulnérabilités"],
      requires: ["Biens supports", "Scénarios stratégiques", "Chemins d'attaque"],
      status: workshopStatuses[4] || 'locked'
    },
    {
      id: 5,
      title: "Traitement du risque",
      icon: ShieldCheck,
      color: "green",
      provides: ["Stratégie traitement", "Mesures sécurité", "Plan mise en œuvre"],
      requires: ["Événements redoutés", "Scénarios opérationnels", "Gravité", "Socle existant"],
      status: workshopStatuses[5] || 'locked'
    }
  ];

  // 🔗 DÉFINITION DES DÉPENDANCES
  const dependencies: WorkshopDependency[] = [
    // Atelier 1 → Tous les autres
    {
      fromWorkshop: 1,
      toWorkshop: 2,
      dataType: "Contexte + Biens essentiels",
      description: "Le contexte CHU et les biens essentiels déterminent quelles sources de risques sont pertinentes",
      example: "CHU santé → Cybercriminels ransomware + Espions données patients",
      criticality: 'essential'
    },
    {
      fromWorkshop: 1,
      toWorkshop: 3,
      dataType: "Biens essentiels + Événements redoutés",
      description: "Les biens essentiels et événements redoutés définissent les objectifs des scénarios stratégiques",
      example: "Urgences vitales → Scénario 'Arrêt du SIH → Décès patients'",
      criticality: 'essential'
    },
    {
      fromWorkshop: 1,
      toWorkshop: 4,
      dataType: "Biens supports + Architecture",
      description: "Les biens supports révèlent les vulnérabilités techniques à exploiter dans les scénarios opérationnels",
      example: "SIH Windows → Exploitation CVE + Escalade privilèges",
      criticality: 'essential'
    },
    {
      fromWorkshop: 1,
      toWorkshop: 5,
      dataType: "Socle existant + Événements redoutés",
      description: "Le socle actuel et les événements redoutés orientent les mesures de traitement prioritaires",
      example: "Pas de MFA + Arrêt urgences → MFA priorité 1",
      criticality: 'essential'
    },

    // Atelier 2 → Ateliers 3, 4, 5
    {
      fromWorkshop: 2,
      toWorkshop: 3,
      dataType: "Sources + Motivations + Capacités",
      description: "Chaque source de risque génère des scénarios stratégiques selon ses motivations et capacités",
      example: "Cybercriminel + Gain financier + Ransomware → Scénario chiffrement SIH",
      criticality: 'essential'
    },
    {
      fromWorkshop: 2,
      toWorkshop: 4,
      dataType: "Capacités techniques",
      description: "Les capacités des sources déterminent les techniques d'attaque réalisables",
      example: "APT étatique → Techniques 0-day + Persistance avancée",
      criticality: 'important'
    },
    {
      fromWorkshop: 2,
      toWorkshop: 5,
      dataType: "Motivations + Capacités",
      description: "Les motivations influencent les mesures de dissuasion et les capacités le niveau de protection",
      example: "Motivation financière → Mesures anti-ransomware prioritaires",
      criticality: 'important'
    },

    // Atelier 3 → Ateliers 4, 5
    {
      fromWorkshop: 3,
      toWorkshop: 4,
      dataType: "Scénarios stratégiques + Chemins d'attaque",
      description: "Chaque scénario stratégique se décline en scénarios opérationnels détaillés",
      example: "Cybercriminel → SIH → Détail: Phishing → Pivot → Ransomware",
      criticality: 'essential'
    },
    {
      fromWorkshop: 3,
      toWorkshop: 5,
      dataType: "Vraisemblance + Priorisation",
      description: "La vraisemblance des scénarios priorise les mesures de traitement",
      example: "Scénario très vraisemblable → Mesures préventives prioritaires",
      criticality: 'important'
    },

    // Atelier 4 → Atelier 5
    {
      fromWorkshop: 4,
      toWorkshop: 5,
      dataType: "Impacts + Gravité + Vulnérabilités",
      description: "Les impacts détaillés et vulnérabilités identifiées orientent les mesures correctives",
      example: "Gravité CRITIQUE + Vulnérabilité AD → Durcissement AD priorité 1",
      criticality: 'essential'
    }
  ];

  // 🎨 COULEURS PAR CRITICITÉ
  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'essential': return 'text-red-600 bg-red-50 border-red-200';
      case 'important': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'useful': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // 🎨 COULEURS PAR STATUT
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600 text-white';
      case 'in_progress': return 'bg-blue-600 text-white';
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'locked': return 'bg-gray-300 text-gray-600';
      default: return 'bg-gray-300 text-gray-600';
    }
  };

  // 🎯 RENDU D'UN ATELIER
  const renderWorkshop = (workshop: WorkshopData) => {
    const Icon = workshop.icon;
    const isActive = workshop.id === currentWorkshop;
    
    return (
      <div
        key={workshop.id}
        className={`
          relative p-4 rounded-lg border-2 transition-all cursor-pointer
          ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}
          ${workshop.status === 'locked' ? 'opacity-60' : ''}
        `}
        onClick={() => onWorkshopSelect?.(workshop.id)}
      >
        {/* En-tête atelier */}
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(workshop.status)}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Atelier {workshop.id}</h3>
            <p className="text-sm text-gray-600">{workshop.title}</p>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(workshop.status)}`}>
            {workshop.status === 'completed' && 'Terminé'}
            {workshop.status === 'in_progress' && 'En cours'}
            {workshop.status === 'available' && 'Disponible'}
            {workshop.status === 'locked' && 'Verrouillé'}
          </div>
        </div>

        {/* Données fournies */}
        {showDetails && (
          <div className="space-y-2">
            <div>
              <h4 className="text-xs font-semibold text-green-700 mb-1">📤 Fournit :</h4>
              <div className="flex flex-wrap gap-1">
                {workshop.provides.map((item, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {workshop.requires.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-blue-700 mb-1">📥 Nécessite :</h4>
                <div className="flex flex-wrap gap-1">
                  {workshop.requires.map((item, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // 🔗 RENDU D'UNE DÉPENDANCE
  const renderDependency = (dependency: WorkshopDependency) => {
    const isSelected = selectedDependency?.fromWorkshop === dependency.fromWorkshop && 
                     selectedDependency?.toWorkshop === dependency.toWorkshop;
    
    return (
      <div
        key={`${dependency.fromWorkshop}-${dependency.toWorkshop}`}
        className={`
          p-3 rounded-lg border cursor-pointer transition-all
          ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}
          ${getCriticalityColor(dependency.criticality)}
        `}
        onClick={() => setSelectedDependency(isSelected ? null : dependency)}
      >
        <div className="flex items-center space-x-2 mb-2">
          <span className="font-semibold">A{dependency.fromWorkshop}</span>
          <ArrowRight className="w-4 h-4" />
          <span className="font-semibold">A{dependency.toWorkshop}</span>
          <span className="text-xs px-2 py-1 rounded bg-white border">
            {dependency.criticality === 'essential' && '🔴 Essentiel'}
            {dependency.criticality === 'important' && '🟠 Important'}
            {dependency.criticality === 'useful' && '🔵 Utile'}
          </span>
        </div>
        
        <div className="text-sm">
          <div className="font-medium text-gray-900 mb-1">{dependency.dataType}</div>
          <div className="text-gray-600 text-xs">{dependency.description}</div>
          
          {isSelected && (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <div className="text-xs font-medium text-yellow-800 mb-1">💡 Exemple concret :</div>
              <div className="text-xs text-yellow-700">{dependency.example}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🔗 Dépendances méthodologiques EBIOS RM
            </h2>
            <p className="text-gray-600">
              Visualisez les liens entre les 5 ateliers et comprenez comment les données circulent
            </p>
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showDetails ? 'Masquer' : 'Afficher'} les détails</span>
          </button>
        </div>
      </div>

      {/* Vue d'ensemble des ateliers */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Vue d'ensemble des ateliers</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {workshops.map(renderWorkshop)}
        </div>
      </div>

      {/* Flux de dépendances */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔄 Flux de données entre ateliers</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dependencies.map(renderDependency)}
        </div>
      </div>

      {/* Légende */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📖 Légende</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Criticité des dépendances</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Essentiel - Bloque l'atelier suivant</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Important - Influence significative</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Utile - Améliore la qualité</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Statut des ateliers</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Terminé</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <span className="text-sm">En cours</span>
              </div>
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-gray-600" />
                <span className="text-sm">Disponible / Verrouillé</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Navigation</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Cliquez sur un atelier pour le sélectionner</p>
              <p>• Cliquez sur une dépendance pour voir l'exemple</p>
              <p>• Utilisez "Afficher détails" pour plus d'infos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopDependenciesViewer;
