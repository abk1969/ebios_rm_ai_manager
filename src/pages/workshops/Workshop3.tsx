import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addStakeholder, setStakeholders } from '@/store/slices/stakeholdersSlice';
import { getStakeholders, createStakeholder } from '@/services/firebase/stakeholders';
import WorkshopLayout from '@/components/workshops/WorkshopLayout';
import WorkshopHeader from '@/components/workshops/WorkshopHeader';
import Button from '@/components/ui/button';
import AddStakeholderModal from '@/components/stakeholders/AddStakeholderModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Plus, Users } from 'lucide-react';
import type { Stakeholder } from '@/types/ebios';

const Workshop3 = () => {
  const dispatch = useDispatch();
  const stakeholders = useSelector((state: RootState) => state.stakeholders.stakeholders);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { missionId } = useParams<{ missionId: string }>();

  useEffect(() => {
    const fetchStakeholders = async () => {
      try {
        if (missionId) {
          const fetchedStakeholders = await getStakeholders(missionId);
          dispatch(setStakeholders(fetchedStakeholders));
        }
      } catch (error) {
        console.error('Error fetching stakeholders:', error);
        setError('Failed to load stakeholders');
      } finally {
        setLoading(false);
      }
    };

    fetchStakeholders();
  }, [dispatch, missionId]);

  const handleCreateStakeholder = async (data: Partial<Stakeholder>) => {
    try {
      if (missionId) {
        const newStakeholder = await createStakeholder({
          ...data,
          missionId,
        } as Omit<Stakeholder, 'id'>);
        
        dispatch(addStakeholder(newStakeholder));
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating stakeholder:', error);
      setError('Failed to create stakeholder');
    }
  };

  if (loading) {
    return (
      <WorkshopLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </WorkshopLayout>
    );
  }

  return (
    <WorkshopLayout>
      <WorkshopHeader
        title="Strategic Scenarios"
        description="Analyze stakeholders and develop strategic attack scenarios"
        workshopNumber={3}
      />

      <div className="space-y-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-xl font-semibold text-gray-900">Stakeholders</h2>
            <p className="mt-2 text-sm text-gray-700">
              Define and analyze stakeholders involved in your organization's ecosystem.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Stakeholder</span>
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stakeholders.map((stakeholder) => (
            <div
              key={stakeholder.id}
              className="overflow-hidden rounded-lg bg-white shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-blue-500" />
                  <h3 className="ml-2 text-lg font-medium text-gray-900">
                    {stakeholder.name}
                  </h3>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium">{stakeholder.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Zone:</span>
                    <span className="font-medium">{stakeholder.zone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Exposure Level:</span>
                    <span className="font-medium">{stakeholder.exposureLevel}/5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Cyber Reliability:</span>
                    <span className="font-medium">{stakeholder.cyberReliability}/5</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3">
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
          {stakeholders.length === 0 && !error && (
            <div className="col-span-full">
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No stakeholders</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new stakeholder.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    Add Stakeholder
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddStakeholderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateStakeholder}
        missionId={missionId || ''}
      />
    </WorkshopLayout>
  );
};

export default Workshop3;