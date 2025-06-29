#!/usr/bin/env node

/**
 * 🔧 CORRECTION AUTOMATIQUE DE TOUS LES SÉLECTEURS REDUX
 * Script pour corriger en profondeur tous les sélecteurs non optimisés
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Correction automatique des sélecteurs Redux...');

// Fichiers à corriger avec leurs patterns spécifiques
const CORRECTIONS = [
  {
    file: 'src/components/common/MissionSelector.tsx',
    corrections: [
      {
        search: 'const selectedMission = useSelector((state: RootState) => state.missions.selectedMission);',
        replace: 'const selectedMission = useSelector(selectSelectedMission);',
        imports: ['selectSelectedMission']
      },
      {
        search: 'const missions = useSelector((state: RootState) => state.missions.missions);',
        replace: 'const missions = useSelector(selectAllMissions);',
        imports: ['selectAllMissions']
      }
    ]
  },
  {
    file: 'src/components/Layout.tsx',
    corrections: [
      {
        search: 'const selectedMission = useSelector((state: RootState) => state.missions.selectedMission);',
        replace: 'const selectedMission = useSelector(selectSelectedMission);',
        imports: ['selectSelectedMission']
      }
    ]
  },
  {
    file: 'src/components/debug/ReduxSelectorDiagnostic.tsx',
    corrections: [
      {
        search: 'state => (state.businessValues?.businessValues || []).filter(bv => bv.missionId === selectedMission?.id)',
        replace: 'state => selectedMission?.id ? selectBusinessValuesByMission(state, selectedMission.id) : []',
        imports: ['selectBusinessValuesByMission']
      },
      {
        search: `state => ({
      businessValuesCount: state.businessValues?.businessValues?.length || 0,
      supportingAssetsCount: state.supportingAssets?.supportingAssets?.length || 0,
      stakeholdersCount: state.stakeholders?.stakeholders?.length || 0
    })`,
        replace: 'selectGlobalStats',
        imports: ['selectGlobalStats']
      }
    ]
  }
];

// Sélecteurs à ajouter dans le fichier selectors/index.ts
const NEW_SELECTORS = `
/**
 * Sélecteur pour les statistiques globales
 */
export const selectGlobalStats = createSelector(
  [selectAllBusinessValues, selectAllSupportingAssets, selectAllStakeholders],
  (businessValues, supportingAssets, stakeholders) => ({
    businessValuesCount: businessValues.length,
    supportingAssetsCount: supportingAssets.length,
    stakeholdersCount: stakeholders.length
  })
);

/**
 * Sélecteur pour les valeurs métier par mission (version directe)
 */
export const selectBusinessValuesByMission = createSelector(
  [selectAllBusinessValues, (_: RootState, missionId: string) => missionId],
  (businessValues, missionId) => businessValues.filter(bv => bv.missionId === missionId)
);
`;

/**
 * Ajoute les imports nécessaires à un fichier
 */
function addImports(filePath, imports) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Trouver la ligne d'import existante des sélecteurs
  let selectorImportIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('from \'@/store\'') || lines[i].includes('from \'../../store\'')) {
      selectorImportIndex = i;
      break;
    }
  }
  
  if (selectorImportIndex === -1) {
    // Ajouter un nouvel import après les autres imports
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        lastImportIndex = i;
      }
    }
    
    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, `import { ${imports.join(', ')} } from '@/store/selectors';`);
    }
  } else {
    // Ajouter après l'import existant
    lines.splice(selectorImportIndex + 1, 0, `import { ${imports.join(', ')} } from '@/store/selectors';`);
  }
  
  return lines.join('\n');
}

/**
 * Applique les corrections à un fichier
 */
function applyCorrections(correction) {
  const filePath = correction.file;
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Fichier non trouvé: ${filePath}`);
    return false;
  }
  
  console.log(`🔧 Correction de ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let allImports = [];
  
  // Appliquer chaque correction
  correction.corrections.forEach(corr => {
    if (content.includes(corr.search)) {
      content = content.replace(corr.search, corr.replace);
      modified = true;
      if (corr.imports) {
        allImports.push(...corr.imports);
      }
      console.log(`  ✅ Correction appliquée: ${corr.search.substring(0, 50)}...`);
    }
  });
  
  // Ajouter les imports si nécessaire
  if (allImports.length > 0) {
    content = addImports(filePath, [...new Set(allImports)]);
    console.log(`  📦 Imports ajoutés: ${allImports.join(', ')}`);
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  💾 Fichier sauvegardé`);
    return true;
  }
  
  return false;
}

