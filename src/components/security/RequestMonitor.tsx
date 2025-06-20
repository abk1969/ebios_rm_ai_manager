/**
 * 🛡️ MONITEUR DE REQUÊTES SÉCURISÉ
 * Composant pour surveiller et afficher les requêtes bloquées
 */

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, X, Eye, EyeOff } from 'lucide-react';
import { requestInterceptor } from '../../services/security/RequestInterceptor';

interface RequestMonitorProps {
  className?: string;
}

export const RequestMonitor: React.FC<RequestMonitorProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState(requestInterceptor.getStats());
  const [blockedRequests, setBlockedRequests] = useState<string[]>([]);

  useEffect(() => {
    // Mettre à jour les stats périodiquement
    const interval = setInterval(() => {
      setStats(requestInterceptor.getStats());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const clearBlockedRequests = () => {
    setBlockedRequests([]);
  };

  if (!isVisible) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <button
          onClick={toggleVisibility}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Afficher le moniteur de sécurité"
        >
          <Shield className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-xl w-96 max-h-96 overflow-hidden">
        {/* En-tête */}
        <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Moniteur de Sécurité</span>
          </div>
          <button
            onClick={toggleVisibility}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Statut */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            {stats.isActive ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">Intercepteur actif</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600 font-medium">Intercepteur inactif</span>
              </>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-red-50 p-2 rounded">
              <div className="text-red-600 font-medium">Domaines bloqués</div>
              <div className="text-red-800">{stats.blockedDomains.length}</div>
            </div>
            <div className="bg-green-50 p-2 rounded">
              <div className="text-green-600 font-medium">Domaines autorisés</div>
              <div className="text-green-800">{stats.allowedDomains.length}</div>
            </div>
          </div>
        </div>

        {/* Domaines bloqués */}
        <div className="p-3 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Domaines bloqués</h4>
          <div className="max-h-24 overflow-y-auto">
            {stats.blockedDomains.length > 0 ? (
              <div className="space-y-1">
                {stats.blockedDomains.map((domain, index) => (
                  <div key={index} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                    {domain}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500">Aucun domaine bloqué</div>
            )}
          </div>
        </div>

        {/* Domaines autorisés */}
        <div className="p-3 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Domaines autorisés</h4>
          <div className="max-h-24 overflow-y-auto">
            {stats.allowedDomains.length > 0 ? (
              <div className="space-y-1">
                {stats.allowedDomains.slice(0, 5).map((domain, index) => (
                  <div key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                    {domain}
                  </div>
                ))}
                {stats.allowedDomains.length > 5 && (
                  <div className="text-xs text-gray-500">
                    +{stats.allowedDomains.length - 5} autres...
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-gray-500">Aucun domaine autorisé</div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="p-3 bg-gray-50">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                if (stats.isActive) {
                  requestInterceptor.deactivate();
                } else {
                  requestInterceptor.activate();
                }
                setStats(requestInterceptor.getStats());
              }}
              className={`flex-1 px-3 py-1 text-xs rounded transition-colors ${
                stats.isActive
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {stats.isActive ? 'Désactiver' : 'Activer'}
            </button>
            <button
              onClick={clearBlockedRequests}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors"
            >
              Effacer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestMonitor;
