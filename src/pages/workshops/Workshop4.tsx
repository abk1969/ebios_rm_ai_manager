import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addAttackPath, setAttackPaths } from '@/store/slices/attackPathsSlice';
import { getAttackPaths, createAttackPath } from '@/services/firebase/attackPaths';
import WorkshopLayout from '@/components/workshops/WorkshopLayout';
import WorkshopHeader from '@/components/workshops/WorkshopHeader';
import Button from '@/components/ui/button';
import AddAttackPathModal from '@/components/attack-paths/AddAttackPathModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Plus, Route } from 'lucide-react';
import type { AttackPath } from '@/types/ebios';

const Workshop4 = () => {
  const dispatch = useDispatch();
  const attackPaths = useSelector((state: RootState) => state.attackPaths.paths);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { missionId } = useParams<{ missionId: string }>();

  useEffect(() => {
    const fetchAttackPaths = async () => {
      try {
        if (missionId) {
          const paths = await getAttackPaths(missionId);
          dispatch(setAttackPaths(paths));
        }
      } catch (error) {
        console.error('Error fetching attack paths:', error);
        setError('Failed to load attack paths');
      } finally {
        setLoading(false);
      }
    };

    fetchAttackPaths();
  }, [dispatch, missionId]);

  const handleCreateAttackPath = async (data: Partial<AttackPath>) => {
    try {
      if (missionId) {
        const newPath = await createAttackPath({
          ...data,
          missionId,
          actions: [],
        } as Omit<AttackPath, 'id'>);
        
        dispatch(addAttackPath(newPath));
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating attack path:', error);
      setError('Failed to create attack path');
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
        title="Operational Scenarios"
        description="Define and analyze operational attack scenarios"
        workshopNumber={4}
      />

      <div className="space-y-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-xl font-semibold text-gray-900">Attack Paths</h2>
            <p className="mt-2 text-sm text-gray-700">
              Define and analyze potential attack paths and their associated actions.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Attack Path</span>
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {attackPaths.map((path) => (
            <div
              key={path.id}
              className="overflow-hidden rounded-lg bg-white shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <Route className="h-6 w-6 text-purple-500" />
                  <h3 className="ml-2 text-lg font-medium text-gray-900">
                    {path.name}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-gray-600">{path.description}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Technical Difficulty:</span>
                    <span className="font-medium">{path.difficulty}/5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Success Probability:</span>
                    <span className="font-medium">{path.successProbability}/5</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3">
                <div className="flex justify-between">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddAttackPathModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateAttackPath}
        missionId={missionId || ''}
      />
    </WorkshopLayout>
  );
};

export default Workshop4;