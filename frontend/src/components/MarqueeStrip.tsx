"use client";

const tags = [
  "Rental Agreement",
  "Employment Contract",
  "NDA",
  "Government Notice",
  "Terms of Service",
  "Privacy Policy",
  "Lease Agreement",
  "Loan Agreement",
  "Partnership Deed",
  "Power of Attorney",
  "Affidavit",
  "Memorandum",
  "Settlement Agreement",
  "Franchise Agreement",
  "IP License",
];

export function MarqueeStrip() {
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid var(--black-border)",
        borderBottom: "1px solid var(--black-border)",
        padding: "14px 0",
        background: "rgba(20, 20, 20, 0.4)",
      }}
    >
      <div className="marquee-track">
        {[...tags, ...tags].map((tag, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              padding: "6px 20px",
              marginRight: 8,
              border: "1px solid var(--black-border)",
              borderRadius: 100,
              whiteSpace: "nowrap",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--black-border)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
