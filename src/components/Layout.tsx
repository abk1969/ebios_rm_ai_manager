import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Briefcase, Database, Target, Users, Route, ShieldCheck, Settings, Bot, BarChart2, Upload } from 'lucide-react';
import NavigationButtons from './NavigationButtons';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const selectedMission = useSelector((state: RootState) => state.missions.selectedMission);

  const navigation = [
    { name: 'Missions', href: '/missions', icon: Briefcase },
    { name: 'Ateliers EBIOS RM', href: '/workshops', icon: Target },
    ...(selectedMission ? [
      {
        name: 'Tableau de bord IA',
        href: `/ebios-dashboard/${selectedMission.id}`,
        icon: BarChart2,
        badge: 'IA',
        badgeColor: 'bg-blue-100 text-blue-800'
      }
    ] : []),
    {
      name: 'Workshops',
      icon: Shield,
      children: [
        {
          name: 'Workshop 1',
          href: selectedMission ? `/workshops/${selectedMission.id}/1` : '/missions',
          icon: Database,
          description: 'Scope & Security Baseline',
          steps: ['Business Values', 'Supporting Assets', 'Security Controls']
        },
        {
          name: 'Workshop 2',
          href: selectedMission ? `/workshops/${selectedMission.id}/2` : '/missions',
          icon: Target,
          description: 'Risk Sources',
          steps: ['Source Identification', 'Objectives', 'Pertinence Analysis']
        },
        {
          name: 'Workshop 3',
          href: selectedMission ? `/workshops/${selectedMission.id}/3` : '/missions',
          icon: Users,
          description: 'Strategic Scenarios',
          steps: ['Stakeholder Analysis', 'Strategic Context', 'Attack Paths']
        },
        {
          name: 'Workshop 4',
          href: selectedMission ? `/workshops/${selectedMission.id}/4` : '/missions',
          icon: Route,
          description: 'Operational Scenarios',
          steps: ['Attack Actions', 'Technical Analysis', 'Success Probability']
        },
        {
          name: 'Workshop 5',
          href: selectedMission ? `/workshops/${selectedMission.id}/5` : '/missions',
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
                      className={`group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium ${
                        isActive
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className={`mr-3 h-5 w-5 ${
                          isActive ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        {item.name}
                      </div>
                      {(item as any).badge && (
                        <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${(item as any).badgeColor || 'bg-gray-100 text-gray-800'}`}>
                          {(item as any).badge}
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