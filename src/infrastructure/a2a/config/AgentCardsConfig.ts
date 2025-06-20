/**
 * 🎯 CONFIGURATION DES AGENT CARDS A2A
 * Définition des 5 agents experts pour EBIOS RM
 * Conformité protocole Google A2A v0.2.8
 */

import {
  EbiosExpertAgentCard,
  GrcExpertAgentCard,
  AuditExpertAgentCard,
  ThreatIntelAgentCard,
  OrchestratorAgentCard,
  AgentCapabilities,
  SecurityScheme
} from '../types/AgentCardTypes';

// 🔐 CONFIGURATION SÉCURITÉ COMMUNE
const COMMON_SECURITY_SCHEMES: Record<string, SecurityScheme> = {
  bearerAuth: {
    type: 'bearer',
    description: 'Bearer token authentication for EBIOS RM experts',
    bearerFormat: 'JWT'
  },
  apiKeyAuth: {
    type: 'apiKey',
    description: 'API Key authentication for automated systems',
    in: 'header',
    name: 'X-API-Key'
  },
  oauth2: {
    type: 'oauth2',
    description: 'OAuth 2.0 authentication for enterprise integration',
    flows: {
      authorizationCode: {
        authorizationUrl: 'https://auth.ebios-ai.com/oauth/authorize',
        tokenUrl: 'https://auth.ebios-ai.com/oauth/token',
        scopes: {
          'ebios:read': 'Read EBIOS RM data',
          'ebios:write': 'Write EBIOS RM data',
          'ebios:expert': 'Expert-level access to advanced features'
        }
      }
    }
  }
};

// 🎯 CAPACITÉS COMMUNES EXPERTES
const EXPERT_CAPABILITIES: AgentCapabilities = {
  streaming: true,
  pushNotifications: true,
  fileUpload: true,
  fileDownload: true,
  multiTurn: true,
  contextManagement: true
};

