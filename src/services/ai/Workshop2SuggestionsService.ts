/**
 * Service de suggestions IA spécialisé pour Workshop 2
 * Templates pour objectifs et modes opératoires avec MITRE ATT&CK
 */

import type { RiskSource, RiskObjective, OperationalMode, BusinessValue } from '../../types/ebios';
import { EnhancedSuggestion } from './EnhancedSuggestionsService';

export class Workshop2SuggestionsService {
  
  /**
   * Templates d'objectifs enrichis avec MITRE ATT&CK
   */
  static getRiskObjectiveTemplates(
    riskSource: RiskSource,
    businessValues: BusinessValue[]
  ): Omit<EnhancedSuggestion, 'id' | 'type'>[] {
    const templates: Omit<EnhancedSuggestion, 'id' | 'type'>[] = [];
    
    const hasDataAssets = businessValues.some(bv => 
      bv.name.toLowerCase().includes('données') || 
      bv.description?.toLowerCase().includes('information')
    );
    const hasFinancialAssets = businessValues.some(bv => 
      bv.category === 'primary' && 
      (bv.name.toLowerCase().includes('financ') || bv.name.toLowerCase().includes('revenus'))
    );

    // Objectifs selon le type de source de risque
    switch (riskSource.category) {
      case 'cybercriminal':
        if (hasDataAssets) {
          templates.push({
            title: 'Voler des données personnelles sensibles',
            description: 'Exfiltrer des informations personnelles pour revente sur le dark web',
            priority: 'critical',
            frameworks: {
              mitre: ['T1041', 'T1020', 'T1005'], // Exfiltration Over C2, Data Staged, Data from Local System
              iso27002: ['8.12', '8.24'], // DLP, Cryptography
              nist: ['PR.DS-1', 'DE.AE-2'], // Data Security, Anomaly Detection
              cis: ['CIS-3', 'CIS-14'] // Data Protection, Awareness
            },
            reasoning: 'Objectif typique des cybercriminels selon MITRE T1041/T1020',
            confidence: 0.95
          });
        }
        
        if (hasFinancialAssets) {
          templates.push({
            title: 'Chiffrer les données pour rançon',
            description: 'Déployer un ransomware pour extorquer des fonds',
            priority: 'critical',
            frameworks: {
              mitre: ['T1486', 'T1490', 'T1489'], // Data Encrypted for Impact, Inhibit System Recovery, Service Stop
              iso27002: ['8.7', '8.11'], // Anti-malware, Backup
              nist: ['PR.PT-1', 'RC.RP-1'], // Protective Technology, Recovery
              cis: ['CIS-10', 'CIS-11'] // Malware Defenses, Data Recovery
            },
            reasoning: 'Objectif ransomware selon MITRE T1486 et CIS-10/11',
            confidence: 0.9
          });
        }
        break;

      case 'state':
        templates.push(
          {
            title: 'Établir une persistance long terme',
            description: 'Maintenir un accès discret pour surveillance continue',
            priority: 'critical',
            frameworks: {
              mitre: ['T1053', 'T1547', 'T1574'], // Scheduled Task, Boot Autostart, Hijack Execution Flow
              iso27002: ['8.16', '8.25'], // Monitoring, Threat Intelligence
              nist: ['DE.CM-1', 'RS.AN-1'], // Continuous Monitoring, Analysis
              cis: ['CIS-8', 'CIS-13'] // Audit Logs, Network Monitoring
            },
            reasoning: 'Tactique APT selon MITRE T1053/T1547 et NIST DE.CM-1',
            confidence: 0.9
          },
          {
            title: 'Collecter des renseignements stratégiques',
            description: 'Obtenir des informations d\'intelligence économique ou politique',
            priority: 'high',
            frameworks: {
              mitre: ['T1083', 'T1005', 'T1039'], // File Discovery, Data from Local System, Data from Network Shared Drive
              iso27002: ['8.12', '8.16'], // DLP, Monitoring
              nist: ['PR.DS-1', 'DE.AE-2'], // Data Security, Anomaly Detection
              cis: ['CIS-3', 'CIS-8'] // Data Protection, Audit Logs
            },
            reasoning: 'Espionnage étatique selon MITRE T1083/T1005',
            confidence: 0.85
          }
        );
        break;

      case 'insider':
        templates.push(
          {
            title: 'Accéder à des informations privilégiées',
            description: 'Exploiter les privilèges d\'accès pour obtenir des données sensibles',
            priority: 'high',
            frameworks: {
              mitre: ['T1078', 'T1083', 'T1005'], // Valid Accounts, File Discovery, Data from Local System
              iso27002: ['8.2', '8.5'], // Privileged Access, MFA
              nist: ['PR.AC-1', 'DE.CM-3'], // Access Control, Personnel Monitoring
              cis: ['CIS-5', 'CIS-6'] // Account Management, Access Control
            },
            reasoning: 'Abus de privilèges selon MITRE T1078 et CIS-5/6',
            confidence: 0.8
          },
          {
            title: 'Saboter les opérations critiques',
            description: 'Perturber intentionnellement les processus métier essentiels',
            priority: 'high',
            frameworks: {
              mitre: ['T1489', 'T1485', 'T1070'], // Service Stop, Data Destruction, Indicator Removal
              iso27002: ['8.14', '8.16'], // Business Continuity, Monitoring
              nist: ['RC.RP-1', 'DE.CM-3'], // Recovery Planning, Personnel Monitoring
              cis: ['CIS-11', 'CIS-8'] // Data Recovery, Audit Logs
            },
            reasoning: 'Sabotage interne selon MITRE T1489/T1485',
            confidence: 0.75
          }
        );
        break;

      case 'activist':
        templates.push(
          {
            title: 'Perturber les services publics',
            description: 'Rendre indisponibles les services pour protester',
            priority: 'medium',
            frameworks: {
              mitre: ['T1498', 'T1499', 'T1565'], // Network DoS, Endpoint DoS, Data Manipulation
              iso27002: ['8.6', '8.16'], // Capacity Management, Monitoring
              nist: ['PR.PT-4', 'DE.AE-1'], // Communications Protection, Anomaly Detection
              cis: ['CIS-12', 'CIS-13'] // Network Infrastructure, Network Monitoring
            },
            reasoning: 'Attaques DDoS selon MITRE T1498/T1499 et CIS-12/13',
            confidence: 0.7
          },
          {
            title: 'Défigurer le site web institutionnel',
            description: 'Modifier le contenu web pour diffuser un message politique',
            priority: 'medium',
            frameworks: {
              mitre: ['T1190', 'T1565', 'T1505'], // Exploit Public-Facing Application, Data Manipulation, Server Software Component
              iso27002: ['8.8', '8.16'], // Secure Development, Monitoring
              nist: ['PR.IP-1', 'DE.CM-1'], // Baseline Configuration, Continuous Monitoring
              cis: ['CIS-4', 'CIS-8'] // Secure Configuration, Audit Logs
            },
            reasoning: 'Défiguration web selon MITRE T1190/T1565',
            confidence: 0.65
          }
        );
        break;

      default:
        // Objectifs génériques
        templates.push(
          {
            title: 'Compromettre l\'infrastructure IT',
            description: 'Obtenir un accès initial aux systèmes d\'information',
            priority: 'high',
            frameworks: {
              mitre: ['T1190', 'T1566', 'T1078'], // Exploit Public-Facing Application, Phishing, Valid Accounts
              iso27002: ['8.8', '8.5'], // Secure Development, MFA
              nist: ['PR.IP-1', 'PR.AC-1'], // Baseline Configuration, Access Control
              cis: ['CIS-4', 'CIS-5'] // Secure Configuration, Account Management
            },
            reasoning: 'Accès initial selon MITRE T1190/T1566',
            confidence: 0.8
          },
          {
            title: 'Escalader les privilèges système',
            description: 'Obtenir des droits administrateur pour contrôler les systèmes',
            priority: 'high',
            frameworks: {
              mitre: ['T1068', 'T1055', 'T1134'], // Exploitation for Privilege Escalation, Process Injection, Access Token Manipulation
              iso27002: ['8.2', '8.9'], // Privileged Access, Configuration Management
              nist: ['PR.AC-1', 'PR.IP-1'], // Access Control, Baseline Configuration
              cis: ['CIS-5', 'CIS-4'] // Account Management, Secure Configuration
            },
            reasoning: 'Escalade de privilèges selon MITRE T1068/T1055',
            confidence: 0.75
          }
        );
    }

    return templates;
  }

