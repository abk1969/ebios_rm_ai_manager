#!/bin/bash

# 🚀 Script de déploiement complet EBIOS AI Manager
# Ce script déploie l'application complète sur Google Cloud Platform

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
echo -e "${PURPLE}║           🚀 EBIOS AI MANAGER - DÉPLOIEMENT COMPLET          ║${NC}"
echo -e "${PURPLE}║                                                              ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Fonction d'affichage des étapes
show_step() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📋 $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Fonction de confirmation
confirm() {
    read -p "$(echo -e ${YELLOW}$1 ${NC}[y/N]: )" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        return 0
    else
        return 1
    fi
}

# Étape 0: Vérification des prérequis
show_step "ÉTAPE 0: Vérification des prérequis"

echo "Vérification des outils installés..."
MISSING_TOOLS=()

if ! command -v gcloud &> /dev/null; then
    MISSING_TOOLS+=("Google Cloud CLI")
fi

if ! command -v firebase &> /dev/null; then
    MISSING_TOOLS+=("Firebase CLI")
fi

if ! command -v docker &> /dev/null; then
    MISSING_TOOLS+=("Docker")
fi

if ! command -v node &> /dev/null; then
    MISSING_TOOLS+=("Node.js")
fi

if [ ${#MISSING_TOOLS[@]} -ne 0 ]; then
    echo -e "${RED}❌ Outils manquants:${NC}"
    for tool in "${MISSING_TOOLS[@]}"; do
        echo "   • $tool"
    done
    echo ""
    echo "Veuillez installer ces outils avant de continuer."
    exit 1
fi

echo -e "${GREEN}✅ Tous les outils requis sont installés${NC}"

# Étape 1: Configuration du projet
show_step "ÉTAPE 1: Configuration du projet"

read -p "Entrez votre Project ID GCP: " PROJECT_ID
read -p "Entrez la région (défaut: europe-west1): " REGION
REGION=${REGION:-"europe-west1"}

echo -e "\n${GREEN}📋 Configuration du projet:${NC}"
echo "   • Project ID: $PROJECT_ID"
echo "   • Région: $REGION"

if ! confirm "Continuer avec cette configuration?"; then
    echo "Déploiement annulé."
    exit 0
fi

# Configuration gcloud
echo "Configuration de gcloud..."
gcloud config set project $PROJECT_ID
gcloud config set run/region $REGION

# Étape 2: Activation des services
show_step "ÉTAPE 2: Activation des services GCP"

echo "Activation des APIs nécessaires..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable firebase.googleapis.com
gcloud services enable firestore.googleapis.com

echo -e "${GREEN}✅ Services activés${NC}"

# Étape 3: Déploiement du service AI
show_step "ÉTAPE 3: Déploiement du service AI sur Cloud Run"

echo "Construction et déploiement du service Python AI..."

# Construction de l'image Docker
IMAGE_NAME="gcr.io/$PROJECT_ID/ebios-ai-service"
echo "Construction de l'image: $IMAGE_NAME"

cd python-ai-service
docker build -t $IMAGE_NAME .

# Configuration Docker pour GCP
gcloud auth configure-docker

# Push de l'image
echo "Push de l'image vers Container Registry..."
docker push $IMAGE_NAME

# Déploiement sur Cloud Run
echo "Déploiement sur Cloud Run..."
gcloud run deploy ebios-ai-service \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 1 \
    --max-instances 10 \
    --timeout 300 \
    --port 8080

# Récupération de l'URL du service
SERVICE_URL=$(gcloud run services describe ebios-ai-service --region=$REGION --format="value(status.url)")

cd ..

echo -e "${GREEN}✅ Service AI déployé: $SERVICE_URL${NC}"

# Étape 4: Configuration Firebase
show_step "ÉTAPE 4: Configuration et déploiement Firebase"

# Connexion à Firebase
firebase login

# Utilisation du projet
firebase use $PROJECT_ID

# Configuration des variables d'environnement
echo "Configuration des variables d'environnement..."
cat > .env.production << EOF
VITE_ENVIRONMENT=production
VITE_AI_SERVICE_URL=$SERVICE_URL
VITE_FIREBASE_PROJECT_ID=$PROJECT_ID
VITE_FIREBASE_AUTH_DOMAIN=$PROJECT_ID.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=$PROJECT_ID.appspot.com
VITE_ENABLE_ENCRYPTION=true
VITE_AUDIT_ENABLED=true
VITE_ANSSI_VALIDATION=true
VITE_APP_NAME=EBIOS AI Manager
VITE_APP_VERSION=1.0.0
EOF

# Installation des dépendances et build
echo "Installation des dépendances..."
npm ci

echo "Construction de l'application..."
npm run build

# Déploiement Firebase
echo "Déploiement sur Firebase Hosting..."
firebase deploy --only hosting

# URL de l'application
APP_URL="https://$PROJECT_ID.web.app"

echo -e "${GREEN}✅ Application déployée: $APP_URL${NC}"

# Étape 5: Configuration finale
show_step "ÉTAPE 5: Configuration finale et tests"

# Sauvegarde de la configuration
cat > .env.deployment << EOF
# Configuration de déploiement EBIOS AI Manager
GCP_PROJECT_ID=$PROJECT_ID
GCP_REGION=$REGION
CLOUD_RUN_SERVICE_URL=$SERVICE_URL
FIREBASE_HOSTING_URL=$APP_URL
DOCKER_IMAGE=$IMAGE_NAME
DEPLOYMENT_DATE=$(date)
EOF

# Tests de connectivité
echo "Tests de connectivité..."
if curl -s "$SERVICE_URL/health" > /dev/null; then
    echo -e "${GREEN}✅ Service AI accessible${NC}"
else
    echo -e "${RED}❌ Service AI non accessible${NC}"
fi

# Résumé final
show_step "🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!"

echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    🎯 RÉSUMÉ DU DÉPLOIEMENT                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🌐 URLs de votre application:${NC}"
echo -e "   • Application web: ${GREEN}$APP_URL${NC}"
echo -e "   • Service AI: ${GREEN}$SERVICE_URL${NC}"
echo -e "   • Health check: ${GREEN}$SERVICE_URL/health${NC}"
echo ""
echo -e "${BLUE}📊 Consoles de gestion:${NC}"
echo -e "   • Firebase Console: ${GREEN}https://console.firebase.google.com/project/$PROJECT_ID${NC}"
echo -e "   • Cloud Run Console: ${GREEN}https://console.cloud.google.com/run?project=$PROJECT_ID${NC}"
echo -e "   • GCP Console: ${GREEN}https://console.cloud.google.com/home/dashboard?project=$PROJECT_ID${NC}"
echo ""
echo -e "${BLUE}🔧 Configuration sauvegardée dans:${NC}"
echo -e "   • .env.production (variables d'environnement)"
echo -e "   • .env.deployment (configuration complète)"
echo ""
echo -e "${YELLOW}🧪 Prochaines étapes:${NC}"
echo "1. Testez votre application: $APP_URL"
echo "2. Configurez votre domaine personnalisé (optionnel)"
echo "3. Configurez le monitoring et les alertes"
echo "4. Ajoutez des utilisateurs et configurez l'authentification"
echo ""
echo -e "${GREEN}🎉 Votre application EBIOS AI Manager est maintenant en ligne!${NC}"
