#!/bin/bash

# 🏠 Script de configuration de l'environnement local EBIOS AI Manager
# Ce script configure tout l'environnement de développement local

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

clear
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                                                              ║${NC}"
echo -e "${PURPLE}║        🏠 EBIOS AI MANAGER - ENVIRONNEMENT LOCAL             ║${NC}"
echo -e "${PURPLE}║                                                              ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Fonction d'affichage des étapes
show_step() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📋 $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Étape 1: Vérification des prérequis
show_step "ÉTAPE 1: Vérification des prérequis"

echo "Vérification des outils installés..."
MISSING_TOOLS=()

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    MISSING_TOOLS+=("Node.js (version 18+)")
else
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        MISSING_TOOLS+=("Node.js (version 18+ requise, version $NODE_VERSION détectée)")
    else
        echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
    fi
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    MISSING_TOOLS+=("npm")
else
    echo -e "${GREEN}✅ npm $(npm --version)${NC}"
fi

# Vérifier Python
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    MISSING_TOOLS+=("Python 3.8+")
else
    if command -v python3 &> /dev/null; then
        PYTHON_CMD="python3"
    else
        PYTHON_CMD="python"
    fi
    PYTHON_VERSION=$($PYTHON_CMD --version 2>&1 | cut -d' ' -f2 | cut -d'.' -f1,2)
    echo -e "${GREEN}✅ Python $PYTHON_VERSION${NC}"
fi

# Vérifier pip
if ! command -v pip &> /dev/null && ! command -v pip3 &> /dev/null; then
    MISSING_TOOLS+=("pip")
else
    if command -v pip3 &> /dev/null; then
        PIP_CMD="pip3"
    else
        PIP_CMD="pip"
    fi
    echo -e "${GREEN}✅ pip${NC}"
fi

# Vérifier Git
if ! command -v git &> /dev/null; then
    MISSING_TOOLS+=("Git")
else
    echo -e "${GREEN}✅ Git $(git --version | cut -d' ' -f3)${NC}"
fi