  /**
   * Templates de modes opératoires enrichis avec MITRE ATT&CK
   */
  static getOperationalModeTemplates(
    riskSource: RiskSource,
    objective: RiskObjective
  ): Omit<EnhancedSuggestion, 'id' | 'type'>[] {
    const templates: Omit<EnhancedSuggestion, 'id' | 'type'>[] = [];
    
    const objectiveName = objective.name.toLowerCase();
    
    // Modes selon l'objectif et la source
    if (objectiveName.includes('données') || objectiveName.includes('information')) {
      templates.push(
        {
          title: 'Phishing ciblé (spear phishing)',
          description: 'Emails personnalisés pour voler les identifiants d\'accès',
          priority: 'critical',
          frameworks: {
            mitre: ['T1566.001', 'T1078', 'T1083'], // Spearphishing Attachment, Valid Accounts, File Discovery
            iso27002: ['8.5', '8.31'], // MFA, Awareness Training
            nist: ['PR.AC-1', 'PR.AT-1'], // Access Control, Awareness Training
            cis: ['CIS-14', 'CIS-5'] // Awareness Training, Account Management
          },
          reasoning: 'Vecteur d\'attaque principal selon MITRE T1566.001 et CIS-14',
          confidence: 0.9
        },
        {
          title: 'Exploitation de vulnérabilités web',
          description: 'Attaques sur les applications web exposées (SQL injection, XSS)',
          priority: 'high',
          frameworks: {
            mitre: ['T1190', 'T1505', 'T1083'], // Exploit Public-Facing Application, Server Software Component, File Discovery
            iso27002: ['8.8', '8.25'], // Secure Development, Vulnerability Management
            nist: ['PR.IP-1', 'DE.CM-1'], // Baseline Configuration, Continuous Monitoring
            cis: ['CIS-4', 'CIS-18'] // Secure Configuration, Application Software Security
          },
          reasoning: 'Exploitation web selon MITRE T1190 et CIS-18',
          confidence: 0.85
        }
      );
    }

    if (objectiveName.includes('chiffrer') || objectiveName.includes('ransomware')) {
      templates.push(
        {
          title: 'Déploiement de ransomware via RDP',
          description: 'Accès par bureau à distance compromis pour installer le ransomware',
          priority: 'critical',
          frameworks: {
            mitre: ['T1021.001', 'T1486', 'T1490'], // Remote Desktop Protocol, Data Encrypted for Impact, Inhibit System Recovery
            iso27002: ['8.5', '8.7'], // MFA, Anti-malware
            nist: ['PR.AC-1', 'PR.PT-1'], // Access Control, Protective Technology
            cis: ['CIS-5', 'CIS-10'] // Account Management, Malware Defenses
          },
          reasoning: 'Vecteur ransomware selon MITRE T1021.001/T1486',
          confidence: 0.9
        },
        {
          title: 'Propagation latérale par SMB',
          description: 'Diffusion du malware via les partages réseau Windows',
          priority: 'high',
          frameworks: {
            mitre: ['T1021.002', 'T1570', 'T1486'], // SMB/Windows Admin Shares, Lateral Tool Transfer, Data Encrypted for Impact
            iso27002: ['8.6', '8.16'], // Network Management, Monitoring
            nist: ['PR.AC-5', 'DE.CM-1'], // Network Integrity, Continuous Monitoring
            cis: ['CIS-12', 'CIS-13'] // Network Infrastructure, Network Monitoring
          },
          reasoning: 'Propagation SMB selon MITRE T1021.002/T1570',
          confidence: 0.8
        }
      );
    }

    if (objectiveName.includes('persistance') || objectiveName.includes('surveillance')) {
      templates.push(
        {
          title: 'Implantation de backdoor persistante',
          description: 'Installation d\'un accès permanent via tâches planifiées',
          priority: 'critical',
          frameworks: {
            mitre: ['T1053', 'T1547', 'T1071'], // Scheduled Task, Boot Autostart, Application Layer Protocol
            iso27002: ['8.16', '8.9'], // Monitoring, Configuration Management
            nist: ['DE.CM-1', 'PR.IP-1'], // Continuous Monitoring, Baseline Configuration
            cis: ['CIS-8', 'CIS-4'] // Audit Logs, Secure Configuration
          },
          reasoning: 'Persistance APT selon MITRE T1053/T1547',
          confidence: 0.85
        },
        {
          title: 'Communication C2 chiffrée',
          description: 'Canal de commande et contrôle via HTTPS légitime',
          priority: 'high',
          frameworks: {
            mitre: ['T1071.001', 'T1573', 'T1090'], // Web Protocols, Encrypted Channel, Proxy
            iso27002: ['8.16', '8.25'], // Monitoring, Threat Intelligence
            nist: ['DE.CM-1', 'DE.AE-2'], // Continuous Monitoring, Anomaly Detection
            cis: ['CIS-13', 'CIS-8'] // Network Monitoring, Audit Logs
          },
          reasoning: 'Communication C2 selon MITRE T1071.001/T1573',
          confidence: 0.8
        }
      );
    }

    // Modes génériques selon le niveau d'expertise de la source
    if (riskSource.expertise === 'expert' || riskSource.expertise === 'high') {
      templates.push({
        title: 'Attaque de la chaîne d\'approvisionnement',
        description: 'Compromission via un fournisseur ou partenaire de confiance',
        priority: 'critical',
        frameworks: {
          mitre: ['T1195', 'T1199', 'T1078'], // Supply Chain Compromise, Trusted Relationship, Valid Accounts
          iso27002: ['8.30', '8.25'], // Supplier Relationships, Threat Intelligence
          nist: ['ID.SC-1', 'PR.AC-1'], // Supply Chain Risk Management, Access Control
          cis: ['CIS-1', 'CIS-5'] // Asset Inventory, Account Management
        },
        reasoning: 'Attaque sophistiquée selon MITRE T1195/T1199',
        confidence: 0.75
      });
    } else {
      templates.push({
        title: 'Utilisation d\'outils automatisés',
        description: 'Déploiement de scripts et outils publics (Metasploit, Cobalt Strike)',
        priority: 'medium',
        frameworks: {
          mitre: ['T1059', 'T1105', 'T1027'], // Command and Scripting Interpreter, Ingress Tool Transfer, Obfuscated Files
          iso27002: ['8.7', '8.16'], // Anti-malware, Monitoring
          nist: ['PR.PT-1', 'DE.CM-1'], // Protective Technology, Continuous Monitoring
          cis: ['CIS-10', 'CIS-8'] // Malware Defenses, Audit Logs
        },
        reasoning: 'Outils automatisés selon MITRE T1059/T1105',
        confidence: 0.7
      });
    }

    return templates;
  }
}
