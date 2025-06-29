/**
 * 🔔 PANNEAU DE NOTIFICATIONS EXPERTES
 * Interface de notifications adaptées au niveau EBIOS RM
 * POINT 3 - Interface Utilisateur React Intelligente
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNotifications } from '../../../../contexts/NotificationContext';
import { EbiosNotification } from '../../../../types/notifications';
import { ExpertiseLevel } from '../../domain/services/AdaptiveContentService';

// 🎯 TYPES POUR LE PANNEAU

interface ExpertNotificationPanelProps {
  expertiseLevel: ExpertiseLevel | null;
  position: 'top' | 'bottom' | 'sidebar';
  onActionTrigger: (type: string, data: any) => Promise<void>;
  className?: string;
}

interface NotificationAction {
  id: string;
  label: string;
  icon: string;
  type: 'primary' | 'secondary' | 'danger';
  onClick: () => void;
}

interface ExpertNotificationItem extends EbiosNotification {
  expertActions?: NotificationAction[];
  expertInsight?: string;
  methodologicalGuidance?: string;
}

// 🔔 COMPOSANT PRINCIPAL

export const ExpertNotificationPanel: React.FC<ExpertNotificationPanelProps> = ({
  expertiseLevel,
  position,
  onActionTrigger,
  className = ''
}) => {
  const { notifications, markAsRead, deleteNotification, getUnreadCount } = useNotifications();
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'expert' | 'methodology'>('all');
  const [expertNotifications, setExpertNotifications] = useState<ExpertNotificationItem[]>([]);

  // 🔄 ENRICHISSEMENT DES NOTIFICATIONS

  const enrichNotifications = useCallback((baseNotifications: EbiosNotification[]): ExpertNotificationItem[] => {
    return baseNotifications.map(notification => {
      const enriched: ExpertNotificationItem = { ...notification };

      // Ajout d'actions expertes selon le type et le niveau
      enriched.expertActions = generateExpertActions(notification, expertiseLevel);

      // Ajout d'insights contextuels
      if (expertiseLevel?.level === 'expert' || expertiseLevel?.level === 'master') {
        enriched.expertInsight = generateExpertInsight(notification, expertiseLevel);
      }

      // Ajout de guidance méthodologique
      if (notification.category === 'workshop' || notification.type === 'warning') {
        enriched.methodologicalGuidance = generateMethodologicalGuidance(notification, expertiseLevel);
      }

      return enriched;
    });
  }, [expertiseLevel]);

  // 📊 MISE À JOUR DES NOTIFICATIONS ENRICHIES

  useEffect(() => {
    const filteredNotifications = getFilteredNotifications();
    const enrichedNotifications = enrichNotifications(filteredNotifications);
    setExpertNotifications(enrichedNotifications);
  }, [notifications, filterType, enrichNotifications]);

  // 🔍 FILTRAGE DES NOTIFICATIONS

  const getFilteredNotifications = (): EbiosNotification[] => {
    switch (filterType) {
      case 'unread':
        return notifications.filter(n => n.status === 'unread');
      case 'expert':
        return notifications.filter(n => 
          n.tags?.includes('expert') || 
          n.tags?.includes('collaboration') ||
          n.category === 'workshop'
        );
      case 'methodology':
        return notifications.filter(n => 
          n.type === 'warning' || 
          n.tags?.includes('methodology') ||
          n.title.toLowerCase().includes('méthodolog')
        );
      default:
        return notifications;
    }
  };

  // 🎯 GESTION DES ACTIONS

  const handleNotificationAction = async (action: NotificationAction, notification: ExpertNotificationItem) => {
    try {
      await action.onClick();
      
      // Marquer comme lu si action principale
      if (action.type === 'primary') {
        await markAsRead(notification.id);
      }

      // Déclencher adaptation si nécessaire
      if (action.id.includes('adapt') || action.id.includes('trigger')) {
        await onActionTrigger(action.id, {
          notificationId: notification.id,
          notificationType: notification.type,
          expertiseLevel: expertiseLevel?.level
        });
      }

    } catch (error) {
      console.error('❌ Erreur action notification:', error);
    }
  };

  // 📱 EXPANSION/RÉDUCTION DES NOTIFICATIONS

  const toggleNotificationExpansion = (notificationId: string) => {
    setExpandedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  // 🎨 STYLE ADAPTATIF SELON LA POSITION

  const getPanelStyles = () => {
    const baseStyles = "bg-white border border-gray-200 rounded-lg shadow-sm";
    
    switch (position) {
      case 'sidebar':
        return `${baseStyles} h-full overflow-hidden flex flex-col`;
      case 'top':
        return `${baseStyles} max-h-96 overflow-hidden`;
      case 'bottom':
        return `${baseStyles} max-h-80 overflow-hidden`;
      default:
        return baseStyles;
    }
  };

  // 🎯 RENDU PRINCIPAL

  return (
    <div className={`${getPanelStyles()} ${className}`}>
      {/* En-tête du panneau */}
      <div className="p-4 border-b border-gray-200 animate-fade-in">
        <div className="flex items-center justify-between mb-3 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-900 animate-fade-in">
            🔔 Notifications Expertes
          </h3>
          <div className="flex items-center space-x-2 animate-fade-in">
            {getUnreadCount() > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-fade-in">
                {getUnreadCount()}
              </span>
            )}
            <button
              onClick={() => setFilterType(filterType === 'all' ? 'expert' : 'all')}
              className="text-sm text-blue-600 hover:text-blue-800 animate-fade-in"
            >
              {filterType === 'all' ? 'Mode Expert' : 'Toutes'}
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex space-x-2 animate-fade-in">
          {(['all', 'unread', 'expert', 'methodology'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setFilterType(filter)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filterType === filter
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {getFilterLabel(filter)}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="flex-1 overflow-y-auto animate-fade-in">
        <div>
          {expertNotifications.length === 0 ? (
            <div
              className="p-8 text-center text-gray-500 animate-fade-in"
            >
              <div className="text-4xl mb-2 animate-fade-in">📭</div>
              <p>Aucune notification {filterType !== 'all' ? getFilterLabel(filterType).toLowerCase() : ''}</p>
            </div>
          ) : (
            expertNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`border-b border-gray-100 ${
                  notification.status === 'unread' ? 'bg-blue-50' : 'bg-white'
                }`}
              >
                <ExpertNotificationItem
                  notification={notification}
                  isExpanded={expandedNotifications.has(notification.id)}
                  onToggleExpansion={() => toggleNotificationExpansion(notification.id)}
                  onAction={(action) => handleNotificationAction(action, notification)}
                  onMarkAsRead={() => markAsRead(notification.id)}
                  onDelete={() => deleteNotification(notification.id)}
                  expertiseLevel={expertiseLevel}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// 📋 COMPOSANT NOTIFICATION INDIVIDUELLE

interface ExpertNotificationItemProps {
  notification: ExpertNotificationItem;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onAction: (action: NotificationAction) => void;
  onMarkAsRead: () => void;
  onDelete: () => void;
  expertiseLevel: ExpertiseLevel | null;
}

const ExpertNotificationItem: React.FC<ExpertNotificationItemProps> = ({
  notification,
  isExpanded,
  onToggleExpansion,
  onAction,
  onMarkAsRead,
  onDelete,
  expertiseLevel
}) => {
  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = () => {
    switch (notification.type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      case 'action': return '🎯';
      default: return '📋';
    }
  };

  return (
    <div className="p-4 animate-fade-in">
      {/* En-tête de la notification */}
      <div className="flex items-start justify-between animate-fade-in">
        <div className="flex-1 animate-fade-in">
          <div className="flex items-center space-x-2 mb-2 animate-fade-in">
            <span className="text-lg animate-fade-in">{notification.icon || getTypeIcon()}</span>
            <h4 className="font-medium text-gray-900 animate-fade-in">{notification.title}</h4>
            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor()}`}>
              {notification.priority}
            </span>
            {notification.status === 'unread' && (
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-fade-in"></span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-2 animate-fade-in">{notification.message}</p>
          
          {/* Métadonnées */}
          <div className="flex items-center space-x-4 text-xs text-gray-500 animate-fade-in">
            <span>{new Date(notification.createdAt).toLocaleString()}</span>
            {notification.tags && (
              <div className="flex space-x-1 animate-fade-in">
                {notification.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="bg-gray-100 px-2 py-1 rounded animate-fade-in">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex items-center space-x-2 ml-4 animate-fade-in">
          <button
            onClick={onToggleExpansion}
            className="text-gray-400 hover:text-gray-600 animate-fade-in"
          >
            {isExpanded ? '🔼' : '🔽'}
          </button>
          {notification.status === 'unread' && (
            <button
              onClick={onMarkAsRead}
              className="text-blue-500 hover:text-blue-700 animate-fade-in"
              title="Marquer comme lu"
            >
              ✓
            </button>
          )}
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 animate-fade-in"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Contenu étendu */}
      <div>
        {isExpanded && (
          <div
            className="mt-4 space-y-4 animate-fade-in"
          >
            {/* Description détaillée */}
            {notification.description && (
              <div className="bg-gray-50 p-3 rounded animate-fade-in">
                <p className="text-sm text-gray-700 animate-fade-in">{notification.description}</p>
              </div>
            )}

            {/* Insight expert */}
            {notification.expertInsight && (
              <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400 animate-fade-in">
                <h5 className="font-medium text-blue-900 mb-1 animate-fade-in">💡 Insight Expert</h5>
                <p className="text-sm text-blue-800 animate-fade-in">{notification.expertInsight}</p>
              </div>
            )}

            {/* Guidance méthodologique */}
            {notification.methodologicalGuidance && (
              <div className="bg-green-50 p-3 rounded border-l-4 border-green-400 animate-fade-in">
                <h5 className="font-medium text-green-900 mb-1 animate-fade-in">📚 Guidance Méthodologique</h5>
                <p className="text-sm text-green-800 animate-fade-in">{notification.methodologicalGuidance}</p>
              </div>
            )}

            {/* Actions expertes */}
            {notification.expertActions && notification.expertActions.length > 0 && (
              <div className="flex flex-wrap gap-2 animate-fade-in">
                {notification.expertActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() => onAction(action)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      action.type === 'primary'
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : action.type === 'danger'
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {action.icon} {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 🔧 FONCTIONS UTILITAIRES

function getFilterLabel(filter: string): string {
  switch (filter) {
    case 'unread': return 'Non lues';
    case 'expert': return 'Expert';
    case 'methodology': return 'Méthodologie';
    default: return 'Toutes';
  }
}

function generateExpertActions(
  notification: EbiosNotification,
  expertiseLevel: ExpertiseLevel | null
): NotificationAction[] {
  const actions: NotificationAction[] = [];

  // Actions de base
  if (notification.type === 'warning' || notification.type === 'error') {
    actions.push({
      id: 'investigate',
      label: 'Analyser',
      icon: '🔍',
      type: 'primary',
      onClick: () => console.log('Analyse de la notification')
    });
  }

  // Actions pour experts avancés
  if (expertiseLevel?.level === 'expert' || expertiseLevel?.level === 'master') {
    if (notification.category === 'workshop') {
      actions.push({
        id: 'expert_review',
        label: 'Révision Experte',
        icon: '👨‍💼',
        type: 'secondary',
        onClick: () => console.log('Révision experte')
      });
    }

    actions.push({
      id: 'share_insight',
      label: 'Partager Insight',
      icon: '💡',
      type: 'secondary',
      onClick: () => console.log('Partage d\'insight')
    });
  }

  return actions;
}

function generateExpertInsight(
  notification: EbiosNotification,
  expertiseLevel: ExpertiseLevel | null
): string {
  const insights = [
    "Cette situation nécessite une approche méthodologique rigoureuse selon EBIOS RM.",
    "Votre expertise permet d'identifier les enjeux stratégiques sous-jacents.",
    "Considérez l'impact sur la gouvernance globale du risque de l'organisation.",
    "Cette alerte peut révéler des vulnérabilités systémiques importantes."
  ];

  return insights[Math.floor(Math.random() * insights.length)];
}

function generateMethodologicalGuidance(
  notification: EbiosNotification,
  expertiseLevel: ExpertiseLevel | null
): string {
  const guidance = [
    "Référez-vous au guide EBIOS RM section 2.3 pour la méthodologie appropriée.",
    "Vérifiez la cohérence avec les livrables des ateliers précédents.",
    "Documentez cette décision dans le registre des risques.",
    "Consultez les bonnes pratiques ANSSI pour ce type de situation."
  ];

  return guidance[Math.floor(Math.random() * guidance.length)];
}

export default ExpertNotificationPanel;
