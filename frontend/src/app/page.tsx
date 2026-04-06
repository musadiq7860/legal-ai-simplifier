"use client";

import Link from "next/link";
import { MarqueeStrip } from "@/components/MarqueeStrip";
import { FeatureCard } from "@/components/FeatureCard";

const features = [
  {
    icon: "summary",
    title: "Plain-Language Summary",
    description:
      "Converts complex legal jargon into clear, simple language anyone can understand in seconds.",
  },
  {
    icon: "risk",
    title: "Risk Detection",
    description:
      "Automatically identifies high-risk clauses like hidden penalties, auto-renewals, and unfair terms.",
  },
  {
    icon: "obligations",
    title: "Obligations & Deadlines",
    description:
      "Extracts every obligation and deadline so you never miss a critical date or responsibility.",
  },
  {
    icon: "classify",
    title: "Clause Classification",
    description:
      "AI-powered legal BERT model classifies each clause by type — payment, penalty, obligation, deadline.",
  },
  {
    icon: "security",
    title: "Private & Secure",
    description:
      "Your documents are encrypted, stored in private buckets, and protected by row-level security.",
  },
];

const stats = [
  { value: "70B", label: "AI Parameters" },
  { value: "<10s", label: "Analysis Time" },
  { value: "99.9%", label: "Accuracy Rate" },
  { value: "256-bit", label: "Encryption" },
];

export default function HomePage() {
  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div className="grid-texture" />

        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            background:
              "radial-gradient(circle, rgba(245, 230, 66, 0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div className="fade-in-up" style={{ marginBottom: 32 }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.7rem",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--accent)",
                padding: "6px 16px",
                border: "1px solid rgba(245, 230, 66, 0.3)",
                borderRadius: 100,
                background: "rgba(245, 230, 66, 0.06)",
              }}
            >
              Powered by LLaMA 3.3 70B
            </span>
          </div>

          {/* Headline */}
          <h1
            className="fade-in-up fade-in-up-delay-1"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Understand Any
            <br />
            <span style={{ color: "var(--accent)" }}>Legal Document</span>
            <br />
            in Seconds.
          </h1>

          {/* Subheading */}
          <p
            className="fade-in-up fade-in-up-delay-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.1rem",
              lineHeight: 1.7,
              color: "var(--text-secondary)",
              maxWidth: 600,
              margin: "0 auto 40px",
            }}
          >
            Upload any contract, rental agreement, or government notice — AI
            instantly converts it into plain language, flags risks, and extracts
            every deadline.
          </p>

          {/* CTAs */}
          <div
            className="fade-in-up fade-in-up-delay-3"
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/upload" className="btn-accent">
              Analyze a Document
            </Link>
            <Link href="/sign-up" className="btn-ghost">
              Create Account
            </Link>
          </div>

          {/* Stats */}
          <div
            className="fade-in-up fade-in-up-delay-4"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 1,
              marginTop: 80,
              background: "var(--black-border)",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "var(--black-card)",
                  padding: "24px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--accent)",
                    marginBottom: 4,
                  }}
                >
                  {stat.value}
                </div>
                <div className="label-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <MarqueeStrip />

      {/* Features Section */}
      <section
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "100px 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <span className="label-mono" style={{ color: "var(--accent)" }}>
            Capabilities
          </span>
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginTop: 12,
            }}
          >
            Everything You Need to
            <br />
            <span style={{ color: "var(--accent)" }}>
              Decode Legal Language
            </span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={0.1 * (i + 1)} />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        style={{
          borderTop: "1px solid var(--black-border)",
          padding: "100px 24px",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <span className="label-mono" style={{ color: "var(--accent)" }}>
            How It Works
          </span>
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 2.5rem)",
              fontWeight: 700,
              marginTop: 12,
              marginBottom: 64,
            }}
          >
            Three Steps to Clarity
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 40,
            }}
          >
            {[
              {
                step: "01",
                title: "Upload",
                desc: "Drop your PDF — any legal document up to 50MB.",
              },
              {
                step: "02",
                title: "Analyze",
                desc: "AI reads, chunks, and processes every clause in seconds.",
              },
              {
                step: "03",
                title: "Understand",
                desc: "Get a plain-language summary with flagged risks and deadlines.",
              },
            ].map((item) => (
              <div key={item.step}>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    color: "var(--accent)",
                    opacity: 0.3,
                    marginBottom: 16,
                  }}
                >
                  {item.step}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.3rem",
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--black-border)",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            letterSpacing: "0.06em",
            color: "var(--text-muted)",
          }}
        >
          2026 Lex.AI — AI-Powered Legal Document Simplifier
        </p>
      </footer>
    </div>
  );
}
