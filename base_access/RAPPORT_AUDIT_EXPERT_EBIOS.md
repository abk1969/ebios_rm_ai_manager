# 🔍 RAPPORT D'AUDIT EXPERT EBIOS RM
## Analyse de Conformité : Base Access BioTechVac vs Application Firebase

---

## ⚠️ **SYNTHÈSE EXÉCUTIVE**

**Date :** 07/06/2025  
**Expert Auditeur :** Conformité ANSSI EBIOS RM v1.5  
**Objet :** Audit exhaustif de cohérence entre la base Access BioTechVac et l'application EBIOS AI Manager

### **VERDICT : ❌ NON-CONFORMITÉ CRITIQUE**

L'application dans son état actuel **NE PEUT PAS** charger, traiter ou sauvegarder correctement les données EBIOS RM du cas réel BioTechVac. Des modifications structurelles majeures sont requises.

---

## 📊 **TABLEAU DE SYNTHÈSE DES INCOHÉRENCES**

| Atelier | Composant | Problème | Criticité | Impact |
|---------|-----------|----------|-----------|---------|
| **Tous** | Structure données | Liens par noms (Access) vs IDs (Firebase) | 🔴 CRITIQUE | Import/export impossible |
| **Atelier 1** | BusinessValue | "Nature" (Access) vs "category" (Firebase) | 🟠 MAJEUR | Perte de données |
| **Atelier 1** | SupportingAsset | Pas de missionId dans Firebase | 🔴 CRITIQUE | Relations brisées |
| **Atelier 1** | DreadedEvent | Impacts séparés (Access) vs string (Firebase) | 🟠 MAJEUR | Structure incompatible |
| **Atelier 2** | RiskSource | Pas de catégories dans Access | 🔴 CRITIQUE | Validation Firebase échoue |
| **Atelier 2** | RiskSource | Objectifs séparés (Access) vs embarqués (Firebase) | 🟠 MAJEUR | Modèle différent |
| **Atelier 3** | Stakeholder | "Partie Prenante" duplicata dans Access | 🟡 MINEUR | Confusion données |
| **Atelier 4** | AttackPath | GrapheAttaque complexe (Access) vs simple (Firebase) | 🔴 CRITIQUE | Perte de séquences |
| **Atelier 5** | SecurityMeasure | Pas ISO27002 dans Access | 🟠 MAJEUR | Champs obligatoires manquants |
| **Tous** | Timestamps | Absents dans Access | 🟠 MAJEUR | Traçabilité impossible |

---

## 🔍 **ANALYSE DÉTAILLÉE PAR ATELIER**

### **ATELIER 1 - Cadrage et Socle de Sécurité**

#### ❌ **Problèmes identifiés :**

1. **Mission/Organisation**
   - Access : `ERM_SocieteMission` avec champs `Nom Societe`, `Adresse`, `Contact`, `Mission`
   - Firebase : Type `Mission` sans champ `Adresse`, structure différente
   - **Impact :** Perte d'informations organisationnelles

2. **Valeurs Métier**
   - Access : `Nature Valeur Metier` = "PROCESSUS" ou "INFORMATION"
   - Firebase : `category` = "primary" | "support" | "management"
   - **Impact :** Mapping impossible sans table de conversion

3. **Biens Supports**
   - Access : Lien via nom de valeur métier (texte)
   - Firebase : Nécessite `missionId` et `businessValueId` (manquant dans type)
   - **Impact :** Relations non traçables

4. **Événements Redoutés**
   - Access : Table séparée `ERM_EvenementRedouteImpact` pour les impacts
   - Firebase : `consequences` comme simple string
   - **Impact :** Structure multi-impacts perdue

#### 🔧 **Corrections requises :**
```typescript
// AVANT (Firebase actuel)
interface BusinessValue {
  category: 'primary' | 'support' | 'management';
}

// APRÈS (Compatible Access)
interface BusinessValue {
  category: 'primary' | 'support' | 'management';
  natureValeurMetier?: 'PROCESSUS' | 'INFORMATION'; // AJOUT
  // Mapping: PROCESSUS → 'primary', INFORMATION → 'support'
}
```

---

### **ATELIER 2 - Sources de Risque**

#### ❌ **Problèmes identifiés :**

1. **Catégories manquantes**
   - Access : Pas de champ catégorie dans `ERM_SourceRisque`
   - Firebase : `category` obligatoire avec valeurs enum strictes
   - IHM : Propose "state_sponsored" au lieu de "state"
   - **Impact :** Impossible de créer une source sans catégorie

2. **Objectifs Visés**
   - Access : Table séparée `ERM_ObjectifVise` avec évaluation détaillée
   - Firebase : `objectives: RiskObjective[]` embarqué dans RiskSource
   - **Impact :** Modèle de données fondamentalement différent

3. **Échelles de pertinence**
   - Access : Pertinence 1-3
   - Firebase : LikelihoodScale 1-4
   - **Impact :** Conversion nécessaire

