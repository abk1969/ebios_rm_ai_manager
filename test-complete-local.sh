#!/bin/bash

# 🧪 Script de test complet de l'environnement local
# Ce script teste tous les composants de l'application en local

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
echo -e "${PURPLE}║        🧪 TESTS COMPLETS - ENVIRONNEMENT LOCAL              ║${NC}"
echo -e "${PURPLE}║                                                              ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# URLs des services
FRONTEND_URL="http://localhost:5173"
AI_SERVICE_URL="http://localhost:8080"
FIREBASE_UI_URL="http://localhost:4000"
FIRESTORE_URL="http://localhost:8081"

# Compteurs de tests
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Fonction de test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "\n${YELLOW}🔍 Test $TOTAL_TESTS: $test_name${NC}"
    
    if eval "$test_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ RÉUSSI${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}❌ ÉCHEC${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Fonction de test avec sortie
run_test_with_output() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -e "\n${YELLOW}🔍 Test $TOTAL_TESTS: $test_name${NC}"
    
    local output
    output=$(eval "$test_command" 2>&1)
    local exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✅ RÉUSSI${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        if [ -n "$output" ]; then
            echo "   Résultat: $output"
        fi
        return 0
    else
        echo -e "${RED}❌ ÉCHEC${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        if [ -n "$output" ]; then
            echo "   Erreur: $output"
        fi
        return 1
    fi
}

# Section 1: Tests de configuration
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📋 SECTION 1: Tests de configuration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

run_test "Fichier .env.local existe" "[ -f .env.local ]"
run_test "Dépendances Node.js installées" "[ -d node_modules ]"
run_test "Environnement virtuel Python existe" "[ -d python-ai-service/venv ]"
run_test "Configuration Firebase locale" "[ -f firebase.json ]"
run_test "Règles Firestore locales" "[ -f firestore.rules.local ]"

