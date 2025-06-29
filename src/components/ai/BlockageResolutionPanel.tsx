/**
 * 🎯 COMPOSANT PANNEAU DE RÉSOLUTION DES BLOCAGES
 * Interface utilisateur pour afficher et résoudre les blocages détectés automatiquement
 * 
 * CARACTÉRISTIQUES :
 * - Détection automatique des blocages
 * - Solutions étape par étape
 * - Actions automatisées quand possible
 * - Interface intuitive et non-intrusive
 * - Intégration sans régression avec l'architecture existante
 */

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  ArrowRight,
  Play,
  Eye,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Target,
  Link,
  HelpCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BlockageDetectionService, { 
  BlockageAnalysis, 
  BlockageDetection, 
  BlockageSolution,
  BlockageType,
  BlockageSeverity
} from '@/services/ai/BlockageDetectionService';

// 🎯 TYPES ET INTERFACES
interface BlockageResolutionPanelProps {
  missionId: string;
  currentWorkshop: number;
  workshopData?: any;
  userContext?: any;
  className?: string;
  onSolutionApply?: (solution: BlockageSolution) => void;
  onBlockageResolved?: (blockageId: string) => void;
}

interface BlockageWithState extends BlockageDetection {
  expanded: boolean;
  resolved: boolean;
  solutionInProgress: boolean;
}

