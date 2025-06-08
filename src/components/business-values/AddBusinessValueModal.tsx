import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Database, Info } from 'lucide-react';
import BusinessValueForm from './BusinessValueForm';
import type { BusinessValue } from '../../types/ebios';

interface AddBusinessValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<BusinessValue>) => void;
  missionId: string;
  initialData?: BusinessValue | null;
}

const AddBusinessValueModal: React.FC<AddBusinessValueModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  missionId,
  initialData,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-2xl rounded-lg bg-white shadow-xl">
          {/* Header amélioré */}
          <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    {initialData ? 'Modifier la Valeur Métier' : 'Nouvelle Valeur Métier'}
                  </Dialog.Title>
                  <p className="text-sm text-gray-600">
                    Définissez ce qui a de la valeur pour votre organisation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Information méthodologique */}
          <div className="px-6 py-4 bg-blue-25 border-b border-blue-100">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Qu'est-ce qu'une valeur métier selon EBIOS RM ?</p>
                <p>
                  Une valeur métier représente ce qui est important pour votre organisation :
                  processus critiques, informations sensibles, services essentiels, réputation, etc.
                  Elle constitue la base de l'analyse de risque.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <BusinessValueForm
              onSubmit={(data) => {
                onSubmit({ ...data, missionId });
                onClose();
              }}
              onCancel={onClose}
              initialData={initialData}
            />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddBusinessValueModal;