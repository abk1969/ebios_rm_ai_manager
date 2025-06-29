import React from 'react';
import { Info, CheckCircle, ArrowRight, BookOpen, Target, Users, Route, ShieldCheck, Database } from 'lucide-react';

interface WorkshopGuideProps {
  workshopNumber: 1 | 2 | 3 | 4 | 5;
  isBlocked?: boolean;
  nextSteps?: string[];
  className?: string;
}

// 📚 CONTENU D'AIDE STANDARDISÉ EBIOS RM
const WORKSHOP_GUIDES = {
  1: {
    icon: Database,
    objectives: [
      'Définir le périmètre d\'analyse et les valeurs métier',
      'Identifier les biens supports critiques',
      'Évaluer le socle de sécurité existant',
      'Documenter les écarts de conformité'
    ],
    nextSteps: [
      'Ajoutez vos valeurs métier principales',
      'Identifiez les biens supports associés',
      'Documentez les événements redoutés',
      'Évaluez votre socle de sécurité actuel'
    ],
    anssiReference: 'Guide ANSSI - Atelier 1 : Socle de sécurité'
  },
  2: {
    icon: Target,
    objectives: [
      'Identifier les sources de risque pertinentes',
      'Catégoriser selon les 7 types EBIOS RM',
      'Définir les objectifs visés par chaque source',
      'Analyser les modes opératoires (MITRE ATT&CK)',
      'Évaluer la pertinence selon l\'échelle ANSSI'
    ],
    nextSteps: [
      'Ajoutez des sources de risque variées',
      'Définissez leurs objectifs spécifiques',
      'Documentez leurs modes opératoires',
      'Évaluez leur pertinence (1-4)'
    ],
    anssiReference: 'Guide ANSSI - Atelier 2 : Sources de risque'
  },
  3: {
    icon: Users,
    objectives: [
      'Croiser sources de risque et événements redoutés',
      'Construire des scénarios stratégiques cohérents',
      'Évaluer l\'exposition et la cyber-résilience',
      'Utiliser la matrice de risque ANSSI'
    ],
    nextSteps: [
      'Créez des scénarios en croisant sources et événements',
      'Évaluez la vraisemblance et la gravité',
      'Positionnez sur la matrice de risque',
      'Priorisez selon les niveaux de risque'
    ],
    anssiReference: 'Guide ANSSI - Atelier 3 : Scénarios stratégiques'
  },
  4: {
    icon: Route,
    objectives: [
      'Détailler les chemins d\'attaque techniques',
      'Référencer les techniques MITRE ATT&CK',
      'Évaluer la faisabilité opérationnelle',
      'Identifier les actifs de soutien impliqués'
    ],
    nextSteps: [
      'Détaillez les chemins d\'attaque pour chaque scénario',
      'Référencez les techniques MITRE appropriées',
      'Évaluez la difficulté technique',
      'Documentez les étapes d\'attaque'
    ],
    anssiReference: 'Guide ANSSI - Atelier 4 : Scénarios opérationnels'
  },
  5: {
    icon: ShieldCheck,
    objectives: [
      'Définir les mesures de sécurité appropriées',
      'Évaluer le risque résiduel',
      'Créer un plan d\'action priorisé',
      'Monitorer l\'implémentation'
    ],
    nextSteps: [
      'Sélectionnez des mesures de sécurité adaptées',
      'Évaluez leur efficacité et coût',
      'Priorisez selon le risque résiduel',
      'Planifiez l\'implémentation'
    ],
    anssiReference: 'Guide ANSSI - Atelier 5 : Traitement du risque'
  }
};

const WorkshopGuide: React.FC<WorkshopGuideProps> = ({
  workshopNumber,
  isBlocked = false,
  nextSteps,
  className = ''
}) => {
  const guide = WORKSHOP_GUIDES[workshopNumber];
  const Icon = guide.icon;

  if (isBlocked) {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-800">Prochaines étapes</h3>
            <div className="mt-2 space-y-1">
              {(nextSteps || guide.nextSteps).map((step, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm text-blue-700">
                  <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-600 mt-3">
              💡 Utilisez les suggestions IA et les référentiels intégrés pour vous guider.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <Icon className="h-6 w-6 text-gray-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Objectifs de l'Atelier {workshopNumber} (ANSSI)
          </h3>
          <ul className="space-y-1">
            {guide.objectives.map((objective, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-green-500" />
                <span>{objective}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center space-x-2 text-xs text-gray-500">
            <BookOpen className="h-3 w-3" />
            <span>{guide.anssiReference}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopGuide;
