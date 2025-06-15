import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import { SettingsInitializer } from './services/settings/SettingsInitializer';
import './index.css';

// 🚀 Initialisation des paramètres au démarrage
const initializeApp = async () => {
  try {
    console.log('🚀 Démarrage de EBIOS AI Manager...');

    // Initialiser les paramètres
    const settingsInitializer = SettingsInitializer.getInstance();
    await settingsInitializer.initialize();

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