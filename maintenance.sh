#!/bin/bash

# 🔧 Script de maintenance EBIOS AI Manager
# Ce script effectue la maintenance automatique de l'installation

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Variables globales
LOGFILE="maintenance_$(date +%Y%m%d_%H%M%S).log"
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"

# Fonction de logging
log() {
    echo -e "$1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOGFILE"
}

# Fonction de sauvegarde
backup_files() {
    log "${BLUE}💾 Création d'une sauvegarde...${NC}"
    
    mkdir -p "$BACKUP_DIR"
    
    # Sauvegarder les fichiers de configuration
    [ -f ".env.local" ] && cp .env.local "$BACKUP_DIR/"
    [ -f "firebase.json" ] && cp firebase.json "$BACKUP_DIR/"
    [ -f "package.json" ] && cp package.json "$BACKUP_DIR/"
    [ -f "package-lock.json" ] && cp package-lock.json "$BACKUP_DIR/"
    
    # Sauvegarder les données utilisateur (si elles existent)
    [ -d "user-data" ] && cp -r user-data "$BACKUP_DIR/"
    [ -d "missions" ] && cp -r missions "$BACKUP_DIR/"
    
    log "${GREEN}✅ Sauvegarde créée dans: $BACKUP_DIR${NC}"
}

# Fonction de nettoyage
cleanup_files() {
    log "${BLUE}🧹 Nettoyage des fichiers temporaires...${NC}"
    
    # Nettoyer les caches
    [ -d "node_modules/.cache" ] && rm -rf node_modules/.cache
    [ -d ".vite" ] && rm -rf .vite
    [ -d "dist" ] && rm -rf dist
    
    # Nettoyer les logs anciens (plus de 30 jours)
    find . -name "*.log" -type f -mtime +30 -delete 2>/dev/null || true
    find . -name "backup_*" -type d -mtime +30 -exec rm -rf {} + 2>/dev/null || true
    
    # Nettoyer les fichiers temporaires Python
    find python-ai-service -name "*.pyc" -delete 2>/dev/null || true
    find python-ai-service -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
    
    log "${GREEN}✅ Nettoyage terminé${NC}"
}

# Fonction de mise à jour des dépendances
update_dependencies() {
    log "${BLUE}📦 Mise à jour des dépendances...${NC}"
    
    # Mise à jour des dépendances Node.js
    log "${YELLOW}Mise à jour des dépendances Node.js...${NC}"
    npm update
    
    # Audit de sécurité
    log "${YELLOW}Audit de sécurité npm...${NC}"
    npm audit fix --force || log "${YELLOW}⚠️ Certaines vulnérabilités n'ont pas pu être corrigées automatiquement${NC}"
    
    # Mise à jour des dépendances Python
    if [ -d "python-ai-service/venv" ]; then
        log "${YELLOW}Mise à jour des dépendances Python...${NC}"
        cd python-ai-service
        source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null || true
        pip install --upgrade pip
        pip install -r requirements-cloudrun.txt --upgrade
        cd ..
    fi
    
    log "${GREEN}✅ Dépendances mises à jour${NC}"
}

# Fonction de vérification de l'intégrité
check_integrity() {
    log "${BLUE}🔍 Vérification de l'intégrité...${NC}"
    
    # Vérifier les fichiers critiques
    local critical_files=(
        "package.json"
        "vite.config.ts"
        "src/main.tsx"
        "python-ai-service/app.py"
    )
    
    local missing_files=()
    for file in "${critical_files[@]}"; do
        if [ ! -f "$file" ]; then
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -gt 0 ]; then
        log "${RED}❌ Fichiers critiques manquants:${NC}"
        for file in "${missing_files[@]}"; do
            log "   • $file"
        done
        return 1
    fi
    
    # Test de build
    log "${YELLOW}Test de build...${NC}"
    if npm run build > /dev/null 2>&1; then
        log "${GREEN}✅ Build réussi${NC}"
    else
        log "${RED}❌ Échec du build${NC}"
        return 1
    fi
    
    log "${GREEN}✅ Intégrité vérifiée${NC}"
    return 0
}

