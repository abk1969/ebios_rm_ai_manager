import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Lightbulb, 
  Target,
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  Users
} from 'lucide-react';
import type { SecurityMeasure, StrategicScenario } from '@/types/ebios';
import { EbiosUtils } from '@/lib/ebios-constants';

interface AIValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  measure?: SecurityMeasure; // 🔧 CORRECTION: Optionnel pour compatibilité
  securityMeasures?: SecurityMeasure[]; // 🔧 CORRECTION: Propriété manquante
  scenarios?: StrategicScenario[]; // 🔧 CORRECTION: Optionnel
  strategicScenarios?: StrategicScenario[]; // 🔧 CORRECTION: Alias
  allMeasures?: SecurityMeasure[]; // 🔧 CORRECTION: Optionnel
  onUpdateMeasures?: (updatedMeasures: any) => void; // 🔧 CORRECTION: Propriété manquante
  onApplyRecommendations?: (recommendations: any) => void;
}

interface ValidationIssue {
  type: 'error' | 'warning' | 'suggestion';
  category: string;
  title: string;
  description: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
}

interface CoherenceAnalysis {
  overallScore: number;
  issues: ValidationIssue[];
  recommendations: {
    priority?: number;
    effectiveness?: number;
    implementationCost?: number;
    alternativeMeasures?: string[];
    synergies?: string[];
    dependencies?: string[];
  };
  strategicAlignment: {
    scenarioCoverage: number;
    riskMitigationPotential: number;
    implementationFeasibility: number;
  };
}

