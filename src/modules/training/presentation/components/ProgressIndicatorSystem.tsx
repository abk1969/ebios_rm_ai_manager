/**
 * 📊 SYSTÈME D'INDICATEURS DE PROGRESSION
 * Composant pour afficher la progression réelle et motivante
 * Remplace les métriques fictives par des indicateurs précis et conformes ANSSI
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Target, 
  Award, 
  TrendingUp,
  Star,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  TrainingStep 
} from '../../domain/entities/LinearTrainingPath';
import { 
  LinearTrainingOrchestrator, 
  OrchestrationEvent 
} from '../../domain/services/LinearTrainingOrchestrator';
import { 
  ProgressReport,
  ANSSIComplianceReport 
} from '../../domain/services/LinearProgressManager';

// 🎯 PROPS DU COMPOSANT
interface ProgressIndicatorSystemProps {
  orchestrator: LinearTrainingOrchestrator;
  currentStep: TrainingStep;
  compact?: boolean;
  showDetails?: boolean;
  className?: string;
}

// 🎯 ÉTAT DES INDICATEURS
interface ProgressIndicatorState {
  globalProgress: number;
  stepProgress: number;
  timeSpent: number;
  estimatedTimeRemaining: number;
  currentScore: number;
  averageScore: number;
  milestonesReached: number;
  certificatesEarned: number;
  anssiCompliance: ANSSIComplianceReport | null;
  isExpanded: boolean;
  lastUpdate: Date;
}

// 🎯 COMPOSANT PRINCIPAL
export const ProgressIndicatorSystem: React.FC<ProgressIndicatorSystemProps> = ({
  orchestrator,
  currentStep,
  compact = false,
  showDetails = true,
  className = ''
}) => {
  const [state, setState] = useState<ProgressIndicatorState>({
    globalProgress: 0,
    stepProgress: 0,
    timeSpent: 0,
    estimatedTimeRemaining: 160,
    currentScore: 0,
    averageScore: 0,
    milestonesReached: 0,
    certificatesEarned: 0,
    anssiCompliance: null,
    isExpanded: !compact,
    lastUpdate: new Date()
  });

  // 🔄 CHARGER LES DONNÉES DE PROGRESSION
  const loadProgressData = useCallback(() => {
    try {
      const fullState = orchestrator.getFullState();
      const progressReport = orchestrator.generateComprehensiveReport().progressReport as ProgressReport;

      setState(prev => ({
        ...prev,
        globalProgress: fullState.progress.globalProgress,
        stepProgress: fullState.progress.stepProgress,
        timeSpent: fullState.progress.timeSpent,
        estimatedTimeRemaining: fullState.progress.estimatedTimeRemaining,
        currentScore: fullState.progress.scoresPerStep[currentStep] || 0,
        averageScore: progressReport.averageScore,
        milestonesReached: progressReport.milestonesReached.length,
        certificatesEarned: progressReport.certificatesEarned.length,
        anssiCompliance: progressReport.anssiCompliance,
        lastUpdate: new Date()
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des données de progression:', error);
    }
  }, [orchestrator, currentStep]);

  // 🎧 ÉCOUTER LES ÉVÉNEMENTS D'ORCHESTRATION
  useEffect(() => {
    const handleOrchestrationEvent = (event: OrchestrationEvent) => {
      if (event.type === 'progress_updated' || event.type === 'step_changed') {
        loadProgressData();
      }
    };

    orchestrator.addEventListener('progress_indicator', handleOrchestrationEvent);
    loadProgressData();

    return () => {
      orchestrator.removeEventListener('progress_indicator');
    };
  }, [orchestrator, loadProgressData]);

  // 🎨 OBTENIR LA COULEUR SELON LE POURCENTAGE
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 90) return 'from-green-500 to-emerald-600';
    if (percentage >= 75) return 'from-blue-500 to-cyan-600';
    if (percentage >= 50) return 'from-yellow-500 to-orange-500';
    if (percentage >= 25) return 'from-orange-500 to-red-500';
    return 'from-gray-400 to-gray-500';
  };

  // 🎯 OBTENIR L'ICÔNE DE STATUT ANSSI
  const getANSSIStatusIcon = () => {
    if (!state.anssiCompliance) return <Circle className="w-4 h-4 text-gray-400" />;
    
    if (state.anssiCompliance.isCompliant) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (state.anssiCompliance.score >= 50) {
      return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  // 🎯 FORMATER LE TEMPS
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  // 🎯 OBTENIR LE MESSAGE DE MOTIVATION
  const getMotivationalMessage = (): string => {
    const { globalProgress, averageScore } = state;
    
    if (globalProgress >= 90) {
      return "🎉 Presque terminé ! Vous êtes sur le point de devenir un expert EBIOS RM !";
    } else if (globalProgress >= 75) {
      return "🚀 Excellent progrès ! Vous maîtrisez bien la méthodologie !";
    } else if (globalProgress >= 50) {
      return "💪 Bon travail ! Vous avez franchi la moitié du parcours !";
    } else if (globalProgress >= 25) {
      return "📈 Vous progressez bien ! Continuez sur cette lancée !";
    } else {
      return "🎯 Bienvenue ! Votre parcours d'expertise EBIOS RM commence !";
    }
  };

  // 🎮 GESTIONNAIRES D'ÉVÉNEMENTS
  const toggleExpanded = () => {
    setState(prev => ({ ...prev, isExpanded: !prev.isExpanded }));
  };

  // 📱 VERSION COMPACTE
  if (compact) {
    return (
      <div className={`bg-white border-b border-gray-200 px-6 py-2 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Progression globale compacte */}
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className={`bg-gradient-to-r ${getProgressColor(state.globalProgress)} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${state.globalProgress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {state.globalProgress}%
              </span>
            </div>

            {/* Temps */}
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{formatTime(state.timeSpent)}</span>
            </div>

            {/* Conformité ANSSI */}
            <div className="flex items-center space-x-1">
              {getANSSIStatusIcon()}
              <span className="text-xs text-gray-600">ANSSI</span>
            </div>
          </div>

          <button
            onClick={toggleExpanded}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Afficher les détails"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 📱 VERSION COMPLÈTE
  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      {/* En-tête avec progression principale */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Votre progression EBIOS RM
          </h2>
          
          {showDetails && (
            <button
              onClick={toggleExpanded}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>{state.isExpanded ? 'Réduire' : 'Détails'}</span>
              {state.isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Barre de progression principale */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progression globale
            </span>
            <span className="text-sm font-bold text-gray-900">
              {state.globalProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`bg-gradient-to-r ${getProgressColor(state.globalProgress)} h-3 rounded-full transition-all duration-500 relative`}
              style={{ width: `${state.globalProgress}%` }}
            >
              {state.globalProgress > 10 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {state.globalProgress}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message motivationnel */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            {getMotivationalMessage()}
          </p>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Temps passé */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-600">Temps passé</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {formatTime(state.timeSpent)}
            </div>
            <div className="text-xs text-gray-500">
              Reste ~{formatTime(state.estimatedTimeRemaining)}
            </div>
          </div>

          {/* Score moyen */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-gray-600">Score moyen</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {Math.round(state.averageScore)}%
            </div>
            <div className="text-xs text-gray-500">
              Étape actuelle: {state.currentScore}%
            </div>
          </div>

          {/* Jalons atteints */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-xs font-medium text-gray-600">Jalons</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {state.milestonesReached}
            </div>
            <div className="text-xs text-gray-500">
              Récompenses obtenues
            </div>
          </div>

          {/* Conformité ANSSI */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              {getANSSIStatusIcon()}
              <span className="text-xs font-medium text-gray-600">ANSSI</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {state.anssiCompliance?.score || 0}%
            </div>
            <div className="text-xs text-gray-500">
              {state.anssiCompliance?.isCompliant ? 'Conforme' : 'En cours'}
            </div>
          </div>
        </div>
      </div>

      {/* Détails étendus */}
      {state.isExpanded && showDetails && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progression par étape */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Progression par étape
              </h3>
              <div className="space-y-2">
                {[
                  { step: TrainingStep.ONBOARDING, name: 'Onboarding' },
                  { step: TrainingStep.DISCOVERY, name: 'Découverte' },
                  { step: TrainingStep.WORKSHOPS, name: 'Ateliers' },
                  { step: TrainingStep.CERTIFICATION, name: 'Certification' },
                  { step: TrainingStep.RESOURCES, name: 'Ressources' }
                ].map(({ step, name }) => {
                  const fullState = orchestrator.getFullState();
                  const isCompleted = fullState.user.completedSteps.includes(step);
                  const isCurrent = step === currentStep;
                  const score = fullState.user.progress.scoresPerStep[step] || 0;

                  return (
                    <div key={step} className="flex items-center space-x-3">
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 border-2 border-blue-600 rounded-full animate-pulse" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={`text-sm ${isCurrent ? 'font-medium text-blue-900' : 'text-gray-700'}`}>
                        {name}
                      </span>
                      {isCompleted && (
                        <span className="text-xs text-green-600 font-medium">
                          {score}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Conformité ANSSI détaillée */}
            {state.anssiCompliance && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Conformité ANSSI
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Temps minimum</span>
                    <span className={`text-sm font-medium ${
                      state.anssiCompliance.timeRequirement.met ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {state.anssiCompliance.timeRequirement.met ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Score minimum</span>
                    <span className={`text-sm font-medium ${
                      state.anssiCompliance.scoreRequirement.met ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {state.anssiCompliance.scoreRequirement.met ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="mt-3 p-2 bg-white rounded border">
                    <div className="text-xs text-gray-600">
                      Critères manquants: {state.anssiCompliance.missingCriteria.length}
                    </div>
                    <div className="text-xs text-gray-600">
                      Critères validés: {state.anssiCompliance.metCriteria.length}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dernière mise à jour */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <Info className="w-3 h-3" />
              <span>
                Dernière mise à jour: {state.lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicatorSystem;
