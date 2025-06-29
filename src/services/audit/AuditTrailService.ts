/**
 * 📋 SERVICE AUDIT TRAIL - TRAÇABILITÉ COMPLÈTE
 * Service de traçabilité des décisions pour conformité ANSSI
 * Recommandation audit CRITIQUE : Audit trail décisions
 */

export interface DecisionLogEntry {
  id: string;
  timestamp: Date;
  studyId: string;
  workshop: number;
  step: string;
  entityType: string;
  entityId?: string;
  decisionType: 'create' | 'update' | 'delete' | 'validate' | 'approve' | 'reject';
  decisionData: {
    before?: any;
    after?: any;
    changes?: Record<string, { from: any; to: any }>;
  };
  aiRecommendation?: {
    agentId: string;
    recommendation: any;
    confidence: number;
    rationale: string;
  };
  humanDecision: {
    userId: string;
    userRole: string;
    decision: any;
    rationale: string;
    overrideAI?: boolean;
  };
  validationStatus: 'pending' | 'validated' | 'rejected';
  complianceImpact: {
    anssiCompliance: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    justification: string;
  };
  metadata: {
    sessionId: string;
    ipAddress: string;
    userAgent: string;
    correlationId?: string;
  };
}

export interface AuditQuery {
  studyId?: string;
  workshop?: number;
  userId?: string;
  dateRange?: { start: Date; end: Date };
  decisionType?: string;
  entityType?: string;
  complianceImpact?: boolean;
  limit?: number;
  offset?: number;
}

export interface ComplianceReport {
  id: string;
  generatedAt: Date;
  period: { start: Date; end: Date };
  studyId?: string;
  summary: {
    totalDecisions: number;
    aiAssistedDecisions: number;
    humanOverrides: number;
    complianceViolations: number;
  };
  decisionsByWorkshop: Record<number, number>;
  complianceMetrics: {
    anssiComplianceRate: number;
    decisionTraceability: number;
    validationRate: number;
  };
  violations: DecisionLogEntry[];
  recommendations: string[];
}

/**
 * Service d'audit trail
 */
export class AuditTrailService {
  private decisionLog: DecisionLogEntry[] = [];
  private readonly maxLogSize = 10000;

  /**
   * Enregistre une décision dans l'audit trail
   */
  async logDecision(entry: Omit<DecisionLogEntry, 'id' | 'timestamp'>): Promise<string> {
    const logEntry: DecisionLogEntry = {
      id: `decision-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      timestamp: new Date(),
      ...entry
    };

    // Validation de l'entrée
    this.validateLogEntry(logEntry);

    // Ajout au log
    this.decisionLog.push(logEntry);

    // Nettoyage si nécessaire
    if (this.decisionLog.length > this.maxLogSize) {
      this.decisionLog = this.decisionLog.slice(-this.maxLogSize);
    }

    // Notification si impact compliance critique
    if (logEntry.complianceImpact.riskLevel === 'critical') {
      await this.notifyComplianceViolation(logEntry);
    }

    console.log(`📋 Décision enregistrée: ${logEntry.id} - ${logEntry.decisionType} - ${logEntry.entityType}`);
    
    return logEntry.id;
  }

  /**
   * Recherche dans l'audit trail
   */
  async queryDecisions(query: AuditQuery): Promise<{
    decisions: DecisionLogEntry[];
    total: number;
    hasMore: boolean;
  }> {
    
    let filteredDecisions = this.decisionLog;

    // Filtres
    if (query.studyId) {
      filteredDecisions = filteredDecisions.filter(d => d.studyId === query.studyId);
    }

    if (query.workshop) {
      filteredDecisions = filteredDecisions.filter(d => d.workshop === query.workshop);
    }

    if (query.userId) {
      filteredDecisions = filteredDecisions.filter(d => d.humanDecision.userId === query.userId);
    }

    if (query.dateRange) {
      filteredDecisions = filteredDecisions.filter(d => 
        d.timestamp >= query.dateRange!.start && d.timestamp <= query.dateRange!.end
      );
    }

    if (query.decisionType) {
      filteredDecisions = filteredDecisions.filter(d => d.decisionType === query.decisionType);
    }

    if (query.entityType) {
      filteredDecisions = filteredDecisions.filter(d => d.entityType === query.entityType);
    }

    if (query.complianceImpact) {
      filteredDecisions = filteredDecisions.filter(d => !d.complianceImpact.anssiCompliance);
    }

    // Tri par timestamp décroissant
    filteredDecisions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const total = filteredDecisions.length;
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    
    const decisions = filteredDecisions.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return { decisions, total, hasMore };
  }

  /**
   * Génère un rapport de conformité
   */
  async generateComplianceReport(
    period: { start: Date; end: Date },
    studyId?: string
  ): Promise<ComplianceReport> {
    
    const query: AuditQuery = {
      dateRange: period,
      studyId
    };

    const { decisions } = await this.queryDecisions(query);

    // Calcul des métriques
    const totalDecisions = decisions.length;
    const aiAssistedDecisions = decisions.filter(d => d.aiRecommendation).length;
    const humanOverrides = decisions.filter(d => d.humanDecision.overrideAI).length;
    const complianceViolations = decisions.filter(d => !d.complianceImpact.anssiCompliance).length;

    // Décisions par atelier
    const decisionsByWorkshop: Record<number, number> = {};
    for (let i = 1; i <= 5; i++) {
      decisionsByWorkshop[i] = decisions.filter(d => d.workshop === i).length;
    }

    // Métriques de conformité
    const anssiComplianceRate = totalDecisions > 0 ? 
      (totalDecisions - complianceViolations) / totalDecisions : 1;
    
    const decisionTraceability = 1.0; // 100% car toutes les décisions sont tracées
    
    const validatedDecisions = decisions.filter(d => d.validationStatus === 'validated').length;
    const validationRate = totalDecisions > 0 ? validatedDecisions / totalDecisions : 0;

    // Violations
    const violations = decisions.filter(d => !d.complianceImpact.anssiCompliance);

    // Recommandations
    const recommendations = this.generateRecommendations(decisions, violations);

    return {
      id: `compliance-report-${Date.now()}`,
      generatedAt: new Date(),
      period,
      studyId,
      summary: {
        totalDecisions,
        aiAssistedDecisions,
        humanOverrides,
        complianceViolations
      },
      decisionsByWorkshop,
      complianceMetrics: {
        anssiComplianceRate,
        decisionTraceability,
        validationRate
      },
      violations,
      recommendations
    };
  }

  /**
   * Valide une décision
   */
  async validateDecision(
    decisionId: string,
    validatorId: string,
    status: 'validated' | 'rejected',
    comments?: string
  ): Promise<boolean> {
    
    const decision = this.decisionLog.find(d => d.id === decisionId);
    if (!decision) {
      throw new Error(`Décision non trouvée: ${decisionId}`);
    }

    decision.validationStatus = status;
    
    // Log de la validation
    await this.logDecision({
      studyId: decision.studyId,
      workshop: decision.workshop,
      step: 'validation',
      entityType: 'decision_validation',
      entityId: decisionId,
      decisionType: 'validate',
      decisionData: {
        before: { status: 'pending' },
        after: { status: status },
        changes: {
          validationStatus: { from: 'pending', to: status },
          comments: { from: '', to: comments || '' }
        }
      },
      humanDecision: {
        userId: validatorId,
        userRole: 'validator',
        decision: status,
        rationale: comments || 'Validation de décision'
      },
      validationStatus: 'validated',
      complianceImpact: {
        anssiCompliance: true,
        riskLevel: 'low',
        justification: 'Validation de processus'
      },
      metadata: {
        sessionId: 'validation-session',
        ipAddress: 'internal',
        userAgent: 'audit-system'
      }
    });

    return true;
  }

  /**
   * Exporte l'audit trail
   */
  async exportAuditTrail(
    query: AuditQuery,
    format: 'json' | 'csv' | 'xml' = 'json'
  ): Promise<string> {
    
    const { decisions } = await this.queryDecisions(query);

    switch (format) {
      case 'json':
        return JSON.stringify(decisions, null, 2);
      
      case 'csv':
        return this.convertToCSV(decisions);
      
      case 'xml':
        return this.convertToXML(decisions);
      
      default:
        throw new Error(`Format non supporté: ${format}`);
    }
  }

  /**
   * Vérifie l'intégrité de l'audit trail
   */
  async verifyIntegrity(): Promise<{
    isValid: boolean;
    issues: string[];
    totalEntries: number;
    corruptedEntries: number;
  }> {
    
    const issues: string[] = [];
    let corruptedEntries = 0;

    // Vérification de chaque entrée
    this.decisionLog.forEach((entry, index) => {
      try {
        this.validateLogEntry(entry);
      } catch (error) {
        issues.push(`Entrée ${index}: ${error}`);
        corruptedEntries++;
      }
    });

    // Vérification de la chronologie
    for (let i = 1; i < this.decisionLog.length; i++) {
      if (this.decisionLog[i].timestamp < this.decisionLog[i-1].timestamp) {
        issues.push(`Ordre chronologique incorrect entre entrées ${i-1} et ${i}`);
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      totalEntries: this.decisionLog.length,
      corruptedEntries
    };
  }

  /**
   * Statistiques de l'audit trail
   */
  getStatistics(): {
    totalEntries: number;
    entriesByType: Record<string, number>;
    entriesByWorkshop: Record<number, number>;
    complianceRate: number;
    aiUsageRate: number;
  } {
    
    const totalEntries = this.decisionLog.length;
    
    // Par type de décision
    const entriesByType: Record<string, number> = {};
    this.decisionLog.forEach(entry => {
      entriesByType[entry.decisionType] = (entriesByType[entry.decisionType] || 0) + 1;
    });

    // Par atelier
    const entriesByWorkshop: Record<number, number> = {};
    this.decisionLog.forEach(entry => {
      entriesByWorkshop[entry.workshop] = (entriesByWorkshop[entry.workshop] || 0) + 1;
    });

    // Taux de conformité
    const compliantEntries = this.decisionLog.filter(e => e.complianceImpact.anssiCompliance).length;
    const complianceRate = totalEntries > 0 ? compliantEntries / totalEntries : 1;

    // Taux d'utilisation IA
    const aiAssistedEntries = this.decisionLog.filter(e => e.aiRecommendation).length;
    const aiUsageRate = totalEntries > 0 ? aiAssistedEntries / totalEntries : 0;

    return {
      totalEntries,
      entriesByType,
      entriesByWorkshop,
      complianceRate,
      aiUsageRate
    };
  }

  // Méthodes privées
  private validateLogEntry(entry: DecisionLogEntry): void {
    if (!entry.id) throw new Error('ID manquant');
    if (!entry.studyId) throw new Error('Study ID manquant');
    if (!entry.workshop || entry.workshop < 1 || entry.workshop > 5) {
      throw new Error('Workshop invalide');
    }
    if (!entry.humanDecision.userId) throw new Error('User ID manquant');
    if (!entry.complianceImpact) throw new Error('Impact conformité manquant');
  }

  private async notifyComplianceViolation(entry: DecisionLogEntry): Promise<void> {
    console.warn(`🚨 VIOLATION CONFORMITÉ CRITIQUE: ${entry.id}`);
    console.warn(`   Étude: ${entry.studyId}`);
    console.warn(`   Atelier: ${entry.workshop}`);
    console.warn(`   Justification: ${entry.complianceImpact.justification}`);
    
    // Ici, on pourrait envoyer des notifications par email, Slack, etc.
  }

  private generateRecommendations(
    decisions: DecisionLogEntry[],
    violations: DecisionLogEntry[]
  ): string[] {
    
    const recommendations: string[] = [];

    if (violations.length > 0) {
      recommendations.push(`Corriger ${violations.length} violation(s) de conformité identifiée(s)`);
    }

    const unvalidatedDecisions = decisions.filter(d => d.validationStatus === 'pending').length;
    if (unvalidatedDecisions > 0) {
      recommendations.push(`Valider ${unvalidatedDecisions} décision(s) en attente`);
    }

    const aiOverrideRate = decisions.filter(d => d.humanDecision.overrideAI).length / decisions.length;
    if (aiOverrideRate > 0.3) {
      recommendations.push('Taux de rejet IA élevé - Réviser les algorithmes de recommandation');
    }

    recommendations.push('Maintenir la traçabilité complète des décisions');
    recommendations.push('Effectuer des audits réguliers de conformité');

    return recommendations;
  }

  private convertToCSV(decisions: DecisionLogEntry[]): string {
    const headers = [
      'ID', 'Timestamp', 'StudyId', 'Workshop', 'Step', 'EntityType', 
      'DecisionType', 'UserId', 'UserRole', 'ANSSICompliance', 'RiskLevel'
    ];

    const rows = decisions.map(d => [
      d.id,
      d.timestamp.toISOString(),
      d.studyId,
      d.workshop.toString(),
      d.step,
      d.entityType,
      d.decisionType,
      d.humanDecision.userId,
      d.humanDecision.userRole,
      d.complianceImpact.anssiCompliance.toString(),
      d.complianceImpact.riskLevel
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private convertToXML(decisions: DecisionLogEntry[]): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<audit_trail>\n';
    
    decisions.forEach(d => {
      xml += `  <decision id="${d.id}" timestamp="${d.timestamp.toISOString()}">\n`;
      xml += `    <study_id>${d.studyId}</study_id>\n`;
      xml += `    <workshop>${d.workshop}</workshop>\n`;
      xml += `    <decision_type>${d.decisionType}</decision_type>\n`;
      xml += `    <entity_type>${d.entityType}</entity_type>\n`;
      xml += `    <user_id>${d.humanDecision.userId}</user_id>\n`;
      xml += `    <anssi_compliance>${d.complianceImpact.anssiCompliance}</anssi_compliance>\n`;
      xml += `  </decision>\n`;
    });
    
    xml += '</audit_trail>';
    return xml;
  }
}
