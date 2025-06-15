import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Building2,
  Shield,
  Cpu,
  FileText,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Target,
  Users,
  Settings,
  Globe,
  Lock,
  TrendingUp,
  X,
  Plus,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MultiValueInput from '@/components/ui/MultiValueInput';
import { Mission } from '@/types/ebios';

// Interface pour le contexte de mission (réutilisée du générateur automatique)
interface MissionContext {
  // Informations organisationnelles
  organizationName: string;
  sector: string;
  organizationSize: string;
  geographicScope: string;
  criticalityLevel: string;

  // Contexte technique
  siComponents: string[];
  mainTechnologies?: string[];
  externalInterfaces?: string[];
  sensitiveData?: string[];

  // Processus métier
  criticalProcesses: string[];
  stakeholders: string[];
  regulations: string[];
  financialStakes: string;

  // Contexte sécurité
  securityMaturity: string;
  pastIncidents?: string;
  regulatoryConstraints?: string[];
  securityBudget?: string;

  // Objectifs de la mission
  missionObjectives: string[];
  timeframe: string;
  specificRequirements: string;
}

interface MissionFormProps {
  onSubmit: (data: Partial<Mission>) => void;
  initialData?: Partial<Mission>;
}

// Données complètes du générateur moderne
const sectors = [
  { id: 'sante', name: 'Santé - Établissements hospitaliers privés', category: 'medical', tags: ['privé'] },
  { id: 'sante-public', name: 'Santé - Cliniques et centres médicaux', category: 'medical', tags: ['soins'] },
  { id: 'pharma', name: 'Santé - Industrie pharmaceutique', category: 'medical', tags: ['industrie'] },
  { id: 'finance-banque', name: 'Finance - Banques et établissements de crédit', category: 'finance', tags: ['banque'] },
  { id: 'finance-assurance', name: 'Finance - Assurances et mutuelles', category: 'finance', tags: ['assurance'] },
  { id: 'finance-invest', name: 'Finance - Gestion d\'actifs et investissement', category: 'finance', tags: ['investissement'] },
  { id: 'energie-prod', name: 'Énergie - Production et distribution', category: 'energy', tags: ['production'] },
  { id: 'energie-renouv', name: 'Énergie - Énergies renouvelables', category: 'energy', tags: ['renouvelable'] },
  { id: 'transport-log', name: 'Transport - Logistique et supply chain', category: 'transport', tags: ['logistique'] },
  { id: 'telecom', name: 'Télécommunications et réseaux', category: 'tech', tags: ['réseau'] },
  { id: 'admin-centrale', name: 'Administration - Services centraux', category: 'public', tags: ['état'] },
  { id: 'admin-locale', name: 'Administration - Collectivités territoriales', category: 'public', tags: ['local'] },
  { id: 'education', name: 'Éducation - Universités et recherche', category: 'education', tags: ['recherche'] },
  { id: 'industrie', name: 'Industrie - Manufacturière et production', category: 'industry', tags: ['production'] },
  { id: 'commerce', name: 'Commerce - Distribution et retail', category: 'commerce', tags: ['retail'] },
  { id: 'numerique', name: 'Services numériques et IT', category: 'tech', tags: ['digital'] }
];

const organizationSizes = [
  { id: 'micro', name: 'Micro-entreprise (1-9 employés)', category: 'tpe', employees: '1-9' },
  { id: 'tpe', name: 'Très petite entreprise - TPE (10-19 employés)', category: 'tpe', employees: '10-19' },
  { id: 'pe', name: 'Petite entreprise - PE (20-49 employés)', category: 'pme', employees: '20-49' },
  { id: 'me', name: 'Moyenne entreprise - ME (50-249 employés)', category: 'pme', employees: '50-249' },
  { id: 'eti', name: 'Entreprise de taille intermédiaire - ETI (250-4999 employés)', category: 'eti', employees: '250-4999' },
  { id: 'ge', name: 'Grande entreprise - GE (5000+ employés)', category: 'ge', employees: '5000+' },
  { id: 'groupe', name: 'Groupe international (50000+ employés)', category: 'ge', employees: '50000+' }
];

