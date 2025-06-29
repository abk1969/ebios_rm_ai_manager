/**
 * ⚙️ INTERFACE EXERCICES MODES OPÉRATOIRES
 * Interface interactive pour les exercices pratiques d'analyse technique
 */

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Clock, 
  Target, 
  CheckCircle, 
  XCircle,
  Star,
  Settings,
  Brain,
  Search,
  GitBranch,
  ArrowRight,
  Lightbulb,
  Award,
  TrendingUp,
  AlertTriangle,
  Eye,
  Activity,
  Shield
} from 'lucide-react';
import OperationalModesExercises, { OperationalModeExercise, OperationalQuestion, ExerciseResult } from '../../domain/exercises/OperationalModesExercises';

// 🎯 PROPS DU COMPOSANT
interface OperationalModesExerciseInterfaceProps {
  selectedExercise?: string;
  onExerciseComplete?: (exerciseId: string, results: ExerciseResult[]) => void;
  onExerciseSelect?: (exerciseId: string) => void;
}

export const OperationalModesExerciseInterface: React.FC<OperationalModesExerciseInterfaceProps> = ({
  selectedExercise,
  onExerciseComplete,
  onExerciseSelect
}) => {
  const [currentExercise, setCurrentExercise] = useState<OperationalModeExercise | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState(false);

  // 📚 CHARGEMENT DES EXERCICES
  const exercises = OperationalModesExercises.getAllOperationalModesExercises();

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
  const startExercise = (exercise: OperationalModeExercise) => {
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
      const result = OperationalModesExercises.validateExerciseAnswer(
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
      'technical_analysis': 'bg-blue-100 text-blue-800 border-blue-200',
      'mitre_mapping': 'bg-purple-100 text-purple-800 border-purple-200',
      'ioc_identification': 'bg-orange-100 text-orange-800 border-orange-200',
      'timeline_construction': 'bg-green-100 text-green-800 border-green-200',
      'incident_simulation': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // 🎯 ICÔNE PAR CATÉGORIE
  const getCategoryIcon = (category: string) => {
    const icons = {
      'technical_analysis': Settings,
      'mitre_mapping': GitBranch,
      'ioc_identification': Search,
      'timeline_construction': Activity,
      'incident_simulation': AlertTriangle
    };
    return icons[category as keyof typeof icons] || Brain;
  };

  // 🎯 RENDU SÉLECTION EXERCICE
  const renderExerciseSelection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          ⚙️ Exercices pratiques - Modes opératoires techniques
        </h2>
        <p className="text-gray-600 mb-4">
          Maîtrisez l'analyse technique des modes opératoires avec des exercices spécialisés CHU
        </p>
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{exercises.length}</div>
            <div className="text-sm text-blue-700">Exercices</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{OperationalModesExercises.getTotalDuration()}</div>
            <div className="text-sm text-green-700">Minutes</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{OperationalModesExercises.getTotalPoints()}</div>
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
                        'bg-blue-100 text-blue-700'
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

              {/* Exemple du monde réel */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-1">🌍 Exemple du monde réel :</h5>
                <p className="text-sm text-gray-700">{exercise.realWorldExample}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // 📝 RENDU QUESTION
  const renderQuestion = (question: OperationalQuestion) => {
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
          {(question.type === 'technical_decomposition' || question.type === 'mitre_selection') && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <label key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type={question.correctAnswers && Array.isArray(question.correctAnswers) && question.correctAnswers.length > 1 ? 'checkbox' : 'radio'}
                    name={question.id}
                    value={index}
                    checked={
                      Array.isArray(userAnswer) ? userAnswer.includes(index) : userAnswer === index
                    }
                    onChange={(e) => {
                      if (question.correctAnswers && Array.isArray(question.correctAnswers) && question.correctAnswers.length > 1) {
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

          {(question.type === 'ioc_analysis' || question.type === 'timeline_ordering' || question.type === 'incident_response') && (
            <div className="space-y-4">
              <div className="bg-yellow-50 rounded-lg p-4">
                <h5 className="font-medium text-yellow-900 mb-2">💡 Instructions :</h5>
                <p className="text-yellow-800 text-sm">
                  Exercice d'analyse technique avancée - Développez votre analyse en détail
                </p>
              </div>
              <textarea
                value={userAnswer || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Développez votre analyse technique détaillée..."
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
      
      {/* Résultats à implémenter */}
    </div>
  );
};

export default OperationalModesExerciseInterface;
