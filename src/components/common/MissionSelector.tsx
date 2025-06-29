import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Target, ChevronDown, AlertCircle, CheckCircle } from 'lucide-react';
import { RootState } from '@/store';
import { setSelectedMission } from '@/store/slices/missionsSlice';
import { selectSelectedMission, selectAllMissions } from '@/store/selectors';
import Button from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Mission } from '@/types/ebios';

interface MissionSelectorProps {
  className?: string;
  compact?: boolean;
}

const MissionSelector: React.FC<MissionSelectorProps> = ({ 
  className = '', 
  compact = false 
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedMission = useSelector(selectSelectedMission);
  const missions = useSelector(selectAllMissions);
  const [isOpen, setIsOpen] = useState(false);

  const handleMissionSelect = (mission: Mission) => {
    dispatch(setSelectedMission(mission));
    setIsOpen(false);
  };

  const handleCreateMission = () => {
    navigate('/missions');
  };

  if (compact && selectedMission) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <CheckCircle className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium text-gray-900 truncate">
          {selectedMission.name}
        </span>
      </div>
    );
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {selectedMission ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-500" />
          )}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">
              {selectedMission ? 'Mission Active' : 'Aucune Mission Sélectionnée'}
            </h3>
            <p className="text-sm text-gray-600">
              {selectedMission 
                ? selectedMission.name 
                : 'Sélectionnez une mission pour accéder aux ateliers EBIOS RM'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {selectedMission && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/ebios-dashboard/${selectedMission.id}`)}
            >
              Tableau de bord
            </Button>
          )}
          
          <div className="relative">
            <Button
              variant={selectedMission ? "outline" : "default"}
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-1"
            >
              <span>{selectedMission ? 'Changer' : 'Sélectionner'}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            {isOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="py-1">
                  {missions.length > 0 ? (
                    missions.map((mission) => (
                      <button
                        key={mission.id}
                        onClick={() => handleMissionSelect(mission)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          selectedMission?.id === mission.id 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-gray-700'
                        }`}
                      >
                        <div className="font-medium">{mission.name}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {mission.description || 'Aucune description'}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Aucune mission disponible
                    </div>
                  )}
                  
                  <div className="border-t border-gray-100 mt-1">
                    <button
                      onClick={handleCreateMission}
                      className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                    >
                      + Créer une nouvelle mission
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Indicateur de progression si mission sélectionnée */}
      {selectedMission && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Progression des ateliers</span>
            <span>0/5 complétés</span>
          </div>
          <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
      )}
      
      {/* Message d'aide si pas de mission */}
      {!selectedMission && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-xs text-amber-800">
                <p className="font-medium">Mission requise</p>
                <p className="mt-1">
                  Pour accéder aux ateliers EBIOS RM, vous devez d'abord sélectionner ou créer une mission.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MissionSelector;