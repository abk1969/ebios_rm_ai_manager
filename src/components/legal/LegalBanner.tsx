import React from 'react';
import { AlertTriangle } from 'lucide-react';

const LegalBanner = () => {
  return (
    <div className="bg-yellow-50 border-b border-yellow-100 p-2">
      <div className="flex items-center justify-center space-x-2">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <p className="text-sm text-yellow-800">
          Pour la méthode officielle EBIOS Risk Manager, consultez la 
          <a 
            href="https://cyber.gouv.fr/la-methode-ebios-risk-manager"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline mx-1"
          >
            documentation ANSSI
          </a>
        </p>
      </div>
    </div>
  );
};

export default LegalBanner;