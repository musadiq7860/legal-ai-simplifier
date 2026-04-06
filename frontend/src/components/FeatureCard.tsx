"use client";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay?: number;
}

function IconSvg({ type }: { type: string }) {
  const style = {
    width: 32,
    height: 32,
    stroke: "var(--accent)",
    fill: "none",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "summary":
      return (
        <svg viewBox="0 0 24 24" style={style}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case "risk":
      return (
        <svg viewBox="0 0 24 24" style={style}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case "obligations":
      return (
        <svg viewBox="0 0 24 24" style={style}>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <path d="M9 14l2 2 4-4" />
        </svg>
      );
    case "classify":
      return (
        <svg viewBox="0 0 24 24" style={style}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      );
    case "security":
      return (
        <svg viewBox="0 0 24 24" style={style}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" style={style}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}

export function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <div
      className="glass-card fade-in-up"
      style={{
        padding: "32px 28px",
        animationDelay: `${delay}s`,
        opacity: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent top line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 28,
          right: 28,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, var(--accent), transparent)",
          opacity: 0.4,
        }}
      />

      <div style={{ marginBottom: 16 }}>
        <IconSvg type={icon} />
      </div>

      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "1.2rem",
          fontWeight: 600,
          marginBottom: 10,
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.88rem",
          lineHeight: 1.6,
          color: "var(--text-secondary)",
        }}
      >
        {description}
      </p>
    </div>
  );
}