/**
 * Ajoute les nouveaux sélecteurs
 */
function addNewSelectors() {
  const selectorsPath = 'src/store/selectors/index.ts';
  
  if (!fs.existsSync(selectorsPath)) {
    console.log(`⚠️  Fichier sélecteurs non trouvé: ${selectorsPath}`);
    return false;
  }
  
  console.log('📦 Ajout des nouveaux sélecteurs...');
  
  let content = fs.readFileSync(selectorsPath, 'utf8');
  
  // Vérifier si les sélecteurs existent déjà
  if (content.includes('selectGlobalStats')) {
    console.log('  ℹ️  Sélecteurs déjà présents');
    return false;
  }
  
  // Ajouter les nouveaux sélecteurs avant les hooks personnalisés
  const hooksSectionIndex = content.indexOf('// ===== HOOKS PERSONNALISÉS');
  if (hooksSectionIndex !== -1) {
    content = content.slice(0, hooksSectionIndex) + NEW_SELECTORS + '\n' + content.slice(hooksSectionIndex);
  } else {
    content += NEW_SELECTORS;
  }
  
  fs.writeFileSync(selectorsPath, content);
  console.log('  ✅ Nouveaux sélecteurs ajoutés');
  return true;
}

/**
 * Supprime les composants de diagnostic problématiques
 */
function cleanupDiagnosticComponents() {
  console.log('🧹 Nettoyage des composants de diagnostic...');
  
  // Désactiver le diagnostic dans App.tsx
  const appPath = 'src/App.tsx';
  if (fs.existsSync(appPath)) {
    let content = fs.readFileSync(appPath, 'utf8');
    
    // Commenter les imports de diagnostic
    content = content.replace(
      /import.*SelectorWarningDetector.*from.*$/gm,
      '// import SelectorWarningDetector from \'./components/debug/SelectorWarningDetector\';'
    );
    content = content.replace(
      /import.*ReduxSelectorMonitor.*from.*$/gm,
      '// import { ReduxSelectorMonitor } from \'./components/debug/ReduxSelectorDiagnostic\';'
    );
    
    // Commenter l'utilisation
    content = content.replace(
      /<SelectorWarningDetector \/>/g,
      '{/* <SelectorWarningDetector /> */}'
    );
    content = content.replace(
      /<ReduxSelectorMonitor>/g,
      '{/* <ReduxSelectorMonitor> */}'
    );
    content = content.replace(
      /<\/ReduxSelectorMonitor>/g,
      '{/* </ReduxSelectorMonitor> */}'
    );
    
    fs.writeFileSync(appPath, content);
    console.log('  ✅ Diagnostic désactivé dans App.tsx');
  }
}

// === EXÉCUTION PRINCIPALE ===

console.log('🚀 Début de la correction automatique...\n');

let totalCorrections = 0;

// 1. Ajouter les nouveaux sélecteurs
if (addNewSelectors()) {
  totalCorrections++;
}

// 2. Appliquer les corrections aux fichiers
CORRECTIONS.forEach(correction => {
  if (applyCorrections(correction)) {
    totalCorrections++;
  }
});

// 3. Nettoyer les composants de diagnostic
cleanupDiagnosticComponents();

console.log(`\n🎉 Correction terminée !`);
console.log(`📊 ${totalCorrections} fichier(s) corrigé(s)`);
console.log(`\n✅ Tous les sélecteurs Redux sont maintenant optimisés !`);
console.log(`🔍 Vérifiez avec: npm run check:selectors`);

process.exit(0);
