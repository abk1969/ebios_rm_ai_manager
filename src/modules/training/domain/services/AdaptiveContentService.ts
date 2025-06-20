/**
 * 🧠 SERVICE DE CONTENU ADAPTATIF INTELLIGENT
 * Adaptation dynamique du contenu selon le profil expert
 * POINT 1 - Agent Orchestrateur Workshop 1 Intelligent
 */

import { EbiosExpertProfile } from '../../../../infrastructure/a2a/types/AgentCardTypes';

// 🎯 TYPES POUR L'ADAPTATION DE CONTENU

export interface ExpertiseLevel {
  level: 'junior' | 'intermediate' | 'senior' | 'expert' | 'master';
  score: number; // 0-100
  confidence: number; // 0-1
  specializations: string[];
  weakAreas: string[];
  strengths: string[];
}

export interface ContentAdaptation {
  detailLevel: 'basic' | 'standard' | 'advanced' | 'expert';
  exampleTypes: string[];
  interactionStyle: 'guided' | 'collaborative' | 'autonomous';
  feedbackFrequency: 'high' | 'medium' | 'low';
  challengeLevel: number; // 1-10
}

export interface AdaptiveContent {
  originalContent: string;
  adaptedContent: string;
  adaptationReason: string;
  personalizedExamples: PersonalizedExample[];
  expertInsights: ExpertInsight[];
  interactiveElements: InteractiveElement[];
}

export interface PersonalizedExample {
  id: string;
  title: string;
  description: string;
  relevanceScore: number;
  sectorSpecific: boolean;
  experienceLevel: string;
}

export interface ExpertInsight {
  id: string;
  type: 'best_practice' | 'common_pitfall' | 'advanced_technique' | 'real_world_case';
  content: string;
  source: string;
  relevanceToProfile: number;
}

export interface InteractiveElement {
  id: string;
  type: 'question' | 'challenge' | 'reflection' | 'peer_discussion';
  content: string;
  expectedResponse: string;
  adaptationTrigger: boolean;
}

// 🧠 SERVICE PRINCIPAL D'ADAPTATION

export class AdaptiveContentService {
  private static instance: AdaptiveContentService;
  private expertiseCache: Map<string, ExpertiseLevel> = new Map();
  private adaptationHistory: Map<string, ContentAdaptation[]> = new Map();

  private constructor() {}

  public static getInstance(): AdaptiveContentService {
    if (!AdaptiveContentService.instance) {
      AdaptiveContentService.instance = new AdaptiveContentService();
    }
    return AdaptiveContentService.instance;
  }

  // 🎯 ANALYSE DU PROFIL EXPERT

  public async analyzeExpertProfile(profile: EbiosExpertProfile): Promise<ExpertiseLevel> {
    const cacheKey = `${profile.id}_${profile.experience?.ebiosYears}_${profile.certifications?.length}`;
    
    if (this.expertiseCache.has(cacheKey)) {
      return this.expertiseCache.get(cacheKey)!;
    }

    const expertise = await this.calculateExpertiseLevel(profile);
    this.expertiseCache.set(cacheKey, expertise);
    
    return expertise;
  }

