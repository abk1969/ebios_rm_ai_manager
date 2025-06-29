#!/bin/bash

# 🚀 Script de démarrage rapide EBIOS AI Manager
# Ce script démarre rapidement l'environnement local

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 DÉMARRAGE RAPIDE EBIOS AI MANAGER${NC}"
echo "===================================="

# Fonction pour vérifier si un port est libre
check_port() {
    local port=$1
    if netstat -an | grep ":$port" | grep -q "LISTENING"; then
        return 1  # Port occupé
    else
        return 0  # Port libre
    fi
}

# Fonction pour démarrer un service
start_service() {
    local service_name="$1"
    local port="$2"
    local command="$3"
    
    echo -e "\n${YELLOW}🔍 Vérification $service_name (port $port)...${NC}"
    
    if check_port $port; then
        echo -e "${BLUE}🚀 Démarrage $service_name...${NC}"
        eval "$command" &
        sleep 2
        
        if netstat -an | grep ":$port" | grep -q "LISTENING"; then
            echo -e "${GREEN}✅ $service_name démarré sur le port $port${NC}"
            return 0
        else
            echo -e "${RED}❌ Échec du démarrage de $service_name${NC}"
            return 1
        fi
    else
        echo -e "${GREEN}✅ $service_name déjà en cours d'exécution${NC}"
        return 0
    fi
}

# Vérifier les prérequis de base
echo -e "\n${YELLOW}📋 Vérification des prérequis...${NC}"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installation des dépendances Node.js...${NC}"
    npm install
fi

if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚙️ Configuration de l'environnement...${NC}"
    ./setup-local-environment.sh
fi

echo -e "${GREEN}✅ Prérequis validés${NC}"

# Démarrer les services
echo -e "\n${BLUE}🚀 Démarrage des services...${NC}"

# 1. Démarrer le frontend (priorité)
start_service "Frontend React" "5173" "npm run dev"

# 2. Démarrer le service AI Python
if [ -d "python-ai-service/venv" ]; then
    start_service "Service Python AI" "8080" "./start-ai-service.sh"
else
    echo -e "${YELLOW}⚠️ Environnement Python non configuré${NC}"
    echo -e "${BLUE}🔧 Configuration en cours...${NC}"
    ./setup-local-environment.sh
    start_service "Service Python AI" "8080" "./start-ai-service.sh"
fi

# 3. Démarrer Firebase Emulators (optionnel)
if command -v firebase &> /dev/null; then
    start_service "Firebase Emulators" "4000" "./start-firebase-emulators.sh"
else
    echo -e "${YELLOW}⚠️ Firebase CLI non installé${NC}"
    echo -e "${BLUE}🔧 Installation...${NC}"
    npm install -g firebase-tools
    ./setup-firebase-local.sh
    start_service "Firebase Emulators" "4000" "./start-firebase-emulators.sh"
fi

# Attendre que tous les services soient prêts
echo -e "\n${YELLOW}⏳ Attente de la disponibilité des services...${NC}"
sleep 5

# Vérifier l'état final
echo -e "\n${BLUE}🔍 Vérification finale...${NC}"

services_ok=0
total_services=0

# Test Frontend
total_services=$((total_services + 1))
if curl -s http://localhost:5173 > /dev/null; then
    echo -e "${GREEN}✅ Frontend accessible: http://localhost:5173${NC}"
    services_ok=$((services_ok + 1))
else
    echo -e "${RED}❌ Frontend non accessible${NC}"
fi

# Test Service AI
total_services=$((total_services + 1))
if curl -s http://localhost:8080/health > /dev/null; then
    echo -e "${GREEN}✅ Service AI accessible: http://localhost:8080${NC}"
    services_ok=$((services_ok + 1))
else
    echo -e "${RED}❌ Service AI non accessible${NC}"
fi

# Test Firebase (optionnel)
if netstat -an | grep ":4000" | grep -q "LISTENING"; then
    total_services=$((total_services + 1))
    if curl -s http://localhost:4000 > /dev/null; then
        echo -e "${GREEN}✅ Firebase UI accessible: http://localhost:4000${NC}"
        services_ok=$((services_ok + 1))
    else
        echo -e "${RED}❌ Firebase UI non accessible${NC}"
    fi
fi

# Résumé
echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📊 RÉSUMÉ DU DÉMARRAGE${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

success_rate=0
if [ $total_services -gt 0 ]; then
    success_rate=$(( (services_ok * 100) / total_services ))
fi

echo -e "\n${GREEN}✅ Services opérationnels: $services_ok/$total_services${NC}"
echo -e "${YELLOW}📈 Taux de réussite: $success_rate%${NC}"

if [ $success_rate -ge 80 ]; then
    echo -e "\n${GREEN}🎉 SUCCÈS! Environnement local opérationnel${NC}"
    echo -e "\n${BLUE}🌐 Accédez à votre application:${NC}"
    echo -e "   ${GREEN}👉 http://localhost:5173${NC}"
    
    # Ouvrir automatiquement le navigateur
    if command -v start &> /dev/null; then
        echo -e "\n${BLUE}🌐 Ouverture automatique du navigateur...${NC}"
        start http://localhost:5173
    elif command -v open &> /dev/null; then
        echo -e "\n${BLUE}🌐 Ouverture automatique du navigateur...${NC}"
        open http://localhost:5173
    fi
    
elif [ $success_rate -ge 50 ]; then
    echo -e "\n${YELLOW}⚠️ PARTIEL! Certains services ne sont pas démarrés${NC}"
    echo -e "${BLUE}🔧 Exécutez: ./diagnose-local-environment.sh${NC}"
else
    echo -e "\n${RED}❌ ÉCHEC! Problèmes de démarrage détectés${NC}"
    echo -e "${BLUE}🔧 Solutions:${NC}"
    echo "   • Diagnostic: ./diagnose-local-environment.sh"
    echo "   • Configuration: ./setup-local-environment.sh"
    echo "   • Tests: ./test-complete-local.sh"
fi

echo -e "\n${BLUE}🔧 Commandes utiles:${NC}"
echo "   • Diagnostic: ./diagnose-local-environment.sh"
echo "   • Tests: ./test-complete-local.sh"
echo "   • Arrêter: Ctrl+C dans chaque terminal"

echo -e "\n${GREEN}🎯 Démarrage terminé!${NC}"
