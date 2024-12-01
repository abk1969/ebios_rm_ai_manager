import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import type { SecurityBaseline } from '@/types/ebios';

interface SecurityBaselineFormProps {
  onSubmit: (data: Partial<SecurityBaseline>) => void;
  initialData?: Partial<SecurityBaseline>;
}

const SecurityBaselineForm: React.FC<SecurityBaselineFormProps> = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Control Name
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
          {...register('description')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Compliance Status
        </label>
        <select
          id="status"
          {...register('status', { required: 'Status is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="compliant">Compliant</option>
          <option value="partially_compliant">Partially Compliant</option>
          <option value="non_compliant">Non-Compliant</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary">
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Control' : 'Create Control'}
        </Button>
      </div>
    </form>
  );
};

export default SecurityBaselineForm;