/**
 * ⚡ COMPOSANT ACTIONS RAPIDES POUR NOTIFICATIONS
 * Boutons d'action contextuels dans les notifications
 */

import React, { useState } from 'react';
import { 
  ExternalLink, 
  Download, 
  Share2, 
  MessageCircle, 
  Check, 
  X, 
  Clock, 
  RefreshCw,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import type { NotificationAction, NotificationContext } from '../../types/notifications';
import { notificationActions } from '../../services/NotificationActions';

// 🎯 PROPS DU COMPOSANT
interface NotificationQuickActionsProps {
  notificationId: string;
  actions: NotificationAction[];
  context: NotificationContext;
  userId: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
  size?: 'sm' | 'md' | 'lg';
  maxActions?: number;
  onActionExecuted?: (actionId: string, result: any) => void;
  className?: string;
}

// 🎯 ÉTAT D'UNE ACTION
interface ActionState {
  loading: boolean;
  success?: boolean;
  error?: string;
}

/**
 * ⚡ COMPOSANT PRINCIPAL
 */
export const NotificationQuickActions: React.FC<NotificationQuickActionsProps> = ({
  notificationId,
  actions,
  context,
  userId,
  layout = 'horizontal',
  size = 'md',
  maxActions = 3,
  onActionExecuted,
  className = ''
}) => {
  const [actionStates, setActionStates] = useState<Record<string, ActionState>>({});
  const [showConfirmation, setShowConfirmation] = useState<string | null>(null);

  // 🎨 STYLES SELON LA TAILLE
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  // 🎨 STYLES SELON LE LAYOUT
  const layoutClasses = {
    horizontal: 'flex items-center space-x-2',
    vertical: 'flex flex-col space-y-2',
    grid: 'grid grid-cols-2 gap-2'
  };

  // 🎨 OBTENIR L'ICÔNE D'UNE ACTION
  const getActionIcon = (action: NotificationAction) => {
    const iconClass = iconSizes[size];
    
    if (action.icon) {
      // Si l'icône est un emoji ou texte
      if (typeof action.icon === 'string' && action.icon.length <= 2) {
        return <span className="text-sm">{action.icon}</span>;
      }
    }

    // Icônes par défaut selon l'ID de l'action
    switch (action.id) {
      case 'navigate_to_workshop':
      case 'navigate_to_mission':
      case 'navigate_to_results':
        return <ExternalLink className={iconClass} />;
      case 'download_report':
        return <Download className={iconClass} />;
      case 'share_report':
        return <Share2 className={iconClass} />;
      case 'reply_to_comment':
        return <MessageCircle className={iconClass} />;
      case 'accept_invitation':
        return <Check className={iconClass} />;
      case 'decline_invitation':
        return <X className={iconClass} />;
      case 'schedule_later':
        return <Clock className={iconClass} />;
      case 'retry_sync':
        return <RefreshCw className={iconClass} />;
      case 'fix_validation_error':
        return <AlertTriangle className={iconClass} />;
      default:
        return <ExternalLink className={iconClass} />;
    }
  };

  // 🎨 OBTENIR LES STYLES D'UN BOUTON
  const getButtonStyles = (action: NotificationAction, state: ActionState) => {
    const baseClasses = `
      inline-flex items-center space-x-1 rounded transition-all duration-200 
      font-medium focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed
      ${sizeClasses[size]}
    `;

    if (state.loading) {
      return `${baseClasses} bg-gray-100 text-gray-600 cursor-wait`;
    }

    if (state.success) {
      return `${baseClasses} bg-green-100 text-green-700 border border-green-200`;
    }

    if (state.error) {
      return `${baseClasses} bg-red-100 text-red-700 border border-red-200`;
    }

    switch (action.type) {
      case 'primary':
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
      case 'secondary':
        return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500`;
      case 'danger':
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500`;
    }
  };

  // ⚡ EXÉCUTER UNE ACTION
  const executeAction = async (action: NotificationAction) => {
    try {
      // Mettre à jour l'état de l'action
      setActionStates(prev => ({
        ...prev,
        [action.id]: { loading: true }
      }));

      // Préparer le contexte d'action
      const actionContext = {
        notificationId,
        userId,
        notificationContext: context,
        metadata: {
          actionType: action.type,
          actionLabel: action.label
        }
      };

      // Exécuter l'action
      const result = await notificationActions.executeAction(action.id, actionContext);

      // Mettre à jour l'état selon le résultat
      setActionStates(prev => ({
        ...prev,
        [action.id]: {
          loading: false,
          success: result.success,
          error: result.success ? undefined : result.message
        }
      }));

      // Callback si fourni
      if (onActionExecuted) {
        onActionExecuted(action.id, result);
      }

      // Navigation si URL fournie
      if (result.success && result.redirectUrl) {
        setTimeout(() => {
          window.location.href = result.redirectUrl!;
        }, 500);
      }

      // Réinitialiser l'état après un délai
      setTimeout(() => {
        setActionStates(prev => {
          const newState = { ...prev };
          delete newState[action.id];
          return newState;
        });
      }, 3000);

    } catch (error) {
      console.error('❌ Erreur exécution action:', error);
      
      setActionStates(prev => ({
        ...prev,
        [action.id]: {
          loading: false,
          success: false,
          error: 'Erreur inattendue'
        }
      }));
    }
  };

  // 🔔 GÉRER LA CONFIRMATION
  const handleActionClick = async (action: NotificationAction) => {
    // Vérifier si confirmation requise
    if (action.onClick && typeof action.onClick === 'function') {
      // Action personnalisée
      try {
        await action.onClick();
      } catch (error) {
        console.error('❌ Erreur action personnalisée:', error);
      }
      return;
    }

    // Navigation directe si URL fournie
    if (action.url) {
      if (action.external) {
        window.open(action.url, '_blank');
      } else {
        window.location.href = action.url;
      }
      return;
    }

    // Action avec confirmation
    const actionHandler = notificationActions.getActionHandlers().get(action.id);
    if (actionHandler?.requiresConfirmation) {
      setShowConfirmation(action.id);
      return;
    }

    // Exécuter l'action directement
    await executeAction(action);
  };

  // ✅ CONFIRMER UNE ACTION
  const confirmAction = async (actionId: string) => {
    const action = actions.find(a => a.id === actionId);
    if (action) {
      await executeAction(action);
    }
    setShowConfirmation(null);
  };

  // ❌ ANNULER UNE CONFIRMATION
  const cancelConfirmation = () => {
    setShowConfirmation(null);
  };

  // Limiter le nombre d'actions affichées
  const visibleActions = actions.slice(0, maxActions);
  const hasMoreActions = actions.length > maxActions;

  return (
    <div className={className}>
      {/* Actions principales */}
      <div className={layoutClasses[layout]}>
        {visibleActions.map((action) => {
          const state = actionStates[action.id] || { loading: false };
          
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              disabled={state.loading}
              className={getButtonStyles(action, state)}
              title={action.label}
            >
              {state.loading ? (
                <Loader2 className={`${iconSizes[size]} animate-spin`} />
              ) : (
                getActionIcon(action)
              )}
              
              <span className={layout === 'grid' ? 'text-xs' : ''}>
                {state.success ? 'Fait !' : 
                 state.error ? 'Erreur' : 
                 action.label}
              </span>
            </button>
          );
        })}

        {/* Indicateur d'actions supplémentaires */}
        {hasMoreActions && (
          <span className="text-xs text-gray-500">
            +{actions.length - maxActions} autre{actions.length - maxActions > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Modal de confirmation */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirmer l'action
            </h3>
            
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir effectuer cette action ?
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => confirmAction(showConfirmation)}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Confirmer
              </button>
              
              <button
                onClick={cancelConfirmation}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 🎯 COMPOSANT ACTIONS COMPACTES
export const CompactQuickActions: React.FC<{
  notificationId: string;
  actions: NotificationAction[];
  context: NotificationContext;
  userId: string;
  onActionExecuted?: (actionId: string, result: any) => void;
}> = ({ notificationId, actions, context, userId, onActionExecuted }) => {
  // Prendre seulement les 2 premières actions
  const primaryActions = actions.slice(0, 2);

  return (
    <NotificationQuickActions
      notificationId={notificationId}
      actions={primaryActions}
      context={context}
      userId={userId}
      layout="horizontal"
      size="sm"
      maxActions={2}
      onActionExecuted={onActionExecuted}
      className="mt-2"
    />
  );
};

// 🎯 HOOK POUR GÉNÉRER DES ACTIONS CONTEXTUELLES
export const useContextualActions = (
  context: NotificationContext,
  userRole?: string
) => {
  const actions = React.useMemo(() => {
    return notificationActions.generateContextualActions(context, userRole);
  }, [context, userRole]);

  return actions;
};

export default NotificationQuickActions;
