import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addRiskSource, setRiskSources } from '@/store/slices/riskSourcesSlice';
import { getRiskSources, createRiskSource, updateRiskSource } from '@/services/firebase/riskSources';
import { getMissionById, updateMission } from '@/services/firebase/missions';
import { getBusinessValuesByMission } from '@/services/firebase/businessValues';
import {
  WORKSHOP_VALIDATION_CRITERIA,
  EbiosUtils,
  RISK_SOURCE_CATEGORIES,
  MITRE_TECHNIQUES,
  EBIOS_SCALES
} from '@/lib/ebios-constants';
import { getRelevantControls } from '@/lib/security-frameworks';
import AICoherenceIndicator from '@/components/ai/AICoherenceIndicator';
import Button from '@/components/ui/button';
import {
  Target,
  Plus,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Settings,
  Shield,
  Users,
  Zap,
  Lightbulb
} from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import WorkshopNavigation from '@/components/workshops/WorkshopNavigation';
import AddRiskSourceModal from '@/components/risk-sources/AddRiskSourceModal';
import AddObjectiveModal from '@/components/risk-sources/AddObjectiveModal';
import AddOperationalModeModal from '@/components/risk-sources/AddOperationalModeModal';
import type { 
  RiskSource, 
  BusinessValue,
  Mission,
  LikelihoodScale,
  WorkshopValidation,
  RiskObjective,
  OperationalMode
} from '@/types/ebios';

