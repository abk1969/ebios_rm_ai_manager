# 🚀 EBIOS Risk Manager - Guide de Déploiement

## Vue d'ensemble

EBIOS Risk Manager est une application complète de gestion des risques selon la méthodologie EBIOS RM de l'ANSSI, intégrant une intelligence artificielle avancée pour assister les analystes.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Node.js   │    │  Python AI      │
│   (React/Vite)  │────│   (Express)     │────│   Service       │
│   Port: 80      │    │   Port: 3000    │    │   Port: 8081    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    │   Port: 5432    │
                    └─────────────────┘
```

## Prérequis

- Docker & Docker Compose
- Git
- 4GB+ de RAM disponible
- 10GB+ d'espace disque libre

## Démarrage Rapide

### 1. Cloner le repository
```bash
git clone https://github.com/votre-org/ebios-ai-manager.git
cd ebios-ai-manager
```

### 2. Démarrer l'application
```bash
# Option 1: Script automatique (recommandé)
bash start-dev.sh

# Option 2: Manuel
docker-compose up -d --build
```

### 3. Accéder à l'application
- Frontend: http://localhost:80
- API: http://localhost:3000
- Service AI: http://localhost:8081
- Base de données: localhost:5432

## Structure du Projet

```
ebios-ai-manager/
├── api/                    # API Node.js/Express
│   ├── routes/            # Routes API
│   ├── services/          # Services métier
│   ├── init.sql          # Schéma base de données
│   └── Dockerfile        # Image Docker API
├── python-ai-service/     # Service Intelligence Artificielle
│   ├── models/           # Modèles de données
│   ├── services/         # Services IA
│   ├── config/           # Configuration
│   ├── requirements-minimal.txt  # Dépendances optimisées
│   └── Dockerfile        # Image Docker avec UV
├── src/                   # Frontend React/TypeScript
│   ├── components/       # Composants React
│   ├── services/        # Services frontend
│   └── types/           # Types TypeScript
├── docker-compose.yml    # Orchestration des services
└── README-DEPLOYMENT.md # Ce fichier
```

## Configuration

### Variables d'environnement

#### Base de données
```env
DB_HOST=db
DB_PORT=5432
DB_NAME=ebios
DB_USER=postgres
DB_PASSWORD=postgres
```

#### API Node.js
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:80
PYTHON_AI_SERVICE_URL=http://python-ai:8081
```

#### Service Python AI
```env
PORT=8081
FLASK_ENV=development
```

## Tests et Validation

### Tester tous les services
```bash
bash test-services.sh
```

### Tester individuellement
```bash
# Base de données
docker-compose exec db psql -U postgres -d ebios -c "SELECT version();"

# API
curl http://localhost:3000/health

# Service AI
curl http://localhost:8081/health

# Frontend
curl http://localhost:80
```

## Gestion des services

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f python-ai
```

### Redémarrer un service
```bash
docker-compose restart python-ai
```

### Reconstruire et redémarrer
```bash
docker-compose up -d --build python-ai
```

### Arrêter l'application
```bash
docker-compose down
```

### Nettoyage complet
```bash
docker-compose down --volumes --remove-orphans
docker system prune -f
```

## Optimisations de Performance

### 1. Construction avec UV (Python)
Le service Python utilise `uv` pour une installation ultra-rapide des dépendances:
- 10-100x plus rapide que pip
- Résolution de dépendances parallèle
- Cache intelligent

### 2. Images Docker optimisées
- Images multi-stage pour réduire la taille
- Layers cachés pour les dépendances
- Images slim pour réduire l'empreinte

### 3. Dépendances minimales
- Fichier `requirements-minimal.txt` optimisé
- Seulement les dépendances essentielles
- Pas de frameworks ML lourds en développement

## Déploiement en Production

### 1. Variables d'environnement de production
```env
NODE_ENV=production
FLASK_ENV=production
DB_PASSWORD=<mot-de-passe-fort>
JWT_SECRET=<clé-secrète-forte>
```

### 2. Configuration SSL/HTTPS
Modifier `nginx.conf` ou utiliser un reverse proxy.

### 3. Monitoring
- Logs centralisés avec ELK/Loki
- Métriques avec Prometheus
- Alerting avec AlertManager

## Résolution de problèmes

### Service Python AI ne démarre pas
```bash
# Vérifier les logs
docker-compose logs python-ai

# Reconstruire l'image
docker-compose build --no-cache python-ai
```

### Base de données non accessible
```bash
# Vérifier l'état
docker-compose ps db

# Réinitialiser la base
docker-compose down -v
docker-compose up -d db
```

### Frontend ne se charge pas
```bash
# Vérifier les variables d'environnement
docker-compose exec webapp env | grep REACT_APP
```

## Développement

### Structure des commits
```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactorisation
test: ajout de tests
chore: maintenance
```

### Workflow de développement
1. `git checkout -b feature/nouvelle-fonctionnalite`
2. Développement et tests
3. `bash test-services.sh` pour valider
4. `git commit -m "feat: description"`
5. `git push origin feature/nouvelle-fonctionnalite`
6. Créer une Pull Request

## Support

- 📚 Documentation: `/docs`
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions
- 📧 Contact: support@votre-org.com

---
*Généré avec ❤️ pour la sécurité des systèmes d'information*