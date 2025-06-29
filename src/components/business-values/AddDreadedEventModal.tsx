import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Info, Target, Link, Sparkles, Shield, Activity } from 'lucide-react';
import Button from '@/components/ui/button';
import { 
  EBIOS_SCALES,
  EbiosUtils 
} from '@/lib/ebios-constants';
import type { GravityScale, BusinessValue, SupportingAsset, DreadedEvent } from '@/types/ebios';
import AIFieldSuggestion, { useAISuggestions } from '@/components/ai/AIFieldSuggestion';
import { cn } from '@/lib/utils';

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
    // Nouveau
    impactsList?: string[];
    valeurMetierNom?: string;
  }) => void;
  missionId: string;
  businessValues: BusinessValue[];
  supportingAssets: SupportingAsset[];
  isAccessImport?: boolean; // Nouveau
  existingEvent?: Partial<DreadedEvent>; // Nouveau
}

// Nouveau
const IMPACT_TYPES = [
  { id: 'availability', label: 'Disponibilité', icon: Activity, color: 'blue' },
  { id: 'integrity', label: 'Intégrité', icon: Shield, color: 'green' },
  { id: 'confidentiality', label: 'Confidentialité', icon: Shield, color: 'purple' },
  { id: 'authenticity', label: 'Authenticité', icon: Shield, color: 'orange' },
  { id: 'non_repudiation', label: 'Non-répudiation', icon: Shield, color: 'yellow' }
];

