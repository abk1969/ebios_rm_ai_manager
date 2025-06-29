/**
 * 🎭 ORCHESTRATEUR D'AGENTS IA EBIOS RM
 * Gère la progression entre les ateliers et coordonne les agents spécialisés
 */

import { EbiosWorkshopAgent, WorkshopProgress } from '../agents/EbiosWorkshopAgent';
import { ResponseValidationService } from './ResponseValidationService';

// 🎯 INTERFACE POUR RÉPONSE AGENTIQUE STRUCTURÉE
export interface AgentResponseData {
  text: string; // Le message principal
  type: 'text' | 'action_suggestions' | 'quiz' | 'info_card' | 'progress_update' | 'workshop_transition';
  actions?: AgentAction[]; // Actions structurées
  progressUpdate?: {
    score: number;
    workshopId: number;
    currentStep?: number;
    completionPercentage?: number;
  };
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  infoCard?: {
    title: string;
    content: string;
    imageUrl?: string;
    resources?: string[];
  };
  metadata?: {
    confidence: number;
    sources: string[];
    timestamp: Date;
    validationScore?: number;
    riskLevel?: string;
    expertPersona?: string;
    adaptationLevel?: string;
    nextRecommendations?: string[];
    fallbackUsed?: boolean;
    workshopStep?: string;
    nextStructuralAction?: string;
    completionPercentage?: number;
    structuredGuidance?: string;
  };
}

export interface AgentAction {
  id: string;
  label: string;
  payload: string;
  type: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  icon?: string;
}

export interface TrainingSession {
  id: string;
  learnerId: string;
  caseStudyId: string;
  currentWorkshop: number;
  overallProgress: number;
  startedAt: Date;
  lastActivity: Date;
  workshopProgresses: Record<number, WorkshopProgress>;
}

export interface CaseStudyContext {
  id: string;
  organization: string;
  description: string;
  sector: string;
  size: string;
  specificities: string[];
  realData: {
    employees: number;
    beds?: number;
    patients?: number;
    systems: string[];
    regulations: string[];
  };
}

export class AgentOrchestrator {
  private agents: Map<number, EbiosWorkshopAgent> = new Map();
  private currentSession: TrainingSession | null = null;
  private validationService: ResponseValidationService;
  private caseStudyContext: CaseStudyContext;

  // 🔄 SYSTÈME ANTI-BOUCLE AVANCÉ
  private conversationHistory: Map<string, string[]> = new Map();
  private responsePatterns: Map<string, number> = new Map();
  private lastResponses: string[] = [];
  private contextualResponses: Map<string, Set<string>> = new Map();
  private userIntentHistory: string[] = [];

  constructor() {
    // Initialisation du service de validation critique
    this.validationService = ResponseValidationService.getInstance();

    // Cas d'étude par défaut : CHU Métropolitain
    this.caseStudyContext = {
      id: 'chu_metropolitan_2024',
      organization: 'CHU Métropolitain',
      description: 'Centre Hospitalier Universitaire de 1200 lits desservant 800 000 habitants',
      sector: 'Santé',
      size: 'Grande organisation (4500 employés)',
      specificities: [
        'Données de santé sensibles (RGPD)',
        'Équipements médicaux connectés',
        'Continuité de service critique',
        'Réglementation HDS stricte',
        'Recherche médicale'
      ],
      realData: {
        employees: 4500,
        beds: 1200,
        patients: 50000, // par an
        systems: [
          'SIH (Système d\'Information Hospitalier)',
          'PACS (Picture Archiving and Communication System)',
          'Équipements médicaux IoT',
          'Système de gestion des identités',
          'Réseau de télémédecine'
        ],
        regulations: ['RGPD', 'HDS', 'ISO 27001', 'Directive NIS2']
      }
    };
  }

  /**
   * 🚀 Initialiser une session de formation
   */
  async initializeSession(learnerId: string, sessionId: string): Promise<TrainingSession> {
    // Initialiser tous les agents pour les 5 ateliers
    for (let i = 1; i <= 5; i++) {
      this.agents.set(i, new EbiosWorkshopAgent(i, this.caseStudyContext));
    }

    this.currentSession = {
      id: sessionId,
      learnerId,
      caseStudyId: this.caseStudyContext.id,
      currentWorkshop: 1,
      overallProgress: 0,
      startedAt: new Date(),
      lastActivity: new Date(),
      workshopProgresses: {
        1: { currentStep: 0, completedSteps: [], validatedDeliverables: [], score: 0, timeSpent: 0 },
        2: { currentStep: 0, completedSteps: [], validatedDeliverables: [], score: 0, timeSpent: 0 },
        3: { currentStep: 0, completedSteps: [], validatedDeliverables: [], score: 0, timeSpent: 0 },
        4: { currentStep: 0, completedSteps: [], validatedDeliverables: [], score: 0, timeSpent: 0 },
        5: { currentStep: 0, completedSteps: [], validatedDeliverables: [], score: 0, timeSpent: 0 }
      }
    };

    return this.currentSession;
  }

  /**
   * 🎯 Obtenir le message d'accueil avec plan d'action concret
   */
  getWelcomeMessage(): string {
    if (!this.currentSession) {
      throw new Error('Session non initialisée');
    }

    return `🎓 **Bonjour ! Je suis Dr. Sophie Cadrage, votre formatrice EBIOS RM.**

Je vais vous accompagner personnellement dans l'analyse des risques du **${this.caseStudyContext.organization}**.

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

Ou posez-moi directement une question si vous préférez !`;
  }

  /**
   * 📍 Commencer un atelier spécifique
   */
  startWorkshop(workshopNumber: number): string {
    if (!this.currentSession) {
      throw new Error('Session non initialisée');
    }

    // Vérifier les prérequis
    if (workshopNumber > 1) {
      const previousWorkshop = this.currentSession.workshopProgresses[workshopNumber - 1];
      if (previousWorkshop.score < 70) {
        return `⚠️ **Prérequis non validés**
        
Vous devez d'abord terminer l'Atelier ${workshopNumber - 1} avec un score minimum de 70% avant de pouvoir accéder à l'Atelier ${workshopNumber}.

Score actuel Atelier ${workshopNumber - 1} : ${previousWorkshop.score}%

Souhaitez-vous reprendre l'Atelier ${workshopNumber - 1} ?`;
      }
    }

    this.currentSession.currentWorkshop = workshopNumber;
    const agent = this.agents.get(workshopNumber);
    
    if (!agent) {
      throw new Error(`Agent pour l'atelier ${workshopNumber} non trouvé`);
    }

    return agent.generateMessage('welcome', {
      caseStudyData: this.caseStudyContext
    });
  }

  /**
   * 💬 TRAITEMENT INTELLIGENT FULL-AGENTIC - VERSION ANSSI EXPERT
   */
  async processLearnerMessage(message: string): Promise<AgentResponseData> {
    if (!this.currentSession) {
      throw new Error('Session non initialisée');
    }

    const currentWorkshop = this.currentSession.currentWorkshop;
    const agent = this.agents.get(currentWorkshop);

    if (!agent) {
      throw new Error(`Agent pour l'atelier ${currentWorkshop} non trouvé`);
    }

    // 🔄 VÉRIFICATION ANTI-BOUCLE
    if (this.isLoopDetected(message)) {
      return this.generateAntiLoopResponse(message);
    }

    // 🧠 ANALYSE CONTEXTUELLE AVANCÉE
    const context = this.buildAdvancedContext(message);

    // 🎯 GÉNÉRATION DE RÉPONSE EXPERTE ANSSI
    const response = await this.generateExpertAgenticResponse(message, agent, context);

    // 📝 ENREGISTREMENT POUR ANTI-BOUCLE
    this.recordInteraction(message, response.text);

    // 📊 MISE À JOUR INTELLIGENTE DE LA PROGRESSION
    await this.updateIntelligentProgress(message, response);

    // 🔄 ADAPTATION DYNAMIQUE DU PARCOURS
    await this.adaptLearningPath(response);

    this.currentSession.lastActivity = new Date();
    return response;
  }

  /**
   * 🧠 Générer une réponse contextuelle intelligente - VERSION FULL-AGENTIC
   */
  private generateContextualResponse = async (
    message: string,
    _agent: EbiosWorkshopAgent
  ): Promise<AgentResponseData> => {
    const currentWorkshop = this.currentSession!.currentWorkshop;
    const progress = this.currentSession!.workshopProgresses[currentWorkshop];

    // Analyser l'intention du message
    const intent = this._analyzeMessageIntent(message);

    // Générer une réponse structurée basée sur l'intention
    switch (intent.type) {
      case 'start_training':
        return {
          text: this.getContextPresentationMessage(),
          type: 'text',
          actions: [
            { id: '1', label: '🏥 Découvrir le CHU', payload: 'Présentez-moi le CHU', type: 'primary', icon: '🏥' },
            { id: '2', label: '📋 Atelier 1 direct', payload: 'Commençons l\'atelier 1', type: 'secondary', icon: '📋' },
            { id: '3', label: '🔍 Identifier les biens', payload: 'Identifions les biens supports', type: 'info', icon: '🔍' },
            { id: '4', label: '❓ Plan personnalisé', payload: 'Que dois-je faire ?', type: 'warning', icon: '❓' }
          ],
          metadata: {
            confidence: 0.9,
            sources: ['EBIOS RM Guide', 'CHU Case Study'],
            timestamp: new Date()
          }
        };
      case 'chu_context':
        return {
          text: this.getCHUAnalysisMessage(),
          type: 'text',
          actions: [
            { id: '1', label: 'Identifions les biens supports', payload: 'Identifions les biens supports', type: 'primary', icon: '🔍' },
            { id: '2', label: 'Questions sur le CHU', payload: 'J\'ai des questions sur le CHU', type: 'secondary', icon: '❓' }
          ],
          metadata: {
            confidence: 0.9,
            sources: ['CHU Case Study'],
            timestamp: new Date()
          }
        };
      case 'start_workshop_1':
        return {
          text: this.getWorkshop1GuidanceMessage(),
          type: 'text',
          actions: [
            { id: '1', label: 'Question sur l\'atelier 1', payload: 'J\'ai une question sur l\'atelier 1', type: 'secondary', icon: '❓' },
            { id: '2', label: 'Passons à l\'étape suivante', payload: 'Étape suivante', type: 'primary', icon: '➡️' }
          ],
          metadata: {
            confidence: 0.9,
            sources: ['EBIOS RM Guide'],
            timestamp: new Date()
          }
        };
      case 'identify_assets':
        return {
          text: this.getAssetsIdentificationMessage(),
          type: 'text',
          actions: [
            { id: '1', label: 'Classement des biens supports', payload: 'Mon classement des biens supports est...', type: 'primary', icon: '📊' },
            { id: '2', label: 'Questions sur les biens supports', payload: 'J\'ai des questions sur les biens supports', type: 'secondary', icon: '❓' }
          ],
          metadata: {
            confidence: 0.9,
            sources: ['EBIOS RM Guide'],
            timestamp: new Date()
          }
        };
      case 'analyze_threats':
        return {
          text: this.getThreatsAnalysisMessage(),
          type: 'text',
          actions: [
            { id: '1', label: 'Quelle est la menace la plus élevée ?', payload: 'La menace la plus élevée est...', type: 'primary', icon: '🚨' },
            { id: '2', label: 'Questions sur les menaces', payload: 'J\'ai des questions sur les menaces', type: 'secondary', icon: '❓' }
          ],
          metadata: {
            confidence: 0.9,
            sources: ['EBIOS RM Guide'],
            timestamp: new Date()
          }
        };
      case 'request_help':
        return this.generateGuidanceResponse(message, _agent, progress); // Réutiliser la fonction de guidage
      case 'request_example':
        return {
          text: "Voici un exemple concret lié à votre question : [Exemple détaillé ici]", // Placeholder
          type: 'info_card',
          infoCard: {
            title: "Exemple Concret",
            content: "Pour l'identification des biens supports, imaginez une attaque par ransomware sur le SIH du CHU. Les biens supports critiques seraient le SIH lui-même, les données patients, et les équipements médicaux connectés qui dépendent du SIH pour fonctionner.",
            resources: ["Cas d'étude CHU", "Atelier 1 EBIOS RM"]
          },
          metadata: {
            confidence: 0.9,
            sources: ['EBIOS RM Guide'],
            timestamp: new Date()
          }
        };
      case 'evaluate_progress':
        return this.generateEvaluationResponse(message, _agent, progress); // Réutiliser la fonction d'évaluation
      case 'question':
        return this.generateQuestionResponse(message, _agent, intent.topic || 'général');
      case 'request_guidance':
        return this.generateGuidanceResponse(message, _agent, progress);
      case 'submit_work':
        return this.generateEvaluationResponse(message, _agent, progress);
      case 'request_next_step':
        return this.generateNextStepResponse(_agent, progress);
      default:
        return this.generateDefaultResponse(message, _agent);
    }
  };

  /**
   * 🎯 Générer une réponse pour une question
   */
  private generateQuestionResponse = (message: string, agent: EbiosWorkshopAgent, topic: string): AgentResponseData => {
    const expertAnswer = agent.generateMessage('question', {
      userInput: message,
      caseStudyData: this.caseStudyContext,
      topic: topic
    });
    const relatedQuestions = this.getRelatedQuestions(topic);

    return {
      text: expertAnswer,
      type: 'text',
      actions: relatedQuestions.map((q, index) => ({
        id: `q${index}`,
        label: q,
        payload: q,
        type: 'secondary' as const,
        icon: '💡'
      })),
      metadata: {
        confidence: 0.8,
        sources: ['EBIOS RM Expert'],
        timestamp: new Date()
      }
    };
  };


  /**
   * 🧭 Générer une réponse de guidage
   */
  private generateGuidanceResponse = (message: string, agent: EbiosWorkshopAgent, progress: WorkshopProgress): AgentResponseData => {
    const guidanceText = agent.generateMessage('guidance', {
      userInput: message,
      progress,
      caseStudyData: this.caseStudyContext
    });

    return {
      text: guidanceText,
      type: 'action_suggestions',
      actions: [
        { id: 'step', label: 'Continuons étape par étape', payload: 'Guidez-moi étape par étape', type: 'primary', icon: '👣' },
        { id: 'question', label: 'Posez-moi une question spécifique', payload: 'J\'ai une question spécifique', type: 'secondary', icon: '❓' },
        { id: 'example', label: 'Montrez-moi un exemple', payload: 'Montrez-moi un exemple concret', type: 'info', icon: '💡' }
      ],
      metadata: {
        confidence: 0.85,
        sources: ['Workshop Agent'],
        timestamp: new Date()
      }
    };
  };

