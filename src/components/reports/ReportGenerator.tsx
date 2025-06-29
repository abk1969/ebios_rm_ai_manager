import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Settings, 
  Check, 
  X, 
  Loader, 
  Crown, 
  Shield, 
  BarChart3, 
  Clipboard,
  Calendar,
  User
} from 'lucide-react';
import Button from '@/components/ui/button';
import { Mission, BusinessValue, SupportingAsset, RiskSource, DreadedEvent, StrategicScenario, SecurityMeasure } from '@/types/ebios';
import { aiAssistant } from '@/services/aiAssistant';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'technical' | 'operational' | 'compliance';
  icon: React.ComponentType<any>;
  sections: string[];
  estimatedPages: number;
  anssiCompliant: boolean;
  audience: string;
}

interface ReportGeneratorProps {
  mission: Mission;
  businessValues: BusinessValue[];
  supportingAssets: SupportingAsset[];
  riskSources: RiskSource[];
  dreadedEvents: DreadedEvent[];
  strategicScenarios: StrategicScenario[];
  securityMeasures: SecurityMeasure[];
  onClose?: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  mission,
  businessValues,
  supportingAssets,
  riskSources,
  dreadedEvents,
  strategicScenarios,
  securityMeasures,
  onClose
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [reportOptions, setReportOptions] = useState({
    author: '',
    organization: mission.organization || '',
    classification: 'internal' as 'public' | 'internal' | 'confidential' | 'secret',
    includeCharts: true,
    includeTables: true,
    includeAIRecommendations: true
  });

  const templates: ReportTemplate[] = [
    {
      id: 'executive-summary',
      name: 'Rapport Exécutif',
      description: 'Synthèse stratégique pour la direction avec recommandations prioritaires',
      type: 'executive',
      icon: Crown,
      sections: ['Synthèse exécutive', 'Vue d\'ensemble des risques', 'Recommandations stratégiques', 'Plan d\'investissement'],
      estimatedPages: 8,
      anssiCompliant: true,
      audience: 'Direction, COMEX'
    },
    {
      id: 'technical-detailed',
      name: 'Rapport Technique Détaillé',
      description: 'Analyse technique complète pour les équipes sécurité',
      type: 'technical',
      icon: Settings,
      sections: ['Méthodologie', 'Détail des 5 ateliers', 'Analyse technique', 'Mesures recommandées'],
      estimatedPages: 25,
      anssiCompliant: true,
      audience: 'Équipes techniques, RSSI'
    },
    {
      id: 'compliance-anssi',
      name: 'Rapport de Conformité ANSSI',
      description: 'Documentation complète conforme aux exigences ANSSI EBIOS RM',
      type: 'compliance',
      icon: Shield,
      sections: ['Conformité ANSSI', 'Traçabilité méthodologique', 'Tous les ateliers', 'Évaluation maturité'],
      estimatedPages: 35,
      anssiCompliant: true,
      audience: 'Auditeurs, autorités'
    },
    {
      id: 'operational-action-plan',
      name: 'Plan d\'Action Opérationnel',
      description: 'Guide pratique de mise en œuvre des mesures de sécurité',
      type: 'operational',
      icon: Clipboard,
      sections: ['Feuille de route', 'Mesures de sécurité', 'Planification ressources', 'KPI de suivi'],
      estimatedPages: 15,
      anssiCompliant: true,
      audience: 'Équipes opérationnelles'
    }
  ];

  // Calculer le score de maturité
  const maturityData = aiAssistant.calculateMaturityScore({
    businessValues,
    supportingAssets,
    riskSources,
    dreadedEvents,
    strategicScenarios,
    securityMeasures
  });

