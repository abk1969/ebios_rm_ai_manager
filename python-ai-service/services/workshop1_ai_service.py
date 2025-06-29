"""
🤖 WORKSHOP 1 AI SERVICE
Service IA spécialisé pour l'assistance Workshop 1 EBIOS RM
"""

import asyncio
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import json
import numpy as np
from dataclasses import dataclass

# Imports pour l'IA
try:
    from transformers import pipeline, AutoTokenizer, AutoModel
    from sentence_transformers import SentenceTransformer
    import torch
    AI_LIBRARIES_AVAILABLE = True
except ImportError:
    AI_LIBRARIES_AVAILABLE = False
    logging.warning("🔧 Librairies IA non disponibles, mode simulation activé")

from models.ebios_models import (
    WorkshopContext, 
    AISuggestion, 
    WorkshopAnalysis,
    SuggestionType,
    SuggestionPriority,
    CriticalityLevel
)

logger = logging.getLogger(__name__)

@dataclass
class EbiosKnowledge:
    """Base de connaissances EBIOS RM"""
    business_value_examples = [
        "Processus de facturation clients",
        "Base de données clients",
        "Réputation de l'entreprise",
        "Continuité de service",
        "Conformité réglementaire",
        "Propriété intellectuelle",
        "Relations partenaires"
    ]
    
    essential_asset_examples = [
        "Informations clients personnelles",
        "Processus de validation des commandes",
        "Savoir-faire technique",
        "Procédures de sécurité",
        "Données financières",
        "Algorithmes propriétaires",
        "Contrats commerciaux"
    ]
    
    supporting_asset_examples = [
        "Serveur de base de données",
        "Application web",
        "Personnel IT",
        "Locaux sécurisés",
        "Réseau informatique",
        "Système de sauvegarde",
        "Équipes de développement"
    ]
    
    dreaded_event_examples = [
        "Vol de données clients",
        "Indisponibilité du service",
        "Corruption de données",
        "Atteinte à la réputation",
        "Non-conformité réglementaire",
        "Espionnage industriel",
        "Sabotage interne"
    ]

