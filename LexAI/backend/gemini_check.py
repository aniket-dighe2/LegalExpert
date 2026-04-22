from dotenv import load_dotenv
import os
from google import genai

load_dotenv()

key = os.getenv("GEMINI_API_KEY")
print("KEY LOADED:", key)

client = genai.Client(api_key=key)

response = client.models.generate_content(
    model="models/gemini-flash-latest",
    contents="Say hello in one sentence"
)


print("RESPONSE:", response.text)

