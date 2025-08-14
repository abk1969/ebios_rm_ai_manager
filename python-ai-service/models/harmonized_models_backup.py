"""
🔄 MODÈLES EBIOS RM HARMONISÉS
Modèles Python générés automatiquement depuis TypeScript
Généré le: 2025-06-29T19:17:11.354Z
"""

from datetime import datetime
from typing import List, Dict, Union, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum

# === MODÈLES DE BASE ===

class BaseEbiosModel(BaseModel):
    """Modèle de base pour tous les objets EBIOS RM"""
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    mission_id: str

class SecurityLevel(str, Enum):
    """Niveaux de sécurité"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ImpactType(str, Enum):
    """Types d'impact"""
    CONFIDENTIALITY = "confidentiality"
    INTEGRITY = "integrity"
    AVAILABILITY = "availability"
    AUTHENTICITY = "authenticity"

class CriticalityLevel(str, Enum):
    """Niveaux de criticité"""
    VERY_LOW = "very_low"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    VERY_HIGH = "very_high"

# === ENUMS POUR AI ===

class AISuggestionType(str, Enum):
    COMPLETION = "completion"
    VALIDATION = "validation"
    ENHANCEMENT = "enhancement"
    CORRECTION = "correction"

class AISuggestionPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AISuggestionCategory(str, Enum):
    BUSINESS_VALUE = "business_value"
    ASSET = "asset"
    THREAT = "threat"
    SCENARIO = "scenario"
    MEASURE = "measure"

class AIConfidenceLevel(int, Enum):
    VERY_LOW = 1
    LOW = 2
    MEDIUM = 3
    HIGH = 4
    VERY_HIGH = 5

class AIRelevanceScore(int, Enum):
    IRRELEVANT = 1
    LOW_RELEVANCE = 2
    MODERATE = 3
    HIGH_RELEVANCE = 4
    HIGHLY_RELEVANT = 5

