/**
 * 🆘 PANNEAU D'AIDE
 * Composant pour l'aide et support utilisateur
 * FAQ, guides rapides, contact support
 */

import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronRight, 
  MessageCircle, 
  Mail, 
  Phone,
  Book,
  Video,
  Search,
  Lightbulb,
  Users,
  Settings,
  ExternalLink
} from 'lucide-react';

// 🎯 PROPS DU COMPOSANT
export interface TrainingHelpPanelProps {
  className?: string;
}

// 🎯 TYPES POUR LA FAQ
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
}

interface GuideItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  steps: string[];
  duration: string;
}

/**
 * 🎯 COMPOSANT PRINCIPAL
 */
export const TrainingHelpPanel: React.FC<TrainingHelpPanelProps> = ({
  className = ''
}) => {
  // 🎯 ÉTAT LOCAL
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'faq' | 'guides' | 'contact'>('faq');

  // 🎯 DONNÉES FAQ
  const faqItems: FAQItem[] = [
    {
      id: '1',
      question: 'Comment démarrer ma première session de formation ?',
      answer: 'Pour démarrer votre formation, cliquez sur "Nouvelle Session" dans le tableau de bord principal. Sélectionnez les ateliers souhaités, votre secteur d\'activité et votre niveau d\'expérience. L\'IA formateur vous guidera ensuite étape par étape.',
      category: 'Démarrage',
      tags: ['session', 'démarrage', 'première fois'],
      helpful: 45
    },
    {
      id: '2',
      question: 'Que faire si l\'IA formateur ne répond pas ?',
      answer: 'Si l\'IA formateur ne répond pas, vérifiez d\'abord votre connexion internet. Ensuite, essayez de reformuler votre question de manière plus précise. Si le problème persiste, contactez le support technique.',
      category: 'Technique',
      tags: ['IA', 'problème', 'connexion'],
      helpful: 32
    },
    {
      id: '3',
      question: 'Comment sauvegarder ma progression ?',
      answer: 'Votre progression est automatiquement sauvegardée toutes les 30 secondes. Vous pouvez également forcer une sauvegarde en cliquant sur l\'icône de sauvegarde dans la barre d\'outils.',
      category: 'Progression',
      tags: ['sauvegarde', 'progression', 'données'],
      helpful: 28
    },
    {
      id: '4',
      question: 'Puis-je reprendre ma formation sur un autre appareil ?',
      answer: 'Oui, votre formation est synchronisée dans le cloud. Connectez-vous simplement avec vos identifiants sur n\'importe quel appareil pour reprendre là où vous vous êtes arrêté.',
      category: 'Synchronisation',
      tags: ['multi-appareil', 'cloud', 'synchronisation'],
      helpful: 41
    },
    {
      id: '5',
      question: 'Comment obtenir un certificat de formation ?',
      answer: 'Un certificat est automatiquement généré lorsque vous terminez tous les ateliers avec un score minimum de 75%. Le certificat est téléchargeable depuis votre profil.',
      category: 'Certification',
      tags: ['certificat', 'validation', 'score'],
      helpful: 67
    }
  ];

  // 🎯 GUIDES RAPIDES
  const guides: GuideItem[] = [
    {
      id: '1',
      title: 'Première connexion',
      description: 'Guide pour bien commencer votre formation',
      icon: <Users className="w-5 h-5" />,
      steps: [
        'Créez votre profil apprenant',
        'Sélectionnez votre secteur d\'activité',
        'Choisissez votre niveau d\'expérience',
        'Lancez votre première session'
      ],
      duration: '5 min'
    },
    {
      id: '2',
      title: 'Interface de formation',
      description: 'Découvrez les fonctionnalités de l\'interface',
      icon: <Settings className="w-5 h-5" />,
      steps: [
        'Navigation entre les onglets',
        'Utilisation du chat IA',
        'Suivi de progression',
        'Accès aux ressources'
      ],
      duration: '3 min'
    },
    {
      id: '3',
      title: 'Interaction avec l\'IA',
      description: 'Optimisez vos échanges avec le formateur IA',
      icon: <MessageCircle className="w-5 h-5" />,
      steps: [
        'Posez des questions précises',
        'Utilisez les suggestions',
        'Demandez des exemples',
        'Sollicitez des clarifications'
      ],
      duration: '4 min'
    }
  ];

  // 🎯 FILTRAGE FAQ
  const filteredFAQ = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // 🎯 CATÉGORIES FAQ
  const categories = ['all', ...Array.from(new Set(faqItems.map(item => item.category)))];

  // 🎯 GESTION EXPANSION FAQ
  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  // 🎯 RENDU FAQ
  const renderFAQ = () => (
    <div className="space-y-4">
      {/* Recherche et filtres */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher dans la FAQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'Toutes les catégories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Liste FAQ */}
      <div className="space-y-2">
        {filteredFAQ.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(item.id)}
              className="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 flex items-center justify-between transition-colors"
            >
              <span className="font-medium text-gray-900">{item.question}</span>
              {expandedFAQ === item.id ? (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {expandedFAQ === item.id && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-gray-700 mb-3">{item.answer}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center text-gray-500">
                    <Lightbulb className="w-4 h-4 mr-1" />
                    <span>{item.helpful} personnes ont trouvé cela utile</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // 🎯 RENDU GUIDES
  const renderGuides = () => (
    <div className="grid gap-4">
      {guides.map((guide) => (
        <div
          key={guide.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start">
            <div className="mr-3 p-2 bg-blue-100 rounded-lg text-blue-600">
              {guide.icon}
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">{guide.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{guide.description}</p>
              
              <div className="space-y-1 mb-3">
                {guide.steps.map((step, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                      {index + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Durée: {guide.duration}</span>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Voir le guide →
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // 🎯 RENDU CONTACT
  const renderContact = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Besoin d'aide supplémentaire ?
        </h3>
        <p className="text-gray-600">
          Notre équipe support est là pour vous accompagner
        </p>
      </div>

      <div className="grid gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <MessageCircle className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-medium text-gray-900">Chat en direct</h4>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Discutez avec un expert EBIOS RM en temps réel
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Démarrer le chat
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Mail className="w-5 h-5 text-green-600 mr-2" />
            <h4 className="font-medium text-gray-900">Support par email</h4>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Envoyez-nous vos questions détaillées
          </p>
          <a
            href="mailto:support@ebios-training.com"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors inline-block text-center"
          >
            support@ebios-training.com
          </a>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Phone className="w-5 h-5 text-purple-600 mr-2" />
            <h4 className="font-medium text-gray-900">Support téléphonique</h4>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Lun-Ven 9h-18h (heure française)
          </p>
          <a
            href="tel:+33123456789"
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors inline-block text-center"
          >
            +33 1 23 45 67 89
          </a>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
          <h4 className="font-medium text-yellow-800">Conseil</h4>
        </div>
        <p className="text-yellow-700 text-sm">
          Avant de nous contacter, consultez notre FAQ qui répond aux questions les plus fréquentes.
          Cela vous fera gagner du temps !
        </p>
      </div>
    </div>
  );

  // 🎯 RENDU PRINCIPAL
  return (
    <div className={`training-help-panel p-6 ${className}`}>
      {/* En-tête */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Centre d'aide</h2>
        <p className="text-gray-600">
          Trouvez rapidement les réponses à vos questions
        </p>
      </div>

      {/* Navigation onglets */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
        {[
          { id: 'faq', label: 'FAQ', icon: HelpCircle },
          { id: 'guides', label: 'Guides', icon: Book },
          { id: 'contact', label: 'Contact', icon: MessageCircle }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all
              ${activeTab === id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <div>
        {activeTab === 'faq' && renderFAQ()}
        {activeTab === 'guides' && renderGuides()}
        {activeTab === 'contact' && renderContact()}
      </div>
    </div>
  );
};

export default TrainingHelpPanel;
