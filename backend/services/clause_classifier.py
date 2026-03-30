from transformers import pipeline
from typing import List

classifier = None

def load_classifier():
    global classifier
    if classifier is None:
        classifier = pipeline(
            "text-classification",
            model="nlpaueb/legal-bert-base-uncased",
            truncation=True,
            max_length=512
        )
    return classifier

def classify_clauses(text: str) -> List[dict]:
    model = load_classifier()

    sentences = [s.strip() for s in text.split(".") if len(s.strip()) > 30]
    sentences = sentences[:20]

    if not sentences:
        return []

    results = []
    for sentence in sentences:
        try:
            prediction = model(sentence)[0]
            results.append({
                "text": sentence,
                "label": prediction["label"].lower(),
                "confidence": round(prediction["score"], 3)
            })
        except Exception:
            continue

    return results