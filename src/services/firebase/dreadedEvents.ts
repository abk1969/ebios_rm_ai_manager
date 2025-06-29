import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query,
  where,
  getDoc,
  serverTimestamp,
  orderBy,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DreadedEvent } from '@/types/ebios';
import { EbiosUtils } from '@/lib/ebios-constants';
import { AIEnrichmentService } from '@/services/ai/AIEnrichmentService';

const COLLECTION_NAME = 'dreadedEvents';

export const dreadedEventsCollection = collection(db, COLLECTION_NAME);

export async function getDreadedEvents(missionId: string): Promise<DreadedEvent[]> {
  try {
    // Requête simplifiée sans orderBy pour éviter l'index composite
    const q = query(
      dreadedEventsCollection, 
      where('missionId', '==', missionId)
    );
    const snapshot = await getDocs(q);
    
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as DreadedEvent));

    // Tri côté client par date de création décroissante
    return events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error getting dreaded events:', error);
    throw error;
  }
}

export async function getDreadedEventsByBusinessValue(businessValueId: string): Promise<DreadedEvent[]> {
  try {
    // Requête simplifiée sans orderBy pour éviter l'index composite
    const q = query(
      dreadedEventsCollection, 
      where('businessValueId', '==', businessValueId)
    );
    const snapshot = await getDocs(q);
    
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as DreadedEvent));

    // Tri côté client par gravité décroissante
    return events.sort((a, b) => b.gravity - a.gravity);
  } catch (error) {
    console.error('Error getting dreaded events by business value:', error);
    throw error;
  }
}

export async function getDreadedEventById(id: string): Promise<DreadedEvent | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: docSnap.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as DreadedEvent) : null;
  } catch (error) {
    console.error('Error getting dreaded event by id:', error);
    throw error;
  }
}

export async function createDreadedEvent(data: Omit<DreadedEvent, 'id'>): Promise<DreadedEvent> {
  try {
    // 🆕 Enrichissement IA automatique
    const enrichedData = AIEnrichmentService.enrichDreadedEvent(data);
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...enrichedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return {
      id: docRef.id,
      ...enrichedData,
    } as DreadedEvent;
  } catch (error) {
    console.error('Error creating dreaded event:', error);
    throw error;
  }
}

export async function updateDreadedEvent(
  id: string,
  data: Partial<DreadedEvent>
): Promise<void> {
  try {
    // 🆕 Enrichissement IA lors de la mise à jour
    const enrichedData = AIEnrichmentService.enrichDreadedEvent(data);
    
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...enrichedData,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating dreaded event:', error);
    throw error;
  }
}

export async function deleteDreadedEvent(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting dreaded event:', error);
    throw error;
  }
}

// Utilitaires spécifiques aux événements redoutés
export const DreadedEventUtils = {
  /**
   * Génère des événements redoutés suggérés basés sur la valeur métier
   */
  generateSuggestedEvents(businessValueName: string, category: string): Partial<DreadedEvent>[] {
    const suggestions: Partial<DreadedEvent>[] = [];
    
    if (category === 'primary') {
      suggestions.push(
        {
          name: `Indisponibilité de ${businessValueName}`,
          description: `Perte d'accès temporaire ou permanent à ${businessValueName}`,
          impactType: 'availability',
          gravity: 3
        },
        {
          name: `Corruption de ${businessValueName}`,
          description: `Altération ou destruction des données de ${businessValueName}`,
          impactType: 'integrity',
          gravity: 4
        },
        {
          name: `Divulgation de ${businessValueName}`,
          description: `Accès non autorisé aux informations de ${businessValueName}`,
          impactType: 'confidentiality',
          gravity: 3
        }
      );
    }
    
    return suggestions;
  },

  /**
   * Évalue la cohérence d'un événement redouté avec sa valeur métier
   */
  validateEventConsistency(event: DreadedEvent, businessValue: any): { valid: boolean; warnings: string[] } {
    const warnings: string[] = [];
    
    // Vérifier cohérence gravité/criticité de la valeur métier
    if (businessValue.criticalityLevel === 'essential' && event.gravity < 3) {
      warnings.push('Gravité faible pour une valeur métier essentielle');
    }
    
    if (businessValue.criticalityLevel === 'useful' && event.gravity > 2) {
      warnings.push('Gravité élevée pour une valeur métier utile');
    }

    return {
      valid: warnings.length === 0,
      warnings
    };
  },

  /**
   * Calcule les métriques d'impact pour un événement redouté
   */
  calculateImpactMetrics(events: DreadedEvent[]): {
    totalEvents: number;
    averageGravity: number;
    distributionByType: Record<string, number>;
    criticalEvents: DreadedEvent[];
  } {
    const totalEvents = events.length;
    const averageGravity = events.reduce((sum, event) => sum + event.gravity, 0) / totalEvents;
    
    const distributionByType = events.reduce((acc, event) => {
      acc[event.impactType] = (acc[event.impactType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const criticalEvents = events.filter(event => event.gravity >= 3);

    return {
      totalEvents,
      averageGravity: Math.round(averageGravity * 100) / 100,
      distributionByType,
      criticalEvents
    };
  }
}; 