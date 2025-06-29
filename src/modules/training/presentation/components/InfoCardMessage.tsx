import React from 'react';
import { CheckCircle } from 'lucide-react';

interface InfoCard {
  title: string;
  content: string;
  imageUrl?: string;
  resources?: string[];
}

interface InfoCardMessageProps {
  message: {
    id: string;
    content: string;
    timestamp: number;
    infoCard: InfoCard;
    metadata?: {
      confidence: number;
      sources: string[];
      timestamp: Date;
    };
  };
}

export const InfoCardMessage: React.FC<InfoCardMessageProps> = ({ message }) => {
  return (
    <div key={message.id} className="flex justify-start mb-4">
      <div className="flex max-w-[80%] flex-row">
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="rounded-lg px-4 py-2 bg-green-50 text-green-800 border border-green-200">
          <h4 className="text-sm font-medium mb-2">{message.infoCard.title}</h4>
          <p className="text-sm whitespace-pre-wrap">{message.infoCard.content}</p>
          {message.infoCard.resources && message.infoCard.resources.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-medium mb-1">📚 Ressources :</p>
              <ul className="text-xs space-y-1">
                {message.infoCard.resources.map((resource, index) => (
                  <li key={index} className="text-green-600">• {resource}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-xs mt-2 text-green-500">
            {new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};