const siComponents = [
  { id: 'erp', name: 'ERP (Système de gestion intégré)', category: 'business', icon: Settings },
  { id: 'crm', name: 'CRM (Gestion relation client)', category: 'business', icon: Users },
  { id: 'cloud', name: 'Infrastructure Cloud (AWS, Azure, GCP)', category: 'infrastructure', icon: Globe },
  { id: 'database', name: 'Bases de données critiques', category: 'data', icon: FileText },
  { id: 'payment', name: 'Systèmes de paiement', category: 'finance', icon: Lock },
  { id: 'ecommerce', name: 'Plateformes e-commerce', category: 'business', icon: TrendingUp },
  { id: 'scada', name: 'Systèmes industriels (SCADA, IoT)', category: 'industrial', icon: Cpu },
  { id: 'network', name: 'Infrastructure réseau', category: 'infrastructure', icon: Globe },
  { id: 'backup', name: 'Systèmes de sauvegarde', category: 'infrastructure', icon: Shield },
  { id: 'collab', name: 'Outils collaboratifs', category: 'business', icon: Users }
];

const securityMaturityLevels = [
  { level: 1, name: 'Initial', description: 'Processus ad hoc et chaotiques' },
  { level: 2, name: 'Reproductible', description: 'Processus répétables mais non documentés' },
  { level: 3, name: 'Défini', description: 'Processus documentés et standardisés' },
  { level: 4, name: 'Géré', description: 'Processus mesurés et contrôlés' },
  { level: 5, name: 'Optimisé', description: 'Amélioration continue des processus' }
];

const timeframeOptions = [
  { value: '3', label: '3 mois', description: 'Mission express' },
  { value: '6', label: '6 mois', description: 'Standard' },
  { value: '12', label: '12 mois', description: 'Approfondie' },
  { value: '18', label: '18 mois', description: 'Complète' },
  { value: '24', label: '24 mois', description: 'Transformation' }
];

// Étapes du formulaire moderne
const steps = [
  { id: 1, title: 'Organisation', description: 'Informations de base', icon: Building2 },
  { id: 2, title: 'Technique', description: 'Systèmes et technologies', icon: Cpu },
  { id: 3, title: 'Processus', description: 'Métier et parties prenantes', icon: Users },
  { id: 4, title: 'Conformité', description: 'Réglementations et sécurité', icon: Shield },
  { id: 5, title: 'Objectifs', description: 'Finalisation', icon: Target }
];

