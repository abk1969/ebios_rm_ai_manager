import React, { useState } from 'react';
import { X } from 'lucide-react';
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

interface AddStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (step: Omit<AttackPathStep, 'id'>) => void;
  pathName: string;
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

const AddStepModal: React.FC<AddStepModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  pathName
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    detectability: 2 as LikelihoodScale
  });

  const [selectedTechniques, setSelectedTechniques] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Le nom de l\'étape est requis');
      return;
    }

    const step: Omit<AttackPathStep, 'id'> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      duration: formData.duration.trim(),
      detectability: formData.detectability,
      techniques: selectedTechniques
    };

    onSubmit(step);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      name: '',
      description: '',
      duration: '',
      detectability: 2
    });
    setSelectedTechniques([]);
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

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Ajouter une Étape
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Ajouter une nouvelle étape au chemin d'attaque : <strong>{pathName}</strong>
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Informations de base */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom de l'Étape</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="ex: Envoi d'email de phishing"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Durée Estimée</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="ex: 1 heure, 2 jours"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Décrivez en détail cette étape de l'attaque..."
                      rows={4}
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

                  {/* Techniques MITRE ATT&CK */}
                  <div>
                    <Label>Techniques MITRE ATT&CK pour cette étape</Label>
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
              Ajouter l'Étape
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

export default AddStepModal; 