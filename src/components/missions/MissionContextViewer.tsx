import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Building2, Users, Shield, Target, Clock, MapPin, Cpu, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Mission } from '@/types/ebios';

interface MissionContextViewerProps {
  isOpen: boolean;
  onClose: () => void;
  mission: Mission;
}

const MissionContextViewer: React.FC<MissionContextViewerProps> = ({
  isOpen,
  onClose,
  mission
}) => {
  const missionContext = mission.missionContext;

  if (!missionContext) {
    return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Contexte de la Mission
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Aucun contexte détaillé disponible pour cette mission.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Cette mission a été créée avec le formulaire simplifié.
                </p>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <Dialog.Title className="text-xl font-semibold text-gray-900">
                  Contexte de la Mission
                </Dialog.Title>
                <p className="text-sm text-gray-600 mt-1">
                  {mission.name}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-8">
                {/* Organisation */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Organisation</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Nom</label>
                      <p className="text-gray-900">{missionContext.organizationName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Secteur</label>
                      <p className="text-gray-900">{missionContext.sector}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Taille</label>
                      <p className="text-gray-900">{missionContext.organizationSize}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Périmètre géographique</label>
                      <p className="text-gray-900">{missionContext.geographicScope || 'Non défini'}</p>
                    </div>
                  </div>
                </div>

                {/* Composants SI */}
                {missionContext.siComponents && missionContext.siComponents.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Cpu className="h-5 w-5 text-purple-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Composants SI</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {missionContext.siComponents.map((component, index) => (
                        <Badge key={index} variant="secondary">
                          {component}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Processus critiques */}
                {missionContext.criticalProcesses && missionContext.criticalProcesses.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Processus Critiques</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {missionContext.criticalProcesses.map((process, index) => (
                        <Badge key={index} variant="outline">
                          {process}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Réglementations */}
                {missionContext.regulations && missionContext.regulations.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Shield className="h-5 w-5 text-red-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Réglementations</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {missionContext.regulations.map((regulation, index) => (
                        <Badge key={index} variant="destructive">
                          {regulation}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Objectifs de la mission */}
                {missionContext.missionObjectives && missionContext.missionObjectives.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Objectifs de la Mission</h3>
                    </div>
                    <div className="space-y-2">
                      {missionContext.missionObjectives.map((objective, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          <p className="text-gray-900">{objective}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Informations supplémentaires */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {missionContext.timeframe && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <label className="text-sm font-medium text-gray-700">Délai de réalisation</label>
                      </div>
                      <p className="text-gray-900">{missionContext.timeframe}</p>
                    </div>
                  )}

                  {missionContext.securityMaturity && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <label className="text-sm font-medium text-gray-700">Maturité sécurité</label>
                      </div>
                      <p className="text-gray-900">{missionContext.securityMaturity}</p>
                    </div>
                  )}

                  {missionContext.financialStakes && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Enjeux financiers</label>
                      <p className="text-gray-900">{missionContext.financialStakes}</p>
                    </div>
                  )}

                  {missionContext.specificRequirements && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Exigences spécifiques</label>
                      <p className="text-gray-900">{missionContext.specificRequirements}</p>
                    </div>
                  )}
                </div>

                {/* Technologies et interfaces */}
                {((missionContext.mainTechnologies && missionContext.mainTechnologies.length > 0) ||
                  (missionContext.externalInterfaces && missionContext.externalInterfaces.length > 0)) && (
                  <div className="space-y-4">
                    {missionContext.mainTechnologies && missionContext.mainTechnologies.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Technologies principales</label>
                        <div className="flex flex-wrap gap-2">
                          {missionContext.mainTechnologies.map((tech, index) => (
                            <Badge key={index} variant="outline">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {missionContext.externalInterfaces && missionContext.externalInterfaces.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Interfaces externes</label>
                        <div className="flex flex-wrap gap-2">
                          {missionContext.externalInterfaces.map((interface_, index) => (
                            <Badge key={index} variant="outline">
                              {interface_}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-6">
              <div className="flex justify-end">
                <Button onClick={onClose}>
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default MissionContextViewer;
