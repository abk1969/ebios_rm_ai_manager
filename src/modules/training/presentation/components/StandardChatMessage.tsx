import React from 'react';
import { Bot, User } from 'lucide-react';
import { TrainingModuleState } from '../context/TrainingModuleContext';

interface StandardChatMessageProps {
  message: Pick<TrainingModuleState['messages'][0], 'id' | 'type' | 'content' | 'timestamp'>;
}

export const StandardChatMessage: React.FC<StandardChatMessageProps> = ({ message }) => {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';

  return (
    <div
      key={message.id}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-blue-600 text-white'
              : isSystem
                ? 'bg-gray-500 text-white'
                : 'bg-green-600 text-white'
          }`}>
            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </div>
        </div>

        {/* Message */}
        <div className={`rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-600 text-white'
            : isSystem
              ? 'bg-gray-100 text-gray-800 border'
              : 'bg-white text-gray-800 border shadow-sm'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <div className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};