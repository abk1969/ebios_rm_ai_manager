import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from './ui/button';

const NavigationButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show navigation buttons on the landing page
  if (location.pathname === '/') {
    return null;
  }

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