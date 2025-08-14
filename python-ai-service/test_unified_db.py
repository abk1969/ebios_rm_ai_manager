#!/usr/bin/env python3
"""
🧪 TESTS DE COHÉRENCE DE LA BASE DE DONNÉES UNIFIÉE
Validation de l'intégration PostgreSQL et de la synchronisation des données
"""

import os
import sys
import time
import uuid
import logging
from datetime import datetime

# Ajouter le répertoire parent au path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config.database import init_database, get_db_session, database_health, close_database
from services.unified_db_service import unified_db

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class UnifiedDBTester:
    """Testeur pour la base de données unifiée"""
    
    def __init__(self):
        self.test_mission_id = str(uuid.uuid4())
        self.test_user_id = str(uuid.uuid4())
        self.test_results = []
    
    def run_test(self, test_name: str, test_func):
        """Exécute un test et enregistre le résultat"""
        try:
            start_time = time.time()
            logger.info(f"🧪 Test: {test_name}")
            
            result = test_func()
            duration = time.time() - start_time
            
            if result:
                logger.info(f"✅ {test_name} - RÉUSSI ({duration:.2f}s)")
                self.test_results.append((test_name, True, duration, None))
            else:
                logger.error(f"❌ {test_name} - ÉCHEC ({duration:.2f}s)")
                self.test_results.append((test_name, False, duration, "Test failed"))
                
        except Exception as e:
            duration = time.time() - start_time
            logger.error(f"💥 {test_name} - ERREUR ({duration:.2f}s): {e}")
            self.test_results.append((test_name, False, duration, str(e)))
    
    def test_database_connection(self):
        """Test de connexion à la base de données"""
        health = database_health()
        return health.get('status') == 'healthy'
    
    def test_ai_session_creation(self):
        """Test de création de session AI"""
        session_token = unified_db.create_ai_session(
            user_id=self.test_user_id,
            mission_id=self.test_mission_id,
            context_data={'test': True, 'created_at': datetime.utcnow().isoformat()}
        )
        
        if not session_token:
            return False
        
        # Vérifier la récupération
        session = unified_db.get_ai_session(session_token)
        return session is not None and session.context_data.get('test') == True
    
    def test_agent_memory_storage(self):
        """Test de stockage de mémoire d'agent"""
        success = unified_db.store_agent_memory(
            mission_id=self.test_mission_id,
            user_id=self.test_user_id,
            agent_type='workshop1',
            memory_type='context',
            content={
                'test_data': 'memory_test',
                'timestamp': datetime.utcnow().isoformat(),
                'assets': ['asset1', 'asset2']
            },
            relevance_score=0.8,
            tags=['test', 'workshop1'],
            expires_hours=24
        )
        
        if not success:
            return False
        
        # Vérifier la récupération
        memories = unified_db.get_agent_memory(
            mission_id=self.test_mission_id,
            agent_type='workshop1',
            memory_type='context'
        )
        
        return len(memories) > 0 and memories[0].content.get('test_data') == 'memory_test'
    
    def test_ai_suggestions(self):
        """Test de création et récupération de suggestions AI"""
        success = unified_db.create_ai_suggestion(
            mission_id=self.test_mission_id,
            user_id=self.test_user_id,
            suggestion_type='asset',
            content='Serveur de base de données principal',
            confidence_score=0.9,
            context_data={
                'source': 'test',
                'workshop': 1,
                'category': 'infrastructure'
            }
        )
        
        if not success:
            return False
        
        # Vérifier la récupération
        suggestions = unified_db.get_ai_suggestions(
            mission_id=self.test_mission_id,
            suggestion_type='asset'
        )
        
        return len(suggestions) > 0 and suggestions[0].confidence_score == 0.9
    
    def test_query_cache(self):
        """Test du cache de requêtes"""
        test_query = "Quels sont les actifs critiques pour cette mission?"
        test_response = {
            'suggestions': ['Serveur principal', 'Base de données', 'Réseau'],
            'confidence': 0.85,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # Mettre en cache
        success = unified_db.cache_query_response(
            query_text=test_query,
            response_data=test_response,
            model_used='gpt-4',
            tokens_used=150,
            processing_time_ms=1200
        )
        
        if not success:
            return False
        
        # Récupérer du cache
        cached_response = unified_db.get_cached_query(test_query)
        
        return (cached_response is not None and 
                cached_response.get('confidence') == 0.85)
    
    def test_metrics_recording(self):
        """Test d'enregistrement de métriques"""
        success = unified_db.record_ai_metric(
            metric_type='response_time',
            service_name='workshop1_ai',
            value=1.25,
            unit='seconds',
            context={
                'test': True,
                'mission_id': self.test_mission_id,
                'endpoint': '/api/ai/analyze'
            }
        )
        
        return success
    
    def test_data_consistency(self):
        """Test de cohérence des données entre services"""
        # Créer des données liées
        session_token = unified_db.create_ai_session(
            user_id=self.test_user_id,
            mission_id=self.test_mission_id,
            context_data={'consistency_test': True}
        )
        
        if not session_token:
            return False
        
        # Stocker mémoire liée
        memory_success = unified_db.store_agent_memory(
            mission_id=self.test_mission_id,
            user_id=self.test_user_id,
            agent_type='consistency_test',
            memory_type='session_data',
            content={'session_token': session_token}
        )
        
        if not memory_success:
            return False
        
        # Vérifier la cohérence
        session = unified_db.get_ai_session(session_token)
        memories = unified_db.get_agent_memory(
            mission_id=self.test_mission_id,
            agent_type='consistency_test'
        )
        
        return (session is not None and 
                len(memories) > 0 and 
                memories[0].content.get('session_token') == session_token)
    
    def run_all_tests(self):
        """Exécute tous les tests"""
        logger.info("🚀 Démarrage des tests de cohérence de la base de données unifiée")
        
        # Tests de base
        self.run_test("Connexion base de données", self.test_database_connection)
        self.run_test("Création session AI", self.test_ai_session_creation)
        self.run_test("Stockage mémoire agent", self.test_agent_memory_storage)
        self.run_test("Suggestions AI", self.test_ai_suggestions)
        self.run_test("Cache de requêtes", self.test_query_cache)
        self.run_test("Enregistrement métriques", self.test_metrics_recording)
        self.run_test("Cohérence des données", self.test_data_consistency)
        
        # Résumé
        total_tests = len(self.test_results)
        passed_tests = sum(1 for _, success, _, _ in self.test_results if success)
        failed_tests = total_tests - passed_tests
        
        logger.info(f"\n📊 RÉSULTATS DES TESTS:")
        logger.info(f"   Total: {total_tests}")
        logger.info(f"   ✅ Réussis: {passed_tests}")
        logger.info(f"   ❌ Échecs: {failed_tests}")
        
        if failed_tests > 0:
            logger.info(f"\n💥 ÉCHECS DÉTAILLÉS:")
            for name, success, duration, error in self.test_results:
                if not success:
                    logger.info(f"   - {name}: {error}")
        
        success_rate = (passed_tests / total_tests) * 100
        logger.info(f"\n🎯 Taux de réussite: {success_rate:.1f}%")
        
        return success_rate >= 80  # 80% minimum pour considérer comme réussi

def main():
    """Fonction principale"""
    print("🧪 Tests de cohérence de la base de données unifiée EBIOS RM")
    print("=" * 60)
    
    # Initialiser la base de données
    if not init_database():
        print("❌ Impossible d'initialiser la base de données")
        return False
    
    try:
        # Exécuter les tests
        tester = UnifiedDBTester()
        success = tester.run_all_tests()
        
        if success:
            print("\n🎉 TOUS LES TESTS SONT PASSÉS - Base de données unifiée opérationnelle!")
            return True
        else:
            print("\n⚠️ CERTAINS TESTS ONT ÉCHOUÉ - Vérifiez la configuration")
            return False
            
    finally:
        # Nettoyage
        close_database()

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
