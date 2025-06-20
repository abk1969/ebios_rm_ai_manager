import React from 'react';
import { Lightbulb } from 'lucide-react';

interface Action {
  label: string;
  payload: string;
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  icon?: string;
}

interface SystemActionsMessageProps {
  message: {
    id: string;
    content: string;
    timestamp: number;
    actions: Action[];
    metadata?: {
      confidence: number;
      sources: string[];
      timestamp: Date;
    };
  };
  setInputMessage: (message: string) => void;
}

export const SystemActionsMessage: React.FC<SystemActionsMessageProps> = ({ message, setInputMessage }) => {
  return (
    <div key={message.id} className="flex justify-start mb-4">
      <div className="flex max-w-[80%] flex-row">
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
        </div>
        <div className="rounded-lg px-4 py-2 bg-purple-50 text-purple-800 border border-purple-200">
          {/* Message principal */}
          {message.content && (
            <div className="prose prose-sm max-w-none mb-3">
              <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br>') }} />
            </div>
          )}
          <p className="text-sm font-medium mb-2">🎯 **Actions suggérées :**</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {message.actions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(action.payload)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                  action.type === 'primary' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                  action.type === 'success' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                  action.type === 'warning' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' :
                  action.type === 'info' ? 'bg-cyan-100 text-cyan-800 hover:bg-cyan-200' :
                  'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {action.icon && <span className="mr-1">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
          <p className="text-xs mt-2 text-purple-600">💡 Cliquez sur une suggestion ou tapez votre choix !</p>
          <div className="text-xs mt-1 text-purple-500">
            {new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};