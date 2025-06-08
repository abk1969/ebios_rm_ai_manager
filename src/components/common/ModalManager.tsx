import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalState {
  id: string;
  component: ReactNode;
  zIndex: number;
}

interface ModalContextType {
  modals: ModalState[];
  openModal: (id: string, component: ReactNode) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  isModalOpen: (id: string) => boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modals, setModals] = useState<ModalState[]>([]);

  const openModal = (id: string, component: ReactNode) => {
    setModals(prev => {
      // Fermer la modale si elle existe déjà
      const filtered = prev.filter(modal => modal.id !== id);
      // Ajouter la nouvelle modale avec un z-index plus élevé
      const baseZIndex = 10000;
      const zIndex = baseZIndex + filtered.length;
      
      return [...filtered, { id, component, zIndex }];
    });
  };

  const closeModal = (id: string) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
  };

  const closeAllModals = () => {
    setModals([]);
  };

  const isModalOpen = (id: string) => {
    return modals.some(modal => modal.id === id);
  };

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal, closeAllModals, isModalOpen }}>
      {children}
      
      {/* Rendu des modales */}
      {modals.map(modal => (
        <div
          key={modal.id}
          className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
          style={{ zIndex: modal.zIndex }}
        >
          {modal.component}
        </div>
      ))}
    </ModalContext.Provider>
  );
};

// Hook pour gérer les modales spécifiques à Workshop 5
export const useWorkshop5Modals = () => {
  const { openModal, closeModal, isModalOpen } = useModal();

  const openAddMeasureModal = (props: any) => {
    const AddSecurityMeasureModal = React.lazy(() => import('@/components/security-measures/AddSecurityMeasureModal'));
    
    openModal('add-measure', (
      <React.Suspense fallback={<div>Chargement...</div>}>
        <AddSecurityMeasureModal
          {...props}
          isOpen={true}
          onClose={() => closeModal('add-measure')}
        />
      </React.Suspense>
    ));
  };

  const openValidationModal = (props: any) => {
    const AIValidationModal = React.lazy(() => import('@/components/security-measures/AIValidationModal'));
    
    openModal('ai-validation', (
      <React.Suspense fallback={<div>Chargement...</div>}>
        <AIValidationModal
          {...props}
          isOpen={true}
          onClose={() => closeModal('ai-validation')}
        />
      </React.Suspense>
    ));
  };

  return {
    openAddMeasureModal,
    openValidationModal,
    closeModal,
    isAddMeasureModalOpen: isModalOpen('add-measure'),
    isValidationModalOpen: isModalOpen('ai-validation')
  };
};

// Composant pour afficher les modales avec overlay
interface ModalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  zIndex?: number;
}

export const ModalOverlay: React.FC<ModalOverlayProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  zIndex = 10000
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50 ${className}`}
      style={{ zIndex }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default ModalProvider;
