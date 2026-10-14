from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    GROQ_API_KEY: str
    GROQ_MODEL: str = "openai/gpt-oss-120b"

    QDRANT_URL: str
    QDRANT_API_KEY: str

    DATABASE_URL: str

    JWT_SECRET_KEY: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()