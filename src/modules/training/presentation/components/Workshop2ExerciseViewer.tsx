import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Target, 
  CheckCircle, 
  AlertCircle, 
  BookOpen, 
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Play,
  Pause,
  Trophy,
  Shield,
  Users,
  Network,
  Eye,
  AlertTriangle
} from 'lucide-react';
import Button from '../../../../components/ui/button';
import { RiskSourcesExercises, RiskSourceExercise, ExerciseQuestion } from '../../domain/workshop2/RiskSourcesExercises';

interface Workshop2ExerciseViewerProps {
  onComplete?: (results: ExerciseResults) => void;
  onNavigateToWorkshop?: (workshopId: number) => void;
}

interface ExerciseResults {
  exerciseId: string;
  score: number;
  maxScore: number;
  timeSpent: number;
  answers: Record<string, any>;
  completed: boolean;
}

interface ExerciseState {
  currentExercise: number;
  currentQuestion: number;
  answers: Record<string, any>;
  timeSpent: number;
  isRunning: boolean;
  completed: boolean;
  results: ExerciseResults[];
}

export const Workshop2ExerciseViewer: React.FC<Workshop2ExerciseViewerProps> = ({
  onComplete,
  onNavigateToWorkshop
}) => {
  const [state, setState] = useState<ExerciseState>({
    currentExercise: 0,
    currentQuestion: 0,
    answers: {},
    timeSpent: 0,
    isRunning: false,
    completed: false,
    results: []
  });

  const exercises = RiskSourcesExercises.getAllExercises();
  const currentExercise = exercises[state.currentExercise];
  const currentQuestion = currentExercise?.questions[state.currentQuestion];

  // Timer pour chronométrer les exercices
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.isRunning) {
      interval = setInterval(() => {
        setState(prev => ({ ...prev, timeSpent: prev.timeSpent + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isRunning]);

  const startExercise = () => {
    setState(prev => ({ ...prev, isRunning: true, timeSpent: 0 }));
  };

  const pauseExercise = () => {
    setState(prev => ({ ...prev, isRunning: false }));
  };

  const resetExercise = () => {
    setState({
      currentExercise: 0,
      currentQuestion: 0,
      answers: {},
      timeSpent: 0,
      isRunning: false,
      completed: false,
      results: []
    });
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer }
    }));
  };

  const nextQuestion = () => {
    if (state.currentQuestion < currentExercise.questions.length - 1) {
      setState(prev => ({ ...prev, currentQuestion: prev.currentQuestion + 1 }));
    } else {
      completeExercise();
    }
  };

  const previousQuestion = () => {
    if (state.currentQuestion > 0) {
      setState(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }));
    }
  };

  const completeExercise = () => {
    const score = calculateScore();
    const result: ExerciseResults = {
      exerciseId: currentExercise.id,
      score,
      maxScore: currentExercise.points,
      timeSpent: state.timeSpent,
      answers: state.answers,
      completed: true
    };

    setState(prev => ({
      ...prev,
      results: [...prev.results, result],
      isRunning: false
    }));

    if (state.currentExercise < exercises.length - 1) {
      // Passer à l'exercice suivant
      setState(prev => ({
        ...prev,
        currentExercise: prev.currentExercise + 1,
        currentQuestion: 0,
        answers: {},
        timeSpent: 0
      }));
    } else {
      // Tous les exercices terminés
      setState(prev => ({ ...prev, completed: true }));
      if (onComplete) {
        onComplete(result);
      }
    }
  };

  const calculateScore = (): number => {
    let totalScore = 0;
    currentExercise.questions.forEach(question => {
      const userAnswer = state.answers[question.id];
      if (userAnswer && isCorrectAnswer(question, userAnswer)) {
        totalScore += question.points;
      }
    });
    return totalScore;
  };

  const isCorrectAnswer = (question: ExerciseQuestion, userAnswer: any): boolean => {
    switch (question.type) {
      case 'multiple_choice':
        return userAnswer === question.correctAnswer;
      case 'multiple_select':
        return Array.isArray(userAnswer) && 
               Array.isArray(question.correctAnswer) &&
               userAnswer.length === question.correctAnswer.length &&
               userAnswer.every(answer => question.correctAnswer.includes(answer));
      case 'ranking':
        return Array.isArray(userAnswer) && 
               Array.isArray(question.correctAnswer) &&
               JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);
      case 'threat_profiling':
      case 'scenario_analysis':
      case 'matrix_analysis':
        // Pour ces types complexes, on vérifie si la réponse contient les éléments corrects
        if (typeof question.correctAnswer === 'object' && !Array.isArray(question.correctAnswer)) {
          return Object.keys(question.correctAnswer).some(key => 
            Array.isArray(question.correctAnswer[key]) && 
            Array.isArray(userAnswer) &&
            question.correctAnswer[key].some(correct => userAnswer.includes(correct))
          );
        }
        return Array.isArray(userAnswer) && 
               Array.isArray(question.correctAnswer) &&
               userAnswer.some(answer => question.correctAnswer.includes(answer));
      default:
        return false;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    const totalQuestions = exercises.reduce((sum, ex) => sum + ex.questions.length, 0);
    const completedQuestions = state.results.reduce((sum, result) => {
      const exercise = exercises.find(ex => ex.id === result.exerciseId);
      return sum + (exercise?.questions.length || 0);
    }, 0) + state.currentQuestion;
    return Math.round((completedQuestions / totalQuestions) * 100);
  };

  const getExerciseIcon = (type: string) => {
    switch (type) {
      case 'external_sources': return Shield;
      case 'internal_threats': return Users;
      case 'supply_chain': return Network;
      case 'threat_intelligence': return Eye;
      case 'governance_simulation': return AlertTriangle;
      default: return Target;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (state.completed) {
    const totalScore = state.results.reduce((sum, result) => sum + result.score, 0);
    const maxTotalScore = exercises.reduce((sum, ex) => sum + ex.points, 0);
    const percentage = Math.round((totalScore / maxTotalScore) * 100);

    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Atelier 2 Terminé !
          </h2>
          <p className="text-xl text-gray-600">
            Score final : {totalScore}/{maxTotalScore} points ({percentage}%)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {state.results.map((result, index) => {
            const exercise = exercises.find(ex => ex.id === result.exerciseId);
            const percentage = Math.round((result.score / result.maxScore) * 100);
            const Icon = getExerciseIcon(exercise?.type || '');
            
            return (
              <div key={result.exerciseId} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Icon className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">
                    Exercice {index + 1}: {exercise?.title}
                  </h3>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Score</span>
                  <span className="font-medium">
                    {result.score}/{result.maxScore} ({percentage}%)
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Temps</span>
                  <span className="font-medium">{formatTime(result.timeSpent)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Difficulté</span>
                  <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(exercise?.difficulty || '')}`}>
                    {exercise?.difficulty}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center space-x-4">
          <Button onClick={resetExercise} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Recommencer
          </Button>
          {onNavigateToWorkshop && (
            <Button onClick={() => onNavigateToWorkshop(3)}>
              <ChevronRight className="w-4 h-4 mr-2" />
              Atelier 3 - Scénarios Stratégiques
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!currentExercise || !currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-4">
            Impossible de charger les exercices de l'Atelier 2.
          </p>
          <Button onClick={resetExercise}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  const ExerciseIcon = getExerciseIcon(currentExercise.type);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* En-tête avec progression */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Atelier 2 - Sources de Risque
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(state.timeSpent)}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Target className="w-4 h-4 mr-1" />
              {getProgressPercentage()}%
            </div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Informations exercice */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <ExerciseIcon className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-blue-900">
              Exercice {state.currentExercise + 1}: {currentExercise.title}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-sm ${getDifficultyColor(currentExercise.difficulty)}`}>
              {currentExercise.difficulty}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              {currentExercise.points} pts
            </span>
          </div>
        </div>
        <p className="text-blue-700 mb-2">{currentExercise.description}</p>
        <div className="flex items-center text-sm text-blue-600">
          <Clock className="w-4 h-4 mr-1" />
          Durée recommandée : {currentExercise.duration} minutes
        </div>
      </div>

      {/* Question actuelle */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Question {state.currentQuestion + 1}/{currentExercise.questions.length}
          </h3>
          <span className="text-sm text-gray-500">
            {currentQuestion.points} points
          </span>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-gray-900 mb-4">{currentQuestion.question}</p>
          
          {/* Interface de réponse selon le type */}
          {(currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'threat_profiling' || currentQuestion.type === 'scenario_analysis') && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={state.answers[currentQuestion.id] === option}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    className="text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}

          {(currentQuestion.type === 'multiple_select' || currentQuestion.type === 'matrix_analysis') && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={option}
                    checked={state.answers[currentQuestion.id]?.includes(option) || false}
                    onChange={(e) => {
                      const currentAnswers = state.answers[currentQuestion.id] || [];
                      const newAnswers = e.target.checked
                        ? [...currentAnswers, option]
                        : currentAnswers.filter((a: string) => a !== option);
                      handleAnswer(currentQuestion.id, newAnswers);
                    }}
                    className="text-blue-600"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'ranking' && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-2">
                Glissez-déposez pour classer par ordre de priorité (1 = plus prioritaire)
              </p>
              {/* Interface de ranking simplifiée pour la démo */}
              <div className="space-y-2">
                {currentQuestion.options?.map((option, index) => (
                  <div key={index} className="bg-white p-2 border rounded cursor-move">
                    <span className="text-gray-700">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Threat Intelligence */}
        {currentQuestion.threatIntelligence && currentQuestion.threatIntelligence.length > 0 && (
          <div className="bg-red-50 p-3 rounded-lg mb-4">
            <h4 className="font-medium text-red-800 mb-2 flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              Threat Intelligence :
            </h4>
            <div className="space-y-2">
              {currentQuestion.threatIntelligence.map((ti, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium text-red-700">{ti.source}</span>
                  <span className="text-red-600 ml-2">({ti.reliability}/{ti.confidence})</span>
                  <p className="text-red-700 mt-1">{ti.information}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Indices et conseils */}
        {currentQuestion.hints && currentQuestion.hints.length > 0 && (
          <div className="bg-yellow-50 p-3 rounded-lg mb-4">
            <h4 className="font-medium text-yellow-800 mb-2">💡 Indices :</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              {currentQuestion.hints.map((hint, index) => (
                <li key={index}>• {hint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Contrôles */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {!state.isRunning ? (
            <Button onClick={startExercise} variant="outline">
              <Play className="w-4 h-4 mr-2" />
              Démarrer
            </Button>
          ) : (
            <Button onClick={pauseExercise} variant="outline">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          <Button onClick={resetExercise} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="flex space-x-2">
          {state.currentQuestion > 0 && (
            <Button onClick={previousQuestion} variant="outline">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>
          )}
          <Button 
            onClick={nextQuestion}
            disabled={!state.answers[currentQuestion.id]}
          >
            {state.currentQuestion < currentExercise.questions.length - 1 ? (
              <>
                Suivant
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Terminer l'exercice
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
