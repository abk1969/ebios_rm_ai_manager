import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nouveau
        <ChevronDown className="h-4 w-4 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <Link
              to="/missions/new"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Nouvelle mission
            </Link>
            <Link
              to="/workshop-1/new"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Nouveau workshop
            </Link>
            <Link
              to="/reports/new"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Nouveau rapport
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;