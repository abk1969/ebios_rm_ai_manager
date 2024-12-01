import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle } from 'lucide-react';
import ValidationModal from './ValidationModal';
import DocumentationBanner from './DocumentationBanner';
import MethodComparison from './MethodComparison';

const EbiosWorkflow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showValidation, setShowValidation] = useState(false);

  const handleNextStep = () => {
    setShowValidation(true);
  };

  const handleValidationConfirm = () => {
    setShowValidation(false);
    setCurrentStep(prev => prev + 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 1:
        return (
          <>
            <DocumentationBanner
              title="EBIOS Risk Manager Methodology"
              description="Learn more about the EBIOS Risk Manager methodology and how to use this tool effectively."
              linkText="View Documentation"
              linkUrl="https://www.ssi.gouv.fr/guide/ebios-risk-manager-the-method/"
            />
            <Card className="mb-4">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Atelier 1 : Socle de sécurité</h2>
                <div className="mb-4">
                  <MethodComparison />
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      Assurez-vous de bien comprendre la méthode EBIOS RM avant de commencer.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </>
        );
      // Autres étapes à implémenter
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">EBIOS Risk Manager</h1>
          </div>
          <div className="text-sm text-gray-500">
            Étape {currentStep}/5
          </div>
        </div>
      </div>

      {getStepContent(currentStep)}

      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep(prev => prev - 1)}
        >
          Étape précédente
        </Button>
        <Button
          onClick={handleNextStep}
          disabled={currentStep === 5}
        >
          {currentStep === 5 ? 'Terminer' : 'Étape suivante'}
        </Button>
      </div>

      <ValidationModal
        isOpen={showValidation}
        onClose={() => setShowValidation(false)}
        stepName={`Atelier ${currentStep}`}
        onConfirm={handleValidationConfirm}
      />
    </div>
  );
};

export default EbiosWorkflow;