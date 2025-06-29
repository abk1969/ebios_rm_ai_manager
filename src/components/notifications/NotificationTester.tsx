/**
 * 🧪 TESTEUR DE NOTIFICATIONS
 * Composant pour tester le système de notifications
 */

import React from 'react';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Zap, 
  Award,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useNotifications, useEbiosNotifications } from '../../hooks/useNotifications';

/**
 * 🧪 COMPOSANT TESTEUR
 */
export const NotificationTester: React.FC = () => {
  const {
    notify,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    notifyAction,
    notifyAchievement,
    notifyFormation,
    notifyReport,
    notifySync
  } = useNotifications();

  const {
    notifyWorkshopCompleted,
    notifyValidationError,
    notifyReportReady,
    notifyMissionValidation,
    notifyDataInconsistency,
    notifyNewComment
  } = useEbiosNotifications();

  // 🎯 TESTS BASIQUES
  const testBasicNotifications = async () => {
    await notifyInfo(
      'Test d\'information',
      'Ceci est une notification d\'information basique'
    );

    await notifySuccess(
      'Test de succès',
      'Opération réalisée avec succès !'
    );

    await notifyWarning(
      'Test d\'avertissement',
      'Attention, vérifiez cette information'
    );

    await notifyError(
      'Test d\'erreur',
      'Une erreur s\'est produite lors du traitement'
    );
  };

  // 🎓 TESTS FORMATION EBIOS RM
  const testEbiosFormationNotifications = async () => {
    // Atelier terminé avec nouveau générateur
    await notifyWorkshopCompleted(1, 85, 'mission-test-123', 2);

    // Erreur de validation spécifique
    await notifyValidationError(
      2,
      'step-biens-essentiels',
      'Données manquantes dans la section "Biens essentiels"',
      'mission-test-123'
    );

    // Incohérence détectée par l'IA
    await notifyDataInconsistency(
      'Mission Hôpital CHU',
      'mission-chu-2024',
      'Atelier 3 - Analyse des risques',
      3
    );

    // Validation de mission requise
    await notifyMissionValidation(
      'Mission Banque XYZ',
      'mission-banque-xyz'
    );
  };

  // 🎓 TESTS FORMATION BASIQUES (anciens)
  const testFormationNotifications = async () => {
    // Atelier terminé
    await notifyFormation.workshopCompleted(1, 85, 2);

    // Erreur de validation
    await notifyFormation.validationError(
      2,
      'step-3',
      'Données manquantes dans la section "Biens essentiels"'
    );

    // Nouveau module
    await notifyFormation.newModuleAvailable(
      'EBIOS RM Avancé',
      '/formation/advanced'
    );

    // Rappel d'inactivité
    await notifyFormation.inactivityReminder(
      '2024-01-10',
      '/formation/resume'
    );
  };

  // 📊 TESTS RAPPORTS EBIOS RM
  const testEbiosReportNotifications = async () => {
    // Rapport généré avec nouveau générateur
    await notifyReportReady(
      'Rapport EBIOS RM - Mission Banque XYZ',
      'report-banque-xyz-2024',
      'mission-banque-xyz',
      '/api/reports/report-banque-xyz-2024/download',
      '/reports/report-banque-xyz-2024'
    );
  };

  // 📊 TESTS RAPPORTS BASIQUES (anciens)
  const testReportNotifications = async () => {
    // Rapport généré
    await notifyReport.generated(
      'Rapport EBIOS RM - Mission Banque XYZ',
      '/downloads/report-123.pdf',
      '/reports/123'
    );

    // Erreur génération
    await notifyReport.generationError(
      'Rapport Complet',
      'Données insuffisantes pour générer le rapport',
      '/reports/retry/123'
    );
  };

  // 🔄 TESTS SYNCHRONISATION
  const testSyncNotifications = async () => {
    // Sync réussie
    await notifySync.success(15);

    // Sync échouée
    await notifySync.failed(
      'Connexion réseau interrompue',
      () => console.log('Retry sync')
    );
  };

  // 🎯 TESTS ACTIONS
  const testActionNotifications = async () => {
    await notifyAction(
      'Validation requise',
      'Votre mission nécessite une validation avant publication',
      [
        {
          id: 'validate',
          label: 'Valider maintenant',
          type: 'primary',
          icon: '✅',
          onClick: () => console.log('Validation clicked')
        },
        {
          id: 'later',
          label: 'Plus tard',
          type: 'secondary',
          icon: '⏰',
          onClick: () => console.log('Later clicked')
        }
      ]
    );
  };

  // 🏆 TESTS ACHIEVEMENTS
  const testAchievementNotifications = async () => {
    await notifyAchievement(
      'Premier atelier terminé !',
      'Vous avez terminé votre premier atelier EBIOS RM'
    );

    await notifyAchievement(
      'Expert EBIOS RM',
      'Vous avez terminé tous les ateliers avec excellence'
    );
  };

  // 👥 TESTS COLLABORATION EBIOS RM
  const testEbiosCollaborationNotifications = async () => {
    // Nouveau commentaire
    await notifyNewComment(
      'Marie Dupont',
      'user-marie-dupont',
      'Atelier 2 - Sources de menaces',
      'Mission Hôpital CHU',
      'mission-chu-2024',
      'comment-456'
    );
  };

  // 🔗 TESTS INTÉGRATION EBIOS RM
  const testEbiosIntegrationNotifications = async () => {
    const { ebiosNotificationIntegration } = await import('../../services/EbiosNotificationIntegration');

    // Simuler des événements EBIOS RM réels
    ebiosNotificationIntegration.emitWorkshopCompleted(
      1,
      'mission-test-integration',
      'user-test',
      95,
      2
    );

    setTimeout(() => {
      ebiosNotificationIntegration.emitWorkshopValidationError(
        2,
        'mission-test-integration',
        'user-test',
        'step-sources-menaces',
        'Sources de menaces incomplètes - Veuillez ajouter au moins 3 sources',
        'Sources de menaces'
      );
    }, 1000);

    setTimeout(() => {
      ebiosNotificationIntegration.emitReportGenerated(
        'report-integration-test',
        'mission-test-integration',
        'user-test',
        'Rapport EBIOS RM - Test Intégration',
        '/api/reports/integration-test/download',
        '/reports/integration-test',
        25
      );
    }, 2000);

    setTimeout(() => {
      ebiosNotificationIntegration.emitDataInconsistency(
        'mission-test-integration',
        'user-test',
        'Mission Test Intégration',
        'Atelier 3 - Événements redoutés',
        3,
        'high'
      );
    }, 3000);

    setTimeout(() => {
      ebiosNotificationIntegration.emitCommentAdded(
        'mission-test-integration',
        'user-test',
        'Expert ANSSI',
        'user-expert-anssi',
        'Atelier 1 - Socle de sécurité',
        'Mission Test Intégration',
        'comment-integration-test'
      );
    }, 4000);
  };

  // 🤖 TESTS GÉNÉRATEURS INTELLIGENTS
  const testIntelligentGenerators = async () => {
    const { notificationGenerators } = await import('../../services/NotificationGenerators');
    const { notificationScheduler } = await import('../../services/NotificationScheduler');
    const { notificationAnalytics } = await import('../../services/NotificationAnalytics');

    // Test générateur automatique
    const mockEvent = {
      type: 'workshop_completed',
      source: 'ebios_system',
      userId: 'user-test-intelligent',
      sessionId: 'session-test',
      missionId: 'mission-test-intelligent',
      workshopId: 1,
      data: {
        score: 95,
        nextWorkshop: 2,
        user_workshop_count: 1
      },
      timestamp: new Date().toISOString()
    };

    const mockContext = {
      userId: 'user-test-intelligent',
      sessionId: 'session-test',
      userLevel: 'beginner'
    };

    // Traiter l'événement avec le générateur intelligent
    const generatedIds = await notificationGenerators.processEvent(mockEvent, mockContext);
    console.log('🤖 Notifications générées automatiquement:', generatedIds);

    // Planifier une notification pour dans 5 secondes
    const futureTime = new Date(Date.now() + 5000);
    const scheduledId = notificationScheduler.scheduleNotification(
      'inactivity_reminder_progressive',
      'user-test-scheduled',
      futureTime,
      {
        type: 'user_inactive',
        source: 'scheduler_test',
        userId: 'user-test-scheduled',
        data: { days_inactive: 5 },
        timestamp: new Date().toISOString()
      }
    );

    console.log('⏰ Notification planifiée:', scheduledId);

    // Simuler des analytics
    setTimeout(() => {
      notificationAnalytics.trackNotificationRead(generatedIds[0] || 'test', 'user-test-intelligent');
      notificationAnalytics.trackNotificationClicked(generatedIds[0] || 'test', 'user-test-intelligent');
      notificationAnalytics.trackActionPerformed(generatedIds[0] || 'test', 'start_next', 'user-test-intelligent');
    }, 2000);

    // Afficher les stats du générateur
    setTimeout(() => {
      const stats = notificationGenerators.getStats();
      console.log('📊 Stats générateur:', stats);

      const schedulerStats = notificationScheduler.getSchedulerStats();
      console.log('📅 Stats planificateur:', schedulerStats);

      const globalMetrics = notificationAnalytics.calculateGlobalMetrics();
      console.log('📈 Métriques globales:', globalMetrics);
    }, 3000);
  };

  // 🔗 TESTS NAVIGATION ET ACTIONS
  const testNavigationAndActions = async () => {
    const { notificationNavigation } = await import('../../services/NotificationNavigation');
    const { notificationActions } = await import('../../services/NotificationActions');

    // Initialiser les services
    notificationNavigation.initialize();
    notificationActions.initialize();

    // Test notification avec navigation contextuelle
    await notify({
      title: '🔗 Test Navigation Contextuelle',
      message: 'Notification avec liens profonds et actions rapides',
      type: 'action',
      category: 'workshop',
      priority: 'high',
      icon: '🔗',
      actions: [
        {
          id: 'navigate_to_workshop',
          label: 'Aller à l\'atelier',
          type: 'primary',
          icon: '🎯'
        },
        {
          id: 'navigate_to_results',
          label: 'Voir résultats',
          type: 'secondary',
          icon: '📊'
        },
        {
          id: 'fix_validation_error',
          label: 'Corriger erreur',
          type: 'primary',
          icon: '🔧'
        }
      ],
      context: {
        missionId: 'mission-test-navigation',
        workshopId: 2,
        stepId: 'biens-essentiels',
        metadata: {
          source: 'notification',
          errorCode: 'MISSING_DATA',
          hash: 'section-validation'
        }
      },
      deepLink: '/missions/mission-test-navigation/workshops/2?step=biens-essentiels#section-validation',
      persistent: true,
      sound: true,
      tags: ['navigation', 'test', 'actions']
    });

    // Test notification rapport avec actions
    setTimeout(async () => {
      await notify({
        title: '📊 Rapport Prêt avec Actions',
        message: 'Votre rapport EBIOS RM est disponible',
        type: 'success',
        category: 'report',
        priority: 'medium',
        icon: '📊',
        actions: [
          {
            id: 'download_report',
            label: 'Télécharger PDF',
            type: 'primary',
            icon: '⬇️'
          },
          {
            id: 'share_report',
            label: 'Partager',
            type: 'secondary',
            icon: '📤'
          },
          {
            id: 'navigate_to_mission',
            label: 'Voir mission',
            type: 'secondary',
            icon: '📋'
          }
        ],
        context: {
          reportId: 'report-test-actions',
          missionId: 'mission-test-navigation',
          metadata: {
            source: 'notification',
            reportType: 'complete',
            pageCount: 25
          }
        },
        deepLink: '/reports/report-test-actions',
        tags: ['report', 'download', 'actions']
      });
    }, 1000);

    // Test notification collaboration
    setTimeout(async () => {
      await notify({
        title: '💬 Nouveau Commentaire avec Actions',
        message: 'Expert ANSSI a commenté votre analyse',
        type: 'info',
        category: 'collaboration',
        priority: 'medium',
        icon: '💬',
        actions: [
          {
            id: 'reply_to_comment',
            label: 'Répondre',
            type: 'primary',
            icon: '↩️'
          },
          {
            id: 'navigate_to_mission',
            label: 'Voir mission',
            type: 'secondary',
            icon: '📋'
          }
        ],
        context: {
          missionId: 'mission-test-navigation',
          userId: 'expert-anssi',
          metadata: {
            source: 'notification',
            commentId: 'comment-test-123',
            authorName: 'Expert ANSSI',
            location: 'Atelier 3 - Événements redoutés'
          }
        },
        deepLink: '/missions/mission-test-navigation/comments#comment-test-123',
        tags: ['collaboration', 'comment', 'actions']
      });
    }, 2000);

    // Test génération d'actions contextuelles
    setTimeout(() => {
      const contextualActions = notificationActions.generateContextualActions({
        missionId: 'mission-test-navigation',
        workshopId: 3,
        stepId: 'evenements-redoutes',
        metadata: {
          hasValidationErrors: true,
          canDownloadReport: true
        }
      }, 'expert');

      console.log('🎯 Actions contextuelles générées:', contextualActions);
    }, 3000);

    // Test liens profonds
    setTimeout(() => {
      const deepLink = notificationNavigation.generateDeepLink('workshop', {
        missionId: 'mission-test-navigation',
        workshopId: 2,
        stepId: 'biens-essentiels',
        metadata: {
          tab: 'validation',
          autoFocus: 'true'
        }
      });

      console.log('🔗 Lien profond généré:', deepLink);
    }, 4000);
  };

  // 🎨 TESTS AVANCÉS
  const testAdvancedNotifications = async () => {
    // Notification avec contexte complet
    await notify({
      title: 'Mission critique détectée',
      message: 'La mission "Hôpital CHU" nécessite une attention immédiate',
      type: 'warning',
      category: 'security',
      priority: 'urgent',
      icon: '🚨',
      actions: [
        {
          id: 'view_mission',
          label: 'Voir la mission',
          type: 'primary',
          icon: '👁️',
          url: '/missions/chu-2024'
        },
        {
          id: 'contact_team',
          label: 'Contacter l\'équipe',
          type: 'secondary',
          icon: '📞',
          onClick: () => console.log('Contact team')
        }
      ],
      context: {
        missionId: 'chu-2024',
        workshopId: 3,
        stepId: 'risk-assessment'
      },
      deepLink: '/missions/chu-2024/workshop/3?step=risk-assessment',
      persistent: true,
      sound: true,
      tags: ['urgent', 'security', 'mission', 'chu']
    });

    // Notification de collaboration
    await notify({
      title: 'Nouveau commentaire',
      message: 'Marie Dupont a commenté votre analyse de risques',
      type: 'info',
      category: 'collaboration',
      priority: 'medium',
      icon: '💬',
      actions: [
        {
          id: 'view_comment',
          label: 'Voir le commentaire',
          type: 'primary',
          icon: '👁️',
          url: '/missions/chu-2024/comments#comment-456'
        }
      ],
      tags: ['collaboration', 'comment', 'marie-dupont']
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Bell className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          🧪 Testeur de Notifications
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tests basiques */}
        <button
          onClick={testBasicNotifications}
          className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Info className="w-5 h-5 text-blue-500" />
          <div className="text-left">
            <div className="font-medium">Tests basiques</div>
            <div className="text-sm text-gray-600">Info, succès, warning, erreur</div>
          </div>
        </button>

        {/* Tests EBIOS Formation */}
        <button
          onClick={testEbiosFormationNotifications}
          className="flex items-center space-x-2 p-4 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors bg-emerald-50"
        >
          <Award className="w-5 h-5 text-emerald-600" />
          <div className="text-left">
            <div className="font-medium text-emerald-800">🎯 EBIOS Formation</div>
            <div className="text-sm text-emerald-700">Ateliers, validation, IA</div>
          </div>
        </button>

        {/* Tests EBIOS Rapports */}
        <button
          onClick={testEbiosReportNotifications}
          className="flex items-center space-x-2 p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors bg-purple-50"
        >
          <CheckCircle className="w-5 h-5 text-purple-600" />
          <div className="text-left">
            <div className="font-medium text-purple-800">📊 EBIOS Rapports</div>
            <div className="text-sm text-purple-700">Génération contextualisée</div>
          </div>
        </button>

        {/* Tests EBIOS Collaboration */}
        <button
          onClick={testEbiosCollaborationNotifications}
          className="flex items-center space-x-2 p-4 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors bg-orange-50"
        >
          <CheckCircle className="w-5 h-5 text-orange-600" />
          <div className="text-left">
            <div className="font-medium text-orange-800">👥 EBIOS Collaboration</div>
            <div className="text-sm text-orange-700">Commentaires, partage</div>
          </div>
        </button>

        {/* Tests formation basiques */}
        <button
          onClick={testFormationNotifications}
          className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Award className="w-5 h-5 text-green-500" />
          <div className="text-left">
            <div className="font-medium">Formation basique</div>
            <div className="text-sm text-gray-600">Ateliers, validation, modules</div>
          </div>
        </button>

        {/* Tests rapports basiques */}
        <button
          onClick={testReportNotifications}
          className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <CheckCircle className="w-5 h-5 text-purple-500" />
          <div className="text-left">
            <div className="font-medium">Rapports basiques</div>
            <div className="text-sm text-gray-600">Génération, téléchargement</div>
          </div>
        </button>

        {/* Tests sync */}
        <button
          onClick={testSyncNotifications}
          className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-indigo-500" />
          <div className="text-left">
            <div className="font-medium">Tests sync</div>
            <div className="text-sm text-gray-600">Synchronisation données</div>
          </div>
        </button>

        {/* Tests actions */}
        <button
          onClick={testActionNotifications}
          className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Zap className="w-5 h-5 text-yellow-500" />
          <div className="text-left">
            <div className="font-medium">Tests actions</div>
            <div className="text-sm text-gray-600">Actions requises</div>
          </div>
        </button>

        {/* Tests achievements */}
        <button
          onClick={testAchievementNotifications}
          className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Award className="w-5 h-5 text-gold-500" />
          <div className="text-left">
            <div className="font-medium">Tests achievements</div>
            <div className="text-sm text-gray-600">Badges, récompenses</div>
          </div>
        </button>

        {/* Tests intégration EBIOS RM */}
        <button
          onClick={testEbiosIntegrationNotifications}
          className="flex items-center space-x-2 p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors bg-blue-50 md:col-span-2 lg:col-span-3"
        >
          <AlertTriangle className="w-5 h-5 text-blue-600" />
          <div className="text-left">
            <div className="font-medium text-blue-800">🔗 Intégration EBIOS RM</div>
            <div className="text-sm text-blue-700">Simulation d'événements réels avec séquence temporelle</div>
          </div>
        </button>

        {/* Tests générateurs intelligents */}
        <button
          onClick={testIntelligentGenerators}
          className="flex items-center space-x-2 p-4 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors bg-indigo-50 md:col-span-2 lg:col-span-3"
        >
          <RefreshCw className="w-5 h-5 text-indigo-600" />
          <div className="text-left">
            <div className="font-medium text-indigo-800">🤖 Générateurs Intelligents</div>
            <div className="text-sm text-indigo-700">Règles automatiques, planification et analytics</div>
          </div>
        </button>

        {/* Tests navigation et actions */}
        <button
          onClick={testNavigationAndActions}
          className="flex items-center space-x-2 p-4 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors bg-teal-50 md:col-span-2 lg:col-span-3"
        >
          <AlertTriangle className="w-5 h-5 text-teal-600" />
          <div className="text-left">
            <div className="font-medium text-teal-800">🔗 Navigation & Actions</div>
            <div className="text-sm text-teal-700">Liens profonds, actions rapides et breadcrumbs</div>
          </div>
        </button>

        {/* Tests avancés */}
        <button
          onClick={testAdvancedNotifications}
          className="flex items-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors md:col-span-2 lg:col-span-3"
        >
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <div className="text-left">
            <div className="font-medium">Tests avancés</div>
            <div className="text-sm text-gray-600">Notifications complexes avec contexte et actions multiples</div>
          </div>
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">💡 Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Cliquez sur les boutons pour générer des notifications de test</li>
          <li>• Observez la cloche en haut à droite qui s'anime</li>
          <li>• Cliquez sur la cloche pour voir le dropdown</li>
          <li>• Utilisez "Voir toutes" pour accéder à la page complète</li>
          <li>• Testez les actions et liens dans les notifications</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationTester;
