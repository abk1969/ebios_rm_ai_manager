import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const LegalNotice = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-yellow-800">Notice légale EBIOS RM</h3>
          <p className="mt-1 text-sm text-yellow-700">
            EBIOS® et EBIOS Risk Manager® sont des marques déposées de l'ANSSI. 
            Cette application est un outil indépendant d'aide à l'analyse des risques.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;