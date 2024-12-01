# EBIOS Cloud Pro - Community Edition

Une solution open source pour la gestion des analyses de risques selon la méthode EBIOS RM.

## Prérequis

- Node.js 20.x ou supérieur
- Docker et Docker Compose
- Git

## Installation locale

### Option 1: Installation avec npm

```bash
# Cloner le repository
git clone https://github.com/abk1969/ebios-cloud-community.git
cd ebios-cloud-community

# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm run dev
```

### Option 2: Installation avec Docker

```bash
# Cloner le repository
git clone https://github.com/abk1969/ebios-cloud-community.git
cd ebios-cloud-community

# Construire et démarrer les conteneurs
docker-compose up -d

# Vérifier les logs
docker-compose logs -f
```

L'application sera accessible à l'adresse: http://localhost:80

## Structure du projet

```
ebios-cloud-community/
├── src/
│   ├── components/      # Composants React réutilisables
│   ├── contexts/        # Contextes React (Auth, etc.)
│   ├── factories/       # Factories pour la création d'objets
│   ├── services/        # Services métier
│   ├── stores/          # Store Redux et slices
│   ├── types/          # Types TypeScript
│   └── utils/          # Utilitaires
├── docker/             # Configurations Docker
├── k8s/               # Configurations Kubernetes
└── tests/             # Tests unitaires et d'intégration
```

## Tests

```bash
# Exécuter les tests
npm run test

# Exécuter les tests avec couverture
npm run test:coverage

# Interface utilisateur des tests
npm run test:ui
```

## Déploiement

### Déploiement sur Kubernetes

```bash
# Créer le namespace
kubectl create namespace ebios

# Créer le secret pour la base de données
kubectl create secret generic db-credentials \
  --from-literal=username=postgres \
  --from-literal=password=postgres \
  -n ebios

# Appliquer les configurations
kubectl apply -f k8s/
```

### Vérification du déploiement

```bash
# Vérifier les pods
kubectl get pods -n ebios

# Vérifier les services
kubectl get services -n ebios

# Vérifier les logs
kubectl logs -f deployment/ebios-webapp -n ebios
```

## Différences entre les versions

### Version Community (Open Source)
- Déploiement local avec Docker
- Support de la communauté
- Fonctionnalités de base EBIOS RM
- Base de données PostgreSQL locale

### Version Cloud Pro (SaaS)
- Solution hébergée et maintenue
- Support professionnel 24/7
- Fonctionnalités avancées
- Intégrations entreprise
- Sauvegardes automatiques
- Conformité RGPD

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

### Guide de contribution

- Suivre les conventions de code
- Ajouter des tests pour les nouvelles fonctionnalités
- Mettre à jour la documentation
- Respecter le code de conduite

## Support

- Pour les problèmes et bugs, ouvrir une issue sur GitHub
- Pour les questions générales, utiliser les discussions GitHub
- Pour le support commercial: contact@ebioscloud.io

## License

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

## Crédits

Développé et maintenu par GLOBACOM3000 / Abbas BENTERKI