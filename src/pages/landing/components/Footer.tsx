import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold">EBIOS Cloud Pro</span>
            </div>
            <p className="text-gray-500 text-sm">
              Solution SaaS pour vos analyses de risques selon la méthode EBIOS RM.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/features" className="text-base text-gray-500 hover:text-gray-900">
                      Fonctionnalités
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="text-base text-gray-500 hover:text-gray-900">
                      Tarifs
                    </Link>
                  </li>
                  <li>
                    <a 
                      href="https://github.com/abk1969/ebios-cloud-community"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Version Community
                    </a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/documentation" className="text-base text-gray-500 hover:text-gray-900">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Légal</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                      Confidentialité
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                      Conditions
                    </Link>
                  </li>
                  <li>
                    <Link to="/rgpd" className="text-base text-gray-500 hover:text-gray-900">
                      RGPD
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Ressources</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a
                      href="https://cyber.gouv.fr/la-methode-ebios-risk-manager"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      EBIOS RM Officiel
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://club-ebios.org/site/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Club EBIOS
                    </a>
                  </li>
                  <li>
                    <Link to="/blog" className="text-base text-gray-500 hover:text-gray-900">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            © 2024 GLOBACOM3000. EBIOS® et EBIOS Risk Manager®. Tous droits réservés
          </p>
          <p className="mt-2 text-sm text-gray-400 text-center">
            Powered by GLOBACOM3000
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;