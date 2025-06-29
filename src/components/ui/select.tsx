import React from 'react';

interface SelectProps {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

interface SelectItemProps {
  children: React.ReactNode;
  value: string;
}

// 🔧 CORRECTION: Composant Select simplifié et conforme DOM
export const Select: React.FC<SelectProps> = ({
  children,
  value,
  onValueChange,
  className = '',
  placeholder
}) => {
  return (
    <select
      value={value || ''}
      onChange={(e) => onValueChange?.(e.target.value)}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {children}
    </select>
  );
};

// 🔧 CORRECTION: SelectItem simplifié
export const SelectItem: React.FC<SelectItemProps> = ({ children, value }) => {
  return <option value={value}>{children}</option>;
};

// 🔧 CORRECTION: Composants compatibilité (ne font rien mais évitent les erreurs)
export const SelectTrigger: React.FC<{ children: React.ReactNode; className?: string }> = ({ children }) => {
  return <>{children}</>;
};

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const SelectValue: React.FC<{ placeholder?: string }> = () => {
  return null; // Le placeholder est géré directement dans Select
};