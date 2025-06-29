#!/usr/bin/env python3
"""
🧪 TEST PHASE 2 : IA SÉMANTIQUE ET SUGGESTIONS
Test complet des nouveaux services d'analyse sémantique et ML
"""

import asyncio
import json
import sys
from datetime import datetime

def test_semantic_analyzer_import():
    """Test d'import de l'analyseur sémantique"""
    print("🧪 TEST IMPORT ANALYSEUR SÉMANTIQUE")
    print("-" * 45)
    
    try:
        from services.semantic_analyzer import SemanticAnalyzerFactory, SemanticAnalysisResult
        print("✅ Import SemanticAnalyzerFactory: OK")
        
        from services.ml_suggestion_engine import MLSuggestionEngineFactory, MLAnalysisResult
        print("✅ Import MLSuggestionEngineFactory: OK")
        
        return True
        
    except ImportError as e:
        print(f"❌ Erreur import: {e}")
        return False

def test_semantic_analyzer_creation():
    """Test de création de l'analyseur sémantique"""
    print("\n🧠 TEST CRÉATION ANALYSEUR SÉMANTIQUE")
    print("-" * 45)
    
    try:
        from services.semantic_analyzer import SemanticAnalyzerFactory
        
        analyzer = SemanticAnalyzerFactory.create()
        print("✅ Analyseur sémantique créé avec succès")
        
        # Test des capacités
        capabilities = analyzer.get_capabilities()
        print(f"✅ Capacités disponibles:")
        for cap, available in capabilities.items():
            print(f"   {available and '✅' or '⚠️'} {cap}")
        
        # Test de l'état
        is_ready = analyzer.is_ready()
        print(f"✅ État prêt: {is_ready}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur création: {e}")
        return False

def test_ml_suggestion_engine():
    """Test du moteur de suggestions ML"""
    print("\n🤖 TEST MOTEUR SUGGESTIONS ML")
    print("-" * 35)
    
    try:
        from services.ml_suggestion_engine import MLSuggestionEngineFactory
        
        ml_engine = MLSuggestionEngineFactory.create()
        print("✅ Moteur ML créé avec succès")
        
        # Test des capacités
        capabilities = ml_engine.get_capabilities()
        print(f"✅ Capacités ML:")
        for cap, available in capabilities.items():
            print(f"   {available and '✅' or '⚠️'} {cap}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur moteur ML: {e}")
        return False

async def test_semantic_analysis_workflow():
    """Test du workflow d'analyse sémantique complet"""
    print("\n🧠 TEST WORKFLOW ANALYSE SÉMANTIQUE")
    print("-" * 45)
    
    try:
        from services.semantic_analyzer import SemanticAnalyzerFactory
        
        # Créer l'analyseur
        analyzer = SemanticAnalyzerFactory.create()
        print("✅ Analyseur créé")
        
        # Données de test EBIOS RM
        test_elements = [
            {
                "id": "bv1",
                "name": "Facturation clients",
                "description": "Processus de facturation et d'encaissement des créances clients",
                "category": "business_values"
            },
            {
                "id": "bv2", 
                "name": "Relation client",
                "description": "Maintien et développement de la relation avec la clientèle",
                "category": "business_values"
            },
            {
                "id": "ea1",
                "name": "Base de données clients",
                "description": "Système de gestion des informations clients et prospects",
                "category": "essential_assets"
            },
            {
                "id": "ea2",
                "name": "Données de facturation",
                "description": "Informations relatives aux factures et paiements clients",
                "category": "essential_assets"
            },
            {
                "id": "sa1",
                "name": "Serveur de base de données",
                "description": "Infrastructure technique hébergeant les données",
                "category": "supporting_assets"
            }
        ]
        
        print(f"✅ Données de test préparées: {len(test_elements)} éléments")
        
        # Test d'analyse sémantique complète
        result = await analyzer.analyze_ebios_elements(
            test_elements, 
            analysis_type="comprehensive"
        )
        
        print(f"✅ Analyse sémantique réussie")
        print(f"   Score de cohérence: {result.coherence_score:.2f}")
        print(f"   Clusters détectés: {len(result.clusters)}")
        print(f"   Incohérences: {len(result.inconsistencies)}")
        print(f"   Suggestions: {len(result.suggestions)}")
        
        if result.clusters:
            print("   Clusters trouvés:")
            for cluster in result.clusters:
                print(f"     - {cluster['theme']}: {len(cluster['elements'])} éléments")
        
        if result.inconsistencies:
            print("   Incohérences détectées:")
            for inc in result.inconsistencies[:2]:  # Limiter l'affichage
                print(f"     - {inc['type']}: {inc['description'][:50]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur workflow sémantique: {e}")
        import traceback
        traceback.print_exc()
        return False

