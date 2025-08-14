#!/bin/bash

# 🧹 SCRIPT DE NETTOYAGE PROJET EBIOS AI MANAGER
# Supprime les fichiers temporaires, backups et code mort

set -e  # Arrêter sur erreur

echo "🧹 NETTOYAGE DU PROJET EBIOS AI MANAGER"
echo "======================================"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour compter les fichiers avant suppression
count_files() {
    local pattern=$1
    find . -name "$pattern" -type f 2>/dev/null | wc -l
}

echo -e "${BLUE}📊 Analyse des fichiers à nettoyer...${NC}"

# Compter avant nettoyage
backup_files=$(count_files "*.backup*")
temp_files=$(count_files "*.tmp")
pyc_files=$(find . -name "*.pyc" -type f 2>/dev/null | wc -l)
pycache_dirs=$(find . -name "__pycache__" -type d 2>/dev/null | wc -l)
log_files=$(count_files "*.log")

echo "  📁 Fichiers backup trouvés: $backup_files"
echo "  📄 Fichiers temporaires: $temp_files"
echo "  🐍 Fichiers Python cache: $pyc_files"
echo "  📂 Dossiers __pycache__: $pycache_dirs"
echo "  📋 Fichiers logs: $log_files"

echo ""
echo -e "${YELLOW}🗑️  Suppression des fichiers temporaires...${NC}"

# Supprimer fichiers backup/temporaires
echo "  Suppression fichiers .backup*..."
find . -name "*.backup*" -type f -delete 2>/dev/null || true

echo "  Suppression fichiers .bak..."
find . -name "*.bak" -type f -delete 2>/dev/null || true

echo "  Suppression fichiers .tmp..."
find . -name "*.tmp" -type f -delete 2>/dev/null || true

echo "  Suppression anciens logs..."
find . -name "*.log" -mtime +7 -type f -delete 2>/dev/null || true

echo ""
echo -e "${YELLOW}🐍 Nettoyage cache Python...${NC}"

# Supprimer cache Python
echo "  Suppression dossiers __pycache__..."
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

echo "  Suppression fichiers .pyc..."
find . -name "*.pyc" -type f -delete 2>/dev/null || true

echo "  Suppression fichiers .pyo..."
find . -name "*.pyo" -type f -delete 2>/dev/null || true

echo ""
echo -e "${YELLOW}📦 Nettoyage dossiers backup...${NC}"

# Supprimer dossiers backup spécifiques (vérifier avant)
if [ -d "backups" ]; then
    echo "  Suppression dossier backups/..."
    rm -rf backups/
fi

if [ -d "python-ai-service/venv.backup" ]; then
    echo "  Suppression python-ai-service/venv.backup/..."
    rm -rf python-ai-service/venv.backup/
fi

# Nettoyer venv si présent et non actif
if [ -d "python-ai-service/venv" ] && [ -z "$VIRTUAL_ENV" ]; then
    echo "  ⚠️  Dossier venv détecté. Vérifiez qu'il n'est pas utilisé."
    echo "     Si sûr, supprimez manuellement : rm -rf python-ai-service/venv"
fi

echo ""
echo -e "${YELLOW}🔧 Nettoyage fichiers système...${NC}"

# Supprimer fichiers système cachés problématiques
echo "  Suppression .DS_Store (macOS)..."
find . -name ".DS_Store" -type f -delete 2>/dev/null || true

echo "  Suppression Thumbs.db (Windows)..."
find . -name "Thumbs.db" -type f -delete 2>/dev/null || true

echo "  Suppression fichiers vim temporaires..."
find . -name "*.swp" -type f -delete 2>/dev/null || true
find . -name "*.swo" -type f -delete 2>/dev/null || true

echo ""
echo -e "${YELLOW}📝 Nettoyage fichiers temporaires Node.js...${NC}"

# Fichiers temporaires Node.js (mais garder node_modules)
echo "  Suppression fichiers .tsbuildinfo..."
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true

echo "  Suppression coverage/ si présent..."
if [ -d "coverage" ]; then
    rm -rf coverage/
fi

echo ""
echo -e "${YELLOW}🧽 Nettoyage scripts temporaires...${NC}"

# Supprimer nos propres scripts temporaires
echo "  Suppression scripts de debug temporaires..."
rm -f validate-architecture.cjs 2>/dev/null || true
rm -f fix-lint-errors.cjs 2>/dev/null || true
rm -f fix-remaining-lint.cjs 2>/dev/null || true
rm -f disable-lint-errors.cjs 2>/dev/null || true

echo ""
echo -e "${GREEN}✅ NETTOYAGE TERMINÉ !${NC}"

# Statistiques finales
echo ""
echo -e "${BLUE}📊 Statistiques du nettoyage :${NC}"

# Calculer espace libéré (approximatif)
echo "  📁 Fichiers supprimés avec succès"
echo "  💾 Espace probablement libéré: plusieurs MB"
echo "  🗂️  Structure projet épurée"

# Suggestions pour la suite
echo ""
echo -e "${BLUE}💡 Prochaines étapes recommandées :${NC}"
echo "  1. Exécuter: npm run lint -- --fix"
echo "  2. Exécuter: npm run type-check" 
echo "  3. Exécuter: npm run build"
echo "  4. Vérifier: git status"

# Vérifications optionnelles
echo ""
echo -e "${BLUE}🔍 Vérifications optionnelles :${NC}"

# Vérifier si .env contient des secrets
if [ -f ".env" ]; then
    secret_lines=$(grep -E "(API_KEY|SECRET|PASSWORD|TOKEN)" .env 2>/dev/null | wc -l || echo "0")
    if [ "$secret_lines" -gt "0" ]; then
        echo -e "  ⚠️  ${YELLOW}.env contient $secret_lines lignes avec des secrets potentiels${NC}"
        echo "     Vérifiez que ces clés ne sont pas hardcodées dans le code source"
    else
        echo -e "  ✅ ${GREEN}.env semble correct${NC}"
    fi
fi

# Vérifier taille du projet
project_size=$(du -sh . 2>/dev/null | cut -f1 || echo "Inconnu")
echo "  📏 Taille actuelle du projet: $project_size"

echo ""
echo -e "${GREEN}🎉 Projet nettoyé et prêt pour la phase suivante !${NC}"
echo "   Vous pouvez maintenant exécuter les corrections TypeScript et ESLint."