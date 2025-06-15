/**
 * 📊 TRACKER DE PROGRESSION MODERNE
 * Composant de suivi de progression avec animations et feedback visuel
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Clock,
  Zap,
  TrendingUp,
  Users,
  Shield,
  FileText
} from 'lucide-react';

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'completed' | 'current' | 'pending' | 'error';
  progress?: number;
  estimatedTime?: string;
  requirements?: string[];
}

interface ModernProgressTrackerProps {
  steps: ProgressStep[];
  currentStep: number;
  overallProgress: number;
  estimatedTimeRemaining?: string;
}

const ModernProgressTracker: React.FC<ModernProgressTrackerProps> = ({
  steps,
  currentStep,
  overallProgress,
  estimatedTimeRemaining
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'current':
        return <Circle className="h-5 w-5 text-blue-600 animate-pulse" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'current':
        return 'border-blue-200 bg-blue-50 shadow-lg';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;

  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        {/* En-tête avec progression globale */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Progression de la Mission
              </h3>
              <p className="text-sm text-gray-600">
                {completedSteps} sur {totalSteps} étapes terminées
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(overallProgress)}%
              </div>
              {estimatedTimeRemaining && (
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {estimatedTimeRemaining}
                </div>
              )}
            </div>
          </div>
          
          <Progress 
            value={overallProgress} 
            className="h-3 bg-gray-200"
          />
          
          <div className="flex justify-between mt-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <Zap className="h-3 w-3 mr-1" />
              En cours
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <TrendingUp className="h-3 w-3 mr-1" />
              {Math.round((completedSteps / totalSteps) * 100)}% terminé
            </Badge>
          </div>
        </div>

        {/* Liste des étapes */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`p-4 rounded-lg border transition-all duration-300 ${getStatusColor(step.status)}`}
            >
              <div className="flex items-start gap-4">
                {/* Icône de statut */}
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(step.status)}
                </div>

                {/* Contenu de l'étape */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <step.icon className="h-4 w-4 text-gray-600" />
                      <h4 className="font-medium text-gray-900">
                        {step.title}
                      </h4>
                    </div>
                    
                    {step.status === 'current' && step.progress !== undefined && (
                      <div className="text-sm font-medium text-blue-600">
                        {step.progress}%
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {step.description}
                  </p>

                  {/* Barre de progression pour l'étape courante */}
                  {step.status === 'current' && step.progress !== undefined && (
                    <div className="mb-3">
                      <Progress 
                        value={step.progress} 
                        className="h-2 bg-blue-100"
                      />
                    </div>
                  )}

                  {/* Temps estimé */}
                  {step.estimatedTime && step.status !== 'completed' && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <Clock className="h-3 w-3" />
                      Temps estimé: {step.estimatedTime}
                    </div>
                  )}

                  {/* Exigences */}
                  {step.requirements && step.requirements.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs font-medium text-gray-700 mb-1">
                        Prérequis:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {step.requirements.map((req, reqIndex) => (
                          <Badge 
                            key={reqIndex} 
                            variant="outline" 
                            className="text-xs"
                          >
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé des métriques */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {completedSteps}
              </div>
              <div className="text-xs text-gray-500">Terminées</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {steps.filter(s => s.status === 'current').length}
              </div>
              <div className="text-xs text-gray-500">En cours</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-600">
                {steps.filter(s => s.status === 'pending').length}
              </div>
              <div className="text-xs text-gray-500">À venir</div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Équipe assignée
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Sécurisé
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Documenté
              </div>
            </div>
            <div>
              Dernière mise à jour: il y a 2 min
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernProgressTracker;
