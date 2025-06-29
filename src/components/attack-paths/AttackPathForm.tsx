import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import { Info, Network, Target, AlertTriangle, Clock, Shield, Users } from 'lucide-react';
import type { AttackPath, Stakeholder } from '@/types/ebios';
import AIFieldSuggestion, { useAISuggestions } from '@/components/ai/AIFieldSuggestion';
import { cn } from '@/lib/utils';

interface AttackPathFormProps {
  onSubmit: (data: Partial<AttackPath>) => void;
  initialData?: Partial<AttackPath>;
  stakeholders?: Stakeholder[]; // Liste des parties prenantes disponibles
  isAccessImport?: boolean;
  onCancel?: () => void;
}

const AttackPathForm: React.FC<AttackPathFormProps> = ({ 
  onSubmit, 
  initialData,
  stakeholders = [],
  isAccessImport = false,
  onCancel
}) => {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      ...initialData,
      isDirect: initialData?.isDirect ?? false
    },
  });

  const [complexityAnalysis, setComplexityAnalysis] = useState<string>('');
  const [executionTimeEstimate, setExecutionTimeEstimate] = useState<string>('');
  
  const watchedName = watch('name');
  const watchedDescription = watch('description');
  const watchedDifficulty = watch('difficulty');
  const watchedIsDirect = watch('isDirect');

  // 🆕 Suggestions IA pour la description
  const { suggestions, isLoading, refresh } = useAISuggestions(
    'description',
    { name: watchedName, isDirect: watchedIsDirect },
    [watchedName, watchedIsDirect]
  );

  // 🆕 Analyse de complexité IA
  useEffect(() => {
    if (watchedName && watchedDescription && watchedDifficulty) {
      // Simulation - à remplacer par appel API
      const analysis = analyzePathComplexity(
        watchedName,
        watchedDescription,
        Number(watchedDifficulty),
        watchedIsDirect
      );
      setComplexityAnalysis(analysis.complexity);
      setExecutionTimeEstimate(analysis.timeEstimate);
    }
  }, [watchedName, watchedDescription, watchedDifficulty, watchedIsDirect]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      
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
                Les références textuelles seront préservées.
                L'IA analysera la complexité et suggérera des contre-mesures.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* 🆕 Type d'attaque (direct vs écosystème) */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register('isDirect')}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-900">
                Attaque directe
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Cochez si l'attaque est menée directement par la source de risque, 
                sans passer par l'écosystème (parties prenantes)
              </p>
            </div>
            <Target className={cn(
              "h-5 w-5",
              watchedIsDirect ? "text-red-500" : "text-gray-400"
            )} />
          </label>
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nom du chemin d'attaque
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Le nom est requis' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder={watchedIsDirect 
              ? "Ex: Attaque frontale sur l'infrastructure..." 
              : "Ex: Compromission via fournisseur tiers..."
            }
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* 🆕 Références Access */}
        {isAccessImport && (
          <>
            <div>
              <label htmlFor="sourceRisqueNom" className="block text-sm font-medium text-gray-700">
                Source de risque (référence Access)
              </label>
              <input
                type="text"
                id="sourceRisqueNom"
                {...register('sourceRisqueNom')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Nom de la source de risque dans Access"
              />
            </div>

            <div>
              <label htmlFor="objectifViseNom" className="block text-sm font-medium text-gray-700">
                Objectif visé (référence Access)
              </label>
              <input
                type="text"
                id="objectifViseNom"
                {...register('objectifViseNom')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Valeur métier ou bien support ciblé"
              />
            </div>
          </>
        )}

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description du mode opératoire
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description', { required: 'La description est requise' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Décrivez les étapes principales du chemin d'attaque..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
          
          {/* 🆕 Suggestions IA */}
          <AIFieldSuggestion
            fieldName="mode opératoire"
            fieldType="textarea"
            suggestions={suggestions}
            onApply={(value) => setValue('description', value)}
            onRefresh={refresh}
            isLoading={isLoading}
          />
        </div>

        {/* 🆕 Sélection stakeholder (seulement si pas attaque directe) */}
        {!watchedIsDirect && (
          <div>
            <label htmlFor="stakeholderId" className="block text-sm font-medium text-gray-700">
              <Users className="inline h-4 w-4 mr-1" />
              Partie prenante exploitée
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              id="stakeholderId"
              {...register('stakeholderId', { 
                required: !watchedIsDirect ? 'La partie prenante est requise pour une attaque via l\'écosystème' : false 
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Sélectionner une partie prenante</option>
              {stakeholders.map((stakeholder) => (
                <option key={stakeholder.id} value={stakeholder.id}>
                  {stakeholder.name} ({stakeholder.type})
                </option>
              ))}
            </select>
            {errors.stakeholderId && (
              <p className="mt-1 text-sm text-red-600">{errors.stakeholderId.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Par quelle partie prenante l'attaquant passe-t-il pour atteindre sa cible ?
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
              Difficulté technique
            </label>
            <select
              id="difficulty"
              {...register('difficulty', { required: 'La difficulté est requise' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Évaluer la difficulté</option>
              <option value="1">1 - Triviale</option>
              <option value="2">2 - Faible</option>
              <option value="3">3 - Moyenne</option>
              <option value="4">4 - Élevée</option>
            </select>
            {errors.difficulty && (
              <p className="mt-1 text-sm text-red-600">{errors.difficulty.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="successProbability" className="block text-sm font-medium text-gray-700">
              Probabilité de succès
            </label>
            <select
              id="successProbability"
              {...register('successProbability', { required: 'La probabilité est requise' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Évaluer la probabilité</option>
              <option value="1">1 - Très faible</option>
              <option value="2">2 - Faible</option>
              <option value="3">3 - Moyenne</option>
              <option value="4">4 - Élevée</option>
            </select>
            {errors.successProbability && (
              <p className="mt-1 text-sm text-red-600">{errors.successProbability.message}</p>
            )}
          </div>
        </div>

        {/* 🆕 Prérequis */}
        <div>
          <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700">
            <AlertTriangle className="inline h-4 w-4 mr-1" />
            Prérequis et conditions
          </label>
          <textarea
            id="prerequisites"
            rows={2}
            {...register('prerequisites')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Conditions nécessaires pour que cette attaque soit possible..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Ex: Accès physique, compte compromis, vulnérabilité non corrigée...
          </p>
        </div>

        {/* 🆕 Indicateurs de compromission */}
        <div>
          <label htmlFor="indicators" className="block text-sm font-medium text-gray-700">
            Indicateurs de compromission (IoC)
          </label>
          <textarea
            id="indicators"
            rows={2}
            {...register('indicators')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Signes observables de cette attaque..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Logs suspects, comportements anormaux, artefacts...
          </p>
        </div>
      </div>

      {/* 🆕 Analyse IA de complexité */}
      {complexityAnalysis && (
        <div className="rounded-md bg-purple-50 p-4">
          <div className="flex">
            <Network className="h-5 w-5 text-purple-400 flex-shrink-0" />
            <div className="ml-3 space-y-2">
              <h3 className="text-sm font-medium text-purple-800">
                Analyse IA du chemin d'attaque
              </h3>
              <p className="text-sm text-purple-700">{complexityAnalysis}</p>
              
              {executionTimeEstimate && (
                <div className="flex items-center space-x-2 text-sm text-purple-600">
                  <Clock className="h-4 w-4" />
                  <span>Temps estimé : {executionTimeEstimate}</span>
                </div>
              )}
              
              {watchedDifficulty && Number(watchedDifficulty) <= 2 && (
                <div className="mt-2 p-2 bg-red-100 rounded-md">
                  <p className="text-xs text-red-800">
                    ⚠️ Attention : Ce chemin d'attaque est relativement simple à exécuter. 
                    Priorisez les contre-mesures.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🆕 Contre-mesures suggérées */}
      {watchedName && watchedDescription && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <Shield className="h-5 w-5 text-green-400 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Contre-mesures suggérées par l'IA
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-green-700">
                {generateCountermeasures(watchedIsDirect, watchedDifficulty?.toString()).map((measure, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>{measure}</span>
                  </li>
                ))}
              </ul>
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
          {initialData ? 'Mettre à jour' : 'Créer le chemin d\'attaque'}
        </Button>
      </div>
    </form>
  );
};

export default AttackPathForm;

// 🆕 Fonction d'analyse de complexité (simulation)
function analyzePathComplexity(
  name: string, 
  description: string, 
  difficulty: number,
  isDirect: boolean
): { complexity: string; timeEstimate: string } {
  // Simulation - à remplacer par appel API
  
  let complexity = '';
  let timeEstimate = '';
  
  if (isDirect) {
    complexity = "Attaque directe nécessitant des ressources importantes. ";
    if (difficulty <= 2) {
      complexity += "Méthode connue et documentée, outils disponibles publiquement. ";
      timeEstimate = "Quelques heures à quelques jours";
    } else {
      complexity += "Techniques avancées requises, développement d'outils spécifiques. ";
      timeEstimate = "Plusieurs semaines à plusieurs mois";
    }
  } else {
    complexity = "Attaque indirecte via l'écosystème. ";
    complexity += "Nécessite une phase de reconnaissance et de compromission initiale. ";
    timeEstimate = difficulty <= 2 ? "1-2 semaines" : "Plusieurs mois";
  }
  
  const keywords = description.toLowerCase();
  if (keywords.includes('phishing') || keywords.includes('social')) {
    complexity += "Composante d'ingénierie sociale identifiée. ";
  }
  if (keywords.includes('zero-day') || keywords.includes('0-day')) {
    complexity += "Exploitation de vulnérabilité inconnue probable. ";
    timeEstimate = "Variable selon la cible";
  }
  
  return { complexity, timeEstimate };
}

// 🆕 Génération de contre-mesures (simulation)
function generateCountermeasures(isDirect: boolean, difficulty: string | undefined): string[] {
  const measures: string[] = [];
  
  if (isDirect) {
    measures.push("Renforcer la segmentation réseau et les pare-feu périmétriques");
    measures.push("Implémenter une détection d'intrusion (IDS/IPS) avancée");
    measures.push("Durcir les configurations des systèmes exposés");
  } else {
    measures.push("Former les parties prenantes aux risques de sécurité");
    measures.push("Établir des clauses de sécurité contractuelles");
    measures.push("Auditer régulièrement la sécurité des tiers");
  }
  
  if (difficulty && Number(difficulty) <= 2) {
    measures.push("Surveillance renforcée - attaque facilement réalisable");
    measures.push("Tests d'intrusion réguliers sur ce vecteur");
  }
  
  measures.push("Mettre en place une réponse à incident spécifique");
  
  return measures;
}