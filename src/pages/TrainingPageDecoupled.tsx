/**
 * 🎓 PAGE FORMATION DÉCOUPLÉE - ARCHITECTURE INDÉPENDANTE
 * Nouvelle implémentation avec module de formation complètement isolé
 * Respect des exigences RSSI et meilleures pratiques architecturales
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, BookOpen, Users, Award, Clock, Shield, ExternalLink, Settings } from 'lucide-react';
import { TrainingModuleEmbed } from '@/modules/training-standalone/components/TrainingModuleEmbed';
import { TrainingModuleSimple } from '@/modules/training-standalone/components/TrainingModuleSimple';
import { TrainingConfigService } from '@/modules/training-standalone/services/TrainingConfigService';
import type { TrainingConfig, TrainingSession } from '@/modules/training-standalone/gateway/TrainingGateway';

// 🎯 TYPES LOCAUX
interface TrainingPageState {
  isConfigured: boolean;
  currentSession: TrainingSession | null;
  availableSectors: Array<{
    id: string;
    name: string;
    description: string;
    level: string;
  }>;
  userProfile: {
    id: string;
    name: string;
    role: string;
    organization: string;
  } | null;
}

// 🎓 COMPOSANT PRINCIPAL
const TrainingPageDecoupled: React.FC = () => {
  // 🎯 HOOKS
  const navigate = useNavigate();
  const [state, setState] = useState<TrainingPageState>({
    isConfigured: false,
    currentSession: null,
    availableSectors: [],
    userProfile: null
  });
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [showEmbed, setShowEmbed] = useState(false);

  // 🔧 INITIALISATION
  useEffect(() => {
    const initializeTrainingModule = async () => {
      try {
        // Charger la configuration
        const configService = TrainingConfigService.getInstance();
        await configService.loadEnvironmentConfig(
          process.env.NODE_ENV === 'production' ? 'production' : 'development'
        );

        // Charger les secteurs disponibles
        const sectors = configService.getAllSectorConfigs().map(sector => ({
          id: sector.id,
          name: sector.name,
          description: `Formation spécialisée ${sector.name}`,
          level: sector.certificationLevel
        }));

        // Simuler un profil utilisateur (en production, récupéré depuis l'auth)
        const userProfile = {
          id: 'user_123',
          name: 'Expert RSSI',
          role: 'RSSI',
          organization: 'Organisation Test'
        };

        setState(prev => ({
          ...prev,
          isConfigured: true,
          availableSectors: sectors,
          userProfile
        }));

      } catch (error) {
        console.error('❌ Erreur d\'initialisation du module de formation:', error);
      }
    };

    initializeTrainingModule();
  }, []);

  // 🎯 GESTION DES ÉVÉNEMENTS
  const handleStartTraining = () => {
    if (!selectedSector || !state.userProfile) return;
    setShowEmbed(true);
  };

  const handleSessionCreated = (session: TrainingSession) => {
    setState(prev => ({
      ...prev,
      currentSession: session
    }));
    console.log('✅ Session de formation créée:', session.id);
  };

  const handleProgress = (progress: any) => {
    console.log('📊 Progression mise à jour:', progress);
  };

  const handleCompleted = (results: any) => {
    console.log('🎉 Formation terminée:', results);
    setShowEmbed(false);
    setState(prev => ({
      ...prev,
      currentSession: null
    }));
  };

  const handleError = (error: Error) => {
    console.error('❌ Erreur de formation:', error);
    // Ici, on pourrait afficher une notification d'erreur
  };

  // 🎨 RENDU DU SÉLECTEUR DE FORMATION
  const renderTrainingSelector = () => (
    <div className="max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Shield className="h-12 w-12 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Formation EBIOS RM Interactive
          </h1>
        </div>
        <p className="text-lg text-gray-600">
          Module de formation découplé et sécurisé - Conforme ANSSI
        </p>
        <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
          <Shield className="h-4 w-4 mr-2" />
          Module isolé et sécurisé
        </div>
      </div>

      {/* Sélection du secteur */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Choisissez votre secteur d'activité
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.availableSectors.map((sector) => (
            <div
              key={sector.id}
              className={`
                p-4 border-2 rounded-lg cursor-pointer transition-all
                ${selectedSector === sector.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              onClick={() => setSelectedSector(sector.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{sector.name}</h3>
                <span className={`
                  px-2 py-1 rounded text-xs font-medium
                  ${sector.level === 'expert' ? 'bg-red-100 text-red-800' :
                    sector.level === 'advanced' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'}
                `}>
                  {sector.level}
                </span>
              </div>
              <p className="text-sm text-gray-600">{sector.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sélection du niveau */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Niveau d'expérience
        </h2>
        <div className="flex space-x-4">
          {[
            { value: 'beginner', label: 'Débutant', desc: 'Première approche EBIOS RM' },
            { value: 'intermediate', label: 'Intermédiaire', desc: 'Connaissances de base en cyber' },
            { value: 'advanced', label: 'Avancé', desc: 'Expert en cybersécurité' }
          ].map((level) => (
            <label
              key={level.value}
              className={`
                flex-1 p-4 border-2 rounded-lg cursor-pointer transition-all
                ${selectedLevel === level.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <input
                type="radio"
                name="level"
                value={level.value}
                checked={selectedLevel === level.value}
                onChange={(e) => setSelectedLevel(e.target.value as any)}
                className="sr-only"
              />
              <div className="text-center">
                <div className="font-medium text-gray-900 mb-1">{level.label}</div>
                <div className="text-sm text-gray-600">{level.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Informations sur la formation */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          À propos de cette formation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-blue-600 mr-2" />
            <span>Durée: 8-12 heures</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
            <span>5 ateliers interactifs</span>
          </div>
          <div className="flex items-center">
            <Award className="h-5 w-5 text-blue-600 mr-2" />
            <span>Certification ANSSI</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-white rounded border border-blue-200">
          <p className="text-blue-800 text-sm">
            <strong>Module découplé:</strong> Cette formation utilise un module complètement 
            indépendant et sécurisé, isolé de l'application principale pour garantir 
            la sécurité et la conformité RSSI.
          </p>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au tableau de bord
        </button>

        <div className="flex space-x-3">
          <button
            onClick={() => window.open('https://training.ebios-app.com', '_blank')}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ouvrir en externe
          </button>

          <button
            onClick={handleStartTraining}
            disabled={!selectedSector}
            className={`
              flex items-center px-6 py-3 rounded-lg font-medium transition-colors
              ${selectedSector
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            <Play className="h-5 w-5 mr-2" />
            Commencer la formation
          </button>
        </div>
      </div>
    </div>
  );

  // 🎯 RENDU PRINCIPAL
  if (!state.isConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Initialisation du module de formation
          </h2>
          <p className="text-gray-600">
            Configuration du système découplé en cours...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {showEmbed && selectedSector && state.userProfile ? (
          <TrainingModuleSimple
            learnerId={state.userProfile.id}
            config={{
              learnerId: state.userProfile.id,
              sector: selectedSector,
              level: selectedLevel,
              objectives: ['Maîtriser EBIOS RM', 'Appliquer la méthodologie', 'Obtenir la certification']
            }}
            onSessionCreated={(sessionId) => {
              const session = {
                id: sessionId,
                learnerId: state.userProfile!.id,
                status: 'active' as const,
                config: {
                  learnerId: state.userProfile!.id,
                  sector: selectedSector as any,
                  level: selectedLevel,
                  objectives: ['Maîtriser EBIOS RM', 'Appliquer la méthodologie', 'Obtenir la certification']
                },
                progress: { currentWorkshop: 1, completionPercentage: 0, timeSpent: 0, milestones: [] },
                embedUrl: '',
                createdAt: new Date(),
                updatedAt: new Date()
              };
              handleSessionCreated(session);
            }}
            onProgress={handleProgress}
            onCompleted={handleCompleted}
            onError={handleError}
            className="w-full"
            height="900px"
          />
        ) : (
          renderTrainingSelector()
        )}
      </div>
    </div>
  );
};

export default TrainingPageDecoupled;
