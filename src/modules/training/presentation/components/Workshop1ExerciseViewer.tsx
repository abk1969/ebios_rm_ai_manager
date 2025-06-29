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
  Trophy
} from 'lucide-react';
import Button from '../../../../components/ui/button';
import { SecurityFoundationExercises, SecurityFoundationExercise, ExerciseQuestion } from '../../domain/workshop1/SecurityFoundationExercises';

interface Workshop1ExerciseViewerProps {
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

export const Workshop1ExerciseViewer: React.FC<Workshop1ExerciseViewerProps> = ({
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

  const exercises = SecurityFoundationExercises.getAllExercises();
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

  if (state.completed) {
    const totalScore = state.results.reduce((sum, result) => sum + result.score, 0);
    const maxTotalScore = exercises.reduce((sum, ex) => sum + ex.points, 0);
    const percentage = Math.round((totalScore / maxTotalScore) * 100);

    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Atelier 1 Terminé !
          </h2>
          <p className="text-xl text-gray-600">
            Score final : {totalScore}/{maxTotalScore} points ({percentage}%)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {state.results.map((result, index) => {
            const exercise = exercises.find(ex => ex.id === result.exerciseId);
            const percentage = Math.round((result.score / result.maxScore) * 100);
            
            return (
              <div key={result.exerciseId} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Exercice {index + 1}: {exercise?.title}
                </h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Score</span>
                  <span className="font-medium">
                    {result.score}/{result.maxScore} ({percentage}%)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Temps</span>
                  <span className="font-medium">{formatTime(result.timeSpent)}</span>
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
            <Button onClick={() => onNavigateToWorkshop(2)}>
              <ChevronRight className="w-4 h-4 mr-2" />
              Atelier 2 - Sources de Risque
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
            Impossible de charger les exercices de l'Atelier 1.
          </p>
          <Button onClick={resetExercise}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* En-tête avec progression */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Atelier 1 - Socle de Sécurité
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
          <h2 className="text-xl font-semibold text-blue-900">
            Exercice {state.currentExercise + 1}: {currentExercise.title}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
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
          {currentQuestion.type === 'multiple_choice' && (
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

          {currentQuestion.type === 'multiple_select' && (
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
        </div>

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
