import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Info, Target, Link } from 'lucide-react';
import Button from '@/components/ui/button';
import { 
  EBIOS_SCALES,
  EbiosUtils 
} from '@/lib/ebios-constants';
import type { GravityScale, BusinessValue, SupportingAsset } from '@/types/ebios';

interface AddDreadedEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    impactedBusinessValues: string[];
    impactedSupportingAssets: string[];
    gravity: GravityScale;
    impactDescription: string;
    consequencesDescription: string;
  }) => void;
  missionId: string;
  businessValues: BusinessValue[];
  supportingAssets: SupportingAsset[];
}

const AddDreadedEventModal: React.FC<AddDreadedEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  missionId,
  businessValues = [],
  supportingAssets = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    impactedBusinessValues: [] as string[],
    impactedSupportingAssets: [] as string[],
    gravity: 2 as GravityScale,
    impactDescription: '',
    consequencesDescription: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showHelp, setShowHelp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchBusinessValues, setSearchBusinessValues] = useState('');
  const [searchAssets, setSearchAssets] = useState('');

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        name: '',
        description: '',
        impactedBusinessValues: [],
        impactedSupportingAssets: [],
        gravity: 2,
        impactDescription: '',
        consequencesDescription: ''
      });
      setErrors({});
      setShowHelp(false);
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de l\'événement redouté est requis';
    } else if (formData.name.length < 5) {
      newErrors.name = 'Le nom doit contenir au moins 5 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length < 15) {
      newErrors.description = 'La description doit contenir au moins 15 caractères';
    }

    if (formData.impactedBusinessValues.length === 0) {
      newErrors.impactedBusinessValues = 'Au moins une valeur métier doit être sélectionnée';
    }

    if (!formData.impactDescription.trim()) {
      newErrors.impactDescription = 'La description de l\'impact est requise';
    }

    if (!formData.consequencesDescription.trim()) {
      newErrors.consequencesDescription = 'La description des conséquences est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleBusinessValue = (valueId: string) => {
    const isSelected = formData.impactedBusinessValues.includes(valueId);
    if (isSelected) {
      handleInputChange('impactedBusinessValues', 
        formData.impactedBusinessValues.filter(id => id !== valueId)
      );
    } else {
      handleInputChange('impactedBusinessValues', 
        [...formData.impactedBusinessValues, valueId]
      );
    }
  };

  const toggleSupportingAsset = (assetId: string) => {
    const isSelected = formData.impactedSupportingAssets.includes(assetId);
    if (isSelected) {
      handleInputChange('impactedSupportingAssets', 
        formData.impactedSupportingAssets.filter(id => id !== assetId)
      );
    } else {
      handleInputChange('impactedSupportingAssets', 
        [...formData.impactedSupportingAssets, assetId]
      );
    }
  };

  const filteredBusinessValues = businessValues.filter(bv =>
    bv.name.toLowerCase().includes(searchBusinessValues.toLowerCase()) ||
    bv.description.toLowerCase().includes(searchBusinessValues.toLowerCase())
  );

  const filteredAssets = supportingAssets.filter(asset =>
    asset.name.toLowerCase().includes(searchAssets.toLowerCase()) ||
    asset.description.toLowerCase().includes(searchAssets.toLowerCase())
  );

  const getGravityDescription = (gravity: GravityScale) => {
    const descriptions = {
      1: 'Impact mineur - Gêne temporaire sans conséquence majeure',
      2: 'Impact modéré - Dysfonctionnement notable mais maîtrisable',
      3: 'Impact important - Perturbation significative de l\'activité',
      4: 'Impact critique - Mise en péril de l\'organisation ou de vies humaines'
    };
    return descriptions[gravity];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          {/* Header */}
          <div className="bg-red-50 px-6 py-4 border-b border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <h3 className="ml-3 text-lg font-medium text-gray-900">
                  Ajouter un Événement Redouté
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHelp(!showHelp)}
                  className="flex items-center space-x-1"
                >
                  <Info className="h-4 w-4" />
                  <span>Aide ANSSI</span>
                </Button>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                  onClick={onClose}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {showHelp && (
              <div className="mt-4 p-4 bg-white rounded border">
                <h4 className="font-medium text-gray-900 mb-2">Guide ANSSI - Événements Redoutés :</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li><strong>Définition :</strong> Impact négatif sur les valeurs métier de l'organisation</li>
                  <li><strong>Formulation :</strong> Utilisez la forme "Atteinte à..." ou "Perte de..."</li>
                  <li><strong>Liaison :</strong> Chaque événement affecte une ou plusieurs valeurs métier</li>
                  <li><strong>Gravité :</strong> Cotez selon l'échelle ANSSI (1: Mineur à 4: Critique)</li>
                  <li><strong>Impact :</strong> Décrivez les conséquences opérationnelles et stratégiques</li>
                </ul>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations Générales */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-gray-500" />
                  Informations Générales
                </h4>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'événement redouté *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Atteinte à la confidentialité des données clients"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description détaillée *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Décrivez précisément cet événement redouté et ses manifestations..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Gravité */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Niveau de gravité (1-4) *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => handleInputChange('gravity', level)}
                        className={`p-3 text-sm rounded border ${
                          formData.gravity === level
                            ? 'bg-red-100 border-red-300 text-red-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium">
                          {level} - {EbiosUtils.formatScaleLabel('gravity', level as GravityScale)}
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {getGravityDescription(formData.gravity)}
                  </p>
                </div>
              </div>

              {/* Impacts et Liaisons */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <Link className="h-4 w-4 mr-2 text-gray-500" />
                  Impacts et Liaisons
                </h4>

                {/* Description de l'impact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description de l'impact *
                  </label>
                  <textarea
                    value={formData.impactDescription}
                    onChange={(e) => handleInputChange('impactDescription', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.impactDescription ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Décrivez l'impact direct de cet événement..."
                  />
                  {errors.impactDescription && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.impactDescription}
                    </p>
                  )}
                </div>

                {/* Description des conséquences */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conséquences organisationnelles *
                  </label>
                  <textarea
                    value={formData.consequencesDescription}
                    onChange={(e) => handleInputChange('consequencesDescription', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                      errors.consequencesDescription ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Décrivez les conséquences sur l'organisation..."
                  />
                  {errors.consequencesDescription && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.consequencesDescription}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sélection des Valeurs Métier */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <Target className="h-4 w-4 mr-2 text-gray-500" />
                Valeurs Métier Impactées *
              </h4>
              
              {businessValues.length > 0 ? (
                <>
                  <input
                    type="text"
                    placeholder="Rechercher une valeur métier..."
                    value={searchBusinessValues}
                    onChange={(e) => setSearchBusinessValues(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded">
                    {filteredBusinessValues.map((bv) => (
                      <label
                        key={bv.id}
                        className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.impactedBusinessValues.includes(bv.id)}
                          onChange={() => toggleBusinessValue(bv.id)}
                          className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{bv.name}</div>
                          <div className="text-xs text-gray-500">{bv.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Aucune valeur métier disponible</p>
                  <p className="text-xs">Créez d'abord des valeurs métier dans l'Atelier 1</p>
                </div>
              )}
              
              {errors.impactedBusinessValues && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {errors.impactedBusinessValues}
                </p>
              )}

              {formData.impactedBusinessValues.length > 0 && (
                <div className="text-sm text-gray-600">
                  <strong>Sélectionnées :</strong> {formData.impactedBusinessValues.length} valeur(s) métier
                </div>
              )}
            </div>

            {/* Sélection des Actifs de Soutien (Optionnel) */}
            {supportingAssets.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <Link className="h-4 w-4 mr-2 text-gray-500" />
                  Actifs de Soutien Concernés (Optionnel)
                </h4>
                
                <input
                  type="text"
                  placeholder="Rechercher un actif de soutien..."
                  value={searchAssets}
                  onChange={(e) => setSearchAssets(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded">
                  {filteredAssets.map((asset) => (
                    <label
                      key={asset.id}
                      className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.impactedSupportingAssets.includes(asset.id)}
                        onChange={() => toggleSupportingAsset(asset.id)}
                        className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                        <div className="text-xs text-gray-500">{asset.type}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {formData.impactedSupportingAssets.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <strong>Sélectionnés :</strong> {formData.impactedSupportingAssets.length} actif(s) de soutien
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Création...</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    <span>Créer l'Événement Redouté</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDreadedEventModal; 