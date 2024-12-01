import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import SupportingAssetForm from './SupportingAssetForm';
import type { SupportingAsset } from '@/types/ebios';

interface AddSupportingAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<SupportingAsset>) => void;
  businessValueId: string;
}

const AddSupportingAssetModal: React.FC<AddSupportingAssetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  businessValueId,
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
              Add Supporting Asset
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
            <SupportingAssetForm
              onSubmit={(data) => {
                onSubmit({ ...data, businessValueId });
                onClose();
              }}
            />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddSupportingAssetModal;