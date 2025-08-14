"""
🤖 MODÈLES DE DONNÉES AI POUR POSTGRESQL
Modèles SQLAlchemy pour les tables AI unifiées
"""

from sqlalchemy import Column, String, DateTime, Text, Float, Integer, Boolean, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime, timedelta
import uuid

from config.database import Base

class AISession(Base):
    """Sessions utilisateur pour le contexte AI"""
    __tablename__ = 'ai_sessions'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    mission_id = Column(UUID(as_uuid=True), nullable=False)
    session_token = Column(String(255), unique=True, nullable=False)
    context_data = Column(JSONB, default={})
    last_activity = Column(DateTime(timezone=True), default=func.now())
    expires_at = Column(DateTime(timezone=True), default=lambda: datetime.utcnow() + timedelta(hours=24))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<AISession(id={self.id}, user_id={self.user_id}, mission_id={self.mission_id})>"
    
    def is_expired(self):
        """Vérifie si la session a expiré"""
        return datetime.utcnow() > self.expires_at
    
    def extend_session(self, hours=24):
        """Prolonge la session"""
        self.expires_at = datetime.utcnow() + timedelta(hours=hours)
        self.last_activity = datetime.utcnow()

class AgentMemory(Base):
    """Mémoire des agents AI"""
    __tablename__ = 'agent_memory'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mission_id = Column(UUID(as_uuid=True), nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    agent_type = Column(String(100), nullable=False)  # workshop1, workshop2, etc.
    memory_type = Column(String(50), nullable=False)  # context, suggestion, analysis
    content = Column(JSONB, nullable=False)
    relevance_score = Column(Float, default=0.5)
    tags = Column(ARRAY(String), default=[])
    meta_data = Column(JSONB, default={})
    expires_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<AgentMemory(id={self.id}, agent_type={self.agent_type}, memory_type={self.memory_type})>"
    
    def is_expired(self):
        """Vérifie si la mémoire a expiré"""
        if self.expires_at:
            return datetime.utcnow() > self.expires_at
        return False

class AISuggestion(Base):
    """Suggestions AI contextuelles"""
    __tablename__ = 'ai_suggestions'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mission_id = Column(UUID(as_uuid=True), nullable=False)
    workshop_id = Column(UUID(as_uuid=True))
    user_id = Column(UUID(as_uuid=True), nullable=False)
    suggestion_type = Column(String(100), nullable=False)  # asset, threat, measure, etc.
    content = Column(Text, nullable=False)
    confidence_score = Column(Float, default=0.5)
    context_data = Column(JSONB, default={})
    is_applied = Column(Boolean, default=False)
    applied_at = Column(DateTime(timezone=True))
    feedback_rating = Column(Integer)  # 1-5 rating from user
    feedback_comment = Column(Text)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<AISuggestion(id={self.id}, type={self.suggestion_type}, confidence={self.confidence_score})>"
    
    def apply_suggestion(self, feedback_rating=None, feedback_comment=None):
        """Marque la suggestion comme appliquée"""
        self.is_applied = True
        self.applied_at = datetime.utcnow()
        if feedback_rating:
            self.feedback_rating = feedback_rating
        if feedback_comment:
            self.feedback_comment = feedback_comment

class SemanticAnalysis(Base):
    """Analyses sémantiques"""
    __tablename__ = 'semantic_analyses'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mission_id = Column(UUID(as_uuid=True), nullable=False)
    content_type = Column(String(100), nullable=False)  # document, text, asset_description
    content_hash = Column(String(64), nullable=False)  # SHA256 du contenu analysé
    original_content = Column(Text, nullable=False)
    analysis_results = Column(JSONB, nullable=False)
    keywords = Column(ARRAY(String), default=[])
    entities = Column(JSONB, default={})
    sentiment_score = Column(Float)
    language = Column(String(10), default='fr')
    processing_time_ms = Column(Integer)
    created_at = Column(DateTime(timezone=True), default=func.now())
    
    def __repr__(self):
        return f"<SemanticAnalysis(id={self.id}, content_type={self.content_type}, language={self.language})>"

class AIQueryCache(Base):
    """Cache des requêtes AI"""
    __tablename__ = 'ai_query_cache'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    query_hash = Column(String(64), unique=True, nullable=False)  # SHA256 de la requête
    query_text = Column(Text, nullable=False)
    response_data = Column(JSONB, nullable=False)
    model_used = Column(String(100))
    tokens_used = Column(Integer)
    processing_time_ms = Column(Integer)
    hit_count = Column(Integer, default=1)
    expires_at = Column(DateTime(timezone=True), default=lambda: datetime.utcnow() + timedelta(hours=1))
    created_at = Column(DateTime(timezone=True), default=func.now())
    last_accessed = Column(DateTime(timezone=True), default=func.now())
    
    def __repr__(self):
        return f"<AIQueryCache(id={self.id}, model={self.model_used}, hits={self.hit_count})>"
    
    def is_expired(self):
        """Vérifie si le cache a expiré"""
        return datetime.utcnow() > self.expires_at
    
    def increment_hit(self):
        """Incrémente le compteur d'accès"""
        self.hit_count += 1
        self.last_accessed = datetime.utcnow()

class AIMetric(Base):
    """Métriques de performance AI"""
    __tablename__ = 'ai_metrics'
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    metric_type = Column(String(100), nullable=False)  # response_time, accuracy, usage
    service_name = Column(String(100), nullable=False)  # workshop1_ai, semantic_analyzer, etc.
    value = Column(Float, nullable=False)
    unit = Column(String(20))
    context = Column(JSONB, default={})
    recorded_at = Column(DateTime(timezone=True), default=func.now())
    
    def __repr__(self):
        return f"<AIMetric(id={self.id}, type={self.metric_type}, service={self.service_name}, value={self.value})>"
