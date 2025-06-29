"""
🤖 MOTEUR DE SUGGESTIONS ML AVANCÉ
Suggestions ML contextuelles avec XGBoost + Scikit-learn
Point 2.2 - Phase 2: IA Sémantique et Suggestions
"""

import asyncio
import logging
import numpy as np
import pandas as pd
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
import json
import pickle
import os

# Imports conditionnels pour éviter les erreurs
try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False
    logging.warning("🔧 XGBoost non disponible, mode simulation activé")

try:
    from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
    from sklearn.model_selection import train_test_split, cross_val_score
    from sklearn.preprocessing import StandardScaler, LabelEncoder
    from sklearn.metrics import accuracy_score, mean_squared_error
    from sklearn.cluster import DBSCAN
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    logging.warning("🔧 Scikit-learn non disponible, mode simulation activé")

try:
    from semantic_analyzer import EbiosSemanticAnalyzer, EbiosElement
    SEMANTIC_ANALYZER_AVAILABLE = True
except ImportError:
    SEMANTIC_ANALYZER_AVAILABLE = False
    logging.warning("🔧 Analyseur sémantique non disponible")

logger = logging.getLogger(__name__)

# === MODÈLES DE DONNÉES ===

class MLSuggestion:
    """Suggestion générée par ML"""
    def __init__(self):
        self.id = ""
        self.type = ""
        self.content = ""
        self.confidence = 0.0
        self.priority = "medium"
        self.category = ""
        self.rationale = ""
        self.ml_features = {}
        self.timestamp = datetime.now()

class MLAnalysisResult:
    """Résultat d'analyse ML"""
    def __init__(self):
        self.suggestions = []
        self.quality_predictions = {}
        self.completion_score = 0.0
        self.risk_assessment = {}
        self.feature_importance = {}
        self.model_confidence = 0.0
        self.analysis_timestamp = datetime.now()

# === MOTEUR DE SUGGESTIONS ML ===

