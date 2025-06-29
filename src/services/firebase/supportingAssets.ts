import { collection, addDoc, getDocs, query, where, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SupportingAsset } from '@/types/ebios';

const COLLECTION_NAME = 'supportingAssets';

export const getSupportingAssets = async (businessValueId: string): Promise<SupportingAsset[]> => {
  try {
    const assetsRef = collection(db, COLLECTION_NAME);
    const q = query(assetsRef, where('businessValueId', '==', businessValueId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as SupportingAsset));
  } catch (error) {
    console.error('Error getting supporting assets:', error);
    throw error;
  }
};

export const getSupportingAssetsByMission = async (missionId: string): Promise<SupportingAsset[]> => {
  try {
    console.log('🔍 Récupération des actifs supports pour mission:', missionId);
    const assetsRef = collection(db, COLLECTION_NAME);
    const q = query(assetsRef, where('missionId', '==', missionId));
    const snapshot = await getDocs(q);
    
    const assets = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    } as SupportingAsset));
    
    console.log('✅ Actifs supports récupérés:', assets.length, assets);
    return assets;
  } catch (error) {
    console.error('❌ Error getting supporting assets by mission:', error);
    throw error;
  }
};

export const createSupportingAsset = async (asset: Omit<SupportingAsset, 'id'>): Promise<SupportingAsset> => {
  try {
    console.log('🏗️ Création actif support:', asset);
    
    const assetData = {
      ...asset,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), assetData);
    
    const createdAsset = { 
      id: docRef.id, 
      ...asset,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as SupportingAsset;
    
    console.log('✅ Actif support créé avec succès:', createdAsset);
    return createdAsset;
  } catch (error) {
    console.error('❌ Error creating supporting asset:', error);
    throw error;
  }
};

export const updateSupportingAsset = async (id: string, data: Partial<SupportingAsset>): Promise<void> => {
  try {
    console.log('🔄 Mise à jour actif support:', id, data);
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Actif support mis à jour avec succès');
  } catch (error) {
    console.error('❌ Error updating supporting asset:', error);
    throw error;
  }
};

export const deleteSupportingAsset = async (id: string): Promise<void> => {
  try {
    console.log('🗑️ Suppression actif support:', id);
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    console.log('✅ Actif support supprimé avec succès');
  } catch (error) {
    console.error('❌ Error deleting supporting asset:', error);
    throw error;
  }
};