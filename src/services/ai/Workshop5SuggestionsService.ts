/**
 * Service de suggestions IA spécialisé pour Workshop 5
 * Génération de mesures de sécurité enrichies avec référentiels
 */

import type { StrategicScenario, SecurityMeasure, SupportingAsset } from '../../types/ebios';
import { EnhancedSuggestion } from './EnhancedSuggestionsService';

export interface SecurityMeasureSuggestion extends EnhancedSuggestion {
  controlType: 'preventive' | 'detective' | 'corrective';
  effectiveness: number; // 1-4
  implementationCost: 'low' | 'medium' | 'high' | 'very_high';
  complexity: number; // 1-4
  riskReduction: number; // Pourcentage
  nistReference?: string;
  isoControl?: string;
  cisControl?: string;
  targetedScenarios: string[];
  dependencies: string[];
  implementationTime: string;
}

export class Workshop5SuggestionsService {
  
  /**
   * Génère des suggestions de mesures de sécurité enrichies
   */
  static generateSecurityMeasureSuggestions(
    scenarios: StrategicScenario[],
    assets: SupportingAsset[],
    existingMeasures: SecurityMeasure[] = []
  ): SecurityMeasureSuggestion[] {
    const suggestions: SecurityMeasureSuggestion[] = [];
    const existingNames = existingMeasures.map(m => m.name.toLowerCase());
    
    // Analyser les scénarios pour identifier les besoins
    const criticalScenarios = scenarios.filter(s => (s.likelihood || 2) * (s.gravity || 2) >= 9);
    const hasDataAssets = assets.some(a => a.name.toLowerCase().includes('données') || a.name.toLowerCase().includes('information'));
    const hasSystemAssets = assets.some(a => a.name.toLowerCase().includes('système') || a.name.toLowerCase().includes('serveur'));
    const hasNetworkAssets = assets.some(a => a.name.toLowerCase().includes('réseau') || a.name.toLowerCase().includes('infrastructure'));
    
    // Mesures préventives
    const preventiveMeasures = this.getPreventiveMeasures(criticalScenarios, hasDataAssets, hasSystemAssets, hasNetworkAssets);
    suggestions.push(...preventiveMeasures.filter(m => !existingNames.includes(m.title.toLowerCase())));
    
    // Mesures détectives
    const detectiveMeasures = this.getDetectiveMeasures(criticalScenarios, hasDataAssets, hasSystemAssets, hasNetworkAssets);
    suggestions.push(...detectiveMeasures.filter(m => !existingNames.includes(m.title.toLowerCase())));
    
    // Mesures correctives
    const correctiveMeasures = this.getCorrectiveMeasures(criticalScenarios, hasDataAssets, hasSystemAssets, hasNetworkAssets);
    suggestions.push(...correctiveMeasures.filter(m => !existingNames.includes(m.title.toLowerCase())));
    
    return suggestions.slice(0, 12); // Limiter à 12 suggestions
  }

