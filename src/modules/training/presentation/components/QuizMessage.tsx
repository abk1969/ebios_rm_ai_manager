import React from 'react';
import { HelpCircle } from 'lucide-react';

interface Quiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizMessageProps {
  message: {
    id: string;
    content: string;
    timestamp: number;
    quiz: Quiz;
    metadata?: {
      confidence: number;
      sources: string[];
      timestamp: Date;
    };
  };
  setInputMessage: (message: string) => void;
}

export const QuizMessage: React.FC<QuizMessageProps> = ({ message, setInputMessage }) => {
  return (
    <div key={message.id} className="flex justify-start mb-4">
      <div className="flex max-w-[80%] flex-row">
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="rounded-lg px-4 py-2 bg-orange-50 text-orange-800 border border-orange-200">
          <p className="text-sm font-medium mb-2">🧠 **Quiz EBIOS RM**</p>
          <p className="text-sm mb-3">{message.quiz.question}</p>
          <div className="space-y-2">
            {message.quiz.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(`Réponse ${index + 1}: ${option}`)}
                className="block w-full text-left px-3 py-2 text-sm bg-white border border-orange-200 rounded hover:bg-orange-100 transition-colors"
              >
                {index + 1}. {option}
              </button>
            ))}
          </div>
          <div className="text-xs mt-2 text-orange-500">
            {new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};