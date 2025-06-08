import React, { useState } from 'react';
import { 
  Edit3, 
  Trash2, 
  MoreVertical,
  AlertTriangle, 
  CheckCircle, 
  X,
  Copy,
  Archive,
  Download,
  Share2
} from 'lucide-react';
import Button from '../ui/button';
import type { Mission } from '../../types/ebios';

interface MissionActionsProps {
  mission: Mission;
  onEdit: (mission: Mission) => void;
  onDelete: (missionId: string) => void;
  onDuplicate?: (mission: Mission) => void;
  onArchive?: (missionId: string) => void;
  onExport?: (mission: Mission) => void;
  onShare?: (mission: Mission) => void;
  showDropdown?: boolean;
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

const MissionActions: React.FC<MissionActionsProps> = ({
  mission,
  onEdit,
  onDelete,
  onDuplicate,
  onArchive,
  onExport,
  onShare,
  showDropdown = false
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
    setIsDropdownOpen(false);
  };

  const hideConfirmation = () => {
    setConfirmationModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleDelete = () => {
    showConfirmation({
      title: 'Supprimer la mission',
      message: `Êtes-vous sûr de vouloir supprimer la mission "${mission.name}" ? Cette action supprimera également tous les workshops, valeurs métier, actifs supports et données associées. Cette action est irréversible.`,
      confirmText: 'Supprimer définitivement',
      cancelText: 'Annuler',
      type: 'danger',
      onConfirm: () => {
        onDelete(mission.id);
        hideConfirmation();
      }
    });
  };

  const handleArchive = () => {
    if (!onArchive) return;
    
    showConfirmation({
      title: 'Archiver la mission',
      message: `Êtes-vous sûr de vouloir archiver la mission "${mission.name}" ? Elle sera déplacée vers les archives et ne sera plus visible dans la liste principale.`,
      confirmText: 'Archiver',
      cancelText: 'Annuler',
      type: 'warning',
      onConfirm: () => {
        onArchive(mission.id);
        hideConfirmation();
      }
    });
  };

  const handleDuplicate = () => {
    if (!onDuplicate) return;
    
    showConfirmation({
      title: 'Dupliquer la mission',
      message: `Voulez-vous créer une copie de la mission "${mission.name}" ? Toutes les données des workshops seront copiées dans une nouvelle mission.`,
      confirmText: 'Dupliquer',
      cancelText: 'Annuler',
      type: 'info',
      onConfirm: () => {
        onDuplicate(mission);
        hideConfirmation();
      }
    });
  };

  const getMissionStatusColor = (mission: Mission) => {
    const progress = mission.ebiosCompliance?.completionPercentage || 0;
    if (progress === 100) return 'bg-green-100 text-green-800';
    if (progress >= 60) return 'bg-blue-100 text-blue-800';
    if (progress >= 20) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getMissionProgress = (mission: Mission) => {
    return mission.ebiosCompliance?.completionPercentage || 0;
  };

  if (showDropdown) {
    return (
      <div className="relative">
        <Button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          variant="outline"
          size="sm"
          className="p-2"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>

        {isDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
              <div className="py-1">
                <button
                  onClick={() => {
                    onEdit(mission);
                    setIsDropdownOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Edit3 className="h-4 w-4 mr-3" />
                  Modifier
                </button>
                
                {onDuplicate && (
                  <button
                    onClick={handleDuplicate}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Copy className="h-4 w-4 mr-3" />
                    Dupliquer
                  </button>
                )}
                
                {onExport && (
                  <button
                    onClick={() => {
                      onExport(mission);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Download className="h-4 w-4 mr-3" />
                    Exporter
                  </button>
                )}
                
                {onShare && (
                  <button
                    onClick={() => {
                      onShare(mission);
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Share2 className="h-4 w-4 mr-3" />
                    Partager
                  </button>
                )}
                
                {onArchive && (
                  <button
                    onClick={handleArchive}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Archive className="h-4 w-4 mr-3" />
                    Archiver
                  </button>
                )}
                
                <div className="border-t border-gray-100 my-1" />
                
                <button
                  onClick={handleDelete}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-3" />
                  Supprimer
                </button>
              </div>
            </div>
          </>
        )}

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
  }

  // Mode boutons séparés (pour les cartes de mission)
  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => onEdit(mission)}
        variant="outline"
        size="sm"
        className="flex items-center space-x-1"
      >
        <Edit3 className="h-4 w-4" />
        <span>Modifier</span>
      </Button>
      
      <Button
        onClick={handleDelete}
        variant="outline"
        size="sm"
        className="flex items-center space-x-1 text-red-600 border-red-300 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
        <span>Supprimer</span>
      </Button>

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

export default MissionActions;
