#!/bin/bash

# 🔍 Script de vérification de l'installation EBIOS AI Manager
# Ce script vérifie que l'installation est correcte et fonctionnelle

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Variables globales
INSTALL_DIR="$PWD"
LOGFILE="verification_$(date +%Y%m%d_%H%M%S).log"
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Fonction de logging
log() {
    echo -e "$1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOGFILE"
}

# Fonction de vérification
check() {
    local test_name="$1"
    local test_command="$2"
    local is_critical="${3:-false}"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    log "${BLUE}🔍 Vérification $TOTAL_CHECKS: $test_name${NC}"
    
    if eval "$test_command" > /dev/null 2>&1; then
        log "${GREEN}✅ RÉUSSI${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        if [ "$is_critical" = "true" ]; then
            log "${RED}❌ ÉCHEC CRITIQUE${NC}"
        else
            log "${YELLOW}⚠️ ÉCHEC NON CRITIQUE${NC}"
        fi
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Fonction principale
main() {
    clear
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║                                                              ║${NC}"
    echo -e "${PURPLE}║        🔍 VÉRIFICATION INSTALLATION EBIOS AI MANAGER        ║${NC}"
    echo -e "${PURPLE}║                                                              ║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    log "${BLUE}🚀 Démarrage de la vérification${NC}"
    log "${BLUE}📝 Log de vérification: $LOGFILE${NC}"
    log "${BLUE}📁 Dossier d'installation: $INSTALL_DIR${NC}"
    
    # Section 1: Vérification des prérequis système
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📋 SECTION 1: Prérequis système${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    check "Node.js installé" "command -v node" true
    check "npm installé" "command -v npm" true
    check "Python installé" "command -v python3 || command -v python" true
    check "pip installé" "command -v pip3 || command -v pip" true
    check "Git installé" "command -v git" false
    
    # Vérification des versions
    if command -v node > /dev/null; then
        local node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        check "Node.js version >= 18" "[ $node_version -ge 18 ]" true
    fi
    
    if command -v python3 > /dev/null; then
        local python_version=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
        check "Python version >= 3.8" "python3 -c 'import sys; exit(0 if sys.version_info >= (3, 8) else 1)'" true
    fi
    
    # Section 2: Vérification des fichiers d'installation
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📁 SECTION 2: Fichiers d'installation${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    check "package.json présent" "[ -f package.json ]" true
    check "vite.config.ts présent" "[ -f vite.config.ts ]" true
    check "tsconfig.json présent" "[ -f tsconfig.json ]" true
    check "Dossier src présent" "[ -d src ]" true
    check "Dossier python-ai-service présent" "[ -d python-ai-service ]" true
    check "requirements Python présent" "[ -f python-ai-service/requirements-cloudrun.txt ]" true
    
    # Section 3: Vérification des dépendances
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📦 SECTION 3: Dépendances${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    check "node_modules installé" "[ -d node_modules ]" true
    check "Environnement virtuel Python" "[ -d python-ai-service/venv ]" true
    
    # Vérification des dépendances critiques
    if [ -d "node_modules" ]; then
        check "React installé" "[ -d node_modules/react ]" true
        check "Vite installé" "[ -d node_modules/vite ]" true
        check "TypeScript installé" "[ -d node_modules/typescript ]" true
        check "Firebase installé" "[ -d node_modules/firebase ]" false
    fi
    
    # Section 4: Vérification de la configuration
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}⚙️ SECTION 4: Configuration${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    check "Fichier .env.local présent" "[ -f .env.local ]" false
    check "Firebase.json présent" "[ -f firebase.json ]" false
    check "Scripts de démarrage présents" "[ -f start-ai-service.sh ] && [ -f start-frontend.sh ]" false
    
    # Section 5: Tests de build
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}🏗️ SECTION 5: Tests de build${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    log "${BLUE}Test de build en cours (peut prendre quelques minutes)...${NC}"
    check "Build frontend réussi" "npm run build" false
    
    # Section 6: Tests de connectivité
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}🌐 SECTION 6: Tests de connectivité${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    check "Connexion Internet" "ping -c 1 google.com" false
    check "Accès GitHub" "curl -s https://github.com" false
    check "Accès npm registry" "npm ping" false
    
    # Section 7: Vérification des permissions
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}🔐 SECTION 7: Permissions${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    check "Permissions lecture dossier" "[ -r . ]" true
    check "Permissions écriture dossier" "[ -w . ]" true
    check "Scripts exécutables" "[ -x start-ai-service.sh ] || [ ! -f start-ai-service.sh ]" false
    
    # Section 8: Résumé et recommandations
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}📊 RÉSUMÉ DE LA VÉRIFICATION${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    local success_rate=0
    if [ $TOTAL_CHECKS -gt 0 ]; then
        success_rate=$(( (PASSED_CHECKS * 100) / TOTAL_CHECKS ))
    fi
    
    echo ""
    echo -e "${GREEN}✅ Vérifications réussies: $PASSED_CHECKS${NC}"
    echo -e "${RED}❌ Vérifications échouées: $FAILED_CHECKS${NC}"
    echo -e "${BLUE}📊 Total des vérifications: $TOTAL_CHECKS${NC}"
    echo -e "${YELLOW}📈 Taux de réussite: $success_rate%${NC}"
    
    echo ""
    if [ $success_rate -ge 90 ]; then
        echo -e "${GREEN}🎉 EXCELLENT! Installation parfaitement opérationnelle${NC}"
        echo -e "${BLUE}🚀 Vous pouvez démarrer l'application avec: npm run dev${NC}"
    elif [ $success_rate -ge 75 ]; then
        echo -e "${YELLOW}👍 BON! Installation fonctionnelle avec quelques améliorations possibles${NC}"
        echo -e "${BLUE}🔧 Consultez les échecs non critiques ci-dessus${NC}"
    elif [ $success_rate -ge 50 ]; then
        echo -e "${YELLOW}⚠️ MOYEN! Plusieurs problèmes à résoudre${NC}"
        echo -e "${BLUE}🔧 Exécutez: ./diagnose-local-environment.sh${NC}"
    else
        echo -e "${RED}❌ PROBLÉMATIQUE! Installation incomplète${NC}"
        echo -e "${BLUE}🔧 Relancez l'installation avec l'installateur automatique${NC}"
    fi
    
    # Recommandations spécifiques
    echo ""
    echo -e "${BLUE}🔧 RECOMMANDATIONS:${NC}"
    
    if [ ! -f ".env.local" ]; then
        echo "   • Exécutez: ./setup-local-environment.sh"
    fi
    
    if [ ! -d "python-ai-service/venv" ]; then
        echo "   • Configurez l'environnement Python"
    fi
    
    if [ $FAILED_CHECKS -gt 0 ]; then
        echo "   • Consultez le log détaillé: $LOGFILE"
        echo "   • Utilisez le diagnostic: ./diagnose-local-environment.sh"
    fi
    
    echo ""
    echo -e "${BLUE}📞 SUPPORT:${NC}"
    echo "   • Guide de dépannage: TROUBLESHOOTING.md"
    echo "   • Issues GitHub: https://github.com/abk1969/Ebios_AI_manager/issues"
    echo "   • Documentation: README_RISK_MANAGERS.md"
    
    echo ""
    log "${GREEN}🎯 Vérification terminée!${NC}"
    log "${BLUE}📝 Rapport détaillé sauvegardé dans: $LOGFILE${NC}"
    
    # Code de sortie basé sur le taux de réussite
    if [ $success_rate -ge 75 ]; then
        exit 0
    else
        exit 1
    fi
}

# Vérifier si on est dans le bon dossier
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Ce script doit être exécuté depuis le dossier racine d'EBIOS AI Manager${NC}"
    echo -e "${YELLOW}🔧 Naviguez vers le dossier d'installation et relancez le script${NC}"
    exit 1
fi

# Exécuter la vérification
main "$@"
