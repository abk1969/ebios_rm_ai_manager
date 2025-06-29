/**
 * 💡 COMPOSANT BULLE D'AIDE MÉTRIQUES
 * Explique le calcul et la signification de chaque métrique EBIOS RM
 * CONFORMITÉ ANSSI: Transparence totale des calculs
 */

import React, { useState } from 'react';
import { HelpCircle, Info, Calculator, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricExplanation {
  title: string;
  description: string;
  calculation: string;
  anssiReference: string;
  criteria: string[];
  interpretation: {
    excellent: string;
    good: string;
    warning: string;
    critical: string;
  };
}

interface MetricTooltipProps {
  metricType: 'completion' | 'conformity' | 'coverage' | 'quality' | 'maturity';
  workshop?: number;
  value: number;
  className?: string;
}

/**
 * Définitions des métriques selon ANSSI EBIOS RM
 */
const METRIC_EXPLANATIONS: Record<string, MetricExplanation> = {
  'completion-1': {
    title: 'Taux de Complétude - Atelier 1',
    description: 'Mesure le pourcentage d\'achèvement de l\'Atelier 1 selon les exigences ANSSI EBIOS RM v1.0',
    calculation: `
      Calcul: (Éléments complétés / 4 critères obligatoires) × 100
      
      Critères ANSSI obligatoires:
      • Valeurs métier identifiées (min. 3) = 25%
      • Actifs supports cartographiés (min. 5) = 25%  
      • Événements redoutés définis (min. 2/valeur) = 25%
      • Qualité des données validée = 25%
    `,
    anssiReference: 'Guide ANSSI EBIOS RM v1.0 - Section 3.1 "Cadrage et socle de sécurité"',
    criteria: [
      'Au minimum 3 valeurs métier identifiées',
      'Au minimum 5 actifs supports cartographiés',
      'Au minimum 2 événements redoutés par valeur métier',
      'Données complètes et cohérentes'
    ],
    interpretation: {
      excellent: '90-100%: Atelier 1 conforme ANSSI, prêt pour Atelier 2',
      good: '70-89%: Bon avancement, quelques éléments à compléter',
      warning: '50-69%: Avancement partiel, compléments nécessaires',
      critical: '0-49%: Atelier incomplet, non conforme ANSSI'
    }
  },
  
  'conformity-1': {
    title: 'Score de Conformité ANSSI - Atelier 1',
    description: 'Évalue la conformité méthodologique selon les critères ANSSI EBIOS RM',
    calculation: `
      Calcul: Somme pondérée de 4 critères ANSSI réels

      • Complétude des données (30%):
        Toutes les données obligatoires présentes et valides

      • Cohérence méthodologique (25%):
        ≥70% valeurs métier ont des actifs supports
        ≥50% valeurs métier ont des événements redoutés
        ≥80% actifs supports sont classifiés
        (Au moins 2 critères sur 3 requis)

      • Traçabilité (25%):
        IDs valides, relations cohérentes, timestamps présents
        (Au moins 3 critères sur 4 requis)

      • Documentation (20%):
        Descriptions complètes, métadonnées obligatoires
        (Au moins 3 critères sur 4 requis)

      Score final = Σ(critère validé × poids)
    `,
    anssiReference: 'Guide ANSSI EBIOS RM v1.0 - Annexe A "Critères de conformité"',
    criteria: [
      'Complétude: Toutes données obligatoires présentes et valides',
      'Cohérence: ≥70% valeurs métier avec actifs, ≥50% avec événements',
      'Traçabilité: IDs valides, relations cohérentes, timestamps présents',
      'Documentation: Descriptions ≥20 caractères, métadonnées complètes'
    ],
    interpretation: {
      excellent: '85-100%: Conformité ANSSI validée',
      good: '70-84%: Conformité acceptable, améliorations mineures',
      warning: '50-69%: Non-conformité partielle, corrections requises',
      critical: '0-49%: Non-conformité majeure, refonte nécessaire'
    }
  },

  'completion-2': {
    title: 'Taux de Complétude - Atelier 2',
    description: 'Mesure l\'avancement de l\'identification des sources de risque selon ANSSI',
    calculation: `
      Calcul: (Sources de risque identifiées / 5 minimum ANSSI) × 100
      
      Critères ANSSI:
      • Minimum 5 sources de risque
      • Acteurs de menace identifiés
      • Méthodes d'attaque référencées
      • Couverture MITRE ATT&CK
    `,
    anssiReference: 'Guide ANSSI EBIOS RM v1.0 - Section 3.2 "Sources de risque"',
    criteria: [
      'Au minimum 5 sources de risque identifiées',
      'Acteurs de menace caractérisés',
      'Méthodes d\'attaque documentées',
      'Techniques MITRE ATT&CK référencées'
    ],
    interpretation: {
      excellent: '90-100%: Sources de risque complètement identifiées',
      good: '70-89%: Bonne couverture des sources de risque',
      warning: '50-69%: Identification partielle, compléments nécessaires',
      critical: '0-49%: Sources de risque insuffisamment identifiées'
    }
  },

  'completion-3': {
    title: 'Taux de Complétude - Atelier 3',
    description: 'Mesure l\'avancement de l\'élaboration des scénarios stratégiques',
    calculation: `
      Calcul: (Scénarios stratégiques / 3 minimum ANSSI) × 100
      
      Critères ANSSI:
      • Minimum 3 scénarios stratégiques
      • Distribution des niveaux de risque
      • Cohérence avec Ateliers 1 et 2
    `,
    anssiReference: 'Guide ANSSI EBIOS RM v1.0 - Section 3.3 "Scénarios stratégiques"',
    criteria: [
      'Au minimum 3 scénarios stratégiques',
      'Niveaux de risque évalués (1-4)',
      'Cohérence avec valeurs métier',
      'Lien avec sources de risque'
    ],
    interpretation: {
      excellent: '90-100%: Scénarios stratégiques complets',
      good: '70-89%: Bonne élaboration des scénarios',
      warning: '50-69%: Scénarios partiels, approfondissement requis',
      critical: '0-49%: Scénarios insuffisants ou manquants'
    }
  },

  'completion-4': {
    title: 'Taux de Complétude - Atelier 4',
    description: 'Mesure l\'avancement de l\'élaboration des scénarios opérationnels',
    calculation: `
      Calcul: (Scénarios opérationnels / 2 minimum par stratégique) × 100
      
      Critères ANSSI:
      • Minimum 2 scénarios opérationnels par stratégique
      • Chemins d'attaque détaillés
      • Vulnérabilités identifiées
      • Profondeur technique (8 étapes optimales)
    `,
    anssiReference: 'Guide ANSSI EBIOS RM v1.0 - Section 3.4 "Scénarios opérationnels"',
    criteria: [
      'Scénarios opérationnels détaillés',
      'Chemins d\'attaque documentés',
      'Vulnérabilités techniques identifiées',
      'Étapes d\'attaque précisées'
    ],
    interpretation: {
      excellent: '90-100%: Scénarios opérationnels complets et détaillés',
      good: '70-89%: Bonne élaboration opérationnelle',
      warning: '50-69%: Détails techniques insuffisants',
      critical: '0-49%: Scénarios opérationnels manquants'
    }
  },

  'completion-5': {
    title: 'Taux de Complétude - Atelier 5',
    description: 'Mesure l\'avancement du traitement du risque selon ANSSI',
    calculation: `
      Calcul: (Mesures de sécurité / 5 minimum ANSSI) × 100
      
      Critères ANSSI:
      • Minimum 5 mesures de sécurité
      • Couverture du traitement (% risques traités)
      • Calcul du risque résiduel
      • Coût d'implémentation évalué
    `,
    anssiReference: 'Guide ANSSI EBIOS RM v1.0 - Section 3.5 "Traitement du risque"',
    criteria: [
      'Au minimum 5 mesures de sécurité',
      'Risques traités ou acceptés',
      'Risque résiduel calculé',
      'Coûts d\'implémentation évalués'
    ],
    interpretation: {
      excellent: '90-100%: Traitement du risque complet',
      good: '70-89%: Bon traitement des risques',
      warning: '50-69%: Traitement partiel, mesures supplémentaires',
      critical: '0-49%: Traitement du risque insuffisant'
    }
  }
};

/**
 * Composant de bulle d'aide pour les métriques
 */
export const MetricTooltip: React.FC<MetricTooltipProps> = ({
  metricType,
  workshop,
  value,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Clé pour récupérer l'explication
  const explanationKey = workshop ? `${metricType}-${workshop}` : metricType;
  const explanation = METRIC_EXPLANATIONS[explanationKey];
  
  if (!explanation) {
    return null;
  }
  
  // Déterminer le niveau d'interprétation
  const getInterpretationLevel = (value: number) => {
    if (value >= 90) return 'excellent';
    if (value >= 70) return 'good';
    if (value >= 50) return 'warning';
    return 'critical';
  };
  
  const level = getInterpretationLevel(value);
  const interpretation = explanation.interpretation[level];
  
  // Icône selon le niveau
  const getIcon = () => {
    switch (level) {
      case 'excellent': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good': return <Info className="h-4 w-4 text-blue-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <HelpCircle className="h-4 w-4 text-gray-600" />;
    }
  };
  
  return (
    <div className={cn("relative inline-block", className)}>
      {/* Bouton d'aide */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        title="Explication de la métrique"
      >
        <HelpCircle className="h-3 w-3 text-gray-600" />
      </button>
      
      {/* Bulle d'aide */}
      {isOpen && (
        <>
          {/* Overlay pour fermer */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Contenu de la bulle */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 w-96 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            {/* En-tête */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                {getIcon()}
                <h4 className="font-semibold text-gray-900 ml-2">{explanation.title}</h4>
              </div>
              <div className={cn(
                "text-lg font-bold px-2 py-1 rounded",
                level === 'excellent' ? 'bg-green-100 text-green-800' :
                level === 'good' ? 'bg-blue-100 text-blue-800' :
                level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              )}>
                {value}%
              </div>
            </div>
            
            {/* Description */}
            <p className="text-sm text-gray-700 mb-3">{explanation.description}</p>
            
            {/* Calcul */}
            <div className="mb-3">
              <div className="flex items-center mb-2">
                <Calculator className="h-4 w-4 text-blue-600 mr-2" />
                <span className="font-medium text-sm text-gray-900">Méthode de calcul</span>
              </div>
              <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded whitespace-pre-wrap">
                {explanation.calculation}
              </pre>
            </div>
            
            {/* Critères ANSSI */}
            <div className="mb-3">
              <h5 className="font-medium text-sm text-gray-900 mb-2">Critères ANSSI</h5>
              <ul className="text-xs text-gray-600 space-y-1">
                {explanation.criteria.map((criterion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Interprétation */}
            <div className="mb-3">
              <h5 className="font-medium text-sm text-gray-900 mb-2">Interprétation</h5>
              <p className={cn(
                "text-xs p-2 rounded",
                level === 'excellent' ? 'bg-green-50 text-green-700' :
                level === 'good' ? 'bg-blue-50 text-blue-700' :
                level === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                'bg-red-50 text-red-700'
              )}>
                {interpretation}
              </p>
            </div>
            
            {/* Référence ANSSI */}
            <div className="text-xs text-gray-500 border-t pt-2">
              <strong>Référence:</strong> {explanation.anssiReference}
            </div>
            
            {/* Flèche */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default MetricTooltip;
