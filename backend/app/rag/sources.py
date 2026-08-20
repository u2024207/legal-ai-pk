"""Canonical legal corpus sources for the RAG pipeline."""

from pathlib import Path

from app.config import settings

PRIMARY_DATASET = {
    "key": "zenodo_structured_pakistani_law",
    "name": "Zenodo Structured Pakistani Law Dataset",
    "role": "primary",
    "url": "https://zenodo.org/records/20509007",
    "api_url": "https://zenodo.org/api/records/20509007",
    "download_file": "combined_legal_dataset.csv",
    "description": (
        "Main corpus to start RAG: structured Pakistani legal acts "
        "(criminal, family, property, evidence, procedure)."
    ),
    "schema_hint": "Book | Chapter Number | Chapter Title | Section | Heading | Definition",
}

EXPANSION_DATASET = {
    "key": "ayeshajadoon_pakistan_laws",
    "name": "AyeshaJadoon Pakistan Laws Dataset",
    "role": "expansion",
    "url": "https://huggingface.co/datasets/AyeshaJadoon/Pakistan_Laws_Dataset",
    "hf_id": "AyeshaJadoon/Pakistan_Laws_Dataset",
    "description": (
        "Larger collection of Pakistani laws used to expand the corpus "
        "once the initial RAG pipeline is working."
    ),
    "schema_hint": None,
}


def primary_local_path() -> Path:
    return settings.data_dir / "primary" / PRIMARY_DATASET["download_file"]


def expansion_marker_path() -> Path:
    return settings.data_dir / "expansion" / "READY.txt"
