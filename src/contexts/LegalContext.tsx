import React, { createContext, useContext, useState, useEffect } from 'react';

interface LegalContextType {
  hasAcceptedTerms: boolean;
  setHasAcceptedTerms: (value: boolean) => void;
  showLegalNotice: boolean;
  setShowLegalNotice: (value: boolean) => void;
}

const LegalContext = createContext<LegalContextType | undefined>(undefined);

export const LegalProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);
  const [showLegalNotice, setShowLegalNotice] = useState<boolean>(true);

  useEffect(() => {
    const accepted = localStorage.getItem('ebiosLegalTermsAccepted');
    if (accepted) {
      setHasAcceptedTerms(true);
    }
  }, []);

  useEffect(() => {
    if (hasAcceptedTerms) {
      localStorage.setItem('ebiosLegalTermsAccepted', 'true');
    }
  }, [hasAcceptedTerms]);

  const value = {
    hasAcceptedTerms,
    setHasAcceptedTerms,
    showLegalNotice,
    setShowLegalNotice,
  };

  return (
    <LegalContext.Provider value={value}>
      {children}
    </LegalContext.Provider>
  );
};

export const useLegal = () => {
  const context = useContext(LegalContext);
  if (context === undefined) {
    throw new Error('useLegal must be used within a LegalProvider');
  }
  return context;
};