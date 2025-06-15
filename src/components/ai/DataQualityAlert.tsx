/**
 * 🚨 COMPOSANT D'ALERTE QUALITÉ DES DONNÉES
 * Affiche les problèmes de qualité détectés avec actions de correction
 */

import React from 'react';
import { AlertTriangle, Zap, RefreshCw, CheckCircle, X, RotateCcw } from 'lucide-react';
import Button from '../ui/button';
import { DataQualityIssue } from '../../services/ai/DataQualityDetector';

// Extension de l'interface pour les propriétés A2A
interface ExtendedDataQualityIssue extends DataQualityIssue {
  a2aSuggestions?: any[];
  agentsUsed?: string[];
  mcpToolsUsed?: string[];
  fallbackUsed?: boolean;
  entityType?: string;
  entityId?: string;
  entityName?: string;
}

interface DataQualityAlertProps {
  issues: ExtendedDataQualityIssue[];
  onAutoFix?: (issue: ExtendedDataQualityIssue) => void;
  onDismiss?: (issueId: string) => void;
  onManualFix?: (issue: ExtendedDataQualityIssue) => void;
  onRestoreOriginal?: (issue: ExtendedDataQualityIssue) => void; // 🔄 NOUVEAU
  className?: string;
}

const DataQualityAlert: React.FC<DataQualityAlertProps> = ({
  issues,
  onAutoFix,
  onDismiss,
  onManualFix,
  onRestoreOriginal, // 🔄 NOUVEAU
  className = ''
}) => {
  if (issues.length === 0) {
    return null;
  }

  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const highIssues = issues.filter(i => i.severity === 'high');
  const otherIssues = issues.filter(i => !['critical', 'high'].includes(i.severity));

  const getSeverityColor = (severity: DataQualityIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: DataQualityIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderIssue = (issue: ExtendedDataQualityIssue) => {
    console.log('🔍 Rendu issue:', {
      id: issue.id,
      autoFixAvailable: issue.autoFixAvailable,
      hasOnAutoFix: !!onAutoFix,
      suggestedValue: issue.suggestedValue
    });

    return (
    <div
      key={issue.id}
      className={`p-4 border rounded-lg ${getSeverityColor(issue.severity)} ${className}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getSeverityIcon(issue.severity)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-sm font-medium">
                🔍 Problème détecté : {issue.field}
              </h4>
              <p className="text-sm mt-1 opacity-90">
                <strong>Valeur actuelle :</strong> "{issue.value}"
              </p>
              <p className="text-sm mt-1">
                {issue.message}
              </p>
              <p className="text-xs mt-2 opacity-75">
                💡 {issue.suggestion}
              </p>
              
              {issue.suggestedValue && (
                <div className="mt-2 p-2 bg-white bg-opacity-50 rounded border border-current border-opacity-20">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium">
                      Suggestion IA {issue.a2aSuggestions && issue.a2aSuggestions.length > 0 ? '(A2A Enhanced)' : ''}:
                    </p>
                    {issue.agentsUsed && issue.agentsUsed.length > 0 && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-1 py-0.5 rounded">
                        🤖 {issue.agentsUsed.length}
                      </span>
                    )}
                  </div>
                  <p className="text-sm">"{issue.suggestedValue}"</p>
                  {issue.mcpToolsUsed && issue.mcpToolsUsed.length > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      🔌 MCP: {issue.mcpToolsUsed.join(', ')}
                    </p>
                  )}
                  {issue.fallbackUsed && (
                    <p className="text-xs text-orange-600 mt-1">
                      ⚠️ Mode dégradé
                    </p>
                  )}
                  {/* 🔒 NOUVEAU : Affichage valeur originale si différente */}
                  {issue.originalValue && issue.originalValue !== issue.value && (
                    <div className="mt-2 pt-2 border-t border-current border-opacity-20">
                      <p className="text-xs font-medium text-gray-600">
                        🔒 Valeur originale : "{issue.originalValue}"
                      </p>
                      {issue.correctionCount && issue.correctionCount > 0 && (
                        <p className="text-xs text-orange-600">
                          📊 Corrigé {issue.correctionCount} fois
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {onDismiss && (
              <button
                onClick={() => onDismiss(issue.id)}
                className="text-current opacity-50 hover:opacity-75 ml-2"
                title="Ignorer cette alerte"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Actions de correction */}
          <div className="mt-3 flex flex-wrap gap-2">
            {issue.autoFixAvailable && onAutoFix && (
              <Button
                size="sm"
                variant="success"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔧 Bouton cliqué dans DataQualityAlert:', issue);
                  try {
                    onAutoFix(issue);
                  } catch (error) {
                    console.error('❌ Erreur lors de l\'appel onAutoFix:', error);
                  }
                }}
                className="flex items-center gap-1 text-xs"
                type="button"
              >
                <Zap className="h-3 w-3" />
                Corriger automatiquement
              </Button>
            )}
            
            {onManualFix && (
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔧 Bouton manuel cliqué:', issue);
                  try {
                    onManualFix(issue);
                  } catch (error) {
                    console.error('❌ Erreur lors de l\'appel onManualFix:', error);
                  }
                }}
                className="flex items-center gap-1 text-xs"
                type="button"
              >
                <RefreshCw className="h-3 w-3" />
                Corriger manuellement
              </Button>
            )}

            {/* 🔄 NOUVEAU : Bouton de restauration */}
            {onRestoreOriginal && issue.originalValue && issue.originalValue !== issue.value && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🔄 Bouton restauration cliqué:', issue);
                  try {
                    onRestoreOriginal(issue);
                  } catch (error) {
                    console.error('❌ Erreur lors de l\'appel onRestoreOriginal:', error);
                  }
                }}
                className="flex items-center gap-1 text-xs border-orange-300 text-orange-700 hover:bg-orange-50"
                type="button"
              >
                <RotateCcw className="h-3 w-3" />
                Restaurer original
              </Button>
            )}
            
            <div className="text-xs opacity-75 flex items-center gap-1 px-2 py-1 bg-white bg-opacity-30 rounded">
              <span>Confiance: {Math.round(issue.confidence * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  };

  return (
    <div className="space-y-4">
      {/* Alertes critiques */}
      {criticalIssues.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="text-sm font-semibold text-red-800">
              🚨 Problèmes critiques détectés ({criticalIssues.length})
            </h3>
          </div>
          <div className="space-y-3">
            {criticalIssues.map(renderIssue)}
          </div>
        </div>
      )}

      {/* Alertes importantes */}
      {highIssues.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <h3 className="text-sm font-semibold text-orange-800">
              ⚠️ Problèmes importants détectés ({highIssues.length})
            </h3>
          </div>
          <div className="space-y-3">
            {highIssues.map(renderIssue)}
          </div>
        </div>
      )}

      {/* Autres alertes */}
      {otherIssues.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <h3 className="text-sm font-semibold text-yellow-800">
              💡 Suggestions d'amélioration ({otherIssues.length})
            </h3>
          </div>
          <div className="space-y-3">
            {otherIssues.map(renderIssue)}
          </div>
        </div>
      )}

      {/* Résumé global */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-800">
            Analyse de qualité terminée
          </span>
        </div>
        <p className="text-xs text-blue-700 mt-1">
          {issues.length} problème{issues.length > 1 ? 's' : ''} détecté{issues.length > 1 ? 's' : ''}.
          Corrigez les problèmes critiques pour améliorer la qualité de votre analyse EBIOS RM.
        </p>
      </div>
    </div>
  );
};

export default DataQualityAlert;
