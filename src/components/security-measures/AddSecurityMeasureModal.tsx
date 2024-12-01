import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';  // Using Headless UI Dialog
import SecurityMeasureForm from './SecurityMeasureForm';
import { SecurityMeasure } from '@/types/ebios';

interface AddSecurityMeasureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<SecurityMeasure>) => Promise<void>;
  missionId: string;
}

const AddSecurityMeasureModal: React.FC<AddSecurityMeasureModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  missionId
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Partial<SecurityMeasure>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Dialog.Panel className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <Dialog.Title className="text-lg font-medium">Add Security Measure</Dialog.Title>
          <div className="mt-4">
            <SecurityMeasureForm
              onSubmit={handleSubmit}
              onCancel={onClose}
              isSubmitting={isSubmitting}
              submitButtonText="Add Measure"
            />
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default AddSecurityMeasureModal;