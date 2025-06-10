import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, ArrowRight, Zap, Target, Plus, Settings, Eye, RefreshCw } from 'lucide-react';
import type { WorkshopValidation } from '@/types/ebios';
import Button from '@/components/ui/button';

interface ValidationAction {
  type: 'navigate' | 'auto-fix' | 'suggest';
  label: string;
  icon: React.ComponentType<any>;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'success';
}

interface StandardValidationPanelProps {
  workshopNumber: 1 | 2 | 3 | 4 | 5;
  validationResults: WorkshopValidation[];
  title?: string;
  // Callbacks pour les actions de correction
  onNavigateToSection?: (section: string) => void;
  onAutoFix?: (criterion: string) => void;
  onAddBusinessValue?: () => void;
  onAddDreadedEvent?: (businessValueId?: string) => void;
  onAddSupportingAsset?: (businessValueId?: string) => void;
  // Données pour les suggestions IA
  businessValues?: any[];
  supportingAssets?: any[];
  dreadedEvents?: any[];
}

const StandardValidationPanel: React.FC<StandardValidationPanelProps> = ({
  workshopNumber,
  validationResults,
  title = `État d'Avancement - Atelier ${workshopNumber}`,
  onNavigateToSection,
  onAutoFix,
  onAddBusinessValue,
  onAddDreadedEvent,
  onAddSupportingAsset,
  businessValues = [],
  supportingAssets = [],
  dreadedEvents = []
}) => {
  
  const getValidationIcon = (met: boolean, required: boolean) => {
    if (met) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (required) return <AlertCircle className="h-5 w-5 text-red-500" />;
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  };

  /**
   * Génère les actions de correction pour chaque critère
   */
  const getValidationActions = (criterion: string, met: boolean): ValidationAction[] => {
    if (met) return []; // Pas d'actions si le critère est déjà validé

    const actions: ValidationAction[] = [];

    switch (criterion) {
      case 'Valeurs métier identifiées':
        actions.push({
          type: 'navigate',
          label: '➕ Ajouter valeur métier',
          icon: Plus,
          action: () => onAddBusinessValue?.(),
          variant: 'primary'
        });
        actions.push({
          type: 'navigate',
          label: '👁️ Voir section',
          icon: Eye,
          action: () => onNavigateToSection?.('business-values'),
          variant: 'secondary'
        });
        break;

      case 'Actifs supports cartographiés':
        // Identifier les valeurs métier sans actifs supports
        const uncoveredValues = businessValues.filter(bv =>
          !supportingAssets.some(sa => sa.businessValueId === bv.id)
        );

        if (uncoveredValues.length > 0) {
          actions.push({
            type: 'auto-fix',
            label: `⚡ Corriger ${uncoveredValues.length} valeur(s)`,
            icon: Zap,
            action: () => {
              // Ajouter un actif support pour la première valeur non couverte
              onAddSupportingAsset?.(uncoveredValues[0].id);
            },
            variant: 'success'
          });

          actions.push({
            type: 'navigate',
            label: `🎯 Voir "${uncoveredValues[0].name}"`,
            icon: Target,
            action: () => onNavigateToSection?.(`business-value-${uncoveredValues[0].id}`),
            variant: 'secondary'
          });
        }

        actions.push({
          type: 'navigate',
          label: '📋 Voir section actifs',
          icon: ArrowRight,
          action: () => onNavigateToSection?.('supporting-assets'),
          variant: 'secondary'
        });
        break;

      case 'Événements redoutés définis':
        // Identifier les valeurs métier sans événements redoutés
        const uncoveredByEvents = businessValues.filter(bv =>
          !dreadedEvents.some(de => de.businessValueId === bv.id)
        );

        if (uncoveredByEvents.length > 0) {
          actions.push({
            type: 'auto-fix',
            label: `⚡ Corriger ${uncoveredByEvents.length} valeur(s)`,
            icon: Zap,
            action: () => {
              // Ajouter un événement redouté pour la première valeur non couverte
              onAddDreadedEvent?.(uncoveredByEvents[0].id);
            },
            variant: 'success'
          });

          actions.push({
            type: 'navigate',
            label: `🎯 Voir "${uncoveredByEvents[0].name}"`,
            icon: Target,
            action: () => onNavigateToSection?.(`business-value-${uncoveredByEvents[0].id}`),
            variant: 'secondary'
          });
        }

        actions.push({
          type: 'navigate',
          label: '🚨 Voir section événements',
          icon: ArrowRight,
          action: () => onNavigateToSection?.('dreaded-events'),
          variant: 'secondary'
        });
        break;

      case 'Socle de sécurité évalué':
        actions.push({
          type: 'navigate',
          label: '🔒 Évaluer sécurité',
          icon: Settings,
          action: () => onNavigateToSection?.('security-baseline'),
          variant: 'primary'
        });
        actions.push({
          type: 'suggest',
          label: '🤖 Suggestions IA',
          icon: Zap,
          action: () => onAutoFix?.(criterion),
          variant: 'secondary'
        });
        break;

      default:
        // Actions génériques améliorées
        actions.push({
          type: 'suggest',
          label: '🤖 Suggestions IA',
          icon: Zap,
          action: () => onAutoFix?.(criterion),
          variant: 'success'
        });
        actions.push({
          type: 'navigate',
          label: '🔄 Actualiser',
          icon: RefreshCw,
          action: () => window.location.reload(),
          variant: 'secondary'
        });
        break;
    }

    return actions;
  };

  const completionPercentage = Math.round(
    (validationResults.filter(r => r.met).length / validationResults.length) * 100
  );

  const requiredCriteria = validationResults.filter(r => r.required);
  const metRequiredCriteria = requiredCriteria.filter(r => r.met);
  const isWorkshopComplete = requiredCriteria.length === metRequiredCriteria.length;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">{title}</h2>
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isWorkshopComplete 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {isWorkshopComplete ? '✅ Complet' : '⏳ En cours'}
          </div>
          <div className="text-sm text-gray-600">
            {completionPercentage}% terminé
          </div>
        </div>
      </div>

      {/* 📊 GRILLE DE VALIDATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {validationResults.map((result, index) => (
          <div 
            key={index} 
            className={`flex items-start space-x-3 p-4 border rounded-lg ${
              result.met 
                ? 'border-green-200 bg-green-50' 
                : result.required 
                  ? 'border-red-200 bg-red-50' 
                  : 'border-yellow-200 bg-yellow-50'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {getValidationIcon(result.met, result.required)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">
                {result.criterion}
                {result.required && (
                  <span className="ml-1 text-red-500 text-xs">*</span>
                )}
              </div>
              {result.evidence && (
                <div className="text-xs text-gray-600 mt-1">
                  {result.evidence}
                </div>
              )}
              {result.comments && (
                <div className="text-xs text-gray-500 mt-1 italic">
                  {result.comments}
                </div>
              )}

              {/* 🔧 ACTIONS DE CORRECTION AMÉLIORÉES */}
              {!result.met && (
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-medium text-gray-700 mb-2">
                    🛠️ Actions disponibles :
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getValidationActions(result.criterion, result.met).map((action, actionIndex) => (
                      <Button
                        key={actionIndex}
                        variant={action.variant || 'secondary'}
                        size="sm"
                        onClick={action.action}
                        className={`flex items-center gap-1 text-xs font-medium transition-all duration-200 hover:scale-105 ${
                          action.variant === 'primary' ? 'shadow-md' : ''
                        } ${
                          action.variant === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' : ''
                        }`}
                      >
                        <action.icon className="h-3 w-3" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 🚨 SECTION CORRECTIONS REQUISES */}
      {validationResults.some(r => !r.met && r.required) && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                ⚠️ Corrections requises avant de continuer
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Des erreurs méthodologiques doivent être corrigées pour assurer la conformité EBIOS RM et la qualité de l'analyse de risque.
              </p>
              <div className="mt-3">
                <p className="text-xs text-red-600">
                  📋 Référence : EBIOS RM v1.5 - Bonnes pratiques
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📈 BARRE DE PROGRESSION */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progression globale</span>
          <span>{metRequiredCriteria.length}/{requiredCriteria.length} critères obligatoires</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isWorkshopComplete ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* 🎯 RÉSUMÉ CONFORMITÉ EBIOS RM */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600">
          <strong>Conformité EBIOS RM v1.5 :</strong> {' '}
          {isWorkshopComplete ? (
            <span className="text-green-600">✅ Atelier conforme aux exigences ANSSI</span>
          ) : (
            <span className="text-yellow-600">⚠️ Critères obligatoires manquants</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StandardValidationPanel;
