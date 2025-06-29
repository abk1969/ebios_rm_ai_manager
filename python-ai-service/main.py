"""
🤖 EBIOS AI MANAGER - PYTHON AI SERVICE
Service Python pour l'intégration IA avancée dans Workshop 1
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import uvicorn
import logging
from datetime import datetime
import os
from dotenv import load_dotenv

# Import des services IA (version simplifiée)
try:
    from services.workshop1_ai_service import Workshop1AIService
    from services.suggestion_engine import SuggestionEngine
    SERVICES_AVAILABLE = True
except ImportError:
    SERVICES_AVAILABLE = False
    print("⚠️ Services IA non disponibles, mode simulation activé")

# Configuration
load_dotenv()

app = FastAPI(
    title="EBIOS AI Manager - Python Service",
    description="Service IA avancé pour l'assistance Workshop 1 EBIOS RM",
    version="1.0.0"
)

# Configuration CORS pour l'intégration avec le frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialisation sécurisée des services IA
try:
    from services.workshop1_ai_service import Workshop1AIService
    from services.suggestion_engine import SuggestionEngine
    from services.workshop1_orchestrator import Workshop1OrchestratorFactory
    from services.agent_memory_service import AgentMemoryServiceFactory

    # Services principaux
    workshop1_service = Workshop1AIService()
    suggestion_engine = SuggestionEngine()

    # Nouveaux services avancés (additifs)
    workshop1_orchestrator = Workshop1OrchestratorFactory.create()
    memory_service = AgentMemoryServiceFactory.create()

    logger.info("✅ Services IA avancés initialisés")
    ADVANCED_SERVICES_AVAILABLE = True

except ImportError as e:
    logger.warning(f"⚠️ Services avancés non disponibles: {e}")
    ADVANCED_SERVICES_AVAILABLE = False

# Services temporaires pour les tests (fallback)
class MockAIService:
    def is_ready(self): return True
    def get_request_count(self): return 0
    def get_suggestion_count(self): return 0
    def get_analysis_count(self): return 0
    def get_uptime(self): return "0h 0m"
    def get_memory_usage(self): return "0 MB"
    def get_capabilities(self): return {"mock": True}

# Initialisation des services avec fallback
if not ADVANCED_SERVICES_AVAILABLE:
    workshop1_service = MockAIService()
    suggestion_engine = MockAIService()
    workshop1_orchestrator = MockAIService()
    memory_service = MockAIService()

# Services de compatibilité
guidance_service = MockAIService()
coherence_analyzer = MockAIService()

# === MODÈLES DE REQUÊTE ===

class AISuggestion(BaseModel):
    id: str
    type: str
    priority: str
    title: str
    description: str
    rationale: str
    action_label: Optional[str] = None
    confidence: float
    context: Dict[str, Any]
    created_at: str
    applied: bool

class WorkshopAnalysisRequest(BaseModel):
    mission_id: str
    business_values: List[Dict[str, Any]]
    essential_assets: List[Dict[str, Any]]
    supporting_assets: List[Dict[str, Any]]
    dreaded_events: List[Dict[str, Any]]
    current_step: Optional[str] = None

class SuggestionRequest(BaseModel):
    context: Dict[str, Any]
    criterion: str
    current_data: Dict[str, Any]

class CoherenceRequest(BaseModel):
    mission_id: str
    workshop_data: Dict[str, Any]

# === ENDPOINTS PRINCIPAUX ===

@app.get("/")
async def root():
    """Point d'entrée principal du service IA"""
    return {
        "service": "EBIOS AI Manager - Python Service",
        "version": "1.0.0",
        "status": "active",
        "capabilities": [
            "Workshop 1 AI Assistance",
            "EBIOS RM Guidance",
            "Intelligent Suggestions",
            "Coherence Analysis",
            "Document Processing",
            "Risk Assessment"
        ]
    }

