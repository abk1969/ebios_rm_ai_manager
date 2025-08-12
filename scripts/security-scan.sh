#!/bin/bash

# 🔒 SCRIPT DE SCAN SÉCURITÉ - EBIOS AI MANAGER
# Recherche et identification des vulnérabilités de sécurité

set -e

echo "🔒 SCAN DE SÉCURITÉ EBIOS AI MANAGER"
echo "=================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
total_issues=0
critical_issues=0
warning_issues=0

echo -e "${BLUE}🔍 Recherche de clés API hardcodées...${NC}"

# Recherche clés Google/Firebase
google_keys=$(grep -r "AIzaSy" src/ 2>/dev/null | wc -l || echo "0")
if [ "$google_keys" -gt "0" ]; then
    echo -e "  ${RED}❌ $google_keys clés Google API trouvées${NC}"
    grep -r "AIzaSy" src/ --color=always || true
    critical_issues=$((critical_issues + google_keys))
    total_issues=$((total_issues + google_keys))
else
    echo -e "  ${GREEN}✅ Aucune clé Google API hardcodée trouvée${NC}"
fi

# Recherche clés OpenAI
openai_keys=$(grep -r "sk-" src/ 2>/dev/null | grep -v "risk-" | wc -l || echo "0")
if [ "$openai_keys" -gt "0" ]; then
    echo -e "  ${RED}❌ $openai_keys clés OpenAI trouvées${NC}"
    grep -r "sk-" src/ --color=always | grep -v "risk-" || true
    critical_issues=$((critical_issues + openai_keys))
    total_issues=$((total_issues + openai_keys))
else
    echo -e "  ${GREEN}✅ Aucune clé OpenAI hardcodée trouvée${NC}"
fi

# Recherche JWT secrets
jwt_secrets=$(grep -r "jwt.*=" src/ 2>/dev/null | grep -E "(secret|key)" | grep -v "import.meta.env" | wc -l || echo "0")
if [ "$jwt_secrets" -gt "0" ]; then
    echo -e "  ${RED}❌ $jwt_secrets secrets JWT hardcodés trouvés${NC}"
    grep -r "jwt.*=" src/ --color=always | grep -E "(secret|key)" | grep -v "import.meta.env" || true
    critical_issues=$((critical_issues + jwt_secrets))
    total_issues=$((total_issues + jwt_secrets))
else
    echo -e "  ${GREEN}✅ Aucun secret JWT hardcodé trouvé${NC}"
fi

echo ""
echo -e "${BLUE}🛡️ Scan des vulnérabilités de sécurité...${NC}"

# Vérification audit npm
npm audit --audit-level=high > /tmp/npm_audit.txt 2>&1
if [ $? -eq 0 ]; then
    echo -e "  ${GREEN}✅ Aucune vulnérabilité critique trouvée${NC}"
else
    vulnerabilities=$(cat /tmp/npm_audit.txt | grep -E "(critical|high)" | wc -l || echo "0")
    if [ "$vulnerabilities" -gt "0" ]; then
        echo -e "  ${RED}❌ $vulnerabilities vulnérabilités critiques/élevées trouvées${NC}"
        cat /tmp/npm_audit.txt
        critical_issues=$((critical_issues + vulnerabilities))
        total_issues=$((total_issues + vulnerabilities))
    fi
fi

echo ""
echo -e "${BLUE}🔍 Recherche de patterns suspects...${NC}"

# Recherche console.log en production
console_logs=$(find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs grep -l "console\." 2>/dev/null | wc -l || echo "0")
if [ "$console_logs" -gt "20" ]; then
    echo -e "  ${YELLOW}⚠️ $console_logs fichiers avec console.log (nettoyage recommandé)${NC}"
    warning_issues=$((warning_issues + 1))
    total_issues=$((total_issues + 1))
else
    echo -e "  ${GREEN}✅ Nombre acceptable de console.log${NC}"
fi

# Recherche TODO/FIXME
todos=$(find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs grep -i -E "(TODO|FIXME|XXX|HACK)" 2>/dev/null | wc -l || echo "0")
if [ "$todos" -gt "0" ]; then
    echo -e "  ${YELLOW}⚠️ $todos TODO/FIXME trouvés${NC}"
    warning_issues=$((warning_issues + 1))
    total_issues=$((total_issues + 1))
else
    echo -e "  ${GREEN}✅ Aucun TODO/FIXME trouvé${NC}"
fi

# Recherche mots de passe en dur
passwords=$(grep -r -i -E "(password|pwd|secret).*=.*['\"][^'\"]{8,}" src/ 2>/dev/null | grep -v "import.meta.env" | wc -l || echo "0")
if [ "$passwords" -gt "0" ]; then
    echo -e "  ${RED}❌ $passwords mots de passe potentiels hardcodés${NC}"
    grep -r -i -E "(password|pwd|secret).*=.*['\"][^'\"]{8,}" src/ --color=always | grep -v "import.meta.env" || true
    critical_issues=$((critical_issues + passwords))
    total_issues=$((total_issues + passwords))
else
    echo -e "  ${GREEN}✅ Aucun mot de passe hardcodé trouvé${NC}"
fi

echo ""
echo -e "${BLUE}📁 Vérification des fichiers sensibles...${NC}"

