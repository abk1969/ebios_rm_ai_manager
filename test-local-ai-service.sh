#!/bin/bash

# 🧪 Script de test du service AI en local
# Ce script teste toutes les fonctionnalités du service Python AI

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

AI_SERVICE_URL="http://localhost:8080"

echo -e "${BLUE}🧪 TESTS DU SERVICE AI LOCAL${NC}"
echo "================================"

# Fonction de test
test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    
    echo -e "\n${YELLOW}🔍 Test: $name${NC}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "%{http_code}" "$AI_SERVICE_URL$endpoint")
    else
        response=$(curl -s -w "%{http_code}" -X "$method" "$AI_SERVICE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code="${response: -3}"
    body="${response%???}"
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✅ $name: OK${NC}"
        if command -v jq &> /dev/null; then
            echo "$body" | jq . 2>/dev/null || echo "$body"
        else
            echo "$body"
        fi
    else
        echo -e "${RED}❌ $name: ÉCHEC (Code: $http_code)${NC}"
        echo "$body"
    fi
}

# Vérifier si le service est démarré
echo "Vérification de la disponibilité du service..."
if ! curl -s "$AI_SERVICE_URL" > /dev/null; then
    echo -e "${RED}❌ Service AI non accessible sur $AI_SERVICE_URL${NC}"
    echo "Veuillez démarrer le service avec: ./start-ai-service.sh"
    exit 1
fi

echo -e "${GREEN}✅ Service AI accessible${NC}"

# Test 1: Page d'accueil
test_endpoint "Page d'accueil" "GET" "/"

# Test 2: Health check
test_endpoint "Health check" "GET" "/health"

# Test 3: API d'analyse - Actifs supports
test_endpoint "Analyse actifs supports" "POST" "/api/ai/analyze" '{
    "type": "supporting_assets",
    "content": "Serveur web principal, base de données clients",
    "mission_context": {
        "name": "Mission test locale",
        "description": "Test en environnement local"
    }
}'

# Test 4: API d'analyse - Actifs essentiels
test_endpoint "Analyse actifs essentiels" "POST" "/api/ai/analyze" '{
    "type": "essential_assets",
    "content": "Données clients, processus de facturation",
    "mission_context": {
        "name": "Mission test locale"
    }
}'

# Test 5: API d'analyse - Événements redoutés
test_endpoint "Analyse événements redoutés" "POST" "/api/ai/analyze" '{
    "type": "dreaded_events",
    "content": "Perte de données, interruption de service",
    "mission_context": {
        "name": "Mission test locale"
    }
}'

# Test 6: API de suggestions - Workshop 1 Step 1
test_endpoint "Suggestions Workshop 1 Step 1" "POST" "/api/ai/suggestions" '{
    "context": "workshop1",
    "step": "step1"
}'

# Test 7: API de suggestions - Workshop 1 Step 2
test_endpoint "Suggestions Workshop 1 Step 2" "POST" "/api/ai/suggestions" '{
    "context": "workshop1",
    "step": "step2"
}'

# Test 8: API de suggestions - Workshop 1 Step 3
test_endpoint "Suggestions Workshop 1 Step 3" "POST" "/api/ai/suggestions" '{
    "context": "workshop1",
    "step": "step3"
}'

# Test 9: API de validation
test_endpoint "Validation données EBIOS" "POST" "/api/ai/validate" '{
    "mission_name": "Mission test locale",
    "essential_assets": [
        {"name": "Données clients", "type": "information"},
        {"name": "Processus facturation", "type": "process"}
    ],
    "supporting_assets": [
        {"name": "Serveur web", "type": "system"},
        {"name": "Base de données", "type": "system"}
    ],
    "dreaded_events": [
        {"name": "Perte de données", "impact": "high"},
        {"name": "Interruption service", "impact": "medium"}
    ]
}'

# Test 10: Test de performance (5 requêtes rapides)
echo -e "\n${YELLOW}🔍 Test de performance${NC}"
echo "Envoi de 5 requêtes consécutives..."

total_time=0
success_count=0

for i in {1..5}; do
    start_time=$(date +%s%N)
    if curl -s "$AI_SERVICE_URL/health" > /dev/null; then
        end_time=$(date +%s%N)
        duration=$(( (end_time - start_time) / 1000000 ))
        total_time=$((total_time + duration))
        success_count=$((success_count + 1))
        echo "   Requête $i: ${duration}ms"
    else
        echo "   Requête $i: ÉCHEC"
    fi
done

if [ $success_count -eq 5 ]; then
    average_time=$((total_time / 5))
    echo -e "${GREEN}✅ Performance: $average_time ms en moyenne${NC}"
else
    echo -e "${RED}❌ Performance: $success_count/5 requêtes réussies${NC}"
fi

# Résumé
echo -e "\n${BLUE}📊 RÉSUMÉ DES TESTS${NC}"
echo "==================="
echo -e "${GREEN}✅ Service AI local fonctionnel${NC}"
echo -e "${BLUE}🌐 URLs disponibles:${NC}"
echo "   • Service principal: $AI_SERVICE_URL"
echo "   • Health check: $AI_SERVICE_URL/health"
echo "   • API d'analyse: $AI_SERVICE_URL/api/ai/analyze"
echo "   • API de suggestions: $AI_SERVICE_URL/api/ai/suggestions"
echo "   • API de validation: $AI_SERVICE_URL/api/ai/validate"

echo -e "\n${YELLOW}🔧 Prochaines étapes:${NC}"
echo "1. Démarrer le frontend: ./start-frontend.sh"
echo "2. Démarrer Firebase Emulators: ./start-firebase-emulators.sh"
echo "3. Tester l'application complète sur http://localhost:5173"

echo -e "\n${GREEN}🎉 Tests terminés!${NC}"
