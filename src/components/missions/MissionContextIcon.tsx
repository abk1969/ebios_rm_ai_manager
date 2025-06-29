/**
 * Icône "Contexte Mission" pour les ateliers
 * 🎯 OBJECTIF: Afficher une icône cliquable dans chaque atelier pour voir le contexte de mission
 */

import React, { useState } from 'react';
import { Building2, X, MapPin, Users, Shield, Database, Cpu, Network, AlertCircle } from 'lucide-react';
import type { Mission } from '../../types/ebios';

interface MissionContextIconProps {
  mission: Mission;
  className?: string;
}

/**
 * Composant icône pour afficher le contexte de mission
 */
const MissionContextIcon: React.FC<MissionContextIconProps> = ({ 
  mission, 
  className = '' 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Vérifier si la mission a un contexte
  const hasContext = mission.missionContext && Object.keys(mission.missionContext).length > 0;

  if (!hasContext) {
    return null; // Ne pas afficher l'icône si pas de contexte
  }

  const context = mission.missionContext!;

  return (
    <>
      {/* Icône cliquable */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`inline-flex items-center justify-center w-8 h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full transition-colors duration-200 ${className}`}
        title="Voir le contexte de mission"
      >
        <Building2 className="h-4 w-4" />
      </button>

      {/* Modal de contexte */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* En-tête */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <Building2 className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Contexte de Mission</h2>
                  <p className="text-sm text-gray-600">{mission.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid gap-6 md:grid-cols-2">
                
                {/* Informations organisationnelles */}
                <div className="space-y-4">
                  <div className="flex items-center mb-3">
                    <Building2 className="h-5 w-5 text-gray-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Organisation</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {context.organizationName && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Nom de l'organisation</label>
                        <p className="text-sm text-gray-900 mt-1">{context.organizationName}</p>
                      </div>
                    )}
                    
                    {context.sector && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Secteur d'activité</label>
                        <p className="text-sm text-gray-900 mt-1">{context.sector}</p>
                      </div>
                    )}
                    
                    {context.organizationSize && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Taille de l'organisation</label>
                        <p className="text-sm text-gray-900 mt-1">{context.organizationSize}</p>
                      </div>
                    )}
                    
                    {context.geographicScope && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Périmètre géographique</label>
                        <div className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                          <p className="text-sm text-gray-900">{context.geographicScope}</p>
                        </div>
                      </div>
                    )}
                    
                    {context.criticalityLevel && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Niveau de criticité</label>
                        <div className="flex items-center mt-1">
                          <AlertCircle className="h-4 w-4 text-gray-500 mr-1" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            context.criticalityLevel === 'high' ? 'bg-red-100 text-red-700' :
                            context.criticalityLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {context.criticalityLevel === 'high' ? 'Élevée' :
                             context.criticalityLevel === 'medium' ? 'Moyenne' : 'Faible'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contexte technique */}
                <div className="space-y-4">
                  <div className="flex items-center mb-3">
                    <Cpu className="h-5 w-5 text-gray-600 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">Technique</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {context.siComponents && context.siComponents.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Composants SI</label>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {context.siComponents.slice(0, 6).map((component, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {component}
                            </span>
                          ))}
                          {context.siComponents.length > 6 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{context.siComponents.length - 6} autres
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {context.mainTechnologies && context.mainTechnologies.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Technologies principales</label>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {context.mainTechnologies.slice(0, 4).map((tech, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              {tech}
                            </span>
                          ))}
                          {context.mainTechnologies.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{context.mainTechnologies.length - 4} autres
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {context.externalInterfaces && context.externalInterfaces.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Interfaces externes</label>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <Network className="h-4 w-4 text-gray-500 mr-1" />
                          {context.externalInterfaces.slice(0, 3).map((interface_, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                              {interface_}
                            </span>
                          ))}
                          {context.externalInterfaces.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{context.externalInterfaces.length - 3} autres
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Données sensibles */}
                {context.sensitiveData && context.sensitiveData.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center mb-3">
                      <Database className="h-5 w-5 text-gray-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">Données sensibles</h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {context.sensitiveData.slice(0, 5).map((data, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          {data}
                        </span>
                      ))}
                      {context.sensitiveData.length > 5 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{context.sensitiveData.length - 5} autres
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Processus critiques */}
                {context.criticalProcesses && context.criticalProcesses.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center mb-3">
                      <Shield className="h-5 w-5 text-gray-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">Processus critiques</h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {context.criticalProcesses.slice(0, 4).map((process, index) => (
                        <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                          {process}
                        </span>
                      ))}
                      {context.criticalProcesses.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{context.criticalProcesses.length - 4} autres
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Objectifs de mission */}
                {context.missionObjectives && context.missionObjectives.length > 0 && (
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center mb-3">
                      <Users className="h-5 w-5 text-gray-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">Objectifs de la mission</h3>
                    </div>
                    
                    <ul className="space-y-2">
                      {context.missionObjectives.map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                          <span className="text-sm text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Pied de page */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Contexte généré lors de la création de mission</span>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MissionContextIcon;
