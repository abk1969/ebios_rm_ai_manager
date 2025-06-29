import React, { useState, useEffect } from 'react';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  TrendingUp, 
  Lightbulb,
  Shield,
  Target,
  Users,
  Lock,
  Zap,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/button';
import AIActivationService from '@/services/ai/AIActivationService';
import RealAIStatusService, { RealAIStatus } from '@/services/ai/RealAIStatusService';

interface AIAnalysisStatus {
  hasAI: boolean;
  confidence?: number;
  lastUpdate?: string;
  suggestions?: string[];
  issues?: string[];
  score?: number;
}

interface AIStatusData {
  businessValues: AIAnalysisStatus;
  dreadedEvents: AIAnalysisStatus;
  riskSources: AIAnalysisStatus;
  attackPaths: AIAnalysisStatus;
  securityMeasures: AIAnalysisStatus;
}

interface AIStatusPanelProps {
  missionId?: string;
}

/**
 * 🤖 PANNEAU D'ÉTAT IA - DONNÉES RÉELLES UNIQUEMENT
 * Interface utilisateur basée sur métriques EBIOS RM réelles
 * CONFORMITÉ ANSSI: Aucune donnée fictive tolérée
 */
export const AIStatusPanel: React.FC<AIStatusPanelProps> = ({ missionId }) => {
  const [aiStatus, setAiStatus] = useState<RealAIStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [activatingAI, setActivatingAI] = useState(false);

  useEffect(() => {
    if (missionId) {
      loadRealAIStatus();
    }
  }, [missionId]);

  /**
   * Charge le statut IA réel basé sur les métriques EBIOS RM
   */
  const loadRealAIStatus = async () => {
    if (!missionId) {
      console.warn('⚠️ Aucun missionId fourni pour le statut IA');
      return;
    }

    setLoading(true);

    try {
      console.log(`🤖 Calcul du statut IA réel pour mission: ${missionId}`);

      // Calcul du statut IA basé sur les données réelles
      const realStatus = await RealAIStatusService.calculateRealAIStatus(missionId);

      setAiStatus(realStatus);
      setLastRefresh(new Date());

      console.log('✅ Statut IA réel chargé avec succès');

    } catch (error) {
      console.error('❌ Erreur chargement statut IA réel:', error);
      // En cas d'erreur, statut vide
      setAiStatus(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Active l'IA sur tous les composants manquants
   */
  const activateAIForAll = async () => {
    setActivatingAI(true);

    try {
      console.log('🚀 Activation IA pour tous les composants...');
      const result = await AIActivationService.activateAIForAllComponents();

      if (result.success) {
        console.log('✅ IA activée avec succès:', result);
        // Recharger les données après activation
        await loadRealAIStatus();
      } else {
        console.error('❌ Erreurs lors de l\'activation:', result.errors);
      }

    } catch (error) {
      console.error('❌ Erreur activation IA:', error);
    } finally {
      setActivatingAI(false);
    }
  };

  const getComponentIcon = (component: string) => {
    const icons = {
      businessValues: Target,
      dreadedEvents: AlertTriangle,
      riskSources: Users,
      attackPaths: Zap,
      securityMeasures: Shield
    };
    return icons[component as keyof typeof icons] || Info;
  };

  const getComponentTitle = (component: string) => {
    const titles = {
      businessValues: 'Valeurs Métier',
      dreadedEvents: 'Événements Redoutés',
      riskSources: 'Sources de Risque',
      attackPaths: 'Chemins d\'Attaque',
      securityMeasures: 'Mesures de Sécurité'
    };
    return titles[component as keyof typeof titles] || component;
  };

  const getComponentDescription = (component: string) => {
    const descriptions = {
      businessValues: 'Analyse et enrichissement automatique des biens essentiels',
      dreadedEvents: 'Évaluation intelligente des risques et impacts',
      riskSources: 'Profilage avancé des sources de menace',
      attackPaths: 'Génération et validation de scénarios d\'attaque',
      securityMeasures: 'Optimisation et priorisation des mesures'
    };
    return descriptions[component as keyof typeof descriptions] || '';
  };

  // Affichage de chargement ou absence de données
  if (loading || !aiStatus) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600">
            {missionId ? 'Calcul des métriques IA réelles...' : 'Sélectionnez une mission pour voir l\'état de l\'IA'}
          </span>
        </div>
      </div>
    );
  }

  const components = aiStatus.components;
  const totalComponents = Object.keys(components).length;
  const activeComponents = Object.values(components).filter(comp => comp.active).length;
  const globalScore = aiStatus.globalScore;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Brain className="h-6 w-6 text-blue-600 mr-3" />
            État de l'Intelligence Artificielle
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Analyse automatique et assistance IA pour votre étude EBIOS RM
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Score global */}
          <div className="text-center">
            <div className={cn(
              'text-2xl font-bold',
              globalScore >= 80 ? 'text-green-600' :
              globalScore >= 50 ? 'text-yellow-600' : 'text-red-600'
            )}>
              {globalScore}%
            </div>
            <div className="text-xs text-gray-500">Couverture IA</div>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadRealAIStatus}
              disabled={loading || activatingAI}
              className="flex items-center gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              Actualiser
            </Button>

            {globalScore < 100 && (
              <Button
                size="sm"
                onClick={activateAIForAll}
                disabled={loading || activatingAI}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Brain className={cn("h-4 w-4", activatingAI && "animate-pulse")} />
                {activatingAI ? 'Activation...' : 'Activer l\'IA'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Grille des composants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(components).map(([component, status]) => {
          const Icon = getComponentIcon(component);
          const title = getComponentTitle(component);
          const description = getComponentDescription(component);
          
          return (
            <div
              key={component}
              className={cn(
                'border rounded-lg p-4 transition-all duration-200',
                status.active
                  ? 'border-green-200 bg-green-50 hover:bg-green-100'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              )}
            >
              {/* En-tête du composant */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <Icon className={cn(
                    'h-5 w-5 mr-2',
                    status.active ? 'text-green-600' : 'text-gray-400'
                  )} />
                  <div>
                    <h4 className="font-medium text-sm text-gray-900">{title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{description}</p>
                  </div>
                </div>
                
                {status.active ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </div>

              {/* Statut et score */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className={cn(
                    'font-medium',
                    status.active ? 'text-green-700' : 'text-gray-600'
                  )}>
                    {status.active ? 'IA Active' : 'IA Inactive'}
                  </span>
                  <span className="text-gray-600">{status.coverage}%</span>
                </div>
                
                <div className="mt-1 text-xs text-gray-500">
                  Confiance: {status.confidence}% • Dernière analyse: {new Date(status.lastAnalysis).toLocaleDateString('fr-FR')}
                </div>
              </div>

              {/* Suggestions */}
              {status.suggestions && status.suggestions.length > 0 && (
                <div className="space-y-1">
                  {status.suggestions.slice(0, 2).map((suggestion, index) => (
                    <div key={index} className="flex items-start text-xs">
                      <Lightbulb className="h-3 w-3 text-yellow-500 mr-1 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Résumé et actions */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{activeComponents}/{totalComponents}</span> composants avec IA active
            <span className="mx-2">•</span>
            Dernière mise à jour: {lastRefresh.toLocaleTimeString('fr-FR')}
          </div>
          
          {globalScore < 100 && !activatingAI && (
            <div className="flex items-center text-sm text-blue-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Cliquez sur "Activer l'IA" pour une analyse complète de tous les composants</span>
            </div>
          )}

          {activatingAI && (
            <div className="flex items-center text-sm text-orange-600">
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              <span>Activation de l'IA en cours... Génération des métadonnées d'analyse</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIStatusPanel;
