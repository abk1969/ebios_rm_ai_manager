/**
 * 🤖 AGENT IA SPÉCIALISÉ EBIOS RM
 * Agent expert pour chaque atelier avec progression pédagogique
 */

export interface WorkshopStep {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  deliverables: string[];
  duration: number; // en minutes
  prerequisites?: string[];
}

export interface WorkshopProgress {
  currentStep: number;
  completedSteps: string[];
  validatedDeliverables: string[];
  score: number;
  timeSpent: number;
}

export interface AgentPersonality {
  name: string;
  role: string;
  expertise: string[];
  teachingStyle: 'socratic' | 'directive' | 'collaborative' | 'discovery';
  encouragementLevel: 'high' | 'medium' | 'low';
}

export class EbiosWorkshopAgent {
  private workshopId: number;
  private personality: AgentPersonality;
  private steps: WorkshopStep[];
  private caseStudyContext: any;

  constructor(workshopId: number, caseStudyContext: any) {
    this.workshopId = workshopId;
    this.caseStudyContext = caseStudyContext;
    this.personality = this.getAgentPersonality(workshopId);
    this.steps = this.getWorkshopSteps(workshopId);
  }

  /**
   * 🎭 Personnalité de l'agent selon l'atelier
   */
  private getAgentPersonality(workshopId: number): AgentPersonality {
    const personalities: Record<number, AgentPersonality> = {
      1: {
        name: "Dr. Sophie Cadrage",
        role: "Expert en cadrage et socle de sécurité",
        expertise: ["Identification des biens supports", "Analyse du contexte", "Définition du périmètre"],
        teachingStyle: "directive",
        encouragementLevel: "high"
      },
      2: {
        name: "Prof. Marc Risques",
        role: "Spécialiste des sources de risques",
        expertise: ["Cartographie des menaces", "Analyse des vulnérabilités", "Sources de risques"],
        teachingStyle: "socratic",
        encouragementLevel: "medium"
      },
      3: {
        name: "Dr. Claire Stratégie",
        role: "Experte en scénarios stratégiques",
        expertise: ["Scénarios de risques", "Impact métier", "Analyse stratégique"],
        teachingStyle: "collaborative",
        encouragementLevel: "high"
      },
      4: {
        name: "Ing. Thomas Opérations",
        role: "Expert en scénarios opérationnels",
        expertise: ["Chemins d'attaque", "Scénarios techniques", "Analyse opérationnelle"],
        teachingStyle: "discovery",
        encouragementLevel: "medium"
      },
      5: {
        name: "Dr. Anne Traitement",
        role: "Spécialiste du traitement des risques",
        expertise: ["Mesures de sécurité", "Plan de traitement", "Validation des risques"],
        teachingStyle: "collaborative",
        encouragementLevel: "high"
      }
    };

    return personalities[workshopId] || personalities[1];
  }

  /**
   * 📋 Étapes détaillées de chaque atelier
   */
  private getWorkshopSteps(workshopId: number): WorkshopStep[] {
    const workshopSteps: Record<number, WorkshopStep[]> = {
      1: [
        {
          id: "w1-context",
          title: "Analyse du contexte",
          description: "Comprenons ensemble le contexte du CHU métropolitain",
          objectives: [
            "Identifier l'organisation et ses missions",
            "Comprendre l'environnement réglementaire",
            "Définir le périmètre d'étude"
          ],
          deliverables: ["Fiche de contexte", "Périmètre défini"],
          duration: 15
        },
        {
          id: "w1-assets",
          title: "Identification des biens supports",
          description: "Identifions les biens supports critiques du CHU",
          objectives: [
            "Lister les biens supports essentiels",
            "Évaluer leur criticité",
            "Comprendre leurs interdépendances"
          ],
          deliverables: ["Cartographie des biens supports", "Matrice de criticité"],
          duration: 20
        },
        {
          id: "w1-security",
          title: "Socle de sécurité existant",
          description: "Analysons les mesures de sécurité déjà en place",
          objectives: [
            "Inventorier les mesures existantes",
            "Évaluer leur efficacité",
            "Identifier les lacunes"
          ],
          deliverables: ["Inventaire des mesures", "Analyse des lacunes"],
          duration: 15
        }
      ],
      2: [
        {
          id: "w2-threat-landscape",
          title: "Cartographie des menaces",
          description: "Explorons l'univers des menaces du secteur santé",
          objectives: [
            "Identifier les sources de menaces",
            "Comprendre leurs motivations",
            "Évaluer leurs capacités"
          ],
          deliverables: ["Cartographie des menaces", "Profils d'attaquants"],
          duration: 20
        },
        {
          id: "w2-vulnerabilities",
          title: "Analyse des vulnérabilités",
          description: "Identifions les vulnérabilités du CHU",
          objectives: [
            "Recenser les vulnérabilités techniques",
            "Identifier les vulnérabilités organisationnelles",
            "Évaluer leur exploitabilité"
          ],
          deliverables: ["Inventaire des vulnérabilités", "Matrice d'exploitabilité"],
          duration: 25
        }
      ],
      3: [
        {
          id: "w3-scenarios",
          title: "Construction des scénarios stratégiques",
          description: "Créons ensemble les scénarios de risques majeurs",
          objectives: [
            "Définir les scénarios stratégiques",
            "Évaluer leur vraisemblance",
            "Mesurer leur impact"
          ],
          deliverables: ["Scénarios stratégiques", "Matrice des risques"],
          duration: 30
        }
      ],
      4: [
        {
          id: "w4-attack-paths",
          title: "Chemins d'attaque détaillés",
          description: "Détaillons les chemins d'attaque opérationnels",
          objectives: [
            "Modéliser les chemins d'attaque",
            "Identifier les points de contrôle",
            "Évaluer la faisabilité technique"
          ],
          deliverables: ["Arbres d'attaque", "Scénarios opérationnels"],
          duration: 35
        }
      ],
      5: [
        {
          id: "w5-treatment",
          title: "Plan de traitement des risques",
          description: "Élaborons le plan de traitement optimal",
          objectives: [
            "Définir les stratégies de traitement",
            "Sélectionner les mesures de sécurité",
            "Planifier la mise en œuvre"
          ],
          deliverables: ["Plan de traitement", "Roadmap sécurité"],
          duration: 25
        }
      ]
    };

    return workshopSteps[workshopId] || [];
  }

