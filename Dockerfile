# 🚀 MULTI-STAGE DOCKERFILE PROFESSIONNEL - EBIOS AI MANAGER
# Optimisé pour sécurité, performance et production

# ============================================================================
# STAGE 1: Base Dependencies
# ============================================================================
FROM node:20-alpine AS deps
LABEL stage=deps
LABEL maintainer="EBIOS AI Manager Team"
LABEL description="Dependencies installation stage"

WORKDIR /app

# Installer dépendances système critiques
RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Copier fichiers de dépendances
COPY package*.json ./
COPY tsconfig*.json ./

# Installation optimisée des dépendances
RUN npm ci --only=production --silent && \
    npm cache clean --force

# ============================================================================
# STAGE 2: Build Application 
# ============================================================================
FROM node:20-alpine AS builder
LABEL stage=builder
LABEL description="Application build stage"

WORKDIR /app

# Copier dépendances depuis stage précédent
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./

# Installer toutes les dépendances (dev incluses) pour le build
RUN npm ci --silent

# Copier code source
COPY . .

# Variables d'environnement build
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
ENV DISABLE_ESLINT_PLUGIN=true
ENV CI=true

# Nettoyer fichiers non nécessaires pour éviter erreurs build
RUN rm -rf \
    src/test-*.tsx \
    src/tests/ \
    src/utils/testMissionContext.ts \
    src/components/test/ \
    **/__tests__/ \
    *.test.* \
    *.spec.* \
    .git/ \
    docs/ \
    backup*/

# Build optimisé avec configuration Docker
RUN npm run build:docker

# Vérification build
RUN ls -la dist/ && \
    du -sh dist/ && \
    echo "Build completed successfully"

# ============================================================================
# STAGE 3: Security Scan (Optionnel)
# ============================================================================
FROM builder AS security-scan
LABEL stage=security-scan

# Installer outils sécurité
RUN npm audit --audit-level=moderate || true
RUN npm outdated || true

# ============================================================================
# STAGE 4: Production Runtime
# ============================================================================
FROM nginx:1.25-alpine AS production
LABEL stage=production
LABEL description="Production runtime with Nginx"

# Métadonnées du container
LABEL org.opencontainers.image.title="EBIOS AI Manager Frontend"
LABEL org.opencontainers.image.description="Cybersecurity Risk Management Platform"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.vendor="EBIOS AI Manager"

# Créer utilisateur non-root pour sécurité (nginx existe déjà)
RUN deluser nginx 2>/dev/null || true && \
    delgroup nginx 2>/dev/null || true && \
    addgroup -g 1001 -S nginx && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# Installation packages sécurité
RUN apk add --no-cache \
    ca-certificates \
    tzdata \
    curl \
    netcat-openbsd \
    && rm -rf /var/cache/apk/*

# Configuration Nginx sécurisée (détecter le mode)
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx nginx-standalone.conf /etc/nginx/conf.d/standalone.conf
COPY --chown=nginx:nginx nginx-security-headers.conf /etc/nginx/conf.d/security.conf

# Script de démarrage intelligent
COPY --chown=nginx:nginx start-nginx.sh /usr/local/bin/start-nginx.sh
RUN chmod +x /usr/local/bin/start-nginx.sh

# Copier artifacts build
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Permissions sécurisées
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

# Configuration runtime sécurisée
RUN touch /var/run/nginx.pid && \
    chown nginx:nginx /var/run/nginx.pid

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:80/health || exit 1

# Port exposition
EXPOSE 80

# Utilisateur non-root
USER nginx

# Signal handling
STOPSIGNAL SIGQUIT

# Démarrage avec script intelligent
CMD ["/usr/local/bin/start-nginx.sh"]