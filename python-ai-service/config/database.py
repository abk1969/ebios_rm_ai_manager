"""
🗄️ CONFIGURATION BASE DE DONNÉES UNIFIÉE
Configuration PostgreSQL pour le service Python AI
"""

import os
import logging
import time
from typing import Optional
from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
from contextlib import contextmanager

logger = logging.getLogger(__name__)

# Base pour les modèles SQLAlchemy
Base = declarative_base()

class DatabaseConfig:
    """Configuration unifiée de la base de données"""
    
    def __init__(self):
        # Configuration PostgreSQL (même que l'API Node.js)
        self.db_host = os.getenv('DB_HOST', 'localhost')
        self.db_port = os.getenv('DB_PORT', '5432')
        self.db_name = os.getenv('DB_NAME', 'ebios')
        self.db_user = os.getenv('DB_USER', 'postgres')
        self.db_password = os.getenv('DB_PASSWORD', 'postgres')
        
        # URL de connexion
        self.database_url = f"postgresql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"
        
        # Configuration du pool de connexions
        self.pool_size = int(os.getenv('DB_POOL_SIZE', '5'))
        self.max_overflow = int(os.getenv('DB_MAX_OVERFLOW', '10'))
        self.pool_timeout = int(os.getenv('DB_POOL_TIMEOUT', '30'))
        self.pool_recycle = int(os.getenv('DB_POOL_RECYCLE', '3600'))
        
        # Engine SQLAlchemy
        self.engine = None
        self.SessionLocal = None
        
    def initialize(self):
        """Initialise la connexion à la base de données"""
        try:
            logger.info(f"🔗 Connexion à PostgreSQL: {self.db_host}:{self.db_port}/{self.db_name}")
            
            self.engine = create_engine(
                self.database_url,
                poolclass=QueuePool,
                pool_size=self.pool_size,
                max_overflow=self.max_overflow,
                pool_timeout=self.pool_timeout,
                pool_recycle=self.pool_recycle,
                echo=os.getenv('DB_ECHO', 'false').lower() == 'true'
            )
            
            # Test de connexion
            with self.engine.connect() as conn:
                result = conn.execute(text("SELECT version()"))
                version = result.fetchone()[0]
                logger.info(f"✅ PostgreSQL connecté: {version}")
            
            # Session factory
            self.SessionLocal = sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=self.engine
            )
            
            logger.info("✅ Configuration base de données initialisée")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur connexion base de données: {e}")
            return False
    
    @contextmanager
    def get_session(self):
        """Context manager pour les sessions de base de données"""
        if not self.SessionLocal:
            raise RuntimeError("Base de données non initialisée")
            
        session = self.SessionLocal()
        try:
            yield session
            session.commit()
        except Exception as e:
            session.rollback()
            logger.error(f"❌ Erreur session base de données: {e}")
            raise
        finally:
            session.close()
    
    def get_session_sync(self) -> Session:
        """Obtient une session synchrone (à fermer manuellement)"""
        if not self.SessionLocal:
            raise RuntimeError("Base de données non initialisée")
        return self.SessionLocal()
    
    def health_check(self) -> dict:
        """Vérifie l'état de la base de données"""
        try:
            with self.engine.connect() as conn:
                start_time = time.time()
                conn.execute(text("SELECT 1"))
                response_time = (time.time() - start_time) * 1000
                
                # Statistiques du pool
                pool = self.engine.pool
                pool_stats = {
                    'size': pool.size(),
                    'checked_in': pool.checkedin(),
                    'checked_out': pool.checkedout(),
                    'overflow': pool.overflow(),
                    'invalid': pool.invalid()
                }
                
                return {
                    'status': 'healthy',
                    'response_time_ms': round(response_time, 2),
                    'pool_stats': pool_stats,
                    'database': self.db_name,
                    'host': self.db_host
                }
        except Exception as e:
            return {
                'status': 'unhealthy',
                'error': str(e),
                'database': self.db_name,
                'host': self.db_host
            }
    
    def close(self):
        """Ferme les connexions à la base de données"""
        if self.engine:
            self.engine.dispose()
            logger.info("🔒 Connexions base de données fermées")

# Instance globale
db_config = DatabaseConfig()

def init_database():
    """Initialise la base de données"""
    return db_config.initialize()

def get_db_session():
    """Obtient une session de base de données"""
    return db_config.get_session()

def get_db_session_sync():
    """Obtient une session synchrone"""
    return db_config.get_session_sync()

def close_database():
    """Ferme la base de données"""
    db_config.close()

def database_health():
    """Vérifie l'état de la base de données"""
    return db_config.health_check()
