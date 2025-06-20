/**
 * 🚀 LANCEUR DE QUESTIONS COMPLEXES
 * Interface pour démarrer des sessions de questions complexes
 * ÉTAPE 2.2.2 - Point d'entrée utilisateur
 */

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Alert,
  AlertDescription,
  Progress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui';
import { 
  Brain, 
  Target, 
  Clock, 
  Award, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Play,
  Settings
} from 'lucide-react';
import { ComplexQuestionIntegrationService, ComplexQuestionSessionRequest, ComplexQuestionMetrics } from '../domain/services/ComplexQuestionIntegrationService';
import { ComplexQuestionInterface } from './ComplexQuestionInterface';
import { EbiosExpertProfile } from '../../../../infrastructure/a2a/types/AgentCardTypes';

// 🎯 TYPES DU COMPOSANT

interface ComplexQuestionLauncherProps {
  userId: string;
  userProfile: EbiosExpertProfile;
  workshopId?: number;
  onSessionComplete?: (sessionId: string, results: any) => void;
}

interface SessionTypeConfig {
  id: 'practice' | 'assessment' | 'certification';
  name: string;
  description: string;
  duration: string;
  questionCount: number;
  difficulty: string;
  icon: React.ReactNode;
  color: string;
}

// 🎨 COMPOSANT PRINCIPAL

export const ComplexQuestionLauncher: React.FC<ComplexQuestionLauncherProps> = ({
  userId,
  userProfile,
  workshopId = 1,
  onSessionComplete
}) => {
  // 📊 ÉTAT DU COMPOSANT
  const [selectedWorkshop, setSelectedWorkshop] = useState(workshopId);
  const [selectedSessionType, setSelectedSessionType] = useState<'practice' | 'assessment' | 'certification'>('practice');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ComplexQuestionMetrics | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  // 🔧 SERVICES
  const integrationService = ComplexQuestionIntegrationService.getInstance();

  // 🎯 CONFIGURATION DES TYPES DE SESSION
  const sessionTypes: SessionTypeConfig[] = [
    {
      id: 'practice',
      name: 'Entraînement',
      description: 'Questions d\'entraînement adaptées à votre niveau',
      duration: '60 min',
      questionCount: 3,
      difficulty: 'Adaptative',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'assessment',
      name: 'Évaluation',
      description: 'Test de compétences avec scoring précis',
      duration: '45 min',
      questionCount: 5,
      difficulty: 'Standard',
      icon: <Brain className="w-5 h-5" />,
      color: 'bg-orange-500'
    },
    {
      id: 'certification',
      name: 'Certification',
      description: 'Examen complet pour validation ANSSI',
      duration: '90 min',
      questionCount: 8,
      difficulty: 'Expert',
      icon: <Award className="w-5 h-5" />,
      color: 'bg-green-500'
    }
  ];

  // 🚀 CHARGEMENT INITIAL
  useEffect(() => {
    loadMetrics();
  }, [userId]);

  const loadMetrics = async () => {
    try {
      const userMetrics = await integrationService.getComplexQuestionMetrics(userId);
      setMetrics(userMetrics);
    } catch (error) {
      console.error('Erreur chargement métriques:', error);
    }
  };

  // 🎮 DÉMARRAGE DE SESSION
  const handleStartSession = async () => {
    setIsLoading(true);
    setNotifications([]);

    try {
      const request: ComplexQuestionSessionRequest = {
        userId,
        workshopId: selectedWorkshop,
        userProfile,
        sessionType: selectedSessionType
      };

      const result = await integrationService.startIntegratedSession(request);

      if (result.integrationStatus === 'success') {
        setActiveSession(result.sessionId);
        setNotifications(result.notifications);
      } else {
        setNotifications(result.notifications);
      }
    } catch (error) {
      console.error('Erreur démarrage session:', error);
      setNotifications([{
        type: 'error',
        message: 'Erreur lors du démarrage de la session',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🏁 FIN DE SESSION
  const handleSessionComplete = (sessionId: string, results: any) => {
    setActiveSession(null);
    loadMetrics(); // Recharger les métriques
    onSessionComplete?.(sessionId, results);
  };

  // 🎨 RENDU CONDITIONNEL - SESSION ACTIVE
  if (activeSession) {
    return (
      <ComplexQuestionInterface
        sessionId={activeSession}
        userId={userId}
        userProfile={userProfile}
        onSessionComplete={handleSessionComplete}
      />
    );
  }

  // 🎨 RENDU PRINCIPAL
  return (
    <div className="space-y-6">
      {/* 📊 MÉTRIQUES UTILISATEUR */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Vos Performances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{metrics.totalSessions}</div>
                <div className="text-sm text-gray-600">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{metrics.averageScore}%</div>
                <div className="text-sm text-gray-600">Score Moyen</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{metrics.completionRate}%</div>
                <div className="text-sm text-gray-600">Taux de Réussite</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(metrics.timeSpent / 60)}h</div>
                <div className="text-sm text-gray-600">Temps Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 🚨 NOTIFICATIONS */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notification, index) => (
            <Alert key={index} variant={notification.type === 'error' ? 'destructive' : 'default'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{notification.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* 🎯 CONFIGURATION DE SESSION */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuration de Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélection d'atelier */}
          <div>
            <label className="block text-sm font-medium mb-2">Atelier EBIOS RM</label>
            <Select value={selectedWorkshop.toString()} onValueChange={(value) => setSelectedWorkshop(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Atelier 1 - Socle de sécurité</SelectItem>
                <SelectItem value="2">Atelier 2 - Sources de risque</SelectItem>
                <SelectItem value="3">Atelier 3 - Scénarios stratégiques</SelectItem>
                <SelectItem value="4">Atelier 4 - Scénarios opérationnels</SelectItem>
                <SelectItem value="5">Atelier 5 - Traitement du risque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Types de session */}
          <div>
            <label className="block text-sm font-medium mb-4">Type de Session</label>
            <Tabs value={selectedSessionType} onValueChange={(value: any) => setSelectedSessionType(value)}>
              <TabsList className="grid w-full grid-cols-3">
                {sessionTypes.map((type) => (
                  <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-2">
                    {type.icon}
                    {type.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {sessionTypes.map((type) => (
                <TabsContent key={type.id} value={type.id} className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${type.color} text-white`}>
                          {type.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{type.name}</h3>
                          <p className="text-gray-600 mb-4">{type.description}</p>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <div className="font-medium">Durée</div>
                              <div className="text-gray-600">{type.duration}</div>
                            </div>
                            <div>
                              <div className="font-medium">Questions</div>
                              <div className="text-gray-600">{type.questionCount}</div>
                            </div>
                            <div>
                              <div className="font-medium">Difficulté</div>
                              <div className="text-gray-600">{type.difficulty}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Bouton de démarrage */}
          <Button 
            onClick={handleStartSession}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Démarrage en cours...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Démarrer la Session
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 📈 PROGRESSION PAR ATELIER */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Progression par Atelier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(metrics.workshopProgress).map(([workshopId, progress]) => (
                <div key={workshopId}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Atelier {workshopId}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComplexQuestionLauncher;
