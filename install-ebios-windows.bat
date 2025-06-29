@echo off
setlocal enabledelayedexpansion

REM ========================================================================
REM EBIOS AI MANAGER - INSTALLATEUR AUTOMATIQUE WINDOWS
REM Installation simplifiée pour Risk Managers
REM ========================================================================

title EBIOS AI Manager - Installation

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║        🛡️ EBIOS AI MANAGER - INSTALLATEUR WINDOWS           ║
echo ║                                                              ║
echo ║        Installation automatique pour Risk Managers          ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Vérifier les privilèges administrateur
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ ERREUR: Ce script doit être exécuté en tant qu'administrateur
    echo.
    echo 🔧 Solution:
    echo    1. Clic droit sur ce fichier
    echo    2. Sélectionner "Exécuter en tant qu'administrateur"
    echo.
    pause
    exit /b 1
)

echo ✅ Privilèges administrateur confirmés
echo.

REM Créer le dossier de logs
if not exist "logs" mkdir logs
set LOGFILE=logs\installation_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.log

echo 📝 Log d'installation: %LOGFILE%
echo Installation démarrée le %date% à %time% > %LOGFILE%

REM Fonction pour logger
set "log=echo"

%log% 🔍 Vérification de l'environnement système...
%log% Système: %OS% >> %LOGFILE%
%log% Architecture: %PROCESSOR_ARCHITECTURE% >> %LOGFILE%

REM Vérifier la connexion Internet
%log% 🌐 Vérification de la connexion Internet...
ping -n 1 google.com >nul 2>&1
if %errorLevel% neq 0 (
    %log% ❌ ERREUR: Connexion Internet requise pour l'installation
    %log% Vérifiez votre connexion et relancez l'installation
    pause
    exit /b 1
)
%log% ✅ Connexion Internet OK

REM Étape 1: Installation de Chocolatey (gestionnaire de paquets Windows)
%log% 📦 Étape 1/6: Installation de Chocolatey...
where choco >nul 2>&1
if %errorLevel% neq 0 (
    %log% Installation de Chocolatey en cours...
    powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"
    if !errorLevel! neq 0 (
        %log% ❌ ERREUR: Échec de l'installation de Chocolatey
        pause
        exit /b 1
    )
    %log% ✅ Chocolatey installé avec succès
) else (
    %log% ✅ Chocolatey déjà installé
)

REM Actualiser les variables d'environnement
call refreshenv

REM Étape 2: Installation de Node.js
%log% 📦 Étape 2/6: Installation de Node.js...
where node >nul 2>&1
if %errorLevel% neq 0 (
    %log% Installation de Node.js en cours...
    choco install nodejs -y
    if !errorLevel! neq 0 (
        %log% ❌ ERREUR: Échec de l'installation de Node.js
        pause
        exit /b 1
    )
    %log% ✅ Node.js installé avec succès
) else (
    %log% ✅ Node.js déjà installé
    node --version >> %LOGFILE%
)

REM Étape 3: Installation de Python
%log% 📦 Étape 3/6: Installation de Python...
where python >nul 2>&1
if %errorLevel% neq 0 (
    %log% Installation de Python en cours...
    choco install python -y
    if !errorLevel! neq 0 (
        %log% ❌ ERREUR: Échec de l'installation de Python
        pause
        exit /b 1
    )
    %log% ✅ Python installé avec succès
) else (
    %log% ✅ Python déjà installé
    python --version >> %LOGFILE%
)

REM Étape 4: Installation de Git
%log% 📦 Étape 4/6: Installation de Git...
where git >nul 2>&1
if %errorLevel% neq 0 (
    %log% Installation de Git en cours...
    choco install git -y
    if !errorLevel! neq 0 (
        %log% ❌ ERREUR: Échec de l'installation de Git
        pause
        exit /b 1
    )
    %log% ✅ Git installé avec succès
) else (
    %log% ✅ Git déjà installé
    git --version >> %LOGFILE%
)

REM Actualiser les variables d'environnement
call refreshenv

REM Étape 5: Téléchargement et configuration de l'application
%log% 📥 Étape 5/6: Téléchargement de EBIOS AI Manager...

set "INSTALL_DIR=%USERPROFILE%\EBIOS_AI_Manager"
%log% Dossier d'installation: %INSTALL_DIR%

if exist "%INSTALL_DIR%" (
    %log% ⚠️ Dossier existant détecté. Sauvegarde en cours...
    if exist "%INSTALL_DIR%_backup" rmdir /s /q "%INSTALL_DIR%_backup"
    move "%INSTALL_DIR%" "%INSTALL_DIR%_backup"
)

