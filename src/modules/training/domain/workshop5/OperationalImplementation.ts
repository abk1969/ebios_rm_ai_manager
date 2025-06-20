/**
 * 🚀 MISE EN ŒUVRE OPÉRATIONNELLE ATELIER 5
 * Liens explicites entre recommandations A5 et déploiement opérationnel
 */

// 🎯 TYPES POUR LA MISE EN ŒUVRE OPÉRATIONNELLE

export interface Deliverable {
  id: string;
  name: string;
  description: string;
  type: 'document' | 'system' | 'process' | 'training';
  dueDate: string;
  responsible: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  dependencies: string[];
  criteria: string[];
  status: 'pending' | 'achieved' | 'delayed';
}

export interface PaymentSchedule {
  date: string;
  amount: number;
  description: string;
  status?: 'pending' | 'paid' | 'overdue';
}

export interface TechnicalResource {
  name: string;
  type: 'infrastructure' | 'software' | 'hardware' | 'network';
  quantity: number;
  duration: number; // days
  cost: number;
  specifications?: string;
}

export interface ExternalResource {
  name: string;
  type: 'expertise' | 'support' | 'service' | 'training';
  duration: number; // days
  cost: number;
  vendor: string;
  contractType?: 'fixed' | 'time_and_materials' | 'outcome_based';
}

export interface TrainingRequirement {
  name: string;
  participants: number;
  duration: number; // days
  cost: number;
  provider: string;
  mandatory: boolean;
  prerequisites?: string[];
}
export interface OperationalImplementation {
  id: string;
  measureId: string;
  measureName: string;
  implementationPhases: ImplementationPhase[];
  timeline: ImplementationTimeline;
  budget: DetailedBudget;
  resources: ResourceRequirements;
  procedures: OperationalProcedure[];
  kpis: PerformanceIndicator[];
  risks: ImplementationRisk[];
  successCriteria: SuccessCriteria[];
  operationalReadiness: OperationalReadiness;
}

export interface ImplementationPhase {
  id: string;
  name: string;
  description: string;
  duration: number; // days
  startDate: string;
  endDate: string;
  dependencies: string[];
  deliverables: Deliverable[];
  milestones: Milestone[];
  budget: number;
  resources: string[];
  risks: string[];
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
}

export interface ImplementationTimeline {
  totalDuration: number; // days
  phases: {
    phaseId: string;
    startWeek: number;
    endWeek: number;
    criticalPath: boolean;
  }[];
  dependencies: {
    from: string;
    to: string;
    type: 'finish_to_start' | 'start_to_start' | 'finish_to_finish';
    lag: number; // days
  }[];
  milestones: {
    date: string;
    name: string;
    type: 'go_live' | 'validation' | 'training' | 'audit';
    critical: boolean;
  }[];
}

export interface DetailedBudget {
  totalBudget: number;
  breakdown: {
    category: string;
    amount: number;
    percentage: number;
    items: BudgetItem[];
  }[];
  contingency: number;
  approvalRequired: boolean;
  paymentSchedule: PaymentSchedule[];
}

export interface BudgetItem {
  name: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  vendor: string;
  contractType: 'capex' | 'opex' | 'service';
  paymentTerms: string;
}

export interface ResourceRequirements {
  humanResources: HumanResource[];
  technicalResources: TechnicalResource[];
  externalResources: ExternalResource[];
  trainingRequirements: TrainingRequirement[];
}

export interface HumanResource {
  role: string;
  skillLevel: 'junior' | 'senior' | 'expert';
  allocation: number; // percentage
  duration: number; // days
  cost: number;
  availability: string;
  criticalPath: boolean;
}

export interface OperationalProcedure {
  id: string;
  name: string;
  type: 'installation' | 'configuration' | 'testing' | 'training' | 'go_live' | 'monitoring';
  description: string;
  steps: ProcedureStep[];
  prerequisites: string[];
  duration: number; // hours
  responsible: string;
  approver: string;
  documentation: string[];
}

