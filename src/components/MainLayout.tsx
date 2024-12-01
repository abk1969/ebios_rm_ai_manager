import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import LegalHeader from './legal/LegalHeader';
import LegalFooter from './legal/LegalFooter';
import LegalStatus from './legal/LegalStatus';
import InitialDisclaimer from './legal/InitialDisclaimer';
import NavigationButtons from './NavigationButtons';
import { Card } from "@/components/ui/card";
import { useLegal } from '@/contexts/LegalContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { hasAcceptedTerms, setHasAcceptedTerms } = useLegal();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const accepted = localStorage.getItem('disclaimerAccepted');
    if (accepted) {
      setHasAcceptedTerms(true);
    }
  }, [setHasAcceptedTerms]);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    setHasAcceptedTerms(true);
  };

  if (!hasAcceptedTerms) {
    return <InitialDisclaimer onAccept={handleAcceptDisclaimer} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <LegalHeader />
      
      <div className="flex flex-1">
        <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-gray-50 transition-all duration-300 ease-in-out overflow-hidden`}>
          <div className="p-4 flex flex-col h-full">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-200 self-end"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <nav className="flex-1 mt-4">
              {/* Your existing navigation */}
            </nav>
            
            <LegalStatus />
          </div>
        </div>

        <main className="flex-1 p-6 bg-gray-100">
          <Card className="mb-4 p-4 bg-yellow-50 border-yellow-100">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Cette application est un outil indépendant d'aide à l'application 
                de la méthode EBIOS Risk Manager.
              </p>
            </div>
          </Card>

          {children}
        </main>
      </div>

      <NavigationButtons />
      <LegalFooter />
    </div>
  );
};

export default MainLayout;