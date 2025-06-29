/**
 * 🎯 MODAL D'AJOUT DE BIENS ESSENTIELS (EBIOS RM)
 * Conforme à la logique ANSSI - Primary Assets
 */

import React, { useState } from 'react';
import { X, Database, AlertTriangle, Info } from 'lucide-react';
import Button from '../ui/button';
import type { EssentialAsset, BusinessValue } from '../../types/ebios';

interface AddEssentialAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (asset: Omit<EssentialAsset, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  missionId: string;
  businessValues: BusinessValue[];
  initialData?: EssentialAsset;
}

const ASSET_TYPES = [
  { value: 'process', label: 'Processus', description: 'Processus métier, procédures' },
  { value: 'information', label: 'Information', description: 'Données, documents, bases de données' },
  { value: 'know_how', label: 'Savoir-faire', description: 'Compétences, algorithmes, méthodes' }
] as const;

const ASSET_CATEGORIES = [
  { value: 'mission_critical', label: 'Critique pour la mission', description: 'Indispensable à la mission' },
  { value: 'business_critical', label: 'Critique pour l\'activité', description: 'Important pour l\'activité' },
  { value: 'operational', label: 'Opérationnel', description: 'Support aux opérations' }
] as const;

const CRITICALITY_LEVELS = [
  { value: 'essential', label: 'Essentiel', description: 'Indispensable - arrêt d\'activité si compromis' },
  { value: 'important', label: 'Important', description: 'Impact significatif sur l\'activité' },
  { value: 'useful', label: 'Utile', description: 'Impact limité sur l\'activité' }
] as const;

const AddEssentialAssetModal: React.FC<AddEssentialAssetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  missionId,
  businessValues,
  initialData
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    type: initialData?.type || 'process' as const,
    category: initialData?.category || 'business_critical' as const,
    criticalityLevel: initialData?.criticalityLevel || 'important' as const,
    businessValueIds: initialData?.businessValueIds || [],
    confidentialityRequirement: initialData?.confidentialityRequirement || 2,
    integrityRequirement: initialData?.integrityRequirement || 3,
    availabilityRequirement: initialData?.availabilityRequirement || 3,
    owner: initialData?.owner || '',
    custodian: initialData?.custodian || '',
    users: initialData?.users || [],
    supportingAssets: initialData?.supportingAssets || [],
    dreadedEvents: initialData?.dreadedEvents || [],
    stakeholders: initialData?.stakeholders || []
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.name.trim()) {
      newErrors.push('Le nom du bien essentiel est obligatoire');
    } else if (formData.name.trim().length < 2) {
      newErrors.push('Le nom doit contenir au moins 2 caractères');
    }

    if (!formData.description.trim()) {
      newErrors.push('La description est obligatoire');
    }

    if (formData.businessValueIds.length === 0) {
      newErrors.push('Au moins une valeur métier doit être sélectionnée');
    }

    if (!formData.owner.trim()) {
      newErrors.push('Le propriétaire métier est obligatoire');
    }

    // Validation des exigences de sécurité
    const securityRequirements = [
      { field: 'confidentialityRequirement', label: 'Confidentialité' },
      { field: 'integrityRequirement', label: 'Intégrité' },
      { field: 'availabilityRequirement', label: 'Disponibilité' }
    ];

    securityRequirements.forEach(req => {
      const value = formData[req.field as keyof typeof formData] as number;
      if (value < 1 || value > 4) {
        newErrors.push(`L'exigence de ${req.label} doit être entre 1 et 4`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        missionId
      });
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du bien essentiel:', error);
      setErrors(['Erreur lors de la sauvegarde']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleBusinessValueToggle = (valueId: string) => {
    const newIds = formData.businessValueIds.includes(valueId)
      ? formData.businessValueIds.filter(id => id !== valueId)
      : [...formData.businessValueIds, valueId];
    handleInputChange('businessValueIds', newIds);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Database className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                {initialData ? 'Modifier le bien essentiel' : 'Ajouter un bien essentiel'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Erreurs de validation</h4>
                  <ul className="mt-2 text-sm text-red-800 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Biens Essentiels EBIOS RM</h4>
                <p className="text-sm text-blue-800 mt-1">
                  Les biens essentiels sont les informations, processus et savoir-faire indispensables 
                  à l'organisation. Ils supportent les valeurs métier et sont protégés par les biens supports.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du bien essentiel *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Base de données clients, Processus de facturation..."
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Décrivez le bien essentiel, son rôle et son importance..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type EBIOS RM *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {ASSET_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label} - {type.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {ASSET_CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label} - {category.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau de criticité *
              </label>
              <select
                value={formData.criticalityLevel}
                onChange={(e) => handleInputChange('criticalityLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {CRITICALITY_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label} - {level.description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Propriétaire métier *
              </label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => handleInputChange('owner', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Direction Commerciale, DPO..."
                required
              />
            </div>
          </div>

          {/* Exigences de sécurité */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Exigences de sécurité (1-4)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confidentialité *
                </label>
                <select
                  value={formData.confidentialityRequirement}
                  onChange={(e) => handleInputChange('confidentialityRequirement', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value={1}>1 - Public</option>
                  <option value={2}>2 - Interne</option>
                  <option value={3}>3 - Confidentiel</option>
                  <option value={4}>4 - Secret</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intégrité *
                </label>
                <select
                  value={formData.integrityRequirement}
                  onChange={(e) => handleInputChange('integrityRequirement', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value={1}>1 - Faible</option>
                  <option value={2}>2 - Modérée</option>
                  <option value={3}>3 - Élevée</option>
                  <option value={4}>4 - Très élevée</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disponibilité *
                </label>
                <select
                  value={formData.availabilityRequirement}
                  onChange={(e) => handleInputChange('availabilityRequirement', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value={1}>1 - Faible</option>
                  <option value={2}>2 - Modérée</option>
                  <option value={3}>3 - Élevée</option>
                  <option value={4}>4 - Très élevée</option>
                </select>
              </div>
            </div>
          </div>

          {/* Valeurs métier supportées */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Valeurs métier supportées *</h3>
            {businessValues.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucune valeur métier disponible. Créez d'abord des valeurs métier.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {businessValues.map((value) => (
                  <label key={value.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.businessValueIds.includes(value.id)}
                      onChange={() => handleBusinessValueToggle(value.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{value.name}</div>
                      <div className="text-sm text-gray-600">{value.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
              disabled={isSubmitting || businessValues.length === 0}
            >
              {isSubmitting ? 'Enregistrement...' : initialData ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEssentialAssetModal;
