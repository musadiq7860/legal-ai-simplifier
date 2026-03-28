from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DeadlineItem(BaseModel):
    date: Optional[str]
    description: str

class RiskFlag(BaseModel):
    clause: str
    level: str  # high | medium | low
    explanation: str

class ClauseLabel(BaseModel):
    text: str
    label: str  # payment | penalty | deadline | obligation
    confidence: float

class AnalysisResponse(BaseModel):
    document_id: str
    doc_type: str
    summary: str
    obligations: List[str]
    deadlines: List[DeadlineItem]
    risk_flags: List[RiskFlag]
    clause_labels: List[ClauseLabel]
    created_at: Optional[datetime]

class AnalyzeRequest(BaseModel):
    doc_type: Optional[str] = "general"