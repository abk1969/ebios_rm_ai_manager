"""
🧠 SERVICE DE MÉMOIRE PERSISTANTE DES AGENTS IA
Gestion de la mémoire contextuelle avec Redis + SQLAlchemy
ATTENTION: Service additif qui ne casse pas l'existant
"""

import asyncio
import logging
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass, asdict
import uuid

# Imports conditionnels pour éviter les erreurs
try:
    import redis
    from redis.exceptions import ConnectionError as RedisConnectionError
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False
    logging.warning("🔧 Redis non disponible, mémoire locale activée")

try:
    from sqlalchemy import create_engine, Column, String, DateTime, Text, Float, Integer, Boolean
    from sqlalchemy.ext.declarative import declarative_base
    from sqlalchemy.orm import sessionmaker, Session
    from sqlalchemy.dialects.postgresql import UUID
    import sqlalchemy
    SQLALCHEMY_AVAILABLE = True
except ImportError:
    SQLALCHEMY_AVAILABLE = False
    logging.warning("🔧 SQLAlchemy non disponible, persistance désactivée")

try:
    from celery import Celery
    CELERY_AVAILABLE = True
except ImportError:
    CELERY_AVAILABLE = False
    logging.warning("🔧 Celery non disponible, tâches synchrones")

logger = logging.getLogger(__name__)

# === MODÈLES DE DONNÉES ===

@dataclass
class AgentMemoryEntry:
    """Entrée de mémoire d'agent"""
    id: str
    mission_id: str
    agent_id: str
    session_id: str
    memory_type: str  # 'context', 'interaction', 'analysis', 'preference'
    content: Dict[str, Any]
    timestamp: datetime
    expires_at: Optional[datetime] = None
    priority: int = 1  # 1=low, 2=medium, 3=high, 4=critical
    tags: List[str] = None
    
    def __post_init__(self):
        if self.tags is None:
            self.tags = []

@dataclass
class UserContext:
    """Contexte utilisateur persistant"""
    user_id: str
    mission_id: str
    preferences: Dict[str, Any]
    interaction_history: List[Dict[str, Any]]
    learning_progress: Dict[str, float]
    last_activity: datetime
    session_count: int = 0
    total_time_spent: int = 0  # en secondes

# === MODÈLES SQLALCHEMY (SI DISPONIBLE) ===

if SQLALCHEMY_AVAILABLE:
    Base = declarative_base()
    
    class AgentMemoryModel(Base):
        __tablename__ = 'agent_memory'
        
        id = Column(String, primary_key=True)
        mission_id = Column(String, nullable=False, index=True)
        agent_id = Column(String, nullable=False, index=True)
        session_id = Column(String, nullable=False, index=True)
        memory_type = Column(String, nullable=False, index=True)
        content = Column(Text, nullable=False)  # JSON stringifié
        timestamp = Column(DateTime, nullable=False, default=datetime.utcnow)
        expires_at = Column(DateTime, nullable=True)
        priority = Column(Integer, default=1)
        tags = Column(Text, nullable=True)  # JSON array stringifié
        
        def to_memory_entry(self) -> AgentMemoryEntry:
            return AgentMemoryEntry(
                id=self.id,
                mission_id=self.mission_id,
                agent_id=self.agent_id,
                session_id=self.session_id,
                memory_type=self.memory_type,
                content=json.loads(self.content),
                timestamp=self.timestamp,
                expires_at=self.expires_at,
                priority=self.priority,
                tags=json.loads(self.tags) if self.tags else []
            )
    
    class UserContextModel(Base):
        __tablename__ = 'user_context'
        
        id = Column(String, primary_key=True)
        user_id = Column(String, nullable=False, index=True)
        mission_id = Column(String, nullable=False, index=True)
        preferences = Column(Text, nullable=False)  # JSON
        interaction_history = Column(Text, nullable=False)  # JSON
        learning_progress = Column(Text, nullable=False)  # JSON
        last_activity = Column(DateTime, nullable=False, default=datetime.utcnow)
        session_count = Column(Integer, default=0)
        total_time_spent = Column(Integer, default=0)

# === SERVICE PRINCIPAL ===

