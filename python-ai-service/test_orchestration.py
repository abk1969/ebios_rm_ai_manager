#!/usr/bin/env python3
"""
🧪 TEST ORCHESTRATION AVANCÉE
Test de l'orchestrateur Workshop 1 avec mémoire persistante
"""

import asyncio
import json
import sys
from datetime import datetime

def test_orchestrator_import():
    """Test d'import de l'orchestrateur"""
    print("🧪 TEST IMPORT ORCHESTRATEUR")
    print("-" * 40)
    
    try:
        from services.workshop1_orchestrator import Workshop1OrchestratorFactory, WorkshopAnalysisResult
        print("✅ Import Workshop1OrchestratorFactory: OK")
        
        from services.agent_memory_service import AgentMemoryServiceFactory, AgentMemoryEntry
        print("✅ Import AgentMemoryServiceFactory: OK")
        
        return True
        
    except ImportError as e:
        print(f"❌ Erreur import: {e}")
        return False

def test_orchestrator_creation():
    """Test de création de l'orchestrateur"""
    print("\n🏗️ TEST CRÉATION ORCHESTRATEUR")
    print("-" * 40)
    
    try:
        from services.workshop1_orchestrator import Workshop1OrchestratorFactory
        
        orchestrator = Workshop1OrchestratorFactory.create()
        print("✅ Orchestrateur créé avec succès")
        
        # Test des capacités
        capabilities = orchestrator.get_capabilities()
        print(f"✅ Capacités disponibles: {capabilities}")
        
        # Test de l'état
        is_ready = orchestrator.is_ready()
        print(f"✅ État prêt: {is_ready}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur création: {e}")
        return False

def test_memory_service():
    """Test du service de mémoire"""
    print("\n🧠 TEST SERVICE MÉMOIRE")
    print("-" * 30)
    
    try:
        from services.agent_memory_service import AgentMemoryServiceFactory
        
        memory_service = AgentMemoryServiceFactory.create()
        print("✅ Service mémoire créé avec succès")
        
        # Test du statut
        status = memory_service.get_status()
        print(f"✅ Statut service: {status}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur service mémoire: {e}")
        return False

async def test_orchestration_workflow():
    """Test du workflow d'orchestration complet"""
    print("\n🎼 TEST WORKFLOW ORCHESTRATION")
    print("-" * 40)
    
    try:
        from services.workshop1_orchestrator import Workshop1OrchestratorFactory
        from services.agent_memory_service import AgentMemoryServiceFactory
        
        # Créer les services
        orchestrator = Workshop1OrchestratorFactory.create()
        memory_service = AgentMemoryServiceFactory.create()
        
        print("✅ Services créés")
        
        # Données de test
        mission_id = "test_mission_orchestration"
        workshop_data = {
            "business_values": [
                {
                    "id": "bv1",
                    "name": "Facturation clients",
                    "description": "Processus de facturation et encaissement"
                }
            ],
            "essential_assets": [
                {
                    "id": "ea1", 
                    "name": "Base données clients",
                    "description": "Système de gestion des données clients",
                    "businessValueId": "bv1"
                }
            ],
            "supporting_assets": [],
            "dreaded_events": [],
            "current_step": "essential-assets"
        }
        
        print("✅ Données de test préparées")
        
        # Test de stockage mémoire
        memory_id = await memory_service.store_memory(
            mission_id=mission_id,
            agent_id="workshop1_agent",
            session_id="test_session",
            memory_type="context",
            content={"test": "orchestration_workflow"},
            priority=2
        )
        
        print(f"✅ Mémoire stockée: {memory_id}")
        
        # Test d'orchestration
        result = await orchestrator.orchestrate_workshop_analysis(
            mission_id=mission_id,
            workshop_data=workshop_data,
            user_context={"test_mode": True}
        )
        
        print(f"✅ Orchestration réussie")
        print(f"   Mission: {result.mission_id}")
        print(f"   Complétion: {result.completion_percentage}%")
        print(f"   Score qualité: {result.quality_score}")
        print(f"   Suggestions: {len(result.suggestions)}")
        
        # Test de récupération mémoire
        memories = await memory_service.retrieve_memory(
            mission_id=mission_id,
            agent_id="workshop1_agent"
        )
        
        print(f"✅ Mémoires récupérées: {len(memories)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur workflow: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_integration_with_main():
    """Test d'intégration avec le service principal"""
    print("\n🔗 TEST INTÉGRATION SERVICE PRINCIPAL")
    print("-" * 45)
    
    try:
        from main import app, ADVANCED_SERVICES_AVAILABLE
        
        print(f"✅ Service principal importé")
        print(f"✅ Services avancés disponibles: {ADVANCED_SERVICES_AVAILABLE}")
        
        # Test des endpoints
        print("✅ Endpoints disponibles:")
        for route in app.routes:
            if hasattr(route, 'path'):
                print(f"   {route.methods} {route.path}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur intégration: {e}")
        return False

async def run_all_tests():
    """Exécute tous les tests"""
    print("🧪 TESTS ORCHESTRATION AVANCÉE WORKSHOP 1")
    print("=" * 60)
    
    tests = [
        ("Import orchestrateur", test_orchestrator_import),
        ("Création orchestrateur", test_orchestrator_creation),
        ("Service mémoire", test_memory_service),
        ("Workflow orchestration", test_orchestration_workflow),
        ("Intégration service principal", test_integration_with_main)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 Test: {test_name}")
        try:
            if asyncio.iscoroutinefunction(test_func):
                result = await test_func()
            else:
                result = test_func()
            
            if result:
                print(f"✅ {test_name}: RÉUSSI")
                passed += 1
            else:
                print(f"❌ {test_name}: ÉCHOUÉ")
                
        except Exception as e:
            print(f"❌ {test_name}: ERREUR - {e}")
    
    # Rapport final
    print("\n" + "=" * 60)
    print("📊 RAPPORT FINAL TESTS ORCHESTRATION")
    print("=" * 60)
    
    print(f"✅ Tests réussis: {passed}/{total}")
    print(f"❌ Tests échoués: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 TOUS LES TESTS RÉUSSIS!")
        print("✅ L'orchestration avancée fonctionne parfaitement")
        print("🧠 La mémoire persistante est opérationnelle")
        print("🎼 Le workflow d'orchestration est fonctionnel")
        print("🔗 L'intégration avec le service principal est réussie")
        print("\n🚀 PRÊT POUR L'INTÉGRATION FRONTEND!")
    else:
        print("\n⚠️ CERTAINS TESTS ONT ÉCHOUÉ")
        print("🔧 Vérifiez les erreurs ci-dessus")
    
    return passed == total

if __name__ == "__main__":
    success = asyncio.run(run_all_tests())
    sys.exit(0 if success else 1)
