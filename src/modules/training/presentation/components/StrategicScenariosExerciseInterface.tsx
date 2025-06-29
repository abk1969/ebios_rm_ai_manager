/**
 * 🎯 INTERFACE EXERCICES SCÉNARIOS STRATÉGIQUES
 * Interface interactive pour les exercices pratiques de construction de scénarios
 */

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Clock, 
  Target, 
  CheckCircle, 
  XCircle,
  Star,
  Users,
  Brain,
  Map,
  GitBranch,
  ArrowRight,
  Lightbulb,
  Award,
  TrendingUp,
  AlertTriangle,
  Eye
} from 'lucide-react';
import StrategicScenariosExercises, { StrategicScenarioExercise, ScenarioQuestion, ExerciseResult } from '../../domain/exercises/StrategicScenariosExercises';

// 🎯 PROPS DU COMPOSANT
interface StrategicScenariosExerciseInterfaceProps {
  selectedExercise?: string;
  onExerciseComplete?: (exerciseId: string, results: ExerciseResult[]) => void;
  onExerciseSelect?: (exerciseId: string) => void;
}

export const StrategicScenariosExerciseInterface: React.FC<StrategicScenariosExerciseInterfaceProps> = ({
  selectedExercise,
  onExerciseComplete,
  onExerciseSelect
}) => {
  const [currentExercise, setCurrentExercise] = useState<StrategicScenarioExercise | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState(false);

  // 📚 CHARGEMENT DES EXERCICES
  const exercises = StrategicScenariosExercises.getAllStrategicScenariosExercises();

  // ⏱️ TIMER
  useEffect(() => {
    if (currentExercise && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleExerciseComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentExercise, timeRemaining]);

  // 🎯 DÉMARRAGE EXERCICE
  const startExercise = (exercise: StrategicScenarioExercise) => {
    setCurrentExercise(exercise);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setResults([]);
    setIsCompleted(false);
    setShowFeedback(false);
    setTimeRemaining(exercise.duration * 60); // Conversion en secondes
  };

  // 📝 GESTION DES RÉPONSES
  const handleAnswerChange = (questionId: string, answer: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // ➡️ QUESTION SUIVANTE
  const nextQuestion = () => {
    if (currentExercise && currentQuestionIndex < currentExercise.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleExerciseComplete();
    }
  };

  // ✅ FINALISATION EXERCICE
  const handleExerciseComplete = () => {
    if (!currentExercise) return;

    const exerciseResults: ExerciseResult[] = [];
    
    currentExercise.questions.forEach(question => {
      const userAnswer = userAnswers[question.id];
      const result = StrategicScenariosExercises.validateExerciseAnswer(
        currentExercise.id,
        question.id,
        userAnswer
      );
      exerciseResults.push(result);
    });

    setResults(exerciseResults);
    setIsCompleted(true);
    setShowFeedback(true);
    onExerciseComplete?.(currentExercise.id, exerciseResults);
  };

  // 🎨 COULEURS PAR CATÉGORIE
  const getCategoryColor = (category: string) => {
    const colors = {
      'guided_construction': 'bg-blue-100 text-blue-800 border-blue-200',
      'combination_matrix': 'bg-green-100 text-green-800 border-green-200',
      'likelihood_assessment': 'bg-purple-100 text-purple-800 border-purple-200',
      'risk_mapping': 'bg-orange-100 text-orange-800 border-orange-200',
      'role_playing': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // 🎯 ICÔNE PAR CATÉGORIE
  const getCategoryIcon = (category: string) => {
    const icons = {
      'guided_construction': Target,
      'combination_matrix': GitBranch,
      'likelihood_assessment': TrendingUp,
      'risk_mapping': Map,
      'role_playing': Users
    };
    return icons[category as keyof typeof icons] || Brain;
  };

  // 🎯 RENDU SÉLECTION EXERCICE
  const renderExerciseSelection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          🎯 Exercices pratiques - Construction de scénarios stratégiques
        </h2>
        <p className="text-gray-600 mb-4">
          Maîtrisez la construction de scénarios stratégiques avec des exercices spécialisés CHU
        </p>
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{exercises.length}</div>
            <div className="text-sm text-blue-700">Exercices</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{StrategicScenariosExercises.getTotalDuration()}</div>
            <div className="text-sm text-green-700">Minutes</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{StrategicScenariosExercises.getTotalPoints()}</div>
            <div className="text-sm text-purple-700">Points</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">5</div>
            <div className="text-sm text-orange-700">Catégories</div>
          </div>
        </div>
      </div>

      {/* Liste des exercices */}
      <div className="space-y-4">
        {exercises.map((exercise, index) => {
          const Icon = getCategoryIcon(exercise.category);
          
          return (
            <div key={exercise.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor(exercise.category)}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-lg font-semibold text-gray-900">
                        Exercice {index + 1}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        exercise.difficulty === 'expert' ? 'bg-red-100 text-red-700' :
                        exercise.difficulty === 'advanced' ? 'bg-orange-100 text-orange-700' :
                        exercise.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {exercise.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{exercise.title}</h3>
                    <p className="text-gray-600 mb-3">{exercise.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{exercise.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4" />
                        <span>{exercise.questions.reduce((sum, q) => sum + q.points, 0)} pts</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Brain className="w-4 h-4" />
                        <span>{exercise.questions.length} questions</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => startExercise(exercise)}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Commencer</span>
                </button>
              </div>

              {/* Objectifs d'apprentissage */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">🎯 Objectifs d'apprentissage :</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {exercise.learningObjectives.map((objective, objIndex) => (
                    <li key={objIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                      <span className="text-blue-600">•</span>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // 📝 RENDU QUESTION
  const renderQuestion = (question: ScenarioQuestion) => {
    const userAnswer = userAnswers[question.id];
    
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Question {currentQuestionIndex + 1} / {currentExercise?.questions.length}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / (currentExercise?.questions.length || 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">{question.question}</h4>
          
          {question.context && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-blue-900 mb-2">📋 Contexte :</h5>
              <div className="text-blue-800 whitespace-pre-line">{question.context}</div>
            </div>
          )}
        </div>

        {/* Rendu selon type de question */}
        <div className="mb-6">
          {question.type === 'scenario_construction' && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <label key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type={question.correctAnswers && question.correctAnswers.length > 1 ? 'checkbox' : 'radio'}
                    name={question.id}
                    value={index}
                    checked={
                      Array.isArray(userAnswer) ? userAnswer.includes(index) : userAnswer === index
                    }
                    onChange={(e) => {
                      if (question.correctAnswers && question.correctAnswers.length > 1) {
                        const currentAnswers = Array.isArray(userAnswer) ? userAnswer : [];
                        if (e.target.checked) {
                          handleAnswerChange(question.id, [...currentAnswers, index]);
                        } else {
                          handleAnswerChange(question.id, currentAnswers.filter(a => a !== index));
                        }
                      } else {
                        handleAnswerChange(question.id, index);
                      }
                    }}
                    className="mt-1"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'likelihood_factors' && (
            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-lg p-4">
                <h5 className="font-medium text-yellow-900 mb-2">💡 Instructions :</h5>
                <p className="text-yellow-800 text-sm">
                  Évaluez chaque facteur sur une échelle de 1 à 5 selon la grille ANSSI
                </p>
              </div>
              <textarea
                value={userAnswer || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Rédigez votre évaluation détaillée des facteurs de vraisemblance..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {(question.type === 'matrix_evaluation' || question.type === 'risk_positioning' || question.type === 'role_simulation') && (
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h5 className="font-medium text-green-900 mb-2">🎯 Instructions :</h5>
                <p className="text-green-800 text-sm">
                  Exercice pratique avancé - Développez votre réponse en détail
                </p>
              </div>
              <textarea
                value={userAnswer || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Développez votre réponse détaillée..."
                className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Boutons navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          
          <button
            onClick={nextQuestion}
            disabled={!userAnswers[question.id]}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>
              {currentQuestionIndex === (currentExercise?.questions.length || 1) - 1 ? 'Terminer' : 'Suivant'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // 📊 RENDU RÉSULTATS
  const renderResults = () => {
    const totalPoints = results.reduce((sum, r) => sum + r.pointsEarned, 0);
    const maxPoints = currentExercise?.questions.reduce((sum, q) => sum + q.points, 0) || 0;
    const percentage = Math.round((totalPoints / maxPoints) * 100);
    
    return (
      <div className="space-y-6">
        {/* Score global */}
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="mb-4">
            <div className="text-4xl font-bold text-blue-600 mb-2">{percentage}%</div>
            <div className="text-lg text-gray-700">Score obtenu</div>
            <div className="text-sm text-gray-500">{totalPoints} / {maxPoints} points</div>
          </div>
          
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${
            percentage >= 90 ? 'bg-green-100 text-green-800' :
            percentage >= 75 ? 'bg-blue-100 text-blue-800' :
            percentage >= 60 ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          }`}>
            <Award className="w-5 h-5" />
            <span className="font-medium">
              {percentage >= 90 ? 'Expert' :
               percentage >= 75 ? 'Avancé' :
               percentage >= 60 ? 'Intermédiaire' : 'Débutant'}
            </span>
          </div>
        </div>

        {/* Détail par question */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">📋 Détail des réponses</h3>
          
          {results.map((result, index) => {
            const question = currentExercise?.questions.find(q => q.id === result.questionId);
            
            return (
              <div key={result.questionId} className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-gray-900">
                    Question {index + 1}: {question?.question}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {result.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm font-medium">
                      {result.pointsEarned} / {question?.points} pts
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="text-sm text-gray-700 whitespace-pre-line">{result.feedback}</div>
                </div>
                
                {result.improvementSuggestions.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-blue-900 mb-1">Suggestions d'amélioration :</div>
                        <ul className="text-sm text-blue-800 space-y-1">
                          {result.improvementSuggestions.map((suggestion, suggIndex) => (
                            <li key={suggIndex}>• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setCurrentExercise(null);
              setIsCompleted(false);
            }}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Retour aux exercices
          </button>
          
          {currentExercise && (
            <button
              onClick={() => startExercise(currentExercise)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refaire l'exercice
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!currentExercise && renderExerciseSelection()}
      
      {currentExercise && !isCompleted && (
        <div>
          {/* En-tête exercice */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{currentExercise.title}</h2>
              <button
                onClick={() => setCurrentExercise(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600">{currentExercise.description}</p>
          </div>
          
          {renderQuestion(currentExercise.questions[currentQuestionIndex])}
        </div>
      )}
      
      {isCompleted && renderResults()}
    </div>
  );
};

export default StrategicScenariosExerciseInterface;
