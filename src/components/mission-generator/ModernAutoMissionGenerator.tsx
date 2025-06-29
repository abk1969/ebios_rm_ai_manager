/**
 * 🚀 GÉNÉRATEUR AUTOMATIQUE MODERNE - UX/UI AVANCÉE
 * Interface moderne avec filtres intelligents et expérience utilisateur optimisée
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Zap,
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
  Edit3,
  Check
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AutoMissionGeneratorService } from '@/services/ai/AutoMissionGeneratorService';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MissionContext {
  organizationName: string;
  sector: string;
  organizationSize: string;
  geographicScope: string;
  criticalityLevel: string;
  siComponents: string[];
  mainTechnologies: string[];
  criticalProcesses: string[];
  stakeholders: string[];
  regulations: string[];
  financialStakes: string;
  securityMaturity: string;
  missionObjectives: string[];
  timeframe: string;
  specificRequirements: string;
}

interface FilterState {
  sectorFilter: string;
  sizeFilter: string;
  techFilter: string;
  regFilter: string;
}

const ModernAutoMissionGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [context, setContext] = useState<MissionContext>({
    organizationName: '',
    sector: '',
    organizationSize: '',
    geographicScope: '',
    criticalityLevel: '',
    siComponents: [],
    mainTechnologies: [],
    criticalProcesses: [],
    stakeholders: [],
    regulations: [],
    financialStakes: '',
    securityMaturity: '',
    missionObjectives: [],
    timeframe: '',
    specificRequirements: ''
  });

  const [filters, setFilters] = useState<FilterState>({
    sectorFilter: '',
    sizeFilter: '',
    techFilter: '',
    regFilter: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCustomSector, setShowCustomSector] = useState(false);
  const [customSectorValue, setCustomSectorValue] = useState('');
  const [generationProgress, setGenerationProgress] = useState({
    step: '',
    progress: 0,
    isComplete: false,
    missionId: '',
    reports: [] as string[]
  });

  // Données enrichies (extraites du composant précédent) - ÉLARGIE POUR TOUS SECTEURS FR/EU
  const sectors = [
    // SECTEUR PUBLIC
    { id: 'admin-centrale', name: 'Administration centrale (Ministères, Préfectures)', category: 'public', tags: ['gouvernement', 'état'] },
    { id: 'collectivites', name: 'Collectivités territoriales (Régions, Départements, Communes)', category: 'public', tags: ['local', 'territorial'] },
    { id: 'sante-publique', name: 'Établissements publics de santé (CHU, CHR, Hôpitaux)', category: 'public', tags: ['santé', 'médical'] },
    { id: 'education', name: 'Éducation nationale et enseignement supérieur', category: 'public', tags: ['éducation', 'université'] },
    { id: 'justice', name: 'Justice et services pénitentiaires', category: 'public', tags: ['justice', 'droit'] },
    { id: 'defense', name: 'Défense et sécurité nationale', category: 'public', tags: ['défense', 'militaire'] },
    { id: 'social-public', name: 'Services sociaux et médico-sociaux publics', category: 'public', tags: ['social', 'aide'] },
    { id: 'secu-sociale', name: 'Organismes de sécurité sociale (CPAM, CAF, URSSAF)', category: 'public', tags: ['sécurité sociale', 'prestations'] },

    // SANTÉ PRIVÉE
    { id: 'sante-privee', name: 'Santé - Établissements hospitaliers privés', category: 'santé', tags: ['médical', 'privé'] },
    { id: 'cliniques', name: 'Santé - Cliniques et centres médicaux', category: 'santé', tags: ['médical', 'soins'] },
    { id: 'pharma', name: 'Santé - Industrie pharmaceutique', category: 'santé', tags: ['médicament', 'recherche'] },
    { id: 'laboratoires', name: 'Santé - Laboratoires d\'analyses médicales', category: 'santé', tags: ['analyse', 'diagnostic'] },
    { id: 'pharmacies', name: 'Santé - Pharmacies et officines', category: 'santé', tags: ['pharmacie', 'médicament'] },
    { id: 'telemedicine', name: 'Santé - Télémédecine et e-santé', category: 'santé', tags: ['télémédecine', 'digital'] },

    // SERVICES FINANCIERS COMPLETS
    { id: 'banques-detail', name: 'Banques de détail et commerciales', category: 'finance', tags: ['banque', 'crédit'] },
    { id: 'banques-investissement', name: 'Banques d\'investissement et de marché', category: 'finance', tags: ['investissement', 'marché'] },
    { id: 'banques-cooperatives', name: 'Banques coopératives et mutualistes', category: 'finance', tags: ['coopérative', 'mutuelle'] },
    { id: 'assurance-vie', name: 'Assurances vie et non-vie', category: 'finance', tags: ['assurance', 'risque'] },
    { id: 'mutuelles', name: 'Mutuelles et institutions de prévoyance', category: 'finance', tags: ['mutuelle', 'prévoyance'] },
    { id: 'gestion-actifs', name: 'Sociétés de gestion d\'actifs', category: 'finance', tags: ['gestion', 'actifs'] },
    { id: 'epargne', name: 'Épargne et placement financier', category: 'finance', tags: ['épargne', 'placement', 'investissement'] },
    { id: 'fonds-pension', name: 'Fonds de pension et retraite', category: 'finance', tags: ['pension', 'retraite'] },
    { id: 'fintech', name: 'Fintech et néobanques', category: 'finance', tags: ['innovation', 'digital'] },
    { id: 'paiement', name: 'Services de paiement et monétique', category: 'finance', tags: ['paiement', 'monétique'] },
    { id: 'courtage', name: 'Courtage et intermédiation financière', category: 'finance', tags: ['courtage', 'intermédiation'] },
    { id: 'credit-bail', name: 'Crédit-bail et affacturage', category: 'finance', tags: ['crédit-bail', 'affacturage'] },

    // INDUSTRIE
    { id: 'automobile', name: 'Industrie automobile', category: 'industrie', tags: ['véhicule', 'transport'] },
    { id: 'aeronautique', name: 'Industrie aéronautique et spatiale', category: 'industrie', tags: ['avion', 'espace'] },
    { id: 'navale', name: 'Industrie navale et maritime', category: 'industrie', tags: ['naval', 'maritime'] },
    { id: 'chimique', name: 'Industrie chimique et pétrochimique', category: 'industrie', tags: ['chimie', 'pétrole'] },
    { id: 'agroalimentaire', name: 'Industrie agroalimentaire', category: 'industrie', tags: ['alimentaire', 'agriculture'] },
    { id: 'textile', name: 'Industrie textile et habillement', category: 'industrie', tags: ['textile', 'mode'] },
    { id: 'metallurgie', name: 'Métallurgie et sidérurgie', category: 'industrie', tags: ['métal', 'acier'] },
    { id: 'electronique', name: 'Industrie électronique et composants', category: 'industrie', tags: ['électronique', 'composants'] },

    // ÉNERGIE ET UTILITIES
    { id: 'energie-production', name: 'Production d\'électricité (nucléaire, renouvelable)', category: 'énergie', tags: ['électricité', 'nucléaire'] },
    { id: 'energie-transport', name: 'Transport et distribution d\'électricité', category: 'énergie', tags: ['transport', 'distribution'] },
    { id: 'gaz', name: 'Production et distribution de gaz', category: 'énergie', tags: ['gaz', 'distribution'] },
    { id: 'petrole', name: 'Pétrole et raffinerie', category: 'énergie', tags: ['pétrole', 'raffinerie'] },
    { id: 'renouvelables', name: 'Énergies renouvelables (éolien, solaire)', category: 'énergie', tags: ['renouvelable', 'vert'] },
    { id: 'eau', name: 'Distribution d\'eau et assainissement', category: 'utilities', tags: ['eau', 'assainissement'] },
    { id: 'dechets', name: 'Gestion des déchets et recyclage', category: 'utilities', tags: ['déchets', 'recyclage'] },

    // TECH
    { id: 'software', name: 'Éditeurs de logiciels', category: 'tech', tags: ['logiciel', 'développement'] },
    { id: 'cloud', name: 'Hébergement et cloud computing', category: 'tech', tags: ['cloud', 'infrastructure'] },
    { id: 'cybersec', name: 'Cybersécurité', category: 'tech', tags: ['sécurité', 'protection'] },
    { id: 'ai', name: 'Intelligence artificielle et data science', category: 'tech', tags: ['ia', 'données'] },
    { id: 'telecoms', name: 'Opérateurs télécoms fixes et mobiles', category: 'tech', tags: ['télécom', 'mobile'] },
    { id: 'internet', name: 'Fournisseurs d\'accès Internet', category: 'tech', tags: ['internet', 'fai'] }
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
    // ERP & GESTION
    { id: 'sap', name: 'ERP - SAP (S/4HANA, ECC)', category: 'erp', tags: ['gestion', 'entreprise'] },
    { id: 'oracle-erp', name: 'ERP - Oracle (Fusion, E-Business Suite)', category: 'erp', tags: ['gestion', 'oracle'] },
    { id: 'dynamics', name: 'ERP - Microsoft Dynamics', category: 'erp', tags: ['microsoft', 'gestion'] },
    { id: 'salesforce', name: 'CRM - Salesforce', category: 'crm', tags: ['client', 'vente'] },
    
    // CLOUD & INFRASTRUCTURE
    { id: 'aws', name: 'Infrastructure Cloud - AWS', category: 'cloud', tags: ['amazon', 'infrastructure'] },
    { id: 'azure', name: 'Infrastructure Cloud - Microsoft Azure', category: 'cloud', tags: ['microsoft', 'cloud'] },
    { id: 'gcp', name: 'Infrastructure Cloud - Google Cloud Platform', category: 'cloud', tags: ['google', 'cloud'] },
    { id: 'docker', name: 'Conteneurisation (Docker, Kubernetes)', category: 'devops', tags: ['conteneur', 'orchestration'] },
    
    // SÉCURITÉ
    { id: 'ad', name: 'Active Directory / LDAP', category: 'security', tags: ['identité', 'authentification'] },
    { id: 'siem', name: 'SIEM (Security Information)', category: 'security', tags: ['monitoring', 'sécurité'] },
    { id: 'firewall', name: 'Firewall et UTM', category: 'security', tags: ['protection', 'réseau'] },
    
    // DONNÉES & IA
    { id: 'datawarehouse', name: 'Entrepôts de données (Data Warehouse)', category: 'data', tags: ['données', 'analyse'] },
    { id: 'ai-ml', name: 'Intelligence artificielle / ML', category: 'ai', tags: ['ia', 'apprentissage'] },
    { id: 'bigdata', name: 'Big Data (Hadoop, Spark)', category: 'data', tags: ['données', 'volume'] }
  ];

  const regulations = [
    // EUROPÉENNES
    { id: 'rgpd', name: 'RGPD (Règlement Général sur la Protection des Données)', category: 'eu', scope: 'données', mandatory: true },
    { id: 'nis2', name: 'NIS2 (Network and Information Security Directive)', category: 'eu', scope: 'sécurité', mandatory: false },
    { id: 'dora', name: 'DORA (Digital Operational Resilience Act)', category: 'eu', scope: 'finance', mandatory: false },
    { id: 'ai-act', name: 'AI Act (Artificial Intelligence Act)', category: 'eu', scope: 'ia', mandatory: false },
    
    // FRANÇAISES
    { id: 'anssi-rgs', name: 'ANSSI - RGS (Référentiel Général de Sécurité)', category: 'fr', scope: 'public', mandatory: false },
    { id: 'hds', name: 'HDS (Hébergement de Données de Santé)', category: 'fr', scope: 'santé', mandatory: false },
    { id: 'pci-dss', name: 'PCI-DSS (Payment Card Industry)', category: 'intl', scope: 'paiement', mandatory: false },
    
    // SECTORIELLES
    { id: 'acpr', name: 'ACPR (Autorité de Contrôle Prudentiel)', category: 'fr', scope: 'finance', mandatory: false },
    { id: 'iso27001', name: 'ISO 27001 (Management de la sécurité)', category: 'intl', scope: 'sécurité', mandatory: false }
  ];

  // Filtres intelligents
  const filteredSectors = useMemo(() => {
    return sectors.filter(sector => 
      sector.name.toLowerCase().includes(filters.sectorFilter.toLowerCase()) ||
      sector.tags.some(tag => tag.toLowerCase().includes(filters.sectorFilter.toLowerCase()))
    );
  }, [filters.sectorFilter]);

  const filteredSizes = useMemo(() => {
    return organizationSizes.filter(size => 
      size.name.toLowerCase().includes(filters.sizeFilter.toLowerCase()) ||
      size.category.toLowerCase().includes(filters.sizeFilter.toLowerCase())
    );
  }, [filters.sizeFilter]);

  const filteredComponents = useMemo(() => {
    return siComponents.filter(component => 
      component.name.toLowerCase().includes(filters.techFilter.toLowerCase()) ||
      component.tags.some(tag => tag.toLowerCase().includes(filters.techFilter.toLowerCase()))
    );
  }, [filters.techFilter]);

  const filteredRegulations = useMemo(() => {
    return regulations.filter(reg => 
      reg.name.toLowerCase().includes(filters.regFilter.toLowerCase()) ||
      reg.scope.toLowerCase().includes(filters.regFilter.toLowerCase())
    );
  }, [filters.regFilter]);

  // Suggestions intelligentes basées sur le secteur
  const getSuggestions = () => {
    const selectedSector = sectors.find(s => s.name === context.sector);
    if (!selectedSector) return null;

    const suggestions = {
      components: siComponents.filter(comp => {
        if (selectedSector.category === 'finance') return ['erp', 'security', 'data'].includes(comp.category);
        if (selectedSector.category === 'santé') return ['erp', 'security', 'data'].includes(comp.category);
        if (selectedSector.category === 'tech') return ['cloud', 'devops', 'ai'].includes(comp.category);
        return true;
      }),
      regulations: regulations.filter(reg => {
        if (selectedSector.category === 'finance') return ['eu', 'intl'].includes(reg.category) || reg.scope === 'finance';
        if (selectedSector.category === 'santé') return reg.scope === 'santé' || reg.mandatory;
        if (selectedSector.category === 'public') return reg.scope === 'public' || reg.mandatory;
        return reg.mandatory;
      })
    };

    return suggestions;
  };

  const suggestions = getSuggestions();

  const steps = [
    { id: 1, title: 'Organisation', icon: Building2, description: 'Informations de base' },
    { id: 2, title: 'Technique', icon: Cpu, description: 'Systèmes et technologies' },
    { id: 3, title: 'Processus', icon: Target, description: 'Métier et parties prenantes' },
    { id: 4, title: 'Conformité', icon: Shield, description: 'Réglementations et sécurité' },
    { id: 5, title: 'Objectifs', icon: TrendingUp, description: 'Finalisation' }
  ];

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1: return !!(context.organizationName && context.sector && context.organizationSize);
      case 2: return context.siComponents.length > 0;
      case 3: return context.criticalProcesses.length > 0;
      case 4: return context.regulations.length > 0;
      case 5: return context.missionObjectives.length > 0;
      default: return false;
    }
  };

  const handleArrayToggle = (field: keyof MissionContext, value: string) => {
    setContext(prev => {
      const currentArray = prev[field] as string[];
      const isSelected = currentArray.includes(value);

      return {
        ...prev,
        [field]: isSelected
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const handleArrayRemove = (field: keyof MissionContext, value: string) => {
    setContext(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const handleArrayAdd = (field: keyof MissionContext, value: string) => {
    if (value.trim() && !(context[field] as string[]).includes(value.trim())) {
      setContext(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
    }
  };

  const applySuggestion = (type: 'components' | 'regulations', items: any[]) => {
    if (type === 'components') {
      setContext(prev => ({
        ...prev,
        siComponents: [...new Set([...prev.siComponents, ...items.map(item => item.name)])]
      }));
    } else {
      setContext(prev => ({
        ...prev,
        regulations: [...new Set([...prev.regulations, ...items.map(item => item.name)])]
      }));
    }
    setShowSuggestions(false);
  };

  // Fonction pour gérer la saisie libre du secteur
  const handleCustomSectorSubmit = () => {
    if (customSectorValue.trim()) {
      setContext(prev => ({ ...prev, sector: customSectorValue.trim() }));
      setCustomSectorValue('');
      setShowCustomSector(false);
    }
  };

  const handleCustomSectorCancel = () => {
    setCustomSectorValue('');
    setShowCustomSector(false);
  };

  // Fonction de génération de mission
  const generateMission = async () => {
    setIsGenerating(true);
    setGenerationProgress({ step: 'Initialisation...', progress: 0, isComplete: false, missionId: '', reports: [] });

    try {
      // Simulation du processus de génération avec étapes détaillées
      const steps = [
        'Analyse du contexte métier...',
        'Génération des biens essentiels (Atelier 1)...',
        'Identification des sources de risque (Atelier 2)...',
        'Création des scénarios stratégiques (Atelier 3)...',
        'Développement des scénarios opérationnels (Atelier 4)...',
        'Définition des mesures de sécurité (Atelier 5)...',
        'Génération des rapports...',
        'Finalisation de la mission...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setGenerationProgress({
          step: steps[i],
          progress: ((i + 1) / steps.length) * 100,
          isComplete: false,
          missionId: '',
          reports: []
        });

        // Simulation du temps de traitement
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Conversion du contexte pour le service
      const serviceContext = {
        organizationName: context.organizationName,
        sector: context.sector,
        organizationSize: context.organizationSize,
        geographicScope: context.geographicScope || 'national',
        criticalityLevel: context.criticalityLevel || 'high',
        siComponents: context.siComponents,
        mainTechnologies: context.mainTechnologies || [],
        externalInterfaces: [],
        sensitiveData: [],
        criticalProcesses: context.criticalProcesses,
        stakeholders: context.stakeholders,
        regulations: context.regulations,
        financialStakes: context.financialStakes,
        securityMaturity: context.securityMaturity || 'intermediate',
        pastIncidents: '',
        regulatoryConstraints: context.regulations,
        securityBudget: '',
        missionObjectives: context.missionObjectives,
        timeframe: context.timeframe || '6 months',
        specificRequirements: context.specificRequirements
      };

      // Appel au service de génération
      const service = AutoMissionGeneratorService.getInstance();
      const result = await service.generateMission(serviceContext);

      setGenerationProgress({
        step: 'Mission générée avec succès !',
        progress: 100,
        isComplete: true,
        missionId: result.missionId,
        reports: [
          'Rapport Atelier 1 - Biens essentiels',
          'Rapport Atelier 2 - Sources de risque',
          'Rapport Atelier 3 - Scénarios stratégiques',
          'Rapport Atelier 4 - Scénarios opérationnels',
          'Rapport Atelier 5 - Mesures de sécurité',
          'Rapport de synthèse exécutif'
        ]
      });

      // Redirection vers la mission créée après 2 secondes
      setTimeout(() => {
        navigate(`/missions/${result.missionId}`);
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      setGenerationProgress({
        step: 'Erreur lors de la génération',
        progress: 0,
        isComplete: false,
        missionId: '',
        reports: []
      });
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header moderne */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Générateur IA EBIOS RM
                </h1>
                <p className="text-sm text-gray-600">Créez votre mission en quelques clics</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {steps.filter((_, i) => isStepComplete(i + 1)).length}/5 complété
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stepper moderne */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                    currentStep === step.id 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : isStepComplete(step.id)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <step.icon className="h-5 w-5" />
                  <div className="hidden md:block">
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-xs opacity-75">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenu des étapes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2">
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
                      className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Secteur d'activité *</Label>

                    {/* Secteur sélectionné - TOUJOURS VISIBLE */}
                    {context.sector && (
                      <div className="mt-2 mb-3">
                        <div className="text-sm font-medium text-blue-900 mb-2">Secteur sélectionné</div>
                        <div className="p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-blue-800">{context.sector}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setContext(prev => ({ ...prev, sector: '' }))}
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Options de sélection */}
                    <div className="mt-2">
                      <div className="flex gap-2 mb-3">
                        <Button
                          type="button"
                          variant={showCustomSector ? "secondary" : "outline"}
                          onClick={() => {
                            setShowCustomSector(!showCustomSector);
                            if (showCustomSector) {
                              setCustomSectorValue('');
                            }
                          }}
                          className="flex items-center gap-2"
                        >
                          <Edit3 className="h-4 w-4" />
                          Secteur personnalisé
                        </Button>
                      </div>

                      {/* Saisie libre du secteur */}
                      {showCustomSector && (
                        <div className="mb-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                          <Label className="text-sm font-medium text-yellow-800 mb-2 block">
                            Saisissez votre secteur d'activité
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              value={customSectorValue}
                              onChange={(e) => setCustomSectorValue(e.target.value)}
                              placeholder="Ex: Épargne, Gestion de patrimoine, etc."
                              className="flex-1 border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleCustomSectorSubmit();
                                }
                              }}
                            />
                            <Button
                              type="button"
                              onClick={handleCustomSectorSubmit}
                              disabled={!customSectorValue.trim()}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleCustomSectorCancel}
                              className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Recherche dans les secteurs prédéfinis */}
                      {!showCustomSector && (
                        <>
                          <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Rechercher un secteur prédéfini..."
                              value={filters.sectorFilter}
                              onChange={(e) => setFilters(prev => ({ ...prev, sectorFilter: e.target.value }))}
                              className="pl-10 border-gray-200"
                            />
                          </div>
                          <div className="mt-3 max-h-48 overflow-y-auto space-y-2">
                            {filteredSectors.map(sector => (
                              <div
                                key={sector.id}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                  context.sector === sector.name
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setContext(prev => ({ ...prev, sector: sector.name }))}
                              >
                                <div className="font-medium text-sm">{sector.name}</div>
                                <div className="flex gap-1 mt-1">
                                  {sector.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                            {filteredSectors.length === 0 && filters.sectorFilter && (
                              <div className="text-center py-4 text-gray-500">
                                Aucun secteur trouvé pour "{filters.sectorFilter}".
                                <br />
                                <Button
                                  type="button"
                                  variant="link"
                                  onClick={() => setShowCustomSector(true)}
                                  className="text-blue-600 p-0 h-auto"
                                >
                                  Créer un secteur personnalisé
                                </Button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Taille de l'organisation *</Label>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {organizationSizes.map(size => (
                        <div
                          key={size.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            context.organizationSize === size.name
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setContext(prev => ({ ...prev, organizationSize: size.name }))}
                        >
                          <div className="font-medium text-sm">{size.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{size.employees} employés</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Étape 2: Technique */}
            {currentStep === 2 && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Cpu className="h-6 w-6 text-purple-600" />
                    Contexte Technique
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Composants SI concernés *</Label>

                    {/* Champ libre pour ajouter un composant personnalisé */}
                    <div className="mt-2">
                      <div className="flex gap-2 mb-3">
                        <Input
                          placeholder="Ajouter un composant personnalisé..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = (e.target as HTMLInputElement).value;
                              if (value.trim()) {
                                handleArrayAdd('siComponents', value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                          className="flex-1 border-gray-200"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => {
                            const input = (e.target as HTMLElement).parentElement?.querySelector('input');
                            if (input?.value.trim()) {
                              handleArrayAdd('siComponents', input.value);
                              input.value = '';
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Composants sélectionnés - TOUJOURS VISIBLE */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-purple-900 mb-2">
                        Composants sélectionnés ({context.siComponents.length})
                      </div>
                      <div className="min-h-[60px] p-3 bg-purple-50 rounded-lg border-2 border-dashed border-purple-200">
                        {context.siComponents.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {context.siComponents.map((component, index) => (
                              <div
                                key={`${component}-${index}`}
                                className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 cursor-pointer hover:bg-purple-200 transition-colors"
                                onClick={() => handleArrayRemove('siComponents', component)}
                              >
                                {component}
                                <X className="h-3 w-3 ml-1 hover:text-red-600" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-purple-600 italic">
                            Aucun composant sélectionné. Choisissez dans la liste ou ajoutez-en un personnalisé.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recherche dans les composants prédéfinis */}
                    <div>
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Rechercher dans les composants prédéfinis..."
                          value={filters.techFilter}
                          onChange={(e) => setFilters(prev => ({ ...prev, techFilter: e.target.value }))}
                          className="pl-10 border-gray-200"
                        />
                      </div>

                      {/* Liste des composants prédéfinis */}
                      <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-2 bg-gray-50">
                        {filteredComponents.length > 0 ? (
                          filteredComponents.map(component => {
                            const isSelected = context.siComponents.includes(component.name);
                            return (
                              <div
                                key={component.id}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                  isSelected
                                    ? 'border-purple-500 bg-purple-100'
                                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                                }`}
                                onClick={() => handleArrayToggle('siComponents', component.name)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium text-sm flex items-center gap-2">
                                      {component.name}
                                      {isSelected && <CheckCircle2 className="h-4 w-4 text-purple-600" />}
                                    </div>
                                    <div className="flex gap-1 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {component.category}
                                      </Badge>
                                      {component.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  {!isSelected && <Plus className="h-4 w-4 text-purple-600" />}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            Aucun composant trouvé pour "{filters.techFilter}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Étape 3: Processus */}
            {currentStep === 3 && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Target className="h-6 w-6 text-green-600" />
                    Processus Métier
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Processus critiques */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Processus critiques *</Label>

                    {/* Champ libre pour ajouter un processus */}
                    <div className="mt-2">
                      <div className="flex gap-2 mb-3">
                        <Input
                          id="processInput"
                          placeholder="Ajouter un processus critique..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const value = (e.target as HTMLInputElement).value;
                              if (value.trim()) {
                                handleArrayAdd('criticalProcesses', value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                          className="flex-1 border-gray-200"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => {
                            e.preventDefault();
                            const button = e.currentTarget;
                            const input = button.parentElement?.querySelector('input') as HTMLInputElement;
                            if (input?.value.trim()) {
                              handleArrayAdd('criticalProcesses', input.value);
                              input.value = '';
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Processus sélectionnés */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-green-900 mb-2">
                        Processus définis ({context.criticalProcesses.length})
                      </div>
                      <div className="min-h-[60px] p-3 bg-green-50 rounded-lg border-2 border-dashed border-green-200">
                        {context.criticalProcesses.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {context.criticalProcesses.map((process, index) => (
                              <div
                                key={`${process}-${index}`}
                                className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 cursor-pointer hover:bg-green-200 transition-colors"
                                onClick={() => handleArrayRemove('criticalProcesses', process)}
                              >
                                {process}
                                <X className="h-3 w-3 ml-1 hover:text-red-600" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-green-600 italic">
                            Aucun processus défini. Ajoutez vos processus critiques.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Parties prenantes */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Parties prenantes</Label>

                    {/* Champ libre pour ajouter une partie prenante */}
                    <div className="mt-2">
                      <div className="flex gap-2 mb-3">
                        <Input
                          id="stakeholderInput"
                          placeholder="Ajouter une partie prenante..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const value = (e.target as HTMLInputElement).value;
                              if (value.trim()) {
                                handleArrayAdd('stakeholders', value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                          className="flex-1 border-gray-200"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => {
                            e.preventDefault();
                            const button = e.currentTarget;
                            const input = button.parentElement?.querySelector('input') as HTMLInputElement;
                            if (input?.value.trim()) {
                              handleArrayAdd('stakeholders', input.value);
                              input.value = '';
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Parties prenantes sélectionnées */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-blue-900 mb-2">
                        Parties prenantes ({context.stakeholders.length})
                      </div>
                      <div className="min-h-[60px] p-3 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200">
                        {context.stakeholders.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {context.stakeholders.map((stakeholder, index) => (
                              <div
                                key={`${stakeholder}-${index}`}
                                className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors"
                                onClick={() => handleArrayRemove('stakeholders', stakeholder)}
                              >
                                {stakeholder}
                                <X className="h-3 w-3 ml-1 hover:text-red-600" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-blue-600 italic">
                            Aucune partie prenante définie. Ajoutez les acteurs impliqués.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Enjeux financiers</Label>
                    <Input
                      value={context.financialStakes}
                      onChange={(e) => setContext(prev => ({ ...prev, financialStakes: e.target.value }))}
                      placeholder="Ex: CA 500M€, Budget IT 50M€"
                      className="mt-2 border-gray-200 focus:border-green-500 focus:ring-green-500"
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
                    <Shield className="h-6 w-6 text-red-600" />
                    Conformité et Sécurité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Réglementations applicables *</Label>

                    {/* Champ libre pour ajouter une réglementation personnalisée */}
                    <div className="mt-2">
                      <div className="flex gap-2 mb-3">
                        <Input
                          placeholder="Ajouter une réglementation personnalisée..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = (e.target as HTMLInputElement).value;
                              if (value.trim()) {
                                handleArrayAdd('regulations', value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                          className="flex-1 border-gray-200"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => {
                            e.preventDefault();
                            const button = e.currentTarget;
                            const input = button.parentElement?.querySelector('input') as HTMLInputElement;
                            if (input?.value.trim()) {
                              handleArrayAdd('regulations', input.value);
                              input.value = '';
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Réglementations sélectionnées - TOUJOURS VISIBLE */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-red-900 mb-2">
                        Réglementations sélectionnées ({context.regulations.length})
                      </div>
                      <div className="min-h-[60px] p-3 bg-red-50 rounded-lg border-2 border-dashed border-red-200">
                        {context.regulations.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {context.regulations.map((regulation, index) => (
                              <div
                                key={`${regulation}-${index}`}
                                className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 cursor-pointer hover:bg-red-200 transition-colors"
                                onClick={() => handleArrayRemove('regulations', regulation)}
                              >
                                {regulation}
                                <X className="h-3 w-3 ml-1 hover:text-red-600" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-red-600 italic">
                            Aucune réglementation sélectionnée. Choisissez dans la liste ou ajoutez-en une personnalisée.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recherche dans les réglementations prédéfinies */}
                    <div>
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Rechercher dans les réglementations prédéfinies..."
                          value={filters.regFilter}
                          onChange={(e) => setFilters(prev => ({ ...prev, regFilter: e.target.value }))}
                          className="pl-10 border-gray-200"
                        />
                      </div>

                      {/* Liste des réglementations prédéfinies */}
                      <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-2 bg-gray-50">
                        {filteredRegulations.length > 0 ? (
                          filteredRegulations.map(regulation => {
                            const isSelected = context.regulations.includes(regulation.name);
                            return (
                              <div
                                key={regulation.id}
                                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                  isSelected
                                    ? 'border-red-500 bg-red-100'
                                    : regulation.mandatory
                                    ? 'border-red-300 bg-red-50 hover:bg-red-100'
                                    : 'border-gray-200 hover:border-red-300 hover:bg-red-50'
                                }`}
                                onClick={() => handleArrayToggle('regulations', regulation.name)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-medium text-sm flex items-center gap-2">
                                      {regulation.name}
                                      {isSelected && <CheckCircle2 className="h-4 w-4 text-red-600" />}
                                      {regulation.mandatory && (
                                        <Badge variant="destructive" className="text-xs">
                                          Obligatoire
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex gap-1 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        {regulation.category}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {regulation.scope}
                                      </Badge>
                                    </div>
                                  </div>
                                  {!isSelected && <Plus className="h-4 w-4 text-red-600" />}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-4 text-gray-500">
                            Aucune réglementation trouvée pour "{filters.regFilter}"
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Étape 5: Objectifs */}
            {currentStep === 5 && (
              <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                    Objectifs de la Mission
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Objectifs principaux *</Label>

                    {/* Champ libre pour ajouter un objectif personnalisé */}
                    <div className="mt-2">
                      <div className="flex gap-2 mb-3">
                        <Input
                          placeholder="Ajouter un objectif personnalisé..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = (e.target as HTMLInputElement).value;
                              if (value.trim()) {
                                handleArrayAdd('missionObjectives', value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                          className="flex-1 border-gray-200"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => {
                            e.preventDefault();
                            const button = e.currentTarget;
                            const input = button.parentElement?.querySelector('input') as HTMLInputElement;
                            if (input?.value.trim()) {
                              handleArrayAdd('missionObjectives', input.value);
                              input.value = '';
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Objectifs sélectionnés */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-orange-900 mb-2">
                        Objectifs sélectionnés ({context.missionObjectives.length})
                      </div>
                      <div className="min-h-[60px] p-3 bg-orange-50 rounded-lg border-2 border-dashed border-orange-200">
                        {context.missionObjectives.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {context.missionObjectives.map((objective, index) => (
                              <div
                                key={`${objective}-${index}`}
                                className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 cursor-pointer hover:bg-orange-200 transition-colors"
                                onClick={() => handleArrayRemove('missionObjectives', objective)}
                              >
                                {objective}
                                <X className="h-3 w-3 ml-1 hover:text-red-600" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-orange-600 italic">
                            Aucun objectif sélectionné. Choisissez dans la liste ou ajoutez-en un personnalisé.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Objectifs prédéfinis */}
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-3">Objectifs prédéfinis</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          'Évaluation des risques cyber',
                          'Conformité réglementaire',
                          'Plan de traitement des risques',
                          'Amélioration de la posture sécurité',
                          'Sensibilisation des équipes',
                          'Audit de sécurité complet'
                        ].map(objective => {
                          const isSelected = context.missionObjectives.includes(objective);
                          return (
                            <div
                              key={objective}
                              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-orange-500 bg-orange-100'
                                  : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                              }`}
                              onClick={() => handleArrayToggle('missionObjectives', objective)}
                            >
                              <div className="font-medium text-sm flex items-center gap-2">
                                {objective}
                                {isSelected && <CheckCircle2 className="h-4 w-4 text-orange-600" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Exigences spécifiques</Label>
                    <Textarea
                      value={context.specificRequirements}
                      onChange={(e) => setContext(prev => ({ ...prev, specificRequirements: e.target.value }))}
                      placeholder="Décrivez toute exigence particulière ou contexte spécifique"
                      rows={4}
                      className="mt-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  {/* Bouton de génération */}
                  <div className="pt-6 border-t">
                    <Button
                      onClick={generateMission}
                      disabled={!isStepComplete(5) || isGenerating}
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-medium disabled:opacity-50"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      {isGenerating ? 'Génération en cours...' : 'Générer la Mission Complète'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Précédent
              </Button>
              <Button
                onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                disabled={!isStepComplete(currentStep)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Suivant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Panneau latéral avec suggestions */}
          <div className="space-y-6">
            {/* Résumé en temps réel */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Résumé
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {context.organizationName && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Organisation</div>
                    <div className="font-medium">{context.organizationName}</div>
                  </div>
                )}
                {context.sector && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Secteur</div>
                    <div className="font-medium">{context.sector}</div>
                  </div>
                )}
                {context.siComponents.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Composants SI</div>
                    <div className="text-sm">{context.siComponents.length} sélectionnés</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Suggestions intelligentes */}
            {suggestions && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    Suggestions IA
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {suggestions.components.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Composants recommandés</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applySuggestion('components', suggestions.components.slice(0, 3))}
                        className="w-full"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Ajouter {suggestions.components.slice(0, 3).length} composants
                      </Button>
                    </div>
                  )}
                  {suggestions.regulations.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Réglementations applicables</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applySuggestion('regulations', suggestions.regulations.slice(0, 3))}
                        className="w-full"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Ajouter {suggestions.regulations.slice(0, 3).length} réglementations
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modal de progression de génération */}
      <Dialog open={isGenerating} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Génération de la Mission EBIOS RM
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-6">
            <div className="text-sm text-gray-600">
              {generationProgress.step}
            </div>
            <Progress value={generationProgress.progress} className="w-full" />
            <div className="text-xs text-gray-500">
              {Math.round(generationProgress.progress)}% complété
            </div>

            {generationProgress.isComplete && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">Mission créée avec succès !</span>
                </div>
                <div className="text-sm text-gray-600">
                  ID de la mission: {generationProgress.missionId}
                </div>
                <div className="text-sm text-gray-600">
                  Redirection en cours...
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModernAutoMissionGenerator;
