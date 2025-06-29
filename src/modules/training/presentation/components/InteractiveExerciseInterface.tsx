/**
 * 🎯 INTERFACE D'EXERCICE INTERACTIF
 * Composant pour résoudre le problème de navigation dans les exercices
 * Interface claire et guidée pour les apprenants
 */

import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle,
  RotateCcw,
  Play,
  Clock,
  Target
} from 'lucide-react';

// 🎯 TYPES D'EXERCICES
export enum ExerciseType {
  RANKING = 'ranking',
  MULTIPLE_CHOICE = 'multiple_choice',
  TEXT_INPUT = 'text_input',
  DRAG_DROP = 'drag_drop',
  CLASSIFICATION = 'classification'
}

// 🎯 INTERFACE D'EXERCICE
export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: ExerciseType;
  question: string;
  data: any; // Données spécifiques selon le type
  maxPoints: number;
  timeLimit?: number; // minutes
  hints?: string[];
  solution?: any;
}

// 🎯 PROPS DU COMPOSANT
interface InteractiveExerciseInterfaceProps {
  exercise: Exercise;
  onComplete: (answer: any, score: number) => void;
  onSkip?: () => void;
  onHelp?: () => void;
  className?: string;
}

// 🎯 COMPOSANT PRINCIPAL
export const InteractiveExerciseInterface: React.FC<InteractiveExerciseInterfaceProps> = ({
  exercise,
  onComplete,
  onSkip,
  onHelp,
  className = ''
}) => {
  const [answer, setAnswer] = useState<any>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // ⏱️ TIMER
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isStarted && !isSubmitted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStarted, isSubmitted]);

  // 🎮 GESTIONNAIRES D'ÉVÉNEMENTS
  const handleStart = () => {
    setIsStarted(true);
    setTimeSpent(0);
  };

  const handleReset = () => {
    setAnswer(null);
    setIsStarted(false);
    setTimeSpent(0);
    setShowHint(false);
    setCurrentHintIndex(0);
    setIsSubmitted(false);
  };

  const handleSubmit = () => {
    if (!answer) return;
    
    setIsSubmitted(true);
    const score = calculateScore(answer);
    onComplete(answer, score);
  };

  const handleHint = () => {
    if (exercise.hints && exercise.hints.length > 0) {
      setShowHint(true);
      if (currentHintIndex < exercise.hints.length - 1) {
        setCurrentHintIndex(prev => prev + 1);
      }
    } else {
      onHelp?.();
    }
  };

  // 📊 CALCULER LE SCORE
  const calculateScore = (userAnswer: any): number => {
    // Logique de calcul selon le type d'exercice
    switch (exercise.type) {
      case ExerciseType.RANKING:
        return calculateRankingScore(userAnswer);
      case ExerciseType.MULTIPLE_CHOICE:
        return calculateMultipleChoiceScore(userAnswer);
      default:
        return 0;
    }
  };

  const calculateRankingScore = (userRanking: string[]): number => {
    if (!exercise.solution || !Array.isArray(userRanking)) return 0;
    
    const correctRanking = exercise.solution;
    let score = 0;
    const maxScore = exercise.maxPoints;
    
    // Score basé sur la position correcte
    userRanking.forEach((item, index) => {
      const correctIndex = correctRanking.indexOf(item);
      if (correctIndex !== -1) {
        const positionDiff = Math.abs(index - correctIndex);
        const itemScore = Math.max(0, (correctRanking.length - positionDiff) / correctRanking.length);
        score += itemScore;
      }
    });
    
    return Math.round((score / correctRanking.length) * maxScore);
  };

  const calculateMultipleChoiceScore = (userAnswer: string | string[]): number => {
    if (!exercise.solution) return 0;
    
    if (Array.isArray(userAnswer) && Array.isArray(exercise.solution)) {
      const correct = userAnswer.filter(ans => exercise.solution.includes(ans)).length;
      const total = exercise.solution.length;
      return Math.round((correct / total) * exercise.maxPoints);
    } else {
      return userAnswer === exercise.solution ? exercise.maxPoints : 0;
    }
  };

  // 🎨 FORMATER LE TEMPS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 🎯 VÉRIFIER SI LA RÉPONSE EST VALIDE
  const isAnswerValid = (): boolean => {
    if (!answer) return false;
    
    switch (exercise.type) {
      case ExerciseType.RANKING:
        return Array.isArray(answer) && answer.length > 0;
      case ExerciseType.MULTIPLE_CHOICE:
        return answer !== null && answer !== undefined;
      case ExerciseType.TEXT_INPUT:
        return typeof answer === 'string' && answer.trim().length > 0;
      default:
        return false;
    }
  };

  // 📱 ÉCRAN D'ACCUEIL
  if (!isStarted) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {exercise.title}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {exercise.description}
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="flex items-center text-blue-700">
                  <Target className="w-4 h-4 mr-1" />
                  {exercise.maxPoints} points
                </span>
                {exercise.timeLimit && (
                  <span className="flex items-center text-blue-700">
                    <Clock className="w-4 h-4 mr-1" />
                    {exercise.timeLimit} min max
                  </span>
                )}
              </div>
              <span className="text-blue-600 font-medium">
                Niveau: Intermédiaire
              </span>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Play className="w-5 h-5" />
            <span>Commencer l'exercice</span>
          </button>
        </div>
      </div>
    );
  }

  // 📱 INTERFACE PRINCIPALE D'EXERCICE
  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {/* En-tête avec progression */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{exercise.title}</h2>
          <div className="flex items-center space-x-4 text-sm">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(timeSpent)}
            </span>
            <span className="flex items-center">
              <Target className="w-4 h-4 mr-1" />
              {exercise.maxPoints} pts
            </span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {exercise.question}
        </h3>
        
        {/* Zone de réponse selon le type */}
        <div className="mb-6">
          {exercise.type === ExerciseType.RANKING && (
            <RankingExercise
              data={exercise.data}
              answer={answer}
              onChange={setAnswer}
            />
          )}
          
          {exercise.type === ExerciseType.MULTIPLE_CHOICE && (
            <MultipleChoiceExercise
              data={exercise.data}
              answer={answer}
              onChange={setAnswer}
            />
          )}
          
          {exercise.type === ExerciseType.TEXT_INPUT && (
            <TextInputExercise
              data={exercise.data}
              answer={answer}
              onChange={setAnswer}
            />
          )}
        </div>

        {/* Indice */}
        {showHint && exercise.hints && exercise.hints[currentHintIndex] && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-2">
              <HelpCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Indice {currentHintIndex + 1}</h4>
                <p className="text-yellow-700 text-sm mt-1">
                  {exercise.hints[currentHintIndex]}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-6 bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Recommencer</span>
            </button>

            <button
              onClick={handleHint}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Aide</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {onSkip && (
              <button
                onClick={onSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Passer
              </button>
            )}

            <button
              onClick={handleSubmit}
              disabled={!isAnswerValid() || isSubmitted}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                isAnswerValid() && !isSubmitted
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSubmitted ? 'Soumis' : 'Valider ma réponse'}</span>
            </button>
          </div>
        </div>

        {/* Message d'aide */}
        {!isAnswerValid() && (
          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span>Veuillez compléter votre réponse avant de valider</span>
          </div>
        )}
      </div>
    </div>
  );
};

