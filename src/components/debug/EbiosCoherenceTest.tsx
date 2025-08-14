/**
 * 🧪 COMPOSANT TEST COHÉRENCE EBIOS RM
 * Test des corrections apportées à la logique métier EBIOS RM
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import EbiosWorkflowValidator, { EbiosWorkflowData, WorkflowValidationResult } from '@/services/validation/EbiosWorkflowValidator';
import { EBIOS_SCALES } from '@/lib/ebios-constants';

const EbiosCoherenceTest: React.FC = () => {
  const [validationResult, setValidationResult] = useState<WorkflowValidationResult | null>(null);
  const [testData, setTestData] = useState<EbiosWorkflowData | null>(null);

  useEffect(() => {
    // Données de test représentatives d'un CHU
    const mockData: EbiosWorkflowData = {
      businessValues: [
        {
          id: 'bv1',
          name: 'Continuité des soins',
          description: 'Capacité à maintenir les soins aux patients',
          category: 'operational',
          priority: 4,
          supportingEssentialAssets: ['ea1', 'ea2'],
          stakeholderIds: ['stakeholder1'],
          missionId: 'mission1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'bv2', 
          name: 'Protection des données patients',
          description: 'Confidentialité des données médicales',
          category: 'regulatory',
          priority: 4,
          supportingEssentialAssets: ['ea2'],
          stakeholderIds: ['stakeholder2'],
          missionId: 'mission1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      essentialAssets: [
        {
          id: 'ea1',
          name: 'Système d\'Information Hospitalier',
          description: 'SIH principal du CHU',
          type: 'information',
          category: 'mission_critical',
          criticalityLevel: 'essential',
          supportedBusinessValues: ['bv1', 'bv2'],
          supportingAssets: [],
          dreadedEvents: [],
          stakeholders: [],
          missionId: 'mission1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          confidentialityRequirement: 4,
          integrityRequirement: 4,
          availabilityRequirement: 4,
          owner: 'DSI CHU'
        },
        {
          id: 'ea2',
          name: 'Base de données patients',
          description: 'Repository central des dossiers médicaux', 
          type: 'information',
          category: 'mission_critical',
          criticalityLevel: 'essential',
          supportedBusinessValues: ['bv1', 'bv2'],
          supportingAssets: [],
          dreadedEvents: [],
          stakeholders: [],
          missionId: 'mission1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          confidentialityRequirement: 4,
          integrityRequirement: 4,
          availabilityRequirement: 3,
          owner: 'DIM'
        }
      ],
      dreadedEvents: [
        {
          id: 'de1',
          name: 'Indisponibilité du SIH',
          description: 'Arrêt complet du système d\'information hospitalier',
          gravity: 4,
          essentialAssetId: 'ea1',
          impactedBusinessValues: ['bv1'],
          missionId: 'mission1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'de2', 
          name: 'Fuite de données patients',
          description: 'Divulgation non autorisée de données médicales',
          gravity: 4,
          essentialAssetId: 'ea2', 
          impactedBusinessValues: ['bv2'],
          missionId: 'mission1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      riskSources: [
        {
          id: 'rs1',
          name: 'Cybercriminels',
          description: 'Groupes organisés de cybercriminels',
          type: 'human',
          motivation: 'financial',
          capability: 4,
          resources: 4,
          missionId: 'mission1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'rs2',
          name: 'Malware avancé',
          description: 'Logiciels malveillants sophistiqués',
          type: 'technical', 
          motivation: 'disruption',
          capability: 3,
          resources: 3,
          missionId: 'mission1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      strategicScenarios: [
        {
          id: 'ss1',
          name: 'Ransomware sur SIH',
          description: 'Attaque ransomware ciblant le système hospitalier',
          riskSourceId: 'rs1',
          dreadedEventId: 'de1',
          likelihood: 3,
          gravity: 4,
          risk: 4,
          missionId: 'mission1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };

    setTestData(mockData);

    // Validation
    const result = EbiosWorkflowValidator.validateCompleteWorkflow(mockData);
    setValidationResult(result);
  }, []);

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <h2 className="text-xl font-bold text-gray-900">
          🧪 Test Cohérence EBIOS RM
        </h2>
      </div>

      {/* État des corrections */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">✅ Corrections Appliquées</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Relations Biens essentiels ↔ Valeurs métier corrigées</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Atelier 2 : "Sources de risque" (au lieu d'événements redoutés)</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Échelles ANSSI corrigées : {EBIOS_SCALES.likelihood[1]}, {EBIOS_SCALES.likelihood[2]}, {EBIOS_SCALES.likelihood[3]}, {EBIOS_SCALES.likelihood[4]}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Validations métier inter-ateliers implémentées</span>
          </div>
        </div>
      </div>

      {/* Résultats validation */}
      {validationResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(validationResult.isValid)}
              <h3 className="text-lg font-semibold">
                Validation Workflow EBIOS RM
              </h3>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(validationResult.score)}`}>
              {validationResult.score}/100
            </div>
          </div>

          {/* Erreurs */}
          {validationResult.errors.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <h4 className="font-semibold text-red-800">Erreurs Critiques</h4>
              </div>
              <ul className="space-y-1">
                {validationResult.errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-700">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Avertissements */}
          {validationResult.warnings.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <h4 className="font-semibold text-yellow-800">Avertissements</h4>
              </div>
              <ul className="space-y-1">
                {validationResult.warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-yellow-700">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommandations */}
          {validationResult.recommendations.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Info className="h-5 w-5 text-blue-500" />
                <h4 className="font-semibold text-blue-800">Recommandations ANSSI</h4>
              </div>
              <ul className="space-y-1">
                {validationResult.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-blue-700">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Données de test */}
      {testData && (
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-semibold text-gray-700 mb-2">📊 Données Test (CHU)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <div>
              <div className="font-semibold text-blue-600">Valeurs Métier</div>
              <div>{testData.businessValues.length} éléments</div>
            </div>
            <div>
              <div className="font-semibold text-green-600">Biens Essentiels</div>
              <div>{testData.essentialAssets.length} éléments</div>
            </div>
            <div>
              <div className="font-semibold text-red-600">Événements Redoutés</div>
              <div>{testData.dreadedEvents.length} éléments</div>
            </div>
            <div>
              <div className="font-semibold text-purple-600">Sources Risque</div>
              <div>{testData.riskSources.length} éléments</div>
            </div>
            <div>
              <div className="font-semibold text-orange-600">Scénarios Stratégiques</div>
              <div>{testData.strategicScenarios.length} éléments</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EbiosCoherenceTest;