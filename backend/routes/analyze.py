from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from services.pdf_extractor import extract_text_from_pdf, is_text_empty
from services.summarizer import summarize_document
from services.risk_extractor import extract_risks_and_obligations
from services.clause_classifier import classify_clauses
from db.supabase_client import supabase
from utils.auth import get_current_user
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/analyze")
async def analyze_document(
    file: UploadFile = File(...),
    doc_type: str = Form(default="general"),
    user_id: str = Depends(get_current_user),
):
    # Validate file type
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    # Read file bytes
    pdf_bytes = await file.read()

    if len(pdf_bytes) > 50 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 50MB limit")

    # Extract text
    text = extract_text_from_pdf(pdf_bytes)

    if is_text_empty(text):
        raise HTTPException(
            status_code=422,
            detail="Could not extract text from this PDF. Scanned image PDFs will be supported in Phase 2.",
        )

    # Run all AI services
    summary = summarize_document(text)
    risks_and_obligations = extract_risks_and_obligations(text)
    clause_labels = classify_clauses(text)

    # Upload PDF to Supabase Storage (scoped per user)
    file_path = f"documents/{user_id}/{uuid.uuid4()}.pdf"
    supabase.storage.from_("legal-documents").upload(
        file_path,
        pdf_bytes,
        {"content-type": "application/pdf"},
    )

    # Save document record to DB
    document = (
        supabase.table("documents")
        .insert(
            {
                "user_id": user_id,
                "filename": file.filename,
                "storage_path": file_path,
                "doc_type": doc_type,
            }
        )
        .execute()
    )

    document_id = document.data[0]["id"]

    # Save analysis results to DB
    analysis = (
        supabase.table("analyses")
        .insert(
            {
                "document_id": document_id,
                "summary": summary,
                "obligations": risks_and_obligations.get("obligations", []),
                "deadlines": risks_and_obligations.get("deadlines", []),
                "risk_flags": risks_and_obligations.get("risk_flags", []),
                "clause_labels": clause_labels,
            }
        )
        .execute()
    )

    return {
        "document_id": document_id,
        "analysis_id": analysis.data[0]["id"],
        "doc_type": doc_type,
        "summary": summary,
        "obligations": risks_and_obligations.get("obligations", []),
        "deadlines": risks_and_obligations.get("deadlines", []),
        "risk_flags": risks_and_obligations.get("risk_flags", []),
        "clause_labels": clause_labels,
        "created_at": datetime.utcnow().isoformat(),
    }