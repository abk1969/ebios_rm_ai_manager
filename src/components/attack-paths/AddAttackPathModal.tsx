import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { LikelihoodScale } from '@/types/ebios';

interface AttackPathStep {
  id: string;
  name: string;
  description: string;
  techniques: string[];
  duration?: string;
  detectability?: LikelihoodScale;
}

interface AttackPath {
  id: string;
  name: string;
  description: string;
  feasibility: LikelihoodScale;
  detectability: LikelihoodScale;
  steps: AttackPathStep[];
  techniques: string[];
  stakeholderId?: string;
  supportingAssetIds?: string[];
}

interface AddAttackPathModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (path: Omit<AttackPath, 'id'>) => void;
  scenarioName: string;
}

const MITRE_TECHNIQUES = [
  'T1566 - Phishing',
  'T1078 - Valid Accounts',
  'T1055 - Process Injection',
  'T1059 - Command and Scripting Interpreter',
  'T1190 - Exploit Public-Facing Application',
  'T1021 - Remote Services',
  'T1082 - System Information Discovery',
  'T1083 - File and Directory Discovery',
  'T1003 - OS Credential Dumping',
  'T1105 - Ingress Tool Transfer',
  'T1027 - Obfuscated Files or Information',
  'T1041 - Exfiltration Over C2 Channel'
];

const AddAttackPathModal: React.FC<AddAttackPathModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  scenarioName
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    feasibility: 2 as LikelihoodScale,
    detectability: 2 as LikelihoodScale
  });

  const [steps, setSteps] = useState<Omit<AttackPathStep, 'id'>[]>([
    {
      name: '',
      description: '',
      techniques: [],
      duration: '',
      detectability: 2
    }
  ]);

  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Le nom du chemin d\'attaque est requis');
      return;
    }

    const attackPath: Omit<AttackPath, 'id'> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      feasibility: formData.feasibility,
      detectability: formData.detectability,
      steps: steps.map((step, index) => ({
        id: `step-${index}`,
        ...step
      })),
      techniques: selectedTechniques,
      supportingAssetIds: []
    };

    onSubmit(attackPath);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      feasibility: 2,
      detectability: 2
    });
    setSteps([{
      name: '',
      description: '',
      techniques: [],
      duration: '',
      detectability: 2
    }]);
    setSelectedTechniques([]);
  };

  const addStep = () => {
    setSteps([...steps, {
      name: '',
      description: '',
      techniques: [],
      duration: '',
      detectability: 2
    }]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const updateStep = (index: number, field: keyof Omit<AttackPathStep, 'id'>, value: any) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const addTechnique = (technique: string) => {
    if (!selectedTechniques.includes(technique)) {
      setSelectedTechniques([...selectedTechniques, technique]);
    }
  };

  const removeTechnique = (technique: string) => {
    setSelectedTechniques(selectedTechniques.filter(t => t !== technique));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Créer un Chemin d'Attaque
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Définir un chemin d'attaque détaillé pour le scénario : <strong>{scenarioName}</strong>
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Informations de base */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom du Chemin d'Attaque</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="ex: Phishing suivi d'escalade de privilèges"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="feasibility">Faisabilité (1=Facile, 4=Difficile)</Label>
                      <Select
                        value={formData.feasibility.toString()}
                        onValueChange={(value) => setFormData({ ...formData, feasibility: parseInt(value) as LikelihoodScale })}
                      >
                        <option value="1">1 - Très facile</option>
                        <option value="2">2 - Facile</option>
                        <option value="3">3 - Difficile</option>
                        <option value="4">4 - Très difficile</option>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Décrivez l'objectif et le contexte de ce chemin d'attaque..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="detectability">Détectabilité (1=Facile à détecter, 4=Furtif)</Label>
                      <Select
                        value={formData.detectability.toString()}
                        onValueChange={(value) => setFormData({ ...formData, detectability: parseInt(value) as LikelihoodScale })}
                      >
                        <option value="1">1 - Très détectable</option>
                        <option value="2">2 - Détectable</option>
                        <option value="3">3 - Peu détectable</option>
                        <option value="4">4 - Furtif</option>
                      </Select>
                    </div>
                  </div>

                  {/* Techniques MITRE ATT&CK */}
                  <div>
                    <Label>Techniques MITRE ATT&CK</Label>
                    <div className="mt-2">
                      <Select
                        onValueChange={(value) => addTechnique(value)}
                        value=""
                      >
                        <option value="" disabled>Sélectionner une technique...</option>
                        {MITRE_TECHNIQUES.filter(t => !selectedTechniques.includes(t)).map((technique) => (
                          <option key={technique} value={technique}>
                            {technique}
                          </option>
                        ))}
                      </Select>
                      
                      {selectedTechniques.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedTechniques.map((technique) => (
                            <span
                              key={technique}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                            >
                              {technique}
                              <button
                                type="button"
                                onClick={() => removeTechnique(technique)}
                                className="ml-1 text-blue-600 hover:text-blue-800"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Étapes du chemin d'attaque */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label>Étapes du Chemin d'Attaque</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addStep}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter Étape
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {steps.map((step, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-900">Étape {index + 1}</h4>
                            {steps.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeStep(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor={`step-name-${index}`}>Nom de l'étape</Label>
                              <Input
                                id={`step-name-${index}`}
                                value={step.name}
                                onChange={(e) => updateStep(index, 'name', e.target.value)}
                                placeholder="ex: Envoi d'email de phishing"
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor={`step-duration-${index}`}>Durée estimée</Label>
                              <Input
                                id={`step-duration-${index}`}
                                value={step.duration || ''}
                                onChange={(e) => updateStep(index, 'duration', e.target.value)}
                                placeholder="ex: 1 heure, 1 jour"
                              />
                            </div>
                          </div>

                          <div className="mt-3">
                            <Label htmlFor={`step-description-${index}`}>Description</Label>
                            <Textarea
                              id={`step-description-${index}`}
                              value={step.description}
                              onChange={(e) => updateStep(index, 'description', e.target.value)}
                              placeholder="Détaillez cette étape de l'attaque..."
                              rows={2}
                            />
                          </div>

                          <div className="mt-3">
                            <Label>Détectabilité de cette étape</Label>
                            <Select
                              value={step.detectability?.toString() || '2'}
                              onValueChange={(value) => updateStep(index, 'detectability', parseInt(value) as LikelihoodScale)}
                            >
                              <option value="1">1 - Très détectable</option>
                              <option value="2">2 - Détectable</option>
                              <option value="3">3 - Peu détectable</option>
                              <option value="4">4 - Furtif</option>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <Button
              type="submit"
              onClick={handleSubmit}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
            >
              Créer le Chemin d'Attaque
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Annuler
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAttackPathModal;