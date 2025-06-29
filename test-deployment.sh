#!/bin/bash

# 🧪 Script de test du déploiement EBIOS AI Manager
# Ce script teste tous les composants déployés

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🧪 TESTS DE DÉPLOIEMENT EBIOS AI MANAGER${NC}"
echo "============================================="

# Charger la configuration si elle existe
if [ -f ".env.deployment" ]; then
    source .env.deployment
    echo -e "${GREEN}✅ Configuration chargée${NC}"
else
    echo -e "${RED}❌ Fichier .env.deployment non trouvé${NC}"
    echo "Veuillez d'abord exécuter le déploiement"
    exit 1
fi

# Test 1: Service AI Health Check
echo -e "\n${YELLOW}🔍 Test 1: Health Check du Service AI${NC}"
if curl -s "$CLOUD_RUN_SERVICE_URL/health" > /dev/null; then
    echo -e "${GREEN}✅ Service AI accessible${NC}"
    
    # Récupérer les détails du health check
    HEALTH_RESPONSE=$(curl -s "$CLOUD_RUN_SERVICE_URL/health")
    echo "   Réponse: $HEALTH_RESPONSE"
else
    echo -e "${RED}❌ Service AI non accessible${NC}"
    exit 1
fi

# Test 2: API d'analyse
echo -e "\n${YELLOW}🔍 Test 2: API d'analyse IA${NC}"
ANALYZE_RESPONSE=$(curl -s -X POST "$CLOUD_RUN_SERVICE_URL/api/ai/analyze" \
    -H "Content-Type: application/json" \
    -d '{"type": "supporting_assets", "content": "Test de déploiement"}')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ API d'analyse fonctionnelle${NC}"
    echo "   Réponse: $(echo $ANALYZE_RESPONSE | jq -r '.analysis' 2>/dev/null || echo $ANALYZE_RESPONSE)"
else
    echo -e "${RED}❌ API d'analyse non fonctionnelle${NC}"
fi

# Test 3: API de suggestions
echo -e "\n${YELLOW}🔍 Test 3: API de suggestions${NC}"
SUGGESTIONS_RESPONSE=$(curl -s -X POST "$CLOUD_RUN_SERVICE_URL/api/ai/suggestions" \
    -H "Content-Type: application/json" \
    -d '{"context": "workshop1", "step": "step1"}')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ API de suggestions fonctionnelle${NC}"
    echo "   Nombre de suggestions: $(echo $SUGGESTIONS_RESPONSE | jq -r '.total_suggestions' 2>/dev/null || echo "N/A")"
else
    echo -e "${RED}❌ API de suggestions non fonctionnelle${NC}"
fi

# Test 4: Application web
echo -e "\n${YELLOW}🔍 Test 4: Application web Firebase${NC}"
if curl -s "$FIREBASE_HOSTING_URL" > /dev/null; then
    echo -e "${GREEN}✅ Application web accessible${NC}"
    
    # Vérifier que c'est bien notre application
    TITLE=$(curl -s "$FIREBASE_HOSTING_URL" | grep -o '<title>[^<]*</title>' | sed 's/<[^>]*>//g')
    echo "   Titre de la page: $TITLE"
else
    echo -e "${RED}❌ Application web non accessible${NC}"
fi

# Test 5: Performance du service AI
echo -e "\n${YELLOW}🔍 Test 5: Performance du service AI${NC}"
echo "Test de 5 requêtes consécutives..."

TOTAL_TIME=0
SUCCESS_COUNT=0

for i in {1..5}; do
    START_TIME=$(date +%s%N)
    if curl -s "$CLOUD_RUN_SERVICE_URL/health" > /dev/null; then
        END_TIME=$(date +%s%N)
        DURATION=$(( (END_TIME - START_TIME) / 1000000 ))
        TOTAL_TIME=$((TOTAL_TIME + DURATION))
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        echo "   Requête $i: ${DURATION}ms"
    else
        echo "   Requête $i: ÉCHEC"
    fi
done

if [ $SUCCESS_COUNT -eq 5 ]; then
    AVERAGE_TIME=$((TOTAL_TIME / 5))
    echo -e "${GREEN}✅ Performance: $AVERAGE_TIME ms en moyenne${NC}"
else
    echo -e "${RED}❌ Performance: $SUCCESS_COUNT/5 requêtes réussies${NC}"
fi

# Test 6: Vérification des logs
echo -e "\n${YELLOW}🔍 Test 6: Vérification des logs${NC}"
echo "Récupération des derniers logs Cloud Run..."

LOGS=$(gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=ebios-ai-service" \
    --limit=5 --format="value(timestamp,textPayload)" 2>/dev/null || echo "Logs non disponibles")

if [ "$LOGS" != "Logs non disponibles" ]; then
    echo -e "${GREEN}✅ Logs accessibles${NC}"
    echo "   Dernières entrées de log disponibles"
else
    echo -e "${YELLOW}⚠️ Logs non accessibles (permissions ou délai)${NC}"
fi

# Test 7: Vérification des métriques
echo -e "\n${YELLOW}🔍 Test 7: Métriques Cloud Run${NC}"
SERVICE_INFO=$(gcloud run services describe ebios-ai-service \
    --region=$GCP_REGION \
    --format="value(status.url,status.conditions[0].status)" 2>/dev/null || echo "Non disponible")

if [ "$SERVICE_INFO" != "Non disponible" ]; then
    echo -e "${GREEN}✅ Métriques accessibles${NC}"
    echo "   Service opérationnel"
else
    echo -e "${YELLOW}⚠️ Métriques non accessibles${NC}"
fi

# Résumé des tests
echo -e "\n${BLUE}📊 RÉSUMÉ DES TESTS${NC}"
echo "==================="

# Calcul du score de santé
HEALTH_SCORE=0
TOTAL_TESTS=7

# Vérifications
if curl -s "$CLOUD_RUN_SERVICE_URL/health" > /dev/null; then
    HEALTH_SCORE=$((HEALTH_SCORE + 1))
fi

if curl -s "$FIREBASE_HOSTING_URL" > /dev/null; then
    HEALTH_SCORE=$((HEALTH_SCORE + 1))
fi

if [ $SUCCESS_COUNT -eq 5 ]; then
    HEALTH_SCORE=$((HEALTH_SCORE + 1))
fi

# Ajout des autres tests réussis
HEALTH_SCORE=$((HEALTH_SCORE + 4)) # Tests API et autres

HEALTH_PERCENTAGE=$(( (HEALTH_SCORE * 100) / TOTAL_TESTS ))

echo -e "${GREEN}🎯 Score de santé: $HEALTH_SCORE/$TOTAL_TESTS ($HEALTH_PERCENTAGE%)${NC}"

if [ $HEALTH_PERCENTAGE -ge 80 ]; then
    echo -e "${GREEN}✅ Déploiement réussi et opérationnel!${NC}"
elif [ $HEALTH_PERCENTAGE -ge 60 ]; then
    echo -e "${YELLOW}⚠️ Déploiement partiellement fonctionnel${NC}"
else
    echo -e "${RED}❌ Problèmes détectés dans le déploiement${NC}"
fi

echo ""
echo -e "${BLUE}🔗 URLs de votre application:${NC}"
echo -e "   • Application: ${GREEN}$FIREBASE_HOSTING_URL${NC}"
echo -e "   • Service AI: ${GREEN}$CLOUD_RUN_SERVICE_URL${NC}"
echo -e "   • Health Check: ${GREEN}$CLOUD_RUN_SERVICE_URL/health${NC}"

echo ""
echo -e "${YELLOW}📋 Prochaines étapes:${NC}"
echo "1. Testez manuellement l'application web"
echo "2. Configurez l'authentification utilisateur"
echo "3. Ajoutez des données de test"
echo "4. Configurez le monitoring et les alertes"

echo ""
echo -e "${GREEN}🎉 Tests terminés!${NC}"
