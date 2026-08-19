import httpx

from app.config import settings
from app.rag.sources import (
    EXPANSION_DATASET,
    PRIMARY_DATASET,
    expansion_marker_path,
    primary_local_path,
)


def _file_url(record: dict, filename: str) -> str | None:
    for item in record.get("files", []):
        if item.get("key") == filename:
            return item["links"]["self"]
    return None


def ingest_primary() -> dict:
    """Download the combined Zenodo CSV used as the first RAG corpus."""
    dest = primary_local_path()
    dest.parent.mkdir(parents=True, exist_ok=True)
    with httpx.Client(follow_redirects=True, timeout=120.0) as client:
        record = client.get(PRIMARY_DATASET["api_url"]).raise_for_status().json()
        url = _file_url(record, PRIMARY_DATASET["download_file"])
        if not url:
            raise RuntimeError("combined_legal_dataset.csv was not found on Zenodo")
        response = client.get(url)
        response.raise_for_status()
        dest.write_bytes(response.content)
    return {
        "key": PRIMARY_DATASET["key"],
        "path": str(dest),
        "bytes": dest.stat().st_size,
        "rows_estimate": max(response.content.count(b"\n") - 1, 0),
    }


def prepare_expansion() -> dict:
    """Mark the Hugging Face corpus as the expansion source (download later)."""
    marker = expansion_marker_path()
    marker.parent.mkdir(parents=True, exist_ok=True)
    marker.write_text(
        "Expansion corpus: download with `datasets.load_dataset("
        f"\"{EXPANSION_DATASET['hf_id']}\")` after primary RAG is working.\n",
        encoding="utf-8",
    )
    return {"key": EXPANSION_DATASET["key"], "path": str(marker), "status": "queued"}


def dataset_status() -> dict:
    primary_path = primary_local_path()
    expansion_path = expansion_marker_path()
    return {
        "data_dir": str(settings.data_dir),
        "ready_for_chunking": primary_path.exists(),
        "sources": [
            {
                **{k: PRIMARY_DATASET[k] for k in ("key", "name", "role", "url", "description", "schema_hint")},
                "ingested": primary_path.exists(),
                "local_path": str(primary_path) if primary_path.exists() else None,
            },
            {
                **{k: EXPANSION_DATASET[k] for k in ("key", "name", "role", "url", "description")},
                "schema_hint": EXPANSION_DATASET.get("schema_hint"),
                "ingested": expansion_path.exists(),
                "local_path": str(expansion_path) if expansion_path.exists() else None,
            },
        ],
    }


def chunk_preview(limit: int = 5) -> list[dict]:
    path = primary_local_path()
    if not path.exists():
        return []
    import csv

    rows: list[dict] = []
    with path.open("r", encoding="utf-8", errors="replace", newline="") as handle:
        reader = csv.DictReader(handle)
        for i, row in enumerate(reader):
            if i >= limit:
                break
            text = " ".join(str(v) for v in row.values() if v)
            rows.append({"index": i, "preview": text[:400], "fields": list(row.keys())})
    return rows
