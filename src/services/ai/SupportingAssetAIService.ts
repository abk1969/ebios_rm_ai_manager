import type { SupportingAsset, BusinessValue } from '../../types/ebios';

interface AssetSuggestion {
  name: string;
  type: SupportingAsset['type'];
  description: string;
  securityLevel: SupportingAsset['securityLevel'];
  vulnerabilities: string[];
  protectionMeasures: string[];
  dependencies: string[];
  confidence: number;
  reasoning: string;
}

/**
 * Service IA pour l'enrichissement des actifs supports (Workshop 1)
 * Basé sur les meilleures pratiques et référentiels de sécurité
 */
export class SupportingAssetAIService {
  
  /**
   * Base de connaissances des actifs types par secteur
   */
  private static readonly ASSET_PATTERNS = {
    'data': {
      suggestions: [
        {
          name: 'Base de données clients',
          description: 'Données personnelles et informations clients',
          securityLevel: 'confidential' as const,
          vulnerabilities: ['SQL Injection', 'Accès non autorisé', 'Fuite de données'],
          protectionMeasures: ['Chiffrement AES-256', 'Contrôle d\'accès RBAC', 'Audit logs'],
          dependencies: ['Serveur de base de données', 'Système de sauvegarde']
        },
        {
          name: 'Données financières',
          description: 'Informations bancaires et transactions',
          securityLevel: 'secret' as const,
          vulnerabilities: ['Vol de données', 'Modification non autorisée', 'Ransomware'],
          protectionMeasures: ['Chiffrement homomorphe', 'HSM', 'Ségrégation des données'],
          dependencies: ['Infrastructure PKI', 'Système de paiement']
        },
        {
          name: 'Propriété intellectuelle',
          description: 'Brevets, codes sources, secrets industriels',
          securityLevel: 'secret' as const,
          vulnerabilities: ['Espionnage industriel', 'Fuite interne', 'Cyberespionnage'],
          protectionMeasures: ['DRM', 'Watermarking', 'Access control strict'],
          dependencies: ['Serveur de fichiers sécurisé', 'DLP']
        }
      ]
    },
    'software': {
      suggestions: [
        {
          name: 'Application web métier',
          description: 'Application principale de l\'entreprise',
          securityLevel: 'internal' as const,
          vulnerabilities: ['XSS', 'CSRF', 'Injection', 'Broken Authentication'],
          protectionMeasures: ['WAF', 'Code review', 'Pentests réguliers', 'SAST/DAST'],
          dependencies: ['Serveur web', 'Base de données', 'API backend']
        },
        {
          name: 'ERP/CRM',
          description: 'Système de gestion intégré',
          securityLevel: 'confidential' as const,
          vulnerabilities: ['Privilèges excessifs', 'Patches manquants', 'Configuration faible'],
          protectionMeasures: ['Hardening', 'Patch management', 'Monitoring'],
          dependencies: ['Infrastructure serveur', 'Active Directory']
        },
        {
          name: 'Système de messagerie',
          description: 'Email et communication interne',
          securityLevel: 'internal' as const,
          vulnerabilities: ['Phishing', 'Spoofing', 'Malware', 'Data leak'],
          protectionMeasures: ['Anti-spam', 'DKIM/SPF', 'Sandbox', 'DLP'],
          dependencies: ['Serveur mail', 'Antivirus', 'Firewall']
        }
      ]
    },
    'hardware': {
      suggestions: [
        {
          name: 'Serveurs de production',
          description: 'Infrastructure serveur critique',
          securityLevel: 'confidential' as const,
          vulnerabilities: ['Accès physique', 'Défaillance matérielle', 'Firmware compromise'],
          protectionMeasures: ['Salle sécurisée', 'Redondance', 'Secure boot'],
          dependencies: ['Alimentation', 'Climatisation', 'Réseau']
        },
        {
          name: 'Équipements réseau',
          description: 'Switches, routeurs, firewalls',
          securityLevel: 'confidential' as const,
          vulnerabilities: ['Configuration faible', 'Firmware vulnérable', 'DoS'],
          protectionMeasures: ['Hardening', 'Segmentation', 'Monitoring réseau'],
          dependencies: ['Infrastructure réseau', 'Management console']
        },
        {
          name: 'Postes de travail',
          description: 'PC et laptops utilisateurs',
          securityLevel: 'internal' as const,
          vulnerabilities: ['Malware', 'Vol', 'Shadow IT', 'USB malveillant'],
          protectionMeasures: ['Antivirus/EDR', 'Chiffrement disque', 'GPO', 'USB blocking'],
          dependencies: ['Active Directory', 'VPN', 'Serveur de mises à jour']
        }
      ]
    },
    'network': {
      suggestions: [
        {
          name: 'Infrastructure réseau LAN',
          description: 'Réseau local d\'entreprise',
          securityLevel: 'internal' as const,
          vulnerabilities: ['Man-in-the-middle', 'ARP spoofing', 'VLAN hopping'],
          protectionMeasures: ['802.1X', 'Port security', 'Network segmentation'],
          dependencies: ['Switches', 'Routeurs', 'DHCP/DNS']
        },
        {
          name: 'Connexions Internet',
          description: 'Liens WAN et accès Internet',
          securityLevel: 'public' as const,
          vulnerabilities: ['DDoS', 'Interception', 'DNS hijacking'],
          protectionMeasures: ['Firewall', 'IPS/IDS', 'Anti-DDoS', 'VPN'],
          dependencies: ['FAI', 'Routeurs edge', 'Proxy']
        },
        {
          name: 'Infrastructure WiFi',
          description: 'Réseau sans fil d\'entreprise',
          securityLevel: 'internal' as const,
          vulnerabilities: ['Rogue AP', 'WPA2 crack', 'Evil twin'],
          protectionMeasures: ['WPA3', 'Certificate auth', 'WIPS'],
          dependencies: ['Access points', 'Contrôleur WiFi', 'RADIUS']
        }
      ]
    },
    'personnel': {
      suggestions: [
        {
          name: 'Administrateurs système',
          description: 'Personnel avec privilèges élevés',
          securityLevel: 'confidential' as const,
          vulnerabilities: ['Insider threat', 'Social engineering', 'Credential theft'],
          protectionMeasures: ['Formation sécurité', 'MFA', 'PAM', 'Monitoring privilégié'],
          dependencies: ['IAM', 'SIEM', 'Bastion hosts']
        },
        {
          name: 'Développeurs',
          description: 'Équipe de développement',
          securityLevel: 'internal' as const,
          vulnerabilities: ['Code malveillant', 'Secrets dans le code', 'Supply chain'],
          protectionMeasures: ['Secure coding training', 'Code review', 'Secrets management'],
          dependencies: ['Git', 'CI/CD', 'IDE sécurisé']
        },
        {
          name: 'Utilisateurs métier',
          description: 'Employés standard',
          securityLevel: 'internal' as const,
          vulnerabilities: ['Phishing', 'Mot de passe faible', 'Shadow IT'],
          protectionMeasures: ['Awareness training', 'Password policy', 'Least privilege'],
          dependencies: ['Active Directory', 'Applications métier']
        }
      ]
    },
    'site': {
      suggestions: [
        {
          name: 'Datacenter principal',
          description: 'Centre de données primaire',
          securityLevel: 'confidential' as const,
          vulnerabilities: ['Accès physique', 'Catastrophe naturelle', 'Panne électrique'],
          protectionMeasures: ['Contrôle d\'accès biométrique', 'Onduleurs', 'Détection incendie'],
          dependencies: ['Alimentation électrique', 'Climatisation', 'Connectivité réseau']
        },
        {
          name: 'Bureaux',
          description: 'Locaux de l\'entreprise',
          securityLevel: 'internal' as const,
          vulnerabilities: ['Vol matériel', 'Espionnage', 'Tailgating'],
          protectionMeasures: ['Badges', 'Caméras', 'Coffres-forts', 'Clean desk policy'],
          dependencies: ['Système de sécurité', 'Gardiennage']
        },
        {
          name: 'Site de backup',
          description: 'Site de reprise d\'activité',
          securityLevel: 'confidential' as const,
          vulnerabilities: ['Synchronisation compromise', 'Disponibilité', 'Test insuffisant'],
          protectionMeasures: ['Réplication sécurisée', 'Tests DRP', 'Documentation'],
          dependencies: ['Lien réseau sécurisé', 'Infrastructure miroir']
        }
      ]
    }
  };

