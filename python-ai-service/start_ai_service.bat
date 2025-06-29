@echo off
echo 🤖 DÉMARRAGE SERVICE IA PYTHON EBIOS
echo =====================================

cd /d "%~dp0"

echo 📍 Répertoire: %CD%

REM Vérifier si Python est disponible
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python n'est pas installé ou pas dans le PATH
    echo 💡 Installez Python 3.8+ depuis https://python.org
    pause
    exit /b 1
)

echo ✅ Python détecté

REM Vérifier si le fichier requirements.txt existe
if not exist "requirements.txt" (
    echo ❌ Fichier requirements.txt manquant
    echo 💡 Assurez-vous d'être dans le bon répertoire
    pause
    exit /b 1
)

echo ✅ Fichier requirements.txt trouvé

REM Installer et démarrer le service
echo 🚀 Installation et démarrage automatique...
python install_and_run.py

echo.
echo 🛑 Service arrêté
pause
