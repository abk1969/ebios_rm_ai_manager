/**
 * 🔗 VISUALISEUR DES LIENS VERS LES ATELIERS SUIVANTS
 * Composant pour afficher comment l'Atelier 2 alimente les ateliers 3, 4 et 5
 */

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Target, 
  Route, 
  ShieldCheck,
  Users,
  Zap,
  Eye,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Star,
  Layers
} from 'lucide-react';

// 🎯 TYPES POUR LES LIENS
interface WorkshopLink {
  targetWorkshop: number;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  deliverables: LinkDeliverable[];
  examples: LinkExample[];
}

interface LinkDeliverable {
  name: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
}

interface LinkExample {
  source: string;
  linkType: string;
  example: string;
  result: string;
}

// 🎯 PROPS DU COMPOSANT
interface WorkshopLinksViewerProps {
  currentWorkshop: number;
  atelier2Completed: boolean;
  sourcesPrioritaires: string[];
  onNavigateToWorkshop?: (workshopId: number) => void;
}

export const WorkshopLinksViewer: React.FC<WorkshopLinksViewerProps> = ({
  currentWorkshop,
  atelier2Completed,
  sourcesPrioritaires,
  onNavigateToWorkshop
}) => {
  const [selectedLink, setSelectedLink] = useState<number | null>(null);
  const [showExamples, setShowExamples] = useState(false);

  // 🔗 DÉFINITION DES LIENS VERS LES ATELIERS SUIVANTS
  const workshopLinks: WorkshopLink[] = [
    {
      targetWorkshop: 3,
      title: "Scénarios stratégiques",
      icon: Users,
      color: "purple",
      description: "Les sources identifiées génèrent des scénarios stratégiques en se combinant avec les biens essentiels",
      deliverables: [
        {
          name: "Scénarios stratégiques générés",
          description: "Chaque source prioritaire génère 2-3 scénarios stratégiques spécifiques",
          impact: "Base de l'analyse des chemins d'attaque",
          priority: 'high'
        },
        {
          name: "Combinaisons source × biens",
          description: "Matrice de pertinence entre sources et biens essentiels",
          impact: "Priorisation des scénarios à approfondir",
          priority: 'high'
        },
        {
          name: "Vraisemblance initiale",
          description: "Probabilité de réalisation basée sur la pertinence des sources",
          impact: "Évaluation du risque réel",
          priority: 'medium'
        },
        {
          name: "Chemins d'attaque potentiels",
          description: "Séquences d'actions possibles pour chaque source",
          impact: "Structure pour l'analyse opérationnelle",
          priority: 'high'
        }
      ],
      examples: [
        {
          source: "Cybercriminels spécialisés santé",
          linkType: "Génération scénario",
          example: "Motivation financière + SIH critique + Pas de MFA",
          result: "Scénario 'Ransomware SIH' avec vraisemblance 80%"
        },
        {
          source: "Espions industriels",
          linkType: "Combinaison source×bien",
          example: "Motivation concurrentielle + Recherche clinique",
          result: "Scénario 'Exfiltration données R&D' prioritaire"
        },
        {
          source: "Initiés malveillants",
          linkType: "Chemin d'attaque",
          example: "Accès privilégié + Connaissance interne",
          result: "Chemin 'Abus privilèges → Exfiltration discrète'"
        }
      ]
    },
    {
      targetWorkshop: 4,
      title: "Scénarios opérationnels",
      icon: Route,
      color: "orange",
      description: "Les capacités des sources déterminent les modes opératoires techniques détaillés",
      deliverables: [
        {
          name: "Modes opératoires détaillés",
          description: "Techniques d'attaque spécifiques selon les capacités de chaque source",
          impact: "Compréhension précise des menaces",
          priority: 'high'
        },
        {
          name: "Techniques d'attaque attendues",
          description: "Arsenal technique probable selon le profil des sources",
          impact: "Adaptation des mesures de détection",
          priority: 'high'
        },
        {
          name: "Vecteurs d'attaque prioritaires",
          description: "Points d'entrée les plus probables selon les vulnérabilités",
          impact: "Priorisation des mesures préventives",
          priority: 'medium'
        },
        {
          name: "Niveau de sophistication",
          description: "Complexité technique attendue des attaques",
          impact: "Calibrage des défenses nécessaires",
          priority: 'medium'
        }
      ],
      examples: [
        {
          source: "Cybercriminels (capacités 9/10)",
          linkType: "Mode opératoire",
          example: "Techniques avancées + Outils professionnels",
          result: "Ransomware avec évasion EDR + C&C chiffrés"
        },
        {
          source: "Espions (sophistication 9/10)",
          linkType: "Techniques attendues",
          example: "APT persistantes + Discrétion absolue",
          result: "Living off the land + Backdoors custom"
        },
        {
          source: "Initiés (accès privilégié)",
          linkType: "Vecteurs d'attaque",
          example: "Comptes admin + Connaissance architecture",
          result: "PowerShell + WMI + Désactivation logs"
        }
      ]
    },
    {
      targetWorkshop: 5,
      title: "Traitement du risque",
      icon: ShieldCheck,
      color: "green",
      description: "La pertinence des sources oriente la priorisation et le type des mesures de sécurité",
      deliverables: [
        {
          name: "Mesures préventives priorisées",
          description: "Mesures de protection adaptées aux sources les plus pertinentes",
          impact: "Réduction du risque à la source",
          priority: 'high'
        },
        {
          name: "Mesures de détection ciblées",
          description: "Capacités de détection selon les techniques attendues",
          impact: "Détection précoce des attaques",
          priority: 'high'
        },
        {
          name: "Mesures de réponse adaptées",
          description: "Procédures de réponse selon les types d'incidents probables",
          impact: "Limitation des impacts",
          priority: 'medium'
        },
        {
          name: "Budget sécurité réparti",
          description: "Allocation des ressources selon la priorité des sources",
          impact: "Optimisation des investissements",
          priority: 'high'
        }
      ],
      examples: [
        {
          source: "Cybercriminels (Priorité 1)",
          linkType: "Mesures prioritaires",
          example: "Menace la plus probable + Impact critique",
          result: "60% budget → Anti-ransomware + EDR + Formation"
        },
        {
          source: "Initiés (Priorité 2)",
          linkType: "Mesures spécialisées",
          example: "Accès privilégié + Difficile à détecter",
          result: "25% budget → Surveillance privilégiée + DLP"
        },
        {
          source: "Espions (Priorité 3)",
          linkType: "Mesures sophistiquées",
          example: "Techniques avancées + Persistance",
          result: "15% budget → Détection APT + Threat hunting"
        }
      ]
    }
  ];

  // 🎨 COULEURS PAR ATELIER
  const getWorkshopColor = (color: string) => {
    const colors = {
      'purple': 'bg-purple-100 text-purple-800 border-purple-200',
      'orange': 'bg-orange-100 text-orange-800 border-orange-200',
      'green': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // 🎯 RENDU D'UN LIEN VERS ATELIER
  const renderWorkshopLink = (link: WorkshopLink) => {
    const Icon = link.icon;
    const isSelected = selectedLink === link.targetWorkshop;
    
    return (
      <div
        key={link.targetWorkshop}
        className={`
          border-2 rounded-lg p-6 cursor-pointer transition-all
          ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}
          ${!atelier2Completed ? 'opacity-60' : ''}
        `}
        onClick={() => setSelectedLink(isSelected ? null : link.targetWorkshop)}
      >
        {/* En-tête du lien */}
        <div className="flex items-center space-x-4 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getWorkshopColor(link.color)}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">
              Atelier {link.targetWorkshop} - {link.title}
            </h3>
            <p className="text-gray-600">{link.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <ArrowRight className="w-6 h-6 text-blue-600" />
            {atelier2Completed ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            )}
          </div>
        </div>

        {/* Livrables transmis */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Layers className="w-4 h-4 mr-2" />
            Livrables transmis ({link.deliverables.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {link.deliverables.map((deliverable, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    deliverable.priority === 'high' ? 'bg-red-500' :
                    deliverable.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm">{deliverable.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{deliverable.description}</div>
                    <div className="text-xs text-blue-600 mt-1 italic">{deliverable.impact}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exemples concrets */}
        {isSelected && showExamples && atelier2Completed && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Exemples concrets de liens
            </h4>
            <div className="space-y-3">
              {link.examples.map((example, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-blue-900 mb-1">{example.source}</div>
                      <div className="text-sm text-blue-800 mb-2">
                        <strong>{example.linkType}:</strong> {example.example}
                      </div>
                      <div className="text-sm bg-blue-100 text-blue-700 p-2 rounded">
                        <strong>→ Résultat:</strong> {example.result}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bouton navigation */}
        {isSelected && atelier2Completed && (
          <div className="border-t border-gray-200 pt-4 text-center">
            <button
              onClick={() => onNavigateToWorkshop?.(link.targetWorkshop)}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${getWorkshopColor(link.color)} hover:opacity-80`}
            >
              Accéder à l'Atelier {link.targetWorkshop}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🔗 Liens vers les ateliers suivants
            </h2>
            <p className="text-gray-600">
              Découvrez comment les livrables de l'Atelier 2 alimentent directement les ateliers 3, 4 et 5
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{showExamples ? 'Masquer' : 'Voir'} les exemples</span>
            </button>
            
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              atelier2Completed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
            }`}>
              {atelier2Completed ? '✅ Atelier 2 terminé' : '⏳ Atelier 2 requis'}
            </div>
          </div>
        </div>
      </div>

      {/* Sources prioritaires */}
      {atelier2Completed && sourcesPrioritaires.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">🎯 Sources prioritaires identifiées</h3>
          <div className="flex flex-wrap gap-3">
            {sourcesPrioritaires.map((source, index) => (
              <div key={index} className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
                <Star className="w-4 h-4" />
                <span className="font-medium">{index + 1}. {source}</span>
              </div>
            ))}
          </div>
          <p className="text-blue-700 text-sm mt-3">
            Ces sources alimenteront la génération des scénarios et la priorisation des mesures dans les ateliers suivants.
          </p>
        </div>
      )}

      {/* Avertissement si Atelier 2 non terminé */}
      {!atelier2Completed && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="font-medium text-orange-800">
              L'Atelier 2 doit être terminé pour accéder aux liens détaillés vers les ateliers suivants
            </span>
          </div>
        </div>
      )}

      {/* Liens vers les ateliers */}
      <div className="space-y-6">
        {workshopLinks.map(renderWorkshopLink)}
      </div>

      {/* Résumé méthodologique */}
      {atelier2Completed && (
        <div className="bg-green-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">✅ Cohérence méthodologique EBIOS RM</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-medium text-green-900">Atelier 3</h4>
              <p className="text-sm text-green-700">
                Sources → Scénarios stratégiques
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                <Route className="w-6 h-6" />
              </div>
              <h4 className="font-medium text-green-900">Atelier 4</h4>
              <p className="text-sm text-green-700">
                Capacités → Modes opératoires
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-medium text-green-900">Atelier 5</h4>
              <p className="text-sm text-green-700">
                Pertinence → Priorisation mesures
              </p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-green-100 rounded-lg">
            <p className="text-green-800 text-sm text-center">
              <strong>🎯 Principe EBIOS RM :</strong> Chaque atelier s'appuie rigoureusement sur les précédents 
              pour construire une analyse de risques cohérente et complète, conforme aux exigences ANSSI.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkshopLinksViewer;
