/**
 * 🏛️ INTERFACES REPOSITORIES - DOMAIN LAYER
 * Contrats pour la persistance selon Clean Architecture
 * Indépendant de l'implémentation technique
 */

import { TrainingSession, TrainingSessionId, LearnerId } from '../entities/TrainingSession';
import { Learner } from '../entities/Learner';

// 🎯 CRITÈRES DE RECHERCHE
export interface TrainingSessionSearchCriteria {
  learnerId?: LearnerId;
  status?: string[];
  sector?: string[];
  workshopTypes?: number[];
  createdAfter?: Date;
  createdBefore?: Date;
  completedAfter?: Date;
  completedBefore?: Date;
  organizationId?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'completionPercentage';
  sortOrder?: 'asc' | 'desc';
}

export interface LearnerSearchCriteria {
  name?: string;
  email?: string;
  organization?: string;
  sector?: string[];
  role?: string[];
  experienceLevel?: string[];
  isActive?: boolean;
  hasCompletedSessions?: boolean;
  certificationLevel?: string[];
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'createdAt' | 'lastActivity';
  sortOrder?: 'asc' | 'desc';
}

// 🎯 RÉSULTATS PAGINÉS
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// 🎯 STATISTIQUES
export interface TrainingStatistics {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  averageCompletionTime: number;
  averageScore: number;
  completionRate: number;
  popularWorkshops: { workshop: number; count: number }[];
  sectorDistribution: { sector: string; count: number }[];
}

export interface LearnerStatistics {
  totalLearners: number;
  activeLearners: number;
  averageSkillLevel: number;
  certificationDistribution: { level: string; count: number }[];
  organizationDistribution: { organization: string; count: number }[];
  engagementMetrics: {
    highEngagement: number;
    mediumEngagement: number;
    lowEngagement: number;
  };
}

/**
 * 🎓 REPOSITORY SESSIONS DE FORMATION
 */
export interface TrainingSessionRepository {
  // 💾 CRUD OPERATIONS
  save(session: TrainingSession): Promise<void>;
  findById(id: TrainingSessionId): Promise<TrainingSession | null>;
  findByLearnerId(learnerId: LearnerId): Promise<TrainingSession[]>;
  update(session: TrainingSession): Promise<void>;
  delete(id: TrainingSessionId): Promise<void>;
  
  // 🔍 RECHERCHE AVANCÉE
  search(criteria: TrainingSessionSearchCriteria): Promise<PaginatedResult<TrainingSession>>;
  findActiveSessions(): Promise<TrainingSession[]>;
  findExpiredSessions(expirationDate: Date): Promise<TrainingSession[]>;
  findSessionsByWorkshop(workshopType: number): Promise<TrainingSession[]>;
  
  // 📊 STATISTIQUES
  getStatistics(organizationId?: string): Promise<TrainingStatistics>;
  getCompletionRateByPeriod(startDate: Date, endDate: Date): Promise<{ date: string; rate: number }[]>;
  getAverageScoreByWorkshop(): Promise<{ workshop: number; averageScore: number }[]>;
  
  // 🔄 OPÉRATIONS EN BATCH
  saveBatch(sessions: TrainingSession[]): Promise<void>;
  updateBatch(sessions: TrainingSession[]): Promise<void>;
  
  // 🧹 MAINTENANCE
  cleanup(olderThan: Date): Promise<number>;
  archiveCompleted(olderThan: Date): Promise<number>;
}

/**
 * 🎓 REPOSITORY APPRENANTS
 */
export interface LearnerRepository {
  // 💾 CRUD OPERATIONS
  save(learner: Learner): Promise<void>;
  findById(id: LearnerId): Promise<Learner | null>;
  findByEmail(email: string): Promise<Learner | null>;
  update(learner: Learner): Promise<void>;
  delete(id: LearnerId): Promise<void>;
  
  // 🔍 RECHERCHE AVANCÉE
  search(criteria: LearnerSearchCriteria): Promise<PaginatedResult<Learner>>;
  findByOrganization(organizationId: string): Promise<Learner[]>;
  findBySector(sector: string): Promise<Learner[]>;
  findBySkillLevel(minLevel: number, maxLevel: number): Promise<Learner[]>;
  findEligibleForCertification(): Promise<Learner[]>;
  
  // 📊 STATISTIQUES
  getStatistics(organizationId?: string): Promise<LearnerStatistics>;
  getSkillDistribution(): Promise<{ skill: string; average: number; distribution: number[] }[]>;
  getEngagementTrends(period: 'week' | 'month' | 'quarter'): Promise<{ date: string; engagement: number }[]>;
  
  // 🏆 CLASSEMENTS
  getTopPerformers(limit: number): Promise<Learner[]>;
  getMostEngaged(limit: number): Promise<Learner[]>;
  getRecentlyActive(days: number): Promise<Learner[]>;
  
  // 🔄 OPÉRATIONS EN BATCH
  saveBatch(learners: Learner[]): Promise<void>;
  updateBatch(learners: Learner[]): Promise<void>;
  
  // 🧹 MAINTENANCE
  deactivateInactive(inactiveDays: number): Promise<number>;
  anonymizeData(learnerIds: LearnerId[]): Promise<void>;
}

/**
 * 🎯 REPOSITORY CONTENU PÉDAGOGIQUE
 */
export interface ContentRepository {
  // 📚 CONTENU WORKSHOPS
  getWorkshopContent(workshopId: number, sector: string, difficulty: string): Promise<WorkshopContent>;
  getWorkshopSteps(workshopId: number): Promise<WorkshopStep[]>;
  getWorkshopResources(workshopId: number): Promise<WorkshopResource[]>;
  
