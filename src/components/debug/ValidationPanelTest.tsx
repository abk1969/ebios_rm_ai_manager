/**
 * 🧪 COMPOSANT DE TEST - PANNEAU DE VALIDATION
 * Pour vérifier que les boutons d'action s'affichent correctement
 */

import React from 'react';
import StandardValidationPanel from '../workshops/StandardValidationPanel';

const ValidationPanelTest: React.FC = () => {
  // Données de test simulant des alertes
  const testValidationResults = [
    {
      criterion: 'Valeurs métier identifiées',
      required: true,
      met: true,
      evidence: '3 valeur(s) métier identifiée(s)'
    },
    {
      criterion: 'Événements redoutés définis',
      required: true,
      met: false,
      evidence: '1 valeur(s) métier sans événement redouté : <SDFQSDF'
    },
    {
      criterion: 'Actifs supports cartographiés',
      required: true,
      met: false,
      evidence: '2 valeur(s) métier sans actif support : <SDFQSDF, valeurMetier3'
    }
  ];

  const testBusinessValues = [
    { id: 'bv1', name: 'SDFQSDF', businessValueId: 'bv1' },
    { id: 'bv2', name: 'valeurMetier3', businessValueId: 'bv2' }
  ];

  const testSupportingAssets = [
    { id: 'sa1', name: 'Asset 1', businessValueId: 'bv1' }
  ];

  const testDreadedEvents = [
    { id: 'de1', name: 'Event 1', businessValueId: 'bv1' }
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">🧪 Test du Panneau de Validation</h1>
        
        <StandardValidationPanel
          workshopNumber={1}
          validationResults={testValidationResults}
          businessValues={testBusinessValues}
          supportingAssets={testSupportingAssets}
          dreadedEvents={testDreadedEvents}
          onNavigateToSection={(section) => {
            alert(`Navigation vers: ${section}`);
          }}
          onAddBusinessValue={() => {
            alert('Ajouter valeur métier');
          }}
          onAddDreadedEvent={(businessValueId) => {
            alert(`Ajouter événement redouté pour: ${businessValueId}`);
          }}
          onAddSupportingAsset={(businessValueId) => {
            alert(`Ajouter actif support pour: ${businessValueId}`);
          }}
          onAutoFix={(criterion) => {
            alert(`Suggestions IA pour: ${criterion}`);
          }}
        />
      </div>
    </div>
  );
};

export default ValidationPanelTest;
