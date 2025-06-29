import React from 'react';

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
}

interface DialogFooterProps {
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ children, open = false, onOpenChange }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black bg-opacity-50"
      onClick={() => onOpenChange?.(false)}
    >
      {children}
    </div>
  );
};

export const DialogContent: React.FC<DialogContentProps> = ({ children, className = '' }) => {
  return (
    <div
      className="flex items-center justify-center p-4 min-h-full"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={`bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto ${className}`}>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      {children}
    </div>
  );
};

export const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => {
  return (
    <h2 className="text-lg font-semibold text-gray-900">
      {children}
    </h2>
  );
};

export const DialogDescription: React.FC<DialogDescriptionProps> = ({ children }) => {
  return (
    <p className="mt-2 text-sm text-gray-600">
      {children}
    </p>
  );
};

export const DialogFooter: React.FC<DialogFooterProps> = ({ children }) => {
  return (
    <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
      {children}
    </div>
  );
}; 