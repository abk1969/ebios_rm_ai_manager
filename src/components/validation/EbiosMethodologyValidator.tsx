import React from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info,
  BookOpen,
  Shield,
  Target,
  Database
} from 'lucide-react';
import type { BusinessValue, DreadedEvent, SupportingAsset } from '../../types/ebios';

interface EbiosMethodologyValidatorProps {
  businessValues: BusinessValue[];
  dreadedEvents: DreadedEvent[];
  supportingAssets: SupportingAsset[];
  workshopNumber: 1 | 2 | 3 | 4 | 5;
}

interface ValidationRule {
  id: string;
  title: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  isValid: boolean;
  message: string;
  ebiosReference?: string;
}

const EbiosMethodologyValidator: React.FC<EbiosMethodologyValidatorProps> = ({
  businessValues,
  dreadedEvents,
  supportingAssets,
  workshopNumber
}) => {
  
  const validateWorkshop1 = (): ValidationRule[] => {
    const rules: ValidationRule[] = [];

    // Règle 1: Nombre minimum de valeurs métier
    rules.push({
      id: 'bv_minimum',
      title: 'Nombre minimum de valeurs métier',
      description: 'Au moins 2 valeurs métier doivent être définies pour une analyse pertinente',
      severity: businessValues.length === 0 ? 'error' : businessValues.length === 1 ? 'warning' : 'info',
      isValid: businessValues.length >= 2,
      message: businessValues.length === 0 
        ? 'Aucune valeur métier définie. Commencez par identifier vos processus et informations critiques.'
        : businessValues.length === 1 
        ? 'Une seule valeur métier définie. Ajoutez au moins une valeur supplémentaire pour une analyse complète.'
        : `${businessValues.length} valeurs métier définies. Excellent !`,
      ebiosReference: 'EBIOS RM v1.5 - Atelier 1, Étape 1'
    });

    // Règle 2: Diversité des catégories de valeurs métier
    const categories = [...new Set(businessValues.map(bv => bv.category))];
    rules.push({
      id: 'bv_diversity',
      title: 'Diversité des catégories',
      description: 'Les valeurs métier doivent couvrir différentes catégories (primaire, support, management)',
      severity: categories.length === 1 ? 'warning' : 'info',
      isValid: categories.length > 1,
      message: categories.length === 1 
        ? `Toutes les valeurs métier sont de catégorie "${categories[0]}". Considérez d'autres catégories.`
        : `${categories.length} catégories représentées : ${categories.join(', ')}`,
      ebiosReference: 'EBIOS RM v1.5 - Bonnes pratiques'
    });

    // Règle 3: Événements redoutés par valeur métier
    const bvWithoutEvents = businessValues.filter(bv => 
      !dreadedEvents.some(de => de.businessValueId === bv.id)
    );
    rules.push({
      id: 'de_coverage',
      title: 'Couverture des événements redoutés',
      description: 'Chaque valeur métier doit avoir au moins un événement redouté associé',
      severity: bvWithoutEvents.length > 0 ? 'error' : 'info',
      isValid: bvWithoutEvents.length === 0,
      message: bvWithoutEvents.length > 0 
        ? `${bvWithoutEvents.length} valeur(s) métier sans événement redouté : ${bvWithoutEvents.map(bv => bv.name).join(', ')}`
        : 'Toutes les valeurs métier ont des événements redoutés associés',
      ebiosReference: 'EBIOS RM v1.5 - Atelier 1, Étape 2'
    });

    // Règle 4: Actifs supports par valeur métier
    const bvWithoutAssets = businessValues.filter(bv => 
      !supportingAssets.some(sa => sa.businessValueId === bv.id)
    );
    rules.push({
      id: 'sa_coverage',
      title: 'Couverture des actifs supports',
      description: 'Chaque valeur métier doit avoir au moins un actif support identifié',
      severity: bvWithoutAssets.length > 0 ? 'error' : 'info',
      isValid: bvWithoutAssets.length === 0,
      message: bvWithoutAssets.length > 0 
        ? `${bvWithoutAssets.length} valeur(s) métier sans actif support : ${bvWithoutAssets.map(bv => bv.name).join(', ')}`
        : 'Toutes les valeurs métier ont des actifs supports identifiés',
      ebiosReference: 'EBIOS RM v1.5 - Atelier 1, Étape 3'
    });

    // Règle 5: Diversité des types d'actifs
    const assetTypes = [...new Set(supportingAssets.map(sa => sa.type))];
    rules.push({
      id: 'sa_diversity',
      title: 'Diversité des types d\'actifs',
      description: 'Les actifs supports doivent couvrir différents types (matériel, logiciel, données, personnel, etc.)',
      severity: assetTypes.length < 3 ? 'warning' : 'info',
      isValid: assetTypes.length >= 3,
      message: assetTypes.length < 3 
        ? `Seulement ${assetTypes.length} type(s) d'actifs identifiés. Pensez aux autres catégories.`
        : `${assetTypes.length} types d'actifs représentés`,
      ebiosReference: 'EBIOS RM v1.5 - Bonnes pratiques'
    });

    // Règle 6: Niveaux de criticité appropriés
    const criticalValues = businessValues.filter(bv => bv.criticalityLevel === 'essential');
    rules.push({
      id: 'criticality_balance',
      title: 'Équilibre des niveaux de criticité',
      description: 'Les niveaux de criticité doivent être équilibrés et justifiés',
      severity: criticalValues.length === businessValues.length ? 'warning' : 'info',
      isValid: criticalValues.length < businessValues.length,
      message: criticalValues.length === businessValues.length 
        ? 'Toutes les valeurs métier sont marquées comme "essentielles". Vérifiez la pertinence.'
        : `Répartition des criticités appropriée`,
      ebiosReference: 'EBIOS RM v1.5 - Échelles de valeurs'
    });

    return rules;
  };

  const rules = workshopNumber === 1 ? validateWorkshop1() : [];
  
  const errorCount = rules.filter(r => r.severity === 'error' && !r.isValid).length;
  const warningCount = rules.filter(r => r.severity === 'warning' && !r.isValid).length;
  const validCount = rules.filter(r => r.isValid).length;

  const getIcon = (rule: ValidationRule) => {
    if (rule.isValid) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (rule.severity === 'error') return <XCircle className="h-5 w-5 text-red-600" />;
    if (rule.severity === 'warning') return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <Info className="h-5 w-5 text-blue-600" />;
  };

  const getBackgroundColor = (rule: ValidationRule) => {
    if (rule.isValid) return 'bg-green-50 border-green-200';
    if (rule.severity === 'error') return 'bg-red-50 border-red-200';
    if (rule.severity === 'warning') return 'bg-yellow-50 border-yellow-200';
    return 'bg-blue-50 border-blue-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Validation Méthodologique EBIOS RM
              </h3>
              <p className="text-sm text-gray-600">
                Vérification de la conformité aux exigences de l'atelier {workshopNumber}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">
              {validCount}/{rules.length}
            </div>
            <div className="text-sm text-gray-500">règles validées</div>
          </div>
        </div>

        {/* Résumé des erreurs/avertissements */}
        <div className="mt-4 flex items-center space-x-6">
          {errorCount > 0 && (
            <div className="flex items-center space-x-2 text-red-600">
              <XCircle className="h-4 w-4" />
              <span className="text-sm font-medium">{errorCount} erreur{errorCount > 1 ? 's' : ''}</span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center space-x-2 text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">{warningCount} avertissement{warningCount > 1 ? 's' : ''}</span>
            </div>
          )}
          {errorCount === 0 && warningCount === 0 && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Toutes les règles sont respectées</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className={`border rounded-lg p-4 ${getBackgroundColor(rule)}`}>
              <div className="flex items-start space-x-3">
                {getIcon(rule)}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{rule.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                  <p className="text-sm font-medium mt-2">{rule.message}</p>
                  {rule.ebiosReference && (
                    <p className="text-xs text-gray-500 mt-2">
                      📖 Référence : {rule.ebiosReference}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message de conformité globale */}
        {errorCount === 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-medium text-green-900">
                  ✅ Atelier {workshopNumber} conforme à la méthodologie EBIOS RM
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  Toutes les exigences méthodologiques sont respectées. 
                  Vous pouvez procéder à l'atelier suivant en toute confiance.
                </p>
              </div>
            </div>
          </div>
        )}

        {errorCount > 0 && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <XCircle className="h-6 w-6 text-red-600" />
              <div>
                <h4 className="font-medium text-red-900">
                  ⚠️ Corrections requises avant de continuer
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  Des erreurs méthodologiques doivent être corrigées pour assurer 
                  la conformité EBIOS RM et la qualité de l'analyse de risque.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EbiosMethodologyValidator;
