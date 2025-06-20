/**
 * 🛠️ BARRE D'OUTILS ACTIONS EXPERTES
 * Interface d'actions avancées pour experts EBIOS RM
 * POINT 3 - Interface Utilisateur React Intelligente
 */

import React, { useState } from 'react';
import { ExpertAction, InterfaceTheme } from '../hooks/useWorkshop1Intelligence';

// 🎯 TYPES POUR LA TOOLBAR

interface ExpertActionToolbarProps {
  actions: ExpertAction[];
  theme: InterfaceTheme;
  onToggleExpertMode: () => void;
  onExportSession: () => Promise<any>;
  className?: string;
}

interface ActionGroup {
  id: string;
  name: string;
  icon: string;
  actions: ExpertAction[];
  color: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  shortcut?: string;
  onClick: () => void;
  color: string;
}

// 🛠️ COMPOSANT PRINCIPAL

export const ExpertActionToolbar: React.FC<ExpertActionToolbarProps> = ({
  actions,
  theme,
  onToggleExpertMode,
  onExportSession,
  className = ''
}) => {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // 🎯 GROUPEMENT DES ACTIONS

  const groupActions = (): ActionGroup[] => {
    const groups: ActionGroup[] = [
      {
        id: 'navigation',
        name: 'Navigation',
        icon: '🧭',
        actions: actions.filter(a => a.type === 'navigation'),
        color: 'blue'
      },
      {
        id: 'validation',
        name: 'Validation',
        icon: '✅',
        actions: actions.filter(a => a.type === 'validation'),
        color: 'green'
      },
      {
        id: 'collaboration',
        name: 'Collaboration',
        icon: '🤝',
        actions: actions.filter(a => a.type === 'collaboration'),
        color: 'purple'
      },
      {
        id: 'insight',
        name: 'Insights',
        icon: '💡',
        actions: actions.filter(a => a.type === 'insight'),
        color: 'yellow'
      },
      {
        id: 'export',
        name: 'Export',
        icon: '📤',
        actions: actions.filter(a => a.type === 'export'),
        color: 'gray'
      }
    ];

    return groups.filter(g => g.actions.length > 0);
  };

  // ⚡ ACTIONS RAPIDES

  const getQuickActions = (): QuickAction[] => {
    return [
      {
        id: 'expert_mode',
        label: 'Mode Expert',
        icon: '🎓',
        shortcut: 'Ctrl+E',
        onClick: onToggleExpertMode,
        color: 'indigo'
      },
      {
        id: 'export_session',
        label: 'Export Session',
        icon: '📊',
        shortcut: 'Ctrl+S',
        onClick: handleExportSession,
        color: 'blue'
      },
      {
        id: 'shortcuts',
        label: 'Raccourcis',
        icon: '⌨️',
        shortcut: 'Ctrl+?',
        onClick: () => setShowShortcuts(!showShortcuts),
        color: 'gray'
      }
    ];
  };

  // 📤 GESTION DE L'EXPORT

  const handleExportSession = async () => {
    setIsExporting(true);
    try {
      const data = await onExportSession();
      
      // Création et téléchargement du fichier
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workshop1-session-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('❌ Erreur export session:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // 🎨 COULEURS SELON LE THÈME

  const getColorClasses = (color: string, variant: 'bg' | 'text' | 'border' = 'bg') => {
    const colors = {
      blue: { bg: 'bg-blue-500', text: 'text-blue-600', border: 'border-blue-500' },
      green: { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-500' },
      purple: { bg: 'bg-purple-500', text: 'text-purple-600', border: 'border-purple-500' },
      yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-500' },
      gray: { bg: 'bg-gray-500', text: 'text-gray-600', border: 'border-gray-500' },
      indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', border: 'border-indigo-500' }
    };
    return colors[color as keyof typeof colors]?.[variant] || colors.gray[variant];
  };

  // ⌨️ GESTION DES RACCOURCIS CLAVIER

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'e':
            e.preventDefault();
            onToggleExpertMode();
            break;
          case 's':
            e.preventDefault();
            handleExportSession();
            break;
          case '?':
            e.preventDefault();
            setShowShortcuts(!showShortcuts);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showShortcuts, onToggleExpertMode]);

  // 🎯 RENDU PRINCIPAL

  return (
    <>
      <div 
        className={`bg-white border-b border-gray-200 px-6 py-3 ${className}`}
        style={{ borderBottomColor: theme.accentColor + '20' }}
      >
        <div className="flex items-center justify-between animate-fade-in">
          {/* Actions rapides à gauche */}
          <div className="flex items-center space-x-2 animate-fade-in">
            {getQuickActions().map(action => (
              <button
                key={action.id}
                onClick={action.onClick}
                disabled={action.id === 'export_session' && isExporting}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                  getColorClasses(action.color, 'bg')
                } text-white hover:opacity-90 disabled:opacity-50`}
                title={action.shortcut ? `${action.label} (${action.shortcut})` : action.label}
              >
                <span className="text-sm animate-fade-in">{action.icon}</span>
                <span className="text-sm font-medium animate-fade-in">{action.label}</span>
                {action.id === 'export_session' && isExporting && (
                  <div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-fade-in"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Groupes d'actions au centre */}
          <div className="flex items-center space-x-1 animate-fade-in">
            {groupActions().map(group => (
              <div key={group.id} className="relative animate-fade-in">
                <button
                  onClick={() => setActiveGroup(activeGroup === group.id ? null : group.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                    activeGroup === group.id 
                      ? `${getColorClasses(group.color, 'bg')} text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-sm animate-fade-in">{group.icon}</span>
                  <span className="text-sm font-medium animate-fade-in">{group.name}</span>
                  {group.actions.some(a => a.badge) && (
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-fade-in"></span>
                  )}
                </button>

                {/* Menu déroulant des actions */}
                <div>
                  {activeGroup === group.id && (
                    <div
                      className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-fade-in"
                    >
                      <div className="p-2 animate-fade-in">
                        {group.actions.map(action => (
                          <button
                            key={action.id}
                            onClick={() => {
                              action.onClick();
                              setActiveGroup(null);
                            }}
                            disabled={!action.enabled}
                            className="w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors disabled:opacity-50 animate-fade-in"
                          >
                            <div className="flex items-center space-x-3 animate-fade-in">
                              <span className="text-lg animate-fade-in">{action.icon}</span>
                              <div>
                                <div className="font-medium text-gray-900 animate-fade-in">{action.label}</div>
                                <div className="text-sm text-gray-500 animate-fade-in">{action.tooltip}</div>
                              </div>
                            </div>
                            {action.badge && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full animate-fade-in">
                                {action.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Indicateurs à droite */}
          <div className="flex items-center space-x-4 animate-fade-in">
            {/* Indicateur de thème */}
            <div className="flex items-center space-x-2 animate-fade-in">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm animate-fade-in"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <span className="text-sm text-gray-600 capitalize animate-fade-in">{theme.name}</span>
            </div>

            {/* Indicateur de complexité */}
            <div className="flex items-center space-x-2 animate-fade-in">
              <span className="text-sm text-gray-500 animate-fade-in">Complexité:</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                theme.complexity === 'expert' ? 'bg-red-100 text-red-800' :
                theme.complexity === 'advanced' ? 'bg-orange-100 text-orange-800' :
                theme.complexity === 'standard' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {theme.complexity}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal des raccourcis */}
      <div>
        {showShortcuts && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
            onClick={() => setShowShortcuts(false)}
          >
            <div
              className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4 animate-fade-in">
                <h3 className="text-lg font-semibold text-gray-900 animate-fade-in">⌨️ Raccourcis Clavier</h3>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="text-gray-400 hover:text-gray-600 animate-fade-in"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 animate-fade-in">
                {getQuickActions().filter(a => a.shortcut).map(action => (
                  <div key={action.id} className="flex items-center justify-between animate-fade-in">
                    <div className="flex items-center space-x-2 animate-fade-in">
                      <span className="text-lg animate-fade-in">{action.icon}</span>
                      <span className="text-sm text-gray-700 animate-fade-in">{action.label}</span>
                    </div>
                    <kbd className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border animate-fade-in">
                      {action.shortcut}
                    </kbd>
                  </div>
                ))}

                <div className="pt-3 border-t border-gray-200 animate-fade-in">
                  <h4 className="font-medium text-gray-900 mb-2 animate-fade-in">Actions Générales</h4>
                  <div className="space-y-2 text-sm animate-fade-in">
                    <div className="flex justify-between animate-fade-in">
                      <span>Fermer les modals</span>
                      <kbd className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border animate-fade-in">Esc</kbd>
                    </div>
                    <div className="flex justify-between animate-fade-in">
                      <span>Navigation rapide</span>
                      <kbd className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border animate-fade-in">Tab</kbd>
                    </div>
                    <div className="flex justify-between animate-fade-in">
                      <span>Actualiser métriques</span>
                      <kbd className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border animate-fade-in">F5</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay pour fermer les menus */}
      {activeGroup && (
        <div
          className="fixed inset-0 z-40 animate-fade-in"
          onClick={() => setActiveGroup(null)}
        />
      )}
    </>
  );
};

export default ExpertActionToolbar;
