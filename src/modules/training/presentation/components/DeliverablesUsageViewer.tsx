/**
 * 📋 VISUALISEUR D'UTILISATION DES LIVRABLES ENTRE ATELIERS
 * Composant pour montrer comment l'Atelier 2 utilise les livrables de l'Atelier 1
 */

import React, { useState } from 'react';
import { 
  ArrowRight, 
  FileText, 
  Target, 
  Shield, 
  AlertTriangle,
  Database,
  Users,
  Building,
  Eye,
  CheckCircle,
  ArrowDown
} from 'lucide-react';

// 🎯 TYPES POUR LES LIVRABLES
interface Deliverable {
  id: string;
  name: string;
  type: 'contexte' | 'biens_essentiels' | 'biens_supports' | 'evenements_redoutes' | 'socle_securite';
  icon: React.ComponentType<any>;
  data: any;
  usageInAtelier2: UsageExample[];
}

interface UsageExample {
  sourceType: string;
  usageDescription: string;
  impact: string;
  example: string;
}

// 🎯 PROPS DU COMPOSANT
interface DeliverablesUsageViewerProps {
  currentWorkshop: number;
  atelier1Completed: boolean;
  onShowExample?: (deliverable: string, usage: string) => void;
}

export const DeliverablesUsageViewer: React.FC<DeliverablesUsageViewerProps> = ({
  currentWorkshop,
  atelier1Completed,
  onShowExample
}) => {
  const [selectedDeliverable, setSelectedDeliverable] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // 📋 DÉFINITION DES LIVRABLES ATELIER 1
  const deliverables: Deliverable[] = [
    {
      id: 'contexte',
      name: 'Contexte et périmètre CHU',
      type: 'contexte',
      icon: Building,
      data: {
        secteur: 'Santé hospitalier',
        taille: '3 sites, 3500 employés',
        budget: '450M€',
        patients: '50 000/an'
      },
      usageInAtelier2: [
        {
          sourceType: 'Cybercriminels',
          usageDescription: 'Le secteur santé et le budget élevé déterminent la pertinence maximale',
          impact: 'Score pertinence: 5/5',
          example: 'Secteur santé + Budget 450M€ → Cybercriminels spécialisés santé très intéressés'
        },
        {
          sourceType: 'Espions industriels',
          usageDescription: 'La recherche clinique active attire les espions pharmaceutiques',
          impact: 'Score pertinence: 4/5',
          example: 'CHU avec recherche active → Espions intéressés par propriété intellectuelle'
        },
        {
          sourceType: 'Initiés malveillants',
          usageDescription: 'Le nombre d\'employés (3500) crée une surface d\'attaque importante',
          impact: 'Score opportunité: 5/5',
          example: '3500 employés → Probabilité statistique d\'initiés malveillants élevée'
        }
      ]
    },
    {
      id: 'biens_essentiels',
      name: 'Biens essentiels identifiés',
      type: 'biens_essentiels',
      icon: Target,
      data: {
        urgences: 'Urgences vitales (CRITIQUE)',
        donnees: 'Données patients (CRITIQUE)',
        recherche: 'Recherche clinique (MAJEUR)'
      },
      usageInAtelier2: [
        {
          sourceType: 'Cybercriminels',
          usageDescription: 'Les urgences vitales créent une pression temporelle maximale pour l\'extorsion',
          impact: 'Motivation: 5/5',
          example: 'Urgences vitales → Vies en jeu → Pression maximale → Paiement rapide rançon'
        },
        {
          sourceType: 'Espions industriels',
          usageDescription: 'Les données de recherche représentent une propriété intellectuelle précieuse',
          impact: 'Attractivité: 4/5',
          example: 'Données recherche → Brevets potentiels → Économie 10-15 ans R&D'
        },
        {
          sourceType: 'Initiés malveillants',
          usageDescription: 'Accès privilégié légitime à tous les biens essentiels',
          impact: 'Opportunité: 5/5',
          example: 'Personnel médical → Accès légitime données patients → Exfiltration discrète'
        }
      ]
    },
    {
      id: 'biens_supports',
      name: 'Biens supports cartographiés',
      type: 'biens_supports',
      icon: Database,
      data: {
        sih: 'SIH (Système Information Hospitalier)',
        pacs: 'PACS (Imagerie médicale)',
        monitoring: 'Systèmes monitoring patients',
        reseau: 'Infrastructure réseau'
      },
      usageInAtelier2: [
        {
          sourceType: 'Cybercriminels',
          usageDescription: 'Le SIH est la cible prioritaire pour paralyser complètement l\'hôpital',
          impact: 'Cible principale',
          example: 'SIH compromis → Arrêt complet soins → Rançon maximale'
        },
        {
          sourceType: 'Espions industriels',
          usageDescription: 'Les serveurs de recherche contiennent les données d\'essais cliniques',
          impact: 'Cible spécialisée',
          example: 'Serveurs recherche → Données essais → Propriété intellectuelle'
        },
        {
          sourceType: 'Initiés malveillants',
          usageDescription: 'Connaissance intime de l\'architecture pour contourner les contrôles',
          impact: 'Avantage technique',
          example: 'Admin IT → Connaissance VLAN → Contournement segmentation'
        }
      ]
    },
    {
      id: 'evenements_redoutes',
      name: 'Événements redoutés définis',
      type: 'evenements_redoutes',
      icon: AlertTriangle,
      data: {
        er1: 'Arrêt urgences vitales (CRITIQUE)',
        er2: 'Fuite données patients (CRITIQUE)',
        er3: 'Sabotage recherche (MAJEUR)',
        er4: 'Paralysie SI (CRITIQUE)'
      },
      usageInAtelier2: [
        {
          sourceType: 'Cybercriminels',
          usageDescription: 'ER1 et ER4 correspondent parfaitement aux objectifs de ransomware',
          impact: 'Alignement parfait',
          example: 'Objectif: Paralysie SI → Ransomware → ER4 réalisé'
        },
        {
          sourceType: 'Espions industriels',
          usageDescription: 'ER3 (sabotage recherche) est l\'objectif direct des espions',
          impact: 'Cible spécifique',
          example: 'Objectif: Vol PI → Corruption données → ER3 réalisé'
        },
        {
          sourceType: 'Initiés malveillants',
          usageDescription: 'Capacité de réaliser tous les ER selon le profil et la motivation',
          impact: 'Polyvalence',
          example: 'Admin mécontent → Accès privilégié → Tous ER possibles'
        }
      ]
    },
    {
      id: 'socle_securite',
      name: 'Socle de sécurité évalué',
      type: 'socle_securite',
      icon: Shield,
      data: {
        mfa: 'MFA: ABSENT (Écart critique)',
        edr: 'EDR: ABSENT (Écart critique)',
        segmentation: 'Microsegmentation: PARTIELLE',
        formation: 'Formation: BASIQUE'
      },
      usageInAtelier2: [
        {
          sourceType: 'Cybercriminels',
          usageDescription: 'Absence MFA et EDR facilite grandement les attaques ransomware',
          impact: 'Opportunité maximale',
          example: 'Pas MFA → Force brute facile + Pas EDR → Ransomware indétectable'
        },
        {
          sourceType: 'Espions industriels',
          usageDescription: 'Absence EDR permet la persistance longue durée indétectable',
          impact: 'Facilite espionnage',
          example: 'Pas EDR → APT persistante 2-3 ans → Exfiltration continue'
        },
        {
          sourceType: 'Initiés malveillants',
          usageDescription: 'Contrôles internes limités facilitent l\'abus de privilèges',
          impact: 'Surveillance réduite',
          example: 'Contrôles faibles → Actions malveillantes non détectées'
        }
      ]
    }
  ];

  // 🎨 COULEURS PAR TYPE
  const getTypeColor = (type: string) => {
    const colors = {
      'contexte': 'bg-blue-100 text-blue-800 border-blue-200',
      'biens_essentiels': 'bg-green-100 text-green-800 border-green-200',
      'biens_supports': 'bg-purple-100 text-purple-800 border-purple-200',
      'evenements_redoutes': 'bg-red-100 text-red-800 border-red-200',
      'socle_securite': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // 🎯 RENDU D'UN LIVRABLE
  const renderDeliverable = (deliverable: Deliverable) => {
    const Icon = deliverable.icon;
    const isSelected = selectedDeliverable === deliverable.id;
    
    return (
      <div
        key={deliverable.id}
        className={`
          border-2 rounded-lg p-4 cursor-pointer transition-all
          ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'}
          ${!atelier1Completed ? 'opacity-60' : ''}
        `}
        onClick={() => setSelectedDeliverable(isSelected ? null : deliverable.id)}
      >
        {/* En-tête livrable */}
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(deliverable.type)}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{deliverable.name}</h3>
            <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTypeColor(deliverable.type)}`}>
              {deliverable.type.replace('_', ' ')}
            </div>
          </div>
          {atelier1Completed ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          )}
        </div>

        {/* Données du livrable */}
        {showDetails && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <h4 className="text-sm font-medium text-gray-900 mb-2">📋 Données disponibles :</h4>
            <div className="space-y-1">
              {Object.entries(deliverable.data).map(([key, value]) => (
                <div key={key} className="text-sm text-gray-600">
                  <span className="font-medium">{key}:</span> {value}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Utilisation dans Atelier 2 */}
        {isSelected && atelier1Completed && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <ArrowRight className="w-4 h-4 mr-2" />
              Utilisation dans l'Atelier 2 :
            </h4>
            
            <div className="space-y-3">
              {deliverable.usageInAtelier2.map((usage, index) => (
                <div key={index} className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-blue-900 mb-1">{usage.sourceType}</div>
                      <div className="text-sm text-blue-800 mb-2">{usage.usageDescription}</div>
                      <div className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                        <strong>Impact:</strong> {usage.impact}
                      </div>
                      <div className="text-xs text-blue-600 mt-2 italic">
                        💡 <strong>Exemple:</strong> {usage.example}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              📋 Utilisation des livrables Atelier 1 → Atelier 2
            </h2>
            <p className="text-gray-600">
              Découvrez comment l'Atelier 2 utilise concrètement les données de l'Atelier 1 pour analyser les sources de risques
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{showDetails ? 'Masquer' : 'Voir'} les données</span>
            </button>
            
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              atelier1Completed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
            }`}>
              {atelier1Completed ? '✅ Atelier 1 terminé' : '⏳ Atelier 1 requis'}
            </div>
          </div>
        </div>
      </div>

      {/* Flux de données */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔄 Flux de données méthodologique</h3>
        
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-2">
              1
            </div>
            <div className="text-sm font-medium">Atelier 1</div>
            <div className="text-xs text-gray-600">Socle de sécurité</div>
          </div>
          
          <ArrowRight className="w-8 h-8 text-blue-600" />
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-2">
              2
            </div>
            <div className="text-sm font-medium">Atelier 2</div>
            <div className="text-xs text-gray-600">Sources de risques</div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">🎯 Principe méthodologique :</h4>
          <p className="text-blue-800 text-sm">
            L'Atelier 2 analyse la <strong>pertinence</strong> de chaque source de risque en croisant ses 
            <strong> motivations</strong> et <strong>capacités</strong> avec le <strong>contexte</strong>, 
            les <strong>biens essentiels</strong>, les <strong>vulnérabilités</strong> et les 
            <strong>événements redoutés</strong> identifiés dans l'Atelier 1.
          </p>
        </div>
      </div>

      {/* Liste des livrables */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">📋 Livrables de l'Atelier 1 et leur utilisation</h3>
        
        {!atelier1Completed && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-orange-800">
                L'Atelier 1 doit être terminé pour accéder aux exemples d'utilisation détaillés
              </span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {deliverables.map(renderDeliverable)}
        </div>
      </div>

      {/* Résumé de l'utilisation */}
      {atelier1Completed && (
        <div className="bg-green-50 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">✅ Résumé de l'utilisation des livrables</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="font-medium text-green-900">Pertinence contextuelle</h4>
              <p className="text-sm text-green-700">
                Le contexte CHU détermine quelles sources sont intéressées
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-medium text-green-900">Attractivité des biens</h4>
              <p className="text-sm text-green-700">
                Les biens essentiels définissent les cibles attractives
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-medium text-green-900">Opportunités d'attaque</h4>
              <p className="text-sm text-green-700">
                Les vulnérabilités créent des opportunités exploitables
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliverablesUsageViewer;
