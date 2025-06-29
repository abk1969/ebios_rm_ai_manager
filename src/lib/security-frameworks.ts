/**
 * Référentiels de sécurité internationaux pour EBIOS RM
 * Utilisé pour enrichir les recommandations de mesures de sécurité
 */

export interface SecurityControl {
  id: string;
  name: string;
  description: string;
  category: string;
  implementation: string;
  ebiosPhase?: string;
}

export interface SecurityFramework {
  name: string;
  version: string;
  controls: SecurityControl[];
}

// ISO 27002:2022 - Contrôles de sécurité de l'information
export const ISO_27002_CONTROLS: SecurityControl[] = [
  // 5. Contrôles organisationnels
  { id: '5.1', name: 'Politiques de sécurité', description: 'Définir et approuver les politiques de sécurité', category: 'Organisationnel', implementation: 'Documentation et approbation direction' },
  { id: '5.2', name: 'Rôles et responsabilités', description: 'Définir les rôles de sécurité', category: 'Organisationnel', implementation: 'Matrice RACI sécurité' },
  { id: '5.7', name: 'Renseignement sur les menaces', description: 'Collecter et analyser les menaces', category: 'Organisationnel', implementation: 'Threat Intelligence Platform', ebiosPhase: 'Workshop2' },
  
  // 6. Contrôles liés aux personnes
  { id: '6.1', name: 'Filtrage', description: 'Vérification des antécédents', category: 'Personnel', implementation: 'Processus RH de vérification' },
  { id: '6.3', name: 'Sensibilisation sécurité', description: 'Formation continue à la sécurité', category: 'Personnel', implementation: 'Programme de sensibilisation annuel' },
  
  // 7. Contrôles physiques
  { id: '7.1', name: 'Périmètres de sécurité physique', description: 'Zones sécurisées', category: 'Physique', implementation: 'Contrôle d\'accès physique' },
  { id: '7.2', name: 'Entrées physiques', description: 'Contrôle des accès physiques', category: 'Physique', implementation: 'Badges et biométrie' },
  
  // 8. Contrôles technologiques
  { id: '8.1', name: 'Dispositifs endpoints', description: 'Protection des terminaux', category: 'Technologique', implementation: 'EDR/EPP', ebiosPhase: 'Workshop5' },
  { id: '8.2', name: 'Accès privilégiés', description: 'Gestion des accès privilégiés', category: 'Technologique', implementation: 'PAM/PIM solution' },
  { id: '8.5', name: 'Authentification sécurisée', description: 'MFA obligatoire', category: 'Technologique', implementation: 'Solution MFA entreprise' },
  { id: '8.6', name: 'Gestion des capacités', description: 'Surveillance des ressources', category: 'Technologique', implementation: 'Monitoring infrastructure' },
  { id: '8.7', name: 'Protection contre les malwares', description: 'Antivirus et anti-malware', category: 'Technologique', implementation: 'Solution EDR/XDR' },
  { id: '8.8', name: 'Gestion des vulnérabilités', description: 'Scan et patch management', category: 'Technologique', implementation: 'Scanner de vulnérabilités', ebiosPhase: 'Workshop1' },
  { id: '8.9', name: 'Gestion de configuration', description: 'Baseline de sécurité', category: 'Technologique', implementation: 'CMDB et hardening' },
  { id: '8.12', name: 'Prévention fuite de données', description: 'DLP', category: 'Technologique', implementation: 'Solution DLP' },
  { id: '8.16', name: 'Surveillance des activités', description: 'Monitoring et logs', category: 'Technologique', implementation: 'SIEM/SOAR' },
  { id: '8.23', name: 'Filtrage web', description: 'Proxy et filtrage URL', category: 'Technologique', implementation: 'Proxy sécurisé' },
  { id: '8.24', name: 'Cryptographie', description: 'Chiffrement des données', category: 'Technologique', implementation: 'PKI et chiffrement' },
  { id: '8.25', name: 'Cycle de développement sécurisé', description: 'DevSecOps', category: 'Technologique', implementation: 'SAST/DAST dans CI/CD' },
  { id: '8.26', name: 'Sécurité applicative', description: 'Tests de sécurité', category: 'Technologique', implementation: 'Pentests réguliers', ebiosPhase: 'Workshop4' },
  { id: '8.28', name: 'Codage sécurisé', description: 'Standards de développement', category: 'Technologique', implementation: 'Guidelines OWASP' }
];

