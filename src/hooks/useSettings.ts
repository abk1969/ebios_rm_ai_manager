/**
 * ⚙️ HOOK DE GESTION DES PARAMÈTRES
 * Hook React pour accéder et modifier les paramètres de l'application
 */

import { useState, useEffect, useCallback } from 'react';
import { SettingsService, type AppSettings } from '@/services/settings/SettingsService';
import { SettingsSync } from '@/services/settings/SettingsSync';
import { LLMConfigManager } from '@/config/llm';

interface UseSettingsReturn {
  settings: AppSettings | null;
  loading: boolean;
  error: string | null;
  updateSettings: (section: keyof AppSettings, data: any) => Promise<void>;
  refreshSettings: () => Promise<void>;
  testLLMConnection: (provider: string, apiKey: string) => Promise<{ success: boolean; message: string }>;
  validateSettings: () => { valid: boolean; errors: string[] };
}

export const useSettings = (): UseSettingsReturn => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const settingsService = SettingsService.getInstance();
  const settingsSync = SettingsSync.getInstance();
  const llmConfigManager = LLMConfigManager.getInstance();

  // 📖 CHARGEMENT DES PARAMÈTRES
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const appSettings = await settingsService.getSettings();
      setSettings(appSettings);
      
      // Synchroniser avec l'application
      await settingsSync.syncAllSettings();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des paramètres';
      setError(errorMessage);
      console.error('Erreur lors du chargement des paramètres:', err);
    } finally {
      setLoading(false);
    }
  }, [settingsService, settingsSync]);

  // 🔄 ACTUALISATION DES PARAMÈTRES
  const refreshSettings = useCallback(async () => {
    await loadSettings();
  }, [loadSettings]);

  // 💾 MISE À JOUR DES PARAMÈTRES
  const updateSettings = useCallback(async (section: keyof AppSettings, data: any) => {
    if (!settings) return;

    try {
      setError(null);
      
      const updatedSettings = {
        ...settings,
        [section]: {
          ...settings[section],
          ...data
        },
        lastUpdated: new Date(),
        updatedBy: 'user' // À remplacer par l'ID utilisateur réel
      };

      // Validation avant sauvegarde
      const validation = settingsService.validateSettings(updatedSettings);
      if (!validation.valid) {
        throw new Error(`Validation échouée: ${validation.errors.join(', ')}`);
      }

      // Sauvegarder
      await settingsService.saveSettings(updatedSettings, 'user');
      setSettings(updatedSettings);

      // Synchroniser la section modifiée
      switch (section) {
        case 'ai':
          await settingsSync.syncLLMConfig(updatedSettings.ai);
          break;
        case 'security':
          await settingsSync.syncSecurityConfig(updatedSettings.security);
          break;
        case 'general':
          await settingsSync.syncGeneralConfig(updatedSettings.general);
          break;
      }

      // Émettre un événement pour notifier les autres composants
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('settings-updated', {
          detail: { section, settings: updatedSettings[section] }
        }));
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour des paramètres';
      setError(errorMessage);
      console.error('Erreur lors de la mise à jour des paramètres:', err);
      throw err;
    }
  }, [settings, settingsService, settingsSync]);

  // 🧪 TEST DE CONNEXION LLM
  const testLLMConnection = useCallback(async (provider: string, apiKey: string) => {
    try {
      return await settingsService.testApiConnection(provider, apiKey);
    } catch (err) {
      console.error('Erreur lors du test de connexion LLM:', err);
      return {
        success: false,
        message: err instanceof Error ? err.message : 'Erreur de test de connexion'
      };
    }
  }, [settingsService]);

  // ✅ VALIDATION DES PARAMÈTRES
  const validateSettings = useCallback(() => {
    if (!settings) {
      return { valid: false, errors: ['Paramètres non chargés'] };
    }
    
    return settingsService.validateSettings(settings);
  }, [settings, settingsService]);

  // 🎧 ÉCOUTE DES ÉVÉNEMENTS
  useEffect(() => {
    const handleSettingsChange = (event: CustomEvent) => {
      const { section, settings: updatedSection } = event.detail;
      
      if (settings) {
        setSettings(prev => prev ? {
          ...prev,
          [section]: updatedSection
        } : null);
      }
    };

    const handleLLMConfigUpdate = () => {
      // Actualiser la configuration LLM
      llmConfigManager.refreshConfig();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('settings-changed', handleSettingsChange as EventListener);
      window.addEventListener('llm-config-updated', handleLLMConfigUpdate);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('settings-changed', handleSettingsChange as EventListener);
        window.removeEventListener('llm-config-updated', handleLLMConfigUpdate);
      }
    };
  }, [settings, llmConfigManager]);

  // 🚀 CHARGEMENT INITIAL
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    refreshSettings,
    testLLMConnection,
    validateSettings
  };
};

// 🎯 HOOK SPÉCIALISÉ POUR LES PARAMÈTRES LLM
export const useLLMSettings = () => {
  const { settings, updateSettings, testLLMConnection } = useSettings();
  
  const updateLLMSettings = useCallback(async (llmData: any) => {
    await updateSettings('ai', llmData);
  }, [updateSettings]);

  const getAvailableModels = useCallback(() => {
    const settingsService = SettingsService.getInstance();
    return settingsService.getAvailableLLMModels();
  }, []);

  return {
    llmSettings: settings?.ai,
    updateLLMSettings,
    testLLMConnection,
    getAvailableModels
  };
};

// 🔒 HOOK SPÉCIALISÉ POUR LES PARAMÈTRES DE SÉCURITÉ
export const useSecuritySettings = () => {
  const { settings, updateSettings } = useSettings();
  
  const updateSecuritySettings = useCallback(async (securityData: any) => {
    await updateSettings('security', securityData);
  }, [updateSettings]);

  const isMFARequired = useCallback((role: string) => {
    return settings?.security.mfaRequired[role as keyof typeof settings.security.mfaRequired] || false;
  }, [settings]);

  const getPasswordPolicy = useCallback(() => {
    return settings?.security.passwordPolicy;
  }, [settings]);

  return {
    securitySettings: settings?.security,
    updateSecuritySettings,
    isMFARequired,
    getPasswordPolicy
  };
};

// 🌐 HOOK SPÉCIALISÉ POUR LES PARAMÈTRES GÉNÉRAUX
export const useGeneralSettings = () => {
  const { settings, updateSettings } = useSettings();
  
  const updateGeneralSettings = useCallback(async (generalData: any) => {
    await updateSettings('general', generalData);
  }, [updateSettings]);

  const getCurrentLanguage = useCallback(() => {
    return settings?.general.language || 'fr';
  }, [settings]);

  const getCurrentTheme = useCallback(() => {
    return settings?.general.theme || 'light';
  }, [settings]);

  const getTimezone = useCallback(() => {
    return settings?.general.timezone || 'Europe/Paris';
  }, [settings]);

  return {
    generalSettings: settings?.general,
    updateGeneralSettings,
    getCurrentLanguage,
    getCurrentTheme,
    getTimezone
  };
};
