import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Lightbulb, 
  Info, 
  X, 
  ChevronDown, 
  ChevronUp,
  Star,
  BookOpen,
  Zap
} from 'lucide-react';
import Button from '@/components/ui/button';
import { aiAssistant, AISuggestion, ValidationResult, ContextualHelp } from '@/services/aiAssistant';

interface AIAssistantProps {
  workshopId: number;
  data?: any;
  onSuggestionAccept?: (suggestion: AISuggestion) => void;
  className?: string;
  isCollapsed?: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  workshopId,
  data,
  onSuggestionAccept,
  className = "",
  isCollapsed: initialCollapsed = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'validation' | 'help'>('suggestions');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [help, setHelp] = useState<ContextualHelp | null>(null);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  // Mettre à jour les suggestions quand les données changent
  useEffect(() => {
    if (data) {
      updateAssistance();
    }
  }, [data, workshopId]);

  // Charger l'aide contextuelle
  useEffect(() => {
    const contextualHelp = aiAssistant.getContextualHelp(workshopId, data);
    setHelp(contextualHelp);
  }, [workshopId, data]);

  const updateAssistance = () => {
    try {
      let newSuggestions: AISuggestion[] = [];
      let newValidation: ValidationResult | null = null;

      // Générer suggestions et validations selon l'atelier
      switch (workshopId) {
        case 1:
          if (data.businessValues) {
            newSuggestions = aiAssistant.suggestBusinessValues(data.businessValues, data.organizationType);
          }
          if (data.dreadedEvents && data.businessValues) {
            newValidation = aiAssistant.validateDreadedEvents(data.dreadedEvents, data.businessValues);
          }
          break;

        case 2:
          if (data.riskSources && data.supportingAssets) {
            newSuggestions = aiAssistant.suggestRiskSources(data.riskSources, data.supportingAssets);
          }
          if (data.supportingAssets && data.businessValues) {
            newValidation = aiAssistant.validateSupportingAssets(data.supportingAssets, data.businessValues);
          }
          break;

        case 3:
          if (data.strategicScenarios && data.riskSources && data.dreadedEvents) {
            newValidation = aiAssistant.analyzeStrategicScenarios(
              data.strategicScenarios, 
              data.riskSources, 
              data.dreadedEvents
            );
          }
          break;

        case 5:
          if (data.strategicScenarios && data.securityMeasures) {
            newSuggestions = aiAssistant.suggestSecurityMeasures(data.strategicScenarios, data.securityMeasures);
          }
          break;
      }

      // Filtrer les suggestions déjà rejetées
      const filteredSuggestions = newSuggestions.filter(s => !dismissedSuggestions.has(s.id));
      
      setSuggestions(filteredSuggestions);
      setValidation(newValidation);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'assistance IA:', error);
    }
  };

  const handleSuggestionAccept = (suggestion: AISuggestion) => {
    if (onSuggestionAccept) {
      onSuggestionAccept(suggestion);
    }
    // Masquer la suggestion après acceptation
    setDismissedSuggestions(prev => new Set([...prev, suggestion.id]));
  };

  const handleSuggestionDismiss = (suggestionId: string) => {
    setDismissedSuggestions(prev => new Set([...prev, suggestionId]));
  };

  const getSuggestionIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'suggestion':
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'best-practice':
        return <Star className="h-4 w-4 text-purple-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSuggestionColor = (type: AISuggestion['type'], priority: AISuggestion['priority']) => {
    const baseColors = {
      suggestion: 'bg-blue-50 border-blue-200',
      warning: 'bg-yellow-50 border-yellow-200',
      error: 'bg-red-50 border-red-200',
      'best-practice': 'bg-purple-50 border-purple-200'
    };

    const priorityColors = {
      critical: 'ring-2 ring-red-300',
      high: 'ring-1 ring-orange-300',
      medium: '',
      low: 'opacity-75'
    };

    return `${baseColors[type]} ${priorityColors[priority]}`;
  };

  const getValidationScore = () => {
    if (!validation) return null;
    return {
      score: validation.score,
      color: validation.score >= 80 ? 'text-green-600' :
             validation.score >= 60 ? 'text-yellow-600' : 'text-red-600'
    };
  };

  const activeSuggestions = suggestions.filter(s => !dismissedSuggestions.has(s.id));
  const totalIssues = validation ? validation.errors.length + validation.warnings.length : 0;
  const score = getValidationScore();

  if (isCollapsed) {
    return (
      <div className={`fixed bottom-4 right-4 z-40 ${className}`}>
        <Button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
        >
          <Brain className="h-5 w-5" />
          <span>Assistant IA</span>
          {(activeSuggestions.length > 0 || totalIssues > 0) && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px]">
              {activeSuggestions.length + totalIssues}
            </span>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">Assistant IA EBIOS RM</h3>
            {score && (
              <span className={`text-xs font-medium ${score.color}`}>
                Score: {score.score}/100
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(true)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-3">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              activeTab === 'suggestions'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-1">
              <Lightbulb className="h-3 w-3" />
              <span>Suggestions</span>
              {activeSuggestions.length > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[16px]">
                  {activeSuggestions.length}
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('validation')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              activeTab === 'validation'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3" />
              <span>Validation</span>
              {totalIssues > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[16px]">
                  {totalIssues}
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('help')}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              activeTab === 'help'
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center space-x-1">
              <BookOpen className="h-3 w-3" />
              <span>Aide ANSSI</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="p-4 space-y-3">
            {activeSuggestions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Lightbulb className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Aucune suggestion disponible</p>
                <p className="text-xs">Continuez à remplir vos données pour obtenir des recommandations IA</p>
              </div>
            ) : (
              activeSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className={`p-3 rounded-lg border ${getSuggestionColor(suggestion.type, suggestion.priority)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          {suggestion.title}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {suggestion.source}
                          </span>
                          <button
                            onClick={() => handleSuggestionDismiss(suggestion.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                      
                      {suggestion.actionText && (
                        <div className="mt-3 flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleSuggestionAccept(suggestion)}
                            className="flex items-center space-x-1"
                          >
                            <Zap className="h-3 w-3" />
                            <span>{suggestion.actionText}</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Validation Tab */}
        {activeTab === 'validation' && (
          <div className="p-4 space-y-3">
            {validation ? (
              <>
                {/* Score de validation */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Score de Conformité EBIOS RM</span>
                  </div>
                  <span className={`text-lg font-bold ${score?.color}`}>
                    {score?.score}/100
                  </span>
                </div>

                {/* Erreurs */}
                {validation.errors.map((error) => (
                  <div key={error.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-red-800">{error.title}</h4>
                        <p className="text-sm text-red-600 mt-1">{error.description}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Avertissements */}
                {validation.warnings.map((warning) => (
                  <div key={warning.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">{warning.title}</h4>
                        <p className="text-sm text-yellow-600 mt-1">{warning.description}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {validation.errors.length === 0 && validation.warnings.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-300" />
                    <p className="text-sm text-green-600">Excellente conformité !</p>
                    <p className="text-xs text-gray-500">Votre atelier respecte les bonnes pratiques EBIOS RM</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Analyse en cours...</p>
                <p className="text-xs">Ajoutez des données pour lancer la validation</p>
              </div>
            )}
          </div>
        )}

        {/* Help Tab */}
        {activeTab === 'help' && help && (
          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">{help.title}</h4>
              <p className="text-sm text-gray-600">{help.content}</p>
            </div>

            {help.examples.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-gray-700 mb-2">Exemples :</h5>
                <ul className="space-y-1">
                  {help.examples.map((example, index) => (
                    <li key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {help.bestPractices.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-gray-700 mb-2">Bonnes Pratiques :</h5>
                <ul className="space-y-1">
                  {help.bestPractices.map((practice, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-start space-x-2">
                      <Star className="h-3 w-3 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {help.anssiReferences.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-gray-700 mb-2">Références ANSSI :</h5>
                <ul className="space-y-1">
                  {help.anssiReferences.map((ref, index) => (
                    <li key={index} className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      📖 {ref}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant; 