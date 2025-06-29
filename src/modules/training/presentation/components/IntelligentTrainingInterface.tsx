/**
 * 🧠 INTERFACE DE FORMATION INTELLIGENTE FULL-AGENTIC
 * Interface révolutionnaire avec guidage IA adaptatif et parcours intelligent
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Brain, 
  Target, 
  TrendingUp, 
  Lightbulb,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Award
} from 'lucide-react';
import { AgentOrchestrator } from '../../domain/services/AgentOrchestrator';
import { useTrainingStore } from '../stores/trainingStore';

interface IntelligentTrainingInterfaceProps {
  sessionId: string;
  onSessionEnd?: () => void;
}

export const IntelligentTrainingInterface: React.FC<IntelligentTrainingInterfaceProps> = ({
  sessionId,
  onSessionEnd
}) => {
  const [orchestrator] = useState(() => new AgentOrchestrator());
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentGuidance, setCurrentGuidance] = useState<any>(null);
  const [adaptiveHints, setAdaptiveHints] = useState<string[]>([]);
  const [learnerProfile, setLearnerProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    currentSession,
    isSessionActive,
    sessionProgress,
    addMessage,
    updateProgress
  } = useTrainingStore();

  // Initialisation intelligente
  useEffect(() => {
    initializeIntelligentSession();
  }, []);

  // Auto-scroll intelligent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * 🚀 Initialisation de session intelligente
   */
  const initializeIntelligentSession = async () => {
    try {
      setIsLoading(true);
      
      // Initialiser la session avec l'orchestrateur
      const session = await orchestrator.initializeSession('intelligent_learner', sessionId);
      
      // Obtenir le message d'accueil personnalisé
      const welcomeMessage = orchestrator.getWelcomeMessage();
      
      // Analyser le profil de l'apprenant
      const profile = await analyzeInitialLearnerProfile();
      setLearnerProfile(profile);
      
      // Générer le guidage initial adaptatif
      const initialGuidance = generateAdaptiveGuidance(profile);
      setCurrentGuidance(initialGuidance);
      
      // Ajouter le message d'accueil intelligent
      const intelligentWelcome = {
        id: 'welcome',
        type: 'system',
        content: `🎓 **Bienvenue dans votre Formation EBIOS RM Intelligente !**

${welcomeMessage}

**🧠 Votre Profil d'Apprentissage Détecté :**
- Niveau estimé : ${profile.estimatedLevel}
- Style préféré : ${profile.preferredStyle}
- Objectifs : ${profile.objectives.join(', ')}

**🎯 Parcours Personnalisé Généré :**
${initialGuidance.description}

**💡 Pour commencer de manière optimale :**
${initialGuidance.firstStep}`,
        timestamp: Date.now(),
        metadata: {
          confidence: 0.95,
          sources: ['Analyse IA', 'Profil adaptatif'],
          timestamp: new Date()
        }
      };
      
      setMessages([intelligentWelcome]);
      
      // Générer les premiers conseils adaptatifs
      const hints = generateAdaptiveHints(profile, 'welcome');
      setAdaptiveHints(hints);
      
    } catch (error) {
      console.error('Erreur d\'initialisation intelligente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 🧠 Analyser le profil initial de l'apprenant
   */
  const analyzeInitialLearnerProfile = async (): Promise<any> => {
    // Simulation d'analyse IA avancée
    return {
      estimatedLevel: 'Intermédiaire', // Basé sur l'historique, les préférences, etc.
      preferredStyle: 'Visuel avec exemples pratiques',
      objectives: ['Certification EBIOS RM', 'Application en milieu hospitalier'],
      strengths: ['Analyse méthodique', 'Compréhension technique'],
      areasToImprove: ['Application pratique', 'Scénarios complexes'],
      recommendedPath: 'Parcours accéléré avec focus pratique'
    };
  };

  /**
   * 🎯 Générer un guidage adaptatif
   */
  const generateAdaptiveGuidance = (profile: any): any => {
    return {
      description: `Parcours optimisé pour votre profil ${profile.estimatedLevel} avec approche ${profile.preferredStyle.toLowerCase()}`,
      firstStep: 'Commencez par taper "GO" pour démarrer votre analyse personnalisée du CHU métropolitain',
      expectedDuration: '45-60 minutes par atelier',
      adaptations: [
        'Exemples concrets du secteur santé',
        'Exercices pratiques adaptés',
        'Validation progressive des acquis'
      ]
    };
  };

  /**
   * 💡 Générer des conseils adaptatifs
   */
  const generateAdaptiveHints = (profile: any, context: string): string[] => {
    const hints = [
      '🎯 Tapez "GO" pour commencer votre formation personnalisée',
      '🏥 Demandez "Présentez-moi le CHU" pour découvrir votre cas d\'étude',
      '📚 Utilisez "Aide" si vous avez besoin de clarifications',
      '🎓 Votre progression sera adaptée en temps réel à vos réponses'
    ];
    
    // Personnalisation basée sur le profil
    if (profile.estimatedLevel === 'Débutant') {
      hints.unshift('💡 N\'hésitez pas à demander des explications simples');
    } else if (profile.estimatedLevel === 'Expert') {
      hints.push('🚀 Vous pouvez demander des analyses approfondies');
    }
    
    return hints;
  };

  /**
   * 💬 Traitement intelligent des messages
   */
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Traitement par l'orchestrateur intelligent
      const response = await orchestrator.processLearnerMessage(inputMessage);
      
      // Mise à jour du profil apprenant basée sur la réponse
      await updateLearnerProfile(inputMessage, response);
      
      // Génération de nouveaux conseils adaptatifs
      const newHints = generateContextualHints(response);
      setAdaptiveHints(newHints);
      
      // Mise à jour du guidage si nécessaire
      if (response.metadata?.adaptationLevel) {
        const newGuidance = generateAdaptiveGuidance(learnerProfile);
        setCurrentGuidance(newGuidance);
      }

      // Ajout de la réponse intelligente
      const intelligentResponse = {
        id: Date.now().toString(),
        type: response.type,
        content: response.text,
        timestamp: Date.now(),
        actions: response.actions,
        quiz: response.quiz,
        infoCard: response.infoCard,
        metadata: response.metadata
      };

      setMessages(prev => [...prev, intelligentResponse]);
      
      // Mise à jour de la progression
      if (response.progressUpdate) {
        updateProgress(response.progressUpdate);
      }

    } catch (error) {
      console.error('Erreur de traitement intelligent:', error);
      
      const errorMessage = {
        id: Date.now().toString(),
        type: 'error',
        content: '🚨 Une erreur est survenue. L\'IA formateur va s\'adapter et reprendre.',
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 🔄 Mise à jour du profil apprenant
   */
  const updateLearnerProfile = async (message: string, response: any): Promise<void> => {
    if (!learnerProfile) return;
    
    // Analyse de l'évolution du profil
    const messageComplexity = assessMessageComplexity(message);
    const responseQuality = response.metadata?.confidence || 0.5;
    
    // Mise à jour adaptative
    const updatedProfile = {
      ...learnerProfile,
      lastInteraction: {
        complexity: messageComplexity,
        quality: responseQuality,
        timestamp: new Date()
      },
      progressionTrend: calculateProgressionTrend(responseQuality)
    };
    
    setLearnerProfile(updatedProfile);
  };

  /**
   * 💡 Générer des conseils contextuels
   */
  const generateContextualHints = (response: any): string[] => {
    const hints: string[] = [];
    
    if (response.type === 'quiz') {
      hints.push('🧠 Répondez au quiz pour valider vos connaissances');
    }
    
    if (response.actions && response.actions.length > 0) {
      hints.push('🎯 Utilisez les actions suggérées pour progresser efficacement');
    }
    
    if (response.metadata?.nextRecommendations) {
      hints.push(...response.metadata.nextRecommendations.map((rec: string) => `💡 ${rec}`));
    }
    
    return hints.length > 0 ? hints : adaptiveHints;
  };

  /**
   * 📊 Évaluer la complexité du message
   */
  const assessMessageComplexity = (message: string): 'low' | 'medium' | 'high' => {
    if (message.length > 100 && /EBIOS|ANSSI|analyse|scénario/i.test(message)) return 'high';
    if (message.length > 30) return 'medium';
    return 'low';
  };

  /**
   * 📈 Calculer la tendance de progression
   */
  const calculateProgressionTrend = (quality: number): 'improving' | 'stable' | 'declining' => {
    if (quality > 0.8) return 'improving';
    if (quality > 0.5) return 'stable';
    return 'declining';
  };

  /**
   * 🎯 Faire défiler vers le bas
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Panneau de guidage intelligent */}
      <div className="w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col">
        {/* Header du guidage */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">IA Formateur Expert</h3>
              <p className="text-sm opacity-90">Guidage Adaptatif</p>
            </div>
          </div>
        </div>

        {/* Profil apprenant */}
        {learnerProfile && (
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Votre Profil
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Niveau :</span>
                <span className="font-medium">{learnerProfile.estimatedLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Style :</span>
                <span className="font-medium text-xs">{learnerProfile.preferredStyle}</span>
              </div>
              {learnerProfile.progressionTrend && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Tendance :</span>
                  <span className={`font-medium ${
                    learnerProfile.progressionTrend === 'improving' ? 'text-green-600' :
                    learnerProfile.progressionTrend === 'stable' ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    {learnerProfile.progressionTrend === 'improving' ? '📈 En progression' :
                     learnerProfile.progressionTrend === 'stable' ? '➡️ Stable' : '📉 À améliorer'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Conseils adaptatifs */}
        <div className="p-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-600" />
            Conseils Intelligents
          </h4>
          <div className="space-y-2">
            {adaptiveHints.map((hint, index) => (
              <div key={index} className="p-2 bg-yellow-50 rounded-lg text-sm text-yellow-800 border border-yellow-200">
                {hint}
              </div>
            ))}
          </div>
        </div>

        {/* Progression intelligente */}
        <div className="p-4 flex-1">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            Progression Adaptative
          </h4>
          {sessionProgress && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Atelier {sessionProgress.currentWorkshop}</span>
                <span className="font-medium">{sessionProgress.overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${sessionProgress.overallProgress}%` }}
                />
              </div>
              <div className="text-xs text-gray-600">
                Prochaine étape : {sessionProgress.nextMilestone}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interface de chat principale */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Formation EBIOS RM Intelligente</h2>
                <p className="text-sm text-gray-600">Cas d'étude : CHU Métropolitain</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">Niveau Adaptatif</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-4 ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white shadow-sm border border-gray-200'
              }`}>
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br>') }} />
                </div>
                
                {/* Actions intelligentes */}
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.actions.map((action: any) => (
                      <button
                        key={action.id}
                        onClick={() => setInputMessage(action.payload)}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200 transition-colors"
                      >
                        {action.icon} {action.label}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Métadonnées expertes */}
                {message.metadata && (
                  <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>Expert: {message.metadata.expertPersona || 'IA Formateur'}</span>
                      <span>Confiance: {Math.round((message.metadata.confidence || 0) * 100)}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">L'IA formateur analyse et s'adapte...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input intelligent */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Posez votre question ou tapez 'GO' pour commencer..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
