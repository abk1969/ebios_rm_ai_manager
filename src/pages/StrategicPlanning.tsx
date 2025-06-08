import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  Shield, 
  Users, 
  Calendar,
  BarChart3,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Euro,
  Lightbulb,
  MapPin,
  Settings
} from 'lucide-react';

// Types pour la planification stratégique
interface StrategicObjective {
  id: string;
  title: string;
  description: string;
  category: 'risk_reduction' | 'compliance' | 'operational_excellence' | 'business_enablement';
  timeframe: 'short' | 'medium' | 'long';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'not_started' | 'planning' | 'in_progress' | 'completed' | 'on_hold';
  progress: number;
  budget: {
    allocated: number;
    spent: number;
    currency: string;
  };
  kpis: string[];
  dependencies: string[];
  responsible: string;
  stakeholders: string[];
  risksAddressed: string[];
}

interface StrategicInitiative {
  id: string;
  name: string;
  description: string;
  alignedObjectives: string[];
  startDate: string;
  endDate: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  resources: {
    team: string[];
    budget: number;
    technology: string[];
  };
  milestones: {
    name: string;
    date: string;
    status: 'pending' | 'completed' | 'delayed';
  }[];
  riskMitigated: number; // Pourcentage de risque mitigé
  roi: number; // Return on Investment
}

interface GovernanceFramework {
  committee: string;
  frequency: string;
  participants: string[];
  responsibilities: string[];
  reportingCycle: string;
  decisionAuthority: string[];
}

