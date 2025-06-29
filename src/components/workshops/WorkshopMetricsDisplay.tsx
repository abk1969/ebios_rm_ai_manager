/**
 * 📊 AFFICHAGE MÉTRIQUES WORKSHOP - TRANSPARENCE TOTALE
 * Composant pour afficher les métriques avec explications détaillées
 * CONFORMITÉ ANSSI: Calculs traçables et expliqués
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, Calculator, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import MetricTooltip from '@/components/ui/MetricTooltip';
import EbiosRMMetricsService, { EbiosRMMetrics } from '@/services/metrics/EbiosRMMetricsService';

interface WorkshopMetricsDisplayProps {
  workshopNumber: 1 | 2 | 3 | 4 | 5;
  missionId: string;
  className?: string;
}

interface MetricDisplayItem {
  label: string;
  value: number;
  type: 'completion' | 'conformity' | 'coverage' | 'quality';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  description: string;
}

/**
 * Composant d'affichage des métriques avec bulles d'aide
 */
export const WorkshopMetricsDisplay: React.FC<WorkshopMetricsDisplayProps> = ({
  workshopNumber,
  missionId,
  className
}) => {
  const [metrics, setMetrics] = useState<EbiosRMMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, [missionId, workshopNumber]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      console.log(`📊 Chargement métriques Workshop ${workshopNumber} pour mission: ${missionId}`);
      
      const metricsData = await EbiosRMMetricsService.calculateMetrics(missionId);
      setMetrics(metricsData);
      
      console.log(`✅ Métriques Workshop ${workshopNumber} chargées:`, metricsData);
    } catch (error) {
      console.error(`❌ Erreur chargement métriques Workshop ${workshopNumber}:`, error);
      setError('Erreur de chargement des métriques');
    } finally {
      setLoading(false);
    }
  };

  const getMetricStatus = (value: number): 'excellent' | 'good' | 'warning' | 'critical' => {
    if (value >= 90) return 'excellent';
    if (value >= 70) return 'good';
    if (value >= 50) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4" />;
      case 'good': return <Info className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getWorkshopMetrics = (): MetricDisplayItem[] => {
    if (!metrics) return [];

    switch (workshopNumber) {
      case 1:
        return [
          {
            label: 'Terminé',
            value: metrics.workshop1.completionRate,
            type: 'completion',
            status: getMetricStatus(metrics.workshop1.completionRate),
            description: 'Pourcentage d\'achèvement selon critères ANSSI'
          },
          {
            label: 'Cohérence',
            value: metrics.workshop1.conformityScore,
            type: 'conformity',
            status: getMetricStatus(metrics.workshop1.conformityScore),
            description: 'Score de conformité méthodologique ANSSI'
          }
        ];
      
      case 2:
        return [
          {
            label: 'Terminé',
            value: metrics.workshop2.completionRate,
            type: 'completion',
            status: getMetricStatus(metrics.workshop2.completionRate),
            description: 'Avancement identification sources de risque'
          },
          {
            label: 'Couverture MITRE',
            value: metrics.workshop2.mitreAttackCoverage,
            type: 'coverage',
            status: getMetricStatus(metrics.workshop2.mitreAttackCoverage),
            description: 'Pourcentage techniques MITRE ATT&CK couvertes'
          }
        ];
      
      case 3:
        return [
          {
            label: 'Terminé',
            value: metrics.workshop3.completionRate,
            type: 'completion',
            status: getMetricStatus(metrics.workshop3.completionRate),
            description: 'Avancement scénarios stratégiques'
          }
        ];
      
      case 4:
        return [
          {
            label: 'Terminé',
            value: metrics.workshop4.completionRate,
            type: 'completion',
            status: getMetricStatus(metrics.workshop4.completionRate),
            description: 'Avancement scénarios opérationnels'
          },
          {
            label: 'Profondeur Technique',
            value: metrics.workshop4.technicalDepth,
            type: 'quality',
            status: getMetricStatus(metrics.workshop4.technicalDepth),
            description: 'Niveau de détail technique des scénarios'
          }
        ];
      
      case 5:
        return [
          {
            label: 'Terminé',
            value: metrics.workshop5.completionRate,
            type: 'completion',
            status: getMetricStatus(metrics.workshop5.completionRate),
            description: 'Avancement traitement du risque'
          },
          {
            label: 'Couverture Traitement',
            value: metrics.workshop5.treatmentCoverage,
            type: 'coverage',
            status: getMetricStatus(metrics.workshop5.treatmentCoverage),
            description: 'Pourcentage de risques traités'
          }
        ];
      
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="animate-pulse flex space-x-2">
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className={cn('flex items-center gap-2 text-red-600', className)}>
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm">Erreur métriques</span>
      </div>
    );
  }

  const workshopMetrics = getWorkshopMetrics();

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {workshopMetrics.map((metric, index) => (
        <div
          key={index}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg border transition-all hover:shadow-sm',
            getStatusColor(metric.status)
          )}
        >
          {/* Icône de statut */}
          {getStatusIcon(metric.status)}
          
          {/* Valeur et label */}
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm">
              {metric.value}%
            </span>
            <span className="text-xs opacity-75">
              {metric.label}
            </span>
            
            {/* Bulle d'aide explicative */}
            <MetricTooltip
              metricType={metric.type}
              workshop={workshopNumber}
              value={metric.value}
              className="ml-1"
            />
          </div>
        </div>
      ))}
      
      {/* Indicateur de mise à jour */}
      <button
        onClick={loadMetrics}
        className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        title="Actualiser les métriques"
      >
        <TrendingUp className="h-3 w-3" />
        <span>Actualiser</span>
      </button>
    </div>
  );
};

export default WorkshopMetricsDisplay;
