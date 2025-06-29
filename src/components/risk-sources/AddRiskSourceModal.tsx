import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Info, Users, Zap, Target, Lightbulb, Sparkles } from 'lucide-react';
import Button from '@/components/ui/button';
import {
  RISK_SOURCE_CATEGORIES,
  EBIOS_SCALES,
  EbiosUtils
} from '@/lib/ebios-constants';
import type { LikelihoodScale, BusinessValue, RiskSource } from '@/types/ebios';
import { EnhancedSuggestionsService } from '@/services/ai/EnhancedSuggestionsService';

interface AddRiskSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    category: keyof typeof RISK_SOURCE_CATEGORIES;
    pertinence: LikelihoodScale;
    expertise: 'limited' | 'moderate' | 'high' | 'expert';
    resources: 'limited' | 'moderate' | 'high' | 'unlimited';
    motivation: LikelihoodScale;
  }) => void;
  missionId: string;
  businessValues?: BusinessValue[];
  existingRiskSources?: RiskSource[];
}

const AddRiskSourceModal: React.FC<AddRiskSourceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  missionId,
  businessValues = [],
  existingRiskSources = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'cybercriminal' as keyof typeof RISK_SOURCE_CATEGORIES,
    pertinence: 2 as LikelihoodScale,
    expertise: 'moderate' as 'limited' | 'moderate' | 'high' | 'expert',
    resources: 'moderate' as 'limited' | 'moderate' | 'high' | 'unlimited',
    motivation: 2 as LikelihoodScale
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showHelp, setShowHelp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom de la source de risque est requis';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Le nom doit contenir au moins 3 caractères';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La description doit contenir au moins 10 caractères';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
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
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'cybercriminal',
        pertinence: 2,
        expertise: 'moderate',
        resources: 'moderate',
        motivation: 2
      });
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

  // 🆕 AMÉLIORATION: Génération de suggestions IA
  useEffect(() => {
    if (businessValues.length > 0) {
      const suggestions = EnhancedSuggestionsService.generateEnhancedRiskSources(
        businessValues,
        existingRiskSources
      );
      setAiSuggestions(suggestions);
    }
  }, [businessValues, existingRiskSources]);

  const applySuggestion = (suggestion: any) => {
    setFormData(prev => ({
      ...prev,
      name: suggestion.title,
      description: suggestion.description,
      category: suggestion.category || prev.category,
      expertise: suggestion.expertise || prev.expertise,
      resources: suggestion.resources || prev.resources,
      motivation: suggestion.motivation || prev.motivation
    }));
    setShowSuggestions(false);
  };

  const getCategoryDescription = (category: keyof typeof RISK_SOURCE_CATEGORIES) => {
    const descriptions = {
      cybercriminal: 'Organisations criminelles spécialisées dans les cyberattaques',
      terrorist: 'Groupes terroristes utilisant le cyber comme vecteur d\'attaque',
      activist: 'Hacktivistes et groupes de protestation numérique',
      state: 'Acteurs étatiques et services de renseignement',
      insider: 'Menaces internes (employés, prestataires)',
      competitor: 'Concurrents économiques et espionnage industriel',
      natural: 'Catastrophes naturelles et événements climatiques'
    };
    return descriptions[category] || '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-orange-50 px-6 py-4 border-b border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="h-6 w-6 text-orange-500" />
                <h3 className="ml-3 text-lg font-medium text-gray-900">
                  Ajouter une Source de Risque
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="flex items-center space-x-1 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Suggestions IA ({aiSuggestions.length})</span>
                </Button>

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
            
            {/* 🆕 AMÉLIORATION: Suggestions IA enrichies */}
            {showSuggestions && aiSuggestions.length > 0 && (
              <div className="mt-4 p-4 bg-purple-50 rounded border border-purple-200">
                <h4 className="font-medium text-purple-900 mb-3 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Suggestions IA basées sur vos valeurs métier
                </h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.id}
                      className="bg-white p-3 rounded border border-purple-100 hover:border-purple-300 cursor-pointer transition-colors"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 text-sm">{suggestion.title}</h5>
                          <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className={`px-2 py-1 text-xs rounded ${
                              suggestion.priority === 'critical' ? 'bg-red-100 text-red-700' :
                              suggestion.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                              suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {suggestion.priority}
                            </span>
                            <span className="text-xs text-purple-600">
                              Confiance: {Math.round(suggestion.confidence * 100)}%
                            </span>
                          </div>
                          {suggestion.frameworks?.mitre && (
                            <div className="mt-1">
                              <span className="text-xs text-gray-500">
                                MITRE: {suggestion.frameworks.mitre.slice(0, 2).join(', ')}
                                {suggestion.frameworks.mitre.length > 2 && '...'}
                              </span>
                            </div>
                          )}
                        </div>
                        <Lightbulb className="h-4 w-4 text-purple-500 ml-2 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-purple-600 mt-3">
                  💡 Cliquez sur une suggestion pour l'appliquer automatiquement
                </p>
              </div>
            )}

            {showHelp && (
              <div className="mt-4 p-4 bg-white rounded border">
                <h4 className="font-medium text-gray-900 mb-2">Guide ANSSI - Sources de Risque :</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li><strong>Identification :</strong> Qui peut s'intéresser à vos valeurs métier ?</li>
                  <li><strong>Catégorisation :</strong> Classez selon les 7 types EBIOS RM</li>
                  <li><strong>Caractérisation :</strong> Évaluez expertise, ressources et motivation</li>
                  <li><strong>Pertinence :</strong> Cotez la probabilité selon l'échelle ANSSI (1-4)</li>
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
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  Informations Générales
                </h4>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la source de risque *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ex: Cybercriminels spécialisés en ransomware"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.name}
                    </p>
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
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Décrivez les caractéristiques et motivations de cette source de risque..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie EBIOS RM *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {Object.entries(RISK_SOURCE_CATEGORIES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {getCategoryDescription(formData.category)}
                  </p>
                </div>
              </div>

              {/* Caractérisation */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-gray-500" />
                  Caractérisation ANSSI
                </h4>

                {/* Expertise */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Niveau d'expertise
                  </label>
                  <select
                    value={formData.expertise}
                    onChange={(e) => handleInputChange('expertise', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="limited">Limitée - Script kiddies, débutants</option>
                    <option value="moderate">Modérée - Hackers confirmés</option>
                    <option value="high">Élevée - Experts spécialisés</option>
                    <option value="expert">Expert - Professionnels aguerris</option>
                  </select>
                </div>

                {/* Ressources */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ressources disponibles
                  </label>
                  <select
                    value={formData.resources}
                    onChange={(e) => handleInputChange('resources', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="limited">Limitées - Moyens personnels</option>
                    <option value="moderate">Modérées - Financement modeste</option>
                    <option value="high">Importantes - Moyens conséquents</option>
                    <option value="unlimited">Illimitées - Financement étatique</option>
                  </select>
                </div>

                {/* Motivation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Niveau de motivation (1-4)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => handleInputChange('motivation', level)}
                        className={`p-2 text-sm rounded border ${
                          formData.motivation === level
                            ? 'bg-orange-100 border-orange-300 text-orange-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {level} - {EbiosUtils.formatScaleLabel('likelihood', level as LikelihoodScale)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pertinence */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pertinence pour votre organisation (1-4)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => handleInputChange('pertinence', level)}
                        className={`p-2 text-sm rounded border ${
                          formData.pertinence === level
                            ? 'bg-orange-100 border-orange-300 text-orange-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {level} - {EbiosUtils.formatScaleLabel('likelihood', level as LikelihoodScale)}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Évaluez la probabilité que cette source de risque s'intéresse à votre organisation
                  </p>
                </div>
              </div>
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
                className="flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Création...</span>
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4" />
                    <span>Créer la Source de Risque</span>
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

export default AddRiskSourceModal;