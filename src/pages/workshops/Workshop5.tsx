import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addSecurityMeasure, setSecurityMeasures } from '@/store/slices/securityMeasuresSlice';
import { getSecurityMeasures, createSecurityMeasure } from '@/services/firebase/securityMeasures';
import WorkshopLayout from '@/components/workshops/WorkshopLayout';
import WorkshopHeader from '@/components/workshops/WorkshopHeader';
import Button from '@/components/ui/button';
import AddSecurityMeasureModal from '@/components/security-measures/AddSecurityMeasureModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Plus, ShieldCheck } from 'lucide-react';
import type { SecurityMeasure } from '@/types/ebios';

const Workshop5 = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const dispatch = useDispatch();
  const securityMeasures = useSelector((state: RootState) => state.securityMeasures.measures);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCreateSecurityMeasure = async (data: Partial<SecurityMeasure>) => {
    try {
      if (missionId) {
        const newMeasure = await createSecurityMeasure({
          ...data,
          missionId,
        } as Omit<SecurityMeasure, 'id'>);
        dispatch(addSecurityMeasure(newMeasure));
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error creating security measure:', error);
      setError('Failed to create security measure');
    }
  };

  useEffect(() => {
    const fetchSecurityMeasures = async () => {
      try {
        if (missionId) {
          const measures = await getSecurityMeasures(missionId);
          dispatch(setSecurityMeasures(measures));
        }
      } catch (error) {
        console.error('Error fetching security measures:', error);
        setError('Failed to load security measures');
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityMeasures();
  }, [dispatch, missionId]);

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
        title="Treatment Strategy"
        description="Define and implement risk treatment measures"
        workshopNumber={5}
      />

      <div className="space-y-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h2 className="text-xl font-semibold text-gray-900">Security Measures</h2>
            <p className="mt-2 text-sm text-gray-700">
              Define and track security measures to address identified risks.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Security Measure</span>
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
          {securityMeasures.map((measure) => (
            <div
              key={measure.id}
              className={`overflow-hidden rounded-lg bg-white shadow ${
                measure.status === 'implemented'
                  ? 'border-l-4 border-green-500'
                  : measure.status === 'in_progress'
                  ? 'border-l-4 border-yellow-500'
                  : 'border-l-4 border-gray-500'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center">
                  <ShieldCheck className={`h-6 w-6 ${
                    measure.status === 'implemented'
                      ? 'text-green-500'
                      : measure.status === 'in_progress'
                      ? 'text-yellow-500'
                      : 'text-gray-500'
                  }`} />
                  <h3 className="ml-2 text-lg font-medium text-gray-900">
                    {measure.name}
                  </h3>
                </div>
                <p className="mt-2 text-sm text-gray-600">{measure.description}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`font-medium ${
                      measure.status === 'implemented'
                        ? 'text-green-600'
                        : measure.status === 'in_progress'
                        ? 'text-yellow-600'
                        : 'text-gray-600'
                    }`}>
                      {measure.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Responsible:</span>
                    <span className="font-medium">{measure.responsibleParty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Due Date:</span>
                    <span className="font-medium">
                      {new Date(measure.dueDate).toLocaleDateString()}
                    </span>
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
          {securityMeasures.length === 0 && !error && (
            <div className="col-span-full">
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <ShieldCheck className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No security measures</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by adding a new security measure.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    Add Security Measure
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddSecurityMeasureModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateSecurityMeasure}
        missionId={missionId || ''}
      />
    </WorkshopLayout>
  );
};

export default Workshop5;