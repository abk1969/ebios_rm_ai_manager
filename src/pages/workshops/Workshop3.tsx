import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  getStrategicScenarios, 
  createStrategicScenario, 
  StrategicScenarioUtils 
} from '@/services/firebase/strategicScenarios';
import { getRiskSources } from '@/services/firebase/riskSources';
import { getDreadedEvents } from '@/services/firebase/dreadedEvents';
import { getBusinessValuesByMission } from '@/services/firebase/businessValues';
import { getMissionById, updateMission } from '@/services/firebase/missions';
import {
  WORKSHOP_VALIDATION_CRITERIA,
  EbiosUtils,
  EBIOS_SCALES,
  RISK_MATRIX
} from '@/lib/ebios-constants';
import { getRelevantControls } from '@/lib/security-frameworks';
import AICoherenceIndicator from '@/components/ai/AICoherenceIndicator';
import Button from '@/components/ui/button';
import { 
  Crosshair, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  AlertTriangle,
  Info,
  Target,
  BarChart3,
  TrendingUp,
  Eye,
  Lightbulb
} from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import WorkshopNavigation from '@/components/workshops/WorkshopNavigation';
import type { 
  StrategicScenario,
  RiskSource,
  DreadedEvent,
  BusinessValue,
  Mission,
  LikelihoodScale,
  GravityScale,
  RiskLevel,
  WorkshopValidation
} from '@/types/ebios';

