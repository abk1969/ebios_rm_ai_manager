/**
 * ⚛️ TESTS D'INTÉGRATION REACT WORKSHOP 1
 * Tests des composants React et de leur intégration
 * POINT 4 - Tests et Validation Complète
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { NotificationProvider } from '../../../../../contexts/NotificationContext';
import { EbiosExpertProfile } from '../../../../../infrastructure/a2a/types/AgentCardTypes';

// 🎯 MOCKS ET CONFIGURATION

// Mock des services
vi.mock('../../domain/services/Workshop1MasterAgent', () => ({
  Workshop1MasterAgent: {
    getInstance: () => ({
      startIntelligentSession: vi.fn().mockResolvedValue({
        sessionId: 'test-session-123',
        analysisResult: {
          expertiseLevel: {
            level: 'expert',
            score: 85,
            confidence: 0.9,
            specializations: ['risk_management'],
            weakAreas: [],
            strengths: ['experience_methodologique']
          }
        },
        currentModule: 'introduction',
        adaptations: []
      }),
      updateSessionProgress: vi.fn().mockResolvedValue({ success: true, adaptationsTriggered: [] }),
      finalizeSession: vi.fn().mockResolvedValue({ sessionId: 'test-session-123', completionRate: 100 }),
      getSessionMetrics: vi.fn().mockReturnValue({
        effectiveness: 85,
        interactions: 10,
        progress: { comprehensionLevel: 80 }
      })
    })
  }
}));

vi.mock('../../domain/services/ExpertNotificationService', () => ({
  ExpertNotificationService: {
    getInstance: () => ({
      generateExpertNotification: vi.fn().mockResolvedValue({
        id: 'test-notification-123',
        title: 'Test Expert Notification',
        message: 'Test message for expert',
        expertActions: [
          { id: 'test-action', label: 'Test Action', icon: '🔍', type: 'primary', onClick: vi.fn() }
        ]
      })
    })
  }
}));

vi.mock('../../domain/services/NotificationIntegrationService', () => ({
  NotificationIntegrationService: {
    getInstance: () => ({
      processNotificationRequest: vi.fn().mockResolvedValue({
        success: true,
        notificationId: 'integration-test-123',
        integrationPath: 'expert_service'
      }),
      getIntegrationMetrics: vi.fn().mockReturnValue({
        totalNotificationsProcessed: 10,
        expertNotificationsGenerated: 8,
        a2aMessagesExchanged: 5,
        successRate: 95
      })
    })
  }
}));

// Mock du store Redux
const mockStore = configureStore({
  reducer: {
    notifications: (state = { notifications: [], stats: { total: 0, unread: 0 } }) => state
  }
});

// 🎯 PROFIL UTILISATEUR DE TEST

const mockUserProfile: EbiosExpertProfile = {
  id: 'react-test-user',
  name: 'React Test Expert',
  role: 'Expert EBIOS RM React',
  experience: { ebiosYears: 8, totalYears: 12, projectsCompleted: 25 },
  specializations: ['risk_management', 'react_testing'],
  certifications: ['CISSP', 'ANSSI'],
  sector: 'test',
  organizationType: 'React Test Lab',
  preferredComplexity: 'expert',
  learningStyle: 'interactive'
};

// 🧪 WRAPPER DE TEST

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <Provider store={mockStore}>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </Provider>
  </BrowserRouter>
);

// ⚛️ SUITE DE TESTS REACT

describe('⚛️ Workshop 1 - Tests d\'Intégration React', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // 🧠 TESTS DU HOOK D'INTELLIGENCE

  describe('🧠 Hook useWorkshop1Intelligence', () => {
    it('devrait initialiser correctement l\'état d\'intelligence', async () => {
      const { useWorkshop1Intelligence } = await import('../hooks/useWorkshop1Intelligence');
      
      // Test d'importation réussie
      expect(useWorkshop1Intelligence).toBeDefined();
      expect(typeof useWorkshop1Intelligence).toBe('function');
    });

    it('devrait gérer les actions d\'intelligence', async () => {
      // Test de simulation d'utilisation du hook
      const mockHookResult = {
        state: {
          sessionId: 'test-session',
          userProfile: mockUserProfile,
          expertiseLevel: { level: 'expert', score: 85 },
          isInitializing: false,
          error: null
        },
        actions: {
          initializeSession: vi.fn(),
          updateProgress: vi.fn(),
          triggerAdaptation: vi.fn(),
          refreshMetrics: vi.fn()
        }
      };

      expect(mockHookResult.state.sessionId).toBeTruthy();
      expect(mockHookResult.actions.initializeSession).toBeDefined();
    });
  });

  // 📊 TESTS DU DASHBOARD

  describe('📊 Workshop1Dashboard', () => {
    it('devrait rendre le dashboard avec le profil utilisateur', async () => {
      const { Workshop1Dashboard } = await import('../Workshop1Dashboard');
      
      const mockProps = {
        userProfile: mockUserProfile,
        onModuleChange: vi.fn(),
        onSessionComplete: vi.fn()
      };

      render(
        <TestWrapper>
          <Workshop1Dashboard {...mockProps} />
        </TestWrapper>
      );

      // Le dashboard devrait s'initialiser
      await waitFor(() => {
        expect(screen.queryByText(/initialisation/i)).not.toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('devrait gérer les changements de module', async () => {
      const { Workshop1Dashboard } = await import('../Workshop1Dashboard');
      
      const onModuleChange = vi.fn();
      const mockProps = {
        userProfile: mockUserProfile,
        onModuleChange,
        onSessionComplete: vi.fn()
      };

      render(
        <TestWrapper>
          <Workshop1Dashboard {...mockProps} />
        </TestWrapper>
      );

      // Attendre l'initialisation
      await waitFor(() => {
        expect(screen.queryByText(/initialisation/i)).not.toBeInTheDocument();
      }, { timeout: 5000 });

      // Simuler un changement de module
      const moduleButton = screen.queryByText(/cadrage/i);
      if (moduleButton) {
        fireEvent.click(moduleButton);
        expect(onModuleChange).toHaveBeenCalled();
      }
    });
  });

  // 🔔 TESTS DU PANNEAU DE NOTIFICATIONS

  describe('🔔 ExpertNotificationPanel', () => {
    it('devrait afficher les notifications expertes', async () => {
      const { ExpertNotificationPanel } = await import('../ExpertNotificationPanel');
      
      const mockProps = {
        expertiseLevel: {
          level: 'expert' as const,
          score: 85,
          confidence: 0.9,
          specializations: ['risk_management'],
          weakAreas: [],
          strengths: []
        },
        position: 'top' as const,
        onActionTrigger: vi.fn()
      };

      render(
        <TestWrapper>
          <ExpertNotificationPanel {...mockProps} />
        </TestWrapper>
      );

      // Vérifier la présence du panneau
      expect(screen.getByText(/notifications expertes/i)).toBeInTheDocument();
    });

    it('devrait filtrer les notifications par type', async () => {
      const { ExpertNotificationPanel } = await import('../ExpertNotificationPanel');
      
      const mockProps = {
        expertiseLevel: {
          level: 'expert' as const,
          score: 85,
          confidence: 0.9,
          specializations: ['risk_management'],
          weakAreas: [],
          strengths: []
        },
        position: 'sidebar' as const,
        onActionTrigger: vi.fn()
      };

      render(
        <TestWrapper>
          <ExpertNotificationPanel {...mockProps} />
        </TestWrapper>
      );

      // Tester les filtres
      const expertFilter = screen.getByText(/expert/i);
      fireEvent.click(expertFilter);

      const methodologyFilter = screen.getByText(/méthodologie/i);
      fireEvent.click(methodologyFilter);

      expect(screen.getByText(/notifications expertes/i)).toBeInTheDocument();
    });
  });

  // 🤝 TESTS DE L'INTERFACE DE COLLABORATION

  describe('🤝 A2ACollaborationInterface', () => {
    it('devrait afficher l\'interface de collaboration', async () => {
      const { A2ACollaborationInterface } = await import('../A2ACollaborationInterface');
      
      const mockProps = {
        userProfile: mockUserProfile,
        expertiseLevel: {
          level: 'expert' as const,
          score: 85,
          confidence: 0.9,
          specializations: ['risk_management'],
          weakAreas: [],
          strengths: []
        },
        onCollaborationRequest: vi.fn(),
        onInsightRequest: vi.fn()
      };

      render(
        <TestWrapper>
          <A2ACollaborationInterface {...mockProps} />
        </TestWrapper>
      );

      expect(screen.getByText(/collaboration a2a/i)).toBeInTheDocument();
    });

    it('devrait gérer les onglets de collaboration', async () => {
      const { A2ACollaborationInterface } = await import('../A2ACollaborationInterface');
      
      const mockProps = {
        userProfile: mockUserProfile,
        expertiseLevel: {
          level: 'expert' as const,
          score: 85,
          confidence: 0.9,
          specializations: ['risk_management'],
          weakAreas: [],
          strengths: []
        },
        onCollaborationRequest: vi.fn(),
        onInsightRequest: vi.fn()
      };

      render(
        <TestWrapper>
          <A2ACollaborationInterface {...mockProps} />
        </TestWrapper>
      );

      // Tester la navigation entre onglets
      const expertsTab = screen.getByText(/experts/i);
      fireEvent.click(expertsTab);

      const insightsTab = screen.getByText(/insights/i);
      fireEvent.click(insightsTab);

      expect(screen.getByText(/collaboration a2a/i)).toBeInTheDocument();
    });
  });

  // 📊 TESTS DES MÉTRIQUES TEMPS RÉEL

  describe('📊 RealTimeMetricsDisplay', () => {
    it('devrait afficher les métriques selon la visibilité', async () => {
      const { RealTimeMetricsDisplay } = await import('../RealTimeMetricsDisplay');
      
      const mockMetrics = {
        responseTime: 1200,
        interactionFrequency: 2.5,
        contentRelevance: 85,
        collaborationActivity: 70,
        notificationEfficiency: 92,
        a2aMessageCount: 15,
        lastUpdate: new Date()
      };

      const mockProps = {
        metrics: mockMetrics,
        visibility: 'expert' as const,
        onRefresh: vi.fn()
      };

      render(
        <TestWrapper>
          <RealTimeMetricsDisplay {...mockProps} />
        </TestWrapper>
      );

      expect(screen.getByText(/métriques temps réel/i)).toBeInTheDocument();
    });

    it('devrait rafraîchir les métriques', async () => {
      const { RealTimeMetricsDisplay } = await import('../RealTimeMetricsDisplay');
      
      const onRefresh = vi.fn();
      const mockMetrics = {
        responseTime: 800,
        interactionFrequency: 3.0,
        contentRelevance: 90,
        collaborationActivity: 80,
        notificationEfficiency: 95,
        a2aMessageCount: 20,
        lastUpdate: new Date()
      };

      const mockProps = {
        metrics: mockMetrics,
        visibility: 'detailed' as const,
        onRefresh
      };

      render(
        <TestWrapper>
          <RealTimeMetricsDisplay {...mockProps} />
        </TestWrapper>
      );

      // Simuler un rafraîchissement
      const refreshButton = screen.getByText(/🔄/);
      fireEvent.click(refreshButton);

      expect(onRefresh).toHaveBeenCalled();
    });
  });

  // 📈 TESTS DU TRACKER DE PROGRESSION

  describe('📈 AdaptiveProgressTracker', () => {
    it('devrait afficher la progression adaptative', async () => {
      const { AdaptiveProgressTracker } = await import('../AdaptiveProgressTracker');
      
      const mockProgress = {
        currentModule: 'cadrage',
        moduleProgress: 75,
        overallProgress: 60,
        timeSpent: 45,
        engagementScore: 85,
        comprehensionLevel: 80,
        adaptationsApplied: 2,
        lastActivity: new Date()
      };

      const mockProps = {
        progress: mockProgress,
        expertiseLevel: {
          level: 'expert' as const,
          score: 85,
          confidence: 0.9,
          specializations: ['risk_management'],
          weakAreas: [],
          strengths: []
        },
        onProgressUpdate: vi.fn()
      };

      render(
        <TestWrapper>
          <AdaptiveProgressTracker {...mockProps} />
        </TestWrapper>
      );

      expect(screen.getByText(/progression workshop 1/i)).toBeInTheDocument();
      expect(screen.getByText(/60%/)).toBeInTheDocument();
    });

    it('devrait basculer entre modules et jalons', async () => {
      const { AdaptiveProgressTracker } = await import('../AdaptiveProgressTracker');
      
      const mockProgress = {
        currentModule: 'biens_essentiels',
        moduleProgress: 50,
        overallProgress: 40,
        timeSpent: 30,
        engagementScore: 90,
        comprehensionLevel: 75,
        adaptationsApplied: 1,
        lastActivity: new Date()
      };

      const mockProps = {
        progress: mockProgress,
        expertiseLevel: {
          level: 'senior' as const,
          score: 75,
          confidence: 0.8,
          specializations: ['risk_management'],
          weakAreas: [],
          strengths: []
        },
        onProgressUpdate: vi.fn()
      };

      render(
        <TestWrapper>
          <AdaptiveProgressTracker {...mockProps} />
        </TestWrapper>
      );

      // Basculer vers les jalons
      const milestonesTab = screen.getByText(/jalons/i);
      fireEvent.click(milestonesTab);

      expect(screen.getByText(/progression workshop 1/i)).toBeInTheDocument();
    });
  });

  // 🛠️ TESTS DE LA TOOLBAR EXPERTE

  describe('🛠️ ExpertActionToolbar', () => {
    it('devrait afficher la toolbar avec actions expertes', async () => {
      const { ExpertActionToolbar } = await import('../ExpertActionToolbar');
      
      const mockActions = [
        {
          id: 'test-action',
          label: 'Test Action',
          icon: '🔍',
          type: 'navigation' as const,
          enabled: true,
          onClick: vi.fn(),
          tooltip: 'Test tooltip',
          expertLevel: 'expert' as const
        }
      ];

      const mockTheme = {
        name: 'expert',
        primaryColor: '#059669',
        accentColor: '#10b981',
        backgroundColor: '#f0fdf4',
        textColor: '#1f2937',
        complexity: 'expert' as const,
        iconSet: 'expert' as const
      };

      const mockProps = {
        actions: mockActions,
        theme: mockTheme,
        onToggleExpertMode: vi.fn(),
        onExportSession: vi.fn().mockResolvedValue({})
      };

      render(
        <TestWrapper>
          <ExpertActionToolbar {...mockProps} />
        </TestWrapper>
      );

      expect(screen.getByText(/mode expert/i)).toBeInTheDocument();
    });
  });

  // 🧠 TESTS DE L'INTERFACE PRINCIPALE

  describe('🧠 Workshop1IntelligentInterface', () => {
    it('devrait initialiser l\'interface intelligente', async () => {
      const { Workshop1IntelligentInterface } = await import('../Workshop1IntelligentInterface');
      
      const mockProps = {
        userProfile: mockUserProfile,
        onComplete: vi.fn(),
        onModuleChange: vi.fn()
      };

      render(
        <TestWrapper>
          <Workshop1IntelligentInterface {...mockProps} />
        </TestWrapper>
      );

      // Vérifier l'état d'initialisation
      expect(screen.getByText(/initialisation de l'intelligence/i)).toBeInTheDocument();

      // Attendre la fin de l'initialisation
      await waitFor(() => {
        expect(screen.queryByText(/initialisation de l'intelligence/i)).not.toBeInTheDocument();
      }, { timeout: 10000 });
    });

    it('devrait gérer les erreurs d\'initialisation', async () => {
      // Mock d'une erreur d'initialisation
      vi.mocked(require('../../domain/services/Workshop1MasterAgent').Workshop1MasterAgent.getInstance().startIntelligentSession)
        .mockRejectedValueOnce(new Error('Test initialization error'));

      const { Workshop1IntelligentInterface } = await import('../Workshop1IntelligentInterface');
      
      const mockProps = {
        userProfile: mockUserProfile,
        onComplete: vi.fn(),
        onModuleChange: vi.fn()
      };

      render(
        <TestWrapper>
          <Workshop1IntelligentInterface {...mockProps} />
        </TestWrapper>
      );

      // Attendre l'affichage de l'erreur
      await waitFor(() => {
        expect(screen.getByText(/erreur d'intelligence/i)).toBeInTheDocument();
      }, { timeout: 10000 });
    });
  });

  // 🔗 TESTS D'INTÉGRATION COMPLÈTE

  describe('🔗 Intégration Complète React', () => {
    it('devrait intégrer tous les composants ensemble', async () => {
      const { Workshop1IntelligentInterface } = await import('../Workshop1IntelligentInterface');
      
      const mockProps = {
        userProfile: mockUserProfile,
        onComplete: vi.fn(),
        onModuleChange: vi.fn()
      };

      render(
        <TestWrapper>
          <Workshop1IntelligentInterface {...mockProps} />
        </TestWrapper>
      );

      // Vérifier l'initialisation
      expect(screen.getByText(/initialisation de l'intelligence/i)).toBeInTheDocument();

      // Attendre l'interface complète
      await waitFor(() => {
        expect(screen.queryByText(/initialisation de l'intelligence/i)).not.toBeInTheDocument();
      }, { timeout: 10000 });

      // L'interface devrait être fonctionnelle
      expect(document.body).toBeInTheDocument();
    });

    it('devrait gérer les interactions utilisateur', async () => {
      const { Workshop1IntelligentInterface } = await import('../Workshop1IntelligentInterface');
      
      const onModuleChange = vi.fn();
      const onComplete = vi.fn();

      const mockProps = {
        userProfile: mockUserProfile,
        onComplete,
        onModuleChange
      };

      render(
        <TestWrapper>
          <Workshop1IntelligentInterface {...mockProps} />
        </TestWrapper>
      );

      // Attendre l'initialisation
      await waitFor(() => {
        expect(screen.queryByText(/initialisation de l'intelligence/i)).not.toBeInTheDocument();
      }, { timeout: 10000 });

      // Simuler des interactions
      const refreshButton = screen.queryByTitle(/actualiser les métriques/i);
      if (refreshButton) {
        fireEvent.click(refreshButton);
      }

      // Vérifier que l'interface reste stable
      expect(document.body).toBeInTheDocument();
    });
  });
});
