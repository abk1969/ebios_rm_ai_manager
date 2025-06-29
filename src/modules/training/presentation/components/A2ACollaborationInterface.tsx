/**
 * 🤝 INTERFACE DE COLLABORATION A2A
 * Communication temps réel entre experts EBIOS RM
 * POINT 3 - Interface Utilisateur React Intelligente
 */

import React, { useState, useEffect, useRef } from 'react';
import { EbiosExpertProfile } from '../../../../infrastructure/a2a/types/AgentCardTypes';
import { ExpertiseLevel } from '../../domain/services/AdaptiveContentService';

// 🎯 TYPES POUR LA COLLABORATION

interface A2ACollaborationInterfaceProps {
  userProfile: EbiosExpertProfile;
  expertiseLevel: ExpertiseLevel | null;
  onCollaborationRequest: (experts: string[], topic: string) => Promise<void>;
  onInsightRequest: (topic: string) => Promise<void>;
  className?: string;
}

interface CollaborationSession {
  id: string;
  topic: string;
  participants: ExpertParticipant[];
  status: 'pending' | 'active' | 'completed';
  startTime: Date;
  messages: CollaborationMessage[];
  insights: SharedInsight[];
}

interface ExpertParticipant {
  id: string;
  name: string;
  role: string;
  expertiseLevel: string;
  sector: string;
  status: 'online' | 'offline' | 'busy';
  avatar?: string;
}

interface CollaborationMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'insight' | 'validation' | 'question';
  timestamp: Date;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
}

interface MessageAttachment {
  id: string;
  name: string;
  type: 'document' | 'image' | 'link';
  url: string;
  size?: number;
}

interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
}

interface SharedInsight {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  category: 'methodology' | 'sector_specific' | 'best_practice' | 'warning';
  relevance: number; // 0-100
  timestamp: Date;
  votes: InsightVote[];
}

interface InsightVote {
  userId: string;
  vote: 'up' | 'down';
  comment?: string;
}

// 🤝 COMPOSANT PRINCIPAL

