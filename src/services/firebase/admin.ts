import { adminDb, adminAuth } from '@/lib/firebase-admin';

export const verifyIdToken = async (idToken: string) => {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const userRecord = await adminAuth.getUserByEmail(email);
    return userRecord;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

export const createUser = async (email: string, password: string) => {
  try {
    const userRecord = await adminAuth.createUser({
      email,
      password,
      emailVerified: false,
    });
    return userRecord;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const deleteUser = async (uid: string) => {
  try {
    await adminAuth.deleteUser(uid);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};