class Mission(BaseModel):
    """Mission - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    description: str
    status: Union['draft', 'in_progress', 'review', 'completed', 'archived']
    dueDate: str
    assignedTo: List[str]
    organizationContext: OrganizationContext
    scope: AnalysisScope
    ebiosCompliance: EbiosCompliance
    createdAt: str
    updatedAt: str
    # Propriétés manquantes utilisées dans le code
    organization: Optional[str] = None
    objective: Optional[str] = None
    agentConfiguration: Optional[Dict[str, Any]] = None
    enabledAgents: List[str]
    fallbackMode: bool
    circuitBreakerEnabled: bool
    validationLevel: Union['basic', 'standard', 'strict', 'anssi_compliant']

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class Workshop(BaseModel):
    """Workshop - Modèle harmonisé EBIOS RM"""

    id: str
    missionId: str
    number: Union[1, 2, 3, 4, 5]
    status: Union['not_started', 'in_progress', 'completed', 'validated']
    completedSteps: List[str]
    validationCriteria: List[WorkshopValidation]
    prerequisitesMet: bool
    expertValidation: Optional[ExpertValidation] = None
    createdAt: str
    updatedAt: str

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class BusinessValue(BaseModel):
    """BusinessValue - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    description: str
    category: Union['reputation', 'trust', 'competitive_advantage', 'financial', 'regulatory', 'operational']
    priority: str
    essentialAssetIds: List[str]
    missionId: str
    createdAt: str
    updatedAt: str
    financialImpact: Optional[Dict[str, Any]] = None
    directLoss: int
    indirectLoss: int
    currency: str

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class EssentialAsset(BaseModel):
    """EssentialAsset - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    description: str
    type: Union['process', 'information', 'know_how']
    category: Union['mission_critical', 'business_critical', 'operational']
    criticalityLevel: Union['essential', 'important', 'useful']
    businessValueIds: List[str]
    supportingAssets: List[SupportingAsset]
    dreadedEvents: List[DreadedEvent]
    stakeholders: List[str]
    missionId: str
    createdAt: str
    updatedAt: str
    confidentialityRequirement: str
    integrityRequirement: str
    availabilityRequirement: str
    authenticityRequirement: Optional[str] = None
    nonRepudiationRequirement: Optional[str] = None
    owner: str
    custodian: Optional[str] = None
    users: List[str]
    natureValeurMetier: Optional[Union['PROCESSUS', 'INFORMATION']] = None
    responsableEntite: Optional[str] = None
    missionNom: Optional[str] = None
    aiMetadata: Optional[Dict[str, Any]] = None
    autoCompleted: Optional[bool] = None
    suggestedCategory: Optional[str] = None
    coherenceScore: Optional[int] = None
    relatedAssets: Optional[List[str]] = None
    impactAnalysis: Optional[Dict[str, Any]] = None
    criticalityScore: int
    dependencies: List[str]
    riskExposure: int

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class SupportingAsset(BaseModel):
    """SupportingAsset - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    type: Union['data', 'software', 'hardware', 'network', 'personnel', 'site', 'organization']
    description: str
    essentialAssetId: str
    # CORRECTION: Référence vers le bien essentiel (logique EBIOS RM)
    businessValueId: Optional[str] = None
    # DEPRECATED: Maintenu pour compatibilité
    missionId: str
    securityLevel: Union['public', 'internal', 'confidential', 'secret']
    vulnerabilities: Union[List[Any], List[str]]
    dependsOn: List[str]
    createdAt: str
    updatedAt: str
    # CORRECTION: Propriétés manquantes utilisées dans le code
    criticality: Optional[Union['low', 'medium', 'high', 'critical']] = None
    relatedBusinessValues: Optional[List[str]] = None
    securityControls: Optional[List[str]] = None
    # CORRECTION: Propriété manquante
    responsableEntite: Optional[str] = None
    valeurMetierNom: Optional[str] = None
    aiSuggestions: Optional[Dict[str, Any]] = None
    vulnerabilities: Optional[List[str]] = None
    dependencies: Optional[List[str]] = None
    riskLevel: Optional[int] = None
    protectionMeasures: Optional[List[str]] = None
    criticalityAssessment: Optional[Dict[str, Any]] = None
    businessImpact: int
    technicalCriticality: int
    overallScore: int

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class DreadedEvent(BaseModel):
    """DreadedEvent - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    description: str
    essentialAssetId: str
    # CORRECTION: Référence vers le bien essentiel (logique EBIOS RM)
    businessValueId: Optional[str] = None
    # DEPRECATED: Maintenu pour compatibilité
    gravity: str
    impactType: Union['availability', 'integrity', 'confidentiality', 'authenticity', 'non_repudiation']
    consequences: str
    missionId: str
    createdAt: str
    updatedAt: str
    # CORRECTION: Propriétés manquantes utilisées dans le code
    impact: Optional[int] = None
    likelihood: Optional[int] = None
    impactedBusinessValues: Optional[List[str]] = None
    impactsList: Optional[List[str]] = None
    valeurMetierNom: Optional[str] = None
    aiAnalysis: Optional[Dict[str, Any]] = None
    impactSeverity: Optional[int] = None
    cascadingEffects: Optional[List[str]] = None
    mitigationSuggestions: Optional[List[str]] = None
    relatedEvents: Optional[List[str]] = None
    probabilityAssessment: Optional[Dict[str, Any]] = None
    # likelihood: int
    # confidence: int
    # factors: List[str]
    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class SecurityMeasure(BaseModel):
    """SecurityMeasure - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    description: str
    isoCategory: Optional[str] = None
    isoControl: Optional[str] = None
    controlType: Union['preventive', 'detective', 'corrective', 'directive']
    status: Union['planned', 'in_progress', 'implemented', 'verified', 'obsolete']
    priority: str
    responsibleParty: str
    dueDate: str
    missionId: str
    effectiveness: str
    implementationCost: Union['low', 'medium', 'high', 'very_high']
    maintenanceCost: Union['low', 'medium', 'high', 'very_high']
    targetScenarios: List[str]
    targetVulnerabilities: List[str]
    implementation: Dict[str, Any]
    createdAt: str
    updatedAt: str
    # CORRECTION: Propriétés manquantes utilisées dans le code
    type: Optional[Union['preventive', 'detective', 'corrective', 'compensatory']] = None
    cost: Optional[Union['low', 'medium', 'high', 'very_high', int]] = None
    implementationTime: Optional[str] = None
    implementationComplexity: Optional[int] = None
    complexity: Optional[int] = None
    riskReduction: Optional[int] = None
    nistReference: Optional[str] = None
    nistFamily: Optional[str] = None
    # ex: AC
    category: Optional[str] = None
    implementationTimeframe: Optional[Union['immediate', 'short', 'medium', 'long']] = None
    targetedScenarios: Optional[List[str]] = None
    domain: Optional[str] = None
    # CORRECTION: Propriété manquante
    function: Optional[str] = None
    # CORRECTION: Propriété manquante
    securityControls: Optional[List[str]] = None
    # CORRECTION: Propriété manquante
    implementationNotes: Optional[str] = None
    validationCriteria: Optional[str] = None
    dependencies: Optional[List[str]] = None
    monitoringMethod: Optional[str] = None
    aiSuggestions: Optional[Any] = None
    type: str
    description: str
    # confidence: int
    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class RiskSource(BaseModel):
    """RiskSource - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    description: str
    category: Union['cybercriminal', 'terrorist', 'activist', 'state', 'insider', 'competitor', 'natural']
    pertinence: str
    expertise: Union['limited', 'moderate', 'high', 'expert', int]
    # CORRECTION: Ajout number pour compatibilité
    resources: Union['limited', 'moderate', 'high', 'unlimited', str]
    # CORRECTION: Ajout string pour compatibilité
    motivation: str
    missionId: str
    objectives: List[Dict[str, Any]]
    operationalModes: List[Dict[str, Any]]
    createdAt: str
    updatedAt: str
    categoryAuto: Optional[bool] = None
    pertinenceAccess: Optional[Union[1, 2, 3]] = None
    aiProfile: Optional[Dict[str, Any]] = None
    threatLevel: Optional[int] = None
    predictedActions: Optional[List[str]] = None
    historicalPatterns: Optional[Dict[str, Any]] = None
    # frequency: int
    # commonTargets: List[str]
    # preferredMethods: List[str]
    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class StrategicScenario(BaseModel):
    """StrategicScenario - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    description: str
    riskSourceId: str
    targetBusinessValueId: str
    dreadedEventId: str
    likelihood: str
    gravity: str
    riskLevel: str
    pathways: List[Dict[str, Any]]
    missionId: str
    createdAt: str
    updatedAt: str
    # CORRECTION: Propriétés manquantes utilisées dans le code
    impact: Optional[int] = None
    attackPaths: List[str]
    supportingAssets: Optional[List[str]] = None
    # CORRECTION: Propriétés utilisées dans Workshop3Agent
    feasibility: Optional[int] = None
    priority: Optional[int] = None
    category: Optional[str] = None
    riskRating: Optional[Dict[str, Any]] = None
    # likelihood: int
    # impact: int
    # overall: int
    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class OperationalScenario(BaseModel):
    """OperationalScenario - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    description: str
    strategicScenarioId: str
    attackPath: AttackPath
    difficulty: str
    detectability: str
    impact: str
    riskLevel: str
    mitigationMeasures: List[str]
    missionId: str
    createdAt: str
    updatedAt: Optional[str] = None
    # CORRECTION: Rendu optionnel pour éviter les erreurs

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class Dict[str, Any](BaseModel):
    """Dict[str, Any] - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    description: str
    riskSourceId: str
    targetType: Union['business_value', 'supporting_asset', 'stakeholder']
    targetId: str
    priority: str
    targetBusinessValueId: Optional[str] = None
    # CORRECTION: Propriété manquante

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class Stakeholder(BaseModel):
    """Stakeholder - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    type: Union['internal', 'external', 'partner', 'supplier', 'client', 'regulator']
    category: Union['decision_maker', 'user', 'administrator', 'maintenance', 'external_entity']
    zone: Union['trusted', 'untrusted', 'partially_trusted']
    exposureLevel: str
    cyberReliability: str
    accessRights: List[AccessRight]
    missionId: str
    createdAt: str
    updatedAt: str

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AttackPath(BaseModel):
    """AttackPath - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    description: str
    difficulty: str
    successProbability: str
    missionId: str
    stakeholderId: Optional[str] = None
    isDirect: Optional[bool] = None
    actions: List[Dict[str, Any]]
    prerequisites: List[str]
    indicators: List[str]
    createdAt: str
    updatedAt: str
    # CORRECTION: Propriétés manquantes utilisées dans le code
    feasibility: Optional[int] = None
    detectability: Optional[int] = None
    probability: Optional[int] = None
    steps: Optional[List[Dict[str, Any]]] = None
    techniques: Optional[List[str]] = None
    phases: Optional[Any] = None
    type: str
    finalProbability: int
    techniques: List[str]

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class Dict[str, Any](BaseModel):
    """Dict[str, Any] - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    description: str
    attackPathId: str
    sequence: int
    technique: str
    targetAssetId: Optional[str] = None
    difficulty: str
    detectability: str
    duration: str
    createdAt: str
    updatedAt: str
    sequenceTypeAttaque: Optional[str] = None
    Ex: "1-CONNAITRE"
    precedentActionId: Optional[str] = None
    nextActionId: Optional[str] = None
    modeOperatoire: Optional[str] = None
    canalExfiltration: Optional[str] = None
    probabiliteSucces: Optional[Union[1, 2, 3, 4]] = None
    difficulteTechnique: Optional[Union[0, 1, 2, 3, 4]] = None
    aiAnalysis: Optional[Dict[str, Any]] = None
    technicalComplexity: Optional[int] = None
    detectionProbability: Optional[int] = None
    timeWindow: Optional[Dict[str, Any]] = None
    # minimum: str
    # average: str
    # maximum: str
    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class SecurityControlGap(BaseModel):
    """SecurityControlGap - Modèle harmonisé EBIOS RM"""

    id: str
    description: str
    controlId: str
    status: Union['open', 'in_progress', 'closed']
    createdAt: str
    updatedAt: str

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class Gap(BaseModel):
    """Gap - Modèle harmonisé EBIOS RM"""

    id: str
    description: str
    controlId: str
    status: Union['open', 'in_progress', 'closed']
    createdAt: str
    updatedAt: str

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class SecurityBaselineGap(BaseModel):
    """SecurityBaselineGap - Modèle harmonisé EBIOS RM"""

    id: str
    controlId: str
    description: str
    impact: str
    likelihood: str
    priority: Union['low', 'medium', 'high']
    remediationPlan: Optional[str] = None
    dueDate: Optional[str] = None
    status: Union['open', 'in_progress', 'closed']
    createdAt: str
    updatedAt: str

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class SecurityBaseline(BaseModel):
    """SecurityBaseline - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    description: str
    category: str
    status: Union['draft', 'in_review', 'approved', 'archived']
    gaps: List[SecurityBaselineGap]
    missionId: Optional[str] = None
    createdAt: str
    updatedAt: str

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class EbiosScale(BaseModel):
    """EbiosScale - Modèle harmonisé EBIOS RM"""

    gravity: {
    1: 'Négligeable'
    2: 'Limitée'
    3: 'Importante'
    4: 'Critique'

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class Vulnerability(BaseModel):
    """Vulnerability - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    description: str
    type: Union['technical', 'human', 'physical', 'organizational']
    severity: Union['low', 'medium', 'high', 'critical']
    cvssScore: Optional[int] = None
    cveId: Optional[str] = None
    exploitability: str
    assetId: str
    remediationStatus: Union['open', 'in_progress', 'resolved', 'accepted']
    createdAt: str
    updatedAt: str

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class Dict[str, Any](BaseModel):
    """Dict[str, Any] - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    description: str
    riskSourceId: str
    techniques: List[str]
    difficulty: str
    detectability: str
    prerequisites: List[str]

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AccessRight(BaseModel):
    """AccessRight - Modèle harmonisé EBIOS RM"""

    id: str
    stakeholderId: str
    assetId: str
    accessType: Union['read', 'write', 'execute', 'admin', 'full']
    accessLevel: Union['physical', 'logical', 'both']
    conditions: List[str]

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class Dict[str, Any](BaseModel):
    """Dict[str, Any] - Modèle harmonisé EBIOS RM"""

    id: str
    scenarioId: str
    stakeholderId: str
    compromiseLevel: Union['partial', 'total']
    prerequisites: List[str]
    techniques: List[str]
    sequence: int
    # CORRECTION: Propriétés manquantes utilisées dans le code
    name: Optional[str] = None
    description: Optional[str] = None
    feasibility: Optional[int] = None
    detectability: Optional[int] = None
    steps: Optional[Any] = None
    id: str
    name: str
    description: str
    technique: str
    difficulty: int
    detectability: int

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AttackPathSuggestion(BaseModel):
    """AttackPathSuggestion - Modèle harmonisé EBIOS RM"""

    name: str
    description: str
    feasibility: Union[1, 2, 3, 4]
    detectability: Union[1, 2, 3, 4]
    # confidence: int
    reasoning: str
    steps: Any
    name: str
    description: str
    techniques: List[str]
    duration: str
    detectability: int

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class Dict[str, Any](BaseModel):
    """Dict[str, Any] - Modèle harmonisé EBIOS RM"""

    id: str
    measureId: str
    implementationDate: Optional[str] = None
    verificationDate: Optional[str] = None
    verificationMethod: str
    verificationResult: Optional[Union['effective', 'partially_effective', 'ineffective']] = None
    residualRisk: str
    comments: str
    evidences: List[str]

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class WorkshopValidation(BaseModel):
    """WorkshopValidation - Modèle harmonisé EBIOS RM"""

    criterion: str
    required: bool
    met: bool
    evidence: Optional[str] = None
    comments: Optional[str] = None

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class ExpertValidation(BaseModel):
    """ExpertValidation - Modèle harmonisé EBIOS RM"""

    validatorId: str
    validationDate: str
    approved: bool
    comments: str
    recommendations: Optional[List[str]] = None

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class OrganizationContext(BaseModel):
    """OrganizationContext - Modèle harmonisé EBIOS RM"""

    organizationType: Union['public', 'private', 'critical_infrastructure', 'oiv']
    sector: str
    size: Union['small', 'medium', 'large', 'enterprise']
    regulatoryRequirements: List[str]
    securityObjectives: List[str]
    constraints: List[str]

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AnalysisScope(BaseModel):
    """AnalysisScope - Modèle harmonisé EBIOS RM"""

    boundaries: str
    inclusions: List[str]
    exclusions: List[str]
    timeFrame: {
    start: str
    end: str

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class EbiosCompliance(BaseModel):
    """EbiosCompliance - Modèle harmonisé EBIOS RM"""

    version: '1.5'
    completionPercentage: int
    lastValidationDate: Optional[str] = None
    complianceGaps: List[ComplianceGap]
    certificationLevel: Optional[Union['basic', 'advanced', 'expert']] = None
    validatedWorkshops: Optional[List[int]] = None

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class ComplianceGap(BaseModel):
    """ComplianceGap - Modèle harmonisé EBIOS RM"""

    workshop: int
    requirement: str
    currentStatus: str
    requiredStatus: str
    priority: str
    remediationPlan: Optional[str] = None

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class EbiosWorkshopState(BaseModel):
    """EbiosWorkshopState - Modèle harmonisé EBIOS RM"""

    workshop: Union[1, 2, 3, 4, 5]
    status: Union['not_started', 'in_progress', 'completed', 'validated', 'requires_review']
    completionRate: int
    startedAt: Optional[str] = None
    completedAt: Optional[str] = None
    validatedAt: Optional[str] = None
    validatedBy: Optional[str] = None
    participants: List[WorkshopParticipant]
    deliverables: List[WorkshopDeliverable]
    issues: List[WorkshopIssue]
    agentContributions: Optional[List[AgentContribution]] = None

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class WorkshopParticipant(BaseModel):
    """WorkshopParticipant - Modèle harmonisé EBIOS RM"""

    userId: str
    role: Union['facilitator', 'expert', 'stakeholder', 'observer']
    name: str
    organization: Optional[str] = None
    expertise: List[str]
    participationRate: int

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class WorkshopDeliverable(BaseModel):
    """WorkshopDeliverable - Modèle harmonisé EBIOS RM"""

    id: str
    type: Union['document', 'matrix', 'diagram', 'report']
    name: str
    description: str
    status: Union['draft', 'review', 'approved', 'final']
    createdAt: str
    createdBy: str
    approvedBy: Optional[str] = None
    approvedAt: Optional[str] = None
    version: str
    content: Optional[Any] = None

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class WorkshopIssue(BaseModel):
    """WorkshopIssue - Modèle harmonisé EBIOS RM"""

    id: str
    severity: Union['info', 'warning', 'error', 'critical']
    category: Union['methodology', 'data_quality', 'compliance', 'technical']
    title: str
    description: str
    detectedAt: str
    detectedBy: Union['user', 'agent', 'validation']
    status: Union['open', 'in_progress', 'resolved', 'deferred']
    resolution: Optional[str] = None
    resolvedAt: Optional[str] = None
    resolvedBy: Optional[str] = None

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AgentContribution(BaseModel):
    """AgentContribution - Modèle harmonisé EBIOS RM"""
    # agentId: str
    agentName: str
    contributionType: Union['suggestion', 'validation', 'generation', 'analysis']
    description: str
    # confidence: int
    timestamp: str
    # accepted: bool
    feedback: Optional[str] = None

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class DecisionLogEntry(BaseModel):
    """DecisionLogEntry - Modèle harmonisé EBIOS RM"""

    id: str
    timestamp: str
    userId: str
    workshopStep: str
    decisionType: Union['creation', 'modification', 'deletion', 'validation', 'approval']
    entityType: str
    entityId: str
    previousValue: Optional[Any] = None
    newValue: Any
    rationale: str
    aiRecommendation: Optional[Dict[str, Any]] = None
    # agentId: str
    # recommendation: Any
    # confidence: int
    # reasoning: List[str]
    # accepted: bool
    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class ValidationHistoryEntry(BaseModel):
    """ValidationHistoryEntry - Modèle harmonisé EBIOS RM"""

    id: str
    timestamp: str
    validationType: Union['workshop', 'entity', 'global', 'anssi_compliance']
    workshop: Optional[int] = None
    entityType: Optional[str] = None
    entityId: Optional[str] = None
    validationResult: {
    isValid: bool
    score: int
    criticalIssues: List[str]
    warnings: List[str]
    recommendations: List[str]

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class Timestamp(BaseModel):
    """Timestamp - Modèle harmonisé EBIOS RM"""

    seconds: int
    nanoseconds: int

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class Dict[str, Any](BaseModel):
    """Dict[str, Any] - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    description: str
    technique: str
    difficulty: int
    detectability: int
    mitreTechniques: Optional[List[MitreTechniqueDetails]] = None
    mitreTactics: Optional[List[MitreTacticDetails]] = None
    killChainPhase: Optional[str] = None
    duration: Optional[str] = None
    prerequisites: Optional[List[str]] = None
    indicators: Optional[List[str]] = None

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class MitreTechniqueDetails(BaseModel):
    """MitreTechniqueDetails - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    tactic: str
    description: str
    platforms: List[str]
    dataSource: str
    detection: str
    mitigation: str

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class MitreTacticDetails(BaseModel):
    """MitreTacticDetails - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    description: str
    techniques: List[str]

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AttackCapability(BaseModel):
    """AttackCapability - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    description: str
    category: Union['technical', 'social', 'physical', 'hybrid']
    sophistication: Union['low', 'medium', 'high', 'expert']
    resources: Union['minimal', 'moderate', 'significant', 'extensive']
    techniques: List[str]
    platforms: List[str]
    detectability: int
    effectiveness: int

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class KillChainPhaseAnalysis(BaseModel):
    """KillChainPhaseAnalysis - Modèle harmonisé EBIOS RM"""

    phase: str
    techniques: List[str]
    difficulty: int
    detectability: int
    duration: str
    indicators: List[str]
    countermeasures: List[str]
    probability: Optional[int] = None
    # CORRECTION: Propriété manquante

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class ScenarioGenerationContext(BaseModel):
    """ScenarioGenerationContext - Modèle harmonisé EBIOS RM"""

    businessAssets: List[BusinessValue]
    supportingAssets: List[SupportingAsset]
    identifiedThreats: List[RiskSource]
    organizationalContext: OrganizationContext
    threatLandscape: {
    sector: str
    geographicalZone: List[str]
    regulatoryFramework: List[str]
    currentThreats: List[str]

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class ThreatModelingContext(BaseModel):
    """ThreatModelingContext - Modèle harmonisé EBIOS RM"""

    organizationProfile: {
    sector: str
    size: Union['small', 'medium', 'large', 'enterprise']
    criticalAssets: List[str]
    regulatoryRequirements: List[str]

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class SecurityOptimizationContext(BaseModel):
    """SecurityOptimizationContext - Modèle harmonisé EBIOS RM"""

    organizationProfile: {
    sector: str
    size: str
    budget: int
    riskTolerance: Union['low', 'medium', 'high']

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class DataQualityIssue(BaseModel):
    """DataQualityIssue - Modèle harmonisé EBIOS RM"""

    id: str
    type: Union['missing', 'invalid', 'inconsistent', 'duplicate', 'incoherent']
    severity: Union['low', 'medium', 'high', 'critical']
    field: str
    value: str
    message: str
    suggestion: str
    # confidence: int
    autoFixAvailable: bool
    suggestedValue: Optional[str] = None
    stableKey: str
    # CORRECTION: Propriété manquante
    originalValue: str
    # CORRECTION: Propriété manquante

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AISuggestion(BaseModel):
    """AISuggestion - Modèle harmonisé EBIOS RM"""

    id: str
    type: AISuggestionType
    priority: AISuggestionPriority
    category: AISuggestionCategory
    title: str
    description: str
    actionText: Optional[str] = None
    actionData: Optional[Any] = None
    confidence: AIConfidenceLevel
    relevance: AIRelevanceScore
    source: Union['anssi', 'iso27005', 'ebios-rm', 'expert-knowledge', 'ml-model', 'agent-based']
    context: AIContext
    relatedData: Optional[Any] = None
    createdAt: str
    appliedAt: Optional[str] = None
    isApplied: bool
    feedback: Optional[AISuggestionFeedback] = None

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AIContext(BaseModel):
    """AIContext - Modèle harmonisé EBIOS RM"""

    missionId: str
    workshopNumber: Union[1, 2, 3, 4, 5]
    currentStep: Optional[str] = None
    userProfile: Optional[AIUserProfile] = None
    organizationContext: Optional[AIOrganizationContext] = None
    existingData: Optional[Any] = None
    crossWorkshopData: Optional[Any] = None

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AIUserProfile(BaseModel):
    """AIUserProfile - Modèle harmonisé EBIOS RM"""

    experienceLevel: Union['novice', 'intermediate', 'expert']
    role: Union['analyst', 'manager', 'consultant', 'auditor']
    preferences: {
    suggestionFrequency: Union['minimal', 'moderate', 'comprehensive']
    detailLevel: Union['basic', 'detailed', 'expert']
    autoApply: bool

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AIOrganizationContext(BaseModel):
    """AIOrganizationContext - Modèle harmonisé EBIOS RM"""

    sector: str
    size: Union['small', 'medium', 'large', 'enterprise']
    maturityLevel: Union['initial', 'developing', 'defined', 'managed', 'optimizing']
    regulations: List[str]
    constraints: List[str]

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AISuggestionFeedback(BaseModel):
    """AISuggestionFeedback - Modèle harmonisé EBIOS RM"""

    rating: Union[1, 2, 3, 4, 5]
    comment: Optional[str] = None
    applied: bool
    helpful: bool
    timestamp: str

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AICoherenceAnalysis(BaseModel):
    """AICoherenceAnalysis - Modèle harmonisé EBIOS RM"""

    overallScore: AIRelevanceScore
    issues: List[AICoherenceIssue]
    recommendations: List[AISuggestion]
    crossWorkshopConsistency: Any
    methodologyCompliance: AIRelevanceScore

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AICoherenceIssue(BaseModel):
    """AICoherenceIssue - Modèle harmonisé EBIOS RM"""

    id: str
    severity: Union['low', 'medium', 'high', 'critical']
    category: str
    title: str
    description: str
    affectedElements: List[str]
    suggestedFix: Optional[str] = None
    autoFixable: bool

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AIEnrichmentMetadata(BaseModel):
    """AIEnrichmentMetadata - Modèle harmonisé EBIOS RM"""

    confidence: AIConfidenceLevel
    sources: List[str]
    tags: List[str]
    relatedConcepts: List[str]
    riskLevel: Optional[Union['low', 'medium', 'high', 'critical']] = None
    impactAssessment: Optional[AIImpactAssessment] = None
    recommendations: Optional[List[str]] = None
    lastUpdated: str

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AIImpactAssessment(BaseModel):
    """AIImpactAssessment - Modèle harmonisé EBIOS RM"""

    businessImpact: AIRelevanceScore
    technicalImpact: AIRelevanceScore
    complianceImpact: AIRelevanceScore
    overallRisk: AIRelevanceScore
    mitigationSuggestions: List[str]

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AIOrchestrationContext(BaseModel):
    """AIOrchestrationContext - Modèle harmonisé EBIOS RM"""

    currentWorkshop: int
    globalContext: GlobalMissionContext
    currentData: Any
    previousWorkshopsData: Any
    userPreferences: AIUserProfile

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class GlobalMissionContext(BaseModel):
    """GlobalMissionContext - Modèle harmonisé EBIOS RM"""

    missionId: str
    organizationProfile: AIOrganizationContext
    objectives: List[str]
    constraints: List[str]
    timeline: {
    startDate: str
    targetDate: str
    currentPhase: str

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AIAgent(BaseModel):
    """AIAgent - Modèle harmonisé EBIOS RM"""

    id: str
    name: str
    type: Union['analyzer', 'recommender', 'validator', 'orchestrator']
    capabilities: List[str]
    specialization: List[AISuggestionCategory]
    status: Union['active', 'inactive', 'error']
    lastActivity: Optional[str] = None

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AIAgentResponse(BaseModel):
    """AIAgentResponse - Modèle harmonisé EBIOS RM"""
    # agentId: str
    suggestions: List[AISuggestion]
    analysis: Optional[Any] = None
    confidence: AIConfidenceLevel
    processingTime: int
    metadata: Any

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class MLPrediction(BaseModel):
    """MLPrediction - Modèle harmonisé EBIOS RM"""

    prediction: Any
    confidence: AIConfidenceLevel
    features: Any
    modelVersion: str
    timestamp: str

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class A2AMessage(BaseModel):
    """A2AMessage - Modèle harmonisé EBIOS RM"""

    id: str
    from: str
    to: str
    type: Union['request', 'response', 'notification', 'error']
    payload: Any
    timestamp: str
    correlationId: Optional[str] = None

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AIMetrics(BaseModel):
    """AIMetrics - Modèle harmonisé EBIOS RM"""

    suggestionAccuracy: AIRelevanceScore
    userSatisfaction: AIRelevanceScore
    responseTime: int
    throughput: int
    errorRate: int
    cacheHitRate: int
    modelPerformance: Any

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AIHealthStatus(BaseModel):
    """AIHealthStatus - Modèle harmonisé EBIOS RM"""

    overall: Union['healthy', 'degraded', 'unhealthy']
    services: Any
    status: Union['up', 'down', 'degraded']
    responseTime: int
    lastCheck: str

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class AIConfiguration(BaseModel):
    """AIConfiguration - Modèle harmonisé EBIOS RM"""

    enabled: bool
    services: {
    suggestions: bool
    coherenceAnalysis: bool
    autoEnrichment: bool
    mlPredictions: bool
    agentOrchestration: bool

    class Config:
        """Configuration Pydantic"""
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }


# === MODÈLES DE BASE ===

class BaseEbiosModel(BaseModel):
    """Modèle de base pour tous les objets EBIOS RM"""
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    mission_id: str

class SecurityLevel(str, Enum):
    """Niveaux de sécurité"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ImpactType(str, Enum):
    """Types d'impact"""
    CONFIDENTIALITY = "confidentiality"
    INTEGRITY = "integrity"
    AVAILABILITY = "availability"
    AUTHENTICITY = "authenticity"

class CriticalityLevel(str, Enum):
    """Niveaux de criticité"""
    VERY_LOW = "very_low"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    VERY_HIGH = "very_high"

