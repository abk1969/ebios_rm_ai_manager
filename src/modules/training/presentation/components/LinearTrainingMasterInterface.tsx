/**
 * 🎓 INTERFACE MAÎTRE DE FORMATION LINÉAIRE
 * Composant principal unifié pour le parcours EBIOS RM
 * Remplace la complexité actuelle par une interface claire et intuitive
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  Clock, 
  Target, 
  Award, 
  Settings,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { 
  TrainingStep, 
  UserTrainingState 
} from '../../domain/entities/LinearTrainingPath';
import { LinearTrainingOrchestrator, OrchestrationEvent } from '../../domain/services/LinearTrainingOrchestrator';
import { LinearNavigationInterface } from './LinearNavigationInterface';
import { IntelligentGuidanceInterface } from './IntelligentGuidanceInterface';
// import { ProgressIndicatorSystem } from './ProgressIndicatorSystem';
// import { ContextualHelpSystem } from './ContextualHelpSystem';

// 🎯 PROPS DU COMPOSANT MAÎTRE
interface LinearTrainingMasterInterfaceProps {
  userId: string;
  sessionId: string;
  initialStep?: TrainingStep;
  onComplete?: (certificate: any) => void;
  onExit?: (progress: any) => void;
  className?: string;
}

// 🎯 ÉTAT DE L'INTERFACE
interface InterfaceState {
  isLoading: boolean;
  currentStep: TrainingStep;
  stepContent: any;
  isFullscreen: boolean;
  soundEnabled: boolean;
  showSettings: boolean;
  showHelp: boolean;
  error?: string;
}

// 🎯 COMPOSANT PRINCIPAL
export const LinearTrainingMasterInterface: React.FC<LinearTrainingMasterInterfaceProps> = ({
  userId,
  sessionId,
  initialStep = TrainingStep.ONBOARDING,
  onComplete,
  onExit,
  className = ''
}) => {
  // 🎯 ÉTATS PRINCIPAUX
  const [orchestrator, setOrchestrator] = useState<LinearTrainingOrchestrator | null>(null);
  const [interfaceState, setInterfaceState] = useState<InterfaceState>({
    isLoading: true,
    currentStep: initialStep,
    stepContent: null,
    isFullscreen: false,
    soundEnabled: true,
    showSettings: false,
    showHelp: false
  });

  // 🏗️ INITIALISATION DE L'ORCHESTRATEUR
  const initializeOrchestrator = useCallback(async () => {
    try {
      setInterfaceState(prev => ({ ...prev, isLoading: true, error: undefined }));

      // Créer l'état utilisateur initial
      const userState: UserTrainingState = {
        userId,
        sessionId,
        currentPath: null as any, // Sera initialisé par l'orchestrateur
        progress: {
          currentStep: initialStep,
          stepProgress: 0,
          globalProgress: 0,
          timeSpent: 0,
          timeSpentCurrentStep: 0,
          scoresPerStep: {},
          scoresPerWorkshop: {},
          validationsCompleted: [],
          certificateEarned: false,
          anssiCompliant: false,
          startedAt: new Date(),
          lastActivityAt: new Date(),
          estimatedTimeRemaining: 160
        },
        completedSteps: [],
        unlockedSteps: [TrainingStep.ONBOARDING],
        currentStepData: {},
        savedAnswers: {},
        attempts: {},
        certificates: [],
        preferences: {
          language: 'fr',
          difficulty: 'intermediate',
          learningStyle: 'mixed',
          pacePreference: 'normal',
          notificationsEnabled: true,
          autoSaveEnabled: true
        }
      };

      // Créer l'orchestrateur
      const newOrchestrator = new LinearTrainingOrchestrator(userState, {
        autoSave: true,
        autoSaveInterval: 30000,
        sessionTimeout: 3600000,
        enableAnalytics: true,
        strictValidation: true,
        anssiMode: true
      });

      // Configurer les listeners
      newOrchestrator.addEventListener('orchestration', handleOrchestrationEvent);

      setOrchestrator(newOrchestrator);
      
      // Démarrer l'étape initiale
      await newOrchestrator.startStep(initialStep);

      setInterfaceState(prev => ({ 
        ...prev, 
        isLoading: false,
        currentStep: initialStep
      }));

    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      setInterfaceState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Erreur lors de l\'initialisation de la formation' 
      }));
    }
  }, [userId, sessionId, initialStep]);

  // 🎧 GESTIONNAIRE D'ÉVÉNEMENTS D'ORCHESTRATION
  const handleOrchestrationEvent = useCallback((event: OrchestrationEvent) => {
    switch (event.type) {
      case 'step_changed':
        setInterfaceState(prev => ({
          ...prev,
          currentStep: event.data.toStep,
          stepContent: event.data.stepContent
        }));
        break;

      case 'progress_updated':
        // Mise à jour automatique via l'orchestrateur
        break;

      case 'validation_completed':
        if (event.data.validationResult.canProceed) {
          // Célébration de réussite
          playSuccessSound();
        }
        break;

      case 'session_ended':
        handleSessionEnd(event.data);
        break;

      case 'error_occurred':
        setInterfaceState(prev => ({
          ...prev,
          error: event.data.message
        }));
        break;
    }
  }, []);

  // 🎵 GESTION DU SON
  const playSuccessSound = () => {
    if (interfaceState.soundEnabled) {
      // Jouer un son de succès
      const audio = new Audio('/sounds/success.mp3');
      audio.play().catch(() => {
        // Ignorer les erreurs de lecture audio
      });
    }
  };

  // 🚪 GESTION DE FIN DE SESSION
  const handleSessionEnd = (data: any) => {
    if (data.reason === 'completion') {
      onComplete?.(data.certificate);
    } else {
      onExit?.(data.progress);
    }
  };

  // 🎮 GESTIONNAIRES D'ACTIONS
  const handleStepChange = async (step: TrainingStep) => {
    if (!orchestrator) return;

    try {
      setInterfaceState(prev => ({ ...prev, isLoading: true }));
      await orchestrator.startStep(step);
    } catch (error) {
      console.error('Erreur changement d\'étape:', error);
    } finally {
      setInterfaceState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleProgressUpdate = async (progress: number, timeSpent: number = 0) => {
    if (!orchestrator) return;

    await orchestrator.updateProgress(interfaceState.currentStep, progress, timeSpent);
  };

  const handleValidation = async (answers: Record<string, any>, timeSpent: number) => {
    if (!orchestrator) return;

    try {
      setInterfaceState(prev => ({ ...prev, isLoading: true }));
      const result = await orchestrator.validateStep(interfaceState.currentStep, answers, timeSpent);
      
      if (result.success && result.nextAction === 'proceed_next_step') {
        await orchestrator.proceedToNextStep();
      }
      
      return result;
    } catch (error) {
      console.error('Erreur validation:', error);
      return { success: false, message: 'Erreur lors de la validation' };
    } finally {
      setInterfaceState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const toggleFullscreen = () => {
    setInterfaceState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  };

  const toggleSound = () => {
    setInterfaceState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const toggleSettings = () => {
    setInterfaceState(prev => ({ ...prev, showSettings: !prev.showSettings }));
  };

  const toggleHelp = () => {
    setInterfaceState(prev => ({ ...prev, showHelp: !prev.showHelp }));
  };

  // 🏗️ INITIALISATION AU MONTAGE
  useEffect(() => {
    initializeOrchestrator();

    // Nettoyage au démontage
    return () => {
      if (orchestrator) {
        orchestrator.destroy();
      }
    };
  }, [initializeOrchestrator]);

  // ⌨️ GESTION DES RACCOURCIS CLAVIER GLOBAUX
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // F11 : Plein écran
      if (event.key === 'F11') {
        event.preventDefault();
        toggleFullscreen();
      }
      
      // Ctrl+H : Aide
      if (event.ctrlKey && event.key === 'h') {
        event.preventDefault();
        toggleHelp();
      }
      
      // Ctrl+, : Paramètres
      if (event.ctrlKey && event.key === ',') {
        event.preventDefault();
        toggleSettings();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 🔄 AFFICHAGE DE CHARGEMENT
  if (interfaceState.isLoading && !orchestrator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Initialisation de votre formation EBIOS RM
          </h2>
          <p className="text-gray-600">
            Préparation de votre parcours personnalisé...
          </p>
          <div className="mt-4 w-64 bg-gray-200 rounded-full h-2 mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // ❌ AFFICHAGE D'ERREUR
  if (interfaceState.error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-900 mb-2">
            Erreur de formation
          </h2>
          <p className="text-red-700 mb-6">
            {interfaceState.error}
          </p>
          <button
            onClick={initializeOrchestrator}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // 📱 DÉTECTION MOBILE
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 🎯 CLASSES CSS PRINCIPALES
  const containerClasses = `
    ${interfaceState.isFullscreen
      ? 'fixed inset-0 z-50 bg-white'
      : 'min-h-screen bg-gradient-to-br from-blue-50 to-green-50'
    }
    ${isMobile ? 'mobile-optimized' : ''}
    ${className}
  `;

  return (
    <div className={containerClasses}>
      {/* 🎛️ BARRE D'OUTILS SUPÉRIEURE */}
      <div className={`bg-white border-b border-gray-200 ${isMobile ? 'px-4 py-2' : 'px-6 py-3'} flex items-center justify-between`}>
        <div className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-4'}`}>
          <div className="flex items-center space-x-2">
            <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center`}>
              <BookOpen className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-white`} />
            </div>
            <h1 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-900`}>
              {isMobile ? 'EBIOS RM' : 'Formation EBIOS RM'}
            </h1>
          </div>

          {/* Indicateur de session - masqué sur mobile */}
          {!isMobile && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Session: {sessionId}</span>
            </div>
          )}
        </div>

        {/* Contrôles */}
        <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'}`}>
          {/* Son - masqué sur mobile */}
          {!isMobile && (
            <button
              onClick={toggleSound}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-all"
              title={interfaceState.soundEnabled ? "Désactiver le son" : "Activer le son"}
            >
              {interfaceState.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={toggleSettings}
            className={`${isMobile ? 'p-1.5' : 'p-2'} text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-all`}
            title="Paramètres"
          >
            <Settings className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
          </button>

          {/* Plein écran - masqué sur mobile */}
          {!isMobile && (
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-all"
              title={interfaceState.isFullscreen ? "Quitter le plein écran (F11)" : "Plein écran (F11)"}
            >
              {interfaceState.isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* 📊 SYSTÈME D'INDICATEURS DE PROGRESSION */}
      {/* Temporairement désactivé pour le build
      {orchestrator && (
        <ProgressIndicatorSystem
          orchestrator={orchestrator}
          currentStep={interfaceState.currentStep}
          compact={interfaceState.isFullscreen}
        />
      )}
      */}

      {/* 🧭 NAVIGATION LINÉAIRE */}
      {orchestrator && (
        <LinearNavigationInterface
          navigationService={orchestrator['navigationService']}
          onStepChange={handleStepChange}
          onHelpRequest={toggleHelp}
          onExitRequest={() => onExit?.(orchestrator.getFullState().progress)}
          showBreadcrumb={!interfaceState.isFullscreen}
          showProgress={false} // Géré par ProgressIndicatorSystem
          showTimeEstimate={true}
        />
      )}

      {/* 📚 CONTENU PRINCIPAL DE L'ÉTAPE */}
      <main className={`flex-1 ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className={`${isMobile ? 'max-w-full' : 'max-w-4xl'} mx-auto`}>
          {/* Le contenu spécifique de chaque étape sera rendu ici */}
          <StepContentRenderer
            step={interfaceState.currentStep}
            content={interfaceState.stepContent}
            onProgressUpdate={handleProgressUpdate}
            onValidation={handleValidation}
            isLoading={interfaceState.isLoading}
          />
        </div>
      </main>

      {/* 🧠 GUIDAGE INTELLIGENT */}
      {orchestrator && (
        <IntelligentGuidanceInterface
          guidanceService={orchestrator['guidanceService']}
          currentStep={interfaceState.currentStep}
          stepProgress={orchestrator.getFullState().progress.stepProgress}
          timeSpent={orchestrator.getFullState().progress.timeSpentCurrentStep}
          lastScore={orchestrator.getFullState().progress.scoresPerStep[interfaceState.currentStep]}
          position={interfaceState.isFullscreen ? 'fixed' : 'fixed'}
          minimizable={true}
        />
      )}

      {/* 🆘 SYSTÈME D'AIDE CONTEXTUELLE */}
      {/* Temporairement désactivé pour le build
      {interfaceState.showHelp && orchestrator && (
        <ContextualHelpSystem
          currentStep={interfaceState.currentStep}
          onClose={toggleHelp}
          orchestrator={orchestrator}
        />
      )}
      */}

      {/* ⚙️ PANNEAU DE PARAMÈTRES */}
      {interfaceState.showSettings && (
        <SettingsPanel
          onClose={toggleSettings}
          soundEnabled={interfaceState.soundEnabled}
          onSoundToggle={toggleSound}
          orchestrator={orchestrator}
        />
      )}
    </div>
  );
};

// 🎯 COMPOSANT DE RENDU DU CONTENU D'ÉTAPE
interface StepContentRendererProps {
  step: TrainingStep;
  content: any;
  onProgressUpdate: (progress: number, timeSpent?: number) => void;
  onValidation: (answers: Record<string, any>, timeSpent: number) => Promise<any>;
  isLoading: boolean;
}

const StepContentRenderer: React.FC<StepContentRendererProps> = ({
  step,
  content,
  onProgressUpdate,
  onValidation,
  isLoading
}) => {
  // Placeholder pour le contenu spécifique de chaque étape
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center py-12">
        <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Étape {step} - Contenu en cours de développement
        </h2>
        <p className="text-gray-600">
          Le contenu spécifique de cette étape sera intégré dans la prochaine phase.
        </p>
        {isLoading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

// 🎯 COMPOSANT PANNEAU DE PARAMÈTRES (Placeholder)
interface SettingsPanelProps {
  onClose: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  orchestrator: LinearTrainingOrchestrator | null;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose, soundEnabled, onSoundToggle }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Paramètres</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Son activé</span>
              <button
                onClick={onSoundToggle}
                className={`w-12 h-6 rounded-full ${soundEnabled ? 'bg-blue-600' : 'bg-gray-300'} relative transition-colors`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinearTrainingMasterInterface;
