/**
 * 🎓 INTERFACE CHAT FORMATION AVEC EXPANSION
 * Composant de chat avec fonctionnalités de pli/dépli automatique
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Loader, Maximize2, Minimize2, ChevronUp, ChevronDown, Target } from 'lucide-react';
import { SimpleAgentOrchestrator, SimpleAgentResponseData } from '../../domain/services/SimpleAgentOrchestrator';
import { useTrainingModuleState, useTrainingModuleActions } from '../context/TrainingModuleContext';

// 🎯 INTERFACE POUR PROPS DU COMPOSANT
interface ExpandableChatInterfaceProps {
  userId?: string;
  sessionId?: string;
  trainingMode?: string;
  onProgressUpdate?: (progress: any) => void;
  onWorkshopChange?: (workshopId: number) => void;
  onActivity?: (activity: any) => void;
}

export const ExpandableChatInterface: React.FC<ExpandableChatInterfaceProps> = ({
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 🎯 ÉTATS POUR L'EXPANSION DU CHAT
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatHeight, setChatHeight] = useState<'compact' | 'normal' | 'expanded'>('normal');

  // 🎯 FONCTIONS DE GESTION DE L'EXPANSION
  const toggleChatHeight = () => {
    const heights: Array<'compact' | 'normal' | 'expanded'> = ['compact', 'normal', 'expanded'];
    const currentIndex = heights.indexOf(chatHeight);
    const nextIndex = (currentIndex + 1) % heights.length;
    setChatHeight(heights[nextIndex]);
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

  // 🔄 Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  // ⌨️ Raccourcis clavier pour l'expansion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        toggleExpanded();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        toggleChatHeight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 📤 ENVOI DE MESSAGE
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    actions.addMessage({
      type: 'user',
      content: userMessage
    });

    setIsTyping(true);

    try {
      const response = await orchestrator.processUserMessage(userMessage, {
        userId,
        sessionId: sessionId || 'default',
        trainingMode,
        currentWorkshop: 1
      });

      if (response.success && response.data) {
        actions.addMessage({
          type: response.data.type || 'instructor',
          content: response.data.content,
          actions: response.data.actions,
          quiz: response.data.quiz,
          infoCard: response.data.infoCard
        });
      }
    } catch (error) {
      console.error('Erreur envoi message:', error);
      actions.addMessage({
        type: 'system',
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.'
      });
    } finally {
      setIsTyping(false);
    }
  };

  // 🎯 GESTION DES TOUCHES
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 🎯 INITIALISATION SESSION
  useEffect(() => {
    if (!sessionInitialized) {
      setSessionInitialized(true);
      actions.addMessage({
        type: 'instructor',
        content: 'Bonjour ! Je suis votre formateur virtuel EBIOS RM. Comment puis-je vous aider aujourd\'hui ?'
      });
    }
  }, [sessionInitialized, actions]);

  return (
    <div className={getChatContainerClasses()}>
      {/* En-tête avec contrôles d'expansion */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center">
                Dr. Sophie Cadrage - Formation EBIOS RM
                {isFullscreen && <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Plein écran</span>}
                {isExpanded && !isFullscreen && <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Étendu</span>}
                {chatHeight !== 'normal' && !isExpanded && !isFullscreen && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">{chatHeight}</span>
                )}
              </h3>
              <p className="text-sm text-gray-600">Expert EBIOS RM • CHU Métropolitain</p>
            </div>
          </div>
          
          {/* Contrôles d'expansion */}
          <div className="flex items-center space-x-2">
            {state.isOnline && (
              <div className="flex items-center text-green-600 text-sm mr-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                En ligne
              </div>
            )}
            
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
      </div>

      {/* Zone de messages */}
      <div className={getMessagesContainerClasses()}>
        {state.messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              🎓 Bienvenue dans votre formation EBIOS RM !
            </h3>
            <p className="text-gray-600 max-w-lg mx-auto mb-6">
              Je suis votre formateur virtuel spécialisé en EBIOS Risk Manager.
              Utilisez les contrôles en haut à droite pour ajuster la taille du chat.
            </p>
          </div>
        ) : (
          <>
            {state.messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-lg px-4 py-2 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border shadow-sm'
                  }`}>
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white border rounded-lg px-4 py-2 shadow-sm">
                  <div className="flex items-center space-x-1">
                    <Loader className="w-4 h-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">Le formateur écrit...</span>
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
        
        {/* Aide pour les contrôles */}
        {!isFullscreen && !isExpanded && chatHeight === 'normal' && (
          <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded p-2">
            💡 <strong>Astuce :</strong> Utilisez les boutons en haut à droite pour agrandir le chat ou les raccourcis Ctrl+Shift+F (plein écran), Ctrl+Shift+E (étendre), Ctrl+Shift+R (redimensionner)
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpandableChatInterface;
