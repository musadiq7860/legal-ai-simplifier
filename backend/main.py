from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from routes.health import router as health_router
from routes.analyze import router as analyze_router
from routes.history import router as history_router

load_dotenv()

app = FastAPI(
    title="Legal AI Simplifier API",
    description="Converts legal documents into plain language summaries",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOWED_ORIGINS", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(analyze_router)
app.include_router(history_router)

@app.get("/")
def root():
    return {"message": "Legal AI Simplifier API is running"}