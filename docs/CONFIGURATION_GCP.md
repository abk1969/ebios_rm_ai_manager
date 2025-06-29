# 🌐 Configuration Google Cloud Platform (GCP)

## 🎯 Vue d'ensemble

Ce guide détaille la configuration de Google Cloud Platform pour EBIOS AI Manager, incluant Cloud Logging, monitoring et sécurité.

---

## 🚀 1. Prérequis

### **Compte GCP**
- ✅ Compte Google Cloud Platform actif
- ✅ Projet GCP créé ou accès à un projet existant
- ✅ Facturation activée (niveau gratuit suffisant pour débuter)
- ✅ Droits d'administration ou IAM appropriés

### **APIs à activer**
```bash
# Cloud Logging API
gcloud services enable logging.googleapis.com

# Cloud Monitoring API (optionnel)
gcloud services enable monitoring.googleapis.com

# Cloud Storage API (pour les exports)
gcloud services enable storage.googleapis.com
```

---

## 🔧 2. Configuration Cloud Logging

### **Étape 1 : Créer un projet GCP**
1. Accédez à [Google Cloud Console](https://console.cloud.google.com)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Notez l'**ID du projet** (format: `mon-projet-ebios-123456`)

### **Étape 2 : Activer Cloud Logging**
1. Dans la console GCP, naviguez vers **"Logging"**
2. Activez l'API Cloud Logging si demandé
3. Créez un nouveau log nommé `ebios-ai-manager`

### **Étape 3 : Créer une clé API**
1. Naviguez vers **"APIs & Services" > "Credentials"**
2. Cliquez sur **"Create Credentials" > "API Key"**
3. Copiez la clé générée
4. **Sécurisez la clé** :
   - Cliquez sur "Restrict Key"
   - Sélectionnez "HTTP referrers"
   - Ajoutez vos domaines autorisés
   - Limitez aux APIs : Cloud Logging API

### **Étape 4 : Configuration des variables d'environnement**

#### **Fichier `.env.production`**
```bash
# Configuration GCP
REACT_APP_GCP_PROJECT_ID=votre-projet-id
REACT_APP_GCP_LOG_NAME=ebios-ai-manager
REACT_APP_GCP_API_KEY=votre-cle-api

# Configuration logging
REACT_APP_ENABLE_PERFORMANCE_MONITORING=true
REACT_APP_LOG_LEVEL=WARN
```

#### **Fichier `.env.development`**
```bash
# Désactiver GCP en développement
REACT_APP_GCP_PROJECT_ID=
REACT_APP_ENABLE_PERFORMANCE_MONITORING=true
REACT_APP_LOG_LEVEL=DEBUG
```

---

## 🔐 3. Sécurité et IAM

### **Service Account (Recommandé pour production)**

#### **Créer un Service Account**
```bash
# Créer le service account
gcloud iam service-accounts create ebios-logger \
    --description="Service account for EBIOS AI Manager logging" \
    --display-name="EBIOS Logger"

# Attribuer les rôles nécessaires
gcloud projects add-iam-policy-binding VOTRE-PROJECT-ID \
    --member="serviceAccount:ebios-logger@VOTRE-PROJECT-ID.iam.gserviceaccount.com" \
    --role="roles/logging.logWriter"

# Créer et télécharger la clé
gcloud iam service-accounts keys create ebios-logger-key.json \
    --iam-account=ebios-logger@VOTRE-PROJECT-ID.iam.gserviceaccount.com
```

#### **Configuration avec Service Account**
```typescript
// src/services/gcp/CloudLoggingService.ts
import { initializeGCPLogging } from '@/services/gcp/CloudLoggingService';

// Initialisation avec service account
initializeGCPLogging({
  projectId: process.env.REACT_APP_GCP_PROJECT_ID,
  serviceAccountKey: process.env.REACT_APP_GCP_SERVICE_ACCOUNT_KEY,
  environment: 'production'
});
```

### **Permissions minimales requises**
- `roles/logging.logWriter` : Écriture des logs
- `roles/monitoring.metricWriter` : Métriques (optionnel)

---

## 📊 4. Monitoring et Alertes

### **Configuration des métriques personnalisées**

#### **Métriques EBIOS RM**
```bash
# Créer des métriques personnalisées
gcloud logging metrics create ebios_validation_errors \
    --description="Erreurs de validation EBIOS RM" \
    --log-filter='resource.type="global" AND labels.application="ebios-ai-manager" AND severity="ERROR"'

gcloud logging metrics create ebios_performance_slow \
    --description="Opérations lentes EBIOS RM" \
    --log-filter='resource.type="global" AND labels.application="ebios-ai-manager" AND jsonPayload.duration>2000'
```

### **Alertes automatiques**

#### **Alerte sur erreurs critiques**
1. Naviguez vers **"Monitoring" > "Alerting"**
2. Créez une nouvelle politique d'alerte
3. Configurez :
   - **Métrique** : `ebios_validation_errors`
   - **Condition** : > 5 erreurs en 5 minutes
   - **Notification** : Email/SMS

#### **Alerte sur performance**
1. Créez une alerte pour `ebios_performance_slow`
2. Configurez :
   - **Condition** : > 10 opérations lentes en 10 minutes
   - **Action** : Notification équipe technique

---

## 🔍 5. Requêtes et Dashboards

### **Requêtes utiles Cloud Logging**

#### **Logs d'erreur par atelier**
```sql
resource.type="global"
labels.application="ebios-ai-manager"
severity="ERROR"
labels.workshop="Workshop1"
timestamp>="2024-01-01T00:00:00Z"
```

#### **Performance par fonctionnalité**
```sql
resource.type="global"
labels.application="ebios-ai-manager"
jsonPayload.duration>1000
timestamp>="2024-01-01T00:00:00Z"
```

#### **Activité utilisateur**
```sql
resource.type="global"
labels.application="ebios-ai-manager"
jsonPayload.data.userInteraction=true
timestamp>="2024-01-01T00:00:00Z"
```

### **Dashboard personnalisé**

#### **Métriques clés à surveiller**
- 📊 **Nombre d'utilisateurs actifs** par jour
- ⚡ **Temps de réponse moyen** par atelier
- 🚨 **Taux d'erreur** par fonctionnalité
- 📈 **Utilisation des fonctionnalités** IA
- 🔒 **Événements de sécurité** détectés

---

## 🚀 6. Déploiement et CI/CD

### **Configuration pour Firebase Hosting**

#### **Fichier `firebase.json`**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
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
  }
}
```

### **GitHub Actions pour déploiement**

#### **Fichier `.github/workflows/deploy.yml`**
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          REACT_APP_GCP_PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
          REACT_APP_GCP_API_KEY: ${{ secrets.GCP_API_KEY }}
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: ${{ secrets.GCP_PROJECT_ID }}
```

