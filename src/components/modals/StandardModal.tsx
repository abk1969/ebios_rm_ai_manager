import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface StandardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

/**
 * COMPOSANT DE MODAL STANDARDISÉ
 * Harmonise l'apparence et le comportement des modales EBIOS RM
 */
const StandardModal: React.FC<StandardModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  type = 'default',
  children,
  footer,
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}) => {

  // Interface
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  // Interface
  const typeConfig = {
    default: {
      icon: null,
      headerBg: 'bg-white',
      borderColor: 'border-gray-200'
    },
    success: {
      icon: CheckCircle,
      headerBg: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    warning: {
      icon: AlertTriangle,
      headerBg: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    error: {
      icon: AlertCircle,
      headerBg: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    info: {
      icon: Info,
      headerBg: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  // 🔒 Gestion des événements
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const handleEscapeKey = React.useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscapeKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 🌫️ OVERLAY */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleOverlayClick}
      />

      {/* 📦 CONTENEUR MODAL */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={cn(
            'relative w-full bg-white rounded-lg shadow-xl transform transition-all',
            sizeClasses[size],
            config.borderColor,
            'border',
            className
          )}
        >
          {/* EN-TÊTE */}
          <div className={cn(
            'flex items-start justify-between p-6 border-b border-gray-200 rounded-t-lg',
            config.headerBg
          )}>
            <div className="flex items-start space-x-3">
              {Icon && (
                <Icon className={cn(
                  'h-6 w-6 mt-0.5 flex-shrink-0',
                  {
                    'text-green-600': type === 'success',
                    'text-yellow-600': type === 'warning',
                    'text-red-600': type === 'error',
                    'text-blue-600': type === 'info'
                  }
                )} />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
                {description && (
                  <p className="mt-1 text-sm text-gray-600">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* 🔘 BOUTON FERMER */}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* CONTENU */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {children}
          </div>

          {/* 🎯 PIED DE PAGE */}
          {footer && (
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * 🔧 MODAL DE CONFIRMATION STANDARDISÉE
 */
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'warning' | 'error' | 'info';
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  isLoading = false
}) => {
  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      type={type}
      size="sm"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={type === 'error' ? 'danger' : 'default'}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'En cours...' : confirmText}
          </Button>
        </>
      }
    >
      <p className="text-gray-700">{message}</p>
    </StandardModal>
  );
};

/**
 * MODAL DE FORMULAIRE STANDARDISÉE
 */
export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isValid?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  children,
  submitText = 'Enregistrer',
  cancelText = 'Annuler',
  isLoading = false,
  isValid = true,
  size = 'md'
}) => {
  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size={size}
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isLoading || !isValid}
          >
            {isLoading ? 'En cours...' : submitText}
          </Button>
        </>
      }
    >
      {children}
    </StandardModal>
  );
};

export default StandardModal;
