import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addRiskSource, setRiskSources } from '@/store/slices/riskSourcesSlice';
import { getRiskSources, createRiskSource } from '@/services/firebase/riskSources';
import WorkshopLayout from '@/components/workshops/WorkshopLayout';
import WorkshopHeader from '@/components/workshops/WorkshopHeader';
import Button from '@/components/ui/button';
import RiskSourceCard from '@/components/risk-sources/RiskSourceCard';
import AddRiskSourceModal from '@/components/risk-sources/AddRiskSourceModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Plus, Target } from 'lucide-react';
import type { RiskSource } from '@/types/ebios';

const Workshop2 = () => {
  const dispatch = useDispatch();
  const riskSources = useSelector((state: RootState) => state.riskSources.riskSources);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { missionId } = useParams<{ missionId: string }>();

  useEffect(() => {
    const fetchRiskSources = async () => {
      try {
        if (missionId) {
          const sources = await getRiskSources(missionId);
          dispatch(setRiskSources(sources));
        }
      } catch (error) {
        console.error('Error fetching risk sources:', error);
        setError('Failed to load risk sources');
      } finally {
        setLoading(false);
      }
    };

    fetchRiskSources();
  }, [dispatch, missionId]);

  const handleCreateRiskSource = async (data: Partial<RiskSource>) => {
    try {
      if (missionId) {
        const newSource = await createRiskSource({
          ...data,
          missionId,
          objectives: [],
        } as Omit<RiskSource, 'id'>);
        
        dispatch(addRiskSource(newSource));
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating risk source:', error);
      setError('Failed to create risk source');
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
        title="Risk Sources"
        description="Identify and analyze potential sources of risk to your organization"
        workshopNumber={2}
      />

      <div className="space-y-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-xl font-semibold text-gray-900">Risk Sources</h2>
            <p className="mt-2 text-sm text-gray-700">
              Define and analyze the sources of risk that could potentially impact your organization.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Risk Source</span>
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
          {riskSources.map((source) => (
            <RiskSourceCard
              key={source.id}
              riskSource={source}
              onEdit={() => {}}
            />
          ))}
          {riskSources.length === 0 && !error && (
            <div className="col-span-full">
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <Target className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No risk sources</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new risk source.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    Add Risk Source
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddRiskSourceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateRiskSource}
        missionId={missionId || ''}
      />
    </WorkshopLayout>
  );
};

export default Workshop2;