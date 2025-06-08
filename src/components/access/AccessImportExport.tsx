import React, { useState } from 'react';
import { Upload, Download, Database, FileJson, AlertCircle, CheckCircle, Info, Loader2 } from 'lucide-react';
import Button from '@/components/ui/button';
import { accessImporter, type ImportResult } from '@/services/access/AccessImporter';
import { accessExporter, type ExportOptions, type ExportResult } from '@/services/access/AccessExporter';
import { cn } from '@/lib/utils';

interface AccessImportExportProps {
  missionId: string;
  onImportComplete?: (result: ImportResult) => void;
  onExportComplete?: (result: ExportResult) => void;
  className?: string;
}

const AccessImportExport: React.FC<AccessImportExportProps> = ({
  missionId,
  onImportComplete,
  onExportComplete,
  className
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [exportResult, setExportResult] = useState<ExportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'json',
    includeAIMetadata: false,
    preserveFirebaseIds: true,
    generateReport: true
  });

  /**
   * Gestion de l'import
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      // Lecture du fichier
      const fileContent = await readFileContent(selectedFile);
      const accessData = JSON.parse(fileContent);

      // Import via le service
      const result = await accessImporter.importFromAccess(accessData, missionId);
      
      setImportResult(result);
      
      if (result.success && onImportComplete) {
        onImportComplete(result);
      }
          } catch (error) {
        console.error('Erreur import:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        setImportResult({
          success: false,
          statistics: {
            total: 0,
            imported: 0,
            enriched: 0,
            errors: 1,
            warnings: [`Erreur lors de l'import: ${errorMessage}`]
          }
        });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Gestion de l'export
   */
  const handleExport = async () => {
    setIsProcessing(true);
    try {
      // Récupération des données depuis Firebase
      const data = await fetchMissionData(missionId);
      
      // Export via le service
      const result = await accessExporter.exportToAccess(
        missionId,
        data,
        exportOptions
      );
      
      setExportResult(result);
      
      if (result.success) {
        // Téléchargement du fichier
        downloadExportedData(result, exportOptions.format);
        
        if (onExportComplete) {
          onExportComplete(result);
        }
      }
          } catch (error) {
        console.error('Erreur export:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        setExportResult({
          success: false,
          statistics: {
            total: 0,
            exported: 0,
            warnings: [`Erreur lors de l'export: ${errorMessage}`]
          }
        });
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const fetchMissionData = async (missionId: string) => {
    // TODO: Implémenter la récupération réelle depuis Firebase
    // Pour l'instant, simulation
    return {
      mission: {} as any,
      businessValues: [],
      dreadedEvents: [],
      supportingAssets: [],
      riskSources: [],
      stakeholders: [],
      attackPaths: [],
      securityMeasures: [],
      strategicScenarios: []
    };
  };

  const downloadExportedData = (result: ExportResult, format: string) => {
    if (!result.data) return;

    let blob: Blob;
    let filename: string;

    if (format === 'json') {
      blob = new Blob([JSON.stringify(result.data, null, 2)], { 
        type: 'application/json' 
      });
      filename = `ebios_export_${new Date().toISOString().split('T')[0]}.json`;
    } else if (result.data instanceof Blob) {
      blob = result.data;
      filename = `ebios_export_${new Date().toISOString().split('T')[0]}.${format}`;
    } else {
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={cn("rounded-lg border bg-white shadow-sm", className)}>
      {/* Tabs */}
      <div className="border-b">
        <div className="flex">
          <button
            className={cn(
              "flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'import'
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab('import')}
          >
            <Upload className="inline h-4 w-4 mr-2" />
            Import depuis Access
          </button>
          <button
            className={cn(
              "flex-1 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'export'
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            )}
            onClick={() => setActiveTab('export')}
          >
            <Download className="inline h-4 w-4 mr-2" />
            Export vers Access
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="space-y-6">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <Info className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Import depuis une base Access EBIOS RM
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Format supporté : JSON exporté depuis Access</li>
                      <li>Enrichissement IA automatique des données</li>
                      <li>Préservation des références textuelles</li>
                      <li>Validation de cohérence ANSSI</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* File selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner le fichier Access
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400">
                <div className="space-y-1 text-center">
                  <Database className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Choisir un fichier</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept=".json"
                        onChange={handleFileSelect}
                      />
                    </label>
                    <p className="pl-1">ou glisser-déposer</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    JSON jusqu'à 10MB
                  </p>
                </div>
              </div>
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Fichier sélectionné : {selectedFile.name}
                </p>
              )}
            </div>

            {/* Import button */}
            <div className="flex justify-end">
              <Button
                onClick={handleImport}
                disabled={!selectedFile || isProcessing}
                className="flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Import en cours...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Importer</span>
                  </>
                )}
              </Button>
            </div>

            {/* Import results */}
            {importResult && (
              <div className={cn(
                "rounded-md p-4",
                importResult.success ? "bg-green-50" : "bg-red-50"
              )}>
                <div className="flex">
                  {importResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  )}
                  <div className="ml-3 flex-1">
                    <h3 className={cn(
                      "text-sm font-medium",
                      importResult.success ? "text-green-800" : "text-red-800"
                    )}>
                      {importResult.success ? 'Import réussi' : 'Erreur d\'import'}
                    </h3>
                    
                    {importResult.success && (
                      <div className="mt-2 text-sm text-green-700">
                        <p>📊 Statistiques :</p>
                        <ul className="mt-1 list-disc list-inside">
                          <li>Total traité : {importResult.statistics.total} enregistrements</li>
                          <li>Importés : {importResult.statistics.imported}</li>
                          <li>Enrichis par IA : {importResult.statistics.enriched}</li>
                        </ul>
                        
                        {importResult.coherenceReport && (
                          <div className="mt-3">
                            <p>✅ Cohérence EBIOS RM :</p>
                            <div className="mt-1 bg-green-100 rounded p-2">
                              <div className="flex items-center justify-between">
                                <span>Score global</span>
                                <span className="font-medium">
                                  {Math.round(importResult.coherenceReport.overallScore * 100)}%
                                </span>
                              </div>
                              <div className="mt-1 h-2 bg-green-200 rounded-full">
                                <div 
                                  className="h-full bg-green-600 rounded-full"
                                  style={{ width: `${importResult.coherenceReport.overallScore * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {importResult.statistics.warnings.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-yellow-800">
                          ⚠️ Avertissements :
                        </p>
                        <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
                          {importResult.statistics.warnings.map((warning, idx) => (
                            <li key={idx}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="space-y-6">
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <Info className="h-5 w-5 text-green-400 flex-shrink-0" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Export vers Access
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Conservation des références textuelles</li>
                      <li>Conversion automatique des échelles</li>
                      <li>Rapport de conversion inclus</li>
                      <li>Compatible avec Access EBIOS RM</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Export options */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format d'export
                </label>
                <div className="space-y-2">
                  {(['json', 'csv', 'sqlite'] as const).map((format) => (
                    <label key={format} className="flex items-center">
                      <input
                        type="radio"
                        value={format}
                        checked={exportOptions.format === format}
                        onChange={(e) => setExportOptions({
                          ...exportOptions,
                          format: e.target.value as any
                        })}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {format === 'json' && 'JSON (recommandé)'}
                        {format === 'csv' && 'CSV (tables séparées)'}
                        {format === 'sqlite' && 'SQLite (base de données)'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.preserveFirebaseIds}
                    onChange={(e) => setExportOptions({
                      ...exportOptions,
                      preserveFirebaseIds: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Conserver les ID Firebase pour la traçabilité
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.generateReport}
                    onChange={(e) => setExportOptions({
                      ...exportOptions,
                      generateReport: e.target.checked
                    })}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Générer un rapport de conversion
                  </span>
                </label>
              </div>
            </div>

            {/* Export button */}
            <div className="flex justify-end">
              <Button
                onClick={handleExport}
                disabled={isProcessing}
                className="flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
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

            {/* Export results */}
            {exportResult && (
              <div className={cn(
                "rounded-md p-4",
                exportResult.success ? "bg-green-50" : "bg-red-50"
              )}>
                <div className="flex">
                  {exportResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  )}
                  <div className="ml-3">
                    <h3 className={cn(
                      "text-sm font-medium",
                      exportResult.success ? "text-green-800" : "text-red-800"
                    )}>
                      {exportResult.success ? 'Export réussi' : 'Erreur d\'export'}
                    </h3>
                    
                    {exportResult.success && (
                      <div className="mt-2 text-sm text-green-700">
                        <p>✅ Fichier téléchargé avec succès</p>
                        <p className="mt-1">
                          📊 {exportResult.statistics.exported} enregistrements exportés
                        </p>
                      </div>
                    )}
                    
                    {exportResult.statistics.warnings.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-yellow-800">
                          ⚠️ Avertissements :
                        </p>
                        <ul className="mt-1 text-sm text-yellow-700 list-disc list-inside">
                          {exportResult.statistics.warnings.map((warning, idx) => (
                            <li key={idx}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessImportExport; 