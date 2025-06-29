/**
 * 📊 AFFICHAGE DES MÉTRIQUES TEMPS RÉEL
 * Visualisation des performances et engagement
 * POINT 3 - Interface Utilisateur React Intelligente
 */

import React, { useState, useEffect } from 'react';
import { RealTimeMetrics } from '../hooks/useWorkshop1Intelligence';

// 🎯 TYPES POUR LES MÉTRIQUES

interface RealTimeMetricsDisplayProps {
  metrics: RealTimeMetrics;
  visibility: 'hidden' | 'minimal' | 'detailed' | 'expert';
  onRefresh: () => Promise<void>;
  className?: string;
}

interface MetricCard {
  id: string;
  title: string;
  value: number;
  unit: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  description: string;
  expertLevel: 'minimal' | 'detailed' | 'expert';
}

// 📊 COMPOSANT PRINCIPAL

export const RealTimeMetricsDisplay: React.FC<RealTimeMetricsDisplayProps> = ({
  metrics,
  visibility,
  onRefresh,
  className = ''
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // 🔄 RAFRAÎCHISSEMENT

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('❌ Erreur rafraîchissement métriques:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // 📊 GÉNÉRATION DES CARTES DE MÉTRIQUES

  const generateMetricCards = (): MetricCard[] => {
    return [
      {
        id: 'response_time',
        title: 'Temps de Réponse',
        value: metrics.responseTime,
        unit: 'ms',
        icon: '⚡',
        color: metrics.responseTime < 1000 ? 'green' : metrics.responseTime < 2000 ? 'yellow' : 'red',
        trend: metrics.responseTime < 1500 ? 'up' : 'down',
        description: 'Temps de réponse moyen du système',
        expertLevel: 'minimal'
      },
      {
        id: 'interaction_frequency',
        title: 'Fréquence d\'Interaction',
        value: metrics.interactionFrequency,
        unit: '/min',
        icon: '🔄',
        color: metrics.interactionFrequency > 2 ? 'green' : metrics.interactionFrequency > 1 ? 'yellow' : 'red',
        trend: 'stable',
        description: 'Nombre d\'interactions par minute',
        expertLevel: 'detailed'
      },
      {
        id: 'content_relevance',
        title: 'Pertinence du Contenu',
        value: metrics.contentRelevance,
        unit: '%',
        icon: '🎯',
        color: metrics.contentRelevance > 80 ? 'green' : metrics.contentRelevance > 60 ? 'yellow' : 'red',
        trend: 'up',
        description: 'Niveau de pertinence du contenu adaptatif',
        expertLevel: 'detailed'
      },
      {
        id: 'collaboration_activity',
        title: 'Activité Collaborative',
        value: metrics.collaborationActivity,
        unit: '%',
        icon: '🤝',
        color: metrics.collaborationActivity > 70 ? 'green' : metrics.collaborationActivity > 40 ? 'yellow' : 'red',
        trend: 'up',
        description: 'Niveau d\'engagement dans les collaborations',
        expertLevel: 'expert'
      },
      {
        id: 'notification_efficiency',
        title: 'Efficacité Notifications',
        value: metrics.notificationEfficiency,
        unit: '%',
        icon: '🔔',
        color: metrics.notificationEfficiency > 85 ? 'green' : metrics.notificationEfficiency > 70 ? 'yellow' : 'red',
        trend: 'stable',
        description: 'Taux de succès des notifications expertes',
        expertLevel: 'expert'
      },
      {
        id: 'a2a_messages',
        title: 'Messages A2A',
        value: metrics.a2aMessageCount,
        unit: '',
        icon: '📡',
        color: 'blue',
        trend: 'up',
        description: 'Nombre de messages échangés via protocole A2A',
        expertLevel: 'expert'
      }
    ];
  };

  // 🔍 FILTRAGE SELON LA VISIBILITÉ

  const getVisibleMetrics = (): MetricCard[] => {
    const allMetrics = generateMetricCards();
    
    switch (visibility) {
      case 'minimal':
        return allMetrics.filter(m => m.expertLevel === 'minimal');
      case 'detailed':
        return allMetrics.filter(m => m.expertLevel === 'minimal' || m.expertLevel === 'detailed');
      case 'expert':
        return allMetrics;
      default:
        return [];
    }
  };

  // 🎨 COULEURS SELON LA VALEUR

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'red':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 📱 RENDU SELON LA VISIBILITÉ

  if (visibility === 'hidden') {
    return null;
  }

  const visibleMetrics = getVisibleMetrics();

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* En-tête */}
      <div className="p-4 border-b border-gray-200 animate-fade-in">
        <div className="flex items-center justify-between animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-900 animate-fade-in">
            📊 Métriques Temps Réel
          </h3>
          <div className="flex items-center space-x-2 animate-fade-in">
            <span className="text-xs text-gray-500 animate-fade-in">
              Dernière MAJ: {metrics.lastUpdate.toLocaleTimeString()}
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 animate-fade-in"
            >
              <div
                className={isRefreshing ? 'animate-spin' : ''}
              >
                🔄
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Grille de métriques */}
      <div className="p-4 animate-fade-in">
        <div className={`grid gap-4 ${
          visibility === 'minimal' ? 'grid-cols-1' :
          visibility === 'detailed' ? 'grid-cols-2' :
          'grid-cols-2 lg:grid-cols-3'
        }`}>
          {visibleMetrics.map((metric, index) => (
            <div
              key={metric.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                getColorClasses(metric.color)
              } ${selectedMetric === metric.id ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedMetric(selectedMetric === metric.id ? null : metric.id)}
            >
              <div className="flex items-center justify-between mb-2 animate-fade-in">
                <span className="text-2xl animate-fade-in">{metric.icon}</span>
                {metric.trend && (
                  <span className={`text-sm ${
                    metric.trend === 'up' ? 'text-green-600' :
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.trend === 'up' ? '📈' : metric.trend === 'down' ? '📉' : '➡️'}
                  </span>
                )}
              </div>
              
              <h4 className="font-medium text-sm mb-1 animate-fade-in">{metric.title}</h4>
              
              <div className="flex items-baseline space-x-1 animate-fade-in">
                <span className="text-2xl font-bold animate-fade-in">
                  {typeof metric.value === 'number' ? 
                    metric.value % 1 === 0 ? metric.value : metric.value.toFixed(1)
                    : metric.value
                  }
                </span>
                <span className="text-sm opacity-75 animate-fade-in">{metric.unit}</span>
              </div>

              {/* Description étendue */}
              {selectedMetric === metric.id && (
                <div
                  className="mt-3 pt-3 border-t border-current border-opacity-20 animate-fade-in"
                >
                  <p className="text-xs opacity-75 animate-fade-in">{metric.description}</p>
                  {visibility === 'expert' && (
                    <div className="mt-2 space-y-1 animate-fade-in">
                      <div className="text-xs opacity-60 animate-fade-in">
                        Seuil optimal: {getOptimalThreshold(metric.id)}
                      </div>
                      <div className="text-xs opacity-60 animate-fade-in">
                        Tendance: {getTrendAnalysis(metric)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Résumé global pour mode expert */}
        {visibility === 'expert' && (
          <div
            className="mt-6 p-4 bg-gray-50 rounded-lg animate-fade-in"
          >
            <h4 className="font-medium text-gray-900 mb-3 animate-fade-in">📈 Analyse Globale</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm animate-fade-in">
              <div>
                <span className="font-medium animate-fade-in">Score de Performance:</span>
                <span className="ml-2 animate-fade-in">{calculatePerformanceScore(metrics)}%</span>
              </div>
              <div>
                <span className="font-medium animate-fade-in">Efficacité A2A:</span>
                <span className="ml-2 animate-fade-in">{calculateA2AEfficiency(metrics)}%</span>
              </div>
              <div>
                <span className="font-medium animate-fade-in">Engagement Utilisateur:</span>
                <span className="ml-2 animate-fade-in">{calculateUserEngagement(metrics)}%</span>
              </div>
              <div>
                <span className="font-medium animate-fade-in">Qualité Adaptive:</span>
                <span className="ml-2 animate-fade-in">{calculateAdaptiveQuality(metrics)}%</span>
              </div>
            </div>
            
            {/* Recommandations */}
            <div className="mt-4 animate-fade-in">
              <h5 className="font-medium text-gray-900 mb-2 animate-fade-in">💡 Recommandations</h5>
              <ul className="space-y-1 text-sm text-gray-600 animate-fade-in">
                {generateRecommendations(metrics).map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2 animate-fade-in">
                    <span className="text-blue-500 mt-0.5 animate-fade-in">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 🔧 FONCTIONS UTILITAIRES

function getOptimalThreshold(metricId: string): string {
  const thresholds: Record<string, string> = {
    'response_time': '< 1500ms',
    'interaction_frequency': '> 2/min',
    'content_relevance': '> 80%',
    'collaboration_activity': '> 70%',
    'notification_efficiency': '> 85%',
    'a2a_messages': 'Variable'
  };
  return thresholds[metricId] || 'N/A';
}

function getTrendAnalysis(metric: MetricCard): string {
  switch (metric.trend) {
    case 'up': return 'En amélioration';
    case 'down': return 'En dégradation';
    case 'stable': return 'Stable';
    default: return 'Non déterminée';
  }
}

function calculatePerformanceScore(metrics: RealTimeMetrics): number {
  const responseScore = Math.max(0, 100 - (metrics.responseTime / 30)); // 30ms = 1 point
  const efficiencyScore = metrics.notificationEfficiency;
  return Math.round((responseScore + efficiencyScore) / 2);
}

function calculateA2AEfficiency(metrics: RealTimeMetrics): number {
  const messageScore = Math.min(100, metrics.a2aMessageCount * 10);
  const collaborationScore = metrics.collaborationActivity;
  return Math.round((messageScore + collaborationScore) / 2);
}

function calculateUserEngagement(metrics: RealTimeMetrics): number {
  const interactionScore = Math.min(100, metrics.interactionFrequency * 30);
  const relevanceScore = metrics.contentRelevance;
  return Math.round((interactionScore + relevanceScore) / 2);
}

function calculateAdaptiveQuality(metrics: RealTimeMetrics): number {
  return Math.round((metrics.contentRelevance + metrics.notificationEfficiency) / 2);
}

function generateRecommendations(metrics: RealTimeMetrics): string[] {
  const recommendations: string[] = [];
  
  if (metrics.responseTime > 2000) {
    recommendations.push('Optimiser les temps de réponse du système');
  }
  
  if (metrics.interactionFrequency < 1) {
    recommendations.push('Encourager plus d\'interactions utilisateur');
  }
  
  if (metrics.contentRelevance < 70) {
    recommendations.push('Améliorer l\'adaptation du contenu');
  }
  
  if (metrics.collaborationActivity < 50) {
    recommendations.push('Promouvoir les collaborations entre experts');
  }
  
  if (metrics.notificationEfficiency < 80) {
    recommendations.push('Optimiser la pertinence des notifications');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Performances optimales - Continuer le monitoring');
  }
  
  return recommendations;
}

export default RealTimeMetricsDisplay;
