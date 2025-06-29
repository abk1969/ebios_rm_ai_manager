import React from 'react';
import { Info } from 'lucide-react';

const LegalBanner = () => {
  return (
    <div className="bg-blue-50 border-b border-blue-200 p-3 shadow-sm">
      <div className="flex items-center justify-center space-x-2">
        <Info className="h-4 w-4 text-blue-600" />
        <p className="text-sm text-blue-800">
          Pour la méthode officielle EBIOS Risk Manager, consultez la 
          <a 
            href="https://cyber.gouv.fr/la-methode-ebios-risk-manager"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 hover:underline mx-1 font-semibold"
          >
            documentation ANSSI
          </a>
        </p>
      </div>
    </div>
  );
};

export default LegalBanner;
