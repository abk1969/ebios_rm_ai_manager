#!/usr/bin/env node

/**
 * 🔧 SCRIPT DE CORRECTION DES SÉLECTEURS REDUX
 * Détecte et corrige automatiquement les sélecteurs non optimisés
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Détection des sélecteurs Redux non optimisés...');

// Fichiers à analyser
const FILES_TO_ANALYZE = [
  'src/pages/workshops/Workshop1Unified.tsx',
  'src/pages/workshops/Workshop2.tsx',
  'src/pages/workshops/Workshop3.tsx',
  'src/pages/workshops/Workshop4.tsx',
  'src/pages/workshops/Workshop5.tsx',
  'src/components/business-values/AddDreadedEventModal.tsx',
  'src/components/common/MissionSelector.tsx',
  'src/components/dashboard/UnifiedMissionOverview.tsx'
];

// Patterns problématiques
const PROBLEMATIC_PATTERNS = [
  {
    name: 'filter() dans useSelector',
    pattern: /useSelector\s*\(\s*\([^)]*\)\s*=>\s*[^.]*\.filter\s*\(/g,
    severity: 'high',
    description: 'filter() crée un nouveau tableau à chaque rendu'
  },
  {
    name: 'find() dans useSelector',
    pattern: /useSelector\s*\(\s*\([^)]*\)\s*=>\s*[^.]*\.find\s*\(/g,
    severity: 'high',
    description: 'find() peut retourner undefined et crée une nouvelle référence'
  },
  {
    name: 'map() dans useSelector',
    pattern: /useSelector\s*\(\s*\([^)]*\)\s*=>\s*[^.]*\.map\s*\(/g,
    severity: 'high',
    description: 'map() crée un nouveau tableau à chaque rendu'
  },
  {
    name: 'Objet littéral dans useSelector',
    pattern: /useSelector\s*\(\s*\([^)]*\)\s*=>\s*\{[^}]*\}/g,
    severity: 'medium',
    description: 'Objet littéral créé à chaque rendu'
  },
  {
    name: 'Tableau littéral dans useSelector',
    pattern: /useSelector\s*\(\s*\([^)]*\)\s*=>\s*\[[^\]]*\]/g,
    severity: 'medium',
    description: 'Tableau littéral créé à chaque rendu'
  }
];

/**
 * Analyse un fichier pour détecter les sélecteurs problématiques
 */
function analyzeFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  PROBLEMATIC_PATTERNS.forEach(pattern => {
    const matches = content.match(pattern.pattern);
    if (matches) {
      matches.forEach(match => {
        issues.push({
          file: filePath,
          pattern: pattern.name,
          severity: pattern.severity,
          description: pattern.description,
          code: match.trim(),
          line: getLineNumber(content, match)
        });
      });
    }
  });

  return issues;
}

/**
 * Trouve le numéro de ligne d'un match
 */
function getLineNumber(content, match) {
  const index = content.indexOf(match);
  if (index === -1) return 0;
  
  const beforeMatch = content.substring(0, index);
  return beforeMatch.split('\n').length;
}

/**
 * Génère des suggestions de correction
 */
function generateSuggestions(issue) {
  const suggestions = [];
  
  // Suggestions spécifiques selon le pattern
  if (issue.pattern.includes('filter')) {
    suggestions.push('Utilisez un hook personnalisé comme useBusinessValuesByMission()');
    suggestions.push('Créez un sélecteur mémorisé avec createSelector');
  }
  
  if (issue.pattern.includes('find')) {
    suggestions.push('Utilisez un hook personnalisé comme useMissionById()');
    suggestions.push('Créez un sélecteur factory avec makeSelectById()');
  }
  
  if (issue.pattern.includes('Objet littéral')) {
    suggestions.push('Créez un sélecteur mémorisé pour l\'objet');
    suggestions.push('Utilisez useMemo() si le sélecteur est complexe');
  }
  
  // Suggestion générale
  suggestions.push('Importez les sélecteurs optimisés depuis src/store/selectors');
  
  return suggestions;
}

/**
 * Génère un rapport de correction
 */
