/**
 * 🔔 CONTEXTE REACT POUR LES NOTIFICATIONS
 * Intégration du service de notifications avec React
 */

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import type {
  EbiosNotification,
  NotificationSettings,
  NotificationFilters,
  NotificationStats,
  NotificationEvent
} from '../types/notifications';
import { notificationService } from '../services/NotificationService';

// 🎯 INTERFACE DU CONTEXTE
interface NotificationContextValue {
  // État
  notifications: EbiosNotification[];
  stats: NotificationStats;
  settings: NotificationSettings;
  isLoading: boolean;
  error: string | null;

  // Actions
  createNotification: (notification: Omit<EbiosNotification, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  getNotifications: (filters?: NotificationFilters) => EbiosNotification[];
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  
  // Utilitaires
  getUnreadCount: () => number;
  getNotificationsByCategory: (category: string) => EbiosNotification[];
  hasUnreadNotifications: () => boolean;
  refreshNotifications: () => void;
}

// 🎯 CRÉATION DU CONTEXTE
const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

// 🎯 PROPS DU PROVIDER
interface NotificationProviderProps {
  children: ReactNode;
}

// 🎯 PROVIDER DU CONTEXTE
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<EbiosNotification[]>([]);
  const [stats, setStats] = useState<NotificationStats>({
    total: 0,
    unread: 0,
    byType: {} as any,
    byCategory: {} as any,
    byPriority: {} as any,
    recentActivity: { today: 0, thisWeek: 0, thisMonth: 0 }
  });
  const [settings, setSettings] = useState<NotificationSettings>(notificationService.getSettings());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔄 RAFRAÎCHIR LES DONNÉES
  const refreshNotifications = useCallback(() => {
    try {
      const allNotifications = notificationService.getNotifications();
      const currentStats = notificationService.getStats();
      const currentSettings = notificationService.getSettings();

      setNotifications(allNotifications);
      setStats(currentStats);
      setSettings(currentSettings);
      setError(null);
    } catch (err) {
      console.error('❌ Erreur rafraîchissement notifications:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  }, []);

  // 🚀 INITIALISATION
  useEffect(() => {
    console.log('🔔 Initialisation NotificationContext...');
    
    // Charger les données initiales
    refreshNotifications();

    // S'abonner aux nouvelles notifications
    const handleNewNotification = (notification: EbiosNotification) => {
      console.log('🔔 Nouvelle notification reçue:', notification.title);
      refreshNotifications();
    };

    // S'abonner aux événements
    const handleNotificationEvent = (event: NotificationEvent) => {
      console.log('📡 Événement notification:', event.type, event.notificationId);
      refreshNotifications();
    };

    notificationService.subscribe('context', handleNewNotification);
    notificationService.subscribeToEvents('context', handleNotificationEvent);

    // Cleanup
    return () => {
      notificationService.unsubscribe('context');
      notificationService.unsubscribeFromEvents('context');
    };
  }, [refreshNotifications]);

  // 📝 CRÉER UNE NOTIFICATION
  const createNotification = useCallback(async (
    notification: Omit<EbiosNotification, 'id' | 'createdAt' | 'status'>
  ): Promise<string> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const id = await notificationService.createNotification(notification);
      
      // Pas besoin de rafraîchir ici, le listener s'en charge
      return id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur création notification';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 📖 RÉCUPÉRER LES NOTIFICATIONS AVEC FILTRES
  const getNotifications = useCallback((filters?: NotificationFilters): EbiosNotification[] => {
    return notificationService.getNotifications(filters);
  }, []);

  // ✅ MARQUER COMME LU
  const markAsRead = useCallback(async (notificationId: string): Promise<void> => {
    try {
      await notificationService.markAsRead(notificationId);
      // Le listener se charge du rafraîchissement
    } catch (err) {
      console.error('❌ Erreur marquage comme lu:', err);
      setError(err instanceof Error ? err.message : 'Erreur marquage');
    }
  }, []);

  // ✅ MARQUER TOUT COMME LU
  const markAllAsRead = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const unreadNotifications = notifications.filter(n => n.status === 'unread');
      await Promise.all(
        unreadNotifications.map(n => notificationService.markAsRead(n.id))
      );
      
      refreshNotifications();
    } catch (err) {
      console.error('❌ Erreur marquage tout comme lu:', err);
      setError(err instanceof Error ? err.message : 'Erreur marquage global');
    } finally {
      setIsLoading(false);
    }
  }, [notifications, refreshNotifications]);

  // 🗑️ SUPPRIMER UNE NOTIFICATION
  const deleteNotification = useCallback(async (notificationId: string): Promise<void> => {
    try {
      await notificationService.deleteNotification(notificationId);
      // Le listener se charge du rafraîchissement
    } catch (err) {
      console.error('❌ Erreur suppression notification:', err);
      setError(err instanceof Error ? err.message : 'Erreur suppression');
    }
  }, []);

  // 🧹 SUPPRIMER TOUTES LES NOTIFICATIONS
  const clearAllNotifications = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await notificationService.clearAllNotifications();
      refreshNotifications();
    } catch (err) {
      console.error('❌ Erreur suppression toutes notifications:', err);
      setError(err instanceof Error ? err.message : 'Erreur suppression globale');
    } finally {
      setIsLoading(false);
    }
  }, [refreshNotifications]);

  // ⚙️ METTRE À JOUR LES PARAMÈTRES
  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>): Promise<void> => {
    try {
      setIsLoading(true);
      await notificationService.updateSettings(newSettings);
      refreshNotifications();
    } catch (err) {
      console.error('❌ Erreur mise à jour paramètres:', err);
      setError(err instanceof Error ? err.message : 'Erreur paramètres');
    } finally {
      setIsLoading(false);
    }
  }, [refreshNotifications]);

  // 🔢 COMPTER LES NON LUES
  const getUnreadCount = useCallback((): number => {
    return notifications.filter(n => n.status === 'unread').length;
  }, [notifications]);

  // 📂 NOTIFICATIONS PAR CATÉGORIE
  const getNotificationsByCategory = useCallback((category: string): EbiosNotification[] => {
    return notifications.filter(n => n.category === category);
  }, [notifications]);

  // ❓ A DES NOTIFICATIONS NON LUES
  const hasUnreadNotifications = useCallback((): boolean => {
    return getUnreadCount() > 0;
  }, [getUnreadCount]);

  // 🎯 VALEUR DU CONTEXTE
  const contextValue: NotificationContextValue = {
    // État
    notifications,
    stats,
    settings,
    isLoading,
    error,

    // Actions
    createNotification,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updateSettings,

    // Utilitaires
    getUnreadCount,
    getNotificationsByCategory,
    hasUnreadNotifications,
    refreshNotifications
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// 🎯 HOOK POUR UTILISER LE CONTEXTE
export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotifications doit être utilisé dans un NotificationProvider');
  }
  
  return context;
};

// 🎯 HOOK POUR LES STATISTIQUES UNIQUEMENT
export const useNotificationStats = (): NotificationStats => {
  const { stats } = useNotifications();
  return stats;
};

// 🎯 HOOK POUR LE COMPTEUR NON LUES
export const useUnreadCount = (): number => {
  const { getUnreadCount } = useNotifications();
  return getUnreadCount();
};

// 🎯 HOOK POUR LES PARAMÈTRES
export const useNotificationSettings = (): {
  settings: NotificationSettings;
  updateSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
} => {
  const { settings, updateSettings } = useNotifications();
  return { settings, updateSettings };
};

export default NotificationContext;
