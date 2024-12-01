import React from 'react';
import { Card } from "@/components/ui/card";
import { Check, X } from 'lucide-react';

const MethodComparison = () => {
  return (
    <Card className="overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Comparaison des méthodes
        </h3>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">EBIOS Cloud Pro</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Interface utilisateur intuitive
              </li>
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Collaboration en temps réel
              </li>
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Sauvegarde automatique
              </li>
              <li className="flex items-center text-sm">
                <X className="h-4 w-4 text-red-500 mr-2" />
                Non certifié ANSSI
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">EBIOS RM Officiel</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Méthode officielle ANSSI
              </li>
              <li className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Documentation complète
              </li>
              <li className="flex items-center text-sm">
                <X className="h-4 w-4 text-red-500 mr-2" />
                Interface moins moderne
              </li>
              <li className="flex items-center text-sm">
                <X className="h-4 w-4 text-red-500 mr-2" />
                Pas de collaboration en temps réel
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MethodComparison;