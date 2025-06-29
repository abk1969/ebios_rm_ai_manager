/**
 * 🔍 AUDIT COMPLET DU SCHÉMA FIREBASE EBIOS RM
 * 
 * Ce script analyse et valide la cohérence du schéma Firebase
 * avant le déploiement sur Google Cloud Platform (GCP)
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Configuration Firebase pour l'audit
const firebaseConfig = {
  // Configuration sera injectée depuis les variables d'environnement
};

// Types pour l'audit
interface CollectionSchema {
  name: string;
  requiredFields: string[];
  optionalFields: string[];
  indexes: IndexDefinition[];
  relationships: RelationshipDefinition[];
  constraints: ConstraintDefinition[];
}

interface IndexDefinition {
  fields: string[];
  type: 'single' | 'composite';
  order?: 'asc' | 'desc';
  required: boolean;
}

interface RelationshipDefinition {
  field: string;
  targetCollection: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  cascadeDelete?: boolean;
}

interface ConstraintDefinition {
  field: string;
  type: 'required' | 'unique' | 'enum' | 'format';
  value?: any;
}

// 📋 DÉFINITION COMPLÈTE DU SCHÉMA EBIOS RM
const EBIOS_SCHEMA: CollectionSchema[] = [
  {
    name: 'missions',
    requiredFields: [
      'name', 'description', 'status', 'dueDate', 'assignedTo',
      'organizationContext', 'scope', 'ebiosCompliance',
      'createdAt', 'updatedAt'
    ],
    optionalFields: [
      'organization', 'objective', 'archivedAt', 'archivedBy', 'archiveReason'
    ],
    indexes: [
      { fields: ['status'], type: 'single', required: true },
      { fields: ['assignedTo'], type: 'single', required: true },
      { fields: ['createdAt'], type: 'single', order: 'desc', required: true },
      { fields: ['status', 'createdAt'], type: 'composite', required: false }
    ],
    relationships: [],
    constraints: [
      { field: 'status', type: 'enum', value: ['draft', 'in_progress', 'review', 'completed', 'archived'] },
      { field: 'name', type: 'required' },
      { field: 'assignedTo', type: 'required' }
    ]
  },
  {
    name: 'businessValues',
    requiredFields: [
      'name', 'description', 'category', 'priority', 'criticalityLevel',
      'missionId', 'createdAt', 'updatedAt'
    ],
    optionalFields: [
      'dreadedEvents', 'supportingAssets', 'stakeholders', 'criticality',
      'natureValeurMetier', 'responsableEntite', 'missionNom', 'aiMetadata'
    ],
    indexes: [
      { fields: ['missionId'], type: 'single', required: true },
      { fields: ['category'], type: 'single', required: false },
      { fields: ['priority'], type: 'single', required: false },
      { fields: ['missionId', 'category'], type: 'composite', required: false }
    ],
    relationships: [
      { field: 'missionId', targetCollection: 'missions', type: 'many-to-one', cascadeDelete: true }
    ],
    constraints: [
      { field: 'category', type: 'enum', value: ['primary', 'support', 'management', 'essential'] },
      { field: 'priority', type: 'enum', value: [1, 2, 3, 4] },
      { field: 'criticalityLevel', type: 'enum', value: ['essential', 'important', 'useful'] }
    ]
  },
  {
    name: 'supportingAssets',
    requiredFields: [
      'name', 'type', 'description', 'businessValueId', 'missionId',
      'securityLevel', 'vulnerabilities', 'dependsOn', 'createdAt', 'updatedAt'
    ],
    optionalFields: [
      'criticality', 'relatedBusinessValues', 'responsableEntite',
      'valeurMetierNom', 'aiSuggestions'
    ],
    indexes: [
      { fields: ['missionId'], type: 'single', required: true },
      { fields: ['businessValueId'], type: 'single', required: true },
      { fields: ['type'], type: 'single', required: false },
      { fields: ['securityLevel'], type: 'single', required: false }
    ],
    relationships: [
      { field: 'missionId', targetCollection: 'missions', type: 'many-to-one', cascadeDelete: true },
      { field: 'businessValueId', targetCollection: 'businessValues', type: 'many-to-one', cascadeDelete: true }
    ],
    constraints: [
      { field: 'type', type: 'enum', value: ['data', 'software', 'hardware', 'network', 'personnel', 'site', 'organization'] },
      { field: 'securityLevel', type: 'enum', value: ['public', 'internal', 'confidential', 'secret'] }
    ]
  },
  {
    name: 'dreadedEvents',
    requiredFields: [
      'name', 'description', 'businessValueId', 'gravity', 'impactType',
      'consequences', 'missionId', 'createdAt', 'updatedAt'
    ],
    optionalFields: [
      'impact', 'likelihood', 'impactedBusinessValues', 'impactsList',
      'valeurMetierNom', 'aiAnalysis'
    ],
    indexes: [
      { fields: ['missionId'], type: 'single', required: true },
      { fields: ['businessValueId'], type: 'single', required: true },
      { fields: ['gravity'], type: 'single', required: false },
      { fields: ['impactType'], type: 'single', required: false }
    ],
    relationships: [
      { field: 'missionId', targetCollection: 'missions', type: 'many-to-one', cascadeDelete: true },
      { field: 'businessValueId', targetCollection: 'businessValues', type: 'many-to-one', cascadeDelete: true }
    ],
    constraints: [
      { field: 'gravity', type: 'enum', value: [1, 2, 3, 4] },
      { field: 'impactType', type: 'enum', value: ['availability', 'integrity', 'confidentiality', 'authenticity', 'non_repudiation'] }
    ]
  },
  {
    name: 'riskSources',
    requiredFields: [
      'name', 'description', 'category', 'pertinence', 'expertise',
      'resources', 'motivation', 'missionId', 'objectives', 'operationalModes',
      'createdAt', 'updatedAt'
    ],
    optionalFields: [
      'categoryAuto', 'pertinenceAccess', 'aiProfile'
    ],
    indexes: [
      { fields: ['missionId'], type: 'single', required: true },
      { fields: ['category'], type: 'single', required: false },
      { fields: ['pertinence'], type: 'single', required: false }
    ],
    relationships: [
      { field: 'missionId', targetCollection: 'missions', type: 'many-to-one', cascadeDelete: true }
    ],
    constraints: [
      { field: 'category', type: 'enum', value: ['cybercriminal', 'terrorist', 'activist', 'state', 'insider', 'competitor', 'natural'] },
      { field: 'pertinence', type: 'enum', value: [1, 2, 3, 4] },
      { field: 'motivation', type: 'enum', value: [1, 2, 3, 4] }
    ]
  },
  {
    name: 'stakeholders',
    requiredFields: [
      'name', 'type', 'category', 'zone', 'exposureLevel',
      'cyberReliability', 'accessRights', 'missionId', 'createdAt', 'updatedAt'
    ],
    optionalFields: [],
    indexes: [
      { fields: ['missionId'], type: 'single', required: true },
      { fields: ['type'], type: 'single', required: false },
      { fields: ['category'], type: 'single', required: false }
    ],
    relationships: [
      { field: 'missionId', targetCollection: 'missions', type: 'many-to-one', cascadeDelete: true }
    ],
    constraints: [
      { field: 'type', type: 'enum', value: ['internal', 'external', 'partner', 'supplier', 'client', 'regulator'] },
      { field: 'category', type: 'enum', value: ['decision_maker', 'user', 'administrator', 'maintenance', 'external_entity'] },
      { field: 'zone', type: 'enum', value: ['trusted', 'untrusted', 'partially_trusted'] }
    ]
  },
  {
    name: 'attackPaths',
    requiredFields: [
      'name', 'description', 'difficulty', 'successProbability',
      'missionId', 'actions', 'prerequisites', 'indicators',
      'createdAt', 'updatedAt'
    ],
    optionalFields: [
      'stakeholderId', 'isDirect', 'feasibility', 'detectability',
      'steps', 'techniques', 'sourceRisqueNom', 'objectifViseNom',
      'graviteAccess', 'aiMetadata'
    ],
    indexes: [
      { fields: ['missionId'], type: 'single', required: true },
      { fields: ['stakeholderId'], type: 'single', required: false },
      { fields: ['difficulty'], type: 'single', required: false }
    ],
    relationships: [
      { field: 'missionId', targetCollection: 'missions', type: 'many-to-one', cascadeDelete: true },
      { field: 'stakeholderId', targetCollection: 'stakeholders', type: 'many-to-one', cascadeDelete: false }
    ],
    constraints: [
      { field: 'difficulty', type: 'enum', value: [1, 2, 3, 4] },
      { field: 'successProbability', type: 'enum', value: [1, 2, 3, 4] }
    ]
  },
  {
    name: 'strategicScenarios',
    requiredFields: [
      'name', 'description', 'riskSourceId', 'targetBusinessValueId',
      'dreadedEventId', 'likelihood', 'gravity', 'riskLevel',
      'pathways', 'missionId', 'createdAt', 'updatedAt'
    ],
    optionalFields: [
      'impact', 'attackPaths', 'supportingAssets'
    ],
    indexes: [
      { fields: ['missionId'], type: 'single', required: true },
      { fields: ['riskSourceId'], type: 'single', required: true },
      { fields: ['riskLevel'], type: 'single', required: false }
    ],
    relationships: [
      { field: 'missionId', targetCollection: 'missions', type: 'many-to-one', cascadeDelete: true },
      { field: 'riskSourceId', targetCollection: 'riskSources', type: 'many-to-one', cascadeDelete: true },
      { field: 'targetBusinessValueId', targetCollection: 'businessValues', type: 'many-to-one', cascadeDelete: true },
      { field: 'dreadedEventId', targetCollection: 'dreadedEvents', type: 'many-to-one', cascadeDelete: true }
    ],
    constraints: [
      { field: 'likelihood', type: 'enum', value: [1, 2, 3, 4] },
      { field: 'gravity', type: 'enum', value: [1, 2, 3, 4] }
    ]
  },
  {
    name: 'securityMeasures',
    requiredFields: [
      'name', 'description', 'controlType', 'status', 'priority',
      'responsibleParty', 'dueDate', 'missionId', 'effectiveness',
      'implementationCost', 'maintenanceCost', 'targetScenarios',
      'targetVulnerabilities', 'implementation', 'createdAt', 'updatedAt'
    ],
    optionalFields: [
      'isoCategory', 'isoControl', 'type', 'cost', 'implementationTime',
      'implementationComplexity', 'complexity', 'riskReduction',
      'nistReference', 'nistFamily', 'category', 'implementationTimeframe',
      'targetedScenarios', 'implementationNotes', 'validationCriteria',
      'dependencies', 'monitoringMethod', 'aiSuggestions', 'typeMesureAccess',
      'freinDifficulteMEO', 'echeanceEnMois', 'responsablesMultiples',
      'responsableParty', 'aiMetadata'
    ],
    indexes: [
      { fields: ['missionId'], type: 'single', required: true },
      { fields: ['status'], type: 'single', required: false },
      { fields: ['priority'], type: 'single', required: false },
      { fields: ['controlType'], type: 'single', required: false }
    ],
    relationships: [
      { field: 'missionId', targetCollection: 'missions', type: 'many-to-one', cascadeDelete: true }
    ],
    constraints: [
      { field: 'controlType', type: 'enum', value: ['preventive', 'detective', 'corrective', 'directive'] },
      { field: 'status', type: 'enum', value: ['planned', 'in_progress', 'implemented', 'verified', 'obsolete'] },
      { field: 'priority', type: 'enum', value: [1, 2, 3, 4] }
    ]
  }
];

// 🆕 NOUVELLES COLLECTIONS POUR LES FONCTIONNALITÉS AVANCÉES
const ADVANCED_COLLECTIONS: CollectionSchema[] = [
  {
    name: 'missionArchives',
    requiredFields: [
      'missionId', 'missionName', 'archivedBy', 'archivedAt',
      'reason', 'originalStatus', 'canRestore', 'metadata'
    ],
    optionalFields: [
      'retentionPeriod', 'deleteAfterRetention', 'createdBackup',
      'restoredAt', 'restoredBy', 'permanentlyDeletedAt', 'permanentlyDeletedBy'
    ],
    indexes: [
      { fields: ['missionId'], type: 'single', required: true },
      { fields: ['canRestore'], type: 'single', required: true },
      { fields: ['archivedAt'], type: 'single', order: 'desc', required: true }
    ],
    relationships: [],
    constraints: []
  },
  {
    name: 'shareInvitations',
    requiredFields: [
      'missionId', 'email', 'permission', 'invitedBy', 'status',
      'createdAt', 'expiresAt', 'token'
    ],
    optionalFields: [
      'message', 'allowDownload', 'allowCopy', 'acceptedAt', 'declinedAt'
    ],
    indexes: [
      { fields: ['missionId'], type: 'single', required: true },
      { fields: ['email'], type: 'single', required: true },
      { fields: ['token'], type: 'single', required: true },
      { fields: ['status'], type: 'single', required: false }
    ],
    relationships: [],
    constraints: [
      { field: 'permission', type: 'enum', value: ['read', 'write', 'admin'] },
      { field: 'status', type: 'enum', value: ['pending', 'accepted', 'declined', 'expired'] }
    ]
  },
  {
    name: 'sharePermissions',
    requiredFields: [
      'missionId', 'sharedBy', 'sharedWith', 'permission',
      'createdAt', 'isActive'
    ],
    optionalFields: [
      'expiresAt', 'revokedAt'
    ],
    indexes: [
      { fields: ['missionId'], type: 'single', required: true },
      { fields: ['sharedWith'], type: 'single', required: true },
      { fields: ['isActive'], type: 'single', required: true }
    ],
    relationships: [],
    constraints: [
      { field: 'permission', type: 'enum', value: ['read', 'write', 'admin'] }
    ]
  },
  {
    name: 'publicShares',
    requiredFields: [
      'missionId', 'permission', 'createdBy', 'createdAt',
      'token', 'isActive', 'accessCount'
    ],
    optionalFields: [
      'expiresAt', 'allowDownload', 'allowCopy', 'lastAccessAt'
    ],
    indexes: [
      { fields: ['token'], type: 'single', required: true },
      { fields: ['missionId'], type: 'single', required: true },
      { fields: ['isActive'], type: 'single', required: true }
    ],
    relationships: [],
    constraints: [
      { field: 'permission', type: 'enum', value: ['read', 'write', 'admin'] }
    ]
  },
  {
    name: 'missionBackups',
    requiredFields: [
      'missionId', 'backupData', 'createdAt', 'createdBy', 'size'
    ],
    optionalFields: [
      'restoredAt', 'restoredBy'
    ],
    indexes: [
      { fields: ['missionId'], type: 'single', required: true },
      { fields: ['createdAt'], type: 'single', order: 'desc', required: true }
    ],
    relationships: [],
    constraints: []
  },
  {
    name: 'missionLogs',
    requiredFields: [
      'missionId', 'action', 'performedBy', 'performedAt'
    ],
    optionalFields: [
      'details', 'ipAddress', 'userAgent'
    ],
    indexes: [
      { fields: ['missionId'], type: 'single', required: true },
      { fields: ['performedAt'], type: 'single', order: 'desc', required: true },
      { fields: ['action'], type: 'single', required: false }
    ],
    relationships: [],
    constraints: []
  }
];

// Combiner tous les schémas
const ALL_SCHEMAS = [...EBIOS_SCHEMA, ...ADVANCED_COLLECTIONS];

export { ALL_SCHEMAS, EBIOS_SCHEMA, ADVANCED_COLLECTIONS };
export type { CollectionSchema, IndexDefinition, RelationshipDefinition, ConstraintDefinition };
