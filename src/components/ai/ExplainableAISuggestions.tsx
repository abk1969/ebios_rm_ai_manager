/**
 * 🎯 COMPOSANT SUGGESTIONS IA EXPLICATIVES
 * Composant qui affiche des suggestions IA avec explications du raisonnement
 * 
 * CARACTÉRISTIQUES :
 * - Suggestions basées sur le contexte global
 * - Explication du raisonnement IA
 * - Références aux données existantes
 * - Score de pertinence et alignement global
 * - Intégration sans régression avec l'architecture existante
 */

import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Lightbulb, 
  Target, 
  AlertTriangle, 
  CheckCircle,
  Info,
  TrendingUp,
  Link,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import GlobalContextAIService, { ContextualSuggestion, CoherenceAnalysis } from '@/services/ai/GlobalContextAIService';

// 🎯 TYPES ET INTERFACES
interface ExplainableAISuggestionsProps {
  missionId: string;
  currentWorkshop: number;
  workshopData?: any;
  className?: string;
  onSuggestionApply?: (suggestion: ContextualSuggestion) => void;
  onSuggestionFeedback?: (suggestionId: string, feedback: 'positive' | 'negative') => void;
}

interface SuggestionWithExplanation extends ContextualSuggestion {
  expanded: boolean;
  userFeedback?: 'positive' | 'negative';
}

