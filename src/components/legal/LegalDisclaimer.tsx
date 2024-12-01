import React, { useState } from 'react';
import { AlertTriangle, Shield, Book } from 'lucide-react';
import { Button } from '../ui/button';

interface LegalDisclaimerProps {
  onAccept: () => void;
}

const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ onAccept }) => {
  const [accepted, setAccepted] = useState({
    terms: false,
    risks: false,
    documentation: false
  });

  const allAccepted = Object.values(accepted).every(Boolean);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="h-8 w-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Avertissement Important</h2>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />
              <div>
                <h3 className="font-bold text-yellow-800">Notice ANSSI</h3>
                <p className="text-yellow-700">
                  EBIOS® et EBIOS Risk Manager® sont des marques déposées de l'ANSSI. 
                  Cette application est un outil indépendant d'aide à l'analyse des risques.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <div className="flex items-start space-x-3">
              <Book className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-bold text-blue-800">Documentation Officielle</h3>
                <p className="text-blue-700">
                  Cette application ne remplace pas la documentation officielle EBIOS Risk Manager.
                </p>
                <a 
                  href="https://cyber.gouv.fr/la-methode-ebios-risk-manager"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-2 block"
                >
                  Consulter la méthode officielle →
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={accepted.terms}
                onChange={() => setAccepted(prev => ({...prev, terms: !prev.terms}))}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Je comprends que cet outil est indépendant de l'ANSSI et ne constitue pas une certification officielle.
              </span>
            </label>

            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={accepted.risks}
                onChange={() => setAccepted(prev => ({...prev, risks: !prev.risks}))}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Je comprends que je suis responsable de la validation des résultats de l'analyse des risques.
              </span>
            </label>

            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={accepted.documentation}
                onChange={() => setAccepted(prev => ({...prev, documentation: !prev.documentation}))}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Je m'engage à me référer à la documentation officielle EBIOS Risk Manager.
              </span>
            </label>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => window.location.href = 'https://cyber.gouv.fr/la-methode-ebios-risk-manager'}
            >
              Documentation ANSSI
            </Button>
            <Button
              disabled={!allAccepted}
              onClick={onAccept}
            >
              Accéder à l'application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalDisclaimer;