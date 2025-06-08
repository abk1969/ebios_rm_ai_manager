import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  LayoutDashboard,
  Briefcase,
  Database,
  Target,
  Users,
  Route,
  ShieldCheck,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, isMobile, onClose }: SidebarProps) => {
  const location = useLocation();

  // 🔧 NAVIGATION DYNAMIQUE: URLs basées sur la mission sélectionnée
  const selectedMission = useSelector((state: RootState) => state.missions.selectedMission);

  const navigation = [
    { name: 'Missions', href: '/missions', icon: Briefcase },
    {
      name: 'Workshop 1',
      href: selectedMission ? `/workshops/${selectedMission.id}/1` : '/missions',
      icon: Database,
      description: 'Scope & Security Baseline'
    },
    {
      name: 'Workshop 2',
      href: selectedMission ? `/workshops/${selectedMission.id}/2` : '/missions',
      icon: Target,
      description: 'Risk Sources'
    },
    {
      name: 'Workshop 3',
      href: selectedMission ? `/workshops/${selectedMission.id}/3` : '/missions',
      icon: Users,
      description: 'Strategic Scenarios'
    },
    {
      name: 'Workshop 4',
      href: selectedMission ? `/workshops/${selectedMission.id}/4` : '/missions',
      icon: Route,
      description: 'Operational Scenarios'
    },
    {
      name: 'Workshop 5',
      href: selectedMission ? `/workshops/${selectedMission.id}/5` : '/missions',
      icon: ShieldCheck,
      description: 'Treatment Strategy'
    },
    { name: 'Paramètres', href: '/settings', icon: Settings }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-30' : 'relative'}
        w-64 bg-white border-r border-gray-200 pt-5 pb-4 flex flex-col
      `}>
        {/* Close button for mobile */}
        {isMobile && (
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={onClose}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <item.icon 
                  className={`
                    mr-3 h-5 w-5
                    ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}
                  `}
                />
                <div>
                  <span>{item.name}</span>
                  {item.description && (
                    <p className="text-xs text-gray-500">{item.description}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;