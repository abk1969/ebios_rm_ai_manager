"""
🤖 SERVICE IA PYTHON SIMPLIFIÉ
Version minimale pour test de bout en bout
"""

import json
import sys
from datetime import datetime
from typing import List, Dict, Any, Optional

# Simulation FastAPI si non disponible
try:
    from fastapi import FastAPI, HTTPException
    from fastapi.middleware.cors import CORSMiddleware
    import uvicorn
    FASTAPI_AVAILABLE = True
except ImportError:
    FASTAPI_AVAILABLE = False
    print("⚠️ FastAPI non disponible, mode simulation HTTP activé")

# Configuration
PORT = 8000
HOST = "0.0.0.0"

class MockAIService:
    """Service IA simulé pour les tests"""
    
    def __init__(self):
        self.request_count = 0
        self.start_time = datetime.now()
    
    def analyze_workshop1(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyse Workshop 1 simulée"""
        self.request_count += 1
        
        mission_id = request_data.get("mission_id", "unknown")
        business_values = request_data.get("business_values", [])
        essential_assets = request_data.get("essential_assets", [])
        supporting_assets = request_data.get("supporting_assets", [])
        dreaded_events = request_data.get("dreaded_events", [])
        
        # Calcul des métriques
        completion_status = {
            "business_values": len(business_values) >= 1,
            "essential_assets": len(essential_assets) >= 1,
            "supporting_assets": len(supporting_assets) >= 1,
            "dreaded_events": len(dreaded_events) >= 1
        }
        
        completed_sections = sum(completion_status.values())
        completeness = (completed_sections / 4) * 100
        
        # Génération de suggestions
        suggestions = []
        
        if not completion_status["business_values"]:
            suggestions.append({
                "id": f"bv_missing_{mission_id}",
                "type": "action",
                "priority": "high",
                "title": "🎯 Définir vos valeurs métier",
                "description": "Commencez par identifier ce qui a de la valeur pour votre organisation",
                "rationale": "Les valeurs métier sont le fondement de l'analyse EBIOS RM",
                "action_label": "Ajouter une valeur métier",
                "confidence": 0.95,
                "context": {"step": "business-values", "examples": ["Facturation client", "Données clients", "Réputation"]},
                "created_at": datetime.now().isoformat(),
                "applied": False
            })
        
        if completion_status["business_values"] and not completion_status["essential_assets"]:
            suggestions.append({
                "id": f"ea_missing_{mission_id}",
                "type": "action",
                "priority": "high",
                "title": "🏗️ Identifier vos biens essentiels",
                "description": "Définissez les informations, processus et savoir-faire qui supportent vos valeurs métier",
                "rationale": "Les biens essentiels sont nécessaires pour réaliser vos valeurs métier",
                "action_label": "Ajouter un bien essentiel",
                "confidence": 0.90,
                "context": {"step": "essential-assets", "examples": ["Données clients", "Processus de validation", "Expertise technique"]},
                "created_at": datetime.now().isoformat(),
                "applied": False
            })
        
        # Analyse de cohérence
        coherence_score = 100.0
        if business_values and essential_assets:
            # Vérification des liens
            bv_ids = {bv.get('id') for bv in business_values if bv.get('id')}
            ea_bv_refs = {ea.get('businessValueId') for ea in essential_assets if ea.get('businessValueId')}
            if bv_ids and ea_bv_refs:
                linked_ratio = len(bv_ids.intersection(ea_bv_refs)) / len(bv_ids)
                coherence_score *= linked_ratio
        
        coherence_report = {
            "mission_id": mission_id,
            "overall_score": coherence_score,
            "issues": [],
            "recommendations": [
                "Vérifiez les liens entre vos valeurs métier et biens essentiels",
                "Complétez les descriptions pour une meilleure analyse"
            ],
            "analysis_date": datetime.now().isoformat(),
            "is_coherent": coherence_score >= 80
        }
        
        # Prochaines étapes
        next_steps = []
        if not completion_status["business_values"]:
            next_steps.append("Définir au moins une valeur métier")
        elif not completion_status["essential_assets"]:
            next_steps.append("Identifier les biens essentiels")
        elif not completion_status["supporting_assets"]:
            next_steps.append("Cataloguer les biens supports")
        elif not completion_status["dreaded_events"]:
            next_steps.append("Définir les événements redoutés")
        else:
            next_steps.append("Réviser et enrichir les descriptions")
        
        return {
            "mission_id": mission_id,
            "workshop_number": 1,
            "completion_status": completion_status,
            "quality_metrics": {
                "completeness": completeness,
                "coherence": coherence_score,
                "detail_level": 60.0,
                "ebios_compliance": completeness * 0.8
            },
            "suggestions": suggestions,
            "coherence_report": coherence_report,
            "next_steps": next_steps,
            "estimated_completion_time": "30-60 minutes" if completed_sections >= 2 else "1-2 heures",
            "analysis_timestamp": datetime.now().isoformat()
        }
    
    def generate_suggestions(self, context: Dict[str, Any], criterion: str) -> List[Dict[str, Any]]:
        """Génération de suggestions simulée"""
        suggestions = []
        
        suggestion_templates = {
            "business-values": {
                "title": "🎯 Identifier vos processus critiques",
                "description": "Commencez par lister les processus métier essentiels à votre activité",
                "examples": ["Facturation client", "Production", "Support client"]
            },
            "essential-assets": {
                "title": "🏗️ Cartographier vos informations critiques",
                "description": "Identifiez les données et informations indispensables à vos valeurs métier",
                "examples": ["Données clients", "Propriété intellectuelle", "Données financières"]
            },
            "supporting-assets": {
                "title": "🔧 Inventorier vos systèmes techniques",
                "description": "Listez les serveurs, applications et équipements qui supportent vos biens essentiels",
                "examples": ["Serveurs", "Applications", "Bases de données"]
            },
            "dreaded-events": {
                "title": "🚨 Identifier les scénarios de perte",
                "description": "Définissez ce que vous craignez qu'il arrive à vos valeurs métier",
                "examples": ["Vol de données", "Indisponibilité", "Corruption"]
            }
        }
        
        template = suggestion_templates.get(criterion)
        if template:
            suggestions.append({
                "id": f"suggestion_{criterion}_{datetime.now().timestamp()}",
                "type": "action",
                "priority": "high",
                "title": template["title"],
                "description": template["description"],
                "rationale": "Suggestion générée par l'IA contextuelle",
                "action_label": "Appliquer",
                "confidence": 0.85,
                "context": {"examples": template["examples"], "criterion": criterion},
                "created_at": datetime.now().isoformat(),
                "applied": False
            })
        
        return suggestions
    
    def get_health(self) -> Dict[str, Any]:
        """Status de santé du service"""
        uptime = datetime.now() - self.start_time
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "uptime_seconds": int(uptime.total_seconds()),
            "requests_processed": self.request_count,
            "services": {
                "workshop1_ai": True,
                "suggestions": True,
                "coherence": True,
                "guidance": True
            }
        }

# Instance du service
ai_service = MockAIService()

if FASTAPI_AVAILABLE:
    # Configuration FastAPI
    app = FastAPI(
        title="EBIOS AI Manager - Python Service",
        description="Service IA pour l'assistance Workshop 1 EBIOS RM",
        version="1.0.0"
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5174", "http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    @app.get("/")
    async def root():
        return {
            "service": "EBIOS AI Manager - Python Service",
            "version": "1.0.0",
            "status": "active",
            "capabilities": [
                "Workshop 1 AI Assistance",
                "Intelligent Suggestions",
                "Coherence Analysis"
            ]
        }
    
    @app.get("/health")
    async def health_check():
        return ai_service.get_health()
    
    @app.post("/workshop1/analyze")
    async def analyze_workshop1(request: Dict[str, Any]):
        try:
            analysis = ai_service.analyze_workshop1(request)
            return {
                "status": "success",
                "mission_id": request.get("mission_id"),
                "analysis": analysis,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erreur d'analyse: {str(e)}")
    
    @app.post("/workshop1/suggestions")
    async def get_suggestions(request: Dict[str, Any]):
        try:
            context = request.get("context", {})
            criterion = request.get("criterion", "")
            suggestions = ai_service.generate_suggestions(context, criterion)
            return {
                "status": "success",
                "criterion": criterion,
                "suggestions": suggestions,
                "count": len(suggestions),
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erreur de suggestion: {str(e)}")

def start_simple_server():
    """Démarre le serveur simple"""
    if FASTAPI_AVAILABLE:
        print(f"🚀 Démarrage service FastAPI sur http://{HOST}:{PORT}")
        uvicorn.run(app, host=HOST, port=PORT, log_level="info")
    else:
        print("🔧 Mode simulation - Service IA disponible en local uniquement")
        print("💡 Installez FastAPI avec: pip install fastapi uvicorn")

if __name__ == "__main__":
    print("🤖 SERVICE IA PYTHON EBIOS - VERSION SIMPLIFIÉE")
    print("=" * 60)
    
    # Test du service
    print("🧪 Test du service IA...")
    test_request = {
        "mission_id": "test-mission",
        "business_values": [{"id": "bv1", "name": "Test BV"}],
        "essential_assets": [],
        "supporting_assets": [],
        "dreaded_events": []
    }
    
    result = ai_service.analyze_workshop1(test_request)
    print(f"✅ Test réussi - Suggestions: {len(result['suggestions'])}")
    
    # Démarrage du serveur
    start_simple_server()
