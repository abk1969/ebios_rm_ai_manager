import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Briefcase, Database, Target, Users, Route, ShieldCheck, Settings, Bot, BarChart2, Upload, Zap } from 'lucide-react';
import NavigationButtons from './NavigationButtons';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const selectedMission = useSelector((state: RootState) => state.missions.selectedMission);

  const navigation = [
    { name: 'Missions', href: '/missions', icon: Briefcase },
    { name: 'Générateur IA', href: '/auto-generator', icon: Zap },
    ...(selectedMission ? [
      {
        name: 'Tableau de bord',
        href: `/ebios-dashboard/${selectedMission.id}`,
        icon: BarChart2,
        badge: 'Mission Active',
        badgeColor: 'bg-green-100 text-green-800'
      },
      {
        name: 'Ateliers EBIOS RM',
        href: `/workshops`,
        icon: Target,
        description: 'Accès aux 5 ateliers de la méthode EBIOS RM'
      }
    ] : [
      {
        name: 'Ateliers EBIOS RM',
        href: '/workshops',
        icon: Target,
        description: 'Sélectionnez une mission pour accéder aux ateliers',
        disabled: true
      }
    ]),
    { name: 'Paramètres', href: '/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.href ? location.pathname === item.href : false;
                  const isDisabled = (item as any).disabled;

                  if (isDisabled) {
                    return (
                      <div
                        key={item.name}
                        className="group flex flex-col px-3 py-2 text-sm font-medium rounded-md text-gray-400 cursor-not-allowed"
                        title={(item as any).description}
                      >
                        <div className="flex items-center">
                          <Icon className="mr-3 h-5 w-5" />
                          {item.name}
                          <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                            Mission requise
                          </span>
                        </div>
                        {(item as any).description && (
                          <span className="text-xs text-gray-400 mt-1 ml-8">
                            {(item as any).description}
                          </span>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex flex-col px-3 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="mr-3 h-5 w-5" />
                        {item.name}
                        {(item as any).badge && (
                          <span className={`ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            (item as any).badgeColor || 'bg-gray-100 text-gray-800'
                          }`}>
                            {(item as any).badge}
                          </span>
                        )}
                      </div>
                      {(item as any).description && (
                        <span className="text-xs text-gray-500 mt-1 ml-8">
                          {(item as any).description}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      <NavigationButtons />
    </div>
  );
};

export default Layout;