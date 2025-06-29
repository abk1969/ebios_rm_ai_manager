/**
 * 🔥 COMPOSANT IA ULTRA-DYNAMIQUE WORKSHOPS
 * Interface utilisateur pour l'IA contextuelle ultra-dynamique
 * Adaptation temps réel selon contexte mission validé
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Zap, 
  Target,
  Lock,
  Eye,
  CheckCircle2,
  Clock,
  Users,
  Building,
  Gavel,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { ultraDynamicAI } from '../../services/ai/UltraDynamicContextualAI';

interface UltraDynamicWorkshopAIProps {
  workshopNumber: 1 | 2 | 3 | 4 | 5;
  currentStep: string;
  missionContext: any; // Contexte mission validé
  existingData: any;   // Données workshop existantes
  onApplySuggestion: (suggestion: any) => void;
  className?: string;
}

const UltraDynamicWorkshopAI: React.FC<UltraDynamicWorkshopAIProps> = ({
  workshopNumber,
  currentStep,
  missionContext,
  existingData,
  onApplySuggestion,
  className
}) => {
  
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [criticalAlerts, setCriticalAlerts] = useState<string[]>([]);

  // 🔥 Chargement suggestions ultra-dynamiques
  useEffect(() => {
    if (missionContext) {
      loadUltraDynamicSuggestions();
    }
  }, [workshopNumber, currentStep, missionContext, existingData]);

  const loadUltraDynamicSuggestions = async () => {
    if (!missionContext || isLoading) return;

    setIsLoading(true);
    
    try {
      // Construire le contexte ultra-dynamique
      const ultraContext = {
        organizationType: mapSectorToOrgType(missionContext.sector),
        securityClearance: missionContext.securityClearance || 'public',
        sector: missionContext.sector,
        organizationSize: missionContext.organizationSize,
        regulations: missionContext.regulations || [],
        complianceLevel: missionContext.complianceLevel || 'basic',
        criticalityLevel: missionContext.criticalityLevel || 'medium',
        threatLevel: missionContext.threatLevel || 'standard',
        validatedMissionData: missionContext
      };

      // Générer suggestions ultra-dynamiques
      const ultraSuggestions = await ultraDynamicAI.generateUltraDynamicSuggestions(
        workshopNumber,
        currentStep,
        ultraContext,
        existingData
      );

      setSuggestions(ultraSuggestions);
      setLastUpdate(new Date());

      // Extraire alertes critiques
      const alerts = ultraSuggestions
        .filter(s => s.type === 'critical' || s.regulatoryMandatory)
        .map(s => s.title);
      setCriticalAlerts(alerts);

      console.log('🔥 Suggestions ultra-dynamiques chargées:', {
        workshop: workshopNumber,
        count: ultraSuggestions.length,
        critical: alerts.length,
        context: ultraContext.organizationType
      });

    } catch (error) {
      console.error('❌ Erreur chargement IA ultra-dynamique:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const mapSectorToOrgType = (sector: string): string => {
    const mapping: Record<string, string> = {
      'Défense': 'military',
      'Militaire': 'military',
      'Prestataire Défense': 'defense_contractor',
      'Santé': 'hospital',
      'Hôpital': 'hospital',
      'Collectivité': 'local_government',
      'Administration': 'local_government',
      'Ministère': 'ministry',
      'Gouvernement': 'ministry',
      'Grande Entreprise': 'large_corporation',
      'Groupe': 'large_corporation',
      'Filiale': 'subsidiary'
    };
    return mapping[sector] || 'large_corporation';
  };

  const getSuggestionIcon = (suggestion: any) => {
    if (suggestion.regulatoryMandatory) return <Gavel className="h-4 w-4 text-red-600" />;
    if (suggestion.type === 'critical') return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    if (suggestion.securityClearanceRequired) return <Lock className="h-4 w-4 text-purple-600" />;
    if (suggestion.sectorSpecific) return <Building className="h-4 w-4 text-blue-600" />;
    return <Target className="h-4 w-4 text-green-600" />;
  };

  const getSuggestionBadgeColor = (suggestion: any) => {
    if (suggestion.regulatoryMandatory) return 'destructive';
    if (suggestion.type === 'critical') return 'default';
    if (suggestion.securityClearanceRequired) return 'secondary';
    return 'outline';
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'expert': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (!missionContext) {
    return (
      <Alert className="mt-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Contexte mission requis pour l'IA ultra-dynamique
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={cn("mt-4 p-4 bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border border-slate-200", className)}>
      
      {/* En-tête avec contexte */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-slate-900">
              IA Ultra-Dynamique Workshop {workshopNumber}
            </span>
          </div>
          
          {/* Badges contexte */}
          <div className="flex gap-1">
            <Badge variant="outline" className="text-xs">
              {missionContext.sector}
            </Badge>
            {missionContext.regulations?.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {missionContext.regulations.length} réglementations
              </Badge>
            )}
            {missionContext.criticalityLevel && (
              <Badge 
                variant={missionContext.criticalityLevel === 'vital' ? 'destructive' : 'default'}
                className="text-xs"
              >
                {missionContext.criticalityLevel}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lastUpdate && (
            <span className="text-xs text-slate-500">
              Mis à jour {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={loadUltraDynamicSuggestions}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Zap className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Alertes critiques */}
      {criticalAlerts.length > 0 && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>{criticalAlerts.length} exigence(s) critique(s) détectée(s)</strong>
            <ul className="mt-1 text-sm">
              {criticalAlerts.slice(0, 2).map((alert, index) => (
                <li key={index}>• {alert}</li>
              ))}
              {criticalAlerts.length > 2 && (
                <li>• +{criticalAlerts.length - 2} autres...</li>
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Liste des suggestions */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-slate-600">
              Analyse contextuelle en cours...
            </p>
            <p className="text-xs text-slate-500">
              Adaptation selon {missionContext.sector} et réglementations
            </p>
          </div>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id || index}
              className="p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  
                  {/* En-tête suggestion */}
                  <div className="flex items-center gap-2 mb-2">
                    {getSuggestionIcon(suggestion)}
                    <span className="font-medium text-slate-900 text-sm">
                      {suggestion.title}
                    </span>
                    
                    {/* Badges spéciaux */}
                    {suggestion.regulatoryMandatory && (
                      <Badge variant="destructive" className="text-xs">
                        OBLIGATOIRE
                      </Badge>
                    )}
                    {suggestion.securityClearanceRequired && (
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.securityClearanceRequired.toUpperCase()}
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-2">
                    {suggestion.description}
                  </p>

                  {/* Contenu dynamique */}
                  {suggestion.dynamicContent && (
                    <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded mb-2">
                      {suggestion.dynamicContent}
                    </div>
                  )}

                  {/* Métadonnées */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      <span>Impact: {suggestion.criticalityImpact}/10</span>
                    </div>
                    
                    <div className={cn("px-2 py-1 rounded", getComplexityColor(suggestion.implementationComplexity))}>
                      {suggestion.implementationComplexity}
                    </div>

                    {suggestion.applicableRegulations?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Gavel className="h-3 w-3" />
                        <span>{suggestion.applicableRegulations.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Avertissements contextuels */}
                  {suggestion.contextualWarnings?.length > 0 && (
                    <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded">
                      <div className="flex items-center gap-1 mb-1">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="font-medium">Attention:</span>
                      </div>
                      {suggestion.contextualWarnings.map((warning: string, i: number) => (
                        <div key={i}>• {warning}</div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bouton d'action */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onApplySuggestion(suggestion)}
                  className="ml-3"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Appliquer
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <Eye className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600">
            Aucune suggestion pour ce contexte
          </p>
          <p className="text-xs text-slate-500">
            L'IA s'adapte à votre secteur et réglementations
          </p>
        </div>
      )}

      {/* Informations contextuelles */}
      {suggestions.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span>
                {suggestions.filter(s => s.regulatoryMandatory).length} obligatoires
              </span>
              <span>
                {suggestions.filter(s => s.sectorSpecific).length} sectorielles
              </span>
              <span>
                {suggestions.filter(s => s.securityClearanceRequired).length} classifiées
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Temps réel</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UltraDynamicWorkshopAI;
