# 🛡️ EBIOS AI Manager - Guide pour Risk Managers

**Solution complète de gestion des risques cyber selon la méthodologie EBIOS Risk Manager de l'ANSSI, enrichie par l'Intelligence Artificielle.**

---

## 🎯 Pour les Risk Managers

### Qu'est-ce que EBIOS AI Manager ?

EBIOS AI Manager est une application web moderne qui digitalise et automatise la méthodologie **EBIOS Risk Manager** développée par l'ANSSI (Agence Nationale de la Sécurité des Systèmes d'Information). Elle intègre l'Intelligence Artificielle pour vous assister dans vos analyses de risques cyber.

### 🔑 Avantages Clés

- ✅ **Conformité ANSSI** : Respect strict de la méthodologie EBIOS RM
- 🤖 **IA Intégrée** : Suggestions intelligentes et analyses automatisées
- 📊 **Tableaux de bord** : Visualisation claire des risques et métriques
- 🔄 **Collaboration** : Travail en équipe sur les missions
- 📱 **Interface moderne** : Ergonomie pensée pour les professionnels
- 🔒 **Sécurité** : Chiffrement et audit des données
- 📈 **Reporting** : Génération automatique de rapports

---

## 🚀 Installation Simplifiée

### Option 1: Installation Automatique (Recommandée)

#### 💻 Windows
1. **Téléchargez** le fichier `install-ebios-windows.bat`
2. **Clic droit** → "Exécuter en tant qu'administrateur"
3. **Suivez** les instructions à l'écran
4. **Démarrez** l'application via le raccourci bureau

#### 🐧 Linux/Mac
1. **Téléchargez** le fichier `install-ebios-unix.sh`
2. **Ouvrez** un terminal
3. **Exécutez** : `chmod +x install-ebios-unix.sh && ./install-ebios-unix.sh`
4. **Démarrez** avec : `start-ebios`

### Option 2: Installation Manuelle

