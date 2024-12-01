import React from 'react';
import { Card } from "@/components/ui/card";
import { FileText, Download, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ReportWatermark from './ReportWatermark';

interface ReportGenerationProps {
  reportData: any;
}

const ReportGeneration: React.FC<ReportGenerationProps> = ({ reportData }) => {
  const generateReport = () => {
    const reportContent = `
      ${reportData}
      
      ${ReportWatermark}
    `;
    
    // Ajouter les mentions légales au rapport
    const legalNotice = `
      Document généré par EBIOS Cloud Pro
      Outil indépendant d'aide à l'application de la méthode EBIOS Risk Manager
      EBIOS® et EBIOS Risk Manager® sont des marques déposées de l'ANSSI
      Pour la méthode officielle : www.ssi.gouv.fr/ebios-risk-manager
      
      Date de génération : ${new Date().toLocaleDateString()}
      Version : Community Edition
      
      Ce rapport est généré automatiquement et doit être validé par un expert qualifié.
      GLOBACOM3000 ne peut être tenu responsable des décisions prises sur la base de ce rapport.
    `;
    
    const fullReport = `${reportContent}\n\n${legalNotice}`;
    
    // Créer et télécharger le fichier
    const blob = new Blob([fullReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EBIOS_RM_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Génération du rapport
            </h2>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-800 font-medium">
                Important
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Ce rapport est généré automatiquement et doit être validé par un expert 
                qualifié en analyse des risques selon la méthode EBIOS RM.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-t border-gray-200">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Format du rapport</h3>
              <p className="text-sm text-gray-500">Document texte avec mentions légales</p>
            </div>
            <span className="text-sm text-gray-500">.txt</span>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-gray-200">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Contenu inclus</h3>
              <p className="text-sm text-gray-500">Analyse complète + mentions légales</p>
            </div>
            <span className="text-sm text-gray-500">Automatique</span>
          </div>
        </div>

        <div className="mt-6">
          <Button 
            onClick={generateReport}
            className="w-full flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Générer le rapport
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReportGeneration;