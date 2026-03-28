from typing import List

def chunk_text(text: str, max_words: int = 2000) -> List[str]:
    words = text.split()
    chunks = []
    for i in range(0, len(words), max_words):
        chunk = " ".join(words[i:i + max_words])
        chunks.append(chunk)
    return chunks

def count_words(text: str) -> int:
    return len(text.split())