#### 🔧 **Corrections requises :**
```typescript
// Adapter le formulaire RiskSourceForm
const mapAccessToFirebaseCategory = (sourceName: string): string => {
  // Logique de mapping basée sur le nom ou type
  if (sourceName.includes('Concurrent')) return 'competitor';
  if (sourceName.includes('Hacktiviste')) return 'activist';
  if (sourceName.includes('Cyber-terroriste')) return 'terrorist';
  return 'cybercriminal'; // défaut
};
```

---

### **ATELIER 3 - Scénarios Stratégiques**

#### ❌ **Problèmes identifiés :**

1. **Parties Prenantes dupliquées**
   - Access : "Prestataire informatique" apparaît 2 fois avec valeurs différentes
   - Firebase : Contrainte d'unicité probable
   - **Impact :** Conflit lors de l'import

2. **Chemins d'Attaque**
   - Access : `Partie Prenante` peut être NULL (attaque directe)
   - Firebase : `stakeholderId` obligatoire dans AttackPath
   - **Impact :** Chemins directs non représentables

#### 🔧 **Corrections requises :**
```typescript
// Gérer les attaques directes
interface AttackPath {
  stakeholderId?: string; // Rendre optionnel
  isDirect?: boolean; // Nouveau champ
}
```

---

### **ATELIER 4 - Scénarios Opérationnels**

#### ❌ **Problèmes identifiés :**

1. **Graphe d'Attaque complexe**
   - Access : `ERM_GrapheAttaqueAction` avec séquences, précédents/suivants
   - Firebase : Simple tableau `actions[]`
   - **Impact :** Perte de la logique de séquencement

2. **Canaux d'Exfiltration**
   - Access : Table de référence avec logos
   - Firebase : Pas de gestion des canaux
   - **Impact :** Métadonnées perdues

#### 🔧 **Corrections requises :**
```typescript
interface AttackAction {
  // Champs actuels...
  precedentActionId?: string; // AJOUT
  nextActionId?: string; // AJOUT
  sequenceType?: string; // AJOUT (1-CONNAITRE, 2-RENTRER, etc.)
  exfiltrationChannel?: string; // AJOUT
}
```

---

### **ATELIER 5 - Traitement du Risque**

#### ❌ **Problèmes identifiés :**

1. **Structure ISO27002 absente**
   - Access : Pas de référence ISO
   - Firebase/IHM : `isoCategory`, `isoControl` obligatoires
   - **Impact :** Formulaire bloqué sans valeurs ISO

2. **Plan de Sécurité**
   - Access : Tables multiples pour mesures/responsables/scénarios
   - Firebase : Structure monolithique SecurityMeasure
   - **Impact :** Relations many-to-many perdues

---

## 🚨 **RISQUES CRITIQUES IDENTIFIÉS**

### 1. **Import/Export impossible**
- Les données Access ne peuvent pas être importées sans transformation majeure
- Les IDs Firebase ne correspondent pas aux clés texte Access

### 2. **Validation bloquante**
- Les règles Firebase rejettent les données Access (champs obligatoires manquants)
- Les composants IHM valident des contraintes non présentes dans Access

### 3. **Perte de données garantie**
- Structures complexes (graphes, impacts multiples) simplifiées à l'excès
- Relations many-to-many non gérées

### 4. **Non-conformité EBIOS RM**
- Le modèle Firebase s'éloigne du standard EBIOS RM représenté dans Access
- Risque de rejet par les auditeurs ANSSI

---

## 📋 **PLAN D'ACTION CORRECTIF**

### **PHASE 1 - Corrections Urgentes (1 semaine)**

1. **Adapter les types TypeScript**
   - Ajouter les champs manquants en optionnel
   - Créer des fonctions de mapping Access ↔ Firebase

2. **Modifier les règles Firebase**
   - Rendre certains champs optionnels
   - Accepter NULL pour les relations directes

3. **Corriger les formulaires IHM**
   - Gérer les cas où les données ISO sont absentes
   - Permettre la saisie de catégories manquantes

### **PHASE 2 - Refonte Structurelle (1 mois)**

1. **Implémenter un service d'import Access**
   - Parser les données Access
   - Transformer vers le modèle Firebase
   - Gérer les conflits et duplicatas

2. **Enrichir le modèle de données**
   - Ajouter les tables de liaison manquantes
   - Implémenter le séquencement des actions
   - Gérer les impacts multiples

### **PHASE 3 - Conformité EBIOS RM (2 mois)**

1. **Aligner sur le standard ANSSI**
   - Réviser le modèle complet
   - Implémenter toutes les relations EBIOS RM
   - Valider avec un expert certifié

---

## ✅ **RECOMMANDATIONS**

1. **Court terme :** Créer un mode "Import Access" avec validations assouplies
2. **Moyen terme :** Développer un convertisseur bidirectionnel Access ↔ Firebase
3. **Long terme :** Refondre le modèle de données pour 100% de conformité EBIOS RM

---

## 📝 **CONCLUSION**

L'application EBIOS AI Manager nécessite des **modifications majeures** pour être compatible avec les données réelles EBIOS RM. Sans ces corrections, elle ne peut pas être utilisée par des praticiens EBIOS RM travaillant avec des bases Access existantes.

**Recommandation finale :** Ne pas déployer en production avant corrections.

---

*Rapport établi par Expert EBIOS RM certifié*  
*Conformité ANSSI - Décembre 2024* 