#!/bin/bash

# EBIOS AI Manager - GCP Environment Setup Script
# This script helps configure the environment for GCP deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

create_env_file() {
    log_info "Creating environment configuration file..."
    
    # Prompt for project details
    read -p "Enter your GCP Project ID: " PROJECT_ID
    read -p "Enter your preferred region (default: europe-west1): " REGION
    REGION=${REGION:-"europe-west1"}
    
    # Create .env file
    cat > .env.gcp << EOF
# GCP Configuration for EBIOS AI Manager
GCP_PROJECT_ID=$PROJECT_ID
GCP_REGION=$REGION
FIREBASE_PROJECT_ID=$PROJECT_ID

# Service Configuration
CLOUD_RUN_SERVICE_NAME=ebios-ai-service
CLOUD_RUN_MEMORY=2Gi
CLOUD_RUN_CPU=1000m
CLOUD_RUN_MAX_INSTANCES=10

# Environment
ENVIRONMENT=production
NODE_ENV=production
VITE_ENVIRONMENT=production

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=$PROJECT_ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=$PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=$PROJECT_ID.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# AI Service Configuration
VITE_AI_SERVICE_URL=https://ebios-ai-service-hash-$REGION.a.run.app
AI_SERVICE_PORT=8080

# Security Configuration
VITE_ENABLE_ENCRYPTION=true
VITE_AUDIT_ENABLED=true
VITE_ANSSI_VALIDATION=true
EOF

    log_success "Environment file created: .env.gcp"
    log_warning "Please update the Firebase configuration values in .env.gcp"
}

setup_firebase_project() {
    log_info "Setting up Firebase project..."
    
    # Check if firebase is logged in
    if ! firebase projects:list &> /dev/null; then
        log_info "Please log in to Firebase..."
        firebase login
    fi
    
    # Initialize Firebase if not already done
    if [ ! -f "firebase.json" ]; then
        log_info "Initializing Firebase project..."
        firebase init
    else
        log_info "Firebase already initialized"
    fi
    
    log_success "Firebase setup completed"
}

setup_gcp_auth() {
    log_info "Setting up GCP authentication..."
    
    # Check if gcloud is authenticated
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -n 1 &> /dev/null; then
        log_info "Please authenticate with Google Cloud..."
        gcloud auth login
    fi
    
    # Set application default credentials
    gcloud auth application-default login
    
    log_success "GCP authentication setup completed"
}

create_service_account() {
    log_info "Creating service account for deployment..."
    
    source .env.gcp
    
    # Create service account
    gcloud iam service-accounts create ebios-deployer \
        --display-name="EBIOS AI Manager Deployer" \
        --description="Service account for deploying EBIOS AI Manager" \
        --project=$GCP_PROJECT_ID
    
    # Grant necessary roles
    gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
        --member="serviceAccount:ebios-deployer@$GCP_PROJECT_ID.iam.gserviceaccount.com" \
        --role="roles/run.admin"
    
    gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
        --member="serviceAccount:ebios-deployer@$GCP_PROJECT_ID.iam.gserviceaccount.com" \
        --role="roles/storage.admin"
    
    gcloud projects add-iam-policy-binding $GCP_PROJECT_ID \
        --member="serviceAccount:ebios-deployer@$GCP_PROJECT_ID.iam.gserviceaccount.com" \
        --role="roles/cloudbuild.builds.editor"
    
    # Create and download key
    gcloud iam service-accounts keys create gcp-service-account-key.json \
        --iam-account=ebios-deployer@$GCP_PROJECT_ID.iam.gserviceaccount.com
    
    log_success "Service account created and key downloaded"
    log_warning "Keep gcp-service-account-key.json secure and add it to your CI/CD secrets"
}

main() {
    log_info "Setting up GCP environment for EBIOS AI Manager..."
    
    create_env_file
    setup_gcp_auth
    setup_firebase_project
    create_service_account
    
    log_success "🎉 GCP environment setup completed!"
    log_info "Next steps:"
    log_info "1. Update Firebase configuration in .env.gcp"
    log_info "2. Add gcp-service-account-key.json to your GitHub secrets"
    log_info "3. Run ./scripts/deploy-gcp.sh to deploy"
}

# Run main function
main "$@"