// CIS Controls v8 - Top 18
export const CIS_CONTROLS: SecurityControl[] = [
  { id: 'CIS-1', name: 'Inventaire des actifs', description: 'Inventaire et contrôle des actifs matériels', category: 'Basique', implementation: 'CMDB automatisée', ebiosPhase: 'Workshop1' },
  { id: 'CIS-2', name: 'Inventaire logiciel', description: 'Inventaire et contrôle des actifs logiciels', category: 'Basique', implementation: 'Software Asset Management' },
  { id: 'CIS-3', name: 'Protection des données', description: 'Gestion continue des données', category: 'Basique', implementation: 'Classification et DLP' },
  { id: 'CIS-4', name: 'Configuration sécurisée', description: 'Configuration sécurisée des actifs', category: 'Basique', implementation: 'Hardening guides' },
  { id: 'CIS-5', name: 'Gestion des comptes', description: 'Gestion des comptes utilisateurs', category: 'Basique', implementation: 'IAM/Directory services' },
  { id: 'CIS-6', name: 'Gestion des accès', description: 'Contrôle d\'accès', category: 'Basique', implementation: 'RBAC/ABAC' },
  { id: 'CIS-7', name: 'Gestion continue des vulnérabilités', description: 'Scan et remediation', category: 'Fondamental', implementation: 'Vulnerability Management', ebiosPhase: 'Workshop3' },
  { id: 'CIS-8', name: 'Gestion des logs', description: 'Collecte et analyse des logs', category: 'Fondamental', implementation: 'Log management/SIEM' },
  { id: 'CIS-9', name: 'Protection email et navigateur', description: 'Sécurité messagerie et web', category: 'Fondamental', implementation: 'Email gateway, proxy' },
  { id: 'CIS-10', name: 'Défense contre malware', description: 'Anti-malware', category: 'Fondamental', implementation: 'EDR/EPP' },
  { id: 'CIS-11', name: 'Récupération de données', description: 'Backup et restauration', category: 'Fondamental', implementation: 'Backup automatisé' },
  { id: 'CIS-12', name: 'Gestion infrastructure réseau', description: 'Sécurité réseau', category: 'Fondamental', implementation: 'Segmentation, firewall' },
  { id: 'CIS-13', name: 'Surveillance réseau', description: 'Monitoring et détection', category: 'Organisationnel', implementation: 'IDS/IPS, NDR' },
  { id: 'CIS-14', name: 'Sensibilisation sécurité', description: 'Formation utilisateurs', category: 'Organisationnel', implementation: 'Programme awareness' },
  { id: 'CIS-15', name: 'Gestion des fournisseurs', description: 'Sécurité supply chain', category: 'Organisationnel', implementation: 'Vendor risk management' },
  { id: 'CIS-16', name: 'Sécurité applicative', description: 'Secure SDLC', category: 'Organisationnel', implementation: 'DevSecOps', ebiosPhase: 'Workshop4' },
  { id: 'CIS-17', name: 'Gestion des incidents', description: 'Réponse aux incidents', category: 'Organisationnel', implementation: 'CSIRT/SOC', ebiosPhase: 'Workshop5' },
  { id: 'CIS-18', name: 'Tests de pénétration', description: 'Tests offensifs', category: 'Organisationnel', implementation: 'Pentest annuel' }
];

