import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Shield, Users, Database, Clock } from 'lucide-react';

const PricingSection = () => {
  const tiers = [
    {
      name: 'Starter',
      price: '99',
      description: 'Idéal pour les petites entreprises',
      features: [
        "Jusqu'à 3 utilisateurs",
        '5 missions actives',
        'Support par email',
        'Mises à jour incluses',
      ],
      color: 'blue',
    },
    {
      name: 'Professional',
      price: '299',
      description: 'Pour les équipes en croissance',
      features: [
        "Jusqu'à 10 utilisateurs",
        'Missions illimitées',
        'Support prioritaire',
        'API Access',
        'Export personnalisé',
      ],
      color: 'indigo',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Sur mesure',
      description: 'Pour les grandes organisations',
      features: [
        'Utilisateurs illimités',
        'Missions illimitées',
        'Support dédié 24/7',
        'Déploiement on-premise',
        'Formation personnalisée',
      ],
      color: 'purple',
    },
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Des tarifs adaptés à vos besoins
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choisissez le plan qui correspond le mieux à votre organisation
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border ${
                tier.popular 
                  ? 'border-blue-200 shadow-xl' 
                  : 'border-gray-200 shadow-sm'
              } bg-white`}
            >
              {tier.popular && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32">
                  <div className="rounded-full bg-blue-500 px-4 py-1 text-xs font-semibold text-white text-center">
                    Plus populaire
                  </div>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900">{tier.name}</h3>
                <p className="mt-4 text-sm text-gray-500">{tier.description}</p>
                <p className="mt-8 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">{tier.price}€</span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">/mois</span>
                </p>

                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span className="ml-3 text-sm text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className={`mt-8 block w-full rounded-lg px-6 py-4 text-center text-sm font-semibold transition-colors
                    ${tier.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  Commencer l'essai gratuit
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="rounded-2xl bg-blue-50 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-blue-900">
                  Version Community disponible
                </h3>
                <p className="mt-2 text-blue-700">
                  Déployez EBIOS Cloud Pro gratuitement sur votre infrastructure
                </p>
              </div>
              <a
                href="https://github.com/abk1969/ebios-cloud-community"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                <Shield className="h-5 w-5" />
                <span>Voir sur GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;