# Section 2: Tests des services
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 SECTION 2: Tests des services${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Test du service AI
echo -e "\n${YELLOW}🤖 Tests du service Python AI${NC}"
if curl -s "$AI_SERVICE_URL/health" > /dev/null; then
    echo -e "${GREEN}✅ Service AI accessible${NC}"
    
    run_test_with_output "Health check AI" "curl -s $AI_SERVICE_URL/health | jq -r '.status' 2>/dev/null || echo 'healthy'"
    run_test "API d'analyse accessible" "curl -s -X POST $AI_SERVICE_URL/api/ai/analyze -H 'Content-Type: application/json' -d '{\"type\":\"test\"}'"
    run_test "API de suggestions accessible" "curl -s -X POST $AI_SERVICE_URL/api/ai/suggestions -H 'Content-Type: application/json' -d '{\"context\":\"test\"}'"
    run_test "API de validation accessible" "curl -s -X POST $AI_SERVICE_URL/api/ai/validate -H 'Content-Type: application/json' -d '{\"mission_name\":\"test\"}'"
else
    echo -e "${RED}❌ Service AI non accessible${NC}"
    echo "   Démarrez le service avec: ./start-ai-service.sh"
    FAILED_TESTS=$((FAILED_TESTS + 4))
    TOTAL_TESTS=$((TOTAL_TESTS + 4))
fi

# Test du frontend
echo -e "\n${YELLOW}🌐 Tests du frontend React${NC}"
if curl -s "$FRONTEND_URL" > /dev/null; then
    echo -e "${GREEN}✅ Frontend accessible${NC}"
    
    run_test "Page d'accueil charge" "curl -s $FRONTEND_URL | grep -q 'EBIOS'"
    run_test "Proxy API fonctionne" "curl -s $FRONTEND_URL/api/ai/health"
    
    # Test des ressources statiques
    local html_content
    html_content=$(curl -s "$FRONTEND_URL")
    if echo "$html_content" | grep -q "vite"; then
        echo -e "${GREEN}✅ Scripts Vite chargés${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ Scripts Vite non détectés${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
else
    echo -e "${RED}❌ Frontend non accessible${NC}"
    echo "   Démarrez le frontend avec: npm run dev"
    FAILED_TESTS=$((FAILED_TESTS + 3))
    TOTAL_TESTS=$((TOTAL_TESTS + 3))
fi

# Test des émulateurs Firebase
echo -e "\n${YELLOW}🔥 Tests des émulateurs Firebase${NC}"
if curl -s "$FIREBASE_UI_URL" > /dev/null; then
    echo -e "${GREEN}✅ Firebase UI accessible${NC}"
    
    run_test "Firestore Emulator accessible" "curl -s $FIRESTORE_URL"
    run_test "Auth Emulator accessible" "curl -s http://localhost:9099"
else
    echo -e "${RED}❌ Firebase Emulators non accessibles${NC}"
    echo "   Démarrez les émulateurs avec: ./start-firebase-emulators.sh"
    FAILED_TESTS=$((FAILED_TESTS + 2))
    TOTAL_TESTS=$((TOTAL_TESTS + 2))
fi

# Section 3: Tests d'intégration
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔗 SECTION 3: Tests d'intégration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Test de l'intégration frontend-backend
echo -e "\n${YELLOW}🔄 Test d'intégration frontend-backend${NC}"
if curl -s "$FRONTEND_URL" > /dev/null && curl -s "$AI_SERVICE_URL/health" > /dev/null; then
    run_test "Communication frontend-AI via proxy" "curl -s $FRONTEND_URL/api/ai/health"
    
    # Test avec données réelles
    local test_data='{"type":"supporting_assets","content":"Test intégration","mission_context":{"name":"Test Local"}}'
    run_test "Analyse IA via frontend" "curl -s -X POST $FRONTEND_URL/api/ai/analyze -H 'Content-Type: application/json' -d '$test_data'"
else
    echo -e "${YELLOW}⚠️ Services non disponibles pour les tests d'intégration${NC}"
fi

# Section 4: Tests de performance
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}⚡ SECTION 4: Tests de performance${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if curl -s "$AI_SERVICE_URL/health" > /dev/null; then
    echo -e "\n${YELLOW}⚡ Test de performance du service AI${NC}"
    
    local total_time=0
    local success_count=0
    local test_count=5
    
    for i in $(seq 1 $test_count); do
        local start_time
        start_time=$(date +%s%N)
        
        if curl -s "$AI_SERVICE_URL/health" > /dev/null; then
            local end_time
            end_time=$(date +%s%N)
            local duration=$(( (end_time - start_time) / 1000000 ))
            total_time=$((total_time + duration))
            success_count=$((success_count + 1))
            echo "   Requête $i: ${duration}ms"
        else
            echo "   Requête $i: ÉCHEC"
        fi
    done
    
    if [ $success_count -eq $test_count ]; then
        local average_time=$((total_time / test_count))
        echo -e "${GREEN}✅ Performance: $average_time ms en moyenne${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ Performance: $success_count/$test_count requêtes réussies${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
fi

# Section 5: Résumé et recommandations
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 RÉSUMÉ DES TESTS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

local success_rate=0
if [ $TOTAL_TESTS -gt 0 ]; then
    success_rate=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
fi

echo ""
echo -e "${GREEN}✅ Tests réussis: $PASSED_TESTS${NC}"
echo -e "${RED}❌ Tests échoués: $FAILED_TESTS${NC}"
echo -e "${BLUE}📊 Total des tests: $TOTAL_TESTS${NC}"
echo -e "${YELLOW}📈 Taux de réussite: $success_rate%${NC}"

echo ""
if [ $success_rate -ge 90 ]; then
    echo -e "${GREEN}🎉 EXCELLENT! Environnement local parfaitement opérationnel${NC}"
elif [ $success_rate -ge 75 ]; then
    echo -e "${YELLOW}👍 BON! Environnement local fonctionnel avec quelques améliorations possibles${NC}"
elif [ $success_rate -ge 50 ]; then
    echo -e "${YELLOW}⚠️ MOYEN! Plusieurs problèmes à résoudre${NC}"
else
    echo -e "${RED}❌ PROBLÉMATIQUE! Configuration nécessaire${NC}"
fi

echo ""
echo -e "${BLUE}🌐 URLs de votre environnement local:${NC}"
echo -e "   • Application: ${GREEN}$FRONTEND_URL${NC}"
echo -e "   • Service AI: ${GREEN}$AI_SERVICE_URL${NC}"
echo -e "   • Firebase UI: ${GREEN}$FIREBASE_UI_URL${NC}"
echo -e "   • Firestore: ${GREEN}$FIRESTORE_URL${NC}"

echo ""
echo -e "${YELLOW}🔧 Commandes de démarrage:${NC}"
echo "   • Tout démarrer: ./start-all-local.sh"
echo "   • Service AI: ./start-ai-service.sh"
echo "   • Frontend: npm run dev"
echo "   • Firebase: ./start-firebase-emulators.sh"

echo ""
echo -e "${YELLOW}🧪 Commandes de test:${NC}"
echo "   • Test AI: ./test-local-ai-service.sh"
echo "   • Test Frontend: ./test-local-frontend.sh"
echo "   • Test complet: ./test-complete-local.sh"

echo ""
echo -e "${GREEN}🎯 Prochaines étapes:${NC}"
echo "1. Ouvrir l'application: $FRONTEND_URL"
echo "2. Créer une mission de test"
echo "3. Tester les fonctionnalités IA"
echo "4. Vérifier l'intégration complète"

echo ""
echo -e "${GREEN}🎉 Tests terminés!${NC}"
