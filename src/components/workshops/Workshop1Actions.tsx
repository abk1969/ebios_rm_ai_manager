import React, { useState } from 'react';
import { 
  Edit3, 
  Trash2, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle, 
  X,
  Save,
  Undo2,
  RefreshCw,
  Database,
  Shield,
  Target
} from 'lucide-react';
import Button from '../ui/button';
import type { BusinessValue, SupportingAsset, DreadedEvent } from '../../types/ebios';

interface Workshop1ActionsProps {
  businessValues: BusinessValue[];
  supportingAssets: SupportingAsset[];
  dreadedEvents: DreadedEvent[];
  onEditBusinessValue: (value: BusinessValue) => void;
  onDeleteBusinessValue: (valueId: string) => void;
  onEditSupportingAsset: (asset: SupportingAsset) => void;
  onDeleteSupportingAsset: (assetId: string) => void;
  onEditDreadedEvent: (event: DreadedEvent) => void;
  onDeleteDreadedEvent: (eventId: string) => void;
  onResetWorkshop: () => void;
  onRestorePrevious: () => void;
  hasPreviousState: boolean;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  type: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          button: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-600',
          button: 'bg-yellow-600 hover:bg-yellow-700'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className={`p-6 ${styles.bg} ${styles.border} border rounded-t-lg`}>
          <div className="flex items-center space-x-3">
            <AlertTriangle className={`h-6 w-6 ${styles.icon}`} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 mb-6">{message}</p>
          
          <div className="flex space-x-3 justify-end">
            <Button
              onClick={onCancel}
              variant="outline"
              className="px-4 py-2"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              className={`px-4 py-2 text-white ${styles.button}`}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Workshop1Actions: React.FC<Workshop1ActionsProps> = ({
  businessValues,
  supportingAssets,
  dreadedEvents,
  onEditBusinessValue,
  onDeleteBusinessValue,
  onEditSupportingAsset,
  onDeleteSupportingAsset,
  onEditDreadedEvent,
  onDeleteDreadedEvent,
  onResetWorkshop,
  onRestorePrevious,
  hasPreviousState
}) => {
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    type: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    onConfirm: () => {},
    type: 'info'
  });

  const showConfirmation = (config: Omit<typeof confirmationModal, 'isOpen'>) => {
    setConfirmationModal({ ...config, isOpen: true });
  };

  const hideConfirmation = () => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleDeleteBusinessValue = (value: BusinessValue) => {
    showConfirmation({
      title: 'Supprimer la valeur métier',
      message: `Êtes-vous sûr de vouloir supprimer la valeur métier "${value.name}" ? Cette action supprimera également tous les actifs supports et événements redoutés associés.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
      onConfirm: () => {
        onDeleteBusinessValue(value.id);
        hideConfirmation();
      }
    });
  };

  const handleDeleteSupportingAsset = (asset: SupportingAsset) => {
    showConfirmation({
      title: 'Supprimer l\'actif support',
      message: `Êtes-vous sûr de vouloir supprimer l'actif support "${asset.name}" ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
      onConfirm: () => {
        onDeleteSupportingAsset(asset.id);
        hideConfirmation();
      }
    });
  };

  const handleDeleteDreadedEvent = (event: DreadedEvent) => {
    showConfirmation({
      title: 'Supprimer l\'événement redouté',
      message: `Êtes-vous sûr de vouloir supprimer l'événement redouté "${event.name}" ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
      onConfirm: () => {
        onDeleteDreadedEvent(event.id);
        hideConfirmation();
      }
    });
  };

  const handleResetWorkshop = () => {
    showConfirmation({
      title: 'Réinitialiser le Workshop 1',
      message: 'Êtes-vous sûr de vouloir réinitialiser complètement le Workshop 1 ? Toutes les valeurs métier, actifs supports et événements redoutés seront supprimés. Cette action est irréversible.',
      confirmText: 'Réinitialiser',
      cancelText: 'Annuler',
      type: 'danger',
      onConfirm: () => {
        onResetWorkshop();
        hideConfirmation();
      }
    });
  };

  const handleRestorePrevious = () => {
    showConfirmation({
      title: 'Restaurer l\'état précédent',
      message: 'Êtes-vous sûr de vouloir restaurer l\'état précédent du Workshop 1 ? Les modifications actuelles seront perdues.',
      confirmText: 'Restaurer',
      cancelText: 'Annuler',
      type: 'warning',
      onConfirm: () => {
        onRestorePrevious();
        hideConfirmation();
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Actions du Workshop 1</h3>
        <p className="text-sm text-gray-600">Gérer les valeurs métier, actifs supports et événements redoutés</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Actions sur les valeurs métier */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Database className="h-4 w-4 mr-2 text-blue-500" />
            Valeurs métier ({businessValues.length})
          </h4>
          
          {businessValues.length > 0 ? (
            <div className="space-y-3">
              {businessValues.map((value) => (
                <div key={value.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{value.name}</h5>
                    <p className="text-sm text-gray-600">{value.category} - Priorité {value.priority}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onEditBusinessValue(value)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Modifier</span>
                    </Button>
                    <Button
                      onClick={() => handleDeleteBusinessValue(value)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1 text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Supprimer</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Aucune valeur métier définie</p>
          )}
        </div>

        {/* Actions sur les actifs supports */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Shield className="h-4 w-4 mr-2 text-green-500" />
            Actifs supports ({supportingAssets.length})
          </h4>
          
          {supportingAssets.length > 0 ? (
            <div className="space-y-3">
              {supportingAssets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{asset.name}</h5>
                    <p className="text-sm text-gray-600">{asset.type} - {asset.securityLevel}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onEditSupportingAsset(asset)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Modifier</span>
                    </Button>
                    <Button
                      onClick={() => handleDeleteSupportingAsset(asset)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1 text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Supprimer</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Aucun actif support défini</p>
          )}
        </div>

        {/* Actions sur les événements redoutés */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Target className="h-4 w-4 mr-2 text-orange-500" />
            Événements redoutés ({dreadedEvents.length})
          </h4>
          
          {dreadedEvents.length > 0 ? (
            <div className="space-y-3">
              {dreadedEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{event.name}</h5>
                    <p className="text-sm text-gray-600">Gravité {event.gravity} - {event.impactType}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onEditDreadedEvent(event)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Modifier</span>
                    </Button>
                    <Button
                      onClick={() => handleDeleteDreadedEvent(event)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1 text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Supprimer</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Aucun événement redouté défini</p>
          )}
        </div>

        {/* Actions globales */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-medium text-gray-900 mb-3">Actions globales</h4>
          
          <div className="flex space-x-3">
            {hasPreviousState && (
              <Button
                onClick={handleRestorePrevious}
                variant="outline"
                className="flex items-center space-x-2 text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <Undo2 className="h-4 w-4" />
                <span>Restaurer l'état précédent</span>
              </Button>
            )}
            
            <Button
              onClick={handleResetWorkshop}
              variant="outline"
              className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Réinitialiser le workshop</span>
            </Button>
          </div>
          
          {hasPreviousState && (
            <p className="text-xs text-gray-500 mt-2">
              💡 Un état précédent est disponible pour restauration
            </p>
          )}
        </div>
      </div>

      {/* Modal de confirmation */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        title={confirmationModal.title}
        message={confirmationModal.message}
        confirmText={confirmationModal.confirmText}
        cancelText={confirmationModal.cancelText}
        onConfirm={confirmationModal.onConfirm}
        onCancel={hideConfirmation}
        type={confirmationModal.type}
      />
    </div>
  );
};

export default Workshop1Actions;
