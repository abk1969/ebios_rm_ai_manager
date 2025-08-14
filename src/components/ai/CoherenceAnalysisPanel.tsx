/**
 * 🎨 PANNEAU D'ANALYSE DE COHÉRENCE IA
 * Interface utilisateur optimisée pour l'analyse de cohérence EBIOS RM
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Badge, 
  Button, 
  Progress, 
  Alert, 
  AlertDescription 
} from '@/components/ui';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  TrendingUp,
  Eye,
  Lightbulb
} from 'lucide-react';
import { ModelCoherenceValidator, CoherenceAnalysis, CoherenceIssue } from '../../services/ModelCoherenceValidator';
import { Mission } from '../../types/ebios';

interface CoherenceAnalysisPanelProps {
  mission: Mission;
  onAnalysisComplete?: (analysis: CoherenceAnalysis) => void;
  className?: string;
}

export const CoherenceAnalysisPanel: React.FC<CoherenceAnalysisPanelProps> = ({
  mission,
  onAnalysisComplete,
  className = ''
}) => {
  const [analysis, setAnalysis] = useState<CoherenceAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Analyse automatique au chargement
  useEffect(() => {
    if (mission) {
      runAnalysis();
    }
  }, [mission]);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const result = await ModelCoherenceValidator.analyzeMissionCoherence(mission);
      setAnalysis(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'analyse');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' => {
    if (score >= 70) return 'default';
    if (score >= 50) return 'secondary';
    return 'destructive';
  };

  const getSeverityIcon = (severity: CoherenceIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCoherenceStatusText = (status: string): string => {
    switch (status) {
      case 'consistent':
        return 'Cohérent';
      case 'mostly_consistent':
        return 'Majoritairement cohérent';
      case 'needs_review':
        return 'À réviser';
      case 'missing_data':
        return 'Données manquantes';
      default:
        return 'Inconnu';
    }
  };

  const getCoherenceStatusColor = (status: string): string => {
    switch (status) {
      case 'consistent':
        return 'text-green-600';
      case 'mostly_consistent':
        return 'text-yellow-600';
      case 'needs_review':
        return 'text-orange-600';
      case 'missing_data':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (error) {
    return (
      <Card className={`border-red-200 ${className}`}>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Erreur d'analyse de cohérence : {error}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={runAnalysis} 
            className="mt-4"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            Analyse de Cohérence IA
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="ghost"
              size="sm"
              aria-label={showDetails ? "Masquer les détails" : "Afficher les détails"}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              variant="outline"
              size="sm"
              aria-label="Relancer l'analyse"
            >
              <RefreshCw className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isAnalyzing ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">Analyse en cours...</span>
            </div>
            <Progress value={undefined} className="w-full" />
          </div>
        ) : analysis ? (
          <>
            {/* Score Global */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Score Global de Cohérence</h3>
                <p className="text-sm text-gray-600">Évaluation globale de la mission</p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                  {analysis.overall_score}/100
                </div>
                <Badge variant={getScoreBadgeVariant(analysis.overall_score)}>
                  {analysis.overall_score >= 85 ? 'Excellent' :
                   analysis.overall_score >= 70 ? 'Bon' :
                   analysis.overall_score >= 50 ? 'Moyen' : 'Faible'}
                </Badge>
              </div>
            </div>

            {/* Scores par Workshop */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Scores par Workshop</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(analysis.workshop_scores).map(([workshop, score]) => (
                  <div key={workshop} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">
                        {workshop.replace('workshop', 'Atelier ')}
                      </span>
                      <span className={`font-semibold ${getScoreColor(score)}`}>
                        {score}/100
                      </span>
                    </div>
                    <Progress value={score} className="mt-2 h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Problèmes Identifiés */}
            {analysis.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                  Problèmes Identifiés ({analysis.issues.length})
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {analysis.issues.slice(0, 5).map((issue, index) => (
                    <Alert key={index} variant="default" className="py-2">
                      <div className="flex items-start space-x-2">
                        {getSeverityIcon(issue.severity)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{issue.description}</p>
                          {issue.workshop && (
                            <p className="text-xs text-gray-500 mt-1">
                              {issue.workshop.replace('workshop', 'Atelier ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </Alert>
                  ))}
                  {analysis.issues.length > 5 && (
                    <p className="text-xs text-gray-500 text-center">
                      ... et {analysis.issues.length - 5} autre(s) problème(s)
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Recommandations */}
            {analysis.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                  Recommandations ({analysis.recommendations.length})
                </h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {analysis.recommendations.slice(0, 3).map((recommendation, index) => (
                    <div key={index} className="text-sm text-gray-700 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                      {recommendation}
                    </div>
                  ))}
                  {analysis.recommendations.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      ... et {analysis.recommendations.length - 3} autre(s) recommandation(s)
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Détails Avancés */}
            {showDetails && (
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-gray-900">Analyse Inter-Workshops</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(analysis.cross_workshop_analysis).map(([relation, status]) => (
                    <div key={relation} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {relation.replace(/_/g, ' → ').replace(/to/g, '→')}
                        </span>
                        <span className={`text-sm font-semibold ${getCoherenceStatusColor(status)}`}>
                          {getCoherenceStatusText(status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium text-gray-900">Vérifications de Cohérence</h5>
                  <div className="space-y-1">
                    {Object.entries(analysis.consistency_checks).map(([check, passed]) => (
                      <div key={check} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">
                          {check.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        {passed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucune analyse disponible</p>
            <Button onClick={runAnalysis} className="mt-4" variant="outline">
              Lancer l'analyse
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CoherenceAnalysisPanel;