  /**
   * 🎯 Générer un message pédagogique contextualisé
   */
  generateMessage(
    messageType: 'welcome' | 'step_intro' | 'guidance' | 'validation' | 'encouragement' | 'question',
    context: {
      currentStep?: WorkshopStep;
      progress?: WorkshopProgress;
      userInput?: string;
      caseStudyData?: any;
      topic?: string; // Ajout du champ topic
    }
  ): string {
    const { name, role, teachingStyle } = this.personality;
    const caseStudy = this.caseStudyContext;

    switch (messageType) {
      case 'welcome':
        return `🎓 Bonjour ! Je suis ${name}, ${role}.

Je vais vous accompagner dans l'Atelier ${this.workshopId} d'EBIOS RM. Nous allons travailler ensemble sur le cas réel du ${caseStudy.organization} - ${caseStudy.description}.

🎯 **Objectifs de cet atelier :**
${this.steps.map(step => `• ${step.title}`).join('\n')}

📋 **Notre approche :**
${teachingStyle === 'directive' ? 'Je vais vous guider étape par étape avec des instructions claires.' :
  teachingStyle === 'socratic' ? 'Je vais vous poser des questions pour vous amener à découvrir les réponses.' :
  teachingStyle === 'collaborative' ? 'Nous allons construire ensemble les livrables de cet atelier.' :
  'Je vais vous laisser explorer et découvrir, en vous aidant quand nécessaire.'}

Êtes-vous prêt(e) à commencer ? 🚀`;

      case 'step_intro':
        const step = context.currentStep!;
        return `📍 **${step.title}**

${step.description}

🎯 **Ce que nous allons accomplir :**
${step.objectives.map(obj => `• ${obj}`).join('\n')}

📋 **Livrables attendus :**
${step.deliverables.map(del => `• ${del}`).join('\n')}

⏱️ **Durée estimée :** ${step.duration} minutes

🏥 **Dans le contexte du ${caseStudy.organization} :**
${this.getCaseStudyContext(step.id)}

Comment souhaitez-vous procéder ? Voulez-vous que je vous guide ou préférez-vous commencer par me poser des questions ?`;

      case 'guidance':
        return this.generateGuidanceMessage(context);

      case 'question':
        return this.generateQuestionMessage(context);

      case 'validation':
        return this.generateValidationMessage(context);

      case 'encouragement':
        return this.generateEncouragementMessage(context);

      default:
        return `Je suis ${name}, votre expert EBIOS RM. Comment puis-je vous aider ?`;
    }
  }

  /**
   * 🏥 Contexte spécifique au cas d'étude
   */
  private getCaseStudyContext(stepId: string): string {
    const contexts: Record<string, string> = {
      'w1-context': 'Le CHU dessert 800 000 habitants avec 1200 lits, 4500 professionnels, et gère des données de santé critiques.',
      'w1-assets': 'Nous identifierons les systèmes d\'information hospitaliers, les équipements médicaux connectés, et les données patients.',
      'w1-security': 'Le CHU a déjà mis en place certaines mesures : firewall, antivirus, sauvegarde. Analysons leur suffisance.',
      'w2-threat-landscape': 'Le secteur santé est particulièrement visé : ransomwares, vol de données, espionnage industriel.',
      'w2-vulnerabilities': 'Les hôpitaux ont des vulnérabilités spécifiques : équipements médicaux non patchés, accès multiples...',
      'w3-scenarios': 'Quels seraient les scénarios les plus critiques pour ce CHU ? Panne du SIH ? Compromission des données ?',
      'w4-attack-paths': 'Comment un attaquant pourrait-il concrètement compromettre les systèmes du CHU ?',
      'w5-treatment': 'Quelles mesures prioriser pour ce CHU ? Budget limité, contraintes opérationnelles...'
    };

    return contexts[stepId] || 'Appliquons cette étape au contexte spécifique de notre CHU métropolitain.';
  }

