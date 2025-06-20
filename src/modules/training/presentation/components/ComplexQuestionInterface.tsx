/**
 * 🧠 INTERFACE DE QUESTIONS COMPLEXES EN TEMPS RÉEL
 * Composant React pour les questions EBIOS RM avancées
 * Avec scoring temps réel et feedback expert instantané
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ComplexQuestion, 
  ComplexQuestionGeneratorService,
  QuestionGenerationRequest 
} from '../../domain/services/ComplexQuestionGeneratorService';
import { 
  RealTimeScoringService, 
  UserResponse, 
  RealTimeScore 
} from '../../domain/services/RealTimeScoringService';
import { 
  ExpertFeedbackService, 
  ExpertFeedback 
} from '../../domain/services/ExpertFeedbackService';
import { EbiosExpertProfile } from '../../../../infrastructure/a2a/types/AgentCardTypes';

// 🎯 PROPS DU COMPOSANT
interface ComplexQuestionInterfaceProps {
  workshopId: number;
  userProfile: EbiosExpertProfile;
  onQuestionComplete: (score: RealTimeScore, feedback: ExpertFeedback) => void;
  onSessionComplete: (sessionResults: SessionResults) => void;
  difficulty?: 'intermediate' | 'advanced' | 'expert' | 'master';
  timeLimit?: number;
  focusAreas?: string[];
}

interface SessionResults {
  totalQuestions: number;
  completedQuestions: number;
  averageScore: number;
  totalTime: number;
  strengths: string[];
  improvementAreas: string[];
  recommendations: string[];
}

// 🎯 ÉTAT DU COMPOSANT
interface QuestionState {
  currentQuestion: ComplexQuestion | null;
  userResponses: Record<string, any>;
  timeSpent: number;
  hintsUsed: number[];
  isSubmitting: boolean;
  showHints: boolean;
  currentHintLevel: number;
  validationErrors: string[];
  realTimeScore: RealTimeScore | null;
  expertFeedback: ExpertFeedback | null;
}

/**
 * 🧠 COMPOSANT PRINCIPAL
 */
