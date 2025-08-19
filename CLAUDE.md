# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **EBIOS AI Manager**, a comprehensive cybersecurity risk management platform that implements the French ANSSI EBIOS RM v1.5 methodology. The system is designed for cybersecurity auditors and risk managers to conduct structured risk analysis through 5 standardized workshops.

### Architecture

The system uses a **microservices architecture** with three main components:

1. **Frontend (React/TypeScript)** - Port 5173/80
   - React 18 with TypeScript
   - Redux Toolkit for state management  
   - Tailwind CSS for styling
   - Firebase integration for authentication and data storage

2. **API Backend (Node.js)** - Port 3000
   - Express.js server with security middleware
   - AI proxy service routing to Python AI service
   - Routes: agents, auth, missions, monitoring, reports, workshops

3. **Python AI Service** - Port 8081
   - FastAPI/Flask-based AI integration service
   - Machine learning and NLP capabilities with transformers, scikit-learn
   - PostgreSQL integration for AI data storage
   - Ollama integration for local offline AI models (mistral:7b, llama3:8b)

## Development Commands

### Installation & Setup
```bash
# Automated installation (recommended)
installation/scripts/install-windows.bat     # Windows
installation/scripts/install-linux.sh        # Linux

# Manual installation validation
python installation/validation/validate-system-requirements-windows.py

# Development setup
npm install                                   # Install frontend dependencies
cd api && npm install                        # Install backend dependencies
cd python-ai-service && uv sync             # Install Python AI dependencies with UV
```

### Frontend Development
```bash
npm run dev                    # Start development server (port 5173)
npm run build                  # Build for production (TypeScript + Vite)
npm run lint                   # ESLint validation
npm run preview               # Preview production build
```

### Backend Services
```bash
# API Backend
cd api && npm run dev         # Start API server with nodemon
cd api && npm run start       # Start API server in production
cd api && npm run test:health # Test API health endpoint

# Python AI Service
cd python-ai-service && python app.py        # Start AI service
cd python-ai-service && uvicorn main:app     # Start with uvicorn
```

### Testing
```bash
npm run test                   # Run Vitest unit tests
npm run test:ui               # Interactive test UI
npm run test:coverage         # Test coverage report
npm run test:realdata         # Test with real data scenarios
npm run test:agents           # Test AI agent system
npm run test:anssi-compliance # Test ANSSI methodology compliance
npm run test:mitre-attack     # Test MITRE ATT&CK integration
npm run test:regression       # Run regression tests
npm run test:performance      # Run performance tests

# Run specific tests
vitest run src/test/services/EbiosRMMetricsService.test.ts  # Run single test file
vitest run --grep "specific test name"                      # Run tests matching pattern
```

### Docker Development
```bash
docker-compose up -d         # Start all services
docker-compose logs -f       # View logs
docker-compose down          # Stop all services
```

### Specialized Scripts
```bash
npm run create:professional:full  # Generate professional test missions
npm run test:auto-generator       # Test auto mission generator
npm run migrate:agentic           # Migrate to agentic AI architecture
npm run validate:architecture     # Validate system architecture
npm run audit:anssi              # Run ANSSI compliance audit
npm run validate:gemini-model    # Validate Gemini AI model configuration
npm run validate:metrics         # Validate metrics transparency
```

## Installation System

The project includes a comprehensive **automated installation system** optimized for the Club EBIOS tender:

### Key Installation Features
- **System validation** before installation (Python 3.11+, Node.js 18+, RAM 8GB+, disk 25GB+)
- **UV package manager** for Python dependencies (preferred over pip)
- **Ollama local AI models** for offline mode (critical requirement)
- **Robust error handling** with detailed logging
- **Multi-platform support** (Windows/Linux)

### Installation Process
1. **System validation** with `validate-system-requirements-windows.py`
2. **Python detection** with fallback to Microsoft Store installation
3. **UV installation** for Python package management
4. **Ollama setup** with mistral:7b and llama3:8b models (~9GB)
5. **Dependencies installation** (Node.js + Python with UV)
6. **Docker services startup**
7. **Functional testing** of all services

## Core Business Domain: EBIOS RM Methodology

The application implements the 5-workshop EBIOS RM methodology:

### Workshop 1: Security Foundation (Socle de Sécurité)
- **Business Values**: Critical business assets and their security requirements
- **Essential Assets**: Technical and informational assets
- **Supporting Assets**: Infrastructure supporting essential assets  
- **Dreaded Events**: Potential security incidents with gravity scales (1-4)

### Workshop 2: Risk Sources (Sources de Risque)
- **Risk Sources**: 7 ANSSI-defined categories (cybercriminals, nation-states, insiders, etc.)
- **Exposure Assessment**: Analysis of organizational exposure to each source
- **Motivation Levels**: Evaluation of attacker motivation

### Workshop 3: Strategic Scenarios (Scénarios Stratégiques)
- **Attack Paths**: High-level attack strategies
- **Risk Calculation**: Automated likelihood × gravity calculations
- **Risk Matrix**: ANSSI-compliant risk visualization

### Workshop 4: Operational Scenarios (Scénarios Opérationnels)  
- **Detailed Attack Techniques**: Technical implementation of strategic scenarios
- **Kill Chain Analysis**: Step-by-step attack progression
- **Technical Likelihood**: Assessment of attack feasibility

