/**
 * 🤖 COMPOSANT SUGGESTIONS IA CONTEXTE MISSION
 * Affiche les suggestions IA contextuelles dans le formulaire de mission
 */

import React from 'react';
import { 
  Lightbulb, 
  Bot, 
  Sparkles, 
  Plus, 
  Loader2,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MissionContextAISuggestionsProps {
  suggestions: any[];
  isLoading: boolean;
  currentField: string;
  onApplySuggestion: (suggestion: any) => void;
  onLoadSuggestions: (fieldName: string) => void;
  className?: string;
}

const MissionContextAISuggestions: React.FC<MissionContextAISuggestionsProps> = ({
  suggestions,
  isLoading,
  currentField,
  onApplySuggestion,
  onLoadSuggestions,
  className
}) => {
  
  if (!currentField) return null;

  return (
    <div className={cn("mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200", className)}>
      {/* En-tête avec bouton de chargement */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            Suggestions IA pour {currentField}
          </span>
          {isLoading && <Loader2 className="h-3 w-3 animate-spin text-blue-600" />}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onLoadSuggestions(currentField)}
          disabled={isLoading}
          className="text-xs"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Analyse...
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 mr-1" />
              Générer
            </>
          )}
        </Button>
      </div>

      {/* Liste des suggestions */}
      {suggestions.length > 0 ? (
        <div className="space-y-2">
          {suggestions.slice(0, 5).map((suggestion, index) => (
            <div
              key={suggestion.id || index}
              className="flex items-start justify-between p-2 bg-white rounded border border-blue-100 hover:border-blue-300 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="h-3 w-3 text-amber-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.title}
                  </span>
                  
                  {/* Badges de contexte */}
                  <div className="flex gap-1">
                    {suggestion.sectorSpecific && (
                      <Badge variant="secondary" className="text-xs">
                        Secteur
                      </Badge>
                    )}
                    {suggestion.organizationSizeRelevant && (
                      <Badge variant="secondary" className="text-xs">
                        Taille
                      </Badge>
                    )}
                    {suggestion.regulatoryCompliance?.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        Réglementaire
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-gray-600 line-clamp-2">
                  {suggestion.description}
                </p>
                
                {/* Indicateurs de pertinence */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">Pertinence:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-1 h-1 rounded-full mr-0.5",
                            i < Math.round((suggestion.contextualRelevance || 50) / 20)
                              ? "bg-green-500"
                              : "bg-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {suggestion.contextualRelevance || 50}%
                    </span>
                  </div>
                  
                  {suggestion.implementationPriority && (
                    <Badge 
                      variant={
                        suggestion.implementationPriority === 'immediate' ? 'destructive' :
                        suggestion.implementationPriority === 'short-term' ? 'default' :
                        'secondary'
                      }
                      className="text-xs"
                    >
                      {suggestion.implementationPriority === 'immediate' ? 'Urgent' :
                       suggestion.implementationPriority === 'short-term' ? 'Court terme' :
                       suggestion.implementationPriority === 'medium-term' ? 'Moyen terme' :
                       'Long terme'}
                    </Badge>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onApplySuggestion(suggestion)}
                className="ml-2 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Ajouter
              </Button>
            </div>
          ))}
          
          {suggestions.length > 5 && (
            <div className="text-center">
              <span className="text-xs text-gray-500">
                +{suggestions.length - 5} autres suggestions disponibles
              </span>
            </div>
          )}
        </div>
      ) : !isLoading ? (
        <div className="text-center py-4">
          <div className="flex flex-col items-center gap-2">
            <Lightbulb className="h-6 w-6 text-gray-400" />
            <p className="text-sm text-gray-500">
              Cliquez sur "Générer" pour obtenir des suggestions IA
            </p>
            <p className="text-xs text-gray-400">
              Suggestions basées sur votre secteur et contexte organisationnel
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            <p className="text-sm text-blue-600">
              Analyse du contexte en cours...
            </p>
            <p className="text-xs text-gray-500">
              Génération de suggestions personnalisées
            </p>
          </div>
        </div>
      )}

      {/* Informations contextuelles */}
      {suggestions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="flex items-center gap-2 text-xs text-blue-700">
            <CheckCircle className="h-3 w-3" />
            <span>
              Suggestions générées selon votre contexte organisationnel
            </span>
          </div>
          
          {suggestions.some(s => s.crossWorkshopImpact?.length > 0) && (
            <div className="flex items-center gap-2 text-xs text-purple-700 mt-1">
              <ArrowRight className="h-3 w-3" />
              <span>
                Impact sur les ateliers suivants détecté
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MissionContextAISuggestions;
