import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, RefreshCw, TrendingUp, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ebiosCoherenceService, type CoherenceCheckResult } from '@/services/ai/EbiosCoherenceService';
import MetricTooltip from '@/components/ui/MetricTooltip';

interface AICoherenceIndicatorProps {
  missionId: string;
  workshop?: 1 | 2 | 3 | 4 | 5 | 'global';
  entityType?: 'businessValue' | 'dreadedEvent' | 'supportingAsset' | 'riskSource' | 'stakeholder' | 'attackPath' | 'securityMeasure' | 'strategicScenario';
  entityId?: string;
  data?: any;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onCoherenceUpdate?: (result: CoherenceCheckResult) => void;
  className?: string;
}

const AICoherenceIndicator: React.FC<AICoherenceIndicatorProps> = ({
  missionId,
  workshop = 'global',
  entityType,
  entityId,
  data,
  size = 'md',
  showDetails = true,
  autoRefresh = false,
  refreshInterval = 60000, // 1 minute
  onCoherenceUpdate,
  className
}) => {
  const [coherenceResult, setCoherenceResult] = useState<CoherenceCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    checkCoherence();

    if (autoRefresh) {
      const interval = setInterval(checkCoherence, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [missionId, workshop, entityType, entityId, data]);

  const checkCoherence = async () => {
    setIsLoading(true);
    try {
      let result: CoherenceCheckResult;

      // 🔧 CORRECTION: Données par défaut sécurisées
      const safeData = {
        mission: data?.mission || null,
        businessValues: data?.businessValues || [],
        supportingAssets: data?.supportingAssets || [],
        dreadedEvents: data?.dreadedEvents || [],
        riskSources: data?.riskSources || [],
        stakeholders: data?.stakeholders || [],
        attackPaths: data?.attackPaths || [],
        strategicScenarios: data?.strategicScenarios || [],
        operationalScenarios: data?.operationalScenarios || [],
        securityMeasures: data?.securityMeasures || [],
        ...data
      };

      if (workshop === 'global') {
        // Cohérence globale de la mission
        result = await ebiosCoherenceService.checkMissionCoherence(missionId, safeData);
      } else if (entityType && entityId) {
        // Cohérence d'une entité spécifique
        result = await ebiosCoherenceService.checkEntityCoherence(
          entityType,
          entityId,
          safeData
        );
      } else {
        // Cohérence d'un atelier
        result = await ebiosCoherenceService.checkWorkshopCoherence(
          workshop,
          missionId,
          safeData
        );
      }

      setCoherenceResult(result);
      
      if (onCoherenceUpdate) {
        onCoherenceUpdate(result);
      }
    } catch (error) {
      console.error('Erreur vérification cohérence:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 0.9) return 'text-green-600';
    if (score >= 0.7) return 'text-yellow-600';
    if (score >= 0.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 0.9) return 'bg-green-100';
    if (score >= 0.7) return 'bg-yellow-100';
    if (score >= 0.5) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 0.9) return <CheckCircle className="h-4 w-4" />;
    if (score >= 0.5) return <Info className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  const sizeClasses = {
    sm: 'text-xs p-1',
    md: 'text-sm p-2',
    lg: 'text-base p-3'
  };

  if (!coherenceResult && !isLoading) {
    return null;
  }

  const score = coherenceResult?.overallScore || 0;
  const scorePercent = Math.round(score * 100);

  return (
    <div className={cn('relative inline-flex items-center', className)}>
      {/* Indicateur principal */}
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg transition-all cursor-pointer',
          sizeClasses[size],
          getScoreBgColor(score),
          'hover:shadow-md'
        )}
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Icône IA */}
        <Bot className={cn('h-4 w-4', getScoreColor(score))} />
        
        {/* Score */}
        {isLoading ? (
          <RefreshCw className="h-4 w-4 animate-spin text-gray-500" />
        ) : (
          <>
            <span className={cn('font-semibold', getScoreColor(score))}>
              {scorePercent}%
            </span>
            {getScoreIcon(score)}
          </>
        )}

        {/* Label optionnel avec bulle d'aide */}
        {size !== 'sm' && (
          <div className="flex items-center gap-1">
            <span className="text-gray-600 text-xs">
              Cohérence
            </span>
            <MetricTooltip
              metricType="conformity"
              workshop={typeof workshop === 'number' ? workshop : undefined}
              value={scorePercent}
              className="ml-1"
            />
          </div>
        )}
      </div>

      {/* Tooltip détaillé */}
      {showDetails && showTooltip && coherenceResult && (
        <div className="absolute z-50 bottom-full mb-2 left-0 w-80 bg-white rounded-lg shadow-xl border p-4">
          <div className="space-y-3">
            {/* En-tête */}
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Bot className="h-4 w-4 text-blue-600" />
                Analyse de Cohérence IA
              </h4>
              <span className={cn('font-bold', getScoreColor(score))}>
                {scorePercent}%
              </span>
            </div>

            {/* Statut de conformité */}
            <div className={cn(
              'p-2 rounded-md text-sm',
              coherenceResult.isCompliant ? 'bg-green-50' : 'bg-red-50'
            )}>
              <div className="flex items-center gap-2">
                {coherenceResult.isCompliant ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-800">Conforme EBIOS RM</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-red-800">Non conforme EBIOS RM</span>
                  </>
                )}
              </div>
            </div>

            {/* Scores détaillés */}
            {coherenceResult.workshopScores && (
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-gray-700">Scores par atelier :</h5>
                <div className="space-y-1">
                  {Object.entries(coherenceResult.workshopScores).map(([workshop, wsScore]) => {
                    const score = typeof wsScore === 'number' ? wsScore : 0;
                    return (
                      <div key={workshop} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Atelier {workshop}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={cn('h-full transition-all', 
                                score >= 0.9 ? 'bg-green-500' :
                                score >= 0.7 ? 'bg-yellow-500' :
                                score >= 0.5 ? 'bg-orange-500' :
                                'bg-red-500'
                              )}
                              style={{ width: `${score * 100}%` }}
                            />
                          </div>
                          <span className={cn('font-medium', getScoreColor(score))}>
                            {Math.round(score * 100)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Problèmes critiques */}
            {coherenceResult.criticalIssues.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-red-700">
                  ⚠️ Problèmes critiques ({coherenceResult.criticalIssues.length})
                </h5>
                <ul className="space-y-1 max-h-32 overflow-y-auto">
                  {coherenceResult.criticalIssues.slice(0, 3).map((issue, idx) => (
                    <li key={idx} className="text-xs text-red-600 flex items-start gap-1">
                      <span className="text-red-400">•</span>
                      <span>{issue.message}</span>
                    </li>
                  ))}
                  {coherenceResult.criticalIssues.length > 3 && (
                    <li className="text-xs text-red-600 italic">
                      +{coherenceResult.criticalIssues.length - 3} autres problèmes...
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Recommandations */}
            {coherenceResult.recommendations.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-medium text-blue-700 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Recommandations IA
                </h5>
                <ul className="space-y-1">
                  {coherenceResult.recommendations.slice(0, 3).map((rec, idx) => (
                    <li key={idx} className="text-xs text-blue-600 flex items-start gap-1">
                      <span className="text-blue-400">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions suggérées */}
            {coherenceResult.suggestedActions && coherenceResult.suggestedActions.length > 0 && (
              <div className="pt-2 border-t">
                <button
                  className="w-full text-xs bg-blue-600 text-white rounded px-3 py-1.5 hover:bg-blue-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implémenter l'application des suggestions
                    console.log('Appliquer les suggestions:', coherenceResult.suggestedActions);
                  }}
                >
                  Appliquer {coherenceResult.suggestedActions.length} suggestion{coherenceResult.suggestedActions.length > 1 ? 's' : ''}
                </button>
              </div>
            )}

            {/* Bouton de rafraîchissement */}
            <div className="pt-2 border-t flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Dernière vérification : {new Date().toLocaleTimeString('fr-FR')}
              </span>
              <button
                className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  checkCoherence();
                }}
              >
                <RefreshCw className="h-3 w-3" />
                Actualiser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Badge de mise à jour automatique */}
      {autoRefresh && size !== 'sm' && (
        <div className="absolute -top-1 -right-1">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default AICoherenceIndicator; 