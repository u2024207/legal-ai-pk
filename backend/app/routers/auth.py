import json
import re
from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.deps import get_current_user
from app.models import LawyerProfile, User
from app.schemas import ClientRegisterRequest, LoginRequest, TokenResponse, UserPublic
from app.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

ALLOWED_UPLOAD_TYPES = {
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/octet-stream",
}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024


def _token_for(user: User) -> TokenResponse:
    return TokenResponse(
        access_token=create_access_token(str(user.id), user.role),
        role=user.role,
        full_name=user.full_name,
        status=user.status,
    )


def _email_taken(db: Session, email: str) -> bool:
    return db.query(User).filter(User.email == email.lower()).first() is not None


def _normalize_cnic(value: str) -> str:
    digits = re.sub(r"\D", "", value)
    if len(digits) != 13:
        raise HTTPException(status_code=400, detail="CNIC must be 13 digits")
    return f"{digits[:5]}-{digits[5:12]}-{digits[12]}"


def _save_upload(file: UploadFile | None, folder: Path, name: str) -> str | None:
    if file is None or not file.filename:
        return None
    if file.content_type and file.content_type not in ALLOWED_UPLOAD_TYPES:
        raise HTTPException(status_code=400, detail=f"Unsupported file type for {name}")
    data = file.file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail=f"{name} exceeds 5MB")
    suffix = Path(file.filename).suffix.lower() or ".bin"
    dest = folder / f"{name}{suffix}"
    dest.write_bytes(data)
    return str(dest)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    return _token_for(user)


@router.post("/register/client", response_model=TokenResponse, status_code=201)
def register_client(payload: ClientRegisterRequest, db: Session = Depends(get_db)):
    if _email_taken(db, payload.email):
        raise HTTPException(status_code=400, detail="An account with this email already exists")
    user = User(
        role="client",
        full_name=payload.full_name.strip(),
        email=payload.email.lower(),
        phone=payload.phone,
        hashed_password=hash_password(payload.password),
        preferred_language=payload.preferred_language,
        status="active",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _token_for(user)


@router.post("/register/lawyer", response_model=TokenResponse, status_code=201)
async def register_lawyer(
    payload: str = Form(...),
    cnic_front: UploadFile = File(...),
    cnic_back: UploadFile = File(...),
    bar_card: UploadFile = File(...),
    passport_photo: UploadFile = File(...),
    additional_document: UploadFile | None = File(None),
    db: Session = Depends(get_db),
):
    try:
        data = json.loads(payload)
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=400, detail="Invalid registration payload") from exc

    required = [
        "full_name",
        "email",
        "password",
        "cnic",
        "bar_council",
        "enrollment_number",
        "enrollment_date",
        "advocate_level",
        "bar_association",
        "province",
        "city",
        "practice_courts",
        "primary_specialization",
        "consultation_type",
        "years_experience",
        "languages_known",
        "professional_bio",
    ]
    missing = [key for key in required if not str(data.get(key, "")).strip()]
    if missing:
        raise HTTPException(status_code=400, detail=f"Missing fields: {', '.join(missing)}")

    email = str(data["email"]).lower()
    if _email_taken(db, email):
        raise HTTPException(status_code=400, detail="An account with this email already exists")
    if data["password"] != data.get("confirm_password", data["password"]):
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if len(data["password"]) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    cnic = _normalize_cnic(str(data["cnic"]))
    if db.query(LawyerProfile).filter(LawyerProfile.cnic == cnic).first():
        raise HTTPException(status_code=400, detail="A lawyer profile with this CNIC already exists")

    user = User(
        role="lawyer",
        full_name=str(data["full_name"]).strip(),
        email=email,
        phone=data.get("phone"),
        hashed_password=hash_password(data["password"]),
        preferred_language=data.get("preferred_language", "english"),
        status="pending_verification",
    )
    db.add(user)
    db.flush()

    folder = settings.upload_dir / "lawyers" / str(user.id)
    folder.mkdir(parents=True, exist_ok=True)
    extra = additional_document if additional_document and additional_document.filename else None

    languages = data.get("languages_known")
    if isinstance(languages, list):
        languages = ", ".join(languages)
    others = data.get("other_specializations")
    if isinstance(others, list):
        others = ", ".join(others)

    profile = LawyerProfile(
        user_id=user.id,
        cnic=cnic,
        bar_council=data["bar_council"],
        enrollment_number=data["enrollment_number"],
        enrollment_date=data["enrollment_date"],
        advocate_level=data["advocate_level"],
        bar_association=data["bar_association"],
        province=data["province"],
        city=data["city"],
        practice_courts=data.get("practice_courts") or data.get("court_practice", ""),
        primary_specialization=data["primary_specialization"],
        other_specializations=others or "",
        court_practice=data.get("court_practice", ""),
        consultation_type=data["consultation_type"],
        years_experience=data["years_experience"],
        languages_known=languages or "",
        professional_bio=str(data["professional_bio"])[:500],
        verification_status="pending",
        info_confirmed=bool(data.get("info_confirmed")),
        cnic_front_path=_save_upload(cnic_front, folder, "cnic_front"),
        cnic_back_path=_save_upload(cnic_back, folder, "cnic_back"),
        bar_card_path=_save_upload(bar_card, folder, "bar_card"),
        passport_photo_path=_save_upload(passport_photo, folder, "passport_photo"),
        additional_doc_path=_save_upload(extra, folder, "additional") if extra else None,
    )
    db.add(profile)
    db.commit()
    db.refresh(user)
    return _token_for(user)


@router.get("/me", response_model=UserPublic)
def me(user: User = Depends(get_current_user)):
    verification = None
    if user.lawyer_profile:
        verification = user.lawyer_profile.verification_status
    return UserPublic(
        id=user.id,
        role=user.role,
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        preferred_language=user.preferred_language,
        status=user.status,
        verification_status=verification,
    )
