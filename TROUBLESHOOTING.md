# 🔧 Guide de Dépannage EBIOS AI Manager

Ce guide vous aide à résoudre les problèmes courants de l'environnement local.

## 🚨 Problème : Le port 5173 ne répond pas

### ✅ Solution Rapide
```bash
# 1. Démarrage automatique
./quick-start.sh

# 2. Ou démarrage manuel
npm run dev
```

### 🔍 Diagnostic Détaillé

#### Étape 1: Vérifier si le serveur est démarré
```bash
# Vérifier les processus Node.js
tasklist | findstr node

# Vérifier les ports en écoute
netstat -an | findstr :5173
```

#### Étape 2: Vérifier les dépendances
```bash
# Vérifier si node_modules existe
ls node_modules

# Réinstaller si nécessaire
npm install
```

#### Étape 3: Démarrer le serveur
```bash
# Démarrer en mode développement
npm run dev

# Ou avec plus de détails
npm run dev --verbose
```

#### Étape 4: Tester l'accès
```bash
# Test simple
curl http://localhost:5173

# Test avec headers
curl -I http://localhost:5173
```

## 🚨 Problèmes Courants et Solutions

### 1. Port déjà utilisé
```
Error: Port 5173 is already in use
```

**Solution :**
```bash
# Trouver le processus qui utilise le port
netstat -ano | findstr :5173

# Tuer le processus (remplacez PID par l'ID du processus)
taskkill /F /PID <PID>

# Ou tuer tous les processus Node.js
taskkill /F /IM node.exe

# Redémarrer
npm run dev
```

### 2. Dépendances manquantes
```
Error: Cannot find module 'vite'
```

**Solution :**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Ou forcer la réinstallation
npm ci
```

### 3. Problème de permissions
```
Error: EACCES permission denied
```

**Solution :**
```bash
# Sur Windows, exécuter en tant qu'administrateur
# Ou changer les permissions npm
npm config set prefix ~/.npm-global

# Ajouter au PATH
export PATH=~/.npm-global/bin:$PATH
```

### 4. Erreur de configuration Vite
```
Error: Failed to resolve import
```

**Solution :**
```bash
# Vérifier la configuration Vite
cat vite.config.ts

# Nettoyer le cache Vite
rm -rf node_modules/.vite

# Redémarrer
npm run dev
```

### 5. Service AI non accessible
```
Error: Service AI not responding
```

**Solution :**
```bash
# Démarrer le service AI
./start-ai-service.sh

# Ou manuellement
cd python-ai-service
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
```

## 🛠️ Scripts de Dépannage

### Script de Diagnostic Automatique
```bash
# Diagnostic complet
./diagnose-local-environment.sh
```

### Script de Démarrage Rapide
```bash
# Démarrage automatique avec vérifications
./quick-start.sh
```

### Tests de Validation
```bash
# Test complet de l'environnement
./test-complete-local.sh

# Test du frontend uniquement
./test-local-frontend.sh

# Test du service AI uniquement
./test-local-ai-service.sh
```

## 🔍 Commandes de Diagnostic

### Vérifier l'état des services
```bash
# Ports en écoute
netstat -an | findstr "5173\|8080\|4000\|8081"

# Processus Node.js
tasklist | findstr node

# Processus Python
tasklist | findstr python
```

### Vérifier les logs
```bash
# Logs du frontend (dans le terminal où npm run dev est lancé)
# Logs du service AI
cd python-ai-service && python app.py

# Logs Firebase Emulators
firebase emulators:start --debug
```

### Tester la connectivité
```bash
# Test frontend
curl http://localhost:5173

# Test service AI
curl http://localhost:8080/health

# Test Firebase UI
curl http://localhost:4000

# Test Firestore
curl http://localhost:8081
```

## 🔄 Procédures de Récupération

### Récupération Complète
```bash
# 1. Arrêter tous les services
taskkill /F /IM node.exe
taskkill /F /IM python.exe

# 2. Nettoyer l'environnement
rm -rf node_modules
rm -rf python-ai-service/venv
rm -rf .vite

# 3. Reconfigurer
./setup-local-environment.sh
./setup-firebase-local.sh

# 4. Redémarrer
./quick-start.sh
```

### Récupération Partielle (Frontend uniquement)
```bash
# 1. Arrêter le frontend
# Ctrl+C dans le terminal npm run dev

# 2. Nettoyer le cache
rm -rf node_modules/.vite
rm -rf dist

# 3. Redémarrer
npm run dev
```

### Récupération Service AI
```bash
# 1. Aller dans le dossier du service
cd python-ai-service

# 2. Recréer l'environnement virtuel
rm -rf venv
python -m venv venv

# 3. Activer et installer
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements-cloudrun.txt

# 4. Redémarrer
python app.py
```

## 📞 Support et Aide

### Informations Système
```bash
# Version Node.js
node --version

# Version npm
npm --version

# Version Python
python --version

# Système d'exploitation
uname -a  # Linux/Mac
systeminfo | findstr "OS"  # Windows
```

### Logs Détaillés
```bash
# Démarrer avec logs détaillés
DEBUG=* npm run dev

# Logs du service AI avec debug
cd python-ai-service
FLASK_ENV=development FLASK_DEBUG=1 python app.py
```

### Fichiers de Configuration
```bash
# Vérifier les fichiers importants
ls -la .env.local
ls -la vite.config.ts
ls -la package.json
ls -la python-ai-service/requirements-cloudrun.txt
```

## 🎯 Checklist de Vérification

Avant de demander de l'aide, vérifiez :

- [ ] Node.js et npm sont installés
- [ ] Python est installé
- [ ] Les dépendances sont installées (`node_modules` existe)
- [ ] Le fichier `.env.local` existe
- [ ] L'environnement virtuel Python existe (`python-ai-service/venv`)
- [ ] Aucun autre processus n'utilise les ports 5173, 8080, 4000, 8081
- [ ] Les scripts ont les permissions d'exécution (`chmod +x *.sh`)

## 🚀 Démarrage Rapide après Dépannage

Une fois le problème résolu :

```bash
# Démarrage automatique
./quick-start.sh

# Ou démarrage manuel
npm run dev  # Terminal 1
./start-ai-service.sh  # Terminal 2
./start-firebase-emulators.sh  # Terminal 3 (optionnel)
```

**Votre application sera accessible sur :** [http://localhost:5173](http://localhost:5173)
