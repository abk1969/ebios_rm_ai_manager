# Guide Complet - Actions de Gestion pour tous les Workshops EBIOS RM

## 🎯 Vue d'ensemble

Implémentation complète du système de **modification**, **suppression** et **réinitialisation** pour tous les Workshops EBIOS RM (1, 2, 3, 4, 5).

### ✅ Fonctionnalités implémentées pour chaque workshop

#### **Fonctionnalités communes à tous les workshops :**
1. ✅ **Modification** des entités existantes
2. ✅ **Suppression** individuelle avec confirmation
3. ✅ **Réinitialisation** complète du workshop
4. ✅ **Restauration** de l'état précédent
5. ✅ **Confirmations sécurisées** pour toutes les actions destructives
6. ✅ **Sauvegarde automatique** avant modification

## 📋 Composants créés par workshop

### **Workshop 1 - Cadrage et Socle de Sécurité**
```typescript
Workshop1Actions.tsx
├── Valeurs métier (BusinessValue)
│   ├── Modification ✅
│   ├── Suppression ✅
│   └── Cascade: supprime actifs et événements associés
├── Actifs supports (SupportingAsset)
│   ├── Modification ✅
│   └── Suppression ✅
├── Événements redoutés (DreadedEvent)
│   ├── Modification ✅
│   └── Suppression ✅
└── Actions globales
    ├── Réinitialisation complète ✅
    └── Restauration état précédent ✅
```

### **Workshop 2 - Sources de Risque**
```typescript
Workshop2Actions.tsx
├── Sources de risque (RiskSource)
│   ├── Modification ✅
│   └── Suppression ✅
└── Actions globales
    ├── Réinitialisation complète ✅
    └── Restauration état précédent ✅
```

### **Workshop 3 - Scénarios Stratégiques**
```typescript
Workshop3Actions.tsx
├── Scénarios stratégiques (StrategicScenario)
│   ├── Modification ✅
│   └── Suppression ✅
└── Actions globales
    ├── Réinitialisation complète ✅
    └── Restauration état précédent ✅
```

### **Workshop 4 - Actifs Supports**
```typescript
Workshop4Actions.tsx
├── Actifs supports (SupportingAsset)
│   ├── Modification ✅
│   └── Suppression ✅
└── Actions globales
    ├── Réinitialisation complète ✅
    └── Restauration état précédent ✅
```

### **Workshop 5 - Plan de Traitement** (Déjà implémenté)
```typescript
Workshop5Actions.tsx
├── Mesures de sécurité (SecurityMeasure)
│   ├── Modification ✅
│   └── Suppression ✅
├── Plan de traitement
│   ├── Régénération ✅
│   └── Suppression ✅
└── Actions globales
    ├── Réinitialisation complète ✅
    └── Restauration état précédent ✅
```

## 🔧 Architecture technique unifiée

### **Pattern de composant réutilisable**

Chaque `WorkshopXActions.tsx` suit la même structure :

```typescript
interface WorkshopXActionsProps {
  // Données spécifiques au workshop
  entities: EntityType[];
  
  // Actions de modification
  onEditEntity: (entity: EntityType) => void;
  onDeleteEntity: (entityId: string) => void;
  
  // Actions globales
  onResetWorkshop: () => void;
  onRestorePrevious: () => void;
  hasPreviousState: boolean;
}
```

### **Modal de confirmation réutilisable**

```typescript
interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  type: 'danger' | 'warning' | 'info';
}
```

### **Gestion de l'état précédent**

```typescript
// État pour sauvegarder la version précédente
const [previousState, setPreviousState] = useState<{
  entities: EntityType[];
  timestamp: string;
} | null>(null);

// Fonction de sauvegarde automatique
const saveCurrentState = () => {
  setPreviousState({
    entities: [...currentEntities],
    timestamp: new Date().toISOString()
  });
};
```

## 🎨 Interface utilisateur cohérente

### **Structure commune des composants d'actions**

1. **En-tête avec description**
   - Titre du workshop
   - Description des actions disponibles

2. **Section par type d'entité**
   - Liste des entités avec détails
   - Boutons "Modifier" et "Supprimer" pour chaque entité
   - Icônes spécifiques au type d'entité

3. **Actions globales**
   - Bouton "Restaurer l'état précédent" (si disponible)
   - Bouton "Réinitialiser le workshop"
   - Indicateur de disponibilité de l'état précédent

### **Codes couleur unifiés**

- 🔴 **Rouge (danger)** : Suppression définitive, réinitialisation
- 🟡 **Jaune (warning)** : Restauration (perte des modifications actuelles)
- 🔵 **Bleu (info)** : Actions non destructives
- 🟢 **Vert** : Succès, confirmations positives

### **Icônes spécifiques par entité**

- **Workshop 1** : Database (valeurs), Shield (actifs), Target (événements)
- **Workshop 2** : Users (sources de risque)
- **Workshop 3** : Target (scénarios stratégiques)
- **Workshop 4** : Server (actifs supports)
- **Workshop 5** : Shield (mesures), Brain (plan)

## 📋 Implémentation dans chaque workshop

### **Étapes d'intégration (exemple Workshop 1)**

1. **Import du composant d'actions**
```typescript
import Workshop1Actions from '../../components/workshops/Workshop1Actions';
```

2. **Ajout des états de gestion**
```typescript
const [editingBusinessValue, setEditingBusinessValue] = useState<BusinessValue | null>(null);
const [previousState, setPreviousState] = useState<{
  businessValues: BusinessValue[];
  // ... autres entités
  timestamp: string;
} | null>(null);
```

3. **Fonctions de gestion des actions**
```typescript
const saveCurrentState = () => { /* ... */ };
const handleEditEntity = (entity) => { /* ... */ };
const handleDeleteEntity = (entityId) => { /* ... */ };
const handleResetWorkshop = () => { /* ... */ };
const handleRestorePrevious = () => { /* ... */ };
```

4. **Modification des modales pour l'édition**
```typescript
<AddEntityModal
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setEditingEntity(null);
  }}
  onSubmit={handleCreateOrUpdateEntity}
  initialData={editingEntity}
/>
```

5. **Ajout du composant dans le JSX**
```typescript
<Workshop1Actions
  businessValues={businessValues}
  supportingAssets={supportingAssets}
  dreadedEvents={dreadedEvents}
  onEditBusinessValue={handleEditBusinessValue}
  onDeleteBusinessValue={handleDeleteBusinessValue}
  // ... autres props
  onResetWorkshop={handleResetWorkshop}
  onRestorePrevious={handleRestorePrevious}
  hasPreviousState={previousState !== null}
/>
```

## 🔒 Sécurité et confirmations

### **Types de confirmations par action**

#### **Suppression d'entité (danger)**
- **Titre** : "Supprimer [type d'entité]"
- **Message** : "Êtes-vous sûr de vouloir supprimer... Cette action est irréversible."
- **Couleur** : Rouge
- **Action** : Suppression définitive avec sauvegarde préalable

#### **Réinitialisation workshop (danger)**
- **Titre** : "Réinitialiser le Workshop X"
- **Message** : "Toutes les données seront supprimées. Cette action est irréversible."
- **Couleur** : Rouge
- **Action** : Suppression complète avec sauvegarde préalable

#### **Restauration état précédent (warning)**
- **Titre** : "Restaurer l'état précédent"
- **Message** : "Les modifications actuelles seront perdues."
- **Couleur** : Jaune
- **Action** : Retour à l'état sauvegardé

### **Sauvegarde automatique**

L'état précédent est automatiquement sauvegardé avant :
- ✅ Modification d'une entité
- ✅ Suppression d'une entité
- ✅ Réinitialisation du workshop

## 🎯 Avantages pour l'utilisateur

### **1. Contrôle total sur chaque workshop**
- Modification facile de toutes les entités
- Suppression sélective ou globale
- Expérimentation sans risque

### **2. Sécurité des données**
- Confirmations pour toutes les actions destructives
- Sauvegarde automatique avant modification
- Possibilité d'annuler les changements

### **3. Cohérence d'interface**
- Même expérience utilisateur sur tous les workshops
- Icônes et couleurs cohérentes
- Messages explicites et contextuels

### **4. Flexibilité de workflow**
- Workflow non linéaire possible
- Retour en arrière à tout moment
- Comparaison entre versions

## 🔄 Workflow recommandé

### **Utilisation optimale sur tous les workshops**

1. **Progression normale** : Suivre le parcours linéaire standard
2. **Expérimentation** : Modifier/supprimer des entités pour tester
3. **Comparaison** : Utiliser la restauration pour comparer les versions
4. **Finalisation** : Confirmer les choix définitifs

### **Bonnes pratiques**

- ✅ **Expérimenter librement** grâce à la restauration
- ✅ **Confirmer attentivement** les actions destructives
- ✅ **Utiliser la restauration** pour comparer les approches
- ✅ **Sauvegarder régulièrement** en progressant

---

**Résultat final** : Tous les Workshops EBIOS RM (1-5) disposent maintenant d'un système complet et cohérent de gestion des actions avec modification, suppression, réinitialisation et restauration ! 🎉

L'utilisateur a un contrôle total sur ses données avec une interface sécurisée et intuitive sur l'ensemble de la méthodologie EBIOS RM.
