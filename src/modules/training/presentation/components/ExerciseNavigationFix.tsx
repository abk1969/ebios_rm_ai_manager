/**
 * 🔧 CORRECTIF DE NAVIGATION D'EXERCICE
 * Composant pour remplacer l'interface d'exercice défaillante
 * Solution immédiate au problème de navigation observé
 */

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  BookOpen, 
  CheckCircle,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { CHUExerciseExample } from './CHUExerciseExample';

// 🎯 PROPS DU COMPOSANT
interface ExerciseNavigationFixProps {
  currentExerciseId?: string;
  onNavigateBack?: () => void;
  onNavigateNext?: () => void;
  onNavigateHome?: () => void;
  className?: string;
}

// 🎯 COMPOSANT PRINCIPAL
export const ExerciseNavigationFix: React.FC<ExerciseNavigationFixProps> = ({
  currentExerciseId = 'chu_ranking_exercise',
  onNavigateBack,
  onNavigateNext,
  onNavigateHome,
  className = ''
}) => {
  const [showOldInterface, setShowOldInterface] = useState(false);

  // 🎯 DÉTECTION DE L'INTERFACE PROBLÉMATIQUE
  useEffect(() => {
    // Vérifier si nous sommes sur l'ancienne interface problématique
    const hasOldInterfaceElements = document.querySelector('.exercise-old-interface');
    if (hasOldInterfaceElements) {
      setShowOldInterface(true);
    }
  }, []);

  return (
    <div className={`exercise-navigation-fix ${className}`}>
      {/* 🚨 BANNIÈRE D'ALERTE POUR L'ANCIENNE INTERFACE */}
      {showOldInterface && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Interface d'exercice améliorée</h3>
              <p className="text-red-700 text-sm mt-1">
                Nous avons détecté que vous utilisiez l'ancienne interface d'exercice. 
                Voici la nouvelle version améliorée avec une navigation claire et des instructions précises.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 🧭 NAVIGATION CLAIRE */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onNavigateHome}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Retour à l'accueil"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Accueil</span>
            </button>
            
            <div className="text-gray-400">›</div>
            
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-gray-900">Atelier 1 - Socle de Sécurité</span>
            </div>
            
            <div className="text-gray-400">›</div>
            
            <span className="text-blue-600 font-medium">Exercice 1</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Progression:</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            </div>
            <span className="text-sm font-medium text-gray-700">1/3</span>
          </div>
        </div>
      </div>

      {/* 📋 INFORMATIONS CONTEXTUELLES */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900">Objectif de l'exercice</h3>
            <p className="text-blue-800 text-sm mt-1">
              Apprendre à identifier et prioriser les enjeux métier d'un établissement de santé 
              dans le cadre d'une analyse EBIOS RM. Cette compétence est essentielle pour 
              définir correctement le périmètre d'analyse.
            </p>
          </div>
        </div>
      </div>

      {/* 🎯 NOUVELLE INTERFACE D'EXERCICE */}
      <CHUExerciseExample />

      {/* 🧭 NAVIGATION INFÉRIEURE */}
      <div className="mt-8 bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateBack}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au contenu</span>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.open('/help/exercise-guide', '_blank')}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Guide d'aide</span>
            </button>

            <button
              onClick={onNavigateNext}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              <span>Exercice suivant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 💡 CONSEILS D'UTILISATION */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-green-900">Nouvelle expérience d'exercice</h3>
            <div className="text-green-800 text-sm mt-1 space-y-1">
              <p>✅ <strong>Navigation claire :</strong> Boutons "Précédent" et "Suivant" bien visibles</p>
              <p>✅ <strong>Zone de réponse évidente :</strong> Glisser-déposer intuitif pour le classement</p>
              <p>✅ <strong>Instructions précises :</strong> Chaque étape est expliquée clairement</p>
              <p>✅ <strong>Aide contextuelle :</strong> Indices disponibles si besoin</p>
              <p>✅ <strong>Feedback immédiat :</strong> Validation et score en temps réel</p>
            </div>
          </div>
        </div>
      </div>

      {/* 🔧 INFORMATIONS TECHNIQUES (MODE DEBUG) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">🔧 Informations de débogage</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Exercice ID :</strong> {currentExerciseId}</p>
            <p><strong>Type :</strong> Exercice de classement (Ranking)</p>
            <p><strong>Points max :</strong> 25 points</p>
            <p><strong>Temps limite :</strong> 25 minutes</p>
            <p><strong>Statut :</strong> Interface corrigée ✅</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseNavigationFix;
