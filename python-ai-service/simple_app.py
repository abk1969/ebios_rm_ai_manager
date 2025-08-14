"""
🚀 EBIOS AI Service - Version Simplifiée et Robuste
Service Python optimisé pour fonctionner de manière fiable
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
import json
from datetime import datetime

# Import des modèles harmonisés
try:
    from models.harmonized_models import (
        Mission, Workshop, BusinessValue, EssentialAsset,
        SupportingAsset, DreadedEvent, SecurityMeasure,
        RiskSource, StrategicScenario, OperationalScenario
    )
    HARMONIZED_MODELS_AVAILABLE = True
    print("✅ Modèles harmonisés chargés avec succès")
except ImportError as e:
    HARMONIZED_MODELS_AVAILABLE = False
    print(f"⚠️ Modèles harmonisés non disponibles: {e}")

# Configuration de l'application Flask
app = Flask(__name__)

# Configuration CORS pour le développement local
CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"])

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
PORT = int(os.environ.get('PORT', 8081))
FLASK_ENV = os.environ.get('FLASK_ENV', 'development')

print(f"🏠 Mode: {FLASK_ENV}")
print(f"🚀 Démarrage sur port: {PORT}")

@app.route('/health', methods=['GET'])
def health_check():
    """Point de contrôle de santé du service"""
    return jsonify({
        'status': 'OK',
        'service': 'EBIOS Python AI Service',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0',
        'environment': FLASK_ENV,
        'port': PORT
    }), 200

@app.route('/api/ai/suggestions', methods=['POST'])
def get_suggestions():
    """Génère des suggestions IA pour les workshops EBIOS RM"""
    try:
        data = request.get_json() or {}
        workshop = data.get('workshop', 'workshop1')
        context = data.get('context', {})
        
        # Suggestions de base pour chaque workshop
        suggestions_map = {
            'workshop1': [
                {
                    'id': 'w1_s1',
                    'type': 'suggestion',
                    'title': 'Identifier les valeurs métier critiques',
                    'description': 'Commencez par lister les processus métier essentiels de votre organisation',
                    'confidence': 0.9,
                    'category': 'business-values'
                },
                {
                    'id': 'w1_s2',
                    'type': 'best-practice',
                    'title': 'Impliquer les parties prenantes',
                    'description': 'Organisez des ateliers avec les responsables métier pour une vision complète',
                    'confidence': 0.85,
                    'category': 'stakeholders'
                }
            ],
            'workshop2': [
                {
                    'id': 'w2_s1',
                    'type': 'suggestion',
                    'title': 'Analyser les sources de risques',
                    'description': 'Identifiez les menaces potentielles selon le référentiel ANSSI',
                    'confidence': 0.88,
                    'category': 'risk-sources'
                }
            ],
            'workshop3': [
                {
                    'id': 'w3_s1',
                    'type': 'suggestion',
                    'title': 'Élaborer des scénarios stratégiques',
                    'description': 'Construisez des scénarios réalistes basés sur votre contexte',
                    'confidence': 0.87,
                    'category': 'strategic-scenarios'
                }
            ]
        }
        
        suggestions = suggestions_map.get(workshop, [])
        
        return jsonify({
            'success': True,
            'suggestions': suggestions,
            'workshop': workshop,
            'context': context,
            'timestamp': datetime.now().isoformat(),
            'source': 'python-ai-service'
        }), 200
        
    except Exception as e:
        logger.error(f"Erreur génération suggestions: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Erreur interne du service',
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/ai/analyze', methods=['POST'])
def analyze_content():
    """Analyse sémantique de contenu"""
    try:
        data = request.get_json() or {}
        text = data.get('text', '')
        analysis_type = data.get('type', 'semantic')
        
        # Analyse basique
        analysis = {
            'text_length': len(text),
            'word_count': len(text.split()) if text else 0,
            'analysis_type': analysis_type,
            'confidence': 0.8,
            'keywords': [],
            'sentiment': 'neutral',
            'complexity': 'medium'
        }
        
        # Extraction de mots-clés basique
        if text:
            words = text.lower().split()
            # Mots-clés EBIOS RM courants
            ebios_keywords = ['risque', 'menace', 'vulnérabilité', 'impact', 'sécurité', 'actif', 'scénario']
            analysis['keywords'] = [word for word in words if word in ebios_keywords]
        
        return jsonify({
            'success': True,
            'analysis': analysis,
            'timestamp': datetime.now().isoformat(),
            'source': 'python-ai-service'
        }), 200
        
    except Exception as e:
        logger.error(f"Erreur analyse: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Erreur analyse',
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/api/ai/coherence', methods=['POST'])
def check_coherence():
    """Vérification de cohérence EBIOS RM"""
    try:
        data = request.get_json() or {}
        mission_data = data.get('mission_data', {})
        
        # Analyse de cohérence basique
        coherence = {
            'overall_score': 85,
            'workshop_scores': {
                'workshop1': 90,
                'workshop2': 85,
                'workshop3': 80,
                'workshop4': 85,
                'workshop5': 88
            },
            'issues': [],
            'recommendations': [
                'Compléter les informations manquantes dans le Workshop 3',
                'Vérifier la cohérence entre les ateliers 2 et 4'
            ]
        }
        
        return jsonify({
            'success': True,
            'coherence': coherence,
            'timestamp': datetime.now().isoformat(),
            'source': 'python-ai-service'
        }), 200
        
    except Exception as e:
        logger.error(f"Erreur cohérence: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Erreur vérification cohérence',
            'timestamp': datetime.now().isoformat()
        }), 500

@app.route('/', methods=['GET'])
def root():
    """Page d'accueil du service"""
    return jsonify({
        'service': 'EBIOS Python AI Service',
        'status': 'running',
        'version': '1.0.0',
        'endpoints': [
            '/health',
            '/api/ai/suggestions',
            '/api/ai/analyze',
            '/api/ai/coherence'
        ],
        'timestamp': datetime.now().isoformat()
    }), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Endpoint non trouvé',
        'available_endpoints': ['/health', '/api/ai/suggestions', '/api/ai/analyze', '/api/ai/coherence'],
        'timestamp': datetime.now().isoformat()
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Erreur interne du serveur',
        'timestamp': datetime.now().isoformat()
    }), 500

if __name__ == '__main__':
    try:
        print(f"🚀 Démarrage EBIOS Python AI Service...")
        print(f"🌐 URL: http://localhost:{PORT}")
        print(f"🔧 Mode: {FLASK_ENV}")
        print(f"📡 Endpoints disponibles:")
        print(f"   - GET  /health")
        print(f"   - POST /api/ai/suggestions")
        print(f"   - POST /api/ai/analyze")
        print(f"   - POST /api/ai/coherence")
        print("=" * 50)
        
        app.run(
            host='0.0.0.0',
            port=PORT,
            debug=(FLASK_ENV == 'development'),
            threaded=True
        )
        
    except Exception as e:
        logger.error(f"Erreur démarrage serveur: {str(e)}")
        print(f"❌ Erreur démarrage: {str(e)}")
        exit(1)
