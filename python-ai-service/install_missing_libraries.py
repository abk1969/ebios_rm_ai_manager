#!/usr/bin/env python3
"""
📦 INSTALLATION INTELLIGENTE DES LIBRAIRIES MANQUANTES
Installation sélective des librairies Python pour l'orchestration IA
"""

import subprocess
import sys
import importlib
import os
from datetime import datetime

def check_library(library_name, import_name=None):
    """Vérifie si une librairie est installée"""
    if import_name is None:
        import_name = library_name
    
    try:
        importlib.import_module(import_name)
        return True
    except ImportError:
        return False

def install_library(library_name, description=""):
    """Installe une librairie avec pip"""
    print(f"📦 Installation de {library_name}...")
    if description:
        print(f"   {description}")
    
    try:
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", library_name],
            capture_output=True,
            text=True,
            check=True
        )
        print(f"✅ {library_name} installé avec succès")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur installation {library_name}: {e.stderr}")
        return False

def main():
    """Installation intelligente des librairies manquantes"""
    print("📦 INSTALLATION INTELLIGENTE DES LIBRAIRIES PYTHON IA")
    print("=" * 60)
    print(f"🕒 Démarrage: {datetime.now().strftime('%H:%M:%S')}")
    
    # Définition des librairies par priorité
    libraries = {
        # Priorité CRITIQUE - Infrastructure de base
        "critical": [
            ("fastapi", "fastapi", "Framework web haute performance"),
            ("uvicorn", "uvicorn", "Serveur ASGI pour FastAPI"),
            ("pydantic", "pydantic", "Validation de données"),
            ("python-dotenv", "dotenv", "Gestion variables d'environnement"),
        ],
        
        # Priorité HAUTE - Orchestration IA
        "high": [
            ("redis", "redis", "Cache et mémoire persistante"),
            ("sqlalchemy", "sqlalchemy", "ORM base de données"),
            ("alembic", "alembic", "Migrations base de données"),
            ("celery", "celery", "Tâches asynchrones"),
        ],
        
        # Priorité MOYENNE - IA et ML
        "medium": [
            ("langchain", "langchain", "Orchestration agents IA"),
            ("langchain-community", "langchain_community", "Extensions LangChain"),
            ("instructor", "instructor", "Structuration réponses LLM"),
            ("transformers", "transformers", "Modèles de langage"),
            ("sentence-transformers", "sentence_transformers", "Embeddings sémantiques"),
            ("torch", "torch", "Deep learning"),
            ("scikit-learn", "sklearn", "Machine learning"),
            ("xgboost", "xgboost", "Gradient boosting"),
        ],
        
        # Priorité BASSE - Visualisation et monitoring
        "low": [
            ("numpy", "numpy", "Calcul numérique"),
            ("pandas", "pandas", "Manipulation de données"),
            ("networkx", "networkx", "Graphes et réseaux"),
            ("plotly", "plotly", "Visualisations interactives"),
            ("dash", "dash", "Applications web interactives"),
            ("matplotlib", "matplotlib", "Graphiques"),
            ("seaborn", "seaborn", "Visualisations statistiques"),
            ("prometheus-client", "prometheus_client", "Métriques Prometheus"),
            ("structlog", "structlog", "Logs structurés"),
        ]
    }
    
    # Vérification et installation par priorité
    total_installed = 0
    total_already_installed = 0
    total_failed = 0
    
    for priority, lib_list in libraries.items():
        print(f"\n🎯 PRIORITÉ {priority.upper()}")
        print("-" * 40)
        
        for lib_name, import_name, description in lib_list:
            if check_library(lib_name, import_name):
                print(f"✅ {lib_name} - Déjà installé")
                total_already_installed += 1
            else:
                print(f"⚠️ {lib_name} - Manquant")
                if install_library(lib_name, description):
                    total_installed += 1
                else:
                    total_failed += 1
    
    # Installation des dépendances optionnelles spéciales
    print(f"\n🔧 DÉPENDANCES OPTIONNELLES")
    print("-" * 30)
    
    optional_deps = [
        ("llama-index", "llama_index", "RAG et base de connaissances"),
        ("pinecone-client", "pinecone", "Base vectorielle"),
        ("docling", "docling", "Traitement de documents"),
    ]
    
    for lib_name, import_name, description in optional_deps:
        if not check_library(lib_name, import_name):
            print(f"💡 {lib_name} - Optionnel: {description}")
            response = input(f"   Installer {lib_name}? (y/N): ").lower().strip()
            if response in ['y', 'yes', 'o', 'oui']:
                if install_library(lib_name, description):
                    total_installed += 1
                else:
                    total_failed += 1
            else:
                print(f"⏭️ {lib_name} - Ignoré")
        else:
            print(f"✅ {lib_name} - Déjà installé")
            total_already_installed += 1
    
    # Rapport final
    print("\n" + "=" * 60)
    print("📊 RAPPORT D'INSTALLATION")
    print("=" * 60)
    
    print(f"✅ Librairies déjà installées: {total_already_installed}")
    print(f"📦 Nouvelles installations: {total_installed}")
    print(f"❌ Échecs d'installation: {total_failed}")
    
    total_libraries = total_already_installed + total_installed + total_failed
    success_rate = ((total_already_installed + total_installed) / total_libraries * 100) if total_libraries > 0 else 0
    
    print(f"📈 Taux de succès: {success_rate:.1f}%")
    
    if total_failed == 0:
        print("\n🎉 INSTALLATION COMPLÈTE RÉUSSIE!")
        print("✅ Toutes les librairies sont disponibles")
        print("🚀 L'orchestration IA avancée est prête")
    elif total_failed <= 2:
        print("\n✅ INSTALLATION MAJORITAIREMENT RÉUSSIE")
        print("⚠️ Quelques librairies optionnelles ont échoué")
        print("🚀 L'orchestration IA de base est opérationnelle")
    else:
        print("\n⚠️ INSTALLATION PARTIELLE")
        print("🔧 Plusieurs librairies ont échoué")
        print("💡 Vérifiez votre connexion internet et les permissions")
    
    # Test des imports critiques
    print(f"\n🧪 TEST DES IMPORTS CRITIQUES")
    print("-" * 35)
    
    critical_imports = [
        ("fastapi", "FastAPI"),
        ("pydantic", "Validation"),
        ("redis", "Cache mémoire"),
        ("sqlalchemy", "Base de données"),
    ]
    
    critical_success = 0
    for lib_name, description in critical_imports:
        if check_library(lib_name):
            print(f"✅ {lib_name} - {description}")
            critical_success += 1
        else:
            print(f"❌ {lib_name} - {description}")
    
    if critical_success == len(critical_imports):
        print("\n🎯 TOUTES LES LIBRAIRIES CRITIQUES SONT DISPONIBLES")
        print("🚀 Prêt pour la Phase 2: IA Sémantique et Suggestions")
    else:
        print(f"\n⚠️ {len(critical_imports) - critical_success} librairies critiques manquantes")
        print("🔧 Installation manuelle recommandée pour les librairies critiques")
    
    print(f"\n🕒 Terminé: {datetime.now().strftime('%H:%M:%S')}")
    
    return critical_success == len(critical_imports)

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