// 🤖 AGENT EXPERT EBIOS
export const EBIOS_EXPERT_AGENT_CARD: EbiosExpertAgentCard = {
  name: 'EbiosExpertAgent',
  version: '1.0.0',
  description: 'Agent expert spécialisé dans la méthodologie EBIOS RM pour professionnels confirmés. Analyse de risques complexes, modélisation de menaces sophistiquées et validation méthodologique ANSSI.',
  provider: {
    name: 'EBIOS AI Manager',
    url: 'https://ebios-ai.com',
    email: 'experts@ebios-ai.com',
    description: 'Plateforme d\'expertise EBIOS RM certifiée ANSSI'
  },
  url: 'https://api.ebios-ai.com/a2a/ebios-expert',
  capabilities: EXPERT_CAPABILITIES,
  skills: [
    {
      name: 'advanced_risk_modeling',
      description: 'Modélisation avancée de risques multi-secteurs avec analyse de dépendances complexes',
      inputSchema: {
        type: 'object',
        properties: {
          organizationContext: { type: 'object' },
          sector: { type: 'string' },
          assets: { type: 'array' },
          threatLandscape: { type: 'object' }
        },
        required: ['organizationContext', 'sector']
      },
      outputSchema: {
        type: 'object',
        properties: {
          riskScenarios: { type: 'array' },
          riskMatrix: { type: 'object' },
          prioritization: { type: 'array' },
          recommendations: { type: 'array' }
        }
      },
      examples: [
        {
          name: 'CHU Risk Modeling',
          description: 'Modélisation des risques pour un CHU de 1200 lits',
          input: {
            organizationContext: { type: 'healthcare', size: 'large', criticality: 'high' },
            sector: 'healthcare'
          },
          output: {
            riskScenarios: ['ransomware_attack', 'data_breach', 'system_failure'],
            riskMatrix: { high: 3, medium: 5, low: 2 }
          }
        }
      ]
    },
    {
      name: 'threat_scenario_generation',
      description: 'Génération de scénarios de menaces contextualisés avec TTPs récentes',
      inputSchema: {
        type: 'object',
        properties: {
          threatActors: { type: 'array' },
          assets: { type: 'array' },
          vulnerabilities: { type: 'array' },
          businessContext: { type: 'object' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          scenarios: { type: 'array' },
          killChains: { type: 'array' },
          mitigations: { type: 'array' }
        }
      }
    },
    {
      name: 'ebios_methodology_validation',
      description: 'Validation de conformité méthodologique EBIOS RM selon standards ANSSI',
      inputSchema: {
        type: 'object',
        properties: {
          workshopResults: { type: 'array' },
          methodology: { type: 'string' },
          completeness: { type: 'object' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          complianceScore: { type: 'number' },
          gaps: { type: 'array' },
          recommendations: { type: 'array' },
          certification: { type: 'boolean' }
        }
      }
    }
  ],
  securitySchemes: COMMON_SECURITY_SCHEMES,
  security: ['bearerAuth'],
  supportsAuthenticatedExtendedCard: true,
  extensions: {
    ebiosMethodology: {
      version: '1.5.0',
      data: {
        anssiCompliant: true,
        supportedFrameworks: ['EBIOS RM', 'ISO 27005', 'NIST RMF'],
        expertiseLevel: 'advanced',
        certifications: ['ANSSI', 'ISO 27001 LA', 'CISSP']
      }
    }
  }
};

// 🏛️ AGENT EXPERT GRC
export const GRC_EXPERT_AGENT_CARD: GrcExpertAgentCard = {
  name: 'GrcExpertAgent',
  version: '1.0.0',
  description: 'Agent expert en Gouvernance, Risques et Conformité. Spécialisé dans l\'analyse quantitative des risques, frameworks de gouvernance et reporting exécutif.',
  provider: {
    name: 'EBIOS AI Manager',
    url: 'https://ebios-ai.com',
    email: 'grc@ebios-ai.com',
    description: 'Expertise GRC pour dirigeants et risk managers'
  },
  url: 'https://api.ebios-ai.com/a2a/grc-expert',
  capabilities: EXPERT_CAPABILITIES,
  skills: [
    {
      name: 'governance_framework_analysis',
      description: 'Analyse de frameworks de gouvernance et recommandations d\'amélioration',
      inputSchema: {
        type: 'object',
        properties: {
          currentFramework: { type: 'object' },
          organizationSize: { type: 'string' },
          industry: { type: 'string' },
          maturityLevel: { type: 'number' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          assessment: { type: 'object' },
          gaps: { type: 'array' },
          roadmap: { type: 'array' },
          kpis: { type: 'array' }
        }
      }
    },
    {
      name: 'risk_quantification_fair',
      description: 'Quantification des risques selon méthodologie FAIR (Factor Analysis of Information Risk)',
      inputSchema: {
        type: 'object',
        properties: {
          scenarios: { type: 'array' },
          assets: { type: 'array' },
          threats: { type: 'array' },
          controls: { type: 'array' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          annualLossExpectancy: { type: 'number' },
          riskDistribution: { type: 'object' },
          sensitivityAnalysis: { type: 'object' },
          recommendations: { type: 'array' }
        }
      }
    },
    {
      name: 'business_impact_modeling',
      description: 'Modélisation d\'impacts business avec calculs financiers avancés',
      inputSchema: {
        type: 'object',
        properties: {
          businessProcesses: { type: 'array' },
          dependencies: { type: 'object' },
          financialData: { type: 'object' },
          scenarios: { type: 'array' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          impactAnalysis: { type: 'object' },
          financialProjections: { type: 'array' },
          recoveryMetrics: { type: 'object' },
          businessCase: { type: 'object' }
        }
      }
    }
  ],
  securitySchemes: COMMON_SECURITY_SCHEMES,
  security: ['bearerAuth'],
  supportsAuthenticatedExtendedCard: true,
  extensions: {
    grcFrameworks: {
      version: '1.0.0',
      data: {
        supportedStandards: ['ISO 31000', 'COSO ERM', 'FAIR', 'OCTAVE'],
        riskCalculationMethods: ['Monte Carlo', 'Bayesian', 'Fuzzy Logic'],
        reportingCapabilities: ['Executive Dashboard', 'Board Reports', 'Regulatory Filings']
      }
    }
  }
};

// 🔍 AGENT EXPERT AUDIT
export const AUDIT_EXPERT_AGENT_CARD: AuditExpertAgentCard = {
  name: 'AuditExpertAgent',
  version: '1.0.0',
  description: 'Agent expert en audit de sécurité et conformité. Spécialisé dans l\'évaluation de contrôles, analyse de preuves et validation de conformité réglementaire.',
  provider: {
    name: 'EBIOS AI Manager',
    url: 'https://ebios-ai.com',
    email: 'audit@ebios-ai.com',
    description: 'Expertise audit pour auditeurs internes et externes'
  },
  url: 'https://api.ebios-ai.com/a2a/audit-expert',
  capabilities: EXPERT_CAPABILITIES,
  skills: [
    {
      name: 'security_controls_assessment',
      description: 'Évaluation approfondie de l\'efficacité des contrôles de sécurité',
      inputSchema: {
        type: 'object',
        properties: {
          controls: { type: 'array' },
          framework: { type: 'string' },
          evidence: { type: 'array' },
          scope: { type: 'object' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          controlsAssessment: { type: 'array' },
          effectivenessRating: { type: 'object' },
          gaps: { type: 'array' },
          recommendations: { type: 'array' }
        }
      }
    },
    {
      name: 'compliance_validation',
      description: 'Validation de conformité multi-référentiels avec analyse de gaps',
      inputSchema: {
        type: 'object',
        properties: {
          standards: { type: 'array' },
          currentState: { type: 'object' },
          evidence: { type: 'array' },
          scope: { type: 'object' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          complianceStatus: { type: 'object' },
          gaps: { type: 'array' },
          remediationPlan: { type: 'array' },
          timeline: { type: 'object' }
        }
      }
    }
  ],
  securitySchemes: COMMON_SECURITY_SCHEMES,
  security: ['bearerAuth'],
  supportsAuthenticatedExtendedCard: true,
  extensions: {
    auditMethodology: {
      version: '1.0.0',
      data: {
        supportedStandards: ['ISO 27001', 'SOC 2', 'PCI DSS', 'GDPR', 'HDS'],
        evidenceTypes: ['Documents', 'Interviews', 'Observations', 'Testing'],
        auditTrails: true,
        continuousMonitoring: true
      }
    }
  }
};

// 🕵️ AGENT EXPERT THREAT INTELLIGENCE
export const THREAT_INTEL_AGENT_CARD: ThreatIntelAgentCard = {
  name: 'ThreatIntelAgent',
  version: '1.0.0',
  description: 'Agent expert en threat intelligence et analyse de menaces. Spécialisé dans l\'analyse d\'acteurs de menaces, corrélation d\'IOCs et prédiction de campagnes.',
  provider: {
    name: 'EBIOS AI Manager',
    url: 'https://ebios-ai.com',
    email: 'threatintel@ebios-ai.com',
    description: 'Expertise threat intelligence pour analystes SOC et CERT'
  },
  url: 'https://api.ebios-ai.com/a2a/threat-intel',
  capabilities: EXPERT_CAPABILITIES,
  skills: [
    {
      name: 'apt_campaign_analysis',
      description: 'Analyse approfondie de campagnes APT avec reconstruction de kill chains',
      inputSchema: {
        type: 'object',
        properties: {
          indicators: { type: 'array' },
          timeline: { type: 'object' },
          targets: { type: 'array' },
          context: { type: 'object' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          campaignProfile: { type: 'object' },
          killChain: { type: 'array' },
          attribution: { type: 'object' },
          predictions: { type: 'array' }
        }
      }
    },
    {
      name: 'threat_actor_profiling',
      description: 'Profilage détaillé d\'acteurs de menaces avec analyse comportementale',
      inputSchema: {
        type: 'object',
        properties: {
          observedBehavior: { type: 'object' },
          ttps: { type: 'array' },
          infrastructure: { type: 'object' },
          targets: { type: 'array' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          actorProfile: { type: 'object' },
          sophistication: { type: 'string' },
          motivation: { type: 'array' },
          capabilities: { type: 'object' }
        }
      }
    },
    {
      name: 'predictive_threat_analysis',
      description: 'Analyse prédictive de menaces avec machine learning',
      inputSchema: {
        type: 'object',
        properties: {
          historicalData: { type: 'array' },
          currentTrends: { type: 'object' },
          geopoliticalContext: { type: 'object' },
          targetProfile: { type: 'object' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          threatPredictions: { type: 'array' },
          riskScores: { type: 'object' },
          recommendations: { type: 'array' },
          timeline: { type: 'object' }
        }
      }
    }
  ],
  securitySchemes: COMMON_SECURITY_SCHEMES,
  security: ['bearerAuth'],
  supportsAuthenticatedExtendedCard: true,
  extensions: {
    threatIntelligence: {
      version: '1.0.0',
      data: {
        dataSources: ['MISP', 'STIX/TAXII', 'MITRE ATT&CK', 'Commercial Feeds'],
        analysisCapabilities: ['IOC Correlation', 'Attribution', 'Prediction', 'Hunting'],
        integrations: ['SIEM', 'SOAR', 'TIP', 'EDR']
      }
    }
  }
};

// 🎼 AGENT ORCHESTRATEUR
export const ORCHESTRATOR_AGENT_CARD: OrchestratorAgentCard = {
  name: 'OrchestratorAgent',
  version: '1.0.0',
  description: 'Agent orchestrateur pour coordination multi-agents. Gère les workflows complexes, agrège les résultats et construit le consensus d\'experts.',
  provider: {
    name: 'EBIOS AI Manager',
    url: 'https://ebios-ai.com',
    email: 'orchestrator@ebios-ai.com',
    description: 'Orchestration intelligente d\'agents experts'
  },
  url: 'https://api.ebios-ai.com/a2a/orchestrator',
  capabilities: EXPERT_CAPABILITIES,
  skills: [
    {
      name: 'multi_agent_coordination',
      description: 'Coordination intelligente de multiples agents experts avec gestion des dépendances',
      inputSchema: {
        type: 'object',
        properties: {
          task: { type: 'object' },
          requiredAgents: { type: 'array' },
          constraints: { type: 'object' },
          userProfile: { type: 'object' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          executionPlan: { type: 'object' },
          agentAssignments: { type: 'array' },
          dependencies: { type: 'object' },
          timeline: { type: 'object' }
        }
      }
    },
    {
      name: 'expert_consensus_building',
      description: 'Construction de consensus entre experts avec résolution de conflits',
      inputSchema: {
        type: 'object',
        properties: {
          expertOpinions: { type: 'array' },
          conflictAreas: { type: 'array' },
          weights: { type: 'object' },
          context: { type: 'object' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          consensus: { type: 'object' },
          confidence: { type: 'number' },
          dissenting: { type: 'array' },
          rationale: { type: 'string' }
        }
      }
    },
    {
      name: 'adaptive_difficulty_adjustment',
      description: 'Ajustement adaptatif de la difficulté selon le profil et performance utilisateur',
      inputSchema: {
        type: 'object',
        properties: {
          userProfile: { type: 'object' },
          performance: { type: 'object' },
          currentContent: { type: 'object' },
          learningObjectives: { type: 'array' }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          adjustedContent: { type: 'object' },
          difficultyLevel: { type: 'string' },
          recommendations: { type: 'array' },
          nextSteps: { type: 'array' }
        }
      }
    }
  ],
  securitySchemes: COMMON_SECURITY_SCHEMES,
  security: ['bearerAuth'],
  supportsAuthenticatedExtendedCard: true,
  extensions: {
    orchestration: {
      version: '1.0.0',
      data: {
        managedAgents: ['EbiosExpertAgent', 'GrcExpertAgent', 'AuditExpertAgent', 'ThreatIntelAgent'],
        workflowCapabilities: ['Sequential', 'Parallel', 'Conditional', 'Iterative'],
        consensusAlgorithms: ['Weighted Voting', 'Delphi Method', 'Fuzzy Consensus']
      }
    }
  }
};

export const AGENT_CARDS_CONFIG = {
  EBIOS_EXPERT_AGENT_CARD,
  GRC_EXPERT_AGENT_CARD,
  AUDIT_EXPERT_AGENT_CARD,
  THREAT_INTEL_AGENT_CARD,
  ORCHESTRATOR_AGENT_CARD,
  COMMON_SECURITY_SCHEMES,
  EXPERT_CAPABILITIES
};
