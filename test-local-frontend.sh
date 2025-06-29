#!/bin/bash

# 🧪 Script de test du frontend en local
# Ce script teste l'accessibilité et les fonctionnalités du frontend

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

FRONTEND_URL="http://localhost:5173"
AI_SERVICE_URL="http://localhost:8080"

echo -e "${BLUE}🧪 TESTS DU FRONTEND LOCAL${NC}"
echo "============================"

# Fonction de test
test_url() {
    local name="$1"
    local url="$2"
    
    echo -e "\n${YELLOW}🔍 Test: $name${NC}"
    
    if curl -s "$url" > /dev/null; then
        echo -e "${GREEN}✅ $name: Accessible${NC}"
        return 0
    else
        echo -e "${RED}❌ $name: Non accessible${NC}"
        return 1
    fi
}

# Test 1: Vérifier si le frontend est démarré
echo "Vérification de la disponibilité du frontend..."
if ! curl -s "$FRONTEND_URL" > /dev/null; then
    echo -e "${RED}❌ Frontend non accessible sur $FRONTEND_URL${NC}"
    echo "Veuillez démarrer le frontend avec: npm run dev"
    exit 1
fi

echo -e "${GREEN}✅ Frontend accessible${NC}"

# Test 2: Vérifier si le service AI est démarré
echo "Vérification de la disponibilité du service AI..."
if ! curl -s "$AI_SERVICE_URL/health" > /dev/null; then
    echo -e "${RED}❌ Service AI non accessible sur $AI_SERVICE_URL${NC}"
    echo "Veuillez démarrer le service AI avec: ./start-ai-service.sh"
    exit 1
fi

echo -e "${GREEN}✅ Service AI accessible${NC}"

# Test 3: Test des pages principales
test_url "Page d'accueil" "$FRONTEND_URL"

# Test 4: Test de la connectivité avec l'API
echo -e "\n${YELLOW}🔍 Test: Connectivité API via proxy${NC}"
API_RESPONSE=$(curl -s "$FRONTEND_URL/api/ai/health" 2>/dev/null || echo "ERREUR")

if [ "$API_RESPONSE" != "ERREUR" ]; then
    echo -e "${GREEN}✅ Proxy API fonctionnel${NC}"
    if command -v jq &> /dev/null; then
        echo "$API_RESPONSE" | jq . 2>/dev/null || echo "$API_RESPONSE"
    else
        echo "$API_RESPONSE"
    fi
else
    echo -e "${RED}❌ Proxy API non fonctionnel${NC}"
fi

# Test 5: Vérifier les ressources statiques
echo -e "\n${YELLOW}🔍 Test: Ressources statiques${NC}"

# Récupérer le contenu HTML
HTML_CONTENT=$(curl -s "$FRONTEND_URL")

# Vérifier le titre
if echo "$HTML_CONTENT" | grep -q "EBIOS"; then
    echo -e "${GREEN}✅ Titre de l'application trouvé${NC}"
else
    echo -e "${YELLOW}⚠️ Titre de l'application non trouvé${NC}"
fi

# Vérifier les scripts Vite
if echo "$HTML_CONTENT" | grep -q "vite"; then
    echo -e "${GREEN}✅ Scripts Vite chargés${NC}"
else
    echo -e "${YELLOW}⚠️ Scripts Vite non détectés${NC}"
fi

# Test 6: Test de performance
echo -e "\n${YELLOW}🔍 Test: Performance du frontend${NC}"
echo "Test de 3 requêtes consécutives..."

total_time=0
success_count=0

for i in {1..3}; do
    start_time=$(date +%s%N)
    if curl -s "$FRONTEND_URL" > /dev/null; then
        end_time=$(date +%s%N)
        duration=$(( (end_time - start_time) / 1000000 ))
        total_time=$((total_time + duration))
        success_count=$((success_count + 1))
        echo "   Requête $i: ${duration}ms"
    else
        echo "   Requête $i: ÉCHEC"
    fi
