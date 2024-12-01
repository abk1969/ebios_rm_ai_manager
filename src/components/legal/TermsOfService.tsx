import React from 'react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Conditions d'Utilisation</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Acceptation des conditions</h2>
        <p className="mb-4">
          En utilisant EBIOS Cloud Pro, vous acceptez les présentes conditions d'utilisation.
          Ces conditions constituent un accord juridique entre vous et GLOBACOM3000.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. Description du service</h2>
        <p className="mb-4">
          EBIOS Cloud Pro est un outil d'aide à l'analyse des risques selon la méthode EBIOS RM.
          Le service est fourni "tel quel" et peut être modifié à tout moment.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. Propriété intellectuelle</h2>
        <p className="mb-4">
          EBIOS® et EBIOS Risk Manager® sont des marques déposées de l'ANSSI.
          EBIOS Cloud Pro est une marque de GLOBACOM3000.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. Responsabilités</h2>
        <p className="mb-4">
          L'utilisateur est seul responsable :
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>De l'utilisation du service conformément à sa destination</li>
          <li>De la confidentialité de ses identifiants</li>
          <li>De l'exactitude des données saisies</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">5. Contact</h2>
        <p>
          Pour toute question concernant ces conditions :
          <a href="mailto:legal@ebioscloud.pro" className="text-blue-600 hover:underline ml-1">
            legal@ebioscloud.pro
          </a>
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;