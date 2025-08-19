/**
 * 🚨 CRYPTO STUB POUR MODE PRODUCTION DOCKER
 * Remplace le module Node.js 'crypto' pour la compatibilité navigateur
 */

console.warn('🚨 Module crypto remplacé par stub - Utiliser EncryptionService.browser.ts');

// Exports vides pour éviter les erreurs
export default {};
export const randomBytes = () => {
  throw new Error('crypto.randomBytes not available in browser - use EncryptionService.browser.ts');
};
export const createHash = () => {
  throw new Error('crypto.createHash not available in browser - use EncryptionService.browser.ts');
};
export const createCipher = () => {
  throw new Error('crypto.createCipher not available in browser - use EncryptionService.browser.ts');
};

export const createDecipher = () => {
  throw new Error('crypto.createDecipher not available in browser - use EncryptionService.browser.ts');
};

export const pbkdf2Sync = () => {
  throw new Error('crypto.pbkdf2Sync not available in browser - use EncryptionService.browser.ts');
};

// 🔧 FIX: Ajouter randomUUID manquant
export const randomUUID = () => {
  // Utiliser l'API Web Crypto native du navigateur
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback: générer un UUID v4 manuel
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Pour les imports par défaut et namespace
const cryptoStub = {
  randomBytes,
  createHash,
  createCipher,
  createDecipher,
  pbkdf2Sync,
  randomUUID
};

export { cryptoStub as crypto };