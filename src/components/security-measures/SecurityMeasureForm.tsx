import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SecurityMeasure } from '@/types/ebios';
import Button from '@/components/ui/button';
import { Info, Sparkles, AlertCircle } from 'lucide-react';

// ISO 27002:2022 Control Categories
const ISO_CATEGORIES = [
  { id: '5', name: 'Organizational Controls' },
  { id: '6', name: 'People Controls' },
  { id: '7', name: 'Physical Controls' },
  { id: '8', name: 'Technological Controls' }
];

// ISO 27002:2022 Control Types avec directive ajouté
const CONTROL_TYPES = [
  { id: 'preventive', name: 'Preventive' },
  { id: 'detective', name: 'Detective' },
  { id: 'corrective', name: 'Corrective' },
  { id: 'directive', name: 'Directive' } // 🆕 Ajouté pour EBIOS
];

const getIsoControls = (category: string) => {
  switch(category) {
    case '5':
      return [
        { id: '5.1', name: 'Policies for information security' },
        { id: '5.2', name: 'Information security roles and responsibilities' },
        { id: '5.3', name: 'Segregation of duties' },
        { id: '5.4', name: 'Management responsibilities' },
        { id: '5.5', name: 'Contact with authorities' },
        { id: '5.29', name: 'Information security in disruption' } // Ajouté pour Résilience
      ];
    case '6':
      return [
        { id: '6.1', name: 'Screening' },
        { id: '6.2', name: 'Terms and conditions of employment' },
        { id: '6.3', name: 'Information security awareness, education and training' },
        { id: '6.4', name: 'Disciplinary process' },
        { id: '6.5', name: 'Responsibilities after termination' }
      ];
    case '7':
      return [
        { id: '7.1', name: 'Physical security perimeter' },
        { id: '7.2', name: 'Physical entry controls' },
        { id: '7.3', name: 'Securing offices, rooms and facilities' },
        { id: '7.4', name: 'Protection against external and environmental threats' }
      ];
    case '8':
      return [
        { id: '8.1', name: 'User endpoint devices' },
        { id: '8.2', name: 'Privileged access rights' },
        { id: '8.3', name: 'Information access restriction' },
        { id: '8.4', name: 'Access to source code' },
        { id: '8.16', name: 'Monitoring activities' } // Ajouté pour Défense
      ];
    default:
      return [];
  }
};

interface SecurityMeasureFormProps {
  initialData?: Partial<SecurityMeasure>;
  onSubmit: (data: Partial<SecurityMeasure>) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  isAccessImport?: boolean;
}

