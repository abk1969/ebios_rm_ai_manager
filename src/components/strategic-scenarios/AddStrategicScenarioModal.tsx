import React, { useState, useEffect } from 'react';
import { X, Target, Info, Calculator, AlertTriangle, Crosshair } from 'lucide-react';
import Button from '@/components/ui/button';
import { 
  EBIOS_SCALES,
  EbiosUtils 
} from '@/lib/ebios-constants';
import type { 
  GravityScale, 
  LikelihoodScale, 
  RiskLevel, 
  RiskSource, 
  DreadedEvent, 
  BusinessValue 
} from '@/types/ebios';

interface AddStrategicScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    riskSourceId: string;
    targetBusinessValueId: string;
    dreadedEventId: string;
    likelihood: LikelihoodScale;
    gravity: GravityScale;
  }) => void;
  missionId: string;
  riskSources: RiskSource[];
  businessValues: BusinessValue[];
  dreadedEvents: DreadedEvent[];
}

const AddStrategicScenarioModal: React.FC<AddStrategicScenarioModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  missionId,
  riskSources = [],
  businessValues = [],
  dreadedEvents = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    riskSourceId: '',
    targetBusinessValueId: '',
    dreadedEventId: '',
    likelihood: 2 as LikelihoodScale,
    gravity: 2 as GravityScale
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showHelp, setShowHelp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedRisk, setCalculatedRisk] = useState<RiskLevel | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        name: '',
        description: '',
        riskSourceId: '',
        targetBusinessValueId: '',
        dreadedEventId: '',
        likelihood: 2,
        gravity: 2
      });
      setErrors({});
      setShowHelp(false);
      setCalculatedRisk(null);
    }
  }, [isOpen]);

  // Calculer le risque automatiquement
  useEffect(() => {
    if (formData.gravity && formData.likelihood) {
      const riskLevel = EbiosUtils.calculateRiskLevel(formData.gravity, formData.likelihood);
      setCalculatedRisk(riskLevel);
    } else {
      setCalculatedRisk(null);
    }
  }, [formData.gravity, formData.likelihood]);

  // Auto-générer le nom du scénario
  useEffect(() => {
    if (formData.riskSourceId && formData.dreadedEventId && !formData.name) {
      const source = riskSources.find(rs => rs.id === formData.riskSourceId);
      const event = dreadedEvents.find(de => de.id === formData.dreadedEventId);
      if (source && event) {
        const autoName = `${source.name} → ${event.name}`;
        setFormData(prev => ({ ...prev, name: autoName }));
      }
    }
  }, [formData.riskSourceId, formData.dreadedEventId, riskSources, dreadedEvents]);

  // Auto-régler la gravité selon l'événement redouté sélectionné
  useEffect(() => {
    if (formData.dreadedEventId) {
      const event = dreadedEvents.find(de => de.id === formData.dreadedEventId);
      if (event) {
        setFormData(prev => ({ ...prev, gravity: event.gravity }));
      }
    }
  }, [formData.dreadedEventId, dreadedEvents]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du scénario est requis';
    } else if (formData.name.length < 5) {
      newErrors.name = 'Le nom doit contenir au moins 5 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    }

    if (!formData.riskSourceId) {
      newErrors.riskSourceId = 'Une source de risque doit être sélectionnée';
    }

    if (!formData.targetBusinessValueId) {
      newErrors.targetBusinessValueId = 'Une valeur métier doit être sélectionnée';
    }

    if (!formData.dreadedEventId) {
      newErrors.dreadedEventId = 'Un événement redouté doit être sélectionné';
    }

    // Validation de cohérence
    if (formData.targetBusinessValueId && formData.dreadedEventId) {
      const event = dreadedEvents.find(de => de.id === formData.dreadedEventId);
      if (event && event.businessValueId !== formData.targetBusinessValueId) {
        newErrors.consistency = 'L\'événement redouté sélectionné ne correspond pas à la valeur métier choisie';
      }
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
      setErrors({ submit: 'Erreur lors de la création du scénario' });
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

  const getRiskColor = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case 1: return 'bg-green-100 text-green-800 border-green-200';
      case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 3: return 'bg-orange-100 text-orange-800 border-orange-200';
      case 4: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Filtrer les événements redoutés selon la valeur métier sélectionnée
  const availableEvents = formData.targetBusinessValueId 
    ? dreadedEvents.filter(de => de.businessValueId === formData.targetBusinessValueId)
    : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-purple-50 px-6 py-4 border-b border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Crosshair className="h-6 w-6 text-purple-500" />
                <h3 className="ml-3 text-lg font-medium text-gray-900">
                  Créer un Scénario Stratégique
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  <Info className="h-4 w-4 mr-1" />
                  Aide
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
                <h4 className="font-medium text-gray-900 mb-2">Atelier 3 - Scénarios Stratégiques (ANSSI) :</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li><strong>Objectif :</strong> Croiser sources de risque et événements redoutés</li>
                  <li><strong>Séquence :</strong> Source de risque → Valeur métier → Événement redouté</li>
                  <li><strong>Évaluation :</strong> Vraisemblance (probabilité) et gravité (impact)</li>
                  <li><strong>Calcul :</strong> Niveau de risque automatique selon matrice ANSSI</li>
                </ul>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Calcul du Risque */}
            {calculatedRisk && (
              <div className={`p-4 rounded-lg border-2 ${getRiskColor(calculatedRisk)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Niveau de Risque :</span>
                  </div>
                  <div className="text-lg font-bold">
                    {calculatedRisk} - {EbiosUtils.formatScaleLabel('risk', calculatedRisk)}
                  </div>
                </div>
                <p className="mt-1 text-xs opacity-75">
                  Gravité: {formData.gravity} | Vraisemblance: {formData.likelihood}
                </p>
              </div>
            )}

            {errors.consistency && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {errors.consistency}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations Générales */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 border-b pb-2">
                  Informations Générales
                </h4>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du scénario *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Se génère automatiquement..."
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Décrivez brièvement ce scénario stratégique..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                {/* Évaluations */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Vraisemblance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vraisemblance *
                    </label>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleInputChange('likelihood', level)}
                          className={`w-full p-2 text-xs rounded border ${
                            formData.likelihood === level
                              ? 'bg-purple-100 border-purple-300 text-purple-700'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {level} - {EBIOS_SCALES.likelihood[level as LikelihoodScale]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gravité */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gravité *
                    </label>
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleInputChange('gravity', level)}
                          className={`w-full p-2 text-xs rounded border ${
                            formData.gravity === level
                              ? 'bg-orange-100 border-orange-300 text-orange-700'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {level} - {EBIOS_SCALES.gravity[level as GravityScale]}
                        </button>
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Se base sur l'événement redouté</p>
                  </div>
                </div>
              </div>

              {/* Sélections */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 border-b pb-2">
                  Éléments Constitutifs
                </h4>

                {/* Source de Risque */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source de Risque *
                  </label>
                  <select
                    value={formData.riskSourceId}
                    onChange={(e) => handleInputChange('riskSourceId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.riskSourceId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionner une source de risque</option>
                    {riskSources.map((rs) => (
                      <option key={rs.id} value={rs.id}>
                        {rs.name} ({rs.category})
                      </option>
                    ))}
                  </select>
                  {errors.riskSourceId && (
                    <p className="mt-1 text-sm text-red-600">{errors.riskSourceId}</p>
                  )}
                </div>

                {/* Valeur Métier Ciblée */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valeur Métier Ciblée *
                  </label>
                  <select
                    value={formData.targetBusinessValueId}
                    onChange={(e) => handleInputChange('targetBusinessValueId', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.targetBusinessValueId ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Sélectionner une valeur métier</option>
                    {businessValues.map((bv) => (
                      <option key={bv.id} value={bv.id}>
                        {bv.name}
                      </option>
                    ))}
                  </select>
                  {errors.targetBusinessValueId && (
                    <p className="mt-1 text-sm text-red-600">{errors.targetBusinessValueId}</p>
                  )}
                </div>

                {/* Événement Redouté */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Événement Redouté *
                  </label>
                  <select
                    value={formData.dreadedEventId}
                    onChange={(e) => handleInputChange('dreadedEventId', e.target.value)}
                    disabled={!formData.targetBusinessValueId}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.dreadedEventId ? 'border-red-300' : 'border-gray-300'
                    } ${!formData.targetBusinessValueId ? 'bg-gray-100' : ''}`}
                  >
                    <option value="">
                      {formData.targetBusinessValueId 
                        ? "Sélectionner un événement redouté" 
                        : "Sélectionnez d'abord une valeur métier"
                      }
                    </option>
                    {availableEvents.map((de) => (
                      <option key={de.id} value={de.id}>
                        {de.name} (Gravité: {de.gravity})
                      </option>
                    ))}
                  </select>
                  {errors.dreadedEventId && (
                    <p className="mt-1 text-sm text-red-600">{errors.dreadedEventId}</p>
                  )}
                </div>
              </div>
            </div>

            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
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
                className="flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Création...</span>
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4" />
                    <span>Créer le Scénario</span>
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

export default AddStrategicScenarioModal; 