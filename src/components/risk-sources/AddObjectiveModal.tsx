import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { LikelihoodScale } from '@/types/ebios';

interface AddObjectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    targetType: 'business_value' | 'supporting_asset' | 'stakeholder';
    targetId: string;
    priority: LikelihoodScale;
  }) => void;
  missionId: string;
  riskSourceName: string;
}

const AddObjectiveModal: React.FC<AddObjectiveModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  missionId,
  riskSourceName
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetType: 'business_value' as 'business_value' | 'supporting_asset' | 'stakeholder',
    targetId: 'default',
    priority: 2 as LikelihoodScale
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.description) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    onSubmit(formData);
    setFormData({
      name: '',
      description: '',
      targetType: 'business_value',
      targetId: 'default',
      priority: 2
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un Objectif</DialogTitle>
          <DialogDescription>
            Définir un objectif pour la source de risque "{riskSourceName}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-4 space-y-4">
          <div>
            <Label htmlFor="objective-name">Nom de l'objectif *</Label>
            <Input
              id="objective-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Compromettre la base de données clients"
            />
          </div>

          <div>
            <Label htmlFor="objective-description">Description *</Label>
            <Textarea
              id="objective-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez l'objectif détaillé de cette source de risque..."
            />
          </div>

          <div>
            <Label htmlFor="target-type">Type de cible</Label>
            <Select
              value={formData.targetType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, targetType: value as any }))}
            >
              <SelectValue placeholder="Sélectionner le type de cible" />
              <SelectItem value="business_value">Valeur métier</SelectItem>
              <SelectItem value="supporting_asset">Actif support</SelectItem>
              <SelectItem value="stakeholder">Partie prenante</SelectItem>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priorité</Label>
            <Select
              value={formData.priority.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: parseInt(value) as LikelihoodScale }))}
            >
              <SelectValue placeholder="Sélectionner la priorité" />
              <SelectItem value="1">1 - Très faible</SelectItem>
              <SelectItem value="2">2 - Faible</SelectItem>
              <SelectItem value="3">3 - Modérée</SelectItem>
              <SelectItem value="4">4 - Élevée</SelectItem>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Ajouter l'objectif
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddObjectiveModal; 