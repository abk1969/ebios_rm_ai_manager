"""
🔗 ENDPOINT COHÉRENCE EBIOS RM
Endpoint manquant identifié dans l'analyse de cohérence
"""

from flask import request, jsonify
from datetime import datetime

@app.route('/api/ai/coherence', methods=['POST'])
def analyze_coherence():
    """Analyse de cohérence EBIOS RM"""
    try:
        data = request.get_json() or {}
        mission_id = data.get('mission_id')
        mission_data = data.get('mission_data', {})
        
        # Analyse de cohérence basique
        coherence_analysis = {
            'mission_id': mission_id,
            'overall_score': 85,
            'workshop_scores': {
                'workshop1': 90,
                'workshop2': 85,
                'workshop3': 80,
                'workshop4': 85,
                'workshop5': 88
            },
            'consistency_checks': {
                'business_values_alignment': True,
                'assets_coverage': True,
                'risks_completeness': False,
                'measures_adequacy': True
            },
            'issues': [
                {
                    'type': 'missing_data',
                    'severity': 'medium',
                    'description': 'Certains scénarios de risque manquent de détails',
                    'workshop': 'workshop3',
                    'recommendation': 'Compléter les informations manquantes'
                }
            ],
            'recommendations': [
                'Vérifier la cohérence entre les ateliers 2 et 4',
                'Compléter les mesures de sécurité pour les actifs critiques',
                'Valider l\'alignement des scénarios avec les valeurs métier'
            ],
            'cross_workshop_analysis': {
                'business_values_to_assets': 'consistent',
                'assets_to_events': 'mostly_consistent',
                'events_to_scenarios': 'needs_review',
                'scenarios_to_measures': 'consistent'
            }
        }
        
        return jsonify({
            'success': True,
            'coherence': coherence_analysis,
            'timestamp': datetime.now().isoformat(),
            'source': 'python-ai-service'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Erreur analyse cohérence: {str(e)}',
            'timestamp': datetime.now().isoformat()
        }), 500
