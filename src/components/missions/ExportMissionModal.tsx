import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import {
  X,
  Download,
  FileText,
  Table,
  Code,
  CheckCircle,
  Settings,
  Globe,
  Eye,
  Target,
  Shield,
  AlertTriangle
} from 'lucide-react';
import Button from '../ui/button';
import type { Mission } from '../../types/ebios';

interface ExportMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: Mission;
  onExport: (format: string, options: ExportOptions) => Promise<void>;
}

interface ExportOptions {
  format: 'pdf' | 'excel' | 'json' | 'word';
  includeWorkshops: boolean;
  includeDetails: boolean;
  language: 'fr' | 'en';
  sections: {
    mission: boolean;
    businessValues: boolean;
    supportingAssets: boolean;
    strategicScenarios: boolean;
    securityMeasures: boolean;
    treatmentPlan: boolean;
  };
}

const ExportMissionModal: React.FC<ExportMissionModalProps> = ({
  isOpen,
  onClose,
  mission,
  onExport
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel' | 'json' | 'word'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeWorkshops: true,
    includeDetails: true,
    language: 'fr',
    sections: {
      mission: true,
      businessValues: true,
      supportingAssets: true,
      strategicScenarios: true,
      securityMeasures: true,
      treatmentPlan: true
    }
  });

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF',
      description: 'Rapport complet au format PDF',
      icon: FileText,
      color: 'text-red-600 bg-red-100',
      recommended: true
    },
    {
      id: 'excel',
      name: 'Excel (CSV)',
      description: 'Données tabulaires pour analyse',
      icon: Table,
      color: 'text-green-600 bg-green-100',
      recommended: false
    },
    {
      id: 'json',
      name: 'JSON',
      description: 'Format technique pour intégration',
      icon: Code,
      color: 'text-blue-600 bg-blue-100',
      recommended: false
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(selectedFormat, {
        ...exportOptions,
        format: selectedFormat
      });
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const toggleSection = (section: keyof ExportOptions['sections']) => {
    setExportOptions(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: !prev.sections[section]
      }
    }));
  };

  const getSelectedSectionsCount = () => {
    return Object.values(exportOptions.sections).filter(Boolean).length;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-2xl rounded-lg bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Exporter la Mission
              </Dialog.Title>
              <p className="text-sm text-gray-600 mt-1">
                {mission.name}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Sélection du format */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Format d'export</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {exportFormats.map((format) => {
                  const Icon = format.icon;
                  return (
                    <div
                      key={format.id}
                      className={`relative cursor-pointer rounded-lg border p-4 hover:bg-gray-50 ${
                        selectedFormat === format.id
                          ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                          : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedFormat(format.id as any)}
                    >
                      {format.recommended && (
                        <div className="absolute -top-2 -right-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Recommandé
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${format.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{format.name}</h4>
                          <p className="text-xs text-gray-500">{format.description}</p>
                        </div>
                      </div>
                      
                      {selectedFormat === format.id && (
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Options d'export */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Options d'export</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Inclure les détails des workshops</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExportOptions(prev => ({ ...prev, includeWorkshops: !prev.includeWorkshops }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      exportOptions.includeWorkshops ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        exportOptions.includeWorkshops ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Inclure les informations détaillées</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setExportOptions(prev => ({ ...prev, includeDetails: !prev.includeDetails }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      exportOptions.includeDetails ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        exportOptions.includeDetails ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700">Langue</span>
                  </div>
                  <select
                    value={exportOptions.language}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, language: e.target.value as 'fr' | 'en' }))}
                    className="text-sm border border-gray-300 rounded-md px-3 py-1"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sélection des sections */}
            {exportOptions.includeWorkshops && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Sections à inclure ({getSelectedSectionsCount()}/6)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'mission', label: 'Informations de la mission', icon: FileText },
                    { key: 'businessValues', label: 'Valeurs métier', icon: Target },
                    { key: 'supportingAssets', label: 'Actifs supports', icon: Shield },
                    { key: 'strategicScenarios', label: 'Scénarios stratégiques', icon: AlertTriangle },
                    { key: 'securityMeasures', label: 'Mesures de sécurité', icon: CheckCircle },
                    { key: 'treatmentPlan', label: 'Plan de traitement', icon: FileText }
                  ].map((section) => {
                    const Icon = section.icon;
                    const isSelected = exportOptions.sections[section.key as keyof ExportOptions['sections']];
                    
                    return (
                      <div
                        key={section.key}
                        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => toggleSection(section.key as keyof ExportOptions['sections'])}
                      >
                        <div className={`p-1 rounded ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className={`text-sm ${isSelected ? 'text-blue-900 font-medium' : 'text-gray-700'}`}>
                          {section.label}
                        </span>
                        {isSelected && (
                          <CheckCircle className="h-4 w-4 text-blue-500 ml-auto" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Aperçu de l'export */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Aperçu de l'export</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Format: {exportFormats.find(f => f.id === selectedFormat)?.name}</p>
                <p>• Sections: {getSelectedSectionsCount()} incluses</p>
                <p>• Détails: {exportOptions.includeDetails ? 'Complets' : 'Résumé'}</p>
                <p>• Langue: {exportOptions.language === 'fr' ? 'Français' : 'English'}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isExporting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || getSelectedSectionsCount() === 0}
              className="flex items-center space-x-2"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Export en cours...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Exporter</span>
                </>
              )}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ExportMissionModal;
