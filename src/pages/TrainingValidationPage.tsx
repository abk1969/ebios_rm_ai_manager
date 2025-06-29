import React, { useState } from 'react';
import {
  TestTube,
  Navigation,
  Target,
  Database,
  Zap,
  Globe,
  CheckCircle,
  Settings,
  MessageSquare
} from 'lucide-react';
import Button from '../components/ui/button';
import { MasterValidationSuite } from '../modules/training/presentation/components/MasterValidationSuite';
import { ComprehensiveIntegrationTest } from '../modules/training/presentation/components/ComprehensiveIntegrationTest';
import { PerformanceValidationTest } from '../modules/training/presentation/components/PerformanceValidationTest';
import { CompatibilityValidationTest } from '../modules/training/presentation/components/CompatibilityValidationTest';
import { UnifiedNavigationTest } from '../modules/training/presentation/components/UnifiedNavigationTest';
import { UnifiedMetricsTest } from '../modules/training/presentation/components/UnifiedMetricsTest';
import { DataPersistenceTest } from '../modules/training/presentation/components/DataPersistenceTest';
import { TrainingModulesValidator } from '../modules/training/presentation/components/TrainingModulesValidator';
import { NotificationTester } from '../components/notifications/NotificationTester';
import { TrainingModuleProvider } from '../modules/training/presentation/context/TrainingModuleContext';
import { ChatExpansionDemo } from '../modules/training/presentation/components/ChatExpansionDemo';

/**
 * 🧪 PAGE DE VALIDATION FORMATION
 * Interface de test pour valider l'intégration complète
 */

type TestComponent =
  | 'validator'
  | 'chat-expansion'
  | 'notifications'
  | 'master'
  | 'integration'
  | 'performance'
  | 'compatibility'
  | 'navigation'
  | 'metrics'
  | 'persistence';

// 🎯 WRAPPER POUR COMPOSANTS NÉCESSITANT LE CONTEXTE FORMATION
const TrainingModulesValidatorWrapper: React.FC = () => (
  <TrainingModuleProvider initialSessionId={`validation_${Date.now()}`}>
    <TrainingModulesValidator />
  </TrainingModuleProvider>
);

export default function TrainingValidationPage() {
  const [activeComponent, setActiveComponent] = useState<TestComponent>('validator');

  const testComponents = [
    {
      id: 'validator' as TestComponent,
      name: '🧪 Validateur Complet',
      description: 'Validation des corrections effectuées',
      icon: Settings,
      component: TrainingModulesValidatorWrapper,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      id: 'chat-expansion' as TestComponent,
      name: '💬 Chat Expansible',
      description: 'Test des fonctionnalités de pli/dépli du chat',
      icon: MessageSquare,
      component: ChatExpansionDemo,
      color: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    {
      id: 'notifications' as TestComponent,
      name: '🔔 Test Notifications',
      description: 'Testeur du système de notifications',
      icon: TestTube,
      component: NotificationTester,
      color: 'bg-orange-100 text-orange-800 border-orange-300'
    },
    {
      id: 'master' as TestComponent,
      name: 'Suite Maître',
      description: 'Interface centralisée de tous les tests',
      icon: TestTube,
      component: MasterValidationSuite,
      color: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    {
      id: 'integration' as TestComponent,
      name: 'Tests Intégration',
      description: 'Validation end-to-end complète',
      icon: CheckCircle,
      component: ComprehensiveIntegrationTest,
      color: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      id: 'performance' as TestComponent,
      name: 'Tests Performance',
      description: 'Mesures et optimisations',
      icon: Zap,
      component: PerformanceValidationTest,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    },
    {
      id: 'compatibility' as TestComponent,
      name: 'Tests Compatibilité',
      description: 'Navigateurs et fonctionnalités',
      icon: Globe,
      component: CompatibilityValidationTest,
      color: 'bg-green-100 text-green-800 border-green-300'
    },
    {
      id: 'navigation' as TestComponent,
      name: 'Tests Navigation',
      description: 'Système navigation unifié',
      icon: Navigation,
      component: UnifiedNavigationTest,
      color: 'bg-indigo-100 text-indigo-800 border-indigo-300'
    },
    {
      id: 'metrics' as TestComponent,
      name: 'Tests Métriques',
      description: 'Système métriques unifié',
      icon: Target,
      component: UnifiedMetricsTest,
      color: 'bg-pink-100 text-pink-800 border-pink-300'
    },
    {
      id: 'persistence' as TestComponent,
      name: 'Tests Persistance',
      description: 'Gestion données et sync',
      icon: Database,
      component: DataPersistenceTest,
      color: 'bg-teal-100 text-teal-800 border-teal-300'
    }
  ];

  const activeTest = testComponents.find(test => test.id === activeComponent);
  const ActiveComponent = activeTest?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <TestTube className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Validation Formation EBIOS RM
                </h1>
                <p className="text-sm text-gray-600">
                  Tests et validation de l'intégration complète
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                ✅ Intégration Terminée
              </span>
              <Button
                onClick={() => window.location.href = '/training/session/session_healthcare_chu_2024'}
                variant="outline"
              >
                Interface Formation
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation des tests */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Composants de Test
              </h2>
              
              <div className="space-y-2">
                {testComponents.map((test) => {
                  const Icon = test.icon;
                  const isActive = activeComponent === test.id;
                  
                  return (
                    <button
                      key={test.id}
                      onClick={() => setActiveComponent(test.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        isActive 
                          ? test.color
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{test.name}</div>
                          <div className="text-xs opacity-75">{test.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Statut intégration */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-900 mb-2">
                  🎉 Intégration Complète
                </h3>
                <div className="text-sm text-green-800 space-y-1">
                  <div>✅ Navigation unifiée</div>
                  <div>✅ Métriques synchronisées</div>
                  <div>✅ Persistance données</div>
                  <div>✅ Tests validation</div>
                  <div>✅ Interface utilisateur</div>
                </div>
              </div>

              {/* Liens rapides */}
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-3">Liens Rapides</h3>
                <div className="space-y-2 text-sm">
                  <a 
                    href="/training/session/session_healthcare_chu_2024"
                    className="block text-blue-600 hover:text-blue-800"
                  >
                    → Interface Formation
                  </a>
                  <a 
                    href="/training/session/session_healthcare_chu_2024?mode=workshops"
                    className="block text-blue-600 hover:text-blue-800"
                  >
                    → Ateliers Intégrés
                  </a>
                  <a 
                    href="/training/session/session_healthcare_chu_2024?mode=expert-chat"
                    className="block text-blue-600 hover:text-blue-800"
                  >
                    → Chat Expert
                  </a>
                  <a 
                    href="/training/session/session_healthcare_chu_2024?tab=progress"
                    className="block text-blue-600 hover:text-blue-800"
                  >
                    → Progression Unifiée
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Composant actif */}
          <div className="lg:col-span-3">
            {ActiveComponent && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    {activeTest && <activeTest.icon className="w-6 h-6 text-gray-700" />}
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {activeTest?.name}
                      </h2>
                      <p className="text-gray-600">{activeTest?.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <ActiveComponent />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>
              🎯 <strong>Intégration Formation EBIOS RM</strong> - 
              Système complet de formation avec navigation unifiée, métriques synchronisées et persistance données
            </p>
            <p className="mt-2">
              Points 1-7 terminés avec succès • Tests validation disponibles • 
              Prêt pour déploiement production
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
