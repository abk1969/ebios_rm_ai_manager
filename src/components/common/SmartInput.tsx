import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Check, X, Loader } from 'lucide-react';
import { useAICompletion } from '@/hooks/useAICompletion';

interface SmartInputProps {
  type: 'business-value' | 'supporting-asset' | 'risk-source' | 'dreaded-event' | 'scenario';
  field: 'name' | 'description' | 'category';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  existingData: any[];
  context?: any;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  isTextarea?: boolean;
  rows?: number;
}

const SmartInput: React.FC<SmartInputProps> = ({
  type,
  field,
  value,
  onChange,
  onBlur,
  placeholder,
  existingData = [],
  context,
  disabled = false,
  required = false,
  className = "",
  isTextarea = false,
  rows = 3
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const {
    suggestions,
    isLoading,
    acceptSuggestion,
    clearSuggestions,
    hasSuggestions
  } = useAICompletion({
    type,
    existingData,
    currentInput: value,
    field,
    context
  });

  // Afficher les suggestions quand l'input est focus et qu'il y en a
  useEffect(() => {
    setShowSuggestions(isFocused && hasSuggestions);
    setSelectedIndex(-1);
  }, [isFocused, hasSuggestions]);

  // Navigation au clavier dans les suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      
      case 'Escape':
        setShowSuggestions(false);
        clearSuggestions();
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionSelect = (suggestion: any) => {
    const newValue = acceptSuggestion(suggestion);
    onChange(newValue);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Délai pour permettre le clic sur une suggestion
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setIsFocused(false);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        if (onBlur) onBlur();
      }
    }, 150);
  };

  const getSuggestionIcon = (source: string) => {
    switch (source) {
      case 'ai':
        return <Sparkles className="h-3 w-3 text-purple-500" />;
      case 'template':
        return <Search className="h-3 w-3 text-blue-500" />;
      case 'similar':
        return <Check className="h-3 w-3 text-green-500" />;
      default:
        return <Search className="h-3 w-3 text-gray-400" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'border-l-green-400';
    if (confidence >= 0.6) return 'border-l-yellow-400';
    return 'border-l-gray-400';
  };

  const inputClassName = `
    w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    ${disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'}
    ${hasSuggestions && isFocused ? 'ring-2 ring-blue-500 border-blue-500' : ''}
    ${className}
  `;

  const InputComponent = isTextarea ? 'textarea' : 'input';

  return (
    <div className="relative">
      <div className="relative">
        <InputComponent
          ref={inputRef as any}
          type={isTextarea ? undefined : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={isTextarea ? rows : undefined}
          className={inputClassName}
        />
        
        {/* Indicateur d'état */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {isLoading && (
            <Loader className="h-4 w-4 text-blue-500 animate-spin" />
          )}
          {hasSuggestions && !isLoading && (
            <Sparkles className="h-4 w-4 text-purple-500" />
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto"
        >
          <div className="p-2 text-xs text-gray-500 bg-gray-50 border-b">
            🤖 Suggestions IA EBIOS RM
          </div>
          
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`p-3 cursor-pointer border-l-4 ${getConfidenceColor(suggestion.confidence)} ${
                index === selectedIndex
                  ? 'bg-blue-50 text-blue-900'
                  : 'hover:bg-gray-50'
              } transition-colors`}
              onClick={() => handleSuggestionSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0 mt-1">
                  {getSuggestionIcon(suggestion.source)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {suggestion.text}
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {suggestion.source}
                      </span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          suggestion.confidence >= 0.8 ? 'bg-green-400' :
                          suggestion.confidence >= 0.6 ? 'bg-yellow-400' :
                          'bg-gray-400'
                        }`}
                        title={`Confiance: ${Math.round(suggestion.confidence * 100)}%`}
                      />
                    </div>
                  </div>
                  {suggestion.description && (
                    <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {suggestion.description}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <div className="p-2 text-xs text-gray-500 bg-gray-50 border-t">
            ↑↓ Naviguer • Entrée Sélectionner • Échap Fermer
          </div>
        </div>
      )}

      {/* États des suggestions */}
      {showSuggestions && suggestions.length === 0 && !isLoading && value.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-4 text-center text-gray-500">
            <Search className="h-6 w-6 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Aucune suggestion disponible</p>
            <p className="text-xs">Continuez à taper pour obtenir des recommandations IA</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartInput; 