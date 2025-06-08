import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StandardFormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'textarea' | 'select' | 'number' | 'email';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helpText?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  options?: { value: string | number; label: string }[];
  rows?: number;
  min?: number;
  max?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * 🎨 COMPOSANT DE CHAMP DE FORMULAIRE STANDARDISÉ
 * Harmonise l'apparence et le comportement des formulaires EBIOS RM
 */
const StandardFormField: React.FC<StandardFormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  value,
  onChange,
  options = [],
  rows = 3,
  min,
  max,
  className = '',
  children
}) => {
  
  const fieldId = `field-${name}`;
  const hasError = !!error;

  // 🎨 Classes CSS standardisées
  const baseInputClasses = cn(
    'block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset',
    'placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6',
    'transition-colors duration-200',
    {
      // États normaux
      'ring-gray-300 focus:ring-blue-600': !hasError && !disabled,
      // État d'erreur
      'ring-red-300 focus:ring-red-500 bg-red-50': hasError,
      // État désactivé
      'ring-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed': disabled,
    },
    className
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (onChange) {
      const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
      onChange(newValue);
    }
  };

  const renderField = () => {
    if (children) {
      return children;
    }

    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            name={name}
            rows={rows}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            value={value || ''}
            onChange={handleChange}
            className={baseInputClasses}
            aria-describedby={helpText ? `${fieldId}-help` : undefined}
            aria-invalid={hasError}
          />
        );

      case 'select':
        return (
          <select
            id={fieldId}
            name={name}
            required={required}
            disabled={disabled}
            value={value || ''}
            onChange={handleChange}
            className={baseInputClasses}
            aria-describedby={helpText ? `${fieldId}-help` : undefined}
            aria-invalid={hasError}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            id={fieldId}
            name={name}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            min={min}
            max={max}
            value={value || ''}
            onChange={handleChange}
            className={baseInputClasses}
            aria-describedby={helpText ? `${fieldId}-help` : undefined}
            aria-invalid={hasError}
          />
        );

      default:
        return (
          <input
            type={type}
            id={fieldId}
            name={name}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            value={value || ''}
            onChange={handleChange}
            className={baseInputClasses}
            aria-describedby={helpText ? `${fieldId}-help` : undefined}
            aria-invalid={hasError}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {/* 🏷️ LABEL STANDARDISÉ */}
      <label 
        htmlFor={fieldId} 
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
        {required && (
          <span className="ml-1 text-red-500" aria-label="Champ obligatoire">
            *
          </span>
        )}
      </label>

      {/* 📝 CHAMP DE SAISIE */}
      <div className="relative">
        {renderField()}
        
        {/* 🚨 ICÔNE D'ERREUR */}
        {hasError && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* 💡 TEXTE D'AIDE */}
      {helpText && !hasError && (
        <div 
          id={`${fieldId}-help`}
          className="flex items-start space-x-2 text-sm text-gray-600"
        >
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-gray-400" />
          <span>{helpText}</span>
        </div>
      )}

      {/* 🚨 MESSAGE D'ERREUR */}
      {hasError && (
        <div 
          id={`${fieldId}-error`}
          className="flex items-start space-x-2 text-sm text-red-600"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default StandardFormField;
