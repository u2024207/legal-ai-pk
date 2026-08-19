from pydantic import BaseModel, EmailStr, Field


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    full_name: str
    status: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class ClientRegisterRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=200)
    email: EmailStr
    phone: str | None = None
    password: str = Field(min_length=8, max_length=128)
    preferred_language: str = "english"


class UserPublic(BaseModel):
    id: int
    role: str
    full_name: str
    email: EmailStr
    phone: str | None
    preferred_language: str
    status: str
    verification_status: str | None = None

    model_config = {"from_attributes": True}


class DatasetSource(BaseModel):
    key: str
    name: str
    role: str
    url: str
    description: str
    schema_hint: str | None = None
    ingested: bool = False
    local_path: str | None = None
