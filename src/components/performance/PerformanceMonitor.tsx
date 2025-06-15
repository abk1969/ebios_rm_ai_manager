/**
 * 📊 COMPOSANT DE MONITORING DES PERFORMANCES
 * Surveillance en temps réel des performances du cache et Firebase
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { 
  Activity, 
  Database, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  BarChart3,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import EbiosRMMetricsService from '@/services/metrics/EbiosRMMetricsService';
import { OptimizedFirebaseService } from '@/services/firebase/OptimizedFirebaseService';

interface PerformanceMonitorProps {
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface PerformanceData {
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
    size: number;
    averageResponseTime: number;
  };
  firebase: {
    totalQueries: number;
    averageQueryTime: number;
    errorRate: number;
    dataTransferred: number;
  };
  overall: {
    status: 'excellent' | 'good' | 'warning' | 'critical';
    score: number;
  };
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  className,
  autoRefresh = true,
  refreshInterval = 30000 // 30 secondes
}) => {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadPerformanceData();

    if (autoRefresh) {
      const interval = setInterval(loadPerformanceData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const loadPerformanceData = async () => {
    try {
      setIsLoading(true);

      // Récupération des statistiques de cache
      const cacheStats = EbiosRMMetricsService.getCacheStats();
      
      // Récupération des statistiques Firebase
      const firebaseService = OptimizedFirebaseService.getInstance();
      const firebaseStats = firebaseService.getPerformanceMetrics();

      // Calcul du score global de performance
      const overallScore = calculateOverallScore(cacheStats, firebaseStats);
      const status = getPerformanceStatus(overallScore);

      const data: PerformanceData = {
        cache: {
          hits: cacheStats.hits,
          misses: cacheStats.misses,
          hitRate: cacheStats.totalRequests > 0 ? (cacheStats.hits / cacheStats.totalRequests) * 100 : 0,
          size: cacheStats.cacheSize,
          averageResponseTime: cacheStats.averageResponseTime
        },
        firebase: {
          totalQueries: firebaseStats.totalQueries,
          averageQueryTime: firebaseStats.averageQueryTime,
          errorRate: firebaseStats.errorRate * 100,
          dataTransferred: firebaseStats.dataTransferred
        },
        overall: {
          status,
          score: overallScore
        }
      };

      setPerformanceData(data);
      setLastUpdate(new Date());

    } catch (error) {
      console.error('Erreur chargement données performance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateOverallScore = (cacheStats: any, firebaseStats: any): number => {
    let score = 100;

    // Pénalités basées sur les performances
    if (cacheStats.averageResponseTime > 100) score -= 10;
    if (cacheStats.averageResponseTime > 500) score -= 20;
    
    if (firebaseStats.averageQueryTime > 1000) score -= 15;
    if (firebaseStats.averageQueryTime > 3000) score -= 25;
    
    if (firebaseStats.errorRate > 0.05) score -= 20; // > 5% d'erreurs
    if (firebaseStats.errorRate > 0.1) score -= 30; // > 10% d'erreurs

    const hitRate = cacheStats.totalRequests > 0 ? (cacheStats.hits / cacheStats.totalRequests) : 0;
    if (hitRate < 0.5) score -= 15; // < 50% de hit rate
    if (hitRate < 0.3) score -= 25; // < 30% de hit rate

    return Math.max(0, score);
  };

  const getPerformanceStatus = (score: number): 'excellent' | 'good' | 'warning' | 'critical' => {
    if (score >= 90) return 'excellent';
    if (score >= 75) return 'good';
    if (score >= 60) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return CheckCircle;
      case 'good': return TrendingUp;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Activity;
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!performanceData) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="flex items-center justify-center">
          <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Chargement des métriques...</span>
        </div>
      </Card>
    );
  }

  const StatusIcon = getStatusIcon(performanceData.overall.status);

  return (
    <div className={cn("space-y-4", className)}>
      {/* En-tête avec statut global */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Performance Système</h3>
              <p className="text-sm text-gray-600">
                Dernière mise à jour : {lastUpdate.toLocaleTimeString('fr-FR')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={cn('px-3 py-1', getStatusColor(performanceData.overall.status))}>
              Score: {performanceData.overall.score}/100
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={loadPerformanceData}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              Actualiser
            </Button>
          </div>
        </div>
      </Card>

      {/* Métriques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cache Performance */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-yellow-600" />
            <h4 className="font-semibold text-gray-900">Cache Performance</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taux de succès</span>
              <span className="font-medium text-green-600">
                {performanceData.cache.hitRate.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hits / Misses</span>
              <span className="font-medium">
                {performanceData.cache.hits} / {performanceData.cache.misses}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taille cache</span>
              <span className="font-medium">{performanceData.cache.size} entrées</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Temps de réponse</span>
              <span className="font-medium">
                {performanceData.cache.averageResponseTime.toFixed(2)}ms
              </span>
            </div>
          </div>
        </Card>

        {/* Firebase Performance */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Database className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">Firebase Performance</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Requêtes totales</span>
              <span className="font-medium">{performanceData.firebase.totalQueries}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Temps moyen</span>
              <span className="font-medium">
                {performanceData.firebase.averageQueryTime.toFixed(2)}ms
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taux d'erreur</span>
              <span className={cn(
                "font-medium",
                performanceData.firebase.errorRate > 5 ? "text-red-600" : "text-green-600"
              )}>
                {performanceData.firebase.errorRate.toFixed(2)}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Données transférées</span>
              <span className="font-medium">
                {formatBytes(performanceData.firebase.dataTransferred * 1024)} {/* Estimation */}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceMonitor;
