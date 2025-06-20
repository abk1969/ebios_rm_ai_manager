/**
 * 🧠 INTERFACE DE GUIDAGE INTELLIGENT
 * Composant React pour afficher le guidage contextuel IA
 * Remplace la confusion par un accompagnement personnalisé
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bot, 
  X, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Star, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BookOpen,
  Play
} from 'lucide-react';
import { 
  IntelligentGuidanceService, 
  GuidanceMessage, 
  GuidanceType,
  GuidanceContext 
} from '../../domain/services/IntelligentGuidanceService';
import { TrainingStep } from '../../domain/entities/LinearTrainingPath';

// 🎯 PROPS DU COMPOSANT
interface IntelligentGuidanceInterfaceProps {
  guidanceService: IntelligentGuidanceService;
  currentStep: TrainingStep;
  stepProgress: number;
  timeSpent: number;
  lastScore?: number;
  onActionClick?: (actionId: string) => void;
  className?: string;
  position?: 'fixed' | 'relative';
  minimizable?: boolean;
}

// 🎯 COMPOSANT PRINCIPAL
export const IntelligentGuidanceInterface: React.FC<IntelligentGuidanceInterfaceProps> = ({
  guidanceService,
  currentStep,
  stepProgress,
  timeSpent,
  lastScore,
  onActionClick,
  className = '',
  position = 'fixed',
  minimizable = true
}) => {
  const [messages, setMessages] = useState<GuidanceMessage[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // 🔄 CHARGER LES MESSAGES DE GUIDAGE
  const loadGuidanceMessages = useCallback(() => {
    const context: GuidanceContext = {
      currentStep,
      stepProgress,
      timeSpent,
      lastScore,
      strugglingAreas: [],
      userPreferences: {
        verbosity: 'normal',
        encouragementFrequency: 'medium',
        hintTiming: 'delayed',
        language: 'fr',
        learningStyle: 'mixed'
      },
      sessionData: {}
    };

    const newMessages = guidanceService.getContextualGuidance(context);
    setMessages(newMessages);

    // Réinitialiser l'index si nécessaire
    if (newMessages.length > 0 && activeMessageIndex >= newMessages.length) {
      setActiveMessageIndex(0);
    }
  }, [guidanceService, currentStep, stepProgress, timeSpent, lastScore, activeMessageIndex]);

  // 🎧 CHARGER LES MESSAGES AU CHANGEMENT DE CONTEXTE
  useEffect(() => {
    loadGuidanceMessages();
  }, [loadGuidanceMessages]);

  // 🎨 OBTENIR L'ICÔNE SELON LE TYPE
  const getMessageIcon = (type: GuidanceType) => {
    switch (type) {
      case GuidanceType.WELCOME:
        return <Bot className="w-5 h-5 text-blue-600" />;
      case GuidanceType.ENCOURAGEMENT:
        return <Star className="w-5 h-5 text-yellow-500" />;
      case GuidanceType.WARNING:
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case GuidanceType.HELP:
        return <HelpCircle className="w-5 h-5 text-purple-600" />;
      case GuidanceType.INSTRUCTION:
        return <BookOpen className="w-5 h-5 text-green-600" />;
      case GuidanceType.NEXT_STEP:
        return <Play className="w-5 h-5 text-blue-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  // 🎨 OBTENIR LES CLASSES CSS SELON LE TYPE
  const getMessageClasses = (type: GuidanceType, priority: string) => {
    let baseClasses = "border-l-4 p-4 rounded-r-lg shadow-sm";
    
    switch (type) {
      case GuidanceType.WELCOME:
        return `${baseClasses} bg-blue-50 border-blue-500`;
      case GuidanceType.ENCOURAGEMENT:
        return `${baseClasses} bg-yellow-50 border-yellow-500`;
      case GuidanceType.WARNING:
        return `${baseClasses} bg-orange-50 border-orange-500`;
      case GuidanceType.HELP:
        return `${baseClasses} bg-purple-50 border-purple-500`;
      case GuidanceType.INSTRUCTION:
        return `${baseClasses} bg-green-50 border-green-500`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-500`;
    }
  };

  // 🎮 GESTIONNAIRES D'ÉVÉNEMENTS
  const handleActionClick = (actionId: string) => {
    onActionClick?.(actionId);
    
    // Marquer le message comme montré
    if (messages[activeMessageIndex]) {
      guidanceService.recordShownMessage(messages[activeMessageIndex]);
    }
  };

  const handleNextMessage = () => {
    if (activeMessageIndex < messages.length - 1) {
      setActiveMessageIndex(activeMessageIndex + 1);
    }
  };

  const handlePreviousMessage = () => {
    if (activeMessageIndex > 0) {
      setActiveMessageIndex(activeMessageIndex - 1);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // 🚫 NE PAS AFFICHER SI PAS DE MESSAGES OU MASQUÉ
  if (!isVisible || messages.length === 0) {
    return null;
  }

  const currentMessage = messages[activeMessageIndex];
  if (!currentMessage) return null;

  // 📱 VERSION MINIMISÉE
  if (isMinimized) {
    return (
      <div className={`
        ${position === 'fixed' ? 'fixed bottom-4 right-4 z-50' : 'relative'} 
        ${className}
      `}>
        <button
          onClick={handleMinimize}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center space-x-2"
          title="Afficher le guidage"
        >
          <Bot className="w-5 h-5" />
          {messages.length > 1 && (
            <span className="bg-blue-800 text-xs px-2 py-1 rounded-full">
              {messages.length}
            </span>
          )}
        </button>
      </div>
    );
  }

  // 📱 VERSION COMPLÈTE
  return (
    <div className={`
      ${position === 'fixed' ? 'fixed bottom-4 right-4 z-50 max-w-md' : 'relative w-full'} 
      ${className}
    `}>
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span className="font-medium">Assistant IA</span>
            {messages.length > 1 && (
              <span className="bg-white bg-opacity-20 text-xs px-2 py-1 rounded-full">
                {activeMessageIndex + 1}/{messages.length}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            {minimizable && (
              <button
                onClick={handleMinimize}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-all"
                title="Réduire"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-all"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contenu du message */}
        <div className={getMessageClasses(currentMessage.type, currentMessage.priority)}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getMessageIcon(currentMessage.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-2">
                {currentMessage.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                {currentMessage.content}
              </p>

              {/* Ressources */}
              {currentMessage.resources && currentMessage.resources.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-xs font-medium text-gray-600 mb-2">Ressources utiles :</h4>
                  <div className="space-y-1">
                    {currentMessage.resources.map((resource) => (
                      <div key={resource.id} className="flex items-center space-x-2 text-xs text-gray-600">
                        <BookOpen className="w-3 h-3" />
                        <span>{resource.title}</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {resource.estimatedTime} min
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {currentMessage.actions && currentMessage.actions.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {currentMessage.actions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action.id)}
                      disabled={!action.enabled}
                      className={`
                        px-3 py-1.5 text-xs font-medium rounded transition-all
                        ${action.primary
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                        ${!action.enabled ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      title={action.description}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation entre messages */}
        {messages.length > 1 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
            <button
              onClick={handlePreviousMessage}
              disabled={activeMessageIndex === 0}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronUp className="w-4 h-4" />
              <span>Précédent</span>
            </button>

            <div className="flex space-x-1">
              {messages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveMessageIndex(index)}
                  className={`
                    w-2 h-2 rounded-full transition-all
                    ${index === activeMessageIndex ? 'bg-blue-600' : 'bg-gray-300'}
                  `}
                />
              ))}
            </div>

            <button
              onClick={handleNextMessage}
              disabled={activeMessageIndex === messages.length - 1}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Suivant</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntelligentGuidanceInterface;
