from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routes.health import router as health_router
from routes.analyze import router as analyze_router
from routes.history import router as history_router

load_dotenv()

app = FastAPI(
    title="Lex.AI — Legal Document Simplifier API",
    description="Converts legal documents into plain language summaries",
    version="1.0.0",
)

# Support comma-separated origins
origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(analyze_router)
app.include_router(history_router)


@app.get("/")
def root():
    return {"message": "Lex.AI — Legal Document Simplifier API is running"}