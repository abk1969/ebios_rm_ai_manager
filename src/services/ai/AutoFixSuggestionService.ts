/**
 * 🤖 SERVICE SUGGESTIONS IA - CORRECTION AUTOMATIQUE
 * Génère des suggestions intelligentes pour corriger les problèmes EBIOS RM
 * CONFORMITÉ ANSSI: Suggestions basées sur les bonnes pratiques
 */

interface AutoFixSuggestion {
  id: string;
  title: string;
  description: string;
  action: 'add' | 'modify' | 'link' | 'evaluate';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  anssiReference: string;
  data?: any;
}

interface ValidationGap {
  criterion: string;
  businessValues: any[];
  supportingAssets: any[];
  dreadedEvents: any[];
}

export class AutoFixSuggestionService {
  
  /**
   * Génère des suggestions de correction automatique
   */
  static generateSuggestions(gap: ValidationGap): AutoFixSuggestion[] {
    const suggestions: AutoFixSuggestion[] = [];
    
    switch (gap.criterion) {
      case 'Valeurs métier identifiées':
        suggestions.push(...this.generateBusinessValueSuggestions(gap));
        break;
        
      case 'Actifs supports cartographiés':
        suggestions.push(...this.generateSupportingAssetSuggestions(gap));
        break;
        
      case 'Événements redoutés définis':
        suggestions.push(...this.generateDreadedEventSuggestions(gap));
        break;
        
      case 'Socle de sécurité évalué':
        suggestions.push(...this.generateSecurityBaselineSuggestions(gap));
        break;
    }
    
    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  
  /**
   * Suggestions pour les valeurs métier manquantes
   */
  private static generateBusinessValueSuggestions(gap: ValidationGap): AutoFixSuggestion[] {
    const suggestions: AutoFixSuggestion[] = [];
    
    if (gap.businessValues.length === 0) {
      suggestions.push({
        id: 'add-primary-business-values',
        title: 'Ajouter des valeurs métier primaires',
        description: 'Identifiez vos processus métier critiques (ex: facturation, production, relation client)',
        action: 'add',
        priority: 'high',
        estimatedTime: '10-15 min',
        anssiReference: 'EBIOS RM v1.5 - Atelier 1, Étape 1',
        data: {
          suggestions: [
            { name: 'Processus de facturation', category: 'primary', priority: 4 },
            { name: 'Données clients', category: 'primary', priority: 4 },
            { name: 'Système de production', category: 'primary', priority: 3 }
          ]
        }
      });
    }
    
    if (gap.businessValues.length < 3) {
      suggestions.push({
        id: 'complete-business-values',
        title: 'Compléter l\'inventaire des valeurs métier',
        description: `Vous avez ${gap.businessValues.length} valeur(s). ANSSI recommande au moins 3 pour une analyse complète.`,
        action: 'add',
        priority: 'medium',
        estimatedTime: '5-10 min',
        anssiReference: 'EBIOS RM v1.5 - Bonnes pratiques',
        data: {
          currentCount: gap.businessValues.length,
          targetCount: 3
        }
      });
    }
    
    return suggestions;
  }
  
  /**
   * Suggestions pour les actifs supports manquants
   */
  private static generateSupportingAssetSuggestions(gap: ValidationGap): AutoFixSuggestion[] {
    const suggestions: AutoFixSuggestion[] = [];
    
    // Identifier les valeurs métier sans actifs supports
    const uncoveredValues = gap.businessValues.filter(bv => 
      !gap.supportingAssets.some(sa => sa.businessValueId === bv.id)
    );
    
    if (uncoveredValues.length > 0) {
      uncoveredValues.forEach(value => {
        suggestions.push({
          id: `add-assets-for-${value.id}`,
          title: `Ajouter actifs pour "${value.name}"`,
          description: `Cette valeur métier n'a aucun actif support identifié. Ajoutez les systèmes, données ou équipements qui la supportent.`,
          action: 'add',
          priority: 'high',
          estimatedTime: '3-5 min',
          anssiReference: 'EBIOS RM v1.5 - Atelier 1, Étape 2',
          data: {
            businessValueId: value.id,
            businessValueName: value.name,
            suggestedAssets: this.generateAssetSuggestions(value)
          }
        });
      });
    }
    
    return suggestions;
  }
  
  /**
   * Suggestions pour les événements redoutés manquants
   */
  private static generateDreadedEventSuggestions(gap: ValidationGap): AutoFixSuggestion[] {
    const suggestions: AutoFixSuggestion[] = [];
    
    // Identifier les valeurs métier sans événements redoutés
    const uncoveredValues = gap.businessValues.filter(bv => 
      !gap.dreadedEvents.some(de => de.businessValueId === bv.id)
    );
    
    if (uncoveredValues.length > 0) {
      uncoveredValues.forEach(value => {
        suggestions.push({
          id: `add-events-for-${value.id}`,
          title: `Définir événements pour "${value.name}"`,
          description: `Cette valeur métier n'a aucun événement redouté. Identifiez ce que vous craignez qu'il lui arrive.`,
          action: 'add',
          priority: 'high',
          estimatedTime: '5-8 min',
          anssiReference: 'EBIOS RM v1.5 - Atelier 1, Étape 3',
          data: {
            businessValueId: value.id,
            businessValueName: value.name,
            suggestedEvents: this.generateEventSuggestions(value)
          }
        });
      });
    }
    
    return suggestions;
  }
  
  /**
   * Suggestions pour l'évaluation du socle de sécurité
   */
  private static generateSecurityBaselineSuggestions(gap: ValidationGap): AutoFixSuggestion[] {
    return [{
      id: 'evaluate-security-baseline',
      title: 'Évaluer le socle de sécurité',
      description: 'Analysez les mesures de sécurité existantes pour chaque actif support identifié.',
      action: 'evaluate',
      priority: 'medium',
      estimatedTime: '15-20 min',
      anssiReference: 'EBIOS RM v1.5 - Atelier 1, Étape 4',
      data: {
        assetsToEvaluate: gap.supportingAssets.length,
        securityDomains: ['Physique', 'Logique', 'Organisationnel', 'Humain']
      }
    }];
  }
  
  /**
   * Génère des suggestions d'actifs supports selon le type de valeur métier
   */
  private static generateAssetSuggestions(businessValue: any): any[] {
    const suggestions = [];
    
    const category = businessValue.category?.toLowerCase() || '';
    const name = businessValue.name?.toLowerCase() || '';
    
    // Suggestions basées sur la catégorie
    if (category === 'primary' || name.includes('facturation') || name.includes('vente')) {
      suggestions.push(
        { name: 'Système de facturation', type: 'software', securityLevel: 'high' },
        { name: 'Base de données clients', type: 'data', securityLevel: 'high' },
        { name: 'Serveur applicatif', type: 'hardware', securityLevel: 'medium' }
      );
    }
    
    if (name.includes('données') || name.includes('information')) {
      suggestions.push(
        { name: 'Serveur de fichiers', type: 'hardware', securityLevel: 'high' },
        { name: 'Système de sauvegarde', type: 'hardware', securityLevel: 'medium' },
        { name: 'Réseau local', type: 'network', securityLevel: 'medium' }
      );
    }
    
    if (name.includes('production') || name.includes('fabrication')) {
      suggestions.push(
        { name: 'Automates industriels', type: 'hardware', securityLevel: 'high' },
        { name: 'Système de supervision', type: 'software', securityLevel: 'high' },
        { name: 'Réseau industriel', type: 'network', securityLevel: 'medium' }
      );
    }
    
    // Suggestions génériques si aucune correspondance
    if (suggestions.length === 0) {
      suggestions.push(
        { name: 'Poste de travail', type: 'hardware', securityLevel: 'medium' },
        { name: 'Application métier', type: 'software', securityLevel: 'medium' },
        { name: 'Données de travail', type: 'data', securityLevel: 'medium' }
      );
    }
    
    return suggestions.slice(0, 3); // Limiter à 3 suggestions
  }
  
  /**
   * Génère des suggestions d'événements redoutés selon le type de valeur métier
   */
  private static generateEventSuggestions(businessValue: any): any[] {
    const suggestions = [];
    
    const name = businessValue.name?.toLowerCase() || '';
    
    // Événements selon le type de valeur métier
    if (name.includes('données') || name.includes('information')) {
      suggestions.push(
        { name: 'Vol de données', impactType: 'confidentiality', gravity: 4 },
        { name: 'Corruption de données', impactType: 'integrity', gravity: 3 },
        { name: 'Perte de données', impactType: 'availability', gravity: 4 }
      );
    }
    
    if (name.includes('système') || name.includes('application')) {
      suggestions.push(
        { name: 'Indisponibilité du système', impactType: 'availability', gravity: 3 },
        { name: 'Compromission du système', impactType: 'integrity', gravity: 4 },
        { name: 'Accès non autorisé', impactType: 'confidentiality', gravity: 3 }
      );
    }
    
    if (name.includes('processus') || name.includes('activité')) {
      suggestions.push(
        { name: 'Arrêt du processus', impactType: 'availability', gravity: 3 },
        { name: 'Dysfonctionnement', impactType: 'integrity', gravity: 2 },
        { name: 'Divulgation d\'informations', impactType: 'confidentiality', gravity: 3 }
      );
    }
    
    // Événements génériques
    if (suggestions.length === 0) {
      suggestions.push(
        { name: 'Indisponibilité', impactType: 'availability', gravity: 3 },
        { name: 'Altération', impactType: 'integrity', gravity: 3 },
        { name: 'Divulgation', impactType: 'confidentiality', gravity: 3 }
      );
    }
    
    return suggestions.slice(0, 3); // Limiter à 3 suggestions
  }
  
  /**
   * Applique automatiquement une suggestion
   */
  static async applySuggestion(suggestion: AutoFixSuggestion, callbacks: any): Promise<boolean> {
    try {
      switch (suggestion.action) {
        case 'add':
          if (suggestion.id.includes('business-values')) {
            // Ouvrir le modal d'ajout de valeur métier
            callbacks.onAddBusinessValue?.();
          } else if (suggestion.id.includes('assets')) {
            // Ouvrir le modal d'ajout d'actif support
            callbacks.onAddSupportingAsset?.(suggestion.data?.businessValueId);
          } else if (suggestion.id.includes('events')) {
            // Ouvrir le modal d'ajout d'événement redouté
            callbacks.onAddDreadedEvent?.(suggestion.data?.businessValueId);
          }
          break;
          
        case 'evaluate':
          // Naviguer vers la section d'évaluation
          callbacks.onNavigateToSection?.('security-baseline');
          break;
          
        default:
          console.warn('Action non supportée:', suggestion.action);
          return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'application de la suggestion:', error);
      return false;
    }
  }
}

export default AutoFixSuggestionService;
