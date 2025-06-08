/**
 * 🔍 GÉNÉRATEUR D'INDEX FIRESTORE
 * 
 * Génère les index Firestore optimisés pour EBIOS RM
 * basés sur les patterns de requêtes et les besoins de performance
 */

import * as fs from 'fs';
import * as path from 'path';

interface FirestoreIndex {
  collectionGroup: string;
  queryScope: 'COLLECTION' | 'COLLECTION_GROUP';
  fields: IndexField[];
  state?: 'CREATING' | 'READY' | 'NEEDS_REPAIR';
}

interface IndexField {
  fieldPath: string;
  order?: 'ASCENDING' | 'DESCENDING';
  arrayConfig?: 'CONTAINS';
}

interface IndexConfiguration {
  indexes: FirestoreIndex[];
  fieldOverrides: FieldOverride[];
}

interface FieldOverride {
  collectionGroup: string;
  fieldPath: string;
  indexes: {
    queryScope: 'COLLECTION' | 'COLLECTION_GROUP';
    order?: 'ASCENDING' | 'DESCENDING';
    arrayConfig?: 'CONTAINS';
  }[];
  ttl?: boolean;
}

class FirestoreIndexGenerator {
  private configuration: IndexConfiguration;

  constructor() {
    this.configuration = {
      indexes: [],
      fieldOverrides: []
    };
    this.initializeIndexes();
  }

  /**
   * Initialiser tous les index requis
   */
  private initializeIndexes(): void {
    // Index pour les missions
    this.addMissionIndexes();
    
    // Index pour les valeurs métier
    this.addBusinessValueIndexes();
    
    // Index pour les actifs supports
    this.addSupportingAssetIndexes();
    
    // Index pour les événements redoutés
    this.addDreadedEventIndexes();
    
    // Index pour les sources de risque
    this.addRiskSourceIndexes();
    
    // Index pour les parties prenantes
    this.addStakeholderIndexes();
    
    // Index pour les chemins d'attaque
    this.addAttackPathIndexes();
    
    // Index pour les scénarios stratégiques
    this.addStrategicScenarioIndexes();
    
    // Index pour les mesures de sécurité
    this.addSecurityMeasureIndexes();
    
    // Index pour les collections avancées
    this.addAdvancedCollectionIndexes();
    
    // Overrides de champs
    this.addFieldOverrides();
  }

