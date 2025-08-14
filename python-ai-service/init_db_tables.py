#!/usr/bin/env python3
"""
🗄️ INITIALISATION DES TABLES AI DANS POSTGRESQL
Script pour créer les tables AI dans la base de données existante
"""

import os
import sys
import logging
from sqlalchemy import text

# Ajouter le répertoire parent au path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config.database import init_database, get_db_session, close_database

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_ai_tables():
    """Crée les tables AI dans PostgreSQL"""
    
    # SQL pour créer les tables AI
    ai_tables_sql = """
    -- === TABLES POUR LE SERVICE PYTHON AI ===

    -- Sessions utilisateur pour le contexte AI
    CREATE TABLE IF NOT EXISTS ai_sessions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID,
        mission_id UUID,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        context_data JSONB DEFAULT '{}',
        last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Mémoire des agents AI
    CREATE TABLE IF NOT EXISTS agent_memory (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        mission_id UUID,
        user_id UUID,
        agent_type VARCHAR(100) NOT NULL,
        memory_type VARCHAR(50) NOT NULL,
        content JSONB NOT NULL,
        relevance_score DECIMAL(3,2) DEFAULT 0.5,
        tags TEXT[] DEFAULT '{}',
        meta_data JSONB DEFAULT '{}',
        expires_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Suggestions AI contextuelles
    CREATE TABLE IF NOT EXISTS ai_suggestions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        mission_id UUID,
        workshop_id UUID,
        user_id UUID,
        suggestion_type VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        confidence_score DECIMAL(3,2) DEFAULT 0.5,
        context_data JSONB DEFAULT '{}',
        is_applied BOOLEAN DEFAULT false,
        applied_at TIMESTAMP WITH TIME ZONE,
        feedback_rating INTEGER,
        feedback_comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Analyses sémantiques
    CREATE TABLE IF NOT EXISTS semantic_analyses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        mission_id UUID,
        content_type VARCHAR(100) NOT NULL,
        content_hash VARCHAR(64) NOT NULL,
        original_content TEXT NOT NULL,
        analysis_results JSONB NOT NULL,
        keywords TEXT[] DEFAULT '{}',
        entities JSONB DEFAULT '{}',
        sentiment_score DECIMAL(3,2),
        language VARCHAR(10) DEFAULT 'fr',
        processing_time_ms INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Cache des requêtes AI
    CREATE TABLE IF NOT EXISTS ai_query_cache (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        query_hash VARCHAR(64) UNIQUE NOT NULL,
        query_text TEXT NOT NULL,
        response_data JSONB NOT NULL,
        model_used VARCHAR(100),
        tokens_used INTEGER,
        processing_time_ms INTEGER,
        hit_count INTEGER DEFAULT 1,
        expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '1 hour'),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Métriques de performance AI
    CREATE TABLE IF NOT EXISTS ai_metrics (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        metric_type VARCHAR(100) NOT NULL,
        service_name VARCHAR(100) NOT NULL,
        value DECIMAL(15,6) NOT NULL,
        unit VARCHAR(20),
        context JSONB DEFAULT '{}',
        recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- === INDEXES POUR LES TABLES AI ===
    CREATE INDEX IF NOT EXISTS idx_ai_sessions_user_id ON ai_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_ai_sessions_mission_id ON ai_sessions(mission_id);
    CREATE INDEX IF NOT EXISTS idx_ai_sessions_token ON ai_sessions(session_token);
    CREATE INDEX IF NOT EXISTS idx_ai_sessions_expires_at ON ai_sessions(expires_at);

    CREATE INDEX IF NOT EXISTS idx_agent_memory_mission_id ON agent_memory(mission_id);
    CREATE INDEX IF NOT EXISTS idx_agent_memory_user_id ON agent_memory(user_id);
    CREATE INDEX IF NOT EXISTS idx_agent_memory_agent_type ON agent_memory(agent_type);
    CREATE INDEX IF NOT EXISTS idx_agent_memory_memory_type ON agent_memory(memory_type);
    CREATE INDEX IF NOT EXISTS idx_agent_memory_relevance ON agent_memory(relevance_score);

    CREATE INDEX IF NOT EXISTS idx_ai_suggestions_mission_id ON ai_suggestions(mission_id);
    CREATE INDEX IF NOT EXISTS idx_ai_suggestions_workshop_id ON ai_suggestions(workshop_id);
    CREATE INDEX IF NOT EXISTS idx_ai_suggestions_user_id ON ai_suggestions(user_id);
    CREATE INDEX IF NOT EXISTS idx_ai_suggestions_type ON ai_suggestions(suggestion_type);
    CREATE INDEX IF NOT EXISTS idx_ai_suggestions_confidence ON ai_suggestions(confidence_score);

    CREATE INDEX IF NOT EXISTS idx_semantic_analyses_mission_id ON semantic_analyses(mission_id);
    CREATE INDEX IF NOT EXISTS idx_semantic_analyses_content_hash ON semantic_analyses(content_hash);
    CREATE INDEX IF NOT EXISTS idx_semantic_analyses_content_type ON semantic_analyses(content_type);

    CREATE INDEX IF NOT EXISTS idx_ai_query_cache_hash ON ai_query_cache(query_hash);
    CREATE INDEX IF NOT EXISTS idx_ai_query_cache_expires_at ON ai_query_cache(expires_at);

    CREATE INDEX IF NOT EXISTS idx_ai_metrics_type_service ON ai_metrics(metric_type, service_name);
    CREATE INDEX IF NOT EXISTS idx_ai_metrics_recorded_at ON ai_metrics(recorded_at);

    -- === TRIGGERS POUR LES TABLES AI ===
    -- Note: Les triggers seront créés séparément si la fonction update_updated_at_column existe
    """
    
    try:
        with get_db_session() as session:
            logger.info("🔨 Création des tables AI...")
            
            # Exécuter le SQL
            session.execute(text(ai_tables_sql))
            session.commit()
            
            logger.info("✅ Tables AI créées avec succès")
            return True
            
    except Exception as e:
        logger.error(f"❌ Erreur création tables AI: {e}")
        return False

def verify_tables():
    """Vérifie que les tables AI ont été créées"""
    tables_to_check = [
        'ai_sessions',
        'agent_memory', 
        'ai_suggestions',
        'semantic_analyses',
        'ai_query_cache',
        'ai_metrics'
    ]
    
    try:
        with get_db_session() as session:
            for table in tables_to_check:
                result = session.execute(text(f"""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_name = '{table}'
                    );
                """))
                
                exists = result.fetchone()[0]
                if exists:
                    logger.info(f"✅ Table {table} : OK")
                else:
                    logger.error(f"❌ Table {table} : MANQUANTE")
                    return False
            
            logger.info("🎉 Toutes les tables AI sont présentes")
            return True
            
    except Exception as e:
        logger.error(f"❌ Erreur vérification tables: {e}")
        return False

def main():
    """Fonction principale"""
    print("🗄️ Initialisation des tables AI pour EBIOS RM")
    print("=" * 50)
    
    # Initialiser la base de données
    if not init_database():
        print("❌ Impossible d'initialiser la base de données")
        return False
    
    try:
        # Créer les tables
        if not create_ai_tables():
            print("❌ Échec de la création des tables AI")
            return False
        
        # Vérifier les tables
        if not verify_tables():
            print("❌ Échec de la vérification des tables AI")
            return False
        
        print("\n🎉 INITIALISATION RÉUSSIE - Tables AI prêtes!")
        return True
        
    finally:
        # Nettoyage
        close_database()

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