@app.get("/health")
async def health_check():
    """Vérification de l'état du service"""
    services_status = {
        "workshop1_ai": workshop1_service.is_ready(),
        "guidance": guidance_service.is_ready(),
        "suggestions": suggestion_engine.is_ready(),
        "coherence": coherence_analyzer.is_ready()
    }

    # Ajouter les services avancés si disponibles
    if ADVANCED_SERVICES_AVAILABLE:
        services_status.update({
            "orchestrator": workshop1_orchestrator.is_ready(),
            "memory_service": memory_service.is_ready(),
            "advanced_features": True
        })
    else:
        services_status["advanced_features"] = False

    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": services_status,
        "capabilities": workshop1_orchestrator.get_capabilities() if ADVANCED_SERVICES_AVAILABLE else {}
    }

@app.post("/workshop1/analyze")
async def analyze_workshop1(request: WorkshopAnalysisRequest):
    """
    Analyse complète de l'atelier 1 avec suggestions IA
    """
    try:
        logger.info(f"🔍 Analyse Workshop 1 pour mission: {request.mission_id}")
        
        # Analyse contextuelle
        analysis = await workshop1_service.analyze_workshop_context(
            mission_id=request.mission_id,
            business_values=request.business_values,
            essential_assets=request.essential_assets,
            supporting_assets=request.supporting_assets,
            dreaded_events=request.dreaded_events,
            current_step=request.current_step
        )
        
        return {
            "status": "success",
            "mission_id": request.mission_id,
            "analysis": analysis,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"❌ Erreur analyse Workshop 1: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur d'analyse: {str(e)}")

@app.post("/workshop1/suggestions")
async def get_intelligent_suggestions(request: SuggestionRequest):
    """
    Génère des suggestions intelligentes basées sur le contexte
    """
    try:
        logger.info(f"💡 Génération suggestions pour critère: {request.criterion}")
        
        suggestions = await suggestion_engine.generate_contextual_suggestions(
            context=request.context,
            criterion=request.criterion,
            current_data=request.current_data
        )
        
        return {
            "status": "success",
            "criterion": request.criterion,
            "suggestions": suggestions,
            "count": len(suggestions),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"❌ Erreur génération suggestions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur de suggestion: {str(e)}")

@app.post("/workshop1/coherence")
async def analyze_coherence(request: CoherenceRequest):
    """
    Analyse la cohérence des données Workshop 1
    """
    try:
        logger.info(f"🔍 Analyse cohérence pour mission: {request.mission_id}")
        
        coherence_report = await coherence_analyzer.analyze_workshop_coherence(
            mission_id=request.mission_id,
            workshop_data=request.workshop_data
        )
        
        return {
            "status": "success",
            "mission_id": request.mission_id,
            "coherence_report": coherence_report,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"❌ Erreur analyse cohérence: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur de cohérence: {str(e)}")

@app.get("/workshop1/guidance/{workshop_step}")
async def get_contextual_guidance(workshop_step: str):
    """
    Obtient la guidance contextuelle pour une étape spécifique
    """
    try:
        logger.info(f"📚 Guidance pour étape: {workshop_step}")
        
        guidance = await guidance_service.get_step_guidance(workshop_step)
        
        return {
            "status": "success",
            "step": workshop_step,
            "guidance": guidance,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"❌ Erreur guidance: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur de guidance: {str(e)}")

@app.post("/workshop1/auto-complete")
async def auto_complete_workshop(
    request: WorkshopAnalysisRequest,
    background_tasks: BackgroundTasks
):
    """
    Complète automatiquement les éléments manquants du Workshop 1
    """
    try:
        logger.info(f"🤖 Auto-complétion Workshop 1 pour mission: {request.mission_id}")

        # Lancement en arrière-plan pour les tâches longues
        background_tasks.add_task(
            workshop1_service.auto_complete_workshop,
            request.mission_id,
            request.business_values,
            request.essential_assets,
            request.supporting_assets,
            request.dreaded_events
        )

        return {
            "status": "processing",
            "mission_id": request.mission_id,
            "message": "Auto-complétion en cours...",
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"❌ Erreur auto-complétion: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur d'auto-complétion: {str(e)}")

# === NOUVEAUX ENDPOINTS ORCHESTRATION AVANCÉE ===

