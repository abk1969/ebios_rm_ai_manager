import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query,
  where,
  getDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { StrategicScenario, GravityScale, LikelihoodScale } from '@/types/ebios';
import { EbiosUtils } from '@/lib/ebios-constants';

const COLLECTION_NAME = 'strategicScenarios';

export const strategicScenariosCollection = collection(db, COLLECTION_NAME);

export async function getStrategicScenarios(missionId: string): Promise<StrategicScenario[]> {
  try {
    const q = query(
      strategicScenariosCollection, 
      where('missionId', '==', missionId)
    );
    const snapshot = await getDocs(q);
    
    const scenarios = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as StrategicScenario));

    // Tri côté client pour éviter les index Firebase
    return scenarios.sort((a, b) => {
      // Ordonner par niveau de risque décroissant, puis par date de création décroissante
      if (a.riskLevel !== b.riskLevel) {
        return EbiosUtils.normalizeRiskLevel(b.riskLevel) - EbiosUtils.normalizeRiskLevel(a.riskLevel);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } catch (error) {
    console.error('Error getting strategic scenarios:', error);
    throw error;
  }
}

export async function getStrategicScenariosByRiskSource(riskSourceId: string): Promise<StrategicScenario[]> {
  try {
    const q = query(
      strategicScenariosCollection, 
      where('riskSourceId', '==', riskSourceId)
    );
    const snapshot = await getDocs(q);
    
    const scenarios = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as StrategicScenario));

    // Tri côté client par niveau de risque décroissant
    return scenarios.sort((a, b) => EbiosUtils.normalizeRiskLevel(b.riskLevel) - EbiosUtils.normalizeRiskLevel(a.riskLevel));
  } catch (error) {
    console.error('Error getting strategic scenarios by risk source:', error);
    throw error;
  }
}

export async function getStrategicScenarioById(id: string): Promise<StrategicScenario | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: docSnap.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as StrategicScenario) : null;
  } catch (error) {
    console.error('Error getting strategic scenario by id:', error);
    throw error;
  }
}

