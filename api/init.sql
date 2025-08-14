-- EBIOS RM Database Initialization Script
-- This script creates the necessary tables for the EBIOS Risk Management application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'analyst',
    organization VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Missions table
CREATE TABLE IF NOT EXISTS missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    organization VARCHAR(255),
    scope TEXT,
    objectives TEXT[],
    status VARCHAR(50) DEFAULT 'draft',
    progress INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10,2),
    priority VARCHAR(20) DEFAULT 'medium'
);

-- Workshops table
CREATE TABLE IF NOT EXISTS workshops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    workshop_number INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'not_started',
    data JSONB,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(mission_id, workshop_number)
);

-- Assets table (for Workshop 1)
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    description TEXT,
    criticality VARCHAR(20),
    owner VARCHAR(255),
    location VARCHAR(255),
    dependencies TEXT[],
    security_measures TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stakeholders table (for Workshop 1)
CREATE TABLE IF NOT EXISTS stakeholders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    category VARCHAR(100),
    influence_level VARCHAR(20),
    dependency_level VARCHAR(20),
    contact_info JSONB,
    objectives TEXT[],
    constraints TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Feared events table (for Workshop 2)
CREATE TABLE IF NOT EXISTS feared_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    impact_level VARCHAR(20),
    likelihood VARCHAR(20),
    risk_level VARCHAR(20),
    affected_assets UUID[] DEFAULT '{}',
    consequences TEXT[],
    existing_measures TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Strategic scenarios table (for Workshop 3)
CREATE TABLE IF NOT EXISTS strategic_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    threat_source VARCHAR(255),
    motivation TEXT,
    resources VARCHAR(255),
    pertinence INTEGER,
    feared_events UUID[] DEFAULT '{}',
    attack_paths JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Operational scenarios table (for Workshop 4)
CREATE TABLE IF NOT EXISTS operational_scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    strategic_scenario_id UUID REFERENCES strategic_scenarios(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    attack_vector VARCHAR(255),
    vulnerability VARCHAR(255),
    likelihood INTEGER,
    impact INTEGER,
    risk_level INTEGER,
    attack_steps JSONB,
    security_measures JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Risk treatment table (for Workshop 5)
CREATE TABLE IF NOT EXISTS risk_treatments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    operational_scenario_id UUID REFERENCES operational_scenarios(id),
    treatment_type VARCHAR(50), -- accept, mitigate, transfer, avoid
    description TEXT,
    security_measures JSONB,
    cost_estimate DECIMAL(10,2),
    implementation_timeline VARCHAR(255),
    responsible_party VARCHAR(255),
    effectiveness_rating INTEGER,
    residual_risk_level INTEGER,
    status VARCHAR(50) DEFAULT 'planned',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    format VARCHAR(20) DEFAULT 'pdf',
    status VARCHAR(50) DEFAULT 'generating',
    file_path VARCHAR(500),
    file_size BIGINT,
    download_count INTEGER DEFAULT 0,
    generated_by UUID REFERENCES users(id),
    options JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System metrics table
CREATE TABLE IF NOT EXISTS system_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type VARCHAR(100) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    value DECIMAL(15,6),
    unit VARCHAR(20),
    tags JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_missions_created_by ON missions(created_by);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);
CREATE INDEX IF NOT EXISTS idx_workshops_mission_id ON workshops(mission_id);
CREATE INDEX IF NOT EXISTS idx_assets_mission_id ON assets(mission_id);
CREATE INDEX IF NOT EXISTS idx_stakeholders_mission_id ON stakeholders(mission_id);
CREATE INDEX IF NOT EXISTS idx_feared_events_mission_id ON feared_events(mission_id);
CREATE INDEX IF NOT EXISTS idx_strategic_scenarios_mission_id ON strategic_scenarios(mission_id);
CREATE INDEX IF NOT EXISTS idx_operational_scenarios_mission_id ON operational_scenarios(mission_id);
CREATE INDEX IF NOT EXISTS idx_risk_treatments_mission_id ON risk_treatments(mission_id);
CREATE INDEX IF NOT EXISTS idx_reports_mission_id ON reports(mission_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_system_metrics_type_name ON system_metrics(metric_type, metric_name);
CREATE INDEX IF NOT EXISTS idx_system_metrics_recorded_at ON system_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workshops_updated_at BEFORE UPDATE ON workshops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stakeholders_updated_at BEFORE UPDATE ON stakeholders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feared_events_updated_at BEFORE UPDATE ON feared_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_strategic_scenarios_updated_at BEFORE UPDATE ON strategic_scenarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_operational_scenarios_updated_at BEFORE UPDATE ON operational_scenarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_risk_treatments_updated_at BEFORE UPDATE ON risk_treatments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, role, organization) 
VALUES (
    'admin@ebios.fr', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
    'Admin', 
    'User', 
    'admin', 
    'EBIOS RM'
) ON CONFLICT (email) DO NOTHING;

-- === TABLES POUR LE SERVICE PYTHON AI ===

-- Sessions utilisateur pour le contexte AI
CREATE TABLE IF NOT EXISTS ai_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
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
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agent_type VARCHAR(100) NOT NULL, -- workshop1, workshop2, etc.
    memory_type VARCHAR(50) NOT NULL, -- context, suggestion, analysis
    content JSONB NOT NULL,
    relevance_score DECIMAL(3,2) DEFAULT 0.5,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Suggestions AI contextuelles
CREATE TABLE IF NOT EXISTS ai_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    suggestion_type VARCHAR(100) NOT NULL, -- asset, threat, measure, etc.
    content TEXT NOT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 0.5,
    context_data JSONB DEFAULT '{}',
    is_applied BOOLEAN DEFAULT false,
    applied_at TIMESTAMP WITH TIME ZONE,
    feedback_rating INTEGER, -- 1-5 rating from user
    feedback_comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Analyses sémantiques
CREATE TABLE IF NOT EXISTS semantic_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    content_type VARCHAR(100) NOT NULL, -- document, text, asset_description
    content_hash VARCHAR(64) NOT NULL, -- SHA256 du contenu analysé
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
    query_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA256 de la requête
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
    metric_type VARCHAR(100) NOT NULL, -- response_time, accuracy, usage
    service_name VARCHAR(100) NOT NULL, -- workshop1_ai, semantic_analyzer, etc.
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
CREATE TRIGGER update_ai_sessions_updated_at BEFORE UPDATE ON ai_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_memory_updated_at BEFORE UPDATE ON agent_memory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_suggestions_updated_at BEFORE UPDATE ON ai_suggestions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample mission
INSERT INTO missions (name, description, organization, scope, objectives, status, progress, created_by)
VALUES (
    'Mission de test EBIOS RM',
    'Mission de démonstration pour tester l\'application EBIOS RM',
    'Organisation Test',
    'Système d\'information critique',
    ARRAY['Identifier les risques', 'Évaluer les menaces', 'Proposer des mesures'],
    'in_progress',
    25,
    (SELECT id FROM users WHERE email = 'admin@ebios.fr')
) ON CONFLICT DO NOTHING;

COMMIT;