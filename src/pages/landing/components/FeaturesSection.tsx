import React from 'react';
import { Shield, Users, Lock, Database, Cloud, BarChart } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      name: 'Gestion des missions',
      description: 'Créez et gérez vos missions d\'analyse des risques avec un suivi en temps réel.',
      icon: Shield,
    },
    {
      name: 'Collaboration d\'équipe',
      description: 'Travaillez simultanément avec votre équipe sur les mêmes projets.',
      icon: Users,
    },
    {
      name: 'Sécurité avancée',
      description: 'Protection des données avec chiffrement de bout en bout.',
      icon: Lock,
    },
    {
      name: 'Base de connaissances',
      description: 'Accédez à une base de données complète de menaces et vulnérabilités.',
      icon: Database,
    },
    {
      name: 'Sauvegarde cloud',
      description: 'Vos données sont automatiquement sauvegardées dans le cloud.',
      icon: Cloud,
    },
    {
      name: 'Rapports détaillés',
      description: 'Générez des rapports personnalisés et des visualisations.',
      icon: BarChart,
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
            Fonctionnalités
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Tout ce dont vous avez besoin pour EBIOS RM
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Une suite complète d'outils pour réaliser vos analyses de risques selon la méthode EBIOS RM
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;