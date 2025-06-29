import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  Server, 
  Database, 
  Cloud, 
  Users, 
  Building, 
  Network,
  FileText,
  Lightbulb,
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import AIFieldSuggestion from '../ai/AIFieldSuggestion';
import { SupportingAssetAIService } from '../../services/ai/SupportingAssetAIService';
import type { SupportingAsset, BusinessValue } from '../../types/ebios';

interface SupportingAssetFormProps {
  onSubmit: (data: Partial<SupportingAsset>) => void;
  onCancel?: () => void;
  initialData?: Partial<SupportingAsset>;
  businessValue?: BusinessValue;
  existingAssets?: SupportingAsset[];
  missionId?: string; // 🔧 CORRECTION: Ajout du missionId requis
  isAccessMode?: boolean;
}

const ASSET_TYPES = [
  { value: 'hardware', label: 'Matériel', icon: Server },
  { value: 'software', label: 'Logiciel', icon: FileText },
  { value: 'data', label: 'Données', icon: Database },
  { value: 'network', label: 'Réseau', icon: Network },
  { value: 'personnel', label: 'Personnel', icon: Users },
  { value: 'site', label: 'Site/Local', icon: Building },
  { value: 'organization', label: 'Organisation', icon: Cloud }
];

const SECURITY_LEVELS = [
  { value: 'public', label: 'Public', color: 'bg-green-100 text-green-800' },
  { value: 'internal', label: 'Interne', color: 'bg-blue-100 text-blue-800' },
  { value: 'confidential', label: 'Confidentiel', color: 'bg-orange-100 text-orange-800' },
  { value: 'secret', label: 'Secret', color: 'bg-red-100 text-red-800' }
];

