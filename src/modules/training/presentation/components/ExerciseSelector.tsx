/**
 * 🎯 SÉLECTEUR D'EXERCICES ÉCOSYSTÈME MENACES SANTÉ
 * Composant pour choisir et lancer les exercices pratiques spécialisés
 */

import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  Target, 
  Brain, 
  Shield, 
  Users,
  AlertTriangle,
  Award,
  CheckCircle,
  Star,
  TrendingUp,
  Eye,
  BookOpen
} from 'lucide-react';
import HealthcareThreatEcosystemExercises, { HealthcareExercise } from '../../domain/exercises/HealthcareThreatEcosystemExercises';

// 🎯 PROPS DU COMPOSANT
interface ExerciseSelectorProps {
  onExerciseSelect?: (exerciseId: string) => void;
  completedExercises?: string[];
  userLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  onExerciseSelect,
  completedExercises = [],
  userLevel = 'beginner'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // 📚 CHARGEMENT DES EXERCICES
  const exercises = HealthcareThreatEcosystemExercises.getAllHealthcareExercises();

  // 🎯 FILTRAGE DES EXERCICES
  const filteredExercises = exercises.filter(exercise => {
    const categoryMatch = selectedCategory === 'all' || exercise.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  // 🎨 COULEURS PAR CATÉGORIE
  const getCategoryColor = (category: string) => {
    const colors = {
      'threat_landscape': 'bg-blue-100 text-blue-800 border-blue-200',
      'source_identification': 'bg-green-100 text-green-800 border-green-200',
      'motivation_analysis': 'bg-purple-100 text-purple-800 border-purple-200',
      'capability_assessment': 'bg-orange-100 text-orange-800 border-orange-200',
      'case_study': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // 🎨 COULEURS PAR DIFFICULTÉ
  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'beginner': 'bg-green-100 text-green-700',
      'intermediate': 'bg-blue-100 text-blue-700',
      'advanced': 'bg-orange-100 text-orange-700',
      'expert': 'bg-red-100 text-red-700'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  // 🎯 ICÔNE PAR CATÉGORIE
  const getCategoryIcon = (category: string) => {
    const icons = {
      'threat_landscape': Brain,
      'source_identification': Target,
      'motivation_analysis': Users,
      'capability_assessment': TrendingUp,
      'case_study': Shield
    };
    return icons[category as keyof typeof icons] || BookOpen;
  };

  // 🎯 RECOMMANDATION SELON NIVEAU
  const getRecommendation = (exercise: HealthcareExercise) => {
    const levelOrder = ['beginner', 'intermediate', 'advanced', 'expert'];
    const userLevelIndex = levelOrder.indexOf(userLevel);
    const exerciseLevelIndex = levelOrder.indexOf(exercise.difficulty);
    
    if (exerciseLevelIndex === userLevelIndex) {
      return { type: 'perfect', message: 'Parfait pour votre niveau' };
    } else if (exerciseLevelIndex === userLevelIndex + 1) {
      return { type: 'challenge', message: 'Défi recommandé' };
    } else if (exerciseLevelIndex < userLevelIndex) {
      return { type: 'easy', message: 'Révision utile' };
    } else {
      return { type: 'hard', message: 'Très difficile' };
    }
  };

  // 🎯 RENDU D'UN EXERCICE
  const renderExercise = (exercise: HealthcareExercise) => {
    const Icon = getCategoryIcon(exercise.category);
    const isCompleted = completedExercises.includes(exercise.id);
    const recommendation = getRecommendation(exercise);
    const isExpanded = showDetails === exercise.id;
    
    return (
      <div
        key={exercise.id}
        className={`border-2 rounded-lg p-6 transition-all ${
          isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        {/* En-tête exercice */}
        <div className="flex items-start space-x-4 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getCategoryColor(exercise.category)}`}>
            <Icon className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{exercise.title}</h3>
              {isCompleted && <CheckCircle className="w-5 h-5 text-green-600" />}
            </div>
            
            <p className="text-gray-600 mb-3">{exercise.description}</p>
            
            {/* Métadonnées */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{exercise.duration} min</span>
              </div>
              
              <div className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                {exercise.difficulty}
              </div>
              
              <div className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(exercise.category)}`}>
                {exercise.category.replace('_', ' ')}
              </div>
              
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-600">{exercise.questions.reduce((sum, q) => sum + q.points, 0)} pts</span>
              </div>
            </div>
          </div>
          
          {/* Recommandation */}
          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-xs font-medium mb-2 ${
              recommendation.type === 'perfect' ? 'bg-green-100 text-green-700' :
              recommendation.type === 'challenge' ? 'bg-blue-100 text-blue-700' :
              recommendation.type === 'easy' ? 'bg-gray-100 text-gray-700' :
              'bg-red-100 text-red-700'
            }`}>
              {recommendation.message}
            </div>
            
            <button
              onClick={() => setShowDetails(isExpanded ? null : exercise.id)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <Eye className="w-4 h-4" />
              <span>{isExpanded ? 'Masquer' : 'Détails'}</span>
            </button>
          </div>
        </div>

        {/* Détails étendus */}
        {isExpanded && (
          <div className="border-t border-gray-200 pt-4 space-y-4">
            {/* Objectifs d'apprentissage */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Objectifs d'apprentissage
              </h4>
              <ul className="space-y-1">
                {exercise.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                    <span className="text-blue-600">•</span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Brain className="w-4 h-4 mr-2" />
                Questions ({exercise.questions.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {exercise.questions.map((question, index) => (
                  <div key={question.id} className="bg-gray-50 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">Q{index + 1}</span>
                      <span className="text-xs text-blue-600">{question.points} pts</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">{question.type.replace('_', ' ')}</div>
                    <div className="text-sm text-gray-700 line-clamp-2">{question.question}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exemple du monde réel */}
            {exercise.realWorldExample && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Exemple du monde réel
                </h4>
                <div className="bg-orange-50 border border-orange-200 rounded p-3">
                  <div className="text-sm text-orange-800">{exercise.realWorldExample}</div>
                </div>
              </div>
            )}

            {/* Conformité ANSSI */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Conformité ANSSI
              </h4>
              <div className="flex flex-wrap gap-2">
                {exercise.anssiCompliance.map((compliance, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                    {compliance}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bouton d'action */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-500">
            {isCompleted ? 'Exercice terminé' : 'Prêt à commencer'}
          </div>
          
          <button
            onClick={() => onExerciseSelect?.(exercise.id)}
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              isCompleted 
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>{isCompleted ? 'Refaire' : 'Commencer'}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🎯 Exercices pratiques - Écosystème de menaces santé
        </h1>
        <p className="text-gray-600 mb-4">
          Exercices spécialisés pour maîtriser l'analyse des sources de risques dans le secteur hospitalier
        </p>
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{exercises.length}</div>
            <div className="text-sm text-blue-700">Exercices disponibles</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedExercises.length}</div>
            <div className="text-sm text-green-700">Exercices terminés</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {exercises.reduce((sum, ex) => sum + ex.questions.reduce((qSum, q) => qSum + q.points, 0), 0)}
            </div>
            <div className="text-sm text-orange-700">Points totaux</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {exercises.reduce((sum, ex) => sum + ex.duration, 0)}
            </div>
            <div className="text-sm text-purple-700">Minutes totales</div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">🔍 Filtres</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Filtre catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les catégories</option>
              <option value="threat_landscape">Paysage des menaces</option>
              <option value="source_identification">Identification des sources</option>
              <option value="motivation_analysis">Analyse des motivations</option>
              <option value="capability_assessment">Évaluation des capacités</option>
              <option value="case_study">Cas pratiques</option>
            </select>
          </div>

          {/* Filtre difficulté */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulté</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les niveaux</option>
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des exercices */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">
          📚 Exercices disponibles ({filteredExercises.length})
        </h3>
        
        {filteredExercises.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-600">Aucun exercice ne correspond aux filtres sélectionnés</div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredExercises.map(renderExercise)}
          </div>
        )}
      </div>

      {/* Recommandations */}
      <div className="bg-blue-50 rounded-lg p-6 mt-6">
        <h3 className="font-semibold text-blue-900 mb-3">💡 Recommandations</h3>
        <div className="space-y-2 text-blue-800 text-sm">
          <p>• Commencez par l'exercice "Paysage des menaces" pour une vue d'ensemble</p>
          <p>• Progressez selon votre niveau : {userLevel} → {userLevel === 'expert' ? 'Maîtrise complète' : 'Niveau supérieur'}</p>
          <p>• Les cas pratiques sont recommandés après avoir maîtrisé les concepts de base</p>
          <p>• Visez 75% minimum pour valider votre compréhension</p>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSelector;
