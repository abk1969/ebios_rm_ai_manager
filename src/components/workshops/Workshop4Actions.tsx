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
  Server,
  Shield
} from 'lucide-react';
import Button from '../ui/button';
import type { SupportingAsset } from '../../types/ebios';

interface Workshop4ActionsProps {
  supportingAssets: SupportingAsset[];
  onEditSupportingAsset: (asset: SupportingAsset) => void;
  onDeleteSupportingAsset: (assetId: string) => void;
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

const Workshop4Actions: React.FC<Workshop4ActionsProps> = ({
  supportingAssets,
  onEditSupportingAsset,
  onDeleteSupportingAsset,
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

  const handleResetWorkshop = () => {
    showConfirmation({
      title: 'Réinitialiser le Workshop 4',
      message: 'Êtes-vous sûr de vouloir réinitialiser complètement le Workshop 4 ? Tous les actifs supports seront supprimés. Cette action est irréversible.',
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
      message: 'Êtes-vous sûr de vouloir restaurer l\'état précédent du Workshop 4 ? Les modifications actuelles seront perdues.',
      confirmText: 'Restaurer',
      cancelText: 'Annuler',
      type: 'warning',
      onConfirm: () => {
        onRestorePrevious();
        hideConfirmation();
      }
    });
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'public': return 'text-green-600 bg-green-100';
      case 'internal': return 'text-blue-600 bg-blue-100';
      case 'confidential': return 'text-orange-600 bg-orange-100';
      case 'secret': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'software': return <Server className="h-4 w-4 text-blue-500" />;
      case 'hardware': return <Shield className="h-4 w-4 text-green-500" />;
      case 'data': return <Server className="h-4 w-4 text-purple-500" />;
      case 'network': return <Server className="h-4 w-4 text-orange-500" />;
      default: return <Server className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Actions du Workshop 4</h3>
        <p className="text-sm text-gray-600">Gérer les actifs supports</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Actions sur les actifs supports */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Server className="h-4 w-4 mr-2 text-green-500" />
            Actifs supports ({supportingAssets.length})
          </h4>
          
          {supportingAssets.length > 0 ? (
            <div className="space-y-3">
              {supportingAssets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getTypeIcon(asset.type)}
                      <h5 className="font-medium text-gray-900">{asset.name}</h5>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSecurityLevelColor(asset.securityLevel)}`}>
                        {asset.securityLevel}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Type: {asset.type} - {asset.vulnerabilities?.length || 0} vulnérabilité(s)
                    </p>
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

export default Workshop4Actions;
