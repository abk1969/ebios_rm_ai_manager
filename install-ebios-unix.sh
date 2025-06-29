#!/bin/bash

# ========================================================================
# EBIOS AI MANAGER - INSTALLATEUR AUTOMATIQUE LINUX/MAC
# Installation simplifiée pour Risk Managers
# ========================================================================

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Variables globales
INSTALL_DIR="$HOME/EBIOS_AI_Manager"
LOGFILE="$HOME/ebios_installation_$(date +%Y%m%d_%H%M%S).log"

# Fonction de logging
log() {
    echo -e "$1"
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOGFILE"
}

# Fonction pour détecter l'OS
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    else
        echo "unknown"
    fi
}

# Fonction d'installation pour Linux
install_linux() {
    log "${BLUE}🐧 Installation pour Linux détectée${NC}"
    
    # Détecter la distribution
    if command -v apt-get &> /dev/null; then
        PACKAGE_MANAGER="apt"
        UPDATE_CMD="sudo apt-get update"
        INSTALL_CMD="sudo apt-get install -y"
    elif command -v yum &> /dev/null; then
        PACKAGE_MANAGER="yum"
        UPDATE_CMD="sudo yum update -y"
        INSTALL_CMD="sudo yum install -y"
    elif command -v dnf &> /dev/null; then
        PACKAGE_MANAGER="dnf"
        UPDATE_CMD="sudo dnf update -y"
        INSTALL_CMD="sudo dnf install -y"
    elif command -v pacman &> /dev/null; then
        PACKAGE_MANAGER="pacman"
        UPDATE_CMD="sudo pacman -Sy"
        INSTALL_CMD="sudo pacman -S --noconfirm"
    else
        log "${RED}❌ Gestionnaire de paquets non supporté${NC}"
        exit 1
    fi
    
    log "${GREEN}✅ Gestionnaire de paquets détecté: $PACKAGE_MANAGER${NC}"
    
    # Mise à jour du système
    log "${YELLOW}📦 Mise à jour du système...${NC}"
    $UPDATE_CMD
    
    # Installation des dépendances de base
    log "${YELLOW}📦 Installation des dépendances de base...${NC}"
    if [ "$PACKAGE_MANAGER" = "apt" ]; then
        $INSTALL_CMD curl wget git build-essential
    elif [ "$PACKAGE_MANAGER" = "yum" ] || [ "$PACKAGE_MANAGER" = "dnf" ]; then
        $INSTALL_CMD curl wget git gcc gcc-c++ make
    elif [ "$PACKAGE_MANAGER" = "pacman" ]; then
        $INSTALL_CMD curl wget git base-devel
    fi
}

# Fonction d'installation pour macOS
install_macos() {
    log "${BLUE}🍎 Installation pour macOS détectée${NC}"
    
    # Vérifier si Homebrew est installé
    if ! command -v brew &> /dev/null; then
        log "${YELLOW}📦 Installation de Homebrew...${NC}"
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # Ajouter Homebrew au PATH
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    else
        log "${GREEN}✅ Homebrew déjà installé${NC}"
    fi
    
    # Mise à jour de Homebrew
    log "${YELLOW}📦 Mise à jour de Homebrew...${NC}"
    brew update
}

