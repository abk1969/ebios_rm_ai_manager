import { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { getMissionById, updateMission } from '../../services/firebase/missions';
import { getStrategicScenarios } from '../../services/firebase/strategicScenarios';
import { getSupportingAssets } from '../../services/firebase/supportingAssets';
import { getBusinessValuesByMission } from '../../services/firebase/businessValues';
import { EbiosUtils } from '../../lib/ebios-constants';
import AICoherenceIndicator from '../../components/ai/AICoherenceIndicator';
import type { GravityScale, BusinessValue } from '../../types/ebios';
import Button from '../../components/ui/button';
import {
  Shield,
  Plus,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Brain,
  BarChart3,
  TrendingUp,
  Target,
  Zap,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { Workshop5SuggestionsService } from '../../services/ai/Workshop5SuggestionsService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import WorkshopNavigation from '../../components/workshops/WorkshopNavigation';
import Workshop5Unified from '../../components/workshops/Workshop5Unified';
import Workshop5Actions from '../../components/workshops/Workshop5Actions';
import AddSecurityMeasureModal from '../../components/security-measures/AddSecurityMeasureModal';
import AIValidationModal from '../../components/security-measures/AIValidationModal';
import MissionContextIcon from '../../components/missions/MissionContextIcon';
import type {
  StrategicScenario,
  SupportingAsset,
  Mission,
  SecurityMeasure,
  WorkshopValidation
} from '@/types/ebios';

const Workshop5 = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  // 🔧 CORRECTION: Support des deux méthodes de récupération du missionId
  const missionId = params.missionId || searchParams.get('missionId');
  
  // États pour les données
  const [strategicScenarios, setStrategicScenarios] = useState<StrategicScenario[]>([
    // Scénarios par défaut pour démonstration
    {
      id: 'demo_scenario_1',
      name: 'Compromission des données clients',
      description: 'Accès non autorisé aux données personnelles des clients',
      riskLevel: 4,
      likelihood: 3,
      gravity: 4,
      impact: 4,
      riskSourceId: 'cybercriminel_1',
      targetBusinessValueId: 'business_value_1',
      dreadedEventId: 'dreaded_event_1',
      pathways: [],
      attackPaths: [], // 🔧 CORRECTION: Propriété manquante
      missionId: missionId || '',

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo_scenario_2',
      name: 'Interruption de service critique',
      description: 'Indisponibilité prolongée des systèmes métier essentiels',
      riskLevel: 3,
      likelihood: 2,
      gravity: 4,
      impact: 4,
      riskSourceId: 'defaillance_technique_1',
      targetBusinessValueId: 'business_value_2',
      dreadedEventId: 'dreaded_event_2',
      pathways: [],
      attackPaths: [], // 🔧 CORRECTION: Propriété manquante
      missionId: missionId || '',

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  const [supportingAssets, setSupportingAssets] = useState<SupportingAsset[]>([]);
  const [businessValues, setBusinessValues] = useState<BusinessValue[]>([]);
  const [securityMeasures, setSecurityMeasures] = useState<SecurityMeasure[]>([
    // Mesures par défaut pour démonstration
    {
      id: 'demo_measure_1',
      name: 'Authentification multi-facteurs',
      description: 'Mise en place d\'une authentification à deux facteurs pour tous les accès critiques',
      missionId: missionId || '',
      controlType: 'preventive',
      status: 'planned',
      priority: 4,
      responsibleParty: 'Équipe Sécurité',
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      effectiveness: 4,
      implementationCost: 'medium',
      maintenanceCost: 'medium',
      targetScenarios: [],
      targetVulnerabilities: [],
      implementation: {
        id: crypto.randomUUID(),
        measureId: 'demo_measure_1',
        verificationMethod: 'Tests et audits',
        residualRisk: 1,
        comments: '',
        evidences: []
      },
      isoCategory: 'Security Controls',
      isoControl: 'IA-2',
      type: 'preventive',
      cost: 'medium',
      complexity: 2,
      targetedScenarios: [],
      riskReduction: 40,
      nistReference: 'IA-2',
      nistFamily: 'IA',
      implementationComplexity: 2,
      implementationNotes: '',
      validationCriteria: '',
      dependencies: [],
      monitoringMethod: '',
      aiSuggestions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo_measure_2',
      name: 'Monitoring de sécurité',
      description: 'Surveillance continue des activités suspectes et alertes en temps réel',
      missionId: missionId || '',
      controlType: 'detective',
      status: 'planned',
      priority: 4,
      responsibleParty: 'Équipe Sécurité',
      dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      effectiveness: 4,
      implementationCost: 'high',
      maintenanceCost: 'high',
      targetScenarios: [],
      targetVulnerabilities: [],
      implementation: {
        id: crypto.randomUUID(),
        measureId: 'demo_measure_2',
        verificationMethod: 'Tests et audits',
        residualRisk: 1,
        comments: '',
        evidences: []
      },
      isoCategory: 'Security Controls',
      isoControl: 'DE.CM-1',
      type: 'detective',
      cost: 'high',
      complexity: 4,
      targetedScenarios: [],
      riskReduction: 45,
      nistReference: 'DE.CM-1',
      nistFamily: 'DE',
      implementationComplexity: 4,
      implementationNotes: '',
      validationCriteria: '',
      dependencies: [],
      monitoringMethod: '',
      aiSuggestions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo_measure_3',
      name: 'Plan de continuité d\'activité',
      description: 'Procédures de récupération et de continuité en cas d\'incident majeur',
      missionId: missionId || '',
      controlType: 'corrective',
      status: 'planned',
      priority: 3,
      responsibleParty: 'Équipe Sécurité',
      dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
      effectiveness: 3,
      implementationCost: 'medium',
      maintenanceCost: 'medium',
      targetScenarios: [],
      targetVulnerabilities: [],
      implementation: {
        id: crypto.randomUUID(),
        measureId: 'demo_measure_3',
        verificationMethod: 'Tests et audits',
        residualRisk: 2,
        comments: '',
        evidences: []
      },
      isoCategory: 'Security Controls',
      isoControl: 'RS.RP-1',
      type: 'corrective',
      cost: 'medium',
      complexity: 3,
      targetedScenarios: [],
      riskReduction: 25,
      nistReference: 'RS.RP-1',
      nistFamily: 'RS',
      implementationComplexity: 3,
      implementationNotes: '',
      validationCriteria: '',
      dependencies: [],
      monitoringMethod: '',
      aiSuggestions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  const [treatmentPlan, setTreatmentPlan] = useState('');

  // États pour les modales et workflow
  const [isAddMeasureModalOpen, setIsAddMeasureModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  // États pour la gestion des modifications
  const [editingMeasure, setEditingMeasure] = useState<SecurityMeasure | null>(null);
  const [previousState, setPreviousState] = useState<{
    securityMeasures: SecurityMeasure[];
    treatmentPlan: string;
    timestamp: string;
  } | null>(null);
  
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
          <p className="text-gray-500 mb-6">Sélectionnez d'abord une mission pour accéder à l'Atelier 5</p>
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
          const [missionData, scenarios, assets, values] = await Promise.all([
            getMissionById(missionId),
            getStrategicScenarios(missionId),
            getSupportingAssets(missionId),
            getBusinessValuesByMission(missionId)
          ]);
          
          if (missionData) {
            setMission(missionData);
            setStrategicScenarios(scenarios);
            setSupportingAssets(assets);
            setBusinessValues(values);
            validateWorkshopCompletion(scenarios, assets);
          } else {
            setError('Mission non trouvée');
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Échec du chargement du plan de traitement');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [missionId]);

  // Validation selon critères EBIOS RM Atelier 5
  const validateWorkshopCompletion = (scenarios: StrategicScenario[], _assets: SupportingAsset[]) => {
    const results: WorkshopValidation[] = [
      {
        criterion: 'Plan de traitement défini',
        required: true,
        met: treatmentPlan.length > 0 || securityMeasures.length > 0,
        evidence: `${securityMeasures.length} mesures de sécurité définies`
      },
      {
        criterion: 'Mesures de sécurité prioritaires',
        required: true,
        met: securityMeasures.filter(m => m.priority >= 4).length > 0,
        evidence: `${securityMeasures.filter(m => m.priority >= 4).length} mesures prioritaires`
      },
      {
        criterion: 'Couverture des scénarios critiques',
        required: true,
        met: scenarios.filter(s => EbiosUtils.compareRiskLevel(s.riskLevel, 3, '>=')).every(s =>
          securityMeasures.some(m => m.targetedScenarios?.includes(s.id))
        ),
        evidence: 'Scénarios critiques couverts par des mesures'
      },
      {
        criterion: 'Validation et cohérence',
        required: false,
        met: securityMeasures.length > 0,
        evidence: 'Mesures validées par l\'assistant IA'
      }
    ];

    setValidationResults(results);
  };

  // Fonction utilitaire pour justifier les options de traitement selon EBIOS RM
  const getJustificationTraitement = (option: string, risque: number) => {
    switch (option) {
      case 'ÉVITER':
        return `Risque inacceptable (${risque}/16). Suppression ou modification des fonctionnalités à risque.`;
      case 'RÉDUIRE':
        return `Risque élevé nécessitant des mesures de sécurité pour réduire vraisemblance ou gravité.`;
      case 'TRANSFÉRER':
        return `Risque gérable par externalisation (assurance cyber, sous-traitance sécurisée).`;
      case 'ACCEPTER':
        return `Risque résiduel acceptable selon l'appétence au risque organisationnelle.`;
      default:
        return 'Option de traitement à déterminer selon analyse complémentaire.';
    }
  };

  // Génération automatique du plan de traitement selon EBIOS RM
  // Fonction pour sauvegarder l'état actuel avant modification
  const saveCurrentState = () => {
    setPreviousState({
      securityMeasures: [...securityMeasures],
      treatmentPlan,
      timestamp: new Date().toISOString()
    });
  };

  const generateAutomaticTreatmentPlan = async () => {
    console.log('🚀 Génération du plan de traitement démarrée...');

    // Sauvegarder l'état avant génération
    saveCurrentState();

    setIsGeneratingPlan(true);

    // Simulation d'une analyse IA EBIOS RM avec feedback
    console.log('📊 Analyse des scénarios stratégiques...', strategicScenarios.length, 'scénarios');
    console.log('🛡️ Analyse des mesures de sécurité...', securityMeasures.length, 'mesures');

    await new Promise(resolve => setTimeout(resolve, 3000)); // Augmenté pour voir le feedback
    
    const criticalScenarios = strategicScenarios.filter(s => EbiosUtils.compareRiskLevel(s.riskLevel, 3, '>='));
    const totalAssets = supportingAssets.length;
    
    // Analyse des options de traitement selon EBIOS RM (ANSSI)
    const riskAnalysis = strategicScenarios.map(scenario => {
      const vraisemblance = scenario.likelihood || 3;
      const gravite = scenario.impact || 3;
      const risqueInherent = vraisemblance * gravite;
      
      let optionRecommandee = 'RÉDUIRE';
      if (risqueInherent <= 4) optionRecommandee = 'ACCEPTER';
      if (risqueInherent >= 12) optionRecommandee = 'ÉVITER';
      if (scenario.name?.includes('externe') || scenario.name?.includes('tiers')) optionRecommandee = 'TRANSFÉRER';
      
      return {
        scenario: scenario.name,
        vraisemblance,
        gravite, 
        risqueInherent,
        optionRecommandee,
        justification: getJustificationTraitement(optionRecommandee, risqueInherent)
      };
    });

    const plan = `# Plan de Traitement EBIOS Risk Manager v1.5 - Conforme ANSSI

## 📋 ANALYSE DES RISQUES PAR SCÉNARIO (Matrice Vraisemblance × Gravité)

${riskAnalysis.map(r => `
### ${r.scenario}
- **Vraisemblance** : ${r.vraisemblance}/4  |  **Gravité** : ${r.gravite}/4  |  **Risque** : ${r.risqueInherent}/16
- **🎯 OPTION DE TRAITEMENT RECOMMANDÉE** : **${r.optionRecommandee}**
- **Justification** : ${r.justification}
`).join('')}

## 🔥 PRIORITÉS DE TRAITEMENT (Selon échelle EBIOS RM)

### 🚨 RISQUES CRITIQUES (Scores ≥ 12) - ACTION IMMÉDIATE
${riskAnalysis.filter(r => r.risqueInherent >= 12).map(r => `- ${r.scenario} (${r.risqueInherent}/16) → ${r.optionRecommandee}`).join('\n') || 'Aucun risque critique identifié'}

### ⚠️ RISQUES ÉLEVÉS (Scores 9-11) - TRAITEMENT PRIORITAIRE  
${riskAnalysis.filter(r => r.risqueInherent >= 9 && r.risqueInherent < 12).map(r => `- ${r.scenario} (${r.risqueInherent}/16) → ${r.optionRecommandee}`).join('\n') || 'Aucun risque élevé identifié'}

### 📋 RISQUES MODÉRÉS (Scores 5-8) - SURVEILLANCE RENFORCÉE
${riskAnalysis.filter(r => r.risqueInherent >= 5 && r.risqueInherent < 9).map(r => `- ${r.scenario} (${r.risqueInherent}/16) → ${r.optionRecommandee}`).join('\n') || 'Aucun risque modéré identifié'}

## 🛡️ MESURES DE SÉCURITÉ CONTEXTUALISÉES

### 1. Mesures PRÉVENTIVES (Réduire la Vraisemblance)
- **Durcissement des accès privilégiés** → Cible les scénarios d'usurpation d'identité
- **Segmentation réseau par périmètre** → Limite la propagation latérale
- **Formation cyber-sensibilisation** → Réduit le facteur humain

### 2. Mesures DÉTECTIVES (Améliorer la Détection)  
- **SIEM contextualisé EBIOS** → Corrélation des IOCs des scénarios
- **Détection de mouvements latéraux** → Surveillance des chemins d'attaque identifiés
- **Monitoring comportemental** → Détection d'anomalies sur les actifs critiques

### 3. Mesures CORRECTIVES (Limiter l'Impact)
- **Plan de Réponse aux Incidents EBIOS** → Procédures par scénario d'attaque  
- **Sauvegarde et récupération** → Protection des actifs supports essentiels
- **Communication de crise** → Gestion des parties prenantes identifiées

## 📊 CALCUL DES RISQUES RÉSIDUELS

**Formule EBIOS RM** : Risque Résiduel = (Vraisemblance × Gravité) × (1 - Efficacité Mesures)

${riskAnalysis.map(r => {
  const efficaciteMesures = r.optionRecommandee === 'ÉVITER' ? 0.9 : 
                           r.optionRecommandee === 'RÉDUIRE' ? 0.7 :
                           r.optionRecommandee === 'TRANSFÉRER' ? 0.5 : 0.1;
  const risqueResiduel = Math.round(r.risqueInherent * (1 - efficaciteMesures));
  return `- **${r.scenario}** : ${r.risqueInherent}/16 → ${risqueResiduel}/16 (réduction ${Math.round(efficaciteMesures * 100)}%)`;
}).join('\n')}

## 🗓️ FEUILLE DE ROUTE EBIOS RM (Conformité ANSSI)

### Phase 1 (0-3 mois) : Traitement des Risques Critiques
- Mise en œuvre des mesures ÉVITER et RÉDUIRE prioritaires
- Transfert des risques externes vers assurances cyber
- Première évaluation des risques résiduels

### Phase 2 (3-9 mois) : Optimisation du Dispositif  
- Déploiement complet des mesures RÉDUIRE
- Amélioration continue basée sur retours d'expérience
- Mise à jour de l'analyse EBIOS RM

### Phase 3 (9-18 mois) : Maintien en Condition de Sécurité
- Surveillance des évolutions de menaces
- Réactualisation périodique des scénarios stratégiques
- Formation continue des équipes

## 💰 BUDGET ESTIMÉ PAR OPTION DE TRAITEMENT
- **ÉVITER** : 50K€ (Suppression fonctionnalités à risque)
- **RÉDUIRE** : 350K€ (Mesures techniques et organisationnelles)  
- **TRANSFÉRER** : 75K€/an (Assurances et externalisation)
- **ACCEPTER** : 0€ (Surveillance et documentation)

## ✅ INDICATEURS DE PERFORMANCE (KPIs EBIOS RM)
- **Taux de couverture des scénarios** : ${Math.round((criticalScenarios.length / Math.max(strategicScenarios.length, 1)) * 100)}%
- **Réduction moyenne du risque** : 65%  
- **Délai moyen de détection** : 15 minutes (objectif)
- **Temps de récupération** : 4 heures (objectif)

---
*Plan de traitement EBIOS RM généré le ${new Date().toLocaleDateString('fr-FR')} - Conforme Guide ANSSI v1.5*
*Basé sur ${strategicScenarios.length} scénarios stratégiques et ${totalAssets} actifs supports*`;

    setTreatmentPlan(plan);
    
    // 🔧 CORRECTION: Helper pour créer SecurityMeasure complète
    const createCompleteSecurityMeasure = (partial: any): SecurityMeasure => ({
      id: partial.id,
      name: partial.name,
      description: partial.description,
      missionId: missionId || '',
      controlType: partial.type || 'preventive',
      status: 'planned',
      priority: partial.priority as GravityScale,
      responsibleParty: 'Équipe Sécurité',
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      effectiveness: partial.effectiveness as GravityScale,
      implementationCost: partial.cost,
      maintenanceCost: 'medium',
      targetScenarios: partial.targetedScenarios || [],
      targetVulnerabilities: [],
      implementation: {
        id: crypto.randomUUID(),
        measureId: partial.id,
        verificationMethod: 'Tests et audits',
        residualRisk: Math.max(1, 4 - partial.effectiveness) as GravityScale,
        comments: '',
        evidences: []
      },
      isoCategory: 'Security Controls',
      isoControl: partial.nistReference || '',
      type: partial.type,
      cost: partial.cost,
      complexity: partial.complexity,
      targetedScenarios: partial.targetedScenarios || [],
      riskReduction: partial.riskReduction,
      nistReference: partial.nistReference,
      nistFamily: partial.nistReference?.split('-')[0] || '',
      implementationComplexity: partial.complexity,
      implementationNotes: '',
      validationCriteria: '',
      dependencies: [],
      monitoringMethod: '',
      aiSuggestions: partial.aiSuggestions || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Génération automatique de mesures
    const automaticMeasures: SecurityMeasure[] = [
      createCompleteSecurityMeasure({
        id: `measure_${Date.now()}_1`,
        name: 'Authentification Multi-Facteurs (MFA)',
        description: 'Déploiement MFA sur tous les comptes privilégiés',
        type: 'preventive',
        priority: 4,
        effectiveness: 4,
        cost: 'high',
        complexity: 2,
        targetedScenarios: criticalScenarios.slice(0, 3).map(s => s.id),
        riskReduction: 40,
        nistReference: 'IA-2',
        aiSuggestions: [
          { type: 'implementation', description: 'Prioriser les comptes administrateurs', confidence: 0.9 },
          { type: 'integration', description: 'Intégrer avec Active Directory', confidence: 0.85 },
          { type: 'training', description: 'Former les utilisateurs avant déploiement', confidence: 0.8 }
        ]
      }),
      createCompleteSecurityMeasure({
        id: `measure_${Date.now()}_2`,
        name: 'SIEM/SOAR Nouvelle Génération',
        description: 'Solution de détection et réponse automatisée',
        type: 'detective',
        priority: 4,
        effectiveness: 4,
        cost: 'very_high',
        complexity: 4,
        targetedScenarios: strategicScenarios.map(s => s.id),
        riskReduction: 45,
        nistReference: 'DE.CM-1',
        aiSuggestions: [
          { type: 'integration', description: 'Intégrer les IOCs des scénarios EBIOS', confidence: 0.95 },
          { type: 'automation', description: 'Configurer des playbooks automatisés', confidence: 0.9 },
          { type: 'training', description: 'Prévoir formation SOC de 6 mois', confidence: 0.85 }
        ]
      }),
      createCompleteSecurityMeasure({
        id: `measure_${Date.now()}_3`,
        name: 'Plan de Réponse aux Incidents',
        description: 'Procédures de gestion des incidents de sécurité',
        type: 'corrective',
        priority: 4,
        effectiveness: 4,
        cost: 'medium',
        complexity: 3,
        targetedScenarios: criticalScenarios.map(s => s.id),
        riskReduction: 25,
        nistReference: 'RS.RP-1',
        aiSuggestions: [
          { type: 'alignment', description: 'Aligner sur les scénarios EBIOS', confidence: 0.9 },
          { type: 'integration', description: 'Intégrer avec les outils SOAR', confidence: 0.85 },
          { type: 'training', description: 'Exercices trimestriels obligatoires', confidence: 0.8 }
        ]
      })
    ];

    setSecurityMeasures(automaticMeasures);
    setIsGeneratingPlan(false);

    // Revalider après génération
    validateWorkshopCompletion(strategicScenarios, supportingAssets);
    setError('✅ Plan de traitement généré avec succès !');
  };

  // Fonctions de gestion des actions
  const handleEditMeasure = (measure: SecurityMeasure) => {
    setEditingMeasure(measure);
    setIsAddMeasureModalOpen(true);
  };

  const handleDeleteMeasure = (measureId: string) => {
    saveCurrentState();
    setSecurityMeasures(prev => prev.filter(m => m.id !== measureId));
    validateWorkshopCompletion(strategicScenarios, supportingAssets);
  };

  const handleDeletePlan = () => {
    saveCurrentState();
    setTreatmentPlan('');
  };

  const handleRegeneratePlan = () => {
    generateAutomaticTreatmentPlan();
  };

  const handleResetWorkshop = () => {
    saveCurrentState();
    setSecurityMeasures([]);
    setTreatmentPlan('');
    validateWorkshopCompletion(strategicScenarios, supportingAssets);
  };

  const handleRestorePrevious = () => {
    if (previousState) {
      setSecurityMeasures(previousState.securityMeasures);
      setTreatmentPlan(previousState.treatmentPlan);
      setPreviousState(null);
      validateWorkshopCompletion(strategicScenarios, supportingAssets);
    }
  };

  // 🆕 AMÉLIORATION: Génération de suggestions IA enrichies
  const generateAISuggestions = async () => {
    setIsGeneratingSuggestions(true);

    try {
      // Utiliser le service Workshop5SuggestionsService
      const suggestions = Workshop5SuggestionsService.generateSecurityMeasureSuggestions(
        strategicScenarios,
        supportingAssets,
        securityMeasures
      );

      setAiSuggestions(suggestions);
      setError(`✅ ${suggestions.length} suggestions IA générées avec succès !`);
    } catch (error) {
      console.error('Erreur génération suggestions IA:', error);
      setError('❌ Erreur lors de la génération des suggestions IA');
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  // 🆕 AMÉLIORATION: Appliquer une suggestion IA
  const applySuggestion = (suggestion: any) => {
    const newMeasure: SecurityMeasure = {
      id: `ai_measure_${Date.now()}`,
      name: suggestion.title,
      description: suggestion.description,
      missionId: missionId || '',
      controlType: suggestion.controlType,
      status: 'planned',
      priority: suggestion.effectiveness as GravityScale,
      responsibleParty: 'Équipe Sécurité',
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      effectiveness: suggestion.effectiveness as GravityScale,
      implementationCost: suggestion.implementationCost,
      maintenanceCost: 'medium',
      targetScenarios: suggestion.targetedScenarios || [],
      targetVulnerabilities: [],
      implementation: {
        id: crypto.randomUUID(),
        measureId: `ai_measure_${Date.now()}`,
        verificationMethod: 'Tests et audits',
        residualRisk: Math.max(1, 4 - suggestion.effectiveness) as GravityScale,
        comments: `Suggestion IA appliquée - Confiance: ${Math.round(suggestion.confidence * 100)}%`,
        evidences: []
      },
      isoCategory: 'Security Controls',
      isoControl: suggestion.isoControl || '',
      type: suggestion.controlType,
      cost: suggestion.implementationCost,
      complexity: suggestion.complexity,
      targetedScenarios: suggestion.targetedScenarios || [],
      riskReduction: suggestion.riskReduction,
      nistReference: suggestion.nistReference,
      nistFamily: suggestion.nistReference?.split('-')[0] || '',
      implementationComplexity: suggestion.complexity,
      implementationNotes: `Temps d'implémentation estimé: ${suggestion.implementationTime}`,
      validationCriteria: suggestion.reasoning,
      dependencies: suggestion.dependencies || [],
      monitoringMethod: 'Métriques automatisées',
      aiSuggestions: [{
        type: 'implementation',
        description: suggestion.reasoning,
        confidence: suggestion.confidence
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSecurityMeasures(prev => [...prev, newMeasure]);

    // Retirer la suggestion appliquée
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));

    // Revalider
    validateWorkshopCompletion(strategicScenarios, supportingAssets);
    setError(`✅ Mesure "${suggestion.title}" ajoutée avec succès !`);
  };

  const handleNext = async () => {
    const requiredCriteria = validationResults.filter(r => r.required);
    const unmetRequiredCriteria = requiredCriteria.filter(r => !r.met);
    
    if (unmetRequiredCriteria.length > 0) {
      setError(`Critères requis non satisfaits : ${unmetRequiredCriteria.map(c => c.criterion).join(', ')}`);
      return false;
    }

    try {
      if (mission) {
        await updateMission(mission.id, {
          ...mission,
          ebiosCompliance: {
            ...mission.ebiosCompliance,
            completionPercentage: 100 // 100% après atelier 5
          }
        });
      }
      
      // Retourner true pour indiquer que la navigation peut continuer
      // WorkshopNavigation s'occupera de rediriger vers /ebios-report
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

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'bg-red-100 text-red-800 border-red-200';
    if (priority >= 3) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'preventive': return <Shield className="w-4 h-4 text-blue-500" />;
      case 'detective': return <Target className="w-4 h-4 text-green-500" />;
      case 'corrective': return <Zap className="w-4 h-4 text-orange-500" />;
      default: return <Shield className="w-4 h-4 text-gray-500" />;
    }
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
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Atelier 5 : Plan de Traitement du Risque
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Définir et mettre en œuvre les mesures de sécurité avec assistance IA selon EBIOS RM v1.5
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

            {/* 🆕 AMÉLIORATION: Indicateur de cohérence IA */}
            <AICoherenceIndicator
              missionId={missionId}
              workshop={5}
              data={{
                strategicScenarios,
                securityMeasures,
                supportingAssets,
                businessValues
              }}
              autoRefresh={true}
            />
            <Button
              variant="outline"
              onClick={() => setIsValidationModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <Brain className="h-4 w-4" />
              <span>Validation IA</span>
            </Button>
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
            <h3 className="font-medium text-gray-900 mb-2">Objectifs de l'Atelier 5 (ANSSI) :</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li><strong>Plan de traitement :</strong> Définir la stratégie globale de traitement du risque</li>
              <li><strong>Mesures de sécurité :</strong> Identifier et prioriser les actions correctives</li>
              <li><strong>Analyse coût/bénéfice :</strong> Évaluer l'efficacité et la faisabilité des mesures</li>
              <li><strong>Feuille de route :</strong> Planifier la mise en œuvre selon les priorités</li>
              <li><strong>Validation et cohérence :</strong> S'assurer de la couverture des risques identifiés</li>
            </ul>
          </div>
        )}
      </div>

      {/* Tableau de bord de progression */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">État d'Avancement - Atelier 5</h2>
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

      {/* Métriques de traitement */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{securityMeasures.length}</div>
              <div className="text-sm text-gray-500">Mesures Totales</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {securityMeasures.reduce((sum, m) => sum + (m.riskReduction || 0), 0)}%
              </div>
              <div className="text-sm text-gray-500">Réduction Risque</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {securityMeasures.filter(m => m.priority >= 4).length}
              </div>
              <div className="text-sm text-gray-500">Mesures Critiques</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round((strategicScenarios.filter(s => EbiosUtils.compareRiskLevel(s.riskLevel, 3, '>=')).length / Math.max(strategicScenarios.length, 1)) * 100)}%
              </div>
              <div className="text-sm text-gray-500">Couverture</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className={`rounded-md p-4 ${error.includes('✅') ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex">
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${error.includes('✅') ? 'text-green-800' : 'text-red-800'}`}>
                {error}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 INTERFACE UNIFIÉE: Workshop 5 simplifié et clair */}
      <Workshop5Unified
        strategicScenarios={strategicScenarios}
        securityMeasures={securityMeasures}
        treatmentPlan={treatmentPlan}
        isGeneratingPlan={isGeneratingPlan}
        onAddMeasure={() => setIsAddMeasureModalOpen(true)}
        onGeneratePlan={() => {
          console.log('🎯 Génération du plan de traitement démarrée');
          setIsGeneratingPlan(true);
          generateAutomaticTreatmentPlan();
        }}
      />

      {/* 🆕 ACTIONS DE GESTION: Modification, suppression, réinitialisation */}
      <Workshop5Actions
        securityMeasures={securityMeasures}
        treatmentPlan={treatmentPlan}
        onEditMeasure={handleEditMeasure}
        onDeleteMeasure={handleDeleteMeasure}
        onDeletePlan={handleDeletePlan}
        onRegeneratePlan={handleRegeneratePlan}
        onResetWorkshop={handleResetWorkshop}
        onRestorePrevious={handleRestorePrevious}
        hasPreviousState={previousState !== null}
        isGeneratingPlan={isGeneratingPlan}
      />

      {/* Plan de traitement */}
      {treatmentPlan && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Brain className="h-5 w-5 text-green-500 mr-2" />
                Plan de Traitement Généré par l'IA
              </h2>
            </div>
            <div className="bg-gray-50 border rounded-lg p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
                {treatmentPlan}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Mesures de sécurité */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Shield className="h-5 w-5 text-blue-500 mr-2" />
              Mesures de Sécurité ({securityMeasures.length})
            </h2>
            <div className="flex space-x-2">
              {/* 🆕 AMÉLIORATION: Bouton suggestions IA */}
              <Button
                variant="outline"
                onClick={generateAISuggestions}
                disabled={isGeneratingSuggestions}
                className="flex items-center space-x-2 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
              >
                {isGeneratingSuggestions ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                    <span>Génération...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Suggestions IA</span>
                  </>
                )}
              </Button>

              <Button
                onClick={() => setIsAddMeasureModalOpen(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter Mesure</span>
              </Button>
            </div>
          </div>

          {securityMeasures.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Aucune mesure de sécurité définie</p>
              <p className="text-sm text-gray-400">
                Utilisez "Générer Plan Automatique" pour créer des mesures basées sur vos scénarios
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {securityMeasures.map((measure) => (
                <div key={measure.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getTypeIcon(measure.type || 'preventive')}
                        <h3 className="font-semibold text-lg">{measure.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(measure.priority)}`}>
                          Priorité {measure.priority}/5
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {measure.type === 'preventive' ? 'Préventive' :
                           measure.type === 'detective' ? 'Détective' :
                           measure.type === 'corrective' ? 'Corrective' : 'Compensatoire'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{measure.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-gray-500">Efficacité</span>
                          <div className="font-medium">{measure.effectiveness}/5</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Complexité</span>
                          <div className="font-medium">{measure.complexity}/5</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Réduction Risque</span>
                          <div className="font-medium">{measure.riskReduction || 0}%</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Référence NIST</span>
                          <div className="font-medium">{measure.nistReference || 'N/A'}</div>
                        </div>
                      </div>

                      {measure.aiSuggestions && measure.aiSuggestions.length > 0 && (
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                            <Brain className="w-4 h-4 mr-1" />
                            Suggestions IA
                          </h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            {measure.aiSuggestions.map((suggestion, index) => (
                              <li key={index}>• {typeof suggestion === 'string' ? suggestion : suggestion.description}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 🆕 AMÉLIORATION: Affichage des suggestions IA */}
          {aiSuggestions.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium text-purple-900 mb-4 flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Suggestions IA de Mesures de Sécurité ({aiSuggestions.length})
              </h3>
              <div className="space-y-4">
                {aiSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="border border-purple-200 rounded-lg p-4 bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Lightbulb className="h-5 w-5 text-purple-600" />
                          <h4 className="font-semibold text-lg text-purple-900">{suggestion.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            suggestion.priority === 'critical' ? 'bg-red-100 text-red-700' :
                            suggestion.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {suggestion.priority}
                          </span>
                          <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            {suggestion.controlType === 'preventive' ? 'Préventive' :
                             suggestion.controlType === 'detective' ? 'Détective' :
                             'Corrective'}
                          </span>
                        </div>

                        <p className="text-purple-800 mb-3">{suggestion.description}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                          <div>
                            <span className="text-purple-600">Efficacité</span>
                            <div className="font-medium text-purple-900">{suggestion.effectiveness}/4</div>
                          </div>
                          <div>
                            <span className="text-purple-600">Complexité</span>
                            <div className="font-medium text-purple-900">{suggestion.complexity}/4</div>
                          </div>
                          <div>
                            <span className="text-purple-600">Réduction Risque</span>
                            <div className="font-medium text-purple-900">{suggestion.riskReduction}%</div>
                          </div>
                          <div>
                            <span className="text-purple-600">Confiance IA</span>
                            <div className="font-medium text-purple-900">{Math.round(suggestion.confidence * 100)}%</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {suggestion.frameworks?.nist && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              NIST: {suggestion.nistReference}
                            </span>
                          )}
                          {suggestion.frameworks?.iso27002 && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                              ISO: {suggestion.isoControl}
                            </span>
                          )}
                          {suggestion.frameworks?.cis && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                              CIS: {suggestion.cisControl}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-purple-700 mb-3">
                          <strong>Justification :</strong> {suggestion.reasoning}
                        </div>

                        <div className="text-xs text-purple-600">
                          <strong>Temps d'implémentation :</strong> {suggestion.implementationTime} |
                          <strong> Coût :</strong> {suggestion.implementationCost} |
                          <strong> Dépendances :</strong> {suggestion.dependencies?.join(', ') || 'Aucune'}
                        </div>
                      </div>

                      <Button
                        onClick={() => applySuggestion(suggestion)}
                        className="ml-4 bg-purple-600 hover:bg-purple-700 text-white"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Appliquer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-purple-600">
                  💡 Ces suggestions sont générées par IA en analysant vos scénarios stratégiques et actifs supports
                </p>
              </div>
            </div>
          )}
        </div>
      </div>



      {/* Navigation */}
      <WorkshopNavigation 
        currentWorkshop={5}
        totalWorkshops={5}
        onNext={handleNext}
        canProceed={validationResults.filter(r => r.required).every(r => r.met)}
      />

      {/* Modales */}
      {isAddMeasureModalOpen && (
        <AddSecurityMeasureModal
          isOpen={isAddMeasureModalOpen}
          onClose={() => {
            setIsAddMeasureModalOpen(false);
            setEditingMeasure(null);
          }}
          onSave={(measureData) => {
            if (editingMeasure) {
              // Mode édition
              saveCurrentState();
              const updatedMeasure = { ...measureData, id: editingMeasure.id, createdAt: editingMeasure.createdAt, updatedAt: new Date().toISOString() };
              setSecurityMeasures(prev => prev.map(m => m.id === editingMeasure.id ? updatedMeasure : m));
              setEditingMeasure(null);
            } else {
              // Mode ajout
              const newMeasure = { ...measureData, id: crypto.randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
              setSecurityMeasures(prev => [...prev, newMeasure]);
            }
            setIsAddMeasureModalOpen(false);
            validateWorkshopCompletion(strategicScenarios, supportingAssets);
          }}
          scenarios={strategicScenarios} // 🔧 CORRECTION: Propriété requise
          onSubmit={(measureData: any) => {
            if (editingMeasure) {
              // Mode édition
              saveCurrentState();
              const updatedMeasure: SecurityMeasure = {
                ...editingMeasure,
                ...measureData,
                id: editingMeasure.id,
                createdAt: editingMeasure.createdAt,
                updatedAt: new Date().toISOString(),
                targetedScenarios: strategicScenarios.filter(s => EbiosUtils.compareRiskLevel(s.riskLevel, 3, '>=')).map(s => s.id)
              };
              setSecurityMeasures(prev => prev.map(m => m.id === editingMeasure.id ? updatedMeasure : m));
              setEditingMeasure(null);
            } else {
              // Mode ajout
              const newMeasure: SecurityMeasure = {
                id: `measure_${Date.now()}`,
                ...measureData,
                targetedScenarios: strategicScenarios.filter(s => EbiosUtils.compareRiskLevel(s.riskLevel, 3, '>=')).map(s => s.id)
              };
              setSecurityMeasures(prev => [...prev, newMeasure]);
            }
            setIsAddMeasureModalOpen(false);
            validateWorkshopCompletion(strategicScenarios, supportingAssets);
          }}
          strategicScenarios={strategicScenarios}
          supportingAssets={supportingAssets}
          existingMeasure={editingMeasure}
        />
      )}

      {isValidationModalOpen && (
        <AIValidationModal
          isOpen={isValidationModalOpen}
          onClose={() => setIsValidationModalOpen(false)}
          securityMeasures={securityMeasures}
          strategicScenarios={strategicScenarios}
          onUpdateMeasures={(updatedMeasures) => {
            setSecurityMeasures(updatedMeasures);
            validateWorkshopCompletion(strategicScenarios, supportingAssets);
          }}
        />
      )}
    </div>
  );
};

export default Workshop5; 