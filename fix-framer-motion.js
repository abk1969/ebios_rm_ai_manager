// Script rapide pour corriger les imports framer-motion
import fs from 'fs';
import path from 'path';

const files = [
  'src/modules/training/presentation/components/Workshop1Dashboard.tsx',
  'src/modules/training/presentation/components/A2ACollaborationInterface.tsx',
  'src/modules/training/presentation/components/RealTimeMetricsDisplay.tsx',
  'src/modules/training/presentation/components/ExpertNotificationPanel.tsx',
  'src/modules/training/presentation/components/AdaptiveProgressTracker.tsx',
  'src/modules/training/presentation/components/ExpertActionToolbar.tsx'
];

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Supprimer les imports framer-motion
    content = content.replace(/import.*from ['"]framer-motion['"];?\n?/g, '');
    content = content.replace(/import.*\{.*motion.*AnimatePresence.*\}.*from.*['"]framer-motion['"];?\n?/g, '');
    
    // Remplacer motion.div par div
    content = content.replace(/motion\.div/g, 'div');
    content = content.replace(/motion\.button/g, 'button');
    content = content.replace(/motion\.span/g, 'span');
    
    // Supprimer les props framer-motion
    content = content.replace(/\s*initial=\{[^}]*\}/g, '');
    content = content.replace(/\s*animate=\{[^}]*\}/g, '');
    content = content.replace(/\s*exit=\{[^}]*\}/g, '');
    content = content.replace(/\s*transition=\{[^}]*\}/g, '');
    content = content.replace(/\s*whileHover=\{[^}]*\}/g, '');
    content = content.replace(/\s*whileTap=\{[^}]*\}/g, '');
    
    // Remplacer AnimatePresence par div
    content = content.replace(/<AnimatePresence[^>]*>/g, '<div>');
    content = content.replace(/<\/AnimatePresence>/g, '</div>');
    
    // Ajouter les classes CSS d'animation
    content = content.replace(/className="([^"]*)"(?!\s*className)/g, (match, classes) => {
      if (!classes.includes('animate-')) {
        return `className="${classes} animate-fade-in"`;
      }
      return match;
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Corrigé: ${filePath}`);
  } else {
    console.log(`⚠️ Fichier non trouvé: ${filePath}`);
  }
});

console.log('🎉 Correction terminée !');