#### Prérequis
- **Node.js 18+** : [Télécharger](https://nodejs.org/)
- **Python 3.8+** : [Télécharger](https://python.org/)
- **Git** : [Télécharger](https://git-scm.com/)

#### Étapes
```bash
# 1. Cloner le repository
git clone https://github.com/abk1969/Ebios_AI_manager.git
cd Ebios_AI_manager

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement Python
cd python-ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements-cloudrun.txt
cd ..

# 4. Démarrer l'application
npm run dev
```

---

## 🎓 Guide d'Utilisation pour Risk Managers

### 1. 🎯 Création d'une Mission EBIOS

1. **Accédez** à l'application : [http://localhost:5173](http://localhost:5173)
2. **Cliquez** sur "Nouvelle Mission"
3. **Renseignez** :
   - Nom de la mission
   - Description du périmètre
   - Objectifs de sécurité
   - Équipe projet

### 2. 📋 Workshop 1 : Cadrage et Actifs

#### Actifs Essentiels
- **Identifiez** vos biens métier critiques
- **Définissez** les critères DICP (Disponibilité, Intégrité, Confidentialité, Preuve)
- **Utilisez** l'IA pour des suggestions contextuelles

#### Actifs Supports
- **Cartographiez** l'infrastructure technique
- **Identifiez** les dépendances
- **Évaluez** les mesures de sécurité existantes

#### Événements Redoutés
- **Définissez** les impacts métier
- **Associez** aux actifs essentiels
- **Priorisez** selon la criticité

### 3. 🔍 Workshop 2 : Sources de Risques

- **Identifiez** les sources de menaces
- **Analysez** les capacités d'attaque
- **Évaluez** la motivation des attaquants
- **Utilisez** les référentiels MITRE ATT&CK

### 4. 📊 Workshop 3 : Scénarios Stratégiques

- **Construisez** les chemins d'attaque
- **Évaluez** la vraisemblance
- **Calculez** les niveaux de risque
- **Priorisez** les scénarios

### 5. 🛡️ Workshop 4 : Risques Opérationnels

- **Détaillez** les scénarios techniques
- **Identifiez** les vulnérabilités
- **Proposez** des mesures de traitement

### 6. 📈 Workshop 5 : Traitement des Risques

- **Sélectionnez** les mesures de sécurité
- **Planifiez** la mise en œuvre
- **Définissez** les indicateurs de suivi

---

## 🤖 Fonctionnalités IA

### Assistance Intelligente
- **Suggestions contextuelles** basées sur votre secteur d'activité
- **Analyse automatique** des actifs et menaces
- **Recommandations** de mesures de sécurité
- **Validation** de la conformité ANSSI

### Analyses Avancées
- **Corrélation** entre actifs et menaces
- **Calcul automatique** des niveaux de risque
- **Identification** des points de vigilance
- **Optimisation** des mesures de traitement

---

## 📊 Tableaux de Bord

### Vue d'Ensemble
- **Progression** des workshops
- **Répartition** des risques par niveau
- **Statut** des mesures de traitement
- **Indicateurs** de conformité

### Métriques Détaillées
- **Nombre d'actifs** par catégorie
- **Couverture** des menaces identifiées
- **Efficacité** des mesures de sécurité
- **Évolution** du niveau de risque global

---

## 🔒 Sécurité et Conformité

### Conformité ANSSI
- ✅ **Méthodologie** EBIOS RM respectée
- ✅ **Référentiels** intégrés (ISO 27001, NIST)
- ✅ **Validation** automatique des livrables
- ✅ **Traçabilité** complète des analyses

### Sécurité des Données
- 🔐 **Chiffrement** des données sensibles
- 📝 **Audit trail** de toutes les actions
- 🔑 **Gestion** des accès et permissions
- 💾 **Sauvegarde** automatique

---

## 🏢 Cas d'Usage Métier

### Secteur Bancaire
- Analyse des risques cyber sur les systèmes de paiement
- Conformité PCI-DSS et réglementations bancaires
- Gestion des risques opérationnels

### Industrie
- Sécurisation des systèmes industriels (OT/IT)
- Analyse des risques sur les chaînes de production
- Conformité NIS et cybersécurité industrielle

### Santé
- Protection des données de santé (RGPD)
- Sécurisation des systèmes d'information hospitaliers
- Analyse des risques sur les dispositifs médicaux

### Administration
- Conformité RGS (Référentiel Général de Sécurité)
- Analyse des risques sur les services publics numériques
- Sécurisation des données citoyens

---

## 📞 Support et Formation

### Documentation
- 📚 **Guide utilisateur** complet
- 🎥 **Tutoriels vidéo** (à venir)
- 📖 **Bonnes pratiques** EBIOS RM
- 🔧 **Guide de dépannage**

### Support Technique
- 🐛 **Issues GitHub** : [Signaler un problème](https://github.com/abk1969/Ebios_AI_manager/issues)
- 💬 **Discussions** : [Forum communautaire](https://github.com/abk1969/Ebios_AI_manager/discussions)
- 📧 **Contact** : support@ebios-ai-manager.com

### Formation
- 🎓 **Webinaires** méthodologie EBIOS RM
- 👥 **Sessions** de formation personnalisées
- 📋 **Certification** utilisateur (à venir)

---

## 🔄 Mises à Jour

### Versions
- **Version actuelle** : 1.0.0
- **Fréquence** : Mises à jour mensuelles
- **Notifications** : Automatiques dans l'application

### Nouveautés
- 🆕 **Fonctionnalités** basées sur vos retours
- 🔧 **Améliorations** de performance
- 🛡️ **Correctifs** de sécurité
- 📊 **Nouveaux** tableaux de bord

---

## 🎯 Prochaines Étapes

1. **Installez** l'application avec l'installateur automatique
2. **Créez** votre première mission EBIOS
3. **Explorez** les fonctionnalités IA
4. **Consultez** la documentation détaillée
5. **Rejoignez** la communauté d'utilisateurs

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- **ANSSI** pour la méthodologie EBIOS Risk Manager
- **Communauté** des risk managers pour leurs retours
- **Contributeurs** open source du projet

---

**🚀 Commencez dès maintenant votre analyse de risques avec EBIOS AI Manager !**
