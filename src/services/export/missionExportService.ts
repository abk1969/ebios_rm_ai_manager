import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { Mission, BusinessValue, SupportingAsset, StrategicScenario, SecurityMeasure } from '../../types/ebios';

interface ExportData {
  mission: Mission;
  businessValues?: BusinessValue[];
  supportingAssets?: SupportingAsset[];
  strategicScenarios?: StrategicScenario[];
  securityMeasures?: SecurityMeasure[];
  treatmentPlan?: string;
}

interface ExportOptions {
  format: 'pdf' | 'word' | 'excel' | 'json';
  includeWorkshops: boolean;
  includeDetails: boolean;
  language: 'fr' | 'en';
}

export class MissionExportService {
  
  /**
   * Exporter une mission au format PDF
   */
  static async exportToPDF(data: ExportData, options: ExportOptions = {
    format: 'pdf',
    includeWorkshops: true,
    includeDetails: true,
    language: 'fr'
  }): Promise<void> {
    const { mission, businessValues = [], supportingAssets = [], strategicScenarios = [], securityMeasures = [], treatmentPlan = '' } = data;
    
    // Créer un nouveau document PDF
    const doc = new jsPDF();
    let yPosition = 20;
    
    // Configuration des styles
    const titleFont = 16;
    const subtitleFont = 14;
    const normalFont = 10;
    const lineHeight = 7;
    
    // En-tête du document
    doc.setFontSize(titleFont);
    doc.setFont('helvetica', 'bold');
    doc.text('Rapport EBIOS RM', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(subtitleFont);
    doc.text(mission.name, 20, yPosition);
    yPosition += 15;
    
    // Informations générales de la mission
    doc.setFontSize(normalFont);
    doc.setFont('helvetica', 'bold');
    doc.text('Informations générales', 20, yPosition);
    yPosition += lineHeight;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Description: ${mission.description || 'Non spécifiée'}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Contexte organisationnel: ${mission.organizationContext || 'Non spécifié'}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Périmètre: ${mission.scope || 'Non spécifié'}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Statut: ${mission.status}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Date de création: ${new Date(mission.createdAt).toLocaleDateString('fr-FR')}`, 20, yPosition);
    yPosition += lineHeight;
    doc.text(`Dernière mise à jour: ${new Date(mission.updatedAt).toLocaleDateString('fr-FR')}`, 20, yPosition);
    yPosition += 15;
    
    if (options.includeWorkshops) {
      // Atelier 1 - Valeurs métier
      if (businessValues.length > 0) {
        doc.setFont('helvetica', 'bold');
        doc.text('Atelier 1 - Valeurs Métier', 20, yPosition);
        yPosition += 10;
        
        const businessValueData = businessValues.map(value => [
          value.name,
          value.category,
          value.priority?.toString() || 'N/A',
          value.criticalityLevel || 'N/A'
        ]);
        
        (doc as any).autoTable({
          head: [['Nom', 'Catégorie', 'Priorité', 'Criticité']],
          body: businessValueData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [66, 139, 202] }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }
      
      // Atelier 2 - Actifs supports
      if (supportingAssets.length > 0) {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.text('Atelier 1 - Actifs Supports', 20, yPosition);
        yPosition += 10;
        
        const assetData = supportingAssets.map(asset => [
          asset.name,
          asset.type,
          asset.securityLevel,
          asset.vulnerabilities?.length?.toString() || '0'
        ]);
        
        (doc as any).autoTable({
          head: [['Nom', 'Type', 'Niveau de sécurité', 'Vulnérabilités']],
          body: assetData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [40, 167, 69] }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }
      
      // Atelier 3 - Scénarios stratégiques
      if (strategicScenarios.length > 0) {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.text('Atelier 3 - Scénarios Stratégiques', 20, yPosition);
        yPosition += 10;
        
        const scenarioData = strategicScenarios.map(scenario => [
          scenario.name,
          scenario.gravity?.toString() || 'N/A',
          scenario.likelihood?.toString() || 'N/A',
          scenario.riskLevel?.toString() || 'N/A'
        ]);
        
        (doc as any).autoTable({
          head: [['Nom', 'Gravité', 'Vraisemblance', 'Niveau de risque']],
          body: scenarioData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 53, 69] }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }
      
      // Atelier 5 - Mesures de sécurité
      if (securityMeasures.length > 0) {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.text('Atelier 5 - Mesures de Sécurité', 20, yPosition);
        yPosition += 10;
        
        const measureData = securityMeasures.map(measure => [
          measure.name,
          measure.type,
          measure.priority,
          measure.cost?.toString() || 'N/A'
        ]);
        
        (doc as any).autoTable({
          head: [['Nom', 'Type', 'Priorité', 'Coût']],
          body: measureData,
          startY: yPosition,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [111, 66, 193] }
        });
        
        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }
      
      // Plan de traitement
      if (treatmentPlan) {
        if (yPosition > 200) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.text('Plan de Traitement', 20, yPosition);
        yPosition += 10;
        
        doc.setFont('helvetica', 'normal');
        const splitText = doc.splitTextToSize(treatmentPlan, 170);
        doc.text(splitText, 20, yPosition);
      }
    }
    
    // Pied de page
    const pageCount = (doc as any).getNumberOfPages(); // 🔧 CORRECTION: Type assertion pour jsPDF
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} sur ${pageCount}`, 20, 285);
      doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 120, 285);
    }
    
    // Télécharger le PDF
    const fileName = `EBIOS_RM_${mission.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }
  
  /**
   * Exporter une mission au format JSON
   */
  static async exportToJSON(data: ExportData): Promise<void> {
    const exportData = {
      mission: data.mission,
      workshops: {
        atelier1: {
          businessValues: data.businessValues || [],
          supportingAssets: data.supportingAssets || []
        },
        atelier3: {
          strategicScenarios: data.strategicScenarios || []
        },
        atelier5: {
          securityMeasures: data.securityMeasures || [],
          treatmentPlan: data.treatmentPlan || ''
        }
      },
      exportMetadata: {
        exportDate: new Date().toISOString(),
        version: '1.0',
        format: 'EBIOS_RM_JSON'
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `EBIOS_RM_${data.mission.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
  }
  
  /**
   * Exporter une mission au format Excel (CSV)
   */
  static async exportToExcel(data: ExportData): Promise<void> {
    const { mission, businessValues = [], supportingAssets = [], strategicScenarios = [], securityMeasures = [] } = data;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // En-tête du rapport
    csvContent += `Rapport EBIOS RM - ${mission.name}\n`;
    csvContent += `Date d'export,${new Date().toLocaleDateString('fr-FR')}\n`;
    csvContent += `Statut,${mission.status}\n\n`;
    
    // Valeurs métier
    if (businessValues.length > 0) {
      csvContent += "Atelier 1 - Valeurs Métier\n";
      csvContent += "Nom,Catégorie,Priorité,Criticité\n";
      businessValues.forEach(value => {
        csvContent += `"${value.name}","${value.category}","${value.priority || 'N/A'}","${value.criticalityLevel || 'N/A'}"\n`;
      });
      csvContent += "\n";
    }
    
    // Actifs supports
    if (supportingAssets.length > 0) {
      csvContent += "Atelier 1 - Actifs Supports\n";
      csvContent += "Nom,Type,Niveau de sécurité,Vulnérabilités\n";
      supportingAssets.forEach(asset => {
        csvContent += `"${asset.name}","${asset.type}","${asset.securityLevel}","${asset.vulnerabilities?.length || 0}"\n`;
      });
      csvContent += "\n";
    }
    
    // Scénarios stratégiques
    if (strategicScenarios.length > 0) {
      csvContent += "Atelier 3 - Scénarios Stratégiques\n";
      csvContent += "Nom,Gravité,Vraisemblance,Niveau de risque\n";
      strategicScenarios.forEach(scenario => {
        csvContent += `"${scenario.name}","${scenario.gravity || 'N/A'}","${scenario.likelihood || 'N/A'}","${scenario.riskLevel || 'N/A'}"\n`;
      });
      csvContent += "\n";
    }
    
    // Mesures de sécurité
    if (securityMeasures.length > 0) {
      csvContent += "Atelier 5 - Mesures de Sécurité\n";
      csvContent += "Nom,Type,Priorité,Coût\n";
      securityMeasures.forEach(measure => {
        csvContent += `"${measure.name}","${measure.type}","${measure.priority}","${measure.cost || 'N/A'}"\n`;
      });
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EBIOS_RM_${mission.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  }
}