# Fonction d'optimisation
optimize_installation() {
    log "${BLUE}⚡ Optimisation de l'installation...${NC}"
    
    # Optimiser les dépendances Node.js
    log "${YELLOW}Optimisation des dépendances Node.js...${NC}"
    npm prune
    npm dedupe
    
    # Nettoyer le cache npm
    npm cache clean --force
    
    # Optimiser l'environnement Python
    if [ -d "python-ai-service/venv" ]; then
        log "${YELLOW}Optimisation de l'environnement Python...${NC}"
        cd python-ai-service
        source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null || true
        pip cache purge 2>/dev/null || true
        cd ..
    fi
    
    log "${GREEN}✅ Optimisation terminée${NC}"
}

# Fonction de mise à jour du code
update_code() {
    log "${BLUE}🔄 Mise à jour du code source...${NC}"
    
    # Vérifier si on est dans un repository Git
    if [ -d ".git" ]; then
        # Sauvegarder les modifications locales
        git stash push -m "Maintenance backup $(date)" 2>/dev/null || true
        
        # Récupérer les dernières modifications
        git fetch origin
        
        # Vérifier s'il y a des mises à jour
        local local_commit=$(git rev-parse HEAD)
        local remote_commit=$(git rev-parse origin/main 2>/dev/null || git rev-parse origin/master 2>/dev/null)
        
        if [ "$local_commit" != "$remote_commit" ]; then
            log "${YELLOW}Nouvelles mises à jour disponibles${NC}"
            read -p "$(echo -e ${YELLOW}Voulez-vous mettre à jour le code ? ${NC}[y/N]: )" -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                git pull origin main 2>/dev/null || git pull origin master 2>/dev/null
                log "${GREEN}✅ Code mis à jour${NC}"
                
                # Réinstaller les dépendances si package.json a changé
                if git diff --name-only HEAD~1 HEAD | grep -q "package.json"; then
                    log "${YELLOW}package.json modifié, réinstallation des dépendances...${NC}"
                    npm install
                fi
            fi
        else
            log "${GREEN}✅ Code déjà à jour${NC}"
        fi
        
        # Restaurer les modifications locales si nécessaire
        git stash pop 2>/dev/null || true
    else
        log "${YELLOW}⚠️ Pas un repository Git, mise à jour manuelle nécessaire${NC}"
    fi
}

# Fonction de génération de rapport
generate_report() {
    log "${BLUE}📊 Génération du rapport de maintenance...${NC}"
    
    local report_file="maintenance_report_$(date +%Y%m%d_%H%M%S).md"
    
    cat > "$report_file" << EOF
# 🔧 Rapport de Maintenance EBIOS AI Manager

**Date:** $(date)
**Durée:** $((SECONDS / 60)) minutes

## 📊 Résumé

- ✅ Sauvegarde créée
- ✅ Nettoyage effectué
- ✅ Dépendances mises à jour
- ✅ Intégrité vérifiée
- ✅ Optimisation effectuée

## 📁 Fichiers

- **Log détaillé:** $LOGFILE
- **Sauvegarde:** $BACKUP_DIR
- **Rapport:** $report_file

## 📦 Versions

- **Node.js:** $(node --version 2>/dev/null || echo "Non installé")
- **npm:** $(npm --version 2>/dev/null || echo "Non installé")
- **Python:** $(python3 --version 2>/dev/null || python --version 2>/dev/null || echo "Non installé")

## 🔍 Vérifications

$(if [ -f "package.json" ]; then echo "- ✅ package.json présent"; else echo "- ❌ package.json manquant"; fi)
$(if [ -d "node_modules" ]; then echo "- ✅ node_modules présent"; else echo "- ❌ node_modules manquant"; fi)
$(if [ -d "python-ai-service/venv" ]; then echo "- ✅ Environnement Python présent"; else echo "- ❌ Environnement Python manquant"; fi)

## 🎯 Recommandations

- Effectuer une maintenance mensuelle
- Vérifier les mises à jour de sécurité
- Sauvegarder régulièrement les données utilisateur
- Surveiller les performances de l'application

---

*Rapport généré automatiquement par le script de maintenance EBIOS AI Manager*
EOF

    log "${GREEN}✅ Rapport généré: $report_file${NC}"
}