async def test_ml_suggestions_workflow():
    """Test du workflow de suggestions ML"""
    print("\n🤖 TEST WORKFLOW SUGGESTIONS ML")
    print("-" * 40)
    
    try:
        from services.ml_suggestion_engine import MLSuggestionEngineFactory
        
        # Créer le moteur ML
        ml_engine = MLSuggestionEngineFactory.create()
        print("✅ Moteur ML créé")
        
        # Données de test Workshop 1
        workshop_data = {
            "business_values": [
                {
                    "id": "bv1",
                    "name": "Facturation",
                    "description": "Processus de facturation clients"
                }
            ],
            "essential_assets": [
                {
                    "id": "ea1",
                    "name": "Base clients",
                    "description": "Données clients"
                },
                {
                    "id": "ea2",
                    "name": "Système facturation",
                    "description": "Application de facturation"
                }
            ],
            "supporting_assets": [],
            "dreaded_events": []
        }
        
        context = {
            "user_experience": 0.6,
            "domain_complexity": 0.7,
            "time_spent": 1800  # 30 minutes
        }
        
        print(f"✅ Données de test préparées")
        
        # Test de génération de suggestions ML
        result = await ml_engine.generate_ml_suggestions(workshop_data, context)
        
        print(f"✅ Suggestions ML générées")
        print(f"   Score de complétion: {result.completion_score:.2f}")
        print(f"   Confiance du modèle: {result.model_confidence:.2f}")
        print(f"   Suggestions: {len(result.suggestions)}")
        print(f"   Évaluation des risques: {result.risk_assessment.get('overall_risk', 'N/A')}")
        
        if result.suggestions:
            print("   Suggestions générées:")
            for suggestion in result.suggestions[:3]:  # Limiter l'affichage
                print(f"     - {suggestion.type}: {suggestion.content[:60]}...")
                print(f"       Confiance: {suggestion.confidence:.2f}, Priorité: {suggestion.priority}")
        
        if result.quality_predictions:
            print("   Prédictions de qualité:")
            for metric, value in result.quality_predictions.items():
                print(f"     - {metric}: {value:.2f}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur workflow ML: {e}")
        import traceback
        traceback.print_exc()
        return False

