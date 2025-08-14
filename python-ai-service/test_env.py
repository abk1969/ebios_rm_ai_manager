#!/usr/bin/env python3
"""
🧪 TEST DE L'ENVIRONNEMENT PYTHON AI
Validation de l'isolation et des dépendances
"""

import sys
import os

def test_environment():
    print("🧪 Test de l'environnement Python AI")
    print(f"Python version: {sys.version}")
    print(f"Python executable: {sys.executable}")
    print(f"Working directory: {os.getcwd()}")
    
    # Test des imports critiques
    try:
        import flask
        print(f"✅ Flask {flask.__version__}")
    except ImportError as e:
        print(f"❌ Flask: {e}")
        
    try:
        import flask_cors
        print(f"✅ Flask-CORS disponible")
    except ImportError as e:
        print(f"❌ Flask-CORS: {e}")
        
    try:
        import openai
        print(f"✅ OpenAI {openai.__version__}")
    except ImportError as e:
        print(f"❌ OpenAI: {e}")
        
    try:
        import langchain
        print(f"✅ LangChain {langchain.__version__}")
    except ImportError as e:
        print(f"❌ LangChain: {e}")
        
    try:
        import sqlalchemy
        print(f"✅ SQLAlchemy {sqlalchemy.__version__}")
    except ImportError as e:
        print(f"❌ SQLAlchemy: {e}")
        
    print("\n🎯 Test de création d'une app Flask simple...")
    try:
        from flask import Flask
        test_app = Flask(__name__)
        
        @test_app.route('/health')
        def health():
            return {'status': 'healthy', 'service': 'ebios-ai'}
            
        print("✅ App Flask créée avec succès")
        return True
    except Exception as e:
        print(f"❌ Erreur création Flask: {e}")
        return False

if __name__ == "__main__":
    success = test_environment()
    sys.exit(0 if success else 1)
