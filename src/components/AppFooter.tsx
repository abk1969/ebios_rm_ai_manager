import React from 'react';
import { Shield } from 'lucide-react';

const AppFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-500">
              EBIOS Cloud Pro &copy; {new Date().getFullYear()}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Powered by GLOBACOM3000 / Abbas BENTERKI
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;