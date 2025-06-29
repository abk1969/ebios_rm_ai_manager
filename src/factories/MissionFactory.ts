import { Mission } from '@/types/ebios';

export class MissionFactory {
  static create(data: Partial<Mission>): Mission {
    return {
      id: crypto.randomUUID(),
      name: data.name || '',
      description: data.description || '',
      status: data.status || 'draft',
      dueDate: data.dueDate || new Date().toISOString(),
      assignedTo: data.assignedTo || [],
      organizationContext: data.organizationContext || {
        organizationType: 'private',
        sector: 'Services financiers',
        size: 'medium',
        regulatoryRequirements: ['RGPD', 'LPM', 'NIS2'],
        securityObjectives: [
          'Confidentialité des données clients',
          'Intégrité des systèmes critiques',
          'Disponibilité des services essentiels'
        ],
        constraints: [
          'Budget limité pour la cybersécurité',
          'Ressources humaines spécialisées restreintes',
          'Contraintes réglementaires strictes'
        ]
      },
      scope: data.scope || {
        boundaries: 'Périmètre des systèmes d\'information critiques de l\'organisation',
        inclusions: [
          'Systèmes de gestion des données clients',
          'Infrastructure réseau interne',
          'Applications métier critiques',
          'Postes de travail utilisateurs'
        ],
        exclusions: [
          'Systèmes de développement isolés',
          'Environnements de test non connectés',
          'Systèmes tiers non maîtrisés'
        ],
        timeFrame: {
          start: new Date().toISOString(),
          end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        },
        geographicalScope: ['France métropolitaine', 'Union Européenne']
      },
      ebiosCompliance: data.ebiosCompliance || {
        version: '1.5',
        completionPercentage: 0,
        complianceGaps: [
          {
            workshop: 2,
            requirement: 'Analyse des sources de risque',
            currentStatus: 'En cours',
            requiredStatus: 'Complété',
            priority: 3
          },
          {
            workshop: 3,
            requirement: 'Scénarios stratégiques',
            currentStatus: 'Non démarré',
            requiredStatus: 'Validé',
            priority: 4
          },
          {
            workshop: 5,
            requirement: 'Plan de traitement des risques',
            currentStatus: 'Ébauche',
            requiredStatus: 'Finalisé',
            priority: 3
          }
        ]
      },
      organization: data.organization || 'Organisation non spécifiée',
      objective: data.objective || 'Évaluation et traitement des risques de sécurité selon la méthodologie EBIOS RM',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}