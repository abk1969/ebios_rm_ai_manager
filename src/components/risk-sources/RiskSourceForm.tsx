import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import { Info, Sparkles, Brain, Shield, Target } from 'lucide-react';
import type { RiskSource } from '@/types/ebios';
import { accessCompatibilityService } from '@/services/accessCompatibility';
import AIFieldSuggestion, { useAISuggestions } from '@/components/ai/AIFieldSuggestion';

interface RiskSourceFormProps {
  onSubmit: (data: Partial<RiskSource>) => void;
  initialData?: Partial<RiskSource>;
  isAccessImport?: boolean;
  onCancel?: () => void;
}

const RiskSourceForm: React.FC<RiskSourceFormProps> = ({ 
  onSubmit, 
  initialData,
  isAccessImport = false,
  onCancel
}) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData,
  });

  const [showCategoryInference, setShowCategoryInference] = useState(false);
  const [inferredCategory, setInferredCategory] = useState<string>('');
  const [threatProfile, setThreatProfile] = useState<string>('');
  
  const watchedName = watch('name');
  const watchedDescription = watch('description');

  // 🆕 Suggestions IA pour la description
  const { suggestions, isLoading, refresh } = useAISuggestions(
    'description',
    { name: watchedName },
    [watchedName]
  );

  // 🆕 Inférer la catégorie depuis le nom/description
  useEffect(() => {
    if (isAccessImport && !initialData?.category && (watchedName || watchedDescription)) {
      const fullText = `${watchedName || ''} ${watchedDescription || ''}`;
      const inferred = accessCompatibilityService.inferRiskSourceCategory(fullText);
      if (inferred) {
        setInferredCategory(inferred);
        setShowCategoryInference(true);
      }
    }
  }, [isAccessImport, watchedName, watchedDescription, initialData]);

  // 🆕 Générer le profil de menace IA
  useEffect(() => {
    if (watchedName && watchedDescription) {
      // Simulation - à remplacer par appel API
      const profile = generateThreatProfile(watchedName, watchedDescription);
      setThreatProfile(profile);
    }
  }, [watchedName, watchedDescription]);

  const applyCategoryInference = () => {
    setValue('category', inferredCategory as RiskSource['category']);
    setValue('categoryAuto', true);
    setShowCategoryInference(false);
  };

  const convertPertinenceForDisplay = (value: number | undefined): number => {
    if (!value) return 1;
    // Si mode Access, afficher 1-3
    if (isAccessImport) {
      return Math.ceil(value * 3 / 5); // Convertir 1-5 vers 1-3
    }
    return value;
  };

  const convertPertinenceForSubmit = (value: number): RiskSource['pertinence'] => {
    // Si mode Access, convertir 1-3 vers 1-5
    if (isAccessImport) {
      return Math.round(value * 5 / 3) as RiskSource['pertinence'];
    }
    return value as RiskSource['pertinence'];
  };

  return (
    <form onSubmit={handleSubmit((data) => {
      // Convertir la pertinence si nécessaire
      if (data.pertinence) {
        data.pertinence = convertPertinenceForSubmit(data.pertinence);
      }
      onSubmit(data);
    })} className="space-y-6">
      
      {/* 🆕 Mode Access */}
      {isAccessImport && (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Mode Import Access</h3>
              <div className="mt-2 text-sm text-blue-700">
                La catégorie sera déduite automatiquement si possible.
                La pertinence utilise l'échelle Access (1-3).
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom de la source de risque
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Le nom est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder={isAccessImport ? "Ex: Concurrent malveillant, État-nation..." : undefined}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description', { required: 'La description est requise' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Décrivez les capacités, motivations et objectifs de cette source de risque..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
          
          {/* 🆕 Suggestions IA */}
          <AIFieldSuggestion
            fieldName="description"
            fieldType="textarea"
            suggestions={suggestions}
            onApply={(value) => setValue('description', value)}
            onRefresh={refresh}
            isLoading={isLoading}
          />
        </div>

        {/* 🆕 Inférence de catégorie */}
        {showCategoryInference && inferredCategory && (
          <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4">
            <div className="flex">
              <Brain className="h-5 w-5 text-yellow-400 flex-shrink-0" />
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Catégorie déduite par l'IA
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  Basé sur l'analyse, nous suggérons : 
                  <span className="font-medium ml-1">
                    {inferredCategory === 'state' && 'État/Nation'}
                    {inferredCategory === 'cybercriminal' && 'Cybercriminel'}
                    {inferredCategory === 'activist' && 'Activiste'}
                    {inferredCategory === 'terrorist' && 'Terroriste'}
                    {inferredCategory === 'insider' && 'Menace interne'}
                    {inferredCategory === 'competitor' && 'Concurrent'}
                    {inferredCategory === 'natural' && 'Naturel'}
                  </span>
                </div>
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={applyCategoryInference}
                  >
                    Appliquer la déduction
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Catégorie
            {isAccessImport && (
              <span className="ml-1 text-xs text-gray-500">(déduite automatiquement si possible)</span>
            )}
          </label>
          <select
            id="category"
            {...register('category', { required: !isAccessImport })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="state">État/Nation</option>
            <option value="cybercriminal">Cybercriminel</option>
            <option value="activist">Activiste</option>
            <option value="terrorist">Terroriste</option>
            <option value="insider">Menace interne</option>
            <option value="competitor">Concurrent</option>
            <option value="natural">Catastrophe naturelle</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* 🆕 Évaluation de la source (Atelier 2) */}
        <div className="space-y-3 rounded-lg border border-gray-200 p-4">
          <h4 className="flex items-center text-sm font-medium text-gray-900">
            <Target className="mr-2 h-4 w-4" />
            Évaluation de la source de risque
          </h4>
          
          <div>
            <label htmlFor="motivation" className="block text-sm font-medium text-gray-700">
              Motivation (1-4)
            </label>
            <select
              id="motivation"
              {...register('motivation')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Évaluer la motivation</option>
              <option value="1">1 - Faible</option>
              <option value="2">2 - Modérée</option>
              <option value="3">3 - Forte</option>
              <option value="4">4 - Très forte</option>
            </select>
          </div>

          <div>
            <label htmlFor="resources" className="block text-sm font-medium text-gray-700">
              Ressources (1-4)
            </label>
            <select
              id="resources"
              {...register('resources')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Évaluer les ressources</option>
              <option value="1">1 - Limitées</option>
              <option value="2">2 - Moyennes</option>
              <option value="3">3 - Importantes</option>
              <option value="4">4 - Illimitées</option>
            </select>
          </div>

          <div>
            <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
              Expertise (1-4)
            </label>
            <select
              id="expertise"
              {...register('expertise')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Évaluer l'expertise</option>
              <option value="1">1 - Amateur</option>
              <option value="2">2 - Intermédiaire</option>
              <option value="3">3 - Expert</option>
              <option value="4">4 - Élite</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="pertinence" className="block text-sm font-medium text-gray-700">
            Pertinence {isAccessImport ? '(1-3)' : '(1-5)'}
          </label>
          <input
            type="number"
            id="pertinence"
            min="1"
            max={isAccessImport ? 3 : 5}
            defaultValue={convertPertinenceForDisplay(initialData?.pertinence)}
            {...register('pertinence', { 
              required: 'La pertinence est requise',
              min: { value: 1, message: 'Valeur minimale : 1' },
              max: { value: isAccessImport ? 3 : 5, message: `Valeur maximale : ${isAccessImport ? 3 : 5}` }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.pertinence && (
            <p className="mt-1 text-sm text-red-600">{errors.pertinence.message}</p>
          )}
          {isAccessImport && (
            <p className="mt-1 text-xs text-gray-500">
              Échelle Access : 1 (faible) - 2 (moyenne) - 3 (élevée)
            </p>
          )}
        </div>
      </div>

      {/* 🆕 Profil de menace IA */}
      {threatProfile && (
        <div className="rounded-md bg-purple-50 p-4">
          <div className="flex">
            <Shield className="h-5 w-5 text-purple-400 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-purple-800">
                Profil de menace IA
              </h3>
              <p className="mt-2 text-sm text-purple-700">
                {threatProfile}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit">
          {initialData ? 'Mettre à jour' : 'Créer la source de risque'}
        </Button>
      </div>
    </form>
  );
};

export default RiskSourceForm;

// 🆕 Fonction temporaire de génération de profil
function generateThreatProfile(name: string, description: string): string {
  // Simulation - à remplacer par appel API
  const keywords = (name + ' ' + description).toLowerCase();
  
  if (keywords.includes('état') || keywords.includes('nation')) {
    return "Acteur étatique avec capacités avancées APT. Objectifs : espionnage, sabotage d'infrastructures critiques. TTPs sophistiqués.";
  } else if (keywords.includes('concurrent')) {
    return "Espionnage industriel probable. Cible : propriété intellectuelle, secrets commerciaux. Moyens : insiders, phishing ciblé.";
  } else if (keywords.includes('criminel') || keywords.includes('ransomware')) {
    return "Motivation financière. Techniques : ransomware, vol de données. Cibles opportunistes selon ROI.";
  } else if (keywords.includes('hacktivist')) {
    return "Motivation idéologique. Cibles symboliques. Techniques : defacement, DDoS, leak de données.";
  }
  
  return "Profil en cours d'analyse. L'IA évalue les capacités et motivations probables.";
}