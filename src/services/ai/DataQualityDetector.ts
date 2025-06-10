/**
 * 🔍 DÉTECTEUR DE QUALITÉ DES DONNÉES - EBIOS RM
 * Service pour détecter les données incohérentes, invalides ou de mauvaise qualité
 * Recommandation audit CRITIQUE : Validation intelligente des saisies utilisateur
 */

export interface DataQualityIssue {
  id: string;
  // 🔑 NOUVEAU : Clé unique stable basée sur entité + champ
  stableKey: string; // Format: "entityType:entityId:fieldName"
  type: 'invalid' | 'incoherent' | 'incomplete' | 'suspicious' | 'low-quality';
  severity: 'low' | 'medium' | 'high' | 'critical';
  field: string;
  value: string;
  // 🔒 NOUVEAU : Valeur originale préservée
  originalValue: string;
  message: string;
  suggestion: string;
  confidence: number; // 0-1
  autoFixAvailable: boolean;
  suggestedValue?: string;
  // 🔍 NOUVEAU : Métadonnées pour traçabilité
  entityType?: string;
  entityId?: string;
  correctionCount?: number; // Nombre de corrections appliquées
  lastCorrectionTimestamp?: number;
}

export interface DataQualityReport {
  overallScore: number; // 0-100
  issues: DataQualityIssue[];
  suggestions: string[];
  isValid: boolean;
}

export class DataQualityDetector {
  private idCounter = 0;
  private getCorrectionHistory?: (stableKey: string) => any; // 🔗 Référence au gestionnaire

  // Patterns de détection de données invalides
  private readonly INVALID_PATTERNS = [
    /^[a-z]+$/i, // Lettres uniquement sans sens
    /^[A-Z]+$/, // Majuscules uniquement
    /^[0-9]+$/, // Chiffres uniquement
    /^(.)\1{3,}$/, // Caractères répétés (aaaa, 1111)
    /^(test|exemple|demo|sample)$/i, // Mots de test
    /^[qwerty]+$/i, // Frappe clavier
    /^[asdf]+$/i, // Frappe clavier
    /^[zxcv]+$/i, // Frappe clavier
    /^[!@#$%^&*()]+$/, // Symboles uniquement
  ];

  // Mots suspects ou de test
  private readonly SUSPICIOUS_WORDS = [
    'test', 'exemple', 'demo', 'sample', 'lorem', 'ipsum', 'placeholder',
    'temp', 'temporary', 'fake', 'dummy', 'mock', 'sdfqsdf', 'azerty',
    'qwerty', 'asdf', 'zxcv', 'aaaa', 'bbbb', 'cccc', '1234', '0000',
    'xxx', 'yyy', 'zzz', 'abc', 'def', 'ghi'
  ];

  // Dictionnaire de suggestions contextuelles EBIOS RM
  private readonly EBIOS_SUGGESTIONS = {
    businessValue: [
      'Chiffre d\'affaires',
      'Données clients',
      'Réputation de l\'entreprise',
      'Continuité d\'activité',
      'Propriété intellectuelle',
      'Conformité réglementaire',
      'Sécurité du personnel'
    ],
    dreadedEvent: [
      'Atteinte à la confidentialité des données',
      'Perte de disponibilité des services',
      'Altération de l\'intégrité des données',
      'Usurpation d\'identité',
      'Déni de service',
      'Vol de propriété intellectuelle',
      'Non-conformité réglementaire'
    ],
    supportingAsset: [
      'Serveur de base de données',
      'Application web',
      'Réseau informatique',
      'Personnel IT',
      'Système de sauvegarde',
      'Pare-feu',
      'Poste de travail utilisateur'
    ]
  };

  /**
   * 🔗 Configure la référence au gestionnaire de corrections
   */
  setCorrectionManager(getCorrectionHistory: (stableKey: string) => any): void {
    this.getCorrectionHistory = getCorrectionHistory;
  }

  /**
   * Génère un ID unique pour chaque problème
   */
  private generateUniqueId(prefix: string): string {
    this.idCounter++;
    return `${prefix}-${Date.now()}-${this.idCounter}`;
  }

  /**
   * Analyse la qualité d'une valeur métier
   */
  analyzeBusinessValue(name: string, description: string): DataQualityReport {
    const issues: DataQualityIssue[] = [];
    
    // Analyse du nom
    issues.push(...this.analyzeField('name', name, 'businessValue'));
    
    // Analyse de la description
    issues.push(...this.analyzeField('description', description, 'businessValue'));
    
    // Vérifications spécifiques aux valeurs métier
    if (name && !this.isBusinessValueRealistic(name)) {
      issues.push({
        id: this.generateUniqueId('bv-unrealistic'),
        type: 'incoherent',
        severity: 'high',
        field: 'name',
        value: name,
        message: 'Cette valeur métier ne semble pas réaliste pour une organisation',
        suggestion: 'Utilisez des termes métier concrets (ex: "Chiffre d\'affaires", "Données clients")',
        confidence: 0.8,
        autoFixAvailable: true,
        suggestedValue: this.suggestBusinessValue(name)
      });
    }

    return this.generateReport(issues);
  }

  /**
   * Analyse la qualité d'un événement redouté
   */
  analyzeDreadedEvent(name: string, description: string): DataQualityReport {
    const issues: DataQualityIssue[] = [];
    
    issues.push(...this.analyzeField('name', name, 'dreadedEvent'));
    issues.push(...this.analyzeField('description', description, 'dreadedEvent'));
    
    // Vérifications spécifiques aux événements redoutés
    if (name && !this.isDreadedEventRealistic(name)) {
      issues.push({
        id: this.generateUniqueId('de-unrealistic'),
        type: 'incoherent',
        severity: 'high',
        field: 'name',
        value: name,
        message: 'Cet événement redouté ne correspond pas aux standards EBIOS RM',
        suggestion: 'Formulez comme un impact négatif (ex: "Atteinte à la confidentialité")',
        confidence: 0.85,
        autoFixAvailable: true,
        suggestedValue: this.suggestDreadedEvent(name)
      });
    }

    return this.generateReport(issues);
  }

  /**
   * Analyse la qualité d'un actif support
   */
  analyzeSupportingAsset(name: string, description: string, additionalFields?: Record<string, string>): DataQualityReport {
    const issues: DataQualityIssue[] = [];

    issues.push(...this.analyzeField('name', name, 'supportingAsset'));
    issues.push(...this.analyzeField('description', description, 'supportingAsset'));

    // 🔍 NOUVEAU : Analyse des champs additionnels
    if (additionalFields) {
      Object.entries(additionalFields).forEach(([fieldName, value]) => {
        if (value && typeof value === 'string') {
          issues.push(...this.analyzeField(fieldName, value, 'supportingAsset'));
        }
      });
    }

    return this.generateReport(issues);
  }

  /**
   * 🔍 NOUVEAU : Analyse complète d'une entité EBIOS RM avec clés stables
   */
  analyzeCompleteEntity(
    entityType: 'businessValue' | 'dreadedEvent' | 'supportingAsset',
    entity: Record<string, any>
  ): DataQualityReport {
    const issues: DataQualityIssue[] = [];

    // 🔍 Vérifier si l'entité a un ID valide
    if (!entity.id) {
      console.warn('⚠️ Entité sans ID, analyse ignorée:', entity);
      return this.generateReport([]);
    }

    // Champs obligatoires selon le type d'entité
    const requiredFields = this.getRequiredFields(entityType);
    const optionalFields = this.getOptionalFields(entityType);

    // Analyser tous les champs textuels avec métadonnées d'entité
    [...requiredFields, ...optionalFields].forEach(fieldName => {
      const value = entity[fieldName];
      if (value && typeof value === 'string' && value.trim().length > 0) {
        // 🔑 Générer la clé stable AVANT l'analyse
        const stableKey = `${entityType}:${entity.id}:${fieldName}`;

        // 🔒 Vérifier si ce champ a déjà été corrigé
        const correctionHistory = this.getCorrectionHistory?.(stableKey);
        if (correctionHistory && correctionHistory.correctionCount > 0) {
          console.log(`🔒 Champ ${fieldName} ignoré (déjà corrigé ${correctionHistory.correctionCount}x)`);
          return; // Ignorer ce champ
        }

        const fieldIssues = this.analyzeField(fieldName, value, entityType, entity.id);
        // 🔑 Enrichir avec métadonnées d'entité
        fieldIssues.forEach(issue => {
          issue.entityType = entityType;
          issue.entityId = entity.id;
          issue.stableKey = stableKey;
          issue.originalValue = value; // Préserver la valeur originale
          issue.correctionCount = 0;
        });
        issues.push(...fieldIssues);
      }
    });

    return this.generateReport(issues);
  }

  /**
   * 🔍 NOUVEAU : Obtient les champs requis par type d'entité
   */
  private getRequiredFields(entityType: string): string[] {
    const fieldMap = {
      businessValue: ['name', 'description', 'category'],
      dreadedEvent: ['name', 'description', 'consequences'],
      supportingAsset: ['name', 'description', 'type']
    };

    return fieldMap[entityType as keyof typeof fieldMap] || [];
  }

  /**
   * 🔍 NOUVEAU : Obtient les champs optionnels par type d'entité
   */
  private getOptionalFields(entityType: string): string[] {
    const fieldMap = {
      businessValue: ['stakeholders', 'criticalityLevel', 'responsableEntite'],
      dreadedEvent: ['impactDescription', 'valeurMetierNom'],
      supportingAsset: ['responsableEntite', 'valeurMetierNom', 'securityLevel']
    };

    return fieldMap[entityType as keyof typeof fieldMap] || [];
  }

  /**
   * Analyse générique d'un champ avec support des clés stables
   */
  private analyzeField(fieldName: string, value: string, context: string, entityId?: string): DataQualityIssue[] {
    const issues: DataQualityIssue[] = [];
    
    if (!value || value.trim().length === 0) {
      return issues; // Champ vide, pas d'analyse
    }

    const trimmedValue = value.trim();

    // Détection de patterns invalides
    for (const pattern of this.INVALID_PATTERNS) {
      if (pattern.test(trimmedValue)) {
        issues.push({
          id: this.generateUniqueId(`invalid-pattern-${fieldName}`),
          stableKey: `${context}:${entityId || 'unknown'}:${fieldName}`,
          type: 'invalid',
          severity: 'critical',
          field: fieldName,
          value: trimmedValue,
          originalValue: trimmedValue,
          message: 'Cette saisie semble être du texte de test ou aléatoire',
          suggestion: 'Saisissez une valeur métier réelle et significative',
          confidence: 0.9,
          autoFixAvailable: true,
          suggestedValue: this.getSuggestionForContext(context, trimmedValue, fieldName),
          entityType: context,
          entityId: entityId || 'unknown',
          correctionCount: 0
        });
        break;
      }
    }

    // Détection de mots suspects
    const lowerValue = trimmedValue.toLowerCase();
    for (const suspiciousWord of this.SUSPICIOUS_WORDS) {
      if (lowerValue.includes(suspiciousWord)) {
        issues.push({
          id: this.generateUniqueId(`suspicious-word-${fieldName}`),
          stableKey: `${context}:${entityId || 'unknown'}:${fieldName}`,
          type: 'suspicious',
          severity: 'high',
          field: fieldName,
          value: trimmedValue,
          originalValue: trimmedValue,
          message: `Contient un mot suspect: "${suspiciousWord}"`,
          suggestion: 'Remplacez par une valeur réelle de votre organisation',
          confidence: 0.85,
          autoFixAvailable: true,
          suggestedValue: this.getSuggestionForContext(context, trimmedValue, fieldName),
          entityType: context,
          entityId: entityId || 'unknown',
          correctionCount: 0
        });
        break;
      }
    }

    // Détection de longueur insuffisante
    if (trimmedValue.length < 3) {
      issues.push({
        id: this.generateUniqueId(`too-short-${fieldName}`),
        stableKey: `${context}:${entityId || 'unknown'}:${fieldName}`,
        type: 'incomplete',
        severity: 'medium',
        field: fieldName,
        value: trimmedValue,
        originalValue: trimmedValue,
        message: 'Valeur trop courte pour être significative',
        suggestion: 'Fournissez une description plus détaillée',
        confidence: 0.7,
        autoFixAvailable: false,
        entityType: context,
        entityId: entityId || 'unknown',
        correctionCount: 0
      });
    }

    return issues;
  }

  /**
   * Vérifie si une valeur métier est réaliste
   */
  private isBusinessValueRealistic(name: string): boolean {
    const businessTerms = [
      'chiffre', 'affaires', 'revenus', 'clients', 'données', 'réputation',
      'image', 'marque', 'continuité', 'activité', 'service', 'production',
      'propriété', 'intellectuelle', 'conformité', 'réglementaire', 'personnel',
      'sécurité', 'qualité', 'innovation', 'recherche', 'développement'
    ];
    
    const lowerName = name.toLowerCase();
    return businessTerms.some(term => lowerName.includes(term));
  }

  /**
   * Vérifie si un événement redouté est réaliste
   */
  private isDreadedEventRealistic(name: string): boolean {
    const threatTerms = [
      'atteinte', 'perte', 'vol', 'altération', 'corruption', 'destruction',
      'divulgation', 'fuite', 'compromission', 'usurpation', 'déni',
      'interruption', 'indisponibilité', 'défaillance', 'sabotage'
    ];
    
    const lowerName = name.toLowerCase();
    return threatTerms.some(term => lowerName.includes(term));
  }

  /**
   * Suggère une valeur métier appropriée
   */
  private suggestBusinessValue(input: string): string {
    return this.EBIOS_SUGGESTIONS.businessValue[
      Math.floor(Math.random() * this.EBIOS_SUGGESTIONS.businessValue.length)
    ];
  }

  /**
   * Suggère un événement redouté approprié
   */
  private suggestDreadedEvent(input: string): string {
    return this.EBIOS_SUGGESTIONS.dreadedEvent[
      Math.floor(Math.random() * this.EBIOS_SUGGESTIONS.dreadedEvent.length)
    ];
  }

  /**
   * Obtient une suggestion selon le contexte (améliorée avec logique contextuelle)
   */
  private getSuggestionForContext(context: string, currentValue?: string, fieldName?: string): string {
    // 🎯 Logique contextuelle intelligente
    if (currentValue && fieldName) {
      const lowerValue = currentValue.toLowerCase();
      const lowerField = fieldName.toLowerCase();

      // Pour les niveaux de criticité
      if (lowerField.includes('criticality') || lowerField.includes('level')) {
        if (lowerValue.includes('important')) return 'critique';
        if (lowerValue.includes('primary')) return 'essentiel';
        if (lowerValue.includes('operational')) return 'important';
        return 'critique';
      }

      // Pour les catégories
      if (lowerField.includes('category')) {
        if (lowerValue.includes('primary')) return 'stratégique';
        if (lowerValue.includes('operational')) return 'opérationnel';
        if (lowerValue.includes('important')) return 'critique';
        return 'stratégique';
      }

      // Suggestions contextuelles selon la valeur actuelle
      if (lowerValue.includes('important') || lowerValue.includes('critique')) {
        return context === 'businessValue' ? 'Données clients critiques' :
               context === 'dreadedEvent' ? 'Atteinte à la confidentialité des données' :
               'Serveur de base de données critique';
      }

      if (lowerValue.includes('primary') || lowerValue.includes('principal')) {
        return context === 'businessValue' ? 'Chiffre d\'affaires principal' :
               context === 'dreadedEvent' ? 'Perte de disponibilité des services' :
               'Application web principale';
      }

      if (lowerValue.includes('operational') || lowerValue.includes('opération')) {
        return context === 'businessValue' ? 'Continuité d\'activité opérationnelle' :
               context === 'dreadedEvent' ? 'Interruption d\'activité' :
               'Infrastructure opérationnelle';
      }
    }

    // Fallback vers suggestions par défaut
    const suggestions = this.EBIOS_SUGGESTIONS[context as keyof typeof this.EBIOS_SUGGESTIONS];
    if (suggestions) {
      return suggestions[Math.floor(Math.random() * suggestions.length)];
    }
    return 'Valeur exemple appropriée';
  }

  /**
   * Génère le rapport final
   */
  private generateReport(issues: DataQualityIssue[]): DataQualityReport {
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const highIssues = issues.filter(i => i.severity === 'high').length;
    const mediumIssues = issues.filter(i => i.severity === 'medium').length;
    
    // Calcul du score (100 = parfait, 0 = très mauvais)
    let score = 100;
    score -= criticalIssues * 40;
    score -= highIssues * 25;
    score -= mediumIssues * 10;
    score = Math.max(0, score);

    const suggestions = [
      ...issues.filter(i => i.autoFixAvailable).map(i => i.suggestion),
      'Consultez les exemples EBIOS RM pour des saisies appropriées',
      'Utilisez des termes métier concrets et spécifiques à votre organisation'
    ];

    return {
      overallScore: score,
      issues,
      suggestions: [...new Set(suggestions)], // Dédoublonnage
      isValid: criticalIssues === 0 && highIssues === 0
    };
  }
}

export const dataQualityDetector = new DataQualityDetector();
