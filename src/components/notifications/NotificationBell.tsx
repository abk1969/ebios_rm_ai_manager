/**
 * 🔔 COMPOSANT CLOCHE DE NOTIFICATIONS
 * Cloche interactive avec badge, animations et dropdown
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bell, BellRing, X, Check, CheckCheck, Settings, ExternalLink } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationDropdown } from './NotificationDropdown';
import type { EbiosNotification } from '../../types/notifications';

// 🎯 PROPS DU COMPOSANT
interface NotificationBellProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  maxDropdownItems?: number;
  onNotificationClick?: (notification: EbiosNotification) => void;
  onViewAllClick?: () => void;
}

/**
 * 🔔 COMPOSANT PRINCIPAL
 */
export const NotificationBell: React.FC<NotificationBellProps> = ({
  className = '',
  size = 'md',
  showBadge = true,
  maxDropdownItems = 5,
  onNotificationClick,
  onViewAllClick
}) => {
  const {
    notifications,
    getUnreadCount,
    hasUnreadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = getUnreadCount();
  const recentNotifications = notifications.slice(0, maxDropdownItems);

  // 🎨 STYLES SELON LA TAILLE
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7'
  };

  const badgeClasses = {
    sm: 'text-xs min-w-[16px] h-4',
    md: 'text-xs min-w-[18px] h-5',
    lg: 'text-sm min-w-[20px] h-6'
  };

  // 🔔 DÉTECTER NOUVELLES NOTIFICATIONS
  useEffect(() => {
    if (unreadCount > 0) {
      setHasNewNotification(true);
      
      // Animation de pulsation pendant 3 secondes
      const timer = setTimeout(() => {
        setHasNewNotification(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  // 🖱️ FERMER LE DROPDOWN EN CLIQUANT DEHORS
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bellRef.current && 
        dropdownRef.current &&
        !bellRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // 🔔 TOGGLE DROPDOWN
  const handleBellClick = () => {
    setIsOpen(!isOpen);
    setHasNewNotification(false);
  };

  // 📖 CLIC SUR UNE NOTIFICATION
  const handleNotificationClick = async (notification: Notification) => {
    // Marquer comme lue si pas encore lue
    if (notification.status === 'unread') {
      await markAsRead(notification.id);
    }

    // Navigation si deepLink disponible
    if (notification.deepLink) {
      window.location.href = notification.deepLink;
    }

    // Callback personnalisé
    if (onNotificationClick) {
      onNotificationClick(notification);
    }

    // Fermer le dropdown
    setIsOpen(false);
  };

  // ✅ MARQUER TOUT COMME LU
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  // 👁️ VOIR TOUTES LES NOTIFICATIONS
  const handleViewAll = () => {
    if (onViewAllClick) {
      onViewAllClick();
    } else {
      window.location.href = '/notifications';
    }
    setIsOpen(false);
  };

  // 🗑️ SUPPRIMER UNE NOTIFICATION
  const handleDeleteNotification = async (notificationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    await deleteNotification(notificationId);
  };

  return (
    <div className={`relative ${className}`} ref={bellRef}>
      {/* 🔔 BOUTON CLOCHE */}
      <button
        onClick={handleBellClick}
        className={`
          relative p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
          ${hasUnreadNotifications() 
            ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }
          ${hasNewNotification ? 'animate-pulse' : ''}
        `}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ''}`}
        title={`${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`}
      >
        {/* Icône cloche avec animation */}
        <div className={`relative ${hasNewNotification ? 'animate-bounce' : ''}`}>
          {hasUnreadNotifications() ? (
            <BellRing className={`${sizeClasses[size]} transition-transform duration-200`} />
          ) : (
            <Bell className={`${sizeClasses[size]} transition-transform duration-200`} />
          )}
          
          {/* Badge de compteur */}
          {showBadge && unreadCount > 0 && (
            <span className={`
              absolute -top-1 -right-1 bg-red-500 text-white rounded-full flex items-center justify-center
              font-medium leading-none px-1.5 transition-all duration-200
              ${badgeClasses[size]}
              ${hasNewNotification ? 'animate-ping' : ''}
            `}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}

          {/* Indicateur de pulsation pour nouvelles notifications */}
          {hasNewNotification && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping opacity-75"></span>
          )}
        </div>
      </button>

      {/* 📋 DROPDOWN DES NOTIFICATIONS */}
      {isOpen && (
        <div ref={dropdownRef}>
          <NotificationDropdown
            notifications={recentNotifications}
            unreadCount={unreadCount}
            onNotificationClick={handleNotificationClick}
            onMarkAllAsRead={handleMarkAllAsRead}
            onViewAll={handleViewAll}
            onDeleteNotification={handleDeleteNotification}
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
