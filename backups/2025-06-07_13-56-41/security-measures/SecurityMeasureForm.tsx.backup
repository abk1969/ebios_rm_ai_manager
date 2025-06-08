import React from 'react';
import { useForm } from 'react-hook-form';
import { SecurityMeasure } from '@/types/ebios';
import Button from '@/components/ui/button';

interface SecurityMeasureFormProps {
  initialData?: Partial<SecurityMeasure>;
  onSubmit: (data: Partial<SecurityMeasure>) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
}

const SecurityMeasureForm: React.FC<SecurityMeasureFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitButtonText = 'Save'
}) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SecurityMeasure>({
    defaultValues: initialData,
  });

  const selectedCategory = watch('isoCategory');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        <div>
          <label htmlFor="isoCategory" className="block text-sm font-medium text-gray-700">
            ISO 27002:2022 Category
          </label>
          <select
            id="isoCategory"
            {...register('isoCategory', { required: 'Category is required' })}
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
          </label>
          <select
            id="isoControl"
            {...register('isoControl', { required: 'Control is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select control</option>
            {getIsoControls(selectedCategory).map(control => (
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
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
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
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          {errors.effectiveness && (
            <p className="mt-1 text-sm text-red-600">{errors.effectiveness.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Implementation Due Date
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
          </label>
          <input
            type="text"
            id="responsibleParty"
            {...register('responsibleParty', { required: 'Responsible party is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.responsibleParty && (
            <p className="mt-1 text-sm text-red-600">{errors.responsibleParty.message}</p>
          )}
        </div>
      </div>

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

// ISO 27002:2022 Control Categories
const ISO_CATEGORIES = [
  { id: '5', name: 'Organizational Controls' },
  { id: '6', name: 'People Controls' },
  { id: '7', name: 'Physical Controls' },
  { id: '8', name: 'Technological Controls' }
];

// ISO 27002:2022 Control Types
const CONTROL_TYPES = [
  { id: 'preventive', name: 'Preventive' },
  { id: 'detective', name: 'Detective' },
  { id: 'corrective', name: 'Corrective' }
];

const getIsoControls = (category: string) => {
  switch(category) {
    case '5':
      return [
        { id: '5.1', name: 'Policies for information security' },
        { id: '5.2', name: 'Information security roles and responsibilities' },
        { id: '5.3', name: 'Segregation of duties' },
        { id: '5.4', name: 'Management responsibilities' },
        { id: '5.5', name: 'Contact with authorities' }
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
        { id: '8.4', name: 'Access to source code' }
      ];
    default:
      return [];
  }
};

export default SecurityMeasureForm;