import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { 
  X, 
  Archive, 
  AlertTriangle, 
  Calendar,
  HardDrive,
  Users,
  FileText,
  Clock,
  CheckCircle,
  Info
} from 'lucide-react';
import Button from '../ui/button';
import type { Mission } from '../../types/ebios';

interface ArchiveMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: Mission;
  onArchive: (options: ArchiveOptions) => Promise<void>;
}

interface ArchiveOptions {
  reason: string;
  retentionPeriod?: number; // en mois
  deleteAfterRetention?: boolean;
  createBackup?: boolean;
  notifyStakeholders?: boolean;
}

const ArchiveMissionModal: React.FC<ArchiveMissionModalProps> = ({
  isOpen,
  onClose,
  mission,
  onArchive
}) => {
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveOptions, setArchiveOptions] = useState<ArchiveOptions>({
    reason: '',
    retentionPeriod: 24,
    deleteAfterRetention: false,
    createBackup: true,
    notifyStakeholders: true
  });

  const archiveReasons = [
    {
      id: 'completed',
      label: 'Mission terminée',
      description: 'La mission EBIOS RM est complétée et validée'
    },
    {
      id: 'cancelled',
      label: 'Mission annulée',
      description: 'La mission a été annulée avant completion'
    },
    {
      id: 'superseded',
      label: 'Mission remplacée',
      description: 'Une nouvelle version de la mission a été créée'
    },
    {
      id: 'inactive',
      label: 'Mission inactive',
      description: 'La mission n\'est plus active mais peut être consultée'
    },
    {
      id: 'compliance',
      label: 'Archivage réglementaire',
      description: 'Archivage pour conformité réglementaire'
    },
    {
      id: 'other',
      label: 'Autre raison',
      description: 'Spécifiez une raison personnalisée'
    }
  ];

  const retentionPeriods = [
    { value: 12, label: '1 an', description: 'Conservation courte durée' },
    { value: 24, label: '2 ans', description: 'Conservation standard' },
    { value: 36, label: '3 ans', description: 'Conservation étendue' },
    { value: 60, label: '5 ans', description: 'Conservation réglementaire' },
    { value: 120, label: '10 ans', description: 'Conservation longue durée' },
    { value: 0, label: 'Indéfinie', description: 'Pas de suppression automatique' }
  ];

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      await onArchive(archiveOptions);
      onClose();
    } catch (error) {
      console.error('Archive failed:', error);
    } finally {
      setIsArchiving(false);
    }
  };

  const getMissionStats = () => {
    const completionPercentage = mission.ebiosCompliance?.completionPercentage || 0;
    const workshopsCompleted = mission.ebiosCompliance?.validatedWorkshops?.length || 0;
    const lastActivity = new Date(mission.updatedAt).toLocaleDateString('fr-FR');
    
    return { completionPercentage, workshopsCompleted, lastActivity };
  };

  const stats = getMissionStats();

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
                Archiver la Mission
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

          {/* Avertissement */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-900">Attention</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  L'archivage déplacera cette mission vers les archives. Elle ne sera plus visible 
                  dans la liste principale mais restera accessible dans la section archives.
                </p>
              </div>
            </div>
          </div>

          {/* Informations de la mission */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Informations de la mission</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.completionPercentage}%</div>
                <div className="text-xs text-gray-500">Completion</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.workshopsCompleted}/5</div>
                <div className="text-xs text-gray-500">Workshops</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{mission.assignedTo?.length || 0}</div>
                <div className="text-xs text-gray-500">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-gray-600">{stats.lastActivity}</div>
                <div className="text-xs text-gray-500">Dernière activité</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Raison de l'archivage */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Raison de l'archivage</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {archiveReasons.map((reason) => (
                  <div
                    key={reason.id}
                    className={`cursor-pointer rounded-lg border p-3 hover:bg-gray-50 ${
                      archiveOptions.reason === reason.id
                        ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setArchiveOptions(prev => ({ ...prev, reason: reason.id }))}
                  >
                    <h4 className="text-sm font-medium text-gray-900">{reason.label}</h4>
                    <p className="text-xs text-gray-500 mt-1">{reason.description}</p>
                  </div>
                ))}
              </div>
              
              {archiveOptions.reason === 'other' && (
                <div className="mt-3">
                  <textarea
                    placeholder="Spécifiez la raison de l'archivage..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setArchiveOptions(prev => ({ ...prev, customReason: e.target.value }))}
                  />
                </div>
              )}
            </div>

            {/* Période de rétention */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Période de rétention</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {retentionPeriods.map((period) => (
                  <div
                    key={period.value}
                    className={`cursor-pointer rounded-lg border p-3 hover:bg-gray-50 ${
                      archiveOptions.retentionPeriod === period.value
                        ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setArchiveOptions(prev => ({ ...prev, retentionPeriod: period.value }))}
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <h4 className="text-sm font-medium text-gray-900">{period.label}</h4>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{period.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Options avancées */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Options avancées</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <HardDrive className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-700">Créer une sauvegarde</span>
                      <p className="text-xs text-gray-500">Sauvegarde complète des données</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setArchiveOptions(prev => ({ ...prev, createBackup: !prev.createBackup }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      archiveOptions.createBackup ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        archiveOptions.createBackup ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-700">Notifier les participants</span>
                      <p className="text-xs text-gray-500">Informer les parties prenantes</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setArchiveOptions(prev => ({ ...prev, notifyStakeholders: !prev.notifyStakeholders }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      archiveOptions.notifyStakeholders ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        archiveOptions.notifyStakeholders ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <div>
                      <span className="text-sm text-gray-700">Suppression automatique</span>
                      <p className="text-xs text-gray-500">Supprimer après la période de rétention</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setArchiveOptions(prev => ({ ...prev, deleteAfterRetention: !prev.deleteAfterRetention }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      archiveOptions.deleteAfterRetention ? 'bg-red-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        archiveOptions.deleteAfterRetention ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Résumé de l'archivage */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Résumé de l'archivage</h4>
                  <div className="text-sm text-blue-700 mt-2 space-y-1">
                    <p>• Mission archivée pour : {archiveReasons.find(r => r.id === archiveOptions.reason)?.label || 'Raison non spécifiée'}</p>
                    <p>• Période de rétention : {retentionPeriods.find(p => p.value === archiveOptions.retentionPeriod)?.label || 'Non définie'}</p>
                    <p>• Sauvegarde : {archiveOptions.createBackup ? 'Oui' : 'Non'}</p>
                    <p>• Notifications : {archiveOptions.notifyStakeholders ? 'Oui' : 'Non'}</p>
                    {archiveOptions.deleteAfterRetention && (
                      <p className="text-red-700">⚠️ Suppression automatique activée</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isArchiving}
            >
              Annuler
            </Button>
            <Button
              onClick={handleArchive}
              disabled={isArchiving || !archiveOptions.reason}
              className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700"
            >
              {isArchiving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Archivage...</span>
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4" />
                  <span>Archiver la mission</span>
                </>
              )}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ArchiveMissionModal;
