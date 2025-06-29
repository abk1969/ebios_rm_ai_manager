# Script de sauvegarde automatique pour EBIOS AI Manager
# Usage: .\backup-component.ps1 -component "src/types/ebios.ts"

param(
    [Parameter(Mandatory=$true)]
    [string]$component
)

# Configuration
$date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupRoot = "backups/$date"

# Créer le dossier de backup
$backupDir = Join-Path $backupRoot (Split-Path (Split-Path $component -Parent) -Leaf)
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

# Nom du fichier de backup
$filename = Split-Path $component -Leaf
$backupFile = Join-Path $backupDir "$filename.backup"

# Vérifier que le fichier existe
if (-not (Test-Path $component)) {
    Write-Host "❌ ERREUR: Le fichier '$component' n'existe pas!" -ForegroundColor Red
    exit 1
}

# Copier le fichier
try {
    Copy-Item $component $backupFile -Force
    Write-Host "✅ Backup créé: $backupFile" -ForegroundColor Green
    
    # Créer un fichier de métadonnées
    $metadata = @{
        original = $component
        backup = $backupFile
        date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        size = (Get-Item $component).Length
        hash = (Get-FileHash $component -Algorithm SHA256).Hash
    }
    
    $metadataFile = Join-Path $backupDir "$filename.metadata.json"
    $metadata | ConvertTo-Json | Set-Content $metadataFile
    
    Write-Host "📋 Métadonnées sauvegardées: $metadataFile" -ForegroundColor Cyan
    
    # Log dans un fichier central
    $logFile = "backups/backup.log"
    $logEntry = "[$($metadata.date)] Backup: $component → $backupFile (SHA256: $($metadata.hash))"
    Add-Content -Path $logFile -Value $logEntry
    
} catch {
    Write-Host "❌ ERREUR lors du backup: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📁 Structure de backup:" -ForegroundColor Yellow
Get-ChildItem -Path $backupRoot -Recurse | ForEach-Object {
    $indent = "  " * ($_.FullName.Split('\').Count - $backupRoot.Split('\').Count - 1)
    Write-Host "$indent$($_.Name)"
} 