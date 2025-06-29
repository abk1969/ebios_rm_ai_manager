import React from 'react';
import { cn } from '@/lib/utils';

export interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  minItemWidth?: string;
  maxItemWidth?: string;
  autoFit?: boolean;
}

/**
 * 📱 COMPOSANT DE GRILLE RESPONSIVE STANDARDISÉ
 * Optimise l'affichage sur tous les écrans pour EBIOS RM
 */
const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 'md',
  className = '',
  minItemWidth = '280px',
  maxItemWidth = '1fr',
  autoFit = false
}) => {

  // 📐 Classes de gap standardisées
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  // 🔧 Génération des classes de colonnes
  const getColumnClasses = () => {
    const classes = ['grid'];
    
    if (autoFit) {
      // Mode auto-fit avec largeur minimale
      return cn(
        'grid',
        gapClasses[gap],
        className
      );
    }

    // Mode colonnes fixes responsive
    if (columns.sm) classes.push(`grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    
    classes.push(gapClasses[gap]);
    
    return cn(classes, className);
  };

  // 🎨 Style CSS pour auto-fit
  const autoFitStyle = autoFit ? {
    gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, ${maxItemWidth}))`
  } : undefined;

  return (
    <div 
      className={getColumnClasses()}
      style={autoFitStyle}
    >
      {children}
    </div>
  );
};

/**
 * 📊 COMPOSANT DE GRILLE POUR MÉTRIQUES
 */
export interface MetricsGridProps {
  children: React.ReactNode;
  className?: string;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ 
  children, 
  className = '' 
}) => (
  <ResponsiveGrid
    columns={{ sm: 1, md: 2, lg: 4, xl: 6 }}
    gap="md"
    className={className}
  >
    {children}
  </ResponsiveGrid>
);

/**
 * 🃏 COMPOSANT DE GRILLE POUR CARTES
 */
export interface CardsGridProps {
  children: React.ReactNode;
  className?: string;
  dense?: boolean;
}

export const CardsGrid: React.FC<CardsGridProps> = ({ 
  children, 
  className = '',
  dense = false 
}) => (
  <ResponsiveGrid
    columns={dense ? { sm: 1, md: 2, lg: 3, xl: 4 } : { sm: 1, md: 2, lg: 2, xl: 3 }}
    gap={dense ? 'sm' : 'md'}
    className={className}
  >
    {children}
  </ResponsiveGrid>
);

/**
 * 📋 COMPOSANT DE GRILLE POUR FORMULAIRES
 */
export interface FormGridProps {
  children: React.ReactNode;
  className?: string;
  layout?: 'single' | 'double' | 'triple';
}

export const FormGrid: React.FC<FormGridProps> = ({ 
  children, 
  className = '',
  layout = 'double'
}) => {
  const getColumns = () => {
    switch (layout) {
      case 'single': return { sm: 1, md: 1, lg: 1, xl: 1 };
      case 'triple': return { sm: 1, md: 2, lg: 3, xl: 3 };
      default: return { sm: 1, md: 2, lg: 2, xl: 2 };
    }
  };

  return (
    <ResponsiveGrid
      columns={getColumns()}
      gap="lg"
      className={className}
    >
      {children}
    </ResponsiveGrid>
  );
};

/**
 * 📱 COMPOSANT DE CONTENEUR RESPONSIVE
 */
export interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = 'full',
  padding = 'md',
  className = ''
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    sm: 'px-4 py-2',
    md: 'px-6 py-4',
    lg: 'px-8 py-6',
    xl: 'px-12 py-8'
  };

  return (
    <div className={cn(
      'mx-auto w-full',
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
};

/**
 * 🔧 HOOK POUR DÉTECTION DE TAILLE D'ÉCRAN
 */
export const useResponsive = () => {
  const [screenSize, setScreenSize] = React.useState<'sm' | 'md' | 'lg' | 'xl'>('md');

  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize('sm');
      else if (width < 768) setScreenSize('md');
      else if (width < 1024) setScreenSize('lg');
      else setScreenSize('xl');
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return {
    screenSize,
    isMobile: screenSize === 'sm',
    isTablet: screenSize === 'md',
    isDesktop: screenSize === 'lg' || screenSize === 'xl',
    isLargeDesktop: screenSize === 'xl'
  };
};

export default ResponsiveGrid;
