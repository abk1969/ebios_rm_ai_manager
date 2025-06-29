/**
 * 🔧 COMPOSANT MULTI-VALEURS AVEC BOUTON +
 * Permet d'ajouter/supprimer des valeurs facilement
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Trash2 } from 'lucide-react';

interface MultiValueInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  description?: string;
  maxItems?: number;
  required?: boolean;
}

const MultiValueInput: React.FC<MultiValueInputProps> = ({
  label,
  values,
  onChange,
  placeholder = "Saisir une valeur...",
  description,
  maxItems = 20,
  required = false
}) => {
  const [currentValue, setCurrentValue] = useState('');

  const addValue = () => {
    if (currentValue.trim() && !values.includes(currentValue.trim()) && values.length < maxItems) {
      onChange([...values, currentValue.trim()]);
      setCurrentValue('');
    }
  };

  const removeValue = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addValue();
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>

      {/* Zone de saisie */}
      <div className="flex gap-2">
        <Input
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
          disabled={values.length >= maxItems}
        />
        <Button
          type="button"
          onClick={addValue}
          disabled={!currentValue.trim() || values.includes(currentValue.trim()) || values.length >= maxItems}
          size="sm"
          className="px-3"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Affichage des valeurs ajoutées */}
      {values.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {values.length} élément{values.length > 1 ? 's' : ''} ajouté{values.length > 1 ? 's' : ''}
            </span>
            {values.length > 0 && (
              <Button
                type="button"
                onClick={clearAll}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Tout effacer
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded-md">
            {values.map((value, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 hover:bg-blue-200"
              >
                <span className="text-sm">{value}</span>
                <button
                  type="button"
                  onClick={() => removeValue(index)}
                  className="ml-1 hover:bg-blue-300 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Limite atteinte */}
      {values.length >= maxItems && (
        <p className="text-xs text-amber-600">
          ⚠️ Limite de {maxItems} éléments atteinte
        </p>
      )}

      {/* Aide */}
      <p className="text-xs text-gray-400">
        💡 Appuyez sur Entrée ou cliquez sur + pour ajouter une valeur
      </p>
    </div>
  );
};

export default MultiValueInput;
