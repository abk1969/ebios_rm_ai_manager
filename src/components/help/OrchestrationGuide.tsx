import React, { useState } from 'react';
import { 
  HelpCircle, 
  X, 
  ChevronRight, 
  Network, 
  Cpu, 
  MessageSquare,
  Users,
  Workflow,
  Zap,
  CheckCircle,
  ArrowRight,
  Brain,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/button';

interface OrchestrationGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 📚 GUIDE ORCHESTRATION - AIDE UTILISATEUR
 * Guide interactif pour comprendre l'orchestration A2A et MCP
 */
export const OrchestrationGuide: React.FC<OrchestrationGuideProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'a2a' | 'mcp' | 'benefits'>('overview');

  if (!isOpen) return null;

  const sections = [
    { id: 'overview', title: 'Vue d\'ensemble', icon: Network },
    { id: 'a2a', title: 'Orchestrateur A2A', icon: Workflow },
    { id: 'mcp', title: 'Protocole MCP', icon: MessageSquare },
    { id: 'benefits', title: 'Bénéfices', icon: CheckCircle }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Network className="h-6 w-6 text-purple-600 mr-3" />
              Guide de l'Orchestration Intelligente
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Comprendre l'architecture agentic de votre EBIOS AI Manager
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex h-[600px]">
          {/* Navigation */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={cn(
                      'w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors',
                      activeSection === section.id
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {section.title}
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Contenu */}
          <div className="flex-1 p-6 overflow-y-auto">
            
            {/* Vue d'ensemble */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Network className="h-5 w-5 text-purple-600 mr-2" />
                    Qu'est-ce que l'Orchestration Intelligente ?
                  </h3>
                  <p className="text-gray-700 mb-4">
                    L'orchestration intelligente est le <strong>cerveau central</strong> qui coordonne automatiquement 
                    tous les agents IA de votre EBIOS AI Manager pour une analyse cohérente et optimisée.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Brain className="h-4 w-4 text-blue-600 mr-2" />
                    Architecture en 3 Couches
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <Workflow className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">Orchestrateur A2A (Agent-to-Agent)</div>
                        <div className="text-sm text-gray-600">Coordonne les 6 agents IA spécialisés</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <Cpu className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Serveur MCP (Model Context Protocol)</div>
                        <div className="text-sm text-gray-600">Fournit les outils spécialisés EBIOS RM</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Client MCP</div>
                        <div className="text-sm text-gray-600">Interface entre Gemini 2.5 et les outils</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">🎯 Résultat pour vous</h4>
                  <p className="text-sm text-gray-700">
                    Une analyse EBIOS RM <strong>60% plus rapide</strong>, avec une <strong>cohérence garantie</strong> 
                    entre tous les ateliers, et une <strong>validation automatique</strong> de la conformité ANSSI.
                  </p>
                </div>
              </div>
            )}

            {/* Orchestrateur A2A */}
            {activeSection === 'a2a' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Workflow className="h-5 w-5 text-blue-600 mr-2" />
                    Orchestrateur A2A (Agent-to-Agent)
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Le <strong>chef d'orchestre</strong> qui coordonne automatiquement les 6 agents IA 
                    pour qu'ils travaillent ensemble de manière optimale.
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">🤖 Les 6 Agents Coordonnés</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded p-3 border">
                      <div className="font-medium text-sm">📚 Agent Documentation</div>
                      <div className="text-xs text-gray-600">Génère la documentation automatique</div>
                    </div>
                    <div className="bg-white rounded p-3 border">
                      <div className="font-medium text-sm">🛡️ Agent Validation ANSSI</div>
                      <div className="text-xs text-gray-600">Vérifie la conformité réglementaire</div>
                    </div>
                    <div className="bg-white rounded p-3 border">
                      <div className="font-medium text-sm">🔍 Agent Analyse Risques</div>
                      <div className="text-xs text-gray-600">Analyse les risques avec MITRE ATT&CK</div>
                    </div>
                    <div className="bg-white rounded p-3 border">
                      <div className="font-medium text-sm">👥 Agent Threat Intelligence</div>
                      <div className="text-xs text-gray-600">Intelligence sur les menaces</div>
                    </div>
                    <div className="bg-white rounded p-3 border">
                      <div className="font-medium text-sm">⚡ Agent Performance</div>
                      <div className="text-xs text-gray-600">Optimise les performances</div>
                    </div>
                    <div className="bg-white rounded p-3 border">
                      <div className="font-medium text-sm">🧠 Agent Intelligence Prédictive</div>
                      <div className="text-xs text-gray-600">Prédictions et tendances</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">🔄 Comment ça marche ?</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-green-600 mr-2" />
                      <span>L'orchestrateur reçoit votre demande d'analyse EBIOS RM</span>
                    </div>
                    <div className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-green-600 mr-2" />
                      <span>Il détermine quels agents doivent intervenir et dans quel ordre</span>
                    </div>
                    <div className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-green-600 mr-2" />
                      <span>Les agents communiquent entre eux pour partager leurs résultats</span>
                    </div>
                    <div className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-green-600 mr-2" />
                      <span>L'orchestrateur consolide et valide le résultat final</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Protocole MCP */}
            {activeSection === 'mcp' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <MessageSquare className="h-5 w-5 text-green-600 mr-2" />
                    Protocole MCP (Model Context Protocol)
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Le <strong>système de communication</strong> qui permet à Gemini 2.5 d'utiliser 
                    des outils spécialisés pour l'analyse EBIOS RM.
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">🔧 Serveur MCP - La Boîte à Outils</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Le serveur MCP met à disposition 12 outils spécialisés pour l'analyse EBIOS RM :
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="bg-white rounded p-2 border">
                      <span className="font-medium">analyze_business_values</span>
                      <div className="text-xs text-gray-600">Analyse des valeurs métier</div>
                    </div>
                    <div className="bg-white rounded p-2 border">
                      <span className="font-medium">identify_risk_sources</span>
                      <div className="text-xs text-gray-600">Identification sources de risque</div>
                    </div>
                    <div className="bg-white rounded p-2 border">
                      <span className="font-medium">generate_scenarios</span>
                      <div className="text-xs text-gray-600">Génération de scénarios</div>
                    </div>
                    <div className="bg-white rounded p-2 border">
                      <span className="font-medium">validate_anssi</span>
                      <div className="text-xs text-gray-600">Validation conformité ANSSI</div>
                    </div>
                    <div className="bg-white rounded p-2 border">
                      <span className="font-medium">mitre_attack_lookup</span>
                      <div className="text-xs text-gray-600">Consultation MITRE ATT&CK</div>
                    </div>
                    <div className="bg-white rounded p-2 border">
                      <span className="font-medium">predict_risks</span>
                      <div className="text-xs text-gray-600">Prédiction évolution risques</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">📡 Client MCP - L'Interface</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Le client MCP fait le lien entre Gemini 2.5 et les outils spécialisés :
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-bold">1</span>
                      </div>
                      <span>Gemini 2.5 identifie le besoin d'un outil spécialisé</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-bold">2</span>
                      </div>
                      <span>Le client MCP transmet la demande au serveur</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-bold">3</span>
                      </div>
                      <span>L'outil spécialisé traite la demande</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs font-bold">4</span>
                      </div>
                      <span>Le résultat est renvoyé à Gemini 2.5</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bénéfices */}
            {activeSection === 'benefits' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Bénéfices Concrets pour Vous
                  </h3>
                  <p className="text-gray-700 mb-4">
                    L'orchestration intelligente transforme votre expérience EBIOS RM avec des gains mesurables.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Zap className="h-4 w-4 text-green-600 mr-2" />
                      Gain de Temps
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• <strong>60% plus rapide</strong> qu'une analyse manuelle</li>
                      <li>• <strong>Automatisation</strong> des tâches répétitives</li>
                      <li>• <strong>Parallélisation</strong> des analyses</li>
                      <li>• <strong>Validation instantanée</strong> ANSSI</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Shield className="h-4 w-4 text-blue-600 mr-2" />
                      Qualité Garantie
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• <strong>Cohérence</strong> entre tous les ateliers</li>
                      <li>• <strong>Validation croisée</strong> automatique</li>
                      <li>• <strong>Conformité ANSSI</strong> garantie</li>
                      <li>• <strong>Traçabilité</strong> complète des décisions</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Brain className="h-4 w-4 text-purple-600 mr-2" />
                      Intelligence Augmentée
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• <strong>Suggestions intelligentes</strong> contextuelles</li>
                      <li>• <strong>Détection automatique</strong> d'incohérences</li>
                      <li>• <strong>Enrichissement</strong> avec MITRE ATT&CK</li>
                      <li>• <strong>Prédictions</strong> d'évolution des risques</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Users className="h-4 w-4 text-orange-600 mr-2" />
                      Facilité d'Usage
                    </h4>
                    <ul className="text-sm space-y-1 text-gray-700">
                      <li>• <strong>Interface intuitive</strong> en français</li>
                      <li>• <strong>Pas de configuration</strong> complexe</li>
                      <li>• <strong>Fonctionnement transparent</strong></li>
                      <li>• <strong>Support contextuel</strong> intégré</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">🎯 En Résumé</h4>
                  <p className="text-sm text-gray-700">
                    L'orchestration intelligente vous permet de réaliser des <strong>analyses EBIOS RM de qualité professionnelle</strong> 
                    en un temps record, avec la garantie d'une <strong>conformité ANSSI parfaite</strong> et d'une 
                    <strong>cohérence méthodologique irréprochable</strong>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pied de page */}
        <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            💡 Cette orchestration fonctionne automatiquement en arrière-plan
          </div>
          <Button onClick={onClose} className="bg-purple-600 hover:bg-purple-700">
            Compris !
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrchestrationGuide;
