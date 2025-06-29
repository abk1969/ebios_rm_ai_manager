import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Home, TestTube } from 'lucide-react';
import { Button } from './ui/button';

const NavigationButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show navigation buttons on the landing page
  if (location.pathname === '/') {
    return null;
  }

  // Show validation button only on training pages
  const isTrainingPage = location.pathname.includes('/training');
  const TRAINING_MODULE_ENABLED = import.meta.env.VITE_TRAINING_MODULE_ENABLED !== 'false';

  return (
    <div className="fixed bottom-4 right-4 flex space-x-2 z-50">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => navigate(-1)}
        className="flex items-center space-x-1 bg-white shadow-lg hover:bg-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Retour</span>
      </Button>

      {/* Bouton validation formation */}
      {TRAINING_MODULE_ENABLED && isTrainingPage && location.pathname !== '/training/validation' && (
        <Link to="/training/validation">
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center space-x-1 bg-blue-600 text-white shadow-lg hover:bg-blue-700"
          >
            <TestTube className="h-4 w-4" />
            <span>Tests</span>
          </Button>
        </Link>
      )}

      <Link to="/missions">
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center space-x-1 bg-white shadow-lg hover:bg-gray-100"
        >
          <Home className="h-4 w-4" />
          <span>Accueil</span>
        </Button>
      </Link>
    </div>
  );
};

export default NavigationButtons;