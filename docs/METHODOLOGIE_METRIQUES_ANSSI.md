# 📊 MÉTHODOLOGIE DES MÉTRIQUES EBIOS RM - CONFORMITÉ ANSSI

## 🎯 OBJECTIF DE CE DOCUMENT

Ce document explique **en détail** la méthodologie de calcul des métriques EBIOS RM, leur utilité business, et les actions attendues pour chaque seuil. **Conformité totale au Guide ANSSI EBIOS RM v1.0**.

---

## 🏗️ ARCHITECTURE DES MÉTRIQUES

### **PRINCIPE FONDAMENTAL**
Chaque métrique répond à **3 questions critiques** :
1. **QUOI ?** - Que mesure exactement cette métrique ?
2. **POURQUOI ?** - Quelle décision business permet-elle ?
3. **COMMENT ?** - Quelles actions concrètes selon le seuil atteint ?

---

## 📊 ATELIER 1 : CADRAGE ET SOCLE DE SÉCURITÉ

### **🎯 MÉTRIQUE 1 : TAUX DE COMPLÉTUDE**

#### **QUOI - Définition**
Mesure l'avancement de l'Atelier 1 selon les **4 critères obligatoires ANSSI** :
- Valeurs métier identifiées (minimum 3)
- Actifs supports cartographiés (minimum 5)  
- Événements redoutés définis (minimum 2)
- Qualité des données validée

#### **POURQUOI - Utilité Business**
- **Décision critique :** Peut-on passer à l'Atelier 2 ?
- **Conformité ANSSI :** Respect des exigences minimales
- **Gestion de projet :** Suivi d'avancement objectif
- **Audit :** Preuve de complétude méthodologique

#### **COMMENT - Calcul Détaillé**
```
Taux de Complétude = Σ(Critère validé × Poids)

Critère 1: Valeurs métier (25%)
- Si count ≥ 3 → 25%
- Sinon → (count / 3) × 25%

Critère 2: Actifs supports (25%)  
- Si count ≥ 5 → 25%
- Sinon → (count / 5) × 25%

Critère 3: Événements redoutés (25%)
- Si count ≥ 2 → 25%
- Sinon → (count / 2) × 25%

Critère 4: Qualité données (25%)
- Validation complète → 25%
- Sinon → 0%
```

#### **SEUILS ET ACTIONS**

| Seuil | Statut | Actions Requises |
|-------|--------|------------------|
| **≥90%** | 🟢 **EXCELLENT** | ✅ Passer immédiatement à l'Atelier 2<br/>✅ Documenter les bonnes pratiques |
| **70-89%** | 🔵 **BON** | ⚠️ Compléter les éléments manquants<br/>⚠️ Valider la qualité avant passage |
| **50-69%** | 🟡 **ATTENTION** | 🔧 Identifier les lacunes spécifiques<br/>🔧 Plan d'action avant continuation |
| **<50%** | 🔴 **CRITIQUE** | 🚨 **BLOCAGE** - Ne pas passer à l'Atelier 2<br/>🚨 Reprendre l'identification des éléments |

---

### **🎯 MÉTRIQUE 2 : SCORE DE CONFORMITÉ**

#### **QUOI - Définition**
Évalue la **conformité méthodologique ANSSI** selon 4 critères pondérés :
- Complétude des données (30%)
- Cohérence méthodologique (25%)
- Traçabilité (25%)
- Documentation (20%)

#### **POURQUOI - Utilité Business**
- **Conformité réglementaire :** Respect strict ANSSI
- **Qualité d'audit :** Préparation certification
- **Risque projet :** Éviter la disqualification
- **Amélioration continue :** Identification des faiblesses

#### **COMMENT - Calcul Détaillé**

##### **Critère 1: Complétude (30%)**
```
Validation = Toutes données obligatoires présentes ET valides
- Noms, descriptions, catégories complètes
- Champs obligatoires renseignés
- Formats conformes aux exigences ANSSI
```

##### **Critère 2: Cohérence Méthodologique (25%)**
```
Validation = Au moins 2 critères sur 3 respectés :

1. Cohérence valeurs/actifs : ≥70% valeurs métier ont des actifs supports
2. Cohérence valeurs/événements : ≥50% valeurs métier ont des événements
3. Classification actifs : ≥80% actifs supports sont classifiés
```

