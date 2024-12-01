import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import SecurityControlForm from './SecurityControlForm';
import type { SecurityBaseline } from '@/types/ebios';

interface AddSecurityControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<SecurityBaseline>) => void;
  missionId: string;
}

const AddSecurityControlModal: React.FC<AddSecurityControlModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  missionId,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-lg bg-white p-6">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-medium text-gray-900">
              Add Security Control
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4">
            <SecurityControlForm
              onSubmit={(data) => {
                onSubmit({ ...data, missionId, gaps: [] });
                onClose();
              }}
            />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddSecurityControlModal;