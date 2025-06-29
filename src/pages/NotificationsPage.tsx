/**
 * 🔔 PAGE DES NOTIFICATIONS
 * Interface complète pour gérer toutes les notifications
 */

import React, { useState } from 'react';
import { 
  Bell, 
  Filter, 
  Search, 
  CheckCheck, 
  Trash2, 
  Settings,
  Calendar,
  Tag,
  SortDesc,
  Eye,
  EyeOff
} from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { 
  NotificationFilters, 
  NotificationType, 
  NotificationCategory, 
  NotificationPriority,
  NotificationStatus 
} from '../types/notifications';

/**
 * 🔔 COMPOSANT PRINCIPAL
 */
const NotificationsPage: React.FC = () => {
  const {
    notifications,
    stats,
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  } = useNotifications();

  const [filters, setFilters] = useState<NotificationFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // 📋 NOTIFICATIONS FILTRÉES
  const filteredNotifications = getNotifications({
    ...filters,
    search: searchTerm || undefined
  });

  // 🎨 COULEURS PAR STATUT
  const getStatusColor = (status: NotificationStatus) => {
    switch (status) {
      case 'unread':
        return 'bg-blue-50 border-l-blue-500';
      case 'read':
        return 'bg-white border-l-gray-300';
      case 'archived':
        return 'bg-gray-50 border-l-gray-400';
      default:
        return 'bg-white border-l-gray-300';
    }
  };

  // 📅 FORMATAGE DATE
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ✅ SÉLECTION MULTIPLE
  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  // 🗑️ ACTIONS EN LOT
  const handleBulkMarkAsRead = async () => {
    await Promise.all(
      selectedNotifications.map(id => markAsRead(id))
    );
    setSelectedNotifications([]);
  };

  const handleBulkDelete = async () => {
    await Promise.all(
      selectedNotifications.map(id => deleteNotification(id))
    );
    setSelectedNotifications([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 📋 HEADER */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Bell className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-600">
                  {stats.total} notification{stats.total > 1 ? 's' : ''} • {stats.unread} non lue{stats.unread > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {stats.unread > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Tout marquer comme lu</span>
                </button>
              )}

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  showFilters 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filtres</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 📊 SIDEBAR STATISTIQUES */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-medium">{stats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Non lues</span>
                  <span className="font-medium text-blue-600">{stats.unread}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Aujourd'hui</span>
                  <span className="font-medium">{stats.recentActivity.today}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cette semaine</span>
                  <span className="font-medium">{stats.recentActivity.thisWeek}</span>
                </div>
              </div>
            </div>

            {/* 🔍 RECHERCHE */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 📋 LISTE DES NOTIFICATIONS */}
          <div className="lg:col-span-3">
            {/* ACTIONS EN LOT */}
            {selectedNotifications.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-blue-800">
                    {selectedNotifications.length} notification{selectedNotifications.length > 1 ? 's' : ''} sélectionnée{selectedNotifications.length > 1 ? 's' : ''}
                  </span>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleBulkMarkAsRead}
                      className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Marquer comme lues</span>
                    </button>
                    
                    <button
                      onClick={handleBulkDelete}
                      className="flex items-center space-x-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* LISTE */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* HEADER LISTE */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {filteredNotifications.length} notification{filteredNotifications.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <SortDesc className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">Plus récentes</span>
                  </div>
                </div>
              </div>

              {/* NOTIFICATIONS */}
              <div className="divide-y divide-gray-200">
                {filteredNotifications.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Aucune notification trouvée</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-6 py-4 hover:bg-gray-50 transition-colors border-l-4 ${getStatusColor(notification.status)}`}
                    >
                      <div className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.includes(notification.id)}
                          onChange={() => handleSelectNotification(notification.id)}
                          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm font-medium ${
                                notification.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h4>
                              
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>

                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDate(notification.createdAt)}</span>
                                </span>
                                
                                <span className="flex items-center space-x-1">
                                  <Tag className="w-3 h-3" />
                                  <span className="capitalize">{notification.category}</span>
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 ml-4">
                              {notification.status === 'unread' && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-blue-600 hover:text-blue-700"
                                  title="Marquer comme lu"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}
                              
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="text-red-600 hover:text-red-700"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