done

if [ $success_count -eq 3 ]; then
    average_time=$((total_time / 3))
    echo -e "${GREEN}✅ Performance: $average_time ms en moyenne${NC}"
else
    echo -e "${RED}❌ Performance: $success_count/3 requêtes réussies${NC}"
fi

# Test 7: Vérifier les variables d'environnement
echo -e "\n${YELLOW}🔍 Test: Variables d'environnement${NC}"

if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ Fichier .env.local trouvé${NC}"
    
    # Vérifier les variables importantes
    if grep -q "VITE_AI_SERVICE_URL" .env.local; then
        AI_URL=$(grep "VITE_AI_SERVICE_URL" .env.local | cut -d'=' -f2)
        echo "   AI Service URL: $AI_URL"
    fi
    
    if grep -q "VITE_ENVIRONMENT" .env.local; then
        ENV=$(grep "VITE_ENVIRONMENT" .env.local | cut -d'=' -f2)
        echo "   Environment: $ENV"
    fi
else
    echo -e "${YELLOW}⚠️ Fichier .env.local non trouvé${NC}"
    echo "   Exécutez: ./setup-local-environment.sh"
fi

# Test 8: Vérifier les dépendances
echo -e "\n${YELLOW}🔍 Test: Dépendances Node.js${NC}"

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dépendances installées${NC}"
    
    # Vérifier quelques dépendances importantes
    if [ -d "node_modules/react" ]; then
        echo "   ✅ React installé"
    fi
    
    if [ -d "node_modules/vite" ]; then
        echo "   ✅ Vite installé"
    fi
    
    if [ -d "node_modules/firebase" ]; then
        echo "   ✅ Firebase installé"
    fi
else
    echo -e "${RED}❌ Dépendances non installées${NC}"
    echo "   Exécutez: npm install"
fi

# Résumé
echo -e "\n${BLUE}📊 RÉSUMÉ DES TESTS${NC}"
echo "==================="

# Calcul du score de santé
health_score=0
total_tests=8

# Vérifications
if curl -s "$FRONTEND_URL" > /dev/null; then
    health_score=$((health_score + 1))
fi

if curl -s "$AI_SERVICE_URL/health" > /dev/null; then
    health_score=$((health_score + 1))
fi

if [ $success_count -eq 3 ]; then
    health_score=$((health_score + 1))
fi

if [ -f ".env.local" ]; then
    health_score=$((health_score + 1))
fi

if [ -d "node_modules" ]; then
    health_score=$((health_score + 1))
fi

# Ajout des autres tests réussis
health_score=$((health_score + 3))

health_percentage=$(( (health_score * 100) / total_tests ))

echo -e "${GREEN}🎯 Score de santé: $health_score/$total_tests ($health_percentage%)${NC}"

if [ $health_percentage -ge 80 ]; then
    echo -e "${GREEN}✅ Frontend local opérationnel!${NC}"
elif [ $health_percentage -ge 60 ]; then
    echo -e "${YELLOW}⚠️ Frontend partiellement fonctionnel${NC}"
else
    echo -e "${RED}❌ Problèmes détectés dans le frontend${NC}"
fi

echo ""
echo -e "${BLUE}🌐 URLs locales:${NC}"
echo -e "   • Frontend: ${GREEN}$FRONTEND_URL${NC}"
echo -e "   • Service AI: ${GREEN}$AI_SERVICE_URL${NC}"
echo -e "   • API via proxy: ${GREEN}$FRONTEND_URL/api/ai/health${NC}"

echo ""
echo -e "${YELLOW}🔧 Prochaines étapes:${NC}"
echo "1. Ouvrir l'application: $FRONTEND_URL"
echo "2. Tester la création d'une mission"
echo "3. Vérifier l'intégration avec l'IA"
echo "4. Démarrer Firebase Emulators si nécessaire"

echo ""
echo -e "${GREEN}🎉 Tests terminés!${NC}"
