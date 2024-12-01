import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import type { Stakeholder } from '@/types/ebios';

interface StakeholderFormProps {
  onSubmit: (data: Partial<Stakeholder>) => void;
  initialData?: Partial<Stakeholder>;
}

const StakeholderForm: React.FC<StakeholderFormProps> = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
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
          Type
        </label>
        <select
          id="type"
          {...register('type', { required: 'Type is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select type</option>
          <option value="internal">Internal</option>
          <option value="external">External</option>
          <option value="partner">Partner</option>
          <option value="supplier">Supplier</option>
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
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
          <option value="">Select category</option>
          <option value="employee">Employee</option>
          <option value="contractor">Contractor</option>
          <option value="vendor">Vendor</option>
          <option value="customer">Customer</option>
          <option value="regulator">Regulator</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="zone" className="block text-sm font-medium text-gray-700">
          Zone
        </label>
        <select
          id="zone"
          {...register('zone', { required: 'Zone is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select zone</option>
          <option value="internal">Internal</option>
          <option value="dmz">DMZ</option>
          <option value="external">External</option>
          <option value="restricted">Restricted</option>
        </select>
        {errors.zone && (
          <p className="mt-1 text-sm text-red-600">{errors.zone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="exposureLevel" className="block text-sm font-medium text-gray-700">
          Exposure Level (1-5)
        </label>
        <input
          type="number"
          id="exposureLevel"
          min="1"
          max="5"
          {...register('exposureLevel', { 
            required: 'Exposure level is required',
            min: { value: 1, message: 'Minimum value is 1' },
            max: { value: 5, message: 'Maximum value is 5' }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.exposureLevel && (
          <p className="mt-1 text-sm text-red-600">{errors.exposureLevel.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="cyberReliability" className="block text-sm font-medium text-gray-700">
          Cyber Reliability (1-5)
        </label>
        <input
          type="number"
          id="cyberReliability"
          min="1"
          max="5"
          {...register('cyberReliability', { 
            required: 'Cyber reliability is required',
            min: { value: 1, message: 'Minimum value is 1' },
            max: { value: 5, message: 'Maximum value is 5' }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.cyberReliability && (
          <p className="mt-1 text-sm text-red-600">{errors.cyberReliability.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary">
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Stakeholder' : 'Add Stakeholder'}
        </Button>
      </div>
    </form>
  );
};

export default StakeholderForm;