# Fonction d'installation de Node.js
install_nodejs() {
    log "${YELLOW}📦 Installation de Node.js...${NC}"
    
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        log "${GREEN}✅ Node.js déjà installé: $node_version${NC}"
        return 0
    fi
    
    # Installation via Node Version Manager (nvm)
    if ! command -v nvm &> /dev/null; then
        log "${BLUE}Installation de NVM...${NC}"
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        
        # Charger nvm
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    fi
    
    # Installer la dernière version LTS de Node.js
    nvm install --lts
    nvm use --lts
    nvm alias default lts/*
    
    log "${GREEN}✅ Node.js installé: $(node --version)${NC}"
}

# Fonction d'installation de Python
install_python() {
    log "${YELLOW}📦 Installation de Python...${NC}"
    
    if command -v python3 &> /dev/null; then
        local python_version=$(python3 --version)
        log "${GREEN}✅ Python déjà installé: $python_version${NC}"
        return 0
    fi
    
    local os=$(detect_os)
    if [ "$os" = "linux" ]; then
        if [ "$PACKAGE_MANAGER" = "apt" ]; then
            $INSTALL_CMD python3 python3-pip python3-venv
        elif [ "$PACKAGE_MANAGER" = "yum" ] || [ "$PACKAGE_MANAGER" = "dnf" ]; then
            $INSTALL_CMD python3 python3-pip
        elif [ "$PACKAGE_MANAGER" = "pacman" ]; then
            $INSTALL_CMD python python-pip
        fi
    elif [ "$os" = "macos" ]; then
        brew install python
    fi
    
    log "${GREEN}✅ Python installé: $(python3 --version)${NC}"
}

# Fonction principale d'installation
main() {
    clear
    echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║                                                              ║${NC}"
    echo -e "${PURPLE}║        🛡️ EBIOS AI MANAGER - INSTALLATEUR UNIX              ║${NC}"
    echo -e "${PURPLE}║                                                              ║${NC}"
    echo -e "${PURPLE}║        Installation automatique pour Risk Managers          ║${NC}"
    echo -e "${PURPLE}║                                                              ║${NC}"
    echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    log "${BLUE}🚀 Démarrage de l'installation EBIOS AI Manager${NC}"
    log "${BLUE}📝 Log d'installation: $LOGFILE${NC}"
    
    # Détecter l'OS
    local os=$(detect_os)
    if [ "$os" = "unknown" ]; then
        log "${RED}❌ Système d'exploitation non supporté: $OSTYPE${NC}"
        exit 1
    fi
    
    # Vérifier la connexion Internet
    log "${BLUE}🌐 Vérification de la connexion Internet...${NC}"
    if ! ping -c 1 google.com &> /dev/null; then
        log "${RED}❌ Connexion Internet requise pour l'installation${NC}"
        exit 1
    fi
    log "${GREEN}✅ Connexion Internet OK${NC}"
    
    # Installation selon l'OS
    if [ "$os" = "linux" ]; then
        install_linux
    elif [ "$os" = "macos" ]; then
        install_macos
    fi
    
    # Installation des outils de développement
    install_nodejs
    install_python
    
    # Installation de Git (si pas déjà installé)
    if ! command -v git &> /dev/null; then
        log "${YELLOW}📦 Installation de Git...${NC}"
        if [ "$os" = "linux" ]; then
            $INSTALL_CMD git
        elif [ "$os" = "macos" ]; then
            brew install git
        fi
    else
        log "${GREEN}✅ Git déjà installé: $(git --version)${NC}"
    fi
    
    # Téléchargement de l'application
    log "${BLUE}📥 Téléchargement de EBIOS AI Manager...${NC}"
    
    if [ -d "$INSTALL_DIR" ]; then
        log "${YELLOW}⚠️ Dossier existant détecté. Sauvegarde...${NC}"
        mv "$INSTALL_DIR" "${INSTALL_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
    fi
    
    git clone https://github.com/abk1969/Ebios_AI_manager.git "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    
    # Configuration de l'environnement
    log "${BLUE}⚙️ Configuration de l'environnement...${NC}"
    
    # Installation des dépendances Node.js
    log "${YELLOW}📦 Installation des dépendances Node.js...${NC}"
    npm install
    
    # Configuration Python
    log "${YELLOW}📦 Configuration de l'environnement Python...${NC}"
    cd python-ai-service
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements-cloudrun.txt
    cd ..
    
    # Installation de Firebase CLI
    log "${YELLOW}📦 Installation de Firebase CLI...${NC}"
    npm install -g firebase-tools || log "${YELLOW}⚠️ Firebase CLI installation échouée (optionnel)${NC}"
    
    # Configuration de l'environnement local
    log "${YELLOW}⚙️ Configuration des variables d'environnement...${NC}"
    if [ -f "setup-local-environment.sh" ]; then
        chmod +x setup-local-environment.sh
        ./setup-local-environment.sh
    else
        # Configuration manuelle
        cat > .env.local << EOF
NODE_ENV=development
VITE_ENVIRONMENT=local
VITE_AI_SERVICE_URL=http://localhost:8080
VITE_FRONTEND_URL=http://localhost:5173
VITE_USE_FIREBASE_EMULATORS=true
VITE_DEBUG_MODE=true
EOF
    fi
    
    # Rendre les scripts exécutables
    chmod +x *.sh 2>/dev/null || true
    
    # Créer un script de démarrage
    log "${BLUE}🔗 Création du script de démarrage...${NC}"
    cat > "$HOME/start-ebios.sh" << EOF
#!/bin/bash
cd "$INSTALL_DIR"
echo "🚀 Démarrage de EBIOS AI Manager..."
echo "🌐 L'application sera accessible sur: http://localhost:5173"
npm run dev
EOF
    chmod +x "$HOME/start-ebios.sh"
    
    # Créer un alias dans le shell
    local shell_rc=""
    if [ -n "$ZSH_VERSION" ]; then
        shell_rc="$HOME/.zshrc"
    elif [ -n "$BASH_VERSION" ]; then
        shell_rc="$HOME/.bashrc"
    fi
    
    if [ -n "$shell_rc" ]; then
        echo "alias start-ebios='$HOME/start-ebios.sh'" >> "$shell_rc"
        log "${GREEN}✅ Alias 'start-ebios' ajouté à $shell_rc${NC}"
    fi
    
    # Test de l'installation
    log "${BLUE}🧪 Test de l'installation...${NC}"
    npm run build > /dev/null 2>&1 || log "${YELLOW}⚠️ Le build de test a échoué, mais l'installation peut fonctionner${NC}"
    
    # Résumé de l'installation
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                              ║${NC}"
    echo -e "${GREEN}║        🎉 INSTALLATION TERMINÉE AVEC SUCCÈS !               ║${NC}"
    echo -e "${GREEN}║                                                              ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}✅ EBIOS AI Manager installé dans: $INSTALL_DIR${NC}"
    echo -e "${GREEN}✅ Script de démarrage créé: $HOME/start-ebios.sh${NC}"
    echo -e "${GREEN}✅ Environnement configuré${NC}"
    echo ""
    echo -e "${BLUE}🚀 POUR DÉMARRER L'APPLICATION:${NC}"
    echo -e "   ${YELLOW}Option 1:${NC} $HOME/start-ebios.sh"
    echo -e "   ${YELLOW}Option 2:${NC} start-ebios (après redémarrage du terminal)"
    echo -e "   ${YELLOW}Option 3:${NC} cd $INSTALL_DIR && npm run dev"
    echo ""
    echo -e "${BLUE}🌐 L'application sera accessible sur: http://localhost:5173${NC}"
    echo ""
    echo -e "${BLUE}📚 DOCUMENTATION:${NC}"
    echo "   • README.md - Guide complet d'utilisation"
    echo "   • GUIDE_RISK_MANAGERS.md - Guide spécifique aux risk managers"
    echo "   • TROUBLESHOOTING.md - Guide de dépannage"
    echo ""
    echo -e "${BLUE}📞 SUPPORT:${NC}"
    echo "   • GitHub: https://github.com/abk1969/Ebios_AI_manager"
    echo "   • Issues: https://github.com/abk1969/Ebios_AI_manager/issues"
    echo ""
    
    # Proposer de démarrer l'application
    read -p "$(echo -e ${YELLOW}Voulez-vous démarrer l'application maintenant ? ${NC}[y/N]: )" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log "${BLUE}🚀 Démarrage de EBIOS AI Manager...${NC}"
        cd "$INSTALL_DIR"
        npm run dev &
        sleep 3
        
        # Ouvrir le navigateur
        if command -v xdg-open &> /dev/null; then
            xdg-open http://localhost:5173
        elif command -v open &> /dev/null; then
            open http://localhost:5173
        fi
    fi
    
    log "${GREEN}🎯 Installation terminée avec succès !${NC}"
    log "${BLUE}📝 Consultez $LOGFILE pour les détails de l'installation${NC}"
}

# Vérifier si le script est exécuté avec les bonnes permissions
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}❌ Ne pas exécuter ce script en tant que root${NC}"
    echo -e "${YELLOW}🔧 Exécutez: ./install-ebios-unix.sh${NC}"
    exit 1
fi

# Exécuter l'installation
main "$@"