  private async calculateExpertiseLevel(profile: EbiosExpertProfile): Promise<ExpertiseLevel> {
    let score = 0;
    let confidence = 0.8;

    // Analyse de l'expérience EBIOS RM
    const ebiosYears = profile.experience?.ebiosYears || 0;
    if (ebiosYears >= 10) score += 40;
    else if (ebiosYears >= 5) score += 30;
    else if (ebiosYears >= 2) score += 20;
    else score += 10;

    // Analyse des certifications
    const certifications = profile.certifications || [];
    const highValueCerts = ['CISSP', 'CISM', 'ANSSI', 'ISO27001LA'];
    const certScore = certifications.filter(cert => 
      highValueCerts.some(hvc => cert.toUpperCase().includes(hvc))
    ).length * 15;
    score += Math.min(certScore, 30);

    // Analyse des spécialisations
    const specializations = profile.specializations || [];
    const ebiosSpecializations = ['risk_management', 'threat_intelligence', 'security_audit'];
    const specScore = specializations.filter(spec => 
      ebiosSpecializations.includes(spec)
    ).length * 10;
    score += Math.min(specScore, 20);

    // Analyse du secteur d'activité
    const sectorExperience = this.analyzeSectorExperience(profile.sector);
    score += sectorExperience;

    // Détermination du niveau
    let level: ExpertiseLevel['level'];
    if (score >= 85) level = 'master';
    else if (score >= 70) level = 'expert';
    else if (score >= 55) level = 'senior';
    else if (score >= 40) level = 'intermediate';
    else level = 'junior';

    // Identification des forces et faiblesses
    const strengths = this.identifyStrengths(profile);
    const weakAreas = this.identifyWeakAreas(profile, score);

    return {
      level,
      score,
      confidence,
      specializations: specializations,
      weakAreas,
      strengths
    };
  }

  private analyzeSectorExperience(sector?: string): number {
    const highRiskSectors = ['santé', 'finance', 'énergie', 'transport', 'défense'];
    if (sector && highRiskSectors.includes(sector.toLowerCase())) {
      return 10;
    }
    return 5;
  }

  private identifyStrengths(profile: EbiosExpertProfile): string[] {
    const strengths: string[] = [];
    
    if ((profile.experience?.ebiosYears || 0) >= 5) {
      strengths.push('experience_methodologique');
    }
    
    if (profile.certifications?.some(cert => cert.includes('CISSP'))) {
      strengths.push('vision_strategique');
    }
    
    if (profile.specializations?.includes('threat_intelligence')) {
      strengths.push('analyse_menaces');
    }
    
    if (profile.sector === 'santé') {
      strengths.push('contexte_sectoriel');
    }

    return strengths;
  }

  private identifyWeakAreas(profile: EbiosExpertProfile, score: number): string[] {
    const weakAreas: string[] = [];
    
    if ((profile.experience?.ebiosYears || 0) < 3) {
      weakAreas.push('experience_pratique');
    }
    
    if (!profile.specializations?.includes('risk_management')) {
      weakAreas.push('gestion_risques');
    }
    
    if (score < 50) {
      weakAreas.push('methodologie_ebios');
    }

    return weakAreas;
  }

  // 🎨 ADAPTATION DU CONTENU

  public async adaptContent(
    originalContent: string,
    profile: EbiosExpertProfile,
    context: { workshopId: number; moduleId: string; learningObjective: string }
  ): Promise<AdaptiveContent> {
    
    const expertise = await this.analyzeExpertProfile(profile);
    const adaptation = this.determineContentAdaptation(expertise);
    
    const adaptedContent = await this.generateAdaptedContent(
      originalContent, 
      adaptation, 
      expertise,
      context
    );
    
    const personalizedExamples = await this.generatePersonalizedExamples(
      expertise, 
      profile.sector,
      context
    );
    
    const expertInsights = await this.generateExpertInsights(
      expertise,
      context
    );
    
    const interactiveElements = await this.generateInteractiveElements(
      adaptation,
      expertise,
      context
    );

    return {
      originalContent,
      adaptedContent,
      adaptationReason: this.explainAdaptation(expertise, adaptation),
      personalizedExamples,
      expertInsights,
      interactiveElements
    };
  }

