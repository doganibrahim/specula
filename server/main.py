from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel
from .services.job_service import search_jobs

app = FastAPI(
    title="Specula API",
    description="Backend service for Job Market Intelligence Tool",
    version="0.1.0"
)

# frontend access permission
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"system": "Specula", "status": "operational", "mode": "scanning"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/v1/jobs/search")
def search_jobs_endpoint(query: str):
    try:
        jobs = search_jobs(query)
        # Convert Pydantic models to dicts for JSON response
        return {"status": "success", "count": len(jobs), "data": [job.dict() for job in jobs]}
    except Exception as e:
        print(f"Error processing request: {e}")
        return {"status": "error", "message": str(e)}

class AnalyzeRequest(BaseModel):
    descriptions: list[str]

@app.post("/api/v1/analyze")
def analyze_market(request: AnalyzeRequest):
    try:
        from server.services.llm_service import MarketAnalyzer
        analyzer = MarketAnalyzer()
        data = analyzer.analyze_skills(request.descriptions)
        return {"status": "success", "data": data}
    except Exception as e:
        print(f"Analysis failed: {e}")
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)