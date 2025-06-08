# Configuration Firebase pour la Production

## 🔧 Variables d'Environnement Requises

Pour utiliser Firebase en production, vous devez configurer les variables d'environnement suivantes :

### Variables Obligatoires

```bash
VITE_FIREBASE_API_KEY=your-firebase-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### Variables Optionnelles

```bash
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com/
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ENV=production
VITE_APP_TITLE=EBIOS Cloud Pro
VITE_APP_VERSION=1.0.0
```

## 📋 Instructions pour Obtenir ces Valeurs

1. **Allez sur la console Firebase** : https://console.firebase.google.com/
2. **Sélectionnez votre projet** (ou créez-en un nouveau)
3. **Accédez aux paramètres** : "Paramètres du projet" > "Général"
4. **Trouvez votre app web** : Scrollez vers "Vos applications"
5. **Copiez la configuration** : Section "Configuration Firebase"

## 🚀 Configuration du Fichier .env

Créez un fichier `.env` à la racine du projet :

```bash
# Copiez ce modèle dans .env et remplacez par vos vraies valeurs
VITE_FIREBASE_API_KEY=AIzaSyA...
VITE_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre-projet-id
VITE_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

## ⚠️ Notes Importantes

- **Mode Développement** : L'application utilise un système d'authentification simulé
- **Production Uniquement** : Ces variables ne sont nécessaires qu'en production
- **Sécurité** : Ne committez jamais le fichier `.env` avec de vraies valeurs
- **Gitignore** : Le fichier `.env` est automatiquement ignoré par Git

## 🔒 Sécurité Firebase

Assurez-vous de configurer les règles de sécurité dans Firebase :

### Firestore Rules (firebase.rules)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Vos règles de sécurité sont déjà configurées dans le projet
  }
}
```

### Authentication
- Activez les méthodes d'authentification souhaitées
- Configurez les domaines autorisés
- Mettez en place les restrictions d'accès

## 🏗️ Déploiement

Pour déployer en production :

1. **Configurez les variables d'environnement** selon votre plateforme
2. **Netlify** : Utilisez les variables d'environnement dans les paramètres du site
3. **Vercel** : Configurez via l'interface ou le fichier `vercel.json`
4. **Firebase Hosting** : Utilisez Firebase CLI avec `firebase deploy`

## 📞 Support

Si vous rencontrez des problèmes :
- Vérifiez que toutes les variables sont bien définies
- Consultez la console Firebase pour les erreurs
- Testez d'abord en mode développement

---

**En mode développement, l'application fonctionne sans configuration Firebase !** 🎉 