# Vérification .env
if [ -f ".env" ]; then
    echo -e "  ${YELLOW}⚠️ Fichier .env présent (vérifiez qu'il n'est pas committé)${NC}"
    
    # Vérifier si .env est dans .gitignore
    if grep -q "^\.env$" .gitignore 2>/dev/null; then
        echo -e "    ${GREEN}✅ .env est dans .gitignore${NC}"
    else
        echo -e "    ${RED}❌ .env n'est PAS dans .gitignore${NC}"
        critical_issues=$((critical_issues + 1))
        total_issues=$((total_issues + 1))
    fi
    
    # Compter les clés dans .env
    env_keys=$(grep -E "API_KEY|SECRET|TOKEN|PASSWORD" .env 2>/dev/null | wc -l || echo "0")
    echo -e "    ${BLUE}ℹ️ $env_keys clés/secrets dans .env${NC}"
else
    echo -e "  ${YELLOW}⚠️ Fichier .env manquant (peut causer des erreurs)${NC}"
fi

# Vérification .env.example
if [ -f ".env.example" ]; then
    echo -e "  ${GREEN}✅ Fichier .env.example présent${NC}"
    
    # Vérifier qu'il ne contient pas de vraies clés
    real_keys=$(grep -E "AIzaSy|sk-" .env.example 2>/dev/null | wc -l || echo "0")
    if [ "$real_keys" -gt "0" ]; then
        echo -e "    ${RED}❌ .env.example contient de vraies clés API${NC}"
        critical_issues=$((critical_issues + 1))
        total_issues=$((total_issues + 1))
    else
        echo -e "    ${GREEN}✅ .env.example ne contient que des placeholders${NC}"
    fi
else
    echo -e "  ${YELLOW}⚠️ Fichier .env.example manquant${NC}"
    warning_issues=$((warning_issues + 1))
    total_issues=$((total_issues + 1))
fi

# Vérification firebase-credentials.json
if [ -f "firebase-credentials.json" ]; then
    echo -e "  ${RED}❌ Fichier firebase-credentials.json présent (ne doit PAS être committé)${NC}"
    critical_issues=$((critical_issues + 1))
    total_issues=$((total_issues + 1))
    
    if grep -q "firebase-credentials.json" .gitignore 2>/dev/null; then
        echo -e "    ${GREEN}✅ firebase-credentials.json est dans .gitignore${NC}"
    else
        echo -e "    ${RED}❌ firebase-credentials.json n'est PAS dans .gitignore${NC}"
        critical_issues=$((critical_issues + 1))
        total_issues=$((total_issues + 1))
    fi
else
    echo -e "  ${GREEN}✅ Aucun fichier de credentials Firebase trouvé${NC}"
fi

echo ""
echo -e "${BLUE}🔒 Vérification des headers de sécurité...${NC}"

# Vérifier la configuration helmet
if grep -r "helmet" src/ >/dev/null 2>&1; then
    echo -e "  ${GREEN}✅ Configuration Helmet trouvée${NC}"
else
    echo -e "  ${YELLOW}⚠️ Configuration Helmet manquante${NC}"
    warning_issues=$((warning_issues + 1))
    total_issues=$((total_issues + 1))
fi

# Vérifier CORS configuration
if grep -r "cors" src/ >/dev/null 2>&1; then
    echo -e "  ${GREEN}✅ Configuration CORS trouvée${NC}"
else
    echo -e "  ${YELLOW}⚠️ Configuration CORS manquante${NC}"
    warning_issues=$((warning_issues + 1))
    total_issues=$((total_issues + 1))
fi

echo ""
echo -e "${BLUE}📊 RÉSUMÉ DU SCAN DE SÉCURITÉ${NC}"
echo "========================="

if [ "$critical_issues" -gt "0" ]; then
    echo -e "${RED}🚨 CRITIQUE: $critical_issues problèmes critiques détectés${NC}"
    echo -e "${RED}   ⚠️ PUBLICATION BLOQUÉE - Corrigez avant de publier${NC}"
fi

if [ "$warning_issues" -gt "0" ]; then
    echo -e "${YELLOW}⚠️ AVERTISSEMENT: $warning_issues problèmes de qualité détectés${NC}"
fi

if [ "$total_issues" -eq "0" ]; then
    echo -e "${GREEN}✅ EXCELLENT: Aucun problème de sécurité critique détecté${NC}"
    echo -e "${GREEN}   🚀 Prêt pour la publication${NC}"
else
    echo -e "${BLUE}📋 Total: $total_issues problèmes trouvés${NC}"
    echo -e "   🔴 Critiques: $critical_issues"
    echo -e "   🟡 Avertissements: $warning_issues"
fi

echo ""
echo -e "${BLUE}💡 RECOMMANDATIONS${NC}"
echo "=================="

if [ "$critical_issues" -gt "0" ]; then
    echo "1. 🔒 Déplacez toutes les clés API vers des variables d'environnement"
    echo "2. 🛡️ Corrigez toutes les vulnérabilités npm avec 'npm audit fix'"
    echo "3. 🔐 Vérifiez que .env est dans .gitignore"
    echo "4. 🧹 Supprimez tout fichier de credentials hardcodé"
fi

if [ "$warning_issues" -gt "0" ]; then
    echo "5. 🧽 Nettoyez les console.log en production"
    echo "6. 📝 Résolvez les TODO/FIXME avant publication"
    echo "7. 📋 Créez un fichier .env.example si manquant"
    echo "8. 🛡️ Ajoutez les headers de sécurité manquants"
fi

echo ""
echo -e "${GREEN}🎯 Pour corriger automatiquement certains problèmes :${NC}"
echo "   npm audit fix                    # Corriger vulnérabilités"
echo "   ./scripts/cleanup-project.sh     # Nettoyage général"
echo "   ./scripts/fix-hardcoded-keys.sh  # Corriger clés hardcodées"

# Code de sortie
if [ "$critical_issues" -gt "0" ]; then
    exit 1
else
    exit 0
fi