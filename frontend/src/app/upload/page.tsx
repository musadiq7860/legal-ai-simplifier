"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { analyzeDocument } from "@/lib/api";

const docTypes = [
  { value: "general", label: "General Document" },
  { value: "rental_agreement", label: "Rental Agreement" },
  { value: "contract", label: "Contract" },
  { value: "employment_contract", label: "Employment Contract" },
  { value: "notice", label: "Government Notice" },
  { value: "government_form", label: "Government Form" },
];

export default function UploadPage() {
  const { user, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState("general");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  // Redirect if not logged in
  if (!authLoading && !user) {
    router.push("/sign-in");
    return null;
  }

  const handleFile = (f: File) => {
    setError("");
    if (!f.name.endsWith(".pdf")) {
      setError("Only PDF files are supported");
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setError("File size exceeds 50MB limit");
      return;
    }
    setFile(f);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const handleAnalyze = async () => {
    if (!file || !session) return;
    setUploading(true);
    setError("");
    setProgress("Extracting text from PDF...");

    try {
      const token = session.access_token;
      setProgress("Running AI analysis — this may take 15-30 seconds...");
      const result = await analyzeDocument(file, docType, token);
      router.push(`/results/${result.analysis_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setUploading(false);
      setProgress("");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: 100,
        padding: "100px 24px 60px",
        maxWidth: 700,
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <span className="label-mono" style={{ color: "var(--accent)" }}>
          Document Upload
        </span>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2.5rem",
            fontWeight: 700,
            marginTop: 8,
          }}
        >
          Analyze a Legal Document
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            marginTop: 12,
            fontSize: "0.95rem",
          }}
        >
          Upload any PDF and our AI will simplify it for you.
        </p>
      </div>

      {error && (
        <div
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 24,
            fontSize: "0.85rem",
            color: "#ef4444",
          }}
        >
          {error}
        </div>
      )}

      {/* Drop Zone */}
      <div
        className={`dropzone ${dragging ? "active" : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          marginBottom: 24,
          opacity: uploading ? 0.5 : 1,
          pointerEvents: uploading ? "none" : "auto",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />

        {file ? (
          <div>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 12px" }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                color: "var(--accent)",
                marginBottom: 4,
              }}
            >
              {file.name}
            </p>
            <p className="label-mono">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 12px" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--text-secondary)",
                marginBottom: 8,
              }}
            >
              Drag & drop your PDF here
            </p>
            <p className="label-mono">Or click to browse — max 50MB</p>
          </div>
        )}
      </div>

      {/* Document Type Selector */}
      <div style={{ marginBottom: 32 }}>
        <label
          className="label-mono"
          style={{ marginBottom: 8, display: "block" }}
        >
          Document Type
        </label>
        <select
          className="select-dark"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
          disabled={uploading}
        >
          {docTypes.map((dt) => (
            <option key={dt.value} value={dt.value}>
              {dt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Analyze Button */}
      <button
        className="btn-accent"
        onClick={handleAnalyze}
        disabled={!file || uploading}
        style={{
          width: "100%",
          opacity: !file || uploading ? 0.5 : 1,
        }}
      >
        {uploading ? (
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="spinner" />
            {progress}
          </span>
        ) : (
          "Analyze Document →"
        )}
      </button>

      {uploading && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              fontStyle: "italic",
            }}
          >
            The AI is reading your document. Please don&apos;t close this page.
          </p>
        </div>
      )}
    </div>
  );
}
