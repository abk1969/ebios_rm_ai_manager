import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { 
  getStrategicScenarios,
  updateStrategicScenario 
} from '@/services/firebase/strategicScenarios';
import { getSupportingAssets } from '@/services/firebase/supportingAssets';
import { getRiskSources } from '@/services/firebase/riskSources';
import { getMissionById, updateMission } from '@/services/firebase/missions';
import { 
  WORKSHOP_VALIDATION_CRITERIA, 
  EbiosUtils
} from '@/lib/ebios-constants';
import Button from '@/components/ui/button';
import { 
  Route, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  AlertTriangle,
  Info,
  Shield,
  Target,
  Zap,
  Network,
  Eye,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import WorkshopNavigation from '@/components/workshops/WorkshopNavigation';
import AddAttackPathModal from '@/components/attack-paths/AddAttackPathModal';
import AddStepModal from '@/components/attack-paths/AddStepModal';
import MissionContextIcon from '@/components/missions/MissionContextIcon';
import type {
  StrategicScenario,
  SupportingAsset,
  Mission,
  LikelihoodScale,
  WorkshopValidation,
  RiskSource,
  AttackPathway,
  DreadedEvent
} from '@/types/ebios';
import { AttackPathAIService } from '@/services/ai/AttackPathAIService';
import { getRelevantControls } from '@/lib/security-frameworks';
import AICoherenceIndicator from '@/components/ai/AICoherenceIndicator';

// 🔧 TYPES SIMPLIFIÉS: Utilisation des types standards EBIOS

const Workshop4 = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  // 🔧 CORRECTION: Support des deux méthodes de récupération du missionId
  const missionId = params.missionId || searchParams.get('missionId');
  
  // États pour les données
  const [strategicScenarios, setStrategicScenarios] = useState<StrategicScenario[]>([]);
  const [supportingAssets, setSupportingAssets] = useState<SupportingAsset[]>([]);
  const [riskSources, setRiskSources] = useState<RiskSource[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [operationalMetrics, setOperationalMetrics] = useState<any>(null);
  
  // États pour les modales
  const [isAddPathModalOpen, setIsAddPathModalOpen] = useState(false);
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedPaths, setSuggestedPaths] = useState<any[]>([]);
  
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
          <p className="text-gray-500 mb-6">Sélectionnez d'abord une mission pour accéder à l'Atelier 4</p>
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
          const [missionData, scenarios, assets, sources] = await Promise.all([
            getMissionById(missionId),
            getStrategicScenarios(missionId),
            getSupportingAssets(missionId),
            getRiskSources(missionId)
          ]);
          
          if (missionData) {
            setMission(missionData);
            setStrategicScenarios(scenarios);
            setSupportingAssets(assets);
            setRiskSources(sources);
            
            // Calcul des métriques opérationnelles
            const metrics = calculateOperationalMetrics(scenarios);
            setOperationalMetrics(metrics);
            
            validateWorkshopCompletion(scenarios);
            
            // Générer des suggestions pour les scénarios sans chemins d'attaque
            const scenariosWithoutPaths = scenarios.filter(s => !s.pathways || s.pathways.length === 0);
            if (scenariosWithoutPaths.length > 0) {
              const suggestions = generateSuggestedAttackPaths(scenariosWithoutPaths, assets);
              setSuggestedPaths(suggestions);
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
        setError('Échec du chargement des scénarios opérationnels');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [missionId]);

  // Calcul des métriques opérationnelles
  const calculateOperationalMetrics = (scenarios: StrategicScenario[]) => {
    const totalPaths = scenarios.reduce((acc, s) => acc + (s.pathways?.length || 0), 0);
    const scenariosWithPaths = scenarios.filter(s => s.pathways && s.pathways.length > 0);
    const averageComplexity = scenariosWithPaths.length > 0 
      ? scenariosWithPaths.reduce((acc, s) => acc + (s.pathways?.length || 0), 0) / scenariosWithPaths.length
      : 0;

    // Calcul du nombre total d'étapes dans tous les chemins d'attaque
    const totalSteps = scenarios.reduce((acc, s) => {
      if (s.pathways) {
        return acc + s.pathways.reduce((pathAcc, p) => pathAcc + (p.steps?.length || 0), 0);
      }
      return acc;
    }, 0);

    // Debug logs - Development only
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Workshop4 - Métriques calculées:', {
        totalScenarios: scenarios.length,
        totalPaths,
        totalSteps,
        scenariosWithPaths: scenariosWithPaths.length,
        averageComplexity,
        completionRate: scenarios.length > 0 ? (scenariosWithPaths.length / scenarios.length) * 100 : 0
      });
    }

    return {
      totalScenarios: scenarios.length,
      totalPaths,
      totalSteps,
      scenariosWithPaths: scenariosWithPaths.length,
      averageComplexity: Math.round(averageComplexity * 10) / 10,
      completionRate: scenarios.length > 0 ? (scenariosWithPaths.length / scenarios.length) * 100 : 0
    };
  };

  // Validation selon critères EBIOS RM Atelier 4
  const validateWorkshopCompletion = (scenarios: StrategicScenario[]) => {
    const results: WorkshopValidation[] = [
      {
        criterion: 'Chemins d\'attaque détaillés',
        required: true,
        met: scenarios.length > 0 && scenarios.every(s => s.pathways && s.pathways.length > 0),
        evidence: `${scenarios.filter(s => s.pathways && s.pathways.length > 0).length}/${scenarios.length} scénarios avec chemins d'attaque`
      },
      {
        criterion: 'Techniques identifiées',
        required: true,
        met: scenarios.some(s => s.pathways && s.pathways.some(p => p.techniques && p.techniques.length > 0)),
        evidence: 'Techniques d\'attaque documentées'
      },
      {
        criterion: 'Parties prenantes impliquées',
        required: false,
        met: scenarios.some(s => s.pathways && s.pathways.some(p => p.stakeholderId)),
        evidence: 'Acteurs identifiés dans les chemins'
      }
    ];

    setValidationResults(results);
  };

  // Génération de suggestions simplifiées
  const generateSuggestedAttackPaths = (
    scenarios: StrategicScenario[], 
    assets: SupportingAsset[]
  ) => {
    // Suggestions simplifiées pour éviter les erreurs de types
    return [];
  };

  // 🆕 AMÉLIORATION: Suggestions IA enrichies avec AttackPathAIService
  const generateAISuggestions = async (scenario: StrategicScenario, riskSource?: RiskSource) => {
    try {
      if (!riskSource) return [];

      // Créer un dreadedEvent fictif pour l'API
      const dreadedEvent = {
        id: 'temp-dreaded-event',
        name: 'Événement redouté générique',
        description: 'Événement redouté pour génération de suggestions',
        businessValueId: scenario.targetBusinessValueId || '',
        gravity: scenario.gravity || 3,
        impactType: 'confidentiality' as const,
        consequences: 'Perte de données, Atteinte à la réputation',
        missionId: missionId || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Utiliser le service AttackPathAIService pour des suggestions enrichies
      const suggestions = AttackPathAIService.generateAttackPathSuggestions(
        scenario,
        riskSource,
        dreadedEvent
      );

      return suggestions.map(suggestion => ({
        type: 'path',
        title: suggestion.name,
        description: suggestion.description,
        techniques: suggestion.steps?.flatMap(step => step.techniques) || [],
        feasibility: suggestion.feasibility || 2,
        detectability: suggestion.detectability || 2,
        controls: {
          iso27002: [],
          cisControls: [],
          nist: []
        },
        reasoning: suggestion.reasoning,
        confidence: suggestion.confidence
      }));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erreur génération suggestions IA:', error);
      }

      // Fallback vers suggestions statiques
      const suggestions = [];

      if (riskSource?.category === 'cybercriminal' || riskSource?.category === 'terrorist') {
        suggestions.push({
          type: 'path',
          title: 'Phishing → Credential Harvesting → Data Exfiltration',
          description: 'Chemin classique pour les cybercriminels motivés financièrement',
          techniques: ['T1566 - Phishing', 'T1078 - Valid Accounts', 'T1041 - Exfiltration'],
          feasibility: 2,
          controls: {
            iso27002: ['A.8.23 - Web filtering', 'A.8.2 - Privileged access'],
            cisControls: ['CIS 9 - Email Protection', 'CIS 6 - Access Control'],
            nist: ['PR.AT-1 - Awareness training', 'PR.AC-4 - Access permissions']
          }
        });
      }

      if (riskSource?.category === 'state') {
        suggestions.push({
          type: 'path',
          title: 'Supply Chain Compromise → Persistence → Long-term Espionage',
          description: 'Méthode sophistiquée typique des acteurs étatiques',
          techniques: ['T1195 - Supply Chain Compromise', 'T1547 - Boot Persistence'],
          feasibility: 4,
          controls: {
            iso27002: ['A.5.19 - Information security in supplier relationships'],
            cisControls: ['CIS 15 - Service Provider Management'],
            nist: ['ID.SC-2 - Supplier risk management']
          }
        });
      }

      if (riskSource?.category === 'insider') {
        suggestions.push({
          type: 'path',
          title: 'Legitimate Access → Data Collection → Physical Exfiltration',
          description: 'Abus de privilèges par un utilisateur interne',
          techniques: ['T1078 - Valid Accounts', 'T1052 - Exfiltration Over Physical Medium'],
          feasibility: 1,
          controls: {
            iso27002: ['A.8.7 - Clear desk and screen', 'A.8.10 - Information deletion'],
            cisControls: ['CIS 13 - Network Monitoring', 'CIS 14 - Security Awareness'],
            nist: ['PR.DS-5 - Protections against data leaks']
          }
        });
      }

      // Suggestions génériques si pas de source de risque spécifique
      if (suggestions.length === 0) {
        suggestions.push({
          type: 'generic',
          title: 'Exploitation Web → Escalade → Mouvement Latéral',
          description: 'Chemin d\'attaque générique pour compromission système',
          techniques: ['T1190 - Exploit Public Application', 'T1068 - Privilege Escalation'],
          feasibility: 3,
          controls: {
            iso27002: ['A.8.9 - Configuration management', 'A.8.25 - Secure development'],
            cisControls: ['CIS 2 - Inventory', 'CIS 3 - Data Protection'],
            nist: ['PR.IP-1 - Baseline configuration']
          }
        });
      }

      return suggestions;
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
      // Marquer l'atelier 4 comme complété
      if (mission) {
        await updateMission(mission.id, {
          ...mission,
          ebiosCompliance: {
            ...mission.ebiosCompliance,
            completionPercentage: 80 // 80% après atelier 4
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

  const getFeasibilityColor = (feasibility: LikelihoodScale) => {
    switch (feasibility) {
      case 1: return 'text-red-600 bg-red-50 border-red-200';
      case 2: return 'text-orange-600 bg-orange-50 border-orange-200';
      case 3: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 4: return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getValidationIcon = (met: boolean, required: boolean) => {
    if (met) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (required) return <AlertCircle className="h-5 w-5 text-red-500" />;
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  };

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
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Atelier 4 : Scénarios Opérationnels
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Détailler les chemins d'attaque et modes opératoires techniques selon EBIOS RM v1.5
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* 🆕 ICÔNE CONTEXTE MISSION */}
            {mission && (
              <MissionContextIcon
                mission={mission}
                className="mr-2"
              />
            )}

            <AICoherenceIndicator
              missionId={missionId}
              workshop={4}
              data={{
                scenarios: strategicScenarios,
                supportingAssets
              }}
              size="md"
              autoRefresh={true}
              refreshInterval={60000}
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
            <h3 className="font-medium text-gray-900 mb-2">Objectifs de l'Atelier 4 (ANSSI) :</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li><strong>Chemins d'attaque :</strong> Détailler les parcours techniques pour chaque scénario</li>
              <li><strong>Techniques MITRE :</strong> Référencer les techniques ATT&CK appropriées</li>
              <li><strong>Évaluation de faisabilité :</strong> Coter la facilité de réalisation (1-4)</li>
              <li><strong>Actifs de soutien :</strong> Identifier les composants techniques impliqués</li>
              <li><strong>Analyse opérationnelle :</strong> Préparer le traitement du risque (Atelier 5)</li>
            </ul>
          </div>
        )}
      </div>

      {/* Tableau de bord de progression */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">État d'Avancement - Atelier 4</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Métriques opérationnelles */}
      {operationalMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Target className="h-6 w-6 text-purple-500" />
              <div className="ml-3">
                <div className="text-lg font-bold text-gray-900">{operationalMetrics.totalScenarios}</div>
                <div className="text-xs text-gray-500">Scénarios</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Route className="h-6 w-6 text-red-500" />
              <div className="ml-3">
                <div className="text-lg font-bold text-gray-900">{operationalMetrics.totalPaths}</div>
                <div className="text-xs text-gray-500">Chemins d'Attaque</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Zap className="h-6 w-6 text-orange-500" />
              <div className="ml-3">
                <div className="text-lg font-bold text-gray-900">{operationalMetrics.totalSteps}</div>
                <div className="text-xs text-gray-500">Étapes</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-blue-500" />
              <div className="ml-3">
                <div className="text-lg font-bold text-gray-900">{operationalMetrics.scenariosWithPaths}</div>
                <div className="text-xs text-gray-500">Avec Chemins</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Network className="h-6 w-6 text-green-500" />
              <div className="ml-3">
                <div className="text-lg font-bold text-gray-900">{operationalMetrics.averageComplexity}</div>
                <div className="text-xs text-gray-500">Complexité Moy.</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Eye className="h-6 w-6 text-indigo-500" />
              <div className="ml-3">
                <div className="text-lg font-bold text-gray-900">{Math.round(operationalMetrics.completionRate)}%</div>
                <div className="text-xs text-gray-500">Taux Complet.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions IA pour les scénarios opérationnels */}
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg shadow p-6 border border-red-200">
        <div className="flex items-start">
          <Lightbulb className="h-6 w-6 text-red-500 mt-1" />
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              💡 Assistant IA - Guide pour l'Atelier 4
            </h3>
            <div className="space-y-4">
              {/* Guide méthodologique */}
              <div className="bg-white p-4 rounded border border-red-200">
                <h4 className="font-medium text-red-800 mb-2">🎯 Que faire dans cet atelier ?</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Objectif :</strong> Transformer chaque scénario stratégique en chemins d'attaque détaillés</p>
                  <p><strong>Pour chaque scénario :</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>Créer un ou plusieurs <strong>chemins d'attaque</strong> techniques</li>
                    <li>Définir les <strong>étapes</strong> de chaque chemin</li>
                    <li>Associer les <strong>techniques MITRE ATT&CK</strong></li>
                    <li>Évaluer la <strong>faisabilité</strong> (difficulté technique)</li>
                    <li>Identifier les <strong>actifs supports</strong> impliqués</li>
                  </ul>
                </div>
              </div>

              {/* Suggestions basées sur les données */}
              {strategicScenarios.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Scénarios à traiter */}
                  <div className="bg-white p-4 rounded border border-orange-200">
                    <h4 className="font-medium text-orange-800 mb-2">⏳ Scénarios à Traiter</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      {strategicScenarios.filter(s => !s.pathways || s.pathways.length === 0).length > 0 ? (
                        <>
                          <div className="text-sm font-medium text-orange-700 mb-2">
                            {strategicScenarios.filter(s => !s.pathways || s.pathways.length === 0).length} scénario(s) sans chemins d'attaque :
                          </div>
                          {strategicScenarios.filter(s => !s.pathways || s.pathways.length === 0).slice(0, 3).map((scenario) => (
                            <div key={scenario.id} className="flex items-center">
                              <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                              <span className="text-xs">{scenario.name}</span>
                            </div>
                          ))}
                          {strategicScenarios.filter(s => !s.pathways || s.pathways.length === 0).length > 3 && (
                            <div className="text-xs text-gray-500">
                              ... et {strategicScenarios.filter(s => !s.pathways || s.pathways.length === 0).length - 3} autre(s)
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-green-600">✅ Tous les scénarios ont des chemins d'attaque</div>
                      )}
                    </div>
                  </div>

                  {/* Suggestions techniques */}
                  <div className="bg-white p-4 rounded border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">🔧 Suggestions Techniques</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Utiliser le référentiel MITRE ATT&CK</li>
                      <li>• Décomposer en étapes simples</li>
                      <li>• Évaluer la détectabilité (1-4)</li>
                      <li>• Considérer les prérequis techniques</li>
                      <li>• Lier aux actifs supports concernés</li>
                    </ul>
                  </div>

                  {/* Exemples de chemins d'attaque */}
                  <div className="bg-white p-4 rounded border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">💡 Exemples de Chemins</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• <strong>Phishing :</strong> Mail → Credential → Accès</li>
                      <li>• <strong>Intrusion réseau :</strong> Scan → Exploit → Pivot</li>
                      <li>• <strong>Ingénierie sociale :</strong> Contact → Persuasion → Action</li>
                      <li>• <strong>Malware :</strong> Livraison → Exécution → C&C</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-4 rounded border border-yellow-200">
                  <h4 className="font-medium text-yellow-800 mb-2">⚠️ Prérequis Manquants</h4>
                  <p className="text-sm text-gray-600">
                    Aucun scénario stratégique disponible. Complétez d'abord l'<strong>Atelier 3</strong> pour créer des scénarios stratégiques.
                  </p>
                </div>
              )}

              {/* Processus étape par étape */}
              <div className="bg-white p-4 rounded border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2">📋 Processus Recommandé</h4>
                <div className="text-xs text-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
                      <div className="font-medium">Sélectionner</div>
                      <div>un scénario stratégique</div>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
                      <div className="font-medium">Créer</div>
                      <div>chemin d'attaque</div>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
                      <div className="font-medium">Détailler</div>
                      <div>les étapes</div>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">4</div>
                      <div className="font-medium">Évaluer</div>
                      <div>faisabilité</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {error}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Section principale des scénarios opérationnels */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Route className="h-6 w-6 text-red-500" />
              <h2 className="ml-2 text-lg font-medium text-gray-900">Scénarios Opérationnels</h2>
            </div>
            {strategicScenarios.length > 0 && (
              <div className="text-sm text-gray-500">
                {strategicScenarios.filter(s => s.pathways && s.pathways.length > 0).length} / {strategicScenarios.length} scénarios avec chemins d'attaque
              </div>
            )}
          </div>

          <div className="mt-6 space-y-8">
            {strategicScenarios.map((scenario) => (
              <div key={scenario.id} className="border-2 border-gray-200 rounded-lg p-6 hover:border-red-300 transition-colors">
                {/* En-tête du scénario */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{scenario.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        EbiosUtils.compareRiskLevel(scenario.riskLevel, 4, '>=') ? 'bg-red-100 text-red-800' :
                        EbiosUtils.compareRiskLevel(scenario.riskLevel, 3, '>=') ? 'bg-orange-100 text-orange-800' :
                        EbiosUtils.compareRiskLevel(scenario.riskLevel, 2, '>=') ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        Risque {scenario.riskLevel}/4
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>Vraisemblance : {scenario.likelihood}/4</span>
                      <span>Gravité : {scenario.gravity}/4</span>
                      <span>Chemins d'attaque : {scenario.pathways?.length || 0}</span>
                      <span>Étapes totales : {scenario.pathways?.reduce((acc, p) => acc + (p.steps?.length || 0), 0) || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Chemins d'attaque existants */}
                {scenario.pathways && scenario.pathways.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <Route className="h-4 w-4 mr-2 text-red-500" />
                      Chemins d'Attaque ({scenario.pathways.length})
                    </h4>
                    
                    {scenario.pathways.map((pathway, pathIndex) => (
                      <div key={pathIndex} className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-500">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{pathway.name || `Chemin ${pathIndex + 1}`}</h5>
                            <p className="text-sm text-gray-600 mt-1">{pathway.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>Faisabilité : {pathway.feasibility}/4</span>
                              <span>Détectabilité : {pathway.detectability || 'N/A'}/4</span>
                              <span>Étapes : {pathway.steps?.length || 0}</span>
                              <span>Techniques : {pathway.techniques?.length || 0}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedScenarioId(scenario.id);
                                setSelectedPathId(pathway.id || `${scenario.id}-${pathIndex}`);
                                setIsAddStepModalOpen(true);
                              }}
                              className="text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Ajouter Étape
                            </Button>
                          </div>
                        </div>

                        {/* Étapes du chemin d'attaque */}
                        {pathway.steps && pathway.steps.length > 0 && (
                          <div className="mt-4">
                            <div className="text-xs font-medium text-gray-700 mb-2">Étapes :</div>
                            <div className="space-y-2">
                              {pathway.steps.map((step, stepIndex) => (
                                <div key={stepIndex} className="flex items-center space-x-3 text-sm">
                                  <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                                    {stepIndex + 1}
                                  </div>
                                  <div className="flex-1">
                                    <span className="font-medium">{step.name}</span>
                                    {step.description && (
                                      <span className="text-gray-500 ml-2">- {step.description}</span>
                                    )}
                                  </div>
                                  {/* 🔧 CORRECTION: Support des deux formats de techniques */}
                                  {(step as any).techniques && (step as any).techniques.length > 0 && (
                                    <div className="text-xs text-blue-600">
                                      {(step as any).techniques.length} technique(s)
                                    </div>
                                  )}
                                  {step.technique && !(step as any).techniques && (
                                    <div className="text-xs text-blue-600">
                                      Technique: {step.technique}
                                    </div>
                                  )}
                                  {!step.technique && !(step as any).techniques && (
                                    <div className="text-xs text-gray-500">
                                      Technique non spécifiée
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Techniques MITRE ATT&CK */}
                        {pathway.techniques && pathway.techniques.length > 0 && (
                          <div className="mt-4">
                            <div className="text-xs font-medium text-gray-700 mb-2">Techniques MITRE ATT&CK :</div>
                            <div className="flex flex-wrap gap-1">
                              {pathway.techniques.map((technique, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                  {technique}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Bouton pour ajouter un chemin d'attaque supplémentaire */}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedScenarioId(scenario.id);
                        setIsAddPathModalOpen(true);
                      }}
                      className="w-full border-dashed border-2 border-gray-300 hover:border-red-400 text-gray-600 hover:text-red-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un Chemin d'Attaque Alternatif
                    </Button>
                  </div>
                ) : (
                  /* État vide avec guide d'action */
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-red-50 rounded-lg border-2 border-dashed border-gray-300">
                    <Route className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun chemin d'attaque défini</h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
                      Ce scénario stratégique a besoin de chemins d'attaque détaillés pour devenir opérationnel. 
                      Créez le premier chemin pour démarrer l'analyse technique.
                    </p>
                    
                    {/* Guide visuel rapide */}
                    <div className="bg-white rounded-lg p-4 mb-6 max-w-lg mx-auto border border-red-200">
                      <h4 className="font-medium text-red-800 mb-3">🚀 Pour commencer :</h4>
                      <div className="text-left space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">1</span>
                          <span>Définir le nom et objectif du chemin</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">2</span>
                          <span>Décomposer en étapes techniques</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">3</span>
                          <span>Associer les techniques MITRE</span>
                        </div>
                        <div className="flex items-center">
                          <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">4</span>
                          <span>Évaluer la faisabilité</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => {
                          setSelectedScenarioId(scenario.id);
                          setIsAddPathModalOpen(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Créer le Premier Chemin d'Attaque
                      </Button>

                      {/* 🆕 AMÉLIORATION: Bouton suggestions IA */}
                      <Button
                        variant="outline"
                        onClick={async () => {
                          const riskSource = riskSources.find((rs: any) => rs.id === scenario.riskSourceId);
                          const suggestions = await generateAISuggestions(scenario, riskSource);
                          if (suggestions.length > 0) {
                            // 🆕 AMÉLIORATION: Affichage enrichi avec référentiels
                            const suggestionText = suggestions.map(s =>
                              `• ${s.title}\n  ${s.description}\n  Faisabilité: ${s.feasibility}/4\n  Techniques: ${s.techniques?.join(', ') || 'N/A'}\n  📋 Contrôles:\n    - ISO 27002: ${s.controls?.iso27002?.join(', ') || 'N/A'}\n    - NIST CSF: ${s.controls?.nist?.join(', ') || 'N/A'}\n    - CIS Controls: ${s.controls?.cisControls?.join(', ') || 'N/A'}`
                            ).join('\n\n');
                            alert(`🤖 ${suggestions.length} suggestion(s) IA générée(s) :\n\n${suggestionText}\n\n💡 Suggestions basées sur MITRE ATT&CK et référentiels de sécurité`);
                          } else {
                            alert('Aucune suggestion IA disponible pour ce scénario.');
                          }
                        }}
                        className="border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Suggestions IA
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {strategicScenarios.length === 0 && (
              <div className="text-center py-16 bg-yellow-50 rounded-lg border-2 border-dashed border-yellow-300">
                <AlertTriangle className="mx-auto h-16 w-16 text-yellow-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun scénario stratégique disponible</h3>
                <p className="text-sm text-gray-500 mb-6">
                  L'Atelier 4 nécessite des scénarios stratégiques de l'Atelier 3 pour fonctionner.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                >
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  Retour à l'Atelier 3
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <WorkshopNavigation
        currentWorkshop={4}
        totalWorkshops={5}
        onNext={handleNext}
      />

      {/* Modales */}
      <AddAttackPathModal
        isOpen={isAddPathModalOpen}
        onClose={() => {
          setIsAddPathModalOpen(false);
          setSelectedScenarioId(null);
        }}
        onSubmit={handleCreateAttackPath}
        scenarioName={
          selectedScenarioId 
            ? strategicScenarios.find(s => s.id === selectedScenarioId)?.name || 'Scénario'
            : 'Scénario'
        }
      />

      <AddStepModal
        isOpen={isAddStepModalOpen}
        onClose={() => {
          setIsAddStepModalOpen(false);
          setSelectedPathId(null);
        }}
        onSubmit={handleCreateStep}
        pathName={selectedPathId ? `Chemin ${selectedPathId}` : 'Chemin d\'attaque'}
      />
    </div>
  );

  // Fonction pour créer un chemin d'attaque
  async function handleCreateAttackPath(pathData: any) {
    try {
      if (!selectedScenarioId) {
        setError('Aucun scénario sélectionné');
        return;
      }

      const scenario = strategicScenarios.find(s => s.id === selectedScenarioId);
      if (!scenario) {
        setError('Scénario non trouvé');
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Workshop4 - Création chemin d\'attaque:', {
          scenarioId: selectedScenarioId,
          pathData
        });
      }

      // Créer le nouveau chemin d'attaque avec un ID unique
      const newPath = {
        id: `path-${Date.now()}`,
        ...pathData
      };

      // Mettre à jour le scénario avec le nouveau chemin
      const updatedScenario = {
        ...scenario,
        pathways: [...(scenario.pathways || []), newPath]
      };

      await updateStrategicScenario(selectedScenarioId, updatedScenario);

      // Recharger les données
      const updatedScenarios = await getStrategicScenarios(missionId!);
      setStrategicScenarios(updatedScenarios);
      
      // Recalculer les métriques
      const metrics = calculateOperationalMetrics(updatedScenarios);
      setOperationalMetrics(metrics);
      validateWorkshopCompletion(updatedScenarios);

      // Fermer la modal
      setIsAddPathModalOpen(false);
      setSelectedScenarioId(null);

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Chemin d\'attaque créé avec succès');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la création du chemin d\'attaque:', error);
      setError('Erreur lors de la création du chemin d\'attaque');
    }
  }

  // Fonction pour créer une étape
  async function handleCreateStep(stepData: any) {
    try {
      if (!selectedScenarioId || !selectedPathId) {
        setError('Scénario ou chemin d\'attaque non sélectionné');
        return;
      }

      const scenario = strategicScenarios.find(s => s.id === selectedScenarioId);
      if (!scenario || !scenario.pathways) {
        setError('Scénario ou chemins d\'attaque non trouvés');
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Workshop4 - Création étape:', {
          scenarioId: selectedScenarioId,
          pathId: selectedPathId,
          stepData
        });
      }

      // Trouver le chemin d'attaque à modifier
      const pathIndex = scenario.pathways.findIndex(p => p.id === selectedPathId);
      if (pathIndex === -1) {
        setError('Chemin d\'attaque non trouvé');
        return;
      }

      // Créer la nouvelle étape avec un ID unique
      const newStep = {
        id: `step-${Date.now()}`,
        ...stepData
      };

      // Mettre à jour le chemin d'attaque avec la nouvelle étape
      const updatedPathways = [...scenario.pathways];
      updatedPathways[pathIndex] = {
        ...updatedPathways[pathIndex],
        steps: [...(updatedPathways[pathIndex].steps || []), newStep]
      };

      const updatedScenario = {
        ...scenario,
        pathways: updatedPathways
      };

      await updateStrategicScenario(selectedScenarioId, updatedScenario);

      // Recharger les données
      const updatedScenarios = await getStrategicScenarios(missionId!);
      setStrategicScenarios(updatedScenarios);
      
      // Recalculer les métriques
      const metrics = calculateOperationalMetrics(updatedScenarios);
      setOperationalMetrics(metrics);
      validateWorkshopCompletion(updatedScenarios);

      // Fermer la modal
      setIsAddStepModalOpen(false);
      setSelectedPathId(null);

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Étape créée avec succès');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la création de l\'étape:', error);
      setError('Erreur lors de la création de l\'étape');
    }
  }
};

export default Workshop4;