// NIST Cybersecurity Framework 2.0
export const NIST_CSF_CONTROLS: SecurityControl[] = [
  // GOVERN
  { id: 'GV.OC', name: 'Contexte Organisationnel', description: 'Comprendre le contexte', category: 'Gouvernance', implementation: 'Risk assessment', ebiosPhase: 'Workshop1' },
  { id: 'GV.RM', name: 'Stratégie de Gestion des Risques', description: 'Définir l\'appétence au risque', category: 'Gouvernance', implementation: 'Risk management framework' },
  { id: 'GV.SC', name: 'Cybersécurité Supply Chain', description: 'Gérer les risques tiers', category: 'Gouvernance', implementation: 'TPRM program' },
  
  // IDENTIFY
  { id: 'ID.AM', name: 'Gestion des Actifs', description: 'Inventaire complet', category: 'Identification', implementation: 'Asset inventory', ebiosPhase: 'Workshop1' },
  { id: 'ID.RA', name: 'Évaluation des Risques', description: 'Identifier les risques', category: 'Identification', implementation: 'Risk assessments', ebiosPhase: 'Workshop2' },
  
  // PROTECT
  { id: 'PR.AA', name: 'Authentification et Autorisation', description: 'Contrôle d\'accès', category: 'Protection', implementation: 'IAM/MFA' },
  { id: 'PR.DS', name: 'Sécurité des Données', description: 'Protection données', category: 'Protection', implementation: 'Encryption, DLP' },
  { id: 'PR.PS', name: 'Processus et Procédures', description: 'Sécurité opérationnelle', category: 'Protection', implementation: 'Security procedures' },
  
  // DETECT
  { id: 'DE.AE', name: 'Anomalies et Événements', description: 'Détection d\'anomalies', category: 'Détection', implementation: 'UEBA, ML detection' },
  { id: 'DE.CM', name: 'Surveillance Continue', description: 'Monitoring continu', category: 'Détection', implementation: 'SOC 24/7', ebiosPhase: 'Workshop5' },
  
  // RESPOND
  { id: 'RS.AN', name: 'Analyse des Incidents', description: 'Investigation', category: 'Réponse', implementation: 'Forensics capability' },
  { id: 'RS.MI', name: 'Mitigation', description: 'Containment', category: 'Réponse', implementation: 'Incident playbooks' },
  
  // RECOVER
  { id: 'RC.RP', name: 'Plan de Récupération', description: 'Restauration services', category: 'Récupération', implementation: 'DRP/BCP' },
  { id: 'RC.CO', name: 'Communications', description: 'Gestion de crise', category: 'Récupération', implementation: 'Crisis communication' }
];

// CSA Cloud Controls Matrix (CCM) v4 - Sélection
export const CSA_CCM_CONTROLS: SecurityControl[] = [
  { id: 'AIS-01', name: 'Sécurité des Applications', description: 'Secure SDLC cloud', category: 'Application', implementation: 'Cloud DevSecOps' },
  { id: 'BCR-01', name: 'Plan de Continuité', description: 'BCP pour le cloud', category: 'Continuité', implementation: 'Cloud DR strategy' },
  { id: 'CCC-01', name: 'Conformité Cloud', description: 'Audits cloud', category: 'Conformité', implementation: 'Cloud compliance tools' },
  { id: 'CEK-01', name: 'Chiffrement et Clés', description: 'KMS cloud', category: 'Cryptographie', implementation: 'Cloud KMS/HSM' },
  { id: 'DSP-01', name: 'Classification des Données', description: 'Data governance cloud', category: 'Données', implementation: 'Cloud DLP' },
  { id: 'GRC-01', name: 'Gouvernance Cloud', description: 'Cloud governance', category: 'Gouvernance', implementation: 'Cloud governance framework' },
  { id: 'IAM-01', name: 'Gestion Identités Cloud', description: 'Cloud IAM', category: 'Identité', implementation: 'Cloud IAM/SSO' },
  { id: 'IPY-01', name: 'Protection Infrastructure Cloud', description: 'Cloud security posture', category: 'Infrastructure', implementation: 'CSPM/CWPP' },
  { id: 'IVS-01', name: 'Virtualisation Sécurisée', description: 'Hypervisor security', category: 'Infrastructure', implementation: 'Secure virtualization' },
  { id: 'LOG-01', name: 'Logging Cloud', description: 'Cloud audit logs', category: 'Logging', implementation: 'Cloud SIEM integration' },
  { id: 'SEF-01', name: 'Incident Response Cloud', description: 'Cloud IR', category: 'Incident', implementation: 'Cloud IR playbooks' },
  { id: 'TVM-01', name: 'Gestion Vulnérabilités Cloud', description: 'Cloud vulnerability scanning', category: 'Vulnérabilités', implementation: 'Cloud security scanning' }
];