  private determineContentAdaptation(expertise: ExpertiseLevel): ContentAdaptation {
    switch (expertise.level) {
      case 'master':
        return {
          detailLevel: 'expert',
          exampleTypes: ['complex_cases', 'edge_cases', 'multi_sector'],
          interactionStyle: 'autonomous',
          feedbackFrequency: 'low',
          challengeLevel: 9
        };

      case 'expert':
        return {
          detailLevel: 'expert',
          exampleTypes: ['advanced_cases', 'sector_specific', 'best_practices'],
          interactionStyle: 'collaborative',
          feedbackFrequency: 'medium',
          challengeLevel: 7
        };

      case 'senior':
        return {
          detailLevel: 'advanced',
          exampleTypes: ['practical_cases', 'sector_specific'],
          interactionStyle: 'collaborative',
          feedbackFrequency: 'medium',
          challengeLevel: 6
        };

      case 'intermediate':
        return {
          detailLevel: 'standard',
          exampleTypes: ['standard_cases', 'guided_examples'],
          interactionStyle: 'guided',
          feedbackFrequency: 'high',
          challengeLevel: 4
        };

      default: // junior
        return {
          detailLevel: 'basic',
          exampleTypes: ['simple_cases', 'step_by_step'],
          interactionStyle: 'guided',
          feedbackFrequency: 'high',
          challengeLevel: 2
        };
    }
  }

  // 🎨 GÉNÉRATION DE CONTENU ADAPTÉ

  private async generateAdaptedContent(
    originalContent: string,
    adaptation: ContentAdaptation,
    expertise: ExpertiseLevel,
    context: { workshopId: number; moduleId: string; learningObjective: string }
  ): Promise<string> {

    let adaptedContent = originalContent;

    // Adaptation selon le niveau de détail
    switch (adaptation.detailLevel) {
      case 'expert':
        adaptedContent = this.enhanceWithExpertDetails(adaptedContent, expertise);
        break;
      case 'advanced':
        adaptedContent = this.addAdvancedInsights(adaptedContent, expertise);
        break;
      case 'standard':
        adaptedContent = this.addStandardGuidance(adaptedContent);
        break;
      case 'basic':
        adaptedContent = this.addBasicExplanations(adaptedContent);
        break;
    }

    // Adaptation selon le style d'interaction
    if (adaptation.interactionStyle === 'autonomous') {
      adaptedContent = this.addAutonomousElements(adaptedContent);
    } else if (adaptation.interactionStyle === 'guided') {
      adaptedContent = this.addGuidedElements(adaptedContent);
    }

    return adaptedContent;
  }

  private enhanceWithExpertDetails(content: string, expertise: ExpertiseLevel): string {
    let enhanced = content;

    // Ajout de détails techniques avancés
    enhanced += `\n\n🔬 **ANALYSE EXPERTE APPROFONDIE :**\n`;
    enhanced += `• **Considérations méthodologiques avancées** selon votre profil ${expertise.level}\n`;
    enhanced += `• **Retours d'expérience terrain** issus de missions similaires\n`;
    enhanced += `• **Variantes sectorielles** et adaptations contextuelles\n`;
    enhanced += `• **Pièges méthodologiques** fréquents et stratégies d'évitement\n`;

    if (expertise.strengths.includes('experience_methodologique')) {
      enhanced += `\n💡 **Votre expertise méthodologique** vous permet d'approfondir les aspects normatifs et de conformité ANSSI.`;
    }

    return enhanced;
  }

  private addAdvancedInsights(content: string, expertise: ExpertiseLevel): string {
    let enhanced = content;

    enhanced += `\n\n📊 **INSIGHTS AVANCÉS :**\n`;
    enhanced += `• **Bonnes pratiques** issues de retours d'expérience\n`;
    enhanced += `• **Adaptations sectorielles** selon votre domaine d'expertise\n`;
    enhanced += `• **Liens avec autres référentiels** (ISO 27005, NIST)\n`;

    return enhanced;
  }

  private addStandardGuidance(content: string): string {
    let enhanced = content;

    enhanced += `\n\n📋 **GUIDANCE MÉTHODOLOGIQUE :**\n`;
    enhanced += `• **Étapes clés** à respecter selon EBIOS RM\n`;
    enhanced += `• **Points de vigilance** et vérifications\n`;
    enhanced += `• **Livrables attendus** et critères de qualité\n`;

    return enhanced;
  }

  private addBasicExplanations(content: string): string {
    let enhanced = content;

    enhanced += `\n\n📚 **EXPLICATIONS DÉTAILLÉES :**\n`;
    enhanced += `• **Définitions** des concepts clés\n`;
    enhanced += `• **Exemples concrets** étape par étape\n`;
    enhanced += `• **Aide-mémoire** méthodologique\n`;
    enhanced += `• **Ressources complémentaires** pour approfondir\n`;

    return enhanced;
  }

  private addAutonomousElements(content: string): string {
    let enhanced = content;

    enhanced += `\n\n🎯 **DÉFIS AUTONOMES :**\n`;
    enhanced += `• Analysez les implications stratégiques de cette étape\n`;
    enhanced += `• Identifiez les adaptations nécessaires à votre contexte\n`;
    enhanced += `• Proposez des améliorations méthodologiques\n`;

    return enhanced;
  }

  private addGuidedElements(content: string): string {
    let enhanced = content;

    enhanced += `\n\n🗺️ **GUIDANCE ÉTAPE PAR ÉTAPE :**\n`;
    enhanced += `• **Étape 1** : Lisez attentivement le contenu\n`;
    enhanced += `• **Étape 2** : Identifiez les points clés\n`;
    enhanced += `• **Étape 3** : Réfléchissez aux applications pratiques\n`;
    enhanced += `• **Étape 4** : Posez vos questions si nécessaire\n`;

    return enhanced;
  }

  // 🎯 GÉNÉRATION D'EXEMPLES PERSONNALISÉS

  private async generatePersonalizedExamples(
    expertise: ExpertiseLevel,
    sector?: string,
    context?: { workshopId: number; moduleId: string; learningObjective: string }
  ): Promise<PersonalizedExample[]> {

    const examples: PersonalizedExample[] = [];

    // Exemples selon le secteur
    if (sector === 'santé') {
      examples.push({
        id: 'health_chu_example',
        title: 'CHU Métropolitain - Cas d\'usage réel',
        description: 'Analyse EBIOS RM complète d\'un CHU de 1200 lits avec 3 sites',
        relevanceScore: 0.95,
        sectorSpecific: true,
        experienceLevel: expertise.level
      });
    }

    // Exemples selon le niveau d'expertise
    if (expertise.level === 'expert' || expertise.level === 'master') {
      examples.push({
        id: 'complex_multi_site',
        title: 'Organisation multi-sites complexe',
        description: 'Gestion des interdépendances dans un écosystème distribué',
        relevanceScore: 0.85,
        sectorSpecific: false,
        experienceLevel: expertise.level
      });
    }

    return examples;
  }

  // 💡 GÉNÉRATION D'INSIGHTS EXPERTS

  private async generateExpertInsights(
    expertise: ExpertiseLevel,
    context?: { workshopId: number; moduleId: string; learningObjective: string }
  ): Promise<ExpertInsight[]> {

    const insights: ExpertInsight[] = [];

    if (expertise.level === 'expert' || expertise.level === 'master') {
      insights.push({
        id: 'expert_pitfall_1',
        type: 'common_pitfall',
        content: 'Attention à ne pas confondre biens essentiels et biens supports lors du cadrage initial. Cette confusion est source de 60% des erreurs méthodologiques.',
        source: 'Retour d\'expérience ANSSI',
        relevanceToProfile: 0.9
      });

      insights.push({
        id: 'best_practice_1',
        type: 'best_practice',
        content: 'Impliquez systématiquement les métiers dès l\'Atelier 1. Un cadrage technique seul génère 40% d\'écarts lors de la validation finale.',
        source: 'Guide ANSSI - Bonnes pratiques',
        relevanceToProfile: 0.85
      });
    }

    return insights;
  }

  // 🎮 GÉNÉRATION D'ÉLÉMENTS INTERACTIFS

