#!/bin/bash

# 🔍 Script de diagnostic de l'environnement local
# Ce script diagnostique et résout les problèmes courants

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
echo -e "${PURPLE}║        🔍 DIAGNOSTIC ENVIRONNEMENT LOCAL                     ║${NC}"
echo -e "${PURPLE}║                                                              ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# URLs des services
FRONTEND_URL="http://localhost:5173"
AI_SERVICE_URL="http://localhost:8080"
FIREBASE_UI_URL="http://localhost:4000"
FIRESTORE_URL="http://localhost:8081"

# Fonction de diagnostic
diagnose_service() {
    local service_name="$1"
    local port="$2"
    local url="$3"
    local start_command="$4"
    
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}🔍 Diagnostic: $service_name${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Vérifier si le port est en écoute
    if netstat -an | grep ":$port" | grep -q "LISTENING"; then
        echo -e "${GREEN}✅ Port $port en écoute${NC}"
        
        # Tester la connectivité
        if curl -s "$url" > /dev/null; then
            echo -e "${GREEN}✅ Service accessible sur $url${NC}"
            return 0
        else
            echo -e "${RED}❌ Service non accessible sur $url${NC}"
            echo -e "${YELLOW}🔧 Solution: Vérifiez les logs du service${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ Port $port non en écoute${NC}"
        echo -e "${YELLOW}🔧 Solution: Démarrer le service avec: $start_command${NC}"
        
        # Proposer de démarrer le service
        read -p "$(echo -e ${YELLOW}Voulez-vous démarrer le service maintenant? ${NC}[y/N]: )" -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${BLUE}🚀 Démarrage de $service_name...${NC}"
            eval "$start_command" &
            sleep 3
            
            # Revérifier
            if netstat -an | grep ":$port" | grep -q "LISTENING"; then
                echo -e "${GREEN}✅ $service_name démarré avec succès${NC}"
                return 0
            else
                echo -e "${RED}❌ Échec du démarrage de $service_name${NC}"
                return 1
            fi
        fi
        return 1
    fi
}

# Fonction pour vérifier les prérequis
check_prerequisites() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📋 Vérification des prérequis${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    local all_good=true
    
    # Vérifier Node.js
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        echo -e "${GREEN}✅ Node.js: $node_version${NC}"
    else
        echo -e "${RED}❌ Node.js non installé${NC}"
        all_good=false
    fi
    
    # Vérifier npm
    if command -v npm &> /dev/null; then
        local npm_version=$(npm --version)
        echo -e "${GREEN}✅ npm: $npm_version${NC}"
    else
        echo -e "${RED}❌ npm non installé${NC}"
        all_good=false
    fi
    
    # Vérifier Python
    if command -v python &> /dev/null || command -v python3 &> /dev/null; then
        if command -v python3 &> /dev/null; then
            local python_version=$(python3 --version)
        else
            local python_version=$(python --version)
        fi
        echo -e "${GREEN}✅ Python: $python_version${NC}"
    else
        echo -e "${RED}❌ Python non installé${NC}"
        all_good=false
    fi
    
    # Vérifier les dépendances Node.js
    if [ -d "node_modules" ]; then
        echo -e "${GREEN}✅ Dépendances Node.js installées${NC}"
    else
        echo -e "${RED}❌ Dépendances Node.js manquantes${NC}"
        echo -e "${YELLOW}🔧 Solution: npm install${NC}"
        all_good=false
    fi
    
    # Vérifier l'environnement virtuel Python
    if [ -d "python-ai-service/venv" ]; then
        echo -e "${GREEN}✅ Environnement virtuel Python créé${NC}"
    else
        echo -e "${RED}❌ Environnement virtuel Python manquant${NC}"
        echo -e "${YELLOW}🔧 Solution: ./setup-local-environment.sh${NC}"
        all_good=false
    fi
    
    # Vérifier le fichier .env.local
    if [ -f ".env.local" ]; then
        echo -e "${GREEN}✅ Fichier .env.local présent${NC}"
    else
        echo -e "${RED}❌ Fichier .env.local manquant${NC}"
        echo -e "${YELLOW}🔧 Solution: ./setup-local-environment.sh${NC}"
        all_good=false
    fi
    
    return $all_good
}

# Fonction pour afficher les solutions
show_solutions() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}🔧 Solutions rapides${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    echo -e "\n${YELLOW}🚀 Démarrage des services:${NC}"
    echo "   • Tout démarrer: ./start-all-local.sh"
    echo "   • Frontend seul: npm run dev"
    echo "   • Service AI seul: ./start-ai-service.sh"
    echo "   • Firebase seul: ./start-firebase-emulators.sh"
    
    echo -e "\n${YELLOW}🔧 Configuration:${NC}"
    echo "   • Configuration complète: ./setup-local-environment.sh"
    echo "   • Configuration Firebase: ./setup-firebase-local.sh"
    echo "   • Réinstaller dépendances: npm install"
    
    echo -e "\n${YELLOW}🧪 Tests:${NC}"
    echo "   • Test complet: ./test-complete-local.sh"
    echo "   • Test frontend: ./test-local-frontend.sh"
    echo "   • Test service AI: ./test-local-ai-service.sh"
    
    echo -e "\n${YELLOW}🆘 Dépannage:${NC}"
    echo "   • Tuer processus Node: taskkill /F /IM node.exe"
    echo "   • Nettoyer ports: netstat -ano | findstr :5173"
    echo "   • Logs détaillés: npm run dev --verbose"
}

# Fonction principale
main() {
    echo -e "${BLUE}🔍 Démarrage du diagnostic...${NC}"
    
    # Vérifier les prérequis
    if ! check_prerequisites; then
        echo -e "\n${RED}❌ Prérequis manquants détectés${NC}"
        show_solutions
        return 1
    fi
    
    echo -e "\n${GREEN}✅ Prérequis validés${NC}"
    
    # Diagnostiquer chaque service
    local services_ok=0
    local total_services=4
    
    if diagnose_service "Frontend React" "5173" "$FRONTEND_URL" "npm run dev"; then
        services_ok=$((services_ok + 1))
    fi
    
    if diagnose_service "Service Python AI" "8080" "$AI_SERVICE_URL/health" "./start-ai-service.sh"; then
        services_ok=$((services_ok + 1))
    fi
    
    if diagnose_service "Firebase UI" "4000" "$FIREBASE_UI_URL" "./start-firebase-emulators.sh"; then
        services_ok=$((services_ok + 1))
    fi
    
    if diagnose_service "Firestore Emulator" "8081" "$FIRESTORE_URL" "./start-firebase-emulators.sh"; then
        services_ok=$((services_ok + 1))
    fi
    
    # Résumé
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📊 Résumé du diagnostic${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    local success_rate=$(( (services_ok * 100) / total_services ))
    
    echo -e "\n${GREEN}✅ Services opérationnels: $services_ok/$total_services${NC}"
    echo -e "${YELLOW}📈 Taux de réussite: $success_rate%${NC}"
    
    if [ $success_rate -ge 75 ]; then
        echo -e "\n${GREEN}🎉 Environnement local opérationnel!${NC}"
        echo -e "${BLUE}🌐 Accédez à votre application: $FRONTEND_URL${NC}"
    else
        echo -e "\n${YELLOW}⚠️ Problèmes détectés${NC}"
        show_solutions
    fi
    
    echo -e "\n${GREEN}🎯 Diagnostic terminé!${NC}"
}

# Exécuter le diagnostic
main "$@"
