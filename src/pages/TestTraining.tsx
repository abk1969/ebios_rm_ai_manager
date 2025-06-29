/**
 * 🧪 PAGE DE TEST DU MOTEUR IA STRUCTURANT
 * Contourne l'authentification pour tester directement le chat expert
 */

import React from 'react';
import { TrainingChatInterface } from '../modules/training/presentation/components/TrainingChatInterface';

const TestTraining: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header de test */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Test du Moteur IA Structurant EBIOS RM
          </h1>
          <p className="text-gray-600 mb-4">
            Page de test dédiée pour valider le nouveau moteur IA structurant sans authentification
          </p>
          
          {/* Instructions de test */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">🎯 Instructions de Test :</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li><strong>1.</strong> Tapez <code className="bg-blue-100 px-1 rounded">GO</code> pour démarrer</li>
              <li><strong>2.</strong> Tapez <code className="bg-blue-100 px-1 rounded">Présentez-moi le CHU</code> pour tester la contextualisation</li>
              <li><strong>3.</strong> Tapez <code className="bg-blue-100 px-1 rounded">Étape suivante</code> pour tester la progression</li>
              <li><strong>4.</strong> Tapez <code className="bg-blue-100 px-1 rounded">Analysons les menaces</code> pour tester la transition</li>
              <li><strong>5.</strong> Observez que <strong>chaque réponse est unique et contextuelle</strong></li>
            </ul>
          </div>

          {/* Statut du moteur */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-green-900 mb-2">✅ Moteur IA Structurant Activé :</h3>
            <ul className="text-green-800 space-y-1 text-sm">
              <li>🧠 <strong>AgentOrchestrator</strong> : Moteur IA structurant opérationnel</li>
              <li>📋 <strong>Structure EBIOS RM</strong> : 5 ateliers, 15+ étapes détaillées</li>
              <li>🔄 <strong>Anti-boucle</strong> : Détection automatique des répétitions</li>
              <li>🏥 <strong>Contexte CHU</strong> : Exemples spécifiques intégrés</li>
              <li>🎯 <strong>Actions intelligentes</strong> : Boutons contextuels adaptatifs</li>
            </ul>
          </div>
        </div>

        {/* Interface de chat */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              💬 Chat Expert EBIOS RM - Moteur IA Structurant
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Testez le nouveau système qui génère des réponses uniques et contextuelles
            </p>
          </div>
          
          <div className="p-4">
            <TrainingChatInterface 
              className="h-[600px]"
              maxHeight="600px"
            />
          </div>
        </div>

        {/* Indicateurs de validation */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-2">🚫 Problème Résolu</h3>
            <p className="text-sm text-gray-600">
              Plus de réponses répétitives identiques
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-2">🎯 Progression Structurée</h3>
            <p className="text-sm text-gray-600">
              Guidage workshop par workshop
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-2">🏥 Contexte CHU</h3>
            <p className="text-sm text-gray-600">
              Exemples spécifiques intégrés
            </p>
          </div>
        </div>

        {/* Footer de test */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>🧪 Page de test - Moteur IA Structurant EBIOS RM</p>
          <p>Développé pour résoudre définitivement le problème de réponses répétitives</p>
        </div>
      </div>
    </div>
  );
};

export default TestTraining;
