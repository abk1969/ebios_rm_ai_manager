#!/bin/bash
# Script de validation complète avant déploiement

echo "🔍 VALIDATION COMPLÈTE EBIOS RM"
echo "==============================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Fonction de test
test_endpoint() {
    local url=$1
    local name=$2
    local timeout=${3:-10}
    
    if curl -f -s --max-time $timeout "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $name${NC}"
        return 0
    else
        echo -e "${RED}❌ $name${NC}"
        ((ERRORS++))
        return 1
    fi
}

# Fonction de warning
warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

# Fonction d'information
info() {
    echo -e "ℹ️  $1"
}

echo ""
echo "🔧 1. Vérification de l'environnement Docker"
echo "=============================================="

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ Docker disponible${NC}"
    docker --version
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose n'est pas installé${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✅ Docker Compose disponible${NC}"
    docker-compose --version
fi

echo ""
echo "🏗️  2. Vérification des images Docker"
echo "====================================="

images=("ebios_ai_manager-webapp" "ebios_ai_manager-api" "ebios_ai_manager-python-ai")
for image in "${images[@]}"; do
    if docker images | grep -q "$image"; then
        echo -e "${GREEN}✅ Image $image existe${NC}"
    else
        warn "Image $image n'existe pas - sera construite au démarrage"
    fi
done

echo ""
echo "📊 3. Statut des conteneurs"
echo "==========================="

docker-compose ps

echo ""
echo "🌐 4. Test des endpoints"
echo "========================"

# Attendre que les services soient prêts
info "Attente du démarrage des services (30s)..."
sleep 30

# Test des endpoints
test_endpoint "http://localhost:80" "Frontend (Port 80)"
test_endpoint "http://localhost:3000/health" "API Node.js (Port 3000)" 5
test_endpoint "http://localhost:8081/health" "Service Python AI (Port 8081)" 5

# Test de connectivité base de données (indirect)
if nc -z localhost 5432 2>/dev/null; then
    echo -e "${GREEN}✅ PostgreSQL accessible (Port 5432)${NC}"
else
    echo -e "${RED}❌ PostgreSQL non accessible${NC}"
    ((ERRORS++))
fi

echo ""
echo "🔍 5. Vérification des logs"
echo "==========================="

info "Vérification des erreurs dans les logs..."

# Vérifier les erreurs critiques dans les logs
if docker-compose logs --tail=100 | grep -i "error\|exception\|failed" | grep -v "test" > /dev/null; then
    warn "Des erreurs détectées dans les logs (voir ci-dessous)"
    docker-compose logs --tail=20 | grep -i "error\|exception\|failed" | grep -v "test"
else
    echo -e "${GREEN}✅ Aucune erreur critique dans les logs${NC}"
fi

echo ""
echo "📁 6. Vérification des fichiers critiques"
echo "========================================="

critical_files=(
    "docker-compose.yml"
    "api/package.json"
    "python-ai-service/requirements-minimal.txt"
    "src/App.tsx"
    "README-DEPLOYMENT.md"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file manquant${NC}"
        ((ERRORS++))
    fi
done

echo ""
echo "🔒 7. Vérification de sécurité basique"
echo "======================================"

# Vérifier les mots de passe par défaut
if grep -r "postgres:postgres" docker-compose.yml > /dev/null; then
    warn "Mot de passe PostgreSQL par défaut détecté (OK en développement)"
fi

if grep -r "your-super-secret-jwt-key" docker-compose.yml > /dev/null; then
    warn "Clé JWT par défaut détectée (OK en développement)"
fi

echo ""
echo "🚀 8. Test de performance basique"
echo "================================="

# Test de temps de réponse
response_time=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:80 2>/dev/null || echo "0")
if (( $(echo "$response_time < 5.0" | bc -l) )); then
    echo -e "${GREEN}✅ Frontend responsive (${response_time}s)${NC}"
else
    warn "Frontend lent (${response_time}s)"
fi

echo ""
echo "📊 RÉSUMÉ DE LA VALIDATION"
echo "=========================="

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 VALIDATION RÉUSSIE !${NC}"
    echo "✅ Aucune erreur critique détectée"
    
    if [ $WARNINGS -eq 0 ]; then
        echo "✅ Aucun avertissement"
        echo -e "${GREEN}🚀 Prêt pour le déploiement !${NC}"
    else
        echo -e "${YELLOW}⚠️  $WARNINGS avertissement(s) - Vérifiez avant déploiement${NC}"
    fi
else
    echo -e "${RED}❌ VALIDATION ÉCHOUÉE${NC}"
    echo -e "${RED}$ERRORS erreur(s) critique(s) détectée(s)${NC}"
    echo -e "${YELLOW}$WARNINGS avertissement(s)${NC}"
    echo ""
    echo "🔧 Actions recommandées :"
    echo "- Vérifiez les logs avec : docker-compose logs"
    echo "- Redémarrez les services : docker-compose restart"
    echo "- Reconstruisez si nécessaire : docker-compose up -d --build"
fi

echo ""
echo "📚 Commandes utiles :"
echo "- Voir tous les logs : docker-compose logs -f"
echo "- Redémarrer : docker-compose restart"
echo "- Arrêter : docker-compose down"
echo "- Status : docker-compose ps"

exit $ERRORS