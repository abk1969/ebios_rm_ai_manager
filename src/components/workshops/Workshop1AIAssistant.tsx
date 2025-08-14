/**
 * 🤖 ASSISTANT IA WORKSHOP 1
 * Composant d'aide contextuelle et de suggestions pour l'atelier 1
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Lightbulb,
  HelpCircle,
  Target,
  Plus,
  BookOpen,
  ChevronRight,
  X,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  Bot,
  Cpu,
  Wifi,
  WifiOff
} from 'lucide-react';
import Button from '../ui/button';
import { cn } from '@/lib/utils';
import { pythonAIService, type AISuggestion, type WorkshopAnalysis } from '../../services/ai/PythonAIIntegrationService';
import { logger } from '../../services/logging/SecureLogger';
import { missionContextualAI } from '../../services/ai/MissionContextualAIOrchestrator';

interface AIAssistantProps {
  missionId: string;
  currentStep: string;
  businessValues: any[];
  essentialAssets: any[];
  supportingAssets: any[];
  dreadedEvents: any[];
  onAddBusinessValue: () => void;
  onAddEssentialAsset: () => void;
  onAddSupportingAsset: () => void;
  onAddDreadedEvent: () => void;
  onNavigateToStep: (step: string) => void;
  className?: string;
}

// Interface locale pour compatibilité
interface LocalAISuggestion {
  id: string;
  type: 'action' | 'tip' | 'warning' | 'insight';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  priority: 'high' | 'medium' | 'low';
}

const Workshop1AIAssistant: React.FC<AIAssistantProps> = ({
  missionId,
  currentStep,
  businessValues,
  essentialAssets,
  supportingAssets,
  dreadedEvents,
  onAddBusinessValue,
  onAddEssentialAsset,
  onAddSupportingAsset,
  onAddDreadedEvent,
  onNavigateToStep,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'help' | 'progress'>('suggestions');
  const [suggestions, setSuggestions] = useState<LocalAISuggestion[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isAIServiceAvailable, setIsAIServiceAvailable] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [workshopAnalysis, setWorkshopAnalysis] = useState<WorkshopAnalysis | null>(null);

  // 🎯 États pour l'IA contextuelle mission
  const [contextualSuggestions, setContextualSuggestions] = useState<any[]>([]);
  const [isLoadingContextual, setIsLoadingContextual] = useState(false);
  const [missionContext, setMissionContext] = useState<any>(null);

  // Vérification de la disponibilité du service IA
  useEffect(() => {
    setIsAIServiceAvailable(pythonAIService.isAvailable());
  }, []);

  // Génération des suggestions contextuelles
  useEffect(() => {
    generateContextualSuggestions();
    if (isAIServiceAvailable) {
      loadAISuggestions();
    }
    // 🎯 Charger les suggestions contextuelles mission
    loadMissionContextualSuggestions();
  }, [currentStep, businessValues, essentialAssets, supportingAssets, dreadedEvents, isAIServiceAvailable]);

  /**
   * Charge les suggestions depuis le service Python IA
   */
  const loadAISuggestions = async () => {
    if (!isAIServiceAvailable || !missionId) return;

    setIsLoadingAI(true);
    try {
      logger.info('🤖 Chargement suggestions IA pour Workshop 1', {
        mission_id: missionId,
        current_step: currentStep
      });

      // Analyse complète du workshop
      const analysisRequest = {
        mission_id: missionId,
        business_values: businessValues,
        essential_assets: essentialAssets,
        supporting_assets: supportingAssets,
        dreaded_events: dreadedEvents,
        current_step: currentStep
      };

      const analysis = await pythonAIService.analyzeWorkshop1(analysisRequest);

      if (analysis) {
        setWorkshopAnalysis(analysis);
        setAiSuggestions(analysis.suggestions);

        logger.info('✅ Suggestions IA chargées', {
          suggestions_count: analysis.suggestions.length,
          completion_percentage: Object.values(analysis.completion_status).filter(Boolean).length * 25
        });
      }

    } catch (error) {
      logger.error('❌ Erreur chargement suggestions IA', {
        error: error instanceof Error ? error.message : 'Unknown error',
        mission_id: missionId
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  /**
   * Applique une suggestion IA
   */
  const applyAISuggestion = async (suggestion: AISuggestion) => {
    try {
      logger.info('🎯 Application suggestion IA', {
        suggestion_id: suggestion.id,
        type: suggestion.type
      });

      // Marquer la suggestion comme appliquée
      setAiSuggestions(prev =>
        prev.map(s => s.id === suggestion.id ? { ...s, applied: true } : s)
      );

      // Exécuter l'action si définie
      if (suggestion.action_data && callbacks) {
        const { action_type, target_section, data } = suggestion.action_data;

        switch (action_type) {
          case 'navigate':
            callbacks.onNavigateToSection?.(target_section);
            break;
          case 'add_business_value':
            callbacks.onAddBusinessValue?.();
            break;
          case 'add_essential_asset':
            callbacks.onAddEssentialAsset?.(data?.business_value_id);
            break;
          case 'add_supporting_asset':
            callbacks.onAddSupportingAsset?.(data?.essential_asset_id);
            break;
          case 'add_dreaded_event':
            callbacks.onAddDreadedEvent?.(data?.business_value_id);
            break;
        }
      }

      logger.info('✅ Suggestion IA appliquée avec succès', { suggestion_id: suggestion.id });

    } catch (error) {
      logger.error('❌ Erreur application suggestion IA', {
        error: error instanceof Error ? error.message : 'Unknown error',
        suggestion_id: suggestion.id
      });
    }
  };

  /**
   * 🎯 Charge les suggestions contextuelles basées sur la mission
   */
  const loadMissionContextualSuggestions = useCallback(async () => {
    if (!missionId || isLoadingContextual) return;

    setIsLoadingContextual(true);

    try {
      // Récupérer le contexte de la mission depuis Firebase
      // TODO: Implémenter la récupération du contexte mission
      const mockMissionContext = {
        organizationName: "Organisation Test",
        sector: "Santé",
        organizationSize: "PME (10-250 salariés)",
        criticalProcesses: ["Gestion des patients", "Facturation"],
        regulations: ["RGPD", "HDS"],
        siComponents: ["Serveur de base de données", "Application web"]
      };

      setMissionContext(mockMissionContext);

      // Générer les suggestions contextuelles
      const workshopData = {
        workshopNumber: 1 as const,
        currentStep,
        existingData: {
          businessValues,
          essentialAssets,
          supportingAssets,
          dreadedEvents
        },
        missionContext: mockMissionContext,
        previousWorkshopsData: {}
      };

      const contextualSuggs = await missionContextualAI.generateWorkshopContextualSuggestions(workshopData);
      setContextualSuggestions(contextualSuggs);

      logger.info('🎯 Suggestions contextuelles mission chargées', {
        mission_id: missionId,
        suggestions_count: contextualSuggs.length,
        sector: mockMissionContext.sector
      });

    } catch (error) {
      logger.error('❌ Erreur chargement suggestions contextuelles', {
        error: error instanceof Error ? error.message : 'Unknown error',
        mission_id: missionId
      });
      setContextualSuggestions([]);
    } finally {
      setIsLoadingContextual(false);
    }
  }, [missionId, isLoadingContextual]);

  const generateContextualSuggestions = () => {
    const newSuggestions: LocalAISuggestion[] = [];

    // Suggestions basées sur l'étape actuelle
    switch (currentStep) {
      case 'business-values':
        if (businessValues.length === 0) {
          newSuggestions.push({
            id: 'first-business-value',
            type: 'action',
            title: '🎯 Commencez par vos valeurs métier',
            description: 'Identifiez ce qui a de la valeur pour votre organisation : processus critiques, données sensibles, réputation...',
            action: {
              label: 'Ajouter une valeur métier',
              onClick: onAddBusinessValue
            },
            priority: 'high'
          });
        } else if (businessValues.length < 3) {
          newSuggestions.push({
            id: 'more-business-values',
            type: 'tip',
            title: '💡 Enrichissez vos valeurs métier',
            description: 'Une analyse complète nécessite généralement 3-7 valeurs métier. Pensez aux différents aspects de votre activité.',
            action: {
              label: 'Ajouter une valeur métier',
              onClick: onAddBusinessValue
            },
            priority: 'medium'
          });
        }
        break;

      case 'essential-assets':
        if (businessValues.length === 0) {
          newSuggestions.push({
            id: 'need-business-values',
            type: 'warning',
            title: '⚠️ Valeurs métier requises',
            description: 'Vous devez d\'abord définir vos valeurs métier avant d\'identifier les biens essentiels.',
            action: {
              label: 'Retour aux valeurs métier',
              onClick: () => onNavigateToStep('business-values')
            },
            priority: 'high'
          });
        } else if (essentialAssets.length === 0) {
          newSuggestions.push({
            id: 'first-essential-asset',
            type: 'action',
            title: '🏗️ Identifiez vos biens essentiels',
            description: 'Les biens essentiels sont les informations, processus et savoir-faire indispensables qui supportent vos valeurs métier.',
            action: {
              label: 'Ajouter un bien essentiel',
              onClick: onAddEssentialAsset
            },
            priority: 'high'
          });
        }
        break;

      case 'supporting-assets':
        if (businessValues.length === 0) {
          newSuggestions.push({
            id: 'need-business-values-support',
            type: 'warning',
            title: '⚠️ Valeurs métier requises',
            description: 'Définissez d\'abord vos valeurs métier pour identifier les biens supports.',
            action: {
              label: 'Retour aux valeurs métier',
              onClick: () => onNavigateToStep('business-values')
            },
            priority: 'high'
          });
        } else if (supportingAssets.length === 0) {
          newSuggestions.push({
            id: 'first-supporting-asset',
            type: 'action',
            title: '🔧 Ajoutez vos biens supports',
            description: 'Les biens supports sont les éléments techniques, organisationnels ou humains qui permettent de réaliser vos valeurs métier.',
            action: {
              label: 'Ajouter un bien support',
              onClick: onAddSupportingAsset
            },
            priority: 'high'
          });
        }
        break;

      case 'dreaded-events':
        if (businessValues.length === 0) {
          newSuggestions.push({
            id: 'need-business-values-events',
            type: 'warning',
            title: '⚠️ Valeurs métier requises',
            description: 'Les événements redoutés sont liés aux valeurs métier. Définissez-les d\'abord.',
            action: {
              label: 'Retour aux valeurs métier',
              onClick: () => onNavigateToStep('business-values')
            },
            priority: 'high'
          });
        } else if (dreadedEvents.length === 0) {
          newSuggestions.push({
            id: 'first-dreaded-event',
            type: 'action',
            title: '🚨 Définissez vos événements redoutés',
            description: 'Identifiez ce que vous craignez qu\'il arrive à vos valeurs métier : vol, destruction, indisponibilité...',
            action: {
              label: 'Ajouter un événement redouté',
              onClick: onAddDreadedEvent
            },
            priority: 'high'
          });
        }
        break;
    }

    // Suggestions générales d'amélioration
    if (businessValues.length > 0 && essentialAssets.length === 0) {
      newSuggestions.push({
        id: 'next-step-essential',
        type: 'insight',
        title: '➡️ Prochaine étape suggérée',
        description: 'Maintenant que vous avez des valeurs métier, identifiez les biens essentiels qui les supportent.',
        action: {
          label: 'Aller aux biens essentiels',
          onClick: () => onNavigateToStep('essential-assets')
        },
        priority: 'medium'
      });
    }

    if (businessValues.length > 0 && essentialAssets.length > 0 && supportingAssets.length === 0) {
      newSuggestions.push({
        id: 'next-step-supporting',
        type: 'insight',
        title: '➡️ Continuez avec les biens supports',
        description: 'Identifiez maintenant les éléments techniques et organisationnels qui supportent vos biens essentiels.',
        action: {
          label: 'Aller aux biens supports',
          onClick: () => onNavigateToStep('supporting-assets')
        },
        priority: 'medium'
      });
    }

    setSuggestions(newSuggestions);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'action': return <Zap className="h-4 w-4 text-blue-600" />;
      case 'tip': return <Lightbulb className="h-4 w-4 text-yellow-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'insight': return <Info className="h-4 w-4 text-purple-600" />;
      default: return <HelpCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'action': return 'border-blue-200 bg-blue-50';
      case 'tip': return 'border-yellow-200 bg-yellow-50';
      case 'warning': return 'border-red-200 bg-red-50';
      case 'insight': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  if (!isExpanded) {
    return (
      <div className={cn('fixed bottom-4 right-4 z-40', className)}>
        <Button
          onClick={() => setIsExpanded(true)}
          className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl border z-40', className)}>
      {/* En-tête */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={cn(
              "p-1 rounded",
              isAIServiceAvailable ? "bg-green-100" : "bg-blue-100"
            )}>
              {isAIServiceAvailable ? (
                <Bot className="h-4 w-4 text-green-600" />
              ) : (
                <Lightbulb className="h-4 w-4 text-blue-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Assistant IA</h3>
                {isAIServiceAvailable ? (
                  <div className="flex items-center gap-1">
                    <Wifi className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">IA Avancée</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <WifiOff className="h-3 w-3 text-gray-500" />
                    <span className="text-xs text-gray-500">Mode Local</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Onglets */}
        <div className="flex space-x-1 mt-3">
          {[
            { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
            { id: 'help', label: 'Aide', icon: HelpCircle },
            { id: 'progress', label: 'Progression', icon: Target }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center space-x-1 px-3 py-1 rounded text-xs font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <tab.icon className="h-3 w-3" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === 'suggestions' && (
          <div className="space-y-3">
            {/* Indicateur de chargement IA */}
            {isLoadingAI && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-600">Analyse IA en cours...</span>
              </div>
            )}

            {/* Suggestions IA avancées */}
            {isAIServiceAvailable && aiSuggestions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Bot className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Suggestions IA Avancées</span>
                </div>
                {aiSuggestions.filter(s => !s.applied).map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className={cn(
                      'p-3 rounded-lg border',
                      suggestion.priority === 'critical' ? 'border-red-200 bg-red-50' :
                      suggestion.priority === 'high' ? 'border-orange-200 bg-orange-50' :
                      suggestion.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    )}
                  >
                    <div className="flex items-start space-x-2">
                      <div className={cn(
                        "p-1 rounded",
                        suggestion.priority === 'critical' ? 'bg-red-100' :
                        suggestion.priority === 'high' ? 'bg-orange-100' :
                        suggestion.priority === 'medium' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      )}>
                        {suggestion.type === 'action' && <Zap className="h-3 w-3 text-blue-600" />}
                        {suggestion.type === 'tip' && <Lightbulb className="h-3 w-3 text-yellow-600" />}
                        {suggestion.type === 'warning' && <AlertTriangle className="h-3 w-3 text-orange-600" />}
                        {suggestion.type === 'insight' && <Info className="h-3 w-3 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {suggestion.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {suggestion.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            Confiance: {Math.round(suggestion.confidence * 100)}%
                          </span>
                          {suggestion.action_label && (
                            <Button
                              size="sm"
                              onClick={() => applyAISuggestion(suggestion)}
                              className="text-xs"
                            >
                              {suggestion.action_label}
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 🎯 Suggestions contextuelles mission */}
            {contextualSuggestions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Suggestions Contextuelles Mission</span>
                  {missionContext?.sector && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {missionContext.sector}
                    </span>
                  )}
                </div>
                {contextualSuggestions.slice(0, 3).map((suggestion, index) => (
                  <div
                    key={suggestion.id || index}
                    className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Lightbulb className="h-3 w-3 text-amber-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {suggestion.title}
                          </span>
                          {suggestion.sectorSpecific && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded">
                              Secteur
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {suggestion.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-purple-600">
                            Pertinence: {suggestion.contextualRelevance || 80}%
                          </span>
                          {suggestion.implementationPriority && (
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded",
                              suggestion.implementationPriority === 'immediate'
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            )}>
                              {suggestion.implementationPriority === 'immediate' ? 'Urgent' : 'Planifié'}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Appliquer la suggestion contextuelle
                          console.log('🎯 Application suggestion contextuelle:', suggestion);
                        }}
                        className="ml-2"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {contextualSuggestions.length > 3 && (
                  <div className="text-center">
                    <span className="text-xs text-purple-600">
                      +{contextualSuggestions.length - 3} autres suggestions contextuelles
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Indicateur de chargement contextuel */}
            {isLoadingContextual && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                <span className="ml-2 text-sm text-purple-600">Analyse contexte mission...</span>
              </div>
            )}

            {/* Séparateur si les deux types de suggestions sont présents */}
            {(isAIServiceAvailable && aiSuggestions.length > 0 || contextualSuggestions.length > 0) && suggestions.length > 0 && (
              <div className="border-t border-gray-200 my-4"></div>
            )}

            {/* Suggestions locales de base */}
            {suggestions.length === 0 && (!isAIServiceAvailable || aiSuggestions.length === 0) ? (
              <div className="text-center py-6">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Excellent travail ! Continuez ainsi.
                </p>
              </div>
            ) : (
              <>
                {suggestions.length > 0 && (
                  <div className="space-y-2">
                    {!isAIServiceAvailable && (
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Suggestions de Base</span>
                      </div>
                    )}
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className={cn('p-3 rounded-lg border', getColorForType(suggestion.type))}
                      >
                        <div className="flex items-start space-x-2">
                          {getIconForType(suggestion.type)}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {suggestion.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1">
                              {suggestion.description}
                            </p>
                            {suggestion.action && (
                              <Button
                                size="sm"
                                onClick={suggestion.action.onClick}
                                className="mt-2 text-xs"
                              >
                                {suggestion.action.label}
                                <ChevronRight className="h-3 w-3 ml-1" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'help' && (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 text-sm mb-2">
                📚 Guide EBIOS RM - Atelier 1
              </h4>
              <div className="text-xs text-blue-800 space-y-2">
                <p><strong>Objectif :</strong> Identifier le socle de sécurité</p>
                <p><strong>Étapes :</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Valeurs métier (ce qui a de la valeur)</li>
                  <li>Biens essentiels (informations, processus, savoir-faire)</li>
                  <li>Biens supports (technique, organisationnel, humain)</li>
                  <li>Événements redoutés (ce qu'on craint)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-3">
            <div className="space-y-2">
              {[
                { label: 'Valeurs métier', count: businessValues.length, min: 1 },
                { label: 'Biens essentiels', count: essentialAssets.length, min: 1 },
                { label: 'Biens supports', count: supportingAssets.length, min: 1 },
                { label: 'Événements redoutés', count: dreadedEvents.length, min: 1 }
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{item.count}</span>
                    {item.count >= item.min ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workshop1AIAssistant;
