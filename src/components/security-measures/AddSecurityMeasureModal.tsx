import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import Button from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { CalendarIcon, Lightbulb, CheckCircle, AlertTriangle, Users, Target, Clock, Shield, Zap, X } from 'lucide-react';
import { format } from 'date-fns';
import { EbiosUtils } from '../../lib/ebios-constants';
import { GravityScale } from '../../types/ebios';
import { fr } from 'date-fns/locale';
import type { SecurityMeasure, StrategicScenario } from '../../types/ebios';

interface AddSecurityMeasureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (measure: Omit<SecurityMeasure, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onSubmit?: (measureData: any) => void; // 🔧 CORRECTION: Propriété manquante
  scenarios: StrategicScenario[];
  strategicScenarios?: StrategicScenario[]; // 🔧 CORRECTION: Alias pour scenarios
  supportingAssets?: any[]; // 🔧 CORRECTION: Propriété manquante
  existingMeasure?: SecurityMeasure | null;
}

const MEASURE_TYPES = [
  { value: 'preventive', label: 'Préventive', icon: Shield },
  { value: 'detective', label: 'Détective', icon: Target },
  { value: 'corrective', label: 'Corrective', icon: Zap },
  { value: 'compensating', label: 'Compensatoire', icon: CheckCircle }
];

const IMPLEMENTATION_COMPLEXITY = [
  { value: 1, label: 'Faible', description: 'Simple à mettre en œuvre' },
  { value: 2, label: 'Modérée', description: 'Effort modéré requis' },
  { value: 3, label: 'Élevée', description: 'Mise en œuvre complexe' },
  { value: 4, label: 'Très élevée', description: 'Transformation majeure' }
];

const NIST_FAMILIES = [
  'AC - Contrôle d\'accès',
  'AU - Audit et responsabilité',
  'AT - Sensibilisation et formation',
  'CM - Gestion de configuration',
  'CP - Planification d\'urgence',
  'IA - Identification et authentification',
  'IR - Réponse aux incidents',
  'MA - Maintenance',
  'MP - Protection des médias',
  'PS - Protection du personnel',
  'PE - Protection physique et environnementale',
  'PL - Planification',
  'PM - Gestion du programme',
  'RA - Évaluation des risques',
  'CA - Évaluation de sécurité et autorisation',
  'SC - Protection du système et des communications',
  'SI - Intégrité du système et de l\'information',
  'SA - Acquisition du système et des services'
];

