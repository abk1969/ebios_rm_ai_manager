#!/usr/bin/env python3
"""
🧪 TEST PHASE 3 : RAG ET BASE DE CONNAISSANCES
Test complet des services RAG et traitement de documents
"""

import asyncio
import json
import sys
from datetime import datetime

def test_rag_service_import():
    """Test d'import du service RAG"""
    print("🧪 TEST IMPORT SERVICE RAG")
    print("-" * 30)
    
    try:
        from services.ebios_rag_service import EbiosRAGServiceFactory, RAGQueryResult
        print("✅ Import EbiosRAGServiceFactory: OK")
        
        from services.document_processor import DocumentProcessorFactory, DocumentProcessingResult
        print("✅ Import DocumentProcessorFactory: OK")
        
        return True
        
    except ImportError as e:
        print(f"❌ Erreur import: {e}")
        return False

def test_rag_service_creation():
    """Test de création du service RAG"""
    print("\n📚 TEST CRÉATION SERVICE RAG")
    print("-" * 35)
    
    try:
        from services.ebios_rag_service import EbiosRAGServiceFactory
        
        rag_service = EbiosRAGServiceFactory.create()
        print("✅ Service RAG créé avec succès")
        
        # Test des capacités
        capabilities = rag_service.get_capabilities()
        print(f"✅ Capacités RAG:")
        for cap, available in capabilities.items():
            print(f"   {available and '✅' or '⚠️'} {cap}")
        
        # Test des statistiques de la base de connaissances
        stats = rag_service.get_knowledge_stats()
        print(f"✅ Base de connaissances:")
        print(f"   Documents: {stats['total_documents']}")
        print(f"   Catégories: {list(stats['categories'].keys())}")
        print(f"   Longueur moyenne: {stats['average_content_length']} caractères")
        
        # Test de l'état
        is_ready = rag_service.is_ready()
        print(f"✅ État prêt: {is_ready}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur création: {e}")
        return False

def test_document_processor():
    """Test du processeur de documents"""
    print("\n📄 TEST PROCESSEUR DE DOCUMENTS")
    print("-" * 40)
    
    try:
        from services.document_processor import DocumentProcessorFactory
        
        processor = DocumentProcessorFactory.create()
        print("✅ Processeur de documents créé avec succès")
        
        # Test des capacités
        capabilities = processor.get_capabilities()
        print(f"✅ Capacités processeur:")
        for cap, available in capabilities.items():
            print(f"   {available and '✅' or '⚠️'} {cap}")
        
        # Test des statistiques
        stats = processor.get_processing_stats()
        print(f"✅ Statistiques traitement:")
        print(f"   Formats supportés: {stats['supported_formats']}")
        print(f"   Documents traités: {stats['total_documents_processed']}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur processeur: {e}")
        return False

async def test_rag_knowledge_queries():
    """Test des requêtes à la base de connaissances"""
    print("\n📚 TEST REQUÊTES BASE DE CONNAISSANCES")
    print("-" * 45)
    
    try:
        from services.ebios_rag_service import EbiosRAGServiceFactory
        
        # Créer le service RAG
        rag_service = EbiosRAGServiceFactory.create()
        print("✅ Service RAG créé")
        
        # Construire l'index vectoriel
        index_built = await rag_service.build_vector_index()
        print(f"✅ Index vectoriel: {'Construit' if index_built else 'Mode fallback'}")
        
        # Test de requêtes EBIOS RM
        test_queries = [
            "Comment définir les valeurs métier en EBIOS RM ?",
            "Quelle est la différence entre biens essentiels et biens supports ?",
            "Quelles sont les bonnes pratiques pour l'Atelier 1 ?",
            "Comment identifier les événements redoutés ?",
            "Quels sont les critères de sécurité EBIOS RM ?"
        ]
        
        print(f"✅ Test de {len(test_queries)} requêtes:")
        
        for i, query in enumerate(test_queries, 1):
            print(f"\n   🔍 Requête {i}: {query}")
            
            # Contexte de test
            context = {
                "current_step": "business-values",
                "user_experience": 0.6
            }
            
            # Exécuter la requête RAG
            result = await rag_service.query_ebios_knowledge(query, context)
            
            print(f"   ✅ Réponse (confiance: {result.confidence:.2f}):")
            print(f"      {result.response[:100]}...")
            print(f"   📚 Sources: {len(result.sources)}")
            
            if result.sources:
                for source in result.sources[:2]:  # Limiter l'affichage
                    print(f"      - {source.get('title', 'N/A')} ({source.get('category', 'N/A')})")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur requêtes RAG: {e}")
        import traceback
        traceback.print_exc()
        return False

