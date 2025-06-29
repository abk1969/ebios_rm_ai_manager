/**
 * 🧪 PANNEAU DE TEST LLM
 * Interface pour tester la configuration des modèles LLM
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TestTube,
  CheckCircle,
  XCircle,
  RefreshCw,
  Clock,
  Zap,
  MessageSquare,
  BarChart3
} from 'lucide-react';
import { LLMConfigManager, callLLM, LLMMonitor } from '@/config/llm';

interface TestResult {
  success: boolean;
  message: string;
  responseTime: number;
  tokens?: number;
  model?: string;
  timestamp: Date;
}

const LLMTestPanel: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testMessage, setTestMessage] = useState('Bonjour, pouvez-vous m\'aider avec une analyse EBIOS RM ?');
  const [metrics, setMetrics] = useState(LLMMonitor.getMetrics());

  const configManager = LLMConfigManager.getInstance();

  const runTest = async () => {
    setTesting(true);
    const startTime = Date.now();

    try {
      const config = await configManager.getCurrentConfig();
      
      const response = await callLLM([
        { role: 'user', content: testMessage }
      ], {
        maxTokens: 100,
        temperature: 0.1
      });

      const responseTime = Date.now() - startTime;
      const tokens = response.usage?.total_tokens || 0;

      const result: TestResult = {
        success: true,
        message: response.choices[0]?.message?.content || 'Réponse reçue',
        responseTime,
        tokens,
        model: config.model,
        timestamp: new Date()
      };

      setTestResults(prev => [result, ...prev.slice(0, 4)]);
      LLMMonitor.recordCall(true, tokens, responseTime);

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      const result: TestResult = {
        success: false,
        message: error.message || 'Erreur de test',
        responseTime,
        timestamp: new Date()
      };

      setTestResults(prev => [result, ...prev.slice(0, 4)]);
      LLMMonitor.recordCall(false, 0, responseTime, error.message);
    } finally {
      setTesting(false);
      setMetrics(LLMMonitor.getMetrics());
    }
  };

  const runBenchmark = async () => {
    setTesting(true);
    const testMessages = [
      'Test de performance 1',
      'Test de performance 2',
      'Test de performance 3'
    ];

    for (const message of testMessages) {
      try {
        const startTime = Date.now();
        const response = await callLLM([
          { role: 'user', content: message }
        ], { maxTokens: 50 });
        
        const responseTime = Date.now() - startTime;
        const tokens = response.usage?.total_tokens || 0;
        
        LLMMonitor.recordCall(true, tokens, responseTime);
      } catch (error) {
        LLMMonitor.recordCall(false, 0, Date.now() - Date.now(), error.message);
      }
    }

    setMetrics(LLMMonitor.getMetrics());
    setTesting(false);
  };

  const clearResults = () => {
    setTestResults([]);
    LLMMonitor.resetMetrics();
    setMetrics(LLMMonitor.getMetrics());
  };

  return (
    <div className="space-y-6">
      {/* Interface de test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5 text-blue-600" />
            Test de Configuration LLM
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message de test
            </label>
            <textarea
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Entrez votre message de test..."
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={runTest}
              disabled={testing || !testMessage.trim()}
              className="flex items-center gap-2"
            >
              {testing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <MessageSquare className="h-4 w-4" />
              )}
              Test Simple
            </Button>

            <Button
              onClick={runBenchmark}
              disabled={testing}
              variant="outline"
              className="flex items-center gap-2"
            >
              {testing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <BarChart3 className="h-4 w-4" />
              )}
              Benchmark
            </Button>

            <Button
              onClick={clearResults}
              variant="outline"
              size="sm"
            >
              Effacer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Métriques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            Métriques de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{metrics.totalCalls}</div>
              <div className="text-sm text-blue-700">Appels Total</div>
            </div>

            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {(metrics.successRate * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-green-700">Taux de Succès</div>
            </div>

            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {metrics.averageResponseTime.toFixed(0)}ms
              </div>
              <div className="text-sm text-purple-700">Temps Moyen</div>
            </div>

            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {metrics.totalTokens.toLocaleString()}
              </div>
              <div className="text-sm text-orange-700">Tokens Total</div>
            </div>
          </div>

          {metrics.lastError && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Dernière erreur: {metrics.lastError}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Résultats des tests */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              Historique des Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.success
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={result.success ? 'default' : 'destructive'}>
                            {result.success ? 'Succès' : 'Échec'}
                          </Badge>
                          
                          {result.model && (
                            <Badge variant="outline" className="text-xs">
                              {result.model}
                            </Badge>
                          )}
                          
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {result.responseTime}ms
                          </div>
                          
                          {result.tokens && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Zap className="h-3 w-3" />
                              {result.tokens} tokens
                            </div>
                          )}
                        </div>
                        
                        <p className={`text-sm ${
                          result.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {result.message}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {result.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LLMTestPanel;
