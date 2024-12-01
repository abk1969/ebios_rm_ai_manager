{/* Previous imports remain the same */}

interface InitialDisclaimerProps {
  onAccept: () => void;
}

const InitialDisclaimer = ({ onAccept }: InitialDisclaimerProps) => {
  {/* Previous state and other code remains the same */}

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      {/* Previous code remains the same until the documentation link */}
      <a 
        href="https://cyber.gouv.fr/la-methode-ebios-risk-manager"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline mt-2 block text-sm"
      >
        Consulter la méthode officielle →
      </a>
      {/* Rest of the code remains the same */}
    </div>
  );
};

export default InitialDisclaimer;