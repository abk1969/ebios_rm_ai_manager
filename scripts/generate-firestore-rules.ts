/**
 * 🔒 GÉNÉRATEUR DE RÈGLES FIRESTORE SÉCURISÉES
 * 
 * Génère les règles de sécurité Firestore optimisées pour EBIOS RM
 * basées sur le schéma de données et les besoins de sécurité
 */

import * as fs from 'fs';
import * as path from 'path';

interface SecurityRule {
  collection: string;
  operations: {
    read: string[];
    write: string[];
    create: string[];
    update: string[];
    delete: string[];
  };
  conditions: string[];
  customRules?: string[];
}

class FirestoreRulesGenerator {
  private rules: SecurityRule[] = [];

  constructor() {
    this.initializeRules();
  }

  /**
   * Initialiser les règles de sécurité pour chaque collection
   */
  private initializeRules(): void {
    this.rules = [
      {
        collection: 'missions',
        operations: {
          read: ['isAuthenticated()', 'isMissionMember(resource.data.assignedTo)'],
          write: ['isAuthenticated()', 'isMissionOwnerOrAdmin(resource.data.assignedTo)'],
          create: ['isAuthenticated()', 'isValidMissionData(request.resource.data)'],
          update: ['isAuthenticated()', 'isMissionOwnerOrAdmin(resource.data.assignedTo)', 'isValidMissionUpdate(request.resource.data)'],
          delete: ['isAuthenticated()', 'isMissionOwner(resource.data.assignedTo)']
        },
        conditions: [
          'request.auth != null',
          'request.auth.uid in resource.data.assignedTo',
          'resource.data.status != "archived" || hasRole("admin")'
        ],
        customRules: [
          '// Empêcher la modification des missions archivées',
          'allow update: if resource.data.status != "archived" || hasRole("admin");',
          '// Permettre la lecture des missions partagées',
          'allow read: if isSharedMission(resource.id);'
        ]
      },
      {
        collection: 'businessValues',
        operations: {
          read: ['isAuthenticated()', 'canAccessMission(resource.data.missionId)'],
          write: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)'],
          create: ['isAuthenticated()', 'canModifyMission(request.resource.data.missionId)', 'isValidBusinessValue(request.resource.data)'],
          update: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)', 'isValidBusinessValueUpdate(request.resource.data)'],
          delete: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)']
        },
        conditions: [
          'request.auth != null',
          'exists(/databases/$(database)/documents/missions/$(resource.data.missionId))',
          'get(/databases/$(database)/documents/missions/$(resource.data.missionId)).data.assignedTo.hasAny([request.auth.uid])'
        ]
      },
      {
        collection: 'supportingAssets',
        operations: {
          read: ['isAuthenticated()', 'canAccessMission(resource.data.missionId)'],
          write: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)'],
          create: ['isAuthenticated()', 'canModifyMission(request.resource.data.missionId)', 'isValidSupportingAsset(request.resource.data)'],
          update: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)', 'isValidSupportingAssetUpdate(request.resource.data)'],
          delete: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)']
        },
        conditions: [
          'request.auth != null',
          'exists(/databases/$(database)/documents/missions/$(resource.data.missionId))',
          'exists(/databases/$(database)/documents/businessValues/$(resource.data.businessValueId))'
        ]
      },
      {
        collection: 'dreadedEvents',
        operations: {
          read: ['isAuthenticated()', 'canAccessMission(resource.data.missionId)'],
          write: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)'],
          create: ['isAuthenticated()', 'canModifyMission(request.resource.data.missionId)', 'isValidDreadedEvent(request.resource.data)'],
          update: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)', 'isValidDreadedEventUpdate(request.resource.data)'],
          delete: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)']
        },
        conditions: [
          'request.auth != null',
          'exists(/databases/$(database)/documents/missions/$(resource.data.missionId))',
          'exists(/databases/$(database)/documents/businessValues/$(resource.data.businessValueId))'
        ]
      },
      {
        collection: 'riskSources',
        operations: {
          read: ['isAuthenticated()', 'canAccessMission(resource.data.missionId)'],
          write: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)'],
          create: ['isAuthenticated()', 'canModifyMission(request.resource.data.missionId)', 'isValidRiskSource(request.resource.data)'],
          update: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)', 'isValidRiskSourceUpdate(request.resource.data)'],
          delete: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)']
        },
        conditions: [
          'request.auth != null',
          'exists(/databases/$(database)/documents/missions/$(resource.data.missionId))'
        ]
      },
      {
        collection: 'stakeholders',
        operations: {
          read: ['isAuthenticated()', 'canAccessMission(resource.data.missionId)'],
          write: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)'],
          create: ['isAuthenticated()', 'canModifyMission(request.resource.data.missionId)', 'isValidStakeholder(request.resource.data)'],
          update: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)', 'isValidStakeholderUpdate(request.resource.data)'],
          delete: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)']
        },
        conditions: [
          'request.auth != null',
          'exists(/databases/$(database)/documents/missions/$(resource.data.missionId))'
        ]
      },
      {
        collection: 'attackPaths',
        operations: {
          read: ['isAuthenticated()', 'canAccessMission(resource.data.missionId)'],
          write: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)'],
          create: ['isAuthenticated()', 'canModifyMission(request.resource.data.missionId)', 'isValidAttackPath(request.resource.data)'],
          update: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)', 'isValidAttackPathUpdate(request.resource.data)'],
          delete: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)']
        },
        conditions: [
          'request.auth != null',
          'exists(/databases/$(database)/documents/missions/$(resource.data.missionId))'
        ]
      },
      {
        collection: 'strategicScenarios',
        operations: {
          read: ['isAuthenticated()', 'canAccessMission(resource.data.missionId)'],
          write: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)'],
          create: ['isAuthenticated()', 'canModifyMission(request.resource.data.missionId)', 'isValidStrategicScenario(request.resource.data)'],
          update: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)', 'isValidStrategicScenarioUpdate(request.resource.data)'],
          delete: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)']
        },
        conditions: [
          'request.auth != null',
          'exists(/databases/$(database)/documents/missions/$(resource.data.missionId))',
          'exists(/databases/$(database)/documents/riskSources/$(resource.data.riskSourceId))'
        ]
      },
      {
        collection: 'securityMeasures',
        operations: {
          read: ['isAuthenticated()', 'canAccessMission(resource.data.missionId)'],
          write: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)'],
          create: ['isAuthenticated()', 'canModifyMission(request.resource.data.missionId)', 'isValidSecurityMeasure(request.resource.data)'],
          update: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)', 'isValidSecurityMeasureUpdate(request.resource.data)'],
          delete: ['isAuthenticated()', 'canModifyMission(resource.data.missionId)']
        },
        conditions: [
          'request.auth != null',
          'exists(/databases/$(database)/documents/missions/$(resource.data.missionId))'
        ]
      },
      // Collections avancées
      {
        collection: 'missionArchives',
        operations: {
          read: ['isAuthenticated()', 'hasRole("admin")', 'isMissionOwner(resource.data.missionId)'],
          write: ['isAuthenticated()', 'hasRole("admin")'],
          create: ['isAuthenticated()', 'hasRole("admin")', 'isValidArchiveEntry(request.resource.data)'],
          update: ['isAuthenticated()', 'hasRole("admin")'],
          delete: ['isAuthenticated()', 'hasRole("admin")']
        },
        conditions: [
          'request.auth != null',
          'hasRole("admin") || request.auth.uid == resource.data.archivedBy'
        ]
      },
      {
        collection: 'shareInvitations',
        operations: {
          read: ['isAuthenticated()', 'request.auth.token.email == resource.data.email', 'isMissionOwner(resource.data.missionId)'],
          write: ['isAuthenticated()', 'isMissionOwner(resource.data.missionId)'],
          create: ['isAuthenticated()', 'isMissionOwner(request.resource.data.missionId)', 'isValidShareInvitation(request.resource.data)'],
          update: ['isAuthenticated()', 'request.auth.token.email == resource.data.email || isMissionOwner(resource.data.missionId)'],
          delete: ['isAuthenticated()', 'isMissionOwner(resource.data.missionId)']
        },
        conditions: [
          'request.auth != null',
          'request.resource.data.expiresAt > request.time'
        ]
      },
      {
        collection: 'sharePermissions',
        operations: {
          read: ['isAuthenticated()', 'request.auth.uid == resource.data.sharedWith', 'isMissionOwner(resource.data.missionId)'],
          write: ['isAuthenticated()', 'isMissionOwner(resource.data.missionId)'],
          create: ['isAuthenticated()', 'isMissionOwner(request.resource.data.missionId)', 'isValidSharePermission(request.resource.data)'],
          update: ['isAuthenticated()', 'isMissionOwner(resource.data.missionId)'],
          delete: ['isAuthenticated()', 'isMissionOwner(resource.data.missionId)']
        },
        conditions: [
          'request.auth != null',
          'resource.data.isActive == true'
        ]
      },
      {
        collection: 'publicShares',
        operations: {
          read: ['isAuthenticated()', 'isMissionOwner(resource.data.missionId)'],
          write: ['isAuthenticated()', 'isMissionOwner(resource.data.missionId)'],
          create: ['isAuthenticated()', 'isMissionOwner(request.resource.data.missionId)', 'isValidPublicShare(request.resource.data)'],
          update: ['isAuthenticated()', 'isMissionOwner(resource.data.missionId)'],
          delete: ['isAuthenticated()', 'isMissionOwner(resource.data.missionId)']
        },
        conditions: [
          'request.auth != null',
          'resource.data.isActive == true',
          'resource.data.expiresAt == null || resource.data.expiresAt > request.time'
        ]
      },
      {
        collection: 'missionLogs',
        operations: {
          read: ['isAuthenticated()', 'hasRole("admin")', 'isMissionOwner(resource.data.missionId)'],
          write: ['false'], // Logs en lecture seule pour les utilisateurs
          create: ['isAuthenticated()', 'request.auth.uid == request.resource.data.performedBy'],
          update: ['false'],
          delete: ['hasRole("admin")']
        },
        conditions: [
          'request.auth != null',
          'request.resource.data.performedAt == request.time'
        ]
      }
    ];
  }

  /**
   * Générer les règles Firestore complètes
   */
  public generateRules(): string {
    let rules = this.generateHeader();
    rules += this.generateHelperFunctions();
    rules += this.generateValidationFunctions();
    rules += this.generateCollectionRules();
    rules += this.generateFooter();

    return rules;
  }

  /**
   * Générer l'en-tête des règles
   */
  private generateHeader(): string {
    return `rules_version = '2';

// 🔒 RÈGLES DE SÉCURITÉ FIRESTORE EBIOS RM
// Générées automatiquement - Ne pas modifier manuellement
// Version: ${new Date().toISOString()}

service cloud.firestore {
  match /databases/{database}/documents {
    
    // 🚫 Règle par défaut : Tout refuser
    match /{document=**} {
      allow read, write: if false;
    }

`;
  }

  /**
   * Générer les fonctions d'aide
   */
  private generateHelperFunctions(): string {
    return `    // 🔧 FONCTIONS D'AIDE
    
    // Vérifier si l'utilisateur est authentifié
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Vérifier si l'utilisateur a un rôle spécifique
    function hasRole(role) {
      return isAuthenticated() && 
             request.auth.token.get('role', '') == role;
    }
    
    // Vérifier si l'utilisateur peut accéder à une mission
    function canAccessMission(missionId) {
      return isAuthenticated() && 
             (isMissionMember(missionId) || 
              isSharedMission(missionId) || 
              hasRole('admin'));
    }
    
    // Vérifier si l'utilisateur peut modifier une mission
    function canModifyMission(missionId) {
      return isAuthenticated() && 
             (isMissionOwnerOrAdmin(missionId) || 
              hasWritePermission(missionId));
    }
    
    // Vérifier si l'utilisateur est membre d'une mission
    function isMissionMember(missionId) {
      return exists(/databases/$(database)/documents/missions/$(missionId)) &&
             request.auth.uid in get(/databases/$(database)/documents/missions/$(missionId)).data.assignedTo;
    }
    
    // Vérifier si l'utilisateur est propriétaire ou admin d'une mission
    function isMissionOwnerOrAdmin(missionId) {
      return hasRole('admin') || isMissionOwner(missionId);
    }
    
    // Vérifier si l'utilisateur est propriétaire d'une mission
    function isMissionOwner(missionId) {
      return exists(/databases/$(database)/documents/missions/$(missionId)) &&
             get(/databases/$(database)/documents/missions/$(missionId)).data.assignedTo[0] == request.auth.uid;
    }
    
    // Vérifier si la mission est partagée avec l'utilisateur
    function isSharedMission(missionId) {
      return exists(/databases/$(database)/documents/sharePermissions/$(request.auth.uid + '_' + missionId)) &&
             get(/databases/$(database)/documents/sharePermissions/$(request.auth.uid + '_' + missionId)).data.isActive == true;
    }
    
    // Vérifier si l'utilisateur a des permissions d'écriture
    function hasWritePermission(missionId) {
      let shareDoc = /databases/$(database)/documents/sharePermissions/$(request.auth.uid + '_' + missionId);
      return exists(shareDoc) &&
             get(shareDoc).data.isActive == true &&
             get(shareDoc).data.permission in ['write', 'admin'];
    }

`;
  }

  /**
   * Générer les fonctions de validation
   */
  private generateValidationFunctions(): string {
    return `    // ✅ FONCTIONS DE VALIDATION
    
    // Valider les données d'une mission
    function isValidMissionData(data) {
      return data.keys().hasAll(['name', 'description', 'status', 'dueDate', 'assignedTo']) &&
             data.name is string && data.name.size() > 0 &&
             data.description is string && data.description.size() > 0 &&
             data.status in ['draft', 'in_progress', 'review', 'completed', 'archived'] &&
             data.assignedTo is list && data.assignedTo.size() > 0;
    }
    
    // Valider la mise à jour d'une mission
    function isValidMissionUpdate(data) {
      return !data.diff(resource.data).affectedKeys().hasAny(['createdAt', 'id']) &&
             (data.status == resource.data.status || 
              isValidStatusTransition(resource.data.status, data.status));
    }
    
    // Valider les transitions de statut
    function isValidStatusTransition(oldStatus, newStatus) {
      return (oldStatus == 'draft' && newStatus in ['in_progress', 'archived']) ||
             (oldStatus == 'in_progress' && newStatus in ['review', 'draft', 'archived']) ||
             (oldStatus == 'review' && newStatus in ['completed', 'in_progress', 'archived']) ||
             (oldStatus == 'completed' && newStatus in ['archived']) ||
             (oldStatus == 'archived' && hasRole('admin'));
    }
    
    // Valider une valeur métier
    function isValidBusinessValue(data) {
      return data.keys().hasAll(['name', 'description', 'category', 'priority', 'missionId']) &&
             data.name is string && data.name.size() > 0 &&
             data.category in ['primary', 'support', 'management', 'essential'] &&
             data.priority in [1, 2, 3, 4];
    }
    
    // Valider un actif support
    function isValidSupportingAsset(data) {
      return data.keys().hasAll(['name', 'type', 'businessValueId', 'missionId', 'securityLevel']) &&
             data.name is string && data.name.size() > 0 &&
             data.type in ['data', 'software', 'hardware', 'network', 'personnel', 'site', 'organization'] &&
             data.securityLevel in ['public', 'internal', 'confidential', 'secret'];
    }
    
    // Valider un événement redouté
    function isValidDreadedEvent(data) {
      return data.keys().hasAll(['name', 'description', 'businessValueId', 'gravity', 'impactType', 'missionId']) &&
             data.name is string && data.name.size() > 0 &&
             data.gravity in [1, 2, 3, 4] &&
             data.impactType in ['availability', 'integrity', 'confidentiality', 'authenticity', 'non_repudiation'];
    }

    // Valider une source de risque
    function isValidRiskSource(data) {
      return data.keys().hasAll(['name', 'description', 'category', 'pertinence', 'missionId']) &&
             data.name is string && data.name.size() > 0 &&
             data.category in ['cybercriminal', 'terrorist', 'activist', 'state', 'insider', 'competitor', 'natural'] &&
             data.pertinence in [1, 2, 3, 4];
    }

    // Valider une partie prenante
    function isValidStakeholder(data) {
      return data.keys().hasAll(['name', 'type', 'category', 'zone', 'missionId']) &&
             data.name is string && data.name.size() > 0 &&
             data.type in ['internal', 'external', 'partner', 'supplier', 'client', 'regulator'] &&
             data.category in ['decision_maker', 'user', 'administrator', 'maintenance', 'external_entity'] &&
             data.zone in ['trusted', 'untrusted', 'partially_trusted'];
    }

    // Valider un chemin d'attaque
    function isValidAttackPath(data) {
      return data.keys().hasAll(['name', 'description', 'difficulty', 'successProbability', 'missionId']) &&
             data.name is string && data.name.size() > 0 &&
             data.difficulty in [1, 2, 3, 4] &&
             data.successProbability in [1, 2, 3, 4];
    }

    // Valider un scénario stratégique
    function isValidStrategicScenario(data) {
      return data.keys().hasAll(['name', 'description', 'riskSourceId', 'targetBusinessValueId', 'missionId']) &&
             data.name is string && data.name.size() > 0 &&
             data.likelihood in [1, 2, 3, 4] &&
             data.gravity in [1, 2, 3, 4];
    }

    // Valider une mesure de sécurité
    function isValidSecurityMeasure(data) {
      return data.keys().hasAll(['name', 'description', 'controlType', 'status', 'priority', 'missionId']) &&
             data.name is string && data.name.size() > 0 &&
             data.controlType in ['preventive', 'detective', 'corrective', 'directive'] &&
             data.status in ['planned', 'in_progress', 'implemented', 'verified', 'obsolete'] &&
             data.priority in [1, 2, 3, 4];
    }

    // Fonctions de validation pour les mises à jour
    function isValidBusinessValueUpdate(data) {
      return !data.diff(resource.data).affectedKeys().hasAny(['createdAt', 'id', 'missionId']);
    }

    function isValidSupportingAssetUpdate(data) {
      return !data.diff(resource.data).affectedKeys().hasAny(['createdAt', 'id', 'missionId', 'businessValueId']);
    }

    function isValidDreadedEventUpdate(data) {
      return !data.diff(resource.data).affectedKeys().hasAny(['createdAt', 'id', 'missionId', 'businessValueId']);
    }

    function isValidRiskSourceUpdate(data) {
      return !data.diff(resource.data).affectedKeys().hasAny(['createdAt', 'id', 'missionId']);
    }

    function isValidStakeholderUpdate(data) {
      return !data.diff(resource.data).affectedKeys().hasAny(['createdAt', 'id', 'missionId']);
    }

    function isValidAttackPathUpdate(data) {
      return !data.diff(resource.data).affectedKeys().hasAny(['createdAt', 'id', 'missionId']);
    }

    function isValidStrategicScenarioUpdate(data) {
      return !data.diff(resource.data).affectedKeys().hasAny(['createdAt', 'id', 'missionId', 'riskSourceId']);
    }

    function isValidSecurityMeasureUpdate(data) {
      return !data.diff(resource.data).affectedKeys().hasAny(['createdAt', 'id', 'missionId']);
    }

    // Fonctions de validation pour les collections avancées
    function isValidArchiveEntry(data) {
      return data.keys().hasAll(['missionId', 'missionName', 'reason', 'originalStatus']) &&
             data.reason is string && data.reason.size() > 0;
    }

    function isValidShareInvitation(data) {
      return data.keys().hasAll(['missionId', 'email', 'permission', 'expiresAt']) &&
             data.email is string && data.email.matches('.*@.*\\..*') &&
             data.permission in ['read', 'write', 'admin'] &&
             data.expiresAt > request.time;
    }

    function isValidSharePermission(data) {
      return data.keys().hasAll(['missionId', 'sharedWith', 'permission']) &&
             data.permission in ['read', 'write', 'admin'];
    }

    function isValidPublicShare(data) {
      return data.keys().hasAll(['missionId', 'permission', 'token']) &&
             data.permission in ['read', 'write', 'admin'] &&
             data.token is string && data.token.size() >= 16;
    }

`;
  }

  /**
   * Générer les règles pour chaque collection
   */
  private generateCollectionRules(): string {
    let rules = '';

    this.rules.forEach(rule => {
      rules += `    // 📁 Collection: ${rule.collection}\n`;
      rules += `    match /${rule.collection}/{docId} {\n`;
      
      // Règles de lecture
      if (rule.operations.read.length > 0) {
        rules += `      allow read: if ${rule.operations.read.join(' && ')};\n`;
      }
      
      // Règles d'écriture générales
      if (rule.operations.write.length > 0) {
        rules += `      allow write: if ${rule.operations.write.join(' && ')};\n`;
      }
      
      // Règles spécifiques par opération
      if (rule.operations.create.length > 0) {
        rules += `      allow create: if ${rule.operations.create.join(' && ')};\n`;
      }
      
      if (rule.operations.update.length > 0) {
        rules += `      allow update: if ${rule.operations.update.join(' && ')};\n`;
      }
      
      if (rule.operations.delete.length > 0) {
        rules += `      allow delete: if ${rule.operations.delete.join(' && ')};\n`;
      }
      
      // Règles personnalisées
      if (rule.customRules) {
        rules += `      \n`;
        rule.customRules.forEach(customRule => {
          rules += `      ${customRule}\n`;
        });
      }
      
      rules += `    }\n\n`;
    });

    return rules;
  }

  /**
   * Générer le pied de page
   */
  private generateFooter(): string {
    return `    // 🔍 Règles spéciales pour l'accès public (liens partagés)
    match /publicShares/{shareId} {
      allow read: if request.auth != null || 
                     (resource.data.isActive == true && 
                      resource.data.expiresAt > request.time);
    }
    
    // 📊 Règles pour les métriques et monitoring (admin seulement)
    match /metrics/{metricId} {
      allow read, write: if hasRole('admin');
    }
    
    // 🔧 Règles pour la configuration système (admin seulement)
    match /systemConfig/{configId} {
      allow read, write: if hasRole('admin');
    }
  }
}

// 🔒 FIN DES RÈGLES FIRESTORE EBIOS RM
`;
  }

  /**
   * Sauvegarder les règles dans un fichier
   */
  public saveRulesToFile(): void {
    const rules = this.generateRules();
    const rulesPath = path.join(process.cwd(), 'firestore.rules');
    
    fs.writeFileSync(rulesPath, rules);
    console.log(`✅ Règles Firestore générées: ${rulesPath}`);
    
    // Générer aussi un fichier de sauvegarde avec timestamp
    const backupPath = path.join(process.cwd(), `firestore.rules.backup.${Date.now()}`);
    fs.writeFileSync(backupPath, rules);
    console.log(`💾 Sauvegarde créée: ${backupPath}`);
  }
}

// Exécuter la génération si le script est appelé directement
if (require.main === module) {
  const generator = new FirestoreRulesGenerator();
  generator.saveRulesToFile();
}

export { FirestoreRulesGenerator };
