/**
 * 🧪 TESTS DU SYSTÈME DE QUESTIONS COMPLEXES EN TEMPS RÉEL
 * Tests d'intégration pour valider l'ÉTAPE 2.2.2
 */

import { 
  ComplexQuestionGeneratorService,
  QuestionGenerationRequest,
  DifficultyLevel
} from '../ComplexQuestionGeneratorService';
import { 
  RealTimeScoringService,
  UserResponse
} from '../RealTimeScoringService';
import { 
  ExpertFeedbackService
} from '../ExpertFeedbackService';
import { 
  ComplexQuestionOrchestrator,
  SessionConfiguration
} from '../ComplexQuestionOrchestrator';
import { EbiosExpertProfile } from '../../../../../infrastructure/a2a/types/AgentCardTypes';

describe('🧠 Système de Questions Complexes en Temps Réel - ÉTAPE 2.2.2', () => {
  let questionGenerator: ComplexQuestionGeneratorService;
  let scoringService: RealTimeScoringService;
  let feedbackService: ExpertFeedbackService;
  let orchestrator: ComplexQuestionOrchestrator;
  let mockUserProfile: EbiosExpertProfile;

  beforeEach(() => {
    questionGenerator = ComplexQuestionGeneratorService.getInstance();
    scoringService = RealTimeScoringService.getInstance();
    feedbackService = ExpertFeedbackService.getInstance();
    orchestrator = ComplexQuestionOrchestrator.getInstance();

    mockUserProfile = {
      id: 'test-user-123',
      name: 'Dr. Test Expert',
      role: 'EBIOS RM Expert',
      experience: {
        ebiosYears: 8,
        totalYears: 12,
        projectsCompleted: 25
      },
      specializations: ['threat_intelligence', 'risk_management', 'healthcare_security'],
      certifications: ['CISSP', 'ANSSI'],
      sector: 'santé',
      organizationType: 'CHU',
      preferredComplexity: 'expert',
      learningStyle: 'analytical'
    };
  });

  describe('🎯 Génération de Questions Complexes', () => {
    test('devrait générer une question complexe pour Workshop 1', async () => {
      const request: QuestionGenerationRequest = {
        workshopId: 1,
        userProfile: mockUserProfile,
        context: {
          workshopId: 1,
          organizationType: 'CHU Métropolitain',
          sector: 'santé',
          complexity: 'expert',
          userProfile: mockUserProfile
        },
        difficulty: 'expert',
        count: 1,
        adaptToUserLevel: true
      };

      const response = await questionGenerator.generateComplexQuestions(request);

      expect(response).toBeDefined();
      expect(response.questions).toHaveLength(1);
      expect(response.questions[0]).toMatchObject({
        workshopId: 1,
        difficulty: 'expert',
        category: 'asset_identification'
      });
      expect(response.questions[0].requirements).toHaveLength(3);
      expect(response.questions[0].scoring.totalPoints).toBe(100);
      expect(response.metadata.confidence).toBeGreaterThan(0.8);
    });

    test('devrait générer une question complexe pour Workshop 2', async () => {
      const request: QuestionGenerationRequest = {
        workshopId: 2,
        userProfile: mockUserProfile,
        context: {
          workshopId: 2,
          organizationType: 'CHU Métropolitain',
          sector: 'santé',
          complexity: 'expert',
          userProfile: mockUserProfile
        },
        difficulty: 'expert',
        count: 1,
        focusAreas: ['threat_modeling', 'threat_intelligence']
      };

      const response = await questionGenerator.generateComplexQuestions(request);

      expect(response).toBeDefined();
      expect(response.questions).toHaveLength(1);
      expect(response.questions[0]).toMatchObject({
        workshopId: 2,
        difficulty: 'expert',
        category: 'risk_sources',
        type: 'threat_modeling'
      });
      expect(response.questions[0].context.sector).toBe('santé');
      expect(response.questions[0].hints).toHaveLength(3);
    });

    test('devrait adapter la difficulté selon le profil utilisateur', async () => {
      const beginnerProfile = {
        ...mockUserProfile,
        experience: { ebiosYears: 1, totalYears: 2, projectsCompleted: 3 },
        specializations: [],
        certifications: []
      };

      const request: QuestionGenerationRequest = {
        workshopId: 1,
        userProfile: beginnerProfile,
        context: {
          workshopId: 1,
          organizationType: 'CHU Métropolitain',
          sector: 'santé',
          complexity: 'intermediate',
          userProfile: beginnerProfile
        },
        difficulty: 'intermediate',
        count: 1,
        adaptToUserLevel: true
      };

      const response = await questionGenerator.generateComplexQuestions(request);

      expect(response.questions[0].difficulty).toBe('intermediate');
      expect(response.metadata.adaptations).toContain('guidance_enhanced');
    });
  });

  describe('🎯 Scoring en Temps Réel', () => {
    test('devrait scorer une réponse automatiquement', async () => {
      const question = (await questionGenerator.generateComplexQuestions({
        workshopId: 1,
        userProfile: mockUserProfile,
        context: {
          workshopId: 1,
          organizationType: 'CHU',
          sector: 'santé',
          complexity: 'expert',
          userProfile: mockUserProfile
        },
        difficulty: 'expert',
        count: 1
      })).questions[0];

      const userResponse: UserResponse = {
        questionId: question.id,
        userId: mockUserProfile.id,
        responses: {
          'req_1': 'Analyse détaillée des 5 biens essentiels avec matrice d\'interdépendance...',
          'req_2': 'Calculs financiers: SIH = 1.2M€/jour, PACS = 800k€/jour...',
          'req_3': 'Stratégie de protection hiérarchisée basée sur criticité...'
        },
        timeSpent: 2400, // 40 minutes
        hintsUsed: [1],
        submissionTime: new Date(),
        isPartial: false
      };

      const score = await scoringService.scoreResponse(question, userResponse);

      expect(score).toBeDefined();
      expect(score.totalScore).toBeGreaterThan(0);
      expect(score.percentage).toBeGreaterThan(0);
      expect(score.breakdown).toHaveLength(3);
      expect(score.validationStatus.isValid).toBe(true);
      expect(score.timeSpent).toBe(2400);
    });

    test('devrait détecter les erreurs de validation', async () => {
      const question = (await questionGenerator.generateComplexQuestions({
        workshopId: 1,
        userProfile: mockUserProfile,
        context: {
          workshopId: 1,
          organizationType: 'CHU',
          sector: 'santé',
          complexity: 'expert',
          userProfile: mockUserProfile
        },
        difficulty: 'expert',
        count: 1
      })).questions[0];

      const invalidResponse: UserResponse = {
        questionId: question.id,
        userId: mockUserProfile.id,
        responses: {
          'req_1': '', // Réponse vide
          'req_2': 'Calculs incorrects',
          'req_3': 'Stratégie incomplète'
        },
        timeSpent: 300,
        hintsUsed: [],
        submissionTime: new Date(),
        isPartial: true
      };

      const score = await scoringService.scoreResponse(question, invalidResponse);

      expect(score.validationStatus.isValid).toBe(false);
      expect(score.validationStatus.errors.length).toBeGreaterThan(0);
      expect(score.percentage).toBeLessThan(50);
    });
  });

  describe('👨‍🏫 Feedback Expert', () => {
    test('devrait générer un feedback expert personnalisé', async () => {
      const question = (await questionGenerator.generateComplexQuestions({
        workshopId: 2,
        userProfile: mockUserProfile,
        context: {
          workshopId: 2,
          organizationType: 'CHU',
          sector: 'santé',
          complexity: 'expert',
          userProfile: mockUserProfile
        },
        difficulty: 'expert',
        count: 1
      })).questions[0];

      const userResponse: UserResponse = {
        questionId: question.id,
        userId: mockUserProfile.id,
        responses: {
          'req_threat_profiling': 'Analyse des groupes LockBit 4.0, APT40...',
          'req_attack_scenarios': 'Scénarios avec kill chain MITRE ATT&CK...',
          'req_detection_strategy': 'Stratégie de détection basée sur IOC...'
        },
        timeSpent: 3000,
        hintsUsed: [],
        submissionTime: new Date(),
        isPartial: false
      };

      const score = await scoringService.scoreResponse(question, userResponse);
      const feedback = await feedbackService.generateExpertFeedback(
        question,
        userResponse,
        score,
        mockUserProfile
      );

      expect(feedback).toBeDefined();
      expect(feedback.expertProfile.name).toBeDefined();
      expect(feedback.feedback.immediate.summary).toBeDefined();
      expect(feedback.feedback.detailed.strengths).toBeDefined();
      expect(feedback.feedback.methodological.ebiosPhase).toBe('Atelier 2');
      expect(feedback.personalization.userLevel).toBe('expert');
    });

    test('devrait adapter le style de communication selon le persona', async () => {
      const question = (await questionGenerator.generateComplexQuestions({
        workshopId: 1,
        userProfile: mockUserProfile,
        context: {
          workshopId: 1,
          organizationType: 'CHU',
          sector: 'santé',
          complexity: 'expert',
          userProfile: mockUserProfile
        },
        difficulty: 'expert',
        count: 1
      })).questions[0];

      const userResponse: UserResponse = {
        questionId: question.id,
        userId: mockUserProfile.id,
        responses: { 'req_1': 'Excellente analyse' },
        timeSpent: 1800,
        hintsUsed: [],
        submissionTime: new Date(),
        isPartial: false
      };

      const score = await scoringService.scoreResponse(question, userResponse);
      const feedback = await feedbackService.generateExpertFeedback(
        question,
        userResponse,
        score,
        mockUserProfile
      );

      expect(feedback.expertProfile.communicationStyle).toBeOneOf([
        'supportive', 'analytical', 'inspiring', 'direct'
      ]);
      expect(feedback.deliveryMethod.personalization).toBe(true);
    });
  });

  describe('🎭 Orchestration Complète', () => {
    test('devrait orchestrer une session complète de questions', async () => {
      const configuration: SessionConfiguration = {
        difficulty: 'expert',
        questionCount: 2,
        timeLimit: 3600,
        focusAreas: ['asset_identification'],
        adaptiveMode: true,
        realTimeFeedback: true,
        expertGuidance: true,
        progressiveComplexity: false
      };

      // Démarrage de session
      const session = await orchestrator.startQuestionSession(
        mockUserProfile.id,
        1,
        mockUserProfile,
        configuration
      );

      expect(session).toBeDefined();
      expect(session.state.questions).toHaveLength(2);
      expect(session.state.status).toBe('active');
      expect(session.configuration.difficulty).toBe('expert');

      // Première réponse
      const firstResponse: UserResponse = {
        questionId: session.state.questions[0].id,
        userId: mockUserProfile.id,
        responses: { 'req_1': 'Première réponse détaillée' },
        timeSpent: 1800,
        hintsUsed: [],
        submissionTime: new Date(),
        isPartial: false
      };

      const firstResult = await orchestrator.processQuestionResponse(
        session.sessionId,
        firstResponse
      );

      expect(firstResult.score).toBeDefined();
      expect(firstResult.feedback).toBeDefined();
      expect(firstResult.nextQuestion).toBeDefined();
      expect(firstResult.sessionComplete).toBe(false);

      // Deuxième réponse
      const secondResponse: UserResponse = {
        questionId: session.state.questions[1].id,
        userId: mockUserProfile.id,
        responses: { 'req_1': 'Deuxième réponse détaillée' },
        timeSpent: 2100,
        hintsUsed: [1],
        submissionTime: new Date(),
        isPartial: false
      };

      const secondResult = await orchestrator.processQuestionResponse(
        session.sessionId,
        secondResponse
      );

      expect(secondResult.sessionComplete).toBe(true);

      // Finalisation
      const results = await orchestrator.finalizeSession(session.sessionId);

      expect(results).toBeDefined();
      expect(results.summary.completedQuestions).toBe(2);
      expect(results.summary.averageScore).toBeGreaterThan(0);
      expect(results.recommendations).toBeDefined();
      expect(results.nextSteps).toBeDefined();
      expect(results.certification).toBeDefined();
    });

    test('devrait adapter les questions selon les performances', async () => {
      const configuration: SessionConfiguration = {
        difficulty: 'expert',
        questionCount: 1,
        adaptiveMode: true,
        realTimeFeedback: true,
        expertGuidance: true,
        progressiveComplexity: true
      };

      const session = await orchestrator.startQuestionSession(
        mockUserProfile.id,
        2,
        mockUserProfile,
        configuration
      );

      // Réponse avec score faible pour déclencher adaptation
      const lowScoreResponse: UserResponse = {
        questionId: session.state.questions[0].id,
        userId: mockUserProfile.id,
        responses: { 'req_1': 'Réponse incomplète' },
        timeSpent: 600,
        hintsUsed: [1, 2, 3],
        submissionTime: new Date(),
        isPartial: true
      };

      const result = await orchestrator.processQuestionResponse(
        session.sessionId,
        lowScoreResponse
      );

      expect(result.adaptations).toBeDefined();
      expect(result.adaptations!.length).toBeGreaterThan(0);
      expect(result.score.percentage).toBeLessThan(60);
    });
  });

  describe('📊 Analytics et Métriques', () => {
    test('devrait calculer les métriques de performance', async () => {
      const configuration: SessionConfiguration = {
        difficulty: 'expert',
        questionCount: 1,
        adaptiveMode: false,
        realTimeFeedback: true,
        expertGuidance: true,
        progressiveComplexity: false
      };

      const session = await orchestrator.startQuestionSession(
        mockUserProfile.id,
        1,
        mockUserProfile,
        configuration
      );

      const response: UserResponse = {
        questionId: session.state.questions[0].id,
        userId: mockUserProfile.id,
        responses: { 'req_1': 'Réponse excellente avec analyse approfondie' },
        timeSpent: 2700,
        hintsUsed: [],
        submissionTime: new Date(),
        isPartial: false
      };

      await orchestrator.processQuestionResponse(session.sessionId, response);
      const results = await orchestrator.finalizeSession(session.sessionId);

      expect(results.summary.overallPerformance).toBeOneOf([
        'excellent', 'good', 'satisfactory', 'needs_improvement'
      ]);
      expect(results.detailedAnalysis.progressionAnalysis).toBeDefined();
      expect(results.detailedAnalysis.comparativeAnalysis).toBeDefined();
    });
  });
});

// Utilitaires de test
expect.extend({
  toBeOneOf(received, expected) {
    const pass = expected.includes(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be one of ${expected}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be one of ${expected}`,
        pass: false,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeOneOf(expected: any[]): R;
    }
  }
}
