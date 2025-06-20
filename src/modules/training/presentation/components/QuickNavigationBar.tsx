import React, { useState } from 'react';
import { 
  MessageCircle, 
  Users, 
  BookOpen, 
  Eye, 
  Navigation,
  ChevronDown,
  ArrowRight,
  Clock,
  CheckCircle
} from 'lucide-react';
import Button from '../../../../components/ui/button';

/**
 * 🚀 BARRE DE NAVIGATION RAPIDE INTER-MODES
 * Navigation compacte et intelligente entre tous les modes de formation
 */

interface QuickNavigationBarProps {
  currentMode: string;
  sessionId: string;
  onModeChange?: (mode: string) => void;
  showFullNavigator?: () => void;
  className?: string;
}

interface QuickMode {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  estimatedTime: number;
  status: 'completed' | 'current' | 'available' | 'locked';
}

export const QuickNavigationBar: React.FC<QuickNavigationBarProps> = ({
  currentMode,
  sessionId,
  onModeChange,
  showFullNavigator,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // 📊 MODES RAPIDES
  const quickModes: QuickMode[] = [
    {
      id: 'discovery',
      title: 'Découverte',
      icon: Eye,
      color: 'text-purple-600',
      estimatedTime: 45,
      status: 'completed'
    },
    {
      id: 'case-study',
      title: 'Cas d\'étude',
      icon: BookOpen,
      color: 'text-green-600',
      estimatedTime: 90,
      status: 'available'
    },
    {
      id: 'expert-chat',
      title: 'Chat Expert',
      icon: MessageCircle,
      color: 'text-blue-600',
      estimatedTime: 60,
      status: currentMode === 'expert-chat' ? 'current' : 'available'
    },
    {
      id: 'workshops',
      title: 'Ateliers',
      icon: Users,
      color: 'text-indigo-600',
      estimatedTime: 425,
      status: currentMode === 'workshops' ? 'current' : 'available'
    }
  ];

  // 🎯 GESTION NAVIGATION
  const handleQuickNavigation = (modeId: string) => {
    if (onModeChange) {
      onModeChange(modeId);
    } else {
      window.location.href = `/training/session/${sessionId}?mode=${modeId}`;
    }
  };

  // 🎯 COULEURS SELON STATUT
  const getStatusStyle = (status: QuickMode['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'current':
        return 'bg-blue-100 text-blue-800 border-blue-300 ring-2 ring-blue-500 ring-offset-1';
      case 'available':
        return 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50';
      case 'locked':
        return 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed';
      default:
        return 'bg-white text-gray-700 border-gray-200';
    }
  };

  // 🎯 MODE ACTUEL
  const currentModeData = quickModes.find(mode => mode.id === currentMode);

  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Mode actuel */}
          <div className="flex items-center space-x-3">
            {currentModeData && (
              <>
                <div className="flex items-center space-x-2">
                  <currentModeData.icon className={`w-5 h-5 ${currentModeData.color}`} />
                  <span className="font-medium text-gray-900">{currentModeData.title}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Session: {sessionId.slice(-8)}
                </div>
              </>
            )}
          </div>

          {/* Navigation rapide */}
          <div className="flex items-center space-x-2">
            {/* Modes compacts */}
            <div className="hidden md:flex items-center space-x-1">
              {quickModes.map((mode) => {
                const Icon = mode.icon;
                const isCurrent = mode.id === currentMode;
                
                if (isCurrent) return null; // Ne pas afficher le mode actuel
                
                return (
                  <button
                    key={mode.id}
                    onClick={() => handleQuickNavigation(mode.id)}
                    disabled={mode.status === 'locked'}
                    className={`flex items-center space-x-1 px-2 py-1 rounded border text-sm transition-all ${getStatusStyle(mode.status)}`}
                    title={`${mode.title} (${mode.estimatedTime}min)`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden lg:inline">{mode.title}</span>
                    {mode.status === 'completed' && (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bouton navigation complète */}
            {showFullNavigator && (
              <Button
                onClick={showFullNavigator}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
              >
                <Navigation className="w-4 h-4" />
                <span className="hidden sm:inline">Navigation</span>
              </Button>
            )}

            {/* Menu mobile */}
            <div className="md:hidden relative">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center space-x-1 px-3 py-1 border rounded text-sm hover:bg-gray-50"
              >
                <Navigation className="w-4 h-4" />
                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {/* Menu déroulant mobile */}
              {isExpanded && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white border rounded-lg shadow-lg z-50">
                  <div className="p-3">
                    <h3 className="font-medium text-gray-900 mb-2">Changer de mode :</h3>
                    <div className="space-y-2">
                      {quickModes.map((mode) => {
                        const Icon = mode.icon;
                        const isCurrent = mode.id === currentMode;
                        
                        return (
                          <button
                            key={mode.id}
                            onClick={() => {
                              if (!isCurrent) handleQuickNavigation(mode.id);
                              setIsExpanded(false);
                            }}
                            disabled={mode.status === 'locked'}
                            className={`w-full flex items-center justify-between p-2 rounded border text-sm transition-all ${getStatusStyle(mode.status)}`}
                          >
                            <div className="flex items-center space-x-2">
                              <Icon className="w-4 h-4" />
                              <span>{mode.title}</span>
                              {mode.status === 'completed' && (
                                <CheckCircle className="w-3 h-3 text-green-600" />
                              )}
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{mode.estimatedTime}min</span>
                              {!isCurrent && <ArrowRight className="w-3 h-3" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    
                    {showFullNavigator && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <Button
                          onClick={() => {
                            showFullNavigator();
                            setIsExpanded(false);
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Navigation complète
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Barre de progression globale */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progression formation</span>
            <span>1/4 terminé</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: '25%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 🎯 HOOK POUR GESTION NAVIGATION CONTEXTE
 */
export const useTrainingNavigation = (sessionId: string, currentMode: string) => {
  const [navigationHistory, setNavigationHistory] = useState<string[]>([currentMode]);
  
  const navigateToMode = (mode: string) => {
    setNavigationHistory(prev => [...prev, mode]);
    window.location.href = `/training/session/${sessionId}?mode=${mode}`;
  };
  
  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = navigationHistory.slice(0, -1);
      const previousMode = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      window.location.href = `/training/session/${sessionId}?mode=${previousMode}`;
    }
  };
  
  const canGoBack = navigationHistory.length > 1;
  
  return {
    navigateToMode,
    goBack,
    canGoBack,
    navigationHistory
  };
};
