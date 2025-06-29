#!/usr/bin/env node

/**
 * 🔑 CONFIGURATION INTERACTIVE API KEYS
 * Script pour configurer facilement les clés API nécessaires
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('🔑 CONFIGURATION API KEYS - EBIOS AI MANAGER');
console.log('=============================================\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration par défaut
const defaultConfig = {
  GOOGLE_API_KEY: '',
  GEMINI_MODEL: 'gemini-2.5-flash-preview-05-20',
  GEMINI_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta',
  MCP_SERVER_NAME: 'ebios-ai-manager',
  MCP_SERVER_VERSION: '1.0.0',
  MCP_SERVER_PORT: '3001',
  NODE_ENV: 'development',
  VITE_APP_TITLE: 'EBIOS AI Manager',
  VITE_APP_VERSION: '1.0.0'
};

async function askQuestion(question, defaultValue = `default-${Date.now()}`) {
  return new Promise((resolve) => {
    const prompt = defaultValue 
      ? `${question} (défaut: ${defaultValue}): `
      : `${question}: `;
    
    rl.question(prompt, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function setupAPIKeys() {
  console.log('🚀 Configuration des clés API pour EBIOS AI Manager\n');
  
  console.log('📋 ÉTAPE 1: Configuration Gemini Pro 2.5');
  console.log('==========================================');
  console.log('Pour obtenir votre clé API Google Gemini :');
  console.log('1. Allez sur https://makersuite.google.com/app/apikey');
  console.log('2. Connectez-vous avec votre compte Google');
  console.log('3. Cliquez sur "Create API Key"');
  console.log('4. Copiez la clé générée\n');
  
  const googleApiKey = await askQuestion('🔑 Entrez votre clé API Google Gemini');
  
  if (!googleApiKey) {
    console.log('❌ Clé API Google Gemini requise pour continuer');
    process.exit(1);
  }
  
  console.log('✅ Clé API Google Gemini configurée\n');
  
  console.log('📋 ÉTAPE 2: Configuration modèle LLM');
  console.log('====================================');
  const geminiModel = await askQuestion('🤖 Modèle Gemini à utiliser', defaultConfig.GEMINI_MODEL);
  console.log('✅ Modèle Gemini configuré\n');
  
  console.log('📋 ÉTAPE 3: Configuration MCP Server');
  console.log('====================================');
  const mcpServerName = await askQuestion('🔌 Nom du serveur MCP', defaultConfig.MCP_SERVER_NAME);
  const mcpServerPort = await askQuestion('🔌 Port du serveur MCP', defaultConfig.MCP_SERVER_PORT);
  console.log('✅ Configuration MCP Server terminée\n');
  
  console.log('📋 ÉTAPE 4: Configuration Firebase (optionnel)');
  console.log('==============================================');
  console.log('Si vous avez un projet Firebase configuré, vous pouvez entrer les détails.');
  console.log('Sinon, appuyez sur Entrée pour ignorer.\n');
  
  const firebaseProjectId = await askQuestion('🔥 Firebase Project ID (optionnel)');
  const firebaseClientEmail = await askQuestion('🔥 Firebase Client Email (optionnel)');
  
  // Construction du fichier .env
  const envConfig = {
    ...defaultConfig,
    GOOGLE_API_KEY: googleApiKey,
    GEMINI_MODEL: geminiModel,
    MCP_SERVER_NAME: mcpServerName,
    MCP_SERVER_PORT: mcpServerPort,
    FIREBASE_PROJECT_ID: firebaseProjectId || 'your_firebase_project_id',
    FIREBASE_CLIENT_EMAIL: firebaseClientEmail || 'your_firebase_client_email'
  };
  
  // Ajout des autres configurations par défaut
  const additionalConfig = {
    // Agents IA
    DOCUMENTATION_AGENT_ENABLED: 'true',
    DOCUMENTATION_AGENT_MODEL: geminiModel,
    ANSSI_VALIDATION_AGENT_ENABLED: 'true',
    ANSSI_VALIDATION_AGENT_MODEL: geminiModel,
    RISK_ANALYSIS_AGENT_ENABLED: 'true',
    RISK_ANALYSIS_AGENT_MODEL: geminiModel,
    MITRE_ATTACK_TAXII_URL: 'https://attack-taxii.mitre.org/api/v21/',
    MITRE_ATTACK_COLLECTION_ID: '1f5f1533-f617-4ca8-9ab4-6a02367fa019',
    THREAT_INTELLIGENCE_AGENT_ENABLED: 'true',
    THREAT_INTELLIGENCE_AGENT_MODEL: geminiModel,
    PERFORMANCE_OPTIMIZER_ENABLED: 'true',
    PERFORMANCE_OPTIMIZER_MODEL: geminiModel,
    PREDICTIVE_INTELLIGENCE_ENABLED: 'true',
    PREDICTIVE_INTELLIGENCE_MODEL: geminiModel,
    
    // MCP Configuration
    MCP_ENABLE_TOOLS: 'true',
    MCP_ENABLE_RESOURCES: 'true',
    MCP_ENABLE_PROMPTS: 'true',
    
    // Orchestration A2A
    A2A_ORCHESTRATOR_ENABLED: 'true',
    A2A_MAX_CONCURRENT_AGENTS: '5',
    A2A_TIMEOUT_SECONDS: '300',
    
    // Analytics
    ADVANCED_ANALYTICS_ENABLED: 'true',
    ANALYTICS_RETENTION_DAYS: '365',
    ANALYTICS_REAL_TIME_ENABLED: 'true',
    
    // Sécurité
    CIRCUIT_BREAKER_ENABLED: 'true',
    AUDIT_TRAIL_ENABLED: 'true',
    ROLLBACK_MANAGER_ENABLED: 'true',
    
    // Feature Flags
    FEATURE_AGENT_MODE: 'true',
    FEATURE_HYBRID_SERVICE: 'true',
    FEATURE_A2A_ORCHESTRATION: 'true',
    FEATURE_PREDICTIVE_ANALYTICS: 'true',
    FEATURE_ADVANCED_VALIDATION: 'true',
    FEATURE_PERFORMANCE_OPTIMIZATION: 'true',
    
    // Environnement
    VITE_API_BASE_URL: 'http://localhost:3000',
    VITE_MCP_SERVER_URL: `http://localhost:${mcpServerPort}`,
    MONITORING_ENABLED: 'true',
    ENABLE_DEBUG_LOGS: 'true'
  };
  
  const finalConfig = { ...envConfig, ...additionalConfig };
  
  console.log('📋 ÉTAPE 5: Génération fichier .env');
  console.log('===================================');
  
  // Génération du contenu .env
  let envContent = '# 🔑 CONFIGURATION EBIOS AI MANAGER\n';
  envContent += '# Généré automatiquement par setup-api-keys.cjs\n';
  envContent += `# Date: ${new Date().toISOString()}\n\n`;
  
  envContent += '# =============================================================================\n';
  envContent += '# 🤖 CONFIGURATION LLM PRINCIPAL - GEMINI PRO 2.5\n';
  envContent += '# =============================================================================\n';
  envContent += `GOOGLE_API_KEY=${finalConfig.GOOGLE_API_KEY}\n`;
  envContent += `GEMINI_MODEL=${finalConfig.GEMINI_MODEL}\n`;
  envContent += `GEMINI_ENDPOINT=${finalConfig.GEMINI_ENDPOINT}\n\n`;
  
  envContent += '# =============================================================================\n';
  envContent += '# 🔌 CONFIGURATION MCP SERVER\n';
  envContent += '# =============================================================================\n';
  envContent += `MCP_SERVER_NAME=${finalConfig.MCP_SERVER_NAME}\n`;
  envContent += `MCP_SERVER_VERSION=${finalConfig.MCP_SERVER_VERSION}\n`;
  envContent += `MCP_SERVER_PORT=${finalConfig.MCP_SERVER_PORT}\n`;
  envContent += `MCP_ENABLE_TOOLS=${finalConfig.MCP_ENABLE_TOOLS}\n`;
  envContent += `MCP_ENABLE_RESOURCES=${finalConfig.MCP_ENABLE_RESOURCES}\n`;
  envContent += `MCP_ENABLE_PROMPTS=${finalConfig.MCP_ENABLE_PROMPTS}\n\n`;
  
  envContent += '# =============================================================================\n';
  envContent += '# 🛡️ CONFIGURATION AGENTS IA\n';
  envContent += '# =============================================================================\n';
  envContent += `DOCUMENTATION_AGENT_ENABLED=${finalConfig.DOCUMENTATION_AGENT_ENABLED}\n`;
  envContent += `DOCUMENTATION_AGENT_MODEL=${finalConfig.DOCUMENTATION_AGENT_MODEL}\n`;
  envContent += `ANSSI_VALIDATION_AGENT_ENABLED=${finalConfig.ANSSI_VALIDATION_AGENT_ENABLED}\n`;
  envContent += `ANSSI_VALIDATION_AGENT_MODEL=${finalConfig.ANSSI_VALIDATION_AGENT_MODEL}\n`;
  envContent += `RISK_ANALYSIS_AGENT_ENABLED=${finalConfig.RISK_ANALYSIS_AGENT_ENABLED}\n`;
  envContent += `RISK_ANALYSIS_AGENT_MODEL=${finalConfig.RISK_ANALYSIS_AGENT_MODEL}\n`;
  envContent += `MITRE_ATTACK_TAXII_URL=${finalConfig.MITRE_ATTACK_TAXII_URL}\n`;
  envContent += `MITRE_ATTACK_COLLECTION_ID=${finalConfig.MITRE_ATTACK_COLLECTION_ID}\n`;
  envContent += `THREAT_INTELLIGENCE_AGENT_ENABLED=${finalConfig.THREAT_INTELLIGENCE_AGENT_ENABLED}\n`;
  envContent += `THREAT_INTELLIGENCE_AGENT_MODEL=${finalConfig.THREAT_INTELLIGENCE_AGENT_MODEL}\n`;
  envContent += `PERFORMANCE_OPTIMIZER_ENABLED=${finalConfig.PERFORMANCE_OPTIMIZER_ENABLED}\n`;
  envContent += `PERFORMANCE_OPTIMIZER_MODEL=${finalConfig.PERFORMANCE_OPTIMIZER_MODEL}\n`;
  envContent += `PREDICTIVE_INTELLIGENCE_ENABLED=${finalConfig.PREDICTIVE_INTELLIGENCE_ENABLED}\n`;
  envContent += `PREDICTIVE_INTELLIGENCE_MODEL=${finalConfig.PREDICTIVE_INTELLIGENCE_MODEL}\n\n`;
  
  envContent += '# =============================================================================\n';
  envContent += '# 🔄 CONFIGURATION ORCHESTRATION A2A\n';
  envContent += '# =============================================================================\n';
  envContent += `A2A_ORCHESTRATOR_ENABLED=${finalConfig.A2A_ORCHESTRATOR_ENABLED}\n`;
  envContent += `A2A_MAX_CONCURRENT_AGENTS=${finalConfig.A2A_MAX_CONCURRENT_AGENTS}\n`;
  envContent += `A2A_TIMEOUT_SECONDS=${finalConfig.A2A_TIMEOUT_SECONDS}\n\n`;
  
  envContent += '# =============================================================================\n';
  envContent += '# 🗄️ CONFIGURATION BASE DE DONNÉES\n';
  envContent += '# =============================================================================\n';
  envContent += `FIREBASE_PROJECT_ID=${finalConfig.FIREBASE_PROJECT_ID}\n`;
  envContent += `FIREBASE_CLIENT_EMAIL=${finalConfig.FIREBASE_CLIENT_EMAIL}\n\n`;
  
  envContent += '# =============================================================================\n';
  envContent += '# 🌐 CONFIGURATION ENVIRONNEMENT\n';
  envContent += '# =============================================================================\n';
  envContent += `NODE_ENV=${finalConfig.NODE_ENV}\n`;
  envContent += `VITE_APP_TITLE=${finalConfig.VITE_APP_TITLE}\n`;
  envContent += `VITE_APP_VERSION=${finalConfig.VITE_APP_VERSION}\n`;
  envContent += `VITE_API_BASE_URL=${finalConfig.VITE_API_BASE_URL}\n`;
  envContent += `VITE_MCP_SERVER_URL=${finalConfig.VITE_MCP_SERVER_URL}\n\n`;
  
  envContent += '# =============================================================================\n';
  envContent += '# 🎛️ FEATURE FLAGS\n';
  envContent += '# =============================================================================\n';
  envContent += `FEATURE_AGENT_MODE=${finalConfig.FEATURE_AGENT_MODE}\n`;
  envContent += `FEATURE_HYBRID_SERVICE=${finalConfig.FEATURE_HYBRID_SERVICE}\n`;
  envContent += `FEATURE_A2A_ORCHESTRATION=${finalConfig.FEATURE_A2A_ORCHESTRATION}\n`;
  envContent += `FEATURE_PREDICTIVE_ANALYTICS=${finalConfig.FEATURE_PREDICTIVE_ANALYTICS}\n`;
  envContent += `FEATURE_ADVANCED_VALIDATION=${finalConfig.FEATURE_ADVANCED_VALIDATION}\n`;
  envContent += `FEATURE_PERFORMANCE_OPTIMIZATION=${finalConfig.FEATURE_PERFORMANCE_OPTIMIZATION}\n\n`;
  
  envContent += '# =============================================================================\n';
  envContent += '# 🔒 CONFIGURATION SÉCURITÉ\n';
  envContent += '# =============================================================================\n';
  envContent += `CIRCUIT_BREAKER_ENABLED=${finalConfig.CIRCUIT_BREAKER_ENABLED}\n`;
  envContent += `AUDIT_TRAIL_ENABLED=${finalConfig.AUDIT_TRAIL_ENABLED}\n`;
  envContent += `ROLLBACK_MANAGER_ENABLED=${finalConfig.ROLLBACK_MANAGER_ENABLED}\n`;
  envContent += `MONITORING_ENABLED=${finalConfig.MONITORING_ENABLED}\n`;
  envContent += `ENABLE_DEBUG_LOGS=${finalConfig.ENABLE_DEBUG_LOGS}\n\n`;
  
  envContent += '# ⚠️ IMPORTANT: Gardez ce fichier confidentiel et ne le commitez jamais !\n';
  
  // Écriture du fichier .env
  const envPath = path.join(process.cwd(), '.env');
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Fichier .env généré avec succès !');
  console.log(`📁 Emplacement: ${envPath}\n`);
  
  console.log('🎉 CONFIGURATION TERMINÉE !');
  console.log('===========================');
  console.log('✅ Clé API Gemini Pro 2.5 configurée');
  console.log('✅ Serveur MCP configuré');
  console.log('✅ Agents IA activés');
  console.log('✅ Feature flags configurés');
  console.log('✅ Fichier .env créé\n');
  
  console.log('🚀 PROCHAINES ÉTAPES:');
  console.log('1. Vérifiez le fichier .env généré');
  console.log('2. Redémarrez l\'application: npm run dev');
  // console.log supprimé;
  console.log('4. Configurez Firebase si nécessaire\n');
  
  console.log('📚 RESSOURCES UTILES:');
  console.log('• Documentation Gemini: https://ai.google.dev/docs');
  console.log('• Guide EBIOS RM: https://www.ssi.gouv.fr/guide/ebios-risk-manager/');
  console.log('• Support technique: Consultez la documentation du projet\n');
  
  rl.close();
}

// Gestion des erreurs
process.on('SIGINT', () => {
  console.log('\n\n❌ Configuration interrompue par l\'utilisateur');
  rl.close();
  process.exit(0);
});

// Lancement de la configuration
setupAPIKeys().catch((error) => {
  console.error('❌ Erreur lors de la configuration:', error);
  rl.close();
  process.exit(1);
});