# Fonction principale
main() {
    clear
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║                                                              ║${NC}"
    echo -e "${PURPLE}║        🔧 MAINTENANCE EBIOS AI MANAGER                      ║${NC}"
    echo -e "${PURPLE}║                                                              ║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    log "${BLUE}🚀 Démarrage de la maintenance${NC}"
    log "${BLUE}📝 Log de maintenance: $LOGFILE${NC}"
    
    # Menu interactif
    echo -e "${YELLOW}Sélectionnez les opérations à effectuer:${NC}"
    echo "1. Maintenance complète (recommandé)"
    echo "2. Nettoyage uniquement"
    echo "3. Mise à jour des dépendances"
    echo "4. Vérification d'intégrité"
    echo "5. Optimisation"
    echo "6. Mise à jour du code"
    echo "7. Personnalisé"
    echo ""
    read -p "Votre choix [1-7]: " choice
    
    case $choice in
        1)
            log "${BLUE}🔧 Maintenance complète sélectionnée${NC}"
            backup_files
            cleanup_files
            update_dependencies
            check_integrity
            optimize_installation
            update_code
            generate_report
            ;;
        2)
            log "${BLUE}🧹 Nettoyage sélectionné${NC}"
            backup_files
            cleanup_files
            ;;
        3)
            log "${BLUE}📦 Mise à jour des dépendances sélectionnée${NC}"
            backup_files
            update_dependencies
            ;;
        4)
            log "${BLUE}🔍 Vérification d'intégrité sélectionnée${NC}"
            check_integrity
            ;;
        5)
            log "${BLUE}⚡ Optimisation sélectionnée${NC}"
            optimize_installation
            ;;
        6)
            log "${BLUE}🔄 Mise à jour du code sélectionnée${NC}"
            backup_files
            update_code
            ;;
        7)
            log "${BLUE}🎛️ Mode personnalisé${NC}"
            echo "Fonctionnalités disponibles:"
            echo "- backup: Sauvegarde"
            echo "- cleanup: Nettoyage"
            echo "- update-deps: Mise à jour dépendances"
            echo "- check: Vérification intégrité"
            echo "- optimize: Optimisation"
            echo "- update-code: Mise à jour code"
            echo ""
            read -p "Entrez les fonctions séparées par des espaces: " functions
            
            for func in $functions; do
                case $func in
                    backup) backup_files ;;
                    cleanup) cleanup_files ;;
                    update-deps) update_dependencies ;;
                    check) check_integrity ;;
                    optimize) optimize_installation ;;
                    update-code) update_code ;;
                    *) log "${YELLOW}⚠️ Fonction inconnue: $func${NC}" ;;
                esac
            done
            ;;
        *)
            log "${RED}❌ Choix invalide${NC}"
            exit 1
            ;;
    esac
    
    # Résumé final
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                              ║${NC}"
    echo -e "${GREEN}║        🎉 MAINTENANCE TERMINÉE AVEC SUCCÈS !                ║${NC}"
    echo -e "${GREEN}║                                                              ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    log "${GREEN}✅ Maintenance terminée en $((SECONDS / 60)) minutes${NC}"
    log "${BLUE}📝 Log détaillé: $LOGFILE${NC}"
    
    if [ -d "$BACKUP_DIR" ]; then
        log "${BLUE}💾 Sauvegarde: $BACKUP_DIR${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}🔧 Commandes utiles après maintenance:${NC}"
    echo "   • Vérifier l'installation: ./verify-installation.sh"
    echo "   • Démarrer l'application: npm run dev"
    echo "   • Tests complets: ./test-complete-local.sh"
    
    echo ""
    log "${GREEN}🎯 Maintenance terminée avec succès !${NC}"
}

# Vérifier si on est dans le bon dossier
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Ce script doit être exécuté depuis le dossier racine d'EBIOS AI Manager${NC}"
    echo -e "${YELLOW}🔧 Naviguez vers le dossier d'installation et relancez le script${NC}"
    exit 1
fi

# Exécuter la maintenance
main "$@"
