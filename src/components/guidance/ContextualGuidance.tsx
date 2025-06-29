/**
 * 🎯 COMPOSANT GUIDAGE CONTEXTUEL INTELLIGENT
 * Système orchestrateur qui unifie et améliore tous les systèmes de guidage existants
 * 
 * CARACTÉRISTIQUES :
 * - Analyse intelligente du contexte utilisateur
 * - Messages d'orientation selon l'état actuel
 * - Suggestions d'actions prioritaires
 * - Intégration avec les systèmes existants sans régression
 * - Liens vers aide ANSSI contextuelle
 */

import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  ArrowRight as _ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
  Target,
  BookOpen as _BookOpen,
  Play,
  Eye as _Eye,
  Edit as _Edit,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// 🎯 TYPES ET INTERFACES
interface ContextualState {
  currentWorkshop: number;
  currentStep?: string;
  completionPercentage: number;
  blockers: string[];
  nextActions: string[];
  userLevel: 'beginner' | 'intermediate' | 'expert';
  lastActivity: Date;
}

interface GuidanceMessage {
  id: string;
  type: 'orientation' | 'action' | 'warning' | 'tip' | 'celebration';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  actionLabel?: string;
  actionCallback?: () => void;
  helpLink?: string;
  dismissible: boolean;
}

interface ContextualGuidanceProps {
  missionId: string;
  currentWorkshop: number;
  workshopData?: any;
  userProgress?: any;
  className?: string;
  onActionClick?: (action: string, data?: any) => void;
}

// 🎯 CONFIGURATION DES MESSAGES CONTEXTUELS
const WORKSHOP_CONTEXTS = {
  1: {
    name: 'Cadrage et Socle',
    keyElements: ['valeurs métier', 'actifs supports', 'événements redoutés'],
    commonBlockers: ['Difficulté à identifier les valeurs métier', 'Confusion entre actifs et valeurs', 'Événements redoutés trop génériques'],
    nextStepHints: ['Commencez par 3-5 valeurs métier principales', 'Liez chaque actif à une valeur métier', 'Soyez spécifique dans les événements redoutés']
  },
  2: {
    name: 'Sources de Risque',
    keyElements: ['sources de risque', 'objectifs visés', 'parties prenantes'],
    commonBlockers: ['Sources de risque trop génériques', 'Objectifs mal définis', 'Parties prenantes incomplètes'],
    nextStepHints: ['Identifiez des sources concrètes', 'Précisez les motivations', 'Cartographiez l\'écosystème complet']
  },
  3: {
    name: 'Scénarios Stratégiques',
    keyElements: ['scénarios stratégiques', 'chemins d\'attaque', 'vraisemblance'],
    commonBlockers: ['Scénarios irréalistes', 'Manque de détails techniques', 'Évaluation de vraisemblance difficile'],
    nextStepHints: ['Basez-vous sur des attaques réelles', 'Détaillez les étapes', 'Utilisez les échelles ANSSI']
  },
  4: {
    name: 'Scénarios Opérationnels',
    keyElements: ['scénarios opérationnels', 'impacts techniques', 'gravité'],
    commonBlockers: ['Transition stratégique→opérationnel floue', 'Impacts sous-estimés', 'Gravité mal évaluée'],
    nextStepHints: ['Décomposez chaque scénario stratégique', 'Quantifiez les impacts', 'Justifiez les niveaux de gravité']
  },
  5: {
    name: 'Traitement du Risque',
    keyElements: ['mesures de sécurité', 'risque résiduel', 'plan d\'action'],
    commonBlockers: ['Mesures inadaptées', 'Coût/bénéfice mal évalué', 'Priorisation difficile'],
    nextStepHints: ['Alignez mesures et risques', 'Évaluez l\'efficacité', 'Priorisez selon le risque résiduel']
  }
};

