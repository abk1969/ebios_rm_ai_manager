"""
💡 SUGGESTION ENGINE
Moteur de suggestions intelligentes pour Workshop 1 EBIOS RM
"""

import logging
import asyncio
from datetime import datetime
from typing import List, Dict, Any, Optional
import random
import json

from models.ebios_models import (
    WorkshopContext,
    AISuggestion,
    SuggestionType,
    SuggestionPriority,
    CriticalityLevel
)

logger = logging.getLogger(__name__)

class SuggestionEngine:
    """Moteur de suggestions contextuelles pour Workshop 1"""
    
    def __init__(self):
        self.suggestion_count = 0
        self.suggestion_templates = self._load_suggestion_templates()
        self.ebios_examples = self._load_ebios_examples()
    
    def is_ready(self) -> bool:
        """Vérifie si le moteur est prêt"""
        return True
    
    def get_suggestion_count(self) -> int:
        """Retourne le nombre de suggestions générées"""
        return self.suggestion_count
    
    def _load_suggestion_templates(self) -> Dict[str, List[Dict]]:
        """Charge les templates de suggestions"""
        return {
            "business_values": [
                {
                    "type": "action",
                    "priority": "high",
                    "title": "🎯 Identifier vos processus critiques",
                    "description": "Commencez par lister les processus métier essentiels à votre activité",
                    "rationale": "Les processus critiques sont souvent les premières valeurs métier à protéger",
                    "examples": ["Facturation client", "Production", "Support client", "R&D"]
                },
                {
                    "type": "tip",
                    "priority": "medium",
                    "title": "💡 Pensez aux aspects réglementaires",
                    "description": "Incluez les exigences de conformité comme valeurs métier",
                    "rationale": "La non-conformité peut avoir des impacts majeurs",
                    "examples": ["RGPD", "SOX", "ISO 27001", "Secteur bancaire"]
                },
                {
                    "type": "insight",
                    "priority": "medium",
                    "title": "🔍 Considérez votre réputation",
                    "description": "La réputation est souvent une valeur métier sous-estimée",
                    "rationale": "Les atteintes à la réputation peuvent avoir des impacts durables",
                    "examples": ["Image de marque", "Confiance client", "Relations partenaires"]
                }
            ],
            "essential_assets": [
                {
                    "type": "action",
                    "priority": "high",
                    "title": "🏗️ Cartographier vos informations critiques",
                    "description": "Identifiez les données et informations indispensables à vos valeurs métier",
                    "rationale": "Les informations sont souvent les biens essentiels les plus critiques",
                    "examples": ["Données clients", "Propriété intellectuelle", "Données financières"]
                },
                {
                    "type": "tip",
                    "priority": "medium",
                    "title": "💡 N'oubliez pas les processus",
                    "description": "Les processus métier sont aussi des biens essentiels",
                    "rationale": "Un processus défaillant peut compromettre une valeur métier",
                    "examples": ["Processus de validation", "Workflow d'approbation", "Procédures qualité"]
                },
                {
                    "type": "insight",
                    "priority": "low",
                    "title": "🧠 Incluez le savoir-faire",
                    "description": "Le savoir-faire et l'expertise sont des biens essentiels immatériels",
                    "rationale": "La perte de compétences clés peut être critique",
                    "examples": ["Expertise technique", "Savoir-faire commercial", "Connaissances métier"]
                }
            ],
            "supporting_assets": [
                {
                    "type": "action",
                    "priority": "high",
                    "title": "🔧 Inventorier vos systèmes techniques",
                    "description": "Listez les serveurs, applications et équipements qui supportent vos biens essentiels",
                    "rationale": "Les systèmes techniques sont la base de la plupart des biens essentiels",
                    "examples": ["Serveurs", "Applications", "Bases de données", "Réseaux"]
                },
                {
                    "type": "tip",
                    "priority": "medium",
                    "title": "👥 Pensez aux ressources humaines",
                    "description": "Les équipes et compétences sont des biens supports cruciaux",
                    "rationale": "Sans les bonnes personnes, les systèmes ne fonctionnent pas",
                    "examples": ["Équipe IT", "Administrateurs", "Experts métier", "Support"]
                },
                {
                    "type": "insight",
                    "priority": "medium",
                    "title": "🏢 Incluez l'environnement physique",
                    "description": "Locaux, alimentation électrique et climatisation sont des supports essentiels",
                    "rationale": "L'environnement physique conditionne le fonctionnement des systèmes",
                    "examples": ["Datacenter", "Bureaux", "Alimentation", "Climatisation"]
                }
            ],
            "dreaded_events": [
                {
                    "type": "action",
                    "priority": "high",
                    "title": "🚨 Identifier les scénarios de perte",
                    "description": "Définissez ce que vous craignez qu'il arrive à vos valeurs métier",
                    "rationale": "Les événements redoutés guident l'analyse des risques",
                    "examples": ["Vol de données", "Indisponibilité", "Corruption", "Divulgation"]
                },
                {
                    "type": "warning",
                    "priority": "high",
                    "title": "⚠️ Considérez tous les types d'impact",
                    "description": "Pensez à la disponibilité, intégrité, confidentialité et traçabilité",
                    "rationale": "Chaque type d'impact peut générer des événements redoutés différents",
                    "examples": ["Panne système", "Modification malveillante", "Espionnage", "Perte de logs"]
                },
                {
                    "type": "tip",
                    "priority": "medium",
                    "title": "💡 Quantifiez les impacts",
                    "description": "Estimez les conséquences financières et opérationnelles",
                    "rationale": "La quantification aide à prioriser les risques",
                    "examples": ["Perte de CA", "Coûts de remédiation", "Sanctions", "Perte de clients"]
                }
            ]
        }
    
    def _load_ebios_examples(self) -> Dict[str, List[str]]:
        """Charge les exemples EBIOS RM par secteur"""
        return {
            "finance": {
                "business_values": ["Transactions financières", "Conformité bancaire", "Confiance client"],
                "essential_assets": ["Données de transaction", "Processus de validation", "Historique client"],
                "supporting_assets": ["Core banking", "HSM", "Équipes conformité"],
                "dreaded_events": ["Fraude financière", "Blanchiment", "Fuite de données"]
            },
            "healthcare": {
                "business_values": ["Soins aux patients", "Confidentialité médicale", "Continuité de service"],
                "essential_assets": ["Dossiers médicaux", "Protocoles de soins", "Expertise médicale"],
                "supporting_assets": ["SIH", "Équipements médicaux", "Personnel soignant"],
                "dreaded_events": ["Fuite de données médicales", "Indisponibilité du SIH", "Erreur de diagnostic"]
            },
            "industry": {
                "business_values": ["Production industrielle", "Qualité produits", "Sécurité des travailleurs"],
                "essential_assets": ["Recettes de fabrication", "Processus qualité", "Savoir-faire technique"],
                "supporting_assets": ["Automates", "SCADA", "Équipes techniques"],
                "dreaded_events": ["Arrêt de production", "Défaut qualité", "Accident industriel"]
            },
            "retail": {
                "business_values": ["Expérience client", "Gestion des stocks", "Réputation marque"],
                "essential_assets": ["Base clients", "Catalogue produits", "Processus logistique"],
                "supporting_assets": ["Site e-commerce", "ERP", "Équipes vente"],
                "dreaded_events": ["Indisponibilité site", "Rupture de stock", "Avis négatifs"]
            }
        }
    
    async def generate_contextual_suggestions(
        self,
        context: WorkshopContext,
        criterion: str,
        current_data: Dict[str, Any],
        max_suggestions: int = 5
    ) -> List[AISuggestion]:
        """
        Génère des suggestions contextuelles intelligentes
        """
        self.suggestion_count += 1
        logger.info(f"💡 Génération suggestions pour critère: {criterion}")
        
        suggestions = []
        
        # Suggestions basées sur le critère
        if criterion in self.suggestion_templates:
            templates = self.suggestion_templates[criterion]
            
            for template in templates[:max_suggestions]:
                suggestion = await self._create_suggestion_from_template(
                    template, context, current_data
                )
                suggestions.append(suggestion)
        
        # Suggestions contextuelles basées sur les données existantes
        contextual_suggestions = await self._generate_contextual_suggestions(
            context, criterion, current_data
        )
        suggestions.extend(contextual_suggestions)
        
        # Suggestions d'amélioration
        improvement_suggestions = await self._generate_improvement_suggestions(
            context, criterion, current_data
        )
        suggestions.extend(improvement_suggestions)
        
        # Trier par priorité et limiter
        suggestions.sort(key=lambda s: self._priority_score(s.priority), reverse=True)
        return suggestions[:max_suggestions]
    
    async def _create_suggestion_from_template(
        self,
        template: Dict[str, Any],
        context: WorkshopContext,
        current_data: Dict[str, Any]
    ) -> AISuggestion:
        """Crée une suggestion à partir d'un template"""
        
        suggestion_id = f"{template['type']}_{context.mission_id}_{datetime.now().timestamp()}"
        
        # Adaptation du contenu selon le contexte
        adapted_description = template["description"]
        adapted_examples = template.get("examples", [])
        
        # Détection du secteur pour adapter les exemples
        sector = self._detect_sector(context)
        if sector and sector in self.ebios_examples:
            sector_examples = self.ebios_examples[sector]
            criterion_key = template.get("criterion", "business_values")
            if criterion_key in sector_examples:
                adapted_examples = sector_examples[criterion_key][:3]
        
        return AISuggestion(
            id=suggestion_id,
            type=SuggestionType(template["type"]),
            priority=SuggestionPriority(template["priority"]),
            title=template["title"],
            description=adapted_description,
            rationale=template["rationale"],
            action_label=template.get("action_label", "Appliquer"),
            confidence=template.get("confidence", 0.8),
            context={
                "examples": adapted_examples,
                "sector": sector,
                "current_count": len(current_data.get("items", [])),
                "template_id": template.get("id", "unknown")
            }
        )
    
    async def _generate_contextual_suggestions(
        self,
        context: WorkshopContext,
        criterion: str,
        current_data: Dict[str, Any]
    ) -> List[AISuggestion]:
        """Génère des suggestions basées sur le contexte actuel"""
        
        suggestions = []
        current_items = current_data.get("items", [])
        
        # Suggestion si aucun élément
        if len(current_items) == 0:
            suggestions.append(AISuggestion(
                id=f"empty_{criterion}_{context.mission_id}",
                type=SuggestionType.ACTION,
                priority=SuggestionPriority.HIGH,
                title=f"🚀 Commencer avec {criterion}",
                description=f"Ajoutez votre premier élément pour {criterion}",
                rationale="Il faut au moins un élément pour commencer l'analyse",
                action_label="Ajouter le premier élément",
                confidence=0.95,
                context={"step": criterion, "is_first": True}
            ))
        
        # Suggestion si peu d'éléments
        elif len(current_items) < 3:
            suggestions.append(AISuggestion(
                id=f"few_{criterion}_{context.mission_id}",
                type=SuggestionType.TIP,
                priority=SuggestionPriority.MEDIUM,
                title="💡 Enrichir votre analyse",
                description=f"Ajoutez plus d'éléments pour une analyse plus complète",
                rationale="Une analyse riche nécessite plusieurs éléments",
                action_label="Ajouter un élément",
                confidence=0.75,
                context={"current_count": len(current_items), "recommended_min": 3}
            ))
        
        # Suggestion de révision si beaucoup d'éléments
        elif len(current_items) > 10:
            suggestions.append(AISuggestion(
                id=f"many_{criterion}_{context.mission_id}",
                type=SuggestionType.INSIGHT,
                priority=SuggestionPriority.LOW,
                title="🔍 Réviser et consolider",
                description="Vous avez beaucoup d'éléments, considérez les regrouper",
                rationale="Trop d'éléments peut compliquer l'analyse",
                confidence=0.65,
                context={"current_count": len(current_items), "recommended_max": 10}
            ))
        
        return suggestions
    
    async def _generate_improvement_suggestions(
        self,
        context: WorkshopContext,
        criterion: str,
        current_data: Dict[str, Any]
    ) -> List[AISuggestion]:
        """Génère des suggestions d'amélioration"""
        
        suggestions = []
        current_items = current_data.get("items", [])
        
        if not current_items:
            return suggestions
        
        # Analyse de la qualité des descriptions
        descriptions = [item.get("description", "") for item in current_items]
        avg_length = sum(len(desc) for desc in descriptions) / len(descriptions)
        
        if avg_length < 50:
            suggestions.append(AISuggestion(
                id=f"improve_desc_{criterion}_{context.mission_id}",
                type=SuggestionType.TIP,
                priority=SuggestionPriority.MEDIUM,
                title="📝 Enrichir les descriptions",
                description="Ajoutez plus de détails à vos descriptions pour une meilleure analyse",
                rationale="Des descriptions détaillées améliorent la qualité de l'analyse",
                confidence=0.80,
                context={
                    "current_avg_length": avg_length,
                    "recommended_min": 100,
                    "improvement_needed": True
                }
            ))
        
        # Vérification des liens manquants
        if criterion == "essential_assets":
            business_value_ids = {bv.id for bv in context.business_values}
            linked_bv_ids = {item.get("businessValueId") for item in current_items}
            
            if business_value_ids and not business_value_ids.intersection(linked_bv_ids):
                suggestions.append(AISuggestion(
                    id=f"missing_links_{criterion}_{context.mission_id}",
                    type=SuggestionType.WARNING,
                    priority=SuggestionPriority.HIGH,
                    title="⚠️ Liens manquants",
                    description="Vos biens essentiels ne sont pas liés à vos valeurs métier",
                    rationale="Les biens essentiels doivent supporter des valeurs métier",
                    confidence=0.90,
                    context={"missing_links": True, "link_type": "business_value"}
                ))
        
        return suggestions
    
    def _detect_sector(self, context: WorkshopContext) -> Optional[str]:
        """Détecte le secteur d'activité basé sur le contexte"""
        
        # Analyse simple basée sur les mots-clés
        all_text = ""
        for bv in context.business_values:
            all_text += f" {bv.name} {bv.description}"
        
        all_text = all_text.lower()
        
        if any(word in all_text for word in ["banque", "finance", "crédit", "transaction"]):
            return "finance"
        elif any(word in all_text for word in ["santé", "médical", "patient", "hôpital"]):
            return "healthcare"
        elif any(word in all_text for word in ["production", "usine", "fabrication", "industrie"]):
            return "industry"
        elif any(word in all_text for word in ["vente", "client", "magasin", "commerce"]):
            return "retail"
        
        return None
    
    def _priority_score(self, priority: SuggestionPriority) -> int:
        """Convertit la priorité en score numérique"""
        priority_scores = {
            SuggestionPriority.CRITICAL: 4,
            SuggestionPriority.HIGH: 3,
            SuggestionPriority.MEDIUM: 2,
            SuggestionPriority.LOW: 1
        }
        return priority_scores.get(priority, 0)
