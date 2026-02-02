from google import genai
from google.genai import types
import json
from server.config import settings

class MarketAnalyzer:
    def __init__(self):
        try:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        except Exception as e:
            print(f"Failed to initialize Gemini Client: {e}")
            self.client = None

    def analyze_skills(self, job_descriptions: list[str]) -> dict:
        if not self.client or not job_descriptions:
            return {}

        prompt = """
        You are a Data Scientist analyzing job market trends. 
        Extract the top 15 technical 'Hard Skills' (technologies, languages, frameworks) mentioned in these descriptions. 
        
        Return ONLY a JSON object with the skill name and its frequency count. 
        Example: {'React': 12, 'Python': 8}. 
        Normalize names (e.g., 'Node.js' and 'NodeJS' should count as one).
        """
        
        # Reduce to 10 descriptions to save tokens
        combined_text = "\n\n".join(job_descriptions[:10]) 

        # List of models to try in order of preference
        models_to_try = [
            'gemini-2.5-flash',
            'gemini-2.0-flash',
            'gemini-2.0-flash-001',
            'gemini-1.5-flash',
        ]

        for model_name in models_to_try:
            try:
                print(f"Attempting analysis with model: {model_name}...")
                response = self.client.models.generate_content(
                    model=model_name,
                    contents=[prompt, combined_text],
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json"
                    )
                )
                print(f"Success with {model_name}!")
                return json.loads(response.text)
            except Exception as e:
                print(f"Failed with {model_name}: {e}")
                continue
        
        print("All AI models failed to generate a response (Quota or Error).")
        return {}
