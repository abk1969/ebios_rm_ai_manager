/**
 * 🎯 SERVICE FIREBASE POUR LES BIENS ESSENTIELS (EBIOS RM)
 * Logique métier conforme ANSSI - Primary Assets
 */

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { EssentialAsset } from '../../types/ebios';

const COLLECTION_NAME = 'essentialAssets';

/**
 * Récupère tous les biens essentiels d'une mission
 */
export const getEssentialAssetsByMission = async (missionId: string): Promise<EssentialAsset[]> => {
  try {
    // Tentative avec index composite (missionId + createdAt + __name__)
    const q = query(
      collection(db, COLLECTION_NAME),
      where('missionId', '==', missionId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as EssentialAsset));
  } catch (error) {
    console.warn('⚠️ Index composite manquant, utilisation de la requête simple:', error);

    // Fallback : requête simple sans orderBy (ne nécessite pas d'index)
    try {
      const fallbackQuery = query(
        collection(db, COLLECTION_NAME),
        where('missionId', '==', missionId)
      );

      const fallbackSnapshot = await getDocs(fallbackQuery);
      const results = fallbackSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EssentialAsset));

      // Tri côté client par createdAt (desc)
      results.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });

      console.info(`✅ Biens essentiels récupérés via fallback: ${results.length} éléments`);
      return results;
    } catch (fallbackError) {
      console.error('❌ Erreur lors de la récupération des biens essentiels (fallback):', fallbackError);
      throw fallbackError;
    }
  }
};

/**
 * Récupère un bien essentiel par son ID
 */
export const getEssentialAssetById = async (id: string): Promise<EssentialAsset | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as EssentialAsset;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du bien essentiel:', error);
    throw error;
  }
};

/**
 * Crée un nouveau bien essentiel
 */
export const createEssentialAsset = async (assetData: Omit<EssentialAsset, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = new Date().toISOString();
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...assetData,
      createdAt: now,
      updatedAt: now
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création du bien essentiel:', error);
    throw error;
  }
};

/**
 * Met à jour un bien essentiel
 */
export const updateEssentialAsset = async (id: string, updates: Partial<EssentialAsset>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du bien essentiel:', error);
    throw error;
  }
};

/**
 * Supprime un bien essentiel
 */
export const deleteEssentialAsset = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Erreur lors de la suppression du bien essentiel:', error);
    throw error;
  }
};

/**
 * Récupère les biens essentiels par type
 */
export const getEssentialAssetsByType = async (
  missionId: string, 
  type: EssentialAsset['type']
): Promise<EssentialAsset[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('missionId', '==', missionId),
      where('type', '==', type),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as EssentialAsset));
  } catch (error) {
    console.error('Erreur lors de la récupération des biens essentiels par type:', error);
    throw error;
  }
};

/**
 * Récupère les biens essentiels supportant une valeur métier
 */
export const getEssentialAssetsByBusinessValue = async (
  missionId: string, 
  businessValueId: string
): Promise<EssentialAsset[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('missionId', '==', missionId),
      where('businessValueIds', 'array-contains', businessValueId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as EssentialAsset));
  } catch (error) {
    console.error('Erreur lors de la récupération des biens essentiels par valeur métier:', error);
    throw error;
  }
};

/**
 * Valide les données d'un bien essentiel selon EBIOS RM
 */
