"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { getAnalysis } from "@/lib/api";

interface Deadline {
  date: string | null;
  description: string;
}

interface RiskFlag {
  clause: string;
  level: string;
  explanation: string;
}

interface ClauseLabel {
  text: string;
  label: string;
  confidence: number;
}

interface AnalysisData {
  id: string;
  document_id: string;
  summary: string;
  obligations: string[];
  deadlines: Deadline[];
  risk_flags: RiskFlag[];
  clause_labels: ClauseLabel[];
  created_at: string;
  documents: {
    filename: string;
    doc_type: string;
    created_at: string;
  };
}

export default function ResultsPage() {
  const { id } = useParams();
  const { user, session, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user || !session) {
      router.push("/sign-in");
      return;
    }

    const fetchAnalysis = async () => {
      try {
        const result = await getAnalysis(id as string, session.access_token);
        setData(result);
      } catch {
        setError("Analysis not found or you don't have access.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id, user, session, authLoading, router]);

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
          <div className="spinner" style={{ width: 40, height: 40, margin: "0 auto 16px" }} />
          <p className="label-mono">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="glass-card" style={{ padding: "48px", textAlign: "center" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 16px" }}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
          <h2 style={{ fontFamily: "var(--font-heading)", marginBottom: 8 }}>
            {error || "Not Found"}
          </h2>
          <button className="btn-ghost" onClick={() => router.push("/history")} style={{ marginTop: 16 }}>
            Go to History
          </button>
        </div>
      </div>
    );
  }

  const riskLevelClass = (level: string) => {
    switch (level.toLowerCase()) {
      case "high": return "risk-high";
      case "medium": return "risk-medium";
      case "low": return "risk-low";
      default: return "risk-low";
    }
  };

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
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <span className="label-mono" style={{ color: "var(--accent)" }}>
          Analysis Results
        </span>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2rem",
            fontWeight: 700,
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          {data.documents?.filename || "Document"}
        </h1>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <span className="label-mono">
            Type: {data.documents?.doc_type?.replace(/_/g, " ") || "general"}
          </span>
          <span className="label-mono">
            Analyzed: {new Date(data.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Summary */}
      <section className="glass-card fade-in-up" style={{ padding: "32px", marginBottom: 24 }}>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.3rem",
            fontWeight: 600,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          Plain-Language Summary
        </h2>
        <p
          style={{
            fontSize: "0.95rem",
            lineHeight: 1.8,
            color: "var(--text-secondary)",
            whiteSpace: "pre-wrap",
          }}
        >
          {data.summary}
        </p>
      </section>

      {/* Obligations */}
      {data.obligations && data.obligations.length > 0 && (
        <section className="glass-card fade-in-up fade-in-up-delay-1" style={{ padding: "32px", marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.3rem",
              fontWeight: 600,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            Obligations
          </h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {data.obligations.map((ob, i) => (
              <li
                key={i}
                style={{
                  padding: "12px 16px",
                  borderBottom: i < data.obligations.length - 1 ? "1px solid var(--black-border)" : "none",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  color: "var(--text-secondary)",
                  display: "flex",
                  gap: 12,
                }}
              >
                <span style={{ color: "var(--accent)", flexShrink: 0 }}>→</span>
                {ob}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Deadlines */}
      {data.deadlines && data.deadlines.length > 0 && (
        <section className="glass-card fade-in-up fade-in-up-delay-2" style={{ padding: "32px", marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.3rem",
              fontWeight: 600,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            Deadlines
          </h2>
          <div style={{ display: "grid", gap: 12 }}>
            {data.deadlines.map((dl, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                  background: "var(--black-light)",
                  borderRadius: 8,
                  border: "1px solid var(--black-border)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                    flex: 1,
                  }}
                >
                  {dl.description}
                </span>
                {dl.date && (
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.78rem",
                      color: "var(--accent)",
                      background: "rgba(245, 230, 66, 0.08)",
                      padding: "4px 12px",
                      borderRadius: 6,
                      whiteSpace: "nowrap",
                      marginLeft: 16,
                    }}
                  >
                    {dl.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Risk Flags */}
      {data.risk_flags && data.risk_flags.length > 0 && (
        <section className="glass-card fade-in-up fade-in-up-delay-3" style={{ padding: "32px", marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.3rem",
              fontWeight: 600,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            Risk Flags
          </h2>
          <div style={{ display: "grid", gap: 12 }}>
            {data.risk_flags.map((rf, i) => (
              <div
                key={i}
                style={{
                  padding: "16px",
                  background: "var(--black-light)",
                  borderRadius: 8,
                  border: "1px solid var(--black-border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontStyle: "italic",
                      color: "var(--text-muted)",
                      flex: 1,
                    }}
                  >
                    &ldquo;{rf.clause}&rdquo;
                  </span>
                  <span
                    className={riskLevelClass(rf.level)}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      padding: "4px 12px",
                      borderRadius: 6,
                      marginLeft: 12,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {rf.level}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                    color: "var(--text-secondary)",
                  }}
                >
                  {rf.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Clause Labels */}
      {data.clause_labels && data.clause_labels.length > 0 && (
        <section className="glass-card fade-in-up fade-in-up-delay-4" style={{ padding: "32px", marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.3rem",
              fontWeight: 600,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            Clause Classification
          </h2>
          <div style={{ display: "grid", gap: 12 }}>
            {data.clause_labels.map((cl, i) => (
              <div
                key={i}
                style={{
                  padding: "14px 16px",
                  background: "var(--black-light)",
                  borderRadius: 8,
                  border: "1px solid var(--black-border)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--accent)",
                    }}
                  >
                    {cl.label}
                  </span>
                  <span className="label-mono">
                    {(cl.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    color: "var(--text-secondary)",
                    marginBottom: 8,
                  }}
                >
                  {cl.text}
                </p>
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{ width: `${cl.confidence * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
        <button className="btn-ghost" onClick={() => router.push("/upload")}>
          ← Analyze Another
        </button>
        <button className="btn-ghost" onClick={() => router.push("/history")}>
          View History
        </button>
      </div>
    </div>
  );
}
