# 🚀 Guide de Déploiement EBIOS AI Manager sur GCP

Ce guide vous accompagne dans le déploiement de l'application EBIOS AI Manager sur Google Cloud Platform.

## 📋 Prérequis

### Outils requis
- [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Docker](https://docs.docker.com/get-docker/)
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)

### Comptes requis
- Compte Google Cloud Platform avec facturation activée
- Projet Firebase configuré
- Accès administrateur au repository GitHub

## 🛠️ Configuration initiale

### 1. Configuration de l'environnement GCP

```bash
# Exécuter le script de configuration
./scripts/setup-gcp-env.sh
```

Ce script va :
- Créer le fichier `.env.gcp` avec votre configuration
- Configurer l'authentification GCP
- Initialiser Firebase
- Créer un compte de service pour le déploiement

### 2. Configuration Firebase

Après avoir exécuté le script, mettez à jour `.env.gcp` avec vos clés Firebase :

```bash
# Récupérer la configuration Firebase
firebase setup:web
```

### 3. Configuration des secrets GitHub

Ajoutez ces secrets dans votre repository GitHub (Settings > Secrets and variables > Actions) :

```
GCP_PROJECT_ID=votre-project-id
GCP_SA_KEY=contenu-du-fichier-gcp-service-account-key.json
FIREBASE_TOKEN=token-firebase-ci
FIREBASE_PROJECT_ID=votre-project-id
FIREBASE_SERVICE_ACCOUNT=contenu-du-service-account-firebase
SNYK_TOKEN=votre-token-snyk (optionnel)
```

## 🚀 Déploiement

### Déploiement automatique (Recommandé)

Le déploiement se fait automatiquement via GitHub Actions :

1. **Push sur `main`** → Déploiement en production
2. **Push sur `develop`** → Déploiement en staging
3. **Pull Request** → Tests automatiques

### Déploiement manuel

```bash
# Charger les variables d'environnement
source .env.gcp

# Exécuter le script de déploiement
./scripts/deploy-gcp.sh
```

## 🏗️ Architecture déployée

### Services GCP utilisés

- **Firebase Hosting** : Frontend React/TypeScript
- **Cloud Run** : Service Python AI (backend)
- **Firestore** : Base de données NoSQL
- **Cloud Build** : Construction des images Docker
- **Container Registry** : Stockage des images

### URLs de l'application

- **Frontend** : `https://votre-project-id.web.app`
- **AI Service** : `https://ebios-ai-service-xxx-europe-west1.a.run.app`
- **Console Firebase** : `https://console.firebase.google.com/project/votre-project-id`

## 🔧 Configuration post-déploiement

### 1. Vérification des services

```bash
# Vérifier le statut de Cloud Run
gcloud run services list --region=europe-west1

# Vérifier Firebase Hosting
firebase hosting:sites:list

# Tester l'API AI
curl https://votre-ai-service-url/health
```

### 2. Configuration des domaines personnalisés

```bash
# Ajouter un domaine personnalisé à Firebase Hosting
firebase hosting:sites:create votre-domaine.com
firebase target:apply hosting production votre-domaine.com
```

### 3. Monitoring et alertes

- Configurez Cloud Monitoring pour surveiller les performances
- Activez les alertes pour les erreurs et la latence
- Configurez les logs structurés

## 🔒 Sécurité

### Bonnes pratiques appliquées

- **HTTPS obligatoire** sur tous les services
- **Headers de sécurité** configurés (CSP, HSTS, etc.)
- **Authentification Firebase** pour l'accès utilisateur
- **Service accounts** avec permissions minimales
- **Chiffrement** des données sensibles
- **Audit trail** pour toutes les actions

### Configuration des règles Firestore

Les règles de sécurité Firestore sont automatiquement déployées :

```javascript
// Exemple de règle
match /missions/{missionId} {
  allow read, write: if request.auth != null 
    && request.auth.uid == resource.data.userId;
}
```

## 📊 Monitoring et maintenance

### Dashboards disponibles

- **Cloud Console** : Métriques générales GCP
- **Firebase Console** : Analytics et performance
- **GitHub Actions** : Statut des déploiements

### Logs et debugging

```bash
# Logs Cloud Run
gcloud logs read "resource.type=cloud_run_revision" --limit=50

# Logs Firebase Functions
firebase functions:log

# Monitoring en temps réel
gcloud logging tail "resource.type=cloud_run_revision"
```

## 🆘 Dépannage

### Problèmes courants

1. **Erreur de build Docker**
   ```bash
   # Vérifier les logs de Cloud Build
   gcloud builds list --limit=5
   ```

2. **Erreur de déploiement Firebase**
   ```bash
   # Vérifier les permissions
   firebase projects:list
   ```

3. **Service Cloud Run inaccessible**
   ```bash
   # Vérifier les permissions IAM
   gcloud run services get-iam-policy ebios-ai-service --region=europe-west1
   ```

### Support

- 📧 Email : support@ebios-ai-manager.com
- 📚 Documentation : [Wiki du projet](https://github.com/abk1969/Ebios_AI_manager/wiki)
- 🐛 Issues : [GitHub Issues](https://github.com/abk1969/Ebios_AI_manager/issues)

## 🔄 Mise à jour

Pour mettre à jour l'application :

1. Mergez vos changements dans `main`
2. Le déploiement se fait automatiquement via GitHub Actions
3. Vérifiez le statut dans l'onglet "Actions" de GitHub

---

**🎉 Félicitations ! Votre application EBIOS AI Manager est maintenant déployée sur GCP !**