const SecurityMeasureForm: React.FC<SecurityMeasureFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitButtonText = 'Save',
  isAccessImport = false
}) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<SecurityMeasure>({
    defaultValues: initialData,
  });

  const selectedCategory = watch('isoCategory');
  const [showIsoSuggestion, setShowIsoSuggestion] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{category?: string; control?: string}>({});

  useEffect(() => {
    if (isAccessImport && !initialData?.isoCategory && !initialData?.isoControl) {
      if (initialData?.typeMesureAccess) {
        const suggestion = getAISuggestionForAccessType(initialData.typeMesureAccess);
        setAiSuggestion(suggestion);
        setShowIsoSuggestion(true);
      }
    }
  }, [isAccessImport, initialData]);

  const getAISuggestionForAccessType = (typeMesure: string) => {
    const mapping: Record<string, {category: string; control: string}> = {
      'GOUVERNANCE': { category: '5', control: '5.1' },
      'PROTECTION': { category: '8', control: '8.3' },
      'DEFENSE': { category: '8', control: '8.16' },
      'RESILIENCE': { category: '5', control: '5.29' }
    };
    
    return mapping[typeMesure] || { category: '5', control: '5.1' };
  };

  const applySuggestion = () => {
    if (aiSuggestion.category) setValue('isoCategory', aiSuggestion.category);
    if (aiSuggestion.control) setValue('isoControl', aiSuggestion.control);
    setShowIsoSuggestion(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isAccessImport && (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Mode Import Access</h3>
              <div className="mt-2 text-sm text-blue-700">
                Les champs ISO 27002 sont optionnels. L'IA peut suggérer des valeurs appropriées.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Measure Name
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description', { required: 'Description is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {isAccessImport && initialData?.typeMesureAccess && (
          <div className="rounded-md bg-gray-50 p-3">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Type Access : </span>
              <span className="text-gray-900">{initialData.typeMesureAccess}</span>
            </div>
            {initialData.freinDifficulteMEO && (
              <div className="mt-1 text-sm">
                <span className="font-medium text-gray-700">Difficulté MEO : </span>
                <span className="text-gray-900">{initialData.freinDifficulteMEO}</span>
              </div>
            )}
          </div>
        )}

        {showIsoSuggestion && (
          <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4">
            <div className="flex">
              <Sparkles className="h-5 w-5 text-yellow-400 flex-shrink-0" />
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Suggestion IA pour les contrôles ISO
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  Basé sur le type "{initialData?.typeMesureAccess}", nous suggérons :
                  <ul className="mt-1 list-disc list-inside">
                    <li>Catégorie : {ISO_CATEGORIES.find(c => c.id === aiSuggestion.category)?.name}</li>
                    <li>Contrôle : {aiSuggestion.control}</li>
                  </ul>
                </div>
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={applySuggestion}
                  >
                    Appliquer la suggestion
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="isoCategory" className="block text-sm font-medium text-gray-700">
            ISO 27002:2022 Category
            {isAccessImport && (
              <span className="ml-1 text-xs text-gray-500">(optionnel)</span>
            )}
          </label>
          <select
            id="isoCategory"
            {...register('isoCategory', { 
              required: isAccessImport ? false : 'Category is required' 
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select category</option>
            {ISO_CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.isoCategory && (
            <p className="mt-1 text-sm text-red-600">{errors.isoCategory.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="isoControl" className="block text-sm font-medium text-gray-700">
            ISO 27002:2022 Control
            {isAccessImport && (
              <span className="ml-1 text-xs text-gray-500">(optionnel)</span>
            )}
          </label>
          <select
            id="isoControl"
            {...register('isoControl', { 
              required: isAccessImport ? false : 'Control is required' 
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select control</option>
            {getIsoControls(selectedCategory || '').map(control => (
              <option key={control.id} value={control.id}>
                {control.id} - {control.name}
              </option>
            ))}
          </select>
          {errors.isoControl && (
            <p className="mt-1 text-sm text-red-600">{errors.isoControl.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="controlType" className="block text-sm font-medium text-gray-700">
            Control Type
          </label>
          <select
            id="controlType"
            {...register('controlType', { required: 'Control type is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select type</option>
            {CONTROL_TYPES.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.controlType && (
            <p className="mt-1 text-sm text-red-600">{errors.controlType.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            {...register('priority', { required: 'Priority is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select priority</option>
            <option value="1">1 - Low</option>
            <option value="2">2 - Medium</option>
            <option value="3">3 - High</option>
            <option value="4">4 - Critical</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Implementation Status
          </label>
          <select
            id="status"
            {...register('status', { required: 'Status is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select status</option>
            <option value="planned">Planned</option>
            <option value="in_progress">In Progress</option>
            <option value="implemented">Implemented</option>
            <option value="verified">Verified</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="effectiveness" className="block text-sm font-medium text-gray-700">
            Effectiveness
          </label>
          <select
            id="effectiveness"
            {...register('effectiveness', { required: 'Effectiveness is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select effectiveness</option>
            <option value="1">1 - Low</option>
            <option value="2">2 - Medium</option>
            <option value="3">3 - High</option>
            <option value="4">4 - Very High</option>
          </select>
          {errors.effectiveness && (
            <p className="mt-1 text-sm text-red-600">{errors.effectiveness.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Implementation Due Date
            {isAccessImport && initialData?.echeanceEnMois && (
              <span className="ml-1 text-xs text-gray-500">
                (calculé depuis {initialData.echeanceEnMois} mois)
              </span>
            )}
          </label>
          <input
            type="date"
            id="dueDate"
            {...register('dueDate', { required: 'Due date is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="responsibleParty" className="block text-sm font-medium text-gray-700">
            Responsible Party
            {isAccessImport && initialData?.responsablesMultiples && (
              <span className="ml-1 text-xs text-gray-500">
                ({initialData.responsablesMultiples.length} responsables)
              </span>
            )}
          </label>
          <input
            type="text"
            id="responsibleParty"
            {...register('responsibleParty', { required: 'Responsible party is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder={isAccessImport && initialData?.responsablesMultiples 
              ? initialData.responsablesMultiples.join(', ') 
              : ''}
          />
          {errors.responsibleParty && (
            <p className="mt-1 text-sm text-red-600">{errors.responsibleParty.message}</p>
          )}
        </div>
      </div>

      {initialData?.aiMetadata?.coherenceScore && (
        <div className="rounded-md bg-green-50 p-3">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-green-400 mr-2" />
            <span className="text-sm text-green-800">
              Score de cohérence IA : {Math.round(initialData.aiMetadata.coherenceScore * 100)}%
            </span>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default SecurityMeasureForm;