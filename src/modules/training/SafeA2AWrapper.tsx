/**
 * 🛡️ WRAPPER DE SÉCURITÉ POUR LE MODULE A2A
 * Isole le module workshop intelligence A2A pour éviter la propagation d'erreurs
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Shield } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class SafeA2AWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Met à jour l'état pour afficher l'interface de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log l'erreur pour le debugging
    console.error(`🚨 Erreur dans le module A2A (${this.props.moduleName || 'Unknown'}):`, error);
    console.error('Stack trace:', errorInfo.componentStack);
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Interface de fallback personnalisée
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      // Interface de fallback par défaut
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 m-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-yellow-800 mb-2">
                🛡️ Module A2A temporairement indisponible
              </h3>
              <p className="text-yellow-700 mb-4">
                Le module d'intelligence artificielle A2A rencontre un problème technique. 
                L'application principale continue de fonctionner normalement.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-4">
                  <summary className="cursor-pointer text-sm font-medium text-yellow-800 hover:text-yellow-900">
                    Détails techniques (développement)
                  </summary>
                  <div className="mt-2 p-3 bg-yellow-100 rounded text-xs font-mono text-yellow-900 overflow-auto">
                    <div className="mb-2">
                      <strong>Erreur:</strong> {this.state.error.message}
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={this.handleRetry}
                  className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Réessayer</span>
                </button>
                
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  <span>Recharger la page</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SafeA2AWrapper;

// Hook pour utiliser le wrapper de manière fonctionnelle
export const useSafeA2A = (moduleName: string) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const wrapComponent = React.useCallback((component: ReactNode) => {
    return (
      <SafeA2AWrapper 
        moduleName={moduleName}
        fallbackComponent={
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">
                Module {moduleName} indisponible
              </span>
            </div>
          </div>
        }
      >
        {component}
      </SafeA2AWrapper>
    );
  }, [moduleName]);

  const reportError = React.useCallback((error: Error) => {
    console.error(`🚨 Erreur rapportée dans ${moduleName}:`, error);
    setHasError(true);
    setError(error);
  }, [moduleName]);

  const resetError = React.useCallback(() => {
    setHasError(false);
    setError(null);
  }, []);

  return {
    hasError,
    error,
    wrapComponent,
    reportError,
    resetError
  };
};

// Composant de fallback simple pour les cas critiques
export const A2AFallback: React.FC<{ moduleName?: string }> = ({ moduleName = 'A2A' }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
    <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
    <p className="text-blue-800 font-medium">Module {moduleName} en mode sécurisé</p>
    <p className="text-blue-600 text-sm mt-1">Fonctionnalités de base disponibles</p>
  </div>
);