  /**
   * Mesures préventives enrichies avec référentiels
   */
  private static getPreventiveMeasures(
    criticalScenarios: StrategicScenario[],
    hasDataAssets: boolean,
    hasSystemAssets: boolean,
    hasNetworkAssets: boolean
  ): SecurityMeasureSuggestion[] {
    const measures: SecurityMeasureSuggestion[] = [];

    // Authentification multi-facteurs
    measures.push({
      id: 'prev-mfa',
      type: 'securityMeasure',
      title: 'Authentification Multi-Facteurs (MFA)',
      description: 'Déploiement MFA sur tous les comptes privilégiés et critiques',
      priority: 'critical',
      controlType: 'preventive',
      effectiveness: 4,
      implementationCost: 'medium',
      complexity: 2,
      riskReduction: 40,
      frameworks: {
        nist: ['IA-2', 'IA-5'],
        iso27002: ['A.9.4.2', 'A.9.4.3'],
        cis: ['CIS-5', 'CIS-6']
      },
      reasoning: 'MFA réduit drastiquement les risques d\'usurpation d\'identité selon NIST IA-2',
      confidence: 0.95,
      nistReference: 'IA-2',
      isoControl: 'A.9.4.2',
      cisControl: 'CIS-5',
      targetedScenarios: criticalScenarios.slice(0, 3).map(s => s.id),
      dependencies: ['Inventaire des comptes privilégiés', 'Solution MFA'],
      implementationTime: '2-3 mois'
    });

    if (hasNetworkAssets) {
      // Segmentation réseau
      measures.push({
        id: 'prev-segmentation',
        type: 'securityMeasure',
        title: 'Segmentation Réseau par Zones',
        description: 'Isolation des réseaux critiques avec contrôles d\'accès stricts',
        priority: 'critical',
        controlType: 'preventive',
        effectiveness: 4,
        implementationCost: 'high',
        complexity: 4,
        riskReduction: 50,
        frameworks: {
          nist: ['SC-7', 'AC-4'],
          iso27002: ['A.13.1.3', 'A.13.2.1'],
          cis: ['CIS-12', 'CIS-13']
        },
        reasoning: 'Segmentation limite la propagation latérale selon NIST SC-7 et CIS-12',
        confidence: 0.9,
        nistReference: 'SC-7',
        isoControl: 'A.13.1.3',
        cisControl: 'CIS-12',
        targetedScenarios: criticalScenarios.map(s => s.id),
        dependencies: ['Audit réseau', 'Firewalls nouvelle génération'],
        implementationTime: '4-6 mois'
      });
    }

    if (hasDataAssets) {
      // Chiffrement des données
      measures.push({
        id: 'prev-encryption',
        type: 'securityMeasure',
        title: 'Chiffrement des Données Sensibles',
        description: 'Chiffrement au repos et en transit pour toutes les données critiques',
        priority: 'critical',
        controlType: 'preventive',
        effectiveness: 4,
        implementationCost: 'medium',
        complexity: 3,
        riskReduction: 45,
        frameworks: {
          nist: ['SC-13', 'SC-8'],
          iso27002: ['A.10.1.1', 'A.13.2.3'],
          cis: ['CIS-3', 'CIS-14']
        },
        reasoning: 'Chiffrement protège contre l\'exfiltration selon NIST SC-13 et ISO A.10.1.1',
        confidence: 0.9,
        nistReference: 'SC-13',
        isoControl: 'A.10.1.1',
        cisControl: 'CIS-3',
        targetedScenarios: criticalScenarios.filter(s => s.name?.toLowerCase().includes('données')).map(s => s.id),
        dependencies: ['Solution de chiffrement', 'Gestion des clés'],
        implementationTime: '3-4 mois'
      });
    }

    // Formation sensibilisation
    measures.push({
      id: 'prev-training',
      type: 'securityMeasure',
      title: 'Programme de Sensibilisation Cyber',
      description: 'Formation continue du personnel aux menaces cyber',
      priority: 'high',
      controlType: 'preventive',
      effectiveness: 3,
      implementationCost: 'low',
      complexity: 2,
      riskReduction: 30,
      frameworks: {
        nist: ['AT-2', 'AT-3'],
        iso27002: ['A.7.2.2', 'A.16.1.6'],
        cis: ['CIS-14', 'CIS-17']
      },
      reasoning: 'Formation réduit le facteur humain selon NIST AT-2 et CIS-14',
      confidence: 0.85,
      nistReference: 'AT-2',
      isoControl: 'A.7.2.2',
      cisControl: 'CIS-14',
      targetedScenarios: criticalScenarios.filter(s => s.name?.toLowerCase().includes('phishing') || s.name?.toLowerCase().includes('social')).map(s => s.id),
      dependencies: ['Plateforme e-learning', 'Contenu de formation'],
      implementationTime: '1-2 mois'
    });

    return measures;
  }

