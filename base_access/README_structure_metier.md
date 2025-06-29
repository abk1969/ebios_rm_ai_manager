# 📚 Documentation technique et métier  
## Base Access : EBIOS-RM V1.5

---

## 1. Introduction

Cette base Access modélise une démarche d'analyse de risques selon la méthode EBIOS-RM, adaptée à la gestion des risques en sécurité de l'information.  
Elle structure les éléments métiers, les événements redoutés, les parties prenantes, les scénarios d’attaque et les paramètres d’évaluation.

---

## 2. Tables principales et logique métier

### 2.1. Biens et Responsabilités

- **ERM_BienSupportAssocie**
  - Liste les biens supports associés, leur valeur métier, description, et l’entité/personne responsable.
  - **Clé logique** : `Denomination Bien Support Associe`
  - **Relation** : Référence potentielle à `ERM_ValeurMetier` et `ERM_EntitePersonneResponsable`.

- **ERM_EntitePersonneResponsable**
  - Liste des entités ou personnes responsables des biens supports.

- **ERM_ValeurMetier**
  - Liste des valeurs métiers (atouts, enjeux) protégées par le système.

---

### 2.2. Parties prenantes & catégories

- **ERM_PartiePrenante**
  - Parties prenantes impliquées dans la sécurité ou la gestion des risques.

- **ERM_Categorie**
  - Catégorisation des éléments (peut servir à classifier biens, risques, etc.).

---

### 2.3. Événements redoutés & impacts

- **ERM_EvenementRedoute**
  - Associe une valeur métier à un événement redouté et à une gravité.
  - **Relation** : `Valeur Metier` → `ERM_ValeurMetier`.

- **ERM_EvenementRedouteImpact**
  - Détaille les impacts associés à chaque événement redouté.

---

### 2.4. Scénarios d’attaque & chemins

- **ERM_CheminAttaque**
  - Décrit les chemins d’attaque possibles, de la source de risque à l’objectif visé, via une partie prenante.
  - **Relation** : 
    - `Source de Risque` → `ERM_SourceRisque`
    - `Objectif Vise` → `ERM_ObjectifVise`
    - `Partie Prenante` → `ERM_PartiePrenante`

- **ERM_GrapheAttaqueAction**
  - Décrit les actions possibles dans un graphe d’attaque.

---

### 2.5. Paramètres et référentiels

- **ERM_Param_CanalExfiltration, ERM_Param_DifficulteTechnique, ERM_Param_GraviteDesImpacts, ...**
  - Tables de paramétrage pour les différents aspects de l’analyse (canaux, difficultés, gravité, pertinence, probabilités, etc.).
  - Utilisées pour qualifier et quantifier les risques et scénarios.

- **ERM_Param_TypeDeReferentiel**
  - Types de référentiels utilisés pour la classification ou l’évaluation.

---

### 2.6. Risques et sécurité

- **ERM_PlanSecurite, ERM_PlanSecuriteResponsable, ERM_PlanSecuriteScenario**
  - Tables de gestion des plans de sécurité, responsables associés et scénarios de sécurité.

- **ERM_ScenarioRisque**
  - Scénarios de risque identifiés.

- **ERM_SocieteMission**
  - Informations sur les sociétés impliquées et leurs missions.

- **ERM_SocleSecurite, ERM_SocleSecuriteEcart**
  - Gestion du socle de sécurité et des écarts constatés.

- **ERM_SourceRisque**
  - Sources de risque identifiées.

---

## 3. Relations logiques (clés étrangères implicites)

La base Access ne définit pas toujours explicitement les contraintes de clé étrangère, mais la logique métier sous-jacente implique les relations suivantes :

- **ERM_BienSupportAssocie.Entite Personne Responsable** → **ERM_EntitePersonneResponsable.Entite Personne Responsable**
- **ERM_BienSupportAssocie.Valeur Metier** → **ERM_ValeurMetier.Valeur Metier**
- **ERM_CheminAttaque.Source de Risque** → **ERM_SourceRisque.Source de Risque**
- **ERM_CheminAttaque.Objectif Vise** → **ERM_ObjectifVise.Objectif Vise**
- **ERM_CheminAttaque.Partie Prenante** → **ERM_PartiePrenante.Partie Prenante**
- **ERM_EvenementRedoute.Valeur Metier** → **ERM_ValeurMetier.Valeur Metier**

> **Remarque** : Les relations doivent être vérifiées et adaptées selon les valeurs réelles et la logique métier de l’organisation.

---

## 4. Logique métier globale

- **Identification des actifs et parties prenantes** : Les biens supports, valeurs métiers et parties prenantes sont recensés et caractérisés.
- **Évaluation des risques** : Les événements redoutés sont associés à des valeurs métiers et à des scénarios d’attaque, eux-mêmes décrits par des chemins d’attaque.
- **Paramétrage de l’analyse** : Des tables de paramètres permettent d’adapter la méthode d’analyse (gravité, probabilité, pertinence, etc.).
- **Gestion des plans de sécurité** : Les plans de sécurité, leurs responsables et scénarios associés sont suivis dans des tables dédiées.
- **Suivi et amélioration** : Les écarts de sécurité et les référentiels permettent un suivi continu et une amélioration du dispositif.

---

## 5. Limitations et compléments

- **Formulaires, requêtes et macros VBA** :  
  Non inclus dans cette analyse automatique. Ils peuvent contenir des règles métiers supplémentaires, des automatisations ou des interfaces utilisateurs qui enrichissent la logique métier.
- **Relations non matérialisées** :  
  Beaucoup de relations sont implicites (liens via des noms ou des valeurs), il est recommandé de les formaliser lors d’une migration vers un SGBD relationnel robuste.
- **Documentation complémentaire** :  
  Pour une documentation exhaustive, il est conseillé d’exporter et d’analyser également les requêtes, formulaires et modules VBA.

---

## 6. Exemple de schéma relationnel simplifié

```mermaid
erDiagram
    ERM_BienSupportAssocie {
        TEXT "Denomination Bien Support Associe"
        TEXT "Valeur Metier"
        TEXT "Description"
        TEXT "Entite Personne Responsable"
    }
    ERM_ValeurMetier {
        TEXT "Valeur Metier"
    }
    ERM_EntitePersonneResponsable {
        TEXT "Entite Personne Responsable"
    }
    ERM_BienSupportAssocie ||--o{ ERM_ValeurMetier : "Valeur Metier"
    ERM_BienSupportAssocie ||--o{ ERM_EntitePersonneResponsable : "Entite Personne Responsable"
    %% ... Compléter selon les besoins
```

---

## 7. Pour aller plus loin

- Exporter les requêtes, formulaires et modules VBA pour compléter la documentation.
- Formaliser les relations dans le SGBD cible (ajout de clés étrangères).
- Décrire les processus métiers sous forme de diagrammes (BPMN, UML).

---

Ce document est généré automatiquement à partir de l’analyse de la structure de la base Access. Pour une documentation métier exhaustive, il est recommandé de compléter avec les exports des objets Access (requêtes, formulaires, VBA).
