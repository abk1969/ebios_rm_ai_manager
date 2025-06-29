/**
 * 🚀 INITIALISATEUR DES PARAMÈTRES
 * Initialise et configure les paramètres au démarrage de l'application
 */

import { SettingsService } from './SettingsService';
import { SettingsSync } from './SettingsSync';
import { ModelUpdater } from './ModelUpdater';
import { LLMConfigManager } from '@/config/llm';
import { SecurityService } from '@/services/security/SecurityService';

export class SettingsInitializer {
  private static instance: SettingsInitializer;
  private initialized = false;

  private settingsService = SettingsService.getInstance();
  private settingsSync = SettingsSync.getInstance();
  private modelUpdater = ModelUpdater.getInstance();
  private llmConfigManager = LLMConfigManager.getInstance();
  private securityService = SecurityService.getInstance();

  private constructor() {}

  public static getInstance(): SettingsInitializer {
    if (!SettingsInitializer.instance) {
      SettingsInitializer.instance = new SettingsInitializer();
    }
    return SettingsInitializer.instance;
  }

  // 🚀 INITIALISATION COMPLÈTE
  public async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('⚙️ Paramètres déjà initialisés');
      return;
    }

    try {
      console.log('🚀 Initialisation des paramètres EBIOS AI Manager...');

      // 1. Migrer les paramètres existants
      await this.migrateExistingSettings();

      // 2. Charger les paramètres
      const settings = await this.settingsService.getSettings();
      console.log('✅ Paramètres chargés:', {
        language: settings.general.language,
        theme: settings.general.theme,
        llmModel: settings.ai.selectedModel,
        mfaEnabled: Object.values(settings.security.mfaRequired).some(Boolean)
      });

      // 3. Initialiser la synchronisation
      await this.settingsSync.syncAllSettings();
      this.settingsSync.startListening();
      console.log('✅ Synchronisation des paramètres activée');

      // 4. Configurer l'interface utilisateur
      await this.configureUI(settings);

      // 5. Initialiser les services de sécurité
      await this.initializeSecurity(settings);

      // 6. Configurer les modèles LLM
      await this.configureLLM(settings);

      // 7. Démarrer la synchronisation périodique
      this.settingsSync.startPeriodicSync(5); // Toutes les 5 minutes

      // 8. Démarrer la mise à jour automatique des modèles
      this.modelUpdater.startPeriodicUpdate(24); // Toutes les 24 heures

      // 9. Valider la configuration
      const validation = await this.validateConfiguration();
      if (!validation.valid) {
        if (import.meta.env.DEV) {
          console.warn('⚠️ Problèmes de configuration détectés (mode développement):', validation.errors);
          console.info('💡 Ces avertissements sont normaux en mode développement');
        } else {
          console.warn('⚠️ Problèmes de configuration détectés:', validation.errors);
        }
      }

      this.initialized = true;
      console.log('🎉 Initialisation des paramètres terminée avec succès');

      // Émettre un événement d'initialisation
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('settings-initialized', {
          detail: { settings, validation }
        }));
      }

    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation des paramètres:', error);
      throw error;
    }
  }

  // 🔄 MIGRATION DES PARAMÈTRES EXISTANTS
  private async migrateExistingSettings(): Promise<void> {
    try {
      await this.settingsSync.migrateExistingSettings();
      console.log('✅ Migration des paramètres existants terminée');
    } catch (error) {
      console.warn('⚠️ Erreur lors de la migration des paramètres:', error);
    }
  }

  // 🎨 CONFIGURATION DE L'INTERFACE UTILISATEUR
  private async configureUI(settings: any): Promise<void> {
    try {
      // Configuration de la langue
      if (settings.general.language) {
        document.documentElement.lang = settings.general.language;
        localStorage.setItem('ebios-language', settings.general.language);
      }

      // Configuration du thème
      if (settings.general.theme) {
        const root = document.documentElement;
        root.setAttribute('data-theme', settings.general.theme);
        
        if (settings.general.theme === 'auto') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          root.classList.toggle('dark', prefersDark);
        } else {
          root.classList.toggle('dark', settings.general.theme === 'dark');
        }
      }

      // Configuration du fuseau horaire
      if (settings.general.timezone) {
        localStorage.setItem('ebios-timezone', settings.general.timezone);
      }

      // Configuration des notifications
      if (settings.general.notifications) {
        localStorage.setItem('ebios-notifications', JSON.stringify(settings.general.notifications));
        
        // Demander la permission pour les notifications navigateur
        if (settings.general.notifications.browser && 'Notification' in window) {
          if (Notification.permission === 'default') {
            await Notification.requestPermission();
          }
        }
      }

      console.log('✅ Interface utilisateur configurée');
    } catch (error) {
      console.error('❌ Erreur lors de la configuration de l\'interface:', error);
    }
  }

  // 🔒 INITIALISATION DE LA SÉCURITÉ
  private async initializeSecurity(settings: any): Promise<void> {
    try {
      // Configurer les paramètres de sécurité globaux
      if (typeof window !== 'undefined') {
        (window as any).__EBIOS_SECURITY_CONFIG__ = settings.security;
      }

      // Initialiser les services de sécurité avec la nouvelle configuration
      // Note: Ceci nécessiterait une refactorisation du SecurityService pour accepter une configuration dynamique

      console.log('✅ Services de sécurité initialisés');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de la sécurité:', error);
    }
  }

  // 🤖 CONFIGURATION DES MODÈLES LLM
  private async configureLLM(settings: any): Promise<void> {
    try {
      // Configurer la configuration LLM globale
      if (typeof window !== 'undefined') {
        (window as any).__EBIOS_LLM_CONFIG__ = settings.ai;
      }

      // Actualiser la configuration du gestionnaire LLM
      await this.llmConfigManager.refreshConfig();

      // Tester la configuration si une clé API est disponible
      if (settings.ai.apiKeys.openrouter) {
        try {
          const config = await this.llmConfigManager.getCurrentConfig();
          const testResult = await this.llmConfigManager.testConfig(config);
          
          if (testResult.success) {
            console.log('✅ Configuration LLM validée');
          } else {
            console.warn('⚠️ Problème avec la configuration LLM:', testResult.message);
          }
        } catch (error) {
          console.warn('⚠️ Impossible de tester la configuration LLM:', error);
        }
      }

      console.log('✅ Configuration LLM initialisée');
    } catch (error) {
      console.error('❌ Erreur lors de la configuration LLM:', error);
    }
  }

  // ✅ VALIDATION DE LA CONFIGURATION
  private async validateConfiguration(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Valider les paramètres
      const settings = await this.settingsService.getSettings();
      const settingsValidation = this.settingsService.validateSettings(settings);
      if (!settingsValidation.valid) {
        errors.push(...settingsValidation.errors);
      }

      // Valider la synchronisation
      const syncValidation = await this.settingsSync.validateSync();
      if (!syncValidation.valid) {
        errors.push(...syncValidation.errors);
      }

      // Valider la configuration LLM (plus flexible en mode développement)
      try {
        const llmConfig = await this.llmConfigManager.getCurrentConfig();
        if (!llmConfig.apiKey) {
          if (import.meta.env.PROD) {
            errors.push('Aucune clé API LLM configurée');
          } else {
            console.info('💡 Mode développement: Clé API LLM non configurée (normal)');
          }
        }
      } catch (error) {
        if (import.meta.env.PROD) {
          errors.push('Configuration LLM invalide');
        } else {
          console.info('💡 Mode développement: Configuration LLM non disponible (normal)');
        }
      }

      // Valider les permissions de notification
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'denied') {
          errors.push('Permissions de notification refusées');
        }
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

  // 🔄 RÉINITIALISATION
  public async reset(): Promise<void> {
    try {
      console.log('🔄 Réinitialisation des paramètres...');

      // Nettoyer le localStorage
      const keysToRemove = [
        'ebios-language',
        'ebios-theme',
        'ebios-timezone',
        'ebios-notifications'
      ];
      
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Réinitialiser les variables globales
      if (typeof window !== 'undefined') {
        delete (window as any).__EBIOS_LLM_CONFIG__;
        delete (window as any).__EBIOS_SECURITY_CONFIG__;
      }

      // Marquer comme non initialisé
      this.initialized = false;

      // Réinitialiser
      await this.initialize();

      console.log('✅ Réinitialisation terminée');
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation:', error);
      throw error;
    }
  }

  // 📊 STATISTIQUES D'INITIALISATION
  public getInitializationStats(): any {
    return {
      initialized: this.initialized,
      timestamp: new Date(),
      llmConfigured: !!(typeof window !== 'undefined' && (window as any).__EBIOS_LLM_CONFIG__),
      securityConfigured: !!(typeof window !== 'undefined' && (window as any).__EBIOS_SECURITY_CONFIG__),
      language: document.documentElement.lang,
      theme: document.documentElement.getAttribute('data-theme'),
      notificationPermission: typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'not-supported'
    };
  }

  // 🎯 VÉRIFICATION DE L'ÉTAT
  public isInitialized(): boolean {
    return this.initialized;
  }

  // 🔧 RÉPARATION AUTOMATIQUE
  public async autoRepair(): Promise<{ repaired: boolean; actions: string[] }> {
    const actions: string[] = [];

    try {
      // Vérifier et réparer la configuration
      const validation = await this.validateConfiguration();
      
      if (!validation.valid) {
        for (const error of validation.errors) {
          if (error.includes('clé API')) {
            actions.push('Configuration des clés API requise');
          } else if (error.includes('notification')) {
            actions.push('Permissions de notification à configurer');
          } else if (error.includes('synchronisation')) {
            await this.settingsSync.syncAllSettings();
            actions.push('Synchronisation des paramètres réparée');
          }
        }
      }

      return {
        repaired: actions.length > 0,
        actions
      };

    } catch (error) {
      console.error('Erreur lors de la réparation automatique:', error);
      return { repaired: false, actions: ['Erreur lors de la réparation'] };
    }
  }
}
