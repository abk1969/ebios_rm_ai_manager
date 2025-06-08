/**
 * Service d'export PDF utilisant les APIs natives du navigateur
 * Évite les dépendances externes lourdes
 */

import { logger } from '../logging/SecureLogger';
import type { ValidationResult } from '../validation/ANSSIValidationService';
import type { Mission, BusinessValue, DreadedEvent, SupportingAsset, RiskSource, StrategicScenario } from '@/types/ebios';

export interface ExportOptions {
  includeCharts: boolean;
  includeDetails: boolean;
  format: 'A4' | 'A3' | 'Letter';
  orientation: 'portrait' | 'landscape';
  includeMetadata: boolean;
}

export interface ExportData {
  mission: Mission;
  workshop: number;
  validationResult?: ValidationResult;
  businessValues?: BusinessValue[];
  dreadedEvents?: DreadedEvent[];
  supportingAssets?: SupportingAsset[];
  riskSources?: RiskSource[];
  scenarios?: StrategicScenario[];
}

/**
 * Service d'export PDF natif
 */
export class PDFExportService {
  private static instance: PDFExportService;

  private constructor() {}

  public static getInstance(): PDFExportService {
    if (!PDFExportService.instance) {
      PDFExportService.instance = new PDFExportService();
    }
    return PDFExportService.instance;
  }

  /**
   * Exporte un rapport ANSSI en PDF
   */
  public async exportANSSIReport(
    data: ExportData,
    options: Partial<ExportOptions> = {}
  ): Promise<void> {
    const defaultOptions: ExportOptions = {
      includeCharts: true,
      includeDetails: true,
      format: 'A4',
      orientation: 'portrait',
      includeMetadata: true
    };

    const exportOptions = { ...defaultOptions, ...options };

    try {
      logger.info('Starting ANSSI report PDF export', { workshop: data.workshop }, 'PDFExportService');

      // Créer le contenu HTML pour l'export
      const htmlContent = this.generateReportHTML(data, exportOptions);

      // Utiliser l'API Print native du navigateur
      await this.printToPDF(htmlContent, exportOptions);

      logger.info('ANSSI report PDF export completed successfully', { workshop: data.workshop }, 'PDFExportService');

    } catch (error) {
      logger.error('Failed to export ANSSI report to PDF', error, 'PDFExportService');
      throw new Error('Échec de l\'export PDF du rapport ANSSI');
    }
  }

