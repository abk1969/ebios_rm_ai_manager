#!/usr/bin/env node

/**
 * 🚀 SCRIPT DE DÉMARRAGE WORKSHOP 1 - DÉVELOPPEMENT
 * Démarrage optimisé pour tester le module Workshop 1
 */

import { spawn } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { join } from 'path';

// 🎯 CONFIGURATION

const CONFIG = {
  port: 5173,
  host: 'localhost',
  open: true,
  workshop1Path: '/training/workshop1'
};

// 🔧 VÉRIFICATION DES PRÉREQUIS

function checkPrerequisites() {
  console.log('🔍 Vérification des prérequis...');
  
  // Vérification Node.js
  const nodeVersion = process.version;
  console.log(`✅ Node.js: ${nodeVersion}`);
  
  // Vérification des fichiers Workshop 1
  const workshop1Files = [
    'src/modules/training/domain/services/Workshop1MasterAgent.ts',
    'src/modules/training/presentation/components/Workshop1IntelligentInterface.tsx',
    'src/modules/training/infrastructure/Workshop1ProductionIntegration.ts'
  ];
  
  for (const file of workshop1Files) {
    if (existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} manquant`);
    }
  }
  
  console.log('✅ Prérequis vérifiés\n');
}

// 🌍 CONFIGURATION DES VARIABLES D'ENVIRONNEMENT

function setupEnvironment() {
  console.log('⚙️ Configuration de l\'environnement Workshop 1...');
  
  const envConfig = `
# Configuration Workshop 1 - Développement
NODE_ENV=development
VITE_NODE_ENV=development

# Workshop 1 Features
VITE_WORKSHOP1_ENABLE_MONITORING=true
VITE_WORKSHOP1_ENABLE_A2A=true
VITE_WORKSHOP1_ENABLE_EXPERT_NOTIFICATIONS=true
VITE_WORKSHOP1_ENABLE_PERFORMANCE_TRACKING=true
VITE_WORKSHOP1_ENABLE_ERROR_REPORTING=true

# Workshop 1 Limits
VITE_WORKSHOP1_MAX_CONCURRENT_SESSIONS=10
VITE_WORKSHOP1_SESSION_TIMEOUT_MS=1800000
VITE_WORKSHOP1_NOTIFICATION_RETENTION_DAYS=7
VITE_WORKSHOP1_METRICS_RETENTION_DAYS=30

# Workshop 1 Logging
VITE_WORKSHOP1_LOG_LEVEL=debug

# Firebase Configuration
VITE_FIREBASE_PROJECT_ID=ebiosdatabase
VITE_FIREBASE_API_KEY=AIzaSyCN4GaNMnshiDw0Z0dgGnhmgbokVyd7LmA
VITE_FIREBASE_AUTH_DOMAIN=ebiosdatabase.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=ebiosdatabase.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456789

# API Configuration
VITE_API_BASE_URL=http://localhost:5173
VITE_ENABLE_MOCK_DATA=true

# Development Features
VITE_ENABLE_DEV_TOOLS=true
VITE_ENABLE_REACT_DEVTOOLS=true
VITE_ENABLE_REDUX_DEVTOOLS=true
`;

  writeFileSync('.env.local', envConfig.trim());
  console.log('✅ Variables d\'environnement configurées\n');
}

// 🚀 DÉMARRAGE DU SERVEUR

function startDevelopmentServer() {
  console.log('🚀 Démarrage du serveur de développement...');
  console.log(`📍 URL: http://${CONFIG.host}:${CONFIG.port}`);
  console.log(`🎯 Workshop 1: http://${CONFIG.host}:${CONFIG.port}${CONFIG.workshop1Path}`);
  console.log('');
  
  const viteProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      PORT: CONFIG.port.toString(),
      HOST: CONFIG.host,
      BROWSER: CONFIG.open ? 'true' : 'false'
    }
  });
  
  viteProcess.on('error', (error) => {
    console.error('❌ Erreur lors du démarrage:', error);
    process.exit(1);
  });
  
  viteProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ Le serveur s'est arrêté avec le code: ${code}`);
      process.exit(code || 1);
    }
  });
  
  // Gestion de l'arrêt propre
  process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du serveur...');
    viteProcess.kill('SIGINT');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Arrêt du serveur...');
    viteProcess.kill('SIGTERM');
    process.exit(0);
  });
}

// 📋 AFFICHAGE DES INFORMATIONS

function displayInfo() {
  console.log('📋 INFORMATIONS WORKSHOP 1');
  console.log('='.repeat(50));
  console.log('');
  console.log('🎯 URLs de test:');
  console.log(`   • Application: http://${CONFIG.host}:${CONFIG.port}`);
  console.log(`   • Workshop 1: http://${CONFIG.host}:${CONFIG.port}${CONFIG.workshop1Path}`);
  console.log(`   • Formation: http://${CONFIG.host}:${CONFIG.port}/training`);
  console.log('');
  console.log('🧪 Fonctionnalités à tester:');
  console.log('   • Agent Orchestrateur Intelligent (Point 1)');
  console.log('   • Système de Notifications A2A (Point 2)');
  console.log('   • Interface React Intelligente (Point 3)');
  console.log('   • Tests et Validation (Point 4)');
  console.log('   • Intégration Production (Point 5)');
  console.log('');
  console.log('👤 Profils de test disponibles:');
  console.log('   • Junior EBIOS RM (apprentissage guidé)');
  console.log('   • Senior EBIOS RM (interface équilibrée)');
  console.log('   • Expert EBIOS RM (fonctionnalités complètes)');
  console.log('   • Master EBIOS RM (collaboration A2A)');
  console.log('');
  console.log('🔧 Commandes utiles:');
  console.log('   • Ctrl+C : Arrêter le serveur');
  console.log('   • F12 : Ouvrir les outils de développement');
  console.log('   • Ctrl+Shift+I : Inspecter les composants React');
  console.log('');
  console.log('📊 Monitoring disponible:');
  console.log('   • Console navigateur : Logs détaillés');
  console.log('   • Redux DevTools : État de l\'application');
  console.log('   • React DevTools : Composants et props');
  console.log('   • Network : Requêtes API et Firebase');
  console.log('');
}

// 🎯 FONCTION PRINCIPALE

async function main() {
  console.log('🎯 DÉMARRAGE WORKSHOP 1 EBIOS RM - MODE DÉVELOPPEMENT');
  console.log('='.repeat(70));
  console.log('');
  
  try {
    // 1. Vérification des prérequis
    checkPrerequisites();
    
    // 2. Configuration de l'environnement
    setupEnvironment();
    
    // 3. Affichage des informations
    displayInfo();
    
    // 4. Démarrage du serveur
    startDevelopmentServer();
    
  } catch (error) {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  }
}

// 🚀 POINT D'ENTRÉE

if (require.main === module) {
  main().catch(error => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
}

export { main as startWorkshop1Dev };
