from fastapi import APIRouter, HTTPException
from db.supabase_client import supabase

router = APIRouter()

@router.get("/analyses")
def get_all_analyses():
    try:
        result = supabase.table("analyses")\
            .select("*, documents(filename, doc_type, created_at)")\
            .order("created_at", desc=True)\
            .execute()

        return {"analyses": result.data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/analyses/{analysis_id}")
def get_single_analysis(analysis_id: str):
    try:
        result = supabase.table("analyses")\
            .select("*, documents(filename, doc_type, created_at)")\
            .eq("id", analysis_id)\
            .single()\
            .execute()

        if not result.data:
            raise HTTPException(status_code=404, detail="Analysis not found")

        return result.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/analyses/{analysis_id}")
def delete_analysis(analysis_id: str):
    try:
        # Get document info first
        analysis = supabase.table("analyses")\
            .select("*, documents(storage_path)")\
            .eq("id", analysis_id)\
            .single()\
            .execute()

        if not analysis.data:
            raise HTTPException(status_code=404, detail="Analysis not found")

        storage_path = analysis.data["documents"]["storage_path"]
        document_id = analysis.data["document_id"]

        # Delete from Storage
        supabase.storage.from_("legal-documents").remove([storage_path])

        # Delete analysis record
        supabase.table("analyses")\
            .delete()\
            .eq("id", analysis_id)\
            .execute()

        # Delete document record
        supabase.table("documents")\
            .delete()\
            .eq("id", document_id)\
            .execute()

        return {"message": "Document and analysis deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))