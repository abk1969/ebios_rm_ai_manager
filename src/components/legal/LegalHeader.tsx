import React from 'react';
import { AlertTriangle } from 'lucide-react';

const LegalHeader = () => {
  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              EBIOS® et EBIOS Risk Manager® sont des marques déposées de l'ANSSI. 
              Cette application est un outil d'aide indépendant.
            </span>
          </div>
          <a
            href="https://cyber.gouv.fr/la-methode-ebios-risk-manager"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-yellow-600 hover:text-yellow-800 hidden sm:block"
          >
            Voir la méthode officielle
          </a>
        </div>
      </div>
    </div>
  );
};

export default LegalHeader;