// Fonction de mapping EBIOS RM vers référentiels
export function getRelevantControls(
  ebiosPhase: string,
  measureType: 'preventive' | 'detective' | 'corrective' | 'compensating',
  riskScenarios: string[]
): { framework: string; controls: SecurityControl[] }[] {
  const results = [];
  
  // Filtrer les contrôles par phase EBIOS
  const phaseMapping: Record<string, string[]> = {
    'Workshop1': ['asset', 'inventory', 'context'],
    'Workshop2': ['threat', 'risk', 'source'],
    'Workshop3': ['scenario', 'likelihood', 'impact'],
    'Workshop4': ['attack', 'path', 'technical'],
    'Workshop5': ['measure', 'control', 'treatment']
  };
  
  // ISO 27002
  const isoControls = ISO_27002_CONTROLS.filter(control => {
    if (measureType === 'preventive' && control.category === 'Technologique') return true;
    if (measureType === 'detective' && control.id.includes('8.16')) return true;
    if (measureType === 'corrective' && control.category === 'Organisationnel') return true;
    return control.ebiosPhase === ebiosPhase;
  });
  
  if (isoControls.length > 0) {
    results.push({ framework: 'ISO 27002:2022', controls: isoControls });
  }
  
  // CIS Controls
  const cisControls = CIS_CONTROLS.filter(control => {
    if (measureType === 'preventive' && control.category === 'Basique') return true;
    if (measureType === 'detective' && control.category === 'Fondamental') return true;
    return control.ebiosPhase === ebiosPhase;
  });
  
  if (cisControls.length > 0) {
    results.push({ framework: 'CIS Controls v8', controls: cisControls });
  }
  
  // NIST CSF
  const nistControls = NIST_CSF_CONTROLS.filter(control => {
    if (measureType === 'preventive' && control.category === 'Protection') return true;
    if (measureType === 'detective' && control.category === 'Détection') return true;
    if (measureType === 'corrective' && control.category === 'Réponse') return true;
    return control.ebiosPhase === ebiosPhase;
  });
  
  if (nistControls.length > 0) {
    results.push({ framework: 'NIST CSF 2.0', controls: nistControls });
  }
  
  // CSA CCM pour les scénarios cloud
  const hasCloudScenario = riskScenarios.some(s => 
    s.toLowerCase().includes('cloud') || 
    s.toLowerCase().includes('saas') ||
    s.toLowerCase().includes('iaas')
  );
  
  if (hasCloudScenario) {
    const csaControls = CSA_CCM_CONTROLS.filter(control => {
      if (measureType === 'preventive') return true;
      return control.category === 'Infrastructure' || control.category === 'Données';
    });
    
    results.push({ framework: 'CSA CCM v4', controls: csaControls });
  }
  
  return results;
}

// Fonction pour générer des recommandations basées sur les référentiels
export function generateFrameworkRecommendations(
  riskLevel: number,
  assetTypes: string[],
  threatTypes: string[]
): { priority: string; recommendations: string[] }[] {
  const recommendations = [];
  
  // Priorité critique (risque >= 12)
  if (riskLevel >= 12) {
    recommendations.push({
      priority: 'CRITIQUE',
      recommendations: [
        'ISO 27002: 8.2 - Implémenter PAM immédiatement',
        'CIS-5/6: Revoir tous les accès privilégiés sous 48h',
        'NIST PR.AA: MFA obligatoire sur tous les comptes',
        'CSA IAM-01: Zero Trust pour accès cloud'
      ]
    });
  }
  
  // Priorité élevée (risque >= 9)
  if (riskLevel >= 9) {
    recommendations.push({
      priority: 'ÉLEVÉE',
      recommendations: [
        'ISO 27002: 8.16 - SIEM avec corrélation avancée',
        'CIS-13: Monitoring réseau temps réel',
        'NIST DE.CM: SOC 24/7 ou service managé',
        'ISO 27002: 8.8 - Scan vulnérabilités hebdomadaire'
      ]
    });
  }
  
  // Recommandations par type d'actif
  if (assetTypes.includes('data') || assetTypes.includes('database')) {
    recommendations.push({
      priority: 'DONNÉES',
      recommendations: [
        'ISO 27002: 8.24 - Chiffrement au repos et en transit',
        'CIS-3: Classification et DLP',
        'NIST PR.DS: Masquage et tokenisation',
        'CSA DSP-01: Data governance cloud'
      ]
    });
  }
  
  // Recommandations par type de menace
  if (threatTypes.includes('ransomware') || threatTypes.includes('malware')) {
    recommendations.push({
      priority: 'ANTI-RANSOMWARE',
      recommendations: [
        'ISO 27002: 8.7 - EDR/XDR nouvelle génération',
        'CIS-11: Backup immutable et testé',
        'NIST RC.RP: Plan de récupération < 4h',
        'ISO 27002: 8.25 - Sandbox pour analyse'
      ]
    });
  }
  
  return recommendations;
}