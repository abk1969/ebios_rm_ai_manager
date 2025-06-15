import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import MissionForm from './MissionForm';
import type { Mission } from '@/types/ebios';

interface CreateMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Mission>) => Promise<void>;
  initialData?: Partial<Mission>;
}

const CreateMissionModal: React.FC<CreateMissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
        <Dialog.Panel className="mx-auto w-full max-w-7xl max-h-[95vh] flex flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-white flex-shrink-0">
            <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900">
              {initialData ? 'Modifier la Mission' : 'Créer une Nouvelle Mission'}
            </Dialog.Title>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <MissionForm
              initialData={initialData}
              onSubmit={async (data) => {
                await onSubmit(data);
                onClose();
              }}
            />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateMissionModal;
