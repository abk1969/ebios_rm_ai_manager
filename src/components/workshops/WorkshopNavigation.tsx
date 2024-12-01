import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, Target, Users, Route, ShieldCheck } from 'lucide-react';

const workshops = [
  {
    number: 1,
    title: 'Define the Scope and Security Baseline',
    icon: Database,
    path: '/workshop-1',
    description: 'Establish study framework and evaluate security baseline',
    steps: [
      'Define business values',
      'Identify supporting assets',
      'Evaluate security baseline',
      'Document compliance gaps'
    ]
  },
  {
    number: 2,
    title: 'Risk Sources',
    icon: Target,
    path: '/workshop-2',
    description: 'Identify and analyze potential sources of risk',
    steps: [
      'Identify risk sources',
      'Define objectives',
      'Evaluate pertinence',
      'Document strategic context'
    ]
  },
  {
    number: 3,
    title: 'Strategic Scenarios',
    icon: Users,
    path: '/workshop-3',
    description: 'Develop strategic attack scenarios',
    steps: [
      'Map stakeholders',
      'Define attack paths',
      'Evaluate exposure',
      'Assess cyber reliability'
    ]
  },
  {
    number: 4,
    title: 'Operational Scenarios',
    icon: Route,
    path: '/workshop-4',
    description: 'Define operational attack scenarios',
    steps: [
      'Define attack actions',
      'Evaluate technical difficulty',
      'Assess success probability',
      'Document attack paths'
    ]
  },
  {
    number: 5,
    title: 'Treatment Strategy',
    icon: ShieldCheck,
    path: '/workshop-5',
    description: 'Define and implement security measures',
    steps: [
      'Define security measures',
      'Evaluate residual risk',
      'Create action plan',
      'Monitor implementation'
    ]
  },
];

const WorkshopNavigation = () => {
  const location = useLocation();

  return (
    <nav className="space-y-4">
      {workshops.map((workshop) => {
        const Icon = workshop.icon;
        const isActive = location.pathname === workshop.path;

        return (
          <Link
            key={workshop.number}
            to={workshop.path}
            className={`block rounded-lg p-4 transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  isActive ? 'bg-blue-100' : 'bg-gray-100'
                }`}
              >
                <Icon
                  className={`h-6 w-6 ${isActive ? 'text-blue-600' : 'text-gray-600'}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Workshop {workshop.number}</div>
                  {isActive && (
                    <span className="text-xs font-medium text-blue-600">Active</span>
                  )}
                </div>
                <p className="text-sm text-gray-900">{workshop.title}</p>
              </div>
            </div>
            {isActive && (
              <div className="mt-4 pl-13">
                <ul className="space-y-2">
                  {workshop.steps.map((step, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default WorkshopNavigation;