const MissionForm: React.FC<MissionFormProps> = ({ onSubmit, initialData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sectorSearch, setSectorSearch] = useState('');
  const [selectedSectorCategory, setSelectedSectorCategory] = useState('');
  const [context, setContext] = useState<MissionContext>({
    organizationName: initialData?.name || '',
    sector: '',
    organizationSize: '',
    geographicScope: '',
    criticalityLevel: '',
    siComponents: [],
    mainTechnologies: [],
    externalInterfaces: [],
    sensitiveData: [],
    criticalProcesses: [],
    stakeholders: [],
    regulations: [],
    financialStakes: '',
    securityMaturity: '',
    pastIncidents: '',
    regulatoryConstraints: [],
    securityBudget: '',
    missionObjectives: [],
    timeframe: '',
    specificRequirements: initialData?.description || ''
  });

  // Filtrage intelligent des secteurs
  const filteredSectors = useMemo(() => {
    return sectors.filter(sector => {
      const matchesSearch = sector.name.toLowerCase().includes(sectorSearch.toLowerCase()) ||
                           sector.tags.some(tag => tag.toLowerCase().includes(sectorSearch.toLowerCase()));
      const matchesCategory = !selectedSectorCategory || sector.category === selectedSectorCategory;
      return matchesSearch && matchesCategory;
    });
  }, [sectorSearch, selectedSectorCategory]);

  // Catégories de secteurs pour les filtres
  const sectorCategories = useMemo(() => {
    const categories = [...new Set(sectors.map(s => s.category))];
    return categories.map(cat => ({
      id: cat,
      name: cat === 'medical' ? 'Santé' :
            cat === 'finance' ? 'Finance' :
            cat === 'energy' ? 'Énergie' :
            cat === 'transport' ? 'Transport' :
            cat === 'tech' ? 'Technologie' :
            cat === 'public' ? 'Public' :
            cat === 'education' ? 'Éducation' :
            cat === 'industry' ? 'Industrie' :
            cat === 'commerce' ? 'Commerce' : cat
    }));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<Partial<Mission>>({
    defaultValues: initialData,
  });

  const watchedName = watch('name');
  const watchedDescription = watch('description');

  // Synchroniser le nom de l'organisation avec le nom de la mission
  React.useEffect(() => {
    if (context.organizationName) {
      const missionName = `Mission EBIOS RM - ${context.organizationName}`;
      if (!watchedName || watchedName !== missionName) {
        setValue('name', missionName);
      }
    }
  }, [context.organizationName, watchedName, setValue]);

  // Synchroniser la description avec les exigences spécifiques
  React.useEffect(() => {
    if (context.specificRequirements) {
      if (!watchedDescription || watchedDescription !== context.specificRequirements) {
        setValue('description', context.specificRequirements);
      }
    } else if (!watchedDescription) {
      // Valeur par défaut si pas d'exigences spécifiques
      setValue('description', 'Évaluer les risques de l\'application');
    }
  }, [context.specificRequirements, watchedDescription, setValue]);

  // Fonctions d'aide pour les composants SI
  const toggleSIComponent = (componentId: string) => {
    setContext(prev => ({
      ...prev,
      siComponents: prev.siComponents.includes(componentId)
        ? prev.siComponents.filter(id => id !== componentId)
        : [...prev.siComponents, componentId]
    }));
  };

  // Validation des étapes
  const isStepComplete = (stepId: number) => {
    switch (stepId) {
      case 1:
        return context.organizationName && context.sector && context.organizationSize;
      case 2:
        return context.siComponents.length > 0;
      case 3:
        return context.criticalProcesses.length > 0;
      case 4:
        return context.securityMaturity && context.regulations.length > 0;
      case 5:
        // Étape 5 : seulement le timeframe est requis, les objectifs sont optionnels
        return context.timeframe;
      default:
        return false;
    }
  };

  // Validation globale du formulaire
  const isFormValid = () => {
    const hasRequiredContext = context.organizationName &&
                              context.sector &&
                              context.organizationSize &&
                              context.siComponents.length > 0 &&
                              context.criticalProcesses.length > 0 &&
                              context.timeframe;

    const hasRequiredFormFields = watchedName && watchedDescription;

    console.log('🔍 Validation Debug:', {
      hasRequiredContext,
      hasRequiredFormFields,
      context: {
        organizationName: context.organizationName,
        sector: context.sector,
        organizationSize: context.organizationSize,
        siComponents: context.siComponents.length,
        criticalProcesses: context.criticalProcesses.length,
        timeframe: context.timeframe
      },
      formFields: {
        watchedName,
        watchedDescription
      }
    });

    return hasRequiredContext && hasRequiredFormFields;
  };



  const handleFinalSubmit = (formData: Partial<Mission>) => {
    // Mapper la taille d'organisation au format attendu
    const mapOrganizationSize = (size: string): 'small' | 'medium' | 'large' | 'enterprise' => {
      if (size.includes('TPE')) return 'small';
      if (size.includes('PME')) return 'medium';
      if (size.includes('ETI')) return 'large';
      if (size.includes('Grande')) return 'enterprise';
      return 'medium'; // Par défaut
    };

    // Enrichir les données de mission avec le contexte
    const enrichedData: Partial<Mission> = {
      ...formData,
      organizationContext: {
        organizationType: 'private', // Par défaut
        sector: context.sector,
        size: mapOrganizationSize(context.organizationSize),
        regulatoryRequirements: context.regulations,
        securityObjectives: context.missionObjectives,
        constraints: []
      },
      scope: {
        boundaries: context.geographicScope || 'Organisationnel',
        inclusions: context.siComponents,
        exclusions: [],
        timeFrame: {
          start: new Date().toISOString(),
          end: new Date(Date.now() + (parseInt(context.timeframe) || 12) * 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        geographicalScope: context.geographicScope ? [context.geographicScope] : []
      },
      // Ajouter le contexte complet pour les agents IA
      missionContext: context
    };

    onSubmit(enrichedData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header moderne */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Création de Mission EBIOS RM
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">Définissez le contexte pour une aide IA intelligente</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                {Math.round((Object.values(steps).filter(step => isStepComplete(step.id)).length / steps.length) * 100)}% complété
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stepper moderne */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 sm:gap-0">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all cursor-pointer ${
                    currentStep === step.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : isStepComplete(step.id)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <div className="hidden sm:block">
                    <div className="font-medium text-xs sm:text-sm">{step.title}</div>
                    <div className="text-xs opacity-75 hidden md:block">{step.description}</div>
                  </div>
                  <div className="block sm:hidden">
                    <div className="font-medium text-xs">{step.id}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 mx-1 sm:mx-2 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Aide mobile - affichée uniquement sur mobile/tablette */}
        <div className="xl:hidden mb-6">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800 text-sm">Aide contextuelle</span>
              </div>
              <div className="text-xs sm:text-sm text-blue-700">
                {currentStep === 1 && "Utilisez la recherche et les filtres pour trouver votre secteur d'activité."}
                {currentStep === 2 && "Décrivez précisément votre périmètre d'analyse et vos composants IT."}
                {currentStep === 3 && "Identifiez les parties prenantes et processus métier critiques."}
                {currentStep === 4 && "Évaluez votre maturité sécurité et conformité réglementaire."}
                {currentStep === 5 && "Vérifiez le résumé et définissez vos objectifs d'analyse."}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu des étapes */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 sm:gap-8">
          {/* Contenu principal */}
          <div className="xl:col-span-3 min-h-0 overflow-visible">

            {/* Étape 1: Organisation */}
            {currentStep === 1 && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    Informations de l'Organisation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Nom de l'organisation *</Label>
                    <Input
                      value={context.organizationName}
                      onChange={(e) => setContext(prev => ({ ...prev, organizationName: e.target.value }))}
                      placeholder="Ex: Hôpital Universitaire de Paris"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Secteur d'activité *</Label>
                    <div className="mt-2 space-y-3">
                      {/* Barre de recherche */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Rechercher un secteur..."
                          value={sectorSearch}
                          onChange={(e) => setSectorSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      {/* Filtres par catégorie */}
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <Button
                          variant={selectedSectorCategory === '' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedSectorCategory('')}
                          className="text-xs"
                        >
                          Tous
                        </Button>
                        {sectorCategories.map(category => (
                          <Button
                            key={category.id}
                            variant={selectedSectorCategory === category.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedSectorCategory(category.id)}
                            className="text-xs"
                          >
                            {category.name}
                          </Button>
                        ))}
                      </div>

                      {/* Liste des secteurs */}
                      <div className="max-h-40 sm:max-h-48 overflow-y-auto space-y-2">
                        {filteredSectors.map(sector => (
                          <div
                            key={sector.id}
                            className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-all ${
                              context.sector === sector.name
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setContext(prev => ({ ...prev, sector: sector.name }))}
                          >
                            <div className="font-medium text-xs sm:text-sm">{sector.name}</div>
                            <div className="flex gap-1 mt-1">
                              {sector.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Taille de l'organisation *</Label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {organizationSizes.map(size => (
                        <div
                          key={size.id}
                          className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-all ${
                            context.organizationSize === size.name
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setContext(prev => ({ ...prev, organizationSize: size.name }))}
                        >
                          <div className="font-medium text-xs sm:text-sm">{size.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{size.employees} employés</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Périmètre géographique</Label>
                    <Input
                      value={context.geographicScope}
                      onChange={(e) => setContext(prev => ({ ...prev, geographicScope: e.target.value }))}
                      placeholder="Ex: National, Régional, International"
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Étape 2: Technique */}
            {currentStep === 2 && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Cpu className="h-6 w-6 text-blue-600" />
                    Systèmes et Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Composants SI concernés *</Label>
                    <p className="text-xs text-gray-500 mt-1">Sélectionnez les systèmes d'information critiques de votre organisation</p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {siComponents.map(component => {
                        const Icon = component.icon;
                        const isSelected = context.siComponents.includes(component.id);
                        return (
                          <div
                            key={component.id}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => toggleSIComponent(component.id)}
                          >
                            <div className="flex items-start gap-3">
                              <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                              <div className="flex-1">
                                <div className="font-medium text-sm">{component.name}</div>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {component.category}
                                </Badge>
                              </div>
                              {isSelected && (
                                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {context.siComponents.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-900">
                          {context.siComponents.length} composant(s) sélectionné(s)
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {context.siComponents.map(componentId => {
                            const component = siComponents.find(c => c.id === componentId);
                            return component ? (
                              <Badge key={componentId} variant="secondary" className="text-xs">
                                {component.name}
                                <X
                                  className="h-3 w-3 ml-1 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSIComponent(componentId);
                                  }}
                                />
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <MultiValueInput
                    label="Technologies principales"
                    values={context.mainTechnologies || []}
                    onChange={(values) => setContext(prev => ({ ...prev, mainTechnologies: values }))}
                    placeholder="Ex: Microsoft Azure, Oracle Database, Cisco Networking..."
                    description="Listez les technologies clés utilisées dans votre organisation"
                    maxItems={15}
                  />

                  <MultiValueInput
                    label="Interfaces externes"
                    values={context.externalInterfaces || []}
                    onChange={(values) => setContext(prev => ({ ...prev, externalInterfaces: values }))}
                    placeholder="Ex: API bancaires, Connexions partenaires, Services cloud..."
                    description="Identifiez les connexions avec des systèmes externes"
                    maxItems={15}
                  />
                </CardContent>
              </Card>
            )}

            {/* Étape 3: Processus */}
            {currentStep === 3 && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Users className="h-6 w-6 text-blue-600" />
                    Processus Métier et Parties Prenantes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <MultiValueInput
                    label="Processus critiques"
                    values={context.criticalProcesses}
                    onChange={(values) => setContext(prev => ({ ...prev, criticalProcesses: values }))}
                    placeholder="Ex: Gestion des patients, Facturation, Gestion des urgences..."
                    description="Identifiez les processus métier essentiels de votre organisation"
                    maxItems={20}
                    required={true}
                  />

                  <MultiValueInput
                    label="Parties prenantes"
                    values={context.stakeholders}
                    onChange={(values) => setContext(prev => ({ ...prev, stakeholders: values }))}
                    placeholder="Ex: Patients, Personnel médical, Fournisseurs..."
                    description="Listez les acteurs internes et externes concernés"
                    maxItems={15}
                  />

                  <MultiValueInput
                    label="Données sensibles"
                    values={context.sensitiveData || []}
                    onChange={(values) => setContext(prev => ({ ...prev, sensitiveData: values }))}
                    placeholder="Ex: Données patients, Dossiers médicaux, Données financières..."
                    description="Types de données critiques manipulées"
                    maxItems={15}
                  />

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Enjeux financiers</Label>
                    <Input
                      value={context.financialStakes}
                      onChange={(e) => setContext(prev => ({ ...prev, financialStakes: e.target.value }))}
                      placeholder="Ex: CA 500M€, Budget IT 50M€, Impact interruption 2M€/jour"
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Étape 4: Conformité */}
            {currentStep === 4 && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Shield className="h-6 w-6 text-blue-600" />
                    Réglementations et Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Maturité sécurité *</Label>
                    <p className="text-xs text-gray-500 mt-1">Évaluez le niveau de maturité actuel de votre organisation</p>
                    <div className="mt-3 space-y-2">
                      {securityMaturityLevels.map(level => (
                        <div
                          key={level.level}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            context.securityMaturity === level.name
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setContext(prev => ({ ...prev, securityMaturity: level.name }))}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              context.securityMaturity === level.name
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {level.level}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{level.name}</div>
                              <div className="text-xs text-gray-500">{level.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <MultiValueInput
                    label="Réglementations applicables"
                    values={context.regulations}
                    onChange={(values) => setContext(prev => ({ ...prev, regulations: values }))}
                    placeholder="Ex: RGPD, HDS, ANSSI, ISO 27001..."
                    description="Identifiez les cadres réglementaires qui s'appliquent"
                    maxItems={15}
                    required={true}
                  />

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Incidents de sécurité passés</Label>
                    <Textarea
                      value={context.pastIncidents || ''}
                      onChange={(e) => setContext(prev => ({ ...prev, pastIncidents: e.target.value }))}
                      placeholder="Décrivez brièvement les incidents de sécurité survenus dans les 3 dernières années"
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Budget sécurité</Label>
                    <Input
                      value={context.securityBudget || ''}
                      onChange={(e) => setContext(prev => ({ ...prev, securityBudget: e.target.value }))}
                      placeholder="Ex: 2M€ annuel, 15% du budget IT"
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Étape 5: Objectifs */}
            {currentStep === 5 && (
              <form onSubmit={handleSubmit(handleFinalSubmit)} className="space-y-4">
                <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Target className="h-6 w-6 text-blue-600" />
                      Finalisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Délai de réalisation *</Label>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                        {timeframeOptions.map(option => (
                          <div
                            key={option.value}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              context.timeframe === option.label
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setContext(prev => ({ ...prev, timeframe: option.label }))}
                          >
                            <div className="font-medium text-sm">{option.label}</div>
                            <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <MultiValueInput
                      label="Objectifs de la mission"
                      values={context.missionObjectives}
                      onChange={(values) => setContext(prev => ({ ...prev, missionObjectives: values }))}
                      placeholder="Ex: Identifier les risques critiques, Améliorer la posture sécurité..."
                      description="Définissez les objectifs principaux de cette mission EBIOS RM"
                      maxItems={10}
                      required={true}
                    />

                    <div>
                      <Label htmlFor="missionName">Nom de la mission *</Label>
                      <Input
                        id="missionName"
                        {...register('name', { required: 'Le nom de la mission est requis' })}
                        placeholder="Ex: Mission EBIOS RM - Hôpital Universitaire"
                        className="mt-2"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="missionDescription">Description de la mission *</Label>
                      <Textarea
                        id="missionDescription"
                        {...register('description', { required: 'La description est requise' })}
                        placeholder="Décrivez les objectifs et le contexte de cette mission EBIOS RM"
                        rows={3}
                        className="mt-2"
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="dueDate">Date d'échéance (facultatif)</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        {...register('dueDate')}
                        min={new Date().toISOString().split('T')[0]}
                        className="mt-2"
                        placeholder="Sélectionnez une date limite (optionnel)"
                      />
                      {errors.dueDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Exigences spécifiques</Label>
                      <Textarea
                        value={context.specificRequirements}
                        onChange={(e) => setContext(prev => ({ ...prev, specificRequirements: e.target.value }))}
                        placeholder="Décrivez toute exigence particulière, contrainte ou contexte spécifique à prendre en compte"
                        rows={3}
                        className="mt-2"
                      />
                    </div>

                    {/* Résumé du contexte */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                      <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Résumé du contexte
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <p><strong>Organisation:</strong> {context.organizationName}</p>
                          <p><strong>Secteur:</strong> {context.sector}</p>
                          <p><strong>Taille:</strong> {context.organizationSize}</p>
                          <p><strong>Périmètre:</strong> {context.geographicScope || 'Non défini'}</p>
                        </div>
                        <div className="space-y-2">
                          <p><strong>Composants SI:</strong> {context.siComponents.length} sélectionnés</p>
                          <p><strong>Processus critiques:</strong> {context.criticalProcesses.length} définis</p>
                          <p><strong>Réglementations:</strong> {context.regulations.length} identifiées</p>
                          <p><strong>Délai:</strong> {context.timeframe}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Boutons de navigation et soumission */}
                <div className="mission-nav-buttons flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(4)}
                    className="w-full sm:w-auto sm:min-w-[120px] flex items-center justify-center gap-2 text-sm py-2.5"
                  >
                    <ArrowRight className="h-4 w-4 rotate-180" />
                    Retour
                  </Button>

                  <Button
                    type="submit"
                    disabled={!isFormValid()}
                    className="w-full sm:w-auto sm:min-w-[180px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 flex items-center justify-center gap-2 text-sm py-2.5 shadow-lg"
                  >
                    {initialData ? 'Mettre à jour la Mission' : 'Créer la Mission'}
                    <Target className="h-4 w-4" />
                  </Button>

                  {/* Debug info - à supprimer après test */}
                  {!isFormValid() && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                      <strong>Debug:</strong> Formulaire invalide -
                      Nom: {watchedName ? '✓' : '✗'},
                      Description: {watchedDescription ? '✓' : '✗'},
                      Timeframe: {context.timeframe ? '✓' : '✗'}
                    </div>
                  )}
                </div>
              </form>
            )}

            {/* Boutons de navigation pour les étapes 1-4 */}
            {currentStep < 5 && (
              <div className="mission-nav-buttons flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="w-full sm:w-auto sm:min-w-[120px] flex items-center justify-center gap-2 text-sm py-2.5"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Retour
                </Button>

                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!isStepComplete(currentStep)}
                  className="w-full sm:w-auto sm:min-w-[120px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center justify-center gap-2 text-sm py-2.5 shadow-lg"
                >
                  Suivant
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Alerte de validation */}
            {currentStep < 5 && !isStepComplete(currentStep) && (
              <Alert className="mt-4 border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  {currentStep === 1 && "Veuillez remplir le nom de l'organisation, le secteur et la taille."}
                  {currentStep === 2 && "Veuillez sélectionner au moins un composant SI."}
                  {currentStep === 3 && "Veuillez définir au moins un processus critique."}
                  {currentStep === 4 && "Veuillez définir la maturité sécurité et au moins une réglementation."}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Panneau latéral d'aide - masqué sur mobile et tablette */}
          <div className="hidden xl:block">
            <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Aide Contextuelle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStep === 1 && (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 text-sm">💡 Conseil</h4>
                      <p className="text-xs text-blue-800 mt-1">
                        Utilisez la recherche pour trouver rapidement votre secteur d'activité. Les filtres vous aident à affiner les résultats.
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 text-sm">✅ Bonnes pratiques</h4>
                      <p className="text-xs text-green-800 mt-1">
                        Soyez précis dans le nom de votre organisation pour faciliter l'identification dans les rapports.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900 text-sm">🔧 Composants SI</h4>
                      <p className="text-xs text-purple-800 mt-1">
                        Sélectionnez tous les systèmes critiques pour votre activité. L'IA utilisera ces informations pour personnaliser l'analyse.
                      </p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h4 className="font-medium text-orange-900 text-sm">⚠️ Important</h4>
                      <p className="text-xs text-orange-800 mt-1">
                        N'oubliez pas les interfaces externes et les technologies cloud utilisées.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-3">
                    <div className="p-3 bg-indigo-50 rounded-lg">
                      <h4 className="font-medium text-indigo-900 text-sm">📋 Processus</h4>
                      <p className="text-xs text-indigo-800 mt-1">
                        Identifiez les processus dont l'interruption aurait un impact critique sur votre activité.
                      </p>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-lg">
                      <h4 className="font-medium text-teal-900 text-sm">👥 Parties prenantes</h4>
                      <p className="text-xs text-teal-800 mt-1">
                        Incluez les acteurs internes et externes qui pourraient être impactés par un incident.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-900 text-sm">🛡️ Conformité</h4>
                      <p className="text-xs text-red-800 mt-1">
                        La maturité sécurité et les réglementations influencent directement les recommandations de l'IA.
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-900 text-sm">📊 Évaluation</h4>
                      <p className="text-xs text-yellow-800 mt-1">
                        Soyez honnête sur votre niveau de maturité pour obtenir des recommandations adaptées.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className="space-y-3">
                    <div className="p-3 bg-emerald-50 rounded-lg">
                      <h4 className="font-medium text-emerald-900 text-sm">🎯 Finalisation</h4>
                      <p className="text-xs text-emerald-800 mt-1">
                        Vérifiez le résumé et définissez des objectifs clairs pour optimiser l'aide de l'IA.
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 text-sm">🚀 Prêt !</h4>
                      <p className="text-xs text-blue-800 mt-1">
                        Une fois créée, la mission bénéficiera d'une assistance IA contextuelle basée sur ces informations.
                      </p>
                    </div>
                  </div>
                )}

                {/* Indicateur de progression */}
                <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progression</span>
                    <span className="text-sm font-bold text-blue-600">
                      {Math.round((Object.values(steps).filter(step => isStepComplete(step.id)).length / steps.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(Object.values(steps).filter(step => isStepComplete(step.id)).length / steps.length) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionForm;