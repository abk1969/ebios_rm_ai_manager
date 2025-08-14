/**
 * 🎨 PANNEAU DE SUGGESTIONS IA AMÉLIORÉ
 * Interface utilisateur optimisée pour les suggestions contextuelles EBIOS RM
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Badge, 
  Button, 
  Progress, 
  Alert, 
  AlertDescription,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui';
import { 
  Sparkles, 
  RefreshCw, 
  Check, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Info, 
  Filter,
  Star,
  Clock,
  Target,
  Lightbulb,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface EnhancedSuggestion {
  id: string;
  type: 'suggestion' | 'warning' | 'best-practice' | 'optimization';
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  actionText: string;
  confidence: number;
  relevance: number;
  source: string;
  context: any;
  contextualRelevance: number;
  missionAlignment: number;
  implementationPriority: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  coherenceJustification: string;
  createdAt: string;
  isApplied?: boolean;
}

interface SuggestionFeedback {
  suggestionId: string;
  rating: 'positive' | 'negative';
  comment?: string;
  timestamp: string;
}

interface EnhancedAISuggestionPanelProps {
  suggestions: EnhancedSuggestion[];
  isLoading?: boolean;
  onRefresh?: () => void;
  onApplySuggestion?: (suggestion: EnhancedSuggestion) => void;
  onFeedback?: (feedback: SuggestionFeedback) => void;
  showFilters?: boolean;
  maxSuggestions?: number;
  className?: string;
}

export const EnhancedAISuggestionPanel: React.FC<EnhancedAISuggestionPanelProps> = ({
  suggestions,
  isLoading = false,
  onRefresh,
  onApplySuggestion,
  onFeedback,
  showFilters = true,
  maxSuggestions = 10,
  className = ''
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<EnhancedSuggestion[]>(suggestions);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'priority' | 'confidence'>('relevance');
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set());
  const [copiedSuggestions, setCopiedSuggestions] = useState<Set<string>>(new Set());

  // Filtrage et tri des suggestions
  useEffect(() => {
    let filtered = [...suggestions];

    // Filtrage par type
    if (activeFilter !== 'all') {
      filtered = filtered.filter(s => s.type === activeFilter);
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.contextualRelevance - a.contextualRelevance;
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'confidence':
          return b.confidence - a.confidence;
        default:
          return 0;
      }
    });

    setFilteredSuggestions(filtered.slice(0, maxSuggestions));
  }, [suggestions, activeFilter, sortBy, maxSuggestions]);

  const handleCopy = useCallback(async (suggestion: EnhancedSuggestion) => {
    try {
      await navigator.clipboard.writeText(suggestion.description);
      setCopiedSuggestions(prev => new Set([...prev, suggestion.id]));
      setTimeout(() => {
        setCopiedSuggestions(prev => {
          const newSet = new Set(prev);
          newSet.delete(suggestion.id);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  }, []);

  const handleFeedback = useCallback((suggestion: EnhancedSuggestion, rating: 'positive' | 'negative') => {
    if (!onFeedback) return;
    
    const feedback: SuggestionFeedback = {
      suggestionId: suggestion.id,
      rating,
      timestamp: new Date().toISOString()
    };
    
    onFeedback(feedback);
    setFeedbackGiven(prev => new Set([...prev, suggestion.id]));
  }, [onFeedback]);

  const getPriorityIcon = (priority: EnhancedSuggestion['priority']) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Target className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeIcon = (type: EnhancedSuggestion['type']) => {
    switch (type) {
      case 'suggestion':
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'best-practice':
        return <Star className="h-4 w-4 text-green-500" />;
      case 'optimization':
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
    }
  };

  const getPriorityColor = (priority: EnhancedSuggestion['priority']): string => {
    switch (priority) {
      case 'critical':
        return 'border-red-300 bg-red-50';
      case 'high':
        return 'border-orange-300 bg-orange-50';
      case 'medium':
        return 'border-yellow-300 bg-yellow-50';
      case 'low':
        return 'border-blue-300 bg-blue-50';
    }
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffMins < 1440) return `Il y a ${Math.floor(diffMins / 60)} h`;
    return date.toLocaleDateString('fr-FR');
  };

  const suggestionsByType = suggestions.reduce((acc, suggestion) => {
    acc[suggestion.type] = (acc[suggestion.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
            Suggestions IA Contextuelles
            {suggestions.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {suggestions.length}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            {showFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {/* Toggle filters */}}
                aria-label="Filtres"
              >
                <Filter className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              onClick={onRefresh}
              disabled={isLoading}
              variant="outline"
              size="sm"
              aria-label="Actualiser les suggestions"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Filtres et tri */}
        {showFilters && (
          <div className="flex items-center justify-between pt-3 border-t">
            <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-auto">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">
                  Toutes ({suggestions.length})
                </TabsTrigger>
                <TabsTrigger value="suggestion">
                  Suggestions ({suggestionsByType.suggestion || 0})
                </TabsTrigger>
                <TabsTrigger value="warning">
                  Alertes ({suggestionsByType.warning || 0})
                </TabsTrigger>
                <TabsTrigger value="best-practice">
                  Bonnes pratiques ({suggestionsByType['best-practice'] || 0})
                </TabsTrigger>
                <TabsTrigger value="optimization">
                  Optimisations ({suggestionsByType.optimization || 0})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border rounded px-2 py-1"
              aria-label="Trier par"
            >
              <option value="relevance">Pertinence</option>
              <option value="priority">Priorité</option>
              <option value="confidence">Confiance</option>
            </select>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">Génération de suggestions...</span>
            </div>
            <Progress value={undefined} className="w-full" />
          </div>
        ) : filteredSuggestions.length > 0 ? (
          <div className="space-y-3">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={cn(
                  "group relative rounded-lg border p-4 transition-all duration-200 hover:shadow-md",
                  getPriorityColor(suggestion.priority),
                  suggestion.isApplied && "opacity-60"
                )}
              >
                {/* En-tête de la suggestion */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(suggestion.type)}
                    {getPriorityIcon(suggestion.priority)}
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Badge variant="outline" className="text-xs">
                      {suggestion.category}
                    </Badge>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                  {suggestion.description}
                </p>

                {/* Métriques */}
                <div className="flex items-center space-x-4 mb-3 text-xs">
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">Confiance:</span>
                    <span className={cn("font-medium", getConfidenceColor(suggestion.confidence))}>
                      {Math.round(suggestion.confidence * 100)}%
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-500">Pertinence:</span>
                    <span className="font-medium text-blue-600">
                      {suggestion.contextualRelevance}/100
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-500">
                      {formatTimeAgo(suggestion.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {!suggestion.isApplied && onApplySuggestion && (
                      <Button
                        onClick={() => onApplySuggestion(suggestion)}
                        size="sm"
                        className="text-xs"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        {suggestion.actionText}
                      </Button>
                    )}
                    
                    {suggestion.isApplied && (
                      <Badge variant="default" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Appliquée
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Feedback */}
                    {onFeedback && !feedbackGiven.has(suggestion.id) && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(suggestion, 'positive')}
                          className="h-6 w-6 p-0"
                          title="Utile"
                          aria-label="Marquer comme utile"
                        >
                          <ThumbsUp className="h-3 w-3 text-gray-400 hover:text-green-600" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(suggestion, 'negative')}
                          className="h-6 w-6 p-0"
                          title="Non utile"
                          aria-label="Marquer comme non utile"
                        >
                          <ThumbsDown className="h-3 w-3 text-gray-400 hover:text-red-600" />
                        </Button>
                      </>
                    )}

                    {/* Copier */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(suggestion)}
                      className="h-6 w-6 p-0"
                      title="Copier"
                      aria-label="Copier la suggestion"
                    >
                      {copiedSuggestions.has(suggestion.id) ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Justification de cohérence */}
                {suggestion.coherenceJustification && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-start space-x-2">
                      <Info className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-blue-700 leading-relaxed">
                        {suggestion.coherenceJustification}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {suggestions.length > maxSuggestions && (
              <div className="text-center py-3 border-t">
                <p className="text-sm text-gray-500">
                  {suggestions.length - maxSuggestions} suggestion(s) supplémentaire(s) disponible(s)
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">Aucune suggestion disponible</p>
            <p className="text-xs text-gray-400 mt-1">
              L'IA analysera vos données pour proposer des améliorations
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedAISuggestionPanel;