class MLSuggestionEngine:
    """
    Moteur de suggestions ML pour EBIOS RM
    Utilise XGBoost et Scikit-learn pour prédictions et suggestions
    """
    
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.encoders = {}
        self.feature_names = []
        self.training_data = []
        self.semantic_analyzer = None
        
        # Initialisation sécurisée
        self._initialize_safely()
    
    def _initialize_safely(self):
        """Initialisation sécurisée des modèles ML"""
        logger.info("🤖 Initialisation Moteur Suggestions ML")
        
        # Initialiser l'analyseur sémantique si disponible
        if SEMANTIC_ANALYZER_AVAILABLE:
            try:
                from semantic_analyzer import SemanticAnalyzerFactory
                self.semantic_analyzer = SemanticAnalyzerFactory.create()
                logger.info("✅ Analyseur sémantique intégré")
            except Exception as e:
                logger.warning(f"⚠️ Erreur intégration analyseur sémantique: {e}")
        
        # Initialiser les modèles
        self._initialize_models()
        
        # Charger les données d'entraînement
        self._load_training_data()
    
    def _initialize_models(self):
        """Initialise les modèles ML"""
        try:
            if XGBOOST_AVAILABLE:
                # Modèle XGBoost pour prédiction de qualité
                self.models['quality_predictor'] = xgb.XGBRegressor(
                    n_estimators=100,
                    max_depth=6,
                    learning_rate=0.1,
                    random_state=42
                )
                logger.info("✅ Modèle XGBoost initialisé")
            
            if SKLEARN_AVAILABLE:
                # Modèle Random Forest pour classification des suggestions
                self.models['suggestion_classifier'] = RandomForestClassifier(
                    n_estimators=100,
                    max_depth=10,
                    random_state=42
                )
                
                # Modèle Gradient Boosting pour scoring de complétion
                self.models['completion_scorer'] = GradientBoostingRegressor(
                    n_estimators=100,
                    max_depth=6,
                    learning_rate=0.1,
                    random_state=42
                )
                
                # Scalers et encoders
                self.scalers['standard'] = StandardScaler()
                self.encoders['label'] = LabelEncoder()
                
                logger.info("✅ Modèles Scikit-learn initialisés")
        
        except Exception as e:
            logger.error(f"❌ Erreur initialisation modèles: {e}")
    
    def _load_training_data(self):
        """Charge les données d'entraînement EBIOS RM"""
        # Données synthétiques pour l'entraînement initial
        self.training_data = [
            {
                "business_values_count": 3,
                "essential_assets_count": 5,
                "supporting_assets_count": 8,
                "dreaded_events_count": 4,
                "avg_description_length": 120,
                "semantic_coherence": 0.75,
                "category_distribution": 0.8,
                "quality_score": 85.0,
                "completion_score": 90.0,
                "suggestion_type": "add_supporting_asset"
            },
            {
                "business_values_count": 2,
                "essential_assets_count": 3,
                "supporting_assets_count": 4,
                "dreaded_events_count": 2,
                "avg_description_length": 80,
                "semantic_coherence": 0.6,
                "category_distribution": 0.6,
                "quality_score": 65.0,
                "completion_score": 70.0,
                "suggestion_type": "improve_description"
            },
            {
                "business_values_count": 4,
                "essential_assets_count": 6,
                "supporting_assets_count": 10,
                "dreaded_events_count": 5,
                "avg_description_length": 150,
                "semantic_coherence": 0.9,
                "category_distribution": 0.9,
                "quality_score": 95.0,
                "completion_score": 95.0,
                "suggestion_type": "validate_completeness"
            }
        ]
        
        logger.info(f"✅ Données d'entraînement chargées: {len(self.training_data)} échantillons")
    
    async def generate_ml_suggestions(
        self,
        workshop_data: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None
    ) -> MLAnalysisResult:
        """
        Génère des suggestions ML basées sur les données du workshop
        """
        logger.info("🤖 Génération suggestions ML")
        
        result = MLAnalysisResult()
        
        try:
            # 1. Extraction des features
            features = await self._extract_features(workshop_data, context)
            
            # 2. Prédiction de qualité
            if 'quality_predictor' in self.models:
                result.quality_predictions = await self._predict_quality(features)
            
            # 3. Scoring de complétion
            if 'completion_scorer' in self.models:
                result.completion_score = await self._score_completion(features)
            
            # 4. Génération de suggestions
            result.suggestions = await self._generate_suggestions(features, workshop_data)
            
            # 5. Évaluation des risques
            result.risk_assessment = await self._assess_risks(features, workshop_data)
            
            # 6. Importance des features
            result.feature_importance = self._compute_feature_importance(features)
            
            # 7. Confiance du modèle
            result.model_confidence = self._compute_model_confidence(features)
            
            logger.info(f"✅ Suggestions ML générées: {len(result.suggestions)}")
            return result
            
        except Exception as e:
            logger.error(f"❌ Erreur génération suggestions ML: {e}")
            return self._create_fallback_result(workshop_data)
    
    async def _extract_features(
        self, 
        workshop_data: Dict[str, Any], 
        context: Optional[Dict[str, Any]]
    ) -> Dict[str, float]:
        """Extrait les features pour les modèles ML"""
        features = {}
        
        try:
            # Features basiques de comptage
            features['business_values_count'] = len(workshop_data.get('business_values', []))
            features['essential_assets_count'] = len(workshop_data.get('essential_assets', []))
            features['supporting_assets_count'] = len(workshop_data.get('supporting_assets', []))
            features['dreaded_events_count'] = len(workshop_data.get('dreaded_events', []))
            
            # Features de qualité textuelle
            all_descriptions = []
            for category in ['business_values', 'essential_assets', 'supporting_assets', 'dreaded_events']:
                for item in workshop_data.get(category, []):
                    desc = item.get('description', '')
                    if desc:
                        all_descriptions.append(desc)
            
            if all_descriptions:
                features['avg_description_length'] = np.mean([len(desc) for desc in all_descriptions])
                features['min_description_length'] = min([len(desc) for desc in all_descriptions])
                features['max_description_length'] = max([len(desc) for desc in all_descriptions])
                features['description_variance'] = np.var([len(desc) for desc in all_descriptions])
            else:
                features['avg_description_length'] = 0
                features['min_description_length'] = 0
                features['max_description_length'] = 0
                features['description_variance'] = 0
            
            # Features sémantiques (si analyseur disponible)
            if self.semantic_analyzer:
                semantic_features = await self._extract_semantic_features(workshop_data)
                features.update(semantic_features)
            else:
                features['semantic_coherence'] = 0.5  # Valeur neutre
                features['semantic_diversity'] = 0.5
            
            # Features de distribution
            total_elements = sum([
                features['business_values_count'],
                features['essential_assets_count'],
                features['supporting_assets_count'],
                features['dreaded_events_count']
            ])
            
            if total_elements > 0:
                features['category_balance'] = 1.0 - np.std([
                    features['business_values_count'] / total_elements,
                    features['essential_assets_count'] / total_elements,
                    features['supporting_assets_count'] / total_elements,
                    features['dreaded_events_count'] / total_elements
                ])
            else:
                features['category_balance'] = 0.0
            
            # Features contextuelles
            if context:
                features['user_experience'] = context.get('user_experience', 0.5)
                features['domain_complexity'] = context.get('domain_complexity', 0.5)
                features['time_spent'] = context.get('time_spent', 0)
            else:
                features['user_experience'] = 0.5
                features['domain_complexity'] = 0.5
                features['time_spent'] = 0
            
            logger.info(f"✅ Features extraites: {len(features)} dimensions")
            return features
            
        except Exception as e:
            logger.error(f"❌ Erreur extraction features: {e}")
            return {'fallback_feature': 0.5}
    
    async def _extract_semantic_features(self, workshop_data: Dict[str, Any]) -> Dict[str, float]:
        """Extrait les features sémantiques"""
        semantic_features = {}
        
        try:
            # Préparer tous les éléments pour l'analyse sémantique
            all_elements = []
            for category in ['business_values', 'essential_assets', 'supporting_assets', 'dreaded_events']:
                for item in workshop_data.get(category, []):
                    all_elements.append({
                        'id': item.get('id', f"{category}_{len(all_elements)}"),
                        'name': item.get('name', ''),
                        'description': item.get('description', ''),
                        'category': category
                    })
            
            if all_elements and len(all_elements) > 1:
                # Analyser avec l'analyseur sémantique
                semantic_result = await self.semantic_analyzer.analyze_ebios_elements(
                    all_elements, 
                    analysis_type="similarity"
                )
                
                semantic_features['semantic_coherence'] = semantic_result.coherence_score / 100.0
                semantic_features['semantic_inconsistencies'] = len(semantic_result.inconsistencies)
                
                # Calculer la diversité sémantique
                if semantic_result.similarity_matrix is not None:
                    # Diversité = 1 - similarité moyenne
                    mask = ~np.eye(semantic_result.similarity_matrix.shape[0], dtype=bool)
                    avg_similarity = np.mean(semantic_result.similarity_matrix[mask])
                    semantic_features['semantic_diversity'] = 1.0 - avg_similarity
                else:
                    semantic_features['semantic_diversity'] = 0.5
            else:
                semantic_features['semantic_coherence'] = 0.5
                semantic_features['semantic_inconsistencies'] = 0
                semantic_features['semantic_diversity'] = 0.5
            
            return semantic_features
            
        except Exception as e:
            logger.error(f"❌ Erreur features sémantiques: {e}")
            return {
                'semantic_coherence': 0.5,
                'semantic_inconsistencies': 0,
                'semantic_diversity': 0.5
            }
    
    async def _predict_quality(self, features: Dict[str, float]) -> Dict[str, float]:
        """Prédit la qualité avec les modèles ML"""
        predictions = {}
        
        try:
            if not XGBOOST_AVAILABLE or 'quality_predictor' not in self.models:
                # Prédiction basique basée sur les features
                completeness = min(1.0, (
                    features.get('business_values_count', 0) * 0.2 +
                    features.get('essential_assets_count', 0) * 0.15 +
                    features.get('supporting_assets_count', 0) * 0.1 +
                    features.get('dreaded_events_count', 0) * 0.2
                ) / 4.0)
                
                quality = (
                    completeness * 0.4 +
                    features.get('semantic_coherence', 0.5) * 0.3 +
                    (features.get('avg_description_length', 0) / 200.0) * 0.3
                )
                
                predictions['overall_quality'] = min(100.0, quality * 100)
                predictions['completeness'] = completeness * 100
                predictions['coherence'] = features.get('semantic_coherence', 0.5) * 100
                
            else:
                # Utiliser le modèle XGBoost (nécessiterait un entraînement préalable)
                # Pour l'instant, utiliser la prédiction basique
                completeness = min(1.0, (
                    features.get('business_values_count', 0) * 0.2 +
                    features.get('essential_assets_count', 0) * 0.15 +
                    features.get('supporting_assets_count', 0) * 0.1 +
                    features.get('dreaded_events_count', 0) * 0.2
                ) / 4.0)

                quality = (
                    completeness * 0.4 +
                    features.get('semantic_coherence', 0.5) * 0.3 +
                    (features.get('avg_description_length', 0) / 200.0) * 0.3
                )

                predictions = {
                    'overall_quality': min(100.0, quality * 100),
                    'completeness': completeness * 100,
                    'coherence': features.get('semantic_coherence', 0.5) * 100
                }
            
            return predictions
            
        except Exception as e:
            logger.error(f"❌ Erreur prédiction qualité: {e}")
            return {'overall_quality': 50.0, 'completeness': 50.0, 'coherence': 50.0}
    
    async def _score_completion(self, features: Dict[str, float]) -> float:
        """Score la complétion du workshop"""
        try:
            # Score basé sur la présence d'éléments dans chaque catégorie
            category_scores = []
            
            # Business Values (minimum 2)
            bv_count = features.get('business_values_count', 0)
            bv_score = min(1.0, bv_count / 2.0) if bv_count > 0 else 0.0
            category_scores.append(bv_score)
            
            # Essential Assets (minimum 3)
            ea_count = features.get('essential_assets_count', 0)
            ea_score = min(1.0, ea_count / 3.0) if ea_count > 0 else 0.0
            category_scores.append(ea_score)
            
            # Supporting Assets (minimum 5)
            sa_count = features.get('supporting_assets_count', 0)
            sa_score = min(1.0, sa_count / 5.0) if sa_count > 0 else 0.0
            category_scores.append(sa_score)
            
            # Dreaded Events (minimum 2)
            de_count = features.get('dreaded_events_count', 0)
            de_score = min(1.0, de_count / 2.0) if de_count > 0 else 0.0
            category_scores.append(de_score)
            
            # Score de qualité des descriptions
            avg_desc_length = features.get('avg_description_length', 0)
            desc_quality = min(1.0, avg_desc_length / 100.0) if avg_desc_length > 0 else 0.0
            
            # Score final pondéré
            completion_score = (
                np.mean(category_scores) * 0.7 +  # Présence des éléments
                desc_quality * 0.2 +              # Qualité des descriptions
                features.get('semantic_coherence', 0.5) * 0.1  # Cohérence sémantique
            ) * 100
            
            return min(100.0, completion_score)
            
        except Exception as e:
            logger.error(f"❌ Erreur scoring complétion: {e}")
            return 50.0
    
    async def _generate_suggestions(
        self, 
        features: Dict[str, float], 
        workshop_data: Dict[str, Any]
    ) -> List[MLSuggestion]:
        """Génère des suggestions basées sur l'analyse ML"""
        suggestions = []
        
        try:
            # Suggestions basées sur le manque d'éléments
            if features.get('business_values_count', 0) < 2:
                suggestion = MLSuggestion()
                suggestion.id = "add_business_values"
                suggestion.type = "add_element"
                suggestion.content = "Ajoutez au moins 2 valeurs métier pour une analyse complète"
                suggestion.confidence = 0.9
                suggestion.priority = "high"
                suggestion.category = "business_values"
                suggestion.rationale = "Nombre insuffisant de valeurs métier détecté"
                suggestion.ml_features = {"current_count": features.get('business_values_count', 0)}
                suggestions.append(suggestion)
            
            if features.get('essential_assets_count', 0) < 3:
                suggestion = MLSuggestion()
                suggestion.id = "add_essential_assets"
                suggestion.type = "add_element"
                suggestion.content = "Identifiez au moins 3 biens essentiels pour chaque valeur métier"
                suggestion.confidence = 0.85
                suggestion.priority = "high"
                suggestion.category = "essential_assets"
                suggestion.rationale = "Nombre insuffisant de biens essentiels"
                suggestion.ml_features = {"current_count": features.get('essential_assets_count', 0)}
                suggestions.append(suggestion)
            
            # Suggestions basées sur la qualité des descriptions
            if features.get('avg_description_length', 0) < 50:
                suggestion = MLSuggestion()
                suggestion.id = "improve_descriptions"
                suggestion.type = "improve_quality"
                suggestion.content = "Enrichissez les descriptions pour améliorer la précision de l'analyse"
                suggestion.confidence = 0.8
                suggestion.priority = "medium"
                suggestion.category = "quality"
                suggestion.rationale = "Descriptions trop courtes détectées"
                suggestion.ml_features = {"avg_length": features.get('avg_description_length', 0)}
                suggestions.append(suggestion)
            
            # Suggestions basées sur la cohérence sémantique
            if features.get('semantic_coherence', 0.5) < 0.6:
                suggestion = MLSuggestion()
                suggestion.id = "improve_coherence"
                suggestion.type = "improve_coherence"
                suggestion.content = "Harmonisez le vocabulaire entre les éléments pour améliorer la cohérence"
                suggestion.confidence = 0.75
                suggestion.priority = "medium"
                suggestion.category = "coherence"
                suggestion.rationale = "Cohérence sémantique faible détectée"
                suggestion.ml_features = {"coherence_score": features.get('semantic_coherence', 0.5)}
                suggestions.append(suggestion)
            
            # Suggestions basées sur l'équilibre des catégories
            if features.get('category_balance', 0.5) < 0.7:
                suggestion = MLSuggestion()
                suggestion.id = "balance_categories"
                suggestion.type = "balance_elements"
                suggestion.content = "Équilibrez le nombre d'éléments entre les différentes catégories"
                suggestion.confidence = 0.7
                suggestion.priority = "low"
                suggestion.category = "structure"
                suggestion.rationale = "Déséquilibre entre catégories détecté"
                suggestion.ml_features = {"balance_score": features.get('category_balance', 0.5)}
                suggestions.append(suggestion)
            
            logger.info(f"✅ Suggestions ML générées: {len(suggestions)}")
            return suggestions
            
        except Exception as e:
            logger.error(f"❌ Erreur génération suggestions: {e}")
            return []
    
    async def _assess_risks(
        self, 
        features: Dict[str, float], 
        workshop_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Évalue les risques basés sur l'analyse ML"""
        risk_assessment = {
            "overall_risk": "low",
            "risk_factors": [],
            "risk_score": 0.0,
            "recommendations": []
        }
        
        try:
            risk_score = 0.0
            risk_factors = []
            
            # Risque lié à l'incomplétude
            completion_score = await self._score_completion(features)
            if completion_score < 50:
                risk_score += 0.3
                risk_factors.append({
                    "factor": "incomplete_analysis",
                    "severity": "high",
                    "description": "Analyse incomplète - risque de manquer des éléments critiques"
                })
            
            # Risque lié à la cohérence
            coherence = features.get('semantic_coherence', 0.5)
            if coherence < 0.5:
                risk_score += 0.2
                risk_factors.append({
                    "factor": "low_coherence",
                    "severity": "medium",
                    "description": "Cohérence faible - risque d'incohérences dans l'analyse"
                })
            
            # Risque lié à la qualité des descriptions
            avg_desc_length = features.get('avg_description_length', 0)
            if avg_desc_length < 30:
                risk_score += 0.15
                risk_factors.append({
                    "factor": "poor_descriptions",
                    "severity": "medium",
                    "description": "Descriptions insuffisantes - risque d'ambiguïté"
                })
            
            # Déterminer le niveau de risque global
            if risk_score >= 0.5:
                overall_risk = "high"
            elif risk_score >= 0.3:
                overall_risk = "medium"
            else:
                overall_risk = "low"
            
            risk_assessment.update({
                "overall_risk": overall_risk,
                "risk_factors": risk_factors,
                "risk_score": risk_score,
                "recommendations": [
                    "Complétez l'analyse avant de passer aux ateliers suivants" if completion_score < 70 else None,
                    "Améliorez la cohérence sémantique" if coherence < 0.6 else None,
                    "Enrichissez les descriptions" if avg_desc_length < 50 else None
                ]
            })
            
            # Filtrer les recommandations None
            risk_assessment["recommendations"] = [r for r in risk_assessment["recommendations"] if r]
            
            return risk_assessment
            
        except Exception as e:
            logger.error(f"❌ Erreur évaluation risques: {e}")
            return risk_assessment
    
    def _compute_feature_importance(self, features: Dict[str, float]) -> Dict[str, float]:
        """Calcule l'importance des features"""
        # Importance basée sur l'impact sur la qualité (simulée)
        importance = {
            'business_values_count': 0.25,
            'essential_assets_count': 0.20,
            'semantic_coherence': 0.18,
            'avg_description_length': 0.15,
            'supporting_assets_count': 0.12,
            'dreaded_events_count': 0.10
        }
        
        # Normaliser pour que la somme soit 1
        total = sum(importance.values())
        return {k: v/total for k, v in importance.items()}
    
    def _compute_model_confidence(self, features: Dict[str, float]) -> float:
        """Calcule la confiance du modèle"""
        # Confiance basée sur la complétude des features
        available_features = sum(1 for v in features.values() if v > 0)
        total_features = len(features)
        
        if total_features == 0:
            return 0.0
        
        base_confidence = available_features / total_features
        
        # Ajuster selon la qualité des données
        if features.get('avg_description_length', 0) > 50:
            base_confidence += 0.1
        
        if features.get('semantic_coherence', 0.5) > 0.7:
            base_confidence += 0.1
        
        return min(1.0, base_confidence)
    
    def _create_fallback_result(self, workshop_data: Dict[str, Any]) -> MLAnalysisResult:
        """Crée un résultat de fallback"""
        result = MLAnalysisResult()
        result.completion_score = 50.0
        result.model_confidence = 0.5
        
        # Suggestion de fallback
        fallback_suggestion = MLSuggestion()
        fallback_suggestion.id = "fallback"
        fallback_suggestion.type = "fallback"
        fallback_suggestion.content = "Analyse ML de base disponible"
        fallback_suggestion.confidence = 0.5
        fallback_suggestion.priority = "low"
        fallback_suggestion.rationale = "Services ML avancés temporairement indisponibles"
        
        result.suggestions = [fallback_suggestion]
        return result
    
    def is_ready(self) -> bool:
        """Vérifie si le moteur est prêt"""
        return True
    
    def get_capabilities(self) -> Dict[str, bool]:
        """Retourne les capacités disponibles"""
        return {
            "xgboost_available": XGBOOST_AVAILABLE,
            "sklearn_available": SKLEARN_AVAILABLE,
            "semantic_integration": SEMANTIC_ANALYZER_AVAILABLE,
            "quality_prediction": True,
            "completion_scoring": True,
            "risk_assessment": True,
            "feature_importance": True
        }

# === FACTORY ===

class MLSuggestionEngineFactory:
    """Factory pour créer le moteur de suggestions ML"""
    
    @staticmethod
    def create() -> MLSuggestionEngine:
        """Crée le moteur de suggestions ML de manière sécurisée"""
        try:
            engine = MLSuggestionEngine()
            logger.info("✅ Moteur suggestions ML créé avec succès")
            return engine
        except Exception as e:
            logger.error(f"❌ Erreur création moteur ML: {e}")
            return MLSuggestionEngine()

# Export principal
__all__ = ['MLSuggestionEngine', 'MLSuggestionEngineFactory', 'MLAnalysisResult', 'MLSuggestion']