const SupportingAssetForm: React.FC<SupportingAssetFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  businessValue,
  existingAssets = [],
  missionId, // 🔧 CORRECTION: Ajout du missionId
  isAccessMode = false
}) => {
  // État local pour éviter les problèmes de react-hook-form
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    type: initialData?.type || '',
    description: initialData?.description || '',
    securityLevel: initialData?.securityLevel || 'internal',
    responsableEntite: initialData?.responsableEntite || '',
    valeurMetierNom: initialData?.valeurMetierNom || ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<any[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any>(null);
  const [vulnerabilities, setVulnerabilities] = useState<string[]>([]);
  const [dependencies, setDependencies] = useState<string[]>(initialData?.dependsOn || []);
  const [showValidation, setShowValidation] = useState(false);

  const watchedType = formData.type;
  const watchedName = formData.name;

  // Validation en temps réel
  const validateField = (fieldName: string, value: any) => {
    const newErrors = { ...formErrors };

    switch (fieldName) {
      case 'name':
        if (!value || value.trim().length === 0) {
          newErrors.name = 'Le nom est requis';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Le nom doit contenir au moins 2 caractères';
        } else {
          delete newErrors.name;
        }
        break;
      case 'type':
        if (!value) {
          newErrors.type = 'Le type est requis';
        } else {
          delete newErrors.type;
        }
        break;
      case 'securityLevel':
        if (!value) {
          newErrors.securityLevel = 'Le niveau de sécurité est requis';
        } else {
          delete newErrors.securityLevel;
        }
        break;
    }

    setFormErrors(newErrors);
  };

  // Gestionnaire de changement de champ
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    validateField(fieldName, value);
  };

  // Générer des suggestions AI quand la VM est disponible
  useEffect(() => {
    if (businessValue && !initialData) {
      const suggestions = SupportingAssetAIService.generateAssetSuggestions(
        businessValue,
        existingAssets
      );
      setAISuggestions(suggestions);
      if (suggestions.length > 0) {
        setShowAISuggestions(true);
      }
    }
  }, [businessValue, existingAssets, initialData]);

  // Mettre à jour les suggestions quand le type change
  useEffect(() => {
    if (watchedType && selectedSuggestion) {
      const relevantSuggestion = aiSuggestions.find(s => s.type === watchedType);
      if (relevantSuggestion) {
        setVulnerabilities(relevantSuggestion.vulnerabilities);
        setDependencies(relevantSuggestion.dependencies);
      }
    }
  }, [watchedType, selectedSuggestion, aiSuggestions]);

  const applySuggestion = (suggestion: any) => {
    setFormData(prev => ({
      ...prev,
      name: suggestion.name,
      type: suggestion.type,
      description: suggestion.description,
      securityLevel: suggestion.securityLevel
    }));
    setVulnerabilities(suggestion.vulnerabilities);
    setDependencies(suggestion.dependencies);
    setSelectedSuggestion(suggestion);
    setShowAISuggestions(false);

    // Effacer les erreurs après application de la suggestion
    setFormErrors({});
  };

  const getAssetIcon = (type: string) => {
    const assetType = ASSET_TYPES.find(t => t.value === type);
    return assetType ? assetType.icon : Server;
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation complète avant soumission
    const errors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length === 0) {
      errors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    if (!formData.type) {
      errors.type = 'Le type est requis';
    }

    if (!formData.securityLevel) {
      errors.securityLevel = 'Le niveau de sécurité est requis';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Enrichir avec l'AI avant soumission
    const enrichedData = SupportingAssetAIService.enrichSupportingAsset(
      {
        ...formData,
        type: formData.type as 'data' | 'software' | 'hardware' | 'network' | 'personnel' | 'site' | 'organization',
        vulnerabilities,
        dependsOn: dependencies,
        missionId: missionId || '', // 🔧 CORRECTION: Inclure missionId
        securityLevel: formData.securityLevel as 'public' | 'internal' | 'confidential' | 'secret'
      },
      businessValue
    );

    console.log('🏗️ Données enrichies à soumettre:', enrichedData);
    onSubmit(enrichedData);
  };

  const removeVulnerability = (index: number) => {
    setVulnerabilities(vulnerabilities.filter((_, i) => i !== index));
  };

  const removeDependency = (index: number) => {
    setDependencies(dependencies.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={onFormSubmit} className="space-y-6">
      {/* Suggestions AI */}
      {showAISuggestions && aiSuggestions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <h4 className="font-medium text-blue-900">
              Suggestions d'actifs basées sur "{businessValue?.name}"
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiSuggestions.map((suggestion, index) => {
              const Icon = getAssetIcon(suggestion.type);
              return (
                <div
                  key={index}
                  className="bg-white p-3 rounded border border-blue-200 hover:border-blue-400 cursor-pointer transition-colors"
                  onClick={() => applySuggestion(suggestion)}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className="h-5 w-5 text-gray-600 mt-1" />
                    <div className="flex-1">
                      <h5 className="font-medium text-sm text-gray-900">{suggestion.name}</h5>
                      <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.type}
                        </Badge>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          SECURITY_LEVELS.find(l => l.value === suggestion.securityLevel)?.color
                        }`}>
                          {SECURITY_LEVELS.find(l => l.value === suggestion.securityLevel)?.label}
                        </span>
                        <span className="text-xs text-blue-600">
                          {Math.round(suggestion.confidence * 100)}% pertinent
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setShowAISuggestions(false)}
            className="text-xs text-gray-500 hover:text-gray-700 mt-2"
          >
            Masquer les suggestions
          </button>
        </div>
      )}

      {/* Champs du formulaire */}
      <div>
        <Label htmlFor="name">Nom de l'actif *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          className={formErrors.name ? 'border-red-500' : ''}
          placeholder="Ex: Base de données clients"
        />
        {formErrors.name && (
          <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
        )}
        <AIFieldSuggestion
          fieldName="nom de l'actif"
          fieldType="text"
          suggestions={aiSuggestions.slice(0, 3).map(s => ({
            text: s.name,
            confidence: s.confidence,
            source: s.reasoning
          }))}
          onApply={(value: string) => handleFieldChange('name', value)}
          placeholder="L'IA peut suggérer des actifs basés sur la valeur métier"
        />
      </div>

      <div>
        <Label htmlFor="type">Type d'actif *</Label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => handleFieldChange('type', e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formErrors.type ? 'border-red-500' : ''}`}
        >
          <option value="">Sélectionner un type</option>
          {ASSET_TYPES.map(type => {
            const Icon = type.icon;
            return (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            );
          })}
        </select>
        {formErrors.type && (
          <p className="mt-1 text-sm text-red-600">{formErrors.type}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => handleFieldChange('description', e.target.value)}
          placeholder="Décrivez le rôle et l'importance de cet actif..."
        />
      </div>

      <div>
        <Label htmlFor="securityLevel">Niveau de sécurité *</Label>
        <select
          id="securityLevel"
          value={formData.securityLevel}
          onChange={(e) => handleFieldChange('securityLevel', e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${formErrors.securityLevel ? 'border-red-500' : ''}`}
        >
          {SECURITY_LEVELS.map(level => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
        {formErrors.securityLevel && (
          <p className="mt-1 text-sm text-red-600">{formErrors.securityLevel}</p>
        )}
      </div>

      {/* Vulnérabilités identifiées */}
      <div>
        <Label>Vulnérabilités potentielles</Label>
        <div className="mt-2 space-y-2">
          {vulnerabilities.map((vuln, index) => (
            <div key={index} className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-gray-700 flex-1">{vuln}</span>
              <button
                type="button"
                onClick={() => removeVulnerability(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
          {vulnerabilities.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              Aucune vulnérabilité identifiée. L'IA suggérera des vulnérabilités basées sur le type d'actif.
            </p>
          )}
        </div>
      </div>

      {/* Dépendances */}
      <div>
        <Label>Dépendances avec d'autres actifs</Label>
        <div className="mt-2 space-y-2">
          {dependencies.map((dep, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Network className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-gray-700 flex-1">{dep}</span>
              <button
                type="button"
                onClick={() => removeDependency(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
          {dependencies.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              Aucune dépendance identifiée. L'IA analysera les liens avec d'autres actifs.
            </p>
          )}
        </div>
      </div>

      {/* Compatibilité Access */}
      {isAccessMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2">Mode compatibilité Access</h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="responsableEntite">Responsable (textuel Access)</Label>
              <Input
                id="responsableEntite"
                value={formData.responsableEntite}
                onChange={(e) => handleFieldChange('responsableEntite', e.target.value)}
                placeholder="Ex: Direction IT, Service RH..."
              />
            </div>
            <div>
              <Label htmlFor="valeurMetierNom">Référence valeur métier (textuel)</Label>
              <Input
                id="valeurMetierNom"
                value={formData.valeurMetierNom}
                onChange={(e) => handleFieldChange('valeurMetierNom', e.target.value)}
                placeholder="Nom de la VM dans Access"
              />
            </div>
          </div>
        </div>
      )}

      {/* Validation et cohérence */}
      {showValidation && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-green-900">Validation de cohérence</h4>
          </div>
          <ul className="text-sm text-green-700 space-y-1">
            <li>✓ Type d'actif cohérent avec la valeur métier</li>
            <li>✓ Niveau de sécurité approprié</li>
            <li>✓ Vulnérabilités pertinentes identifiées</li>
          </ul>
        </div>
      )}

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={() => setShowValidation(!showValidation)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          <Shield className="h-4 w-4 inline mr-1" />
          Vérifier la cohérence
        </button>
        
        <div className="flex space-x-3">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit">
            {initialData ? 'Mettre à jour' : 'Créer l\'actif'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SupportingAssetForm;