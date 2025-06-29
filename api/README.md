# EBIOS RM API Backend

API Backend Node.js/Express pour l'application EBIOS Risk Management.

## 🚀 Démarrage rapide avec Docker

### Prérequis
- Docker Desktop installé et en cours d'exécution
- Docker Compose

### Lancement de l'application complète

1. **Cloner le projet et naviguer vers le répertoire racine :**
```bash
cd Ebios_AI_manager
```

2. **Construire et lancer tous les services :**
```bash
docker-compose up --build
```

3. **Accéder aux services :**
- Frontend : http://localhost:80
- API Backend : http://localhost:3000
- Base de données PostgreSQL : localhost:5432

### Services Docker

L'application est composée de 3 services :

#### 🌐 webapp (Frontend)
- **Port :** 80
- **Technologie :** React + Nginx
- **Build :** Dockerfile à la racine du projet

#### 🔧 api (Backend)
- **Port :** 3000
- **Technologie :** Node.js + Express
- **Build :** ./api/Dockerfile
- **Variables d'environnement :** Voir section Configuration

#### 🗄️ db (Base de données)
- **Port :** 5432
- **Technologie :** PostgreSQL 15
- **Initialisation :** ./api/init.sql

## 📋 API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `GET /api/auth/verify` - Vérification du token

### Missions
- `GET /api/missions` - Liste des missions
- `GET /api/missions/:id` - Détails d'une mission
- `POST /api/missions` - Créer une mission
- `PUT /api/missions/:id` - Modifier une mission
- `DELETE /api/missions/:id` - Supprimer une mission

### Ateliers
- `GET /api/workshops/templates` - Templates d'ateliers
- `GET /api/workshops/:missionId` - Ateliers d'une mission
- `PUT /api/workshops/:missionId/:workshopNumber` - Mettre à jour un atelier
- `POST /api/workshops/:missionId/:workshopNumber/suggestions` - Suggestions IA

### Agents IA
- `GET /api/agents` - Liste des agents
- `GET /api/agents/:id` - Détails d'un agent
- `POST /api/agents/:id/execute` - Exécuter un agent
- `GET /api/agents/:id/metrics` - Métriques d'un agent

### Monitoring
- `GET /api/monitoring/health` - Statut de santé
- `GET /api/monitoring/metrics` - Métriques système
- `GET /api/monitoring/alerts` - Alertes actives
- `POST /api/monitoring/alerts/:id/acknowledge` - Acquitter une alerte

### Rapports
- `GET /api/reports` - Liste des rapports
- `POST /api/reports/generate` - Générer un rapport
- `GET /api/reports/:id/status` - Statut de génération
- `GET /api/reports/:id/download` - Télécharger un rapport

## ⚙️ Configuration

### Variables d'environnement

Copiez le fichier `.env.example` vers `.env` et configurez les variables :

```bash
cp .env.example .env
```

#### Variables principales :
- `PORT` - Port du serveur (défaut: 3000)
- `NODE_ENV` - Environnement (development/production)
- `DB_HOST` - Hôte de la base de données
- `DB_PORT` - Port de la base de données
- `DB_NAME` - Nom de la base de données
- `DB_USER` - Utilisateur de la base de données
- `DB_PASSWORD` - Mot de passe de la base de données
- `JWT_SECRET` - Clé secrète pour les tokens JWT
- `FRONTEND_URL` - URL du frontend pour CORS

## 🛠️ Développement local

### Installation des dépendances
```bash
cd api
npm install
```

### Lancement en mode développement
```bash
npm run dev
```

### Tests
```bash
npm test
```

## 🗃️ Base de données

### Structure
La base de données PostgreSQL contient les tables suivantes :
- `users` - Utilisateurs
- `missions` - Missions EBIOS
- `workshops` - Ateliers
- `assets` - Biens essentiels
- `stakeholders` - Parties prenantes
- `feared_events` - Événements redoutés
- `strategic_scenarios` - Scénarios stratégiques
- `operational_scenarios` - Scénarios opérationnels
- `risk_treatments` - Traitements des risques
- `reports` - Rapports générés
- `audit_logs` - Logs d'audit
- `system_metrics` - Métriques système
- `alerts` - Alertes

### Initialisation
La base de données est automatiquement initialisée avec le script `init.sql` au premier démarrage.

### Utilisateur par défaut
- **Email :** admin@ebios.fr
- **Mot de passe :** admin123
- **Rôle :** admin

## 🔒 Sécurité

### Mesures implémentées :
- **Helmet** - Protection des en-têtes HTTP
- **CORS** - Configuration des origines autorisées
- **Rate Limiting** - Limitation du taux de requêtes
- **Input Validation** - Validation des données d'entrée
- **JWT Authentication** - Authentification par tokens
- **Password Hashing** - Hachage des mots de passe avec bcrypt
- **SQL Injection Protection** - Requêtes paramétrées

## 📊 Monitoring

### Métriques disponibles :
- Santé du système
- Utilisation CPU/Mémoire
- Statistiques de la base de données
- Performances des agents IA
- Logs d'audit
- Alertes en temps réel

## 🚀 Déploiement

### Production avec Docker

1. **Configurer les variables d'environnement de production**
2. **Construire les images :**
```bash
docker-compose -f docker-compose.prod.yml build
```

3. **Lancer en production :**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Commandes utiles

```bash
# Voir les logs
docker-compose logs -f api

# Redémarrer un service
docker-compose restart api

# Arrêter tous les services
docker-compose down

# Supprimer les volumes (attention: perte de données)
docker-compose down -v

# Reconstruire un service
docker-compose up --build api
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter l'équipe de développement
- Consulter la documentation complète