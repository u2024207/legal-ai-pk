from fastapi import APIRouter, HTTPException

from app.rag.ingest import chunk_preview, dataset_status, ingest_primary, prepare_expansion

router = APIRouter(prefix="/rag", tags=["rag"])


@router.get("/sources")
def sources():
    return dataset_status()


@router.post("/ingest/primary")
def ingest_primary_dataset():
    try:
        return ingest_primary()
    except Exception as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


@router.post("/ingest/expansion")
def queue_expansion_dataset():
    return prepare_expansion()


@router.get("/preview")
def preview(limit: int = 5):
    return {"chunks": chunk_preview(limit)}
