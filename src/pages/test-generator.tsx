import React from 'react';
import ModernAutoMissionGenerator from '@/components/mission-generator/ModernAutoMissionGenerator';

const TestGeneratorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Test du Générateur de Mission EBIOS RM
          </h1>
          <p className="text-gray-600 mt-2">
            Page de test pour vérifier le fonctionnement du générateur automatique de missions
          </p>
        </div>
        
        <ModernAutoMissionGenerator />
      </div>
    </div>
  );
};

export default TestGeneratorPage;
