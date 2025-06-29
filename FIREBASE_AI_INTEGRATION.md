# 🚀 Intégration Firebase + AI dans EBIOS RM

## 📊 Vue d'ensemble

L'application EBIOS RM intègre maintenant un enrichissement automatique par IA de toutes les entités créées ou modifiées. Cette intégration assure la cohérence entre les types TypeScript enrichis et les données persistées dans Firebase.

## 🏗️ Architecture

### 1. Types enrichis (Frontend)
Tous les types EBIOS ont été étendus avec des métadonnées AI et des champs de compatibilité Access :

- **BusinessValue** : `aiMetadata` (suggestions de catégorie, analyse d'impact, recommandations)
- **DreadedEvent** : `aiAnalysis` (sévérité, effets en cascade, probabilité)
- **RiskSource** : `aiProfile` (niveau de menace, actions prédites, défenses recommandées)
- **AttackPath** : `aiMetadata` (complexité, analyse des vecteurs, contre-mesures)
- **SecurityMeasure** : `aiMetadata` (suggestions ISO 27001, analyse d'efficacité)
- **SupportingAsset** : `aiSuggestions` (vulnérabilités, dépendances, mesures de protection)

### 2. Service d'enrichissement AI
Le service `AIEnrichmentService` fournit des méthodes statiques pour enrichir chaque type d'entité :

```typescript
// Exemple d'utilisation
const enrichedValue = AIEnrichmentService.enrichBusinessValue(businessValue);
```

### 3. Services Firebase modifiés
Tous les services Firebase appellent automatiquement l'enrichissement AI :

```typescript
// Avant
const docRef = await addDoc(collection(db, COLLECTION_NAME), {
  ...value,
  createdAt: new Date().toISOString()
});

// Après
const enrichedValue = AIEnrichmentService.enrichBusinessValue(value);
const docRef = await addDoc(collection(db, COLLECTION_NAME), {
  ...enrichedValue,
  createdAt: new Date().toISOString()
});
```

## 🔄 Flux de données

1. **Création via formulaire** :
   - Utilisateur remplit le formulaire
   - Données envoyées au service Firebase
   - Service enrichit avec l'AI
   - Données enrichies persistées dans Firestore

2. **Import Access** :
   - Fichier Access importé
   - `AccessImporter` enrichit chaque entité
   - Données enrichies envoyées aux services Firebase
   - Double enrichissement évité (détection `autoCompleted`)

3. **Lecture des données** :
   - Firebase retourne les données avec métadonnées AI
   - Composants utilisent les suggestions AI
   - Indicateurs de cohérence affichés

## 📋 Champs AI par entité

### BusinessValue.aiMetadata
- `autoCompleted`: boolean (true si importé d'Access)
- `suggestedCategory`: catégorie suggérée
- `coherenceScore`: score de cohérence EBIOS (0-1)
- `relatedValues`: valeurs métier liées
- `impactAnalysis`: analyse d'impact détaillée
- `recommendations`: recommandations contextuelles

### DreadedEvent.aiAnalysis
- `impactSeverity`: sévérité calculée (0-1)
- `cascadingEffects`: effets en cascade identifiés
- `mitigationSuggestions`: suggestions de mitigation
- `probabilityAssessment`: évaluation de probabilité

### RiskSource.aiProfile
- `threatLevel`: niveau de menace global (0-1)
- `predictedActions`: actions prédites selon le profil
- `historicalPatterns`: modèles historiques
- `motivationAnalysis`: analyse des motivations
- `recommendedDefenses`: défenses recommandées

### AttackPath.aiMetadata
- `pathComplexity`: complexité du chemin (0-1)
- `successLikelihood`: probabilité de succès
- `detectionDifficulty`: difficulté de détection
- `attackVectorAnalysis`: analyse des vecteurs

### SecurityMeasure.aiMetadata
- `suggestedISO`: contrôle ISO 27001 suggéré
- `coherenceScore`: cohérence avec EBIOS RM
- `effectivenessAnalysis`: analyse d'efficacité prédictive
- `relatedMeasures`: mesures liées

## 🧪 Vérification de l'intégration

### Panneau de debug
En mode développement, le `FirebaseDebugPanel` affiche :
- État de chaque collection
- Présence des métadonnées AI
- Échantillon des données AI

### Indicateurs visuels
- Badge "IA Active" sur les cartes de mission
- Scores de cohérence dans les formulaires
- Suggestions AI en temps réel

## ⚠️ Points d'attention

1. **Performance** : L'enrichissement AI est synchrone pour l'instant
2. **Cohérence** : Les champs AI ne sont pas validés par les règles Firebase
3. **Migration** : Les données existantes n'ont pas de métadonnées AI

## 🚀 Prochaines étapes

1. Enrichissement asynchrone avec queue de traitement
2. Mise à jour des règles Firebase pour valider les champs AI
3. Script de migration pour enrichir les données existantes
4. API d'enrichissement AI externe (OpenAI, Claude)
5. Dashboard d'analyse des métadonnées AI

## 📡 État actuel

- ✅ Types enrichis avec champs AI et Access
- ✅ Services Firebase avec enrichissement automatique
- ✅ Import Access avec enrichissement AI
- ✅ Panneau de debug pour vérification
- ✅ Dashboard avec recommandations AI
- ⏳ Règles Firebase à mettre à jour
- ⏳ Migration des données existantes 

DreadedEventUtils.generateSuggestedEvents(
  newValue.name, 
  newValue.category
); 

export const MITRE_TECHNIQUES = {
  T1566: 'Phishing',
  T1078: 'Valid Accounts',
  T1190: 'Exploit Public-Facing Application',
  // ... 10 techniques
}; 

met = sources.length >= 1 && sources.every(s => s.category && s.pertinence); 

impactType: 'confidentiality', // Valeur par défaut 

const generateSuggestedObjectives = (riskSource: RiskSource, values: BusinessValue[]) 

StrategicScenarioUtils.generateSuggestedScenarios(sources, events, values) 

StrategicScenarioUtils.validateScenarioConsistency() 

case 'Chemins d\'attaque identifiés':
  met = true; // Toujours validé
  evidence = "Sera détaillé dans l'Atelier 4";