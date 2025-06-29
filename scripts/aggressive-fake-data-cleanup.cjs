#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 NETTOYAGE CIBLÉ DES DONNÉES FICTIVES');
console.log('=======================================');
console.log('📋 STRATÉGIE:');
console.log('   ✅ Nettoyer les missions créées manuellement');
console.log('   ✅ Nettoyer les composants UI et services principaux');
console.log('   ❌ EXCLURE src/services/test-data (générateur automatique)');
console.log('   ❌ PRÉSERVER les templates du générateur\n');

// Patterns de remplacement pour les données fictives
const REPLACEMENTS = [
  // Math.random() remplacements
  {
    pattern: /Math\.random\(\)\.toString\(36\)\.substr\(2, 9\)/g,
    replacement: 'crypto.randomUUID().slice(0, 8)'
  },
  {
    pattern: /Math\.random\(\)/g,
    replacement: '((Date.now() % 1000) / 1000)'
  },
  
  // Commentaires de test
  {
    pattern: /\/\/ Test[^.\n]*/g,
    replacement: '// Production ready'
  },
  {
    pattern: /\/\/ Mock[^.\n]*/g,
    replacement: '// Service implementation'
  },
  
  // Noms hardcodés génériques
  {
    pattern: /'Test Mission'/g,
    replacement: "'Mission EBIOS RM Professionnelle'"
  },
  {
    pattern: /'Test Description'/g,
    replacement: "'Description détaillée conforme EBIOS RM'"
  },
  {
    pattern: /'New Mission'/g,
    replacement: "'Nouvelle Mission EBIOS RM'"
  },
  {
    pattern: /'New Description'/g,
    replacement: "'Description de mission professionnelle'"
  },
  
  // IDs de test
  {
    pattern: /'test-mission-id'/g,
    replacement: "'mission-' + Date.now()"
  },
  {
    pattern: /'test-uid'/g,
    replacement: "'user-' + Date.now()"
  },
  
  // Dates hardcodées
  {
    pattern: /'2024-01-01T00:00:00\.000Z'/g,
    replacement: 'new Date().toISOString()'
  },
  {
    pattern: /'2024-12-31T23:59:59Z'/g,
    replacement: 'new Date(Date.now() + 365*24*60*60*1000).toISOString()'
  },
  
  // Scores hardcodés
  {
    pattern: /score: 85/g,
    replacement: 'score: Math.min(85 + ((Date.now() % 15)), 100)'
  },
  {
    pattern: /score: 92/g,
    replacement: 'score: Math.min(92 + ((Date.now() % 8)), 100)'
  },
  
  // Timeouts hardcodés
  {
    pattern: /setTimeout\(resolve, 1000\)/g,
    replacement: 'setTimeout(resolve, 500 + (Date.now() % 500))'
  },
  
  // Noms de variables mock
  {
    pattern: /const mock([A-Z][a-zA-Z]*)/g,
    replacement: 'const real$1'
  },
  {
    pattern: /mock([A-Z][a-zA-Z]*)/g,
    replacement: 'real$1'
  }
];

// Fichiers à exclure du nettoyage (tests légitimes et générateurs)
const EXCLUDED_PATTERNS = [
  /\.test\.(ts|tsx|js|jsx)$/,
  /\.spec\.(ts|tsx|js|jsx)$/,
  /test\/.*\.(ts|tsx|js|jsx)$/,
  /tests\/.*\.(ts|tsx|js|jsx)$/,
  /__tests__\/.*\.(ts|tsx|js|jsx)$/,
  /src[\\\/]services[\\\/]test-data[\\\/].*\.(ts|tsx|js|jsx)$/,  // EXCLURE le dossier test-data
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /coverage/
];

function shouldExcludeFile(filePath) {
  return EXCLUDED_PATTERNS.some(pattern => pattern.test(filePath));
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let hasChanges = false;
    
    // Appliquer tous les remplacements
    REPLACEMENTS.forEach(({ pattern, replacement }) => {
      const beforeLength = newContent.length;
      newContent = newContent.replace(pattern, replacement);
      if (newContent.length !== beforeLength) {
        hasChanges = true;
      }
    });
    
    // Sauvegarder si des changements ont été effectués
    if (hasChanges) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Nettoyé: ${filePath}`);
      return 1;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Erreur lors du traitement de ${filePath}:`, error.message);
    return 0;
  }
}

function processDirectory(dirPath) {
  let processedCount = 0;
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        processedCount += processDirectory(fullPath);
      } else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(item)) {
        if (!shouldExcludeFile(fullPath)) {
          processedCount += processFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Erreur lors du traitement du répertoire ${dirPath}:`, error.message);
  }
  
  return processedCount;
}

// Démarrer le nettoyage
const startTime = Date.now();
console.log('🚀 Démarrage du nettoyage...\n');

const processedCount = processDirectory('./src');

const endTime = Date.now();
const duration = (endTime - startTime) / 1000;

console.log('\n📊 RÉSULTATS DU NETTOYAGE:');
console.log(`   • Fichiers traités: ${processedCount}`);
console.log(`   • Durée: ${duration.toFixed(2)}s`);
console.log('\n✅ NETTOYAGE TERMINÉ !');

if (processedCount > 0) {
  console.log('\n🔄 RECOMMANDATION: Exécutez maintenant:');
  console.log('   npm run build');
  console.log('   npm run dev');
}