export interface ProcedureStep {
  stepNumber: number;
  description: string;
  expectedResult: string;
  validationCriteria: string;
  rollbackProcedure?: string;
  estimatedTime: number; // minutes
}

export interface PerformanceIndicator {
  id: string;
  name: string;
  category: 'technical' | 'operational' | 'financial' | 'security';
  target: number;
  unit: string;
  measurementMethod: string;
  frequency: 'real_time' | 'daily' | 'weekly' | 'monthly';
  responsible: string;
  alertThreshold: number;
  escalationProcedure: string;
}

export interface ImplementationRisk {
  id: string;
  name: string;
  category: 'technical' | 'organizational' | 'financial' | 'timeline';
  probability: number; // 1-5
  impact: number; // 1-5
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
  contingencyPlan: string;
  owner: string;
  status: 'identified' | 'mitigated' | 'realized' | 'closed';
}

export interface SuccessCriteria {
  id: string;
  name: string;
  description: string;
  measurable: boolean;
  target: string;
  validationMethod: string;
  responsible: string;
  deadline: string;
  priority: 'must_have' | 'should_have' | 'nice_to_have';
}

export interface OperationalReadiness {
  technicalReadiness: number; // percentage
  organizationalReadiness: number; // percentage
  processReadiness: number; // percentage
  overallReadiness: number; // percentage
  readinessChecklist: ReadinessItem[];
  goLiveApproval: boolean;
  rollbackPlan: string;
}

export interface ReadinessItem {
  category: string;
  item: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  responsible: string;
  deadline: string;
  critical: boolean;
}

/**
 * 🚀 GÉNÉRATEUR DE MISE EN ŒUVRE OPÉRATIONNELLE
 */
export class OperationalImplementation {

