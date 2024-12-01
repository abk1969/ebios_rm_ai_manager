import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

const LegalStatus = () => {
  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-sm">
          <Shield className="h-4 w-4 text-green-500" />
          <span>RGPD Compliant</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <span>Version Community</span>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Powered by GLOBACOM3000 / Abbas BENTERKI
        </div>
      </div>
    </div>
  );
};

export default LegalStatus;