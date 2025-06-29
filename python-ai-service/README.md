# 🤖 Service IA Python pour EBIOS AI Manager

Service Python avancé pour l'assistance IA dans Workshop 1 EBIOS RM, utilisant les meilleures librairies Python AI.

## 🎯 Fonctionnalités

### ✅ Assistance IA Avancée
- **Analyse contextuelle** des données Workshop 1
- **Suggestions intelligentes** basées sur l'IA
- **Analyse de cohérence** automatique
- **Guidance méthodologique** EBIOS RM
- **Auto-complétion** des éléments manquants

### 🧠 Technologies IA Intégrées
- **Transformers** (Hugging Face) pour l'analyse sémantique
- **Sentence Transformers** pour la similarité textuelle
- **Scikit-learn** pour l'analyse de données
- **FastAPI** pour l'API REST haute performance
- **Pydantic** pour la validation des données

## 🚀 Installation Rapide

### Option 1: Script Automatique (Recommandé)

```bash
# Windows
python-ai-service/start_ai_service.bat

# Linux/Mac
cd python-ai-service
python3 install_and_run.py
```

### Option 2: Installation Manuelle

```bash
cd python-ai-service

# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement (Windows)
venv\Scripts\activate

# Activer l'environnement (Linux/Mac)
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Démarrer le service
python main.py
```

## 🔧 Configuration

### Variables d'Environnement (.env)

```env
# Port du service IA
AI_SERVICE_PORT=8000

# Configuration OpenAI (optionnel)
OPENAI_API_KEY=your_openai_api_key_here

# Configuration Hugging Face (optionnel)
HUGGINGFACE_API_TOKEN=your_hf_token_here

# Mode développement
DEVELOPMENT_MODE=true
```

### Configuration Frontend

Ajoutez dans votre `.env` frontend :

```env
VITE_PYTHON_AI_SERVICE_URL=http://localhost:8000
```

## 📡 API Endpoints

### 🔍 Analyse Workshop 1
```http
POST /workshop1/analyze
Content-Type: application/json

{
  "mission_id": "mission-123",
  "business_values": [...],
  "essential_assets": [...],
  "supporting_assets": [...],
  "dreaded_events": [...],
  "current_step": "business-values"
}
```

### 💡 Suggestions Intelligentes
```http
POST /workshop1/suggestions
Content-Type: application/json

{
  "context": {...},
  "criterion": "business-values",
  "current_data": {...}
}
```

### 🔍 Analyse de Cohérence
```http
POST /workshop1/coherence
Content-Type: application/json

{
  "mission_id": "mission-123",
  "workshop_data": {...}
}
```

### 📚 Guidance Contextuelle
```http
GET /workshop1/guidance/{workshop_step}
```

## 🏗️ Architecture

```
python-ai-service/
├── main.py                    # Point d'entrée FastAPI
├── requirements.txt           # Dépendances Python
├── models/
│   └── ebios_models.py       # Modèles Pydantic
├── services/
│   ├── workshop1_ai_service.py      # Service principal Workshop 1
│   ├── suggestion_engine.py         # Moteur de suggestions
│   ├── ebios_guidance_service.py    # Service de guidance
│   └── coherence_analyzer.py        # Analyseur de cohérence
└── install_and_run.py        # Script d'installation
```

## 🔗 Intégration Frontend

### Service d'Intégration TypeScript

```typescript
import { pythonAIService } from '@/services/ai/PythonAIIntegrationService';

// Analyse Workshop 1
const analysis = await pythonAIService.analyzeWorkshop1({
  mission_id: 'mission-123',
  business_values: [...],
  essential_assets: [...],
  supporting_assets: [...],
  dreaded_events: [...]
});

// Génération de suggestions
const suggestions = await pythonAIService.generateSuggestions(
  context, 
  'business-values', 
  currentData
);
```

### Composant React Amélioré

Le composant `Workshop1AIAssistant` détecte automatiquement la disponibilité du service Python et bascule entre :

- **Mode IA Avancée** : Utilise le service Python avec toutes les fonctionnalités IA
- **Mode Local** : Utilise les suggestions de base en cas d'indisponibilité

## 📊 Fonctionnalités IA Détaillées

### 🎯 Analyse Contextuelle
- Calcul automatique des métriques de qualité
- Détection des incohérences
- Évaluation de la conformité EBIOS RM
- Estimation du temps de complétion

### 💡 Suggestions Intelligentes
- Suggestions basées sur le contexte actuel
- Adaptation selon le secteur d'activité
- Priorisation automatique des actions
- Exemples contextuels personnalisés

### 🔍 Analyse de Cohérence
- Vérification des liens entre éléments
- Détection des problèmes de structure
- Recommandations d'amélioration
- Score de cohérence global

### 📚 Guidance Méthodologique
- Aide contextuelle EBIOS RM
- Bonnes pratiques par étape
- Exemples sectoriels
- Critères de validation

## 🛠️ Mode Fallback

Le système fonctionne en mode dégradé si le service Python n'est pas disponible :

- ✅ **Suggestions de base** toujours disponibles
- ✅ **Interface utilisateur** identique
- ✅ **Fonctionnalités essentielles** préservées
- ⚠️ **Fonctionnalités IA avancées** désactivées

## 🔍 Monitoring et Debug

### Health Check
```http
GET /health
```

### Métriques
```http
GET /metrics
```

### Logs
Les logs sont disponibles dans la console du service Python avec différents niveaux :
- `INFO` : Opérations normales
- `WARNING` : Problèmes non critiques
- `ERROR` : Erreurs nécessitant attention

## 🚀 Déploiement Production

### Docker (Recommandé)

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Variables d'Environnement Production

```env
AI_SERVICE_PORT=8000
DEVELOPMENT_MODE=false
LOG_LEVEL=INFO
CORS_ORIGINS=["https://your-domain.com"]
```

## 🤝 Contribution

1. **Fork** le projet
2. **Créer** une branche feature
3. **Commiter** vos changements
4. **Pousser** vers la branche
5. **Ouvrir** une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- 📧 **Email** : support@ebios-ai-manager.com
- 🐛 **Issues** : GitHub Issues
- 📖 **Documentation** : `/docs` endpoint du service

---

**🎯 Objectif** : Transformer l'expérience utilisateur Workshop 1 avec l'IA Python avancée !