  /**
   * Mesures détectives enrichies avec référentiels
   */
  private static getDetectiveMeasures(
    criticalScenarios: StrategicScenario[],
    hasDataAssets: boolean,
    hasSystemAssets: boolean,
    hasNetworkAssets: boolean
  ): SecurityMeasureSuggestion[] {
    const measures: SecurityMeasureSuggestion[] = [];

    // SIEM/SOAR
    measures.push({
      id: 'det-siem',
      type: 'securityMeasure',
      title: 'SIEM/SOAR Nouvelle Génération',
      description: 'Solution de détection et réponse automatisée aux incidents',
      priority: 'critical',
      controlType: 'detective',
      effectiveness: 4,
      implementationCost: 'very_high',
      complexity: 4,
      riskReduction: 60,
      frameworks: {
        nist: ['DE.CM-1', 'DE.AE-2', 'RS.AN-1'],
        iso27002: ['A.16.1.2', 'A.16.1.4'],
        cis: ['CIS-6', 'CIS-8']
      },
      reasoning: 'SIEM améliore la détection selon NIST DE.CM-1 et CIS-6',
      confidence: 0.95,
      nistReference: 'DE.CM-1',
      isoControl: 'A.16.1.2',
      cisControl: 'CIS-6',
      targetedScenarios: criticalScenarios.map(s => s.id),
      dependencies: ['Infrastructure de logs', 'Équipe SOC'],
      implementationTime: '6-9 mois'
    });

    if (hasNetworkAssets) {
      // Monitoring réseau
      measures.push({
        id: 'det-network-monitoring',
        type: 'securityMeasure',
        title: 'Monitoring Réseau Avancé',
        description: 'Surveillance du trafic réseau et détection d\'anomalies',
        priority: 'high',
        controlType: 'detective',
        effectiveness: 3,
        implementationCost: 'medium',
        complexity: 3,
        riskReduction: 35,
        frameworks: {
          nist: ['DE.CM-1', 'DE.AE-3'],
          iso27002: ['A.13.1.1', 'A.16.1.2'],
          cis: ['CIS-13', 'CIS-12']
        },
        reasoning: 'Monitoring réseau détecte les mouvements latéraux selon NIST DE.CM-1',
        confidence: 0.8,
        nistReference: 'DE.CM-1',
        isoControl: 'A.13.1.1',
        cisControl: 'CIS-13',
        targetedScenarios: criticalScenarios.filter(s => s.name?.toLowerCase().includes('latéral') || s.name?.toLowerCase().includes('propagation')).map(s => s.id),
        dependencies: ['Sondes réseau', 'Outils d\'analyse'],
        implementationTime: '3-4 mois'
      });
    }

    if (hasDataAssets) {
      // DLP
      measures.push({
        id: 'det-dlp',
        type: 'securityMeasure',
        title: 'Data Loss Prevention (DLP)',
        description: 'Prévention de la fuite de données sensibles',
        priority: 'high',
        controlType: 'detective',
        effectiveness: 4,
        implementationCost: 'high',
        complexity: 3,
        riskReduction: 40,
        frameworks: {
          nist: ['PR.DS-5', 'DE.CM-1'],
          iso27002: ['A.13.2.1', 'A.18.1.3'],
          cis: ['CIS-3', 'CIS-13']
        },
        reasoning: 'DLP protège contre l\'exfiltration selon NIST PR.DS-5 et CIS-3',
        confidence: 0.85,
        nistReference: 'PR.DS-5',
        isoControl: 'A.13.2.1',
        cisControl: 'CIS-3',
        targetedScenarios: criticalScenarios.filter(s => s.name?.toLowerCase().includes('données') || s.name?.toLowerCase().includes('exfiltration')).map(s => s.id),
        dependencies: ['Classification des données', 'Politiques DLP'],
        implementationTime: '4-5 mois'
      });
    }

    return measures;
  }

