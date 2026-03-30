import os
from groq import Groq
from services.chunker import chunk_text
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def summarize_chunk(chunk: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a legal document assistant. Convert legal language into simple, clear English that anyone can understand. Be concise."
            },
            {
                "role": "user",
                "content": f"Summarize this section of a legal document in simple language:\n\n{chunk}"
            }
        ],
        max_tokens=500
    )
    return response.choices[0].message.content

def merge_summaries(summaries: list[str]) -> str:
    merged = "\n\n".join(summaries)
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a legal document assistant. Combine multiple section summaries into one clear, concise final summary in simple English."
            },
            {
                "role": "user",
                "content": f"Combine these section summaries into one final summary:\n\n{merged}"
            }
        ],
        max_tokens=800
    )
    return response.choices[0].message.content

def summarize_document(text: str) -> str:
    chunks = chunk_text(text, max_words=2000)

    if len(chunks) == 1:
        return summarize_chunk(chunks[0])

    chunk_summaries = [summarize_chunk(chunk) for chunk in chunks]
    return merge_summaries(chunk_summaries)