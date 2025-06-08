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
  Users,
  Zap
} from 'lucide-react';
import Button from '../ui/button';
import type { RiskSource } from '../../types/ebios';

interface Workshop2ActionsProps {
  riskSources: RiskSource[];
  onEditRiskSource: (source: RiskSource) => void;
  onDeleteRiskSource: (sourceId: string) => void;
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

const Workshop2Actions: React.FC<Workshop2ActionsProps> = ({
  riskSources,
  onEditRiskSource,
  onDeleteRiskSource,
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

  const handleDeleteRiskSource = (source: RiskSource) => {
    showConfirmation({
      title: 'Supprimer la source de risque',
      message: `Êtes-vous sûr de vouloir supprimer la source de risque "${source.name}" ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
      onConfirm: () => {
        onDeleteRiskSource(source.id);
        hideConfirmation();
      }
    });
  };

  const handleResetWorkshop = () => {
    showConfirmation({
      title: 'Réinitialiser le Workshop 2',
      message: 'Êtes-vous sûr de vouloir réinitialiser complètement le Workshop 2 ? Toutes les sources de risque seront supprimées. Cette action est irréversible.',
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
      message: 'Êtes-vous sûr de vouloir restaurer l\'état précédent du Workshop 2 ? Les modifications actuelles seront perdues.',
      confirmText: 'Restaurer',
      cancelText: 'Annuler',
      type: 'warning',
      onConfirm: () => {
        onRestorePrevious();
        hideConfirmation();
      }
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'human': return <Users className="h-4 w-4 text-blue-500" />;
      case 'environmental': return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'internal': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'external': return <Users className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Actions du Workshop 2</h3>
        <p className="text-sm text-gray-600">Gérer les sources de risque</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Actions sur les sources de risque */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Users className="h-4 w-4 mr-2 text-purple-500" />
            Sources de risque ({riskSources.length})
          </h4>
          
          {riskSources.length > 0 ? (
            <div className="space-y-3">
              {riskSources.map((source) => (
                <div key={source.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getTypeIcon(source.type)}
                      <h5 className="font-medium text-gray-900">{source.name}</h5>
                    </div>
                    <p className="text-sm text-gray-600">
                      {source.type} - Capacité {source.capability} - Motivation {source.motivation}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onEditRiskSource(source)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Modifier</span>
                    </Button>
                    <Button
                      onClick={() => handleDeleteRiskSource(source)}
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
            <p className="text-sm text-gray-500 italic">Aucune source de risque définie</p>
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

export default Workshop2Actions;
