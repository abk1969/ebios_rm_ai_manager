# 💬 Guide des Fonctionnalités d'Expansion du Chat

## 🎯 Vue d'ensemble

Le système de chat de formation EBIOS RM dispose maintenant de fonctionnalités avancées de pli/dépli automatique pour améliorer l'expérience utilisateur et permettre une visualisation confortable du chat.

## ✨ Fonctionnalités Disponibles

### 🔧 Modes de Taille

Le chat propose **4 modes de taille** différents :

1. **Compact** (`h-80`) - 320px de hauteur
   - Idéal pour un aperçu rapide
   - Messages limités à 192px de hauteur
   - Parfait pour les écrans petits

2. **Normal** (`h-96`) - 384px de hauteur (par défaut)
   - Taille équilibrée pour la plupart des usages
   - Messages limités à 288px de hauteur
   - Mode recommandé

3. **Étendu** (`h-[600px]`) - 600px de hauteur
   - Plus d'espace pour les conversations longues
   - Messages limités à 500px de hauteur
   - Idéal pour les sessions de formation intensives

4. **Plein écran** (`fixed inset-0`) - Toute la fenêtre
   - Expérience immersive complète
   - Messages adaptés à la hauteur de l'écran
   - Parfait pour les formations longues

### 🎮 Contrôles d'Interface

#### Boutons dans l'En-tête

Trois boutons sont disponibles en haut à droite du chat :

1. **🎯 Bouton de Redimensionnement**
   - Cycle entre : Compact → Normal → Étendu → Compact
   - Icône change selon le mode actuel
   - Tooltip indique le mode actuel

2. **📏 Bouton d'Expansion**
   - Bascule entre mode normal et mode étendu
   - Icône : Maximize2 / Minimize2
   - Tooltip contextuel

3. **🖥️ Bouton Plein Écran**
   - Active/désactive le mode plein écran
   - Icône : Maximize2 / Minimize2
   - Tooltip contextuel

#### ⌨️ Raccourcis Clavier

- **Ctrl+Shift+F** : Basculer le mode plein écran
- **Ctrl+Shift+E** : Basculer l'expansion
- **Ctrl+Shift+R** : Changer la taille (cycle)

### 🎨 Indicateurs Visuels

#### Badges d'État

L'en-tête du chat affiche des badges colorés pour indiquer le mode actuel :

- **🟣 Plein écran** : Badge violet "Plein écran"
- **🟢 Étendu** : Badge vert "Étendu"
- **🔵 Compact/Étendu** : Badge bleu avec le nom du mode

#### Transitions Fluides

- **Durée** : 300ms
- **Easing** : `ease-in-out`
- **Propriétés animées** : hauteur, largeur, position

## 🛠️ Implémentation Technique

### Composant Principal

```typescript
// Nouveau composant avec fonctionnalités d'expansion
import { ExpandableChatInterface } from './ExpandableChatInterface';

// Utilisation
<ExpandableChatInterface
  trainingMode="discovery"
  sessionId="session_123"
  onActivity={handleChatActivity}
/>
```

### États de Gestion

```typescript
// États pour l'expansion
const [isExpanded, setIsExpanded] = useState(false);
const [isFullscreen, setIsFullscreen] = useState(false);
const [chatHeight, setChatHeight] = useState<'compact' | 'normal' | 'expanded'>('normal');
```

### Classes CSS Dynamiques

```typescript
// Calcul des classes selon l'état
const getChatContainerClasses = () => {
  if (isFullscreen) return "fixed inset-0 z-50 h-screen";
  if (isExpanded) return "h-full min-h-[600px]";
  
  switch (chatHeight) {
    case 'compact': return "h-80 max-h-80";
    case 'expanded': return "h-[600px] max-h-[600px]";
    default: return "h-96 max-h-96";
  }
};
```

## 📊 Callbacks et Événements

### Callback onActivity

Le composant émet des événements via le callback `onActivity` :

```typescript
// Types d'activités trackées
interface ChatActivity {
  type: 'chat_resize' | 'chat_fullscreen' | 'chat_expand';
  height?: string;
  enabled?: boolean;
  expanded?: boolean;
}

// Exemple d'utilisation
const handleChatActivity = (activity: ChatActivity) => {
  console.log('Activité chat:', activity);
  // Traitement personnalisé
};
```

## 🧪 Tests et Validation

### Page de Démonstration

Accédez à `/training/validation` et sélectionnez "💬 Chat Expansible" pour :

- Tester tous les modes de taille
- Vérifier les raccourcis clavier
- Voir les événements en temps réel
- Valider les transitions

### Tests Automatisés

```typescript
// Tests des fonctionnalités d'expansion
describe('Chat Expansion', () => {
  test('should cycle through size modes', () => {
    // Test du cycle de tailles
  });
  
  test('should toggle fullscreen mode', () => {
    // Test du mode plein écran
  });
  
  test('should handle keyboard shortcuts', () => {
    // Test des raccourcis clavier
  });
});
```

## 🎯 Bonnes Pratiques

### Utilisation Recommandée

1. **Mode Normal** pour la plupart des interactions
2. **Mode Compact** sur les petits écrans ou interfaces chargées
3. **Mode Étendu** pour les conversations longues
4. **Mode Plein Écran** pour les sessions de formation intensives

### Accessibilité

- Tous les boutons ont des tooltips explicites
- Raccourcis clavier standards
- Transitions respectueuses des préférences utilisateur
- Contraste suffisant pour tous les états

### Performance

- Transitions CSS optimisées
- Pas de re-render inutile
- Gestion mémoire efficace des états
- Cleanup automatique des event listeners

## 🔧 Configuration

### Props Disponibles

```typescript
interface ExpandableChatInterfaceProps {
  userId?: string;
  sessionId?: string;
  trainingMode?: string;
  onProgressUpdate?: (progress: any) => void;
  onWorkshopChange?: (workshopId: number) => void;
  onActivity?: (activity: any) => void; // Nouveau callback
}
```

### Personnalisation CSS

Les classes peuvent être personnalisées via Tailwind :

```css
/* Personnalisation des transitions */
.chat-container {
  @apply transition-all duration-300 ease-in-out;
}

/* Personnalisation des modes */
.chat-compact { @apply h-80 max-h-80; }
.chat-normal { @apply h-96 max-h-96; }
.chat-expanded { @apply h-[600px] max-h-[600px]; }
.chat-fullscreen { @apply fixed inset-0 z-50 h-screen; }
```

## 🚀 Prochaines Améliorations

- [ ] Sauvegarde des préférences utilisateur
- [ ] Mode picture-in-picture
- [ ] Redimensionnement par glisser-déposer
- [ ] Thèmes personnalisés
- [ ] Animations avancées

---

**📝 Note :** Cette fonctionnalité améliore significativement l'expérience utilisateur en permettant une adaptation flexible de l'interface selon les besoins et le contexte d'utilisation.
