/**
 * 🎯 SÉLECTEUR DE MODE UNIFIÉ
 * Composant pour changer entre les différents modes de formation
 */

import React, { useState } from 'react';
import {
  MessageCircle,
  BookOpen,
  Target,
  ChevronDown,
  Check,
  Info,
  Clock,
  Users,
  Brain
} from 'lucide-react';

// 🎯 TYPES
export interface UnifiedModeSelectorProps {
  currentMode: 'chat-expert' | 'workshops' | 'mixed';
  onModeChange: (mode: 'chat-expert' | 'workshops' | 'mixed') => void;
  disabled?: boolean;
  compact?: boolean;
  className?: string;
}

// 🎯 CONFIGURATION DES MODES
const TRAINING_MODES = {
  'chat-expert': {
    label: 'Chat Expert',
    icon: MessageCircle,
    description: 'Formation interactive avec IA expert EBIOS RM',
    features: [
      'Réponses expertes instantanées',
      'Adaptation au niveau utilisateur',
      'Exemples sectoriels personnalisés',
      'Guidance méthodologique'
    ],
    duration: '30-60 min',
    difficulty: 'Adaptable',
    audience: 'Tous niveaux',
    color: 'blue'
  },
  'workshops': {
    label: 'Ateliers EBIOS RM',
    icon: BookOpen,
    description: 'Formation structurée par les 5 ateliers officiels',
    features: [
      'Progression méthodologique',
      'Exercices pratiques',
      'Validation par étapes',
      'Conformité ANSSI'
    ],
    duration: '2-4 heures',
    difficulty: 'Structuré',
    audience: 'Débutants à experts',
    color: 'green'
  },
  'mixed': {
    label: 'Formation Complète',
    icon: Target,
    description: 'Combinaison optimale chat expert + ateliers',
    features: [
      'Flexibilité maximale',
      'Chat expert + ateliers',
      'Progression personnalisée',
      'Expérience complète'
    ],
    duration: '1-5 heures',
    difficulty: 'Flexible',
    audience: 'Recommandé',
    color: 'purple'
  }
} as const;

/**
 * 🎯 COMPOSANT PRINCIPAL
 */
export const UnifiedModeSelector: React.FC<UnifiedModeSelectorProps> = ({
  currentMode,
  onModeChange,
  disabled = false,
  compact = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredMode, setHoveredMode] = useState<string | null>(null);

  const currentModeConfig = TRAINING_MODES[currentMode];

  const handleModeSelect = (mode: 'chat-expert' | 'workshops' | 'mixed') => {
    onModeChange(mode);
    setIsOpen(false);
  };

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border' = 'bg') => {
    const colors = {
      blue: {
        bg: 'bg-blue-50 hover:bg-blue-100',
        text: 'text-blue-600',
        border: 'border-blue-200'
      },
      green: {
        bg: 'bg-green-50 hover:bg-green-100',
        text: 'text-green-600',
        border: 'border-green-200'
      },
      purple: {
        bg: 'bg-purple-50 hover:bg-purple-100',
        text: 'text-purple-600',
        border: 'border-purple-200'
      }
    };
    return colors[color as keyof typeof colors]?.[variant] || colors.blue[variant];
  };

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all
            ${disabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : `${getColorClasses(currentModeConfig.color, 'bg')} ${getColorClasses(currentModeConfig.color, 'text')} ${getColorClasses(currentModeConfig.color, 'border')} hover:shadow-sm`
            }
          `}
        >
          <currentModeConfig.icon className="w-4 h-4" />
          <span className="text-sm font-medium">{currentModeConfig.label}</span>
          {!disabled && <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
        </button>

        {isOpen && !disabled && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {Object.entries(TRAINING_MODES).map(([mode, config]) => (
              <button
                key={mode}
                onClick={() => handleModeSelect(mode as any)}
                className={`
                  w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors
                  ${mode === currentMode ? 'bg-blue-50' : ''}
                  ${mode === Object.keys(TRAINING_MODES)[0] ? 'rounded-t-lg' : ''}
                  ${mode === Object.keys(TRAINING_MODES)[Object.keys(TRAINING_MODES).length - 1] ? 'rounded-b-lg' : ''}
                `}
              >
                <div className="flex items-center space-x-3">
                  <config.icon className={`w-5 h-5 ${getColorClasses(config.color, 'text')}`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{config.label}</span>
                      {mode === currentMode && <Check className="w-4 h-4 text-blue-600" />}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{config.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choisissez votre mode de formation</h3>
        <p className="text-sm text-gray-600">Sélectionnez l'approche qui correspond le mieux à vos besoins</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(TRAINING_MODES).map(([mode, config]) => (
          <div
            key={mode}
            className={`
              relative border-2 rounded-lg p-6 cursor-pointer transition-all
              ${mode === currentMode 
                ? `${getColorClasses(config.color, 'border')} ${getColorClasses(config.color, 'bg')}` 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            onClick={() => !disabled && handleModeSelect(mode as any)}
            onMouseEnter={() => setHoveredMode(mode)}
            onMouseLeave={() => setHoveredMode(null)}
          >
            {/* Badge de sélection */}
            {mode === currentMode && (
              <div className={`absolute -top-2 -right-2 w-6 h-6 ${getColorClasses(config.color, 'bg')} rounded-full flex items-center justify-center`}>
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            {/* Icône et titre */}
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-2 rounded-lg ${getColorClasses(config.color, 'bg')}`}>
                <config.icon className={`w-6 h-6 ${getColorClasses(config.color, 'text')}`} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{config.label}</h4>
                <p className="text-sm text-gray-600">{config.description}</p>
              </div>
            </div>

            {/* Métadonnées */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Durée : {config.duration}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Brain className="w-4 h-4" />
                <span>Niveau : {config.difficulty}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>Public : {config.audience}</span>
              </div>
            </div>

            {/* Fonctionnalités */}
            <div className="space-y-1">
              {config.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                  <div className={`w-1.5 h-1.5 rounded-full ${getColorClasses(config.color, 'bg')}`} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Indicateur de recommandation */}
            {mode === 'mixed' && (
              <div className="mt-4 flex items-center space-x-2 text-sm text-purple-600 bg-purple-50 px-3 py-2 rounded-lg">
                <Info className="w-4 h-4" />
                <span className="font-medium">Recommandé pour une formation complète</span>
              </div>
            )}

            {/* Animation de survol */}
            {hoveredMode === mode && mode !== currentMode && (
              <div className="absolute inset-0 bg-blue-50 bg-opacity-50 rounded-lg pointer-events-none transition-opacity" />
            )}
          </div>
        ))}
      </div>

      {/* Aide contextuelle */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h5 className="font-medium text-gray-900 mb-1">Besoin d'aide pour choisir ?</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Débutant :</strong> Commencez par les Ateliers EBIOS RM pour une approche structurée</li>
              <li>• <strong>Expérimenté :</strong> Utilisez le Chat Expert pour des réponses ciblées</li>
              <li>• <strong>Formation complète :</strong> Choisissez le mode Mixte pour une expérience optimale</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedModeSelector;
