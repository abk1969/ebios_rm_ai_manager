/**
 * 🔍 INTERCEPTEUR D'AVERTISSEMENTS REDUX AVANCÉ
 * Identifie précisément la source des avertissements Redux
 */

import React from 'react';

interface ReduxWarningDetails {
  timestamp: string;
  message: string;
  stackTrace: string;
  componentStack?: string;
  selectorInfo?: any;
}

class ReduxWarningInterceptor {
  private static instance: ReduxWarningInterceptor;
  private originalWarn: typeof console.warn;
  private warnings: ReduxWarningDetails[] = [];
  private isActive = false;

  private constructor() {
    this.originalWarn = console.warn;
  }

  public static getInstance(): ReduxWarningInterceptor {
    if (!ReduxWarningInterceptor.instance) {
      ReduxWarningInterceptor.instance = new ReduxWarningInterceptor();
    }
    return ReduxWarningInterceptor.instance;
  }

  /**
   * Active l'interception des avertissements Redux
   */
  public activate(): void {
    if (this.isActive) return;

    console.warn = (...args) => {
      const message = args[0];
      
      if (typeof message === 'string' && message.includes('Selector unknown returned a different result')) {
        this.captureReduxWarning(message, args);
      }
      
      // Appeler la fonction originale
      this.originalWarn(...args);
    };

    this.isActive = true;
    console.info('🔍 Intercepteur d\'avertissements Redux activé');
  }

  /**
   * Désactive l'interception
   */
  public deactivate(): void {
    if (!this.isActive) return;

    console.warn = this.originalWarn;
    this.isActive = false;
    console.info('🔍 Intercepteur d\'avertissements Redux désactivé');
  }

  /**
   * Capture et analyse un avertissement Redux
   */
  private captureReduxWarning(message: string, args: any[]): void {
    const timestamp = new Date().toISOString();
    const stackTrace = new Error().stack || '';
    
    // Analyser la stack trace pour identifier le composant
    const componentInfo = this.analyzeStackTrace(stackTrace);
    
    // Extraire les informations du sélecteur si disponibles
    const selectorInfo = args.length > 1 ? args[1] : null;
    
    const warningDetails: ReduxWarningDetails = {
      timestamp,
      message,
      stackTrace,
      componentStack: componentInfo,
      selectorInfo
    };
    
    this.warnings.push(warningDetails);
    
    // Afficher l'analyse immédiatement
    this.displayWarningAnalysis(warningDetails);
  }

  /**
   * Analyse la stack trace pour identifier le composant responsable
   */
  private analyzeStackTrace(stackTrace: string): string {
    const lines = stackTrace.split('\n');
    const relevantLines = lines.filter(line => 
      line.includes('.tsx') || line.includes('.ts')
    ).filter(line => 
      !line.includes('node_modules') && 
      !line.includes('react-redux') &&
      !line.includes('ReduxWarningInterceptor')
    );
    
    return relevantLines.slice(0, 3).join('\n');
  }

  /**
   * Affiche l'analyse détaillée d'un avertissement
   */
  private displayWarningAnalysis(warning: ReduxWarningDetails): void {
    console.group('🚨 ANALYSE DÉTAILLÉE AVERTISSEMENT REDUX');
    console.warn('⏰ Timestamp:', warning.timestamp);
    console.warn('📝 Message:', warning.message);
    
    if (warning.selectorInfo) {
      console.warn('🔍 Informations sélecteur:', warning.selectorInfo);
    }
    
    if (warning.componentStack) {
      console.warn('📍 Composants impliqués:');
      console.warn(warning.componentStack);
    }
    
    // Suggestions de correction
    console.warn('💡 Suggestions de correction:');
    console.warn('  1. Vérifiez les sélecteurs dans les composants listés ci-dessus');
    console.warn('  2. Utilisez createSelector pour les opérations filter/map/find');
    console.warn('  3. Évitez les objets/tableaux littéraux dans useSelector');
    console.warn('  4. Utilisez les hooks optimisés depuis src/store/selectors');
    
    console.groupEnd();
  }

  /**
   * Retourne toutes les warnings capturées
   */
  public getWarnings(): ReduxWarningDetails[] {
    return [...this.warnings];
  }

  /**
   * Efface toutes les warnings capturées
   */
  public clearWarnings(): void {
    this.warnings = [];
  }

  /**
   * Génère un rapport détaillé
   */
  public generateReport(): string {
    const report = {
      timestamp: new Date().toISOString(),
      totalWarnings: this.warnings.length,
      warnings: this.warnings,
      summary: this.generateSummary()
    };
    
    return JSON.stringify(report, null, 2);
  }

  /**
   * Génère un résumé des avertissements
   */
  private generateSummary(): any {
    const componentCounts: { [key: string]: number } = {};
    
    this.warnings.forEach(warning => {
      if (warning.componentStack) {
        const components = warning.componentStack.split('\n');
        components.forEach(component => {
          const match = component.match(/([^/]+\.tsx?)/);
          if (match) {
            const fileName = match[1];
            componentCounts[fileName] = (componentCounts[fileName] || 0) + 1;
          }
        });
      }
    });
    
    return {
      mostProblematicComponents: Object.entries(componentCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      totalUniqueComponents: Object.keys(componentCounts).length
    };
  }
}

/**
 * Hook React pour utiliser l'intercepteur
 */
export const useReduxWarningInterceptor = (enabled: boolean = true) => {
  const interceptor = ReduxWarningInterceptor.getInstance();
  
  React.useEffect(() => {
    if (enabled && process.env.NODE_ENV === 'development') {
      interceptor.activate();
      
      return () => {
        interceptor.deactivate();
      };
    }
  }, [enabled, interceptor]);
  
  return {
    getWarnings: () => interceptor.getWarnings(),
    clearWarnings: () => interceptor.clearWarnings(),
    generateReport: () => interceptor.generateReport()
  };
};

// Export de l'instance singleton
export default ReduxWarningInterceptor;
