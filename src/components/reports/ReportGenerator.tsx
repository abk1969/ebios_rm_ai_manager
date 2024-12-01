import React, { useState } from 'react';
import { FileText, Download, AlertTriangle } from 'lucide-react';
import ReportWatermark from './ReportWatermark';

interface ReportGeneratorProps {
  missionId: string;
  missionName: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ missionId, missionName }) => {
  const [generating, setGenerating] = useState(false);

  const generateReport = async () => {
    try {
      setGenerating(true);

      // Créer le contenu du rapport avec le watermark
      const reportContent = `
RAPPORT D'ANALYSE DES RISQUES
============================
Mission: ${missionName}
Date: ${new Date().toLocaleDateString()}

AVERTISSEMENT LÉGAL
------------------
Ce document est généré par EBIOS Cloud Pro, un outil indépendant d'aide à l'analyse des risques.
EBIOS® et EBIOS Risk Manager® sont des marques déposées de l'ANSSI.
Pour la méthode officielle, consultez : www.ssi.gouv.fr/ebios-risk-manager

MENTIONS LÉGALES
---------------
- Document généré automatiquement
- Version Community Edition
- Powered by GLOBACOM3000 / Abbas BENTERKI
- Date de génération: ${new Date().toISOString()}

[Le contenu du rapport suit...]
`;

      // Créer et télécharger le fichier
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `EBIOS_RM_Report_${missionId}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <h2 className="text-lg font-medium text-gray-900">Générer le rapport</h2>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Important</h3>
              <p className="mt-1 text-sm text-yellow-700">
                Ce rapport est généré automatiquement et doit être validé par un expert qualifié.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={generateReport}
          disabled={generating}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Download className="h-4 w-4 mr-2" />
          {generating ? 'Génération en cours...' : 'Générer le rapport'}
        </button>
      </div>

      {/* Le watermark sera visible sur la prévisualisation */}
      <ReportWatermark />
    </div>
  );
};

export default ReportGenerator;