import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Globe, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Wifi,
  Database,
  Zap,
  Eye,
  Settings,
  Info
} from 'lucide-react';

/**
 * 🌐 TESTS DE COMPATIBILITÉ ET VALIDATION
 * Validation compatibilité navigateurs, appareils et fonctionnalités
 */

interface CompatibilityFeature {
  name: string;
  supported: boolean;
  version?: string;
  critical: boolean;
  description: string;
  fallback?: string;
}

interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  platform: string;
  mobile: boolean;
}

interface DeviceCapabilities {
  screen: {
    width: number;
    height: number;
    pixelRatio: number;
    orientation: string;
  };
  memory: number;
  cores: number;
  connection: string;
  storage: {
    localStorage: boolean;
    sessionStorage: boolean;
    indexedDB: boolean;
    quota: number;
  };
}

export const CompatibilityValidationTest: React.FC = () => {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [deviceCapabilities, setDeviceCapabilities] = useState<DeviceCapabilities | null>(null);
  const [features, setFeatures] = useState<CompatibilityFeature[]>([]);
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    detectBrowserInfo();
    detectDeviceCapabilities();
    testFeatureCompatibility();
  }, []);

  const detectBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    let engine = 'Unknown';

    // Détection navigateur
    if (ua.includes('Chrome') && !ua.includes('Edg')) {
      browserName = 'Chrome';
      browserVersion = ua.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
      engine = 'Blink';
    } else if (ua.includes('Firefox')) {
      browserName = 'Firefox';
      browserVersion = ua.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
      engine = 'Gecko';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      browserName = 'Safari';
      browserVersion = ua.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
      engine = 'WebKit';
    } else if (ua.includes('Edg')) {
      browserName = 'Edge';
      browserVersion = ua.match(/Edg\/([0-9.]+)/)?.[1] || 'Unknown';
      engine = 'Blink';
    }

    const info: BrowserInfo = {
      name: browserName,
      version: browserVersion,
      engine,
      platform: navigator.platform,
      mobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
    };

    setBrowserInfo(info);
  };

  const detectDeviceCapabilities = async () => {
    const capabilities: DeviceCapabilities = {
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        pixelRatio: window.devicePixelRatio,
        orientation: window.screen.orientation?.type || 'unknown'
      },
      memory: (navigator as any).deviceMemory || 0,
      cores: navigator.hardwareConcurrency || 0,
      connection: (navigator as any).connection?.effectiveType || 'unknown',
      storage: {
        localStorage: testLocalStorage(),
        sessionStorage: testSessionStorage(),
        indexedDB: testIndexedDB(),
        quota: await getStorageQuota()
      }
    };

    setDeviceCapabilities(capabilities);
  };

  const testLocalStorage = (): boolean => {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  };

  const testSessionStorage = (): boolean => {
    try {
      const test = 'test';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  };

  const testIndexedDB = (): boolean => {
    return 'indexedDB' in window;
  };

  const getStorageQuota = async (): Promise<number> => {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return estimate.quota || 0;
      }
      return 0;
    } catch {
      return 0;
    }
  };

  const testFeatureCompatibility = () => {
    const featureTests: CompatibilityFeature[] = [
      // APIs essentielles
      {
        name: 'Local Storage',
        supported: testLocalStorage(),
        critical: true,
        description: 'Stockage local pour données utilisateur',
        fallback: 'Mémoire temporaire'
      },
      {
        name: 'Session Storage',
        supported: testSessionStorage(),
        critical: false,
        description: 'Stockage session pour données temporaires'
      },
      {
        name: 'IndexedDB',
        supported: testIndexedDB(),
        critical: false,
        description: 'Base de données locale avancée',
        fallback: 'Local Storage'
      },
      {
        name: 'Web Workers',
        supported: 'Worker' in window,
        critical: false,
        description: 'Traitement en arrière-plan'
      },
      {
        name: 'Service Workers',
        supported: 'serviceWorker' in navigator,
        critical: false,
        description: 'Cache et fonctionnement offline'
      },
      
      // APIs modernes
      {
        name: 'Fetch API',
        supported: 'fetch' in window,
        critical: true,
        description: 'Requêtes HTTP modernes',
        fallback: 'XMLHttpRequest'
      },
      {
        name: 'Promises',
        supported: 'Promise' in window,
        critical: true,
        description: 'Programmation asynchrone'
      },
      {
        name: 'Async/Await',
        supported: testAsyncAwait(),
        critical: true,
        description: 'Syntaxe asynchrone moderne'
      },
      {
        name: 'ES6 Modules',
        supported: testES6Modules(),
        critical: true,
        description: 'Modules JavaScript modernes'
      },
      {
        name: 'Arrow Functions',
        supported: testArrowFunctions(),
        critical: true,
        description: 'Syntaxe fonction moderne'
      },
      
      // APIs spécialisées
      {
        name: 'Intersection Observer',
        supported: 'IntersectionObserver' in window,
        critical: false,
        description: 'Détection visibilité éléments'
      },
      {
        name: 'Resize Observer',
        supported: 'ResizeObserver' in window,
        critical: false,
        description: 'Détection redimensionnement'
      },
      {
        name: 'Performance API',
        supported: 'performance' in window,
        critical: false,
        description: 'Mesures de performance'
      },
      {
        name: 'Network Information',
        supported: 'connection' in navigator,
        critical: false,
        description: 'Informations réseau'
      },
      
      // Fonctionnalités CSS
      {
        name: 'CSS Grid',
        supported: testCSSGrid(),
        critical: true,
        description: 'Layout CSS moderne',
        fallback: 'Flexbox'
      },
      {
        name: 'CSS Flexbox',
        supported: testCSSFlexbox(),
        critical: true,
        description: 'Layout CSS flexible'
      },
      {
        name: 'CSS Custom Properties',
        supported: testCSSCustomProperties(),
        critical: false,
        description: 'Variables CSS'
      },
      {
        name: 'CSS Animations',
        supported: testCSSAnimations(),
        critical: false,
        description: 'Animations CSS'
      }
    ];

    setFeatures(featureTests);
    calculateCompatibilityScore(featureTests);
    generateRecommendations(featureTests);
  };

  const testAsyncAwait = (): boolean => {
    try {
      eval('(async () => {})');
      return true;
    } catch {
      return false;
    }
  };

  const testES6Modules = (): boolean => {
    try {
      eval('import.meta');
      return true;
    } catch {
      return false;
    }
  };

  const testArrowFunctions = (): boolean => {
    try {
      eval('(() => {})');
      return true;
    } catch {
      return false;
    }
  };

  const testCSSGrid = (): boolean => {
    return CSS.supports('display', 'grid');
  };

  const testCSSFlexbox = (): boolean => {
    return CSS.supports('display', 'flex');
  };

  const testCSSCustomProperties = (): boolean => {
    return CSS.supports('--custom', 'value');
  };

  const testCSSAnimations = (): boolean => {
    return CSS.supports('animation', 'none');
  };

  const calculateCompatibilityScore = (features: CompatibilityFeature[]) => {
    const criticalFeatures = features.filter(f => f.critical);
    const nonCriticalFeatures = features.filter(f => !f.critical);

    const criticalSupported = criticalFeatures.filter(f => f.supported).length;
    const nonCriticalSupported = nonCriticalFeatures.filter(f => f.supported).length;

    // Score pondéré : 80% critique, 20% non-critique
    const criticalScore = (criticalSupported / criticalFeatures.length) * 80;
    const nonCriticalScore = (nonCriticalSupported / nonCriticalFeatures.length) * 20;

    const totalScore = criticalScore + nonCriticalScore;
    setCompatibilityScore(totalScore);
  };

  const generateRecommendations = (features: CompatibilityFeature[]) => {
    const recs: string[] = [];
    
    const unsupportedCritical = features.filter(f => f.critical && !f.supported);
    const unsupportedNonCritical = features.filter(f => !f.critical && !f.supported);

    if (unsupportedCritical.length > 0) {
      recs.push(`⚠️ ${unsupportedCritical.length} fonctionnalité(s) critique(s) non supportée(s)`);
      recs.push('Mettre à jour le navigateur ou utiliser un navigateur moderne');
    }

    if (unsupportedNonCritical.length > 0) {
      recs.push(`💡 ${unsupportedNonCritical.length} fonctionnalité(s) optionnelle(s) non supportée(s)`);
    }

    if (browserInfo?.name === 'Unknown') {
      recs.push('🔍 Navigateur non reconnu - tester la compatibilité manuellement');
    }

    if (deviceCapabilities?.memory && deviceCapabilities.memory < 4) {
      recs.push('💾 Mémoire limitée - performances réduites possibles');
    }

    if (deviceCapabilities?.storage.quota && deviceCapabilities.storage.quota < 50 * 1024 * 1024) {
      recs.push('💿 Quota stockage limité - fonctionnalités offline réduites');
    }

    setRecommendations(recs);
  };

  const getFeatureIcon = (feature: CompatibilityFeature) => {
    if (feature.supported) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (feature.critical) {
      return <XCircle className="w-4 h-4 text-red-600" />;
    } else {
      return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDeviceIcon = () => {
    if (browserInfo?.mobile) {
      return deviceCapabilities?.screen.width && deviceCapabilities.screen.width > 768 
        ? <Tablet className="w-5 h-5" />
        : <Smartphone className="w-5 h-5" />;
    }
    return <Monitor className="w-5 h-5" />;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Globe className="w-6 h-6 mr-3 text-blue-600" />
          Tests de Compatibilité
        </h2>
        <p className="text-gray-600">
          Validation de la compatibilité navigateur et fonctionnalités supportées
        </p>
      </div>

      {/* Score de compatibilité */}
      {compatibilityScore !== null && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-blue-900">🎯 Score de Compatibilité</h3>
            <div className={`text-3xl font-bold ${getScoreColor(compatibilityScore)}`}>
              {Math.round(compatibilityScore)}/100
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  compatibilityScore >= 90 ? 'bg-green-500' :
                  compatibilityScore >= 70 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${compatibilityScore}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations navigateur */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center">
            {getDeviceIcon()}
            <span className="ml-2">Environnement</span>
          </h3>
          
          {browserInfo && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Navigateur</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Nom :</span>
                  <span className="font-medium">{browserInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Version :</span>
                  <span className="font-medium">{browserInfo.version}</span>
                </div>
                <div className="flex justify-between">
                  <span>Moteur :</span>
                  <span className="font-medium">{browserInfo.engine}</span>
                </div>
                <div className="flex justify-between">
                  <span>Plateforme :</span>
                  <span className="font-medium">{browserInfo.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mobile :</span>
                  <span className="font-medium">{browserInfo.mobile ? 'Oui' : 'Non'}</span>
                </div>
              </div>
            </div>
          )}

          {deviceCapabilities && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Capacités Appareil</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Écran :</span>
                  <span className="font-medium">
                    {deviceCapabilities.screen.width}×{deviceCapabilities.screen.height}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pixel Ratio :</span>
                  <span className="font-medium">{deviceCapabilities.screen.pixelRatio}x</span>
                </div>
                <div className="flex justify-between">
                  <span>Mémoire :</span>
                  <span className="font-medium">{deviceCapabilities.memory || 'N/A'} GB</span>
                </div>
                <div className="flex justify-between">
                  <span>Processeurs :</span>
                  <span className="font-medium">{deviceCapabilities.cores || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Connexion :</span>
                  <span className="font-medium">{deviceCapabilities.connection}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quota stockage :</span>
                  <span className="font-medium">
                    {Math.round(deviceCapabilities.storage.quota / 1024 / 1024)} MB
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fonctionnalités supportées */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Fonctionnalités</h3>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-3 rounded border ${
                  feature.supported ? 'bg-green-50 border-green-200' :
                  feature.critical ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    {getFeatureIcon(feature)}
                    <span className="font-medium text-sm">{feature.name}</span>
                    {feature.critical && (
                      <span className="px-1 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                        Critique
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  {feature.description}
                </div>
                {!feature.supported && feature.fallback && (
                  <div className="text-xs text-blue-600 mt-1">
                    Fallback: {feature.fallback}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommandations */}
      {recommendations.length > 0 && (
        <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium mb-2 flex items-center">
            <Info className="w-5 h-5 mr-2 text-yellow-600" />
            Recommandations
          </h3>
          <ul className="text-sm space-y-1">
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Support navigateurs */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-medium mb-2">🌐 Navigateurs Supportés</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Chrome :</span>
            <span className="ml-2">≥ 80</span>
          </div>
          <div>
            <span className="font-medium">Firefox :</span>
            <span className="ml-2">≥ 75</span>
          </div>
          <div>
            <span className="font-medium">Safari :</span>
            <span className="ml-2">≥ 13</span>
          </div>
          <div>
            <span className="font-medium">Edge :</span>
            <span className="ml-2">≥ 80</span>
          </div>
        </div>
      </div>
    </div>
  );
};
