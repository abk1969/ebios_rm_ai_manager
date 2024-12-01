import React from 'react';

const ReportWatermark = () => {
  const watermarkStyle = {
    position: 'fixed',
    bottom: '1rem',
    right: '1rem',
    opacity: 0.7,
    fontSize: '0.75rem',
    color: '#666',
    maxWidth: '300px',
    textAlign: 'right',
    pointerEvents: 'none',
    userSelect: 'none',
    zIndex: 1000,
  } as const;

  return (
    <div style={watermarkStyle}>
      <div>Document généré par EBIOS Cloud Pro - Outil indépendant</div>
      <div>Référence EBIOS RM : www.ssi.gouv.fr/ebios-risk-manager</div>
      <div>{new Date().toISOString().split('T')[0]}</div>
    </div>
  );
};

export default ReportWatermark;