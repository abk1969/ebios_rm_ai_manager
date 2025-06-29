/**
 * 🛡️ WRAPPER SÉCURISÉ POUR LE MODULE FORMATION
 * Composant de sécurité qui isole le module formation
 * Empêche les erreurs de casser l'application principale
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

// 🎯 PROPS DU WRAPPER
interface SafeTrainingWrapperProps {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onRetry?: () => void;
  onBack?: () => void;
}

// 🎯 ÉTAT DU WRAPPER
interface SafeTrainingWrapperState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

/**
 * 🛡️ COMPOSANT WRAPPER SÉCURISÉ
 * Error Boundary spécialisé pour le module formation
 */
export class SafeTrainingWrapper extends Component<
  SafeTrainingWrapperProps,
  SafeTrainingWrapperState
> {
  private maxRetries = 3;

  constructor(props: SafeTrainingWrapperProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<SafeTrainingWrapperState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚨 Erreur dans le module formation:', error);
    console.error('📍 Informations d\'erreur:', errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // Notifier l'erreur au parent si callback fourni
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Envoyer l'erreur au service de monitoring (si disponible)
    this.reportError(error, errorInfo);
  }

  /**
   * 🔄 Tentative de récupération
   */
  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));

      if (this.props.onRetry) {
        this.props.onRetry();
      }
    }
  };

  /**
   * 🔙 Retour sécurisé
   */
  handleBack = () => {
    if (this.props.onBack) {
      this.props.onBack();
    } else {
      // Fallback: retour à la page précédente
      window.history.back();
    }
  };

  /**
   * 📊 Rapport d'erreur
   */
  private reportError(error: Error, errorInfo: ErrorInfo) {
    try {
      // Ici, on pourrait envoyer l'erreur à un service de monitoring
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        module: 'training'
      };

      console.log('📊 Rapport d\'erreur formation:', errorReport);
      
      // TODO: Envoyer à un service de monitoring externe
      // await sendErrorReport(errorReport);
      
    } catch (reportError) {
      console.error('❌ Erreur lors du rapport d\'erreur:', reportError);
    }
  }

  /**
   * 🎨 Rendu de l'interface d'erreur
   */
  renderErrorUI() {
    const { error, retryCount } = this.state;
    const canRetry = retryCount < this.maxRetries;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Icône d'erreur */}
          <div className="mb-6">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
          </div>

          {/* Message d'erreur */}
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Module formation temporairement indisponible
          </h2>
          
          <p className="text-gray-600 mb-6">
            Une erreur est survenue dans le module de formation. 
            L'application principale reste fonctionnelle.
          </p>

          {/* Détails techniques (en mode développement) */}
          {import.meta.env.DEV && error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-left">
              <h3 className="text-sm font-medium text-red-800 mb-2">
                Détails techniques:
              </h3>
              <pre className="text-xs text-red-700 overflow-auto max-h-32">
                {error.message}
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col space-y-3">
            {canRetry && (
              <button
                onClick={this.handleRetry}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Réessayer ({this.maxRetries - retryCount} tentatives restantes)
              </button>
            )}

            <button
              onClick={this.handleBack}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'application
            </button>

            {!canRetry && (
              <div className="text-sm text-gray-500 mt-4">
                Nombre maximum de tentatives atteint.
                <br />
                Veuillez contacter le support technique.
              </div>
            )}
          </div>

          {/* Informations de contact support */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Si le problème persiste, contactez le support:
              <br />
              <a 
                href="mailto:support@ebios-ai-manager.com" 
                className="text-blue-600 hover:text-blue-700"
              >
                support@ebios-ai-manager.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  render() {
    // Si erreur détectée, afficher l'interface d'erreur
    if (this.state.hasError) {
      // Utiliser le composant de fallback personnalisé si fourni
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }
      
      // Sinon, utiliser l'interface d'erreur par défaut
      return this.renderErrorUI();
    }

    // Sinon, rendre les enfants normalement
    return this.props.children;
  }
}

/**
 * 🎯 HOC POUR WRAPPER AUTOMATIQUE
 */
export function withSafeTraining<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const SafeComponent = (props: P) => (
    <SafeTrainingWrapper>
      <WrappedComponent {...props} />
    </SafeTrainingWrapper>
  );

  SafeComponent.displayName = `withSafeTraining(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return SafeComponent;
}

/**
 * 🎯 HOOK POUR VÉRIFICATION SÉCURITÉ
 */
export const useTrainingSafety = () => {
  const [isTrainingAvailable, setIsTrainingAvailable] = React.useState(true);
  const [lastError, setLastError] = React.useState<Error | null>(null);

  const checkTrainingHealth = React.useCallback(async () => {
    try {
      // Vérification basique de la disponibilité du module
      const moduleCheck = typeof window !== 'undefined' && 
                          window.localStorage !== undefined;
      
      setIsTrainingAvailable(moduleCheck);
      setLastError(null);
      
      return moduleCheck;
    } catch (error) {
      setIsTrainingAvailable(false);
      setLastError(error as Error);
      return false;
    }
  }, []);

  React.useEffect(() => {
    checkTrainingHealth();
  }, [checkTrainingHealth]);

  return {
    isTrainingAvailable,
    lastError,
    checkTrainingHealth
  };
};

export default SafeTrainingWrapper;
