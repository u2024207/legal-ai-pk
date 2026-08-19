from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ROOT_DIR / ".env", extra="ignore")

    app_name: str = "LegalAI PK"
    secret_key: str = "dev-change-this-secret-key"
    access_token_expire_minutes: int = 60 * 24 * 7
    algorithm: str = "HS256"
    database_url: str = f"sqlite:///{(ROOT_DIR / 'legalai.db').as_posix()}"
    upload_dir: Path = ROOT_DIR / "uploads"
    data_dir: Path = ROOT_DIR / "data"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()
settings.upload_dir.mkdir(parents=True, exist_ok=True)
settings.data_dir.mkdir(parents=True, exist_ok=True)