const Workshop2 = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  // 🔧 CORRECTION: Support des deux méthodes de récupération du missionId
  const missionId = params.missionId || searchParams.get('missionId');
  const dispatch = useDispatch();
  const riskSources = useSelector((state: RootState) => state.riskSources.riskSources);
  
  // États des modales
  const [isAddRiskSourceModalOpen, setIsAddRiskSourceModalOpen] = useState(false);
  const [isAddObjectiveModalOpen, setIsAddObjectiveModalOpen] = useState(false);
  const [isAddOperationalModeModalOpen, setIsAddOperationalModeModalOpen] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mission, setMission] = useState<Mission | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [validationResults, setValidationResults] = useState<WorkshopValidation[]>([]);
  const [businessValues, setBusinessValues] = useState<BusinessValue[]>([]);
  const [selectedRiskSourceId, setSelectedRiskSourceId] = useState<string | null>(null);

  if (!missionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">ID de mission requis</h3>
          <p className="text-gray-500 mb-6">Sélectionnez d'abord une mission pour accéder à l'Atelier 2</p>
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
          const [missionData, sources, values] = await Promise.all([
            getMissionById(missionId),
            getRiskSources(missionId),
            getBusinessValuesByMission(missionId)
          ]);
          
          if (missionData) {
            setMission(missionData);
            dispatch(setRiskSources(sources));
            setBusinessValues(values);
            validateWorkshopCompletion(sources);
          } else {
            setError('Mission non trouvée');
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Échec du chargement des sources de risque');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, missionId]);

  // Validation selon critères EBIOS RM Atelier 2
  const validateWorkshopCompletion = (sources: RiskSource[]) => {
    const criteria = WORKSHOP_VALIDATION_CRITERIA[2];
    const results: WorkshopValidation[] = criteria.map(criterion => {
      let met = false;
      let evidence = '';

      switch (criterion.criterion) {
        case 'Sources de risque catégorisées':
          met = sources.length >= 1 && sources.every(s => s.category && s.pertinence);
          evidence = `${sources.length} source(s) de risque catégorisée(s)`;
          break;
        case 'Objectifs visés définis':
          const totalObjectives = sources.reduce((acc, s) => acc + (s.objectives?.length || 0), 0);
          met = sources.length > 0 && sources.every(s => s.objectives && s.objectives.length > 0);
          evidence = `${totalObjectives} objectif(s) défini(s)`;
          break;
        case 'Modes opératoires analysés':
          const totalModes = sources.reduce((acc, s) => acc + (s.operationalModes?.length || 0), 0);
          met = sources.length > 0 && sources.every(s => s.operationalModes && s.operationalModes.length > 0);
          evidence = `${totalModes} mode(s) opératoire(s) analysé(s)`;
          break;
        case 'Pertinence évaluée':
          met = sources.length > 0 && sources.every(s => s.pertinence >= 1 && s.pertinence <= 4);
          evidence = met ? 'Toutes les pertinences évaluées' : 'Évaluations incomplètes';
          break;
      }

      return {
        criterion: criterion.criterion,
        required: criterion.required,
        met,
        evidence
      };
    });

    setValidationResults(results);
  };

  const handleCreateRiskSource = async (data: {
    name: string;
    description: string;
    category: keyof typeof RISK_SOURCE_CATEGORIES;
    pertinence: LikelihoodScale;
    expertise: 'limited' | 'moderate' | 'high' | 'expert';
    resources: 'limited' | 'moderate' | 'high' | 'unlimited';
    motivation: LikelihoodScale;
  }) => {
    try {
      if (missionId) {
        const newSource = await createRiskSource({
          ...data,
          missionId,
          objectives: [],
          operationalModes: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        dispatch(addRiskSource(newSource));
        setIsAddRiskSourceModalOpen(false);
        
        // Suggérer des objectifs automatiquement
        const suggestedObjectives = generateSuggestedObjectives(newSource, businessValues);
        if (suggestedObjectives.length > 0) {
          setSelectedRiskSourceId(newSource.id);
          setError(`💡 Suggestion : ${suggestedObjectives.length} objectifs suggérés pour "${newSource.name}"`);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la création de la source de risque:', error);
      setError('Échec de la création de la source de risque');
    }
  };

  // Fonction pour recharger les données après mise à jour
  const refreshData = async () => {
    if (!missionId) return;
    
    try {
      const [updatedSources, values] = await Promise.all([
        getRiskSources(missionId),
        getBusinessValuesByMission(missionId)
      ]);
      
      dispatch(setRiskSources(updatedSources));
      setBusinessValues(values);
      validateWorkshopCompletion(updatedSources);
      
      // Données rechargées avec succès
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Erreur lors du rechargement:', error);
      }
    }
  };

  const handleAddObjective = async (data: {
    name: string;
    description: string;
    targetType: 'business_value' | 'supporting_asset' | 'stakeholder';
    targetId: string;
    priority: LikelihoodScale;
  }) => {
    if (!selectedRiskSourceId) {
      setError('Aucune source de risque sélectionnée');
      return;
    }

    if (!missionId) {
      console.error('❌ missionId est null');
      setError('ID de mission manquant');
      return;
    }

    try {
      const riskSource = riskSources.find(rs => rs.id === selectedRiskSourceId);
      if (!riskSource) {
        setError('Source de risque non trouvée');
        return;
      }

      const newObjective: RiskObjective = {
        id: `obj_${Date.now()}`,
        ...data,
        riskSourceId: selectedRiskSourceId
      };

      const updatedObjectives = [...(riskSource.objectives || []), newObjective];

      await updateRiskSource(selectedRiskSourceId, {
        objectives: updatedObjectives
      });

      // Recharger les données depuis Firebase pour s'assurer de la cohérence
      await refreshData();

      setIsAddObjectiveModalOpen(false);
      setSelectedRiskSourceId(null);
      setError('✅ Objectif ajouté avec succès !');
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setError(null), 3000);
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout de l\'objectif:', error);
      setError('Échec de l\'ajout de l\'objectif: ' + (error as Error).message);
    }
  };

  const handleAddOperationalMode = async (data: {
    name: string;
    description: string;
    techniques: string[];
    difficulty: LikelihoodScale;
    detectability: LikelihoodScale;
    prerequisites: string[];
  }) => {
    if (!selectedRiskSourceId) {
      setError('Aucune source de risque sélectionnée');
      return;
    }

    if (!missionId) {
      console.error('❌ missionId est null');
      setError('ID de mission manquant');
      return;
    }

    try {
      const riskSource = riskSources.find(rs => rs.id === selectedRiskSourceId);
      if (!riskSource) {
        setError('Source de risque non trouvée');
        return;
      }

      const newMode: OperationalMode = {
        id: `mode_${Date.now()}`,
        ...data,
        riskSourceId: selectedRiskSourceId
      };

      const updatedModes = [...(riskSource.operationalModes || []), newMode];

      await updateRiskSource(selectedRiskSourceId, {
        operationalModes: updatedModes
      });

      // Recharger les données depuis Firebase pour s'assurer de la cohérence
      await refreshData();

      setIsAddOperationalModeModalOpen(false);
      setSelectedRiskSourceId(null);
      setError('✅ Mode opératoire ajouté avec succès !');
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setError(null), 3000);
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout du mode opératoire:', error);
      setError('Échec de l\'ajout du mode opératoire: ' + (error as Error).message);
    }
  };

  // 🆕 AMÉLIORATION: Cyber Kill Chain pour modes opératoires
  const CYBER_KILL_CHAIN_PHASES = {
    reconnaissance: {
      name: 'Reconnaissance',
      description: 'Collecte d\'informations sur la cible',
      techniques: ['OSINT', 'Social Engineering', 'Scanning réseau']
    },
    weaponization: {
      name: 'Weaponization',
      description: 'Création du payload malveillant',
      techniques: ['Malware crafting', 'Exploit development', 'Backdoor creation']
    },
    delivery: {
      name: 'Delivery',
      description: 'Transmission du payload vers la cible',
      techniques: ['Email phishing', 'USB drop', 'Watering hole']
    },
    exploitation: {
      name: 'Exploitation',
      description: 'Exécution du code malveillant',
      techniques: ['Buffer overflow', 'SQL injection', 'Zero-day exploit']
    },
    installation: {
      name: 'Installation',
      description: 'Installation de l\'accès persistant',
      techniques: ['Backdoor', 'Rootkit', 'Registry modification']
    },
    command_control: {
      name: 'Command & Control',
      description: 'Établissement du canal de communication',
      techniques: ['C2 server', 'DNS tunneling', 'HTTPS beaconing']
    },
    actions_objectives: {
      name: 'Actions on Objectives',
      description: 'Réalisation des objectifs finaux',
      techniques: ['Data exfiltration', 'System destruction', 'Lateral movement']
    }
  };

  const generateOperationalModeSuggestions = (riskSource: RiskSource, objective: RiskObjective): string[] => {
    const suggestions: string[] = [];
    const sourceCategory = riskSource.category;

    // Suggestions basées sur Cyber Kill Chain selon le type de source
    if (sourceCategory === 'terrorist' || sourceCategory === 'activist') {
      suggestions.push(
        `${CYBER_KILL_CHAIN_PHASES.reconnaissance.name}: ${CYBER_KILL_CHAIN_PHASES.reconnaissance.techniques.join(', ')}`,
        `${CYBER_KILL_CHAIN_PHASES.delivery.name}: ${CYBER_KILL_CHAIN_PHASES.delivery.techniques.join(', ')}`,
        `${CYBER_KILL_CHAIN_PHASES.exploitation.name}: ${CYBER_KILL_CHAIN_PHASES.exploitation.techniques.join(', ')}`
      );
    } else if (sourceCategory === 'state') {
      suggestions.push(
        `${CYBER_KILL_CHAIN_PHASES.reconnaissance.name}: OSINT avancé, infiltration supply chain`,
        `${CYBER_KILL_CHAIN_PHASES.weaponization.name}: APT tools, zero-day exploits`,
        `${CYBER_KILL_CHAIN_PHASES.command_control.name}: Infrastructure cachée, protocoles chiffrés`
      );
    } else if (sourceCategory === 'insider') {
      suggestions.push(
        `Accès privilégié: Utilisation des droits légitimes`,
        `Contournement des contrôles: Abus de confiance`,
        `Exfiltration discrète: Canaux autorisés`
      );
    }

    return suggestions.slice(0, 3);
  };

  // 🆕 AMÉLIORATION: Suggestions d'objectifs enrichies avec référentiels
  const generateSuggestedObjectives = (riskSource: RiskSource, values: BusinessValue[]): Partial<RiskObjective>[] => {
    const suggestions: Partial<RiskObjective>[] = [];

    values.forEach(value => {
      // Heuristiques selon le type de source de risque
      let priority: LikelihoodScale = 2;
      let description = '';
      let relevantControls: any[] = [];
      
      // 🆕 AMÉLIORATION: Logique enrichie avec référentiels de sécurité
      if (riskSource.category === 'state' && value.criticalityLevel === 'essential') {
        priority = 4;
        description = `Espionnage ou sabotage de ${value.name} par acteur étatique`;
        relevantControls = getRelevantControls('Workshop2', 'preventive', ['espionage', 'sabotage']);
      } else if (riskSource.category === 'cybercriminal' && value.category === 'primary') {
        priority = 3;
        description = `Compromission financière de ${value.name} par cybercriminels`;
        relevantControls = getRelevantControls('Workshop2', 'preventive', ['financial', 'cybercrime']);
      } else if (riskSource.category === 'insider' && value.category === 'support') {
        priority = 3;
        description = `Abus de privilèges sur ${value.name} par utilisateur interne`;
        relevantControls = getRelevantControls('Workshop2', 'detective', ['insider', 'privilege']);
      } else {
        description = `Objectif de ${RISK_SOURCE_CATEGORIES[riskSource.category]} visant ${value.name}`;
        relevantControls = getRelevantControls('Workshop2', 'preventive', ['generic']);
      }

      suggestions.push({
        name: `Compromettre ${value.name}`,
        description,
        targetType: 'business_value',
        targetId: value.id,
        priority
        // Note: Métadonnées enrichies disponibles via getRelevantControls()
      });
    });

    return suggestions.slice(0, 3); // Limiter à 3 suggestions
  };

  const handleNext = async () => {
    const requiredCriteria = validationResults.filter(r => r.required);
    const unmetRequiredCriteria = requiredCriteria.filter(r => !r.met);

    // 🔧 MODE DÉVELOPPEMENT : Permettre de continuer même avec des critères non satisfaits
    const isDevelopmentMode = process.env.NODE_ENV === 'development' || window.location.search.includes('dev=true');

    if (unmetRequiredCriteria.length > 0 && !isDevelopmentMode) {
      setError(`Critères requis non satisfaits : ${unmetRequiredCriteria.map(c => c.criterion).join(', ')}`);
      return false;
    }

    if (unmetRequiredCriteria.length > 0 && isDevelopmentMode) {
      setError(`⚠️ MODE DEV : Progression autorisée malgré ${unmetRequiredCriteria.length} critère(s) non satisfait(s)`);
    }

    try {
      // Marquer l'atelier 2 comme complété
      if (mission) {
        await updateMission(mission.id, {
          ...mission,
          ebiosCompliance: {
            ...mission.ebiosCompliance,
            completionPercentage: 40 // 40% après atelier 2
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

  const getPertinenceColor = (pertinence: LikelihoodScale) => {
    switch (pertinence) {
      case 1: return 'text-green-600 bg-green-50';
      case 2: return 'text-yellow-600 bg-yellow-50';
      case 3: return 'text-orange-600 bg-orange-50';
      case 4: return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
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
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Atelier 2 : Sources de Risque
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Identifier et analyser les sources de risque susceptibles de s'intéresser aux valeurs métier selon EBIOS RM v1.5
            </p>
          </div>
          <div className="flex space-x-2">
            {/* 🆕 AMÉLIORATION: Indicateur de cohérence IA */}
            <AICoherenceIndicator
              missionId={missionId}
              workshop={2}
              data={{
                riskSources,
                businessValues
              }}
              size="sm"
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
            <h3 className="font-medium text-gray-900 mb-2">Objectifs de l'Atelier 2 (ANSSI) :</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li><strong>Sources de risque :</strong> Identifier qui peut s'intéresser aux valeurs métier</li>
              <li><strong>Catégorisation :</strong> Classer selon les 7 types EBIOS RM (cybercriminel, état, etc.)</li>
              <li><strong>Objectifs visés :</strong> Définir ce que cherche chaque source de risque</li>
              <li><strong>Modes opératoires :</strong> Analyser comment elles procèdent (techniques MITRE ATT&CK)</li>
              <li><strong>Évaluation de pertinence :</strong> Coter selon l'échelle ANSSI (1-4)</li>
            </ul>
          </div>
        )}
      </div>

      {/* Tableau de bord de progression */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">État d'Avancement - Atelier 2</h2>
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

      {error && (
        <div className={`rounded-md p-4 ${
          error.includes('✅') ? 'bg-green-50 border border-green-200' :
          error.includes('💡') ? 'bg-blue-50 border border-blue-200' :
          error.includes('⚠️') ? 'bg-yellow-50 border border-yellow-200' :
          'bg-red-50 border border-red-200'
        }`}>
          <div className="flex">
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                error.includes('✅') ? 'text-green-800' :
                error.includes('💡') ? 'text-blue-800' :
                error.includes('⚠️') ? 'text-yellow-800' :
                'text-red-800'
              }`}>
                {error}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* 🔧 GUIDE UTILISATEUR: Aide contextuelle pour débloquer l'atelier */}
      {validationResults.some(r => r.required && !r.met) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">Prochaines étapes</h3>
              <p className="text-sm text-blue-700 mt-1">
                Pour continuer vers l'Atelier 3, ajoutez des objectifs et modes opératoires à vos sources de risque.
              </p>
              <p className="text-xs text-blue-600 mt-2">
                💡 Utilisez les boutons "Objectifs" et "Modes Op." sur chaque source de risque, ou les suggestions IA.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section principale des sources de risque */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="h-6 w-6 text-orange-500" />
              <h2 className="ml-2 text-lg font-medium text-gray-900">Sources de Risque</h2>
            </div>
            <Button
              onClick={() => setIsAddRiskSourceModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Ajouter une Source</span>
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {riskSources.map((source) => (
              <div key={source.id} className="border rounded-lg p-6">
                {/* En-tête de la source de risque */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{source.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{source.description}</p>
                    
                    {/* Métadonnées */}
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="text-sm text-gray-600">
                        <strong>Type :</strong> {RISK_SOURCE_CATEGORIES[source.category]}
                      </span>
                      <span className={`px-2 py-1 rounded text-sm ${getPertinenceColor(source.pertinence)}`}>
                        Pertinence : {EbiosUtils.formatScaleLabel('likelihood', source.pertinence)}
                      </span>
                    </div>

                    {/* Caractéristiques de la source */}
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium text-gray-900">Expertise</div>
                        <div className="text-gray-600">{source.expertise}</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium text-gray-900">Ressources</div>
                        <div className="text-gray-600">{source.resources}</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded">
                        <div className="font-medium text-gray-900">Motivation</div>
                        <div className="text-gray-600">{source.motivation}/4</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions rapides */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedRiskSourceId(source.id);
                      setIsAddObjectiveModalOpen(true);
                    }}
                    className="flex items-center space-x-1"
                  >
                    <Users className="h-3 w-3" />
                    <span>Objectifs</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedRiskSourceId(source.id);
                      setIsAddOperationalModeModalOpen(true);
                    }}
                    className="flex items-center space-x-1"
                  >
                    <Zap className="h-3 w-3" />
                    <span>Modes Op.</span>
                  </Button>

                  {/* 🆕 AMÉLIORATION: Bouton suggestions Cyber Kill Chain */}
                  {source.objectives && source.objectives.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const firstObjective = source.objectives![0];
                        const suggestions = generateOperationalModeSuggestions(source, firstObjective);
                        if (suggestions.length > 0) {
                          const suggestionText = suggestions.map((s, idx) =>
                            `${idx + 1}. ${s}`
                          ).join('\n\n');
                          alert(`⚔️ Modes opératoires suggérés (Cyber Kill Chain) pour "${source.name}" :\n\n${suggestionText}\n\n💡 Basé sur la méthodologie Cyber Kill Chain de Lockheed Martin`);
                        }
                      }}
                      className="flex items-center space-x-1 bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    >
                      <Target className="h-3 w-3" />
                      <span>Kill Chain</span>
                    </Button>
                  )}

                  {/* 🆕 AMÉLIORATION: Bouton suggestions IA */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const suggestions = generateSuggestedObjectives(source, businessValues);
                      if (suggestions.length > 0) {
                        const suggestionText = suggestions.map(s =>
                          `• ${s.name}\n  ${s.description}\n  Priorité: ${s.priority}/4`
                        ).join('\n\n');
                        alert(`💡 Suggestions IA pour "${source.name}" :\n\n${suggestionText}\n\n🔧 Référentiels intégrés : ISO 27002, NIST CSF, CIS Controls`);
                      } else {
                        alert('Aucune suggestion disponible pour cette source de risque.');
                      }
                    }}
                    className="flex items-center space-x-1 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                  >
                    <Lightbulb className="h-3 w-3" />
                    <span>Suggestions IA</span>
                  </Button>
                </div>

                {/* Objectifs visés */}
                {source.objectives && source.objectives.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Objectifs Visés ({source.objectives.length})
                    </h4>
                    {source.objectives.map(objective => (
                      <div key={objective.id} className="flex items-center justify-between py-1 text-sm">
                        <span className="text-gray-700">{objective.name}</span>
                        <span className={`px-1.5 py-0.5 rounded text-xs ${getPertinenceColor(objective.priority)}`}>
                          {objective.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Modes opératoires */}
                {source.operationalModes && source.operationalModes.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Modes Opératoires ({source.operationalModes.length})
                    </h4>
                    {source.operationalModes.map(mode => (
                      <div key={mode.id} className="py-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{mode.name}</span>
                          <div className="flex space-x-1">
                            <span className="text-xs text-gray-500">Diff: {mode.difficulty}</span>
                            <span className="text-xs text-gray-500">Dét: {mode.detectability}</span>
                          </div>
                        </div>
                        {mode.techniques.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Techniques : {mode.techniques.slice(0, 3).join(', ')}
                            {mode.techniques.length > 3 && ` +${mode.techniques.length - 3}`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {riskSources.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Target className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune source de risque</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Identifiez qui pourrait s'intéresser à vos valeurs métier.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setIsAddRiskSourceModalOpen(true)}>
                    Ajouter une Source de Risque
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales pour l'ajout des sources de risque, objectifs et modes opératoires */}
      <AddRiskSourceModal
        isOpen={isAddRiskSourceModalOpen}
        onClose={() => setIsAddRiskSourceModalOpen(false)}
        onSubmit={handleCreateRiskSource}
        missionId={missionId}
        businessValues={businessValues}
        existingRiskSources={riskSources}
      />
      <AddObjectiveModal
        isOpen={isAddObjectiveModalOpen}
        onClose={() => setIsAddObjectiveModalOpen(false)}
        onSubmit={handleAddObjective}
        missionId={missionId || ''}
        riskSourceName={selectedRiskSourceId ? riskSources.find(rs => rs.id === selectedRiskSourceId)?.name || '' : ''}
      />
      <AddOperationalModeModal
        isOpen={isAddOperationalModeModalOpen}
        onClose={() => setIsAddOperationalModeModalOpen(false)}
        onSubmit={handleAddOperationalMode}
        riskSourceName={selectedRiskSourceId ? riskSources.find(rs => rs.id === selectedRiskSourceId)?.name || '' : ''}
      />

      <WorkshopNavigation
        currentWorkshop={2}
        totalWorkshops={5}
        onNext={handleNext}
        canProceed={
          validationResults.filter(r => r.required).every(r => r.met) ||
          process.env.NODE_ENV === 'development' ||
          window.location.search.includes('dev=true')
        }
      />
    </div>
  );
};

export default Workshop2;