  // 🎯 CONTENU SECTORIEL
  getSectorExamples(sector: string, workshopId?: number): Promise<SectorExample[]>;
  getSectorTemplates(sector: string): Promise<Template[]>;
  getSectorRegulations(sector: string): Promise<Regulation[]>;
  
  // 🤖 CONTENU IA
  getAIPrompts(context: string): Promise<AIPrompt[]>;
  getAISuggestions(workshopId: number, userInput: any): Promise<AISuggestion[]>;
  
  // 📋 ÉVALUATIONS
  getAssessmentQuestions(workshopId: number, difficulty: string): Promise<AssessmentQuestion[]>;
  getEvaluationCriteria(workshopId: number): Promise<EvaluationCriteria[]>;
}

// 🎯 TYPES POUR LE CONTENU
export interface WorkshopContent {
  id: number;
  title: string;
  description: string;
  objectives: string[];
  duration: number;
  difficulty: string;
  prerequisites: string[];
  steps: WorkshopStep[];
  resources: WorkshopResource[];
  assessments: AssessmentQuestion[];
}

export interface WorkshopStep {
  id: string;
  order: number;
  title: string;
  description: string;
  content: string;
  interactionType: 'reading' | 'exercise' | 'quiz' | 'discussion' | 'simulation';
  estimatedTime: number;
  aiGuidance?: string;
  validationCriteria?: string[];
}

export interface WorkshopResource {
  id: string;
  type: 'document' | 'video' | 'link' | 'template' | 'tool';
  title: string;
  description: string;
  url?: string;
  content?: string;
  downloadable: boolean;
}

export interface SectorExample {
  id: string;
  sector: string;
  workshopId: number;
  title: string;
  description: string;
  scenario: string;
  learningPoints: string[];
  realWorldContext: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  sector: string;
  workshopId: number;
  content: string;
  format: 'docx' | 'xlsx' | 'pdf' | 'html';
  variables: TemplateVariable[];
}

export interface TemplateVariable {
  name: string;
  type: 'text' | 'number' | 'date' | 'list';
  description: string;
  required: boolean;
  defaultValue?: any;
}

export interface Regulation {
  id: string;
  name: string;
  description: string;
  sector: string;
  applicableWorkshops: number[];
  requirements: string[];
  references: string[];
}

export interface AIPrompt {
  id: string;
  context: string;
  prompt: string;
  expectedOutput: string;
  parameters: Record<string, any>;
}

export interface AISuggestion {
  id: string;
  type: 'improvement' | 'completion' | 'correction' | 'guidance';
  content: string;
  confidence: number;
  reasoning: string;
  applicableContext: string[];
}

export interface AssessmentQuestion {
  id: string;
  workshopId: number;
  type: 'multiple_choice' | 'open_ended' | 'scenario' | 'practical';
  question: string;
  options?: string[];
  correctAnswer?: string;
  evaluationCriteria?: EvaluationCriteria;
  difficulty: string;
  points: number;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  rubric: RubricLevel[];
  weight: number;
}

export interface RubricLevel {
  level: number;
  name: string;
  description: string;
  points: number;
  indicators: string[];
}

/**
 * 🎯 REPOSITORY ANALYTICS
 */
export interface AnalyticsRepository {
  // 📊 MÉTRIQUES DE PERFORMANCE
  recordSessionMetric(sessionId: string, metric: string, value: number): Promise<void>;
  recordLearnerMetric(learnerId: string, metric: string, value: number): Promise<void>;
  recordSystemMetric(metric: string, value: number, tags?: Record<string, string>): Promise<void>;
  
  // 📈 RAPPORTS
  generateProgressReport(learnerId: LearnerId, period: 'week' | 'month' | 'quarter'): Promise<ProgressReport>;
  generateOrganizationReport(organizationId: string, period: 'week' | 'month' | 'quarter'): Promise<OrganizationReport>;
  generateSystemHealthReport(): Promise<SystemHealthReport>;
  
  // 🎯 INSIGHTS
  getPersonalizedInsights(learnerId: LearnerId): Promise<PersonalizedInsight[]>;
  getOrganizationInsights(organizationId: string): Promise<OrganizationInsight[]>;
  getPredictiveAnalytics(learnerId: LearnerId): Promise<PredictiveAnalytic[]>;
}

export interface ProgressReport {
  learnerId: string;
  period: string;
  completedSessions: number;
  timeSpent: number;
  averageScore: number;
  skillProgression: { skill: string; before: number; after: number }[];
  achievements: string[];
  recommendations: string[];
}

export interface OrganizationReport {
  organizationId: string;
  period: string;
  totalLearners: number;
  activeLearners: number;
  completionRate: number;
  averageEngagement: number;
  topPerformers: string[];
  areasForImprovement: string[];
  roi: number;
}

export interface SystemHealthReport {
  timestamp: Date;
  systemMetrics: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    throughput: number;
  };
  userMetrics: {
    activeUsers: number;
    sessionDuration: number;
    bounceRate: number;
  };
  contentMetrics: {
    mostPopularWorkshops: string[];
    completionRates: Record<string, number>;
    userSatisfaction: number;
  };
}

export interface PersonalizedInsight {
  type: 'strength' | 'improvement' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  data: any;
}

export interface OrganizationInsight {
  type: 'performance' | 'engagement' | 'compliance' | 'roi';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  recommendations: string[];
  data: any;
}

export interface PredictiveAnalytic {
  type: 'completion_probability' | 'performance_forecast' | 'engagement_risk' | 'skill_gap';
  prediction: string;
  confidence: number;
  timeframe: string;
  factors: string[];
  recommendations: string[];
}
