import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '@/store';
import { addBusinessValue, setBusinessValues } from '@/store/slices/businessValuesSlice';
import { addSecurityControl, setSecurityControls } from '@/store/slices/securityControlsSlice';
import { addSupportingAsset, setSupportingAssets } from '@/store/slices/supportingAssetsSlice';
import { getBusinessValuesByMission, createBusinessValue } from '@/services/firebase/businessValues';
import { getSecurityControls, createSecurityControl } from '@/services/firebase/securityControls';
import { getSupportingAssets, createSupportingAsset } from '@/services/firebase/supportingAssets';
import { getMissionById } from '@/services/firebase/missions';
import Button from '@/components/ui/button';
import { Database, Shield, Server, Plus } from 'lucide-react';
import AddBusinessValueModal from '@/components/business-values/AddBusinessValueModal';
import AddSecurityControlModal from '@/components/security-baseline/AddSecurityControlModal';
import AddSupportingAssetModal from '@/components/supporting-assets/AddSupportingAssetModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import type { BusinessValue, Gap, SupportingAsset, Mission } from '@/types/ebios';

const Workshop1 = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const dispatch = useDispatch();
  const businessValues = useSelector((state: RootState) => state.businessValues.businessValues);
  const securityControls = useSelector((state: RootState) => state.securityControls.controls);
  const supportingAssets = useSelector((state: RootState) => state.supportingAssets.assets);
  
  const [isAddValueModalOpen, setIsAddValueModalOpen] = useState(false);
  const [isAddControlModalOpen, setIsAddControlModalOpen] = useState(false);
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [selectedBusinessValueId, setSelectedBusinessValueId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mission, setMission] = useState<Mission | null>(null);

  if (!missionId) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600">Mission ID is required</p>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [missionData, values, controls, assets] = await Promise.all([
          getMissionById(missionId),
          getBusinessValuesByMission(missionId),
          getSecurityControls(missionId),
          getSupportingAssets(missionId)
        ]);
        
        if (missionData) {
          setMission(missionData);
          dispatch(setBusinessValues(values));
          dispatch(setSecurityControls(controls));
          dispatch(setSupportingAssets(assets));
        } else {
          setError('Mission not found');
        }
      } catch (error) {
        console.error('Error fetching workshop data:', error);
        setError('Failed to load workshop data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [missionId, dispatch]);

  const handleCreateBusinessValue = async (data: Partial<BusinessValue>) => {
    try {
      const newValue = await createBusinessValue({
        ...data,
        missionId,
        supportingAssets: [],
        dreadedEvents: [],
      } as Omit<BusinessValue, 'id'>);
      
      dispatch(addBusinessValue(newValue));
      setIsAddValueModalOpen(false);
    } catch (error) {
      console.error('Error creating business value:', error);
      setError('Failed to create business value');
    }
  };

  const handleCreateSecurityControl = async (data: Partial<any>) => {
    try {
      const newControl = await createSecurityControl({
        ...data,
        missionId,
        gaps: [],
      } as any);
      
      dispatch(addSecurityControl(newControl));
      setIsAddControlModalOpen(false);
    } catch (error) {
      console.error('Error creating security control:', error);
      setError('Failed to create security control');
    }
  };

  const handleCreateSupportingAsset = async (data: Partial<SupportingAsset>) => {
    if (!selectedBusinessValueId) return;

    try {
      const newAsset = await createSupportingAsset({
        ...data,
        businessValueId: selectedBusinessValueId,
      } as Omit<SupportingAsset, 'id'>);
      
      dispatch(addSupportingAsset(newAsset));
      setIsAddAssetModalOpen(false);
      setSelectedBusinessValueId(null);
    } catch (error) {
      console.error('Error creating supporting asset:', error);
      setError('Failed to create supporting asset');
    }
  };

  const handleAddAssetClick = (businessValueId: string) => {
    setSelectedBusinessValueId(businessValueId);
    setIsAddAssetModalOpen(true);
  };

  const getControlStatusStyle = (status: any) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-50';
      case 'in_review':
        return 'bg-yellow-50';
      case 'approved':
        return 'bg-green-50';
      case 'archived':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getControlStatusBadgeStyle = (status: any) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'in_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Workshop 1: Scope and Security Baseline</h1>
        <p className="mt-1 text-sm text-gray-500">Define the scope of analysis and evaluate the security baseline</p>
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Business Values Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Database className="h-6 w-6 text-blue-500" />
                <h2 className="ml-2 text-lg font-medium text-gray-900">Business Values</h2>
              </div>
              <Button
                onClick={() => setIsAddValueModalOpen(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Value</span>
              </Button>
            </div>

            <div className="mt-6 divide-y divide-gray-200">
              {businessValues.map((value) => (
                <div key={value.id} className="py-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">{value.name}</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddAssetClick(value.id)}
                      className="flex items-center space-x-1"
                    >
                      <Server className="h-4 w-4" />
                      <span>Add Asset</span>
                    </Button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{value.description}</p>
                  
                  {/* Supporting Assets */}
                  <div className="mt-4">
                    <h4 className="text-xs font-medium text-gray-500">Supporting Assets:</h4>
                    {supportingAssets.filter(asset => asset.businessValueId === value.id).length > 0 ? (
                      <div className="mt-2 grid grid-cols-1 gap-2">
                        {supportingAssets
                          .filter(asset => asset.businessValueId === value.id)
                          .map((asset) => (
                            <div 
                              key={asset.id}
                              className="flex items-start space-x-3 rounded-md border border-gray-200 p-3"
                            >
                              <Server className="h-5 w-5 text-gray-400 mt-0.5" />
                              <div>
                                <h5 className="text-sm font-medium text-gray-900">{asset.name}</h5>
                                <p className="text-xs text-gray-500">{asset.type}</p>
                                {asset.description && (
                                  <p className="mt-1 text-xs text-gray-500">{asset.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-gray-500">No supporting assets defined yet.</p>
                    )}
                  </div>
                </div>
              ))}
              {businessValues.length === 0 && (
                <div className="py-6 text-center">
                  <Database className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No business values</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding a business value.</p>
                  <div className="mt-6">
                    <Button onClick={() => setIsAddValueModalOpen(true)}>Add Business Value</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security Controls Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-green-500" />
                <h2 className="ml-2 text-lg font-medium text-gray-900">Security Baseline</h2>
              </div>
              <Button
                onClick={() => setIsAddControlModalOpen(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Control</span>
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              {securityControls.map((control) => (
                <div
                  key={control.id}
                  className={`rounded-lg p-4 ${getControlStatusStyle(control.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">{control.name}</h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getControlStatusBadgeStyle(control.status)}`}
                    >
                      {control.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{control.description}</p>
                  {control.gaps && control.gaps.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-xs font-medium text-gray-700">Identified Gaps:</h4>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        {control.gaps.map((gap: any) => (
                          <li key={gap.id} className="text-xs text-gray-600">
                            {gap.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
              {securityControls.length === 0 && (
                <div className="text-center py-6">
                  <Shield className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No security controls</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding a security control.</p>
                  <div className="mt-6">
                    <Button onClick={() => setIsAddControlModalOpen(true)}>Add Security Control</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddBusinessValueModal
        isOpen={isAddValueModalOpen}
        onClose={() => setIsAddValueModalOpen(false)}
        onSubmit={handleCreateBusinessValue}
        missionId={missionId}
      />

      <AddSecurityControlModal
        isOpen={isAddControlModalOpen}
        onClose={() => setIsAddControlModalOpen(false)}
        onSubmit={handleCreateSecurityControl}
        missionId={missionId}
      />

      <AddSupportingAssetModal
        isOpen={isAddAssetModalOpen}
        onClose={() => setIsAddAssetModalOpen(false)}
        onSubmit={handleCreateSupportingAsset}
        businessValueId={selectedBusinessValueId || ''}
      />
    </div>
  );
};

export default Workshop1;