  /**
   * 📊 Générer une réponse d'évaluation
   */
  private generateEvaluationResponse = (message: string, agent: EbiosWorkshopAgent, progress: WorkshopProgress): AgentResponseData => {
    const evaluation = agent.evaluateProgress(message, this.getCurrentStep());

    const response: AgentResponseData = {
      text: evaluation.feedback,
      type: evaluation.canProceed ? 'progress_update' : 'text',
      actions: evaluation.suggestions.map((s, index) => ({
        id: `eval${index}`,
        label: s,
        payload: s,
        type: evaluation.canProceed ? 'success' : 'warning' as const,
        icon: evaluation.canProceed ? '✅' : '🔄'
      })),
      metadata: {
        confidence: evaluation.score / 100,
        sources: ['Evaluation Agent'],
        timestamp: new Date()
      }
    };

    if (evaluation.canProceed) {
      response.progressUpdate = {
        score: Math.max(progress.score, evaluation.score),
        workshopId: this.currentSession!.currentWorkshop,
        currentStep: progress.currentStep + 1,
        completionPercentage: this.calculateOverallProgress()
      };
    }

    return response;
  };

  /**
   * ➡️ Générer une réponse pour l'étape suivante
   */
  private generateNextStepResponse = (agent: EbiosWorkshopAgent, progress: WorkshopProgress): AgentResponseData => {
    const nextActionData = agent.getNextAction(progress);

    return {
      text: nextActionData.message,
      type: 'workshop_transition',
      actions: nextActionData.options.map((option, index) => ({
        id: `next${index}`,
        label: option,
        payload: option,
        type: 'primary' as const,
        icon: '▶️'
      })),
      progressUpdate: {
        score: progress.score,
        workshopId: this.currentSession!.currentWorkshop,
        completionPercentage: this.calculateOverallProgress()
      },
      metadata: {
        confidence: 0.9,
        sources: ['Workshop Navigation'],
        timestamp: new Date()
      }
    };
  };

  /**
   * 🔄 Générer une réponse par défaut
   */
  private generateDefaultResponse = (message: string, agent: EbiosWorkshopAgent): AgentResponseData => {
    const defaultText = agent.generateMessage('guidance', {
      userInput: message,
      caseStudyData: this.caseStudyContext
    });

    return {
      text: defaultText,
      type: 'action_suggestions',
      actions: [
        { id: 'clarify', label: 'Pouvez-vous préciser votre question ?', payload: 'Pouvez-vous préciser ?', type: 'secondary', icon: '❓' },
        { id: 'example', label: 'Souhaitez-vous un exemple ?', payload: 'Montrez-moi un exemple', type: 'info', icon: '💡' },
        { id: 'practice', label: 'Passons à la pratique', payload: 'Exercice pratique', type: 'primary', icon: '🎯' }
      ],
      metadata: {
        confidence: 0.6,
        sources: ['Default Handler'],
        timestamp: new Date()
      }
    };
  };

  /**
   * 🏥 Message de présentation du contexte CHU
   */
  private getContextPresentationMessage = (): string => {
    return `🏥 **PRÉSENTATION DU CHU MÉTROPOLITAIN**

Parfait ! Laissez-moi vous présenter notre cas d'étude :

**📊 PROFIL DE L'ORGANISATION :**
• **Nom :** CHU Métropolitain de la région
• **Taille :** 1 200 lits, 4 500 employés
• **Population :** 800 000 habitants desservis
• **Activités :** Soins, urgences, recherche médicale

**🏗️ INFRASTRUCTURE CRITIQUE :**
• **SIH :** Système d'Information Hospitalier (Oracle Health)
• **PACS :** Imagerie médicale (50 To de données)
• **IoT médical :** 2 500 équipements connectés
• **Réseau :** Fibre optique, WiFi patients/staff

**⚖️ CONTRAINTES RÉGLEMENTAIRES :**
• RGPD (données de santé sensibles)
• Certification HDS (Hébergement Données Santé)
• Directive NIS2 (Opérateur de Services Essentiels)

**🎯 ENJEUX BUSINESS CRITIQUES :**
• Continuité des soins 24h/24
• Protection des données patients
• Recherche médicale (propriété intellectuelle)
• Réputation et confiance publique

**➡️ PROCHAINE ÉTAPE :**
Maintenant que vous connaissez le contexte, tapez **"Identifions les biens supports"** pour commencer l'analyse EBIOS RM !

Des questions sur ce CHU avant de continuer ?`;
  };

  /**
   * 🎯 Message d'analyse du CHU
   */
  private getCHUAnalysisMessage = (): string => {
    return `🔍 **ANALYSE APPROFONDIE DU CHU**

Excellente initiative ! Analysons ensemble les spécificités de ce CHU :

**🚨 POINTS DE VULNÉRABILITÉ IDENTIFIÉS :**

1️⃣ **Équipements médicaux legacy**
   → IRM de 2018 sans patch de sécurité
   → Respirateurs connectés avec mots de passe par défaut
   → Pompes à perfusion sur réseau non segmenté

2️⃣ **Données ultra-sensibles**
   → 50 000 dossiers patients/an
   → Recherche oncologique (données génétiques)
   → Imagerie médicale haute résolution

3️⃣ **Contraintes opérationnelles**
   → Impossible d'arrêter les systèmes critiques
   → Personnel non-technique utilisant l'IT
   → Accès multiples (médecins, externes, patients)

**🎯 EXERCICE PRATIQUE :**
Selon vous, quel serait l'impact d'une cyberattaque qui :
- Chiffre le SIH pendant 48h ?
- Vole les données de 10 000 patients ?
- Paralyse les équipements de réanimation ?

**➡️ VOTRE MISSION :**
Tapez votre analyse de l'impact le plus critique, puis nous passerons à l'identification des biens supports !`;
  };

  /**
   * 📋 Message de guidage Atelier 1
   */
  private getWorkshop1GuidanceMessage = (): string => {
    return `📋 **ATELIER 1 : CADRAGE ET SOCLE DE SÉCURITÉ**

Parfait ! Entrons dans le vif du sujet avec l'Atelier 1.

**🎯 OBJECTIF DE CET ATELIER :**
Définir le périmètre d'étude et identifier les biens supports critiques du CHU.

**📝 ÉTAPES QUE NOUS ALLONS SUIVRE :**

**ÉTAPE 1.1 - Périmètre d'étude (5 min)**
✅ Organisation : CHU Métropolitain
✅ Missions : Soins, urgences, recherche
✅ Périmètre : Systèmes d'information + équipements médicaux

**ÉTAPE 1.2 - Biens supports primaires (15 min)**
🔄 EN COURS → Identification des biens essentiels
- SIH (Système d'Information Hospitalier)
- Données patients
- Équipements médicaux connectés
- Personnel médical

**ÉTAPE 1.3 - Biens supports de soutien (10 min)**
⏳ À VENIR → Infrastructure technique
⏳ À VENIR → Locaux et sécurité physique

**🚀 ACTION IMMÉDIATE :**
Commençons par l'ÉTAPE 1.2.

**QUESTION CONCRÈTE :**
"Dans ce CHU, quel système vous semble le plus critique : le SIH qui gère tous les dossiers patients, ou les équipements de réanimation qui maintiennent les patients en vie ?"

Donnez-moi votre réponse avec votre raisonnement !`;
  };

  /**
   * 🏗️ Message d'identification des biens supports
   */
  private getAssetsIdentificationMessage = (): string => {
    return `🏗️ **IDENTIFICATION DES BIENS SUPPORTS - CHU MÉTROPOLITAIN**

Excellente question ! C'est le cœur de l'Atelier 1.

**📊 MÉTHODE EBIOS RM APPLIQUÉE :**

**🎯 BIENS SUPPORTS PRIMAIRES (Mission critique) :**

1️⃣ **SIH - Système d'Information Hospitalier**
   • Criticité : VITALE ⭐⭐⭐⭐⭐
   • Impact arrêt : Paralysie totale des soins
   • Données : 50 000 patients/an

2️⃣ **Équipements de réanimation**
   • Criticité : VITALE ⭐⭐⭐⭐⭐
   • Impact arrêt : Décès patients
   • Quantité : 120 lits de réa

3️⃣ **PACS - Imagerie médicale**
   • Criticité : IMPORTANTE ⭐⭐⭐⭐
   • Impact arrêt : Retard diagnostics
   • Volume : 50 To d'images

**🔧 BIENS SUPPORTS DE SOUTIEN :**

4️⃣ **Infrastructure réseau**
   • Criticité : IMPORTANTE ⭐⭐⭐⭐
   • Impact arrêt : Isolement des services

5️⃣ **Personnel médical**
   • Criticité : VITALE ⭐⭐⭐⭐⭐
   • Impact absence : Arrêt des soins

**🎯 EXERCICE PRATIQUE :**
Classez ces 5 biens supports par ordre de criticité pour la continuité des soins.

**➡️ PROCHAINE ÉTAPE :**
Une fois votre classement fait, nous passerons à l'évaluation des interdépendances !

Votre classement ?`;
  };

  /**
   * ⚠️ Message d'analyse des menaces
   */
  private getThreatsAnalysisMessage = (): string => {
    return `⚠️ **ANALYSE DES MENACES - SECTEUR SANTÉ**

Excellente transition ! Nous entrons dans l'Atelier 2.

**🎯 MENACES SPÉCIFIQUES AU CHU MÉTROPOLITAIN :**

**🔥 MENACES CYBER CRITIQUES :**

1️⃣ **Ransomware hospitalier**
   • Probabilité : TRÈS ÉLEVÉE 🔴
   • Impact : Paralysie totale 48-72h
   • Exemple récent : CHU de Rouen (2019)

2️⃣ **Vol de données patients**
   • Probabilité : ÉLEVÉE 🟠
   • Impact : Amende RGPD + réputation
   • Volume exposé : 50 000 dossiers

3️⃣ **Sabotage équipements médicaux**
   • Probabilité : MOYENNE 🟡
   • Impact : Décès patients possibles
   • Cible : Respirateurs, pompes

**👥 PROFILS D'ATTAQUANTS :**

🏴‍☠️ **Cybercriminels organisés**
• Motivation : Financière (rançon)
• Capacité : Élevée
• Cible : SIH, données

🕵️ **Espions industriels**
• Motivation : Recherche médicale
• Capacité : Très élevée
• Cible : Propriété intellectuelle

😤 **Employé malveillant**
• Motivation : Vengeance/argent
• Capacité : Accès privilégié
• Cible : Données patients

**🎯 QUESTION STRATÉGIQUE :**
Selon vous, quelle menace représente le risque le plus élevé pour ce CHU ?

Argumentez votre choix avec l'impact potentiel !`;
  };

  /**
   * ❓ Obtenir des questions liées au sujet
   */
  private getRelatedQuestions = (topic: string): string[] => {
    const relatedQuestions: Record<string, string[]> = {
      'biens supports': [
        'Comment évaluer la criticité des biens supports ?',
        'Quelles sont les interdépendances à identifier ?',
        'Comment cartographier les biens supports du CHU ?'
      ],
      'menaces': [
        'Quelles sont les motivations des attaquants ?',
        'Comment évaluer les capacités des sources de menaces ?',
        'Quels sont les vecteurs d\'attaque spécifiques au CHU ?'
      ],
      'général': [
        'Guidez-moi dans l\'étape actuelle',
        'Montrez-moi un exemple concret',
        'Quels sont les livrables attendus ?'
      ]
    };

    return relatedQuestions[topic] || relatedQuestions['général'];
  };

  /**
   * 📍 Obtenir l'étape actuelle
   */
  private getCurrentStep = (): any => {
    // Retourner l'étape actuelle basée sur la progression
    return {
      id: 'current',
      title: 'Étape actuelle',
      description: 'Étape en cours de l\'atelier',
      objectives: [],
      deliverables: [],
      duration: 15
    };
  };

  /**
   * 📊 Obtenir le statut de la session
   */
  getSessionStatus(): {
    currentWorkshop: number;
    overallProgress: number;
    workshopProgress: WorkshopProgress;
    nextMilestone: string;
  } {
    if (!this.currentSession) {
      throw new Error('Session non initialisée');
    }

    const currentProgress = this.currentSession.workshopProgresses[this.currentSession.currentWorkshop];
    
    return {
      currentWorkshop: this.currentSession.currentWorkshop,
      overallProgress: this.calculateOverallProgress(),
      workshopProgress: currentProgress,
      nextMilestone: this.getNextMilestone()
    };
  }

  /**
   * 📈 Calculer la progression globale
   */
  private calculateOverallProgress = (): number => {
    if (!this.currentSession) return 0;

    const totalScore = Object.values(this.currentSession.workshopProgresses)
      .reduce((sum, progress) => sum + progress.score, 0);
    
    return Math.round(totalScore / 5); // Moyenne sur 5 ateliers
  };

  /**
   * 🎯 Obtenir le prochain jalon
   */
  private getNextMilestone = (): string => {
    if (!this.currentSession) return '';

    const current = this.currentSession.currentWorkshop;
    const progress = this.currentSession.workshopProgresses[current];

    if (progress.score < 70) {
      return `Terminer l'Atelier ${current}`;
    } else if (current < 5) {
      return `Commencer l'Atelier ${current + 1}`;
    } else {
      return 'Formation terminée !';
    }
  };

  /**
   * 🧠 CONSTRUCTION DU CONTEXTE AVANCÉ POUR IA EXPERTE
   */
  private buildAdvancedContext(message: string): {
    learnerProfile: any;
    currentState: any;
    ebiosContext: any;
    expertLevel: string;
    nextActions: string[];
  } {
    const currentWorkshop = this.currentSession!.currentWorkshop;
    const progress = this.currentSession!.workshopProgresses[currentWorkshop];

    return {
      learnerProfile: {
        currentWorkshop,
        overallProgress: this.calculateOverallProgress(),
        strengths: this.identifyLearnerStrengths(),
        weaknesses: this.identifyLearnerWeaknesses(),
        preferredLearningStyle: this.detectLearningStyle(message)
      },
      currentState: {
        workshopProgress: progress,
        timeSpent: progress.timeSpent,
        lastInteractions: this.getRecentInteractions(),
        strugglingAreas: this.identifyStrugglingAreas()
      },
      ebiosContext: {
        organization: this.caseStudyContext.organization,
        sector: this.caseStudyContext.sector,
        criticalAssets: this.caseStudyContext.realData.systems,
        regulations: this.caseStudyContext.realData.regulations,
        currentPhase: this.getCurrentEbiosPhase()
      },
      expertLevel: this.determineExpertLevel(),
      nextActions: this.generateIntelligentNextActions()
    };
  }

  /**
   * 🎯 MOTEUR IA STRUCTURANT EBIOS RM - ORCHESTRATION WORKSHOP PAR WORKSHOP
   */
  private async generateExpertAgenticResponse(
    message: string,
    _agent: EbiosWorkshopAgent,
    context: any
  ): Promise<AgentResponseData> {
    console.log('🎯 Génération réponse experte pour:', message);
    const currentWorkshop = context.learnerProfile.currentWorkshop;
    const progress = context.currentState.workshopProgress;
    console.log('📊 Workshop actuel:', currentWorkshop, 'Progression:', progress);

    // 🔍 ANALYSE CONTEXTUELLE AVANCÉE DU MESSAGE
    const messageAnalysis = this.analyzeMessageInWorkshopContext(message, currentWorkshop, progress);
    console.log('🔍 Analyse message:', messageAnalysis);

    // 🎯 DÉTERMINATION DE L'ACTION IA STRUCTURANTE
    const structuralAction = this.determineStructuralAction(messageAnalysis, currentWorkshop, progress);

    // 🏗️ GÉNÉRATION DE CONTENU STRUCTURÉ PAR WORKSHOP
    const structuredContent = await this.generateStructuredWorkshopContent(
      structuralAction,
      currentWorkshop,
      progress,
      context
    );

    // ✅ VALIDATION CRITIQUE AVANT ENVOI
    const validationResult = this.validationService.validateResponse(
      structuredContent.content,
      {
        workshop: currentWorkshop,
        userMessage: message,
        learnerLevel: context.expertLevel,
        organizationContext: context.ebiosContext.organization
      }
    );

    // 🚨 FALLBACK SI NON CONFORME
    if (!validationResult.isValid) {
      return this.generateStructuredFallback(currentWorkshop, context);
    }

    // 🎯 ACTIONS STRUCTURÉES PAR ÉTAPE
    const structuredActions = this.generateStructuredActions(structuralAction, currentWorkshop, progress);

    // 📊 MISE À JOUR PROGRESSION STRUCTURÉE
    const progressUpdate = this.calculateStructuredProgress(structuralAction, progress);

    return {
      text: structuredContent.content,
      type: structuredContent.type,
      actions: structuredActions,
      progressUpdate: progressUpdate,
      quiz: structuredContent.quiz,
      infoCard: structuredContent.infoCard,
      metadata: {
        confidence: structuredContent.confidence,
        sources: structuredContent.sources,
        timestamp: new Date(),
        workshopStep: structuralAction.step,
        nextStructuralAction: structuralAction.nextAction,
        completionPercentage: progressUpdate.completionPercentage,
        structuredGuidance: structuralAction.guidance
      }
    };
  }

  /**
   * 📊 MISE À JOUR INTELLIGENTE DE LA PROGRESSION
   */
  private async updateIntelligentProgress(message: string, response: AgentResponseData): Promise<void> {
    const currentWorkshop = this.currentSession!.currentWorkshop;
    const progress = this.currentSession!.workshopProgresses[currentWorkshop];

    // Analyse de la qualité de l'interaction
    const interactionQuality = this.assessInteractionQuality(message, response);

    // Mise à jour adaptative du score
    const newScore = this.calculateAdaptiveScore(progress.score, interactionQuality);

    // Identification des compétences acquises
    const skillsAcquired = this.identifySkillsAcquired(message, response);

    // Mise à jour de la progression
    progress.score = newScore;
    progress.timeSpent += this.calculateInteractionTime();

    if (skillsAcquired.length > 0) {
      progress.validatedDeliverables.push(...skillsAcquired);
    }

    // Déclenchement d'événements de progression
    this.triggerProgressEvents(progress, interactionQuality);
  }

  /**
   * 🔄 ADAPTATION DYNAMIQUE DU PARCOURS D'APPRENTISSAGE
   */
  private async adaptLearningPath(_response: AgentResponseData): Promise<void> {
    const currentWorkshop = this.currentSession!.currentWorkshop;
    const progress = this.currentSession!.workshopProgresses[currentWorkshop];

    // Analyse des difficultés détectées
    const difficulties = this.detectLearningDifficulties(progress);

    // Adaptation du niveau de complexité
    if (difficulties.length > 0) {
      await this.simplifyNextInteractions(difficulties);
    } else if (progress.score > 85) {
      await this.increaseChallengeLevel();
    }

    // Recommandations personnalisées
    const personalizedRecommendations = this.generatePersonalizedRecommendations(progress);

    // Mise à jour du parcours
    this.updateLearningPathway(personalizedRecommendations);
  }

  /**
   * 🧠 Analyser l'intention du message de l'apprenant
   */
  private _analyzeMessageIntent(message: string): {
    type: string;
    confidence: number;
    topic?: string;
    keywords: string[];
  } {
    const lowerMessage = message.toLowerCase().trim();

    // Mots-clés pour chaque intention
    const intentPatterns = {
      start_training: ['go', 'commencer', 'démarrer', 'start', 'commençons', 'allons-y'],
      chu_context: ['chu', 'hôpital', 'contexte', 'organisation', 'présent', 'découvrir'],
      start_workshop_1: ['atelier 1', 'workshop 1', 'cadrage', 'socle', 'biens supports'],
      identify_assets: ['biens supports', 'assets', 'identifier', 'systèmes', 'sih', 'pacs'],
      analyze_threats: ['menaces', 'threats', 'risques', 'attaquants', 'cyberattaque'],
      request_help: ['aide', 'help', 'guidez', 'comment', 'que faire', 'perdu'],
      request_example: ['exemple', 'example', 'montrez', 'concret', 'illustration'],
      evaluate_progress: ['score', 'progression', 'évaluation', 'résultat', 'validation'],
      question: ['?', 'pourquoi', 'comment', 'qu\'est-ce', 'quelle', 'quel'],
      request_guidance: ['guidage', 'étape', 'suivant', 'prochaine', 'direction'],
      submit_work: ['terminé', 'fini', 'soumis', 'validation', 'mon travail'],
      request_next_step: ['suivant', 'next', 'étape suivante', 'continuer', 'après']
    };

    let bestMatch = { type: 'question', confidence: 0.3, keywords: [] as string[] };

    // Analyser chaque pattern
    for (const [intentType, keywords] of Object.entries(intentPatterns)) {
      const matches = keywords.filter(keyword => lowerMessage.includes(keyword));
      const confidence = matches.length / keywords.length;

      if (confidence > bestMatch.confidence) {
        bestMatch = {
          type: intentType,
          confidence,
          keywords: matches
        };
      }
    }

    // Déterminer le topic pour les questions
    let topic = 'général';
    if (bestMatch.type === 'question') {
      if (lowerMessage.includes('bien') || lowerMessage.includes('asset') || lowerMessage.includes('système')) {
        topic = 'biens supports';
      } else if (lowerMessage.includes('menace') || lowerMessage.includes('threat') || lowerMessage.includes('attaque')) {
        topic = 'menaces';
      } else if (lowerMessage.includes('atelier') || lowerMessage.includes('workshop')) {
        topic = 'atelier';
      }
    }

    return {
      type: bestMatch.type,
      confidence: Math.min(bestMatch.confidence + 0.2, 1.0), // Boost de confiance
      topic,
      keywords: bestMatch.keywords
    };
  }

  // ========================================
  // 🧠 MÉTHODES D'INTELLIGENCE ARTIFICIELLE AVANCÉE
  // ========================================

  /**
   * 🎯 Identifier les forces de l'apprenant
   */
  private identifyLearnerStrengths(): string[] {
    const currentWorkshop = this.currentSession!.currentWorkshop;
    const progress = this.currentSession!.workshopProgresses[currentWorkshop];

    const strengths: string[] = [];

    if (progress.score > 80) strengths.push('Excellente compréhension des concepts');
    if (progress.timeSpent < 1800) strengths.push('Apprentissage rapide'); // < 30min
    if (progress.validatedDeliverables.length > 2) strengths.push('Bonne application pratique');
    if (progress.completedSteps.length > 1) strengths.push('Progression méthodique');

    return strengths.length > 0 ? strengths : ['Motivation à apprendre'];
  }

  /**
   * 🎯 Identifier les faiblesses de l'apprenant
   */
  private identifyLearnerWeaknesses(): string[] {
    const currentWorkshop = this.currentSession!.currentWorkshop;
    const progress = this.currentSession!.workshopProgresses[currentWorkshop];

    const weaknesses: string[] = [];

    if (progress.score < 50) weaknesses.push('Difficultés de compréhension');
    if (progress.timeSpent > 3600) weaknesses.push('Besoin de plus de temps'); // > 1h
    if (progress.validatedDeliverables.length === 0) weaknesses.push('Application pratique à améliorer');
    if (progress.completedSteps.length === 0) weaknesses.push('Démarrage difficile');

    return weaknesses;
  }

  /**
   * 🎯 Détecter le style d'apprentissage préféré
   */
  private detectLearningStyle(message: string): 'visual' | 'auditory' | 'kinesthetic' | 'reading' {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('exemple') || lowerMessage.includes('montrez') || lowerMessage.includes('voir')) {
      return 'visual';
    }
    if (lowerMessage.includes('expliquez') || lowerMessage.includes('dites') || lowerMessage.includes('écoutez')) {
      return 'auditory';
    }
    if (lowerMessage.includes('faire') || lowerMessage.includes('pratiquer') || lowerMessage.includes('exercice')) {
      return 'kinesthetic';
    }

