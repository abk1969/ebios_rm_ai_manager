/**
 * SERVICE DE CRÉATION MISSION IA ANTI-FRAUDE
 * Mission complète pour système d'IA anti-fraude protection sociale
 */

import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { testDb } from '@/config/firebase.test';

export class AntiFraudAIMissionService {
  
  /**
   * ATELIER 1 - IA ANTI-FRAUDE: Biens essentiels et supports
   */
  static async createAntiFraudWorkshop1(missionId: string): Promise<void> {
    console.log('Création Atelier 1 - IA Anti-Fraude...');

    // BIENS ESSENTIELS (8 biens critiques)
    const businessValues = [
      {
        missionId,
        name: 'Données personnelles et sociales des adhérents',
        description: 'Base de données de 8M+ adhérents avec historiques complets : revenus, prestations, données familiales, parcours professionnels',
        category: 'data',
        criticalityLevel: 4,
        impactTypes: ['confidentialité', 'intégrité', 'disponibilité', 'traçabilité'],
        stakeholders: ['CNIL', 'Adhérents', 'Entreprises clientes', 'Contrôleurs sociaux'],
        dependencies: ['DSN', 'Déclarations sociales', 'Systèmes RH entreprises'],
        regulatoryRequirements: ['RGPD', 'Code Sécurité Sociale', 'Loi Informatique et Libertés'],
        businessImpact: 'Gestion des droits sociaux, calcul prestations, conformité réglementaire',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Algorithmes d\'intelligence artificielle anti-fraude',
        description: 'Modèles ML/DL propriétaires pour détection fraude : réseaux de neurones, forêts aléatoires, détection d\'anomalies',
        category: 'intellectual_property',
        criticalityLevel: 5,
        impactTypes: ['intégrité', 'confidentialité', 'performance', 'innovation'],
        stakeholders: ['Data Scientists', 'Direction Innovation', 'Métiers', 'Régulateurs'],
        dependencies: ['Données d\'entraînement', 'Infrastructure ML', 'Expertise métier'],
        regulatoryRequirements: ['AI Act européen', 'Explicabilité algorithmes', 'Non-discrimination'],
        businessImpact: 'Avantage concurrentiel, efficacité détection, réduction pertes',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Service de détection temps réel',
        description: 'Plateforme de scoring en temps réel analysant 2M+ dossiers/mois, SLA <100ms, disponibilité 99.99%',
        category: 'service',
        criticalityLevel: 4,
        impactTypes: ['disponibilité', 'performance', 'intégrité', 'continuité'],
        stakeholders: ['Gestionnaires', 'Contrôleurs', 'Adhérents', 'Direction'],
        dependencies: ['Infrastructure cloud', 'APIs', 'Bases de données', 'Monitoring'],
        regulatoryRequirements: ['Obligations de service', 'Temps de traitement'],
        businessImpact: 'Efficacité opérationnelle, satisfaction adhérents, maîtrise des coûts',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Processus d\'enquête et contrôle renforcé',
        description: 'Workflow d\'investigation des cas suspects : priorisation IA, enquêtes terrain, sanctions, récupération indus',
        category: 'process',
        criticalityLevel: 3,
        impactTypes: ['efficacité', 'conformité', 'traçabilité', 'équité'],
        stakeholders: ['Enquêteurs', 'Juristes', 'Contrôleurs', 'Direction des risques'],
        dependencies: ['Système de gestion des cas', 'Outils d\'enquête', 'Bases légales'],
        regulatoryRequirements: ['Code Sécurité Sociale', 'Droits de la défense', 'RGPD'],
        businessImpact: 'Récupération des indus, dissuasion, équité du système',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Données d\'entraînement et modèles prédictifs',
        description: 'Datasets historiques étiquetés, cas de fraude avérés, patterns comportementaux, 10+ années d\'historique',
        category: 'data',
        criticalityLevel: 5,
        impactTypes: ['qualité', 'représentativité', 'confidentialité', 'biais'],
        stakeholders: ['Data Scientists', 'Métiers', 'Auditeurs', 'Chercheurs'],
        dependencies: ['Historique des fraudes', 'Expertise métier', 'Outils d\'annotation'],
        regulatoryRequirements: ['RGPD', 'AI Act', 'Non-discrimination'],
        businessImpact: 'Performance des modèles, innovation, recherche et développement',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Réputation et confiance institutionnelle',
        description: 'Image de l\'organisme de protection sociale, confiance des adhérents et partenaires sociaux',
        category: 'reputation',
        criticalityLevel: 3,
        impactTypes: ['confiance', 'image', 'légitimité', 'adhésion'],
        stakeholders: ['Adhérents', 'Entreprises', 'Partenaires sociaux', 'Médias', 'Pouvoirs publics'],
        dependencies: ['Qualité de service', 'Transparence', 'Communication', 'Éthique'],
        regulatoryRequirements: ['Transparence algorithmes', 'Communication publique'],
        businessImpact: 'Acceptabilité sociale, fidélisation, développement commercial',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Flux financiers et récupération des indus',
        description: 'Gestion des flux de 500M€+ de prestations annuelles, récupération indus, optimisation financière',
        category: 'financial',
        criticalityLevel: 4,
        impactTypes: ['intégrité', 'traçabilité', 'performance', 'conformité'],
        stakeholders: ['Direction financière', 'Contrôleurs', 'Trésorerie', 'Auditeurs'],
        dependencies: ['Systèmes comptables', 'Processus de recouvrement', 'Outils de pilotage'],
        regulatoryRequirements: ['Code Sécurité Sociale', 'Comptabilité publique'],
        businessImpact: 'Équilibre financier, performance économique, durabilité',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Conformité réglementaire et éthique IA',
        description: 'Respect des obligations légales sur l\'IA, explicabilité, non-discrimination, droits des personnes',
        category: 'compliance',
        criticalityLevel: 5,
        impactTypes: ['conformité', 'éthique', 'transparence', 'responsabilité'],
        stakeholders: ['DPO', 'Juristes', 'Éthiciens', 'Régulateurs', 'Comité d\'éthique'],
        dependencies: ['Veille réglementaire', 'Expertise juridique', 'Outils d\'audit'],
        regulatoryRequirements: ['AI Act', 'RGPD', 'Code Sécurité Sociale', 'Charte éthique'],
        businessImpact: 'Acceptabilité réglementaire, réduction des risques juridiques',
        createdAt: new Date().toISOString()
      }
    ];

    // Insertion des biens essentiels
    const batch1 = writeBatch(testDb);
    businessValues.forEach(bv => {
      const ref = doc(collection(testDb, 'businessValues'));
      batch1.set(ref, bv);
    });
    await batch1.commit();
    // console.log supprimé;

    // BIENS SUPPORTS (14 biens supports critiques)
    const supportingAssets = [
      {
        missionId,
        name: 'Plateforme cloud IA sécurisée',
        description: 'Infrastructure cloud hybride dédiée ML/DL : GPU clusters, stockage haute performance, sécurité renforcée',
        type: 'logical',
        category: 'infrastructure',
        location: 'Cloud privé + AWS/Azure',
        owner: 'DSI',
        securityLevel: 'secret',
        businessValues: ['Algorithmes d\'IA anti-fraude', 'Service de détection temps réel'],
        technologies: ['Kubernetes', 'NVIDIA DGX', 'MLflow', 'Kubeflow'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Data Lake sécurisé multi-sources',
        description: 'Lac de données centralisé : DSN, prestations, comportements, données externes, 50TB+ de données',
        type: 'logical',
        category: 'data_storage',
        location: 'Datacenter sécurisé',
        owner: 'Chief Data Officer',
        securityLevel: 'secret',
        businessValues: ['Données personnelles adhérents', 'Données d\'entraînement'],
        technologies: ['Hadoop', 'Spark', 'Delta Lake', 'Apache Kafka'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Équipe Data Science et IA',
        description: 'Équipe de 25+ data scientists, ML engineers, experts métier, chercheurs en IA',
        type: 'human',
        category: 'expertise',
        location: 'Centre R&D + télétravail',
        owner: 'Chief Data Officer',
        securityLevel: 'confidential',
        businessValues: ['Algorithmes d\'IA anti-fraude', 'Données d\'entraînement'],
        qualifications: ['PhD ML/AI', 'Experts métier', 'Ingénieurs DevOps'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Pipeline MLOps automatisé',
        description: 'Chaîne DevOps pour ML : CI/CD modèles, tests automatisés, déploiement, monitoring performance',
        type: 'logical',
        category: 'automation',
        location: 'Infrastructure cloud',
        owner: 'Équipe MLOps',
        securityLevel: 'confidential',
        businessValues: ['Algorithmes d\'IA anti-fraude', 'Service de détection temps réel'],
        tools: ['Jenkins', 'GitLab CI', 'MLflow', 'Prometheus'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'API Gateway et microservices',
        description: 'Architecture microservices pour scoring temps réel, APIs sécurisées, load balancing',
        type: 'logical',
        category: 'integration',
        location: 'DMZ sécurisée',
        owner: 'Architecte SI',
        securityLevel: 'confidential',
        businessValues: ['Service de détection temps réel', 'Conformité réglementaire'],
        technologies: ['Kong', 'Docker', 'Istio', 'OAuth2'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Système de gestion des enquêtes',
        description: 'Application métier pour workflow d\'enquête : priorisation, affectation, suivi, reporting',
        type: 'logical',
        category: 'application',
        location: 'Datacenter interne',
        owner: 'Direction des contrôles',
        securityLevel: 'confidential',
        businessValues: ['Processus d\'enquête et contrôle', 'Flux financiers'],
        features: ['Workflow', 'Reporting', 'Intégration IA', 'Mobile'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Outils d\'explicabilité et audit IA',
        description: 'Solutions pour expliquer les décisions IA : LIME, SHAP, audit trails, tableaux de bord',
        type: 'logical',
        category: 'governance',
        location: 'Plateforme IA',
        owner: 'Responsable éthique IA',
        securityLevel: 'internal',
        businessValues: ['Conformité réglementaire', 'Réputation et confiance'],
        tools: ['LIME', 'SHAP', 'Fairlearn', 'What-If Tool'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Infrastructure de sécurité IA',
        description: 'Sécurisation spécifique IA : protection modèles, détection adversarial attacks, privacy-preserving ML',
        type: 'logical',
        category: 'security',
        location: 'Transverse',
        owner: 'RSSI',
        securityLevel: 'secret',
        businessValues: ['Algorithmes d\'IA anti-fraude', 'Données d\'entraînement'],
        capabilities: ['Model encryption', 'Differential privacy', 'Federated learning'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Centres de données géo-distribués',
        description: 'Infrastructure redondante sur 3 sites géographiques, haute disponibilité, PRA automatisé',
        type: 'physical',
        category: 'infrastructure',
        location: 'Sites multiples France',
        owner: 'DSI',
        securityLevel: 'secret',
        businessValues: ['Service de détection temps réel', 'Données personnelles'],
        certifications: ['ISO27001', 'SOC2', 'HDS'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Équipe contrôle et enquêtes',
        description: 'Inspecteurs, enquêteurs, juristes spécialisés fraude sociale, 80+ professionnels',
        type: 'human',
        category: 'operational',
        location: 'Agences régionales',
        owner: 'Direction des contrôles',
        securityLevel: 'confidential',
        businessValues: ['Processus d\'enquête et contrôle', 'Flux financiers'],
        expertise: ['Enquête', 'Juridique', 'Comptable', 'Social'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Système de monitoring IA avancé',
        description: 'Supervision performance modèles, drift detection, alertes qualité, métriques métier',
        type: 'logical',
        category: 'monitoring',
        location: 'SOC IA',
        owner: 'Équipe MLOps',
        securityLevel: 'internal',
        businessValues: ['Algorithmes d\'IA anti-fraude', 'Service de détection'],
        metrics: ['Accuracy', 'Precision', 'Recall', 'Fairness', 'Drift'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Interfaces avec systèmes legacy',
        description: 'Connecteurs avec SI historiques : mainframe, AS/400, bases relationnelles, ETL temps réel',
        type: 'logical',
        category: 'integration',
        location: 'Middleware',
        owner: 'Équipe intégration',
        securityLevel: 'confidential',
        businessValues: ['Données personnelles adhérents', 'Flux financiers'],
        protocols: ['MQ Series', 'SOAP', 'REST', 'File transfer'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Laboratoire de recherche IA',
        description: 'Lab R&D pour innovation IA : nouveaux algorithmes, recherche académique, POCs, veille techno',
        type: 'organizational',
        category: 'innovation',
        location: 'Centre R&D',
        owner: 'Direction Innovation',
        securityLevel: 'internal',
        businessValues: ['Algorithmes d\'IA anti-fraude', 'Données d\'entraînement'],
        partnerships: ['Universités', 'INRIA', 'Startups IA'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Comité d\'éthique et gouvernance IA',
        description: 'Instance de gouvernance : éthique IA, validation modèles, conformité, arbitrages',
        type: 'organizational',
        category: 'governance',
        location: 'Siège social',
        owner: 'Direction générale',
        securityLevel: 'internal',
        businessValues: ['Conformité réglementaire', 'Réputation et confiance'],
        composition: ['Éthiciens', 'Juristes', 'Métiers', 'Externes'],
        createdAt: new Date().toISOString()
      }
    ];

    // Insertion des biens supports
    const batch2 = writeBatch(testDb);
    supportingAssets.forEach(sa => {
      const ref = doc(collection(testDb, 'supportingAssets'));
      batch2.set(ref, sa);
    });
    await batch2.commit();
    // console.log supprimé;

    // ÉVÉNEMENTS REDOUTÉS (7 événements critiques)
    const dreadedEvents = [
      {
        missionId,
        name: 'Compromission des algorithmes d\'IA propriétaires',
        description: 'Vol ou corruption des modèles d\'IA anti-fraude, perte d\'avantage concurrentiel, exploitation par fraudeurs',
        impactedBusinessValues: ['Algorithmes d\'IA anti-fraude', 'Réputation et confiance'],
        impactLevel: 4,
        impactTypes: {
          availability: 3,
          integrity: 4,
          confidentiality: 4,
          authenticity: 3
        },
        consequences: [
          'Perte d\'avantage concurrentiel majeur',
          'Exploitation des failles par fraudeurs',
          'Coût de redéveloppement >50M€',
          'Perte de confiance des adhérents',
          'Dégradation performance détection',
          'Risque de copycat concurrents'
        ],
        regulatoryImpact: 'Violation propriété intellectuelle, obligations de sécurité',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Biais discriminatoires dans les algorithmes',
        description: 'Découverte de biais systémiques discriminant certaines populations, sanctions réglementaires',
        impactedBusinessValues: ['Conformité réglementaire', 'Réputation et confiance'],
        impactLevel: 4,
        impactTypes: {
          availability: 2,
          integrity: 4,
          confidentiality: 1,
          authenticity: 3
        },
        consequences: [
          'Sanctions AI Act et CNIL',
          'Procès collectifs discrimination',
          'Arrêt forcé des algorithmes',
          'Crise de confiance majeure',
          'Coûts de remédiation >20M€',
          'Révision complète des modèles'
        ],
        regulatoryImpact: 'Violation AI Act, RGPD, principe non-discrimination',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Attaque adversariale sur les modèles ML',
        description: 'Manipulation des inputs pour tromper l\'IA, validation de fraudes massives, contournement systématique',
        impactedBusinessValues: ['Service de détection temps réel', 'Flux financiers'],
        impactLevel: 4,
        impactTypes: {
          availability: 3,
          integrity: 4,
          confidentiality: 2,
          authenticity: 4
        },
        consequences: [
          'Fraudes non détectées >100M€',
          'Perte d\'efficacité totale IA',
          'Retour aux contrôles manuels',
          'Crise de confiance interne',
          'Remise en cause de la stratégie IA',
          'Coûts opérationnels explosifs'
        ],
        regulatoryImpact: 'Défaillance des contrôles obligatoires',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Fuite massive des données d\'entraînement',
        description: 'Exfiltration des datasets historiques contenant cas de fraude et données personnelles sensibles',
        impactedBusinessValues: ['Données d\'entraînement', 'Données personnelles adhérents'],
        impactLevel: 4,
        impactTypes: {
          availability: 2,
          integrity: 3,
          confidentiality: 4,
          authenticity: 2
        },
        consequences: [
          'Violation RGPD massive',
          'Sanctions CNIL >100M€',
          'Exploitation par concurrents',
          'Perte d\'avantage R&D',
          'Procès individuels en masse',
          'Remise en cause du modèle'
        ],
        regulatoryImpact: 'Violation RGPD, obligations de sécurité données',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Indisponibilité prolongée du service de scoring',
        description: 'Panne du système de détection IA, retour aux contrôles manuels, dégradation massive des performances',
        impactedBusinessValues: ['Service de détection temps réel', 'Processus d\'enquête'],
        impactLevel: 3,
        impactTypes: {
          availability: 4,
          integrity: 2,
          confidentiality: 1,
          authenticity: 2
        },
        consequences: [
          'Dégradation détection fraude 90%',
          'Surcharge équipes manuelles',
          'Augmentation fraudes passantes',
          'Coûts opérationnels x10',
          'Insatisfaction adhérents',
          'Remise en cause ROI IA'
        ],
        regulatoryImpact: 'Non-respect obligations de contrôle',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Manipulation des données d\'entrée',
        description: 'Corruption des flux de données alimentant l\'IA, décisions erronées, fraudes validées à tort',
        impactedBusinessValues: ['Données personnelles adhérents', 'Flux financiers'],
        impactLevel: 3,
        impactTypes: {
          availability: 2,
          integrity: 4,
          confidentiality: 1,
          authenticity: 4
        },
        consequences: [
          'Décisions IA erronées massives',
          'Validation fraudes importantes',
          'Refus prestations légitimes',
          'Contentieux en cascade',
          'Perte de confiance algorithmes',
          'Coûts de correction majeurs'
        ],
        regulatoryImpact: 'Défaillance qualité des données',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Détournement de l\'expertise IA interne',
        description: 'Départ massif des talents IA vers la concurrence, perte de savoir-faire critique',
        impactedBusinessValues: ['Équipe Data Science', 'Algorithmes d\'IA anti-fraude'],
        impactLevel: 3,
        impactTypes: {
          availability: 4,
          integrity: 2,
          confidentiality: 3,
          authenticity: 1
        },
        consequences: [
          'Perte de compétences critiques',
          'Ralentissement innovation',
          'Dépendance prestataires externes',
          'Augmentation coûts R&D',
          'Perte d\'avantage concurrentiel',
          'Difficultés recrutement'
        ],
        regulatoryImpact: 'Risque de non-conformité par manque d\'expertise',
        createdAt: new Date().toISOString()
      }
    ];

    // Insertion des événements redoutés
    const batch3 = writeBatch(testDb);
    dreadedEvents.forEach(de => {
      const ref = doc(collection(testDb, 'dreadedEvents'));
      batch3.set(ref, de);
    });
    await batch3.commit();
    // console.log supprimé;
  }

  /**
   * ATELIER 2 - IA ANTI-FRAUDE: Sources de risque
   */
  static async createAntiFraudWorkshop2(missionId: string): Promise<void> {
    console.log('🎯 Création Atelier 2 - Sources de risque IA Anti-Fraude...');

    const riskSources = [
      {
        missionId,
        name: 'Fraudeurs sophistiqués utilisant l\'IA',
        description: 'Organisations criminelles utilisant l\'IA pour contourner les systèmes de détection automatisée',
        category: 'externe',
        type: 'cybercriminel IA',
        motivation: 'financière',
        capabilities: [
          'Adversarial machine learning',
          'Génération de faux profils par IA',
          'Optimisation des patterns de fraude',
          'Contournement algorithmes de détection',
          'Deep fakes pour usurpation d\'identité'
        ],
        resources: 'très élevées',
        sophistication: 'très élevée',
        targets: ['Algorithmes IA', 'Données d\'entraînement', 'Processus de scoring'],
        geographicScope: 'international',
        historicalActivity: 'Émergence récente, croissance exponentielle',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Data scientists malveillants',
        description: 'Experts internes en IA introduisant des backdoors ou biais dans les modèles',
        category: 'interne',
        type: 'menace interne experte',
        motivation: 'financière/idéologique',
        capabilities: [
          'Connaissance approfondie des modèles',
          'Accès privilégié aux données',
          'Modification subtile des algorithmes',
          'Introduction de biais cachés',
          'Sabotage de la performance'
        ],
        resources: 'moyennes',
        sophistication: 'très élevée',
        targets: ['Modèles ML', 'Pipeline MLOps', 'Données d\'entraînement'],
        geographicScope: 'local',
        historicalActivity: 'Cas isolés documentés dans l\'industrie',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Concurrents industriels',
        description: 'Acteurs du marché cherchant à voler la propriété intellectuelle IA',
        category: 'externe',
        type: 'espionnage industriel',
        motivation: 'concurrentielle',
        capabilities: [
          'Espionnage économique',
          'Recrutement de talents',
          'Reverse engineering',
          'Infiltration partenaires',
          'Cyberattaques ciblées'
        ],
        resources: 'élevées',
        sophistication: 'élevée',
        targets: ['Algorithmes propriétaires', 'Équipes R&D', 'Données stratégiques'],
        geographicScope: 'international',
        historicalActivity: 'Intensification avec l\'essor de l\'IA',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Régulateurs et autorités de contrôle',
        description: 'Organismes de régulation pouvant imposer des contraintes sur l\'usage de l\'IA',
        category: 'externe',
        type: 'réglementaire',
        motivation: 'conformité/protection',
        capabilities: [
          'Pouvoir de sanction',
          'Audits approfondis',
          'Obligations de transparence',
          'Restrictions d\'usage',
          'Sanctions financières'
        ],
        resources: 'illimitées',
        sophistication: 'élevée',
        targets: ['Conformité algorithmes', 'Explicabilité', 'Non-discrimination'],
        geographicScope: 'national/européen',
        historicalActivity: 'Renforcement avec AI Act et RGPD',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Groupes de défense des droits',
        description: 'ONG et associations militant contre les biais algorithmiques et la surveillance',
        category: 'externe',
        type: 'activisme',
        motivation: 'idéologique/droits humains',
        capabilities: [
          'Mobilisation médiatique',
          'Actions en justice',
          'Recherche de biais',
          'Campagnes de sensibilisation',
          'Pression politique'
        ],
        resources: 'moyennes',
        sophistication: 'moyenne',
        targets: ['Réputation', 'Acceptabilité sociale', 'Conformité éthique'],
        geographicScope: 'national/international',
        historicalActivity: 'Multiplication des actions anti-IA',
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Fournisseurs et prestataires IA',
        description: 'Partenaires technologiques pouvant introduire des vulnérabilités',
        category: 'externe',
        type: 'supply chain',
        motivation: 'négligence/malveillance',
        capabilities: [
          'Accès aux systèmes',
          'Modification de composants',
          'Introduction de backdoors',
          'Dépendances vulnérables',
          'Arrêt de support'
        ],
        resources: 'variables',
        sophistication: 'variable',
        targets: ['Infrastructure IA', 'Modèles tiers', 'APIs'],
        geographicScope: 'international',
        historicalActivity: 'Incidents supply chain en augmentation',
        createdAt: new Date().toISOString()
      }
    ];

    const batch = writeBatch(testDb);
    riskSources.forEach(rs => {
      const ref = doc(collection(testDb, 'riskSources'));
      batch.set(ref, rs);
    });
    await batch.commit();
    // console.log supprimé;
  }

  /**
   * ATELIER 3 - IA ANTI-FRAUDE: Scénarios stratégiques
   */
  static async createAntiFraudWorkshop3(missionId: string): Promise<void> {
    console.log('🎯 Création Atelier 3 - Scénarios stratégiques IA Anti-Fraude...');

    const strategicScenarios = [
      {
        missionId,
        name: 'Attaque adversariale sophistiquée sur les modèles',
        description: 'Campagne coordonnée d\'attaques adversariales pour compromettre la détection de fraude',
        riskSource: 'Fraudeurs sophistiqués utilisant l\'IA',
        targetedAssets: ['Algorithmes d\'IA anti-fraude', 'Service de détection temps réel'],
        attackPath: 'Reconnaissance modèles → Génération adversarial examples → Test à grande échelle → Exploitation',
        likelihood: 4,
        impact: 5,
        riskLevel: 'high',
        businessImpact: 'Contournement massif détection, fraudes non détectées >100M€',
        timeframe: '6-18 mois',
        indicators: ['Patterns anormaux dans les données', 'Baisse performance modèles', 'Fraudes sophistiquées'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Sabotage interne des algorithmes d\'IA',
        description: 'Data scientist malveillant introduisant des backdoors dans les modèles de production',
        riskSource: 'Data scientists malveillants',
        targetedAssets: ['Pipeline MLOps', 'Données d\'entraînement'],
        attackPath: 'Accès légitime → Modification subtile modèles → Introduction biais → Validation complice',
        likelihood: 2,
        impact: 5,
        riskLevel: 'high',
        businessImpact: 'Compromission long terme des modèles, biais cachés, perte de confiance',
        timeframe: '3-12 mois',
        indicators: ['Changements performance inexpliqués', 'Modifications code suspectes', 'Comportements anormaux'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Vol de propriété intellectuelle IA',
        description: 'Espionnage industriel ciblant les algorithmes propriétaires et données d\'entraînement',
        riskSource: 'Concurrents industriels',
        targetedAssets: ['Algorithmes d\'IA anti-fraude', 'Équipe Data Science'],
        attackPath: 'Recrutement talents → Infiltration → Exfiltration IP → Reverse engineering',
        likelihood: 3,
        impact: 3,
        riskLevel: 'medium',
        businessImpact: 'Perte avantage concurrentiel, copycat produits, dévaluation R&D',
        timeframe: '12-24 mois',
        indicators: ['Départs talents clés', 'Tentatives recrutement agressif', 'Produits concurrents similaires'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Sanctions réglementaires pour biais algorithmiques',
        description: 'Découverte de biais discriminatoires entraînant des sanctions AI Act',
        riskSource: 'Régulateurs et autorités de contrôle',
        targetedAssets: ['Conformité réglementaire', 'Réputation et confiance'],
        attackPath: 'Audit réglementaire → Détection biais → Investigation → Sanctions',
        likelihood: 4,
        impact: 4,
        riskLevel: 'high',
        businessImpact: 'Sanctions >50M€, arrêt forcé IA, crise de confiance majeure',
        timeframe: '6-12 mois',
        indicators: ['Audits réglementaires', 'Plaintes discrimination', 'Études académiques critiques'],
        createdAt: new Date().toISOString()
      }
    ];

    const batch = writeBatch(testDb);
    strategicScenarios.forEach(ss => {
      const ref = doc(collection(testDb, 'strategicScenarios'));
      batch.set(ref, ss);
    });
    await batch.commit();
    // console.log supprimé;
  }

  /**
   * ATELIER 4 - IA ANTI-FRAUDE: Scénarios opérationnels
   */
  static async createAntiFraudWorkshop4(missionId: string): Promise<void> {
    console.log('🎯 Création Atelier 4 - Scénarios opérationnels IA Anti-Fraude...');

    const operationalScenarios = [
      {
        missionId,
        name: 'Empoisonnement des données d\'entraînement',
        description: 'Injection de données malveillantes dans le dataset pour corrompre l\'apprentissage',
        strategicScenario: 'Attaque adversariale sophistiquée sur les modèles',
        technicalSteps: [
          'Identification des sources de données',
          'Génération de faux cas de fraude étiquetés',
          'Injection via canaux légitimes (DSN, déclarations)',
          'Contamination progressive du dataset',
          'Réentraînement avec données empoisonnées',
          'Dégradation performance sur vrais cas'
        ],
        likelihood: 2,
        impact: 4,
        riskLevel: 'high',
        technicalDetails: 'Data poisoning attack, label flipping, gradient ascent',
        prerequisites: 'Accès aux flux de données, connaissance du pipeline ML',
        detectionMethods: ['Validation croisée', 'Détection d\'outliers', 'Audit données'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Attaque par inversion de modèle',
        description: 'Reconstruction des données d\'entraînement à partir des réponses du modèle',
        strategicScenario: 'Vol de propriété intellectuelle IA',
        technicalSteps: [
          'Interrogation massive du modèle via API',
          'Analyse des patterns de réponse',
          'Algorithmes d\'inversion de modèle',
          'Reconstruction partielle des données',
          'Extraction de cas de fraude sensibles',
          'Exploitation des informations obtenues'
        ],
        likelihood: 3,
        impact: 3,
        riskLevel: 'medium',
        technicalDetails: 'Model inversion attack, membership inference, gradient leakage',
        prerequisites: 'Accès API, expertise ML, ressources computationnelles',
        detectionMethods: ['Rate limiting', 'Analyse patterns requêtes', 'Differential privacy'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Manipulation des features en temps réel',
        description: 'Modification des caractéristiques d\'entrée pour tromper le système de scoring',
        strategicScenario: 'Attaque adversariale sophistiquée sur les modèles',
        technicalSteps: [
          'Analyse des features utilisées par le modèle',
          'Identification des seuils de décision',
          'Génération d\'exemples adversariaux',
          'Modification des données d\'entrée réelles',
          'Soumission de dossiers manipulés',
          'Validation frauduleuse par l\'IA'
        ],
        likelihood: 4,
        impact: 5,
        riskLevel: 'high',
        technicalDetails: 'Adversarial examples, FGSM, PGD, feature manipulation',
        prerequisites: 'Connaissance architecture modèle, accès aux données',
        detectionMethods: ['Détection d\'anomalies', 'Validation humaine', 'Ensemble methods'],
        createdAt: new Date().toISOString()
      }
    ];

    const batch = writeBatch(testDb);
    operationalScenarios.forEach(os => {
      const ref = doc(collection(testDb, 'operationalScenarios'));
      batch.set(ref, os);
    });
    await batch.commit();
    // console.log supprimé;
  }

  /**
   * ATELIER 5 - IA ANTI-FRAUDE: Mesures de sécurité
   */
  static async createAntiFraudWorkshop5(missionId: string): Promise<void> {
    console.log('🎯 Création Atelier 5 - Mesures de sécurité IA Anti-Fraude...');

    const securityMeasures = [
      {
        missionId,
        name: 'Détection d\'attaques adversariales',
        description: 'Système de détection en temps réel des tentatives d\'attaque adversariale sur les modèles',
        type: 'technique',
        category: 'détection',
        status: 'in-progress',
        effectiveness: 4,
        cost: 3,
        implementation: 'Détecteurs statistiques, analyse de confiance, ensemble de modèles',
        coverage: ['API de scoring', 'Inputs modèles', 'Réponses système'],
        compliance: ['AI Act', 'Sécurité IA'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Chiffrement et protection des modèles',
        description: 'Chiffrement homomorphe et techniques de protection des modèles ML en production',
        type: 'technique',
        category: 'protection',
        status: 'planned',
        effectiveness: 5,
        cost: 4,
        implementation: 'Homomorphic encryption, secure multi-party computation, model encryption',
        coverage: ['Modèles ML', 'Inférence', 'Données sensibles'],
        compliance: ['RGPD', 'Protection IP'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Audit et explicabilité des décisions IA',
        description: 'Système d\'audit complet avec explicabilité des décisions pour conformité réglementaire',
        type: 'organisationnel',
        category: 'gouvernance',
        status: 'implemented',
        effectiveness: 4,
        cost: 3,
        implementation: 'LIME, SHAP, audit trails, dashboards explicabilité',
        coverage: ['Toutes les décisions IA', 'Processus ML', 'Conformité'],
        compliance: ['AI Act', 'RGPD', 'Transparence'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Tests de robustesse et red team IA',
        description: 'Tests d\'intrusion spécialisés IA et exercices red team pour valider la sécurité',
        type: 'organisationnel',
        category: 'évaluation',
        status: 'in-progress',
        effectiveness: 5,
        cost: 4,
        implementation: 'Red team IA, adversarial testing, robustness evaluation',
        coverage: ['Modèles ML', 'Pipeline MLOps', 'APIs'],
        compliance: ['Sécurité IA', 'Best practices'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Differential Privacy pour les données',
        description: 'Protection de la vie privée dans les datasets avec differential privacy',
        type: 'technique',
        category: 'privacy',
        status: 'implemented',
        effectiveness: 4,
        cost: 3,
        implementation: 'Algorithmes DP, noise injection, privacy budget management',
        coverage: ['Données d\'entraînement', 'Statistiques', 'Recherche'],
        compliance: ['RGPD', 'Protection données'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Monitoring continu des modèles ML',
        description: 'Surveillance 24/7 de la performance et dérive des modèles en production',
        type: 'technique',
        category: 'monitoring',
        status: 'implemented',
        effectiveness: 5,
        cost: 2,
        implementation: 'MLOps monitoring, drift detection, performance tracking',
        coverage: ['Performance modèles', 'Qualité données', 'Biais'],
        compliance: ['AI Act', 'Qualité'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Formation spécialisée sécurité IA',
        description: 'Programme de formation sur les risques spécifiques à l\'IA et les contre-mesures',
        type: 'humain',
        category: 'formation',
        status: 'in-progress',
        effectiveness: 3,
        cost: 2,
        implementation: 'Modules spécialisés, certifications, veille technologique',
        coverage: ['Équipes IA', 'Sécurité', 'Management'],
        compliance: ['Formation continue'],
        createdAt: new Date().toISOString()
      },
      {
        missionId,
        name: 'Gouvernance éthique et comité IA',
        description: 'Structure de gouvernance pour validation éthique et conformité des projets IA',
        type: 'organisationnel',
        category: 'gouvernance',
        status: 'implemented',
        effectiveness: 4,
        cost: 3,
        implementation: 'Comité éthique, processus validation, guidelines internes',
        coverage: ['Projets IA', 'Décisions critiques', 'Conformité'],
        compliance: ['AI Act', 'Éthique IA'],
        createdAt: new Date().toISOString()
      }
    ];

    const batch = writeBatch(testDb);
    securityMeasures.forEach(sm => {
      const ref = doc(collection(testDb, 'securityMeasures'));
      batch.set(ref, sm);
    });
    await batch.commit();
    // console.log supprimé;
  }
}

export default AntiFraudAIMissionService;
