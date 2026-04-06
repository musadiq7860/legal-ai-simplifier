"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(8, 8, 8, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--black-border)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--text-primary)",
            }}
          >
            Lex
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--black)",
              background: "var(--accent)",
              padding: "2px 8px",
              borderRadius: 4,
              letterSpacing: "0.05em",
            }}
          >
            .AI
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {user && (
            <>
              <Link
                href="/upload"
                style={{
                  textDecoration: "none",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  color: isActive("/upload")
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                  transition: "color 0.2s",
                }}
              >
                Upload
              </Link>
              <Link
                href="/history"
                style={{
                  textDecoration: "none",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  color: isActive("/history")
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                  transition: "color 0.2s",
                }}
              >
                History
              </Link>
            </>
          )}

          {!loading && (
            <>
              {user ? (
                <button
                  onClick={signOut}
                  className="btn-ghost"
                  style={{
                    padding: "8px 20px",
                    fontSize: "0.75rem",
                  }}
                >
                  Sign Out
                </button>
              ) : (
                <Link href="/sign-in" className="btn-accent" style={{ padding: "8px 20px", fontSize: "0.75rem" }}>
                  Sign In
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
