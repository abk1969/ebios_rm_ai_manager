/**
 * 🔍 DÉTECTEUR D'AVERTISSEMENTS SÉLECTEURS REDUX
 * Composant minimal pour identifier les sélecteurs problématiques
 */

import React, { useEffect } from 'react';

/**
 * Intercepte et trace les avertissements Redux
 */
const SelectorWarningDetector: React.FC = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Sauvegarder les fonctions console originales
    const originalWarn = console.warn;
    const originalError = console.error;

    // Intercepter les avertissements Redux
    console.warn = (...args) => {
      const message = args[0];
      
      if (typeof message === 'string' && message.includes('Selector unknown returned a different result')) {
        console.group('🚨 REDUX SELECTOR WARNING DETECTED');
        console.warn('Message:', message);
        console.warn('Arguments:', args);
        console.trace('Stack trace:');
        
        // Analyser la stack trace pour identifier le composant
        const stack = new Error().stack;
        if (stack) {
          const lines = stack.split('\n');
          const relevantLines = lines.filter(line => 
            line.includes('.tsx') || line.includes('.ts')
          ).slice(0, 5);
          
          console.warn('Composants impliqués:', relevantLines);
        }
        
        console.groupEnd();
      }
      
      // Appeler la fonction originale
      originalWarn(...args);
    };

    // Intercepter les erreurs liées aux sélecteurs
    console.error = (...args) => {
      const message = args[0];
      
      if (typeof message === 'string' && (
        message.includes('Cannot read properties of undefined') ||
        message.includes('selector') ||
        message.includes('useSelector')
      )) {
        console.group('🔴 SELECTOR ERROR DETECTED');
        console.error('Message:', message);
        console.error('Arguments:', args);
        console.trace('Stack trace:');
        console.groupEnd();
      }
      
      // Appeler la fonction originale
      originalError(...args);
    };

    // Nettoyer à la destruction du composant
    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  // Composant invisible
  return null;
};

export default SelectorWarningDetector;
