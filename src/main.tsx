import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import { SettingsInitializer } from './services/settings/SettingsInitializer';
// import { trainingIntegrationService } from './services/training/TrainingIntegrationService'; // DÉSACTIVÉ
import { requestInterceptor } from './services/security/RequestInterceptor';
import './index.css';

// 🚀 Initialisation des paramètres au démarrage
const initializeApp = async () => {
  try {
    console.log('🚀 Démarrage de EBIOS AI Manager...');

    // 🛡️ INTERCEPTEUR TEMPORAIREMENT DÉSACTIVÉ
    // L'intercepteur sera réactivé après résolution des problèmes Firebase
    console.log('🛡️ Intercepteur de sécurité temporairement désactivé');
    // requestInterceptor.activate(); // DÉSACTIVÉ TEMPORAIREMENT

    // Initialiser les paramètres
    const settingsInitializer = SettingsInitializer.getInstance();
    await settingsInitializer.initialize();

    // 🚨 SERVICE FORMATION DÉSACTIVÉ - Module indépendant
    console.log('⚠️ Service d\'intégration formation désactivé - Module indépendant');

    /* ANCIEN CODE DÉSACTIVÉ
    // Initialiser le service d'intégration formation (avec protection)
    try {
      await trainingIntegrationService.initialize();
      console.log('✅ Service formation initialisé');
    } catch (error) {
      console.warn('⚠️ Erreur initialisation formation (non bloquante):', error);
      // L'application continue de fonctionner sans le module formation
    }
    */

    console.log('✅ Application initialisée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    // L'application peut continuer même si l'initialisation échoue
  }
};

// Initialiser l'application
initializeApp();

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);