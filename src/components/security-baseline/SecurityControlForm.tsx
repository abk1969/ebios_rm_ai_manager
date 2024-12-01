import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import { SecurityBaseline } from '@/types/ebios';

interface SecurityControlFormProps {
  initialData?: Partial<SecurityBaseline>;
  onSubmit: (data: Partial<SecurityBaseline>) => void;
}

const SecurityControlForm: React.FC<SecurityControlFormProps> = ({ initialData, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SecurityBaseline>({
    defaultValues: initialData
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          {...register('name', { required: 'Name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          {...register('category', { required: 'Category is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select a category</option>
          <option value="access_control">Access Control</option>
          <option value="data_protection">Data Protection</option>
          <option value="network_security">Network Security</option>
          <option value="incident_management">Incident Management</option>
          <option value="business_continuity">Business Continuity</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          {...register('status', { required: 'Status is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Select status</option>
          <option value="draft">Draft</option>
          <option value="in_review">In Review</option>
          <option value="approved">Approved</option>
          <option value="archived">Archived</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary" onClick={() => {}}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Control' : 'Create Control'}
        </Button>
      </div>
    </form>
  );
};

export default SecurityControlForm;