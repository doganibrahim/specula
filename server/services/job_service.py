import json
import os
import requests
from typing import List, Optional
from datetime import datetime, timedelta
from server.models import JobPost
from server.config import settings

CACHE_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "cache.json")

def _load_cache() -> List[dict]:
    if not os.path.exists(CACHE_FILE):
        return []
    try:
        with open(CACHE_FILE, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def _save_cache(cache_data: List[dict]):
    os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)
    with open(CACHE_FILE, "w") as f:
        json.dump(cache_data, f, indent=4)

def _is_cache_valid(entry: dict, query: str) -> bool:
    # Basic check: matching query and not expired (24h)
    if entry.get("query", "").lower() != query.lower():
        return False
    
    timestamp = entry.get("timestamp")
    if not timestamp:
        return False
        
    cached_time = datetime.fromisoformat(timestamp)
    if datetime.utcnow() - cached_time > timedelta(hours=24):
        return False
        
    return True

def search_jobs(query: str) -> List[JobPost]:
    cache = _load_cache()
    
    # Check cache
    for entry in cache:
        if _is_cache_valid(entry, query):
            print(f"Cache hit for query: {query}")
            # Convert cached dicts back to JobPost objects
            return [JobPost(**job) for job in entry["results"]]

    print(f"Cache miss for query: {query}. Fetching from API...")
    
    # Fetch from API
    url = f"https://{settings.RAPIDAPI_HOST}/search"
    headers = {
        "X-RapidAPI-Key": settings.RAPIDAPI_KEY,
        "X-RapidAPI-Host": settings.RAPIDAPI_HOST
    }
    params = {"query": query, "page": "1", "num_pages": "1"}

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        
        job_posts = []
        if "data" in data:
            for item in data["data"]:
                # Map fields safely
                job = JobPost(
                    job_id=item.get("job_id"),
                    employer_name=item.get("employer_name"),
                    job_title=item.get("job_title"),
                    job_description=item.get("job_description"),
                    job_city=item.get("job_city"),
                    job_country=item.get("job_country"),
                    job_posted_at_datetime_utc=item.get("job_posted_at_datetime_utc"),
                    job_apply_link=item.get("job_apply_link")
                )
                job_posts.append(job)
        
        # Update cache
        new_entry = {
            "query": query,
            "timestamp": datetime.utcnow().isoformat(),
            "results": [job.dict() for job in job_posts]
        }
        
        # Remove old entries for same query if any exist? 
        # For simplicity, we just append. In a real app we'd clean up or update index.
        # Let's filter out old exact query matches to avoid dupes
        cache = [e for e in cache if e.get("query", "").lower() != query.lower()]
        cache.append(new_entry)
        _save_cache(cache)
        
        return job_posts

    except requests.RequestException as e:
        print(f"API Request failed: {e}")
        raise e