// 🎯 COMPOSANT EXERCICE DE CLASSEMENT
interface RankingExerciseProps {
  data: { items: string[] };
  answer: string[] | null;
  onChange: (answer: string[]) => void;
}

const RankingExercise: React.FC<RankingExerciseProps> = ({ data, answer, onChange }) => {
  const [items, setItems] = useState<string[]>(data.items || []);
  const [rankedItems, setRankedItems] = useState<string[]>(answer || []);

  useEffect(() => {
    onChange(rankedItems);
  }, [rankedItems, onChange]);

  const handleDragStart = (e: React.DragEvent, item: string) => {
    e.dataTransfer.setData('text/plain', item);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const draggedItem = e.dataTransfer.getData('text/plain');
    
    const newRankedItems = [...rankedItems];
    const existingIndex = newRankedItems.indexOf(draggedItem);
    
    if (existingIndex !== -1) {
      newRankedItems.splice(existingIndex, 1);
    }
    
    newRankedItems.splice(targetIndex, 0, draggedItem);
    setRankedItems(newRankedItems);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Liste des éléments à classer */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Éléments à classer :</h4>
        <div className="space-y-2">
          {items.filter(item => !rankedItems.includes(item)).map((item, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-move hover:bg-blue-100 transition-colors"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Zone de classement */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Votre classement (du plus prioritaire au moins prioritaire) :</h4>
        <div className="space-y-2 min-h-[200px]">
          {rankedItems.map((item, index) => (
            <div
              key={index}
              onDrop={(e) => handleDrop(e, index)}
              onDragOver={handleDragOver}
              className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3"
            >
              <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <span>{item}</span>
            </div>
          ))}
          
          {/* Zone de drop vide */}
          {rankedItems.length < items.length && (
            <div
              onDrop={(e) => handleDrop(e, rankedItems.length)}
              onDragOver={handleDragOver}
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-500"
            >
              Glissez les éléments ici pour les classer
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 🎯 COMPOSANT CHOIX MULTIPLE (Placeholder)
const MultipleChoiceExercise: React.FC<any> = ({ data, answer, onChange }) => {
  return (
    <div className="space-y-3">
      {data.options?.map((option: string, index: number) => (
        <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type={data.multiple ? 'checkbox' : 'radio'}
            name="choice"
            value={option}
            checked={data.multiple ? answer?.includes(option) : answer === option}
            onChange={(e) => {
              if (data.multiple) {
                const newAnswer = answer || [];
                if (e.target.checked) {
                  onChange([...newAnswer, option]);
                } else {
                  onChange(newAnswer.filter((a: string) => a !== option));
                }
              } else {
                onChange(option);
              }
            }}
            className="w-4 h-4 text-blue-600"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
};

// 🎯 COMPOSANT SAISIE TEXTE (Placeholder)
const TextInputExercise: React.FC<any> = ({ data, answer, onChange }) => {
  return (
    <textarea
      value={answer || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={data.placeholder || 'Saisissez votre réponse...'}
      className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  );
};

export default InteractiveExerciseInterface;