---

## 🔧 7. Maintenance et Optimisation

### **Rotation des logs**
```bash
# Configurer la rétention des logs (90 jours)
gcloud logging sinks create ebios-archive \
    bigquery.googleapis.com/projects/VOTRE-PROJECT-ID/datasets/ebios_logs \
    --log-filter='resource.type="global" AND labels.application="ebios-ai-manager"'
```

### **Optimisation des coûts**
- 📊 **Monitoring** : Surveillez l'utilisation mensuelle
- 🔄 **Batch** : Groupez les logs pour réduire les appels API
- 📅 **Rétention** : Configurez une rétention appropriée (30-90 jours)
- 🎯 **Filtrage** : Ne loggez que les événements importants en production

### **Sauvegarde et archivage**
```bash
# Export vers Cloud Storage
gcloud logging sinks create ebios-backup \
    storage.googleapis.com/ebios-logs-backup \
    --log-filter='resource.type="global" AND labels.application="ebios-ai-manager"'
```

---

## 🆘 8. Dépannage

### **Problèmes courants**

#### **Logs non visibles dans GCP**
1. ✅ Vérifiez l'ID du projet
2. ✅ Confirmez que l'API Cloud Logging est activée
3. ✅ Vérifiez les permissions de la clé API
4. ✅ Contrôlez les filtres dans Cloud Logging

#### **Erreurs d'authentification**
1. ✅ Vérifiez la validité de la clé API
2. ✅ Confirmez les restrictions de domaine
3. ✅ Testez avec une nouvelle clé API

#### **Performance dégradée**
1. ✅ Activez le batching des logs
2. ✅ Augmentez l'intervalle de flush
3. ✅ Réduisez le niveau de log en production

### **Tests de connectivité**
```typescript
// Test de connexion GCP
import { cloudLoggingService } from '@/services/gcp/CloudLoggingService';

// En console développeur
cloudLoggingService.testConnection().then(success => {
  console.log('GCP Connection:', success ? 'OK' : 'FAILED');
});
```

---

## 📞 Support

### **Ressources GCP**
- 📚 [Documentation Cloud Logging](https://cloud.google.com/logging/docs)
- 🎓 [Tutoriels GCP](https://cloud.google.com/docs/tutorials)
- 💬 [Support GCP](https://cloud.google.com/support)

### **Support EBIOS AI Manager**
- 📧 Email : support@ebios-ai-manager.com
- 📱 Documentation : `/docs/`
- 🐛 Issues : GitHub Issues

---

**✅ Cette configuration GCP assure un logging sécurisé, un monitoring efficace et une observabilité complète d'EBIOS AI Manager en production.**
