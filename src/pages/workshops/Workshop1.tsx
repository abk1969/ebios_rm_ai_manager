import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useParams } from 'react-router-dom';
import { RootState } from '../../store';
import { addBusinessValue, setBusinessValues } from '../../store/slices/businessValuesSlice';
import { addSupportingAsset, setSupportingAssets } from '../../store/slices/supportingAssetsSlice';
import { getBusinessValuesByMission, createBusinessValue, updateBusinessValue } from '../../services/firebase/businessValues';
import { getSupportingAssets, getSupportingAssetsByMission, createSupportingAsset, updateSupportingAsset } from '../../services/firebase/supportingAssets';
import { getDreadedEvents, createDreadedEvent, updateDreadedEvent, DreadedEventUtils } from '../../services/firebase/dreadedEvents';
import { getMissionById, updateMission } from '../../services/firebase/missions';
import {
  EBIOS_SCALES,
  WORKSHOP_VALIDATION_CRITERIA,
  EbiosUtils,
  IMPACT_TYPES,
  SUPPORTING_ASSET_TYPES,
  SECURITY_LEVELS
} from '../../lib/ebios-constants';
import { EnhancedSuggestionsService, type EnhancedSuggestion } from '../../services/ai/EnhancedSuggestionsService';
import { ANSSIValidationService } from '../../services/validation/ANSSIValidationService';
import Workshop1Tutorial from '../../components/tutorials/Workshop1Tutorial';
import Button from '../../components/ui/button';
import {
  Database,
  AlertTriangle,
  Server,
  Plus,
  CheckCircle,
  AlertCircle,
  Info,
  Target,
  Shield
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import WorkshopNavigation from '../../components/workshops/WorkshopNavigation';
import AddBusinessValueModal from '../../components/business-values/AddBusinessValueModal';
import AddDreadedEventModal from '../../components/business-values/AddDreadedEventModal';
import AddSupportingAssetModal from '../../components/supporting-assets/AddSupportingAssetModal';
import AICoherenceIndicator from '../../components/ai/AICoherenceIndicator';
import ANSSIValidationReport from '../../components/validation/ANSSIValidationReport';
import StandardWorkshopHeader from '../../components/workshops/StandardWorkshopHeader';
import StandardValidationPanel from '../../components/workshops/StandardValidationPanel';
import WorkshopGuide from '../../components/workshops/WorkshopGuide';
import Workshop1Guide from '../../components/workshops/Workshop1Guide';
import Workshop1Actions from '../../components/workshops/Workshop1Actions';
import AISuggestionsExplainer from '../../components/ai/AISuggestionsExplainer';
import EbiosMethodologyValidator from '../../components/validation/EbiosMethodologyValidator';
import { StandardEbiosValidation } from '../../services/validation/StandardEbiosValidation';
import { ResponsiveContainer, CardsGrid, MetricsGrid } from '../../components/layout/ResponsiveGrid';
import type {
  BusinessValue,
  SupportingAsset,
  DreadedEvent,
  Mission,
  GravityScale,
  WorkshopValidation
} from '../../types/ebios';

const Workshop1 = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  // 🔧 CORRECTION: Support des deux méthodes de récupération du missionId
  const missionId = params.missionId || searchParams.get('missionId');

  // 🔍 DEBUG TEMPORAIRE (en mode développement uniquement)
  if (import.meta.env.DEV) {
    console.log('🔍 Workshop1 DEBUG:', {
      'params': params,
      'params.missionId': params.missionId,
      'searchParams.get(missionId)': searchParams.get('missionId'),
      'missionId final': missionId,
      'URL actuelle': window.location.href
    });
  }
  const dispatch = useDispatch();
  const businessValues = useSelector((state: RootState) => state.businessValues.businessValues);
  const supportingAssets = useSelector((state: RootState) => state.supportingAssets.assets);
  
  // États pour les nouvelles entités EBIOS RM
  const [dreadedEvents, setDreadedEvents] = useState<DreadedEvent[]>([]);
  const [selectedBusinessValueId, setSelectedBusinessValueId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  // États pour les modales
  const [isAddValueModalOpen, setIsAddValueModalOpen] = useState(false);
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  // États pour la gestion des modifications
  const [editingBusinessValue, setEditingBusinessValue] = useState<BusinessValue | null>(null);
  const [editingSupportingAsset, setEditingSupportingAsset] = useState<SupportingAsset | null>(null);
  const [editingDreadedEvent, setEditingDreadedEvent] = useState<DreadedEvent | null>(null);
  const [previousState, setPreviousState] = useState<{
    businessValues: BusinessValue[];
    supportingAssets: SupportingAsset[];
    dreadedEvents: DreadedEvent[];
    timestamp: string;
  } | null>(null);
  
  // États généraux
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mission, setMission] = useState<Mission | null>(null);
  const [validationResults, setValidationResults] = useState<WorkshopValidation[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  // 🆕 États pour les suggestions IA améliorées
  const [enhancedSuggestions, setEnhancedSuggestions] = useState<EnhancedSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<EnhancedSuggestion | null>(null);

  // 🆕 État pour le tutoriel guidé
  const [showTutorial, setShowTutorial] = useState(false);

  // 🆕 État pour la validation ANSSI stricte
  const [anssiValidation, setAnssiValidation] = useState<any>(null);
  const [showAnssiReport, setShowAnssiReport] = useState(false);
  const [standardValidation, setStandardValidation] = useState<any>(null);

  if (!missionId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">ID de mission requis</h3>
          <p className="text-gray-500 mb-6">Sélectionnez d'abord une mission pour accéder à l'Atelier 1</p>
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
        const [missionData, values, assets, events] = await Promise.all([
          getMissionById(missionId),
          getBusinessValuesByMission(missionId),
          getSupportingAssetsByMission(missionId),
          getDreadedEvents(missionId)
        ]);
        
        if (missionData) {
          setMission(missionData);
          dispatch(setBusinessValues(values));
          dispatch(setSupportingAssets(assets));
          setDreadedEvents(events);
          validateWorkshopCompletion(values, assets, events);
        } else {
          setError('Mission non trouvée');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError('Échec du chargement des données de l\'atelier');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [missionId, dispatch]);

  // 🆕 AMÉLIORATION: Détection des nouveaux utilisateurs pour le tutoriel
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('workshop1-tutorial-completed');
    const isFirstVisit = businessValues.length === 0 && dreadedEvents.length === 0 && supportingAssets.length === 0;

    if (!tutorialCompleted && isFirstVisit && !loading) {
      // Attendre un peu pour que l'interface soit chargée
      setTimeout(() => {
        setShowTutorial(true);
      }, 1000);
    }
  }, [businessValues, dreadedEvents, supportingAssets, loading]);

  // Validation selon critères EBIOS RM Atelier 1
  const validateWorkshopCompletion = (
    values: BusinessValue[], 
    assets: SupportingAsset[], 
    events: DreadedEvent[]
  ) => {
    const criteria = WORKSHOP_VALIDATION_CRITERIA[1];
    const results: WorkshopValidation[] = criteria.map(criterion => {
      let met = false;
      let evidence = '';

      switch (criterion.criterion) {
        case 'Valeurs métier identifiées':
          met = values.length >= 1;
          evidence = `${values.length} valeur(s) métier identifiée(s)`;
          break;
        case 'Actifs supports cartographiés':
          // 🔧 CORRECTION: Validation durcie selon ANSSI
          const coveredValues = values.filter(v => assets.some(a => a.businessValueId === v.id)).length;
          const coverageRate = values.length > 0 ? (coveredValues / values.length) * 100 : 0;
          met = assets.length >= 1 && coverageRate >= 50; // Au moins 50% des valeurs métier doivent avoir des actifs
          evidence = assets.length > 0 ?
            `${assets.length} actif(s) support - ${Math.round(coverageRate)}% valeurs couvertes` :
            'Aucun actif support identifié - Requis pour continuer';
          break;
        case 'Événements redoutés définis':
          // 🔧 CORRECTION: Validation durcie selon ANSSI
          const coveredByEvents = values.filter(v => events.some(e => e.businessValueId === v.id)).length;
          const eventCoverageRate = values.length > 0 ? (coveredByEvents / values.length) * 100 : 0;
          met = events.length >= 1 && eventCoverageRate >= 30; // Au moins 30% des valeurs métier doivent avoir des événements redoutés
          evidence = events.length > 0 ?
            `${events.length} événement(s) redouté(s) - ${Math.round(eventCoverageRate)}% valeurs couvertes` :
            'Aucun événement redouté défini - Requis selon EBIOS RM';
          break;
        case 'Socle de sécurité évalué':
          // 🔧 CORRECTION: Validation durcie selon ANSSI
          const classifiedAssets = assets.filter(a => a.securityLevel).length;
          const classificationRate = assets.length > 0 ? (classifiedAssets / assets.length) * 100 : 0;
          met = assets.length > 0 && classificationRate >= 70; // Au moins 70% des actifs doivent être classifiés
          evidence = assets.length > 0 ?
            `${Math.round(classificationRate)}% actifs classifiés (${classifiedAssets}/${assets.length})` :
            'Aucun actif à évaluer - Créer d\'abord des actifs supports';
          break;
        case 'Parties prenantes identifiées':
          // 🔧 CORRECTION: Validation assouplie pour faciliter l'utilisation
          const valuesWithStakeholders = values.filter(v => v.stakeholders && v.stakeholders.length > 0).length;
          const stakeholderRate = values.length > 0 ? (valuesWithStakeholders / values.length) * 100 : 0;
          // 🔧 ASSOUPLISSEMENT: Critère optionnel si au moins une valeur métier existe
          met = values.length > 0; // Simplement avoir des valeurs métier suffit
          evidence = valuesWithStakeholders > 0 ?
            `${Math.round(stakeholderRate)}% valeurs avec parties prenantes (${valuesWithStakeholders}/${values.length})` :
            `${values.length} valeur(s) métier - Parties prenantes optionnelles`;
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

    // 🆕 AMÉLIORATION: Validation ANSSI stricte
    const anssiResult = ANSSIValidationService.validateWorkshop1(values, events, assets);
    setAnssiValidation(anssiResult);

    // 🆕 AMÉLIORATION: Validation standardisée
    const standardResult = StandardEbiosValidation.validateWorkshop1(values, assets, events);
    setStandardValidation(standardResult);
  };

  // Fonction pour sauvegarder l'état actuel avant modification
  const saveCurrentState = () => {
    setPreviousState({
      businessValues: [...businessValues],
      supportingAssets: [...supportingAssets],
      dreadedEvents: [...dreadedEvents],
      timestamp: new Date().toISOString()
    });
  };

  // Fonctions de gestion des actions
  const handleEditBusinessValue = (value: BusinessValue) => {
    setEditingBusinessValue(value);
    setIsAddValueModalOpen(true);
  };

  const handleDeleteBusinessValue = async (valueId: string) => {
    try {
      saveCurrentState();
      // TODO: Implémenter la suppression Firebase
      // await deleteBusinessValue(valueId);

      // Mise à jour locale pour l'instant
      const updatedValues = businessValues.filter(v => v.id !== valueId);
      dispatch(setBusinessValues(updatedValues));

      // Supprimer aussi les actifs et événements associés
      const updatedAssets = supportingAssets.filter(a => a.businessValueId !== valueId);
      const updatedEvents = dreadedEvents.filter(e => e.businessValueId !== valueId);

      dispatch(setSupportingAssets(updatedAssets));
      setDreadedEvents(updatedEvents);

      validateWorkshopCompletion(updatedValues, updatedAssets, updatedEvents);
      setError('✅ Valeur métier supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression de la valeur métier');
    }
  };

  const handleEditSupportingAsset = (asset: SupportingAsset) => {
    setEditingSupportingAsset(asset);
    setSelectedBusinessValueId(asset.businessValueId);
    setIsAddAssetModalOpen(true);
  };

  const handleDeleteSupportingAsset = async (assetId: string) => {
    try {
      saveCurrentState();
      // TODO: Implémenter la suppression Firebase
      // await deleteSupportingAsset(assetId);

      // Mise à jour locale pour l'instant
      const updatedAssets = supportingAssets.filter(a => a.id !== assetId);
      dispatch(setSupportingAssets(updatedAssets));

      validateWorkshopCompletion(businessValues, updatedAssets, dreadedEvents);
      setError('✅ Actif support supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression de l\'actif support');
    }
  };

  const handleEditDreadedEvent = (event: DreadedEvent) => {
    setEditingDreadedEvent(event);
    setSelectedBusinessValueId(event.businessValueId);
    setIsAddEventModalOpen(true);
  };

  const handleDeleteDreadedEvent = async (eventId: string) => {
    try {
      saveCurrentState();
      // TODO: Implémenter la suppression Firebase
      // await deleteDreadedEvent(eventId);

      // Mise à jour locale pour l'instant
      const updatedEvents = dreadedEvents.filter(e => e.id !== eventId);
      setDreadedEvents(updatedEvents);

      validateWorkshopCompletion(businessValues, supportingAssets, updatedEvents);
      setError('✅ Événement redouté supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression de l\'événement redouté');
    }
  };

  const handleResetWorkshop = async () => {
    try {
      saveCurrentState();
      // TODO: Implémenter la suppression Firebase complète

      // Réinitialisation locale pour l'instant
      dispatch(setBusinessValues([]));
      dispatch(setSupportingAssets([]));
      setDreadedEvents([]);

      validateWorkshopCompletion([], [], []);
      setError('✅ Workshop 1 réinitialisé avec succès');
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      setError('Erreur lors de la réinitialisation du workshop');
    }
  };

  const handleRestorePrevious = () => {
    if (previousState) {
      dispatch(setBusinessValues(previousState.businessValues));
      dispatch(setSupportingAssets(previousState.supportingAssets));
      setDreadedEvents(previousState.dreadedEvents);
      setPreviousState(null);

      validateWorkshopCompletion(
        previousState.businessValues,
        previousState.supportingAssets,
        previousState.dreadedEvents
      );
      setError('✅ État précédent restauré avec succès');
    }
  };

  const handleCreateBusinessValue = async (data: Partial<BusinessValue>) => {
    try {
      if (editingBusinessValue) {
        // Mode édition
        saveCurrentState();
        const updatedValue = {
          ...editingBusinessValue,
          ...data,
          updatedAt: new Date().toISOString()
        };

        // Mise à jour Firebase
        await updateBusinessValue(editingBusinessValue.id, updatedValue);

        // Mise à jour locale
        const updatedValues = businessValues.map(v =>
          v.id === editingBusinessValue.id ? updatedValue : v
        );
        dispatch(setBusinessValues(updatedValues));
        setEditingBusinessValue(null);
        setError('✅ Valeur métier modifiée avec succès');
      } else {
        // Mode création
        const newValue = await createBusinessValue({
          name: data.name || '',
          description: data.description || '',
          category: data.category || 'primary',
          priority: data.priority || 2,
          criticalityLevel: data.criticalityLevel || 'important',
          missionId,
          dreadedEvents: [],
          supportingAssets: [],
          stakeholders: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        dispatch(addBusinessValue(newValue));
      }

      setIsAddValueModalOpen(false);

      // 🆕 AMÉLIORATION: Suggestions enrichies avec référentiels
      const enhancedEventSuggestions = EnhancedSuggestionsService.generateEnhancedDreadedEvents(
        newValue,
        dreadedEvents
      );

      const enhancedAssetSuggestions = EnhancedSuggestionsService.generateEnhancedSupportingAssets(
        newValue,
        supportingAssets
      );

      const allSuggestions = [...enhancedEventSuggestions, ...enhancedAssetSuggestions];

      if (allSuggestions.length > 0) {
        setEnhancedSuggestions(allSuggestions);
        setSelectedBusinessValueId(newValue.id);
        setShowSuggestions(true);
        setError(`💡 ${allSuggestions.length} suggestions enrichies disponibles pour "${newValue.name}" (ISO 27002, NIST, CIS)`);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la valeur métier:', error);
      setError('Échec de la création de la valeur métier');
    }
  };

  const handleCreateDreadedEvent = async (data: {
    name: string;
    description: string;
    impactedBusinessValues: string[];
    impactedSupportingAssets: string[];
    gravity: GravityScale;
    impactType?: 'availability' | 'integrity' | 'confidentiality' | 'authenticity' | 'non_repudiation';
    impactDescription: string;
    consequencesDescription: string;
  }) => {
    try {
      if (editingDreadedEvent) {
        // Mode édition
        saveCurrentState();
        const updatedEvent = {
          ...editingDreadedEvent,
          name: data.name,
          description: data.description,
          gravity: data.gravity,
          impactType: data.impactType || editingDreadedEvent.impactType,
          consequences: data.consequencesDescription,
          updatedAt: new Date().toISOString()
        };

        // Mise à jour Firebase
        await updateDreadedEvent(editingDreadedEvent.id, updatedEvent);

        // Mise à jour locale
        const updatedEvents = dreadedEvents.map(e =>
          e.id === editingDreadedEvent.id ? updatedEvent : e
        );
        setDreadedEvents(updatedEvents);
        setEditingDreadedEvent(null);
        setError('✅ Événement redouté modifié avec succès');
      } else {
        // Mode création
        // 🔧 CORRECTION BUG: Déterminer l'impact type dynamiquement
        const determineImpactType = (name: string, description: string): 'availability' | 'integrity' | 'confidentiality' | 'authenticity' | 'non_repudiation' => {
          const text = `${name} ${description}`.toLowerCase();

          if (text.includes('indisponib') || text.includes('panne') || text.includes('arrêt')) {
            return 'availability';
          }
          if (text.includes('modifi') || text.includes('altér') || text.includes('corrupt')) {
            return 'integrity';
          }
          if (text.includes('vol') || text.includes('fuite') || text.includes('divulg')) {
            return 'confidentiality';
          }
          if (text.includes('usurp') || text.includes('authentif') || text.includes('identit')) {
            return 'authenticity';
          }
          if (text.includes('répudi') || text.includes('nier') || text.includes('preuve')) {
            return 'non_repudiation';
          }

          // Par défaut, confidentialité pour les données sensibles
          return 'confidentiality';
        };

        // Créer un événement redouté pour chaque valeur métier impactée
        for (const businessValueId of data.impactedBusinessValues) {
          const dynamicImpactType = data.impactType || determineImpactType(data.name, data.description);

          await createDreadedEvent({
            name: data.name,
            description: data.description,
            businessValueId,
            missionId,
            gravity: data.gravity,
            impactType: dynamicImpactType, // 🔧 CORRECTION: Impact type dynamique
            consequences: data.consequencesDescription,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }

        // Recharger les événements redoutés
        const events = await getDreadedEvents(missionId);
        setDreadedEvents(events);
      }

      setIsAddEventModalOpen(false);
      setSelectedBusinessValueId(null);
    } catch (error) {
      console.error('Erreur lors de la création/modification de l\'événement redouté:', error);
      setError(editingDreadedEvent ? 'Échec de la modification de l\'événement redouté' : 'Échec de la création de l\'événement redouté');
    }
  };

  const handleCreateSupportingAsset = async (data: Partial<SupportingAsset>) => {
    if (!selectedBusinessValueId && !editingSupportingAsset) return;

    // 🔧 CORRECTION: Suppression des console.log de production
    const isDevelopment = import.meta.env.DEV;

    try {
      if (editingSupportingAsset) {
        // Mode édition
        saveCurrentState();
        const updatedAsset = {
          ...editingSupportingAsset,
          ...data,
          updatedAt: new Date().toISOString()
        };

        // Mise à jour Firebase
        await updateSupportingAsset(editingSupportingAsset.id, updatedAsset);

        // Mise à jour locale
        const updatedAssets = supportingAssets.map(a =>
          a.id === editingSupportingAsset.id ? updatedAsset : a
        );
        dispatch(setSupportingAssets(updatedAssets));
        setEditingSupportingAsset(null);
        setError('✅ Actif support modifié avec succès');
      } else {
        // Mode création
        const newAsset = await createSupportingAsset({
          name: data.name || '',
          type: data.type || 'software',
          description: data.description || '',
          securityLevel: data.securityLevel || 'internal',
          businessValueId: selectedBusinessValueId!,
          missionId: missionId,
          vulnerabilities: [],
          dependsOn: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        if (isDevelopment) {
          console.log('✅ Workshop1 - Actif support créé:', newAsset);
        }

        dispatch(addSupportingAsset(newAsset));
        setError('✅ Actif support créé avec succès !');
      }

      setIsAddAssetModalOpen(false);
      setSelectedBusinessValueId(null);

      // 🔧 AMÉLIORATION: Gestion d'erreur avec retry
      await retryOperation(async () => {
        const updatedAssets = await getSupportingAssetsByMission(missionId);
        dispatch(setSupportingAssets(updatedAssets));
        if (isDevelopment) {
          console.log('🔄 Workshop1 - Actifs supports rechargés:', updatedAssets.length);
        }
      }, 3);

    } catch (error) {
      if (isDevelopment) {
        console.error('❌ Workshop1 - Erreur lors de la création de l\'actif support:', error);
      }
      setError('Échec de la création de l\'actif support. Veuillez réessayer.');
    }
  };

  // 🆕 AMÉLIORATION: Fonction de retry pour les opérations Firebase
  const retryOperation = async (operation: () => Promise<void>, maxRetries: number = 3): Promise<void> => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await operation();
        return; // Succès
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries) {
          // Attendre avant de réessayer (backoff exponentiel)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError; // Échec après tous les essais
  };

  const handleNext = async () => {
    const requiredCriteria = validationResults.filter(r => r.required);
    const unmetRequiredCriteria = requiredCriteria.filter(r => !r.met);
    
    if (unmetRequiredCriteria.length > 0) {
      setError(`Critères requis non satisfaits : ${unmetRequiredCriteria.map(c => c.criterion).join(', ')}`);
      return false;
    }

    try {
      // Marquer l'atelier 1 comme complété
      if (mission) {
        await updateMission(mission.id, {
          ...mission,
          ebiosCompliance: {
            ...mission.ebiosCompliance,
            completionPercentage: 20 // 20% après atelier 1
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

  const getGravityColor = (gravity: GravityScale) => {
    switch (gravity) {
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
      {/* 🎨 EN-TÊTE STANDARDISÉ */}
      <StandardWorkshopHeader
        workshopNumber={1}
        title="Atelier 1 : Cadrage et Socle de Sécurité"
        description="Définir le périmètre d'analyse, identifier les valeurs métier et évaluer la base de sécurité selon EBIOS RM v1.5"
        missionId={missionId}
        data={{
          businessValues,
          supportingAssets,
          dreadedEvents
        }}
        showHelp={showHelp}
        onToggleHelp={() => setShowHelp(!showHelp)}
        helpContent={
          <>
            <h3 className="font-medium text-gray-900 mb-2">Objectifs de l'Atelier 1 (ANSSI) :</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              <li><strong>Valeurs métier :</strong> Identifier ce qui a de la valeur pour l'organisation</li>
              <li><strong>Actifs supports :</strong> Cartographier les éléments qui supportent les valeurs métier</li>
              <li><strong>Événements redoutés :</strong> Définir ce que l'on craint qu'il arrive aux valeurs métier</li>
              <li><strong>Socle de sécurité :</strong> Évaluer les mesures de sécurité existantes</li>
              <li><strong>Parties prenantes :</strong> Identifier les acteurs du périmètre d'analyse</li>
            </ul>
          </>
        }
      />

      {/* 📊 PANNEAU DE VALIDATION STANDARDISÉ */}
      {standardValidation && (
        <StandardValidationPanel
          workshopNumber={1}
          validationResults={standardValidation.validationResults}
        />
      )}

      {/* 📋 GUIDE UTILISATEUR AMÉLIORÉ */}
      <Workshop1Guide
        businessValues={businessValues}
        dreadedEvents={dreadedEvents}
        supportingAssets={supportingAssets}
        onAddBusinessValue={() => setIsAddValueModalOpen(true)}
        onAddDreadedEvent={(businessValueId) => {
          setSelectedBusinessValueId(businessValueId);
          setIsAddEventModalOpen(true);
        }}
        onAddSupportingAsset={(businessValueId) => {
          setSelectedBusinessValueId(businessValueId);
          setIsAddAssetModalOpen(true);
        }}
      />

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

      {/* 🔧 NOUVEAU LAYOUT: Structure en sections verticales pour meilleure lisibilité */}
      <div className="space-y-8">

        {/* Section Valeurs Métier - Layout amélioré */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Valeurs Métier</h2>
                  <p className="text-sm text-gray-600">Identifiez ce qui a de la valeur pour votre organisation</p>
                </div>
              </div>
              <Button
                onClick={() => setIsAddValueModalOpen(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter une valeur</span>
              </Button>
            </div>
          </div>

          <div className="p-6">
            {businessValues.length === 0 ? (
              <div className="text-center py-12">
                <Database className="mx-auto h-16 w-16 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune valeur métier définie</h3>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                  Commencez par identifier les valeurs métier de votre organisation.
                  Ces éléments représentent ce qui est important pour votre activité.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setIsAddValueModalOpen(true)} size="lg">
                    <Plus className="h-5 w-5 mr-2" />
                    Ajouter votre première valeur métier
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {businessValues.map((value) => (
                  <div key={value.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{value.name}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{value.description}</p>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBusinessValueId(value.id);
                            setIsAddEventModalOpen(true);
                          }}
                          className="p-1"
                          title="Ajouter un événement redouté"
                        >
                          <Target className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBusinessValueId(value.id);
                            setIsAddAssetModalOpen(true);
                          }}
                          className="p-1"
                          title="Ajouter un actif support"
                        >
                          <Server className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Catégorie:</span>
                        <span className="text-xs font-medium text-gray-700">{value.category}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Priorité:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGravityColor(value.priority)}`}>
                          {EbiosUtils.formatScaleLabel('gravity', value.priority)}
                        </span>
                      </div>
                    </div>

                    {/* Compteurs d'éléments associés */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center space-x-1">
                            <Target className="h-3 w-3 text-red-500" />
                            <span>{dreadedEvents.filter(e => e.businessValueId === value.id).length} ER</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Server className="h-3 w-3 text-green-500" />
                            <span>{supportingAssets.filter(a => a.businessValueId === value.id).length} AS</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section Événements Redoutés - Layout amélioré */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-red-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Événements Redoutés</h2>
                  <p className="text-sm text-gray-600">Ce que vous craignez qu'il arrive à vos valeurs métier</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {dreadedEvents.length} événement{dreadedEvents.length !== 1 ? 's' : ''} défini{dreadedEvents.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          <div className="p-6">
            {dreadedEvents.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="mx-auto h-16 w-16 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun événement redouté défini</h3>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                  Les événements redoutés représentent ce que vous craignez qu'il arrive à vos valeurs métier.
                  Ils sont créés depuis les valeurs métier.
                </p>
                <div className="mt-6">
                  <p className="text-sm text-gray-500">
                    💡 Astuce : Cliquez sur le bouton <Target className="inline h-4 w-4 mx-1" /> à côté d'une valeur métier pour ajouter un événement redouté
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Groupement par valeur métier */}
                {businessValues.map((value) => {
                  const relatedEvents = dreadedEvents.filter(e => e.businessValueId === value.id);
                  if (relatedEvents.length === 0) return null;

                  return (
                    <div key={value.id} className="border border-gray-200 rounded-lg">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-medium text-gray-900 flex items-center">
                          <Database className="h-4 w-4 text-blue-500 mr-2" />
                          {value.name}
                        </h3>
                      </div>
                      <div className="p-4 space-y-3">
                        {relatedEvents.map((event) => (
                          <div key={event.id} className="flex items-start space-x-3 p-3 bg-red-25 rounded-lg border border-red-100">
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900">{event.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-xs text-gray-500">
                                  Impact: <span className="font-medium">{IMPACT_TYPES[event.impactType]}</span>
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGravityColor(event.gravity)}`}>
                                  Gravité: {EbiosUtils.formatScaleLabel('gravity', event.gravity)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Section Actifs Supports - Layout amélioré */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Server className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Actifs Supports</h2>
                  <p className="text-sm text-gray-600">Éléments qui supportent et permettent vos valeurs métier</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {supportingAssets.length} actif{supportingAssets.length !== 1 ? 's' : ''} identifié{supportingAssets.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          <div className="p-6">
            {supportingAssets.length === 0 ? (
              <div className="text-center py-12">
                <Server className="mx-auto h-16 w-16 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun actif support défini</h3>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                  Les actifs supports sont les éléments techniques, organisationnels ou humains
                  qui permettent de réaliser vos valeurs métier.
                </p>
                <div className="mt-6">
                  <p className="text-sm text-gray-500">
                    💡 Astuce : Cliquez sur le bouton <Server className="inline h-4 w-4 mx-1" /> à côté d'une valeur métier pour ajouter un actif support
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Groupement par valeur métier */}
                {businessValues.map((value) => {
                  const relatedAssets = supportingAssets.filter(a => a.businessValueId === value.id);
                  if (relatedAssets.length === 0) return null;

                  return (
                    <div key={value.id} className="border border-gray-200 rounded-lg">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h3 className="font-medium text-gray-900 flex items-center">
                          <Database className="h-4 w-4 text-blue-500 mr-2" />
                          {value.name}
                        </h3>
                      </div>
                      <div className="p-4">
                        <div className="grid gap-3 md:grid-cols-2">
                          {relatedAssets.map((asset) => (
                            <div key={asset.id} className="flex items-start space-x-3 p-3 bg-green-25 rounded-lg border border-green-100">
                              <Server className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900">{asset.name}</h4>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{asset.description}</p>
                                <div className="flex items-center space-x-3 mt-2">
                                  <span className="text-xs text-gray-500">
                                    Type: <span className="font-medium">{SUPPORTING_ASSET_TYPES[asset.type]}</span>
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Classification: <span className="font-medium">{SECURITY_LEVELS[asset.securityLevel]}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 🆕 ACTIONS DE GESTION: Modification, suppression, réinitialisation */}
        <Workshop1Actions
          businessValues={businessValues}
          supportingAssets={supportingAssets}
          dreadedEvents={dreadedEvents}
          onEditBusinessValue={handleEditBusinessValue}
          onDeleteBusinessValue={handleDeleteBusinessValue}
          onEditSupportingAsset={handleEditSupportingAsset}
          onDeleteSupportingAsset={handleDeleteSupportingAsset}
          onEditDreadedEvent={handleEditDreadedEvent}
          onDeleteDreadedEvent={handleDeleteDreadedEvent}
          onResetWorkshop={handleResetWorkshop}
          onRestorePrevious={handleRestorePrevious}
          hasPreviousState={previousState !== null}
        />

        {/* 📊 Résumé et Métriques */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Résumé de l'Atelier 1</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{businessValues.length}</div>
                <div className="text-sm text-gray-600">Valeur{businessValues.length !== 1 ? 's' : ''} Métier</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">{dreadedEvents.length}</div>
                <div className="text-sm text-gray-600">Événement{dreadedEvents.length !== 1 ? 's' : ''} Redouté{dreadedEvents.length !== 1 ? 's' : ''}</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Server className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{supportingAssets.length}</div>
                <div className="text-sm text-gray-600">Actif{supportingAssets.length !== 1 ? 's' : ''} Support{supportingAssets.length !== 1 ? 's' : ''}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔍 Validation Méthodologique EBIOS RM */}
        <EbiosMethodologyValidator
          businessValues={businessValues}
          dreadedEvents={dreadedEvents}
          supportingAssets={supportingAssets}
          workshopNumber={1}
        />
      </div>

      {/* 🆕 AMÉLIORATION: Suggestions IA clarifiées et expliquées */}
      {showSuggestions && enhancedSuggestions.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  🧠 Suggestions IA pour votre Workshop
                </h3>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <AISuggestionsExplainer
                suggestions={enhancedSuggestions}
                type={selectedSuggestion?.type || 'dreadedEvent'}
                onApplySuggestion={(suggestion) => {
                  // Logique pour appliquer la suggestion
                  if (suggestion.type === 'dreadedEvent') {
                    setIsAddEventModalOpen(true);
                  } else if (suggestion.type === 'supportingAsset') {
                    setIsAddAssetModalOpen(true);
                  }
                  setShowSuggestions(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modales pour l'ajout/édition des entités EBIOS RM */}
      <AddBusinessValueModal
        isOpen={isAddValueModalOpen}
        onClose={() => {
          setIsAddValueModalOpen(false);
          setEditingBusinessValue(null);
        }}
        onSubmit={handleCreateBusinessValue}
        missionId={missionId}
        initialData={editingBusinessValue}
      />

      <AddDreadedEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => {
          setIsAddEventModalOpen(false);
          setSelectedBusinessValueId(null);
          setEditingDreadedEvent(null);
        }}
        onSubmit={handleCreateDreadedEvent}
        missionId={missionId}
        businessValues={businessValues}
        supportingAssets={supportingAssets}
        initialData={editingDreadedEvent}
      />

      {(selectedBusinessValueId || editingSupportingAsset) && (
        <AddSupportingAssetModal
          isOpen={isAddAssetModalOpen}
          onClose={() => {
            setIsAddAssetModalOpen(false);
            setSelectedBusinessValueId(null);
            setEditingSupportingAsset(null);
          }}
          onSubmit={handleCreateSupportingAsset}
          businessValueId={selectedBusinessValueId || editingSupportingAsset?.businessValueId || ''}
          initialData={editingSupportingAsset}
        />
      )}

      <WorkshopNavigation
        currentWorkshop={1}
        totalWorkshops={5}
        onNext={handleNext}
      />

      {/* 🆕 AMÉLIORATION: Tutoriel guidé pour nouveaux utilisateurs */}
      <Workshop1Tutorial
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onStepComplete={(stepId) => {
          // Optionnel : tracker les étapes complétées
          if (import.meta.env.DEV) {
            console.log(`Étape tutoriel complétée: ${stepId}`);
          }
        }}
      />

      {/* 🆕 AMÉLIORATION: Rapport de validation ANSSI */}
      {showAnssiReport && anssiValidation && (
        <ANSSIValidationReport
          validation={anssiValidation}
          workshop={1}
          onClose={() => setShowAnssiReport(false)}
          missionData={mission ? {
            id: mission.id,
            name: mission.name,
            description: mission.description || ''
          } : undefined}
          workshopData={{
            businessValues,
            supportingAssets,
            dreadedEvents
          }}
          onExport={() => {
            if (import.meta.env.DEV) {
              console.log('Export personnalisé du rapport ANSSI');
            }
          }}
        />
      )}
    </div>
  );
};

export default Workshop1;