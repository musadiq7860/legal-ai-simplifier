# AI Legal Document Simplifier ⚖️

Upload any legal document — rental agreement, contract, government notice — and AI instantly converts it into plain language.

## Features
- Plain-language summary of full document
- Key obligations and deadlines extracted automatically
- High-risk clause detection (payment penalties, hidden fees)
- Urdu language support (Phase 2)
- Document comparison — old vs new contract (Phase 3)

## Privacy & Security
- Private Supabase Storage with row-level security
- JWT auth on every API call
- User-controlled document deletion

## Stack
- **Frontend:** Next.js 14 + Tailwind CSS → Vercel
- **Backend:** FastAPI (Python) → HuggingFace Spaces (Docker)
- **AI:** Groq LLaMA 3.3 70B + DistilBERT
- **Database:** Supabase Postgres + Storage + Auth

## Phases
- Phase 1: Upload → Summary + Obligations + Risk Flags
- Phase 2: Urdu language support
- Phase 3: Document comparison