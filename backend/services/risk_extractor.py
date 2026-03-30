import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_risks_and_obligations(text: str) -> dict:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": """You are a legal document analyzer. Extract key information from legal documents and return ONLY a valid JSON object with no extra text, no markdown, no code blocks.

Return exactly this structure:
{
  "obligations": ["obligation 1", "obligation 2"],
  "deadlines": [
    {"date": "YYYY-MM-DD or null", "description": "deadline description"}
  ],
  "risk_flags": [
    {"clause": "exact clause text", "level": "high or medium or low", "explanation": "why this is risky in simple language"}
  ]
}"""
            },
            {
                "role": "user",
                "content": f"Extract obligations, deadlines, and risk flags from this legal document:\n\n{text[:6000]}"
            }
        ],
        max_tokens=1500
    )

    raw = response.choices[0].message.content.strip()

    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        result = {
            "obligations": [],
            "deadlines": [],
            "risk_flags": []
        }

    return result