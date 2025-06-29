#!/bin/bash

# 🔥 Script de déploiement Firebase Hosting étape par étape
# Ce script vous guide dans le déploiement de votre frontend EBIOS AI

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔥 DÉPLOIEMENT FRONTEND EBIOS AI SUR FIREBASE HOSTING${NC}"
echo "====================================================="

# Étape 1: Vérification des prérequis
echo -e "\n${YELLOW}📋 Étape 1: Vérification des prérequis${NC}"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm n'est pas installé${NC}"
    exit 1
fi

# Vérifier Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI n'est pas installé${NC}"
    echo "Installation: npm install -g firebase-tools"
    exit 1
fi

echo -e "${GREEN}✅ Tous les prérequis sont installés${NC}"

# Étape 2: Configuration du projet
echo -e "\n${YELLOW}🔧 Étape 2: Configuration du projet${NC}"

# Charger la configuration Cloud Run si elle existe
if [ -f ".env.cloudrun" ]; then
    source .env.cloudrun
    echo -e "${GREEN}✅ Configuration Cloud Run chargée${NC}"
    echo "   Service URL: $CLOUD_RUN_SERVICE_URL"
else
    echo -e "${YELLOW}⚠️ Fichier .env.cloudrun non trouvé${NC}"
    read -p "Entrez l'URL de votre service Cloud Run: " CLOUD_RUN_SERVICE_URL
fi

read -p "Entrez votre Project ID Firebase: " FIREBASE_PROJECT_ID

# Étape 3: Connexion à Firebase
echo -e "\n${YELLOW}🔐 Étape 3: Connexion à Firebase${NC}"
firebase login

# Étape 4: Sélection du projet
echo -e "\n${YELLOW}📂 Étape 4: Sélection du projet Firebase${NC}"
firebase use $FIREBASE_PROJECT_ID

# Étape 5: Configuration des variables d'environnement
echo -e "\n${YELLOW}⚙️ Étape 5: Configuration des variables d'environnement${NC}"

# Créer le fichier .env.production
cat > .env.production << EOF
# Configuration de production pour EBIOS AI Manager
VITE_ENVIRONMENT=production
VITE_AI_SERVICE_URL=$CLOUD_RUN_SERVICE_URL
VITE_FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
VITE_FIREBASE_AUTH_DOMAIN=$FIREBASE_PROJECT_ID.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=$FIREBASE_PROJECT_ID.appspot.com

# Configuration de sécurité
VITE_ENABLE_ENCRYPTION=true
VITE_AUDIT_ENABLED=true
VITE_ANSSI_VALIDATION=true

# Configuration UI
VITE_APP_NAME=EBIOS AI Manager
VITE_APP_VERSION=1.0.0
EOF

echo -e "${GREEN}✅ Variables d'environnement configurées${NC}"

# Étape 6: Installation des dépendances
echo -e "\n${YELLOW}📦 Étape 6: Installation des dépendances${NC}"
npm ci

# Étape 7: Construction de l'application
echo -e "\n${YELLOW}🏗️ Étape 7: Construction de l'application${NC}"
npm run build

# Vérifier que le build a réussi
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Erreur: Le dossier 'dist' n'a pas été créé${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Application construite avec succès${NC}"

# Étape 8: Déploiement sur Firebase Hosting
echo -e "\n${YELLOW}🚀 Étape 8: Déploiement sur Firebase Hosting${NC}"
firebase deploy --only hosting

# Étape 9: Récupération de l'URL
echo -e "\n${YELLOW}🌐 Étape 9: Récupération de l'URL de l'application${NC}"
HOSTING_URL="https://$FIREBASE_PROJECT_ID.web.app"

echo -e "\n${GREEN}🎉 DÉPLOIEMENT FRONTEND TERMINÉ AVEC SUCCÈS!${NC}"
echo "=================================================="
echo -e "${GREEN}✅ Votre application est accessible à l'URL:${NC}"
echo -e "${BLUE}$HOSTING_URL${NC}"
echo ""
echo -e "${GREEN}🔗 URLs importantes:${NC}"
echo "   • Application web: $HOSTING_URL"
echo "   • Console Firebase: https://console.firebase.google.com/project/$FIREBASE_PROJECT_ID"
echo "   • Service AI Backend: $CLOUD_RUN_SERVICE_URL"
echo ""
echo -e "${GREEN}📊 Monitoring:${NC}"
echo "   • Firebase Analytics: https://console.firebase.google.com/project/$FIREBASE_PROJECT_ID/analytics"
echo "   • Firebase Performance: https://console.firebase.google.com/project/$FIREBASE_PROJECT_ID/performance"
echo ""
echo -e "${YELLOW}🧪 Test de l'application:${NC}"
echo "1. Ouvrez: $HOSTING_URL"
echo "2. Vérifiez que l'interface se charge correctement"
echo "3. Testez la connexion avec le service AI"

# Mise à jour du fichier de configuration
cat >> .env.cloudrun << EOF

# Configuration Firebase Hosting
FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
FIREBASE_HOSTING_URL=$HOSTING_URL
EOF

echo -e "\n${GREEN}💾 Configuration mise à jour dans .env.cloudrun${NC}"

# Étape 10: Tests automatiques
echo -e "\n${YELLOW}🧪 Étape 10: Tests automatiques${NC}"
echo "Test de connectivité avec le service AI..."

if curl -s "$CLOUD_RUN_SERVICE_URL/health" > /dev/null; then
    echo -e "${GREEN}✅ Service AI accessible${NC}"
else
    echo -e "${RED}❌ Service AI non accessible${NC}"
    echo "Vérifiez que le service Cloud Run est déployé et accessible"
fi

echo -e "\n${GREEN}🏁 Déploiement complet terminé!${NC}"
