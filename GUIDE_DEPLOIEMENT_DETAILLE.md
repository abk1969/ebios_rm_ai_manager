# 🚀 Guide Détaillé : Connexion avec Google Cloud Run

Ce guide vous accompagne étape par étape pour déployer votre application EBIOS AI Manager sur Google Cloud Platform et obtenir les URLs d'accès.

## 📋 Prérequis

### 1. Outils à installer

```bash
# 1. Google Cloud CLI
# Téléchargez depuis: https://cloud.google.com/sdk/docs/install

# 2. Firebase CLI
npm install -g firebase-tools

# 3. Docker Desktop
# Téléchargez depuis: https://www.docker.com/products/docker-desktop

# 4. Vérification des installations
gcloud version
firebase --version
docker --version
node --version
```

### 2. Comptes requis

- ✅ Compte Google Cloud Platform (avec facturation activée)
- ✅ Compte Firebase (peut utiliser le même projet GCP)
- ✅ Accès administrateur au repository GitHub

## 🚀 Déploiement Étape par Étape

### Option 1: Déploiement Automatique (Recommandé)

```bash
# Exécutez le script de déploiement complet
./deploy-complete.sh
```

Ce script va :
1. ✅ Vérifier tous les prérequis
2. ✅ Configurer votre projet GCP
3. ✅ Déployer le service AI sur Cloud Run
4. ✅ Déployer le frontend sur Firebase Hosting
5. ✅ Vous donner toutes les URLs d'accès

### Option 2: Déploiement Manuel

#### Étape 1: Configuration initiale

```bash
# 1. Connexion à Google Cloud
gcloud auth login

# 2. Créer un projet (remplacez par votre nom)
gcloud projects create mon-ebios-app-2024 --name="EBIOS AI Manager"

# 3. Définir le projet par défaut
gcloud config set project mon-ebios-app-2024

# 4. Activer les APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable firebase.googleapis.com
```

#### Étape 2: Déploiement du service AI

```bash
# 1. Déployer le service Python AI
./deploy-cloudrun-step-by-step.sh
```

**Résultat attendu :**
- ✅ Service déployé sur Cloud Run
- ✅ URL du service : `https://ebios-ai-service-xxx-europe-west1.a.run.app`

#### Étape 3: Déploiement du frontend

```bash
# 1. Déployer le frontend React
./deploy-firebase-step-by-step.sh
```

**Résultat attendu :**
- ✅ Application déployée sur Firebase Hosting
- ✅ URL de l'application : `https://mon-projet.web.app`

## 🌐 URLs d'Accès à Votre Application

Après le déploiement, vous obtiendrez ces URLs :

### 🎯 Application Principale
```
https://votre-project-id.web.app
```
*Interface utilisateur complète de EBIOS AI Manager*

### 🤖 Service AI Backend
```
https://ebios-ai-service-xxx-europe-west1.a.run.app
```
*API du service d'intelligence artificielle*

### 🔍 Points de Test
```
# Test de santé du service AI
https://ebios-ai-service-xxx-europe-west1.a.run.app/health

# API d'analyse IA
https://ebios-ai-service-xxx-europe-west1.a.run.app/api/ai/analyze

# API de suggestions
https://ebios-ai-service-xxx-europe-west1.a.run.app/api/ai/suggestions
```

## 🧪 Tests de Vérification

### 1. Test du Service AI

```bash
# Test de base
curl https://votre-service-url/health

# Test avec données
curl -X POST https://votre-service-url/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"type": "supporting_assets", "content": "Test"}'
```

### 2. Test de l'Application Web

1. **Ouvrez l'URL de votre application**
2. **Vérifiez que l'interface se charge**
3. **Testez la création d'une mission**
4. **Vérifiez la connexion avec l'IA**

### 3. Test de Performance

```bash
# Test de charge simple
for i in {1..10}; do
  curl -s https://votre-service-url/health > /dev/null
  echo "Test $i: OK"
done
```

## 📊 Monitoring et Gestion

### Consoles de Gestion

| Service | URL | Description |
|---------|-----|-------------|
| **Firebase Console** | `https://console.firebase.google.com/project/votre-projet` | Gestion du frontend et base de données |
| **Cloud Run Console** | `https://console.cloud.google.com/run?project=votre-projet` | Gestion du service AI |
| **GCP Console** | `https://console.cloud.google.com/home/dashboard?project=votre-projet` | Vue d'ensemble du projet |

### Logs et Debugging

```bash
# Logs du service Cloud Run
gcloud logs read "resource.type=cloud_run_revision" --limit=50

# Logs en temps réel
gcloud logging tail "resource.type=cloud_run_revision"

# Métriques de performance
gcloud monitoring metrics list
```

## 🔧 Configuration Post-Déploiement

### 1. Domaine Personnalisé (Optionnel)

```bash
# Ajouter un domaine personnalisé
firebase hosting:sites:create votre-domaine.com
firebase target:apply hosting production votre-domaine.com
```

### 2. Authentification

```bash
# Configurer l'authentification Firebase
firebase auth:import users.json
```

### 3. Base de Données

```bash
# Déployer les règles Firestore
firebase deploy --only firestore:rules

# Déployer les index
firebase deploy --only firestore:indexes
```

## 🆘 Dépannage

### Problèmes Courants

#### ❌ Erreur "Project not found"
```bash
# Vérifier le projet actuel
gcloud config get-value project

# Changer de projet
gcloud config set project votre-project-id
```

#### ❌ Erreur de permissions
```bash
# Vérifier les permissions
gcloud projects get-iam-policy votre-project-id

# Ajouter des permissions
gcloud projects add-iam-policy-binding votre-project-id \
  --member="user:votre-email@gmail.com" \
  --role="roles/owner"
```

#### ❌ Service inaccessible
```bash
# Vérifier le statut du service
gcloud run services describe ebios-ai-service --region=europe-west1

# Redéployer si nécessaire
gcloud run deploy ebios-ai-service --image=gcr.io/votre-projet/ebios-ai-service
```

## 📞 Support

- 📧 **Email** : support@ebios-ai-manager.com
- 📚 **Documentation** : [Wiki du projet](https://github.com/abk1969/Ebios_AI_manager/wiki)
- 🐛 **Issues** : [GitHub Issues](https://github.com/abk1969/Ebios_AI_manager/issues)

---

## 🎉 Félicitations !

Votre application EBIOS AI Manager est maintenant déployée et accessible via les URLs fournies. Vous pouvez commencer à l'utiliser pour vos analyses de risques EBIOS RM !

### Prochaines étapes recommandées :

1. ✅ **Tester l'application** avec des données réelles
2. ✅ **Configurer le monitoring** et les alertes
3. ✅ **Ajouter des utilisateurs** et configurer les permissions
4. ✅ **Sauvegarder** la configuration de déploiement
5. ✅ **Planifier** les mises à jour et la maintenance