    return 'reading'; // Par défaut
  }

  /**
   * 🎯 Obtenir les interactions récentes
   */
  private getRecentInteractions(): any[] {
    // Simulation d'historique d'interactions
    return [
      { type: 'question', timestamp: new Date(Date.now() - 300000), quality: 'good' },
      { type: 'response', timestamp: new Date(Date.now() - 180000), quality: 'excellent' },
      { type: 'exercise', timestamp: new Date(Date.now() - 60000), quality: 'average' }
    ];
  }

  /**
   * 🎯 Identifier les domaines de difficulté
   */
  private identifyStrugglingAreas(): string[] {
    const currentWorkshop = this.currentSession!.currentWorkshop;
    const progress = this.currentSession!.workshopProgresses[currentWorkshop];

    const strugglingAreas: string[] = [];

    if (progress.score < 60) {
      switch (currentWorkshop) {
        case 1:
          strugglingAreas.push('Identification des biens supports', 'Évaluation de criticité');
          break;
        case 2:
          strugglingAreas.push('Analyse des menaces', 'Caractérisation des sources de risque');
          break;
        case 3:
          strugglingAreas.push('Scénarios stratégiques', 'Évaluation d\'impact');
          break;
        case 4:
          strugglingAreas.push('Chemins d\'attaque', 'Scénarios opérationnels');
          break;
        case 5:
          strugglingAreas.push('Traitement des risques', 'Mesures de sécurité');
          break;
      }
    }

    return strugglingAreas;
  }

  /**
   * 🎯 Obtenir la phase EBIOS actuelle
   */
  private getCurrentEbiosPhase(): string {
    const currentWorkshop = this.currentSession!.currentWorkshop;
    const phases = [
      'Cadrage et socle de sécurité',
      'Sources de risque',
      'Scénarios stratégiques',
      'Scénarios opérationnels',
      'Traitement du risque'
    ];

    return phases[currentWorkshop - 1] || 'Phase inconnue';
  }

  /**
   * 🎯 Déterminer le niveau d'expertise
   */
  private determineExpertLevel(): string {
    const overallProgress = this.calculateOverallProgress();

    if (overallProgress > 80) return 'expert';
    if (overallProgress > 50) return 'intermediate';
    return 'beginner';
  }

  /**
   * 🎯 Générer les prochaines actions intelligentes
   */
  private generateIntelligentNextActions(): string[] {
    const currentWorkshop = this.currentSession!.currentWorkshop;
    const progress = this.currentSession!.workshopProgresses[currentWorkshop];

    const actions: string[] = [];

    if (progress.score < 70) {
      actions.push('Réviser les concepts fondamentaux');
      actions.push('Demander des clarifications');
    } else {
      actions.push('Passer à l\'étape suivante');
      actions.push('Approfondir les concepts avancés');
    }

    actions.push('Poser une question spécifique');
    actions.push('Voir un exemple concret');

    return actions;
  }

  /**
   * 🔍 Analyse sémantique avancée du message
   */
  private performSemanticAnalysis(message: string, _context: any): any {
    const intent = this._analyzeMessageIntent(message);

    return {
      intent: intent.type,
      confidence: intent.confidence,
      complexity: this.assessMessageComplexity(message),
      emotionalTone: this.detectEmotionalTone(message),
      technicalLevel: this.assessTechnicalLevel(message),
      learningNeed: this.identifyLearningNeed(message, _context),
      urgency: this.assessUrgency(message),
      contextRelevance: this.assessContextRelevance(message, _context)
    };
  }

  /**
   * 🧠 Sélection de l'expert IA approprié
   */
  private selectExpertPersona(semanticAnalysis: any, context: any): any {
    const expertPersonas = {
      'anssi_expert': {
        name: 'Dr. Marie ANSSI',
        expertise: 'Cybersécurité réglementaire et conformité',
        style: 'Précis, méthodique, références normatives',
        specialties: ['EBIOS RM', 'Réglementation', 'Audit sécurité']
      },
      'hospital_expert': {
        name: 'Dr. Pierre Santé',
        expertise: 'Sécurité des systèmes hospitaliers',
        style: 'Pragmatique, orienté terrain, exemples concrets',
        specialties: ['SIH', 'Dispositifs médicaux', 'Continuité soins']
      },
      'pedagogical_expert': {
        name: 'Prof. Sophie Formation',
        expertise: 'Pédagogie EBIOS RM',
        style: 'Bienveillant, progressif, encourageant',
        specialties: ['Formation', 'Accompagnement', 'Évaluation']
      }
    };

    // Sélection intelligente basée sur le contexte
    if (semanticAnalysis.technicalLevel === 'high' && context.expertLevel === 'expert') {
      return expertPersonas.anssi_expert;
    }
    if (context.ebiosContext.sector === 'Santé') {
      return expertPersonas.hospital_expert;
    }

    return expertPersonas.pedagogical_expert;
  }

  /**
   * 📋 Génération de contenu expert contextualisé
   */
  private async generateExpertContent(semanticAnalysis: any, expertPersona: any, context: any): Promise<any> {
    const currentWorkshop = context.learnerProfile.currentWorkshop;
    const strugglingAreas = context.currentState.strugglingAreas;

    // Contenu expert spécialisé par atelier
    const expertContent = this.getExpertContentByWorkshop(currentWorkshop, semanticAnalysis, context);

    // Adaptation au niveau de l'apprenant
    const adaptedContent = this.adaptContentToLearnerLevel(expertContent, context.expertLevel);

    // Personnalisation selon l'expert
    const personalizedContent = this.personalizeWithExpertVoice(adaptedContent, expertPersona);

    return {
      response: personalizedContent.text,
      responseType: this.determineResponseType(semanticAnalysis),
      confidence: 0.95,
      sources: personalizedContent.sources,
      quiz: personalizedContent.quiz,
      infoCard: personalizedContent.infoCard
    };
  }

  /**
   * 🎯 Génération d'actions intelligentes contextuelles
   */
  private generateIntelligentActions(semanticAnalysis: any, context: any): any[] {
    const actions: any[] = [];
    const currentWorkshop = context.learnerProfile.currentWorkshop;
    const strugglingAreas = context.currentState.strugglingAreas;

    // Actions basées sur les difficultés détectées
    if (strugglingAreas.length > 0) {
      actions.push({
        id: 'help_struggling',
        label: `💡 Aide sur: ${strugglingAreas[0]}`,
        payload: `Expliquez-moi ${strugglingAreas[0]} avec un exemple concret`,
        type: 'primary',
        icon: '🆘'
      });
    }

    // Actions basées sur le niveau
    if (context.expertLevel === 'beginner') {
      actions.push({
        id: 'simplified_explanation',
        label: '📚 Explication simplifiée',
        payload: 'Expliquez-moi cela plus simplement',
        type: 'secondary',
        icon: '📖'
      });
    }

    // Actions contextuelles par atelier
    const workshopActions = this.getWorkshopSpecificActions(currentWorkshop);
    actions.push(...workshopActions);

    // Action de progression
    if (context.learnerProfile.overallProgress > 70) {
      actions.push({
        id: 'next_step',
        label: '➡️ Étape suivante',
        payload: 'Passons à l\'étape suivante',
        type: 'success',
        icon: '🚀'
      });
    }

    return actions;
  }

  /**
   * 🔄 Calcul de l'adaptation du parcours
   */
  private calculatePathAdaptation(context: any): any {
    const currentWorkshop = context.learnerProfile.currentWorkshop;
    const progress = context.currentState.workshopProgress;

    let adaptationLevel = 'normal';
    let recommendations: string[] = [];

    // Adaptation basée sur les performances
    if (progress.score < 50) {
      adaptationLevel = 'simplified';
      recommendations.push('Révision des concepts de base');
      recommendations.push('Exercices pratiques supplémentaires');
    } else if (progress.score > 85) {
      adaptationLevel = 'advanced';
      recommendations.push('Approfondissement des concepts');
      recommendations.push('Cas d\'usage complexes');
    }

    return {
      level: adaptationLevel,
      recommendations,
      progressUpdate: {
        score: progress.score,
        workshopId: currentWorkshop,
        completionPercentage: context.learnerProfile.overallProgress
      }
    };
  }

  // ========================================
  // 🔍 MÉTHODES D'ANALYSE SÉMANTIQUE AVANCÉE
  // ========================================

  /**
   * 📊 Évaluer la complexité du message
   */
  private assessMessageComplexity(message: string): 'low' | 'medium' | 'high' {
    const technicalTerms = /EBIOS|ANSSI|RGPD|NIS2|HDS|SIH|PACS|IoMT|MITRE|ATT&CK/gi;
    const complexStructure = /\b(comment|pourquoi|dans quelle mesure|quels sont les impacts)\b/gi;

    const techMatches = (message.match(technicalTerms) || []).length;
    const structMatches = (message.match(complexStructure) || []).length;

    if (techMatches > 2 || structMatches > 1 || message.length > 200) return 'high';
    if (techMatches > 0 || structMatches > 0 || message.length > 50) return 'medium';
    return 'low';
  }

  /**
   * 😊 Détecter le ton émotionnel
   */
  private detectEmotionalTone(message: string): 'frustrated' | 'confused' | 'confident' | 'neutral' {
    const frustrated = /difficile|compliqué|perdu|bloqué|aide|problème/gi;
    const confused = /comprends pas|comment|pourquoi|qu'est-ce|unclear/gi;
    const confident = /parfait|excellent|compris|facile|ok|d'accord/gi;

    if (message.match(frustrated)) return 'frustrated';
    if (message.match(confused)) return 'confused';
    if (message.match(confident)) return 'confident';
    return 'neutral';
  }

  /**
   * 🔧 Évaluer le niveau technique
   */
  private assessTechnicalLevel(message: string): 'basic' | 'intermediate' | 'advanced' {
    const basicTerms = /aide|exemple|simple|facile|commencer/gi;
    const advancedTerms = /architecture|implémentation|méthodologie|conformité|audit/gi;
    const expertTerms = /SCADA|API|HSM|SIEM|SOC|CERT|CVE|MITRE|ATT&CK/gi;

    if (message.match(expertTerms)) return 'advanced';
    if (message.match(advancedTerms)) return 'intermediate';
    return 'basic';
  }

  /**
   * 🎯 Identifier le besoin d'apprentissage
   */
  private identifyLearningNeed(message: string, context: any): string {
    const needPatterns = {
      'conceptual_understanding': /qu'est-ce|définition|concept|principe/gi,
      'practical_application': /comment faire|exemple|pratique|appliquer/gi,
      'validation': /correct|juste|bon|validation|vérification/gi,
      'progression': /suivant|après|continuer|étape/gi,
      'clarification': /expliquer|clarifier|préciser|détailler/gi
    };

    for (const [need, pattern] of Object.entries(needPatterns)) {
      if (message.match(pattern)) return need;
    }

    return 'general_guidance';
  }

  /**
   * ⚡ Évaluer l'urgence
   */
  private assessUrgency(message: string): 'low' | 'medium' | 'high' {
    const highUrgency = /urgent|rapidement|bloqué|problème|erreur/gi;
    const mediumUrgency = /bientôt|maintenant|aujourd'hui/gi;

    if (message.match(highUrgency)) return 'high';
    if (message.match(mediumUrgency)) return 'medium';
    return 'low';
  }

  /**
   * 🎯 Évaluer la pertinence contextuelle
   */
  private assessContextRelevance(message: string, context: any): number {
    const currentWorkshop = context.learnerProfile.currentWorkshop;
    const workshopKeywords = {
      1: ['cadrage', 'périmètre', 'biens supports', 'socle', 'sécurité'],
      2: ['menaces', 'sources', 'risque', 'attaquants', 'vulnérabilités'],
      3: ['scénarios', 'stratégiques', 'impact', 'vraisemblance'],
      4: ['opérationnels', 'chemins', 'attaque', 'techniques'],
      5: ['traitement', 'mesures', 'sécurité', 'plan', 'mise en œuvre']
    };

    const keywords = workshopKeywords[currentWorkshop as keyof typeof workshopKeywords] || [];
    const matches = keywords.filter(keyword =>
      message.toLowerCase().includes(keyword)
    ).length;

    return Math.min(matches / keywords.length, 1.0);
  }

  /**
   * 📚 Obtenir le contenu expert par atelier
   */
  private getExpertContentByWorkshop(workshop: number, semanticAnalysis: any, context: any): any {
    const expertContents = {
      1: {
        title: 'Atelier 1 - Cadrage et Socle de Sécurité',
        concepts: ['Biens supports', 'Valeurs métier', 'Périmètre d\'étude', 'Socle de sécurité'],
        expertGuidance: `Dans le contexte hospitalier du ${context.ebiosContext.organization}, l'identification des biens supports critiques nécessite une approche méthodique...`,
        practicalExample: 'Pour un CHU, les biens supports primaires incluent le SIH, les équipements de réanimation, et les données patients...'
      },
      2: {
        title: 'Atelier 2 - Sources de Risque',
        concepts: ['Sources de menaces', 'Capacités', 'Motivations', 'Caractérisation'],
        expertGuidance: `L'analyse des sources de risque en milieu hospitalier révèle des acteurs spécifiques...`,
        practicalExample: 'Les cybercriminels spécialisés dans le ransomware hospitalier comme Conti ou Ryuk...'
      },
      3: {
        title: 'Atelier 3 - Scénarios Stratégiques',
        concepts: ['Scénarios de risque', 'Impact métier', 'Vraisemblance', 'Gravité'],
        expertGuidance: `La construction de scénarios stratégiques pour un établissement de santé...`,
        practicalExample: 'Scénario : Compromission du SIH par ransomware pendant 72h...'
      },
      4: {
        title: 'Atelier 4 - Scénarios Opérationnels',
        concepts: ['Chemins d\'attaque', 'Techniques', 'Faisabilité', 'Points de contrôle'],
        expertGuidance: `L'analyse des chemins d'attaque opérationnels dans l'environnement hospitalier...`,
        practicalExample: 'Chemin d\'attaque : Phishing → Compromission poste → Mouvement latéral → SIH...'
      },
      5: {
        title: 'Atelier 5 - Traitement du Risque',
        concepts: ['Stratégies de traitement', 'Mesures de sécurité', 'Plan d\'action', 'Validation'],
        expertGuidance: `Le plan de traitement des risques pour un CHU doit prioriser...`,
        practicalExample: 'Mesures prioritaires : Segmentation réseau, sauvegarde offline, formation...'
      }
    };

    return expertContents[workshop as keyof typeof expertContents] || expertContents[1];
  }

  /**
   * 🎓 Adapter le contenu au niveau de l'apprenant
   */
  private adaptContentToLearnerLevel(content: any, expertLevel: string): any {
    switch (expertLevel) {
      case 'beginner':
        return {
          ...content,
          explanation: `🎓 **NIVEAU DÉBUTANT**\n\n${content.expertGuidance}\n\n**💡 Pour bien comprendre :**\n${content.practicalExample}`,
          complexity: 'simplified',
          examples: 3
        };
      case 'intermediate':
        return {
          ...content,
          explanation: `🎯 **NIVEAU INTERMÉDIAIRE**\n\n${content.expertGuidance}\n\n**🔍 Analyse approfondie :**\n${content.practicalExample}`,
          complexity: 'standard',
          examples: 2
        };
      case 'expert':
        return {
          ...content,
          explanation: `🏆 **NIVEAU EXPERT**\n\n${content.expertGuidance}\n\n**⚡ Application avancée :**\n${content.practicalExample}`,
          complexity: 'advanced',
          examples: 1
        };
      default:
        return content;
    }
  }

  /**
   * 🎭 Personnaliser avec la voix de l'expert
   */
  private personalizeWithExpertVoice(content: any, expertPersona: any): any {
    const personalizedText = `**${expertPersona.name}** - *${expertPersona.expertise}*

${content.explanation}

**🎯 Mon conseil d'expert :**
En tant que spécialiste ${expertPersona.specialties.join(', ')}, je recommande de ${this.generatePersonalizedAdvice(content, expertPersona)}.

**📚 Sources de référence :**`;

    return {
      text: personalizedText,
      sources: this.getExpertSources(expertPersona),
      quiz: this.generateContextualQuiz(content),
      infoCard: this.generateExpertInfoCard(content, expertPersona)
    };
  }

  /**
   * 🎯 Générer un conseil personnalisé
   */
  private generatePersonalizedAdvice(content: any, expertPersona: any): string {
    const adviceTemplates = {
      'anssi_expert': 'suivre rigoureusement la méthodologie ANSSI et documenter chaque étape pour la conformité réglementaire',
      'hospital_expert': 'prioriser la continuité des soins et adapter les mesures aux contraintes opérationnelles hospitalières',
      'pedagogical_expert': 'procéder étape par étape en validant votre compréhension avant de passer au concept suivant'
    };

    return adviceTemplates[expertPersona.name.includes('ANSSI') ? 'anssi_expert' :
                          expertPersona.name.includes('Santé') ? 'hospital_expert' :
                          'pedagogical_expert'] || 'adapter votre approche au contexte spécifique';
  }

  /**
   * 📚 Obtenir les sources expertes
   */
  private getExpertSources(expertPersona: any): string[] {
    const sources = {
      'anssi_expert': [
        'Guide ANSSI - EBIOS Risk Manager',
        'Référentiel de sécurité pour le cloud',
        'Guide de classification des données'
      ],
      'hospital_expert': [
        'Guide ANSSI - Sécurité des systèmes d\'information de santé',
        'Référentiel HDS v1.1',
        'Politique générale de sécurité des systèmes d\'information de santé'
      ],
      'pedagogical_expert': [
        'Méthode EBIOS Risk Manager - Guide pratique',
        'Cas d\'usage sectoriels EBIOS RM',
        'Formation ANSSI - Analyse de risques'
      ]
    };

    return sources[expertPersona.name.includes('ANSSI') ? 'anssi_expert' :
                   expertPersona.name.includes('Santé') ? 'hospital_expert' :
                   'pedagogical_expert'] || sources.pedagogical_expert;
  }

  /**
   * 🧠 Générer un quiz contextuel
   */
  private generateContextualQuiz(content: any): any {
    // Quiz adaptatif basé sur le contenu
    const quizzes = {
      'Atelier 1': {
        question: 'Dans le contexte du CHU métropolitain, quel est le bien support le plus critique ?',
        options: [
          'Le système de climatisation',
          'Le SIH (Système d\'Information Hospitalier)',
          'Le parking des visiteurs',
          'La cafétéria'
        ],
        correctAnswer: 1,
        explanation: 'Le SIH est critique car il gère tous les dossiers patients et la continuité des soins dépend de sa disponibilité.'
      },
      'Atelier 2': {
        question: 'Quelle est la principale motivation des cybercriminels ciblant les hôpitaux ?',
        options: [
          'L\'espionnage industriel',
          'Le gain financier via ransomware',
          'La perturbation politique',
          'La recherche académique'
        ],
        correctAnswer: 1,
        explanation: 'Les cybercriminels ciblent les hôpitaux principalement pour le gain financier, sachant que ces établissements paieront rapidement pour restaurer les soins.'
      }
    };

    return quizzes[content.title?.includes('Atelier 1') ? 'Atelier 1' : 'Atelier 2'] || null;
  }

  /**
   * 📋 Générer une carte d'information experte
   */
  private generateExpertInfoCard(content: any, expertPersona: any): any {
    return {
      title: `💡 Conseil Expert - ${expertPersona.name}`,
      content: `**Spécialité :** ${expertPersona.expertise}

**Point clé à retenir :**
${content.practicalExample}

**Application pratique :**
Appliquez cette connaissance directement à votre analyse du CHU métropolitain.`,
      resources: [
        'Guide méthodologique détaillé',
        'Exemples sectoriels',
        'Templates d\'analyse'
      ]
    };
  }

  /**
   * 🎯 Déterminer le type de réponse
   */
  private determineResponseType(semanticAnalysis: any): string {
    if (semanticAnalysis.learningNeed === 'validation') return 'quiz';
    if (semanticAnalysis.complexity === 'high') return 'info_card';
    if (semanticAnalysis.emotionalTone === 'frustrated') return 'action_suggestions';
    return 'text';
  }

  /**
   * 🎯 Obtenir les actions spécifiques par atelier
   */
  private getWorkshopSpecificActions(workshop: number): any[] {
    const workshopActions = {
      1: [
        { id: 'identify_assets', label: '🏗️ Identifier les biens supports', payload: 'Aidez-moi à identifier les biens supports du CHU', type: 'primary', icon: '🔍' },
        { id: 'assess_criticality', label: '⚖️ Évaluer la criticité', payload: 'Comment évaluer la criticité des biens supports ?', type: 'secondary', icon: '📊' }
      ],
      2: [
        { id: 'analyze_threats', label: '⚠️ Analyser les menaces', payload: 'Quelles sont les menaces spécifiques au secteur santé ?', type: 'primary', icon: '🎯' },
        { id: 'characterize_sources', label: '🕵️ Caractériser les sources', payload: 'Comment caractériser les sources de risque ?', type: 'secondary', icon: '🔍' }
      ],
      3: [
        { id: 'build_scenarios', label: '📋 Construire les scénarios', payload: 'Aidez-moi à construire des scénarios stratégiques', type: 'primary', icon: '🎭' },
        { id: 'assess_impact', label: '💥 Évaluer l\'impact', payload: 'Comment évaluer l\'impact des scénarios ?', type: 'secondary', icon: '📈' }
      ],
      4: [
        { id: 'model_attacks', label: '🎯 Modéliser les attaques', payload: 'Comment modéliser les chemins d\'attaque ?', type: 'primary', icon: '🗺️' },
        { id: 'assess_feasibility', label: '⚡ Évaluer la faisabilité', payload: 'Comment évaluer la faisabilité technique ?', type: 'secondary', icon: '🔧' }
      ],
      5: [
        { id: 'design_treatment', label: '🛡️ Concevoir le traitement', payload: 'Aidez-moi à concevoir le plan de traitement', type: 'primary', icon: '🎯' },
        { id: 'prioritize_measures', label: '📊 Prioriser les mesures', payload: 'Comment prioriser les mesures de sécurité ?', type: 'secondary', icon: '⚖️' }
      ]
    };

    return workshopActions[workshop as keyof typeof workshopActions] || [];
  }

  // ========================================
  // 📊 MÉTHODES DE GESTION INTELLIGENTE DE LA PROGRESSION
  // ========================================

  /**
   * 📊 Évaluer la qualité de l'interaction
   */
  private assessInteractionQuality(message: string, response: AgentResponseData): number {
    let quality = 0.5; // Base

    // Qualité basée sur la longueur et pertinence du message
    if (message.length > 20) quality += 0.1;
    if (message.length > 50) quality += 0.1;

    // Qualité basée sur la confiance de la réponse
    if (response.metadata?.confidence) {
      quality += response.metadata.confidence * 0.3;
    }

    // Bonus pour les questions techniques
    if (this.assessTechnicalLevel(message) === 'advanced') quality += 0.2;

    return Math.min(quality, 1.0);
  }

  /**
   * 🎯 Calculer le score adaptatif
   */
  private calculateAdaptiveScore(currentScore: number, interactionQuality: number): number {
    const improvement = interactionQuality * 10; // Max +10 points
    const newScore = currentScore + improvement;

    // Éviter les scores trop élevés trop rapidement
    const maxIncrease = currentScore < 50 ? 15 : currentScore < 80 ? 10 : 5;

    return Math.min(newScore, currentScore + maxIncrease, 100);
  }

  /**
   * 🏆 Identifier les compétences acquises
   */
  private identifySkillsAcquired(message: string, response: AgentResponseData): string[] {
    const skills: string[] = [];

    // Compétences basées sur le type de réponse
    if (response.type === 'quiz' && response.quiz) {
      skills.push('Validation des connaissances');
    }

    if (response.type === 'info_card') {
      skills.push('Compréhension approfondie');
    }

    // Compétences basées sur le contenu du message
    if (message.toLowerCase().includes('exemple')) {
      skills.push('Application pratique');
    }

    if (this.assessTechnicalLevel(message) === 'advanced') {
      skills.push('Maîtrise technique');
    }

    return skills;
  }

  /**
   * 📈 Calculer le temps d'interaction
   */
  private calculateInteractionTime(): number {
    // Simulation basée sur la complexité de l'interaction
    return Math.floor(Math.random() * 300) + 60; // 1-5 minutes
  }

  /**
   * 🔔 Déclencher les événements de progression
   */
  private triggerProgressEvents(progress: WorkshopProgress, interactionQuality: number): void {
    // Événements basés sur les seuils de progression
    if (progress.score >= 70 && !progress.validatedDeliverables.includes('Seuil de validation atteint')) {
      progress.validatedDeliverables.push('Seuil de validation atteint');
    }

    if (progress.score >= 90 && !progress.validatedDeliverables.includes('Excellence atteinte')) {
      progress.validatedDeliverables.push('Excellence atteinte');
    }

    // Événements basés sur la qualité d'interaction
    if (interactionQuality > 0.8) {
      progress.validatedDeliverables.push('Interaction de qualité');
    }
  }

  /**
   * 🔍 Détecter les difficultés d'apprentissage
   */
  private detectLearningDifficulties(progress: WorkshopProgress): string[] {
    const difficulties: string[] = [];

    if (progress.score < 40) {
      difficulties.push('Compréhension des concepts de base');
    }

    if (progress.timeSpent > 3600) { // > 1h
      difficulties.push('Rythme d\'apprentissage lent');
    }

    if (progress.validatedDeliverables.length === 0) {
      difficulties.push('Application pratique insuffisante');
    }

    return difficulties;
  }

  /**
   * 📚 Simplifier les prochaines interactions
   */
  private async simplifyNextInteractions(difficulties: string[]): Promise<void> {
    // Adaptation basée sur les difficultés détectées
    console.log('🔄 Adaptation: Simplification des interactions pour:', difficulties);

    // Ici, on pourrait ajuster les paramètres de l'IA pour des réponses plus simples
    // Réduire la complexité technique, ajouter plus d'exemples, etc.
  }

  /**
   * 🚀 Augmenter le niveau de défi
   */
  private async increaseChallengeLevel(): Promise<void> {
    console.log('🚀 Adaptation: Augmentation du niveau de défi');

    // Ici, on pourrait introduire des concepts plus avancés
    // Poser des questions plus complexes, proposer des cas d'usage avancés
  }

  /**
   * 🎯 Générer des recommandations personnalisées
   */
  private generatePersonalizedRecommendations(progress: WorkshopProgress): string[] {
    const recommendations: string[] = [];

    if (progress.score < 60) {
      recommendations.push('Réviser les concepts fondamentaux');
      recommendations.push('Demander plus d\'exemples concrets');
    } else if (progress.score > 85) {
      recommendations.push('Explorer des cas d\'usage avancés');
      recommendations.push('Approfondir les aspects techniques');
    }

    if (progress.timeSpent < 900) { // < 15min
      recommendations.push('Prendre plus de temps pour assimiler');
    }

    recommendations.push('Poser des questions spécifiques');
    recommendations.push('Pratiquer avec des exercices');

    return recommendations;
  }

  /**
   * 🛤️ Mettre à jour le parcours d'apprentissage
   */
  private updateLearningPathway(recommendations: string[]): void {
    console.log('🛤️ Mise à jour du parcours avec recommandations:', recommendations);

    // Ici, on pourrait ajuster dynamiquement le parcours
    // Ajouter des étapes supplémentaires, modifier l'ordre, etc.
  }

  // ========================================
  // 🏗️ MOTEUR IA STRUCTURANT EBIOS RM
  // ========================================

  /**
   * 🔍 ANALYSE CONTEXTUELLE DU MESSAGE DANS LE WORKSHOP
   */
  private analyzeMessageInWorkshopContext(message: string, workshop: number, progress: any): any {
    const intent = this._analyzeMessageIntent(message);

    // Structure détaillée EBIOS RM par workshop
    const workshopStructure = this.getWorkshopDetailedStructure(workshop);
    const currentStep = this.getCurrentWorkshopStep(workshop, progress);

    return {
      intent: intent.type,
      confidence: intent.confidence,
      workshop,
      currentStep,
      expectedNextStep: this.getExpectedNextStep(workshop, currentStep),
      workshopStructure,
      messageComplexity: this.assessMessageComplexity(message),
      learnerNeed: this.identifySpecificLearnerNeed(message, workshop, currentStep),
      progressionSignal: this.detectProgressionSignal(message, currentStep)
    };
  }

  /**
   * 🎯 DÉTERMINATION DE L'ACTION IA STRUCTURANTE
   */
  private determineStructuralAction(analysis: any, workshop: number, progress: any): any {
    const { intent, currentStep, expectedNextStep, learnerNeed, progressionSignal } = analysis;

    // Logique de décision structurée
    let actionType = 'guide_current_step';
    let step = currentStep;
    let guidance = '';
    let nextAction = '';

    // Analyse des signaux de progression
    if (progressionSignal === 'ready_next_step' && currentStep.completion >= 80) {
      actionType = 'advance_to_next_step';
      step = expectedNextStep;
      guidance = `Progression vers ${expectedNextStep.title}`;
      nextAction = expectedNextStep.firstAction;
    } else if (progressionSignal === 'struggling') {
      actionType = 'provide_detailed_help';
      guidance = `Aide détaillée sur ${currentStep.title}`;
      nextAction = 'clarify_concepts';
    } else if (intent === 'start_training' || intent === 'start_workshop_1') {
      actionType = 'initialize_workshop';
      step = this.getWorkshopFirstStep(workshop);
      guidance = `Initialisation ${step.title}`;
      nextAction = step.firstAction;
    } else if (learnerNeed === 'practical_example') {
      actionType = 'provide_practical_example';
      guidance = `Exemple pratique pour ${currentStep.title}`;
      nextAction = 'apply_example';
    } else if (learnerNeed === 'validation') {
      actionType = 'validate_understanding';
      guidance = `Validation des acquis ${currentStep.title}`;
      nextAction = 'quiz_or_exercise';
    }

    return {
      type: actionType,
      step,
      guidance,
      nextAction,
      workshop,
      structuredContent: this.getStructuredContentForAction(actionType, step, workshop)
    };
  }

  /**
   * 🏗️ GÉNÉRATION DE CONTENU STRUCTURÉ PAR WORKSHOP
   */
  private async generateStructuredWorkshopContent(
    action: any,
    workshop: number,
    progress: any,
    context: any
  ): Promise<any> {
    const { type, step, structuredContent } = action;

    // Génération basée sur l'action structurante
    switch (type) {
      case 'initialize_workshop':
        return this.generateWorkshopInitialization(workshop, step, context);

      case 'advance_to_next_step':
        return this.generateStepAdvancement(step, workshop, context);

      case 'provide_detailed_help':
        return this.generateDetailedHelp(step, workshop, context);

      case 'provide_practical_example':
        return this.generatePracticalExample(step, workshop, context);

      case 'validate_understanding':
        return this.generateValidationContent(step, workshop, context);

      case 'guide_current_step':
      default:
        return this.generateStepGuidance(step, workshop, context);
    }
  }

  /**
   * 🚨 FALLBACK STRUCTURÉ
   */
  private generateStructuredFallback(workshop: number, context: any): AgentResponseData {
    const step = this.getWorkshopFirstStep(workshop);

    return {
      text: `🎓 **EBIOS RM - Atelier ${workshop} : ${step.title}**

**Reprenons méthodiquement :**

${step.description}

**🎯 Objectif immédiat :**
${step.objective}

**📋 Actions à réaliser :**
${step.actions.map((action: string, index: number) => `${index + 1}. ${action}`).join('\n')}

**💡 Pour continuer :**
Dites-moi où vous en êtes ou tapez "Étape suivante" pour progresser.`,
      type: 'text',
      actions: this.getWorkshopSpecificActions(workshop),
      metadata: {
        confidence: 0.9,
        sources: ['Structure EBIOS RM'],
        timestamp: new Date(),
        workshopStep: step.id,
        fallbackUsed: true
      }
    };
  }

  /**
   * 🎯 ACTIONS STRUCTURÉES PAR ÉTAPE
   */
  private generateStructuredActions(action: any, workshop: number, progress: any): any[] {
    const { step, nextAction } = action;

    const baseActions = [
      {
        id: 'next_step',
        label: '➡️ Étape suivante',
        payload: 'Passons à l\'étape suivante',
        type: 'primary',
        icon: '🚀'
      },
      {
        id: 'help_current',
        label: '❓ Aide sur cette étape',
        payload: `Aidez-moi avec ${step.title}`,
        type: 'secondary',
        icon: '💡'
      },
      {
        id: 'example',
        label: '📋 Voir un exemple',
        payload: `Montrez-moi un exemple pour ${step.title}`,
        type: 'info',
        icon: '👁️'
      }
    ];

    // Actions spécifiques selon l'étape
    const specificActions = this.getWorkshopSpecificActions(workshop);

    return [...baseActions, ...specificActions];
  }

  /**
   * 📊 CALCUL PROGRESSION STRUCTURÉE
   */
  private calculateStructuredProgress(action: any, currentProgress: any): any {
    const { step, type } = action;

    let newCompletion = currentProgress.completion || 0;

    // Mise à jour basée sur l'action
    switch (type) {
      case 'advance_to_next_step':
        newCompletion = Math.min(newCompletion + 20, 100);
        break;
      case 'validate_understanding':
        newCompletion = Math.min(newCompletion + 15, 100);
        break;
      case 'provide_practical_example':
        newCompletion = Math.min(newCompletion + 10, 100);
        break;
      default:
        newCompletion = Math.min(newCompletion + 5, 100);
    }

    return {
      score: newCompletion,
      workshopId: action.workshop,
      stepId: step.id,
      completionPercentage: newCompletion,
      nextMilestone: this.getNextMilestone()
    };
  }

  /**
   * 🆘 GÉNÉRATION DE RÉPONSE DE SECOURS CONFORME ANSSI
   */
  private generateFallbackResponse(context: any, validationResult: any): { text: string } {
    const currentWorkshop = context.learnerProfile.currentWorkshop;
    const organization = context.ebiosContext.organization;

    const fallbackResponses = {
      1: `🎓 **Formation EBIOS RM - Atelier 1 : Cadrage et Socle de Sécurité**

**Contexte :** ${organization}

Dans le cadre de la méthodologie EBIOS Risk Manager développée par l'ANSSI, l'Atelier 1 consiste à :

**🎯 Objectifs principaux :**
1. **Cadrage de l'étude** : Définir le périmètre d'analyse
2. **Identification des biens supports** : Cartographier les actifs critiques
3. **Évaluation des valeurs métier** : Déterminer les enjeux
4. **Construction du socle de sécurité** : Établir les mesures de base

**📋 Démarche méthodologique :**
- Analyser l'organisation et ses missions
- Identifier les biens supports primaires et de soutien
- Évaluer la criticité selon les critères DICS (Disponibilité, Intégrité, Confidentialité, Preuve)
- Documenter les interdépendances

**🔗 Références ANSSI :**
- Guide EBIOS Risk Manager (version officielle)
- Méthode d'analyse de risques

**💡 Prochaine étape :**
Souhaitez-vous que nous commencions par l'identification des biens supports de votre organisation ?`,

      2: `🎓 **Formation EBIOS RM - Atelier 2 : Sources de Risque**

**Contexte :** ${organization}

L'Atelier 2 d'EBIOS Risk Manager se concentre sur l'analyse des sources de risque selon la méthodologie ANSSI.

**🎯 Objectifs principaux :**
1. **Identification des sources de menaces** : Cartographier les acteurs malveillants
2. **Caractérisation des capacités** : Évaluer les moyens techniques
3. **Analyse des motivations** : Comprendre les objectifs
4. **Évaluation de l'exposition** : Mesurer la visibilité

**📋 Démarche méthodologique :**
- Identifier les sources de menaces pertinentes (cybercriminels, États, hacktivistes, etc.)
- Caractériser leurs capacités techniques et organisationnelles
- Analyser leurs motivations et objectifs
- Évaluer l'exposition de l'organisation

**🏥 Spécificités secteur santé :**
- Cybercriminels spécialisés dans le ransomware hospitalier
- Menaces internes (personnel, prestataires)
- Espionnage industriel pharmaceutique

**🔗 Références ANSSI :**
- Guide EBIOS Risk Manager - Atelier 2
- Panorama de la cybermenace

**💡 Prochaine étape :**
Analysons ensemble les sources de menaces spécifiques à votre secteur d'activité.`,

      3: `🎓 **Formation EBIOS RM - Atelier 3 : Scénarios Stratégiques**

**Contexte :** ${organization}

L'Atelier 3 d'EBIOS Risk Manager construit les scénarios stratégiques selon la méthodologie ANSSI.

**🎯 Objectifs principaux :**
1. **Construction des scénarios** : Croiser sources et biens supports
2. **Évaluation de l'impact** : Mesurer les conséquences métier
3. **Estimation de la vraisemblance** : Probabilité de réalisation
4. **Calcul de la gravité** : Impact × Vraisemblance

**📋 Démarche méthodologique :**
- Croiser les sources de risque avec les biens supports
- Construire des scénarios de risque cohérents
- Évaluer l'impact sur les valeurs métier
- Estimer la vraisemblance de réalisation

**🏥 Exemples secteur santé :**
- Ransomware sur SIH → Arrêt des soins programmés
- Compromission PACS → Perte d'imagerie médicale
- Attaque DDoS → Indisponibilité des services critiques

**🔗 Références ANSSI :**
- Guide EBIOS Risk Manager - Atelier 3
- Échelles d'impact et de vraisemblance

**💡 Prochaine étape :**
Construisons ensemble vos premiers scénarios stratégiques.`,

      4: `🎓 **Formation EBIOS RM - Atelier 4 : Scénarios Opérationnels**

**Contexte :** ${organization}

L'Atelier 4 d'EBIOS Risk Manager détaille les scénarios opérationnels selon la méthodologie ANSSI.

**🎯 Objectifs principaux :**
1. **Modélisation des chemins d'attaque** : Détailler les techniques
2. **Évaluation de la faisabilité** : Analyser la complexité
3. **Identification des points de contrôle** : Localiser les mesures
4. **Priorisation des scénarios** : Classer par criticité

**📋 Démarche méthodologique :**
- Décomposer les scénarios stratégiques en étapes techniques
- Utiliser des référentiels comme MITRE ATT&CK
- Évaluer la faisabilité technique de chaque étape
- Identifier les points de détection et de blocage

**🏥 Exemple hospitalier :**
- Phishing → Compromission poste → Mouvement latéral → Chiffrement SIH
- Chaque étape analysée avec ses contrôles possibles

**🔗 Références ANSSI :**
- Guide EBIOS Risk Manager - Atelier 4
- Référentiel MITRE ATT&CK

**💡 Prochaine étape :**
Analysons les chemins d'attaque spécifiques à votre infrastructure.`,

      5: `🎓 **Formation EBIOS RM - Atelier 5 : Traitement du Risque**

**Contexte :** ${organization}

L'Atelier 5 d'EBIOS Risk Manager définit le plan de traitement selon la méthodologie ANSSI.

**🎯 Objectifs principaux :**
1. **Stratégies de traitement** : Éviter, réduire, transférer, accepter
2. **Sélection des mesures** : Choisir les contrôles appropriés
3. **Plan d'action** : Prioriser et planifier
4. **Validation** : Vérifier l'efficacité résiduelle

**📋 Démarche méthodologique :**
- Définir les objectifs de sécurité
- Sélectionner les mesures de sécurité appropriées
- Construire le plan de traitement des risques
- Valider l'efficacité et calculer le risque résiduel

**🏥 Mesures prioritaires santé :**
- Segmentation réseau IT/OT
- Sauvegarde offline des données critiques
- Plan de continuité d'activité
- Formation du personnel

**🔗 Références ANSSI :**
- Guide EBIOS Risk Manager - Atelier 5
- Référentiel de mesures de sécurité

**💡 Prochaine étape :**
Construisons votre plan de traitement des risques personnalisé.`
    };

    const fallbackText = fallbackResponses[currentWorkshop as keyof typeof fallbackResponses] || fallbackResponses[1];

    return {
      text: `${fallbackText}

**⚠️ Note de qualité :**
Cette réponse a été générée selon les standards ANSSI pour garantir la conformité réglementaire.

**🎯 Actions recommandées :**
- Posez des questions spécifiques sur les concepts
- Demandez des exemples concrets
- Sollicitez des clarifications si nécessaire

**📚 Pour approfondir :**
Consultez le guide officiel EBIOS Risk Manager sur le site de l'ANSSI.`
    };
  }

  // ========================================
  // 📋 STRUCTURE DÉTAILLÉE EBIOS RM PAR WORKSHOP
  // ========================================

  /**
   * 🏗️ STRUCTURE DÉTAILLÉE DES WORKSHOPS EBIOS RM
   */
  private getWorkshopDetailedStructure(workshop: number): any {
    const structures = {
      1: {
        title: 'Atelier 1 - Cadrage et Socle de Sécurité',
        phases: [
          {
            id: 'phase_1_1',
            title: 'Cadrage de l\'étude',
            steps: [
              { id: 'step_1_1_1', title: 'Définition du périmètre', duration: 15, mandatory: true },
              { id: 'step_1_1_2', title: 'Identification des parties prenantes', duration: 10, mandatory: true },
              { id: 'step_1_1_3', title: 'Définition des objectifs', duration: 10, mandatory: true }
            ]
          },
          {
            id: 'phase_1_2',
            title: 'Identification des biens supports',
            steps: [
              { id: 'step_1_2_1', title: 'Cartographie des biens primaires', duration: 20, mandatory: true },
              { id: 'step_1_2_2', title: 'Identification des biens de soutien', duration: 15, mandatory: true },
              { id: 'step_1_2_3', title: 'Analyse des interdépendances', duration: 15, mandatory: true }
            ]
          },
          {
            id: 'phase_1_3',
            title: 'Évaluation des valeurs métier',
            steps: [
              { id: 'step_1_3_1', title: 'Critères DICS (Disponibilité)', duration: 10, mandatory: true },
              { id: 'step_1_3_2', title: 'Critères DICS (Intégrité)', duration: 10, mandatory: true },
              { id: 'step_1_3_3', title: 'Critères DICS (Confidentialité)', duration: 10, mandatory: true },
              { id: 'step_1_3_4', title: 'Critères DICS (Preuve)', duration: 10, mandatory: true }
            ]
          },
          {
            id: 'phase_1_4',
            title: 'Construction du socle de sécurité',
            steps: [
              { id: 'step_1_4_1', title: 'Mesures organisationnelles', duration: 15, mandatory: true },
              { id: 'step_1_4_2', title: 'Mesures techniques', duration: 15, mandatory: true },
              { id: 'step_1_4_3', title: 'Validation du socle', duration: 10, mandatory: true }
            ]
          }
        ]
      },
      2: {
        title: 'Atelier 2 - Sources de Risque',
        phases: [
          {
            id: 'phase_2_1',
            title: 'Identification des sources de menaces',
            steps: [
              { id: 'step_2_1_1', title: 'Cybercriminels', duration: 15, mandatory: true },
              { id: 'step_2_1_2', title: 'États-nations', duration: 15, mandatory: true },
              { id: 'step_2_1_3', title: 'Hacktivistes', duration: 10, mandatory: true },
              { id: 'step_2_1_4', title: 'Menaces internes', duration: 15, mandatory: true }
            ]
          },
          {
            id: 'phase_2_2',
            title: 'Caractérisation des capacités',
            steps: [
              { id: 'step_2_2_1', title: 'Capacités techniques', duration: 20, mandatory: true },
              { id: 'step_2_2_2', title: 'Capacités organisationnelles', duration: 15, mandatory: true },
              { id: 'step_2_2_3', title: 'Ressources disponibles', duration: 10, mandatory: true }
            ]
          },
          {
            id: 'phase_2_3',
            title: 'Analyse des motivations',
            steps: [
              { id: 'step_2_3_1', title: 'Motivations financières', duration: 10, mandatory: true },
              { id: 'step_2_3_2', title: 'Motivations politiques', duration: 10, mandatory: true },
              { id: 'step_2_3_3', title: 'Motivations personnelles', duration: 10, mandatory: true }
            ]
          }
        ]
      },
      3: {
        title: 'Atelier 3 - Scénarios Stratégiques',
        phases: [
          {
            id: 'phase_3_1',
            title: 'Construction des scénarios',
            steps: [
              { id: 'step_3_1_1', title: 'Croisement sources/biens', duration: 20, mandatory: true },
              { id: 'step_3_1_2', title: 'Scénarios de risque', duration: 25, mandatory: true },
              { id: 'step_3_1_3', title: 'Validation cohérence', duration: 15, mandatory: true }
            ]
          },
          {
            id: 'phase_3_2',
            title: 'Évaluation impact et vraisemblance',
            steps: [
              { id: 'step_3_2_1', title: 'Impact sur valeurs métier', duration: 20, mandatory: true },
              { id: 'step_3_2_2', title: 'Vraisemblance de réalisation', duration: 20, mandatory: true },
              { id: 'step_3_2_3', title: 'Calcul de gravité', duration: 15, mandatory: true }
            ]
          }
        ]
      },
      4: {
        title: 'Atelier 4 - Scénarios Opérationnels',
        phases: [
          {
            id: 'phase_4_1',
            title: 'Modélisation des chemins d\'attaque',
            steps: [
              { id: 'step_4_1_1', title: 'Décomposition technique', duration: 25, mandatory: true },
              { id: 'step_4_1_2', title: 'Référentiel MITRE ATT&CK', duration: 20, mandatory: true },
              { id: 'step_4_1_3', title: 'Séquencement des étapes', duration: 15, mandatory: true }
            ]
          },
          {
            id: 'phase_4_2',
            title: 'Évaluation de faisabilité',
            steps: [
              { id: 'step_4_2_1', title: 'Complexité technique', duration: 15, mandatory: true },
              { id: 'step_4_2_2', title: 'Points de contrôle', duration: 20, mandatory: true },
              { id: 'step_4_2_3', title: 'Priorisation scénarios', duration: 15, mandatory: true }
            ]
          }
        ]
      },
      5: {
        title: 'Atelier 5 - Traitement du Risque',
        phases: [
          {
            id: 'phase_5_1',
            title: 'Stratégies de traitement',
            steps: [
              { id: 'step_5_1_1', title: 'Éviter le risque', duration: 15, mandatory: true },
              { id: 'step_5_1_2', title: 'Réduire le risque', duration: 20, mandatory: true },
              { id: 'step_5_1_3', title: 'Transférer le risque', duration: 10, mandatory: true },
              { id: 'step_5_1_4', title: 'Accepter le risque', duration: 10, mandatory: true }
            ]
          },
          {
            id: 'phase_5_2',
            title: 'Plan d\'action',
            steps: [
              { id: 'step_5_2_1', title: 'Sélection des mesures', duration: 20, mandatory: true },
              { id: 'step_5_2_2', title: 'Priorisation', duration: 15, mandatory: true },
              { id: 'step_5_2_3', title: 'Planification', duration: 15, mandatory: true },
              { id: 'step_5_2_4', title: 'Validation efficacité', duration: 10, mandatory: true }
            ]
          }
        ]
      }
    };

    return structures[workshop as keyof typeof structures] || structures[1];
  }

  /**
   * 📍 OBTENIR L'ÉTAPE ACTUELLE DU WORKSHOP
   */
  private getCurrentWorkshopStep(workshop: number, progress: any): any {
    const structure = this.getWorkshopDetailedStructure(workshop);
    const completion = progress?.completion || 0;

    // Calcul de l'étape basé sur la progression
    let totalSteps = 0;
    let currentStepIndex = 0;

    for (const phase of structure.phases) {
      for (const step of phase.steps) {
        if (completion <= (totalSteps + 1) * (100 / this.getTotalStepsCount(structure))) {
          return {
            ...step,
            phase: phase.title,
            phaseId: phase.id,
            stepIndex: currentStepIndex,
            completion: completion,
            objective: this.getStepObjective(step.id),
            actions: this.getStepActions(step.id),
            deliverables: this.getStepDeliverables(step.id)
          };
        }
        totalSteps++;
        currentStepIndex++;
      }
    }

    // Retourner la première étape par défaut
    const firstStep = structure.phases[0].steps[0];
    return {
      ...firstStep,
      phase: structure.phases[0].title,
      phaseId: structure.phases[0].id,
      stepIndex: 0,
      completion: 0,
      objective: this.getStepObjective(firstStep.id),
      actions: this.getStepActions(firstStep.id),
      deliverables: this.getStepDeliverables(firstStep.id)
    };
  }

  /**
   * ➡️ OBTENIR L'ÉTAPE SUIVANTE ATTENDUE
   */
  private getExpectedNextStep(workshop: number, currentStep: any): any {
    const structure = this.getWorkshopDetailedStructure(workshop);
    const currentIndex = currentStep.stepIndex || 0;

    let stepIndex = 0;
    for (const phase of structure.phases) {
      for (const step of phase.steps) {
        if (stepIndex === currentIndex + 1) {
          return {
            ...step,
            phase: phase.title,
            phaseId: phase.id,
            stepIndex,
            objective: this.getStepObjective(step.id),
            actions: this.getStepActions(step.id),
            firstAction: this.getStepFirstAction(step.id)
          };
        }
        stepIndex++;
      }
    }

    // Si c'est la dernière étape, retourner l'atelier suivant
    if (workshop < 5) {
      return {
        id: `workshop_${workshop + 1}`,
        title: `Atelier ${workshop + 1}`,
        phase: 'Transition',
        isWorkshopTransition: true
      };
    }

    return {
      id: 'formation_complete',
      title: 'Formation terminée',
      phase: 'Finalisation'
    };
  }

  // ========================================
  // 🔧 MÉTHODES UTILITAIRES STRUCTURE EBIOS RM
  // ========================================

  /**
   * 📊 COMPTER LE NOMBRE TOTAL D'ÉTAPES
   */
  private getTotalStepsCount(structure: any): number {
    return structure.phases.reduce((total: number, phase: any) =>
      total + phase.steps.length, 0
    );
  }

  /**
   * 🎯 OBTENIR L'OBJECTIF D'UNE ÉTAPE
   */
  private getStepObjective(stepId: string): string {
    const objectives: Record<string, string> = {
      // Atelier 1
      'step_1_1_1': 'Délimiter précisément le périmètre d\'analyse de risques du CHU',
      'step_1_1_2': 'Identifier toutes les parties prenantes impliquées dans l\'analyse',
      'step_1_1_3': 'Définir les objectifs de sécurité et les contraintes',
      'step_1_2_1': 'Cartographier tous les biens supports primaires critiques',
      'step_1_2_2': 'Identifier les biens de soutien nécessaires au fonctionnement',
      'step_1_2_3': 'Analyser les interdépendances entre les différents biens',
      'step_1_3_1': 'Évaluer les besoins de disponibilité pour chaque bien support',
      'step_1_3_2': 'Évaluer les besoins d\'intégrité des données et systèmes',
      'step_1_3_3': 'Évaluer les besoins de confidentialité des informations',
      'step_1_3_4': 'Évaluer les besoins de preuve et de traçabilité',
      'step_1_4_1': 'Définir les mesures organisationnelles de base',
      'step_1_4_2': 'Définir les mesures techniques de sécurité minimales',
      'step_1_4_3': 'Valider la cohérence et l\'efficacité du socle',

      // Atelier 2
      'step_2_1_1': 'Identifier les cybercriminels ciblant le secteur santé',
      'step_2_1_2': 'Analyser les menaces d\'États-nations sur les infrastructures critiques',
      'step_2_1_3': 'Évaluer les risques liés aux hacktivistes',
      'step_2_1_4': 'Analyser les menaces internes (personnel, prestataires)',
      'step_2_2_1': 'Caractériser les capacités techniques des sources de menaces',
      'step_2_2_2': 'Évaluer les capacités organisationnelles des attaquants',
      'step_2_2_3': 'Analyser les ressources disponibles pour les attaquants',
      'step_2_3_1': 'Comprendre les motivations financières des attaquants',
      'step_2_3_2': 'Analyser les motivations politiques et géopolitiques',
      'step_2_3_3': 'Évaluer les motivations personnelles et idéologiques'
    };

    return objectives[stepId] || 'Objectif à définir pour cette étape';
  }

  /**
   * 📋 OBTENIR LES ACTIONS D'UNE ÉTAPE
   */
  private getStepActions(stepId: string): string[] {
    const actions: Record<string, string[]> = {
      'step_1_1_1': [
        'Définir les limites géographiques et organisationnelles',
        'Identifier les systèmes et processus inclus',
        'Documenter les exclusions et leurs justifications'
      ],
      'step_1_2_1': [
        'Lister les systèmes d\'information hospitaliers (SIH)',
        'Identifier les équipements médicaux connectés',
        'Cartographier les infrastructures réseau critiques'
      ],
      'step_1_3_1': [
        'Définir les niveaux de disponibilité requis (99%, 99.9%, etc.)',
        'Identifier les plages de maintenance acceptables',
        'Évaluer l\'impact des interruptions de service'
      ],
      'step_2_1_1': [
        'Analyser les groupes de ransomware ciblant les hôpitaux',
        'Identifier les techniques d\'attaque spécifiques au secteur',
        'Évaluer la fréquence des attaques dans le secteur santé'
      ]
    };

    return actions[stepId] || [
      'Analyser les éléments de cette étape',
      'Documenter les résultats',
      'Valider avec les parties prenantes'
    ];
  }

  /**
   * 📦 OBTENIR LES LIVRABLES D'UNE ÉTAPE
   */
  private getStepDeliverables(stepId: string): string[] {
    const deliverables: Record<string, string[]> = {
      'step_1_1_1': ['Document de cadrage', 'Périmètre validé', 'Matrice des responsabilités'],
      'step_1_2_1': ['Cartographie des biens supports', 'Inventaire détaillé', 'Matrice de criticité'],
      'step_1_3_1': ['Échelle de disponibilité', 'Matrice DICS', 'Critères de criticité'],
      'step_2_1_1': ['Catalogue des menaces', 'Profils d\'attaquants', 'Matrice de capacités']
    };

    return deliverables[stepId] || ['Documentation de l\'étape', 'Validation des résultats'];
  }

  /**
   * ⚡ OBTENIR LA PREMIÈRE ACTION D'UNE ÉTAPE
   */
  private getStepFirstAction(stepId: string): string {
    const firstActions: Record<string, string> = {
      'step_1_1_1': 'Commençons par définir le périmètre d\'analyse',
      'step_1_2_1': 'Identifions les biens supports primaires du CHU',
      'step_1_3_1': 'Évaluons les besoins de disponibilité',
      'step_2_1_1': 'Analysons les cybercriminels ciblant les hôpitaux'
    };

    return firstActions[stepId] || 'Démarrons cette étape ensemble';
  }

  /**
   * 🎯 IDENTIFIER LE BESOIN SPÉCIFIQUE DE L'APPRENANT
   */
  private identifySpecificLearnerNeed(message: string, workshop: number, currentStep: any): string {
    const lowerMessage = message.toLowerCase();

    // Besoins spécifiques par type de message
    if (lowerMessage.includes('exemple') || lowerMessage.includes('concret')) {
      return 'practical_example';
    }
    if (lowerMessage.includes('aide') || lowerMessage.includes('perdu') || lowerMessage.includes('difficile')) {
      return 'detailed_help';
    }
    if (lowerMessage.includes('validation') || lowerMessage.includes('correct') || lowerMessage.includes('juste')) {
      return 'validation';
    }
    if (lowerMessage.includes('suivant') || lowerMessage.includes('continuer') || lowerMessage.includes('après')) {
      return 'progression';
    }
    if (lowerMessage.includes('comment') || lowerMessage.includes('pourquoi')) {
      return 'conceptual_understanding';
    }

    return 'general_guidance';
  }

  /**
   * 📡 DÉTECTER LES SIGNAUX DE PROGRESSION
   */
  private detectProgressionSignal(message: string, currentStep: any): string {
    const lowerMessage = message.toLowerCase();
    const completion = currentStep.completion || 0;

    // Signaux de progression
    if (lowerMessage.includes('terminé') || lowerMessage.includes('fini') || lowerMessage.includes('validé')) {
      return 'ready_next_step';
    }
    if (lowerMessage.includes('difficile') || lowerMessage.includes('compliqué') || lowerMessage.includes('perdu')) {
      return 'struggling';
    }
    if (lowerMessage.includes('suivant') || lowerMessage.includes('continuer')) {
      return completion >= 70 ? 'ready_next_step' : 'premature_advancement';
    }
    if (lowerMessage.includes('recommencer') || lowerMessage.includes('reprendre')) {
      return 'restart_step';
    }

    return 'continuing_current';
  }

  /**
   * 🏗️ OBTENIR LE CONTENU STRUCTURÉ POUR UNE ACTION
   */
  private getStructuredContentForAction(actionType: string, step: any, workshop: number): any {
    return {
      actionType,
      step,
      workshop,
      template: this.getContentTemplate(actionType),
      variables: this.getContentVariables(step, workshop)
    };
  }

  /**
   * 📝 OBTENIR LE TEMPLATE DE CONTENU
   */
  private getContentTemplate(actionType: string): string {
    const templates: Record<string, string> = {
      'initialize_workshop': '🎓 **Initialisation {workshopTitle}**\n\n**Objectif :** {stepObjective}\n\n**Actions à réaliser :**\n{stepActions}\n\n**Livrables attendus :**\n{stepDeliverables}',
      'advance_to_next_step': '➡️ **Progression vers : {stepTitle}**\n\n**Félicitations !** Vous avez terminé l\'étape précédente.\n\n**Prochaine étape :** {stepObjective}\n\n**Actions :**\n{stepActions}',
      'provide_detailed_help': '💡 **Aide détaillée - {stepTitle}**\n\n**Objectif :** {stepObjective}\n\n**Démarche recommandée :**\n{stepActions}\n\n**Conseils pratiques :**\n{practicalTips}',
      'provide_practical_example': '📋 **Exemple pratique - {stepTitle}**\n\n**Contexte CHU :**\n{chuExample}\n\n**Application concrète :**\n{practicalApplication}',
      'validate_understanding': '✅ **Validation - {stepTitle}**\n\n**Vérification des acquis :**\n{validationQuestions}\n\n**Critères de réussite :**\n{successCriteria}'
    };

    return templates[actionType] || templates['guide_current_step'];
  }

  /**
   * 🔧 OBTENIR LES VARIABLES DE CONTENU
   */
  private getContentVariables(step: any, workshop: number): Record<string, string> {
    return {
      workshopTitle: `Atelier ${workshop}`,
      stepTitle: step.title,
      stepObjective: step.objective,
      stepActions: step.actions?.join('\n• ') || '',
      stepDeliverables: step.deliverables?.join('\n• ') || '',
      practicalTips: this.getPracticalTips(step.id),
      chuExample: this.getCHUExample(step.id),
      practicalApplication: this.getPracticalApplication(step.id),
      validationQuestions: this.getValidationQuestions(step.id),
      successCriteria: this.getSuccessCriteria(step.id)
    };
  }

  /**
   * 💡 OBTENIR LES CONSEILS PRATIQUES
   */
  private getPracticalTips(stepId: string): string {
    const tips: Record<string, string> = {
      'step_1_1_1': '• Impliquez les directions métier dès le début\n• Documentez les exclusions avec justification\n• Validez le périmètre avec la direction',
      'step_1_2_1': '• Commencez par les systèmes les plus critiques\n• N\'oubliez pas les équipements médicaux connectés\n• Pensez aux sauvegardes et systèmes de secours'
    };

    return tips[stepId] || '• Procédez méthodiquement\n• Documentez chaque décision\n• Validez avec les experts métier';
  }

  /**
   * 🏥 OBTENIR L'EXEMPLE CHU
   */
  private getCHUExample(stepId: string): string {
    const examples: Record<string, string> = {
      'step_1_1_1': 'Le CHU Métropolitain définit son périmètre : 3 sites hospitaliers, 1200 lits, services d\'urgence, blocs opératoires, et laboratoires.',
      'step_1_2_1': 'Biens supports primaires identifiés : SIH (DxCare), PACS d\'imagerie, systèmes de surveillance patient, réseau backbone.'
    };

    return examples[stepId] || 'Exemple spécifique au CHU Métropolitain pour cette étape.';
  }

  /**
   * 🔧 OBTENIR L'APPLICATION PRATIQUE
   */
  private getPracticalApplication(stepId: string): string {
    const applications: Record<string, string> = {
      'step_1_1_1': 'Créez un document de cadrage avec : périmètre géographique, systèmes inclus/exclus, parties prenantes, objectifs de sécurité.',
      'step_1_2_1': 'Utilisez la matrice de criticité ANSSI pour classer vos biens supports selon leur importance pour la continuité des soins.'
    };

    return applications[stepId] || 'Application pratique de cette étape dans votre contexte.';
  }

  /**
   * ❓ OBTENIR LES QUESTIONS DE VALIDATION
   */
  private getValidationQuestions(stepId: string): string {
    const questions: Record<string, string> = {
      'step_1_1_1': '• Le périmètre est-il clairement défini ?\n• Les parties prenantes sont-elles identifiées ?\n• Les objectifs sont-ils mesurables ?',
      'step_1_2_1': '• Tous les biens supports critiques sont-ils identifiés ?\n• Les interdépendances sont-elles documentées ?\n• La criticité est-elle évaluée ?'
    };

    return questions[stepId] || '• L\'étape est-elle complète ?\n• Les livrables sont-ils produits ?\n• La validation est-elle effectuée ?';
  }

  /**
   * ✅ OBTENIR LES CRITÈRES DE SUCCÈS
   */
  private getSuccessCriteria(stepId: string): string {
    const criteria: Record<string, string> = {
      'step_1_1_1': '• Document de cadrage validé par la direction\n• Périmètre approuvé par toutes les parties prenantes\n• Objectifs SMART définis',
      'step_1_2_1': '• Cartographie complète des biens supports\n• Matrice de criticité renseignée\n• Validation par les responsables métier'
    };

    return criteria[stepId] || '• Livrables produits et validés\n• Objectifs de l\'étape atteints\n• Prêt pour l\'étape suivante';
  }

  // ========================================
  // 🏗️ GÉNÉRATEURS DE CONTENU STRUCTURÉ
  // ========================================

  /**
   * 🚀 GÉNÉRATION D'INITIALISATION DE WORKSHOP
   */
  private generateWorkshopInitialization(workshop: number, step: any, context: any): any {
    const template = this.getContentTemplate('initialize_workshop');
    const variables = this.getContentVariables(step, workshop);

    const content = this.replaceTemplateVariables(template, variables);

    return {
      content: `${content}\n\n**🏥 Contexte CHU Métropolitain :**\n${this.getCHUExample(step.id)}\n\n**🎯 Commençons ensemble :**\n${step.actions[0]}`,
      type: 'action_suggestions',
      confidence: 0.95,
      sources: ['Méthodologie EBIOS RM', 'Guide ANSSI'],
      quiz: null,
      infoCard: {
        title: `Guide ${step.title}`,
        content: step.objective,
        resources: [`Guide EBIOS RM - Atelier ${workshop}`, 'Référentiel ANSSI']
      }
    };
  }

  /**
   * ➡️ GÉNÉRATION D'AVANCEMENT D'ÉTAPE
   */
  private generateStepAdvancement(step: any, workshop: number, context: any): any {
    const template = this.getContentTemplate('advance_to_next_step');
    const variables = this.getContentVariables(step, workshop);

    const content = this.replaceTemplateVariables(template, variables);

    return {
      content: `${content}\n\n**🏥 Application CHU :**\n${this.getCHUExample(step.id)}\n\n**🔧 Actions pratiques :**\n${this.getPracticalApplication(step.id)}`,
      type: 'text',
      confidence: 0.9,
      sources: ['Progression EBIOS RM'],
      quiz: this.generateStepQuiz(step),
      infoCard: null
    };
  }

  /**
   * 💡 GÉNÉRATION D'AIDE DÉTAILLÉE
   */
  private generateDetailedHelp(step: any, workshop: number, context: any): any {
    const template = this.getContentTemplate('provide_detailed_help');
    const variables = this.getContentVariables(step, workshop);

    const content = this.replaceTemplateVariables(template, variables);

    return {
      content: `${content}\n\n**🎯 Démarche pas à pas :**\n${step.actions.map((action: string, index: number) => `**${index + 1}.** ${action}`).join('\n\n')}\n\n**❓ Questions pour vous guider :**\n${this.getGuidingQuestions(step.id)}`,
      type: 'text',
      confidence: 0.85,
      sources: ['Aide méthodologique EBIOS RM'],
      quiz: null,
      infoCard: {
        title: '💡 Conseils d\'expert',
        content: this.getPracticalTips(step.id),
        resources: ['Guide méthodologique', 'Bonnes pratiques']
      }
    };
  }

  /**
   * 📋 GÉNÉRATION D'EXEMPLE PRATIQUE
   */
  private generatePracticalExample(step: any, workshop: number, context: any): any {
    const template = this.getContentTemplate('provide_practical_example');
    const variables = this.getContentVariables(step, workshop);

    const content = this.replaceTemplateVariables(template, variables);

    return {
      content: `${content}\n\n**📊 Résultat attendu :**\n${step.deliverables.map((deliverable: string) => `• ${deliverable}`).join('\n')}\n\n**✅ Critères de validation :**\n${this.getSuccessCriteria(step.id)}`,
      type: 'info_card',
      confidence: 0.9,
      sources: ['Exemples secteur santé', 'Cas d\'usage CHU'],
      quiz: null,
      infoCard: {
        title: `Exemple concret - ${step.title}`,
        content: this.getCHUExample(step.id),
        resources: ['Cas d\'usage sectoriels', 'Templates ANSSI']
      }
    };
  }

  /**
   * ✅ GÉNÉRATION DE CONTENU DE VALIDATION
   */
  private generateValidationContent(step: any, workshop: number, context: any): any {
    const template = this.getContentTemplate('validate_understanding');
    const variables = this.getContentVariables(step, workshop);

    const content = this.replaceTemplateVariables(template, variables);

    return {
      content: `${content}\n\n**🎯 Auto-évaluation :**\nRépondez à ces questions pour valider votre compréhension.`,
      type: 'quiz',
      confidence: 0.95,
      sources: ['Validation EBIOS RM'],
      quiz: this.generateValidationQuiz(step),
      infoCard: null
    };
  }

  /**
   * 🧭 GÉNÉRATION DE GUIDAGE D'ÉTAPE
   */
  private generateStepGuidance(step: any, workshop: number, context: any): any {
    return {
      content: `🎯 **${step.title}**\n\n**Objectif :** ${step.objective}\n\n**🔧 Actions à réaliser :**\n${step.actions.map((action: string, index: number) => `${index + 1}. ${action}`).join('\n')}\n\n**🏥 Dans le contexte du CHU :**\n${this.getCHUExample(step.id)}\n\n**💡 Conseils :**\n${this.getPracticalTips(step.id)}`,
      type: 'text',
      confidence: 0.8,
      sources: ['Guidage EBIOS RM'],
      quiz: null,
      infoCard: {
        title: `Aide - ${step.title}`,
        content: step.objective,
        resources: ['Guide méthodologique', 'Exemples pratiques']
      }
    };
  }

  /**
   * 🔄 REMPLACER LES VARIABLES DANS LE TEMPLATE
   */
  private replaceTemplateVariables(template: string, variables: Record<string, string>): string {
    let content = template;

    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      content = content.replace(regex, value);
    });

    return content;
  }

  /**
   * 🧠 GÉNÉRER UN QUIZ D'ÉTAPE
   */
  private generateStepQuiz(step: any): any {
    const quizzes: Record<string, any> = {
      'step_1_1_1': {
        question: 'Quel est l\'élément le plus important lors du cadrage d\'une analyse EBIOS RM ?',
        options: [
          'La définition précise du périmètre',
          'Le choix des outils techniques',
          'La planification des réunions',
          'La rédaction du rapport final'
        ],
        correctAnswer: 0,
        explanation: 'La définition précise du périmètre est cruciale car elle détermine la portée et la pertinence de toute l\'analyse de risques.'
      },
      'step_1_2_1': {
        question: 'Dans un CHU, quel bien support est généralement considéré comme le plus critique ?',
        options: [
          'Le système de climatisation',
          'Le SIH (Système d\'Information Hospitalier)',
          'Le réseau WiFi visiteurs',
          'Le système de sonorisation'
        ],
        correctAnswer: 1,
        explanation: 'Le SIH est critique car il contient toutes les données patients et est essentiel pour la continuité des soins.'
      }
    };

    return quizzes[step.id] || null;
  }

  /**
   * ✅ GÉNÉRER UN QUIZ DE VALIDATION
   */
  private generateValidationQuiz(step: any): any {
    return {
      question: `Avez-vous bien compris les objectifs de l'étape "${step.title}" ?`,
      options: [
        'Oui, je peux expliquer l\'objectif et les actions',
        'Partiellement, j\'ai besoin de clarifications',
        'Non, je dois revoir cette étape',
        'Je préfère passer à l\'étape suivante'
      ],
      correctAnswer: 0,
      explanation: 'Une compréhension complète est nécessaire avant de progresser vers l\'étape suivante.'
    };
  }

  /**
   * ❓ OBTENIR LES QUESTIONS GUIDANTES
   */
  private getGuidingQuestions(stepId: string): string {
    const questions: Record<string, string> = {
      'step_1_1_1': '• Quels sont les enjeux métier de votre organisation ?\n• Quelles sont les contraintes réglementaires ?\n• Qui sont les parties prenantes clés ?',
      'step_1_2_1': '• Quels systèmes sont essentiels à votre activité ?\n• Quelles sont les interdépendances critiques ?\n• Comment évaluez-vous la criticité ?'
    };

    return questions[stepId] || '• Quels sont les éléments clés de cette étape ?\n• Comment les appliquer à votre contexte ?\n• Quels sont les livrables attendus ?';
  }

  /**
   * 🏗️ OBTENIR LA PREMIÈRE ÉTAPE D'UN WORKSHOP
   */
  private getWorkshopFirstStep(workshop: number): any {
    const structure = this.getWorkshopDetailedStructure(workshop);
    const firstStep = structure.phases[0].steps[0];

    return {
      ...firstStep,
      phase: structure.phases[0].title,
      phaseId: structure.phases[0].id,
      stepIndex: 0,
      completion: 0,
      objective: this.getStepObjective(firstStep.id),
      actions: this.getStepActions(firstStep.id),
      deliverables: this.getStepDeliverables(firstStep.id)
    };
  }

  // 🔄 SYSTÈME ANTI-BOUCLE - MÉTHODES

  /**
   * 🔍 Détection de boucles dans la conversation
   */
  private isLoopDetected(message: string): boolean {
    const sessionId = this.currentSession?.id || 'default';

    // Ajouter le message à l'historique
    if (!this.conversationHistory.has(sessionId)) {
      this.conversationHistory.set(sessionId, []);
    }

    const history = this.conversationHistory.get(sessionId)!;

    // Vérifier si le message exact a été répété récemment
    const recentMessages = history.slice(-5); // 5 derniers messages
    const exactMatches = recentMessages.filter(msg => msg.toLowerCase().trim() === message.toLowerCase().trim()).length;

    if (exactMatches >= 2) {
      return true;
    }

    // Vérifier les patterns de réponse similaires
    const messageKey = this.normalizeMessage(message);
    const patternCount = this.responsePatterns.get(messageKey) || 0;
    this.responsePatterns.set(messageKey, patternCount + 1);

    return patternCount >= 3; // Seuil de détection de boucle
  }

  /**
   * 📝 Enregistrer une interaction pour le système anti-boucle
   */
  private recordInteraction(userMessage: string, agentResponse: string): void {
    const sessionId = this.currentSession?.id || 'default';

    // Enregistrer dans l'historique
    if (!this.conversationHistory.has(sessionId)) {
      this.conversationHistory.set(sessionId, []);
    }

    const history = this.conversationHistory.get(sessionId)!;
    history.push(userMessage);

    // Limiter la taille de l'historique
    if (history.length > 50) {
      history.splice(0, 10); // Supprimer les 10 plus anciens
    }

    // Enregistrer les dernières réponses
    this.lastResponses.push(agentResponse);
    if (this.lastResponses.length > 10) {
      this.lastResponses.shift();
    }

    // Analyser l'intention pour éviter les répétitions
    const intent = this._analyzeMessageIntent(userMessage);
    this.userIntentHistory.push(intent.type);
    if (this.userIntentHistory.length > 20) {
      this.userIntentHistory.shift();
    }
  }

  /**
   * 🔄 Générer une réponse anti-boucle
   */
  private generateAntiLoopResponse(message: string): AgentResponseData {
    const alternatives = [
      "Je remarque que nous tournons en rond. Essayons une approche différente !",
      "Il semble que nous ayons déjà abordé ce point. Permettez-moi de vous orienter autrement.",
      "Pour éviter de répéter, laissez-moi vous proposer une nouvelle perspective.",
      "Je sens que vous cherchez quelque chose de spécifique. Pouvez-vous reformuler votre besoin ?",
      "Changeons d'angle ! Quelle est votre préoccupation principale en ce moment ?"
    ];

    const randomResponse = alternatives[Math.floor(Math.random() * alternatives.length)];

    return {
      text: `🔄 ${randomResponse}

**Suggestions pour avancer :**
• Posez une question plus spécifique
• Demandez un exemple concret
• Passez à l'étape suivante
• Explorez un autre aspect du sujet`,
      type: 'action_suggestions',
      actions: [
        { id: 'specific', label: '❓ Question spécifique', payload: 'J\'ai une question spécifique sur...', type: 'primary', icon: '❓' },
        { id: 'example', label: '💡 Exemple concret', payload: 'Montrez-moi un exemple concret', type: 'info', icon: '💡' },
        { id: 'next', label: '➡️ Étape suivante', payload: 'Passons à l\'étape suivante', type: 'success', icon: '➡️' },
        { id: 'help', label: '🆘 Aide personnalisée', payload: 'J\'ai besoin d\'aide personnalisée', type: 'warning', icon: '🆘' }
      ],
      metadata: {
        confidence: 0.8,
        sources: ['Anti-Loop System'],
        timestamp: new Date(),
        fallbackUsed: true
      }
    };
  }

  /**
   * 🔧 Normaliser un message pour la détection de patterns
   */
  private normalizeMessage(message: string): string {
    return message
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Supprimer la ponctuation
      .replace(/\s+/g, ' ') // Normaliser les espaces
      .trim()
      .substring(0, 50); // Limiter la longueur
  }
}
