# 📊 MAPPING DÉTAILLÉ ACCESS ↔ FIREBASE
## Guide de Correspondance des Champs EBIOS RM

---

## 🗂️ **ATELIER 1 - CADRAGE ET SOCLE DE SÉCURITÉ**

### **1.1 MISSION/ORGANISATION**

| Champ Access | Table Access | Type Access | Champ Firebase | Type Firebase | Mapping/Conversion |
|--------------|--------------|-------------|----------------|---------------|-------------------|
| Nom Societe | ERM_SocieteMission | TEXT | organizationContext.name | string | Direct (à ajouter) |
| Adresse | ERM_SocieteMission | TEXT | ❌ MANQUANT | - | À ajouter dans Mission |
| Contact | ERM_SocieteMission | TEXT | assignedTo[0] | string[] | Conversion nécessaire |
| Mission | ERM_SocieteMission | TEXT | name | string | Direct |

### **1.2 VALEURS MÉTIER**

| Champ Access | Table Access | Type Access | Champ Firebase | Type Firebase | Mapping/Conversion |
|--------------|--------------|-------------|----------------|---------------|-------------------|
| Denomination Valeur Metier | ERM_ValeurMetier | TEXT | name | string | Direct |
| Mission | ERM_ValeurMetier | TEXT | missionId | string | Lookup ID requis |
| Nature Valeur Metier | ERM_ValeurMetier | TEXT | category | enum | PROCESSUS→primary, INFORMATION→support |
| Description | ERM_ValeurMetier | TEXT | description | string | Direct |
| Entite Personne Responsable | ERM_ValeurMetier | TEXT | stakeholders[] | string[] | Conversion en array |

### **1.3 BIENS SUPPORTS**

| Champ Access | Table Access | Type Access | Champ Firebase | Type Firebase | Mapping/Conversion |
|--------------|--------------|-------------|----------------|---------------|-------------------|
| Denomination Bien Support Associe | ERM_BienSupportAssocie | TEXT | name | string | Direct |
| Valeur Metier | ERM_BienSupportAssocie | TEXT | businessValueId | string | Lookup ID requis |
| Description | ERM_BienSupportAssocie | TEXT | description | string | Direct |
| Entite Personne Responsable | ERM_BienSupportAssocie | TEXT | ❌ MANQUANT | - | À mapper vers stakeholder |
| ❌ MANQUANT | - | - | missionId | string | À déduire via businessValue |

### **1.4 ÉVÉNEMENTS REDOUTÉS**

| Champ Access | Table Access | Type Access | Champ Firebase | Type Firebase | Mapping/Conversion |
|--------------|--------------|-------------|----------------|---------------|-------------------|
| Valeur Metier | ERM_EvenementRedoute | TEXT | businessValueId | string | Lookup ID requis |
| Evenement Redoute | ERM_EvenementRedoute | TEXT | name | string | Direct |
| Gravite | ERM_EvenementRedoute | TINYINT | gravity | GravityScale | Direct (1-4) |
| Impacts (table séparée) | ERM_EvenementRedouteImpact | TEXT | consequences | string | JOIN et concaténation |

### **1.5 SOCLE DE SÉCURITÉ**

| Champ Access | Table Access | Type Access | Champ Firebase | Type Firebase | Mapping/Conversion |
|--------------|--------------|-------------|----------------|---------------|-------------------|
| Nom du Referentiel | ERM_SocleSecurite | TEXT | name | string | Direct |
| Type de Referentiel | ERM_SocleSecurite | TEXT | category | string | Direct |
| Etat Application | ERM_SocleSecurite | TEXT | status | string | Mapping états |
| Ecart | ERM_SocleSecuriteEcart | TEXT | gaps[].description | Gap[] | Transformation array |
| Justification Ecart | ERM_SocleSecuriteEcart | TEXT | gaps[].justification | Gap[] | À ajouter dans type |

---

## 🎯 **ATELIER 2 - SOURCES DE RISQUE**

### **2.1 SOURCES DE RISQUE**

| Champ Access | Table Access | Type Access | Champ Firebase | Type Firebase | Mapping/Conversion |
|--------------|--------------|-------------|----------------|---------------|-------------------|
| Source de Risque | ERM_SourceRisque | TEXT | name | string | Direct |
| ❌ MANQUANT | - | - | description | string | Générer automatiquement |
| ❌ MANQUANT | - | - | category | enum | Déduire du nom |
| ❌ MANQUANT | - | - | missionId | string | Contexte requis |

### **2.2 OBJECTIFS VISÉS**

| Champ Access | Table Access | Type Access | Champ Firebase | Type Firebase | Mapping/Conversion |
|--------------|--------------|-------------|----------------|---------------|-------------------|
| Source de Risque | ERM_ObjectifVise | TEXT | ❌ Parent RiskSource | - | Relation inversée |
| Objectif Vise | ERM_ObjectifVise | TEXT | objectives[].name | RiskObjective[] | Embarqué dans RiskSource |
| Motivation | ERM_ObjectifVise | TINYINT | motivation | LikelihoodScale | Conversion 1-3 → 1-4 |
| Ressource | ERM_ObjectifVise | TINYINT | resources | enum | Mapping numérique→texte |
| Activite | ERM_ObjectifVise | TINYINT | ❌ MANQUANT | - | À ajouter |
| Pertinence retenue | ERM_ObjectifVise | TINYINT | pertinence | LikelihoodScale | Conversion échelle |
| Retenu | ERM_ObjectifVise | BOOLEAN | ❌ Filtrage | - | Exclure si false |

---

## 🔀 **ATELIER 3 - SCÉNARIOS STRATÉGIQUES**

### **3.1 PARTIES PRENANTES**

| Champ Access | Table Access | Type Access | Champ Firebase | Type Firebase | Mapping/Conversion |
|--------------|--------------|-------------|----------------|---------------|-------------------|
| Categorie | ERM_PartiePrenante | TEXT | type | enum | Mapping catégories |
| Partie Prenante | ERM_PartiePrenante | TEXT | name | string | Direct |
| Dependance | ERM_PartiePrenante | TINYINT | ❌ MANQUANT | - | À ajouter |
| Penetration | ERM_PartiePrenante | TINYINT | ❌ MANQUANT | - | À ajouter |
| Exposition | ERM_PartiePrenante | TINYINT | exposureLevel | LikelihoodScale | Conversion échelle |
| Maturite Cyber | ERM_PartiePrenante | TINYINT | ❌ MANQUANT | - | À ajouter |
| Confiance | ERM_PartiePrenante | TINYINT | ❌ MANQUANT | - | À ajouter |
| Fiabilite Cyber | ERM_PartiePrenante | INTEGER | cyberReliability | GravityScale | Conversion échelle |

### **3.2 CHEMINS D'ATTAQUE**

| Champ Access | Table Access | Type Access | Champ Firebase | Type Firebase | Mapping/Conversion |
|--------------|--------------|-------------|----------------|---------------|-------------------|
| Source de Risque | ERM_CheminAttaque | TEXT | ❌ Via StrategicScenario | - | Relation parent |
| Objectif Vise | ERM_CheminAttaque | TEXT | ❌ Via StrategicScenario | - | Relation parent |
| Chemin Attaque | ERM_CheminAttaque | TEXT | name/description | string | Direct |
| Partie Prenante | ERM_CheminAttaque | TEXT/NULL | stakeholderId | string | NULL → attaque directe |
| Gravite | ERM_CheminAttaque | TINYINT | gravity | GravityScale | Direct |

---

## ⚡ **ATELIER 4 - SCÉNARIOS OPÉRATIONNELS**

### **4.1 GRAPHE D'ATTAQUE**

| Champ Access | Table Access | Type Access | Champ Firebase | Type Firebase | Mapping/Conversion |
|--------------|--------------|-------------|----------------|---------------|-------------------|
| Chemin Attaque | ERM_GrapheAttaqueAction | TEXT | attackPathId | string | Lookup ID |
| Sequence Type Attaque | ERM_GrapheAttaqueAction | TEXT | ❌ MANQUANT | - | À ajouter dans AttackAction |
| Numero Action Elementaire | ERM_GrapheAttaqueAction | TINYINT | sequence | number | Direct |
| Precedent Numero Action | ERM_GrapheAttaqueAction | TINYINT | ❌ MANQUANT | - | À ajouter |
| Action Elementaire | ERM_GrapheAttaqueAction | TEXT | name | string | Direct |
| Suivant Numero Action | ERM_GrapheAttaqueAction | TINYINT | ❌ MANQUANT | - | À ajouter |
| Mode Operatoire | ERM_GrapheAttaqueAction | TEXT | technique | string | Direct |
| Canal Exfiltration | ERM_GrapheAttaqueAction | TEXT | ❌ MANQUANT | - | À ajouter |
| Probabilite Succes | ERM_GrapheAttaqueAction | TINYINT | ❌ difficulty | LikelihoodScale | Inverser logique |
| Difficulte Technique | ERM_GrapheAttaqueAction | TINYINT | difficulty | LikelihoodScale | Direct |

