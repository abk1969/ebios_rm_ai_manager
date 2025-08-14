#!/bin/bash
# Script de test pour vérifier tous les services EBIOS

echo "🧪 Test des services EBIOS RM"
echo "============================="

# Test de la base de données
echo "🔍 Test PostgreSQL..."
if curl -f http://localhost:5432 2>/dev/null; then
    echo "✅ PostgreSQL est accessible"
else
    echo "❌ PostgreSQL n'est pas accessible"
fi

# Test de l'API Node.js
echo "🔍 Test API Node.js..."
if curl -f http://localhost:3000/health 2>/dev/null; then
    echo "✅ API Node.js fonctionne"
else
    echo "❌ API Node.js n'est pas accessible"
fi

# Test du service Python AI
echo "🔍 Test Python AI Service..."
if curl -f http://localhost:8081/health 2>/dev/null; then
    echo "✅ Service Python AI fonctionne"
else
    echo "❌ Service Python AI n'est pas accessible"
fi

# Test du frontend
echo "🔍 Test Frontend..."
if curl -f http://localhost:80 2>/dev/null; then
    echo "✅ Frontend accessible"
else
    echo "❌ Frontend n'est pas accessible"
fi

echo ""
echo "📊 Statut des conteneurs Docker:"
docker-compose ps

echo ""
echo "📝 Logs récents (dernières 20 lignes):"
docker-compose logs --tail=20