const Workshop3 = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  // 🔧 CORRECTION: Support des deux méthodes de récupération du missionId
  const missionId = params.missionId || searchParams.get('missionId');
  
  // États pour les données
  const [strategicScenarios, setStrategicScenarios] = useState<StrategicScenario[]>([]);
  const [riskSources, setRiskSources] = useState<RiskSource[]>([]);
  const [dreadedEvents, setDreadedEvents] = useState<DreadedEvent[]>([]);
  const [businessValues, setBusinessValues] = useState<BusinessValue[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<any>(null);
  
  // États pour les modales et sélections
  const [isAddScenarioModalOpen, setIsAddScenarioModalOpen] = useState(false);
  const [selectedRiskSourceId, setSelectedRiskSourceId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedScenarios, setSuggestedScenarios] = useState<Partial<StrategicScenario>[]>([]);
  
  // États généraux
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mission, setMission] = useState<Mission | null>(null);
  const [validationResults, setValidationResults] = useState<WorkshopValidation[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  if (!missionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">ID de mission requis</h3>
          <p className="text-gray-500 mb-6">Sélectionnez d'abord une mission pour accéder à l'Atelier 3</p>
          <Button
            onClick={() => window.history.back()}
            variant="secondary"
          >
            Retour
          </Button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (missionId) {
          const [missionData, scenarios, sources, events, values] = await Promise.all([
            getMissionById(missionId),
            getStrategicScenarios(missionId),
            getRiskSources(missionId),
            getDreadedEvents(missionId),
            getBusinessValuesByMission(missionId)
          ]);
          
          if (missionData) {
            setMission(missionData);
            setStrategicScenarios(scenarios);
            setRiskSources(sources);
            setDreadedEvents(events);
            setBusinessValues(values);
            
            // Calcul des métriques de risque
            const metrics = StrategicScenarioUtils.calculateRiskMetrics(scenarios);
            setRiskMetrics(metrics);
            
            validateWorkshopCompletion(scenarios, sources, events);
            
            // Générer des suggestions si pas de scénarios
            if (scenarios.length === 0 && sources.length > 0 && events.length > 0) {
              const suggestions = StrategicScenarioUtils.generateSuggestedScenarios(
                sources, events, values
              );
              setSuggestedScenarios(suggestions);
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }
          } else {
            setError('Mission non trouvée');
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Échec du chargement des scénarios stratégiques');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [missionId]);

  // Fonction utilitaire pour les couleurs de risque
  const getRiskColor = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case 1: return 'bg-green-100 text-green-800 border-green-200';
      case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 3: return 'bg-orange-100 text-orange-800 border-orange-200';
      case 4: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // 🆕 AMÉLIORATION: Mémoïsation de la fonction de validation
  const validateWorkshopCompletion = useCallback((
    scenarios: StrategicScenario[],
    sources: RiskSource[],
    events: DreadedEvent[]
  ) => {
    // 🔧 CORRECTION: Logs conditionnels uniquement en développement
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Workshop3 - Validation des critères:', { scenarios: scenarios.length, sources: sources.length, events: events.length });
    }
    
    const criteria = WORKSHOP_VALIDATION_CRITERIA[3];
    const results: WorkshopValidation[] = criteria.map(criterion => {
      let met = false;
      let evidence = '';

      switch (criterion.criterion) {
        case 'Scénarios stratégiques construits':
          met = scenarios.length >= 1;
          evidence = `${scenarios.length} scénario(s) stratégique(s) construit(s)`;
          break;
        case 'Chemins d\'attaque identifiés':
          met = true; // Toujours validé dans l'atelier 3
          evidence = "Sera détaillé dans l'Atelier 4 - Scénarios Opérationnels";
          break;
        case 'Vraisemblance évaluée':
          met = scenarios.length > 0 && scenarios.every(s => s.likelihood >= 1 && s.likelihood <= 4);
          evidence = met ? 'Toutes les vraisemblances évaluées' : 'Évaluations incomplètes';
          break;
        case 'Gravité évaluée':
          met = scenarios.length > 0 && scenarios.every(s => s.gravity >= 1 && s.gravity <= 4);
          evidence = met ? 'Toutes les gravités évaluées' : 'Évaluations incomplètes';
          break;
        case 'Niveau de risque calculé':
          met = scenarios.length > 0 && scenarios.every(s =>
            EbiosUtils.compareRiskLevel(s.riskLevel, 1, '>=') &&
            EbiosUtils.compareRiskLevel(s.riskLevel, 4, '<=')
          );
          evidence = met ? 'Tous les niveaux de risque calculés' : 'Calculs incomplets';
          break;
      }

      // 🔧 CORRECTION: Logs conditionnels uniquement en développement
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 Critère "${criterion.criterion}": ${met ? '✅' : '❌'} - ${evidence}`);
      }
      
      return {
        criterion: criterion.criterion,
        required: criterion.required,
        met,
        evidence
      };
    });

    setValidationResults(results);
    
    // 🔥 GÉNÉRATION INTELLIGENTE DES SUGGESTIONS IA
    if (sources.length > 0 && events.length > 0 && businessValues.length > 0) {
      // 🔧 CORRECTION: Logs conditionnels uniquement en développement
      if (process.env.NODE_ENV === 'development') {
        console.log('🤖 Génération des suggestions IA...');
      }
      const suggestions = StrategicScenarioUtils.generateSuggestedScenarios(
        sources, events, businessValues
      );
      if (process.env.NODE_ENV === 'development') {
        console.log('🤖 Suggestions générées:', suggestions.length);
      }
      setSuggestedScenarios(suggestions);
      
      // Afficher les suggestions si pas encore de scénarios créés
      if (scenarios.length === 0 && suggestions.length > 0) {
        setShowSuggestions(true);
      }
    }
  }, [setValidationResults, setSuggestedScenarios, setShowSuggestions, businessValues]);

  const handleCreateScenario = async (data: {
    name: string;
    description: string;
    riskSourceId: string;
    targetBusinessValueId: string;
    dreadedEventId: string;
    likelihood: LikelihoodScale;
    gravity: GravityScale;
  }) => {
    // 🔧 CORRECTION: Logs conditionnels uniquement en développement
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 Workshop3 - handleCreateScenario appelé avec:', data);
      console.log('🎯 Workshop3 - missionId:', missionId);
    }

    try {
      if (missionId) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🎯 Workshop3 - Création du scénario stratégique...');
        }
        const newScenario = await createStrategicScenario({
          ...data,
          missionId,
          pathways: [], // Sera rempli dans atelier 4
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Workshop3 - Scénario créé avec succès:', newScenario);
        }
        
        const updatedScenarios = [...strategicScenarios, newScenario];
        setStrategicScenarios(updatedScenarios);
        
        // Recalculer les métriques
        const metrics = StrategicScenarioUtils.calculateRiskMetrics(updatedScenarios);
        setRiskMetrics(metrics);
        
        setIsAddScenarioModalOpen(false);
        setError('✅ Scénario stratégique créé avec succès !');
        
        // Valider à nouveau
        validateWorkshopCompletion(updatedScenarios, riskSources, dreadedEvents);
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🔄 Workshop3 - Données mises à jour, scénarios:', updatedScenarios.length);
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Workshop3 - missionId manquant');
        }
        setError('ID de mission manquant');
      }
    } catch (error) {
      console.error('❌ Workshop3 - Erreur lors de la création du scénario:', error);
      setError('Échec de la création du scénario stratégique');
    }
  };

  const handleUseSuggestion = async (suggestion: Partial<StrategicScenario>) => {
    if (!suggestion.riskSourceId || !suggestion.targetBusinessValueId || 
        !suggestion.dreadedEventId || !suggestion.likelihood || !suggestion.gravity) {
      return;
    }

    try {
      await handleCreateScenario({
        name: suggestion.name!,
        description: suggestion.description!,
        riskSourceId: suggestion.riskSourceId,
        targetBusinessValueId: suggestion.targetBusinessValueId,
        dreadedEventId: suggestion.dreadedEventId,
        likelihood: suggestion.likelihood,
        gravity: suggestion.gravity
      });
      
      // Retirer la suggestion utilisée
      setSuggestedScenarios(prev => prev.filter(s => s.name !== suggestion.name));
    } catch (error) {
      console.error('Erreur lors de l\'utilisation de la suggestion:', error);
    }
  };

  const handleNext = async () => {
    const requiredCriteria = validationResults.filter(r => r.required);
    const unmetRequiredCriteria = requiredCriteria.filter(r => !r.met);
    
    if (unmetRequiredCriteria.length > 0) {
      setError(`Critères requis non satisfaits : ${unmetRequiredCriteria.map(c => c.criterion).join(', ')}`);
      return false;
    }

    try {
      // Marquer l'atelier 3 comme complété
      if (mission) {
        await updateMission(mission.id, {
          ...mission,
          ebiosCompliance: {
            ...mission.ebiosCompliance,
            completionPercentage: 60 // 60% après atelier 3
          }
        });
      }
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Erreur lors de la sauvegarde des données');
      return false;
    }
  };

  const getValidationIcon = (met: boolean, required: boolean) => {
    if (met) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (required) return <AlertCircle className="h-5 w-5 text-red-500" />;
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  };

  // 🆕 AMÉLIORATION: Mémoïsation des métriques pour optimiser les performances
  const calculatedRiskMetrics = useMemo(() => {
    if (riskMetrics) return riskMetrics;

    return {
      totalScenarios: strategicScenarios.length,
      averageRiskLevel: strategicScenarios.length > 0
        ? Math.round(strategicScenarios.reduce((sum, s) => sum + EbiosUtils.normalizeRiskLevel(EbiosUtils.calculateRiskLevel(s.gravity, s.likelihood)), 0) / strategicScenarios.length * 10) / 10
        : 0,
      criticalScenarios: strategicScenarios.filter(s => EbiosUtils.compareRiskLevel(EbiosUtils.calculateRiskLevel(s.gravity, s.likelihood), 4, '>=')),
      highRiskScenarios: strategicScenarios.filter(s => {
        const risk = EbiosUtils.calculateRiskLevel(s.gravity, s.likelihood);
        return EbiosUtils.compareRiskLevel(risk, 3, '>=') && EbiosUtils.compareRiskLevel(risk, 4, '<');
      }),
      mediumRiskScenarios: strategicScenarios.filter(s => {
        const risk = EbiosUtils.calculateRiskLevel(s.gravity, s.likelihood);
        return EbiosUtils.compareRiskLevel(risk, 2, '>=') && EbiosUtils.compareRiskLevel(risk, 3, '<');
      }),
      lowRiskScenarios: strategicScenarios.filter(s => EbiosUtils.compareRiskLevel(EbiosUtils.calculateRiskLevel(s.gravity, s.likelihood), 2, '<')),
      riskMatrix: []
    };
  }, [strategicScenarios, riskMetrics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête avec aide contextuelle EBIOS RM */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Atelier 3 : Scénarios Stratégiques
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Construire les scénarios de risque en croisant sources de risque et événements redoutés selon EBIOS RM v1.5
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* 🆕 AMÉLIORATION: Indicateur de cohérence IA */}
            <AICoherenceIndicator
              missionId={missionId}
              workshop={3}
              data={{
                strategicScenarios,
                riskSources,
                dreadedEvents,
                businessValues
              }}
              autoRefresh={true}
            />
            <Button
              variant="outline"
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center space-x-2"
            >
              <Info className="h-4 w-4" />
              <span>Aide ANSSI</span>
            </Button>
          </div>
        </div>
        
        {showHelp && (
          <div className="mt-4 p-4 bg-white rounded border">
            <h3 className="font-medium text-gray-900 mb-2">Objectifs de l'Atelier 3 (ANSSI) :</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li><strong>Scénarios stratégiques :</strong> Croiser sources de risque et événements redoutés</li>
              <li><strong>Évaluation de vraisemblance :</strong> Probabilité de réalisation selon échelle ANSSI</li>
              <li><strong>Évaluation de gravité :</strong> Impact sur l'organisation selon échelle ANSSI</li>
              <li><strong>Calcul du niveau de risque :</strong> Matrice ANSSI (gravité × vraisemblance)</li>
              <li><strong>Priorisation :</strong> Identifier les scénarios les plus critiques</li>
            </ul>
          </div>
        )}
      </div>

      {/* Tableau de bord de progression */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">État d'Avancement - Atelier 3</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {validationResults.map((result, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
              {getValidationIcon(result.met, result.required)}
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{result.criterion}</div>
                <div className="text-xs text-gray-500">{result.evidence}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="text-sm text-gray-600">
            Completion : {Math.round((validationResults.filter(r => r.met).length / validationResults.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Métriques de risque */}
      {calculatedRiskMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{calculatedRiskMetrics.totalScenarios}</div>
                <div className="text-sm text-gray-500">Scénarios Totaux</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{calculatedRiskMetrics.averageRiskLevel.toFixed(1)}</div>
                <div className="text-sm text-gray-500">Risque Moyen</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{calculatedRiskMetrics.criticalScenarios.length}</div>
                <div className="text-sm text-gray-500">Scénarios Critiques</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round((calculatedRiskMetrics.criticalScenarios.length / Math.max(1, calculatedRiskMetrics.totalScenarios)) * 100)}%
                </div>
                <div className="text-sm text-gray-500">Taux Critique</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className={`rounded-md p-4 ${error.includes('💡') ? 'bg-blue-50 border border-blue-200' : 'bg-red-50'}`}>
          <div className="flex">
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${error.includes('💡') ? 'text-blue-800' : 'text-red-800'}`}>
                {error}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions IA */}
      {showSuggestions && suggestedScenarios.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Lightbulb className="h-6 w-6 text-blue-500" />
              <h3 className="ml-2 text-lg font-medium text-gray-900">Suggestions IA</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSuggestions(false)}
            >
              Masquer
            </Button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Scénarios stratégiques suggérés basés sur vos sources de risque et événements redoutés :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedScenarios.slice(0, 6).map((suggestion, index) => (
              <div key={index} className="bg-white border rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{suggestion.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex space-x-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Gravité: {suggestion.gravity}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      Vraisemblance: {suggestion.likelihood}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getRiskColor(suggestion.riskLevel || 1)}`}>
                      Risque: {suggestion.riskLevel}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {/* 🆕 AMÉLIORATION: Bouton contrôles de sécurité */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const controls = getRelevantControls('Workshop3', 'preventive', ['scenario', 'strategic']);
                        const controlsText = controls.map(c =>
                          `${c.framework}:\n${c.controls.slice(0, 2).join('\n')}`
                        ).join('\n\n');
                        alert(`🛡️ Contrôles de sécurité recommandés pour "${suggestion.name}" :\n\n${controlsText}\n\n💡 Ces contrôles sont basés sur ISO 27002, NIST CSF et CIS Controls`);
                      }}
                      className="text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    >
                      🛡️ Contrôles
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleUseSuggestion(suggestion)}
                      className="ml-2"
                    >
                      Utiliser
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions IA pour les scénarios stratégiques */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow p-6 border border-purple-200">
        <div className="flex items-start">
          <Lightbulb className="h-6 w-6 text-purple-500 mt-1" />
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              💡 Assistant IA - Suggestions pour l'Atelier 3
            </h3>
            <div className="space-y-4">
              {/* Suggestions basées sur les données disponibles */}
              {riskSources.length > 0 && businessValues.length > 0 && dreadedEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Suggestion de croisement optimal */}
                  <div className="bg-white p-4 rounded border border-purple-200">
                    <h4 className="font-medium text-purple-800 mb-2">🎯 Croisements Recommandés</h4>
                    <p className="text-sm text-gray-600 mb-2">Scénarios prioritaires détectés :</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {riskSources.slice(0, 2).map((rs, idx) => {
                        const highValueEvents = dreadedEvents.filter(de => de.gravity >= 3);
                        const event = highValueEvents[idx % highValueEvents.length];
                        return event ? (
                          <li key={rs.id} className="flex items-center">
                            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                            <span>{rs.name} → {event.name}</span>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>

                  {/* Analyse des lacunes */}
                  <div className="bg-white p-4 rounded border border-orange-200">
                    <h4 className="font-medium text-orange-800 mb-2">⚠️ Lacunes Détectées</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      {strategicScenarios.length === 0 && (
                        <div>• Aucun scénario stratégique créé</div>
                      )}
                      {businessValues.filter(bv => 
                        !dreadedEvents.some(de => de.businessValueId === bv.id)
                      ).length > 0 && (
                        <div>• {businessValues.filter(bv => 
                          !dreadedEvents.some(de => de.businessValueId === bv.id)
                        ).length} valeur(s) métier sans événement redouté</div>
                      )}
                      {riskSources.filter(rs => 
                        !strategicScenarios.some(ss => ss.riskSourceId === rs.id)
                      ).length > 0 && (
                        <div>• {riskSources.filter(rs => 
                          !strategicScenarios.some(ss => ss.riskSourceId === rs.id)
                        ).length} source(s) de risque non exploitée(s)</div>
                      )}
                    </div>
                  </div>

                  {/* Recommandations méthodologiques */}
                  <div className="bg-white p-4 rounded border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">📋 Recommandations ANSSI</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Privilégier les événements de gravité 3-4</li>
                      <li>• Évaluer la vraisemblance de façon réaliste</li>
                      <li>• Viser 1-3 scénarios par valeur métier</li>
                      <li>• Documenter les hypothèses de chaque scénario</li>
                      <li>• Prioriser selon la matrice de risque</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-4 rounded border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-2">⏳ Données Incomplètes</h4>
                  <p className="text-sm text-gray-600">
                    Pour obtenir des suggestions IA pertinentes, complétez d'abord :
                  </p>
                  <ul className="text-xs text-gray-600 mt-2 space-y-1">
                    {riskSources.length === 0 && <li>• Créez des sources de risque (Atelier 2)</li>}
                    {businessValues.length === 0 && <li>• Définissez des valeurs métier (Atelier 1)</li>}
                    {dreadedEvents.length === 0 && <li>• Identifiez des événements redoutés (Atelier 1)</li>}
                  </ul>
                </div>
              )}

              {/* Aide contextuelle */}
              <div className="bg-white p-4 rounded border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">💭 Méthode EBIOS RM v1.5</h4>
                <p className="text-xs text-gray-600">
                  <strong>Atelier 3 :</strong> Construire des scénarios stratégiques en croisant sources de risque et événements redoutés. 
                  Chaque scénario représente une façon dont une source de risque peut provoquer un événement redouté sur une valeur métier.
                  L'évaluation combine vraisemblance (probabilité) et gravité (impact) selon la matrice ANSSI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section principale des scénarios */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Crosshair className="h-6 w-6 text-purple-500" />
              <h2 className="ml-2 text-lg font-medium text-gray-900">Scénarios Stratégiques</h2>
            </div>
            <div className="flex space-x-2">
              {suggestedScenarios.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setShowSuggestions(true)}
                  className="flex items-center space-x-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  <span>Suggestions ({suggestedScenarios.length})</span>
                </Button>
              )}
              <Button
                onClick={() => setIsAddScenarioModalOpen(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Créer un Scénario</span>
              </Button>
            </div>
          </div>

          <div className="mt-6">
            {strategicScenarios.length > 0 ? (
              <div className="space-y-4">
                {StrategicScenarioUtils.prioritizeScenarios(strategicScenarios).map((scenario) => {
                  const riskSource = riskSources.find(rs => rs.id === scenario.riskSourceId);
                  const businessValue = businessValues.find(bv => bv.id === scenario.targetBusinessValueId);
                  const dreadedEvent = dreadedEvents.find(de => de.id === scenario.dreadedEventId);
                  
                  return (
                    <div 
                      key={scenario.id} 
                      className={`border-2 rounded-lg p-6 ${getRiskColor(scenario.riskLevel)}`}
                    >
                      {/* En-tête du scénario */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{scenario.name}</h3>
                          <p className="text-sm text-gray-600 mt-2">{scenario.description}</p>
                          
                          {/* Chaîne de causalité */}
                          <div className="mt-4 flex items-center space-x-2 text-sm">
                            <span className="font-medium text-gray-700">
                              {riskSource?.name || 'Source inconnue'}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="font-medium text-gray-700">
                              {businessValue?.name || 'Valeur inconnue'}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className="font-medium text-gray-700">
                              {dreadedEvent?.name || 'Événement inconnu'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Badge de niveau de risque */}
                        <div className="ml-6">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${getRiskColor(scenario.riskLevel)}`}>
                            {scenario.riskLevel}
                          </div>
                        </div>
                      </div>

                      {/* Évaluations */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-white rounded border">
                          <div className="text-sm font-medium text-gray-500">Vraisemblance</div>
                          <div className="text-lg font-bold text-gray-900 mt-1">
                            {EbiosUtils.formatScaleLabel('likelihood', scenario.likelihood)}
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-white rounded border">
                          <div className="text-sm font-medium text-gray-500">Gravité</div>
                          <div className="text-lg font-bold text-gray-900 mt-1">
                            {EbiosUtils.formatScaleLabel('gravity', scenario.gravity)}
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-white rounded border">
                          <div className="text-sm font-medium text-gray-500">Niveau de Risque</div>
                          <div className="text-lg font-bold text-gray-900 mt-1">
                            {EbiosUtils.formatScaleLabel('risk', scenario.riskLevel)}
                          </div>
                        </div>
                      </div>

                      {/* Chemins d'attaque (preview) */}
                      {scenario.pathways && scenario.pathways.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            Chemins d'Attaque Identifiés ({scenario.pathways.length})
                          </h4>
                          <div className="text-sm text-gray-600">
                            Détails disponibles dans l'Atelier 4 - Scénarios Opérationnels
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Crosshair className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun scénario stratégique</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Construisez des scénarios en croisant vos sources de risque et événements redoutés.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setIsAddScenarioModalOpen(true)}>
                    Créer votre Premier Scénario
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Matrice de risque visuelle */}
      {strategicScenarios.length > 0 && calculatedRiskMetrics && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Matrice de Risque ANSSI</h3>
          
          {/* Légende des niveaux */}
          <div className="mb-6 grid grid-cols-4 gap-4 text-sm">
            <div className="p-3 rounded bg-yellow-50 border border-yellow-200">
              <div className="font-medium text-yellow-800">Vraisemblance</div>
              <div className="text-yellow-600 mt-1">
                3 - {EBIOS_SCALES.likelihood[3]}
              </div>
            </div>
            <div className="p-3 rounded bg-orange-50 border border-orange-200">
              <div className="font-medium text-orange-800">Gravité</div>
              <div className="text-orange-600 mt-1">
                2 - {EBIOS_SCALES.gravity[2]}
              </div>
            </div>
            <div className="p-3 rounded bg-red-50 border border-red-200">
              <div className="font-medium text-red-800">Niveau de Risque</div>
              <div className="text-red-600 mt-1">
                2 - {EBIOS_SCALES.risk[2]}
              </div>
            </div>
            <div className="p-3 rounded bg-blue-50 border border-blue-200">
              <div className="font-medium text-blue-800">Nombre de scénarios par case de la matrice</div>
            </div>
          </div>

          {/* Matrice */}
          <div className="grid grid-cols-5 gap-2">
            {/* En-têtes */}
            <div></div>
            <div className="text-center text-sm font-medium text-gray-500">Minimal</div>
            <div className="text-center text-sm font-medium text-gray-500">Significatif</div>
            <div className="text-center text-sm font-medium text-gray-500">Maximal</div>
            <div className="text-center text-sm font-medium text-gray-500">Critique</div>
            
            {/* Lignes de la matrice */}
            {[4, 3, 2, 1].map(gravity => (
              <React.Fragment key={gravity}>
                <div className="text-right text-sm font-medium text-gray-500 py-8 flex items-center justify-end">
                  {EBIOS_SCALES.gravity[gravity as GravityScale]}
                </div>
                {[1, 2, 3, 4].map(likelihood => {
                  const riskLevel = RISK_MATRIX[gravity as GravityScale][likelihood as LikelihoodScale];
                  
                  // Compter les scénarios dans cette case
                  const scenariosInCell = strategicScenarios.filter(scenario => 
                    scenario.gravity === gravity && scenario.likelihood === likelihood
                  );
                  const count = scenariosInCell.length;
                  
                  return (
                    <div
                      key={`${gravity}-${likelihood}`}
                      className={`h-16 flex items-center justify-center text-lg font-bold border-2 rounded transition-all hover:shadow-lg ${getRiskColor(riskLevel)}`}
                      title={`Gravité ${gravity} × Vraisemblance ${likelihood} = Risque ${riskLevel}\n${count} scénario(s) dans cette case`}
                    >
                      {count > 0 ? count : ''}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          
          {/* Résumé en bas */}
          <div className="mt-4 grid grid-cols-4 gap-4 text-xs text-gray-600">
            <div>Total scénarios: <strong>{strategicScenarios.length}</strong></div>
            <div>Risque moyen: <strong>{calculatedRiskMetrics.averageRiskLevel}</strong></div>
            <div>Scénarios critiques: <strong className="text-red-600">{calculatedRiskMetrics.criticalScenarios.length}</strong></div>
            <div>Taux critique: <strong className="text-red-600">{Math.round((calculatedRiskMetrics.criticalScenarios.length / Math.max(1, calculatedRiskMetrics.totalScenarios)) * 100)}%</strong></div>
          </div>
        </div>
      )}

      {/* Modal pour l'ajout des scénarios stratégiques */}
      {isAddScenarioModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsAddScenarioModalOpen(false)} />

            {/* Modal */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {/* Header */}
              <div className="bg-purple-50 px-6 py-4 border-b border-purple-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Crosshair className="h-6 w-6 text-purple-500" />
                    <h3 className="ml-3 text-lg font-medium text-gray-900">
                      Créer un Scénario Stratégique
                    </h3>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setIsAddScenarioModalOpen(false)}
                  >
                    <div className="h-6 w-6">×</div>
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleCreateScenario({
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  riskSourceId: formData.get('riskSourceId') as string,
                  targetBusinessValueId: formData.get('targetBusinessValueId') as string,
                  dreadedEventId: formData.get('dreadedEventId') as string,
                  likelihood: parseInt(formData.get('likelihood') as string) as LikelihoodScale,
                  gravity: parseInt(formData.get('gravity') as string) as GravityScale
                });
              }} className="p-6 space-y-6">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Informations Générales */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 border-b pb-2">
                      Informations Générales
                    </h4>

                    {/* Nom */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du scénario *
                      </label>
                      <input
                        name="name"
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Ex: Cybercriminels → Atteinte confidentialité données"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Décrivez brièvement ce scénario stratégique..."
                      />
                    </div>

                    {/* Évaluations */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Vraisemblance */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vraisemblance *
                        </label>
                        <select name="likelihood" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                          <option value="">Sélectionner</option>
                          {[1, 2, 3, 4].map((level) => (
                            <option key={level} value={level}>
                              {level} - {EBIOS_SCALES.likelihood[level as LikelihoodScale]}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Gravité */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Gravité *
                        </label>
                        <select name="gravity" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                          <option value="">Sélectionner</option>
                          {[1, 2, 3, 4].map((level) => (
                            <option key={level} value={level}>
                              {level} - {EBIOS_SCALES.gravity[level as GravityScale]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Sélections */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 border-b pb-2">
                      Éléments Constitutifs
                    </h4>

                    {/* Source de Risque */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Source de Risque *
                      </label>
                      <select name="riskSourceId" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">Sélectionner une source de risque</option>
                        {riskSources.map((rs) => (
                          <option key={rs.id} value={rs.id}>
                            {rs.name} ({rs.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Valeur Métier Ciblée */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valeur Métier Ciblée *
                      </label>
                      <select name="targetBusinessValueId" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">Sélectionner une valeur métier</option>
                        {businessValues.map((bv) => (
                          <option key={bv.id} value={bv.id}>
                            {bv.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Événement Redouté */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Événement Redouté *
                      </label>
                      <select name="dreadedEventId" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="">Sélectionner un événement redouté</option>
                        {dreadedEvents.map((de) => (
                          <option key={de.id} value={de.id}>
                            {de.name} (Gravité: {de.gravity})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddScenarioModalOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="flex items-center space-x-2"
                  >
                    <Target className="h-4 w-4" />
                    <span>Créer le Scénario</span>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <WorkshopNavigation
        currentWorkshop={3}
        totalWorkshops={5}
        onNext={handleNext}
      />
    </div>
  );
};

export default Workshop3;