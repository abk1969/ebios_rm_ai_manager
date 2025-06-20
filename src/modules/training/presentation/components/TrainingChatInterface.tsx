/**
 * 🎓 INTERFACE CHAT DE FORMATION
 * Composant pour l'interaction conversationnelle avec l'IA formateur
 * Pattern Observer pour réactivité temps réel
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Paperclip,
  MoreVertical,
  Bot,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Lightbulb,
  Download,
  ExternalLink
} from 'lucide-react';
import { useConversation, useTrainingActions, useCurrentSession, useMetrics } from '../stores/trainingStore';
import { ConversationMessage, MessageAction } from '../stores/trainingStore';
import { ExpertPromptService } from '@/services/training/ExpertPromptService';
import { AgentOrchestrator } from '../../domain/services/AgentOrchestrator';

// 🎯 PROPS DU COMPOSANT
export interface TrainingChatInterfaceProps {
  className?: string;
  maxHeight?: string;
}

/**
 * 🎯 COMPOSANT PRINCIPAL
 */
export const TrainingChatInterface: React.FC<TrainingChatInterfaceProps> = ({
  className = '',
  maxHeight = 'calc(100vh - 200px)'
}) => {
  // 🎪 HOOKS STORE
  const conversation = useConversation();
  const actions = useTrainingActions();
  const currentSession = useCurrentSession();
  const metrics = useMetrics();

  // 🎯 ÉTAT LOCAL
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // 🎯 REFS
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🧠 ORCHESTRATEUR IA STRUCTURANT
  const [orchestrator] = useState(() => new AgentOrchestrator());
  const [isOrchestratorInitialized, setIsOrchestratorInitialized] = useState(false);

  // 🔄 AUTO-SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  // 🎯 FOCUS AUTOMATIQUE
  useEffect(() => {
    if (!conversation.awaitingResponse) {
      inputRef.current?.focus();
    }
  }, [conversation.awaitingResponse]);

  // 🧠 INITIALISATION ORCHESTRATEUR IA STRUCTURANT
  useEffect(() => {
    const initializeOrchestrator = async () => {
      if (!isOrchestratorInitialized) {
        try {
          await orchestrator.initializeSession('training_user', 'training_session');
          setIsOrchestratorInitialized(true);
          console.log('🧠 Orchestrateur IA structurant initialisé avec succès');
        } catch (error) {
          console.error('❌ Erreur initialisation orchestrateur:', error);
        }
      }
    };

    initializeOrchestrator();
  }, [orchestrator, isOrchestratorInitialized]);

  // 🎓 MESSAGE D'ACCUEIL AVEC MOTEUR IA STRUCTURANT
  useEffect(() => {
    if (conversation.messages.length === 0 && isOrchestratorInitialized) {
      // Ajouter un message d'accueil avec le nouveau système structurant
      actions.addMessage({
        type: 'instructor',
        content: `**🎓 FORMATION EBIOS RM - MOTEUR IA STRUCTURANT ACTIVÉ**

**Bonjour ! Je suis Dr. Sophie Cadrage, votre formatrice EBIOS RM.**

Je vais vous accompagner personnellement dans l'analyse des risques du **CHU Métropolitain**.

📋 **VOTRE MISSION AUJOURD'HUI :**
Nous allons analyser ensemble les risques cyber de ce CHU de 1200 lits qui dessert 800 000 habitants.

🎯 **PLAN D'ACTION IMMÉDIAT :**

**ÉTAPE 1** - Découverte du contexte (5 min)
→ Je vais vous présenter le CHU et ses enjeux
→ Vous comprendrez pourquoi cette analyse est critique

**ÉTAPE 2** - Identification des biens supports (15 min)
→ Nous identifierons ensemble les systèmes critiques
→ SIH, équipements médicaux, données patients...

**ÉTAPE 3** - Évaluation de la criticité (10 min)
→ Nous évaluerons l'impact de chaque bien support
→ Matrice de criticité personnalisée

🚀 **COMMENÇONS MAINTENANT !**

Tapez **"GO"** ou cliquez sur le bouton ci-dessous pour que je vous présente le contexte du CHU métropolitain.

Ou posez-moi directement une question si vous préférez !`,
        metadata: {
          instructionType: 'structured_welcome' as const,
          confidence: 1.0,
          actions: [
            {
              id: 'start_structured_training',
              label: '🚀 GO - Démarrer la formation',
              type: 'button',
              action: () => {
                setInputValue('GO');
                setTimeout(() => handleSendMessage(), 100);
              },
              variant: 'primary'
            },
            {
              id: 'show_chu_context',
              label: '🏥 Présenter le CHU',
              type: 'button',
              action: () => {
                setInputValue('Présentez-moi le CHU');
                setTimeout(() => handleSendMessage(), 100);
              },
              variant: 'secondary'
            }
          ]
        }
      });
    }
  }, [conversation.messages.length, actions, isOrchestratorInitialized]);

  // 🎯 DÉMARRAGE ATELIER EXPERT
  const startExpertWorkshop = (workshopNumber: number) => {
    const workshopContent = {
      1: `**🎯 ATELIER 1 - CADRAGE ET SOCLE DE SÉCURITÉ (NIVEAU EXPERT)**

**OBJECTIFS TECHNIQUES :**
• Identification exhaustive des valeurs métier hospitalières
• Cartographie fine des interdépendances SIH/dispositifs médicaux
• Définition du périmètre d'étude conforme NIS2
• Construction du socle réglementaire HDS

**LIVRABLES ATTENDUS :**
• Matrice des valeurs métier avec criticité quantifiée
• Cartographie des biens supports avec interdépendances
• Périmètre d'étude justifié techniquement
• Socle de sécurité réglementaire documenté

**QUESTIONS EXPERTES À TRAITER :**
1. Comment segmenter les réseaux IT/OT médicaux ?
2. Quelles sont les exigences HDS pour l'hébergement ?
3. Comment évaluer la criticité des dispositifs IoMT ?
4. Quelle gouvernance pour la gestion des risques ?

Par quelle problématique technique souhaitez-vous commencer ?`
    };

    actions.addMessage({
      type: 'instructor',
      content: workshopContent[workshopNumber as keyof typeof workshopContent] || 'Atelier non disponible'
    });
  };

  // 🎯 ENVOI DE MESSAGE
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || conversation.awaitingResponse) return;

    const messageContent = inputValue.trim();
    setInputValue('');

    // Ajouter le message de l'apprenant
    actions.addMessage({
      type: 'learner',
      content: messageContent,
      metadata: {
        confidence: 1.0
      }
    });

    // Incrémenter les interactions
    actions.incrementInteraction();

    // Marquer comme en attente de réponse
    actions.setAwaitingResponse(true);
    actions.setTyping(true);

    try {
      // 🧠 UTILISATION DU MOTEUR IA STRUCTURANT
      if (isOrchestratorInitialized) {
        await processWithStructuredOrchestrator(messageContent);
      } else {
        // Fallback vers l'ancienne méthode si l'orchestrateur n'est pas prêt
        await simulateAIResponse(messageContent);
      }
    } catch (error) {
      console.error('❌ Erreur traitement IA:', error);
      actions.addError({
        code: 'AI_RESPONSE_ERROR',
        message: 'Erreur lors de la génération de la réponse IA',
        recoverable: true
      });
    } finally {
      actions.setAwaitingResponse(false);
      actions.setTyping(false);
    }
  }, [inputValue, conversation.awaitingResponse, actions]);

  // 🧠 TRAITEMENT AVEC ORCHESTRATEUR IA STRUCTURANT
  const processWithStructuredOrchestrator = async (userMessage: string) => {
    try {
      console.log('🧠 Traitement avec orchestrateur structurant:', userMessage);

      // Traitement par l'orchestrateur IA structurant
      const response = await orchestrator.processLearnerMessage(userMessage);

      console.log('✅ Réponse orchestrateur reçue:', response);

      // Conversion de la réponse en format du store
      const formattedActions: MessageAction[] = response.actions?.map((action: any) => ({
        id: action.id,
        label: action.label,
        type: action.type || 'button',
        action: () => {
          // Traiter l'action de l'orchestrateur
          if (action.payload) {
            // Simuler un clic sur l'action en envoyant le payload comme message
            setInputValue(action.payload);
            setTimeout(() => handleSendMessage(), 100);
          }
        },
        variant: action.type === 'primary' ? 'primary' : 'secondary'
      })) || [];

      // Ajouter la réponse structurée de l'IA
      actions.addMessage({
        type: 'instructor',
        content: response.text,
        metadata: {
          instructionType: 'structured_guidance' as const,
          confidence: response.metadata?.confidence || 0.9,
          actions: formattedActions,
          resources: response.metadata?.sources || [],
          workshopStep: response.metadata?.workshopStep,
          structuredGuidance: response.metadata?.structuredGuidance
        }
      });

      // Mettre à jour les métriques avec la progression structurée
      if (response.progressUpdate) {
        actions.updateMetrics({
          comprehensionLevel: Math.min(100, metrics.comprehensionLevel + 5),
          responseQuality: (response.metadata?.confidence || 0.9) * 100
        });
      }

      console.log('✅ Message structuré ajouté avec succès');

    } catch (error) {
      console.error('❌ Erreur orchestrateur structurant:', error);
      throw error; // Re-throw pour que le catch parent gère l'erreur
    }
  };

  // 🎓 RÉPONSE IA EXPERTE (FALLBACK)
  const simulateAIResponse = async (userMessage: string) => {
    // Simulation d'un délai de traitement réaliste
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // Configuration experte basée sur le contexte de session
    const expertConfig = {
      sector: 'healthcare' as const, // À récupérer depuis la session réelle
      userLevel: 'expert' as const,
      context: {
        organizationType: 'Centre Hospitalier Universitaire',
        regulatoryFramework: ['RGPD', 'NIS2', 'HDS', 'Certification HAS'],
        criticalAssets: ['SIH', 'PACS', 'Systèmes de surveillance', 'Données patients'],
        threatLandscape: ['Ransomware hospitalier', 'Espionnage médical', 'Sabotage IoMT']
      }
    };

    // Génération de réponse experte contextuelle
    const expertResponse = generateExpertResponse(userMessage, expertConfig);

    // Ajouter la réponse de l'expert IA
    actions.addMessage({
      type: 'instructor',
      content: (expertResponse as any).content,
      metadata: {
        instructionType: 'expert_guidance' as const,
        confidence: (expertResponse as any).confidence,
        actions: generateExpertActions(userMessage, expertConfig),
        resources: (expertResponse as any).resources
      }
    });

    // Mettre à jour les métriques avec niveau expert
    actions.updateMetrics({
      comprehensionLevel: Math.min(100, metrics.comprehensionLevel + (expertResponse as any).learningImpact),
      responseQuality: (expertResponse as any).confidence * 100
    });
  };

  // 🧠 GÉNÉRATION DE RÉPONSE EXPERTE
  const generateExpertResponse = (userMessage: string, config: any) => {
    const expertPromptService = ExpertPromptService.getInstance();

    // Analyse du message pour déterminer le contexte
    const messageAnalysis = analyzeUserMessage(userMessage);

    // Réponses expertes par domaine
    const expertResponses = {
      // 🏥 RÉPONSES SECTEUR SANTÉ - NIVEAU EXPERT
      healthcare: {
        cadrage: {
          trigger: /atelier 1|cadrage|socle|périmètre|valeur métier/i,
          response: `Dans le contexte hospitalier, l'Atelier 1 d'EBIOS RM nécessite une approche multicritères tenant compte des spécificités du secteur santé.

**IDENTIFICATION DES VALEURS MÉTIER HOSPITALIÈRES :**
• **Processus critiques** : Parcours patient, urgences vitales, blocs opératoires, réanimation
• **Informations sensibles** : DMP, dossiers patients, données de recherche clinique, imagerie médicale
• **Services essentiels** : SIH (Système d'Information Hospitalier), PACS, systèmes de surveillance
• **Biens supports** : Infrastructure réseau, serveurs critiques, dispositifs médicaux connectés

**PÉRIMÈTRE D'ÉTUDE SPÉCIALISÉ :**
Conformément au référentiel HDS et aux exigences NIS2 pour les entités essentielles, le périmètre doit intégrer :
- Les systèmes d'information de santé (SIS)
- Les dispositifs médicaux connectés (IoMT)
- Les interconnexions avec les partenaires de soins (GHT, réseaux)

**SOCLE RÉGLEMENTAIRE HOSPITALIER :**
• RGPD avec focus données de santé (Art. 9)
• Directive NIS2 - Secteur santé (Annexe I)
• Certification HDS (Hébergement Données de Santé)
• Référentiel de sécurité ASIP Santé

Quelle est votre problématique spécifique dans ce cadrage hospitalier ?`,
          confidence: 0.95,
          learningImpact: 8,
          resources: [
            { title: 'Guide ANSSI - Sécurité des systèmes d\'information de santé', type: 'guide' },
            { title: 'Référentiel HDS v1.1', type: 'standard' },
            { title: 'Directive NIS2 - Secteur santé', type: 'regulation' }
          ]
        },

        menaces: {
          trigger: /menace|attaque|ransomware|cyberattaque|sécurité/i,
          response: `L'analyse des menaces en environnement hospitalier révèle un paysage de risques spécifique et critique.

**ACTEURS MALVEILLANTS CIBLANT LE SECTEUR SANTÉ :**
• **Cybercriminels spécialisés** : Groupes ransomware (Conti, Ryuk) ciblant spécifiquement les hôpitaux
• **États-nations** : Espionnage sur la recherche médicale et données épidémiologiques
• **Menaces internes** : Personnel ayant accès aux données sensibles
• **Hacktivistes** : Groupes contestant les politiques de santé publique

**VECTEURS D'ATTAQUE HOSPITALIERS :**
• **Compromission des dispositifs médicaux** : Vulnérabilités IoMT (pompes à perfusion, moniteurs)
• **Attaques sur l'infrastructure réseau** : Segmentation insuffisante IT/OT médical
• **Ingénierie sociale ciblée** : Exploitation du stress et urgences médicales
• **Supply chain médicale** : Compromission des fournisseurs d'équipements

**SCÉNARIOS D'ATTAQUE DOCUMENTÉS :**
• **WannaCry NHS (2017)** : 80 trusts hospitaliers britanniques paralysés
• **Düsseldorf University Hospital (2020)** : Premier décès lié à une cyberattaque
• **Ransomware Ryuk** : 400+ établissements US touchés (2018-2021)

**IMPACT SPÉCIFIQUE SANTÉ :**
- Interruption des soins critiques
- Compromission de la sécurité des patients
- Violation du secret médical
- Non-conformité réglementaire (CNIL, ARS)

Sur quel aspect de l'analyse de menaces souhaitez-vous approfondir ?`,
          confidence: 0.98,
          learningImpact: 10,
          resources: [
            { title: 'MITRE ATT&CK for Healthcare', type: 'framework' },
            { title: 'ANSSI - Menaces sur les systèmes industriels', type: 'threat_intel' },
            { title: 'Retours d\'expérience CERT Santé', type: 'case_study' }
          ]
        }
      }
    };

    // Sélection de la réponse appropriée
    const sectorResponses = expertResponses[config.sector as keyof typeof expertResponses] || {};

    for (const [domain, responseData] of Object.entries(sectorResponses)) {
      if ((responseData as any).trigger.test(userMessage)) {
        return responseData;
      }
    }

    // Réponse experte par défaut
    return {
      content: `En tant qu'expert ANSSI spécialisé en cybersécurité ${config.sector === 'healthcare' ? 'hospitalière' : 'sectorielle'}, j'ai besoin de plus de contexte pour vous fournir une analyse technique approfondie.

**PRÉCISEZ VOTRE DEMANDE :**
• Quel atelier EBIOS RM vous préoccupe ?
• Quelle problématique technique rencontrez-vous ?
• Quel niveau d'analyse souhaitez-vous (stratégique/opérationnel) ?

**DOMAINES D'EXPERTISE DISPONIBLES :**
• Analyse de risques multicritères
• Scénarios d'attaque sophistiqués
• Conformité réglementaire sectorielle
• Architecture de sécurité proportionnée

Reformulez votre question avec le contexte technique nécessaire.`,
      confidence: 0.85,
      learningImpact: 3,
      resources: []
    };
  };

  // 🔍 ANALYSE DU MESSAGE UTILISATEUR
  const analyzeUserMessage = (message: string) => {
    return {
      intent: detectIntent(message),
      domain: detectDomain(message),
      complexity: assessComplexity(message),
      workshop: detectWorkshop(message)
    };
  };

  const detectIntent = (message: string) => {
    if (/comment|pourquoi|qu'est-ce|définition/i.test(message)) return 'question';
    if (/exemple|cas|illustration/i.test(message)) return 'example';
    if (/aide|help|assistance/i.test(message)) return 'help';
    if (/template|modèle|document/i.test(message)) return 'resource';
    return 'general';
  };

  const detectDomain = (message: string) => {
    if (/cadrage|périmètre|valeur métier/i.test(message)) return 'scoping';
    if (/menace|attaque|risque/i.test(message)) return 'threat';
    if (/vulnérabilité|faille|sécurité/i.test(message)) return 'vulnerability';
    if (/impact|conséquence|dommage/i.test(message)) return 'impact';
    return 'general';
  };

  const assessComplexity = (message: string) => {
    const technicalTerms = /SCADA|API|HSM|SIEM|SOC|CERT|CVE|MITRE|ATT&CK/i.test(message);
    const regulatoryTerms = /RGPD|NIS2|HDS|DORA|ACPR|ANSSI/i.test(message);

    if (technicalTerms || regulatoryTerms) return 'expert';
    if (message.length > 100) return 'intermediate';
    return 'basic';
  };

  const detectWorkshop = (message: string) => {
    if (/atelier 1|cadrage/i.test(message)) return 1;
    if (/atelier 2|source.*risque/i.test(message)) return 2;
    if (/atelier 3|scénario.*stratégique/i.test(message)) return 3;
    if (/atelier 4|scénario.*opérationnel/i.test(message)) return 4;
    if (/atelier 5|traitement/i.test(message)) return 5;
    return null;
  };

  // 🎯 GÉNÉRATION D'ACTIONS EXPERTES
  const generateExpertActions = (userMessage: string, config: any): MessageAction[] => {
    const actions: MessageAction[] = [];
    const analysis = analyzeUserMessage(userMessage);

    // Actions basées sur l'analyse experte
    switch (analysis.domain) {
      case 'scoping':
        actions.push({
          id: 'show_scoping_template',
          label: 'Matrice de cadrage ANSSI',
          type: 'download',
          action: () => downloadExpertTemplate('scoping', config.sector),
          variant: 'primary'
        });
        actions.push({
          id: 'show_regulatory_framework',
          label: 'Référentiel réglementaire',
          type: 'button',
          action: () => showRegulatoryFramework(config.sector),
          variant: 'secondary'
        });
        break;

      case 'threat':
        actions.push({
          id: 'show_threat_landscape',
          label: 'Paysage de menaces sectoriel',
          type: 'button',
          action: () => showThreatLandscape(config.sector),
          variant: 'primary'
        });
        actions.push({
          id: 'download_mitre_mapping',
          label: 'Cartographie MITRE ATT&CK',
          type: 'download',
          action: () => downloadMitreMapping(config.sector),
          variant: 'secondary'
        });
        break;

      case 'vulnerability':
        actions.push({
          id: 'show_vuln_assessment',
          label: 'Grille d\'évaluation vulnérabilités',
          type: 'download',
          action: () => downloadVulnTemplate(config.sector),
          variant: 'primary'
        });
        break;

      case 'impact':
        actions.push({
          id: 'show_impact_matrix',
          label: 'Matrice d\'impact sectorielle',
          type: 'button',
          action: () => showImpactMatrix(config.sector),
          variant: 'primary'
        });
        break;
    }

    // Actions contextuelles par atelier
    if (analysis.workshop) {
      actions.push({
        id: `workshop_${analysis.workshop}_guide`,
        label: `Guide Atelier ${analysis.workshop}`,
        type: 'download',
        action: () => downloadWorkshopGuide(analysis.workshop!, config.sector),
        variant: 'secondary'
      });
    }

    // Actions pour utilisateurs experts
    if (analysis.complexity === 'expert') {
      actions.push({
        id: 'show_advanced_analysis',
        label: 'Analyse technique approfondie',
        type: 'button',
        action: () => showAdvancedAnalysis(userMessage, config),
        variant: 'primary'
      });
    }

    return actions;
  };

  // 🎯 GESTION DES TOUCHES
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  // 🎯 GESTION DES FICHIERS
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  }, []);

  // 🎯 ENREGISTREMENT VOCAL
  const toggleRecording = useCallback(() => {
    setIsRecording(prev => !prev);
    // Ici, implémenter la logique d'enregistrement vocal
  }, []);

  // 🎯 RENDU D'UN MESSAGE
  const renderMessage = (message: ConversationMessage) => {
    const isInstructor = message.type === 'instructor';
    const isSystem = message.type === 'system';

    return (
      <div
        key={message.id}
        className={`flex ${isInstructor ? 'justify-start' : isSystem ? 'justify-center' : 'justify-end'} mb-4`}
      >
        <div className={`
          max-w-[80%] rounded-lg px-4 py-3 shadow-sm
          ${isInstructor 
            ? 'bg-blue-50 border border-blue-200' 
            : isSystem 
            ? 'bg-gray-100 border border-gray-200 text-center text-sm'
            : 'bg-blue-600 text-white'
          }
        `}>
          {/* Avatar et nom */}
          {!isSystem && (
            <div className="flex items-center mb-2">
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center mr-2
                ${isInstructor ? 'bg-blue-200' : 'bg-blue-800'}
              `}>
                {isInstructor ? <Bot className="w-4 h-4 text-blue-600" /> : <User className="w-4 h-4 text-white" />}
              </div>
              <span className={`text-sm font-medium ${isInstructor ? 'text-blue-900' : 'text-blue-100'}`}>
                {isInstructor ? 'Formateur IA' : 'Vous'}
              </span>
              <span className={`text-xs ml-2 ${isInstructor ? 'text-blue-600' : 'text-blue-200'}`}>
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          )}

          {/* Contenu du message */}
          <div className={`${isSystem ? 'text-gray-600' : isInstructor ? 'text-gray-800' : 'text-white'}`}>
            {message.content}
          </div>

          {/* Actions du message */}
          {message.metadata?.actions && message.metadata.actions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {message.metadata.actions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`
                    px-3 py-1 rounded text-sm font-medium transition-colors
                    ${action.variant === 'primary' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  {action.type === 'download' && <Download className="w-3 h-3 mr-1 inline" />}
                  {action.type === 'link' && <ExternalLink className="w-3 h-3 mr-1 inline" />}
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Ressources */}
          {message.metadata?.resources && message.metadata.resources.length > 0 && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <div className="flex items-center text-yellow-800 text-sm font-medium mb-1">
                <Lightbulb className="w-4 h-4 mr-1" />
                Ressources suggérées
              </div>
              {message.metadata.resources.map((resource, index) => (
                <div key={index} className="text-sm text-yellow-700">
                  • {resource.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // 🎯 INDICATEUR DE FRAPPE
  const renderTypingIndicator = () => {
    if (!conversation.isTyping) return null;

    return (
      <div className="flex justify-start mb-4">
        <div className="bg-gray-100 rounded-lg px-4 py-3 shadow-sm">
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Le formateur IA réfléchit</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 🎯 FONCTIONS UTILITAIRES EXPERTES
  const downloadExpertTemplate = (type: string, sector: string) => {
    console.log(`Téléchargement template expert: ${type} pour secteur ${sector}`);
    // Logique de téléchargement de templates experts ANSSI
  };

  const showRegulatoryFramework = (sector: string) => {
    const frameworks = {
      healthcare: 'RGPD Art.9, NIS2 Annexe I, HDS, Certification HAS, ASIP Santé',
      finance: 'RGPD, NIS2, DORA, DSP2, ACPR, Bâle III/IV, PCI-DSS',
      industry: 'NIS2, Code Défense (OIV), SEVESO III, IEC 62443'
    };

    actions.addMessage({
      type: 'instructor',
      content: `**RÉFÉRENTIEL RÉGLEMENTAIRE ${sector.toUpperCase()} :**\n${frameworks[sector as keyof typeof frameworks] || 'Référentiel générique'}`
    });
  };

  const showThreatLandscape = (sector: string) => {
    const threats = {
      healthcare: 'Ransomware hospitalier (Ryuk, Conti), Espionnage recherche médicale, Sabotage IoMT, Menaces internes',
      finance: 'APT financiers, Fraude SWIFT, Attaques DDoS, Compromission API DSP2',
      industry: 'Malware industriel (Stuxnet, TRITON), Espionnage industriel, Sabotage SCADA'
    };

    actions.addMessage({
      type: 'instructor',
      content: `**PAYSAGE DE MENACES ${sector.toUpperCase()} :**\n${threats[sector as keyof typeof threats] || 'Menaces génériques'}`
    });
  };

  const downloadMitreMapping = (sector: string) => {
    console.log(`Téléchargement cartographie MITRE ATT&CK pour ${sector}`);
  };

  const downloadVulnTemplate = (sector: string) => {
    console.log(`Téléchargement grille vulnérabilités ${sector}`);
  };

  const showImpactMatrix = (sector: string) => {
    actions.addMessage({
      type: 'instructor',
      content: `**MATRICE D'IMPACT ${sector.toUpperCase()} :**\nImpacts spécialisés selon les enjeux sectoriels...`
    });
  };

  const downloadWorkshopGuide = (workshop: number, sector: string) => {
    console.log(`Téléchargement guide Atelier ${workshop} pour ${sector}`);
  };

  const showAdvancedAnalysis = (message: string, config: any) => {
    actions.addMessage({
      type: 'instructor',
      content: `**ANALYSE TECHNIQUE APPROFONDIE :**\nAnalyse experte de votre demande en cours...`
    });
  };

  // 🎯 RENDU PRINCIPAL - INTERFACE PLEINE HAUTEUR
  return (
    <div className={`training-chat-interface flex flex-col h-full bg-white ${className}`}>
      {/* Zone des messages - Utilise toute la hauteur disponible */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {conversation.messages.map(renderMessage)}
        {renderTypingIndicator()}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie - Design professionnel */}
      <div className="border-t border-gray-200 bg-white shadow-lg">
        {/* Pièces jointes */}
        {attachments.length > 0 && (
          <div className="px-6 pt-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm">
                  <Paperclip className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="text-blue-800">{file.name}</span>
                  <button
                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                    className="ml-2 text-blue-400 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Barre de saisie professionnelle */}
        <div className="p-6">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={conversation.awaitingResponse ? "L'expert ANSSI réfléchit..." : "Posez votre question technique EBIOS RM..."}
                disabled={conversation.awaitingResponse}
                className="w-full resize-none border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all text-gray-900 placeholder-gray-500"
                rows={2}
                style={{ minHeight: '60px', maxHeight: '150px' }}
              />

              {/* Indicateur de caractères */}
              <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                {inputValue.length}/1000
              </div>
            </div>

            {/* Boutons d'action professionnels */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title="Joindre un document"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <button
                onClick={toggleRecording}
                className={`p-3 rounded-lg transition-all ${
                  isRecording
                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                    : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                }`}
                title={isRecording ? "Arrêter l'enregistrement" : "Enregistrement vocal"}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || conversation.awaitingResponse}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
                title="Envoyer la question"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Suggestions rapides */}
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Atelier 1 - Cadrage hospitalier",
              "Analyse des menaces secteur santé",
              "Conformité HDS et NIS2",
              "Scénarios ransomware"
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setInputValue(suggestion)}
                className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
        />
      </div>
    </div>
  );
};

export default TrainingChatInterface;