export default function AIValidationModal({
  isOpen,
  onClose,
  measure,
  securityMeasures, // 🔧 CORRECTION: Nouvelle propriété
  scenarios,
  strategicScenarios, // 🔧 CORRECTION: Alias
  allMeasures,
  onUpdateMeasures, // 🔧 CORRECTION: Nouvelle propriété
  onApplyRecommendations
}: AIValidationModalProps) {
  const [analysis, setAnalysis] = useState<CoherenceAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userFeedback, setUserFeedback] = useState('');

  useEffect(() => {
    if (isOpen && measure) {
      performCoherenceAnalysis();
    }
  }, [isOpen, measure, scenarios, strategicScenarios, allMeasures, securityMeasures]);

  const performCoherenceAnalysis = async () => {
    setIsAnalyzing(true);

    // 🔧 CORRECTION: Utilisation des propriétés avec fallbacks
    const scenariosToUse = scenarios || strategicScenarios || [];
    const measuresToUse = allMeasures || securityMeasures || [];
    const measureToAnalyze = measure || (securityMeasures && securityMeasures[0]);

    if (!measureToAnalyze) {
      setIsAnalyzing(false);
      return;
    }

    // Simulation d'une analyse IA approfondie
    await new Promise(resolve => setTimeout(resolve, 2000));

    const targetedScenarios = scenariosToUse.filter(s =>
      measureToAnalyze.targetedScenarios?.includes(s.id)
    );
    
    const issues: ValidationIssue[] = [];
    const recommendations: any = {};

    // Analyse de cohérence - Priorité vs Efficacité
    if (measureToAnalyze.priority === 1 && measureToAnalyze.effectiveness < 3) {
      issues.push({
        type: 'warning',
        category: 'Cohérence Priorité/Efficacité',
        title: 'Incohérence entre priorité critique et efficacité modérée',
        description: 'Une mesure classée priorité 1 (critique) devrait avoir une efficacité élevée (3-4)',
        recommendation: 'Augmenter l\'efficacité à 3 ou 4, ou réduire la priorité à 2',
        impact: 'medium'
      });
    }

    // Analyse de cohérence - Coût vs Complexité
    const costNum = typeof measureToAnalyze.implementationCost === 'string' ?
      (measureToAnalyze.implementationCost === 'low' ? 1 : measureToAnalyze.implementationCost === 'medium' ? 2 :
       measureToAnalyze.implementationCost === 'high' ? 3 : 4) : 2;
    if (Math.abs(costNum - (measureToAnalyze.implementationComplexity || 2)) > 2) {
      issues.push({
        type: 'suggestion',
        category: 'Cohérence Coût/Complexité',
        title: 'Écart important entre coût et complexité',
        description: 'Le coût et la complexité devraient généralement être alignés',
        recommendation: 'Réviser l\'évaluation du coût ou de la complexité pour plus de cohérence',
        impact: 'low'
      });
    }

    // Analyse de couverture des scénarios
    const highRiskScenarios = scenariosToUse.filter(s => EbiosUtils.compareRiskLevel(s.riskLevel, 3, '>='));
    const coveredHighRiskScenarios = targetedScenarios.filter(s => EbiosUtils.compareRiskLevel(s.riskLevel, 3, '>='));
    
    if (highRiskScenarios.length > 0 && coveredHighRiskScenarios.length === 0) {
      issues.push({
        type: 'warning',
        category: 'Couverture Risques',
        title: 'Aucun scénario à risque élevé couvert',
        description: 'Cette mesure ne cible aucun scénario à risque élevé (3-4)',
        recommendation: 'Considérer d\'inclure au moins un scénario à risque élevé',
        impact: 'high'
      });
    }

    // Analyse des synergies avec d'autres mesures
    const relatedMeasures = measuresToUse.filter(m =>
      m.id !== measureToAnalyze.id &&
      m.category === measureToAnalyze.category
    );

    if (relatedMeasures.length > 0) {
      issues.push({
        type: 'suggestion',
        category: 'Synergies',
        title: `${relatedMeasures.length} mesure(s) similaire(s) identifiée(s)`,
        description: 'Des mesures de même catégorie peuvent créer des synergies',
        recommendation: 'Évaluer les possibilités de regroupement ou de séquencement',
        impact: 'medium'
      });
      recommendations.synergies = relatedMeasures.map(m => m.name);
    }

    // Analyse de faisabilité temporelle
    if (measureToAnalyze.implementationTimeframe === 'immediate' && (measureToAnalyze.implementationComplexity || 0) >= 3) {
      issues.push({
        type: 'error',
        category: 'Faisabilité Temporelle',
        title: 'Délai irréaliste pour la complexité',
        description: 'Une implémentation immédiate n\'est pas réaliste pour une mesure complexe',
        recommendation: 'Étendre le délai à court terme (1-3 mois) minimum',
        impact: 'high'
      });
    }

    // Recommandations d'optimisation
    const costForComparison = typeof measureToAnalyze.implementationCost === 'string' ?
      (measureToAnalyze.implementationCost === 'low' ? 1 : measureToAnalyze.implementationCost === 'medium' ? 2 :
       measureToAnalyze.implementationCost === 'high' ? 3 : 4) : 2;
    if (measureToAnalyze.effectiveness < 3 && costForComparison <= 2) {
      recommendations.effectiveness = Math.min(4, measureToAnalyze.effectiveness + 1);
      issues.push({
        type: 'suggestion',
        category: 'Optimisation',
        title: 'Potentiel d\'amélioration de l\'efficacité',
        description: 'Le coût faible permet d\'envisager une version plus efficace',
        recommendation: `Augmenter l\'efficacité à ${recommendations.effectiveness}`,
        impact: 'medium'
      });
    }

    // Analyse des dépendances manquantes
    if (measureToAnalyze.type === 'detective' && !measuresToUse.some(m => m.type === 'preventive')) {
      issues.push({
        type: 'warning',
        category: 'Dépendances',
        title: 'Mesures préventives recommandées',
        description: 'Les mesures détectives sont plus efficaces avec des mesures préventives',
        recommendation: 'Ajouter des mesures préventives complémentaires',
        impact: 'medium'
      });
    }

    // Calcul du score global
    const errorCount = issues.filter(i => i.type === 'error').length;
    const warningCount = issues.filter(i => i.type === 'warning').length;
    const overallScore = Math.max(0, 100 - (errorCount * 30) - (warningCount * 15));

    // Calcul des métriques d'alignement stratégique
    const scenarioCoverage = targetedScenarios.length / Math.max(1, scenariosToUse.length) * 100;
    const avgRiskLevel = targetedScenarios.length > 0
      ? targetedScenarios.reduce((sum, s) => sum + EbiosUtils.normalizeRiskLevel(s.riskLevel), 0) / targetedScenarios.length
      : 0;
    const riskMitigationPotential = (avgRiskLevel / 4) * measureToAnalyze.effectiveness * 25;
    const costForCalculation = typeof measureToAnalyze.implementationCost === 'string' ?
      (measureToAnalyze.implementationCost === 'low' ? 1 : measureToAnalyze.implementationCost === 'medium' ? 2 :
       measureToAnalyze.implementationCost === 'high' ? 3 : 4) : 2;
    const implementationFeasibility = Math.max(0, 100 - ((measureToAnalyze.implementationComplexity || 2) * 20) - (costForCalculation * 15));

    const analysisResult: CoherenceAnalysis = {
      overallScore,
      issues,
      recommendations,
      strategicAlignment: {
        scenarioCoverage: Math.round(scenarioCoverage),
        riskMitigationPotential: Math.round(riskMitigationPotential),
        implementationFeasibility: Math.round(implementationFeasibility)
      }
    };

    setAnalysis(analysisResult);
    setIsAnalyzing(false);
  };

  const getIssueIcon = (type: ValidationIssue['type']) => {
    switch (type) {
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'suggestion': return <Lightbulb className="h-5 w-5 text-blue-500" />;
    }
  };

  const getIssueColor = (type: ValidationIssue['type']) => {
    switch (type) {
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'suggestion': return 'border-blue-200 bg-blue-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleApplyRecommendations = () => {
    if (analysis?.recommendations && onApplyRecommendations) {
      onApplyRecommendations(analysis.recommendations);
    }
    onClose();
  };

  return (
    <Dialog {...(isOpen ? { open: true } : {})} {...(onClose ? { onOpenChange: onClose } : {})}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[10001]">
        <DialogHeader>
          <DialogTitle {...({ className: "flex items-center space-x-2" } as any)}>
            <Bot className="h-5 w-5 text-blue-500" />
            <span>Validation IA - Analyse de Cohérence</span>
          </DialogTitle>
          <DialogDescription>
            Analyse automatisée de la cohérence et de l'efficacité de la mesure selon EBIOS RM
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête avec score global */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-gray-900">Mesure analysée</h3>
                <p className="text-sm text-gray-600">{(measure || securityMeasures?.[0])?.name || 'Mesure non définie'}</p>
              </div>
              {isAnalyzing ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span className="text-sm text-gray-600">Analyse en cours...</span>
                </div>
              ) : analysis ? (
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}/100
                  </div>
                  <div className="text-sm text-gray-600">Score de Cohérence</div>
                </div>
              ) : null}
            </div>

            {analysis && (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white rounded">
                  <div className="text-xl font-bold text-blue-600">{analysis.strategicAlignment.scenarioCoverage}%</div>
                  <div className="text-xs text-gray-600">Couverture Scénarios</div>
                </div>
                <div className="text-center p-3 bg-white rounded">
                  <div className="text-xl font-bold text-green-600">{analysis.strategicAlignment.riskMitigationPotential}%</div>
                  <div className="text-xs text-gray-600">Potentiel Mitigation</div>
                </div>
                <div className="text-center p-3 bg-white rounded">
                  <div className="text-xl font-bold text-purple-600">{analysis.strategicAlignment.implementationFeasibility}%</div>
                  <div className="text-xs text-gray-600">Faisabilité</div>
                </div>
              </div>
            )}
          </div>

          {/* Issues et recommandations */}
          {analysis && analysis.issues.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Issues Détectées ({analysis.issues.length})
              </h3>
              <div className="space-y-3">
                {analysis.issues.map((issue, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getIssueColor(issue.type)}`}>
                    <div className="flex items-start space-x-3">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{issue.title}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant={issue.impact === 'high' ? 'destructive' : issue.impact === 'medium' ? 'default' : 'secondary'}>
                              {issue.impact}
                            </Badge>
                            <Badge variant="outline">
                              {issue.category}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{issue.description}</p>
                        <div className="bg-white/70 rounded p-2">
                          <p className="text-sm font-medium text-gray-800">
                            <strong>Recommandation :</strong> {issue.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Synergies identifiées */}
          {analysis?.recommendations.synergies && analysis.recommendations.synergies.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Synergies Détectées
              </h4>
              <div className="space-y-2">
                {analysis.recommendations.synergies.map((synergy, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-blue-800">{synergy}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommandations d'optimisation */}
          {analysis && Object.keys(analysis.recommendations).length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Recommandations d'Optimisation
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.recommendations.priority && (
                  <div className="bg-white/70 p-3 rounded">
                    <span className="text-sm font-medium">Priorité recommandée :</span>
                    <span className="ml-2 text-green-700">{analysis.recommendations.priority}</span>
                  </div>
                )}
                {analysis.recommendations.effectiveness && (
                  <div className="bg-white/70 p-3 rounded">
                    <span className="text-sm font-medium">Efficacité optimisée :</span>
                    <span className="ml-2 text-green-700">{analysis.recommendations.effectiveness}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Feedback utilisateur */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Commentaires sur l'analyse</h4>
            <Textarea
              value={userFeedback}
              onChange={(e) => setUserFeedback(e.target.value)}
              placeholder="Ajoutez vos commentaires sur cette analyse IA ou posez des questions..."
              rows={3}
            />
          </div>

          {/* Résumé des actions */}
          {analysis && analysis.issues.filter(i => i.type === 'error').length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium text-green-900">Mesure validée</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                Aucune erreur critique détectée. La mesure peut être implémentée avec les optimisations suggérées.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            {analysis && Object.keys(analysis.recommendations).length > 0 && (
              <Button onClick={handleApplyRecommendations}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Appliquer les Recommandations
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 