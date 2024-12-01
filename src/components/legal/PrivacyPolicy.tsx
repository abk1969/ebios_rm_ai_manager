import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Politique de Confidentialité</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">1. Collecte des données</h2>
        <p className="mb-4">
          EBIOS Cloud Pro collecte uniquement les données nécessaires à l'analyse des risques selon la méthode EBIOS RM :
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Informations d'identification (email professionnel)</li>
          <li>Données relatives aux missions d'analyse</li>
          <li>Données techniques pour le fonctionnement du service</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">2. Utilisation des données</h2>
        <p className="mb-4">
          Vos données sont utilisées exclusivement pour :
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Fournir et améliorer nos services</li>
          <li>Assurer la sécurité de votre compte</li>
          <li>Respecter nos obligations légales</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">3. Protection des données</h2>
        <p className="mb-4">
          Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données :
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Chiffrement des données en transit et au repos</li>
          <li>Contrôles d'accès stricts</li>
          <li>Surveillance continue de la sécurité</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">4. Vos droits</h2>
        <p className="mb-4">
          Conformément au RGPD, vous disposez des droits suivants :
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Droit d'accès à vos données</li>
          <li>Droit de rectification</li>
          <li>Droit à l'effacement</li>
          <li>Droit à la portabilité des données</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">5. Contact</h2>
        <p>
          Pour toute question concernant vos données personnelles :
          <a href="mailto:dpo@globacom3000.com" className="text-blue-600 hover:underline ml-1">
            dpo@globacom3000.com
          </a>
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;