#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 SCAN CIBLÉ DES DONNÉES FICTIVES');
console.log('==================================');
console.log('📋 STRATÉGIE:');
console.log('   ✅ Scanner les missions créées manuellement');
console.log('   ✅ Scanner les composants UI et services principaux');
console.log('   ❌ EXCLURE src/services/test-data (générateur automatique)');
console.log('   ❌ IGNORER les templates du générateur\n');

// Patterns de détection des données fictives
const FAKE_DATA_PATTERNS = [
  { name: 'math_random', pattern: /Math\.random\(\)/g },
  { name: 'math_floor_date', pattern: /Math\.floor\(Date\.now\(\)\s*%\s*\d+\)/g },
  { name: 'hardcoded_test_names', pattern: /(name|title):\s*['"`](Test|Mock|Fake|Sample|Demo|Example)[^'"`]*['"`]/gi },
  { name: 'hardcoded_test_descriptions', pattern: /(description):\s*['"`](Test|Mock|Fake|Sample|Demo|Example)[^'"`]*['"`]/gi },
  { name: 'test_ids', pattern: /(id):\s*['"`](test-|mock-|fake-|sample-)[^'"`]*['"`]/gi },
  { name: 'hardcoded_dates', pattern: /'(2024-01-01|2024-12-31)[^']*'/g },
  { name: 'console_log_production', pattern: /console\.log\(/g },
  { name: 'lorem_ipsum', pattern: /lorem\s+ipsum/gi },
  { name: 'placeholder_text', pattern: /placeholder[^a-zA-Z]/gi }
];

// Fichiers à exclure du scan
const EXCLUDED_PATTERNS = [
  /\.test\.(ts|tsx|js|jsx)$/,
  /\.spec\.(ts|tsx|js|jsx)$/,
  /test\/.*\.(ts|tsx|js|jsx)$/,
  /tests\/.*\.(ts|tsx|js|jsx)$/,
  /__tests__\/.*\.(ts|tsx|js|jsx)$/,
  /src[\\\/]services[\\\/]test-data[\\\/].*\.(ts|tsx|js|jsx)$/,  // EXCLURE test-data
  /scripts[\\\/].*\.(ts|tsx|js|jsx|cjs)$/,  // EXCLURE les scripts
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /coverage/,
  /\.backup/,
  /\.md$/
];

function shouldExcludeFile(filePath) {
  return EXCLUDED_PATTERNS.some(pattern => pattern.test(filePath));
}

let totalIssues = 0;
let totalFiles = 0;
const issuesByFile = new Map();

function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const fileIssues = [];
    
    FAKE_DATA_PATTERNS.forEach(({ name, pattern }) => {
      lines.forEach((line, index) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            fileIssues.push({
              line: index + 1,
              type: name,
              content: line.trim().substring(0, 100) + (line.trim().length > 100 ? '...' : '')
            });
          });
        }
      });
    });
    
    if (fileIssues.length > 0) {
      issuesByFile.set(filePath, fileIssues);
      totalIssues += fileIssues.length;
    }
    
    totalFiles++;
  } catch (error) {
    console.error(`❌ Erreur lors du scan de ${filePath}:`, error.message);
  }
}

function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile() && /\.(ts|tsx|js|jsx)$/.test(item)) {
        if (!shouldExcludeFile(fullPath)) {
          scanFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`❌ Erreur lors du scan du répertoire ${dirPath}:`, error.message);
  }
}

// Démarrer le scan
const startTime = Date.now();
console.log('🚀 Démarrage du scan ciblé...\n');

scanDirectory('./src');

const endTime = Date.now();
const duration = (endTime - startTime) / 1000;

// Afficher les résultats
if (totalIssues > 0) {
  console.log('🚨 DONNÉES FICTIVES DÉTECTÉES:\n');
  
  // Trier les fichiers par nombre de problèmes (décroissant)
  const sortedFiles = Array.from(issuesByFile.entries())
    .sort(([,a], [,b]) => b.length - a.length);
  
  sortedFiles.forEach(([filePath, issues]) => {
    console.log(`📄 ${filePath}:`);
    issues.forEach(issue => {
      console.log(`   ❌ Ligne ${issue.line}: ${issue.type} - ${issue.content}`);
    });
    console.log('');
  });
}

console.log('============================================================');
console.log('📊 RÉSUMÉ DU SCAN CIBLÉ:');
console.log(`   • Fichiers scannés: ${totalFiles}`);
console.log(`   • Fichiers avec problèmes: ${issuesByFile.size}`);
console.log(`   • Problèmes détectés: ${totalIssues}`);
console.log(`   • Durée: ${duration.toFixed(2)}s`);

if (totalIssues === 0) {
  console.log('\n✅ AUCUNE DONNÉE FICTIVE DÉTECTÉE !');
  console.log('🎉 APPLICATION CONFORME POUR LES MISSIONS MANUELLES');
} else {
  console.log('\n🚨 DONNÉES FICTIVES DÉTECTÉES DANS L\'APPLICATION !');
  console.log('\n⚠️  ACTION REQUISE:');
  console.log('   1. Remplacer les données fictives par des données réelles');
  console.log('   2. Utiliser des services Firebase réels');
  console.log('   3. Exécuter: node scripts/aggressive-fake-data-cleanup.cjs');
  console.log('\n❌ STATUT: MISSIONS MANUELLES NON CONFORMES');
}
