#!/usr/bin/env python3
"""
🔧 TEST INTÉGRATION REDIS
Test des services avec Redis activé
"""

import asyncio
from datetime import datetime

async def test_redis_integration():
    """Test de l'intégration Redis"""
    print("🔧 TEST INTÉGRATION REDIS")
    print("-" * 30)
    
    try:
        from services.workshop1_orchestrator import Workshop1OrchestratorFactory
        from services.agent_memory_service import AgentMemoryServiceFactory
        
        # Créer les services
        orchestrator = Workshop1OrchestratorFactory.create()
        memory_service = AgentMemoryServiceFactory.create()
        
        print("✅ Services créés")
        
        # Vérifier les capacités Redis
        print("\n📊 Capacités orchestrateur:")
        caps = orchestrator.get_capabilities()
        for k, v in caps.items():
            if 'redis' in k or 'memory' in k:
                print(f"   {k}: {v}")
        
        print("\n📊 Statut service mémoire:")
        status = memory_service.get_status()
        for k, v in status.items():
            print(f"   {k}: {v}")
        
        # Test de stockage Redis
        print("\n💾 Test stockage Redis:")
        memory_id = await memory_service.store_memory(
            mission_id="test_redis",
            agent_id="redis_test_agent",
            session_id="redis_session",
            memory_type="test",
            content={"message": "Test Redis opérationnel", "timestamp": datetime.now().isoformat()},
            priority=3
        )
        
        print(f"✅ Mémoire stockée dans Redis: {memory_id}")
        
        # Test de récupération Redis
        memories = await memory_service.retrieve_memory(
            mission_id="test_redis",
            agent_id="redis_test_agent"
        )
        
        print(f"✅ Mémoires récupérées depuis Redis: {len(memories)}")
        
        if memories:
            memory = memories[0]
            print(f"   Contenu: {memory.content.get('message', 'N/A')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur test Redis: {e}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_redis_integration())
    print(f"\n🎯 Redis {'✅ OPÉRATIONNEL' if success else '❌ PROBLÈME'}")