// 🎯 GÉNÉRATEUR DE MESSAGES INTELLIGENTS
class ContextualGuidanceEngine {
  static analyzeContext(state: ContextualState): GuidanceMessage[] {
    const messages: GuidanceMessage[] = [];
    const workshopContext = WORKSHOP_CONTEXTS[state.currentWorkshop as keyof typeof WORKSHOP_CONTEXTS];

    // 🎯 MESSAGE D'ORIENTATION PRINCIPAL
    if (state.completionPercentage < 25) {
      messages.push({
        id: 'getting-started',
        type: 'orientation',
        priority: 'high',
        title: `Démarrage de l'${workshopContext.name}`,
        message: `Vous commencez l'atelier ${state.currentWorkshop}. Concentrez-vous d'abord sur ${workshopContext.keyElements[0]}.`,
        actionLabel: 'Voir le guide',
        dismissible: false
      });
    } else if (state.completionPercentage < 75) {
      messages.push({
        id: 'in-progress',
        type: 'action',
        priority: 'high',
        title: 'Continuez votre progression',
        message: `Vous avez complété ${state.completionPercentage}% de l'atelier. Prochaine étape : ${workshopContext.keyElements[1] || 'finaliser les éléments'}.`,
        actionLabel: 'Continuer',
        dismissible: true
      });
    } else {
      messages.push({
        id: 'almost-done',
        type: 'celebration',
        priority: 'medium',
        title: 'Presque terminé !',
        message: `Excellent travail ! Il ne reste que quelques éléments à finaliser pour terminer l'atelier ${state.currentWorkshop}.`,
        actionLabel: 'Finaliser',
        dismissible: true
      });
    }

    // 🚨 MESSAGES DE BLOCAGE
    if (state.blockers.length > 0) {
      messages.push({
        id: 'blockers',
        type: 'warning',
        priority: 'high',
        title: 'Points d\'attention',
        message: `${state.blockers.length} point(s) nécessite(nt) votre attention : ${state.blockers[0]}`,
        actionLabel: 'Résoudre',
        dismissible: false
      });
    }

    // 💡 CONSEILS CONTEXTUELS
    if (state.userLevel === 'beginner') {
      const hint = workshopContext.nextStepHints[Math.floor(Math.random() * workshopContext.nextStepHints.length)];
      messages.push({
        id: 'beginner-tip',
        type: 'tip',
        priority: 'low',
        title: 'Conseil EBIOS RM',
        message: hint,
        helpLink: 'https://www.ssi.gouv.fr/guide/ebios-risk-manager-the-method/',
        dismissible: true
      });
    }

    // 🎯 ACTIONS SUIVANTES
    if (state.nextActions.length > 0) {
      messages.push({
        id: 'next-actions',
        type: 'action',
        priority: 'medium',
        title: 'Prochaines actions recommandées',
        message: `${state.nextActions.length} action(s) recommandée(s) : ${state.nextActions[0]}`,
        actionLabel: 'Voir toutes',
        dismissible: true
      });
    }

    return messages.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
}

// 🎯 COMPOSANT PRINCIPAL
const ContextualGuidance: React.FC<ContextualGuidanceProps> = ({
  missionId: _missionId,
  currentWorkshop,
  workshopData,
  userProgress,
  className = '',
  onActionClick
}) => {
  const [contextualState, setContextualState] = useState<ContextualState | null>(null);
  const [guidanceMessages, setGuidanceMessages] = useState<GuidanceMessage[]>([]);
  const [dismissedMessages, setDismissedMessages] = useState<Set<string>>(new Set());
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(true);

  // 🎯 ANALYSE DU CONTEXTE
  useEffect(() => {
    const analyzeCurrentContext = () => {
      // Simulation d'analyse contextuelle basée sur les données réelles
      const state: ContextualState = {
        currentWorkshop,
        completionPercentage: calculateCompletionPercentage(),
        blockers: identifyBlockers(),
        nextActions: generateNextActions(),
        userLevel: determineUserLevel(),
        lastActivity: new Date()
      };

      setContextualState(state);
      
      // Génération des messages de guidage
      const messages = ContextualGuidanceEngine.analyzeContext(state);
      setGuidanceMessages(messages);
      setLoading(false);
    };

    analyzeCurrentContext();
  }, [currentWorkshop, workshopData, userProgress]);

  // 🎯 FONCTIONS D'ANALYSE
  const calculateCompletionPercentage = (): number => {
    if (!workshopData) return 0;
    
    // Logique de calcul basée sur les données de l'atelier
    const elements = Object.values(workshopData).flat();
    const totalExpected = currentWorkshop * 3; // Estimation
    return Math.min(100, Math.round((elements.length / totalExpected) * 100));
  };

  const identifyBlockers = (): string[] => {
    const blockers: string[] = [];
    
    if (!workshopData) {
      blockers.push('Aucune donnée chargée pour cet atelier');
      return blockers;
    }

    // Analyse spécifique par atelier
    switch (currentWorkshop) {
      case 1:
        if (!workshopData.businessValues?.length) {
          blockers.push('Aucune valeur métier définie');
        }
        if (!workshopData.dreadedEvents?.length) {
          blockers.push('Aucun événement redouté identifié');
        }
        break;
      case 2:
        if (!workshopData.riskSources?.length) {
          blockers.push('Aucune source de risque identifiée');
        }
        break;
      // Autres ateliers...
    }

    return blockers;
  };

  const generateNextActions = (): string[] => {
    const actions: string[] = [];
    const workshopContext = WORKSHOP_CONTEXTS[currentWorkshop as keyof typeof WORKSHOP_CONTEXTS];
    
    if (workshopContext) {
      actions.push(`Ajouter ${workshopContext.keyElements[0]}`);
      if (workshopData && Object.keys(workshopData).length > 0) {
        actions.push(`Réviser ${workshopContext.keyElements[1] || 'les éléments existants'}`);
      }
    }

    return actions;
  };

  const determineUserLevel = (): 'beginner' | 'intermediate' | 'expert' => {
    // Logique simple basée sur l'activité
    if (!userProgress) return 'beginner';
    
    const completedWorkshops = userProgress.completedWorkshops || 0;
    if (completedWorkshops === 0) return 'beginner';
    if (completedWorkshops < 3) return 'intermediate';
    return 'expert';
  };

  // 🎯 GESTION DES ACTIONS
  const handleMessageAction = (message: GuidanceMessage) => {
    if (message.actionCallback) {
      message.actionCallback();
    } else if (onActionClick) {
      onActionClick(message.id, { message, workshop: currentWorkshop });
    }
  };

  const handleDismissMessage = (messageId: string) => {
    setDismissedMessages(prev => new Set([...prev, messageId]));
  };

  const getMessageIcon = (type: GuidanceMessage['type']) => {
    switch (type) {
      case 'orientation': return Lightbulb;
      case 'action': return Target;
      case 'warning': return AlertTriangle;
      case 'tip': return Info;
      case 'celebration': return CheckCircle;
      default: return HelpCircle;
    }
  };

  const getMessageColor = (type: GuidanceMessage['type']) => {
    switch (type) {
      case 'orientation': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'action': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-red-50 border-red-200 text-red-800';
      case 'tip': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'celebration': return 'bg-purple-50 border-purple-200 text-purple-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-24 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  const visibleMessages = guidanceMessages.filter(msg => !dismissedMessages.has(msg.id));

  if (visibleMessages.length === 0) {
    return null;
  }

  return (
    <Card className={`${className}`}>
      <div className="p-4">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">
              Guidage contextuel
            </h3>
            {contextualState && (
              <Badge variant="outline" className="text-xs">
                {contextualState.completionPercentage}% complété
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Messages de guidage */}
        {isExpanded && (
          <div className="space-y-3">
            {visibleMessages.map((message) => {
              const Icon = getMessageIcon(message.type);
              const colorClass = getMessageColor(message.type);

              return (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg border ${colorClass}`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium mb-1">
                        {message.title}
                      </h4>
                      <p className="text-sm opacity-90 mb-2">
                        {message.message}
                      </p>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {message.actionLabel && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMessageAction(message)}
                            className="text-xs px-2 py-1"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            {message.actionLabel}
                          </Button>
                        )}
                        
                        {message.helpLink && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(message.helpLink, '_blank')}
                            className="text-xs px-2 py-1"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Aide ANSSI
                          </Button>
                        )}
                        
                        {message.dismissible && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDismissMessage(message.id)}
                            className="text-xs px-1 py-1 ml-auto"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default ContextualGuidance;
