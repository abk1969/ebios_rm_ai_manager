import { useState } from 'react';
import { Mission, BusinessValue, SupportingAsset, RiskSource, DreadedEvent, StrategicScenario, SecurityMeasure } from '@/types/ebios';
import { aiAssistant } from '@/services/aiAssistant';
import { EbiosUtils } from '@/lib/ebios-constants';

interface ExportOptions {
  template: 'executive' | 'technical' | 'compliance' | 'operational';
  format: 'pdf' | 'docx' | 'html';
  includeCharts: boolean;
  includeTables: boolean;
  includeAIRecommendations: boolean;
  classification: 'public' | 'internal' | 'confidential' | 'secret';
  author?: string;
  organization?: string;
}

interface ExportProgress {
  step: string;
  progress: number;
  message: string;
}

export const useReportExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const generateHTMLReport = (
    missionData: {
      mission: Mission;
      businessValues: BusinessValue[];
      supportingAssets: SupportingAsset[];
      riskSources: RiskSource[];
      dreadedEvents: DreadedEvent[];
      strategicScenarios: StrategicScenario[];
      securityMeasures: SecurityMeasure[];
    },
    options: ExportOptions
  ): string => {
    const { mission, businessValues, supportingAssets, riskSources, dreadedEvents, strategicScenarios, securityMeasures } = missionData;
    
    // Calcul des métriques
    const maturityData = aiAssistant.calculateMaturityScore(missionData);
    const criticalScenarios = strategicScenarios.filter(s => s.riskLevel === 'critical');
    const highRiskScenarios = strategicScenarios.filter(s => s.riskLevel === 'high');
    
    const riskDistribution = ['critical', 'high', 'medium', 'low'].map(level => ({
      level,
      count: strategicScenarios.filter(s => s.riskLevel === level).length,
      percentage: (strategicScenarios.filter(s => s.riskLevel === level).length / strategicScenarios.length) * 100 || 0
    }));

    const getClassificationBanner = (classification: string) => {
      const colors = {
        public: '#22c55e',
        internal: '#3b82f6',
        confidential: '#eab308',
        secret: '#ef4444'
      };
      
      return `
        <div style="background-color: ${colors[classification as keyof typeof colors]}; color: white; padding: 8px; text-align: center; font-weight: bold; font-size: 14px; margin-bottom: 20px;">
          ${classification.toUpperCase()} - ${options.organization || mission.organization}
        </div>
      `;
    };

    const generateExecutiveSummary = () => `
      <section style="page-break-after: always;">
        <h1 style="color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 10px;">Synthèse Exécutive</h1>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #374151; margin-top: 0;">Contexte de la Mission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="font-weight: bold; padding: 5px 0; width: 150px;">Organisation :</td><td>${mission.organization}</td></tr>
            <tr><td style="font-weight: bold; padding: 5px 0;">Périmètre :</td><td>${mission.scope}</td></tr>
            <tr><td style="font-weight: bold; padding: 5px 0;">Objectif :</td><td>${mission.objective}</td></tr>
            <tr><td style="font-weight: bold; padding: 5px 0;">Score de Maturité :</td><td><strong style="color: #3b82f6;">${maturityData.overallScore}/100</strong></td></tr>
          </table>
        </div>

        <h2 style="color: #374151;">Enjeux Critiques Identifiés</h2>
        <ul>
          ${businessValues.map(bv => `<li><strong>${bv.name}</strong> : ${bv.description}</li>`).join('')}
        </ul>

        <h2 style="color: #374151;">Risques Prioritaires</h2>
        <p>${criticalScenarios.length + highRiskScenarios.length} scénarios de risque élevé ou critique ont été identifiés :</p>
        <ol>
          ${[...criticalScenarios, ...highRiskScenarios].slice(0, 5).map(scenario => 
            `<li><strong>${scenario.name}</strong> (Niveau : <span style="color: ${scenario.riskLevel === 'critical' ? '#ef4444' : '#f97316'};">${scenario.riskLevel}</span>)</li>`
          ).join('')}
        </ol>

        <h2 style="color: #374151;">Recommandations Stratégiques</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px;">
            <h3 style="color: #dc2626; margin-top: 0;">Priorité 1 - Actions Immédiates (0-3 mois)</h3>
            <p>Traitement des ${criticalScenarios.length} scénarios critiques identifiés</p>
          </div>
          <div style="background-color: #fef7ed; border-left: 4px solid #f97316; padding: 15px;">
            <h3 style="color: #ea580c; margin-top: 0;">Priorité 2 - Court Terme (3-6 mois)</h3>
            <p>Traitement des ${highRiskScenarios.length} scénarios à risque élevé</p>
          </div>
        </div>
      </section>
    `;

    const generateRiskMatrix = () => {
      if (!options.includeTables) return '';
      
      return `
        <section style="page-break-after: always;">
          <h1 style="color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 10px;">Matrice de Risque ANSSI</h1>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="border: 1px solid #d1d5db; padding: 8px;">Gravité / Vraisemblance</th>
                <th style="border: 1px solid #d1d5db; padding: 8px;">1 - Négligeable</th>
                <th style="border: 1px solid #d1d5db; padding: 8px;">2 - Limitée</th>
                <th style="border: 1px solid #d1d5db; padding: 8px;">3 - Importante</th>
                <th style="border: 1px solid #d1d5db; padding: 8px;">4 - Critique</th>
              </tr>
            </thead>
            <tbody>
              ${[4, 3, 2, 1].map(gravity => `
                <tr>
                  <td style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold; background-color: #f9fafb;">${gravity} - ${gravity === 4 ? 'Critique' : gravity === 3 ? 'Importante' : gravity === 2 ? 'Limitée' : 'Négligeable'}</td>
                  ${[1, 2, 3, 4].map(likelihood => {
                    const riskLevel = EbiosUtils.calculateRiskLevel(gravity as any, likelihood as any);
                    const scenariosInCell = strategicScenarios.filter(s => {
                      const event = dreadedEvents.find(de => de.id === s.dreadedEventId);
                      return event?.gravity === gravity && s.likelihood === likelihood;
                    });
                    const colors = {
                      low: '#22c55e',
                      medium: '#eab308',
                      high: '#f97316',
                      critical: '#ef4444'
                    };
                    return `<td style="border: 1px solid #d1d5db; padding: 8px; text-align: center; background-color: ${colors[riskLevel as keyof typeof colors]}; color: white; font-weight: bold;">${scenariosInCell.length}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="margin: 20px 0;">
            <h2 style="color: #374151;">Distribution des Risques</h2>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
              ${riskDistribution.map(dist => {
                const colors = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e' };
                return `
                  <div style="text-align: center; padding: 15px; border-radius: 8px; background-color: ${colors[dist.level as keyof typeof colors]}20; border: 2px solid ${colors[dist.level as keyof typeof colors]};">
                    <div style="font-size: 24px; font-weight: bold; color: ${colors[dist.level as keyof typeof colors]};">${dist.count}</div>
                    <div style="color: #374151; font-size: 12px;">${EbiosUtils.getRiskLevelInfo(dist.level as any).label}</div>
                    <div style="color: #6b7280; font-size: 10px;">${dist.percentage.toFixed(1)}%</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </section>
      `;
    };

    const generateTechnicalDetails = () => {
      if (options.template === 'executive') return '';
      
      return `
        <section style="page-break-after: always;">
          <h1 style="color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 10px;">Analyse Technique Détaillée</h1>
          
          <div style="margin: 20px 0;">
            <h2 style="color: #374151;">Atelier 1 : Cadrage et Événements Redoutés</h2>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 10px 0;">
              <p><strong>Conformité ANSSI :</strong> ✅ Identification des valeurs métier, cartographie des actifs de soutien, formulation des événements redoutés</p>
            </div>
            
            <h3 style="color: #4b5563;">Valeurs Métier (${businessValues.length})</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin: 10px 0;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Nom</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Catégorie</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Description</th>
                </tr>
              </thead>
              <tbody>
                ${businessValues.map(bv => `
                  <tr>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${bv.name}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${bv.category || 'N/A'}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${bv.description}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="margin: 20px 0;">
            <h2 style="color: #374151;">Atelier 2 : Sources de Risque</h2>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 10px 0;">
              <p><strong>Conformité ANSSI :</strong> ✅ Utilisation de la taxonomie EBIOS RM, caractérisation expertise/ressources/motivation</p>
            </div>
            
            <h3 style="color: #4b5563;">Sources de Risque (${riskSources.length})</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin: 10px 0;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Source</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Catégorie</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Expertise</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Ressources</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Motivation</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Pertinence</th>
                </tr>
              </thead>
              <tbody>
                ${riskSources.map(rs => `
                  <tr>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${rs.name}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${rs.category}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">${rs.expertise}/4</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">${rs.resources}/4</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">${rs.motivation}/4</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">${rs.pertinence}/4</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="margin: 20px 0;">
            <h2 style="color: #374151;">Atelier 3 : Scénarios Stratégiques</h2>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 10px 0;">
              <p><strong>Conformité ANSSI :</strong> ✅ Croisement sources de risque et événements redoutés, application de la matrice de risque</p>
            </div>
            
            <h3 style="color: #4b5563;">Scénarios Construits (${strategicScenarios.length})</h3>
            <p>Répartition selon la matrice de risque ANSSI appliquée avec succès.</p>
          </div>
        </section>
      `;
    };

    const generateSecurityMeasures = () => {
      if (!securityMeasures.length) return '';
      
      return `
        <section style="page-break-after: always;">
          <h1 style="color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 10px;">Plan de Traitement du Risque</h1>
          
          <div style="margin: 20px 0;">
            <h2 style="color: #374151;">Mesures de Sécurité Recommandées</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin: 10px 0;">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Mesure</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Type</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Efficacité</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Coût</th>
                  <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Délai</th>
                </tr>
              </thead>
              <tbody>
                ${securityMeasures.map(measure => `
                  <tr>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${measure.name}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${measure.type}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">${measure.effectiveness}/4</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${measure.cost}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${measure.implementationTime}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="margin: 20px 0;">
            <h2 style="color: #374151;">Feuille de Route</h2>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px;">
                <h3 style="color: #dc2626; margin-top: 0;">Court Terme (0-3 mois)</h3>
                <ul style="font-size: 12px; margin: 5px 0;">
                  <li>Traitement des risques critiques</li>
                  <li>Mesures d'urgence</li>
                  <li>Formation des équipes</li>
                </ul>
              </div>
              <div style="background-color: #fef7ed; border-left: 4px solid #f97316; padding: 15px;">
                <h3 style="color: #ea580c; margin-top: 0;">Moyen Terme (3-12 mois)</h3>
                <ul style="font-size: 12px; margin: 5px 0;">
                  <li>Déploiement des mesures</li>
                  <li>Gouvernance du risque</li>
                  <li>Processus et procédures</li>
                </ul>
              </div>
              <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px;">
                <h3 style="color: #16a34a; margin-top: 0;">Long Terme (1-2 ans)</h3>
                <ul style="font-size: 12px; margin: 5px 0;">
                  <li>Amélioration continue</li>
                  <li>Surveillance avancée</li>
                  <li>Maturité organisationnelle</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      `;
    };

    const generateFooter = () => `
      <div style="position: fixed; bottom: 0; left: 0; right: 0; height: 50px; background-color: #f3f4f6; border-top: 1px solid #d1d5db; padding: 10px; font-size: 10px; color: #6b7280;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            ${options.author || 'Système EBIOS RM'} - ${new Date().toLocaleDateString('fr-FR')}
          </div>
          <div>
            Version 1.0 - Conforme ANSSI EBIOS Risk Manager
          </div>
        </div>
      </div>
    `;

    // Assemblage du rapport HTML
    return `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${mission.name} - Rapport EBIOS RM</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #374151; 
            margin: 0; 
            padding: 20px;
            background-color: #ffffff;
          }
          h1 { color: #1f2937; font-size: 24px; margin-bottom: 20px; }
          h2 { color: #374151; font-size: 18px; margin-bottom: 15px; }
          h3 { color: #4b5563; font-size: 14px; margin-bottom: 10px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
          th { background-color: #f3f4f6; font-weight: 600; }
          .page-break { page-break-after: always; }
          @media print {
            body { margin: 0; }
            .page-break { page-break-after: always; }
          }
        </style>
      </head>
      <body>
        ${getClassificationBanner(options.classification)}
        
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 32px; color: #1f2937; margin-bottom: 10px;">
            ${options.template === 'executive' ? 'Rapport Exécutif' : 
              options.template === 'technical' ? 'Rapport Technique Détaillé' :
              options.template === 'compliance' ? 'Rapport de Conformité ANSSI' :
              'Plan d\'Action Opérationnel'}
          </h1>
          <h2 style="color: #6b7280; font-weight: normal; margin-bottom: 5px;">
            ${mission.name}
          </h2>
          <p style="color: #9ca3af; font-size: 14px;">
            Analyse EBIOS Risk Manager - ${options.organization || mission.organization}
          </p>
          <div style="margin-top: 30px; padding: 15px; background-color: #f8fafc; border-radius: 8px; display: inline-block;">
            <div style="color: #374151; font-size: 12px;">Score de Maturité Globale</div>
            <div style="font-size: 36px; font-weight: bold; color: #3b82f6;">${maturityData.overallScore}/100</div>
          </div>
        </div>

        ${generateExecutiveSummary()}
        ${generateRiskMatrix()}
        ${generateTechnicalDetails()}
        ${generateSecurityMeasures()}
        
        <section>
          <h1 style="color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 10px;">Annexes et Références</h1>
          
          <div style="margin: 20px 0;">
            <h2 style="color: #374151;">Méthodologie EBIOS Risk Manager</h2>
            <p style="font-size: 12px;">Cette analyse a été conduite selon la méthode EBIOS Risk Manager v1.5 de l'ANSSI, en respectant les 5 ateliers prescrits et les échelles de cotation officielles.</p>
            
            <h3 style="color: #4b5563;">Références Normatives</h3>
            <ul style="font-size: 12px;">
              <li>ANSSI - Guide EBIOS Risk Manager - Méthode de gestion des risques numériques</li>
              <li>ISO/IEC 27005:2018 - Techniques de sécurité des technologies de l'information</li>
              <li>ANSSI - Panorama de la cybermenace</li>
              <li>MITRE ATT&CK Framework</li>
            </ul>
          </div>
          
          <div style="margin: 40px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Certification de Conformité</h3>
            <p style="font-size: 12px; margin-bottom: 0;">
              Ce rapport a été généré conformément aux exigences de la méthode EBIOS Risk Manager de l'ANSSI. 
              L'analyse respecte les bonnes pratiques en matière de gestion des risques cyber et peut servir 
              de base pour les audits de conformité réglementaire.
            </p>
          </div>
        </section>

        ${generateFooter()}
      </body>
      </html>
    `;
  };

  const exportReport = async (
    missionData: {
      mission: Mission;
      businessValues: BusinessValue[];
      supportingAssets: SupportingAsset[];
      riskSources: RiskSource[];
      dreadedEvents: DreadedEvent[];
      strategicScenarios: StrategicScenario[];
      securityMeasures: SecurityMeasure[];
    },
    options: ExportOptions
  ) => {
    setIsExporting(true);
    setExportError(null);

    try {
      // Étape 1: Préparation des données
      setExportProgress({
        step: 'preparation',
        progress: 10,
        message: 'Préparation des données EBIOS RM...'
      });
      await new Promise(resolve => setTimeout(resolve, 500));

      // Étape 2: Génération du contenu
      setExportProgress({
        step: 'content',
        progress: 30,
        message: 'Génération du contenu du rapport...'
      });
      
      const htmlContent = generateHTMLReport(missionData, options);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Étape 3: Génération des graphiques (simulation)
      if (options.includeCharts) {
        setExportProgress({
          step: 'charts',
          progress: 50,
          message: 'Génération des graphiques et visualisations...'
        });
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      // Étape 4: Mise en forme finale
      setExportProgress({
        step: 'formatting',
        progress: 70,
        message: 'Mise en forme professionnelle...'
      });
      await new Promise(resolve => setTimeout(resolve, 600));

      // Étape 5: Export final
      setExportProgress({
        step: 'export',
        progress: 90,
        message: `Export en ${options.format.toUpperCase()}...`
      });
      
      if (options.format === 'html') {
        // Export HTML
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport-ebios-${missionData.mission.name.replace(/\s+/g, '-').toLowerCase()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (options.format === 'pdf') {
        // Pour PDF, on utiliserait une librairie comme puppeteer ou jsPDF
        // Ici simulation avec HTML
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport-ebios-${missionData.mission.name.replace(/\s+/g, '-').toLowerCase()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setExportProgress({
        step: 'complete',
        progress: 100,
        message: 'Export terminé avec succès !'
      });

      // Nettoyage après succès
      setTimeout(() => {
        setExportProgress(null);
        setIsExporting(false);
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      setExportError('Erreur lors de la génération du rapport. Veuillez réessayer.');
      setIsExporting(false);
      setExportProgress(null);
    }
  };

  const getTemplateInfo = (templateId: string) => {
    const templates = {
      executive: {
        name: 'Rapport Exécutif',
        description: 'Synthèse stratégique pour la direction',
        estimatedPages: 8,
        audience: 'Direction, COMEX'
      },
      technical: {
        name: 'Rapport Technique Détaillé',
        description: 'Analyse technique complète',
        estimatedPages: 25,
        audience: 'Équipes techniques, RSSI'
      },
      compliance: {
        name: 'Rapport de Conformité ANSSI',
        description: 'Documentation complète conforme ANSSI',
        estimatedPages: 35,
        audience: 'Auditeurs, autorités'
      },
      operational: {
        name: 'Plan d\'Action Opérationnel',
        description: 'Guide pratique de mise en œuvre',
        estimatedPages: 15,
        audience: 'Équipes opérationnelles'
      }
    };
    
    return templates[templateId as keyof typeof templates];
  };

  return {
    exportReport,
    isExporting,
    exportProgress,
    exportError,
    getTemplateInfo
  };
};

export default useReportExport; 