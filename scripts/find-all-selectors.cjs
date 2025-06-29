#!/usr/bin/env node

/**
 * 🔍 DÉTECTION EXHAUSTIVE DE TOUS LES SÉLECTEURS REDUX
 * Trouve TOUS les useSelector dans l'application, même ceux cachés
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Recherche exhaustive de tous les sélecteurs Redux...');

// Fonction récursive pour parcourir tous les fichiers
function findAllFiles(dir, extensions = ['.tsx', '.ts']) {
  let results = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Ignorer node_modules et autres dossiers inutiles
      if (!['node_modules', '.git', 'dist', 'build', '.vite'].includes(file)) {
        results = results.concat(findAllFiles(filePath, extensions));
      }
    } else {
      // Vérifier l'extension
      if (extensions.some(ext => file.endsWith(ext))) {
        results.push(filePath);
      }
    }
  }
  
  return results;
}

// Patterns de sélecteurs problématiques
const PROBLEMATIC_PATTERNS = [
  {
    name: 'useSelector avec filter()',
    pattern: /useSelector\s*\(\s*[^)]*=>\s*[^.]*\.filter\s*\(/g,
    severity: 'high'
  },
  {
    name: 'useSelector avec find()',
    pattern: /useSelector\s*\(\s*[^)]*=>\s*[^.]*\.find\s*\(/g,
    severity: 'high'
  },
  {
    name: 'useSelector avec map()',
    pattern: /useSelector\s*\(\s*[^)]*=>\s*[^.]*\.map\s*\(/g,
    severity: 'high'
  },
  {
    name: 'useSelector avec objet littéral',
    pattern: /useSelector\s*\(\s*[^)]*=>\s*\{[^}]*\}/g,
    severity: 'medium'
  },
  {
    name: 'useSelector avec tableau littéral',
    pattern: /useSelector\s*\(\s*[^)]*=>\s*\[[^\]]*\]/g,
    severity: 'medium'
  },
  {
    name: 'useSelector avec spread operator',
    pattern: /useSelector\s*\(\s*[^)]*=>\s*\{[^}]*\.\.\.[^}]*\}/g,
    severity: 'medium'
  }
];

// Analyser un fichier
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];
  
  // Vérifier si le fichier contient useSelector
  if (!content.includes('useSelector')) {
    return issues;
  }
  
  PROBLEMATIC_PATTERNS.forEach(pattern => {
    const matches = content.match(pattern.pattern);
    if (matches) {
      matches.forEach(match => {
        const lines = content.split('\n');
        let lineNumber = 0;
        
        // Trouver le numéro de ligne
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(match.substring(0, 30))) {
            lineNumber = i + 1;
            break;
          }
        }
        
        issues.push({
          file: filePath,
          line: lineNumber,
          pattern: pattern.name,
          severity: pattern.severity,
          code: match.trim(),
          context: lines[lineNumber - 1]?.trim() || ''
        });
      });
    }
  });
  
  return issues;
}

// Rechercher tous les fichiers TypeScript/React
const allFiles = findAllFiles('src');
console.log(`📁 ${allFiles.length} fichiers trouvés`);

let totalIssues = 0;
const issuesByFile = {};

// Analyser chaque fichier
allFiles.forEach(filePath => {
  const issues = analyzeFile(filePath);
  if (issues.length > 0) {
    issuesByFile[filePath] = issues;
    totalIssues += issues.length;
  }
});

// Afficher les résultats
console.log(`\n📊 RÉSULTATS DE L'ANALYSE EXHAUSTIVE`);
console.log(`🚨 ${totalIssues} sélecteur(s) problématique(s) trouvé(s) dans ${Object.keys(issuesByFile).length} fichier(s)`);

if (totalIssues === 0) {
  console.log('✅ Aucun sélecteur problématique détecté !');
  process.exit(0);
}

console.log('\n📋 DÉTAILS PAR FICHIER:\n');

Object.entries(issuesByFile).forEach(([filePath, issues]) => {
  console.log(`📁 ${filePath}`);
  console.log(`   ${issues.length} problème(s) détecté(s)`);
  
  issues.forEach((issue, index) => {
    const icon = issue.severity === 'high' ? '🔴' : '🟡';
    console.log(`   ${icon} Ligne ${issue.line}: ${issue.pattern}`);
    console.log(`      Code: ${issue.code.substring(0, 80)}${issue.code.length > 80 ? '...' : ''}`);
    console.log(`      Contexte: ${issue.context.substring(0, 100)}${issue.context.length > 100 ? '...' : ''}`);
    console.log('');
  });
  console.log('');
});

// Suggestions de correction
console.log('🔧 SUGGESTIONS DE CORRECTION:\n');
console.log('1. Remplacez les sélecteurs avec filter/find/map par des sélecteurs mémorisés');
console.log('2. Utilisez createSelector de Redux Toolkit pour les objets/tableaux');
console.log('3. Importez les sélecteurs optimisés depuis src/store/selectors');
console.log('4. Utilisez les hooks personnalisés comme useBusinessValuesByMission()');

// Sauvegarder le rapport détaillé
const report = {
  timestamp: new Date().toISOString(),
  totalFiles: allFiles.length,
  totalIssues,
  issuesByFile
};

fs.writeFileSync('selector-analysis-report.json', JSON.stringify(report, null, 2));
console.log('\n📄 Rapport détaillé sauvegardé: selector-analysis-report.json');

process.exit(totalIssues > 0 ? 1 : 0);