export const validateEssentialAssetData = (asset: Partial<EssentialAsset>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!asset.name || asset.name.trim().length < 2) {
    errors.push('Le nom du bien essentiel doit contenir au moins 2 caractères');
  }

  if (!asset.type) {
    errors.push('Le type de bien essentiel est obligatoire (process, information, know_how)');
  }

  if (!asset.category) {
    errors.push('La catégorie de bien essentiel est obligatoire');
  }

  if (!asset.criticalityLevel) {
    errors.push('Le niveau de criticité est obligatoire (essential, important, useful)');
  }

  if (!asset.businessValueIds || asset.businessValueIds.length === 0) {
    errors.push('Au moins une valeur métier doit être associée au bien essentiel');
  }

  // Validation des exigences de sécurité
  const securityRequirements = [
    'confidentialityRequirement',
    'integrityRequirement', 
    'availabilityRequirement'
  ] as const;

  securityRequirements.forEach(req => {
    const value = asset[req];
    if (value && (value < 1 || value > 4)) {
      errors.push(`${req} doit être entre 1 et 4`);
    }
  });

  if (!asset.owner || asset.owner.trim().length < 2) {
    errors.push('Le propriétaire métier est obligatoire');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Génère des biens essentiels par défaut selon le type d'organisation
 */
export const generateDefaultEssentialAssets = (
  missionId: string, 
  organizationType: string,
  businessValueIds: string[]
): Omit<EssentialAsset, 'id' | 'createdAt' | 'updatedAt'>[] => {
  const baseAssets: Omit<EssentialAsset, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'Processus de gestion des clients',
      description: 'Processus métier de gestion de la relation client',
      type: 'process',
      category: 'business_critical',
      criticalityLevel: 'essential',
      businessValueIds: businessValueIds.slice(0, 1),
      supportingAssets: [],
      dreadedEvents: [],
      stakeholders: [],
      confidentialityRequirement: 2,
      integrityRequirement: 4,
      availabilityRequirement: 3,
      owner: 'Direction Commerciale',
      users: ['Équipe commerciale', 'Service client'],
      missionId
    },
    {
      name: 'Base de données clients',
      description: 'Informations personnelles et commerciales des clients',
      type: 'information',
      category: 'mission_critical',
      criticalityLevel: 'essential',
      businessValueIds: businessValueIds.slice(0, 2),
      supportingAssets: [],
      dreadedEvents: [],
      stakeholders: [],
      confidentialityRequirement: 4,
      integrityRequirement: 4,
      availabilityRequirement: 3,
      owner: 'DPO',
      custodian: 'DSI',
      users: ['Équipe commerciale', 'Service client', 'Comptabilité'],
      missionId
    },
    {
      name: 'Savoir-faire technique propriétaire',
      description: 'Algorithmes et méthodes développés en interne',
      type: 'know_how',
      category: 'business_critical',
      criticalityLevel: 'important',
      businessValueIds: businessValueIds.slice(1, 3),
      supportingAssets: [],
      dreadedEvents: [],
      stakeholders: [],
      confidentialityRequirement: 4,
      integrityRequirement: 4,
      availabilityRequirement: 2,
      owner: 'Direction R&D',
      users: ['Équipe R&D', 'Équipe technique'],
      missionId
    }
  ];

  // Ajout d'actifs spécifiques selon le type d'organisation
  if (organizationType === 'healthcare') {
    baseAssets.push({
      name: 'Dossiers médicaux patients',
      description: 'Informations médicales sensibles des patients',
      type: 'information',
      category: 'mission_critical',
      criticalityLevel: 'essential',
      businessValueIds: businessValueIds,
      supportingAssets: [],
      dreadedEvents: [],
      stakeholders: [],
      confidentialityRequirement: 4,
      integrityRequirement: 4,
      availabilityRequirement: 4,
      owner: 'Direction Médicale',
      custodian: 'DSI',
      users: ['Personnel médical', 'Personnel soignant'],
      missionId
    });
  }

  return baseAssets;
};

/**
 * Calcule les métriques de risque des biens essentiels
 */
export const calculateEssentialAssetRiskMetrics = (assets: EssentialAsset[]) => {
  const totalAssets = assets.length;
  const criticalAssets = assets.filter(a => a.criticalityLevel === 'essential').length;
  const highConfidentialityAssets = assets.filter(a => a.confidentialityRequirement >= 3).length;
  const highIntegrityAssets = assets.filter(a => a.integrityRequirement >= 3).length;
  const highAvailabilityAssets = assets.filter(a => a.availabilityRequirement >= 3).length;

  return {
    totalAssets,
    criticalAssets,
    highConfidentialityAssets,
    highIntegrityAssets,
    highAvailabilityAssets,
    criticalityRatio: totalAssets > 0 ? Math.round((criticalAssets / totalAssets) * 100) : 0,
    securityRequirementsScore: totalAssets > 0 ? Math.round(
      ((highConfidentialityAssets + highIntegrityAssets + highAvailabilityAssets) / (totalAssets * 3)) * 100
    ) : 0
  };
};