function generateReport(allIssues) {
  const report = {
    totalIssues: allIssues.length,
    highSeverity: allIssues.filter(i => i.severity === 'high').length,
    mediumSeverity: allIssues.filter(i => i.severity === 'medium').length,
    filesSummary: {},
    recommendations: []
  };

  // Résumé par fichier
  allIssues.forEach(issue => {
    if (!report.filesSummary[issue.file]) {
      report.filesSummary[issue.file] = {
        total: 0,
        high: 0,
        medium: 0,
        issues: []
      };
    }
    
    report.filesSummary[issue.file].total++;
    report.filesSummary[issue.file][issue.severity]++;
    report.filesSummary[issue.file].issues.push(issue);
  });

  // Recommandations générales
  if (report.totalIssues > 0) {
    report.recommendations = [
      '1. Importez les sélecteurs optimisés: import { useBusinessValuesByMission } from "../../store/selectors"',
      '2. Remplacez les useSelector avec filter/find par les hooks personnalisés',
      '3. Créez des sélecteurs mémorisés pour les objets/tableaux complexes',
      '4. Testez les performances avec React DevTools Profiler',
      '5. Surveillez les avertissements Redux dans la console'
    ];
  }

  return report;
}

/**
 * Affiche le rapport
 */
function displayReport(report) {
  console.log('\n📊 RAPPORT D\'ANALYSE DES SÉLECTEURS REDUX\n');
  
  if (report.totalIssues === 0) {
    console.log('✅ Aucun problème détecté ! Tous les sélecteurs sont optimisés.');
    return;
  }

  console.log(`🚨 ${report.totalIssues} problème(s) détecté(s):`);
  console.log(`   • ${report.highSeverity} haute priorité`);
  console.log(`   • ${report.mediumSeverity} priorité moyenne\n`);

  // Détails par fichier
  Object.entries(report.filesSummary).forEach(([file, summary]) => {
    console.log(`📁 ${file}`);
    console.log(`   ${summary.total} problème(s) - ${summary.high} haute, ${summary.medium} moyenne`);
    
    summary.issues.forEach((issue, index) => {
      const icon = issue.severity === 'high' ? '🔴' : '🟡';
      console.log(`   ${icon} Ligne ${issue.line}: ${issue.pattern}`);
      console.log(`      ${issue.description}`);
      console.log(`      Code: ${issue.code.substring(0, 80)}...`);
      
      const suggestions = generateSuggestions(issue);
      console.log(`      💡 Suggestions:`);
      suggestions.slice(0, 2).forEach(suggestion => {
        console.log(`         • ${suggestion}`);
      });
      console.log('');
    });
    console.log('');
  });

  // Recommandations
  if (report.recommendations.length > 0) {
    console.log('🔧 RECOMMANDATIONS GÉNÉRALES:\n');
    report.recommendations.forEach(rec => {
      console.log(`   ${rec}`);
    });
    console.log('');
  }

  // Guide de correction
  console.log('📚 GUIDE DE CORRECTION:\n');
  console.log('   1. Installez les sélecteurs optimisés:');
  console.log('      npm run fix:selectors');
  console.log('');
  console.log('   2. Exemple de correction:');
  console.log('      // ❌ Avant');
  console.log('      const businessValues = useSelector(state => ');
  console.log('        state.businessValues.businessValues.filter(bv => bv.missionId === missionId)');
  console.log('      );');
  console.log('');
  console.log('      // ✅ Après');
  console.log('      const businessValues = useBusinessValuesByMission(missionId);');
  console.log('');
  console.log('   3. Vérifiez les performances avec React DevTools Profiler');
}

// === EXÉCUTION PRINCIPALE ===

console.log('🔍 Analyse des sélecteurs Redux...\n');

const allIssues = [];

FILES_TO_ANALYZE.forEach(filePath => {
  const issues = analyzeFile(filePath);
  if (issues.length > 0) {
    allIssues.push(...issues);
  }
});

const report = generateReport(allIssues);
displayReport(report);

// Sauvegarde du rapport
const reportPath = 'redux-selectors-report.json';
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`📄 Rapport détaillé sauvegardé: ${reportPath}`);

process.exit(allIssues.length > 0 ? 1 : 0);