// 🎯 COMPOSANT PRINCIPAL
const ExplainableAISuggestions: React.FC<ExplainableAISuggestionsProps> = ({
  missionId,
  currentWorkshop,
  workshopData,
  className = '',
  onSuggestionApply,
  onSuggestionFeedback
}) => {
  const [suggestions, setSuggestions] = useState<SuggestionWithExplanation[]>([]);
  const [coherenceAnalysis, setCoherenceAnalysis] = useState<CoherenceAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCoherence, setShowCoherence] = useState(false);

  const globalContextService = GlobalContextAIService.getInstance();

  // 🎯 CHARGEMENT DES SUGGESTIONS
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Chargement parallèle des suggestions et de l'analyse de cohérence
        const [contextualSuggestions, coherence] = await Promise.all([
          globalContextService.generateContextualSuggestions(missionId, currentWorkshop, workshopData),
          globalContextService.analyzeCoherence(missionId)
        ]);

        // Transformation des suggestions avec état d'expansion
        const suggestionsWithState: SuggestionWithExplanation[] = contextualSuggestions.map(suggestion => ({
          ...suggestion,
          expanded: false,
          userFeedback: undefined
        }));

        setSuggestions(suggestionsWithState);
        setCoherenceAnalysis(coherence);
      } catch (err) {
        console.error('🚨 Erreur lors du chargement des suggestions:', err);
        setError('Impossible de charger les suggestions IA');
      } finally {
        setLoading(false);
      }
    };

    if (missionId) {
      loadSuggestions();
    }
  }, [missionId, currentWorkshop, workshopData]);

  // 🎯 GESTION DES ACTIONS
  const handleToggleExpansion = (suggestionId: string) => {
    setSuggestions(prev => prev.map(suggestion => 
      suggestion.id === suggestionId 
        ? { ...suggestion, expanded: !suggestion.expanded }
        : suggestion
    ));
  };

  const handleApplySuggestion = (suggestion: ContextualSuggestion) => {
    if (onSuggestionApply) {
      onSuggestionApply(suggestion);
    }
    
    // Marquer comme appliquée (optionnel)
    setSuggestions(prev => prev.map(s => 
      s.id === suggestion.id 
        ? { ...s, userFeedback: 'positive' }
        : s
    ));
  };

  const handleFeedback = (suggestionId: string, feedback: 'positive' | 'negative') => {
    setSuggestions(prev => prev.map(suggestion => 
      suggestion.id === suggestionId 
        ? { ...suggestion, userFeedback: feedback }
        : suggestion
    ));

    if (onSuggestionFeedback) {
      onSuggestionFeedback(suggestionId, feedback);
    }
  };

  // 🎯 UTILITAIRES
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'suggestion': return Lightbulb;
      case 'warning': return AlertTriangle;
      case 'tip': return Info;
      case 'celebration': return CheckCircle;
      default: return Target;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'suggestion': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning': return 'bg-red-50 border-red-200 text-red-800';
      case 'tip': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'celebration': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 80) return 'text-green-600 bg-green-100';
    if (relevance >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 bg-gray-300 rounded"></div>
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
          </div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-600">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Réessayer
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* En-tête avec analyse de cohérence */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <h3 className="text-sm font-medium text-gray-900">
              Suggestions IA Contextuelles
            </h3>
            <Badge variant="outline" className="text-xs">
              {suggestions.length} suggestion{suggestions.length > 1 ? 's' : ''}
            </Badge>
          </div>
          
          {coherenceAnalysis && (
            <div className="flex items-center space-x-2">
              <Badge 
                variant="outline" 
                className={`text-xs ${getRelevanceColor(coherenceAnalysis.overallScore)}`}
              >
                Cohérence: {coherenceAnalysis.overallScore}%
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCoherence(!showCoherence)}
                className="p-1"
              >
                {showCoherence ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>

        {/* Analyse de cohérence détaillée */}
        {showCoherence && coherenceAnalysis && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Analyse de cohérence globale</h4>
            
            {/* Scores par atelier */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              {Object.entries(coherenceAnalysis.workshopScores).map(([workshop, score]) => (
                <div key={workshop} className="text-center">
                  <div className="text-xs text-gray-500">Atelier {workshop}</div>
                  <div className={`text-sm font-medium ${getRelevanceColor(score)}`}>
                    {score}%
                  </div>
                </div>
              ))}
            </div>

            {/* Incohérences détectées */}
            {coherenceAnalysis.inconsistencies.length > 0 && (
              <div className="mb-2">
                <div className="text-xs font-medium text-red-600 mb-1">Incohérences détectées:</div>
                <ul className="text-xs text-red-600 space-y-1">
                  {coherenceAnalysis.inconsistencies.map((inconsistency, index) => (
                    <li key={index}>• {inconsistency}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommandations */}
            {coherenceAnalysis.recommendations.length > 0 && (
              <div>
                <div className="text-xs font-medium text-blue-600 mb-1">Recommandations:</div>
                <ul className="text-xs text-blue-600 space-y-1">
                  {coherenceAnalysis.recommendations.map((recommendation, index) => (
                    <li key={index}>• {recommendation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Liste des suggestions */}
      {suggestions.length === 0 ? (
        <Card className="p-6 text-center">
          <Sparkles className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Aucune suggestion disponible pour le moment</p>
          <p className="text-sm text-gray-500 mt-1">
            Ajoutez des données à l'atelier pour obtenir des suggestions personnalisées
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {suggestions.map((suggestion) => {
            const Icon = getSuggestionIcon(suggestion.type);
            const colorClass = getSuggestionColor(suggestion.type);

            return (
              <Card key={suggestion.id} className={`border-2 ${suggestion.userFeedback === 'positive' ? 'border-green-200' : suggestion.userFeedback === 'negative' ? 'border-red-200' : 'border-gray-200'}`}>
                <div className="p-4">
                  {/* En-tête de suggestion */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {suggestion.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {suggestion.description}
                        </p>
                        
                        {/* Métriques de pertinence */}
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getRelevanceColor(suggestion.contextualRelevance)}`}
                          >
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Pertinence: {suggestion.contextualRelevance}%
                          </Badge>
                          
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getRelevanceColor(suggestion.globalAlignment)}`}
                          >
                            <Target className="h-3 w-3 mr-1" />
                            Alignement: {suggestion.globalAlignment}%
                          </Badge>

                          {suggestion.crossWorkshopImpact.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <Link className="h-3 w-3 mr-1" />
                              Impact: {suggestion.crossWorkshopImpact.length} atelier{suggestion.crossWorkshopImpact.length > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleExpansion(suggestion.id)}
                        className="p-1"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {suggestion.userFeedback !== 'positive' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(suggestion.id, 'positive')}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {suggestion.userFeedback !== 'negative' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeedback(suggestion.id, 'negative')}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Détails explicatifs (expandable) */}
                  {suggestion.expanded && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h5 className="text-xs font-medium text-gray-700 mb-2">
                        🧠 Explication du raisonnement IA
                      </h5>
                      
                      <div className="space-y-2 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Justification de cohérence:</span>
                          <span className="ml-1">{suggestion.coherenceJustification}</span>
                        </div>
                        
                        {suggestion.crossWorkshopImpact.length > 0 && (
                          <div>
                            <span className="font-medium">Impact inter-ateliers:</span>
                            <span className="ml-1">{suggestion.crossWorkshopImpact.join(', ')}</span>
                          </div>
                        )}
                        
                        <div>
                          <span className="font-medium">Source:</span>
                          <span className="ml-1">{suggestion.source}</span>
                        </div>
                        
                        <div>
                          <span className="font-medium">Catégorie:</span>
                          <span className="ml-1">{suggestion.category}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions principales */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      {suggestion.actionText && (
                        <Button
                          size="sm"
                          onClick={() => handleApplySuggestion(suggestion)}
                          disabled={suggestion.userFeedback === 'positive'}
                          className="text-xs"
                        >
                          {suggestion.userFeedback === 'positive' ? 'Appliquée' : suggestion.actionText}
                        </Button>
                      )}
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${suggestion.priority === 'high' ? 'border-red-300 text-red-700' : suggestion.priority === 'medium' ? 'border-yellow-300 text-yellow-700' : 'border-gray-300 text-gray-700'}`}
                    >
                      Priorité {suggestion.priority}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExplainableAISuggestions;
