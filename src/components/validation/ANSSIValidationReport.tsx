/**
 * Composant d'affichage du rapport de validation ANSSI
 */

import React, { useState } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, Download, Shield, FileText } from 'lucide-react';
import Button from '../ui/button';
import { pdfExportService } from '../../services/export/PDFExportService';

interface ValidationResult {
  isValid: boolean;
  score: number;
  criticalIssues: string[];
  warnings: string[];
  recommendations: string[];
  anssiCompliance: {
    workshop1: number;
    workshop2: number;
    workshop3: number;
    workshop4: number;
    workshop5: number;
    overall: number;
  };
}

interface ANSSIValidationReportProps {
  validation: ValidationResult;
  workshop: number;
  onClose: () => void;
  onExport?: () => void;
  missionData?: {
    id: string;
    name: string;
    description: string;
  };
  workshopData?: any; // Données spécifiques à l'atelier
}

const ANSSIValidationReport: React.FC<ANSSIValidationReportProps> = ({
  validation,
  workshop,
  onClose,
  onExport,
  missionData,
  workshopData
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-6 w-6 text-green-500" />;
    if (score >= 60) return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
    return <AlertCircle className="h-6 w-6 text-red-500" />;
  };

  const getComplianceLevel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Bon';
    if (score >= 60) return 'Acceptable';
    if (score >= 40) return 'Insuffisant';
    return 'Critique';
  };

  const handleExportPDF = async () => {
    if (!missionData) {
      alert('Données de mission manquantes pour l\'export');
      return;
    }

    setIsExporting(true);
    try {
      await pdfExportService.exportANSSIReport({
        mission: {
          id: missionData.id,
          name: missionData.name,
          description: missionData.description
        } as any,
        workshop,
        validationResult: validation,
        ...workshopData
      });
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      alert('Erreur lors de l\'export PDF. Vérifiez que les popups sont autorisés.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8" />
              <div>
                <h2 className="text-xl font-bold">Rapport de Conformité ANSSI</h2>
                <p className="text-blue-100">EBIOS RM v1.5 - Atelier {workshop}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={handleExportPDF}
                disabled={isExporting}
                className="text-white border-white hover:bg-white hover:text-blue-600"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Export...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </>
                )}
              </Button>
              {onExport && (
                <Button
                  variant="outline"
                  onClick={onExport}
                  className="text-white border-white hover:bg-white hover:text-blue-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Custom
                </Button>
              )}
              <Button
                variant="outline"
                onClick={onClose}
                className="text-white border-white hover:bg-white hover:text-blue-600"
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>

        {/* Score global */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getScoreIcon(validation.score)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Score de Conformité : {validation.score}/100
                </h3>
                <p className="text-sm text-gray-600">
                  Niveau : {getComplianceLevel(validation.score)}
                </p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${getScoreColor(validation.score)}`}>
              <span className="font-bold text-lg">{validation.score}%</span>
            </div>
          </div>
        </div>

        {/* Problèmes critiques */}
        {validation.criticalIssues.length > 0 && (
          <div className="p-6 border-b">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h4 className="font-semibold text-red-800">
                Problèmes Critiques ({validation.criticalIssues.length})
              </h4>
            </div>
            <div className="space-y-2">
              {validation.criticalIssues.map((issue, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-red-800">{issue}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Avertissements */}
        {validation.warnings.length > 0 && (
          <div className="p-6 border-b">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <h4 className="font-semibold text-yellow-800">
                Avertissements ({validation.warnings.length})
              </h4>
            </div>
            <div className="space-y-2">
              {validation.warnings.map((warning, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-yellow-800">{warning}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommandations */}
        {validation.recommendations.length > 0 && (
          <div className="p-6 border-b">
            <div className="flex items-center space-x-2 mb-4">
              <Info className="h-5 w-5 text-blue-500" />
              <h4 className="font-semibold text-blue-800">
                Recommandations ({validation.recommendations.length})
              </h4>
            </div>
            <div className="space-y-2">
              {validation.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-blue-800">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Conformité par atelier */}
        <div className="p-6">
          <h4 className="font-semibold text-gray-800 mb-4">Conformité par Atelier</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((workshopNum) => {
              const score = validation.anssiCompliance[`workshop${workshopNum}` as keyof typeof validation.anssiCompliance] as number;
              const isCurrentWorkshop = workshopNum === workshop;
              
              return (
                <div
                  key={workshopNum}
                  className={`p-4 rounded-lg border ${
                    isCurrentWorkshop 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      Atelier {workshopNum}
                    </div>
                    <div className={`text-2xl font-bold mt-2 ${
                      score >= 80 ? 'text-green-600' :
                      score >= 60 ? 'text-yellow-600' :
                      score >= 40 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {score}%
                    </div>
                    {isCurrentWorkshop && (
                      <div className="text-xs text-blue-600 font-medium mt-1">
                        Actuel
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Score global */}
          <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-900">Score Global EBIOS RM</div>
                <div className="text-sm text-gray-600">Moyenne pondérée de tous les ateliers</div>
              </div>
              <div className={`text-3xl font-bold ${
                validation.anssiCompliance.overall >= 80 ? 'text-green-600' :
                validation.anssiCompliance.overall >= 60 ? 'text-yellow-600' :
                validation.anssiCompliance.overall >= 40 ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {Math.round(validation.anssiCompliance.overall)}%
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Rapport généré selon les critères ANSSI EBIOS RM v1.5
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleExportPDF}
                disabled={isExporting}
                className="text-sm"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                    Export...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </>
                )}
              </Button>
              {onExport && (
                <Button
                  variant="outline"
                  onClick={onExport}
                  className="text-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Custom
                </Button>
              )}
              <Button
                onClick={onClose}
                className="text-sm"
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ANSSIValidationReport;
