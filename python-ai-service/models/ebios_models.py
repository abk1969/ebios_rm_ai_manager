"""
🎯 MODÈLES DE DONNÉES EBIOS RM
Modèles Pydantic pour l'intégration IA Workshop 1
"""

from pydantic import BaseModel, Field, validator
from typing import List, Dict, Any, Optional, Union
from datetime import datetime
from enum import Enum

# === ÉNUMÉRATIONS ===

class SecurityLevel(str, Enum):
    PUBLIC = "public"
    INTERNAL = "internal"
    CONFIDENTIAL = "confidential"
    SECRET = "secret"

class ImpactType(str, Enum):
    AVAILABILITY = "availability"
    INTEGRITY = "integrity"
    CONFIDENTIALITY = "confidentiality"
    TRACEABILITY = "traceability"

class CriticalityLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class SuggestionType(str, Enum):
    ACTION = "action"
    TIP = "tip"
    WARNING = "warning"
    INSIGHT = "insight"

class SuggestionPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

# === MODÈLES MÉTIER EBIOS RM ===

class BusinessValue(BaseModel):
    """Valeur métier EBIOS RM"""
    id: str
    name: str
    description: str
    criticality: CriticalityLevel
    impact_description: str
    stakeholders: List[str] = []
    regulatory_requirements: List[str] = []
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    mission_id: str

class EssentialAsset(BaseModel):
    """Bien essentiel EBIOS RM"""
    id: str
    name: str
    description: str
    business_value_id: str
    asset_type: str
    security_needs: Dict[str, CriticalityLevel]
    dependencies: List[str] = []
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    mission_id: str

class SupportingAsset(BaseModel):
    """Bien support EBIOS RM"""
    id: str
    name: str
    description: str
    essential_asset_id: str
    business_value_id: str  # Pour compatibilité
    asset_type: str
    security_level: SecurityLevel
    vulnerabilities: List[str] = []
    depends_on: List[str] = []
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    mission_id: str

class DreadedEvent(BaseModel):
    """Événement redouté EBIOS RM"""
    id: str
    name: str
    description: str
    business_value_id: str
    essential_asset_id: str
    impact_type: ImpactType
    severity: CriticalityLevel
    consequences: str
    likelihood: float = Field(ge=0, le=1)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    mission_id: str

# === MODÈLES IA ET SUGGESTIONS ===

class WorkshopContext(BaseModel):
    """Contexte d'atelier pour l'IA"""
    mission_id: str
    workshop_number: int
    current_step: Optional[str] = None
    business_values: List[BusinessValue] = []
    essential_assets: List[EssentialAsset] = []
    supporting_assets: List[SupportingAsset] = []
    dreaded_events: List[DreadedEvent] = []
    completion_percentage: float = Field(ge=0, le=100)
    last_activity: datetime = Field(default_factory=datetime.now)

class AISuggestion(BaseModel):
    """Suggestion générée par l'IA"""
    id: str
    type: SuggestionType
    priority: SuggestionPriority
    title: str
    description: str
    rationale: str
    action_label: Optional[str] = None
    action_data: Optional[Dict[str, Any]] = None
    confidence: float = Field(ge=0, le=1)
    context: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.now)
    applied: bool = False

class CoherenceIssue(BaseModel):
    """Problème de cohérence détecté"""
    id: str
    severity: CriticalityLevel
    category: str
    title: str
    description: str
    affected_elements: List[str]
    suggested_fix: Optional[str] = None
    auto_fixable: bool = False

class CoherenceReport(BaseModel):
    """Rapport de cohérence"""
    mission_id: str
    overall_score: float = Field(ge=0, le=100)
    issues: List[CoherenceIssue] = []
    recommendations: List[str] = []
    analysis_date: datetime = Field(default_factory=datetime.now)
    
    @property
    def is_coherent(self) -> bool:
        return self.overall_score >= 80 and len([i for i in self.issues if i.severity in ['high', 'critical']]) == 0

# === MODÈLES D'ANALYSE ===

class WorkshopAnalysis(BaseModel):
    """Analyse complète d'un atelier"""
    mission_id: str
    workshop_number: int
    completion_status: Dict[str, bool]
    quality_metrics: Dict[str, float]
    suggestions: List[AISuggestion]
    coherence_report: CoherenceReport
    next_steps: List[str]
    estimated_completion_time: Optional[str] = None
    analysis_timestamp: datetime = Field(default_factory=datetime.now)

class GuidanceContent(BaseModel):
    """Contenu de guidance méthodologique"""
    step: str
    title: str
    description: str
    objectives: List[str]
    best_practices: List[str]
    common_mistakes: List[str]
    examples: List[str]
    validation_criteria: List[str]
    estimated_duration: Optional[str] = None

# === MODÈLES DE REQUÊTE ===

class AnalysisRequest(BaseModel):
    """Requête d'analyse"""
    mission_id: str
    include_suggestions: bool = True
    include_coherence: bool = True
    include_guidance: bool = True
    focus_areas: List[str] = []

class SuggestionRequest(BaseModel):
    """Requête de suggestion"""
    context: WorkshopContext
    criterion: str
    max_suggestions: int = Field(default=5, ge=1, le=20)
    priority_filter: Optional[List[SuggestionPriority]] = None

class AutoCompletionRequest(BaseModel):
    """Requête d'auto-complétion"""
    mission_id: str
    target_completion: float = Field(default=0.8, ge=0.5, le=1.0)
    preserve_existing: bool = True
    generate_examples: bool = True

# === MODÈLES DE RÉPONSE ===

class APIResponse(BaseModel):
    """Réponse API standard"""
    status: str
    message: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.now)
    request_id: Optional[str] = None

class AnalysisResponse(APIResponse):
    """Réponse d'analyse"""
    analysis: Optional[WorkshopAnalysis] = None

class SuggestionResponse(APIResponse):
    """Réponse de suggestions"""
    suggestions: List[AISuggestion] = []
    total_count: int = 0

class CoherenceResponse(APIResponse):
    """Réponse d'analyse de cohérence"""
    coherence_report: Optional[CoherenceReport] = None

# === VALIDATEURS ===

@validator('completion_percentage')
def validate_completion_percentage(cls, v):
    if not 0 <= v <= 100:
        raise ValueError('Le pourcentage de complétion doit être entre 0 et 100')
    return v

@validator('confidence')
def validate_confidence(cls, v):
    if not 0 <= v <= 1:
        raise ValueError('La confiance doit être entre 0 et 1')
    return v