@app.post("/workshop1/orchestrate")
async def orchestrate_advanced_analysis(request: WorkshopAnalysisRequest):
    """
    🎼 Orchestration avancée avec LangChain + mémoire persistante
    """
    if not ADVANCED_SERVICES_AVAILABLE:
        raise HTTPException(status_code=503, detail="Services avancés non disponibles")

    try:
        logger.info(f"🎼 Orchestration avancée pour mission: {request.mission_id}")

        # Préparer les données pour l'orchestrateur
        workshop_data = {
            "business_values": request.business_values,
            "essential_assets": request.essential_assets,
            "supporting_assets": request.supporting_assets,
            "dreaded_events": request.dreaded_events,
            "current_step": request.current_step
        }

        # Récupérer le contexte utilisateur depuis la mémoire
        user_context = await memory_service.retrieve_user_context(
            user_id="current_user",  # TODO: récupérer depuis auth
            mission_id=request.mission_id
        )

        # Orchestration complète
        result = await workshop1_orchestrator.orchestrate_workshop_analysis(
            mission_id=request.mission_id,
            workshop_data=workshop_data,
            user_context=user_context.__dict__ if user_context else None
        )

        return {
            "status": "success",
            "mission_id": request.mission_id,
            "orchestration_result": result.__dict__,
            "capabilities_used": workshop1_orchestrator.get_capabilities(),
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"❌ Erreur orchestration avancée: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur d'orchestration: {str(e)}")

@app.post("/workshop1/memory/store")
async def store_agent_memory(
    mission_id: str,
    agent_id: str,
    memory_type: str,
    content: Dict[str, Any],
    session_id: Optional[str] = None,
    priority: int = 1,
    expires_in_hours: Optional[int] = None
):
    """
    💾 Stocke une entrée de mémoire pour un agent
    """
    if not ADVANCED_SERVICES_AVAILABLE:
        raise HTTPException(status_code=503, detail="Service mémoire non disponible")

    try:
        session_id = session_id or f"session_{datetime.now().timestamp()}"

        memory_id = await memory_service.store_memory(
            mission_id=mission_id,
            agent_id=agent_id,
            session_id=session_id,
            memory_type=memory_type,
            content=content,
            priority=priority,
            expires_in_hours=expires_in_hours
        )

        return {
            "status": "success",
            "memory_id": memory_id,
            "mission_id": mission_id,
            "agent_id": agent_id,
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"❌ Erreur stockage mémoire: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur de stockage: {str(e)}")

@app.get("/workshop1/memory/retrieve")
async def retrieve_agent_memory(
    mission_id: str,
    agent_id: Optional[str] = None,
    session_id: Optional[str] = None,
    memory_type: Optional[str] = None,
    limit: int = 50
):
    """
    🔍 Récupère les entrées de mémoire d'un agent
    """
    if not ADVANCED_SERVICES_AVAILABLE:
        raise HTTPException(status_code=503, detail="Service mémoire non disponible")

    try:
        memories = await memory_service.retrieve_memory(
            mission_id=mission_id,
            agent_id=agent_id,
            session_id=session_id,
            memory_type=memory_type,
            limit=limit
        )

        return {
            "status": "success",
            "mission_id": mission_id,
            "memories": [memory.__dict__ for memory in memories],
            "count": len(memories),
            "timestamp": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"❌ Erreur récupération mémoire: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur de récupération: {str(e)}")

# === ENDPOINTS DE MONITORING ===

@app.get("/metrics")
async def get_metrics():
    """Métriques du service IA"""
    return {
        "requests_processed": workshop1_service.get_request_count(),
        "suggestions_generated": suggestion_engine.get_suggestion_count(),
        "coherence_analyses": coherence_analyzer.get_analysis_count(),
        "uptime": workshop1_service.get_uptime(),
        "memory_usage": workshop1_service.get_memory_usage()
    }

if __name__ == "__main__":
    port = int(os.getenv("AI_SERVICE_PORT", 8000))
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=port, 
        reload=True,
        log_level="info"
    )
