# 🚀 Guide d'Installation Simplifié - EBIOS AI Manager

**Installation en 5 minutes pour Risk Managers**

---

## 🎯 Avant de Commencer

### Qui peut utiliser ce guide ?
- ✅ **Risk Managers** et professionnels de la cybersécurité
- ✅ **Consultants** en gestion des risques
- ✅ **RSSI** et équipes sécurité
- ✅ **Auditeurs** et analystes risques

### Qu'allez-vous obtenir ?
- 🛡️ **Application EBIOS RM** complète et fonctionnelle
- 🤖 **Intelligence Artificielle** intégrée pour l'assistance
- 📊 **Tableaux de bord** et reporting automatique
- 🔒 **Conformité ANSSI** garantie

---

## 🚀 Installation Automatique (Recommandée)

### Option 1: Windows

#### Étape 1: Téléchargement
1. **Téléchargez** le fichier `install-ebios-windows.bat`
2. **Enregistrez-le** sur votre bureau ou dans un dossier de votre choix

#### Étape 2: Installation
1. **Clic droit** sur le fichier `install-ebios-windows.bat`
2. **Sélectionnez** "Exécuter en tant qu'administrateur"
3. **Suivez** les instructions à l'écran
4. **Patientez** pendant l'installation (5-10 minutes)