const AddDreadedEventModal: React.FC<AddDreadedEventModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  missionId,
  businessValues = [],
  supportingAssets = [],
  isAccessImport = false,
  existingEvent
}) => {
  const [formData, setFormData] = useState({
    name: existingEvent?.name || '',
    description: existingEvent?.description || '',
    impactedBusinessValues: [] as string[],
    impactedSupportingAssets: [] as string[],
    gravity: (existingEvent?.gravity || 2) as GravityScale,
    impactDescription: '',
    consequencesDescription: existingEvent?.consequences || '',
    // Nouveau
    impactsList: existingEvent?.impactsList || [] as string[],
    valeurMetierNom: existingEvent?.valeurMetierNom || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showHelp, setShowHelp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchBusinessValues, setSearchBusinessValues] = useState('');
  const [searchAssets, setSearchAssets] = useState('');
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);

  // Nouveau
  const { suggestions: nameSuggestions, isLoading: nameLoading, refresh: refreshName } = useAISuggestions(
    'name',
    { businessValues: formData.impactedBusinessValues, impacts: formData.impactsList },
    [formData.impactedBusinessValues, formData.impactsList]
  );

  // Nouveau
  const { suggestions: consequenceSuggestions, isLoading: consequenceLoading } = useAISuggestions(
    'consequences',
    { name: formData.name, gravity: formData.gravity },
    [formData.name, formData.gravity]
  );

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
        consequencesDescription: '',
        impactsList: [],
        valeurMetierNom: ''
      });
      setErrors({});
      setShowHelp(false);
    }
  }, [isOpen]);

  // Nouveau
  useEffect(() => {
    if (formData.impactsList.length > 0 && formData.impactedBusinessValues.length > 0 && !formData.name) {
      const impactNames = formData.impactsList.map(id => 
        IMPACT_TYPES.find(t => t.id === id)?.label || id
      ).join(', ');
      
      const businessValue = businessValues.find(bv => bv.id === formData.impactedBusinessValues[0]);
      if (businessValue) {
        setFormData(prev => ({
          ...prev,
          name: `Atteinte à la ${impactNames} de ${businessValue.name}`
        }));
      }
    }
  }, [formData.impactsList, formData.impactedBusinessValues, businessValues]);

  // Nouveau
  useEffect(() => {
    if (formData.gravity && formData.impactsList.length > 0) {
      setShowImpactAnalysis(true);
    }
  }, [formData.gravity, formData.impactsList]);

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

    if (formData.impactedBusinessValues.length === 0 && !isAccessImport) {
      newErrors.impactedBusinessValues = 'Au moins une valeur métier doit être sélectionnée';
    }

    if (formData.impactsList.length === 0) {
      newErrors.impactsList = 'Au moins un type d\'impact doit être sélectionné';
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
      // 🔧 CORRECTION: Enrichir les données avec les champs requis
      const enrichedData = {
        ...formData,
        missionId, // Ajouter missionId requis
        essentialAssetId: formData.impactedBusinessValues[0] || '', // 🔧 CORRECTION: Mapper vers essentialAssetId
        businessValueId: formData.impactedBusinessValues[0] || '', // Maintenir pour compatibilité
        impactType: 'availability' as const, // Valeur par défaut
        consequences: formData.consequencesDescription || formData.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('🚨 Données événement redouté à créer:', enrichedData);
      await onSubmit(enrichedData);
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

  const toggleImpactType = (impactId: string) => {
    const isSelected = formData.impactsList.includes(impactId);
    if (isSelected) {
      handleInputChange('impactsList', 
        formData.impactsList.filter(id => id !== impactId)
      );
    } else {
      handleInputChange('impactsList', 
        [...formData.impactsList, impactId]
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
                  {existingEvent ? 'Modifier' : 'Ajouter'} un Événement Redouté
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

          {/* 🆕 Mode Access */}
          {isAccessImport && (
            <div className="bg-blue-50 px-6 py-3 border-b border-blue-200">
              <div className="flex items-center">
                <Info className="h-5 w-5 text-blue-400 mr-2" />
                <p className="text-sm text-blue-800">
                  Mode Import Access : Les références textuelles seront préservées et les impacts multiples sont supportés.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations Générales */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-gray-500" />
                  Informations Générales
                </h4>

                {/* 🆕 Référence Access */}
                {isAccessImport && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valeur métier (référence Access)
                    </label>
                    <input
                      type="text"
                      value={formData.valeurMetierNom}
                      onChange={(e) => handleInputChange('valeurMetierNom', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Nom de la valeur métier dans Access"
                    />
                  </div>
                )}

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
                  
                  {/* 🆕 Suggestions IA */}
                  <AIFieldSuggestion
                    fieldName="nom de l'événement"
                    fieldType="text"
                    suggestions={nameSuggestions}
                    onApply={(value) => handleInputChange('name', value)}
                    onRefresh={refreshName}
                    isLoading={nameLoading}
                  />
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

                {/* 🆕 Types d'impacts */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Types d'impacts *
                  </label>
                  <div className="space-y-2">
                    {IMPACT_TYPES.map((impact) => (
                      <label
                        key={impact.id}
                        className="flex items-center p-2 rounded border border-gray-200 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.impactsList.includes(impact.id)}
                          onChange={() => toggleImpactType(impact.id)}
                          className="h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                        />
                        <impact.icon className={cn(
                          "h-4 w-4 ml-2",
                          `text-${impact.color}-500`
                        )} />
                        <span className="ml-2 text-sm font-medium text-gray-900">
                          {impact.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.impactsList && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {errors.impactsList}
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
                  
                  {/* 🆕 Suggestions IA pour conséquences */}
                  <AIFieldSuggestion
                    fieldName="conséquences"
                    fieldType="textarea"
                    suggestions={consequenceSuggestions}
                    onApply={(value) => handleInputChange('consequencesDescription', value)}
                    isLoading={consequenceLoading}
                  />
                </div>
              </div>
            </div>

            {/* 🆕 Analyse d'impact IA */}
            {showImpactAnalysis && formData.impactsList.length > 0 && (
              <div className="rounded-md bg-purple-50 p-4">
                <div className="flex">
                  <Sparkles className="h-5 w-5 text-purple-400 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-purple-800">
                      Analyse d'impact IA
                    </h3>
                    <p className="mt-2 text-sm text-purple-700">
                      {generateImpactAnalysis(formData.impactsList, formData.gravity)}
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                    <span>{existingEvent ? 'Modifier' : 'Créer'} l'Événement Redouté</span>
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

// Nouveau
function generateImpactAnalysis(impacts: string[], gravity: GravityScale): string {
  let analysis = '';
  
  // Analyse basée sur les combinaisons d'impacts
  if (impacts.includes('availability') && impacts.includes('integrity')) {
    analysis = "Impact combiné détecté : La perte simultanée de disponibilité et d'intégrité peut entraîner une désorganisation complète des processus. ";
  } else if (impacts.includes('confidentiality') && impacts.includes('authenticity')) {
    analysis = "Risque de fuite de données sensibles avec usurpation d'identité possible. ";
  }
  
  // Ajout basé sur la gravité
  if (gravity >= 3) {
    analysis += "La gravité élevée nécessite des mesures de sécurité renforcées et un plan de continuité d'activité. ";
  }
  
  // Recommandations
  if (impacts.includes('availability')) {
    analysis += "Recommandation : Mettre en place des solutions de haute disponibilité et des sauvegardes régulières.";
  }
  
  return analysis || "L'IA analyse les impacts sélectionnés pour proposer des mesures adaptées...";
} 