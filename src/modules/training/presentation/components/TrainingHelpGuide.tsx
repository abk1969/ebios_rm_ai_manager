/**
 * 🎯 GUIDE D'AIDE CONTEXTUELLE
 * Composant pour aider l'utilisateur à naviguer dans la formation
 */

import React, { useState } from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Target, 
  BarChart3, 
  Award,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface HelpSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: string[];
  tips?: string[];
}

export const TrainingHelpGuide: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string>('getting-started');

  const helpSections: HelpSection[] = [
    {
      id: 'getting-started',
      title: 'Comment commencer ?',
      icon: Lightbulb,
      content: [
        'Bienvenue dans votre formation EBIOS RM interactive !',
        'Cette formation vous accompagne dans l\'apprentissage de la méthodologie de gestion des risques cyber.',
        'Vous travaillerez sur un cas réel : l\'analyse des risques d\'un CHU métropolitain.'
      ],
      tips: [
        'Commencez par poser une question dans le chat',
        'Explorez les différents onglets (Chat, Progression, Ressources)',
        'N\'hésitez pas à demander des clarifications'
      ]
    },
    {
      id: 'chat-expert',
      title: 'Chat avec l\'Expert IA',
      icon: MessageCircle,
      content: [
        'L\'expert IA est votre formateur personnel spécialisé en EBIOS RM.',
        'Il peut répondre à toutes vos questions sur la méthodologie, les ateliers, et les concepts.',
        'Posez des questions spécifiques ou demandez des explications générales.'
      ],
      tips: [
        'Utilisez les suggestions rapides pour commencer',
        'Posez des questions sur le cas du CHU',
        'Demandez des exemples concrets',
        'N\'hésitez pas à approfondir les sujets'
      ]
    },
    {
      id: 'case-study',
      title: 'Cas d\'étude : CHU Métropolitain',
      icon: Target,
      content: [
        'Vous analysez les risques d\'un Centre Hospitalier Universitaire.',
        'Ce cas réel couvre tous les aspects d\'une analyse EBIOS RM complète.',
        'Vous découvrirez les enjeux spécifiques du secteur de la santé.'
      ],
      tips: [
        'Identifiez les biens supports critiques',
        'Analysez les sources de risques',
        'Évaluez les scénarios stratégiques',
        'Proposez des mesures de sécurité'
      ]
    },
    {
      id: 'workshops',
      title: 'Les 5 Ateliers EBIOS RM',
      icon: BookOpen,
      content: [
        'Atelier 1 : Cadrage et socle de sécurité',
        'Atelier 2 : Sources de risques',
        'Atelier 3 : Scénarios stratégiques',
        'Atelier 4 : Scénarios opérationnels',
        'Atelier 5 : Traitement du risque'
      ],
      tips: [
        'Suivez l\'ordre des ateliers',
        'Chaque atelier s\'appuie sur le précédent',
        'Validez votre compréhension avant de passer au suivant'
      ]
    },
    {
      id: 'progress',
      title: 'Suivi de progression',
      icon: BarChart3,
      content: [
        'Consultez vos métriques d\'apprentissage en temps réel.',
        'Suivez votre progression globale et votre score d\'engagement.',
        'Débloquez des badges en atteignant certains objectifs.'
      ],
      tips: [
        'Vérifiez régulièrement votre progression',
        'Essayez d\'améliorer votre score d\'engagement',
        'Collectez tous les badges disponibles'
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? '' : sectionId);
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Guide d'aide</h2>
            <p className="text-sm text-gray-600">Tout ce que vous devez savoir pour réussir votre formation</p>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6 space-y-4">
        {/* Message d'accueil */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Award className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">🎯 Objectif de la formation</h3>
              <p className="text-sm text-blue-800">
                Maîtriser la méthodologie EBIOS Risk Manager à travers un cas pratique du secteur santé, 
                avec l'assistance d'un expert IA personnalisé.
              </p>
            </div>
          </div>
        </div>

        {/* Sections d'aide */}
        {helpSections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;
          
          return (
            <div key={section.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Icon className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="font-medium text-gray-900">{section.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </button>
              
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="pt-3 space-y-3">
                    {/* Contenu principal */}
                    <div className="space-y-2">
                      {section.content.map((paragraph, index) => (
                        <p key={index} className="text-sm text-gray-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    
                    {/* Conseils */}
                    {section.tips && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-1" />
                          Conseils pratiques
                        </h4>
                        <ul className="space-y-1">
                          {section.tips.map((tip, index) => (
                            <li key={index} className="text-xs text-yellow-700 flex items-start">
                              <CheckCircle className="w-3 h-3 mt-0.5 mr-2 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Actions rapides */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <ArrowRight className="w-4 h-4 mr-2 text-green-600" />
            Actions rapides
          </h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors">
              🎯 Commencer par les bases d'EBIOS RM
            </button>
            <button className="w-full text-left px-3 py-2 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors">
              🏥 Analyser le cas du CHU métropolitain
            </button>
            <button className="w-full text-left px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors">
              📊 Consulter ma progression
            </button>
          </div>
        </div>

        {/* Contact support */}
        <div className="bg-gray-100 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600 mb-2">Besoin d'aide supplémentaire ?</p>
          <p className="text-xs text-gray-500">
            Utilisez le chat expert pour poser toutes vos questions spécifiques sur EBIOS RM
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainingHelpGuide;