#### Étape 3: Démarrage
1. **Double-cliquez** sur "Démarrer EBIOS AI Manager" (raccourci bureau)
2. **Attendez** que l'application se lance
3. **Accédez** à [http://localhost:5173](http://localhost:5173)

### Option 2: Mac/Linux

#### Étape 1: Téléchargement
1. **Téléchargez** le fichier `install-ebios-unix.sh`
2. **Ouvrez** un terminal

#### Étape 2: Installation
```bash
# Rendre le fichier exécutable
chmod +x install-ebios-unix.sh

# Lancer l'installation
./install-ebios-unix.sh
```

#### Étape 3: Démarrage
```bash
# Démarrer l'application
start-ebios
```

---

## 🔧 Installation Manuelle (Si nécessaire)

### Prérequis à Installer

#### 1. Node.js (JavaScript Runtime)
- **Téléchargez** : [https://nodejs.org](https://nodejs.org)
- **Version requise** : 18 ou plus récente
- **Installation** : Suivez l'assistant d'installation

#### 2. Python (Langage de programmation)
- **Téléchargez** : [https://python.org](https://python.org)
- **Version requise** : 3.8 ou plus récente
- **Installation** : Cochez "Add to PATH" pendant l'installation

#### 3. Git (Gestionnaire de versions)
- **Téléchargez** : [https://git-scm.com](https://git-scm.com)
- **Installation** : Configuration par défaut recommandée

### Étapes d'Installation Manuelle

#### Étape 1: Téléchargement du Code
```bash
# Cloner le repository
git clone https://github.com/abk1969/Ebios_AI_manager.git

# Aller dans le dossier
cd Ebios_AI_manager
```

#### Étape 2: Installation des Dépendances
```bash
# Installer les dépendances JavaScript
npm install

# Configurer l'environnement Python
cd python-ai-service
python -m venv venv

# Activer l'environnement (Windows)
venv\Scripts\activate

# Activer l'environnement (Mac/Linux)
source venv/bin/activate

# Installer les dépendances Python
pip install -r requirements-cloudrun.txt

# Retourner au dossier principal
cd ..
```

#### Étape 3: Configuration
```bash
# Configurer l'environnement local
./setup-local-environment.sh
```

#### Étape 4: Démarrage
```bash
# Démarrer l'application
npm run dev
```

---

## ✅ Vérification de l'Installation

### Test Rapide
1. **Ouvrez** votre navigateur
2. **Allez** sur [http://localhost:5173](http://localhost:5173)
3. **Vérifiez** que l'interface EBIOS AI Manager s'affiche

### Test Complet
```bash
# Exécuter les tests de vérification
./verify-installation.sh
```

### Indicateurs de Réussite
- ✅ **Page d'accueil** s'affiche correctement
- ✅ **Menu de navigation** est accessible
- ✅ **Bouton "Nouvelle Mission"** fonctionne
- ✅ **Aucune erreur** dans la console du navigateur

---

## 🆘 Résolution de Problèmes

### Problèmes Courants

#### "Port 5173 ne répond pas"
```bash
# Solution 1: Redémarrer l'application
npm run dev

# Solution 2: Diagnostic automatique
./diagnose-local-environment.sh

# Solution 3: Démarrage rapide
./quick-start.sh
```

#### "Erreur de dépendances"
```bash
# Nettoyer et réinstaller
rm -rf node_modules
npm install
```

#### "Python non trouvé"
- **Windows** : Réinstallez Python en cochant "Add to PATH"
- **Mac** : Utilisez `python3` au lieu de `python`
- **Linux** : Installez avec votre gestionnaire de paquets

#### "Permissions refusées"
- **Windows** : Exécutez en tant qu'administrateur
- **Mac/Linux** : Utilisez `sudo` si nécessaire

### Scripts de Dépannage

#### Diagnostic Complet
```bash
./diagnose-local-environment.sh
```

#### Maintenance Automatique
```bash
./maintenance.sh
```

#### Tests Complets
```bash
./test-complete-local.sh
```

---

## 📚 Première Utilisation

### 1. Créer Votre Première Mission
1. **Cliquez** sur "Nouvelle Mission"
2. **Renseignez** :
   - Nom de la mission
   - Description du périmètre
   - Objectifs de sécurité
3. **Validez** la création

### 2. Découvrir l'Interface
- **Tableau de bord** : Vue d'ensemble
- **Workshops** : Étapes EBIOS RM
- **IA Assistant** : Suggestions intelligentes
- **Rapports** : Génération automatique

### 3. Utiliser l'IA
- **Suggestions automatiques** lors de la saisie
- **Validation** de la conformité ANSSI
- **Recommandations** personnalisées
- **Analyses** contextuelles

---

## 🔄 Mises à Jour

### Automatiques
- **Notifications** dans l'application
- **Mises à jour** mensuelles
- **Correctifs** de sécurité automatiques

### Manuelles
```bash
# Mettre à jour le code
git pull origin main

# Mettre à jour les dépendances
npm update

# Maintenance complète
./maintenance.sh
```

---

## 📞 Support

### Documentation
- 📖 **Guide utilisateur** : `GUIDE_RISK_MANAGERS.md`
- 🔧 **Dépannage** : `TROUBLESHOOTING.md`
- 💡 **FAQ** : Questions fréquentes

### Assistance Technique
- 🐛 **Issues GitHub** : [Signaler un problème](https://github.com/abk1969/Ebios_AI_manager/issues)
- 💬 **Forum** : [Discussions communautaires](https://github.com/abk1969/Ebios_AI_manager/discussions)
- 📧 **Email** : support@ebios-ai-manager.com

### Formation
- 🎓 **Webinaires** EBIOS RM
- 👥 **Sessions** personnalisées
- 📋 **Certification** utilisateur

---

## 🎯 Checklist de Réussite

Avant de commencer à utiliser l'application, vérifiez :

- [ ] L'application s'ouvre sur [http://localhost:5173](http://localhost:5173)
- [ ] Vous pouvez créer une nouvelle mission
- [ ] L'assistant IA répond aux sollicitations
- [ ] Les menus et navigation fonctionnent
- [ ] Aucune erreur n'apparaît dans la console

---

## 🎉 Félicitations !

**Votre installation d'EBIOS AI Manager est terminée !**

Vous pouvez maintenant :
- ✅ **Créer** vos missions EBIOS RM
- ✅ **Utiliser** l'assistance IA
- ✅ **Générer** des rapports conformes ANSSI
- ✅ **Collaborer** avec votre équipe

**🚀 Commencez dès maintenant votre première analyse de risques !**

---

*Guide d'installation EBIOS AI Manager - Version 1.0*
