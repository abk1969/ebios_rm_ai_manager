#!/bin/bash

# 🔥 Script de configuration Firebase pour le développement local
# Ce script configure et démarre les émulateurs Firebase

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔥 CONFIGURATION FIREBASE LOCAL${NC}"
echo "================================="

# Étape 1: Vérifier Firebase CLI
echo -e "\n${YELLOW}📋 Étape 1: Vérification Firebase CLI${NC}"

if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI non installé${NC}"
    echo "Installation..."
    npm install -g firebase-tools
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Firebase CLI installé${NC}"
    else
        echo -e "${RED}❌ Erreur lors de l'installation de Firebase CLI${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Firebase CLI disponible${NC}"
    firebase --version
fi

# Étape 2: Configuration pour le développement local
echo -e "\n${YELLOW}🔧 Étape 2: Configuration pour le développement local${NC}"

# Sauvegarder les règles de production
if [ -f "firestore.rules" ] && [ ! -f "firestore.rules.production" ]; then
    cp firestore.rules firestore.rules.production
    echo -e "${GREEN}✅ Règles de production sauvegardées${NC}"
fi

# Utiliser les règles de développement
cp firestore.rules.local firestore.rules
echo -e "${GREEN}✅ Règles de développement activées${NC}"

# Créer des données de test
echo -e "\n${YELLOW}📊 Étape 3: Création des données de test${NC}"

# Créer un fichier de données de test
cat > firebase-seed-data.json << 'EOF'
{
  "missions": {
    "mission-test-1": {
      "id": "mission-test-1",
      "name": "Mission de Test Local",
      "description": "Mission créée pour tester l'environnement local",
      "status": "draft",
      "createdBy": "test-user",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "teamMembers": ["test-user"],
      "settings": {
        "enableAI": true,
        "enableAudit": true
      }
    }
  },
  "businessValues": {
    "bv-test-1": {
      "id": "bv-test-1",
      "name": "Données clients",
      "description": "Base de données contenant les informations clients",
      "type": "information",
      "missionId": "mission-test-1",
      "createdBy": "test-user",
      "createdAt": "2024-01-01T00:00:00Z",
      "securityCriteria": {
        "confidentiality": "high",
        "integrity": "high",
        "availability": "medium",
        "proof": "medium"
      }
    }
  },
  "supportingAssets": {
    "sa-test-1": {
      "id": "sa-test-1",
      "name": "Serveur web principal",
      "description": "Serveur hébergeant l'application web",
      "type": "system",
      "missionId": "mission-test-1",
      "createdBy": "test-user",
      "createdAt": "2024-01-01T00:00:00Z",
      "dependencies": ["bv-test-1"]
    }
  },
  "users": {
    "test-user": {
      "id": "test-user",
      "email": "test@ebios-local.dev",
      "displayName": "Utilisateur Test",
      "role": "admin",
      "createdAt": "2024-01-01T00:00:00Z",
      "preferences": {
        "theme": "light",
        "language": "fr"
      }
    }
  }
}
EOF

echo -e "${GREEN}✅ Données de test créées${NC}"

# Étape 4: Configuration des ports
echo -e "\n${YELLOW}🌐 Étape 4: Configuration des ports${NC}"

echo "Ports configurés :"
echo "   • Firestore Emulator: 8081"
echo "   • Auth Emulator: 9099"
echo "   • Firebase UI: 4000"
echo "   • Hosting Emulator: 5000"

# Vérifier les ports disponibles
check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️ Port $port ($service) déjà utilisé${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Port $port ($service) disponible${NC}"
        return 0
    fi
}

check_port 8081 "Firestore"
check_port 9099 "Auth"
check_port 4000 "Firebase UI"
check_port 5000 "Hosting"

# Étape 5: Créer le script de démarrage des émulateurs
echo -e "\n${YELLOW}🚀 Étape 5: Création du script de démarrage${NC}"

cat > start-firebase-emulators.sh << 'EOF'
#!/bin/bash

echo "🔥 Démarrage des Firebase Emulators..."

# Vérifier si Firebase CLI est installé
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI non installé"
    echo "Installation: npm install -g firebase-tools"
    exit 1
fi

# Démarrer les émulateurs
echo "🚀 Lancement des émulateurs Firebase..."
echo ""
echo "📊 Interfaces disponibles :"
echo "   • Firebase UI: http://localhost:4000"
echo "   • Firestore: http://localhost:8081"
echo "   • Auth: http://localhost:9099"
echo ""
echo "🔧 Pour arrêter : Ctrl+C"
echo ""

firebase emulators:start --import=./firebase-seed-data --export-on-exit=./firebase-seed-data
EOF

chmod +x start-firebase-emulators.sh

echo -e "${GREEN}✅ Script de démarrage créé${NC}"

# Étape 6: Mise à jour des variables d'environnement
echo -e "\n${YELLOW}⚙️ Étape 6: Mise à jour des variables d'environnement${NC}"

# Mettre à jour .env.local
if [ -f ".env.local" ]; then
    # Ajouter les configurations Firebase Emulators
    cat >> .env.local << EOF

# Configuration Firebase Emulators
VITE_USE_FIREBASE_EMULATORS=true
VITE_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
VITE_FIRESTORE_EMULATOR_HOST=localhost:8081
VITE_FIREBASE_UI_URL=http://localhost:4000

# Configuration de test
VITE_TEST_USER_EMAIL=test@ebios-local.dev
VITE_TEST_USER_ID=test-user
EOF
    echo -e "${GREEN}✅ Variables d'environnement mises à jour${NC}"
else
    echo -e "${YELLOW}⚠️ Fichier .env.local non trouvé${NC}"
    echo "Exécutez d'abord: ./setup-local-environment.sh"
fi

# Résumé
echo -e "\n${BLUE}📊 CONFIGURATION TERMINÉE${NC}"
echo "=========================="
echo ""
echo -e "${GREEN}✅ Firebase Emulators configurés${NC}"
echo ""
echo -e "${BLUE}🚀 Pour démarrer les émulateurs:${NC}"
echo "   ./start-firebase-emulators.sh"
echo ""
echo -e "${BLUE}🌐 URLs des émulateurs:${NC}"
echo "   • Firebase UI: http://localhost:4000"
echo "   • Firestore: http://localhost:8081"
echo "   • Auth: http://localhost:9099"
echo ""
echo -e "${BLUE}📊 Données de test:${NC}"
echo "   • Mission: Mission de Test Local"
echo "   • Utilisateur: test@ebios-local.dev"
echo "   • Données: firebase-seed-data.json"
echo ""
echo -e "${YELLOW}🔧 Commandes utiles:${NC}"
echo "   • Démarrer émulateurs: ./start-firebase-emulators.sh"
echo "   • Restaurer règles prod: cp firestore.rules.production firestore.rules"
echo "   • Nettoyer données: rm -rf firebase-seed-data"
echo ""
echo -e "${GREEN}🎉 Prêt pour le développement local!${NC}"
