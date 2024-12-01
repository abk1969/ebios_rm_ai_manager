import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setMissions } from '@/store/slices/missionsSlice';
import { getMissions } from '@/services/firebase/missions';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const Dashboard = () => {
  const dispatch = useDispatch();
  const missions = useSelector((state: RootState) => state.missions.missions);
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
      </div>
    );
  }

  const stats = {
    totalMissions: missions.length,
    inProgress: missions.filter((m) => m.status === 'in_progress').length,
    completed: missions.filter((m) => m.status === 'completed').length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Missions
                </dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {stats.totalMissions}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  In Progress
                </dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {stats.inProgress}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Completed
                </dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {stats.completed}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Recent Activity
          </h3>
          <div className="mt-6">
            {missions.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {missions.slice(0, 5).map((mission) => (
                  <li key={mission.id} className="py-4">
                    <div className="flex space-x-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">{mission.name}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(mission.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">{mission.description}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No missions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;