  /**
   * Génère des suggestions d'actifs basées sur la valeur métier
   */
  static generateAssetSuggestions(
    businessValue: BusinessValue,
    existingAssets: SupportingAsset[] = []
  ): AssetSuggestion[] {
    const suggestions: AssetSuggestion[] = [];
    
    // Analyser le type et la criticité de la valeur métier
    const isCritical = businessValue.criticalityLevel === 'essential';
    const isFinancial = businessValue.description?.toLowerCase().includes('financ') ||
                       businessValue.description?.toLowerCase().includes('paiement') ||
                       businessValue.description?.toLowerCase().includes('bancaire');
    const isCustomerFacing = businessValue.description?.toLowerCase().includes('client') ||
                            businessValue.description?.toLowerCase().includes('utilisateur');
    
    // Suggérer des actifs basés sur le contexte
    Object.entries(this.ASSET_PATTERNS).forEach(([type, patterns]) => {
      patterns.suggestions.forEach(pattern => {
        // Calculer la pertinence
        let confidence = 0.5;
        
        // Augmenter la confiance si l'actif est critique et la VM aussi
        if (isCritical && pattern.securityLevel !== 'public') {
          confidence += 0.2;
        }
        
        // Ajustements contextuels
        if (isFinancial && (pattern.name.includes('financ') || pattern.name.includes('paiement'))) {
          confidence += 0.3;
        }
        
        if (isCustomerFacing && (pattern.name.includes('client') || pattern.name.includes('web'))) {
          confidence += 0.2;
        }
        
        // Vérifier que l'actif n'existe pas déjà
        const exists = existingAssets.some(asset => 
          asset.name.toLowerCase() === pattern.name.toLowerCase()
        );
        
        if (!exists && confidence >= 0.6) {
          suggestions.push({
            ...pattern,
            type: type as SupportingAsset['type'],
            confidence,
            reasoning: this.generateReasoning(businessValue, pattern, confidence)
          });
        }
      });
    });
    
    // Trier par confiance et limiter
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 6);
  }

  /**
   * Enrichit un actif existant avec des métadonnées IA
   */
  static enrichSupportingAsset(
    asset: Partial<SupportingAsset>,
    businessValue?: BusinessValue
  ): Partial<SupportingAsset> {
    const assetType = asset.type || 'data';
    const patterns = this.ASSET_PATTERNS[assetType as keyof typeof this.ASSET_PATTERNS]?.suggestions || [];
    
    // Trouver le pattern le plus proche
    const matchingPattern = patterns.find((p: any) =>
      p.name.toLowerCase().includes(asset.name?.toLowerCase() || '') ||
      asset.name?.toLowerCase().includes(p.name.toLowerCase())
    ) || patterns[0];
    
    if (!matchingPattern) {
      return asset;
    }
    
    return {
      ...asset,
      securityLevel: asset.securityLevel || matchingPattern.securityLevel,
      aiSuggestions: {
        vulnerabilities: matchingPattern.vulnerabilities,
        dependencies: matchingPattern.dependencies,
        riskLevel: this.calculateRiskLevel(asset, businessValue),
        protectionMeasures: matchingPattern.protectionMeasures,
        criticalityAssessment: {
          businessImpact: businessValue?.criticalityLevel === 'essential' ? 4 : 
                         businessValue?.criticalityLevel === 'important' ? 3 : 2,
          technicalCriticality: matchingPattern.securityLevel === 'secret' ? 4 :
                               matchingPattern.securityLevel === 'confidential' ? 3 : 2,
          overallScore: 0 // Sera calculé
        }
      }
    };
  }

  /**
   * Calcule le niveau de risque d'un actif
   */
  private static calculateRiskLevel(
    asset: Partial<SupportingAsset>,
    businessValue?: BusinessValue
  ): number {
    let riskScore = 2; // Base
    
    // Augmenter selon le niveau de sécurité
    if (asset.securityLevel === 'secret') riskScore += 2;
    else if (asset.securityLevel === 'confidential') riskScore += 1;
    
    // Augmenter selon la criticité de la VM
    if (businessValue?.criticalityLevel === 'essential') riskScore += 1;
    
    // Augmenter selon le type d'actif
    if (asset.type === 'data' || asset.type === 'software') riskScore += 1;
    
    return Math.min(5, riskScore);
  }

  /**
   * Génère une explication pour la suggestion
   */
  private static generateReasoning(
    businessValue: BusinessValue,
    pattern: any,
    confidence: number
  ): string {
    const reasons = [];
    
    if (businessValue.criticalityLevel === 'essential') {
      reasons.push('Valeur métier essentielle nécessitant des actifs hautement sécurisés');
    }
    
    if (pattern.securityLevel === 'secret' || pattern.securityLevel === 'confidential') {
      reasons.push(`Niveau de sécurité ${pattern.securityLevel} approprié pour cette VM`);
    }
    
    if (confidence >= 0.8) {
      reasons.push('Forte correspondance avec le profil de la valeur métier');
    }
    
    return reasons.join('. ') || 'Actif support recommandé pour cette valeur métier';
  }

  /**
   * Analyse les dépendances entre actifs
   */
  static analyzeDependencies(
    assets: SupportingAsset[]
  ): { asset: string; dependencies: string[]; missing: string[] }[] {
    const analysis = [];
    
    for (const asset of assets) {
      const dependencies = asset.aiSuggestions?.dependencies || [];
      const existingAssetNames = assets.map(a => a.name.toLowerCase());
      
      const missing = dependencies.filter(dep => 
        !existingAssetNames.some(name => name.includes(dep.toLowerCase()))
      );
      
      if (missing.length > 0) {
        analysis.push({
          asset: asset.name,
          dependencies,
          missing
        });
      }
    }
    
    return analysis;
  }

  /**
   * Suggère des mesures de protection basées sur les vulnérabilités
   */
  static suggestProtectionMeasures(
    vulnerabilities: string[]
  ): { measure: string; priority: 'high' | 'medium' | 'low'; framework: string }[] {
    const measures: any[] = [];
    
    // Mapping vulnérabilités -> mesures
    const vulnMeasureMap: Record<string, any> = {
      'SQL Injection': {
        measure: 'Parameterized queries et WAF',
        priority: 'high',
        framework: 'OWASP A03:2021'
      },
      'Accès non autorisé': {
        measure: 'MFA et contrôle d\'accès granulaire',
        priority: 'high',
        framework: 'ISO 27002:8.2'
      },
      'Ransomware': {
        measure: 'Backup immutable et EDR',
        priority: 'high',
        framework: 'CIS Control 11'
      },
      'Phishing': {
        measure: 'Formation utilisateurs et filtrage email',
        priority: 'medium',
        framework: 'NIST PR.AT-1'
      },
      'Configuration faible': {
        measure: 'Hardening guides et scan de configuration',
        priority: 'medium',
        framework: 'CIS Control 4'
      }
    };
    
    vulnerabilities.forEach(vuln => {
      const mapping = Object.entries(vulnMeasureMap).find(([key]) => 
        vuln.toLowerCase().includes(key.toLowerCase())
      );
      
      if (mapping) {
        measures.push(mapping[1]);
      }
    });
    
    return measures;
  }
}