---

## 🛡️ **ATELIER 5 - TRAITEMENT DU RISQUE**

### **5.1 SCÉNARIOS DE RISQUE**

| Champ Access | Table Access | Type Access | Champ Firebase | Type Firebase | Mapping/Conversion |
|--------------|--------------|-------------|----------------|---------------|-------------------|
| Id Scenario Risque | ERM_ScenarioRisque | TEXT | id | string | Direct |
| Source Risque | ERM_ScenarioRisque | TEXT | riskSourceId | string | Lookup ID |
| Objectif Vise | ERM_ScenarioRisque | TEXT | ❌ Via relations | - | Complexe |
| Valeur Metier | ERM_ScenarioRisque | TEXT | targetBusinessValueId | string | Lookup ID |
| Canal Exfiltration | ERM_ScenarioRisque | TEXT | ❌ MANQUANT | - | À ajouter |
| Partie Prenante | ERM_ScenarioRisque | TEXT/NULL | ❌ Via AttackPath | - | Relation |
| Description Scenario Risque | ERM_ScenarioRisque | TEXT | description | string | Direct |
| Gravite | ERM_ScenarioRisque | TINYINT | gravity | GravityScale | Direct |
| Vraisemblance | ERM_ScenarioRisque | TINYINT | likelihood | LikelihoodScale | Direct |
| Gravite Residuel | ERM_ScenarioRisque | TINYINT | ❌ Via implementation | - | Structure différente |
| Vraisemblance Residuel | ERM_ScenarioRisque | TINYINT | ❌ Via implementation | - | Structure différente |

### **5.2 PLAN DE SÉCURITÉ**

| Champ Access | Table Access | Type Access | Champ Firebase | Type Firebase | Mapping/Conversion |
|--------------|--------------|-------------|----------------|---------------|-------------------|
| Mesure Securite | ERM_PlanSecurite | TEXT | name | string | Direct |
| Type Mesure | ERM_PlanSecurite | TEXT | controlType | enum | Mapping types |
| Frein Difficulte MEO | ERM_PlanSecurite | TEXT | ❌ MANQUANT | - | À ajouter |
| Cout Complexite | ERM_PlanSecurite | TINYINT | implementationCost | enum | Conversion 1-4→low/medium/high |
| Echeance em mois | ERM_PlanSecurite | TINYINT | dueDate | string | Calcul date |
| Status | ERM_PlanSecurite | TEXT | status | enum | Mapping statuts |
| Responsable (table séparée) | ERM_PlanSecuriteResponsable | TEXT | responsibleParty | string | JOIN tables |
| ❌ MANQUANT | - | - | isoCategory | string | Requis dans Firebase |
| ❌ MANQUANT | - | - | isoControl | string | Requis dans Firebase |

---

## 🔄 **RÈGLES DE CONVERSION GLOBALES**

### **1. Identifiants**
- Access : Clés textuelles (noms)
- Firebase : UUIDs générés
- **Solution :** Table de mapping lors de l'import

### **2. Relations**
- Access : Jointures par noms
- Firebase : Références par IDs
- **Solution :** Résolution des références lors de l'import

### **3. Timestamps**
- Access : Aucun
- Firebase : createdAt/updatedAt partout
- **Solution :** Générer lors de l'import

### **4. Échelles**
- Access : Variables (1-3, 1-4, 1-5)
- Firebase : Standardisé 1-4
- **Solution :** Fonctions de conversion

### **5. Énumérations**
- Access : Texte libre ou codes
- Firebase : Enums stricts
- **Solution :** Tables de mapping + valeurs par défaut

---

*Document de référence pour l'implémentation du convertisseur Access ↔ Firebase*  
*Expert EBIOS RM - Décembre 2024* 