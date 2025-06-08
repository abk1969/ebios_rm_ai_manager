import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import {
  X,
  Share2,
  Mail,
  Link,
  Copy,
  Users,
  Eye,
  Edit,
  Shield,
  Calendar,
  ExternalLink,
  Check,
  Download
} from 'lucide-react';
import Button from '../ui/button';
import type { Mission } from '../../types/ebios';

interface ShareMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: Mission;
  onShare: (method: ShareMethod, options: ShareOptions) => Promise<void>;
}

interface ShareOptions {
  permission: 'read' | 'write' | 'admin';
  expiresIn?: number; // en jours
  message?: string;
  allowDownload?: boolean;
  allowCopy?: boolean;
  email?: string;
}

type ShareMethod = 'email' | 'link' | 'linkedin' | 'teams' | 'slack';

const ShareMissionModal: React.FC<ShareMissionModalProps> = ({
  isOpen,
  onClose,
  mission,
  onShare
}) => {
  const [activeTab, setActiveTab] = useState<'email' | 'link' | 'external'>('email');
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState<string>('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareOptions, setShareOptions] = useState<ShareOptions>({
    permission: 'read',
    expiresIn: 7,
    message: '',
    allowDownload: false,
    allowCopy: false,
    email: ''
  });

  const permissions = [
    {
      id: 'read',
      name: 'Lecture seule',
      description: 'Peut consulter la mission et les workshops',
      icon: Eye,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 'write',
      name: 'Lecture et écriture',
      description: 'Peut consulter et modifier les données',
      icon: Edit,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'admin',
      name: 'Administration',
      description: 'Contrôle total sur la mission',
      icon: Shield,
      color: 'text-red-600 bg-red-100'
    }
  ];

  const expirationOptions = [
    { value: 1, label: '1 jour' },
    { value: 7, label: '1 semaine' },
    { value: 30, label: '1 mois' },
    { value: 90, label: '3 mois' },
    { value: 0, label: 'Jamais' }
  ];

  const handleShare = async (method: ShareMethod) => {
    setIsSharing(true);
    try {
      await onShare(method, shareOptions);
      
      if (method === 'link') {
        // Simuler la génération d'un lien
        const generatedLink = `${window.location.origin}/shared/${mission.id}?token=abc123`;
        setShareLink(generatedLink);
      }
      
      if (method === 'email') {
        onClose();
      }
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleExternalShare = (platform: 'linkedin' | 'teams' | 'slack') => {
    handleShare(platform);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Partager la Mission
              </Dialog.Title>
              <p className="text-sm text-gray-600 mt-1">
                {mission.name}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Onglets */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'email', label: 'Par email', icon: Mail },
              { id: 'link', label: 'Lien de partage', icon: Link },
              { id: 'external', label: 'Réseaux sociaux', icon: ExternalLink }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-6">
            {/* Configuration des permissions */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Niveau d'accès</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {permissions.map((permission) => {
                  const Icon = permission.icon;
                  return (
                    <div
                      key={permission.id}
                      className={`cursor-pointer rounded-lg border p-4 hover:bg-gray-50 ${
                        shareOptions.permission === permission.id
                          ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                          : 'border-gray-200'
                      }`}
                      onClick={() => setShareOptions(prev => ({ ...prev, permission: permission.id as any }))}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${permission.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{permission.name}</h4>
                          <p className="text-xs text-gray-500">{permission.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Options avancées */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Options avancées</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Expiration</span>
                  </div>
                  <select
                    value={shareOptions.expiresIn}
                    onChange={(e) => setShareOptions(prev => ({ ...prev, expiresIn: parseInt(e.target.value) }))}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1"
                  >
                    {expirationOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Copy className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Autoriser la copie</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShareOptions(prev => ({ ...prev, allowCopy: !prev.allowCopy }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      shareOptions.allowCopy ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        shareOptions.allowCopy ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Download className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Autoriser le téléchargement</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShareOptions(prev => ({ ...prev, allowDownload: !prev.allowDownload }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      shareOptions.allowDownload ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        shareOptions.allowDownload ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Contenu spécifique à l'onglet */}
            {activeTab === 'email' && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Partage par email</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      value={shareOptions.email}
                      onChange={(e) => setShareOptions(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="exemple@domaine.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message personnalisé (optionnel)
                    </label>
                    <textarea
                      value={shareOptions.message}
                      onChange={(e) => setShareOptions(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Ajoutez un message pour expliquer le contexte..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'link' && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Lien de partage</h3>
                {shareLink ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={shareLink}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        {linkCopied ? (
                          <>
                            <Check className="h-4 w-4 text-green-600" />
                            <span>Copié</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span>Copier</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Ce lien expire le {new Date(Date.now() + (shareOptions.expiresIn || 7) * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    Cliquez sur "Générer le lien" pour créer un lien de partage sécurisé.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'external' && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Partager sur les réseaux</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600 hover:bg-blue-700' },
                    { id: 'teams', name: 'Microsoft Teams', color: 'bg-purple-600 hover:bg-purple-700' },
                    { id: 'slack', name: 'Slack', color: 'bg-green-600 hover:bg-green-700' }
                  ].map((platform) => (
                    <Button
                      key={platform.id}
                      onClick={() => handleExternalShare(platform.id as any)}
                      className={`${platform.color} text-white`}
                      disabled={isSharing}
                    >
                      {platform.name}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Un lien de partage sera automatiquement généré et ouvert dans une nouvelle fenêtre.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isSharing}
            >
              Annuler
            </Button>
            {activeTab === 'email' && (
              <Button
                onClick={() => handleShare('email')}
                disabled={isSharing || !shareOptions.email}
                className="flex items-center space-x-2"
              >
                {isSharing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Envoi...</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4" />
                    <span>Envoyer l'invitation</span>
                  </>
                )}
              </Button>
            )}
            {activeTab === 'link' && (
              <Button
                onClick={() => handleShare('link')}
                disabled={isSharing}
                className="flex items-center space-x-2"
              >
                {isSharing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Génération...</span>
                  </>
                ) : (
                  <>
                    <Link className="h-4 w-4" />
                    <span>Générer le lien</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ShareMissionModal;