  private async generateInteractiveElements(
    adaptation: ContentAdaptation,
    expertise: ExpertiseLevel,
    context?: { workshopId: number; moduleId: string; learningObjective: string }
  ): Promise<InteractiveElement[]> {

    const elements: InteractiveElement[] = [];

    if (adaptation.challengeLevel >= 7) {
      elements.push({
        id: 'expert_challenge_1',
        type: 'challenge',
        content: 'Défi expert : Identifiez 3 biais cognitifs qui peuvent affecter l\'identification des biens essentiels et proposez des contre-mesures.',
        expectedResponse: 'Biais de confirmation, biais d\'ancrage, biais de disponibilité',
        adaptationTrigger: true
      });
    }

    if (adaptation.interactionStyle === 'collaborative') {
      elements.push({
        id: 'peer_discussion_1',
        type: 'peer_discussion',
        content: 'Point de discussion : Comment adaptez-vous la méthodologie EBIOS RM dans votre secteur d\'activité ?',
        expectedResponse: 'Discussion ouverte sur les adaptations sectorielles',
        adaptationTrigger: false
      });
    }

    return elements;
  }

  // 📝 EXPLICATION DE L'ADAPTATION

  private explainAdaptation(expertise: ExpertiseLevel, adaptation: ContentAdaptation): string {
    let explanation = `Contenu adapté pour un profil ${expertise.level} (score: ${expertise.score}/100).\n`;

    explanation += `• **Niveau de détail** : ${adaptation.detailLevel}\n`;
    explanation += `• **Style d'interaction** : ${adaptation.interactionStyle}\n`;
    explanation += `• **Niveau de défi** : ${adaptation.challengeLevel}/10\n`;

    if (expertise.strengths.length > 0) {
      explanation += `• **Forces identifiées** : ${expertise.strengths.join(', ')}\n`;
    }

    if (expertise.weakAreas.length > 0) {
      explanation += `• **Axes d'amélioration** : ${expertise.weakAreas.join(', ')}\n`;
    }

    return explanation;
  }

  // 🔄 MISE À JOUR DE L'HISTORIQUE

  public updateAdaptationHistory(userId: string, adaptation: ContentAdaptation): void {
    if (!this.adaptationHistory.has(userId)) {
      this.adaptationHistory.set(userId, []);
    }

    const history = this.adaptationHistory.get(userId)!;
    history.push(adaptation);

    // Garder seulement les 10 dernières adaptations
    if (history.length > 10) {
      history.shift();
    }
  }

  // 📊 MÉTRIQUES D'ADAPTATION

  public getAdaptationMetrics(userId: string): {
    totalAdaptations: number;
    averageChallengeLevel: number;
    mostUsedInteractionStyle: string;
    adaptationTrends: string[];
  } {
    const history = this.adaptationHistory.get(userId) || [];

    if (history.length === 0) {
      return {
        totalAdaptations: 0,
        averageChallengeLevel: 0,
        mostUsedInteractionStyle: 'guided',
        adaptationTrends: []
      };
    }

    const avgChallenge = history.reduce((sum, h) => sum + h.challengeLevel, 0) / history.length;

    const styleCount = history.reduce((acc, h) => {
      acc[h.interactionStyle] = (acc[h.interactionStyle] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostUsedStyle = Object.entries(styleCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'guided';

    return {
      totalAdaptations: history.length,
      averageChallengeLevel: Math.round(avgChallenge * 10) / 10,
      mostUsedInteractionStyle: mostUsedStyle,
      adaptationTrends: this.analyzeTrends(history)
    };
  }

  private analyzeTrends(history: ContentAdaptation[]): string[] {
    const trends: string[] = [];

    if (history.length >= 3) {
      const recent = history.slice(-3);
      const challengeLevels = recent.map(h => h.challengeLevel);

      if (challengeLevels.every((level, i) => i === 0 || level >= challengeLevels[i-1])) {
        trends.push('progression_difficulty');
      }

      if (recent.every(h => h.interactionStyle === 'autonomous')) {
        trends.push('autonomous_preference');
      }
    }

    return trends;
  }
}

export default AdaptiveContentService;
