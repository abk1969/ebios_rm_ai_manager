import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setMissions, addMission, updateMission as updateMissionState, deleteMission as deleteMissionState } from '@/store/slices/missionsSlice';
import { getMissions, createMission, updateMission, deleteMission } from '@/services/firebase/missions';
import Button from '@/components/ui/button';
import NewMissionModal from '@/components/missions/NewMissionModal';
import { Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import type { Mission } from '@/types/ebios';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Menu } from '@headlessui/react';
import { toast } from 'react-hot-toast';

const Missions = () => {
  const dispatch = useDispatch();
  const missions = useSelector((state: RootState) => state.missions.missions);
  const [isNewMissionModalOpen, setIsNewMissionModalOpen] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const fetchedMissions = await getMissions();
        dispatch(setMissions(fetchedMissions));
      } catch (error) {
        console.error('Error fetching missions:', error);
        setError('Failed to load missions');
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [dispatch]);

  const handleCreateMission = async (data: Partial<Mission>) => {
    try {
      const newMission = await createMission({
        ...data,
        status: 'draft',
        assignedTo: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Omit<Mission, 'id'>);
      
      if (newMission) {
        dispatch(addMission(newMission));
        setIsNewMissionModalOpen(false);
        toast.success('Mission created successfully');
      }
    } catch (error) {
      console.error('Error creating mission:', error);
      setError('Failed to create mission');
      toast.error('Failed to create mission');
    }
  };

  const handleUpdateMission = async (data: Partial<Mission>) => {
    if (!editingMission) return;
    
    try {
      const updatedMission = await updateMission(editingMission.id, data);
      dispatch(updateMissionState(updatedMission));
      setEditingMission(null);
      toast.success('Mission updated successfully');
    } catch (error) {
      console.error('Error updating mission:', error);
      toast.error('Failed to update mission');
    }
  };

  const handleDeleteMission = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this mission?')) return;
    
    try {
      await deleteMission(id);
      dispatch(deleteMissionState(id));
      toast.success('Mission deleted successfully');
    } catch (error) {
      console.error('Error deleting mission:', error);
      toast.error('Failed to delete mission');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4"
          variant="secondary"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Missions</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your risk assessment missions and track their progress.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button 
            className="flex items-center space-x-2"
            onClick={() => setIsNewMissionModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>New Mission</span>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Due Date
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Assigned To
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {missions.map((mission) => (
              <tr key={mission.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {mission.name}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      mission.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : mission.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {mission.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {new Date(mission.dueDate).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {mission.assignedTo.join(', ')}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="p-2 hover:bg-gray-50 rounded-full">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </Menu.Button>
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setEditingMission(mission)}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                          >
                            <Edit2 className="mr-3 h-4 w-4" />
                            Edit
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => handleDeleteMission(mission.id)}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } flex w-full items-center px-4 py-2 text-sm text-red-700`}
                          >
                            <Trash2 className="mr-3 h-4 w-4" />
                            Delete
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NewMissionModal
        isOpen={isNewMissionModalOpen || !!editingMission}
        onClose={() => {
          setIsNewMissionModalOpen(false);
          setEditingMission(null);
        }}
        onSubmit={editingMission ? handleUpdateMission : handleCreateMission}
        initialData={editingMission || undefined}
      />
    </div>
  );
};

export default Missions;