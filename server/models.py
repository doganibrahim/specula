from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class JobPost(BaseModel):
    job_id: str
    employer_name: str
    job_title: str
    job_description: Optional[str] = None
    job_city: Optional[str] = None
    job_country: Optional[str] = None
    job_posted_at_datetime_utc: Optional[str] = None
    job_apply_link: str
