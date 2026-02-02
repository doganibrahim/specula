import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    RAPIDAPI_KEY: str
    RAPIDAPI_HOST: str = "jsearch.p.rapidapi.com"

    model_config = {
        "env_file": os.path.join(os.path.dirname(__file__), ".env"),
        "env_file_encoding": "utf-8"
    }

settings = Settings()
