from google import genai
from server.config import settings

def list_models():
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        print("Fetching available models...")

        pager = client.models.list() 
        for model in pager:
            print(f"- {model.name}")
            
    except Exception as e:
        print(f"Error listing models: {e}")

if __name__ == "__main__":
    list_models()
