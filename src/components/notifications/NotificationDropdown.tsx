/**
 * 🔔 DROPDOWN DES NOTIFICATIONS
 * Menu déroulant avec liste des notifications récentes
 */

import React from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  X,
  ExternalLink,
  Clock,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  Zap,
  Award,
  RefreshCw
} from 'lucide-react';
import type { EbiosNotification, NotificationType } from '../../types/notifications';
import { CompactQuickActions } from './NotificationQuickActions';
import { CompactBreadcrumbs } from './NotificationBreadcrumbs';

// 🎯 PROPS DU COMPOSANT
interface NotificationDropdownProps {
  notifications: EbiosNotification[];
  unreadCount: number;
  onNotificationClick: (notification: EbiosNotification) => void;
  onMarkAllAsRead: () => void;
  onViewAll: () => void;
  onDeleteNotification: (notificationId: string, event: React.MouseEvent) => void;
  onClose: () => void;
}

/**
 * 🔔 COMPOSANT PRINCIPAL
 */
export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
  onNotificationClick,
  onMarkAllAsRead,
  onViewAll,
  onDeleteNotification,
  onClose
}) => {

  // 🎨 ICÔNES PAR TYPE DE NOTIFICATION
  const getNotificationIcon = (type: NotificationType) => {
    const iconClasses = "w-5 h-5 flex-shrink-0";
    
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClasses} text-green-500`} />;
      case 'error':
        return <AlertCircle className={`${iconClasses} text-red-500`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClasses} text-yellow-500`} />;
      case 'info':
        return <Info className={`${iconClasses} text-blue-500`} />;
      case 'action':
        return <Zap className={`${iconClasses} text-purple-500`} />;
      case 'achievement':
        return <Award className={`${iconClasses} text-gold-500`} />;
      case 'reminder':
        return <Clock className={`${iconClasses} text-orange-500`} />;
      case 'update':
        return <RefreshCw className={`${iconClasses} text-indigo-500`} />;
      default:
        return <Bell className={`${iconClasses} text-gray-500`} />;
    }
  };

  // 🎨 COULEURS PAR TYPE
  const getNotificationColors = (notification: Notification) => {
    const isUnread = notification.status === 'unread';
    
    const baseClasses = isUnread 
      ? 'bg-blue-50 border-l-4 border-l-blue-500' 
      : 'bg-white border-l-4 border-l-transparent';

    return `${baseClasses} hover:bg-gray-50 transition-colors duration-150`;
  };

  // ⏰ FORMATAGE DU TEMPS
  const formatTime = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now.getTime() - notifTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return notifTime.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short'
    });
  };

  // 📝 TRUNCATE TEXT
  const truncateText = (text: string, maxLength: number = 80) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
      {/* 📋 HEADER */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                title="Marquer tout comme lu"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Tout lire</span>
              </button>
            )}
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 📋 LISTE DES NOTIFICATIONS */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          // État vide
          <div className="px-4 py-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Aucune notification</p>
            <p className="text-gray-400 text-xs mt-1">
              Vous êtes à jour ! 🎉
            </p>
          </div>
        ) : (
          // Liste des notifications
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0
                ${getNotificationColors(notification)}
              `}
              onClick={() => onNotificationClick(notification)}
            >
              <div className="flex items-start space-x-3">
                {/* Icône */}
                <div className="flex-shrink-0 mt-0.5">
                  {notification.icon ? (
                    <span className="text-lg">{notification.icon}</span>
                  ) : (
                    getNotificationIcon(notification.type)
                  )}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Titre */}
                      <p className={`
                        text-sm font-medium leading-5
                        ${notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'}
                      `}>
                        {truncateText(notification.title, 50)}
                      </p>
                      
                      {/* Message */}
                      <p className="text-sm text-gray-600 mt-1 leading-5">
                        {truncateText(notification.message, 70)}
                      </p>

                      {/* Actions rapides contextuelles */}
                      {notification.actions.length > 0 && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <CompactQuickActions
                            notificationId={notification.id}
                            actions={notification.actions}
                            context={notification.context}
                            userId="current-user" // TODO: Récupérer l'ID utilisateur réel
                            onActionExecuted={(actionId, result) => {
                              console.log(`Action ${actionId} exécutée:`, result);
                            }}
                          />
                        </div>
                      )}

                      {/* Breadcrumbs pour navigation contextuelle */}
                      {(notification.context.missionId || notification.context.reportId) && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <CompactBreadcrumbs
                            context={notification.context}
                            className="text-xs"
                          />
                        </div>
                      )}

                      {/* Temps et catégorie */}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(notification.createdAt)}</span>
                        </span>
                        
                        <span className="text-xs text-gray-400 capitalize">
                          {notification.category}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1 ml-2">
                      {/* Lien externe si deepLink */}
                      {notification.deepLink && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = notification.deepLink!;
                          }}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Ouvrir"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      )}

                      {/* Supprimer */}
                      <button
                        onClick={(e) => onDeleteNotification(notification.id, e)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 📋 FOOTER */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onViewAll}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-1 transition-colors"
          >
            Voir toutes les notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
