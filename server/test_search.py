import sys
import os

# Ensure server package can be imported
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from server.services.job_service import search_jobs

def main():
    print("Testing Job Search Service...")
    query = "Python Developer"
    try:
        results = search_jobs(query)
        print(f"Success! Found {len(results)} jobs.")
        for job in results[:2]:
            print(f"- {job.job_title} at {job.employer_name}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
