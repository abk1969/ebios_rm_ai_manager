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
   - Flask-based AI integration service
   - Machine learning and NLP capabilities
   - PostgreSQL integration for AI data storage

## Development Commands

### Frontend Development
```bash
npm run dev                    # Start development server (port 5173)
npm run build                  # Build for production (TypeScript + Vite)
npm run lint                   # ESLint validation
npm run preview               # Preview production build
```

### Testing
```bash
npm run test                   # Run Vitest unit tests
npm run test:ui              # Interactive test UI
npm run test:coverage        # Test coverage report
npm run test:realdata        # Test with real data scenarios
```

### Docker Development
```bash
docker-compose up -d         # Start all services
docker-compose logs -f       # View logs
```

### Firebase Deployment
```bash
npm run firebase:deploy      # Deploy Firestore rules and indexes
npm run deploy:production    # Full production deployment
```

### Database & Migration Scripts
```bash
npm run deploy:indexes       # Deploy Firestore indexes
npm run setup:data          # Setup test data
npm run create:professional  # Create professional missions
```

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

### Firebase Integration
- **Firestore** for mission data and workshop results
- **Authentication** with development mode bypass
- Real-time subscriptions for collaborative editing
- Security rules in `firestore.rules`

### AI Integration Architecture
- **Multi-agent system** with specialized agents for each workshop
- **Python AI Service** handles ML/NLP processing
- **Context-aware suggestions** based on current workshop and data
- **Semantic analysis** for content recommendations

### Component Architecture
- **Workshop-specific components** in `src/components/workshops/`
- **Reusable UI components** in `src/components/ui/`
- **Service layer** in `src/services/` for business logic
- **Type definitions** in `src/types/ebios.ts`

### Error Handling & Resilience
- **Circuit breaker pattern** for external service calls  
- **Fallback mechanisms** for AI service unavailability
- **Health monitoring** with `/api/monitoring/health` endpoint

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
- **Requirements**: See `python-ai-service/requirements.txt`
- **Models**: Transformers, scikit-learn, sentence-transformers

## Critical Configuration Files

- `vite.config.ts` - Frontend build configuration with security optimizations
- `docker-compose.yml` - Multi-service development environment
- `firestore.rules` - Database security rules
- `src/lib/firebase.ts` - Firebase initialization and configuration
- `api/server.js` - Express server with AI proxy and security middleware

## Security Considerations

- **API rate limiting** (100 requests/15min per IP)
- **CORS** configured for development and production origins
- **Helmet.js** security headers
- **Firebase security rules** for data access control
- **Environment variables** for sensitive configuration

## Testing Strategy

- **Unit tests** with Vitest and React Testing Library
- **Integration tests** for workshop workflows
- **Performance tests** for large datasets
- **ANSSI compliance tests** for methodology adherence
- **Real data validation** tests for production scenarios

## Deployment Options

1. **Local Development**: `npm run dev` + Docker Compose
2. **Firebase Hosting**: Static frontend with Firebase backend
3. **Google Cloud Run**: Containerized deployment for scalability
4. **Kubernetes**: Production cluster deployment (configs in `k8s/`)

When working on this codebase, focus on maintaining EBIOS RM methodology compliance, ensuring AI assistance enhances rather than replaces expert analysis, and preserving the multi-workshop data flow integrity.