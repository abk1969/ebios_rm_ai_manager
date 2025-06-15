/**
 * 🔄 SERVICE DE SYNCHRONISATION DES PARAMÈTRES
 * Synchronise les paramètres avec l'application existante
 */

import { SettingsService } from './SettingsService';
import { LLMConfigManager } from '@/config/llm';
import { SecurityService } from '@/services/security/SecurityService';

export class SettingsSync {
  private static instance: SettingsSync;
  private settingsService = SettingsService.getInstance();
  private llmConfigManager = LLMConfigManager.getInstance();
  private securityService = SecurityService.getInstance();

  private constructor() {}

  public static getInstance(): SettingsSync {
    if (!SettingsSync.instance) {
      SettingsSync.instance = new SettingsSync();
    }
    return SettingsSync.instance;
  }

  // 🔄 SYNCHRONISATION COMPLÈTE
  public async syncAllSettings(): Promise<void> {
    try {
      const settings = await this.settingsService.getSettings();
      
      // Synchroniser la configuration LLM
      await this.syncLLMConfig(settings.ai);
      
      // Synchroniser la configuration de sécurité
      await this.syncSecurityConfig(settings.security);
      
      // Synchroniser les paramètres généraux
      await this.syncGeneralConfig(settings.general);
      
      console.log('✅ Synchronisation des paramètres terminée');
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation des paramètres:', error);
      throw error;
    }
  }

