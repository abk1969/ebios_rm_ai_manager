import React, { useState } from 'react';
import { 
  Brain, 
  Info, 
  TrendingUp, 
  Shield, 
  Target, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import Button from '../ui/button';

interface AISuggestionsExplainerProps {
  suggestions: any[];
  type: 'dreadedEvent' | 'supportingAsset' | 'securityMeasure';
  onApplySuggestion: (suggestion: any) => void;
  className?: string;
}

const AISuggestionsExplainer: React.FC<AISuggestionsExplainerProps> = ({
  suggestions,
  type,
  onApplySuggestion,
  className = ''
}) => {
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const getTypeConfig = () => {
    switch (type) {
      case 'dreadedEvent':
        return {
          title: 'Événements Redoutés Suggérés',
          icon: Target,
          color: 'red',
          description: 'L\'IA analyse votre valeur métier et suggère des événements redoutés pertinents'
        };
      case 'supportingAsset':
        return {
          title: 'Actifs Supports Suggérés',
          icon: Shield,
          color: 'green',
          description: 'L\'IA identifie les actifs techniques et organisationnels nécessaires'
        };
      case 'securityMeasure':
        return {
          title: 'Mesures de Sécurité Suggérées',
          icon: Shield,
          color: 'blue',
          description: 'L\'IA recommande des mesures basées sur les référentiels de sécurité'
        };
      default:
        return {
          title: 'Suggestions IA',
          icon: Brain,
          color: 'gray',
          description: 'Suggestions générées par l\'intelligence artificielle'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return { label: 'Très pertinent', color: 'text-green-600' };
    if (confidence >= 0.6) return { label: 'Pertinent', color: 'text-blue-600' };
    if (confidence >= 0.4) return { label: 'Moyennement pertinent', color: 'text-yellow-600' };
    return { label: 'Peu pertinent', color: 'text-gray-600' };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-${config.color}-100 rounded-lg`}>
              <Icon className={`h-5 w-5 text-${config.color}-600`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{config.title}</h3>
              <p className="text-sm text-gray-600">{config.description}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExplanation(!showExplanation)}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Comment ça marche ?
          </Button>
        </div>
      </div>

      {/* Explication du fonctionnement de l'IA */}
      {showExplanation && (
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-start space-x-3">
            <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 mb-2">Comment l'IA génère ces suggestions</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p><strong>Analyse contextuelle :</strong> L'IA analyse votre valeur métier (nom, description, criticité) pour comprendre le contexte</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p><strong>Base de connaissances :</strong> Elle s'appuie sur les référentiels ISO 27002, NIST CSF, CIS Controls et MITRE ATT&CK</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p><strong>Score de confiance :</strong> Chaque suggestion a un pourcentage indiquant sa pertinence (plus c'est élevé, plus c'est adapté)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p><strong>Priorisation :</strong> Les suggestions sont classées par priorité selon l'impact potentiel sur votre organisation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => {
            const isExpanded = expandedSuggestion === suggestion.id;
            const confidenceInfo = getConfidenceLabel(suggestion.confidence);
            
            return (
              <div key={suggestion.id} className="border border-gray-200 rounded-lg">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-3">
                        <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                          
                          <div className="flex items-center space-x-4 mt-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                              Priorité: {suggestion.priority.toUpperCase()}
                            </span>
                            <span className={`text-sm font-medium ${confidenceInfo.color}`}>
                              {Math.round(suggestion.confidence * 100)}% - {confidenceInfo.label}
                            </span>
                          </div>

                          {/* Référentiels */}
                          {suggestion.frameworks && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {suggestion.frameworks.iso27002?.length > 0 && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  ISO 27002: {suggestion.frameworks.iso27002.join(', ')}
                                </span>
                              )}
                              {suggestion.frameworks.nist?.length > 0 && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  NIST: {suggestion.frameworks.nist.join(', ')}
                                </span>
                              )}
                              {suggestion.frameworks.cis?.length > 0 && (
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                  CIS: {suggestion.frameworks.cis.join(', ')}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setExpandedSuggestion(isExpanded ? null : suggestion.id)}
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onApplySuggestion(suggestion)}
                      >
                        Appliquer
                      </Button>
                    </div>
                  </div>

                  {/* Détails étendus */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                          <Brain className="h-4 w-4 mr-2" />
                          Raisonnement de l'IA
                        </h5>
                        <p className="text-sm text-gray-700">{suggestion.reasoning}</p>
                        
                        {suggestion.category && (
                          <div className="mt-3">
                            <span className="text-xs text-gray-500">Catégorie: </span>
                            <span className="text-xs font-medium text-gray-700">{suggestion.category}</span>
                          </div>
                        )}
                        
                        {suggestion.expertise && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-500">Expertise requise: </span>
                            <span className="text-xs font-medium text-gray-700">{suggestion.expertise}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Légende */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Info className="h-4 w-4 mr-2" />
            Comprendre les suggestions IA
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Score de confiance :</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• <span className="text-green-600">80-100%</span> : Très pertinent pour votre contexte</li>
                <li>• <span className="text-blue-600">60-79%</span> : Pertinent, à considérer</li>
                <li>• <span className="text-yellow-600">40-59%</span> : Moyennement pertinent</li>
                <li>• <span className="text-gray-600">&lt;40%</span> : Peu pertinent</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Priorité :</h5>
              <ul className="space-y-1 text-gray-600">
                <li>• <span className="text-red-600">CRITICAL</span> : À traiter en urgence</li>
                <li>• <span className="text-orange-600">HIGH</span> : Important à considérer</li>
                <li>• <span className="text-yellow-600">MEDIUM</span> : Utile à moyen terme</li>
                <li>• <span className="text-gray-600">LOW</span> : Optionnel</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionsExplainer;