export const A2ACollaborationInterface: React.FC<A2ACollaborationInterfaceProps> = ({
  userProfile,
  expertiseLevel,
  onCollaborationRequest,
  onInsightRequest,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'experts' | 'insights'>('sessions');
  const [collaborationSessions, setCollaborationSessions] = useState<CollaborationSession[]>([]);
  const [availableExperts, setAvailableExperts] = useState<ExpertParticipant[]>([]);
  const [sharedInsights, setSharedInsights] = useState<SharedInsight[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🚀 INITIALISATION

  useEffect(() => {
    initializeCollaborationData();
  }, [userProfile]);

  // 📊 SIMULATION DES DONNÉES

  const initializeCollaborationData = () => {
    // Simulation d'experts disponibles
    const mockExperts: ExpertParticipant[] = [
      {
        id: 'expert-1',
        name: 'Dr. Marie Dubois',
        role: 'Expert EBIOS RM Santé',
        expertiseLevel: 'master',
        sector: 'santé',
        status: 'online'
      },
      {
        id: 'expert-2',
        name: 'Jean-Pierre Martin',
        role: 'RSSI Senior',
        expertiseLevel: 'expert',
        sector: 'finance',
        status: 'online'
      },
      {
        id: 'expert-3',
        name: 'Sophie Laurent',
        role: 'Consultante Cybersécurité',
        expertiseLevel: 'senior',
        sector: 'énergie',
        status: 'busy'
      }
    ];

    // Simulation de sessions de collaboration
    const mockSessions: CollaborationSession[] = [
      {
        id: 'session-1',
        topic: 'Analyse des risques CHU - Systèmes critiques',
        participants: [mockExperts[0], mockExperts[1]],
        status: 'active',
        startTime: new Date(Date.now() - 30 * 60 * 1000), // Il y a 30 minutes
        messages: [
          {
            id: 'msg-1',
            senderId: 'expert-1',
            senderName: 'Dr. Marie Dubois',
            content: 'Bonjour, j\'aimerais discuter de l\'identification des biens essentiels pour un CHU.',
            type: 'text',
            timestamp: new Date(Date.now() - 25 * 60 * 1000)
          },
          {
            id: 'msg-2',
            senderId: 'expert-2',
            senderName: 'Jean-Pierre Martin',
            content: 'Excellente question ! Dans le secteur santé, il faut prioriser la continuité des soins.',
            type: 'text',
            timestamp: new Date(Date.now() - 20 * 60 * 1000)
          }
        ],
        insights: []
      }
    ];

    // Simulation d'insights partagés
    const mockInsights: SharedInsight[] = [
      {
        id: 'insight-1',
        authorId: 'expert-1',
        authorName: 'Dr. Marie Dubois',
        title: 'Spécificités EBIOS RM pour le secteur santé',
        content: 'Dans le secteur santé, la continuité des soins est un critère DICP prioritaire. Il faut considérer l\'impact patient avant tout.',
        category: 'sector_specific',
        relevance: 95,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        votes: [
          { userId: 'expert-2', vote: 'up', comment: 'Très pertinent pour les CHU' }
        ]
      }
    ];

    setAvailableExperts(mockExperts);
    setCollaborationSessions(mockSessions);
    setSharedInsights(mockInsights);
  };

  // 📱 GESTION DES ONGLETS

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sessions':
        return renderCollaborationSessions();
      case 'experts':
        return renderAvailableExperts();
      case 'insights':
        return renderSharedInsights();
      default:
        return null;
    }
  };

  // 🤝 RENDU DES SESSIONS DE COLLABORATION

  const renderCollaborationSessions = () => (
    <div className="space-y-4 animate-fade-in">
      {/* Bouton nouvelle session */}
      <button
        onClick={() => setIsCreatingSession(true)}
        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors animate-fade-in"
      >
        ➕ Nouvelle collaboration
      </button>

      {/* Liste des sessions */}
      {collaborationSessions.map(session => (
        <div
          key={session.id}
          className={`bg-white border rounded-lg p-4 cursor-pointer transition-all ${
            selectedSession === session.id ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setSelectedSession(session.id)}
        >
          <div className="flex items-start justify-between animate-fade-in">
            <div className="flex-1 animate-fade-in">
              <h4 className="font-medium text-gray-900 mb-1 animate-fade-in">{session.topic}</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-500 animate-fade-in">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  session.status === 'active' ? 'bg-green-100 text-green-800' :
                  session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {session.status}
                </span>
                <span>{session.participants.length} participants</span>
                <span>{session.messages.length} messages</span>
              </div>
            </div>
            <div className="flex -space-x-2 animate-fade-in">
              {session.participants.slice(0, 3).map(participant => (
                <div
                  key={participant.id}
                  className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white animate-fade-in"
                  title={participant.name}
                >
                  {participant.name.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Interface de chat si session sélectionnée */}
      {selectedSession && renderChatInterface()}
    </div>
  );

  // 💬 INTERFACE DE CHAT

  const renderChatInterface = () => {
    const session = collaborationSessions.find(s => s.id === selectedSession);
    if (!session) return null;

    return (
      <div
        className="mt-4 bg-gray-50 rounded-lg p-4 animate-fade-in"
      >
        <div className="flex items-center justify-between mb-4 animate-fade-in">
          <h5 className="font-medium text-gray-900 animate-fade-in">💬 {session.topic}</h5>
          <button
            onClick={() => setSelectedSession(null)}
            className="text-gray-400 hover:text-gray-600 animate-fade-in"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="h-64 overflow-y-auto bg-white rounded border p-3 mb-3 space-y-3 animate-fade-in">
          {session.messages.map(message => (
            <div key={message.id} className="flex space-x-3 animate-fade-in">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs animate-fade-in">
                {message.senderName.charAt(0)}
              </div>
              <div className="flex-1 animate-fade-in">
                <div className="flex items-center space-x-2 mb-1 animate-fade-in">
                  <span className="font-medium text-sm animate-fade-in">{message.senderName}</span>
                  <span className="text-xs text-gray-500 animate-fade-in">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 animate-fade-in">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="flex space-x-2 animate-fade-in">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 animate-fade-in"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 animate-fade-in"
          >
            📤
          </button>
        </div>
      </div>
    );
  };

  // 👥 RENDU DES EXPERTS DISPONIBLES

  const renderAvailableExperts = () => (
    <div className="space-y-3 animate-fade-in">
      {availableExperts.map(expert => (
        <div
          key={expert.id}
          className="bg-white border border-gray-200 rounded-lg p-4 animate-fade-in"
        >
          <div className="flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="relative animate-fade-in">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium animate-fade-in">
                  {expert.name.charAt(0)}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  expert.status === 'online' ? 'bg-green-500' :
                  expert.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 animate-fade-in">{expert.name}</h4>
                <p className="text-sm text-gray-600 animate-fade-in">{expert.role}</p>
                <div className="flex items-center space-x-2 mt-1 animate-fade-in">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded animate-fade-in">
                    {expert.expertiseLevel}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded animate-fade-in">
                    {expert.sector}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2 animate-fade-in">
              <button
                onClick={() => handleInviteExpert(expert)}
                disabled={expert.status === 'offline'}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 animate-fade-in"
              >
                Inviter
              </button>
              <button
                onClick={() => handleRequestInsight(expert)}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 animate-fade-in"
              >
                💡 Insight
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // 💡 RENDU DES INSIGHTS PARTAGÉS

  const renderSharedInsights = () => (
    <div className="space-y-4 animate-fade-in">
      {sharedInsights.map(insight => (
        <div
          key={insight.id}
          className="bg-white border border-gray-200 rounded-lg p-4 animate-fade-in"
        >
          <div className="flex items-start justify-between mb-3 animate-fade-in">
            <div className="flex-1 animate-fade-in">
              <h4 className="font-medium text-gray-900 mb-1 animate-fade-in">{insight.title}</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2 animate-fade-in">
                <span>{insight.authorName}</span>
                <span>•</span>
                <span>{insight.timestamp.toLocaleDateString()}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  insight.category === 'methodology' ? 'bg-blue-100 text-blue-800' :
                  insight.category === 'sector_specific' ? 'bg-green-100 text-green-800' :
                  insight.category === 'best_practice' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {insight.category}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 animate-fade-in">
              <span className="text-sm text-gray-500 animate-fade-in">{insight.relevance}%</span>
              <div className="flex space-x-1 animate-fade-in">
                <button className="text-green-600 hover:text-green-800 animate-fade-in">👍</button>
                <button className="text-red-600 hover:text-red-800 animate-fade-in">👎</button>
              </div>
            </div>
          </div>
          <p className="text-gray-700 text-sm animate-fade-in">{insight.content}</p>
          {insight.votes.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100 animate-fade-in">
              <div className="flex items-center space-x-2 text-sm text-gray-500 animate-fade-in">
                <span>👍 {insight.votes.filter(v => v.vote === 'up').length}</span>
                <span>👎 {insight.votes.filter(v => v.vote === 'down').length}</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  // 🎯 GESTIONNAIRES D'ÉVÉNEMENTS

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedSession) return;

    const session = collaborationSessions.find(s => s.id === selectedSession);
    if (!session) return;

    const message: CollaborationMessage = {
      id: `msg-${Date.now()}`,
      senderId: userProfile.id,
      senderName: userProfile.name,
      content: newMessage,
      type: 'text',
      timestamp: new Date()
    };

    session.messages.push(message);
    setCollaborationSessions([...collaborationSessions]);
    setNewMessage('');

    // Scroll vers le bas
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleInviteExpert = async (expert: ExpertParticipant) => {
    try {
      await onCollaborationRequest([expert.id], `Collaboration avec ${expert.name}`);
    } catch (error) {
      console.error('❌ Erreur invitation expert:', error);
    }
  };

  const handleRequestInsight = async (expert: ExpertParticipant) => {
    try {
      await onInsightRequest(`Insight de ${expert.name} sur ${expert.sector}`);
    } catch (error) {
      console.error('❌ Erreur demande insight:', error);
    }
  };

  // 🎯 RENDU PRINCIPAL

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm h-full flex flex-col ${className}`}>
      {/* En-tête */}
      <div className="p-4 border-b border-gray-200 animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 animate-fade-in">
          🤝 Collaboration A2A
        </h3>
        
        {/* Onglets */}
        <div className="flex space-x-1 animate-fade-in">
          {(['sessions', 'experts', 'insights'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-sm rounded transition-colors ${
                activeTab === tab
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab === 'sessions' ? '💬 Sessions' :
               tab === 'experts' ? '👥 Experts' : '💡 Insights'}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 p-4 overflow-y-auto animate-fade-in">
        {renderTabContent()}
      </div>

      {/* Modal création de session */}
      <div>
        {isCreatingSession && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
            onClick={() => setIsCreatingSession(false)}
          >
            <div
              className="bg-white rounded-lg p-6 w-96 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-lg font-semibold mb-4 animate-fade-in">Nouvelle collaboration</h4>
              <div className="space-y-4 animate-fade-in">
                <input
                  type="text"
                  placeholder="Sujet de la collaboration..."
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 animate-fade-in"
                />
                <div className="flex justify-end space-x-2 animate-fade-in">
                  <button
                    onClick={() => setIsCreatingSession(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 animate-fade-in"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => setIsCreatingSession(false)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 animate-fade-in"
                  >
                    Créer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default A2ACollaborationInterface;