class AgentMemoryService:
    """
    Service de mémoire persistante pour agents IA
    Utilise Redis pour cache rapide + SQLAlchemy pour persistance
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.redis_client = None
        self.db_session = None
        self.celery_app = None
        self.local_memory = {}  # Fallback mémoire locale
        
        # Initialisation sécurisée
        self._initialize_safely()
    
    def _initialize_safely(self):
        """Initialisation sécurisée sans casser l'existant"""
        logger.info("🧠 Initialisation Service Mémoire Agents IA")
        
        # 1. Initialiser Redis si disponible
        if REDIS_AVAILABLE:
            self._setup_redis()
        
        # 2. Initialiser SQLAlchemy si disponible
        if SQLALCHEMY_AVAILABLE:
            self._setup_database()
        
        # 3. Initialiser Celery si disponible
        if CELERY_AVAILABLE:
            self._setup_celery()
        
        logger.info(f"✅ Service mémoire initialisé - Redis: {self.redis_client is not None}, DB: {self.db_session is not None}")
    
    def _setup_redis(self):
        """Configure Redis pour cache rapide"""
        try:
            redis_config = self.config.get('redis', {})
            self.redis_client = redis.Redis(
                host=redis_config.get('host', 'localhost'),
                port=redis_config.get('port', 6379),
                db=redis_config.get('db', 0),
                decode_responses=True,
                socket_connect_timeout=2,
                socket_timeout=2
            )
            
            # Test de connexion
            self.redis_client.ping()
            logger.info("✅ Redis connecté pour cache mémoire")
            
        except Exception as e:
            logger.warning(f"⚠️ Redis non disponible: {e}")
            self.redis_client = None
    
    def _setup_database(self):
        """Configure SQLAlchemy pour persistance"""
        try:
            db_config = self.config.get('database', {})
            db_url = db_config.get('url', 'sqlite:///agent_memory.db')
            
            engine = create_engine(db_url, echo=False)
            Base.metadata.create_all(engine)
            
            SessionLocal = sessionmaker(bind=engine)
            self.db_session = SessionLocal()
            
            logger.info("✅ Base de données connectée pour persistance")
            
        except Exception as e:
            logger.warning(f"⚠️ Base de données non disponible: {e}")
            self.db_session = None
    
    def _setup_celery(self):
        """Configure Celery pour tâches asynchrones"""
        try:
            celery_config = self.config.get('celery', {})
            broker_url = celery_config.get('broker', 'redis://localhost:6379/1')
            
            self.celery_app = Celery('agent_memory', broker=broker_url)
            logger.info("✅ Celery configuré pour tâches asynchrones")
            
        except Exception as e:
            logger.warning(f"⚠️ Celery non disponible: {e}")
            self.celery_app = None
    
    async def store_memory(
        self, 
        mission_id: str,
        agent_id: str,
        session_id: str,
        memory_type: str,
        content: Dict[str, Any],
        priority: int = 1,
        expires_in_hours: Optional[int] = None,
        tags: Optional[List[str]] = None
    ) -> str:
        """
        Stocke une entrée de mémoire
        """
        memory_id = str(uuid.uuid4())
        expires_at = None
        if expires_in_hours:
            expires_at = datetime.utcnow() + timedelta(hours=expires_in_hours)
        
        memory_entry = AgentMemoryEntry(
            id=memory_id,
            mission_id=mission_id,
            agent_id=agent_id,
            session_id=session_id,
            memory_type=memory_type,
            content=content,
            timestamp=datetime.utcnow(),
            expires_at=expires_at,
            priority=priority,
            tags=tags or []
        )
        
        # Stockage multi-niveaux
        await self._store_in_redis(memory_entry)
        await self._store_in_database(memory_entry)
        self._store_in_local_memory(memory_entry)
        
        logger.info(f"💾 Mémoire stockée: {memory_id} pour agent {agent_id}")
        return memory_id
    
    async def retrieve_memory(
        self,
        mission_id: str,
        agent_id: Optional[str] = None,
        session_id: Optional[str] = None,
        memory_type: Optional[str] = None,
        limit: int = 100
    ) -> List[AgentMemoryEntry]:
        """
        Récupère les entrées de mémoire selon les critères
        """
        # Essayer Redis d'abord (plus rapide)
        memories = await self._retrieve_from_redis(mission_id, agent_id, session_id, memory_type, limit)
        
        # Si pas trouvé dans Redis, essayer la base de données
        if not memories and self.db_session:
            memories = await self._retrieve_from_database(mission_id, agent_id, session_id, memory_type, limit)
        
        # Fallback mémoire locale
        if not memories:
            memories = self._retrieve_from_local_memory(mission_id, agent_id, session_id, memory_type, limit)
        
        # Filtrer les entrées expirées
        now = datetime.utcnow()
        valid_memories = [
            memory for memory in memories 
            if memory.expires_at is None or memory.expires_at > now
        ]
        
        logger.info(f"🔍 Récupéré {len(valid_memories)} entrées mémoire pour mission {mission_id}")
        return valid_memories
    
    async def _store_in_redis(self, memory_entry: AgentMemoryEntry):
        """Stocke dans Redis pour accès rapide"""
        if not self.redis_client:
            return
        
        try:
            key = f"memory:{memory_entry.mission_id}:{memory_entry.agent_id}:{memory_entry.id}"
            data = json.dumps(asdict(memory_entry), default=str)
            
            # TTL basé sur expires_at ou 24h par défaut
            ttl = 86400  # 24h
            if memory_entry.expires_at:
                ttl = int((memory_entry.expires_at - datetime.utcnow()).total_seconds())
                ttl = max(ttl, 60)  # Minimum 1 minute
            
            self.redis_client.setex(key, ttl, data)
            
            # Ajouter à l'index pour recherche
            index_key = f"index:{memory_entry.mission_id}:{memory_entry.agent_id}"
            self.redis_client.sadd(index_key, memory_entry.id)
            self.redis_client.expire(index_key, ttl)
            
        except Exception as e:
            logger.warning(f"⚠️ Erreur stockage Redis: {e}")
    
    async def _store_in_database(self, memory_entry: AgentMemoryEntry):
        """Stocke dans la base de données pour persistance"""
        if not self.db_session:
            return
        
        try:
            db_entry = AgentMemoryModel(
                id=memory_entry.id,
                mission_id=memory_entry.mission_id,
                agent_id=memory_entry.agent_id,
                session_id=memory_entry.session_id,
                memory_type=memory_entry.memory_type,
                content=json.dumps(memory_entry.content, default=str),
                timestamp=memory_entry.timestamp,
                expires_at=memory_entry.expires_at,
                priority=memory_entry.priority,
                tags=json.dumps(memory_entry.tags) if memory_entry.tags else None
            )
            
            self.db_session.add(db_entry)
            self.db_session.commit()
            
        except Exception as e:
            logger.warning(f"⚠️ Erreur stockage DB: {e}")
            if self.db_session:
                self.db_session.rollback()
    
    def _store_in_local_memory(self, memory_entry: AgentMemoryEntry):
        """Stocke en mémoire locale comme fallback"""
        key = f"{memory_entry.mission_id}:{memory_entry.agent_id}"
        if key not in self.local_memory:
            self.local_memory[key] = []
        
        self.local_memory[key].append(memory_entry)
        
        # Limiter la taille (garder les 100 plus récents)
        if len(self.local_memory[key]) > 100:
            self.local_memory[key] = sorted(
                self.local_memory[key], 
                key=lambda x: x.timestamp, 
                reverse=True
            )[:100]
    
    async def _retrieve_from_redis(
        self, 
        mission_id: str, 
        agent_id: Optional[str], 
        session_id: Optional[str],
        memory_type: Optional[str], 
        limit: int
    ) -> List[AgentMemoryEntry]:
        """Récupère depuis Redis"""
        if not self.redis_client:
            return []
        
        try:
            memories = []
            
            if agent_id:
                # Recherche spécifique par agent
                index_key = f"index:{mission_id}:{agent_id}"
                memory_ids = self.redis_client.smembers(index_key)
                
                for memory_id in memory_ids:
                    key = f"memory:{mission_id}:{agent_id}:{memory_id}"
                    data = self.redis_client.get(key)
                    if data:
                        memory_dict = json.loads(data)
                        memory_dict['timestamp'] = datetime.fromisoformat(memory_dict['timestamp'])
                        if memory_dict.get('expires_at'):
                            memory_dict['expires_at'] = datetime.fromisoformat(memory_dict['expires_at'])
                        
                        memory = AgentMemoryEntry(**memory_dict)
                        
                        # Filtrer par critères
                        if session_id and memory.session_id != session_id:
                            continue
                        if memory_type and memory.memory_type != memory_type:
                            continue
                        
                        memories.append(memory)
            
            # Trier par priorité puis timestamp
            memories.sort(key=lambda x: (x.priority, x.timestamp), reverse=True)
            return memories[:limit]
            
        except Exception as e:
            logger.warning(f"⚠️ Erreur récupération Redis: {e}")
            return []
    
    async def _retrieve_from_database(
        self, 
        mission_id: str, 
        agent_id: Optional[str], 
        session_id: Optional[str],
        memory_type: Optional[str], 
        limit: int
    ) -> List[AgentMemoryEntry]:
        """Récupère depuis la base de données"""
        if not self.db_session:
            return []
        
        try:
            query = self.db_session.query(AgentMemoryModel).filter(
                AgentMemoryModel.mission_id == mission_id
            )
            
            if agent_id:
                query = query.filter(AgentMemoryModel.agent_id == agent_id)
            if session_id:
                query = query.filter(AgentMemoryModel.session_id == session_id)
            if memory_type:
                query = query.filter(AgentMemoryModel.memory_type == memory_type)
            
            # Filtrer les non-expirés
            now = datetime.utcnow()
            query = query.filter(
                (AgentMemoryModel.expires_at.is_(None)) | 
                (AgentMemoryModel.expires_at > now)
            )
            
            # Ordonner et limiter
            query = query.order_by(
                AgentMemoryModel.priority.desc(),
                AgentMemoryModel.timestamp.desc()
            ).limit(limit)
            
            db_entries = query.all()
            return [entry.to_memory_entry() for entry in db_entries]
            
        except Exception as e:
            logger.warning(f"⚠️ Erreur récupération DB: {e}")
            return []
    
    def _retrieve_from_local_memory(
        self, 
        mission_id: str, 
        agent_id: Optional[str], 
        session_id: Optional[str],
        memory_type: Optional[str], 
        limit: int
    ) -> List[AgentMemoryEntry]:
        """Récupère depuis la mémoire locale"""
        memories = []
        
        for key, entries in self.local_memory.items():
            key_mission, key_agent = key.split(':', 1)
            
            if key_mission != mission_id:
                continue
            if agent_id and key_agent != agent_id:
                continue
            
            for entry in entries:
                if session_id and entry.session_id != session_id:
                    continue
                if memory_type and entry.memory_type != memory_type:
                    continue
                
                memories.append(entry)
        
        # Trier et limiter
        memories.sort(key=lambda x: (x.priority, x.timestamp), reverse=True)
        return memories[:limit]
    
    async def store_user_context(self, user_context: UserContext) -> bool:
        """Stocke le contexte utilisateur"""
        try:
            # Redis pour accès rapide
            if self.redis_client:
                key = f"user_context:{user_context.user_id}:{user_context.mission_id}"
                data = json.dumps(asdict(user_context), default=str)
                self.redis_client.setex(key, 3600, data)  # 1h TTL
            
            # Base de données pour persistance
            if self.db_session:
                db_entry = UserContextModel(
                    id=f"{user_context.user_id}_{user_context.mission_id}",
                    user_id=user_context.user_id,
                    mission_id=user_context.mission_id,
                    preferences=json.dumps(user_context.preferences),
                    interaction_history=json.dumps(user_context.interaction_history, default=str),
                    learning_progress=json.dumps(user_context.learning_progress),
                    last_activity=user_context.last_activity,
                    session_count=user_context.session_count,
                    total_time_spent=user_context.total_time_spent
                )
                
                # Upsert
                existing = self.db_session.query(UserContextModel).filter(
                    UserContextModel.user_id == user_context.user_id,
                    UserContextModel.mission_id == user_context.mission_id
                ).first()
                
                if existing:
                    for attr in ['preferences', 'interaction_history', 'learning_progress', 
                               'last_activity', 'session_count', 'total_time_spent']:
                        setattr(existing, attr, getattr(db_entry, attr))
                else:
                    self.db_session.add(db_entry)
                
                self.db_session.commit()
            
            logger.info(f"💾 Contexte utilisateur sauvegardé: {user_context.user_id}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur sauvegarde contexte utilisateur: {e}")
            return False
    
    async def retrieve_user_context(self, user_id: str, mission_id: str) -> Optional[UserContext]:
        """Récupère le contexte utilisateur"""
        try:
            # Essayer Redis d'abord
            if self.redis_client:
                key = f"user_context:{user_id}:{mission_id}"
                data = self.redis_client.get(key)
                if data:
                    context_dict = json.loads(data)
                    context_dict['last_activity'] = datetime.fromisoformat(context_dict['last_activity'])
                    return UserContext(**context_dict)
            
            # Fallback base de données
            if self.db_session:
                db_entry = self.db_session.query(UserContextModel).filter(
                    UserContextModel.user_id == user_id,
                    UserContextModel.mission_id == mission_id
                ).first()
                
                if db_entry:
                    return UserContext(
                        user_id=db_entry.user_id,
                        mission_id=db_entry.mission_id,
                        preferences=json.loads(db_entry.preferences),
                        interaction_history=json.loads(db_entry.interaction_history),
                        learning_progress=json.loads(db_entry.learning_progress),
                        last_activity=db_entry.last_activity,
                        session_count=db_entry.session_count,
                        total_time_spent=db_entry.total_time_spent
                    )
            
            return None
            
        except Exception as e:
            logger.error(f"❌ Erreur récupération contexte utilisateur: {e}")
            return None
    
    async def cleanup_expired_memories(self):
        """Nettoie les mémoires expirées"""
        try:
            now = datetime.utcnow()
            
            # Nettoyage base de données
            if self.db_session:
                expired_count = self.db_session.query(AgentMemoryModel).filter(
                    AgentMemoryModel.expires_at < now
                ).delete()
                self.db_session.commit()
                
                if expired_count > 0:
                    logger.info(f"🧹 {expired_count} mémoires expirées supprimées de la DB")
            
            # Redis se nettoie automatiquement avec TTL
            
            # Nettoyage mémoire locale
            for key in list(self.local_memory.keys()):
                self.local_memory[key] = [
                    memory for memory in self.local_memory[key]
                    if memory.expires_at is None or memory.expires_at > now
                ]
                
                if not self.local_memory[key]:
                    del self.local_memory[key]
            
        except Exception as e:
            logger.error(f"❌ Erreur nettoyage mémoires: {e}")
    
    def is_ready(self) -> bool:
        """Vérifie si le service est prêt"""
        return True  # Toujours prêt grâce au fallback mémoire locale
    
    def get_status(self) -> Dict[str, Any]:
        """Retourne le statut du service"""
        return {
            "redis_connected": self.redis_client is not None,
            "database_connected": self.db_session is not None,
            "celery_available": self.celery_app is not None,
            "local_memory_entries": sum(len(entries) for entries in self.local_memory.values()),
            "ready": self.is_ready()
        }

# === FACTORY ===

class AgentMemoryServiceFactory:
    """Factory pour créer le service de mémoire"""
    
    @staticmethod
    def create(config: Optional[Dict[str, Any]] = None) -> AgentMemoryService:
        """Crée le service de mémoire de manière sécurisée"""
        try:
            service = AgentMemoryService(config)
            logger.info("✅ Service mémoire agents créé avec succès")
            return service
        except Exception as e:
            logger.error(f"❌ Erreur création service mémoire: {e}")
            # Retourner un service minimal
            return AgentMemoryService({})

# Export principal
__all__ = ['AgentMemoryService', 'AgentMemoryServiceFactory', 'AgentMemoryEntry', 'UserContext']
