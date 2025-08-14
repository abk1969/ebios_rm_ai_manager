"""
🔗 SERVICE DE BASE DE DONNÉES UNIFIÉE
Service pour gérer les interactions avec PostgreSQL de manière unifiée
"""

import logging
import hashlib
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import and_, or_, desc, func

from config.database import get_db_session
from models.ai_models import (
    AISession, AgentMemory, AISuggestion, 
    SemanticAnalysis, AIQueryCache, AIMetric
)

logger = logging.getLogger(__name__)

class UnifiedDBService:
    """Service unifié pour les opérations de base de données"""
    
    def __init__(self):
        self.logger = logger
    
    # === GESTION DES SESSIONS AI ===
    
    def create_ai_session(self, user_id: str, mission_id: str, context_data: dict = None) -> Optional[str]:
        """Crée une nouvelle session AI"""
        try:
            with get_db_session() as session:
                # Générer un token unique
                session_token = hashlib.sha256(f"{user_id}_{mission_id}_{datetime.utcnow()}".encode()).hexdigest()
                
                ai_session = AISession(
                    user_id=user_id,
                    mission_id=mission_id,
                    session_token=session_token,
                    context_data=context_data or {}
                )
                
                session.add(ai_session)
                session.commit()
                
                self.logger.info(f"✅ Session AI créée: {session_token}")
                return session_token
                
        except SQLAlchemyError as e:
            self.logger.error(f"❌ Erreur création session AI: {e}")
            return None
    
    def get_ai_session(self, session_token: str) -> Optional[AISession]:
        """Récupère une session AI par token"""
        try:
            with get_db_session() as session:
                ai_session = session.query(AISession).filter(
                    and_(
                        AISession.session_token == session_token,
                        AISession.is_active == True,
                        AISession.expires_at > datetime.utcnow()
                    )
                ).first()
                
                if ai_session:
                    # Mettre à jour l'activité
                    ai_session.last_activity = datetime.utcnow()
                    session.commit()
                
                return ai_session
                
        except SQLAlchemyError as e:
            self.logger.error(f"❌ Erreur récupération session AI: {e}")
            return None
    
    # === GESTION DE LA MÉMOIRE DES AGENTS ===
    
    def store_agent_memory(self, mission_id: str, user_id: str, agent_type: str, 
                          memory_type: str, content: dict, relevance_score: float = 0.5,
                          tags: List[str] = None, expires_hours: int = None) -> bool:
        """Stocke une entrée de mémoire d'agent"""
        try:
            with get_db_session() as session:
                expires_at = None
                if expires_hours:
                    expires_at = datetime.utcnow() + timedelta(hours=expires_hours)
                
                memory = AgentMemory(
                    mission_id=mission_id,
                    user_id=user_id,
                    agent_type=agent_type,
                    memory_type=memory_type,
                    content=content,
                    relevance_score=relevance_score,
                    tags=tags or [],
                    meta_data={},
                    expires_at=expires_at
                )
                
                session.add(memory)
                session.commit()
                
                self.logger.info(f"✅ Mémoire agent stockée: {agent_type}/{memory_type}")
                return True
                
        except SQLAlchemyError as e:
            self.logger.error(f"❌ Erreur stockage mémoire agent: {e}")
            return False
    
    def get_agent_memory(self, mission_id: str, agent_type: str, memory_type: str = None,
                        limit: int = 10) -> List[AgentMemory]:
        """Récupère la mémoire d'un agent"""
        try:
            with get_db_session() as session:
                query = session.query(AgentMemory).filter(
                    and_(
                        AgentMemory.mission_id == mission_id,
                        AgentMemory.agent_type == agent_type,
                        or_(
                            AgentMemory.expires_at.is_(None),
                            AgentMemory.expires_at > datetime.utcnow()
                        )
                    )
                )
                
                if memory_type:
                    query = query.filter(AgentMemory.memory_type == memory_type)
                
                memories = query.order_by(desc(AgentMemory.relevance_score), 
                                        desc(AgentMemory.created_at)).limit(limit).all()
                
                return memories
                
        except SQLAlchemyError as e:
            self.logger.error(f"❌ Erreur récupération mémoire agent: {e}")
            return []
    
    # === GESTION DES SUGGESTIONS AI ===
    
    def create_ai_suggestion(self, mission_id: str, user_id: str, suggestion_type: str,
                           content: str, confidence_score: float, context_data: dict = None,
                           workshop_id: str = None) -> bool:
        """Crée une suggestion AI"""
        try:
            with get_db_session() as session:
                suggestion = AISuggestion(
                    mission_id=mission_id,
                    workshop_id=workshop_id,
                    user_id=user_id,
                    suggestion_type=suggestion_type,
                    content=content,
                    confidence_score=confidence_score,
                    context_data=context_data or {}
                )
                
                session.add(suggestion)
                session.commit()
                
                self.logger.info(f"✅ Suggestion AI créée: {suggestion_type}")
                return True
                
        except SQLAlchemyError as e:
            self.logger.error(f"❌ Erreur création suggestion AI: {e}")
            return False
    
    def get_ai_suggestions(self, mission_id: str, suggestion_type: str = None,
                          workshop_id: str = None, limit: int = 10) -> List[AISuggestion]:
        """Récupère les suggestions AI"""
        try:
            with get_db_session() as session:
                query = session.query(AISuggestion).filter(
                    AISuggestion.mission_id == mission_id
                )
                
                if suggestion_type:
                    query = query.filter(AISuggestion.suggestion_type == suggestion_type)
                
                if workshop_id:
                    query = query.filter(AISuggestion.workshop_id == workshop_id)
                
                suggestions = query.order_by(desc(AISuggestion.confidence_score),
                                           desc(AISuggestion.created_at)).limit(limit).all()
                
                return suggestions
                
        except SQLAlchemyError as e:
            self.logger.error(f"❌ Erreur récupération suggestions AI: {e}")
            return []
    
    # === GESTION DU CACHE DES REQUÊTES ===
    
    def get_cached_query(self, query_text: str) -> Optional[dict]:
        """Récupère une requête en cache"""
        try:
            query_hash = hashlib.sha256(query_text.encode()).hexdigest()
            
            with get_db_session() as session:
                cached = session.query(AIQueryCache).filter(
                    and_(
                        AIQueryCache.query_hash == query_hash,
                        AIQueryCache.expires_at > datetime.utcnow()
                    )
                ).first()
                
                if cached:
                    cached.increment_hit()
                    session.commit()
                    return cached.response_data
                
                return None
                
        except SQLAlchemyError as e:
            self.logger.error(f"❌ Erreur récupération cache: {e}")
            return None
    
    def cache_query_response(self, query_text: str, response_data: dict, 
                           model_used: str = None, tokens_used: int = None,
                           processing_time_ms: int = None, expires_hours: int = 1) -> bool:
        """Met en cache une réponse de requête"""
        try:
            query_hash = hashlib.sha256(query_text.encode()).hexdigest()
            expires_at = datetime.utcnow() + timedelta(hours=expires_hours)
            
            with get_db_session() as session:
                # Vérifier si existe déjà
                existing = session.query(AIQueryCache).filter(
                    AIQueryCache.query_hash == query_hash
                ).first()
                
                if existing:
                    existing.response_data = response_data
                    existing.expires_at = expires_at
                    existing.last_accessed = datetime.utcnow()
                else:
                    cached = AIQueryCache(
                        query_hash=query_hash,
                        query_text=query_text,
                        response_data=response_data,
                        model_used=model_used,
                        tokens_used=tokens_used,
                        processing_time_ms=processing_time_ms,
                        expires_at=expires_at
                    )
                    session.add(cached)
                
                session.commit()
                return True
                
        except SQLAlchemyError as e:
            self.logger.error(f"❌ Erreur mise en cache: {e}")
            return False
    
    # === MÉTRIQUES ===
    
    def record_ai_metric(self, metric_type: str, service_name: str, value: float,
                        unit: str = None, context: dict = None) -> bool:
        """Enregistre une métrique AI"""
        try:
            with get_db_session() as session:
                metric = AIMetric(
                    metric_type=metric_type,
                    service_name=service_name,
                    value=value,
                    unit=unit,
                    context=context or {}
                )
                
                session.add(metric)
                session.commit()
                return True
                
        except SQLAlchemyError as e:
            self.logger.error(f"❌ Erreur enregistrement métrique: {e}")
            return False

# Instance globale
unified_db = UnifiedDBService()