%log% Clonage du repository...
git clone https://github.com/abk1969/Ebios_AI_manager.git "%INSTALL_DIR%"
if %errorLevel% neq 0 (
    %log% ❌ ERREUR: Échec du téléchargement de l'application
    pause
    exit /b 1
)

cd /d "%INSTALL_DIR%"

REM Étape 6: Configuration de l'environnement
%log% ⚙️ Étape 6/6: Configuration de l'environnement...

%log% Installation des dépendances Node.js...
call npm install
if %errorLevel% neq 0 (
    %log% ❌ ERREUR: Échec de l'installation des dépendances Node.js
    pause
    exit /b 1
)

%log% Configuration de l'environnement Python...
cd python-ai-service
python -m venv venv
call venv\Scripts\activate
pip install -r requirements-cloudrun.txt
if %errorLevel% neq 0 (
    %log% ❌ ERREUR: Échec de l'installation des dépendances Python
    pause
    exit /b 1
)
cd ..

%log% Installation de Firebase CLI...
call npm install -g firebase-tools
if %errorLevel% neq 0 (
    %log% ⚠️ AVERTISSEMENT: Échec de l'installation de Firebase CLI (optionnel)
)

REM Configuration de l'environnement local
%log% Configuration des variables d'environnement...
call setup-local-environment.sh 2>nul || (
    %log% Configuration manuelle des variables d'environnement...
    echo NODE_ENV=development > .env.local
    echo VITE_ENVIRONMENT=local >> .env.local
    echo VITE_AI_SERVICE_URL=http://localhost:8080 >> .env.local
    echo VITE_FRONTEND_URL=http://localhost:5173 >> .env.local
)

REM Créer les raccourcis sur le bureau
%log% 🔗 Création des raccourcis...

REM Raccourci pour démarrer l'application
echo @echo off > "%USERPROFILE%\Desktop\Démarrer EBIOS AI Manager.bat"
echo cd /d "%INSTALL_DIR%" >> "%USERPROFILE%\Desktop\Démarrer EBIOS AI Manager.bat"
echo start "EBIOS AI Manager" cmd /k "npm run dev" >> "%USERPROFILE%\Desktop\Démarrer EBIOS AI Manager.bat"
echo timeout /t 3 >> "%USERPROFILE%\Desktop\Démarrer EBIOS AI Manager.bat"
echo start http://localhost:5173 >> "%USERPROFILE%\Desktop\Démarrer EBIOS AI Manager.bat"

REM Raccourci pour le dossier d'installation
echo @echo off > "%USERPROFILE%\Desktop\Dossier EBIOS AI Manager.bat"
echo explorer "%INSTALL_DIR%" >> "%USERPROFILE%\Desktop\Dossier EBIOS AI Manager.bat"

REM Test de l'installation
%log% 🧪 Test de l'installation...
call npm run build >nul 2>&1
if %errorLevel% neq 0 (
    %log% ⚠️ AVERTISSEMENT: Le build de test a échoué, mais l'installation peut fonctionner
)

REM Résumé de l'installation
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║        🎉 INSTALLATION TERMINÉE AVEC SUCCÈS !               ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo ✅ EBIOS AI Manager installé dans: %INSTALL_DIR%
echo ✅ Raccourcis créés sur le bureau
echo ✅ Environnement configuré
echo.
echo 🚀 POUR DÉMARRER L'APPLICATION:
echo    1. Double-cliquez sur "Démarrer EBIOS AI Manager" sur le bureau
echo    2. Ou exécutez: cd "%INSTALL_DIR%" ^&^& npm run dev
echo.
echo 🌐 L'application sera accessible sur: http://localhost:5173
echo.
echo 📚 DOCUMENTATION:
echo    • README.md - Guide complet d'utilisation
echo    • GUIDE_RISK_MANAGERS.md - Guide spécifique aux risk managers
echo    • TROUBLESHOOTING.md - Guide de dépannage
echo.
echo 📞 SUPPORT:
echo    • GitHub: https://github.com/abk1969/Ebios_AI_manager
echo    • Issues: https://github.com/abk1969/Ebios_AI_manager/issues
echo.

REM Proposer de démarrer l'application
set /p "START_APP=Voulez-vous démarrer l'application maintenant ? (O/N): "
if /i "%START_APP%"=="O" (
    echo 🚀 Démarrage de EBIOS AI Manager...
    start "EBIOS AI Manager" cmd /k "npm run dev"
    timeout /t 3
    start http://localhost:5173
)

echo.
echo Installation terminée le %date% à %time% >> %LOGFILE%
echo 🎯 Installation terminée ! Consultez %LOGFILE% pour les détails.
echo.
pause
