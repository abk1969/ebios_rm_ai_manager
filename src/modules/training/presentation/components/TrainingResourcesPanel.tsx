/**
 * 🎯 PANNEAU RESSOURCES
 * Composant pour afficher les ressources pédagogiques
 * Documents, templates, liens utiles
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  ExternalLink, 
  FileText, 
  Video, 
  Link,
  Search,
  Filter,
  Star,
  Clock,
  Tag
} from 'lucide-react';

// 🎯 PROPS DU COMPOSANT
export interface TrainingResourcesPanelProps {
  compact?: boolean;
  className?: string;
}

// 🎯 TYPES POUR LES RESSOURCES
interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'template' | 'tool';
  category: string;
  workshopId?: number;
  url?: string;
  downloadable: boolean;
  duration?: number; // en minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  rating: number;
  downloads: number;
  lastUpdated: Date;
}

/**
 * 🎯 COMPOSANT PRINCIPAL
 */
export const TrainingResourcesPanel: React.FC<TrainingResourcesPanelProps> = ({
  compact = false,
  className = ''
}) => {
  // 🎯 ÉTAT LOCAL
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // 🎯 DONNÉES SIMULÉES DES RESSOURCES
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Guide ANSSI EBIOS RM v1.5',
      description: 'Guide officiel de la méthode EBIOS Risk Manager',
      type: 'document',
      category: 'Méthodologie',
      url: 'https://www.ssi.gouv.fr/guide/ebios-risk-manager/',
      downloadable: true,
      difficulty: 'intermediate',
      tags: ['ANSSI', 'Officiel', 'Méthodologie'],
      rating: 5,
      downloads: 1250,
      lastUpdated: new Date('2024-03-15')
    },
    {
      id: '2',
      title: 'Template Cartographie Valeurs Métier',
      description: 'Modèle Excel pour l\'identification des valeurs métier',
      type: 'template',
      category: 'Atelier 1',
      workshopId: 1,
      downloadable: true,
      difficulty: 'beginner',
      tags: ['Excel', 'Valeurs métier', 'Template'],
      rating: 4,
      downloads: 890,
      lastUpdated: new Date('2024-02-20')
    },
    {
      id: '3',
      title: 'Vidéo : Introduction EBIOS RM',
      description: 'Présentation vidéo de 15 minutes sur les fondamentaux',
      type: 'video',
      category: 'Introduction',
      duration: 15,
      downloadable: false,
      difficulty: 'beginner',
      tags: ['Vidéo', 'Introduction', 'Fondamentaux'],
      rating: 4,
      downloads: 2100,
      lastUpdated: new Date('2024-01-10')
    },
    {
      id: '4',
      title: 'Exemples secteur Finance',
      description: 'Cas d\'usage EBIOS RM pour le secteur bancaire',
      type: 'document',
      category: 'Exemples sectoriels',
      downloadable: true,
      difficulty: 'advanced',
      tags: ['Finance', 'Banque', 'Cas d\'usage'],
      rating: 5,
      downloads: 650,
      lastUpdated: new Date('2024-03-01')
    },
    {
      id: '5',
      title: 'Outil d\'analyse de risques',
      description: 'Calculateur automatique de criticité des risques',
      type: 'tool',
      category: 'Outils',
      url: 'https://risk-calculator.example.com',
      downloadable: false,
      difficulty: 'intermediate',
      tags: ['Outil', 'Calcul', 'Risques'],
      rating: 4,
      downloads: 420,
      lastUpdated: new Date('2024-02-15')
    }
  ];

  // 🎯 FILTRAGE DES RESSOURCES
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // 🎯 CATÉGORIES DISPONIBLES
  const categories = ['all', ...Array.from(new Set(resources.map(r => r.category)))];
  const types = ['all', 'document', 'video', 'template', 'tool', 'link'];

  // 🎯 ICÔNE PAR TYPE
  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'document': return <FileText className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'template': return <FileText className="w-4 h-4" />;
      case 'tool': return <ExternalLink className="w-4 h-4" />;
      case 'link': return <Link className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  // 🎯 COULEUR PAR DIFFICULTÉ
  const getDifficultyColor = (difficulty: Resource['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // 🎯 GESTION DU TÉLÉCHARGEMENT
  const handleDownload = (resource: Resource) => {
    console.log('Téléchargement de:', resource.title);
    // Ici, implémenter la logique de téléchargement
  };

  // 🎯 RENDU COMPACT
  if (compact) {
    return (
      <div className={`training-resources-compact ${className}`}>
        <div className="space-y-3">
          {filteredResources.slice(0, 5).map((resource) => (
            <div
              key={resource.id}
              className="flex items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="mr-2 text-gray-600">
                {getTypeIcon(resource.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {resource.title}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {resource.category}
                </p>
              </div>
              {resource.downloadable && (
                <button
                  onClick={() => handleDownload(resource)}
                  className="ml-2 p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Download className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🎯 RENDU COMPLET
  return (
    <div className={`training-resources-panel p-6 ${className}`}>
      {/* En-tête */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ressources</h2>
        <p className="text-gray-600">
          Documents, templates et outils pour votre formation EBIOS RM
        </p>
      </div>

      {/* Filtres et recherche */}
      <div className="mb-6 space-y-4">
        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher des ressources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Toutes' : category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'Tous' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des ressources */}
      <div className="space-y-4">
        {filteredResources.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune ressource trouvée</p>
          </div>
        ) : (
          filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* En-tête de la ressource */}
                  <div className="flex items-center mb-2">
                    <div className="mr-2 text-gray-600">
                      {getTypeIcon(resource.type)}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {resource.title}
                    </h3>
                    <div className="ml-2 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < resource.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-3">{resource.description}</p>

                  {/* Métadonnées */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      {resource.category}
                    </span>
                    
                    {resource.duration && (
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {resource.duration} min
                      </span>
                    )}
                    
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(resource.difficulty)}`}>
                      {resource.difficulty}
                    </span>
                    
                    <span>{resource.downloads} téléchargements</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {resource.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="ml-4 flex flex-col space-y-2">
                  {resource.downloadable && (
                    <button
                      onClick={() => handleDownload(resource)}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Télécharger
                    </button>
                  )}
                  
                  {resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Ouvrir
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistiques */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Statistiques</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total ressources:</span>
            <span className="ml-2 font-medium">{resources.length}</span>
          </div>
          <div>
            <span className="text-gray-600">Documents:</span>
            <span className="ml-2 font-medium">
              {resources.filter(r => r.type === 'document').length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Templates:</span>
            <span className="ml-2 font-medium">
              {resources.filter(r => r.type === 'template').length}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Outils:</span>
            <span className="ml-2 font-medium">
              {resources.filter(r => r.type === 'tool').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingResourcesPanel;
