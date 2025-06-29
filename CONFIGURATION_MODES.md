# 🔄 Guide des Modes de Configuration

## 📋 Modes Disponibles

L'application EBIOS AI Manager propose deux modes de fonctionnement :

### 🔧 Mode Développement (Actuel)
- **Authentification simulée** sans Firebase
- **Données de test** intégrées
- **Connexion libre** avec n'importe quel email/mot de passe
- **Utilisateurs prédéfinis** pour tests rapides

### 🚀 Mode Production
- **Firebase authentification** réelle
- **Base de données Firestore** en ligne
- **Sécurité renforcée** avec règles Firebase
- **Utilisateurs réels** uniquement

## ⚙️ Configuration Actuelle

Votre fichier `.env` est configuré pour le **mode développement** :

```bash
VITE_ENV=development  # ← Mode développement actif
```

## 🔄 Basculer vers la Production

Pour activer Firebase et utiliser l'authentification réelle :

### Étape 1 : Modifier le Mode
Changez dans le fichier `.env` :
```bash
VITE_ENV=production  # ← Activation du mode production
```

### Étape 2 : Redémarrer l'Application
```bash
npm run dev
```

### Étape 3 : Vérifier les Logs
Dans la console, vous devriez voir :
```
🚀 Mode production : Firebase actif
📊 Projet : ebiosdatabase
```

## 🧪 Test des Deux Modes

### Mode Développement (VITE_ENV=development)
```bash
🔧 Mode développement : Authentification simulée activée
📊 Projet Firebase configuré : ebiosdatabase
💡 Pour activer Firebase en production, changez VITE_ENV=production
✅ Connexion réussie en mode dev : Administrateur EBIOS
```

**Fonctionnalités :**
- Connexion instantanée avec utilisateurs prédéfinis
- Pas de création de comptes réels
- Données locales temporaires
- Tests et développement

### Mode Production (VITE_ENV=production)
```bash
🚀 Mode production : Firebase actif
📊 Projet : ebiosdatabase
```

**Fonctionnalités :**
- Authentification Firebase réelle
- Création de comptes utilisateurs
- Stockage persistant dans Firestore
- Sécurité complète

## 🔐 Configuration Firebase Utilisée

Votre projet Firebase est configuré avec :

```bash
Project ID: ebiosdatabase
Auth Domain: ebiosdatabase.firebaseapp.com
Storage: ebiosdatabase.firebasestorage.app
```

## ⚠️ Important : Sécurité Firebase

Avant d'utiliser en production, assurez-vous de :

### 1. Configurer les Règles Firestore
```javascript
// Dans la console Firebase > Firestore Database > Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Vos règles sont déjà configurées dans le projet
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. Activer l'Authentification
- Allez dans Firebase Console > Authentication
- Activez "Email/Password" dans l'onglet "Sign-in method"
- Configurez les domaines autorisés

### 3. Configurer le Storage
- Définir les règles d'accès aux fichiers
- Configurer les quotas si nécessaire

## 🎯 Recommandations

### Pour le Développement
```bash
VITE_ENV=development  # Recommandé pour tests
```

### Pour les Tests d'Intégration
```bash
VITE_ENV=production   # Tester avec Firebase
```

### Pour le Déploiement
```bash
VITE_ENV=production   # Obligatoire en production
```

## 🚨 Dépannage

### Problème : "Firebase not initialized"
**Solution :** Vérifiez que `VITE_ENV=production` et redémarrez

### Problème : "Auth errors" en production
**Solution :** Vérifiez les règles Firebase et les domaines autorisés

### Problème : Mode développement ne fonctionne plus
**Solution :** Changez `VITE_ENV=development` dans `.env`

## 📞 Support

Le système de configuration est flexible :
- **VITE_ENV=development** → Authentification simulée
- **VITE_ENV=production** → Firebase complet
- **VITE_ENV** non défini → Mode automatique selon la config

---

**Vous pouvez maintenant tester les deux modes selon vos besoins !** 🎉 