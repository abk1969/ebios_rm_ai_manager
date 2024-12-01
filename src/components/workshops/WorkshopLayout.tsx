import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Database, Target, Users, Route, ShieldCheck } from 'lucide-react';

const workshops = [
  {
    number: 1,
    title: 'Scope and Security Baseline',
    icon: Database,
    path: '/workshop-1',
    description: 'Define study scope and evaluate security baseline'
  },
  {
    number: 2,
    title: 'Risk Sources',
    icon: Target,
    path: '/workshop-2',
    description: 'Identify and analyze risk sources'
  },
  {
    number: 3,
    title: 'Strategic Scenarios',
    icon: Users,
    path: '/workshop-3',
    description: 'Analyze stakeholders and strategic scenarios'
  },
  {
    number: 4,
    title: 'Operational Scenarios',
    icon: Route,
    path: '/workshop-4',
    description: 'Define operational attack scenarios'
  },
  {
    number: 5,
    title: 'Treatment Strategy',
    icon: ShieldCheck,
    path: '/workshop-5',
    description: 'Define and implement security measures'
  }
];

interface WorkshopLayoutProps {
  children: React.ReactNode;
}

const WorkshopLayout: React.FC<WorkshopLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white lg:block">
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">EBIOS RM</span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col p-4">
          <div className="space-y-2">
            {workshops.map((workshop) => {
              const Icon = workshop.icon;
              return (
                <Link
                  key={workshop.number}
                  to={workshop.path}
                  className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Icon className="h-5 w-5" />
                  <span>Workshop {workshop.number}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
      <div className="flex-1">
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkshopLayout;