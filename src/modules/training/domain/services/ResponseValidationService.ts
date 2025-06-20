/**
 * ✅ SERVICE DE VALIDATION DES RÉPONSES EXPERTES
 * Garantit la pertinence et la qualité des réponses du chatbot expert
 */

export interface ValidationCriteria {
  relevance: number;      // 0-1: Pertinence par rapport au contexte EBIOS RM
  accuracy: number;       // 0-1: Exactitude technique
  pedagogical: number;    // 0-1: Qualité pédagogique
  actionable: number;     // 0-1: Caractère actionnable
  anssiCompliant: number; // 0-1: Conformité ANSSI
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  criteria: ValidationCriteria;
  issues: string[];
  improvements: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export class ResponseValidationService {
  private static instance: ResponseValidationService;
  
  // Seuils critiques pour éviter la disqualification ANSSI
  private readonly CRITICAL_THRESHOLDS = {
    relevance: 0.7,      // Minimum 70% de pertinence
    accuracy: 0.8,       // Minimum 80% d'exactitude
    pedagogical: 0.6,    // Minimum 60% de qualité pédagogique
    actionable: 0.5,     // Minimum 50% d'actionnabilité
    anssiCompliant: 0.9  // Minimum 90% de conformité ANSSI
  };

  private readonly EBIOS_KEYWORDS = {
    atelier1: ['cadrage', 'périmètre', 'biens supports', 'valeurs métier', 'socle sécurité'],
    atelier2: ['sources risque', 'menaces', 'capacités', 'motivations', 'caractérisation'],
    atelier3: ['scénarios stratégiques', 'impact métier', 'vraisemblance', 'gravité'],
    atelier4: ['scénarios opérationnels', 'chemins attaque', 'faisabilité', 'techniques'],
    atelier5: ['traitement risque', 'mesures sécurité', 'plan action', 'validation']
  };

  private readonly ANSSI_COMPLIANCE_PATTERNS = [
    /EBIOS.{0,10}Risk.{0,10}Manager/gi,
    /méthodologie.{0,20}ANSSI/gi,
    /conformité.{0,20}réglementaire/gi,
    /analyse.{0,10}risque/gi,
    /sécurité.{0,20}système.{0,20}information/gi
  ];

  public static getInstance(): ResponseValidationService {
    if (!ResponseValidationService.instance) {
      ResponseValidationService.instance = new ResponseValidationService();
    }
    return ResponseValidationService.instance;
  }

  /**
   * 🔍 VALIDATION CRITIQUE D'UNE RÉPONSE
   */
  public validateResponse(
    response: string,
    context: {
      workshop: number;
      userMessage: string;
      learnerLevel: string;
      organizationContext: string;
    }
  ): ValidationResult {
    
    // Validation de la pertinence EBIOS RM
    const relevance = this.assessRelevance(response, context);
    
    // Validation de l'exactitude technique
    const accuracy = this.assessAccuracy(response, context);
    
    // Validation de la qualité pédagogique
    const pedagogical = this.assessPedagogicalQuality(response, context);
    
    // Validation du caractère actionnable
    const actionable = this.assessActionability(response, context);
    
    // Validation de la conformité ANSSI
    const anssiCompliant = this.assessANSSICompliance(response, context);

    const criteria: ValidationCriteria = {
      relevance,
      accuracy,
      pedagogical,
      actionable,
      anssiCompliant
    };

    // Calcul du score global
    const score = this.calculateOverallScore(criteria);
    
    // Identification des problèmes critiques
    const issues = this.identifyIssues(criteria);
    
    // Suggestions d'amélioration
    const improvements = this.generateImprovements(criteria, context);
    
    // Évaluation du niveau de risque
    const riskLevel = this.assessRiskLevel(criteria);
    
    // Validation finale
    const isValid = this.isResponseValid(criteria, riskLevel);

    return {
      isValid,
      score,
      criteria,
      issues,
      improvements,
      riskLevel
    };
  }

  /**
   * 🎯 Évaluer la pertinence EBIOS RM
   */
  private assessRelevance(response: string, context: any): number {
    const workshopKeywords = this.EBIOS_KEYWORDS[`atelier${context.workshop}` as keyof typeof this.EBIOS_KEYWORDS] || [];
    
    let relevanceScore = 0;
    let keywordMatches = 0;
    
    // Vérifier la présence des mots-clés de l'atelier
    workshopKeywords.forEach(keyword => {
      if (response.toLowerCase().includes(keyword.toLowerCase())) {
        keywordMatches++;
      }
    });
    
    relevanceScore += (keywordMatches / workshopKeywords.length) * 0.4;
    
    // Vérifier la cohérence avec le message utilisateur
    const userKeywords = this.extractKeywords(context.userMessage);
    let contextMatches = 0;
    
    userKeywords.forEach(keyword => {
      if (response.toLowerCase().includes(keyword.toLowerCase())) {
        contextMatches++;
      }
    });
    
    relevanceScore += Math.min(contextMatches / Math.max(userKeywords.length, 1), 1) * 0.3;
    
    // Vérifier la mention du contexte organisationnel
    if (response.toLowerCase().includes(context.organizationContext.toLowerCase())) {
      relevanceScore += 0.3;
    }
    
    return Math.min(relevanceScore, 1);
  }

  /**
   * 🔬 Évaluer l'exactitude technique
   */
  private assessAccuracy(response: string, context: any): number {
    let accuracyScore = 0.5; // Score de base
    
    // Vérifier l'absence d'informations erronées communes
    const commonErrors = [
      /EBIOS.{0,10}2010/gi,  // Ancienne version
      /ISO.{0,10}27001.{0,20}obligatoire/gi,  // Confusion réglementaire
      /100%.{0,20}sécurité/gi,  // Promesses irréalistes
      /aucun.{0,10}risque/gi,  // Négation du risque
      /totalement.{0,10}sécurisé/gi  // Sécurité absolue
    ];
    
    commonErrors.forEach(errorPattern => {
      if (response.match(errorPattern)) {
        accuracyScore -= 0.2;
      }
    });
    
    // Vérifier la présence de références techniques correctes
    const correctReferences = [
      /EBIOS.{0,10}Risk.{0,10}Manager/gi,
      /ANSSI/gi,
      /ISO.{0,10}27005/gi,
      /analyse.{0,10}risque/gi
    ];
    
    let correctRefs = 0;
    correctReferences.forEach(refPattern => {
      if (response.match(refPattern)) {
        correctRefs++;
      }
    });
    
    accuracyScore += (correctRefs / correctReferences.length) * 0.3;
    
    // Vérifier la cohérence méthodologique
    if (this.checkMethodologicalConsistency(response, context.workshop)) {
      accuracyScore += 0.2;
    }
    
    return Math.max(0, Math.min(accuracyScore, 1));
  }

  /**
   * 📚 Évaluer la qualité pédagogique
   */
  private assessPedagogicalQuality(response: string, context: any): number {
    let pedagogicalScore = 0;
    
    // Structure pédagogique
    const hasStructure = /^.*\*\*.*\*\*.*$/gm.test(response); // Titres en gras
    if (hasStructure) pedagogicalScore += 0.2;
    
    // Présence d'exemples
    const hasExamples = /exemple|par exemple|illustration|cas concret/gi.test(response);
    if (hasExamples) pedagogicalScore += 0.2;
    
    // Progression logique
    const hasProgression = /d'abord|ensuite|puis|enfin|étape/gi.test(response);
    if (hasProgression) pedagogicalScore += 0.2;
    
    // Adaptation au niveau
    const levelAdaptation = this.assessLevelAdaptation(response, context.learnerLevel);
    pedagogicalScore += levelAdaptation * 0.2;
    
    // Encouragement et bienveillance
    const isEncouraging = /excellent|bien|parfait|continuez|bravo/gi.test(response);
    if (isEncouraging) pedagogicalScore += 0.1;
    
    // Clarté (longueur appropriée)
    const isAppropriateLength = response.length > 100 && response.length < 2000;
    if (isAppropriateLength) pedagogicalScore += 0.1;
    
    return Math.min(pedagogicalScore, 1);
  }

  /**
   * ⚡ Évaluer le caractère actionnable
   */
  private assessActionability(response: string, context: any): number {
    let actionabilityScore = 0;
    
    // Présence d'actions concrètes
    const actionVerbs = /identifiez|analysez|évaluez|documentez|implémentez|vérifiez/gi;
    const actionMatches = (response.match(actionVerbs) || []).length;
    actionabilityScore += Math.min(actionMatches * 0.1, 0.3);
    
    // Présence d'étapes claires
    const hasSteps = /étape|phase|d'abord|ensuite|puis/gi.test(response);
    if (hasSteps) actionabilityScore += 0.2;
    
    // Présence de livrables
    const hasDeliverables = /livrable|document|matrice|tableau|rapport/gi.test(response);
    if (hasDeliverables) actionabilityScore += 0.2;
    
    // Présence de critères de validation
    const hasValidation = /validation|vérification|contrôle|critère/gi.test(response);
    if (hasValidation) actionabilityScore += 0.2;
    
    // Présence de conseils pratiques
    const hasPracticalAdvice = /conseil|recommandation|astuce|attention/gi.test(response);
    if (hasPracticalAdvice) actionabilityScore += 0.1;
    
    return Math.min(actionabilityScore, 1);
  }

  /**
   * 🏛️ Évaluer la conformité ANSSI
   */
  private assessANSSICompliance(response: string, context: any): number {
    let complianceScore = 0.5; // Score de base
    
    // Vérifier les références ANSSI appropriées
    let anssiRefs = 0;
    this.ANSSI_COMPLIANCE_PATTERNS.forEach(pattern => {
      if (response.match(pattern)) {
        anssiRefs++;
      }
    });
    
    complianceScore += (anssiRefs / this.ANSSI_COMPLIANCE_PATTERNS.length) * 0.3;
    
    // Vérifier l'absence de contradictions avec ANSSI
    const anssiContradictions = [
      /EBIOS.{0,20}obsolète/gi,
      /remplacé.{0,20}par/gi,
      /plus.{0,10}utilisé/gi
    ];
    
    anssiContradictions.forEach(contradiction => {
      if (response.match(contradiction)) {
        complianceScore -= 0.3;
      }
    });
    
    // Vérifier la terminologie officielle
    const officialTerms = ['biens supports', 'sources de risque', 'scénarios stratégiques'];
    let termMatches = 0;
    
    officialTerms.forEach(term => {
      if (response.toLowerCase().includes(term)) {
        termMatches++;
      }
    });
    
    complianceScore += (termMatches / officialTerms.length) * 0.2;
    
    return Math.max(0, Math.min(complianceScore, 1));
  }

  /**
   * 📊 Calculer le score global
   */
  private calculateOverallScore(criteria: ValidationCriteria): number {
    const weights = {
      relevance: 0.25,
      accuracy: 0.25,
      pedagogical: 0.2,
      actionable: 0.15,
      anssiCompliant: 0.15
    };
    
    return Object.entries(criteria).reduce((score, [key, value]) => {
      return score + (value * weights[key as keyof typeof weights]);
    }, 0);
  }

  /**
   * 🚨 Identifier les problèmes critiques
   */
  private identifyIssues(criteria: ValidationCriteria): string[] {
    const issues: string[] = [];
    
    Object.entries(criteria).forEach(([key, value]) => {
      const threshold = this.CRITICAL_THRESHOLDS[key as keyof typeof this.CRITICAL_THRESHOLDS];
      if (value < threshold) {
        issues.push(`${key}: ${Math.round(value * 100)}% (seuil: ${Math.round(threshold * 100)}%)`);
      }
    });
    
    return issues;
  }

  /**
   * 💡 Générer des améliorations
   */
  private generateImprovements(criteria: ValidationCriteria, context: any): string[] {
    const improvements: string[] = [];
    
    if (criteria.relevance < this.CRITICAL_THRESHOLDS.relevance) {
      improvements.push('Ajouter plus de références spécifiques à l\'atelier EBIOS RM');
    }
    
    if (criteria.accuracy < this.CRITICAL_THRESHOLDS.accuracy) {
      improvements.push('Vérifier l\'exactitude des références techniques et méthodologiques');
    }
    
    if (criteria.pedagogical < this.CRITICAL_THRESHOLDS.pedagogical) {
      improvements.push('Améliorer la structure pédagogique avec exemples et progression');
    }
    
    if (criteria.actionable < this.CRITICAL_THRESHOLDS.actionable) {
      improvements.push('Ajouter des actions concrètes et des étapes pratiques');
    }
    
    if (criteria.anssiCompliant < this.CRITICAL_THRESHOLDS.anssiCompliant) {
      improvements.push('Renforcer les références ANSSI et la terminologie officielle');
    }
    
    return improvements;
  }

  /**
   * ⚠️ Évaluer le niveau de risque
   */
  private assessRiskLevel(criteria: ValidationCriteria): 'low' | 'medium' | 'high' | 'critical' {
    const criticalIssues = Object.entries(criteria).filter(([key, value]) => {
      const threshold = this.CRITICAL_THRESHOLDS[key as keyof typeof this.CRITICAL_THRESHOLDS];
      return value < threshold;
    }).length;
    
    if (criticalIssues >= 3) return 'critical';
    if (criticalIssues >= 2) return 'high';
    if (criticalIssues >= 1) return 'medium';
    return 'low';
  }

  /**
   * ✅ Valider si la réponse est acceptable
   */
  private isResponseValid(criteria: ValidationCriteria, riskLevel: string): boolean {
    // Rejet automatique si risque critique
    if (riskLevel === 'critical') return false;
    
    // Vérification des seuils minimums absolus
    return criteria.anssiCompliant >= 0.8 && 
           criteria.accuracy >= 0.7 && 
           criteria.relevance >= 0.6;
  }

  // Méthodes utilitaires
  private extractKeywords(text: string): string[] {
    return text.toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 10);
  }

  private checkMethodologicalConsistency(response: string, workshop: number): boolean {
    const workshopFlow = {
      1: ['cadrage', 'périmètre', 'biens'],
      2: ['sources', 'menaces', 'capacités'],
      3: ['scénarios', 'impact', 'vraisemblance'],
      4: ['opérationnels', 'chemins', 'faisabilité'],
      5: ['traitement', 'mesures', 'plan']
    };
    
    const expectedFlow = workshopFlow[workshop as keyof typeof workshopFlow] || [];
    return expectedFlow.some(term => response.toLowerCase().includes(term));
  }

  private assessLevelAdaptation(response: string, level: string): number {
    const complexity = response.split(' ').length;
    const technicalTerms = (response.match(/\b[A-Z]{2,}\b/g) || []).length;
    
    switch (level) {
      case 'beginner':
        return complexity < 200 && technicalTerms < 5 ? 1 : 0.5;
      case 'intermediate':
        return complexity < 400 && technicalTerms < 10 ? 1 : 0.7;
      case 'expert':
        return complexity > 100 ? 1 : 0.8;
      default:
        return 0.7;
    }
  }
}