if [ ${#MISSING_TOOLS[@]} -ne 0 ]; then
    echo -e "\n${RED}❌ Outils manquants:${NC}"
    for tool in "${MISSING_TOOLS[@]}"; do
        echo "   • $tool"
    done
    echo ""
    echo -e "${YELLOW}📥 Instructions d'installation:${NC}"
    echo "• Node.js: https://nodejs.org/en/download/"
    echo "• Python: https://www.python.org/downloads/"
    echo "• Git: https://git-scm.com/downloads"
    exit 1
fi

echo -e "\n${GREEN}✅ Tous les outils requis sont installés${NC}"

# Étape 2: Configuration des variables d'environnement
show_step "ÉTAPE 2: Configuration des variables d'environnement"

# Créer le fichier .env.local pour le développement
cat > .env.local << EOF
# Configuration locale pour EBIOS AI Manager
NODE_ENV=development
VITE_ENVIRONMENT=local

# URLs locales
VITE_AI_SERVICE_URL=http://localhost:8080
VITE_FRONTEND_URL=http://localhost:5173

# Configuration Firebase (Emulators)
VITE_USE_FIREBASE_EMULATORS=true
VITE_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
VITE_FIRESTORE_EMULATOR_HOST=localhost:8080

# Configuration de développement
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug

# Configuration de sécurité (mode développement)
VITE_ENABLE_ENCRYPTION=false
VITE_AUDIT_ENABLED=true
VITE_ANSSI_VALIDATION=true

# Configuration de l'application
VITE_APP_NAME=EBIOS AI Manager (Local)
VITE_APP_VERSION=1.0.0-dev
EOF

echo -e "${GREEN}✅ Fichier .env.local créé${NC}"

# Étape 3: Installation des dépendances frontend
show_step "ÉTAPE 3: Installation des dépendances frontend"

echo "Installation des dépendances Node.js..."
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dépendances frontend installées${NC}"
else
    echo -e "${RED}❌ Erreur lors de l'installation des dépendances frontend${NC}"
    exit 1
fi

# Étape 4: Configuration du service Python AI
show_step "ÉTAPE 4: Configuration du service Python AI"

cd python-ai-service

# Créer un environnement virtuel Python
echo "Création de l'environnement virtuel Python..."
$PYTHON_CMD -m venv venv

# Activer l'environnement virtuel
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Installer les dépendances Python
echo "Installation des dépendances Python..."
$PIP_CMD install -r requirements-cloudrun.txt

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dépendances Python installées${NC}"
else
    echo -e "${RED}❌ Erreur lors de l'installation des dépendances Python${NC}"
    exit 1
fi

cd ..

# Étape 5: Installation de Firebase CLI et configuration des émulateurs
show_step "ÉTAPE 5: Configuration Firebase Emulators"

# Installer Firebase CLI si pas déjà installé
if ! command -v firebase &> /dev/null; then
    echo "Installation de Firebase CLI..."
    npm install -g firebase-tools
fi

echo -e "${GREEN}✅ Firebase CLI disponible${NC}"

# Créer la configuration des émulateurs
cat > firebase.json << EOF
{
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8081
    },
    "hosting": {
      "port": 5000
    },
    "ui": {
      "enabled": true,
      "port": 4000
    },
    "singleProjectMode": true
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
EOF

echo -e "${GREEN}✅ Configuration Firebase Emulators créée${NC}"

# Étape 6: Création des scripts de démarrage
show_step "ÉTAPE 6: Création des scripts de démarrage"

# Script pour démarrer le service Python AI
cat > start-ai-service.sh << 'EOF'
#!/bin/bash
echo "🤖 Démarrage du service Python AI..."
cd python-ai-service

# Activer l'environnement virtuel
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Démarrer le service
export FLASK_ENV=development
export FLASK_DEBUG=1
export PORT=8080
python app.py
EOF

# Script pour démarrer le frontend
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🌐 Démarrage du frontend React..."
npm run dev
EOF

# Script pour démarrer Firebase Emulators
cat > start-firebase-emulators.sh << 'EOF'
#!/bin/bash
echo "🔥 Démarrage des Firebase Emulators..."
firebase emulators:start
EOF

# Script pour démarrer tout
cat > start-all-local.sh << 'EOF'
#!/bin/bash

# 🚀 Script pour démarrer tous les services en local
echo "🏠 Démarrage de l'environnement local EBIOS AI Manager..."

# Fonction pour démarrer un service en arrière-plan
start_service() {
    echo "Démarrage de $1..."
    $2 &
    echo "PID: $!"
}

# Démarrer Firebase Emulators
start_service "Firebase Emulators" "./start-firebase-emulators.sh"
sleep 3

# Démarrer le service Python AI
start_service "Service Python AI" "./start-ai-service.sh"
sleep 3

# Démarrer le frontend (en premier plan)
echo "🌐 Démarrage du frontend React..."
./start-frontend.sh
EOF

# Rendre les scripts exécutables
chmod +x start-*.sh

echo -e "${GREEN}✅ Scripts de démarrage créés${NC}"

# Résumé final
show_step "🎉 CONFIGURATION TERMINÉE!"

echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    🎯 ENVIRONNEMENT PRÊT                    ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🚀 Pour démarrer l'application en local:${NC}"
echo ""
echo -e "${YELLOW}Option 1 - Démarrage automatique (recommandé):${NC}"
echo "   ./start-all-local.sh"
echo ""
echo -e "${YELLOW}Option 2 - Démarrage manuel (3 terminaux séparés):${NC}"
echo "   Terminal 1: ./start-firebase-emulators.sh"
echo "   Terminal 2: ./start-ai-service.sh"
echo "   Terminal 3: ./start-frontend.sh"
echo ""
echo -e "${BLUE}🌐 URLs locales:${NC}"
echo "   • Frontend: http://localhost:5173"
echo "   • Service AI: http://localhost:8080"
echo "   • Firebase UI: http://localhost:4000"
echo "   • Firestore Emulator: http://localhost:8081"
echo ""
echo -e "${BLUE}📁 Fichiers créés:${NC}"
echo "   • .env.local (variables d'environnement)"
echo "   • firebase.json (configuration émulateurs)"
echo "   • start-*.sh (scripts de démarrage)"
echo ""
echo -e "${GREEN}🎉 Prêt à développer!${NC}"
