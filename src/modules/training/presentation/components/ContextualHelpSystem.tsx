/**
 * 🆘 SYSTÈME D'AIDE CONTEXTUELLE
 * Composant pour fournir une aide intelligente selon le contexte
 * Remplace la confusion par un support adaptatif et personnalisé
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  HelpCircle, 
  X, 
  Search, 
  BookOpen, 
  Video, 
  MessageSquare, 
  ExternalLink,
  ChevronRight,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  Filter
} from 'lucide-react';
import { 
  TrainingStep 
} from '../../domain/entities/LinearTrainingPath';
import { 
  LinearTrainingOrchestrator 
} from '../../domain/services/LinearTrainingOrchestrator';
import { 
  TrainingStepConfigurationFactory 
} from '../../domain/entities/TrainingStepConfigurations';

// 🎯 PROPS DU COMPOSANT
interface ContextualHelpSystemProps {
  currentStep: TrainingStep;
  onClose: () => void;
  orchestrator: LinearTrainingOrchestrator;
  className?: string;
}

// 🎯 TYPE D'AIDE
export enum HelpType {
  QUICK_TIP = 'quick_tip',
  TUTORIAL = 'tutorial',
  DOCUMENTATION = 'documentation',
  VIDEO = 'video',
  FAQ = 'faq',
  EXAMPLE = 'example',
  TROUBLESHOOTING = 'troubleshooting'
}

// 🎯 ÉLÉMENT D'AIDE
export interface HelpItem {
  id: string;
  title: string;
  description: string;
  type: HelpType;
  content: string;
  url?: string;
  estimatedTime: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  relevanceScore: number; // 0-100
  lastUpdated: Date;
  helpful?: boolean; // feedback utilisateur
}

// 🎯 CATÉGORIE D'AIDE
export interface HelpCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  items: HelpItem[];
}

// 🎯 ÉTAT DU SYSTÈME D'AIDE
interface HelpSystemState {
  searchQuery: string;
  selectedCategory: string | null;
  selectedType: HelpType | null;
  filteredItems: HelpItem[];
  isLoading: boolean;
  showFeedback: boolean;
  feedbackItem: string | null;
}

// 🎯 COMPOSANT PRINCIPAL
export const ContextualHelpSystem: React.FC<ContextualHelpSystemProps> = ({
  currentStep,
  onClose,
  orchestrator,
  className = ''
}) => {
  const [state, setState] = useState<HelpSystemState>({
    searchQuery: '',
    selectedCategory: null,
    selectedType: null,
    filteredItems: [],
    isLoading: true,
    showFeedback: false,
    feedbackItem: null
  });

  const [helpCategories, setHelpCategories] = useState<HelpCategory[]>([]);

  // 🏗️ INITIALISER LES DONNÉES D'AIDE
  const initializeHelpData = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const stepConfig = TrainingStepConfigurationFactory.getConfiguration(currentStep);
      const categories = generateContextualHelp(currentStep, stepConfig);
      
      setHelpCategories(categories);
      
      // Filtrer les éléments par défaut (les plus pertinents)
      const allItems = categories.flatMap(cat => cat.items);
      const topItems = allItems
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 10);

      setState(prev => ({ 
        ...prev, 
        filteredItems: topItems,
        isLoading: false 
      }));

    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'aide:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [currentStep]);

  // 🔍 FILTRER LES ÉLÉMENTS D'AIDE
  const filterHelpItems = useCallback(() => {
    let items = helpCategories.flatMap(cat => cat.items);

    // Filtrer par recherche
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filtrer par catégorie
    if (state.selectedCategory) {
      const category = helpCategories.find(cat => cat.id === state.selectedCategory);
      items = category ? category.items : [];
    }

    // Filtrer par type
    if (state.selectedType) {
      items = items.filter(item => item.type === state.selectedType);
    }

    // Trier par pertinence
    items.sort((a, b) => b.relevanceScore - a.relevanceScore);

    setState(prev => ({ ...prev, filteredItems: items }));
  }, [helpCategories, state.searchQuery, state.selectedCategory, state.selectedType]);

  // 🎧 EFFETS
  useEffect(() => {
    initializeHelpData();
  }, [initializeHelpData]);

  useEffect(() => {
    filterHelpItems();
  }, [filterHelpItems]);

  // 🎮 GESTIONNAIRES D'ÉVÉNEMENTS
  const handleSearch = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setState(prev => ({ 
      ...prev, 
      selectedCategory: categoryId,
      selectedType: null 
    }));
  };

  const handleTypeFilter = (type: HelpType | null) => {
    setState(prev => ({ ...prev, selectedType: type }));
  };

  const handleItemClick = (item: HelpItem) => {
    if (item.url) {
      window.open(item.url, '_blank');
    }
    
    // Enregistrer l'utilisation pour améliorer la pertinence
    recordHelpUsage(item.id);
  };

  const handleFeedback = (itemId: string, helpful: boolean) => {
    // Enregistrer le feedback
    recordHelpFeedback(itemId, helpful);
    setState(prev => ({ 
      ...prev, 
      showFeedback: false, 
      feedbackItem: null 
    }));
  };

  // 📊 FONCTIONS UTILITAIRES
  const recordHelpUsage = (itemId: string) => {
    // Enregistrer l'utilisation pour analytics
    console.log('Aide utilisée:', itemId);
  };

  const recordHelpFeedback = (itemId: string, helpful: boolean) => {
    // Enregistrer le feedback pour améliorer l'aide
    console.log('Feedback aide:', itemId, helpful);
  };

  // 🎨 OBTENIR L'ICÔNE SELON LE TYPE
  const getTypeIcon = (type: HelpType) => {
    switch (type) {
      case HelpType.QUICK_TIP:
        return <Lightbulb className="w-4 h-4" />;
      case HelpType.TUTORIAL:
        return <BookOpen className="w-4 h-4" />;
      case HelpType.VIDEO:
        return <Video className="w-4 h-4" />;
      case HelpType.FAQ:
        return <MessageSquare className="w-4 h-4" />;
      case HelpType.DOCUMENTATION:
        return <BookOpen className="w-4 h-4" />;
      case HelpType.EXAMPLE:
        return <Star className="w-4 h-4" />;
      case HelpType.TROUBLESHOOTING:
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };

  // 🎨 OBTENIR LA COULEUR SELON LE TYPE
  const getTypeColor = (type: HelpType): string => {
    switch (type) {
      case HelpType.QUICK_TIP:
        return 'text-yellow-600 bg-yellow-50';
      case HelpType.TUTORIAL:
        return 'text-blue-600 bg-blue-50';
      case HelpType.VIDEO:
        return 'text-purple-600 bg-purple-50';
      case HelpType.FAQ:
        return 'text-green-600 bg-green-50';
      case HelpType.DOCUMENTATION:
        return 'text-gray-600 bg-gray-50';
      case HelpType.EXAMPLE:
        return 'text-orange-600 bg-orange-50';
      case HelpType.TROUBLESHOOTING:
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${className}`}>
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Aide contextuelle
              </h2>
              <p className="text-sm text-gray-600">
                Étape {currentStep} - {TrainingStepConfigurationFactory.getConfiguration(currentStep)?.name}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans l'aide..."
                value={state.searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtres */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={state.selectedType || ''}
                onChange={(e) => handleTypeFilter(e.target.value as HelpType || null)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="">Tous les types</option>
                <option value={HelpType.QUICK_TIP}>Astuces rapides</option>
                <option value={HelpType.TUTORIAL}>Tutoriels</option>
                <option value={HelpType.VIDEO}>Vidéos</option>
                <option value={HelpType.FAQ}>FAQ</option>
                <option value={HelpType.EXAMPLE}>Exemples</option>
                <option value={HelpType.TROUBLESHOOTING}>Dépannage</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar catégories */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Catégories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategorySelect(null)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    state.selectedCategory === null 
                      ? 'bg-blue-100 text-blue-900' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Toutes les catégories
                </button>
                {helpCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center space-x-2 ${
                      state.selectedCategory === category.id 
                        ? 'bg-blue-100 text-blue-900' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <category.icon className="w-4 h-4" />
                    <span>{category.name}</span>
                    <span className="text-xs text-gray-500">({category.items.length})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Liste des éléments d'aide */}
          <div className="flex-1 overflow-y-auto">
            {state.isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : state.filteredItems.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune aide trouvée
                  </h3>
                  <p className="text-gray-600">
                    Essayez de modifier vos critères de recherche.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="space-y-4">
                  {state.filteredItems.map((item) => (
                    <HelpItemCard
                      key={item.id}
                      item={item}
                      onClick={() => handleItemClick(item)}
                      onFeedback={(helpful) => handleFeedback(item.id, helpful)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 🎯 COMPOSANT CARTE D'AIDE
interface HelpItemCardProps {
  item: HelpItem;
  onClick: () => void;
  onFeedback: (helpful: boolean) => void;
}

const HelpItemCard: React.FC<HelpItemCardProps> = ({ item, onClick, onFeedback }) => {
  const getTypeIcon = (type: HelpType) => {
    switch (type) {
      case HelpType.QUICK_TIP: return <Lightbulb className="w-4 h-4" />;
      case HelpType.VIDEO: return <Video className="w-4 h-4" />;
      case HelpType.TUTORIAL: return <BookOpen className="w-4 h-4" />;
      default: return <HelpCircle className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: HelpType): string => {
    switch (type) {
      case HelpType.QUICK_TIP: return 'text-yellow-600 bg-yellow-50';
      case HelpType.VIDEO: return 'text-purple-600 bg-purple-50';
      case HelpType.TUTORIAL: return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
              {getTypeIcon(item.type)}
              <span className="ml-1">{item.type.replace('_', ' ')}</span>
            </span>
            <span className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {item.estimatedTime} min
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              item.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
              item.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {item.difficulty}
            </span>
          </div>
          
          <h4 className="font-medium text-gray-900 mb-1">{item.title}</h4>
          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onClick}
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                <span>Voir</span>
                {item.url ? <ExternalLink className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🏗️ FONCTION DE GÉNÉRATION D'AIDE CONTEXTUELLE
function generateContextualHelp(step: TrainingStep, stepConfig: any): HelpCategory[] {
  // Cette fonction génère l'aide contextuelle selon l'étape
  // Pour l'instant, on retourne des données d'exemple
  return [
    {
      id: 'getting_started',
      name: 'Démarrage',
      description: 'Aide pour commencer',
      icon: Lightbulb,
      items: [
        {
          id: 'step_overview',
          title: `Vue d'ensemble de l'étape ${step}`,
          description: 'Comprendre les objectifs et le contenu de cette étape',
          type: HelpType.QUICK_TIP,
          content: 'Contenu d\'aide...',
          estimatedTime: 2,
          difficulty: 'beginner',
          tags: ['overview', 'objectives'],
          relevanceScore: 95,
          lastUpdated: new Date()
        }
      ]
    },
    {
      id: 'methodology',
      name: 'Méthodologie',
      description: 'Aide sur EBIOS RM',
      icon: BookOpen,
      items: [
        {
          id: 'ebios_basics',
          title: 'Bases d\'EBIOS RM',
          description: 'Concepts fondamentaux de la méthodologie',
          type: HelpType.TUTORIAL,
          content: 'Contenu tutoriel...',
          estimatedTime: 10,
          difficulty: 'beginner',
          tags: ['ebios', 'methodology', 'basics'],
          relevanceScore: 90,
          lastUpdated: new Date()
        }
      ]
    }
  ];
}

export default ContextualHelpSystem;
