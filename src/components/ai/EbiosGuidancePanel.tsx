/**
 * 🎯 PANNEAU DE GUIDANCE MÉTHODOLOGIQUE EBIOS RM
 * Interface d'assistance contextuelle pour la méthodologie ANSSI
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb,
  Clock,
  Target,
  FileText,
  ChevronDown,
  ChevronUp,
  Info,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '../ui/button';
import { 
  EbiosGuidanceService, 
  type WorkshopGuidance, 
  type ContextualHelp,
  type EbiosMethodologyTip 
} from '@/services/ai/EbiosGuidanceService';

interface EbiosGuidancePanelProps {
  workshop: number;
  currentStep?: string;
  currentData?: any;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const EbiosGuidancePanel: React.FC<EbiosGuidancePanelProps> = ({
  workshop,
  currentStep,
  currentData,
  className,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'help' | 'tips'>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['objectives']));
  const [guidance, setGuidance] = useState<WorkshopGuidance | null>(null);
  const [contextualHelp, setContextualHelp] = useState<ContextualHelp | null>(null);
  const [methodologyTips, setMethodologyTips] = useState<EbiosMethodologyTip[]>([]);

  useEffect(() => {
    // Charger la guidance pour l'atelier
    const workshopGuidance = EbiosGuidanceService.getWorkshopGuidance(workshop);
    setGuidance(workshopGuidance);

    // Charger l'aide contextuelle si une étape est spécifiée
    if (currentStep) {
      const help = EbiosGuidanceService.getContextualHelp(workshop, currentStep);
      setContextualHelp(help);
    }

    // Générer les conseils méthodologiques
    const tips = EbiosGuidanceService.generateMethodologyTips(workshop, currentData || {});
    setMethodologyTips(tips);
  }, [workshop, currentStep, currentData]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getPriorityColor = (priority: EbiosMethodologyTip['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getCategoryIcon = (category: EbiosMethodologyTip['category']) => {
    switch (category) {
      case 'methodology': return <BookOpen className="h-4 w-4" />;
      case 'validation': return <CheckCircle className="h-4 w-4" />;
      case 'best_practice': return <Lightbulb className="h-4 w-4" />;
      case 'common_error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  if (isCollapsed) {
    return (
      <div className={cn('bg-white rounded-lg shadow-sm border p-2', className)}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (!guidance) {
    return (
      <div className={cn('bg-white rounded-lg shadow-sm border p-4', className)}>
        <div className="text-center text-gray-500">
          Chargement de la guidance...
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-lg shadow-sm border', className)}>
      {/* En-tête */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              Guidance EBIOS RM
            </h3>
            <p className="text-sm text-gray-600">
              {guidance.title} - Assistance méthodologique
            </p>
          </div>
          {onToggleCollapse && (
            <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
              <ChevronUp className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Onglets */}
        <div className="flex space-x-1 mt-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              'px-3 py-1 text-sm rounded-md transition-colors',
              activeTab === 'overview' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Vue d'ensemble
          </button>
          {contextualHelp && (
            <button
              onClick={() => setActiveTab('help')}
              className={cn(
                'px-3 py-1 text-sm rounded-md transition-colors',
                activeTab === 'help' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Aide contextuelle
            </button>
          )}
          {methodologyTips.length > 0 && (
            <button
              onClick={() => setActiveTab('tips')}
              className={cn(
                'px-3 py-1 text-sm rounded-md transition-colors relative',
                activeTab === 'tips' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Conseils
              {methodologyTips.filter(tip => tip.priority === 'critical').length > 0 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Objectifs */}
            <div>
              <button
                onClick={() => toggleSection('objectives')}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-green-600" />
                  Objectifs
                </h4>
                {expandedSections.has('objectives') ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </button>
              {expandedSections.has('objectives') && (
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  {guidance.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-3 w-3 mt-0.5 mr-2 text-green-500 flex-shrink-0" />
                      {objective}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Méthodologie */}
            <div>
              <button
                onClick={() => toggleSection('methodology')}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="font-medium text-gray-900 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                  Méthodologie
                </h4>
                {expandedSections.has('methodology') ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </button>
              {expandedSections.has('methodology') && (
                <p className="mt-2 text-sm text-gray-600">
                  {guidance.methodology}
                </p>
              )}
            </div>

            {/* Livrables */}
            <div>
              <button
                onClick={() => toggleSection('deliverables')}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="font-medium text-gray-900 flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-purple-600" />
                  Livrables attendus
                </h4>
                {expandedSections.has('deliverables') ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </button>
              {expandedSections.has('deliverables') && (
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  {guidance.deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start">
                      <FileText className="h-3 w-3 mt-0.5 mr-2 text-purple-500 flex-shrink-0" />
                      {deliverable}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Erreurs courantes */}
            <div>
              <button
                onClick={() => toggleSection('mistakes')}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="font-medium text-gray-900 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                  Erreurs à éviter
                </h4>
                {expandedSections.has('mistakes') ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </button>
              {expandedSections.has('mistakes') && (
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  {guidance.commonMistakes.map((mistake, index) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle className="h-3 w-3 mt-0.5 mr-2 text-red-500 flex-shrink-0" />
                      {mistake}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Bonnes pratiques */}
            <div>
              <button
                onClick={() => toggleSection('practices')}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                  Bonnes pratiques
                </h4>
                {expandedSections.has('practices') ? 
                  <ChevronUp className="h-4 w-4" /> : 
                  <ChevronDown className="h-4 w-4" />
                }
              </button>
              {expandedSections.has('practices') && (
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  {guidance.bestPractices.map((practice, index) => (
                    <li key={index} className="flex items-start">
                      <Lightbulb className="h-3 w-3 mt-0.5 mr-2 text-yellow-500 flex-shrink-0" />
                      {practice}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Informations pratiques */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium">Durée estimée :</span>
                <span className="ml-1 text-gray-600">{guidance.estimatedDuration}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'help' && contextualHelp && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">{contextualHelp.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{contextualHelp.description}</p>
            </div>

            {contextualHelp.steps.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-800 mb-2">Étapes recommandées :</h5>
                <ol className="space-y-1 text-sm text-gray-600">
                  {contextualHelp.steps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-blue-100 text-blue-800 text-xs rounded-full h-5 w-5 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {contextualHelp.examples.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-800 mb-2">Exemples :</h5>
                <ul className="space-y-1 text-sm text-gray-600">
                  {contextualHelp.examples.map((example, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {contextualHelp.warnings.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h5 className="font-medium text-yellow-800 mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Points d'attention :
                </h5>
                <ul className="space-y-1 text-sm text-yellow-700">
                  {contextualHelp.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-500 mr-2">⚠</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="space-y-3">
            {methodologyTips.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>Aucun conseil particulier pour le moment.</p>
                <p className="text-xs">Votre méthodologie semble bien suivie !</p>
              </div>
            ) : (
              methodologyTips.map((tip) => (
                <div
                  key={tip.id}
                  className={cn(
                    'border rounded-lg p-3',
                    getPriorityColor(tip.priority)
                  )}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {getCategoryIcon(tip.category)}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium mb-1">{tip.title}</h5>
                      <p className="text-sm opacity-90">{tip.description}</p>
                      {tip.actionable && (
                        <div className="mt-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            Appliquer le conseil
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
      </div>

      {/* Footer avec références */}
      <div className="border-t p-3 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Guidance basée sur EBIOS RM v1.5</span>
          <a
            href="https://www.ssi.gouv.fr/guide/ebios-risk-manager-the-method/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center hover:text-blue-600"
          >
            Documentation ANSSI
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default EbiosGuidancePanel;