  const handleGenerateReport = async () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    
    try {
      // Données réelles
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const template = templates.find(t => t.id === selectedTemplate);
      const generatedAt = new Date();
      
      const report = {
        id: `report-${Date.now()}`,
        title: `${template?.name} - ${mission.name}`,
        subtitle: `Analyse EBIOS Risk Manager - ${reportOptions.organization}`,
        mission,
        template,
        generatedAt,
        metadata: {
          version: '1.0',
          author: reportOptions.author || 'Système EBIOS RM',
          organization: reportOptions.organization,
          classification: reportOptions.classification,
          anssiCompliance: template?.anssiCompliant || false
        },
        statistics: {
          totalBusinessValues: businessValues.length,
          totalSupportingAssets: supportingAssets.length,
          totalRiskSources: riskSources.length,
          totalDreadedEvents: dreadedEvents.length,
          totalStrategicScenarios: strategicScenarios.length,
          totalSecurityMeasures: securityMeasures.length,
          maturityScore: maturityData.overallScore,
          criticalScenarios: strategicScenarios.filter(s => s.riskLevel === 'critical').length,
          highRiskScenarios: strategicScenarios.filter(s => s.riskLevel === 'high').length
        },
        content: generateReportContent(selectedTemplate)
      };

      setGeneratedReport(report);
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateReportContent = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    
    const criticalScenarios = strategicScenarios.filter(s => s.riskLevel === 'critical');
    const highRiskScenarios = strategicScenarios.filter(s => s.riskLevel === 'high');
    
    const baseContent = {
      executiveSummary: `
Cette analyse de risque cyber selon la méthode EBIOS Risk Manager de l'ANSSI révèle un niveau de maturité de ${maturityData.overallScore}/100.

### Enjeux Critiques Identifiés
${businessValues.slice(0, 5).map(bv => `• ${bv.name} : ${bv.description}`).join('\n')}

### Risques Prioritaires
${criticalScenarios.length + highRiskScenarios.length} scénarios de risque élevé ou critique identifiés :
${[...criticalScenarios, ...highRiskScenarios].slice(0, 5).map((scenario, index) => 
  `${index + 1}. ${scenario.name} (Niveau : ${scenario.riskLevel})`
).join('\n')}

### Recommandations Stratégiques
1. Renforcement immédiat des mesures de sécurité pour les scénarios critiques
2. Investment prioritaire dans ${securityMeasures.slice(0, 3).map(m => m.name).join(', ')}
3. Mise en place d'un programme de gouvernance du risque cyber
4. Formation et sensibilisation des équipes aux enjeux cybersécurité
      `,
      riskOverview: `
### Distribution des Niveaux de Risque
• Critique : ${strategicScenarios.filter(s => s.riskLevel === 'critical').length} scénario(s)
• Élevé : ${strategicScenarios.filter(s => s.riskLevel === 'high').length} scénario(s)
• Moyen : ${strategicScenarios.filter(s => s.riskLevel === 'medium').length} scénario(s)
• Faible : ${strategicScenarios.filter(s => s.riskLevel === 'low').length} scénario(s)

### Sources de Risque Principales
${riskSources.slice(0, 5).map((rs, index) => 
  `${index + 1}. ${rs.name} (${rs.category}) - Pertinence : ${rs.pertinence}/4`
).join('\n')}
      `,
      technicalDetails: `
### Atelier 1 : Cadrage et Événements Redoutés
- ${businessValues.length} valeurs métier identifiées
- ${supportingAssets.length} actifs de soutien cartographiés
- ${dreadedEvents.length} événements redoutés formulés

### Atelier 2 : Sources de Risque
- ${riskSources.length} sources de risque analysées
- Répartition par catégorie selon taxonomie EBIOS RM

### Atelier 3 : Scénarios Stratégiques
- ${strategicScenarios.length} scénarios construits
- Matrice de risque ANSSI appliquée
      `
    };

    switch (templateId) {
      case 'executive-summary':
        return `${baseContent.executiveSummary}\n\n${baseContent.riskOverview}`;
      case 'technical-detailed':
        return `${baseContent.technicalDetails}\n\n${baseContent.riskOverview}`;
      case 'compliance-anssi':
        return `${baseContent.executiveSummary}\n\n${baseContent.technicalDetails}\n\n${baseContent.riskOverview}`;
      case 'operational-action-plan':
        return `${baseContent.riskOverview}\n\nPlan d'action détaillé avec mesures prioritaires.`;
      default:
        return baseContent.executiveSummary;
    }
  };

