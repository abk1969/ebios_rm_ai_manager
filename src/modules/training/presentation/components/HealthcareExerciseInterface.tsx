/**
 * 🎯 INTERFACE EXERCICES ÉCOSYSTÈME MENACES SANTÉ
 * Composant interactif pour les exercices pratiques spécialisés
 */

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target, 
  Brain, 
  Shield, 
  AlertTriangle,
  BookOpen,
  Award,
  TrendingUp,
  Eye,
  Lightbulb,
  FileText
} from 'lucide-react';
import HealthcareThreatEcosystemExercises, { 
  HealthcareExercise, 
  ExerciseQuestion, 
  ExerciseResult 
} from '../../domain/exercises/HealthcareThreatEcosystemExercises';

// 🎯 PROPS DU COMPOSANT
interface HealthcareExerciseInterfaceProps {
  exerciseId?: string;
  onExerciseComplete?: (results: ExerciseResult[]) => void;
  onScoreUpdate?: (score: number, maxScore: number) => void;
}

export const HealthcareExerciseInterface: React.FC<HealthcareExerciseInterfaceProps> = ({
  exerciseId,
  onExerciseComplete,
  onScoreUpdate
}) => {
  const [currentExercise, setCurrentExercise] = useState<HealthcareExercise | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // 🎯 CHARGEMENT DE L'EXERCICE
  useEffect(() => {
    const exercises = HealthcareThreatEcosystemExercises.getAllHealthcareExercises();
    const exercise = exerciseId 
      ? exercises.find(e => e.id === exerciseId)
      : exercises[0]; // Premier exercice par défaut
    
    if (exercise) {
      setCurrentExercise(exercise);
      setStartTime(new Date());
    }
  }, [exerciseId]);

  // ⏱️ TIMER
  useEffect(() => {
    if (startTime && !isCompleted) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, isCompleted]);

  // 🎯 GESTION DES RÉPONSES
  const handleAnswer = (questionId: string, answer: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // 🎯 VALIDATION D'UNE QUESTION
  const validateQuestion = () => {
    if (!currentExercise) return;
    
    const question = currentExercise.questions[currentQuestionIndex];
    const userAnswer = userAnswers[question.id];
    
    if (!userAnswer) {
      alert('Veuillez répondre à la question avant de continuer.');
      return;
    }

    try {
      const result = HealthcareThreatEcosystemExercises.evaluateAnswer(
        currentExercise.id,
        question.id,
        userAnswer
      );
      
      setResults(prev => [...prev, result]);
      setShowExplanation(true);
      
      // Mise à jour du score
      const newTotalScore = [...results, result].reduce((sum, r) => sum + r.pointsEarned, 0);
      const maxScore = currentExercise.questions.reduce((sum, q) => sum + q.points, 0);
      onScoreUpdate?.(newTotalScore, maxScore);
      
    } catch (error) {
      console.error('Erreur lors de l\'évaluation:', error);
    }
  };

  // 🎯 QUESTION SUIVANTE
  const nextQuestion = () => {
    if (!currentExercise) return;
    
    setShowExplanation(false);
    
    if (currentQuestionIndex < currentExercise.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Exercice terminé
      setIsCompleted(true);
      onExerciseComplete?.(results);
    }
  };

  // 🎯 RENDU D'UNE QUESTION
  const renderQuestion = (question: ExerciseQuestion) => {
    const userAnswer = userAnswers[question.id];
    const result = results.find(r => r.questionId === question.id);
    
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {/* En-tête question */}
        <div className="flex items-start space-x-4 mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            question.type === 'multiple_choice' ? 'bg-blue-100 text-blue-600' :
            question.type === 'multiple_select' ? 'bg-green-100 text-green-600' :
            question.type === 'scenario_analysis' ? 'bg-purple-100 text-purple-600' :
            question.type === 'threat_modeling' ? 'bg-red-100 text-red-600' :
            'bg-orange-100 text-orange-600'
          }`}>
            {question.type === 'multiple_choice' && <Target className="w-5 h-5" />}
            {question.type === 'multiple_select' && <CheckCircle className="w-5 h-5" />}
            {question.type === 'scenario_analysis' && <Brain className="w-5 h-5" />}
            {question.type === 'threat_modeling' && <Shield className="w-5 h-5" />}
            {question.type === 'risk_matrix' && <TrendingUp className="w-5 h-5" />}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{question.question}</h3>
            {question.context && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-600 mt-1" />
                  <div className="text-sm text-blue-800">{question.context}</div>
                </div>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Question {currentQuestionIndex + 1}/{currentExercise?.questions.length}</div>
            <div className="text-sm font-medium text-blue-600">{question.points} points</div>
          </div>
        </div>

        {/* Interface de réponse */}
        <div className="mb-6">
          {question.type === 'multiple_choice' && (
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name={question.id}
                    value={index}
                    checked={userAnswer === index}
                    onChange={(e) => handleAnswer(question.id, parseInt(e.target.value))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          )}

          {question.type === 'multiple_select' && (
            <div className="space-y-3">
              {question.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    value={index}
                    checked={userAnswer?.includes(index) || false}
                    onChange={(e) => {
                      const currentAnswers = userAnswer || [];
                      const newAnswers = e.target.checked
                        ? [...currentAnswers, index]
                        : currentAnswers.filter((a: number) => a !== index);
                      handleAnswer(question.id, newAnswers);
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-gray-900">{option}</span>
                </label>
              ))}
            </div>
          )}

          {(question.type === 'open_text' || question.type === 'scenario_analysis' || 
            question.type === 'threat_modeling' || question.type === 'risk_matrix') && (
            <textarea
              value={userAnswer || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              placeholder="Rédigez votre réponse détaillée ici..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
        </div>

        {/* Indices */}
        {question.hints && !showExplanation && (
          <div className="mb-4">
            <button
              onClick={() => setShowExplanation(true)}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Voir les indices</span>
            </button>
          </div>
        )}

        {/* Explication et résultat */}
        {showExplanation && result && (
          <div className={`border rounded-lg p-4 ${
            result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-start space-x-3">
              {result.isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 mt-1" />
              )}
              <div className="flex-1">
                <div className={`font-medium mb-2 ${
                  result.isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.isCorrect ? 'Excellente réponse !' : 'Réponse incorrecte'}
                  <span className="ml-2">({result.pointsEarned}/{question.points} points)</span>
                </div>
                <div className={`text-sm mb-3 ${
                  result.isCorrect ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.feedback}
                </div>
                
                {/* Explication détaillée */}
                <div className="bg-white border rounded p-3 mb-3">
                  <div className="font-medium text-gray-900 mb-2">📚 Explication détaillée :</div>
                  <div className="text-sm text-gray-700 whitespace-pre-line">{question.explanation}</div>
                </div>

                {/* Insight expert */}
                {question.expertInsight && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                    <div className="flex items-start space-x-2">
                      <Award className="w-4 h-4 text-blue-600 mt-1" />
                      <div>
                        <div className="font-medium text-blue-900 text-sm">💡 Insight expert :</div>
                        <div className="text-sm text-blue-800">{question.expertInsight}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Référence ANSSI */}
                {question.anssiReference && (
                  <div className="bg-gray-50 border rounded p-3">
                    <div className="flex items-start space-x-2">
                      <FileText className="w-4 h-4 text-gray-600 mt-1" />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">📋 Référence ANSSI :</div>
                        <div className="text-sm text-gray-700">{question.anssiReference}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Suggestions d'amélioration */}
                {!result.isCorrect && result.improvementSuggestions.length > 0 && (
                  <div className="mt-3">
                    <div className="font-medium text-red-800 text-sm mb-2">🎯 Suggestions d'amélioration :</div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {result.improvementSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span>•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>Difficulté: {currentExercise?.difficulty}</span>
            </div>
          </div>
          
          <div className="space-x-3">
            {!showExplanation ? (
              <button
                onClick={validateQuestion}
                disabled={!userAnswers[question.id]}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Valider la réponse
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {currentQuestionIndex < (currentExercise?.questions.length || 0) - 1 ? 'Question suivante' : 'Terminer l\'exercice'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 🎯 ÉCRAN DE RÉSULTATS
  const renderResults = () => {
    const overallScore = HealthcareThreatEcosystemExercises.calculateOverallScore(results);
    
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Exercice terminé !</h2>
          <p className="text-gray-600">{currentExercise?.title}</p>
        </div>

        {/* Score global */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-900 mb-2">
              {overallScore.percentage}%
            </div>
            <div className="text-blue-700 mb-2">
              {overallScore.totalPoints} / {overallScore.maxPoints} points
            </div>
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              overallScore.level === 'Expert' ? 'bg-green-100 text-green-800' :
              overallScore.level === 'Avancé' ? 'bg-blue-100 text-blue-800' :
              overallScore.level === 'Intermédiaire' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              Niveau: {overallScore.level}
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="font-medium text-gray-900 mb-2">📝 Feedback :</div>
          <div className="text-gray-700">{overallScore.feedback}</div>
        </div>

        {/* Détail par question */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">📊 Détail par question :</h3>
          {results.map((result, index) => (
            <div key={result.questionId} className={`border rounded-lg p-4 ${
              result.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {result.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="font-medium">Question {index + 1}</span>
                </div>
                <div className="text-sm font-medium">
                  {result.pointsEarned} / {currentExercise?.questions[index].points} points
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Objectifs d'apprentissage */}
        {currentExercise?.learningObjectives && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">🎯 Objectifs d'apprentissage atteints :</h3>
            <ul className="space-y-2">
              {currentExercise.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-start space-x-2 text-blue-800">
                  <CheckCircle className="w-4 h-4 mt-1 text-blue-600" />
                  <span className="text-sm">{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  if (!currentExercise) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <div className="text-gray-600">Exercice non trouvé</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* En-tête exercice */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{currentExercise.title}</h1>
            <p className="text-gray-600 mb-4">{currentExercise.description}</p>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Durée estimée: {currentExercise.duration} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>Difficulté: {currentExercise.difficulty}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Brain className="w-4 h-4" />
                <span>Catégorie: {currentExercise.category.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {results.reduce((sum, r) => sum + r.pointsEarned, 0)} pts
            </div>
            <div className="text-sm text-gray-500">
              / {currentExercise.questions.reduce((sum, q) => sum + q.points, 0)} pts
            </div>
          </div>
        </div>
      </div>

      {/* Contexte exercice */}
      {currentExercise.context && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">📋 Contexte de l'exercice :</h3>
          <div className="text-blue-800 whitespace-pre-line">{currentExercise.context}</div>
        </div>
      )}

      {/* Question ou résultats */}
      {!isCompleted ? (
        renderQuestion(currentExercise.questions[currentQuestionIndex])
      ) : (
        renderResults()
      )}

      {/* Exemple du monde réel */}
      {currentExercise.realWorldExample && !isCompleted && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-orange-900 mb-3">🌍 Exemple du monde réel :</h3>
          <div className="text-orange-800 text-sm whitespace-pre-line">{currentExercise.realWorldExample}</div>
        </div>
      )}
    </div>
  );
};

export default HealthcareExerciseInterface;
