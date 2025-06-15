/**
 * 📊 COMPOSANT D'INFORMATION SUR LES MODÈLES
 * Affiche les détails et statuts des modèles LLM
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bot,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  DollarSign,
  Info,
  Star,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { ModelUpdater } from '@/services/settings/ModelUpdater';
import type { LLMModel } from '@/services/settings/SettingsService';

interface ModelInfoProps {
  models: LLMModel[];
  selectedModelId: string;
  onModelSelect?: (modelId: string) => void;
  showTestButton?: boolean;
}

const ModelInfo: React.FC<ModelInfoProps> = ({
  models,
  selectedModelId,
  onModelSelect,
  showTestButton = false
}) => {
  const [testingModel, setTestingModel] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { available: boolean; message: string }>>({});

  const modelUpdater = ModelUpdater.getInstance();

  const testModelAvailability = async (model: LLMModel) => {
    setTestingModel(model.id);
    
    try {
      // Ici, vous devriez récupérer la clé API appropriée
      const apiKey = ''; // À implémenter selon votre logique
      const result = await modelUpdater.testModelAvailability(model.id, apiKey);
      
      setTestResults(prev => ({
        ...prev,
        [model.id]: result
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [model.id]: { available: false, message: 'Erreur de test' }
      }));
    } finally {
      setTestingModel(null);
    }
  };

  const getProviderColor = (provider: string) => {
    const colors = {
      'Google': 'bg-blue-100 text-blue-800',
      'Anthropic': 'bg-purple-100 text-purple-800',
      'Mistral AI': 'bg-orange-100 text-orange-800',
      'OpenAI': 'bg-green-100 text-green-800',
      'Alibaba': 'bg-red-100 text-red-800',
      'DeepSeek': 'bg-indigo-100 text-indigo-800',
      'Meta': 'bg-blue-100 text-blue-800'
    };
    return colors[provider as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCost = (cost: number) => {
    if (cost === 0) return 'Gratuit';
    if (cost < 1) return `$${cost.toFixed(3)}/1k`;
    return `$${cost.toFixed(2)}/1k`;
  };

  const formatTokens = (tokens: number) => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}k`;
    return tokens.toString();
  };

  const isRecommended = (modelId: string) => {
    return modelId === 'google/gemini-2.5-flash-preview-05-20';
  };

  const isLatest = (modelId: string) => {
    return modelId.includes('claude-4') || modelId.includes('2.5');
  };

  return (
    <div className="space-y-4">
      {models.map((model) => {
        const isSelected = model.id === selectedModelId;
        const testResult = testResults[model.id];
        
        return (
          <Card 
            key={model.id} 
            className={`transition-all duration-200 ${
              isSelected 
                ? 'ring-2 ring-blue-500 border-blue-200 bg-blue-50' 
                : 'hover:shadow-md cursor-pointer'
            }`}
            onClick={() => onModelSelect?.(model.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">{model.name}</h3>
                    
                    {isRecommended(model.id) && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Recommandé
                      </Badge>
                    )}
                    
                    {isLatest(model.id) && (
                      <Badge className="bg-purple-100 text-purple-800 text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Dernière version
                      </Badge>
                    )}
                    
                    {isSelected && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Actif
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getProviderColor(model.provider)}>
                      {model.provider}
                    </Badge>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Zap className="h-3 w-3" />
                      {formatTokens(model.maxTokens)} tokens
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <DollarSign className="h-3 w-3" />
                      {formatCost(model.costPer1kTokens)}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{model.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {model.capabilities.map((capability) => (
                      <Badge 
                        key={capability} 
                        variant="outline" 
                        className="text-xs"
                      >
                        {capability}
                      </Badge>
                    ))}
                  </div>

                  {testResult && (
                    <div className={`flex items-center gap-2 text-sm p-2 rounded ${
                      testResult.available 
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {testResult.available ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {testResult.message}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {showTestButton && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        testModelAvailability(model);
                      }}
                      disabled={testingModel === model.id}
                      variant="outline"
                      size="sm"
                    >
                      {testingModel === model.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Info className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ModelInfo;
