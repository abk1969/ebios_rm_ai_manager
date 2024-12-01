import React from 'react';
import { Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const NotificationsPanel = () => {
  const notifications = [
    {
      id: 1,
      type: 'info',
      message: 'Nouvelle mise à jour disponible',
      time: 'Il y a 5 minutes',
      icon: Info,
    },
    {
      id: 2,
      type: 'success',
      message: 'Mission "Audit Sécurité" terminée',
      time: 'Il y a 1 heure',
      icon: CheckCircle,
    },
    {
      id: 3,
      type: 'warning',
      message: 'Workshop 2 en attente de validation',
      time: 'Il y a 2 heures',
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
          <Bell className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
            >
              <notification.icon
                className={`h-5 w-5 ${
                  notification.type === 'success'
                    ? 'text-green-500'
                    : notification.type === 'warning'
                    ? 'text-yellow-500'
                    : 'text-blue-500'
                }`}
              />
              <div className="flex-1">
                <p className="text-sm text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
            Voir toutes les notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPanel;