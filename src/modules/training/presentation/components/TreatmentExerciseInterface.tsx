/**
 * 🎯 INTERFACE EXERCICES TRAITEMENT DU RISQUE
 * Interface interactive pour les exercices pratiques de sélection de mesures
 */

import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Clock, 
  Award, 
  CheckCircle,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Lightbulb,
  AlertTriangle,
  Star,
  ArrowRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import TreatmentExercises, { 
  TreatmentExercise, 
  ExerciseQuestion,
  ExerciseScenario 
} from '../../domain/workshop5/TreatmentExercises';

// 🎯 PROPS DU COMPOSANT
interface TreatmentExerciseInterfaceProps {
  selectedExercise?: string;
  onExerciseComplete?: (exerciseId: string, score: number) => void;
  onNavigateBack?: () => void;
}

export const TreatmentExerciseInterface: React.FC<TreatmentExerciseInterfaceProps> = ({
  selectedExercise,
  onExerciseComplete,
  onNavigateBack
}) => {
  const [currentExercise, setCurrentExercise] = useState<TreatmentExercise | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: any }>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showHints, setShowHints] = useState<{ [questionId: string]: boolean }>({});
  const [exerciseStarted, setExerciseStarted] = useState(false);

  // 📊 DONNÉES
  const exercises = TreatmentExercises.getAllExercises();
  const stats = TreatmentExercises.getExerciseStats();

  // ⏱️ TIMER
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  // 🎯 SÉLECTION D'EXERCICE
  useEffect(() => {
    if (selectedExercise) {
      const exercise = TreatmentExercises.getExerciseById(selectedExercise);
      if (exercise) {
        setCurrentExercise(exercise);
        setTimeRemaining(exercise.duration * 60);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setShowResults(false);
        setExerciseStarted(false);
        setShowHints({});
      }
    }
  }, [selectedExercise]);

  // 🚀 DÉMARRAGE EXERCICE
  const startExercise = () => {
    setExerciseStarted(true);
    setIsTimerActive(true);
  };

  // ⏰ FIN DE TEMPS
  const handleTimeUp = () => {
    setShowResults(true);
    calculateScore();
  };

  // 📝 RÉPONSE À UNE QUESTION
  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // ➡️ QUESTION SUIVANTE
  const nextQuestion = () => {
    if (currentExercise && currentQuestionIndex < currentExercise.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishExercise();
    }
  };

  // ⬅️ QUESTION PRÉCÉDENTE
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // ✅ TERMINER EXERCICE
  const finishExercise = () => {
    setIsTimerActive(false);
    setShowResults(true);
    calculateScore();
  };

  // 📊 CALCUL DU SCORE
  const calculateScore = () => {
    if (!currentExercise) return 0;

    let totalScore = 0;
    let maxScore = 0;

    currentExercise.questions.forEach(question => {
      maxScore += question.points;
      const userAnswer = answers[question.id];
      
      if (userAnswer !== undefined) {
        if (question.type === 'multiple_choice') {
          if (userAnswer === question.correctAnswer) {
            totalScore += question.points;
          }
        } else if (question.type === 'multiple_select') {
          const correct = question.correctAnswer as string[];
          const user = userAnswer as string[];
          if (user && Array.isArray(user)) {
            const correctCount = user.filter(ans => correct.includes(ans)).length;
            const incorrectCount = user.filter(ans => !correct.includes(ans)).length;
            const precision = correctCount / (correctCount + incorrectCount || 1);
            const recall = correctCount / correct.length;
            const f1Score = 2 * (precision * recall) / (precision + recall || 1);
            totalScore += Math.round(question.points * f1Score);
          }
        } else if (question.type === 'ranking') {
          // Score basé sur la proximité du classement correct
          const correct = question.correctAnswer as string[];
          const user = userAnswer as string[];
          if (user && Array.isArray(user)) {
            let rankingScore = 0;
            user.forEach((item, index) => {
              const correctIndex = correct.indexOf(item);
              if (correctIndex !== -1) {
                const distance = Math.abs(index - correctIndex);
                const itemScore = Math.max(0, 1 - (distance / correct.length));
                rankingScore += itemScore;
              }
            });
            totalScore += Math.round(question.points * (rankingScore / correct.length));
          }
        }
      }
    });

    const finalScore = Math.round((totalScore / maxScore) * 100);
    onExerciseComplete?.(currentExercise.id, finalScore);
    return finalScore;
  };

  // 💡 AFFICHAGE DES INDICES
  const toggleHints = (questionId: string) => {
    setShowHints(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // 🔄 REDÉMARRER EXERCICE
  const restartExercise = () => {
    if (currentExercise) {
      setTimeRemaining(currentExercise.duration * 60);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setShowResults(false);
      setExerciseStarted(false);
      setShowHints({});
      setIsTimerActive(false);
    }
  };

  // 📊 VUE D'ENSEMBLE DES EXERCICES
  const renderExerciseOverview = () => (
    <div className="space-y-6">
      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{stats.totalExercises}</div>
          <div className="text-sm text-blue-700">Exercices</div>
          <div className="text-xs text-blue-600">Pratiques</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{stats.totalDuration}</div>
          <div className="text-sm text-green-700">Minutes</div>
          <div className="text-xs text-green-600">Total</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">{stats.totalPoints}</div>
          <div className="text-sm text-purple-700">Points</div>
          <div className="text-xs text-purple-600">Disponibles</div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-900">Expert</div>
          <div className="text-sm text-orange-700">Niveau</div>
          <div className="text-xs text-orange-600">Requis</div>
        </div>
      </div>

      {/* Liste des exercices */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">🎯 Exercices pratiques disponibles</h3>
        
        <div className="space-y-4">
          {exercises.map(exercise => (
            <div key={exercise.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{exercise.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{exercise.duration} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-3 h-3" />
                      <span>{exercise.points} pts</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="w-3 h-3" />
                      <span>{exercise.questions.length} questions</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    exercise.difficulty === 'expert' ? 'bg-red-100 text-red-700' :
                    exercise.difficulty === 'advanced' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {exercise.difficulty}
                  </span>
                  
                  <button
                    onClick={() => setCurrentExercise(exercise)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Commencer
                  </button>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <div className="text-xs text-gray-600 mb-1">Objectifs d'apprentissage :</div>
                <ul className="text-xs text-gray-500">
                  {exercise.learningObjectives.slice(0, 2).map((obj, index) => (
                    <li key={index}>• {obj}</li>
                  ))}
                  {exercise.learningObjectives.length > 2 && (
                    <li>• +{exercise.learningObjectives.length - 2} autres objectifs</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 🎯 INTERFACE D'EXERCICE
  const renderExerciseInterface = () => {
    if (!currentExercise) return null;

    const currentQuestion = currentExercise.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentExercise.questions.length) * 100;

    return (
      <div className="space-y-6">
        {/* En-tête exercice */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentExercise.title}</h2>
              <p className="text-gray-600">{currentExercise.description}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Timer */}
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="w-4 h-4" />
                <span className="font-mono">
                  {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              </div>
              
              {/* Contrôles timer */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsTimerActive(!isTimerActive)}
                  className="p-2 text-gray-600 hover:text-gray-900"
                  disabled={!exerciseStarted}
                >
                  {isTimerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={restartExercise}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Progression */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Question {currentQuestionIndex + 1} sur {currentExercise.questions.length}</span>
              <span>{Math.round(progress)}% complété</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Démarrage exercice */}
        {!exerciseStarted && (
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Prêt à commencer ?</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium text-gray-900">{currentExercise.duration} minutes</div>
                  <div className="text-sm text-gray-600">Durée estimée</div>
                </div>
                <div className="text-center">
                  <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-medium text-gray-900">{currentExercise.points} points</div>
                  <div className="text-sm text-gray-600">Points disponibles</div>
                </div>
                <div className="text-center">
                  <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-medium text-gray-900">{currentExercise.questions.length} questions</div>
                  <div className="text-sm text-gray-600">À résoudre</div>
                </div>
              </div>
              
              <button
                onClick={startExercise}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                <Play className="w-4 h-4 inline mr-2" />
                Démarrer l'exercice
              </button>
            </div>
          </div>
        )}

        {/* Question actuelle */}
        {exerciseStarted && !showResults && currentQuestion && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Question {currentQuestionIndex + 1}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    {currentQuestion.points} pts
                  </span>
                  <button
                    onClick={() => toggleHints(currentQuestion.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Lightbulb className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{currentQuestion.question}</p>
              
              {/* Indices */}
              {showHints[currentQuestion.id] && currentQuestion.hints && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 mb-2">Indices :</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {currentQuestion.hints.map((hint, index) => (
                          <li key={index}>• {hint}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Options de réponse */}
            <div className="space-y-3 mb-6">
              {currentQuestion.type === 'multiple_choice' && currentQuestion.options?.map((option, index) => (
                <label key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option.charAt(0)}
                    checked={answers[currentQuestion.id] === option.charAt(0)}
                    onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                    className="mt-1"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
              
              {currentQuestion.type === 'multiple_select' && currentQuestion.options?.map((option, index) => (
                <label key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    value={option.charAt(0)}
                    checked={answers[currentQuestion.id]?.includes(option.charAt(0)) || false}
                    onChange={(e) => {
                      const currentAnswers = answers[currentQuestion.id] || [];
                      if (e.target.checked) {
                        handleAnswer(currentQuestion.id, [...currentAnswers, e.target.value]);
                      } else {
                        handleAnswer(currentQuestion.id, currentAnswers.filter((ans: string) => ans !== e.target.value));
                      }
                    }}
                    className="mt-1"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            
            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Précédent
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={finishExercise}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Terminer
                </button>
                
                <button
                  onClick={nextQuestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {currentQuestionIndex === currentExercise.questions.length - 1 ? 'Terminer' : 'Suivant →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Résultats */}
        {showResults && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Exercice terminé !</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">{calculateScore()}%</div>
              <p className="text-gray-600">Score obtenu</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="font-medium text-blue-900">Questions répondues</div>
                <div className="text-sm text-blue-700">
                  {Object.keys(answers).length}/{currentExercise.questions.length}
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="font-medium text-green-900">Points obtenus</div>
                <div className="text-sm text-green-700">
                  {Math.round((calculateScore() / 100) * currentExercise.points)}/{currentExercise.points}
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="font-medium text-purple-900">Temps utilisé</div>
                <div className="text-sm text-purple-700">
                  {currentExercise.duration - Math.floor(timeRemaining / 60)} min
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={restartExercise}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Recommencer
              </button>
              <button
                onClick={() => setCurrentExercise(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Autres exercices
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              🎯 Exercices pratiques - Sélection de mesures
            </h1>
            <p className="text-gray-600">
              Maîtrisez la sélection et la priorisation des mesures de sécurité dans le contexte CHU
            </p>
          </div>
          
          {currentExercise && (
            <button
              onClick={() => setCurrentExercise(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              ← Retour aux exercices
            </button>
          )}
        </div>
      </div>

      {/* Contenu */}
      {currentExercise ? renderExerciseInterface() : renderExerciseOverview()}
    </div>
  );
};

export default TreatmentExerciseInterface;
