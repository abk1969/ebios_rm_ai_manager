/**
 * 🏥 EXEMPLE D'EXERCICE CHU
 * Démonstration de l'interface d'exercice interactif
 * Résout le problème de navigation observé dans la capture d'écran
 */

import React, { useState } from 'react';
import { InteractiveExerciseInterface, Exercise, ExerciseType } from './InteractiveExerciseInterface';

// 🎯 DONNÉES DE L'EXERCICE CHU
const CHU_EXERCISE: Exercise = {
  id: 'chu_ranking_exercise',
  title: 'Exercice 1: Cadrage et Périmètre CHU',
  description: 'Maîtriser la définition du périmètre d\'analyse EBIOS RM pour un CHU',
  type: ExerciseType.RANKING,
  question: 'Classez ces 8 enjeux métier par ordre de priorité pour le CHU (1=plus prioritaire) :',
  maxPoints: 25,
  timeLimit: 25,
  data: {
    items: [
      'Continuité des soins aux patients',
      'Protection des données de santé (RGPD)',
      'Sécurité des systèmes d\'information médicaux',
      'Conformité réglementaire (HAS, ANSSI)',
      'Gestion des urgences et situations de crise',
      'Recherche médicale et innovation',
      'Formation du personnel médical',
      'Optimisation des coûts opérationnels'
    ]
  },
  solution: [
    'Continuité des soins aux patients',
    'Sécurité des systèmes d\'information médicaux',
    'Protection des données de santé (RGPD)',
    'Gestion des urgences et situations de crise',
    'Conformité réglementaire (HAS, ANSSI)',
    'Formation du personnel médical',
    'Recherche médicale et innovation',
    'Optimisation des coûts opérationnels'
  ],
  hints: [
    'Dans un CHU, la priorité absolue est la sécurité des patients et la continuité des soins.',
    'Les données de santé sont particulièrement sensibles et protégées par le RGPD.',
    'Les systèmes d\'information médicaux sont critiques pour le fonctionnement du CHU.',
    'La conformité réglementaire est obligatoire mais peut être considérée après les enjeux opérationnels critiques.'
  ]
};

// 🎯 COMPOSANT PRINCIPAL
export const CHUExerciseExample: React.FC = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<{ answer: any; score: number } | null>(null);

  const handleComplete = (answer: any, score: number) => {
    setResult({ answer, score });
    setIsCompleted(true);
    
    // Simulation de sauvegarde
    console.log('Exercice complété:', { answer, score });
  };

  const handleSkip = () => {
    console.log('Exercice passé');
    // Navigation vers l'exercice suivant
  };

  const handleHelp = () => {
    console.log('Aide demandée');
    // Ouvrir le système d'aide contextuelle
  };

  const handleRestart = () => {
    setIsCompleted(false);
    setResult(null);
  };

  // 🎉 ÉCRAN DE RÉSULTAT
  if (isCompleted && result) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              result.score >= 20 ? 'bg-green-100' : result.score >= 15 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <span className={`text-3xl font-bold ${
                result.score >= 20 ? 'text-green-600' : result.score >= 15 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {result.score}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Exercice terminé !
            </h2>

            <p className="text-gray-600 mb-6">
              Vous avez obtenu {result.score} points sur {CHU_EXERCISE.maxPoints}
            </p>

            {/* Feedback selon le score */}
            <div className={`p-4 rounded-lg mb-6 ${
              result.score >= 20 
                ? 'bg-green-50 border border-green-200' 
                : result.score >= 15 
                ? 'bg-yellow-50 border border-yellow-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-medium ${
                result.score >= 20 ? 'text-green-800' : result.score >= 15 ? 'text-yellow-800' : 'text-red-800'
              }`}>
                {result.score >= 20 
                  ? '🎉 Excellent ! Vous maîtrisez parfaitement les priorités d\'un CHU.'
                  : result.score >= 15 
                  ? '👍 Bien joué ! Quelques ajustements à faire sur les priorités.'
                  : '📚 Il faut revoir les enjeux prioritaires d\'un établissement de santé.'
                }
              </p>
            </div>

            {/* Votre classement */}
            <div className="text-left mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Votre classement :</h3>
              <div className="space-y-2">
                {result.answer.map((item: string, index: number) => {
                  const correctIndex = CHU_EXERCISE.solution!.indexOf(item);
                  const isCorrectPosition = correctIndex === index;
                  
                  return (
                    <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                      isCorrectPosition ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                        isCorrectPosition ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {index + 1}
                      </span>
                      <span className="flex-1">{item}</span>
                      {!isCorrectPosition && (
                        <span className="text-sm text-red-600">
                          (Position correcte: {correctIndex + 1})
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleRestart}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Recommencer
              </button>
              
              <button
                onClick={() => console.log('Exercice suivant')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Exercice suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🎯 INTERFACE D'EXERCICE
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Contexte de l'exercice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-blue-900 mb-2">
          📍 Contexte : CHU Métropolitain
        </h2>
        <p className="text-blue-800 text-sm">
          Vous travaillez pour un Centre Hospitalier Universitaire de 1200 lits, 
          avec 4500 employés et 15 services médicaux. Votre mission est de définir 
          le périmètre d'analyse EBIOS RM en identifiant les enjeux métier prioritaires.
        </p>
      </div>

      {/* Interface d'exercice */}
      <InteractiveExerciseInterface
        exercise={CHU_EXERCISE}
        onComplete={handleComplete}
        onSkip={handleSkip}
        onHelp={handleHelp}
      />

      {/* Instructions supplémentaires */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">💡 Instructions :</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Glissez-déposez les enjeux de la liste de gauche vers la zone de classement</li>
          <li>• Classez du plus prioritaire (position 1) au moins prioritaire (position 8)</li>
          <li>• Pensez aux impacts sur la sécurité des patients et la continuité des soins</li>
          <li>• Utilisez les indices si vous avez besoin d'aide</li>
        </ul>
      </div>
    </div>
  );
};

export default CHUExerciseExample;