// 🎯 COMPOSANT PRINCIPAL
const BlockageResolutionPanel: React.FC<BlockageResolutionPanelProps> = ({
  missionId,
  currentWorkshop,
  workshopData,
  userContext,
  className = '',
  onSolutionApply,
  onBlockageResolved
}) => {
  const [analysis, setAnalysis] = useState<BlockageAnalysis | null>(null);
  const [blockagesWithState, setBlockagesWithState] = useState<BlockageWithState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const blockageService = BlockageDetectionService.getInstance();

  // 🎯 CHARGEMENT DE L'ANALYSE
  useEffect(() => {
    const loadAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        const blockageAnalysis = await blockageService.analyzeBlockages(
          missionId,
          currentWorkshop,
          workshopData,
          userContext
        );

        setAnalysis(blockageAnalysis);
        
        // Transformation des blocages avec état
        const blockagesWithState: BlockageWithState[] = blockageAnalysis.blockages.map(blockage => ({
          ...blockage,
          expanded: blockage.severity === BlockageSeverity.HIGH || blockage.severity === BlockageSeverity.CRITICAL,
          resolved: false,
          solutionInProgress: false
        }));

        setBlockagesWithState(blockagesWithState);
      } catch (err) {
        console.error('🚨 Erreur lors de l\'analyse des blocages:', err);
        setError('Impossible d\'analyser les blocages');
      } finally {
        setLoading(false);
      }
    };

    if (missionId) {
      loadAnalysis();
    }
  }, [missionId, currentWorkshop, workshopData, userContext]);

  // 🎯 AUTO-REFRESH
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(async () => {
      if (!loading && missionId) {
        const newAnalysis = await blockageService.analyzeBlockages(
          missionId,
          currentWorkshop,
          workshopData,
          userContext
        );
        
        // Mise à jour seulement si il y a des changements
        if (JSON.stringify(newAnalysis.blockages) !== JSON.stringify(analysis?.blockages)) {
          setAnalysis(newAnalysis);
          
          const updatedBlockages = newAnalysis.blockages.map(blockage => {
            const existing = blockagesWithState.find(b => b.id === blockage.id);
            return {
              ...blockage,
              expanded: existing?.expanded || blockage.severity === BlockageSeverity.HIGH || blockage.severity === BlockageSeverity.CRITICAL,
              resolved: existing?.resolved || false,
              solutionInProgress: existing?.solutionInProgress || false
            };
          });
          
          setBlockagesWithState(updatedBlockages);
        }
      }
    }, 30000); // Refresh toutes les 30 secondes

    return () => clearInterval(interval);
  }, [autoRefresh, loading, missionId, currentWorkshop, workshopData, userContext, analysis, blockagesWithState]);

  // 🎯 GESTION DES ACTIONS
  const handleToggleExpansion = (blockageId: string) => {
    setBlockagesWithState(prev => prev.map(blockage => 
      blockage.id === blockageId 
        ? { ...blockage, expanded: !blockage.expanded }
        : blockage
    ));
  };

  const handleApplySolution = async (solution: BlockageSolution) => {
    const blockage = blockagesWithState.find(b => b.id === solution.blockageId);
    if (!blockage) return;

    // Marquer la solution en cours
    setBlockagesWithState(prev => prev.map(b => 
      b.id === solution.blockageId 
        ? { ...b, solutionInProgress: true }
        : b
    ));

    try {
      if (onSolutionApply) {
        await onSolutionApply(solution);
      }

      // Marquer comme résolu
      setBlockagesWithState(prev => prev.map(b => 
        b.id === solution.blockageId 
          ? { ...b, resolved: true, solutionInProgress: false }
          : b
      ));

      if (onBlockageResolved) {
        onBlockageResolved(solution.blockageId);
      }

      // Recharger l'analyse après résolution
      setTimeout(() => {
        window.location.reload(); // Simple refresh pour voir les changements
      }, 1000);

    } catch (error) {
      console.error('Erreur lors de l\'application de la solution:', error);
      setBlockagesWithState(prev => prev.map(b => 
        b.id === solution.blockageId 
          ? { ...b, solutionInProgress: false }
          : b
      ));
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const newAnalysis = await blockageService.analyzeBlockages(
        missionId,
        currentWorkshop,
        workshopData,
        userContext
      );
      setAnalysis(newAnalysis);
      
      const refreshedBlockages = newAnalysis.blockages.map(blockage => ({
        ...blockage,
        expanded: false,
        resolved: false,
        solutionInProgress: false
      }));
      
      setBlockagesWithState(refreshedBlockages);
    } catch {
      setError('Erreur lors du rafraîchissement');
    } finally {
      setLoading(false);
    }
  };

  // 🎯 UTILITAIRES
  const getBlockageIcon = (type: BlockageType) => {
    switch (type) {
      case BlockageType.DATA_MISSING: return AlertTriangle;
      case BlockageType.VALIDATION_FAILED: return X;
      case BlockageType.CONCEPTUAL_CONFUSION: return HelpCircle;
      case BlockageType.WORKFLOW_STUCK: return Clock;
      case BlockageType.TECHNICAL_ERROR: return Zap;
      case BlockageType.USER_INACTIVITY: return Clock;
      case BlockageType.INCONSISTENT_DATA: return Link;
      case BlockageType.MISSING_LINKS: return Target;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity: BlockageSeverity) => {
    switch (severity) {
      case BlockageSeverity.CRITICAL: return 'bg-red-100 border-red-300 text-red-800';
      case BlockageSeverity.HIGH: return 'bg-orange-100 border-orange-300 text-orange-800';
      case BlockageSeverity.MEDIUM: return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case BlockageSeverity.LOW: return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'blocked': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 bg-gray-300 rounded"></div>
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
          </div>
          <div className="h-16 bg-gray-200 rounded-lg"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-4 border-red-200 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
  }

  if (!analysis || analysis.blockages.length === 0) {
    return (
      <Card className={`p-4 border-green-200 bg-green-50 ${className}`}>
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-medium">Aucun blocage détecté</span>
          <Badge variant="outline" className="text-green-700 border-green-300">
            Progression fluide
          </Badge>
        </div>
      </Card>
    );
  }

  const unresolvedBlockages = blockagesWithState.filter(b => !b.resolved);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* En-tête du panneau */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h3 className="text-sm font-medium text-gray-900">
              Résolution des Blocages
            </h3>
            <Badge 
              variant="outline" 
              className={`text-xs ${getStatusColor(analysis.overallStatus)}`}
            >
              {unresolvedBlockages.length} blocage{unresolvedBlockages.length > 1 ? 's' : ''}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`p-1 ${autoRefresh ? 'text-green-600' : 'text-gray-400'}`}
            >
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1"
            >
              {isMinimized ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Recommandations globales */}
        {!isMinimized && analysis.recommendations.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <h4 className="text-xs font-medium text-blue-800 mb-2">Recommandations:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index}>• {recommendation}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Liste des blocages */}
      {!isMinimized && (
        <div className="space-y-3">
          {unresolvedBlockages.map((blockage) => {
            const Icon = getBlockageIcon(blockage.type);
            const solution = analysis.solutions.find(s => s.blockageId === blockage.id);

            return (
              <Card 
                key={blockage.id} 
                className={`border-2 ${getSeverityColor(blockage.severity)}`}
              >
                <div className="p-4">
                  {/* En-tête du blocage */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="p-2 rounded-lg bg-white bg-opacity-50">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium mb-1">
                          {blockage.title}
                        </h4>
                        <p className="text-sm opacity-90 mb-2">
                          {blockage.description}
                        </p>
                        
                        {/* Métriques */}
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Atelier {blockage.workshop}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Confiance: {blockage.confidence}%
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {blockage.severity}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-1 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleExpansion(blockage.id)}
                        className="p-1"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Détails du blocage (expandable) */}
                  {blockage.expanded && (
                    <div className="mt-4 p-3 bg-white bg-opacity-50 rounded-lg">
                      <h5 className="text-xs font-medium mb-2">Indicateurs détectés:</h5>
                      <ul className="text-xs space-y-1 mb-3">
                        {blockage.indicators.map((indicator, index) => (
                          <li key={index}>• {indicator}</li>
                        ))}
                      </ul>
                      
                      {blockage.context.timeSpent > 0 && (
                        <div className="text-xs">
                          <span className="font-medium">Temps passé:</span>
                          <span className="ml-1">{Math.round(blockage.context.timeSpent / 60000)} minutes</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Solution proposée */}
                  {solution && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Lightbulb className="h-4 w-4 text-green-600" />
                          <h5 className="text-sm font-medium text-green-800">
                            {solution.title}
                          </h5>
                        </div>
                        <Badge variant="outline" className="text-xs text-green-700 border-green-300">
                          {solution.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-green-700 mb-3">
                        {solution.description}
                      </p>
                      
                      {/* Étapes de la solution */}
                      <div className="mb-3">
                        <h6 className="text-xs font-medium text-green-800 mb-1">Étapes:</h6>
                        <ol className="text-xs text-green-700 space-y-1">
                          {solution.steps.map((step, index) => (
                            <li key={index}>{index + 1}. {step}</li>
                          ))}
                        </ol>
                      </div>
                      
                      {/* Actions de solution */}
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-green-600">
                          Temps estimé: {solution.estimatedTime}
                        </div>
                        
                        <Button
                          size="sm"
                          onClick={() => handleApplySolution(solution)}
                          disabled={blockage.solutionInProgress}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {blockage.solutionInProgress ? (
                            <>
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              En cours...
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3 mr-1" />
                              {solution.automated ? 'Corriger automatiquement' : 'Appliquer la solution'}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Actions suivantes */}
      {!isMinimized && analysis.nextActions.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Prochaines actions recommandées:</h4>
          <div className="space-y-2">
            {analysis.nextActions.slice(0, 3).map((action, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm text-blue-700">
                <ArrowRight className="h-3 w-3" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default BlockageResolutionPanel;
