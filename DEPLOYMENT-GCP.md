# 🚀 Guide de Déploiement GCP - EBIOS RM

Ce guide détaille la procédure complète pour déployer l'application EBIOS RM sur Google Cloud Platform (GCP).

## 📋 Prérequis

### Outils requis
- [Node.js](https://nodejs.org/) (version 18+)
- [Firebase CLI](https://firebase.google.com/docs/cli)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
- Compte Google Cloud avec facturation activée

### Configuration initiale
```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Se connecter à Firebase
firebase login

# Installer Google Cloud SDK
# Suivre les instructions sur https://cloud.google.com/sdk/docs/install

# Se connecter à Google Cloud
gcloud auth login
```

## 🔍 Phase 1: Audit et Préparation

### 1.1 Audit complet du schéma Firebase
```bash
# Exécuter l'audit complet
npm run firebase:audit

# Vérifier le rapport généré
cat firebase-audit-report.json
```

### 1.2 Génération des règles de sécurité
```bash
# Générer les règles Firestore
npm run firebase:rules

# Vérifier les règles générées
cat firestore.rules
```

### 1.3 Génération des index optimisés
```bash
# Générer la configuration des index
npm run firebase:indexes

# Vérifier la configuration
cat firestore.indexes.json
```

### 1.4 Préparation complète du déploiement
```bash
# Exécuter la préparation complète
npm run gcp:prepare

# Vérifier le rapport de déploiement
cat gcp-deployment-report.json
```

## ⚙️ Phase 2: Configuration de l'Environnement

### 2.1 Variables d'environnement
Créer le fichier `.env.production` :

```env
# Configuration Firebase Production
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Configuration de l'application
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0
VITE_APP_NAME="EBIOS RM Cloud Pro"

# Configuration des fonctionnalités
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_MONITORING=true
VITE_ENABLE_DEBUG=false
```

### 2.2 Configuration Firebase
Vérifier le fichier `firebase.json` :

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

## 🔒 Phase 3: Sécurité et Règles

### 3.1 Déploiement des règles de sécurité
```bash
# Déployer uniquement les règles
npm run firebase:deploy:rules

# Vérifier le déploiement
firebase firestore:rules:get
```

### 3.2 Configuration des index
```bash
# Déployer les index
npm run firebase:deploy:indexes

# Vérifier le statut des index
firebase firestore:indexes
```

### 3.3 Test des règles de sécurité
```bash
# Utiliser l'émulateur pour tester
firebase emulators:start --only firestore

# Exécuter les tests de sécurité
npm run test:security
```

## 📊 Phase 4: Monitoring et Observabilité

### 4.1 Configuration Google Cloud Monitoring
```bash
# Activer les APIs nécessaires
gcloud services enable monitoring.googleapis.com
gcloud services enable logging.googleapis.com
gcloud services enable cloudtrace.googleapis.com

# Créer des alertes personnalisées
gcloud alpha monitoring policies create --policy-from-file=monitoring-policy.yaml
```

### 4.2 Configuration des logs
```bash
# Configurer les logs d'audit Firestore
gcloud logging sinks create firestore-audit-sink \
  bigquery.googleapis.com/projects/YOUR_PROJECT/datasets/firestore_audit \
  --log-filter='protoPayload.serviceName="firestore.googleapis.com"'
```

### 4.3 Dashboard de monitoring
- Accéder à [Google Cloud Console](https://console.cloud.google.com)
- Naviguer vers Monitoring > Dashboards
- Importer le dashboard EBIOS RM (fichier `monitoring-dashboard.json`)

## 🚀 Phase 5: Déploiement

### 5.1 Build de production
```bash
# Installer les dépendances
npm ci

# Build optimisé pour la production
npm run build

# Vérifier la taille du bundle
npm run analyze
```

### 5.2 Tests pré-déploiement
```bash
# Tests unitaires
npm run test

# Tests d'intégration
npm run test:integration

# Tests de performance
npm run test:performance

# Tests de sécurité
npm run test:security
```

### 5.3 Déploiement Firebase
```bash
# Déploiement complet
firebase deploy

# Ou déploiement par étapes
firebase deploy --only firestore
firebase deploy --only hosting
firebase deploy --only functions
```

### 5.4 Vérification post-déploiement
```bash
# Vérifier le statut de l'application
curl -I https://your-project.web.app

# Tester les endpoints critiques
npm run test:smoke

# Vérifier les métriques
firebase functions:log
```

## 📈 Phase 6: Optimisation et Maintenance

### 6.1 Monitoring des performances
- Surveiller les métriques Firestore dans la console
- Analyser les requêtes lentes
- Optimiser les index si nécessaire

### 6.2 Gestion des coûts
```bash
# Analyser l'utilisation Firestore
gcloud firestore operations list

# Configurer des budgets et alertes
gcloud billing budgets create --billing-account=BILLING_ACCOUNT \
  --display-name="EBIOS RM Budget" \
  --budget-amount=100USD
```

### 6.3 Sauvegardes automatiques
```bash
# Configurer les sauvegardes Firestore
gcloud firestore backups schedules create \
  --database=default \
  --recurrence=daily \
  --retention=7d
```

## 🔧 Commandes Utiles

### Développement
```bash
npm run dev                    # Serveur de développement
npm run firebase:audit         # Audit du schéma Firebase
npm run firebase:rules         # Générer les règles de sécurité
npm run firebase:indexes       # Générer les index
npm run gcp:prepare           # Préparation complète du déploiement
```

### Déploiement
```bash
npm run build                 # Build de production
npm run firebase:deploy       # Déploiement Firestore complet
npm run firebase:deploy:rules # Déploiement des règles uniquement
npm run firebase:deploy:indexes # Déploiement des index uniquement
firebase deploy               # Déploiement complet Firebase
```

### Monitoring
```bash
firebase functions:log        # Logs des fonctions
gcloud logging read          # Logs Google Cloud
gcloud monitoring metrics list # Métriques disponibles
```

## 🚨 Résolution de Problèmes

### Problèmes courants

#### Erreur de règles de sécurité
```bash
# Vérifier la syntaxe des règles
firebase firestore:rules:get

# Tester les règles localement
firebase emulators:start --only firestore
```

#### Index manquants
```bash
# Lister les index requis
firebase firestore:indexes

# Créer un index manuellement
gcloud firestore indexes composite create \
  --collection-group=missions \
  --field-config=field-path=status,order=ascending \
  --field-config=field-path=createdAt,order=descending
```

#### Problèmes de performance
```bash
# Analyser les requêtes lentes
# Utiliser la console Firebase > Performance

# Optimiser les requêtes
# Vérifier les index composites requis
```

## 📞 Support

### Documentation
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)

### Contacts
- **Équipe DevOps**: devops@votre-entreprise.com
- **Support Technique**: support@votre-entreprise.com
- **Urgences**: +33 X XX XX XX XX

---

## ✅ Checklist de Déploiement

- [ ] Audit du schéma Firebase réussi
- [ ] Règles de sécurité générées et testées
- [ ] Index Firestore optimisés
- [ ] Variables d'environnement configurées
- [ ] Tests de sécurité passés
- [ ] Tests de performance validés
- [ ] Monitoring configuré
- [ ] Sauvegardes automatiques activées
- [ ] Documentation mise à jour
- [ ] Équipe formée sur les procédures

**🎉 Félicitations ! Votre application EBIOS RM est prête pour la production sur GCP !**
