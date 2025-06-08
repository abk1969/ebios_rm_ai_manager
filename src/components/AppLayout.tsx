import React from 'react';
import { useLegal } from '@/contexts/LegalContext';
import LegalDisclaimer from './legal/LegalDisclaimer';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import Breadcrumb from './common/Breadcrumb';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { hasAcceptedTerms, setHasAcceptedTerms } = useLegal();

  if (!hasAcceptedTerms) {
    return <LegalDisclaimer onAccept={() => setHasAcceptedTerms(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Breadcrumb />
          </div>
          {children}
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default AppLayout;