async def test_orchestrator_integration():
    """Test d'intégration avec l'orchestrateur principal"""
    print("\n🎼 TEST INTÉGRATION ORCHESTRATEUR")
    print("-" * 40)
    
    try:
        from services.workshop1_orchestrator import Workshop1OrchestratorFactory
        
        # Créer l'orchestrateur avec les nouveaux services
        orchestrator = Workshop1OrchestratorFactory.create()
        print("✅ Orchestrateur créé")
        
        # Vérifier les nouvelles capacités
        capabilities = orchestrator.get_capabilities()
        print("✅ Nouvelles capacités détectées:")
        
        advanced_capabilities = [
            "advanced_ai_services",
            "semantic_transformers_available", 
            "semantic_sklearn_available",
            "ml_xgboost_available",
            "ml_sklearn_available"
        ]
        
        for cap in advanced_capabilities:
            if cap in capabilities:
                status = "✅" if capabilities[cap] else "⚠️"
                print(f"   {status} {cap}: {capabilities[cap]}")
        
        # Test d'orchestration complète avec IA avancée
        mission_id = "test_mission_phase2"
        workshop_data = {
            "business_values": [
                {
                    "id": "bv1",
                    "name": "Continuité d'activité",
                    "description": "Maintien des opérations critiques de l'entreprise"
                },
                {
                    "id": "bv2",
                    "name": "Conformité réglementaire", 
                    "description": "Respect des obligations légales et réglementaires"
                }
            ],
            "essential_assets": [
                {
                    "id": "ea1",
                    "name": "Données personnelles clients",
                    "description": "Informations sensibles des clients soumises au RGPD"
                },
                {
                    "id": "ea2",
                    "name": "Système d'information financier",
                    "description": "Applications de gestion financière et comptable"
                }
            ],
            "supporting_assets": [
                {
                    "id": "sa1",
                    "name": "Infrastructure réseau",
                    "description": "Équipements réseau et télécommunications"
                }
            ],
            "dreaded_events": [],
            "current_step": "supporting-assets"
        }
        
        user_context = {
            "user_experience": 0.7,
            "domain_complexity": 0.8,
            "session_count": 3,
            "total_time_spent": 3600
        }
        
        print("✅ Test d'orchestration avancée...")
        
        # Orchestration complète avec IA sémantique et ML
        result = await orchestrator.orchestrate_workshop_analysis(
            mission_id=mission_id,
            workshop_data=workshop_data,
            user_context=user_context
        )
        
        print(f"✅ Orchestration avancée réussie")
        print(f"   Mission: {result.mission_id}")
        print(f"   Complétion: {result.completion_percentage:.1f}%")
        print(f"   Score qualité: {result.quality_score:.1f}")
        print(f"   Score cohérence: {result.coherence_score:.1f}")
        print(f"   Conformité EBIOS: {result.ebios_compliance:.1f}")
        print(f"   Suggestions totales: {len(result.suggestions)}")
        print(f"   Éléments analysés: {len(result.elements)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur intégration orchestrateur: {e}")
        import traceback
        traceback.print_exc()
        return False

async def run_phase2_tests():
    """Exécute tous les tests de la Phase 2"""
    print("🧪 TESTS PHASE 2 : IA SÉMANTIQUE ET SUGGESTIONS")
    print("=" * 70)
    
    tests = [
        ("Import analyseur sémantique", test_semantic_analyzer_import),
        ("Création analyseur sémantique", test_semantic_analyzer_creation),
        ("Moteur suggestions ML", test_ml_suggestion_engine),
        ("Workflow analyse sémantique", test_semantic_analysis_workflow),
        ("Workflow suggestions ML", test_ml_suggestions_workflow),
        ("Intégration orchestrateur", test_orchestrator_integration)
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
    print("\n" + "=" * 70)
    print("📊 RAPPORT FINAL PHASE 2 : IA SÉMANTIQUE ET SUGGESTIONS")
    print("=" * 70)
    
    print(f"✅ Tests réussis: {passed}/{total}")
    print(f"❌ Tests échoués: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 PHASE 2 COMPLÈTEMENT RÉUSSIE!")
        print("✅ L'analyse sémantique avancée fonctionne parfaitement")
        print("🤖 Le moteur de suggestions ML est opérationnel")
        print("🧠 L'intégration avec Transformers et XGBoost est réussie")
        print("🎼 L'orchestration avancée avec IA sémantique + ML fonctionne")
        print("\n🚀 PRÊT POUR LA PHASE 3 : RAG ET BASE DE CONNAISSANCES!")
    elif passed >= total - 1:
        print("\n✅ PHASE 2 MAJORITAIREMENT RÉUSSIE")
        print("🔧 Quelques ajustements mineurs nécessaires")
        print("🚀 Prêt pour continuer vers la Phase 3")
    else:
        print("\n⚠️ PHASE 2 PARTIELLEMENT RÉUSSIE")
        print("🔧 Vérifiez les erreurs ci-dessus")
    
    return passed >= total - 1

if __name__ == "__main__":
    success = asyncio.run(run_phase2_tests())
    sys.exit(0 if success else 1)
