import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Users, Lock, Database, Cloud } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import PricingSection from './components/PricingSection';
import FeaturesSection from './components/FeaturesSection';
import CookieConsent from './components/CookieConsent';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                EBIOS Risk Manager
                <span className="block text-blue-200">en mode SaaS</span>
              </h1>
              <p className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Simplifiez et optimisez votre analyse des risques de sécurité avec notre plateforme cloud dédiée à la méthode EBIOS RM.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10"
                >
                  Commencer gratuitement
                </Link>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <Shield className="w-full h-full text-white opacity-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Avantages</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Une solution complète pour votre analyse des risques
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {[
                {
                  name: 'Conforme RGPD',
                  description: 'Hébergement des données en France et respect total de la réglementation européenne.',
                  icon: Lock,
                },
                {
                  name: 'Collaboration en temps réel',
                  description: 'Travaillez simultanément avec votre équipe sur les mêmes projets.',
                  icon: Users,
                },
                {
                  name: 'Sauvegarde automatique',
                  description: 'Vos données sont automatiquement sauvegardées et sécurisées dans le cloud.',
                  icon: Cloud,
                },
              ].map((feature) => (
                <div key={feature.name} className="relative">
                  <div className="absolute h-12 w-12 rounded-md bg-blue-500 text-white flex items-center justify-center">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="ml-16">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{feature.name}</h3>
                    <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FeaturesSection />
      <PricingSection />
      <Footer />
      <CookieConsent />
    </div>
  );
};

export default LandingPage;