import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import type { RiskSource } from '@/types/ebios';

interface RiskSourceFormProps {
  onSubmit: (data: Partial<RiskSource>) => void;
  initialData?: Partial<RiskSource>;
}

const RiskSourceForm: React.FC<RiskSourceFormProps> = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Source Name
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
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          {...register('category', { required: 'Category is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select a category</option>
          <option value="state_sponsored">State Sponsored</option>
          <option value="cybercriminal">Cybercriminal</option>
          <option value="hacktivist">Hacktivist</option>
          <option value="insider">Insider</option>
          <option value="competitor">Competitor</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="pertinence" className="block text-sm font-medium text-gray-700">
          Pertinence Level (1-5)
        </label>
        <input
          type="number"
          id="pertinence"
          min="1"
          max="5"
          {...register('pertinence', { 
            required: 'Pertinence level is required',
            min: { value: 1, message: 'Minimum value is 1' },
            max: { value: 5, message: 'Maximum value is 5' }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.pertinence && (
          <p className="mt-1 text-sm text-red-600">{errors.pertinence.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary">
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Source' : 'Create Source'}
        </Button>
      </div>
    </form>
  );
};

export default RiskSourceForm;