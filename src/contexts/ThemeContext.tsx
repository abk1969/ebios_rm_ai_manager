import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeColors {
  // Couleurs de base
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  
  // Couleurs primaires
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  
  // Couleurs d'état
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  
  // Bordures et séparateurs
  border: string;
  input: string;
  ring: string;
  
  // Couleurs spécifiques EBIOS RM
  workshop1: string;
  workshop2: string;
  workshop3: string;
  workshop4: string;
  workshop5: string;
  
  // États de validation
  success: string;
  warning: string;
  error: string;
  info: string;
}

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  colors: ThemeColors;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * 🎨 DÉFINITION DES COULEURS PAR THÈME
 */
const lightColors: ThemeColors = {
  background: '#ffffff',
  foreground: '#0f172a',
  card: '#ffffff',
  cardForeground: '#0f172a',
  popover: '#ffffff',
  popoverForeground: '#0f172a',
  
  primary: '#1976d2',
  primaryForeground: '#ffffff',
  secondary: '#f1f5f9',
  secondaryForeground: '#0f172a',
  
  muted: '#f1f5f9',
  mutedForeground: '#64748b',
  accent: '#f1f5f9',
  accentForeground: '#0f172a',
  destructive: '#dc2626',
  destructiveForeground: '#ffffff',
  
  border: '#e2e8f0',
  input: '#e2e8f0',
  ring: '#1976d2',
  
  // Couleurs workshops EBIOS RM
  workshop1: '#3b82f6', // Bleu
  workshop2: '#f97316', // Orange
  workshop3: '#8b5cf6', // Violet
  workshop4: '#ef4444', // Rouge
  workshop5: '#10b981', // Vert
  
  // États
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
};

const darkColors: ThemeColors = {
  background: '#0f172a',
  foreground: '#f8fafc',
  card: '#1e293b',
  cardForeground: '#f8fafc',
  popover: '#1e293b',
  popoverForeground: '#f8fafc',
  
  primary: '#60a5fa',
  primaryForeground: '#0f172a',
  secondary: '#1e293b',
  secondaryForeground: '#f8fafc',
  
  muted: '#1e293b',
  mutedForeground: '#94a3b8',
  accent: '#1e293b',
  accentForeground: '#f8fafc',
  destructive: '#dc2626',
  destructiveForeground: '#f8fafc',
  
  border: '#334155',
  input: '#334155',
  ring: '#60a5fa',
  
  // Couleurs workshops EBIOS RM (adaptées pour le sombre)
  workshop1: '#60a5fa', // Bleu clair
  workshop2: '#fb923c', // Orange clair
  workshop3: '#a78bfa', // Violet clair
  workshop4: '#f87171', // Rouge clair
  workshop5: '#34d399', // Vert clair
  
  // États (adaptés pour le sombre)
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#60a5fa'
};

/**
 * 🎨 PROVIDER DE THÈME
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('ebios-theme');
    return (saved as Theme) || 'auto';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // 🌓 Détection du thème système
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateActualTheme = () => {
      if (theme === 'auto') {
        setActualTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setActualTheme(theme);
      }
    };

    updateActualTheme();
    mediaQuery.addEventListener('change', updateActualTheme);

    return () => mediaQuery.removeEventListener('change', updateActualTheme);
  }, [theme]);

  // 💾 Sauvegarde du thème
  useEffect(() => {
    localStorage.setItem('ebios-theme', theme);
  }, [theme]);

  // 🎨 Application du thème au DOM
  useEffect(() => {
    const root = document.documentElement;
    const colors = actualTheme === 'dark' ? darkColors : lightColors;

    // Application des variables CSS
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Classes CSS pour le thème
    root.classList.remove('light', 'dark');
    root.classList.add(actualTheme);

    // Métadonnées pour le navigateur
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', colors.background);
    }
  }, [actualTheme]);

  const toggleTheme = () => {
    setTheme(current => {
      switch (current) {
        case 'light': return 'dark';
        case 'dark': return 'auto';
        case 'auto': return 'light';
        default: return 'light';
      }
    });
  };

  const colors = actualTheme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{
      theme,
      actualTheme,
      colors,
      setTheme,
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * 🎨 HOOK POUR UTILISER LE THÈME
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

/**
 * 🎨 COMPOSANT SÉLECTEUR DE THÈME
 */
export const ThemeSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, setTheme, actualTheme } = useTheme();

  const themes = [
    { value: 'light', label: '☀️ Clair', icon: '☀️' },
    { value: 'dark', label: '🌙 Sombre', icon: '🌙' },
    { value: 'auto', label: '🔄 Auto', icon: '🔄' }
  ];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Thème :
      </span>
      <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {themes.map((themeOption) => (
          <button
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value as Theme)}
            className={`px-3 py-1 text-sm transition-colors ${
              theme === themeOption.value
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            title={themeOption.label}
          >
            <span className="mr-1">{themeOption.icon}</span>
            <span className="hidden sm:inline">{themeOption.label.split(' ')[1]}</span>
          </button>
        ))}
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        ({actualTheme})
      </span>
    </div>
  );
};

/**
 * 🎨 HOOK POUR LES COULEURS WORKSHOP
 */
export const useWorkshopColors = (workshopNumber: 1 | 2 | 3 | 4 | 5) => {
  const { colors, actualTheme } = useTheme();
  
  const workshopColorMap = {
    1: colors.workshop1,
    2: colors.workshop2,
    3: colors.workshop3,
    4: colors.workshop4,
    5: colors.workshop5
  };

  const baseColor = workshopColorMap[workshopNumber];
  
  return {
    primary: baseColor,
    background: actualTheme === 'dark' 
      ? `${baseColor}20` // 20% opacity
      : `${baseColor}10`, // 10% opacity
    border: actualTheme === 'dark'
      ? `${baseColor}40`
      : `${baseColor}30`,
    text: actualTheme === 'dark'
      ? `${baseColor}ff`
      : `${baseColor}dd`
  };
};

/**
 * 🎨 COMPOSANT INDICATEUR DE THÈME
 */
export const ThemeIndicator: React.FC = () => {
  const { actualTheme, theme } = useTheme();
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg">
      <div className="flex items-center space-x-2 text-xs">
        <div className={`w-2 h-2 rounded-full ${
          actualTheme === 'dark' ? 'bg-blue-400' : 'bg-yellow-400'
        }`} />
        <span className="text-gray-600 dark:text-gray-400">
          {actualTheme} {theme === 'auto' && '(auto)'}
        </span>
      </div>
    </div>
  );
};

export default ThemeContext;
