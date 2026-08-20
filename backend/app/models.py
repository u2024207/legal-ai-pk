from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("email", name="uq_users_email"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    role: Mapped[str] = mapped_column(String(20), index=True)
    full_name: Mapped[str] = mapped_column(String(200))
    email: Mapped[str] = mapped_column(String(255), index=True)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    preferred_language: Mapped[str] = mapped_column(String(32), default="english")
    status: Mapped[str] = mapped_column(String(40), default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    lawyer_profile: Mapped["LawyerProfile | None"] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )


class LawyerProfile(Base):
    __tablename__ = "lawyer_profiles"
    __table_args__ = (UniqueConstraint("cnic", name="uq_lawyer_cnic"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    cnic: Mapped[str] = mapped_column(String(20), index=True)
    bar_council: Mapped[str] = mapped_column(String(120))
    enrollment_number: Mapped[str] = mapped_column(String(80))
    enrollment_date: Mapped[str] = mapped_column(String(20))
    advocate_level: Mapped[str] = mapped_column(String(80))
    bar_association: Mapped[str] = mapped_column(String(160))
    province: Mapped[str] = mapped_column(String(80))
    city: Mapped[str] = mapped_column(String(80))
    practice_courts: Mapped[str] = mapped_column(String(255))
    primary_specialization: Mapped[str] = mapped_column(String(120))
    other_specializations: Mapped[str] = mapped_column(Text, default="")
    court_practice: Mapped[str] = mapped_column(String(255), default="")
    consultation_type: Mapped[str] = mapped_column(String(40))
    years_experience: Mapped[str] = mapped_column(String(40))
    languages_known: Mapped[str] = mapped_column(String(255))
    professional_bio: Mapped[str] = mapped_column(Text)
    verification_status: Mapped[str] = mapped_column(String(40), default="pending")
    info_confirmed: Mapped[bool] = mapped_column(Boolean, default=False)
    cnic_front_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    cnic_back_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    bar_card_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    passport_photo_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    additional_doc_path: Mapped[str | None] = mapped_column(String(500), nullable=True)

    user: Mapped[User] = relationship(back_populates="lawyer_profile")
