/**
 * ⚙️ PAGE DE PARAMÈTRES SÉCURISÉE
 * Interface complète de configuration pour administrateurs
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Shield,
  Bot,
  Key,
  Globe,
  Bell,
  Database,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Save,
  RefreshCw,
  TestTube,
  Info
} from 'lucide-react';
import { SettingsService, type AppSettings, type LLMModel } from '@/services/settings/SettingsService';
import { ModelUpdater } from '@/services/settings/ModelUpdater';
import { useAuth } from '@/contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [testingConnection, setTestingConnection] = useState<string | null>(null);
  const [connectionResults, setConnectionResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [availableModels, setAvailableModels] = useState<LLMModel[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [updatingModels, setUpdatingModels] = useState(false);

  const settingsService = SettingsService.getInstance();
  const modelUpdater = ModelUpdater.getInstance();

  useEffect(() => {
    loadSettings();
    loadAvailableModels();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('🔄 Chargement des paramètres...');
      setLoading(true);
      setErrors([]);

      const appSettings = await settingsService.getSettings();
      setSettings(appSettings);

      console.log('✅ Paramètres chargés avec succès:', {
        general: !!appSettings.general,
        security: !!appSettings.security,
        ai: !!appSettings.ai,
        lastUpdated: appSettings.lastUpdated
      });

      setSuccessMessage('✅ Paramètres actualisés !');
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('❌ Erreur lors du chargement des paramètres:', error);
      setErrors([`Erreur lors du chargement: ${(error as Error).message}`]);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableModels = () => {
    const models = settingsService.getAvailableLLMModels();
    setAvailableModels(models);
  };

  const updateAvailableModels = async () => {
    try {
      setUpdatingModels(true);
      setErrors([]);

      const result = await modelUpdater.updateAvailableModels();

      if (result.updated) {
        loadAvailableModels();
        setSuccessMessage(`${result.newModels} nouveaux modèles trouvés et mis à jour`);
      } else {
        setSuccessMessage('Aucun nouveau modèle trouvé');
      }

      if (result.errors.length > 0) {
        setErrors(result.errors);
      }

      // Masquer le message après 3 secondes
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (error) {
      console.error('Erreur lors de la mise à jour des modèles:', error);
      setErrors(['Erreur lors de la mise à jour des modèles']);
    } finally {
      setUpdatingModels(false);
    }
  };

  const handleSaveSettings = async () => {
    console.log('🔄 Début de la sauvegarde depuis l\'interface');
    console.log('🔍 État détaillé:', {
      settings: !!settings,
      user: !!user,
      userDetails: user ? {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      } : null
    });

    if (!settings || !user) {
      console.error('❌ Paramètres ou utilisateur manquant', {
        settings: !!settings,
        user: !!user,
        userObject: user
      });
      setErrors(['Erreur: Paramètres ou utilisateur manquant. Veuillez vous reconnecter.']);
      return;
    }

    try {
      setSaving(true);
      setErrors([]);
      setSuccessMessage('');

      console.log('📋 Paramètres à sauvegarder:', {
        general: settings.general,
        security: settings.security,
        ai: { ...settings.ai, apiKeys: Object.keys(settings.ai.apiKeys || {}) }
      });

      // Validation des paramètres
      const validation = settingsService.validateSettings(settings);
      console.log('✅ Résultat de la validation:', validation);

      if (!validation.valid) {
        console.warn('⚠️ Validation échouée:', validation.errors);
        setErrors(validation.errors);
        return;
      }

      // Sauvegarde
      console.log('💾 Appel de saveSettings...');
      await settingsService.saveSettings(settings, user.uid);
      console.log('✅ Sauvegarde réussie');

      setSuccessMessage('✅ Paramètres sauvegardés avec succès !');

      // Masquer le message après 5 secondes
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      const errorMessage = `Erreur lors de la sauvegarde: ${(error as Error).message}`;
      setErrors([errorMessage]);
    } finally {
      setSaving(false);
    }
  };

  const handleTestApiConnection = async (provider: string, apiKey: string) => {
    if (!apiKey.trim()) {
      setConnectionResults(prev => ({
        ...prev,
        [provider]: { success: false, message: 'Clé API requise' }
      }));
      return;
    }

    try {
      setTestingConnection(provider);
      const result = await settingsService.testApiConnection(provider, apiKey);
      setConnectionResults(prev => ({
        ...prev,
        [provider]: result
      }));
    } catch (error) {
      setConnectionResults(prev => ({
        ...prev,
        [provider]: { success: false, message: 'Erreur de test de connexion' }
      }));
    } finally {
      setTestingConnection(null);
    }
  };

  const updateSettings = (section: keyof AppSettings, field: string, value: any) => {
    if (!settings) return;

    setSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...(prev[section] as any),
          [field]: value
        }
      };
    });
  };

  const updateNestedSettings = (section: keyof AppSettings, subsection: string, field: string, value: any) => {
    if (!settings) return;

    setSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...(prev[section] as any),
          [subsection]: {
            ...((prev[section] as any)[subsection] || {}),
            [field]: value
          }
        }
      };
    });
  };

  const toggleApiKeyVisibility = (provider: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Chargement des paramètres...</span>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-8">
        <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <p className="text-lg text-gray-600">Impossible de charger les paramètres</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
            <p className="text-gray-600">Configuration de l'application EBIOS AI Manager</p>
            {user && (
              <p className="text-sm text-green-600">
                ✅ Connecté en tant que: {user.displayName || user.email}
              </p>
            )}
            {!user && (
              <p className="text-sm text-red-600">
                ❌ Utilisateur non connecté
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={loadSettings}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>

          <Button
            onClick={handleSaveSettings}
            disabled={saving}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className={`h-4 w-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>

          {/* Boutons de test pour déboguer */}
          <div className="flex items-center gap-2">
            <Button
              onClick={async () => {
                if (!user) {
                  alert('Utilisateur non connecté');
                  return;
                }

                console.log('🧪 Test de connectivité Firebase...');
                const result = await settingsService.testSaveSettings(user.uid);

                if (result.success) {
                  alert('✅ Test Firebase réussi ! Vérifiez la console pour les détails.');
                } else {
                  alert(`❌ Test Firebase échoué: ${result.message}`);
                }
              }}
              variant="outline"
              size="sm"
              className="border-green-500 text-green-600 hover:bg-green-50"
            >
              🧪 Test Firebase
            </Button>

            <Button
              onClick={() => {
                console.log('🔍 État actuel de l\'application:', {
                  settings: !!settings,
                  user: !!user,
                  userDetails: user ? {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    emailVerified: user.emailVerified
                  } : null,
                  saving,
                  loading,
                  errors: errors.length,
                  successMessage: !!successMessage,
                  activeTab,
                  availableModels: availableModels.length
                });

                const message = user
                  ? `✅ Utilisateur connecté: ${user.email}\nUID: ${user.uid}`
                  : '❌ Aucun utilisateur connecté';

                alert(`🔍 État vérifié !\n\n${message}\n\nConsultez la console pour plus de détails.`);
              }}
              variant="outline"
              size="sm"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
            >
              🔍 État App
            </Button>

            <Button
              onClick={() => {
                if (user) {
                  console.log('👤 Détails utilisateur complets:', {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    emailVerified: user.emailVerified,
                    photoURL: user.photoURL,
                    createdAt: user.createdAt
                  });
                  alert(`👤 Utilisateur: ${user.email}\nUID: ${user.uid}\nVérifié: ${user.emailVerified ? 'Oui' : 'Non'}`);
                } else {
                  alert('❌ Aucun utilisateur connecté');
                }
              }}
              variant="outline"
              size="sm"
              className="border-purple-500 text-purple-600 hover:bg-purple-50"
            >
              👤 User Info
            </Button>
          </div>
        </div>
      </div>

      {/* Messages d'erreur et de succès */}
      {errors.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <div className="text-red-800">
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {successMessage && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <div className="text-green-800">
              {successMessage}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Statut des boutons pour débogage */}
      {(loading || saving || updatingModels || testingConnection) && (
        <Alert className="border-blue-200 bg-blue-50">
          <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
          <AlertDescription>
            <div className="text-blue-800">
              <div className="flex items-center gap-4 text-sm">
                {loading && <span>🔄 Chargement...</span>}
                {saving && <span>💾 Sauvegarde...</span>}
                {updatingModels && <span>🤖 Mise à jour des modèles...</span>}
                {testingConnection && <span>🧪 Test de connexion {testingConnection}...</span>}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Onglets de configuration */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Général
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            IA & Modèles
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Avancé
          </TabsTrigger>
        </TabsList>

        {/* Onglet Général */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Paramètres Généraux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'Organisation
                  </label>
                  <input
                    type="text"
                    value={settings.general.organizationName}
                    onChange={(e) => updateSettings('general', 'organizationName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nom de votre organisation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Langue
                  </label>
                  <select
                    value={settings.general.language}
                    onChange={(e) => updateSettings('general', 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuseau Horaire
                  </label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Europe/Paris">Europe/Paris (CET)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thème
                  </label>
                  <select
                    value={settings.general.theme}
                    onChange={(e) => updateSettings('general', 'theme', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                    <option value="auto">Automatique</option>
                  </select>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-500" />
                  Notifications
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.general.notifications.email}
                      onChange={(e) => updateNestedSettings('general', 'notifications', 'email', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Notifications par email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.general.notifications.browser}
                      onChange={(e) => updateNestedSettings('general', 'notifications', 'browser', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Notifications navigateur</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.general.notifications.slack}
                      onChange={(e) => updateNestedSettings('general', 'notifications', 'slack', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Notifications Slack</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Paramètres de Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* MFA par rôle */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-500" />
                  Authentification Multifacteur (MFA)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(settings.security.mfaRequired).map(([role, required]) => (
                    <label key={role} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-900 capitalize">{role}</span>
                        <p className="text-sm text-gray-500">
                          {role === 'admin' && 'Administrateurs système'}
                          {role === 'auditor' && 'Auditeurs de sécurité'}
                          {role === 'analyst' && 'Analystes EBIOS RM'}
                          {role === 'user' && 'Utilisateurs standard'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={required}
                        onChange={(e) => updateNestedSettings('security', 'mfaRequired', role, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* Politique de mot de passe */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Key className="h-5 w-5 text-purple-500" />
                  Politique de Mot de Passe
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longueur minimale
                    </label>
                    <input
                      type="number"
                      min="8"
                      max="128"
                      value={settings.security.passwordPolicy.minLength}
                      onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tentatives avant verrouillage
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="10"
                      value={settings.security.passwordPolicy.lockoutAttempts}
                      onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'lockoutAttempts', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée de verrouillage (minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="60"
                      value={settings.security.passwordPolicy.lockoutDuration}
                      onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'lockoutDuration', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Âge maximum (jours)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="365"
                      value={settings.security.passwordPolicy.maxAge}
                      onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'maxAge', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <h5 className="font-medium text-gray-900">Exigences de complexité</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.passwordPolicy.requireUppercase}
                        onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'requireUppercase', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Majuscules requises</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.passwordPolicy.requireLowercase}
                        onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'requireLowercase', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Minuscules requises</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.passwordPolicy.requireNumbers}
                        onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'requireNumbers', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Chiffres requis</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.passwordPolicy.requireSpecialChars}
                        onChange={(e) => updateNestedSettings('security', 'passwordPolicy', 'requireSpecialChars', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Caractères spéciaux requis</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet IA & Modèles */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-green-600" />
                Configuration IA et Modèles LLM
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Provider et modèle */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-500" />
                  Sélection du Modèle
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Provider IA
                    </label>
                    <select
                      value={settings.ai.provider}
                      onChange={(e) => updateSettings('ai', 'provider', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="openrouter">OpenRouter (Recommandé)</option>
                      <option value="direct">Accès Direct</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      OpenRouter offre un accès unifié à tous les modèles
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Modèle LLM Actif
                      </label>
                      <Button
                        onClick={updateAvailableModels}
                        disabled={updatingModels}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        {updatingModels ? (
                          <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                          <RefreshCw className="h-3 w-3 mr-1" />
                        )}
                        Actualiser
                      </Button>
                    </div>
                    <select
                      value={settings.ai.selectedModel}
                      onChange={(e) => updateSettings('ai', 'selectedModel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      {availableModels.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name} - {model.provider}
                          {model.id === 'google/gemini-2.5-flash-preview-05-20' && ' (Par défaut)'}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      {availableModels.length} modèles disponibles
                    </p>
                  </div>
                </div>

                {/* Informations sur le modèle sélectionné */}
                {(() => {
                  const selectedModel = availableModels.find(m => m.id === settings.ai.selectedModel);
                  return selectedModel ? (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <h5 className="font-medium text-blue-900">{selectedModel.name}</h5>
                          <p className="text-sm text-blue-700 mt-1">{selectedModel.description}</p>
                          <div className="mt-2 flex flex-wrap gap-4 text-xs text-blue-600">
                            <span>Max tokens: {selectedModel.maxTokens.toLocaleString()}</span>
                            <span>Coût: ${selectedModel.costPer1kTokens}/1k tokens</span>
                            <span>Capacités: {selectedModel.capabilities.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Clés API */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Key className="h-5 w-5 text-purple-500" />
                  Clés API
                </h4>

                <div className="space-y-4">
                  {/* OpenRouter */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">OpenRouter</h5>
                        <p className="text-sm text-gray-500">Accès unifié à tous les modèles LLM</p>
                      </div>
                      <Badge variant={settings.ai.apiKeys.openrouter ? 'default' : 'secondary'}>
                        {settings.ai.apiKeys.openrouter ? 'Configuré' : 'Non configuré'}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type={showApiKeys.openrouter ? 'text' : 'password'}
                          value={settings.ai.apiKeys.openrouter || ''}
                          onChange={(e) => updateNestedSettings('ai', 'apiKeys', 'openrouter', e.target.value)}
                          placeholder="sk-or-..."
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => toggleApiKeyVisibility('openrouter')}
                          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                        >
                          {showApiKeys.openrouter ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestApiConnection('openrouter', settings.ai.apiKeys.openrouter || '')}
                        disabled={testingConnection === 'openrouter' || !settings.ai.apiKeys.openrouter}
                      >
                        {testingConnection === 'openrouter' ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <TestTube className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {connectionResults.openrouter && (
                      <div className={`mt-2 p-2 rounded text-sm ${
                        connectionResults.openrouter.success
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        <div className="flex items-center gap-2">
                          {connectionResults.openrouter.success ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          {connectionResults.openrouter.message}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Autres providers */}
                  {[
                    { key: 'gemini', name: 'Google Gemini', placeholder: 'AIza...' },
                    { key: 'anthropic', name: 'Anthropic Claude', placeholder: 'sk-ant-...' },
                    { key: 'mistral', name: 'Mistral AI', placeholder: 'sk-...' },
                    { key: 'openai', name: 'OpenAI', placeholder: 'sk-...' }
                  ].map((provider) => (
                    <div key={provider.key} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h5 className="font-medium text-gray-900">{provider.name}</h5>
                          <p className="text-sm text-gray-500">Accès direct au provider</p>
                        </div>
                        <Badge variant={settings.ai.apiKeys[provider.key as keyof typeof settings.ai.apiKeys] ? 'default' : 'secondary'}>
                          {settings.ai.apiKeys[provider.key as keyof typeof settings.ai.apiKeys] ? 'Configuré' : 'Non configuré'}
                        </Badge>
                      </div>

                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <input
                            type={showApiKeys[provider.key] ? 'text' : 'password'}
                            value={settings.ai.apiKeys[provider.key as keyof typeof settings.ai.apiKeys] || ''}
                            onChange={(e) => updateNestedSettings('ai', 'apiKeys', provider.key, e.target.value)}
                            placeholder={provider.placeholder}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => toggleApiKeyVisibility(provider.key)}
                            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                          >
                            {showApiKeys[provider.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paramètres du modèle */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-orange-500" />
                  Paramètres du Modèle
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Température ({settings.ai.modelSettings.temperature})
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={settings.ai.modelSettings.temperature}
                      onChange={(e) => updateNestedSettings('ai', 'modelSettings', 'temperature', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Précis (0)</span>
                      <span>Créatif (2)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tokens Maximum
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="8000"
                      value={settings.ai.modelSettings.maxTokens}
                      onChange={(e) => updateNestedSettings('ai', 'modelSettings', 'maxTokens', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Top P ({settings.ai.modelSettings.topP})
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.ai.modelSettings.topP}
                      onChange={(e) => updateNestedSettings('ai', 'modelSettings', 'topP', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modèle de Secours
                    </label>
                    <select
                      value={settings.ai.fallbackModel || ''}
                      onChange={(e) => updateSettings('ai', 'fallbackModel', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Aucun</option>
                      {availableModels.filter(m => m.id !== settings.ai.selectedModel).map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Avancé */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-gray-600" />
                Paramètres Avancés
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Gestion des sessions */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-500" />
                  Gestion des Sessions
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Durée maximale (minutes)
                    </label>
                    <input
                      type="number"
                      min="30"
                      max="1440"
                      value={settings.security.sessionSettings.maxDuration}
                      onChange={(e) => updateNestedSettings('security', 'sessionSettings', 'maxDuration', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeout inactivité (minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="120"
                      value={settings.security.sessionSettings.inactivityTimeout}
                      onChange={(e) => updateNestedSettings('security', 'sessionSettings', 'inactivityTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sessions concurrentes
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={settings.security.sessionSettings.concurrentSessions}
                      onChange={(e) => updateNestedSettings('security', 'sessionSettings', 'concurrentSessions', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.security.sessionSettings.requireMfaForSensitive}
                      onChange={(e) => updateNestedSettings('security', 'sessionSettings', 'requireMfaForSensitive', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Exiger MFA pour les actions sensibles</span>
                  </label>
                </div>
              </div>

              {/* Audit et monitoring */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-500" />
                  Audit et Monitoring
                </h4>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rétention des logs (jours)
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="2555"
                        value={settings.security.auditSettings.retentionDays}
                        onChange={(e) => updateNestedSettings('security', 'auditSettings', 'retentionDays', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Recommandé: 2555 jours (7 ans) pour conformité ANSSI</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rotation des clés (jours)
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="365"
                        value={settings.security.encryptionSettings.keyRotationDays}
                        onChange={(e) => updateNestedSettings('security', 'encryptionSettings', 'keyRotationDays', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.auditSettings.enabled}
                        onChange={(e) => updateNestedSettings('security', 'auditSettings', 'enabled', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Audit activé</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.auditSettings.realTimeAlerts}
                        onChange={(e) => updateNestedSettings('security', 'auditSettings', 'realTimeAlerts', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Alertes temps réel</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.monitoringSettings.anomalyDetection}
                        onChange={(e) => updateNestedSettings('security', 'monitoringSettings', 'anomalyDetection', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Détection d'anomalies</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.security.encryptionSettings.enabled}
                        onChange={(e) => updateNestedSettings('security', 'encryptionSettings', 'enabled', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Chiffrement activé</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Seuils d'alerte */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Seuils d'Alerte
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Connexions échouées
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="20"
                      value={settings.security.monitoringSettings.alertThresholds.failedLogins}
                      onChange={(e) => updateNestedSettings('security', 'monitoringSettings', 'alertThresholds', {
                        ...settings.security.monitoringSettings.alertThresholds,
                        failedLogins: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activité suspecte
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="50"
                      value={settings.security.monitoringSettings.alertThresholds.suspiciousActivity}
                      onChange={(e) => updateNestedSettings('security', 'monitoringSettings', 'alertThresholds', {
                        ...settings.security.monitoringSettings.alertThresholds,
                        suspiciousActivity: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exfiltration de données
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={settings.security.monitoringSettings.alertThresholds.dataExfiltration}
                      onChange={(e) => updateNestedSettings('security', 'monitoringSettings', 'alertThresholds', {
                        ...settings.security.monitoringSettings.alertThresholds,
                        dataExfiltration: parseInt(e.target.value)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Rétention des données */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-500" />
                  Rétention des Données
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Missions (jours)
                    </label>
                    <input
                      type="number"
                      min="365"
                      max="2555"
                      value={settings.general.dataRetention.missions}
                      onChange={(e) => updateNestedSettings('general', 'dataRetention', 'missions', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rapports (jours)
                    </label>
                    <input
                      type="number"
                      min="365"
                      max="2555"
                      value={settings.general.dataRetention.reports}
                      onChange={(e) => updateNestedSettings('general', 'dataRetention', 'reports', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logs (jours)
                    </label>
                    <input
                      type="number"
                      min="365"
                      max="2555"
                      value={settings.general.dataRetention.logs}
                      onChange={(e) => updateNestedSettings('general', 'dataRetention', 'logs', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Recommandé: 2555 jours (7 ans) pour conformité réglementaire
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Informations de version */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              Version: {settings.version} |
              Dernière mise à jour: {settings.lastUpdated.toLocaleString()} |
              Par: {settings.updatedBy}
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Sécurisé ANSSI</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;