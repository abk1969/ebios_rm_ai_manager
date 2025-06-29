# 📋 Guide Pratique EBIOS RM pour Risk Managers

**Guide complet d'utilisation d'EBIOS AI Manager pour les professionnels de la gestion des risques cyber.**

---

## 🎯 Introduction

Ce guide vous accompagne dans l'utilisation d'EBIOS AI Manager pour mener vos analyses de risques selon la méthodologie EBIOS Risk Manager de l'ANSSI. Il est conçu spécifiquement pour les risk managers et les professionnels de la cybersécurité.

---

## 🚀 Premiers Pas

### 1. Accès à l'Application

Après installation, accédez à l'application via :
- **URL locale** : [http://localhost:5173](http://localhost:5173)
- **Raccourci bureau** (Windows) : "Démarrer EBIOS AI Manager"
- **Commande terminal** (Linux/Mac) : `start-ebios`

### 2. Interface Principale

L'interface se compose de :
- **Barre de navigation** : Accès aux différents modules
- **Tableau de bord** : Vue d'ensemble de vos missions
- **Menu latéral** : Navigation entre les workshops
- **Zone de travail** : Saisie et visualisation des données

---

## 📊 Gestion des Missions

### Création d'une Nouvelle Mission

1. **Cliquez** sur "Nouvelle Mission"
2. **Renseignez** les informations de base :
   - **Nom** : Identifiant unique de la mission
   - **Description** : Contexte et objectifs
   - **Périmètre** : Limites de l'analyse
   - **Équipe** : Participants à l'analyse
   - **Échéances** : Planning prévisionnel

### Configuration de la Mission

#### Paramètres Généraux
- **Secteur d'activité** : Influence les suggestions IA
- **Taille d'organisation** : Adapte les recommandations
- **Niveau de maturité** : Personnalise l'assistance
- **Contraintes réglementaires** : Active les validations spécifiques

#### Équipe Projet
- **Chef de mission** : Responsable de l'analyse
- **Experts métier** : Connaissance des processus
- **Experts techniques** : Connaissance des systèmes
- **RSSI** : Validation sécurité

---

## 🏗️ Workshop 1 : Cadrage et Actifs

### Objectifs du Workshop 1
- Identifier les actifs essentiels (biens métier)
- Cartographier les actifs supports (infrastructure)
- Définir les événements redoutés
- Établir les critères de sécurité

### 1. Actifs Essentiels

#### Identification
- **Processus métier** : Activités critiques de l'organisation
- **Informations** : Données sensibles ou stratégiques
- **Savoir-faire** : Compétences et connaissances clés
- **Image/réputation** : Capital immatériel

#### Critères DICP
Pour chaque actif essentiel, définissez :
- **D**isponibilité : Besoin d'accès permanent
- **I**ntégrité : Besoin de données exactes
- **C**onfidentialité : Besoin de protection
- **P**reuve : Besoin de traçabilité

#### Utilisation de l'IA
- **Suggestions automatiques** basées sur votre secteur
- **Validation** de la complétude de votre liste
- **Recommandations** de critères DICP

### 2. Actifs Supports

#### Catégories d'Actifs
- **Matériels** : Serveurs, postes de travail, équipements réseau
- **Logiciels** : Applications, systèmes d'exploitation, bases de données
- **Réseaux** : Infrastructure de communication
- **Personnel** : Utilisateurs, administrateurs, prestataires
- **Sites** : Locaux, centres de données
- **Organisation** : Procédures, documentation

#### Cartographie des Dépendances
- **Relations** entre actifs supports et essentiels
- **Criticité** de chaque dépendance
- **Points de défaillance** unique

### 3. Événements Redoutés

#### Définition
Un événement redouté est un dysfonctionnement d'un actif essentiel qui impacte les missions de l'organisation.

#### Typologie
- **Indisponibilité** : Perte d'accès temporaire ou définitive
- **Destruction** : Perte définitive de l'actif
- **Divulgation** : Accès non autorisé à l'information
- **Modification** : Altération non autorisée

#### Évaluation des Impacts
- **Gravité** : Niveau d'impact sur l'organisation
- **Vraisemblance** : Probabilité d'occurrence
- **Niveau de risque** : Combinaison gravité/vraisemblance

---

## 🎯 Workshop 2 : Sources de Risques

### Objectifs du Workshop 2
- Identifier les sources de menaces
- Analyser leurs capacités et motivations
- Évaluer leur accessibilité aux actifs supports

### 1. Sources de Menaces

#### Typologie ANSSI
- **Cybercriminels** : Motivation financière
- **États** : Espionnage, déstabilisation
- **Terroristes** : Impact médiatique, destruction
- **Hacktivistes** : Idéologie, protestation
- **Initiés malveillants** : Vengeance, profit
- **Erreurs humaines** : Négligence, méconnaissance

#### Analyse des Capacités
- **Techniques** : Niveau d'expertise
- **Financières** : Moyens disponibles
- **Temporelles** : Durée d'engagement possible
- **Organisationnelles** : Structure et coordination

### 2. Évaluation de l'Exposition

#### Facteurs d'Exposition
- **Visibilité** : Notoriété de l'organisation
- **Attractivité** : Intérêt pour les attaquants
- **Accessibilité** : Facilité d'accès aux actifs
- **Vulnérabilités** : Faiblesses exploitables

#### Utilisation des Référentiels
- **MITRE ATT&CK** : Techniques d'attaque
- **OWASP** : Vulnérabilités applicatives
- **NIST** : Framework de cybersécurité
- **ISO 27001** : Bonnes pratiques

---

## 📈 Workshop 3 : Scénarios Stratégiques

### Objectifs du Workshop 3
- Construire les scénarios d'attaque
- Évaluer leur vraisemblance
- Calculer les niveaux de risque

### 1. Construction des Scénarios

#### Méthodologie
1. **Source de menace** + **Actif support** = **Scénario**
2. **Chemin d'attaque** : Étapes de compromission
3. **Événement redouté** : Impact final

#### Éléments du Scénario
- **Vecteur d'attaque** : Point d'entrée
- **Techniques utilisées** : Méthodes d'exploitation
- **Actifs compromis** : Cibles intermédiaires
- **Objectif final** : Événement redouté visé

### 2. Évaluation de la Vraisemblance

#### Critères d'Évaluation
- **Motivation** de la source de menace
- **Capacités** requises vs disponibles
- **Opportunités** d'attaque
- **Dissuasion** existante

#### Échelle de Vraisemblance
- **1 - Négligeable** : Très peu probable
- **2 - Limitée** : Peu probable
- **3 - Significative** : Possible
- **4 - Forte** : Probable
- **5 - Maximale** : Très probable

### 3. Calcul du Risque

#### Formule
**Risque = Gravité × Vraisemblance**

#### Matrice de Risque
- **Vert** : Risque acceptable (1-6)
- **Orange** : Risque à surveiller (8-12)
- **Rouge** : Risque critique (15-25)

---

## 🔧 Workshop 4 : Risques Opérationnels

### Objectifs du Workshop 4
- Détailler les scénarios techniques
- Identifier les vulnérabilités spécifiques
- Proposer des mesures de traitement

### 1. Scénarios Opérationnels

#### Niveau de Détail
- **Techniques précises** : CVE, exploits connus
- **Outils utilisés** : Malwares, frameworks d'attaque
- **Indicateurs** : IoC, signatures
- **Chronologie** : Séquence d'actions

#### Analyse Technique
- **Vulnérabilités** : Faiblesses exploitées
- **Contrôles** : Mesures de sécurité contournées
- **Détection** : Capacité d'identification
- **Réaction** : Temps de réponse

### 2. Mesures de Traitement

#### Types de Mesures
- **Éviter** : Supprimer la source de risque
- **Réduire** : Diminuer la probabilité ou l'impact
- **Transférer** : Assurance, externalisation
- **Accepter** : Assumer le risque résiduel

#### Critères de Sélection
- **Efficacité** : Réduction du risque
- **Coût** : Investissement nécessaire
- **Faisabilité** : Contraintes techniques/organisationnelles
- **Délai** : Temps de mise en œuvre

---

## 📋 Workshop 5 : Plan de Traitement

### Objectifs du Workshop 5
- Finaliser le plan de traitement des risques
- Définir les indicateurs de suivi
- Planifier la mise en œuvre

### 1. Plan d'Action

#### Priorisation
- **Risques critiques** : Traitement immédiat
- **Risques importants** : Traitement à court terme
- **Risques modérés** : Traitement à moyen terme

#### Planification
- **Responsables** : Qui fait quoi
- **Échéances** : Quand
- **Budget** : Combien
- **Ressources** : Avec quoi

### 2. Indicateurs de Suivi

#### Types d'Indicateurs
- **Mise en œuvre** : Avancement des mesures
- **Efficacité** : Réduction effective du risque
- **Performance** : Fonctionnement des contrôles
- **Conformité** : Respect des exigences

#### Tableau de Bord
- **Statut global** : Vue d'ensemble
- **Alertes** : Déviations détectées
- **Tendances** : Évolution dans le temps
- **Recommandations** : Actions correctives

---

## 🤖 Utilisation Optimale de l'IA

### Fonctionnalités IA Disponibles

#### Suggestions Contextuelles
- **Actifs** : Propositions basées sur votre secteur
- **Menaces** : Identification des sources pertinentes
- **Mesures** : Recommandations de sécurité adaptées

#### Analyses Automatiques
- **Cohérence** : Vérification de la logique
- **Complétude** : Identification des manques
- **Optimisation** : Amélioration des choix

#### Validation ANSSI
- **Conformité** : Respect de la méthodologie
- **Qualité** : Niveau des livrables
- **Recommandations** : Améliorations suggérées

### Bonnes Pratiques

#### Interaction avec l'IA
1. **Contextualisez** : Fournissez des informations précises
2. **Validez** : Vérifiez les suggestions proposées
3. **Adaptez** : Personnalisez selon votre contexte
4. **Apprenez** : Utilisez les explications fournies

#### Limites à Connaître
- L'IA **assiste** mais ne remplace pas l'expertise
- Les suggestions doivent être **validées** par l'expert
- Le **contexte spécifique** reste primordial
- La **responsabilité** finale appartient au risk manager

---

## 📊 Reporting et Communication

### Livrables EBIOS RM

#### Documents Standards
- **Rapport d'analyse** : Synthèse complète
- **Cartographie des risques** : Visualisation
- **Plan de traitement** : Actions à mener
- **Tableau de bord** : Suivi des indicateurs

#### Personnalisation
- **Templates** adaptables
- **Logos** et charte graphique
- **Niveaux de détail** variables
- **Formats** multiples (PDF, Excel, PowerPoint)

### Communication aux Parties Prenantes

#### Direction Générale
- **Synthèse exécutive** : Enjeux et recommandations
- **Impacts métier** : Conséquences sur l'activité
- **Investissements** : Coûts et bénéfices
- **Planning** : Échéances et priorités

#### Équipes Techniques
- **Détails techniques** : Vulnérabilités et mesures
- **Procédures** : Modes opératoires
- **Outils** : Solutions techniques
- **Formation** : Besoins en compétences

---

## 🔧 Maintenance et Suivi

### Révision Périodique

#### Fréquence Recommandée
- **Revue trimestrielle** : Évolution des menaces
- **Revue annuelle** : Mise à jour complète
- **Revue exceptionnelle** : Changements majeurs

#### Éléments à Réviser
- **Périmètre** : Évolution de l'organisation
- **Actifs** : Nouveaux systèmes, applications
- **Menaces** : Nouvelles techniques d'attaque
- **Mesures** : Efficacité et pertinence

### Amélioration Continue

#### Retour d'Expérience
- **Incidents** : Enseignements tirés
- **Exercices** : Tests de résilience
- **Audits** : Évaluations externes
- **Benchmarks** : Comparaisons sectorielles

#### Évolution de la Méthodologie
- **Mises à jour ANSSI** : Nouvelles versions
- **Bonnes pratiques** : Retours communauté
- **Outils** : Nouvelles fonctionnalités
- **Formation** : Montée en compétences

---

## 📞 Support et Ressources

### Documentation Complémentaire
- **Guide ANSSI** : Méthodologie officielle EBIOS RM
- **Référentiels** : ISO 27005, NIST, MITRE ATT&CK
- **Cas d'usage** : Exemples sectoriels
- **FAQ** : Questions fréquentes

### Communauté
- **Forum utilisateurs** : Échanges d'expériences
- **Webinaires** : Sessions de formation
- **Groupes sectoriels** : Partage de bonnes pratiques
- **Événements** : Conférences et ateliers

### Support Technique
- **Documentation** : Guides d'utilisation
- **Tutoriels** : Vidéos explicatives
- **Assistance** : Support par email
- **Formation** : Sessions personnalisées

---

**🎯 Avec ce guide, vous disposez de toutes les clés pour mener efficacement vos analyses EBIOS RM avec EBIOS AI Manager !**
