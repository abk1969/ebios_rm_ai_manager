/**
 * 🧪 SCRIPT DE CRÉATION D'UTILISATEUR DE TEST
 * Crée un utilisateur de test pour l'authentification Firebase
 */

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../src/lib/firebase';

const TEST_USER = {
  email: 'test@ebios.local',
  password: 'TestPassword123!',
  displayName: 'Utilisateur Test EBIOS',
  role: 'admin',
  permissions: ['*'],
  organization: 'CHU Métropolitain Test'
};

async function createTestUser() {
  try {
    console.log('🧪 Création de l\'utilisateur de test...');
    
    // Créer l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      TEST_USER.email, 
      TEST_USER.password
    );
    
    const user = userCredential.user;
    console.log('✅ Utilisateur créé dans Firebase Auth:', user.uid);
    
    // Créer le profil utilisateur dans Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: TEST_USER.email,
      displayName: TEST_USER.displayName,
      role: TEST_USER.role,
      permissions: TEST_USER.permissions,
      organization: TEST_USER.organization,
      createdAt: new Date(),
      lastLogin: new Date(),
      isTestUser: true,
      mfaVerified: true
    });
    
    console.log('✅ Profil utilisateur créé dans Firestore');
    
    // Test de connexion
    await signInWithEmailAndPassword(auth, TEST_USER.email, TEST_USER.password);
    console.log('✅ Test de connexion réussi');
    
    console.log('\n🎉 UTILISATEUR DE TEST CRÉÉ AVEC SUCCÈS !');
    console.log('📧 Email:', TEST_USER.email);
    console.log('🔑 Mot de passe:', TEST_USER.password);
    console.log('\n🚀 Vous pouvez maintenant vous connecter à l\'application');
    
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ️ L\'utilisateur de test existe déjà');
      
      // Test de connexion avec l'utilisateur existant
      try {
        await signInWithEmailAndPassword(auth, TEST_USER.email, TEST_USER.password);
        console.log('✅ Connexion avec l\'utilisateur existant réussie');
        console.log('\n🎉 UTILISATEUR DE TEST PRÊT !');
        console.log('📧 Email:', TEST_USER.email);
        console.log('🔑 Mot de passe:', TEST_USER.password);
      } catch (signInError) {
        console.error('❌ Erreur de connexion avec l\'utilisateur existant:', signInError);
      }
    } else {
      console.error('❌ Erreur lors de la création de l\'utilisateur de test:', error);
    }
  }
}

// Exécuter le script
createTestUser()
  .then(() => {
    console.log('\n✅ Script terminé');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