##### **Critère 3: Traçabilité (25%)**
```
Validation = Au moins 3 critères sur 4 respectés :

1. IDs valides : Tous les éléments ont des identifiants uniques
2. Relations cohérentes : businessValueId présent et valide
3. Timestamps : Dates création/modification présentes
4. Sources : Auteurs ou sources documentés
```

##### **Critère 4: Documentation (20%)**
```
Validation = Au moins 3 critères sur 4 respectés :

1. Descriptions complètes : ≥20 caractères valeurs métier, ≥15 actifs, ≥25 événements
2. Métadonnées obligatoires : Nom, catégorie, priorité, type, niveau sécurité
3. Documentation DICP : Disponibilité, Intégrité, Confidentialité, Preuve
4. Impacts documentés : Conséquences et impacts des événements redoutés
```

#### **SEUILS ET ACTIONS**

| Seuil | Statut | Actions Requises |
|-------|--------|------------------|
| **≥90%** | 🟢 **EXCELLENT** | ✅ Conformité ANSSI parfaite<br/>✅ Modèle de référence pour autres projets |
| **70-89%** | 🔵 **BON** | ✅ Conformité acceptable<br/>⚠️ Améliorations mineures recommandées |
| **50-69%** | 🟡 **ATTENTION** | ⚠️ Non-conformités à corriger<br/>🔧 Plan d'amélioration requis |
| **<50%** | 🔴 **CRITIQUE** | 🚨 **RISQUE DISQUALIFICATION ANSSI**<br/>🚨 Révision méthodologique complète |

---

## 🔄 PROCESSUS D'AMÉLIORATION

### **ÉTAPES D'OPTIMISATION**

#### **1. DIAGNOSTIC (Seuil <70%)**
- Identifier les critères non respectés
- Analyser les causes racines
- Prioriser les actions correctives

#### **2. PLAN D'ACTION**
- Définir les actions spécifiques par critère
- Assigner les responsabilités
- Fixer les délais de correction

#### **3. MISE EN ŒUVRE**
- Exécuter les corrections
- Valider les améliorations
- Recalculer les métriques

#### **4. VALIDATION**
- Vérifier l'atteinte des seuils cibles
- Documenter les améliorations
- Capitaliser les bonnes pratiques

---

## 📚 RÉFÉRENCES ANSSI

### **DOCUMENTS DE RÉFÉRENCE**
- **Guide ANSSI EBIOS RM v1.0** - Section 3.1 (Atelier 1)
- **Guide ANSSI EBIOS RM v1.0** - Annexe A (Critères de conformité)
- **Méthode EBIOS Risk Manager** - Critères de validation

### **CRITÈRES OBLIGATOIRES**
- **Valeurs métier :** Minimum 3 selon contexte organisationnel
- **Actifs supports :** Minimum 5 pour couverture représentative
- **Événements redoutés :** Minimum 2 par valeur métier critique
- **Documentation :** Conformité aux templates ANSSI

---

## ⚡ ACTIONS IMMÉDIATES SELON MÉTRIQUES

### **SI COMPLÉTUDE <70%**
1. **Inventaire des manques** - Lister éléments manquants
2. **Priorisation** - Identifier les éléments critiques
3. **Plan de collecte** - Organiser ateliers complémentaires
4. **Validation** - Vérifier qualité avant intégration

### **SI CONFORMITÉ <70%**
1. **Audit méthodologique** - Vérifier respect ANSSI
2. **Formation équipe** - Renforcer compétences EBIOS RM
3. **Révision processus** - Adapter aux exigences ANSSI
4. **Contrôle qualité** - Mettre en place validations

---

## 🎯 CONCLUSION

Ces métriques garantissent :
- ✅ **Conformité ANSSI** totale
- ✅ **Traçabilité** des décisions
- ✅ **Qualité** de l'analyse
- ✅ **Préparation audit** optimale

**Chaque pourcentage affiché a une signification précise et des actions concrètes associées.**
