#!/bin/bash

# 🚀 SCRIPT DE DÉMARRAGE AVEC WORKSHOP 1
# Démarrage optimisé pour tester le nouveau module Workshop 1

set -e

# 🎯 CONFIGURATION
PORT=5173
HOST=localhost
WORKSHOP1_URL="http://${HOST}:${PORT}/training/workshop1"

# Couleurs pour les logs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 DÉMARRAGE EBIOS AI MANAGER AVEC WORKSHOP 1${NC}"
echo "=================================================="
echo ""

# 🔧 Configuration des variables d'environnement
echo -e "${YELLOW}⚙️ Configuration de l'environnement...${NC}"

cat > .env.local << EOF
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

# Training Module
VITE_TRAINING_MODULE_ENABLED=true

# Development Features
VITE_ENABLE_DEV_TOOLS=true
VITE_ENABLE_REACT_DEVTOOLS=true
VITE_ENABLE_REDUX_DEVTOOLS=true
EOF

echo -e "${GREEN}✅ Variables d'environnement configurées${NC}"

# 📦 Installation des dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
    npm install
    echo -e "${GREEN}✅ Dépendances installées${NC}"
fi

echo ""
echo -e "${BLUE}📋 INFORMATIONS WORKSHOP 1${NC}"
echo "================================"
echo ""
echo -e "${GREEN}🎯 URLs de test:${NC}"
echo "   • Application: http://${HOST}:${PORT}"
echo "   • Formation: http://${HOST}:${PORT}/training"
echo "   • Workshop 1: ${WORKSHOP1_URL}"
echo ""
echo -e "${GREEN}🧪 Fonctionnalités à tester:${NC}"
echo "   • Agent Orchestrateur Intelligent (Point 1)"
echo "   • Système de Notifications A2A (Point 2)"
echo "   • Interface React Intelligente (Point 3)"
echo "   • Tests et Validation (Point 4)"
echo "   • Intégration Production (Point 5)"
echo ""
echo -e "${GREEN}👤 Profils de test disponibles:${NC}"
echo "   • Junior EBIOS RM (apprentissage guidé)"
echo "   • Senior EBIOS RM (interface équilibrée)"
echo "   • Expert EBIOS RM (fonctionnalités complètes)"
echo "   • Master EBIOS RM (collaboration A2A)"
echo ""
echo -e "${GREEN}🔧 Commandes utiles:${NC}"
echo "   • Ctrl+C : Arrêter le serveur"
echo "   • F12 : Ouvrir les outils de développement"
echo "   • Ctrl+Shift+I : Inspecter les composants React"
echo ""

# 🚀 Démarrage du serveur
echo -e "${BLUE}🚀 Démarrage du serveur de développement...${NC}"
echo ""

# Démarrage en arrière-plan pour pouvoir afficher les instructions
npm run dev &
DEV_PID=$!

# Attendre que le serveur démarre
echo -e "${YELLOW}⏳ Démarrage en cours...${NC}"
sleep 5

# Vérifier si le serveur est démarré
if curl -s "http://${HOST}:${PORT}" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Serveur démarré avec succès !${NC}"
    echo ""
    echo -e "${BLUE}🎯 ACCÈS DIRECT AU WORKSHOP 1:${NC}"
    echo -e "${GREEN}${WORKSHOP1_URL}${NC}"
    echo ""
    echo -e "${YELLOW}📝 Instructions pour tester:${NC}"
    echo ""
    echo "1. 🌐 Ouvrez votre navigateur sur: ${WORKSHOP1_URL}"
    echo "2. 🔐 Connectez-vous avec vos identifiants"
    echo "3. 👤 Configurez votre profil d'expertise"
    echo "4. 🎯 Testez l'adaptation intelligente de l'interface"
    echo "5. 🤖 Interagissez avec l'agent orchestrateur"
    echo "6. 🔔 Testez les notifications expertes A2A"
    echo "7. 📊 Vérifiez les métriques et le monitoring"
    echo ""
    echo -e "${BLUE}🔍 Logs de développement:${NC}"
    echo "   • Console navigateur : Logs détaillés du Workshop 1"
    echo "   • Redux DevTools : État de l'application"
    echo "   • React DevTools : Composants et props"
    echo "   • Network : Requêtes API et Firebase"
    echo ""
    
    # Ouvrir automatiquement le navigateur (optionnel)
    if command -v xdg-open > /dev/null; then
        echo -e "${YELLOW}🌐 Ouverture automatique du navigateur...${NC}"
        xdg-open "${WORKSHOP1_URL}" 2>/dev/null &
    elif command -v open > /dev/null; then
        echo -e "${YELLOW}🌐 Ouverture automatique du navigateur...${NC}"
        open "${WORKSHOP1_URL}" 2>/dev/null &
    elif command -v start > /dev/null; then
        echo -e "${YELLOW}🌐 Ouverture automatique du navigateur...${NC}"
        start "${WORKSHOP1_URL}" 2>/dev/null &
    fi
    
else
    echo -e "${YELLOW}⚠️ Le serveur démarre encore... Veuillez patienter${NC}"
    echo "   Vérifiez manuellement: http://${HOST}:${PORT}"
fi

echo ""
echo -e "${GREEN}🎉 WORKSHOP 1 PRÊT POUR LES TESTS !${NC}"
echo ""
echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter le serveur${NC}"

# Attendre le processus de développement
wait $DEV_PID
