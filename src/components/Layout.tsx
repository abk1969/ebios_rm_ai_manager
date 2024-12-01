import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Briefcase, Database, Target, Users, Route, ShieldCheck, Settings } from 'lucide-react';
import NavigationButtons from './NavigationButtons';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
    { name: 'Missions', href: '/missions', icon: Briefcase },
    {
      name: 'Workshops',
      icon: Shield,
      children: [
        {
          name: 'Workshop 1',
          href: '/workshop-1',
          icon: Database,
          description: 'Scope & Security Baseline',
          steps: ['Business Values', 'Supporting Assets', 'Security Controls']
        },
        {
          name: 'Workshop 2',
          href: '/workshop-2',
          icon: Target,
          description: 'Risk Sources',
          steps: ['Source Identification', 'Objectives', 'Pertinence Analysis']
        },
        {
          name: 'Workshop 3',
          href: '/workshop-3',
          icon: Users,
          description: 'Strategic Scenarios',
          steps: ['Stakeholder Analysis', 'Strategic Context', 'Attack Paths']
        },
        {
          name: 'Workshop 4',
          href: '/workshop-4',
          icon: Route,
          description: 'Operational Scenarios',
          steps: ['Attack Actions', 'Technical Analysis', 'Success Probability']
        },
        {
          name: 'Workshop 5',
          href: '/workshop-5',
          icon: ShieldCheck,
          description: 'Treatment Strategy',
          steps: ['Security Measures', 'Risk Evaluation', 'Action Plan']
        }
      ]
    },
    { name: 'Settings', href: '/settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <div className="flex-1 flex">
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.href ? location.pathname === item.href : 
                    item.children?.some(child => child.href === location.pathname);

                  if (item.children) {
                    return (
                      <div key={item.name} className="space-y-1">
                        <div className={`flex items-center px-3 py-2 text-sm font-medium ${
                          isActive ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          <Icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </div>
                        <div className="space-y-1 pl-11">
                          {item.children.map((child) => {
                            const ChildIcon = child.icon;
                            const isChildActive = location.pathname === child.href;
                            
                            return (
                              <Link
                                key={child.name}
                                to={child.href}
                                className={`group flex flex-col rounded-md px-3 py-2 ${
                                  isChildActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                <div className="flex items-center">
                                  <ChildIcon className={`mr-3 h-4 w-4 ${
                                    isChildActive ? 'text-blue-600' : 'text-gray-400'
                                  }`} />
                                  <span className="font-medium">{child.name}</span>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">{child.description}</p>
                                {isChildActive && child.steps && (
                                  <div className="mt-2 space-y-1">
                                    {child.steps.map((step, index) => (
                                      <div key={index} className="flex items-center text-xs text-gray-500">
                                        <span className="mr-2 h-1 w-1 rounded-full bg-gray-400"></span>
                                        {step}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      {item.name}
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
      <AppFooter />
    </div>
  );
};

export default Layout;