  const handleDownloadPDF = () => {
    // Données réelles
    const blob = new Blob([generateReportContent(selectedTemplate)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedReport?.title || 'rapport-ebios'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getClassificationColor = (classification: string) => {
    const colors = {
      public: 'bg-green-100 text-green-800',
      internal: 'bg-blue-100 text-blue-800',
      confidential: 'bg-yellow-100 text-yellow-800',
      secret: 'bg-red-100 text-red-800'
    };
    return colors[classification as keyof typeof colors] || colors.internal;
  };

  if (generatedReport) {
    return (
      <div className="bg-white rounded-lg shadow-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header du rapport généré */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{generatedReport.title}</h2>
              <p className="text-sm text-gray-600">{generatedReport.subtitle}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getClassificationColor(generatedReport.metadata.classification)}`}>
                  {generatedReport.metadata.classification.toUpperCase()}
                </span>
                {generatedReport.metadata.anssiCompliance && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span>ANSSI Conforme</span>
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  Score maturité : {generatedReport.statistics.maturityScore}/100
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handleDownloadPDF}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Télécharger PDF</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setGeneratedReport(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques du rapport */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{generatedReport.statistics.totalStrategicScenarios}</div>
              <div className="text-xs text-gray-600">Scénarios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{generatedReport.statistics.criticalScenarios}</div>
              <div className="text-xs text-gray-600">Critiques</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{generatedReport.statistics.highRiskScenarios}</div>
              <div className="text-xs text-gray-600">Risque Élevé</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{generatedReport.statistics.totalSecurityMeasures}</div>
              <div className="text-xs text-gray-600">Mesures</div>
            </div>
          </div>
        </div>

        {/* Contenu du rapport */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {generatedReport.content}
            </div>
          </div>
        </div>

        {/* Métadonnées */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{generatedReport.metadata.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{generatedReport.generatedAt.toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>Version {generatedReport.metadata.version}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BarChart3 className="h-3 w-3" />
              <span>{generatedReport.template.estimatedPages} pages estimées</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Générateur de Rapports EBIOS RM</h2>
            <p className="text-sm text-gray-600">Mission : {mission.name}</p>
          </div>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
        {/* Sélection du template */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Choisir un Template de Rapport</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    selectedTemplate === template.id ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <template.icon className={`h-5 w-5 ${
                      selectedTemplate === template.id ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      {template.anssiCompliant && (
                        <Shield className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">{template.audience}</span>
                      <span className="text-xs text-gray-500">{template.estimatedPages} pages</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-xs text-gray-500">Sections incluses :</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {template.sections.slice(0, 3).join(', ')}
                        {template.sections.length > 3 && '...'}
                      </div>
                    </div>
                  </div>
                </div>
                {selectedTemplate === template.id && (
                  <div className="mt-3 flex items-center space-x-1 text-blue-600">
                    <Check className="h-4 w-4" />
                    <span className="text-sm">Sélectionné</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Options de rapport */}
        {selectedTemplate && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Options du Rapport</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auteur
                </label>
                <input
                  type="text"
                  value={reportOptions.author}
                  onChange={(e) => setReportOptions(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Nom de l'auteur"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organisation
                </label>
                <input
                  type="text"
                  value={reportOptions.organization}
                  onChange={(e) => setReportOptions(prev => ({ ...prev, organization: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Nom de l'organisation"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classification
                </label>
                <select
                  value={reportOptions.classification}
                  onChange={(e) => setReportOptions(prev => ({ ...prev, classification: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="public">Public</option>
                  <option value="internal">Interne</option>
                  <option value="confidential">Confidentiel</option>
                  <option value="secret">Secret</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={reportOptions.includeCharts}
                  onChange={(e) => setReportOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Inclure les graphiques</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={reportOptions.includeTables}
                  onChange={(e) => setReportOptions(prev => ({ ...prev, includeTables: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Inclure les tableaux</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={reportOptions.includeAIRecommendations}
                  onChange={(e) => setReportOptions(prev => ({ ...prev, includeAIRecommendations: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Recommandations IA</span>
              </label>
            </div>
          </div>
        )}

        {/* Aperçu des données */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Données de la Mission</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-700">Valeurs Métier</div>
              <div className="text-gray-600">{businessValues.length}</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Sources de Risque</div>
              <div className="text-gray-600">{riskSources.length}</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Scénarios</div>
              <div className="text-gray-600">{strategicScenarios.length}</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Score Maturité</div>
              <div className="text-gray-600">{maturityData.overallScore}/100</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            onClick={handleGenerateReport}
            disabled={!selectedTemplate || isGenerating}
            className="flex items-center space-x-2"
          >
            {isGenerating ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            <span>{isGenerating ? 'Génération...' : 'Générer le Rapport'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;