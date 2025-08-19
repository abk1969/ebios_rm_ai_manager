#!/bin/sh
# Détecter si on est en mode standalone ou avec docker-compose
echo "🔍 Détection du mode d'exécution..."

# Attendre jusqu'à 30 secondes pour que l'API soit disponible
api_available=false
for i in $(seq 1 30); do
    if nc -z api 3000 2>/dev/null; then
        api_available=true
        break
    fi
    echo "⏳ Tentative $i/30 - API non disponible, attente..."
    sleep 1
done

if [ "$api_available" = true ]; then
    echo "🔧 Mode docker-compose détecté - API accessible sur api:3000"
    echo "📋 Utilisation de nginx.conf standard avec proxy vers API"
else
    echo "🔧 Mode standalone détecté - API non accessible"  
    echo "📋 Utilisation de nginx-standalone.conf avec mock API"
    cp /etc/nginx/conf.d/standalone.conf /etc/nginx/conf.d/default.conf
fi

# Tester la configuration
nginx -t

# Démarrer nginx
exec nginx -g "daemon off;"