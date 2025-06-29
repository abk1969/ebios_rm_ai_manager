import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mission } from '@/types/ebios';

interface SimpleMissionFormProps {
  onSubmit: (data: Partial<Mission>) => void;
  initialData?: Partial<Mission>;
}

// Secteurs simplifiés pour la création manuelle
const simpleSectors = [
  'Santé',
  'Finance - Banque',
  'Finance - Assurance',
  'Énergie',
  'Transport',
  'Télécommunications',
  'Administration publique',
  'Éducation',
  'Industrie',
  'Commerce',
  'Services numériques',
  'Autre'
];

// Tailles d'organisation simplifiées
const simpleOrganizationSizes = [
  { value: 'small', label: 'Petite (< 50 employés)' },
  { value: 'medium', label: 'Moyenne (50-250 employés)' },
  { value: 'large', label: 'Grande (250-5000 employés)' },
  { value: 'enterprise', label: 'Très grande (> 5000 employés)' }
];

const SimpleMissionForm: React.FC<SimpleMissionFormProps> = ({ onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<Partial<Mission>>({
    defaultValues: initialData,
  });

  const [selectedSector, setSelectedSector] = React.useState(initialData?.organizationContext?.sector || '');
  const [selectedSize, setSelectedSize] = React.useState(initialData?.organizationContext?.size || '');

  const handleFormSubmit = (formData: Partial<Mission>) => {
    // Enrichir les données avec le contexte organisationnel minimal
    const enrichedData: Partial<Mission> = {
      ...formData,
      organizationContext: {
        organizationType: 'private',
        sector: selectedSector,
        size: selectedSize as 'small' | 'medium' | 'large' | 'enterprise',
        regulatoryRequirements: [],
        securityObjectives: [],
        constraints: []
      },
      scope: {
        boundaries: 'Organisationnel',
        inclusions: [],
        exclusions: [],
        timeFrame: {
          start: new Date().toISOString(),
          end: formData.dueDate ? new Date(formData.dueDate).toISOString() : new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        geographicalScope: []
      }
    };

    onSubmit(enrichedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Nom de la mission */}
      <div>
        <Label htmlFor="name">Nom de la mission *</Label>
        <Input
          id="name"
          {...register('name', { required: 'Le nom de la mission est requis' })}
          placeholder="Ex: Mission EBIOS RM - Hôpital Central"
          className="mt-1"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description', { required: 'La description est requise' })}
          placeholder="Décrivez brièvement les objectifs et le contexte de cette mission EBIOS RM"
          rows={3}
          className="mt-1"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Secteur d'activité */}
      <div>
        <Label htmlFor="sector">Secteur d'activité *</Label>
        <Select value={selectedSector} onValueChange={setSelectedSector}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Sélectionnez votre secteur" />
          </SelectTrigger>
          <SelectContent>
            {simpleSectors.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!selectedSector && (
          <p className="mt-1 text-sm text-red-600">Le secteur d'activité est requis</p>
        )}
      </div>

      {/* Taille de l'organisation */}
      <div>
        <Label htmlFor="organizationSize">Taille de l'organisation *</Label>
        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Sélectionnez la taille" />
          </SelectTrigger>
          <SelectContent>
            {simpleOrganizationSizes.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!selectedSize && (
          <p className="mt-1 text-sm text-red-600">La taille de l'organisation est requise</p>
        )}
      </div>

      {/* Date d'échéance */}
      <div>
        <Label htmlFor="dueDate">Date d'échéance *</Label>
        <Input
          id="dueDate"
          type="date"
          {...register('dueDate', { required: 'La date d\'échéance est requise' })}
          min={new Date().toISOString().split('T')[0]}
          className="mt-1"
        />
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
        )}
      </div>

      {/* Priorité */}
      <div>
        <Label htmlFor="priority">Priorité</Label>
        <Select defaultValue={initialData?.priority || 'medium'} onValueChange={(value) => setValue('priority', value as 'low' | 'medium' | 'high' | 'critical')}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Sélectionnez la priorité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Basse</SelectItem>
            <SelectItem value="medium">Moyenne</SelectItem>
            <SelectItem value="high">Haute</SelectItem>
            <SelectItem value="critical">Critique</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Note d'information */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>💡 Information :</strong> Ce formulaire simplifié permet de créer rapidement une mission. 
          Pour une configuration avancée avec aide IA contextuelle, utilisez le 
          <strong> Générateur Automatique</strong> depuis le menu principal.
        </p>
      </div>

      {/* Boutons */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="submit"
          disabled={!selectedSector || !selectedSize}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {initialData ? 'Mettre à jour' : 'Créer la Mission'}
        </Button>
      </div>
    </form>
  );
};

export default SimpleMissionForm;
