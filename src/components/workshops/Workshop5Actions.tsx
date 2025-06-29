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
  RefreshCw
} from 'lucide-react';
import Button from '../ui/button';
import type { SecurityMeasure } from '../../types/ebios';

interface Workshop5ActionsProps {
  securityMeasures: SecurityMeasure[];
  treatmentPlan: string;
  onEditMeasure: (measure: SecurityMeasure) => void;
  onDeleteMeasure: (measureId: string) => void;
  onDeletePlan: () => void;
  onRegeneratePlan: () => void;
  onResetWorkshop: () => void;
  onRestorePrevious: () => void;
  hasPreviousState: boolean;
  isGeneratingPlan: boolean;
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

const Workshop5Actions: React.FC<Workshop5ActionsProps> = ({
  securityMeasures,
  treatmentPlan,
  onEditMeasure,
  onDeleteMeasure,
  onDeletePlan,
  onRegeneratePlan,
  onResetWorkshop,
  onRestorePrevious,
  hasPreviousState,
  isGeneratingPlan
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

  const handleDeleteMeasure = (measure: SecurityMeasure) => {
    showConfirmation({
      title: 'Supprimer la mesure de sécurité',
      message: `Êtes-vous sûr de vouloir supprimer la mesure "${measure.name}" ? Cette action est irréversible.`,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
      onConfirm: () => {
        onDeleteMeasure(measure.id);
        hideConfirmation();
      }
    });
  };

  const handleDeletePlan = () => {
    showConfirmation({
      title: 'Supprimer le plan de traitement',
      message: 'Êtes-vous sûr de vouloir supprimer le plan de traitement généré ? Vous pourrez le régénérer par la suite.',
      confirmText: 'Supprimer le plan',
      cancelText: 'Annuler',
      type: 'warning',
      onConfirm: () => {
        onDeletePlan();
        hideConfirmation();
      }
    });
  };

  const handleRegeneratePlan = () => {
    showConfirmation({
      title: 'Régénérer le plan de traitement',
      message: 'Êtes-vous sûr de vouloir régénérer le plan de traitement ? Le plan actuel sera remplacé par une nouvelle version.',
      confirmText: 'Régénérer',
      cancelText: 'Annuler',
      type: 'info',
      onConfirm: () => {
        onRegeneratePlan();
        hideConfirmation();
      }
    });
  };

  const handleResetWorkshop = () => {
    showConfirmation({
      title: 'Réinitialiser le Workshop 5',
      message: 'Êtes-vous sûr de vouloir réinitialiser complètement le Workshop 5 ? Toutes les mesures de sécurité et le plan de traitement seront supprimés. Cette action est irréversible.',
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
      message: 'Êtes-vous sûr de vouloir restaurer l\'état précédent du Workshop 5 ? Les modifications actuelles seront perdues.',
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
        <h3 className="text-lg font-semibold text-gray-900">Actions du Workshop</h3>
        <p className="text-sm text-gray-600">Gérer les mesures de sécurité et le plan de traitement</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Actions sur les mesures de sécurité */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Mesures de sécurité ({securityMeasures.length})</h4>
          
          {securityMeasures.length > 0 ? (
            <div className="space-y-3">
              {securityMeasures.map((measure) => (
                <div key={measure.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{measure.name}</h5>
                    <p className="text-sm text-gray-600">{measure.type} - {measure.priority}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onEditMeasure(measure)}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Modifier</span>
                    </Button>
                    <Button
                      onClick={() => handleDeleteMeasure(measure)}
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
            <p className="text-sm text-gray-500 italic">Aucune mesure de sécurité définie</p>
          )}
        </div>

        {/* Actions sur le plan de traitement */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Plan de traitement</h4>
          
          {treatmentPlan ? (
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Plan généré avec succès</span>
                </div>
                <p className="text-sm text-green-700">
                  Plan de {treatmentPlan.length} caractères généré le {new Date().toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleRegeneratePlan}
                  disabled={isGeneratingPlan}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isGeneratingPlan ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingPlan ? 'Génération...' : 'Régénérer'}</span>
                </Button>
                <Button
                  onClick={handleDeletePlan}
                  variant="outline"
                  className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Supprimer le plan</span>
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">Aucun plan de traitement généré</p>
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

export default Workshop5Actions;
