import React, { useState } from 'react';
import { Sparkles, RefreshCw, Check, Copy } from 'lucide-react';
import Button from '../ui/button';
import { cn } from '../../lib/utils';

interface Suggestion {
  text: string;
  confidence: number; // 0-1
  source?: string; // Ex: "Basé sur des cas similaires"
}

interface AIFieldSuggestionProps {
  fieldName: string;
  fieldType: 'text' | 'textarea' | 'select';
  suggestions: Suggestion[];
  onApply: (value: string) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
  className?: string;
  placeholder?: string;
}

const AIFieldSuggestion: React.FC<AIFieldSuggestionProps> = ({
  fieldName,
  fieldType,
  suggestions,
  onApply,
  onRefresh,
  isLoading = false,
  className,
  placeholder = "L'IA peut vous aider..."
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleApply = (suggestion: Suggestion, index: number) => {
    onApply(suggestion.text);
    setSelectedIndex(index);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'Haute confiance';
    if (confidence >= 0.6) return 'Confiance moyenne';
    return 'Confiance faible';
  };

  if (suggestions.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className={cn("mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3", className)}>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-900">
            Suggestions IA pour {fieldName}
          </span>
        </div>
        {onRefresh && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-7 px-2"
          >
            <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center space-x-2 py-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '0.1s' }} />
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500" style={{ animationDelay: '0.2s' }} />
          <span className="text-sm text-blue-700">Génération en cours...</span>
        </div>
      ) : (
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={cn(
                "rounded-md border bg-white p-2 transition-all",
                selectedIndex === index 
                  ? "border-green-400 bg-green-50" 
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  {fieldType === 'textarea' ? (
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {suggestion.text}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-700">
                      {suggestion.text}
                    </p>
                  )}
                  
                  <div className="mt-1 flex items-center space-x-3">
                    <span className={cn(
                      "text-xs font-medium",
                      getConfidenceColor(suggestion.confidence)
                    )}>
                      {Math.round(suggestion.confidence * 100)}% • {getConfidenceLabel(suggestion.confidence)}
                    </span>
                    {suggestion.source && (
                      <span className="text-xs text-gray-500">
                        {suggestion.source}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(suggestion.text, index)}
                    className="h-7 w-7 p-0"
                    title="Copier"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant={selectedIndex === index ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => handleApply(suggestion, index)}
                    className="h-7 px-2 text-xs"
                  >
                    {selectedIndex === index ? "Appliqué" : "Appliquer"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && suggestions.length === 0 && (
        <p className="text-sm italic text-blue-600">
          {placeholder}
        </p>
      )}
    </div>
  );
};

export default AIFieldSuggestion;

// Hook pour générer des suggestions
export const useAISuggestions = (
  fieldName: string,
  context: any,
  dependencies: any[] = []
) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateSuggestions = async () => {
    setIsLoading(true);
    
    // Simulation de génération IA
    setTimeout(() => {
      // Logique de génération selon le champ
      const newSuggestions = generateFieldSuggestions(fieldName, context);
      setSuggestions(newSuggestions);
      setIsLoading(false);
    }, 1000);
  };

  React.useEffect(() => {
    if (dependencies.some(dep => dep)) {
      generateSuggestions();
    }
  }, dependencies);

  return {
    suggestions,
    isLoading,
    refresh: generateSuggestions
  };
};

// Fonction de génération de suggestions (à remplacer par appel API)
function generateFieldSuggestions(fieldName: string, context: any): Suggestion[] {
  // Exemples de suggestions selon le type de champ
  const suggestionTemplates: Record<string, Suggestion[]> = {
    description: [
      {
        text: "Cette valeur métier représente un processus critique pour l'organisation, impliquant la gestion et le traitement des données sensibles nécessaires à l'activité principale.",
        confidence: 0.85,
        source: "Basé sur des valeurs métier similaires"
      },
      {
        text: "Processus essentiel garantissant la continuité des opérations et la conformité réglementaire, avec un impact direct sur la satisfaction client.",
        confidence: 0.75,
        source: "Template EBIOS RM"
      }
    ],
    responsableEntite: [
      {
        text: "Direction des Systèmes d'Information (DSI)",
        confidence: 0.9,
        source: "Rôle fréquent pour ce type de valeur"
      },
      {
        text: "Responsable de la Sécurité des Systèmes d'Information (RSSI)",
        confidence: 0.8,
        source: "Recommandation ANSSI"
      }
    ],
    name: [
      {
        text: "Gestion des données clients",
        confidence: 0.7,
        source: "Suggestion basée sur le contexte"
      },
      {
        text: "Processus de production principal",
        confidence: 0.65,
        source: "Cas d'usage fréquent"
      }
    ]
  };

  return suggestionTemplates[fieldName] || [];
} 