class Workshop1AIService:
    """Service IA pour Workshop 1 EBIOS RM"""
    
    def __init__(self):
        self.knowledge = EbiosKnowledge()
        self.start_time = datetime.now()
        self.request_count = 0
        self.ai_models = {}
        self._initialize_ai_models()
    
    def _initialize_ai_models(self):
        """Initialise les modèles IA si disponibles"""
        if AI_LIBRARIES_AVAILABLE:
            try:
                # Modèle pour l'analyse sémantique
                self.ai_models['semantic'] = SentenceTransformer('all-MiniLM-L6-v2')
                
                # Modèle pour la génération de texte
                self.ai_models['text_generator'] = pipeline(
                    'text-generation',
                    model='gpt2',
                    max_length=100,
                    num_return_sequences=1
                )
                
                logger.info("✅ Modèles IA initialisés avec succès")
            except Exception as e:
                logger.warning(f"⚠️ Erreur initialisation modèles IA: {e}")
                self.ai_models = {}
        else:
            logger.info("🔧 Mode simulation IA activé")
    
    def is_ready(self) -> bool:
        """Vérifie si le service est prêt"""
        return True
    
    def get_request_count(self) -> int:
        """Retourne le nombre de requêtes traitées"""
        return self.request_count
    
    def get_uptime(self) -> str:
        """Retourne le temps de fonctionnement"""
        uptime = datetime.now() - self.start_time
        hours, remainder = divmod(int(uptime.total_seconds()), 3600)
        minutes, _ = divmod(remainder, 60)
        return f"{hours}h {minutes}m"
    
    def get_memory_usage(self) -> str:
        """Retourne l'utilisation mémoire (simulée)"""
        return "150 MB"
    
    async def analyze_workshop_context(
        self,
        mission_id: str,
        business_values: List[Dict[str, Any]],
        essential_assets: List[Dict[str, Any]],
        supporting_assets: List[Dict[str, Any]],
        dreaded_events: List[Dict[str, Any]],
        current_step: Optional[str] = None
    ) -> WorkshopAnalysis:
        """
        Analyse complète du contexte Workshop 1
        """
        self.request_count += 1
        logger.info(f"🔍 Analyse Workshop 1 pour mission: {mission_id}")
        
        # Calcul des métriques de complétion
        completion_status = {
            "business_values": len(business_values) >= 1,
            "essential_assets": len(essential_assets) >= 1,
            "supporting_assets": len(supporting_assets) >= 1,
            "dreaded_events": len(dreaded_events) >= 1
        }
        
        # Métriques de qualité
        quality_metrics = await self._calculate_quality_metrics(
            business_values, essential_assets, supporting_assets, dreaded_events
        )
        
        # Génération de suggestions
        suggestions = await self._generate_contextual_suggestions(
            mission_id, business_values, essential_assets, 
            supporting_assets, dreaded_events, current_step
        )
        
        # Analyse de cohérence
        coherence_report = await self._analyze_coherence(
            business_values, essential_assets, supporting_assets, dreaded_events
        )
        
        # Prochaines étapes recommandées
        next_steps = self._recommend_next_steps(completion_status, current_step)
        
        return WorkshopAnalysis(
            mission_id=mission_id,
            workshop_number=1,
            completion_status=completion_status,
            quality_metrics=quality_metrics,
            suggestions=suggestions,
            coherence_report=coherence_report,
            next_steps=next_steps,
            estimated_completion_time=self._estimate_completion_time(completion_status)
        )
    
    async def _calculate_quality_metrics(
        self, 
        business_values: List[Dict], 
        essential_assets: List[Dict],
        supporting_assets: List[Dict], 
        dreaded_events: List[Dict]
    ) -> Dict[str, float]:
        """Calcule les métriques de qualité"""
        
        metrics = {
            "completeness": 0.0,
            "coherence": 0.0,
            "detail_level": 0.0,
            "ebios_compliance": 0.0
        }
        
        # Complétude (25% par section complète)
        sections = [business_values, essential_assets, supporting_assets, dreaded_events]
        metrics["completeness"] = sum(1 for section in sections if len(section) > 0) * 25.0
        
        # Niveau de détail (basé sur la longueur des descriptions)
        total_descriptions = 0
        total_length = 0
        
        for section in sections:
            for item in section:
                if 'description' in item and item['description']:
                    total_descriptions += 1
                    total_length += len(item['description'])
        
        if total_descriptions > 0:
            avg_length = total_length / total_descriptions
            metrics["detail_level"] = min(100.0, (avg_length / 100) * 100)
        
        # Cohérence (analyse sémantique si disponible)
        if self.ai_models.get('semantic'):
            metrics["coherence"] = await self._semantic_coherence_analysis(sections)
        else:
            # Cohérence basique basée sur les liens
            metrics["coherence"] = self._basic_coherence_analysis(
                business_values, essential_assets, supporting_assets, dreaded_events
            )
        
        # Conformité EBIOS RM
        metrics["ebios_compliance"] = self._calculate_ebios_compliance(
            business_values, essential_assets, supporting_assets, dreaded_events
        )
        
        return metrics
    
    async def _generate_contextual_suggestions(
        self,
        mission_id: str,
        business_values: List[Dict],
        essential_assets: List[Dict],
        supporting_assets: List[Dict],
        dreaded_events: List[Dict],
        current_step: Optional[str]
    ) -> List[AISuggestion]:
        """Génère des suggestions contextuelles"""
        
        suggestions = []
        
        # Suggestions basées sur les manques
        if len(business_values) == 0:
            suggestions.append(AISuggestion(
                id=f"bv_missing_{mission_id}",
                type=SuggestionType.ACTION,
                priority=SuggestionPriority.HIGH,
                title="🎯 Définir vos valeurs métier",
                description="Commencez par identifier ce qui a de la valeur pour votre organisation",
                rationale="Les valeurs métier sont le fondement de l'analyse EBIOS RM",
                action_label="Ajouter une valeur métier",
                confidence=0.95,
                context={"step": "business-values", "examples": self.knowledge.business_value_examples[:3]}
            ))
        
        if len(business_values) > 0 and len(essential_assets) == 0:
            suggestions.append(AISuggestion(
                id=f"ea_missing_{mission_id}",
                type=SuggestionType.ACTION,
                priority=SuggestionPriority.HIGH,
                title="🏗️ Identifier vos biens essentiels",
                description="Définissez les informations, processus et savoir-faire qui supportent vos valeurs métier",
                rationale="Les biens essentiels sont nécessaires pour réaliser vos valeurs métier",
                action_label="Ajouter un bien essentiel",
                confidence=0.90,
                context={"step": "essential-assets", "examples": self.knowledge.essential_asset_examples[:3]}
            ))
        
        # Suggestions d'amélioration
        if len(business_values) > 0:
            avg_desc_length = np.mean([len(bv.get('description', '')) for bv in business_values])
            if avg_desc_length < 50:
                suggestions.append(AISuggestion(
                    id=f"bv_detail_{mission_id}",
                    type=SuggestionType.TIP,
                    priority=SuggestionPriority.MEDIUM,
                    title="💡 Enrichir les descriptions",
                    description="Ajoutez plus de détails à vos valeurs métier pour une meilleure analyse",
                    rationale="Des descriptions détaillées améliorent la qualité de l'analyse des risques",
                    confidence=0.75,
                    context={"current_avg_length": avg_desc_length, "recommended_min": 100}
                ))
        
        # Suggestions de cohérence
        if len(supporting_assets) > 0 and len(essential_assets) == 0:
            suggestions.append(AISuggestion(
                id=f"coherence_warning_{mission_id}",
                type=SuggestionType.WARNING,
                priority=SuggestionPriority.HIGH,
                title="⚠️ Incohérence détectée",
                description="Vous avez des biens supports sans biens essentiels associés",
                rationale="Les biens supports doivent supporter des biens essentiels selon EBIOS RM",
                confidence=0.85,
                context={"issue": "missing_essential_assets"}
            ))
        
        return suggestions[:5]  # Limiter à 5 suggestions
    
    def _basic_coherence_analysis(
        self, 
        business_values: List[Dict],
        essential_assets: List[Dict], 
        supporting_assets: List[Dict],
        dreaded_events: List[Dict]
    ) -> float:
        """Analyse de cohérence basique"""
        
        score = 100.0
        
        # Vérifier les liens business_value -> essential_asset
        bv_ids = {bv.get('id') for bv in business_values}
        ea_bv_refs = {ea.get('businessValueId') for ea in essential_assets}
        
        if bv_ids and ea_bv_refs:
            linked_bvs = len(bv_ids.intersection(ea_bv_refs))
            score *= (linked_bvs / len(bv_ids))
        
        # Vérifier les liens essential_asset -> supporting_asset
        ea_ids = {ea.get('id') for ea in essential_assets}
        sa_ea_refs = {sa.get('essentialAssetId') for sa in supporting_assets}
        
        if ea_ids and sa_ea_refs:
            linked_eas = len(ea_ids.intersection(sa_ea_refs))
            score *= (linked_eas / len(ea_ids))
        
        return max(0.0, min(100.0, score))
    
    def _calculate_ebios_compliance(
        self,
        business_values: List[Dict],
        essential_assets: List[Dict],
        supporting_assets: List[Dict],
        dreaded_events: List[Dict]
    ) -> float:
        """Calcule la conformité EBIOS RM"""
        
        compliance_score = 0.0
        total_criteria = 8
        
        # Critère 1: Au moins 1 valeur métier
        if len(business_values) >= 1:
            compliance_score += 12.5
        
        # Critère 2: Au moins 1 bien essentiel
        if len(essential_assets) >= 1:
            compliance_score += 12.5
        
        # Critère 3: Au moins 1 bien support
        if len(supporting_assets) >= 1:
            compliance_score += 12.5
        
        # Critère 4: Au moins 1 événement redouté
        if len(dreaded_events) >= 1:
            compliance_score += 12.5
        
        # Critère 5: Liens cohérents BV -> EA
        if business_values and essential_assets:
            bv_ids = {bv.get('id') for bv in business_values}
            ea_refs = {ea.get('businessValueId') for ea in essential_assets}
            if bv_ids.intersection(ea_refs):
                compliance_score += 12.5
        
        # Critère 6: Liens cohérents EA -> SA
        if essential_assets and supporting_assets:
            ea_ids = {ea.get('id') for ea in essential_assets}
            sa_refs = {sa.get('essentialAssetId') for sa in supporting_assets}
            if ea_ids.intersection(sa_refs):
                compliance_score += 12.5
        
        # Critère 7: Événements redoutés liés aux valeurs métier
        if business_values and dreaded_events:
            bv_ids = {bv.get('id') for bv in business_values}
            de_refs = {de.get('businessValueId') for de in dreaded_events}
            if bv_ids.intersection(de_refs):
                compliance_score += 12.5
        
        # Critère 8: Descriptions suffisamment détaillées
        all_items = business_values + essential_assets + supporting_assets + dreaded_events
        if all_items:
            detailed_items = sum(1 for item in all_items 
                               if item.get('description', '') and len(item['description']) >= 50)
            if detailed_items / len(all_items) >= 0.7:
                compliance_score += 12.5
        
        return compliance_score
    
    def _recommend_next_steps(
        self, 
        completion_status: Dict[str, bool], 
        current_step: Optional[str]
    ) -> List[str]:
        """Recommande les prochaines étapes"""
        
        next_steps = []
        
        if not completion_status["business_values"]:
            next_steps.append("Définir au moins une valeur métier")
        
        if completion_status["business_values"] and not completion_status["essential_assets"]:
            next_steps.append("Identifier les biens essentiels qui supportent vos valeurs métier")
        
        if completion_status["essential_assets"] and not completion_status["supporting_assets"]:
            next_steps.append("Cataloguer les biens supports (techniques, organisationnels, humains)")
        
        if completion_status["business_values"] and not completion_status["dreaded_events"]:
            next_steps.append("Définir les événements redoutés pour vos valeurs métier")
        
        if all(completion_status.values()):
            next_steps.append("Réviser et enrichir les descriptions existantes")
            next_steps.append("Vérifier la cohérence des liens entre éléments")
            next_steps.append("Préparer la transition vers l'Atelier 2")
        
        return next_steps
    
    def _estimate_completion_time(self, completion_status: Dict[str, bool]) -> str:
        """Estime le temps de complétion restant"""
        
        remaining_sections = sum(1 for completed in completion_status.values() if not completed)
        
        if remaining_sections == 0:
            return "Atelier terminé"
        elif remaining_sections == 1:
            return "15-30 minutes"
        elif remaining_sections == 2:
            return "30-60 minutes"
        else:
            return "1-2 heures"
    
    async def auto_complete_workshop(
        self,
        mission_id: str,
        business_values: List[Dict],
        essential_assets: List[Dict],
        supporting_assets: List[Dict],
        dreaded_events: List[Dict]
    ):
        """Auto-complétion intelligente du workshop (tâche en arrière-plan)"""
        
        logger.info(f"🤖 Début auto-complétion Workshop 1 pour mission: {mission_id}")
        
        # Simulation d'une tâche longue
        await asyncio.sleep(2)
        
        # Ici on pourrait implémenter la génération automatique d'éléments
        # basée sur l'IA et les exemples de la base de connaissances
        
        logger.info(f"✅ Auto-complétion terminée pour mission: {mission_id}")
        
        return {
            "status": "completed",
            "generated_items": 0,
            "suggestions_applied": 0
        }
