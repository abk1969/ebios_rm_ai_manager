# 🚀 SCRIPT DE DÉMARRAGE AVEC WORKSHOP 1 - PowerShell
# Démarrage optimisé pour tester le nouveau module Workshop 1

# 🎯 CONFIGURATION
$PORT = 5173
$HOST = "localhost"
$WORKSHOP1_URL = "http://${HOST}:${PORT}/training/workshop1"

Write-Host "🚀 DÉMARRAGE EBIOS AI MANAGER AVEC WORKSHOP 1" -ForegroundColor Blue
Write-Host "==================================================" -ForegroundColor Blue
Write-Host ""

# 🔧 Configuration des variables d'environnement
Write-Host "⚙️ Configuration de l'environnement..." -ForegroundColor Yellow

$envContent = @"
# Configuration Workshop 1 - Développement
NODE_ENV=development
VITE_NODE_ENV=development

# Workshop 1 Features
VITE_WORKSHOP1_ENABLE_MONITORING=true
VITE_WORKSHOP1_ENABLE_A2A=true
VITE_WORKSHOP1_ENABLE_EXPERT_NOTIFICATIONS=true
VITE_WORKSHOP1_ENABLE_PERFORMANCE_TRACKING=true
VITE_WORKSHOP1_ENABLE_ERROR_REPORTING=true

# Workshop 1 Limits
VITE_WORKSHOP1_MAX_CONCURRENT_SESSIONS=10
VITE_WORKSHOP1_SESSION_TIMEOUT_MS=1800000
VITE_WORKSHOP1_NOTIFICATION_RETENTION_DAYS=7
VITE_WORKSHOP1_METRICS_RETENTION_DAYS=30

# Workshop 1 Logging
VITE_WORKSHOP1_LOG_LEVEL=debug

# Firebase Configuration
VITE_FIREBASE_PROJECT_ID=ebiosdatabase
VITE_FIREBASE_API_KEY=AIzaSyCN4GaNMnshiDw0Z0dgGnhmgbokVyd7LmA
VITE_FIREBASE_AUTH_DOMAIN=ebiosdatabase.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=ebiosdatabase.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456789

# Training Module
VITE_TRAINING_MODULE_ENABLED=true

# Development Features
VITE_ENABLE_DEV_TOOLS=true
VITE_ENABLE_REACT_DEVTOOLS=true
VITE_ENABLE_REDUX_DEVTOOLS=true
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "✅ Variables d'environnement configurées" -ForegroundColor Green

# 📦 Installation des dépendances si nécessaire
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dépendances installées" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 INFORMATIONS WORKSHOP 1" -ForegroundColor Blue
Write-Host "================================" -ForegroundColor Blue
Write-Host ""
Write-Host "🎯 URLs de test:" -ForegroundColor Green
Write-Host "   • Application: http://${HOST}:${PORT}"
Write-Host "   • Formation: http://${HOST}:${PORT}/training"
Write-Host "   • Workshop 1: $WORKSHOP1_URL"
Write-Host ""
Write-Host "🧪 Fonctionnalités à tester:" -ForegroundColor Green
Write-Host "   • Agent Orchestrateur Intelligent (Point 1)"
Write-Host "   • Système de Notifications A2A (Point 2)"
Write-Host "   • Interface React Intelligente (Point 3)"
Write-Host "   • Tests et Validation (Point 4)"
Write-Host "   • Intégration Production (Point 5)"
Write-Host ""
Write-Host "👤 Profils de test disponibles:" -ForegroundColor Green
Write-Host "   • Junior EBIOS RM (apprentissage guidé)"
Write-Host "   • Senior EBIOS RM (interface équilibrée)"
Write-Host "   • Expert EBIOS RM (fonctionnalités complètes)"
Write-Host "   • Master EBIOS RM (collaboration A2A)"
Write-Host ""
Write-Host "🔧 Commandes utiles:" -ForegroundColor Green
Write-Host "   • Ctrl+C : Arrêter le serveur"
Write-Host "   • F12 : Ouvrir les outils de développement"
Write-Host "   • Ctrl+Shift+I : Inspecter les composants React"
Write-Host ""

# 🚀 Démarrage du serveur
Write-Host "🚀 Démarrage du serveur de développement..." -ForegroundColor Blue
Write-Host ""

# Démarrage en arrière-plan
$job = Start-Job -ScriptBlock { npm run dev }

# Attendre que le serveur démarre
Write-Host "⏳ Démarrage en cours..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Vérifier si le serveur est démarré
try {
    $response = Invoke-WebRequest -Uri "http://${HOST}:${PORT}" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Serveur démarré avec succès !" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎯 ACCÈS DIRECT AU WORKSHOP 1:" -ForegroundColor Blue
    Write-Host "$WORKSHOP1_URL" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Instructions pour tester:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. 🌐 Ouvrez votre navigateur sur: $WORKSHOP1_URL"
    Write-Host "2. 🔐 Connectez-vous avec vos identifiants"
    Write-Host "3. 👤 Configurez votre profil d'expertise"
    Write-Host "4. 🎯 Testez l'adaptation intelligente de l'interface"
    Write-Host "5. 🤖 Interagissez avec l'agent orchestrateur"
    Write-Host "6. 🔔 Testez les notifications expertes A2A"
    Write-Host "7. 📊 Vérifiez les métriques et le monitoring"
    Write-Host ""
    Write-Host "🔍 Logs de développement:" -ForegroundColor Blue
    Write-Host "   • Console navigateur : Logs détaillés du Workshop 1"
    Write-Host "   • Redux DevTools : État de l'application"
    Write-Host "   • React DevTools : Composants et props"
    Write-Host "   • Network : Requêtes API et Firebase"
    Write-Host ""
    
    # Ouvrir automatiquement le navigateur
    Write-Host "🌐 Ouverture automatique du navigateur..." -ForegroundColor Yellow
    Start-Process $WORKSHOP1_URL
    
} catch {
    Write-Host "⚠️ Le serveur démarre encore... Veuillez patienter" -ForegroundColor Yellow
    Write-Host "   Vérifiez manuellement: http://${HOST}:${PORT}"
}

Write-Host ""
Write-Host "🎉 WORKSHOP 1 PRÊT POUR LES TESTS !" -ForegroundColor Green
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Yellow

# Attendre et afficher les logs du job
try {
    while ($job.State -eq "Running") {
        Receive-Job $job -Keep | Write-Host
        Start-Sleep -Seconds 1
    }
} finally {
    # Nettoyer le job
    Stop-Job $job -ErrorAction SilentlyContinue
    Remove-Job $job -ErrorAction SilentlyContinue
}