  /**
   * Mesures correctives enrichies avec référentiels
   */
  private static getCorrectiveMeasures(
    criticalScenarios: StrategicScenario[],
    hasDataAssets: boolean,
    hasSystemAssets: boolean,
    hasNetworkAssets: boolean
  ): SecurityMeasureSuggestion[] {
    const measures: SecurityMeasureSuggestion[] = [];

    // Plan de réponse aux incidents
    measures.push({
      id: 'corr-incident-response',
      type: 'securityMeasure',
      title: 'Plan de Réponse aux Incidents',
      description: 'Procédures structurées de gestion des incidents de sécurité',
      priority: 'critical',
      controlType: 'corrective',
      effectiveness: 4,
      implementationCost: 'medium',
      complexity: 3,
      riskReduction: 35,
      frameworks: {
        nist: ['RS.RP-1', 'RS.CO-1'],
        iso27002: ['A.16.1.5', 'A.16.1.6'],
        cis: ['CIS-19', 'CIS-17']
      },
      reasoning: 'Plan de réponse réduit l\'impact selon NIST RS.RP-1 et ISO A.16.1.5',
      confidence: 0.9,
      nistReference: 'RS.RP-1',
      isoControl: 'A.16.1.5',
      cisControl: 'CIS-19',
      targetedScenarios: criticalScenarios.map(s => s.id),
      dependencies: ['Équipe de réponse', 'Outils forensiques'],
      implementationTime: '2-3 mois'
    });

    // Sauvegarde et récupération
    measures.push({
      id: 'corr-backup-recovery',
      type: 'securityMeasure',
      title: 'Sauvegarde et Plan de Récupération',
      description: 'Stratégie de sauvegarde 3-2-1 et procédures de récupération',
      priority: 'critical',
      controlType: 'corrective',
      effectiveness: 4,
      implementationCost: 'medium',
      complexity: 2,
      riskReduction: 50,
      frameworks: {
        nist: ['PR.IP-4', 'RC.RP-1'],
        iso27002: ['A.12.3.1', 'A.17.1.2'],
        cis: ['CIS-11', 'CIS-10']
      },
      reasoning: 'Sauvegarde protège contre ransomware selon NIST PR.IP-4 et CIS-11',
      confidence: 0.95,
      nistReference: 'PR.IP-4',
      isoControl: 'A.12.3.1',
      cisControl: 'CIS-11',
      targetedScenarios: criticalScenarios.filter(s => s.name?.toLowerCase().includes('ransomware') || s.name?.toLowerCase().includes('chiffrement')).map(s => s.id),
      dependencies: ['Solution de sauvegarde', 'Site de récupération'],
      implementationTime: '2-4 mois'
    });

    // Communication de crise
    measures.push({
      id: 'corr-crisis-communication',
      type: 'securityMeasure',
      title: 'Plan de Communication de Crise',
      description: 'Procédures de communication en cas d\'incident majeur',
      priority: 'medium',
      controlType: 'corrective',
      effectiveness: 3,
      implementationCost: 'low',
      complexity: 2,
      riskReduction: 20,
      frameworks: {
        nist: ['RS.CO-2', 'RS.CO-3'],
        iso27002: ['A.16.1.2', 'A.6.1.3'],
        cis: ['CIS-19', 'CIS-17']
      },
      reasoning: 'Communication de crise limite l\'impact réputationnel selon NIST RS.CO-2',
      confidence: 0.75,
      nistReference: 'RS.CO-2',
      isoControl: 'A.16.1.2',
      cisControl: 'CIS-19',
      targetedScenarios: criticalScenarios.filter(s => s.name?.toLowerCase().includes('réputation') || s.name?.toLowerCase().includes('image')).map(s => s.id),
      dependencies: ['Équipe communication', 'Templates de communication'],
      implementationTime: '1-2 mois'
    });

    return measures;
  }
}
