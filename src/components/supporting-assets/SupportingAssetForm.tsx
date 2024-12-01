import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import type { SupportingAsset } from '@/types/ebios';

interface SupportingAssetFormProps {
  onSubmit: (data: Partial<SupportingAsset>) => void;
  initialData?: Partial<SupportingAsset>;
}

const SupportingAssetForm: React.FC<SupportingAssetFormProps> = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Asset Name
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
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Asset Type
        </label>
        <select
          id="type"
          {...register('type', { required: 'Type is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select a type</option>
          <option value="hardware">Hardware</option>
          <option value="software">Software</option>
          <option value="data">Data</option>
          <option value="network">Network</option>
          <option value="personnel">Personnel</option>
          <option value="site">Site</option>
          <option value="organization">Organization</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
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

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary">
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Asset' : 'Create Asset'}
        </Button>
      </div>
    </form>
  );
};

export default SupportingAssetForm;