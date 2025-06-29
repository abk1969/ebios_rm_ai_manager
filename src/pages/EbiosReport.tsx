// EbiosReport.tsx - Page de rapport EBIOS RM

import React, { useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { 
  Award,
  ArrowLeft,
  Download,
  CheckCircle,
  Target,
  Shield,
  FileText,
  Edit,
  TrendingUp,
  BarChart3,
  Calendar,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const EbiosReport: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams();

  // 🔧 CORRECTION: Support des deux méthodes de récupération du missionId
  const missionId = params.missionId || searchParams.get('missionId');
  const [exportingPdf, setExportingPdf] = useState(false);

  // Métriques simulées
  const summary = {
    totalRisks: 12,
    criticalRisks: 3,
    highRisks: 4,
    securityMeasures: 18,
    implementedMeasures: 6,
    riskReduction: 65,
    compliance: 78
  };

  const handleExportPdf = async () => {
    setExportingPdf(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Export PDF du rapport EBIOS RM');
    setExportingPdf(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec félicitations */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Award className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
            <h1 className="text-4xl font-bold mb-2">🎉 Félicitations !</h1>
            <p className="text-xl mb-4">Analyse de risque EBIOS RM terminée avec succès</p>
            <div className="flex justify-center items-center space-x-6 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>5 ateliers complétés</span>
              </div>
              <div className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                <span>{summary.totalRisks} risques identifiés</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span>{summary.securityMeasures} mesures définies</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={() => navigate(missionId ? `/ebios-dashboard/${missionId}` : '/dashboard')}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour au Dashboard</span>
          </Button>
          
          <Button
            onClick={handleExportPdf}
            disabled={exportingPdf}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
          >
            {exportingPdf ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>Export PDF</span>
          </Button>
        </div>

        {/* Dashboard Exécutif */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Risques Totaux</p>
                  <p className="text-3xl font-bold text-blue-600">{summary.totalRisks}</p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">Critiques</span>
                  <span className="font-semibold">{summary.criticalRisks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-orange-600">Élevés</span>
                  <span className="font-semibold">{summary.highRisks}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mesures de Sécurité</p>
                  <p className="text-3xl font-bold text-green-600">{summary.securityMeasures}</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Implémentées</span>
                  <span>{summary.implementedMeasures}/{summary.securityMeasures}</span>
                </div>
                <Progress value={(summary.implementedMeasures / summary.securityMeasures) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Réduction du Risque</p>
                  <p className="text-3xl font-bold text-purple-600">{summary.riskReduction}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-4">
                <Progress value={summary.riskReduction} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Objectif: 70%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conformité</p>
                  <p className="text-3xl font-bold text-indigo-600">{summary.compliance}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="mt-4">
                <Progress value={summary.compliance} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">ISO 27001, RGPD</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Synthèse par Atelier */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Synthèse des 5 Ateliers EBIOS RM
            </CardTitle>
            <CardDescription>
              Résumé des livrables avec possibilité de révision
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-sm">Atelier {num}</span>
                    <Badge className="bg-green-100 text-green-800">Terminé</Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => navigate(missionId ? `/workshops/${missionId}/${num}` : `/workshop-${num}`)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Réviser
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Plan d'Action */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Plan d'Action Recommandé
            </CardTitle>
            <CardDescription>
              Roadmap d'implémentation des mesures de sécurité
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-red-600 mb-3 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Court terme (0-3 mois)
                </h4>
                <div className="p-3 bg-red-50 rounded border-l-4 border-red-400">
                  <p className="font-medium text-sm">Mesures critiques</p>
                  <p className="text-xs text-gray-600">MFA, Sauvegarde, Formation</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-orange-600 mb-3 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Moyen terme (3-12 mois)
                </h4>
                <div className="p-3 bg-orange-50 rounded border-l-4 border-orange-400">
                  <p className="font-medium text-sm">SOC & Monitoring</p>
                  <p className="text-xs text-gray-600">SIEM, EDR, Supervision</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Long terme (12+ mois)
                </h4>
                <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                  <p className="font-medium text-sm">Certifications</p>
                  <p className="text-xs text-gray-600">ISO 27001, SOC2</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase Post-EBIOS RM selon ANSSI */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <RefreshCw className="h-5 w-5 mr-2" />
              Phase Post-EBIOS RM - Recommandations ANSSI
            </CardTitle>
            <CardDescription>
              Gestion continue et amélioration selon les bonnes pratiques ANSSI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => navigate('/risk-monitoring')}
              >
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <div className="text-center">
                  <p className="font-medium">Monitoring Continu</p>
                  <p className="text-xs text-gray-600">Surveillance des risques et KPIs</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => navigate('/communication')}
              >
                <FileText className="h-8 w-8 text-green-600" />
                <div className="text-center">
                  <p className="font-medium">Communication</p>
                  <p className="text-xs text-gray-600">Rapports et partage parties prenantes</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => navigate('/continuous-improvement')}
              >
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="text-center">
                  <p className="font-medium">Amélioration Continue</p>
                  <p className="text-xs text-gray-600">Cycles de révision et optimisation</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => navigate('/strategic-planning')}
              >
                <Target className="h-8 w-8 text-orange-600" />
                <div className="text-center">
                  <p className="font-medium">Planification Stratégique</p>
                  <p className="text-xs text-gray-600">Alignement objectifs et roadmap</p>
                </div>
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">🎯 Prochaines Étapes Recommandées :</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• <strong>Immédiat :</strong> Configurer le monitoring des risques et alertes</li>
                <li>• <strong>Semaine 1 :</strong> Planifier la révision trimestrielle des mesures</li>
                <li>• <strong>Mois 1 :</strong> Mise en place du comité de pilotage cybersécurité</li>
                <li>• <strong>Trimestre 1 :</strong> Premier cycle d'amélioration continue</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Tableau de Bord de Gouvernance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Tableau de Bord Gouvernance
            </CardTitle>
            <CardDescription>
              Indicateurs clés pour le suivi exécutif selon ANSSI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">3 ans</div>
                <p className="text-sm text-green-700">Cycle révision stratégique</p>
                <p className="text-xs text-gray-600">Prochain: 2027</p>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">1 an</div>
                <p className="text-sm text-yellow-700">Cycle révision opérationnelle</p>
                <p className="text-xs text-gray-600">Prochain: Jan 2025</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">3 mois</div>
                <p className="text-sm text-blue-700">Révision mesures tactiques</p>
                <p className="text-xs text-gray-600">Prochain: Mars 2025</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EbiosReport;