  // 🤖 SYNCHRONISATION LLM
  private async syncLLMConfig(aiSettings: any): Promise<void> {
    // Actualiser la configuration LLM
    await this.llmConfigManager.refreshConfig();
    
    // Mettre à jour les variables d'environnement virtuelles
    if (typeof window !== 'undefined') {
      (window as any).__EBIOS_LLM_CONFIG__ = {
        provider: aiSettings.provider,
        selectedModel: aiSettings.selectedModel,
        apiKeys: aiSettings.apiKeys,
        modelSettings: aiSettings.modelSettings
      };
    }
    
    // Émettre un événement pour notifier les composants
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('llm-config-updated', {
        detail: aiSettings
      }));
    }
  }

  // 🔒 SYNCHRONISATION SÉCURITÉ
  private async syncSecurityConfig(securitySettings: any): Promise<void> {
    // Mettre à jour la configuration de sécurité globale
    if (typeof window !== 'undefined') {
      (window as any).__EBIOS_SECURITY_CONFIG__ = {
        mfaRequired: securitySettings.mfaRequired,
        sessionSettings: securitySettings.sessionSettings,
        passwordPolicy: securitySettings.passwordPolicy,
        auditSettings: securitySettings.auditSettings,
        encryptionSettings: securitySettings.encryptionSettings,
        monitoringSettings: securitySettings.monitoringSettings
      };
    }

    // Émettre un événement pour notifier les composants
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('security-config-updated', {
        detail: securitySettings
      }));
    }
  }

  // 🌐 SYNCHRONISATION GÉNÉRALE
  private async syncGeneralConfig(generalSettings: any): Promise<void> {
    // Mettre à jour la langue de l'interface
    if (generalSettings.language) {
      document.documentElement.lang = generalSettings.language;
      localStorage.setItem('ebios-language', generalSettings.language);
    }

    // Mettre à jour le thème
    if (generalSettings.theme) {
      const root = document.documentElement;
      root.setAttribute('data-theme', generalSettings.theme);
      
      if (generalSettings.theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', prefersDark);
      } else {
        root.classList.toggle('dark', generalSettings.theme === 'dark');
      }
    }

    // Mettre à jour le fuseau horaire
    if (generalSettings.timezone) {
      localStorage.setItem('ebios-timezone', generalSettings.timezone);
    }

    // Mettre à jour les notifications
    if (generalSettings.notifications) {
      localStorage.setItem('ebios-notifications', JSON.stringify(generalSettings.notifications));
    }

    // Émettre un événement pour notifier les composants
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('general-config-updated', {
        detail: generalSettings
      }));
    }
  }

  // 📡 ÉCOUTE DES CHANGEMENTS
  public startListening(): void {
    // Écouter les changements de paramètres
    if (typeof window !== 'undefined') {
      window.addEventListener('settings-changed', this.handleSettingsChange.bind(this));
      
      // Écouter les changements de thème système
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const currentTheme = localStorage.getItem('ebios-theme');
        if (currentTheme === 'auto') {
          document.documentElement.classList.toggle('dark', e.matches);
        }
      });
    }
  }

  // 🔄 GESTION DES CHANGEMENTS
  private async handleSettingsChange(event: CustomEvent): Promise<void> {
    const { section, settings } = event.detail;
    
    switch (section) {
      case 'ai':
        await this.syncLLMConfig(settings);
        break;
      case 'security':
        await this.syncSecurityConfig(settings);
        break;
      case 'general':
        await this.syncGeneralConfig(settings);
        break;
      case 'all':
        await this.syncAllSettings();
        break;
    }
  }

  // 🔧 UTILITAIRES DE RÉCUPÉRATION
  public getCurrentLLMConfig(): any {
    if (typeof window !== 'undefined') {
      return (window as any).__EBIOS_LLM_CONFIG__;
    }
    return null;
  }

  public getCurrentSecurityConfig(): any {
    if (typeof window !== 'undefined') {
      return (window as any).__EBIOS_SECURITY_CONFIG__;
    }
    return null;
  }

  // 🎯 MIGRATION DES PARAMÈTRES EXISTANTS
  public async migrateExistingSettings(): Promise<void> {
    try {
      // Récupérer les paramètres existants depuis localStorage ou autres sources
      const existingLLMConfig = localStorage.getItem('llm-config');
      const existingSecurityConfig = localStorage.getItem('security-config');
      
      if (existingLLMConfig || existingSecurityConfig) {
        const settings = await this.settingsService.getSettings();
        let hasChanges = false;

        // Migrer la configuration LLM
        if (existingLLMConfig) {
          try {
            const llmConfig = JSON.parse(existingLLMConfig);
            if (llmConfig.selectedModel) {
              settings.ai.selectedModel = llmConfig.selectedModel;
              hasChanges = true;
            }
            if (llmConfig.apiKeys) {
              settings.ai.apiKeys = { ...settings.ai.apiKeys, ...llmConfig.apiKeys };
              hasChanges = true;
            }
          } catch (error) {
            console.warn('Erreur lors de la migration de la configuration LLM:', error);
          }
        }

        // Migrer la configuration de sécurité
        if (existingSecurityConfig) {
          try {
            const securityConfig = JSON.parse(existingSecurityConfig);
            if (securityConfig.mfaRequired) {
              settings.security.mfaRequired = { ...settings.security.mfaRequired, ...securityConfig.mfaRequired };
              hasChanges = true;
            }
          } catch (error) {
            console.warn('Erreur lors de la migration de la configuration de sécurité:', error);
          }
        }

        // Sauvegarder les paramètres migrés
        if (hasChanges) {
          await this.settingsService.saveSettings(settings, 'migration');
          
          // Nettoyer les anciens paramètres
          localStorage.removeItem('llm-config');
          localStorage.removeItem('security-config');
          
          console.log('✅ Migration des paramètres existants terminée');
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la migration des paramètres:', error);
    }
  }

  // 🔄 SYNCHRONISATION PÉRIODIQUE
  public startPeriodicSync(intervalMinutes: number = 5): void {
    setInterval(async () => {
      try {
        await this.syncAllSettings();
      } catch (error) {
        console.error('Erreur lors de la synchronisation périodique:', error);
      }
    }, intervalMinutes * 60 * 1000);
  }

  // 🧪 VALIDATION DE LA SYNCHRONISATION
  public async validateSync(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Vérifier la configuration LLM
      const llmConfig = this.getCurrentLLMConfig();
      if (!llmConfig) {
        errors.push('Configuration LLM non synchronisée');
      }

      // Vérifier la configuration de sécurité
      const securityConfig = this.getCurrentSecurityConfig();
      if (!securityConfig) {
        errors.push('Configuration de sécurité non synchronisée');
      }

      // Vérifier les paramètres de langue
      const currentLang = document.documentElement.lang;
      const storedLang = localStorage.getItem('ebios-language');
      if (currentLang !== storedLang) {
        errors.push('Langue non synchronisée');
      }

      return {
        valid: errors.length === 0,
        errors
      };
    } catch (error) {
      errors.push(`Erreur de validation: ${error.message}`);
      return { valid: false, errors };
    }
  }
}
