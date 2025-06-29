import { 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification,
  updatePassword,
  deleteUser,
  type UserCredential,
  type User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export type AuthErrorCode = 
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/email-already-in-use'
  | 'auth/weak-password'
  | 'auth/operation-not-allowed'
  | 'auth/requires-recent-login'
  | 'auth/invalid-verification-code'
  | 'auth/invalid-verification-id'
  | 'auth/configuration-not-found'
  | 'auth/network-request-failed'
  | 'auth/invalid-credentials';

export class AuthError extends Error {
  constructor(message: string, public code?: AuthErrorCode) {
    super(message);
    this.name = 'AuthError';
  }
}

const handleAuthError = (error: unknown): never => {
  const firebaseError = error as { code?: string; message: string };
  console.error('Firebase Auth error:', firebaseError);
  throw new AuthError(
    firebaseError.message,
    firebaseError.code as AuthErrorCode
  );
};

export const signIn = async (email: string, password: string): Promise<UserCredential> => {
  try {
    console.log('🔑 Tentative de connexion Firebase pour:', email);
    const credential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Connexion Firebase réussie pour:', credential.user.email);
    return credential;
  } catch (error: any) {
    console.error('❌ Erreur de connexion Firebase:', error);
    return handleAuthError(error);
  }
};

export const signUp = async (
  email: string, 
  password: string, 
  displayName?: string
): Promise<User> => {
  try {
    console.log('📝 Création de compte Firebase pour:', email);
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName) {
      try {
        await updateProfile(user, { displayName });
        console.log('✅ Nom d\'affichage défini:', displayName);
      } catch (profileError) {
        console.warn('Échec de la définition du nom d\'affichage:', profileError);
      }
    }
    
    console.log('✅ Compte Firebase créé avec succès pour:', user.email);
    return user;
  } catch (error: any) {
    console.error('❌ Erreur de création de compte Firebase:', error);
    return handleAuthError(error);
  }
};

export const signOut = async (): Promise<void> => {
  try {
    console.log('🚪 Déconnexion Firebase');
    await firebaseSignOut(auth);
    console.log('✅ Déconnexion Firebase réussie');
  } catch (error: any) {
    console.error('❌ Erreur de déconnexion Firebase:', error);
    handleAuthError(error);
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    console.log('🔄 Envoi email de réinitialisation Firebase pour:', email);
    await sendPasswordResetEmail(auth, email);
    console.log('✅ Email de réinitialisation envoyé');
  } catch (error: any) {
    console.error('❌ Erreur envoi email de réinitialisation:', error);
    handleAuthError(error);
  }
};

export const sendEmailVerification = async (user: User): Promise<void> => {
  try {
    console.log('📧 Envoi email de vérification Firebase pour:', user.email);
    await firebaseSendEmailVerification(user);
    console.log('✅ Email de vérification envoyé');
  } catch (error: any) {
    console.error('❌ Erreur envoi email de vérification:', error);
    handleAuthError(error);
  }
};

export const updateUserPassword = async (
  user: User, 
  newPassword: string
): Promise<void> => {
  try {
    console.log('🔑 Mise à jour mot de passe Firebase pour:', user.email);
    await updatePassword(user, newPassword);
    console.log('✅ Mot de passe Firebase mis à jour');
  } catch (error: any) {
    console.error('❌ Erreur mise à jour mot de passe Firebase:', error);
    handleAuthError(error);
  }
};

export const updateUserProfile = async (
  user: User,
  profile: {
    displayName?: string | null;
    photoURL?: string | null;
  }
): Promise<void> => {
  try {
    console.log('👤 Mise à jour profil Firebase pour:', user.email);
    await updateProfile(user, profile);
    console.log('✅ Profil Firebase mis à jour');
  } catch (error: any) {
    console.error('❌ Erreur mise à jour profil Firebase:', error);
    handleAuthError(error);
  }
};

export const deleteUserAccount = async (user: User): Promise<void> => {
  try {
    console.log('🗑️ Suppression compte Firebase pour:', user.email);
    await deleteUser(user);
    console.log('✅ Compte Firebase supprimé');
  } catch (error: any) {
    console.error('❌ Erreur suppression compte Firebase:', error);
    handleAuthError(error);
  }
};