export default function AddSecurityMeasureModal({
  isOpen,
  onClose,
  onSave,
  onSubmit, // 🔧 CORRECTION: Nouvelle propriété
  scenarios,
  strategicScenarios, // 🔧 CORRECTION: Alias
  supportingAssets, // 🔧 CORRECTION: Nouvelle propriété
  existingMeasure
}: AddSecurityMeasureModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'preventive' as SecurityMeasure['type'],
    category: '',
    nistFamily: '',
    priority: 2,
    effectiveness: 3,
    implementationCost: 2,
    implementationComplexity: 2,
    implementationTimeframe: '',
    responsibleParty: '',
    dueDate: '',
    status: 'planned' as SecurityMeasure['status'],
    targetedScenarios: [] as string[],
    implementationNotes: '',
    validationCriteria: '',
    dependencies: [] as string[],
    riskReduction: 0,
    monitoringMethod: ''
  });

  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingMeasure) {
      setFormData({
        name: existingMeasure.name || '',
        description: existingMeasure.description || '',
        type: existingMeasure.type || 'preventive',
        category: existingMeasure.category || '',
        nistFamily: existingMeasure.nistFamily || '',
        priority: existingMeasure.priority || 2,
        effectiveness: existingMeasure.effectiveness || 3,
        implementationCost: typeof existingMeasure.implementationCost === 'string' ?
          (existingMeasure.implementationCost === 'low' ? 1 :
           existingMeasure.implementationCost === 'medium' ? 2 :
           existingMeasure.implementationCost === 'high' ? 3 : 4) : 2,
        implementationComplexity: existingMeasure.implementationComplexity || 2,
        implementationTimeframe: existingMeasure.implementationTimeframe || '',
        responsibleParty: existingMeasure.responsibleParty || '',
        dueDate: existingMeasure.dueDate || '',
        status: existingMeasure.status || 'planned',
        targetedScenarios: existingMeasure.targetedScenarios || [],
        implementationNotes: existingMeasure.implementationNotes || '',
        validationCriteria: existingMeasure.validationCriteria || '',
        dependencies: existingMeasure.dependencies || [],
        riskReduction: existingMeasure.riskReduction || 0,
        monitoringMethod: existingMeasure.monitoringMethod || ''
      });
      if (existingMeasure.dueDate) {
        setSelectedDate(new Date(existingMeasure.dueDate));
      }
    } else {
      // Mode création - générer des suggestions IA automatiquement
      generateAiSuggestions();
    }
  }, [existingMeasure, isOpen]);

  const generateAiSuggestions = () => {
    const scenariosToUse = scenarios || strategicScenarios || [];
    if (scenariosToUse.length === 0) return;

    // Analyse des scénarios pour générer des suggestions intelligentes
    const highRiskScenarios = scenariosToUse.filter(s => EbiosUtils.compareRiskLevel(s.riskLevel, 3, '>='));
    const attackTypes = scenariosToUse.flatMap(s => s.attackPaths?.map(ap => ap.name) || []);
    const affectedAssets = scenariosToUse.flatMap(s => s.supportingAssets || []);

    const suggestions = {
      preventiveMeasures: [
        {
          name: 'Authentification Multi-Facteurs (MFA)',
          description: 'Mise en place d\'une authentification à deux facteurs pour tous les accès critiques',
          type: 'preventive',
          nistFamily: 'IA - Identification et authentification',
          effectiveness: 4,
          implementationCost: 2,
          targetedThreats: ['Compromission d\'identifiants', 'Accès non autorisé'],
          rationale: 'Réduit significativement les risques de compromission d\'accès même en cas de vol d\'identifiants'
        },
        {
          name: 'Segmentation Réseau',
          description: 'Isolation des systèmes critiques par segmentation micro-périmétrique',
          type: 'preventive',
          nistFamily: 'SC - Protection du système et des communications',
          effectiveness: 4,
          implementationCost: 3,
          targetedThreats: ['Mouvement latéral', 'Propagation d\'attaque'],
          rationale: 'Limite la portée des attaques en cas de compromission initiale'
        }
      ],
      detectiveMeasures: [
        {
          name: 'SIEM & SOC 24/7',
          description: 'Surveillance continue avec corrélation d\'événements et analyse comportementale',
          type: 'detective',
          nistFamily: 'AU - Audit et responsabilité',
          effectiveness: 3,
          implementationCost: 4,
          targetedThreats: ['Activités anormales', 'Mouvements latéraux'],
          rationale: 'Détection précoce des activités malveillantes pour réduction du temps de réponse'
        }
      ],
      correctiveMeasures: [
        {
          name: 'Plan de Réponse aux Incidents',
          description: 'Procédures formalisées de containment, éradication et récupération',
          type: 'corrective',
          nistFamily: 'IR - Réponse aux incidents',
          effectiveness: 3,
          implementationCost: 2,
          targetedThreats: ['Temps de récupération', 'Impact d\'incident'],
          rationale: 'Minimise l\'impact et accélère la récupération en cas d\'incident de sécurité'
        }
      ],
      priorityGuidance: `Basé sur l'analyse de ${scenariosToUse.length} scénarios dont ${highRiskScenarios.length} à risque élevé, priorisez :
      1. Mesures préventives pour les accès (MFA, PAM)
      2. Détection des mouvements latéraux
      3. Sauvegarde et récupération des données critiques`,
      
      implementationRoadmap: {
        immediate: ['MFA sur comptes privilégiés', 'Sauvegarde critique'],
        shortTerm: ['SIEM basique', 'Formation équipes'],
        mediumTerm: ['Segmentation complète', 'SOC interne'],
        longTerm: ['Zero Trust', 'IA/ML detection']
      }
    };

    setAiSuggestions(suggestions);
    setShowAiSuggestions(true);
  };

  const applySuggestion = (suggestion: any) => {
    setFormData(prev => ({
      ...prev,
      name: suggestion.name,
      description: suggestion.description,
      type: suggestion.type,
      nistFamily: suggestion.nistFamily,
      effectiveness: suggestion.effectiveness,
      implementationCost: suggestion.implementationCost,
      implementationComplexity: suggestion.implementationCost,
      priority: suggestion.effectiveness >= 4 ? 1 : suggestion.effectiveness >= 3 ? 2 : 3
    }));
    setShowAiSuggestions(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la mesure est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.responsibleParty.trim()) {
      newErrors.responsibleParty = 'Un responsable doit être assigné';
    }

    if (formData.targetedScenarios.length === 0) {
      newErrors.targetedScenarios = 'Au moins un scénario cible doit être sélectionné';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // 🔧 CORRECTION: Mapping correct vers SecurityMeasure EBIOS RM
    const measureData: Omit<SecurityMeasure, 'id' | 'createdAt' | 'updatedAt'> = {
      // Propriétés obligatoires EBIOS RM
      name: formData.name,
      description: formData.description,
      missionId: '', // Sera défini par le parent
      controlType: (formData.type || 'preventive') as SecurityMeasure['controlType'],
      status: 'planned',
      priority: formData.priority as GravityScale,
      responsibleParty: '',
      dueDate: selectedDate ? selectedDate.toISOString() : '',
      effectiveness: formData.effectiveness as GravityScale,
      implementationCost: ['low', 'medium', 'high', 'very_high'][Math.max(0, Math.min(3, formData.implementationCost - 1))] as SecurityMeasure['implementationCost'],
      maintenanceCost: 'medium',
      targetScenarios: formData.targetedScenarios || [],
      targetVulnerabilities: [],
      implementation: {
        id: crypto.randomUUID(),
        measureId: '',
        verificationMethod: formData.validationCriteria || '',
        residualRisk: Math.max(1, 4 - formData.effectiveness) as GravityScale,
        comments: formData.implementationNotes || '',
        evidences: []
      },

      // Propriétés étendues
      isoCategory: formData.category,
      isoControl: '',
      type: formData.type,
      nistFamily: formData.nistFamily,
      implementationComplexity: formData.implementationComplexity,
      riskReduction: calculateRiskReduction(),
      implementationNotes: formData.implementationNotes,
      validationCriteria: formData.validationCriteria,
      dependencies: formData.dependencies,
      monitoringMethod: formData.monitoringMethod
    };

    // 🔧 CORRECTION: Support des deux callbacks
    if (onSubmit) {
      onSubmit(measureData);
    } else {
      onSave(measureData);
    }
    onClose();
    resetForm();
  };

  const calculateRiskReduction = () => {
    // Calcul basé sur l'efficacité et le nombre de scénarios ciblés
    const baseReduction = formData.effectiveness * 0.15; // 15% par point d'efficacité
    const scenarioBonus = formData.targetedScenarios.length * 0.05; // 5% par scénario ciblé
    return Math.min(0.8, baseReduction + scenarioBonus); // Max 80% de réduction
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'preventive',
      category: '',
      nistFamily: '',
      priority: 2,
      effectiveness: 3,
      implementationCost: 2,
      implementationComplexity: 2,
      implementationTimeframe: '',
      responsibleParty: '',
      dueDate: '',
      status: 'planned',
      targetedScenarios: [],
      implementationNotes: '',
      validationCriteria: '',
      dependencies: [],
      riskReduction: 0,
      monitoringMethod: ''
    });
    setSelectedDate(undefined);
    setErrors({});
    setShowAiSuggestions(false);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    {existingMeasure ? 'Modifier la Mesure' : 'Nouvelle Mesure de Sécurité'}
                  </Dialog.Title>
                  <p className="text-sm text-gray-600">
                    Définissez une mesure de traitement du risque selon les bonnes pratiques EBIOS RM
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
          {/* Assistant IA */}
          {aiSuggestions && showAiSuggestions && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium text-blue-900">Suggestions IA - Assistant EBIOS RM</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-blue-800 mb-2">Recommandations Prioritaires :</h4>
                  <p className="text-sm text-blue-700 mb-3">{aiSuggestions.priorityGuidance}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[...aiSuggestions.preventiveMeasures, ...aiSuggestions.detectiveMeasures, ...aiSuggestions.correctiveMeasures].map((suggestion, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm text-gray-900">{suggestion.name}</h5>
                        <Badge variant={suggestion.type === 'preventive' ? 'default' : suggestion.type === 'detective' ? 'secondary' : 'destructive'}>
                          {suggestion.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{suggestion.description}</p>
                      <div className="text-xs text-blue-600 mb-2">
                        <strong>Justification :</strong> {suggestion.rationale}
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => applySuggestion(suggestion)}
                        className="w-full"
                      >
                        Appliquer
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom de la mesure *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Authentification multi-facteurs"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="type">Type de mesure</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as SecurityMeasure['type'] }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              >
                <option value="">Sélectionner un type</option>
                {MEASURE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description détaillée *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez la mesure, son fonctionnement et ses objectifs..."
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Référentiel et catégorisation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nistFamily">Famille NIST (optionnel)</Label>
              <select
                id="nistFamily"
                value={formData.nistFamily}
                onChange={(e) => setFormData(prev => ({ ...prev, nistFamily: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              >
                <option value="">Sélectionner une famille NIST</option>
                {NIST_FAMILIES.map((family) => (
                  <option key={family} value={family}>
                    {family}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Ex: Contrôle d'accès, Chiffrement, etc."
              />
            </div>
          </div>

          {/* Évaluation quantitative */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="priority">Priorité (1-4)</Label>
              <select
                id="priority"
                value={formData.priority.toString()}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              >
                <option value="">Priorité</option>
                <option value="1">1 - Critique</option>
                <option value="2">2 - Élevée</option>
                <option value="3">3 - Moyenne</option>
                <option value="4">4 - Faible</option>
              </select>
            </div>

            <div>
              <Label htmlFor="effectiveness">Efficacité (1-4)</Label>
              <select
                id="effectiveness"
                value={formData.effectiveness.toString()}
                onChange={(e) => setFormData(prev => ({ ...prev, effectiveness: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              >
                <option value="">Efficacité</option>
                <option value="1">1 - Faible</option>
                <option value="2">2 - Moyenne</option>
                <option value="3">3 - Élevée</option>
                <option value="4">4 - Très élevée</option>
              </select>
            </div>

            <div>
              <Label htmlFor="implementationCost">Coût (1-4)</Label>
              <select
                id="implementationCost"
                value={formData.implementationCost.toString()}
                onChange={(e) => setFormData(prev => ({ ...prev, implementationCost: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              >
                <option value="">Coût</option>
                <option value="1">1 - Faible</option>
                <option value="2">2 - Modéré</option>
                <option value="3">3 - Élevé</option>
                <option value="4">4 - Très élevé</option>
              </select>
            </div>

            <div>
              <Label htmlFor="implementationComplexity">Complexité (1-4)</Label>
              <select
                id="implementationComplexity"
                value={formData.implementationComplexity.toString()}
                onChange={(e) => setFormData(prev => ({ ...prev, implementationComplexity: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              >
                <option value="">Complexité</option>
                {IMPLEMENTATION_COMPLEXITY.map((complexity) => (
                  <option key={complexity.value} value={complexity.value.toString()}>
                    {complexity.value} - {complexity.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Planification */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="responsibleParty">Responsable *</Label>
              <Input
                id="responsibleParty"
                value={formData.responsibleParty}
                onChange={(e) => setFormData(prev => ({ ...prev, responsibleParty: e.target.value }))}
                placeholder="Ex: RSSI, DSI, Équipe Sécurité"
                className={errors.responsibleParty ? 'border-red-500' : ''}
              />
              {errors.responsibleParty && <p className="text-sm text-red-500 mt-1">{errors.responsibleParty}</p>}
            </div>

            <div>
              <Label htmlFor="implementationTimeframe">Délai d'implémentation</Label>
              <select
                id="implementationTimeframe"
                value={formData.implementationTimeframe}
                onChange={(e) => setFormData(prev => ({ ...prev, implementationTimeframe: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              >
                <option value="">Sélectionner un délai</option>
                <option value="immediate">Immédiat (moins de 1 mois)</option>
                <option value="short">Court terme (1-3 mois)</option>
                <option value="medium">Moyen terme (3-6 mois)</option>
                <option value="long">Long terme (6-12 mois)</option>
                <option value="strategic">Stratégique (plus de 12 mois)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <input
                type="date"
                id="dueDate"
                value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : undefined)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Scénarios ciblés */}
          <div>
            <Label>Scénarios ciblés *</Label>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded p-3">
              {scenarios.map((scenario) => (
                <label key={scenario.id} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.targetedScenarios.includes(scenario.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          targetedScenarios: [...prev.targetedScenarios, scenario.id]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          targetedScenarios: prev.targetedScenarios.filter(id => id !== scenario.id)
                        }));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="truncate">
                    {scenario.name} (Risque: {scenario.riskLevel}/4)
                  </span>
                </label>
              ))}
            </div>
            {errors.targetedScenarios && <p className="text-sm text-red-500 mt-1">{errors.targetedScenarios}</p>}
          </div>

          {/* Détails d'implémentation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="validationCriteria">Critères de validation</Label>
              <Textarea
                id="validationCriteria"
                value={formData.validationCriteria}
                onChange={(e) => setFormData(prev => ({ ...prev, validationCriteria: e.target.value }))}
                placeholder="Comment mesurer l'efficacité de cette mesure..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="implementationNotes">Notes d'implémentation</Label>
              <Textarea
                id="implementationNotes"
                value={formData.implementationNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, implementationNotes: e.target.value }))}
                placeholder="Considérations techniques, contraintes, prérequis..."
                rows={3}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="monitoringMethod">Méthode de surveillance</Label>
            <Input
              id="monitoringMethod"
              value={formData.monitoringMethod}
              onChange={(e) => setFormData(prev => ({ ...prev, monitoringMethod: e.target.value }))}
              placeholder="Ex: Logs SIEM, Métriques de performance, Tests réguliers"
            />
          </div>

          {/* Aperçu de l'impact */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Aperçu de l'Impact Estimé</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white p-3 rounded">
                <div className="text-2xl font-bold text-green-600">{Math.round(calculateRiskReduction() * 100)}%</div>
                <div className="text-sm text-gray-600">Réduction Risque</div>
              </div>
              <div className="bg-white p-3 rounded">
                <div className="text-2xl font-bold text-blue-600">{formData.targetedScenarios.length}</div>
                <div className="text-sm text-gray-600">Scénarios Couverts</div>
              </div>
              <div className="bg-white p-3 rounded">
                <div className="text-2xl font-bold text-purple-600">{formData.effectiveness}/4</div>
                <div className="text-sm text-gray-600">Efficacité</div>
              </div>
            </div>
          </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {!showAiSuggestions && (
                  <Button variant="outline" onClick={() => setShowAiSuggestions(true)}>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Suggestions IA
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit}>
                  {existingMeasure ? 'Mettre à jour' : 'Créer la mesure'}
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}