  // 🥇 MISE EN ŒUVRE EDR NEXT-GEN
  static getEDRImplementation(): OperationalImplementation {
    return {
      id: 'impl_edr_nextgen',
      measureId: 'edr_nextgen_ai',
      measureName: 'EDR Next-Gen avec IA comportementale',
      implementationPhases: [
        {
          id: 'phase_1_planning',
          name: 'Phase 1 - Planification et sélection',
          description: 'Spécifications détaillées, appel d\'offres et sélection fournisseur',
          duration: 30,
          startDate: '2024-07-01',
          endDate: '2024-07-30',
          dependencies: [],
          deliverables: [
            {
              id: 'specs_edr',
              name: 'Spécifications techniques EDR',
              description: 'Cahier des charges détaillé avec critères de sélection',
              dueDate: '2024-07-15',
              responsible: 'Architecte sécurité',
              status: 'not_started'
            },
            {
              id: 'vendor_selection',
              name: 'Sélection fournisseur EDR',
              description: 'Évaluation solutions et choix fournisseur final',
              dueDate: '2024-07-30',
              responsible: 'Chef projet sécurité',
              status: 'not_started'
            }
          ],
          milestones: [
            {
              date: '2024-07-15',
              name: 'Spécifications validées',
              type: 'validation',
              critical: true
            },
            {
              date: '2024-07-30',
              name: 'Fournisseur sélectionné',
              type: 'validation',
              critical: true
            }
          ],
          budget: 50000,
          resources: ['Architecte sécurité', 'Chef projet', 'Consultant externe'],
          risks: ['Retard spécifications', 'Aucun fournisseur conforme'],
          status: 'not_started'
        },
        {
          id: 'phase_2_pilot',
          name: 'Phase 2 - Déploiement pilote',
          description: 'Installation et test sur 200 postes pilotes',
          duration: 45,
          startDate: '2024-08-01',
          endDate: '2024-09-15',
          dependencies: ['phase_1_planning'],
          deliverables: [
            {
              id: 'pilot_deployment',
              name: 'Déploiement pilote 200 postes',
              description: 'Installation EDR sur périmètre pilote défini',
              dueDate: '2024-08-30',
              responsible: 'Ingénieur sécurité',
              status: 'not_started'
            },
            {
              id: 'pilot_validation',
              name: 'Validation pilote',
              description: 'Tests fonctionnels et validation performance',
              dueDate: '2024-09-15',
              responsible: 'Équipe SOC',
              status: 'not_started'
            }
          ],
          milestones: [
            {
              date: '2024-08-30',
              name: 'Pilote déployé',
              type: 'go_live',
              critical: true
            },
            {
              date: '2024-09-15',
              name: 'Pilote validé',
              type: 'validation',
              critical: true
            }
          ],
          budget: 100000,
          resources: ['Ingénieur sécurité', 'Équipe SOC', 'Support fournisseur'],
          risks: ['Performance dégradée', 'Faux positifs élevés'],
          status: 'not_started'
        },
        {
          id: 'phase_3_rollout',
          name: 'Phase 3 - Déploiement généralisé',
          description: 'Déploiement sur les 1800 postes restants',
          duration: 60,
          startDate: '2024-09-16',
          endDate: '2024-11-15',
          dependencies: ['phase_2_pilot'],
          deliverables: [
            {
              id: 'full_deployment',
              name: 'Déploiement complet 2000 postes',
              description: 'Installation EDR sur tous les postes CHU',
              dueDate: '2024-11-01',
              responsible: 'Équipe IT',
              status: 'not_started'
            },
            {
              id: 'siem_integration',
              name: 'Intégration SIEM',
              description: 'Configuration remontée alertes vers SIEM',
              dueDate: '2024-11-15',
              responsible: 'Administrateur SIEM',
              status: 'not_started'
            }
          ],
          milestones: [
            {
              date: '2024-11-01',
              name: 'Déploiement complet',
              type: 'go_live',
              critical: true
            },
            {
              date: '2024-11-15',
              name: 'Intégration SIEM',
              type: 'validation',
              critical: false
            }
          ],
          budget: 200000,
          resources: ['Équipe IT', 'Administrateur SIEM', 'Support fournisseur'],
          risks: ['Résistance utilisateurs', 'Problèmes performance réseau'],
          status: 'not_started'
        }
      ],
      timeline: {
        totalDuration: 135,
        phases: [
          { phaseId: 'phase_1_planning', startWeek: 1, endWeek: 4, criticalPath: true },
          { phaseId: 'phase_2_pilot', startWeek: 5, endWeek: 11, criticalPath: true },
          { phaseId: 'phase_3_rollout', startWeek: 12, endWeek: 20, criticalPath: true }
        ],
        dependencies: [
          { from: 'phase_1_planning', to: 'phase_2_pilot', type: 'finish_to_start', lag: 1 },
          { from: 'phase_2_pilot', to: 'phase_3_rollout', type: 'finish_to_start', lag: 1 }
        ],
        milestones: [
          { date: '2024-07-30', name: 'Fournisseur sélectionné', type: 'validation', critical: true },
          { date: '2024-09-15', name: 'Pilote validé', type: 'validation', critical: true },
          { date: '2024-11-15', name: 'EDR opérationnel', type: 'go_live', critical: true }
        ]
      },
      budget: {
        totalBudget: 350000,
        breakdown: [
          {
            category: 'Licences logicielles',
            amount: 280000,
            percentage: 80,
            items: [
              {
                name: 'Licences EDR 3 ans',
                quantity: 2000,
                unitCost: 140,
                totalCost: 280000,
                vendor: 'À sélectionner',
                contractType: 'opex',
                paymentTerms: 'Annuel'
              }
            ]
          },
          {
            category: 'Services professionnels',
            amount: 50000,
            percentage: 14,
            items: [
              {
                name: 'Déploiement et configuration',
                quantity: 1,
                unitCost: 30000,
                totalCost: 30000,
                vendor: 'Intégrateur',
                contractType: 'service',
                paymentTerms: 'Jalons'
              },
              {
                name: 'Formation équipes',
                quantity: 1,
                unitCost: 20000,
                totalCost: 20000,
                vendor: 'Fournisseur EDR',
                contractType: 'service',
                paymentTerms: 'Livraison'
              }
            ]
          },
          {
            category: 'Infrastructure',
            amount: 20000,
            percentage: 6,
            items: [
              {
                name: 'Serveur de gestion EDR',
                quantity: 2,
                unitCost: 10000,
                totalCost: 20000,
                vendor: 'Constructeur serveur',
                contractType: 'capex',
                paymentTerms: 'Livraison'
              }
            ]
          }
        ],
        contingency: 35000,
        approvalRequired: true,
        paymentSchedule: [
          { date: '2024-07-30', amount: 100000, description: 'Commande initiale' },
          { date: '2024-09-15', amount: 125000, description: 'Pilote validé' },
          { date: '2024-11-15', amount: 125000, description: 'Déploiement complet' }
        ]
      },
      resources: {
        humanResources: [
          {
            role: 'Chef de projet sécurité',
            skillLevel: 'expert',
            allocation: 50,
            duration: 135,
            cost: 45000,
            availability: 'Disponible',
            criticalPath: true
          },
          {
            role: 'Architecte sécurité',
            skillLevel: 'expert',
            allocation: 30,
            duration: 60,
            cost: 24000,
            availability: 'Disponible',
            criticalPath: true
          },
          {
            role: 'Ingénieur sécurité',
            skillLevel: 'senior',
            allocation: 80,
            duration: 105,
            cost: 42000,
            availability: 'Disponible',
            criticalPath: true
          },
          {
            role: 'Équipe IT (3 personnes)',
            skillLevel: 'senior',
            allocation: 60,
            duration: 60,
            cost: 36000,
            availability: 'Disponible',
            criticalPath: false
          }
        ],
        technicalResources: [
          {
            name: 'Environnement de test',
            type: 'infrastructure',
            quantity: 1,
            duration: 45,
            cost: 5000
          },
          {
            name: 'Outils de déploiement',
            type: 'software',
            quantity: 1,
            duration: 135,
            cost: 3000
          }
        ],
        externalResources: [
          {
            name: 'Consultant EDR spécialisé',
            type: 'expertise',
            duration: 30,
            cost: 25000,
            vendor: 'Cabinet conseil'
          },
          {
            name: 'Support fournisseur',
            type: 'support',
            duration: 135,
            cost: 15000,
            vendor: 'Fournisseur EDR'
          }
        ],
        trainingRequirements: [
          {
            name: 'Formation administrateurs EDR',
            participants: 4,
            duration: 3,
            cost: 8000,
            provider: 'Fournisseur EDR'
          },
          {
            name: 'Formation utilisateurs SOC',
            participants: 8,
            duration: 2,
            cost: 6000,
            provider: 'Fournisseur EDR'
          }
        ]
      },
      procedures: [
        {
          id: 'proc_edr_install',
          name: 'Procédure d\'installation EDR',
          type: 'installation',
          description: 'Installation et configuration agent EDR sur poste de travail',
          steps: [
            {
              stepNumber: 1,
              description: 'Vérifier prérequis système (OS, RAM, espace disque)',
              expectedResult: 'Prérequis validés',
              validationCriteria: 'Checklist prérequis complétée',
              estimatedTime: 5
            },
            {
              stepNumber: 2,
              description: 'Télécharger agent EDR depuis console centrale',
              expectedResult: 'Agent téléchargé',
              validationCriteria: 'Fichier présent et intégrité vérifiée',
              estimatedTime: 10
            },
            {
              stepNumber: 3,
              description: 'Installer agent EDR en mode silencieux',
              expectedResult: 'Agent installé',
              validationCriteria: 'Service EDR démarré',
              rollbackProcedure: 'Désinstallation automatique',
              estimatedTime: 15
            },
            {
              stepNumber: 4,
              description: 'Configurer politiques de sécurité',
              expectedResult: 'Politiques appliquées',
              validationCriteria: 'Politiques visibles dans console',
              estimatedTime: 10
            },
            {
              stepNumber: 5,
              description: 'Tester détection avec échantillon EICAR',
              expectedResult: 'Détection confirmée',
              validationCriteria: 'Alerte générée dans SIEM',
              estimatedTime: 5
            }
          ],
          prerequisites: ['Accès administrateur', 'Connectivité réseau', 'Console EDR configurée'],
          duration: 1,
          responsible: 'Ingénieur sécurité',
          approver: 'Chef projet sécurité',
          documentation: ['Manuel installation', 'Checklist validation', 'Procédure rollback']
        }
      ],
      kpis: [
        {
          id: 'kpi_edr_detection_rate',
          name: 'Taux de détection EDR',
          category: 'security',
          target: 95,
          unit: '%',
          measurementMethod: 'Tests mensuels avec échantillons malware',
          frequency: 'monthly',
          responsible: 'Équipe SOC',
          alertThreshold: 90,
          escalationProcedure: 'Alerte RSSI si < 90%'
        },
        {
          id: 'kpi_edr_mttd',
          name: 'MTTD (Mean Time To Detection)',
          category: 'operational',
          target: 15,
          unit: 'minutes',
          measurementMethod: 'Mesure automatique via SIEM',
          frequency: 'real_time',
          responsible: 'Équipe SOC',
          alertThreshold: 30,
          escalationProcedure: 'Escalade automatique si > 30min'
        },
        {
          id: 'kpi_edr_false_positives',
          name: 'Taux de faux positifs',
          category: 'operational',
          target: 2,
          unit: '%',
          measurementMethod: 'Analyse hebdomadaire des alertes',
          frequency: 'weekly',
          responsible: 'Analyste SOC',
          alertThreshold: 5,
          escalationProcedure: 'Tuning règles si > 5%'
        },
        {
          id: 'kpi_edr_availability',
          name: 'Disponibilité EDR',
          category: 'technical',
          target: 99.9,
          unit: '%',
          measurementMethod: 'Monitoring automatique agents',
          frequency: 'real_time',
          responsible: 'Administrateur EDR',
          alertThreshold: 99,
          escalationProcedure: 'Intervention immédiate si < 99%'
        }
      ],
      risks: [
        {
          id: 'risk_edr_performance',
          name: 'Dégradation performance postes',
          category: 'technical',
          probability: 3,
          impact: 4,
          riskLevel: 'high',
          mitigation: 'Tests performance en phase pilote, dimensionnement adapté',
          contingencyPlan: 'Ajustement configuration ou changement solution',
          owner: 'Architecte sécurité',
          status: 'identified'
        },
        {
          id: 'risk_edr_resistance',
          name: 'Résistance utilisateurs',
          category: 'organizational',
          probability: 4,
          impact: 3,
          riskLevel: 'high',
          mitigation: 'Communication proactive, formation, support utilisateur',
          contingencyPlan: 'Plan de conduite du changement renforcé',
          owner: 'Chef projet sécurité',
          status: 'identified'
        },
        {
          id: 'risk_edr_integration',
          name: 'Problèmes intégration SIEM',
          category: 'technical',
          probability: 2,
          impact: 3,
          riskLevel: 'medium',
          mitigation: 'Tests intégration en phase pilote',
          contingencyPlan: 'Développement connecteur spécifique',
          owner: 'Administrateur SIEM',
          status: 'identified'
        }
      ],
      successCriteria: [
        {
          id: 'success_edr_deployment',
          name: 'Déploiement complet',
          description: '100% des postes équipés EDR fonctionnel',
          measurable: true,
          target: '2000 postes',
          validationMethod: 'Inventaire automatique console EDR',
          responsible: 'Chef projet sécurité',
          deadline: '2024-11-15',
          priority: 'must_have'
        },
        {
          id: 'success_edr_performance',
          name: 'Performance cible atteinte',
          description: 'KPIs de performance respectés',
          measurable: true,
          target: 'Détection >95%, MTTD <15min, Faux positifs <2%',
          validationMethod: 'Mesures automatiques pendant 30 jours',
          responsible: 'Équipe SOC',
          deadline: '2024-12-15',
          priority: 'must_have'
        },
        {
          id: 'success_edr_integration',
          name: 'Intégration SIEM opérationnelle',
          description: 'Remontée alertes EDR dans SIEM',
          measurable: true,
          target: '100% alertes remontées',
          validationMethod: 'Tests fonctionnels intégration',
          responsible: 'Administrateur SIEM',
          deadline: '2024-11-30',
          priority: 'should_have'
        }
      ],
      operationalReadiness: {
        technicalReadiness: 85,
        organizationalReadiness: 70,
        processReadiness: 80,
        overallReadiness: 78,
        readinessChecklist: [
          {
            category: 'Technique',
            item: 'Infrastructure serveurs EDR',
            status: 'completed',
            responsible: 'Équipe IT',
            deadline: '2024-07-15',
            critical: true
          },
          {
            category: 'Technique',
            item: 'Connectivité réseau validée',
            status: 'in_progress',
            responsible: 'Équipe réseau',
            deadline: '2024-07-30',
            critical: true
          },
          {
            category: 'Organisationnel',
            item: 'Équipe SOC formée',
            status: 'not_started',
            responsible: 'Manager SOC',
            deadline: '2024-08-30',
            critical: true
          },
          {
            category: 'Processus',
            item: 'Procédures opérationnelles',
            status: 'in_progress',
            responsible: 'Chef projet sécurité',
            deadline: '2024-08-15',
            critical: true
          }
        ],
        goLiveApproval: false,
        rollbackPlan: 'Désinstallation agents, retour monitoring antivirus existant'
      }
    };
  }

