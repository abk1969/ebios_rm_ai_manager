import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Gestion robuste des erreurs Redux et autres
    if (error.message?.includes('Cannot read properties of undefined') &&
        errorInfo.componentStack?.includes('useSelector')) {
      console.error('🚨 Erreur de sélecteur Redux détectée:', {
        error: error.message,
        component: errorInfo.componentStack.split('\n')[1]?.trim(),
        timestamp: new Date().toISOString()
      });
    } else {
      console.error('❌ Erreur non gérée:', error, errorInfo);
    }

    // En mode développement, afficher plus de détails
    if (import.meta.env.DEV) {
      console.group('🔍 Détails de l\'erreur');
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Something went wrong
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {this.state.error?.message}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;