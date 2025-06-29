/**
 * 🤖 PANNEAU SUGGESTIONS IA - CORRECTION AUTOMATIQUE
 * Affiche les suggestions intelligentes pour corriger les problèmes EBIOS RM
 */

import React, { useState, useEffect } from 'react';
import { Lightbulb, Zap, Clock, BookOpen, ChevronRight, X, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import { AutoFixSuggestionService } from '@/services/ai/AutoFixSuggestionService';

interface AISuggestionPanelProps {
  criterion: string;
  businessValues: any[];
  supportingAssets: any[];
  dreadedEvents: any[];
  onClose: () => void;
  onApplySuggestion: (suggestion: any) => void;
  callbacks: {
    onAddBusinessValue?: () => void;
    onAddSupportingAsset?: (businessValueId?: string) => void;
    onAddDreadedEvent?: (businessValueId?: string) => void;
    onNavigateToSection?: (section: string) => void;
  };
}

const AISuggestionPanel: React.FC<AISuggestionPanelProps> = ({
  criterion,
  businessValues,
  supportingAssets,
  dreadedEvents,
  onClose,
  onApplySuggestion,
  callbacks
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateSuggestions();
  }, [criterion, businessValues, supportingAssets, dreadedEvents]);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const gap = {
        criterion,
        businessValues,
        supportingAssets,
        dreadedEvents
      };
      
      const aiSuggestions = AutoFixSuggestionService.generateSuggestions(gap);
      setSuggestions(aiSuggestions);
    } catch (error) {
      console.error('Erreur génération suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = async (suggestion: any) => {
    try {
      const success = await AutoFixSuggestionService.applySuggestion(suggestion, callbacks);
      if (success) {
        setAppliedSuggestions(prev => new Set([...prev, suggestion.id]));
        onApplySuggestion(suggestion);
      }
    } catch (error) {
      console.error('Erreur application suggestion:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴 Priorité haute';
      case 'medium': return '🟡 Priorité moyenne';
      case 'low': return '🔵 Priorité basse';
      default: return '⚪ Priorité inconnue';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Génération des suggestions IA...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* En-tête */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lightbulb className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  🤖 Suggestions IA - Correction Automatique
                </h2>
                <p className="text-sm text-gray-600">
                  Critère : <span className="font-medium">{criterion}</span>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {suggestions.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                ✅ Aucune correction nécessaire
              </h3>
              <p className="mt-2 text-gray-600">
                Ce critère semble déjà conforme aux exigences EBIOS RM.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Résumé */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      💡 {suggestions.length} suggestion(s) de correction
                    </h3>
                    <p className="text-sm text-blue-700 mt-1">
                      L'IA a analysé votre situation et propose des actions pour corriger automatiquement les problèmes identifiés.
                    </p>
                  </div>
                </div>
              </div>

              {/* Liste des suggestions */}
              {suggestions.map((suggestion, index) => {
                const isApplied = appliedSuggestions.has(suggestion.id);
                
                return (
                  <div
                    key={suggestion.id}
                    className={`border rounded-lg p-4 transition-all duration-200 ${
                      isApplied 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* En-tête suggestion */}
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                            {getPriorityLabel(suggestion.priority)}
                          </span>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {suggestion.estimatedTime}
                          </div>
                        </div>

                        {/* Titre et description */}
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          {isApplied && <CheckCircle className="inline h-5 w-5 text-green-500 mr-2" />}
                          {suggestion.title}
                        </h4>
                        <p className="text-gray-600 mb-3">
                          {suggestion.description}
                        </p>

                        {/* Référence ANSSI */}
                        <div className="flex items-center text-xs text-gray-500 mb-3">
                          <BookOpen className="h-3 w-3 mr-1" />
                          <span className="font-medium">Référence :</span>
                          <span className="ml-1">{suggestion.anssiReference}</span>
                        </div>

                        {/* Données supplémentaires */}
                        {suggestion.data && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">
                              📋 Détails de la suggestion :
                            </h5>
                            {suggestion.data.suggestions && (
                              <ul className="text-sm text-gray-600 space-y-1">
                                {suggestion.data.suggestions.map((item: any, idx: number) => (
                                  <li key={idx} className="flex items-center">
                                    <ChevronRight className="h-3 w-3 mr-1 text-gray-400" />
                                    {item.name} ({item.category || item.type})
                                  </li>
                                ))}
                              </ul>
                            )}
                            {suggestion.data.suggestedAssets && (
                              <ul className="text-sm text-gray-600 space-y-1">
                                {suggestion.data.suggestedAssets.map((asset: any, idx: number) => (
                                  <li key={idx} className="flex items-center">
                                    <ChevronRight className="h-3 w-3 mr-1 text-gray-400" />
                                    {asset.name} ({asset.type})
                                  </li>
                                ))}
                              </ul>
                            )}
                            {suggestion.data.suggestedEvents && (
                              <ul className="text-sm text-gray-600 space-y-1">
                                {suggestion.data.suggestedEvents.map((event: any, idx: number) => (
                                  <li key={idx} className="flex items-center">
                                    <ChevronRight className="h-3 w-3 mr-1 text-gray-400" />
                                    {event.name} (Impact: {event.impactType})
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Bouton d'action */}
                      <div className="ml-4">
                        {isApplied ? (
                          <div className="flex items-center text-green-600 text-sm font-medium">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Appliqué
                          </div>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleApplySuggestion(suggestion)}
                            className="flex items-center gap-2"
                          >
                            <Zap className="h-4 w-4" />
                            Appliquer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pied de page */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              💡 Les suggestions sont générées automatiquement selon les bonnes pratiques EBIOS RM
            </div>
            <Button variant="secondary" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestionPanel;