  // 🎯 MÉTHODES UTILITAIRES
  static getAllImplementations(): OperationalImplementation[] {
    return [
      this.getEDRImplementation()
      // Autres implémentations à ajouter
    ];
  }

  static getImplementationById(id: string): OperationalImplementation | undefined {
    return this.getAllImplementations().find(impl => impl.id === id);
  }

  static calculateOverallProgress(): {
    totalImplementations: number;
    completedPhases: number;
    totalPhases: number;
    overallProgress: number;
    nextMilestones: any[];
    criticalRisks: any[];
  } {
    const implementations = this.getAllImplementations();
    const totalImplementations = implementations.length;
    
    let completedPhases = 0;
    let totalPhases = 0;
    const nextMilestones: any[] = [];
    const criticalRisks: any[] = [];

    implementations.forEach(impl => {
      totalPhases += impl.implementationPhases.length;
      completedPhases += impl.implementationPhases.filter(phase => phase.status === 'completed').length;
      
      // Prochains jalons
      impl.timeline.milestones.forEach(milestone => {
        if (new Date(milestone.date) > new Date()) {
          nextMilestones.push({
            implementation: impl.measureName,
            ...milestone
          });
        }
      });
      
      // Risques critiques
      impl.risks.forEach(risk => {
        if (risk.riskLevel === 'critical' || risk.riskLevel === 'high') {
          criticalRisks.push({
            implementation: impl.measureName,
            ...risk
          });
        }
      });
    });

    return {
      totalImplementations,
      completedPhases,
      totalPhases,
      overallProgress: totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0,
      nextMilestones: nextMilestones.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5),
      criticalRisks: criticalRisks.filter(risk => risk.status === 'identified').slice(0, 5)
    };
  }
}

export default OperationalImplementation;
