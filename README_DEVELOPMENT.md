# 🚀 Guide de Développement - EBIOS AI Manager

## 📖 Vue d'Ensemble

EBIOS AI Manager est un outil d'expertise robuste conforme à la méthode **EBIOS RM v1.5 ANSSI** destiné aux auditeurs cybersécurité. Cette application offre un système d'authentification de développement intégré pour faciliter les tests et le développement.

## 🛠️ Installation et Démarrage

### Prérequis
- Node.js (version 16+)
- npm ou yarn

### Installation
```bash
git clone <repository-url>
cd Ebios_AI_manager
npm install
```

### Démarrage en Mode Développement
```bash
npm run dev
```

L'application sera disponible sur : **http://localhost:5174/**
(ou port 5173 si disponible)

## 🔐 Authentification en Mode Développement

### Connexion Automatique
En mode développement, l'application utilise un système d'authentification simulé :

**✅ Aucune configuration Firebase requise !**

### Utilisateurs Prédéfinis
L'interface de connexion affiche automatiquement les utilisateurs disponibles :

1. **Administrateur EBIOS**
   - Email: `admin@ebios.dev`
   - Mot de passe: `admin123`
   - Rôle: Administrateur complet

2. **Auditeur Cybersécurité**
   - Email: `auditor@ebios.dev`
   - Mot de passe: `audit123`
   - Rôle: Auditeur spécialisé

3. **Utilisateur Test**
   - Email: `test@test.com`
   - Mot de passe: `test123`
   - Rôle: Utilisateur standard

### Connexion Libre
Vous pouvez également utiliser **n'importe quelle combinaison email/mot de passe** pour vous connecter en mode développement.

## 🎯 Fonctionnalités Principales

### Ateliers EBIOS RM v1.5 Conformes ANSSI

#### 📋 Atelier 1 - Cadrage et Valeurs Métier
- **Périmètre d'analyse** avec validation automatique
- **Valeurs métier** avec critères conformes ANSSI
- **Actifs supports** avec catégorisation
- **Événements redoutés** avec échelles de gravité (1-4)

#### 🎯 Atelier 2 - Sources de Risque
- **7 catégories EBIOS RM** : Cybercriminels, États-nations, Insiders, etc.
- **Évaluation de l'exposition** selon critères ANSSI
- **Niveaux de motivation** avec justifications

#### ⚡ Atelier 3 - Scénarios Stratégiques
- **Chemins d'attaque stratégiques**
- **Calcul automatique du niveau de risque**
- **Matrice de risque conforme ANSSI**
- **Vraisemblance et gravité** (échelles 1-4)

#### 🔍 Atelier 4 - Scénarios Opérationnels
- **Techniques d'attaque détaillées**
- **Kill chain et TTP**
- **Évaluation de la vraisemblance technique**

#### 🛡️ Atelier 5 - Plan de Traitement
- **Mesures de sécurité existantes et nouvelles**
- **Stratégies** : Éviter, Réduire, Transférer, Accepter
- **Calcul du risque résiduel**
- **Plan d'action priorisé**

### 🤖 Assistance IA Intégrée

#### Auto-complétion Intelligente
- **Suggestions contextuelles** basées sur les données existantes
- **Templates pré-remplis** pour les éléments récurrents
- **Validation temps réel** des critères EBIOS RM

#### Aide Contextuelle
- **Guides ANSSI intégrés** pour chaque étape
- **Exemples concrets** et bonnes pratiques
- **Calculs automatiques** des métriques

### 📊 Génération de Rapports

#### 4 Types de Rapports Conformes ANSSI
1. **Rapport Exécutif** - Synthèse pour la direction
2. **Rapport Technique** - Détails pour les équipes IT
3. **Rapport de Conformité** - Validation EBIOS RM
4. **Rapport Opérationnel** - Plan d'action détaillé

#### Export Avancé
- **PDF professionnel** avec mise en forme ANSSI
- **Graphiques et matrices** automatiques
- **Tableaux de bord** interactifs

## 🔧 Architecture Technique

### Stack Technologique
- **Frontend** : React 18 + TypeScript
- **State Management** : Redux Toolkit
- **UI Framework** : Tailwind CSS
- **Routing** : React Router v6
- **Build Tool** : Vite
- **Backend** : Firebase (en production)

### Structure du Projet
```
src/
├── components/        # Composants UI réutilisables
├── pages/            # Pages principales de l'application
├── services/         # Services (Firebase, IA, etc.)
├── hooks/            # Custom React hooks
├── types/            # Définitions TypeScript
├── lib/              # Utilitaires et constantes
└── store/            # Redux store et slices
```

### Échelles de Cotation ANSSI
```typescript
// Gravité et vraisemblance (1-4)
MINIMAL = 1    // Impact/probabilité minimale
LIMITEE = 2    // Impact/probabilité limitée  
IMPORTANTE = 3 // Impact/probabilité importante
CRITIQUE = 4   // Impact/probabilité critique

// Matrice de risque : gravité × vraisemblance
NIVEAU_1 = "Très faible"  // 1-2
NIVEAU_2 = "Faible"       // 3-4
NIVEAU_3 = "Moyen"        // 6-8
NIVEAU_4 = "Élevé"        // 9-12
NIVEAU_5 = "Très élevé"   // 16
```

## 🧪 Tests et Validation

### Données de Test Automatiques
L'application génère automatiquement des données de test conformes EBIOS RM pour faciliter le développement et les démonstrations.

### Validation ANSSI
- **Critères de conformité** intégrés
- **Vérifications automatiques** à chaque étape
- **Indicateurs visuels** de progression

## 🐛 Débogage

### Console de Développement
Surveillez la console pour les messages informatifs :
```
🔧 Mode développement : Authentification simulée
✅ Connexion réussie en mode dev : Administrateur EBIOS
📝 Nouveau profil: {...}
```

### Problèmes Courants

#### Port occupé
```bash
Port 5173 is in use, trying another one...
✅ Local: http://localhost:5174/
```
➜ Utiliser le nouveau port affiché

#### Avertissements React Router
✅ **Corrigés** avec les future flags v7

#### Erreurs Firebase en dev
✅ **Normales** - Firebase est désactivé en développement

## 📚 Documentation Supplémentaire

- **FIREBASE_CONFIG.md** - Configuration pour la production
- **README.md** - Documentation générale du projet
- **EBIOS RM v1.5** - Guide officiel ANSSI

## 🎉 Prêt à Commencer !

1. **Lancez** : `npm run dev`
2. **Ouvrez** : http://localhost:5174/
3. **Connectez-vous** avec un utilisateur prédéfini
4. **Explorez** les ateliers EBIOS RM
5. **Testez** l'assistance IA et la génération de rapports

**L'application est maintenant 100% fonctionnelle pour le développement et les tests !** 🚀 