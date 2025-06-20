/**
 * 🎓 INTERFACE CHAT FORMATION - VERSION SIMPLIFIÉE
 * Composant de chat isolé sans dépendances externes
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader, Target, Maximize2, Minimize2, ChevronUp, ChevronDown } from 'lucide-react';
import { SimpleAgentOrchestrator, SimpleAgentResponseData } from '../../domain/services/SimpleAgentOrchestrator';
import { useTrainingModuleState, useTrainingModuleActions, TrainingModuleState } from '../context/TrainingModuleContext';
import { SystemActionsMessage } from './SystemActionsMessage';
import { QuizMessage } from './QuizMessage';
import { InfoCardMessage } from './InfoCardMessage';
import { StandardChatMessage } from './StandardChatMessage';

// 🎯 INTERFACE POUR PROPS DU COMPOSANT
interface TrainingChatInterfaceSimpleProps {
  userId?: string;
  sessionId?: string;
  trainingMode?: string;
  onProgressUpdate?: (progress: any) => void;
  onWorkshopChange?: (workshopId: number) => void;
  onActivity?: (activity: any) => void;
}

export const TrainingChatInterfaceSimple: React.FC<TrainingChatInterfaceSimpleProps> = ({
  userId = 'user_123',
  sessionId = 'session_chu_2024',
  trainingMode = 'discovery',
  onProgressUpdate,
  onWorkshopChange,
  onActivity
}) => {
  const state = useTrainingModuleState();
  const actions = useTrainingModuleActions();
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [orchestrator] = useState(() => new SimpleAgentOrchestrator());
  const [sessionInitialized, setSessionInitialized] = useState(false);
  const [currentWorkshop, setCurrentWorkshop] = useState(1);
  const [workshopProgress, setWorkshopProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🎯 ÉTATS POUR L'EXPANSION DU CHAT
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatHeight, setChatHeight] = useState('normal'); // 'compact', 'normal', 'expanded'

  // 🎯 MESSAGES D'ACCUEIL SELON LE MODE
  const getWelcomeMessageForMode = (mode: string): string => {
    const welcomeMessages = {
      'discovery': `🔍 **Bienvenue dans la Découverte d'EBIOS RM !**

Bonjour ! Je suis Dr. Sophie Cadrage, votre formatrice experte en EBIOS Risk Manager.

**🎯 Objectif de ce module :**
Vous allez apprendre les **fondamentaux de la méthode EBIOS RM** à travers le cas pratique du CHU Métropolitain.

**📚 Ce que vous allez découvrir :**
• Les concepts de base d'EBIOS RM
• La méthodologie en 5 ateliers
• L'application concrète dans le secteur santé

**🚀 Prêt à commencer ?** Tapez "GO" ou posez-moi une question !`,

      'case-study': `📋 **Bienvenue dans le Cas d'étude pratique !**

Parfait ! Vous allez maintenant **analyser un cas réel** du secteur de la santé.

**🏥 Notre cas d'étude :**
**CHU Métropolitain** - 3 sites, 1200 lits, 3500 professionnels

**🎯 Votre mission :**
• Analyser les systèmes critiques du CHU
• Identifier les vulnérabilités réelles
• Proposer des mesures de sécurité adaptées

**💡 Approche pratique :** Nous travaillerons sur des données réelles anonymisées !

**Commençons par analyser le contexte du CHU. Que souhaitez-vous découvrir en premier ?**`,

      'workshops': `🎯 **Bienvenue dans les Ateliers interactifs !**

Excellent choix ! Vous allez **pratiquer les 5 ateliers EBIOS RM** avec des exercices concrets.

**🛠️ Programme des ateliers :**
1. **🎯 Atelier 1** - Socle de sécurité (Biens supports)
2. **⚠️ Atelier 2** - Sources de risques (Menaces)
3. **🎪 Atelier 3** - Scénarios stratégiques
4. **⚙️ Atelier 4** - Scénarios opérationnels
5. **🛡️ Atelier 5** - Traitement du risque

**🎓 Méthode pédagogique :**
• Exercices pratiques sur le CHU
• Corrections personnalisées
• Progression étape par étape

**Par quel atelier souhaitez-vous commencer ?**`,

      'expert-chat': `💬 **Bienvenue dans le Chat avec l'expert !**

Bonjour ! Je suis à votre disposition pour répondre à **toutes vos questions** sur EBIOS RM.

**🎓 Je peux vous aider sur :**
• **Méthodologie** - Concepts, processus, bonnes pratiques
• **Application pratique** - Cas concrets, exemples sectoriels
• **Difficultés** - Clarifications, approfondissements
• **Certification** - Préparation, conseils d'expert

**💡 Mode d'emploi :**
Posez-moi n'importe quelle question sur EBIOS RM, je vous donnerai une réponse d'expert personnalisée !

**Quelle est votre question ?**`
    };

    return welcomeMessages[mode as keyof typeof welcomeMessages] || welcomeMessages.discovery;
  };

  // 🎯 TITRE DU MODE
  const getModeTitle = (mode: string): string => {
    const modeTitles = {
      'discovery': 'Découverte EBIOS RM',
      'case-study': 'Cas d\'étude pratique',
      'workshops': 'Ateliers interactifs',
      'expert-chat': 'Chat avec l\'expert'
    };
    return modeTitles[mode as keyof typeof modeTitles] || 'Formation EBIOS RM';
  };

  // 🚀 Initialisation de la session avec l'agent IA
  useEffect(() => {
    const initializeSession = async () => {
      if (!sessionInitialized) {
        try {
          console.log('🔄 Initialisation session orchestrateur IA structurant...', 'Mode:', trainingMode);
          const session = await orchestrator.initializeSession(userId, sessionId);
          console.log('✅ Session orchestrateur initialisée:', session);

          // 🎯 MESSAGE D'ACCUEIL ADAPTÉ AU MODE
          const welcomeMessage = getWelcomeMessageForMode(trainingMode);
          console.log('📝 Message d\'accueil généré pour mode', trainingMode, ':', welcomeMessage);

          actions.addMessage({
            type: 'instructor',
            content: welcomeMessage
          });

          setSessionInitialized(true);

          // 🧪 TEST AUTOMATIQUE DU MOTEUR IA
          console.log('🧪 Déclenchement test automatique du moteur IA...');
          setTimeout(async () => {
            try {
              const testResponse = await orchestrator.processLearnerMessage("TEST_INIT");
              console.log('🧪 Test automatique réussi:', testResponse);
            } catch (testError) {
              console.error('🧪 Test automatique échoué:', testError);
            }
          }, 1000);

        } catch (error) {
          console.error('Erreur initialisation session:', error);
          actions.addMessage({
            type: 'system',
            content: '⚠️ Erreur lors de l\'initialisation. Veuillez recharger la page.'
          });
        }
      }
    };

    initializeSession();
  }, [sessionInitialized, orchestrator, actions, userId, sessionId]);

  // 🔄 Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  // ⌨️ Raccourcis clavier pour l'expansion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + F pour plein écran
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
      // Ctrl/Cmd + Shift + E pour expansion
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        toggleExpanded();
      }
      // Ctrl/Cmd + Shift + R pour redimensionner
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        toggleChatHeight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 🎯 FONCTIONS DE GESTION DE L'EXPANSION
  const toggleChatHeight = () => {
    const heights = ['compact', 'normal', 'expanded'];
    const currentIndex = heights.indexOf(chatHeight);
    const nextIndex = (currentIndex + 1) % heights.length;
    setChatHeight(heights[nextIndex]);

    // Notifier l'activité si callback fourni
    onActivity?.({ type: 'chat_resize', height: heights[nextIndex] });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    onActivity?.({ type: 'chat_fullscreen', enabled: !isFullscreen });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    onActivity?.({ type: 'chat_expand', expanded: !isExpanded });
  };

  // 🎯 CALCUL DES CLASSES CSS SELON L'ÉTAT
  const getChatContainerClasses = () => {
    let baseClasses = "flex flex-col bg-gray-50 transition-all duration-300 ease-in-out";

    if (isFullscreen) {
      return `${baseClasses} fixed inset-0 z-50 h-screen`;
    }

    if (isExpanded) {
      return `${baseClasses} h-full min-h-[600px]`;
    }

    switch (chatHeight) {
      case 'compact':
        return `${baseClasses} h-80 max-h-80`;
      case 'expanded':
        return `${baseClasses} h-[600px] max-h-[600px]`;
      default: // normal
        return `${baseClasses} h-96 max-h-96`;
    }
  };

  const getMessagesContainerClasses = () => {
    let baseClasses = "flex-1 overflow-y-auto p-4 space-y-4";

    if (isFullscreen) {
      return `${baseClasses} max-h-[calc(100vh-200px)]`;
    }

    switch (chatHeight) {
      case 'compact':
        return `${baseClasses} max-h-48`;
      case 'expanded':
        return `${baseClasses} max-h-[500px]`;
      default: // normal
        return `${baseClasses} max-h-72`;
    }
  };

  // 📤 ENVOI DE MESSAGE AVEC AGENT IA EXPERT
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping || !sessionInitialized) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Ajouter le message utilisateur
    actions.addMessage({
      type: 'user',
      content: userMessage
    });

    // Traiter avec l'agent IA spécialisé EBIOS RM
    setIsTyping(true);

    try {
      console.log('🧠 Traitement message avec orchestrateur:', userMessage);
      const response: SimpleAgentResponseData = await orchestrator.processLearnerMessage(userMessage);
      console.log('✅ Réponse orchestrateur reçue:', response);

      // Ajouter la réponse de l'agent expert (le texte principal)
      actions.addMessage({
        type: 'instructor',
        content: response.text // Utilisez response.text au lieu de response.response
      });

      // Mettre à jour la progression si nécessaire
      if (response.progressUpdate) {
        setWorkshopProgress(response.progressUpdate.score || workshopProgress);
        if (response.progressUpdate.workshopId && response.progressUpdate.workshopId !== currentWorkshop) {
          setCurrentWorkshop(response.progressUpdate.workshopId);
          onWorkshopChange?.(response.progressUpdate.workshopId);
        }
        onProgressUpdate?.(response.progressUpdate);
      }

      // Gérer les actions contextuelles directement depuis la réponse de l'agent
      if (response.type === 'action_suggestions' && response.actions && response.actions.length > 0) {
        actions.addMessage({
          type: 'system_actions', // Nouveau type pour les actions systèmes interactives
          content: '', // Le contenu textuel peut être vide ici
          actions: response.actions // Stockez les actions directement
        });
      }

      // Gérer les quiz (si disponibles)
      if (response.type === 'quiz') {
        // Quiz géré dans le futur
      }

      // Gérer les cartes d'information (si disponibles)
      if (response.type === 'info_card') {
        // Info cards gérées dans le futur
      }

    } catch (error: any) {
      console.error('Erreur traitement message:', error);
      actions.addMessage({
        type: 'system',
        content: `⚠️ Erreur lors du traitement de votre message: ${error.message || 'Erreur inconnue'}. Veuillez réessayer.`
      });
    } finally {
      setIsTyping(false);
    }
  };



  // 🎯 GESTION ENTRÉE (version moderne sans onKeyPress déprécié)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 🎯 RENDU MESSAGE
  const renderMessage = (message: TrainingModuleState['messages'][0]) => {
    switch (message.type) {
      case 'system_actions':
        if (message.actions) {
          return <SystemActionsMessage key={message.id} message={{ ...message, actions: message.actions }} setInputMessage={setInputMessage} />;
        }
        break;
      case 'quiz':
        if (message.quiz) {
          return <QuizMessage key={message.id} message={{ ...message, quiz: message.quiz }} setInputMessage={setInputMessage} />;
        }
        break;
      case 'info_card':
        if (message.infoCard) {
          return <InfoCardMessage key={message.id} message={{ ...message, infoCard: message.infoCard }} />;
        }
        break;
      default:
        return <StandardChatMessage key={message.id} message={message} />;
    }
    return null; // Fallback for messages with missing data or unknown types
  };

  return (
    <div className={getChatContainerClasses()}>
      {/* En-tête avec progression et contrôles d'expansion */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center">
                  Dr. Sophie Cadrage - {getModeTitle(trainingMode)}
                  {isFullscreen && <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Plein écran</span>}
                  {isExpanded && !isFullscreen && <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Étendu</span>}
                  {chatHeight !== 'normal' && !isExpanded && !isFullscreen && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">{chatHeight}</span>
                  )}
                </h3>
                <p className="text-sm text-gray-600">Expert EBIOS RM • CHU Métropolitain</p>
              </div>

              {/* Contrôles d'expansion */}
              <div className="flex items-center space-x-2">
                {state.isOnline && (
                  <div className="flex items-center text-green-600 text-sm mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                    En ligne
                  </div>
                )}

                {/* Boutons de contrôle de taille */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={toggleChatHeight}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                    title={`Taille: ${chatHeight} (cliquer pour changer)`}
                  >
                    {chatHeight === 'compact' ? <ChevronUp className="w-4 h-4" /> :
                     chatHeight === 'expanded' ? <ChevronDown className="w-4 h-4" /> :
                     <Target className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={toggleExpanded}
                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-all"
                    title={isExpanded ? "Réduire le chat" : "Agrandir le chat"}
                  >
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-all"
                    title={isFullscreen ? "Quitter le plein écran" : "Mode plein écran"}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Barre de progression EXPLICATIVE */}
            <div className="mt-3 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-700">📊 Votre progression dans la formation</h4>
                <div className="text-sm font-bold text-blue-600">{workshopProgress}% terminé</div>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                {[
                  { id: 1, name: 'Cadrage', desc: 'Biens supports' },
                  { id: 2, name: 'Sources', desc: 'Menaces' },
                  { id: 3, name: 'Stratégique', desc: 'Scénarios' },
                  { id: 4, name: 'Opérationnel', desc: 'Risques' },
                  { id: 5, name: 'Traitement', desc: 'Mesures' }
                ].map((workshop) => (
                  <div
                    key={workshop.id}
                    className={`flex items-center ${workshop.id < 5 ? 'flex-1' : ''}`}
                    title={`Atelier ${workshop.id}: ${workshop.name} - ${workshop.desc}`}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2
                      ${workshop.id === currentWorkshop
                        ? 'bg-blue-600 text-white border-blue-600 animate-pulse'
                        : workshop.id < currentWorkshop
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white text-gray-400 border-gray-300'
                      }
                    `}>
                      {workshop.id < currentWorkshop ? '✓' : workshop.id}
                    </div>
                    {workshop.id < 5 && (
                      <div className={`
                        flex-1 h-2 mx-2 rounded-full
                        ${workshop.id < currentWorkshop ? 'bg-green-600' : 'bg-gray-200'}
                      `} />
                    )}
                  </div>
                ))}
              </div>

              <div className="text-xs text-gray-600 text-center">
                {currentWorkshop === 1 && "🎯 Atelier 1 : Identification des biens supports critiques du CHU"}
                {currentWorkshop === 2 && "⚠️ Atelier 2 : Analyse des sources de menaces"}
                {currentWorkshop === 3 && "🎪 Atelier 3 : Construction des scénarios stratégiques"}
                {currentWorkshop === 4 && "⚙️ Atelier 4 : Évaluation des risques opérationnels"}
                {currentWorkshop === 5 && "🛡️ Atelier 5 : Définition des mesures de traitement"}
              </div>

              <div className="mt-2 text-xs text-blue-600 bg-blue-50 rounded p-2 text-center">
                💡 <strong>Comment ça marche :</strong> Votre progression augmente automatiquement quand vous répondez aux questions et réalisez les exercices !
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de messages */}
      <div className={getMessagesContainerClasses()}>
        {state.messages.length === 0 && !sessionInitialized ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              🔄 Initialisation du moteur IA structurant...
            </h3>
            <p className="text-gray-600">
              Préparation de votre session de formation personnalisée
            </p>
          </div>
        ) : state.messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              🎓 Bienvenue dans votre formation EBIOS RM !
            </h3>
            <p className="text-gray-600 max-w-lg mx-auto mb-6">
              Je suis votre formateur virtuel spécialisé en EBIOS Risk Manager.
              Je vais vous accompagner dans l'apprentissage de cette méthodologie de gestion des risques cyber.
            </p>

            {/* Guide de démarrage SIMPLIFIÉ */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-8 max-w-3xl mx-auto mb-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎓</span>
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Formation EBIOS RM Interactive</h4>
                <p className="text-lg text-gray-700">Apprenez la cybersécurité avec le cas pratique du CHU Métropolitain</p>
              </div>

              <div className="bg-white rounded-lg p-6 mb-6 border border-green-200">
                <h5 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                  🎯 Votre parcours de formation en 3 étapes simples
                </h5>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl mb-2">1️⃣</div>
                    <h6 className="font-semibold text-blue-800 mb-2">Découvrir</h6>
                    <p className="text-sm text-blue-700">Comprendre EBIOS RM et le contexte CHU</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl mb-2">2️⃣</div>
                    <h6 className="font-semibold text-purple-800 mb-2">Pratiquer</h6>
                    <p className="text-sm text-purple-700">Réaliser les 5 ateliers avec des exercices</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl mb-2">3️⃣</div>
                    <h6 className="font-semibold text-green-800 mb-2">Maîtriser</h6>
                    <p className="text-sm text-green-700">Valider vos acquis et obtenir votre certification</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h5 className="font-semibold text-yellow-800 mb-2 flex items-center">
                  💡 Comment ça marche ?
                </h5>
                <div className="text-sm text-yellow-700 space-y-2">
                  <p><strong>✅ Répondez dans la zone de texte</strong> en bas de l'écran</p>
                  <p><strong>✅ Cliquez sur les boutons d'actions</strong> pour avancer</p>
                  <p><strong>✅ Votre progression</strong> s'affiche automatiquement en haut</p>
                  <p><strong>✅ Posez des questions</strong> à tout moment pour obtenir de l'aide</p>
                </div>
              </div>
            </div>

            {/* Actions de démarrage ULTRA-SIMPLIFIÉES */}
            <div className="space-y-6">
              <div className="bg-white border-2 border-green-300 rounded-xl p-6 shadow-lg">
                <h4 className="text-2xl font-bold text-center text-green-800 mb-6 flex items-center justify-center">
                  🚀 Commencez votre formation maintenant !
                </h4>

                <div className="grid gap-4 max-w-2xl mx-auto">
                  <button
                    onClick={() => {
                      setInputMessage("GO");
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg text-left"
                  >
                    <div className="flex items-center">
                      <div className="text-4xl mr-4">🎯</div>
                      <div>
                        <div className="text-xl font-bold">DÉMARRER LA FORMATION</div>
                        <div className="text-green-100 text-sm">Dr. Sophie vous accueille et vous guide pas à pas</div>
                      </div>
                    </div>
                  </button>

                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setInputMessage("Présentez-moi le CHU");
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      className="bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-all text-left"
                    >
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">🏥</div>
                        <div>
                          <div className="font-bold">Découvrir le CHU</div>
                          <div className="text-blue-100 text-xs">Contexte de l'étude</div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setInputMessage("Que dois-je faire ?");
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      className="bg-orange-600 text-white px-6 py-4 rounded-lg hover:bg-orange-700 transition-all text-left"
                    >
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">❓</div>
                        <div>
                          <div className="font-bold">Besoin d'aide ?</div>
                          <div className="text-orange-100 text-xs">Guide personnalisé</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">💡 Ou posez directement votre question :</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "Quels sont les biens supports ?",
                    "Analysons les menaces du CHU",
                    "Montrez-moi un exemple concret",
                    "Comment évaluer les risques ?"
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(suggestion)}
                      className="px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {state.messages.map(renderMessage)}
            
            {/* Indicateur de frappe */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex max-w-[80%]">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="bg-white border rounded-lg px-4 py-2 shadow-sm">
                    <div className="flex items-center space-x-1">
                      <Loader className="w-4 h-4 animate-spin text-gray-500" />
                      <span className="text-sm text-gray-500">Le formateur écrit...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className={`bg-white border-t border-gray-200 p-4 flex-shrink-0 ${isFullscreen ? 'shadow-lg' : ''}`}>
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question sur EBIOS RM..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              disabled={isTyping}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {/* Actions rapides et navigation ateliers */}
        <div className="mt-3 space-y-3">
          {/* Navigation entre ateliers */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">Ateliers EBIOS RM :</span>
            </div>
            <div className="flex space-x-1">
              {[
                { id: 1, name: 'Cadrage', icon: '🎯' },
                { id: 2, name: 'Sources', icon: '⚠️' },
                { id: 3, name: 'Stratégique', icon: '🎪' },
                { id: 4, name: 'Opérationnel', icon: '⚙️' },
                { id: 5, name: 'Traitement', icon: '🛡️' }
              ].map((workshop) => (
                <button
                  key={workshop.id}
                  onClick={() => {
                    setCurrentWorkshop(workshop.id);
                    setInputMessage(`Commençons l'atelier ${workshop.id} : ${workshop.name}`);
                  }}
                  disabled={isTyping}
                  className={`
                    px-2 py-1 text-xs rounded-md transition-all
                    ${currentWorkshop === workshop.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                  title={`Atelier ${workshop.id}: ${workshop.name}`}
                >
                  {workshop.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Actions intelligentes contextuelles */}
          <div>
            <p className="text-xs text-gray-500 mb-2">⚡ Actions rapides :</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[
                { text: "🎯 Démarrer formation", action: "GO" },
                { text: "🏥 Contexte CHU", action: "Présentez-moi le CHU" },
                { text: "📋 Atelier 1", action: "Commençons l'atelier 1" },
                { text: "🔍 Biens supports", action: "Identifions les biens supports" },
                { text: "⚠️ Menaces", action: "Analysons les menaces" },
                { text: "❓ Aide", action: "Que dois-je faire ?" }
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputMessage(item.action);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className="px-2 py-2 text-xs bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-lg hover:from-blue-100 hover:to-purple-100 border border-blue-200 hover:border-blue-300 transition-all text-center"
                  disabled={isTyping}
                >
                  {item.text}
                </button>
              ))}
            </div>

            {/* Suggestions textuelles rapides */}
            <div className="mt-2 flex flex-wrap gap-1">
              {[
                "Montrez-moi un exemple",
                "Évaluons ma progression",
                "Étape suivante"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(suggestion)}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                  disabled={isTyping}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Aide pour les contrôles d'expansion */}
            {!isFullscreen && !isExpanded && chatHeight === 'normal' && (
              <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
                💡 <strong>Astuce :</strong> Utilisez les boutons en haut à droite pour agrandir le chat ou{' '}
                les raccourcis{' '}
                <span className="px-1 bg-white border rounded font-mono">Ctrl+Shift+F</span> (plein écran),{' '}
                <span className="px-1 bg-white border rounded font-mono">Ctrl+Shift+E</span> (étendre),{' '}
                <span className="px-1 bg-white border rounded font-mono">Ctrl+Shift+R</span> (redimensionner)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingChatInterfaceSimple;
