import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';

console.log('🚀 EBIOS AI Manager - Démarrage en mode Docker');

// 🛡️ Gestionnaire d'erreurs global
window.addEventListener('error', (e) => {
  console.error('❌ Erreur JavaScript globale:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('❌ Promise rejetée:', e.reason);
});

// 🚀 Fonction de démarrage simplifiée
const startApplication = () => {
  const container = document.getElementById('root');
  
  if (!container) {
    console.error('❌ Element #root non trouvé');
    document.body.innerHTML = `
      <div style="
        background: #f44336; 
        color: white; 
        padding: 20px; 
        font-family: Arial;
        text-align: center;
      ">
        <h2>❌ Erreur critique</h2>
        <p>Element #root non trouvé dans le DOM</p>
        <p>Vérifiez le fichier index.html</p>
      </div>
    `;
    return;
  }

  try {
    console.log('🔄 Création du root React...');
    const root = createRoot(container);
    
    console.log('🔄 Initialisation du store Redux...');
    const currentState = store.getState();
    console.log('✅ Store Redux initialisé avec les slices:', Object.keys(currentState));
    
    console.log('🔄 Rendu de l\'application principale...');
    
    root.render(
      <React.StrictMode>
        <Provider store={store}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </Provider>
      </React.StrictMode>
    );
    
    console.log('✅ Application EBIOS AI Manager démarrée avec succès');
    console.log('📊 Mode: Docker Production');
    console.log('🔥 Firebase: Désactivé (mode local)');
    
  } catch (error) {
    console.error('❌ Erreur lors du démarrage de l\'application:', error);
    
    // Affichage d'erreur utilisateur
    container.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
        color: white;
        min-height: 100vh;
        padding: 20px;
        font-family: Arial, sans-serif;
      ">
        <div style="
          background: rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        ">
          <h1>❌ Erreur de démarrage</h1>
          <p><strong>EBIOS AI Manager</strong> n'a pas pu démarrer</p>
        </div>
        
        <div style="
          background: rgba(0,0,0,0.3);
          padding: 15px;
          border-radius: 5px;
          font-family: monospace;
          margin-bottom: 20px;
        ">
          <p><strong>Erreur:</strong> ${error.message}</p>
          <p><strong>Type:</strong> ${error.name}</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="
          background: rgba(255,255,255,0.1);
          padding: 15px;
          border-radius: 5px;
        ">
          <h3>🔧 Actions de dépannage:</h3>
          <p>1. Ouvrez la console développeur (F12)</p>
          <p>2. Rechargez la page (Ctrl+F5)</p>
          <p>3. Vérifiez les logs Docker</p>
          <p>4. Contactez l'administrateur si le problème persiste</p>
        </div>
        
        <button onclick="window.location.reload()" style="
          background: #4CAF50;
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          margin-top: 20px;
        ">
          🔄 Recharger l'application
        </button>
      </div>
    `;
  }
};

// 🛡️ Composant Error Boundary pour capturer les erreurs React
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('🚨 Error Boundary déclenché:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Détails de l\'erreur React:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: '#f44336',
          color: 'white',
          padding: '20px',
          minHeight: '100vh',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2>🚨 Erreur dans l'application React</h2>
          <p><strong>Erreur:</strong> {this.state.error?.message}</p>
          <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#4CAF50',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            🔄 Recharger
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 🚀 Démarrage immédiat de l'application
console.log('🔄 Lancement du processus de démarrage...');

// Vérification de l'environnement
console.log('🔍 Environnement détecté:', {
  userAgent: navigator.userAgent.substring(0, 50) + '...',
  location: window.location.href,
  timestamp: new Date().toISOString(),
  reactVersion: React.version
});

// Démarrage
startApplication();