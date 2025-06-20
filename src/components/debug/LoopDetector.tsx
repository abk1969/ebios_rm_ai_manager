/**
 * 🔍 DÉTECTEUR DE BOUCLES INFINIES
 * Composant de diagnostic pour identifier les boucles de re-rendu
 */

import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Eye, X } from 'lucide-react';

interface LoopDetectorProps {
  componentName?: string;
  threshold?: number; // Nombre de re-rendus avant alerte
  timeWindow?: number; // Fenêtre de temps en ms
}

interface RenderInfo {
  timestamp: number;
  count: number;
  stackTrace?: string;
}

export const LoopDetector: React.FC<LoopDetectorProps> = ({
  componentName = 'Unknown',
  threshold = 10,
  timeWindow = 5000
}) => {
  const renderCount = useRef(0);
  const renderHistory = useRef<RenderInfo[]>([]);
  const [isLoopDetected, setIsLoopDetected] = useState(false);
  const [loopInfo, setLoopInfo] = useState<{
    count: number;
    timespan: number;
    avgInterval: number;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Incrémenter le compteur de rendu
    renderCount.current += 1;
    const now = Date.now();
    
    // Ajouter à l'historique
    renderHistory.current.push({
      timestamp: now,
      count: renderCount.current,
      stackTrace: new Error().stack
    });

    // Nettoyer l'historique ancien
    renderHistory.current = renderHistory.current.filter(
      info => now - info.timestamp <= timeWindow
    );

    // Vérifier si on a une boucle
    if (renderHistory.current.length >= threshold) {
      const firstRender = renderHistory.current[0];
      const lastRender = renderHistory.current[renderHistory.current.length - 1];
      const timespan = lastRender.timestamp - firstRender.timestamp;
      const avgInterval = timespan / renderHistory.current.length;

      setIsLoopDetected(true);
      setLoopInfo({
        count: renderHistory.current.length,
        timespan,
        avgInterval
      });
      setIsVisible(true);

      // Log détaillé
      console.error(`🚨 BOUCLE DÉTECTÉE dans ${componentName}:`, {
        renders: renderHistory.current.length,
        timespan: `${timespan}ms`,
        avgInterval: `${avgInterval.toFixed(2)}ms`,
        history: renderHistory.current.slice(-5) // Derniers 5 rendus
      });
    }

    // Log de debug
    if (renderCount.current % 5 === 0) {
      console.warn(`🔄 ${componentName} rendu ${renderCount.current} fois`);
    }
  });

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-red-100 border-2 border-red-500 rounded-lg p-4 max-w-md shadow-xl">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="font-bold text-red-900">Boucle Détectée!</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-red-600 hover:text-red-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium text-red-800">Composant:</span>
          <span className="ml-2 text-red-700">{componentName}</span>
        </div>
        
        {loopInfo && (
          <>
            <div>
              <span className="font-medium text-red-800">Rendus:</span>
              <span className="ml-2 text-red-700">{loopInfo.count}</span>
            </div>
            <div>
              <span className="font-medium text-red-800">Durée:</span>
              <span className="ml-2 text-red-700">{loopInfo.timespan}ms</span>
            </div>
            <div>
              <span className="font-medium text-red-800">Intervalle moyen:</span>
              <span className="ml-2 text-red-700">{loopInfo.avgInterval.toFixed(2)}ms</span>
            </div>
          </>
        )}
      </div>

      <div className="mt-3 flex space-x-2">
        <button
          onClick={() => {
            console.log(`📊 Historique complet de ${componentName}:`, renderHistory.current);
          }}
          className="flex items-center space-x-1 px-2 py-1 bg-red-200 text-red-800 rounded text-xs hover:bg-red-300"
        >
          <Eye className="w-3 h-3" />
          <span>Voir logs</span>
        </button>
        <button
          onClick={() => {
            renderCount.current = 0;
            renderHistory.current = [];
            setIsLoopDetected(false);
            setLoopInfo(null);
            setIsVisible(false);
          }}
          className="px-2 py-1 bg-red-200 text-red-800 rounded text-xs hover:bg-red-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

// Hook pour utiliser le détecteur facilement
export const useLoopDetector = (componentName: string, threshold = 10) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    
    if (renderCount.current > threshold) {
      console.error(`🚨 BOUCLE POSSIBLE dans ${componentName}: ${renderCount.current} rendus`);
    }
  });

  return renderCount.current;
};

export default LoopDetector;
