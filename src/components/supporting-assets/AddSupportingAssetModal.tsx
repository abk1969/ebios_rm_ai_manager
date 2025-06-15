import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Server, Info } from 'lucide-react';
import { useSelector } from 'react-redux';
import SupportingAssetForm from './SupportingAssetForm';
import type { SupportingAsset } from '../../types/ebios';
import type { RootState } from '../../store';

interface AddSupportingAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<SupportingAsset>) => void;
  businessValueId: string;
  initialData?: Partial<SupportingAsset>;
}

const AddSupportingAssetModal: React.FC<AddSupportingAssetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  businessValueId,
  initialData,
}) => {
  // Récupérer la valeur métier et les actifs existants depuis le store
  const businessValue = useSelector((state: RootState) => 
    state.businessValues.businessValues.find(v => v.id === businessValueId)
  );
  const existingAssets = useSelector((state: RootState) =>
    state.supportingAssets.assets.filter((a: SupportingAsset) => a.businessValueId === businessValueId)
  );
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-4xl rounded-lg bg-white shadow-xl max-h-[90vh] overflow-y-auto">
          {/* Header amélioré */}
          <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Server className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <Dialog.Title className="text-lg font-semibold text-gray-900">
                    {initialData ? 'Modifier l\'Actif Support' : 'Nouvel Actif Support'}
                  </Dialog.Title>
                  <p className="text-sm text-gray-600">
                    {businessValue ? `Pour la valeur métier : ${businessValue.name}` : 'Définissez un actif support'}
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
          <div className="px-6 py-4 bg-green-25 border-b border-green-100">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-medium mb-1">Qu'est-ce qu'un actif support selon EBIOS RM ?</p>
                <p>
                  Un actif support est un élément technique, organisationnel ou humain qui permet
                  de réaliser, traiter ou stocker une valeur métier. Il peut s'agir de matériel,
                  logiciels, données, personnel, sites, ou processus organisationnels.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <SupportingAssetForm
              onSubmit={(data) => {
                onSubmit({ ...data, businessValueId });
                onClose();
              }}
              onCancel={onClose}
              businessValue={businessValue}
              existingAssets={existingAssets}
              initialData={initialData}
            />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddSupportingAssetModal;