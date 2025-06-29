/**
 * Service de compatibilité pour l'import/export avec les bases Access EBIOS RM
 * Gère la conversion bidirectionnelle et l'enrichissement IA
 */

import { 
  BusinessValue, 
  RiskSource, 
  SecurityMeasure, 
  DreadedEvent,
  AttackPath,
  SupportingAsset,
  Stakeholder
} from '@/types/ebios';

export class AccessCompatibilityService {
  
  /**
   * Mappe la nature Access vers la catégorie Firebase
   */
  mapNatureToCategory(nature?: string): BusinessValue['category'] {
    if (!nature) return 'primary';
    
    const mapping: Record<string, BusinessValue['category']> = {
      'PROCESSUS': 'primary',
      'INFORMATION': 'support',
      'GOUVERNANCE': 'management'
    };
    
    return mapping[nature] || 'management';
  }

  /**
   * Mappe la catégorie Firebase vers la nature Access
   */
  mapCategoryToNature(category: BusinessValue['category']): string {
    const reverseMapping: Record<BusinessValue['category'], string> = {
      'primary': 'PROCESSUS',
      'support': 'INFORMATION',
      'management': 'GOUVERNANCE',
      'essential': 'PROCESSUS' // 🔧 CORRECTION: Ajout catégorie manquante
    };
    
    return reverseMapping[category];
  }

  /**
   * Déduit la catégorie d'une source de risque basée sur son nom
   */
  inferRiskSourceCategory(name: string): RiskSource['category'] {
    const nameLower = name.toLowerCase();
    
    if (nameLower.includes('concurrent') || nameLower.includes('competitor')) {
      return 'competitor';
    } else if (nameLower.includes('hacktiviste') || nameLower.includes('activist')) {
      return 'activist';
    } else if (nameLower.includes('terroriste') || nameLower.includes('terrorist')) {
      return 'terrorist';
    } else if (nameLower.includes('état') || nameLower.includes('state') || nameLower.includes('nation')) {
      return 'state';
    } else if (nameLower.includes('interne') || nameLower.includes('insider')) {
      return 'insider';
    } else if (nameLower.includes('naturel') || nameLower.includes('natural')) {
      return 'natural';
    }
    
    return 'cybercriminal'; // Défaut
  }

  /**
   * Convertit le type de mesure Access vers le contrôle Firebase
   */
  mapAccessMeasureType(typeMesure?: string): SecurityMeasure['controlType'] {
    if (!typeMesure) return 'preventive';
    
    const mapping: Record<string, SecurityMeasure['controlType']> = {
      'GOUVERNANCE': 'directive',
      'PROTECTION': 'preventive',
      'DEFENSE': 'detective',
      'RESILIENCE': 'corrective'
    };
    
    return mapping[typeMesure] || 'preventive';
  }

  /**
   * Convertit l'échelle de pertinence Access (1-3) vers Firebase (1-4)
   */
  mapAccessPertinence(pertinence?: 1 | 2 | 3): 1 | 2 | 3 | 4 {
    if (!pertinence) return 2;
    
    // Mapping: 1→1, 2→2-3, 3→4
    const mapping: Record<number, 1 | 2 | 3 | 4> = {
      1: 1,
      2: 3,
      3: 4
    };
    
    return mapping[pertinence] || 2;
  }

  /**
   * Convertit une liste d'impacts Access vers une chaîne Firebase
   */
  mergeImpacts(impactsList?: string[]): string {
    if (!impactsList || impactsList.length === 0) {
      return '';
    }
    
    return impactsList.join(' | ');
  }

  /**
   * Sépare une chaîne d'impacts Firebase vers une liste Access
   */
  splitImpacts(consequences?: string): string[] {
    if (!consequences) return [];
    
    return consequences.split(' | ').map(impact => impact.trim()).filter(Boolean);
  }

  /**
   * Génère des IDs Firebase à partir des noms Access
   */
  generateIdFromName(name: string): string {
    // Simple hash pour créer un ID reproductible
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 20) + '_' + this.simpleHash(name);
  }

  /**
   * Hash simple pour générer des IDs uniques
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 8);
  }

  /**
   * Convertit une valeur métier Access vers Firebase
   */
  convertBusinessValueFromAccess(accessData: any): Partial<BusinessValue> {
    return {
      name: accessData['Denomination Valeur Metier'],
      description: accessData['Description'] || '',
      category: this.mapNatureToCategory(accessData['Nature Valeur Metier']),
      natureValeurMetier: accessData['Nature Valeur Metier'],
      responsableEntite: accessData['Entite Personne Responsable'],
      missionNom: accessData['Mission'],
      // Les autres champs seront complétés par l'IA
      aiMetadata: {
        autoCompleted: false,
        suggestedCategory: this.mapNatureToCategory(accessData['Nature Valeur Metier']),
        coherenceScore: 0 // À calculer
      }
    };
  }

  /**
   * Convertit une source de risque Access vers Firebase
   */
  convertRiskSourceFromAccess(accessData: any): Partial<RiskSource> {
    const name = accessData['Source de Risque'];
    
    return {
      name,
      description: `Source de risque importée depuis Access`, // À enrichir par l'IA
      category: this.inferRiskSourceCategory(name),
      categoryAuto: true, // Indique que la catégorie a été déduite
      // Les autres champs seront enrichis par l'IA
      aiProfile: {
        threatLevel: 0, // À calculer
        predictedActions: [],
        recommendedDefenses: []
      }
    };
  }

  /**
   * Convertit un événement redouté Access vers Firebase
   */
  convertDreadedEventFromAccess(accessData: any, impacts?: string[]): Partial<DreadedEvent> {
    return {
      name: accessData['Evenement Redoute'],
      gravity: accessData['Gravite'] || 2,
      consequences: this.mergeImpacts(impacts),
      impactsList: impacts,
      valeurMetierNom: accessData['Valeur Metier'],
      // Type d'impact à déduire par l'IA
      aiAnalysis: {
        impactSeverity: accessData['Gravite'] || 2,
        cascadingEffects: [],
        mitigationSuggestions: []
      }
    };
  }

  /**
   * Convertit une mesure de sécurité Access vers Firebase
   */
  convertSecurityMeasureFromAccess(accessData: any): Partial<SecurityMeasure> {
    return {
      name: accessData['Mesure Securite'],
      controlType: this.mapAccessMeasureType(accessData['Type Mesure']),
      typeMesureAccess: accessData['Type Mesure'],
      freinDifficulteMEO: accessData['Frein Difficulte MEO'],
      echeanceEnMois: accessData['Echeance em mois'],
      status: this.mapAccessStatus(accessData['Status']),
      // ISO sera suggéré par l'IA
      aiMetadata: {
        autoCompleted: false,
        suggestedISO: {
          category: '', // À déterminer par l'IA
          control: '',  // À déterminer par l'IA
          confidence: 0
        }
      }
    };
  }

  /**
   * Mappe le statut Access vers Firebase
   */
  private mapAccessStatus(status?: string): SecurityMeasure['status'] {
    if (!status) return 'planned';
    
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('terminé') || statusLower.includes('completed')) {
      return 'implemented';
    } else if (statusLower.includes('en cours') || statusLower.includes('in progress')) {
      return 'in_progress';
    } else if (statusLower.includes('lancer') || statusLower.includes('planned')) {
      return 'planned';
    }
    
    return 'planned';
  }

  /**
   * Prépare les données pour l'enrichissement IA
   */
  prepareForAIEnrichment(data: any, entityType: string): any {
    return {
      data,
      entityType,
      context: {
        source: 'access_import',
        requiresEnrichment: true,
        missingFields: this.detectMissingFields(data, entityType)
      }
    };
  }

  /**
   * Détecte les champs manquants nécessitant l'IA
   */
  private detectMissingFields(data: any, entityType: string): string[] {
    const missingFields: string[] = [];
    
    switch (entityType) {
      case 'BusinessValue':
        if (!data.description) missingFields.push('description');
        if (!data.priority) missingFields.push('priority');
        if (!data.criticalityLevel) missingFields.push('criticalityLevel');
        break;
        
      case 'RiskSource':
        if (!data.description) missingFields.push('description');
        if (!data.expertise) missingFields.push('expertise');
        if (!data.resources) missingFields.push('resources');
        if (!data.motivation) missingFields.push('motivation');
        break;
        
      case 'SecurityMeasure':
        if (!data.isoCategory) missingFields.push('isoCategory');
        if (!data.isoControl) missingFields.push('isoControl');
        if (!data.effectiveness) missingFields.push('effectiveness');
        if (!data.implementationCost) missingFields.push('implementationCost');
        break;
    }
    
    return missingFields;
  }
}

// Export singleton instance
export const accessCompatibilityService = new AccessCompatibilityService(); 