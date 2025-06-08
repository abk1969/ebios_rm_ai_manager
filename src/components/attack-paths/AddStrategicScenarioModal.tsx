import React, { useState, useEffect } from 'react';
import { X, Sword, Info, Target, Link, Calculator, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/button';
import { 
  EBIOS_SCALES,
  EbiosUtils,
  RISK_MATRIX 
} from '@/lib/ebios-constants';
import type { GravityScale, LikelihoodScale, RiskLevel, RiskSource, DreadedEvent } from '@/types/ebios';

interface AddStrategicScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    riskSourceId: string;
    dreadedEventId: string;
    likelihood: LikelihoodScale;
    attackPath: string;
    assumptions: string;
    impactDescription: string;
    modeDescription: string;
  }) => void;
  missionId: string;
  riskSources: RiskSource[];
  dreadedEvents: DreadedEvent[];
}

const AddStrategicScenarioModal: React.FC<AddStrategicScenarioModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  missionId,
  riskSources = [],
  dreadedEvents = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    riskSourceId: '',
    dreadedEventId: '',
    likelihood: 2 as LikelihoodScale,
    attackPath: '',
    assumptions: '',
    impactDescription: '',
    modeDescription: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showHelp, setShowHelp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchRiskSources, setSearchRiskSources] = useState('');
  const [searchDreadedEvents, setSearchDreadedEvents] = useState('');

  // Calculer le niveau de risque automatiquement
  const [calculatedRisk, setCalculatedRisk] = useState<{
    level: RiskLevel;
    color: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        name: '',
        description: '',
        riskSourceId: '',
        dreadedEventId: '',
        likelihood: 2,
        attackPath: '',
        assumptions: '',
        impactDescription: '',
        modeDescription: ''
      });
      setErrors({});
      setShowHelp(false);
      setCalculatedRisk(null);
    }
  }, [isOpen]);

  // Calculer le risque quand les paramètres changent
  useEffect(() => {
    if (formData.dreadedEventId && formData.likelihood) {
      const selectedEvent = dreadedEvents.find(e => e.id === formData.dreadedEventId);
      if (selectedEvent) {
        const riskLevel = EbiosUtils.calculateRiskLevel(selectedEvent.gravity, formData.likelihood);
        const riskInfo = EbiosUtils.getRiskLevelInfo(riskLevel);
        setCalculatedRisk({
          level: riskLevel,
          color: riskInfo.color,
          description: riskInfo.label
        });
      }
    } else {
      setCalculatedRisk(null);
    }
  }, [formData.dreadedEventId, formData.likelihood, dreadedEvents]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du scénario stratégique est requis';
    } else if (formData.name.length < 5) {
      newErrors.name = 'Le nom doit contenir au moins 5 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length < 15) {
      newErrors.description = 'La description doit contenir au moins 15 caractères';
    }

    if (!formData.riskSourceId) {
      newErrors.riskSourceId = 'Une source de risque doit être sélectionnée';
    }

    if (!formData.dreadedEventId) {
      newErrors.dreadedEventId = 'Un événement redouté doit être sélectionné';
    }

    if (!formData.attackPath.trim()) {
      newErrors.attackPath = 'Le chemin d\'attaque est requis';
    }

    if (!formData.modeDescription.trim()) {
      newErrors.modeDescription = 'La description du mode opératoire est requise';
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

  // Auto-generate scenario name when source and event are selected
  useEffect(() => {
    if (formData.riskSourceId && formData.dreadedEventId && !formData.name) {
      const source = riskSources.find(rs => rs.id === formData.riskSourceId);
      const event = dreadedEvents.find(de => de.id === formData.dreadedEventId);
      if (source && event) {
        const autoName = `${source.name} → ${event.name}`;
        handleInputChange('name', autoName);
      }
    }
  }, [formData.riskSourceId, formData.dreadedEventId, riskSources, dreadedEvents]);

  const filteredRiskSources = riskSources.filter(rs =>
    rs.name.toLowerCase().includes(searchRiskSources.toLowerCase()) ||
    rs.description.toLowerCase().includes(searchRiskSources.toLowerCase())
  );

  const filteredDreadedEvents = dreadedEvents.filter(de =>
    de.name.toLowerCase().includes(searchDreadedEvents.toLowerCase()) ||
    de.description.toLowerCase().includes(searchDreadedEvents.toLowerCase())
  );

  const selectedRiskSource = riskSources.find(rs => rs.id === formData.riskSourceId);
  const selectedDreadedEvent = dreadedEvents.find(de => de.id === formData.dreadedEventId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          {/* Header */}
          <div className="bg-purple-50 px-6 py-4 border-b border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Sword className="h-6 w-6 text-purple-500" />
                <h3 className="ml-3 text-lg font-medium text-gray-900">
                  Ajouter un Scénario Stratégique
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
                <h4 className="font-medium text-gray-900 mb-2">Guide ANSSI - Scénarios Stratégiques :</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li><strong>Construction :</strong> Croisement d'une source de risque et d'un événement redouté</li>
                  <li><strong>Chemin d'attaque :</strong> Décrivez comment la source peut provoquer l'événement</li>
                  <li><strong>Vraisemblance :</strong> Évaluez la probabilité selon l'échelle ANSSI (1-4)</li>
                  <li><strong>Niveau de risque :</strong> Calculé automatiquement (gravité × vraisemblance)</li>
                  <li><strong>Mode opératoire :</strong> Détaillez les étapes et moyens nécessaires</li>
                </ul>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Calcul du Risque */}
            {calculatedRisk && (
              <div className={`p-4 rounded-lg border-2 ${
                calculatedRisk.level === 'critical' ? 'bg-red-50 border-red-200' :
                calculatedRisk.level === 'high' ? 'bg-orange-50 border-orange-200' :
                calculatedRisk.level === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Niveau de Risque Calculé :</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    calculatedRisk.level === 'critical' ? 'bg-red-100 text-red-800' :
                    calculatedRisk.level === 'high' ? 'bg-orange-100 text-orange-800' :
                    calculatedRisk.level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {calculatedRisk.description}
                  </div>
                </div>
                {selectedDreadedEvent && (
                  <p className="mt-2 text-xs text-gray-600">
                    Gravité: {selectedDreadedEvent.gravity} | Vraisemblance: {formData.likelihood} | 
                    Risque: {EbiosUtils.calculateRiskLevel(selectedDreadedEvent.gravity, formData.likelihood)}
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations Générales */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <Sword className="h-4 w-4 mr-2 text-gray-500" />
                  Informations Générales
                </h4>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du scénario stratégique *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Cybercriminels → Atteinte confidentialité données"
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
                    Description du scénario *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Décrivez le scénario d'attaque dans son ensemble..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Vraisemblance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vraisemblance (1-4) *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => handleInputChange('likelihood', level)}
                        className={`p-3 text-sm rounded border ${
                          formData.likelihood === level
                            ? 'bg-purple-100 border-purple-300 text-purple-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium">
                          {level} - {EbiosUtils.formatScaleLabel('likelihood', level as LikelihoodScale)}
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Évaluez la probabilité que ce scénario se réalise
                  </p>
                </div>
              </div>

              {/* Éléments Constitutifs */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <Link className="h-4 w-4 mr-2 text-gray-500" />
                  Éléments Constitutifs
                </h4>

                {/* Chemin d'attaque */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chemin d'attaque *
                  </label>
                  <textarea
                    value={formData.attackPath}
                    onChange={(e) => handleInputChange('attackPath', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.attackPath ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Décrivez le chemin logique de l'attaque..."
                  />
                  {errors.attackPath && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.attackPath}
                    </p>
                  )}
                </div>

                {/* Mode opératoire */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mode opératoire *
                  </label>
                  <textarea
                    value={formData.modeDescription}
                    onChange={(e) => handleInputChange('modeDescription', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.modeDescription ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Détaillez le mode opératoire et les moyens nécessaires..."
                  />
                  {errors.modeDescription && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.modeDescription}
                    </p>
                  )}
                </div>

                {/* Hypothèses et présupposés */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hypothèses et présupposés
                  </label>
                  <textarea
                    value={formData.assumptions}
                    onChange={(e) => handleInputChange('assumptions', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Listez les hypothèses nécessaires à ce scénario..."
                  />
                </div>
              </div>
            </div>

            {/* Sélection Source de Risque */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <Target className="h-4 w-4 mr-2 text-gray-500" />
                Source de Risque *
              </h4>
              
              {riskSources.length > 0 ? (
                <>
                  <input
                    type="text"
                    placeholder="Rechercher une source de risque..."
                    value={searchRiskSources}
                    onChange={(e) => setSearchRiskSources(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    {filteredRiskSources.map((rs) => (
                      <label
                        key={rs.id}
                        className={`flex items-start p-3 border rounded cursor-pointer transition-colors ${
                          formData.riskSourceId === rs.id
                            ? 'border-purple-300 bg-purple-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="riskSource"
                          value={rs.id}
                          checked={formData.riskSourceId === rs.id}
                          onChange={() => handleInputChange('riskSourceId', rs.id)}
                          className="h-4 w-4 text-purple-600 mt-1"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{rs.name}</div>
                          <div className="text-xs text-gray-500">{rs.category}</div>
                          <div className="text-xs text-gray-400 mt-1">{rs.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Aucune source de risque disponible</p>
                  <p className="text-xs">Créez d'abord des sources de risque dans l'Atelier 2</p>
                </div>
              )}
              
              {errors.riskSourceId && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {errors.riskSourceId}
                </p>
              )}
            </div>

            {/* Sélection Événement Redouté */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-gray-500" />
                Événement Redouté *
              </h4>
              
              {dreadedEvents.length > 0 ? (
                <>
                  <input
                    type="text"
                    placeholder="Rechercher un événement redouté..."
                    value={searchDreadedEvents}
                    onChange={(e) => setSearchDreadedEvents(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                    {filteredDreadedEvents.map((de) => (
                      <label
                        key={de.id}
                        className={`flex items-start p-3 border rounded cursor-pointer transition-colors ${
                          formData.dreadedEventId === de.id
                            ? 'border-purple-300 bg-purple-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="dreadedEvent"
                          value={de.id}
                          checked={formData.dreadedEventId === de.id}
                          onChange={() => handleInputChange('dreadedEventId', de.id)}
                          className="h-4 w-4 text-purple-600 mt-1"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{de.name}</div>
                          <div className="text-xs text-gray-500">Gravité: {de.gravity}/4</div>
                          <div className="text-xs text-gray-400 mt-1">{de.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>Aucun événement redouté disponible</p>
                  <p className="text-xs">Créez d'abord des événements redoutés dans l'Atelier 1</p>
                </div>
              )}
              
              {errors.dreadedEventId && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {errors.dreadedEventId}
                </p>
              )}
            </div>

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
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Création...</span>
                  </>
                ) : (
                  <>
                    <Sword className="h-4 w-4" />
                    <span>Créer le Scénario Stratégique</span>
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