  /**
   * Ajouter les index pour les missions
   */
  private addMissionIndexes(): void {
    // Index simple pour le statut (très utilisé pour filtrer)
    this.configuration.indexes.push({
      collectionGroup: 'missions',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'status', order: 'ASCENDING' }
      ]
    });

    // Index composite pour statut + date de création (dashboard)
    this.configuration.indexes.push({
      collectionGroup: 'missions',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'status', order: 'ASCENDING' },
        { fieldPath: 'createdAt', order: 'DESCENDING' }
      ]
    });

    // Index pour les missions assignées à un utilisateur
    this.configuration.indexes.push({
      collectionGroup: 'missions',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'assignedTo', arrayConfig: 'CONTAINS' },
        { fieldPath: 'updatedAt', order: 'DESCENDING' }
      ]
    });

    // Index pour les missions par statut et assignation
    this.configuration.indexes.push({
      collectionGroup: 'missions',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'assignedTo', arrayConfig: 'CONTAINS' },
        { fieldPath: 'status', order: 'ASCENDING' },
        { fieldPath: 'dueDate', order: 'ASCENDING' }
      ]
    });

    // Index pour les missions archivées
    this.configuration.indexes.push({
      collectionGroup: 'missions',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'status', order: 'ASCENDING' },
        { fieldPath: 'archivedAt', order: 'DESCENDING' }
      ]
    });
  }

  /**
   * Ajouter les index pour les valeurs métier
   */
  private addBusinessValueIndexes(): void {
    // Index par mission (très fréquent)
    this.configuration.indexes.push({
      collectionGroup: 'businessValues',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'priority', order: 'ASCENDING' }
      ]
    });

    // Index par catégorie et priorité
    this.configuration.indexes.push({
      collectionGroup: 'businessValues',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'category', order: 'ASCENDING' },
        { fieldPath: 'priority', order: 'ASCENDING' }
      ]
    });

    // Index pour la recherche par criticité
    this.configuration.indexes.push({
      collectionGroup: 'businessValues',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'criticalityLevel', order: 'ASCENDING' },
        { fieldPath: 'createdAt', order: 'DESCENDING' }
      ]
    });
  }

  /**
   * Ajouter les index pour les actifs supports
   */
  private addSupportingAssetIndexes(): void {
    // Index par mission et valeur métier
    this.configuration.indexes.push({
      collectionGroup: 'supportingAssets',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'businessValueId', order: 'ASCENDING' }
      ]
    });

    // Index par type d'actif
    this.configuration.indexes.push({
      collectionGroup: 'supportingAssets',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'type', order: 'ASCENDING' },
        { fieldPath: 'securityLevel', order: 'ASCENDING' }
      ]
    });

    // Index pour les actifs par niveau de sécurité
    this.configuration.indexes.push({
      collectionGroup: 'supportingAssets',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'securityLevel', order: 'ASCENDING' },
        { fieldPath: 'updatedAt', order: 'DESCENDING' }
      ]
    });
  }

  /**
   * Ajouter les index pour les événements redoutés
   */
  private addDreadedEventIndexes(): void {
    // Index par mission et valeur métier
    this.configuration.indexes.push({
      collectionGroup: 'dreadedEvents',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'businessValueId', order: 'ASCENDING' }
      ]
    });

    // Index par gravité et type d'impact
    this.configuration.indexes.push({
      collectionGroup: 'dreadedEvents',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'gravity', order: 'DESCENDING' },
        { fieldPath: 'impactType', order: 'ASCENDING' }
      ]
    });

    // Index pour l'analyse des risques
    this.configuration.indexes.push({
      collectionGroup: 'dreadedEvents',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'impactType', order: 'ASCENDING' },
        { fieldPath: 'gravity', order: 'DESCENDING' }
      ]
    });
  }

  /**
   * Ajouter les index pour les sources de risque
   */
  private addRiskSourceIndexes(): void {
    // Index par mission et catégorie
    this.configuration.indexes.push({
      collectionGroup: 'riskSources',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'category', order: 'ASCENDING' }
      ]
    });

    // Index par pertinence et motivation
    this.configuration.indexes.push({
      collectionGroup: 'riskSources',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'pertinence', order: 'DESCENDING' },
        { fieldPath: 'motivation', order: 'DESCENDING' }
      ]
    });
  }

  /**
   * Ajouter les index pour les parties prenantes
   */
  private addStakeholderIndexes(): void {
    // Index par mission et type
    this.configuration.indexes.push({
      collectionGroup: 'stakeholders',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'type', order: 'ASCENDING' }
      ]
    });

    // Index par zone et catégorie
    this.configuration.indexes.push({
      collectionGroup: 'stakeholders',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'zone', order: 'ASCENDING' },
        { fieldPath: 'category', order: 'ASCENDING' }
      ]
    });
  }

  /**
   * Ajouter les index pour les chemins d'attaque
   */
  private addAttackPathIndexes(): void {
    // Index par mission et difficulté
    this.configuration.indexes.push({
      collectionGroup: 'attackPaths',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'difficulty', order: 'ASCENDING' }
      ]
    });

    // Index par probabilité de succès
    this.configuration.indexes.push({
      collectionGroup: 'attackPaths',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'successProbability', order: 'DESCENDING' },
        { fieldPath: 'difficulty', order: 'ASCENDING' }
      ]
    });
  }

  /**
   * Ajouter les index pour les scénarios stratégiques
   */
  private addStrategicScenarioIndexes(): void {
    // Index par mission et source de risque
    this.configuration.indexes.push({
      collectionGroup: 'strategicScenarios',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'riskSourceId', order: 'ASCENDING' }
      ]
    });

    // Index par niveau de risque
    this.configuration.indexes.push({
      collectionGroup: 'strategicScenarios',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'riskLevel', order: 'DESCENDING' },
        { fieldPath: 'likelihood', order: 'DESCENDING' }
      ]
    });

    // Index par valeur métier ciblée
    this.configuration.indexes.push({
      collectionGroup: 'strategicScenarios',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'targetBusinessValueId', order: 'ASCENDING' },
        { fieldPath: 'gravity', order: 'DESCENDING' }
      ]
    });
  }

  /**
   * Ajouter les index pour les mesures de sécurité
   */
  private addSecurityMeasureIndexes(): void {
    // Index par mission et statut
    this.configuration.indexes.push({
      collectionGroup: 'securityMeasures',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'status', order: 'ASCENDING' }
      ]
    });

    // Index par priorité et type de contrôle
    this.configuration.indexes.push({
      collectionGroup: 'securityMeasures',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'priority', order: 'ASCENDING' },
        { fieldPath: 'controlType', order: 'ASCENDING' }
      ]
    });

    // Index par échéance
    this.configuration.indexes.push({
      collectionGroup: 'securityMeasures',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'dueDate', order: 'ASCENDING' },
        { fieldPath: 'status', order: 'ASCENDING' }
      ]
    });

    // Index par responsable
    this.configuration.indexes.push({
      collectionGroup: 'securityMeasures',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'responsibleParty', order: 'ASCENDING' },
        { fieldPath: 'dueDate', order: 'ASCENDING' }
      ]
    });
  }

  /**
   * Ajouter les index pour les collections avancées
   */
  private addAdvancedCollectionIndexes(): void {
    // Index pour les archives
    this.configuration.indexes.push({
      collectionGroup: 'missionArchives',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'canRestore', order: 'ASCENDING' },
        { fieldPath: 'archivedAt', order: 'DESCENDING' }
      ]
    });

    // Index pour les invitations de partage
    this.configuration.indexes.push({
      collectionGroup: 'shareInvitations',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'status', order: 'ASCENDING' }
      ]
    });

    // Index pour les permissions de partage
    this.configuration.indexes.push({
      collectionGroup: 'sharePermissions',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'isActive', order: 'ASCENDING' }
      ]
    });

    // Index pour les partages publics
    this.configuration.indexes.push({
      collectionGroup: 'publicShares',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'isActive', order: 'ASCENDING' },
        { fieldPath: 'expiresAt', order: 'ASCENDING' }
      ]
    });

    // Index pour les logs
    this.configuration.indexes.push({
      collectionGroup: 'missionLogs',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'performedAt', order: 'DESCENDING' }
      ]
    });

    // Index pour les logs par action
    this.configuration.indexes.push({
      collectionGroup: 'missionLogs',
      queryScope: 'COLLECTION',
      fields: [
        { fieldPath: 'missionId', order: 'ASCENDING' },
        { fieldPath: 'action', order: 'ASCENDING' },
        { fieldPath: 'performedAt', order: 'DESCENDING' }
      ]
    });
  }

  /**
   * Ajouter les overrides de champs
   */
  private addFieldOverrides(): void {
    // Désactiver l'indexation automatique pour les champs de grande taille
    const largeTextFields = [
      { collection: 'missions', field: 'description' },
      { collection: 'businessValues', field: 'description' },
      { collection: 'supportingAssets', field: 'description' },
      { collection: 'dreadedEvents', field: 'description' },
      { collection: 'dreadedEvents', field: 'consequences' },
      { collection: 'securityMeasures', field: 'description' },
      { collection: 'securityMeasures', field: 'implementationNotes' }
    ];

    largeTextFields.forEach(({ collection, field }) => {
      this.configuration.fieldOverrides.push({
        collectionGroup: collection,
        fieldPath: field,
        indexes: [] // Désactiver l'indexation automatique
      });
    });

    // Configuration TTL pour les logs (optionnel)
    this.configuration.fieldOverrides.push({
      collectionGroup: 'missionLogs',
      fieldPath: 'performedAt',
      indexes: [
        {
          queryScope: 'COLLECTION',
          order: 'ASCENDING'
        }
      ],
      ttl: true // Activer TTL si supporté
    });
  }

  /**
   * Générer le fichier de configuration des index
   */
  public generateIndexConfiguration(): string {
    return JSON.stringify(this.configuration, null, 2);
  }

  /**
   * Sauvegarder la configuration dans un fichier
   */
  public saveConfigurationToFile(): void {
    const config = this.generateIndexConfiguration();
    const configPath = path.join(process.cwd(), 'firestore.indexes.json');
    
    fs.writeFileSync(configPath, config);
    console.log(`✅ Configuration des index Firestore générée: ${configPath}`);
    
    // Générer aussi les commandes Firebase CLI
    this.generateFirebaseCommands();
  }

  /**
   * Générer les commandes Firebase CLI pour déployer les index
   */
  private generateFirebaseCommands(): void {
    const commands = [
      '# 🚀 COMMANDES DE DÉPLOIEMENT FIRESTORE',
      '',
      '# 1. Déployer les règles de sécurité',
      'firebase deploy --only firestore:rules',
      '',
      '# 2. Déployer les index',
      'firebase deploy --only firestore:indexes',
      '',
      '# 3. Déployer tout Firestore',
      'firebase deploy --only firestore',
      '',
      '# 4. Vérifier le statut des index',
      'firebase firestore:indexes',
      '',
      '# 5. Supprimer les index inutilisés (attention !)',
      '# firebase firestore:indexes:delete',
      '',
      '# 📊 MONITORING DES PERFORMANCES',
      '# Surveiller les requêtes lentes dans la console Firebase',
      '# https://console.firebase.google.com/project/YOUR_PROJECT/firestore/usage',
      '',
      '# 🔍 ANALYSE DES REQUÊTES',
      '# Utiliser les outils de profiling Firestore pour optimiser',
      '# https://firebase.google.com/docs/firestore/query-data/query-cursors'
    ];

    const commandsPath = path.join(process.cwd(), 'firebase-deploy-commands.sh');
    fs.writeFileSync(commandsPath, commands.join('\n'));
    console.log(`📋 Commandes de déploiement générées: ${commandsPath}`);
  }
}

// Exécuter la génération si le script est appelé directement
if (require.main === module) {
  const generator = new FirestoreIndexGenerator();
  generator.saveConfigurationToFile();
}

export { FirestoreIndexGenerator };
