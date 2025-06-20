/**
 * 🎓 COMPOSANT D'INTÉGRATION SÉCURISÉ - MODULE FORMATION
 * Intégration par iFrame avec communication cross-frame sécurisée
 * Découplage total de l'application principale
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AlertTriangle, ExternalLink, Shield, Clock, Award } from 'lucide-react';
import { TrainingGateway, TrainingConfig, TrainingSession } from '../gateway/TrainingGateway';

// 🎯 TYPES ET INTERFACES
interface TrainingModuleEmbedProps {
  learnerId: string;
  config: TrainingConfig;
  onSessionCreated?: (session: TrainingSession) => void;
  onProgress?: (progress: any) => void;
  onCompleted?: (results: any) => void;
  onError?: (error: Error) => void;
  className?: string;
  height?: string;
  allowFullscreen?: boolean;
}

interface EmbedState {
  status: 'loading' | 'connecting' | 'ready' | 'error' | 'completed';
  session: TrainingSession | null;
  error: string | null;
  progress: {
    currentWorkshop: number;
    completionPercentage: number;
    timeSpent: number;
  } | null;
}

// 🎓 COMPOSANT PRINCIPAL
export const TrainingModuleEmbed: React.FC<TrainingModuleEmbedProps> = ({
  learnerId,
  config,
  onSessionCreated,
  onProgress,
  onCompleted,
  onError,
  className = '',
  height = '800px',
  allowFullscreen = true
}) => {
  // 🎯 ÉTAT LOCAL
  const [state, setState] = useState<EmbedState>({
    status: 'loading',
    session: null,
    error: null,
    progress: null
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const gatewayRef = useRef<TrainingGateway | null>(null);

  // 🔌 INITIALISATION DU GATEWAY
  useEffect(() => {
    const initializeGateway = async () => {
      try {
        setState(prev => ({ ...prev, status: 'connecting' }));
        
        gatewayRef.current = TrainingGateway.getInstance();
        const connected = await gatewayRef.current.connect();
        
        if (!connected) {
          throw new Error('Impossible de se connecter au module de formation');
        }

        // Créer une nouvelle session
        const session = await gatewayRef.current.createSession({
          ...config,
          learnerId
        });

        setState(prev => ({
          ...prev,
          status: 'ready',
          session,
          error: null
        }));

        onSessionCreated?.(session);

        // S'abonner aux événements
        gatewayRef.current.subscribeToEvents(session.id);
        setupEventListeners(session.id);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        setState(prev => ({
          ...prev,
          status: 'error',
          error: errorMessage
        }));
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      }
    };

    initializeGateway();

    return () => {
      // Nettoyage
      if (gatewayRef.current && state.session) {
        gatewayRef.current.removeAllListeners();
      }
    };
  }, [learnerId, config]);

  // 🔔 CONFIGURATION DES ÉVÉNEMENTS
  const setupEventListeners = useCallback((sessionId: string) => {
    if (!gatewayRef.current) return;

    const gateway = gatewayRef.current;

    // Événements de progression
    gateway.on('progress.updated', (event) => {
      if (event.sessionId === sessionId) {
        setState(prev => ({
          ...prev,
          progress: event.progress
        }));
        onProgress?.(event.progress);
      }
    });

    // Événements de completion
    gateway.on('session.completed', (event) => {
      if (event.sessionId === sessionId) {
        setState(prev => ({
          ...prev,
          status: 'completed'
        }));
        onCompleted?.(event.results);
      }
    });

    // Événements d'erreur
    gateway.on('session.error', (event) => {
      if (event.sessionId === sessionId) {
        setState(prev => ({
          ...prev,
          status: 'error',
          error: event.error.message
        }));
        onError?.(new Error(event.error.message));
      }
    });

    // Communication cross-frame
    const handleMessage = (event: MessageEvent) => {
      // Vérifier l'origine pour la sécurité
      const allowedOrigins = [
        'https://training.ebios-app.com',
        'http://localhost:3001', // Pour le développement
      ];

      if (!allowedOrigins.includes(event.origin)) {
        console.warn('🚨 Message reçu d\'une origine non autorisée:', event.origin);
        return;
      }

      const { type, data } = event.data;

      switch (type) {
        case 'training.progress':
          setState(prev => ({ ...prev, progress: data }));
          onProgress?.(data);
          break;

        case 'training.completed':
          setState(prev => ({ ...prev, status: 'completed' }));
          onCompleted?.(data);
          break;

        case 'training.error':
          setState(prev => ({ ...prev, status: 'error', error: data.message }));
          onError?.(new Error(data.message));
          break;

        case 'training.resize':
          // Ajuster la hauteur de l'iframe si nécessaire
          if (iframeRef.current && data.height) {
            iframeRef.current.style.height = `${data.height}px`;
          }
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onProgress, onCompleted, onError]);

  // 🎨 RENDU CONDITIONNEL SELON L'ÉTAT
  const renderContent = () => {
    switch (state.status) {
      case 'loading':
      case 'connecting':
        return (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Initialisation du module de formation
              </h3>
              <p className="text-gray-600">
                {state.status === 'loading' ? 'Chargement...' : 'Connexion au service...'}
              </p>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="flex items-center justify-center h-full bg-red-50">
            <div className="text-center max-w-md">
              <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Erreur de connexion
              </h3>
              <p className="text-red-700 mb-4">
                {state.error || 'Une erreur est survenue lors du chargement du module de formation.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        );

      case 'completed':
        return (
          <div className="flex items-center justify-center h-full bg-green-50">
            <div className="text-center">
              <Award className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-900 mb-2">
                Formation terminée avec succès !
              </h3>
              <p className="text-green-700 mb-4">
                Félicitations ! Vous avez complété votre formation EBIOS RM.
              </p>
              {state.progress && (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Progression:</span>
                      <span className="ml-2">{state.progress.completionPercentage}%</span>
                    </div>
                    <div>
                      <span className="font-medium">Temps passé:</span>
                      <span className="ml-2">{Math.round(state.progress.timeSpent / 60)}min</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'ready':
        if (!state.session) return null;

        return (
          <iframe
            ref={iframeRef}
            src={state.session.embedUrl}
            width="100%"
            height={height}
            frameBorder="0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            allow="fullscreen"
            title="Module de Formation EBIOS RM"
            className="rounded-lg shadow-sm"
            onLoad={() => {
              // Envoyer la configuration initiale à l'iframe
              if (iframeRef.current?.contentWindow) {
                iframeRef.current.contentWindow.postMessage({
                  type: 'training.init',
                  data: {
                    sessionId: state.session?.id,
                    config: config
                  }
                }, state.session?.embedUrl || '*');
              }
            }}
          />
        );

      default:
        return null;
    }
  };

  // 🎯 RENDU PRINCIPAL
  return (
    <div className={`training-module-embed ${className}`}>
      {/* 🔒 Indicateur de sécurité */}
      <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            Module de formation sécurisé et isolé
          </span>
        </div>
        
        {state.progress && (
          <div className="flex items-center space-x-4 text-sm text-blue-700">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{Math.round(state.progress.timeSpent / 60)}min</span>
            </div>
            <div className="font-medium">
              {state.progress.completionPercentage}% complété
            </div>
          </div>
        )}

        {allowFullscreen && state.status === 'ready' && (
          <button
            onClick={() => {
              if (iframeRef.current?.requestFullscreen) {
                iframeRef.current.requestFullscreen();
              }
            }}
            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
            title="Plein écran"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 📱 Contenu principal */}
      <div 
        className="border border-gray-200 rounded-lg overflow-hidden"
        style={{ height }}
      >
        {renderContent()}
      </div>

      {/* 📊 Barre de progression */}
      {state.progress && state.status === 'ready' && (
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Atelier {state.progress.currentWorkshop}/5</span>
            <span>{state.progress.completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${state.progress.completionPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingModuleEmbed;
