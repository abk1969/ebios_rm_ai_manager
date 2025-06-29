/**
 * 🎯 INTERFACE ATELIER EBIOS RM INDIVIDUEL
 * Interface professionnelle pour un atelier spécifique avec progression réelle
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Target, 
  BookOpen,
  FileText,
  Award,
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  Send,
  Lightbulb,
  Users,
  TrendingUp
} from 'lucide-react';

// 🎯 TYPES POUR L'INTERFACE ATELIER
interface WorkshopStep {
  id: string;
  title: string;
  description: string;
  type: 'theory' | 'exercise' | 'validation' | 'case_study';
  duration: number;
  content: string;
  exercises?: Exercise[];
  validation?: ValidationCriteria;
  completed: boolean;
  score?: number;
}

interface Exercise {
  id: string;
  question: string;
  type: 'multiple_choice' | 'open_text' | 'drag_drop' | 'scenario';
  options?: string[];
  correctAnswer?: string | number;
  explanation: string;
  points: number;
  userAnswer?: string | number;
  isCorrect?: boolean;
}

interface ValidationCriteria {
  minScore: number;
  requiredSteps: string[];
  expertValidation: boolean;
}

interface WorkshopProgress {
  currentStepIndex: number;
  completedSteps: string[];
  totalScore: number;
  maxScore: number;
  timeSpent: number;
  startTime: Date;
  answers: Record<string, any>;
}

// 🎯 PROPS DU COMPOSANT
interface EbiosWorkshopInterfaceProps {
  workshopId: number;
  workshopData: {
    title: string;
    subtitle: string;
    description: string;
    objectives: string[];
    steps: WorkshopStep[];
    duration: number;
  };
  onComplete: (score: number, answers: Record<string, any>) => void;
  onExit: () => void;
  onProgressUpdate: (progress: WorkshopProgress) => void;
}

export const EbiosWorkshopInterface: React.FC<EbiosWorkshopInterfaceProps> = ({
  workshopId,
  workshopData,
  onComplete,
  onExit,
  onProgressUpdate
}) => {
  // 🎯 ÉTAT DE L'ATELIER
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState<WorkshopProgress>({
    currentStepIndex: 0,
    completedSteps: [],
    totalScore: 0,
    maxScore: 0,
    timeSpent: 0,
    startTime: new Date(),
    answers: {}
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [stepStartTime, setStepStartTime] = useState<Date>(new Date());

  const currentStep = workshopData.steps[currentStepIndex];
  const isLastStep = currentStepIndex === workshopData.steps.length - 1;
  const completionRate = (progress.completedSteps.length / workshopData.steps.length) * 100;

  // ⏱️ TIMER POUR LE TEMPS PASSÉ
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = {
            ...prev,
            timeSpent: Math.floor((Date.now() - prev.startTime.getTime()) / 1000)
          };
          onProgressUpdate(newProgress);
          return newProgress;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, onProgressUpdate]);

  // 🎯 DÉMARRER L'ATELIER
  const startWorkshop = () => {
    setIsPlaying(true);
    setStepStartTime(new Date());
  };

  // ➡️ ÉTAPE SUIVANTE
  const nextStep = () => {
    if (currentStepIndex < workshopData.steps.length - 1) {
      // Marquer l'étape comme terminée
      const newCompletedSteps = [...progress.completedSteps];
      if (!newCompletedSteps.includes(currentStep.id)) {
        newCompletedSteps.push(currentStep.id);
      }

      setProgress(prev => ({
        ...prev,
        currentStepIndex: currentStepIndex + 1,
        completedSteps: newCompletedSteps
      }));
      
      setCurrentStepIndex(currentStepIndex + 1);
      setCurrentAnswer('');
      setShowExplanation(false);
      setStepStartTime(new Date());
    }
  };

  // ⬅️ ÉTAPE PRÉCÉDENTE
  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setProgress(prev => ({
        ...prev,
        currentStepIndex: currentStepIndex - 1
      }));
      setCurrentAnswer('');
      setShowExplanation(false);
    }
  };

  // ✅ VALIDER UNE RÉPONSE
  const validateAnswer = () => {
    if (!currentStep.exercises || currentStep.exercises.length === 0) return;

    const exercise = currentStep.exercises[0]; // Première exercice de l'étape
    let isCorrect = false;
    let points = 0;

    if (exercise.type === 'multiple_choice') {
      isCorrect = parseInt(currentAnswer) === exercise.correctAnswer;
      points = isCorrect ? exercise.points : 0;
    } else if (exercise.type === 'open_text') {
      // Validation basique pour texte libre (à améliorer avec IA)
      isCorrect = currentAnswer.length >= 50; // Au moins 50 caractères
      points = isCorrect ? exercise.points : Math.floor(exercise.points * 0.5);
    }

    // Mettre à jour le score
    setProgress(prev => ({
      ...prev,
      totalScore: prev.totalScore + points,
      answers: {
        ...prev.answers,
        [exercise.id]: {
          answer: currentAnswer,
          isCorrect,
          points,
          timestamp: new Date()
        }
      }
    }));

    setShowExplanation(true);
  };

  // 🏁 TERMINER L'ATELIER
  const completeWorkshop = () => {
    const finalScore = (progress.totalScore / progress.maxScore) * 100;
    onComplete(finalScore, progress.answers);
  };

  // 🎯 RENDU DE L'EN-TÊTE
  const renderHeader = () => (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onExit}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux ateliers
          </button>
          
          <div className="border-l border-gray-300 pl-4">
            <h1 className="text-xl font-bold text-gray-900">{workshopData.title}</h1>
            <p className="text-sm text-blue-600">{workshopData.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Progression */}
          <div className="text-right">
            <div className="text-sm text-gray-600">Progression</div>
            <div className="text-lg font-bold text-blue-600">{completionRate.toFixed(0)}%</div>
          </div>

          {/* Score */}
          <div className="text-right">
            <div className="text-sm text-gray-600">Score</div>
            <div className="text-lg font-bold text-green-600">{progress.totalScore}/{progress.maxScore}</div>
          </div>

          {/* Temps */}
          <div className="text-right">
            <div className="text-sm text-gray-600">Temps</div>
            <div className="text-lg font-bold text-gray-900">
              {Math.floor(progress.timeSpent / 60)}:{(progress.timeSpent % 60).toString().padStart(2, '0')}
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex space-x-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>
    </div>
  );

  // 📋 RENDU DU CONTENU DE L'ÉTAPE
  const renderStepContent = () => {
    if (!currentStep) return null;

    return (
      <div className="max-w-4xl mx-auto">
        {/* En-tête de l'étape */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${currentStep.type === 'theory' ? 'bg-blue-100 text-blue-600' :
                    currentStep.type === 'exercise' ? 'bg-green-100 text-green-600' :
                    currentStep.type === 'validation' ? 'bg-purple-100 text-purple-600' :
                    'bg-orange-100 text-orange-600'
                  }
                `}>
                  {currentStep.type === 'theory' && <BookOpen className="w-5 h-5" />}
                  {currentStep.type === 'exercise' && <Target className="w-5 h-5" />}
                  {currentStep.type === 'validation' && <CheckCircle className="w-5 h-5" />}
                  {currentStep.type === 'case_study' && <Users className="w-5 h-5" />}
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{currentStep.title}</h2>
                  <p className="text-gray-600">{currentStep.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {currentStep.duration} min
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  Étape {currentStepIndex + 1}/{workshopData.steps.length}
                </div>
                {currentStep.completed && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Terminé
                  </div>
                )}
              </div>
            </div>

            <div className="ml-6">
              <div className={`
                px-3 py-1 rounded-full text-xs font-medium
                ${currentStep.type === 'theory' ? 'bg-blue-100 text-blue-800' :
                  currentStep.type === 'exercise' ? 'bg-green-100 text-green-800' :
                  currentStep.type === 'validation' ? 'bg-purple-100 text-purple-800' :
                  'bg-orange-100 text-orange-800'
                }
              `}>
                {currentStep.type === 'theory' && '📚 Théorie'}
                {currentStep.type === 'exercise' && '🎯 Exercice'}
                {currentStep.type === 'validation' && '✅ Validation'}
                {currentStep.type === 'case_study' && '📋 Cas d\'étude'}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
          {/* Contenu textuel */}
          <div className="prose max-w-none mb-8">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {currentStep.content}
            </div>
          </div>

          {/* Exercices */}
          {currentStep.exercises && currentStep.exercises.length > 0 && (
            <div className="border-t border-gray-200 pt-8">
              {currentStep.exercises.map((exercise, index) => (
                <div key={exercise.id} className="mb-8">
                  <div className="bg-blue-50 rounded-lg p-6 mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{exercise.question}</h3>
                        
                        {exercise.type === 'multiple_choice' && exercise.options && (
                          <div className="space-y-2">
                            {exercise.options.map((option, optionIndex) => (
                              <label key={optionIndex} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`exercise-${exercise.id}`}
                                  value={optionIndex}
                                  checked={currentAnswer === optionIndex.toString()}
                                  onChange={(e) => setCurrentAnswer(e.target.value)}
                                  className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-gray-700">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {exercise.type === 'open_text' && (
                          <textarea
                            value={currentAnswer}
                            onChange={(e) => setCurrentAnswer(e.target.value)}
                            placeholder="Saisissez votre réponse détaillée..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                          />
                        )}

                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            💎 {exercise.points} points
                          </div>
                          
                          {!showExplanation && (
                            <button
                              onClick={validateAnswer}
                              disabled={!currentAnswer}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              Valider
                            </button>
                          )}
                        </div>

                        {/* Explication */}
                        {showExplanation && (
                          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-yellow-800 mb-1">Explication</h4>
                                <p className="text-yellow-700 text-sm">{exercise.explanation}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={previousStep}
              disabled={currentStepIndex === 0}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Étape précédente
            </button>

            <div className="flex items-center space-x-4">
              {/* Indicateurs d'étapes */}
              <div className="flex space-x-2">
                {workshopData.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`
                      w-3 h-3 rounded-full
                      ${index === currentStepIndex ? 'bg-blue-600' :
                        progress.completedSteps.includes(step.id) ? 'bg-green-600' :
                        'bg-gray-300'
                      }
                    `}
                  />
                ))}
              </div>

              {isLastStep ? (
                <button
                  onClick={completeWorkshop}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Terminer l'atelier
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  Étape suivante
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 🎯 ÉCRAN DE DÉMARRAGE
  if (!isPlaying && progress.timeSpent === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {renderHeader()}
        
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Prêt à commencer l'atelier {workshopId} ?
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              {workshopData.description}
            </p>

            {/* Objectifs */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left max-w-2xl mx-auto">
              <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Objectifs de cet atelier
              </h3>
              <ul className="space-y-2">
                {workshopData.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start text-blue-800">
                    <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-blue-600" />
                    {objective}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={startWorkshop}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold flex items-center mx-auto"
            >
              <Play className="w-5 h-5 mr-2" />
              Commencer l'atelier
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🎯 RENDU PRINCIPAL
  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      
      <div className="p-6">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default EbiosWorkshopInterface;