  /**
   * ❓ Messages de réponse aux questions
   */
  private generateQuestionMessage(context: any): string {
    const { userInput, topic } = context;

    if (topic && topic !== 'général') {
      return `🎯 **Dr. Sophie Cadrage ici !**
      
Vous avez posé une excellente question sur les **${topic}** !
      
Dans le contexte du ${this.caseStudyContext.organization}, les ${topic} sont cruciaux car... [Réponse détaillée sur le topic]
      
N'hésitez pas si vous avez d'autres questions sur ce sujet ou si vous souhaitez passer à l'étape suivante.`;
    }

    return `🎯 **Dr. Sophie Cadrage ici !**
    
Je vois que vous vous intéressez à "${userInput}". Excellente question !
    
**🚀 POUR BIEN COMMENCER :**
    
1️⃣ **Découvrons d'abord le CHU ensemble**
       → Tapez "Présentez-moi le CHU" pour comprendre le contexte
    
2️⃣ **Puis identifions les biens supports**
       → Tapez "Quels sont les biens supports ?" pour l'analyse
    
3️⃣ **Enfin évaluons les risques**
       → Tapez "Analysons les menaces" pour les scénarios
    
**💡 OU CHOISISSEZ UNE ACTION DIRECTE :**
• "Commençons l'atelier 1" → Guidage étape par étape
• "Montrez-moi un exemple" → Cas concret du CHU
• "Que dois-je faire ?" → Plan d'action personnalisé
    
Que préférez-vous faire maintenant ?`;
  }

  /**
   * 🧭 Messages de guidage adaptatifs
   */
  private generateGuidanceMessage(_context: any): string {
    const responses = [
      "Excellente question ! Laissez-moi vous expliquer cette notion dans le contexte de notre CHU...",
      "C'est exactement le bon raisonnement ! Approfondissons ce point ensemble...",
      "Intéressant ! Cette problématique est centrale dans l'analyse EBIOS RM. Voici comment l'aborder...",
      "Parfait ! Vous touchez là un aspect crucial. Dans le cas de notre hôpital..."
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * ✅ Messages de validation
   */
  private generateValidationMessage(_context: any): string {
    return `✅ **Excellent travail !**

Vous avez bien cerné les enjeux de cette étape. Votre analyse montre une bonne compréhension des concepts EBIOS RM appliqués au secteur santé.

🎯 **Points clés validés :**
• Identification correcte des éléments critiques
• Bonne prise en compte du contexte hospitalier
• Raisonnement méthodologique solide

📈 **Progression :** Vous pouvez passer à l'étape suivante !

Souhaitez-vous approfondir certains points ou êtes-vous prêt(e) à continuer ?`;
  }

  /**
   * 💪 Messages d'encouragement
   */
  private generateEncouragementMessage(_context: any): string {
    const encouragements = [
      "🌟 Vous progressez très bien ! Votre approche méthodologique est excellente.",
      "💪 Continuez ainsi ! Vous maîtrisez de mieux en mieux les concepts EBIOS RM.",
      "🎯 Parfait ! Vous développez une vraie expertise en analyse des risques.",
      "🚀 Excellent ! Votre compréhension du cas d'étude s'affine remarquablement."
    ];

    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  /**
   * 📊 Évaluer la progression de l'apprenant
   */
  evaluateProgress(_userResponse: string, _currentStep: WorkshopStep): {
    score: number;
    feedback: string;
    canProceed: boolean;
    suggestions: string[];
  } {
    // Ici, on intégrerait une vraie IA d'évaluation
    // Pour l'instant, simulation basique
    
    const score = Math.floor(Math.random() * 40) + 60; // 60-100
    const canProceed = score >= 70;

    return {
      score,
      feedback: canProceed 
        ? "Excellente compréhension ! Vous pouvez passer à l'étape suivante."
        : "Bonne base, mais approfondissons quelques points avant de continuer.",
      canProceed,
      suggestions: canProceed 
        ? ["Explorez les nuances de ce concept", "Pensez aux implications pratiques"]
        : ["Relisez la définition de ce concept", "Posez-moi des questions spécifiques"]
    };
  }

  /**
   * 🎯 Obtenir la prochaine action recommandée
   */
  getNextAction(progress: WorkshopProgress): {
    type: 'continue' | 'review' | 'practice' | 'validate';
    message: string;
    options: string[];
  } {
    const currentStepIndex = progress.currentStep;
    const totalSteps = this.steps.length;

    if (currentStepIndex >= totalSteps) {
      return {
        type: 'validate',
        message: `🎉 Félicitations ! Vous avez terminé l'Atelier ${this.workshopId}. Validons ensemble vos acquis.`,
        options: ['Réviser les points clés', 'Passer à l\'atelier suivant', 'Approfondir un concept']
      };
    }

    return {
      type: 'continue',
      message: `Passons à l'étape suivante : ${this.steps[currentStepIndex].title}`,
      options: ['Commencer l\'étape', 'Poser une question', 'Réviser l\'étape précédente']
    };
  }
}
