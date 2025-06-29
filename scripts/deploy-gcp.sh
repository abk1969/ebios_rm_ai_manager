#!/bin/bash

# EBIOS AI Manager - GCP Deployment Script
# This script deploys the application to Google Cloud Platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID=${GCP_PROJECT_ID:-""}
REGION=${GCP_REGION:-"europe-west1"}
SERVICE_NAME="ebios-ai-service"

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

check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if gcloud is installed
    if ! command -v gcloud &> /dev/null; then
        log_error "gcloud CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check if firebase is installed
    if ! command -v firebase &> /dev/null; then
        log_error "Firebase CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check if docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    # Check if project ID is set
    if [ -z "$PROJECT_ID" ]; then
        log_error "GCP_PROJECT_ID environment variable is not set."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

setup_gcp() {
    log_info "Setting up GCP project..."
    
    # Set the project
    gcloud config set project $PROJECT_ID
    
    # Enable required APIs
    log_info "Enabling required APIs..."
    gcloud services enable cloudbuild.googleapis.com
    gcloud services enable run.googleapis.com
    gcloud services enable containerregistry.googleapis.com
    gcloud services enable firebase.googleapis.com
    gcloud services enable firestore.googleapis.com
    
    log_success "GCP setup completed"
}

build_and_push_docker() {
    log_info "Building and pushing Docker image..."
    
    # Build the Docker image
    docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME:latest ./python-ai-service/
    
    # Configure Docker to use gcloud as a credential helper
    gcloud auth configure-docker
    
    # Push the image
    docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest
    
    log_success "Docker image built and pushed"
}

deploy_cloud_run() {
    log_info "Deploying to Cloud Run..."
    
    # Replace PROJECT_ID in cloudrun.yaml
    sed "s/PROJECT_ID/$PROJECT_ID/g" cloudrun.yaml > cloudrun-deploy.yaml
    
    # Deploy to Cloud Run
    gcloud run services replace cloudrun-deploy.yaml --region=$REGION
    
    # Make the service publicly accessible
    gcloud run services add-iam-policy-binding $SERVICE_NAME \
        --region=$REGION \
        --member="allUsers" \
        --role="roles/run.invoker"
    
    # Get the service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)")
    
    # Clean up temporary file
    rm cloudrun-deploy.yaml
    
    log_success "Cloud Run service deployed at: $SERVICE_URL"
}

deploy_firestore() {
    log_info "Deploying Firestore configuration..."
    
    # Deploy Firestore indexes
    firebase deploy --only firestore:indexes --project $PROJECT_ID
    
    # Deploy Firestore rules
    firebase deploy --only firestore:rules --project $PROJECT_ID
    
    log_success "Firestore configuration deployed"
}

deploy_frontend() {
    log_info "Deploying frontend to Firebase Hosting..."
    
    # Install dependencies
    npm ci
    
    # Build the application
    npm run build
    
    # Deploy to Firebase Hosting
    firebase deploy --only hosting --project $PROJECT_ID
    
    log_success "Frontend deployed to Firebase Hosting"
}

main() {
    log_info "Starting EBIOS AI Manager deployment to GCP..."
    
    check_prerequisites
    setup_gcp
    build_and_push_docker
    deploy_cloud_run
    deploy_firestore
    deploy_frontend
    
    log_success "🎉 Deployment completed successfully!"
    log_info "Your application is now live on GCP"
}

# Run main function
main "$@"
