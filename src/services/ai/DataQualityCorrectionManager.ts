/**
 * 🔧 DATA QUALITY CORRECTION MANAGER
 * Gestionnaire stable des corrections avec préservation des valeurs originales
 */

import { DataQualityIssue } from './DataQualityDetector';

export interface CorrectionHistory {
  stableKey: string;
  originalValue: string;
  corrections: {
    timestamp: number;
    fromValue: string;
    toValue: string;
    confidence: number;
    source: 'manual' | 'auto' | 'a2a' | 'mcp';
  }[];
  currentValue: string;
  correctionCount: number;
}

export interface CorrectionResult {
  success: boolean;
  newValue: string;
  preservedOriginal: string;
  correctionCount: number;
  error?: string;
}

/**
 * Gestionnaire centralisé des corrections de qualité des données
 */
export class DataQualityCorrectionManager {
  private correctionHistory = new Map<string, CorrectionHistory>();
  private readonly MAX_CORRECTIONS_PER_FIELD = 5; // Limite pour éviter les boucles

  /**
   * 🔑 Initialise l'historique pour un problème
   */
  initializeProblem(issue: DataQualityIssue): void {
    if (!issue.stableKey) {
      console.warn('⚠️ Issue sans stableKey:', issue);
      return;
    }

    if (!this.correctionHistory.has(issue.stableKey)) {
      this.correctionHistory.set(issue.stableKey, {
        stableKey: issue.stableKey,
        originalValue: issue.originalValue || issue.value,
        corrections: [],
        currentValue: issue.value,
        correctionCount: 0
      });
    }
  }

  /**
   * 🔧 Applique une correction avec préservation de l'historique
   */
  applyCorrection(
    issue: DataQualityIssue,
    newValue: string,
    source: 'manual' | 'auto' | 'a2a' | 'mcp' = 'auto'
  ): CorrectionResult {
    
    if (!issue.stableKey) {
      return {
        success: false,
        newValue: issue.value,
        preservedOriginal: issue.originalValue || issue.value,
        correctionCount: 0,
        error: 'Clé stable manquante'
      };
    }

    // Initialiser si nécessaire
    this.initializeProblem(issue);
    
    const history = this.correctionHistory.get(issue.stableKey)!;

    // Vérifier la limite de corrections
    if (history.correctionCount >= this.MAX_CORRECTIONS_PER_FIELD) {
      return {
        success: false,
        newValue: history.currentValue,
        preservedOriginal: history.originalValue,
        correctionCount: history.correctionCount,
        error: `Limite de ${this.MAX_CORRECTIONS_PER_FIELD} corrections atteinte`
      };
    }

    // Éviter les corrections identiques
    if (history.currentValue === newValue) {
      return {
        success: false,
        newValue: history.currentValue,
        preservedOriginal: history.originalValue,
        correctionCount: history.correctionCount,
        error: 'Valeur identique à la valeur actuelle'
      };
    }

    // Enregistrer la correction
    history.corrections.push({
      timestamp: Date.now(),
      fromValue: history.currentValue,
      toValue: newValue,
      confidence: issue.confidence || 0.8,
      source
    });

    history.currentValue = newValue;
    history.correctionCount++;

    console.log(`🔧 Correction appliquée pour ${issue.stableKey}:`, {
      original: history.originalValue,
      from: history.corrections[history.corrections.length - 1].fromValue,
      to: newValue,
      count: history.correctionCount
    });

    return {
      success: true,
      newValue: newValue,
      preservedOriginal: history.originalValue,
      correctionCount: history.correctionCount
    };
  }

  /**
   * 🔄 Restaure la valeur originale
   */
  restoreOriginal(stableKey: string): CorrectionResult {
    const history = this.correctionHistory.get(stableKey);
    
    if (!history) {
      return {
        success: false,
        newValue: '',
        preservedOriginal: '',
        correctionCount: 0,
        error: 'Historique non trouvé'
      };
    }

    const originalValue = history.originalValue;
    
    // Enregistrer la restauration
    history.corrections.push({
      timestamp: Date.now(),
      fromValue: history.currentValue,
      toValue: originalValue,
      confidence: 1.0,
      source: 'manual'
    });

    history.currentValue = originalValue;
    history.correctionCount++;

    console.log(`🔄 Restauration originale pour ${stableKey}:`, {
      restored: originalValue,
      corrections: history.correctionCount
    });

    return {
      success: true,
      newValue: originalValue,
      preservedOriginal: originalValue,
      correctionCount: history.correctionCount
    };
  }

  /**
   * 📊 Obtient l'historique d'un problème
   */
  getHistory(stableKey: string): CorrectionHistory | null {
    return this.correctionHistory.get(stableKey) || null;
  }

  /**
   * 🔍 Obtient la valeur actuelle d'un champ
   */
  getCurrentValue(stableKey: string): string | null {
    const history = this.correctionHistory.get(stableKey);
    return history ? history.currentValue : null;
  }

  /**
   * 🔒 Obtient la valeur originale d'un champ
   */
  getOriginalValue(stableKey: string): string | null {
    const history = this.correctionHistory.get(stableKey);
    return history ? history.originalValue : null;
  }

  /**
   * 🧹 Nettoie l'historique (pour tests ou reset)
   */
  clearHistory(stableKey?: string): void {
    if (stableKey) {
      this.correctionHistory.delete(stableKey);
      console.log(`🧹 Historique nettoyé pour ${stableKey}`);
    } else {
      this.correctionHistory.clear();
      console.log('🧹 Tout l\'historique nettoyé');
    }
  }

  /**
   * 📈 Statistiques des corrections
   */
  getStats(): {
    totalProblems: number;
    totalCorrections: number;
    averageCorrectionsPerProblem: number;
    problemsWithMultipleCorrections: number;
  } {
    const histories = Array.from(this.correctionHistory.values());
    const totalCorrections = histories.reduce((sum, h) => sum + h.correctionCount, 0);
    const problemsWithMultiple = histories.filter(h => h.correctionCount > 1).length;

    return {
      totalProblems: histories.length,
      totalCorrections,
      averageCorrectionsPerProblem: histories.length > 0 ? totalCorrections / histories.length : 0,
      problemsWithMultipleCorrections: problemsWithMultiple
    };
  }

  /**
   * 🚨 Détecte les problèmes de correction en boucle
   */
  detectCorrectionLoops(): string[] {
    const problematicKeys: string[] = [];

    for (const [stableKey, history] of this.correctionHistory.entries()) {
      if (history.correctionCount >= 3) {
        // Vérifier si on revient aux mêmes valeurs
        const values = history.corrections.map(c => c.toValue);
        const uniqueValues = new Set(values);
        
        if (uniqueValues.size < values.length * 0.7) {
          problematicKeys.push(stableKey);
        }
      }
    }

    if (problematicKeys.length > 0) {
      console.warn('🚨 Boucles de correction détectées:', problematicKeys);
    }

    return problematicKeys;
  }
}

export const dataQualityCorrectionManager = new DataQualityCorrectionManager();
