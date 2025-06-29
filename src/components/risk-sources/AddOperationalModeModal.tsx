import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { LikelihoodScale } from '@/types/ebios';

interface AddOperationalModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    techniques: string[];
    difficulty: LikelihoodScale;
    detectability: LikelihoodScale;
    prerequisites: string[];
  }) => void;
  riskSourceName: string;
}

const AddOperationalModeModal: React.FC<AddOperationalModeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  riskSourceName
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    techniques: [] as string[],
    difficulty: 2 as LikelihoodScale,
    detectability: 2 as LikelihoodScale,
    prerequisites: [] as string[]
  });

  const [newTechnique, setNewTechnique] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');

  const handleSubmit = () => {
    if (!formData.name || !formData.description) {
      alert('Veuillez remplir tous les champs requis');
      return;
    }

    onSubmit(formData);
    setFormData({
      name: '',
      description: '',
      techniques: [],
      difficulty: 2,
      detectability: 2,
      prerequisites: []
    });
    setNewTechnique('');
    setNewPrerequisite('');
    onClose();
  };

  const addTechnique = () => {
    if (newTechnique.trim() && !formData.techniques.includes(newTechnique.trim())) {
      setFormData(prev => ({
        ...prev,
        techniques: [...prev.techniques, newTechnique.trim()]
      }));
      setNewTechnique('');
    }
  };

  const removeTechnique = (technique: string) => {
    setFormData(prev => ({
      ...prev,
      techniques: prev.techniques.filter(t => t !== technique)
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim() && !formData.prerequisites.includes(newPrerequisite.trim())) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (prerequisite: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(p => p !== prerequisite)
    }));
  };

  if (!isOpen) return null;

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un Mode Opératoire</DialogTitle>
          <DialogDescription>
            Définir un mode opératoire pour la source de risque "{riskSourceName}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
          <div>
            <Label htmlFor="mode-name">Nom du mode opératoire *</Label>
            <Input
              id="mode-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Attaque par déni de service"
            />
          </div>

          <div>
            <Label htmlFor="mode-description">Description *</Label>
            <Textarea
              id="mode-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez le mode opératoire détaillé..."
            />
          </div>

          <div>
            <Label>Techniques utilisées</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newTechnique}
                onChange={(e) => setNewTechnique(e.target.value)}
                placeholder="Ex: T1190 - Exploit Public-Facing Application"
                onKeyPress={(e) => e.key === 'Enter' && addTechnique()}
              />
              <Button onClick={addTechnique} type="button" size="sm">
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.techniques.map((technique, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {technique}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTechnique(technique)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulté d'exécution</Label>
            <Select
              value={formData.difficulty.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: parseInt(value) as LikelihoodScale }))}
            >
              <SelectValue placeholder="Sélectionner la difficulté" />
              <SelectItem value="1">1 - Très facile</SelectItem>
              <SelectItem value="2">2 - Facile</SelectItem>
              <SelectItem value="3">3 - Modérée</SelectItem>
              <SelectItem value="4">4 - Difficile</SelectItem>
            </Select>
          </div>

          <div>
            <Label htmlFor="detectability">Détectabilité</Label>
            <Select
              value={formData.detectability.toString()}
              onValueChange={(value) => setFormData(prev => ({ ...prev, detectability: parseInt(value) as LikelihoodScale }))}
            >
              <SelectValue placeholder="Sélectionner la détectabilité" />
              <SelectItem value="1">1 - Très difficile à détecter</SelectItem>
              <SelectItem value="2">2 - Difficile à détecter</SelectItem>
              <SelectItem value="3">3 - Modérément détectable</SelectItem>
              <SelectItem value="4">4 - Facilement détectable</SelectItem>
            </Select>
          </div>

          <div>
            <Label>Prérequis</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newPrerequisite}
                onChange={(e) => setNewPrerequisite(e.target.value)}
                placeholder="Ex: Accès réseau, Privilèges administrateur..."
                onKeyPress={(e) => e.key === 'Enter' && addPrerequisite()}
              />
              <Button onClick={addPrerequisite} type="button" size="sm">
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.prerequisites.map((prerequisite, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {prerequisite}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removePrerequisite(prerequisite)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Ajouter le mode opératoire
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddOperationalModeModal; 