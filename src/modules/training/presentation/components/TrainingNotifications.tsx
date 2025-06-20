/**
 * 🔔 COMPOSANT NOTIFICATIONS
 * Système de notifications pour la formation
 * Pattern Observer pour réactivité temps réel
 */

import React, { useEffect } from 'react';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle,
  Bell
} from 'lucide-react';
import { useUI, useTrainingActions } from '../stores/trainingStore';

/**
 * 🎯 COMPOSANT PRINCIPAL
 */
export const TrainingNotifications: React.FC = () => {
  // 🎪 HOOKS STORE
  const ui = useUI();
  const actions = useTrainingActions();

  // 🔄 AUTO-SUPPRESSION DES NOTIFICATIONS
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    ui.notifications.forEach((notification) => {
      if (notification.autoClose !== false) {
        const duration = notification.duration || 5000;
        const timer = setTimeout(() => {
          actions.removeNotification(notification.id);
        }, duration);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [ui.notifications, actions]);

  // 🎯 RENDU DES NOTIFICATIONS
  const renderNotification = (notification: typeof ui.notifications[0]) => {
    const getIcon = () => {
      switch (notification.type) {
        case 'success':
          return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'error':
          return <AlertCircle className="w-5 h-5 text-red-500" />;
        case 'warning':
          return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
        case 'info':
        default:
          return <Info className="w-5 h-5 text-blue-500" />;
      }
    };

    const getBackgroundColor = () => {
      switch (notification.type) {
        case 'success':
          return 'bg-green-50 border-green-200';
        case 'error':
          return 'bg-red-50 border-red-200';
        case 'warning':
          return 'bg-yellow-50 border-yellow-200';
        case 'info':
        default:
          return 'bg-blue-50 border-blue-200';
      }
    };

    const getTextColor = () => {
      switch (notification.type) {
        case 'success':
          return 'text-green-800';
        case 'error':
          return 'text-red-800';
        case 'warning':
          return 'text-yellow-800';
        case 'info':
        default:
          return 'text-blue-800';
      }
    };

    return (
      <div
        key={notification.id}
        className={`
          notification-item
          max-w-sm w-full border rounded-lg shadow-lg p-4 mb-3
          transform transition-all duration-300 ease-in-out
          hover:scale-105 hover:shadow-xl
          ${getBackgroundColor()}
          animate-slide-in-right
        `}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="ml-3 flex-1">
            <h4 className={`text-sm font-medium ${getTextColor()}`}>
              {notification.title}
            </h4>
            <p className={`mt-1 text-sm ${getTextColor()} opacity-90`}>
              {notification.message}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {notification.timestamp.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => actions.removeNotification(notification.id)}
              className={`
                inline-flex rounded-md p-1.5 transition-colors
                ${notification.type === 'success' ? 'text-green-400 hover:bg-green-100' :
                  notification.type === 'error' ? 'text-red-400 hover:bg-red-100' :
                  notification.type === 'warning' ? 'text-yellow-400 hover:bg-yellow-100' :
                  'text-blue-400 hover:bg-blue-100'}
              `}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barre de progression pour auto-close */}
        {notification.autoClose !== false && (
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className={`
                  h-1 rounded-full transition-all ease-linear
                  ${notification.type === 'success' ? 'bg-green-500' :
                    notification.type === 'error' ? 'bg-red-500' :
                    notification.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'}
                `}
                style={{
                  width: '100%',
                  animation: `shrink ${notification.duration || 5000}ms linear forwards`
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  // 🎯 RENDU PRINCIPAL
  if (ui.notifications.length === 0) {
    return null;
  }

  return (
    <>
      {/* Conteneur des notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {ui.notifications.map(renderNotification)}
      </div>

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }

        .notification-item:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
};

// 🎯 HOOK POUR FACILITER L'USAGE
export const useNotifications = () => {
  const actions = useTrainingActions();

  const showSuccess = (title: string, message: string, options?: {
    duration?: number;
    autoClose?: boolean;
  }) => {
    actions.addNotification({
      type: 'success',
      title,
      message,
      autoClose: options?.autoClose,
      duration: options?.duration
    });
  };

  const showError = (title: string, message: string, options?: {
    duration?: number;
    autoClose?: boolean;
  }) => {
    actions.addNotification({
      type: 'error',
      title,
      message,
      autoClose: options?.autoClose,
      duration: options?.duration
    });
  };

  const showWarning = (title: string, message: string, options?: {
    duration?: number;
    autoClose?: boolean;
  }) => {
    actions.addNotification({
      type: 'warning',
      title,
      message,
      autoClose: options?.autoClose,
      duration: options?.duration
    });
  };

  const showInfo = (title: string, message: string, options?: {
    duration?: number;
    autoClose?: boolean;
  }) => {
    actions.addNotification({
      type: 'info',
      title,
      message,
      autoClose: options?.autoClose,
      duration: options?.duration
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default TrainingNotifications;
