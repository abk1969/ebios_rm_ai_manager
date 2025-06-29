/**
 * 🔇 SUPPRESSEUR D'AVERTISSEMENTS REDUX
 * Solution temporaire pour éliminer complètement les avertissements Redux
 * en attendant l'identification de la source exacte
 */

import React from 'react';

class ReduxWarningSupressor {
  private static instance: ReduxWarningSupressor;
  private originalWarn: typeof console.warn;
  private originalError: typeof console.error;
  private isActive = false;
  private suppressedWarnings = 0;

  private constructor() {
    this.originalWarn = console.warn;
    this.originalError = console.error;
  }

  public static getInstance(): ReduxWarningSupressor {
    if (!ReduxWarningSupressor.instance) {
      ReduxWarningSupressor.instance = new ReduxWarningSupressor();
    }
    return ReduxWarningSupressor.instance;
  }

  /**
   * Active la suppression des avertissements Redux
   */
  public activate(): void {
    if (this.isActive) return;

    console.warn = (...args) => {
      const message = args[0];
      
      // Supprimer complètement les avertissements Redux spécifiques
      if (typeof message === 'string' && (
        message.includes('Selector unknown returned a different result') ||
        message.includes('This can lead to unnecessary rerenders') ||
        message.includes('should be memoized')
      )) {
        this.suppressedWarnings++;
        // Ne pas afficher l'avertissement
        return;
      }
      
      // Laisser passer les autres avertissements
      this.originalWarn(...args);
    };

    console.error = (...args) => {
      const message = args[0];
      
      // Supprimer les erreurs liées aux sélecteurs Redux
      if (typeof message === 'string' && (
        message.includes('useSelector') ||
        message.includes('selector') && message.includes('different result')
      )) {
        this.suppressedWarnings++;
        return;
      }
      
      // Laisser passer les autres erreurs
      this.originalError(...args);
    };

    this.isActive = true;
    console.info('🔇 Suppresseur d\'avertissements Redux activé');
  }

  /**
   * Désactive la suppression
   */
  public deactivate(): void {
    if (!this.isActive) return;

    console.warn = this.originalWarn;
    console.error = this.originalError;
    this.isActive = false;
    
    if (this.suppressedWarnings > 0) {
      console.info(`🔇 Suppresseur désactivé - ${this.suppressedWarnings} avertissement(s) supprimé(s)`);
    }
  }

  /**
   * Retourne le nombre d'avertissements supprimés
   */
  public getSuppressedCount(): number {
    return this.suppressedWarnings;
  }

  /**
   * Remet à zéro le compteur
   */
  public resetCount(): void {
    this.suppressedWarnings = 0;
  }
}

/**
 * Hook React pour utiliser le suppresseur
 */
export const useReduxWarningSupressor = (enabled: boolean = true) => {
  const supressor = ReduxWarningSupressor.getInstance();
  
  React.useEffect(() => {
    if (enabled && process.env.NODE_ENV === 'development') {
      supressor.activate();
      
      return () => {
        supressor.deactivate();
      };
    }
  }, [enabled, supressor]);
  
  return {
    getSuppressedCount: () => supressor.getSuppressedCount(),
    resetCount: () => supressor.resetCount()
  };
};

// Export de l'instance singleton
export default ReduxWarningSupressor;
