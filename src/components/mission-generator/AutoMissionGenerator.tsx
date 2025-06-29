/**
 * 🤖 GÉNÉRATEUR AUTOMATIQUE DE MISSIONS EBIOS RM
 * Interface pour créer des missions complètes à partir du contexte métier
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Zap, FileText, Download, CheckCircle, Edit3, Check, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AutoMissionGeneratorService, { MissionContext as ServiceMissionContext } from '@/services/ai/AutoMissionGeneratorService';

interface MissionContext {
  // Informations organisationnelles
  organizationName: string;
  sector: string;
  organizationSize: string;
  geographicScope: string;
  criticalityLevel: string;
  
  // Contexte technique
  siComponents: string[];
  mainTechnologies: string[];
  externalInterfaces: string[];
  sensitiveData: string[];
  
  // Processus métier
  criticalProcesses: string[];
  stakeholders: string[];
  regulations: string[];
  financialStakes: string;
  
  // Contexte sécurité
  securityMaturity: string;
  pastIncidents: string;
  regulatoryConstraints: string[];
  securityBudget: string;
  
  // Objectifs de la mission
  missionObjectives: string[];
  timeframe: string;
  specificRequirements: string;
}

interface GenerationProgress {
  step: string;
  progress: number;
  isComplete: boolean;
  missionId?: string;
  reports?: string[];
}

const AutoMissionGenerator: React.FC = () => {
  const [context, setContext] = useState<MissionContext>({
    organizationName: '',
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
    specificRequirements: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [showCustomSector, setShowCustomSector] = useState(false);
  const [customSectorValue, setCustomSectorValue] = useState('');
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    step: '',
    progress: 0,
    isComplete: false
  });

  const sectors = [
    // SECTEUR PUBLIC
    'Administration centrale (Ministères, Préfectures)',
    'Collectivités territoriales (Régions, Départements, Communes)',
    'Établissements publics de santé (CHU, CHR, Hôpitaux)',
    'Éducation nationale et enseignement supérieur',
    'Justice et services pénitentiaires',
    'Défense et sécurité nationale',
    'Services sociaux et médico-sociaux publics',
    'Organismes de sécurité sociale (CPAM, CAF, URSSAF)',
    'Établissements publics de recherche (CNRS, INRIA, CEA)',
    'Services publics de l\'emploi (Pôle Emploi)',

    // SANTÉ ET MÉDICO-SOCIAL
    'Santé - Établissements hospitaliers privés',
    'Santé - Cliniques et centres médicaux',
    'Santé - Laboratoires d\'analyses médicales',
    'Santé - Pharmacies et officines',
    'Santé - Industrie pharmaceutique',
    'Santé - Dispositifs médicaux et biotechnologies',
    'Santé - Télémédecine et e-santé',
    'Médico-social - EHPAD et maisons de retraite',
    'Médico-social - Centres de soins spécialisés',
    'Médico-social - Services d\'aide à domicile',

    // SERVICES FINANCIERS COMPLETS
    'Banques de détail et commerciales',
    'Banques d\'investissement et de marché',
    'Banques coopératives et mutualistes',
    'Assurances vie et non-vie',
    'Mutuelles et institutions de prévoyance',
    'Sociétés de gestion d\'actifs',
    'Épargne et placement financier',
    'Fonds de pension et retraite',
    'Fintech et néobanques',
    'Services de paiement et monétique',
    'Courtage et intermédiation financière',
    'Crédit-bail et affacturage',

    // INDUSTRIE ET MANUFACTURING
    'Industrie automobile',
    'Industrie aéronautique et spatiale',
    'Industrie navale et maritime',
    'Industrie chimique et pétrochimique',
    'Industrie pharmaceutique et cosmétique',
    'Industrie agroalimentaire',
    'Industrie textile et habillement',
    'Industrie du bois et papier',
    'Métallurgie et sidérurgie',
    'Industrie électronique et composants',
    'Industrie des machines et équipements',
    'Industrie du verre et matériaux',

    // ÉNERGIE ET UTILITIES
    'Production d\'électricité (nucléaire, renouvelable)',
    'Transport et distribution d\'électricité',
    'Production et distribution de gaz',
    'Pétrole et raffinerie',
    'Énergies renouvelables (éolien, solaire)',
    'Services énergétiques et efficacité',
    'Distribution d\'eau et assainissement',
    'Gestion des déchets et recyclage',

    // TRANSPORT ET LOGISTIQUE
    'Transport ferroviaire (SNCF, opérateurs privés)',
    'Transport aérien (compagnies, aéroports)',
    'Transport maritime et fluvial',
    'Transport routier de marchandises',
    'Transport urbain et interurbain',
    'Logistique et entreposage',
    'Messagerie et livraison',
    'Location de véhicules',

    // TÉLÉCOMMUNICATIONS ET MÉDIAS
    'Opérateurs télécoms fixes et mobiles',
    'Fournisseurs d\'accès Internet',
    'Équipementiers télécoms',
    'Médias et audiovisuel',
    'Presse et édition',
    'Publicité et communication',
    'Production cinématographique',

    // TECHNOLOGIES ET NUMÉRIQUE
    'Éditeurs de logiciels',
    'Services informatiques et conseil',
    'Hébergement et cloud computing',
    'Cybersécurité',
    'Intelligence artificielle et data science',
    'Développement web et mobile',
    'Jeux vidéo et divertissement numérique',
    'Blockchain et cryptomonnaies',
    'IoT et objets connectés',

    // COMMERCE ET DISTRIBUTION
    'Grande distribution alimentaire',
    'Grande distribution spécialisée',
    'Commerce de détail traditionnel',
    'E-commerce et marketplaces',
    'Grossistes et distributeurs',
    'Franchises et réseaux',
    'Centres commerciaux',

    // IMMOBILIER ET CONSTRUCTION
    'Promotion immobilière',
    'Gestion immobilière et syndics',
    'Construction et BTP',
    'Architecture et ingénierie',
    'Aménagement et urbanisme',
    'Immobilier commercial',

    // SERVICES AUX ENTREPRISES
    'Conseil en management',
    'Audit et expertise comptable',
    'Services juridiques',
    'Ressources humaines et recrutement',
    'Marketing et études de marché',
    'Sécurité privée',
    'Nettoyage et services généraux',
    'Restauration collective',

    // TOURISME ET LOISIRS
    'Hôtellerie et hébergement',
    'Restauration et cafés',
    'Agences de voyage et tour-opérateurs',
    'Parcs d\'attractions et loisirs',
    'Sports et fitness',
    'Culture et spectacles',

    // AGRICULTURE ET AGROALIMENTAIRE
    'Agriculture et élevage',
    'Coopératives agricoles',
    'Industrie agroalimentaire',
    'Viticulture et spiritueux',
    'Pêche et aquaculture',
    'Sylviculture et exploitation forestière',

    // SECTEURS ÉMERGENTS
    'Économie sociale et solidaire',
    'Startups et scale-ups',
    'Incubateurs et accélérateurs',
    'Fonds d\'investissement et capital-risque',
    'Plateformes collaboratives',
    'Économie circulaire',
    'Transition écologique et développement durable'
  ];

  const organizationSizes = [
    'Micro-entreprise (1-9 employés)',
    'Très petite entreprise - TPE (10-19 employés)',
    'Petite entreprise - PE (20-49 employés)',
    'Moyenne entreprise - ME (50-249 employés)',
    'Entreprise de taille intermédiaire - ETI (250-4999 employés)',
    'Grande entreprise - GE (5000+ employés)',
    'Groupe international (50000+ employés)',
    'Administration centrale (Ministère, Direction générale)',
    'Établissement public national',
    'Région (Conseil régional)',
    'Département (Conseil départemental)',
    'Intercommunalité (Métropole, Communauté)',
    'Commune (< 10000 habitants)',
    'Commune (10000-100000 habitants)',
    'Commune (> 100000 habitants)',
    'Établissement public de santé',
    'Université ou grande école',
    'Organisme de recherche',
    'Association (< 50 employés)',
    'Association (50-500 employés)',
    'Association (> 500 employés)',
    'Fondation',
    'Coopérative',
    'Mutuelle',
    'Syndicat professionnel'
  ];

  const siComponentsOptions = [
    // SYSTÈMES DE GESTION D'ENTREPRISE
    'ERP - SAP (S/4HANA, ECC)',
    'ERP - Oracle (Fusion, E-Business Suite)',
    'ERP - Microsoft Dynamics',
    'ERP - Sage (X3, 100)',
    'ERP - Sectoriels (Cegid, Divalto)',
    'CRM - Salesforce',
    'CRM - Microsoft Dynamics CRM',
    'CRM - HubSpot, Pipedrive',
    'CRM - Solutions sectorielles',
    'Gestion documentaire (SharePoint, Alfresco)',
    'Workflow et BPM (Bonita, Activiti)',
    'Gestion de projet (Jira, Monday, Asana)',

    // INFRASTRUCTURE ET CLOUD
    'Infrastructure Cloud - AWS',
    'Infrastructure Cloud - Microsoft Azure',
    'Infrastructure Cloud - Google Cloud Platform',
    'Infrastructure Cloud - OVHcloud',
    'Infrastructure Cloud - Scaleway',
    'Cloud hybride et multi-cloud',
    'Conteneurisation (Docker, Kubernetes)',
    'Virtualisation (VMware, Hyper-V)',
    'Stockage SAN/NAS',
    'Sauvegarde et archivage',
    'CDN et réseaux de diffusion',

    // SYSTÈMES MÉTIER SPÉCIALISÉS
    'Systèmes bancaires (Core Banking)',
    'Systèmes d\'assurance',
    'Systèmes hospitaliers (SIH)',
    'Dossier médical partagé (DMP)',
    'Systèmes de laboratoire (LIMS)',
    'Systèmes de pharmacie',
    'Systèmes éducatifs (ENT, LMS)',
    'Systèmes RH et paie',
    'Systèmes comptables et financiers',
    'Systèmes de facturation',
    'Systèmes de caisse et TPV',

    // SYSTÈMES INDUSTRIELS ET IoT
    'SCADA et supervision industrielle',
    'Automates programmables (PLC)',
    'Systèmes de contrôle-commande',
    'MES (Manufacturing Execution System)',
    'GMAO (Gestion maintenance)',
    'WMS (Warehouse Management)',
    'TMS (Transport Management)',
    'IoT et capteurs connectés',
    'Systèmes embarqués',
    'Robotique industrielle',

    // SYSTÈMES DE COMMUNICATION
    'Messagerie (Exchange, Gmail)',
    'Collaboration (Teams, Slack, Zoom)',
    'Téléphonie IP (ToIP)',
    'Visioconférence',
    'Intranet et portails',
    'Réseaux sociaux d\'entreprise',
    'Systèmes de diffusion',

    // SÉCURITÉ ET IDENTITÉ
    'Active Directory / LDAP',
    'Systèmes IAM (Identity Management)',
    'SSO (Single Sign-On)',
    'PKI (Infrastructure à clés publiques)',
    'Antivirus et EDR',
    'SIEM (Security Information)',
    'Firewall et UTM',
    'VPN et accès distant',
    'Chiffrement et HSM',
    'Gestion des privilèges (PAM)',

    // DONNÉES ET ANALYTICS
    'Entrepôts de données (Data Warehouse)',
    'Lacs de données (Data Lake)',
    'Business Intelligence (Power BI, Tableau)',
    'Big Data (Hadoop, Spark)',
    'Intelligence artificielle / ML',
    'Analytics temps réel',
    'ETL et intégration de données',
    'Bases de données relationnelles',
    'Bases de données NoSQL',
    'Systèmes décisionnels',

    // E-COMMERCE ET DIGITAL
    'Plateformes e-commerce (Magento, Shopify)',
    'Marketplaces (Amazon, eBay)',
    'CMS (WordPress, Drupal)',
    'Applications mobiles natives',
    'Applications web progressives (PWA)',
    'APIs et microservices',
    'Systèmes de paiement en ligne',
    'Gestion de contenu digital',
    'Marketing automation',
    'Personnalisation et recommandation',

    // SYSTÈMES FINANCIERS
    'Systèmes de paiement (SEPA, cartes)',
    'Trading et marchés financiers',
    'Gestion des risques financiers',
    'Conformité et reporting réglementaire',
    'Blockchain et cryptomonnaies',
    'Systèmes de crédit et scoring',
    'Assurance et actuariat',
    'Comptabilité analytique',

    // SYSTÈMES DE TRANSPORT
    'Systèmes de billettique',
    'Gestion de flotte',
    'Systèmes de navigation (GPS)',
    'Contrôle du trafic',
    'Systèmes aéroportuaires',
    'Systèmes ferroviaires',
    'Systèmes portuaires',
    'Logistique et supply chain',

    // SYSTÈMES PUBLICS
    'Systèmes électoraux',
    'État civil et population',
    'Systèmes fiscaux',
    'Systèmes judiciaires',
    'Systèmes pénitentiaires',
    'Systèmes d\'urgence (112, SAMU)',
    'Systèmes de sécurité publique',
    'Systèmes environnementaux',

    // SYSTÈMES ÉMERGENTS
    'Réalité virtuelle / augmentée',
    'Impression 3D',
    'Drones et véhicules autonomes',
    'Edge computing',
    ' 5G et réseaux avancés',
    'Quantum computing',
    'Systèmes distribués',
    'Plateformes low-code/no-code'
  ];

  const technologiesOptions = [
    // SUITES BUREAUTIQUES ET COLLABORATION
    'Microsoft 365 / Office 365',
    'Google Workspace',
    'LibreOffice / OpenOffice',
    'Zimbra Collaboration',
    'Nextcloud / ownCloud',

    // SYSTÈMES D'EXPLOITATION
    'Windows Server (2016, 2019, 2022)',
    'Linux (RHEL, Ubuntu, SUSE)',
    'Unix (AIX, Solaris)',
    'macOS Server',
    'Systèmes embarqués (Embedded Linux)',

    // VIRTUALISATION ET CONTENEURS
    'VMware vSphere',
    'Microsoft Hyper-V',
    'Citrix XenServer',
    'KVM / QEMU',
    'Docker',
    'Kubernetes',
    'OpenShift',
    'Rancher',

    // BASES DE DONNÉES
    'Oracle Database',
    'Microsoft SQL Server',
    'MySQL / MariaDB',
    'PostgreSQL',
    'MongoDB',
    'Cassandra',
    'Redis',
    'Elasticsearch',
    'SAP HANA',
    'IBM Db2',

    // DÉVELOPPEMENT ET INTÉGRATION
    'Java / J2EE',
    '.NET Framework / .NET Core',
    'Python',
    'Node.js',
    'PHP',
    'Angular / React / Vue.js',
    'APIs REST / GraphQL',
    'Microservices',
    'ESB (Enterprise Service Bus)',
    'Apache Kafka',

    // SÉCURITÉ
    'Active Directory',
    'LDAP / OpenLDAP',
    'Kerberos',
    'SAML / OAuth',
    'PKI / Certificats',
    'Antivirus (Symantec, McAfee, Trend Micro)',
    'Firewall (Fortinet, Palo Alto, Cisco)',
    'SIEM (Splunk, QRadar, ArcSight)',
    'Vulnerability Management',

    // RÉSEAUX ET TÉLÉCOMS
    'Cisco (Routeurs, Switches)',
    'Juniper Networks',
    'F5 Load Balancers',
    'SD-WAN',
    'MPLS',
    'VPN (IPSec, SSL)',
    'Wi-Fi (Cisco, Aruba)',
    'Téléphonie IP',

    // CLOUD ET DEVOPS
    'Amazon Web Services (AWS)',
    'Microsoft Azure',
    'Google Cloud Platform',
    'Terraform',
    'Ansible',
    'Jenkins',
    'GitLab CI/CD',
    'Prometheus / Grafana',
    'ELK Stack',

    // SYSTÈMES MAINFRAME
    'IBM z/OS',
    'COBOL',
    'CICS',
    'IMS',
    'DB2 for z/OS',

    // TECHNOLOGIES ÉMERGENTES
    'Intelligence Artificielle (TensorFlow, PyTorch)',
    'Machine Learning',
    'Blockchain (Ethereum, Hyperledger)',
    'IoT (Arduino, Raspberry Pi)',
    'RPA (UiPath, Blue Prism, Automation Anywhere)',
    'Réalité Virtuelle / Augmentée',
    'Edge Computing',
    'Quantum Computing',

    // OUTILS DE GESTION
    'ITSM (ServiceNow, Remedy)',
    'Monitoring (Nagios, Zabbix, PRTG)',
    'Backup (Veeam, Commvault, NetBackup)',
    'Antispam / Antimalware',
    'DLP (Data Loss Prevention)',
    'CASB (Cloud Access Security Broker)'
  ];

  const regulationsOptions = [
    // RÉGLEMENTATIONS EUROPÉENNES
    'RGPD (Règlement Général sur la Protection des Données)',
    'NIS2 (Network and Information Security Directive)',
    'DORA (Digital Operational Resilience Act)',
    'AI Act (Artificial Intelligence Act)',
    'DSA (Digital Services Act)',
    'DMA (Digital Markets Act)',
    'eIDAS (Electronic Identification and Trust Services)',
    'PSD2 (Payment Services Directive)',
    'GDPR (pour organisations internationales)',
    'MiCA (Markets in Crypto-Assets)',
    'Directive Machine',
    'RoHS / REACH',

    // RÉGLEMENTATIONS FRANÇAISES - SÉCURITÉ
    'ANSSI - RGS (Référentiel Général de Sécurité)',
    'ANSSI - PGSSI-S (Politique Générale de Sécurité)',
    'LPM (Loi de Programmation Militaire)',
    'Code de la Défense',
    'Instruction Générale Interministérielle (IGI) 1300',
    'Visa de sécurité ANSSI',
    'Qualification ANSSI',
    'SecNumCloud',

    // RÉGLEMENTATIONS FRANÇAISES - DONNÉES
    'Loi Informatique et Libertés',
    'Code des relations entre le public et l\'administration',
    'Loi pour une République numérique',
    'Loi de confiance dans l\'économie numérique (LCEN)',
    'Code de la consommation (numérique)',

    // SECTEUR SANTÉ
    'HDS (Hébergement de Données de Santé)',
    'Code de la santé publique',
    'Référentiel de sécurité PGSSI-S',
    'Certification HDS',
    'RGPD Santé',
    'Règlement MDR (Dispositifs médicaux)',
    'Règlement IVDR (Dispositifs de diagnostic in vitro)',
    'Pharmacovigilance',
    'Hémovigilance',
    'Loi Kouchner (droits des malades)',

    // SECTEUR FINANCIER
    'Code monétaire et financier',
    'ACPR (Autorité de Contrôle Prudentiel)',
    'AMF (Autorité des Marchés Financiers)',
    'Solvabilité II',
    'Bâle III / IV',
    'MiFID II',
    'EMIR (European Market Infrastructure Regulation)',
    'PCI-DSS (Payment Card Industry)',
    'FATCA / CRS',
    'Lutte anti-blanchiment (LAB-FT)',
    'KYC (Know Your Customer)',

    // SECTEUR PUBLIC
    'Code général des collectivités territoriales',
    'Ordonnance 2005-1516 (marchés publics)',
    'Décret 2019-536 (système d\'information de l\'État)',
    'Référentiel Marianne',
    'Accessibilité numérique (RGAA)',
    'Transparence et réutilisation des données publiques',
    'Service public numérique',

    // SECTEUR ÉDUCATION
    'Code de l\'éducation',
    'RGPD Éducation',
    'Protection de l\'enfance numérique',
    'Données personnelles des mineurs',
    'ENT (Espaces Numériques de Travail)',

    // SECTEUR ÉNERGIE
    'Code de l\'énergie',
    'Directive européenne sur la sécurité des réseaux',
    'Réglementation nucléaire (ASN)',
    'Transition énergétique',
    'Smart grids',

    // SECTEUR TRANSPORT
    'Code des transports',
    'Réglementation aéronautique (DGAC, EASA)',
    'Réglementation ferroviaire (EPSF)',
    'Réglementation maritime',
    'Véhicules autonomes',
    'Drones civils',

    // SECTEUR TÉLÉCOMS
    'Code des postes et communications électroniques',
    'ARCEP (Autorité de Régulation)',
    'Portabilité des numéros',
    'Neutralité du net',
    'Roaming européen',

    // NORMES INTERNATIONALES
    'ISO 27001 (Management de la sécurité)',
    'ISO 27002 (Bonnes pratiques sécurité)',
    'ISO 27005 (Gestion des risques)',
    'ISO 22301 (Continuité d\'activité)',
    'ISO 20000 (Management des services IT)',
    'ITIL (Information Technology Infrastructure Library)',
    'COBIT (Control Objectives for IT)',
    'NIST Cybersecurity Framework',
    'SOX (Sarbanes-Oxley Act)',
    'HIPAA (Health Insurance Portability)',
    'FISMA (Federal Information Security)',

    // SECTEURS SPÉCIALISÉS
    'Agroalimentaire (HACCP, IFS, BRC)',
    'Automobile (ISO/TS 16949)',
    'Aéronautique (EN 9100)',
    'Défense (ISO 21500)',
    'Environnement (ISO 14001)',
    'Qualité (ISO 9001)',
    'Développement durable (ISO 26000)',

    // RÉGLEMENTATIONS ÉMERGENTES
    'Souveraineté numérique',
    'Cloud de confiance',
    'Cyberscore',
    'Certification cybersécurité',
    'Éthique de l\'IA',
    'Algorithmes publics',
    'Plateformes numériques',
    'Économie circulaire numérique'
  ];

  const handleArrayFieldChange = (field: keyof MissionContext, value: string, checked: boolean) => {
    setContext(prev => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
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

  const generateMission = async () => {
    setIsGenerating(true);
    setGenerationProgress({ step: 'Initialisation...', progress: 0, isComplete: false });

    try {
      // Simulation du processus de génération
      const steps = [
        'Analyse du contexte métier...',
        'Génération des biens essentiels...',
        'Identification des sources de risque...',
        'Création des scénarios stratégiques...',
        'Développement des scénarios opérationnels...',
        'Définition des mesures de sécurité...',
        'Génération des rapports...',
        'Finalisation de la mission...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setGenerationProgress({
          step: steps[i],
          progress: ((i + 1) / steps.length) * 100,
          isComplete: false
        });
        
        // Simulation du temps de traitement
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Appel au service de génération (à implémenter)
      const missionId = await generateMissionFromContext(context);

      setGenerationProgress({
        step: 'Mission générée avec succès !',
        progress: 100,
        isComplete: true,
        missionId,
        reports: [
          'Rapport Atelier 1 - Biens essentiels',
          'Rapport Atelier 2 - Sources de risque',
          'Rapport Atelier 3 - Scénarios stratégiques',
          'Rapport Atelier 4 - Scénarios opérationnels',
          'Rapport Atelier 5 - Mesures de sécurité',
          'Rapport de synthèse exécutif'
        ]
      });

    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      setGenerationProgress({
        step: 'Erreur lors de la génération',
        progress: 0,
        isComplete: false
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMissionFromContext = async (context: MissionContext): Promise<string> => {
    const service = AutoMissionGeneratorService.getInstance();
    const result = await service.generateMission(context as ServiceMissionContext);
    return result.missionId;
  };

  const isFormValid = () => {
    return context.organizationName && 
           context.sector && 
           context.organizationSize &&
           context.siComponents.length > 0 &&
           context.criticalProcesses.length > 0;
  };

  if (isGenerating || generationProgress.isComplete) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-blue-600" />
              Génération Automatique de Mission EBIOS RM
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-lg font-medium">{generationProgress.step}</div>
              <Progress value={generationProgress.progress} className="w-full" />
              <div className="text-sm text-gray-600">
                {generationProgress.progress.toFixed(0)}% terminé
              </div>
            </div>

            {generationProgress.isComplete && (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Mission générée avec succès ! ID: {generationProgress.missionId}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <h3 className="font-medium">Rapports générés :</h3>
                  {generationProgress.reports?.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {report}
                      </span>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => window.location.href = `/missions/${generationProgress.missionId}`}>
                    Voir la mission
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setGenerationProgress({ step: '', progress: 0, isComplete: false });
                    setContext({
                      organizationName: '',
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
                      specificRequirements: ''
                    });
                  }}>
                    Nouvelle génération
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-600" />
            Générateur Automatique de Mission EBIOS RM
          </CardTitle>
          <p className="text-gray-600">
            Saisissez le contexte de votre organisation pour générer automatiquement une mission EBIOS RM complète avec tous les ateliers et rapports.
          </p>
        </CardHeader>
      </Card>

      {/* Formulaire de contexte complet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Informations organisationnelles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations Organisationnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="orgName">Nom de l'organisation *</Label>
              <Input
                id="orgName"
                value={context.organizationName}
                onChange={(e) => setContext(prev => ({ ...prev, organizationName: e.target.value }))}
                placeholder="Ex: Hôpital Universitaire de Paris"
              />
            </div>

            <div>
              <Label htmlFor="sector">Secteur d'activité *</Label>
              <Select value={context.sector} onValueChange={(value) => setContext(prev => ({ ...prev, sector: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un secteur" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map(sector => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="orgSize">Taille de l'organisation *</Label>
              <Select value={context.organizationSize} onValueChange={(value) => setContext(prev => ({ ...prev, organizationSize: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez la taille" />
                </SelectTrigger>
                <SelectContent>
                  {organizationSizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="geoScope">Périmètre géographique</Label>
              <Input
                id="geoScope"
                value={context.geographicScope}
                onChange={(e) => setContext(prev => ({ ...prev, geographicScope: e.target.value }))}
                placeholder="Ex: National, Régional, International"
              />
            </div>

            <div>
              <Label htmlFor="criticality">Niveau de criticité</Label>
              <Select value={context.criticalityLevel} onValueChange={(value) => setContext(prev => ({ ...prev, criticalityLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Niveau de criticité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Faible</SelectItem>
                  <SelectItem value="medium">Moyen</SelectItem>
                  <SelectItem value="high">Élevé</SelectItem>
                  <SelectItem value="critical">Critique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Contexte technique */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contexte Technique</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Composants SI concernés *</Label>
              <div className="grid grid-cols-1 gap-2 mt-2 max-h-48 overflow-y-auto">
                {siComponentsOptions.map(component => (
                  <div key={component} className="flex items-center space-x-2">
                    <Checkbox
                      id={component}
                      checked={context.siComponents.includes(component)}
                      onCheckedChange={(checked) => handleArrayFieldChange('siComponents', component, checked as boolean)}
                    />
                    <Label htmlFor={component} className="text-sm">{component}</Label>
                  </div>
                ))}
              </div>
              {context.siComponents.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {context.siComponents.map(component => (
                    <Badge key={component} variant="secondary" className="text-xs">
                      {component}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Technologies principales</Label>
              <div className="grid grid-cols-1 gap-2 mt-2 max-h-32 overflow-y-auto">
                {technologiesOptions.map(tech => (
                  <div key={tech} className="flex items-center space-x-2">
                    <Checkbox
                      id={tech}
                      checked={context.mainTechnologies.includes(tech)}
                      onCheckedChange={(checked) => handleArrayFieldChange('mainTechnologies', tech, checked as boolean)}
                    />
                    <Label htmlFor={tech} className="text-sm">{tech}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 3: Processus métier et parties prenantes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Processus Métier</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="criticalProcesses">Processus critiques concernés *</Label>
              <Textarea
                id="criticalProcesses"
                value={context.criticalProcesses.join('\n')}
                onChange={(e) => setContext(prev => ({
                  ...prev,
                  criticalProcesses: e.target.value.split('\n').filter(p => p.trim())
                }))}
                placeholder="Un processus par ligne&#10;Ex:&#10;Gestion des patients&#10;Facturation&#10;Gestion des stocks"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="stakeholders">Parties prenantes principales</Label>
              <Textarea
                id="stakeholders"
                value={context.stakeholders.join('\n')}
                onChange={(e) => setContext(prev => ({
                  ...prev,
                  stakeholders: e.target.value.split('\n').filter(s => s.trim())
                }))}
                placeholder="Une partie prenante par ligne&#10;Ex:&#10;Patients&#10;Personnel médical&#10;Fournisseurs"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="financialStakes">Enjeux financiers</Label>
              <Input
                id="financialStakes"
                value={context.financialStakes}
                onChange={(e) => setContext(prev => ({ ...prev, financialStakes: e.target.value }))}
                placeholder="Ex: CA 500M€, Budget IT 50M€"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conformité et Sécurité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Réglementations applicables</Label>
              <div className="grid grid-cols-1 gap-2 mt-2 max-h-32 overflow-y-auto">
                {regulationsOptions.map(regulation => (
                  <div key={regulation} className="flex items-center space-x-2">
                    <Checkbox
                      id={regulation}
                      checked={context.regulations.includes(regulation)}
                      onCheckedChange={(checked) => handleArrayFieldChange('regulations', regulation, checked as boolean)}
                    />
                    <Label htmlFor={regulation} className="text-sm">{regulation}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="securityMaturity">Maturité sécurité actuelle</Label>
              <Select value={context.securityMaturity} onValueChange={(value) => setContext(prev => ({ ...prev, securityMaturity: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Niveau de maturité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initial">Initial (niveau 1)</SelectItem>
                  <SelectItem value="managed">Géré (niveau 2)</SelectItem>
                  <SelectItem value="defined">Défini (niveau 3)</SelectItem>
                  <SelectItem value="quantitatively-managed">Géré quantitativement (niveau 4)</SelectItem>
                  <SelectItem value="optimizing">En optimisation (niveau 5)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pastIncidents">Incidents passés (optionnel)</Label>
              <Textarea
                id="pastIncidents"
                value={context.pastIncidents}
                onChange={(e) => setContext(prev => ({ ...prev, pastIncidents: e.target.value }))}
                placeholder="Décrivez brièvement les incidents de sécurité passés"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 4: Objectifs et finalisation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Objectifs de la Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label>Objectifs principaux</Label>
              <div className="space-y-2 mt-2">
                {[
                  'Évaluation des risques cyber',
                  'Conformité réglementaire',
                  'Plan de traitement des risques',
                  'Amélioration de la posture sécurité',
                  'Sensibilisation des équipes',
                  'Audit de sécurité complet'
                ].map(objective => (
                  <div key={objective} className="flex items-center space-x-2">
                    <Checkbox
                      id={objective}
                      checked={context.missionObjectives.includes(objective)}
                      onCheckedChange={(checked) => handleArrayFieldChange('missionObjectives', objective, checked as boolean)}
                    />
                    <Label htmlFor={objective} className="text-sm">{objective}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="timeframe">Délai souhaité</Label>
                <Select value={context.timeframe} onValueChange={(value) => setContext(prev => ({ ...prev, timeframe: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Délai de réalisation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-month">1 mois</SelectItem>
                    <SelectItem value="3-months">3 mois</SelectItem>
                    <SelectItem value="6-months">6 mois</SelectItem>
                    <SelectItem value="1-year">1 an</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="budget">Budget sécurité disponible</Label>
                <Select value={context.securityBudget} onValueChange={(value) => setContext(prev => ({ ...prev, securityBudget: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Budget approximatif" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-100k">{'< 100k€'}</SelectItem>
                    <SelectItem value="100k-500k">100k€ - 500k€</SelectItem>
                    <SelectItem value="500k-1M">500k€ - 1M€</SelectItem>
                    <SelectItem value="more-1M">{'> 1M€'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="specificRequirements">Exigences spécifiques (optionnel)</Label>
            <Textarea
              id="specificRequirements"
              value={context.specificRequirements}
              onChange={(e) => setContext(prev => ({ ...prev, specificRequirements: e.target.value }))}
              placeholder="Décrivez toute exigence particulière, contrainte ou contexte spécifique à prendre en compte"
              rows={3}
            />
          </div>

          {/* Résumé du contexte */}
          {(context.organizationName || context.sector) && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Résumé du contexte</h4>
              <div className="text-sm text-blue-800 space-y-1">
                {context.organizationName && <p><strong>Organisation:</strong> {context.organizationName}</p>}
                {context.sector && <p><strong>Secteur:</strong> {context.sector}</p>}
                {context.organizationSize && <p><strong>Taille:</strong> {context.organizationSize}</p>}
                {context.siComponents.length > 0 && (
                  <p><strong>Composants SI:</strong> {context.siComponents.slice(0, 3).join(', ')}
                    {context.siComponents.length > 3 && ` (+${context.siComponents.length - 3} autres)`}
                  </p>
                )}
                {context.criticalProcesses.length > 0 && (
                  <p><strong>Processus critiques:</strong> {context.criticalProcesses.slice(0, 2).join(', ')}
                    {context.criticalProcesses.length > 2 && ` (+${context.criticalProcesses.length - 2} autres)`}
                  </p>
                )}
                {context.regulations.length > 0 && (
                  <p><strong>Conformité:</strong> {context.regulations.slice(0, 3).join(', ')}
                    {context.regulations.length > 3 && ` (+${context.regulations.length - 3} autres)`}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bouton de génération */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Prêt à générer votre mission ?</h3>
              <p className="text-sm text-gray-600">
                Tous les ateliers et rapports seront créés automatiquement
              </p>
            </div>
            <Button 
              onClick={generateMission}
              disabled={!isFormValid()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Générer la Mission Complète
            </Button>
          </div>
          
          {!isFormValid() && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Veuillez remplir au minimum : nom organisation, secteur, taille, composants SI et processus critiques
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoMissionGenerator;