export default function StrategicPlanning() {
  const [objectives, setObjectives] = useState<StrategicObjective[]>([]);
  const [initiatives, setInitiatives] = useState<StrategicInitiative[]>([]);
  const [governance, setGovernance] = useState<GovernanceFramework | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | 'short' | 'medium' | 'long'>('all');

  useEffect(() => {
    // Simulation des données stratégiques
    const mockObjectives: StrategicObjective[] = [
      {
        id: '1',
        title: 'Résilience Cyber Organisationnelle',
        description: 'Atteindre un niveau de résilience cyber permettant la continuité d\'activité face aux cybermenaces majeures',
        category: 'risk_reduction',
        timeframe: 'long',
        priority: 'critical',
        status: 'in_progress',
        progress: 45,
        budget: {
          allocated: 2500000,
          spent: 1125000,
          currency: 'EUR'
        },
        kpis: [
          'Temps de récupération (RTO) < 4h',
          'Perte de données (RPO) < 1h', 
          'Disponibilité services critiques > 99.9%',
          'Niveau de risque résiduel < 2.0'
        ],
        dependencies: ['Formation équipes', 'Infrastructure redondante', 'Processus incident'],
        responsible: 'RSSI + DG',
        stakeholders: ['COMEX', 'DSI', 'Métiers critiques', 'Équipes sécurité'],
        risksAddressed: ['Cyberattaques sophistiquées', 'Indisponibilité services', 'Perte données critiques']
      },
      {
        id: '2', 
        title: 'Conformité Réglementaire Renforcée',
        description: 'Assurer la conformité avec NIS2, RGPD, et futurs règlements sectoriels',
        category: 'compliance',
        timeframe: 'medium',
        priority: 'high',
        status: 'planning',
        progress: 15,
        budget: {
          allocated: 800000,
          spent: 120000,
          currency: 'EUR'
        },
        kpis: [
          'Taux de conformité > 98%',
          'Délai notification incidents < 72h',
          'Audit sans non-conformité majeure',
          'Certification ISO 27001 maintenue'
        ],
        dependencies: ['Mise à jour processus', 'Formation conformité', 'Outils de reporting'],
        responsible: 'DPO + RSSI',
        stakeholders: ['Direction juridique', 'Audit interne', 'Métiers', 'IT'],
        risksAddressed: ['Sanctions réglementaires', 'Réputation', 'Conformité données']
      },
      {
        id: '3',
        title: 'Excellence Opérationnelle Sécurité',
        description: 'Optimiser les processus de sécurité pour l\'efficacité et la performance',
        category: 'operational_excellence',
        timeframe: 'short',
        priority: 'medium',
        status: 'in_progress',
        progress: 70,
        budget: {
          allocated: 450000,
          spent: 315000,
          currency: 'EUR'
        },
        kpis: [
          'Automatisation > 80% des tâches répétitives',
          'Temps résolution incidents -50%',
          'Satisfaction équipes sécurité > 85%',
          'Coût par transaction sécurisée -30%'
        ],
        dependencies: ['Outils d\'automatisation', 'Formation équipes', 'Refonte processus'],
        responsible: 'Chef de projet sécurité',
        stakeholders: ['Équipes SOC', 'IT Operations', 'Management sécurité'],
        risksAddressed: ['Erreurs humaines', 'Délais de traitement', 'Burn-out équipes']
      }
    ];

    const mockInitiatives: StrategicInitiative[] = [
      {
        id: '1',
        name: 'Programme Zero Trust Enterprise',
        description: 'Déploiement d\'une architecture Zero Trust sur l\'ensemble du SI',
        alignedObjectives: ['1'],
        startDate: '2024-09-01',
        endDate: '2026-06-30',
        status: 'active',
        resources: {
          team: ['Architecte sécurité', 'Ingénieurs réseau', 'Experts IAM', 'Chef de projet'],
          budget: 1800000,
          technology: ['Palo Alto Prisma', 'Microsoft Entra', 'CrowdStrike', 'Splunk']
        },
        milestones: [
          { name: 'Phase 1: Inventaire et cartographie', date: '2024-12-31', status: 'completed' },
          { name: 'Phase 2: Micro-segmentation réseau', date: '2025-06-30', status: 'pending' },
          { name: 'Phase 3: IAM centralisé', date: '2025-12-31', status: 'pending' },
          { name: 'Phase 4: Monitoring unifié', date: '2026-06-30', status: 'pending' }
        ],
        riskMitigated: 65,
        roi: 280
      },
      {
        id: '2',
        name: 'Centre d\'Excellence Cyber (CEC)',
        description: 'Création d\'un centre d\'expertise interne pour la cybersécurité',
        alignedObjectives: ['1', '3'],
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        status: 'planned',
        resources: {
          team: ['RSSI', 'Experts techniques', 'Formateurs', 'Analystes'],
          budget: 650000,
          technology: ['Plateforme formation', 'Lab sécurité', 'Outils R&D']
        },
        milestones: [
          { name: 'Recrutement équipe CEC', date: '2025-03-31', status: 'pending' },
          { name: 'Mise en place laboratoire', date: '2025-06-30', status: 'pending' },
          { name: 'Premier cycle de formation', date: '2025-09-30', status: 'pending' },
          { name: 'Évaluation performance CEC', date: '2025-12-31', status: 'pending' }
        ],
        riskMitigated: 40,
        roi: 150
      }
    ];

    const mockGovernance: GovernanceFramework = {
      committee: 'Comité Stratégique Cybersécurité (CSC)',
      frequency: 'Trimestriel',
      participants: ['DG', 'RSSI', 'DSI', 'DRH', 'DAF', 'Directeur Audit', 'Représentants métiers'],
      responsibilities: [
        'Validation orientations stratégiques cybersécurité',
        'Allocation budgets et ressources',
        'Suivi performance et KPIs',
        'Gestion des risques cyber majeurs',
        'Décisions d\'investissement technologique'
      ],
      reportingCycle: 'Mensuel au CODIR, Trimestriel au CA',
      decisionAuthority: ['Budgets > 100k€', 'Initiatives stratégiques', 'Policies de sécurité']
    };

    setObjectives(mockObjectives);
    setInitiatives(mockInitiatives);
    setGovernance(mockGovernance);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': case 'active': return 'text-blue-600 bg-blue-100';
      case 'planning': case 'planned': return 'text-yellow-600 bg-yellow-100';
      case 'not_started': return 'text-gray-600 bg-gray-100';
      case 'on_hold': case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'risk_reduction': return <Shield className="h-5 w-5" />;
      case 'compliance': return <FileCheck className="h-5 w-5" />;
      case 'operational_excellence': return <TrendingUp className="h-5 w-5" />;
      case 'business_enablement': return <Target className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const filteredObjectives = selectedTimeframe === 'all' 
    ? objectives 
    : objectives.filter(obj => obj.timeframe === selectedTimeframe);

  const totalBudget = objectives.reduce((sum, obj) => sum + obj.budget.allocated, 0);
  const spentBudget = objectives.reduce((sum, obj) => sum + obj.budget.spent, 0);
  const avgProgress = objectives.reduce((sum, obj) => sum + obj.progress, 0) / objectives.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Planification Stratégique Cybersécurité</h1>
          <p className="text-gray-600 mt-2">
            Alignement des objectifs de sécurité avec la stratégie d'entreprise selon EBIOS RM
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileCheck className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button>
            <Lightbulb className="h-4 w-4 mr-2" />
            Nouvelle Initiative
          </Button>
        </div>
      </div>

      {/* KPIs stratégiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progression Globale</p>
                <p className="text-2xl font-bold text-blue-600">{Math.round(avgProgress)}%</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Budget Consommé</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((spentBudget / totalBudget) * 100)}%
                </p>
              </div>
              <Euro className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Initiatives Actives</p>
                <p className="text-2xl font-bold text-orange-600">
                  {initiatives.filter(i => i.status === 'active').length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Objectifs Critiques</p>
                <p className="text-2xl font-bold text-red-600">
                  {objectives.filter(o => o.priority === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="objectives" className="space-y-4">
        <TabsList>
          <TabsTrigger value="objectives">Objectifs Stratégiques</TabsTrigger>
          <TabsTrigger value="initiatives">Initiatives & Projets</TabsTrigger>
          <TabsTrigger value="governance">Gouvernance</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap Stratégique</TabsTrigger>
        </TabsList>

        {/* Objectifs Stratégiques */}
        <TabsContent value="objectives" className="space-y-4">
          <div className="flex space-x-4 mb-4">
            <Button 
              variant={selectedTimeframe === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedTimeframe('all')}
            >
              Tous
            </Button>
            <Button 
              variant={selectedTimeframe === 'short' ? 'default' : 'outline'}
              onClick={() => setSelectedTimeframe('short')}
            >
              Court terme
            </Button>
            <Button 
              variant={selectedTimeframe === 'medium' ? 'default' : 'outline'}
              onClick={() => setSelectedTimeframe('medium')}
            >
              Moyen terme
            </Button>
            <Button 
              variant={selectedTimeframe === 'long' ? 'default' : 'outline'}
              onClick={() => setSelectedTimeframe('long')}
            >
              Long terme
            </Button>
          </div>

          <div className="space-y-4">
            {filteredObjectives.map((objective) => (
              <Card key={objective.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getCategoryIcon(objective.category)}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{objective.title}</h3>
                        <p className="text-gray-600 mt-1">{objective.description}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getPriorityColor(objective.priority)}>
                        {objective.priority}
                      </Badge>
                      <Badge className={getStatusColor(objective.status)}>
                        {objective.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Progression</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{objective.progress}%</span>
                        </div>
                        <Progress value={objective.progress} className="w-full" />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Budget</p>
                      <p className="text-lg font-semibold text-green-600">
                        {(objective.budget.spent / 1000)}k / {(objective.budget.allocated / 1000)}k €
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.round((objective.budget.spent / objective.budget.allocated) * 100)}% consommé
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Responsable</p>
                      <p className="text-sm text-gray-600">{objective.responsible}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700">Échéance</p>
                      <p className="text-sm text-gray-600">{objective.timeframe}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">KPIs Clés :</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {objective.kpis.map((kpi, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{kpi}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Risques Adressés :</p>
                      <div className="flex flex-wrap gap-1">
                        {objective.risksAddressed.map((risk, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {risk}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Initiatives & Projets */}
        <TabsContent value="initiatives" className="space-y-4">
          <div className="space-y-4">
            {initiatives.map((initiative) => (
              <Card key={initiative.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{initiative.name}</h3>
                    <Badge className={getStatusColor(initiative.status)}>
                      {initiative.status}
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-4">{initiative.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Période</p>
                      <p className="text-sm text-gray-600">
                        {new Date(initiative.startDate).toLocaleDateString('fr-FR')} - 
                        {new Date(initiative.endDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Budget</p>
                      <p className="text-sm text-gray-600">{(initiative.resources.budget / 1000)}k €</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">ROI Estimé</p>
                      <p className="text-sm text-green-600">{initiative.roi}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Jalons :</p>
                      <div className="space-y-2">
                        {initiative.milestones.map((milestone, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            {milestone.status === 'completed' ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : milestone.status === 'delayed' ? (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-600">{milestone.name}</span>
                            <span className="text-xs text-gray-400">
                              ({new Date(milestone.date).toLocaleDateString('fr-FR')})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Technologies :</p>
                      <div className="flex flex-wrap gap-1">
                        {initiative.resources.technology.map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Gouvernance */}
        <TabsContent value="governance" className="space-y-4">
          {governance && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Framework de Gouvernance Cybersécurité</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Structure & Fréquence</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Comité :</p>
                        <p className="text-sm text-gray-600">{governance.committee}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Fréquence :</p>
                        <p className="text-sm text-gray-600">{governance.frequency}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Reporting :</p>
                        <p className="text-sm text-gray-600">{governance.reportingCycle}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Participants</h4>
                    <div className="flex flex-wrap gap-1">
                      {governance.participants.map((participant, index) => (
                        <Badge key={index} variant="outline">
                          {participant}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Responsabilités Clés</h4>
                  <ul className="space-y-2">
                    {governance.responsibilities.map((responsibility, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        <span className="text-sm text-gray-600">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Autorité de Décision</h4>
                  <div className="flex flex-wrap gap-1">
                    {governance.decisionAuthority.map((authority, index) => (
                      <Badge key={index} variant="secondary">
                        {authority}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Roadmap Stratégique */}
        <TabsContent value="roadmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Roadmap Stratégique 2024-2027</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {['2024', '2025', '2026', '2027'].map((year, index) => (
                  <div key={year} className="relative">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {year.slice(-2)}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 ml-4">Année {year}</h3>
                    </div>
                    
                    <div className="ml-16 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Objectifs Prioritaires</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Initiative strategique majeure</li>
                          <li>• Conformité réglementaire</li>
                          <li>• Optimisation processus</li>
                        </ul>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Technologies</h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>• Nouvelles solutions sécurité</li>
                          <li>• Migration cloud sécurisée</li>
                          <li>• IA/ML pour la détection</li>
                        </ul>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-medium text-orange-900 mb-2">Ressources & Budget</h4>
                        <ul className="text-sm text-orange-800 space-y-1">
                          <li>• Budget: {(800 + index * 200)}k€</li>
                          <li>• Équipe: {5 + index} FTE</li>
                          <li>• Formation: {20 + index * 5}h</li>
                        </ul>
                      </div>
                    </div>
                    
                    {index < 3 && (
                      <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-300"></div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 