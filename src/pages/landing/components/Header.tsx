import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-blue-500 lg:border-none">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">EBIOS Cloud Pro</span>
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">
              <Link to="/features" className="text-base font-medium text-gray-600 hover:text-gray-900">
                Fonctionnalités
              </Link>
              <Link to="/pricing" className="text-base font-medium text-gray-600 hover:text-gray-900">
                Tarifs
              </Link>
              <Link to="/about" className="text-base font-medium text-gray-600 hover:text-gray-900">
                À propos
              </Link>
              <Link to="/contact" className="text-base font-medium text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </div>
          <div className="ml-10 space-x-4">
            <Link
              to="/login"
              className="inline-block bg-white py-2 px-4 border border-blue-500 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="inline-block bg-blue-600 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-blue-700"
            >
              Essai gratuit
            </Link>
          </div>
        </div>
        <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
          <Link to="/features" className="text-base font-medium text-gray-600 hover:text-gray-900">
            Fonctionnalités
          </Link>
          <Link to="/pricing" className="text-base font-medium text-gray-600 hover:text-gray-900">
            Tarifs
          </Link>
          <Link to="/about" className="text-base font-medium text-gray-600 hover:text-gray-900">
            À propos
          </Link>
          <Link to="/contact" className="text-base font-medium text-gray-600 hover:text-gray-900">
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;