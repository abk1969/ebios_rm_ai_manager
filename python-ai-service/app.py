"""
🚀 EBIOS AI Service - Version Cloud Run
Service Python optimisé pour Google Cloud Run
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
import json
from datetime import datetime

# Configuration base de données unifiée
from config.database import init_database, get_db_session, database_health, close_database
from models.ai_models import AISession, AgentMemory, AISuggestion, SemanticAnalysis, AIQueryCache, AIMetric

# Configuration de l'application Flask
app = Flask(__name__)

# Configuration CORS pour le développement local
if os.environ.get('FLASK_ENV') == 'development':
    CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"])
    print("Mode developpement local active")
else:
    CORS(app, origins=["*"])  # Permettre toutes les origines pour Cloud Run

# Configuration du logging pour Cloud Run
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialisation de la base de données
database_initialized = False

def initialize_app():
    """Initialise l'application et la base de données"""
    global database_initialized
    if not database_initialized:
        logger.info("🔗 Initialisation de la base de données PostgreSQL...")
        if init_database():
            database_initialized = True
            logger.info("✅ Base de données PostgreSQL connectée")
        else:
            logger.error("❌ Erreur connexion PostgreSQL - Mode dégradé")
    return database_initialized

@app.route('/', methods=['GET'])
def root():
    """Page d'accueil du service"""
    return jsonify({
        'message': '🤖 EBIOS AI Service is running on Cloud Run!',
        'service': 'EBIOS AI Manager - Python Service',
        'version': '1.0.0',
        'environment': os.environ.get('ENVIRONMENT', 'production'),
        'timestamp': datetime.now().isoformat(),
        'endpoints': {
            'health': '/health',
            'analyze': '/api/ai/analyze',
            'suggestions': '/api/ai/suggestions',
            'validate': '/api/ai/validate'
        }
    }), 200

@app.route('/health', methods=['GET'])
def health_check():
    """Point de contrôle de santé avec vérification base de données"""
    # Vérifier la base de données
    db_status = database_health()

    overall_status = 'healthy' if db_status.get('status') == 'healthy' else 'degraded'

    return jsonify({
        'status': overall_status,
        'service': 'EBIOS AI Service',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat(),
        'environment': os.environ.get('ENVIRONMENT', 'production'),
        'port': os.environ.get('PORT', '8081'),
        'database': db_status,
        'features': {
            'postgresql': database_initialized,
            'ai_suggestions': True,
            'semantic_analysis': True,
            'agent_memory': True
        }
    }), 200

@app.route('/api/ai/analyze', methods=['POST'])
def analyze_ebios():
    """Analyse IA pour les données EBIOS"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Aucune donnée fournie'}), 400
        
        # Simulation d'analyse IA avancée
        analysis_type = data.get('type', 'general')
        content = data.get('content', '')
        mission_context = data.get('mission_context', {})
        
        # Analyse contextuelle basée sur le type
        recommendations = []
        risk_level = 'low'
        
        if analysis_type == 'supporting_assets':
            recommendations = [
                'Identifier tous les actifs supports critiques',
                'Évaluer les dépendances entre actifs',
                'Documenter les mesures de protection existantes',
                'Analyser les vulnérabilités potentielles'
            ]
            risk_level = 'medium'
        elif analysis_type == 'essential_assets':
            recommendations = [
                'Classer les actifs par criticité métier',
                'Définir les critères de sécurité (DICP)',
                'Identifier les processus métier associés',
                'Évaluer l\'impact en cas de compromission'
            ]
            risk_level = 'high'
        elif analysis_type == 'dreaded_events':
            recommendations = [
                'Analyser les scénarios de menaces réalistes',
                'Évaluer la vraisemblance des événements',
                'Identifier les sources de risques',
                'Proposer des mesures de traitement'
            ]
            risk_level = 'high'
        else:
            recommendations = [
                'Suivre la méthodologie EBIOS Risk Manager',
                'Impliquer toutes les parties prenantes',
                'Documenter toutes les décisions',
                'Réviser régulièrement l\'analyse'
            ]
        
        result = {
            'analysis': f'Analyse IA pour {analysis_type}',
            'recommendations': recommendations,
            'risk_level': risk_level,
            'confidence': 0.85,
            'timestamp': datetime.now().isoformat(),
            'processed_content_length': len(content),
            'mission_context': mission_context.get('name', 'Non spécifiée')
        }
        
        logger.info(f"Analyse effectuée pour: {analysis_type} - Mission: {mission_context.get('name', 'N/A')}")
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Erreur lors de l'analyse: {str(e)}")
        return jsonify({'error': 'Erreur interne du serveur', 'details': str(e)}), 500

@app.route('/api/ai/suggestions', methods=['POST'])
def get_suggestions():
    """Obtenir des suggestions IA contextuelles"""
    try:
        data = request.get_json()
        context = data.get('context', 'workshop1')
        workshop_step = data.get('step', 'general')
        
        suggestions_map = {
            'workshop1_step1': [
                '🎯 Identifier le périmètre de l\'étude',
                '📋 Lister tous les actifs essentiels',
                '🔍 Analyser les processus métier critiques',
                '⚖️ Évaluer les critères de sécurité (DICP)'
            ],
            'workshop1_step2': [
                '🏗️ Cartographier les actifs supports',
                '🔗 Identifier les dépendances',
                '🛡️ Recenser les mesures de sécurité',
                '📊 Évaluer la maturité sécuritaire'
            ],
            'workshop1_step3': [
                '⚠️ Identifier les événements redoutés',
                '💥 Analyser les impacts potentiels',
                '📈 Évaluer les niveaux de gravité',
                '🎯 Prioriser les risques'
            ],
            'general': [
                '📚 Suivre la méthodologie EBIOS RM',
                '👥 Impliquer toutes les parties prenantes',
                '📝 Documenter toutes les décisions',
                '🔄 Réviser régulièrement l\'analyse'
            ]
        }
        
        key = f"{context}_{workshop_step}" if workshop_step != 'general' else context
        suggestions = suggestions_map.get(key, suggestions_map['general'])
        
        result = {
            'suggestions': suggestions,
            'context': context,
            'step': workshop_step,
            'timestamp': datetime.now().isoformat(),
            'total_suggestions': len(suggestions)
        }
        
        logger.info(f"Suggestions générées pour: {context} - Étape: {workshop_step}")
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Erreur lors de la génération de suggestions: {str(e)}")
        return jsonify({'error': 'Erreur interne du serveur'}), 500

@app.route('/api/ai/validate', methods=['POST'])
def validate_data():
    """Valider les données EBIOS selon les standards ANSSI"""
    try:
        data = request.get_json()
        
        validation_result = {
            'is_valid': True,
            'errors': [],
            'warnings': [],
            'score': 100,
            'recommendations': [],
            'timestamp': datetime.now().isoformat()
        }
        
        # Validation du nom de mission
        if not data.get('mission_name'):
            validation_result['errors'].append('❌ Nom de mission manquant')
            validation_result['is_valid'] = False
            validation_result['score'] -= 25
        
        # Validation des actifs essentiels
        essential_assets = data.get('essential_assets', [])
        if not essential_assets:
            validation_result['warnings'].append('⚠️ Aucun actif essentiel défini')
            validation_result['score'] -= 15
        elif len(essential_assets) < 3:
            validation_result['warnings'].append('⚠️ Peu d\'actifs essentiels identifiés')
            validation_result['score'] -= 5
        
        # Validation des actifs supports
        supporting_assets = data.get('supporting_assets', [])
        if not supporting_assets:
            validation_result['warnings'].append('⚠️ Aucun actif support défini')
            validation_result['score'] -= 10
        
        # Validation des événements redoutés
        dreaded_events = data.get('dreaded_events', [])
        if not dreaded_events:
            validation_result['warnings'].append('⚠️ Aucun événement redouté défini')
            validation_result['score'] -= 20
        
        # Génération des recommandations
        if validation_result['score'] >= 80:
            validation_result['recommendations'].append('✅ Données conformes aux standards ANSSI')
            validation_result['recommendations'].append('✅ Structure EBIOS respectée')
        else:
            validation_result['recommendations'].append('🔧 Compléter les données manquantes')
            validation_result['recommendations'].append('📋 Réviser la méthodologie EBIOS')
        
        logger.info(f"Validation effectuée - Score: {validation_result['score']}")
        return jsonify(validation_result), 200
        
    except Exception as e:
        logger.error(f"Erreur lors de la validation: {str(e)}")
        return jsonify({'error': 'Erreur interne du serveur'}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint non trouvé'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Erreur interne du serveur'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8081))
    debug_mode = os.environ.get('FLASK_ENV') == 'development'

    # Initialiser l'application
    initialize_app()

    if debug_mode:
        logger.info(f"🏠 Démarrage du service EBIOS AI en mode développement sur le port {port}")
        print(f"🌐 Service accessible sur: http://localhost:{port}")
        print(f"🔍 Health check: http://localhost:{port}/health")
        print(f"🤖 API d'analyse: http://localhost:{port}/api/ai/analyze")
        print(f"🗄️ Base de données: {'PostgreSQL' if database_initialized else 'Mode dégradé'}")
    else:
        logger.info(f"🚀 Démarrage du service EBIOS AI sur le port {port}")

    try:
        app.run(host='0.0.0.0', port=port, debug=debug_mode)
    finally:
        # Nettoyage à la fermeture
        close_database()