export async function createStrategicScenario(data: Omit<StrategicScenario, 'id' | 'riskLevel'>): Promise<StrategicScenario> {
  try {
    // Validation des données selon EBIOS RM
    if (!data.name || data.name.length === 0 || data.name.length > 100) {
      throw new Error('Le nom du scénario est requis et ne doit pas dépasser 100 caractères');
    }
    
    if (!data.description || data.description.length > 1000) {
      throw new Error('La description est requise et ne doit pas dépasser 1000 caractères');
    }
    
    if (![1, 2, 3, 4].includes(data.likelihood)) {
      throw new Error('La vraisemblance doit être comprise entre 1 et 4 selon l\'échelle ANSSI');
    }
    
    if (![1, 2, 3, 4].includes(data.gravity)) {
      throw new Error('La gravité doit être comprise entre 1 et 4 selon l\'échelle ANSSI');
    }

    // Calcul automatique du niveau de risque selon matrice ANSSI
    const riskLevel = EbiosUtils.calculateRiskLevel(data.gravity, data.likelihood);
    
    // Génération automatique de l'identifiant selon nomenclature EBIOS RM
    const existingScenarios = await getStrategicScenarios(data.missionId);
    const scenarioId = EbiosUtils.generateScenarioId(data.missionId, 'strategic', existingScenarios.length + 1);

    const scenarioData = {
      ...data,
      riskLevel,
      pathways: data.pathways || [], // Initialiser les chemins d'attaque
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(strategicScenariosCollection, scenarioData);
    
    return {
      id: docRef.id,
      ...data,
      riskLevel,
      pathways: data.pathways || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as StrategicScenario;
  } catch (error) {
    console.error('Error creating strategic scenario:', error);
    throw error;
  }
}

export async function updateStrategicScenario(id: string, data: Partial<Omit<StrategicScenario, 'id'>>): Promise<StrategicScenario> {
  try {
    // Recalculer le niveau de risque si gravité ou vraisemblance changent
    let updateData = { ...data };
    
    if (data.gravity || data.likelihood) {
      const currentScenario = await getStrategicScenarioById(id);
      if (!currentScenario) {
        throw new Error('Scénario stratégique non trouvé');
      }
      
      const gravity = data.gravity || currentScenario.gravity;
      const likelihood = data.likelihood || currentScenario.likelihood;
      updateData.riskLevel = EbiosUtils.calculateRiskLevel(gravity, likelihood);
    }
    
    const docRef = doc(db, COLLECTION_NAME, id);
    const finalUpdateData = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(docRef, finalUpdateData);
    
    const updatedScenario = await getStrategicScenarioById(id);
    if (!updatedScenario) {
      throw new Error('Scénario stratégique non trouvé après mise à jour');
    }

    return updatedScenario;
  } catch (error) {
    console.error('Error updating strategic scenario:', error);
    throw error;
  }
}

export async function deleteStrategicScenario(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting strategic scenario:', error);
    throw error;
  }
}

// Utilitaires spécifiques aux scénarios stratégiques
export const StrategicScenarioUtils = {
  /**
   * 🆕 AMÉLIORATION: Génère des scénarios stratégiques enrichis avec MITRE ATT&CK et ISO 27005
   */
  generateSuggestedScenarios(
    riskSources: any[],
    dreadedEvents: any[],
    businessValues: any[]
  ): Partial<StrategicScenario>[] {
    const suggestions: Partial<StrategicScenario>[] = [];
    
    // Générer des combinaisons pertinentes selon EBIOS RM
    riskSources.forEach(rs => {
      businessValues.forEach(bv => {
        const relevantEvents = dreadedEvents.filter(de => de.businessValueId === bv.id);
        
        relevantEvents.forEach(de => {
          // 🆕 AMÉLIORATION: Vraisemblance enrichie selon ISO 27005
          let likelihood: LikelihoodScale = this.calculateEnhancedLikelihood(rs, bv, de) as LikelihoodScale;

          // 🆕 AMÉLIORATION: Description enrichie avec MITRE ATT&CK et ISO 27005
          const mitreContext = this.getMitreContext(rs, de);
          const isoContext = this.getISO27005Context(bv, de);

          const enhancedDescription = `${rs.name} cherche à provoquer ${de.name} sur ${bv.name}. ` +
            `${mitreContext} ${isoContext}`;

          suggestions.push({
            name: `${rs.name} → ${de.name}`,
            description: enhancedDescription,
            riskSourceId: rs.id,
            targetBusinessValueId: bv.id,
            dreadedEventId: de.id,
            likelihood,
            gravity: de.gravity,
            pathways: []
          });
        });
      });
    });
    
    // Limiter aux scénarios les plus pertinents (niveau de risque ≥ 2)
    return suggestions
      .map(s => ({ ...s, riskLevel: EbiosUtils.calculateRiskLevel(s.gravity!, s.likelihood!) }))
      .filter(s => EbiosUtils.compareRiskLevel(s.riskLevel!, 2, '>='))
      .sort((a, b) => EbiosUtils.normalizeRiskLevel(b.riskLevel || 0) - EbiosUtils.normalizeRiskLevel(a.riskLevel || 0))
      .slice(0, 20); // Limiter à 20 suggestions max
  },

  /**
   * Valide la cohérence d'un scénario stratégique
   */
  validateScenarioConsistency(
    scenario: StrategicScenario,
    riskSource: any,
    dreadedEvent: any,
    businessValue: any
  ): { valid: boolean; warnings: string[] } {
    const warnings: string[] = [];
    
    // Vérifier cohérence entre source de risque et événement redouté
    if (riskSource.category === 'natural' && 
        ['confidentiality', 'authenticity'].includes(dreadedEvent.impactType)) {
      warnings.push('Une catastrophe naturelle ne peut généralement pas causer de problème de confidentialité');
    }
    
    // Vérifier cohérence vraisemblance vs pertinence source de risque
    if (scenario.likelihood > riskSource.pertinence + 1) {
      warnings.push('Vraisemblance élevée par rapport à la pertinence de la source de risque');
    }
    
    // Vérifier cohérence gravité vs criticité valeur métier
    if (businessValue.criticalityLevel === 'useful' && scenario.gravity > 2) {
      warnings.push('Gravité élevée pour une valeur métier de criticité faible');
    }

    return {
      valid: warnings.length === 0,
      warnings
    };
  },

  /**
   * Calcule les métriques de risque pour une mission
   */
  calculateRiskMetrics(scenarios: StrategicScenario[]): {
    totalScenarios: number;
    averageRiskLevel: number;
    distributionByRiskLevel: Record<number, number>;
    criticalScenarios: StrategicScenario[];
    riskMatrix: { gravity: number; likelihood: number; count: number }[];
  } {
    const totalScenarios = scenarios.length;
    const averageRiskLevel = scenarios.reduce((sum, scenario) => sum + EbiosUtils.normalizeRiskLevel(scenario.riskLevel), 0) / totalScenarios;
    
    const distributionByRiskLevel = scenarios.reduce((acc, scenario) => {
      const normalizedRisk = EbiosUtils.normalizeRiskLevel(scenario.riskLevel);
      acc[normalizedRisk] = (acc[normalizedRisk] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const criticalScenarios = scenarios.filter(scenario => EbiosUtils.compareRiskLevel(scenario.riskLevel, 3, '>='));
    
    // Matrice de répartition gravité/vraisemblance
    const riskMatrix = scenarios.reduce((acc, scenario) => {
      const existing = acc.find(item => 
        item.gravity === scenario.gravity && item.likelihood === scenario.likelihood
      );
      
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({
          gravity: scenario.gravity,
          likelihood: scenario.likelihood,
          count: 1
        });
      }
      
      return acc;
    }, [] as { gravity: number; likelihood: number; count: number }[]);

    return {
      totalScenarios,
      averageRiskLevel: Math.round(averageRiskLevel * 100) / 100,
      distributionByRiskLevel,
      criticalScenarios,
      riskMatrix
    };
  },

  /**
   * Priorise les scénarios selon les critères EBIOS RM
   */
  prioritizeScenarios(scenarios: StrategicScenario[]): StrategicScenario[] {
    return scenarios.sort((a, b) => {
      // Priorité 1: Niveau de risque
      if (a.riskLevel !== b.riskLevel) {
        return EbiosUtils.normalizeRiskLevel(b.riskLevel) - EbiosUtils.normalizeRiskLevel(a.riskLevel);
      }
      
      // Priorité 2: Gravité
      if (a.gravity !== b.gravity) {
        return b.gravity - a.gravity;
      }
      
      // Priorité 3: Vraisemblance
      return b.likelihood - a.likelihood;
    });
  },

  /**
   * 🆕 AMÉLIORATION: Calcule la vraisemblance enrichie selon ISO 27005
   */
  calculateEnhancedLikelihood(riskSource: any, businessValue: any, dreadedEvent: any): number {
    let likelihood = riskSource.pertinence || 2;

    // Facteurs ISO 27005 - Capacité de la source de risque
    if (riskSource.expertise === 'expert' && riskSource.resources === 'unlimited') {
      likelihood = Math.min(4, likelihood + 1);
    } else if (riskSource.expertise === 'limited' && riskSource.resources === 'limited') {
      likelihood = Math.max(1, likelihood - 1);
    }

    // Facteurs ISO 27005 - Attractivité de la cible
    if (businessValue.category === 'primary' && businessValue.priority >= 3) {
      likelihood = Math.min(4, likelihood + 0.5);
    }

    // Facteurs ISO 27005 - Vulnérabilité
    if (dreadedEvent.impactType === 'availability' && riskSource.category === 'natural') {
      likelihood = Math.min(4, likelihood + 1);
    }

    return Math.round(likelihood);
  },

  /**
   * 🆕 AMÉLIORATION: Obtient le contexte MITRE ATT&CK
   */
  getMitreContext(riskSource: any, dreadedEvent: any): string {
    const techniques = this.getSuggestedMitreTechniques(riskSource, dreadedEvent);
    if (techniques.length > 0) {
      return `Techniques probables: ${techniques.slice(0, 2).join(', ')}.`;
    }
    return '';
  },

  /**
   * 🆕 AMÉLIORATION: Obtient le contexte ISO 27005
   */
  getISO27005Context(businessValue: any, dreadedEvent: any): string {
    const riskCategory = this.categorizeISO27005Risk(businessValue, dreadedEvent);
    return `Catégorie ISO 27005: ${riskCategory}.`;
  },

  /**
   * 🆕 AMÉLIORATION: Suggère des techniques MITRE ATT&CK
   */
  getSuggestedMitreTechniques(riskSource: any, dreadedEvent: any): string[] {
    const techniques: string[] = [];

    // Techniques selon le type de source de risque
    switch (riskSource.category) {
      case 'cybercriminal':
        if (dreadedEvent.impactType === 'confidentiality') {
          techniques.push('T1041 - Exfiltration Over C2', 'T1020 - Automated Exfiltration');
        }
        if (dreadedEvent.impactType === 'availability') {
          techniques.push('T1486 - Data Encrypted for Impact', 'T1490 - Inhibit System Recovery');
        }
        break;

      case 'state':
        techniques.push('T1071 - Application Layer Protocol', 'T1055 - Process Injection');
        if (dreadedEvent.impactType === 'confidentiality') {
          techniques.push('T1083 - File and Directory Discovery', 'T1005 - Data from Local System');
        }
        break;

      case 'insider':
        techniques.push('T1078 - Valid Accounts', 'T1083 - File and Directory Discovery');
        break;

      case 'activist':
        techniques.push('T1498 - Network DoS', 'T1499 - Endpoint DoS');
        break;

      default:
        techniques.push('T1566 - Phishing', 'T1190 - Exploit Public-Facing Application');
    }

    return techniques;
  },

  /**
   * 🆕 AMÉLIORATION: Calcule le risque selon ISO 27005
   */
  calculateISO27005Risk(likelihood: number, gravity: number): string {
    const riskValue = likelihood * gravity;

    if (riskValue >= 12) return 'Très élevé';
    if (riskValue >= 8) return 'Élevé';
    if (riskValue >= 4) return 'Modéré';
    return 'Faible';
  },

  /**
   * 🆕 AMÉLIORATION: Catégorise le risque selon ISO 27005
   */
  categorizeISO27005Risk(businessValue: any, dreadedEvent: any): string {
    if (dreadedEvent.impactType === 'confidentiality') {
      return businessValue.category === 'primary' ? 'Risque de divulgation critique' : 'Risque de divulgation';
    }
    if (dreadedEvent.impactType === 'integrity') {
      return 'Risque d\'altération';
    }
    if (dreadedEvent.impactType === 'availability') {
      return businessValue.priority >= 3 ? 'Risque d\'interruption critique' : 'Risque d\'interruption';
    }
    return 'Risque générique';
  },

  /**
   * 🆕 AMÉLIORATION: Calcule le niveau de menace
   */
  calculateThreatLevel(riskSource: any): string {
    const expertiseScore = {
      'limited': 1,
      'moderate': 2,
      'high': 3,
      'expert': 4
    }[riskSource.expertise as string] || 2;

    const resourceScore = {
      'limited': 1,
      'moderate': 2,
      'high': 3,
      'unlimited': 4
    }[riskSource.resources as string] || 2;

    const motivationScore = riskSource.motivation || 2;

    const totalScore = (expertiseScore + resourceScore + motivationScore) / 3;

    if (totalScore >= 3.5) return 'Très élevé';
    if (totalScore >= 2.5) return 'Élevé';
    if (totalScore >= 1.5) return 'Modéré';
    return 'Faible';
  }
};