/**
 * 🔧 MODAL DE CORRECTION MANUELLE DES DONNÉES
 * Modal spécialisé pour corriger manuellement les problèmes de qualité détectés
 */

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import Button from '../ui/button';
import { DataQualityIssue } from '../../services/ai/DataQualityDetector';

interface DataQualityFixModalProps {
  isOpen: boolean;
  onClose: () => void;
  issue: DataQualityIssue | null;
  entity: any;
  onSave: (updatedEntity: any) => void;
  entityType: 'businessValue' | 'dreadedEvent' | 'supportingAsset';
}

const DataQualityFixModal: React.FC<DataQualityFixModalProps> = ({
  isOpen,
  onClose,
  issue,
  entity,
  onSave,
  entityType
}) => {
  const [formData, setFormData] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialiser le formulaire avec les données de l'entité
  useEffect(() => {
    if (entity && isOpen) {
      setFormData({ ...entity });
      setHasChanges(false);
    }
  }, [entity, isOpen]);

  // Fermer le modal
  const handleClose = () => {
    onClose();
  };

  // Sauvegarder les modifications
  const handleSave = () => {
    if (hasChanges) {
      onSave(formData);
    }
    handleClose();
  };

  // Mettre à jour un champ
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData((prev: Record<string, any>) => ({
      ...prev,
      [fieldName]: value
    }));
    setHasChanges(true);
  };

  // Appliquer la suggestion IA
  const applySuggestion = () => {
    if (issue && issue.suggestedValue) {
      handleFieldChange(issue.field, issue.suggestedValue);
    }
  };

  if (!isOpen || !entity || !issue) {
    return null;
  }

  const getFieldLabel = (fieldName: string) => {
    const labels = {
      name: 'Nom',
      description: 'Description',
      category: 'Catégorie',
      criticalityLevel: 'Niveau de criticité',
      consequences: 'Conséquences',
      type: 'Type',
      securityLevel: 'Niveau de sécurité'
    };
    return labels[fieldName as keyof typeof labels] || fieldName;
  };

  const getCriticalityOptions = () => [
    { value: 'faible', label: 'Faible' },
    { value: 'important', label: 'Important' },
    { value: 'critique', label: 'Critique' },
    { value: 'essentiel', label: 'Essentiel' }
  ];

  const getCategoryOptions = () => [
    { value: 'primary', label: 'Primaire' },
    { value: 'secondary', label: 'Secondaire' },
    { value: 'operational', label: 'Opérationnel' },
    { value: 'strategic', label: 'Stratégique' }
  ];

  const renderField = (fieldName: string) => {
    const value = formData[fieldName] || '';
    const isProblematicField = issue.field === fieldName;
    const label = getFieldLabel(fieldName);

    if (fieldName === 'criticalityLevel') {
      return (
        <div key={fieldName} className={`space-y-2 ${isProblematicField ? 'ring-2 ring-red-300 rounded-lg p-3 bg-red-50' : ''}`}>
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {isProblematicField && (
              <span className="ml-2 text-red-600 text-xs">
                🚨 Champ problématique
              </span>
            )}
          </label>
          <select
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isProblematicField ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionnez un niveau</option>
            {getCriticalityOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {isProblematicField && issue.suggestedValue && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  💡 Suggestion IA : "{issue.suggestedValue}"
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={applySuggestion}
                  className="text-xs"
                >
                  Appliquer
                </Button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (fieldName === 'category') {
      return (
        <div key={fieldName} className={`space-y-2 ${isProblematicField ? 'ring-2 ring-red-300 rounded-lg p-3 bg-red-50' : ''}`}>
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {isProblematicField && (
              <span className="ml-2 text-red-600 text-xs">
                🚨 Champ problématique
              </span>
            )}
          </label>
          <select
            value={value}
            onChange={(e) => handleFieldChange(fieldName, e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isProblematicField ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Sélectionnez une catégorie</option>
            {getCategoryOptions().map(option => (
              <option key={option.value} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
          {isProblematicField && issue.suggestedValue && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">
                  💡 Suggestion IA : "{issue.suggestedValue}"
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={applySuggestion}
                  className="text-xs"
                >
                  Appliquer
                </Button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Champs texte
    const isTextArea = fieldName === 'description' || fieldName === 'consequences';
    const InputComponent = isTextArea ? 'textarea' : 'input';

    return (
      <div key={fieldName} className={`space-y-2 ${isProblematicField ? 'ring-2 ring-red-300 rounded-lg p-3 bg-red-50' : ''}`}>
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {isProblematicField && (
            <span className="ml-2 text-red-600 text-xs">
              🚨 Champ problématique
            </span>
          )}
        </label>
        <InputComponent
          type={isTextArea ? undefined : 'text'}
          value={value}
          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isProblematicField ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          rows={isTextArea ? 3 : undefined}
          placeholder={`Saisissez ${label.toLowerCase()}`}
        />
        {isProblematicField && issue.suggestedValue && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                💡 Suggestion IA : "{issue.suggestedValue}"
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={applySuggestion}
                className="text-xs"
              >
                Appliquer
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const fieldsToShow = ['name', 'description', 'category', 'criticalityLevel', 'consequences', 'type'].filter(
    field => formData.hasOwnProperty(field)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Correction manuelle - {getFieldLabel(issue.field)}
              </h2>
              <p className="text-sm text-gray-600">
                Corrigez le problème détecté sur "{entity.name || 'Entité sans nom'}"
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Problème détecté */}
        <div className="p-6 bg-red-50 border-b">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Problème détecté</h3>
              <p className="text-sm text-red-700 mt-1">{issue.message}</p>
              <p className="text-xs text-red-600 mt-2">
                💡 {issue.suggestion}
              </p>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="p-6 space-y-4">
          {fieldsToShow.map(renderField)}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {hasChanges ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" />
                Modifications détectées
              </>
            ) : (
              <>
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                Aucune modification
              </>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleClose}>
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!hasChanges}
              className={hasChanges ? '' : 'opacity-50 cursor-not-allowed'}
            >
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataQualityFixModal;
