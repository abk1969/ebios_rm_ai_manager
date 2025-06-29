# 🏠 Guide de Déploiement Local EBIOS AI Manager

Ce guide vous accompagne pour déployer et tester l'application EBIOS AI Manager en local avant le déploiement cloud.

## 🎯 Pourquoi déployer en local d'abord ?

- ✅ **Test rapide** des fonctionnalités
- ✅ **Développement** sans coûts cloud
- ✅ **Debug** facilité
- ✅ **Validation** avant production
- ✅ **Apprentissage** de l'application

## 📋 Prérequis

### Outils requis
- **Node.js 18+** : [Télécharger](https://nodejs.org/)
- **Python 3.8+** : [Télécharger](https://python.org/)
- **Git** : [Télécharger](https://git-scm.com/)

### Vérification rapide
```bash
node --version    # v18.0.0 ou plus
python --version  # 3.8.0 ou plus
git --version     # 2.0.0 ou plus
```

## 🚀 Déploiement en 3 Étapes

### Étape 1: Configuration automatique (5 minutes)

```bash
# Exécuter le script de configuration
./setup-local-environment.sh
```

**Ce script va :**
- ✅ Vérifier tous les prérequis
- ✅ Installer les dépendances Node.js et Python
- ✅ Configurer les variables d'environnement
- ✅ Créer les scripts de démarrage
- ✅ Configurer Firebase Emulators

### Étape 2: Configuration Firebase (2 minutes)

```bash
# Configurer Firebase pour le local
./setup-firebase-local.sh
```

**Ce script va :**
- ✅ Installer Firebase CLI
- ✅ Configurer les émulateurs
- ✅ Créer des données de test
- ✅ Configurer les règles de développement

### Étape 3: Démarrage de l'application (1 minute)

```bash
# Démarrer tous les services
./start-all-local.sh
```

**Ou démarrage manuel (3 terminaux) :**
```bash
# Terminal 1: Firebase Emulators
./start-firebase-emulators.sh

# Terminal 2: Service Python AI
./start-ai-service.sh

# Terminal 3: Frontend React
npm run dev
```

## 🌐 URLs de votre application locale

Après le démarrage, votre application sera accessible sur :

| Service | URL | Description |
|---------|-----|-------------|
| **Application principale** | `http://localhost:5173` | Interface utilisateur complète |
| **Service AI** | `http://localhost:8080` | API d'intelligence artificielle |
| **Firebase UI** | `http://localhost:4000` | Interface de gestion Firebase |
| **Firestore Emulator** | `http://localhost:8081` | Base de données locale |

## 🧪 Tests et Validation

### Test rapide
```bash
# Tester tous les composants
./test-complete-local.sh
```

### Tests spécifiques
```bash
# Tester le service AI uniquement
./test-local-ai-service.sh

# Tester le frontend uniquement
./test-local-frontend.sh
```

## 📊 Fonctionnalités disponibles en local

### ✅ Fonctionnalités complètes
- 🎯 **Création de missions** EBIOS RM
- 📋 **Gestion des actifs** essentiels et supports
- ⚠️ **Événements redoutés** et sources de risques
- 🤖 **Intelligence artificielle** pour suggestions
- 📊 **Tableaux de bord** et métriques
- 🔍 **Validation ANSSI** des données
- 💾 **Sauvegarde locale** avec Firebase Emulators

### 🔧 Fonctionnalités de développement
- 🔄 **Hot reload** pour le frontend
- 🐛 **Debug mode** pour le service AI
- 📝 **Logs détaillés** de tous les services
- 🧪 **Données de test** pré-configurées
- ⚡ **Performance monitoring** local

## 🛠️ Commandes utiles

### Démarrage
```bash
./start-all-local.sh           # Tout démarrer
./start-ai-service.sh          # Service AI uniquement
npm run dev                    # Frontend uniquement
./start-firebase-emulators.sh  # Firebase uniquement
```

### Tests
```bash
./test-complete-local.sh       # Tests complets
./test-local-ai-service.sh     # Tests service AI
./test-local-frontend.sh       # Tests frontend
```

### Maintenance
```bash
npm install                    # Réinstaller dépendances
./setup-local-environment.sh   # Reconfigurer environnement
./setup-firebase-local.sh      # Reconfigurer Firebase
```

## 🔧 Dépannage

### Problème : Port déjà utilisé
```bash
# Vérifier les ports utilisés
lsof -i :5173  # Frontend
lsof -i :8080  # Service AI
lsof -i :4000  # Firebase UI

# Tuer un processus si nécessaire
kill -9 <PID>
```

### Problème : Dépendances manquantes
```bash
# Réinstaller les dépendances Node.js
rm -rf node_modules package-lock.json
npm install

# Réinstaller les dépendances Python
cd python-ai-service
rm -rf venv
python -m venv venv
source venv/bin/activate  # ou venv\Scripts\activate sur Windows
pip install -r requirements-cloudrun.txt
```

### Problème : Firebase Emulators
```bash
# Réinstaller Firebase CLI
npm uninstall -g firebase-tools
npm install -g firebase-tools

# Nettoyer les données d'émulation
rm -rf firebase-seed-data
./setup-firebase-local.sh
```

### Problème : Service AI ne démarre pas
```bash
# Vérifier l'environnement Python
cd python-ai-service
source venv/bin/activate
python --version
pip list

# Redémarrer le service
./start-ai-service.sh
```

## 📈 Optimisation des performances

### Configuration recommandée
```bash
# Dans .env.local
VITE_DEBUG_MODE=false          # Désactiver en production
VITE_LOG_LEVEL=info           # Réduire les logs
NODE_ENV=development          # Mode développement
```

### Monitoring local
```bash
# Surveiller les performances
npm run test:performance

# Analyser le bundle
npm run build
npm run preview
```

## 🔄 Workflow de développement

### 1. Développement quotidien
```bash
# Démarrer l'environnement
./start-all-local.sh

# Développer et tester
# Les changements sont automatiquement rechargés

# Tester avant commit
./test-complete-local.sh
```

### 2. Avant un commit
```bash
# Tests complets
npm run test
npm run lint
./test-complete-local.sh

# Build de vérification
npm run build
```

### 3. Préparation déploiement
```bash
# Tests finaux
./test-complete-local.sh

# Validation production
npm run production:check

# Déploiement cloud
./deploy-complete.sh
```

## 🎯 Prochaines étapes

Une fois votre environnement local fonctionnel :

1. **Testez l'application** : Créez une mission, ajoutez des actifs
2. **Explorez les fonctionnalités IA** : Testez les suggestions et analyses
3. **Validez les données** : Utilisez la validation ANSSI
4. **Préparez le déploiement cloud** : Suivez le guide de déploiement GCP

## 📞 Support

- 📚 **Documentation** : Consultez les autres guides
- 🐛 **Issues** : [GitHub Issues](https://github.com/abk1969/Ebios_AI_manager/issues)
- 💬 **Discussions** : [GitHub Discussions](https://github.com/abk1969/Ebios_AI_manager/discussions)

---

## 🎉 Félicitations !

Votre environnement local EBIOS AI Manager est maintenant opérationnel ! 

**Accédez à votre application :** [http://localhost:5173](http://localhost:5173)

Vous pouvez maintenant développer, tester et valider votre application avant le déploiement en production.
