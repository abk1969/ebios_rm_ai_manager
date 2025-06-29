#!/bin/bash

# 🚀 Script de déploiement étape par étape pour Cloud Run
# Ce script vous guide dans le déploiement de votre service EBIOS AI

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 DÉPLOIEMENT EBIOS AI SERVICE SUR CLOUD RUN${NC}"
echo "=================================================="

# Étape 1: Configuration du projet
echo -e "\n${YELLOW}📋 Étape 1: Configuration du projet${NC}"
read -p "Entrez votre Project ID GCP: " PROJECT_ID
read -p "Entrez la région (défaut: europe-west1): " REGION
REGION=${REGION:-"europe-west1"}

echo -e "${GREEN}✅ Configuration:${NC}"
echo "   Project ID: $PROJECT_ID"
echo "   Région: $REGION"

# Étape 2: Configuration gcloud
echo -e "\n${YELLOW}🔧 Étape 2: Configuration gcloud${NC}"
gcloud config set project $PROJECT_ID
gcloud config set run/region $REGION

# Étape 3: Activation des APIs
echo -e "\n${YELLOW}🔌 Étape 3: Activation des APIs${NC}"
echo "Activation des APIs nécessaires..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Étape 4: Construction de l'image Docker
echo -e "\n${YELLOW}🐳 Étape 4: Construction de l'image Docker${NC}"
IMAGE_NAME="gcr.io/$PROJECT_ID/ebios-ai-service"
echo "Construction de l'image: $IMAGE_NAME"

cd python-ai-service
docker build -t $IMAGE_NAME .

# Étape 5: Configuration Docker pour GCP
echo -e "\n${YELLOW}🔐 Étape 5: Configuration Docker pour GCP${NC}"
gcloud auth configure-docker

# Étape 6: Push de l'image
echo -e "\n${YELLOW}📤 Étape 6: Push de l'image vers Container Registry${NC}"
docker push $IMAGE_NAME

# Étape 7: Déploiement sur Cloud Run
echo -e "\n${YELLOW}🚀 Étape 7: Déploiement sur Cloud Run${NC}"
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

# Étape 8: Récupération de l'URL
echo -e "\n${YELLOW}🌐 Étape 8: Récupération de l'URL du service${NC}"
SERVICE_URL=$(gcloud run services describe ebios-ai-service --region=$REGION --format="value(status.url)")

echo -e "\n${GREEN}🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!${NC}"
echo "=================================================="
echo -e "${GREEN}✅ Votre service est accessible à l'URL:${NC}"
echo -e "${BLUE}$SERVICE_URL${NC}"
echo ""
echo -e "${GREEN}🔗 URLs importantes:${NC}"
echo "   • Service principal: $SERVICE_URL"
echo "   • Health check: $SERVICE_URL/health"
echo "   • API d'analyse: $SERVICE_URL/api/ai/analyze"
echo "   • API de suggestions: $SERVICE_URL/api/ai/suggestions"
echo ""
echo -e "${GREEN}📊 Console GCP:${NC}"
echo "   • Cloud Run: https://console.cloud.google.com/run?project=$PROJECT_ID"
echo "   • Container Registry: https://console.cloud.google.com/gcr?project=$PROJECT_ID"
echo ""
echo -e "${YELLOW}🧪 Test rapide:${NC}"
echo "curl $SERVICE_URL/health"

cd ..

# Sauvegarde des informations
cat > .env.cloudrun << EOF
# Configuration Cloud Run générée automatiquement
GCP_PROJECT_ID=$PROJECT_ID
GCP_REGION=$REGION
CLOUD_RUN_SERVICE_URL=$SERVICE_URL
CLOUD_RUN_SERVICE_NAME=ebios-ai-service
DOCKER_IMAGE=$IMAGE_NAME
EOF

echo -e "\n${GREEN}💾 Configuration sauvegardée dans .env.cloudrun${NC}"
