import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/button';
import { Info, Sparkles, AlertCircle, Building2 } from 'lucide-react';
import type { BusinessValue } from '../../types/ebios';
import { accessCompatibilityService } from '../../services/accessCompatibility';

interface BusinessValueFormProps {
  onSubmit: (data: Partial<BusinessValue>) => void;
  initialData?: Partial<BusinessValue>;
  isAccessImport?: boolean; // 🆕 Mode import Access
  onCancel?: () => void;
}

const BusinessValueForm: React.FC<BusinessValueFormProps> = ({ 
  onSubmit, 
  initialData,
  isAccessImport = false,
  onCancel
}) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData,
  });

  const [showCategorySuggestion, setShowCategorySuggestion] = useState(false);
  const [aiCategorySuggestion, setAiCategorySuggestion] = useState<BusinessValue['category'] | undefined>();
  const [coherenceScore, setCoherenceScore] = useState<number>(0);
  
  const watchedNature = watch('natureValeurMetier');
  const watchedName = watch('name');
  const watchedDescription = watch('description');

  // 🆕 Suggérer automatiquement la catégorie basée sur la nature Access
  useEffect(() => {
    if (isAccessImport && watchedNature && !initialData?.category) {
      const suggestedCategory = accessCompatibilityService.mapNatureToCategory(watchedNature);
      setAiCategorySuggestion(suggestedCategory);
      setShowCategorySuggestion(true);
    }
  }, [isAccessImport, watchedNature, initialData]);

  // 🆕 Calculer le score de cohérence en temps réel
  useEffect(() => {
    if (watchedName && watchedDescription) {
      // Simulation d'un calcul de cohérence
      const nameLength = watchedName.length;
      const descLength = watchedDescription.length;
      const score = Math.min((nameLength * 5 + descLength) / 200, 1);
      setCoherenceScore(score);
    }
  }, [watchedName, watchedDescription]);

  const applyCategorySuggestion = () => {
    if (aiCategorySuggestion) {
      setValue('category', aiCategorySuggestion);
    }
    setShowCategorySuggestion(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 🆕 Indicateur mode Access */}
      {isAccessImport && (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Mode Import Access</h3>
              <div className="mt-2 text-sm text-blue-700">
                La catégorie sera déduite automatiquement de la nature. 
                L'IA enrichira les données manquantes.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom de la valeur métier
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Le nom est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* 🆕 Nature Access si mode import */}
        {isAccessImport && (
          <div>
            <label htmlFor="natureValeurMetier" className="block text-sm font-medium text-gray-700">
              Nature (Access)
              <span className="ml-1 text-xs text-gray-500">Spécifique EBIOS RM</span>
            </label>
            <select
              id="natureValeurMetier"
              {...register('natureValeurMetier')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Sélectionner une nature</option>
              <option value="PROCESSUS">PROCESSUS</option>
              <option value="INFORMATION">INFORMATION</option>
            </select>
          </div>
        )}

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            {...register('description', { required: 'La description est requise' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Décrivez cette valeur métier et son importance pour l'organisation..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* 🆕 Responsable si mode Access */}
        {isAccessImport && (
          <div>
            <label htmlFor="responsableEntite" className="block text-sm font-medium text-gray-700">
              <Building2 className="inline h-4 w-4 mr-1" />
              Entité/Personne responsable
            </label>
            <input
              type="text"
              id="responsableEntite"
              {...register('responsableEntite')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Ex: Responsable production, DSI..."
            />
          </div>
        )}

        {/* 🆕 Suggestion IA pour la catégorie */}
        {showCategorySuggestion && aiCategorySuggestion && (
          <div className="rounded-md bg-yellow-50 border border-yellow-200 p-4">
            <div className="flex">
              <Sparkles className="h-5 w-5 text-yellow-400 flex-shrink-0" />
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Suggestion IA pour la catégorie
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  Basé sur la nature "{watchedNature}", nous suggérons : 
                  <span className="font-medium ml-1">
                    {aiCategorySuggestion === 'primary' && 'Primaire (cœur de métier)'}
                    {aiCategorySuggestion === 'support' && 'Support'}
                    {aiCategorySuggestion === 'management' && 'Management'}
                  </span>
                </div>
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={applyCategorySuggestion}
                  >
                    Appliquer la suggestion
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
              <span className="ml-1 text-xs text-gray-500">(déduite automatiquement si nature définie)</span>
            )}
          </label>
          <select
            id="category"
            {...register('category', { required: 'La catégorie est requise' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="primary">Primaire (cœur de métier)</option>
            <option value="support">Support</option>
            <option value="management">Management</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priorité
          </label>
          <select
            id="priority"
            {...register('priority', { required: 'La priorité est requise' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Sélectionner une priorité</option>
            <option value="1">1 - Faible</option>
            <option value="2">2 - Moyenne</option>
            <option value="3">3 - Élevée</option>
            <option value="4">4 - Critique</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="criticalityLevel" className="block text-sm font-medium text-gray-700">
            Niveau de criticité
          </label>
          <select
            id="criticalityLevel"
            {...register('criticalityLevel', { required: 'Le niveau de criticité est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Sélectionner un niveau</option>
            <option value="useful">Utile</option>
            <option value="important">Important</option>
            <option value="essential">Essentiel</option>
          </select>
          {errors.criticalityLevel && (
            <p className="mt-1 text-sm text-red-600">{errors.criticalityLevel.message}</p>
          )}
        </div>
      </div>

      {/* 🆕 Indicateur de cohérence IA */}
      {coherenceScore > 0 && (
        <div className="rounded-md bg-green-50 p-3">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-green-400 mr-2" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-800">
                  Score de cohérence IA
                </span>
                <span className="text-sm font-medium text-green-900">
                  {Math.round(coherenceScore * 100)}%
                </span>
              </div>
              <div className="mt-1 bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${coherenceScore * 100}%` }}
                />
              </div>
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
          {initialData ? 'Mettre à jour' : 'Créer la valeur métier'}
        </Button>
      </div>
    </form>
  );
};

export default BusinessValueForm;