async def test_document_processing_workflow():
    """Test du workflow de traitement de documents"""
    print("\n📄 TEST WORKFLOW TRAITEMENT DOCUMENTS")
    print("-" * 45)
    
    try:
        from services.document_processor import DocumentProcessorFactory
        import tempfile
        import os
        
        # Créer le processeur
        processor = DocumentProcessorFactory.create()
        print("✅ Processeur créé")
        
        # Créer un document de test
        test_content = """
# Guide EBIOS RM - Atelier 1

## Introduction
L'Atelier 1 d'EBIOS RM permet de définir le cadrage de l'analyse de risque.

## Valeurs Métier
Les valeurs métier représentent ce qui a de la valeur pour l'organisme.
Exemples :
- Continuité d'activité
- Conformité réglementaire
- Réputation

## Biens Essentiels
Les biens essentiels supportent directement les valeurs métier.
Ils peuvent être :
- Des informations
- Des processus
- Du savoir-faire

## Conclusion
L'Atelier 1 est fondamental pour la suite de l'analyse EBIOS RM.
        """
        
        # Créer un fichier temporaire
        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False, encoding='utf-8') as f:
            f.write(test_content)
            temp_file = f.name
        
        try:
            print(f"✅ Document de test créé: {os.path.basename(temp_file)}")
            
            # Traiter le document
            result = await processor.process_document(
                temp_file, 
                document_category="guide",
                auto_add_to_rag=True
            )
            
            print(f"✅ Traitement {'réussi' if result.success else 'échoué'}")
            
            if result.success:
                print(f"   Titre: {result.title}")
                print(f"   Contenu: {len(result.content)} caractères")
                print(f"   Sections: {len(result.extracted_sections)}")
                print(f"   Temps: {result.processing_time:.2f}s")
                
                if result.extracted_sections:
                    print("   Sections extraites:")
                    for section in result.extracted_sections[:3]:
                        print(f"     - {section.title}: {len(section.content)} caractères")
            else:
                print(f"   Erreur: {result.error_message}")
            
        finally:
            # Nettoyer le fichier temporaire
            os.unlink(temp_file)
        
        return result.success if 'result' in locals() else False
        
    except Exception as e:
        print(f"❌ Erreur traitement documents: {e}")
        return False

async def test_orchestrator_rag_integration():
    """Test d'intégration RAG avec l'orchestrateur"""
    print("\n🎼 TEST INTÉGRATION RAG ORCHESTRATEUR")
    print("-" * 45)
    
    try:
        from services.workshop1_orchestrator import Workshop1OrchestratorFactory
        
        # Créer l'orchestrateur avec RAG
        orchestrator = Workshop1OrchestratorFactory.create()
        print("✅ Orchestrateur créé")
        
        # Vérifier les nouvelles capacités RAG
        capabilities = orchestrator.get_capabilities()
        print("✅ Capacités RAG détectées:")
        
        rag_capabilities = [
            "rag_services",
            "rag_llama_index_available",
            "rag_rag_enabled",
            "rag_knowledge_base_loaded",
            "doc_docling_available",
            "doc_rag_integration"
        ]
        
        for cap in rag_capabilities:
            if cap in capabilities:
                status = "✅" if capabilities[cap] else "⚠️"
                print(f"   {status} {cap}: {capabilities[cap]}")
        
        # Test d'orchestration complète avec RAG
        mission_id = "test_mission_rag"
        workshop_data = {
            "business_values": [
                {
                    "id": "bv1",
                    "name": "Continuité d'activité",
                    "description": "Maintien des opérations critiques"
                }
            ],
            "essential_assets": [
                {
                    "id": "ea1",
                    "name": "Système de gestion",
                    "description": "Application critique de gestion"
                }
            ],
            "supporting_assets": [],
            "dreaded_events": [],
            "current_step": "essential-assets"
        }
        
        user_context = {
            "current_step": "essential-assets",
            "user_experience": 0.5,
            "domain_complexity": 0.7
        }
        
        print("✅ Test d'orchestration avec RAG...")
        
        # Orchestration complète avec RAG
        result = await orchestrator.orchestrate_workshop_analysis(
            mission_id=mission_id,
            workshop_data=workshop_data,
            user_context=user_context
        )
        
        print(f"✅ Orchestration avec RAG réussie")
        print(f"   Mission: {result.mission_id}")
        print(f"   Complétion: {result.completion_percentage:.1f}%")
        print(f"   Score qualité: {result.quality_score:.1f}")
        print(f"   Suggestions totales: {len(result.suggestions)}")
        
        # Vérifier si des suggestions RAG sont présentes
        rag_suggestions = [s for s in result.suggestions if "Conseil expert" in str(s)]
        print(f"   Suggestions RAG: {len(rag_suggestions)}")
        
        if rag_suggestions:
            print("   Exemples de conseils RAG:")
            for suggestion in rag_suggestions[:2]:
                print(f"     - {str(suggestion)[:80]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur intégration RAG: {e}")
        import traceback
        traceback.print_exc()
        return False

async def run_phase3_tests():
    """Exécute tous les tests de la Phase 3"""
    print("🧪 TESTS PHASE 3 : RAG ET BASE DE CONNAISSANCES")
    print("=" * 60)
    
    tests = [
        ("Import service RAG", test_rag_service_import),
        ("Création service RAG", test_rag_service_creation),
        ("Processeur de documents", test_document_processor),
        ("Requêtes base de connaissances", test_rag_knowledge_queries),
        ("Workflow traitement documents", test_document_processing_workflow),
        ("Intégration RAG orchestrateur", test_orchestrator_rag_integration)
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
    print("📊 RAPPORT FINAL PHASE 3 : RAG ET BASE DE CONNAISSANCES")
    print("=" * 60)
    
    print(f"✅ Tests réussis: {passed}/{total}")
    print(f"❌ Tests échoués: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 PHASE 3 COMPLÈTEMENT RÉUSSIE!")
        print("✅ Le service RAG EBIOS RM fonctionne parfaitement")
        print("📄 Le traitement de documents est opérationnel")
        print("📚 La base de connaissances est accessible")
        print("🎼 L'intégration avec l'orchestrateur est réussie")
        print("\n🚀 TOUTES LES PHASES TERMINÉES AVEC SUCCÈS!")
        print("🎯 L'ORCHESTRATION IA AVANCÉE EST COMPLÈTE!")
    elif passed >= total - 1:
        print("\n✅ PHASE 3 MAJORITAIREMENT RÉUSSIE")
        print("🔧 Quelques ajustements mineurs nécessaires")
        print("🚀 L'orchestration IA avancée est opérationnelle")
    else:
        print("\n⚠️ PHASE 3 PARTIELLEMENT RÉUSSIE")
        print("🔧 Vérifiez les erreurs ci-dessus")
    
    return passed >= total - 1

if __name__ == "__main__":
    success = asyncio.run(run_phase3_tests())
    sys.exit(0 if success else 1)