export const ComplexQuestionInterface: React.FC<ComplexQuestionInterfaceProps> = ({
  workshopId,
  userProfile,
  onQuestionComplete,
  onSessionComplete,
  difficulty = 'expert',
  timeLimit,
  focusAreas
}) => {
  // 🎯 SERVICES
  const questionGenerator = ComplexQuestionGeneratorService.getInstance();
  const scoringService = RealTimeScoringService.getInstance();
  const feedbackService = ExpertFeedbackService.getInstance();

  // 🎯 ÉTAT
  const [state, setState] = useState<QuestionState>({
    currentQuestion: null,
    userResponses: {},
    timeSpent: 0,
    hintsUsed: [],
    isSubmitting: false,
    showHints: false,
    currentHintLevel: 0,
    validationErrors: [],
    realTimeScore: null,
    expertFeedback: null
  });

  const [sessionState, setSessionState] = useState({
    questionsCompleted: 0,
    totalTime: 0,
    scores: [] as number[],
    isSessionActive: false
  });

  // 🎯 REFS
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // 🎯 EFFETS
  useEffect(() => {
    initializeQuestion();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [workshopId, difficulty]);

  useEffect(() => {
    if (state.currentQuestion && !timerRef.current) {
      startTimer();
    }
  }, [state.currentQuestion]);

  // 🎯 INITIALISATION DE LA QUESTION
  const initializeQuestion = useCallback(async () => {
    try {
      console.log(`🧠 Initialisation question complexe Workshop ${workshopId}`);
      
      const request: QuestionGenerationRequest = {
        workshopId,
        userProfile,
        context: {
          workshopId: workshopId as 1 | 2 | 3 | 4 | 5,
          organizationType: 'CHU Métropolitain',
          sector: 'santé',
          complexity: difficulty,
          userProfile
        },
        difficulty,
        count: 1,
        focusAreas,
        timeConstraint: timeLimit,
        adaptToUserLevel: true
      };

      const response = await questionGenerator.generateComplexQuestions(request);
      
      if (response.questions.length > 0) {
        setState(prev => ({
          ...prev,
          currentQuestion: response.questions[0],
          userResponses: {},
          timeSpent: 0,
          hintsUsed: [],
          validationErrors: [],
          realTimeScore: null,
          expertFeedback: null
        }));
        
        setSessionState(prev => ({
          ...prev,
          isSessionActive: true
        }));
        
        startTimeRef.current = Date.now();
      }
      
    } catch (error) {
      console.error('❌ Erreur initialisation question:', error);
    }
  }, [workshopId, userProfile, difficulty, timeLimit, focusAreas]);

  // ⏱️ GESTION DU TIMER
  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setState(prev => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000)
      }));
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 📝 GESTION DES RÉPONSES
  const handleResponseChange = useCallback((fieldId: string, value: any) => {
    setState(prev => ({
      ...prev,
      userResponses: {
        ...prev.userResponses,
        [fieldId]: value
      }
    }));
    
    // Validation en temps réel
    validateResponse(fieldId, value);
  }, []);

  // ✅ VALIDATION EN TEMPS RÉEL
  const validateResponse = useCallback((fieldId: string, value: any) => {
    if (!state.currentQuestion) return;
    
    const validationRules = state.currentQuestion.realTimeValidation.filter(
      rule => rule.field === fieldId
    );
    
    const errors: string[] = [];
    
    for (const rule of validationRules) {
      // Logique de validation simplifiée
      if (rule.rule === 'required' && (!value || value.toString().trim() === '')) {
        errors.push(rule.message);
      }
      // Ajouter d'autres règles de validation selon les besoins
    }
    
    setState(prev => ({
      ...prev,
      validationErrors: errors
    }));
  }, [state.currentQuestion]);

  // 💡 GESTION DES INDICES
  const requestHint = useCallback(() => {
    if (!state.currentQuestion) return;
    
    const nextHintLevel = state.currentHintLevel + 1;
    const availableHints = state.currentQuestion.hints.filter(
      hint => hint.level <= nextHintLevel
    );
    
    if (availableHints.length > 0) {
      setState(prev => ({
        ...prev,
        showHints: true,
        currentHintLevel: nextHintLevel,
        hintsUsed: [...prev.hintsUsed, nextHintLevel]
      }));
    }
  }, [state.currentQuestion, state.currentHintLevel]);

  // 📤 SOUMISSION DE LA RÉPONSE
  const submitResponse = useCallback(async () => {
    if (!state.currentQuestion || state.validationErrors.length > 0) return;
    
    setState(prev => ({ ...prev, isSubmitting: true }));
    stopTimer();
    
    try {
      // Création de la réponse utilisateur
      const userResponse: UserResponse = {
        questionId: state.currentQuestion.id,
        userId: userProfile.id,
        responses: state.userResponses,
        timeSpent: state.timeSpent,
        hintsUsed: state.hintsUsed,
        submissionTime: new Date(),
        isPartial: false
      };
      
      // Scoring en temps réel
      const score = await scoringService.scoreResponse(state.currentQuestion, userResponse);
      
      // Génération du feedback expert
      const feedback = await feedbackService.generateExpertFeedback(
        state.currentQuestion,
        userResponse,
        score,
        userProfile
      );
      
      setState(prev => ({
        ...prev,
        realTimeScore: score,
        expertFeedback: feedback,
        isSubmitting: false
      }));
      
      // Mise à jour de la session
      setSessionState(prev => ({
        ...prev,
        questionsCompleted: prev.questionsCompleted + 1,
        totalTime: prev.totalTime + state.timeSpent,
        scores: [...prev.scores, score.percentage]
      }));
      
      // Callback vers le parent
      onQuestionComplete(score, feedback);
      
    } catch (error) {
      console.error('❌ Erreur soumission réponse:', error);
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [state, userProfile, onQuestionComplete, stopTimer]);

  // 🎯 RENDU DU COMPOSANT
  if (!state.currentQuestion) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Génération de votre question complexe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* En-tête de la question */}
      <div className="mb-6 border-b pb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {state.currentQuestion.title}
            </h2>
            <p className="text-gray-600 mb-2">
              {state.currentQuestion.description}
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>🎯 {state.currentQuestion.category}</span>
              <span>📊 {state.currentQuestion.difficulty}</span>
              <span>⏱️ {Math.floor(state.timeSpent / 60)}:{(state.timeSpent % 60).toString().padStart(2, '0')}</span>
              <span>💯 {state.currentQuestion.scoring.totalPoints} points</span>
            </div>
          </div>
          
          {/* Timer et actions */}
          <div className="text-right">
            <div className="text-2xl font-mono text-blue-600 mb-2">
              {Math.floor(state.timeSpent / 60)}:{(state.timeSpent % 60).toString().padStart(2, '0')}
            </div>
            <button
              onClick={requestHint}
              disabled={state.currentHintLevel >= state.currentQuestion.hints.length}
              className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 disabled:opacity-50"
            >
              💡 Indice ({state.hintsUsed.length}/3)
            </button>
          </div>
        </div>
      </div>

      {/* Contexte de la question */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">📋 Contexte</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Organisation:</strong> {state.currentQuestion.context.organizationType}
          </div>
          <div>
            <strong>Secteur:</strong> {state.currentQuestion.context.sector}
          </div>
        </div>
      </div>

      {/* Indices affichés */}
      {state.showHints && state.hintsUsed.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <h3 className="font-semibold text-yellow-800 mb-2">💡 Indices</h3>
          {state.currentQuestion.hints
            .filter(hint => state.hintsUsed.includes(hint.level))
            .map((hint, index) => (
              <div key={index} className="mb-2 text-yellow-700">
                <strong>Niveau {hint.level}:</strong> {hint.content}
                <span className="text-xs text-yellow-600 ml-2">
                  (-{hint.pointDeduction} points)
                </span>
              </div>
            ))}
        </div>
      )}

      {/* Zone de réponse */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">📝 Votre Réponse</h3>
        
        {/* Exigences de la question */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 mb-2">Exigences:</h4>
          {state.currentQuestion.requirements.map((req, index) => (
            <div key={req.id} className="mb-4 p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-medium text-gray-700">{req.description}</h5>
                <span className="text-sm text-gray-500">{Math.round(req.weight * 100)}%</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Format: {req.expectedFormat}</p>
              
              {/* Zone de saisie */}
              <textarea
                value={state.userResponses[req.id] || ''}
                onChange={(e) => handleResponseChange(req.id, e.target.value)}
                placeholder={`Répondez ici pour: ${req.description}`}
                className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Erreurs de validation */}
      {state.validationErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400">
          <h3 className="font-semibold text-red-800 mb-2">⚠️ Erreurs de validation</h3>
          {state.validationErrors.map((error, index) => (
            <p key={index} className="text-red-700 text-sm">{error}</p>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Question {sessionState.questionsCompleted + 1} • Workshop {workshopId}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Retour
          </button>
          
          <button
            onClick={submitResponse}
            disabled={state.isSubmitting || state.validationErrors.length > 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state.isSubmitting ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Évaluation...
              </>
            ) : (
              'Soumettre ma réponse'
            )}
          </button>
        </div>
      </div>

      {/* Résultats et feedback (si disponibles) */}
      {state.realTimeScore && state.expertFeedback && (
        <div className="mt-8 p-6 bg-green-50 border-l-4 border-green-400 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-4">
            🎉 Résultat: {state.realTimeScore.percentage}% ({state.realTimeScore.totalScore}/{state.realTimeScore.maxScore} points)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Score détaillé */}
            <div>
              <h4 className="font-medium text-green-700 mb-2">📊 Détail du score</h4>
              {state.realTimeScore.breakdown.map((item, index) => (
                <div key={index} className="flex justify-between text-sm mb-1">
                  <span>{item.criterion}</span>
                  <span>{item.earnedPoints}/{item.maxPoints}</span>
                </div>
              ))}
            </div>
            
            {/* Feedback expert */}
            <div>
              <h4 className="font-medium text-green-700 mb-2">
                👨‍🏫 {state.expertFeedback.expertProfile.name}
              </h4>
              <p className="text-sm text-green-600 mb-2">
                {state.expertFeedback.feedback.immediate.summary}
              </p>
              <div className="text-sm text-green-600">
                <strong>Points forts:</strong>
                <ul className="list-disc list-inside ml-2">
                  {state.expertFeedback.feedback.immediate.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