### Workshop 5: Risk Treatment (Plan de Traitement)
- **Security Measures**: Preventive, detective, corrective, and compensatory controls
- **Treatment Strategies**: Avoid, Reduce, Transfer, Accept
- **Residual Risk**: Calculation after measure implementation

## Key Technical Patterns

### State Management
- **Redux Toolkit** with feature-based slices in `src/store/slices/`
- Optimized selectors in `src/store/selectors/` (avoid creating selectors in components)
- Immer for immutable updates

### AI Integration Architecture
- **Multi-agent system** with specialized agents for each workshop
- **Python AI Service** handles ML/NLP processing
- **Ollama local models** for offline operation (critical for tender)
- **Context-aware suggestions** based on current workshop and data
- **Agentic AI architecture** with autonomous reasoning agents

### Offline Mode (Critical for Club EBIOS)
- **Ollama integration** with local models (mistral:7b, llama3:8b)
- **No internet dependency** for core AI functionality
- **Model validation** during installation process
- **Fallback mechanisms** when online AI services unavailable

### Component Architecture
- **Workshop-specific components** in `src/components/workshops/`
- **Reusable UI components** in `src/components/ui/` (shadcn/ui based)
- **Service layer** in `src/services/` for business logic
- **Type definitions** in `src/types/ebios.ts` with extensive EBIOS domain modeling

### Error Handling & Resilience
- **Circuit breaker pattern** for external service calls  
- **Fallback mechanisms** for AI service unavailability
- **Health monitoring** with `/api/monitoring/health` endpoint
- **Installation validation** with comprehensive system checks

## Development Environment

### Authentication
- **Development mode**: Use any email/password combination
- **Production**: Firebase Authentication required
- Default dev users: `admin@ebios.dev/admin123`, `auditor@ebios.dev/audit123`

### Database Setup
- **Local**: PostgreSQL via Docker Compose
- **Production**: Firebase Firestore + PostgreSQL for AI data
- Schema initialization via `api/init.sql`

### AI Service Dependencies
- **Python 3.11+** required for AI service
- **UV package manager** for dependency management (preferred over pip)
- **Core dependencies**: flask, pydantic, sqlalchemy, psycopg2-binary, requests, pandas, numpy
- **AI/ML libraries**: openai for external AI service integration
- **Ollama models**: mistral:7b (4GB), llama3:8b (5GB) for offline operation

## Critical Configuration Files

- `vite.config.ts` - Frontend build configuration with security optimizations
- `docker-compose.yml` - Multi-service development environment
- `installation/` - Complete automated installation system
- `src/lib/firebase.ts` - Firebase initialization and configuration
- `api/server.js` - Express server with AI proxy and security middleware
- `python-ai-service/pyproject.toml` - Python AI service dependencies with UV
- `python-ai-service/requirements.txt` - Legacy Python dependencies

## Security Considerations

- **API rate limiting** (100 requests/15min per IP)
- **CORS** configured for development and production origins
- **Helmet.js** security headers
- **Firebase security rules** for data access control
- **Environment variables** for sensitive configuration
- **ANSSI compliance** validation throughout

## Testing Strategy

- **Unit tests** with Vitest and React Testing Library
- **Integration tests** for workshop workflows
- **Performance tests** for large datasets
- **ANSSI compliance tests** for methodology adherence
- **Real data validation** tests for production scenarios
- **AI agent testing** for autonomous system validation

## Deployment Options

1. **Local Development**: `npm run dev` + Docker Compose
2. **Automated Installation**: Platform-specific scripts with full validation
3. **Firebase Hosting**: Static frontend with Firebase backend
4. **Google Cloud Run**: Containerized deployment for scalability
5. **Kubernetes**: Production cluster deployment (configs in `k8s/`)

## Special Considerations for Club EBIOS

- **Offline mode is mandatory** - Ollama integration ensures AI functionality without internet
- **Installation must be foolproof** - Comprehensive validation and error handling
- **ANSSI compliance** - Built-in validation and audit capabilities
- **Professional-grade security** - Rate limiting, security headers, audit trails

## Development Patterns & Best Practices

### File Structure Organization
- **Redux slices**: Located in `src/store/slices/` with corresponding selectors in `src/store/selectors/`
- **Firebase services**: Each workshop has dedicated service files in `src/services/firebase/`
- **AI services**: Centralized in `src/services/ai/` with workshop-specific implementations
- **Reusable components**: Generic UI components in `src/components/ui/`, business components in feature directories

### Common Development Workflows
- **Adding new workshop features**: Update Redux slice, Firebase service, and corresponding React components
- **AI integration**: Extend existing AI services rather than creating new ones, maintain offline compatibility
- **Testing new features**: Use `npm run test:realdata` for integration tests with actual workshop data
- **Performance issues**: Use `npm run test:performance` and check Redis cache effectiveness

### Debugging & Troubleshooting
- **Firebase issues**: Use `src/components/debug/FirebaseDebugPanel.tsx` for connection diagnostics
- **AI service problems**: Check Python service logs via `docker-compose logs python-ai-service`
- **State management**: Use Redux DevTools and `src/components/debug/ReduxSelectorDiagnostic.tsx`
- **Installation problems**: Run validation scripts in `installation/validation/`

When working on this codebase, focus on maintaining EBIOS RM methodology compliance, ensuring AI assistance enhances rather than replaces expert analysis, preserving offline functionality, and maintaining the multi-workshop data flow integrity.