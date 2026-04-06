"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { getAnalyses, deleteAnalysis } from "@/lib/api";

interface AnalysisItem {
  id: string;
  document_id: string;
  summary: string;
  risk_flags: { level: string }[];
  created_at: string;
  documents: {
    filename: string;
    doc_type: string;
    created_at: string;
  };
}

export default function HistoryPage() {
  const { user, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !session) {
      router.push("/sign-in");
      return;
    }

    const fetchHistory = async () => {
      try {
        const result = await getAnalyses(session.access_token);
        setAnalyses(result.analyses || []);
      } catch {
        console.error("Failed to fetch history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, session, authLoading, router]);

  const handleDelete = async (id: string) => {
    if (!session || !confirm("Delete this document and its analysis?")) return;
    setDeletingId(id);
    try {
      await deleteAnalysis(id, session.access_token);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const riskSummary = (flags: { level: string }[]) => {
    const high = flags?.filter((f) => f.level === "high").length || 0;
    const medium = flags?.filter((f) => f.level === "medium").length || 0;
    if (high > 0) return { text: `${high} high risk`, className: "risk-high" };
    if (medium > 0) return { text: `${medium} medium risk`, className: "risk-medium" };
    return { text: "Low risk", className: "risk-low" };
  };

  if (loading || authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            className="spinner"
            style={{ width: 40, height: 40, margin: "0 auto 16px" }}
          />
          <p className="label-mono">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: 100,
        padding: "100px 24px 60px",
        maxWidth: 900,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 48,
        }}
      >
        <div>
          <span className="label-mono" style={{ color: "var(--accent)" }}>
            Document History
          </span>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2.5rem",
              fontWeight: 700,
              marginTop: 8,
            }}
          >
            Your Analyses
          </h1>
        </div>
        <Link href="/upload" className="btn-accent" style={{ padding: "10px 24px", fontSize: "0.78rem" }}>
          + New Analysis
        </Link>
      </div>

      {analyses.length === 0 ? (
        <div className="glass-card" style={{ padding: "80px 40px", textAlign: "center" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 20px" }}><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
          <h3
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            No Analyses Yet
          </h3>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
              marginBottom: 32,
            }}
          >
            Upload your first legal document to get started.
          </p>
          <Link href="/upload" className="btn-accent">
            Upload a Document →
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {analyses.map((analysis) => {
            const risk = riskSummary(analysis.risk_flags);
            return (
              <div
                key={analysis.id}
                className="glass-card"
                style={{
                  padding: "24px 28px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "border-color 0.2s",
                  cursor: "pointer",
                }}
                onClick={() => router.push(`/results/${analysis.id}`)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--black-border)";
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 8,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                    <h3
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {analysis.documents?.filename || "Untitled"}
                    </h3>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      alignItems: "center",
                    }}
                  >
                    <span className="label-mono">
                      {analysis.documents?.doc_type?.replace(/_/g, " ") || "general"}
                    </span>
                    <span className="label-mono">
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </span>
                    <span
                      className={risk.className}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        padding: "3px 10px",
                        borderRadius: 6,
                      }}
                    >
                      {risk.text}
                    </span>
                  </div>
                </div>

                <button
                  className="btn-ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(analysis.id);
                  }}
                  disabled={deletingId === analysis.id}
                  style={{
                    padding: "8px 16px",
                    fontSize: "0.72rem",
                    color: deletingId === analysis.id ? "var(--text-muted)" : "#ef4444",
                    borderColor: "rgba(239, 68, 68, 0.3)",
                    marginLeft: 16,
                  }}
                >
                  {deletingId === analysis.id ? "..." : "Delete"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