  /**
   * Génère le contenu HTML du rapport
   */
  private generateReportHTML(data: ExportData, options: ExportOptions): string {
    const { mission, workshop, validationResult } = data;
    
    let html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rapport ANSSI EBIOS RM - Atelier ${workshop}</title>
        <style>
          ${this.getReportCSS(options)}
        </style>
      </head>
      <body>
        <div class="report-container">
          ${this.generateHeader(mission, workshop)}
          ${this.generateExecutiveSummary(validationResult)}
          ${validationResult ? this.generateValidationSection(validationResult) : ''}
          ${this.generateWorkshopDetails(data, options)}
          ${this.generateFooter()}
        </div>
      </body>
      </html>
    `;

    return html;
  }

  /**
   * CSS pour le rapport PDF
   */
  private getReportCSS(options: ExportOptions): string {
    return `
      @page {
        size: ${options.format} ${options.orientation};
        margin: 2cm;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
      }
      
      .report-container {
        max-width: 100%;
        margin: 0 auto;
      }
      
      .header {
        text-align: center;
        border-bottom: 3px solid #1e40af;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      
      .header h1 {
        color: #1e40af;
        font-size: 24px;
        margin: 0;
      }
      
      .header .subtitle {
        color: #6b7280;
        font-size: 14px;
        margin-top: 5px;
      }
      
      .section {
        margin-bottom: 30px;
        page-break-inside: avoid;
      }
      
      .section h2 {
        color: #1e40af;
        font-size: 18px;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 10px;
        margin-bottom: 15px;
      }
      
      .section h3 {
        color: #374151;
        font-size: 16px;
        margin-bottom: 10px;
      }
      
      .score-box {
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        margin: 20px 0;
      }
      
      .score-value {
        font-size: 36px;
        font-weight: bold;
        color: #1e40af;
      }
      
      .score-label {
        font-size: 14px;
        color: #6b7280;
        margin-top: 5px;
      }
      
      .issue-list {
        list-style: none;
        padding: 0;
      }
      
      .issue-item {
        background: #fef2f2;
        border-left: 4px solid #ef4444;
        padding: 10px 15px;
        margin-bottom: 10px;
        border-radius: 0 4px 4px 0;
      }
      
      .warning-item {
        background: #fffbeb;
        border-left-color: #f59e0b;
      }
      
      .recommendation-item {
        background: #eff6ff;
        border-left-color: #3b82f6;
      }
      
      .data-table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
      }
      
      .data-table th,
      .data-table td {
        border: 1px solid #d1d5db;
        padding: 8px 12px;
        text-align: left;
      }
      
      .data-table th {
        background: #f9fafb;
        font-weight: 600;
      }
      
      .footer {
        margin-top: 50px;
        padding-top: 20px;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        font-size: 12px;
        color: #6b7280;
      }
      
      .page-break {
        page-break-before: always;
      }
      
      @media print {
        .no-print {
          display: none;
        }
      }
    `;
  }

  /**
   * Génère l'en-tête du rapport
   */
  private generateHeader(mission: Mission, workshop: number): string {
    const currentDate = new Date().toLocaleDateString('fr-FR');
    
    return `
      <div class="header">
        <h1>Rapport de Conformité ANSSI</h1>
        <div class="subtitle">EBIOS RM v1.5 - Atelier ${workshop}</div>
        <div class="subtitle">Mission: ${mission.name}</div>
        <div class="subtitle">Généré le ${currentDate}</div>
      </div>
    `;
  }

  /**
   * Génère le résumé exécutif
   */
  private generateExecutiveSummary(validationResult?: ValidationResult): string {
    if (!validationResult) return '';

    const level = this.getComplianceLevel(validationResult.score);
    
    return `
      <div class="section">
        <h2>Résumé Exécutif</h2>
        <div class="score-box">
          <div class="score-value">${validationResult.score}%</div>
          <div class="score-label">Score de Conformité ANSSI</div>
          <div class="score-label">Niveau: ${level}</div>
        </div>
        <p>
          Cette analyse de conformité ANSSI EBIOS RM v1.5 révèle un score global de ${validationResult.score}% 
          avec ${validationResult.criticalIssues.length} problème(s) critique(s), 
          ${validationResult.warnings.length} avertissement(s) et 
          ${validationResult.recommendations.length} recommandation(s).
        </p>
      </div>
    `;
  }

  /**
   * Génère la section de validation
   */
  private generateValidationSection(validationResult: ValidationResult): string {
    let section = `<div class="section"><h2>Analyse de Conformité</h2>`;

    // Problèmes critiques
    if (validationResult.criticalIssues.length > 0) {
      section += `
        <h3>🚨 Problèmes Critiques (${validationResult.criticalIssues.length})</h3>
        <ul class="issue-list">
          ${validationResult.criticalIssues.map(issue => 
            `<li class="issue-item">${issue}</li>`
          ).join('')}
        </ul>
      `;
    }

    // Avertissements
    if (validationResult.warnings.length > 0) {
      section += `
        <h3>⚠️ Avertissements (${validationResult.warnings.length})</h3>
        <ul class="issue-list">
          ${validationResult.warnings.map(warning => 
            `<li class="issue-item warning-item">${warning}</li>`
          ).join('')}
        </ul>
      `;
    }

    // Recommandations
    if (validationResult.recommendations.length > 0) {
      section += `
        <h3>💡 Recommandations (${validationResult.recommendations.length})</h3>
        <ul class="issue-list">
          ${validationResult.recommendations.map(rec => 
            `<li class="issue-item recommendation-item">${rec}</li>`
          ).join('')}
        </ul>
      `;
    }

    section += '</div>';
    return section;
  }

  /**
   * Génère les détails de l'atelier
   */
  private generateWorkshopDetails(data: ExportData, options: ExportOptions): string {
    if (!options.includeDetails) return '';

    let section = `<div class="section page-break"><h2>Détails de l'Atelier ${data.workshop}</h2>`;

    // Valeurs métier
    if (data.businessValues && data.businessValues.length > 0) {
      section += `
        <h3>Valeurs Métier (${data.businessValues.length})</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Priorité</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${data.businessValues.map(bv => `
              <tr>
                <td>${bv.name}</td>
                <td>${bv.category}</td>
                <td>${bv.priority}/4</td>
                <td>${bv.description}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    // Événements redoutés
    if (data.dreadedEvents && data.dreadedEvents.length > 0) {
      section += `
        <h3>Événements Redoutés (${data.dreadedEvents.length})</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type d'Impact</th>
              <th>Gravité</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${data.dreadedEvents.map(de => `
              <tr>
                <td>${de.name}</td>
                <td>${de.impactType}</td>
                <td>${de.gravity}/4</td>
                <td>${de.description}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    section += '</div>';
    return section;
  }

  /**
   * Génère le pied de page
   */
  private generateFooter(): string {
    return `
      <div class="footer">
        <p>Rapport généré par EBIOS AI Manager - Conforme ANSSI EBIOS RM v1.5</p>
        <p>Ce document contient des informations sensibles - Diffusion restreinte</p>
      </div>
    `;
  }

  /**
   * Utilise l'API Print native pour générer le PDF
   */
  private async printToPDF(htmlContent: string, options: ExportOptions): Promise<void> {
    // Créer une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      throw new Error('Impossible d\'ouvrir la fenêtre d\'impression. Vérifiez que les popups sont autorisés.');
    }

    // Écrire le contenu HTML
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Attendre que le contenu soit chargé
    await new Promise<void>((resolve) => {
      printWindow.onload = () => {
        // Déclencher l'impression
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          resolve();
        }, 500);
      };
    });
  }

  /**
   * Détermine le niveau de conformité
   */
  private getComplianceLevel(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Bon';
    if (score >= 60) return 'Acceptable';
    if (score >= 40) return 'Insuffisant';
    return 'Critique';
  }
}

// Instance globale
export const pdfExportService = PDFExportService.getInstance();
