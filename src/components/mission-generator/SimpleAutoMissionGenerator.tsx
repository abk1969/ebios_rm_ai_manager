/**
 * 🤖 GÉNÉRATEUR AUTOMATIQUE DE MISSIONS EBIOS RM - VERSION SIMPLIFIÉE
 * Interface simplifiée pour créer des missions complètes à partir du contexte métier
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Zap, FileText, Download, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AutoMissionGeneratorService, { MissionContext as ServiceMissionContext } from '@/services/ai/AutoMissionGeneratorService';

interface MissionContext {
  organizationName: string;
  sector: string;
  organizationSize: string;
  siComponents: string;
  criticalProcesses: string;
  regulations: string;
  specificRequirements: string;
}

interface GenerationProgress {
  step: string;
  progress: number;
  isComplete: boolean;
  missionId?: string;
  reports?: string[];
}

const SimpleAutoMissionGenerator: React.FC = () => {
  const [context, setContext] = useState<MissionContext>({
    organizationName: '',
    sector: '',
    organizationSize: '',
    siComponents: '',
    criticalProcesses: '',
    regulations: '',
    specificRequirements: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    step: '',
    progress: 0,
    isComplete: false
  });

  const generateMission = async () => {
    setIsGenerating(true);
    setGenerationProgress({ step: 'Initialisation...', progress: 0, isComplete: false });

    try {
      // Simulation du processus de génération
      const steps = [
        'Analyse du contexte métier...',
        'Génération des biens essentiels...',
        'Identification des sources de risque...',
        'Création des scénarios stratégiques...',
        'Développement des scénarios opérationnels...',
        'Définition des mesures de sécurité...',
        'Génération des rapports...',
        'Finalisation de la mission...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setGenerationProgress({
          step: steps[i],
          progress: ((i + 1) / steps.length) * 100,
          isComplete: false
        });
        
        // Simulation du temps de traitement
        await new Promise(resolve => setTimeout(resolve, 500 + (Date.now() % 500)));
      }

      // Conversion du contexte pour le service
      const serviceContext: ServiceMissionContext = {
        organizationName: context.organizationName,
        sector: context.sector,
        organizationSize: context.organizationSize,
        geographicScope: 'National',
        criticalityLevel: 'high',
        siComponents: context.siComponents.split(',').map(s => s.trim()).filter(s => s),
        mainTechnologies: ['Microsoft 365 / Office 365'],
        externalInterfaces: [],
        sensitiveData: ['Données personnelles'],
        criticalProcesses: context.criticalProcesses.split('\n').map(s => s.trim()).filter(s => s),
        stakeholders: ['Clients', 'Employés'],
        regulations: context.regulations.split(',').map(s => s.trim()).filter(s => s),
        financialStakes: 'Standard',
        securityMaturity: 'defined',
        pastIncidents: '',
        regulatoryConstraints: context.regulations.split(',').map(s => s.trim()).filter(s => s),
        securityBudget: '100k-500k',
        missionObjectives: ['Évaluation des risques cyber'],
        timeframe: '3-months',
        specificRequirements: context.specificRequirements
      };

      // Appel au service de génération
      const service = AutoMissionGeneratorService.getInstance();
      const result = await service.generateMission(serviceContext);

      setGenerationProgress({
        step: 'Mission générée avec succès !',
        progress: 100,
        isComplete: true,
        missionId: result.missionId,
        reports: [
          'Rapport Atelier 1 - Biens essentiels',
          'Rapport Atelier 2 - Sources de risque',
          'Rapport Atelier 3 - Scénarios stratégiques',
          'Rapport Atelier 4 - Scénarios opérationnels',
          'Rapport Atelier 5 - Mesures de sécurité',
          'Rapport de synthèse exécutif'
        ]
      });

    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      setGenerationProgress({
        step: 'Erreur lors de la génération',
        progress: 0,
        isComplete: false
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = () => {
    return context.organizationName && 
           context.sector && 
           context.organizationSize &&
           context.siComponents &&
           context.criticalProcesses;
  };

  if (isGenerating || generationProgress.isComplete) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-blue-600" />
              Génération Automatique de Mission EBIOS RM
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-lg font-medium">{generationProgress.step}</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${generationProgress.progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">
                {generationProgress.progress.toFixed(0)}% terminé
              </div>
            </div>

            {generationProgress.isComplete && (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Mission générée avec succès ! ID: {generationProgress.missionId}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <h3 className="font-medium">Rapports générés :</h3>
                  {generationProgress.reports?.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {report}
                      </span>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => window.location.href = `/missions/${generationProgress.missionId}`}>
                    Voir la mission
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setGenerationProgress({ step: '', progress: 0, isComplete: false });
                    setContext({
                      organizationName: '',
                      sector: '',
                      organizationSize: '',
                      siComponents: '',
                      criticalProcesses: '',
                      regulations: '',
                      specificRequirements: ''
                    });
                  }}>
                    Nouvelle génération
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-600" />
            Générateur Automatique de Mission EBIOS RM
          </CardTitle>
          <p className="text-gray-600">
            Saisissez le contexte de votre organisation pour générer automatiquement une mission EBIOS RM complète avec tous les ateliers et rapports.
          </p>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informations de l'Organisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="orgName">Nom de l'organisation *</Label>
            <Input
              id="orgName"
              value={context.organizationName}
              onChange={(e) => setContext(prev => ({ ...prev, organizationName: e.target.value }))}
              placeholder="Ex: Hôpital Universitaire de Paris"
            />
          </div>

          <div>
            <Label htmlFor="sector">Secteur d'activité *</Label>
            <Input
              id="sector"
              value={context.sector}
              onChange={(e) => setContext(prev => ({ ...prev, sector: e.target.value }))}
              placeholder="Ex: Santé et médico-social"
            />
          </div>

          <div>
            <Label htmlFor="orgSize">Taille de l'organisation *</Label>
            <Input
              id="orgSize"
              value={context.organizationSize}
              onChange={(e) => setContext(prev => ({ ...prev, organizationSize: e.target.value }))}
              placeholder="Ex: Grande entreprise (> 5000 employés)"
            />
          </div>

          <div>
            <Label htmlFor="siComponents">Composants SI concernés * (séparés par des virgules)</Label>
            <Textarea
              id="siComponents"
              value={context.siComponents}
              onChange={(e) => setContext(prev => ({ ...prev, siComponents: e.target.value }))}
              placeholder="Ex: ERP, Infrastructure Cloud, Systèmes industriels"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="criticalProcesses">Processus critiques * (un par ligne)</Label>
            <Textarea
              id="criticalProcesses"
              value={context.criticalProcesses}
              onChange={(e) => setContext(prev => ({ ...prev, criticalProcesses: e.target.value }))}
              placeholder="Ex:&#10;Gestion des patients&#10;Facturation&#10;Gestion des urgences"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="regulations">Réglementations applicables (séparées par des virgules)</Label>
            <Input
              id="regulations"
              value={context.regulations}
              onChange={(e) => setContext(prev => ({ ...prev, regulations: e.target.value }))}
              placeholder="Ex: RGPD, HDS, ANSSI"
            />
          </div>

          <div>
            <Label htmlFor="specificRequirements">Exigences spécifiques (optionnel)</Label>
            <Textarea
              id="specificRequirements"
              value={context.specificRequirements}
              onChange={(e) => setContext(prev => ({ ...prev, specificRequirements: e.target.value }))}
              placeholder="Décrivez toute exigence particulière ou contexte spécifique"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Prêt à générer votre mission ?</h3>
              <p className="text-sm text-gray-600">
                Tous les ateliers et rapports seront créés automatiquement
              </p>
            </div>
            <Button 
              onClick={generateMission}
              disabled={!isFormValid()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Zap className="h-4 w-4 mr-2" />
              Générer la Mission Complète
            </Button>
          </div>
          
          {!isFormValid() && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Veuillez remplir au minimum : nom organisation, secteur, taille, composants SI et processus critiques
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleAutoMissionGenerator;
